"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

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

export function LazyTunnelingIntroVisual() {
  return (
    <SimulatorErrorBoundary>
      <TunnelingIntroVisual />
    </SimulatorErrorBoundary>
  );
}
