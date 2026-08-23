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
 */
export function VectorDiagram({
  vectors,
  ariaLabel,
  showGrid = true,
  height = 300,
}: {
  vectors: PlaneVector[];
  ariaLabel: string;
  showGrid?: boolean;
  height?: number;
}) {
  const points = vectors.flatMap((v) => [v.from ?? { x: 0, y: 0 }, { x: v.x, y: v.y }]);
  const xs = points.map((p) => p.x).concat(0);
  const ys = points.map((p) => p.y).concat(0);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
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

  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-border bg-surface-muted/40 p-4">
      <svg width={WIDTH} height={height} viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label={ariaLabel}>
        {showGrid && (
          <g className="stroke-border" strokeWidth={1}>
            <line x1={axisXStart.x} y1={axisXStart.y} x2={axisXEnd.x} y2={axisXEnd.y} />
            <line x1={axisYStart.x} y1={axisYStart.y} x2={axisYEnd.x} y2={axisYEnd.y} />
          </g>
        )}
        {vectors.map((v, i) => {
          const start = toSvg((v.from ?? { x: 0, y: 0 }).x, (v.from ?? { x: 0, y: 0 }).y);
          const end = toSvg(v.x, v.y);
          const color = v.color ?? "brand";
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const len = Math.hypot(dx, dy) || 1;
          const shrink = 9;
          const endShrunk = { x: end.x - (dx / len) * shrink, y: end.y - (dy / len) * shrink };
          return (
            <g key={i}>
              <line
                x1={start.x}
                y1={start.y}
                x2={endShrunk.x}
                y2={endShrunk.y}
                strokeWidth={2.5}
                className={STROKE_CLASS[color]}
                strokeDasharray={v.dashed ? "4 3" : undefined}
                markerEnd={`url(#vector-arrow-${color})`}
              />
              <text
                x={end.x + (dx / len) * 12}
                y={end.y + (dy / len) * 12}
                textAnchor="middle"
                className={`text-[11px] font-medium ${FILL_CLASS[color]}`}
              >
                {v.label}
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
