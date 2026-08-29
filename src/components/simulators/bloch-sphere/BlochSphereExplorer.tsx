"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Readouts } from "@/components/ui/Typography";
import { StateVector } from "@/lib/quantum/state";
import { applySingleQubitGate, rotationAboutAxis, rotationX, rotationY, rotationZ, type Axis3 } from "@/lib/quantum/gates";
import { measure } from "@/lib/quantum/measurement";
import { stateToBlochVector, stateToBlochAngles, blochStateFromAngles, type BlochAngles } from "@/lib/quantum/bloch";
import { BlochSphereCanvas } from "./BlochSphereCanvas";
import { BlochSphereControls } from "./BlochSphereControls";
import { BlochSphereStatePanel } from "./BlochSphereStatePanel";
import { STATE_PRESETS } from "./presets";
import { SimulatorInstrument } from "../shared/SimulatorInstrument";
import { SimulatorFraming } from "../shared/Framing";
import type { FixedGateDefinition, RotationAxisId } from "./gateDefinitions";
import { useAnimatedBlochPoint, GATE_ROTATION_MS, COLLAPSE_MS } from "./useAnimatedBlochPoint";

const COLLAPSE_FLASH_MS = 400;
const URL_SYNC_DEBOUNCE_MS = 400;
const COPY_CONFIRMATION_MS = 1500;
const TWO_PI = 2 * Math.PI;

// Minimal shareable state for this simulator is the pair of Bloch angles —
// they fully determine the point on the sphere (global phase is invisible
// on the sphere and doesn't affect anything rendered here).
function clampTheta(value: number): number {
  return Math.min(Math.PI, Math.max(0, value));
}

function normalizePhi(phi: number): number {
  const wrapped = phi % TWO_PI;
  return wrapped < 0 ? wrapped + TWO_PI : wrapped;
}

function phiDelta(a: number, b: number): number {
  const d = Math.abs(normalizePhi(a) - normalizePhi(b));
  return Math.min(d, TWO_PI - d);
}

/** Reads and validates `?theta=&phi=` from the URL. Never throws — returns null on anything malformed or absent. */
function parseAnglesFromParams(params: { get(key: string): string | null }): BlochAngles | null {
  const rawTheta = params.get("theta");
  const rawPhi = params.get("phi");
  if (rawTheta === null || rawPhi === null) return null;
  const theta = Number(rawTheta);
  const phi = Number(rawPhi);
  if (!Number.isFinite(theta) || !Number.isFinite(phi)) return null;
  return { theta: clampTheta(theta), phi: normalizePhi(phi) };
}

function matchPresetId(angles: BlochAngles, epsilon = 1e-2): string | null {
  const match = STATE_PRESETS.find(
    (preset) => Math.abs(preset.angles.theta - angles.theta) < epsilon && phiDelta(preset.angles.phi, angles.phi) < epsilon
  );
  return match?.id ?? null;
}

export function BlochSphereExplorer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Parsed once for the initial-state lazy initializers below; this is a cheap pure
  // computation, and only the very first render's value is actually used.
  const initialAngles = parseAnglesFromParams(searchParams);

  const [state, setState] = useState(() => (initialAngles ? blochStateFromAngles(initialAngles) : StateVector.zero(1)));
  const { point: renderPoint, isAnimating, animateAlong, animateTo, snapTo } = useAnimatedBlochPoint(
    initialAngles ? stateToBlochVector(blochStateFromAngles(initialAngles)) : { x: 0, y: 0, z: 1 }
  );
  const [activePresetId, setActivePresetId] = useState<string | null>(() =>
    initialAngles ? matchPresetId(initialAngles) : "0"
  );
  const [narration, setNarration] = useState<string>(() =>
    initialAngles ? "Restored the shared state from your link." : "Prepared |0⟩ — the north pole of the Bloch sphere."
  );
  const [lastMeasurement, setLastMeasurement] = useState<0 | 1 | null>(null);
  const [collapseFlash, setCollapseFlash] = useState(false);
  const [copied, setCopied] = useState(false);

  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const urlSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstUrlSync = useRef(true);

  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current !== null) clearTimeout(flashTimeoutRef.current);
      if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
      if (urlSyncTimeoutRef.current !== null) clearTimeout(urlSyncTimeoutRef.current);
    };
  }, []);

  const applyGate = useCallback(
    (gate: FixedGateDefinition) => {
      if (isAnimating) return;
      const startState = state;
      const nextState = applySingleQubitGate(startState, gate.matrix, 0);

      setActivePresetId(null);
      setLastMeasurement(null);
      setNarration(`Applied the ${gate.label} gate. ${gate.explanation}`);

      animateAlong(
        (t) => stateToBlochVector(startState.applyMatrix(rotationAboutAxis(gate.axis, gate.angle * t))),
        GATE_ROTATION_MS,
        () => setState(nextState)
      );
    },
    [isAnimating, state, animateAlong]
  );

  const applyRotation = useCallback(
    (axisId: RotationAxisId, angleRadians: number) => {
      if (isAnimating) return;
      const axis: Axis3 =
        axisId === "Rx" ? { x: 1, y: 0, z: 0 } : axisId === "Ry" ? { x: 0, y: 1, z: 0 } : { x: 0, y: 0, z: 1 };
      const matrix = axisId === "Rx" ? rotationX(angleRadians) : axisId === "Ry" ? rotationY(angleRadians) : rotationZ(angleRadians);

      const startState = state;
      const nextState = applySingleQubitGate(startState, matrix, 0);
      const degrees = Math.round((angleRadians * 180) / Math.PI);

      setActivePresetId(null);
      setLastMeasurement(null);
      setNarration(`Applied ${axisId}(${degrees}°) — a ${degrees}° rotation about the ${axisId.slice(1)} axis.`);

      animateAlong(
        (t) => stateToBlochVector(startState.applyMatrix(rotationAboutAxis(axis, angleRadians * t))),
        GATE_ROTATION_MS,
        () => setState(nextState)
      );
    },
    [isAnimating, state, animateAlong]
  );

  const goTo = useCallback(
    (nextState: StateVector, presetId: string | null, message: string) => {
      if (isAnimating) return;
      const endPoint = stateToBlochVector(nextState);

      setActivePresetId(presetId);
      setLastMeasurement(null);
      setNarration(message);

      animateTo(endPoint, GATE_ROTATION_MS, () => setState(nextState));
    },
    [isAnimating, animateTo]
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
      setState(nextState);
      snapTo(stateToBlochVector(nextState));
    },
    [isAnimating, snapTo]
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

    // Collapse is a discontinuous physical event, not a unitary rotation — use a much faster
    // settle than gate/rotation animations so it reads as a snap, plus a brief flash at the pole.
    animateTo(endPoint, COLLAPSE_MS, () => {
      setState(collapsed);
      setCollapseFlash(true);
      if (flashTimeoutRef.current !== null) clearTimeout(flashTimeoutRef.current);
      flashTimeoutRef.current = setTimeout(() => setCollapseFlash(false), COLLAPSE_FLASH_MS);
    });
  }, [isAnimating, state, animateTo]);

  const reset = useCallback(() => {
    goTo(StateVector.zero(1), "0", "Reset to |0⟩.");
  }, [goTo]);

  const angles = stateToBlochAngles(state);
  const probabilities = state.probabilities() as [number, number];

  // Keep the URL in sync with the settled state so the page is always shareable.
  // Debounced so a slider drag (which updates `state` on every input event) doesn't
  // spam `history.replaceState` — only the value it settles on after a short pause
  // gets written. Skips the very first run so mounting doesn't immediately rewrite
  // the URL we just read from.
  useEffect(() => {
    if (isFirstUrlSync.current) {
      isFirstUrlSync.current = false;
      return;
    }
    if (urlSyncTimeoutRef.current !== null) clearTimeout(urlSyncTimeoutRef.current);
    urlSyncTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("theta", angles.theta.toFixed(3));
      params.set("phi", angles.phi.toFixed(3));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, URL_SYNC_DEBOUNCE_MS);
    return () => {
      if (urlSyncTimeoutRef.current !== null) clearTimeout(urlSyncTimeoutRef.current);
    };
    // Deliberately depends only on the angles: `router`/`pathname` are stable, and
    // reading the rest of the query string fresh from `window.location` (rather than
    // depending on the `searchParams` hook) avoids re-running this effect off of our
    // own `replace` calls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [angles.theta, angles.phi]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), COPY_CONFIRMATION_MS);
    } catch {
      // Clipboard access can be denied in some browser security contexts — no crash, no link copied.
    }
  }, []);

  return (
    <SimulatorInstrument
      label="Bloch sphere — single qubit"
      readout={
        <Readouts
          items={[
            { label: "P(0)", value: Math.round(probabilities[0] * 100), unit: "%" },
            { label: "P(1)", value: Math.round(probabilities[1] * 100), unit: "%" },
          ]}
        />
      }
      footnote="Drag the sphere, or focus it and use the arrow keys, to rotate the view — the vector&rsquo;s position is the quantum state itself."
      stage={
        <>
          <div className="mx-auto max-w-sm">
            <BlochSphereCanvas blochPoint={renderPoint} pulse={collapseFlash} className="mx-auto w-full" />
          </div>

          <div
            aria-live="polite"
            className="mt-4 rounded-panel border border-pillar-edge bg-pillar-wash px-4 py-3 text-sm text-foreground"
          >
            {narration}
            {lastMeasurement !== null ? (
              <span className="ml-1 font-mono text-pillar">→ |{lastMeasurement}⟩</span>
            ) : null}
          </div>

          <div className="mt-6">
            <BlochSphereStatePanel state={state} angles={angles} />
          </div>

          <SimulatorFraming
            shows="Every single-qubit state is a point on this sphere — gates are rotations of that point, and measurement is a random snap to a pole."
            watchFor="Rotations move the point smoothly; measurement is the only discontinuous jump you&rsquo;ll ever see on this sphere."
            tryThis={
              <ul>
                <li>
                  Apply H, then S, then H again — watch the state trace a path that never repeats a previous
                  point, then hit Measure and see it collapse anyway.
                </li>
                <li>
                  Drag θ and φ directly to the equator (θ=90°) and Measure ten times — notice the 50/50 split
                  even though nothing here is a coin flip.
                </li>
              </ul>
            }
          />
        </>
      }
      controls={
        <>
          <div className="flex justify-end">
            <Button size="sm" variant="secondary" onClick={handleCopyLink}>
              {copied ? "Copied!" : "Copy link"}
            </Button>
          </div>

          <div className="mt-4">
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
        </>
      }
    />
  );
}
