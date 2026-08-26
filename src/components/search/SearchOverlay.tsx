"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { Pillar } from "@/lib/content/types";
import { PILLAR_ORDER, PILLAR_VISUALS } from "@/lib/design/pillars";
import { fetchSearchIndex } from "@/lib/search/fetchIndex";
import type { SearchEntry, SearchEntryType } from "@/lib/search/types";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<SearchEntryType, string> = {
  lesson: "Lessons",
  problem: "Problems",
  simulator: "Simulators",
  course: "Courses",
};

const TYPE_ORDER: SearchEntryType[] = ["lesson", "problem", "simulator", "course"];
const RESULTS_PER_GROUP = 6;

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
  const [index, setIndex] = useState<SearchEntry[]>([]);
  const [indexStatus, setIndexStatus] = useState<IndexStatus>("loading");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // The index isn't baked into the page — it's fetched lazily, only once the
  // overlay actually mounts (i.e. once the user opens search), and cached at
  // module scope by `fetchSearchIndex()` so re-opening never re-fetches.
  useEffect(() => {
    let cancelled = false;
    fetchSearchIndex()
      .then((data) => {
        if (cancelled) return;
        setIndex(data);
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
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return TYPE_ORDER.map((type) => {
      const matches = index.filter(
        (entry) =>
          entry.type === type &&
          (entry.title.toLowerCase().includes(trimmed) || entry.description.toLowerCase().includes(trimmed))
      );
      if (matches.length === 0) return null;

      const ordered = [...matches].sort((a, b) => pillarRank(a.pillar) - pillarRank(b.pillar));
      const visible = ordered.slice(0, RESULTS_PER_GROUP);
      const remaining = matches.length - visible.length;
      const pillarBreaks = new Set<number>();
      let previousPillar: Pillar | undefined;
      visible.forEach((entry, i) => {
        if (i === 0 || entry.pillar !== previousPillar) pillarBreaks.add(i);
        previousPillar = entry.pillar;
      });
      // Only worth labelling sub-clusters when there's more than one pillar
      // on screen — a single-pillar (or single "General") kind group reads
      // fine as one flat list.
      const showPillarLabels = pillarBreaks.size > 1;

      return { type, visible, remaining, total: matches.length, pillarBreaks, showPillarLabels };
    }).filter((group): group is NonNullable<typeof group> => group !== null);
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
            placeholder="Search lessons, problems, simulators, courses…"
            aria-label="Search lessons, problems, simulators, and courses"
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
              Start typing to search across lessons, problems, simulators, and courses.
            </p>
          ) : indexStatus === "loading" ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Loading search index…</p>
          ) : indexStatus === "error" ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Search is temporarily unavailable. Please try again.
            </p>
          ) : !hasResults ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;.
            </p>
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
