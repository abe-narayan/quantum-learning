"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BlochVector } from "@/lib/quantum/bloch";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/** Default duration for ordinary unitary (gate / rotation / preset) transitions. */
export const GATE_ROTATION_MS = 550;
/** Measurement collapse is a discontinuous physical event, not a rotation — animate it much faster
 * so it reads as a snap rather than a graceful sweep. */
export const COLLAPSE_MS = 150;

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

/** Spherical-linear interpolation between two Bloch vectors along the great-circle arc. */
export function slerpBlochVector(a: BlochVector, b: BlochVector, t: number): BlochVector {
  const dot = Math.min(1, Math.max(-1, a.x * b.x + a.y * b.y + a.z * b.z));
  const theta = Math.acos(dot);
  const sinTheta = Math.sin(theta);

  if (sinTheta < 1e-6) {
    const lerped = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t };
    const norm = Math.hypot(lerped.x, lerped.y, lerped.z) || 1;
    return { x: lerped.x / norm, y: lerped.y / norm, z: lerped.z / norm };
  }

  const wa = Math.sin((1 - t) * theta) / sinTheta;
  const wb = Math.sin(t * theta) / sinTheta;
  return { x: wa * a.x + wb * b.x, y: wa * a.y + wb * b.y, z: wa * a.z + wb * b.z };
}

export type BlochPointAtT = (t: number) => BlochVector;

export interface UseAnimatedBlochPointResult {
  /** The currently-animating (interpolated) point. Equals the target once settled. */
  point: BlochVector;
  isAnimating: boolean;
  /** Animate along a caller-supplied path, given an already-eased t in [0, 1]. */
  animateAlong: (pointAtT: BlochPointAtT, durationMs: number, onComplete?: () => void) => void;
  /** Slerp from the current point to `target` over `durationMs` along the great-circle arc. */
  animateTo: (target: BlochVector, durationMs?: number, onComplete?: () => void) => void;
  /** Jump straight to `target`, cancelling any in-flight animation. */
  snapTo: (target: BlochVector) => void;
}

/**
 * The single shared implementation of the Bloch-sphere animation pattern used across this
 * codebase's simulators: an eased requestAnimationFrame loop that interpolates a Bloch vector,
 * short-circuiting straight to the target when the user prefers reduced motion.
 */
export function useAnimatedBlochPoint(initial: BlochVector): UseAnimatedBlochPointResult {
  const [point, setPoint] = useState<BlochVector>(initial);
  const [isAnimating, setIsAnimating] = useState(false);
  const pointRef = useRef(point);
  const rafRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const setPointBoth = useCallback((next: BlochVector) => {
    pointRef.current = next;
    setPoint(next);
  }, []);

  const animateAlong = useCallback(
    (pointAtT: BlochPointAtT, durationMs: number, onComplete?: () => void) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (prefersReducedMotion) {
        setPointBoth(pointAtT(1));
        setIsAnimating(false);
        onComplete?.();
        return;
      }

      setIsAnimating(true);
      const start = performance.now();

      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        setPointBoth(pointAtT(easeInOutCubic(t)));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          rafRef.current = null;
          setIsAnimating(false);
          onComplete?.();
        }
      };

      rafRef.current = requestAnimationFrame(frame);
    },
    [prefersReducedMotion, setPointBoth]
  );

  const animateTo = useCallback(
    (target: BlochVector, durationMs: number = GATE_ROTATION_MS, onComplete?: () => void) => {
      const start = pointRef.current;
      animateAlong((t) => slerpBlochVector(start, target, t), durationMs, onComplete);
    },
    [animateAlong]
  );

  const snapTo = useCallback(
    (target: BlochVector) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setIsAnimating(false);
      setPointBoth(target);
    },
    [setPointBoth]
  );

  return { point, isAnimating, animateAlong, animateTo, snapTo };
}

/**
 * Reactive convenience wrapper around {@link useAnimatedBlochPoint}: animates to `target`
 * automatically whenever it changes (preset click, slider change, step change, ...), instead of
 * requiring the caller to invoke `animateTo` imperatively. The first render settles instantly.
 */
export function useAnimatedBlochTarget(
  target: BlochVector,
  durationMs: number = GATE_ROTATION_MS
): { point: BlochVector; isAnimating: boolean } {
  const { point, isAnimating, animateTo, snapTo } = useAnimatedBlochPoint(target);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      snapTo(target);
      return;
    }
    animateTo(target, durationMs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.x, target.y, target.z, durationMs]);

  return { point, isAnimating };
}
