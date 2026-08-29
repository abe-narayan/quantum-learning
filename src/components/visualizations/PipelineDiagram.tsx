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
    // `role="group"`, not `role="img"` — the same policy applied to the rest
    // of this directory. This component's own doc comment says it outright:
    // "Pure layout (CSS flexbox, wraps on narrow screens) rather than SVG,
    // since the content here is a sequence, not a geometric figure". There is
    // no picture under this role — only `step.label` and `step.detail` text
    // boxes, which are the entire diagram. `img` erased every stage name and
    // every sub-caption of a compilation pipeline or hybrid loop and left the
    // caller's one-sentence label standing in for a ten-box flow.
    // The arrows and the "↻ repeat" glyph are already `aria-hidden`, so
    // `group` re-exposes the words without introducing double-reads.
    //
    // No `tabIndex={0}`: the inner row is `flex flex-wrap`, so on a narrow
    // screen the step boxes wrap onto new lines instead of overflowing, and no
    // single box (a short label over a short detail, `px-3` padding) is wide
    // enough to overflow on its own. A tab stop here would land on a container
    // with nothing to scroll.
    <div role="group" aria-label={ariaLabel} className="not-prose overflow-x-auto panel-inset p-5">
      <div className="flex flex-wrap items-center gap-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={cn(
                "rounded-(--radius-tight) border px-3 py-2 text-center text-xs font-medium",
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
