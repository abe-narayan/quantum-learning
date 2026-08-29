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
 * The option row is a real WAI-ARIA radiogroup: a roving tabindex, so the
 * whole group is one stop in the page's Tab order and
 * Left/Right/Up/Down/Home/End move between options inside it, rather than
 * each button being its own Tab stop.
 *
 * Those arrow keys move *focus only*, and deliberately do not also select —
 * which is the one place this departs from a native `<input type="radio">`
 * group (and from `PresetToggle`, which does select-on-arrow). Selection
 * here is a one-way commit that reveals the answer and locks the group, so
 * follow-focus-selects would fire that commit on the reader's first arrow
 * press, before they had chosen anything — the ARIA Authoring Practices
 * exception for exactly this case ("when selection follows focus would
 * cause an unwanted side effect"). Enter/Space on the focused option is the
 * deliberate commit. Once a value is committed the unselected options become
 * inert (`disabled`), which also removes them from the tab order, so nothing
 * further needs managing there.
 *
 * Nothing in the pre-commit DOM reveals which option is correct:
 * `correctValue` is only ever compared, never rendered, and `explanation`
 * has no element until a prediction exists. So neither view-source nor a
 * screen reader can read ahead — the reader has to actually commit. (React
 * does serialize both props into this client component's flight payload, as
 * it does for every client component; that is a property of the boundary,
 * not something this component can render its way out of. It is not in the
 * accessibility tree and not in the rendered markup.)
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
    <div className="not-prose my-8 rounded-panel border border-brand/30 bg-brand/5 p-5 sm:p-6">
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
                // The border is unconditional, and `border-transparent` on the
                // selected pill rather than no border at all. Previously only
                // the *unselected* options carried `border border-border`, so
                // committing an answer shrank that option by 2px in both axes
                // and nudged every option after it in the wrap row — a layout
                // shift at the exact moment the reader commits, which is the
                // one moment in this component they are looking at the thing
                // that moves, and it happens on all 209 lessons that use this
                // block. `PresetToggle` fixed precisely this and documents the
                // same reasoning; the only difference is that a `bg-brand` fill
                // needs no visible edge of its own, so the reserved border is
                // transparent instead of tinted. (An `outline` would also
                // reserve nothing, but it draws outside the box and would sit
                // under the focus ring; a transparent border is the same
                // technique the glossary's `:target` row already uses to keep
                // a highlight from shifting anything.)
                "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium leading-tight transition-colors",
                isSelected
                  ? "border-transparent bg-brand text-brand-foreground"
                  : "border-border bg-surface text-muted-foreground disabled:opacity-60",
                selected === null && "hover:bg-surface-muted"
              )}
            >
              {/* "Which one did I pick" is carried by a shape that appears (a
                  check) as well as by the fill, so the committed answer is
                  still identifiable in grayscale or with a color-vision
                  deficiency — and, once committed, the locked options are
                  distinguished by more than a 60% opacity difference. */}
              {isSelected ? (
                <svg
                  aria-hidden="true"
                  data-decorative=""
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 8.5 6.5 11.5 12.5 4.5" />
                </svg>
              ) : null}
              {option.label}
            </button>
          );
        })}
      </div>

      {/* The live region is the *wrapper*, mounted empty from the very first
          render; only the panel inside it appears on commit. That ordering is
          the whole point. A live region is not a property of an element, it
          is a subscription the assistive tech sets up when it first sees the
          container — so an element that arrives already carrying both
          `aria-live` and its content is, for NVDA and JAWS, a region that was
          never being watched, and the reveal goes unannounced. It previously
          did exactly that: the whole `aria-live` div mounted at the moment of
          commit. Sighted readers saw the answer; a screen-reader user pressed
          Space, heard the radio state flip, and got nothing back — on the
          device that carries this lesson's single most important moment,
          across 209 uses.

          `aria-atomic` because the reveal is one statement, not two: without
          it only the changed subtree is spoken, which can strand "you
          predicted Quarters" from the explanation that gives it meaning. */}
      <div aria-live="polite" aria-atomic="true">
        {selectedOption ? (
          <div
            className={cn(
              // `panel-arrive` (globals.css section 9) animates this panel in
              // on mount. It only mounts once a prediction is committed, so
              // the mount *is* the trigger — no state, no effect, no
              // frame-delayed class flip, and reduced motion is handled
              // globally. The margin lives here rather than on the live
              // region above so the empty pre-commit wrapper takes up no
              // space at all.
              "panel-arrive mt-4 rounded-panel border border-border bg-surface p-4 text-sm"
            )}
          >
            <p className="font-semibold text-foreground">
              You predicted {selectedOption.label}
              {selected === correctValue ? " — that's exactly what happens." : " — here's what actually happens."}
            </p>
            <p className="mt-2 text-muted-foreground">{explanation}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
