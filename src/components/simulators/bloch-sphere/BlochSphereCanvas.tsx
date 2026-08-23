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
            style={{ stroke: "var(--border)" }}
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
  label: string;
}) {
  const a = project(from, yaw, pitch);
  const b = project(to, yaw, pitch);
  return (
    <g opacity={depthOpacity(b.depth)}>
      <line x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} style={{ stroke: "var(--muted-foreground)" }} strokeWidth={1} />
      <text
        x={b.sx}
        y={b.sy}
        dy={b.sy > a.sy ? 14 : -8}
        textAnchor="middle"
        className="font-mono text-[11px]"
        style={{ fill: "var(--muted-foreground)" }}
      >
        {label}
      </text>
    </g>
  );
}

export function BlochSphereCanvas({
  blochPoint,
  className,
}: {
  blochPoint: { x: number; y: number; z: number };
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
      role="img"
      aria-label={`Bloch sphere with the qubit state vector at approximately x=${blochPoint.x.toFixed(2)}, y=${blochPoint.y.toFixed(2)}, z=${blochPoint.z.toFixed(2)}. Drag to rotate the view.`}
      className={cn("touch-none select-none", isDragging ? "cursor-grabbing" : "cursor-grab", className)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <defs>
        <linearGradient id="bloch-vector-live" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: "var(--brand)" }} />
          <stop offset="100%" style={{ stopColor: "var(--accent)" }} />
        </linearGradient>
      </defs>

      <circle cx={CENTER.x} cy={CENTER.y} r={RADIUS} fill="none" style={{ stroke: "var(--border)" }} strokeWidth={1.5} />

      <WireCircle plane="xy" yaw={yaw} pitch={pitch} dashed={false} />
      <WireCircle plane="xz" yaw={yaw} pitch={pitch} dashed />
      <WireCircle plane="yz" yaw={yaw} pitch={pitch} dashed />

      <AxisLine from={{ x: -1.28, y: 0, z: 0 }} to={{ x: 1.28, y: 0, z: 0 }} yaw={yaw} pitch={pitch} label="x" />
      <AxisLine from={{ x: 0, y: -1.28, z: 0 }} to={{ x: 0, y: 1.28, z: 0 }} yaw={yaw} pitch={pitch} label="y" />
      <AxisLine from={{ x: 0, y: 0, z: -1.28 }} to={{ x: 0, y: 0, z: 1.28 }} yaw={yaw} pitch={pitch} label="|1⟩" />

      {(() => {
        const north = project({ x: 0, y: 0, z: 1.28 }, yaw, pitch);
        return (
          <text
            x={north.sx}
            y={north.sy - 8}
            textAnchor="middle"
            className="font-mono text-[11px]"
            style={{ fill: "var(--foreground)" }}
          >
            |0⟩
          </text>
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
    </svg>
  );
}
