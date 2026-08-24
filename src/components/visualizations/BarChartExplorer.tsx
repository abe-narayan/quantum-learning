"use client";

import { BarChart, type BarChartEntry } from "./BarChart";
import { useFrameIndex } from "./useFrameIndex";
import { FrameSlider } from "./FrameSlider";

export type BarChartFrame = {
  /** Pre-formatted, e.g. "c₊ = 0.60" — computed by the caller, matching `ParametricCurve`'s `CurveFrame`. */
  paramLabel: string;
  bars: BarChartEntry[];
};

/**
 * `BarChart` plus a slider that scrubs through precomputed frames — the
 * same "scrub a precomputed array" pattern `ParametricCurve` and
 * `VectorDiagramExplorer` generalize for their own visual types, applied to
 * bar charts. Useful for any lesson exploring how a probability
 * distribution (Born rule outcomes, measurement statistics) changes as one
 * real parameter varies.
 */
export function BarChartExplorer({
  frames,
  sliderLabel = "",
  ariaLabel,
  maxValue,
  height = 160,
}: {
  frames: BarChartFrame[];
  sliderLabel?: string;
  ariaLabel: string;
  maxValue?: number;
  height?: number;
}) {
  const { index, setIndex, frame } = useFrameIndex(frames);

  return (
    <div className="not-prose space-y-3">
      <BarChart bars={frame.bars} ariaLabel={ariaLabel} maxValue={maxValue} height={height} />
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
