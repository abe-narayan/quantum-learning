"use client";

import { useMemo } from "react";

export type CostLandscapeCell = { theta: number; phi: number; value: number };

/**
 * A static, color-mapped grid of a two-parameter VQE cost landscape
 * ⟨H⟩(θ,φ) — the 2D analogue of `ParametricCurve`'s 1D line plot, for the
 * lessons whose ansatz has grown a second parameter. Deliberately a single
 * static frame (no slider): one worked grid search, one picture. Like
 * `ParametricCurve`, this component only draws whatever grid it's handed —
 * the lesson (a Server Component) computes `grid` itself from real
 * `@/lib/quantum/*` functions and passes plain, serializable data across
 * the server/client boundary.
 */
export function CostLandscapeHeatmap({
  grid,
  ariaLabel,
  thetaLabel = "θ",
  phiLabel = "φ",
  exactMin,
  valueLabel = "⟨H⟩",
  goal = "min",
  exactLabel = "exact ground energy",
  thetaMaxLabel = "2π",
  phiMaxLabel = "2π",
}: {
  /** Rows indexed by θ (top → bottom), columns by φ (left → right); every row must have the same length. */
  grid: CostLandscapeCell[][];
  ariaLabel: string;
  thetaLabel?: string;
  phiLabel?: string;
  /** The true optimal value (ground energy for a minimized cost, or the brute-force optimum for a maximized one), shown in the caption next to the grid's own best value. */
  exactMin?: number;
  /** Symbol for the plotted quantity, used in tooltips, the legend, and the caption. */
  valueLabel?: string;
  /** Whether the grid's "best" cell (marked, and colored green) is its lowest or highest value. */
  goal?: "min" | "max";
  /** What `exactMin` represents, spelled out in the caption (e.g. "true max (brute force)"). */
  exactLabel?: string;
  /** Display label for the row axis's upper bound (θ ranges 0 to this). */
  thetaMaxLabel?: string;
  /** Display label for the column axis's upper bound (φ ranges 0 to this). */
  phiMaxLabel?: string;
}) {
  const { min, max, bestRow, bestCol, cols } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    let minRow = 0;
    let minCol = 0;
    let maxRow = 0;
    let maxCol = 0;
    grid.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell.value < min) {
          min = cell.value;
          minRow = r;
          minCol = c;
        }
        if (cell.value > max) {
          max = cell.value;
          maxRow = r;
          maxCol = c;
        }
      })
    );
    return {
      min,
      max,
      bestRow: goal === "max" ? maxRow : minRow,
      bestCol: goal === "max" ? maxCol : minCol,
      cols: grid[0]?.length ?? 0,
    };
  }, [grid, goal]);

  const span = max - min || 1;
  const rows = grid.length;
  const best = grid[bestRow]?.[bestCol];
  const bestValue = goal === "max" ? max : min;
  const worstLabel = goal === "max" ? "lowest" : "highest";
  const bestLabel = goal === "max" ? "highest" : "lowest";

  return (
    <div className="not-prose space-y-3 panel-inset p-4">
      {/* The `role="img"` used to sit on this scroll wrapper, which is the one
          shape of the defect that is not simply "delete the role": unlike the
          matrix grids, this figure really *is* a picture — the cells are color
          swatches with no text in them, and per-cell values for a 15×15 or
          17×17 grid search are noise, not content. What the wrapper also
          contained, and therefore erased, was the three axis captions: the
          "θ = 0 at the top → θ = 2π at the bottom" line (added precisely
          because "a reader locating the marked optimum had to leave the
          picture to find out which axis was which") and the φ = 0 / φ = 2π
          pair beneath the grid.
          So the role moves DOWN onto the color field it correctly describes,
          and the wrapper keeps the captions readable. Everything the label
          asserted about the picture is still asserted, about the picture.

          `tabIndex={0}` on the wrapper: `repeat(cols, minmax(1.5rem, 1fr))` is
          24px per column, so this directory's real callers — a 15×15 grid in
          variational-algorithm-implementation.mdx, 17×17 in
          vqe-a-worked-toy-example.mdx — are 360px and 408px wide against a
          ~256px content box on a 320px phone. It genuinely scrolls, and an
          `overflow-x-auto` div is focusable by default only in Firefox, so
          without the stop a keyboard-only reader could not reach the right
          half of the landscape (which is where the second minimum lives in the
          QAOA γ/β sweep). `role="group"` gives the new stop a name without
          adding a page landmark for every heatmap — and a deliberately short,
          affordance-shaped name rather than `ariaLabel`, which now belongs to
          the color field below and would otherwise be spoken twice in a row
          (the same split `mdx-components.tsx`'s table wrapper makes: the
          scroll region says what it is, the content inside says what it
          says).  */}
      <div
        role="group"
        aria-label="Cost landscape grid, scrollable horizontally"
        tabIndex={0}
        className="overflow-x-auto"
      >
        <div className="inline-flex flex-col gap-1">
          {/* The θ direction had no on-figure label at all: the grid showed φ = 0 and
              φ = 2π under its columns, but which way θ ran across the rows was stated
              only in the paragraph below the figure. A reader locating the marked
              optimum had to leave the picture to find out which axis was which. */}
          <div className="text-xs text-muted-foreground">
            {thetaLabel} = 0 at the top &rarr; {thetaLabel} = {thetaMaxLabel} at the bottom
          </div>
          {/* The color field, and the only part of this component that is
              honestly one figure: every child is a `title`-bearing swatch with
              no text node in it, plus one `aria-hidden` marker dot on the best
              cell. Flattening *this* subtree to a sentence loses nothing a
              reader could otherwise reach, which is the whole test for whether
              `role="img"` is a description or a deletion. (The per-cell
              `title` strings are mouse-hover-only either way; the caption
              below the figure already states the marked optimum's θ, φ and
              value in text, so nothing here is reachable only by hover.) */}
          <div
            role="img"
            aria-label={ariaLabel}
            className="inline-grid gap-px overflow-hidden rounded-(--radius-tight) border border-border bg-border"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(1.5rem, 1fr))` }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const raw = (cell.value - min) / span;
                const t = goal === "max" ? 1 - raw : raw;
                const isBest = r === bestRow && c === bestCol;
                return (
                  <div
                    key={`${r}-${c}`}
                    title={`${thetaLabel}=${cell.theta.toFixed(2)}, ${phiLabel}=${cell.phi.toFixed(2)}: ${valueLabel}=${cell.value.toFixed(4)}`}
                    className="relative aspect-square"
                    style={{
                      backgroundColor: `color-mix(in srgb, var(--success) ${(1 - t) * 100}%, var(--danger) ${t * 100}%)`,
                    }}
                  >
                    {isBest ? (
                      <span
                        className="absolute inset-0 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-background ring-2 ring-background" />
                      </span>
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
          {/* 10px -> `text-xs` (12px). These are the figure's only axis-value labels —
              the pair a reader uses to convert a column position into a real φ — and
              at 10px they were the smallest text on the page. Unlike this directory's
              SVG figures these are real CSS pixels, so this is a legibility margin
              rather than a fix for viewBox scaling. */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{phiLabel} = 0</span>
            <span>{phiLabel} = {phiMaxLabel} &rarr;</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-success" />
          {bestLabel} {valueLabel} in grid
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm bg-danger" />
          {worstLabel} {valueLabel} in grid
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full border-2 border-background bg-foreground" />
          grid {goal === "max" ? "maximum" : "minimum"} ({thetaLabel}={best?.theta.toFixed(2)}, {phiLabel}={best?.phi.toFixed(2)})
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        Grid rows step {thetaLabel} from 0 to {thetaMaxLabel} (top → bottom, {rows} points), columns step{" "}
        {phiLabel} from 0 to {phiMaxLabel} (left → right, {cols} points). Best grid value: {valueLabel} ={" "}
        {bestValue.toFixed(4)}
        {exactMin !== undefined ? ` (${exactLabel}: ${exactMin.toFixed(4)})` : null}.
      </p>
    </div>
  );
}
