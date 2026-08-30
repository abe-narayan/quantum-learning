"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { pillarVisual } from "@/lib/design/pillars";
import { CONCEPT_NODES } from "@/lib/content/concepts";
import type { GlossaryEntry, GlossaryTerm } from "@/lib/content/glossary";
import { foldForSearch } from "@/lib/search/match";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { SearchShortcutHint } from "@/components/search/SearchShortcutHint";
import { GlossaryStartHere } from "@/components/glossary/GlossaryStartHere";
import { ListBypassEnd, ListBypassLink } from "@/components/ui/ListBypass";

/**
 * The filter field's `id`, so the end-of-list "Back to the filter" link has
 * something to return focus to. A literal rather than `useId`, because it is
 * a fragment target: `useId` produces a different string every build, so
 * `/glossary#…` would not be stable, and this component is mounted once per
 * page, so there is nothing for it to collide with.
 */
const FILTER_FIELD_ID = "glossary-filter-field";
const LIST_END_ID = "glossary-list-end";

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
  // (GLOSSARY_TERMS is literally built from CONCEPT_NODES plus extra terms,
  // see lib/content/glossary.ts), so this set is exactly "which glossary
  // terms have a node on the concept map", no data duplication, and never a
  // fabricated link. `concepts.ts` is a small, budgeted client data module
  // (see clientBoundary.test.ts's CLIENT_DATA_BUDGET_KB), already imported
  // by the map's own client component.
  const conceptIds = useMemo(() => new Set(CONCEPT_NODES.map((node) => node.id)), []);

  const sorted = useMemo(
    () => [...terms].sort((a, b) => a.title.localeCompare(b.title)),
    [terms]
  );

  // Folded with the site search's own `foldForSearch`, not `toLowerCase()`.
  // Lowercasing alone left this field unable to answer "schrodinger",
  // "bohmer" or a ket typed as `|0>`, all of which the overlay one keystroke
  // away answers fine — the same word, the same corpus, two different
  // verdicts depending on which box the reader happened to type it into. The
  // fold strips diacritics, maps the Dirac angle brackets and every
  // typographic dash onto what a keyboard produces, and lowercases, so
  // "Schrödinger" and "schrodinger" are one string here as well.
  //
  // `lib/search/match.ts` is pure, dependency-free and already in the client
  // bundle (`SearchOverlay` imports it), so this costs nothing new at the
  // client boundary; the glossary corpus still never crosses it.
  const foldedTerms = useMemo(
    () =>
      sorted.map((term) => ({
        term,
        haystack: `${foldForSearch(term.title)} ${foldForSearch(term.definition)}`,
      })),
    [sorted]
  );

  const filtered = useMemo(() => {
    const needle = foldForSearch(query.trim());
    if (!needle) return sorted;
    return foldedTerms.filter(({ haystack }) => haystack.includes(needle)).map(({ term }) => term);
  }, [sorted, foldedTerms, query]);

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

  // The Start here tier is a *browsing* affordance, a path through the A-Z
  // for someone who doesn't yet know which word they're missing. Once the
  // reader is filtering they have named the word themselves, so the tier is
  // no longer helping and would only push their matches off-screen. It is
  // unmounted rather than hidden so its fifteen links can't be tabbed into
  // while invisible.
  const filtering = query.trim().length > 0;

  // A "See also" link points at another entry's `#id`. While a filter is
  // active that entry may not be rendered, and a bare `href="#..."` to an
  // element that isn't in the DOM silently does nothing, the worst kind of
  // broken link, because it looks fine. So a cross-reference clicked while
  // filtering clears the filter first and completes the jump on the next
  // render, once the destination actually exists.
  // A ref rather than state, and keyed on `query` rather than on itself: the
  // pending anchor is a one-shot instruction for the *next* render, not a
  // value anything renders, so putting it in state meant the effect had to
  // clear it by calling `setPendingAnchor(null)` inside itself, a
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
      {/* Persistent alphabet index, desktop: a sticky rail of real in-page
          anchors (not buttons), so it's a genuine jump-list a keyboard or
          screen-reader user can Tab/traverse, not a JS-only scroll gimmick.
          Letters with no current matches stay visible (the alphabet itself
          doesn't change) but are visually and functionally inert.

          `py-1` is load-bearing, not rhythm. `overflow-y-auto` clips at the
          padding box, and the site's `:focus-visible` is an `outline` at a
          2px offset, so it paints from 2px to 4px *outside* a letter's
          24 x 24px border box. With no vertical padding the first letter's
          ring sat above the scroll origin, where there is nothing to scroll
          back to, so it was cut off entirely. 4px of padding is exactly the
          ring's reach.

          Deliberately 24 x 24px, and deliberately the one control on the
          site under the house 44px floor. Recorded here rather than left as
          an unexplained inconsistency, because `min-h-11` is enforced
          everywhere else, including on this rail's own mobile twin below.

          It is not a violation. WCAG 2.2 SC 2.5.8 Target Size (Minimum) sets
          24px, and `gap-0.5` puts 2px between letters, so a 24px box with
          undisturbed spacing meets it. 44px is this codebase's *touch*
          standard, and this rail is `lg:`-only: at that width the pointer is
          a mouse, and the touch copy of the same A-Z (a full 44 x 44 per
          letter, further down this file) is what a thumb actually gets.

          The arithmetic is what settles it. The rail is
          `max-h-[calc(100vh-7rem)]`, so on a 900px-tall desktop it has 788px
          to work in. At 24px it is 26 x 24 + 25 x 2 = 674px and the whole
          alphabet is visible at once, which is the entire affordance: a
          persistent index you read as a shape. At 44px it would be
          26 x 44 + 25 x 2 = 1194px, so it would need its own internal scroll
          on every desktop viewport, and a jump-list you have to scroll to
          reach the letters of is not a jump list. Growing the targets would
          cost the thing they are targets for. */}
      <nav
        aria-label="Jump to letter"
        className="sticky top-24 hidden max-h-[calc(100vh-7rem)] flex-col items-center gap-0.5 overflow-y-auto py-1 pb-4 lg:flex"
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
        {/* Opaque `bg-surface`, no backdrop-blur, this sits directly under
            the sticky navbar, which deliberately uses the same opaque
            treatment rather than a blur, since blurring over the persistent
            animated canvas field (src/components/field/QuantumField.tsx)
            would force a recomposite on every scroll frame. See
            Navbar.tsx's own comment for the full rationale. */}
        {/* Sticky, but not on a viewport too short to spare the room. This
            bar is ~147px tall on a phone and it sits under the 64px navbar,
            so the two together own ~211px of chrome. The field was budgeted
            at 41px here, which was 5px light: `text-base` carries
            `--text-base--line-height: calc(1.5/1)`, so its content box is
            24px, not ~19px, and with `py-2.5` and two 1px borders the field
            is 46px. Re-derived in full:
              12   `py-3`, top
              46   the field (24 content + 20 padding + 2 border)
              21.2 `mt-2` + `.tech-label` at 1.2 line height
              56   `mt-1` + the A-Z strip's `py-1` + `h-11`
              12   `py-3`, bottom
            = 147.2px. That number is load-bearing twice over: it sets the
            `--anchor-top` every deep link into this page scrolls to (see the
            note on the letter headings below), so a 5px error there put the
            top of every `/glossary#term` target under this bar.
            On a 360px-tall phone in landscape that is 51% of the viewport
            spent on controls, leaving under two glossary entries visible,
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
              id={FILTER_FIELD_ID}
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

          {/* Mobile alphabet strip, same anchors as the desktop rail, in a
              horizontally scrolling row contained by its own overflow-x-auto
              so it can never cause page-level horizontal scroll.

              A `<nav>`, not a `<div>`. It carried `aria-label="Jump to
              letter"` on a bare div, where the attribute does nothing:
              `aria-label` needs a role to attach to, and a generic div has
              none, so the label was silently dropped and the phone-width
              A-Z was an unnamed run of 26 single-letter links. This is the
              same element the desktop rail already is, with the same name;
              only one of the two is ever in the accessibility tree, since
              the other is `display: none` at any given width.

              This is the *touch* copy of the A-Z, so its letters are a full
              44 x 44px rather than the rail's 24 x 24: a 24px target clears
              WCAG 2.5.8 (Minimum) and nothing more, and these sit 2px apart
              under a thumb, which is the geometry a mis-tap row is made of.
              Twenty-six adjacent targets is also the case where target *size*
              is the only lever there is: spacing them out cannot help, since
              every letter's neighbour is another letter, and the letters have
              to stay adjacent to read as an alphabet.

              Width was 32px until this pass, which met 2.5.8 and missed the
              site's 44px touch floor by a third — the one dimension of the
              one control that had been left short. It costs nothing but
              scroll: the strip is 26 x 44 + 25 x 2 = 1194px against the old
              26 x 32 + 25 x 2 = 882px, and both are several times any phone
              viewport, so this row already scrolled sideways and still does.
              Height is unchanged at `h-11`, so the sticky-bar budget derived
              above still holds to the pixel.

              The height it costs is real and is budgeted above: the sticky
              bar goes from ~123px to ~147px, so bar plus navbar is ~211px,
              still under a third of any viewport tall enough to keep the
              bar sticky at all (the `max-height:34rem` rule un-sticks it
              below that, which is the case the budget was protecting).

              `py-1` is not spacing. `overflow-x: auto` clips at the padding
              box on *both* axes (an `auto` on one axis computes the other
              from `visible` to `auto`), and the site's `:focus-visible`
              outline sits at a 2px offset, so it paints 2px to 4px outside
              a letter's border box. With no vertical padding the ring fell
              outside the padding box top and bottom, and the strip scrolls
              only sideways, so there was nothing to scroll to recover it:
              the ring was simply gone. 4px is exactly its reach. */}
          <nav className="mt-1 -mx-1 flex gap-0.5 overflow-x-auto px-1 py-1 lg:hidden" aria-label="Jump to letter">
            {ALPHABET.map((letter) =>
              presentLetters.has(letter) ? (
                <a
                  key={letter}
                  href={`#${letterAnchorId(letter)}`}
                  className="tech-value flex h-11 w-11 shrink-0 items-center justify-center rounded text-xs text-muted-foreground hover:bg-surface-muted hover:text-pillar-text"
                >
                  {letter}
                </a>
              ) : (
                <span
                  key={letter}
                  aria-hidden="true"
                  className="tech-value flex h-11 w-11 shrink-0 items-center justify-center text-xs text-subtle-foreground/30"
                >
                  {letter}
                </span>
              )
            )}
          </nav>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-2">
            {/* See `ui/ListBypass.tsx` for the counted case. In short: this
                page serves 1,476 tab stops and shipped exactly one skip
                link, which lands above all of them. The count is the
                *entries*, not the anchors, because that is the unit the
                reader can see and reason about. */}
            <ListBypassLink targetId={LIST_END_ID}>
              Skip past the {filtered.length} {filtered.length === 1 ? "entry" : "entries"} below
            </ListBypassLink>
            {[...groups.entries()].map(([letter, letterTerms]) => (
              <section key={letter} aria-labelledby={letterAnchorId(letter)}>
                {/* `scroll-mt-40` used to be here and did nothing at all.
                    globals.css declares `[id] { scroll-margin-top: 6rem }`
                    *outside* any cascade layer, and unlayered CSS beats every
                    layered rule regardless of specificity, Tailwind's
                    utilities all live in `@layer utilities`, so every
                    `scroll-mt-*` on an element that also carries an `id` is
                    silently overridden. (The same hazard globals.css itself
                    documents for `.tech-label`'s colour, one section up from
                    the `[id]` rule.) The site-wide fix is to wrap that rule
                    in `@layer base`; until then an inline style is the only
                    declaration that outranks it.

                    The offset itself comes from a custom property so it can
                    still vary by viewport, a utility setting `--anchor-top`
                    is not competing with anything. 14rem (224px) clears the
                    64px navbar plus this page's ~147px sticky filter bar; on a
                    short viewport that bar is `static` (see above), so only
                    the navbar has to be cleared and the offset drops to 5rem
                    rather than throwing away half a landscape screen.

                    It was 13rem (208px) against a bar whose real bottom edge
                    is at 64 + 147.2 = 211.2px, so every deep link into this
                    page — every `<Term>` gloss, every search hit — landed with
                    the top 3.2px of its target under the bar. Harmless-looking
                    because the targets carry `pt-8`/`py-5` so the *text*
                    cleared; what got shaved was the `target:` pillar wash and
                    left border, i.e. exactly the cue that says "this is the
                    entry you asked for". At `sm` the clearance was 0.8px. */}
                {/* `tabIndex={-1}` is what makes the two A-Z rails above do
                    the job they look like they do. They are fragment links,
                    and a fragment link to a non-focusable element scrolls the
                    viewport and leaves focus exactly where it was: a keyboard
                    reader who "jumped to S" was still 900 anchors back in the
                    tab order, and the next Tab threw them back to where they
                    had been looking. A negative tabindex adds no tab stop of
                    its own; it only makes this heading a legal focus
                    destination, so the browser hands focus over on arrival
                    and Tab continues from the letter the reader asked for.

                    Only the letter headings, not the ~150 entry rows below.
                    The rows are fragment targets too (every `<Term>` gloss
                    deep-links to one) and the same argument applies to them,
                    but they are already announced by the `:target` wash and
                    giving each a focus ring on arrival is a visible change to
                    every deep link into this page, which is a design call
                    rather than a defect fix. Left alone on purpose. */}
                <div
                  id={letterAnchorId(letter)}
                  tabIndex={-1}
                  style={{ scrollMarginTop: "var(--anchor-top)" }}
                  className="[--anchor-top:14rem] flex items-baseline gap-3 border-b border-border pb-1.5 pt-8 first:pt-4 [@media(max-height:34rem)]:[--anchor-top:5rem]"
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
                        // entry 110px underneath this page's own sticky filter
                        // bar, the reader arrives at a highlighted row they
                        // cannot see and has to scroll up to find what they
                        // clicked.
                        style={{ scrollMarginTop: "var(--anchor-top)" }}
                        // The `:target` treatment is what makes a deep link
                        // land *visibly*. `/glossary#dirac-notation` (from
                        // MechanicsSection, from lessons, from every `<Term>`
                        // gloss's "Full glossary entry →") scrolls the entry
                        // into view, but in a wall of a hundred-odd similar
                        // rows "which one did I just arrive at?" is a real
                        // question, especially now that the Start here tier
                        // sends readers into the list by anchor too. The
                        // transparent left border and negative margin are
                        // always present so lighting it up shifts nothing.
                        className="-ml-4 [--anchor-top:14rem] border-l-2 border-transparent py-5 pl-4 target:border-pillar target:bg-pillar-wash [@media(max-height:34rem)]:[--anchor-top:5rem]"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                          <dt className="font-display text-lg font-semibold tracking-tight text-foreground">
                            {term.title}
                          </dt>
                          {/* Two independent signals, both readable without
                              color: how much background the entry assumes
                              (`DifficultyMark`'s filled/hollow ticks *plus*
                              the level spelled out, the same instrument
                              courses, lessons and problems already use) and
                              which pillar it belongs to. Neither is a badge
                              the reader earns; both are labels on a
                              reference. */}
                          <div className="flex shrink-0 items-center gap-3">
                            <DifficultyMark difficulty={term.level} />
                            {/* `PILLAR_LABEL` is the whole point of this chip
                                for a screen-reader user, and as an
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
                            <span className="rounded-full border border-pillar-edge bg-pillar-wash px-2.5 py-0.5 text-meta font-medium uppercase tracking-wide text-pillar-text">
                              <span aria-hidden="true">{visual.short}</span>
                              <span className="sr-only">{PILLAR_LABEL[term.pillar]} track</span>
                            </span>
                          </div>
                        </div>
                        <dd className="mt-1.5 max-w-lede text-sm leading-relaxed text-muted-foreground">
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
                          {/* 19 lesson titles on this page are also glossary
                              titles, so "Quantum Teleportation" was the name
                              of two links in the same links list: this one,
                              going to the lesson, and the "See also"
                              cross-reference above going to `#<id>` on this
                              page. Both are legitimate and neither is
                              redundant, which is what makes it a naming
                              problem rather than a duplicate-link one.

                              The suffix goes on this link because this is the
                              one whose destination is not the thing it is
                              named after: the cross-reference above genuinely
                              is the entry called "Quantum Teleportation",
                              while this is the *lesson* that teaches it. The
                              visible title stays a contiguous run at the
                              front of the name for SC 2.5.3. */}
                          {coveredIn.map((lesson) => (
                            <Link
                              key={lesson.slug}
                              href={`/lessons/${lesson.slug}`}
                              aria-label={`${lesson.title} lesson`}
                              className="text-sm text-pillar-text underline decoration-pillar-edge underline-offset-2 hover:decoration-pillar"
                            >
                              {lesson.title}
                            </Link>
                          ))}
                          {/* Both of these links repeat their visible text
                              across the whole page — "Try the simulator" 61
                              times over 13 destinations, "See how this
                              connects on the map" 59 times over 59 different
                              `/map?concept=` URLs — so the links list a
                              screen-reader user pulls up (WCAG 2.4.4) was 120
                              rows of two sentences, out of the entry context
                              that was the only thing distinguishing them.
                              Naming each one with its term fixes that with
                              real data already on this row.

                              Phrasing is constrained by WCAG 2.5.3 Label in
                              Name: the visible text must survive inside the
                              accessible name as a contiguous run, so a speech
                              user saying "click Try the simulator" still hits
                              it. `Try the ${simulator} simulator` would break
                              that (it splits "the ... simulator"); "for
                              <term>" appended keeps the visible run whole.
                              The term, not the simulator's name: there is no
                              client-safe registry of simulator titles to read
                              one from (the only list lives in
                              lib/search/index.ts, which this component has no
                              business importing), and inventing one from the
                              anchor slug would be the same guesswork this
                              site avoids elsewhere. */}
                          {term.simulatorId ? (
                            <Link
                              href={simulatorHref(term.simulatorId)}
                              aria-label={`Try the simulator for ${term.title}`}
                              className="text-sm text-foreground underline decoration-border underline-offset-2 hover:text-pillar-text hover:decoration-pillar"
                            >
                              Try the simulator
                            </Link>
                          ) : null}
                          {conceptIds.has(term.id) ? (
                            <Link
                              href={`/map?concept=${term.id}`}
                              aria-label={`See how this connects on the map: ${term.title}`}
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

            {/* The landing pad for the link above, and the only route back to
                the filter field that is not 1,471 Shift+Tabs. Invisible until
                something inside it has focus. */}
            <ListBypassEnd
              id={LIST_END_ID}
              backTo={FILTER_FIELD_ID}
              backLabel="Back to the filter"
            >
              End of the glossary. {filtered.length} of {terms.length} terms listed.
            </ListBypassEnd>
          </div>
        ) : (
          <div className="mt-8 text-sm text-muted-foreground">
            <p className="text-foreground">No terms match &ldquo;{query}&rdquo;.</p>
            {/* The way *back* comes first, before the two ways onward. Every
                other route out of this state (site search, the concept map)
                leaves the page; clearing the filter restores the A-Z and the
                Start here tier, which is the cheapest correct answer for a
                reader who has simply mistyped a word, and it was the one thing
                this state did not offer. */}
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-(--radius-tight) border border-pillar-edge bg-pillar-wash px-4 text-sm font-medium text-pillar-text transition-colors duration-(--dur-fast) ease-instrument hover:border-pillar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Clear the filter and show all {terms.length} terms
              <span aria-hidden="true">→</span>
            </button>
            <p className="mt-4">
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
