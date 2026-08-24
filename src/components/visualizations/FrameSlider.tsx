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
  return (
    <div className={boxed ? "rounded-xl border border-border bg-surface-muted/40 p-4" : undefined}>
      <label className="flex items-center justify-between text-xs font-medium text-foreground">
        <span>{label}</span>
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
        aria-label={label}
      />
    </div>
  );
}
