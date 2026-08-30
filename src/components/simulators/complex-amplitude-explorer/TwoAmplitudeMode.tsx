import { KatexMath } from "@/components/ui/KatexMath";
import { formatAmplitudeLatex } from "@/lib/quantum/format";
import {
  classicalSumProbability,
  crossBasisProbability,
  interferenceProbability,
  normalizedTwoLevelAmplitudes,
} from "@/lib/quantum/amplitude";
import { ComplexPlaneCanvas } from "./ComplexPlaneCanvas";
import { SimulatorSlider } from "../shared/controls";

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * `unbounded` opts a bar out of clamping its percentage TEXT to [0, 100]:
 * the double-slit "quantum" reading |α+β|² is a genuine, correctly
 * unbounded relative-intensity quantity (it can reach 200% at perfect
 * constructive interference) and showing its true value is intentional,
 * not a bug; see `from-classical-to-quantum-probability.mdx`. Every other
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
  scaleMax = 1,
}: {
  label: string;
  value: number;
  tone: "brand" | "accent";
  unbounded?: boolean;
  /**
   * Full-track value. Defaults to 1, a true probability. The double-slit pair
   * passes 2, because the two bars in that pair were previously drawn on
   * *different* scales and the reader could not tell.
   *
   * At the mode's opening state (α magnitude √½, both phases 0) the engine
   * gives |α+β|² = 2.000 and |α|²+|β|² = 1.000: perfect constructive
   * interference, the largest gap the comparison can show. The quantum bar's
   * width was clamped to the track, so it drew full; the classical bar at 1.0
   * drew full too. Two identical-length bars, labelled 200% and 100%, in the
   * one panel whose entire job is that they are different. Putting both on a
   * shared 0..2 track makes the opening state read at a glance: quantum full,
   * classical half.
   */
  scaleMax?: number;
}) {
  const colorVar = tone === "brand" ? "var(--pillar-accent)" : "var(--accent)";
  const displayValue = unbounded ? value : clamp01(value);
  const trackFraction = Math.max(0, Math.min(1, value / scaleMax));
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono">{Math.round(displayValue * 100)}%</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full transition-[width] duration-150 ease-out motion-reduce:transition-none"
          style={{ width: `${trackFraction * 100}%`, backgroundColor: colorVar }}
        />
      </div>
    </div>
  );
}

/** Which reading (or control set) the two-amplitude mode shows; see `TwoAmplitudeMode`'s doc comment for the physics behind each. */
export type TwoAmplitudeVariant = "double-slit" | "basis-change" | "global-vs-relative";

/**
 * A two-level (α, β) amplitude pair, kept normalized (|α|²+|β|²=1) by
 * construction via `normalizedTwoLevelAmplitudes`; this is exactly a
 * single-qubit state, just controlled through amplitude/phase sliders
 * instead of Bloch-sphere angles.
 *
 * The bottom comparison panel has three mutually-exclusive readings of that
 * same state, selected by `variant`:
 *
 * - `"double-slit"` (default): combining α and β at the *same* outcome
 *   gives the deliberately unbounded |α+β|², which a relative-phase slider
 *   pulls away from the "classical" sum |α|²+|β|²; this is what the
 *   double-slit lessons (`why-complex-amplitudes.mdx`,
 *   `from-classical-to-quantum-probability.mdx`) rely on, and it must not
 *   be renormalized.
 * - `"basis-change"`: the properly normalized P(+) = |⟨+|ψ⟩|² = |α+β|²/2
 *   and its complement P(−) = 1 − P(+), the quantity
 *   `superposition-interference-and-phase.mdx` derives from the Born rule
 *   for a measurement in the {|+⟩,|−⟩} basis. Unlike the double-slit
 *   reading, this one is a true probability and is always in [0, 1].
 * - `"global-vs-relative"`: adds a second slider, global phase γ, which
 *   (unlike δ) rotates *both* α and β together. Used by
 *   `global-and-relative-phase.mdx` to make the mechanism behind "global
 *   phase is unobservable" visible at the amplitude level: dragging γ
 *   sweeps both arrows in lockstep while P(0), P(1), and the α*β
 *   cross-term underneath stay frozen; dragging δ moves only β's arrow
 *   and the cross-term rotates with it.
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
  variant?: TwoAmplitudeVariant;
}) {
  const [alpha, beta] = normalizedTwoLevelAmplitudes(alphaMagnitude, alphaPhase, betaPhase);
  const relativePhaseDeg = ((betaPhase - alphaPhase) * 180) / Math.PI;
  const globalPhaseDeg = (alphaPhase * 180) / Math.PI;
  const quantum = interferenceProbability(alpha, beta);
  const classical = classicalSumProbability(alpha, beta);
  const plusProbability = crossBasisProbability(alpha, beta);
  const minusProbability = 1 - plusProbability;
  const crossTerm = alpha.conjugate().mul(beta);

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

      <div className="space-y-4">
        <SimulatorSlider
          label="α magnitude (β magnitude follows to keep |α|²+|β|²=1)"
          min={0}
          max={1}
          step={0.01}
          value={alphaMagnitude}
          formatValue={(v) => v.toFixed(2)}
          onChange={(value) => onChange({ alphaMagnitude: value })}
        />
        {variant === "global-vs-relative" ? (
          <SimulatorSlider
            label="Global phase (γ): rotates α and β together"
            min={-180}
            max={180}
            step={1}
            value={globalPhaseDeg}
            formatValue={(v) => `${v.toFixed(0)}°`}
            valueText={(v) => `${v.toFixed(0)} degrees`}
            onChange={(value) => {
              const newGamma = (value * Math.PI) / 180;
              const deltaGamma = newGamma - alphaPhase;
              onChange({ alphaPhase: newGamma, betaPhase: betaPhase + deltaGamma });
            }}
          />
        ) : null}
        <SimulatorSlider
          label="Relative phase (β − α)"
          min={-180}
          max={180}
          step={1}
          value={relativePhaseDeg}
          formatValue={(v) => `${v.toFixed(0)}°`}
          valueText={(v) => `${v.toFixed(0)} degrees`}
          onChange={(value) => {
            const newRelative = (value * Math.PI) / 180;
            onChange({ betaPhase: alphaPhase + newRelative });
          }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <ProbabilityBar label="P(0) = |α|²" value={alpha.magnitudeSquared()} tone="brand" />
        <ProbabilityBar label="P(1) = |β|²" value={beta.magnitudeSquared()} tone="brand" />
      </div>

      {variant === "global-vs-relative" ? (
        <div className="rounded-panel border border-border bg-surface-muted/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Global phase (γ) vs. relative phase (δ)
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Drag γ and watch both arrows sweep around together while P(0) and P(1) above, and the
            cross-term α*β below, stay completely still. Global phase changes only how the state is
            written, not the state itself. Drag the relative-phase slider instead and watch only β&rsquo;s
            arrow move, with the cross-term rotating right along with it.
          </p>
          <div className="mt-3">
            <KatexMath tex={`\\alpha^{*}\\beta = ${formatAmplitudeLatex(crossTerm, 3)}`} />
          </div>
        </div>
      ) : variant === "basis-change" ? (
        <div className="rounded-panel border border-border bg-surface-muted/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Measuring in the {"{"}|+⟩,|−⟩{"}"} basis instead
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            P(0) and P(1) above never move. That&rsquo;s measuring in the state&rsquo;s own basis, where
            relative phase is invisible. P(+) and P(−) below measure the <em>same</em> state in the rotated
            {" "}|+⟩,|−⟩{" "} basis instead, where that phase becomes fully visible. Drag the
            relative-phase slider above and watch these two sweep continuously while still always
            summing to 1.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <ProbabilityBar label="P(+) = |⟨+|ψ⟩|²" value={plusProbability} tone="brand" />
            <ProbabilityBar label="P(−) = |⟨−|ψ⟩|²" value={minusProbability} tone="accent" />
          </div>
        </div>
      ) : (
        <div className="rounded-panel border border-border bg-surface-muted/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            If α and β both contribute to the same outcome
          </p>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Combining amplitudes before squaring (quantum) versus combining probabilities directly
            (as if α and β were independent, classical odds). Both bars run on the same track, which
            is full at 200%, so the quantum bar being twice the classical one is the interference.
            Drag the relative-phase slider above and watch them diverge.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <ProbabilityBar label="Quantum: |α + β|²" value={quantum} tone="brand" unbounded scaleMax={2} />
            <ProbabilityBar label='"Classical": |α|² + |β|²' value={classical} tone="accent" scaleMax={2} />
          </div>
        </div>
      )}
    </div>
  );
}
