import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TechLabel } from "@/components/ui/Typography";

type Provenance = "cited" | "derived";

/**
 * MDX usage:
 * ```mdx
 * <TheoremBox title="Stone's theorem" provenance="cited">
 *   Every strongly continuous one-parameter unitary group $U(t)$ has the
 *   form $U(t) = e^{-iAt}$ for a unique self-adjoint $A$.
 * </TheoremBox>
 * ```
 */

// Quantum Mastery lessons draw an explicit line between a result the lesson
// proves in full and one it invokes from outside its own scope (e.g. this
// platform's own "Riesz-Fischer, cited here, not proved" / "Stone's theorem,
// cited, not proved here" convention). `cited` stays neutral -- being out of
// scope isn't a shortcoming -- while `derived` picks up the accent color,
// since a full derivation is the course's own payoff.
const PROVENANCE_LABEL: Record<Provenance, string> = {
  cited: "Cited, not derived here",
  derived: "Derived below",
};

const PROVENANCE_STYLES: Record<Provenance, string> = {
  cited: "border-border bg-surface-muted text-muted-foreground",
  derived: "border-accent/40 bg-accent/10 text-accent",
};

/** The tombstone, `∎` — the mark this component's own readers already use to
 *  close a proof, and the one glyph that can only mean "theorem" here. Drawn
 *  rather than typed for the same reason `DefinitionBox`'s `≝` is: at 13px a
 *  font-substituted or missing codepoint would be the entire signal. Paired
 *  with that `≝`, definition and theorem are now separated by shape, so the
 *  two panels stop being the same box with a differently-tinted word at the
 *  top — see the note in DefinitionBox.tsx. */
function TheoremGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true" data-decorative="" className="shrink-0">
      <rect x="2.6" y="2.6" width="7.8" height="7.8" rx="0.9" fill="currentColor" />
    </svg>
  );
}

/**
 * Formal theorem statement, styled as a distinct sibling of `Callout`: a
 * full-border header-strip panel (not a colored tint) rather than a rounded,
 * tinted aside, so it reads as "graduate-level formal statement" rather than
 * another pedagogical note. `title` names the theorem (e.g. "Von Neumann's
 * deficiency-index theorem"); the optional `provenance` badge says whether
 * the lesson proves it or is invoking it from outside its own scope.
 */
export function TheoremBox({
  title,
  provenance,
  className,
  children,
}: {
  title?: string;
  provenance?: Provenance;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "not-prose my-8 overflow-hidden rounded-panel border border-border border-l-2 border-l-pillar-edge bg-surface",
        className
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5 border-b border-border bg-surface-muted px-5 py-3">
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {/* `items-center` inside a baseline-aligned row (an SVG has no
              baseline, so it would otherwise hang above the text), and
              `text-brand` repeated on the label because `.tech-label`
              declares its own `color` — see the matching note in
              DefinitionBox.tsx. */}
          <span className="flex items-center gap-1.5 text-brand">
            <TheoremGlyph />
            <TechLabel className="text-brand">Theorem</TechLabel>
          </span>
          {/* `text-lg sm:text-xl`, up one step from `text-base sm:text-lg`.
              Paired with the body's move to `text-lg` below; the reasoning for
              both is in the note above that `<div>`. */}
          {/* `min-w-0` alone shrinks the flex item to the row's available
              width, but at 200% text zoom (WCAG 1.4.4) the panel is narrow
              enough that a single long word in the title ("nondeterministic")
              is wider than that whole available width, and normal wrapping
              only breaks at spaces. `[overflow-wrap:anywhere]` is the part
              that lets the word itself break, so the title stays inside the
              panel's `overflow-hidden` clip instead of losing its tail with
              no scrollbar to say so. Measured with `scripts/audit/a11y.mjs
              --checks resize` on a DefinitionBox/TheoremBox title long enough
              to have a 16-letter word in it. */}
          {title && (
            <span className="min-w-0 font-display text-lg font-semibold text-foreground [overflow-wrap:anywhere] sm:text-xl">
              {title}
            </span>
          )}
        </p>
        {provenance && (
          <span
            className={cn(
              // Not `shrink-0` any more: at 200% zoom this badge alone
              // (wrapped onto its own line by `flex-wrap` above) can still be
              // wider than the panel, and `shrink-0` refused to let it
              // narrow at all, so its text ran past the clip with nothing to
              // scroll it back into view. `min-w-0` lets the box actually
              // shrink; `[overflow-wrap:anywhere]` lets its text wrap across
              // more than one line once it does. Ordinary layouts are
              // unaffected: the badge already had a full row to itself
              // whenever the title didn't fit beside it.
              "min-w-0 rounded-full border px-2.5 py-0.5 text-meta font-semibold uppercase tracking-wide [overflow-wrap:anywhere]",
              PROVENANCE_STYLES[provenance]
            )}
          >
            {PROVENANCE_LABEL[provenance]}
          </span>
        )}
      </div>
      {/* `text-lg`, not `text-base` (and long ago not `text-sm`). `not-prose`
          above excludes this subtree from the typography plugin's descendant
          selectors; it does not reset an inherited `font-size`, so an absolute
          size here is measured against `.prose`'s 18px. `text-sm` put a
          theorem statement at 0.78x the paragraph that introduced it;
          `text-base` still left it at 0.89x. `text-lg` is 1.125rem, which is
          `.prose`'s own size exactly, so the statement now reads at 1.00x the
          prose around it. That is the right ratio because a boxed theorem in a
          lesson is the payload, not an aside: the paragraph above it exists to
          set the statement up.

          The header title moved with it, to `text-lg sm:text-xl`, so the two
          keep a real step at `sm` (20px title over an 18px body) instead of
          the 2px one they had. On a phone they land on the same 18px, which is
          exactly the relationship `ResearchConnection` already has at that
          width: the separation there is carried by the header strip's own
          background, its bottom rule, the display face, the semibold weight,
          the caps `.tech-label`, and the glyph. Six channels, none of them
          size, and none of them hue.

          Nothing about the shape-not-hue taxonomy moves: panel, header strip,
          solid border, pillar-edge left rail, and the drawn `∎` are all
          untouched, so the seven devices are still told apart in grayscale and
          in print by the same marks as before. */}
      {/* `data-math-plain` opts this subtree out of `.katex-display`'s own
          frame (globals.css §6). This panel is already a bordered device with
          a pillar-edge left rail, and 22 of the 48 TheoremBoxes in the corpus
          hold display math, so without it a reader got two pillar rails at the
          same radius with the inner one thicker. The attribute drops the
          frame only: the scroll box, its focus stop and its overflow
          indicator all still come from the base rule. */}
      <div data-math-plain className="space-y-3 px-5 py-4 text-lg leading-relaxed text-foreground">
        {children}
      </div>
    </div>
  );
}
