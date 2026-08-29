"use client";

import { useState } from "react";
import { Instrument } from "@/components/ui/Panel";
import { ScrollableMathText } from "./ScrollableMathText";
import type { Problem } from "@/lib/problems/types";
import type { ProblemProgress } from "@/lib/problems/progress/types";
import { useProblemsProgress } from "@/lib/problems/progress";
import { prerenderProblemMath } from "./renderProblemMath";
import { ProblemViewClient } from "./ProblemViewClient";

/**
 * A bounded, "checkpoint" framing over the existing Problems system — not a
 * separate quiz data model or grading path. Shown once, at the last lesson
 * of a course (see `LessonLayout`), over a small deterministic sample of
 * that course's own real problems (`getCourseCheckpointProblems`). Reuses
 * `ProblemView` for grading/hints/solution unchanged; the only new UI here
 * is the expand/collapse list and the aggregate "X of N solved" summary,
 * derived from the existing `ProgressStore` via `useProblemsProgress` — no
 * new persistence. Self-contained: rendered inside `LessonLayout`'s own
 * `PillarScope`, so it inherits that course's pillar identity for free and
 * declares no `data-pillar` of its own.
 *
 * KaTeX note. `/problems/[slug]` renders each problem's math on the server
 * (the `ProblemView` Server Component wrapper) so the runtime never reaches
 * that route's browser bundle. This component cannot use that wrapper — it is
 * a Client Component, and a Client Component cannot render a Server Component
 * — so it calls `prerenderProblemMath` itself and renders `ProblemViewClient`
 * directly. That keeps `katex` inside the checkpoint's own chunk, which
 * `LazyCourseCheckpoint`'s dynamic `import()` already holds off every lesson
 * page's eager graph (pinned by the LessonLayout case in
 * `src/lib/design/__tests__/clientBoundary.test.ts`). Rendering only happens
 * for the one problem that is open.
 */
export function CourseCheckpoint({ courseTitle, problems }: { courseTitle: string; problems: Problem[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const progress = useProblemsProgress(problems.map((problem) => problem.meta.slug));
  const solvedCount = progress.filter((p: ProblemProgress) => p.solved).length;
  const allSolved = problems.length > 0 && solvedCount === problems.length;

  if (problems.length === 0) return null;

  return (
    <Instrument
      className="not-prose mt-8"
      label="Checkpoint: test yourself before moving on"
      readout={
        <span
          className={
            allSolved
              ? "tech-value rounded-full bg-pillar-wash px-2.5 py-0.5 text-xs text-pillar-text"
              : "tech-value rounded-full bg-surface-muted px-2.5 py-0.5 text-xs text-muted-foreground"
          }
        >
          {solvedCount} of {problems.length} solved
        </span>
      }
    >
      <p className="text-sm text-muted-foreground">
        {problems.length} problems pulled from across {courseTitle} — a quick self-check, not new material.
      </p>

      <div className="mt-5 space-y-3">
        {problems.map((problem, index) => {
          const isOpen = openSlug === problem.meta.slug;
          const solved = progress[index]?.solved ?? false;
          const panelId = `checkpoint-${problem.meta.slug}`;
          return (
            <div key={problem.meta.slug} className="rounded-(--radius-tight) border border-border bg-surface">
              <button
                type="button"
                onClick={() => setOpenSlug(isOpen ? null : problem.meta.slug)}
                className="flex min-h-11 w-full items-center justify-between gap-3 rounded-(--radius-tight) px-4 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
                aria-expanded={isOpen}
                // Only while the panel is mounted — it is rendered
                // conditionally below, and an `aria-controls` IDREF that
                // resolves to nothing is invalid.
                aria-controls={isOpen ? panelId : undefined}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={
                      solved
                        ? "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pillar-wash text-pillar-text"
                        : "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border-strong text-[0.65rem] text-muted-foreground"
                    }
                  >
                    {solved ? (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M2 6.2 5 9l5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className="text-sm font-medium text-foreground">{problem.meta.title}</span>
                </span>
                <span className="tech-label !text-[0.6875rem]">{isOpen ? "Hide" : "Open"}</span>
              </button>

              {isOpen ? (
                <div id={panelId} className="space-y-4 border-t border-border p-4">
                  <ScrollableMathText text={problem.question.prompt} className="text-sm leading-relaxed text-foreground" />
                  <ProblemViewClient problem={problem} math={prerenderProblemMath(problem)} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </Instrument>
  );
}
