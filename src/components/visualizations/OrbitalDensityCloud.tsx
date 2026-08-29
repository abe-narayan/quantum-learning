"use client";

import { useMemo, useState } from "react";
import { radial1s, radial2s, radial2p } from "@/lib/quantum/hydrogenAtom";
import { sphericalHarmonic } from "@/lib/quantum/sphericalHarmonics";
import { PresetToggle } from "./PresetToggle";

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
        {/* The label now names the preset on screen. It was static while the
            picture was not: a screen-reader user switching from 1s to 2p₀
            was told the same thing about three visibly different figures. */}
        <svg
          width={VIEW}
          height={VIEW}
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          role="img"
          aria-label={`${ariaLabel} Currently showing the ${preset.label} orbital: a shaded cross-section of ${preset.formula} through the z-axis, out to ${R_MAX} Bohr radii.`}
        >
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
          {/* The z-axis. Load-bearing: the whole point of the 2p₀ preset is
              that its two lobes sit *along z*, which is unreadable without a
              visible z. Moved off `--border` (the panel-edge token, 1.41:1
              on `--surface-muted`) onto `--axis`, which clears the 3:1 WCAG
              1.4.11 floor on every panel depth — and it has to survive being
              drawn on top of a full-bleed density field, not just a flat
              panel. */}
          <line x1={CENTER} y1={4} x2={CENTER} y2={VIEW - 4} className="stroke-axis" strokeWidth={1.25} strokeDasharray="2 3" />
          {/* Intrinsic 240-unit width with no `w-full`: viewBox scale is 1.0,
              so 9 authored units was a literal 9px — under the 10px floor.
              12 clears it. */}
          <text x={CENTER + 5} y={18} fontSize={12} className="fill-axis font-mono">
            z
          </text>
        </svg>
      </div>
      {/* Was a hand-rolled `role="radiogroup"` with `role="radio"` children,
          no arrow-key handling, no roving tabindex, and ~24px-tall pills. It
          announced as a radio group and then didn't behave as one.
          `PresetToggle` already implements the ARIA Authoring Practices
          pattern (single tab stop, arrows move and select with wrap) at a
          44px target, so this defers to it rather than duplicating it. */}
      <PresetToggle
        options={PRESETS.map((p) => ({ label: p.label }))}
        index={index}
        onChange={setIndex}
        ariaLabel="Combined orbital density"
      />
      <p className="text-xs text-muted-foreground">
        Shading is {preset.formula}, this orbital&rsquo;s true combined density (radial × angular, both from the
        platform&rsquo;s verified functions), normalized to its own peak value ({maxDensity.toExponential(2)}).{" "}
        {/* The legend used to read "darker regions are where the electron is
            more likely" — which is backwards on this platform's default dark
            theme. Density is painted as per-cell *opacity* over `fill-brand`,
            so high density is the most strongly coloured cell, which reads as
            the brightest region on dark and the darkest on paper. Describing
            the encoding (colour strength) instead of one theme's appearance
            is correct in both. */}
        The more strongly coloured a region, the more likely the electron is to be found there; the picture is mirrored
        left-right because the density has no φ-dependence for m=0 states.
      </p>
    </div>
  );
}
