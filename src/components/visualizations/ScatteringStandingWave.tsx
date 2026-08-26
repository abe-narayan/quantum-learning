"use client";

import { useFrameIndex } from "./useFrameIndex";
import { FrameSlider } from "./FrameSlider";
import { PotentialDiagram } from "./PotentialDiagram";

export type StandingWaveFrame = {
  /** Pre-formatted, e.g. "E/V0 = 1.50" or "L = 1.283" — computed by the caller, not this component, so no function props cross the server/client boundary (same reasoning as ParametricCurve's CurveFrame). */
  paramLabel: string;
  xValues: number[];
  potential: number[];
  /** |ψ(x)|², computed by the lesson itself from its own closed-form r/t amplitudes — this component only draws whatever array it's handed. */
  density: number[];
  markers?: { x: number; label: string }[];
  shadedRegion?: { from: number; to: number; label?: string };
};

/**
 * A slider-driven potential + |ψ(x)|² overlay for 1D scattering problems
 * (a step or a barrier) — the same "scrub through precomputed frames"
 * pattern `ParametricCurve` uses, built directly on top of
 * `PotentialDiagram`'s existing potential/wavefunction rendering rather
 * than duplicating it. Each frame is a full snapshot (its own potential
 * shape, density curve, and boundary markers) so a swept parameter that
 * moves a boundary — a barrier's width, for instance — renders correctly
 * frame to frame. Every frame's density must come from the lesson's own
 * real scattering-amplitude formulas; this component performs no physics
 * of its own.
 */
export function ScatteringStandingWave({
  frames,
  sliderLabel = "",
  ariaLabel,
}: {
  frames: StandingWaveFrame[];
  /** Required when `frames.length > 1` (the slider needs a label); ignored for a single static frame. */
  sliderLabel?: string;
  ariaLabel: string;
}) {
  const { index, setIndex, frame } = useFrameIndex(frames);

  return (
    <div className="not-prose space-y-3">
      <PotentialDiagram
        xValues={frame.xValues}
        potential={frame.potential}
        wavefunction={frame.density}
        markers={frame.markers ?? []}
        shadedRegion={frame.shadedRegion}
        ariaLabel={ariaLabel}
      />

      {frames.length > 1 && (
        <FrameSlider
          label={sliderLabel}
          valueLabel={frame.paramLabel}
          index={index}
          max={frames.length - 1}
          onChange={setIndex}
        />
      )}
    </div>
  );
}
