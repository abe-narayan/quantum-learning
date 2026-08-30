"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Point3 = { x: number; y: number; z: number };
type Projected = { sx: number; sy: number; depth: number };

const VIEW_SIZE = 400;
const CENTER = { x: VIEW_SIZE / 2, y: VIEW_SIZE / 2 };
const RADIUS = 148;
const INITIAL_YAW = -0.55;
const INITIAL_PITCH = 0.32;
const MAX_PITCH = 1.45;
const ROTATE_SENSITIVITY = 0.0085;
const CIRCLE_SAMPLES = 56;
/** Radians per arrow-key press, the keyboard equivalent of the pointer-drag rotation, since
 * dragging the sphere has no keyboard counterpart otherwise. */
const KEY_ROTATE_STEP = 0.12;

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

function project(point: Point3, yaw: number, pitch: number): Projected {
  const rotated = rotate(point, yaw, pitch);
  return {
    sx: CENTER.x + rotated.x * RADIUS,
    sy: CENTER.y - rotated.z * RADIUS,
    depth: rotated.y,
  };
}

function depthOpacity(depth: number): number {
  return 0.32 + 0.6 * Math.min(1, Math.max(0, (depth + 1) / 2));
}

function circlePoints(plane: "xy" | "xz" | "yz"): Point3[] {
  return Array.from({ length: CIRCLE_SAMPLES }, (_, i) => {
    const t = (i / CIRCLE_SAMPLES) * Math.PI * 2;
    const a = Math.cos(t);
    const b = Math.sin(t);
    if (plane === "xy") return { x: a, y: b, z: 0 };
    if (plane === "xz") return { x: a, y: 0, z: b };
    return { x: 0, y: a, z: b };
  });
}

function WireCircle({
  plane,
  yaw,
  pitch,
  dashed,
}: {
  plane: "xy" | "xz" | "yz";
  yaw: number;
  pitch: number;
  dashed: boolean;
}) {
  const points = circlePoints(plane).map((p) => project(p, yaw, pitch));

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
            // `--axis-grid`, not `--border`. These three great circles are the
            // optional ruling of this figure: helpful for reading where the
            // vector sits relative to the equator, never the only way to read
            // it, which is exactly what `--axis-grid` (deliberately under 3:1)
            // is authored for. `--border` is 1.41:1 panel chrome, and it is
            // *quieter* than `--axis-grid` in both themes (#2b3547 vs #44526b
            // dark, #d7dbe4 vs #b9c0cd on paper), so this is the ruling coming
            // up to its own floor rather than down to it. The depth fade below
            // still runs on top, so back-facing arcs stay recessive.
            style={{ stroke: "var(--axis-grid)" }}
            strokeWidth={1}
            strokeDasharray={dashed || isBack ? "3 4" : undefined}
            opacity={depthOpacity(avgDepth)}
          />
        );
      })}
    </g>
  );
}

function AxisLine({
  from,
  to,
  yaw,
  pitch,
  label,
}: {
  from: Point3;
  to: Point3;
  yaw: number;
  pitch: number;
  label?: string;
}) {
  const a = project(from, yaw, pitch);
  const b = project(to, yaw, pitch);
  return (
    <g opacity={depthOpacity(b.depth)}>
      <line x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} style={{ stroke: "var(--muted-foreground)" }} strokeWidth={1} />
      {/* 11 -> 15 -> 17 units. This SVG renders `w-full` on a 400-unit viewBox
          inside a `SimulatorInstrument` (`p-4 sm:p-5` on a 1px-bordered
          `.instrument`). The 15 was measured against a 254px box: a 320px
          viewport, less the `Container px-4` gutters, less that one instrument
          frame at 2 × (16 + 1) = 34px. That is the `/simulators` bench box.
          Every explorer that mounts this canvas is also embedded in lessons
          (15 for the Bloch explorer alone), and a lesson embed nests inside
          `InteractiveSection`, itself an `.instrument` with a `p-4` body: its
          `has-[[data-mdx-slot=embed]_.instrument]` de-framing selector drops
          that wrapper's border *colour*, wash and shadow, and keeps both its
          1px border box and its 16px of padding. The narrowest real box is
          therefore 320 − 32 − 34 − 34 = **220px**, confirmed against the
          served markup of a lesson simulator embed, where authored type scales
          by 220/400 = 0.55 rather than 0.635. At 15 units that is 8.25px, back
          under the ~9px floor, on the only labels distinguishing the x, y and
          z axes of a sphere the reader is asked to rotate. 17 units gives
          **9.35px** at 220px, 10.8px on the bench, and a literal 17px from
          400px up.

          The dy offsets grow with the type (−8/+14 -> −11/+19 -> −12/+21) so
          the gap between an axis tip and its label stays proportional instead
          of closing up as the glyphs get taller; a single character at 17
          units in the mono face is ~10.2 units wide, so the ±5.1 half-width
          around an axis tip at 52..348 stays well inside the 400-unit box. */}
      {label ? (
        <text
          x={b.sx}
          y={b.sy}
          dy={b.sy > a.sy ? 21 : -12}
          textAnchor="middle"
          className="font-mono text-[17px]"
          style={{ fill: "var(--muted-foreground)" }}
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

export function BlochSphereCanvas({
  blochPoint,
  pulse,
  className,
}: {
  blochPoint: { x: number; y: number; z: number };
  /** Brief flash at the vector's tip, used to mark a discontinuous event like measurement collapse. */
  pulse?: boolean;
  className?: string;
}) {
  const [yaw, setYaw] = useState(INITIAL_YAW);
  const [pitch, setPitch] = useState(INITIAL_PITCH);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; startYaw: number; startPitch: number } | null>(
    null
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startYaw: yaw,
        startPitch: pitch,
      };
      setIsDragging(true);
    },
    [yaw, pitch]
  );

  const handlePointerMove = useCallback((event: React.PointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    setYaw(drag.startYaw + dx * ROTATE_SENSITIVITY);
    setPitch(Math.min(MAX_PITCH, Math.max(-MAX_PITCH, drag.startPitch - dy * ROTATE_SENSITIVITY)));
  }, []);

  const endDrag = useCallback((event: React.PointerEvent<SVGSVGElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      setIsDragging(false);
    }
  }, []);

  // Keyboard equivalent of the pointer drag above. Dragging only rotates the camera view
  // (never the physical state), but it was previously mouse/touch-only with no way for a
  // keyboard user to reach it at all.
  const handleKeyDown = useCallback((event: React.KeyboardEvent<SVGSVGElement>) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        setYaw((prev) => prev - KEY_ROTATE_STEP);
        break;
      case "ArrowRight":
        event.preventDefault();
        setYaw((prev) => prev + KEY_ROTATE_STEP);
        break;
      case "ArrowUp":
        event.preventDefault();
        setPitch((prev) => Math.min(MAX_PITCH, prev + KEY_ROTATE_STEP));
        break;
      case "ArrowDown":
        event.preventDefault();
        setPitch((prev) => Math.max(-MAX_PITCH, prev - KEY_ROTATE_STEP));
        break;
      default:
        break;
    }
  }, []);

  const vector = project(blochPoint, yaw, pitch);
  const origin = project({ x: 0, y: 0, z: 0 }, yaw, pitch);
  const vectorLength = Math.hypot(vector.sx - origin.sx, vector.sy - origin.sy);
  const angle = Math.atan2(vector.sy - origin.sy, vector.sx - origin.sx);
  const headLength = 12;
  const headBase = vectorLength > headLength ? vectorLength - headLength : vectorLength;
  const headPoint = {
    sx: origin.sx + Math.cos(angle) * headBase,
    sy: origin.sy + Math.sin(angle) * headBase,
  };
  const perp = angle + Math.PI / 2;
  const headWidth = 5;

  return (
    <svg
      viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
      // `role="group"`, not `role="img"`. This element is `tabIndex={0}` and
      // handles four arrow keys, so `img` was an outright false promise: it
      // tells assistive tech "static graphic, nothing to operate here", and a
      // focusable image is a shape screen readers have no interaction model
      // for. The reader lands on a tab stop whose role says it cannot be a
      // tab stop, and nothing in the exposed semantics says arrow keys do
      // anything. `img` also forces every descendant presentational, which is
      // why the pole labels below were silently dropped from the tree.
      //
      // `group` is the role for "a focusable container of related graphics you
      // operate as one thing", and `aria-roledescription` restores the useful
      // half of what `img` was communicating: the reader hears "interactive
      // Bloch sphere" rather than a bare "group", without claiming the thing
      // is inert. The `aria-label` still carries the vector's coordinates and
      // the operating instructions, so the announcement on focus is unchanged
      // in substance and now honest about being operable.
      role="group"
      aria-roledescription="interactive Bloch sphere"
      tabIndex={0}
      aria-label={`Bloch sphere with the qubit state vector at approximately x=${blochPoint.x.toFixed(2)}, y=${blochPoint.y.toFixed(2)}, z=${blochPoint.z.toFixed(2)}. Drag, or focus and use the arrow keys, to rotate the view.`}
      className={cn(
        "touch-none select-none rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={handleKeyDown}
    >
      <defs>
        <linearGradient id="bloch-vector-live" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "var(--pillar-accent)" }} />
          <stop offset="100%" style={{ stopColor: "var(--accent)" }} />
        </linearGradient>
      </defs>

      {/* The sphere's silhouette, on `--axis` rather than `--border`.
          This one line is the surface, and "on the surface versus inside it"
          is the entire reading of two of the instruments that mount this
          canvas: the Density Matrix Explorer ("distance from the sphere's
          surface is exactly how much they don't know") and the Noise Explorer
          ("the further inside the surface it sinks, the more of that state has
          been lost"). A reference boundary a reader must perceive to read the
          figure is what `--axis` (4.5:1) is for; `--border` is 1.41:1
          decorative panel chrome, and it was drawing the one mark those two
          simulators ask the reader to measure against. */}
      <circle cx={CENTER.x} cy={CENTER.y} r={RADIUS} fill="none" style={{ stroke: "var(--axis)" }} strokeWidth={1.5} />

      <WireCircle plane="xy" yaw={yaw} pitch={pitch} dashed={false} />
      <WireCircle plane="xz" yaw={yaw} pitch={pitch} dashed />
      <WireCircle plane="yz" yaw={yaw} pitch={pitch} dashed />

      <AxisLine from={{ x: -1.28, y: 0, z: 0 }} to={{ x: 1.28, y: 0, z: 0 }} yaw={yaw} pitch={pitch} label="x" />
      <AxisLine from={{ x: 0, y: -1.28, z: 0 }} to={{ x: 0, y: 1.28, z: 0 }} yaw={yaw} pitch={pitch} label="y" />
      <AxisLine from={{ x: 0, y: 0, z: -1.28 }} to={{ x: 0, y: 0, z: 1.28 }} yaw={yaw} pitch={pitch} />

      {(() => {
        // θ=0 → z=+1 → |0⟩ (north pole); θ=π → z=-1 → |1⟩ (south pole). See src/lib/quantum/bloch.ts.
        const north = project({ x: 0, y: 0, z: 1.28 }, yaw, pitch);
        const south = project({ x: 0, y: 0, z: -1.28 }, yaw, pitch);
        // Near pitch=0 the poles sit at their most extreme projected height (the
        // ±1.28 axis tip is ~189px from center vs. the ~200px half-height of the
        // 400×400 viewBox), leaving only ~11px of headroom before the viewBox
        // edge clips the label.
        //
        // The old answer was to shrink the offsets (-6/+11 rather than the
        // axis labels' -8/+14). That does not survive the type rising from 11
        // to 15 and then to 17 units (see the AxisLine note above for the
        // 220px measurement that forced it), because at 17 units the ascent
        // alone is ~13 units, so at pitch 0 a baseline at north.sy − 6 = 5
        // puts the cap tops at −8 and SVG clips them away with no scrollbar
        // and no symptom.
        //
        // So the offsets go back to matching the axis labels and the result is
        // *clamped* to the box instead. `Math.max`/`Math.min` against the
        // glyph's own ascent and descent is a bound, not a guess: the label can
        // never leave the viewBox at any pitch, and at every pitch except the
        // extreme it sits exactly where the un-clamped offset would put it
        // (at the default pitch of 0.32 the north tip projects to sy ≈ 20.6,
        // so the clamp is already inactive by a hair). The worst case it
        // permits is the ket resting on its own axis tip at pitch 0, which is
        // legible; the worst case it replaces was the ket being invisible.
        const ASCENT = 15;
        const DESCENT = 6;
        return (
          <>
            <text
              x={north.sx}
              y={Math.max(north.sy - 12, ASCENT)}
              textAnchor="middle"
              className="font-mono text-[17px]"
              style={{ fill: "var(--foreground)" }}
            >
              |0⟩
            </text>
            <text
              x={south.sx}
              y={Math.min(south.sy + 21, VIEW_SIZE - DESCENT)}
              textAnchor="middle"
              className="font-mono text-[17px]"
              style={{ fill: "var(--foreground)" }}
            >
              |1⟩
            </text>
          </>
        );
      })()}

      <line
        x1={origin.sx}
        y1={origin.sy}
        x2={headPoint.sx}
        y2={headPoint.sy}
        style={{ stroke: "url(#bloch-vector-live)" }}
        strokeWidth={2.75}
        strokeLinecap="round"
      />
      <polygon
        points={`${vector.sx},${vector.sy} ${headPoint.sx + Math.cos(perp) * headWidth},${headPoint.sy + Math.sin(perp) * headWidth} ${headPoint.sx - Math.cos(perp) * headWidth},${headPoint.sy - Math.sin(perp) * headWidth}`}
        style={{ fill: "url(#bloch-vector-live)" }}
      />
      <circle cx={origin.sx} cy={origin.sy} r={2.5} style={{ fill: "var(--muted-foreground)" }} />
      {pulse ? (
        <circle
          cx={vector.sx}
          cy={vector.sy}
          r={7}
          className="animate-ping motion-reduce:animate-none"
          style={{ fill: "var(--pillar-accent)" }}
          aria-hidden="true"
        />
      ) : null}
    </svg>
  );
}
