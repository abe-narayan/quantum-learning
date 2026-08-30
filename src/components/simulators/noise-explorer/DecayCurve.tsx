"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/simulators/bloch-sphere/usePrefersReducedMotion";
import { easeInOutCubic } from "@/components/simulators/bloch-sphere/useAnimatedBlochPoint";

/**
 * TICK/AXIS TYPE, AND THE GEOMETRY THAT HAD TO MOVE WITH IT.
 *
 * This plot renders `w-full` on a 520-unit viewBox inside a
 * `SimulatorInstrument`, whose body is `p-4 sm:p-5` on a 1px-bordered
 * `.instrument`.
 *
 * THE BOX, RE-MEASURED. The previous pass here measured 254px: a 320px
 * viewport, less the `Container px-4` gutters (288px of column), less one
 * instrument frame at 2 x (16px padding + 1px border) = 34px. That is the box
 * this plot gets on the `/simulators` bench, and it is the wrong box for the
 * narrowest mount it actually has. `NoiseExplorer` is embedded in five
 * lessons, and a lesson embed goes through `InteractiveSection`, which is
 * itself an `.instrument` with a `p-4` body. Its de-framing selector
 * (`has-[[data-mdx-slot=embed]_.instrument]`) switches off that wrapper's
 * border *colour*, wash and shadow, but the 1px border box and the 16px of
 * padding both stay. So the real narrowest box is
 *
 *     320 - 32 (Container px-4) - 34 (InteractiveSection) - 34 (this
 *     instrument) = **220px**
 *
 * confirmed against the served markup for
 * /lessons/quantum-hardware/noise-decoherence-and-scaling/sources-of-noise,
 * where the two `.instrument` divs nest exactly that way. Authored type
 * therefore scales by 220/520 = 0.423, not 0.488: the 19 units this was raised
 * to painted at **8.04px** in every lesson, back under the ~9px floor. 22
 * units gives 22 x 0.423 = **9.31px** at 220px, 10.74px on the bench at 254px,
 * and a literal 22px at the widest.
 *
 * Constants that move with the type, because larger labels do not fit gutters
 * cut for smaller ones:
 *  - PAD_LEFT 44 -> 50. The widest tick is "0.5": three characters of the mono
 *    face at ~0.6em advance = 3 x 13.2 = 39.6 units. Right-aligned 6 units
 *    clear of the axis it needs 45.6 units of gutter, so 44 would have pushed
 *    its left edge past x = 0 and SVG would have clipped it silently.
 *  - The tick baseline offset 6 -> 8, which is the ~0.36em that centres the
 *    glyph on its gridline at this size; the topmost tick's cap height then
 *    lands at y = 2.2, still inside the viewBox.
 *  - PAD_BOTTOM stays 30: the bottom caption's baseline at HEIGHT - 6 puts its
 *    cap top at y = 148 against an x axis at y = 140, so it still clears
 *    rather than straddles, and its descenders reach y = 168.8 of 170.
 *    HEIGHT does not move, so the plot keeps its full vertical range - losing
 *    any of it would flatten the very decay this figure exists to show.
 */
const WIDTH = 520;
const HEIGHT = 170;
const PAD_LEFT = 50;
const PAD_BOTTOM = 30;
const PAD_TOP = 10;
/** Tween duration for the current-step marker's position. */
const MARKER_TWEEN_MS = 200;

/** A step-indexed SVG line plot (e.g. purity or |Bloch vector| vs. channel application count), with a marker at the current step. */
export function DecayCurve({
  samples,
  currentStep,
  label,
}: {
  samples: number[];
  currentStep: number;
  label: string;
}) {
  const plotWidth = WIDTH - PAD_LEFT;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const maxStep = samples.length - 1;

  const xOf = (step: number) => PAD_LEFT + (maxStep === 0 ? 0 : (step / maxStep) * plotWidth);
  const yOf = (v: number) => PAD_TOP + (1 - v) * plotHeight;

  const path = samples.map((v, i) => `${i === 0 ? "M" : "L"}${xOf(i).toFixed(1)},${yOf(v).toFixed(1)}`).join(" ");

  const targetX = xOf(currentStep);
  const targetY = yOf(samples[currentStep] ?? 0);

  const prefersReducedMotion = usePrefersReducedMotion();
  // The marker jumps discretely between steps by default; tween its screen
  // position over ~200ms instead so a step change reads as motion along the
  // curve (teaching-relevant: it's what makes "this step" register as a
  // point moving through the decay, not a channel that teleports).
  const [markerPos, setMarkerPos] = useState({ x: targetX, y: targetY });
  // Tracks the marker's actual on-screen position every frame (not just at
  // tween completion) so an interrupted tween (e.g. dragging the steps
  // slider fast enough that a new target arrives before the previous tween
  // finishes) resumes from where the marker visually is, instead of
  // snapping back to wherever the *previous* tween started. Mirrors
  // `pointRef`/`setPointBoth` in useAnimatedBlochPoint.ts.
  const posRef = useRef({ x: targetX, y: targetY });
  const rafRef = useRef<number | null>(null);
  const isFirstRender = useRef(true);

  const setMarkerPosBoth = useCallback((next: { x: number; y: number }) => {
    posRef.current = next;
    setMarkerPos(next);
  }, []);

  // Kept as a separate callback (rather than inline in the effect below) so
  // the reduced-motion snap's setState call isn't lexically inside the
  // effect body, the same shape as `animateAlong` in useAnimatedBlochPoint.ts.
  const runTween = useCallback(
    (to: { x: number; y: number }) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      const from = posRef.current;

      if (prefersReducedMotion) {
        setMarkerPosBoth(to);
        return;
      }

      const start = performance.now();
      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / MARKER_TWEEN_MS);
        const eased = easeInOutCubic(t);
        setMarkerPosBoth({ x: from.x + (to.x - from.x) * eased, y: from.y + (to.y - from.y) * eased });
        if (t < 1) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          rafRef.current = null;
        }
      };
      rafRef.current = requestAnimationFrame(frame);
    },
    [prefersReducedMotion, setMarkerPosBoth]
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      posRef.current = { x: targetX, y: targetY };
      return;
    }

    runTween({ x: targetX, y: targetY });

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [targetX, targetY, runTween]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={label}>
      {/* `--axis` for the frame, `--axis-grid` for the ruling: the two lines a
          decay curve is read against are load-bearing marks, not panel chrome,
          and `--border` (1.41:1) is authored for chrome. See the matching note
          in rabi-explorer/PopulationCurve.tsx. */}
      <line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={HEIGHT - PAD_BOTTOM} className="stroke-axis" strokeWidth={1} />
      <line x1={PAD_LEFT} y1={HEIGHT - PAD_BOTTOM} x2={WIDTH} y2={HEIGHT - PAD_BOTTOM} className="stroke-axis" strokeWidth={1} />
      {[0, 0.5, 1].map((v) => (
        <g key={v}>
          <line x1={PAD_LEFT - 3} y1={yOf(v)} x2={WIDTH} y2={yOf(v)} className="stroke-axis-grid" strokeWidth={1} strokeDasharray="2 3" />
          <text x={PAD_LEFT - 6} y={yOf(v) + 8} textAnchor="end" className="fill-muted-foreground text-[22px] font-mono">
            {v}
          </text>
        </g>
      ))}
      <path d={path} fill="none" className="stroke-pillar" strokeWidth={2} />
      <line x1={markerPos.x} y1={PAD_TOP} x2={markerPos.x} y2={HEIGHT - PAD_BOTTOM} className="stroke-accent" strokeWidth={1.5} strokeDasharray="3 2" />
      <circle cx={markerPos.x} cy={markerPos.y} r={4} className="fill-accent" />
      <text x={WIDTH - 4} y={HEIGHT - 6} textAnchor="end" className="fill-muted-foreground text-[22px] font-mono">
        step {maxStep}
      </text>
    </svg>
  );
}
