import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ProblemDifficulty, ProblemMeta, ProblemType } from "@/lib/problems/types";

const DIFFICULTY_LABEL: Record<ProblemDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const TYPE_LABEL: Record<ProblemType, string> = {
  "multiple-choice": "Multiple Choice",
  numeric: "Numeric",
  conceptual: "Short Answer",
};

export function ProblemCard({ problem }: { problem: ProblemMeta }) {
  return (
    <Link href={`/problems/${problem.slug}`} className="group block h-full">
      <Card className="h-full transition-colors group-hover:border-brand/40 group-hover:bg-surface-muted">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-brand">{problem.title}</h3>
          <Badge tone="brand">{DIFFICULTY_LABEL[problem.difficulty]}</Badge>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{TYPE_LABEL[problem.problemType]}</span>
          <span aria-hidden="true">·</span>
          <span>{problem.estimatedMinutes} min</span>
        </div>
        {problem.tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {problem.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        ) : null}
      </Card>
    </Link>
  );
}
