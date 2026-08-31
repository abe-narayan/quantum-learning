"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Readout } from "@/components/ui/Typography";
import { SimulatorInstrument } from "../shared/SimulatorInstrument";
import { SimulatorFraming } from "../shared/Framing";
import { Predict } from "../shared/Predict";
import { blochStateFromAngles, densityMatrixToBlochVector } from "@/lib/quantum/bloch";
import { pureStateDensityMatrix, purity, vonNeumannEntropy, validateDensityMatrix } from "@/lib/quantum/densityMatrix";
import { applyKrausChannel, amplitudeDampingChannel, dephasingChannel } from "@/lib/quantum/openSystems";
import { BlochSphereCanvas } from "@/components/simulators/bloch-sphere/BlochSphereCanvas";
import { useAnimatedBlochTarget } from "@/components/simulators/bloch-sphere/useAnimatedBlochPoint";
import { DensityMatrixStatePanel } from "@/components/simulators/density-matrix-explorer/DensityMatrixStatePanel";
import { STATE_PRESETS } from "@/components/simulators/bloch-sphere/presets";
import { DecayCurve } from "./DecayCurve";
import { NoiseControls, type ChannelType } from "./NoiseControls";

const MAX_STEPS = 40;
/**
 * Zero steps is an undisturbed pure state sitting exactly on the sphere. In
 * an instrument whose entire subject is decoherence, that's the one
 * configuration showing none of it. Opening part-way into the decay means the
 * Bloch vector is already visibly shrunk inside the sphere, and purity reads
 * something other than 1, the moment the instrument mounts. Reset still
 * returns to 0, which is the honest "before any noise" reference.
 */
const INITIAL_STEPS = 6;
const URL_SYNC_DEBOUNCE_MS = 400;
const COPY_CONFIRMATION_MS = 1500;
const STRENGTH_MIN = 0.01;
const STRENGTH_MAX = 0.5;

// Minimal shareable state is the starting preset, channel type, and strength;
// together they fully determine the trajectory computed below. The step scrub
// is playback state, not configuration, so it's deliberately excluded: a
// shared link reproduces the setup, not a paused mid-animation frame. Params
// are prefixed (`noise_`) because this simulator shares /simulators with
// other URL-stateful simulators.
function isPresetId(value: string): boolean {
  return STATE_PRESETS.some((preset) => preset.id === value);
}

function isChannelType(value: string): value is ChannelType {
  return value === "amplitude-damping" || value === "dephasing";
}

function clampStrength(value: number): number {
  return Math.min(STRENGTH_MAX, Math.max(STRENGTH_MIN, value));
}

/** Reads and validates `?noise_preset=&noise_channel=&noise_strength=`. Never throws; returns null on anything malformed or absent. */
function parseNoiseParams(
  params: { get(key: string): string | null }
): { presetId: string; channel: ChannelType; strength: number } | null {
  const rawPreset = params.get("noise_preset");
  const rawChannel = params.get("noise_channel");
  const rawStrength = params.get("noise_strength");
  if (rawPreset === null || rawChannel === null || rawStrength === null) return null;
  if (!isPresetId(rawPreset) || !isChannelType(rawChannel)) return null;
  const strength = Number(rawStrength);
  if (!Number.isFinite(strength)) return null;
  return { presetId: rawPreset, channel: rawChannel, strength: clampStrength(strength) };
}

/**
 * A single-qubit noise channel applied step by step, watching the Bloch
 * vector shrink from the sphere's surface toward each channel's fixed
 * point, reusing the platform's existing, tested Kraus-channel engine
 * (openSystems.ts) exactly as Advanced Quantum Mechanics' Open Quantum
 * Systems lesson and Quantum Hardware's T1/T2 lesson describe it, not a
 * separate or re-derived noise model.
 */
export function NoiseExplorer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const initialFromUrl = parseNoiseParams(searchParams);

  const [presetId, setPresetId] = useState(initialFromUrl?.presetId ?? "+");
  const [channel, setChannel] = useState<ChannelType>(initialFromUrl?.channel ?? "amplitude-damping");
  const [strength, setStrength] = useState(initialFromUrl?.strength ?? 0.15);
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [copied, setCopied] = useState(false);

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const urlSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstUrlSync = useRef(true);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
      if (urlSyncTimeoutRef.current !== null) clearTimeout(urlSyncTimeoutRef.current);
    };
  }, []);

  // Keep the URL in sync with the settled configuration so the page is always
  // shareable. Debounced so a slider drag doesn't spam `history.replaceState`;
  // only the value it settles on after a short pause gets written. Skips the
  // very first run so mounting doesn't immediately rewrite the URL we just read
  // from.
  useEffect(() => {
    if (isFirstUrlSync.current) {
      isFirstUrlSync.current = false;
      return;
    }
    if (urlSyncTimeoutRef.current !== null) clearTimeout(urlSyncTimeoutRef.current);
    urlSyncTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("noise_preset", presetId);
      params.set("noise_channel", channel);
      params.set("noise_strength", strength.toFixed(3));
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, URL_SYNC_DEBOUNCE_MS);
    return () => {
      if (urlSyncTimeoutRef.current !== null) clearTimeout(urlSyncTimeoutRef.current);
    };
    // Deliberately depends only on the shareable state: `router`/`pathname` are
    // stable, and reading the rest of the query string fresh from
    // `window.location` (rather than depending on the `searchParams` hook)
    // avoids re-running this effect off of our own `replace` calls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetId, channel, strength]);

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

  const startingPreset = useMemo(
    () => STATE_PRESETS.find((p) => p.id === presetId) ?? STATE_PRESETS[0],
    [presetId]
  );

  const trajectory = useMemo(() => {
    const rho0 = pureStateDensityMatrix(blochStateFromAngles(startingPreset.angles));
    const kraus = channel === "amplitude-damping" ? amplitudeDampingChannel(strength) : dephasingChannel(strength);
    const rhos = [rho0];
    let rho = rho0;
    for (let i = 0; i < MAX_STEPS; i++) {
      rho = applyKrausChannel(rho, kraus);
      rhos.push(rho);
    }
    return rhos;
  }, [startingPreset, channel, strength]);

  const clampedSteps = Math.min(steps, trajectory.length - 1);
  const rho = trajectory[clampedSteps];
  const targetBlochVector = useMemo(() => densityMatrixToBlochVector(rho), [rho]);
  const { point: blochVector } = useAnimatedBlochTarget(targetBlochVector);
  const purityValue = useMemo(() => purity(rho), [rho]);
  const entropyValue = useMemo(() => vonNeumannEntropy(rho), [rho]);
  const validation = useMemo(() => validateDensityMatrix(rho), [rho]);
  const purityTrajectory = useMemo(() => trajectory.map((r) => purity(r)), [trajectory]);

  // Config changes hold the current step count rather than rewinding to 0:
  // "six applications of this channel" stays a meaningful, comparable amount
  // of elapsed noise across every starting state, channel and strength, so
  // switching channels compares like with like instead of dropping the reader
  // back onto an undisturbed pure state after every click.
  function handlePresetChange(id: string) {
    setPresetId(id);
  }

  function handleChannelChange(next: ChannelType) {
    setChannel(next);
  }

  function handleStrengthChange(v: number) {
    setStrength(v);
  }

  /**
   * ---------------------------------------------------------------
   * Where this channel actually settles, for *this* starting state
   * ---------------------------------------------------------------
   * This block replaces a hardcoded `outcomeId="fixed-point"` that graded
   * the prediction wrong in the instrument's own default configuration.
   *
   * Amplitude damping has one fixed point, |0⟩, no matter where the state
   * started, so "north pole" is always the answer there. Dephasing does not:
   * it drives x and y to zero and leaves z exactly where it was, so its
   * resting place is (0, 0, z₀). Four of the six starting presets (|+⟩, |−⟩,
   * |+i⟩, |−i⟩, including |+⟩, the one the instrument opens on) sit on the
   * equator with z₀ = 0, and for those the vector really does end at the
   * centre of the sphere. The old code told a reader who answered "centre"
   * from |+⟩ that they were wrong.
   *
   * The two options are also chosen per starting state, not just graded
   * differently, because "in to the z-axis keeping its height" and "in to the
   * centre" are the *same* destination when z₀ = 0; offering both would make
   * one of two identical answers wrong.
   *
   * z₀ = cos(θ) is read off the preset's own Bloch angles (see
   * `blochStateFromAngles` in lib/quantum/bloch.ts), not measured off the
   * numerical trajectory: at the low end of the strength slider 40 steps is
   * nowhere near convergence, so the endpoint of the computed trajectory is
   * not the fixed point and cannot be used to identify it.
   */
  const startsOnEquator = Math.abs(Math.cos(startingPreset.angles.theta)) < 1e-9;
  const predictOptions =
    channel === "amplitude-damping"
      ? [
          { id: "fixed-point", label: "North pole (|0⟩)" },
          { id: "center", label: "Center of the sphere" },
        ]
      : startsOnEquator
        ? [
            { id: "center", label: "All the way in to the center" },
            { id: "fixed-point", label: "It stays out on the equator" },
          ]
        : [
            { id: "center", label: "All the way in to the center" },
            { id: "fixed-point", label: "In to the z-axis, keeping the height it started at" },
          ];
  const predictCorrectId =
    channel === "amplitude-damping" ? "fixed-point" : startsOnEquator ? "center" : "fixed-point";

  const narration =
    clampedSteps === 0
      ? "No decoherence yet: this is the starting pure state, sitting exactly on the sphere's surface."
      : channel === "amplitude-damping"
        ? purityValue > 0.995
          ? `After ${clampedSteps} applications, the state has nearly fully decayed to |0⟩, amplitude damping's fixed point, itself pure again.`
          : `After ${clampedSteps} applications: purity Tr(ρ²) = ${purityValue.toFixed(3)}. The Bloch vector is being pulled toward the north pole, |0⟩.`
        : purityValue < 0.505
          ? `After ${clampedSteps} applications, x and y have nearly vanished: only the population information (z) survives. This is dephasing's fixed behavior.`
          : `After ${clampedSteps} applications: purity Tr(ρ²) = ${purityValue.toFixed(3)}. Phase information (x, y) is randomizing away while z stays fixed.`;

  return (
    <SimulatorInstrument
      label="Noise channel: open-system decoherence"
      readout={<Readout label="Purity" hint="1 = a definite state" value={purityValue.toFixed(3)} />}
      footnote="Next: this is exactly the T1/T2 decay hardware engineers measure; see it framed that way in the Quantum Hardware lessons."
      stageClassName="space-y-6"
      stage={
        <>
          {/* Trimmed: "leaks information to its environment, step by step" is
              now said once, not twice, since `SimulatorFraming`'s "What this
              shows" below already says it in almost the same words. What
              stays is unique to reading this particular picture: what the
              arrow's depth inside the sphere means. */}
          <p className="text-sm text-muted-foreground">
            A qubit leaks information to its environment a little at a time; this runs that leakage step by
            step. The arrow is the qubit&rsquo;s state: on the surface means a definite quantum state, and
            the deeper inside, the more has been lost for good.
          </p>

          <div className="mx-auto max-w-sm">
            <BlochSphereCanvas blochPoint={blochVector} className="mx-auto w-full" />
          </div>

          {/* `role="status"` + `aria-atomic="true"`: a role-less live region's
              implicit `aria-atomic` is `false`, so an update announces only
              the text nodes that actually changed. This one swaps a whole
              sentence, so it was safe in practice but not by construction. */}
          <div role="status" aria-live="polite" aria-atomic="true" className="rounded-panel border border-pillar/25 bg-pillar/5 px-4 py-3 text-sm text-foreground">
            {narration}
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Purity Tr(ρ²) over successive applications</p>
            <DecayCurve samples={purityTrajectory} currentStep={clampedSteps} label="Purity over channel applications" />
          </div>

        </>
      }
      stageAfter={
        <>
          <DensityMatrixStatePanel rho={rho} purityValue={purityValue} entropyValue={entropyValue} validation={validation} />

          <Predict
            key={`${presetId}-${channel}`}
            question="Keep stepping this channel forward. Where does the Bloch vector eventually settle?"
            options={predictOptions}
            // Resolved only once the reader has scrubbed to the end of the
            // trajectory. The question is about the limit, not the current
            // frame, so it must not answer itself the moment the panel appears.
            outcomeId={clampedSteps >= MAX_STEPS ? predictCorrectId : null}
          />

          <SimulatorFraming
            shows="Real qubits leak information to their environment. This applies an actual Kraus-operator noise channel step by step so you can watch a pure state decay toward the channel&rsquo;s fixed point."
            watchFor="Purity is the one number to keep an eye on: 1 means the qubit still holds a definite quantum state, 0.5 means it has decayed to a coin flip and the quantum information is gone. Amplitude damping ends back at purity 1 (at |0⟩); dephasing does not."
            tryThis={
              <ul>
                <li>
                  Start from |+⟩, choose Amplitude Damping, and step forward until purity nearly hits 1 again
                  at |0⟩. Then reset, pick Dephasing instead, and compare where the Bloch vector ends up.
                </li>
                <li>
                  Compare a low strength (0.05) against a high one (0.5): same number of steps, very
                  different decay speed.
                </li>
              </ul>
            }
          />
        </>
      }
      controls={
        <>
          <NoiseControls
            presetId={presetId}
            onPresetChange={handlePresetChange}
            channel={channel}
            onChannelChange={handleChannelChange}
            strength={strength}
            onStrengthChange={handleStrengthChange}
            steps={clampedSteps}
            maxSteps={MAX_STEPS}
            onStepsChange={setSteps}
            onReset={() => setSteps(0)}
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
