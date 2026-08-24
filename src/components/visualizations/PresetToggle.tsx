"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The "discrete preset toggle buttons" control shared by
 * `MatrixGridExplorer` and `ExchangeDiagramExplorer` — a `role="radiogroup"`
 * row of `role="radio"` pill buttons for picking one of several precomputed
 * presets. Pair with `useFrameIndex` for the index state itself. Unselected
 * pill styling matches the bordered-pill convention already established by
 * `OrbitalShapePlot`.
 *
 * Implements the ARIA Authoring Practices roving-tabindex pattern for
 * `role="radio"` groups: only the selected option is in the Tab order
 * (`tabIndex={0}`), and ArrowRight/ArrowDown/ArrowLeft/ArrowUp move *and*
 * select the adjacent option (wrapping), mirroring native radio buttons.
 */
export function PresetToggle({
  options,
  index,
  onChange,
  ariaLabel,
  disabled = false,
}: {
  options: { label: string }[];
  index: number;
  onChange: (index: number) => void;
  ariaLabel: string;
  disabled?: boolean;
}) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const moveTo = (nextIndex: number) => {
    onChange(nextIndex);
    buttonRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const count = options.length;
    if (count === 0) return;

    let delta = 0;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") delta = 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") delta = -1;
    else return;

    event.preventDefault();
    const current = index === -1 ? 0 : index;
    const nextIndex = (current + delta + count) % count;
    moveTo(nextIndex);
  };

  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((option, i) => (
        <button
          key={option.label}
          ref={(el) => {
            buttonRefs.current[i] = el;
          }}
          type="button"
          role="radio"
          aria-checked={i === index}
          tabIndex={i === index || (index === -1 && i === 0) ? 0 : -1}
          disabled={disabled}
          onClick={() => onChange(i)}
          onKeyDown={handleKeyDown}
          className={cn(
            i === index
              ? "rounded-full bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              : "rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
