import { Button } from "@/components/ui/Button";
import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { QAOA_GRAPH_PRESETS } from "./presets";
import { ControlSection, SimulatorSlider, SymbolGloss } from "../shared/controls";

export function QAOAControls({
  presetId,
  onPresetChange,
  gamma,
  onGammaChange,
  beta,
  onBetaChange,
  onReset,
}: {
  presetId: string;
  onPresetChange: (id: string) => void;
  gamma: number;
  onGammaChange: (v: number) => void;
  beta: number;
  onBetaChange: (v: number) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-8">
      <ControlSection
        id="qaoa-graph"
        title="Which graph to cut"
        description="One qubit per dot. Different shapes are genuinely different problems — some can be solved perfectly by this circuit, some can't."
      >
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
        description="How strongly to reward splits that cut a lot of edges."
      >
        <SimulatorSlider
          label="γ (cost angle)"
          value={gamma}
          min={0}
          max={2 * Math.PI}
          step={0.01}
          formatValue={(v) => v.toFixed(2)}
          valueText={(v) => `Cost angle ${v.toFixed(2)} radians, ${Math.round((v * 180) / Math.PI)} degrees`}
          onChange={onGammaChange}
        />
        <SymbolGloss
          items={[
            {
              symbol: "γ",
              name: "cost angle",
              means:
                "gamma. It marks good splits by giving them a different phase, in proportion to how many edges they cut — the phase e^(−iγ·cut) applied by the cost step. On its own it changes no probability at all.",
              glossaryId: "ansatz",
            },
          ]}
        />
      </ControlSection>

      <ControlSection
        id="qaoa-beta"
        title="Mixer angle β"
        description="How much to stir afterwards, so the marking above turns into a real change in the odds."
      >
        <SimulatorSlider
          label="β (mixer angle)"
          value={beta}
          min={0}
          max={Math.PI}
          step={0.01}
          formatValue={(v) => v.toFixed(2)}
          valueText={(v) => `Mixer angle ${v.toFixed(2)} radians, ${Math.round((v * 180) / Math.PI)} degrees`}
          onChange={onBetaChange}
        />
        <SymbolGloss
          items={[
            {
              symbol: "β",
              name: "mixer angle",
              means:
                "beta. An Rx(2β) rotation on every qubit that converts γ's invisible phase marking into visible probability — the same trick Grover's diffusion step pulls, one layer at a time.",
              glossaryId: "ansatz",
            },
          ]}
        />
      </ControlSection>

      <Button variant="secondary" size="sm" onClick={onReset}>
        Reset angles and graph
      </Button>
    </div>
  );
}
