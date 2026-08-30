import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The one horizontally-scrollable figure frame for lesson MDX.
 *
 * WHY THIS EXISTS
 * ---------------
 * Lesson authors were hand-writing the frame:
 *
 *   <div className="not-prose overflow-x-auto rounded-panel border border-border
 *                   bg-surface-muted/40 p-4"> … </div>
 *
 * and the `tabIndex` was optional in practice, because nothing about writing
 * that line reminds you of it. A `div` with `overflow-x: auto` is focusable by
 * default in Firefox and nowhere else, so once the content inside is wider
 * than the frame, a keyboard-only or screen-reader reader can see the left
 * edge of a circuit, a flowchart or a lattice and has no way at all to reach
 * the rest: the scroll is wheel-and-trackpad only. WCAG 2.1.1 (Keyboard),
 * Level A, and it is silent — the page renders, the markup reads fine, and no
 * type check or lint rule points at it. A 2026-08-29 rendered-HTML audit found
 * it on lesson figure frames across the apex, quantum-computing and
 * quantum-mastery pillars, including one frame whose author had written a
 * 400-character `aria-label` for the diagram and still omitted the tab stop.
 *
 * Centralising is the actual fix. The affordance is now impossible to forget,
 * because the only way to get the frame is to get the tab stop with it, and
 * `label` is a required prop so the frame cannot be nameless either.
 *
 * WHY IT IS IMPORTED RATHER THAN MAPPED IN `src/mdx-components.tsx`
 * ----------------------------------------------------------------
 * That mapping documents a ≤30-entry budget and is nearly full; it is reserved
 * for components used broadly across the corpus, because everything in it is
 * pulled into all ~219 compiled lesson module graphs. This frame is used by
 * about a dozen lessons, which is exactly the "import it explicitly" case the
 * policy describes, and an explicit import costs nothing from the budget.
 *
 * WHY `role="group"` AND NOT `role="region"`
 * ------------------------------------------
 * `region` is a landmark. Ninety of them across the corpus would bury the real
 * landmarks in every screen reader's landmark list, and these frames are
 * figures inside an article, not top-level sections of it. `group` gives the
 * frame a name without that cost. A role is required for the name to survive
 * at all: `aria-label` is silently dropped on a role-less `div`, which this
 * codebase has been bitten by before, so "just add aria-label" is not an
 * option. (`src/mdx-components.tsx`'s table wrapper keeps `role="region"` on
 * purpose — a wide data table genuinely is a landmark-worthy destination, and
 * there is at most one or two per lesson.)
 *
 * The focus indicator comes from the global `:focus-visible` outline in
 * globals.css §base, which paints in the pillar accent colour; no per-call-site
 * focus classes are needed or wanted.
 *
 * WHEN NOT TO USE THIS
 * --------------------
 * Only when the content can actually overflow ~254px of reading column (a
 * 320px viewport, less the page's 16px gutters, less this frame's `p-4` and
 * 1px border). A tab stop that lands on a frame which never scrolls is its own
 * defect, paid by every keyboard user on every visit. For a figure whose SVG
 * is `w-full` or `max-w-full`, or whose intrinsic width already fits, use a
 * plain `<div className="not-prose rounded-panel border border-border
 * bg-surface-muted/40 p-4">` instead.
 *
 * ```mdx
 * import { ScrollableFigure } from "@/components/mdx/ScrollableFigure";
 *
 * <ScrollableFigure label="Quantum Fourier transform circuit for three qubits">
 *   <svg width={600} height={168} viewBox="0 0 600 168" role="img" aria-label="…">…</svg>
 * </ScrollableFigure>
 * ```
 */
export function ScrollableFigure({
  label,
  className,
  children,
}: {
  /**
   * What the reader is being given access to, as a short noun phrase. Spoken
   * aloud, so: no em dashes, and not a generic "Scrollable region" — ninety
   * identical names is the same defect wearing a label. The long description
   * of the diagram itself belongs on the `<svg role="img">` inside.
   */
  label: string;
  /** Extra frame-level utilities, e.g. `"my-8"`. */
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      tabIndex={0}
      className={cn(
        "not-prose overflow-x-auto rounded-panel border border-border bg-surface-muted/40 p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
