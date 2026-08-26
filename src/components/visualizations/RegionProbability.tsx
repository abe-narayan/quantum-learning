"use client";

import { useMemo, useState } from "react";

const WIDTH = 480;
const HEIGHT = 220;
const PAD = 30;
const X_MIN = -4;
const X_MAX = 4;
const GRID_POINTS = 400;
const BOUND_MIN = -3;
const BOUND_MAX = 3;
const BOUND_STEP = 0.05;
const DEFAULT_A = -1;
const DEFAULT_B = 1;

/**
 * |psi(x)|^2 for the lesson's worked-example Gaussian psi(x) = A e^{-x^2/(2
 * sigma^2)}, A = (pi sigma^2)^{-1/4}, evaluated at sigma = 1. The region
 * probability P(-sigma <= x <= sigma) = erf(1) the lesson derives is
 * scale-invariant in sigma (substituting u = x/sigma factors sigma out of
 * the integral entirely), so fixing sigma = 1 here loses no generality
 * relative to that calculation.
 */
function probabilityDensity(x: number): number {
  return (1 / Math.sqrt(Math.PI)) * Math.exp(-x * x);
}

const xValues = Array.from({ length: GRID_POINTS + 1 }, (_, i) => X_MIN + (i * (X_MAX - X_MIN)) / GRID_POINTS);
const densityValues = xValues.map(probabilityDensity);
const dx = (X_MAX - X_MIN) / GRID_POINTS;
const yMax = Math.max(...densityValues);

function xOf(x: number): number {
  return PAD + ((x - X_MIN) / (X_MAX - X_MIN)) * (WIDTH - 2 * PAD);
}

function yOf(y: number): number {
  return PAD + (1 - y / yMax) * (HEIGHT - 2 * PAD);
}

const densityPath = xValues
  .map((x, i) => `${i === 0 ? "M" : "L"}${xOf(x).toFixed(1)},${yOf(densityValues[i]).toFixed(1)}`)
  .join(" ");

/**
 * Plots the fixed Gaussian |psi(x)|^2 from the Probability Density and
 * Normalization lesson's worked example, with two sliders for the region
 * bounds a and b. Shades [a,b] under the curve and numerically integrates
 * |psi(x)|^2 over that region with a Riemann sum (density * dx, the same
 * convention `Wavefunction1D.probabilityDensity()` uses elsewhere on this
 * platform), showing a live P(a <= x <= b) readout. With the default bounds
 * a = -1, b = 1 the readout matches the worked example's erf(1) ~ 0.843.
 */
export function RegionProbability() {
  const [a, setA] = useState(DEFAULT_A);
  const [b, setB] = useState(DEFAULT_B);

  const lo = Math.min(a, b);
  const hi = Math.max(a, b);

  const probability = useMemo(() => {
    // Trapezoidal rule (half-weight the two boundary samples) over the grid
    // points falling within [lo, hi]. A naive left/right-rectangle Riemann
    // sum over-counts by roughly density(edge) * dx per boundary and does
    // not converge to erf(1) at GRID_POINTS = 400; the trapezoidal
    // correction removes that discretization bias without needing a much
    // finer grid.
    const indices: number[] = [];
    for (let i = 0; i < xValues.length; i++) {
      if (xValues[i] >= lo && xValues[i] <= hi) indices.push(i);
    }
    if (indices.length < 2) return 0;
    let sum = 0;
    for (let k = 0; k < indices.length; k++) {
      const isEdge = k === 0 || k === indices.length - 1;
      sum += densityValues[indices[k]] * (isEdge ? 0.5 : 1);
    }
    return sum * dx;
  }, [lo, hi]);

  return (
    <div className="not-prose space-y-4 rounded-xl border border-border bg-surface-muted/40 p-4">
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label={`Plot of the probability density |psi(x)|^2 for a normalized Gaussian, with the region from ${lo.toFixed(2)} to ${hi.toFixed(2)} shaded, giving a computed probability of ${probability.toFixed(3)}`}
      >
        <rect
          x={xOf(lo)}
          y={PAD}
          width={Math.max(0, xOf(hi) - xOf(lo))}
          height={HEIGHT - 2 * PAD}
          className="fill-accent/20"
        />
        <line x1={PAD} y1={HEIGHT - PAD} x2={WIDTH - PAD} y2={HEIGHT - PAD} className="stroke-border" strokeWidth={1} />
        <line x1={PAD} y1={PAD} x2={PAD} y2={HEIGHT - PAD} className="stroke-border" strokeWidth={1} />
        <path d={densityPath} fill="none" className="stroke-brand" strokeWidth={2} />
      </svg>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-medium text-foreground">
          <span className="flex items-center justify-between">
            <span>Lower bound a</span>
            <span className="font-mono text-muted-foreground">{a.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={BOUND_MIN}
            max={BOUND_MAX}
            step={BOUND_STEP}
            value={a}
            onChange={(e) => setA(Number(e.target.value))}
            className="mt-2 w-full accent-brand"
            aria-label="Lower bound a"
          />
        </label>
        <label className="block text-xs font-medium text-foreground">
          <span className="flex items-center justify-between">
            <span>Upper bound b</span>
            <span className="font-mono text-muted-foreground">{b.toFixed(2)}</span>
          </span>
          <input
            type="range"
            min={BOUND_MIN}
            max={BOUND_MAX}
            step={BOUND_STEP}
            value={b}
            onChange={(e) => setB(Number(e.target.value))}
            className="mt-2 w-full accent-brand"
            aria-label="Upper bound b"
          />
        </label>
      </div>

      <p className="rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm text-foreground">
        P({lo.toFixed(2)} {"≤"} x {"≤"} {hi.toFixed(2)}) {"≈"} {probability.toFixed(4)}
      </p>
    </div>
  );
}
