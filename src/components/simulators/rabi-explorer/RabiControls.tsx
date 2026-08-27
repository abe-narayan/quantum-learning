import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FrameSlider } from "@/components/visualizations/FrameSlider";
import { ControlSection, SimulatorSlider, SymbolGloss } from "../shared/controls";

/**
 * This instrument is linked directly from the homepage (`HardwareSection.tsx`)
 * — a reader can land here having never met "detuning" or "drive strength" in
 * a lesson. `docs/BEGINNER_REVIEW.md` flagged exactly that: Δ and V appeared
 * as bare symbols on the sliders and in the KaTeX readouts with nothing on the
 * page that said what they were. Every symbol this panel exposes is therefore
 * glossed in plain words right under the control that uses it.
 */
export function RabiControls({
  driveStrength,
  onDriveStrengthChange,
  detuning,
  onDetuningChange,
  sampleIndex,
  maxSampleIndex,
  currentTLabel,
  onSampleIndexChange,
  isPlaying,
  onTogglePlay,
  onReset,
  prefersReducedMotion,
}: {
  driveStrength: number;
  onDriveStrengthChange: (v: number) => void;
  detuning: number;
  onDetuningChange: (d: number) => void;
  sampleIndex: number;
  maxSampleIndex: number;
  currentTLabel: string;
  onSampleIndexChange: (i: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  prefersReducedMotion: boolean;
}) {
  return (
    <div className="space-y-8">
      <ControlSection
        id="rabi-drive"
        title="Drive strength V"
        description="How hard you are pushing the qubit — the amplitude of the microwave or laser pulse aimed at it."
      >
        <SimulatorSlider
          label="V (drive strength)"
          value={driveStrength}
          min={0.2}
          max={3}
          step={0.05}
          formatValue={(v) => v.toFixed(2)}
          valueText={(v) => `Drive strength ${v.toFixed(2)}, in units where one full 0 to 1 transfer takes time pi over 2V`}
          onChange={onDriveStrengthChange}
        />
        <SymbolGloss
          items={[
            {
              symbol: "V",
              name: "drive strength",
              means:
                "how strongly the control pulse couples the qubit's two levels. Turn it up and the qubit flips between 0 and 1 faster; it never changes how much population can transfer.",
              glossaryId: "rabi-oscillation",
            },
          ]}
        />
      </ControlSection>

      <ControlSection
        id="rabi-detuning"
        title="Detuning Δ"
        description="How far off the qubit's own frequency your drive is tuned. Zero means you hit it exactly."
      >
        <SimulatorSlider
          label="Δ (detuning)"
          value={detuning}
          min={-4}
          max={4}
          step={0.1}
          formatValue={(v) => v.toFixed(2)}
          valueText={(v) =>
            v === 0
              ? "Detuning zero — the drive is exactly on resonance"
              : `Detuning ${v.toFixed(2)}, ${v > 0 ? "above" : "below"} the qubit's transition frequency`
          }
          onChange={onDetuningChange}
        />
        <SymbolGloss
          items={[
            {
              symbol: "Δ",
              name: "detuning",
              means:
                "the gap between your drive's frequency and the qubit's own 0→1 transition frequency. Δ = 0 is a perfectly tuned drive; the further from 0, the less of the qubit ever makes it to |1⟩, no matter how long you wait.",
              glossaryId: "detuning",
            },
            {
              symbol: "Ω",
              name: "effective Rabi frequency",
              means:
                "the rate the qubit actually cycles between 0 and 1 once both effects are combined: √(Δ² + 4V²). It is read out live under the plots.",
              glossaryId: "rabi-oscillation",
            },
          ]}
        />
      </ControlSection>

      <ControlSection
        id="rabi-time"
        title="Time"
        description="Scrub through the computed trajectory, or press Play to watch it run."
      >
        <FrameSlider
          label="Time"
          valueLabel={currentTLabel}
          index={sampleIndex}
          max={maxSampleIndex}
          onChange={onSampleIndexChange}
          boxed={false}
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {prefersReducedMotion ? (
            <Badge tone="neutral">Reduced motion — drag the slider above to scrub</Badge>
          ) : (
            <Button variant="primary" size="sm" onClick={onTogglePlay}>
              {isPlaying ? "Pause" : "Play"}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onReset}>
            Reset
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Reset returns V and Δ to their defaults and rewinds to the opening frame.
        </p>
      </ControlSection>
    </div>
  );
}
