"use client";

import { useMemo, useState } from "react";
import { radial1s, radial2s, radial2p } from "@/lib/quantum/hydrogenAtom";
import { sphericalHarmonic } from "@/lib/quantum/sphericalHarmonics";

type OrbitalPreset = {
  key: string;
  label: string;
  formula: string;
  l: 0 | 1 | 2;
  m: number;
  R: (r: number) => number;
};

const PRESETS: OrbitalPreset[] = [
  { key: "1s", label: "1s", formula: "|R₁ₛ|²|Y₀⁰|²", l: 0, m: 0, R: radial1s },
  { key: "2s", label: "2s", formula: "|R₂ₛ|²|Y₀⁰|²", l: 0, m: 0, R: radial2s },
  { key: "2p0", label: "2p₀", formula: "|R₂ₚ|²|Y₁⁰|²", l: 1, m: 0, R: radial2p },
];

/**
 * Shared physical extent (in Bohr radii, a₀=1) for every preset's grid, so
 * switching between orbitals compares them on the same physical scale —
 * exactly what makes "2s/2p are more spread out than 1s" visible, rather
 * than each preset silently rescaling to fill the same pixel box.
 */
const R_MAX = 12;
/** Cells per axis of the density grid — fine enough to keep the 2p₀ lobe separation and the 2s node from looking blocky at native size, while staying cheap as plain SVG rects. */
const GRID = 80;
const VIEW = 240;
const CENTER = VIEW / 2;
const CELL = VIEW / GRID;

/**
 * |psi_nlm(r,theta)|^2 = |R_nl(r)|^2 |Y_l^m(theta,0)|^2 for m=0 states, using
 * the platform's real, already-verified `radial1s`/`radial2s`/`radial2p` and
 * `sphericalHarmonic` — the exact product the "Assembling ψ" section writes
 * down but never actually plots. m=0 harmonics don't depend on phi, so phi=0
 * is the whole story.
 */
function combinedDensity(preset: OrbitalPreset, r: number, theta: number): number {
  const radial = preset.R(r);
  const angular = sphericalHarmonic({ l: preset.l, m: preset.m }, theta, 0).magnitudeSquared();
  return radial * radial * angular;
}

/**
 * Samples |psi|^2 on a uniform (x, z) grid over the half-plane's mirror image
 * — i.e. the full (x, z) cross-section through the z-axis, x = r sin(theta),
 * z = r cos(theta) — and returns each cell's density normalized against this
 * orbital's own peak (so 1s and 2p, whose absolute densities differ by
 * orders of magnitude, both render with a full 0-1 shading range). Density
 * is a pure function of (x, z): the same physical point always yields the
 * same value, satisfying "same density always renders the same shade"
 * without any randomness.
 */
function sampleGrid(preset: OrbitalPreset): { cells: { x: number; y: number; t: number }[]; maxDensity: number } {
  const raw: { x: number; y: number; density: number }[] = [];
  let maxDensity = 1e-12;

  for (let iz = 0; iz < GRID; iz++) {
    for (let ix = 0; ix < GRID; ix++) {
      const px = ix * CELL;
      const py = iz * CELL;
      const x = ((px + CELL / 2 - CENTER) / (VIEW / 2)) * R_MAX;
      const z = ((CENTER - (py + CELL / 2)) / (VIEW / 2)) * R_MAX;
      const r = Math.sqrt(x * x + z * z);
      const theta = r < 1e-9 ? 0 : Math.acos(Math.max(-1, Math.min(1, z / r)));
      const density = combinedDensity(preset, r, theta);
      if (density > maxDensity) maxDensity = density;
      raw.push({ x: px, y: py, density });
    }
  }

  // Gamma-compress (sqrt-ish) so the broad, faint outer cloud stays visible
  // next to the bright peak — a fixed, deterministic transform of density,
  // not a random shading choice.
  const cells = raw.map(({ x, y, density }) => ({ x, y, t: Math.pow(density / maxDensity, 0.4) }));
  return { cells, maxDensity };
}

/**
 * A 2D (r, theta) cross-section of the TRUE combined orbital density
 * |psi_nlm(r,theta)|^2 = |R_nl(r)|^2 |Y_l^m(theta)|^2 for the three m=0
 * states this lesson covers (1s, 2s, 2p0) — the actual product the lesson
 * text derives, plotted as a deterministic shaded grid (a textbook
 * electron-cloud picture) rather than as its two separate factors. Visual
 * style (SVG polar cross-section, preset button row, not-prose card)
 * deliberately mirrors `OrbitalShapePlot`, its angular-only counterpart
 * used earlier in the same lesson.
 */
export function OrbitalDensityCloud({ ariaLabel }: { ariaLabel: string }) {
  const [index, setIndex] = useState(0);
  const preset = PRESETS[index];

  const { cells, maxDensity } = useMemo(() => sampleGrid(preset), [preset]);

  return (
    <div className="not-prose space-y-3 panel-inset p-4">
      <div className="overflow-x-auto">
        <svg width={VIEW} height={VIEW} viewBox={`0 0 ${VIEW} ${VIEW}`} role="img" aria-label={ariaLabel}>
          {cells.map((cell, i) => (
            <rect
              key={i}
              x={cell.x}
              y={cell.y}
              width={CELL + 0.5}
              height={CELL + 0.5}
              className="fill-brand"
              style={{ opacity: cell.t }}
            />
          ))}
          <line x1={CENTER} y1={4} x2={CENTER} y2={VIEW - 4} className="stroke-border" strokeWidth={1} strokeDasharray="2 3" />
          <text x={CENTER + 4} y={16} className="fill-muted-foreground text-[9px] font-mono">
            z
          </text>
        </svg>
      </div>
      <div role="radiogroup" aria-label="Combined orbital density" className="flex flex-wrap gap-1.5">
        {PRESETS.map((p, i) => (
          <button
            key={p.key}
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
            {p.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Shading is {preset.formula}, this orbital&rsquo;s true combined density (radial × angular, both from the
        platform&rsquo;s verified functions), normalized to its own peak value ({maxDensity.toExponential(2)}). Darker
        regions are where the electron is more likely to be found; the picture is mirrored left-right because the
        density has no φ-dependence for m=0 states.
      </p>
    </div>
  );
}
