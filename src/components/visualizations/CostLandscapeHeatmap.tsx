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
}: {
  /** Rows indexed by θ (top → bottom), columns by φ (left → right); every row must have the same length. */
  grid: CostLandscapeCell[][];
  ariaLabel: string;
  thetaLabel?: string;
  phiLabel?: string;
  /** The true ground energy, shown in the caption next to the grid's own best value. */
  exactMin?: number;
}) {
  const { min, max, minRow, minCol, cols } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    let minRow = 0;
    let minCol = 0;
    grid.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell.value < min) {
          min = cell.value;
          minRow = r;
          minCol = c;
        }
        if (cell.value > max) max = cell.value;
      })
    );
    return { min, max, minRow, minCol, cols: grid[0]?.length ?? 0 };
  }, [grid]);

  const span = max - min || 1;
  const rows = grid.length;
  const best = grid[minRow]?.[minCol];

  return (
    <div className="not-prose space-y-3 rounded-xl border border-border bg-surface-muted/40 p-4">
      <div
        role="img"
        aria-label={ariaLabel}
        className="overflow-x-auto"
      >
        <div className="inline-flex flex-col gap-1">
          <div
            className="inline-grid gap-px overflow-hidden rounded-lg border border-border bg-border"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(1.5rem, 1fr))` }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const t = (cell.value - min) / span;
                const isMin = r === minRow && c === minCol;
                return (
                  <div
                    key={`${r}-${c}`}
                    title={`${thetaLabel}=${cell.theta.toFixed(2)}, ${phiLabel}=${cell.phi.toFixed(2)}: ⟨H⟩=${cell.value.toFixed(4)}`}
                    className="relative aspect-square"
                    style={{
                      backgroundColor: `color-mix(in srgb, var(--success) ${(1 - t) * 100}%, var(--danger) ${t * 100}%)`,
                    }}
                  >
                    {isMin ? (
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
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{phiLabel} = 0</span>
            <span>{phiLabel} = 2π &rarr;</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: "var(--success)" }}
          />
          lowest ⟨H⟩ in grid
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: "var(--danger)" }}
          />
          highest ⟨H⟩ in grid
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full border-2 border-background bg-foreground" />
          grid minimum ({thetaLabel}={best?.theta.toFixed(2)}, {phiLabel}={best?.phi.toFixed(2)})
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        Grid rows step {thetaLabel} from 0 to 2π (top → bottom, {rows} points), columns step{" "}
        {phiLabel} from 0 to 2π (left → right, {cols} points). Best grid value: ⟨H⟩ ={" "}
        {min.toFixed(4)}
        {exactMin !== undefined ? ` (exact ground energy: ${exactMin.toFixed(4)})` : null}.
      </p>
    </div>
  );
}
