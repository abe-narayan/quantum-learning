import { PresetToggle } from "@/components/visualizations/PresetToggle";
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
        <PresetToggle
          options={QAOA_GRAPH_PRESETS}
          index={QAOA_GRAPH_PRESETS.findIndex((p) => p.id === presetId)}
          onChange={(i) => onPresetChange(QAOA_GRAPH_PRESETS[i].id)}
          ariaLabel="Graph preset"
        />
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
