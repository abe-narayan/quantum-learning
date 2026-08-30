import type { ReactNode } from "react";

/**
 * ============================================================
 * A way out of a very long list, for a keyboard
 * ============================================================
 * Three pages on this site are single lists long enough that Tab stops being
 * navigation and becomes an obstacle. Counted from the served HTML on
 * localhost:3000, not from the source:
 *
 *   /glossary   1,471 anchors + 4 buttons + 1 input   = 1,476 tab stops
 *   /problems   1,138 anchors + 21 buttons            = 1,159 tab stops
 *   /lessons      278 anchors + 16 buttons + 1 input  =   295 tab stops
 *
 * Each of them has exactly one skip link (`layout.tsx`'s "Skip to content"),
 * and it lands *before* the list. So the two things a keyboard-only reader
 * most often wants from a catalog page, the footer and the filter they were
 * just using, are both on the far side of every row. On /glossary that is
 * 1,471 presses to reach a footer link, and there is no way back to the
 * filter field at all short of Shift+Tab through the same wall.
 *
 * The A-Z rails on /glossary look like the answer and are not: they are
 * fragment links, so they move the *viewport* and leave focus exactly where
 * it was. (The letter headings they point at now carry `tabIndex={-1}` so
 * they move focus too, which is a separate fix in `GlossaryFilter`, but the
 * rails only reach letters, never the end of the page.)
 *
 * This is WCAG 2.4.1 Bypass Blocks, applied a second time on the same page.
 * The pattern is deliberately the plainest one that exists: a real anchor to
 * a real fragment, and a `tabIndex={-1}` element at the destination so the
 * browser moves focus there rather than only scrolling. No JavaScript, no
 * refs, no effect, so it behaves identically on all three pages, in a
 * server-rendered document, and while a filter is mid-render.
 *
 * Both halves are `sr-only` until focused. That is not timidity about
 * showing them: the reader who needs this is the reader who is already
 * tabbing, so the control appears exactly when it becomes reachable, and a
 * catalog page does not grow two pieces of permanent chrome that only one
 * input method can use. `focus-within` rather than `focus` on the end block
 * because that block contains its own link, and the block has to stay
 * visible while that link is the focused thing inside it.
 *
 * Every class below is written out literally, including each `focus:` and
 * `focus-within:` variant. Tailwind v4 scans this file as text, so a class
 * list assembled at runtime (`focus:${SHARED}`) generates no CSS at all and
 * fails silently, which is the one failure mode a control nobody can see
 * until they focus it would hide indefinitely.
 *
 * Used in three places, all wired the same way: `GlossaryFilter`,
 * `ProblemsCatalog`, `LessonIndex`.
 */

/**
 * The escape hatch, placed immediately *before* a long list. Reads as nothing
 * at all until a keyboard reaches it.
 *
 * `children` should name the size of what is being skipped ("Skip the 156
 * glossary entries"), because the reader deciding whether to press it is
 * deciding against an unknown number of Tab presses, and that number is the
 * whole basis of the decision.
 *
 * `sr-only` is `position: absolute` plus a clip, so `focus:not-sr-only` is
 * what puts the link back in flow; everything after it is appearance, and
 * none of it applies until then. `min-h-11` is the house 44px floor, which
 * this clears the moment it is visible at all.
 */
export function ListBypassLink({
  targetId,
  children,
}: {
  /** The `id` of the matching `ListBypassEnd` after the list. */
  targetId: string;
  children: ReactNode;
}) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:inline-flex focus:min-h-11 focus:items-center focus:gap-2 focus:rounded-(--radius-tight) focus:border focus:border-pillar-edge focus:bg-pillar-wash focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-pillar-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
    >
      {children}
      <span aria-hidden="true">↓</span>
    </a>
  );
}

/**
 * The landing pad, placed immediately *after* the same list.
 *
 * `tabIndex={-1}` is the load-bearing attribute, and the reason this is a
 * component rather than a bare `<div id>`: a fragment link to a
 * non-focusable element scrolls the viewport and leaves focus behind, which
 * is exactly the defect the A-Z rails had. With it, the next Tab from here
 * continues into whatever follows the list, on all three pages the footer,
 * which is the whole point.
 *
 * `backTo` closes the other half of the trap. Having read to the end of a
 * catalog, the way back to its filter is otherwise Shift+Tab through every
 * row again. It takes the `id` of a genuinely focusable control (an input,
 * or a `tabIndex={-1}` results header), so the same fragment mechanism moves
 * focus there rather than only scrolling it into view.
 */
export function ListBypassEnd({
  id,
  backTo,
  backLabel,
  children,
}: {
  /** Matches the `targetId` of the `ListBypassLink` before the list. */
  id: string;
  /** `id` of a focusable control to return to, usually the filter field. */
  backTo: string;
  backLabel: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      tabIndex={-1}
      className="sr-only focus-within:not-sr-only focus-within:mt-10 focus-within:flex focus-within:flex-wrap focus-within:items-center focus-within:gap-x-4 focus-within:gap-y-3 focus-within:rounded-panel focus-within:border focus-within:border-border focus-within:bg-surface focus-within:px-4 focus-within:py-3 focus-within:outline-none"
    >
      <p className="text-sm text-muted-foreground">{children}</p>
      <a
        href={`#${backTo}`}
        className="inline-flex min-h-11 items-center gap-2 rounded-(--radius-tight) border border-pillar-edge bg-pillar-wash px-4 py-2 text-sm font-medium text-pillar-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
      >
        <span aria-hidden="true">↑</span>
        {backLabel}
      </a>
    </div>
  );
}
