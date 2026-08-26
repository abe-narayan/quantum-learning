import type { ParamSpec } from "./presets";
import { SimulatorSlider } from "../shared/controls";

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
    <div className="space-y-4">
      {params.map((spec) => (
        <SimulatorSlider
          key={spec.key}
          label={spec.label}
          value={values[spec.key] ?? spec.default}
          min={spec.min}
          max={spec.max}
          step={spec.step}
          disabled={disabled}
          formatValue={(v) => `${v.toFixed(spec.step < 1 ? 2 : 0)}${spec.unit ?? ""}`}
          onChange={(v) => onChange(spec.key, v)}
        />
      ))}
    </div>
  );
}
