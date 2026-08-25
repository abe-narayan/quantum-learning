"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const CompareStatesExplorer = dynamic(
  () => import("./CompareStatesExplorer").then((mod) => mod.CompareStatesExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

export function LazyCompareStatesExplorer() {
  return (
    <SimulatorErrorBoundary>
      <CompareStatesExplorer />
    </SimulatorErrorBoundary>
  );
}
