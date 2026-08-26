"use client";

import { useState } from "react";

const WIDTH = 480;
const HEIGHT = 220;
const PAD_LEFT = 44;
const PAD_RIGHT = 16;
const PAD_TOP = 16;
const PAD_BOTTOM = 30;

/**
 * Deterministic PRNG (mulberry32), scoped to this component the same way
 * `ReadoutScatter` scopes its own copy — no shared seeded-RNG utility
 * exists in `src/lib` at time of writing. Used only to pick where, within
 * an illustrative range, the binary loss curve drops to zero, so the
 * "resample" control redraws a genuinely different loss event each time
 * rather than replaying the same fixed point.
 */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildPath(xValues: number[], yValues: number[], xOf: (x: number) => number, yOf: (y: number) => number): string {
  return xValues.map((x, i) => `${i === 0 ? "M" : "L"}${xOf(x).toFixed(1)},${yOf(yValues[i]).toFixed(1)}`).join(" ");
}

/**
 * Puts the lesson's own repeated claim ("loss is binary, not gradual
 * decay") directly on an axis. Plots two curves over the same normalized
 * time axis, sharing the same start (fully coherent / fully present at
 * t = 0):
 *
 * - a smooth exponential envelope e^(-t / decayConstant), standing in for
 *   the gradual T1/T2-style dephasing every *other* platform in this
 *   course suffers, fading continuously toward zero; and
 * - a binary step that stays flat at 1 until a randomly chosen loss time
 *   and then drops instantly to 0, standing in for a photon that either
 *   survives to be detected or is lost outright.
 *
 * The loss time is the only random input, seeded so server and client
 * markup match; the "Resample loss event" control reseeds it so a reader
 * can see that *where* the binary curve drops is random, while *that* it
 * drops discontinuously (rather than decaying) is not.
 */
export function LossVsDecoherence({
  ariaLabel,
  decayConstant = 0.42,
  minLossTime = 0.2,
  maxLossTime = 0.85,
  seed = 7,
}: {
  ariaLabel: string;
  /** Time constant of the smooth exponential curve, in the same normalized time units as the axis (0 to 1). */
  decayConstant?: number;
  /** Range within which the binary curve's random drop point is sampled. */
  minLossTime?: number;
  maxLossTime?: number;
  seed?: number;
}) {
  const [drawSeed, setDrawSeed] = useState(seed);

  const lossTime = (() => {
    const rng = mulberry32(drawSeed);
    return minLossTime + rng() * (maxLossTime - minLossTime);
  })();

  const steps = 120;
  const tValues = Array.from({ length: steps + 1 }, (_, i) => i / steps);
  const gradualValues = tValues.map((t) => Math.exp(-t / decayConstant));
  const binaryValues = tValues.map((t) => (t < lossTime ? 1 : 0));

  const xOf = (t: number) => PAD_LEFT + t * (WIDTH - PAD_LEFT - PAD_RIGHT);
  const yOf = (y: number) => PAD_TOP + (1 - y) * (HEIGHT - PAD_TOP - PAD_BOTTOM);

  const gradualPath = buildPath(tValues, gradualValues, xOf, yOf);
  const binaryPath = buildPath(tValues, binaryValues, xOf, yOf);

  return (
    <div className="not-prose space-y-3 panel-inset p-4">
      <div className="overflow-x-auto">
        <svg
          width={WIDTH}
          height={HEIGHT}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full"
          role="img"
          aria-label={`${ariaLabel} Currently: the binary loss curve drops to zero at normalized time ${lossTime.toFixed(2)}.`}
        >
          {/* axes */}
          <line x1={PAD_LEFT} y1={HEIGHT - PAD_BOTTOM} x2={WIDTH - PAD_RIGHT} y2={HEIGHT - PAD_BOTTOM} className="stroke-border" strokeWidth={1} />
          <line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={HEIGHT - PAD_BOTTOM} className="stroke-border" strokeWidth={1} />
          <text x={WIDTH - PAD_RIGHT} y={HEIGHT - PAD_BOTTOM + 16} textAnchor="end" className="fill-muted-foreground text-[10px]">
            time in transit →
          </text>
          <text x={PAD_LEFT - 8} y={PAD_TOP + 8} textAnchor="end" className="fill-muted-foreground text-[10px]">
            1
          </text>
          <text x={PAD_LEFT - 8} y={HEIGHT - PAD_BOTTOM} textAnchor="end" className="fill-muted-foreground text-[10px]">
            0
          </text>

          {/* dashed marker at the sampled loss point */}
          <line
            x1={xOf(lossTime)}
            y1={PAD_TOP}
            x2={xOf(lossTime)}
            y2={HEIGHT - PAD_BOTTOM}
            className="stroke-warning/60"
            strokeWidth={1}
            strokeDasharray="3 3"
          />

          <path d={gradualPath} fill="none" className="stroke-accent" strokeWidth={2} />
          <path d={binaryPath} fill="none" className="stroke-brand" strokeWidth={2.25} />
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 bg-accent" aria-hidden="true" />
            gradual decoherence (other platforms&rsquo; T1/T2)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 bg-brand" aria-hidden="true" />
            photon loss (survive, then binary drop)
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDrawSeed((s) => s + 1)}
          className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-surface-muted"
        >
          Resample loss event
        </button>
      </div>

      <p className="text-sm text-foreground">
        The accent curve fades continuously, there&rsquo;s no single moment it
        &ldquo;happens.&rdquo; The brand curve stays exactly at 1 and then, at one
        random moment (dashed line, currently t ={" "}
        <span className="font-mono">{lossTime.toFixed(2)}</span>), drops
        straight to 0: the photon was there, then it wasn&rsquo;t.
      </p>
    </div>
  );
}
