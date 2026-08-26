"use client";

import { useId, useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { blochStateFromAngles } from "@/lib/quantum/bloch";
import { pureStateDensityMatrix, convexCombination, purity, vonNeumannEntropy, validateDensityMatrix } from "@/lib/quantum/densityMatrix";
import { densityMatrixToBlochVector } from "@/lib/quantum/bloch";
import { BlochSphereCanvas } from "../bloch-sphere/BlochSphereCanvas";
import { useAnimatedBlochTarget } from "../bloch-sphere/useAnimatedBlochPoint";
import { DensityMatrixStatePanel } from "./DensityMatrixStatePanel";

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
  label: string;
  p0: number;
  p1: number;
};

// p_plus is always 1 - p0 - p1, so every preset here already sums to 1 —
// there's nothing to normalize or validate at the call site.
const PRESETS: ThreeWeightPreset[] = [
  { label: "Worked example: 0.5 / 0.25 / 0.25", p0: 0.5, p1: 0.25 },
  { label: "Equal thirds", p0: 1 / 3, p1: 1 / 3 },
  { label: "Pure |0⟩", p0: 1, p1: 0 },
];

function WeightSlider({
  label,
  ket,
  value,
  max,
  onChange,
}: {
  label: string;
  ket: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-xs text-foreground">
          {label} ({ket})
        </label>
        <span className="font-mono text-xs text-muted-foreground">{value.toFixed(2)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={0}
        max={max}
        step={0.01}
        value={Math.min(value, max)}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full accent-[var(--brand)]"
      />
    </div>
  );
}

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
  const [activePreset, setActivePreset] = useState<string | null>("Worked example: 0.5 / 0.25 / 0.25");

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

  function applyPreset(preset: ThreeWeightPreset) {
    setP0(preset.p0);
    setP1(preset.p1);
    setActivePreset(preset.label);
  }

  return (
    <div className="not-prose grid gap-6 rounded-3xl border border-border bg-surface p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
      <div>
        <div className="mx-auto max-w-sm">
          <BlochSphereCanvas blochPoint={blochVector} className="mx-auto w-full" />
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          The point pulled by three weighted components at once — not the pairwise workaround above.
        </p>
        <div className="mt-6">
          <DensityMatrixStatePanel rho={rho} purityValue={purityValue} entropyValue={entropyValue} validation={validation} />
        </div>
      </div>

      <div>
        <Badge tone="brand" className="mb-2">
          Three fixed components
        </Badge>
        <p className="text-xs text-muted-foreground">
          ρ = p₀|0⟩⟨0| + p₁|1⟩⟨1| + p₊|+⟩⟨+|. Drag p₀ and p₁ — p₊ is whatever&rsquo;s left, so every position on
          these sliders is automatically a valid probability distribution.
        </p>

        <div className="mt-4 space-y-4">
          <WeightSlider label="p0" ket="|0⟩" value={p0} max={1} onChange={(value) => { setP0(value); setActivePreset(null); }} />
          <WeightSlider label="p1" ket="|1⟩" value={clampedP1} max={1 - p0} onChange={(value) => { setP1(value); setActivePreset(null); }} />
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-foreground">p+ (|+⟩) — derived</span>
              <span className="font-mono text-xs text-muted-foreground">{pPlus.toFixed(2)}</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
              <div className="h-full rounded-full bg-[var(--brand)]" style={{ width: `${Math.max(0, Math.min(100, pPlus * 100))}%` }} />
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {PRESETS.map((preset) => (
            <Button
              key={preset.label}
              size="sm"
              variant={activePreset === preset.label ? "primary" : "secondary"}
              onClick={() => applyPreset(preset)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
