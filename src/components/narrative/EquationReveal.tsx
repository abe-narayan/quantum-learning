"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import katex from "katex";
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
  const html = useMemo(() => {
    if (!isLatex) return null;
    try {
      return katex.renderToString(symbol, { displayMode: false, throwOnError: false, strict: false });
    } catch {
      return null;
    }
  }, [isLatex, symbol]);

  if (html) {
    return <span className="katex-math" dangerouslySetInnerHTML={{ __html: html }} />;
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
            `this prop should be a short Unicode label (e.g. "Ĥ", "E_n") — consider DerivationSteps for a ` +
            `multi-term recursion this dense.`
        );
      }
    }
  }, [terms]);

  return (
    <div className={cn("not-prose instrument my-8 overflow-hidden", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5 sm:px-5">
        <TechLabel>Equation</TechLabel>
        <TechLabel className="text-subtle-foreground">Select a term for its meaning — or open the glossary below</TechLabel>
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
                    "tech-value rounded-full border px-2.5 py-1 text-xs transition-colors",
                    isActive
                      ? "border-pillar-edge bg-pillar-wash text-pillar-strong"
                      : "border-border bg-surface text-foreground hover:border-pillar-edge"
                  )}
                >
                  <ChipSymbol symbol={term.symbol} />
                </button>
              );
            })}
          </div>

          <p aria-live="polite" className="mt-2.5 min-h-[2.5em] text-sm text-muted-foreground">
            {activeTerm ? activeTerm.gloss : "Hover, tap, or Tab to a term above for its meaning."}
          </p>

          <details className="mt-1 group">
            <summary className="tech-label w-fit cursor-pointer select-none text-pillar">
              Full term glossary
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
