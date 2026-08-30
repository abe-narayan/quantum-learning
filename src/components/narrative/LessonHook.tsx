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
      {/* `div`, not `p`. MDX parses a block of prose between this component's
          tags as markdown, so `children` arrives already wrapped in its own
          `<p>` — and `<p><p>…</p></p>` is not parseable HTML. The browser's
          parser closes the outer `p` at the inner start tag, so the server
          HTML a reader sees before hydration (and the only HTML a reader
          without JavaScript ever sees) puts the hook text in a bare sibling
          paragraph with none of the display type below applied to it, then
          React finds an empty `<p>` where it rendered a filled one and
          discards the server tree for a client re-render. Every one of the
          219 lessons that opens with this component was hitting it. The
          styles here are all inherited properties (`text-wrap`, `font-*`,
          `line-height`, `color`, `font-size`), so they reach the inner `p`
          from a `div` exactly as they did from a `p`. Same reason
          `ResearchConnection` already wraps its MDX children in a `div`. */}
      <div
        className={cn(
          "text-balance font-display font-semibold leading-[1.05] text-foreground",
          // Multiple markdown paragraphs inside the hook would otherwise sit
          // flush against each other: Tailwind's preflight zeroes `p` margins
          // and `not-prose` above keeps the typography plugin from restoring
          // them. No-op for the single-paragraph case every call site uses.
          "space-y-4",
          // `lg:text-5xl` (3rem), not `lg:text-[3.25rem]`. 3.25rem was the only
          // one on the site, sat between `text-5xl` and `text-6xl` with no
          // stated reason, and bought 4px nobody can name. On the scale it
          // still stands well clear of everything else in the prose body (h2
          // is `text-3xl`) and still reads as subordinate to the lesson's own
          // h1, which is `SectionTitle size="xl"` at `lg:text-6xl` (3.75rem).
          "text-3xl sm:text-4xl lg:text-5xl",
          eyebrow && "mt-3"
        )}
      >
        {children}
      </div>
    </div>
  );
}
