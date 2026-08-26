"use client";

import { useState, type FormEvent } from "react";
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
 */
export function ProblemView({ problem }: { problem: Problem }) {
  const [rawAnswer, setRawAnswer] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const { progress, recordAttempt, revealHint, revealSolution } = useProblemProgress(problem.meta.slug);

  const solved = result?.status === "correct";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (solved) return;
    const validation = validateAnswer(problem, rawAnswer);
    setResult(validation);
    recordAttempt({ timestamp: Date.now(), submitted: rawAnswer, status: validation.status });
  }

  function handleRetry() {
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
        <form className="space-y-4" onSubmit={handleSubmit}>
          <AnswerInput problem={problem} value={rawAnswer} onChange={setRawAnswer} disabled={solved} />

          <div className="flex flex-wrap gap-3">
            {!solved ? <Button type="submit">Submit</Button> : null}
            {result && !solved ? (
              <Button type="button" variant="secondary" onClick={handleRetry}>
                Try Again
              </Button>
            ) : null}
          </div>

          {result ? <Feedback result={result} /> : null}
        </form>
      </Instrument>

      <HintPanel hints={problem.hints} revealedCount={progress.hintsRevealed} onReveal={handleRevealHint} />
      <SolutionPanel
        solution={problem.solution}
        explanation={problem.explanation}
        revealed={progress.solutionRevealed}
        onReveal={revealSolution}
      />
    </div>
  );
}
