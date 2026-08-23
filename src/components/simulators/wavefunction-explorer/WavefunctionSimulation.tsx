"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SplitOperatorEvolver } from "@/lib/quantum/timeEvolution";
import type { Wavefunction1D } from "@/lib/quantum/wavefunction";
import type { PresetSetup } from "./presets";
import { WavefunctionCanvas, type CanvasMode } from "./WavefunctionCanvas";
import { StatePanel } from "./StatePanel";
import { PlaybackControls } from "./PlaybackControls";
import { ComparisonPanel } from "./ComparisonPanel";

/**
 * Owns everything that evolves over time for one fixed configuration: the
 * current wavefunction, elapsed time, and the animation loop. Deliberately
 * mounted fresh (via a `key` on the config, in WavefunctionExplorer) every
 * time the preset or a parameter changes, rather than reset via an effect
 * — an effect-based reset still renders once with the *old* `psi` next to
 * the *new* `setup` (different grids) before it runs, and anything reading
 * both together in that render (like ComparisonPanel's overlap fidelity)
 * throws. Remounting via `key` means `psi`'s initial state is *always*
 * `setup.psi0` for the exact `setup` this instance was built with — the
 * mismatch is structurally impossible rather than patched over.
 */
export function WavefunctionSimulation({
  setup,
  mode,
  speed,
  onSpeedChange,
  prefersReducedMotion,
}: {
  setup: PresetSetup;
  mode: CanvasMode;
  speed: number;
  onSpeedChange: (speed: number) => void;
  prefersReducedMotion: boolean;
}) {
  const evolver = useMemo(
    () => new SplitOperatorEvolver(setup.grid, setup.potential, setup.dt, 1),
    [setup]
  );

  const [psi, setPsi] = useState<Wavefunction1D>(setup.psi0);
  const [t, setT] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const psiRef = useRef(psi);

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) return;
    let cancelled = false;
    let frameId: number;

    function frame() {
      if (cancelled) return;
      const stepsThisFrame = Math.max(1, Math.round(setup.stepsPerFrame * speed));
      const next = evolver.stepMultiple(psiRef.current, stepsThisFrame);
      psiRef.current = next;
      setPsi(next);
      setT((prev) => prev + setup.dt * stepsThisFrame);
      frameId = requestAnimationFrame(frame);
    }

    frameId = requestAnimationFrame(frame);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    };
  }, [isPlaying, evolver, setup.stepsPerFrame, setup.dt, speed, prefersReducedMotion]);

  function handleStep() {
    const next = evolver.step(psiRef.current);
    psiRef.current = next;
    setPsi(next);
    setT((prev) => prev + setup.dt);
  }

  function handleReset() {
    setIsPlaying(false);
    setPsi(setup.psi0);
    psiRef.current = setup.psi0;
    setT(0);
  }

  // Computed once per render, not once per displaying component — see
  // Wavefunction1D.momentumStatistics's doc comment.
  const { meanMomentum, kineticEnergy } = useMemo(() => psi.momentumStatistics(1), [psi]);

  return (
    <div className="space-y-3">
      <WavefunctionCanvas grid={setup.grid} psi={psi} potential={setup.potential} mode={mode} />

      <PlaybackControls
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((v) => !v)}
        onStep={handleStep}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={onSpeedChange}
        prefersReducedMotion={prefersReducedMotion}
      />

      <StatePanel psi={psi} t={t} meanMomentum={meanMomentum} energy={kineticEnergy + psi.expectationPotential(setup.potential)} />

      <ComparisonPanel
        psi={psi}
        psi0={setup.psi0}
        potential={setup.potential}
        kineticEnergy={kineticEnergy}
        analyticalEnergy={setup.analyticalEnergy}
        boundary={setup.boundary}
      />
    </div>
  );
}
