"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SplitOperatorEvolver } from "@/lib/quantum/timeEvolution";
import type { Wavefunction1D } from "@/lib/quantum/wavefunction";
import { defaultParamValues, getPreset, type PresetId, type PresetSetup } from "./presets";
import { WavefunctionCanvas } from "./WavefunctionCanvas";
import { usePrefersReducedMotion } from "@/components/simulators/bloch-sphere/usePrefersReducedMotion";

const HERO_PRESET_IDS: readonly PresetId[] = ["free-gaussian", "tunneling", "harmonic-superposition"];
const HERO_PRESET_LABELS: Record<string, string> = {
  "free-gaussian": "Free particle",
  tunneling: "Tunnel through a barrier",
  "harmonic-superposition": "Harmonic oscillator",
};
const HERO_PRESETS = HERO_PRESET_IDS.map((id) => getPreset(id));

/**
 * How many animation frames one autoplay run advances before pausing
 * itself: long enough to show the physics actually develop, short enough
 * to read as a proof-of-concept rather than a looping background animation.
 */
const AUTOPLAY_FRAME_LIMIT = 260;

/**
 * Owns the actual time-evolving state for one fixed preset. Deliberately
 * mounted fresh (via a `key={presetId}` in the parent) on every preset
 * switch rather than reset via an effect, the same remount-over-effect
 * pattern WavefunctionSimulation uses, and for the same reason: it makes
 * "psi always starts at this setup's psi0" structurally true instead of
 * something an effect has to synchronize after the fact.
 */
function WavefunctionHeroSimulation({
  setup,
  prefersReducedMotion,
}: {
  setup: PresetSetup;
  prefersReducedMotion: boolean;
}) {
  const evolver = useMemo(
    () => new SplitOperatorEvolver(setup.grid, setup.potential, setup.dt, 1),
    [setup]
  );

  const [psi, setPsi] = useState<Wavefunction1D>(setup.psi0);
  const psiRef = useRef(psi);
  const framesRef = useRef(0);

  /**
   * The autoplay run is gated on the panel actually being on screen, and
   * that gate is the whole reason this observer exists.
   *
   * `AUTOPLAY_FRAME_LIMIT` frames is about 4.3 seconds, after which the run
   * stops itself. `LazyWavefunctionHeroExplorer` mounts this component on an
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
  /** True once one autoplay run has reached `AUTOPLAY_FRAME_LIMIT`. */
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
  const settledPsi = useMemo(() => {
    if (!prefersReducedMotion) return null;
    return evolver.stepMultiple(setup.psi0, setup.stepsPerFrame * AUTOPLAY_FRAME_LIMIT);
  }, [prefersReducedMotion, evolver, setup]);

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

      if (framesRef.current >= AUTOPLAY_FRAME_LIMIT) {
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
  }, [isPlaying, evolver, setup.stepsPerFrame, prefersReducedMotion]);

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

  return (
    <>
      <div
        ref={panelRef}
        className="mt-4 overflow-hidden rounded-panel border border-border bg-surface-muted/40 p-3"
      >
        <WavefunctionCanvas grid={setup.grid} psi={displayedPsi} potential={setup.potential} mode="density" />
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

      <p className="mt-4 text-xs text-muted-foreground">
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

  const [presetId, setPresetId] = useState<PresetId>(HERO_PRESETS[0].id);
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
        {HERO_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPresetId(p.id)}
            aria-pressed={p.id === presetId}
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
              p.id === presetId
                ? "inline-flex min-h-11 items-center rounded-full border border-pillar bg-pillar px-4 py-1.5 text-xs font-medium text-brand-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                : "inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            }
          >
            {HERO_PRESET_LABELS[p.id]}
          </button>
        ))}
      </div>

      <WavefunctionHeroSimulation key={presetId} setup={setup} prefersReducedMotion={prefersReducedMotion} />
    </div>
  );
}
