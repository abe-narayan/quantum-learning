import { cn } from "@/lib/utils";
import type { ValidationResult } from "@/lib/problems/validators/types";

const STATUS_STYLES: Record<ValidationResult["status"], string> = {
  correct: "border-success/40 bg-success/10 text-success",
  partial: "border-warning/40 bg-warning/10 text-warning",
  incorrect: "border-border-strong bg-surface-raised text-foreground",
};

const STATUS_LABEL: Record<ValidationResult["status"], string> = {
  correct: "Correct",
  partial: "Partially correct",
  incorrect: "Not quite",
};

/** aria-hidden glyph per status — always paired with the text label above,
 *  so status is never carried by color or shape alone. */
function StatusGlyph({ status }: { status: ValidationResult["status"] }) {
  if (status === "correct") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M2.5 7.3 5.5 10.3l6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === "partial") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M7 1.5 13 12.5H1L7 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M7 5.5v3.2M7 10.4v.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3.5 3.5 10.5 10.5M10.5 3.5 3.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Grading feedback. Never relies on color alone — an icon and the status
 * label are always present as text too, so "Not quite" survives grayscale
 * and every form of color blindness.
 *
 * The `role="status"` container is rendered unconditionally, empty, and only
 * its *contents* change on submission. A live region that is inserted into
 * the DOM at the same moment it gains content is unreliably announced —
 * several screen reader / browser pairs only observe mutations inside
 * regions that were already present when the observer attached. Keeping the
 * empty wrapper mounted from first paint is what makes the announcement
 * dependable rather than incidental.
 */
export function Feedback({ result }: { result: ValidationResult | null }) {
  return (
    /* An empty wrapper carries no margin and so no height: the always-mounted
       region costs nothing in layout until it has something to say. */
    <div role="status" aria-live="polite" className={result ? "mt-4" : undefined}>
      {result ? (
        <div
          className={cn(
            "flex gap-2.5 rounded-[--radius-tight] border px-4 py-3 text-sm",
            STATUS_STYLES[result.status]
          )}
        >
          <span className="mt-0.5 shrink-0">
            <StatusGlyph status={result.status} />
          </span>
          <span>
            <p className="font-semibold">{STATUS_LABEL[result.status]}</p>
            <p className="mt-1 text-foreground/90">{result.message}</p>
          </span>
        </div>
      ) : null}
    </div>
  );
}
