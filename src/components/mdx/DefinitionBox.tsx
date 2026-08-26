import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TechLabel } from "@/components/ui/Typography";

/**
 * MDX usage:
 * ```mdx
 * <DefinitionBox title="Self-adjoint operator">
 *   An operator $A$ such that $A = A^\dagger$ *and* $\mathrm{dom}(A) =
 *   \mathrm{dom}(A^\dagger)$.
 * </DefinitionBox>
 * ```
 *
 * Formal definition, the `TheoremBox` sibling for naming a concept precisely
 * rather than stating a result about it. Same full-border header-strip
 * treatment as `TheoremBox` (distinct from `Callout`'s rounded, tinted
 * asides) so the two read as one "formal statement" family within Quantum
 * Mastery lessons; only the label color differs, so a scanning eye can tell
 * "this names something" from "this claims something" at a glance. The left
 * edge picks up the ambient lesson pillar so the panel still feels native to
 * whichever course it's in, without touching that note/claim distinction.
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
    <div
      className={cn(
        "not-prose my-8 overflow-hidden rounded-[var(--radius-panel)] border border-border border-l-2 border-l-pillar-edge bg-surface",
        className
      )}
    >
      <div className="border-b border-border bg-surface-muted px-5 py-3">
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <TechLabel className="text-accent">Definition</TechLabel>
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
