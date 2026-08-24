import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { SINGLE_QUBIT_GATES, type SingleQubitGateId } from "./gateDefinitions";
import { GUIDED_PRESETS } from "./presets";

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
      <section aria-labelledby="presets-heading">
        <h3 id="presets-heading" className="text-sm font-semibold text-foreground">
          Guided walkthrough
        </h3>
        <div role="radiogroup" aria-label="Guided walkthrough" className="mt-3 flex flex-col gap-2">
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
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                "disabled:pointer-events-none disabled:opacity-50",
                activePresetId === preset.id
                  ? "border-brand/40 bg-brand/5 text-foreground"
                  : "border-border bg-surface text-foreground hover:bg-surface-muted"
              )}
            >
              <span className="font-medium">{preset.title}</span>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="init-heading">
        <h3 id="init-heading" className="text-sm font-semibold text-foreground">
          Initialize
        </h3>
        <div className="mt-3 grid grid-cols-3 gap-2">
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
      </section>

      <section aria-labelledby="gates-heading">
        <div className="flex items-center justify-between">
          <h3 id="gates-heading" className="text-sm font-semibold text-foreground">
            Apply a gate
          </h3>
          <div role="radiogroup" aria-label="Target qubit" className="flex overflow-hidden rounded-full border border-border">
            {([0, 1] as const).map((qubit) => (
              <button
                key={qubit}
                type="button"
                role="radio"
                aria-checked={targetQubit === qubit}
                disabled={disabled}
                onClick={() => onTargetQubitChange(qubit)}
                className={cn(
                  "px-2.5 py-1 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
                  targetQubit === qubit
                    ? "bg-brand text-brand-foreground"
                    : "bg-surface text-muted-foreground hover:bg-surface-muted"
                )}
              >
                q{qubit}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Single-qubit gates below apply to the selected target.
        </p>
        <div className="mt-3 grid grid-cols-6 gap-2">
          {SINGLE_QUBIT_GATES.map((gate) => (
            <button
              key={gate.id}
              type="button"
              disabled={disabled}
              title={gate.explanation}
              onClick={() => onApplyGate(gate.id, targetQubit)}
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

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" disabled={disabled} onClick={onCnot}>
            CNOT (q0 → q1)
          </Button>
          <Button variant="secondary" size="sm" disabled={disabled} onClick={onSwap}>
            SWAP
          </Button>
        </div>
      </section>
    </div>
  );
}
