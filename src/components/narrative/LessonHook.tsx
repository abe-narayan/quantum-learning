import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

/**
 * MDX usage:
 * ```mdx
 * <LessonHook eyebrow="Why this matters">
 *   A single photon can go through two slits at once — and the pattern it
 *   leaves behind proves it.
 * </LessonHook>
 * ```
 * `eyebrow` is optional. Keep the statement itself to one or two sentences;
 * this is the HOOK beat of the lesson, not a summary.
 *
 * Placement matters as much as content: this must be the first thing in the
 * lesson body, before any heading (including a `## Motivation`-style one).
 * Per docs/UX_REVIEW.md P1-8, a meaningful fraction of existing usages land
 * *after* the first heading, which means the reader has already scrolled
 * past a heading and the table-of-contents has already registered its first
 * entry before this "opening moment" ever appears — a cold open that isn't
 * one. This component can't enforce document order from inside MDX; get the
 * placement right at the call site.
 */

/**
 * The opening moment of a lesson — a striking claim or question, set in the
 * display voice at a size nothing else in the prose body reaches. Lives in
 * the reading column (a lesson's prose is a fixed-width grid track; true
 * viewport-edge bleed here would fight the table-of-contents rail), so the
 * "full-bleed" feel comes from scale and confidence rather than literal
 * width — no border, no panel, just large type with room to breathe.
 *
 * Distinct from `Question`: this states something, it doesn't ask. Distinct
 * from `InsightBlock`: this opens a lesson, `InsightBlock` closes a train of
 * thought.
 */
export function LessonHook({
  eyebrow,
  children,
  className,
}: {
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("not-prose my-10 sm:my-14", className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <p
        className={cn(
          "text-balance font-display font-semibold leading-[1.05] text-foreground",
          "text-3xl sm:text-4xl lg:text-[3.25rem]",
          eyebrow && "mt-3"
        )}
      >
        {children}
      </p>
    </div>
  );
}
