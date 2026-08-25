"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type TocEntry = { id: string; text: string };

/**
 * Below this many `##` sections, a jump-list adds more chrome than it saves
 * a reader — a 2-3 section lesson is short enough to skim in one scroll.
 */
const MIN_HEADINGS = 4;

const EMPTY_ENTRIES: TocEntry[] = [];

function readHeadings(containerId: string): TocEntry[] {
  const container = document.getElementById(containerId);
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLHeadingElement>("h2"))
    .filter((el) => el.id)
    .map((el) => ({ id: el.id, text: el.textContent?.trim() ?? "" }));
}

const noopSubscribe = () => () => {};

/**
 * Heading text/ids only exist as DOM nodes: `children` reaches
 * `LessonLayout` as already-compiled MDX (a React tree, not an AST this
 * codebase's `@next/mdx` pipeline exposes a walkable representation of), so
 * the only robust way to enumerate a lesson's `##` sections is to read the
 * rendered `id` attributes rehype-slug already stamped onto them — i.e. to
 * read a value out of an external system (the DOM), which is exactly what
 * `useSyncExternalStore` is for. `getServerSnapshot` matches what SSR
 * rendered (no entries yet), and the headings never change again once the
 * static MDX content has mounted, so `subscribe` is a no-op and the
 * per-instance ref cache below just guards against re-querying the DOM
 * (and returning a fresh array reference) on every render, which would
 * otherwise make `useSyncExternalStore` think the store keeps changing.
 */
function useHeadings(containerId: string): TocEntry[] {
  const cacheRef = useRef<TocEntry[] | null>(null);
  const getSnapshot = useCallback(() => {
    if (cacheRef.current === null) {
      cacheRef.current = readHeadings(containerId);
    }
    return cacheRef.current;
  }, [containerId]);
  const getServerSnapshot = useCallback(() => EMPTY_ENTRIES, []);
  return useSyncExternalStore(noopSubscribe, getSnapshot, getServerSnapshot);
}

function useTocEntries(containerId: string) {
  const entries = useHeadings(containerId);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (entries.length === 0) return undefined;
    const headingEls = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (headingEls.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (observerEntries) => {
        const visible = observerEntries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Treat a heading as "current" once it's past the sticky navbar
        // (~64px) and the reading-progress bar, and stop counting a
        // heading once it's more than 70% of the way up the viewport —
        // this keeps the highlighted entry roughly matched to whatever
        // section occupies the top of the reading area, without needing
        // scroll-position math of our own.
        rootMargin: "-96px 0px -70% 0px",
        threshold: 0,
      }
    );
    headingEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [entries]);

  return { entries, activeId, hasEnoughHeadings: entries.length >= MIN_HEADINGS };
}

/**
 * Desktop rail, meant to sit in the second column of a `lg:grid` beside the
 * lesson prose. When there aren't enough headings to bother with, this
 * renders a genuinely empty `<nav>` (no text, no children) rather than
 * `null` — LessonLayout pairs that with a `has-[nav:empty]:grid-cols-1`
 * utility on the grid wrapper so the rail's column collapses away instead
 * of leaving a dead gap on short lessons.
 */
export function TableOfContentsDesktop({ containerId }: { containerId: string }) {
  const { entries, activeId, hasEnoughHeadings } = useTocEntries(containerId);

  if (!hasEnoughHeadings) {
    return <nav aria-hidden="true" className="hidden lg:block" />;
  }

  return (
    <nav
      aria-label="On this page"
      className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">On this page</p>
      <ul className="mt-3 space-y-1 border-l border-border text-sm">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              aria-current={activeId === entry.id ? "location" : undefined}
              className={cn(
                "-ml-px block border-l-2 py-1 pl-3 transition-colors",
                activeId === entry.id
                  ? "border-brand font-medium text-brand"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Mobile/tablet collapsible toggle, meant to sit just below the lesson header. */
export function TableOfContentsMobile({ containerId }: { containerId: string }) {
  const { entries, activeId, hasEnoughHeadings } = useTocEntries(containerId);
  const [isOpen, setIsOpen] = useState(false);

  if (!hasEnoughHeadings) return null;

  return (
    <div className="mt-8 max-w-3xl lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-surface-muted/60 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
      >
        <span>Contents</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          className={cn("h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180")}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 7.5 5 5 5-5" />
        </svg>
      </button>
      {isOpen ? (
        <ul className="mt-2 space-y-1 rounded-xl border border-border p-3 text-sm">
          {entries.map((entry) => (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                onClick={() => setIsOpen(false)}
                aria-current={activeId === entry.id ? "location" : undefined}
                className={cn(
                  "block rounded-lg px-3 py-1.5 transition-colors",
                  activeId === entry.id
                    ? "font-medium text-brand"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {entry.text}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
