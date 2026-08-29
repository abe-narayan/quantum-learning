import Link from "next/link";
import type { ProblemMeta } from "@/lib/problems/types";

/**
 * A compact list of problem links for embedding inside a lesson's prose —
 * deliberately smaller and plainer than the full `/problems` catalog's
 * `ProblemCard` grid, so it reads as part of the lesson flow rather than an
 * inserted widget. A pure Server Component (no hooks), same as
 * `QuantumStateDisplay`. Inherits the enclosing lesson's pillar identity —
 * declares no `data-pillar` of its own.
 */
export function PracticeLinks({ problems }: { problems: ProblemMeta[] }) {
  if (problems.length === 0) return null;

  return (
    <div className="not-prose my-6 rounded-panel border border-border bg-surface-muted/60 p-4">
      <span className="tech-label">Try it with instant feedback</span>
      <ul className="mt-3 space-y-2">
        {problems.map((problem) => (
          <li key={problem.slug}>
            <Link
              href={`/problems/${problem.slug}`}
              className="group flex min-h-11 items-center justify-between gap-3 rounded-(--radius-tight) border border-border bg-surface px-4 py-3 text-sm transition-colors duration-(--dur-fast) hover:border-pillar-edge hover:bg-surface-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
            >
              <span className="font-medium text-foreground group-hover:text-pillar-text">{problem.title}</span>
              <span className="tech-value shrink-0 text-xs text-subtle-foreground">{problem.estimatedMinutes} min</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
