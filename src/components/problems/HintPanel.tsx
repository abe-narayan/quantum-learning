import { Button } from "@/components/ui/Button";
import { MathText } from "@/components/ui/MathText";
import type { Hint } from "@/lib/problems/types";

/** Reveals hints one at a time, in order — never the whole list at once. */
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
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold text-foreground">Hints</p>
        {!allRevealed ? (
          <Button variant="ghost" size="sm" onClick={onReveal}>
            Show hint {revealedCount + 1} of {hints.length}
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">All hints revealed</span>
        )}
      </div>
      {revealedCount > 0 ? (
        <ol className="mt-3 space-y-2 border-t border-border pt-3">
          {hints.slice(0, revealedCount).map((hint, index) => (
            <li key={index} className="flex gap-2 text-sm text-muted-foreground">
              <span className="font-mono text-xs">{index + 1}.</span>
              <MathText text={hint.text} />
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
