import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

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
      <label className="ml-auto flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Speed</span>
        <input
          type="range"
          min={0.25}
          max={3}
          step={0.25}
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          aria-label="Simulation speed"
          className="w-28 accent-[var(--brand)]"
        />
        <span className="w-10 font-mono text-xs text-muted-foreground">{speed.toFixed(2)}×</span>
      </label>
    </div>
  );
}
