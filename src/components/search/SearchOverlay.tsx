"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { Pillar } from "@/lib/content/types";
import { PILLAR_ORDER, PILLAR_VISUALS } from "@/lib/design/pillars";
import { fetchSearchIndex } from "@/lib/search/fetchIndex";
import {
  matchScore,
  matchesAllTokens,
  prepareSearchEntries,
  tokenizeQuery,
  type SearchableEntry,
} from "@/lib/search/match";
import type { SearchEntry, SearchEntryType } from "@/lib/search/types";
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

// Glossary first, deliberately. The most common query from someone new to
// the subject is a word they just hit and didn't recognise, and for that
// query a one-paragraph definition is a better landing than a 20-minute
// lesson — especially since a glossary entry links straight on to the
// lessons that cover it, so it costs a reader who wanted the lesson exactly
// one extra click while saving the reader who wanted the definition a
// dead-end detour. Everything else keeps its previous relative order.
// `track` last: six entries that a reader almost always reaches through the
// nav instead. They earn their place in the index because typing a subject
// name ("hardware", "mechanics") previously returned lessons *about* it and
// never the section itself — but they should not outrank a lesson.
const TYPE_ORDER: SearchEntryType[] = ["term", "lesson", "problem", "simulator", "course", "track"];
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
// prefix, title substring, description-only — sorted *before* pillar order so
// a literal title hit is never buried under a pillar that merely happens to
// come earlier in the curriculum and mentions the word in passing.

// `null` stands for "no pillar" (most simulators, and any entry the index
// doesn't tag) — its rank sorts after every real pillar so a kind group
// reads curriculum-order-first, general-last.
function pillarRank(pillar: Pillar | undefined): number {
  if (!pillar) return PILLAR_ORDER.length;
  const index = PILLAR_ORDER.indexOf(pillar);
  return index === -1 ? PILLAR_ORDER.length : index;
}

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

  // Two-level structure: grouped by kind (the primary split — a visitor
  // searching mid-lesson almost always wants "Lessons" first), and within
  // each kind, pillar-major ordered so the curriculum's own structure shows
  // through rather than an arbitrary index order. `visible` is capped at
  // RESULTS_PER_GROUP per kind (unchanged from before) so six pillars' worth
  // of matches can't blow the panel out; `pillarBreaks` records which
  // visible rows start a new pillar cluster, for the sub-headers below.
  const groups = useMemo(() => {
    const tokens = tokenizeQuery(query);
    if (tokens.length === 0) return [];
    const phrase = tokens.join(" ");
    const built = TYPE_ORDER.map((type) => {
      // Each entry's score is computed exactly once per query, here — not
      // inside the sort comparator, where it used to be recomputed
      // O(n log n) times per keystroke.
      const matches: { entry: SearchEntry; score: number }[] = [];
      for (const candidate of index) {
        if (candidate.entry.type !== type || !matchesAllTokens(candidate, tokens)) continue;
        matches.push({ entry: candidate.entry, score: matchScore(candidate, tokens, phrase) });
      }
      if (matches.length === 0) return null;

      const ordered = matches.sort(
        (a, b) =>
          a.score - b.score ||
          pillarRank(a.entry.pillar) - pillarRank(b.entry.pillar) ||
          a.entry.title.localeCompare(b.entry.title)
      );
      const visible = ordered.slice(0, RESULTS_PER_GROUP).map((match) => match.entry);
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

      return {
        type,
        visible,
        remaining,
        total: matches.length,
        pillarBreaks,
        showPillarLabels,
        bestScore: ordered[0].score,
      };
    }).filter((group): group is NonNullable<typeof group> => group !== null);

    // Glossary leads only when it actually *matched a term*. Definitions are
    // full paragraphs, so a common word ("state", "system") matches dozens of
    // them on description text alone — and letting that push the lessons
    // below the fold would be the opposite of helpful. When the glossary's
    // best hit is description-only, it sinks to just under Lessons instead.
    const termPosition = built.findIndex((group) => group.type === "term");
    if (termPosition !== -1 && built[termPosition].bestScore >= 3) {
      const [termGroup] = built.splice(termPosition, 1);
      const lessonPosition = built.findIndex((group) => group.type === "lesson");
      built.splice(lessonPosition === -1 ? 0 : lessonPosition + 1, 0, termGroup);
    }
    return built;
  }, [index, query]);

  const hasQuery = query.trim().length > 0;
  const hasResults = groups.length > 0;
  const totalResults = groups.reduce((sum, group) => sum + group.total, 0);

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
      getResultLinks()[0]?.focus();
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
        className="flex h-full w-full flex-col border-border bg-surface sm:h-auto sm:max-h-[80vh] sm:max-w-xl sm:rounded-[var(--radius-panel)] sm:border sm:shadow-2xl"
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
            className="min-w-0 flex-1 rounded-[var(--radius-tight)] bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 rounded-[var(--radius-tight)] px-2 py-1 font-tech text-xs font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          >
            Esc
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
                  ? `No results for ${query}.`
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
                      className="rounded-[var(--radius-tight)] px-2 py-1 text-sm text-foreground underline decoration-border underline-offset-4 hover:decoration-pillar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      {route.label}
                      <span className="ml-2 text-xs text-muted-foreground no-underline">{route.hint}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
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
                              "flex items-start justify-between gap-3 rounded-[var(--radius-tight)] px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
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
