import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CalloutType = "note" | "warning" | "mistake";

/**
 * MDX usage:
 * ```mdx
 * <Callout type="warning">
 *   Careful: the sign convention flips here.
 * </Callout>
 * ```
 * `type` defaults to `"note"`.
 *
 * Across the corpus this collapses to two tiers in practice (`mistake`:
 * ~450 uses, `note`: ~23, `warning`: ~4 — see docs/UX_REVIEW.md P2-2), which
 * flattens the one severity signal this component carries: if almost
 * everything is `mistake`, `mistake` stops reading as elevated. That's an
 * authoring-balance problem this file can't fix by itself (there's no
 * incorrect prop being passed), but the vocabulary is worth restating
 * plainly for whoever reaches for this next: `mistake` is for "students
 * reliably get this wrong" inside a *Common Mistakes*-style section, not a
 * general-purpose "important aside" — most asides that feel worth boxing
 * are a `warning` (a lower-stakes caution: a sign convention, a unit, an
 * edge case) or a plain `note`. Defaulting to `mistake` because it's the
 * most visually prominent option is exactly the drift that produced the
 * imbalance above.
 */

// Weight escalates with severity: `note` carries a hairline border and a
// pillar-neutral accent bar; `warning`/`mistake` step up to a full,
// semantic-colored border so severity reads even before the label is read.
// `data-callout` (rather than a Tailwind class combination) is what
// globals.css's severity-label rule keys off — see the note there and in
// AGENTS.md/the design brief: this is the one place in this file allowed to
// stay coupled to a global selector, and it is deliberately an attribute
// rather than a class string so a future spacing/color tweak here can't
// silently break it.
const BORDER_STYLES: Record<CalloutType, string> = {
  note: "border-border border-l-[3px] border-l-brand",
  warning: "border-warning/45 border-l-[3px] border-l-warning",
  mistake: "border-danger/55 border-l-[3px] border-l-danger",
};

const LABELS: Record<CalloutType, string> = {
  note: "Note",
  warning: "Careful",
  mistake: "Common mistake",
};

// Label color picks up the tone instead of always reading as plain
// foreground text — otherwise "Common mistake" and "Note" render visually
// identical apart from a faint background tint.
const LABEL_STYLES: Record<CalloutType, string> = {
  note: "text-brand",
  warning: "text-warning",
  mistake: "text-danger",
};

// One small glyph per severity so the distinction survives without color —
// a screen reader still gets the plain-text label, but a sighted scanning
// eye gets a second, non-color cue too (the info/triangle/circle-x shapes,
// not just the accent hue).
function CalloutIcon({ type }: { type: CalloutType }) {
  if (type === "warning") {
    return (
      <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true" className="shrink-0">
        <path
          d="M6.5 1.4 12 11.3H1z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path d="M6.5 5v2.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="6.5" cy="9.6" r="0.75" fill="currentColor" />
      </svg>
    );
  }
  if (type === "mistake") {
    return (
      <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true" className="shrink-0">
        <circle cx="6.5" cy="6.5" r="5.3" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M4.5 4.5l4 4M8.5 4.5l-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true" className="shrink-0">
      <circle cx="6.5" cy="6.5" r="5.3" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6.5 5.7v3.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="6.5" cy="3.7" r="0.75" fill="currentColor" />
    </svg>
  );
}

export function Callout({
  type = "note",
  children,
}: {
  type?: CalloutType;
  children: ReactNode;
}) {
  return (
    <div
      data-callout={type}
      className={cn(
        "not-prose my-6 rounded-[var(--radius-panel)] border bg-surface p-4 text-sm sm:p-5",
        BORDER_STYLES[type]
      )}
    >
      <p className={cn("flex items-center gap-1.5 font-semibold", LABEL_STYLES[type])}>
        <CalloutIcon type={type} />
        {LABELS[type]}
      </p>
      <div className="mt-1.5 space-y-2 text-muted-foreground">{children}</div>
    </div>
  );
}
