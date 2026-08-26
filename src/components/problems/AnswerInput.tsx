import { MathText } from "@/components/ui/MathText";
import { cn } from "@/lib/utils";
import type { Problem } from "@/lib/problems/types";

/**
 * Dispatches by `problem.question.type`. Every submission reaches the
 * validator as a plain string — a selected option's `id` for multiple
 * choice, raw typed text for numeric/conceptual — so `validateAnswer`
 * stays the single place that interprets it, never this component.
 * Presentation only: no validation, tolerance or matching logic lives here.
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
        {problem.question.options.map((option, index) => {
          const checked = value === option.id;
          // A lettered instrument cell rather than a generic radio dot — reads
          // as selecting a channel, not filling out a form. The letter itself
          // (not just the fill) is always visible, so the selected state is
          // never carried by color/fill alone.
          const letter = String.fromCharCode(65 + index);
          return (
            <label
              key={option.id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-[--radius-tight] border px-4 py-3 text-sm transition-colors duration-[--dur-fast]",
                "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-pillar-accent has-[:focus-visible]:outline-offset-2",
                checked
                  ? "border-pillar-accent bg-pillar-wash"
                  : "border-border bg-surface hover:border-border-strong hover:bg-surface-muted",
                disabled && "pointer-events-none opacity-60"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "tech-value flex h-6 w-6 shrink-0 items-center justify-center rounded-[--radius-tight] border text-[0.7rem] font-medium",
                  checked ? "border-pillar-accent bg-pillar-wash text-pillar-text" : "border-border-strong text-subtle-foreground"
                )}
              >
                {letter}
              </span>
              <input
                type="radio"
                name={`problem-${problem.meta.slug}`}
                value={option.id}
                checked={checked}
                disabled={disabled}
                onChange={() => onChange(option.id)}
                className="sr-only"
              />
              <MathText text={option.text} className="text-foreground" />
            </label>
          );
        })}
      </div>
    );
  }

  if (problem.question.type === "numeric") {
    const hintId = problem.question.inputHint ? `${problem.meta.slug}-numeric-hint` : undefined;
    return (
      <div>
        <label className="flex max-w-xs items-center gap-2 rounded-[--radius-tight] border border-border bg-surface pl-4 pr-2 focus-within:border-pillar-accent">
          <span className="sr-only">Your answer</span>
          <input
            type="text"
            inputMode="decimal"
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            placeholder="0.5"
            aria-describedby={hintId}
            className="tech-value w-full bg-transparent py-2.5 text-base text-foreground placeholder:text-subtle-foreground focus-visible:outline-none disabled:opacity-60"
          />
        </label>
        {problem.question.inputHint ? (
          <p id={hintId} className="mt-1.5 text-xs text-muted-foreground">
            {problem.question.inputHint}
          </p>
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
      className="w-full rounded-[--radius-tight] border border-border bg-surface px-4 py-2.5 text-foreground placeholder:text-subtle-foreground focus-visible:outline-none focus-visible:border-pillar-accent disabled:opacity-60"
    />
  );
}
