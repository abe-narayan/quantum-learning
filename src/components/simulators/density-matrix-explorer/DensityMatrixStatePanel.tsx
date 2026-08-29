import { KatexMath } from "@/components/ui/KatexMath";
import { Matrix } from "@/lib/quantum/matrix";
import { formatMatrixLatex } from "@/lib/quantum/format";
import type { DensityMatrixValidation } from "@/lib/quantum/densityMatrix";
import { formatNumber } from "../bloch-sphere/format";

export function DensityMatrixStatePanel({
  rho,
  purityValue,
  entropyValue,
  validation,
}: {
  rho: Matrix;
  purityValue: number;
  entropyValue: number;
  validation: DensityMatrixValidation;
}) {
  return (
    <div className="space-y-4">
      {/* No `overflow-x-auto` here: the only child is a block-level
          `.katex-display`, which fills this content box and carries its own
          horizontal scroll (globals.css §6), so this box never had anything to
          scroll — and `overflow-x: auto` with `overflow-y: visible` computes the
          y axis to `auto` too, which would silently clip a tall equation. The tab
          stop the slab needs now lives on `.katex-display` itself; see
          `focusableDisplayHtml` in src/components/ui/KatexMath.tsx. */}
      <div className="rounded-panel border border-border bg-surface-muted/60 px-4 py-3">
        <KatexMath tex={`\\rho = ${formatMatrixLatex(rho, 3)}`} display />
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tr(ρ²) — purity</dt>
          <dd className="mt-0.5 font-mono text-foreground">{formatNumber(purityValue, 3)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">S(ρ) — entropy</dt>
          <dd className="mt-0.5 font-mono text-foreground">{formatNumber(entropyValue, 3)} bits</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Hermitian</dt>
          <dd className="mt-0.5 font-mono text-foreground">{validation.isHermitian ? "yes" : "no"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Tr(ρ) = 1</dt>
          <dd className="mt-0.5 font-mono text-foreground">{validation.hasUnitTrace ? "yes" : "no"}</dd>
        </div>
      </dl>

      <p className="text-xs text-muted-foreground">
        {purityValue > 0.999
          ? "Tr(ρ²) ≈ 1 — this is a pure state, on the sphere's surface."
          : purityValue < 0.501
            ? "Tr(ρ²) ≈ 0.5 — this is the maximally mixed state, at the exact center of the sphere."
            : "0.5 < Tr(ρ²) < 1 — a genuinely mixed state, strictly inside the sphere."}
      </p>
    </div>
  );
}
