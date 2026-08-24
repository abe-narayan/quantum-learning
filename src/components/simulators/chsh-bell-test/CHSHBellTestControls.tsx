"use client";

import { useId } from "react";
import { PresetToggle } from "@/components/visualizations/PresetToggle";

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
      <section aria-labelledby="chsh-presets-heading">
        <h3 id="chsh-presets-heading" className="text-sm font-semibold text-foreground">
          Presets
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Jump to a known configuration, or drag any slider below to set your own angles.
        </p>
        <div className="mt-3">
          <PresetToggle
            ariaLabel="Angle presets"
            options={[{ label: "All angles at 0°" }, { label: "Try this: quantum-optimal angles" }]}
            index={isZeroPreset ? 0 : isOptimalPreset ? 1 : -1}
            onChange={(i) => (i === 0 ? onApplyZeroPreset() : onApplyOptimalPreset())}
          />
        </div>
      </section>

      <section aria-labelledby="chsh-alice-heading">
        <h3 id="chsh-alice-heading" className="text-sm font-semibold text-foreground">
          Alice&rsquo;s measurement angles
        </h3>
        <AngleSlider label="a" value={angles.a} onChange={(a) => onAnglesChange({ ...angles, a })} />
        <AngleSlider
          label="a′"
          value={angles.aPrime}
          onChange={(aPrime) => onAnglesChange({ ...angles, aPrime })}
        />
      </section>

      <section aria-labelledby="chsh-bob-heading">
        <h3 id="chsh-bob-heading" className="text-sm font-semibold text-foreground">
          Bob&rsquo;s measurement angles
        </h3>
        <AngleSlider label="b" value={angles.b} onChange={(b) => onAnglesChange({ ...angles, b })} />
        <AngleSlider
          label="b′"
          value={angles.bPrime}
          onChange={(bPrime) => onAnglesChange({ ...angles, bPrime })}
        />
      </section>
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
  const id = useId();
  const degrees = Math.round((value * 180) / Math.PI);

  return (
    <div className="mt-3">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="font-mono text-sm text-foreground">
          {label}
        </label>
        <span className="font-mono text-xs text-muted-foreground">{degrees}°</span>
      </div>
      <input
        id={id}
        type="range"
        min={-Math.PI}
        max={Math.PI}
        step={0.01}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-[var(--brand)]"
        aria-label={`Measurement angle ${label}`}
      />
    </div>
  );
}
