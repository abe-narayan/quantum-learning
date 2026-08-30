"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Instrument } from "@/components/ui/Panel";
import type { Problem } from "@/lib/problems/types";
import type { ProblemMath } from "./mathRuns";
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
 *
 * This is the `"use client"` boundary itself, which is why it takes `math`
 * (see `mathRuns.ts`) rather than rendering the problem's `$…$` segments:
 * everything statically below this file is downloaded before the reader
 * touches anything, and `katex` is 268KB / 74.1KB gzip of that. The server
 * wrapper `ProblemView` renders the math and hands the strings down; the
 * eager-graph guard in `src/lib/design/__tests__/clientBoundary.test.ts`
 * fails if any import here re-opens the chain.
 */
/** Where a solved problem sends the reader next. Resolved by `ProblemView`
 *  from the meta-only registry; see `nextProblemAfter` there. */
export type NextProblem = { slug: string; title: string };

export function ProblemViewClient({
  problem,
  math,
  lessonSlug,
  lessonTitle,
  prerequisiteAnchorId,
  nextProblem,
}: {
  problem: Problem;
  /** This problem's math, already rendered to KaTeX HTML. */
  math: ProblemMath;
  lessonSlug?: string;
  lessonTitle?: string;
  /** In-page id of this problem's `PrerequisiteReadout`, when the page around
   *  this view renders one (`/problems/[slug]` does; `CourseCheckpoint`, being
   *  inline inside a lesson, does not). Offered as a third route out of a
   *  wrong answer: "am I actually missing the background for this?" is a
   *  different question from "give me a hint", and the readout already answers
   *  it per-prerequisite with links. */
  prerequisiteAnchorId?: string;
  /** The problem to offer once this one is solved. Absent inside a
   *  `CourseCheckpoint`, which sits in a lesson that has its own next step. */
  nextProblem?: NextProblem;
}) {
  const [rawAnswer, setRawAnswer] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  // How many times Submit has been pressed this session. Not a display value
  // and not persisted — it exists only to give `Feedback` something that
  // changes on every submission, so a repeat of the same wrong answer still
  // mutates the live region and is still announced. See `submissionId` there.
  const [submissionCount, setSubmissionCount] = useState(0);
  /** Whether a non-empty answer has been submitted in this session. */
  const [hasRealAttempt, setHasRealAttempt] = useState(false);
  const { progress, recordAttempt, revealHint, revealSolution } = useProblemProgress(problem.meta.slug);

  const solved = result?.status === "correct";
  const hintsRemaining = problem.hints.length - progress.hintsRevealed;
  // Persisted, so it survives a reload and a return visit: the solution
  // shouldn't re-lock itself just because the reader closed the tab. The
  // second disjunct keeps the gate live in this session even when storage is
  // unavailable (private mode, or a full origin), where `attempts` can never
  // grow.
  //
  // `hasRealAttempt`, not `result !== null`. An empty submission is still
  // graded and still answered, so it used to set `result` and open the gate:
  // one click on an untouched field revealed the worked solution, which is the
  // whole thing this gate exists to prevent.
  const attempted = progress.attempts.length > 0 || hasRealAttempt;

  // A correct answer unmounts the Submit button — the button the reader just
  // pressed, and the element holding keyboard focus. Nothing takes its place
  // (Clear answer only renders while the answer is still wrong), so focus
  // fell to <body>: the reader's next Tab restarted from the top of the page,
  // past the whole problem they just solved. The same failure `HintPanel`,
  // `SolutionPanel` and `ProblemsCatalog` each already fix in their own
  // unmounting control, fixed the same way — `tabIndex={-1}` + `.focus()` on
  // the thing that replaced it.
  //
  // Only on the transition into `correct`, never on a wrong answer: there the
  // Submit button is still mounted and still focused, and a reader who is
  // about to edit and resubmit should not be moved away from it. That does
  // mean the success message can be spoken twice — once by the live region,
  // once as the newly focused element — which is the accepted trade for not
  // dropping focus, and it happens at most once per problem.
  //
  // `solved` is derived from `result`, this session's state, so it is false on
  // mount even for a problem solved on an earlier visit: a returning reader is
  // never yanked into the feedback box by persisted progress.
  const feedbackRef = useRef<HTMLDivElement>(null);
  const wasSolved = useRef(solved);
  useEffect(() => {
    if (solved && !wasSolved.current) feedbackRef.current?.focus();
    wasSolved.current = solved;
  }, [solved]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (solved) return;
    const validation = validateAnswer(problem, rawAnswer);
    setResult(validation);
    setSubmissionCount((count) => count + 1);

    // An empty submission is still graded and still answered ("Enter an
    // answer" is the useful reply), but it counts as neither an attempt nor a
    // try for the solution gate. Pressing Submit on an untouched field used to
    // do both, so one click revealed the worked solution, which is the whole
    // thing the gate exists to prevent.
    //
    // Nothing else reads the attempt log's contents: its only two consumers,
    // `attempted` here and the "started" filter in `ProblemsCatalog`, both ask
    // solely whether it is non-empty.
    if (rawAnswer.trim() === "") return;

    setHasRealAttempt(true);
    recordAttempt({ timestamp: Date.now(), submitted: rawAnswer, status: validation.status });
  }

  // "Clear answer" is the third self-unmounting control on this page, and it
  // was the one still missing the fix the other two carry: it renders only
  // while `result && !solved`, so activating it removes the button the reader
  // is standing on and focus falls to `<body>` — their next Tab restarts from
  // the top of the page, and the feedback box and "Next step" block vanish
  // from under them with nothing announced. The field is both the element
  // that survives the change and the place the reader is trying to get to, so
  // that is where focus goes. Called straight from the handler rather than
  // from an effect: the field does not unmount, so its node is the same one
  // before and after the state change.
  const answerField = useRef<HTMLElement | null>(null);
  const setAnswerField = useCallback((node: HTMLElement | null) => {
    answerField.current = node;
  }, []);

  function handleClear() {
    setRawAnswer("");
    setResult(null);
    answerField.current?.focus();
  }

  // "The reader pressed a reveal control", for the two panels whose focus
  // moves depend on it. They cannot infer it from their own `revealed` /
  // `revealedCount` props: those come from `useProblemProgress`, whose
  // `getServerSnapshot` is `EMPTY_PROGRESS`, so persisted progress arrives as
  // a false→true transition on the post-hydration catch-up render and is
  // indistinguishable from a click by value alone. Set here rather than
  // inside the panels because both reveals have two call sites — the panel's
  // own control and the "Next step" block below — and only one of them is
  // inside the panel. Refs, not state: nothing renders from these.
  const hintRevealIntent = useRef(false);
  const solutionRevealIntent = useRef(false);

  function handleRevealHint() {
    hintRevealIntent.current = true;
    revealHint(revealNextHint(progress.hintsRevealed, problem.hints.length));
  }

  function handleRevealSolution() {
    solutionRevealIntent.current = true;
    revealSolution();
  }

  return (
    <div className="space-y-5">
      {progress.solved && !result ? (
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-pillar-edge bg-pillar-wash px-3 py-1 text-xs font-medium text-pillar-text">
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6.2 5 9l5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          You&rsquo;ve solved this before. Try it again anytime.
        </p>
      ) : null}

      <Instrument label="Your answer">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <AnswerInput
              problem={problem}
              optionMath={math.options}
              value={rawAnswer}
              onChange={setRawAnswer}
              disabled={solved}
              fieldRef={setAnswerField}
            />

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

          {/* `math.feedback` is keyed by the authored string, which is all a
              `ValidationResult` carries; an unauthored message (every one the
              validators compose themselves) misses the map and renders as
              plain text. See `mathRuns.ts`. */}
          <Feedback
            result={result}
            math={math.feedback}
            resultRef={feedbackRef}
            submissionId={submissionCount}
          />
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
        {/*
          The success path's own onward block, and the reason it exists: until
          it did, the "Next step" block below rendered only on a *wrong*
          answer. A reader who got the problem right was shown two words and
          given nowhere to go, while a reader who got it wrong got a targeted
          sentence and three links. Solving a problem is the single best moment
          to offer the next one, and it was the one moment offering nothing.

          Deliberately the same shape as the failure block: same rule, same
          `tech-label`, same control sizes. The difference is what it points
          at. There is no hint ladder to offer here (the reader did not need
          it) and no "re-read the lesson" (they demonstrably did not need that
          either), so the two moves that remain are the next problem and the
          worked solution — the second because a right answer reached by a
          shaky route is worth checking against the author's, which is a thing
          only a reader who has already answered can usefully be offered.

          Rendered outside the `role="status"` region for the same reason the
          failure block is: controls inside a live region get re-announced on
          every update.
        */}
        {solved ? (
          <div className="mt-4 border-t border-border pt-4">
            <p className="tech-label">Next step</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {progress.solutionRevealed
                ? "The worked solution above derives the same result step by step."
                : "The worked solution derives the same result step by step, which is worth a look even when your own route got there."}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              {nextProblem ? (
                <Link
                  href={`/problems/${nextProblem.slug}`}
                  className="inline-flex min-h-11 items-center rounded-(--radius-tight) border border-pillar-edge bg-pillar-wash px-4 text-sm font-medium text-pillar-text transition-colors duration-(--dur-fast) hover:border-pillar focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
                >
                  Next problem: {nextProblem.title}
                </Link>
              ) : (
                <Link
                  href="/problems"
                  className="inline-flex min-h-11 items-center rounded-(--radius-tight) border border-pillar-edge bg-pillar-wash px-4 text-sm font-medium text-pillar-text transition-colors duration-(--dur-fast) hover:border-pillar focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
                >
                  Find another problem
                </Link>
              )}
              {!progress.solutionRevealed ? (
                <Button variant="secondary" size="sm" className="min-h-11" onClick={handleRevealSolution}>
                  See the worked solution
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}

        {result && result.status !== "correct" ? (
          <div className="mt-4 border-t border-border pt-4">
            <p className="tech-label">Next step</p>
            {/* "Still in the box" was only true for the 426 numeric and
                short-answer problems; on a multiple-choice one there is no box,
                there is a selected radio, and a reader looking at a list of
                options was being told about a field that is not on the page.
                The sentence says the same thing without naming a control that
                may not exist. */}
            <p className="mt-1.5 text-sm text-muted-foreground">
              Your answer is still here. Change it and submit again as many times as you like. Nothing is
              scored and nothing is recorded against you.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              {hintsRemaining > 0 ? (
                <Button variant="secondary" size="sm" className="min-h-11" onClick={handleRevealHint}>
                  Reveal hint {progress.hintsRevealed + 1} of {problem.hints.length}
                </Button>
              ) : !progress.solutionRevealed ? (
                <Button variant="secondary" size="sm" className="min-h-11" onClick={handleRevealSolution}>
                  Reveal full solution
                </Button>
              ) : null}
              {lessonSlug && lessonTitle ? (
                <Link
                  href={`/lessons/${lessonSlug}`}
                  className="inline-flex min-h-11 items-center rounded-(--radius-tight) text-sm text-pillar-text underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
                >
                  Re-read &ldquo;{lessonTitle}&rdquo;
                </Link>
              ) : null}
              {prerequisiteAnchorId ? (
                <a
                  href={`#${prerequisiteAnchorId}`}
                  className="inline-flex min-h-11 items-center rounded-(--radius-tight) text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
                >
                  What this builds on
                </a>
              ) : null}
              {/* A forward step on the wrong-answer path too, but only once the
                  solution has been revealed.

                  Every other control in this block points backwards, which is
                  right while the reader is still trying: hints, the lesson,
                  the prerequisites. Offering "next problem" beside them would
                  be an invitation to skip, and the whole page is built around
                  not doing that.

                  Revealing the solution is the moment that changes. The reader
                  has stopped trying and read the answer, so this problem is
                  over for them, and until now that path ended in a wall: the
                  success branch above carries the only forward link on the
                  page. Giving up is a worse moment to be stranded than
                  succeeding, not a better one. */}
              {progress.solutionRevealed ? (
                <Link
                  href={nextProblem ? `/problems/${nextProblem.slug}` : "/problems"}
                  className="inline-flex min-h-11 items-center rounded-(--radius-tight) border border-pillar-edge bg-pillar-wash px-4 text-sm font-medium text-pillar-text transition-colors duration-(--dur-fast) hover:border-pillar focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
                >
                  {nextProblem ? `Next problem: ${nextProblem.title}` : "Find another problem"}
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </Instrument>

      <HintPanel
        hints={math.hints}
        revealedCount={progress.hintsRevealed}
        onReveal={handleRevealHint}
        revealIntentRef={hintRevealIntent}
      />
      {/*
        `options`/`problemSlug` are what let the solution's "common mistakes"
        name an option by the letter it is *displayed* under rather than by its
        authored id — the two differ, because `AnswerInput` renders options in
        a seeded shuffle. Only multiple-choice problems have options to
        reconcile; for the other two types the panel receives `undefined` and
        renders every entry as plain prose, which is what those entries are.
      */}
      <SolutionPanel
        math={math.solution}
        options={problem.question.type === "multiple-choice" ? problem.question.options : undefined}
        problemSlug={problem.meta.slug}
        revealed={progress.solutionRevealed}
        attempted={attempted}
        onReveal={handleRevealSolution}
        revealIntentRef={solutionRevealIntent}
      />
    </div>
  );
}
