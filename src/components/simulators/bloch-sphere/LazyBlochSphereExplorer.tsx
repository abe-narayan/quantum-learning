"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const BlochSphereExplorer = dynamic(
  () => import("./BlochSphereExplorer").then((mod) => mod.BlochSphereExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

export function LazyBlochSphereExplorer() {
  return (
    <SimulatorErrorBoundary>
      <BlochSphereExplorer />
    </SimulatorErrorBoundary>
  );
}
