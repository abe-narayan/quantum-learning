import { Button } from "@/components/ui/Button";
import { Instrument } from "@/components/ui/Panel";
import { KatexMath } from "@/components/ui/KatexMath";
import { ScrollableMathText } from "./ScrollableMathText";
import type { Explanation, Solution } from "@/lib/problems/types";

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
 */
export function SolutionPanel({
  solution,
  explanation,
  revealed,
  attempted,
  onReveal,
}: {
  solution: Solution;
  explanation?: Explanation;
  revealed: boolean;
  /** Whether this reader has submitted at least one answer to this problem. */
  attempted: boolean;
  onReveal: () => void;
}) {
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

  return (
    <Instrument label="Solution" className="border-pillar-edge">
      <ol className="space-y-4">
        {solution.steps.map((step, index) => (
          <li key={index} className="text-sm">
            <p className="flex gap-3 text-foreground/90">
              <span className="tech-value shrink-0 pt-px text-xs text-pillar-text">
                {String(index + 1).padStart(2, "0")}
              </span>
              <ScrollableMathText text={step.description} />
            </p>
            {step.latex ? (
              /*
                `tabIndex={0}` for exactly the reason
                `src/lib/mdx/rehypeScrollableMath.mjs` documents at length: a
                scroll container is focusable-by-default only in Firefox, so
                without it a keyboard-only reader can see the left of a wide
                step and has no way to reach the rest. 37 of the 169 authored
                solution steps carry display LaTeX long enough for this to
                matter. No `role`/`aria-label`: KaTeX emits its own MathML and
                naming the container would flatten it.
              */
              <div tabIndex={0} className="mt-2 overflow-x-auto pl-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2">
                <KatexMath tex={step.latex} display />
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="mt-4 rounded-[--radius-tight] border border-pillar-edge bg-pillar-wash p-3 text-sm font-medium text-foreground">
        <ScrollableMathText text={solution.finalAnswer} />
      </div>

      {explanation ? (
        <div className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm">
          <p className="text-foreground">
            <span className="font-semibold">Why: </span>
            <ScrollableMathText text={explanation.correctIdea} />
          </p>
          {explanation.whyCorrect ? (
            <p className="text-muted-foreground">
              <ScrollableMathText text={explanation.whyCorrect} />
            </p>
          ) : null}
          {explanation.whyWrong && explanation.whyWrong.length > 0 ? (
            <div>
              <p className="font-medium text-foreground">Common mistakes:</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-muted-foreground">
                {explanation.whyWrong.map((reason, index) => (
                  <li key={index}>
                    <ScrollableMathText text={reason} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </Instrument>
  );
}
