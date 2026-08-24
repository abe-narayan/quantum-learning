"use client";

import { useId } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { BlochAngles } from "@/lib/quantum/bloch";
import { STATE_PRESETS } from "../bloch-sphere/presets";
import { MIXTURE_PRESETS } from "./presets";

function AngleSlider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  const degrees = Math.round((value * 180) / Math.PI);

  return (
    <div className="mt-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-xs text-foreground">
          {label}
        </label>
        <span className="font-mono text-xs text-muted-foreground">{degrees}°</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={0.005}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full accent-[var(--brand)]"
      />
    </div>
  );
}

function ComponentPicker({
  title,
  angles,
  onChange,
}: {
  title: string;
  angles: BlochAngles;
  onChange: (angles: BlochAngles) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {STATE_PRESETS.map((preset) => (
          <Button key={preset.id} variant="secondary" size="sm" onClick={() => onChange(preset.angles)}>
            {preset.ket}
          </Button>
        ))}
      </div>
      <AngleSlider label="θ" value={angles.theta} min={0} max={Math.PI} onChange={(theta) => onChange({ theta, phi: angles.phi })} />
      <AngleSlider
        label="φ"
        value={angles.phi}
        min={0}
        max={2 * Math.PI}
        onChange={(phi) => onChange({ theta: angles.theta, phi })}
      />
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
      <section aria-labelledby="mixture-presets-heading">
        <h3 id="mixture-presets-heading" className="text-sm font-semibold text-foreground">
          Mixture presets
        </h3>
        <div role="radiogroup" aria-label="Mixture presets" className="mt-3 flex flex-wrap gap-2">
          {MIXTURE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              role="radio"
              aria-checked={activePresetId === preset.id}
              onClick={() => onApplyMixturePreset(preset.id)}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "disabled:pointer-events-none disabled:opacity-50",
                activePresetId === preset.id
                  ? "bg-brand text-brand-foreground hover:opacity-90"
                  : "border border-border bg-surface text-foreground hover:bg-surface-muted"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="components-heading">
        <h3 id="components-heading" className="text-sm font-semibold text-foreground">
          The two components being mixed
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          ρ = p·ρ₁ + (1−p)·ρ₂, where ρ₁ and ρ₂ are the density matrices of these two pure states.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <ComponentPicker title="Component 1 (ρ₁)" angles={component1} onChange={onComponent1Change} />
          <ComponentPicker title="Component 2 (ρ₂)" angles={component2} onChange={onComponent2Change} />
        </div>
      </section>

      <section aria-labelledby="weight-heading" className="border-t border-border pt-5">
        <h3 id="weight-heading" className="text-sm font-semibold text-foreground">
          Mixing weight p
        </h3>
        <div className="mt-2 flex items-center gap-3">
          <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground">0</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={weight}
            onChange={(event) => onWeightChange(Number(event.target.value))}
            className="w-full accent-[var(--brand)]"
            aria-label="Mixing weight p"
          />
          <span className="w-10 shrink-0 font-mono text-xs text-muted-foreground">1</span>
        </div>
        <p className="mt-1 text-center font-mono text-sm text-foreground">p = {weight.toFixed(2)}</p>
      </section>

      <Button variant="secondary" size="sm" onClick={onReset}>
        Reset
      </Button>
    </div>
  );
}
