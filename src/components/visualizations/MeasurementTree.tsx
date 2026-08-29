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
          "whitespace-nowrap rounded-(--radius-tight) border px-3 py-1.5 text-xs font-medium",
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
    // `role="group"`, not `role="img"` — same policy as the rest of this
    // directory. Nothing under this wrapper is drawn: `Branch` renders each
    // node as a text box carrying the outcome label and, next to it, that
    // outcome's Born-rule probability as a percentage. Those probabilities are
    // the figure — the component's own doc comment insists they "must come
    // from the caller's own Born-rule/engine computation" — and `role="img"`
    // deleted every one of them, leaving a screen-reader user with the
    // caller's summary sentence and no way to check a single branch of a
    // Z-then-X-then-Z tree. The connector rules are already `aria-hidden`.
    //
    // `tabIndex={0}`: this genuinely overflows. The layout is a recursive
    // flexbox tree with `gap-6` between siblings and `whitespace-nowrap`
    // nodes, so a three-stage tree is eight leaf boxes plus seven 24px gaps —
    // comfortably past 600px against a ~256px content box on a phone — and an
    // `overflow-x-auto` div is focusable by default only in Firefox. Without
    // the stop a keyboard-only reader could reach the leftmost branch and
    // nothing else. The global `:focus-visible` outline makes the stop
    // visible.
    <div role="group" aria-label={ariaLabel} tabIndex={0} className="not-prose overflow-x-auto panel-inset p-5">
      <Branch node={root} />
    </div>
  );
}
