"use client";

import { useState } from "react";
import type { MatrixCell } from "./MatrixGrid";
import { formatAmplitudeLatex } from "@/lib/quantum/format";
import { useFrameIndex } from "./useFrameIndex";
import { FrameSlider } from "./FrameSlider";
import { PresetToggle } from "./PresetToggle";
import { cn } from "@/lib/utils";

/** ρ_AB and both of its single-qubit reductions, all for the same 2-qubit state. */
export type PartialTracePanels = {
  /** The full 4x4 joint density matrix, basis order |00⟩,|01⟩,|10⟩,|11⟩. */
  rhoAB: MatrixCell[][];
  /** Tr_B(ρ_AB) — qubit 0's reduced state (traces out qubit 1). */
  rhoA0: MatrixCell[][];
  /** Tr_A(ρ_AB) — qubit 1's reduced state (traces out qubit 0). */
  rhoA1: MatrixCell[][];
};

export type PartialTraceFrame = PartialTracePanels & {
  /** Pre-formatted, e.g. "θ = 30°" — computed by the caller, matching ParametricCurve's paramLabel pattern. */
  paramLabel: string;
};

export type PartialTracePreset = {
  /** Button text, e.g. "|+0⟩ (product)". */
  label: string;
  /** A single fixed state has one frame; a family like ψ(θ) supplies several for the slider. */
  frames: PartialTraceFrame[];
  /** Required when a preset has more than one frame. */
  sliderLabel?: string;
};

const BASIS_LABELS_2 = ["|0⟩", "|1⟩"];
const BASIS_LABELS_4 = ["|00⟩", "|01⟩", "|10⟩", "|11⟩"];

/** MSB convention throughout this platform: combined index = 2*qubit0Bit + qubit1Bit. */
function qubit0Bit(index: number): number {
  return Math.floor(index / 2);
}
function qubit1Bit(index: number): number {
  return index % 2;
}

/**
 * Makes the index-sum formula this lesson derives, $(\rho_A)_{i'i}=\sum_j(\rho_{AB})_{i'j,ij}$,
 * something a reader can click through rather than only read in LaTeX.
 * Selecting a cell of the 2x2 reduced matrix highlights exactly the ρ_AB
 * entries that sum into it; every ρ_AB entry whose traced-out-qubit
 * bra/ket indices disagree is shown permanently dimmed, since those never
 * contribute to *any* reduced entry — the fact the lesson's Worked Example
 * turns on. `tracedQubit` toggles which qubit is summed out (0 or 1),
 * switching between ρ_A and ρ_B without recomputing anything: both
 * reductions are supplied already-computed by the caller (an MDX lesson
 * body, a Server Component, calling the real `reducedDensityMatrixQubit0`/
 * `reducedDensityMatrixQubit1` — this component only renders plain cells,
 * never touches `Matrix` itself).
 */
export function PartialTraceHighlight({
  presets,
  ariaLabel,
  digits = 2,
}: {
  presets: PartialTracePreset[];
  ariaLabel: string;
  digits?: number;
}) {
  const { index: presetIndex, setIndex: rawSetPresetIndex, frame: preset } = useFrameIndex(presets);
  const { index: frameIndex, setIndex: rawSetFrameIndex, frame } = useFrameIndex(preset.frames);
  const [tracedQubit, setTracedQubit] = useState<0 | 1>(1);
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);

  const setPresetIndex = (next: number) => {
    rawSetPresetIndex(next);
    setSelected(null);
  };
  const setFrameIndex = (next: number) => {
    rawSetFrameIndex(next);
    setSelected(null);
  };
  const chooseTracedQubit = (next: 0 | 1) => {
    setTracedQubit(next);
    setSelected(null);
  };

  const rhoA = tracedQubit === 1 ? frame.rhoA0 : frame.rhoA1;
  const rhoALabel = tracedQubit === 1 ? "ρ_A = Tr_B(ρ_AB)" : "ρ_B = Tr_A(ρ_AB)";
  const tracedBitOf = tracedQubit === 0 ? qubit0Bit : qubit1Bit;
  const keptBitOf = tracedQubit === 0 ? qubit1Bit : qubit0Bit;
  const summedQubitLabel = tracedQubit === 0 ? "i" : "j";

  const selectionText = selected
    ? `Selected (${rhoALabel.slice(0, 5)})_{${BASIS_LABELS_2[selected.row]}${BASIS_LABELS_2[selected.col]}}: summed over ${summedQubitLabel}, ${frame.rhoAB
        .flatMap((row, r) => row.map((_, c) => ({ r, c })))
        .filter(({ r, c }) => tracedBitOf(r) === tracedBitOf(c) && keptBitOf(r) === selected.row && keptBitOf(c) === selected.col).length} entries of ρ_AB highlighted; every entry whose ${
        tracedQubit === 0 ? "qubit-0" : "qubit-1"
      } bra/ket indices disagree is excluded from all reduced entries.`
    : "Click a cell of the reduced matrix to see which ρ_AB entries sum into it.";

  return (
    <div className="not-prose space-y-4 rounded-xl border border-border bg-surface-muted/40 p-4">
      {presets.length > 1 && (
        <PresetToggle options={presets} index={presetIndex} onChange={setPresetIndex} ariaLabel={ariaLabel} />
      )}

      <PresetToggle
        options={[{ label: "Trace out qubit 1 → ρ_A" }, { label: "Trace out qubit 0 → ρ_B" }]}
        index={tracedQubit === 1 ? 0 : 1}
        onChange={(i) => chooseTracedQubit(i === 0 ? 1 : 0)}
        ariaLabel="Which qubit to trace out"
      />

      <div className="flex flex-wrap items-start gap-6 overflow-x-auto" aria-label={`${ariaLabel}: ${preset.label}, ${frame.paramLabel}`}>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">ρ_AB</p>
          <BasisRow labels={BASIS_LABELS_4} />
          <div className="flex">
            <BasisColumn labels={BASIS_LABELS_4} />
            <div
              className="inline-grid gap-px overflow-hidden rounded-lg border border-border bg-border"
              style={{ gridTemplateColumns: "repeat(4, minmax(3.25rem, 1fr))" }}
            >
              {frame.rhoAB.map((row, r) =>
                row.map((cell, c) => {
                  const eligible = tracedBitOf(r) === tracedBitOf(c);
                  const isContribution =
                    selected !== null && eligible && keptBitOf(r) === selected.row && keptBitOf(c) === selected.col;
                  return (
                    <div
                      key={`${r}-${c}`}
                      title={
                        eligible
                          ? `(ρ_AB)_{${BASIS_LABELS_4[r]},${BASIS_LABELS_4[c]}} — contributes to reduced entry (${BASIS_LABELS_2[keptBitOf(r)]},${BASIS_LABELS_2[keptBitOf(c)]})`
                          : `(ρ_AB)_{${BASIS_LABELS_4[r]},${BASIS_LABELS_4[c]}} — excluded: ${
                              tracedQubit === 0 ? "qubit-0" : "qubit-1"
                            } bra/ket indices differ, so this never contributes to any reduced entry`
                      }
                      className={cn(
                        "flex items-center justify-center px-2 py-2.5 font-mono text-xs sm:text-sm transition-colors",
                        !eligible && "bg-surface-muted/60 text-muted-foreground/40",
                        eligible && !isContribution && "bg-surface text-foreground",
                        isContribution && "bg-brand/15 font-semibold text-brand ring-2 ring-inset ring-brand"
                      )}
                    >
                      {formatAmplitudeLatex(cell, digits)}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="space-y-1.5 pt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{rhoALabel}</p>
          <BasisRow labels={BASIS_LABELS_2} />
          <div className="flex">
            <BasisColumn labels={BASIS_LABELS_2} />
            <div
              role="group"
              aria-label={`${rhoALabel} — click a cell to highlight its contributing ρ_AB entries`}
              className="inline-grid gap-px overflow-hidden rounded-lg border border-border bg-border"
              style={{ gridTemplateColumns: "repeat(2, minmax(3.25rem, 1fr))" }}
            >
              {rhoA.map((row, r) =>
                row.map((cell, c) => {
                  const isSelected = selected?.row === r && selected?.col === c;
                  return (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      aria-pressed={isSelected}
                      aria-label={`(${rhoALabel.slice(0, 5)})_{${BASIS_LABELS_2[r]},${BASIS_LABELS_2[c]}} = ${formatAmplitudeLatex(cell, digits)}${isSelected ? ", selected" : ""}`}
                      onClick={() => setSelected(isSelected ? null : { row: r, col: c })}
                      className={cn(
                        "flex items-center justify-center px-2 py-2.5 font-mono text-xs transition-colors sm:text-sm",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isSelected
                          ? "bg-brand/15 font-semibold text-brand ring-2 ring-inset ring-brand"
                          : r === c
                            ? "bg-brand/5 text-foreground hover:bg-brand/10"
                            : "bg-surface text-foreground hover:bg-surface-muted"
                      )}
                    >
                      {formatAmplitudeLatex(cell, digits)}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground" aria-live="polite">
        {selectionText}
      </p>

      {preset.frames.length > 1 && (
        <FrameSlider
          label={preset.sliderLabel ?? ""}
          valueLabel={frame.paramLabel}
          index={frameIndex}
          max={preset.frames.length - 1}
          onChange={setFrameIndex}
          boxed={false}
        />
      )}
    </div>
  );
}

function BasisRow({ labels }: { labels: string[] }) {
  return (
    <div className="ml-[3.25rem] flex gap-px text-[10px] text-muted-foreground">
      {labels.map((label, i) => (
        <span key={i} className="flex-1 text-center" style={{ minWidth: "3.25rem" }}>
          {label}
        </span>
      ))}
    </div>
  );
}

function BasisColumn({ labels }: { labels: string[] }) {
  return (
    <div className="flex flex-col justify-around gap-px pr-1 text-[10px] text-muted-foreground">
      {labels.map((label, i) => (
        <span key={i} className="flex h-[2.75rem] items-center sm:h-[2.9rem]">
          {label}
        </span>
      ))}
    </div>
  );
}
