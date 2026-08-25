"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const NoiseExplorer = dynamic(() => import("./NoiseExplorer").then((mod) => mod.NoiseExplorer), {
  ssr: false,
  loading: () => <SimulatorSkeleton variant="standard" />,
});

export function LazyNoiseExplorer() {
  return (
    <SimulatorErrorBoundary>
      <NoiseExplorer />
    </SimulatorErrorBoundary>
  );
}
