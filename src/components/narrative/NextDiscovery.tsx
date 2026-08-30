import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * MDX usage:
 * ```mdx
 * <NextDiscovery>
 *   Next: what happens when you entangle *three* particles instead of
 *   two — and why the result breaks an assumption Bell's theorem itself
 *   relies on.
 * </NextDiscovery>
 * ```
 */

/**
 * The forward hook — a teaser for what comes next, meant to sit at a
 * lesson's close (often just after `ChallengePrompt`). An arrow glyph, a
 * label, the teaser, and a traveling highlight along the base rule
 * (`.trace-sweep`, already defined and reduced-motion-gated in globals.css
 * §9/§11 — reused here rather than adding a new keyframe) to suggest
 * momentum into the next lesson. Purely decorative — `aria-hidden` and
 * `data-decorative` — the text carries the actual meaning.
 *
 * ## Why this is not a filled panel any more
 *
 * It used to be `rounded-panel border border-pillar-edge bg-pillar-wash`:
 * geometrically the same object as `InsightBlock`, separated from it only by
 * a 13px glyph (an arrow rather than a spark) and a label. Recounted across
 * the corpus on 2026-08-30, that put the two in a weight relationship
 * exactly backwards from their importance. `NextDiscovery` appears in
 * **219 of 219 lessons**: it is the boundary marker every lesson ends with,
 * chrome by definition. `InsightBlock` appears in **44**, and its whole brief
 * is "the single takeaway a reader should keep if they forget everything
 * else on the page." Drawn identically, the routine one borrowed the
 * emphatic one's authority, and the emphatic one lost the thing that made it
 * emphatic — being the only pillar-wash fill in the lesson body.
 *
 * So the fill and the border go, and the pillar-tinted top rule carries the
 * identity instead. The end of a lesson now reads as one continuous release:
 * `ChallengePrompt` (open, no box) into this (open, no box) into the footer
 * navigation, rather than open → boxed → boxed. Nothing is lost that was
 * carrying meaning: the label still names the beat, the arrow still points
 * forward, the trace sweep still runs along the base, and the teaser text is
 * unchanged. `InsightBlock` is now the one filled pillar-wash panel in the
 * prose vocabulary, which is what its rarity has always deserved.
 */
export function NextDiscovery({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("not-prose my-10 border-t border-pillar-edge pt-5", className)}>
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-pillar">
        <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true" className="shrink-0 fill-none stroke-current" strokeWidth="1.4">
          <path d="M1.5 6.5h9M7 3l3.5 3.5L7 10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Next discovery
      </p>
      {/* `text-base` at every width, not `text-sm sm:text-base`. `not-prose`
          excludes this subtree from the typography plugin's selectors but does
          not reset the inherited `font-size`, so the small-screen branch was
          setting the teaser 0.78x the 18px prose that leads into it. */}
      {/* `space-y-3` for the same reason `LessonHook` carries it: MDX parses
          a blank line inside this component's children as a paragraph break,
          Tailwind's preflight zeroes `p` margins, and `not-prose` above stops
          the typography plugin restoring them — so a two-paragraph teaser sat
          flush with no gap at all. A no-op for the single-paragraph case
          almost every call site uses. */}
      <div className="mt-2 space-y-3 text-base leading-relaxed text-foreground">{children}</div>
      <div
        aria-hidden="true"
        data-decorative=""
        className="trace-sweep mt-4 h-px"
      />
    </div>
  );
}
