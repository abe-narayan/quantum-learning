"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { TechLabel } from "@/components/ui/Typography";

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

/**
 * ============================================================
 * Shared active-heading observer
 * ============================================================
 * `LessonLayout` renders both `TableOfContentsDesktop` and
 * `TableOfContentsMobile` on every lesson page — CSS-hidden at different
 * breakpoints, but both genuinely mounted at once — and both need the same
 * "which section is the reader in right now" answer for the same
 * `containerId`. Each independently owning an `IntersectionObserver`
 * watching the exact same headings was two observers doing one job.
 *
 * One `IntersectionObserver` per `containerId` instead, module-level and
 * reference-counted by subscriber (same shape as `Reveal.tsx`'s shared
 * observer): the first of the two consumers to mount creates it, the
 * second just adds a listener to the existing one, and it's disconnected
 * only once both have unmounted. Since desktop and mobile always share one
 * `containerId` on a given lesson page, they always resolve to the same
 * heading elements — sharing by `containerId` alone is exactly sharing by
 * heading set here.
 */
type ActiveHeadingListener = (activeId: string | null) => void;

type ActiveHeadingObservation = {
  observer: IntersectionObserver;
  listeners: Set<ActiveHeadingListener>;
  activeId: string | null;
};

const activeHeadingObservations = new Map<string, ActiveHeadingObservation>();

// Treat a heading as "current" once it's past the sticky navbar (~64px) and
// the reading-progress bar, and stop counting a heading once it's more than
// 70% of the way up the viewport — this keeps the highlighted entry
// roughly matched to whatever section occupies the top of the reading
// area, without needing scroll-position math of our own.
const ACTIVE_HEADING_OBSERVER_OPTIONS: IntersectionObserverInit = {
  rootMargin: "-96px 0px -70% 0px",
  threshold: 0,
};

function subscribeActiveHeading(
  containerId: string,
  headingEls: HTMLElement[],
  listener: ActiveHeadingListener
): () => void {
  let observation = activeHeadingObservations.get(containerId);

  if (!observation) {
    const listeners = new Set<ActiveHeadingListener>();
    const created: ActiveHeadingObservation = {
      // Placeholder — replaced synchronously below once `observer` exists,
      // since the observer's own callback needs to reach back into
      // `created.activeId`/`created.listeners`.
      observer: null as unknown as IntersectionObserver,
      listeners,
      activeId: null,
    };
    created.observer = new IntersectionObserver((observerEntries) => {
      const visible = observerEntries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) {
        created.activeId = visible[0].target.id;
        created.listeners.forEach((notify) => notify(created.activeId));
      }
    }, ACTIVE_HEADING_OBSERVER_OPTIONS);

    headingEls.forEach((el) => created.observer.observe(el));

    activeHeadingObservations.set(containerId, created);
    observation = created;
  }

  observation.listeners.add(listener);
  // Sync the new subscriber to whatever the observer already knows,
  // rather than leaving it at `null` until the next intersection change.
  listener(observation.activeId);

  return () => {
    observation!.listeners.delete(listener);
    if (observation!.listeners.size === 0) {
      observation!.observer.disconnect();
      activeHeadingObservations.delete(containerId);
    }
  };
}

function useTocEntries(containerId: string) {
  const entries = useHeadings(containerId);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    // `< MIN_HEADINGS`, not `=== 0`: below that threshold both consumers
    // render nothing (the desktop rail collapses to an empty `<nav>`, the
    // mobile toggle returns `null`), so an observer created here had no
    // reader for its answer. It still attached an IntersectionObserver to
    // every `h2` on the page and ran the browser's intersection bookkeeping
    // through the whole scroll of the lesson, on every short lesson in the
    // corpus, to update state nothing renders.
    if (entries.length < MIN_HEADINGS) return undefined;
    const headingEls = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (headingEls.length === 0) return undefined;

    return subscribeActiveHeading(containerId, headingEls, setActiveId);
  }, [containerId, entries]);

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

  const activeIndex = entries.findIndex((entry) => entry.id === activeId);
  const positionLabel = `${String(Math.max(activeIndex, 0) + 1).padStart(2, "0")} / ${String(entries.length).padStart(2, "0")}`;

  return (
    <nav
      aria-label="On this page"
      className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto"
    >
      {/* An instrument readout, not a plain label: the section the reader is
          currently in relative to the total is visible at a glance, and the
          left rail is pillar-tinted so this rail visibly belongs to the
          same identity as everything else PillarScope retints. */}
      <div className="flex items-baseline justify-between gap-3 border-b border-border pb-2">
        <TechLabel>On this page</TechLabel>
        <span className="tech-value text-[0.65rem] text-subtle-foreground">{positionLabel}</span>
      </div>
      <ul className="mt-3 space-y-1 border-l border-border text-sm">
        {entries.map((entry, index) => {
          const isActive = activeId === entry.id;
          const isPast = activeIndex >= 0 && index < activeIndex;
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "-ml-px flex items-baseline gap-2 border-l-2 py-1.5 pl-3 transition-colors",
                  isActive
                    ? "border-pillar font-medium text-pillar-text"
                    : isPast
                      ? "border-pillar-dim/60 text-muted-foreground hover:text-foreground"
                      : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                <span
                  aria-hidden="true"
                  data-decorative=""
                  className="tech-value shrink-0 text-[0.65rem] text-subtle-foreground"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{entry.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/**
 * Mobile/tablet collapsible toggle, meant to sit just below the lesson
 * header. Two changes from a plain disclosure make this "genuinely usable
 * on a phone" rather than a shrunk desktop control:
 *
 * 1. The closed trigger names the *current* section (falling back to a
 *    section count when nothing is active yet), so a reader glancing at it
 *    mid-lesson gets their position for free without opening anything —
 *    the same progress-awareness the desktop rail gets from its rung
 *    indicator.
 * 2. It closes on outside tap, Escape, and blur — the same disclosure
 *    contract `Navbar`'s `TracksDropdown` implements — instead of only via
 *    a second tap on the trigger, which is easy to miss on a touchscreen
 *    once the list has scrolled the trigger off-screen.
 */
export function TableOfContentsMobile({ containerId }: { containerId: string }) {
  const { entries, activeId, hasEnoughHeadings } = useTocEntries(containerId);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (containerRef.current?.contains(document.activeElement)) {
          buttonRef.current?.focus();
        }
        setIsOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!hasEnoughHeadings) return null;

  const activeIndex = entries.findIndex((entry) => entry.id === activeId);
  const currentLabel =
    activeIndex >= 0 ? entries[activeIndex].text : `${entries.length} sections`;

  return (
    <div
      ref={containerRef}
      // `max-w-[46rem]`, the lesson page's reading measure, not `max-w-3xl`
      // (48rem): this sits directly between the pre-content stack and the
      // prose column, both of which are 46rem, so the extra 32px put the
      // contents toggle's right edge outside both of its neighbours at every
      // viewport between `sm` and `lg`. See LessonMetaStrip.tsx.
      className="mt-8 max-w-[46rem] lg:hidden"
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node | null)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        // Named only while the panel exists. This disclosure unmounts its
        // panel when collapsed, and an `aria-controls` IDREF that resolves
        // to nothing is invalid — assistive tech either announces the
        // relationship as broken or drops it. `aria-expanded` carries the
        // state on its own while there is nothing to point at. Matches
        // `TracksDropdown`/`SearchTrigger` in the chrome.
        aria-controls={isOpen ? "lesson-toc-mobile-panel" : undefined}
        // A stable hook for the print stylesheet, which hides this control
        // (globals.css §print). It used to select on
        // `[aria-controls="lesson-toc-mobile-panel"]`, which stopped matching
        // the moment that attribute became conditional above — and the
        // collapsed state is the common one, so the toggle would have started
        // printing on every lesson. An attribute that exists for styling
        // should not be one whose presence depends on runtime state.
        data-toc-toggle=""
        className="flex w-full min-h-11 items-center justify-between gap-3 rounded-panel border border-border bg-surface-muted/60 px-4 py-3 text-left text-sm transition-colors hover:bg-surface-muted"
      >
        <span className="flex min-w-0 flex-col">
          <span className="tech-label text-subtle-foreground">
            {activeIndex >= 0 ? `Section ${activeIndex + 1} of ${entries.length}` : "Contents"}
          </span>
          <span className="mt-0.5 truncate font-medium text-foreground">{currentLabel}</span>
        </span>
        <svg
          aria-hidden="true"
          data-decorative=""
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          className={cn("h-4 w-4 shrink-0 text-pillar-text transition-transform", isOpen && "rotate-180")}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 7.5 5 5 5-5" />
        </svg>
      </button>
      {isOpen ? (
        <ul
          id="lesson-toc-mobile-panel"
          className="mt-2 space-y-0.5 rounded-panel border border-border bg-surface p-2 text-sm"
        >
          {entries.map((entry, index) => (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                onClick={() => setIsOpen(false)}
                aria-current={activeId === entry.id ? "location" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-(--radius-tight) px-3 py-2 transition-colors",
                  activeId === entry.id
                    ? "bg-pillar-wash font-medium text-pillar-text"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span aria-hidden="true" data-decorative="" className="tech-value text-[0.65rem] text-subtle-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{entry.text}</span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
