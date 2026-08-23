"use client";

import { useMemo, useState } from "react";
import { sphericalHarmonic, type SphericalHarmonicIndex } from "@/lib/quantum/sphericalHarmonics";

const SUPPORTED: SphericalHarmonicIndex[] = [
  { l: 0, m: 0 },
  { l: 1, m: -1 },
  { l: 1, m: 0 },
  { l: 1, m: 1 },
  { l: 2, m: -2 },
  { l: 2, m: -1 },
  { l: 2, m: 0 },
  { l: 2, m: 1 },
  { l: 2, m: 2 },
];

const SAMPLES = 120;
const VIEW = 220;
const CENTER = VIEW / 2;
const RADIUS = 90;

/**
 * A 2D polar cross-section of |Y_l^m(θ)|², the standard textbook way to
 * draw an orbital's angular shape (a p-orbital's dumbbell, a d-orbital's
 * four-lobed clover). |Y_l^m|² doesn't actually depend on φ — the m-value
 * only sets a phase — so a single θ-sweep at φ=0, mirrored for the return
 * path, is the complete 2D picture, not a simplification. Computed
 * directly from the platform's real `sphericalHarmonic` (l=0,1,2 closed
 * forms), never a canned SVG shape per (l,m).
 */
export function OrbitalShapePlot({ ariaLabel }: { ariaLabel: string }) {
  const [index, setIndex] = useState(0);
  const { l, m } = SUPPORTED[index];

  const { pathData, maxR } = useMemo(() => {
    const rValues: number[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const theta = (i / SAMPLES) * Math.PI;
      rValues.push(sphericalHarmonic({ l, m }, theta, 0).magnitudeSquared());
    }
    const max = Math.max(...rValues, 1e-9);

    const rightSide = rValues.map((r, i) => {
      const theta = (i / SAMPLES) * Math.PI;
      const scaled = (r / max) * RADIUS;
      return { x: CENTER + scaled * Math.sin(theta), y: CENTER - scaled * Math.cos(theta) };
    });
    const leftSide = rValues
      .map((r, i) => {
        const theta = (i / SAMPLES) * Math.PI;
        const scaled = (r / max) * RADIUS;
        return { x: CENTER - scaled * Math.sin(theta), y: CENTER - scaled * Math.cos(theta) };
      })
      .reverse();

    const points = [...rightSide, ...leftSide];
    const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
    return { pathData: path, maxR: max };
  }, [l, m]);

  return (
    <div className="not-prose space-y-3 rounded-xl border border-border bg-surface-muted/40 p-4">
      <div className="overflow-x-auto">
        <svg width={VIEW} height={VIEW} viewBox={`0 0 ${VIEW} ${VIEW}`} role="img" aria-label={ariaLabel}>
          <line x1={CENTER} y1={10} x2={CENTER} y2={VIEW - 10} className="stroke-border" strokeWidth={1} strokeDasharray="2 3" />
          <text x={CENTER + 4} y={16} className="fill-muted-foreground text-[9px] font-mono">
            z
          </text>
          <path d={pathData} className="fill-brand/25 stroke-brand" strokeWidth={2} />
        </svg>
      </div>
      <div role="radiogroup" aria-label="Orbital (l, m)" className="flex flex-wrap gap-1.5">
        {SUPPORTED.map((idx, i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={i === index}
            onClick={() => setIndex(i)}
            className={
              i === index
                ? "rounded-full bg-brand px-2.5 py-1 text-xs font-medium text-brand-foreground"
                : "rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-surface-muted"
            }
          >
            l={idx.l}, m={idx.m}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Peak |Y|<sup>2</sup> for this (l, m): {maxR.toFixed(4)}. Shape shown is a 2D cross-section through the z-axis; |Y
        <sub>l</sub><sup>m</sup>|² doesn&rsquo;t depend on the azimuthal angle φ, so this slice represents the full 3D shape.
      </p>
    </div>
  );
}
