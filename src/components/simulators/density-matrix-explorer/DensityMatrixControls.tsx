"use client";

import { Button } from "@/components/ui/Button";
import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { cn } from "@/lib/utils";
import type { BlochAngles } from "@/lib/quantum/bloch";
import { STATE_PRESETS } from "../bloch-sphere/presets";
import { MIXTURE_PRESETS } from "./presets";
import { ControlSection, SimulatorSlider, SymbolGloss } from "../shared/controls";

function ComponentPicker({
  title,
  angles,
  onChange,
  isInert,
}: {
  title: string;
  angles: BlochAngles;
  onChange: (angles: BlochAngles) => void;
  /** True when this component's mixing coefficient is currently exactly 0, so ρ = p·ρ₁ + (1−p)·ρ₂
   * has zeroed out its contribution entirely — every slider/preset click here is a real, valid edit
   * that nonetheless produces zero visible change until the weight is moved off that extreme. */
  isInert: boolean;
}) {
  return (
    <div className={cn("rounded-panel border border-border bg-surface p-3", isInert && "opacity-60")}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      {isInert && (
        <p className="mt-1 text-[11px] text-muted-foreground">
          No visible effect right now — the mixing weight below is entirely on the other component.
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {STATE_PRESETS.map((preset) => (
          <Button
            key={preset.id}
            variant="secondary"
            size="sm"
            // Two ComponentPickers render side by side with the identical set
            // of ket buttons, so without the possibility name in the label a
            // screen reader's button list was two indistinguishable copies of
            // |0⟩, |1⟩, |+⟩, … and no way to tell which mixture component a
            // given one would change.
            aria-label={`Set ${title} to ${preset.ket}`}
            onClick={() => onChange(preset.angles)}
          >
            {preset.ket}
          </Button>
        ))}
      </div>
      <div className="mt-2 space-y-2">
        <SimulatorSlider
          // Same duplication problem as the ket buttons above: two θ sliders
          // and two φ sliders, one pair per possibility. The `sr-only` half
          // rides inside the same <label>, so the accessible name still
          // contains the visible text.
          label={
            <>
              θ (tilt from |0⟩)<span className="sr-only"> for {title}</span>
            </>
          }
          value={angles.theta}
          min={0}
          max={Math.PI}
          step={0.005}
          formatValue={(v) => `${Math.round((v * 180) / Math.PI)}°`}
          valueText={(v) => `${Math.round((v * 180) / Math.PI)} degrees`}
          onChange={(theta) => onChange({ theta, phi: angles.phi })}
        />
        <SimulatorSlider
          label={
            <>
              φ (spin around)<span className="sr-only"> for {title}</span>
            </>
          }
          value={angles.phi}
          min={0}
          max={2 * Math.PI}
          step={0.005}
          formatValue={(v) => `${Math.round((v * 180) / Math.PI)}°`}
          valueText={(v) => `${Math.round((v * 180) / Math.PI)} degrees`}
          onChange={(phi) => onChange({ theta: angles.theta, phi })}
        />
      </div>
    </div>
  );
}

export function DensityMatrixControls({
  component1,
  component2,
  weight,
  activePresetId,
  onComponent1Change,
  onComponent2Change,
  onWeightChange,
  onApplyMixturePreset,
  onReset,
}: {
  component1: BlochAngles;
  component2: BlochAngles;
  weight: number;
  activePresetId: string | null;
  onComponent1Change: (angles: BlochAngles) => void;
  onComponent2Change: (angles: BlochAngles) => void;
  onWeightChange: (weight: number) => void;
  onApplyMixturePreset: (presetId: string) => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-6">
      <ControlSection id="mixture-presets" title="Mixture presets">
        <PresetToggle
          options={MIXTURE_PRESETS.map((preset) => ({ label: preset.label }))}
          index={MIXTURE_PRESETS.findIndex((preset) => preset.id === activePresetId)}
          onChange={(index) => onApplyMixturePreset(MIXTURE_PRESETS[index].id)}
          ariaLabel="Mixture presets"
        />
      </ControlSection>

      <ControlSection
        id="components"
        title="The two states being mixed"
        description="Pick the two possibilities. The qubit really is one of them — you just don't know which."
      >
        <div className="grid gap-3 @sm:grid-cols-2">
          <ComponentPicker title="Possibility 1 (ρ₁)" angles={component1} onChange={onComponent1Change} isInert={weight === 0} />
          <ComponentPicker title="Possibility 2 (ρ₂)" angles={component2} onChange={onComponent2Change} isInert={weight === 1} />
        </div>
        <SymbolGloss
          items={[
            {
              symbol: "θ",
              name: "polar angle",
              means:
                "how far a state is tilted away from |0⟩ at the top of the sphere. 0° is |0⟩, 90° is an even superposition, 180° is |1⟩.",
              glossaryId: "bloch-sphere-term",
            },
            {
              symbol: "φ",
              name: "azimuthal angle",
              means:
                "which way the state points once tilted — its relative phase. It never changes the odds of measuring 0 or 1, only how the state interferes.",
              glossaryId: "global-relative-phase",
            },
            {
              symbol: "ρ",
              name: "density matrix",
              means:
                "the full description of a qubit when you only know the odds, not the state — the two-by-two table of numbers in the panel to the left.",
              glossaryId: "mixed-state",
            },
          ]}
        />
      </ControlSection>

      <ControlSection
        id="weight"
        title="How often possibility 1 is the true one"
        description="ρ = p·ρ₁ + (1−p)·ρ₂. At p = 1 or 0 there's no uncertainty at all and the state is pure again; the middle is where mixing actually happens."
        className="border-t border-border pt-5"
      >
        <SimulatorSlider
          label="p (weight on possibility 1)"
          value={weight}
          min={0}
          max={1}
          step={0.01}
          formatValue={(v) => v.toFixed(2)}
          valueText={(v) => `${Math.round(v * 100)} percent possibility 1, ${Math.round((1 - v) * 100)} percent possibility 2`}
          onChange={onWeightChange}
        />
      </ControlSection>

      <Button variant="secondary" size="sm" onClick={onReset}>
        Reset to the 90/10 mixture
      </Button>
    </div>
  );
}
