"use client";

/**
 * MDX usage (`t1-and-t2-decoherence.mdx`, `decoherence-and-the-quantum-to-classical-transition.mdx`,
 * `open-quantum-systems-and-kraus-operators.mdx`, and the Mastery lessons
 * that build channels from Kraus operators):
 *
 *   <DecoherenceBlochDecay
 *     gamma={0.18}
 *     lambda={0.18}
 *     maxSteps={14}
 *     ariaLabel="A qubit's Bloch vector shrinking under amplitude damping (T1) versus pure dephasing (T2), step by step."
 *   />
 *
 * Two Bloch-circle panels (the x–z cross-section — this platform's channels
 * are real matrices acting on a real-Bloch-vector starting state, so no
 * information is lost restricting to that plane) sharing one step counter,
 * each driven by repeated application of a real Kraus channel from
 * `@/lib/quantum/openSystems.ts` (`amplitudeDampingChannel`/`dephasingChannel`
 * via `applyChannelRepeatedly`, read back out with `densityMatrixToBlochVector`)
 * starting from `|+⟩` (equator, maximally sensitive to both channels). The
 * two channels are shown side by side under the *same* step count
 * specifically to make their qualitative difference visible: amplitude
 * damping (T1) shrinks the vector toward the north pole |0⟩ (population
 * relaxing to the ground state) while dephasing (T2) shrinks it straight
 * toward the center along z = 0 (coherence lost, population untouched) —
 * the standard textbook distinction, here computed rather than asserted.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { blochStateFromAngles, densityMatrixToBlochVector } from "@/lib/quantum/bloch";
import { pureStateDensityMatrix } from "@/lib/quantum/densityMatrix";
import { amplitudeDampingChannel, dephasingChannel, applyChannelRepeatedly } from "@/lib/quantum/openSystems";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";

const STEP_INTERVAL_MS = 550;
const PANEL_SIZE = 190;
const R = 70;
const CX = PANEL_SIZE / 2;
const CY = PANEL_SIZE / 2;

function BlochCirclePanel({
  title,
  colorClass,
  fillClass,
  x,
  z,
  length,
  ariaDetail,
}: {
  title: string;
  colorClass: string;
  fillClass: string;
  x: number;
  z: number;
  length: number;
  ariaDetail: string;
}) {
  const px = CX + x * R;
  // Bloch z (population axis) points "up" (toward |0>) in the usual convention; SVG y grows downward.
  const py = CY - z * R;

  return (
    <div className="flex flex-col items-center">
      <svg width={PANEL_SIZE} height={PANEL_SIZE} viewBox={`0 0 ${PANEL_SIZE} ${PANEL_SIZE}`} role="img" aria-label={ariaDetail} className="w-full max-w-[190px]">
        <circle cx={CX} cy={CY} r={R} className="fill-none stroke-border" strokeWidth={1.5} />
        <line x1={CX - R - 8} y1={CY} x2={CX + R + 8} y2={CY} className="stroke-border/60" strokeWidth={1} />
        <line x1={CX} y1={CY - R - 8} x2={CX} y2={CY + R + 8} className="stroke-border/60" strokeWidth={1} />
        <text x={CX} y={CY - R - 12} textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">|0⟩</text>
        <text x={CX} y={CY + R + 20} textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">|1⟩</text>
        <line x1={CX} y1={CY} x2={px} y2={py} className={colorClass} strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={px} cy={py} r={5} className={fillClass} />
      </svg>
      <p className="mt-1 text-xs font-semibold text-foreground">{title}</p>
      <p className="font-mono text-[11px] text-muted-foreground">|r| = {length.toFixed(3)}</p>
    </div>
  );
}

export function DecoherenceBlochDecay({
  gamma = 0.18,
  lambda = 0.18,
  maxSteps = 14,
  initialTheta = Math.PI / 2,
  initialPhi = 0,
  ariaLabel,
}: {
  /** Amplitude-damping strength per step (T1 channel), 0–1. */
  gamma?: number;
  /** Dephasing strength per step (T2 channel), 0–1. */
  lambda?: number;
  maxSteps?: number;
  /** Bloch polar/azimuthal angle of the starting state. Defaults to the equator (|+⟩), where both channels' effects are most visible. */
  initialTheta?: number;
  initialPhi?: number;
  ariaLabel: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= maxSteps) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, STEP_INTERVAL_MS);
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [playing, maxSteps]);

  const rho0 = useMemo(
    () => pureStateDensityMatrix(blochStateFromAngles({ theta: initialTheta, phi: initialPhi })),
    [initialTheta, initialPhi]
  );
  const dampingKraus = useMemo(() => amplitudeDampingChannel(gamma), [gamma]);
  const dephasingKraus = useMemo(() => dephasingChannel(lambda), [lambda]);

  const dampingVector = useMemo(
    () => densityMatrixToBlochVector(applyChannelRepeatedly(rho0, dampingKraus, step)),
    [rho0, dampingKraus, step]
  );
  const dephasingVector = useMemo(
    () => densityMatrixToBlochVector(applyChannelRepeatedly(rho0, dephasingKraus, step)),
    [rho0, dephasingKraus, step]
  );

  const dampingLength = Math.hypot(dampingVector.x, dampingVector.y, dampingVector.z);
  const dephasingLength = Math.hypot(dephasingVector.x, dephasingVector.y, dephasingVector.z);

  const handlePlayPause = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (step >= maxSteps) setStep(0);
    setPlaying(true);
  };

  const handleStep = (delta: number) => {
    setPlaying(false);
    setStep((s) => Math.max(0, Math.min(maxSteps, s + delta)));
  };

  const narration = `After ${step} application${step === 1 ? "" : "s"} of each channel: amplitude damping (T1) has shrunk the Bloch vector to length ${dampingLength.toFixed(
    2
  )}, drifting its z-coordinate toward ${dampingVector.z.toFixed(2)} (population relaxing toward |0⟩). Dephasing (T2) has shrunk it to length ${dephasingLength.toFixed(
    2
  )} while its z-coordinate stays at ${dephasingVector.z.toFixed(2)} (populations untouched, only coherence lost).`;

  return (
    <div className="not-prose space-y-4 panel-inset p-4 sm:p-5" aria-label={ariaLabel}>
      <div className="flex flex-wrap items-start justify-center gap-8">
        <BlochCirclePanel
          title={`Amplitude damping · T1 (γ=${gamma.toFixed(2)})`}
          colorClass="stroke-danger"
          fillClass="fill-danger"
          x={dampingVector.x}
          z={dampingVector.z}
          length={dampingLength}
          ariaDetail={`Amplitude damping Bloch vector after ${step} steps: x=${dampingVector.x.toFixed(2)}, z=${dampingVector.z.toFixed(2)}, length ${dampingLength.toFixed(2)}.`}
        />
        <BlochCirclePanel
          title={`Dephasing · T2 (λ=${lambda.toFixed(2)})`}
          colorClass="stroke-accent"
          fillClass="fill-accent"
          x={dephasingVector.x}
          z={dephasingVector.z}
          length={dephasingLength}
          ariaDetail={`Dephasing Bloch vector after ${step} steps: x=${dephasingVector.x.toFixed(2)}, z=${dephasingVector.z.toFixed(2)}, length ${dephasingLength.toFixed(2)}.`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleStep(-1)}
          disabled={step === 0}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="Step back"
        >
          ← Step
        </button>
        {!prefersReducedMotion && (
          <button
            type="button"
            onClick={handlePlayPause}
            className="rounded-md border border-brand bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={playing ? "Pause" : "Play through every step"}
          >
            {playing ? "Pause" : step >= maxSteps ? "Replay" : "Play"}
          </button>
        )}
        <button
          type="button"
          onClick={() => handleStep(1)}
          disabled={step >= maxSteps}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="Step forward"
        >
          Step →
        </button>
        <input
          type="range"
          min={0}
          max={maxSteps}
          step={1}
          value={step}
          onChange={(e) => {
            setPlaying(false);
            setStep(Number(e.target.value));
          }}
          className="ml-1 min-w-[8rem] flex-1 accent-brand"
          aria-label="Channel applications"
          aria-valuetext={`${step} applications`}
        />
        <span className="font-mono text-xs text-muted-foreground">n = {step}</span>
      </div>

      <div aria-live="polite" className="rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
        {narration}
      </div>
    </div>
  );
}
