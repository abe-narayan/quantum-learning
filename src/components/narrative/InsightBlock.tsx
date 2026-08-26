import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * MDX usage:
 * ```mdx
 * <InsightBlock>
 *   Superposition isn't the particle being in two places — it's the
 *   probability *amplitudes* for each place adding together.
 * </InsightBlock>
 * ```
 */

/**
 * "The idea in one sentence" — the single takeaway a reader should keep even
 * if they forget everything else on the page. Visually distinct from
 * `Callout`: this isn't a note, warning or correction (no severity, no
 * icon-per-type), it's an anchor point, so it gets one confident treatment —
 * a filled pillar-tinted panel with a spark glyph — rather than `Callout`'s
 * escalating border language.
 */
export function InsightBlock({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "not-prose my-8 flex gap-3 rounded-[var(--radius-panel)] border border-pillar-edge bg-pillar-wash p-5 sm:p-6",
        className
      )}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        aria-hidden="true"
        className="mt-1 shrink-0 text-pillar"
      >
        <path
          d="M7.5 0v3.4M7.5 11.6V15M0 7.5h3.4M11.6 7.5H15M2.2 2.2l2.4 2.4M10.4 10.4l2.4 2.4M12.8 2.2l-2.4 2.4M4.6 10.4l-2.4 2.4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <circle cx="7.5" cy="7.5" r="2.6" fill="currentColor" />
      </svg>
      <p className="text-base font-medium leading-snug text-foreground sm:text-lg">{children}</p>
    </div>
  );
}
