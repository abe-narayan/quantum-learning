"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SplitOperatorEvolver } from "@/lib/quantum/timeEvolution";
import type { Wavefunction1D } from "@/lib/quantum/wavefunction";
import type { PresetSetup } from "./presets";
import { autoplayFrameLimit, hasWrappedAround } from "./autoplayRun";
import { momentumDisplayRange, WavefunctionCanvas, type CanvasMode } from "./WavefunctionCanvas";
import { StatePanel } from "./StatePanel";
import { PlaybackControls } from "./PlaybackControls";
import { ComparisonPanel } from "./ComparisonPanel";

/**
 * The first-contact autoplay pass uses the same bounded-pass convention, and
 * the same per-preset budget, as the homepage hero: `autoplayFrameLimit`
 * returns `DEFAULT_AUTOPLAY_FRAMES` unless the configuration asks for its own.
 * Only `tunneling` currently does, and `presets.ts` documents why 260 frames
 * left that preset stopped mid-collision on this bench too, not just on the
 * homepage.
 */

/**
 * Owns everything that evolves over time for one fixed configuration: the
 * current wavefunction, elapsed time, and the animation loop. Deliberately
 * mounted fresh (via a `key` on the config, in WavefunctionExplorer) every
 * time the preset or a parameter changes, rather than reset via an effect.
 * An effect-based reset still renders once with the *old* `psi` next to
 * the *new* `setup` (different grids) before it runs, and anything reading
 * both together in that render (like ComparisonPanel's overlap fidelity)
 * throws. Remounting via `key` means `psi`'s initial state is *always*
 * `setup.psi0` for the exact `setup` this instance was built with. The
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
  /** Forwarded to WavefunctionCanvas; see its doc comment. */
  showMeanSpreadOverlay?: boolean;
}) {
  const evolver = useMemo(
    () => new SplitOperatorEvolver(setup.grid, setup.potential, setup.dt, 1),
    [setup]
  );
  const frameLimit = autoplayFrameLimit(setup);

  const [psi, setPsi] = useState<Wavefunction1D>(setup.psi0);
  const [t, setT] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const psiRef = useRef(psi);
  const containerRef = useRef<HTMLDivElement>(null);

  // A lesson can carry several of these embeds; nothing stops a reader from
  // hitting Play, scrolling on, and leaving the stepper running indefinitely
  // off-screen. This tracks visibility only; it doesn't touch `isPlaying`
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

  // One bounded autoplay pass on first contact, the bench's "open
  // mid-phenomenon" rule for an instrument whose whole point is time
  // evolution. Runs once per mount (a preset/parameter change remounts via
  // `key`, exactly like the homepage hero), is capped at this configuration's
  // `autoplayFrameLimit` by the animation loop below, and is skipped
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
        // The budget, or the periodic wrap, whichever comes first. Past the
        // wrap the packet is re-entering from the far side and every
        // position-space number on this page (including the transmitted and
        // reflected fractions in the comparison panel) has stopped describing
        // one packet. The narration below already says so; there is no reason
        // for an automatic pass nobody asked for to keep running into it.
        if (autoplayFramesRef.current >= frameLimit || hasWrappedAround(next)) {
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
  }, [isPlaying, isVisible, evolver, setup.stepsPerFrame, setup.dt, speed, prefersReducedMotion, frameLimit]);

  function handleTogglePlay() {
    autoplayRef.current = false;
    setIsPlaying((v) => !v);
  }

  /**
   * One Step advances exactly what one frame of Play advances at 1x speed:
   * `setup.stepsPerFrame` integrator steps, not one.
   *
   * It used to advance a single `dt`, which made Step and Play different units
   * on the same instrument, and on three of the eight presets it made Step
   * useless. `stepsPerFrame` is 4 on the free Gaussian but 100 on the two
   * infinite-well presets and 150 on `superposition`, so a click moved the
   * simulation 1/150th of a frame: t advanced by 0.0002 where a frame of Play
   * advances 0.03, and the 260-frame autoplay pass covers t = 7.8. A reader
   * pressing Step saw nothing change, because nothing had.
   *
   * That is a reduced-motion bug, not a nicety. Under
   * `prefers-reduced-motion` this is the *only* thing left driving the
   * simulation: `PlaybackControls` replaces Play with a "continuous play
   * disabled" badge and a Step button, and the rAF loop above returns
   * immediately. So the reduced-motion path was present, wired, correct in
   * outline and, on the presets whose whole subject is a state that beats or
   * sloshes, incapable of reaching the phenomenon: ~39,000 clicks to cover
   * what the motion path plays automatically in 260 frames.
   *
   * One frame's work is one frame's cost, ~37ms on the heaviest preset
   * (measured against the real evolver, 512-point grid, 100 steps), which is
   * fine for a discrete button press and is exactly what the animation loop
   * already spends per frame.
   */
  function handleStep() {
    autoplayRef.current = false;
    const next = evolver.stepMultiple(psiRef.current, setup.stepsPerFrame);
    psiRef.current = next;
    setPsi(next);
    setT((prev) => prev + setup.dt * setup.stepsPerFrame);
  }

  function handleReset() {
    autoplayRef.current = false;
    setIsPlaying(false);
    setPsi(setup.psi0);
    psiRef.current = setup.psi0;
    setT(0);
  }

  // Computed once per render, not once per displaying component; see
  // Wavefunction1D.momentumStatistics's doc comment.
  const { meanMomentum, kineticEnergy } = useMemo(() => psi.momentumStatistics(1), [psi]);

  // Live narration, matching the aria-live line every other instrument on the
  // bench carries: this one had a numeric StatePanel but nothing that said in
  // words what the numbers meant, and nothing announced to a screen reader as
  // the simulation ran. Both quantities are read off the real evolved state,
  // no separate model.
  const initialSpread = useMemo(() => Math.sqrt(setup.psi0.variancePosition()), [setup.psi0]);
  const spread = Math.sqrt(psi.variancePosition());
  const spreadRatio = initialSpread > 0 ? spread / initialSpread : 1;

  /**
   * Whether the packet has run into the end of the simulation box.
   *
   * The box is periodic (see `probabilityNearGridEdges`), so it does not
   * leave: it comes back in the far side, and from that moment ⟨x⟩ and the
   * width below stop describing one packet. At the ends of the free-particle
   * preset's own sliders this happens partway through the automatic first
   * playback, and the sentence the reader used to get there ("Spreading like
   * this is not the simulation losing accuracy") was the one thing on screen
   * insisting a numerical artifact was physics. Norm is still exactly 1, so
   * the Norm readout gives no warning either.
   */
  /**
   * The k window the momentum view is drawn in, fixed for this run.
   *
   * Derived from `setup.psi0` and not from the live `psi` on purpose: sizing
   * the axis from the frame being drawn was measured hopping between rungs 38
   * times over 400 frames on `infinite-well-excited`, because an eigenstate's
   * slow tail wobbles across a rung boundary under the finite-wall Trotter
   * error. See THE MOMENTUM AXIS in `WavefunctionCanvas`. This component is
   * remounted (via `key`) on every preset or parameter change, so "once per
   * mount" is exactly "once per configuration".
   */
  const momentumRange = useMemo(() => momentumDisplayRange(setup.psi0), [setup.psi0]);

  // Same predicate the autoplay loop stops on, on the same threshold; the one
  // shared definition lives in `autoplayRun`.
  const wrappedAround = useMemo(() => hasWrappedAround(psi), [psi]);

  const narration = setup.isStationary
    ? `t = ${t.toFixed(2)}. This is an energy eigenstate: its shape has not changed and never will, no matter how long you run it. Switch to the Re / Im view and you'll see what is still moving: the phase turns while the probability sits perfectly still.`
    : wrappedAround
      ? `t = ${t.toFixed(2)}. The packet has reached the end of the simulation box, which wraps around, so part of it is now re-entering from the far side. The position and width figures below stop describing a single packet from here on; press Reset to run it again.`
      : `t = ${t.toFixed(2)}. The packet is centred at x = ${psi
          .expectationPosition()
          .toFixed(1)} and is now ${spreadRatio.toFixed(2)}× as wide as it started. ${
          spreadRatio > 1.05
            ? "Spreading like this is not the simulation losing accuracy; an unconfined quantum particle genuinely becomes less and less localized over time."
            : // "Watch that width" is an instruction to watch something move,
              // and under reduced motion nothing is going to: the rAF loop
              // above returns immediately and the autoplay pass never starts,
              // so this reader is sitting on a still frame with Step forward as
              // their only way on. Telling them what to press is the same
              // sentence doing the same job through the control they have.
              prefersReducedMotion
              ? "Press Step forward to advance the evolution one frame at a time and watch that width change."
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
        momentumRange={momentumRange}
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
        instrument steps on every animation frame, and it autoplays a bounded
        pass on first contact without anyone pressing anything, so a
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
