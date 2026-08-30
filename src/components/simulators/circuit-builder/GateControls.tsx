import { Button } from "@/components/ui/Button";
import { SINGLE_QUBIT_GATE_OPTIONS, TWO_QUBIT_GATE_OPTIONS } from "./gateDefinitions";
import type { SingleQubitGateName, TwoQubitGateName } from "@/lib/quantum/circuitBuilder";
import { ControlSection, PillGroup, SymbolGloss } from "../shared/controls";

/**
 * A fixed id rather than `useId()`: only one CircuitBuilder is ever mounted
 * per page (it is the whole instrument, not a repeatable widget), and a
 * stable literal keeps the `aria-describedby` wiring readable at both ends.
 */
const SAME_QUBIT_WARNING_ID = "circuit-builder-same-qubit-warning";

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
  onLoadBellCircuit,
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
  /** Restores the two-qubit H + CNOT circuit the instrument mounts with. */
  onLoadBellCircuit: () => void;
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
        {/* `@sm:` is a container query on the controls rail's own box, not the
            viewport; see SimulatorInstrument.tsx. */}
        <div className="mt-3 grid grid-cols-4 gap-2 @sm:grid-cols-6">
          {SINGLE_QUBIT_GATE_OPTIONS.map((gate) => (
            <Button
              key={gate.id}
              variant="secondary"
              size="sm"
              disabled={disabled}
              title={gate.explanation}
              // The visible label is a single letter, and `title` supplies
              // only the accessible *description*, which many screen readers
              // do not announce. Without this the row reads as six bare
              // letters with no indication of what pressing one does, or
              // which wire it lands on.
              aria-label={`Add ${gate.label} gate to qubit ${targetQubit}`}
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
            title="Marks this wire as measured at this point in the circuit (a diagram annotation, so it doesn't change the simulated state)."
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
              // `text-base` below `sm`, matching the Grover and period-finding
              // selects: these inherit `text-xs` from the wrapping row, and
              // iOS Safari zooms the whole page in whenever a form control
              // smaller than 16px takes focus, so picking a control qubit on
              // a phone yanked the layout sideways. The desktop size is
              // unchanged.
              className="min-h-11 rounded-(--radius-tight) border border-border bg-surface px-2 py-1 font-mono text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-xs"
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
              // `text-base` below `sm`, matching the Grover and period-finding
              // selects: these inherit `text-xs` from the wrapping row, and
              // iOS Safari zooms the whole page in whenever a form control
              // smaller than 16px takes focus, so picking a control qubit on
              // a phone yanked the layout sideways. The desktop size is
              // unchanged.
              className="min-h-11 rounded-(--radius-tight) border border-border bg-surface px-2 py-1 font-mono text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-xs"
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
            // The `title` lives on the wrapper, not the Button: a disabled
            // button receives no pointer events, so a tooltip attached to it
            // would vanish exactly when the reader most wants to know what the
            // gate is. The wrapper still hovers.
            <span key={gate.id} title={gate.explanation}>
              <Button
                variant="secondary"
                size="sm"
                disabled={disabled || controlQubit === twoQubitTarget}
                aria-label={`Add ${gate.label} gate with control qubit ${controlQubit} and target qubit ${twoQubitTarget}`}
                // Points at the warning below whenever these buttons are
                // greyed out for the same-qubit reason. Without it, a screen
                // reader announced "dimmed" with no explanation anywhere in
                // the control's own name or description; the sighted reader
                // gets the sentence right underneath, and now so does everyone.
                aria-describedby={
                  controlQubit === twoQubitTarget ? SAME_QUBIT_WARNING_ID : undefined
                }
                onClick={() => onApplyTwoQubitGate(gate.id, controlQubit, twoQubitTarget)}
              >
                {gate.label}
              </Button>
            </span>
          ))}
        </div>
        {controlQubit === twoQubitTarget && (
          <p id={SAME_QUBIT_WARNING_ID} className="mt-1 text-xs text-warning">
            Control and target must be different qubits.
          </p>
        )}
        <SymbolGloss
          items={[
            {
              symbol: "ctrl",
              name: "control qubit",
              means:
                "the qubit that decides. It is never changed by the gate; it only determines whether the target is.",
              glossaryId: "cnot-controlled-gates",
            },
            {
              symbol: "CNOT",
              name: "controlled-NOT",
              means:
                "flip the target, but only where the control is 1. Applied to a control already in superposition, it is how two qubits become entangled. This is the gate that does it.",
              glossaryId: "cnot-controlled-gates",
            },
          ]}
        />
      </ControlSection>

      <section aria-labelledby="edit-heading" className="flex flex-wrap gap-2">
        <h3 id="edit-heading" className="sr-only">
          Edit circuit
        </h3>
        {/*
          `aria-disabled` rather than the native `disabled` prop on both of
          these. They disable themselves *as the direct result of being
          pressed*: Clear empties the circuit and Remove-last on a one-gate
          circuit empties it too, and an empty circuit is exactly the
          `!canRemove` condition that greys them out. A natively-disabled
          button stops being focusable while it currently holds focus, so a
          keyboard reader who pressed Clear had focus dropped to <body> by
          their own keystroke and their next Tab restarted from the top of the
          page rather than continuing to the Restore control sitting right
          beside it, the one control that undoes what they just did.

          `aria-disabled` announces the same "dimmed, unavailable" state while
          keeping the element focusable, so focus stays put and Tab still
          reaches Restore. The handlers are guarded here rather than in the
          parent because `canRemove` is the parent's own derived state and
          re-deriving it there would be a second source of truth;
          `aria-disabled:pointer-events-none` reproduces `disabled`'s
          dead-to-the-mouse behaviour, and `aria-disabled:opacity-50` matches
          the `disabled:opacity-50` already in `Button`'s base classes.
        */}
        <Button
          variant="secondary"
          size="sm"
          aria-disabled={disabled || !canRemove}
          className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
          onClick={() => {
            if (disabled || !canRemove) return;
            onRemoveLast();
          }}
        >
          Remove last gate
        </Button>
        <Button
          variant="ghost"
          size="sm"
          aria-disabled={disabled || !canRemove}
          className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
          onClick={() => {
            if (disabled || !canRemove) return;
            onClear();
          }}
        >
          Clear circuit
        </Button>
        {/*
          The instrument mounts with the H + CNOT Bell circuit already built,
          and until now Clear was a one-way door: once emptied there was no
          control anywhere that put the reference circuit back, so the reader
          who cleared it to experiment lost the example the surrounding lesson
          prose keeps referring to. Never disabled; its whole job is to be
          available from any state, including the empty one and a 3-qubit
          circuit (it returns to 2 qubits).
        */}
        <Button variant="secondary" size="sm" disabled={disabled} onClick={onLoadBellCircuit}>
          Load Bell circuit
        </Button>
      </section>
    </div>
  );
}
