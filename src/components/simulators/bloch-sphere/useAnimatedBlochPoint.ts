"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BlochVector } from "@/lib/quantum/bloch";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/** Default duration for ordinary unitary (gate / rotation / preset) transitions. */
export const GATE_ROTATION_MS = 550;
/** Measurement collapse is a discontinuous physical event, not a rotation, so animate it much faster
 * so it reads as a snap rather than a graceful sweep. */
export const COLLAPSE_MS = 150;

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

/** An arbitrary unit vector perpendicular to `v` (there's a whole circle of choices when `v`
 * is a pole of that choice; any one works, since the caller only needs *some* meridian). */
function arbitraryPerpendicular(v: BlochVector): BlochVector {
  const reference = Math.abs(v.z) < 0.9 ? { x: 0, y: 0, z: 1 } : { x: 1, y: 0, z: 0 };
  const cx = v.y * reference.z - v.z * reference.y;
  const cy = v.z * reference.x - v.x * reference.z;
  const cz = v.x * reference.y - v.y * reference.x;
  const norm = Math.hypot(cx, cy, cz) || 1;
  return { x: cx / norm, y: cy / norm, z: cz / norm };
}

/** The rotation axis for the degenerate (near-π) slerp branch below. Prefers `cross(a, b)`
 * (the true meridian axis, which stays numerically meaningful far below the `sinTheta < 1e-6`
 * cutoff that gates this branch) and only falls back to the direction-agnostic
 * `arbitraryPerpendicular(a)` once that cross product has itself collapsed to noise (`a` and
 * `b` are bit-for-bit antipodal, or close enough that no meridian is distinguishable). Without
 * this, a vector approaching antipodal along a fixed azimuth would track that azimuth right up
 * to the branch cutoff and then visibly snap to the unrelated arbitrary axis. */
function degenerateSlerpAxis(a: BlochVector, b: BlochVector): BlochVector {
  const cx = a.y * b.z - a.z * b.y;
  const cy = a.z * b.x - a.x * b.z;
  const cz = a.x * b.y - a.y * b.x;
  const norm = Math.hypot(cx, cy, cz);
  if (norm > 1e-9) return { x: cx / norm, y: cy / norm, z: cz / norm };
  return arbitraryPerpendicular(a);
}

/** Rotates unit vector `v` by `angle` about `axis`, assuming `axis` is perpendicular to `v`
 * (Rodrigues' rotation formula with the axis·v term dropped, since it's zero). */
function rotateAboutPerpendicularAxis(v: BlochVector, axis: BlochVector, angle: number): BlochVector {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const crossX = axis.y * v.z - axis.z * v.y;
  const crossY = axis.z * v.x - axis.x * v.z;
  const crossZ = axis.x * v.y - axis.y * v.x;
  return { x: v.x * cos + crossX * sin, y: v.y * cos + crossY * sin, z: v.z * cos + crossZ * sin };
}

/** Below this length a Bloch vector has no meaningful direction left to interpolate. */
const NEGLIGIBLE_RADIUS = 1e-9;

/** `v` rescaled from its current `length` (already computed by the caller) to `radius`. */
function withRadius(v: BlochVector, length: number, radius: number): BlochVector {
  const k = radius / length;
  return { x: v.x * k, y: v.y * k, z: v.z * k };
}

/**
 * Spherical-linear interpolation between two Bloch vectors: the *direction*
 * sweeps along the great-circle arc, and the *length* interpolates linearly
 * between the two endpoints' lengths.
 *
 * Splitting the two is not decoration. A Bloch vector is a unit vector only
 * for a pure state; the Noise Explorer and the Density Matrix Explorer both
 * animate a genuinely mixed state, whose length |r| < 1 is the entire
 * reading (how far in from the surface the state has sunk is how much of it
 * has been lost). `slerpUnitDirection` below reads a·b as cos of the angle
 * between them, which is only true for unit vectors; fed short vectors it
 * over-reports that angle, and its weights sin((1-t)θ)/sinθ and sin(tθ)/sinθ
 * then sum to more than 1. Measured on the Noise Explorer's own opening
 * configuration (|+⟩, dephasing, λ = 0.15), stepping from |r| = 0.377 to
 * |r| = 0.321 swept the drawn arrow out to |r| = 0.468 mid-tween: 24% longer
 * than where it started, in the one instrument whose whole subject is that
 * arrow getting shorter. `lib/quantum/__tests__/physicalInvariants.test.ts`
 * already forbids a noise channel from lengthening the Bloch vector, so the
 * animation was drawing something the engine is not allowed to compute.
 *
 * For unit inputs (every caller in BlochSphereExplorer, where the state is
 * always pure) the radius is 1 at both ends and this is exactly the previous
 * behaviour.
 */
export function slerpBlochVector(a: BlochVector, b: BlochVector, t: number): BlochVector {
  const lengthA = Math.hypot(a.x, a.y, a.z);
  const lengthB = Math.hypot(b.x, b.y, b.z);
  const radius = lengthA + (lengthB - lengthA) * t;

  // A vector at the sphere's centre has no direction, so follow whichever
  // endpoint still has one; if neither does, the whole path is the centre.
  if (lengthA < NEGLIGIBLE_RADIUS) {
    return lengthB < NEGLIGIBLE_RADIUS ? { x: 0, y: 0, z: 0 } : withRadius(b, lengthB, radius);
  }
  if (lengthB < NEGLIGIBLE_RADIUS) return withRadius(a, lengthA, radius);

  const direction = slerpUnitDirection(withRadius(a, lengthA, 1), withRadius(b, lengthB, 1), t);
  return withRadius(direction, 1, radius);
}

/** The great-circle sweep itself, for two UNIT vectors; see `slerpBlochVector` for why the length is handled separately. */
function slerpUnitDirection(a: BlochVector, b: BlochVector, t: number): BlochVector {
  const dot = Math.min(1, Math.max(-1, a.x * b.x + a.y * b.y + a.z * b.z));
  const theta = Math.acos(dot);
  const sinTheta = Math.sin(theta);

  if (sinTheta < 1e-6) {
    if (dot < 0) {
      // Antipodal (e.g. |0⟩ <-> |1⟩ via Reset or a preset click): the great-circle direction
      // is undefined, and the naive lerp-then-normalize below divides by a norm that passes
      // through exactly zero at t=0.5, so the vector visibly collapses to the sphere's center
      // (a maximally-mixed point that's never physically true for a pure state) instead of
      // sweeping along a meridian. Rotate about the (near-)meridian axis instead, which
      // stays at unit radius the whole way and still lands exactly on `b` at t=1.
      return rotateAboutPerpendicularAxis(a, degenerateSlerpAxis(a, b), Math.PI * t);
    }
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
