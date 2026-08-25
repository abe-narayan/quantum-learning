"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const ComplexAmplitudeExplorer = dynamic(
  () => import("./ComplexAmplitudeExplorer").then((mod) => mod.ComplexAmplitudeExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

export function LazyComplexAmplitudeExplorer() {
  return (
    <SimulatorErrorBoundary>
      <ComplexAmplitudeExplorer />
    </SimulatorErrorBoundary>
  );
}
