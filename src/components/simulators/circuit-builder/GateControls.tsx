import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { SINGLE_QUBIT_GATE_OPTIONS, TWO_QUBIT_GATE_OPTIONS } from "./gateDefinitions";
import type { SingleQubitGateName, TwoQubitGateName } from "@/lib/quantum/circuitBuilder";

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
  onRemoveLast: () => void;
  onClear: () => void;
  canRemove: boolean;
}) {
  const qubitIds = Array.from({ length: numQubits }, (_, i) => i);

  return (
    <div className="space-y-8">
      <section aria-labelledby="qubit-count-heading">
        <h3 id="qubit-count-heading" className="text-sm font-semibold text-foreground">
          Qubits
        </h3>
        <div role="radiogroup" aria-label="Number of qubits" className="mt-3 flex overflow-hidden rounded-full border border-border">
          {[2, 3].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={numQubits === n}
              disabled={disabled}
              onClick={() => onNumQubitsChange(n)}
              className={cn(
                "flex-1 px-3 py-1.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
                numQubits === n ? "bg-brand text-brand-foreground" : "bg-surface text-muted-foreground hover:bg-surface-muted"
              )}
            >
              {n} qubits
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Changing this clears the circuit.</p>
      </section>

      <section aria-labelledby="single-gate-heading">
        <div className="flex items-center justify-between">
          <h3 id="single-gate-heading" className="text-sm font-semibold text-foreground">
            Single-qubit gate
          </h3>
          <div role="radiogroup" aria-label="Target qubit" className="flex overflow-hidden rounded-full border border-border">
            {qubitIds.map((q) => (
              <button
                key={q}
                type="button"
                role="radio"
                aria-checked={targetQubit === q}
                disabled={disabled}
                onClick={() => onTargetQubitChange(q)}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
                  targetQubit === q ? "bg-brand text-brand-foreground" : "bg-surface text-muted-foreground hover:bg-surface-muted"
                )}
              >
                q{q}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 grid grid-cols-6 gap-2">
          {SINGLE_QUBIT_GATE_OPTIONS.map((gate) => (
            <button
              key={gate.id}
              type="button"
              disabled={disabled}
              title={gate.explanation}
              onClick={() => onApplySingleQubitGate(gate.id, targetQubit)}
              className={cn(
                "flex h-10 items-center justify-center rounded-lg border border-border bg-surface text-sm font-semibold text-foreground transition-colors",
                "hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              {gate.label}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="two-gate-heading">
        <h3 id="two-gate-heading" className="text-sm font-semibold text-foreground">
          Two-qubit gate
        </h3>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <label className="flex items-center gap-1.5">
            Control
            <select
              value={controlQubit}
              disabled={disabled}
              onChange={(e) => onControlQubitChange(Number(e.target.value))}
              className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-foreground"
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
              className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-foreground"
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
      </section>

      <section aria-labelledby="edit-heading" className="flex flex-wrap gap-2">
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
