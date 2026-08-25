import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Provenance = "cited" | "derived";

// Quantum Mastery lessons draw an explicit line between a result the lesson
// proves in full and one it invokes from outside its own scope (e.g. this
// platform's own "Riesz-Fischer, cited here, not proved" / "Stone's theorem,
// cited, not proved here" convention). `cited` stays neutral -- being out of
// scope isn't a shortcoming -- while `derived` picks up the accent color,
// since a full derivation is the course's own payoff.
const PROVENANCE_LABEL: Record<Provenance, string> = {
  cited: "Cited, not derived here",
  derived: "Derived below",
};

const PROVENANCE_STYLES: Record<Provenance, string> = {
  cited: "border-border bg-surface-muted text-muted-foreground",
  derived: "border-accent/40 bg-accent/10 text-accent",
};

/**
 * Formal theorem statement, styled as a distinct sibling of `Callout`: a
 * full-border header-strip panel (not a colored tint) rather than a rounded,
 * tinted aside, so it reads as "graduate-level formal statement" rather than
 * another pedagogical note. `title` names the theorem (e.g. "Von Neumann's
 * deficiency-index theorem"); the optional `provenance` badge says whether
 * the lesson proves it or is invoking it from outside its own scope.
 */
export function TheoremBox({
  title,
  provenance,
  className,
  children,
}: {
  title?: string;
  provenance?: Provenance;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("not-prose my-8 rounded-lg border border-border bg-surface", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5 border-b border-border bg-surface-muted px-5 py-3">
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Theorem
          </span>
          {title && (
            <span className="font-display text-base font-semibold text-foreground sm:text-lg">
              {title}
            </span>
          )}
        </p>
        {provenance && (
          <span
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide",
              PROVENANCE_STYLES[provenance]
            )}
          >
            {PROVENANCE_LABEL[provenance]}
          </span>
        )}
      </div>
      <div className="space-y-3 px-5 py-4 text-sm leading-relaxed text-foreground">
        {children}
      </div>
    </div>
  );
}
