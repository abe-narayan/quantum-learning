"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { STATE_PRESETS } from "./presets";
import { FIXED_GATES, ROTATION_AXES, type FixedGateDefinition, type RotationAxisId } from "./gateDefinitions";
import type { BlochAngles } from "@/lib/quantum/bloch";
import { ControlSection, SimulatorSlider, RunControls, PillGroup } from "../shared/controls";

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
      <ControlSection id="presets" title="State presets">
        <PillGroup
          label="State presets"
          value={activePresetId}
          disabled={disabled}
          options={STATE_PRESETS.map((preset) => ({ id: preset.id, label: preset.ket }))}
          onChange={onApplyPreset}
        />
      </ControlSection>

      <ControlSection id="angle-controls" title="Direct manipulation">
        <div className="space-y-4">
          <SimulatorSlider
            label="θ (polar angle)"
            hint="Determines measurement probabilities."
            value={angles.theta}
            min={0}
            max={Math.PI}
            step={0.005}
            disabled={disabled}
            formatValue={(v) => `${Math.round((v * 180) / Math.PI)}°`}
            valueText={(v) => `${Math.round((v * 180) / Math.PI)} degrees`}
            onChange={(theta) => onManualAngles({ theta, phi: angles.phi })}
          />
          <SimulatorSlider
            label="φ (azimuthal angle)"
            hint="The relative phase between |0⟩ and |1⟩."
            value={angles.phi}
            min={0}
            max={2 * Math.PI}
            step={0.005}
            disabled={disabled}
            formatValue={(v) => `${Math.round((v * 180) / Math.PI)}°`}
            valueText={(v) => `${Math.round((v * 180) / Math.PI)} degrees`}
            onChange={(phi) => onManualAngles({ theta: angles.theta, phi })}
          />
        </div>
      </ControlSection>

      <ControlSection id="gates" title="Gates">
        {/* `@sm:` (container query, not viewport): this grid is only ever
            wide enough for 6 columns when its own box is, which is not the
            same thing as the viewport — see SimulatorInstrument.tsx. Inside
            a 320px split-layout rail this stays 4-up; full-width (stacked,
            or the /simulators lab bench) it opens to 6. */}
        <div className="grid grid-cols-4 gap-2 @sm:grid-cols-6">
          {FIXED_GATES.map((gate) => (
            <Button
              key={gate.id}
              variant="secondary"
              size="sm"
              disabled={disabled}
              onClick={() => onApplyGate(gate)}
              title={gate.explanation}
              className="h-10"
            >
              {gate.label}
            </Button>
          ))}
        </div>

        <div className="mt-5 space-y-4">
          {ROTATION_AXES.map((axis) => (
            <RotationRow key={axis.id} axisId={axis.id} label={axis.label} disabled={disabled} onApply={onApplyRotation} />
          ))}
        </div>
      </ControlSection>

      <ControlSection
        id="measurement"
        title="Measurement"
        description="Measuring collapses the state to |0⟩ or |1⟩, chosen randomly with these probabilities."
        className="border-t border-border pt-6"
      >
        <div className="space-y-2">
          <ProbabilityBar label="P(0)" value={probabilities[0]} />
          <ProbabilityBar label="P(1)" value={probabilities[1]} />
        </div>
        <RunControls
          className="mt-3"
          onRun={onMeasure}
          runLabel="Measure"
          onReset={onReset}
          resetLabel="Reset to |0⟩"
          disabled={disabled}
        />
      </ControlSection>
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
    <div className="flex flex-wrap items-end gap-3">
      <SimulatorSlider
        id={id}
        label={<span className="font-mono">{label}</span>}
        value={degrees}
        min={-180}
        max={180}
        step={1}
        disabled={disabled}
        formatValue={(v) => `${v}°`}
        valueText={(v) => `${v} degrees`}
        onChange={setDegrees}
        className="w-full sm:flex-1"
      />
      <Button size="sm" variant="secondary" disabled={disabled} onClick={() => onApply(axisId, (degrees * Math.PI) / 180)}>
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
          className="h-full rounded-full bg-pillar transition-[width] duration-300 ease-out motion-reduce:transition-none"
          style={{ width: `${Math.round(value * 100)}%` }}
        />
      </div>
      <span className="w-12 shrink-0 text-right font-mono text-xs text-muted-foreground">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}
