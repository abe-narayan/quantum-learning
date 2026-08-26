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

const URL_SYNC_DEBOUNCE_MS = 400;
const COPY_CONFIRMATION_MS = 1500;

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
    <div className="not-prose space-y-4">
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">What we&apos;re studying: </span>
        A real numerical solution to the time-dependent Schrödinger equation — watch which states stay frozen
        in shape and which ones move, spread, or leak through barriers.
      </p>

      <div className="rounded-3xl border border-border bg-surface p-6">
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
              showMeanSpreadOverlay={showMeanSpreadOverlay}
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

      <div className="space-y-1 text-sm text-muted-foreground">
        <p>
          <span className="font-semibold text-foreground">Try this: </span>
          Load Infinite Well — Ground State, confirm |ψ(x)|² never changes shape, then switch to Superposition
          of Two Eigenstates and watch it visibly &quot;beat&quot; at a rate set by the energy gap.
        </p>
        <p>
          Tunneling loads with the packet&apos;s momentum-derived energy already below the barrier height —
          confirm a small but nonzero probability still leaks through, then raise momentum (or lower barrier
          height) until energy exceeds it and watch ordinary classical transmission take over instead.
        </p>
      </div>

      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">What&apos;s next: </span>
        The harmonic oscillator&apos;s energy ladder was derived algebraically with operators earlier in the
        course — here it&apos;s the same states as real wavefunctions.
      </p>
    </div>
  );
}
