import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TechLabel } from "@/components/ui/Typography";

/**
 * MDX usage:
 * ```mdx
 * <DefinitionBox title="Self-adjoint operator">
 *   An operator $A$ such that $A = A^\dagger$ *and* $\mathrm{dom}(A) =
 *   \mathrm{dom}(A^\dagger)$.
 * </DefinitionBox>
 * ```
 *
 * Formal definition, the `TheoremBox` sibling for naming a concept precisely
 * rather than stating a result about it. Same full-border header-strip
 * treatment as `TheoremBox` (distinct from `Callout`'s rounded, tinted
 * asides) so the two read as one "formal statement" family within Quantum
 * Mastery lessons. The left edge picks up the ambient lesson pillar so the
 * panel still feels native to whichever course it's in, without touching
 * that names-vs-claims distinction.
 *
 * Within that family, definition and theorem used to be separated by the
 * *hue of the label word* and nothing else — identical border, identical
 * header strip, identical geometry, `text-accent` against `text-brand`.
 * That is the failure mode `Callout` already solved with a glyph per
 * severity: a reader scanning a Quantum Mastery lesson for "where was that
 * defined?" had to stop and read every panel header, and a reader who
 * cannot separate the two hues had no signal at all. Each now carries the
 * mark its own discipline already uses — `≝` here for "is defined to be,"
 * the tombstone `∎` on `TheoremBox` — so the two are told apart by shape
 * before either word is read, and stay told apart in grayscale and in
 * print.
 */

/** The definitional-equality sign, `≝`: an equals rule with a mark above it.
 *  Drawn rather than typed so it renders identically regardless of whether
 *  the reader's font stack has the codepoint — at 13px a fallback box or a
 *  substituted glyph from another face would be the whole signal. */
function DefinitionGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true" data-decorative="" className="shrink-0">
      <circle cx="6.5" cy="3.2" r="1.05" fill="currentColor" />
      <path
        d="M2 6.8h9M2 9.6h9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function DefinitionBox({
  title,
  className,
  children,
}: {
  title?: string;
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
      <div className="border-b border-border bg-surface-muted px-5 py-3">
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {/* `items-center` on this inner span, not `items-baseline`: an SVG
              has no baseline of its own, so a glyph placed directly in the
              baseline-aligned row above would sit on its own bottom edge and
              float above the label text. */}
          <span className="flex items-center gap-1.5 text-accent">
            <DefinitionGlyph />
            {/* `text-accent` is repeated on the label rather than inherited
                from the span above. `.tech-label` sets its own `color` inside
                `@layer components`, and an inherited color from an ancestor
                never beats a declaration on the element itself regardless of
                layer order — dropping it here would have quietly returned
                this label to muted grey. Same trap globals.css §"unlayered
                CSS" documents. The span still needs the color too: it is what
                the glyph's `currentColor` resolves against. */}
            <TechLabel className="text-accent">Definition</TechLabel>
          </span>
          {/* `text-lg sm:text-xl`, matching `TheoremBox` step for step: the
              two are one family and must not drift apart on size. */}
          {/* `min-w-0` alone shrinks the flex item to the row's available
              width, but at 200% text zoom (WCAG 1.4.4) the panel is narrow
              enough that a single long word in the title
              ("nondeterministic") is wider than that whole available width,
              and normal wrapping only breaks at spaces. `[overflow-wrap:
              anywhere]` is the part that lets the word itself break, so the
              title stays inside the panel's `overflow-hidden` clip instead
              of losing its tail with no scrollbar to say so. Measured with
              `scripts/audit/a11y.mjs --checks resize` on
              `DefinitionBox title="NP (nondeterministic polynomial time,
              verifier form)"`. */}
          {title && (
            <span className="min-w-0 font-display text-lg font-semibold text-foreground [overflow-wrap:anywhere] sm:text-xl">
              {title}
            </span>
          )}
        </p>
      </div>
      {/* `text-lg` for the same reason as `TheoremBox`, which carries the full
          note: `not-prose` does not reset an inherited `font-size`, so an
          absolute size here is measured against `.prose`'s 18px body, and
          `text-base` left the definition at 0.89x the paragraph that
          introduces it. `text-lg` is 1.125rem, `.prose`'s own size, so a
          definition now reads at 1.00x its surrounding prose. The header title
          moved to `text-lg sm:text-xl` in step. */}
      {/* `data-math-plain`: same opt-out as `TheoremBox`. This panel already
          draws the pillar-edge rail, so display math inside it drops
          `.katex-display`'s own frame and keeps its scroll behaviour. */}
      <div data-math-plain className="space-y-3 px-5 py-4 text-lg leading-relaxed text-foreground">
        {children}
      </div>
    </div>
  );
}
