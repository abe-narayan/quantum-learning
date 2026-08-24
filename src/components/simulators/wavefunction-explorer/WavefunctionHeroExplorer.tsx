"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SplitOperatorEvolver } from "@/lib/quantum/timeEvolution";
import type { Wavefunction1D } from "@/lib/quantum/wavefunction";
import { PRESETS, defaultParamValues, type PresetId, type PresetSetup } from "./presets";
import { WavefunctionCanvas } from "./WavefunctionCanvas";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

const HERO_PRESET_IDS: readonly PresetId[] = ["free-gaussian", "tunneling", "harmonic-ground"];
const HERO_PRESET_LABELS: Record<string, string> = {
  "free-gaussian": "Free particle",
  tunneling: "Tunnel through a barrier",
  "harmonic-ground": "Harmonic oscillator",
};
const HERO_PRESETS = HERO_PRESET_IDS.map((id) => PRESETS.find((p) => p.id === id)!);

/**
 * How many animation frames one autoplay run advances before pausing
 * itself — long enough to show the physics actually develop, short enough
 * to read as a proof-of-concept rather than a looping background animation.
 */
const AUTOPLAY_FRAME_LIMIT = 260;

/**
 * Owns the actual time-evolving state for one fixed preset. Deliberately
 * mounted fresh (via a `key={presetId}` in the parent) on every preset
 * switch rather than reset via an effect — the same remount-over-effect
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
  const [isPlaying, setIsPlaying] = useState(!prefersReducedMotion);
  const psiRef = useRef(psi);
  const framesRef = useRef(0);

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
    if (!isPlaying && framesRef.current >= AUTOPLAY_FRAME_LIMIT) {
      psiRef.current = setup.psi0;
      setPsi(setup.psi0);
      framesRef.current = 0;
    }
    setIsPlaying((v) => !v);
  }

  const displayedPsi = prefersReducedMotion ? settledPsi! : psi;

  return (
    <>
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface-muted/40 p-3">
        <WavefunctionCanvas grid={setup.grid} psi={displayedPsi} potential={setup.potential} mode="density" />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {prefersReducedMotion ? (
          <Badge tone="neutral">Reduced motion — showing the settled frame</Badge>
        ) : (
          <Button variant="primary" size="sm" onClick={handleTogglePlay}>
            {isPlaying ? "Pause" : "Play"}
          </Button>
        )}
        <Link href="/simulators" className="text-sm font-medium text-brand hover:underline">
          Full explorer →
        </Link>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {prefersReducedMotion
          ? "This is the exact result of a real split-operator time evolution run to completion, not a video."
          : "This is a real numerical simulation — an actual FFT and split-operator time evolution, computed live in your browser."}
      </p>
    </>
  );
}

/**
 * A trimmed-down sibling of WavefunctionExplorer for the homepage: the
 * canvas, three preset buttons, and Play/Pause — no comparison panel, no
 * manual parameter sliders. Mirrors BlochSphereHeroExplorer's role as a
 * second, genuinely interactive proof-point on the homepage, driven by the
 * exact same split-operator evolver used on /simulators, not a scripted
 * animation.
 */
export function WavefunctionHeroExplorer() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const [presetId, setPresetId] = useState<PresetId>(HERO_PRESETS[0].id);
  const preset = useMemo(() => PRESETS.find((p) => p.id === presetId)!, [presetId]);
  const setup = useMemo(() => preset.build(defaultParamValues(preset)), [preset]);

  return (
    <div className="rounded-xl border border-border bg-surface p-6 sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">Wavefunction explorer</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Watch the Schrödinger equation solve itself
      </h2>

      <div className="mt-6 flex flex-wrap gap-2">
        {HERO_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPresetId(p.id)}
            aria-pressed={p.id === presetId}
            className={
              p.id === presetId
                ? "rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground transition-colors"
                : "rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-muted"
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
