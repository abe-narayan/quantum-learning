import { KatexMath } from "@/components/ui/KatexMath";
import { formatAmplitudeLatex } from "@/lib/quantum/format";
import { Complex } from "@/lib/quantum/complex";

/** A numeric readout of one complex amplitude — value, magnitude, phase, and the probability it contributes. */
export function StatePanel({ z, label }: { z: Complex; label?: string }) {
  const magnitude = z.magnitude();
  const phaseDeg = (z.phase() * 180) / Math.PI;
  const probability = z.magnitudeSquared();

  return (
    <div className="rounded-xl border border-border bg-surface-muted/60 p-4">
      {label ? <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p> : null}
      <div className="mt-2 text-lg">
        <KatexMath tex={`z = ${formatAmplitudeLatex(z, 3)}`} />
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Magnitude |z|</dt>
          <dd className="font-mono text-foreground">{magnitude.toFixed(3)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Phase</dt>
          <dd className="font-mono text-foreground">{phaseDeg.toFixed(1)}°</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">|z|² (probability)</dt>
          <dd className="font-mono text-foreground">{probability.toFixed(3)}</dd>
        </div>
      </dl>
    </div>
  );
}
