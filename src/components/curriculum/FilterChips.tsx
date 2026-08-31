"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * ============================================================
 * FilterChips — the curriculum's filter control
 * ============================================================
 * A row of mutually-exclusive filter chips. Deliberately *not*
 * `components/problems/ProblemFilters`, which the curriculum explorer used to
 * borrow, for three reasons that all matter here:
 *
 *   1. **Touch target.** `ProblemFilters` chips are `py-1.5 text-sm` — about
 *      34px tall, under the 44px minimum. These are `min-h-11`.
 *   2. **State is carried by shape, not just color.** `ProblemFilters`
 *      documents a "filled/outline tick" but never renders one — its only
 *      visual state channel is the border/background hue. Every chip here
 *      carries a real mark: a filled disc inside a ring when selected, an
 *      empty ring when not. That survives grayscale, protanopia, and a forced
 *      high-contrast mode, exactly like `DifficultyMark`'s tick ladder does.
 *   3. **The selected chip's border actually exists.** `ProblemFilters` styles
 *      it `border-pillar-accent` — not a registered Tailwind color (the ramp
 *      is exposed as `pillar` / `pillar-edge` / `pillar-wash` / …; `pillar`
 *      *is* `--pillar-accent`), so that class compiles to nothing and the
 *      selected state silently loses its outline. This uses `border-pillar`.
 *
 * `aria-pressed` is what a screen reader announces, so the state is never
 * color-only in the accessibility tree either. `count` renders the number of
 * things behind each option so a reader can see a filter is empty *before*
 * choosing it rather than after — the single biggest source of "is this
 * broken?" on a filter row.
 */

export type FilterOption<T extends string> = {
  id: T;
  label: string;
  /** How many items this option would leave. Rendered as a quiet readout. */
  count?: number;
  /**
   * An optional glyph for options that already have one elsewhere on the page,
   * so the chip and the thing it filters read as the same category. Added for
   * `/current-quantum`, whose category chips carry the same icon its cards do;
   * that page used to render its own copy of this control with a
   * `fieldset`/`legend` (see the note in `CurrentQuantumCatalog`) and the icon
   * was the one thing it had that this component did not.
   *
   * Decoration only, never a state or meaning channel: the label beside it
   * always says the same thing in words, and the selected state stays the
   * filled disc plus `aria-pressed`. Pass an already-`aria-hidden` node.
   */
  icon?: ReactNode;
};

export function FilterChips<T extends string>({
  label,
  options,
  selected,
  onChange,
  className,
  action,
  countNoun = "results",
}: {
  label: string;
  options: FilterOption<T>[];
  selected: T;
  onChange: (id: T) => void;
  className?: string;
  /** Optional trailing control (e.g. a "Clear filter" button). */
  action?: ReactNode;
  /**
   * What `count` counts, e.g. "courses" or "lessons". Rendered `sr-only`
   * after the number: visually the bare figure is unambiguous beside a
   * heading that already says what the page lists, but a screen reader
   * otherwise announces the chip as "All, 12" — a number with no
   * unit, which is the same defect as an unlabelled readout. Always plural;
   * a count of 1 is rare enough here that a singular form is not worth a
   * second prop.
   */
  countNoun?: string;
}) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="tech-label">{label}</p>
        {action}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={label}>
        {options.map((option) => {
          const isSelected = selected === option.id;
          const isEmpty = option.count === 0;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              aria-pressed={isSelected}
              className={cn(
                // `flex-wrap`: at 200% text zoom a chip's own content — the
                // shape dot, an option label that can run to two words, and
                // a count — no longer always fits one line (WCAG 1.4.4), and
                // unlike the row above (already `flex-wrap`), a single chip
                // wide enough to overflow on its own gets no relief from the
                // row wrapping around it. Letting the chip itself wrap keeps
                // the count on screen instead of past `.instrument`'s
                // `overflow-hidden`.
                "inline-flex min-h-11 flex-wrap items-center gap-2 rounded-full border px-3.5 text-sm transition-colors duration-(--dur-fast)",
                isSelected
                  ? "border-pillar bg-pillar-wash font-medium text-pillar-text"
                  : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
                // A level with nothing behind it stays selectable (choosing it
                // is how you find that out for certain) but reads as
                // provisional. A dashed edge, not the `opacity-60` this used
                // to carry: fading the whole chip dimmed its *text* too, which
                // pushed `text-muted-foreground` on `--surface` under the 4.5:1
                // floor to say something the "0" beside it already says.
                // Dashed is a shape channel and costs no contrast.
                !isSelected && isEmpty && "border-dashed"
              )}
            >
              {/* The shape channel. `aria-hidden` because `aria-pressed`
                  already carries this state to assistive tech; announcing it
                  twice is noise. */}
              <span
                aria-hidden="true"
                data-decorative=""
                className={cn(
                  "flex h-3 w-3 shrink-0 items-center justify-center rounded-full border",
                  isSelected ? "border-pillar" : "border-border-strong"
                )}
              >
                {isSelected ? <span className="h-1.5 w-1.5 rounded-full bg-pillar" /> : null}
              </span>
              {option.icon}
              {option.label}
              {typeof option.count === "number" ? (
                <span className="font-tech text-micro tabular-nums text-subtle-foreground">
                  {option.count}
                  <span className="sr-only"> {countNoun}</span>
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
