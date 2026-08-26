"use client";

import { useMemo } from "react";
import { useFrameIndex } from "./useFrameIndex";
import { FrameSlider } from "./FrameSlider";

/** Standard deviation of the fixed illustrative Gaussian |psi(x)|^2 = N(0, SIGMA^2). */
const SIGMA = 1.2;
/** Plot domain is [-HALF_WIDTH, HALF_WIDTH]; at 4 sigma the tails are visually negligible. */
const HALF_WIDTH = 4 * SIGMA;

/** Grid resolutions the slider steps through — coarse enough at N=4 to look nothing like a curve, fine enough at N=140 that the bars visually fuse into one. */
const N_VALUES = [4, 8, 12, 20, 32, 50, 80, 140];

const WIDTH = 480;
const HEIGHT = 220;
const PAD_LEFT = 40;
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 32;
const PLOT_W = WIDTH - PAD_LEFT - PAD_RIGHT;
const PLOT_H = HEIGHT - PAD_TOP - PAD_BOTTOM;

/** The fixed illustrative density |psi(x)|^2, a normalized Gaussian: integrates to exactly 1 over all x. */
function density(x: number): number {
  return Math.exp(-(x * x) / (2 * SIGMA * SIGMA)) / (SIGMA * Math.sqrt(2 * Math.PI));
}

const Y_MAX = density(0) * 1.1;

/** 200-sample smooth curve of the continuum-limit density, computed once. */
const SMOOTH_CURVE_POINTS = Array.from({ length: 201 }, (_, i) => {
  const x = -HALF_WIDTH + (i / 200) * 2 * HALF_WIDTH;
  return { x, y: density(x) };
});

type Bar = { xLeft: number; xRight: number; height: number };

type Frame = {
  n: number;
  paramLabel: string;
  bars: Bar[];
  /** Riemann sum of bar areas (height * width), the discrete stand-in for integral |psi(x)|^2 dx — should stay close to 1 for every N. */
  areaSum: number;
};

/**
 * Precomputes, for a single grid resolution N, the histogram of
 * |c_i|^2 = |psi(x_i)|^2 * Delta x expressed as a *density* histogram (bar
 * height = |psi(x_i)|^2, bar width = Delta x, so bar AREA = |c_i|^2) — the
 * exact object the lesson's discretization argument constructs. x_i is each
 * cell's midpoint, the natural point to sample a piecewise-constant
 * approximation of psi.
 */
function buildFrame(n: number): Frame {
  const dx = (2 * HALF_WIDTH) / n;
  let areaSum = 0;
  const bars: Bar[] = [];
  for (let i = 0; i < n; i++) {
    const xLeft = -HALF_WIDTH + i * dx;
    const xRight = xLeft + dx;
    const xMid = xLeft + dx / 2;
    const height = density(xMid);
    areaSum += height * dx;
    bars.push({ xLeft, xRight, height });
  }
  return {
    n,
    paramLabel: `N = ${n} (Δx ≈ ${dx.toFixed(2)})`,
    bars,
    areaSum,
  };
}

const FRAMES: Frame[] = N_VALUES.map(buildFrame);

/**
 * Visualizes the lesson's discretization-to-continuum argument directly:
 * a slider over grid resolution N redraws the histogram of discrete cell
 * probabilities |c_i|^2 = |psi(x_i)|^2 * Delta x over a fixed illustrative
 * Gaussian psi(x). Bar HEIGHT is the density |psi(x_i)|^2 and bar WIDTH is
 * Delta x, so bar AREA is |c_i|^2 itself — at low N the bars are a few fat,
 * visibly blocky rectangles; at high N they thin and fuse into the smooth
 * |psi(x)|^2 curve drawn as a dashed overlay, whose visual dominance is
 * ramped up with N so it reads as "the bars are becoming this line" rather
 * than a static reference. The running Riemann sum of bar areas is printed
 * beneath the plot to make normalization staying ~1 an observed fact, not
 * an assertion.
 */
export function DiscretizationLimit({ ariaLabel }: { ariaLabel: string }) {
  const { index, setIndex, frame } = useFrameIndex(FRAMES);

  const xOf = (x: number) => PAD_LEFT + ((x + HALF_WIDTH) / (2 * HALF_WIDTH)) * PLOT_W;
  const yOf = (y: number) => PAD_TOP + (1 - y / Y_MAX) * PLOT_H;

  const smoothPath = useMemo(
    () => SMOOTH_CURVE_POINTS.map((p, i) => `${i === 0 ? "M" : "L"}${xOf(p.x).toFixed(1)},${yOf(p.y).toFixed(1)}`).join(" "),
    []
  );

  // Curve overlay fades in as N grows, so at N=4 it reads as background
  // context and by the largest N it reads as "this is what the bars are
  // becoming" rather than a fixed reference drawn from the start.
  const curveOpacity = 0.25 + (index / (FRAMES.length - 1)) * 0.65;

  return (
    <div className="not-prose space-y-3 rounded-xl border border-border bg-surface-muted/40 p-4">
      <div className="overflow-x-auto">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
          <line x1={PAD_LEFT} y1={HEIGHT - PAD_BOTTOM} x2={WIDTH - PAD_RIGHT} y2={HEIGHT - PAD_BOTTOM} className="stroke-border" strokeWidth={1} />
          <line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={HEIGHT - PAD_BOTTOM} className="stroke-border" strokeWidth={1} />
          <text x={WIDTH - PAD_RIGHT} y={HEIGHT - PAD_BOTTOM + 14} textAnchor="end" className="fill-muted-foreground text-[10px]">
            x
          </text>
          <text x={PAD_LEFT - 6} y={PAD_TOP + 8} textAnchor="end" className="fill-muted-foreground text-[10px]">
            |&psi;(x)|&sup2;
          </text>

          {frame.bars.map((bar, i) => (
            <rect
              key={i}
              x={xOf(bar.xLeft)}
              y={yOf(bar.height)}
              width={Math.max(0, xOf(bar.xRight) - xOf(bar.xLeft) - (frame.n > 60 ? 0 : 0.75))}
              height={Math.max(0, yOf(0) - yOf(bar.height))}
              className="fill-brand/70 transition-all duration-500 ease-out motion-reduce:transition-none"
            />
          ))}

          <path
            d={smoothPath}
            fill="none"
            className="stroke-accent transition-opacity duration-500 ease-out motion-reduce:transition-none"
            strokeWidth={2}
            strokeDasharray="5 3"
            style={{ opacity: curveOpacity }}
          />
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand/70" />
          discrete cells: bar area = |c<sub>i</sub>|&sup2;
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-3 border-t-2 border-dashed border-accent" />
          continuum limit: |&psi;(x)|&sup2;
        </span>
      </div>

      <FrameSlider label="Grid resolution" valueLabel={frame.paramLabel} index={index} max={FRAMES.length - 1} onChange={setIndex} boxed={false} />

      <p className="font-mono text-xs text-muted-foreground">
        &Sigma;<sub>i</sub> |c<sub>i</sub>|&sup2; &asymp; {frame.areaSum.toFixed(4)} &mdash; stays &asymp; 1 at every N, exactly the Riemann sum in
        the derivation above.
      </p>
    </div>
  );
}
