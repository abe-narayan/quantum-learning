"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sphericalHarmonic, type SphericalHarmonicIndex } from "@/lib/quantum/sphericalHarmonics";
import { usePrefersReducedMotion } from "@/components/simulators/bloch-sphere/usePrefersReducedMotion";
import { easeInOutCubic } from "@/components/simulators/bloch-sphere/useAnimatedBlochPoint";

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
/** Tween duration when switching between (l, m) buttons. */
const TWEEN_MS = 400;

/**
 * Raw |Y_l^m(theta)|^2 samples across theta in [0, pi], pre-scaled into
 * pixel radii against this orbital's own peak so two shapes with very
 * different peak magnitudes (e.g. l=0 vs l=2) can still be tweened
 * radius-for-radius without one dominating the interpolation.
 */
function sampleShape({ l, m }: SphericalHarmonicIndex): { radii: number[]; maxR: number } {
  const raw: number[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const theta = (i / SAMPLES) * Math.PI;
    raw.push(sphericalHarmonic({ l, m }, theta, 0).magnitudeSquared());
  }
  const max = Math.max(...raw, 1e-9);
  return { radii: raw.map((r) => (r / max) * RADIUS), maxR: max };
}

/** Builds the mirrored polar-cross-section path from an array of already-scaled pixel radii. */
function pathFromRadii(radii: number[]): string {
  const rightSide = radii.map((r, i) => {
    const theta = (i / SAMPLES) * Math.PI;
    return { x: CENTER + r * Math.sin(theta), y: CENTER - r * Math.cos(theta) };
  });
  const leftSide = radii
    .map((r, i) => {
      const theta = (i / SAMPLES) * Math.PI;
      return { x: CENTER - r * Math.sin(theta), y: CENTER - r * Math.cos(theta) };
    })
    .reverse();
  const points = [...rightSide, ...leftSide];
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
}

/**
 * A 2D polar cross-section of |Y_l^m(θ)|², the standard textbook way to
 * draw an orbital's angular shape (a p-orbital's dumbbell, a d-orbital's
 * four-lobed clover). |Y_l^m|² doesn't actually depend on φ — the m-value
 * only sets a phase — so a single θ-sweep at φ=0, mirrored for the return
 * path, is the complete 2D picture, not a simplification. Computed
 * directly from the platform's real `sphericalHarmonic` (l=0,1,2 closed
 * forms), never a canned SVG shape per (l,m).
 *
 * Switching between (l, m) buttons tweens the sampled radii from the
 * previous shape to the next over ~400ms (teaching-relevant: it makes the
 * lobe count/shape *change* visible as a continuous deformation instead of
 * a hard cut, which is easy to miss), short-circuiting to an instant swap
 * under `prefers-reduced-motion`.
 */
export function OrbitalShapePlot({ ariaLabel }: { ariaLabel: string }) {
  const [index, setIndex] = useState(0);
  const { l, m } = SUPPORTED[index];
  const prefersReducedMotion = usePrefersReducedMotion();

  const target = useMemo(() => sampleShape({ l, m }), [l, m]);

  const [displayRadii, setDisplayRadii] = useState<number[]>(target.radii);
  const prevRadiiRef = useRef<number[]>(target.radii);
  const rafRef = useRef<number | null>(null);
  const isFirstRender = useRef(true);

  // Kept as a separate callback (rather than inline in the effect below) so
  // the reduced-motion snap's setState call isn't lexically inside the
  // effect body — same shape as `animateAlong` in useAnimatedBlochPoint.ts.
  const runTween = useCallback(
    (from: number[], to: number[]) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      if (prefersReducedMotion) {
        setDisplayRadii(to);
        prevRadiiRef.current = to;
        return;
      }

      const start = performance.now();
      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / TWEEN_MS);
        const eased = easeInOutCubic(t);
        setDisplayRadii(from.map((r, i) => r + (to[i] - r) * eased));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(frame);
        } else {
          rafRef.current = null;
          prevRadiiRef.current = to;
        }
      };
      rafRef.current = requestAnimationFrame(frame);
    },
    [prefersReducedMotion]
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevRadiiRef.current = target.radii;
      return;
    }

    runTween(prevRadiiRef.current, target.radii);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [l, m, runTween]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const pathData = useMemo(() => pathFromRadii(displayRadii), [displayRadii]);

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
        Peak |Y|<sup>2</sup> for this (l, m): {target.maxR.toFixed(4)}. Shape shown is a 2D cross-section through the z-axis; |Y
        <sub>l</sub><sup>m</sup>|² doesn&rsquo;t depend on the azimuthal angle φ, so this slice represents the full 3D shape.
      </p>
    </div>
  );
}
