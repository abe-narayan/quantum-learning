import { cn } from "@/lib/utils";

export type MeasurementTreeNode = {
  label: string;
  /** 0-1; shown as a percentage next to the label. */
  probability?: number;
  highlight?: boolean;
  children?: MeasurementTreeNode[];
};

function Branch({ node }: { node: MeasurementTreeNode }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium",
          node.highlight ? "border-accent bg-accent/10 text-accent" : "border-border bg-surface text-foreground"
        )}
      >
        {node.label}
        {node.probability !== undefined && (
          <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">{(node.probability * 100).toFixed(0)}%</span>
        )}
      </div>
      {node.children && node.children.length > 0 && (
        <>
          <div className="h-4 w-px bg-border" aria-hidden="true" />
          <div className="flex gap-6">
            {node.children.map((child, i) => (
              <Branch key={i} node={child} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * A branching diagram for sequential measurement outcomes: each node's
 * children are the possible next outcomes, with probabilities that must
 * come from the caller's own Born-rule/engine computation. Handles
 * arbitrary depth (e.g. Z-then-X-then-Z, three measurement stages) via
 * plain recursive flexbox layout.
 */
export function MeasurementTree({ root, ariaLabel }: { root: MeasurementTreeNode; ariaLabel: string }) {
  return (
    <div role="img" aria-label={ariaLabel} className="not-prose overflow-x-auto rounded-xl border border-border bg-surface-muted/40 p-5">
      <Branch node={root} />
    </div>
  );
}
