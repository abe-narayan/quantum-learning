"use client";

import { useState } from "react";
import { VectorDiagram } from "./VectorDiagram";
import { FrameSlider } from "./FrameSlider";
import type { VectorFrame } from "./VectorDiagramExplorer";

type Panel = {
  /** Short caption shown above this panel, e.g. "Unitary: H (Hadamard)". */
  label: string;
  frames: VectorFrame[];
  ariaLabel: string;
};

function boundsFor(frames: VectorFrame[]) {
  const xs = [0];
  const ys = [0];
  for (const f of frames) {
    for (const v of f.vectors) {
      const from = v.from ?? { x: 0, y: 0 };
      xs.push(from.x, v.x);
      ys.push(from.y, v.y);
    }
  }
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

/**
 * Two `VectorDiagram` panels driven by one shared slider/frame index, for
 * lessons that ask the reader to compare two vector sweeps side by side at
 * matching parameter values — e.g. the same rotating unit vector under a
 * unitary vs. a non-unitary operator. `VectorDiagramExplorer` gives each
 * panel its own independent slider, which is right for a single diagram but
 * defeats a direct side-by-side comparison (dragging one panel doesn't move
 * the other, so the two are rarely shown at the same parameter value). This
 * component keeps both panels on one shared index instead: dragging the
 * single slider below moves both diagrams together. Each panel still gets
 * its own bounding box via `VectorDiagram`'s `bounds` prop, since the two
 * panels' vectors can have very different scales.
 */
export function VectorDiagramExplorerPair({
  panels,
  sliderLabel = "",
  showGrid = true,
  height = 300,
}: {
  panels: readonly [Panel, Panel];
  sliderLabel?: string;
  showGrid?: boolean;
  height?: number;
}) {
  const [index, setIndex] = useState(0);
  const frameCount = Math.min(panels[0].frames.length, panels[1].frames.length);
  const clampedIndex = Math.min(index, frameCount - 1);
  const bounds = panels.map((p) => boundsFor(p.frames));
  const currentFrames = panels.map((p) => p.frames[Math.min(clampedIndex, p.frames.length - 1)]);

  return (
    <div className="not-prose space-y-3">
      <div className="grid gap-6 sm:grid-cols-2">
        {panels.map((p, i) => (
          <div key={p.label} className="space-y-2">
            <p className="tech-label">{p.label}</p>
            <VectorDiagram
              vectors={currentFrames[i].vectors}
              ariaLabel={p.ariaLabel}
              showGrid={showGrid}
              height={height}
              bounds={bounds[i]}
            />
          </div>
        ))}
      </div>
      {frameCount > 1 && (
        <FrameSlider
          label={sliderLabel}
          valueLabel={currentFrames[0].paramLabel}
          index={clampedIndex}
          max={frameCount - 1}
          onChange={setIndex}
        />
      )}
    </div>
  );
}
