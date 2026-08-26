"use client";

import { useId, useState } from "react";
import { PresetToggle } from "./PresetToggle";

const WIDTH = 320;
const PAD = 40;
// Fixed magnitude for the input vector — only its angle changes as the
// student drags the slider, so the diagram's scale never has to jump
// around mid-drag the way an auto-fit-to-content scale (like
// `VectorDiagram`'s) would.
const VECTOR_LENGTH = 1.3;

const MODE_OPTIONS: { label: string }[] = [
  { label: "Project onto 1D eigenspace" },
  { label: "Project onto 2D eigenspace" },
];

/**
 * A live counterpart to the lesson's "shadow cast onto a wall" metaphor:
 * drag a vector v around the plane and watch its projection Pv, either
 * onto a genuine one-dimensional eigenspace (the x-axis, the rank-1 case
 * worked out algebraically by `MatrixGridExplorer`'s P₂) or onto the
 * two-dimensional eigenspace that is the whole plane (the degenerate
 * rank-2 case, that explorer's P₁) — the identity projector, since the
 * only subspace containing every vector in a 2D plane is the plane
 * itself. Both modes are real projections computed here (P is literally
 * "drop the y-component" or "keep everything"), not canned frames, so the
 * dashed perpendicular from v to Pv and the small self-loop at Pv are a
 * direct visual proof of idempotence: applying the same projection to Pv
 * leaves it exactly where it is, for every angle the student picks.
 */
export function ProjectionShadow({
  ariaLabel = "Projection of a rotating vector onto a one-dimensional or two-dimensional eigenspace",
  height = 300,
}: {
  ariaLabel?: string;
  height?: number;
}) {
  const idBase = useId();
  const [angleDeg, setAngleDeg] = useState(35);
  const [modeIndex, setModeIndex] = useState(0);
  const mode: "line" | "plane" = modeIndex === 0 ? "line" : "plane";

  const angleRad = (angleDeg * Math.PI) / 180;
  const v = { x: VECTOR_LENGTH * Math.cos(angleRad), y: VECTOR_LENGTH * Math.sin(angleRad) };
  // The actual projector: onto span{e_x} (rank 1) keeps only the
  // x-component; onto the whole plane (rank 2, degenerate) is the
  // identity — every vector already lies in its own eigenspace.
  const pv = mode === "line" ? { x: v.x, y: 0 } : { x: v.x, y: v.y };

  const span = VECTOR_LENGTH * 1.6;
  const scale = Math.min((WIDTH - 2 * PAD) / (2 * span), (height - 2 * PAD) / (2 * span));
  const toSvg = (x: number, y: number) => ({ x: WIDTH / 2 + x * scale, y: height / 2 - y * scale });

  const origin = toSvg(0, 0);
  const vSvg = toSvg(v.x, v.y);
  const pvSvg = toSvg(pv.x, pv.y);
  const dropLineVisible = Math.hypot(v.x - pv.x, v.y - pv.y) > 1e-6;
  // Whenever v already lies in the target eigenspace, Pv lands exactly on
  // v (always true in "plane" mode, since the whole plane is the
  // eigenspace; occasionally true in "line" mode too, at theta = 0 or
  // 180 degrees). A second arrow drawn on top of the first would just
  // hide it, so this case gets its own marker instead of a redundant
  // overlapping line.
  const coincide = !dropLineVisible;

  const axisEndX = toSvg(span, 0);
  const axisStartX = toSvg(-span, 0);
  const axisEndY = toSvg(0, span);
  const axisStartY = toSvg(0, -span);

  const stateDescription =
    mode === "line"
      ? "projecting onto the one-dimensional eigenspace spanned by the x-axis"
      : "projecting onto the two-dimensional eigenspace that is the whole plane, so the projection equals the original vector";

  return (
    <div className="not-prose space-y-3">
      <div className="panel-inset p-4">
        <svg
          width={WIDTH}
          height={height}
          viewBox={`0 0 ${WIDTH} ${height}`}
          className="w-full"
          role="img"
          aria-label={`${ariaLabel}. Currently ${stateDescription}. Vector v at ${angleDeg} degrees; its projection Pv, and a second projection of Pv landing on the same point, are shown.`}
        >
          {mode === "plane" && (
            <rect
              x={PAD / 2}
              y={PAD / 2}
              width={WIDTH - PAD}
              height={height - PAD}
              className="fill-accent/10"
            />
          )}
          <g className="stroke-border" strokeWidth={1}>
            <line x1={axisStartX.x} y1={axisStartX.y} x2={axisEndX.x} y2={axisEndX.y} />
            <line x1={axisStartY.x} y1={axisStartY.y} x2={axisEndY.x} y2={axisEndY.y} />
          </g>
          {mode === "line" && (
            <line
              x1={axisStartX.x}
              y1={axisStartX.y}
              x2={axisEndX.x}
              y2={axisEndX.y}
              strokeWidth={3}
              className="stroke-accent/70"
            />
          )}

          {dropLineVisible && (
            <line
              x1={vSvg.x}
              y1={vSvg.y}
              x2={pvSvg.x}
              y2={pvSvg.y}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              className="stroke-muted-foreground"
            />
          )}

          {/* Self-loop at Pv: a second dashed "projection" that starts and
              ends at the same point, the visual proof that P(Pv) = Pv. */}
          <path
            d={`M ${pvSvg.x} ${pvSvg.y} Q ${pvSvg.x + 14} ${pvSvg.y - 30} ${pvSvg.x - 14} ${pvSvg.y - 16}`}
            fill="none"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            className="stroke-accent"
            markerEnd={`url(#${idBase}-loop-arrow)`}
          />
          <text x={pvSvg.x + 18} y={pvSvg.y - 24} className="fill-accent text-[10px] font-medium">
            P(Pv) = Pv
          </text>

          <line
            x1={origin.x}
            y1={origin.y}
            x2={vSvg.x}
            y2={vSvg.y}
            strokeWidth={2.5}
            className="stroke-brand"
            markerEnd={`url(#${idBase}-arrow-brand)`}
          />
          <text
            x={vSvg.x + (vSvg.x - origin.x >= 0 ? 12 : -12)}
            y={vSvg.y - (vSvg.y - origin.y <= 0 ? 8 : -14)}
            textAnchor="middle"
            className="fill-brand text-[11px] font-medium"
          >
            v
          </text>

          {!coincide && (
            <line
              x1={origin.x}
              y1={origin.y}
              x2={pvSvg.x}
              y2={pvSvg.y}
              strokeWidth={2.5}
              className="stroke-accent"
              markerEnd={`url(#${idBase}-arrow-accent)`}
            />
          )}
          {coincide && (
            <circle
              cx={pvSvg.x}
              cy={pvSvg.y}
              r={8}
              fill="none"
              strokeWidth={1.5}
              strokeDasharray="2 2"
              className="stroke-accent"
            />
          )}
          <text x={pvSvg.x} y={pvSvg.y + 16} textAnchor="middle" className="fill-accent text-[11px] font-medium">
            {coincide ? "Pv = v" : "Pv"}
          </text>

          <circle cx={origin.x} cy={origin.y} r={2} className="fill-foreground" />

          <defs>
            <marker id={`${idBase}-arrow-brand`} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" className="fill-brand" />
            </marker>
            <marker id={`${idBase}-arrow-accent`} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" className="fill-accent" />
            </marker>
            <marker id={`${idBase}-loop-arrow`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" className="fill-accent" />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="panel-inset p-4">
        <label className="flex items-center justify-between text-xs font-medium text-foreground">
          <span>Rotate v</span>
          <span className="font-mono text-muted-foreground">θ = {angleDeg}°</span>
        </label>
        <input
          type="range"
          min={0}
          max={359}
          step={1}
          value={angleDeg}
          onChange={(e) => setAngleDeg(Number(e.target.value))}
          className="mt-2 w-full accent-brand"
          aria-label="Rotate the input vector v"
          aria-valuetext={`θ = ${angleDeg} degrees`}
        />
      </div>

      <PresetToggle
        options={MODE_OPTIONS}
        index={modeIndex}
        onChange={setModeIndex}
        ariaLabel="Choose which eigenspace to project onto"
      />
    </div>
  );
}
