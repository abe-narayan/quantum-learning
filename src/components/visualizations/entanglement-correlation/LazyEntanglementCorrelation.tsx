"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";
import { useDeferredMount } from "@/components/motion/useDeferredMount";

const EntanglementCorrelation = dynamic(
  () => import("./EntanglementCorrelation").then((mod) => mod.EntanglementCorrelation),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

/** Visibility-gated, matching the 15 simulator `Lazy*` wrappers. Without the
 *  gate `next/dynamic` fires this embed's `import()` during hydration wherever
 *  on the page it sits. Chunk: 16.7 KB raw / 5.5 KB brotli. */
export function LazyEntanglementCorrelation() {
  const { ref, ready } = useDeferredMount<HTMLDivElement>();

  return (
    <div ref={ref}>
      <SimulatorErrorBoundary>
        {ready ? <EntanglementCorrelation /> : <SimulatorSkeleton variant="standard" />}
      </SimulatorErrorBoundary>
    </div>
  );
}
