import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  REGIME_ALPHA_CEILING,
  REGIME_COMPOSITE_CEILING,
  REGIME_RENDERERS,
} from "@/components/field/regimes";

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
   * Paper has a fraction of the dark ground's headroom: light
   * `--subtle-foreground` starts at 4.98:1 against `--depth-0`, which is half
   * a point of margin over AA before anything is painted behind it, while on
   * the dark ground the same voice has room to spare. So the field yields by
   * a different amount per theme. It lives in CSS because it is a property of
   * the palette, and `QuantumField` reads it through the same probe as the
   * colour ramp so it re-resolves when the theme changes.
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

  it("is read by QuantumField and applied to the frame", () => {
    expect(QUANTUM_FIELD_SOURCE).toContain('getPropertyValue("--field-strength")');
    expect(QUANTUM_FIELD_SOURCE).toContain("colors.strength");
    // A missing or unparseable token must fall back to full strength rather
    // than to `NaN`, which would multiply every alpha to nothing and blank
    // the field with no error anywhere.
    expect(QUANTUM_FIELD_SOURCE).toContain("Number.isFinite(strength)");
  });
});
