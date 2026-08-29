"use client";

import { useMemo, useState } from "react";
import { FrameSlider } from "./FrameSlider";

type Point3 = { x: number; y: number; z: number };
type Projected = { sx: number; sy: number; depth: number };

const VIEW_SIZE = 320;
const CENTER = { x: VIEW_SIZE / 2, y: VIEW_SIZE / 2 };
const RADIUS = 118;
/** Fixed camera angles — this component illustrates one static geometric fact
 * (a fixed cone's enclosed cap) rather than an object worth spinning around,
 * so unlike `BlochSphereCanvas` there is no pointer-drag rotation here. */
const YAW = -0.55;
const PITCH = 0.32;
const WIRE_SAMPLES = 56;
const LOOP_SAMPLES = 72;
/** Resolution of the spherical-cap tessellation: rings sweeping the polar
 * angle from the pole (0) out to θ, times columns sweeping the full 360°
 * azimuth. Each (ring, column) cell becomes one small quad that lies ON the
 * sphere's surface — not a chord through its interior — so the shaded patch
 * is a true curved cap rather than a flat triangle fan. */
const CAP_POLAR_SAMPLES = 16;
const CAP_AZIM_SAMPLES = 48;
/** One slider step per degree, θ ∈ [0°, 180°]. */
const THETA_MAX_DEG = 180;
/** Default half-angle — matches the lesson's own hand-worked Ω=π, γ=−π/2 example. */
const DEFAULT_THETA_DEG = 60;

// --- 3D -> 2D projection, adapted from BlochSphereCanvas's rotate/project ---
// (same yaw-then-pitch rotation and orthographic-ish projection; reproduced
// here rather than imported because that component only exports the full
// interactive `BlochSphereCanvas`, and this sibling needs just the math.)

function rotate({ x, y, z }: Point3, yaw: number, pitch: number): Point3 {
  const cosYaw = Math.cos(yaw);
  const sinYaw = Math.sin(yaw);
  const x1 = x * cosYaw - y * sinYaw;
  const y1 = x * sinYaw + y * cosYaw;

  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);
  const y2 = y1 * cosPitch - z * sinPitch;
  const z2 = y1 * sinPitch + z * cosPitch;

  return { x: x1, y: y2, z: z2 };
}

function project(point: Point3): Projected {
  const rotated = rotate(point, YAW, PITCH);
  return {
    sx: CENTER.x + rotated.x * RADIUS,
    sy: CENTER.y - rotated.z * RADIUS,
    depth: rotated.y,
  };
}

function depthOpacity(depth: number): number {
  return 0.28 + 0.55 * Math.min(1, Math.max(0, (depth + 1) / 2));
}

function circlePoints(plane: "xy" | "xz" | "yz"): Point3[] {
  return Array.from({ length: WIRE_SAMPLES }, (_, i) => {
    const t = (i / WIRE_SAMPLES) * Math.PI * 2;
    const a = Math.cos(t);
    const b = Math.sin(t);
    if (plane === "xy") return { x: a, y: b, z: 0 };
    if (plane === "xz") return { x: a, y: 0, z: b };
    return { x: 0, y: a, z: b };
  });
}

function WireCircle({ plane, dashed }: { plane: "xy" | "xz" | "yz"; dashed: boolean }) {
  const points = circlePoints(plane).map(project);
  return (
    <g>
      {points.map((point, i) => {
        const next = points[(i + 1) % points.length];
        const avgDepth = (point.depth + next.depth) / 2;
        const isBack = avgDepth < 0;
        return (
          <line
            key={i}
            x1={point.sx}
            y1={point.sy}
            x2={next.sx}
            y2={next.sy}
            // The three great circles are scaffolding: they sell the sphere as a 3D
            // object, but nothing in the Berry-phase argument is read off them, and
            // they must stay quieter than the cap and the loop they sit behind. That
            // is exactly what `--axis-grid` is for — deliberately below the 3:1 floor,
            // unlike `--axis`, which the sphere's silhouette below now uses. They were
            // on `stroke-border` (the panel-edge token) purely because no chart channel
            // existed; `--axis-grid` is the same intent with the right name.
            className="stroke-axis-grid"
            strokeWidth={1}
            strokeDasharray={dashed || isBack ? "3 4" : undefined}
            opacity={depthOpacity(avgDepth)}
          />
        );
      })}
    </g>
  );
}

/**
 * The Bloch/parameter sphere with a fixed cone-loop path traced at half-angle
 * θ around the z-axis (the "field direction n̂(t) traces a cone" picture from
 * the Berry-phase-as-half-the-enclosed-solid-angle claim), and the spherical
 * cap the loop encloses shaded in. Complements `ParametricCurve`'s abstract
 * phase-vs-angle plot with the actual geometric object: drag θ from near 0°
 * (a point, γ≈0) to near 180° (nearly the whole sphere, γ≈−2π) and watch the
 * cap grow while Ω=2π(1−cosθ) and γ=−Ω/2 update live alongside it.
 *
 * The cap is rendered as a tessellated grid of small quads that each lie ON
 * the sphere's surface — every vertex comes from the actual sphere
 * parametrization (polar angle swept from the pole out to θ, azimuth swept
 * through the full 360°), not a chord cutting through the interior — so the
 * shaded region is a true curved spherical cap rather than a flat cone/fan.
 * The quads are painter's-algorithm sorted back-to-front by each patch's
 * average depth — the same depth convention `BlochSphereCanvas` uses for its
 * wireframe opacity, just applied to filled patches instead of lines. This
 * is an approximation (no true z-buffering, no clipping at the sphere's
 * silhouette), fine for an illustrative static shape but not a general
 * renderer.
 */
export function BerryPhaseCone({ ariaLabel }: { ariaLabel: string }) {
  const [thetaDeg, setThetaDeg] = useState(DEFAULT_THETA_DEG);
  const theta = (thetaDeg * Math.PI) / 180;

  const omega = 2 * Math.PI * (1 - Math.cos(theta));
  const gamma = -omega / 2;

  const { loopPath, capPatches, startMarker, axisTop } = useMemo(() => {
    const sinT = Math.sin(theta);
    const cosT = Math.cos(theta);
    const boundary: Point3[] = Array.from({ length: LOOP_SAMPLES }, (_, i) => {
      const phi = (i / LOOP_SAMPLES) * 2 * Math.PI;
      return { x: sinT * Math.cos(phi), y: sinT * Math.sin(phi), z: cosT };
    });
    const projectedBoundary = boundary.map(project);
    const loopPath =
      projectedBoundary.map((p, i) => `${i === 0 ? "M" : "L"}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(" ") + " Z";

    // Tessellate the cap itself: a grid of rings (polar angle 0..θ) by
    // columns (azimuth 0..2π), every vertex placed directly on the unit
    // sphere via its actual parametrization. This traces the curved surface
    // patch, not a chord fan through the sphere's interior.
    const grid: Point3[][] = Array.from({ length: CAP_POLAR_SAMPLES + 1 }, (_, i) => {
      const polar = (i / CAP_POLAR_SAMPLES) * theta;
      const sinP = Math.sin(polar);
      const cosP = Math.cos(polar);
      return Array.from({ length: CAP_AZIM_SAMPLES }, (_, j) => {
        const phi = (j / CAP_AZIM_SAMPLES) * 2 * Math.PI;
        return { x: sinP * Math.cos(phi), y: sinP * Math.sin(phi), z: cosP };
      });
    });
    const projectedGrid = grid.map((row) => row.map(project));

    const patches: { points: string; depth: number; key: string }[] = [];
    for (let i = 0; i < CAP_POLAR_SAMPLES; i++) {
      for (let j = 0; j < CAP_AZIM_SAMPLES; j++) {
        const jNext = (j + 1) % CAP_AZIM_SAMPLES;
        const a = projectedGrid[i][j];
        const b = projectedGrid[i][jNext];
        const c = projectedGrid[i + 1][jNext];
        const d = projectedGrid[i + 1][j];
        const avgDepth = (a.depth + b.depth + c.depth + d.depth) / 4;
        patches.push({
          points: `${a.sx.toFixed(1)},${a.sy.toFixed(1)} ${b.sx.toFixed(1)},${b.sy.toFixed(1)} ${c.sx.toFixed(1)},${c.sy.toFixed(1)} ${d.sx.toFixed(1)},${d.sy.toFixed(1)}`,
          depth: avgDepth,
          key: `${i}-${j}`,
        });
      }
    }
    patches.sort((a, b) => a.depth - b.depth);

    return {
      loopPath,
      capPatches: patches,
      startMarker: projectedBoundary[0],
      axisTop: projectedGrid[0][0],
    };
  }, [theta]);

  const axisBottom = project({ x: 0, y: 0, z: -1.18 });
  const axisTopExtended = project({ x: 0, y: 0, z: 1.18 });

  return (
    <div className="not-prose space-y-3 panel-inset p-4">
      {/* `tabIndex={0}` on the scroll container. The SVG below has an intrinsic
          `width={VIEW_SIZE}` (320) and no `w-full`, so unlike this directory's
          responsive figures it does not shrink — it renders at 320 real pixels
          inside a ~256px content box on a 320px phone and this wrapper takes
          the overflow. An `overflow-x-auto` div is focusable by default in no
          browser but Firefox, so a keyboard-only or trackpad-less reader could
          see the left two-thirds of the sphere and had no way to scroll to the
          rest — WCAG 2.1.1.
          Deliberately no `role`/`aria-label` here, for the reason
          `rehypeKatexHtml.mjs` gives for display math: the `<svg>` inside is
          already `role="img"` with the full composed label, and naming the
          wrapper too would announce the figure twice. One bare tab stop is the
          accepted trade. The global `:focus-visible` outline in globals.css
          makes it visible; `panel-inset` sets no `overflow: hidden` that could
          clip the ring. */}
      <div tabIndex={0} className="overflow-x-auto">
        <svg width={VIEW_SIZE} height={VIEW_SIZE} viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`} role="img" aria-label={ariaLabel}>
          {/* The silhouette is load-bearing, not chrome: the entire claim the slider
              demonstrates is "how much of the *whole sphere* the cap covers" — at
              θ→180° the cap should read as almost all of it — and that comparison is
              impossible without seeing where the sphere ends. It was `stroke-border`,
              the panel-edge token at 1.41:1 on `--surface-muted`, so the reference
              outline for a proportion argument was under WCAG 2.1 SC 1.4.11's 3:1.
              `stroke-axis` is the chart channel; the wireframe stays subordinate on
              `stroke-axis-grid`. */}
          <circle cx={CENTER.x} cy={CENTER.y} r={RADIUS} fill="none" className="stroke-axis" strokeWidth={1.5} />

          <WireCircle plane="xy" dashed={false} />
          <WireCircle plane="xz" dashed />
          <WireCircle plane="yz" dashed />

          <line
            x1={axisBottom.sx}
            y1={axisBottom.sy}
            x2={axisTopExtended.sx}
            y2={axisTopExtended.sy}
            className="stroke-muted-foreground"
            strokeWidth={1}
          />
          <text
            x={axisTopExtended.sx}
            y={axisTopExtended.sy - 8}
            textAnchor="middle"
            className="fill-foreground font-mono text-[11px]"
          >
            axis
          </text>

          {capPatches.map((patch) => (
            <polygon
              key={patch.key}
              points={patch.points}
              className="fill-brand"
              opacity={0.14 + 0.4 * Math.min(1, Math.max(0, (patch.depth + 1) / 2))}
            />
          ))}

          <path d={loopPath} fill="none" className="stroke-accent" strokeWidth={2.25} />
          <circle cx={startMarker.sx} cy={startMarker.sy} r={4} className="fill-accent" />
          <circle cx={axisTop.sx} cy={axisTop.sy} r={3} className="fill-muted-foreground" />
        </svg>
      </div>

      <FrameSlider
        label="θ (cone half-angle)"
        valueLabel={`θ = ${thetaDeg}°`}
        index={thetaDeg}
        max={THETA_MAX_DEG}
        onChange={setThetaDeg}
        boxed={false}
      />

      <p className="text-xs text-muted-foreground">
        The teal loop is n̂(t) traced around the cone&apos;s axis at fixed half-angle θ; the shaded cap is the solid
        angle it encloses.
      </p>
      <p className="font-mono text-xs text-muted-foreground">
        Ω = 2π(1−cosθ) = {omega.toFixed(3)} sr &nbsp;&nbsp; γ = −Ω/2 = {gamma.toFixed(3)}
      </p>
    </div>
  );
}
