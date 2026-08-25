"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const CircuitBuilder = dynamic(() => import("./CircuitBuilder").then((mod) => mod.CircuitBuilder), {
  ssr: false,
  loading: () => <SimulatorSkeleton variant="standard" />,
});

export function LazyCircuitBuilder() {
  return (
    <SimulatorErrorBoundary>
      <CircuitBuilder />
    </SimulatorErrorBoundary>
  );
}
