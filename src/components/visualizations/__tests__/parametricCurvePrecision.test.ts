/* Components are constructed with `createElement` rather than written as JSX for the
   reason `src/components/mdx/__tests__/Term.test.ts` documents: vitest's `include` is
   `src/**\/*.test.ts`, and `.ts` files are not parsed for JSX. */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { roundFrames } from "@/components/visualizations/ParametricCurve";
import { ParametricCurveView, type CurveFrame } from "@/components/visualizations/ParametricCurveView";

/**
 * ============================================================
 * Rounding samples must not redraw the figure
 * ============================================================
 * `ParametricCurve` is a Server Component whose only job is to round `frames`
 * before they are serialized into the flight payload of the Client Component
 * that draws them. It exists because the numbers were arriving at full
 * double precision — `{"x":3.8523489932885906,"y":-0.9880153329307066}`,
 * ~55 bytes a point — and 39% of the site's heaviest document (1,565KB) was
 * decimal places no renderer reads: the view emits its path with
 * `toFixed(1)` in a 480 x 220 viewBox and its tick labels with
 * `toPrecision(3)`.
 *
 * That argument is only worth anything if the rounding is invisible, so this
 * file renders each figure both ways and compares the markup. Two assertions,
 * because there are two different promises:
 *
 *   - **Text is exact.** Tick labels, and therefore the left gutter (which
 *     the view sizes from the character length of the widest y label, and
 *     which sets the plot width), must be byte-identical. This is the one
 *     that catches the interesting failures: an earlier version of the
 *     rounding relabelled a y axis from "2.6×10⁻⁷" to "0" and handed the plot
 *     58 extra viewBox units.
 *   - **Geometry is within the renderer's own resolution.** Not byte-equal:
 *     a coordinate already sitting near a `toFixed(1)` boundary can be
 *     rounded across it, and then the emitted number moves by exactly one
 *     step. One step is the smallest difference this component can express
 *     at all — 0.1 viewBox units, about 0.15 CSS pixels on the widest desktop
 *     figure — so "no more than one step" is the strongest statement that is
 *     true, and a stronger one would be false rather than safer.
 *
 * The cases are the real corpus shapes, not invented ones: each is the domain
 * that broke a previous attempt.
 */

/** The view's `toFixed(1)`, i.e. the smallest difference it can emit. */
const RENDER_STEP = 0.1;

function frame(paramLabel: string, series: CurveFrame["series"]): CurveFrame {
  return { paramLabel, series };
}

/** Hard-sphere s-wave cross section, sinc²(ka) over ka in [0.02, 4]. Its y
 *  domain starts at 2.6e-7 — a zero of sinc² the sample grid just misses —
 *  against a maximum of ~1, so the bottom tick is scientific notation and the
 *  gutter is nearly twice its usual width. */
const CROSS_SECTION: CurveFrame[] = [
  frame("hard-sphere s-wave cross section, a = 1", [
    {
      label: "σ₀(ka) / (4πa²)",
      color: "brand",
      points: Array.from({ length: 200 }, (_, i) => {
        const ka = 0.02 + (i / 199) * (4 - 0.02);
        return { x: ka, y: Math.sin(-ka) ** 2 / (ka * ka) };
      }),
    },
  ]),
];

/** Free wave against the actual hard-sphere wave, plus the wall marker that
 *  opts out of the domain. The y extremes are ±0.99999994, so the midpoint
 *  tick is a cancellation residue printed as "3.7×10⁻⁸" — a label that only
 *  survives if the endpoints are left exactly alone. */
const RADIAL_WAVE: CurveFrame[] = Array.from({ length: 8 }, (_, i) => {
  const ka = 0.02 + (i / 7) * (4 - 0.02);
  const rPoints = Array.from({ length: 150 }, (_, j) => (j / 149) * 7);
  return frame(`ka = ${ka.toFixed(2)}`, [
    { label: "free wave", color: "muted", points: rPoints.map((r) => ({ x: r, y: Math.sin(ka * r) })) },
    {
      label: "actual wave",
      color: "brand",
      points: rPoints.map((r) => ({ x: r, y: r < 1 ? 0 : Math.sin(ka * r - ka) })),
    },
    {
      label: "hard wall (r = a)",
      color: "warning",
      excludeFromDomain: true,
      points: [
        { x: 1, y: -1.4 },
        { x: 1, y: 1.4 },
      ],
    },
  ]);
});

/** The crosstalk shape: a narrow domain a long way from zero (0.98446 to 1),
 *  where a fixed number of decimal places would be far too coarse and the
 *  precision has to come from the span. */
const NARROW_DOMAIN: CurveFrame[] = [
  frame("ε = 0.10", [
    {
      label: "F(ε)",
      color: "brand",
      points: Array.from({ length: 60 }, (_, i) => {
        const x = (i / 59) * 0.25;
        return { x, y: Math.cos(x / 2) ** 2 };
      }),
    },
  ]),
];

/** A path-integral amplitude domain, where every value is ~1e-27 and the
 *  tolerance's decimal places have run out of digits entirely. */
const TINY_MAGNITUDES: CurveFrame[] = [
  frame("ħ-scale amplitudes", [
    {
      label: "|A|",
      color: "brand",
      points: Array.from({ length: 60 }, (_, i) => {
        const x = (i / 59) * 2;
        return { x: x * 1e-27, y: Math.exp(-x * x) * 1.0545718e-27 };
      }),
    },
  ]),
];

const CASES: Array<[string, CurveFrame[]]> = [
  ["a scientific-notation y endpoint (hard-sphere cross section)", CROSS_SECTION],
  ["a cancellation-residue midpoint tick (free vs. actual wave)", RADIAL_WAVE],
  ["a narrow domain far from zero (crosstalk fidelity)", NARROW_DOMAIN],
  ["values whose whole magnitude is below the tolerance (ħ-scale)", TINY_MAGNITUDES],
];

function render(frames: CurveFrame[]): string {
  return renderToStaticMarkup(
    createElement(ParametricCurveView, {
      frames,
      sliderLabel: "ka",
      ariaLabel: "test figure",
      xAxisLabel: "x",
      yAxisLabel: "y",
    })
  );
}

const textsOf = (markup: string) => [...markup.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
const pathsOf = (markup: string) => [...markup.matchAll(/<path[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
const numbersOf = (d: string) => [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));

describe.each(CASES)("rounding %s", (_name, frames) => {
  const exact = render(frames);
  const rounded = render(roundFrames(frames));

  it("changes no rendered text, so no tick label and no gutter width moves", () => {
    expect(textsOf(rounded)).toEqual(textsOf(exact));
  });

  it("moves no path coordinate further than the renderer's own step", () => {
    const before = pathsOf(exact);
    const after = pathsOf(rounded);
    expect(after.length).toBe(before.length);

    const offenders: string[] = [];
    for (let i = 0; i < before.length; i++) {
      const b = numbersOf(before[i]);
      const a = numbersOf(after[i]);
      if (b.length !== a.length) {
        offenders.push(`path ${i}: ${b.length} coordinates became ${a.length}`);
        continue;
      }
      for (let j = 0; j < b.length; j++) {
        // A tolerance on the comparison itself, not on the promise: these are
        // decimal strings the view already rounded, so equality is exact and
        // 1e-9 only absorbs the parse.
        if (Math.abs(b[j] - a[j]) > RENDER_STEP + 1e-9) {
          offenders.push(`path ${i} coordinate ${j}: ${b[j]} -> ${a[j]}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("leaves the axis endpoints themselves untouched", () => {
    // The rule the text assertion depends on, stated directly so a failure
    // names the cause rather than the symptom.
    const flat = (fs: CurveFrame[]) =>
      fs
        .flatMap((f) => f.series.filter((s) => !s.excludeFromDomain))
        .flatMap((s) => s.points);
    const bounds = (points: Array<{ x: number; y: number }>) => ({
      xMin: Math.min(...points.map((p) => p.x)),
      xMax: Math.max(...points.map((p) => p.x)),
      yMin: Math.min(...points.map((p) => p.y)),
      yMax: Math.max(...points.map((p) => p.y)),
    });
    expect(bounds(flat(roundFrames(frames)))).toEqual(bounds(flat(frames)));
  });

  it("actually shrinks the payload it is here to shrink", () => {
    // Guards the guard: every assertion above passes trivially if the
    // rounding stops doing anything.
    const exactBytes = JSON.stringify(frames).length;
    const roundedBytes = JSON.stringify(roundFrames(frames)).length;
    expect(roundedBytes).toBeLessThan(exactBytes);
  });
});
