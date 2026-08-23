import { cn } from "@/lib/utils";
import type { ValidationResult } from "@/lib/problems/validators/types";

const STATUS_STYLES: Record<ValidationResult["status"], string> = {
  correct: "border-accent/40 bg-accent/10 text-accent",
  partial: "border-warning/40 bg-warning/10 text-warning",
  incorrect: "border-border bg-surface-muted text-foreground",
};

const STATUS_LABEL: Record<ValidationResult["status"], string> = {
  correct: "Correct",
  partial: "Partially correct",
  incorrect: "Not quite",
};

/** Never relies on color alone — the status label is always present as text too. */
export function Feedback({ result }: { result: ValidationResult }) {
  return (
    <div role="status" aria-live="polite" className={cn("rounded-xl border px-4 py-3 text-sm", STATUS_STYLES[result.status])}>
      <p className="font-semibold">{STATUS_LABEL[result.status]}</p>
      <p className="mt-1">{result.message}</p>
    </div>
  );
}
