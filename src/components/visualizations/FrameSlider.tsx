"use client";

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

  return (
    <div className={boxed ? "panel-inset p-4" : undefined}>
      <label className="flex items-center justify-between text-xs font-medium text-foreground">
        <span>{effectiveLabel}</span>
        <span className="font-mono text-muted-foreground">{valueLabel}</span>
      </label>
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={index}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-brand"
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
