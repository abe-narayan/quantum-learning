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
      <div className="overflow-x-auto rounded-xl border border-border bg-surface-muted/60 px-4 py-3">
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
