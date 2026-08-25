"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const SyndromeExplorer = dynamic(() => import("./SyndromeExplorer").then((mod) => mod.SyndromeExplorer), {
  ssr: false,
  loading: () => <SimulatorSkeleton variant="standard" />,
});

export function LazySyndromeExplorer(props: { mode: "bit-flip" | "phase-flip" }) {
  return (
    <SimulatorErrorBoundary>
      <SyndromeExplorer {...props} />
    </SimulatorErrorBoundary>
  );
}
