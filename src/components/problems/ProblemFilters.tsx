import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A single row of mutually-exclusive filter chips, styled as instrument
 * toggle switches rather than generic pill buttons: state is carried by
 * `aria-pressed` (a screen reader announces "pressed"/"not pressed", not
 * just a color change) and by a filled/outline tick, so it never depends on
 * color alone. Generic over the id type so the catalog can reuse it for the
 * topic, difficulty and type rows alike.
 */
export function ProblemFilters<T extends string>({
  label,
  options,
  selected,
  onChange,
  indicator,
}: {
  label: string;
  options: { id: T; label: string }[];
  selected: T;
  onChange: (id: T) => void;
  /** Optional per-option leading mark (e.g. a pillar dot) rendered before the label. */
  indicator?: (id: T) => ReactNode;
}) {
  return (
    <div>
      <p className="tech-label">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={label}>
        {options.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              aria-pressed={isSelected}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors duration-[--dur-fast]",
                isSelected
                  ? "border-pillar-accent bg-pillar-wash text-pillar-text"
                  : "border-border bg-surface text-muted-foreground hover:border-border-strong hover:text-foreground"
              )}
            >
              {indicator ? indicator(option.id) : null}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
