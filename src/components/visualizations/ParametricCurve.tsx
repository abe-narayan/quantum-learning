"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useFrameIndex } from "./useFrameIndex";
import { FrameSlider } from "./FrameSlider";

export type CurveSeries = {
  label: string;
  color?: "brand" | "accent" | "muted";
  points: { x: number; y: number }[];
};

export type CurveFrame = {
  /** Pre-formatted, e.g. "η = 0.30" — computed by the caller, not this component, so no function props cross the server/client boundary. */
  paramLabel: string;
  series: CurveSeries[];
};

const WIDTH = 480;
const HEIGHT = 220;
const PAD = 32;

const COLOR_CLASSES: Record<NonNullable<CurveSeries["color"]>, string> = {
  brand: "stroke-brand",
  accent: "stroke-accent",
  muted: "stroke-muted-foreground",
};

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
  const plotW = WIDTH - 2 * PAD;
  const plotH = HEIGHT - 2 * PAD;
  const xOf = (x: number) => PAD + ((x - xMin) / xSpan) * plotW;
  const yOf = (y: number) => PAD + (1 - (y - yMin) / ySpan) * plotH;

  return (
    <div className="not-prose space-y-3 rounded-xl border border-border bg-surface-muted/40 p-4">
      <div className="overflow-x-auto">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
          <line x1={PAD} y1={HEIGHT - PAD} x2={WIDTH - PAD} y2={HEIGHT - PAD} className="stroke-border" strokeWidth={1} />
          <line x1={PAD} y1={PAD} x2={PAD} y2={HEIGHT - PAD} className="stroke-border" strokeWidth={1} />
          {referenceLines.map((ref, i) => (
            <g key={i}>
              <line
                x1={PAD}
                y1={yOf(ref.y)}
                x2={WIDTH - PAD}
                y2={yOf(ref.y)}
                className="stroke-foreground/50"
                strokeWidth={1.25}
                strokeDasharray="4 3"
              />
              <text x={WIDTH - PAD} y={yOf(ref.y) - 3} textAnchor="end" className="fill-muted-foreground text-[10px]">
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
