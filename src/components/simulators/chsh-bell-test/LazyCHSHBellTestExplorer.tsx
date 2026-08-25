"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const CHSHBellTestExplorer = dynamic(
  () => import("./CHSHBellTestExplorer").then((mod) => mod.CHSHBellTestExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

export function LazyCHSHBellTestExplorer() {
  return (
    <SimulatorErrorBoundary>
      <CHSHBellTestExplorer />
    </SimulatorErrorBoundary>
  );
}
