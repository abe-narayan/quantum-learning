import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { QAOA_GRAPH_PRESETS } from "./presets";
import { ControlSection, SimulatorSlider } from "../shared/controls";

export function QAOAControls({
  presetId,
  onPresetChange,
  gamma,
  onGammaChange,
  beta,
  onBetaChange,
}: {
  presetId: string;
  onPresetChange: (id: string) => void;
  gamma: number;
  onGammaChange: (v: number) => void;
  beta: number;
  onBetaChange: (v: number) => void;
}) {
  return (
    <div className="space-y-8">
      <ControlSection id="qaoa-graph" title="Graph">
        <PresetToggle
          options={QAOA_GRAPH_PRESETS}
          index={QAOA_GRAPH_PRESETS.findIndex((p) => p.id === presetId)}
          onChange={(i) => onPresetChange(QAOA_GRAPH_PRESETS[i].id)}
          ariaLabel="Graph preset"
        />
      </ControlSection>

      <ControlSection
        id="qaoa-gamma"
        title="Cost angle γ"
        description="Controls the phase e^(-iγ·cut count) applied by the cost unitary."
      >
        <SimulatorSlider
          label="γ"
          value={gamma}
          min={0}
          max={2 * Math.PI}
          step={0.01}
          formatValue={(v) => v.toFixed(2)}
          onChange={onGammaChange}
        />
      </ControlSection>

      <ControlSection
        id="qaoa-beta"
        title="Mixer angle β"
        description="Controls the Rx(2β) rotation applied to every qubit by the mixer unitary."
      >
        <SimulatorSlider
          label="β"
          value={beta}
          min={0}
          max={Math.PI}
          step={0.01}
          formatValue={(v) => v.toFixed(2)}
          onChange={onBetaChange}
        />
      </ControlSection>
    </div>
  );
}
