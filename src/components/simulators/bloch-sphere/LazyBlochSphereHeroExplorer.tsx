"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";
import { useDeferredMount } from "@/components/motion/useDeferredMount";

const BlochSphereHeroExplorer = dynamic(
  () => import("./BlochSphereHeroExplorer").then((mod) => mod.BlochSphereHeroExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="hero" />,
  }
);

/**
 * This wrapper is reused in two places (`/computing`'s own hero, and
 * further down the homepage in `ComputingSection`) — unlike the wavefunction
 * hero, it is genuinely below the fold in the second case, so (unlike that
 * one) the visibility gate stays on here: `useDeferredMount`'s default
 * `rootMargin` means the chunk starts fetching shortly before a reader
 * scrolls to it rather than the instant the homepage mounts. On
 * `/computing`, where it's near the top, the same gate still fires almost
 * immediately (an element already in the viewport reports as intersecting
 * on the observer's first callback) — one component, correct behavior in
 * both positions. See `LazyWavefunctionHeroExplorer` for the above-the-fold
 * case this deliberately differs from.
 */
export function LazyBlochSphereHeroExplorer() {
  const { ref, ready } = useDeferredMount<HTMLDivElement>();

  return (
    <div ref={ref}>
      <SimulatorErrorBoundary>
        {ready ? <BlochSphereHeroExplorer /> : <SimulatorSkeleton variant="hero" />}
      </SimulatorErrorBoundary>
    </div>
  );
}
