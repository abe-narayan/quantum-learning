"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";
import type { TwoAmplitudeVariant } from "./TwoAmplitudeMode";

const ComplexAmplitudeExplorer = dynamic(
  () => import("./ComplexAmplitudeExplorer").then((mod) => mod.ComplexAmplitudeExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

export function LazyComplexAmplitudeExplorer({
  twoAmplitudeVariant,
}: {
  /** Forwarded to `ComplexAmplitudeExplorer` — see its doc comment for what each variant shows. Omit for the default double-slit reading. */
  twoAmplitudeVariant?: TwoAmplitudeVariant;
} = {}) {
  return (
    <SimulatorErrorBoundary>
      <ComplexAmplitudeExplorer twoAmplitudeVariant={twoAmplitudeVariant} />
    </SimulatorErrorBoundary>
  );
}
