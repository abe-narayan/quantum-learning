"use client";

import dynamic from "next/dynamic";
import { SimulatorErrorBoundary } from "@/components/simulators/SimulatorErrorBoundary";
import { SimulatorSkeleton } from "@/components/simulators/SimulatorSkeleton";
import type { PresetId } from "./presets";

const WavefunctionExplorer = dynamic(
  () => import("./WavefunctionExplorer").then((mod) => mod.WavefunctionExplorer),
  {
    ssr: false,
    loading: () => <SimulatorSkeleton variant="standard" />,
  }
);

export function LazyWavefunctionExplorer({
  initialPresetId,
  showMeanSpreadOverlay,
}: {
  initialPresetId?: PresetId;
  /** Forwarded to WavefunctionCanvas — draws ⟨x⟩ and Δx on the density plot. */
  showMeanSpreadOverlay?: boolean;
} = {}) {
  return (
    <SimulatorErrorBoundary>
      <WavefunctionExplorer initialPresetId={initialPresetId} showMeanSpreadOverlay={showMeanSpreadOverlay} />
    </SimulatorErrorBoundary>
  );
}
