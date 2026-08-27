import type { ReactNode } from "react";
import { ScrollableMathText } from "./ScrollableMathText";
import { cn } from "@/lib/utils";
import type { Problem } from "@/lib/problems/types";

/**
 * The format spec — rendered *above* the field, before anyone types.
 *
 * The information already existed (`question.inputHint` on all 252 numeric
 * problems, `question.placeholder` on all 174 conceptual ones), but it sat
 * below the input as an afterthought, and the placeholder disappears the
 * moment a character is typed. Both grading paths are strict in ways that
 * are invisible from the field itself: `validateNumeric` parses with
 * `Number(...)`, so "1/2" and "sqrt(2)" are rejected as unparseable rather
 * than evaluated, and `validateConceptual` matches author-supplied key
 * phrases, so a correct answer that never names them reads as incomplete.
 * A student who only finds that out from a rejection has been marked wrong
 * for a syntax rule nobody stated. Stating it up front costs one line.
 *
 * Wired as the input's `aria-describedby`, so it is announced with the field
 * rather than being visual-only.
 */
function FormatSpec({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mb-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs leading-relaxed text-muted-foreground">
      <span className="tech-label shrink-0">Answer format</span>
      <span>{children}</span>
    </p>
  );
}

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
  const formatId = `${problem.meta.slug}-format`;

  if (problem.question.type === "multiple-choice") {
    return (
      <div>
        <FormatSpec id={formatId}>Select one option, then submit.</FormatSpec>
        <div role="radiogroup" aria-label="Answer options" aria-describedby={formatId} className="space-y-2">
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
                  "flex min-h-11 cursor-pointer items-center gap-3 rounded-[--radius-tight] border px-4 py-3 text-sm transition-colors duration-[--dur-fast]",
                  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-pillar has-[:focus-visible]:outline-offset-2",
                  checked
                    ? "border-pillar bg-pillar-wash"
                    : "border-border bg-surface hover:border-border-strong hover:bg-surface-muted",
                  disabled && "pointer-events-none opacity-60"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "tech-value flex h-6 w-6 shrink-0 items-center justify-center rounded-[--radius-tight] border text-[0.7rem] font-medium",
                    checked ? "border-pillar bg-pillar-wash text-pillar-text" : "border-border-strong text-subtle-foreground"
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
                <ScrollableMathText text={option.text} className="min-w-0 text-foreground" />
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  if (problem.question.type === "numeric") {
    return (
      <div>
        <FormatSpec id={formatId}>
          {problem.question.inputHint ? `${problem.question.inputHint} — ` : null}
          type a plain number. Expressions are not evaluated, so enter 0.707 rather than 1/sqrt(2).
        </FormatSpec>
        <label className="flex min-h-11 max-w-xs items-center gap-2 rounded-[--radius-tight] border border-border bg-surface pl-4 pr-2 focus-within:border-pillar">
          <span className="sr-only">Your answer</span>
          <input
            type="text"
            inputMode="decimal"
            value={value}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            placeholder="0.5"
            aria-describedby={formatId}
            className="tech-value w-full bg-transparent py-2.5 text-base text-foreground placeholder:text-subtle-foreground focus-visible:outline-none disabled:opacity-60"
          />
        </label>
      </div>
    );
  }

  return (
    <div>
      <FormatSpec id={formatId}>
        a sentence or two in your own words. Graded on whether it names the key ideas, so state them
        explicitly rather than implying them.
      </FormatSpec>
      <textarea
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        placeholder={problem.question.placeholder}
        aria-label="Your answer"
        aria-describedby={formatId}
        rows={3}
        className="w-full rounded-[--radius-tight] border border-border bg-surface px-4 py-2.5 text-foreground placeholder:text-subtle-foreground focus-visible:border-pillar focus-visible:outline-none disabled:opacity-60"
      />
    </div>
  );
}
