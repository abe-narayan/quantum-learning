"use client";

import { Button } from "@/components/ui/Button";
import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { cn } from "@/lib/utils";
import type { BlochAngles } from "@/lib/quantum/bloch";
import { STATE_PRESETS } from "../bloch-sphere/presets";
import { MIXTURE_PRESETS } from "./presets";
import { ControlSection, SimulatorSlider } from "../shared/controls";

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
    <div className={cn("rounded-xl border border-border bg-surface p-3", isInert && "opacity-60")}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      {isInert && (
        <p className="mt-1 text-[11px] text-muted-foreground">
          No visible effect right now — the mixing weight below is entirely on the other component.
        </p>
      )}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {STATE_PRESETS.map((preset) => (
          <Button key={preset.id} variant="secondary" size="sm" onClick={() => onChange(preset.angles)}>
            {preset.ket}
          </Button>
        ))}
      </div>
      <div className="mt-2 space-y-2">
        <SimulatorSlider
          label="θ"
          value={angles.theta}
          min={0}
          max={Math.PI}
          step={0.005}
          formatValue={(v) => `${Math.round((v * 180) / Math.PI)}°`}
          valueText={(v) => `${Math.round((v * 180) / Math.PI)} degrees`}
          onChange={(theta) => onChange({ theta, phi: angles.phi })}
        />
        <SimulatorSlider
          label="φ"
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
        title="The two components being mixed"
        description="ρ = p·ρ₁ + (1−p)·ρ₂, where ρ₁ and ρ₂ are the density matrices of these two pure states."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <ComponentPicker title="Component 1 (ρ₁)" angles={component1} onChange={onComponent1Change} isInert={weight === 0} />
          <ComponentPicker title="Component 2 (ρ₂)" angles={component2} onChange={onComponent2Change} isInert={weight === 1} />
        </div>
      </ControlSection>

      <ControlSection id="weight" title="Mixing weight p" className="border-t border-border pt-5">
        <SimulatorSlider
          label="Mixing weight p"
          value={weight}
          min={0}
          max={1}
          step={0.01}
          formatValue={(v) => v.toFixed(2)}
          onChange={onWeightChange}
        />
      </ControlSection>

      <Button variant="secondary" size="sm" onClick={onReset}>
        Reset
      </Button>
    </div>
  );
}
