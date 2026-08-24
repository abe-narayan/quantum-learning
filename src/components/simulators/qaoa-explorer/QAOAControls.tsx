import { cn } from "@/lib/utils";
import { QAOA_GRAPH_PRESETS } from "./presets";

export function QAOAControls({
  presetId,
  onPresetChange,
  gamma,
  onGammaChange,
  beta,
  onBetaChange,
}: {
  presetId: string;
  onPresetChange: (id: string) => void;
  gamma: number;
  onGammaChange: (v: number) => void;
  beta: number;
  onBetaChange: (v: number) => void;
}) {
  return (
    <div className="space-y-8">
      <section aria-labelledby="qaoa-graph-heading">
        <h3 id="qaoa-graph-heading" className="text-sm font-semibold text-foreground">
          Graph
        </h3>
        <div role="radiogroup" aria-label="Graph preset" className="mt-3 flex flex-col gap-1.5">
          {QAOA_GRAPH_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              role="radio"
              aria-checked={presetId === preset.id}
              onClick={() => onPresetChange(preset.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-left text-sm font-medium transition-colors",
                presetId === preset.id
                  ? "bg-brand text-brand-foreground"
                  : "bg-surface text-muted-foreground hover:bg-surface-muted"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="qaoa-gamma-heading">
        <h3 id="qaoa-gamma-heading" className="text-sm font-semibold text-foreground">
          Cost angle γ
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">Controls the phase e^(-iγ·cut count) applied by the cost unitary.</p>
        <input
          type="range"
          min={0}
          max={2 * Math.PI}
          step={0.01}
          value={gamma}
          onChange={(e) => onGammaChange(Number(e.target.value))}
          className="mt-3 w-full accent-brand"
          aria-label="Cost angle gamma"
        />
        <p className="mt-1 font-mono text-xs text-muted-foreground">γ = {gamma.toFixed(2)}</p>
      </section>

      <section aria-labelledby="qaoa-beta-heading">
        <h3 id="qaoa-beta-heading" className="text-sm font-semibold text-foreground">
          Mixer angle β
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">Controls the Rx(2β) rotation applied to every qubit by the mixer unitary.</p>
        <input
          type="range"
          min={0}
          max={Math.PI}
          step={0.01}
          value={beta}
          onChange={(e) => onBetaChange(Number(e.target.value))}
          className="mt-3 w-full accent-accent"
          aria-label="Mixer angle beta"
        />
        <p className="mt-1 font-mono text-xs text-muted-foreground">β = {beta.toFixed(2)}</p>
      </section>
    </div>
  );
}
