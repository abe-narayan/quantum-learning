import { KatexMath } from "@/components/ui/KatexMath";
import { formatAmplitudeLatex } from "@/lib/quantum/format";
import {
  classicalSumProbability,
  crossBasisProbability,
  interferenceProbability,
  normalizedTwoLevelAmplitudes,
} from "@/lib/quantum/amplitude";
import { ComplexPlaneCanvas } from "./ComplexPlaneCanvas";

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * `unbounded` opts a bar out of clamping its percentage TEXT to [0, 100]:
 * the double-slit "quantum" reading |α+β|² is a genuine, correctly
 * unbounded relative-intensity quantity (it can reach 200% at perfect
 * constructive interference) and showing its true value is intentional,
 * not a bug — see `from-classical-to-quantum-probability.mdx`. Every other
 * quantity this component displays is a true probability that must never
 * be allowed to render as more than 100%, even from floating-point
 * overshoot, so those default to clamped. The bar *width* is always
 * clamped to [0, 100]% regardless, so an unbounded value never overflows
 * the track visually.
 */
function ProbabilityBar({
  label,
  value,
  tone,
  unbounded,
}: {
  label: string;
  value: number;
  tone: "brand" | "accent";
  unbounded?: boolean;
}) {
  const colorVar = tone === "brand" ? "var(--brand)" : "var(--accent)";
  const displayValue = unbounded ? value : clamp01(value);
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono">{Math.round(displayValue * 100)}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full transition-[width] duration-150 ease-out motion-reduce:transition-none"
          style={{ width: `${clamp01(value) * 100}%`, backgroundColor: colorVar }}
        />
      </div>
    </div>
  );
}

/**
 * A two-level (α, β) amplitude pair, kept normalized (|α|²+|β|²=1) by
 * construction via `normalizedTwoLevelAmplitudes` — this is exactly a
 * single-qubit state, just controlled through amplitude/phase sliders
 * instead of Bloch-sphere angles.
 *
 * The bottom comparison panel has two mutually-exclusive readings of that
 * same state, selected by `variant`:
 *
 * - `"double-slit"` (default): combining α and β at the *same* outcome
 *   gives the deliberately unbounded |α+β|², which a relative-phase slider
 *   pulls away from the "classical" sum |α|²+|β|² — this is what the
 *   double-slit lessons (`why-complex-amplitudes.mdx`,
 *   `from-classical-to-quantum-probability.mdx`) rely on, and it must not
 *   be renormalized.
 * - `"basis-change"`: the properly normalized P(+) = |⟨+|ψ⟩|² = |α+β|²/2
 *   and its complement P(−) = 1 − P(+), the quantity
 *   `superposition-interference-and-phase.mdx` derives from the Born rule
 *   for a measurement in the {|+⟩,|−⟩} basis. Unlike the double-slit
 *   reading, this one is a true probability and is always in [0, 1].
 */
export function TwoAmplitudeMode({
  alphaMagnitude,
  alphaPhase,
  betaPhase,
  onChange,
  variant = "double-slit",
}: {
  alphaMagnitude: number;
  alphaPhase: number;
  betaPhase: number;
  onChange: (next: { alphaMagnitude?: number; alphaPhase?: number; betaPhase?: number }) => void;
  variant?: "double-slit" | "basis-change";
}) {
  const [alpha, beta] = normalizedTwoLevelAmplitudes(alphaMagnitude, alphaPhase, betaPhase);
  const relativePhaseDeg = ((betaPhase - alphaPhase) * 180) / Math.PI;
  const quantum = interferenceProbability(alpha, beta);
  const classical = classicalSumProbability(alpha, beta);
  const plusProbability = crossBasisProbability(alpha, beta);
  const minusProbability = 1 - plusProbability;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col items-center gap-3">
          <ComplexPlaneCanvas re={alpha.re} im={alpha.im} />
          <KatexMath tex={`\\alpha = ${formatAmplitudeLatex(alpha, 3)}`} />
        </div>
        <div className="flex flex-col items-center gap-3">
          <ComplexPlaneCanvas re={beta.re} im={beta.im} />
          <KatexMath tex={`\\beta = ${formatAmplitudeLatex(beta, 3)}`} />
        </div>
      </div>

      <div className="space-y-3">
        <label className="block">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">α magnitude (β magnitude follows to keep |α|²+|β|²=1)</span>
            <span className="font-mono text-xs text-muted-foreground">{alphaMagnitude.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={alphaMagnitude}
            onChange={(event) => onChange({ alphaMagnitude: Number(event.target.value) })}
            aria-label="alpha magnitude"
            className="mt-1.5 w-full accent-brand"
          />
        </label>
        <label className="block">
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground">Relative phase (β − α)</span>
            <span className="font-mono text-xs text-muted-foreground">{relativePhaseDeg.toFixed(0)}°</span>
          </div>
          <input
            type="range"
            min={-180}
            max={180}
            step={1}
            value={relativePhaseDeg}
            onChange={(event) => {
              const newRelative = (Number(event.target.value) * Math.PI) / 180;
              onChange({ betaPhase: alphaPhase + newRelative });
            }}
            aria-label="relative phase"
            className="mt-1.5 w-full accent-brand"
          />
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <ProbabilityBar label="P(0) = |α|²" value={alpha.magnitudeSquared()} tone="brand" />
        <ProbabilityBar label="P(1) = |β|²" value={beta.magnitudeSquared()} tone="brand" />
      </div>

      {variant === "basis-change" ? (
        <div className="rounded-xl border border-border bg-surface-muted/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Measuring in the {"{"}|+⟩,|−⟩{"}"} basis instead
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            P(0) and P(1) above never move — that&rsquo;s measuring in the state&rsquo;s own basis, where
            relative phase is invisible. P(+) and P(−) below measure the <em>same</em> state in the rotated
            {" "}|+⟩,|−⟩{" "} basis instead, where that phase becomes fully visible — drag the
            relative-phase slider above and watch these two sweep continuously while still always
            summing to 1.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <ProbabilityBar label="P(+) = |⟨+|ψ⟩|²" value={plusProbability} tone="brand" />
            <ProbabilityBar label="P(−) = |⟨−|ψ⟩|²" value={minusProbability} tone="accent" />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-surface-muted/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            If α and β both contribute to the same outcome
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Combining amplitudes before squaring (quantum) versus combining probabilities directly
            (as if α and β were independent, classical odds) — drag the relative-phase slider above
            and watch these diverge.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <ProbabilityBar label="Quantum: |α + β|²" value={quantum} tone="brand" unbounded />
            <ProbabilityBar label='"Classical": |α|² + |β|²' value={classical} tone="accent" />
          </div>
        </div>
      )}
    </div>
  );
}
