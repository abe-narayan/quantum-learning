"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const TwoQubitExplorer = dynamic(
  () => import("./TwoQubitExplorer").then((mod) => mod.TwoQubitExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

export function LazyTwoQubitExplorer() {
  return (
    <SimulatorErrorBoundary>
      <TwoQubitExplorer />
    </SimulatorErrorBoundary>
  );
}
