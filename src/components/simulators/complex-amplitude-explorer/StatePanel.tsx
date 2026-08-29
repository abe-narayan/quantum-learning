import { KatexMath } from "@/components/ui/KatexMath";
import { formatAmplitudeLatex } from "@/lib/quantum/format";
import { Complex } from "@/lib/quantum/complex";
import { cn } from "@/lib/utils";

/** A numeric readout of one complex amplitude — value, magnitude, phase, and the probability it contributes. */
export function StatePanel({ z, label }: { z: Complex; label?: string }) {
  const magnitude = z.magnitude();
  const phaseDeg = (z.phase() * 180) / Math.PI;
  const probability = z.magnitudeSquared();
  // Re/Im (and magnitude) sliders are independently ranged and can't jointly
  // guarantee |z| <= 1, so a valid probability isn't guaranteed either — only
  // label this as one when it actually is (with a little float tolerance).
  const isValidProbability = probability <= 1 + 1e-9;

  return (
    <div className="rounded-panel border border-border bg-surface-muted/60 p-4">
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
          <dt className="text-xs text-muted-foreground">
            {isValidProbability ? "|z|² (probability)" : "|z|² (exceeds 1 — not a valid probability)"}
          </dt>
          <dd className={cn("font-mono", isValidProbability ? "text-foreground" : "text-danger")}>
            {probability.toFixed(3)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
