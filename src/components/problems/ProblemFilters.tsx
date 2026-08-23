import { cn } from "@/lib/utils";

/** A single row of mutually-exclusive filter chips. Generic over the id type so the catalog can reuse it for both the topic and difficulty filter rows. */
export function ProblemFilters<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { id: T; label: string }[];
  selected: T;
  onChange: (id: T) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={selected === option.id}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
              selected === option.id
                ? "border-brand/40 bg-brand/10 text-brand"
                : "border-border bg-surface text-muted-foreground hover:bg-surface-muted"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
