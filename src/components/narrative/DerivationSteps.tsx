import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * MDX usage:
 * ```mdx
 * <DerivationSteps>
 *   <DerivationStep annotation="Apply the product rule.">
 *     $$\frac{d}{dt}\langle\psi|\psi\rangle = \langle\dot\psi|\psi\rangle + \langle\psi|\dot\psi\rangle$$
 *   </DerivationStep>
 *   <DerivationStep annotation="Substitute the Schrödinger equation for both kets.">
 *     $$= \frac{i}{\hbar}\langle\psi|H^\dagger - H|\psi\rangle$$
 *   </DerivationStep>
 *   <DerivationStep annotation="H is Hermitian, so this vanishes.">
 *     $$= 0$$
 *   </DerivationStep>
 * </DerivationSteps>
 * ```
 * Step numbers are assigned automatically from position — never pass
 * `stepNumber` directly. `<DerivationStep>` content is normal MDX, so
 * `$...$` / `$$...$$` renders through the site's usual KaTeX pipeline.
 */

type DerivationStepProps = {
  /** Plain-language reason the step is legal (e.g. "H is Hermitian, so this
   *  vanishes"). Optional, but a derivation earns its keep specifically by
   *  explaining *why* each line follows, so leaving every step unannotated
   *  usually means a `TheoremBox`/`Callout` would serve better. */
  annotation?: ReactNode;
  children: ReactNode;
  /** Set automatically by the parent `<DerivationSteps>` — do not pass this
   *  directly from MDX. */
  stepNumber?: number;
};

/** One line/stage of a derivation. Must be a direct child of
 *  `<DerivationSteps>`, which numbers it. */
export function DerivationStep({ annotation, children, stepNumber }: DerivationStepProps) {
  return (
    <li className="list-none">
      <div className="flex gap-4">
        <span
          aria-hidden="true"
          className="tech-value mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-pillar-edge text-xs text-pillar"
        >
          {stepNumber}
        </span>
        <div className="min-w-0 flex-1">
          {/* No `overflow-x-auto` here, for the reason `QuantumStateDisplay`
              documents at the same shape. A step's content is display math:
              `.katex-display` is block-level, fills this content box, and
              carries its own `overflow-x: auto` plus the `tabindex="0"`
              `rehypeKatexHtml.mjs` injects — so it takes every pixel of the
              overflow and this wrapper never had anything to scroll. It was
              therefore an `overflow-x: auto` box that no keyboard could
              reach, which is exactly the un-reachable scroll container the
              design brief rules out, on the 237 call sites of this
              component. Worse, `overflow-x: auto` with `overflow-y: visible`
              computes the y axis to `auto` too, so a tall step (a stacked
              matrix product, a multi-line fraction — the exact content a
              derivation is made of) was one line away from being silently
              clipped or given a spurious vertical scrollbar. The real scroll
              container, its focus stop and its overflow indicator all
              already live on `.katex-display` (globals.css §6). */}
          {children}
          {/* `text-sm`, not `text-xs`. `not-prose` on the `<ol>` does not
              reset the inherited `font-size`, so `text-xs` set the one
              sentence that says why the step is legal at 0.67x the lesson
              body. It stays a step below `text-base` on purpose: the display
              math is the step, this is its gloss. */}
          {annotation ? (
            <p className="mt-1.5 text-sm text-subtle-foreground">
              <span className="sr-only">Why this step is legal: </span>
              {annotation}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}

/**
 * A numbered derivation, each line a slab with an optional gloss on why the
 * step is legal. `children` must be `<DerivationStep>` elements, in order —
 * the wrapper injects `stepNumber` onto each one, so the list stays numbered
 * correctly even if a step is added or removed later. A real `<ol>`/`<li>`
 * pair underneath (numbers are visually replaced by the pillar-edged badge,
 * but the list semantics — "list, N items" — still reach assistive tech;
 * see the `role="list"` note on the `<ol>` for why that takes an explicit
 * role rather than coming free from the element).
 */
export function DerivationSteps({ children, className }: { children: ReactNode; className?: string }) {
  // `element.type === DerivationStep`, not "any element". `Children.toArray`
  // drops the whitespace strings between MDX blocks, but not a stray *element*
  // — and a stray element is exactly what MDX hands over when an author writes
  // a line of prose between two steps, or leaves a blank line where a step's
  // children should be: that block parses as markdown and arrives as a plain
  // `<p>`. Cloning `stepNumber` onto a `<p>` makes React warn about an
  // unrecognised DOM attribute in development and, in production, emit a
  // literal `stepnumber="3"` into the HTML; either way the numbering silently
  // skips, because that `<p>` consumed an index no visible step wears. Filter
  // first, number second, so a stray block is left exactly as the author wrote
  // it and the badges stay 1..n over the real steps.
  const blocks = Children.toArray(children).filter(isValidElement);
  // Numbers assigned up front rather than with a counter mutated inside the
  // `map` below: `react-hooks/immutability` rejects reassigning a variable
  // during render, and a precomputed index is clearer about what "position"
  // means here anyway — position among the *real* steps, not among all
  // children.
  const numberOf = new Map<number, number>();
  blocks.forEach((child, index) => {
    if (child.type === DerivationStep) numberOf.set(index, numberOf.size + 1);
  });

  const rendered = blocks.map((child, index) => {
    {
      if (child.type === DerivationStep) {
        return cloneElement(child as ReactElement<DerivationStepProps>, {
          stepNumber: numberOf.get(index),
          key: child.key ?? index,
        });
      }
      // A stray block still renders, in place. Dropping an author's paragraph
      // on the floor would be a worse failure than showing it unnumbered, and
      // moving it to the end would silently reorder a derivation. `<li>`
      // because the parent is an `<ol>` with `role="list"`, and a non-`<li>`
      // child of a list is markup assistive tech is free to ignore.
      return (
        <li
          key={child.key ?? `stray-${index}`}
          className="list-none text-base leading-relaxed text-muted-foreground"
        >
          {child}
        </li>
      );
    }
  });

  return (
    <ol
      // `role="list"` on an element that already *is* a list is not
      // redundant here, it is the fix for `list-none`. WebKit drops list
      // semantics entirely from any list whose items compute to
      // `list-style-type: none` — a deliberate heuristic for the very common
      // "nav menu built out of a `<ul>`" case — so in Safari/VoiceOver this
      // derivation announced as loose text with no "list, N items" and no
      // item boundaries. Each `<DerivationStep>` carries `list-none` (the
      // visible numbering is the pillar-edged badge, not a marker glyph),
      // which is exactly the trigger. An explicit role opts the semantics
      // back in without restoring the marker. `<ol>` and `<ul>` both map to
      // the `list` role — ordinality comes from document order, not from the
      // role — so this does not flatten the derivation into an unordered
      // list.
      role="list"
      // `data-math-plain` opts every step's display math out of
      // `.katex-display`'s own frame (globals.css §6). This `<ol>` is already a
      // bordered panel and each step already carries a numbered pillar-edge
      // badge, so the per-equation frame put a second repeating structure
      // inside the one this component exists to draw, across 193 steps in 55
      // instances. Frame only: the scroll box, the `tabindex` focus stop from
      // rehypeKatexHtml.mjs and `overscroll-behavior-x` are untouched.
      data-math-plain
      className={cn(
        "not-prose my-8 space-y-5 rounded-panel border border-border bg-surface p-5 sm:p-6",
        className
      )}
    >
      {rendered}
    </ol>
  );
}
