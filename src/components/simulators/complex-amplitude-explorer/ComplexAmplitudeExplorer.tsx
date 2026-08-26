"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { Complex } from "@/lib/quantum/complex";
import { ComplexPlaneCanvas } from "./ComplexPlaneCanvas";
import { AmplitudeControls } from "./AmplitudeControls";
import { StatePanel } from "./StatePanel";
import { TwoAmplitudeMode, type TwoAmplitudeVariant } from "./TwoAmplitudeMode";
import { AMPLITUDE_PRESETS } from "./presets";
import { SimulatorInstrument } from "../shared/SimulatorInstrument";
import { SimulatorFraming } from "../shared/Framing";

type Mode = "single" | "two-amplitude";

const DEFAULT_RE = 1;
const DEFAULT_IM = 0;
const DEFAULT_ALPHA_MAGNITUDE = Math.SQRT1_2;
const DEFAULT_BETA_PHASE = 0;
const RE_IM_BOUND = 1.5;
const URL_SYNC_DEBOUNCE_MS = 400;
const COPY_CONFIRMATION_MS = 1500;

// Minimal shareable state is the mode plus that mode's amplitude value(s):
// (re, im) for single mode, or (alphaMagnitude, alphaPhase, betaPhase) for
// two-amplitude mode. `amp_aphase` is optional on read (defaulting to 0) so
// links shared before the `"global-vs-relative"` variant's γ control existed
// — the only control that ever moves alphaPhase away from 0 — still parse
// exactly as before. Both slices are read and written together regardless of
// which mode is active, so switching modes after loading a shared link
// doesn't lose the other slice's restored value. Params are prefixed
// (`amp_`) because this simulator shares `/simulators` with other
// URL-stateful simulators.
function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Reads and validates `?amp_re=&amp_im=`. Null if either is absent or malformed. */
function parseSingleAmplitude(params: { get(key: string): string | null }): { re: number; im: number } | null {
  const rawRe = params.get("amp_re");
  const rawIm = params.get("amp_im");
  if (rawRe === null || rawIm === null) return null;
  const re = Number(rawRe);
  const im = Number(rawIm);
  if (!Number.isFinite(re) || !Number.isFinite(im)) return null;
  return { re: clamp(re, -RE_IM_BOUND, RE_IM_BOUND), im: clamp(im, -RE_IM_BOUND, RE_IM_BOUND) };
}

/**
 * Reads and validates `?amp_mag=&amp_bphase=` (required) and `?amp_aphase=`
 * (optional, defaulting to 0 — see the shareable-state comment above). Null
 * if either required param is absent or malformed.
 */
function parseTwoAmplitude(params: {
  get(key: string): string | null;
}): { alphaMagnitude: number; alphaPhase: number; betaPhase: number } | null {
  const rawMag = params.get("amp_mag");
  const rawPhase = params.get("amp_bphase");
  if (rawMag === null || rawPhase === null) return null;
  const mag = Number(rawMag);
  const phase = Number(rawPhase);
  if (!Number.isFinite(mag) || !Number.isFinite(phase)) return null;

  const rawAlphaPhase = params.get("amp_aphase");
  const alphaPhase = rawAlphaPhase === null ? 0 : Number(rawAlphaPhase);

  return {
    alphaMagnitude: clamp(mag, 0, 1),
    alphaPhase: Number.isFinite(alphaPhase) ? clamp(alphaPhase, -Math.PI, Math.PI) : 0,
    betaPhase: clamp(phase, -Math.PI, Math.PI),
  };
}

/**
 * A single amplitude's real/imaginary parts and its magnitude/phase are
 * one number, two representations — this component keeps `re`/`im` as
 * the single source of truth and derives magnitude/phase from it on every
 * render, so the two control pairs in `AmplitudeControls` can never drift
 * out of sync with each other.
 */
export function ComplexAmplitudeExplorer({
  twoAmplitudeVariant = "double-slit",
}: {
  /**
   * Which reading the "two amplitudes" mode's bottom comparison panel
   * shows — see `TwoAmplitudeMode` for the physics. Defaults to the
   * unbounded double-slit `|α+β|²` reading the majority of lessons
   * embedding this explorer rely on; `superposition-interference-and-
   * phase.mdx` opts into `"basis-change"` instead, since it derives the
   * normalized P(+) = |⟨+|ψ⟩|² directly from the Born rule and needs the
   * widget to display that same bounded quantity; `global-and-relative-
   * phase.mdx` opts into `"global-vs-relative"` to add the γ slider and
   * show that global phase leaves the cross-term (and both probabilities)
   * untouched.
   */
  twoAmplitudeVariant?: TwoAmplitudeVariant;
} = {}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const initialSingle = parseSingleAmplitude(searchParams);
  const initialTwo = parseTwoAmplitude(searchParams);

  const [mode, setMode] = useState<Mode>(() => (searchParams.get("amp_mode") === "two" ? "two-amplitude" : "single"));
  const [re, setRe] = useState(() => initialSingle?.re ?? DEFAULT_RE);
  const [im, setIm] = useState(() => initialSingle?.im ?? DEFAULT_IM);

  const [alphaMagnitude, setAlphaMagnitude] = useState(() => initialTwo?.alphaMagnitude ?? DEFAULT_ALPHA_MAGNITUDE);
  const [alphaPhase, setAlphaPhase] = useState(() => initialTwo?.alphaPhase ?? 0);
  const [betaPhase, setBetaPhase] = useState(() => initialTwo?.betaPhase ?? DEFAULT_BETA_PHASE);
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

  // Keep the URL in sync with the settled state so the page is always shareable.
  // Debounced so a slider drag doesn't spam `history.replaceState` — only the
  // value it settles on after a short pause gets written. Skips the very first
  // run so mounting doesn't immediately rewrite the URL we just read from.
  useEffect(() => {
    if (isFirstUrlSync.current) {
      isFirstUrlSync.current = false;
      return;
    }
    if (urlSyncTimeoutRef.current !== null) clearTimeout(urlSyncTimeoutRef.current);
    urlSyncTimeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("amp_mode", mode === "two-amplitude" ? "two" : "single");
      params.set("amp_re", re.toFixed(3));
      params.set("amp_im", im.toFixed(3));
      params.set("amp_mag", alphaMagnitude.toFixed(3));
      params.set("amp_aphase", alphaPhase.toFixed(3));
      params.set("amp_bphase", betaPhase.toFixed(3));
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
  }, [mode, re, im, alphaMagnitude, alphaPhase, betaPhase]);

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

  function applyPreset(presetRe: number, presetIm: number) {
    setRe(presetRe);
    setIm(presetIm);
  }

  function reset() {
    if (mode === "single") {
      setRe(DEFAULT_RE);
      setIm(DEFAULT_IM);
    } else {
      setAlphaMagnitude(Math.SQRT1_2);
      setAlphaPhase(0);
      setBetaPhase(0);
    }
  }

  return (
    <SimulatorInstrument
      label="Complex plane — amplitude"
      footnote="An amplitude is a complex number, not a probability — only |z|² is ever a probability."
      // `@container`: this simulator has no `controls` prop — the
      // "single amplitude" mode below hand-rolls its own stage/controls
      // split (same 320px rail idea as SimulatorInstrument itself) rather
      // than using the shared one, so it needs the same container-query
      // fix applied here directly. See SimulatorInstrument.tsx.
      stageClassName="@container"
      stage={
        <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PresetToggle
          options={[{ label: "Single Amplitude" }, { label: "Two Amplitudes (α, β)" }]}
          index={mode === "single" ? 0 : 1}
          onChange={(index) => setMode(index === 0 ? "single" : "two-amplitude")}
          ariaLabel="Explorer mode"
        />
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopyLink}>
            {copied ? "Copied!" : "Copy link"}
          </Button>
          <Button variant="secondary" size="sm" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>

      {mode === "single" ? (
        // `@min-[42rem]:` (container query on the stage above, not `lg:`
        // viewport) — matches SimulatorInstrument's own split threshold, so
        // this hand-rolled rail collapses on the same logic the shared one
        // does instead of opening inside a reading column too narrow for it.
        <div className="mt-6 grid gap-6 @min-[42rem]:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div className="flex justify-center">
              <ComplexPlaneCanvas re={re} im={im} />
            </div>
            <StatePanel z={new Complex(re, im)} />
          </div>
          <div className="space-y-6">
            <AmplitudeControls re={re} im={im} onChange={(nextRe, nextIm) => { setRe(nextRe); setIm(nextIm); }} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Presets</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {AMPLITUDE_PRESETS.map((preset) => (
                  <Button key={preset.id} variant="secondary" size="sm" onClick={() => applyPreset(preset.re, preset.im)}>
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <TwoAmplitudeMode
            alphaMagnitude={alphaMagnitude}
            alphaPhase={alphaPhase}
            betaPhase={betaPhase}
            variant={twoAmplitudeVariant}
            onChange={(next) => {
              if (next.alphaMagnitude !== undefined) setAlphaMagnitude(next.alphaMagnitude);
              if (next.alphaPhase !== undefined) setAlphaPhase(next.alphaPhase);
              if (next.betaPhase !== undefined) setBetaPhase(next.betaPhase);
            }}
          />
        </div>
      )}

      <SimulatorFraming
        shows={
          <>
            <span className="font-medium text-foreground">z</span> is the amplitude — a single complex number
            with both a size and a direction. Only <span className="font-medium text-foreground">|z|²</span> is
            ever a probability; the amplitude itself carries strictly more information than that one number.
          </>
        }
        watchFor={
          <>
            Drag the phase slider alone (magnitude fixed) and watch |z|² in the state panel — it never moves.
            Interference lives entirely in relative phase: flip β&rsquo;s phase by 180° and two amplitudes
            that used to add now cancel.
          </>
        }
        tryThis={
          <ul>
            <li>
              Switch to Two Amplitudes, set both magnitudes equal, then slide β&rsquo;s phase from 0° to
              180° — watch total probability swing between constructive and destructive interference.
            </li>
            <li>In single mode, drag only the phase slider and confirm |z|² in the panel never moves.</li>
          </ul>
        }
      />
        </>
      }
    />
  );
}
