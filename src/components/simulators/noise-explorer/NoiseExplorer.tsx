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
const URL_SYNC_DEBOUNCE_MS = 400;
const COPY_CONFIRMATION_MS = 1500;
const STRENGTH_MIN = 0.01;
const STRENGTH_MAX = 0.5;

// Minimal shareable state is the starting preset, channel type, and strength —
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

/** Reads and validates `?noise_preset=&noise_channel=&noise_strength=`. Never throws — returns null on anything malformed or absent. */
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
 * point — reusing the platform's existing, tested Kraus-channel engine
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
  const [steps, setSteps] = useState(0);
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
  // shareable. Debounced so a slider drag doesn't spam `history.replaceState` —
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
      // Clipboard access can be denied in some browser security contexts — no crash, no link copied.
    }
  }, []);

  const trajectory = useMemo(() => {
    const preset = STATE_PRESETS.find((p) => p.id === presetId) ?? STATE_PRESETS[0];
    const rho0 = pureStateDensityMatrix(blochStateFromAngles(preset.angles));
    const kraus = channel === "amplitude-damping" ? amplitudeDampingChannel(strength) : dephasingChannel(strength);
    const rhos = [rho0];
    let rho = rho0;
    for (let i = 0; i < MAX_STEPS; i++) {
      rho = applyKrausChannel(rho, kraus);
      rhos.push(rho);
    }
    return rhos;
  }, [presetId, channel, strength]);

  const clampedSteps = Math.min(steps, trajectory.length - 1);
  const rho = trajectory[clampedSteps];
  const targetBlochVector = useMemo(() => densityMatrixToBlochVector(rho), [rho]);
  const { point: blochVector } = useAnimatedBlochTarget(targetBlochVector);
  const purityValue = useMemo(() => purity(rho), [rho]);
  const entropyValue = useMemo(() => vonNeumannEntropy(rho), [rho]);
  const validation = useMemo(() => validateDensityMatrix(rho), [rho]);
  const purityTrajectory = useMemo(() => trajectory.map((r) => purity(r)), [trajectory]);

  function handlePresetChange(id: string) {
    setPresetId(id);
    setSteps(0);
  }

  function handleChannelChange(next: ChannelType) {
    setChannel(next);
    setSteps(0);
  }

  function handleStrengthChange(v: number) {
    setStrength(v);
    setSteps(0);
  }

  const narration =
    clampedSteps === 0
      ? "No decoherence yet — this is the starting pure state, sitting exactly on the sphere's surface."
      : channel === "amplitude-damping"
        ? purityValue > 0.995
          ? `After ${clampedSteps} applications, the state has nearly fully decayed to |0⟩ — amplitude damping's fixed point, itself pure again.`
          : `After ${clampedSteps} applications: purity Tr(ρ²) = ${purityValue.toFixed(3)}. The Bloch vector is being pulled toward the north pole, |0⟩.`
        : purityValue < 0.505
          ? `After ${clampedSteps} applications, x and y have nearly vanished: only the population information (z) survives — this is dephasing's fixed behavior.`
          : `After ${clampedSteps} applications: purity Tr(ρ²) = ${purityValue.toFixed(3)}. Phase information (x, y) is randomizing away while z stays fixed.`;

  return (
    <SimulatorInstrument
      label="Noise channel — open-system decoherence"
      readout={<Readout label="Purity" value={purityValue.toFixed(3)} />}
      footnote="Next: this is exactly the T1/T2 decay hardware engineers measure — see it framed that way in the Quantum Hardware lessons."
      stageClassName="space-y-6"
      stage={
        <>
          <div className="mx-auto max-w-sm">
            <BlochSphereCanvas blochPoint={blochVector} className="mx-auto w-full" />
          </div>

          <div aria-live="polite" className="rounded-xl border border-pillar/25 bg-pillar/5 px-4 py-3 text-sm text-foreground">
            {narration}
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Purity Tr(ρ²) over successive applications</p>
            <DecayCurve samples={purityTrajectory} currentStep={clampedSteps} label="Purity over channel applications" />
          </div>

          <DensityMatrixStatePanel rho={rho} purityValue={purityValue} entropyValue={entropyValue} validation={validation} />

          <Predict
            key={`${presetId}-${channel}`}
            question="Keep stepping this channel forward — where does the Bloch vector eventually settle?"
            options={
              channel === "amplitude-damping"
                ? [
                    { id: "fixed-point", label: "North pole (|0⟩)" },
                    { id: "center", label: "Center of the sphere" },
                  ]
                : [
                    { id: "fixed-point", label: "Its original point on the z-axis" },
                    { id: "center", label: "Center of the sphere" },
                  ]
            }
            outcomeId={clampedSteps >= MAX_STEPS ? "fixed-point" : null}
          />

          <SimulatorFraming
            shows="Real qubits leak information to their environment — this applies an actual Kraus-operator noise channel step by step so you can watch a pure state decay toward the channel&rsquo;s fixed point."
            tryThis={
              <ul>
                <li>
                  Start from |+⟩, choose Amplitude Damping, and step forward until purity nearly hits 1 again
                  at |0⟩. Then reset, pick Dephasing instead, and compare where the Bloch vector ends up.
                </li>
                <li>
                  Compare a low strength (0.05) against a high one (0.5) — same number of steps, very
                  different decay speed.
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
          </div>
        </>
      }
    />
  );
}
