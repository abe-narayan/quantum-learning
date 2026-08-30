"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";
import { useDeferredMount } from "@/components/motion/useDeferredMount";
import type { TwoAmplitudeVariant } from "./TwoAmplitudeMode";

const ComplexAmplitudeExplorer = dynamic(
  () => import("./ComplexAmplitudeExplorer").then((mod) => mod.ComplexAmplitudeExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

/** Visibility-gated so this embed's chunk doesn't fetch until it's actually
 *  near-viewport; see `LazyBlochSphereExplorer`'s doc comment for why this
 *  matters on a lesson page carrying several simulator embeds. */
export function LazyComplexAmplitudeExplorer({
  twoAmplitudeVariant,
}: {
  /** Forwarded to `ComplexAmplitudeExplorer`; see its doc comment for what each variant shows. Omit for the default double-slit reading. */
  twoAmplitudeVariant?: TwoAmplitudeVariant;
} = {}) {
  const { ref, ready } = useDeferredMount<HTMLDivElement>();

  return (
    <div ref={ref}>
      <SimulatorErrorBoundary>
        {ready ? (
          <ComplexAmplitudeExplorer twoAmplitudeVariant={twoAmplitudeVariant} />
        ) : (
          <SimulatorSkeleton variant="standard" />
        )}
      </SimulatorErrorBoundary>
    </div>
  );
}
