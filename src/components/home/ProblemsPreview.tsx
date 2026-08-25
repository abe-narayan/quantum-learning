import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getAllProblemMeta, getProblem } from "@/lib/problems/registry";

const PROBLEM_TYPE_LABEL: Record<string, string> = {
  numeric: "Numeric",
  "multiple-choice": "Multiple choice",
  conceptual: "Conceptual",
};

const FEATURED_SLUGS = [
  "bloch-point-1-0-0-state",
  "grover-success-probability-closed-form",
  "global-phase-invariance",
];

export function ProblemsPreview() {
  const totalProblems = getAllProblemMeta().length;
  const featured = FEATURED_SLUGS.map((slug) => getProblem(slug)).filter(
    (p): p is NonNullable<typeof p> => p !== undefined
  );

  return (
    <section className="border-t border-border bg-surface-muted/60 py-20 sm:py-24">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
              Problems &amp; challenges
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              Test what you actually understand
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              {totalProblems} practice problems across every course, each graded exactly and
              tied to a specific lesson, with progressive hints and a worked solution.
            </p>
          </div>
          <Button href="/problems" variant="secondary" className="self-start sm:self-auto">
            View all problems
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {featured.map((problem) => (
            <Link key={problem.meta.slug} href={`/problems/${problem.meta.slug}`} className="block">
              <Card className="flex h-full flex-col gap-3 transition-colors hover:border-brand/40">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-foreground">{problem.meta.title}</h3>
                  <Badge>{PROBLEM_TYPE_LABEL[problem.meta.problemType] ?? problem.meta.problemType}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {problem.meta.difficulty} · {problem.meta.estimatedMinutes} min
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
