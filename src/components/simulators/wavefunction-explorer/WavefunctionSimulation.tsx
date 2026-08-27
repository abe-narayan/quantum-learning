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
  showMeanSpreadOverlay = false,
}: {
  setup: PresetSetup;
  mode: CanvasMode;
  speed: number;
  onSpeedChange: (speed: number) => void;
  prefersReducedMotion: boolean;
  /** Forwarded to WavefunctionCanvas — see its doc comment. */
  showMeanSpreadOverlay?: boolean;
}) {
  const evolver = useMemo(
    () => new SplitOperatorEvolver(setup.grid, setup.potential, setup.dt, 1),
    [setup]
  );

  const [psi, setPsi] = useState<Wavefunction1D>(setup.psi0);
  const [t, setT] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const psiRef = useRef(psi);
  const containerRef = useRef<HTMLDivElement>(null);

  // A lesson can carry several of these embeds; nothing stops a reader from
  // hitting Play, scrolling on, and leaving the stepper running indefinitely
  // off-screen. This tracks visibility only — it doesn't touch `isPlaying`
  // (the Play/Pause button keeps showing the reader's actual intent) so the
  // loop silently resumes on scroll-back rather than needing a second click.
  // Defaults `true` so an already-visible, already-playing instance never
  // stalls waiting on the observer's first callback.
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      rootMargin: "150px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion || !isVisible) return;
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
  }, [isPlaying, isVisible, evolver, setup.stepsPerFrame, setup.dt, speed, prefersReducedMotion]);

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

  // Live narration, matching the aria-live line every other instrument on the
  // bench carries: this one had a numeric StatePanel but nothing that said in
  // words what the numbers meant, and nothing announced to a screen reader as
  // the simulation ran. Both quantities are read off the real evolved state —
  // no separate model.
  const initialSpread = useMemo(() => Math.sqrt(setup.psi0.variancePosition()), [setup.psi0]);
  const spread = Math.sqrt(psi.variancePosition());
  const spreadRatio = initialSpread > 0 ? spread / initialSpread : 1;
  const narration = setup.isStationary
    ? `t = ${t.toFixed(2)}. This is an energy eigenstate: its shape has not changed and never will, no matter how long you run it. Switch to the Re / Im view and you'll see what is still moving — the phase turns while the probability sits perfectly still.`
    : `t = ${t.toFixed(2)}. The packet is centred at x = ${psi
        .expectationPosition()
        .toFixed(1)} and is now ${spreadRatio.toFixed(2)}× as wide as it started. ${
        spreadRatio > 1.05
          ? "Spreading like this is not the simulation losing accuracy — an unconfined quantum particle genuinely becomes less and less localized over time."
          : "Watch that width: it does not stay put."
      }`;

  return (
    <div ref={containerRef} className="space-y-3">
      <WavefunctionCanvas
        grid={setup.grid}
        psi={psi}
        potential={setup.potential}
        mode={mode}
        showMeanSpreadOverlay={showMeanSpreadOverlay}
      />

      <PlaybackControls
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((v) => !v)}
        onStep={handleStep}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={onSpeedChange}
        prefersReducedMotion={prefersReducedMotion}
      />

      <div
        aria-live="polite"
        className="rounded-xl border border-pillar-edge bg-pillar-wash px-4 py-3 text-sm text-foreground"
      >
        {narration}
      </div>

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
