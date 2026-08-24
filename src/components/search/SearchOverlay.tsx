"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
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

  const groups = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return TYPE_ORDER.map((type) => {
      const matches = index.filter(
        (entry) =>
          entry.type === type &&
          (entry.title.toLowerCase().includes(trimmed) || entry.description.toLowerCase().includes(trimmed))
      );
      return { type, matches };
    }).filter((group) => group.matches.length > 0);
  }, [index, query]);

  const hasQuery = query.trim().length > 0;
  const hasResults = groups.some((group) => group.matches.length > 0);
  const totalResults = groups.reduce((sum, group) => sum + group.matches.length, 0);

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
      const firstMatch = groups[0]?.matches[0];
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
        className="flex h-full w-full flex-col bg-surface sm:h-auto sm:max-h-[80vh] sm:max-w-xl sm:rounded-2xl sm:border sm:border-border sm:shadow-2xl"
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
            className="min-w-0 flex-1 rounded-md bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground"
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
              {groups.map(({ type, matches }) => {
                const visible = matches.slice(0, RESULTS_PER_GROUP);
                const remaining = matches.length - visible.length;
                return (
                  <li key={type}>
                    <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {TYPE_LABELS[type]}
                    </p>
                    <ul>
                      {visible.map((entry) => {
                        return (
                          <li key={`${entry.type}-${entry.href}-${entry.title}`}>
                            <Link
                              data-search-result
                              href={entry.href}
                              onClick={handleSelect}
                              onKeyDown={handleResultKeyDown}
                              className={cn(
                                "block rounded-xl px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                                "hover:bg-surface-muted focus-visible:bg-surface-muted"
                              )}
                            >
                              <span className="block text-sm font-medium text-foreground">{entry.title}</span>
                              <span className="line-clamp-1 block text-xs text-muted-foreground">
                                {entry.description}
                              </span>
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
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
