"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Instrument } from "@/components/ui/Panel";
import type { Problem } from "@/lib/problems/types";
import { validateAnswer } from "@/lib/problems/validators";
import type { ValidationResult } from "@/lib/problems/validators/types";
import { useProblemProgress } from "@/lib/problems/progress";
import { revealNextHint } from "@/lib/problems/hints";
import { AnswerInput } from "./AnswerInput";
import { Feedback } from "./Feedback";
import { HintPanel } from "./HintPanel";
import { SolutionPanel } from "./SolutionPanel";

/**
 * The interactive part of a problem — answer area, submit, feedback,
 * hints, solution. Title/badges/prompt/related-lesson are rendered by the
 * server-side `ProblemLayout` around this; this component owns only the
 * ephemeral, per-session UI state (`rawAnswer`, `result`). Persisted
 * progress (hints revealed, solution revealed, past attempts) comes from
 * `useProblemProgress`, which reads the `ProgressStore` abstraction —
 * never `localStorage` directly — so a future server-backed store is a
 * one-file swap.
 *
 * `lessonSlug`/`lessonTitle` are optional because the two callers differ:
 * `/problems/[slug]` resolves the home lesson server-side and passes it, so
 * a wrong answer has a one-click route to the material that explains it;
 * `CourseCheckpoint` renders inline *inside* that lesson already, where
 * sending the reader back to the page they are on would be nonsense.
 */
export function ProblemView({
  problem,
  lessonSlug,
  lessonTitle,
  prerequisiteAnchorId,
}: {
  problem: Problem;
  lessonSlug?: string;
  lessonTitle?: string;
  /** In-page id of this problem's `PrerequisiteReadout`, when the page around
   *  this view renders one (`/problems/[slug]` does; `CourseCheckpoint`, being
   *  inline inside a lesson, does not). Offered as a third route out of a
   *  wrong answer: "am I actually missing the background for this?" is a
   *  different question from "give me a hint", and the readout already answers
   *  it per-prerequisite with links. */
  prerequisiteAnchorId?: string;
}) {
  const [rawAnswer, setRawAnswer] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const { progress, recordAttempt, revealHint, revealSolution } = useProblemProgress(problem.meta.slug);

  const solved = result?.status === "correct";
  const hintsRemaining = problem.hints.length - progress.hintsRevealed;
  // Persisted, so it survives a reload and a return visit — the solution
  // shouldn't re-lock itself just because the reader closed the tab.
  const attempted = progress.attempts.length > 0 || result !== null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (solved) return;
    const validation = validateAnswer(problem, rawAnswer);
    setResult(validation);
    recordAttempt({ timestamp: Date.now(), submitted: rawAnswer, status: validation.status });
  }

  function handleClear() {
    setRawAnswer("");
    setResult(null);
  }

  function handleRevealHint() {
    revealHint(revealNextHint(progress.hintsRevealed, problem.hints.length));
  }

  return (
    <div className="space-y-5">
      {progress.solved && !result ? (
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-pillar-edge bg-pillar-wash px-3 py-1 text-xs font-medium text-pillar-text">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6.2 5 9l5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          You&rsquo;ve solved this before — try it again anytime
        </p>
      ) : null}

      <Instrument label="Your answer">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <AnswerInput problem={problem} value={rawAnswer} onChange={setRawAnswer} disabled={solved} />

            <div className="flex flex-wrap gap-3">
              {!solved ? (
                <Button type="submit" className="min-h-11">
                  Submit
                </Button>
              ) : null}
              {result && !solved ? (
                <Button type="button" variant="secondary" className="min-h-11" onClick={handleClear}>
                  Clear answer
                </Button>
              ) : null}
            </div>
          </div>

          <Feedback result={result} />
        </form>

        {/*
          The route out of a wrong answer, put where the wrong answer is.
          Both destinations already existed — the hint ladder is one panel
          below, the lesson link is at the very bottom of the page under the
          solution — but a reader who has just been told "Not quite" is
          looking at the feedback box, not scrolling to inventory the page.
          Rendered outside the `role="status"` region above deliberately:
          controls inside a live region get re-announced on every update.
        */}
        {result && result.status !== "correct" ? (
          <div className="mt-4 border-t border-border pt-4">
            <p className="tech-label">Next step</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Your answer is still in the box — edit it and submit again as many times as you like. Nothing
              is scored and nothing is recorded against you.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              {hintsRemaining > 0 ? (
                <Button variant="secondary" size="sm" className="min-h-11" onClick={handleRevealHint}>
                  Reveal hint {progress.hintsRevealed + 1} of {problem.hints.length}
                </Button>
              ) : !progress.solutionRevealed ? (
                <Button variant="secondary" size="sm" className="min-h-11" onClick={revealSolution}>
                  Reveal full solution
                </Button>
              ) : null}
              {lessonSlug && lessonTitle ? (
                <Link
                  href={`/lessons/${lessonSlug}`}
                  className="inline-flex min-h-11 items-center rounded-[--radius-tight] text-sm text-pillar-text underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
                >
                  Re-read &ldquo;{lessonTitle}&rdquo;
                </Link>
              ) : null}
              {prerequisiteAnchorId ? (
                <a
                  href={`#${prerequisiteAnchorId}`}
                  className="inline-flex min-h-11 items-center rounded-[--radius-tight] text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
                >
                  What this builds on
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </Instrument>

      <HintPanel hints={problem.hints} revealedCount={progress.hintsRevealed} onReveal={handleRevealHint} />
      <SolutionPanel
        solution={problem.solution}
        explanation={problem.explanation}
        revealed={progress.solutionRevealed}
        attempted={attempted}
        onReveal={revealSolution}
      />
    </div>
  );
}
