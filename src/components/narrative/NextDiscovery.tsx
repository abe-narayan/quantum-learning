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
 * lesson's close (often just after `ChallengePrompt`). A filled pillar-wash
 * panel, the same family as `InsightBlock`, but pointed forward: an arrow
 * glyph instead of a spark, and a traveling highlight along the base rule
 * (`.trace-sweep`, already defined and reduced-motion-gated in globals.css
 * §9/§11 — reused here rather than adding a new keyframe) to suggest
 * momentum into the next lesson. Purely decorative — `aria-hidden` and
 * `data-decorative` — the text carries the actual meaning.
 */
export function NextDiscovery({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "not-prose my-10 rounded-[var(--radius-panel)] border border-pillar-edge bg-pillar-wash p-5 sm:p-6",
        className
      )}
    >
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-pillar">
        <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true" className="shrink-0 fill-none stroke-current" strokeWidth="1.4">
          <path d="M1.5 6.5h9M7 3l3.5 3.5L7 10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Next discovery
      </p>
      <div className="mt-2 text-sm leading-relaxed text-foreground sm:text-base">{children}</div>
      <div
        aria-hidden="true"
        data-decorative=""
        className="trace-sweep mt-4 h-px bg-[linear-gradient(90deg,transparent,var(--pillar-accent),transparent)] bg-[length:200%_100%]"
      />
    </div>
  );
}
