import { Button } from "@/components/ui/Button";
import { SINGLE_QUBIT_GATE_OPTIONS, TWO_QUBIT_GATE_OPTIONS } from "./gateDefinitions";
import type { SingleQubitGateName, TwoQubitGateName } from "@/lib/quantum/circuitBuilder";
import { ControlSection, PillGroup, SymbolGloss } from "../shared/controls";

export function GateControls({
  disabled,
  numQubits,
  onNumQubitsChange,
  targetQubit,
  onTargetQubitChange,
  controlQubit,
  onControlQubitChange,
  twoQubitTarget,
  onTwoQubitTargetChange,
  onApplySingleQubitGate,
  onApplyTwoQubitGate,
  onApplyMeasurement,
  onRemoveLast,
  onClear,
  canRemove,
}: {
  disabled: boolean;
  numQubits: number;
  onNumQubitsChange: (n: number) => void;
  targetQubit: number;
  onTargetQubitChange: (q: number) => void;
  controlQubit: number;
  onControlQubitChange: (q: number) => void;
  twoQubitTarget: number;
  onTwoQubitTargetChange: (q: number) => void;
  onApplySingleQubitGate: (gate: SingleQubitGateName, target: number) => void;
  onApplyTwoQubitGate: (gate: TwoQubitGateName, control: number, target: number) => void;
  onApplyMeasurement: (target: number) => void;
  onRemoveLast: () => void;
  onClear: () => void;
  canRemove: boolean;
}) {
  const qubitIds = Array.from({ length: numQubits }, (_, i) => i);

  return (
    <div className="space-y-8">
      <ControlSection id="qubit-count" title="Qubits" description="Changing this clears the circuit.">
        <PillGroup
          label="Number of qubits"
          value={String(numQubits)}
          disabled={disabled}
          options={[2, 3].map((n) => ({ id: String(n), label: `${n} qubits` }))}
          onChange={(id) => onNumQubitsChange(Number(id))}
        />
      </ControlSection>

      <ControlSection id="single-gate" title="Single-qubit gate">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">Applies to the selected target</span>
          <PillGroup
            label="Target qubit"
            value={String(targetQubit)}
            disabled={disabled}
            options={qubitIds.map((q) => ({ id: String(q), label: `q${q}` }))}
            onChange={(id) => onTargetQubitChange(Number(id))}
          />
        </div>
        {/* `@sm:` — container query on the controls rail's own box, not the
            viewport; see SimulatorInstrument.tsx. */}
        <div className="mt-3 grid grid-cols-4 gap-2 @sm:grid-cols-6">
          {SINGLE_QUBIT_GATE_OPTIONS.map((gate) => (
            <Button
              key={gate.id}
              variant="secondary"
              size="sm"
              disabled={disabled}
              title={gate.explanation}
              onClick={() => onApplySingleQubitGate(gate.id, targetQubit)}
              className="h-10"
            >
              {gate.label}
            </Button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={disabled}
            title="Marks this wire as measured at this point in the circuit (a diagram annotation — it doesn't change the simulated state)."
            onClick={() => onApplyMeasurement(targetQubit)}
          >
            Measure q{targetQubit}
          </Button>
          <p className="text-xs text-muted-foreground">Adds a measurement marker to the diagram.</p>
        </div>
      </ControlSection>

      <ControlSection id="two-gate" title="Two-qubit gate">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <label className="flex items-center gap-1.5">
            Control
            <select
              value={controlQubit}
              disabled={disabled}
              onChange={(e) => onControlQubitChange(Number(e.target.value))}
              className="min-h-11 rounded-md border border-border bg-surface px-2 py-1 font-mono text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {qubitIds.map((q) => (
                <option key={q} value={q}>
                  q{q}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5">
            Target
            <select
              value={twoQubitTarget}
              disabled={disabled}
              onChange={(e) => onTwoQubitTargetChange(Number(e.target.value))}
              className="min-h-11 rounded-md border border-border bg-surface px-2 py-1 font-mono text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {qubitIds.map((q) => (
                <option key={q} value={q}>
                  q{q}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {TWO_QUBIT_GATE_OPTIONS.map((gate) => (
            <span key={gate.id} title={gate.explanation}>
              <Button
                variant="secondary"
                size="sm"
                disabled={disabled || controlQubit === twoQubitTarget}
                onClick={() => onApplyTwoQubitGate(gate.id, controlQubit, twoQubitTarget)}
              >
                {gate.label}
              </Button>
            </span>
          ))}
        </div>
        {controlQubit === twoQubitTarget && (
          <p className="mt-1 text-xs text-warning">Control and target must be different qubits.</p>
        )}
        <SymbolGloss
          items={[
            {
              symbol: "ctrl",
              name: "control qubit",
              means:
                "the qubit that decides. It is never changed by the gate — it only determines whether the target is.",
              glossaryId: "cnot-controlled-gates",
            },
            {
              symbol: "CNOT",
              name: "controlled-NOT",
              means:
                "flip the target, but only where the control is 1. Applied to a control already in superposition, it is how two qubits become entangled — this is the gate that does it.",
              glossaryId: "cnot-controlled-gates",
            },
          ]}
        />
      </ControlSection>

      <section aria-labelledby="edit-heading" className="flex flex-wrap gap-2">
        <h3 id="edit-heading" className="sr-only">
          Edit circuit
        </h3>
        <Button variant="secondary" size="sm" disabled={disabled || !canRemove} onClick={onRemoveLast}>
          Remove last gate
        </Button>
        <Button variant="ghost" size="sm" disabled={disabled || !canRemove} onClick={onClear}>
          Clear circuit
        </Button>
      </section>
    </div>
  );
}
