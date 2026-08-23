"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Complex } from "@/lib/quantum/complex";
import { ComplexPlaneCanvas } from "./ComplexPlaneCanvas";
import { AmplitudeControls } from "./AmplitudeControls";
import { StatePanel } from "./StatePanel";
import { TwoAmplitudeMode } from "./TwoAmplitudeMode";
import { AMPLITUDE_PRESETS } from "./presets";

type Mode = "single" | "two-amplitude";

const DEFAULT_RE = 1;
const DEFAULT_IM = 0;

/**
 * A single amplitude's real/imaginary parts and its magnitude/phase are
 * one number, two representations — this component keeps `re`/`im` as
 * the single source of truth and derives magnitude/phase from it on every
 * render, so the two control pairs in `AmplitudeControls` can never drift
 * out of sync with each other.
 */
export function ComplexAmplitudeExplorer() {
  const [mode, setMode] = useState<Mode>("single");
  const [re, setRe] = useState(DEFAULT_RE);
  const [im, setIm] = useState(DEFAULT_IM);

  const [alphaMagnitude, setAlphaMagnitude] = useState(Math.SQRT1_2);
  const [alphaPhase, setAlphaPhase] = useState(0);
  const [betaPhase, setBetaPhase] = useState(0);

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
    <div className="not-prose rounded-3xl border border-border bg-surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="radiogroup" aria-label="Explorer mode" className="flex overflow-hidden rounded-full border border-border">
          {(["single", "two-amplitude"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => setMode(m)}
              className={
                "px-3.5 py-1.5 text-sm font-medium transition-colors " +
                (mode === m ? "bg-brand text-brand-foreground" : "bg-surface text-muted-foreground hover:bg-surface-muted")
              }
            >
              {m === "single" ? "Single Amplitude" : "Two Amplitudes (α, β)"}
            </button>
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={reset}>
          Reset
        </Button>
      </div>

      {mode === "single" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
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
            onChange={(next) => {
              if (next.alphaMagnitude !== undefined) setAlphaMagnitude(next.alphaMagnitude);
              if (next.alphaPhase !== undefined) setAlphaPhase(next.alphaPhase);
              if (next.betaPhase !== undefined) setBetaPhase(next.betaPhase);
            }}
          />
        </div>
      )}

      <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
        <div>
          <Badge tone="brand" className="mb-1.5">
            Amplitude vs. probability
          </Badge>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">z</span> is the amplitude — a single complex
            number with both a size and a direction. Only <span className="font-medium text-foreground">|z|²</span>{" "}
            is ever a probability; the amplitude itself carries strictly more information than that one number.
          </p>
        </div>
        <div>
          <Badge tone="accent" className="mb-1.5">
            Why global phase doesn&rsquo;t matter
          </Badge>
          <p className="text-sm text-muted-foreground">
            Drag the phase slider alone (magnitude fixed) and watch |z|² in the state panel above —
            it never moves. Multiplying an amplitude by a phase factor rotates it but never rescales
            it, and probability only depends on the rescaling.
          </p>
        </div>
      </div>
    </div>
  );
}
