"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const DensityMatrixExplorer = dynamic(
  () => import("./DensityMatrixExplorer").then((mod) => mod.DensityMatrixExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

export function LazyDensityMatrixExplorer() {
  return (
    <SimulatorErrorBoundary>
      <DensityMatrixExplorer />
    </SimulatorErrorBoundary>
  );
}
