import { SimulatorSlider } from "../shared/controls";

/**
 * Two synced control pairs — real/imaginary and magnitude/phase — driving
 * the same underlying complex number. Moving either pair updates the
 * other, so a student can manipulate whichever representation they're
 * currently thinking in.
 */
export function AmplitudeControls({
  re,
  im,
  onChange,
  disabled,
}: {
  re: number;
  im: number;
  onChange: (re: number, im: number) => void;
  disabled?: boolean;
}) {
  const magnitude = Math.hypot(re, im);
  const phase = Math.atan2(im, re);
  const phaseDeg = (phase * 180) / Math.PI;

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <SimulatorSlider
          label="Real part (a)"
          min={-1.5}
          max={1.5}
          step={0.01}
          value={re}
          formatValue={(v) => v.toFixed(2)}
          onChange={(v) => onChange(v, im)}
          disabled={disabled}
        />
        <SimulatorSlider
          label="Imaginary part (b)"
          min={-1.5}
          max={1.5}
          step={0.01}
          value={im}
          formatValue={(v) => v.toFixed(2)}
          onChange={(v) => onChange(re, v)}
          disabled={disabled}
        />
      </div>
      <div className="space-y-4 border-t border-border pt-4">
        <SimulatorSlider
          label="Magnitude |z|"
          min={0}
          max={1.5}
          step={0.01}
          value={magnitude}
          formatValue={(v) => v.toFixed(2)}
          onChange={(newMagnitude) => onChange(newMagnitude * Math.cos(phase), newMagnitude * Math.sin(phase))}
          disabled={disabled}
        />
        <SimulatorSlider
          label="Phase"
          min={-180}
          max={180}
          step={1}
          value={phaseDeg}
          formatValue={(v) => `${v.toFixed(0)}°`}
          valueText={(v) => `${v.toFixed(0)} degrees`}
          onChange={(newPhaseDeg) => {
            const newPhase = (newPhaseDeg * Math.PI) / 180;
            onChange(magnitude * Math.cos(newPhase), magnitude * Math.sin(newPhase));
          }}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
