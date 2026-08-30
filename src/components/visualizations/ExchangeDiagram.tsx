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
  symmetric: "+1 eigenstate (symmetric, bosons)",
  antisymmetric: "−1 eigenstate (antisymmetric, fermions)",
  "not-an-eigenstate": "Not an exchange eigenstate",
  "undefined-zero-vector": "Zero vector: this state does not exist (Pauli exclusion)",
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
          <p className="tech-label">{beforeLabel}</p>
          <MatrixCellGrid cells={before} />
        </div>
        <div className="flex flex-col items-center gap-1 text-muted-foreground">
          <span aria-hidden="true" className="text-xl">
            ⇄
          </span>
          <span className="text-micro font-medium uppercase tracking-wide">exchange</span>
        </div>
        <div className="space-y-2">
          <p className="tech-label">{afterLabel}</p>
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
    // `role="group"`, not `role="img"` — the directory-wide policy. `img`
    // makes every descendant presentational, and `ExchangeDiagramContent`'s
    // descendants are not a picture: two grids of real amplitudes, the
    // `beforeLabel`/`afterLabel` captions naming ψ and P₁₂ψ, the "Rows/columns:
    // particle 1 / particle 2 in state …" basis legend, and — the one that
    // matters most — the verdict badge, which is the figure's whole punchline
    // ("−1 eigenstate (antisymmetric, fermions)", "Zero vector — this state
    // does not exist (Pauli exclusion)"). The caller's `ariaLabel` is a fixed
    // sentence written once in the MDX body; it cannot carry the amplitudes
    // and it does not restate the verdict, so `img` was handing a screen
    // reader the caption and throwing away the conclusion.
    //
    // `group` keeps the same `aria-label` — still announced on entry — and
    // leaves the numbers, the legend and the verdict readable. The ⇄ glyph is
    // already `aria-hidden`, so nothing is announced twice.
    //
    // Deliberately NO `tabIndex={0}` on this scroll container: it does not
    // overflow. `vectorToExchangeGrid` is called with the single-particle
    // dimension (2 in spin-qubits.mdx, 3 in bosons-and-fermions.mdx), so each
    // `MatrixCellGrid` is at most 3 × 3.5rem = 168px, and the two panels sit
    // in a `flex-wrap` row that stacks them rather than overflowing on a
    // narrow screen. Adding a tab stop here would be pure tab-order noise for
    // every keyboard user on the page, with nothing to scroll when they land.
    <div
      role="group"
      aria-label={ariaLabel}
      className="not-prose space-y-4 overflow-x-auto panel-inset p-4"
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
