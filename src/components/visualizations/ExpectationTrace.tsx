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
/**
 * The left gutter is wider than the other three because the y tick values live
 * in it, and it has been widened twice for the same reason: the type in it kept
 * being sized against the wrong box.
 *
 * The box is 254px, not 288px: 288 is the *page column* on a 320px phone
 * (320 less Container's `px-4` gutters), but this SVG renders inside
 * `panel-inset p-4`, and `panel-inset` (globals.css) supplies border,
 * radius and fill and no padding at all — the `p-4` does. Subtract
 * 2 x (16px padding + 1px border) = 34px.
 * So the scale is 254/480 = 0.529, not 0.6. The 10 units this figure started at
 * painted at 5.29px; the 14 units the last pass raised them to painted at
 * **7.41px**, still under the ~9px floor it was aiming for. 17 units gives
 * 9.00px, and the y label 18 units gives 9.53px.
 *
 * 56 -> 70 follows from that directly. A six-character tick like "-12.34" is
 * ~9.5 units per character in the body face at 17 units, so ~57 units wide;
 * right-aligned 8 units clear of the axis it needs 65 units of gutter, and at 56
 * its leading minus sign would have been clipped off the left edge of the
 * viewBox. The plot gives up 14 of 388 units of width for it — under 4%, and far
 * cheaper than numbers nobody can read.
 */
const PAD_LEFT = 70;

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
  const plotW = WIDTH - PAD_LEFT - PAD;
  const plotH = HEIGHT - 2 * PAD;
  const xOf = (t: number) => PAD_LEFT + ((t - xMin) / xSpan) * plotW;
  const yOf = (v: number) => PAD + (1 - (v - yMin) / ySpan) * plotH;

  return (
    <div className="not-prose space-y-3 panel-inset p-4">
      <div className="overflow-x-auto">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
          {/* The two axes carry the reading of every series drawn on top of them: the
              x axis is where the quantity is zero-referenced from and the y axis marks
              the left end of the domain. They were `stroke-border` — the panel-edge
              token, 1.41:1 on `--surface-muted` — so they failed WCAG 2.1 SC 1.4.11's
              3:1 floor for meaningful graphical objects and the plot read as curves
              floating in an empty box. `stroke-axis` is the chart channel. */}
          <line x1={PAD_LEFT} y1={HEIGHT - PAD} x2={WIDTH - PAD} y2={HEIGHT - PAD} className="stroke-axis" strokeWidth={1} />
          <line x1={PAD_LEFT} y1={PAD} x2={PAD_LEFT} y2={HEIGHT - PAD} className="stroke-axis" strokeWidth={1} />

          {/* All four label sizes were raised again (yLabel 11 -> 15 -> 18 units,
              ticks 10 -> 14 -> 17) for the reason spelled out on PAD_LEFT above:
              the 15/14 pass divided by a 288px column this figure never had.
              Fills stay on `--muted-foreground`/`--foreground`, which are 6.9:1
              and higher — moving text onto the 3:1-floor `--axis` token would
              lower its contrast, not raise it. `--axis` is a floor for *strokes*.
              The y ticks' vertical nudge goes +5 -> +6, which is ~0.35em at the
              new size and keeps them optically centred on their gridline. */}
          <text x={PAD_LEFT} y={18} className="fill-foreground text-[18px]">{yLabel}</text>

          <text x={PAD_LEFT} y={HEIGHT - PAD + 18} className="fill-muted-foreground text-[17px]">
            {xLabel} = {xMin.toFixed(1)}
          </text>
          <text x={WIDTH - PAD} y={HEIGHT - PAD + 18} textAnchor="end" className="fill-muted-foreground text-[17px]">
            {xLabel} = {xMax.toFixed(1)}
          </text>
          <text x={PAD_LEFT - 8} y={PAD + 6} textAnchor="end" className="fill-muted-foreground text-[17px]">
            {yMax.toFixed(2)}
          </text>
          <text x={PAD_LEFT - 8} y={HEIGHT - PAD} textAnchor="end" className="fill-muted-foreground text-[17px]">
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
