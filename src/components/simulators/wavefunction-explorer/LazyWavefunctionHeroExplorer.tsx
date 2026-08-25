"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const WavefunctionHeroExplorer = dynamic(
  () => import("./WavefunctionHeroExplorer").then((mod) => mod.WavefunctionHeroExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="heroWide" />,
  }
);

export function LazyWavefunctionHeroExplorer() {
  return (
    <SimulatorErrorBoundary>
      <WavefunctionHeroExplorer />
    </SimulatorErrorBoundary>
  );
}
