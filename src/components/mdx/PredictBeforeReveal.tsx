"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type PredictOption = { label: string; value: string };

/**
 * "Predict before you see" pattern: pose a question with a small set of
 * candidate answers, let the student commit to one, then reveal what
 * actually happens. The reveal is deliberately non-punitive — no
 * right/wrong coloring — because the point is to make the student notice
 * the gap (or match) between their intuition and the real result the
 * surrounding lesson's interactive demonstrates, not to score them.
 *
 * Visually distinct from `InteractiveSection` (brand-tinted, not
 * accent-tinted) so a scanning eye can tell "this asks you to commit to a
 * guess first" apart from "this is a simulator to play with" — the two
 * are meant to sit near each other in a lesson, prediction before reveal.
 */
export function PredictBeforeReveal({
  question,
  options,
  correctValue,
  explanation,
}: {
  question: string;
  options: PredictOption[];
  correctValue: string;
  explanation: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedOption = options.find((option) => option.value === selected);

  return (
    <div className="not-prose my-8 rounded-2xl border border-brand/30 bg-brand/5 p-5 sm:p-6">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0 fill-none stroke-brand" strokeWidth="1.5">
          <circle cx="6" cy="6" r="4.75" />
          <circle cx="6" cy="6" r="1.25" className="fill-brand stroke-none" />
        </svg>
        Predict before you reveal
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">{question}</p>

      <div role="radiogroup" aria-label={question} className="mt-4 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={selected !== null && !isSelected}
              onClick={() => setSelected(option.value)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                isSelected
                  ? "bg-brand text-brand-foreground"
                  : "border border-border bg-surface text-muted-foreground disabled:opacity-60",
                selected === null && "hover:bg-surface-muted"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {selectedOption && (
        <div aria-live="polite" className="mt-4 rounded-xl border border-border bg-surface p-4 text-sm">
          <p className="font-semibold text-foreground">
            You predicted {selectedOption.label}
            {selected === correctValue ? " — that's exactly what happens." : " — here's what actually happens."}
          </p>
          <p className="mt-2 text-muted-foreground">{explanation}</p>
        </div>
      )}
    </div>
  );
}
