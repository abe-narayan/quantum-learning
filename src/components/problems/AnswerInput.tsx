import { MathText } from "@/components/ui/MathText";
import { cn } from "@/lib/utils";
import type { Problem } from "@/lib/problems/types";

/**
 * Dispatches by `problem.question.type`. Every submission reaches the
 * validator as a plain string — a selected option's `id` for multiple
 * choice, raw typed text for numeric/conceptual — so `validateAnswer`
 * stays the single place that interprets it, never this component.
 */
export function AnswerInput({
  problem,
  value,
  onChange,
  disabled,
}: {
  problem: Problem;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  if (problem.question.type === "multiple-choice") {
    return (
      <div role="radiogroup" aria-label="Answer options" className="space-y-2">
        {problem.question.options.map((option) => {
          const checked = value === option.id;
          return (
            <label
              key={option.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
                checked ? "border-brand/40 bg-brand/5" : "border-border bg-surface hover:bg-surface-muted",
                disabled && "pointer-events-none opacity-60"
              )}
            >
              <input
                type="radio"
                name={`problem-${problem.meta.slug}`}
                value={option.id}
                checked={checked}
                disabled={disabled}
                onChange={() => onChange(option.id)}
                className="h-4 w-4 accent-brand"
              />
              <MathText text={option.text} className="text-foreground" />
            </label>
          );
        })}
      </div>
    );
  }

  if (problem.question.type === "numeric") {
    return (
      <div>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder="0.5"
          aria-label="Your answer"
          className="w-full max-w-xs rounded-lg border border-border bg-surface px-4 py-2.5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60"
        />
        {problem.question.inputHint ? (
          <p className="mt-1.5 text-xs text-muted-foreground">{problem.question.inputHint}</p>
        ) : null}
      </div>
    );
  }

  return (
    <textarea
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      placeholder={problem.question.placeholder}
      aria-label="Your answer"
      rows={3}
      className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-60"
    />
  );
}
