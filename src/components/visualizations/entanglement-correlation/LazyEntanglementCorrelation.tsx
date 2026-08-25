"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const EntanglementCorrelation = dynamic(
  () => import("./EntanglementCorrelation").then((mod) => mod.EntanglementCorrelation),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

export function LazyEntanglementCorrelation() {
  return (
    <SimulatorErrorBoundary>
      <EntanglementCorrelation />
    </SimulatorErrorBoundary>
  );
}
