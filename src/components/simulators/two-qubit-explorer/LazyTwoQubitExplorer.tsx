"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";
import { useDeferredMount } from "@/components/motion/useDeferredMount";

const TwoQubitExplorer = dynamic(
  () => import("./TwoQubitExplorer").then((mod) => mod.TwoQubitExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

/** Visibility-gated so this embed's chunk doesn't fetch until it's actually
 *  near-viewport — see `LazyBlochSphereExplorer`'s doc comment for why this
 *  matters on a lesson page carrying several simulator embeds. */
export function LazyTwoQubitExplorer() {
  const { ref, ready } = useDeferredMount<HTMLDivElement>();

  return (
    <div ref={ref}>
      <SimulatorErrorBoundary>
        {ready ? <TwoQubitExplorer /> : <SimulatorSkeleton variant="standard" />}
      </SimulatorErrorBoundary>
    </div>
  );
}
