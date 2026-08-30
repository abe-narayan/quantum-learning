"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { KatexMath } from "@/components/ui/KatexMath";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { centerIntensity, MAX_INTENSITY, WaveInterferenceCanvas } from "./WaveInterferenceCanvas";
import { FigureReadouts } from "../FigureReadouts";

const TWO_PI = 2 * Math.PI;
const PLAY_INTERVAL_MS = 50;
/** A full 0->2pi sweep takes about 6.5s — slow enough to watch fringes brighten and dim, not a blur. */
const PHASE_STEP_PER_TICK = TWO_PI / 130;
/**
 * First-contact phase: phi = 2*pi/3, the exact phase the embedding lesson's
 * worked example evaluates (I/4A^2 = 0.250), so the figure opens mid-phenomenon
 * with partial interference on screen instead of the featureless fully-bright
 * fringe at phi = 0. Reset still returns to the phi = 0 reference state.
 */
const INITIAL_PHASE = TWO_PI / 3;

/**
 * Default third "Try this" bullet — written for
 * superposition-interference-and-phase.mdx, whose own worked example
 * computes P(+) = 1/4 at phi = 2*pi/3 using exactly this readout's
 * normalized formula. A lesson with a different worked example (different
 * phase, different numbers, no P(+) notation) should pass its own
 * `tryThisHint` instead of relying on this default.
 */
const DEFAULT_TRY_THIS_HINT =
  "Stop at φ = 2π/3 ≈ 2.094: the readout should show I/4A² = 0.250, matching this lesson’s worked example for P(+) at the same phase.";

interface WaveInterferenceProps {
  /**
   * The third "Try this" bullet, tying the phase-sweep readout back to the
   * embedding lesson's own worked example. Defaults to the phrasing that
   * matches superposition-interference-and-phase.mdx; any other lesson
   * embedding this component should supply a hint matching its own numbers.
   */
  tryThisHint?: string;
}

/**
 * Two coherent point sources interfering on a screen, with the relative
 * phase between them as the one control — the same relative phase, e^{i*phi},
 * that this lesson's own derivation carries between the two terms of a
 * superposition. Dragging the slider (or pressing Play) sweeps phi from 0
 * to 2*pi and watches the central fringe brighten and dim exactly on the
 * 4*A^2*cos^2(phi/2) curve, i.e. (normalized) the same (1+cos(phi))/2 shape
 * derived above for P(+).
 */
export function WaveInterference({ tryThisHint = DEFAULT_TRY_THIS_HINT }: WaveInterferenceProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const sliderId = useId();

  const [phase, setPhase] = useState(INITIAL_PHASE);
  const [isPlaying, setIsPlaying] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  /** Phase accumulated since Play was pressed — bounds the loop to one full sweep. */
  const sweepRef = useRef(0);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying || prefersReducedMotion) return;
    intervalRef.current = setInterval(() => {
      // Auto-pause after one full 2*pi sweep (matching the steppers'
      // auto-stop convention) rather than looping forever — a second lap adds
      // nothing the first didn't show, and the visitor can always press Play
      // again.
      sweepRef.current += PHASE_STEP_PER_TICK;
      if (sweepRef.current >= TWO_PI) {
        setIsPlaying(false);
        return;
      }
      setPhase((p) => (p + PHASE_STEP_PER_TICK) % TWO_PI);
    }, PLAY_INTERVAL_MS);
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [isPlaying, prefersReducedMotion]);

  const handlePlayToggle = () => {
    setIsPlaying((p) => {
      if (!p) sweepRef.current = 0;
      return !p;
    });
  };

  const handlePhaseChange = (next: number) => {
    setIsPlaying(false);
    setPhase(next);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPhase(0);
  };

  const raw = centerIntensity(phase);
  const normalized = raw / MAX_INTENSITY; // == cos^2(phase/2) == (1 + cos(phase)) / 2

  const phaseOverPi = phase / Math.PI;

  return (
    <div className="not-prose rounded-3xl border border-border bg-surface p-6">
      <div className="mb-5">
        <Badge tone="brand" className="mb-1.5">
          Two coherent sources
        </Badge>
        <p className="text-sm text-muted-foreground">
          S₁ and S₂ emit identical waves; S₂&rsquo;s wave carries an extra relative phase φ. Drag the
          slider (or press Play) and watch the central fringe swing from fully bright to fully dark and
          back, exactly on the 4A²cos²(φ/2) curve.
        </p>
      </div>

      <WaveInterferenceCanvas phase={phase} />

      {/* No `overflow-x-auto` here: the only child is a block-level
          `.katex-display`, which fills this content box and carries its own
          horizontal scroll (globals.css §6), so this box never had anything to
          scroll — and `overflow-x: auto` with `overflow-y: visible` computes the
          y axis to `auto` too, which would silently clip a tall equation. The tab
          stop the slab needs now lives on `.katex-display` itself; see
          `focusableDisplayHtml` in src/components/ui/KatexMath.tsx. */}
      <div className="mt-4 panel-inset px-4 py-3">
        <KatexMath
          tex={`I(\\varphi) = 4A^2\\cos^2(\\varphi/2) = ${raw.toFixed(3)} \\qquad \\frac{I}{4A^2} = \\cos^2(\\varphi/2) = \\frac{1+\\cos\\varphi}{2} = ${normalized.toFixed(3)}`}
          display
        />
      </div>

      <FigureReadouts
        className="mt-4"
        items={[
          { label: "φ (rad)", value: phase.toFixed(3) },
          { label: "φ (× π)", value: `${phaseOverPi.toFixed(3)}π` },
          { label: "I(φ) = 4A²cos²(φ/2)", value: raw.toFixed(3) },
          { label: "I / 4A² = P(+)-shape", value: normalized.toFixed(3) },
        ]}
      />

      <div className="mt-6">
        <label htmlFor={sliderId} className="block">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-foreground">Relative phase φ</span>
            <span className="font-mono text-xs text-muted-foreground">{phase.toFixed(2)} rad</span>
          </div>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={TWO_PI}
            step={0.01}
            value={phase}
            onChange={(event) => handlePhaseChange(Number(event.target.value))}
            aria-label="Relative phase phi, in radians, from 0 to 2 pi"
            // Without `aria-valuetext` this slider announced a bare number —
            // "2.09" — and nothing else, which is the one thing about this
            // figure a screen-reader user cannot already work out. Everything
            // the control exists to demonstrate (the central fringe swinging
            // bright to dark on cos²(φ/2)) lives in the intensity readout, and
            // that readout is painted into a canvas and a KaTeX block that
            // never announce. Dragging from 0 to 2π therefore produced a
            // hundred meaningless decimals and zero physics. The value text now
            // carries the phase in units of π *and* the normalized intensity,
            // so the rise-and-fall is audible on the control itself rather than
            // only visible in the fringes. Every other slider on this bench
            // (`FrameSlider`, `SimulatorSlider`, the steppers) already does
            // this; this one was the outlier.
            aria-valuetext={`phi = ${phaseOverPi.toFixed(2)} pi radians, central fringe intensity I over 4 A squared = ${normalized.toFixed(3)}`}
            className="mt-2 h-11 w-full accent-brand"
          />
          <div className="mt-1 flex justify-between text-micro font-mono text-muted-foreground">
            <span>0</span>
            <span>π/2</span>
            <span>π</span>
            <span>3π/2</span>
            <span>2π</span>
          </div>
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {prefersReducedMotion ? (
            <Badge tone="neutral">Reduced motion: drag the slider above to scrub</Badge>
          ) : (
            <Button variant="primary" size="sm" className="min-h-11" onClick={handlePlayToggle}>
              {isPlaying ? "Pause" : "Play"}
            </Button>
          )}
          <Button variant="ghost" size="sm" className="min-h-11" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-panel border border-accent/30 bg-accent/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">Try this</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-foreground">
          <li>
            Set φ = 0: the two sources are perfectly in step, the central fringe reads 100%, and
            I(φ) = 4A²: fully constructive interference.
          </li>
          <li>
            Drag to φ = π: the central fringe goes fully dark (0%) because the two waves are exactly out of
            step and cancel completely, I(φ) = 0.
          </li>
          <li>{tryThisHint}</li>
        </ul>
      </div>
    </div>
  );
}
