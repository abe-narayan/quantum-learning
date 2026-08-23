"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { StateVector } from "@/lib/quantum/state";
import { applySingleQubitGate, applyCNOT, applySwap } from "@/lib/quantum/gates";
import { measure, measureQubit } from "@/lib/quantum/measurement";
import { StatePanel } from "./StatePanel";
import { CorrelationView } from "./CorrelationView";
import { OperationControls, type InitId } from "./OperationControls";
import { MeasurementPanel } from "./MeasurementPanel";
import { SINGLE_QUBIT_GATES, type SingleQubitGateId } from "./gateDefinitions";
import { GUIDED_PRESETS } from "./presets";

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

export function TwoQubitExplorer() {
  const [state, setState] = useState<StateVector>(() => StateVector.zero(2));
  const [narration, setNarration] = useState("Starting state: |00⟩ — both qubits definitely 0.");
  const [activePresetId, setActivePresetId] = useState<string | null>("start");
  const [lastMeasurement, setLastMeasurement] = useState<string | null>(null);
  const [targetQubit, setTargetQubit] = useState<0 | 1>(0);
  const [isRunning, setIsRunning] = useState(false);

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
    setNarration("Applied CNOT — qubit 0 is the control, qubit 1 is the target.");
  }, [disabled]);

  const applySwapAction = useCallback(() => {
    if (disabled) return;
    setState((prev) => applySwap(prev, 0, 1));
    setActivePresetId(null);
    setLastMeasurement(null);
    setNarration("Applied SWAP — qubit 0 and qubit 1 exchanged their values.");
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
        message = "Prepared |++⟩ — two independent superpositions, no entanglement.";
      } else {
        const afterH = applySingleQubitGate(StateVector.zero(2), gateMatrix("H"), 0);
        next = applyCNOT(afterH, 0, 1);
        message = "Prepared a Bell state — entangled.";
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
        `Measured qubit ${qubit}: got ${result.outcome} (probability was ${Math.round(result.probability * 100)}%). The state has collapsed — this was an instantaneous event, not a smooth transition.`
      );
    },
    [disabled, state]
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
          setNarration("Applied CNOT — qubit 0 is the control, qubit 1 is the target.");
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
    <div className="not-prose grid gap-6 rounded-3xl border border-border bg-surface p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
      <div className="space-y-6">
        <div
          aria-live="polite"
          className="rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground"
        >
          {narration}
          {lastMeasurement ? (
            <span className="mt-1 block font-mono text-xs text-brand">{lastMeasurement}</span>
          ) : null}
        </div>

        <StatePanel state={state} />
        <CorrelationView state={state} />
      </div>

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
    </div>
  );
}
