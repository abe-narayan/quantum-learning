import { Button } from "@/components/ui/Button";
import { MathText } from "@/components/ui/MathText";
import { KatexMath } from "@/components/ui/KatexMath";
import type { Explanation, Solution } from "@/lib/problems/types";

/** A solution teaches — numbered steps building to the answer, then (for conceptual problems especially) why it's right and why common alternatives aren't. Collapsed until explicitly revealed. */
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
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-foreground">Solution</p>
          <Button variant="ghost" size="sm" onClick={onReveal}>
            Show solution
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-sm font-semibold text-foreground">Solution</p>
      <ol className="mt-3 space-y-3 border-t border-border pt-3">
        {solution.steps.map((step, index) => (
          <li key={index} className="text-sm">
            <p className="text-muted-foreground">
              <span className="mr-1.5 font-mono text-xs">Step {index + 1}.</span>
              <MathText text={step.description} />
            </p>
            {step.latex ? (
              <div className="mt-1.5 overflow-x-auto">
                <KatexMath tex={step.latex} display />
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="mt-3 rounded-lg bg-surface-muted/60 p-3 text-sm font-medium text-foreground">
        <MathText text={solution.finalAnswer} />
      </div>

      {explanation ? (
        <div className="mt-4 space-y-2 border-t border-border pt-3 text-sm">
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
              <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
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
    </div>
  );
}
