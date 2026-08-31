import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  REGIME_ALPHA_CEILING,
  REGIME_COMPOSITE_CEILING,
  REGIME_RENDERERS,
} from "@/components/field/regimes";
import { hexToRgb, luminance } from "@/lib/design/__tests__/color";
import { readGlobalsCss, tokensIn } from "@/lib/design/__tests__/cssTokens";

/**
 * ============================================================
 * The field's second ceiling
 * ============================================================
 * `regimes.test.ts` next door already asserts that no single mark exceeds
 * `REGIME_ALPHA_CEILING`. That is a real invariant and it is not the one that
 * decides whether a reader can read the page, because a frame is not one
 * mark. Overdraw composites as `1 - (1-a)(1-b)`, so a per-mark ceiling of
 * 0.55 leaves pixels at 0.8 where two marks cross, and the recording stub
 * that suite uses cannot see that: it records the alpha at each draw call,
 * never the pixel that results from several of them.
 *
 * The number that governs the composite is `REGIME_COMPOSITE_CEILING`, and it
 * was produced by measurement rather than derivation — `scripts/audit/
 * field.mjs` reads the live canvas's backing store over 70 frames at three
 * scroll positions per regime, composites each painted pixel onto
 * `--depth-0`, and reports the worst contrast the three neutral text voices
 * would get if a glyph landed on the loudest pixel. Before these ceilings,
 * seven of eight regimes took at least one voice under AA and three took
 * `--foreground` itself under it (`graph` to 2.40:1); after them all eight
 * clear 4.5:1 for all three, with the peaks equalised at L ~ 0.018-0.021
 * instead of spread across an 18x range.
 *
 * A unit test cannot re-derive those numbers: there is no canvas here and the
 * accumulation depends on what each renderer happens to draw. What it can do
 * — and what silently broke last time — is hold the structure the numbers
 * depend on:
 *
 *   - every regime has one, so a new regime cannot ship unmeasured;
 *   - `journey` is bounded by the strictest regime it crossfades, which is a
 *     proof rather than a sample and so is worth asserting rather than
 *     measuring;
 *   - `QuantumField` actually applies it, once, and not inside the dispatch
 *     table where `drawJourney` would charge it twice.
 *
 * If a value here is changed, re-run `node scripts/audit/field.mjs` against a
 * dev server. It exits non-zero while any regime/voice pair is under AA.
 */

const QUANTUM_FIELD_SOURCE = readFileSync(
  resolve(import.meta.dirname, "../QuantumField.tsx"),
  "utf8"
);

/** The six pillar environments `drawJourney` crossfades between. */
const JOURNEY_MEMBERS = ["wave", "state", "lattice", "graph", "operator", "frontier"] as const;

describe("the field's composite ceiling", () => {
  it("covers every regime the renderer table can dispatch to", () => {
    expect(Object.keys(REGIME_COMPOSITE_CEILING).sort()).toEqual(
      Object.keys(REGIME_RENDERERS).sort()
    );
    // Eight, and the count is asserted so a regime deleted from both tables
    // at once still shows up as a change to be looked at rather than as two
    // maps that agree about nothing.
    expect(Object.keys(REGIME_COMPOSITE_CEILING)).toHaveLength(8);
  });

  it("is a real attenuation in every regime and never an amplification", () => {
    for (const [regime, ceiling] of Object.entries(REGIME_COMPOSITE_CEILING)) {
      expect(ceiling, `${regime} ceiling`).toBeGreaterThan(0);
      expect(ceiling, `${regime} ceiling must not brighten the field`).toBeLessThanOrEqual(1);
    }
  });

  it("bounds journey by the strictest regime it crossfades", () => {
    // `drawJourney` renders two of the six at a share of `frame.intensity`,
    // and at the ends of the crossfade one of them runs at the whole of it.
    // So journey's own ceiling has to be the smallest of the six, or the
    // homepage reaches a loudness the pillar page for that same regime is not
    // allowed. Sampling would not catch this reliably: the audit visits three
    // scroll positions and the offending moment is a narrow band of one.
    const strictest = Math.min(...JOURNEY_MEMBERS.map((r) => REGIME_COMPOSITE_CEILING[r]));
    expect(REGIME_COMPOSITE_CEILING.journey).toBeLessThanOrEqual(strictest);
  });

  it("stays under the per-mark ceiling it composes with", () => {
    // Not a contrast claim, a sanity one: a composite ceiling above the
    // per-mark ceiling would mean the second constraint never binds, which is
    // the state this file exists to end.
    for (const [regime, ceiling] of Object.entries(REGIME_COMPOSITE_CEILING)) {
      if (regime === "operator") continue; // measured safe at full strength
      expect(ceiling, `${regime}`).toBeLessThan(REGIME_ALPHA_CEILING);
    }
  });

  it("is applied by QuantumField, on the frame, keyed by the top-level regime", () => {
    // Pinned to the source for the same reason `compositedContrast.test.ts`
    // pins the atmosphere stack to `PillarScope`: this is the only place the
    // constant does anything, and a refactor that dropped the multiplication
    // would leave every assertion above passing against a field that ignores
    // them.
    expect(QUANTUM_FIELD_SOURCE).toContain("REGIME_COMPOSITE_CEILING[regime]");
    expect(QUANTUM_FIELD_SOURCE).toMatch(
      /frame\.intensity\s*=\s*quality\.intensity\s*\*\s*REGIME_COMPOSITE_CEILING\[regime\]/
    );
    // Exactly one application. Two would double-attenuate; and applying it
    // inside `REGIME_RENDERERS` would charge `drawJourney` once for itself
    // and again for each side of its crossfade.
    expect(QUANTUM_FIELD_SOURCE.match(/REGIME_COMPOSITE_CEILING\[/g)).toHaveLength(1);
  });
});

describe("the field's per-theme strength", () => {
  const GLOBALS = readFileSync(
    resolve(import.meta.dirname, "../../../app/globals.css"),
    "utf8"
  );

  /**
   * The third factor, and the one that is a token rather than a constant.
   *
   * Paper has a fraction of the dark ground's headroom, so the field yields by
   * a different amount per theme. It lives in CSS because it is a property of
   * the palette, and `QuantumField` reads it through the same probe as the
   * colour ramp so it re-resolves when the theme changes.
   *
   * The assertions below are two-sided on purpose, and the lower bound is the
   * one that is new. A ceiling alone is what produced the state this pair of
   * describes exists to prevent: light `--subtle-foreground` was #656e7e,
   * 4.98:1 on `--depth-0`, so `--field-strength` was driven down to 0.3 to fit
   * under it and the light theme's peak alpha reached 11/255 — measurably
   * safe, invisible, and passing every check that existed. `field.mjs` reports
   * peak alpha next to the contrast lines for the same reason.
   */
  it("is declared for the dark root and for both light blocks", () => {
    const declarations = GLOBALS.match(/--field-strength:\s*[\d.]+/g) ?? [];
    // Three: `:root` (dark), the `prefers-color-scheme: light` block for the
    // "system" setting, and the explicit `[data-theme="light"]` block. The
    // light pair must stay verbatim-identical, which is the invariant the
    // whole light ramp is held to — a `--pillar-l-accent` retune once landed
    // in one of the two and not the other.
    expect(declarations).toHaveLength(3);
    const values = declarations.map((d) => Number(d.split(":")[1]));
    const light = values.filter((v) => v !== 1);
    expect(light, "expected two attenuated light values and one dark 1").toHaveLength(2);
    expect(new Set(light).size, `light blocks disagree: ${light.join(" vs ")}`).toBe(1);
  });

  it("never brightens the field, only attenuates it", () => {
    for (const declaration of GLOBALS.match(/--field-strength:\s*([\d.]+)/g) ?? []) {
      const value = Number(declaration.split(":")[1]);
      expect(value, declaration).toBeGreaterThan(0);
      expect(value, declaration).toBeLessThanOrEqual(1);
    }
  });

  it("keeps the light theme above the threshold where the field stops reading", () => {
    // A floor, not a style preference. `docs/DESIGN_SYSTEM.md` §7 asks two
    // things of this layer and only one of them had a number: it may never
    // compete with text, *and* the site is supposed to have a living
    // scientific environment. At 0.3 the second was gone — 11/255 of peak
    // alpha, which measures as a comfortable AA pass and looks like a blank
    // page. Anything that wants to go below this should raise the light
    // theme's contrast headroom first (see the assertion below), because
    // that, not this multiplier, is the constraint that binds.
    for (const declaration of GLOBALS.match(/--field-strength:\s*([\d.]+)/g) ?? []) {
      expect(Number(declaration.split(":")[1]), declaration).toBeGreaterThanOrEqual(0.5);
    }
  });

  it("is read by QuantumField and applied to the frame", () => {
    expect(QUANTUM_FIELD_SOURCE).toContain('getPropertyValue("--field-strength")');
    expect(QUANTUM_FIELD_SOURCE).toContain("colors.strength");
    // A missing or unparseable token must fall back to full strength rather
    // than to `NaN`, which would multiply every alpha to nothing and blank
    // the field with no error anywhere.
    expect(QUANTUM_FIELD_SOURCE).toContain("Number.isFinite(strength)");
  });
});

describe("the light theme's headroom for a background at all", () => {
  /**
   * The root cause behind everything above, asserted where it lives.
   *
   * The field composites onto `--depth-0` and the three neutral voices sit on
   * the result, so the *quietest* voice's margin over AA on the bare ground is
   * the entire budget the environment has to work in. On paper that voice is
   * `--subtle-foreground`, and it darkens the ground toward its own ink, so
   * the budget is a luminance floor rather than a ceiling.
   *
   * At #656e7e that budget was 0.097 of relative luminance — about 4.0 points
   * of CIE L*, against roughly 10.8 for the dark theme's measured peak. That
   * is why paper looked empty at a strength the audit called safe. Moving the
   * pair of secondary voices one step darker (#5d6678 / #505867, which
   * `contrast.test.ts` still holds 1.15:1 apart) doubles it.
   *
   * WCAG's ratio is far stingier near white than near black, so this is not a
   * number that can be carried over from the dark ramp by symmetry — it has to
   * be asserted on the light palette itself.
   */
  const GLOBALS = readGlobalsCss();
  const AA = 4.5;

  it.each([
    ["light (explicit)", ':root[data-theme="light"] {'],
    ["light (system)", ':root[data-theme="system"] {'],
  ])("%s leaves the field room to be seen in", (_label, selector) => {
    const tokens = tokensIn(GLOBALS, selector);
    const ground = luminance(hexToRgb(tokens["--depth-0"]));
    const quietest = Math.max(
      ...["--foreground", "--muted-foreground", "--subtle-foreground"].map((token) =>
        luminance(hexToRgb(tokens[token]))
      )
    );
    // The lowest ground luminance that still clears AA for that voice, and so
    // the darkest pixel the field is ever allowed to paint.
    const floor = AA * (quietest + 0.05) - 0.05;
    expect(ground - floor, "light-theme field headroom").toBeGreaterThanOrEqual(0.18);
  });

  it("declares the same two secondary voices in both light blocks", () => {
    // The headroom assertion above runs against each block separately, so a
    // value retuned in one and forgotten in the other passes it twice while
    // giving a reader who never touched the theme toggle a different palette
    // and a differently-loud background. `contrast.test.ts` holds the pillar
    // ramp and the chart channel to this; these two are on the list now
    // because the field's whole budget is derived from them.
    const explicit = tokensIn(GLOBALS, ':root[data-theme="light"] {');
    const system = tokensIn(GLOBALS, ':root[data-theme="system"] {');
    for (const token of ["--muted-foreground", "--subtle-foreground", "--depth-0"]) {
      expect(system[token], token).toBe(explicit[token]);
    }
  });
});
