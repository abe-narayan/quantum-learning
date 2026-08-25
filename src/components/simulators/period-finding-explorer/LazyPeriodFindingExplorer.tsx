"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const PeriodFindingExplorer = dynamic(
  () => import("./PeriodFindingExplorer").then((mod) => mod.PeriodFindingExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

export function LazyPeriodFindingExplorer() {
  return (
    <SimulatorErrorBoundary>
      <PeriodFindingExplorer />
    </SimulatorErrorBoundary>
  );
}
