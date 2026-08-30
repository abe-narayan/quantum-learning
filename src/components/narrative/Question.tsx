import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * MDX usage:
 * ```mdx
 * <Question>
 *   If measuring one particle instantly affects its entangled partner,
 *   why can't we use that to send a message faster than light?
 * </Question>
 * ```
 */

/**
 * A framed question meant to make the reader stop scrolling and actually
 * think before continuing — the QUESTION beat of the narrative arc. No
 * options, no commitment, no reveal: for that, use `PredictBeforeReveal`.
 *
 * Visually open rather than boxed (a single thick rule, not a panel) so it
 * reads as a pause in the text rather than another callout-shaped box —
 * `Callout`, `InteractiveSection` and `PredictBeforeReveal` are all closed
 * panels; this and `HistoricalMoment` are the margin-rule family instead.
 */
export function Question({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("not-prose my-10 border-l-4 border-pillar pl-5 sm:pl-7", className)}>
      {/* `div`, not `p`: MDX wraps a block of prose between this component's
          tags in its own `<p>`, and `<p><p>` is not parseable HTML. See
          LessonHook for the full note; every style here is inherited, so the
          rendering is unchanged. */}
      <div className="space-y-4 font-display text-2xl font-medium leading-snug text-foreground sm:text-3xl">
        {children}
      </div>
    </div>
  );
}
