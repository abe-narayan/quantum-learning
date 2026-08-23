"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { STATE_PRESETS } from "./presets";
import { FIXED_GATES, ROTATION_AXES, type FixedGateDefinition, type RotationAxisId } from "./gateDefinitions";
import type { BlochAngles } from "@/lib/quantum/bloch";

export function BlochSphereControls({
  angles,
  probabilities,
  disabled,
  activePresetId,
  onApplyPreset,
  onManualAngles,
  onApplyGate,
  onApplyRotation,
  onMeasure,
  onReset,
}: {
  angles: BlochAngles;
  probabilities: [number, number];
  disabled: boolean;
  activePresetId: string | null;
  onApplyPreset: (presetId: string) => void;
  onManualAngles: (angles: BlochAngles) => void;
  onApplyGate: (gate: FixedGateDefinition) => void;
  onApplyRotation: (axisId: RotationAxisId, angleRadians: number) => void;
  onMeasure: () => void;
  onReset: () => void;
}) {
  return (
    <div className="space-y-8">
      <section aria-labelledby="presets-heading">
        <h3 id="presets-heading" className="text-sm font-semibold text-foreground">
          State presets
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {STATE_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              variant={activePresetId === preset.id ? "primary" : "secondary"}
              size="sm"
              disabled={disabled}
              onClick={() => onApplyPreset(preset.id)}
            >
              {preset.ket}
            </Button>
          ))}
        </div>
      </section>

      <section aria-labelledby="angle-controls-heading">
        <h3 id="angle-controls-heading" className="text-sm font-semibold text-foreground">
          Direct manipulation
        </h3>
        <AngleSlider
          label="θ (polar angle)"
          hint="Determines measurement probabilities."
          value={angles.theta}
          min={0}
          max={Math.PI}
          disabled={disabled}
          onChange={(theta) => onManualAngles({ theta, phi: angles.phi })}
        />
        <AngleSlider
          label="φ (azimuthal angle)"
          hint="The relative phase between |0⟩ and |1⟩."
          value={angles.phi}
          min={0}
          max={2 * Math.PI}
          disabled={disabled}
          onChange={(phi) => onManualAngles({ theta: angles.theta, phi })}
        />
      </section>

      <section aria-labelledby="gates-heading">
        <h3 id="gates-heading" className="text-sm font-semibold text-foreground">
          Gates
        </h3>
        <div className="mt-3 grid grid-cols-6 gap-2">
          {FIXED_GATES.map((gate) => (
            <button
              key={gate.id}
              type="button"
              disabled={disabled}
              onClick={() => onApplyGate(gate)}
              title={gate.explanation}
              className={cn(
                "flex h-10 items-center justify-center rounded-lg border border-border bg-surface text-sm font-semibold text-foreground transition-colors",
                "hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              {gate.label}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-4">
          {ROTATION_AXES.map((axis) => (
            <RotationRow key={axis.id} axisId={axis.id} label={axis.label} disabled={disabled} onApply={onApplyRotation} />
          ))}
        </div>
      </section>

      <section aria-labelledby="measurement-heading" className="border-t border-border pt-6">
        <h3 id="measurement-heading" className="text-sm font-semibold text-foreground">
          Measurement
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Measuring collapses the state to |0⟩ or |1⟩, chosen randomly with these probabilities.
        </p>
        <div className="mt-3 space-y-2">
          <ProbabilityBar label="P(0)" value={probabilities[0]} />
          <ProbabilityBar label="P(1)" value={probabilities[1]} />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" disabled={disabled} onClick={onMeasure}>
            Measure
          </Button>
          <Button size="sm" variant="secondary" disabled={disabled} onClick={onReset}>
            Reset to |0⟩
          </Button>
        </div>
      </section>
    </div>
  );
}

function AngleSlider({
  label,
  hint,
  value,
  min,
  max,
  disabled,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  const id = useId();
  const degrees = Math.round((value * 180) / Math.PI);

  return (
    <div className="mt-3">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm text-foreground">
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
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-[var(--brand)] disabled:opacity-50"
      />
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function RotationRow({
  axisId,
  label,
  disabled,
  onApply,
}: {
  axisId: RotationAxisId;
  label: string;
  disabled: boolean;
  onApply: (axisId: RotationAxisId, angleRadians: number) => void;
}) {
  const id = useId();
  const [degrees, setDegrees] = useState(45);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label htmlFor={id} className="w-16 shrink-0 font-mono text-sm text-foreground">
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={-180}
        max={180}
        step={1}
        value={degrees}
        disabled={disabled}
        onChange={(event) => setDegrees(Number(event.target.value))}
        className="w-32 flex-1 accent-[var(--brand)] disabled:opacity-50"
      />
      <span className="w-12 text-right font-mono text-xs text-muted-foreground">{degrees}°</span>
      <Button
        size="sm"
        variant="secondary"
        disabled={disabled}
        onClick={() => onApply(axisId, (degrees * Math.PI) / 180)}
      >
        Apply
      </Button>
    </div>
  );
}

function ProbabilityBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-14 shrink-0 font-mono text-muted-foreground">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-300 ease-out motion-reduce:transition-none"
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
      <span className="w-12 shrink-0 text-right font-mono text-xs text-muted-foreground">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}
