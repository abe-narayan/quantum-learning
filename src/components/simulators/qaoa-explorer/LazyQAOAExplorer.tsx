"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";

const QAOAExplorer = dynamic(() => import("./QAOAExplorer").then((mod) => mod.QAOAExplorer), {
  ssr: false,
  loading: () => <SimulatorSkeleton variant="standard" />,
});

export function LazyQAOAExplorer() {
  return (
    <SimulatorErrorBoundary>
      <QAOAExplorer />
    </SimulatorErrorBoundary>
  );
}
