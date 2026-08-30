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

  // The axis has to be settled over the frame *set*, not the frame on screen.
  // `maxValue` already is (the caller passes one number for the whole sweep);
  // the positive/negative split was not, and `BarChart` deciding it from the
  // bars it currently holds meant the plot area halved and unhalved as the
  // slider moved. In `the-quantum-fourier-transform` the real-part sweep's
  // j = 0 frame is four amplitudes of +0.5 and no negative, while j = 1, 2 and
  // 3 each carry one, so a bar reading 0.5 drew at full height in one frame and
  // half height in the next — the reader watching for "same magnitude, only the
  // phase changes", which is the entire point of that figure, was shown the
  // magnitudes changing.
  //
  // Computed over every frame, so the zero line sits in one place for the whole
  // drag. Not memoized: `frames` is a module-scope constant at every call site
  // (it has to be, the props cross the server boundary), the scan is one pass
  // of arithmetic over data the component already holds, and a `useMemo` on a
  // stable array would cost more to keep than it saves.
  const signed = frames.some((f) => f.bars.some((b) => b.value < 0));

  return (
    <div className="not-prose space-y-3">
      <BarChart bars={frame.bars} ariaLabel={ariaLabel} maxValue={maxValue} signed={signed} height={height} />
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
