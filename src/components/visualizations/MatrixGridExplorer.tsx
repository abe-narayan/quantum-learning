"use client";

import { MatrixCellGrid, type MatrixCell } from "./MatrixGrid";
import { useFrameIndex } from "./useFrameIndex";
import { PresetToggle } from "./PresetToggle";

export type MatrixPanel = {
  label?: string;
  cells: MatrixCell[][];
  highlightDiagonal?: boolean;
};

export type MatrixPreset = {
  /** Button text, e.g. "Standard basis {|0⟩, |1⟩}". */
  label: string;
  panels: MatrixPanel[];
};

/**
 * `MatrixGrid` behind a discrete preset selector — the same idea as the
 * simulators' "state presets" button row, generalized for any lesson that
 * wants to show how a claimed matrix relationship (completeness, M vs M†,
 * a tensor product) plays out for more than one concrete example. Cells
 * must already be plain data (`matrixToCells` from a real `Matrix`,
 * computed in the lesson's own MDX body) — a `Matrix` class instance can't
 * cross the server/client boundary this component sits on.
 */
export function MatrixGridExplorer({
  presets,
  ariaLabel,
  digits = 2,
}: {
  presets: MatrixPreset[];
  ariaLabel: string;
  digits?: number;
}) {
  const { index, setIndex, frame: preset } = useFrameIndex(presets);

  return (
    <div className="not-prose space-y-4 rounded-xl border border-border bg-surface-muted/40 p-4">
      {presets.length > 1 && (
        <PresetToggle options={presets} index={index} onChange={setIndex} ariaLabel={ariaLabel} />
      )}
      <div role="img" aria-label={`${ariaLabel}: ${preset.label}`} className="flex flex-wrap items-start gap-6 overflow-x-auto">
        {preset.panels.map((panel, i) => (
          <div key={i} className="space-y-2">
            {panel.label ? (
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{panel.label}</p>
            ) : null}
            <MatrixCellGrid cells={panel.cells} digits={digits} highlightDiagonal={panel.highlightDiagonal} />
          </div>
        ))}
      </div>
    </div>
  );
}
