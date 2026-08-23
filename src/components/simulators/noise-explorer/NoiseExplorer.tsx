"use client";

import { useMemo, useState } from "react";
import { blochStateFromAngles, densityMatrixToBlochVector } from "@/lib/quantum/bloch";
import { pureStateDensityMatrix, purity, vonNeumannEntropy, validateDensityMatrix } from "@/lib/quantum/densityMatrix";
import { applyKrausChannel, amplitudeDampingChannel, dephasingChannel } from "@/lib/quantum/openSystems";
import { BlochSphereCanvas } from "@/components/simulators/bloch-sphere/BlochSphereCanvas";
import { DensityMatrixStatePanel } from "@/components/simulators/density-matrix-explorer/DensityMatrixStatePanel";
import { STATE_PRESETS } from "@/components/simulators/bloch-sphere/presets";
import { DecayCurve } from "./DecayCurve";
import { NoiseControls, type ChannelType } from "./NoiseControls";

const MAX_STEPS = 40;

/**
 * A single-qubit noise channel applied step by step, watching the Bloch
 * vector shrink from the sphere's surface toward each channel's fixed
 * point — reusing the platform's existing, tested Kraus-channel engine
 * (openSystems.ts) exactly as Advanced Quantum Mechanics' Open Quantum
 * Systems lesson and Quantum Hardware's T1/T2 lesson describe it, not a
 * separate or re-derived noise model.
 */
export function NoiseExplorer() {
  const [presetId, setPresetId] = useState("+");
  const [channel, setChannel] = useState<ChannelType>("amplitude-damping");
  const [strength, setStrength] = useState(0.15);
  const [steps, setSteps] = useState(0);

  const trajectory = useMemo(() => {
    const preset = STATE_PRESETS.find((p) => p.id === presetId) ?? STATE_PRESETS[0];
    const rho0 = pureStateDensityMatrix(blochStateFromAngles(preset.angles));
    const kraus = channel === "amplitude-damping" ? amplitudeDampingChannel(strength) : dephasingChannel(strength);
    const rhos = [rho0];
    let rho = rho0;
    for (let i = 0; i < MAX_STEPS; i++) {
      rho = applyKrausChannel(rho, kraus);
      rhos.push(rho);
    }
    return rhos;
  }, [presetId, channel, strength]);

  const clampedSteps = Math.min(steps, trajectory.length - 1);
  const rho = trajectory[clampedSteps];
  const blochVector = useMemo(() => densityMatrixToBlochVector(rho), [rho]);
  const purityValue = useMemo(() => purity(rho), [rho]);
  const entropyValue = useMemo(() => vonNeumannEntropy(rho), [rho]);
  const validation = useMemo(() => validateDensityMatrix(rho), [rho]);
  const purityTrajectory = useMemo(() => trajectory.map((r) => purity(r)), [trajectory]);

  function handlePresetChange(id: string) {
    setPresetId(id);
    setSteps(0);
  }

  function handleChannelChange(next: ChannelType) {
    setChannel(next);
    setSteps(0);
  }

  function handleStrengthChange(v: number) {
    setStrength(v);
    setSteps(0);
  }

  const narration =
    clampedSteps === 0
      ? "No decoherence yet — this is the starting pure state, sitting exactly on the sphere's surface."
      : channel === "amplitude-damping"
        ? purityValue > 0.995
          ? `After ${clampedSteps} applications, the state has nearly fully decayed to |0⟩ — amplitude damping's fixed point, itself pure again.`
          : `After ${clampedSteps} applications: purity Tr(ρ²) = ${purityValue.toFixed(3)}. The Bloch vector is being pulled toward the north pole, |0⟩.`
        : purityValue < 0.505
          ? `After ${clampedSteps} applications, x and y have nearly vanished: only the population information (z) survives — this is dephasing's fixed behavior.`
          : `After ${clampedSteps} applications: purity Tr(ρ²) = ${purityValue.toFixed(3)}. Phase information (x, y) is randomizing away while z stays fixed.`;

  return (
    <div className="not-prose grid gap-6 rounded-3xl border border-border bg-surface p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
      <div className="space-y-6">
        <div className="mx-auto max-w-sm">
          <BlochSphereCanvas blochPoint={blochVector} className="mx-auto w-full" />
        </div>

        <div aria-live="polite" className="rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
          {narration}
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Purity Tr(ρ²) over successive applications</p>
          <DecayCurve samples={purityTrajectory} currentStep={clampedSteps} label="Purity over channel applications" />
        </div>

        <DensityMatrixStatePanel rho={rho} purityValue={purityValue} entropyValue={entropyValue} validation={validation} />
      </div>

      <NoiseControls
        presetId={presetId}
        onPresetChange={handlePresetChange}
        channel={channel}
        onChannelChange={handleChannelChange}
        strength={strength}
        onStrengthChange={handleStrengthChange}
        steps={clampedSteps}
        maxSteps={MAX_STEPS}
        onStepsChange={setSteps}
        onReset={() => setSteps(0)}
      />
    </div>
  );
}
