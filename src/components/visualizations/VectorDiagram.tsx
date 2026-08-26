export type PlaneVector = {
  label: string;
  x: number;
  y: number;
  /** Tail point; defaults to the origin. Lets a vector be drawn starting at another vector's tip (e.g. w = u - cv drawn from cv's endpoint). */
  from?: { x: number; y: number };
  color?: "brand" | "accent" | "muted" | "foreground";
  dashed?: boolean;
};

const WIDTH = 320;
const PAD = 36;

/** Base distance (px) from a vector's tip to its label when no other label is nearby. */
const LABEL_OFFSET = 12;
/**
 * Two labels whose default anchors would land within this many px of each
 * other are treated as visually colliding — most commonly two vectors drawn
 * tip-to-tip (e.g. a resultant `J = S1+S2` ending where a summand `S2`
 * ends). Mirrors `EnergyLevelDiagram`'s `computeLabelYs` collision
 * threshold, adapted from one axis to a shared point in the plane.
 */
const LABEL_COLLISION_PX = 20;
/** Rough px-per-character used only to decide how far to push a colliding label outward; doesn't need to be exact. */
const LABEL_CHAR_WIDTH_PX = 6;
/** Extra gap (px) enforced beyond a colliding label's own estimated half-width. */
const LABEL_CLUSTER_GAP_PX = 8;
/** Angular fan (degrees) spread across a colliding cluster so labels separate even when their vectors point in nearly the same direction. */
const LABEL_CLUSTER_FAN_DEG = 22;

function approxLabelHalfWidth(label: string): number {
  return (label.length * LABEL_CHAR_WIDTH_PX) / 2;
}

/**
 * Positions each vector's label `LABEL_OFFSET` past its tip along the
 * vector's own direction — except when two or more labels would land within
 * `LABEL_COLLISION_PX` of each other (most often vectors that share a tip
 * point), in which case that cluster is fanned outward instead: each member
 * is pushed further from the tip roughly in proportion to its own label's
 * width (so a long label like "J = S1+S2" gets the extra room it needs to
 * clear a short one like "S2", rather than both sitting at the same fixed
 * offset) and nudged apart angularly so near-parallel vectors still
 * separate. Same "de-collide nearby labels" idea as
 * `EnergyLevelDiagram.computeLabelYs`, generalized from one axis to a point.
 */
function computeLabelAnchors(
  items: { tip: { x: number; y: number }; angle: number; label: string }[]
): { x: number; y: number }[] {
  const n = items.length;
  const base = items.map((it) => ({
    x: it.tip.x + Math.cos(it.angle) * LABEL_OFFSET,
    y: it.tip.y + Math.sin(it.angle) * LABEL_OFFSET,
  }));

  const parent = base.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.hypot(base[i].x - base[j].x, base[i].y - base[j].y) < LABEL_COLLISION_PX) {
        const ri = find(i);
        const rj = find(j);
        if (ri !== rj) parent[ri] = rj;
      }
    }
  }

  const groups = new Map<number, number[]>();
  for (let i = 0; i < n; i++) {
    const root = find(i);
    groups.set(root, [...(groups.get(root) ?? []), i]);
  }

  const anchors = base.slice();
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const mid = (group.length - 1) / 2;
    // Push the label with the longer text furthest, so its wider box has
    // room to clear the others instead of just clearing the shared tip.
    const sorted = [...group].sort((a, b) => items[a].label.length - items[b].label.length);
    sorted.forEach((idx, k) => {
      const radius = LABEL_OFFSET + approxLabelHalfWidth(items[idx].label) + LABEL_CLUSTER_GAP_PX;
      const fan = (k - mid) * ((LABEL_CLUSTER_FAN_DEG * Math.PI) / 180);
      const angle = items[idx].angle + fan;
      anchors[idx] = {
        x: items[idx].tip.x + Math.cos(angle) * radius,
        y: items[idx].tip.y + Math.sin(angle) * radius,
      };
    });
  }

  return anchors;
}

const STROKE_CLASS: Record<NonNullable<PlaneVector["color"]>, string> = {
  brand: "stroke-brand",
  accent: "stroke-accent",
  muted: "stroke-muted-foreground",
  foreground: "stroke-foreground",
};

const FILL_CLASS: Record<NonNullable<PlaneVector["color"]>, string> = {
  brand: "fill-brand",
  accent: "fill-accent",
  muted: "fill-muted-foreground",
  foreground: "fill-foreground",
};

/**
 * A 2D vector-arrow diagram on a plane: each vector drawn as an arrow from
 * `from` (default origin) to `(x, y)`, auto-scaled to fit every vector's
 * tail and tip. All coordinates must come from the caller's own computation
 * (an operator's real action on sample vectors, a real Cauchy-Schwarz
 * projection, etc.) — this component only renders, it does no math.
 *
 * `bounds`, when given, overrides the auto-fit bounding box that would
 * otherwise be computed from just this call's `vectors`. `VectorDiagramExplorer`
 * passes the union bounding box across all of its frames here so a vector of
 * constant true length renders at a constant pixel scale as its slider moves,
 * instead of each frame independently rescaling to fill the plot area.
 */
export function VectorDiagram({
  vectors,
  ariaLabel,
  showGrid = true,
  height = 300,
  bounds,
}: {
  vectors: PlaneVector[];
  ariaLabel: string;
  showGrid?: boolean;
  height?: number;
  bounds?: { minX: number; maxX: number; minY: number; maxY: number };
}) {
  const points = vectors.flatMap((v) => [v.from ?? { x: 0, y: 0 }, { x: v.x, y: v.y }]);
  const xs = points.map((p) => p.x).concat(0);
  const ys = points.map((p) => p.y).concat(0);
  const minX = bounds ? bounds.minX : Math.min(...xs);
  const maxX = bounds ? bounds.maxX : Math.max(...xs);
  const minY = bounds ? bounds.minY : Math.min(...ys);
  const maxY = bounds ? bounds.maxY : Math.max(...ys);
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const plotW = WIDTH - 2 * PAD;
  const plotH = height - 2 * PAD;
  const scale = Math.min(plotW / spanX, plotH / spanY);
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  const toSvg = (x: number, y: number) => ({
    x: WIDTH / 2 + (x - midX) * scale,
    y: height / 2 - (y - midY) * scale,
  });

  const origin = toSvg(0, 0);
  const axisXEnd = toSvg(midX + spanX / 2 + spanX * 0.15, 0);
  const axisXStart = toSvg(midX - spanX / 2 - spanX * 0.15, 0);
  const axisYEnd = toSvg(0, midY + spanY / 2 + spanY * 0.15);
  const axisYStart = toSvg(0, midY - spanY / 2 - spanY * 0.15);

  const drawn = vectors.map((v) => {
    const start = toSvg((v.from ?? { x: 0, y: 0 }).x, (v.from ?? { x: 0, y: 0 }).y);
    const end = toSvg(v.x, v.y);
    const color = v.color ?? "brand";
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.hypot(dx, dy) || 1;
    // Leave room for the arrowhead, but never shrink past the vector's
    // own length (which would draw the line backward/inverted for very
    // short vectors). Below ~3px the arrowhead can't read as an arrow
    // anyway, so skip it and draw a plain stub instead.
    const showArrowhead = len > 3;
    const shrink = showArrowhead ? Math.min(9, len * 0.4) : 0;
    const endShrunk = { x: end.x - (dx / len) * shrink, y: end.y - (dy / len) * shrink };
    return { v, start, endShrunk, end, dx, dy, len, showArrowhead, color };
  });

  const labelAnchors = computeLabelAnchors(
    drawn.map((d) => ({ tip: d.end, angle: Math.atan2(d.dy, d.dx), label: d.v.label }))
  );

  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-border bg-surface-muted/40 p-4">
      <svg width={WIDTH} height={height} viewBox={`0 0 ${WIDTH} ${height}`} className="w-full" role="img" aria-label={ariaLabel}>
        {showGrid && (
          <g className="stroke-border" strokeWidth={1}>
            <line x1={axisXStart.x} y1={axisXStart.y} x2={axisXEnd.x} y2={axisXEnd.y} />
            <line x1={axisYStart.x} y1={axisYStart.y} x2={axisYEnd.x} y2={axisYEnd.y} />
          </g>
        )}
        {drawn.map((d, i) => {
          const anchor = labelAnchors[i];
          return (
            <g key={i}>
              <line
                x1={d.start.x}
                y1={d.start.y}
                x2={d.endShrunk.x}
                y2={d.endShrunk.y}
                strokeWidth={2.5}
                className={STROKE_CLASS[d.color]}
                strokeDasharray={d.v.dashed ? "4 3" : undefined}
                markerEnd={d.showArrowhead ? `url(#vector-arrow-${d.color})` : undefined}
              />
              <text
                x={anchor.x}
                y={anchor.y}
                textAnchor="middle"
                className={`text-[11px] font-medium ${FILL_CLASS[d.color]}`}
              >
                {d.v.label}
              </text>
            </g>
          );
        })}
        <circle cx={origin.x} cy={origin.y} r={2} className="fill-foreground" />
        <defs>
          {(Object.keys(STROKE_CLASS) as (keyof typeof STROKE_CLASS)[]).map((color) => (
            <marker key={color} id={`vector-arrow-${color}`} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" className={FILL_CLASS[color]} />
            </marker>
          ))}
        </defs>
      </svg>
    </div>
  );
}
