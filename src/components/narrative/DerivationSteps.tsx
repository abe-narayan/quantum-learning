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
          <div className="overflow-x-auto">{children}</div>
          {annotation ? (
            <p className="mt-1.5 text-xs text-subtle-foreground">
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
 * but the native list semantics — "list, N items" — still reach assistive
 * tech).
 */
export function DerivationSteps({ children, className }: { children: ReactNode; className?: string }) {
  const steps = Children.toArray(children).filter(isValidElement);

  return (
    <ol
      className={cn(
        "not-prose my-8 space-y-5 rounded-[var(--radius-panel)] border border-border bg-surface p-5 sm:p-6",
        className
      )}
    >
      {steps.map((step, index) =>
        cloneElement(step as ReactElement<DerivationStepProps>, {
          stepNumber: index + 1,
          key: (step as ReactElement).key ?? index,
        })
      )}
    </ol>
  );
}
