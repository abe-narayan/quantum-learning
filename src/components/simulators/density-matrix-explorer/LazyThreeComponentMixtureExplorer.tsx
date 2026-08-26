"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const ThreeComponentMixtureExplorer = dynamic(
  () => import("./ThreeComponentMixtureExplorer").then((mod) => mod.ThreeComponentMixtureExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

export function LazyThreeComponentMixtureExplorer() {
  return (
    <SimulatorErrorBoundary>
      <ThreeComponentMixtureExplorer />
    </SimulatorErrorBoundary>
  );
}
