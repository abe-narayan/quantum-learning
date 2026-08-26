import { Button } from "@/components/ui/Button";
import { Instrument } from "@/components/ui/Panel";
import { MathText } from "@/components/ui/MathText";
import { KatexMath } from "@/components/ui/KatexMath";
import type { Explanation, Solution } from "@/lib/problems/types";

/** A solution teaches — numbered steps building to the answer, then (for
 *  conceptual problems especially) why it's right and why common
 *  alternatives aren't. Collapsed until explicitly revealed — the last,
 *  most deliberate step of the hint ladder, not a default-open panel, and
 *  named plainly ("Reveal full solution," not a bare disclosure triangle)
 *  so committing to it reads as the real decision it is. */
export function SolutionPanel({
  solution,
  explanation,
  revealed,
  onReveal,
}: {
  solution: Solution;
  explanation?: Explanation;
  revealed: boolean;
  onReveal: () => void;
}) {
  if (!revealed) {
    return (
      <Instrument
        label="Solution"
        readout={
          <Button variant="ghost" size="sm" onClick={onReveal}>
            Reveal full solution
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground">
          The worked steps and final answer, once you&rsquo;re ready to see them — not before.
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
              <MathText text={step.description} />
            </p>
            {step.latex ? (
              <div className="mt-2 overflow-x-auto pl-7">
                <KatexMath tex={step.latex} display />
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="mt-4 rounded-[--radius-tight] border border-pillar-edge bg-pillar-wash p-3 text-sm font-medium text-foreground">
        <MathText text={solution.finalAnswer} />
      </div>

      {explanation ? (
        <div className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm">
          <p className="text-foreground">
            <span className="font-semibold">Why: </span>
            <MathText text={explanation.correctIdea} />
          </p>
          {explanation.whyCorrect ? (
            <p className="text-muted-foreground">
              <MathText text={explanation.whyCorrect} />
            </p>
          ) : null}
          {explanation.whyWrong && explanation.whyWrong.length > 0 ? (
            <div>
              <p className="font-medium text-foreground">Common mistakes:</p>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 text-muted-foreground">
                {explanation.whyWrong.map((reason, index) => (
                  <li key={index}>
                    <MathText text={reason} />
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
