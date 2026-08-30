"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";
import { useDeferredMount } from "@/components/motion/useDeferredMount";

const SuperpositionJourney = dynamic(
  () => import("./SuperpositionJourney").then((mod) => mod.SuperpositionJourney),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

/** Visibility-gated, matching the 15 simulator `Lazy*` wrappers. Without the
 *  gate `next/dynamic` fires this embed's `import()` the instant React renders
 *  the wrapper, i.e. during hydration, wherever on the page it sits. This one
 *  is on `what-is-a-qubit` — the lesson `START_LEARNING_HREF` opens, so the
 *  first lesson most readers ever load — and its chunk is 14.9 KB raw /
 *  4.9 KB brotli of extra network work competing with hydration on a page
 *  whose HTML is already 551 KB. See `useDeferredMount` for the three signals
 *  that release it (idle after paint, near-viewport, or interaction). */
export function LazySuperpositionJourney() {
  const { ref, ready } = useDeferredMount<HTMLDivElement>();

  return (
    <div ref={ref}>
      <SimulatorErrorBoundary>
        {ready ? <SuperpositionJourney /> : <SimulatorSkeleton variant="standard" />}
      </SimulatorErrorBoundary>
    </div>
  );
}
