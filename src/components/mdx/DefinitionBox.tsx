import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Formal definition, the `TheoremBox` sibling for naming a concept precisely
 * rather than stating a result about it. Same full-border header-strip
 * treatment as `TheoremBox` (distinct from `Callout`'s rounded, tinted
 * asides) so the two read as one "formal statement" family within Quantum
 * Mastery lessons; only the label color differs, so a scanning eye can tell
 * "this names something" from "this claims something" at a glance.
 */
export function DefinitionBox({
  title,
  className,
  children,
}: {
  title?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("not-prose my-8 rounded-lg border border-border bg-surface", className)}>
      <div className="border-b border-border bg-surface-muted px-5 py-3">
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Definition
          </span>
          {title && (
            <span className="font-display text-base font-semibold text-foreground sm:text-lg">
              {title}
            </span>
          )}
        </p>
      </div>
      <div className="space-y-3 px-5 py-4 text-sm leading-relaxed text-foreground">
        {children}
      </div>
    </div>
  );
}
