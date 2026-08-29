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

      {/* No `overflow-x-auto` here: the only child is a block-level
          `.katex-display`, which fills this content box and carries its own
          horizontal scroll (globals.css §6), so this box never had anything to
          scroll — and `overflow-x: auto` with `overflow-y: visible` computes the
          y axis to `auto` too, which would silently clip a tall equation. The tab
          stop the slab needs now lives on `.katex-display` itself; see
          `focusableDisplayHtml` in src/components/ui/KatexMath.tsx. */}
      <div className="rounded-panel border border-border bg-surface-muted/60 px-4 py-3">
        <KatexMath tex={`|\\psi\\rangle = ${ketLatex}`} display />
      </div>

      {/* `tabIndex={0}` + `role="group"`, matching `BB84RoundTable` and
          `mdx-components.tsx`'s `Table` wrapper. `w-full` does not mean "fits":
          the three columns floor near 300px on their min-content widths — the
          ket, a formatted complex amplitude, and a probability cell holding a
          `w-16` meter beside a `w-10` percentage — against a ~256px content
          box on a 320px phone, and the ket column grows with qubit count
          (`|1011⟩` at four qubits). An `overflow-x-auto` div is focusable by
          default in no browser but Firefox, so a keyboard-only reader could
          see the basis labels and never reach the amplitude and probability
          columns that are the reason to open this panel.
          `group` rather than `region`: a simulator readout is not top-level
          page content, and one landmark per simulator would be landmark
          clutter with no navigational payoff. */}
      <div
        role="group"
        aria-label="State vector amplitudes and probabilities, scrollable horizontally"
        tabIndex={0}
        className="overflow-x-auto rounded-panel border border-border"
      >
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
