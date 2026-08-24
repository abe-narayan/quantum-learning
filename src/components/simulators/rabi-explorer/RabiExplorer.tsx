"use client";

import { useEffect, useMemo, useState } from "react";
import { exactTwoLevelTrajectory } from "@/lib/quantum/approximationMethods";
import { stateToBlochVector } from "@/lib/quantum/bloch";
import { StateVector } from "@/lib/quantum/state";
import { BlochSphereCanvas } from "@/components/simulators/bloch-sphere/BlochSphereCanvas";
import { PopulationCurve } from "./PopulationCurve";
import { RabiControls } from "./RabiControls";
import { KatexMath } from "@/components/ui/KatexMath";

const SAMPLES = 240;
const PLAY_INTERVAL_MS = 40;

export function RabiExplorer() {
  const [driveStrength, setDriveStrength] = useState(1);
  const [detuning, setDetuning] = useState(0);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Show three full oscillation periods of the effective (generalized) Rabi
  // frequency Omega_eff = sqrt(Delta^2 + 4V^2), the exact splitting between
  // the driven system's two eigenstates.
  const tMax = useMemo(() => {
    const omegaEff = Math.sqrt(detuning * detuning + 4 * driveStrength * driveStrength);
    return (3 * 2 * Math.PI) / omegaEff;
  }, [driveStrength, detuning]);

  const trajectory = useMemo(
    () => exactTwoLevelTrajectory(0, detuning, driveStrength, tMax, SAMPLES),
    [driveStrength, detuning, tMax]
  );

  const handleDriveStrengthChange = (v: number) => {
    setDriveStrength(v);
    setSampleIndex(0);
    setIsPlaying(false);
  };

  const handleDetuningChange = (d: number) => {
    setDetuning(d);
    setSampleIndex(0);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setSampleIndex((i) => {
        if (i >= SAMPLES) {
          setIsPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, PLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isPlaying]);

  const current = trajectory[sampleIndex];
  const p1 = current.c[1].magnitudeSquared();
  const blochPoint = stateToBlochVector(new StateVector([current.c[0], current.c[1]]));

  const populationSamples = useMemo(
    () => trajectory.map((point) => ({ t: point.t, p1: point.c[1].magnitudeSquared() })),
    [trajectory]
  );

  const omegaEff = Math.sqrt(detuning * detuning + 4 * driveStrength * driveStrength);
  const maxPopulation = (4 * driveStrength * driveStrength) / (detuning * detuning + 4 * driveStrength * driveStrength);

  return (
    <div className="not-prose grid gap-6 rounded-3xl border border-border bg-surface p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
      <div className="space-y-6">
        <div className="rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
          {detuning === 0 ? (
            <>On resonance: population fully transfers to |1⟩ and back, P(1) = sin²(Vt).</>
          ) : (
            <>
              Off resonance: population never fully transfers. Maximum reachable P(1) ≈{" "}
              {maxPopulation.toFixed(3)}, set by 4V²/(Δ²+4V²).
            </>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Population of |1⟩ over time</p>
            <PopulationCurve samples={populationSamples} tMax={tMax} currentT={current.t} currentP1={p1} />
          </div>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Bloch-sphere trajectory (drag to rotate)</p>
            <BlochSphereCanvas blochPoint={blochPoint} className="mx-auto w-full max-w-[220px]" />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-surface-muted/60 px-4 py-3">
          <KatexMath
            tex={`P(1) = ${p1.toFixed(4)} \\qquad \\Omega_{\\text{eff}} = \\sqrt{\\Delta^2+4V^2} = ${omegaEff.toFixed(3)}`}
            display
          />
        </div>
      </div>

      <RabiControls
        driveStrength={driveStrength}
        onDriveStrengthChange={handleDriveStrengthChange}
        detuning={detuning}
        onDetuningChange={handleDetuningChange}
        sampleIndex={sampleIndex}
        maxSampleIndex={SAMPLES}
        onSampleIndexChange={(i) => {
          setIsPlaying(false);
          setSampleIndex(i);
        }}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onReset={() => {
          setIsPlaying(false);
          setSampleIndex(0);
        }}
      />
    </div>
  );
}
