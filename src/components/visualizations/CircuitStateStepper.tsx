"use client";

/**
 * MDX usage (any lesson with a real, computable circuit — teleportation,
 * superdense coding, Bell-state prep, block-encoding LCU circuits, …):
 *
 *   <CircuitStateStepper
 *     numQubits={2}
 *     instructions={[
 *       { gate: "H", targets: [0] },
 *       { gate: "CNOT", targets: [0, 1] },
 *     ]}
 *     ariaLabel="A Bell-pair preparation circuit, stepped gate by gate."
 *   />
 *
 * `CircuitDiagramExplorer` already lets a lesson scrub between several
 * *different* fixed circuits via a slider; nothing existing shows a single
 * circuit's own state vector accumulating gate by gate as it runs — the
 * concrete "a circuit executes" picture. This composes two already-stable,
 * registered pieces (`StaticCircuitDiagram`'s rendering, `BarChart`'s bars)
 * around one new idea: `runInstructions` (the same prefix-replay function
 * `CircuitBuilder.tsx`'s own step slider uses) is called fresh on every step
 * change, so the amplitude bars beneath the diagram are always the real
 * |amplitude|² of the actual state after exactly the highlighted gates —
 * never an interpolated or hand-authored number.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import type { GateInstruction } from "@/lib/quantum/circuitBuilder";
import { runInstructions } from "@/lib/quantum/circuitBuilder";
import { StaticCircuitDiagram } from "./StaticCircuitDiagram";
import { BarChart, type BarChartEntry } from "./BarChart";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";

/** Time between auto-play steps — slow enough to read the diagram's highlighted column and the bars settling before the next gate fires. */
const STEP_INTERVAL_MS = 1100;

export function CircuitStateStepper({
  numQubits,
  instructions,
  ariaLabel,
  markedIndex,
}: {
  numQubits: number;
  instructions: GateInstruction[];
  ariaLabel: string;
  /** Optional basis-state index to draw in the accent color throughout (e.g. the target outcome of a teleportation or search circuit). */
  markedIndex?: number;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSteps = instructions.length;

  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setStep((s) => {
        if (s >= totalSteps) {
          setPlaying(false);
          return s;
        }
        return s + 1;
      });
    }, STEP_INTERVAL_MS);
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [playing, totalSteps]);

  // A lesson can pass a shorter instruction list than the one we are part-way
  // through (a preset switch, say). Clamp during render rather than
  // correcting it in an effect: the effect form sets state from inside an
  // effect body, which costs an extra render pass and which the React
  // Compiler's lint rejects. `step` stays whatever the user chose; every read
  // below goes through `safeStep`, so a list that grows again resumes where
  // it left off instead of having been silently truncated.
  const safeStep = Math.min(step, totalSteps);

  const state = useMemo(
    () => runInstructions(numQubits, instructions.slice(0, safeStep)),
    [numQubits, instructions, safeStep]
  );

  const probabilities = state.probabilities();
  const bars: BarChartEntry[] = probabilities.map((p, i) => ({
    label: `|${state.basisLabel(i)}⟩`,
    value: p,
    caption: p < 0.005 ? "0" : p.toFixed(2),
    highlight: markedIndex !== undefined && i === markedIndex,
  }));

  const currentLabel =
    safeStep === 0
      ? "Initial state |0…0⟩, before any gate."
      : `After gate ${safeStep} of ${totalSteps}${instructions[safeStep - 1] ? ` (${instructions[safeStep - 1].gate})` : ""}.`;

  const handlePlayPause = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (safeStep >= totalSteps) setStep(0);
    setPlaying(true);
  };

  const handleStep = (delta: number) => {
    setPlaying(false);
    setStep((s) => Math.max(0, Math.min(totalSteps, s + delta)));
  };

  return (
    <div className="not-prose space-y-3">
      <StaticCircuitDiagram
        numQubits={numQubits}
        instructions={instructions}
        highlightColumn={safeStep > 0 ? safeStep - 1 : undefined}
        ariaLabel={`${ariaLabel} Circuit diagram, gate ${safeStep} of ${totalSteps} highlighted.`}
      />

      <BarChart bars={bars} ariaLabel={`${ariaLabel} ${currentLabel} Bars show |amplitude|² for each basis outcome.`} maxValue={1} />

      <div className="flex flex-wrap items-center gap-2 panel-inset p-3">
        <button
          type="button"
          onClick={() => handleStep(-1)}
          disabled={safeStep === 0}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="Step back one gate"
        >
          ← Step
        </button>
        {!prefersReducedMotion && (
          <button
            type="button"
            onClick={handlePlayPause}
            className="rounded-md border border-brand bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={playing ? "Pause" : "Play through every gate"}
          >
            {playing ? "Pause" : safeStep >= totalSteps ? "Replay" : "Play"}
          </button>
        )}
        <button
          type="button"
          onClick={() => handleStep(1)}
          disabled={safeStep >= totalSteps}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="Step forward one gate"
        >
          Step →
        </button>
        <input
          type="range"
          min={0}
          max={totalSteps}
          step={1}
          value={safeStep}
          onChange={(e) => {
            setPlaying(false);
            setStep(Number(e.target.value));
          }}
          className="ml-1 min-w-[8rem] flex-1 accent-brand"
          aria-label="Gate step"
          aria-valuetext={currentLabel}
        />
      </div>

      <div aria-live="polite" className="rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
        {currentLabel}
      </div>
    </div>
  );
}
