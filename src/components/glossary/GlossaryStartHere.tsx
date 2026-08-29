import Link from "next/link";
import type { GlossaryEntry } from "@/lib/content/glossary";
import { Panel } from "@/components/ui/Panel";
import { TechLabel } from "@/components/ui/Typography";

/**
 * ============================================================
 * The "Start here" tier
 * ============================================================
 * A glossary sorted A-to-Z is a *lookup* tool: perfect once you know the
 * word you're missing, useless when you don't know which words you're
 * missing. This page's first screen previously opened on "Amplitude,
 * Adiabatic Theorem, Amplitude Estimation (QPE-Free)…", which tells a reader
 * with no background nothing about where to begin — the entries they need
 * are scattered from A to W among a hundred research-level ones.
 *
 * So the page opens on a short, ordered path instead: the fifteen terms
 * (`START_HERE_IDS` in `lib/content/glossary.ts`) that the introductory
 * lessons assume a reader already has, in *reading* order rather than
 * alphabetical. It is a curated table of contents, not a second glossary.
 *
 * ## Why these are links, not duplicated entries
 *
 * Two constraints force it, and they happen to agree:
 *
 *   1. `/glossary#<id>` is a real deep link — lessons use it, and every
 *      `<Term>` gloss ends with "Full glossary entry →" pointing at it. A DOM
 *      `id` must be unique, so an entry rendered twice on one page (once here,
 *      once in its letter section) would make the anchor ambiguous and, in
 *      practice, land the reader on whichever copy the browser found first.
 *   2. Fifteen full entries repeated above the A-Z would push the alphabet
 *      itself below the fold, trading one discovery problem for another.
 *
 * Each card therefore carries the entry's opening lines (clamped) and links
 * to the single canonical entry below, which `:target`-highlights on arrival
 * so the jump is visibly resolved rather than leaving the reader hunting for
 * where they landed. The clamp is CSS (`line-clamp-3`), never a substring:
 * the definitions are full of `|0⟩`, `Tr(ρ²) < 1.` and similar, and any
 * "split on the first period" heuristic would eventually cut one in half.
 *
 * The ordinal is a reading position, not a score. Nothing here is unlocked,
 * completed, or awarded.
 */
export function GlossaryStartHere({ terms }: { terms: GlossaryEntry[] }) {
  if (terms.length === 0) return null;

  return (
    <Panel className="p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div>
          <TechLabel className="text-pillar">Start here</TechLabel>
          <h2 id="start-here" className="mt-1.5 scroll-mt-40 font-display text-xl font-semibold text-foreground">
            The first {terms.length} terms
          </h2>
        </div>
        <p className="tech-label">Reading order · foundational</p>
      </div>

      <p className="mt-3 max-w-[46rem] text-sm leading-relaxed text-muted-foreground">
        Read in this order, these are the words the introductory lessons assume you already have.
        Everything else on this page is alphabetical and can wait until you meet it. Each one links
        to its full entry below.
      </p>

      <ol className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
        {terms.map((term, index) => (
          <li key={term.id} data-pillar={term.pillar}>
            <Link
              href={`#${term.id}`}
              // The whole card is the target, but the *name* is just the term.
              // Without this, the accessible name concatenates the index, the
              // title and the entire three-line definition preview: 391
              // characters for "Quantum State (State Vector)", read out in
              // full before a screen-reader user can decide whether to
              // activate it. `aria-label` stops the name computation, and the
              // preview stays exactly as visible content for everyone else —
              // it is a preview, not a label. Measured across all 15 cards;
              // 12 exceeded 170 characters.
              aria-label={term.title}
              className="group block border-l border-border pl-3 transition-colors hover:border-pillar"
            >
              <div className="flex items-baseline gap-2">
                <span aria-hidden="true" className="tech-value text-xs text-subtle-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-sm font-semibold text-foreground group-hover:text-pillar-text">
                  {term.title}
                </span>
              </div>
              <span className="mt-1 line-clamp-3 block text-sm leading-relaxed text-muted-foreground">
                {term.definition}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
