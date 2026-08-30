import { Button } from "@/components/ui/Button";
import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { FrameSlider } from "@/components/visualizations/FrameSlider";
import { STATE_PRESETS } from "../bloch-sphere/presets";
import { ControlSection, SimulatorSlider, SymbolGloss } from "../shared/controls";

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
      <ControlSection
        id="noise-preset"
        title="Starting state"
        description="The undisturbed quantum state the noise is applied to. |+⟩ is the most fragile of these: it lives on the equator, where phase noise does the most damage."
      >
        <PresetToggle
          options={STATE_PRESETS.map((preset) => ({ label: preset.ket }))}
          index={STATE_PRESETS.findIndex((preset) => preset.id === presetId)}
          onChange={(index) => onPresetChange(STATE_PRESETS[index].id)}
          ariaLabel="Starting state"
        />
      </ControlSection>

      <ControlSection
        id="noise-channel"
        title="Which kind of noise"
        description={
          channel === "amplitude-damping"
            ? "Energy loss: the qubit spontaneously falls from |1⟩ to |0⟩, like a hot object cooling. Every state ends up at |0⟩."
            : "Phase scrambling: the qubit keeps its energy but forgets its phase. The odds of 0 versus 1 never move; the quantum-ness does."
        }
      >
        <PresetToggle
          options={[{ label: "Energy loss (T1)" }, { label: "Phase scrambling (T2)" }]}
          index={channel === "amplitude-damping" ? 0 : 1}
          onChange={(index) => onChannelChange(index === 0 ? "amplitude-damping" : "dephasing")}
          ariaLabel="Noise channel"
        />
        <SymbolGloss
          items={[
            {
              symbol: "T1",
              name: "energy relaxation time",
              means:
                "how long a qubit typically stays in |1⟩ before falling to |0⟩. This is what the amplitude-damping channel models; a hardware datasheet quotes it in microseconds.",
              glossaryId: "t1-t2-coherence-times",
            },
            {
              symbol: "T2",
              name: "coherence time",
              means:
                "how long a qubit keeps a well-defined phase, the thing superposition is made of. Always the tighter constraint of the two in practice, and what the dephasing channel models.",
              glossaryId: "decoherence",
            },
          ]}
        />
      </ControlSection>

      <ControlSection
        id="noise-strength"
        title="How noisy, per step"
        description="How much damage one application of the channel does. Real hardware is at the low end of this range; the high end just makes the effect visible in fewer steps."
      >
        <SimulatorSlider
          label={
            channel === "amplitude-damping" ? "γ (chance of decay per step)" : "λ (chance of a phase kick per step)"
          }
          value={strength}
          min={0.01}
          max={0.5}
          step={0.01}
          formatValue={(v) => v.toFixed(2)}
          valueText={(v) =>
            channel === "amplitude-damping"
              ? `${Math.round(v * 100)} percent chance of decaying to zero per step`
              : `${Math.round(v * 100)} percent chance of a random phase kick per step`
          }
          onChange={onStrengthChange}
        />
        <SymbolGloss
          items={
            channel === "amplitude-damping"
              ? [
                  {
                    symbol: "γ",
                    name: "damping probability",
                    means: `the chance, per step, that a qubit sitting in |1⟩ drops to |0⟩. At ${strength.toFixed(
                      2
                    )} that's about a ${Math.round(strength * 100)}% chance each time.`,
                    glossaryId: "kraus-operators-cptp-maps",
                  },
                ]
              : [
                  {
                    symbol: "λ",
                    name: "dephasing probability",
                    means: `the chance, per step, that the environment randomizes the qubit's phase. At ${strength.toFixed(
                      2
                    )} that's about a ${Math.round(strength * 100)}% chance each time: energy untouched, phase gone.`,
                    glossaryId: "kraus-operators-cptp-maps",
                  },
                ]
          }
        />
      </ControlSection>

      <ControlSection
        id="noise-steps"
        title="How long the noise has been acting"
        description="Each step is one more application of the channel above; this slider is the instrument's clock."
      >
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
            Reset to zero noise
          </Button>
        </div>
      </ControlSection>
    </div>
  );
}
