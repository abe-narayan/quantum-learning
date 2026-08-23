"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { PRESETS, defaultParamValues, type PresetId } from "./presets";
import type { CanvasMode } from "./WavefunctionCanvas";
import { PresetControls } from "./PresetControls";
import { WavefunctionSimulation } from "./WavefunctionSimulation";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * The configuration layer: which preset, which parameter values, which
 * view mode. All of the actual time-evolving state (psi, t, play/pause)
 * lives in `WavefunctionSimulation`, mounted below with `key={configKey}`
 * — see that file's doc comment for why a remount, not an effect, is what
 * keeps a preset switch from ever rendering an old wavefunction next to a
 * new grid.
 */
export function WavefunctionExplorer() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const initialPreset = PRESETS.find((p) => p.id === "free-gaussian")!;
  // presetId and paramValues are held as ONE state object, updated together
  // in a single setState call — never two separate calls a preset switch
  // would otherwise need to keep in sync. That atomicity is deliberate:
  // this pair drives `setup` and thus `WavefunctionSimulation`'s remount
  // key below, and there must be no render where one has updated and the
  // other hasn't (paramValues from the old preset paired with the new
  // preset's build function reads a wrong/missing key and corrupts psi0).
  const [config, setConfig] = useState<{ presetId: PresetId; paramValues: Record<string, number> }>({
    presetId: initialPreset.id,
    paramValues: defaultParamValues(initialPreset),
  });
  const { presetId, paramValues } = config;
  const preset = useMemo(() => PRESETS.find((p) => p.id === presetId)!, [presetId]);
  const [mode, setMode] = useState<CanvasMode>("density");
  const [speed, setSpeed] = useState(1);

  const setup = useMemo(() => preset.build(paramValues), [preset, paramValues]);
  const configKey = preset.id + JSON.stringify(paramValues);

  function handlePresetChange(nextId: PresetId) {
    const nextPreset = PRESETS.find((p) => p.id === nextId)!;
    setConfig({ presetId: nextId, paramValues: defaultParamValues(nextPreset) });
  }

  function handleParamChange(key: string, value: number) {
    setConfig((prev) => ({ ...prev, paramValues: { ...prev.paramValues, [key]: value } }));
  }

  function handleResetParams() {
    setConfig((prev) => ({ ...prev, paramValues: defaultParamValues(preset) }));
  }

  return (
    <div className="not-prose rounded-3xl border border-border bg-surface p-6">
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handlePresetChange(p.id)}
            className={
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors " +
              (p.id === presetId ? "bg-brand text-brand-foreground" : "border border-border bg-surface text-muted-foreground hover:bg-surface-muted")
            }
          >
            {p.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{preset.description}</p>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-3">
          <div role="tablist" aria-label="View mode" className="flex overflow-hidden rounded-full border border-border w-fit">
            {(
              [
                { id: "density", label: "|ψ(x)|²" },
                { id: "real-imaginary", label: "Re / Im" },
                { id: "momentum", label: "|φ(k)|²" },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={mode === option.id}
                onClick={() => setMode(option.id)}
                className={
                  "px-3 py-1 text-xs font-medium transition-colors " +
                  (mode === option.id ? "bg-brand text-brand-foreground" : "bg-surface text-muted-foreground hover:bg-surface-muted")
                }
              >
                {option.label}
              </button>
            ))}
          </div>

          <WavefunctionSimulation
            key={configKey}
            setup={setup}
            mode={mode}
            speed={speed}
            onSpeedChange={setSpeed}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Parameters</p>
            <div className="mt-2">
              <PresetControls params={preset.params} values={paramValues} onChange={handleParamChange} />
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={handleResetParams}>
            Reset parameters to default
          </Button>
        </div>
      </div>
    </div>
  );
}
