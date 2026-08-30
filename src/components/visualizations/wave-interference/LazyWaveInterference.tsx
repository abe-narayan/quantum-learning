"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";
import { useDeferredMount } from "@/components/motion/useDeferredMount";

const WaveInterference = dynamic(
  () => import("./WaveInterference").then((mod) => mod.WaveInterference),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

/** Visibility-gated, matching the 15 simulator `Lazy*` wrappers. Without the
 *  gate `next/dynamic` fires this embed's `import()` during hydration wherever
 *  on the page it sits; both lessons that use it place it mid-prose, well below
 *  the fold. Chunk: 15.5 KB raw / 4.9 KB brotli. */
export function LazyWaveInterference() {
  const { ref, ready } = useDeferredMount<HTMLDivElement>();

  return (
    <div ref={ref}>
      <SimulatorErrorBoundary>
        {ready ? <WaveInterference /> : <SimulatorSkeleton variant="standard" />}
      </SimulatorErrorBoundary>
    </div>
  );
}
