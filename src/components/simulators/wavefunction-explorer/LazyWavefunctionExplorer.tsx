"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const WavefunctionExplorer = dynamic(
  () => import("./WavefunctionExplorer").then((mod) => mod.WavefunctionExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

export function LazyWavefunctionExplorer() {
  return (
    <SimulatorErrorBoundary>
      <WavefunctionExplorer />
    </SimulatorErrorBoundary>
  );
}
