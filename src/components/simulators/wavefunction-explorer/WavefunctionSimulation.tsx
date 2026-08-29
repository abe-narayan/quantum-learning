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
 * How many animation frames the first-contact autoplay pass advances before
 * pausing itself — the same bounded-pass convention (and the same budget)
 * as WavefunctionHeroExplorer's AUTOPLAY_FRAME_LIMIT: long enough to show
 * the physics actually develop, short enough to read as a proof-of-concept
 * rather than a looping background animation.
 */
const AUTOPLAY_FRAME_LIMIT = 260;

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

  // First-contact autoplay bookkeeping: one bounded pass starts on the first
  // intersection, and any explicit interaction (Play/Pause, Step, Reset)
  // hands full control back to the reader by dropping the frame budget.
  const autoplayRef = useRef(false);
  const autoplayFramesRef = useRef(0);
  const hasAutoplayedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      rootMargin: "150px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // One bounded autoplay pass on first contact — the bench's "open
  // mid-phenomenon" rule for an instrument whose whole point is time
  // evolution. Runs once per mount (a preset/parameter change remounts via
  // `key`, exactly like the homepage hero), is capped at
  // AUTOPLAY_FRAME_LIMIT frames by the animation loop below, and is skipped
  // entirely under reduced motion. Frames only advance while visible, so a
  // below-the-fold embed effectively starts its pass on first scroll into
  // view.
  useEffect(() => {
    if (prefersReducedMotion || !isVisible || hasAutoplayedRef.current) return;
    hasAutoplayedRef.current = true;
    autoplayRef.current = true;
    autoplayFramesRef.current = 0;
    setIsPlaying(true);
  }, [isVisible, prefersReducedMotion]);

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
      if (autoplayRef.current) {
        autoplayFramesRef.current += 1;
        if (autoplayFramesRef.current >= AUTOPLAY_FRAME_LIMIT) {
          autoplayRef.current = false;
          setIsPlaying(false);
          return;
        }
      }
      frameId = requestAnimationFrame(frame);
    }

    frameId = requestAnimationFrame(frame);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    };
  }, [isPlaying, isVisible, evolver, setup.stepsPerFrame, setup.dt, speed, prefersReducedMotion]);

  function handleTogglePlay() {
    autoplayRef.current = false;
    setIsPlaying((v) => !v);
  }

  function handleStep() {
    autoplayRef.current = false;
    const next = evolver.step(psiRef.current);
    psiRef.current = next;
    setPsi(next);
    setT((prev) => prev + setup.dt);
  }

  function handleReset() {
    autoplayRef.current = false;
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
        onTogglePlay={handleTogglePlay}
        onStep={handleStep}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={onSpeedChange}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/*
        The visible narration is deliberately not the live region. This
        instrument steps on every animation frame — and it autoplays a bounded
        260-frame pass on first contact without anyone pressing anything — so a
        `polite` region attached here rewrote itself ~60 times a second and a
        screen reader spent the whole run being cut off mid-sentence, never
        completing one. Same split as RabiExplorer: the eye reads the live
        sentence, the ear gets one clean announcement of where the evolution
        actually stopped. Step and Reset still announce immediately, because
        those leave `isPlaying` false.
      */}
      <div className="rounded-panel border border-pillar-edge bg-pillar-wash px-4 py-3 text-sm text-foreground">
        {narration}
      </div>
      <div aria-live="polite" className="sr-only">
        {isPlaying ? "" : narration}
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
