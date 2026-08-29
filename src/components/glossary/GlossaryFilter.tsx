"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { pillarVisual } from "@/lib/design/pillars";
import { CONCEPT_NODES } from "@/lib/content/concepts";
import type { GlossaryEntry, GlossaryTerm } from "@/lib/content/glossary";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { SearchShortcutHint } from "@/components/search/SearchShortcutHint";
import { GlossaryStartHere } from "@/components/glossary/GlossaryStartHere";

const PILLAR_LABEL: Record<GlossaryTerm["pillar"], string> = {
  "quantum-mechanics": "Quantum Mechanics",
  "quantum-computing": "Quantum Computing",
  "quantum-hardware": "Quantum Hardware",
  "quantum-software": "Quantum Software",
  "quantum-mastery": "Quantum Mastery",
  apex: "Apex",
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function letterOf(title: string): string {
  const first = title.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(first) ? first : "#";
}

function simulatorHref(simulatorId: NonNullable<GlossaryTerm["simulatorId"]>) {
  return `/simulators#${simulatorId}`;
}

function letterAnchorId(letter: string) {
  return `glossary-${letter === "#" ? "misc" : letter}`;
}

export function GlossaryFilter({
  terms,
  startHereTerms,
  lessonTitles,
}: {
  terms: GlossaryEntry[];
  /** The curated beginner tier, already in reading order (`getStartHereTerms()`). */
  startHereTerms: GlossaryEntry[];
  /** Real lesson slug -> real lesson title, sourced from getAllLessonsMeta() on the server. */
  lessonTitles: Record<string, string>;
}) {
  const [query, setQuery] = useState("");

  const titlesById = useMemo(
    () => new Map(terms.map((term) => [term.id, term.title])),
    [terms]
  );

  // Every /map concept node is also a glossary term sharing the same `id`
  // (GLOSSARY_TERMS is literally built from CONCEPT_NODES plus extra terms —
  // see lib/content/glossary.ts), so this set is exactly "which glossary
  // terms have a node on the concept map" — no data duplication, and never a
  // fabricated link. `concepts.ts` is a small, budgeted client data module
  // (see clientBoundary.test.ts's CLIENT_DATA_BUDGET_KB), already imported
  // by the map's own client component.
  const conceptIds = useMemo(() => new Set(CONCEPT_NODES.map((node) => node.id)), []);

  const sorted = useMemo(
    () => [...terms].sort((a, b) => a.title.localeCompare(b.title)),
    [terms]
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return sorted;
    return sorted.filter(
      (term) => term.title.toLowerCase().includes(needle) || term.definition.toLowerCase().includes(needle)
    );
  }, [sorted, query]);

  const groups = useMemo(() => {
    const map = new Map<string, GlossaryEntry[]>();
    for (const term of filtered) {
      const letter = letterOf(term.title);
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(term);
    }
    return map;
  }, [filtered]);

  const presentLetters = useMemo(() => new Set(groups.keys()), [groups]);

  // The Start here tier is a *browsing* affordance — a path through the A-Z
  // for someone who doesn't yet know which word they're missing. Once the
  // reader is filtering they have named the word themselves, so the tier is
  // no longer helping and would only push their matches off-screen. It is
  // unmounted rather than hidden so its fifteen links can't be tabbed into
  // while invisible.
  const filtering = query.trim().length > 0;

  // A "See also" link points at another entry's `#id`. While a filter is
  // active that entry may not be rendered, and a bare `href="#..."` to an
  // element that isn't in the DOM silently does nothing — the worst kind of
  // broken link, because it looks fine. So a cross-reference clicked while
  // filtering clears the filter first and completes the jump on the next
  // render, once the destination actually exists.
  // A ref rather than state, and keyed on `query` rather than on itself: the
  // pending anchor is a one-shot instruction for the *next* render, not a
  // value anything renders, so putting it in state meant the effect had to
  // clear it by calling `setPendingAnchor(null)` inside itself — a
  // set-state-in-effect cascade that React's compiler lint rejects outright.
  // Reading and clearing a ref does the same job with no extra render.
  const pendingAnchorRef = useRef<string | null>(null);

  useEffect(() => {
    const anchor = pendingAnchorRef.current;
    if (anchor === null) return;
    pendingAnchorRef.current = null;
    // Assigning the hash (rather than scrollIntoView) is deliberate: it both
    // scrolls and updates `:target`, so the destination highlights exactly as
    // it would for a deep link arriving from a lesson.
    if (document.getElementById(anchor)) window.location.hash = `#${anchor}`;
  }, [query]);

  const crossReference = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (!filtering) return;
    event.preventDefault();
    pendingAnchorRef.current = id;
    setQuery("");
  };

  return (
    <>
      {filtering ? null : (
        <div className="mb-10">
          <GlossaryStartHere terms={startHereTerms} />
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[2.75rem_1fr] lg:items-start lg:gap-10">
      {/* Persistent alphabet index — desktop: a sticky rail of real in-page
          anchors (not buttons), so it's a genuine jump-list a keyboard or
          screen-reader user can Tab/traverse, not a JS-only scroll gimmick.
          Letters with no current matches stay visible (the alphabet itself
          doesn't change) but are visually and functionally inert. */}
      <nav
        aria-label="Jump to letter"
        className="sticky top-24 hidden max-h-[calc(100vh-7rem)] flex-col items-center gap-0.5 overflow-y-auto pb-4 lg:flex"
      >
        {ALPHABET.map((letter) => {
          const present = presentLetters.has(letter);
          return present ? (
            <a
              key={letter}
              href={`#${letterAnchorId(letter)}`}
              className="tech-value flex h-6 w-6 items-center justify-center rounded text-xs text-muted-foreground transition-colors hover:bg-surface-muted hover:text-pillar-text"
            >
              {letter}
            </a>
          ) : (
            <span
              key={letter}
              aria-hidden="true"
              className="tech-value flex h-6 w-6 items-center justify-center text-xs text-subtle-foreground/40"
            >
              {letter}
            </span>
          );
        })}
      </nav>

      <div>
        {/* Opaque `bg-surface`, no backdrop-blur — this sits directly under
            the sticky navbar, which deliberately uses the same opaque
            treatment rather than a blur, since blurring over the persistent
            animated canvas field (src/components/field/QuantumField.tsx)
            would force a recomposite on every scroll frame. See
            Navbar.tsx's own comment for the full rationale. */}
        {/* Sticky, but not on a viewport too short to spare the room. This
            bar is ~118px tall on a phone (12px padding, a 41px field, the
            21px count line, the 32px A-Z strip, 12px padding) and it sits
            under the 64px navbar, so the two together own 182px of chrome.
            On a 360px-tall phone in landscape that is 51% of the viewport
            spent on controls, leaving under two glossary entries visible —
            the reader can no longer scan the list the bar exists to help
            them scan. Above 34rem (544px) of viewport height the bar costs
            at most a third of the screen and stays sticky, which is the case
            it was designed for. `static`, not `hidden`: the filter and the
            jump list are still there on a short screen, they just scroll
            with the page like everything else. */}
        <div className="sticky top-16 z-10 -mx-4 bg-surface px-4 py-3 [@media(max-height:34rem)]:static sm:mx-0 sm:px-0">
          <label className="block">
            <span className="sr-only">Filter glossary terms</span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Filter ${terms.length} terms…`}
              // `.input-instrument` (globals.css §8) carries the shared field
              // identity; focus now comes from the sitewide `:focus-visible`
              // pillar outline instead of a one-off border tint.
              // `text-base` below `sm` (like AnswerInput): iOS Safari zooms
              // the whole page on focusing any field under 16px.
              className="input-instrument w-full px-4 py-2.5 text-base sm:text-sm"
            />
          </label>
          {/* `role="status"`: typing repaints the whole A-Z silently
              otherwise. Already mounted from first paint (the reliability
              condition Feedback.tsx documents), so only the semantics were
              missing. */}
          <p role="status" aria-live="polite" className="mt-2 tech-label">
            {filtered.length === terms.length ? `${terms.length} terms` : `${filtered.length} of ${terms.length} terms`}
          </p>

          {/* Mobile alphabet strip — same anchors as the desktop rail, in a
              horizontally scrolling row contained by its own overflow-x-auto
              so it can never cause page-level horizontal scroll.

              A `<nav>`, not a `<div>`. It carried `aria-label="Jump to
              letter"` on a bare div, where the attribute does nothing:
              `aria-label` needs a role to attach to, and a generic div has
              none — so the label was silently dropped and the phone-width
              A-Z was an unnamed run of 26 single-letter links. This is the
              same element the desktop rail already is, with the same name;
              only one of the two is ever in the accessibility tree, since
              the other is `display: none` at any given width. */}
          <nav className="mt-2 -mx-1 flex gap-0.5 overflow-x-auto px-1 lg:hidden" aria-label="Jump to letter">
            {ALPHABET.map((letter) =>
              presentLetters.has(letter) ? (
                <a
                  key={letter}
                  href={`#${letterAnchorId(letter)}`}
                  className="tech-value flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs text-muted-foreground hover:bg-surface-muted hover:text-pillar-text"
                >
                  {letter}
                </a>
              ) : (
                <span
                  key={letter}
                  aria-hidden="true"
                  className="tech-value flex h-6 w-6 shrink-0 items-center justify-center text-xs text-subtle-foreground/30"
                >
                  {letter}
                </span>
              )
            )}
          </nav>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-2">
            {[...groups.entries()].map(([letter, letterTerms]) => (
              <section key={letter} aria-labelledby={letterAnchorId(letter)}>
                {/* `scroll-mt-40` used to be here and did nothing at all.
                    globals.css declares `[id] { scroll-margin-top: 6rem }`
                    *outside* any cascade layer, and unlayered CSS beats every
                    layered rule regardless of specificity — Tailwind's
                    utilities all live in `@layer utilities`, so every
                    `scroll-mt-*` on an element that also carries an `id` is
                    silently overridden. (The same hazard globals.css itself
                    documents for `.tech-label`'s colour, one section up from
                    the `[id]` rule.) The site-wide fix is to wrap that rule
                    in `@layer base`; until then an inline style is the only
                    declaration that outranks it.

                    The offset itself comes from a custom property so it can
                    still vary by viewport — a utility setting `--anchor-top`
                    is not competing with anything. 12rem clears the 64px
                    navbar plus this page's ~118px sticky filter bar; on a
                    short viewport that bar is `static` (see above), so only
                    the navbar has to be cleared and the offset drops to 5rem
                    rather than throwing away half a landscape screen. */}
                <div
                  id={letterAnchorId(letter)}
                  style={{ scrollMarginTop: "var(--anchor-top)" }}
                  className="[--anchor-top:12rem] flex items-baseline gap-3 border-b border-border pb-1.5 pt-8 first:pt-4 [@media(max-height:34rem)]:[--anchor-top:5rem]"
                >
                  <h2 className="font-display text-2xl font-semibold text-pillar-text">{letter}</h2>
                  <span className="tech-label">
                    {letterTerms.length} term{letterTerms.length === 1 ? "" : "s"}
                  </span>
                </div>

                <dl className="divide-y divide-border">
                  {letterTerms.map((term) => {
                    const coveredIn = term.lessonSlugs
                      .map((slug) => ({ slug, title: lessonTitles[slug] }))
                      .filter((lesson): lesson is { slug: string; title: string } => Boolean(lesson.title));
                    const visual = pillarVisual(term.pillar);

                    return (
                      <div
                        key={term.id}
                        id={term.id}
                        data-pillar={term.pillar}
                        // Same dead-`scroll-mt` story as the letter heading
                        // above, and this is the anchor that actually carries
                        // traffic: every `<Term>` gloss, the homepage's
                        // "Dirac notation, in the glossary →", the Start here
                        // cards, and every glossary hit in site search deep
                        // link to `/glossary#<id>`. With the utility dead the
                        // browser used globals.css's 6rem, and 6rem lands the
                        // entry 86px underneath this page's own sticky filter
                        // bar — the reader arrives at a highlighted row they
                        // cannot see and has to scroll up to find what they
                        // clicked.
                        style={{ scrollMarginTop: "var(--anchor-top)" }}
                        // The `:target` treatment is what makes a deep link
                        // land *visibly*. `/glossary#dirac-notation` (from
                        // MechanicsSection, from lessons, from every `<Term>`
                        // gloss's "Full glossary entry →") scrolls the entry
                        // into view, but in a wall of a hundred-odd similar
                        // rows "which one did I just arrive at?" is a real
                        // question — especially now that the Start here tier
                        // sends readers into the list by anchor too. The
                        // transparent left border and negative margin are
                        // always present so lighting it up shifts nothing.
                        className="-ml-4 [--anchor-top:12rem] border-l-2 border-transparent py-5 pl-4 target:border-pillar target:bg-pillar-wash [@media(max-height:34rem)]:[--anchor-top:5rem]"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                          <dt className="font-display text-lg font-semibold tracking-tight text-foreground">
                            {term.title}
                          </dt>
                          {/* Two independent signals, both readable without
                              color: how much background the entry assumes
                              (`DifficultyMark`'s filled/hollow ticks *plus*
                              the level spelled out — the same instrument
                              courses, lessons and problems already use) and
                              which pillar it belongs to. Neither is a badge
                              the reader earns; both are labels on a
                              reference. */}
                          <div className="flex shrink-0 items-center gap-3">
                            <DifficultyMark difficulty={term.level} />
                            {/* `PILLAR_LABEL` is the whole point of this chip
                                for a screen-reader user — and as an
                                `aria-label` on a bare `<span>` it never
                                reached one. A span with no `role` is
                                `generic`, ARIA prohibits naming a generic
                                element, so the attribute was silently dropped
                                and each of the ~150 entries announced only
                                `visual.short` ("Computing"), with nothing to
                                say it named a pillar. The short form is the
                                one that has to be *visible* (this sits on a
                                cramped row beside the difficulty mark), so the
                                two swap roles: the abbreviation is hidden from
                                AT, the full label is real `sr-only` text.
                                Identical treatment to the same badge in
                                map/ConceptDetailPanel.tsx. */}
                            <span className="rounded-full border border-pillar-edge bg-pillar-wash px-2.5 py-0.5 text-[0.6875rem] font-medium uppercase tracking-wide text-pillar-text">
                              <span aria-hidden="true">{visual.short}</span>
                              <span className="sr-only">{PILLAR_LABEL[term.pillar]} pillar</span>
                            </span>
                          </div>
                        </div>
                        <dd className="mt-1.5 max-w-[42rem] text-sm leading-relaxed text-muted-foreground">
                          {term.definition}
                        </dd>

                        {term.relatedIds.length > 0 ? (
                          // Two-way traffic between the beginner layer and
                          // the research layer: `shot` points up at
                          // `shot-noise-standard-error`, and that entry
                          // points back down. Same-page `#` anchors, so the
                          // `:target` rule above highlights the destination.
                          <dd className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className="tech-label">See also</span>
                            {term.relatedIds.map((relatedId) => (
                              <a
                                key={relatedId}
                                href={`#${relatedId}`}
                                onClick={crossReference(relatedId)}
                                className="text-sm text-muted-foreground underline decoration-border underline-offset-2 hover:text-pillar-text hover:decoration-pillar"
                              >
                                {titlesById.get(relatedId) ?? relatedId}
                              </a>
                            ))}
                          </dd>
                        ) : null}

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                          {coveredIn.map((lesson) => (
                            <Link
                              key={lesson.slug}
                              href={`/lessons/${lesson.slug}`}
                              className="text-sm text-pillar-text underline decoration-pillar-edge underline-offset-2 hover:decoration-pillar"
                            >
                              {lesson.title}
                            </Link>
                          ))}
                          {term.simulatorId ? (
                            <Link
                              href={simulatorHref(term.simulatorId)}
                              className="text-sm text-foreground underline decoration-border underline-offset-2 hover:text-pillar-text hover:decoration-pillar"
                            >
                              Try the simulator
                            </Link>
                          ) : null}
                          {conceptIds.has(term.id) ? (
                            <Link
                              href={`/map?concept=${term.id}`}
                              className="text-sm text-foreground underline decoration-border underline-offset-2 hover:text-pillar-text hover:decoration-pillar"
                            >
                              See how this connects on the map
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </dl>
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-8 text-sm text-muted-foreground">
            <p>No terms match &ldquo;{query}&rdquo;.</p>
            <p className="mt-2">
              {/* Resolved per platform rather than hardcoded: this line is
                  read by someone who has just failed to find a term and is
                  being told how to search properly, and "Ctrl K" on a Mac
                  reads as "this site has no shortcut for you". */}
              Try <SearchShortcutHint /> to search lessons, problems and simulators by name, or
              browse the{" "}
              <Link
                href="/map"
                className="text-pillar-text underline decoration-pillar-edge underline-offset-2 hover:decoration-pillar"
              >
                concept map
              </Link>{" "}
              to find it by what it connects to.
            </p>
          </div>
        )}
        </div>
      </div>
    </>
  );
}
