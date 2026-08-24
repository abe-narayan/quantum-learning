import { Button } from "@/components/ui/Button";
import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { FrameSlider } from "@/components/visualizations/FrameSlider";
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
        <div className="mt-3">
          <PresetToggle
            options={STATE_PRESETS.map((preset) => ({ label: preset.ket }))}
            index={STATE_PRESETS.findIndex((preset) => preset.id === presetId)}
            onChange={(index) => onPresetChange(STATE_PRESETS[index].id)}
            ariaLabel="Starting state"
          />
        </div>
      </section>

      <section aria-labelledby="noise-channel-heading">
        <h3 id="noise-channel-heading" className="text-sm font-semibold text-foreground">
          Noise channel
        </h3>
        <div className="mt-3">
          <PresetToggle
            options={[{ label: "Amplitude damping" }, { label: "Dephasing" }]}
            index={channel === "amplitude-damping" ? 0 : 1}
            onChange={(index) => onChannelChange(index === 0 ? "amplitude-damping" : "dephasing")}
            ariaLabel="Noise channel"
          />
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
        <div className="mt-3">
          <FrameSlider
            label="Number of channel applications"
            valueLabel={`${steps} application${steps === 1 ? "" : "s"}`}
            index={steps}
            max={maxSteps}
            onChange={onStepsChange}
            boxed={false}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        </div>
      </section>
    </div>
  );
}
