"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const WaveInterference = dynamic(
  () => import("./WaveInterference").then((mod) => mod.WaveInterference),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

export function LazyWaveInterference() {
  return (
    <SimulatorErrorBoundary>
      <WaveInterference />
    </SimulatorErrorBoundary>
  );
}
