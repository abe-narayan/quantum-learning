"use client";

import { useMemo, useState } from "react";
import { runInstructions, type GateInstruction } from "@/lib/quantum/circuitBuilder";
import type { SingleQubitGateName, TwoQubitGateName } from "@/lib/quantum/circuitBuilder";
import { FrameSlider } from "@/components/visualizations/FrameSlider";
import { Readout } from "@/components/ui/Typography";
import { CircuitDiagram } from "./CircuitDiagram";
import { GateControls } from "./GateControls";
import { StateInspector } from "./StateInspector";
import { isFullyProductState } from "./separability";
import { SimulatorInstrument } from "../shared/SimulatorInstrument";
import { SimulatorFraming } from "../shared/Framing";

const DEFAULT_WHAT_TO_NOTICE =
  "Watch the StateInspector panel below — the moment the state stops being writable as a simple product of two separate qubits is the moment CNOT actually did something CNOT-specific.";

/**
 * The canonical two-gate Bell circuit, loaded on mount. An empty canvas is
 * technically a valid starting point and teaches nothing: the diagram is
 * blank, the step slider is absent, and the state inspector shows |00⟩ with
 * nothing to inspect. Opening with H then CNOT already applied means the
 * instrument mounts showing a real entangled state, a scrubable two-step
 * history, and the live "this step just entangled qubits 0 and 1" note — per
 * the bench's "open mid-phenomenon" rule. Clear empties it in one click for
 * anyone who wants to build from scratch, and switching the qubit count
 * (which the lessons' GHZ exercise does) resets to empty anyway.
 */
const STARTING_CIRCUIT: GateInstruction[] = [
  { gate: "H", targets: [0] },
  { gate: "CNOT", targets: [0, 1] },
];

export function CircuitBuilder() {
  const [numQubits, setNumQubits] = useState(2);
  const [instructions, setInstructions] = useState<GateInstruction[]>(STARTING_CIRCUIT);
  const [step, setStep] = useState(STARTING_CIRCUIT.length);
  const [targetQubit, setTargetQubit] = useState(0);
  const [controlQubit, setControlQubit] = useState(0);
  const [twoQubitTarget, setTwoQubitTarget] = useState(1);

  const state = useMemo(
    () => runInstructions(numQubits, instructions.slice(0, step)),
    [numQubits, instructions, step]
  );

  const previousState = useMemo(
    () => runInstructions(numQubits, instructions.slice(0, Math.max(0, step - 1))),
    [numQubits, instructions, step]
  );

  // If the gate that just ran (at this step) turned a fully-product state
  // into an entangled one, name the qubits it entangled — a concrete,
  // step-specific payoff on top of the static "what to notice" copy.
  const entanglementNote = useMemo(() => {
    const appliedInstruction = step > 0 ? instructions[step - 1] : undefined;
    if (!appliedInstruction || appliedInstruction.targets.length !== 2) return null;
    if (!isFullyProductState(previousState) || isFullyProductState(state)) return null;
    const [a, b] = appliedInstruction.targets;
    return `This step just entangled qubits ${a} and ${b}.`;
  }, [step, instructions, previousState, state]);

  const handleNumQubitsChange = (n: number) => {
    setNumQubits(n);
    setInstructions([]);
    setStep(0);
    setTargetQubit(0);
    setControlQubit(0);
    setTwoQubitTarget(1);
  };

  const handleApplySingleQubitGate = (gate: SingleQubitGateName, target: number) => {
    const next: GateInstruction[] = [...instructions, { gate, targets: [target] }];
    setInstructions(next);
    setStep(next.length);
  };

  const handleApplyTwoQubitGate = (gate: TwoQubitGateName, control: number, target: number) => {
    if (control === target) return;
    const next: GateInstruction[] = [...instructions, { gate, targets: [control, target] }];
    setInstructions(next);
    setStep(next.length);
  };

  const handleApplyMeasurement = (target: number) => {
    const next: GateInstruction[] = [...instructions, { gate: "MEASURE", targets: [target] }];
    setInstructions(next);
    setStep(next.length);
  };

  const handleRemoveLast = () => {
    const next = instructions.slice(0, -1);
    setInstructions(next);
    setStep((s) => Math.min(s, next.length));
  };

  const handleClear = () => {
    setInstructions([]);
    setStep(0);
  };

  return (
    <SimulatorInstrument
      label="Circuit builder — build then run"
      readout={<Readout label="Step" value={`${step} / ${instructions.length}`} />}
      // The diagram widens with every qubit/gate added; splitting it against
      // a 320px control rail (even once there's technically room per the
      // container query) leaves less width for it than it can use. Full-width
      // stage, controls in a band underneath — see SimulatorInstrument.tsx.
      layout="stacked"
      stageClassName="space-y-6"
      stage={
        <>
          <p className="text-sm text-muted-foreground">
            A quantum circuit is read left to right: each horizontal line is one qubit, and each box is an
            operation applied to it. Loaded here is the two-gate circuit that produces a Bell pair — the
            standard way to entangle two qubits. Drag the step slider to run it forwards and backwards, add
            your own gates from the controls, or Clear and start from nothing.
          </p>

          <CircuitDiagram numQubits={numQubits} instructions={instructions} step={step} onSelectStep={setStep} />

          {instructions.length > 0 && (
            <FrameSlider
              label="Step"
              valueLabel={`${step} / ${instructions.length}`}
              index={step}
              max={instructions.length}
              onChange={setStep}
            />
          )}

          <div aria-live="polite" className="rounded-xl border border-pillar/25 bg-pillar/5 px-4 py-3 text-sm text-foreground">
            {entanglementNote ?? DEFAULT_WHAT_TO_NOTICE}
          </div>

          <StateInspector state={state} />

          <SimulatorFraming
            shows="The same build-then-run workflow real quantum SDKs use: stack gates, then scrub through the step slider to see the state vector evolve one gate at a time."
            watchFor="Scrub the step slider back to 1. After H alone, the state inspector still calls this a product state — H on one qubit cannot entangle anything. Only the CNOT at step 2 flips that verdict."
            tryThis={
              <ul>
                <li>
                  On 2 qubits: add H to qubit 0, then CNOT(0→1) — scrub the step slider back and forth and
                  watch the state go from a simple product state to an entangled one at the CNOT step.
                </li>
                <li>On 3 qubits, build a GHZ state: H on qubit 0, then CNOT(0→1), then CNOT(0→2).</li>
              </ul>
            }
          />
        </>
      }
      controls={
        <GateControls
          disabled={false}
          numQubits={numQubits}
          onNumQubitsChange={handleNumQubitsChange}
          targetQubit={targetQubit}
          onTargetQubitChange={setTargetQubit}
          controlQubit={controlQubit}
          onControlQubitChange={setControlQubit}
          twoQubitTarget={twoQubitTarget}
          onTwoQubitTargetChange={setTwoQubitTarget}
          onApplySingleQubitGate={handleApplySingleQubitGate}
          onApplyTwoQubitGate={handleApplyTwoQubitGate}
          onApplyMeasurement={handleApplyMeasurement}
          onRemoveLast={handleRemoveLast}
          onClear={handleClear}
          canRemove={instructions.length > 0}
        />
      }
    />
  );
}
