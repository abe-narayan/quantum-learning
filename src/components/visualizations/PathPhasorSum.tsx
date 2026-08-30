"use client";

import { useId, useMemo, useState } from "react";
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

/**
 * Phase hue -> the stroke colour for that path's phasor, in OKLCH rather
 * than HSL and on the pillar ramp's own lightness token rather than a
 * literal.
 *
 * `hsl(H 70% 55%)` was theme-blind, and worse, was not perceptually uniform:
 * HSL's "lightness" is a coordinate of a colour cube, not a lightness, so
 * one number reads as a different apparent lightness at every hue. Measured
 * as WCAG contrast against this figure's `panel-inset` fill, composited at
 * the 0.75 opacity the sample paths are actually drawn at (the phasor panel's
 * 0.8 lands a little better and is not the binding case), the old ramp ran
 * from 1.85:1 at hue 240 to 7.19:1 at hue 60 on the dark theme: a 3.9x
 * spread, with the blues under the 3:1 floor for a graphical object while the
 * yellows sat at body-text contrast. On light paper it inverted, bottoming
 * out at 1.24:1 in the yellows. Hue is this figure's one data channel, so a
 * quarter of the phase circle being illegible is not a cosmetic complaint.
 *
 * OKLCH is what globals.css section 2 already picked for the pillar ramp, for
 * exactly this reason. `oklch(var(--pillar-l-accent) 0.13 H)` holds the whole
 * sweep inside 5.13:1 to 5.70:1 on the dark theme and 3.05:1 to 3.48:1 on the
 * light one, a 1.1x spread, so there is no weak hue left.
 *
 * The lightness is the ramp's token, not a number, so this tracks the theme
 * for free the way every other identity colour on the site does (0.78 dark,
 * 0.51 light, 0.5 under the print stylesheet). The chroma stays a literal
 * 0.13 rather than `var(--pillar-chroma)`: Apex sets chroma to 0.045, which
 * would flatten the phase rainbow to near-greyscale in a figure whose whole
 * argument is carried by hue.
 */
function strokeForPhase(hue: number): string {
  return `oklch(var(--pillar-l-accent) 0.13 ${hue.toFixed(0)})`;
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
  // `useId()` rather than a literal id string. Two instances of this figure
  // on one page emitted duplicate ids, which is invalid HTML and leaves
  // every reference ambiguous: an `id` lookup resolves to the first match in
  // document order, so the second instance's references silently pointed at
  // the first instance's element. Harmless while both are identical, wrong
  // the moment they are not. Matches `ProjectionShadow`, which already does
  // this.
  const idBase = useId();

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
    `the resultant arrow carries ${amplitudePct} percent of the maximum possible amplitude: ${interferenceLabel} interference.`;

  return (
    <div className={cn("not-prose space-y-4 panel-inset p-4", className)}>
      {/* `role="group"`, not `role="img"`. `img` makes every descendant
          presentational, and this wrapper is not a picture — it is two
          `aria-hidden` SVGs *plus four text nodes that are the only prose
          explanation of them*: the two panel captions, the sentence saying
          hue encodes phase (added precisely because "a reader could see a
          rainbow and have no way to know it encoded the one quantity the
          figure is about"), and the live "Total amplitude: N% of maximum"
          readout that changes every time the slider moves. All four were
          being erased from the accessibility tree by the role on this div, so
          the hue gloss in particular was written for a reader who could never
          receive it, and the one number the slider produces was announced
          nowhere.

          `group` carries the same `aria-label` — the full summary is still
          spoken on entry — but leaves its children readable, so the captions
          and the amplitude readout come back. The SVGs stay `aria-hidden`, so
          nothing is announced twice. */}
      <div className="grid gap-4 sm:grid-cols-2" role="group" aria-label={ariaLabel}>
        <div>
          <p className="mb-1 text-center text-xs font-medium text-muted-foreground">Sample paths (colored by phase)</p>
          <svg viewBox={`0 0 ${LEFT_WIDTH} ${PANEL_HEIGHT}`} className="mx-auto w-full max-w-sm" aria-hidden="true">
            {/* The straight classical line between the two endpoints — the
                zero-action reference every other path's phase is measured
                against. Load-bearing, so `--axis` (clears 3:1 on every panel
                depth) rather than `--border`, which is the panel-edge token
                and measured 1.41:1 on `--surface-muted`: on the dark theme
                the reference this figure's whole argument is relative to was
                effectively invisible. */}
            <line
              x1={tOf(0)}
              y1={xOf(X_START)}
              x2={tOf(1)}
              y2={xOf(X_END)}
              className="stroke-axis"
              strokeWidth={1.25}
              strokeDasharray="3 3"
            />
            {coloredPaths.map((p) => (
              <path
                key={p.id}
                d={p.points.map((pt, i) => `${i === 0 ? "M" : "L"}${tOf(pt.t).toFixed(1)},${xOf(pt.x).toFixed(1)}`).join(" ")}
                fill="none"
                stroke={p.deviationFrac === 0 ? "var(--foreground)" : strokeForPhase(p.hue)}
                strokeWidth={p.deviationFrac === 0 ? 2.5 : 1.25}
                strokeOpacity={p.deviationFrac === 0 ? 1 : 0.75}
              />
            ))}
            <circle cx={tOf(0)} cy={xOf(X_START)} r={4} className="fill-foreground" />
            <circle cx={tOf(1)} cy={xOf(X_END)} r={4} className="fill-foreground" />
            {/* viewBox 340 rendered `w-full max-w-sm`; at 320px the
                `sm:grid-cols-2` wrapper is still one column, so this panel
                gets the whole content width — but that width is 254px, not
                the 288px this note used to claim. 288 is the page column;
                the SVG sits inside `panel-inset p-4`, and `panel-inset`
                (globals.css) supplies border, radius and fill and no padding
                — the `p-4` does — so subtract 2 x (16px padding + 1px
                border) = 34px. The scale is therefore 254/340 = 0.747, and
                `text-[9px]` painted at 6.7px rather than 7.6px. 13 units
                lands at **9.71px**, not 11.0px: still over the ~9px floor,
                so the size stands and only the arithmetic is corrected.
                These two words are the only thing establishing that every
                path shares a fixed pair of endpoints, which is the premise
                of the entire figure. */}
            <text x={tOf(0)} y={xOf(X_START) + 20} textAnchor="middle" fontSize={13} className="fill-axis font-mono">
              start
            </text>
            <text x={tOf(1)} y={xOf(X_END) - 12} textAnchor="middle" fontSize={13} className="fill-axis font-mono">
              end
            </text>
          </svg>
          {/* The paths are coloured by phase and nothing said what the
              colours meant — a reader could see a rainbow and have no way to
              know it encoded the one quantity the figure is about. */}
          <p className="mt-1 text-center text-[11px] text-muted-foreground">
            Hue = that path&rsquo;s phase angle; one full trip around the colour wheel is 2π of phase.
          </p>
        </div>

        <div>
          <p className="mb-1 text-center text-xs font-medium text-muted-foreground">Phasors summed tip-to-tail</p>
          <svg viewBox={`0 0 ${RIGHT_WIDTH} ${PANEL_HEIGHT}`} className="mx-auto w-full max-w-xs" aria-hidden="true">
            {/* The unit circle is the scale bar for this panel: the resultant
                arrow's length is only meaningful as a fraction of it ("100%
                of maximum" is the arrow reaching the rim), so it has to be
                perceivable — `--axis`, not the near-invisible `--border`.
                The Re/Im cross-hairs stay subordinate but move to
                `--axis-grid`, the token that is *designed* to sit below the
                3:1 floor, rather than a half-alpha panel edge that landed
                there by accident. */}
            <circle cx={cx} cy={cy} r={R} fill="none" className="stroke-axis" strokeWidth={1.25} strokeDasharray="2 3" />
            <line x1={cx - R - 6} y1={cy} x2={cx + R + 6} y2={cy} className="stroke-axis-grid" strokeWidth={1} />
            <line x1={cx} y1={cy - R - 6} x2={cx} y2={cy + R + 6} className="stroke-axis-grid" strokeWidth={1} />

            {coloredPaths.map((p, i) => (
              <line
                key={p.id}
                x1={reOf(cumulativePoints[i]).toFixed(1)}
                y1={imOf(cumulativePoints[i]).toFixed(1)}
                x2={reOf(cumulativePoints[i + 1]).toFixed(1)}
                y2={imOf(cumulativePoints[i + 1]).toFixed(1)}
                stroke={p.deviationFrac === 0 ? "var(--foreground)" : strokeForPhase(p.hue)}
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
              markerEnd={`url(#${idBase}-resultant-arrowhead)`}
            />
            <defs>
              <marker id={`${idBase}-resultant-arrowhead`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
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
          // `h-11` (44px): a range input centres its track inside whatever
          // height it is given, so this buys the full touch target without
          // changing how the control looks — the same fix
          // `simulators/shared/controls.tsx`'s `SimulatorSlider` already
          // carries. Without it the hit area was the browser default ~16px.
          className="mt-2 h-11 w-full accent-brand"
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
