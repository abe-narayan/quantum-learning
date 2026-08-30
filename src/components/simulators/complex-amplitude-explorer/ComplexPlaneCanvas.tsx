"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../bloch-sphere/usePrefersReducedMotion";

const SIZE = 300;
const CENTER = SIZE / 2;
const SCALE = 100; // pixels per unit of magnitude

/**
 * AXIS/REFERENCE TYPE, MEASURED.
 *
 * This SVG renders `w-full max-w-xs` on a 300-unit viewBox, so its effective
 * type is fontSize x (rendered width) / 300.
 *
 * THE BOX, RE-MEASURED. The earlier pass here took the narrowest stage to be
 * 254px: a 320px viewport, less the `Container px-4` gutters, less one
 * `SimulatorInstrument` frame at 2 x (16px padding + 1px border) = 34px. That
 * is the `/simulators` bench box. `ComplexAmplitudeExplorer` is embedded in
 * eight lessons and `CompareStatesExplorer` in one, and a lesson embed sits
 * inside `InteractiveSection` — itself an `.instrument` with a `p-4` body,
 * whose `has-[[data-mdx-slot=embed]_.instrument]` de-framing selector removes
 * that wrapper's border *colour*, wash and shadow but neither its 1px border
 * box nor its padding. The real narrowest box is therefore
 * 320 - 32 - 34 - 34 = **220px**, confirmed against the served markup of a
 * lesson that embeds a simulator, and both the single-plane and the stacked
 * α/β layouts collapse to that full stage width at 320px (the 240px cap in
 * `CompareStatesExplorer` and the `max-w-xs` here are both above it, so
 * neither binds).
 *
 * At 220px, 12 units painted at **8.80px**, under the ~9px floor the rest of
 * this bench is sized to. 13 units gives 13 x 220/300 = **9.53px** at 220px,
 * 10.4px in a 240px `CompareStatesExplorer` cell, 11.0px on the 254px bench
 * stage, and 13px at the `max-w-xs` cap. The geometry absorbs the extra unit
 * with no other change: "|z| = 1" is 7 mono characters at ~0.6em, 54.6 units,
 * right-anchored at x = 72, so it starts at x = 17.4; "Re" ends at x = 292 and
 * "Im" has a 9.4-unit cap height under a baseline at y = 16.
 *
 * The colour repair this comment originally recorded still stands: these
 * labels were `currentColor` at 50% opacity, which no contrast floor in the
 * system accepts. See `CompareStatesExplorer` for that file's layout
 * arithmetic; before it, two of these shared a stage and painted at 4.76px.
 */
const AXIS_LABEL_SIZE = 13;
/** Right edge of the |z| = 1 caption: clear of the ring's upper-left quadrant, inside the box. */
const MAGNITUDE_LABEL_X = CENTER - SCALE * 0.78;

const ANIMATION_DURATION_MS = 450;
// Successive prop updates closer together than this are treated as part of
// one continuous slider drag (already smooth via re-render every tick),
// only a gap this large signals a discrete jump (preset click, reset, mode
// switch) worth actually animating.
const DISCRETE_JUMP_GAP_MS = 80;

function toScreen(re: number, im: number): { x: number; y: number } {
  return { x: CENTER + re * SCALE, y: CENTER - im * SCALE };
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Interpolates from `fromAngle` to `toAngle` along the shorter arc, so a sweep never takes the "long way around" the plane. */
function lerpAngleShortestPath(fromAngle: number, toAngle: number, t: number): number {
  let delta = toAngle - fromAngle;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;
  return fromAngle + delta * t;
}

/**
 * A pure SVG rendering of a single complex number as a point/vector on
 * the complex plane: axes, a unit-circle reference, the vector itself,
 * and an arc marking its phase. No canvas/WebGL, geometry redrawn on
 * every parent re-render exactly like `BlochSphereCanvas`'s SVG geometry
 * is. Purely decorative relative to `StatePanel`'s text readout, so it's
 * marked `aria-hidden`.
 *
 * The one bit of state this component keeps for itself: when `re`/`im`
 * jump discontinuously (a preset button, reset, or mode switch; detected
 * by the gap since the last prop change, not by a flag from the caller),
 * it animates the displayed point along a polar lerp (magnitude/angle,
 * not straight-line re/im) so the rotation `e^{iφ}` is meant to teach is
 * something you can actually watch sweep around, rather than teleport.
 * Continuous slider drags are left alone; many renders during a drag
 * already look smooth without this.
 */
export function ComplexPlaneCanvas({ re, im }: { re: number; im: number }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const [displayRe, setDisplayRe] = useState(re);
  const [displayIm, setDisplayIm] = useState(im);

  const propsRef = useRef({ re, im });
  const lastUpdateAtRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const previous = propsRef.current;
    propsRef.current = { re, im };
    if (previous.re === re && previous.im === im) return;

    const now = typeof performance !== "undefined" ? performance.now() : 0;
    const gapSincePreviousUpdate = now - lastUpdateAtRef.current;
    lastUpdateAtRef.current = now;

    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);

    const isDiscreteJump = gapSincePreviousUpdate > DISCRETE_JUMP_GAP_MS;
    if (prefersReducedMotion || !isDiscreteJump) {
      setDisplayRe(re);
      setDisplayIm(im);
      return;
    }

    const fromMagnitude = Math.hypot(previous.re, previous.im);
    const fromAngle = Math.atan2(previous.im, previous.re);
    const toMagnitude = Math.hypot(re, im);
    const toAngle = Math.atan2(im, re);
    const start = now;

    const step = (timestamp: number) => {
      const t = Math.min(1, (timestamp - start) / ANIMATION_DURATION_MS);
      const eased = easeInOutCubic(t);
      const magnitude = fromMagnitude + (toMagnitude - fromMagnitude) * eased;
      const angle = lerpAngleShortestPath(fromAngle, toAngle, eased);
      setDisplayRe(magnitude * Math.cos(angle));
      setDisplayIm(magnitude * Math.sin(angle));
      animationFrameRef.current = t < 1 ? requestAnimationFrame(step) : null;
    };
    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [re, im, prefersReducedMotion]);

  const point = toScreen(displayRe, displayIm);
  const magnitude = Math.hypot(displayRe, displayIm);
  const phase = Math.atan2(displayIm, displayRe);

  // A short arc from the positive real axis to the vector's angle, radius scaled below 1 unit so it never overlaps the vector itself.
  const arcRadius = 28;
  const arcStart = toScreen(arcRadius / SCALE, 0);
  const arcEnd = { x: CENTER + arcRadius * Math.cos(phase), y: CENTER - arcRadius * Math.sin(phase) };
  const largeArcFlag = Math.abs(phase) > Math.PI ? 1 : 0;
  const sweepFlag = phase < 0 ? 1 : 0;

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full max-w-xs"
      aria-hidden="true"
    >
      {/* The magnitude-1 reference, and the only thing in the frame that says
          what the ring means. `--axis`, not `currentColor` at 15%: this is the
          ruler the arrow's length is read against (the whole instrument is
          about |z| and |z|², and |z| = 1 is where a normalized amplitude
          lands), which is a reference line under the chart contract, not
          optional ruling. It stays dashed so it never reads as a third axis. */}
      <circle cx={CENTER} cy={CENTER} r={SCALE} fill="none" className="stroke-axis" strokeDasharray="4 4" />
      <text x={MAGNITUDE_LABEL_X} y={CENTER - SCALE * 0.72} fontSize={AXIS_LABEL_SIZE} textAnchor="end" className="fill-muted-foreground font-mono">
        |z| = 1
      </text>

      {/* Axes. `--axis` (4.5:1) for the lines, `--muted-foreground` (6.78:1)
          for the two names: both were `currentColor` at 30% and 50%, which is
          an alpha, not a token, and landed the coordinate frame of the figure
          under every contrast floor in the system. The names are annotation
          text, so they take the *higher* of the two tokens; `--axis` sits a
          step below `--muted-foreground` by design and would have lowered
          their contrast rather than raised it.

          `textAnchor="end"` on Re, at SIZE - 8 rather than a start anchor at
          SIZE - 14: at 12 units "Re" is ~14 units wide, so the start anchor put
          its right edge at exactly 300, the viewBox edge, where SVG clips
          silently. Anchoring by the end bounds it at 292 whatever face the
          browser substitutes. */}
      <line x1={0} y1={CENTER} x2={SIZE} y2={CENTER} className="stroke-axis" strokeWidth={1} />
      <line x1={CENTER} y1={0} x2={CENTER} y2={SIZE} className="stroke-axis" strokeWidth={1} />
      <text x={SIZE - 8} y={CENTER - 8} fontSize={AXIS_LABEL_SIZE} textAnchor="end" className="fill-muted-foreground">Re</text>
      <text x={CENTER + 8} y={16} fontSize={AXIS_LABEL_SIZE} className="fill-muted-foreground">Im</text>

      {/* Phase arc (only drawn once the vector has non-negligible magnitude) */}
      {magnitude > 0.05 ? (
        <path
          d={`M ${arcStart.x} ${arcStart.y} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${sweepFlag} ${arcEnd.x} ${arcEnd.y}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.5}
        />
      ) : null}

      {/* The vector itself */}
      <line
        x1={CENTER}
        y1={CENTER}
        x2={point.x}
        y2={point.y}
        stroke="var(--pillar-accent)"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <circle cx={point.x} cy={point.y} r={5} fill="var(--pillar-accent)" />
      {/* The origin. Where zero is, is the canonical mark a reader must perceive
          in a plot, so it takes `--axis` rather than 40% of the body foreground. */}
      <circle cx={CENTER} cy={CENTER} r={2.5} className="fill-axis" />
    </svg>
  );
}
