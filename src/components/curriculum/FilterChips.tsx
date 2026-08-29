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
};

export function FilterChips<T extends string>({
  label,
  options,
  selected,
  onChange,
  className,
  action,
}: {
  label: string;
  options: FilterOption<T>[];
  selected: T;
  onChange: (id: T) => void;
  className?: string;
  /** Optional trailing control (e.g. a "Clear filter" button). */
  action?: ReactNode;
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
                "inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors duration-(--dur-fast)",
                isSelected
                  ? "border-pillar bg-pillar-wash font-medium text-pillar-text"
                  : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground",
                // A level with nothing behind it stays selectable (choosing it
                // is how you find that out for certain) but reads as thin.
                !isSelected && isEmpty && "opacity-60"
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
              {option.label}
              {typeof option.count === "number" ? (
                <span className="font-tech text-[0.65rem] tabular-nums text-subtle-foreground">
                  {option.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
