"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";
import { useDeferredMount } from "@/components/motion/useDeferredMount";

const BlochSphereExplorer = dynamic(
  () => import("./BlochSphereExplorer").then((mod) => mod.BlochSphereExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

/**
 * This is the catalog/lesson variant (as opposed to `LazyBlochSphereHeroExplorer`):
 * it renders wherever a lesson author drops `<InteractiveSection>`, and a
 * lesson can carry several embeds down its length. Without a gate,
 * `next/dynamic(..., { ssr: false })` fires the chunk `import()` for every
 * one of them the instant the lesson mounts, regardless of scroll position,
 * see `useDeferredMount`'s doc comment. The visibility gate defaults on here
 * (unlike the hero variants) because this component's position on the page
 * is unknown at authoring time; most embeds are below the fold on mount.
 */
export function LazyBlochSphereExplorer() {
  const { ref, ready } = useDeferredMount<HTMLDivElement>();

  return (
    <div ref={ref}>
      <SimulatorErrorBoundary>
        {ready ? <BlochSphereExplorer /> : <SimulatorSkeleton variant="standard" />}
      </SimulatorErrorBoundary>
    </div>
  );
}
