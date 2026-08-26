"use client";

import { useMemo } from "react";
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

  // Compute one shared bounding box across every frame's vectors so the
  // render scale stays constant as the slider swaps `frame.vectors` —
  // otherwise each frame independently auto-fits to the plot area and a
  // vector of constant true length visibly grows/shrinks across frames.
  const bounds = useMemo(() => {
    const xs = [0];
    const ys = [0];
    for (const f of frames) {
      for (const v of f.vectors) {
        const from = v.from ?? { x: 0, y: 0 };
        xs.push(from.x, v.x);
        ys.push(from.y, v.y);
      }
    }
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
    };
  }, [frames]);

  return (
    <div className="not-prose space-y-3">
      <VectorDiagram
        vectors={frame.vectors}
        ariaLabel={ariaLabel}
        showGrid={showGrid}
        height={height}
        bounds={bounds}
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
