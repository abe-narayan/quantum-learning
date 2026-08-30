/* Components are constructed with `createElement` rather than written as JSX for the
   reason `src/components/mdx/__tests__/Term.test.ts` documents: vitest's `include` is
   `src/**\/*.test.ts`, and `.ts` files are not parsed for JSX. */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ParametricCurve, type CurveSeries } from "@/components/visualizations/ParametricCurve";
import { PotentialDiagram } from "@/components/visualizations/PotentialDiagram";

/**
 * ============================================================
 * A figure's axis comes from its data, never from its annotations
 * ============================================================
 * `crosstalk.mdx` shipped a fidelity curve covering 0.98446 to 1 drawn
 * against a [0, 1] axis, because the "current ε" marker beside it was
 * authored as a full-height y = 0..1 bar and `ParametricCurve` derived its
 * domain from *every* series. The curve the caption told the reader to
 * "watch fall away" occupied 2.3 of this plot's 148 viewBox units — about
 * 1.2 CSS pixels at a 320px viewport — and was a flat line on the top edge.
 *
 * That lesson was patched by shrinking its marker. These tests hold the
 * component-level fix instead: `excludeFromDomain` on the annotation series,
 * so the same authoring mistake cannot produce the same figure.
 *
 * Geometry constants mirrored from the component, so a failure says which
 * number moved:
 *   plot height = HEIGHT(220) - PAD_TOP(28) - PAD_BOTTOM(44) = 148 units
 *   narrowest real width = 254px against a 480-unit viewBox, scale 0.529
 */
const PLOT_TOP = 28;
const PLOT_BOTTOM = 220 - 44;
const PLOT_H = PLOT_BOTTOM - PLOT_TOP;

/** Every y coordinate in a rendered `<path d="…">`, in viewBox units. */
function pathYs(markup: string, nth = 0): number[] {
  const paths = [...markup.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]);
  const d = paths[nth];
  if (!d) throw new Error(`no <path> at index ${nth} in markup`);
  return [...d.matchAll(/[ML][-\d.]+,([-\d.]+)/g)].map((m) => Number(m[1]));
}

const NARROW_CURVE: CurveSeries = {
  label: "F(ε)",
  color: "brand",
  // The real crosstalk shape: cos²(ε/2) sampled over ε ∈ [0, 0.25].
  points: Array.from({ length: 50 }, (_, i) => {
    const x = (i / 49) * 0.25;
    return { x, y: Math.cos(x / 2) ** 2 };
  }),
};

const FULL_HEIGHT_MARKER: CurveSeries = {
  label: "current ε",
  color: "accent",
  points: [
    { x: 0.1, y: 0 },
    { x: 0.1, y: 1 },
  ],
};

function render(series: CurveSeries[], extra: Record<string, unknown> = {}) {
  return renderToStaticMarkup(
    createElement(ParametricCurve, {
      frames: [{ paramLabel: "ε = 0.10", series }],
      ariaLabel: "test figure",
      ...extra,
    })
  );
}

describe("ParametricCurve y-domain", () => {
  it("is flattened by a full-height marker when the marker opts in to the domain", () => {
    // The bug, reproduced. This assertion exists so the fix below is testing
    // something real: if the component ever stops honouring an ordinary
    // series, this goes green for the wrong reason.
    const ys = pathYs(render([NARROW_CURVE, FULL_HEIGHT_MARKER]));
    const span = Math.max(...ys) - Math.min(...ys);
    expect(span).toBeLessThan(4);
    // 2.3 units is 1.2 CSS pixels at the narrowest real figure width.
    expect(span * (254 / 480)).toBeLessThan(2);
  });

  it("ignores a marker that carries excludeFromDomain", () => {
    const ys = pathYs(render([NARROW_CURVE, { ...FULL_HEIGHT_MARKER, excludeFromDomain: true }]));
    const span = Math.max(...ys) - Math.min(...ys);
    // The curve now owns the axis, so it fills the plot rect.
    expect(span).toBeCloseTo(PLOT_H, 5);
  });

  it("clamps an excluded series to the plot rect instead of letting it escape the viewBox", () => {
    // The marker still says "0 to 1" while the axis now runs 0.9844 to 1, so
    // its lower point maps far below the plot. It must read as "the full
    // height of this plot", not paint over the x tick labels.
    const markerYs = pathYs(render([NARROW_CURVE, { ...FULL_HEIGHT_MARKER, excludeFromDomain: true }]), 1);
    expect(Math.min(...markerYs)).toBeGreaterThanOrEqual(PLOT_TOP);
    expect(Math.max(...markerYs)).toBeLessThanOrEqual(PLOT_BOTTOM);
    expect(Math.max(...markerYs)).toBeCloseTo(PLOT_BOTTOM, 5);
  });

  it("still renders when every series opts out, rather than producing a NaN axis", () => {
    const markup = render([{ ...FULL_HEIGHT_MARKER, excludeFromDomain: true }]);
    expect(markup).not.toMatch(/NaN/);
  });

  it("leaves a plot with no excluded series exactly as it was", () => {
    // Backward compatibility, stated as an assertion: every existing call
    // site passes no `excludeFromDomain` and no `mode`.
    const before = render([NARROW_CURVE, FULL_HEIGHT_MARKER]);
    expect(before).not.toMatch(/NaN/);
    expect(pathYs(before, 1)).toEqual([PLOT_BOTTOM, PLOT_TOP]);
  });
});

describe("ParametricCurve point mode", () => {
  const measured: CurveSeries = { label: "measured at λ=1", color: "brand", mode: "points", points: [{ x: 1, y: 0.95 }] };
  const measured2: CurveSeries = { label: "measured at λ=3", color: "accent", mode: "points", points: [{ x: 3, y: 0.86 }] };

  it("draws discrete marks and no connecting stroke", () => {
    const markup = render([NARROW_CURVE, measured]);
    // One <path> only: the line series. The point series contributes a shape.
    expect([...markup.matchAll(/<path d="/g)]).toHaveLength(1);
    expect(markup).toMatch(/<circle[^>]*fill-brand/);
  });

  it("distinguishes two point series by shape, not only by colour", () => {
    // The grayscale/print requirement: a legend keyed on hue alone is
    // worthless in monochrome, so consecutive point series must differ in
    // geometry. Series 0 is a circle, series 1 a square.
    const markup = render([measured, measured2]);
    expect(markup).toMatch(/<circle[^>]*fill-brand/);
    expect(markup).toMatch(/<rect[^>]*fill-accent/);
    expect(markup).not.toMatch(/<circle[^>]*fill-accent/);
  });

  it("repeats the marker's shape in the legend swatch", () => {
    const markup = render([measured, measured2]);
    // Two inline 20x20 legend SVGs, one per point series.
    expect([...markup.matchAll(/viewBox="0 0 20 20"/g)]).toHaveLength(2);
  });

  it("gives every marker the panel background as a halo so it stays legible on the curve", () => {
    expect(render([NARROW_CURVE, measured])).toMatch(/stroke-surface-muted/);
  });
});

describe("PotentialDiagram energy ladders", () => {
  const xValues = Array.from({ length: 60 }, (_, i) => -3 + (i / 59) * 6);
  const potential = xValues.map((x) => (Math.abs(x) < 1 ? 0 : 10));

  function dashedYs(markup: string): number[] {
    return [...markup.matchAll(/<line[^>]*stroke-dasharray="4 3"[^>]*>/g)].map((m) => Number(/y1="([-\d.]+)"/.exec(m[0])![1]));
  }

  it("keeps the single-line API rendering exactly one unlabelled dashed line", () => {
    const markup = renderToStaticMarkup(
      createElement(PotentialDiagram, { xValues, potential, energyLine: 3, ariaLabel: "one level" })
    );
    expect(dashedYs(markup)).toHaveLength(1);
    // No auto-label: three shipped call sites draw this line bare today.
    expect(markup).not.toMatch(/E₁/);
  });

  it("draws N levels in one figure, each labelled", () => {
    const markup = renderToStaticMarkup(
      createElement(PotentialDiagram, { xValues, potential, energyLines: [1, 4, 8], ariaLabel: "three levels" })
    );
    const ys = dashedYs(markup);
    expect(ys).toHaveLength(3);
    for (const label of ["E₁", "E₂", "E₃"]) expect(markup).toContain(label);
    // Ascending energy is ascending on the page, i.e. descending in y.
    expect([...ys].sort((a, b) => b - a)).toEqual(ys.slice().sort((a, b) => b - a));
  });

  it("labels a dense ladder without stacking labels on top of each other", () => {
    // Five levels crowded into the top fifth of the well. The potential runs
    // 0..10 over a 160-unit plot, so 0.6 of energy is 9.6 units of line
    // separation — under the 16 units a single label column needs, and inside
    // the 8-unit floor two alternating columns buy.
    const markup = renderToStaticMarkup(
      createElement(PotentialDiagram, {
        xValues,
        potential,
        energyLines: [7.0, 7.6, 8.2, 8.8, 9.4],
        ariaLabel: "dense ladder",
      })
    );
    const texts = [...markup.matchAll(/<text[^>]*x="([-\d.]+)"[^>]*y="([-\d.]+)"[^>]*>(E[₀-₉]+)</g)].map((m) => ({
      x: Number(m[1]),
      y: Number(m[2]),
      label: m[3],
    }));
    expect(texts).toHaveLength(5);
    for (const side of [Math.min(...texts.map((t) => t.x)), Math.max(...texts.map((t) => t.x))]) {
      const column = texts.filter((t) => t.x === side).map((t) => t.y).sort((a, b) => a - b);
      for (let i = 1; i < column.length; i++) expect(column[i] - column[i - 1]).toBeGreaterThanOrEqual(16);
    }
    // Both ends are actually in use, which is what buys the spacing.
    expect(new Set(texts.map((t) => t.x)).size).toBe(2);
  });

  it("accepts explicit labels for a ladder whose rungs are not eigenvalues", () => {
    const markup = renderToStaticMarkup(
      createElement(PotentialDiagram, {
        xValues,
        potential,
        energyLines: [{ value: 2, label: "E_F" }, 6],
        ariaLabel: "mixed",
      })
    );
    expect(markup).toContain("E_F");
  });

  it("scales the plot to include the levels", () => {
    // A level above the potential must not be drawn outside the plot rect.
    const markup = renderToStaticMarkup(
      createElement(PotentialDiagram, { xValues, potential, energyLines: [40, 80], ariaLabel: "high levels" })
    );
    for (const y of dashedYs(markup)) {
      expect(y).toBeGreaterThanOrEqual(30);
      expect(y).toBeLessThanOrEqual(220 - 30);
    }
  });
});
