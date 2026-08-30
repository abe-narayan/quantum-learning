"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { Pillar } from "@/lib/content/types";
import { PILLAR_VISUALS } from "@/lib/design/pillars";
import { fetchSearchIndex } from "@/lib/search/fetchIndex";
import { prepareSearchEntries, type SearchableEntry } from "@/lib/search/match";
import { suggestCorrection } from "@/lib/search/didYouMean";
import { suggestionTokensFor } from "./suggestionQuery";
import { rankResults } from "@/lib/search/rank";
import type { SearchEntryType } from "@/lib/search/types";
import { SEARCH_DIALOG_ID } from "@/lib/search/ids";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<SearchEntryType, string> = {
  term: "Glossary",
  lesson: "Lessons",
  problem: "Problems",
  simulator: "Simulators",
  course: "Courses",
  track: "Tracks",
};

/**
 * The same six kinds as a plural noun, for the "show all" control's own
 * sentence.
 *
 * The group header above it already says "Glossary 96", but a button's
 * accessible name is read on its own, and up to six of these are on screen at
 * once: "Show all 96" six times over is six identical controls to a screen
 * reader. "Show all 96 glossary terms" is unambiguous wherever it is heard.
 */
const TYPE_NOUNS: Record<SearchEntryType, string> = {
  term: "glossary terms",
  lesson: "lessons",
  problem: "problems",
  simulator: "simulators",
  course: "courses",
  track: "tracks",
};

// Matching, scoring, group ordering and the question-stem rewrite all live in
// `@/lib/search/rank` (which composes `match`, `groupRanking` and
// `questionQuery`), pure and unit-tested against the real
// `public/search-index.json`. What is left here is presentation: how many rows
// a group shows, where the pillar sub-headers fall, and what the empty screen
// offers instead.
const RESULTS_PER_GROUP = 6;

/** No group is expanded until a reader asks. Hoisted so the "nothing is
 *  expanded" case is one constant array rather than a fresh `[]` per render,
 *  which would re-run the grouping memo on every keystroke. */
const NO_EXPANDED_GROUPS: SearchEntryType[] = [];

/** Where an empty-handed search sends someone. Real routes only. */
const NO_RESULT_ROUTES = [
  { href: "/glossary", label: "Glossary", hint: "look a word up" },
  { href: "/map", label: "Concept map", hint: "see how ideas connect" },
  { href: "/learn", label: "Learning path", hint: "start from the beginning" },
];

// Matching and scoring live in `@/lib/search/match` (pure, unit-tested):
// queries and entries are diacritic-folded so "schrodinger" finds
// "Schrödinger", tokens AND-match in any order so "state bell" finds "Bell
// state", and `matchScore` keeps the old hierarchy, exact title, title
// prefix, title substring, description-only, and now lesson-body-terms-only,
// sorted *before* pillar order so a literal title hit is never buried under a
// pillar that merely happens to come earlier in the curriculum and mentions
// the word in passing.

type SearchOverlayProps = {
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
};

type IndexStatus = "loading" | "ready" | "error";

export function SearchOverlay({ onClose, triggerRef }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchableEntry[]>([]);
  const [indexStatus, setIndexStatus] = useState<IndexStatus>("loading");
  // Bumped by the retry button on the error screen; the load effect below
  // depends on it, so incrementing it re-runs the fetch. `fetchSearchIndex`
  // nulls its module-scope cache on failure precisely so a second attempt is
  // a real attempt and not the first rejection handed back, which is what
  // makes a retry control honest rather than decorative.
  const [loadAttempt, setLoadAttempt] = useState(0);
  // Which kind groups the reader has asked to see in full, and the query they
  // asked it of. Stored together rather than as a bare array reset by an
  // effect: a group expanded for "qubit" means nothing once the query is
  // "grover", and comparing the query here makes that reset a property of the
  // read rather than a second render that briefly shows the wrong thing.
  const [expanded, setExpanded] = useState<{ query: string; types: SearchEntryType[] }>({
    query: "",
    types: NO_EXPANDED_GROUPS,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  // The "did you mean" control, so ArrowDown out of the field can reach it on
  // the one screen where there are no result links to walk into.
  const suggestionRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // The index isn't baked into the page, it's fetched lazily, only once the
  // overlay actually mounts (i.e. once the user opens search), and cached at
  // module scope by `fetchSearchIndex()` so re-opening never re-fetches.
  //
  // Glossary terms ride along inside that same JSON (see `buildSearchIndex`),
  // deliberately: the glossary module is a large prose corpus under a
  // client-bundle budget, so it must never be imported from this directory.
  useEffect(() => {
    let cancelled = false;
    fetchSearchIndex()
      .then((data) => {
        if (cancelled) return;
        // Fold once, at load: ~190KB of title/description text folded per
        // keystroke was the old cost; folded match fields are precomputed
        // here and the per-keystroke path only folds the query.
        setIndex(prepareSearchEntries(data));
        setIndexStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setIndexStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [loadAttempt]);

  // Status is moved to "loading" here rather than at the top of the effect, so
  // the effect stays a pure "fetch on attempt N" and there is no set-state
  // inside it to cascade. Focus goes back to the field because this button is
  // about to unmount with the error screen it lives on, and focus landing on
  // <body> inside an open modal strands a keyboard user outside the trap.
  function retryIndexLoad() {
    setIndexStatus("loading");
    setLoadAttempt((attempt) => attempt + 1);
    inputRef.current?.focus();
  }

  // Result rows are looked up from the DOM on demand (rather than kept in a
  // ref array built during render) so arrow-key navigation always walks
  // exactly what is currently on screen, without mutating a ref in the render
  // body.
  //
  // A group's "show all" control is part of that walk (`[data-search-more]`),
  // not something Tab has to be remembered for: it sits at the bottom of the
  // rows it belongs to, so a reader arrowing down the sixth glossary result
  // lands on "show all 96 glossary terms" next, in reading order, and arrows
  // straight on into the lessons if they don't want it. `querySelectorAll`
  // returns document order, so that ordering is the DOM's rather than
  // something this function has to sort.
  function getResultLinks(): HTMLElement[] {
    const dialog = dialogRef.current;
    if (!dialog) return [];
    return Array.from(
      dialog.querySelectorAll<HTMLElement>("[data-search-result], [data-search-more]")
    );
  }

  // Everything about *which* results and in what order, matching, the
  // relevance bands, group order, and the question-stem rewrite, is
  // `rankResults`, which is pure and tested against the real committed index.
  const ranked = useMemo(() => rankResults(index, query), [index, query]);

  // The groups the reader has opened, for *this* query. Anything expanded
  // under a previous query is forgotten without a state write.
  const expandedTypes = expanded.query === query ? expanded.types : NO_EXPANDED_GROUPS;

  /** Open one group to its full length, or close it back to the cap. */
  function toggleGroup(type: SearchEntryType) {
    setExpanded((current) => {
      const types = current.query === query ? current.types : NO_EXPANDED_GROUPS;
      return {
        query,
        types: types.includes(type)
          ? types.filter((other) => other !== type)
          : [...types, type],
      };
    });
  }

  // What is left here is the two-level presentation: grouped by kind (the
  // primary split, a visitor searching mid-lesson almost always wants
  // "Lessons" first), and within each kind, pillar-major ordered so the
  // curriculum's own structure shows through rather than an arbitrary index
  // order. `visible` is capped at RESULTS_PER_GROUP per kind so six pillars'
  // worth of matches can't blow the panel out, until the reader asks for one
  // group in full; `pillarBreaks` records which visible rows start a new
  // pillar cluster, for the sub-headers below.
  const groups = useMemo(() => {
    return ranked.groups.map(({ type, matches }) => {
      const isExpanded = expandedTypes.includes(type);
      const visible = (isExpanded ? matches : matches.slice(0, RESULTS_PER_GROUP)).map(
        (match) => match.entry
      );
      const pillarBreaks = new Set<number>();
      const seenPillars = new Set<string>();
      // Relevance now outranks pillar order, so a pillar *can* show up in two
      // separate runs (a title hit in Mechanics, then later a
      // description-only hit in Mechanics). Sub-headers only make sense while
      // each pillar is one contiguous cluster; the moment one isn't, the
      // per-row pillar chips take over instead of printing "Mechanics" twice
      // as if they were different sections.
      let pillarsAreContiguous = true;
      let previousPillar: Pillar | undefined;
      visible.forEach((entry, i) => {
        if (i === 0 || entry.pillar !== previousPillar) {
          pillarBreaks.add(i);
          const key = entry.pillar ?? "__general";
          if (seenPillars.has(key)) pillarsAreContiguous = false;
          seenPillars.add(key);
        }
        previousPillar = entry.pillar;
      });
      // Only worth labelling sub-clusters when there's more than one pillar
      // on screen, a single-pillar (or single "General") kind group reads
      // fine as one flat list.
      const showPillarLabels = pillarsAreContiguous && pillarBreaks.size > 1;

      return {
        type,
        visible,
        total: matches.length,
        isExpanded,
        pillarBreaks,
        showPillarLabels,
      };
    });
  }, [ranked, expandedTypes]);

  const hasQuery = query.trim().length > 0;
  const hasResults = groups.length > 0;
  const totalResults = groups.reduce((sum, group) => sum + group.total, 0);
  // Set when `rankResults` answered a shorter query than the reader typed,
  // a question stem was dropped because nothing in the index is named by the
  // sentence ("what is a bra" → "bra"). Shown, never silent: a search box
  // that quietly answers a different question is one a reader stops trusting,
  // and knowing which words did the work is what lets them narrow it.
  const interpretedAs = ranked.interpretedAs;

  // The recovery pass, and *only* on the way to the zero-result screen. One
  // mistyped letter ("entanglment") is a hard zero under the strict matcher,
  // which is the right contract for every query that works and the wrong one
  // for the single moment a reader most needs help. `suggestCorrection`
  // re-runs the corrected spelling through the same matcher before returning
  // it, so anything rendered below is guaranteed to lead somewhere, a
  // suggestion that lands on a second empty screen is worse than none.
  //
  // Guarded on `hasResults` rather than folded into the matcher: no distance
  // is computed, and the vocabulary is not even built, for a query that found
  // something. The `index`/`query` deps are the same ones `groups` uses, so
  // this recomputes exactly when the result set does.
  const suggestion = useMemo(() => {
    if (!hasQuery || hasResults || indexStatus !== "ready") return null;
    // `suggestionTokensFor`, not a bare `tokenizeQuery`: the recovery pass is
    // the only work on this path whose cost scales with the query rather than
    // the index, and a paste of a few thousand words froze the field for over
    // a second per keystroke. See `suggestionQuery.ts` for the measurement.
    const tokens = suggestionTokensFor(query);
    if (tokens === null) return null;
    return suggestCorrection(tokens, index);
  }, [hasQuery, hasResults, indexStatus, query, index]);

  // Focus the input on open, restore focus to the trigger on close, and lock
  // background scroll while the overlay is up.
  useEffect(() => {
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const trigger = triggerRef.current;
    return () => {
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
    // Intentionally run only on mount/unmount, triggerRef is a stable ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Escape-to-close and a focus trap that keeps Tab cycling within the dialog.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSelect() {
    onClose();
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      // With no results there is nothing in `getResultLinks()`, and ArrowDown
      // did nothing at all, the one screen where the keyboard user has just
      // been told there is a next move and then can't reach it by the key
      // they were already using to walk results. The suggestion is the first
      // (and only) thing below the field in that state, so it takes the slot.
      const first = getResultLinks()[0] ?? suggestionRef.current;
      first?.focus();
    } else if (event.key === "Enter") {
      const firstMatch = groups[0]?.visible[0];
      if (firstMatch) {
        event.preventDefault();
        router.push(firstMatch.href);
        onClose();
      }
    }
  }

  function handleResultKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const links = getResultLinks();
    const position = links.indexOf(event.currentTarget);
    if (position === -1) return;

    if (event.key === "ArrowDown") {
      links[position + 1]?.focus();
    } else if (position === 0) {
      inputRef.current?.focus();
    } else {
      links[position - 1]?.focus();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-center bg-black/50 p-0 sm:items-start sm:p-4 sm:pt-[10vh]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        id={SEARCH_DIALOG_ID}
        role="dialog"
        aria-modal="true"
        aria-label="Search StudyQuantum"
        className="flex h-full w-full flex-col border-border bg-surface sm:h-auto sm:max-h-[80vh] sm:max-w-xl sm:rounded-panel sm:border sm:shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            className="h-5 w-5 shrink-0 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search a word, lesson, problem or course…"
            aria-label="Search glossary terms, lessons, problems, simulators, and courses"
            autoComplete="off"
            spellCheck={false}
            // `.input-instrument` (globals.css §8) plus overrides: this field
            // is set into the overlay header's own frame, so the recipe's
            // border/fill are switched off (utilities outrank the components
            // layer) and its placeholder is raised to the muted voice. Focus
            // is the sitewide `:focus-visible` pillar outline, not a brand
            // ring of its own.
            className="input-instrument min-w-0 flex-1 border-0 bg-transparent text-base placeholder:text-muted-foreground"
          />
          {/* Two faces, because the two widths have two different exits.
              At `sm` and up the dialog is a floating panel over a tappable
              backdrop and the keyboard is the primary input, so the control
              names the key that closes it. Below `sm` the panel is the whole
              viewport, `p-0`, `h-full w-full` on the wrapper above, so no
              backdrop is reachable and this button is the *only* way out;
              "Esc" names a key a phone does not have, on a 34 × 24px target
              well under the 44px floor every other control on this site
              holds. So the small screen gets a real close glyph at the
              standard hit size instead. `aria-label` is unchanged and
              unconditional, so the accessible name is "Close search" either
              way and never the literal string "Esc". */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-(--radius-tight) font-tech text-xs font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground sm:h-auto sm:w-auto sm:px-2 sm:py-1"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              className="h-4 w-4 sm:hidden"
            >
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
            <span className="hidden sm:inline">Esc</span>
          </button>
        </div>

        {/* `role="status"` as well as `aria-live`, matching the count readouts
            on /glossary and /current-quantum. A bare `<p aria-live>` has the
            implicit `aria-atomic: false` every role-less element has, so a
            screen reader is free to announce only the text nodes that
            changed. Every message here shares its shape with the one before
            it ("3 results found." becoming "8 results found."), which is
            exactly the case where a non-atomic region reads out a bare digit
            with no unit. `role="status"` carries an implicit
            `aria-atomic: true`, so the whole sentence is re-read. */}
        <p role="status" aria-live="polite" className="sr-only">
          {!hasQuery
            ? ""
            : indexStatus === "loading"
              ? "Loading search index…"
              : indexStatus === "error"
                ? "The search index didn't load. Press the try loading it again button, or use the glossary and learning path links below it."
                : !hasResults
                  ? // The suggestion is announced, not just drawn. A "did you
                    // mean" a screen-reader user is never told about is a fix
                    // for sighted readers only, and this is the screen where
                    // the reader has the least to go on.
                    suggestion
                    ? `No results for ${query}. Did you mean ${suggestion}? Press the search instead button to try it.`
                    : `No results for ${query}.`
                  : interpretedAs
                    ? `${totalResults} result${totalResults === 1 ? "" : "s"} found for ${interpretedAs}.`
                    : `${totalResults} result${totalResults === 1 ? "" : "s"} found.`}
        </p>

        <div className="flex-1 overflow-y-auto p-2">
          {!hasQuery ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Start typing. This searches the glossary, every lesson and problem, the simulators
              and the courses. One word is usually enough.
            </p>
          ) : indexStatus === "loading" ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Loading search index…</p>
          ) : indexStatus === "error" ? (
            // "Please try again" used to be the whole of this screen, which
            // named an action the reader had no way to take: the only retry
            // path was closing the overlay and reopening it, and nothing said
            // so. Now the instruction and the control are the same thing.
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              <p>The search index didn&rsquo;t load.</p>
              <p className="mt-3">
                <button
                  type="button"
                  onClick={retryIndexLoad}
                  className="inline-flex min-h-11 items-center rounded-(--radius-tight) border border-pillar-edge bg-pillar-wash px-4 text-sm font-medium text-pillar-text transition-colors duration-(--dur-fast) ease-instrument hover:border-pillar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar"
                >
                  Try loading it again
                </button>
              </p>
              <p className="mt-3">
                Everything is still reachable without search: the{" "}
                <Link
                  href="/glossary"
                  onClick={handleSelect}
                  className="underline decoration-border underline-offset-4 hover:decoration-pillar"
                >
                  glossary
                </Link>{" "}
                and the{" "}
                <Link
                  href="/learn"
                  onClick={handleSelect}
                  className="underline decoration-border underline-offset-4 hover:decoration-pillar"
                >
                  learning path
                </Link>{" "}
                are both full indexes of the site.
              </p>
            </div>
          ) : !hasResults ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              <p>No results for &ldquo;{query}&rdquo;.</p>
              {/* Rendered as a control, not a sentence. "Did you mean
                  entanglement?" as prose leaves the reader to retype the word
                  they already got wrong once; as a button it is the recovery
                  itself. It replaces the query rather than navigating to one
                  entry, so what they get back is the whole corrected result
                  set and they stay inside search, which is where someone who
                  has just failed to find something wants to be.

                  `break-words` because the corrected query is data: a long
                  concept name inside a 320px-wide overlay has nowhere else to
                  go, and `min-h-11` keeps the tap target at the site's floor
                  when it is the only thing on screen worth tapping. */}
              {suggestion ? (
                <p className="mt-3">
                  <button
                    ref={suggestionRef}
                    type="button"
                    onClick={() => {
                      setQuery(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="inline-flex min-h-11 max-w-full items-center justify-center gap-1.5 break-words rounded-(--radius-tight) border border-pillar-edge bg-pillar-wash px-4 py-2 text-sm text-foreground transition-colors duration-(--dur-fast) ease-instrument hover:border-pillar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar"
                  >
                    Did you mean{" "}
                    <span className="font-medium text-pillar-text">{suggestion}</span>?
                  </button>
                </p>
              ) : null}
              {/* The way *back* first, and it is a fact about the matcher
                  rather than an apology: `rankResults` AND-matches every
                  token, so "bell state measurement" finds nothing the moment
                  one of those words is absent from an entry, while "bell"
                  still reaches all of them. A reader cannot guess that from a
                  zero-result screen, and the field still holds their
                  words, so telling them which edit to make is the cheapest
                  correct answer. The destinations below are the way onward,
                  for when there is nothing left to shorten. */}
              <p className="mt-3">
                Every word has to match, so fewer words find more. Or start somewhere else:
              </p>
              {/* Three different next moves, not three doors to the same
                  room: a definition, a structural view, and the front door of
                  the curriculum. */}
              <ul className="mt-3 flex flex-col gap-1.5 text-left sm:mx-auto sm:w-max">
                {NO_RESULT_ROUTES.map((route) => (
                  <li key={route.href}>
                    <Link
                      href={route.href}
                      onClick={handleSelect}
                      // `inline-flex min-h-11`, not `py-1`: at `text-sm` these
                      // were 29px tall, and they are the only targets on the
                      // screen a reader who has just failed at search is going
                      // to reach for. The list is `gap-1.5`, so growing the
                      // painted box (rather than overlaying a 44px `::after`)
                      // still leaves 6px between adjacent targets instead of
                      // making them overlap.
                      className="inline-flex min-h-11 items-center rounded-(--radius-tight) px-2 text-sm text-foreground underline decoration-border underline-offset-4 hover:decoration-pillar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar"
                    >
                      {route.label}
                      <span className="ml-2 text-xs text-muted-foreground no-underline">{route.hint}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              {/* Only ever rendered when the sentence the reader typed named
                  nothing in the index and dropping its question stem did
                  (see `rankResults`). It is a statement of what was searched,
                  not a control: the reader's own words are still in the field
                  above, so narrowing is one keystroke away and there is
                  nothing to undo. */}
              {interpretedAs ? (
                <p className="px-3 pb-2 text-xs text-muted-foreground">
                  Showing results for{" "}
                  <span className="font-medium text-foreground">{interpretedAs}</span>
                </p>
              ) : null}
              <ul className="space-y-4">
              {groups.map(({ type, visible, total, isExpanded, pillarBreaks, showPillarLabels }) => (
                <li key={type}>
                  <p className="px-3 pb-1 tech-label text-muted-foreground">
                    {TYPE_LABELS[type]}
                    <span className="ml-1.5 text-subtle-foreground">{total}</span>
                  </p>
                  <ul id={`search-results-${type}`}>
                    {visible.map((entry, i) => {
                      const visual = entry.pillar ? PILLAR_VISUALS[entry.pillar] : undefined;
                      return (
                        <li key={`${entry.type}-${entry.href}-${entry.title}`}>
                          {showPillarLabels && pillarBreaks.has(i) ? (
                            <p
                              data-pillar={entry.pillar}
                              className="px-3 pb-1 pt-2 font-tech text-micro font-medium uppercase tracking-meta text-pillar-text first:pt-0"
                            >
                              {visual?.short ?? "General"}
                            </p>
                          ) : null}
                          <Link
                            data-search-result
                            href={entry.href}
                            onClick={handleSelect}
                            onKeyDown={handleResultKeyDown}
                            className={cn(
                              "flex items-start justify-between gap-3 rounded-(--radius-tight) px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar",
                              "hover:bg-surface-muted focus-visible:bg-surface-muted"
                            )}
                          >
                            <span className="min-w-0">
                              <span className="block text-sm font-medium text-foreground">{entry.title}</span>
                              {/* The "which one is this?" line. Kind comes
                                  from the group header above, pillar from
                                  the chip/sub-header, and this supplies the
                                  missing third coordinate, the course,
                                  without which two lessons with the same
                                  title are indistinguishable before the
                                  click. */}
                              {entry.course ? (
                                <span
                                  data-pillar={entry.pillar}
                                  className="mt-0.5 block truncate font-tech text-micro font-medium uppercase tracking-meta text-pillar-text"
                                >
                                  {entry.course}
                                </span>
                              ) : null}
                              <span className="line-clamp-1 block text-xs text-muted-foreground">
                                {entry.description}
                              </span>
                            </span>
                            {visual && !showPillarLabels ? (
                              <span
                                data-pillar={entry.pillar}
                                className="mt-0.5 shrink-0 font-tech text-micro font-medium uppercase tracking-meta text-pillar-text"
                              >
                                {visual.short}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  {/* This was a `<p>` reading "+90 more results": a sentence
                      naming what the panel was refusing to show, on every
                      group with any depth to it, with nothing to press. There
                      is no `/search` route to send the reader to, and the
                      catalog pages cannot take over either, /lessons,
                      /glossary and /problems all filter from component state
                      and read no `q` param, so a link would land on an
                      unfiltered index with the query silently dropped. So the
                      rest of the group opens where it already is.

                      Expanding rather than paging because the reader is inside
                      a scrolling panel with their query still in the field:
                      the rows they want are the ones they can keep scrolling
                      to, and closing again is the same button. It carries its
                      own count so the control says what pressing it does, and
                      `aria-expanded`/`aria-controls` say the same thing to a
                      screen reader. `min-h-11` holds the site's 44px target
                      floor, and it joins the arrow-key walk through the
                      results (`data-search-more`), so a keyboard reader
                      reaches it by the key they are already using. */}
                  {total > RESULTS_PER_GROUP ? (
                    <p className="px-3 pt-1">
                      <button
                        type="button"
                        data-search-more
                        onClick={() => toggleGroup(type)}
                        onKeyDown={handleResultKeyDown}
                        aria-expanded={isExpanded}
                        aria-controls={`search-results-${type}`}
                        className="inline-flex min-h-11 items-center rounded-(--radius-tight) px-2 text-xs text-muted-foreground underline decoration-border underline-offset-4 transition-colors duration-(--dur-fast) ease-instrument hover:text-foreground hover:decoration-pillar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar"
                      >
                        {isExpanded
                          ? `Show fewer ${TYPE_NOUNS[type]}`
                          : `Show all ${total} ${TYPE_NOUNS[type]}`}
                      </button>
                    </p>
                  ) : null}
                </li>
              ))}
              </ul>
            </>
          )}
        </div>

        <div className="hidden items-center gap-4 border-t border-border px-4 py-2 tech-label text-subtle-foreground sm:flex">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded-[calc(var(--radius-tight)-2px)] border border-border px-1.5 py-0.5">↑↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded-[calc(var(--radius-tight)-2px)] border border-border px-1.5 py-0.5">↵</kbd>
            Open
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="rounded-[calc(var(--radius-tight)-2px)] border border-border px-1.5 py-0.5">Esc</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  );
}
