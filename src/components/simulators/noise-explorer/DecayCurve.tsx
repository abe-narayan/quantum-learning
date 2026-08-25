"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/simulators/bloch-sphere/usePrefersReducedMotion";
import { easeInOutCubic } from "@/components/simulators/bloch-sphere/useAnimatedBlochPoint";

const WIDTH = 520;
const HEIGHT = 160;
const PAD_LEFT = 32;
const PAD_BOTTOM = 20;
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
  const prevPosRef = useRef({ x: targetX, y: targetY });
  const rafRef = useRef<number | null>(null);
  const isFirstRender = useRef(true);

  // Kept as a separate callback (rather than inline in the effect below) so
  // the reduced-motion snap's setState call isn't lexically inside the
  // effect body — same shape as `animateAlong` in useAnimatedBlochPoint.ts.
  const runTween = useCallback(
    (from: { x: number; y: number }, to: { x: number; y: number }) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (prefersReducedMotion) {
        setMarkerPos(to);
        prevPosRef.current = to;
        return;
      }

      const start = performance.now();
      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / MARKER_TWEEN_MS);
        const eased = easeInOutCubic(t);
        setMarkerPos({ x: from.x + (to.x - from.x) * eased, y: from.y + (to.y - from.y) * eased });
        if (t < 1) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          rafRef.current = null;
          prevPosRef.current = to;
        }
      };
      rafRef.current = requestAnimationFrame(frame);
    },
    [prefersReducedMotion]
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPosRef.current = { x: targetX, y: targetY };
      return;
    }

    runTween(prevPosRef.current, { x: targetX, y: targetY });

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
      <line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={HEIGHT - PAD_BOTTOM} className="stroke-border" strokeWidth={1} />
      <line x1={PAD_LEFT} y1={HEIGHT - PAD_BOTTOM} x2={WIDTH} y2={HEIGHT - PAD_BOTTOM} className="stroke-border" strokeWidth={1} />
      {[0, 0.5, 1].map((v) => (
        <g key={v}>
          <line x1={PAD_LEFT - 3} y1={yOf(v)} x2={WIDTH} y2={yOf(v)} className="stroke-border/40" strokeWidth={1} strokeDasharray="2 3" />
          <text x={2} y={yOf(v) + 3} className="fill-muted-foreground text-[9px] font-mono">
            {v}
          </text>
        </g>
      ))}
      <path d={path} fill="none" className="stroke-brand" strokeWidth={2} />
      <line x1={markerPos.x} y1={PAD_TOP} x2={markerPos.x} y2={HEIGHT - PAD_BOTTOM} className="stroke-accent" strokeWidth={1.5} strokeDasharray="3 2" />
      <circle cx={markerPos.x} cy={markerPos.y} r={4} className="fill-accent" />
      <text x={WIDTH - 4} y={HEIGHT - 4} textAnchor="end" className="fill-muted-foreground text-[9px] font-mono">
        step {maxStep}
      </text>
    </svg>
  );
}
