"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";
import { useDeferredMount } from "@/components/motion/useDeferredMount";

const WavefunctionHeroExplorer = dynamic(
  () => import("./WavefunctionHeroExplorer").then((mod) => mod.WavefunctionHeroExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="heroWide" />,
  }
);

/**
 * `dynamic(..., { ssr: false })` defers *server* rendering, not the chunk
 * fetch: without a gate, React tries to render `WavefunctionHeroExplorer`
 * the instant this component mounts, and `next/dynamic` fires the
 * `import()` right then — on the homepage, that means a 300+ KB chunk
 * competing for bandwidth with the page's own first paint, above the fold,
 * on the site's most-visited route. See docs/PERF_AUDIT.md.
 *
 * `useDeferredMount` holds the real explorer back until shortly after
 * paint (idle callback, capped) or until the reader actually touches the
 * placeholder — whichever is first — so the fetch no longer competes with
 * initial render, while still arriving within a second or two, not "when
 * you scroll to it" (this widget is above the fold; see the Bloch sphere
 * hero for the visibility-gated case, appropriate there because it isn't).
 * The placeholder shown while gated is the exact same `SimulatorSkeleton`
 * `next/dynamic`'s own `loading` renders during the fetch itself, so there
 * is no extra visual state and no flash between "gated" and "fetching."
 */
export function LazyWavefunctionHeroExplorer() {
  // No visibility gate: this widget is always above the fold (it's the
  // homepage hero), so an IntersectionObserver would report it as already
  // intersecting on mount and fire immediately — idle-after-paint (or an
  // eager reader interacting with the placeholder) is the only real defer
  // signal available here.
  const { ref, ready } = useDeferredMount<HTMLDivElement>({ observeVisibility: false });

  return (
    <div ref={ref}>
      <SimulatorErrorBoundary>
        {ready ? <WavefunctionHeroExplorer /> : <SimulatorSkeleton variant="heroWide" />}
      </SimulatorErrorBoundary>
    </div>
  );
}
