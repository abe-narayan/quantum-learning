import katex from "katex";
import type { StateVector } from "@/lib/quantum/state";
import { formatAmplitudeLatex } from "@/lib/quantum/format";

const PROBABILITY_EPSILON = 1e-9;

/**
 * Renders a computational-basis ket expression and (optionally) a bar per
 * basis state showing measurement probability. Takes a real `StateVector`
 * computed by the quantum engine — not hand-typed numbers — so the
 * rendered math can never drift out of sync with what the engine actually
 * computes. A pure Server Component: `katex.renderToString` runs at build
 * time, so this ships zero client-side JavaScript.
 *
 * Lessons compose several of these in a row to narrate a gate-by-gate
 * sequence (e.g. a Bell-state preparation) without needing a dedicated
 * "stepper" component.
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
    <div className="not-prose my-6 rounded-xl border border-border bg-surface-muted/60 p-4">
      {label ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      ) : null}

      <div className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />

      {showProbabilities ? (
        <div className="mt-4 space-y-1.5">
          {probabilities.map((probability, index) =>
            probability > PROBABILITY_EPSILON ? (
              <div key={index} className="flex items-center gap-3 text-sm">
                <span className="w-16 shrink-0 font-mono text-muted-foreground">
                  |{state.basisLabel(index)}⟩
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${Math.round(probability * 100)}%` }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right font-mono text-xs text-muted-foreground">
                  {Math.round(probability * 100)}%
                </span>
              </div>
            ) : null
          )}
        </div>
      ) : null}
    </div>
  );
}
