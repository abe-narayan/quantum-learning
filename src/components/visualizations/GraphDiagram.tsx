export type GraphNode = {
  id: string;
  label?: string;
  /** Position in an arbitrary layout unit square (0-1 for both x and y); caller picks the layout. */
  x: number;
  y: number;
  /** Which side of the cut this node is on, e.g. from a real bitstring's bit value. */
  group?: 0 | 1;
};

export type GraphEdge = {
  from: string;
  to: string;
  /** Whether this edge is cut by the current grouping (endpoints in different groups). */
  cut?: boolean;
};

const WIDTH = 300;
const HEIGHT = 260;
const PAD = 34;
const NODE_R = 16;

const GROUP_FILL: Record<0 | 1, string> = {
  0: "fill-brand",
  1: "fill-accent",
};

/** Text painted on top of a GROUP_FILL circle — each group's paired
 * `-foreground` token, the same convention Button.tsx uses for text on a
 * `--brand`/`--accent` background, rather than a hardcoded `fill-white`
 * that doesn't adapt to either color or theme. */
const GROUP_TEXT_FILL: Record<0 | 1, string> = {
  0: "fill-brand-foreground",
  1: "fill-accent-foreground",
};

/**
 * A small node-and-edge graph diagram for combinatorial-optimization lessons
 * (Max-Cut/QAOA): nodes colored by which side of a cut they're on, edges
 * highlighted when they cross the cut. Node positions and groupings must
 * come from the caller (a real bitstring result, a chosen layout), not be
 * invented here — this component only renders.
 */
export function GraphDiagram({
  nodes,
  edges,
  ariaLabel,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  ariaLabel: string;
}) {
  const toSvg = (x: number, y: number) => ({
    x: PAD + x * (WIDTH - 2 * PAD),
    y: PAD + y * (HEIGHT - 2 * PAD),
  });
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-border bg-surface-muted/40 p-4">
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={ariaLabel}>
        {edges.map((e, i) => {
          const a = byId.get(e.from);
          const b = byId.get(e.to);
          if (!a || !b) return null;
          const pa = toSvg(a.x, a.y);
          const pb = toSvg(b.x, b.y);
          return (
            <line
              key={i}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              strokeWidth={e.cut ? 3 : 1.5}
              strokeDasharray={e.cut ? "6 4" : undefined}
              className={e.cut ? "stroke-accent" : "stroke-border"}
            />
          );
        })}
        {nodes.map((n) => {
          const p = toSvg(n.x, n.y);
          return (
            <g key={n.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={NODE_R}
                className={n.group === undefined ? "fill-muted-foreground/60" : GROUP_FILL[n.group]}
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                className={`${n.group === undefined ? "fill-foreground" : GROUP_TEXT_FILL[n.group]} text-[11px] font-semibold`}
              >
                {n.label ?? n.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
