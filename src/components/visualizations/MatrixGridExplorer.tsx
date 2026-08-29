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
    <div className="not-prose space-y-4 panel-inset p-4">
      {presets.length > 1 && (
        <PresetToggle options={presets} index={index} onChange={setIndex} ariaLabel={ariaLabel} />
      )}
      {/* `role="group"` + `tabIndex={0}`, not `role="img"` — same reasoning as
          `MatrixGrid`, which this shares `MatrixCellGrid` with, and with one
          extra edge: the composed label ends in `preset.label`, so `img` made
          the preset toggle announce a new figure *name* while erasing the only
          thing the toggle actually changes — the entries. A reader pressing
          through "Standard basis" → "Hadamard basis" heard the caption change
          and could never reach a single number that had changed with it.
          `group` keeps that live label (still spoken on entry and on focus)
          and gives the cells back.

          The tab stop is not decorative: the panels are `minmax(3.5rem, 1fr)`
          columns, so any 4×4 preset is 224px and wider presets more, against a
          ~256px content box on a 320px phone, and `overflow-x-auto` is
          keyboard-reachable by default only in Firefox. */}
      <div
        role="group"
        aria-label={`${ariaLabel}: ${preset.label}`}
        tabIndex={0}
        className="flex flex-wrap items-start gap-6 overflow-x-auto"
      >
        {preset.panels.map((panel, i) => (
          <div key={i} className="space-y-2">
            {panel.label ? (
              <p className="tech-label">{panel.label}</p>
            ) : null}
            <MatrixCellGrid cells={panel.cells} digits={digits} highlightDiagonal={panel.highlightDiagonal} />
          </div>
        ))}
      </div>
    </div>
  );
}
