import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import type { ProblemMeta } from "@/lib/problems/types";

/**
 * A compact list of problem links for embedding inside a lesson's prose —
 * deliberately smaller and plainer than the full `/problems` catalog's
 * `ProblemCard` grid, so it reads as part of the lesson flow rather than
 * an inserted widget. A pure Server Component (no hooks), same as
 * `QuantumStateDisplay`.
 */
export function PracticeLinks({ problems }: { problems: ProblemMeta[] }) {
  if (problems.length === 0) return null;

  return (
    <div className="not-prose my-6 rounded-xl border border-border bg-surface-muted/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Try it with instant feedback</p>
      <ul className="mt-3 space-y-2">
        {problems.map((problem) => (
          <li key={problem.slug}>
            <Link
              href={`/problems/${problem.slug}`}
              className="group flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm transition-colors hover:border-brand/40 hover:bg-surface-muted"
            >
              <span className="font-medium text-foreground group-hover:text-brand">{problem.title}</span>
              <Badge className="shrink-0">{problem.estimatedMinutes} min</Badge>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
