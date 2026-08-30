import type { RefObject } from "react";
import { cn } from "@/lib/utils";
import type { ValidationResult } from "@/lib/problems/validators/types";
import { RenderedScrollableMathText } from "./RenderedMathText";
import type { MathRuns } from "./mathRuns";

const STATUS_STYLES: Record<ValidationResult["status"], string> = {
  correct: "border-success/40 bg-success/10 text-success",
  partial: "border-warning/40 bg-warning/10 text-warning",
  incorrect: "border-border-strong bg-surface-raised text-foreground",
};

const STATUS_LABEL: Record<ValidationResult["status"], string> = {
  correct: "Correct",
  partial: "Partially correct",
  incorrect: "Not quite",
};

/** aria-hidden glyph per status — always paired with the text label above,
 *  so status is never carried by color or shape alone. */
function StatusGlyph({ status }: { status: ValidationResult["status"] }) {
  if (status === "correct") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M2.5 7.3 5.5 10.3l6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === "partial") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 1.5 13 12.5H1L7 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M7 5.5v3.2M7 10.4v.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3.5 3.5 10.5 10.5M10.5 3.5 3.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Grading feedback. Never relies on color alone — an icon and the status
 * label are always present as text too, so "Not quite" survives grayscale
 * and every form of color blindness.
 *
 * The `role="status"` container is rendered unconditionally, empty, and only
 * its *contents* change on submission. A live region that is inserted into
 * the DOM at the same moment it gains content is unreliably announced —
 * several screen reader / browser pairs only observe mutations inside
 * regions that were already present when the observer attached. Keeping the
 * empty wrapper mounted from first paint is what makes the announcement
 * dependable rather than incidental.
 *
 * `resultRef` exists so a caller can move focus onto the result box. Only
 * `ProblemView` does, and only on the one transition where focus would
 * otherwise be destroyed — see the comment on its effect.
 *
 * ---------------------------------------------------------------------------
 * Why the math arrives pre-rendered
 * ---------------------------------------------------------------------------
 * 62 authored feedback strings across 30 problems carry inline `$…$`, and this
 * component rendered `result.message` as a plain string, so a student who got
 * one of those wrong was shown the LaTeX source: `Use
 * $P(+)=\frac{1+2\operatorname{Re}(\alpha^*\beta)}{2}$ …`. Hints and the
 * worked solution had been rendering their math correctly since problem math
 * moved to the server; this was the one surface the move missed.
 *
 * It cannot be fixed by rendering here. This file sits inside
 * `ProblemViewClient`'s `"use client"` boundary, so importing `MathText` or
 * `KatexMath` would put the 268KB / 74.1KB-gzip KaTeX runtime back into the
 * eager bundle of all 556 problem pages — the exact regression
 * `src/lib/design/__tests__/clientBoundary.test.ts` names this component's
 * parent for. So the feedback strings are rendered at build time alongside
 * the hints and the solution (`renderProblemMath.ts`) and looked up here.
 */
export function Feedback({
  result,
  math,
  resultRef,
  submissionId,
}: {
  result: ValidationResult | null;
  /**
   * This problem's authored feedback, rendered to KaTeX HTML and keyed by the
   * authored string — `ProblemMath["feedback"]`, see `mathRuns.ts`.
   *
   * Optional, and a miss falls back to the plain string, because the map can
   * only ever hold *authored* text. `validateNumeric` composes its own
   * message for a submission it cannot parse ("Enter the number on its own,
   * without the unit."), `validateConceptual` has three of its own for a
   * framed, unpredicated or echoed answer, and both multiple-choice guards
   * ("Select an option before submitting.") are written in the validator.
   * None of those can be in a build-time map, none of them carries math, and
   * all of them must keep rendering exactly as they do now.
   */
  math?: Record<string, MathRuns>;
  /** The rendered result box, for a caller that needs to focus it. Attached
   *  to the inner box rather than the live-region wrapper so focusing it
   *  cannot be confused with re-announcing it. */
  resultRef?: RefObject<HTMLDivElement | null>;
  /**
   * A value that changes on every submission — the caller's submission
   * counter. Used as the result box's `key`, and it is the only thing that
   * makes a repeated wrong answer audible.
   *
   * A live region announces DOM *mutations*, and two wrong submissions
   * usually produce byte-identical feedback: `validateNumeric` falls through
   * to the one authored `incorrectFeedback` string for every wrong value that
   * isn't a listed near miss, so a student adjusting 0.70 → 0.71 → 0.72 gets
   * the same sentence three times. React reconciled that to no change at all,
   * the region stayed silent, and a screen-reader user had no way to tell
   * whether Submit had done anything. A changed `key` remounts the box, which
   * is a real mutation, so every submission is announced exactly once —
   * still once per submission, never once per render.
   */
  submissionId?: number;
}) {
  // `undefined` for every runtime-composed message and for the ~97% of
  // authored feedback that is plain prose; both take the string branch below,
  // which is character for character what this component always rendered.
  const messageRuns = result ? math?.[result.message] : undefined;

  return (
    /* An empty wrapper carries no margin and so no height: the always-mounted
       region costs nothing in layout until it has something to say.

       `aria-atomic` because the status label and the message are two separate
       elements and a submission usually changes only one of them: adjusting
       0.70 → 0.71 keeps "Not quite" and swaps the sentence beneath it, and a
       non-atomic region is permitted to announce only the changed node. The
       heading without its reason, or the reason without the verdict, is half
       a result. The whole box is one message, so the whole box is re-read. */
    <div role="status" aria-live="polite" aria-atomic="true" className={result ? "mt-4" : undefined}>
      {result ? (
        <div
          key={submissionId}
          ref={resultRef}
          // Programmatic focus only — never a tab stop of its own, so a
          // keyboard reader working down the page is not made to stop on a
          // paragraph they have already heard.
          tabIndex={-1}
          className={cn(
            "flex gap-2.5 rounded-(--radius-tight) border px-4 py-3 text-sm",
            "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2",
            STATUS_STYLES[result.status]
          )}
        >
          <span className="mt-0.5 shrink-0">
            <StatusGlyph status={result.status} />
          </span>
          {/* `min-w-0`: a flex item's `min-width` is `auto`, and an authored
              message can carry a long unbreakable token (a 17-digit expected
              value, a function name). At 320px this column is ~200px, so
              without this the box widens past the panel instead of wrapping. */}
          <span className="min-w-0">
            <p className="font-semibold">{STATUS_LABEL[result.status]}</p>
            {/* `RenderedScrollableMathText`, not `RenderedMathText`, for the
                reason `HintPanel` gives on the same component: a feedback
                sentence can carry a long bra-ket, and at 320px this column is
                ~200px wide. A run past `WIDE_MATH_CHARS` gets its own
                focusable scroll box instead of widening the box and taking the
                document's horizontal scrollbar with it. */}
            <p className="mt-1 text-foreground/90">
              {messageRuns ? (
                <RenderedScrollableMathText runs={messageRuns} />
              ) : (
                result.message
              )}
            </p>
            {/* The grader's own line, under the authored one. Always plain
                text by construction (see `ValidationResult["note"]`), so no
                map lookup: it is composed from what this reader typed and
                could never be a build-time key. Quieter than the message
                because it is a footnote to it, not a second verdict. */}
            {result.note ? <p className="mt-1 text-foreground/70">{result.note}</p> : null}
          </span>
        </div>
      ) : null}
    </div>
  );
}
