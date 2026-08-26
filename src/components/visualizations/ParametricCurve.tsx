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
 */
const PAD_LEFT = 68;
const PAD_RIGHT = 28;
const PAD_TOP = 28;
const PAD_BOTTOM = 38;

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
}: {
  frames: CurveFrame[];
  /** Required when `frames.length > 1` (the slider needs a label); ignored for a single static frame. */
  sliderLabel?: string;
  referenceLines?: { y: number; label: string }[];
  ariaLabel: string;
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
  const plotW = WIDTH - PAD_LEFT - PAD_RIGHT;
  const plotH = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const xOf = (x: number) => PAD_LEFT + ((x - xMin) / xSpan) * plotW;
  const yOf = (y: number) => PAD_TOP + (1 - (y - yMin) / ySpan) * plotH;
  const xTicks = tickValues(xMin, xMax);
  const yTicks = tickValues(yMin, yMax);

  return (
    <div className="not-prose space-y-3 rounded-xl border border-border bg-surface-muted/40 p-4">
      <div className="overflow-x-auto">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
          <line
            x1={PAD_LEFT}
            y1={HEIGHT - PAD_BOTTOM}
            x2={WIDTH - PAD_RIGHT}
            y2={HEIGHT - PAD_BOTTOM}
            className="stroke-border"
            strokeWidth={1}
          />
          <line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={HEIGHT - PAD_BOTTOM} className="stroke-border" strokeWidth={1} />
          {yTicks.map((v, i) => (
            <text
              key={`y-${i}`}
              x={PAD_LEFT - 6}
              y={yOf(v) + 3}
              textAnchor="end"
              className="fill-muted-foreground text-[9px] font-mono"
            >
              {formatTick(v)}
            </text>
          ))}
          {xTicks.map((v, i) => (
            <text
              key={`x-${i}`}
              x={xOf(v)}
              y={HEIGHT - PAD_BOTTOM + 14}
              textAnchor={i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle"}
              className="fill-muted-foreground text-[9px] font-mono"
            >
              {formatTick(v)}
            </text>
          ))}
          {referenceLines.map((ref, i) => (
            <g key={i}>
              <line
                x1={PAD_LEFT}
                y1={yOf(ref.y)}
                x2={WIDTH - PAD_RIGHT}
                y2={yOf(ref.y)}
                className="stroke-foreground/50"
                strokeWidth={1.25}
                strokeDasharray="4 3"
              />
              <text x={WIDTH - PAD_RIGHT} y={yOf(ref.y) - 3} textAnchor="end" className="fill-muted-foreground text-[10px]">
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
              <span className={cn("h-0.5 w-3", COLOR_CLASSES[series.color ?? "brand"].replace("stroke-", "bg-"))} />
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
