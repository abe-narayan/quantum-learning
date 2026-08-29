"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { Pillar } from "@/lib/content/types";
import { PILLAR_VISUALS } from "@/lib/design/pillars";
import { fetchSearchIndex } from "@/lib/search/fetchIndex";
import { prepareSearchEntries, tokenizeQuery, type SearchableEntry } from "@/lib/search/match";
import { suggestCorrection } from "@/lib/search/didYouMean";
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

// Matching, scoring, group ordering and the question-stem rewrite all live in
// `@/lib/search/rank` (which composes `match`, `groupRanking` and
// `questionQuery`), pure and unit-tested against the real
// `public/search-index.json`. What is left here is presentation: how many rows
// a group shows, where the pillar sub-headers fall, and what the empty screen
// offers instead.
const RESULTS_PER_GROUP = 6;

/** Where an empty-handed search sends someone. Real routes only. */
const NO_RESULT_ROUTES = [
  { href: "/glossary", label: "Glossary", hint: "look a word up" },
  { href: "/map", label: "Concept map", hint: "see how ideas connect" },
  { href: "/learn", label: "Learning path", hint: "start from the beginning" },
];

// Matching and scoring live in `@/lib/search/match` (pure, unit-tested):
// queries and entries are diacritic-folded so "schrodinger" finds
// "Schrödinger", tokens AND-match in any order so "state bell" finds "Bell
// state", and `matchScore` keeps the old hierarchy — exact title, title
// prefix, title substring, description-only, and now lesson-body-terms-only —
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
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  // The "did you mean" control, so ArrowDown out of the field can reach it on
  // the one screen where there are no result links to walk into.
  const suggestionRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // The index isn't baked into the page — it's fetched lazily, only once the
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
  }, []);

  // Result links are looked up from the DOM on demand (rather than kept in a
  // ref array built during render) so arrow-key navigation always walks
  // exactly the links currently on screen, without mutating a ref in the
  // render body.
  function getResultLinks(): HTMLAnchorElement[] {
    const dialog = dialogRef.current;
    if (!dialog) return [];
    return Array.from(dialog.querySelectorAll<HTMLAnchorElement>("[data-search-result]"));
  }

  // Everything about *which* results and in what order — matching, the
  // relevance bands, group order, and the question-stem rewrite — is
  // `rankResults`, which is pure and tested against the real committed index.
  const ranked = useMemo(() => rankResults(index, query), [index, query]);

  // What is left here is the two-level presentation: grouped by kind (the
  // primary split — a visitor searching mid-lesson almost always wants
  // "Lessons" first), and within each kind, pillar-major ordered so the
  // curriculum's own structure shows through rather than an arbitrary index
  // order. `visible` is capped at RESULTS_PER_GROUP per kind so six pillars'
  // worth of matches can't blow the panel out; `pillarBreaks` records which
  // visible rows start a new pillar cluster, for the sub-headers below.
  const groups = useMemo(() => {
    return ranked.groups.map(({ type, matches }) => {
      const visible = matches.slice(0, RESULTS_PER_GROUP).map((match) => match.entry);
      const remaining = matches.length - visible.length;
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
      // on screen — a single-pillar (or single "General") kind group reads
      // fine as one flat list.
      const showPillarLabels = pillarsAreContiguous && pillarBreaks.size > 1;

      return { type, visible, remaining, total: matches.length, pillarBreaks, showPillarLabels };
    });
  }, [ranked]);

  const hasQuery = query.trim().length > 0;
  const hasResults = groups.length > 0;
  const totalResults = groups.reduce((sum, group) => sum + group.total, 0);
  // Set when `rankResults` answered a shorter query than the reader typed —
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
  // it, so anything rendered below is guaranteed to lead somewhere — a
  // suggestion that lands on a second empty screen is worse than none.
  //
  // Guarded on `hasResults` rather than folded into the matcher: no distance
  // is computed, and the vocabulary is not even built, for a query that found
  // something. The `index`/`query` deps are the same ones `groups` uses, so
  // this recomputes exactly when the result set does.
  const suggestion = useMemo(() => {
    if (!hasQuery || hasResults || indexStatus !== "ready") return null;
    return suggestCorrection(tokenizeQuery(query), index);
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
    // Intentionally run only on mount/unmount — triggerRef is a stable ref.
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
      // did nothing at all — the one screen where the keyboard user has just
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

  function handleResultKeyDown(event: React.KeyboardEvent<HTMLAnchorElement>) {
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
        aria-label="Search QuantumLearn"
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
              viewport — `p-0`, `h-full w-full` on the wrapper above — so no
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

        <p aria-live="polite" className="sr-only">
          {!hasQuery
            ? ""
            : indexStatus === "loading"
              ? "Loading search index…"
              : indexStatus === "error"
                ? "Search is temporarily unavailable."
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
              Start typing. Searches the glossary, every lesson and problem, the simulators, and the
              courses — a single word works.
            </p>
          ) : indexStatus === "loading" ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Loading search index…</p>
          ) : indexStatus === "error" ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Search is temporarily unavailable. Please try again.
            </p>
          ) : !hasResults ? (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              <p>No results for &ldquo;{query}&rdquo;.</p>
              {/* Rendered as a control, not a sentence. "Did you mean
                  entanglement?" as prose leaves the reader to retype the word
                  they already got wrong once; as a button it is the recovery
                  itself. It replaces the query rather than navigating to one
                  entry, so what they get back is the whole corrected result
                  set and they stay inside search — which is where someone who
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
              <p className="mt-2">Nothing here matched, but these are all one click away:</p>
              {/* A zero-result screen is the moment a newcomer is most
                  likely to give up, so it ends in real destinations rather
                  than an apology. Each is a genuinely different next move:
                  a definition, a structural view, and the front door of the
                  curriculum. */}
              <ul className="mt-3 flex flex-col gap-1.5 text-left sm:mx-auto sm:w-max">
                {NO_RESULT_ROUTES.map((route) => (
                  <li key={route.href}>
                    <Link
                      href={route.href}
                      onClick={handleSelect}
                      className="rounded-(--radius-tight) px-2 py-1 text-sm text-foreground underline decoration-border underline-offset-4 hover:decoration-pillar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar"
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
              {groups.map(({ type, visible, remaining, total, pillarBreaks, showPillarLabels }) => (
                <li key={type}>
                  <p className="px-3 pb-1 font-tech text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    {TYPE_LABELS[type]}
                    <span className="ml-1.5 text-subtle-foreground">{total}</span>
                  </p>
                  <ul>
                    {visible.map((entry, i) => {
                      const visual = entry.pillar ? PILLAR_VISUALS[entry.pillar] : undefined;
                      return (
                        <li key={`${entry.type}-${entry.href}-${entry.title}`}>
                          {showPillarLabels && pillarBreaks.has(i) ? (
                            <p
                              data-pillar={entry.pillar}
                              className="px-3 pb-1 pt-2 font-tech text-[0.625rem] font-medium uppercase tracking-[0.1em] text-pillar-text first:pt-0"
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
                                  missing third coordinate — the course —
                                  without which two lessons with the same
                                  title are indistinguishable before the
                                  click. */}
                              {entry.course ? (
                                <span
                                  data-pillar={entry.pillar}
                                  className="mt-0.5 block truncate font-tech text-[0.625rem] font-medium uppercase tracking-[0.08em] text-pillar-text"
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
                                className="mt-0.5 shrink-0 font-tech text-[0.625rem] font-medium uppercase tracking-[0.08em] text-pillar-text"
                              >
                                {visual.short}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  {remaining > 0 ? (
                    <p className="px-3 pt-1 text-xs text-muted-foreground">
                      +{remaining} more result{remaining === 1 ? "" : "s"}
                    </p>
                  ) : null}
                </li>
              ))}
              </ul>
            </>
          )}
        </div>

        <div className="hidden items-center gap-4 border-t border-border px-4 py-2 font-tech text-[0.6875rem] uppercase tracking-[0.08em] text-subtle-foreground sm:flex">
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
