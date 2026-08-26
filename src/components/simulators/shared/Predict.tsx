"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PredictOption = { id: string; label: ReactNode };

/**
 * Predict-then-run: ask the visitor to commit to an expected outcome before
 * they see it, then tell them whether they were right. Deliberately
 * physics-agnostic — the caller supplies the choices and, once the real
 * outcome is known, which option id matches it; this component only owns
 * the guess/reveal interaction.
 *
 * Optional by design (per the mission brief: only where a simulator has a
 * genuinely predictable outcome). Not every simulator needs one.
 */
export function Predict({
  question,
  options,
  outcomeId,
  onGuess,
  className,
}: {
  question: ReactNode;
  options: PredictOption[];
  /** The option id matching what actually happened. `null`/`undefined` while unresolved
   *  (e.g. before the visitor has run the experiment). */
  outcomeId?: string | null;
  onGuess?: (id: string) => void;
  className?: string;
}) {
  const [guess, setGuess] = useState<string | null>(null);
  const headingId = useId();
  const resolved = guess !== null && outcomeId != null;
  const correct = resolved && guess === outcomeId;

  return (
    <div className={cn("rounded-lg border border-pillar-edge bg-pillar-wash p-3.5", className)}>
      <p id={headingId} className="tech-label text-pillar">
        Predict first
      </p>
      <p className="mt-1.5 text-sm text-foreground">{question}</p>
      <div role="radiogroup" aria-labelledby={headingId} className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={guess === option.id}
            onClick={() => {
              setGuess(option.id);
              onGuess?.(option.id);
            }}
            className={cn(
              "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              guess === option.id
                ? "border border-pillar bg-pillar text-brand-foreground"
                : "border border-border bg-surface text-foreground hover:bg-surface-muted"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p
        aria-live="polite"
        className={cn(
          "mt-2.5 text-xs",
          resolved ? (correct ? "font-medium text-success" : "font-medium text-warning") : "text-subtle-foreground"
        )}
      >
        {resolved
          ? correct
            ? "Correct — that is what happened."
            : "Not quite — see how the result compares to your guess."
          : guess !== null
            ? "Guess locked in — run it to check."
            : "Pick a guess, then run the experiment to check it."}
      </p>
    </div>
  );
}
