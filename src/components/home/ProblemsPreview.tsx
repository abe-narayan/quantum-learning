import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const PREVIEW_PROBLEMS = [
  {
    title: "Foundations check",
    description: "Short quizzes on complex numbers, vector spaces, and inner products.",
    tag: "Quiz",
  },
  {
    title: "Single-qubit gates",
    description: "Predict the resulting state after a sequence of gate applications.",
    tag: "Practice set",
  },
  {
    title: "Algorithm design",
    description: "Trace through Grover's algorithm and explain what each step accomplishes.",
    tag: "Challenge",
  },
];

export function ProblemsPreview() {
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
              Problem sets and quizzes for each stage of the learning path —
              content is still being written.
            </p>
          </div>
          <Button href="/problems" variant="secondary" className="self-start sm:self-auto">
            View all problems
          </Button>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PREVIEW_PROBLEMS.map((problem) => (
            <Card key={problem.title} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-foreground">{problem.title}</h3>
                <Badge>{problem.tag}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{problem.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
