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
 * ## Corpus distribution, recounted 2026-08-29
 *
 * `warning` 268, `note` 182, `mistake` 49 — 499 uses across all 219 lessons,
 * every one of them passing an explicit `type` (the count of `<Callout`
 * openings and the count of typed ones are both 499, so the `"note"` default
 * is never exercised from MDX).
 *
 * This comment previously read "`mistake`: ~450 uses, `note`: ~23,
 * `warning`: ~4 — see docs/UX_REVIEW.md P2-2" and warned that the severity
 * signal had collapsed because almost everything was `mistake`. That was
 * true when it was written and is now backwards: the imbalance was fixed by
 * an authoring pass, `mistake` is the rarest of the three at under 10%, and
 * anyone reading the old numbers would have concluded the exact opposite of
 * what the corpus says. Recount before trusting them again; the figures
 * above are a snapshot, not an invariant.
 *
 * The vocabulary is what actually matters and has not changed: `mistake` is
 * for "students reliably get this wrong" inside a *Common Mistakes*-style
 * section, not a general-purpose "important aside" — most asides that feel
 * worth boxing are a `warning` (a lower-stakes caution: a sign convention, a
 * unit, an edge case) or a plain `note`. Reaching for `mistake` because it is
 * the loudest option is the drift that produced the old imbalance.
 */

// ## Why a `<div>` and not an `<aside>`
//
// A callout is parenthetic content, which is `<aside>`'s definition, so this
// looks like a plain semantics bug. It is examined and deliberately kept.
// `<aside>` maps to the `complementary` **landmark** role, and it only
// escapes that mapping when scoped inside sectioning content (`article`,
// `section`, `nav`, `aside`) — the lesson prose container is a `<div>`
// (LessonLayout's `#lesson-prose`), so every one of these would become a
// page-level landmark. At 499 uses across 219 lessons that is routinely five
// or more `complementary` landmarks per lesson, which does not make callouts
// easier to find; it buries `main`, `navigation` and `contentinfo` in the
// landmark rotor and makes the one navigation aid a screen-reader user has
// for the *page* useless. Landmarks are a small, high-value set by design.
//
// The boundary a reader actually needs is already present and better: the
// severity label ("Note" / "Careful" / "Common mistake") is real text in its
// own paragraph, read out in document order, naming the kind of thing this
// is. `role="note"` was considered as a non-landmark middle ground and
// rejected as adding nothing that label does not already say out loud.
//
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
        // `text-base`, not `text-sm`: `not-prose` excludes this subtree from
        // the typography plugin's selectors but does not reset the inherited
        // `font-size`, so an absolute size here is read against `.prose`'s
        // 18px body. A callout is running prose the reader is meant to read,
        // not a label.
        "not-prose my-6 rounded-panel border bg-surface p-4 text-base sm:p-5",
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
