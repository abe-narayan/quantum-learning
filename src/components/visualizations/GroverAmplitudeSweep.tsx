"use client";

/**
 * MDX usage (`grovers-algorithm-amplitude-amplification.mdx`,
 * `grovers-algorithm-oracle-and-diffusion.mdx`, and the Apex lessons that
 * cite Grover's query complexity):
 *
 *   <GroverAmplitudeSweep
 *     n={3}
 *     markedIndices={[5]}
 *     ariaLabel="Grover amplitude amplification over iterations, showing the marked state's probability rise past 96% then fall back down."
 *   />
 *
 * Steps through real Grover iterations computed by `@/lib/quantum/grover.ts`
 * (`runGrover`, `optimalGroverIterations`) — never a closed-form
 * re-derivation — showing every basis state's actual Born-rule probability
 * as amplitude amplification proceeds. Deliberately runs a few iterations
 * *past* the library's own optimal count so the marked bar's rise and its
 * over-rotation back down are both visible in the same control: Grover's
 * algorithm does not just get better with more iterations, it has one best
 * stopping point and gets *worse* past it, which is easy to state and easy
 * to miss without watching it happen.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { runGrover, optimalGroverIterations } from "@/lib/quantum/grover";
import { measurementDistribution } from "@/lib/quantum/measurement";
import { BarChart, type BarChartEntry } from "./BarChart";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";

const STEP_INTERVAL_MS = 700;

export function GroverAmplitudeSweep({
  n = 3,
  markedIndices = [5],
  maxIterations,
  ariaLabel,
}: {
  /** Number of qubits searched over; N = 2^n basis states are all drawn as bars, so keep this small (3–4). */
  n?: number;
  markedIndices?: number[];
  /** Iterations to sweep through; defaults to twice the library's own optimal count plus a couple more, so over-rotation is clearly visible. */
  maxIterations?: number;
  ariaLabel: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const optimal = useMemo(() => optimalGroverIterations(n, markedIndices.length), [n, markedIndices.length]);
  const upperBound = maxIterations ?? optimal * 2 + 2;

  const [k, setK] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setK((current) => {
        if (current >= upperBound) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, STEP_INTERVAL_MS);
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
    };
  }, [playing, upperBound]);

  const distribution = useMemo(() => {
    const state = runGrover(n, markedIndices, k);
    return measurementDistribution(state);
  }, [n, markedIndices, k]);

  const markedSet = useMemo(() => new Set(markedIndices), [markedIndices]);
  const bars: BarChartEntry[] = distribution.map((outcome) => ({
    label: `|${outcome.label}⟩`,
    value: outcome.probability,
    caption: outcome.probability.toFixed(2),
    highlight: markedSet.has(outcome.index),
  }));

  const markedProbability = distribution.filter((o) => markedSet.has(o.index)).reduce((sum, o) => sum + o.probability, 0);

  const phase = k === 0 ? "Uniform superposition, before any iteration." : k < optimal ? "Rising toward the optimum." : k === optimal ? "At the library's optimal iteration count — the peak." : "Past the optimum — over-rotating back down.";

  const handlePlayPause = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (k >= upperBound) setK(0);
    setPlaying(true);
  };

  const handleStep = (delta: number) => {
    setPlaying(false);
    setK((current) => Math.max(0, Math.min(upperBound, current + delta)));
  };

  return (
    <div className="not-prose space-y-3">
      <BarChart
        bars={bars}
        ariaLabel={`${ariaLabel} k=${k} iterations. Marked-state probability ${markedProbability.toFixed(3)}. ${phase}`}
        maxValue={1}
      />

      <div className="flex flex-wrap items-center gap-2 panel-inset p-3">
        <button
          type="button"
          onClick={() => handleStep(-1)}
          disabled={k === 0}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="One fewer iteration"
        >
          ← k
        </button>
        {!prefersReducedMotion && (
          <button
            type="button"
            onClick={handlePlayPause}
            className="rounded-md border border-brand bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={playing ? "Pause" : "Play through every iteration"}
          >
            {playing ? "Pause" : k >= upperBound ? "Replay" : "Play"}
          </button>
        )}
        <button
          type="button"
          onClick={() => handleStep(1)}
          disabled={k >= upperBound}
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label="One more iteration"
        >
          k →
        </button>
        <input
          type="range"
          min={0}
          max={upperBound}
          step={1}
          value={k}
          onChange={(e) => {
            setPlaying(false);
            setK(Number(e.target.value));
          }}
          className="ml-1 min-w-[8rem] flex-1 accent-brand"
          aria-label="Grover iteration count k"
          aria-valuetext={`k = ${k}`}
        />
        <span className="font-mono text-xs text-muted-foreground">
          k = {k} (optimal = {optimal})
        </span>
      </div>

      <div aria-live="polite" className="rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
        P(marked) = {markedProbability.toFixed(3)} after {k} iteration{k === 1 ? "" : "s"}. {phase}
      </div>
    </div>
  );
}
