import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FrameSlider } from "@/components/visualizations/FrameSlider";

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
      <section aria-labelledby="rabi-drive-heading">
        <h3 id="rabi-drive-heading" className="text-sm font-semibold text-foreground">
          Coupling strength V
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          The resonant Rabi frequency (Δ=0 gives P(1)=sin²(Vt)).
        </p>
        <input
          type="range"
          min={0.2}
          max={3}
          step={0.05}
          value={driveStrength}
          onChange={(e) => onDriveStrengthChange(Number(e.target.value))}
          className="mt-3 w-full accent-brand"
          aria-label="Coupling strength V"
        />
        <p className="mt-1 font-mono text-xs text-muted-foreground">V = {driveStrength.toFixed(2)}</p>
      </section>

      <section aria-labelledby="rabi-detuning-heading">
        <h3 id="rabi-detuning-heading" className="text-sm font-semibold text-foreground">
          Detuning Δ = E_f − E_i
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          How far the drive is from resonance. Larger |Δ| caps how much population ever transfers.
        </p>
        <input
          type="range"
          min={-4}
          max={4}
          step={0.1}
          value={detuning}
          onChange={(e) => onDetuningChange(Number(e.target.value))}
          className="mt-3 w-full accent-brand"
          aria-label="Detuning Δ"
        />
        <p className="mt-1 font-mono text-xs text-muted-foreground">Δ = {detuning.toFixed(2)}</p>
      </section>

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
