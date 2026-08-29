"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useFrameIndex } from "./useFrameIndex";
import { FrameSlider } from "./FrameSlider";

export type CurveSeries = {
  label: string;
  color?: "brand" | "accent" | "muted" | "warning";
  points: { x: number; y: number }[];
};

export type CurveFrame = {
  /** Pre-formatted, e.g. "η = 0.30" — computed by the caller, not this component, so no function props cross the server/client boundary. */
  paramLabel: string;
  series: CurveSeries[];
};

const WIDTH = 480;
const HEIGHT = 220;
/**
 * Asymmetric padding (same idea as DecayCurve's PAD_LEFT/PAD_TOP/PAD_BOTTOM):
 * extra room on the left and bottom for the axis tick labels added below,
 * modest room on top/right since only the (pre-existing) referenceLines
 * text lives there, anchored inward. A few px larger than the old uniform
 * PAD=32 on the labeled sides so the plot area shrinks only slightly —
 * every frame still maps its own min/max to the new plot rect exactly, so
 * curve shapes are unaffected, they just gain a labeled margin.
 *
 * PAD_LEFT is no longer a constant: it is derived per-render from the
 * widest y-tick label (see `padLeft` below). At the old fixed 68 a
 * scientific-notation tick like "1.0×10⁻²⁷" — which `formatTick` genuinely
 * produces for path-integral amplitudes and ħ/2-scale domains — was ~108
 * units wide at the new type size and ran straight off the left edge of the
 * viewBox, silently clipped by the SVG. Sizing the gutter to the content
 * makes clipping structurally impossible while still giving short labels
 * like "0" or "1.5" their plot width back.
 */
const PAD_RIGHT = 28;
const PAD_TOP = 28;
const PAD_BOTTOM = 44;

/**
 * Tick-label type size, in viewBox units.
 *
 * This component renders `w-full`, so authored SVG type is scaled by
 * (rendered width / viewBox width). The narrowest real width is NOT the 288px
 * this note used to claim. The box is 254px, not 288px: 288 is the *page column* on a 320px phone
 * (320 less Container's `px-4` gutters), but this SVG renders inside
 * `panel-inset p-4`, and `panel-inset` (globals.css) supplies border,
 * radius and fill and no padding at all — the `p-4` does. Subtract
 * 2 x (16px padding + 1px border) = 34px.
 * The real box is 254px and the scale is 254/480 = 0.529.
 *
 * Recomputed against it: the original `text-[9px]` painted at **4.76px**, not
 * 5.4px, and 18 units lands at **9.53px effective**, not 10.8px. 18 still
 * clears the ~9px floor, so the tick size itself stands — but the reference
 * labels below, which were authored as TICK_FONT - 3 = 15, painted at
 * **7.94px** and did not. They are TICK_FONT - 1 = 17 (9.00px) now; they name
 * the horizontal lines a reader is meant to compare the curve against, so they
 * are must-read, not annotation, and one step of hierarchy below the ticks is
 * all the differentiation they need.
 *
 * On a full-width desktop figure (~700px) 18 units is ~26px, which is why the
 * surrounding chrome (legend, slider) is left at its existing DOM-pixel sizes:
 * only the SVG interior is subject to this scaling penalty.
 */
const TICK_FONT = 18;
/**
 * Advance width of one monospace digit at TICK_FONT, used only to size the
 * left gutter and to decide whether three x-ticks fit. Deliberately a rough
 * 0.6em estimate rather than a measurement: this runs during render on the
 * server as well as the client, so it cannot touch the DOM, and being a few
 * units generous only costs a sliver of plot width.
 */
const TICK_CHAR_W = TICK_FONT * 0.6;
/** Length of the small perpendicular tick marks now drawn at each labelled value. */
const TICK_LEN = 5;

const COLOR_CLASSES: Record<NonNullable<CurveSeries["color"]>, string> = {
  brand: "stroke-brand",
  accent: "stroke-accent",
  muted: "stroke-muted-foreground",
  warning: "stroke-warning",
};

const SUPERSCRIPT_DIGITS: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "-": "⁻",
};

function toSuperscript(text: string): string {
  return text
    .split("")
    .map((ch) => SUPERSCRIPT_DIGITS[ch] ?? ch)
    .join("");
}

/**
 * Formats a single axis tick value to ~2-3 significant figures — same
 * precision-handling problem as `EnergyLevelDiagram.tsx`'s `formatEnergy()`,
 * generalized for an arbitrary (not just energy-scale) domain: values too
 * small to show without absurd precision (e.g. a ~10⁻²⁷ path-integral
 * amplitude, or the ħ/2-natural-units case) fall back to scientific
 * notation instead of collapsing to "0.000...".
 */
function formatTick(value: number): string {
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs < 0.001 || abs >= 100000) {
    const [mantissa, exponent] = value.toExponential(1).split("e");
    return `${mantissa}×10${toSuperscript(exponent.replace("+", ""))}`;
  }
  // Round to 3 significant figures, then round-trip through Number to drop
  // trailing zeros (and any exponential form toPrecision might otherwise
  // pick for this value) — abs is already confined above to a range where
  // the plain decimal form is never unreasonably long.
  return Number(value.toPrecision(3)).toString();
}

/** 2-4 evenly spaced tick values across [min, max], deduped for a collapsed (single-point) domain. */
function tickValues(min: number, max: number): number[] {
  const candidates = [min, min + (max - min) / 2, max];
  return candidates.filter((v, i) => candidates.indexOf(v) === i);
}

/**
 * Drops the midpoint x-tick when the three labels would collide.
 *
 * Three ticks is already this plot's floor — it is min / midpoint / max,
 * and the two endpoints must always be labelled or the reader cannot tell
 * what domain they are looking at — so "thin the ticks at narrow widths"
 * here means exactly one decision: keep the midpoint, or don't. The plot is
 * a fixed-aspect viewBox, so narrowness never changes the *layout*; what
 * changes is label WIDTH, and a domain formatted in scientific notation
 * ("1.0×10⁻²⁷", ~10 characters) produces labels three times wider than
 * "0.5". Keeping the midpoint in that case overlapped the endpoint labels
 * into an unreadable smear, which is strictly worse than one fewer
 * reference value.
 */
function thinXTicks(ticks: number[], labels: string[], plotWidth: number): number[] {
  if (ticks.length < 3) return ticks;
  const widest = Math.max(...labels.map((l) => l.length)) * TICK_CHAR_W;
  // Endpoint labels are anchored inward (start / end), the midpoint is
  // centred, so the worst case is half the midpoint's width plus a full
  // endpoint's width, twice over, plus a gap on each side.
  const needed = widest * 2 + 12;
  return plotWidth >= needed ? ticks : [ticks[0], ticks[ticks.length - 1]];
}

/**
 * A slider-driven line plot over a set of precomputed frames — the same
 * "scrub through a precomputed array" pattern the Rabi and Noise explorers
 * already use, generalized into a reusable primitive. Every frame's data
 * must be computed by the LESSON itself (a plain module-scope `const`
 * calling real `@/lib/quantum/*` functions, exactly like this platform's
 * existing `QuantumStateDisplay` usage) — this component only draws
 * whatever points it's handed, and never computes physics itself. Frames
 * are required (not a live compute callback) because MDX lesson files are
 * Server Components by default; a function prop can't cross that boundary,
 * but a plain array of numbers can.
 */
export function ParametricCurve({
  frames,
  sliderLabel = "",
  referenceLines = [],
  ariaLabel,
  xAxisLabel,
  yAxisLabel,
}: {
  frames: CurveFrame[];
  /** Required when `frames.length > 1` (the slider needs a label); ignored for a single static frame. */
  sliderLabel?: string;
  referenceLines?: { y: number; label: string }[];
  ariaLabel: string;
  /**
   * Name (and, where there is one, unit) of the horizontal quantity — e.g.
   * "qubit count n" or "time t (ns)". Optional and unset at every existing
   * call site, so nothing regresses, but a plot whose axes carry only bare
   * numbers is asking the reader to infer what is being plotted from the
   * surrounding prose. New call sites should pass both.
   */
  xAxisLabel?: string;
  /** Name (and unit) of the vertical quantity. See `xAxisLabel`. */
  yAxisLabel?: string;
}) {
  const { index, setIndex, frame } = useFrameIndex(frames);

  const { xMin, xMax, yMin, yMax } = useMemo(() => {
    const allPoints = frames.flatMap((f) => f.series.flatMap((s) => s.points));
    const allY = [...allPoints.map((p) => p.y), ...referenceLines.map((r) => r.y)];
    return {
      xMin: Math.min(...allPoints.map((p) => p.x)),
      xMax: Math.max(...allPoints.map((p) => p.x)),
      yMin: Math.min(...allY),
      yMax: Math.max(...allY),
    };
  }, [frames, referenceLines]);
  const xSpan = xMax - xMin || 1;
  const ySpan = yMax - yMin || 1;

  const yTicks = tickValues(yMin, yMax);
  const yTickLabels = yTicks.map(formatTick);
  // Gutter = widest y label + the tick mark + breathing room, floored at 44
  // so a single-character domain ("0" .. "1") still has a sane left margin.
  const padLeft = Math.max(
    44,
    Math.ceil(Math.max(...yTickLabels.map((l) => l.length)) * TICK_CHAR_W) + TICK_LEN + 10
  );
  // A pathological domain could in principle demand more gutter than the
  // viewBox has; clamp so the plot never inverts (negative width).
  const plotW = Math.max(80, WIDTH - padLeft - PAD_RIGHT);
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const xOf = (x: number) => padLeft + ((x - xMin) / xSpan) * plotW;
  const yOf = (y: number) => PAD_TOP + (1 - (y - yMin) / ySpan) * plotH;
  const allXTicks = tickValues(xMin, xMax);
  const xTicks = thinXTicks(allXTicks, allXTicks.map(formatTick), plotW);
  const axisY = HEIGHT - PAD_BOTTOM;

  return (
    <div className="not-prose space-y-3 panel-inset p-4">
      <div className="overflow-x-auto">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
          {/* Horizontal ruling at each labelled y value. `--axis-grid` on
              purpose: this is the optional ruling that makes it easier to
              read a curve's height off the axis, and it must stay quieter
              than both the curve and the axis itself. */}
          {yTicks.map((v, i) => (
            <line
              key={`ygrid-${i}`}
              x1={padLeft}
              y1={yOf(v)}
              x2={WIDTH - PAD_RIGHT}
              y2={yOf(v)}
              className="stroke-axis-grid"
              strokeWidth={1}
            />
          ))}

          {/* Axes. Was `stroke-border` at strokeWidth 1 — `--border` is the
              panel-edge token, measured at 1.41:1 on `--surface-muted`,
              against the 3:1 WCAG 2.1 SC 1.4.11 floor for a graphical
              object a reader must perceive. `--axis` clears 3:1 on every
              panel depth in both themes; the extra quarter-unit of weight
              keeps the axis distinguishable from the gridlines it now
              shares a plot with. */}
          <line
            x1={padLeft}
            y1={axisY}
            x2={WIDTH - PAD_RIGHT}
            y2={axisY}
            className="stroke-axis"
            strokeWidth={1.25}
          />
          <line x1={padLeft} y1={PAD_TOP} x2={padLeft} y2={axisY} className="stroke-axis" strokeWidth={1.25} />

          {yTicks.map((v, i) => (
            <g key={`y-${i}`}>
              <line x1={padLeft - TICK_LEN} y1={yOf(v)} x2={padLeft} y2={yOf(v)} className="stroke-axis" strokeWidth={1.25} />
              <text
                x={padLeft - TICK_LEN - 4}
                y={yOf(v) + TICK_FONT * 0.35}
                textAnchor="end"
                fontSize={TICK_FONT}
                className="fill-axis font-mono"
              >
                {yTickLabels[i]}
              </text>
            </g>
          ))}
          {xTicks.map((v, i) => (
            <g key={`x-${i}`}>
              <line x1={xOf(v)} y1={axisY} x2={xOf(v)} y2={axisY + TICK_LEN} className="stroke-axis" strokeWidth={1.25} />
              <text
                x={xOf(v)}
                y={axisY + TICK_LEN + TICK_FONT}
                textAnchor={i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle"}
                fontSize={TICK_FONT}
                className="fill-axis font-mono"
              >
                {formatTick(v)}
              </text>
            </g>
          ))}

          {/* Axis names, when the caller supplies them. Drawn in the plot's
              own top corners rather than in the margins: the margins are
              sized for the tick labels, and stealing more of them would eat
              plot width on exactly the narrow screens this pass exists for. */}
          {yAxisLabel ? (
            <text x={padLeft + 4} y={PAD_TOP - 8} textAnchor="start" fontSize={TICK_FONT} className="fill-axis">
              {yAxisLabel}
            </text>
          ) : null}
          {xAxisLabel ? (
            <text x={WIDTH - PAD_RIGHT} y={HEIGHT - 6} textAnchor="end" fontSize={TICK_FONT} className="fill-axis">
              {xAxisLabel}
            </text>
          ) : null}

          {referenceLines.map((ref, i) => (
            <g key={i}>
              {/* Left at `stroke-foreground/50` deliberately: a threshold
                  line has to out-rank the axis it crosses, and half-alpha
                  foreground already sits well above `--axis` in contrast.
                  Converting it to `stroke-axis` for consistency's sake
                  would have made this line dimmer, not clearer. */}
              <line
                x1={padLeft}
                y1={yOf(ref.y)}
                x2={WIDTH - PAD_RIGHT}
                y2={yOf(ref.y)}
                className="stroke-foreground/50"
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              <text
                x={WIDTH - PAD_RIGHT}
                y={yOf(ref.y) - 5}
                textAnchor="end"
                fontSize={TICK_FONT - 1}
                className="fill-foreground/80"
              >
                {ref.label}
              </text>
            </g>
          ))}
          {frame.series.map((series, i) => {
            const path = series.points
              .map((p, j) => `${j === 0 ? "M" : "L"}${xOf(p.x).toFixed(1)},${yOf(p.y).toFixed(1)}`)
              .join(" ");
            return <path key={i} d={path} fill="none" className={COLOR_CLASSES[series.color ?? "brand"]} strokeWidth={2} />;
          })}
        </svg>
      </div>

      {frame.series.length > 1 && (
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {frame.series.map((series, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {/* Was `h-0.5 w-3` — a 2px × 12px hairline, small enough that
                  telling two series' colours apart in the legend was harder
                  than telling their curves apart in the plot, which defeats
                  the point of having a legend. 4px × 20px matches the 2-unit
                  curve stroke's on-screen weight at typical figure widths. */}
              <span className={cn("h-1 w-5 rounded-full", COLOR_CLASSES[series.color ?? "brand"].replace("stroke-", "bg-"))} />
              {series.label}
            </span>
          ))}
        </div>
      )}

      {frames.length > 1 && (
        <FrameSlider
          label={sliderLabel}
          valueLabel={frame.paramLabel}
          index={index}
          max={frames.length - 1}
          onChange={setIndex}
          boxed={false}
        />
      )}
    </div>
  );
}
