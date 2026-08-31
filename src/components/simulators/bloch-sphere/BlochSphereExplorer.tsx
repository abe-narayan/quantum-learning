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

// Minimal shareable state for this simulator is the pair of Bloch angles:
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

/** Reads and validates `?theta=&phi=` from the URL. Never throws; returns null on anything malformed or absent. */
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
  // The opening narration says what to do next, not only what is on screen.
  //
  // Every other instrument on this bench opens mid-phenomenon; this one
  // deliberately does not, and the reason is recorded in
  // `BlochSphereControls`: five lessons instruct the reader to start from
  // |0⟩, so the mount state stays there. The cost of that decision is that
  // first contact is the one point on the sphere where nothing this
  // instrument is about is visible: the arrow sits on the axis, the odds read
  // 100/0, φ moves nothing, and Measure returns 0 however many times it is
  // pressed. A reader who arrives, presses the most obvious button twice and
  // gets the same answer twice has learned that this is a picture of a
  // certainty, which is the opposite of the point.
  //
  // The φ slider's hint already explains the degeneracy, but it is a hint on
  // one control in a rail that sits ~1000px below the sphere at 375px. This
  // line is the first thing under the sphere at every width, so it is where
  // the way out belongs.
  const [narration, setNarration] = useState<string>(() =>
    initialAngles
      ? "Restored the shared state from your link."
      : "Prepared |0⟩, the north pole. Measuring from here gives 0 every time, which is the one thing a qubit shares with an ordinary bit. Press H, or pick |+⟩, to tilt it onto the equator, and measuring becomes a genuine coin flip."
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
      setNarration(`Applied ${axisId}(${degrees}°): a ${degrees}° rotation about the ${axisId.slice(1)} axis.`);

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
      `Measured |${outcomeIndex}⟩ (this was random, weighted by the probabilities). The superposition is gone: the state has collapsed to |${outcomeIndex}⟩.`
    );

    // Collapse is a discontinuous physical event, not a unitary rotation, so use a much faster
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
  // spam `history.replaceState`; only the value it settles on after a short pause
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
      // Clipboard access can be denied in some browser security contexts, so no crash and no link copied.
    }
  }, []);

  return (
    <SimulatorInstrument
      label="Bloch sphere: single qubit"
      readout={
        <Readouts
          items={[
            // This is the "No background needed" instrument, the one
            // /simulators sends a cold reader to first, so its two headline
            // numbers cannot be the one pair of symbols on the bench a reader
            // is expected to already parse. The notation is still taught,
            // three lines down in the state panel and all over the controls.
            { label: "Chance of 0", value: Math.round(probabilities[0] * 100), unit: "%" },
            { label: "Chance of 1", value: Math.round(probabilities[1] * 100), unit: "%" },
          ]}
        />
      }
      footnote="Drag the sphere, or focus it and use the arrow keys, to rotate the view. The vector&rsquo;s position is the quantum state itself."
      stage={
        <>
          {/* `max-w-[244px]` below 42rem, not the `max-w-sm` (384px) this
              instrument opened at unconditionally. This was the largest
              overage among the bench's two "best value" cases: at 375x812
              the sphere alone (343px wide, since the column beats max-w-sm)
              ran the first control 81px past the 716px first-screen budget.
              244px is close to, not equal to, the cap `RabiExplorer` already
              ships for this same `BlochSphereCanvas` on its own bench mount
              (260px): the axis names and pole kets are drawn at 15 viewBox
              units on a 400-unit viewBox, so effective type size is
              15 x width / 400, and RabiExplorer's own comment documents a
              ~9px floor those labels must clear. 244px clears it at 9.15px,
              with a little more headroom kept in hand than this instrument
              needed on its own (see the narration box below for where the
              rest of the 81px came from). `@min-[42rem]:max-w-sm` restores
              the original size once the container is wide enough to run the
              split layout, so desktop is untouched. */}
          <div className="mx-auto max-w-[244px] @min-[42rem]:max-w-sm">
            <BlochSphereCanvas blochPoint={renderPoint} pulse={collapseFlash} className="mx-auto w-full" />
          </div>

          {/* `mt-1`/`py-1` below 42rem, restored to `mt-4`/`py-3` above it,
              same reasoning as the sphere cap just above: a mobile-only
              tightening of chrome around content that does not change. */}
          <div
            aria-live="polite"
            className="mt-1 rounded-panel border border-pillar-edge bg-pillar-wash px-4 py-1 text-sm text-foreground @min-[42rem]:mt-4 @min-[42rem]:py-3"
          >
            {narration}
            {lastMeasurement !== null ? (
              <span className="ml-1 font-mono text-pillar">→ |{lastMeasurement}⟩</span>
            ) : null}
          </div>

        </>
      }
      stageAfter={
        <>
          <BlochSphereStatePanel state={state} angles={angles} />

          <SimulatorFraming
            shows="Every single-qubit state is a point on this sphere. Gates are rotations of that point, and measurement is a random snap to a pole."
            watchFor="Rotations move the point smoothly; measurement is the only discontinuous jump you&rsquo;ll ever see on this sphere."
            tryThis={
              <ul>
                <li>
                  Apply H, then S, then H again, and watch the state trace a path that never repeats a previous
                  point, then hit Measure and see it collapse anyway.
                </li>
                <li>
                  Drag θ and φ directly to the equator (θ=90°) and Measure ten times, and notice the 50/50 split
                  even though nothing here is a coin flip.
                </li>
              </ul>
            }
          />
        </>
      }
      controls={
        <>
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

          {/* Last, not first: see the note in GroverExplorer's controls. */}
          <div className="mt-6 flex justify-end">
            <Button size="sm" variant="secondary" onClick={handleCopyLink}>
              {copied ? "Copied!" : "Copy link"}
            </Button>
          </div>
        </>
      }
    />
  );
}
