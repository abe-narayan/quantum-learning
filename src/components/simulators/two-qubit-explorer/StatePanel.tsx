import { KatexMath } from "@/components/ui/KatexMath";
import { Badge } from "@/components/ui/Badge";
import type { StateVector } from "@/lib/quantum/state";
import { formatAmplitudeLatex } from "@/lib/quantum/format";
import { testSeparability } from "@/lib/quantum/twoQubit";

const PROBABILITY_EPSILON = 1e-9;

export function StatePanel({ state }: { state: StateVector }) {
  const terms = [0, 1, 2, 3]
    .map((index) => ({ amplitude: state.amplitudes[index], label: state.basisLabel(index) }))
    .filter(({ amplitude }) => amplitude.magnitudeSquared() > PROBABILITY_EPSILON);

  const ketLatex =
    terms.length > 0
      ? terms.map(({ amplitude, label }) => `(${formatAmplitudeLatex(amplitude)})|${label}\\rangle`).join(" + ")
      : "0";

  const probabilities = state.probabilities();
  const separability = testSeparability(state);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">State Vector</h3>
        <Badge tone={separability.separable ? "neutral" : "brand"}>
          {separability.separable ? "Product state" : "Entangled"}
        </Badge>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface-muted/60 px-4 py-3">
        <KatexMath tex={`|\\psi\\rangle = ${ketLatex}`} display />
      </div>

      <p className="text-xs text-muted-foreground">
        {separability.separable
          ? "This state factors into two independent single-qubit states — qubit 0 and qubit 1 don't depend on each other."
          : "This state cannot be written as any single-qubit state ⊗ single-qubit state — the qubits are entangled."}
      </p>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <th scope="col" className="px-3 py-2 text-left font-medium">
                State
              </th>
              <th scope="col" className="px-3 py-2 text-left font-medium">
                Amplitude
              </th>
              <th scope="col" className="px-3 py-2 text-left font-medium">
                Probability
              </th>
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3].map((index) => (
              <tr key={index} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-mono text-foreground">|{state.basisLabel(index)}⟩</td>
                <td className="px-3 py-2 font-mono text-muted-foreground">
                  {formatAmplitudeLatex(state.amplitudes[index])}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className="h-full rounded-full bg-pillar transition-[width] duration-300 ease-out motion-reduce:transition-none"
                        style={{ width: `${Math.round(probabilities[index] * 100)}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-mono text-xs text-muted-foreground">
                      {Math.round(probabilities[index] * 100)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
