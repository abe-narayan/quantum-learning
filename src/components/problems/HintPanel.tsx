import { useEffect, useRef, type RefObject } from "react";
import { Button } from "@/components/ui/Button";
import { Instrument } from "@/components/ui/Panel";
import { RenderedScrollableMathText } from "./RenderedMathText";
import type { MathRuns } from "./mathRuns";
import { cn } from "@/lib/utils";

/** A row of small ticks showing how far into the hint ladder a learner has
 *  gone — filled for a revealed hint, hollow for one still held back. Purely
 *  decorative (the "hint X of Y" text and button label carry the same fact
 *  for assistive tech), and deliberately its own shape — short bars, not
 *  `DifficultyMark`'s ticks — so it never reads as a second difficulty
 *  encoding. */
function HintLadder({ total, revealed }: { total: number; revealed: number }) {
  return (
    <span aria-hidden="true" data-decorative="" className="flex items-center gap-1">
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={cn(
            "h-3 w-1 rounded-[1px] border",
            index < revealed ? "border-pillar bg-pillar" : "border-border-strong bg-transparent"
          )}
        />
      ))}
    </span>
  );
}

/** Reveals hints one at a time, in order — never the whole list at once.
 *  Each revealed hint is numbered like an instrument scale mark, so working
 *  through the ladder reads as a sequence of deliberate, earned steps rather
 *  than a disclosure triangle dumping everything at once. Taking a hint is a
 *  real decision, so the button names the cost plainly ("Reveal hint N of
 *  M") rather than hiding it behind a generic "Show more."
 *
 *  Takes hint text already rendered to KaTeX HTML (`renderProblemMath.ts`,
 *  server-side) rather than `Hint[]`: this panel is inside the eager client
 *  graph of `/problems/[slug]` — its shell renders on first paint even with
 *  nothing revealed — so importing `ScrollableMathText` here would drag the
 *  268KB KaTeX runtime onto all 547 problem pages. See `mathRuns.ts`. */
export function HintPanel({
  hints,
  revealedCount,
  onReveal,
  revealIntentRef,
}: {
  /** One entry per authored hint, in ladder order, already rendered. */
  hints: MathRuns[];
  revealedCount: number;
  onReveal: () => void;
  /** Set to `true` by whichever control actually revealed a hint — see the
   *  effect below. Optional: a caller that doesn't pass one never gets the
   *  focus move, which is the safe direction. */
  revealIntentRef?: RefObject<boolean>;
}) {
  const allRevealed = revealedCount >= hints.length;

  // Focus lands on the hint that was just revealed, on EVERY reveal.
  //
  // This used to fire only on the last one, on the reasoning that an earlier
  // reveal keeps the button mounted (only its label changes) so focus is not
  // destroyed. True, and not the point: the reader pressed a control whose
  // entire purpose is to produce a sentence they have not read yet, and
  // nothing announced that sentence. A screen-reader user heard the button
  // rename itself from "Reveal hint 1 of 4" to "Reveal hint 2 of 4" and never
  // heard hint 1 at all. It is worse from the *other* reveal control: the
  // "Next step" block in `ProblemViewClient` sits beside the feedback box, a
  // panel away from where the hint appears, so the new text landed entirely
  // off-screen and unspoken. Moving focus reads it, puts the caret where the
  // reader asked to be, and matches what `SolutionPanel` already does one
  // panel below. Getting back to the ladder is one Shift+Tab: the button is
  // in the header strip, immediately before this list in DOM order.
  //
  // Gated on the caller's *click*, not on a previous-value guard — the same
  // failure `SolutionPanel`'s effect documents at length. `revealedCount`
  // comes from `useProblemProgress`, whose `getServerSnapshot` is
  // `EMPTY_PROGRESS`, so a reader returning to a problem whose ladder they
  // already worked through renders 0 on the hydration pass and the real count
  // only on the post-hydration catch-up. A value guard would read that
  // catch-up as a fresh reveal and scroll the page down to the last hint on
  // load. A click cannot happen before hydration, so intent is the exact
  // predicate that separates the two.
  const lastHintRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (revealedCount === 0 || !revealIntentRef?.current) return;
    revealIntentRef.current = false;
    lastHintRef.current?.focus();
  }, [revealedCount, revealIntentRef]);

  if (hints.length === 0) return null;

  return (
    <Instrument
      label="Hints"
      readout={
        <div className="flex items-center gap-3">
          <HintLadder total={hints.length} revealed={revealedCount} />
          {!allRevealed ? (
            <Button variant="ghost" size="sm" onClick={onReveal}>
              Reveal hint {revealedCount + 1} of {hints.length}
            </Button>
          ) : (
            <span className="text-xs text-subtle-foreground">All hints revealed</span>
          )}
        </div>
      }
    >
      {revealedCount > 0 ? (
        <ol className="space-y-3">
          {hints.slice(0, revealedCount).map((hintRuns, index) => (
            <li
              key={index}
              ref={index === revealedCount - 1 ? lastHintRef : undefined}
              tabIndex={index === revealedCount - 1 ? -1 : undefined}
              className="flex gap-3 text-sm text-foreground/90 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
            >
              <span className="tech-value shrink-0 pt-px text-xs text-pillar-text">
                {String(index + 1).padStart(2, "0")}
              </span>
              {/* `min-w-0` for the reason `AnswerInput` passes it on the same
                  component and `ProblemLayout` puts it on the prompt box: a
                  flex item's `min-width` is `auto`, so without this the item
                  cannot shrink below its content and the scroll box inside
                  `RenderedScrollableMathText` has nothing to be 100% *of* — a
                  long bra-ket in a hint widens the row and takes the
                  document's horizontal scrollbar with it at 320px. */}
              <RenderedScrollableMathText runs={hintRuns} className="min-w-0" />
            </li>
          ))}
        </ol>
      ) : (
        /* The count is stated in words, not left to the tick ladder above: the
           ladder is `aria-hidden` decoration, so before this line a reader who
           could not see it learned how long the ladder was only from the
           button's "of N". */
        <p className="text-sm text-muted-foreground">
          Stuck? There {hints.length === 1 ? "is one hint" : `are ${hints.length} hints`}, revealed one
          at a time, each narrowing the problem a step further. Take only as many as you need.
        </p>
      )}
    </Instrument>
  );
}
