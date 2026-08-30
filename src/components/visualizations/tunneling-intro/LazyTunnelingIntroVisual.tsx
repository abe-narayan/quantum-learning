"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";
import { useDeferredMount } from "@/components/motion/useDeferredMount";

// Dynamically imported (ssr:false) because, unlike this platform's purely
// declarative SVG diagrams, this component pulls in the split-operator /
// FFT time-evolution engine (see tunnelingTrajectory.ts) to precompute a
// real trajectory — the same "reuse the heavier engine -> lazy-load it"
// rule the Wavefunction Explorer's own Lazy wrappers follow.
const TunnelingIntroVisual = dynamic(
  () => import("./TunnelingIntroVisual").then((mod) => mod.TunnelingIntroVisual),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

/** Visibility-gated, matching the 15 simulator `Lazy*` wrappers. This is the
 *  most expensive of the four ungated visual embeds: the split-operator/FFT
 *  engine noted above is tens of KB of its own chunk, and without the gate
 *  `next/dynamic` fetched it during hydration rather than on approach. */
export function LazyTunnelingIntroVisual() {
  const { ref, ready } = useDeferredMount<HTMLDivElement>();

  return (
    <div ref={ref}>
      <SimulatorErrorBoundary>
        {ready ? <TunnelingIntroVisual /> : <SimulatorSkeleton variant="standard" />}
      </SimulatorErrorBoundary>
    </div>
  );
}
