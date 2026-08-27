import { describe, expect, it } from "vitest";
import { readGlobalsCss, tokensIn } from "./cssTokens";
import {
  contrastRatio,
  flatten,
  hexToRgb,
  mixWithTransparent,
  numberToken,
  oklchToRgba,
  withGroupOpacity,
  type Rgb,
  type Rgba,
} from "./color";
import { PILLAR_ORDER, PILLAR_VISUALS } from "@/lib/design/pillars";

/**
 * ============================================================
 * Composited contrast — the case the audits could not check
 * ============================================================
 * `docs/A11Y_AUDIT.md` closes with an explicit list of what a static code
 * read could not verify, and this is the first item on it:
 *
 *   "the genuinely composited cases (pillar-wash *and* atmosphere *and* a
 *    text token, simultaneously, on Apex specifically, where
 *    `--atmosphere-strength` is highest) are the priority spot-check"
 *
 * `contrast.test.ts` and `pillarContrast.test.ts` between them cover every
 * text token against a flat, opaque ground. Neither can see the ground a
 * reader actually gets, because on this site the ground is a stack:
 *
 *   `--depth-0`                      the page ground
 *   + `.atmosphere`                  a fixed layer of two pillar-tinted
 *                                    radial pools and a vertical density
 *                                    ramp, at `opacity: --atmosphere-strength`
 *   + `--pillar-wash`                where a component tints its own surface
 *
 * Every one of those is translucent and pillar-derived, so the composite
 * differs across all six pillars in both themes — twelve grounds no existing
 * test looks at. On the dark theme the atmosphere *lightens* the ground,
 * which moves it toward the light text sitting on it; that is the direction
 * that loses contrast, and Apex pushes `--atmosphere-strength` highest.
 *
 * The audit's reason for skipping this was sound — "a wrong hand-computed
 * number is worse than an honest 'not checked'" — so the point of this file
 * is to compute it rather than estimate it. Two things follow from that:
 *
 * 1. **The gradient falloff is modelled, not assumed away.** A naive version
 *    of this test evaluated every pool at full strength simultaneously; that
 *    describes a pixel which does not exist (the pools sit at opposite top
 *    corners) and would have demanded palette changes to fix an imaginary
 *    case. Instead the ground is sampled on a grid across the viewport and
 *    the assertion is made against the *worst sampled pixel* — somewhere a
 *    reader's eye can actually land.
 * 2. **The layer stack is pinned to its source.** The geometry below is a
 *    restatement of `PillarScope.tsx`, so the last suite in this file checks
 *    the restatement against the real component and fails if the atmosphere
 *    grows a layer this model does not know about.
 */

const AA_NORMAL = 4.5;

const GLOBALS_CSS = readGlobalsCss();

/**
 * The atmosphere's `background-image`, transcribed from `PillarScope.tsx`,
 * topmost layer first (CSS `background-image` order), with each stop's real
 * geometry.
 *
 * The layer is `position: fixed; inset: 0`, so these percentages resolve
 * against the viewport and do not move when the page scrolls — any text can
 * therefore land on any of these pixels, which is why the whole viewport is
 * sampled rather than just the reading column.
 *
 * The third CSS layer is one `linear-gradient` with three stops
 * (`depth-1 55%` at the top, `transparent` at 34%, `depth-0 70%` at the
 * bottom). It is split into two entries here because each end interpolates
 * independently toward the shared middle stop, and they never both apply at
 * the same y.
 */
type AtmosphereLayer =
  | {
      kind: "radial";
      token: "--pillar-glow" | "--pillar-wash";
      /** Gradient box radii, in rem (`radial-gradient(60rem 40rem at …)`). */
      rx: number;
      ry: number;
      /** Centre, as a fraction of the viewport. */
      cx: number;
      cy: number;
      /** The stop at which the colour reaches `transparent`, as a fraction. */
      fade: number;
    }
  | {
      kind: "linear-mix";
      token: "--depth-1" | "--depth-0";
      /** `color-mix(in srgb, <token> N%, transparent)`. */
      percent: number;
      /** Fraction down the box at which this end is at full strength. */
      at: number;
      /** Fraction at which it has interpolated to fully transparent. */
      transparentAt: number;
    };

const PILLAR_SCOPE_ATMOSPHERE: AtmosphereLayer[] = [
  { kind: "radial", token: "--pillar-glow", rx: 60, ry: 40, cx: 0.12, cy: -0.08, fade: 0.6 },
  { kind: "radial", token: "--pillar-wash", rx: 48, ry: 34, cx: 0.92, cy: 0.06, fade: 0.58 },
  { kind: "linear-mix", token: "--depth-1", percent: 55, at: 0, transparentAt: 0.34 },
  { kind: "linear-mix", token: "--depth-0", percent: 70, at: 1, transparentAt: 0.34 },
];

/**
 * Viewports sampled. The narrow one is not redundant: the pools are sized in
 * `rem`, so a 390px-wide phone is proportionally *more* covered by a 60rem
 * pool than a 1440px desktop is, and its worst pixel is a different one.
 */
const VIEWPORTS: Array<{ label: string; width: number; height: number }> = [
  { label: "desktop 1440x900", width: 1440, height: 900 },
  { label: "laptop 1280x800", width: 1280, height: 800 },
  { label: "phone 390x844", width: 390, height: 844 },
];

const REM = 16;
/** Grid resolution per axis. 24 puts a sample every ~60px on desktop and
 *  ~16px on a phone — finer than the gradients vary. */
const SAMPLE_STEPS = 24;

/** A radial layer's alpha multiplier at one point, given in viewport fractions. */
function radialFactor(
  layer: Extract<AtmosphereLayer, { kind: "radial" }>,
  x: number,
  y: number,
  width: number,
  height: number
): number {
  const dx = ((x - layer.cx) * width) / (layer.rx * REM);
  const dy = ((y - layer.cy) * height) / (layer.ry * REM);
  const distance = Math.hypot(dx, dy);
  // Full colour at stop 0, `transparent` at `fade`, linear in between.
  return Math.min(1, Math.max(0, 1 - distance / layer.fade));
}

/** A linear-gradient end's alpha multiplier at fraction `y` down the box. */
function linearFactor(layer: Extract<AtmosphereLayer, { kind: "linear-mix" }>, y: number): number {
  const span = layer.at - layer.transparentAt;
  const t = (y - layer.transparentAt) / span;
  return Math.min(1, Math.max(0, t));
}

type ThemeName = "dark" | "light";

/** The token block that defines a theme's ramp lightnesses and alphas. */
const THEME_SELECTOR: Record<ThemeName, string> = {
  dark: ":root {",
  light: ':root[data-theme="light"] {',
};

/**
 * Apex re-declares the whole depth ladder and pushes the atmosphere past 1.
 * Every other pillar inherits the theme block's values, so this is the only
 * per-pillar deviation that changes a *ground* rather than just a hue.
 */
const APEX_DARK = tokensIn(GLOBALS_CSS, '[data-pillar="apex"] {');

/** Resolves one hop of `var()` aliasing (`--surface: var(--depth-1)`). */
function resolveHex(tokens: Record<string, string>, name: string): string {
  const raw = tokens[name];
  if (raw === undefined) throw new Error(`token not found: ${name}`);
  const alias = raw.match(/^var\((--[\w-]+)\)$/);
  const value = alias ? tokens[alias[1]] : raw;
  if (value === undefined) throw new Error(`alias target not found for ${name}: ${raw}`);
  return value;
}

type Environment = {
  label: string;
  tokens: Record<string, string>;
  pillarHue: number;
  pillarChroma: number;
};

function environments(): Environment[] {
  const out: Environment[] = [];
  for (const theme of ["dark", "light"] as ThemeName[]) {
    const base = tokensIn(GLOBALS_CSS, THEME_SELECTOR[theme]);
    for (const pillar of PILLAR_ORDER) {
      const visual = PILLAR_VISUALS[pillar];
      const overrides = pillar === "apex" && theme === "dark" ? APEX_DARK : {};
      out.push({
        label: `${theme} / ${pillar}`,
        tokens: { ...base, ...overrides },
        pillarHue: visual.hue,
        pillarChroma: visual.chroma,
      });
    }
  }
  return out;
}

/** The atmosphere's layer colours at full token alpha, topmost first. */
function layerColours(env: Environment): Rgba[] {
  const { tokens, pillarHue, pillarChroma } = env;
  return PILLAR_SCOPE_ATMOSPHERE.map((layer): Rgba => {
    if (layer.kind === "linear-mix") {
      return mixWithTransparent(hexToRgb(resolveHex(tokens, layer.token)), layer.percent);
    }
    if (layer.token === "--pillar-glow") {
      return oklchToRgba(
        numberToken(tokens, "--pillar-l-accent"),
        pillarChroma,
        pillarHue,
        numberToken(tokens, "--pillar-glow-alpha")
      );
    }
    // `--pillar-wash` is authored at 0.7x chroma; see the ramp in globals.css.
    return oklchToRgba(
      numberToken(tokens, "--pillar-l-wash"),
      pillarChroma * 0.7,
      pillarHue,
      numberToken(tokens, "--pillar-wash-alpha")
    );
  });
}

/** The composited page ground at one point of one viewport. */
function groundAt(
  env: Environment,
  colours: Rgba[],
  x: number,
  y: number,
  width: number,
  height: number
): Rgb {
  const scaled = colours.map((colour, index): Rgba => {
    const layer = PILLAR_SCOPE_ATMOSPHERE[index];
    const factor =
      layer.kind === "radial" ? radialFactor(layer, x, y, width, height) : linearFactor(layer, y);
    return [colour[0], colour[1], colour[2], colour[3] * factor];
  });

  // `opacity` composites the layer stack as a group; values above 1 clamp.
  const strength = Math.min(1, numberToken(env.tokens, "--atmosphere-strength"));
  const depth0 = hexToRgb(resolveHex(env.tokens, "--depth-0"));
  return flatten(withGroupOpacity(scaled, strength), depth0);
}

/**
 * The worst contrast `text` reaches against the composited page ground,
 * anywhere in any sampled viewport, with the point that produced it.
 */
function worstGroundContrast(env: Environment, text: Rgb) {
  const colours = layerColours(env);
  let worst = { ratio: Number.POSITIVE_INFINITY, where: "" };

  for (const viewport of VIEWPORTS) {
    for (let i = 0; i <= SAMPLE_STEPS; i += 1) {
      for (let j = 0; j <= SAMPLE_STEPS; j += 1) {
        const x = i / SAMPLE_STEPS;
        const y = j / SAMPLE_STEPS;
        const ratio = contrastRatio(
          text,
          groundAt(env, colours, x, y, viewport.width, viewport.height)
        );
        if (ratio < worst.ratio) {
          worst = {
            ratio,
            where: `${viewport.label} at ${(x * 100).toFixed(0)}%,${(y * 100).toFixed(0)}%`,
          };
        }
      }
    }
  }

  return worst;
}

/** The ground inside a `.katex-display` slab: pillar wash over surface-muted. */
function equationSlabGround(env: Environment): Rgb {
  const surfaceMuted = hexToRgb(resolveHex(env.tokens, "--surface-muted"));
  const wash = oklchToRgba(
    numberToken(env.tokens, "--pillar-l-wash"),
    env.pillarChroma * 0.7,
    env.pillarHue,
    numberToken(env.tokens, "--pillar-wash-alpha")
  );
  return flatten([wash], surfaceMuted);
}

/** Text tokens carried as running prose over the page ground. */
const PROSE_TEXT: Array<[token: string, note: string]> = [
  ["--foreground", "body text"],
  ["--muted-foreground", "lesson metadata, course descriptions"],
  ["--subtle-foreground", "units, captions, axis labels"],
];

describe("composited contrast — text over the atmosphere layer", () => {
  it.each(environments())("$label keeps prose legible on the composited ground", (env) => {
    const failures: string[] = [];

    for (const [token, note] of PROSE_TEXT) {
      const text = hexToRgb(resolveHex(env.tokens, token));
      const worst = worstGroundContrast(env, text);
      if (worst.ratio < AA_NORMAL) {
        failures.push(
          `${token} (${note}) falls to ${worst.ratio.toFixed(2)}:1 — ${worst.where}`
        );
      }
    }

    expect(failures, `${env.label} — worst composited page ground`).toEqual([]);
  });

  it.each(environments())("$label keeps pillar-tinted link text legible", (env) => {
    // `--pillar-text` is `--pillar-accent`, whose lightness is retuned per
    // theme (`--pillar-l-accent`). It colours every prose link inside a
    // pillar-scoped lesson, so it is read at body size over exactly this
    // ground.
    const [r, g, b] = oklchToRgba(
      numberToken(env.tokens, "--pillar-l-accent"),
      env.pillarChroma,
      env.pillarHue,
      1
    );
    const worst = worstGroundContrast(env, [r, g, b]);
    expect(
      worst.ratio,
      `${env.label} — --pillar-text falls to ${worst.ratio.toFixed(2)}:1 — ${worst.where}`
    ).toBeGreaterThanOrEqual(AA_NORMAL);
  });
});

describe("composited contrast — text inside a pillar-washed surface", () => {
  it.each(environments())("$label keeps maths legible inside the equation slab", (env) => {
    // `.katex-display` composites `--pillar-wash` over `--surface-muted`.
    // KaTeX renders in `--foreground`, and a display equation is content, not
    // decoration, so it is held to normal-text AA.
    const ratio = contrastRatio(
      hexToRgb(resolveHex(env.tokens, "--foreground")),
      equationSlabGround(env)
    );
    expect(ratio, `${env.label} — --foreground in a .katex-display slab`).toBeGreaterThanOrEqual(
      AA_NORMAL
    );
  });

  it.each(environments())("$label keeps muted text legible on bg-pillar-wash", (env) => {
    const ratio = contrastRatio(
      hexToRgb(resolveHex(env.tokens, "--muted-foreground")),
      equationSlabGround(env)
    );
    expect(ratio, `${env.label} — --muted-foreground on bg-pillar-wash`).toBeGreaterThanOrEqual(
      AA_NORMAL
    );
  });
});

describe("composited contrast — the model's own premises", () => {
  it("Apex on dark has the densest atmosphere of any environment", () => {
    // The audit named Apex as the priority spot-check because it pushes
    // `--atmosphere-strength` highest. Assert that premise rather than
    // trusting it: if another pillar ever overrides it higher, the reasoning
    // in this file's docstring goes stale silently.
    const strengths = environments().map((env) => ({
      label: env.label,
      strength: Math.min(1, numberToken(env.tokens, "--atmosphere-strength")),
    }));
    const max = Math.max(...strengths.map((entry) => entry.strength));
    expect(strengths.filter((entry) => entry.strength === max).map((entry) => entry.label)).toContain(
      "dark / apex"
    );
  });

  it("the atmosphere lightens the dark ground and darkens the light one", () => {
    // The whole premise of testing the composite is that it moves the ground
    // *toward* the text. If a retune ever inverted that, the ratio assertions
    // above would still pass while this file stopped describing the risk.
    const sum = (rgb: Rgb) => rgb[0] + rgb[1] + rgb[2];
    const brightest = (env: Environment) => {
      const colours = layerColours(env);
      let best = -Infinity;
      let worstDark = Infinity;
      for (let i = 0; i <= SAMPLE_STEPS; i += 1) {
        for (let j = 0; j <= SAMPLE_STEPS; j += 1) {
          const value = sum(groundAt(env, colours, i / SAMPLE_STEPS, j / SAMPLE_STEPS, 1440, 900));
          best = Math.max(best, value);
          worstDark = Math.min(worstDark, value);
        }
      }
      return { best, worstDark };
    };

    const darkEnv = environments().find((env) => env.label === "dark / quantum-computing")!;
    const lightEnv = environments().find((env) => env.label === "light / quantum-computing")!;

    expect(brightest(darkEnv).best).toBeGreaterThan(
      sum(hexToRgb(resolveHex(darkEnv.tokens, "--depth-0")))
    );
    expect(brightest(lightEnv).worstDark).toBeLessThan(
      sum(hexToRgb(resolveHex(lightEnv.tokens, "--depth-0")))
    );
  });
});

describe("the atmosphere model matches PillarScope", () => {
  it("transcribes the same layers, in the same order, as the component", async () => {
    // The geometry above restates another file. Pin it to the real source so
    // a change to the atmosphere cannot leave this suite quietly asserting
    // against a stack that no longer exists.
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const source = readFileSync(
      resolve(import.meta.dirname, "../../../components/field/PillarScope.tsx"),
      "utf8"
    );

    const start = source.indexOf("backgroundImage:");
    expect(start, "PillarScope no longer declares a backgroundImage").toBeGreaterThan(-1);
    const stack = source.slice(start, source.indexOf("].join(", start));

    // Geometry, not just the token names — a retuned pool radius or centre
    // would silently invalidate every sampled ratio above.
    expect(stack).toContain("radial-gradient(60rem 40rem at 12% -8%, var(--pillar-glow), transparent 60%)");
    expect(stack).toContain("radial-gradient(48rem 34rem at 92% 6%, var(--pillar-wash), transparent 58%)");
    expect(stack).toContain("color-mix(in srgb, var(--depth-1) 55%, transparent)");
    expect(stack).toContain("transparent 34%");
    expect(stack).toContain("color-mix(in srgb, var(--depth-0) 70%, transparent)");

    // Exactly three CSS layers — a fourth would be unmodelled.
    expect(stack.match(/gradient\(/g)?.length).toBe(3);
  });
});
