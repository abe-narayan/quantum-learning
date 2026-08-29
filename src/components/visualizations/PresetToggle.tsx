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
            "inline-flex min-h-11 items-center rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            // Selected state moved off the fixed `bg-brand` onto the pillar
            // identity channel, matching `simulators/shared/controls.tsx`'s
            // `PillGroup` — the same control, one directory over, already on
            // the pillar tokens. `--pillar-*` defaults to --brand's own hue
            // family, so an unscoped page looks unchanged; inside a
            // `[data-pillar]` lesson the figure's controls now pick up that
            // pillar's tint instead of asserting a colour the rest of the
            // page isn't using. `text-brand-foreground` (not
            // `text-pillar-text`) is the on-fill pairing: `--pillar-text` is
            // the readable-on-background variant and would be near-invisible
            // sitting on `bg-pillar`.
            //
            // The border is now unconditional. Previously only the
            // *unselected* pill had one, so selecting a pill silently shrank
            // it by 2px and nudged every pill after it — a 2px reflow on
            // every click of a control whose whole job is being clicked.
            i === index
              ? "border-pillar bg-pillar text-brand-foreground"
              : "border-border bg-surface text-muted-foreground hover:bg-surface-muted",
            disabled && "pointer-events-none opacity-50"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
