import { useEffect, useRef, type RefObject } from "react";
import { Button } from "@/components/ui/Button";
import { Instrument } from "@/components/ui/Panel";
import { RenderedKatexMath, RenderedScrollableMathText } from "./RenderedMathText";
import type { SolutionMath } from "./mathRuns";
import { displayLetters } from "./optionOrder";

/**
 * A solution teaches — numbered steps building to the answer, then (for
 * conceptual problems especially) why it's right and why common alternatives
 * aren't. Collapsed until explicitly revealed — the last, most deliberate
 * step of the hint ladder, not a default-open panel, and named plainly
 * ("Reveal full solution," not a bare disclosure triangle) so committing to
 * it reads as the real decision it is.
 *
 * The panel itself is always present and always says what it holds, because a
 * worked solution nobody can find is the same as no worked solution: a reader
 * who is stuck should never have to guess whether one exists. What changes
 * with `attempted` is only whether the reveal is *live* — before a first
 * submission the control states the condition instead of firing, so the
 * solution cannot be read past on the way to the answer box, and after one
 * submission (right or wrong) it is unconditionally available. `attempted` is
 * read from persisted progress by the caller, so it does not re-lock on
 * reload.
 *
 * The steps, final answer and explanation arrive as `math` — already rendered
 * to KaTeX HTML by `renderProblemMath.ts` on the server — rather than as
 * `Solution`/`Explanation`. This panel's *shell* renders on first paint on
 * every problem page (that is the point: a solution nobody can find is the
 * same as no solution), so anything it imports is in the eager client bundle
 * of all 547 of them, and `ScrollableMathText`/`KatexMath` would put the
 * 268KB KaTeX runtime there. See `mathRuns.ts`. Nothing about the gate
 * changes: the rendered content is still rendered only when `revealed`.
 */
export function SolutionPanel({
  math,
  options,
  problemSlug,
  revealed,
  attempted,
  onReveal,
  revealIntentRef,
}: {
  /** The worked solution and its explanation, rendered. */
  math: SolutionMath;
  /** The question's multiple-choice options, when there are any. Supplied
   *  purely so an object-form `whyWrong` entry can be resolved to the letter
   *  its option is *currently displayed under* — see the `optionLetters`
   *  derivation below. Absent for numeric and conceptual problems, which have
   *  no options and therefore no letters to reconcile. */
  options?: readonly { id: string; text: string }[];
  /** The seed for the display order — the problem slug, the same key
   *  `AnswerInput` shuffles with. Both are needed together; either one alone
   *  cannot name a letter. */
  problemSlug?: string;
  revealed: boolean;
  /** Whether this reader has submitted at least one answer to this problem. */
  attempted: boolean;
  onReveal: () => void;
  /** Set to `true` by whichever control actually revealed the solution — see
   *  the effect below. Optional: a caller that doesn't pass one never gets
   *  the focus move, which is the safe direction. */
  revealIntentRef?: RefObject<boolean>;
}) {
  // "Reveal full solution" unmounts itself on click, which would drop
  // keyboard focus to <body> — the reader's next Tab restarts from the top
  // of the page. Move focus onto the revealed steps instead (the same
  // `tabIndex={-1}` + `.focus()` move ProblemsCatalog's results header
  // makes).
  //
  // Gated on the caller's *click* rather than on `revealed`'s previous value,
  // which was wrong in a way a returning reader hits on every visit.
  // `revealed` comes from `useProblemProgress`, a `useSyncExternalStore` whose
  // `getServerSnapshot` is `EMPTY_PROGRESS`: on a problem whose solution was
  // revealed in an earlier session the FIRST client render (hydration) still
  // sees `revealed === false`, and the persisted `true` only arrives on the
  // post-hydration catch-up render. A `useRef(revealed)` guard is seeded from
  // that first render, so it read the catch-up as a fresh reveal and yanked
  // focus — and therefore the viewport, since `.focus()` scrolls — down to
  // the worked solution the moment the page loaded. A click cannot happen
  // before hydration, so "the reader pressed a reveal control" is the exact
  // predicate that separates the two.
  const stepsRef = useRef<HTMLOListElement>(null);
  useEffect(() => {
    if (!revealed || !revealIntentRef?.current) return;
    revealIntentRef.current = false;
    stepsRef.current?.focus();
  }, [revealed, revealIntentRef]);

  if (!revealed) {
    return (
      <Instrument
        label="Solution"
        readout={
          attempted ? (
            <Button variant="ghost" size="sm" onClick={onReveal}>
              Reveal full solution
            </Button>
          ) : (
            <span className="tech-label text-subtle-foreground">Opens after your first submission</span>
          )
        }
      >
        <p className="text-sm text-muted-foreground">
          {attempted
            ? "Every step worked out, plus the final answer and the usual wrong turns. Taking it costs nothing — the problem stays here."
            : "Every step worked out, plus the final answer and the usual wrong turns. Submit something first, even a guess — reading the solution before attempting it is the one way to get nothing out of it."}
        </p>
      </Instrument>
    );
  }

  // id → the letter that option is showing under *right now*, for this reader.
  // Options are displayed in a seeded shuffle, so the authored id ("a", "b",
  // ...) is not the visible letter; an explanation that spelled a letter into
  // its prose was naming whichever choice happened to sit in that slot before
  // the shuffle existed. Derived from `displayLetters`, the same function
  // `AnswerInput` letters its list with and from the same two inputs, so the
  // two cannot disagree. Undefined for non-multiple-choice problems (and for
  // any caller that doesn't pass both), in which case every entry falls back
  // to plain prose.
  const optionLetters = options && problemSlug ? displayLetters(options, problemSlug) : undefined;

  return (
    <Instrument label="Solution" className="border-pillar-edge">
      <ol
        ref={stepsRef}
        tabIndex={-1}
        aria-label="Solution steps"
        className="space-y-4 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
      >
        {math.steps.map((step, index) => (
          <li key={index} className="text-sm">
            <p className="flex gap-3 text-foreground/90">
              <span className="tech-value shrink-0 pt-px text-xs text-pillar-text">
                {String(index + 1).padStart(2, "0")}
              </span>
              {/* `min-w-0` for the reason `AnswerInput` passes it on the same
                  component: a flex item's `min-width` is `auto`, so without it
                  this item cannot shrink below its content and the
                  `max-w-full` scroll box inside has nothing to be 100% *of* —
                  a long inline run in a step widens the row and takes the
                  document's horizontal scrollbar with it at 320px. */}
              <RenderedScrollableMathText runs={step.description} className="min-w-0" />
            </p>
            {step.latexHtml ? (
              /*
                `tabIndex={0}` for exactly the reason
                `src/lib/mdx/rehypeKatexHtml.mjs` documents at length: a
                scroll container is focusable-by-default only in Firefox, so
                without it a keyboard-only reader can see the left of a wide
                step and has no way to reach the rest. 37 of the 169 authored
                solution steps carry display LaTeX long enough for this to
                matter. No `role`/`aria-label`: KaTeX emits its own MathML and
                naming the container would flatten it.
              */
              <div tabIndex={0} className="mt-2 overflow-x-auto pl-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2">
                <RenderedKatexMath html={step.latexHtml} />
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="mt-4 rounded-(--radius-tight) border border-pillar-edge bg-pillar-wash p-3 text-sm font-medium text-foreground">
        <RenderedScrollableMathText runs={math.finalAnswer} />
      </div>

      {math.explanation ? (
        <div className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm">
          <p className="text-foreground">
            <span className="font-semibold">Why: </span>
            <RenderedScrollableMathText runs={math.explanation.correctIdea} />
          </p>
          {math.explanation.whyCorrect ? (
            <p className="text-muted-foreground">
              <RenderedScrollableMathText runs={math.explanation.whyCorrect} />
            </p>
          ) : null}
          {math.explanation.whyWrong.length > 0 ? (
            <div>
              <p className="font-medium text-foreground">Common mistakes:</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-muted-foreground">
                {math.explanation.whyWrong.map((entry, index) => {
                  // An unresolvable id degrades to prose rather than to an
                  // empty chip: content can be edited independently of this
                  // component (an option renamed, a `whyWrong` entry copied
                  // between problems), and the failure mode of a blank letter
                  // box beside a sentence is worse than no box at all. The
                  // sentences are authored to stand alone either way.
                  const letter = entry.optionId === null ? undefined : optionLetters?.get(entry.optionId);
                  return (
                    <li key={index}>
                      {letter ? (
                        <>
                          {/* The chip is `aria-hidden` — a bare letter read out
                              mid-sentence is noise — so the letter reaches a
                              screen reader through this prefix instead, phrased
                              to match the accessible name `AnswerInput` gives
                              the same option ("Option B: ..."). Without it the
                              cross-reference would be visual-only, which is the
                              exact class of bug this whole change exists to
                              remove. */}
                          <span className="sr-only">Option {letter}: </span>
                          <span
                            aria-hidden="true"
                            className="tech-value mr-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-(--radius-tight) border border-border-strong px-1 align-[-0.05em] text-[0.65rem] font-medium text-subtle-foreground"
                          >
                            {letter}
                          </span>
                        </>
                      ) : null}
                      <RenderedScrollableMathText runs={entry.text} />
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </Instrument>
  );
}
