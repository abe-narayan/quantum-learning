"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const GroverExplorer = dynamic(() => import("./GroverExplorer").then((mod) => mod.GroverExplorer), {
  ssr: false,
  loading: () => <SimulatorSkeleton variant="standard" />,
});

export function LazyGroverExplorer() {
  return (
    <SimulatorErrorBoundary>
      <GroverExplorer />
    </SimulatorErrorBoundary>
  );
}
