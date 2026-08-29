"use client";

import { useMemo } from "react";
import { useFrameIndex } from "./useFrameIndex";
import { FrameSlider } from "./FrameSlider";

const WIDTH = 480;
const HEIGHT = 280;
const PAD = 36;

/**
 * Deterministic PRNG (mulberry32) so the two point clouds below are
 * reproducible on every render (server-rendered markup must match the
 * client's first paint) and across re-renders of the same frame, unlike
 * `Math.random()`. No seeded-RNG utility exists elsewhere in `src/lib` at
 * the time this was written, so it lives here, scoped to this component.
 */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box-Muller: turns two uniform (0,1) draws into two independent standard-normal draws. */
function standardNormalPair(rng: () => number): [number, number] {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  const mag = Math.sqrt(-2 * Math.log(u));
  return [mag * Math.cos(2 * Math.PI * v), mag * Math.sin(2 * Math.PI * v)];
}

/** Abramowitz & Stegun 7.1.26 approximation of erf, max error ~1.5e-7 — plenty for a visualization. */
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y = 1 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-ax * ax);
  return sign * y;
}

/**
 * Analytic single-shot readout fidelity for two 1D-projected Gaussian
 * clusters (centered at `+separation/2` and `-separation/2`, each with
 * standard deviation `sigma`) classified by a threshold at the midpoint.
 * Each cluster's misclassification probability is the Gaussian tail
 * beyond the midpoint, `0.5 * erfc(separation / (2 * sigma * sqrt(2)))`;
 * by symmetry both clusters share that error rate, so fidelity is one
 * minus it. This is the real formula driving the live readout below —
 * nothing here is a hardcoded fidelity number.
 */
export function computeReadoutFidelity(separation: number, sigma: number): number {
  if (sigma <= 0) return separation > 0 ? 1 : 0.5;
  const z = separation / (2 * sigma * Math.SQRT2);
  const erfc = 1 - erf(z);
  return 1 - 0.5 * erfc;
}

type Point = { x: number; y: number };

/**
 * An IQ-plane (I horizontal, Q vertical) single-shot readout scatter: two
 * Gaussian point clouds, one for shots that landed near the "measured
 * |0>" demodulated voltage/phase and one for "measured |1>", separated by
 * a fixed decision boundary. Dragging the slider changes how far apart
 * the two clusters sit relative to their (fixed) noise spread, growing or
 * shrinking the region where they overlap — that overlap IS the readout
 * error the lesson's `BarChartExplorer` reports as a shot count. This
 * component shows the single-shot physical origin of that statistic; it
 * does not replace the bar chart's aggregate-outcome view.
 *
 * Every cluster's point positions and the live fidelity readout are
 * derived from the same two numbers (separation, sigma) via
 * `computeReadoutFidelity` — nothing is a hardcoded percentage.
 */
export function ReadoutScatter({
  ariaLabel,
  sliderLabel = "Separation-to-noise ratio",
  pointsPerCluster = 36,
  sigma = 1,
  minSeparation = 1,
  maxSeparation = 6,
  steps = 6,
  seed = 42,
  label0 = "Measured |0⟩",
  label1 = "Measured |1⟩",
}: {
  ariaLabel: string;
  sliderLabel?: string;
  pointsPerCluster?: number;
  /** Fixed noise standard deviation shared by both clusters; only separation varies across frames. */
  sigma?: number;
  minSeparation?: number;
  maxSeparation?: number;
  steps?: number;
  seed?: number;
  label0?: string;
  label1?: string;
}) {
  // Fixed, seeded noise offsets for each cluster — generated once and
  // reused at every frame, so dragging the slider reads as the two clouds
  // sliding apart/together rather than re-randomizing their shape.
  const { offsets0, offsets1 } = useMemo(() => {
    const rng0 = mulberry32(seed);
    const rng1 = mulberry32(seed + 1);
    const gen = (rng: () => number): Point[] =>
      Array.from({ length: pointsPerCluster }, () => {
        const [zx, zy] = standardNormalPair(rng);
        return { x: zx * sigma, y: zy * sigma };
      });
    return { offsets0: gen(rng0), offsets1: gen(rng1) };
  }, [seed, pointsPerCluster, sigma]);

  const frames = useMemo(() => {
    return Array.from({ length: steps }, (_, i) => {
      const separation =
        steps === 1 ? minSeparation : minSeparation + (i * (maxSeparation - minSeparation)) / (steps - 1);
      const fidelity = computeReadoutFidelity(separation, sigma);
      const points0 = offsets0.map((p) => ({ x: -separation / 2 + p.x, y: p.y }));
      const points1 = offsets1.map((p) => ({ x: separation / 2 + p.x, y: p.y }));
      return {
        separation,
        fidelity,
        points0,
        points1,
        paramLabel: `SNR = ${separation.toFixed(1)}`,
      };
    });
  }, [steps, minSeparation, maxSeparation, sigma, offsets0, offsets1]);

  const { index, setIndex, frame } = useFrameIndex(frames);

  const { xMin, xMax, yMin, yMax } = useMemo(() => {
    const allPoints = frames.flatMap((f) => [...f.points0, ...f.points1]);
    const xPad = 0.6;
    const yPad = 0.6;
    return {
      xMin: Math.min(...allPoints.map((p) => p.x)) - xPad,
      xMax: Math.max(...allPoints.map((p) => p.x)) + xPad,
      yMin: Math.min(...allPoints.map((p) => p.y)) - yPad,
      yMax: Math.max(...allPoints.map((p) => p.y)) + yPad,
    };
  }, [frames]);

  const xSpan = xMax - xMin || 1;
  const ySpan = yMax - yMin || 1;
  const plotW = WIDTH - 2 * PAD;
  const plotH = HEIGHT - 2 * PAD;
  const xOf = (x: number) => PAD + ((x - xMin) / xSpan) * plotW;
  const yOf = (y: number) => PAD + (1 - (y - yMin) / ySpan) * plotH;

  const errorsPer1000 = Math.round(1000 * (1 - frame.fidelity));

  return (
    <div className="not-prose space-y-3 panel-inset p-4">
      <div className="overflow-x-auto">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={`${ariaLabel} Currently: ${frame.paramLabel}, fidelity approximately ${(frame.fidelity * 100).toFixed(1)} percent.`}>
          {/* The I and Q axes. Was `stroke-border`, the panel-edge token -
              1.41:1 on `--surface-muted`, under the 3:1 WCAG 2.1 SC 1.4.11
              floor - which left the frame a reader is meant to locate the
              two clusters within all but invisible on the dark theme.
              `--axis` clears 3:1 on every panel depth in both themes. */}
          <line x1={PAD} y1={HEIGHT - PAD} x2={WIDTH - PAD} y2={HEIGHT - PAD} className="stroke-axis" strokeWidth={1.25} />
          <line x1={PAD} y1={PAD} x2={PAD} y2={HEIGHT - PAD} className="stroke-axis" strokeWidth={1.25} />
          {/* 10 -> 16 -> 17 units. The box is 254px, not 288px: 288 is the *page column* on a 320px phone
              (320 less Container's `px-4` gutters), but this SVG renders inside
              `panel-inset p-4`, and `panel-inset` (globals.css) supplies border,
              radius and fill and no padding at all — the `p-4` does. Subtract
              2 x (16px padding + 1px border) = 34px.
              So the scale is 254/480 = 0.529, not the 0.6 the 16-unit pass
              assumed: `text-[10px]` painted at 5.29px and 16 units at
              **8.47px** — the 16 was chosen to land at "9.6px" and actually
              landed under the floor. 17 units gives 9.00px. These name the
              plane the whole figure lives in, so they are must-read.
              Nothing had to move for the extra unit: "I (in-phase)" is ~102
              units at 17 and ends at the right pad, "Q (quadrature)" is ~119
              and starts at x = 28, and "decision boundary" sits centred near
              x = 240 on the same baseline as Q with ~20 units of clearance. */}
          <text x={WIDTH - PAD} y={HEIGHT - PAD + 20} textAnchor="end" fontSize={17} className="fill-axis">
            I (in-phase)
          </text>
          <text x={PAD - 8} y={PAD - 10} textAnchor="start" fontSize={17} className="fill-axis">
            Q (quadrature)
          </text>

          {/* dashed decision boundary at the fixed midpoint between the two cluster centers */}
          <line
            x1={xOf(0)}
            y1={PAD}
            x2={xOf(0)}
            y2={HEIGHT - PAD}
            className="stroke-foreground/60"
            strokeWidth={1.5}
            strokeDasharray="5 4"
          />
          <text x={xOf(0)} y={PAD - 10} textAnchor="middle" fontSize={17} className="fill-foreground/80">
            decision boundary
          </text>

          {/* cluster 0: circles */}
          {frame.points0.map((p, i) => (
            <circle key={`c0-${i}`} cx={xOf(p.x)} cy={yOf(p.y)} r={3.5} className="fill-brand/80" />
          ))}

          {/* cluster 1: diamonds (distinct shape, not just color, for colorblind/greyscale legibility) */}
          {frame.points1.map((p, i) => {
            const cx = xOf(p.x);
            const cy = yOf(p.y);
            const s = 4;
            return (
              <path
                key={`c1-${i}`}
                d={`M${cx},${cy - s} L${cx + s},${cy} L${cx},${cy + s} L${cx - s},${cy} Z`}
                className="fill-warning/80"
              />
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand/80" aria-hidden="true" />
          {"●"} {label0}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rotate-45 bg-warning/80" aria-hidden="true" />
          {"◆"} {label1}
        </span>
      </div>

      <p className="text-sm text-foreground">
        Single-shot fidelity at this separation:{" "}
        <span className="font-mono font-medium">{(frame.fidelity * 100).toFixed(1)}%</span>{" "}
        <span className="text-muted-foreground">
          (≈ {errorsPer1000} misclassified shots per 1000, the same statistic the bar chart above reports)
        </span>
      </p>

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
