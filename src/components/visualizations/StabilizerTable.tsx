"use client";

import { Fragment, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type StabilizerGeneratorEntry = {
  /** Short row label, e.g. "g1". */
  label: string;
  /** The generator's Pauli string, one character (I/X/Y/Z) per qubit, e.g. "IIIXXXX". */
  pattern: string;
};

type PauliChar = "I" | "X" | "Y" | "Z";

const PAULI_STYLES: Record<PauliChar, string> = {
  I: "text-muted-foreground",
  X: "text-brand font-semibold",
  Y: "text-warning font-semibold",
  Z: "text-accent font-semibold",
};

/** Two single-qubit Pauli operators commute unless they're distinct and both non-identity. */
function paulisCommute(a: string, b: string): boolean {
  return a === "I" || b === "I" || a === b;
}

/**
 * A single-qubit X or Z error at position `qubit` (1-indexed) anticommutes
 * with a Pauli string exactly when the string's character at that position
 * doesn't commute with the error — the only nonzero term in the usual
 * support-overlap parity sum, since a single-qubit error has weight 1.
 */
function anticommutesWithError(pattern: string, qubit: number, errorType: "X" | "Z"): boolean {
  const charAtQubit = pattern[qubit - 1] ?? "I";
  return !paulisCommute(charAtQubit, errorType);
}

/**
 * Renders a set of stabilizer generators (Pauli strings, one row each) as a
 * qubit-by-qubit grid, then lets the reader pick any single-qubit X or Z
 * error and see live which generators anticommute with it (i.e. which
 * syndrome bits that error would flip) — generalizing a single worked
 * example to all `n * 2` single-qubit errors. Anticommutation is computed
 * from the generator patterns passed in, not hardcoded, so this component
 * works for any stabilizer code, not just the one it's first used on.
 */
export function StabilizerTable({
  generators,
  ariaLabel,
  defaultQubit = 1,
  defaultErrorType = "X",
  qubitLabelOffset = 0,
}: {
  generators: StabilizerGeneratorEntry[];
  ariaLabel: string;
  defaultQubit?: number;
  defaultErrorType?: "X" | "Z";
  /**
   * Shifts only the *displayed* qubit numbers (column headers, qubit-picker
   * buttons, and the live-announcement text) by subtracting this value —
   * internal indexing into each generator's pattern string stays 1-indexed
   * regardless. Defaults to 0 (labels shown as 1..n, matching the
   * component's original 1-indexed convention); pass 1 for a 0-indexed
   * qubit labeling (labels shown as 0..n-1).
   */
  qubitLabelOffset?: number;
}) {
  const numQubits = generators[0]?.pattern.length ?? 0;
  const qubits = useMemo(() => Array.from({ length: numQubits }, (_, i) => i + 1), [numQubits]);

  const [selectedQubit, setSelectedQubit] = useState(defaultQubit);
  const [errorType, setErrorType] = useState<"X" | "Z">(defaultErrorType);

  const anticommutingLabels = generators
    .filter((g) => anticommutesWithError(g.pattern, selectedQubit, errorType))
    .map((g) => g.label);

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="not-prose space-y-4 overflow-x-auto panel-inset p-4"
    >
      <div className="flex flex-wrap items-start gap-6">
        <section aria-labelledby="stabilizer-qubit-heading">
          <h3 id="stabilizer-qubit-heading" className="tech-label">
            Qubit
          </h3>
          <div role="group" aria-label="Qubit to error" className="mt-2 flex flex-wrap gap-1.5">
            {qubits.map((q) => {
              const active = q === selectedQubit;
              return (
                <button
                  key={q}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedQubit(q)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    active
                      ? "bg-brand text-brand-foreground"
                      : "border border-border bg-surface text-muted-foreground hover:bg-surface-muted"
                  )}
                >
                  {q - qubitLabelOffset}
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="stabilizer-error-heading">
          <h3 id="stabilizer-error-heading" className="tech-label">
            Error type
          </h3>
          <div role="group" aria-label="Error type" className="mt-2 flex gap-1.5">
            {(["X", "Z"] as const).map((type) => {
              const active = type === errorType;
              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setErrorType(type)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    active
                      ? "bg-brand text-brand-foreground"
                      : "border border-border bg-surface text-muted-foreground hover:bg-surface-muted"
                  )}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div
        className="inline-grid gap-px overflow-hidden rounded-lg border border-border bg-border"
        style={{ gridTemplateColumns: `auto repeat(${numQubits}, minmax(2.25rem, 1fr))` }}
      >
        <div className="bg-surface px-2 py-2 text-xs font-semibold text-muted-foreground">g</div>
        {qubits.map((q) => (
          <div
            key={`head-${q}`}
            className={cn(
              "flex items-center justify-center bg-surface px-2 py-2 font-mono text-xs font-semibold",
              q === selectedQubit ? "text-brand" : "text-muted-foreground"
            )}
          >
            {q - qubitLabelOffset}
          </div>
        ))}

        {generators.map((g) => {
          const rowAnticommutes = anticommutingLabels.includes(g.label);
          return (
            <Fragment key={g.label}>
              <div
                className={cn(
                  "flex items-center bg-surface px-2 py-2 font-mono text-xs",
                  rowAnticommutes ? "font-bold text-brand" : "text-foreground"
                )}
              >
                {g.label}
              </div>
              {g.pattern.split("").map((char, i) => {
                const qubit = i + 1;
                const isSelectedColumn = qubit === selectedQubit;
                const pauli = (char as PauliChar) in PAULI_STYLES ? (char as PauliChar) : "I";
                return (
                  <div
                    key={`${g.label}-${qubit}`}
                    className={cn(
                      "flex items-center justify-center bg-surface px-2 py-2 font-mono text-xs sm:text-sm",
                      PAULI_STYLES[pauli],
                      isSelectedColumn && rowAnticommutes && "bg-brand/10",
                      isSelectedColumn && !rowAnticommutes && "bg-surface-muted/60"
                    )}
                  >
                    {char}
                  </div>
                );
              })}
            </Fragment>
          );
        })}
      </div>

      <p aria-live="polite" className="text-sm text-foreground">
        {errorType}
        {selectedQubit - qubitLabelOffset} anticommutes with{" "}
        {anticommutingLabels.length === 0
          ? "none of the generators — this error is undetectable by this code's stabilizers."
          : `exactly ${anticommutingLabels.length === 1 ? anticommutingLabels[0] : anticommutingLabels.join(", ")}, flipping ${
              anticommutingLabels.length === 1 ? "that syndrome bit" : "those syndrome bits"
            }.`}
      </p>
    </div>
  );
}
