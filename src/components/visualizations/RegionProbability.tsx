"use client";

import { useMemo, useState } from "react";

const WIDTH = 480;
const HEIGHT = 220;
/**
 * Was a single uniform `PAD = 30`, which left no gutter for axis numbers —
 * and the plot had none, so a reader could see a bell curve and a shaded
 * band but could not tell what x or |ψ|² value anything sat at, in a figure
 * whose entire subject is a numeric integral between two numeric bounds.
 * Split so the two labelled sides get real room.
 */
const PAD_LEFT = 54;
const PAD_RIGHT = 30;
const PAD_TOP = 26;
const PAD_BOTTOM = 46;
/**
 * Axis type size in viewBox units. This SVG renders `w-full`, so authored type
 * scales by (rendered width / 480) — but not by the 288/480 = 0.6 this note
 * used to claim. The box is 254px, not 288px: 288 is the *page column* on a 320px phone
 * (320 less Container's `px-4` gutters), but this SVG renders inside
 * `panel-inset p-4`, and `panel-inset` (globals.css) supplies border,
 * radius and fill and no padding at all — the `p-4` does. Subtract
 * 2 x (16px padding + 1px border) = 34px.
 * The real box is 254px and the scale is 254/480 = 0.529, so the 16 units
 * chosen to paint "at 9.6px" actually painted at **8.47px**, under the floor.
 * 17 gives 9.00px.
 *
 * The extra unit costs no layout: the y ticks are four monospace characters
 * (~41 units) right-aligned at x = 45, so they start at x = 4; the "x (units of
 * σ)" caption is ~143 units ending at x = 450; and PAD_TOP = 26 leaves the
 * "|ψ(x)|²" label's cap tops at y = 5.
 */
const AXIS_FONT = 17;
const TICK_LEN = 5;
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
  return PAD_LEFT + ((x - X_MIN) / (X_MAX - X_MIN)) * (WIDTH - PAD_LEFT - PAD_RIGHT);
}

function yOf(y: number): number {
  return PAD_TOP + (1 - y / yMax) * (HEIGHT - PAD_TOP - PAD_BOTTOM);
}

const BASELINE_Y = HEIGHT - PAD_BOTTOM;

const densityPath = xValues
  .map((x, i) => `${i === 0 ? "M" : "L"}${xOf(x).toFixed(1)},${yOf(densityValues[i]).toFixed(1)}`)
  .join(" ");

/**
 * The filled region between the curve and the axis over [lo, hi] — i.e. the
 * literal area the Riemann sum below is adding up.
 *
 * This replaces a full-height `<rect>` spanning [lo, hi] from the top of the
 * plot to the bottom. That rect was actively teaching the wrong thing: a
 * probability is the area UNDER the density curve, and shading a rectangle
 * that extends far above the curve says the shaded quantity is a *width*
 * (or a box), not an integral. It also made P = 1 look unreachable, because
 * the fully-shaded rectangle at a = -3, b = 3 is visibly much larger than
 * the curve it contains. Tracing the curve makes the picture and the
 * `probability` readout the same object.
 */
function regionPath(lo: number, hi: number): string {
  const inside = xValues.filter((x) => x >= lo && x <= hi);
  if (inside.length < 2) return "";
  const top = inside
    .map((x, i) => `${i === 0 ? "M" : "L"}${xOf(x).toFixed(1)},${yOf(probabilityDensity(x)).toFixed(1)}`)
    .join(" ");
  const first = xOf(inside[0]).toFixed(1);
  const last = xOf(inside[inside.length - 1]).toFixed(1);
  return `${top} L${last},${BASELINE_Y.toFixed(1)} L${first},${BASELINE_Y.toFixed(1)} Z`;
}

/** Ticks at every integer in the plotted domain — the bounds are set in 0.05 steps, so integers are the natural coarse ruler. */
const X_TICKS = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

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
    <div className="not-prose space-y-4 panel-inset p-4">
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label={`Plot of the probability density |psi(x)|^2 for a normalized Gaussian. The area under the curve between x = ${lo.toFixed(2)} and x = ${hi.toFixed(2)} is shaded; that area, the probability of finding the particle in that region, is ${probability.toFixed(3)}.`}
      >
        {/* The shaded area under the curve over [a, b] — the integral itself,
            not a bounding box around it. See `regionPath`. */}
        <path d={regionPath(lo, hi)} className="fill-accent/30" />

        {/* Axes. Were `stroke-border`: that is the panel-edge token, measured
            at 1.41:1 on `--surface-muted` against the 3:1 WCAG 2.1 SC 1.4.11
            floor, so the baseline the shaded area is measured down to was
            barely visible on the dark theme. `--axis` clears 3:1 on every
            panel depth in both themes. */}
        <line x1={PAD_LEFT} y1={BASELINE_Y} x2={WIDTH - PAD_RIGHT} y2={BASELINE_Y} className="stroke-axis" strokeWidth={1.25} />
        <line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={BASELINE_Y} className="stroke-axis" strokeWidth={1.25} />

        {X_TICKS.map((v) => (
          <g key={v}>
            <line x1={xOf(v)} y1={BASELINE_Y} x2={xOf(v)} y2={BASELINE_Y + TICK_LEN} className="stroke-axis" strokeWidth={1.25} />
            <text
              x={xOf(v)}
              y={BASELINE_Y + TICK_LEN + AXIS_FONT}
              textAnchor="middle"
              fontSize={AXIS_FONT}
              className="fill-axis font-mono"
            >
              {v}
            </text>
          </g>
        ))}
        {/* Only two y ticks: 0 and the curve's peak. The vertical scale here
            exists to establish that the curve is a density with a finite
            height, not to be read off point by point — the number the reader
            actually wants is the integral, printed full-size below. */}
        {[0, yMax].map((v) => (
          <g key={`y-${v}`}>
            <line x1={PAD_LEFT - TICK_LEN} y1={yOf(v)} x2={PAD_LEFT} y2={yOf(v)} className="stroke-axis" strokeWidth={1.25} />
            <text
              x={PAD_LEFT - TICK_LEN - 4}
              y={yOf(v) + AXIS_FONT * 0.35}
              textAnchor="end"
              fontSize={AXIS_FONT}
              className="fill-axis font-mono"
            >
              {v.toFixed(2)}
            </text>
          </g>
        ))}

        {/* Boundary rules at a and b: without them the reader has to guess
            which slider moved which edge of the shaded area. */}
        {[lo, hi].map((bound, i) => (
          <line
            key={i}
            x1={xOf(bound)}
            y1={yOf(probabilityDensity(bound))}
            x2={xOf(bound)}
            y2={BASELINE_Y}
            className="stroke-accent"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
        ))}

        <path d={densityPath} fill="none" className="stroke-brand" strokeWidth={2} />

        <text x={PAD_LEFT + 4} y={PAD_TOP - 8} fontSize={AXIS_FONT} className="fill-axis font-mono">
          |ψ(x)|²
        </text>
        <text x={WIDTH - PAD_RIGHT} y={HEIGHT - 6} textAnchor="end" fontSize={AXIS_FONT} className="fill-axis font-mono">
          x (units of σ)
        </text>
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
            // `h-11` (44px) for the touch target. A range input centres its
            // track inside the height it is given, so this changes only the
            // hit area, which was the browser default ~16px.
            className="mt-2 h-11 w-full accent-brand"
            // The probability rides along in `aria-valuetext`, not just the
            // bound. A slider's value text is the one string re-announced on
            // every change, and the bound alone is the *input*, never the
            // answer: the probability this figure exists to compute lived only
            // in the `<svg role="img">` label (a static accessible name,
            // computed once, never re-announced) and in the `<p>` readout
            // below (plain text, no live region). So a screen-reader user
            // could drag from a = -3 to a = 0 hearing nothing but their own
            // input echoed back — the figure's entire output was inaudible.
            // Both sliders carry it because either one changes it.
            aria-valuetext={`lower bound a = ${a.toFixed(2)}, probability ${probability.toFixed(3)}`}
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
            // `h-11` (44px) for the touch target — see the lower-bound
            // slider above.
            className="mt-2 h-11 w-full accent-brand"
            // Carries the probability too — see the lower-bound slider above
            // for why the bound on its own announced nothing useful.
            aria-valuetext={`upper bound b = ${b.toFixed(2)}, probability ${probability.toFixed(3)}`}
            aria-label="Upper bound b"
          />
        </label>
      </div>

      <p className="panel px-4 py-3 font-mono text-sm text-foreground">
        P({lo.toFixed(2)} {"≤"} x {"≤"} {hi.toFixed(2)}) {"≈"} {probability.toFixed(4)}
      </p>
    </div>
  );
}
