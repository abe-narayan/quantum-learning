import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FrameSlider } from "@/components/visualizations/FrameSlider";
import { ControlSection, SimulatorSlider } from "../shared/controls";

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
      <ControlSection id="rabi-drive" title="Coupling strength V" description="The resonant Rabi frequency (Δ=0 gives P(1)=sin²(Vt)).">
        <SimulatorSlider
          label="V"
          value={driveStrength}
          min={0.2}
          max={3}
          step={0.05}
          formatValue={(v) => v.toFixed(2)}
          onChange={onDriveStrengthChange}
        />
      </ControlSection>

      <ControlSection
        id="rabi-detuning"
        title="Detuning Δ = E_f − E_i"
        description="How far the drive is from resonance. Larger |Δ| caps how much population ever transfers."
      >
        <SimulatorSlider
          label="Δ"
          value={detuning}
          min={-4}
          max={4}
          step={0.1}
          formatValue={(v) => v.toFixed(2)}
          onChange={onDetuningChange}
        />
      </ControlSection>

      <section aria-label="Time">
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
      </section>
    </div>
  );
}
