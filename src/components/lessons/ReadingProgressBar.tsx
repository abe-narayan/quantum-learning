"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/simulators/bloch-sphere/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

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
 */
export function ReadingProgressBar({ containerId }: { containerId: string }) {
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return undefined;

    function measure() {
      const rect = container!.getBoundingClientRect();
      const scrollableHeight = rect.height - window.innerHeight;
      let percent: number;
      if (scrollableHeight <= 0) {
        // Container is shorter than the viewport: it's either fully in
        // view already (nothing to read progress through) or has been
        // scrolled past entirely.
        percent = rect.top <= 0 ? 1 : 0;
      } else {
        const scrolledPast = -rect.top;
        percent = Math.min(1, Math.max(0, scrolledPast / scrollableHeight));
      }
      setProgress(percent);
    }

    function onScrollOrResize() {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        measure();
      });
    }

    measure();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [containerId]);

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
          "h-full bg-brand",
          !prefersReducedMotion && "transition-[width] duration-150 ease-out"
        )}
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
