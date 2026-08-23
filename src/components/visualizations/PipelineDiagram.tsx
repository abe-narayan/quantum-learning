import { cn } from "@/lib/utils";

export type PipelineStep = {
  label: string;
  detail?: string;
  highlight?: boolean;
};

/**
 * A labeled boxes-and-arrows flow diagram: a classical/quantum hybrid
 * loop, a compilation pipeline, a logical chain of ideas across lessons,
 * a nested code structure. Pure layout (CSS flexbox, wraps on narrow
 * screens) rather than SVG, since the content here is a sequence, not a
 * geometric figure with real coordinates.
 */
export function PipelineDiagram({ steps, ariaLabel, loop = false }: { steps: PipelineStep[]; ariaLabel: string; loop?: boolean }) {
  return (
    <div role="img" aria-label={ariaLabel} className="not-prose overflow-x-auto rounded-xl border border-border bg-surface-muted/40 p-5">
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={cn(
                "rounded-lg border px-3 py-2 text-center text-xs font-medium",
                step.highlight ? "border-accent bg-accent/10 text-accent" : "border-border bg-surface text-foreground"
              )}
            >
              <div>{step.label}</div>
              {step.detail && <div className="mt-0.5 font-normal text-muted-foreground">{step.detail}</div>}
            </div>
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="text-muted-foreground">
                &rarr;
              </span>
            )}
          </div>
        ))}
        {loop && (
          <span aria-hidden="true" className="ml-1 text-xs text-muted-foreground">
            &#8635; repeat
          </span>
        )}
      </div>
    </div>
  );
}
