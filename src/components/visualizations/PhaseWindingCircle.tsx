"use client";

import { useMemo, useState } from "react";
import { FrameSlider } from "./FrameSlider";
import { PresetToggle } from "./PresetToggle";

const M_OPTIONS: { label: string; m: number }[] = [
  { label: "m = 0", m: 0 },
  { label: "m = 1", m: 1 },
  { label: "m = 2", m: 2 },
  { label: "m = 1/2", m: 0.5 },
  { label: "m = 3/2", m: 1.5 },
];

/** Number of slider steps across one full lap, φ ∈ [0, 2π]. */
const PHI_STEPS = 96;
const TWO_PI = 2 * Math.PI;

const VIEW = 220;
const CENTER = VIEW / 2;
const RADIUS = 82;

/** How close (in normalized circle units) the tip has to land to the start point to count as "back at start". */
const SAME_POINT_TOL = 0.02;

function formatMultipleOfPi(value: number): string {
  const frac = value / Math.PI;
  return `${frac.toFixed(2)}π`;
}

/**
 * A unit circle with a marker at angle m·φ, tracing the same lap the "Why
 * orbital l must be an integer" argument describes: walk φ once around
 * 0 → 2π and ask whether e^{imφ} comes back to where it started.
 *
 * This is deliberately a self-contained illustrative companion, not a
 * lesson-data-driven plot like `ParametricCurve` — there is no per-lesson
 * physics to thread through, only the m·φ arithmetic, computed directly
 * here (same "owns its own client state" convention as `PathPhasorSum`).
 * The φ slider reuses `FrameSlider`'s scrub pattern; the m selector is the
 * same bordered-pill radiogroup convention `OrbitalShapePlot` established
 * for its l/m buttons.
 *
 * What to notice: scrub φ all the way to 2π. For integer m the marker
 * lands exactly back on the "start" ring (e^{im2π}=1). For half-integer m
 * it lands on the exact opposite side of the circle (e^{iπ}=−1) — the
 * same physical point in space, but the wavefunction disagrees with
 * itself about its value there. That contradiction, not any extra
 * physical law, is what rules half-integer m out for a position-space
 * wavefunction.
 */
export function PhaseWindingCircle({ ariaLabel }: { ariaLabel: string }) {
  const [phiIndex, setPhiIndex] = useState(0);
  const [mIndex, setMIndex] = useState(1); // default to m = 1, the simplest nontrivial case

  const { m } = M_OPTIONS[mIndex];
  const phi = (phiIndex / PHI_STEPS) * TWO_PI;
  const angle = m * phi;

  const { tip, tracePath, reVal, imVal, isFullLap, landsAtStart, landsAtAntipode } = useMemo(() => {
    const traceSamples = Math.max(1, Math.round((phiIndex / PHI_STEPS) * 240));
    const points = Array.from({ length: traceSamples + 1 }, (_, i) => {
      const a = (i / Math.max(1, traceSamples)) * angle;
      return { x: CENTER + RADIUS * Math.cos(a), y: CENTER - RADIUS * Math.sin(a) };
    });
    const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

    const re = Math.cos(angle);
    const im = Math.sin(angle);
    const tipPoint = { x: CENTER + RADIUS * re, y: CENTER - RADIUS * im };

    // Distance (in units of the radius) from the tip to the start point
    // (1, 0) and to the antipodal point (-1, 0), used only to phrase the
    // "what just happened" readout once a full lap has been scrubbed to.
    const distToStart = Math.hypot(re - 1, im);
    const distToAntipode = Math.hypot(re + 1, im);

    return {
      tip: tipPoint,
      tracePath: path,
      reVal: re,
      imVal: im,
      isFullLap: phiIndex === PHI_STEPS,
      landsAtStart: distToStart < SAME_POINT_TOL,
      landsAtAntipode: distToAntipode < SAME_POINT_TOL,
    };
  }, [angle, phiIndex]);

  const startPoint = { x: CENTER + RADIUS, y: CENTER };

  const statusText = !isFullLap
    ? null
    : landsAtStart
      ? "Full lap complete: the marker lands exactly back on the start point. e^{im·2π} = 1: single-valued, m is allowed."
      : landsAtAntipode
        ? "Full lap complete: the marker lands on the exact opposite point. e^{im·2π} = −1 ≠ 1: the wavefunction disagrees with itself at a point it never left, so this m is not allowed."
        : "Full lap complete: the marker does not return to the start point.";

  return (
    <div className="not-prose space-y-3 panel-inset p-4">
      <div className="overflow-x-auto">
        {/* Was the bare `ariaLabel` prop, unchanged across every m and every
            φ — so a screen-reader user scrubbing a full lap heard nothing
            about the one thing the figure exists to show. The state now
            rides along with the picture. */}
        <svg
          width={VIEW}
          height={VIEW}
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          role="img"
          aria-label={`${ariaLabel} Unit circle in the complex plane with m = ${m} and φ = ${formatMultipleOfPi(phi)}. The marker sits at angle mφ = ${formatMultipleOfPi(angle)} from the start point.${statusText ? ` ${statusText}` : ""}`}
        >
          {/* The unit circle is the figure's entire frame of reference — the
              claim being made is "does the marker come back to the SAME
              point on this circle", which is unaskable if the circle isn't
              visible. Load-bearing, so `--axis` (≥3:1 on every panel depth)
              rather than `--border` (1.41:1 on `--surface-muted`).

              The two cross-hairs are `--axis` as well, and deliberately not
              `--axis-grid`, which they briefly were. `--axis-grid` is for
              *optional background ruling* — the ruling a reader may use and
              never has to — and sits below 3:1 on purpose (2.21:1 on
              `--surface-muted` in dark, 1.66:1 on paper). These two lines are
              not that: they are the real and imaginary axes of the complex
              plane this figure plots e^{imφ} on, they are named as such by the
              "Re" and "Im" labels immediately below, and the cos + i·sin
              readout under the figure asks the reader to connect the marker's
              horizontal position to a real part and its vertical position to an
              imaginary one. An axis you label and read components off is an
              axis. Labelling a line at 4.5:1 that points at a line at 2.2:1 is
              the specific failure this reverts. They stay subordinate to the
              unit circle by weight (1 against 1.25) and by the circle's dash,
              not by being under the perception floor. */}
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" className="stroke-axis" strokeWidth={1.25} strokeDasharray="2 3" />
          <line x1={CENTER - RADIUS - 8} y1={CENTER} x2={CENTER + RADIUS + 8} y2={CENTER} className="stroke-axis" strokeWidth={1} />
          <line x1={CENTER} y1={CENTER - RADIUS - 8} x2={CENTER} y2={CENTER + RADIUS + 8} className="stroke-axis" strokeWidth={1} />
          {/* Axis names. The figure plots e^{imφ} on the complex plane and
              never said so — a reader who hasn't already internalised
              "horizontal = real part" had no way to connect the marker's
              position to the cos + i·sin readout printed underneath. */}
          {/* "Re" sits on the LEFT arm of the horizontal axis, not the right:
              the right arm is where the φ = 0 start marker and its label
              live, and the two collided there. */}
          <text x={CENTER - RADIUS - 8} y={CENTER - 6} textAnchor="start" fontSize={11} className="fill-axis font-mono">
            Re
          </text>
          <text x={CENTER + 5} y={CENTER - RADIUS - 10} textAnchor="start" fontSize={11} className="fill-axis font-mono">
            Im
          </text>

          {/* Start point, φ = 0 */}
          <circle cx={startPoint.x} cy={startPoint.y} r={5} className="fill-none stroke-foreground" strokeWidth={1.5} />
          {/* Intrinsic 220-unit SVG with no `w-full`, so viewBox scale is 1.0
              and 9 authored units painted at a literal 9px. 12 clears the
              10px floor; "start" is the label the whole "did it come back?"
              question hangs on, so it is must-read text. Anchored *inward*
              from the marker — at 12 units the word is ~36 wide and, placed
              outward from x = 192 in a 220-unit box, ran off the edge. */}
          <text x={startPoint.x - 9} y={startPoint.y - 10} textAnchor="end" fontSize={12} className="fill-foreground font-mono">
            start
          </text>

          {/* Traced path of the marker as φ sweeps 0 → current φ */}
          <path d={tracePath} fill="none" className="stroke-brand/60" strokeWidth={1.5} />

          {/* Radius line to the current marker */}
          <line x1={CENTER} y1={CENTER} x2={tip.x} y2={tip.y} className={isFullLap && landsAtAntipode ? "stroke-warning" : "stroke-brand"} strokeWidth={2} />
          <circle cx={tip.x} cy={tip.y} r={6} className={isFullLap && landsAtAntipode ? "fill-warning" : "fill-brand"} />
        </svg>
      </div>

      {/* Was a hand-rolled `role="radiogroup"` / `role="radio"` row: it
          claimed the radio-group role but had no arrow-key handling and no
          roving tabindex, so it announced one interaction model and
          implemented another, and its pills were ~24px tall. `PresetToggle`
          is that control with the ARIA Authoring Practices pattern already
          in it at a 44px target. */}
      <PresetToggle
        options={M_OPTIONS.map((opt) => ({ label: opt.label }))}
        index={mIndex}
        onChange={setMIndex}
        ariaLabel="Value of m"
      />

      <FrameSlider
        label="φ (angle walked around the axis)"
        valueLabel={`φ = ${formatMultipleOfPi(phi)}`}
        index={phiIndex}
        max={PHI_STEPS}
        onChange={setPhiIndex}
        boxed={false}
      />

      <p className="text-xs text-muted-foreground">
        e<sup>imφ</sup> = cos(mφ) + i·sin(mφ) = {reVal.toFixed(2)} {imVal >= 0 ? "+" : "−"} {Math.abs(imVal).toFixed(2)}i,
        at mφ = {formatMultipleOfPi(angle)}.
      </p>
      {statusText && (
        <p className={isFullLap && landsAtAntipode ? "text-xs font-medium text-warning" : "text-xs font-medium text-brand"}>
          {statusText}
        </p>
      )}
    </div>
  );
}
