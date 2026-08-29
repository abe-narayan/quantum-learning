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

  // Revealing an *earlier* hint keeps the button mounted (only its label
  // changes), so focus stays put. Revealing the LAST hint replaces the
  // button with the static "All hints revealed" span, which would drop
  // keyboard focus to <body>. Move it onto the hint that was just revealed
  // instead (`tabIndex={-1}` + `.focus()`, the ProblemsCatalog results-header
  // move).
  //
  // Gated on the caller's *click*, not on `allRevealed`'s previous value —
  // the same failure `SolutionPanel`'s effect documents at length.
  // `revealedCount` comes from `useProblemProgress`, whose `getServerSnapshot`
  // is `EMPTY_PROGRESS`, so a reader returning to a problem whose ladder they
  // already exhausted renders `allRevealed === false` on the hydration pass
  // and `true` only on the post-hydration catch-up. A `useRef(allRevealed)`
  // guard is seeded from the first of those, read the second as a fresh
  // reveal, and scrolled the page down to the last hint on load.
  const lastHintRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (!allRevealed || !revealIntentRef?.current) return;
    revealIntentRef.current = false;
    lastHintRef.current?.focus();
  }, [allRevealed, revealIntentRef]);

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
        <p className="text-sm text-muted-foreground">
          Stuck? Each hint narrows things down one step at a time — take only as many as you need.
        </p>
      )}
    </Instrument>
  );
}
