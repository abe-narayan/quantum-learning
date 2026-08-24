"use client";

import { VectorDiagram, type PlaneVector } from "./VectorDiagram";
import { useFrameIndex } from "./useFrameIndex";
import { FrameSlider } from "./FrameSlider";

export type VectorFrame = {
  /** Pre-formatted, e.g. "θ = 30°" — computed by the caller, matching `ParametricCurve`'s `CurveFrame`. */
  paramLabel: string;
  vectors: PlaneVector[];
};

/**
 * `VectorDiagram` plus a slider that scrubs through precomputed frames —
 * the same "scrub a precomputed array" pattern `ParametricCurve`
 * generalizes for line plots, applied to vector diagrams instead. Every
 * frame's vectors must come from the lesson's own real computation (a
 * rotation matrix, an operator's action, a projection) — this component
 * only draws whatever it's handed.
 */
export function VectorDiagramExplorer({
  frames,
  sliderLabel = "",
  ariaLabel,
  showGrid = true,
  height = 300,
}: {
  frames: VectorFrame[];
  sliderLabel?: string;
  ariaLabel: string;
  showGrid?: boolean;
  height?: number;
}) {
  const { index, setIndex, frame } = useFrameIndex(frames);

  return (
    <div className="not-prose space-y-3">
      <VectorDiagram vectors={frame.vectors} ariaLabel={ariaLabel} showGrid={showGrid} height={height} />
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
