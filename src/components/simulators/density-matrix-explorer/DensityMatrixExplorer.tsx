"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { blochStateFromAngles, densityMatrixToBlochVector, type BlochAngles } from "@/lib/quantum/bloch";
import { pureStateDensityMatrix, convexCombination, purity, vonNeumannEntropy, validateDensityMatrix } from "@/lib/quantum/densityMatrix";
import { BlochSphereCanvas } from "../bloch-sphere/BlochSphereCanvas";
import { DensityMatrixControls } from "./DensityMatrixControls";
import { DensityMatrixStatePanel } from "./DensityMatrixStatePanel";
import { MIXTURE_PRESETS } from "./presets";

const DEFAULT_COMPONENT_1: BlochAngles = { theta: 0, phi: 0 };
const DEFAULT_COMPONENT_2: BlochAngles = { theta: Math.PI, phi: 0 };
const DEFAULT_WEIGHT = 1;

/**
 * A single-qubit density matrix built live from ρ = p·ρ₁ + (1−p)·ρ₂, where
 * ρ₁, ρ₂ come from two independently-adjustable points on the Bloch sphere.
 * Deliberately single-qubit in scope (matching this course's engine, which
 * has no general N-dimensional eigensolver) — the payoff is that mixedness
 * becomes something you can literally see: pure states sit exactly on the
 * sphere's surface, and every real mixture pulls the point strictly inside,
 * by exactly the amount `purity` and `vonNeumannEntropy` predict.
 */
export function DensityMatrixExplorer() {
  const [component1, setComponent1] = useState<BlochAngles>(DEFAULT_COMPONENT_1);
  const [component2, setComponent2] = useState<BlochAngles>(DEFAULT_COMPONENT_2);
  const [weight, setWeight] = useState(DEFAULT_WEIGHT);
  const [activePresetId, setActivePresetId] = useState<string | null>("pure-0");
  const [narration, setNarration] = useState(
    "Weight 1 on |0⟩ — a pure state, sitting exactly on the sphere's surface."
  );

  const rho = useMemo(() => {
    const rho1 = pureStateDensityMatrix(blochStateFromAngles(component1));
    const rho2 = pureStateDensityMatrix(blochStateFromAngles(component2));
    return convexCombination([
      { probability: weight, density: rho1 },
      { probability: 1 - weight, density: rho2 },
    ]);
  }, [component1, component2, weight]);

  const blochVector = useMemo(() => densityMatrixToBlochVector(rho), [rho]);
  const purityValue = useMemo(() => purity(rho), [rho]);
  const entropyValue = useMemo(() => vonNeumannEntropy(rho), [rho]);
  const validation = useMemo(() => validateDensityMatrix(rho), [rho]);

  function applyMixturePreset(presetId: string) {
    const preset = MIXTURE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setComponent1(preset.component1);
    setComponent2(preset.component2);
    setWeight(preset.weight);
    setActivePresetId(presetId);
    setNarration(preset.narration);
  }

  function handleComponent1Change(angles: BlochAngles) {
    setComponent1(angles);
    setActivePresetId(null);
    setNarration("Adjusted component 1 — the density matrix updates live.");
  }

  function handleComponent2Change(angles: BlochAngles) {
    setComponent2(angles);
    setActivePresetId(null);
    setNarration("Adjusted component 2 — the density matrix updates live.");
  }

  function handleWeightChange(nextWeight: number) {
    setWeight(nextWeight);
    setActivePresetId(null);
    setNarration(
      nextWeight === 0 || nextWeight === 1
        ? "Weight is entirely on one component — the mixture is pure again."
        : "Adjusted the mixing weight — watch the point move toward or away from the center."
    );
  }

  function reset() {
    applyMixturePreset("pure-0");
  }

  return (
    <div className="not-prose grid gap-6 rounded-3xl border border-border bg-surface p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
      <div>
        <div className="mx-auto max-w-sm">
          <BlochSphereCanvas blochPoint={blochVector} className="mx-auto w-full" />
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Drag to rotate the view. A mixed state&rsquo;s point sits strictly inside the sphere, not on its surface.
        </p>

        <div aria-live="polite" className="mt-4 rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
          {narration}
        </div>

        <div className="mt-6">
          <DensityMatrixStatePanel rho={rho} purityValue={purityValue} entropyValue={entropyValue} validation={validation} />
        </div>

        <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
          <div>
            <Badge tone="brand" className="mb-1.5">
              Reading the sphere
            </Badge>
            <p className="text-sm text-muted-foreground">
              The Bloch vector of a mixture is the probability-weighted average of its components&rsquo; own
              vectors — that&rsquo;s why the point moves smoothly toward the center as the mixing weight
              balances out, rather than jumping discontinuously.
            </p>
          </div>
          <div>
            <Badge tone="accent" className="mb-1.5">
              Same center, different recipes
            </Badge>
            <p className="text-sm text-muted-foreground">
              Try the two 50/50 presets — {"{"}|0⟩,|1⟩{"}"} and {"{"}|+⟩,|−⟩{"}"} — and check the density matrix
              panel: both land on the exact same ρ = I/2, even though they mix completely different states.
            </p>
          </div>
        </div>
      </div>

      <DensityMatrixControls
        component1={component1}
        component2={component2}
        weight={weight}
        activePresetId={activePresetId}
        onComponent1Change={handleComponent1Change}
        onComponent2Change={handleComponent2Change}
        onWeightChange={handleWeightChange}
        onApplyMixturePreset={applyMixturePreset}
        onReset={reset}
      />
    </div>
  );
}
