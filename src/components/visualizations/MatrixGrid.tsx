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
      className="inline-grid gap-px overflow-hidden rounded-(--radius-tight) border border-border bg-border"
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
    // `role="group"`, not `role="img"` — the policy this directory now applies
    // everywhere (see TensorNetworkDiagram and PathPhasorSum for the same call
    // made earlier). `img` makes every descendant presentational, and the
    // descendants here are the matrix itself: 4 to 28 formatted complex
    // entries plus the `label`/`compareLabel` captions that say which matrix
    // is which. No caller's `ariaLabel` enumerates those numbers — they are
    // sentences like "The Werner state used as this lesson's mixed-state
    // worked example, p=0.7", and the block-encoding lesson's own label says
    // the figure exists "to compare entry by entry", which is precisely what
    // `role="img"` made impossible. The label is a *summary of* the grid, not
    // a substitute for it, so the role was deleting the content and leaving
    // the caption.
    //
    // `group` keeps that same label — a screen reader announces it on entry
    // and on focus, so nothing `img` was delivering is lost — while leaving
    // the entries in the accessibility tree for a reader who wants them.
    //
    // `tabIndex={0}`: this is an `overflow-x-auto` container that genuinely
    // overflows. `MatrixCellGrid` lays out `repeat(cols, minmax(3.5rem, 1fr))`,
    // so a 4-column matrix is 224px and the Hamming[7,4,3] generator matrix
    // (css-codes-and-the-general-stabilizer-formalism.mdx) is 7 columns =
    // 392px, both against a ~256px content box inside `panel-inset p-4` on a
    // 320px phone. A scroll container is focusable by default only in Firefox,
    // so without this a keyboard-only reader in Chromium/WebKit sees the first
    // two or three columns of the matrix and has no way to reach the rest —
    // WCAG 2.1.1. The global `:focus-visible` outline in globals.css makes the
    // new stop visible; nothing here cancels it.
    <div
      role="group"
      aria-label={ariaLabel}
      tabIndex={0}
      className="not-prose flex flex-wrap items-start gap-6 overflow-x-auto panel-inset p-4"
    >
      <div className="space-y-2">
        {label ? <p className="tech-label">{label}</p> : null}
        <MatrixCellGrid cells={matrixToCells(matrix)} digits={digits} highlightDiagonal={highlightDiagonal} />
      </div>
      {compareTo ? (
        <div className="space-y-2">
          {compareLabel ? (
            <p className="tech-label">{compareLabel}</p>
          ) : null}
          <MatrixCellGrid cells={matrixToCells(compareTo)} digits={digits} highlightDiagonal={highlightDiagonal} />
        </div>
      ) : null}
    </div>
  );
}
