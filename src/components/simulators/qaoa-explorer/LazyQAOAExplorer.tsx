"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";
import { useDeferredMount } from "@/components/motion/useDeferredMount";

const QAOAExplorer = dynamic(() => import("./QAOAExplorer").then((mod) => mod.QAOAExplorer), {
  ssr: false,
  loading: () => <SimulatorSkeleton variant="standard" />,
});

/** Visibility-gated so this embed's chunk doesn't fetch until it's actually
 *  near-viewport — see `LazyBlochSphereExplorer`'s doc comment for why this
 *  matters on a lesson page carrying several simulator embeds. */
export function LazyQAOAExplorer() {
  const { ref, ready } = useDeferredMount<HTMLDivElement>();

  return (
    <div ref={ref}>
      <SimulatorErrorBoundary>
        {ready ? <QAOAExplorer /> : <SimulatorSkeleton variant="standard" />}
      </SimulatorErrorBoundary>
    </div>
  );
}
