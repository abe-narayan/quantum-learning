"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const RabiExplorer = dynamic(() => import("./RabiExplorer").then((mod) => mod.RabiExplorer), {
  ssr: false,
  loading: () => <SimulatorSkeleton variant="standard" />,
});

export function LazyRabiExplorer() {
  return (
    <SimulatorErrorBoundary>
      <RabiExplorer />
    </SimulatorErrorBoundary>
  );
}
