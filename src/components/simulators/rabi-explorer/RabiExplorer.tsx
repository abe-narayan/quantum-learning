"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { exactTwoLevelTrajectory } from "@/lib/quantum/approximationMethods";
import { stateToBlochVector } from "@/lib/quantum/bloch";
import { StateVector } from "@/lib/quantum/state";
import { BlochSphereCanvas } from "@/components/simulators/bloch-sphere/BlochSphereCanvas";
import { usePrefersReducedMotion } from "@/components/simulators/bloch-sphere/usePrefersReducedMotion";
import { Button } from "@/components/ui/Button";
import { PopulationCurve } from "./PopulationCurve";
import { RabiControls } from "./RabiControls";
import { KatexMath } from "@/components/ui/KatexMath";
import { Readout } from "@/components/ui/Typography";
import { SimulatorInstrument } from "../shared/SimulatorInstrument";
import { SimulatorFraming } from "../shared/Framing";

const SAMPLES = 240;
const PLAY_INTERVAL_MS = 40;
const URL_SYNC_DEBOUNCE_MS = 400;
const COPY_CONFIRMATION_MS = 1500;
const DRIVE_STRENGTH_MIN = 0.2;
const DRIVE_STRENGTH_MAX = 3;
const DETUNING_MIN = -4;
const DETUNING_MAX = 4;

// Minimal shareable state is the coupling strength V and detuning Δ — together
// they fully determine the trajectory via `exactTwoLevelTrajectory`. The
// time-scrub position (sampleIndex) and play/pause are playback state, not
// configuration, so they're deliberately excluded: a shared link reproduces
// the setup, not a paused mid-animation frame. Params are prefixed (`rabi_`)
// because this simulator shares /simulators with other URL-stateful simulators.
function clampDriveStrength(value: number): number {
  return Math.min(DRIVE_STRENGTH_MAX, Math.max(DRIVE_STRENGTH_MIN, value));
}

function clampDetuning(value: number): number {
  return Math.min(DETUNING_MAX, Math.max(DETUNING_MIN, value));
}

/** Reads and validates `?rabi_v=&rabi_d=`. Never throws — returns null on anything malformed or absent. */
function parseRabiParams(
  params: { get(key: string): string | null }
): { driveStrength: number; detuning: number } | null {
  const rawV = params.get("rabi_v");
  const rawD = params.get("rabi_d");
  if (rawV === null || rawD === null) return null;
  const v = Number(rawV);
  const d = Number(rawD);
  if (!Number.isFinite(v) || !Number.isFinite(d)) return null;
  return { driveStrength: clampDriveStrength(v), detuning: clampDetuning(d) };
}

export function RabiExplorer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const initialFromUrl = parseRabiParams(searchParams);

  const [driveStrength, setDriveStrength] = useState(initialFromUrl?.driveStrength ?? 1);
  const [detuning, setDetuning] = useState(initialFromUrl?.detuning ?? 0);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

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
      params.set("rabi_v", driveStrength.toFixed(3));
      params.set("rabi_d", detuning.toFixed(3));
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
  }, [driveStrength, detuning]);

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

  // Show three full oscillation periods of the effective (generalized) Rabi
  // frequency Omega_eff = sqrt(Delta^2 + 4V^2), the exact splitting between
  // the driven system's two eigenstates.
  const tMax = useMemo(() => {
    const omegaEff = Math.sqrt(detuning * detuning + 4 * driveStrength * driveStrength);
    return (3 * 2 * Math.PI) / omegaEff;
  }, [driveStrength, detuning]);

  const trajectory = useMemo(
    () => exactTwoLevelTrajectory(0, detuning, driveStrength, tMax, SAMPLES),
    [driveStrength, detuning, tMax]
  );

  // Toggling play back on after the trajectory already auto-completed (sampleIndex
  // at SAMPLES, which is also what auto-paused it) would otherwise start the interval
  // loop right back at the terminal sample — its very first tick immediately re-triggers
  // the same "reached the end" auto-pause, so the Play button flips to "Pause" for one
  // tick and silently flips back with nothing visibly animating. Restart from the
  // beginning in that case, same as a fresh Play press would intuitively do.
  const handleTogglePlay = () => {
    if (!isPlaying && sampleIndex >= SAMPLES) {
      setSampleIndex(0);
    }
    setIsPlaying((p) => !p);
  };

  const handleDriveStrengthChange = (v: number) => {
    setDriveStrength(v);
    setSampleIndex(0);
    setIsPlaying(false);
  };

  const handleDetuningChange = (d: number) => {
    setDetuning(d);
    setSampleIndex(0);
    setIsPlaying(false);
  };

  // Continuous auto-play is a looping visual animation (the Bloch vector and
  // population curve sweeping forward every PLAY_INTERVAL_MS) — skipped
  // under prefers-reduced-motion the same way WavefunctionSimulation's play
  // loop is. The time slider in RabiControls still lets a reduced-motion
  // visitor scrub through every sample manually.
  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) return;
    const id = setInterval(() => {
      setSampleIndex((i) => {
        if (i >= SAMPLES) {
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, PLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isPlaying, prefersReducedMotion]);

  const current = trajectory[sampleIndex];
  const p1 = current.c[1].magnitudeSquared();
  const blochPoint = stateToBlochVector(new StateVector([current.c[0], current.c[1]]));

  const populationSamples = useMemo(
    () => trajectory.map((point) => ({ t: point.t, p1: point.c[1].magnitudeSquared() })),
    [trajectory]
  );

  const omegaEff = Math.sqrt(detuning * detuning + 4 * driveStrength * driveStrength);
  const maxPopulation = (4 * driveStrength * driveStrength) / (detuning * detuning + 4 * driveStrength * driveStrength);

  return (
    <SimulatorInstrument
      label="Rabi driving — two-level system"
      readout={<Readout label="P(1)" value={p1.toFixed(3)} />}
      footnote="Next: real qubits also lose coherence while being driven — see that decay in the Noise & Decoherence Explorer."
      stageClassName="space-y-6"
      stage={
        <>
          <div className="rounded-xl border border-pillar/25 bg-pillar/5 px-4 py-3 text-sm text-foreground">
            {detuning === 0 ? (
              <>On resonance: population fully transfers to |1⟩ and back, P(1) = sin²(Vt).</>
            ) : (
              <>
                Off resonance: population never fully transfers. Maximum reachable P(1) ≈{" "}
                {maxPopulation.toFixed(3)}, set by 4V²/(Δ²+4V²).
              </>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Population of |1⟩ over time</p>
              <PopulationCurve samples={populationSamples} tMax={tMax} currentT={current.t} currentP1={p1} />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Bloch-sphere trajectory (drag to rotate)</p>
              <BlochSphereCanvas blochPoint={blochPoint} className="mx-auto w-full max-w-[220px]" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-surface-muted/60 px-4 py-3">
            <KatexMath
              tex={`P(1) = ${p1.toFixed(4)} \\qquad \\Omega_{\\text{eff}} = \\sqrt{\\Delta^2+4V^2} = ${omegaEff.toFixed(3)}`}
              display
            />
          </div>

          <SimulatorFraming
            shows="Driving a qubit at its transition frequency swaps its state completely; drive off-resonance and something has to give."
            tryThis="Set detuning to 0 and confirm population fully cycles 0→1→0. Then increase detuning until the Bloch trajectory visibly stops reaching the south pole, and check that the displayed max P(1) matches 4V²/(Δ²+4V²)."
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
            <RabiControls
              driveStrength={driveStrength}
              onDriveStrengthChange={handleDriveStrengthChange}
              detuning={detuning}
              onDetuningChange={handleDetuningChange}
              sampleIndex={sampleIndex}
              maxSampleIndex={SAMPLES}
              currentTLabel={`t = ${current.t.toFixed(2)}`}
              onSampleIndexChange={(i) => {
                setIsPlaying(false);
                setSampleIndex(i);
              }}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onReset={() => {
                setIsPlaying(false);
                setSampleIndex(0);
              }}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        </>
      }
    />
  );
}
