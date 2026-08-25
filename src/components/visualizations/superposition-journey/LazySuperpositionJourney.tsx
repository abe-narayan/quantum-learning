"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const SuperpositionJourney = dynamic(
  () => import("./SuperpositionJourney").then((mod) => mod.SuperpositionJourney),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

export function LazySuperpositionJourney() {
  return (
    <SimulatorErrorBoundary>
      <SuperpositionJourney />
    </SimulatorErrorBoundary>
  );
}
