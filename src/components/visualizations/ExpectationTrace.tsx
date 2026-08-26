export type TracePoint = { t: number; value: number };

export type TraceSeries = {
  label: string;
  color?: "brand" | "accent" | "muted" | "warning";
  /** Renders this series as a dashed curve, e.g. a closed-form reference overlay. */
  dashed?: boolean;
  points: TracePoint[];
};

const WIDTH = 480;
const HEIGHT = 220;
const PAD = 36;

const COLOR_CLASSES: Record<NonNullable<TraceSeries["color"]>, string> = {
  brand: "stroke-brand",
  accent: "stroke-accent",
  muted: "stroke-muted-foreground",
  warning: "stroke-warning",
};

/**
 * A static line plot of a scalar quantity vs. time -- e.g. <x>(t) or
 * sigma(t)^2 -- with one or more series, any of which can be drawn dashed.
 * This is the same "dashed = closed-form analytical curve" convention
 * WavefunctionCanvas uses for its `analyticalDensity` overlay, applied to a
 * plain x/y line plot instead of a probability density.
 *
 * Unlike ParametricCurve (which scrubs through precomputed *frames* via a
 * slider, one frame visible at a time), this renders one fixed set of
 * series simultaneously, so a lesson can overlay e.g. a full closed-form
 * trajectory (solid) against a simpler reference curve derived from it --
 * a pure slope line, or a pure quadratic-growth term with the constant
 * offset dropped -- to make a rate or a growth law visually obvious.
 *
 * All points must be precomputed by the calling lesson from its own
 * closed-form expressions (a plain inline array or module-scope `const`,
 * exactly like ParametricCurve's `frames`) -- this component only draws
 * whatever points it's handed, and never computes physics itself.
 */
export function ExpectationTrace({
  series,
  yLabel,
  xLabel = "t",
  annotation,
  ariaLabel,
}: {
  series: TraceSeries[];
  /** Axis label for the plotted quantity, e.g. "⟨x⟩(t)" or "σ(t)²". */
  yLabel: string;
  xLabel?: string;
  /** Optional pre-formatted note rendered under the plot, e.g. a Worked Example check. */
  annotation?: string;
  ariaLabel: string;
}) {
  const allPoints = series.flatMap((s) => s.points);
  const xMin = Math.min(...allPoints.map((p) => p.t));
  const xMax = Math.max(...allPoints.map((p) => p.t));
  const yMin = Math.min(...allPoints.map((p) => p.value));
  const yMax = Math.max(...allPoints.map((p) => p.value));
  const xSpan = xMax - xMin || 1;
  const ySpan = yMax - yMin || 1;
  const plotW = WIDTH - 2 * PAD;
  const plotH = HEIGHT - 2 * PAD;
  const xOf = (t: number) => PAD + ((t - xMin) / xSpan) * plotW;
  const yOf = (v: number) => PAD + (1 - (v - yMin) / ySpan) * plotH;

  return (
    <div className="not-prose space-y-3 panel-inset p-4">
      <div className="overflow-x-auto">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
          <line x1={PAD} y1={HEIGHT - PAD} x2={WIDTH - PAD} y2={HEIGHT - PAD} className="stroke-border" strokeWidth={1} />
          <line x1={PAD} y1={PAD} x2={PAD} y2={HEIGHT - PAD} className="stroke-border" strokeWidth={1} />

          <text x={PAD} y={16} className="fill-foreground text-[11px]">{yLabel}</text>

          <text x={PAD} y={HEIGHT - PAD + 16} className="fill-muted-foreground text-[10px]">
            {xLabel} = {xMin.toFixed(1)}
          </text>
          <text x={WIDTH - PAD} y={HEIGHT - PAD + 16} textAnchor="end" className="fill-muted-foreground text-[10px]">
            {xLabel} = {xMax.toFixed(1)}
          </text>
          <text x={PAD - 6} y={PAD + 4} textAnchor="end" className="fill-muted-foreground text-[10px]">
            {yMax.toFixed(2)}
          </text>
          <text x={PAD - 6} y={HEIGHT - PAD} textAnchor="end" className="fill-muted-foreground text-[10px]">
            {yMin.toFixed(2)}
          </text>

          {series.map((s, i) => {
            const path = s.points
              .map((p, j) => `${j === 0 ? "M" : "L"}${xOf(p.t).toFixed(1)},${yOf(p.value).toFixed(1)}`)
              .join(" ");
            return (
              <path
                key={i}
                d={path}
                fill="none"
                className={COLOR_CLASSES[s.color ?? "brand"]}
                strokeWidth={s.dashed ? 1.5 : 2}
                strokeDasharray={s.dashed ? "5 3" : undefined}
              />
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {series.map((s, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <svg width={16} height={4} className="shrink-0" aria-hidden="true">
              <line
                x1={0}
                y1={2}
                x2={16}
                y2={2}
                className={COLOR_CLASSES[s.color ?? "brand"]}
                strokeWidth={2}
                strokeDasharray={s.dashed ? "3 2" : undefined}
              />
            </svg>
            {s.label}
          </span>
        ))}
      </div>

      {annotation ? <p className="text-xs text-muted-foreground">{annotation}</p> : null}
    </div>
  );
}
