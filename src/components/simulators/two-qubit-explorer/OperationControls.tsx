import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { cn } from "@/lib/utils";
import { SINGLE_QUBIT_GATES, type SingleQubitGateId } from "./gateDefinitions";
import { GUIDED_PRESETS } from "./presets";
import { ControlSection, SymbolGloss } from "../shared/controls";

const TARGET_QUBIT_OPTIONS = ([0, 1] as const).map((qubit) => ({ qubit, label: `q${qubit}` }));

export type InitId = "00" | "01" | "10" | "11" | "plus-plus" | "bell";

const INIT_OPTIONS: { id: InitId; label: string }[] = [
  { id: "00", label: "|00⟩" },
  { id: "01", label: "|01⟩" },
  { id: "10", label: "|10⟩" },
  { id: "11", label: "|11⟩" },
  { id: "plus-plus", label: "|++⟩" },
  { id: "bell", label: "Bell" },
];

export function OperationControls({
  disabled,
  targetQubit,
  onTargetQubitChange,
  onInitialize,
  onApplyGate,
  onCnot,
  onSwap,
  onPreset,
  activePresetId,
}: {
  disabled: boolean;
  targetQubit: 0 | 1;
  onTargetQubitChange: (qubit: 0 | 1) => void;
  onInitialize: (id: InitId) => void;
  onApplyGate: (gate: SingleQubitGateId, qubit: 0 | 1) => void;
  onCnot: () => void;
  onSwap: () => void;
  onPreset: (presetId: string) => void;
  activePresetId: string | null;
}) {
  // Roving tabindex for the guided-walkthrough radiogroup, ported verbatim
  // from `shared/controls.tsx`'s PillGroup rather than reinvented, so the two
  // radiogroups a visitor meets inside the same instrument behave identically
  // under the keyboard. Without this the group put all six presets in the Tab
  // order and answered no arrow key at all, which is the one thing a screen
  // reader user is promised when a control announces itself as a radio.
  const presetRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedPresetIndex = GUIDED_PRESETS.findIndex((preset) => preset.id === activePresetId);

  const handlePresetKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    // While a walkthrough animates, every option is `disabled` and selecting a
    // new one is refused by `runPreset` anyway — moving focus-and-selection
    // here would lie about what the panel is doing, so bail out entirely.
    if (disabled) return;
    const count = GUIDED_PRESETS.length;
    if (count === 0) return;

    let delta = 0;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") delta = 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") delta = -1;
    else return;

    event.preventDefault();
    const current = selectedPresetIndex === -1 ? 0 : selectedPresetIndex;
    const nextIndex = (current + delta + count) % count;
    onPreset(GUIDED_PRESETS[nextIndex].id);
    presetRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="space-y-8">
      <ControlSection id="presets" title="Guided walkthrough">
        {/*
          Hand-rolled rather than <PillGroup>: selecting an option here doesn't just
          swap a value, it kicks off `runPreset`'s own async, cancellable, multi-step
          animation (see TwoQubitExplorer's `isRunning`/`cancelledRef`) that narrates and
          disables the whole panel step-by-step. PillGroup has no notion of a
          disabled/in-progress option, so it can't represent "this preset is currently
          animating" or block re-selection while one runs. The keyboard behaviour is
          still PillGroup's, ported above — hand-rolling the styling is not a licence
          to hand-roll the ARIA pattern.
        */}
        <div role="radiogroup" aria-label="Guided walkthrough" className="flex flex-col gap-2">
          {GUIDED_PRESETS.map((preset, i) => (
            <button
              key={preset.id}
              ref={(el) => {
                presetRefs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={activePresetId === preset.id}
              // Only the selected option is tabbable; with nothing selected
              // (the visitor has driven the gates by hand) the first option
              // holds the group's single tab stop, per the ARIA APG pattern.
              tabIndex={i === selectedPresetIndex || (selectedPresetIndex === -1 && i === 0) ? 0 : -1}
              disabled={disabled}
              onClick={() => onPreset(preset.id)}
              onKeyDown={handlePresetKeyDown}
              className={cn(
                // `min-h-11` rather than the previous bare `py-2` (36px total):
                // these are the widest tap targets in the rail and sit stacked
                // 8px apart, so a thumb that missed one used to land on its
                // neighbour and start a different walkthrough.
                "flex min-h-11 items-center rounded-(--radius-tight) border px-3 py-2 text-left text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar",
                "disabled:pointer-events-none disabled:opacity-50",
                activePresetId === preset.id
                  ? "border-pillar/40 bg-pillar/5 text-foreground"
                  : "border-border bg-surface text-foreground hover:bg-surface-muted"
              )}
            >
              <span className="font-medium">{preset.title}</span>
            </button>
          ))}
        </div>
      </ControlSection>

      <ControlSection
        id="init"
        title="Initialize"
        description="Jump straight to a starting state. |00⟩ through |11⟩ are the four definite ones; |++⟩ is two independent coin flips; Bell is the entangled pair."
      >
        <div className="grid grid-cols-3 gap-2">
          {INIT_OPTIONS.map((option) => (
            <Button
              key={option.id}
              variant="secondary"
              size="sm"
              disabled={disabled}
              onClick={() => onInitialize(option.id)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </ControlSection>

      <ControlSection id="gates" title="Apply a gate" description="Single-qubit gates below apply to the selected target.">
        <div className="flex items-center justify-end">
          <PresetToggle
            options={TARGET_QUBIT_OPTIONS}
            index={TARGET_QUBIT_OPTIONS.findIndex((option) => option.qubit === targetQubit)}
            onChange={(i) => onTargetQubitChange(TARGET_QUBIT_OPTIONS[i].qubit)}
            ariaLabel="Target qubit"
            disabled={disabled}
          />
        </div>
        {/* `@sm:` — container query on the controls rail's own box, not the
            viewport; see SimulatorInstrument.tsx. */}
        <div className="mt-3 grid grid-cols-4 gap-2 @sm:grid-cols-6">
          {SINGLE_QUBIT_GATES.map((gate) => (
            <Button
              key={gate.id}
              variant="secondary"
              size="sm"
              disabled={disabled}
              title={gate.explanation}
              onClick={() => onApplyGate(gate.id, targetQubit)}
              className="h-10"
            >
              {gate.label}
            </Button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" disabled={disabled} onClick={onCnot}>
            CNOT (q0 → q1)
          </Button>
          <Button variant="secondary" size="sm" disabled={disabled} onClick={onSwap}>
            SWAP
          </Button>
        </div>

        <SymbolGloss
          items={[
            {
              symbol: "|00⟩",
              name: "ket notation",
              means:
                "just a label for a state — |01⟩ means “qubit 0 is 0 and qubit 1 is 1”. The bracket carries no maths of its own; it only says “this is a quantum state”.",
              glossaryId: "dirac-notation",
            },
            {
              symbol: "H",
              name: "Hadamard",
              means:
                "puts one qubit into an even superposition of 0 and 1. On its own it cannot entangle anything — it only ever touches the one qubit you aim it at.",
              glossaryId: "hadamard-gate",
            },
            {
              symbol: "CNOT",
              name: "controlled-NOT",
              means:
                "flips qubit 1, but only where qubit 0 is 1. Apply it after H and the two qubits become entangled — this is the gate that does it.",
              glossaryId: "cnot-controlled-gates",
            },
          ]}
        />
      </ControlSection>
    </div>
  );
}
