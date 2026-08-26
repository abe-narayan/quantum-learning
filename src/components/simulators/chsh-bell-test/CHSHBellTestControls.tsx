"use client";

import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { ControlSection, SimulatorSlider } from "../shared/controls";

/** The four measurement angles (radians) a student can set: Alice's a, a′ and Bob's b, b′. */
export type ChshAngles = { a: number; aPrime: number; b: number; bPrime: number };

export function CHSHBellTestControls({
  angles,
  onAnglesChange,
  onApplyZeroPreset,
  onApplyOptimalPreset,
  isOptimalPreset,
  isZeroPreset,
}: {
  angles: ChshAngles;
  onAnglesChange: (angles: ChshAngles) => void;
  onApplyZeroPreset: () => void;
  onApplyOptimalPreset: () => void;
  isOptimalPreset: boolean;
  isZeroPreset: boolean;
}) {
  return (
    <div className="space-y-8">
      <ControlSection
        id="chsh-presets"
        title="Presets"
        description="Jump to a known configuration, or drag any slider below to set your own angles."
      >
        <PresetToggle
          ariaLabel="Angle presets"
          options={[{ label: "All angles at 0°" }, { label: "Try this: quantum-optimal angles" }]}
          index={isZeroPreset ? 0 : isOptimalPreset ? 1 : -1}
          onChange={(i) => (i === 0 ? onApplyZeroPreset() : onApplyOptimalPreset())}
        />
      </ControlSection>

      <ControlSection id="chsh-alice" title="Alice&rsquo;s measurement angles">
        <div className="space-y-4">
          <AngleSlider label="a" value={angles.a} onChange={(a) => onAnglesChange({ ...angles, a })} />
          <AngleSlider label="a′" value={angles.aPrime} onChange={(aPrime) => onAnglesChange({ ...angles, aPrime })} />
        </div>
      </ControlSection>

      <ControlSection id="chsh-bob" title="Bob&rsquo;s measurement angles">
        <div className="space-y-4">
          <AngleSlider label="b" value={angles.b} onChange={(b) => onAnglesChange({ ...angles, b })} />
          <AngleSlider label="b′" value={angles.bPrime} onChange={(bPrime) => onAnglesChange({ ...angles, bPrime })} />
        </div>
      </ControlSection>
    </div>
  );
}

function AngleSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <SimulatorSlider
      label={<span className="font-mono">{label}</span>}
      value={value}
      min={-Math.PI}
      max={Math.PI}
      step={0.01}
      formatValue={(v) => `${Math.round((v * 180) / Math.PI)}°`}
      valueText={(v) => `${Math.round((v * 180) / Math.PI)} degrees`}
      onChange={onChange}
    />
  );
}
