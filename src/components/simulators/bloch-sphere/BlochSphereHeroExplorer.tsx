"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { StateVector } from "@/lib/quantum/state";
import { applySingleQubitGate, rotationAboutAxis } from "@/lib/quantum/gates";
import { measure } from "@/lib/quantum/measurement";
import { stateToBlochVector, type BlochVector } from "@/lib/quantum/bloch";
import { BlochSphereCanvas } from "./BlochSphereCanvas";
import { FIXED_GATES, type FixedGateDefinition, type FixedGateId } from "./gateDefinitions";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const ANIMATION_MS = 550;
const HERO_GATE_IDS: readonly FixedGateId[] = ["H", "X", "Z"];
const HERO_GATES = FIXED_GATES.filter((gate) => HERO_GATE_IDS.includes(gate.id));

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

/** An arbitrary unit vector perpendicular to `v` — used only for the antipodal slerp case
 * below, where any one meridian is as good as any other. */
function arbitraryPerpendicular(v: BlochVector): BlochVector {
  const reference = Math.abs(v.z) < 0.9 ? { x: 0, y: 0, z: 1 } : { x: 1, y: 0, z: 0 };
  const cx = v.y * reference.z - v.z * reference.y;
  const cy = v.z * reference.x - v.x * reference.z;
  const cz = v.x * reference.y - v.y * reference.x;
  const norm = Math.hypot(cx, cy, cz) || 1;
  return { x: cx / norm, y: cy / norm, z: cz / norm };
}

/** The rotation axis for the degenerate (near-π) slerp branch below. Prefers `cross(a, b)`
 * — the true meridian axis, which stays numerically meaningful far below the `sinTheta < 1e-6`
 * cutoff that gates this branch — and only falls back to the direction-agnostic
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

/** Rotates unit vector `v` by `angle` about a perpendicular `axis` (Rodrigues' formula with
 * the axis·v term dropped, since it's zero when axis ⟂ v). */
function rotateAboutPerpendicularAxis(v: BlochVector, axis: BlochVector, angle: number): BlochVector {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const crossX = axis.y * v.z - axis.z * v.y;
  const crossY = axis.z * v.x - axis.x * v.z;
  const crossZ = axis.x * v.y - axis.y * v.x;
  return { x: v.x * cos + crossX * sin, y: v.y * cos + crossY * sin, z: v.z * cos + crossZ * sin };
}

function slerp(a: BlochVector, b: BlochVector, t: number): BlochVector {
  const dot = Math.min(1, Math.max(-1, a.x * b.x + a.y * b.y + a.z * b.z));
  const theta = Math.acos(dot);
  const sinTheta = Math.sin(theta);

  if (sinTheta < 1e-6) {
    if (dot < 0) {
      // Antipodal (e.g. Reset from |1⟩ back to |0⟩): the great-circle direction is undefined,
      // and the naive lerp-then-normalize below divides by a norm that passes through exactly
      // zero at t=0.5 — the vector visibly collapses to the sphere's center instead of
      // sweeping along a meridian. Rotate about the (near-)meridian axis instead.
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

/**
 * A compact, genuinely interactive Bloch sphere for the homepage hero: real
 * quantum state (src/lib/quantum), the same 3D-projected canvas as the full
 * BlochSphereExplorer, and a small set of gate/measure/reset controls. This
 * is a deliberately trimmed-down sibling of BlochSphereExplorer (drops
 * presets, angle sliders, and the state readout panel) so it fits a hero
 * layout — not a decorative substitute for it.
 */
export function BlochSphereHeroExplorer() {
  const [state, setState] = useState(() => StateVector.zero(1));
  const [renderPoint, setRenderPoint] = useState<BlochVector>({ x: 0, y: 0, z: 1 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [narration, setNarration] = useState(
    "This is a real qubit state — |0⟩. Apply H and watch it enter superposition."
  );
  const [lastMeasurement, setLastMeasurement] = useState<0 | 1 | null>(null);

  const rafRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const runAnimation = useCallback(
    (pointAtT: (t: number) => BlochVector, onComplete: () => void) => {
      if (prefersReducedMotion) {
        onComplete();
        return;
      }

      setIsAnimating(true);
      const start = performance.now();

      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / ANIMATION_MS);
        setRenderPoint(pointAtT(easeInOutCubic(t)));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          setIsAnimating(false);
          onComplete();
        }
      };

      rafRef.current = requestAnimationFrame(frame);
    },
    [prefersReducedMotion]
  );

  const settleAt = useCallback((nextState: StateVector, point: BlochVector) => {
    setState(nextState);
    setRenderPoint(point);
  }, []);

  const applyGate = useCallback(
    (gate: FixedGateDefinition) => {
      if (isAnimating) return;
      const startState = state;
      const nextState = applySingleQubitGate(startState, gate.matrix, 0);
      const endPoint = stateToBlochVector(nextState);

      setLastMeasurement(null);
      setNarration(`Applied the ${gate.label} gate. ${gate.explanation}`);

      runAnimation(
        (t) => stateToBlochVector(startState.applyMatrix(rotationAboutAxis(gate.axis, gate.angle * t))),
        () => settleAt(nextState, endPoint)
      );
    },
    [isAnimating, state, runAnimation, settleAt]
  );

  const applyMeasurement = useCallback(() => {
    if (isAnimating) return;
    const { outcome, collapsed } = measure(state);
    const endPoint = stateToBlochVector(collapsed);
    const outcomeIndex = outcome.index as 0 | 1;

    setLastMeasurement(outcomeIndex);
    setNarration(
      `Measured |${outcomeIndex}⟩ (random, weighted by probability) — the superposition has collapsed.`
    );

    runAnimation(
      (t) => slerp(renderPoint, endPoint, t),
      () => settleAt(collapsed, endPoint)
    );
  }, [isAnimating, state, renderPoint, runAnimation, settleAt]);

  const reset = useCallback(() => {
    if (isAnimating) return;
    const zero = StateVector.zero(1);
    const startPoint = renderPoint;
    const endPoint = stateToBlochVector(zero);

    setLastMeasurement(null);
    setNarration("Reset to |0⟩.");

    runAnimation(
      (t) => slerp(startPoint, endPoint, t),
      () => settleAt(zero, endPoint)
    );
  }, [isAnimating, renderPoint, runAnimation, settleAt]);

  const controlButtonClasses =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-border bg-surface px-3 text-sm font-semibold text-foreground transition-colors hover:border-pillar/40 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar disabled:pointer-events-none disabled:opacity-50";

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 -z-10 rounded-full opacity-35 blur-2xl"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--pillar-accent) 35%, transparent), transparent 70%)",
        }}
      />

      <div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <BlochSphereCanvas blochPoint={renderPoint} className="mx-auto h-auto w-full max-w-xs" />

        <p aria-live="polite" className="mt-4 min-h-[2.5rem] text-center text-xs text-muted-foreground">
          {narration}
          {lastMeasurement !== null ? (
            <span className="ml-1 font-mono text-pillar">→ |{lastMeasurement}⟩</span>
          ) : null}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {HERO_GATES.map((gate) => (
            <button
              key={gate.id}
              type="button"
              disabled={isAnimating}
              onClick={() => applyGate(gate)}
              title={gate.explanation}
              className={controlButtonClasses}
            >
              {gate.label}
            </button>
          ))}
          <button type="button" disabled={isAnimating} onClick={applyMeasurement} className={controlButtonClasses}>
            Measure
          </button>
          <button type="button" disabled={isAnimating} onClick={reset} className={controlButtonClasses}>
            Reset
          </button>
        </div>

        <Link
          href="/simulators"
          className={cn(
            "mt-6 flex items-center justify-between gap-3 border-t border-border pt-4 transition-colors hover:border-pillar/40"
          )}
        >
          <div>
            <p className="text-sm font-medium text-foreground">Bloch sphere</p>
            <p className="text-xs text-muted-foreground">Drag to rotate the view</p>
          </div>
          <Badge tone="brand">Full explorer →</Badge>
        </Link>
      </div>
    </div>
  );
}
