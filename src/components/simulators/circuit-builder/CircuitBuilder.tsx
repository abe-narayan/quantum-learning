"use client";

import { useMemo, useState } from "react";
import { runInstructions, type GateInstruction } from "@/lib/quantum/circuitBuilder";
import type { SingleQubitGateName, TwoQubitGateName } from "@/lib/quantum/circuitBuilder";
import { Badge } from "@/components/ui/Badge";
import { FrameSlider } from "@/components/visualizations/FrameSlider";
import { CircuitDiagram } from "./CircuitDiagram";
import { GateControls } from "./GateControls";
import { StateInspector } from "./StateInspector";
import { isFullyProductState } from "./separability";

const DEFAULT_WHAT_TO_NOTICE =
  "Watch the StateInspector panel below — the moment the state stops being writable as a simple product of two separate qubits is the moment CNOT actually did something CNOT-specific.";

export function CircuitBuilder() {
  const [numQubits, setNumQubits] = useState(2);
  const [instructions, setInstructions] = useState<GateInstruction[]>([]);
  const [step, setStep] = useState(0);
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
    <div className="not-prose grid gap-6 rounded-3xl border border-border bg-surface p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
      <div className="space-y-6">
        <div>
          <Badge tone="brand" className="mb-1.5">
            What we&rsquo;re studying
          </Badge>
          <p className="text-sm text-muted-foreground">
            The same build-then-run workflow real quantum SDKs use: stack gates, then scrub through the
            step slider to see the state vector evolve one gate at a time.
          </p>
        </div>

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

        <div aria-live="polite" className="rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
          {entanglementNote ?? DEFAULT_WHAT_TO_NOTICE}
        </div>

        <StateInspector state={state} />

        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Try this</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-foreground">
            <li>
              On 2 qubits: add H to qubit 0, then CNOT(0→1) — scrub the step slider back and forth and
              watch the state go from a simple product state to an entangled one at the CNOT step.
            </li>
            <li>On 3 qubits, build a GHZ state: H on qubit 0, then CNOT(0→1), then CNOT(0→2).</li>
          </ul>
        </div>
      </div>

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
    </div>
  );
}
