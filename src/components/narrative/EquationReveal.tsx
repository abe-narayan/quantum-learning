"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TechLabel } from "@/components/ui/Typography";

export type EquationTerm = {
  /** Stable key. */
  id: string;
  /** Short plain-text/Unicode symbol for the term chip, e.g. `"Ĥ"`,
   *  `"ψ(x)"`, `"E_n"`. Not LaTeX source — this renders as plain text (the
   *  chip is a glossary entry, not a second equation), so pick something
   *  legible without KaTeX. If a symbol nonetheless contains raw LaTeX
   *  grouping syntax (a backslash command, or `^{`/`_{`), the component
   *  detects it and typesets that chip through KaTeX as a fallback so the
   *  page never shows literal `^{...}` source — see `looksLikeLatexSource`
   *  below. That fallback is a safety net, not sanctioned usage: keep
   *  `symbol` short and Unicode. */
  symbol: string;
  /** Plain-language gloss, e.g. "the Hamiltonian — the operator for total energy." */
  gloss: string;
};

// `symbol` is documented as plain-text/Unicode and is never *supposed* to
// need KaTeX — but with 219 lessons and many authors, a call site will
// occasionally pass a raw LaTeX sub-expression instead (e.g.
// `"C^{j,m-1}"`), which used to render as literal, broken-looking source
// text right in the chip. Real Unicode subscript usage (the documented
// `"E_n"` case) never combines `^`/`_` with a brace group, so that's the
// signal used to tell "plain text with an underscore in it" apart from
// "actual LaTeX source": a backslash command, or a `^`/`_` immediately
// followed by `{`.
const LATEX_SOURCE_PATTERN = /\\[a-zA-Z]+|[\^_]\{/;

function looksLikeLatexSource(symbol: string): boolean {
  return LATEX_SOURCE_PATTERN.test(symbol);
}

/** Renders a chip's `symbol` as plain text, unless it looks like raw LaTeX
 *  source slipped in — in which case it degrades gracefully by typesetting
 *  through KaTeX instead of showing visible `^{...}`/`_{...}` markup. */
function ChipSymbol({ symbol }: { symbol: string }) {
  const isLatex = looksLikeLatexSource(symbol);
  // Keyed by the symbol it was rendered from, so a stale result for a
  // previous symbol is simply ignored at render time — no state reset (and
  // so no lint-flagged synchronous setState) needed in the effect.
  const [rendered, setRendered] = useState<{ symbol: string; html: string } | null>(null);

  // KaTeX is loaded on demand (`await import`), never statically: this
  // component sits in the global MDX mapping, so a top-level `import katex`
  // here put ~272KB of minified KaTeX into the eager client JS of every
  // lesson page — to serve only this misuse-fallback branch, which the
  // documented usage never hits. The normal path (plain-text chips, the
  // equation itself KaTeX'd at build time) ships none of it. When the
  // fallback *does* trigger, the chip shows its raw `symbol` text for the
  // instant the chunk takes to arrive, then typesets — an acceptable
  // transient for a safety net that already dev-warns the author.
  useEffect(() => {
    if (!isLatex) return;
    let cancelled = false;
    import("katex")
      .then(({ default: katex }) => {
        if (cancelled) return;
        try {
          setRendered({
            symbol,
            html: katex.renderToString(symbol, { displayMode: false, throwOnError: false, strict: false }),
          });
        } catch {
          // Even throwOnError:false can throw on non-Error inputs; keep the
          // raw symbol text.
        }
      })
      .catch(() => {
        // Chunk failed to load (offline, CDN hiccup) — keep the raw symbol
        // text, which is exactly what the pre-KaTeX state already shows.
      });
    return () => {
      cancelled = true;
    };
  }, [isLatex, symbol]);

  if (isLatex && rendered?.symbol === symbol) {
    return <span className="katex-math" dangerouslySetInnerHTML={{ __html: rendered.html }} />;
  }
  return <>{symbol}</>;
}

/**
 * MDX usage:
 * ```mdx
 * <EquationReveal
 *   terms={[
 *     { id: "H", symbol: "Ĥ", gloss: "The Hamiltonian — the operator for total energy." },
 *     { id: "psi", symbol: "ψ", gloss: "The state vector: everything knowable about the system." },
 *     { id: "E", symbol: "E_n", gloss: "An eigenvalue of Ĥ — an allowed energy the system can have." },
 *   ]}
 * >
 *   $$\hat{H}\psi = E_n\psi$$
 * </EquationReveal>
 * ```
 * `children` is the full equation, written as normal MDX math so it renders
 * through the site's usual KaTeX pipeline exactly once, undisturbed.
 */

/**
 * An equation paired with a term-by-term glossary: hover, click, or Tab to a
 * term chip and its plain-language gloss appears below the equation.
 * Deliberately does *not* attempt to highlight sub-spans inside the
 * rendered KaTeX markup — that markup is deeply nested and not a stable
 * target to reach into from outside, so precise glyph-level highlighting
 * would be fragile. Instead the equation renders once, normally, and the
 * chips are a separate, reliable interaction surface below it.
 *
 * Every gloss also exists as permanently visible static text in the
 * `<details>` glossary at the bottom — a native, zero-JS disclosure — so no
 * annotation is *only* reachable through hover/focus.
 */
export function EquationReveal({
  terms,
  children,
  className,
}: {
  terms: EquationTerm[];
  children: ReactNode;
  className?: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeTerm = terms.find((term) => term.id === activeId);

  // Dev-only signal: a `symbol` this component had to fall back to KaTeX for
  // is very likely a call site that meant to pass DerivationSteps-style
  // content instead of a short chip label (see docs/NARRATIVE_COMPONENTS.md
  // §EquationReveal). The chip still renders correctly either way, but the
  // author should shorten it — this doesn't fail loudly in production,
  // only in the console during development.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    for (const term of terms) {
      if (looksLikeLatexSource(term.symbol)) {
        console.warn(
          `EquationReveal: term "${term.id}" has a symbol ("${term.symbol}") that looks like raw LaTeX ` +
            `source rather than a short plain-text/Unicode chip label. It's being typeset through KaTeX ` +
            `as a fallback so it doesn't render as literal "^{...}" text, but per docs/NARRATIVE_COMPONENTS.md ` +
            `this prop should be a short Unicode label (e.g. "Ĥ", "E_n"). Consider DerivationSteps for a ` +
            `multi-term recursion this dense.`
        );
      }
    }
  }, [terms]);

  return (
    <div className={cn("not-prose instrument my-8 overflow-hidden", className)}>
      {/* Wraps rather than squeezing: at 320px the hint is longer than the
          strip, and `justify-between` on a nowrap row crushed both labels. */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-border px-4 py-2.5 sm:px-5">
        <TechLabel>Equation</TechLabel>
        {/* Conditional on there being terms. With `terms={[]}` the whole chip
            row and its `<details>` glossary below render nothing, so this
            hint was instructing the reader to select from a strip that does
            not exist and to open a glossary that is not there. An empty
            `terms` is not a hypothetical: it is the shape a call site lands
            in the moment an author reaches for this component for the frame
            and means to fill the glossary in afterwards, and nothing in the
            type system or the render path objects. */}
        {terms.length > 0 ? (
          <TechLabel className="text-subtle-foreground">
            Select a term for its meaning, or open the glossary below
          </TechLabel>
        ) : null}
      </div>

      <div className="p-4 sm:p-5">{children}</div>

      {terms.length > 0 ? (
        <div className="border-t border-border px-4 py-3 sm:px-5">
          <div className="flex flex-wrap gap-2">
            {terms.map((term) => {
              const isActive = term.id === activeId;
              return (
                <button
                  key={term.id}
                  type="button"
                  aria-pressed={isActive}
                  onMouseEnter={() => setActiveId(term.id)}
                  onMouseLeave={() => setActiveId((current) => (current === term.id ? null : current))}
                  onFocus={() => setActiveId(term.id)}
                  onBlur={() => setActiveId((current) => (current === term.id ? null : current))}
                  onClick={() => setActiveId((current) => (current === term.id ? null : term.id))}
                  className={cn(
                    "tech-value inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors",
                    isActive
                      ? "border-pillar-edge bg-pillar-wash text-pillar-strong"
                      : "border-border bg-surface text-foreground hover:border-pillar-edge"
                  )}
                >
                  {/* The selected chip is marked by a *shape* that appears
                      (a filled dot) as well as by its tint, so "which term am
                      I reading about" survives grayscale and every flavour of
                      color-blindness — the same filled/hollow principle
                      DifficultyMark and PrerequisiteReadout use. `aria-pressed`
                      already carries it for assistive tech. */}
                  <span
                    aria-hidden="true"
                    data-decorative=""
                    className={cn(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      isActive ? "bg-current" : "border border-current opacity-40"
                    )}
                  />
                  <ChipSymbol symbol={term.symbol} />
                </button>
              );
            })}
          </div>

          {/* `role="status"` + `aria-atomic`. A role-less element's implicit
              `aria-atomic` is `false`, so an update is announced as only the
              text nodes that changed. This region swaps a whole gloss at once,
              so the practical risk was low, but nothing in the markup said so:
              a future gloss that shares a prefix with the previous one would
              announce only the diff. Atomic makes the guarantee explicit, and
              `role="status"` is the standard, better-supported carrier for a
              polite region. */}
          <p role="status" aria-live="polite" aria-atomic="true" className="mt-2.5 min-h-[2.5em] text-sm text-muted-foreground">
            {activeTerm ? activeTerm.gloss : "Hover, tap, or Tab to a term above for its meaning."}
          </p>

          <details className="group mt-1">
            {/* The collapsed state has to advertise that there is something
                behind it, or the disclosure is dead weight: a rotating
                chevron (state carried by rotation, not color) plus the term
                count, so "there are 5 definitions in here" is legible without
                opening it. */}
            <summary
              className={cn(
                "flex min-h-11 w-fit cursor-pointer select-none list-none items-center gap-2 pr-2",
                "[&::-webkit-details-marker]:hidden"
              )}
            >
              <svg
                aria-hidden="true"
                data-decorative=""
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                className="h-3.5 w-3.5 shrink-0 text-pillar transition-transform group-open:rotate-90"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m7.5 5 5 5-5 5" />
              </svg>
              <TechLabel className="text-pillar">Full term glossary</TechLabel>
              <span className="text-xs text-subtle-foreground">
                all {terms.length} definitions, always readable
              </span>
            </summary>
            <dl className="mt-2 space-y-1.5 text-sm">
              {terms.map((term) => (
                <div key={term.id} className="flex gap-2">
                  <dt className="tech-value shrink-0 text-pillar-strong">
                    <ChipSymbol symbol={term.symbol} />
                  </dt>
                  <dd className="text-muted-foreground">{term.gloss}</dd>
                </div>
              ))}
            </dl>
          </details>
        </div>
      ) : null}
    </div>
  );
}
