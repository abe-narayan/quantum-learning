"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { PresetToggle } from "@/components/visualizations/PresetToggle";

const SPACING = 72;
const MARGIN = 56;
const WIDTH = MARGIN * 2 + 4 * SPACING;
const HEIGHT = MARGIN * 2 + 4 * SPACING + 34;
const TOP_OFFSET = 34;

/**
 * The distance-3 unrotated surface code patch this lesson builds explicitly:
 * 13 data qubits (q1..q13) on a checkerboard-coordinate grid (the standard
 * "Surface-25" layout -- a (2d-1)x(2d-1) = 5x5 coordinate grid where data
 * qubits sit at even-parity sites and stabilizers at odd-parity sites,
 * exactly equivalent to the earlier conceptual lesson's "qubits on edges,
 * stabilizers on vertices/faces" picture, just drawn with explicit
 * coordinates). Every stabilizer's qubit membership below was verified by
 * direct commutation computation in the lesson text, not merely drawn.
 */
const QUBITS = [
  { id: "q1", x: 0, y: 0 },
  { id: "q2", x: 2, y: 0 },
  { id: "q3", x: 4, y: 0 },
  { id: "q4", x: 1, y: 1 },
  { id: "q5", x: 3, y: 1 },
  { id: "q6", x: 0, y: 2 },
  { id: "q7", x: 2, y: 2 },
  { id: "q8", x: 4, y: 2 },
  { id: "q9", x: 1, y: 3 },
  { id: "q10", x: 3, y: 3 },
  { id: "q11", x: 0, y: 4 },
  { id: "q12", x: 2, y: 4 },
  { id: "q13", x: 4, y: 4 },
];

type StabilizerType = "X" | "Z";

const STABILIZERS: { id: string; type: StabilizerType; x: number; y: number; members: string[]; boundary: boolean }[] = [
  { id: "xA", type: "X", x: 0, y: 1, members: ["q4", "q1", "q6"], boundary: true },
  { id: "xB", type: "X", x: 2, y: 1, members: ["q4", "q5", "q2", "q7"], boundary: false },
  { id: "xC", type: "X", x: 4, y: 1, members: ["q5", "q3", "q8"], boundary: true },
  { id: "xD", type: "X", x: 0, y: 3, members: ["q9", "q6", "q11"], boundary: true },
  { id: "xE", type: "X", x: 2, y: 3, members: ["q9", "q10", "q7", "q12"], boundary: false },
  { id: "xF", type: "X", x: 4, y: 3, members: ["q10", "q8", "q13"], boundary: true },
  { id: "zA", type: "Z", x: 1, y: 0, members: ["q1", "q2", "q4"], boundary: true },
  { id: "zB", type: "Z", x: 3, y: 0, members: ["q2", "q3", "q5"], boundary: true },
  { id: "zC", type: "Z", x: 1, y: 2, members: ["q6", "q7", "q4", "q9"], boundary: false },
  { id: "zD", type: "Z", x: 3, y: 2, members: ["q7", "q8", "q5", "q10"], boundary: false },
  { id: "zE", type: "Z", x: 1, y: 4, members: ["q11", "q12", "q9"], boundary: true },
  { id: "zF", type: "Z", x: 3, y: 4, members: ["q12", "q13", "q10"], boundary: true },
];

const LOGICAL_X = ["q6", "q7", "q8"];
const LOGICAL_Z = ["q2", "q7", "q12"];

type Mode = "x-bulk" | "z-bulk" | "commute" | "logical-x" | "logical-z";

const MODE_OPTIONS: { label: string }[] = [
  { label: "X-stabilizer" },
  { label: "Z-stabilizer" },
  { label: "Commutation check" },
  { label: "Logical X̄" },
  { label: "Logical Z̄" },
];
const MODES: Mode[] = ["x-bulk", "z-bulk", "commute", "logical-x", "logical-z"];

function px(x: number) {
  return MARGIN + x * SPACING;
}
function py(y: number) {
  return MARGIN + y * SPACING + TOP_OFFSET;
}

function describeMode(mode: Mode): string {
  switch (mode) {
    case "x-bulk":
      return "X-stabilizer xB = X⁴ on q4, q5, q2, q7 (weight 4, bulk): a face stabilizer touching the 4 data qubits surrounding its site.";
    case "z-bulk":
      return "Z-stabilizer zC = Z⁴ on q6, q7, q4, q9 (weight 4, bulk): a vertex stabilizer touching the 4 data qubits surrounding its site.";
    case "commute":
      return "xB (q4,q5,q2,q7) and zC (q6,q7,q4,q9) share exactly 2 qubits, q4 and q7. X and Z anticommute at each shared qubit individually, but two sign flips cancel, so xB and zC commute overall — the CSS commutation check, applied concretely.";
    case "logical-x":
      return "Logical X̄ = X⊗X⊗X on q6, q7, q8 (weight 3): a horizontal string running from the left rough boundary to the right rough boundary through the center qubit q7.";
    case "logical-z":
      return "Logical Z̄ = Z⊗Z⊗Z on q2, q7, q12 (weight 3): a vertical string running from the top smooth boundary to the bottom smooth boundary through the same center qubit q7 — X̄ and Z̄ share exactly q7, so they anticommute, the correct structure for one logical qubit's own X and Z.";
  }
}

/**
 * An explicit, interactive diagram of the distance-3 unrotated surface code
 * patch this lesson builds: 13 data qubits, 6 X-type (face) stabilizers, and
 * 6 Z-type (vertex) stabilizers, laid out on real (checkerboard) coordinates
 * rather than described only in prose. A mode selector highlights one
 * worked check at a time -- a bulk X-stabilizer, a bulk Z-stabilizer, the
 * two sharing exactly 2 qubits (the commutation check), and the two
 * weight-3 logical operators -- while the full lattice (all 12 stabilizers,
 * drawn at reduced opacity when not selected) stays visible throughout, so
 * the highlighted piece is always seen in the context of the whole patch.
 */
export function SurfaceCodePatchExplorer({ ariaLabel }: { ariaLabel: string }) {
  const [modeIndex, setModeIndex] = useState(2);
  const mode = MODES[modeIndex];

  const highlightedStabilizerIds = useMemo(() => {
    if (mode === "x-bulk") return new Set(["xB"]);
    if (mode === "z-bulk") return new Set(["zC"]);
    if (mode === "commute") return new Set(["xB", "zC"]);
    return new Set<string>();
  }, [mode]);

  const highlightedQubitIds = useMemo(() => {
    if (mode === "logical-x") return new Set(LOGICAL_X);
    if (mode === "logical-z") return new Set(LOGICAL_Z);
    if (mode === "commute") return new Set(["q4", "q7"]);
    return new Set<string>();
  }, [mode]);

  const qubitPos = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    QUBITS.forEach((q) => map.set(q.id, q));
    return map;
  }, []);

  return (
    <div className="not-prose space-y-4 rounded-xl border border-border bg-surface-muted/40 p-4 sm:p-5">
      <div className="overflow-x-auto">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
          <text x={WIDTH / 2} y={16} textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">
            distance-3 unrotated surface code: 13 data qubits, 6 X-stabilizers, 6 Z-stabilizers
          </text>

          {/* rough (left/right) vs smooth (top/bottom) boundary labels */}
          <text x={px(0) - 34} y={py(2) + 4} textAnchor="middle" className="fill-accent text-[9.5px] font-semibold" transform={`rotate(-90 ${px(0) - 34} ${py(2) + 4})`}>
            rough boundary
          </text>
          <text x={px(4) + 34} y={py(2) + 4} textAnchor="middle" className="fill-accent text-[9.5px] font-semibold" transform={`rotate(90 ${px(4) + 34} ${py(2) + 4})`}>
            rough boundary
          </text>
          <text x={px(2)} y={py(0) - 30} textAnchor="middle" className="fill-brand text-[9.5px] font-semibold">
            smooth boundary
          </text>
          <text x={px(2)} y={py(4) + 34} textAnchor="middle" className="fill-brand text-[9.5px] font-semibold">
            smooth boundary
          </text>

          {/* stabilizer-to-qubit connecting lines */}
          {STABILIZERS.map((s) =>
            s.members.map((mId) => {
              const q = qubitPos.get(mId)!;
              const active = highlightedStabilizerIds.has(s.id);
              return (
                <line
                  key={`${s.id}-${mId}`}
                  x1={px(s.x)}
                  y1={py(s.y)}
                  x2={px(q.x)}
                  y2={py(q.y)}
                  className={active ? (s.type === "X" ? "stroke-accent" : "stroke-brand") : "stroke-border"}
                  strokeWidth={active ? 2 : 1}
                />
              );
            })
          )}

          {/* logical operator path (drawn on top of the faint stabilizer lines) */}
          {(mode === "logical-x" || mode === "logical-z") &&
            (() => {
              const path = mode === "logical-x" ? LOGICAL_X : LOGICAL_Z;
              const colorClass = mode === "logical-x" ? "stroke-accent" : "stroke-brand";
              return path.slice(1).map((id, i) => {
                const a = qubitPos.get(path[i])!;
                const b = qubitPos.get(id)!;
                return (
                  <line
                    key={`logical-${i}`}
                    x1={px(a.x)}
                    y1={py(a.y)}
                    x2={px(b.x)}
                    y2={py(b.y)}
                    className={colorClass}
                    strokeWidth={4}
                    strokeLinecap="round"
                  />
                );
              });
            })()}

          {/* stabilizer site markers */}
          {STABILIZERS.map((s) => {
            const active = highlightedStabilizerIds.has(s.id);
            const isX = s.type === "X";
            return (
              <g key={s.id}>
                <rect
                  x={px(s.x) - (active ? 12 : 8)}
                  y={py(s.y) - (active ? 12 : 8)}
                  width={active ? 24 : 16}
                  height={active ? 24 : 16}
                  rx={4}
                  className={
                    isX
                      ? active
                        ? "fill-accent/30 stroke-accent"
                        : "fill-accent/10 stroke-accent/40"
                      : active
                        ? "fill-brand/30 stroke-brand"
                        : "fill-brand/10 stroke-brand/40"
                  }
                  strokeWidth={active ? 2.5 : 1.25}
                  strokeDasharray={s.boundary ? "3 2" : undefined}
                />
                {active && (
                  <text x={px(s.x)} y={py(s.y) - 16} textAnchor="middle" className={cn("text-[9.5px] font-semibold", isX ? "fill-accent" : "fill-brand")}>
                    {s.id}
                  </text>
                )}
              </g>
            );
          })}

          {/* data qubits, drawn last so they sit on top */}
          {QUBITS.map((q) => {
            const highlighted = highlightedQubitIds.has(q.id);
            return (
              <g key={q.id}>
                <circle
                  cx={px(q.x)}
                  cy={py(q.y)}
                  r={highlighted ? 11 : 8}
                  className={highlighted ? "fill-foreground stroke-2 stroke-warning" : "fill-foreground"}
                />
                <text x={px(q.x)} y={py(q.y) - 14} textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">
                  {q.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground">Highlight</h3>
        <div className="mt-2">
          <PresetToggle options={MODE_OPTIONS} index={modeIndex} onChange={setModeIndex} ariaLabel="Which stabilizer or logical operator to highlight" />
        </div>
      </div>

      <div aria-live="polite" className="rounded-xl border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
        {describeMode(mode)}
      </div>
    </div>
  );
}
