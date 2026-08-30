import { KatexMath } from "@/components/ui/KatexMath";
import type { StateVector } from "@/lib/quantum/state";
import type { BlochAngles } from "@/lib/quantum/bloch";
import { formatAmplitudeLatex, formatNumber, radiansToDegrees } from "./format";

export function BlochSphereStatePanel({ state, angles }: { state: StateVector; angles: BlochAngles }) {
  const [alpha, beta] = state.amplitudes;
  const [pAlpha, pBeta] = state.probabilities();

  const stateLatex = `|\\psi\\rangle = (${formatAmplitudeLatex(alpha)})\\,|0\\rangle + (${formatAmplitudeLatex(beta)})\\,|1\\rangle`;

  return (
    <div className="space-y-4">
      {/* No `overflow-x-auto` here: the only child is a block-level
          `.katex-display`, which fills this content box and carries its own
          horizontal scroll (globals.css §6), so this box never had anything to
          scroll, and `overflow-x: auto` with `overflow-y: visible` computes the
          y axis to `auto` too, which would silently clip a tall equation. The tab
          stop the slab needs now lives on `.katex-display` itself; see
          `focusableDisplayHtml` in src/components/ui/KatexMath.tsx. */}
      <div className="rounded-panel border border-border bg-surface-muted/60 px-4 py-3">
        <KatexMath tex={stateLatex} display />
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">α</dt>
          <dd className="mt-0.5 font-mono text-foreground">{formatAmplitudeLatex(alpha)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">β</dt>
          <dd className="mt-0.5 font-mono text-foreground">{formatAmplitudeLatex(beta)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">θ</dt>
          <dd className="mt-0.5 font-mono text-foreground">{formatNumber(radiansToDegrees(angles.theta), 1)}°</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">φ</dt>
          <dd className="mt-0.5 font-mono text-foreground">{formatNumber(radiansToDegrees(angles.phi), 1)}°</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">|α|²</dt>
          <dd className="mt-0.5 font-mono text-foreground">{formatNumber(pAlpha)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">|β|²</dt>
          <dd className="mt-0.5 font-mono text-foreground">{formatNumber(pBeta)}</dd>
        </div>
      </dl>
    </div>
  );
}
