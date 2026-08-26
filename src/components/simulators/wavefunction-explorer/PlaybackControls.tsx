import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SimulatorSlider } from "../shared/controls";

export function PlaybackControls({
  isPlaying,
  onTogglePlay,
  onStep,
  onReset,
  speed,
  onSpeedChange,
  prefersReducedMotion,
}: {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStep: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  prefersReducedMotion: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-3">
      {prefersReducedMotion ? (
        <>
          <Badge tone="neutral">Reduced motion — continuous play disabled</Badge>
          <Button variant="secondary" size="sm" onClick={onStep}>
            Step forward
          </Button>
        </>
      ) : (
        <Button variant="primary" size="sm" onClick={onTogglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
      )}
      {!prefersReducedMotion ? (
        <Button variant="secondary" size="sm" onClick={onStep} disabled={isPlaying}>
          Step
        </Button>
      ) : null}
      <Button variant="ghost" size="sm" onClick={onReset}>
        Reset
      </Button>
      <SimulatorSlider
        className="ml-auto w-40"
        label="Speed"
        value={speed}
        min={0.25}
        max={3}
        step={0.25}
        formatValue={(v) => `${v.toFixed(2)}×`}
        onChange={onSpeedChange}
      />
    </div>
  );
}
