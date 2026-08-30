"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { STATE_PRESETS } from "./presets";
import { FIXED_GATES, ROTATION_AXES, type FixedGateDefinition, type RotationAxisId } from "./gateDefinitions";
import type { BlochAngles } from "@/lib/quantum/bloch";
import { ControlSection, SimulatorSlider, RunControls, PillGroup, SymbolGloss } from "../shared/controls";

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
  // sin θ is the length of the arrow's shadow on the equatorial plane, and it
  // is exactly the factor φ acts through: at sin θ = 0 the arrow is on the
  // axis φ rotates about, so φ has nothing to turn. The threshold is loose
  // (θ within ~2.6° of a pole) because the point is "you will not see this
  // move", not an exact equality.
  const phiIsDegenerate = Math.abs(Math.sin(angles.theta)) < 0.045;

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
            // A bare "60 degrees" tells a screen-reader user nothing about
            // what moved. The whole reason θ matters is the probability it
            // sets, and that lives in a bar chart they cannot see while
            // dragging. P(0) = cos²(θ/2) is the Born rule for the canonical
            // Bloch state (see `blochStateFromAngles` in lib/quantum/bloch.ts),
            // so this is a readout of the same quantity the bars draw, not a
            // second derivation of it.
            valueText={(v) =>
              `${Math.round((v * 180) / Math.PI)} degrees, probability of measuring 0 is ${Math.round(
                Math.cos(v / 2) ** 2 * 100
              )} percent`
            }
            onChange={(theta) => onManualAngles({ theta, phi: angles.phi })}
          />
          {/* φ is genuinely inert at the poles, and this instrument opens on
              one. At θ=0 the state is exactly |0⟩: there is only one nonzero
              amplitude, so there is nothing for a phase to be relative *to*,
              and dragging φ moves the arrow not at all, the bars not at all,
              and the state panel not at all. Five lessons instruct the reader
              to start from |0⟩ (see `quantum-gates.mdx`, `building-qubit-
              circuits.mdx` and siblings), so the opening state is not the
              thing to change here. What was wrong is that the control said
              nothing about it: a slider that answers a drag with no visible
              consequence and no stated one reads as broken rather than as
              degenerate. The hint now names the condition and says which
              control to move to leave it, and because `SimulatorSlider` wires
              `hint` to `aria-describedby`, a screen-reader user hears the same
              explanation on focus rather than dragging a silent control. */}
          <SimulatorSlider
            label="φ (azimuthal angle)"
            hint={
              phiIsDegenerate
                ? "The relative phase between |0⟩ and |1⟩. At the poles one amplitude is zero, so there is nothing for a phase to be relative to and this slider changes nothing you can see. Move θ off 0° and 180° and it starts swinging the arrow around the vertical axis."
                : "The relative phase between |0⟩ and |1⟩. It swings the arrow around the vertical axis and never changes P(0) or P(1)."
            }
            value={angles.phi}
            min={0}
            max={2 * Math.PI}
            step={0.005}
            disabled={disabled}
            formatValue={(v) => `${Math.round((v * 180) / Math.PI)}°`}
            valueText={(v) =>
              phiIsDegenerate
                ? `${Math.round((v * 180) / Math.PI)} degrees, no effect at the poles`
                : `${Math.round((v * 180) / Math.PI)} degrees of relative phase`
            }
            onChange={(phi) => onManualAngles({ theta: angles.theta, phi })}
          />
        </div>
      </ControlSection>

      <ControlSection
        id="gates"
        title="Gates"
        description="A gate is a rotation of the arrow, nothing more. It is reversible, it never involves chance, and it never collapses anything. Only Measure does that."
      >
        {/* `@sm:` (container query, not viewport): this grid is only ever
            wide enough for 6 columns when its own box is, which is not the
            same thing as the viewport; see SimulatorInstrument.tsx. Inside
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
              // Without this the six buttons announce as "X", "Y", "Z", "H",
              // "S", "T": six single letters with no hint that they are
              // gates or that pressing one rotates the sphere. `title` only
              // supplies the accessible *description*, which many screen
              // readers do not read by default.
              aria-label={`Apply the ${gate.label} gate`}
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

        <SymbolGloss
          items={[
            {
              symbol: "H",
              name: "Hadamard",
              means:
                "the superposition-maker. Takes a definite |0⟩ or |1⟩ to the equator, where a measurement is a genuine 50/50, and takes it straight back again if applied twice.",
              glossaryId: "hadamard-gate",
            },
            {
              symbol: "X",
              name: "the quantum NOT",
              means: "a half turn that swaps |0⟩ and |1⟩. Y and Z are the same half turn about the other two axes.",
              glossaryId: "pauli-matrices",
            },
            {
              symbol: "S, T",
              name: "phase gates",
              means:
                "quarter and eighth turns about the vertical axis. They change nothing about the odds of 0 or 1 (watch P(0) and P(1) hold still) and everything about interference.",
              glossaryId: "single-qubit-gates",
            },
            {
              symbol: "Rx",
              name: "arbitrary rotation",
              means: "the same idea with the angle up to you: turn the arrow by any amount about the x, y or z axis.",
              glossaryId: "single-qubit-gates",
            },
          ]}
        />
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
      <Button
        size="sm"
        variant="secondary"
        disabled={disabled}
        onClick={() => onApply(axisId, (degrees * Math.PI) / 180)}
        // Three of these rows stack here, so a screen reader's button list
        // used to read "Apply, Apply, Apply" with nothing to tell them apart.
        // The visible word stays "Apply"; the row's own slider label is what
        // identifies it on screen.
        aria-label={`Apply ${label} rotation of ${degrees} degrees`}
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
