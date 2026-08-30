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
        {/* Every mark in this panel except the vector itself is a reference the reader
            measures the vector against, so all three are load-bearing:

            - the |r| = 1 circle is what "the Bloch vector has shrunk" is shrinking
              *relative to*; without it a short vector is just a short vector;
            - the horizontal rule is z = 0, and "dephasing shrinks it straight toward
              the centre along z = 0 while damping drifts toward the north pole" — the
              single distinction this whole figure exists to show — is read by
              comparing the two dots against exactly that line;
            - the vertical rule is x = 0, the pole-to-pole population axis.

            All three were on `stroke-border`, the panel-edge token (1.41:1 on
            `--surface-muted`), and the two rules further multiplied it by `/60`, which
            put them near 1.2:1 — far under WCAG 2.1 SC 1.4.11's 3:1 for meaningful
            graphical objects. `stroke-axis` is the chart channel and clears it; the
            coloured vector still dominates at 2.5px against these 1px rules. */}
        <circle cx={CX} cy={CY} r={R} className="fill-none stroke-axis" strokeWidth={1.5} />
        <line x1={CX - R - 8} y1={CY} x2={CX + R + 8} y2={CY} className="stroke-axis" strokeWidth={1} />
        <line x1={CX} y1={CY - R - 8} x2={CX} y2={CY + R + 8} className="stroke-axis" strokeWidth={1} />
        {/* 9 -> 11 units. This viewBox is 190 units wide and caps at 190px
            (`max-w-[190px]`), so units map ~1:1 to CSS pixels here and 9 units really
            was 9px — at the very bottom of the legible range for the two labels that
            say which pole is which, which is what makes "damping relaxes toward |0⟩"
            readable at all. */}
        <text x={CX} y={CY - R - 12} textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">|0⟩</text>
        <text x={CX} y={CY + R + 20} textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">|1⟩</text>
        <line x1={CX} y1={CY} x2={px} y2={py} className={colorClass} strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={px} cy={py} r={5} className={fillClass} />
      </svg>
      <p className="mt-1 text-xs font-semibold text-foreground">{title}</p>
      <p className="font-mono text-meta text-muted-foreground">|r| = {length.toFixed(3)}</p>
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
  // Open mid-decay (4 channel applications in) so both vectors are already
  // visibly shortened and visibly *different* on first contact — the T1/T2
  // contrast is the whole point of the figure. Stepping back to n = 0 still
  // shows the untouched |+⟩ reference state.
  const [step, setStep] = useState(() => Math.min(4, maxSteps));
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
    // `role="group"` is load-bearing, not decoration. `aria-label` on a bare
    // <div> names nothing: an element with no role has no accessible name to
    // expose, so screen readers drop the label entirely and the caller's
    // `ariaLabel` — the one sentence saying what these two circles are and why
    // they sit side by side — never reached a reader at all. `group` is the
    // right role for "several related controls and figures under one name",
    // and it makes the label announceable on entry.
    <div role="group" className="not-prose space-y-4 panel-inset p-4 sm:p-5" aria-label={ariaLabel}>
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
        {/* `aria-disabled` rather than the native `disabled` attribute, on both
            step buttons. Stepping is the primary keyboard interaction here and
            the natural way to use it is to hold Enter until the decay reaches
            one end — at which point a natively-disabled button stops being
            focusable *while it currently holds focus*, and every browser drops
            focus to <body>. The reader's next Tab restarts at the top of the
            page, so walking the channel to n = 0 or to `maxSteps` silently
            ejects you from the figure. `aria-disabled` announces the same
            "dimmed, unavailable" state while keeping the element focusable, so
            focus stays put; the handler no-ops and
            `aria-disabled:pointer-events-none` reproduces the
            dead-to-the-mouse behaviour. */}
        <button
          type="button"
          onClick={() => {
            if (step === 0) return;
            handleStep(-1);
          }}
          aria-disabled={step === 0}
          className="min-h-11 rounded-(--radius-tight) border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted aria-disabled:pointer-events-none aria-disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar"
          aria-label="Step back"
        >
          ← Step
        </button>
        {!prefersReducedMotion && (
          <button
            type="button"
            onClick={handlePlayPause}
            className="min-h-11 rounded-(--radius-tight) border border-brand bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={playing ? "Pause" : "Play through every step"}
          >
            {playing ? "Pause" : step >= maxSteps ? "Replay" : "Play"}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (step >= maxSteps) return;
            handleStep(1);
          }}
          aria-disabled={step >= maxSteps}
          className="min-h-11 rounded-(--radius-tight) border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted aria-disabled:pointer-events-none aria-disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar"
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
          className="ml-1 h-11 min-w-[8rem] flex-1 accent-brand"
          aria-label="Channel applications"
          aria-valuetext={`${step} applications`}
        />
        <span className="font-mono text-xs text-muted-foreground">n = {step}</span>
      </div>

      {/*
        The visible narration is deliberately NOT the live region, the same
        split `RabiExplorer` and `WavefunctionSimulation` already use for their
        auto-play loops. Play applies another round of both channels every
        550ms and rewrites this whole two-clause sentence each time; as a
        `polite` region on the visible node that meant a screen reader was cut
        off partway through the T1 clause by the next step's announcement, for
        every step of the run, and never once heard the T2 half — which is the
        entire comparison the figure exists to make. Spam here is worse than
        silence: the queue also blocks anything else the reader attempts while
        the decay plays.

        So the visible text updates freely for the eye, and a separate sr-only
        region carries the same sentence for the ear — emptied for the duration
        of playback, refilled the moment it stops (run finished, or Pause
        pressed). Both step buttons and the slider still announce immediately,
        because each sets `playing` false first: that pacing belongs to the
        reader, not to a timer.
      */}
      <div className="rounded-panel border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
        {narration}
      </div>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {playing ? "" : narration}
      </div>
    </div>
  );
}
