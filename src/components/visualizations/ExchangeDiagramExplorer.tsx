"use client";

import { ExchangeDiagramContent, type ExchangeVerdict } from "./ExchangeDiagram";
import type { MatrixCell } from "./MatrixGrid";
import { useFrameIndex } from "./useFrameIndex";
import { PresetToggle } from "./PresetToggle";

export type ExchangePreset = {
  label: string;
  before: MatrixCell[][];
  after: MatrixCell[][];
  beforeLabel?: string;
  afterLabel?: string;
  basisLabels?: string[];
  verdict?: ExchangeVerdict;
};

/**
 * `ExchangeDiagram` behind a discrete preset selector, the same pattern as
 * `MatrixGridExplorer` — lets a lesson offer more than one concrete
 * (a, b) choice (a bare product state, a symmetric combination, an
 * antisymmetric combination, the a=b exclusion case) without hardcoding
 * just one. Shares one bordered box between the preset toggle and the
 * diagram, matching `MatrixGridExplorer`'s structure.
 */
export function ExchangeDiagramExplorer({ presets, ariaLabel }: { presets: ExchangePreset[]; ariaLabel: string }) {
  const { index, setIndex, frame: preset } = useFrameIndex(presets);

  return (
    <div className="not-prose space-y-4 panel-inset p-4">
      {presets.length > 1 && (
        <PresetToggle options={presets} index={index} onChange={setIndex} ariaLabel={ariaLabel} />
      )}
      {/* `role="group"`, not `role="img"` — see the long note in
          `ExchangeDiagram`, which shares this subtree. The explorer case is
          the sharper one: every preset here swaps the amplitudes *and* the
          verdict (product → symmetric → antisymmetric → the a=b zero vector),
          and the verdict badge is the only place the answer is written. With
          `img`, pressing through the presets renamed the figure and erased
          every number and every conclusion behind the new name, so the control
          did nothing a screen-reader user could observe.

          No `tabIndex={0}`: the grids are at most 3 × 3.5rem = 168px wide and
          sit in a `flex-wrap` row, so this container does not actually
          overflow at any realistic width and a tab stop here would scroll
          nothing. */}
      <div role="group" aria-label={`${ariaLabel}: ${preset.label}`} className="space-y-4 overflow-x-auto">
        <ExchangeDiagramContent
          before={preset.before}
          after={preset.after}
          beforeLabel={preset.beforeLabel}
          afterLabel={preset.afterLabel}
          basisLabels={preset.basisLabels}
          verdict={preset.verdict}
        />
      </div>
    </div>
  );
}
