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
    <div className="flex flex-wrap items-center gap-3 rounded-panel border border-border bg-surface p-3">
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
      {/* Speed is rendered only when continuous play exists, because it only
          ever governs continuous play. `speed` is read in exactly one place —
          `WavefunctionSimulation`'s rAF loop, as
          `Math.round(setup.stepsPerFrame * speed)` — and that effect returns
          immediately when `prefersReducedMotion` is set. `handleStep`, the
          only thing left driving the simulation under reduced motion, calls
          `evolver.step` once and never looks at `speed`.
          So under reduced motion this was a live, focusable, draggable control
          wired to nothing: a reader could tab to it, hear "Speed, 1.00×,
          slider", drag it end to end, watch the readout change, and have
          altered precisely nothing about the simulation. A control that
          responds to input while doing nothing is worse than no control —
          it tells the reader the model is different when it is not.
          Hidden rather than `disabled` because the reduced-motion branch above
          already says why ("continuous play disabled"), and the speed of a
          thing that is not playing has no meaning left to disable. If the
          reader turns the OS setting off, `usePrefersReducedMotion` re-renders
          and the slider comes back with its state intact — `speed` lives in
          the parent, not here. */}
      {!prefersReducedMotion ? (
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
      ) : null}
    </div>
  );
}
