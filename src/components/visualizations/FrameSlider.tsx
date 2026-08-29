"use client";

import { useId } from "react";

/**
 * The "scrub precomputed frames via a slider" control shared by
 * `ParametricCurve`, `VectorDiagramExplorer`, `BarChartExplorer`, and
 * `CircuitDiagramExplorer` — a labeled range input showing the current
 * frame's pre-formatted param label. Pair with `useFrameIndex` for the
 * index state itself.
 *
 * `boxed` controls whether this renders its own bordered/background box:
 * most callers render this as a standalone block and want the box, but
 * `ParametricCurve` nests it inside a box it already renders itself, so it
 * passes `boxed={false}` to avoid a double border.
 */
// Safety-net fallback for callers that forget (or fail) to pass a real
// `label` — an empty string would otherwise become an empty `aria-label`,
// leaving the range input completely unlabeled for screen readers. Not as
// good as a real, specific label, but strictly better than nothing.
const FALLBACK_LABEL = "Animation frame selector";

export function FrameSlider({
  label,
  valueLabel,
  index,
  max,
  onChange,
  boxed = true,
}: {
  label: string;
  valueLabel: string;
  index: number;
  max: number;
  onChange: (index: number) => void;
  boxed?: boolean;
}) {
  const effectiveLabel = label || FALLBACK_LABEL;
  // `useId` rather than a prop or a module counter: this component is rendered
  // several times on some lesson pages (a `ParametricCurve` and a
  // `VectorDiagramExplorer` in the same section), and duplicate `id`s would
  // point every label at whichever input the browser found first.
  const inputId = useId();

  return (
    <div className={boxed ? "panel-inset p-4" : undefined}>
      {/* `htmlFor`/`id`, because the `<label>` does not wrap the `<input>` —
          the two are siblings, so before this the label was not associated
          with the control at all and clicking the visible "θ" text did
          nothing. That is a pointer-affordance failure, not a naming one: the
          input's `aria-label` was already carrying the accessible name, so
          assistive tech was fine while every mouse and touch user lost the
          label as a target for focusing and (on a range input) for nudging the
          value. The association also enlarges the effective hit area for a
          motor-impaired user, which is the same reason the input itself is
          `h-11`.
          The `aria-label` deliberately stays: it wins over the label
          association for the accessible name, which is what we want here,
          because the label element's text content is "{effectiveLabel}
          {valueLabel}" and the value half is already announced — better — via
          `aria-valuetext` below. Without the `aria-label` a screen reader
          would read the current value twice, once stale-looking and once
          humanized. */}
      <label
        htmlFor={inputId}
        className="flex items-center justify-between text-xs font-medium text-foreground"
      >
        <span>{effectiveLabel}</span>
        <span className="font-mono text-muted-foreground">{valueLabel}</span>
      </label>
      <input
        id={inputId}
        type="range"
        min={0}
        max={max}
        step={1}
        value={index}
        onChange={(e) => onChange(Number(e.target.value))}
        // `h-11`: a range input centres its track inside whatever height it's
        // given, so this buys a 44px touch target on mobile without changing
        // the track's appearance. Keyboard scrubbing (arrows/Home/End) is
        // native to `input[type=range]`.
        className="mt-1 h-11 w-full accent-brand"
        aria-label={effectiveLabel}
        // `valueLabel` is already the caller's pre-formatted, humanized
        // readout for the current frame (e.g. "θ = 30°", "η = 0.30") — wire
        // it to aria-valuetext so screen readers announce that instead of
        // the raw 0..max frame index.
        aria-valuetext={valueLabel}
      />
    </div>
  );
}
