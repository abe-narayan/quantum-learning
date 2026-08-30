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
  // Open at the *end* of the circuit — the payoff state (a Bell pair's 50/50
  // bars, a teleported state, …) — rather than at the featureless |0…0⟩
  // start. The end-state narration invites scrubbing back, and Replay/step
  // controls rebuild the state gate by gate from the reference start.
  const [step, setStep] = useState(instructions.length);
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
      : safeStep >= totalSteps
        ? `Final state, after all ${totalSteps} gates${instructions[safeStep - 1] ? ` (last: ${instructions[safeStep - 1].gate})` : ""}. Step back to watch it build up gate by gate.`
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
        {/* `aria-disabled` rather than the native `disabled` attribute, on both
            step buttons. Stepping is the primary keyboard interaction with this
            figure and the natural way to use it is to hold Enter until you
            reach one end of the circuit — at which point a natively-disabled
            button stops being focusable *while it currently holds focus*, and
            every browser drops focus to <body>. The reader's next Tab then
            restarts at the top of the page, so walking the circuit to its own
            first or last gate silently ejects you from the figure. Keeping the
            element focusable with `aria-disabled` announces the same "dimmed,
            unavailable" state without moving focus; the handler no-ops and
            `aria-disabled:pointer-events-none` reproduces the
            dead-to-the-mouse behaviour. */}
        <button
          type="button"
          onClick={() => {
            if (safeStep === 0) return;
            handleStep(-1);
          }}
          aria-disabled={safeStep === 0}
          className="min-h-11 rounded-(--radius-tight) border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted aria-disabled:pointer-events-none aria-disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar"
          aria-label="Step back one gate"
        >
          ← Step
        </button>
        {!prefersReducedMotion && (
          <button
            type="button"
            onClick={handlePlayPause}
            className="min-h-11 rounded-(--radius-tight) border border-brand bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            // Three visible states, so three names — WCAG 2.5.3 Label in
            // Name. This read `playing ? "Pause" : "Play through every gate"`,
            // two names for three labels: at the end of the circuit the button
            // says "Replay" while being named "Play through every gate", and
            // "Replay" is not a contiguous run of that name, so a speech-input
            // user saying "click Replay" activated nothing at all. Each name
            // now contains its own visible word as a contiguous run.
            aria-label={
              playing
                ? "Pause"
                : safeStep >= totalSteps
                  ? "Replay from the first gate"
                  : "Play through every gate"
            }
          >
            {playing ? "Pause" : safeStep >= totalSteps ? "Replay" : "Play"}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            if (safeStep >= totalSteps) return;
            handleStep(1);
          }}
          aria-disabled={safeStep >= totalSteps}
          className="min-h-11 rounded-(--radius-tight) border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted aria-disabled:pointer-events-none aria-disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar"
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
          className="ml-1 h-11 min-w-[8rem] flex-1 accent-brand"
          aria-label="Gate step"
          aria-valuetext={currentLabel}
        />
      </div>

      {/*
        The visible narration is deliberately NOT the live region, the same
        split `RabiExplorer` and `WavefunctionSimulation` already use for their
        auto-play loops. Play advances one gate every 1100ms and rewrites this
        sentence on every one of them; as a `polite` region on the visible node
        that meant a screen reader was cut off mid-sentence by the next gate's
        announcement for the whole run and never completed one — worse than
        silence, because the queue also blocks anything else the reader tries
        while the circuit plays.

        So the visible text updates freely for the eye, and a separate sr-only
        region carries the same sentence for the ear — emptied for the duration
        of playback, refilled the moment it stops (run finished, or Pause
        pressed). The reader hears one clean statement of the state the circuit
        actually reached. Both step buttons and the slider still announce
        immediately, because each sets `playing` false first: that pacing
        belongs to the reader, not to a timer.
      */}
      <div className="rounded-panel border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
        {currentLabel}
      </div>
      {/* `role="status"`, the carrier every other live region in this
          codebase uses (CurrentQuantumCatalog, LessonSearch, GlossaryFilter,
          ConceptMapExplorer, EquationReveal). On a role-less div `aria-live`
          alone leaves the region's role `generic`, which several screen
          readers handle less reliably than a real `status`; the explicit
          `aria-live`/`aria-atomic` below restate what `status` already
          implies, and are kept because the atomic behaviour is
          load-bearing — this sentence is replaced whole, and a
          non-atomic region would announce only the words that changed. */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {playing ? "" : currentLabel}
      </div>
    </div>
  );
}
