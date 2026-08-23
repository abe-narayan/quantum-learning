import type { ParamSpec } from "./presets";

function SliderRow({ spec, value, onChange, disabled }: { spec: ParamSpec; value: number; onChange: (value: number) => void; disabled?: boolean }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground">{spec.label}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {value.toFixed(spec.step < 1 ? 2 : 0)}
          {spec.unit ?? ""}
        </span>
      </div>
      <input
        type="range"
        min={spec.min}
        max={spec.max}
        step={spec.step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={spec.label}
        className="mt-1.5 w-full accent-[var(--brand)] disabled:opacity-50"
      />
    </label>
  );
}

/** Renders one slider per parameter the current preset exposes — schema-driven, so adding a preset never means writing a new controls component. */
export function PresetControls({
  params,
  values,
  onChange,
  disabled,
}: {
  params: ParamSpec[];
  values: Record<string, number>;
  onChange: (key: string, value: number) => void;
  disabled?: boolean;
}) {
  if (params.length === 0) return null;
  return (
    <div className="space-y-3">
      {params.map((spec) => (
        <SliderRow key={spec.key} spec={spec} value={values[spec.key] ?? spec.default} onChange={(v) => onChange(spec.key, v)} disabled={disabled} />
      ))}
    </div>
  );
}
