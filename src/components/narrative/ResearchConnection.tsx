import type { ReactNode } from "react";
import { TechLabel } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

/**
 * MDX usage:
 * ```mdx
 * <ResearchConnection
 *   title="Error rates below the surface-code threshold"
 *   source="Google Quantum AI, Nature (2023)"
 *   url="https://www.nature.com/articles/s41586-022-05434-1"
 * >
 *   The logical qubit in this experiment got *more* reliable as it got
 *   larger — the first experimental evidence that scaling actually helps,
 *   not just theory predicting it should.
 * </ResearchConnection>
 * ```
 * `url` is optional; when present, `source` becomes the citation link.
 */

/**
 * "This is live research" — a callout that carries a real paper or lab
 * result, set in the technical/citation voice rather than as pedagogical
 * prose. The header strip's pulsing dot reuses the site's existing
 * `.field-breathe` ambient-motion class (already reduced-motion-gated in
 * globals.css §9/§11) rather than defining a new animation, signalling
 * "current, ongoing" without adding any new motion primitive.
 */
export function ResearchConnection({
  title,
  source,
  url,
  children,
  className,
}: {
  title: string;
  source: string;
  url?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "not-prose my-8 overflow-hidden rounded-[var(--radius-panel)] border border-border bg-surface",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-border bg-surface-muted px-5 py-3">
        <span aria-hidden="true" data-decorative="" className="field-breathe h-1.5 w-1.5 rounded-full bg-pillar-strong" />
        <TechLabel className="text-pillar">Research connection</TechLabel>
      </div>
      <div className="px-5 py-4">
        <p className="font-display text-base font-semibold text-foreground sm:text-lg">{title}</p>
        <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
        <p className="mt-3 text-xs text-subtle-foreground">
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-border underline-offset-2 hover:text-foreground"
            >
              {source}
            </a>
          ) : (
            source
          )}
        </p>
      </div>
    </div>
  );
}
