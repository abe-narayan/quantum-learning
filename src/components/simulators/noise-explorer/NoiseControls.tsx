import { Button } from "@/components/ui/Button";
import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { FrameSlider } from "@/components/visualizations/FrameSlider";
import { STATE_PRESETS } from "../bloch-sphere/presets";
import { ControlSection, SimulatorSlider } from "../shared/controls";

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
      <ControlSection id="noise-preset" title="Starting state">
        <PresetToggle
          options={STATE_PRESETS.map((preset) => ({ label: preset.ket }))}
          index={STATE_PRESETS.findIndex((preset) => preset.id === presetId)}
          onChange={(index) => onPresetChange(STATE_PRESETS[index].id)}
          ariaLabel="Starting state"
        />
      </ControlSection>

      <ControlSection
        id="noise-channel"
        title="Noise channel"
        description={
          channel === "amplitude-damping"
            ? "Models spontaneous |1⟩→|0⟩ decay (T1). Every state eventually collapses toward |0⟩."
            : "Models pure phase randomization (T2). Populations are untouched; x and y shrink, z is preserved."
        }
      >
        <PresetToggle
          options={[{ label: "Amplitude damping" }, { label: "Dephasing" }]}
          index={channel === "amplitude-damping" ? 0 : 1}
          onChange={(index) => onChannelChange(index === 0 ? "amplitude-damping" : "dephasing")}
          ariaLabel="Noise channel"
        />
      </ControlSection>

      <ControlSection id="noise-strength" title={`Channel strength (${channel === "amplitude-damping" ? "γ" : "λ"} per step)`}>
        <SimulatorSlider
          label={channel === "amplitude-damping" ? "γ" : "λ"}
          value={strength}
          min={0.01}
          max={0.5}
          step={0.01}
          formatValue={(v) => v.toFixed(2)}
          onChange={onStrengthChange}
        />
      </ControlSection>

      <ControlSection id="noise-steps" title="Applications (time steps)">
        <FrameSlider
          label="Number of channel applications"
          valueLabel={`${steps} application${steps === 1 ? "" : "s"}`}
          index={steps}
          max={maxSteps}
          onChange={onStepsChange}
          boxed={false}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        </div>
      </ControlSection>
    </div>
  );
}
