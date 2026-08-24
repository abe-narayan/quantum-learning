"use client";

import type { GateInstruction } from "@/lib/quantum/circuitBuilder";
import { StaticCircuitDiagram } from "./StaticCircuitDiagram";
import { useFrameIndex } from "./useFrameIndex";
import { FrameSlider } from "./FrameSlider";

export type CircuitDiagramFrame = {
  /** Pre-formatted, e.g. "H = Ry(π/2)Rz(π)" or "d = 3" — computed by the caller, matching BarChartExplorer's/ParametricCurve's paramLabel pattern. */
  paramLabel: string;
  numQubits: number;
  instructions: GateInstruction[];
  highlightColumn?: number;
  /** Describes THIS specific frame's circuit (read by screen readers when the slider lands on it), not the whole explorer. */
  ariaLabel: string;
};

/**
 * StaticCircuitDiagram plus a slider that scrubs through precomputed circuit
 * frames — the same "scrub a precomputed array" pattern BarChartExplorer and
 * ParametricCurve already use for bars/curves, applied to circuit diagrams.
 * Useful whenever a lesson wants to compare several related circuits one at
 * a time (different gate decompositions, different SWAP-network distances)
 * rather than showing every circuit at once. Every frame's gate sequence
 * must be a real, computable circuit (matching a lesson's own verified
 * identity or engine formula), never a hand-drawn illustration disconnected
 * from actual gate data.
 */
export function CircuitDiagramExplorer({
  frames,
  sliderLabel = "",
}: {
  frames: CircuitDiagramFrame[];
  sliderLabel?: string;
}) {
  const { index, setIndex, frame } = useFrameIndex(frames);

  return (
    <div className="not-prose space-y-3">
      <StaticCircuitDiagram
        numQubits={frame.numQubits}
        instructions={frame.instructions}
        highlightColumn={frame.highlightColumn}
        ariaLabel={frame.ariaLabel}
      />
      {frames.length > 1 && (
        <FrameSlider
          label={sliderLabel}
          valueLabel={frame.paramLabel}
          index={index}
          max={frames.length - 1}
          onChange={setIndex}
        />
      )}
    </div>
  );
}
