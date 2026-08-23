"use client";

import { useMemo, useState } from "react";
import { runInstructions, type GateInstruction } from "@/lib/quantum/circuitBuilder";
import type { SingleQubitGateName, TwoQubitGateName } from "@/lib/quantum/circuitBuilder";
import { CircuitDiagram } from "./CircuitDiagram";
import { GateControls } from "./GateControls";
import { StateInspector } from "./StateInspector";

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
        <CircuitDiagram numQubits={numQubits} instructions={instructions} step={step} onSelectStep={setStep} />

        {instructions.length > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted/40 px-4 py-3">
            <span className="text-xs font-medium text-muted-foreground">Step</span>
            <input
              type="range"
              min={0}
              max={instructions.length}
              value={step}
              onChange={(e) => setStep(Number(e.target.value))}
              className="flex-1 accent-brand"
              aria-label="Circuit step"
            />
            <span className="w-16 text-right font-mono text-xs text-muted-foreground">
              {step} / {instructions.length}
            </span>
          </div>
        )}

        <StateInspector state={state} />
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
        onRemoveLast={handleRemoveLast}
        onClear={handleClear}
        canRemove={instructions.length > 0}
      />
    </div>
  );
}
