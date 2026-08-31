"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StateVector } from "@/lib/quantum/state";
import { applySingleQubitGate, applyCNOT, applySwap } from "@/lib/quantum/gates";
import { measure, measureQubit } from "@/lib/quantum/measurement";
import { pureStateDensityMatrix, purity } from "@/lib/quantum/densityMatrix";
import { reducedDensityMatrixQubit0, reducedDensityMatrixQubit1 } from "@/lib/quantum/partialTrace";
import { StatePanel } from "./StatePanel";
import { CorrelationView } from "./CorrelationView";
import { OperationControls, type InitId } from "./OperationControls";
import { MeasurementPanel } from "./MeasurementPanel";
import { SINGLE_QUBIT_GATES, type SingleQubitGateId } from "./gateDefinitions";
import { GUIDED_PRESETS } from "./presets";
import { SimulatorInstrument } from "../shared/SimulatorInstrument";
import { SimulatorFraming } from "../shared/Framing";
import { Predict } from "../shared/Predict";

const STEP_DELAY_MS = 700;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function gateMatrix(id: SingleQubitGateId) {
  const gate = SINGLE_QUBIT_GATES.find((g) => g.id === id);
  if (!gate) throw new Error(`Unknown gate ${id}`);
  return gate.matrix;
}

function gateNarration(gate: SingleQubitGateId, qubit: 0 | 1) {
  return `Applied ${gate} to qubit ${qubit}.`;
}

/** How mixed a reduced state is, in words a first-time reader can act on. */
function purityDescription(p: number): string {
  if (p > 0.999) return "pure: this qubit has a definite state of its own";
  if (p < 0.501) return "maximally mixed: no state of its own at all";
  return "partly mixed: some of its state lives in the correlation";
}

/**
 * "Qubit 0 alone / Qubit 1 alone": the reduced state of each qubit with the
 * other traced out, summarised by its purity Tr(ρ²). Computed with the same
 * `reducedDensityMatrixQubit0/1` + `purity` engine functions
 * `EntanglementCorrelation` uses; for a product state each purity is 1
 * (each qubit is a complete description by itself); for a Bell state each is
 * 0.5 (all the information is in the pair, none in either half).
 */
function ReducedStatesPanel({ state }: { state: StateVector }) {
  const { purity0, purity1 } = useMemo(() => {
    const rho = pureStateDensityMatrix(state);
    return {
      purity0: purity(reducedDensityMatrixQubit0(rho)),
      purity1: purity(reducedDensityMatrixQubit1(rho)),
    };
  }, [state]);

  return (
    <div className="rounded-panel border border-border bg-surface-muted/60 px-4 py-3">
      <h3 className="text-sm font-semibold text-foreground">Each qubit alone</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Ignore one qubit entirely: what is left of the other? Purity Tr(ρ²) = 1 means a complete
        state of its own; 0.5 means maximally mixed, with everything in the correlation.
      </p>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-muted-foreground">Qubit 0 alone</dt>
          <dd className="mt-0.5 text-sm text-foreground">
            <span className="font-mono">{purity0.toFixed(3)}</span>
            <span className="ml-2 text-xs text-muted-foreground">{purityDescription(purity0)}</span>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Qubit 1 alone</dt>
          <dd className="mt-0.5 text-sm text-foreground">
            <span className="font-mono">{purity1.toFixed(3)}</span>
            <span className="ml-2 text-xs text-muted-foreground">{purityDescription(purity1)}</span>
          </dd>
        </div>
      </dl>
    </div>
  );
}

/** The Bell pair (|00⟩ + |11⟩)/√2 the instrument now opens on, built with the same engine calls the "bell" guided preset replays. */
function initialBellState(): StateVector {
  return applyCNOT(applySingleQubitGate(StateVector.zero(2), gateMatrix("H"), 0), 0, 1);
}

export function TwoQubitExplorer() {
  const [state, setState] = useState<StateVector>(initialBellState);
  const [narration, setNarration] = useState(
    "Starting mid-experiment: H then CNOT already ran, so the pair sits in the Bell state (|00⟩ + |11⟩)/√2: entangled. Neither qubit has a definite value, yet they always agree. Measure qubit 0 and watch qubit 1's fate lock in instantly. Reset returns to plain |00⟩."
  );
  const [activePresetId, setActivePresetId] = useState<string | null>("bell");
  const [lastMeasurement, setLastMeasurement] = useState<string | null>(null);
  const [targetQubit, setTargetQubit] = useState<0 | 1>(0);
  const [isRunning, setIsRunning] = useState(false);
  /** Resolved outcome of the "measure qubit 0 of a Bell pair" prediction, set from the first real qubit-0 measurement. */
  const [predictOutcomeId, setPredictOutcomeId] = useState<string | null>(null);

  const cancelledRef = useRef(false);
  useEffect(
    () => () => {
      cancelledRef.current = true;
    },
    []
  );

  const disabled = isRunning;

  const applyGate = useCallback(
    (gate: SingleQubitGateId, qubit: 0 | 1) => {
      if (disabled) return;
      setState((prev) => applySingleQubitGate(prev, gateMatrix(gate), qubit));
      setActivePresetId(null);
      setLastMeasurement(null);
      setNarration(gateNarration(gate, qubit));
    },
    [disabled]
  );

  const applyCnotAction = useCallback(() => {
    if (disabled) return;
    setState((prev) => applyCNOT(prev, 0, 1));
    setActivePresetId(null);
    setLastMeasurement(null);
    setNarration("Applied CNOT: qubit 0 is the control, qubit 1 is the target.");
  }, [disabled]);

  const applySwapAction = useCallback(() => {
    if (disabled) return;
    setState((prev) => applySwap(prev, 0, 1));
    setActivePresetId(null);
    setLastMeasurement(null);
    setNarration("Applied SWAP: qubit 0 and qubit 1 exchanged their values.");
  }, [disabled]);

  const initialize = useCallback(
    (id: InitId) => {
      if (disabled) return;
      let next: StateVector;
      let message: string;

      if (id === "00") {
        next = StateVector.zero(2);
        message = "Prepared |00⟩.";
      } else if (id === "01") {
        next = StateVector.basis(2, 0b01);
        message = "Prepared |01⟩.";
      } else if (id === "10") {
        next = StateVector.basis(2, 0b10);
        message = "Prepared |10⟩.";
      } else if (id === "11") {
        next = StateVector.basis(2, 0b11);
        message = "Prepared |11⟩.";
      } else if (id === "plus-plus") {
        const afterQ0 = applySingleQubitGate(StateVector.zero(2), gateMatrix("H"), 0);
        next = applySingleQubitGate(afterQ0, gateMatrix("H"), 1);
        message = "Prepared |++⟩: two independent superpositions, no entanglement.";
      } else {
        const afterH = applySingleQubitGate(StateVector.zero(2), gateMatrix("H"), 0);
        next = applyCNOT(afterH, 0, 1);
        message = "Prepared a Bell state: entangled.";
      }

      setState(next);
      setActivePresetId(null);
      setLastMeasurement(null);
      setNarration(message);
    },
    [disabled]
  );

  const measureQubitAction = useCallback(
    (qubit: 0 | 1) => {
      if (disabled) return;
      const result = measureQubit(state, qubit);
      setState(result.collapsed);
      setActivePresetId(null);
      setLastMeasurement(`Measured qubit ${qubit} → ${result.outcome}`);
      setNarration(
        `Measured qubit ${qubit}: got ${result.outcome} (probability was ${Math.round(result.probability * 100)}%). The state has collapsed: this was an instantaneous event, not a smooth transition.`
      );
      // Resolve only when the measured state really is the Bell preparation
      // the question describes (freshly mounted, or after re-running the
      // "bell" walkthrough); measuring some other state the visitor built
      // should not grade this prediction.
      if (qubit === 0 && predictOutcomeId === null && activePresetId === "bell") {
        // Resolve the "measure qubit 0 only" prediction from the real
        // post-measurement state: read qubit 1's marginal off the collapsed
        // state's Born-rule probabilities (qubit 1 is the low bit of the
        // basis index) and see whether it is now certain, and of what.
        const probabilities = result.collapsed.probabilities();
        const pQubit1IsOne = probabilities.reduce((sum, p, index) => ((index & 1) === 1 ? sum + p : sum), 0);
        const qubit1Fixed = pQubit1IsOne > 0.999 || pQubit1IsOne < 0.001;
        const qubit1Value = pQubit1IsOne > 0.5 ? 1 : 0;
        setPredictOutcomeId(
          !qubit1Fixed ? "unchanged" : qubit1Value === result.outcome ? "fixed-match" : "fixed-opposite"
        );
      }
    },
    [disabled, state, predictOutcomeId, activePresetId]
  );

  const measureBothAction = useCallback(() => {
    if (disabled) return;
    const { outcome, collapsed } = measure(state);
    setState(collapsed);
    setActivePresetId(null);
    setLastMeasurement(`Measured both qubits → ${outcome.label}`);
    setNarration(
      `Measured both qubits at once: got |${outcome.label}⟩ (probability was ${Math.round(outcome.probability * 100)}%).`
    );
  }, [disabled, state]);

  const reset = useCallback(() => {
    initialize("00");
  }, [initialize]);

  const runPreset = useCallback(
    async (presetId: string) => {
      if (disabled) return;
      const preset = GUIDED_PRESETS.find((p) => p.id === presetId);
      if (!preset) return;

      setIsRunning(true);
      setActivePresetId(presetId);
      setLastMeasurement(null);
      setNarration(preset.description);
      await delay(STEP_DELAY_MS);
      if (cancelledRef.current) return;

      let current = StateVector.zero(2);
      for (const step of preset.steps) {
        if (step.kind === "reset") {
          current = StateVector.zero(2);
          setState(current);
        } else if (step.kind === "gate") {
          current = applySingleQubitGate(current, gateMatrix(step.gate), step.qubit);
          setState(current);
          setNarration(gateNarration(step.gate, step.qubit));
        } else if (step.kind === "cnot") {
          current = applyCNOT(current, 0, 1);
          setState(current);
          setNarration("Applied CNOT: qubit 0 is the control, qubit 1 is the target.");
        } else {
          const result = measureQubit(current, step.qubit);
          current = result.collapsed;
          setState(current);
          setLastMeasurement(`Measured qubit ${step.qubit} → ${result.outcome}`);
          setNarration(`Measured qubit ${step.qubit}: got ${result.outcome}.`);
        }

        await delay(STEP_DELAY_MS);
        if (cancelledRef.current) return;
      }

      if (preset.result) setNarration(preset.result);
      setIsRunning(false);
    },
    [disabled]
  );

  return (
    <SimulatorInstrument
      label="Two-qubit states: entanglement"
      footnote="Next: try building the same Bell state gate-by-gate in the Circuit Builder."
      stageClassName="space-y-6"
      stage={
        <>
          {/* Lightly trimmed: the independent-vs-entangled definition below
              in `SimulatorFraming`'s "What this shows" restates the opening
              clause here, so "genuinely" and the parenthetical drop. The
              non-locality clarification (nothing travels) and the closing
              pointer to the table stay: the second is referenced by name
              in the comment on `CorrelationView` below, so its wording is
              kept exact. */}
          <p className="text-sm text-muted-foreground">
            Two qubits can be independent, knowing one tells you nothing about the other, or{" "}
            <em>entangled</em>, where neither has a state of its own and measuring one instantly fixes the
            other. Nothing travels between them: the correlation was always in the pair. The correlation
            table below is where the difference shows up.
          </p>

          <div
            aria-live="polite"
            className="rounded-panel border border-pillar/25 bg-pillar/5 px-4 py-3 text-sm text-foreground"
          >
            {narration}
            {lastMeasurement ? (
              <span className="mt-1 block font-mono text-xs text-pillar">{lastMeasurement}</span>
            ) : null}
          </div>

          {/* The correlation table first, then the panels that decompose it.
              The instrument's own intro says "the correlation table below is
              where the difference shows up", and it was the fourth thing
              below: a prediction quiz and two numeric panels stood between
              the reader and the one picture that answers the question. */}
          <CorrelationView state={state} />
        </>
      }
      stageAfter={
        <>
          <Predict
            question="The pair starts in a Bell state. Measure qubit 0 only. What can you then say about qubit 1?"
            options={[
              { id: "unchanged", label: "Nothing new; it stays 50/50" },
              { id: "fixed-match", label: "It is now certain, and matches qubit 0" },
              { id: "fixed-opposite", label: "It is now certain, and opposite to qubit 0" },
            ]}
            outcomeId={predictOutcomeId}
          />

          <StatePanel state={state} />
          <ReducedStatesPanel state={state} />

          <SimulatorFraming
            shows="Whether two qubits act independently or become entangled: correlated in a way no classical coin pair can be."
            watchFor="Initialize |++⟩ and the correlation table shows all four outcomes at 25%: independent. Build a Bell state and only the diagonal survives: same 50/50 odds per qubit, but the two now always agree."
            tryThis="Run the Bell-state guided preset, then measure qubit 0. Notice qubit 1's outcome is now fixed too, even though you never touched it."
          />
        </>
      }
      controls={
        <div className="space-y-8">
          <OperationControls
            disabled={disabled}
            targetQubit={targetQubit}
            onTargetQubitChange={setTargetQubit}
            onInitialize={initialize}
            onApplyGate={applyGate}
            onCnot={applyCnotAction}
            onSwap={applySwapAction}
            onPreset={runPreset}
            activePresetId={activePresetId}
          />
          <MeasurementPanel
            disabled={disabled}
            onMeasureQubit={measureQubitAction}
            onMeasureBoth={measureBothAction}
            onReset={reset}
          />
        </div>
      }
    />
  );
}
