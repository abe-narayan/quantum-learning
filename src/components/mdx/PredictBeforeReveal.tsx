"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export type PredictOption = { label: string; value: string };

/**
 * MDX usage:
 * ```mdx
 * <PredictBeforeReveal
 *   question="If you double the box width, what happens to the ground-state energy?"
 *   options={[
 *     { label: "Doubles", value: "double" },
 *     { label: "Halves", value: "half" },
 *     { label: "Quarters", value: "quarter" },
 *   ]}
 *   correctValue="quarter"
 *   explanation="E_1 ∝ 1/L², so doubling L cuts the ground-state energy to a quarter."
 * />
 * ```
 */

/**
 * "Predict before you see" pattern: pose a question with a small set of
 * candidate answers, let the student commit to one, then reveal what
 * actually happens. The reveal is deliberately non-punitive — no
 * right/wrong coloring — because the point is to make the student notice
 * the gap (or match) between their intuition and the real result the
 * surrounding lesson's interactive demonstrates, not to score them.
 *
 * Visually distinct from `InteractiveSection` (brand-tinted, not
 * accent/pillar-tinted) so a scanning eye can tell "this asks you to commit
 * to a guess first" apart from "this is equipment to operate" — the two are
 * meant to sit near each other in a lesson, prediction before reveal.
 *
 * The option row is a real WAI-ARIA radiogroup: a roving tabindex (one stop
 * in the page's Tab order; Left/Right/Up/Down/Home/End move the *selection*
 * among options, matching how a native `<input type="radio">` group
 * behaves) rather than each button being its own Tab stop. Once a value is
 * committed, the unselected options become inert (`disabled`) — the pattern
 * is "commit once," not "change your mind freely" — which also removes them
 * from the tab order, so nothing further to manage there.
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
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedOption = options.find((option) => option.value === selected);

  function commit(value: string, index: number) {
    if (selected !== null) return;
    setSelected(value);
    setActiveIndex(index);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (selected !== null) return;
    const { key } = event;
    let nextIndex: number | null = null;
    if (key === "ArrowRight" || key === "ArrowDown") nextIndex = (index + 1) % options.length;
    else if (key === "ArrowLeft" || key === "ArrowUp") nextIndex = (index - 1 + options.length) % options.length;
    else if (key === "Home") nextIndex = 0;
    else if (key === "End") nextIndex = options.length - 1;

    if (nextIndex !== null) {
      event.preventDefault();
      setActiveIndex(nextIndex);
      buttonRefs.current[nextIndex]?.focus();
    }
  }

  return (
    <div className="not-prose my-8 rounded-[var(--radius-panel)] border border-brand/30 bg-brand/5 p-5 sm:p-6">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0 fill-none stroke-brand" strokeWidth="1.5">
          <circle cx="6" cy="6" r="4.75" />
          <circle cx="6" cy="6" r="1.25" className="fill-brand stroke-none" />
        </svg>
        Predict before you reveal
      </p>
      <p className="mt-3 font-display text-lg font-semibold leading-snug text-foreground sm:text-xl">
        {question}
      </p>

      <div role="radiogroup" aria-label={question} className="mt-4 flex flex-wrap gap-2">
        {options.map((option, index) => {
          const isSelected = option.value === selected;
          const isLocked = selected !== null && !isSelected;
          return (
            <button
              key={option.value}
              ref={(el) => {
                buttonRefs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={index === activeIndex ? 0 : -1}
              disabled={isLocked}
              onClick={() => commit(option.value, index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onFocus={() => setActiveIndex(index)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
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
        <div
          aria-live="polite"
          className={cn(
            // `panel-arrive` (globals.css section 9) animates this panel in
            // on mount. It only mounts once a prediction is committed, so the
            // mount *is* the trigger — no state, no effect, no frame-delayed
            // class flip, and reduced motion is handled globally.
            "panel-arrive mt-4 rounded-[var(--radius-panel)] border border-border bg-surface p-4 text-sm"
          )}
        >
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
