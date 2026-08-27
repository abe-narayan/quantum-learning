import { Button } from "@/components/ui/Button";
import { Instrument } from "@/components/ui/Panel";
import { ScrollableMathText } from "./ScrollableMathText";
import { cn } from "@/lib/utils";
import type { Hint } from "@/lib/problems/types";

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
 *  M") rather than hiding it behind a generic "Show more." */
export function HintPanel({
  hints,
  revealedCount,
  onReveal,
}: {
  hints: Hint[];
  revealedCount: number;
  onReveal: () => void;
}) {
  if (hints.length === 0) return null;
  const allRevealed = revealedCount >= hints.length;

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
          {hints.slice(0, revealedCount).map((hint, index) => (
            <li key={index} className="flex gap-3 text-sm text-foreground/90">
              <span className="tech-value shrink-0 pt-px text-xs text-pillar-text">
                {String(index + 1).padStart(2, "0")}
              </span>
              <ScrollableMathText text={hint.text} />
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
