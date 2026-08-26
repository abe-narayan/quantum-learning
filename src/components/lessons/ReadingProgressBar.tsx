"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { useScrollSubscription } from "@/components/motion/useScrollProgress";
import { cn } from "@/lib/utils";

type ContainerMeasure = { top: number; height: number };

/** Pure so it can be called from both the geometry effect (on mount/resize)
 *  and the scroll-subscription callback (every scroll frame) without being
 *  a render-scoped closure either has to list as an effect dependency. */
function percentAt({ top, height }: ContainerMeasure, scrollY: number): number {
  const scrollableHeight = height - window.innerHeight;
  if (scrollableHeight <= 0) {
    // Container is shorter than the viewport: it's either fully in view
    // already (nothing to read progress through) or has been scrolled past
    // entirely.
    return scrollY >= top ? 1 : 0;
  }
  const scrolledPast = scrollY - top;
  return Math.min(1, Math.max(0, scrolledPast / scrollableHeight));
}

/**
 * Thin fixed bar pinned to the true viewport top, filled by scroll progress
 * through the lesson prose container specifically (not the whole document,
 * so the bar reaches 100% when the reader finishes the lesson body rather
 * than only after also scrolling past prev/next cards and the footer).
 *
 * Sits above the sticky Navbar (`z-50`, `sticky top-0`, see
 * src/components/layout/Navbar.tsx) at a higher `z-60`, flush with the true
 * top of the viewport — the navbar's own top edge sits directly underneath
 * it rather than the bar being pushed below the navbar's height, since a
 * reading-progress bar reads most naturally as a property of the whole
 * page, not of the nav bar.
 *
 * Tracking used to run its own `scroll`/`resize` listener pair and call
 * `getBoundingClientRect()` on every animation frame while scrolling — a
 * forced layout read on top of the site's shared rAF-coalesced scroll
 * subscription (`useScrollSubscription`), duplicated on all 219 lesson
 * pages. Fixed by splitting the two genuinely different concerns apart:
 * the container's *geometry* (its document-relative top and height) only
 * changes on resize or when its own content resizes (an image loading, a
 * KaTeX block laying out), so it's measured once and cached, then
 * recomputed only from a `ResizeObserver` on the container plus a window
 * `resize` listener — never inside the scroll path. The *position* within
 * that geometry changes every scroll frame, but is now derived arithmetic
 * from the cached geometry and the shared subscription's already-coalesced
 * `scrollY` — no DOM read at all on the scroll path.
 */
export function ReadingProgressBar({ containerId }: { containerId: string }) {
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Document-relative, cached geometry of the tracked container. `top` is
  // the container's top edge in absolute document coordinates, so
  // `top - scrollY` reproduces what `getBoundingClientRect().top` would
  // read at the current scroll position, without ever calling it. Written
  // by the geometry effect below (mount + resize/content-size mutation
  // only); read by the scroll-subscription callback (every scroll frame,
  // but as a plain arithmetic lookup, not a layout read).
  const measureRef = useRef<ContainerMeasure>({ top: 0, height: 0 });
  const hasContainerRef = useRef(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = document.getElementById(containerId);
    hasContainerRef.current = Boolean(container);
    if (!container) return undefined;

    function remeasure() {
      const rect = container!.getBoundingClientRect();
      measureRef.current = { top: rect.top + window.scrollY, height: rect.height };
      setProgress((previous) => {
        const next = percentAt(measureRef.current, window.scrollY);
        return previous === next ? previous : next;
      });
    }

    function scheduleRemeasure() {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        remeasure();
      });
    }

    // Synchronous initial measure (not scheduled) so a page mounted
    // mid-scroll — a back-navigation restoring scroll position, a lesson
    // opened at an in-page anchor — reflects the true position on first
    // paint instead of a stale 0% until the next scroll/resize event.
    remeasure();

    const resizeObserver = new ResizeObserver(scheduleRemeasure);
    resizeObserver.observe(container);
    window.addEventListener("resize", scheduleRemeasure);

    return () => {
      hasContainerRef.current = false;
      resizeObserver.disconnect();
      window.removeEventListener("resize", scheduleRemeasure);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [containerId]);

  useScrollSubscription((_documentProgress, scrollY) => {
    if (!hasContainerRef.current) return;
    const percent = percentAt(measureRef.current, scrollY);
    setProgress((previous) => (previous === percent ? previous : percent));
  });

  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 bg-transparent"
    >
      <div
        className={cn(
          // Pillar-tinted rather than the site-wide brand color, so the
          // reading-progress bar is part of the same identity channel as
          // everything else PillarScope retints on this page (see
          // LessonLayout) — a Hardware lesson's progress bar reads amber,
          // a Mechanics lesson's reads cyan.
          "h-full bg-pillar",
          !prefersReducedMotion && "transition-[width] duration-150 ease-out"
        )}
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
