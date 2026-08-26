import katex from "katex";
import type { StateVector } from "@/lib/quantum/state";
import { formatAmplitudeLatex } from "@/lib/quantum/format";

const PROBABILITY_EPSILON = 1e-9;

/**
 * Renders a computational-basis ket expression and (optionally) a bar per
 * basis state showing measurement probability. Takes a real `StateVector`
 * computed by the quantum engine — not hand-typed numbers — so the rendered
 * math can never drift out of sync with what the engine actually computes.
 * A pure Server Component: `katex.renderToString` runs at build time, so this
 * ships zero client-side JavaScript.
 *
 * Lessons compose several of these in a row to narrate a gate-by-gate
 * sequence (e.g. a Bell-state preparation) without needing a dedicated
 * "stepper" component.
 *
 * Presented as an instrument readout (see docs/DESIGN_SYSTEM.md §4): the ket
 * is the instrument's display and the probability bars are its meter. The
 * bars are `aria-hidden` because the percentage beside each one already
 * carries the same value as text — a screen reader that announced both would
 * read every probability twice.
 */
export function QuantumStateDisplay({
  state,
  label,
  showProbabilities = true,
}: {
  state: StateVector;
  label?: string;
  showProbabilities?: boolean;
}) {
  const terms = state.amplitudes
    .map((amplitude, index) => ({ amplitude, basisLabel: state.basisLabel(index) }))
    .filter(({ amplitude }) => amplitude.magnitudeSquared() > PROBABILITY_EPSILON);

  const ketLatex =
    terms.length > 0
      ? terms
          .map(({ amplitude, basisLabel }) => `(${formatAmplitudeLatex(amplitude)})|${basisLabel}\\rangle`)
          .join(" + ")
      : "0";

  const html = katex.renderToString(`|\\psi\\rangle = ${ketLatex}`, {
    displayMode: true,
    throwOnError: false,
    strict: false,
  });

  const probabilities = state.probabilities();

  return (
    <div className="not-prose instrument my-6 overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2.5">
        <span className="tech-label">{label ?? "State vector"}</span>
        <span className="tech-label text-subtle-foreground">
          {state.amplitudes.length}-dim basis
        </span>
      </div>

      {/* `.katex-display` already carries the equation-slab treatment from
          globals.css §6, so this wrapper deliberately adds no frame of its
          own — a slab inside a panel inside a panel is the kind of nested
          bordering the design system exists to prevent. It only supplies the
          horizontal scroll for math wider than the column. */}
      <div className="overflow-x-auto px-4 py-1" dangerouslySetInnerHTML={{ __html: html }} />

      {showProbabilities ? (
        <div className="border-t border-border px-4 py-3">
          <p className="tech-label mb-2.5">Measurement probability</p>
          <div className="space-y-1.5">
            {probabilities.map((probability, index) =>
              probability > PROBABILITY_EPSILON ? (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <span className="tech-value w-16 shrink-0 text-muted-foreground">
                    |{state.basisLabel(index)}⟩
                  </span>
                  <div
                    aria-hidden="true"
                    className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted"
                  >
                    <div
                      className="h-full rounded-full bg-pillar"
                      style={{ width: `${probability * 100}%` }}
                    />
                  </div>
                  <span className="tech-value w-14 shrink-0 text-right text-xs text-muted-foreground">
                    {Math.round(probability * 100)}%
                  </span>
                </div>
              ) : null
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
