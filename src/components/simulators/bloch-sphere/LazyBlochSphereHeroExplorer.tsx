"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const BlochSphereHeroExplorer = dynamic(
  () => import("./BlochSphereHeroExplorer").then((mod) => mod.BlochSphereHeroExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="hero" />,
  }
);

export function LazyBlochSphereHeroExplorer() {
  return (
    <SimulatorErrorBoundary>
      <BlochSphereHeroExplorer />
    </SimulatorErrorBoundary>
  );
}
