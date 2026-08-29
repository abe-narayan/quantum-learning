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

      <p className="text-xs text-muted-foreground">
        {separability.separable
          ? "This state factors into two independent single-qubit states — qubit 0 and qubit 1 don't depend on each other."
          : "This state cannot be written as any single-qubit state ⊗ single-qubit state — the qubits are entangled."}
      </p>

      {/* `tabIndex={0}` + `role="group"` on the table's scroll container, the
          same remedy `BB84RoundTable` and `mdx-components.tsx`'s `Table`
          wrapper apply. `w-full` on a table is not a promise that it fits: the
          three columns have real min-content widths — a `|11⟩` ket, a
          formatted complex amplitude like `0.354 + 0.354i`, and a probability
          cell holding a `w-16` meter beside a `w-10` percentage — which floor
          this table near 300px, against a ~256px content box on a 320px phone.
          An `overflow-x-auto` div is focusable by default in no browser except
          Firefox, so a keyboard-only reader could see the basis labels and had
          no way to scroll to the amplitudes and probabilities beside them,
          which is the whole panel.
          `group` rather than `region`: this table is a readout inside a
          simulator instrument, not top-level page content, and a landmark per
          simulator would clutter the page's landmark list for no navigational
          gain. */}
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
