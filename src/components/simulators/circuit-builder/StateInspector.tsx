import { KatexMath } from "@/components/ui/KatexMath";
import type { StateVector } from "@/lib/quantum/state";
import { formatAmplitudeLatex } from "@/lib/quantum/format";

const PROBABILITY_EPSILON = 1e-9;

export function StateInspector({ state }: { state: StateVector }) {
  const dimension = state.dimension;
  const probabilities = state.probabilities();

  const terms = Array.from({ length: dimension }, (_, index) => ({
    amplitude: state.amplitudes[index],
    label: state.basisLabel(index),
  })).filter(({ amplitude }) => amplitude.magnitudeSquared() > PROBABILITY_EPSILON);

  const ketLatex =
    terms.length > 0
      ? terms.map(({ amplitude, label }) => `(${formatAmplitudeLatex(amplitude)})|${label}\\rangle`).join(" + ")
      : "0";

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">State Vector</h3>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface-muted/60 px-4 py-3">
        <KatexMath tex={`|\\psi\\rangle = ${ketLatex}`} display />
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
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
            {Array.from({ length: dimension }, (_, index) => (
              <tr key={index} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-mono text-foreground">|{state.basisLabel(index)}⟩</td>
                <td className="px-3 py-2 font-mono text-muted-foreground">
                  {formatAmplitudeLatex(state.amplitudes[index])}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className="h-full rounded-full bg-brand transition-[width] duration-300 ease-out motion-reduce:transition-none"
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
