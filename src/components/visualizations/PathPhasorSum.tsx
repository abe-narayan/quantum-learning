"use client";

import { useMemo, useState } from "react";
import { Complex } from "@/lib/quantum/complex";
import { cn } from "@/lib/utils";

/**
 * A self-contained, illustrative companion to the path-integral lesson's
 * "clock hand" metaphor: give every path between two fixed endpoints a
 * spinning phasor whose angle is set by that path's action, then add all
 * the phasors tip-to-tail and watch the resultant arrow's length track how
 * much the paths reinforce versus cancel each other.
 *
 * IMPORTANT — this is deliberately NOT the lesson's real, exact Euclidean
 * path-integral computation (that lives in `@/lib/quantum/pathIntegral` and
 * is what the Worked Example's `ParametricCurve` plots). Nothing here calls
 * that engine. The "paths" are a handful of sine-perturbed curves generated
 * client-side purely to be pictures of the metaphor; the "action" is a
 * simplified proxy (arc-length excess over the straight line), not a real
 * Lagrangian integral. Self-contained on purpose: unlike `ParametricCurve`
 * (which requires the calling lesson to hand it real, precomputed physics),
 * this component follows the `ExternalFigure`/`PredictBeforeReveal`
 * convention of a "use client" MDX component that owns its own interactive
 * state, because there is no real per-lesson data to thread through — only
 * plain, illustrative numbers it generates itself.
 *
 * Two linked panels, driven by one slider:
 *  - Left: ~20-30 sample paths from a fixed start point to a fixed end
 *    point, varying in "wiggliness" (sine-perturbed deviation from the
 *    straight classical line), each colored by its resulting phase.
 *  - Right: those paths' phasors (unit complex numbers) summed tip-to-tail,
 *    with the final resultant arrow's length read off as the (normalized)
 *    total amplitude.
 *
 * The slider is an "effective ħ" scale, matching the lesson's own framing
 * of ħ as the knob that separates the quantum and classical pictures:
 * angle_i = actionProxy_i / hbarEff, so a SMALL hbarEff amplifies every
 * non-classical path's phase, winding the wilder paths' hands around the
 * clock many times over (net cancellation, short resultant), while a LARGE
 * hbarEff compresses those phases toward the classical path's angle of
 * zero (net reinforcement, long resultant) — the same classical-limit
 * argument the surrounding "Intuition" section describes in words.
 */

const DEFAULT_PATH_COUNT = 25;
const T_SAMPLES = 48;
const MAX_DEVIATION = 0.32; // in normalized position units, same scale as the 0..1 endpoint separation
const ANGLE_SCALE = 2 * Math.PI * 2.5; // radians the single wildest path's angle spans at hbarEff = HBAR_MIN

const HBAR_MIN = 0.4;
const HBAR_MAX = 10;
const HBAR_STEP = 0.1;
const DEFAULT_HBAR_EFF = 1.5;

const X_START = 0;
const X_END = 1;
const X_PLOT_MIN = -0.4;
const X_PLOT_MAX = 1.4;

const LEFT_WIDTH = 340;
const RIGHT_WIDTH = 260;
const PANEL_HEIGHT = 220;
const PAD = 26;

type SamplePath = {
  id: number;
  /** -1 (max deviation one way) .. 0 (classical, straight line) .. 1 (max deviation the other way). */
  deviationFrac: number;
  freq: number;
  points: { t: number; x: number }[];
  /** Arc length of this path minus the straight line's arc length; always >= 0, 0 exactly for the classical path. */
  actionProxy: number;
};

function buildPaths(pathCount: number): SamplePath[] {
  const mid = (pathCount - 1) / 2;
  const straightLength = Math.hypot(1, X_END - X_START);

  return Array.from({ length: pathCount }, (_, i) => {
    const offset = i - mid;
    const deviationFrac = mid === 0 ? 0 : offset / mid; // -1..1, 0 at the middle (classical) path
    const freq = 1 + Math.floor((Math.abs(offset) * 3) / (mid || 1)); // wilder paths wiggle faster too

    const points = Array.from({ length: T_SAMPLES }, (_, s) => {
      const t = s / (T_SAMPLES - 1);
      const straightX = X_START + (X_END - X_START) * t;
      const bump = deviationFrac * MAX_DEVIATION * Math.sin(freq * Math.PI * t);
      return { t, x: straightX + bump };
    });

    let arcLength = 0;
    for (let s = 1; s < points.length; s++) {
      arcLength += Math.hypot(points[s].t - points[s - 1].t, points[s].x - points[s - 1].x);
    }

    return { id: i, deviationFrac, freq, points, actionProxy: Math.max(0, arcLength - straightLength) };
  });
}

function hueForAngle(angle: number): number {
  const twoPi = 2 * Math.PI;
  const wrapped = ((angle % twoPi) + twoPi) % twoPi;
  return (wrapped / twoPi) * 360;
}

export function PathPhasorSum({
  pathCount = DEFAULT_PATH_COUNT,
  initialHbarEff = DEFAULT_HBAR_EFF,
  className,
}: {
  /** Number of illustrative sample paths to draw; kept odd so one path lands exactly on the classical straight line. */
  pathCount?: number;
  /** Starting position of the "effective ħ" slider. */
  initialHbarEff?: number;
  className?: string;
}) {
  const [hbarEff, setHbarEff] = useState(initialHbarEff);

  const paths = useMemo(() => buildPaths(pathCount % 2 === 0 ? pathCount + 1 : pathCount), [pathCount]);
  const maxActionProxy = useMemo(() => Math.max(...paths.map((p) => p.actionProxy), 1e-9), [paths]);

  const { coloredPaths, resultantMagnitudeFrac, cumulativePoints } = useMemo(() => {
    const angles = paths.map((p) => (p.actionProxy / maxActionProxy) * (ANGLE_SCALE / hbarEff));
    const colored = paths.map((p, i) => ({ ...p, angle: angles[i], hue: hueForAngle(angles[i]) }));

    let running = Complex.ZERO;
    const cumulative: Complex[] = [running];
    for (const angle of angles) {
      running = running.add(Complex.fromPolar(1, angle));
      cumulative.push(running);
    }
    const n = paths.length;
    const normalizedCumulative = cumulative.map((c) => c.scale(1 / n));
    const resultant = normalizedCumulative[normalizedCumulative.length - 1];

    return {
      coloredPaths: colored,
      resultantMagnitudeFrac: resultant.magnitude(),
      cumulativePoints: normalizedCumulative,
    };
  }, [paths, maxActionProxy, hbarEff]);

  const leftPlotW = LEFT_WIDTH - 2 * PAD;
  const leftPlotH = PANEL_HEIGHT - 2 * PAD;
  const tOf = (t: number) => PAD + t * leftPlotW;
  const xOf = (x: number) => PAD + (1 - (x - X_PLOT_MIN) / (X_PLOT_MAX - X_PLOT_MIN)) * leftPlotH;

  const R = Math.min(RIGHT_WIDTH, PANEL_HEIGHT) / 2 - PAD;
  const cx = RIGHT_WIDTH / 2;
  const cy = PANEL_HEIGHT / 2;
  const reOf = (c: Complex) => cx + c.re * R;
  const imOf = (c: Complex) => cy - c.im * R;

  const amplitudePct = Math.round(resultantMagnitudeFrac * 100);
  const interferenceLabel =
    amplitudePct > 70 ? "strongly constructive" : amplitudePct < 20 ? "strongly destructive" : "partial";

  const ariaLabel =
    `Left panel: ${paths.length} illustrative paths from a fixed start to a fixed end point, each colored by its phase. ` +
    `Right panel: those paths' phasors summed tip to tail. At effective h-bar = ${hbarEff.toFixed(2)}, ` +
    `the resultant arrow carries ${amplitudePct} percent of the maximum possible amplitude — ${interferenceLabel} interference.`;

  return (
    <div className={cn("not-prose space-y-4 rounded-xl border border-border bg-surface-muted/40 p-4", className)}>
      <div className="grid gap-4 sm:grid-cols-2" role="img" aria-label={ariaLabel}>
        <div>
          <p className="mb-1 text-center text-xs font-medium text-muted-foreground">Sample paths (colored by phase)</p>
          <svg viewBox={`0 0 ${LEFT_WIDTH} ${PANEL_HEIGHT}`} className="mx-auto w-full max-w-sm" aria-hidden="true">
            <line
              x1={tOf(0)}
              y1={xOf(X_START)}
              x2={tOf(1)}
              y2={xOf(X_END)}
              className="stroke-border"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            {coloredPaths.map((p) => (
              <path
                key={p.id}
                d={p.points.map((pt, i) => `${i === 0 ? "M" : "L"}${tOf(pt.t).toFixed(1)},${xOf(pt.x).toFixed(1)}`).join(" ")}
                fill="none"
                stroke={p.deviationFrac === 0 ? "var(--foreground)" : `hsl(${p.hue.toFixed(0)} 70% 55%)`}
                strokeWidth={p.deviationFrac === 0 ? 2.5 : 1.25}
                strokeOpacity={p.deviationFrac === 0 ? 1 : 0.75}
              />
            ))}
            <circle cx={tOf(0)} cy={xOf(X_START)} r={4} className="fill-foreground" />
            <circle cx={tOf(1)} cy={xOf(X_END)} r={4} className="fill-foreground" />
            <text x={tOf(0)} y={xOf(X_START) + 18} textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">
              start
            </text>
            <text x={tOf(1)} y={xOf(X_END) - 10} textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">
              end
            </text>
          </svg>
        </div>

        <div>
          <p className="mb-1 text-center text-xs font-medium text-muted-foreground">Phasors summed tip-to-tail</p>
          <svg viewBox={`0 0 ${RIGHT_WIDTH} ${PANEL_HEIGHT}`} className="mx-auto w-full max-w-xs" aria-hidden="true">
            <circle cx={cx} cy={cy} r={R} fill="none" className="stroke-border/60" strokeWidth={1} strokeDasharray="2 3" />
            <line x1={cx - R - 6} y1={cy} x2={cx + R + 6} y2={cy} className="stroke-border/50" strokeWidth={1} />
            <line x1={cx} y1={cy - R - 6} x2={cx} y2={cy + R + 6} className="stroke-border/50" strokeWidth={1} />

            {coloredPaths.map((p, i) => (
              <line
                key={p.id}
                x1={reOf(cumulativePoints[i]).toFixed(1)}
                y1={imOf(cumulativePoints[i]).toFixed(1)}
                x2={reOf(cumulativePoints[i + 1]).toFixed(1)}
                y2={imOf(cumulativePoints[i + 1]).toFixed(1)}
                stroke={p.deviationFrac === 0 ? "var(--foreground)" : `hsl(${p.hue.toFixed(0)} 70% 55%)`}
                strokeWidth={p.deviationFrac === 0 ? 2 : 1.25}
                strokeOpacity={0.8}
              />
            ))}

            <line
              x1={cx}
              y1={cy}
              x2={reOf(cumulativePoints[cumulativePoints.length - 1]).toFixed(1)}
              y2={imOf(cumulativePoints[cumulativePoints.length - 1]).toFixed(1)}
              className="stroke-accent"
              strokeWidth={2.5}
              markerEnd="url(#resultant-arrowhead)"
            />
            <defs>
              <marker id="resultant-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" className="fill-accent" />
              </marker>
            </defs>
          </svg>
          <p className="text-center text-xs text-muted-foreground">
            Total amplitude: <span className="font-mono font-semibold text-accent">{amplitudePct}%</span> of maximum (
            {interferenceLabel})
          </p>
        </div>
      </div>

      <div>
        <label className="flex items-center justify-between text-xs font-medium text-foreground">
          <span>Effective ħ (phase sensitivity)</span>
          <span className="font-mono text-muted-foreground">ħ_eff = {hbarEff.toFixed(2)}</span>
        </label>
        <input
          type="range"
          min={HBAR_MIN}
          max={HBAR_MAX}
          step={HBAR_STEP}
          value={hbarEff}
          onChange={(e) => setHbarEff(Number(e.target.value))}
          className="mt-2 w-full accent-brand"
          aria-label="Effective h-bar, the phase-sensitivity slider"
          aria-valuetext={`h-bar effective ${hbarEff.toFixed(2)}, resultant amplitude ${amplitudePct} percent of maximum`}
        />
        <p className="mt-1 text-[11px] text-muted-foreground">
          Small ħ_eff amplifies each non-classical path&apos;s phase, so their hands spin wildly and cancel; large
          ħ_eff compresses those phases back toward the classical path&apos;s (0 phase), so hands line up and the
          resultant grows.
        </p>
      </div>
    </div>
  );
}
