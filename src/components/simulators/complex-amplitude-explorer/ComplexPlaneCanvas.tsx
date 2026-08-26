"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../bloch-sphere/usePrefersReducedMotion";

const SIZE = 300;
const CENTER = SIZE / 2;
const SCALE = 100; // pixels per unit of magnitude

const ANIMATION_DURATION_MS = 450;
// Successive prop updates closer together than this are treated as part of
// one continuous slider drag (already smooth via re-render every tick) —
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
 * the complex plane — axes, a unit-circle reference, the vector itself,
 * and an arc marking its phase. No canvas/WebGL, geometry redrawn on
 * every parent re-render exactly like `BlochSphereCanvas`'s SVG geometry
 * is. Purely decorative relative to `StatePanel`'s text readout, so it's
 * marked `aria-hidden`.
 *
 * The one bit of state this component keeps for itself: when `re`/`im`
 * jump discontinuously (a preset button, reset, or mode switch — detected
 * by the gap since the last prop change, not by a flag from the caller),
 * it animates the displayed point along a polar lerp (magnitude/angle,
 * not straight-line re/im) so the rotation `e^{iφ}` is meant to teach is
 * something you can actually watch sweep around, rather than teleport.
 * Continuous slider drags are left alone — many renders during a drag
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
      {/* Unit circle */}
      <circle cx={CENTER} cy={CENTER} r={SCALE} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeDasharray="4 4" />

      {/* Axes */}
      <line x1={0} y1={CENTER} x2={SIZE} y2={CENTER} stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} />
      <line x1={CENTER} y1={0} x2={CENTER} y2={SIZE} stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} />
      <text x={SIZE - 14} y={CENTER - 8} fontSize={12} fill="currentColor" opacity={0.5}>Re</text>
      <text x={CENTER + 8} y={14} fontSize={12} fill="currentColor" opacity={0.5}>Im</text>

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
      <circle cx={CENTER} cy={CENTER} r={2.5} fill="currentColor" opacity={0.4} />
    </svg>
  );
}
