"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SplitOperatorEvolver } from "@/lib/quantum/timeEvolution";
import type { Wavefunction1D } from "@/lib/quantum/wavefunction";
import { defaultParamValues, getPreset, type PresetSetup } from "./presets";
import { WavefunctionHeroCanvas } from "./WavefunctionHeroCanvas";
import { autoplayFrameLimit, hasWrappedAround } from "./autoplayRun";
import {
  heroDisplay,
  heroLegend,
  heroNarration,
  HERO_PRESET_IDS,
  HERO_PRESET_LABELS,
  HERO_TRY_THIS,
  type HeroPresetId,
} from "./heroRun";
import { usePrefersReducedMotion } from "@/components/simulators/bloch-sphere/usePrefersReducedMotion";

/**
 * Owns the actual time-evolving state for one fixed preset. Deliberately
 * mounted fresh (via a `key={presetId}` in the parent) on every preset
 * switch rather than reset via an effect, the same remount-over-effect
 * pattern WavefunctionSimulation uses, and for the same reason: it makes
 * "psi always starts at this setup's psi0" structurally true instead of
 * something an effect has to synchronize after the fact.
 */
function WavefunctionHeroSimulation({
  presetId,
  setup,
  prefersReducedMotion,
}: {
  presetId: HeroPresetId;
  setup: PresetSetup;
  prefersReducedMotion: boolean;
}) {
  const evolver = useMemo(
    () => new SplitOperatorEvolver(setup.grid, setup.potential, setup.dt, 1),
    [setup]
  );

  /**
   * How long this run lasts, and why it is not one number for all three
   * presets.
   *
   * It used to be a flat 260 frames, and on the tunneling preset that was the
   * wrong number in the most expensive possible way: the packet was still
   * arriving at the barrier when the run stopped, mid-collision, with 11% of
   * its probability inside the wall and nothing yet on the far side. The hero
   * of a page about quantum mechanics showed a bump sliding sideways and
   * freezing. `presets.ts` documents the measurements behind the tunneling
   * preset's own budget (and behind moving its packet 10 units closer, which
   * is what makes a budget of this size enough).
   */
  const frameLimit = autoplayFrameLimit(setup);
  const display = useMemo(() => heroDisplay(presetId, setup), [presetId, setup]);
  const legend = useMemo(() => heroLegend(presetId), [presetId]);

  const [psi, setPsi] = useState<Wavefunction1D>(setup.psi0);
  const psiRef = useRef(psi);
  const framesRef = useRef(0);

  /**
   * The autoplay run is gated on the panel actually being on screen, and
   * that gate is the whole reason this observer exists.
   *
   * The run stops itself after `frameLimit` frames (4.3 to 5 seconds,
   * depending on the preset). `LazyWavefunctionHeroExplorer` mounts this component on an
   * idle-after-paint timer whose comment says "this widget is always above
   * the fold (it's the homepage hero)". **That is true at `lg` and false on a
   * phone**: `SplitFigure` collapses below `lg` with the figure second, so at
   * 375x812 this panel sits about 1080px down. The run therefore started,
   * played out and paused itself entirely off screen, and every mobile
   * visitor who scrolled down met a motionless bump with a "Play" button,
   * sitting directly above the sentence "This is a real numerical simulation
   * ... computed live in your browser." The page's loudest claim, under the
   * one thing on it that looked like a canned image.
   *
   * Gating the *mount* does not fix this and `observeVisibility: true` on
   * `useDeferredMount` would not either: that hook's idle signal fires
   * independently, capped at 1200ms, whichever comes first. The run is what
   * has to wait.
   *
   * Fires once and disconnects. A reader who pauses it deliberately is not
   * restarted by scrolling away and back, which `autoStartedRef` enforces.
   */
  const panelRef = useRef<HTMLDivElement>(null);
  // jsdom and very old browsers have no IntersectionObserver. Failing open
  // (treating the panel as already on screen) keeps the old behaviour rather
  // than leaving a dead panel. Decided at state initialisation rather than in
  // the effect below, because a synchronous `setState` in an effect body is a
  // cascading render and `react-hooks/set-state-in-effect` rejects it.
  const [onScreen, setOnScreen] = useState(() => typeof IntersectionObserver === "undefined");
  const autoStartedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  /** True once one autoplay run has ended, whether on the frame budget or on the wrap guard below. */
  const [runComplete, setRunComplete] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") return;
    const element = panelRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setOnScreen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion || !onScreen || autoStartedRef.current) return;
    autoStartedRef.current = true;
    setIsPlaying(true);
  }, [onScreen, prefersReducedMotion]);

  // Reduced motion: skip the animation loop entirely and compute the run's
  // final frame directly (no requestAnimationFrame, no intermediate state).
  // The frame it lands on is the same one the animated run stops at, which is
  // the point of choosing that frame by the physics: on the tunneling preset
  // this reader gets the settled two-lobe picture, not a packet frozen
  // half-way into a wall.
  const settledPsi = useMemo(() => {
    if (!prefersReducedMotion) return null;
    return evolver.stepMultiple(setup.psi0, setup.stepsPerFrame * frameLimit);
  }, [prefersReducedMotion, evolver, setup, frameLimit]);

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) return;
    let cancelled = false;
    let frameId: number;

    function frame() {
      if (cancelled) return;
      const next = evolver.stepMultiple(psiRef.current, setup.stepsPerFrame);
      psiRef.current = next;
      setPsi(next);
      framesRef.current += 1;

      // Two ways to end, and the second one is not redundant. The box is
      // periodic (the split-operator method's FFT makes it so), and once the
      // packet reaches an edge it re-enters from the far side: norm is still
      // exactly 1, nothing errors, and every position-space quantity quietly
      // stops describing one packet. On the tunneling preset that turns a
      // measured 2.7% transmission into 18.9% of nonsense. The frame budget is
      // chosen to stop well before that at each preset's own defaults, but a
      // budget is a fixed number and the crossing time is not, so the run also
      // stops the moment the wrap detector fires.
      if (framesRef.current >= frameLimit || hasWrappedAround(next)) {
        setIsPlaying(false);
        setRunComplete(true);
        return;
      }
      frameId = requestAnimationFrame(frame);
    }

    frameId = requestAnimationFrame(frame);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
    };
  }, [isPlaying, evolver, setup.stepsPerFrame, prefersReducedMotion, frameLimit]);

  function handleTogglePlay() {
    if (!isPlaying && runComplete) {
      psiRef.current = setup.psi0;
      setPsi(setup.psi0);
      framesRef.current = 0;
      setRunComplete(false);
    }
    setIsPlaying((v) => !v);
  }

  const displayedPsi = prefersReducedMotion ? settledPsi! : psi;
  const narration = heroNarration(presetId, displayedPsi, setup);

  return (
    <>
      <div
        ref={panelRef}
        className="mt-4 overflow-hidden rounded-panel border border-border bg-surface-muted/40 p-3"
      >
        <WavefunctionHeroCanvas
          grid={setup.grid}
          psi={displayedPsi}
          potential={setup.potential}
          display={display}
          legend={legend}
          barrier={setup.barrier}
        />
      </div>

      {/* What you are seeing, in plain words, from the state on screen. The
          `min-h` reserves the tallest of the three sentences this preset can
          show so the controls below it do not jump as the phase changes: three
          lines at the narrowest homepage column, two from `sm` up. */}
      <p className="mt-4 min-h-16 rounded-panel border border-pillar-edge bg-pillar-wash px-4 py-3 text-sm text-foreground sm:min-h-14">
        {narration}
      </p>
      {/*
        The visible sentence is deliberately not the live region. This run
        steps on every animation frame and starts on its own, so a `polite`
        region attached to it would rewrite itself sixty times a second and a
        screen reader would spend the whole run being cut off mid-sentence.
        Same split as the `/simulators` bench: the eye reads the live sentence,
        the ear gets one clean announcement of where the run actually stopped.
      */}
      <div aria-live="polite" className="sr-only">
        {isPlaying ? "" : narration}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {prefersReducedMotion ? (
          <Badge tone="neutral">Reduced motion: showing the settled frame</Badge>
        ) : (
          <Button variant="primary" size="sm" onClick={handleTogglePlay}>
            {isPlaying ? "Pause" : runComplete ? "Replay" : "Play"}
          </Button>
        )}
        {/* `min-h-11` so the target is 44px tall, not the 20px the bare text
            box gives. It sits in the same row as the 44px Play button, and at
            320px it was the one control in this panel a thumb could miss. */}
        <Link
          href="/simulators"
          className="inline-flex min-h-11 items-center text-sm font-medium text-pillar hover:underline"
        >
          Full explorer →
        </Link>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">{HERO_TRY_THIS[presetId]}</p>

      <p className="mt-2 text-xs text-muted-foreground">
        {prefersReducedMotion
          ? "This is the exact result of a real split-operator time evolution run to completion, not a video."
          : "This is a real numerical simulation: an actual FFT and split-operator time evolution, computed live in your browser."}
      </p>
    </>
  );
}

/**
 * A trimmed-down sibling of WavefunctionExplorer for the homepage: the
 * canvas, three preset buttons, and Play/Pause; no comparison panel, no
 * manual parameter sliders. Mirrors BlochSphereHeroExplorer's role as a
 * second, genuinely interactive proof-point on the homepage, driven by the
 * exact same split-operator evolver used on /simulators, not a scripted
 * animation.
 */
export function WavefunctionHeroExplorer() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const [presetId, setPresetId] = useState<HeroPresetId>(HERO_PRESET_IDS[0]);
  const preset = useMemo(() => getPreset(presetId), [presetId]);
  const setup = useMemo(() => preset.build(defaultParamValues(preset)), [preset]);

  return (
    // No frame of its own. This used to open a `rounded-panel border
    // border-border bg-surface p-6 sm:p-8` root, and both call sites
    // (`home/Hero.tsx` and `/mechanics`) mount it inside an `<Instrument>`,
    // which already draws a border, the same `--radius-panel`, and
    // `.instrument::after`'s corner ticks. The result was a hairline butted
    // against another hairline at an identical radius with the ticks painted
    // over it. The homepage tried to cancel it from the outside with
    // `bodyClassName="p-0"`, which never applied — `cn()` is a plain join with
    // no tailwind-merge, so `p-0` landed *beside* the body's own `p-4 sm:p-5`
    // and stylesheet order decided (compiled through this project's own
    // `@tailwindcss/postcss`: `.p-0` at byte 71344, `.p-4` at 71593,
    // `.sm\:p-5` at 118924 — equal specificity, same layer, later wins).
    //
    // Framing is the caller's job, and `<Instrument>` is the component that
    // does it. This one is content. Two things fall out of that beyond the
    // doubled hairline: the canvas gets back the 50px this panel's border and
    // `p-6` were taking out of it at 320px, and the skeleton in
    // `SimulatorSkeleton.tsx` (`heroWide`) drops the same chrome in step, so
    // the swap on mount does not jump.
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-pillar">Wavefunction explorer</p>
      {/* A `<p>` in display type, not the `<h2>` this was. It is a figure
          title, not a section heading, and `ssr: false` meant the defect was
          invisible to every check that reads served HTML: the homepage's
          served outline was clean and the h2 appeared only after hydration,
          between the `<h1>` and "Make a prediction you can lose."
          `<p>` rather than a demoted `<h3>` because this component is embedded
          at two different outline depths — under the homepage `<h1>` inside a
          label-less `<Instrument>`, and under `/mechanics`'s `<h1>` inside an
          `<Instrument label="Live simulation">` — so any fixed level is wrong
          in one of them, while a paragraph is correct in both. */}
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Watch the Schrödinger equation solve itself
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {HERO_PRESET_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setPresetId(id)}
            aria-pressed={id === presetId}
            // Two fixes over the previous class strings, which differed only
            // in colour:
            //   - `min-h-11`: at `py-1.5` around 12px text these stood about
            //     28px tall, the smallest tap targets on the homepage.
            //   - a focus-visible ring: there was none at all, on either
            //     state, so a keyboard reader tabbing across the three presets
            //     had nothing but the browser default to go on.
            // The border is now on both states so selecting one no longer
            // shifts the row by 2px, matching `visualizations/PresetToggle`.
            className={
              id === presetId
                ? "inline-flex min-h-11 items-center rounded-full border border-pillar bg-pillar px-4 py-1.5 text-xs font-medium text-brand-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                : "inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            }
          >
            {HERO_PRESET_LABELS[id]}
          </button>
        ))}
      </div>

      <WavefunctionHeroSimulation
        key={presetId}
        presetId={presetId}
        setup={setup}
        prefersReducedMotion={prefersReducedMotion}
      />
    </div>
  );
}
