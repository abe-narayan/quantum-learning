"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { StateVector } from "@/lib/quantum/state";
import { applySingleQubitGate, rotationAboutAxis, rotationX, rotationY, rotationZ, type Axis3 } from "@/lib/quantum/gates";
import { measure } from "@/lib/quantum/measurement";
import { stateToBlochVector, stateToBlochAngles, blochStateFromAngles, type BlochVector, type BlochAngles } from "@/lib/quantum/bloch";
import { BlochSphereCanvas } from "./BlochSphereCanvas";
import { BlochSphereControls } from "./BlochSphereControls";
import { BlochSphereStatePanel } from "./BlochSphereStatePanel";
import { STATE_PRESETS } from "./presets";
import type { FixedGateDefinition, RotationAxisId } from "./gateDefinitions";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const ANIMATION_MS = 550;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
}

function slerp(a: BlochVector, b: BlochVector, t: number): BlochVector {
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

export function BlochSphereExplorer() {
  const [state, setState] = useState(() => StateVector.zero(1));
  const [renderPoint, setRenderPoint] = useState<BlochVector>({ x: 0, y: 0, z: 1 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>("0");
  const [narration, setNarration] = useState<string>("Prepared |0⟩ — the north pole of the Bloch sphere.");
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

      setActivePresetId(null);
      setLastMeasurement(null);
      setNarration(`Applied the ${gate.label} gate. ${gate.explanation}`);

      runAnimation(
        (t) => stateToBlochVector(startState.applyMatrix(rotationAboutAxis(gate.axis, gate.angle * t))),
        () => settleAt(nextState, endPoint)
      );
    },
    [isAnimating, state, runAnimation, settleAt]
  );

  const applyRotation = useCallback(
    (axisId: RotationAxisId, angleRadians: number) => {
      if (isAnimating) return;
      const axis: Axis3 =
        axisId === "Rx" ? { x: 1, y: 0, z: 0 } : axisId === "Ry" ? { x: 0, y: 1, z: 0 } : { x: 0, y: 0, z: 1 };
      const matrix = axisId === "Rx" ? rotationX(angleRadians) : axisId === "Ry" ? rotationY(angleRadians) : rotationZ(angleRadians);

      const startState = state;
      const nextState = applySingleQubitGate(startState, matrix, 0);
      const endPoint = stateToBlochVector(nextState);
      const degrees = Math.round((angleRadians * 180) / Math.PI);

      setActivePresetId(null);
      setLastMeasurement(null);
      setNarration(`Applied ${axisId}(${degrees}°) — a ${degrees}° rotation about the ${axisId.slice(1)} axis.`);

      runAnimation(
        (t) => stateToBlochVector(startState.applyMatrix(rotationAboutAxis(axis, angleRadians * t))),
        () => settleAt(nextState, endPoint)
      );
    },
    [isAnimating, state, runAnimation, settleAt]
  );

  const goTo = useCallback(
    (nextState: StateVector, presetId: string | null, message: string) => {
      if (isAnimating) return;
      const startPoint = renderPoint;
      const endPoint = stateToBlochVector(nextState);

      setActivePresetId(presetId);
      setLastMeasurement(null);
      setNarration(message);

      runAnimation(
        (t) => slerp(startPoint, endPoint, t),
        () => settleAt(nextState, endPoint)
      );
    },
    [isAnimating, renderPoint, runAnimation, settleAt]
  );

  const applyPreset = useCallback(
    (presetId: string) => {
      const preset = STATE_PRESETS.find((p) => p.id === presetId);
      if (!preset) return;
      goTo(blochStateFromAngles(preset.angles), presetId, `Prepared ${preset.ket}.`);
    },
    [goTo]
  );

  const applyManualAngles = useCallback(
    (angles: BlochAngles) => {
      if (isAnimating) return;
      const nextState = blochStateFromAngles(angles);
      setActivePresetId(null);
      setLastMeasurement(null);
      setNarration("Dragging θ and φ moves the state directly to any point on the sphere.");
      settleAt(nextState, stateToBlochVector(nextState));
    },
    [isAnimating, settleAt]
  );

  const applyMeasurement = useCallback(() => {
    if (isAnimating) return;
    const { outcome, collapsed } = measure(state);
    const endPoint = stateToBlochVector(collapsed);
    const outcomeIndex = outcome.index as 0 | 1;

    setActivePresetId(null);
    setLastMeasurement(outcomeIndex);
    setNarration(
      `Measured |${outcomeIndex}⟩ (this was random, weighted by the probabilities). The superposition is gone — the state has collapsed to |${outcomeIndex}⟩.`
    );

    runAnimation(
      (t) => slerp(renderPoint, endPoint, t),
      () => settleAt(collapsed, endPoint)
    );
  }, [isAnimating, state, renderPoint, runAnimation, settleAt]);

  const reset = useCallback(() => {
    goTo(StateVector.zero(1), "0", "Reset to |0⟩.");
  }, [goTo]);

  const angles = stateToBlochAngles(state);
  const probabilities = state.probabilities() as [number, number];

  return (
    <div className="not-prose grid gap-6 rounded-3xl border border-border bg-surface p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
      <div>
        <div className="mx-auto max-w-sm">
          <BlochSphereCanvas blochPoint={renderPoint} className="mx-auto w-full" />
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Drag the sphere to rotate the view — the vector&rsquo;s position is the quantum state itself.
        </p>

        <div
          aria-live="polite"
          className="mt-4 rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground"
        >
          {narration}
          {lastMeasurement !== null ? (
            <span className="ml-1 font-mono text-brand">→ |{lastMeasurement}⟩</span>
          ) : null}
        </div>

        <div className="mt-6">
          <BlochSphereStatePanel state={state} angles={angles} />
        </div>
      </div>

      <BlochSphereControls
        angles={angles}
        probabilities={probabilities}
        disabled={isAnimating}
        activePresetId={activePresetId}
        onApplyPreset={applyPreset}
        onManualAngles={applyManualAngles}
        onApplyGate={applyGate}
        onApplyRotation={applyRotation}
        onMeasure={applyMeasurement}
        onReset={reset}
      />
    </div>
  );
}
