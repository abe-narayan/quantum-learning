import { Button } from "@/components/ui/Button";
import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { cn } from "@/lib/utils";
import { SINGLE_QUBIT_GATES, type SingleQubitGateId } from "./gateDefinitions";
import { GUIDED_PRESETS } from "./presets";
import { ControlSection } from "../shared/controls";

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
  return (
    <div className="space-y-8">
      <ControlSection id="presets" title="Guided walkthrough">
        {/*
          Hand-rolled rather than <PillGroup>: selecting an option here doesn't just
          swap a value, it kicks off `runPreset`'s own async, cancellable, multi-step
          animation (see TwoQubitExplorer's `isRunning`/`cancelledRef`) that narrates and
          disables the whole panel step-by-step. PillGroup has no notion of a
          disabled/in-progress option, so it can't represent "this preset is currently
          animating" or block re-selection while one runs.
        */}
        <div role="radiogroup" aria-label="Guided walkthrough" className="flex flex-col gap-2">
          {GUIDED_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              role="radio"
              aria-checked={activePresetId === preset.id}
              disabled={disabled}
              onClick={() => onPreset(preset.id)}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
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

      <ControlSection id="init" title="Initialize">
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
      </ControlSection>
    </div>
  );
}
