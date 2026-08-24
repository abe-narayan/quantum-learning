"use client";

/**
 * The "discrete preset toggle buttons" control shared by
 * `MatrixGridExplorer` and `ExchangeDiagramExplorer` — a `role="radiogroup"`
 * row of `role="radio"` pill buttons for picking one of several precomputed
 * presets. Pair with `useFrameIndex` for the index state itself. Unselected
 * pill styling matches the bordered-pill convention already established by
 * `OrbitalShapePlot`.
 */
export function PresetToggle({
  options,
  index,
  onChange,
  ariaLabel,
}: {
  options: { label: string }[];
  index: number;
  onChange: (index: number) => void;
  ariaLabel: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((option, i) => (
        <button
          key={option.label}
          type="button"
          role="radio"
          aria-checked={i === index}
          onClick={() => onChange(i)}
          className={
            i === index
              ? "rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground transition-colors"
              : "rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-muted"
          }
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
