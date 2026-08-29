"use client";

import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { ControlSection, SimulatorSlider, SymbolGloss } from "../shared/controls";

/** The four measurement angles (radians) a student can set: Alice's a, a′ and Bob's b, b′. */
export type ChshAngles = { a: number; aPrime: number; b: number; bPrime: number };

export function CHSHBellTestControls({
  angles,
  onAnglesChange,
  onApplyZeroPreset,
  onApplyOptimalPreset,
  isOptimalPreset,
  isZeroPreset,
}: {
  angles: ChshAngles;
  onAnglesChange: (angles: ChshAngles) => void;
  onApplyZeroPreset: () => void;
  onApplyOptimalPreset: () => void;
  isOptimalPreset: boolean;
  isZeroPreset: boolean;
}) {
  return (
    <div className="space-y-8">
      <ControlSection
        id="chsh-presets"
        title="Presets"
        description="Jump to a known configuration, or drag any slider below to set your own angles."
      >
        {/* The second option used to read "Try this: quantum-optimal angles".
            The instrument now *opens* on those angles, so that phrasing pointed
            the reader at where they already were, and left the classical
            reference configuration looking like an afterthought. Both options
            now say plainly what configuration they load; the one worth trying
            first is the one the reader is not currently sitting on. */}
        <PresetToggle
          ariaLabel="Angle presets"
          options={[{ label: "All angles 0° (classical reference)" }, { label: "Quantum-optimal angles" }]}
          index={isZeroPreset ? 0 : isOptimalPreset ? 1 : -1}
          onChange={(i) => (i === 0 ? onApplyZeroPreset() : onApplyOptimalPreset())}
        />
      </ControlSection>

      <ControlSection
        id="chsh-alice"
        title="Alice&rsquo;s two measurement settings"
        description="Alice holds one half of the entangled pair. Before each run she picks one of these two angles to measure along."
      >
        <div className="space-y-4">
          <AngleSlider
            label="a"
            spokenAs={"Alice’s first measurement angle"}
            value={angles.a}
            onChange={(a) => onAnglesChange({ ...angles, a })}
          />
          <AngleSlider
            label="a′"
            spokenAs={"Alice’s second measurement angle"}
            value={angles.aPrime}
            onChange={(aPrime) => onAnglesChange({ ...angles, aPrime })}
          />
        </div>
      </ControlSection>

      <ControlSection
        id="chsh-bob"
        title="Bob&rsquo;s two measurement settings"
        description="Bob holds the other half, arbitrarily far away, and independently picks one of his two angles."
      >
        <div className="space-y-4">
          <AngleSlider
            label="b"
            spokenAs={"Bob’s first measurement angle"}
            value={angles.b}
            onChange={(b) => onAnglesChange({ ...angles, b })}
          />
          <AngleSlider
            label="b′"
            spokenAs={"Bob’s second measurement angle"}
            value={angles.bPrime}
            onChange={(bPrime) => onAnglesChange({ ...angles, bPrime })}
          />
        </div>
        <SymbolGloss
          items={[
            {
              symbol: "a, b",
              name: "measurement angles",
              means:
                "which direction each experimenter chooses to measure their particle along. Each has two options they pick between at random, which is what makes the test airtight.",
              glossaryId: "bells-theorem",
            },
            {
              symbol: "S",
              name: "the CHSH number",
              means:
                "one number combining all four angle pairings. Any universe where each particle already carried its answer is stuck at |S| ≤ 2. Real entangled particles reach 2.83 — and real experiments have measured it.",
              glossaryId: "bells-theorem",
            },
          ]}
        />
      </ControlSection>
    </div>
  );
}

function AngleSlider({
  label,
  spokenAs,
  value,
  onChange,
}: {
  /** The symbol printed on screen, e.g. "a′". */
  label: string;
  /** Who this angle belongs to, in words — appended invisibly to the label. */
  spokenAs: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <SimulatorSlider
      // Four sliders sit in this rail labelled only a, a′, b, b′. Focusing one
      // used to announce nothing but the letter: the ControlSection heading
      // that says whose angle it is ("Alice's two measurement settings") is a
      // section boundary, not part of the control's accessible name, so a
      // screen-reader user moving between sliders had no way to tell Alice's
      // from Bob's. The `sr-only` half joins the visible symbol inside the
      // same <label>, so the accessible name still contains the visible text.
      label={
        <>
          <span className="font-mono">{label}</span>
          <span className="sr-only"> — {spokenAs}</span>
        </>
      }
      value={value}
      min={-Math.PI}
      max={Math.PI}
      step={0.01}
      formatValue={(v) => `${Math.round((v * 180) / Math.PI)}°`}
      valueText={(v) => `${Math.round((v * 180) / Math.PI)} degrees`}
      onChange={onChange}
    />
  );
}
