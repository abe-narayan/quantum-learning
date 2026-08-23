import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { STATE_PRESETS } from "../bloch-sphere/presets";

export type ChannelType = "amplitude-damping" | "dephasing";

export function NoiseControls({
  presetId,
  onPresetChange,
  channel,
  onChannelChange,
  strength,
  onStrengthChange,
  steps,
  maxSteps,
  onStepsChange,
  onReset,
}: {
  presetId: string;
  onPresetChange: (id: string) => void;
  channel: ChannelType;
  onChannelChange: (channel: ChannelType) => void;
  strength: number;
  onStrengthChange: (v: number) => void;
  steps: number;
  maxSteps: number;
  onStepsChange: (n: number) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-8">
      <section aria-labelledby="noise-preset-heading">
        <h3 id="noise-preset-heading" className="text-sm font-semibold text-foreground">
          Starting state
        </h3>
        <div role="radiogroup" aria-label="Starting state" className="mt-3 flex flex-wrap gap-2">
          {STATE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              role="radio"
              aria-checked={presetId === preset.id}
              onClick={() => onPresetChange(preset.id)}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-sm transition-colors",
                presetId === preset.id
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border bg-surface text-muted-foreground hover:bg-surface-muted"
              )}
            >
              {preset.ket}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="noise-channel-heading">
        <h3 id="noise-channel-heading" className="text-sm font-semibold text-foreground">
          Noise channel
        </h3>
        <div role="radiogroup" aria-label="Noise channel" className="mt-3 flex overflow-hidden rounded-full border border-border">
          {(["amplitude-damping", "dephasing"] as const).map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={channel === c}
              onClick={() => onChannelChange(c)}
              className={cn(
                "flex-1 px-3 py-1.5 text-xs font-medium transition-colors",
                channel === c ? "bg-brand text-brand-foreground" : "bg-surface text-muted-foreground hover:bg-surface-muted"
              )}
            >
              {c === "amplitude-damping" ? "Amplitude damping" : "Dephasing"}
            </button>
          ))}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {channel === "amplitude-damping"
            ? "Models spontaneous |1⟩→|0⟩ decay (T1). Every state eventually collapses toward |0⟩."
            : "Models pure phase randomization (T2). Populations are untouched; x and y shrink, z is preserved."}
        </p>
      </section>

      <section aria-labelledby="noise-strength-heading">
        <h3 id="noise-strength-heading" className="text-sm font-semibold text-foreground">
          Channel strength ({channel === "amplitude-damping" ? "γ" : "λ"} per step)
        </h3>
        <input
          type="range"
          min={0.01}
          max={0.5}
          step={0.01}
          value={strength}
          onChange={(e) => onStrengthChange(Number(e.target.value))}
          className="mt-3 w-full accent-brand"
          aria-label="Channel strength per application"
        />
        <p className="mt-1 font-mono text-xs text-muted-foreground">{strength.toFixed(2)}</p>
      </section>

      <section aria-labelledby="noise-steps-heading">
        <h3 id="noise-steps-heading" className="text-sm font-semibold text-foreground">
          Applications (time steps)
        </h3>
        <input
          type="range"
          min={0}
          max={maxSteps}
          step={1}
          value={steps}
          onChange={(e) => onStepsChange(Number(e.target.value))}
          className="mt-3 w-full accent-accent"
          aria-label="Number of channel applications"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        </div>
      </section>
    </div>
  );
}
