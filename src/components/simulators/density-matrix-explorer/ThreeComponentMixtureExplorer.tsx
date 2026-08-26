"use client";

import { useMemo, useState } from "react";
import { Readout } from "@/components/ui/Typography";
import { blochStateFromAngles } from "@/lib/quantum/bloch";
import { pureStateDensityMatrix, convexCombination, purity, vonNeumannEntropy, validateDensityMatrix } from "@/lib/quantum/densityMatrix";
import { densityMatrixToBlochVector } from "@/lib/quantum/bloch";
import { BlochSphereCanvas } from "../bloch-sphere/BlochSphereCanvas";
import { useAnimatedBlochTarget } from "../bloch-sphere/useAnimatedBlochPoint";
import { DensityMatrixStatePanel } from "./DensityMatrixStatePanel";
import { SimulatorInstrument } from "../shared/SimulatorInstrument";
import { SimulatorFraming } from "../shared/Framing";
import { ControlSection, SimulatorSlider, PillGroup } from "../shared/controls";

const ZERO_ANGLES = { theta: 0, phi: 0 };
const ONE_ANGLES = { theta: Math.PI, phi: 0 };
const PLUS_ANGLES = { theta: Math.PI / 2, phi: 0 };

// Fixed once — these three kets are exactly the worked example's ensemble,
// so this widget is deliberately scoped to that one point rather than
// generalized into a full N-component mixer.
const RHO_0 = pureStateDensityMatrix(blochStateFromAngles(ZERO_ANGLES));
const RHO_1 = pureStateDensityMatrix(blochStateFromAngles(ONE_ANGLES));
const RHO_PLUS = pureStateDensityMatrix(blochStateFromAngles(PLUS_ANGLES));

type ThreeWeightPreset = {
  id: string;
  label: string;
  p0: number;
  p1: number;
};

// p_plus is always 1 - p0 - p1, so every preset here already sums to 1 —
// there's nothing to normalize or validate at the call site.
const PRESETS: ThreeWeightPreset[] = [
  { id: "worked-example", label: "Worked example: 0.5 / 0.25 / 0.25", p0: 0.5, p1: 0.25 },
  { id: "equal-thirds", label: "Equal thirds", p0: 1 / 3, p1: 1 / 3 },
  { id: "pure-0", label: "Pure |0⟩", p0: 1, p1: 0 },
];

/**
 * A small, lesson-local widget for exactly one thing the shared
 * `DensityMatrixExplorer` can't show: a genuine three-component mixture. It
 * fixes the ensemble to this lesson's worked example — |0⟩, |1⟩, |+⟩ — and
 * exposes two independent sliders (p0, p1); the third probability,
 * p_plus = 1 - p0 - p1, is derived rather than independently adjustable, so
 * every reachable configuration is automatically a valid probability
 * distribution (nonnegative, summing to exactly 1) with no separate
 * renormalization step.
 */
export function ThreeComponentMixtureExplorer() {
  const [p0, setP0] = useState(0.5);
  const [p1, setP1] = useState(0.25);
  const [activePresetId, setActivePresetId] = useState<string | null>("worked-example");

  const clampedP1 = Math.min(p1, 1 - p0);
  const pPlus = 1 - p0 - clampedP1;

  const rho = useMemo(
    () =>
      convexCombination([
        { probability: p0, density: RHO_0 },
        { probability: clampedP1, density: RHO_1 },
        { probability: pPlus, density: RHO_PLUS },
      ]),
    [p0, clampedP1, pPlus]
  );

  const targetBlochVector = useMemo(() => densityMatrixToBlochVector(rho), [rho]);
  const { point: blochVector } = useAnimatedBlochTarget(targetBlochVector);
  const purityValue = useMemo(() => purity(rho), [rho]);
  const entropyValue = useMemo(() => vonNeumannEntropy(rho), [rho]);
  const validation = useMemo(() => validateDensityMatrix(rho), [rho]);

  function applyPreset(id: string) {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setP0(preset.p0);
    setP1(preset.p1);
    setActivePresetId(preset.id);
  }

  return (
    <SimulatorInstrument
      label="Density matrix — three-component mixture"
      readout={<Readout label="Purity" value={purityValue.toFixed(3)} />}
      footnote="ρ = p₀|0⟩⟨0| + p₁|1⟩⟨1| + p₊|+⟩⟨+| — p₊ is always whatever's left, so this can never drift into an invalid mixture."
      stage={
        <>
          <div className="mx-auto max-w-sm">
            <BlochSphereCanvas blochPoint={blochVector} className="mx-auto w-full" />
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            The point pulled by three weighted components at once — not the pairwise workaround above.
          </p>
          <div className="mt-6">
            <DensityMatrixStatePanel rho={rho} purityValue={purityValue} entropyValue={entropyValue} validation={validation} />
          </div>

          <SimulatorFraming
            shows="A mixture doesn't need to stay pairwise — three independently-weighted pure states can pull the Bloch point to the same interior location a two-component mixture reaches, as long as the weights land on the same effective average."
            watchFor="p₊ is derived, not a third slider — every point you can reach with p₀ and p₁ is automatically a valid probability distribution, so nothing here can be normalized wrong."
            tryThis="Drag p₀ to 1 (or p₁ to 1 − p₀) so p₊ hits 0 — the mixture collapses back to the two-component case above. Then split the weight three ways with Equal thirds and compare the entropy reading to the two-component 50/50 presets."
          />
        </>
      }
      controls={
        <div className="space-y-6">
          <ControlSection id="mixture3-presets" title="Presets">
            <PillGroup
              label="Weight presets"
              value={activePresetId}
              options={PRESETS.map((preset) => ({ id: preset.id, label: preset.label }))}
              onChange={applyPreset}
            />
          </ControlSection>

          <ControlSection
            id="mixture3-weights"
            title="Mixing weights"
            description="ρ = p₀·ρ₀ + p₁·ρ₁ + p₊·ρ₊, where ρ₀, ρ₁, ρ₊ are the density matrices of |0⟩, |1⟩ and |+⟩."
          >
            <div className="space-y-4">
              <SimulatorSlider
                id="mixture3-p0"
                label="p₀ (|0⟩)"
                value={p0}
                min={0}
                max={1}
                step={0.01}
                formatValue={(v) => v.toFixed(2)}
                onChange={(value) => {
                  setP0(value);
                  setActivePresetId(null);
                }}
              />
              <SimulatorSlider
                id="mixture3-p1"
                label="p₁ (|1⟩)"
                value={clampedP1}
                min={0}
                max={1 - p0}
                step={0.01}
                formatValue={(v) => v.toFixed(2)}
                onChange={(value) => {
                  setP1(value);
                  setActivePresetId(null);
                }}
              />
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-foreground">p₊ (|+⟩) — derived</span>
                  <span className="font-mono text-sm text-foreground">{pPlus.toFixed(2)}</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-pillar transition-[width] duration-300 ease-out motion-reduce:transition-none"
                    style={{ width: `${Math.max(0, Math.min(100, pPlus * 100))}%` }}
                  />
                </div>
              </div>
            </div>
          </ControlSection>
        </div>
      }
    />
  );
}
