"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { PRESETS, defaultParamValues, getPreset, type PresetDefinition, type PresetId } from "./presets";
import type { CanvasMode } from "./WavefunctionCanvas";
import { PresetControls } from "./PresetControls";
import { WavefunctionSimulation } from "./WavefunctionSimulation";
import { usePrefersReducedMotion } from "@/components/simulators/bloch-sphere/usePrefersReducedMotion";
import { SimulatorInstrument } from "../shared/SimulatorInstrument";
import { SimulatorFraming } from "../shared/Framing";
import { ControlSection, SymbolGloss } from "../shared/controls";

const URL_SYNC_DEBOUNCE_MS = 400;
const COPY_CONFIRMATION_MS = 1500;

/**
 * Plain-English glosses for the parameter symbols the presets expose, keyed by
 * `ParamSpec.key` so only the ones the *current* preset actually shows get
 * rendered — a reader adjusting the tunneling barrier shouldn't have to read
 * past a definition of ω. Keys with no entry (plain-language labels like
 * "Starting position" or "Barrier height") need no gloss and deliberately
 * have none.
 */
const PARAMETER_GLOSSES: Record<string, { symbol: string; name: string; means: string; glossaryId?: string }> = {
  width: {
    symbol: "σ",
    name: "packet width",
    means:
      "how spread out the particle starts. A narrow packet knows its position well and its momentum badly — that trade is Heisenberg's uncertainty principle, and you can watch it play out.",
    glossaryId: "heisenberg-uncertainty-principle",
  },
  momentum: {
    symbol: "p",
    name: "momentum",
    means: "which way the packet is launched, and how fast. Negative sends it left. It also fixes the packet's energy.",
  },
  n: {
    symbol: "n",
    name: "energy level",
    means:
      "which rung of the energy ladder this state sits on. n = 1 is the ground state; each step up adds one more bump to the wave.",
    glossaryId: "energy-eigenstate",
  },
  omega: {
    symbol: "ω",
    name: "angular frequency",
    means:
      "how steep the trapping well is. Steeper means a tighter, higher-energy ground state and wider spacing between the levels.",
    glossaryId: "quantum-harmonic-oscillator",
  },
  n2: {
    symbol: "n₂",
    name: "second energy level",
    means:
      "the upper of the two levels being superposed. The energy gap between them sets how fast the combined state beats back and forth.",
    glossaryId: "energy-eigenstate",
  },
  barrierHeight: {
    symbol: "V₀",
    name: "barrier height",
    means:
      "the energy wall the packet is thrown at. Classically nothing gets past a wall taller than its own energy — here some of it does anyway.",
    glossaryId: "quantum-tunneling",
  },
};

// Minimal shareable state is the configuration layer this component itself
// already isolates in its doc comment below: which preset, which parameter
// values, which view mode. The actual time-evolving simulation (psi, t,
// play/pause) is deliberately excluded — it's a running process, not a
// fixed point, so there's nothing meaningful to freeze into a URL for it;
// a shared link reproduces the same starting setup, not a paused frame.
// Params are prefixed (`wave_`) because this simulator shares `/simulators`
// with other URL-stateful simulators.
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isPresetId(value: string): value is PresetId {
  return PRESETS.some((p) => p.id === value);
}

/** Reads and validates `?wave_preset=&wave_params=&wave_mode=`. Null if the preset id is absent or unrecognized. */
function parseWavefunctionParams(
  params: { get(key: string): string | null }
): { presetId: PresetId; paramValues: Record<string, number>; mode: CanvasMode } | null {
  const rawPreset = params.get("wave_preset");
  if (rawPreset === null || !isPresetId(rawPreset)) return null;
  const preset: PresetDefinition = getPreset(rawPreset);

  let parsed: unknown = null;
  const rawParams = params.get("wave_params");
  if (rawParams !== null) {
    try {
      parsed = JSON.parse(rawParams);
    } catch {
      parsed = null;
    }
  }
  const source = typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : {};

  const paramValues = defaultParamValues(preset);
  for (const spec of preset.params) {
    const raw = source[spec.key];
    if (typeof raw === "number" && Number.isFinite(raw)) {
      paramValues[spec.key] = clamp(raw, spec.min, spec.max);
    }
  }

  const rawMode = params.get("wave_mode");
  const mode: CanvasMode = rawMode === "real-imaginary" || rawMode === "momentum" ? rawMode : "density";

  return { presetId: preset.id, paramValues, mode };
}

/**
 * The configuration layer: which preset, which parameter values, which
 * view mode. All of the actual time-evolving state (psi, t, play/pause)
 * lives in `WavefunctionSimulation`, mounted below with `key={configKey}`
 * — see that file's doc comment for why a remount, not an effect, is what
 * keeps a preset switch from ever rendering an old wavefunction next to a
 * new grid.
 */
export function WavefunctionExplorer({
  initialPresetId,
  showMeanSpreadOverlay = false,
}: {
  initialPresetId?: PresetId;
  /** Forwarded to WavefunctionCanvas via WavefunctionSimulation — see its doc comment. */
  showMeanSpreadOverlay?: boolean;
} = {}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const prefersReducedMotion = usePrefersReducedMotion();

  const initialPreset = getPreset(initialPresetId ?? "free-gaussian");
  const initialFromUrl = parseWavefunctionParams(searchParams);
  // presetId and paramValues are held as ONE state object, updated together
  // in a single setState call — never two separate calls a preset switch
  // would otherwise need to keep in sync. That atomicity is deliberate:
  // this pair drives `setup` and thus `WavefunctionSimulation`'s remount
  // key below, and there must be no render where one has updated and the
  // other hasn't (paramValues from the old preset paired with the new
  // preset's build function reads a wrong/missing key and corrupts psi0).
  const [config, setConfig] = useState<{ presetId: PresetId; paramValues: Record<string, number> }>(() =>
    initialFromUrl
      ? { presetId: initialFromUrl.presetId, paramValues: initialFromUrl.paramValues }
      : { presetId: initialPreset.id, paramValues: defaultParamValues(initialPreset) }
  );
  const { presetId, paramValues } = config;
  const preset = useMemo(() => getPreset(presetId), [presetId]);
  const [mode, setMode] = useState<CanvasMode>(() => initialFromUrl?.mode ?? "density");
  const [speed, setSpeed] = useState(1);
  const [copied, setCopied] = useState(false);

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const urlSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstUrlSync = useRef(true);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
      if (urlSyncTimeoutRef.current !== null) clearTimeout(urlSyncTimeoutRef.current);
    };
  }, []);

  // Keep the URL in sync with the settled configuration so the page is always
  // shareable. Debounced so a parameter slider drag doesn't spam
  // `history.replaceState` — only the value it settles on after a short pause
  // gets written. Skips the very first run so mounting doesn't immediately
  // rewrite the URL we just read from.
  useEffect(() => {
    if (isFirstUrlSync.current) {
      isFirstUrlSync.current = false;
      return;
    }
    if (urlSyncTimeoutRef.current !== null) clearTimeout(urlSyncTimeoutRef.current);
    urlSyncTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("wave_preset", presetId);
      params.set("wave_params", JSON.stringify(paramValues));
      params.set("wave_mode", mode);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, URL_SYNC_DEBOUNCE_MS);
    return () => {
      if (urlSyncTimeoutRef.current !== null) clearTimeout(urlSyncTimeoutRef.current);
    };
    // Deliberately depends only on the shareable state: `router`/`pathname` are
    // stable, and reading the rest of the query string fresh from
    // `window.location` (rather than depending on the `searchParams` hook)
    // avoids re-running this effect off of our own `replace` calls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetId, paramValues, mode]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (copyTimeoutRef.current !== null) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), COPY_CONFIRMATION_MS);
    } catch {
      // Clipboard access can be denied in some browser security contexts — no crash, no link copied.
    }
  }, []);

  const setup = useMemo(() => preset.build(paramValues), [preset, paramValues]);
  const configKey = preset.id + JSON.stringify(paramValues);

  function handlePresetChange(nextId: PresetId) {
    const nextPreset = getPreset(nextId);
    setConfig({ presetId: nextId, paramValues: defaultParamValues(nextPreset) });
  }

  function handleParamChange(key: string, value: number) {
    setConfig((prev) => ({ ...prev, paramValues: { ...prev.paramValues, [key]: value } }));
  }

  function handleResetParams() {
    setConfig((prev) => ({ ...prev, paramValues: defaultParamValues(preset) }));
  }

  return (
    <SimulatorInstrument
      label="Wavefunction — time-dependent Schrödinger equation"
      footnote="Next: the harmonic oscillator's energy ladder was derived algebraically with operators earlier in the course — here it's the same states as real wavefunctions."
      stageClassName="space-y-3"
      stage={
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <PresetToggle
              options={PRESETS}
              index={PRESETS.findIndex((p) => p.id === presetId)}
              onChange={(index) => handlePresetChange(PRESETS[index].id)}
              ariaLabel="Wavefunction presets"
            />
            <Button size="sm" variant="secondary" onClick={handleCopyLink}>
              {copied ? "Copied!" : "Copy link"}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            A quantum particle has no single position — it has a wave, and this solves the equation that
            wave really obeys, numerically, frame by frame. Nothing below is a scripted animation.
          </p>
          <p className="text-sm text-muted-foreground">{preset.description}</p>

          <div role="tablist" aria-label="View mode" className="flex w-fit max-w-full overflow-hidden rounded-full border border-border">
            {(
              [
                { id: "density", label: "|ψ(x)|²", hint: "Where it is: chance of finding the particle at each point." },
                { id: "real-imaginary", label: "Re / Im", hint: "The wave itself, both parts — this is what carries the phase." },
                { id: "momentum", label: "|φ(k)|²", hint: "How fast it's going: the same state, as a spread of momenta." },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                role="tab"
                aria-selected={mode === option.id}
                aria-label={`${option.label} — ${option.hint}`}
                title={option.hint}
                onClick={() => setMode(option.id)}
                className={
                  "min-h-11 px-4 py-1 text-xs font-medium transition-colors " +
                  (mode === option.id ? "bg-pillar text-brand-foreground" : "bg-surface text-muted-foreground hover:bg-surface-muted")
                }
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {mode === "density"
              ? "|ψ(x)|² — where it is. The height at each point is the chance of finding the particle there."
              : mode === "real-imaginary"
                ? "Re / Im — the wave itself. These two parts can be moving even when |ψ(x)|² sits perfectly still."
                : "|φ(k)|² — how fast it is going. The same state re-expressed as a spread of momenta rather than positions."}
          </p>

          <WavefunctionSimulation
            key={configKey}
            setup={setup}
            mode={mode}
            speed={speed}
            onSpeedChange={setSpeed}
            prefersReducedMotion={prefersReducedMotion}
            showMeanSpreadOverlay={showMeanSpreadOverlay}
          />

          <SimulatorFraming
            shows="A real numerical solution to the time-dependent Schrödinger equation — watch which states stay frozen in shape and which ones move, spread, or leak through barriers."
            watchFor="The norm readout below the plot should stay pinned at 1.0000 the whole time. That's the simulation proving it hasn't lost any of the particle to numerical error — the same check you'd run on real physics code."
            tryThis={
              <ul>
                <li>
                  Load Infinite Well — Ground State, confirm |ψ(x)|² never changes shape, then switch to
                  Superposition of Two Eigenstates and watch it visibly &quot;beat&quot; at a rate set by the
                  energy gap.
                </li>
                <li>
                  Tunneling loads with the packet&apos;s momentum-derived energy already below the barrier
                  height — confirm a small but nonzero probability still leaks through, then raise momentum
                  (or lower barrier height) until energy exceeds it and watch ordinary classical transmission
                  take over instead.
                </li>
              </ul>
            }
          />
        </>
      }
      controls={
        <div className="space-y-4">
          <ControlSection
            id="wave-params"
            title="Parameters"
            description="Every change rebuilds the starting state and restarts the evolution from t = 0."
          >
            <PresetControls params={preset.params} values={paramValues} onChange={handleParamChange} />
            <SymbolGloss
              items={preset.params
                .map((spec) => PARAMETER_GLOSSES[spec.key])
                .filter((gloss): gloss is (typeof PARAMETER_GLOSSES)[string] => gloss !== undefined)}
            />
          </ControlSection>
          <Button variant="secondary" size="sm" onClick={handleResetParams}>
            Reset parameters to default
          </Button>
        </div>
      }
    />
  );
}
