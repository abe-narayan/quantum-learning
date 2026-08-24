"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { MathText } from "@/components/ui/MathText";
import type { Problem } from "@/lib/problems/types";
import type { ProblemProgress } from "@/lib/problems/progress/types";
import { useProblemsProgress } from "@/lib/problems/progress";
import { ProblemView } from "./ProblemView";

/**
 * A bounded, "checkpoint" framing over the existing Problems system — not a
 * separate quiz data model or grading path. Shown once, at the last lesson
 * of a course (see `LessonLayout`), over a small deterministic sample of
 * that course's own real problems (`getCourseCheckpointProblems`). Reuses
 * `ProblemView` for grading/hints/solution unchanged; the only new UI here
 * is the expand/collapse list and the aggregate "X of N solved" summary,
 * derived from the existing `ProgressStore` via `useProblemsProgress` — no
 * new persistence.
 */
export function CourseCheckpoint({ courseTitle, problems }: { courseTitle: string; problems: Problem[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const progress = useProblemsProgress(problems.map((problem) => problem.meta.slug));
  const solvedCount = progress.filter((p: ProblemProgress) => p.solved).length;
  const allSolved = problems.length > 0 && solvedCount === problems.length;

  if (problems.length === 0) return null;

  return (
    <div className="not-prose mt-8 rounded-2xl border border-border bg-surface-muted/60 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">Checkpoint: test yourself before moving on</p>
        <Badge tone={allSolved ? "brand" : "neutral"}>
          {solvedCount} of {problems.length} solved
        </Badge>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {problems.length} problems pulled from across {courseTitle} — a quick self-check, not new material.
      </p>

      <div className="mt-5 space-y-3">
        {problems.map((problem, index) => {
          const isOpen = openSlug === problem.meta.slug;
          const solved = progress[index]?.solved ?? false;
          return (
            <div key={problem.meta.slug} className="rounded-xl border border-border bg-surface p-4">
              <button
                type="button"
                onClick={() => setOpenSlug(isOpen ? null : problem.meta.slug)}
                className="flex w-full items-center justify-between gap-3 text-left"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-2">
                  <Badge tone={solved ? "brand" : "neutral"}>{solved ? "Solved" : `Q${index + 1}`}</Badge>
                  <span className="text-sm font-medium text-foreground">{problem.meta.title}</span>
                </span>
                <span className="text-xs text-muted-foreground">{isOpen ? "Hide" : "Open"}</span>
              </button>

              {isOpen ? (
                <div className="mt-4 space-y-4 border-t border-border pt-4">
                  <MathText text={problem.question.prompt} className="text-sm leading-relaxed text-foreground" />
                  <ProblemView problem={problem} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
