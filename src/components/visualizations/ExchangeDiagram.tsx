import type { Complex } from "@/lib/quantum/complex";
import { MatrixCellGrid, type MatrixCell } from "./MatrixGrid";

/** Reshapes a length-dim² combined two-particle vector into a dim×dim grid: cell (i,j) is the amplitude of "particle 1 in state i, particle 2 in state j", matching `tensorProduct`'s own i*dim+j indexing. */
export function vectorToExchangeGrid(vector: readonly Complex[], dim: number): MatrixCell[][] {
  return Array.from({ length: dim }, (_, i) =>
    Array.from({ length: dim }, (_, j) => ({ re: vector[i * dim + j].re, im: vector[i * dim + j].im }))
  );
}

export type ExchangeVerdict = "symmetric" | "antisymmetric" | "not-an-eigenstate" | "undefined-zero-vector";

const VERDICT_LABEL: Record<ExchangeVerdict, string> = {
  symmetric: "+1 eigenstate (symmetric — bosons)",
  antisymmetric: "−1 eigenstate (antisymmetric — fermions)",
  "not-an-eigenstate": "Not an exchange eigenstate",
  "undefined-zero-vector": "Zero vector — this state does not exist (Pauli exclusion)",
};

const VERDICT_TONE: Record<ExchangeVerdict, string> = {
  symmetric: "text-brand",
  antisymmetric: "text-accent",
  "not-an-eigenstate": "text-muted-foreground",
  "undefined-zero-vector": "text-warning",
};

/**
 * The pure content of an `ExchangeDiagram` (the before/after grids, the
 * exchange glyph, the basis-labels caption, and the verdict badge) without
 * the outer bordered box — split out exactly like `MatrixGrid`/`MatrixCellGrid`
 * so `ExchangeDiagramExplorer` can compose it into its own single shared box
 * (alongside its preset toggle) instead of nesting one bordered box inside
 * another.
 */
export function ExchangeDiagramContent({
  before,
  after,
  beforeLabel = "ψ",
  afterLabel = "P₁₂ψ",
  basisLabels,
  verdict,
}: {
  before: MatrixCell[][];
  after: MatrixCell[][];
  beforeLabel?: string;
  afterLabel?: string;
  basisLabels?: string[];
  verdict?: ExchangeVerdict;
}) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{beforeLabel}</p>
          <MatrixCellGrid cells={before} />
        </div>
        <div className="flex flex-col items-center gap-1 text-muted-foreground">
          <span aria-hidden="true" className="text-xl">
            ⇄
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wide">exchange</span>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{afterLabel}</p>
          <MatrixCellGrid cells={after} />
        </div>
      </div>
      {basisLabels ? (
        <p className="text-xs text-muted-foreground">
          Rows/columns: particle 1 / particle 2 in state {basisLabels.join(", ")}
        </p>
      ) : null}
      {verdict ? <p className={`text-sm font-semibold ${VERDICT_TONE[verdict]}`}>{VERDICT_LABEL[verdict]}</p> : null}
    </>
  );
}

/**
 * A two-particle state's coefficient grid, before and after the exchange
 * operator P₁₂ swaps which particle is "in" which single-particle state —
 * cell (i,j) is the real amplitude of "particle 1 in state i, particle 2
 * in state j", read directly off a real `tensorProduct`/`exchangeParticles`
 * computation via `vectorToExchangeGrid`, never fabricated. The verdict
 * badge states what the lesson's own computation concluded (symmetric,
 * antisymmetric, or neither) rather than asserting it separately from the
 * numbers shown.
 */
export function ExchangeDiagram({
  before,
  after,
  beforeLabel = "ψ",
  afterLabel = "P₁₂ψ",
  basisLabels,
  verdict,
  ariaLabel,
}: {
  before: MatrixCell[][];
  after: MatrixCell[][];
  beforeLabel?: string;
  afterLabel?: string;
  basisLabels?: string[];
  verdict?: ExchangeVerdict;
  ariaLabel: string;
}) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="not-prose space-y-4 overflow-x-auto rounded-xl border border-border bg-surface-muted/40 p-4"
    >
      <ExchangeDiagramContent
        before={before}
        after={after}
        beforeLabel={beforeLabel}
        afterLabel={afterLabel}
        basisLabels={basisLabels}
        verdict={verdict}
      />
    </div>
  );
}
