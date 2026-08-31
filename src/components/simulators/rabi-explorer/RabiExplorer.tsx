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
/**
 * Peak transfer, which is sample 40, not the 20 this used to open on.
 *
 * The window spans exactly three cycles of the effective Rabi frequency (see
 * `tMax`), so 240 samples is 80 per cycle. P(1) over that window is
 * (4V²/Ω_eff²)·sin²(Ω_eff·t/2), whose period is the same 2π/Ω_eff: it peaks at
 * a *half* cycle, sample 40, and sample 20 is a quarter cycle, where
 * sin²(π/4) = ½ and the readout is exactly half the ceiling.
 *
 * That off-by-one-quarter mattered, because this instrument asks the reader to
 * check a specific number: the framing says "watch the maximum reachable P(1)
 * fall live, and check it against 4V²/(Δ²+4V²) in the readout", and the
 * narration prints that ceiling in words. Verified against
 * `exactTwoLevelTrajectory`: at V=1, Δ=0 the ceiling is 1.0000 and sample 20
 * read 0.5000; at Δ=2 the ceiling is 0.5000 and sample 20 read 0.2500. A
 * reader following the instruction found half the number they were told to
 * expect. Sample 40 reads 1.0000 and 0.5000, hitting the ceiling exactly, at
 * every detuning (the argmax over the whole trajectory is 40 in both cases),
 * because a fixed index is a fixed *fraction of a cycle* whatever V and Δ are.
 *
 * Opening here rather than at t=0 is also what puts the instrument
 * mid-phenomenon: a qubit caught at the top of its flip, off the north pole,
 * instead of an undisturbed |0⟩ and a flat P(1)=0 readout.
 */
const INITIAL_SAMPLE_INDEX = 40;
const DEFAULT_DRIVE_STRENGTH = 1;
const DEFAULT_DETUNING = 0;
const PLAY_INTERVAL_MS = 40;
const URL_SYNC_DEBOUNCE_MS = 400;
const COPY_CONFIRMATION_MS = 1500;
const DRIVE_STRENGTH_MIN = 0.2;
const DRIVE_STRENGTH_MAX = 3;
const DETUNING_MIN = -4;
const DETUNING_MAX = 4;

// Minimal shareable state is the coupling strength V and detuning Δ; together
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

/** Reads and validates `?rabi_v=&rabi_d=`. Never throws; returns null on anything malformed or absent. */
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

  const [driveStrength, setDriveStrength] = useState(initialFromUrl?.driveStrength ?? DEFAULT_DRIVE_STRENGTH);
  const [detuning, setDetuning] = useState(initialFromUrl?.detuning ?? DEFAULT_DETUNING);
  const [sampleIndex, setSampleIndex] = useState(INITIAL_SAMPLE_INDEX);
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
      // Clipboard access can be denied in some browser security contexts, so no crash and no link copied.
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
  // loop right back at the terminal sample; its very first tick immediately re-triggers
  // the same "reached the end" auto-pause, so the Play button flips to "Pause" for one
  // tick and silently flips back with nothing visibly animating. Restart from the
  // beginning in that case, same as a fresh Play press would intuitively do.
  const handleTogglePlay = () => {
    if (!isPlaying && sampleIndex >= SAMPLES) {
      setSampleIndex(0);
    }
    setIsPlaying((p) => !p);
  };

  // Config changes deliberately KEEP the current sample index rather than
  // rewinding to t=0. The window always spans exactly three cycles of the
  // effective Rabi frequency, so a fixed index is a fixed *fraction of a
  // cycle*: index 40 is the top of the first cycle, i.e. peak transfer,
  // whatever V and Δ are (see INITIAL_SAMPLE_INDEX). Holding it means dragging
  // the detuning slider shows the peak height falling live, which is the single
  // most important thing this instrument has to teach. Rewinding to 0 would
  // instead drop the reader back onto a flat P(1)=0 after every drag.
  const handleDriveStrengthChange = (v: number) => {
    setDriveStrength(v);
    setIsPlaying(false);
  };

  const handleDetuningChange = (d: number) => {
    setDetuning(d);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setDriveStrength(DEFAULT_DRIVE_STRENGTH);
    setDetuning(DEFAULT_DETUNING);
    setSampleIndex(INITIAL_SAMPLE_INDEX);
  };

  // Continuous auto-play is a looping visual animation (the Bloch vector and
  // population curve sweeping forward every PLAY_INTERVAL_MS), skipped
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

  // The instrument's live narration, in the same voice as BlochSphereExplorer's
  // aria-live line: what just changed, in words, with no unglossed symbols.
  const pctIn1 = Math.round(p1 * 100);
  // Whether the reader is sitting on the ceiling right now, so the narration
  // can say "this is the most you will ever get" rather than quoting a limit
  // the on-screen number happens to already equal. The instrument opens exactly
  // here (see INITIAL_SAMPLE_INDEX), so this is the sentence first contact gets.
  const isAtCeiling = p1 >= maxPopulation - 0.005;
  const narration =
    detuning === 0
      ? isAtCeiling
        ? `t = ${current.t.toFixed(2)}: the drive has moved ${pctIn1}% of the qubit into |1⟩, a complete flip. The drive is exactly on resonance, so a pulse of this length transfers everything; hardware people call it a π pulse. Leave it on and it will keep going, back to |0⟩ and around again.`
        : `t = ${current.t.toFixed(2)}: the drive has moved ${pctIn1}% of the qubit into |1⟩. The drive is exactly on resonance, so given the right pulse length the transfer reaches 100%; that pulse is what hardware people call a π pulse.`
      : `t = ${current.t.toFixed(2)}: the drive has moved ${pctIn1}% of the qubit into |1⟩${
          isAtCeiling ? ", and that is as far as it goes" : ""
        }. The drive is off resonance by Δ = ${detuning.toFixed(
          2
        )}, so no pulse length ever gets past ${Math.round(maxPopulation * 100)}%; that ceiling is 4V²/(Δ²+4V²), and it is why a mistuned control pulse can never fully flip a qubit.`;

  return (
    <SimulatorInstrument
      label="Rabi driving: two-level system"
      readout={<Readout label="Chance of measuring |1⟩" value={p1.toFixed(3)} />}
      footnote="Next: real qubits also lose coherence while being driven; see that decay in the Noise & Decoherence Explorer."
      stageClassName="space-y-6"
      stage={
        <>
          {/* Only lightly trimmed, deliberately: this is the paragraph that
              earns this instrument its `warmed-up` rather than `open` level
              (see the SIMULATOR_INDEX comment on `/simulators`), because it
              is what defines V and Δ before the readouts below use them.
              Cutting the definitions to hit a smaller target would just move
              the gap the level system exists to be honest about. */}
          <p className="text-sm text-muted-foreground">
            A qubit starts in |0⟩. A control pulse, a microwave tone or a laser depending on the hardware,
            drives it smoothly back and forth between |0⟩ and |1⟩ for as long as it&rsquo;s on, never simply
            &ldquo;setting&rdquo; it to |1⟩. Two knobs control that: how hard you push (
            <span className="font-mono text-pillar">V</span>), and how well your pulse&rsquo;s frequency
            matches the qubit&rsquo;s own (<span className="font-mono text-pillar">Δ</span>).
          </p>

          {/*
            The visible narration is deliberately NOT the live region here,
            unlike the other instruments on this bench. This is the only one
            with a continuous auto-play loop: Play advances `sampleIndex` every
            40ms, which rewrites this whole sentence 25 times a second. A
            `polite` region on the visible node meant a screen reader spent the
            entire playback being interrupted by a half-read sentence, over and
            over, and never got a usable reading of any of them.

            So the visible text updates freely at 25Hz for the eye, and a
            separate sr-only region carries the same sentence for the ear,
            emptied while playing, refilled the moment playback stops. The
            reader hears one clean announcement of where the trajectory
            actually got to, instead of two hundred fragments of where it was
            passing through. Scrubbing the slider by hand still announces
            normally, because that is paced by the reader, not by a timer.
          */}
          <div className="rounded-panel border border-pillar/25 bg-pillar/5 px-4 py-3 text-sm text-foreground">
            {narration}
          </div>
          <div aria-live="polite" className="sr-only">
            {isPlaying ? "" : narration}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                P(1), the chance of finding the qubit in |1⟩, over time
              </p>
              <PopulationCurve samples={populationSamples} tMax={tMax} currentT={current.t} currentP1={p1} />
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                The same thing on the Bloch sphere: |0⟩ is the top, |1⟩ the bottom (drag to rotate)
              </p>
              {/* `max-w-[260px]`, not the 220px this used to cap at.
                  `BlochSphereCanvas` authors its axis names and its |0⟩/|1⟩
                  pole kets at 15 units on a 400-unit viewBox, so the effective
                  type size is 15 × (rendered width) ÷ 400. At a 220px cap that
                  is 8.25px, under the ~9px floor the rest of the bench is sized
                  to, and the labels it shrinks are the only thing naming the
                  axes and the two poles this instrument's whole narration
                  ("|0⟩ is the top, |1⟩ the bottom") refers to. 260px gives
                  9.75px. On a 320px phone this column is the full ~254px
                  content box (the `sm:` two-up never applies there), which is
                  9.53px, so the cap only ever binds on the wide layout where
                  it now clears the floor rather than sitting under it. */}
              <BlochSphereCanvas blochPoint={blochPoint} className="mx-auto w-full max-w-[260px]" />
            </div>
          </div>
        </>
      }
      stageAfter={
        <>
          <div className="rounded-panel border border-border bg-surface-muted/60 px-4 py-3">
            <div className="overflow-x-auto">
              <KatexMath
                tex={`P(1) = ${p1.toFixed(4)} \\qquad \\Omega_{\\text{eff}} = \\sqrt{\\Delta^2+4V^2} = ${omegaEff.toFixed(3)}`}
                display
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Reading it out loud: the chance of measuring |1⟩ right now is {p1.toFixed(3)}, and the qubit is
              cycling between |0⟩ and |1⟩ at rate Ω<sub>eff</sub> = {omegaEff.toFixed(3)}, which grows with
              both the drive strength V and the detuning Δ, but only V raises how much population actually
              gets across.
            </p>
          </div>

          <SimulatorFraming
            shows="Driving a qubit at exactly its own transition frequency flips it completely; drive it slightly off that frequency and something has to give."
            watchFor={
              <>
                The drive rate Ω<sub>eff</sub> gets <em>faster</em> as you detune, while the height the
                population curve reaches gets <em>lower</em>. Going off resonance does not slow the qubit
                down; it just stops the flip from ever completing.
              </>
            }
            tryThis={
              <ul>
                <li>
                  Leave detuning at 0 and press Play: the population curve should reach a full 1.0 and come
                  back down, three times over. That round trip is one Rabi oscillation.
                </li>
                <li>
                  Now drag detuning away from 0 without touching anything else. The instrument holds its
                  position at the peak of the first cycle, so you can watch the maximum reachable P(1) fall
                  live, and check it against 4V²/(Δ²+4V²) in the readout.
                </li>
              </ul>
            }
          />
        </>
      }
      controls={
        <>
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
            onReset={handleReset}
            prefersReducedMotion={prefersReducedMotion}
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
