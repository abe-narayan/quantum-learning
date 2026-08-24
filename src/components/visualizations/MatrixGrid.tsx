import type { Matrix } from "@/lib/quantum/matrix";
import { formatAmplitudeLatex } from "@/lib/quantum/format";

/** Plain, serializable shape — safe to pass across the Server→Client boundary, unlike a `Matrix` instance. */
export type MatrixCell = { re: number; im: number };

/** Converts a real `Matrix` into plain cells. Call this in a Server Component (an MDX lesson body) before handing data to a client component. */
export function matrixToCells(matrix: Matrix): MatrixCell[][] {
  return Array.from({ length: matrix.rows }, (_, r) =>
    Array.from({ length: matrix.cols }, (_, c) => {
      const entry = matrix.get(r, c);
      return { re: entry.re, im: entry.im };
    })
  );
}

/** Pure rendering: plain cells in, a grid out. Shared by the static `MatrixGrid` and the client `MatrixGridExplorer`. */
export function MatrixCellGrid({
  cells,
  digits = 2,
  highlightDiagonal = false,
}: {
  cells: MatrixCell[][];
  digits?: number;
  highlightDiagonal?: boolean;
}) {
  const cols = cells[0]?.length ?? 0;
  return (
    <div
      className="inline-grid gap-px overflow-hidden rounded-lg border border-border bg-border"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(3.5rem, 1fr))` }}
    >
      {cells.map((row, r) =>
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className={`flex items-center justify-center bg-surface px-2 py-2.5 font-mono text-xs sm:text-sm ${
              highlightDiagonal && r === c ? "bg-brand/10 font-semibold text-brand" : "text-foreground"
            }`}
          >
            {formatAmplitudeLatex(cell, digits)}
          </div>
        ))
      )}
    </div>
  );
}

/**
 * A matrix's entries rendered as a plain grid — real `Matrix` values in,
 * formatted text out, no math performed here. Optionally shows a second
 * matrix beside the first (e.g. M next to M†, or U next to U†U) so a
 * claimed relationship between them is something the reader can check
 * entry by entry, not just take on faith. Server-only: takes the real
 * `Matrix` class directly, which is fine here since this component never
 * crosses into client code.
 */
export function MatrixGrid({
  matrix,
  label,
  ariaLabel,
  highlightDiagonal = false,
  compareTo,
  compareLabel,
  digits = 2,
}: {
  matrix: Matrix;
  label?: string;
  ariaLabel: string;
  highlightDiagonal?: boolean;
  compareTo?: Matrix;
  compareLabel?: string;
  digits?: number;
}) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="not-prose flex flex-wrap items-start gap-6 overflow-x-auto rounded-xl border border-border bg-surface-muted/40 p-4"
    >
      <div className="space-y-2">
        {label ? <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p> : null}
        <MatrixCellGrid cells={matrixToCells(matrix)} digits={digits} highlightDiagonal={highlightDiagonal} />
      </div>
      {compareTo ? (
        <div className="space-y-2">
          {compareLabel ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{compareLabel}</p>
          ) : null}
          <MatrixCellGrid cells={matrixToCells(compareTo)} digits={digits} highlightDiagonal={highlightDiagonal} />
        </div>
      ) : null}
    </div>
  );
}
