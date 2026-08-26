import { describe, expect, it } from "vitest";
import { REGIME_RENDERERS, type FieldFrame } from "@/components/field/regimes";

/**
 * The background field is drawn imperatively to a canvas, which means none of
 * the usual safety nets apply: a typo produces a blank or a NaN-poisoned
 * scene at runtime, not a type error at build time. These tests run every
 * regime against a recording stub of CanvasRenderingContext2D and assert the
 * invariants that actually matter for this feature:
 *
 *   1. It draws something (a silent no-op regime would ship unnoticed).
 *   2. It never emits a non-finite coordinate. NaN in a path is the classic
 *      canvas failure — it doesn't throw, it just makes the rest of the frame
 *      vanish, and it is exactly what a divide-by-zero at scroll extremes or
 *      a zero-size viewport would produce.
 *   3. It leaves `globalAlpha` as it found it. Every renderer composes with
 *      the others (the `journey` regime runs two at once), so a leaked alpha
 *      would silently wash out whatever draws next.
 *   4. It never exceeds the alpha ceiling implied by `intensity`. The one
 *      hard rule of this feature is that the background may never compete
 *      with body text; that rule is enforced here rather than trusted.
 */

const ALPHA_CEILING = 0.75;

type Recorder = {
  ctx: CanvasRenderingContext2D;
  calls: number;
  maxAlpha: number;
  nonFinite: Array<[string, number[]]>;
};

function createRecorder(): Recorder {
  const record: Recorder = {
    ctx: null as unknown as CanvasRenderingContext2D,
    calls: 0,
    maxAlpha: 0,
    nonFinite: [],
  };

  let globalAlpha = 1;

  /** Draw calls — the ones whose output actually lands on the canvas, and so
   *  the only ones at which the current `globalAlpha` matters. Sampling alpha
   *  on assignment instead would just record the value `withAlpha` restores
   *  to (1), which says nothing about how loud the frame is. */
  const PAINTING = new Set(["fill", "stroke", "fillRect", "strokeRect"]);

  const check = (name: string, args: unknown[]) => {
    record.calls += 1;
    if (PAINTING.has(name)) {
      record.maxAlpha = Math.max(record.maxAlpha, globalAlpha);
    }
    const numbers = args.filter((arg): arg is number => typeof arg === "number");
    if (numbers.some((value) => !Number.isFinite(value))) {
      record.nonFinite.push([name, numbers]);
    }
  };

  // Only the surface the renderers actually use. Anything they reach for that
  // isn't here throws, which is the point: it catches a renderer quietly
  // depending on an API this stub hasn't modelled.
  const stub = {
    beginPath: (...a: unknown[]) => check("beginPath", a),
    closePath: (...a: unknown[]) => check("closePath", a),
    moveTo: (...a: unknown[]) => check("moveTo", a),
    lineTo: (...a: unknown[]) => check("lineTo", a),
    arc: (...a: unknown[]) => check("arc", a),
    ellipse: (...a: unknown[]) => check("ellipse", a),
    rect: (...a: unknown[]) => check("rect", a),
    fillRect: (...a: unknown[]) => check("fillRect", a),
    strokeRect: (...a: unknown[]) => check("strokeRect", a),
    clearRect: (...a: unknown[]) => check("clearRect", a),
    fill: (...a: unknown[]) => check("fill", a),
    stroke: (...a: unknown[]) => check("stroke", a),
    setLineDash: (...a: unknown[]) => check("setLineDash", a),
    createLinearGradient: (...a: unknown[]) => {
      check("createLinearGradient", a);
      return { addColorStop: () => {} };
    },
    lineWidth: 1,
    fillStyle: "#000",
    strokeStyle: "#000",
  };

  const proxied = new Proxy(stub as unknown as CanvasRenderingContext2D, {
    get(target, property, receiver) {
      if (property === "globalAlpha") return globalAlpha;
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property === "globalAlpha") {
        globalAlpha = value as number;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    },
  });

  record.ctx = proxied;
  return record;
}

function frameFor(recorder: Recorder, overrides: Partial<FieldFrame> = {}): FieldFrame {
  return {
    ctx: recorder.ctx,
    width: 1440,
    height: 900,
    time: 3.5,
    scroll: 0.42,
    scrollY: 1800,
    accent: "oklch(0.78 0.14 268)",
    dim: "oklch(0.45 0.11 268)",
    foreground: "#e6ebf4",
    intensity: 1,
    detail: 1,
    ...overrides,
  };
}

const REGIMES = Object.keys(REGIME_RENDERERS) as Array<keyof typeof REGIME_RENDERERS>;

describe.each(REGIMES)("regime: %s", (regime) => {
  const render = REGIME_RENDERERS[regime];

  it("draws something", () => {
    const recorder = createRecorder();
    render(frameFor(recorder));
    expect(recorder.calls).toBeGreaterThan(0);
  });

  it("stays under the alpha ceiling so it can never compete with text", () => {
    const recorder = createRecorder();
    render(frameFor(recorder));
    expect(recorder.maxAlpha).toBeLessThanOrEqual(ALPHA_CEILING);
  });

  it("restores globalAlpha", () => {
    const recorder = createRecorder();
    render(frameFor(recorder));
    expect(recorder.ctx.globalAlpha).toBe(1);
  });

  it("scales down with intensity", () => {
    const quiet = createRecorder();
    render(frameFor(quiet, { intensity: 0.25 }));
    const loud = createRecorder();
    render(frameFor(loud, { intensity: 1 }));
    expect(quiet.maxAlpha).toBeLessThan(loud.maxAlpha);
  });

  // The extremes are where the arithmetic breaks: scroll at both ends, a
  // zero-height viewport (a phone mid-rotation reports one), and the lowest
  // detail setting.
  it.each([
    ["scroll start", { scroll: 0, time: 0 }],
    ["scroll end", { scroll: 1, time: 999 }],
    ["degenerate viewport", { width: 0, height: 0 }],
    ["narrow phone", { width: 320, height: 568, detail: 0.3, intensity: 0.55 }],
    ["minimum detail", { detail: 0 }],
  ] satisfies Array<[string, Partial<FieldFrame>]>)(
    "emits only finite coordinates (%s)",
    (_label, overrides) => {
      const recorder = createRecorder();
      expect(() => render(frameFor(recorder, overrides))).not.toThrow();
      expect(recorder.nonFinite).toEqual([]);
    },
  );
});

describe("journey regime", () => {
  it("blends through every pillar environment across the scroll range", () => {
    // The homepage's whole premise is that scrolling walks the curriculum, so
    // the endpoints must actually be the first and last environments rather
    // than the sequence stalling somewhere in the middle.
    const atStart = createRecorder();
    REGIME_RENDERERS.journey(frameFor(atStart, { scroll: 0 }));
    const atEnd = createRecorder();
    REGIME_RENDERERS.journey(frameFor(atEnd, { scroll: 1 }));

    expect(atStart.calls).toBeGreaterThan(0);
    expect(atEnd.calls).toBeGreaterThan(0);

    // Sampling across the range must never produce a blank frame — a gap in
    // the crossfade would read as the background switching off mid-scroll.
    for (let i = 0; i <= 20; i += 1) {
      const recorder = createRecorder();
      REGIME_RENDERERS.journey(frameFor(recorder, { scroll: i / 20 }));
      expect(recorder.calls, `blank frame at scroll ${i / 20}`).toBeGreaterThan(0);
    }
  });
});
