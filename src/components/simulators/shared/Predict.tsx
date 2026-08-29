"use client";

import { useId, useRef, useState, type ReactNode } from "react";
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

  // Roving tabindex + arrow keys, ported from `visualizations/PresetToggle.tsx`
  // (the ARIA Authoring Practices pattern for `role="radio"` groups): only the
  // guessed option sits in the Tab order, and arrow keys move *and* select the
  // adjacent option, wrapping at the ends.
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const guessIndex = options.findIndex((option) => option.id === guess);

  const selectAt = (i: number) => {
    setGuess(options[i].id);
    onGuess?.(options[i].id);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const count = options.length;
    if (count === 0) return;

    let delta = 0;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") delta = 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") delta = -1;
    else return;

    event.preventDefault();
    const current = guessIndex === -1 ? 0 : guessIndex;
    const nextIndex = (current + delta + count) % count;
    selectAt(nextIndex);
    buttonRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={cn("rounded-(--radius-tight) border border-pillar-edge bg-pillar-wash p-3.5", className)}>
      <p id={headingId} className="tech-label text-pillar">
        Predict first
      </p>
      <p className="mt-1.5 text-sm text-foreground">{question}</p>
      <div role="radiogroup" aria-labelledby={headingId} className="mt-3 flex flex-wrap gap-2">
        {options.map((option, i) => (
          <button
            key={option.id}
            ref={(el) => {
              buttonRefs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={guess === option.id}
            tabIndex={i === guessIndex || (guessIndex === -1 && i === 0) ? 0 : -1}
            onClick={() => selectAt(i)}
            onKeyDown={handleKeyDown}
            className={cn(
              "inline-flex min-h-11 items-center justify-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
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
