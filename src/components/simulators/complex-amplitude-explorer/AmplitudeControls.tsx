function SliderRow({
  label,
  min,
  max,
  step,
  value,
  onChange,
  disabled,
  formatValue,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  formatValue?: (value: number) => string;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground">{label}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {formatValue ? formatValue(value) : value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={label}
        className="mt-1.5 w-full accent-brand disabled:opacity-50"
      />
    </label>
  );
}

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
      <div className="space-y-3">
        <SliderRow label="Real part (a)" min={-1.5} max={1.5} step={0.01} value={re} onChange={(v) => onChange(v, im)} disabled={disabled} />
        <SliderRow label="Imaginary part (b)" min={-1.5} max={1.5} step={0.01} value={im} onChange={(v) => onChange(re, v)} disabled={disabled} />
      </div>
      <div className="space-y-3 border-t border-border pt-4">
        <SliderRow
          label="Magnitude |z|"
          min={0}
          max={1.5}
          step={0.01}
          value={magnitude}
          onChange={(newMagnitude) => onChange(newMagnitude * Math.cos(phase), newMagnitude * Math.sin(phase))}
          disabled={disabled}
        />
        <SliderRow
          label="Phase"
          min={-180}
          max={180}
          step={1}
          value={phaseDeg}
          formatValue={(v) => `${v.toFixed(0)}°`}
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
