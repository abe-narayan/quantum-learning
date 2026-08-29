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
 *
 * `variant="merge-split"` switches to a second, independent picture built
 * on the same lattice-drawing convention (qubit = filled circle, stabilizer
 * site = rounded square, brand = Z-type/vertical, accent = boundary): two
 * small single-face patches undergoing lattice surgery, replacing
 * `lattice-surgery.mdx`'s hand-rolled, non-interactive 3-panel `<svg>` with
 * a real Before / Merging / After toggle over one lattice, not three frozen
 * copies. Defaults to `"patch"` so every existing call site (currently just
 * `surface-codes-in-depth.mdx`, which passes no `variant`) is unaffected.
 */
export function SurfaceCodePatchExplorer({
  ariaLabel,
  variant = "patch",
}: {
  ariaLabel: string;
  variant?: "patch" | "merge-split";
}) {
  if (variant === "merge-split") {
    return <MergeSplitPatchExplorer ariaLabel={ariaLabel} />;
  }
  return <SinglePatchExplorer ariaLabel={ariaLabel} />;
}

function SinglePatchExplorer({ ariaLabel }: { ariaLabel: string }) {
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
    <div className="not-prose space-y-4 panel-inset p-4 sm:p-5">
      <div className="overflow-x-auto">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
          {/* Type sizes throughout this SVG were raised, and the divisor the
              last pass used was wrong. The box is 254px, not 288px: 288 is the *page column* on a 320px phone
              (320 less Container's `px-4` gutters), but this SVG renders inside
              `panel-inset p-4`, and `panel-inset` (globals.css) supplies border,
              radius and fill and no padding at all — the `p-4` does. Subtract
              2 x (16px padding + 1px border) = 34px.
              This viewBox is 400 wide, so the scale is 254/400 = 0.635, not
              0.72: the old 9, 9.5 and 11 unit sizes painted at 5.7px, 6.0px
              and 7.0px, and of the sizes that replaced them 15 units was fine
              (9.53px) while **13 units painted at 8.26px** and stayed under
              the floor. Everything is 15 now.

              Nothing collides at 15: the boundary labels are ~105-112 units
              of body face against a 72-unit lattice spacing, and the two
              rotated "rough boundary" labels run vertically (their horizontal
              extent is one cap height around x = 22 and x = 378).

              The caption is split in two because it never fit: 82 characters
              of monospace needed ~540 units inside a 400-unit box even at the
              old size, so its tail was being clipped by the viewBox edge on
              every screen, not just narrow ones. */}
          <text x={WIDTH / 2} y={16} textAnchor="middle" fontSize={15} className="fill-axis font-mono">
            distance-3 unrotated surface code
          </text>
          <text x={WIDTH / 2} y={34} textAnchor="middle" fontSize={15} className="fill-axis font-mono">
            13 data qubits, 6 X- and 6 Z-stabilizers
          </text>

          {/* rough (left/right) vs smooth (top/bottom) boundary labels */}
          <text x={px(0) - 34} y={py(2) + 4} textAnchor="middle" fontSize={15} className="fill-accent font-semibold" transform={`rotate(-90 ${px(0) - 34} ${py(2) + 4})`}>
            rough boundary
          </text>
          <text x={px(4) + 34} y={py(2) + 4} textAnchor="middle" fontSize={15} className="fill-accent font-semibold" transform={`rotate(90 ${px(4) + 34} ${py(2) + 4})`}>
            rough boundary
          </text>
          <text x={px(2)} y={py(0) - 30} textAnchor="middle" fontSize={15} className="fill-brand font-semibold">
            smooth boundary
          </text>
          <text x={px(2)} y={py(4) + 36} textAnchor="middle" fontSize={15} className="fill-brand font-semibold">
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
                  // The stabilizer-to-qubit edges ARE the lattice: which
                  // data qubits a stabilizer acts on is read entirely off
                  // them, and this component's own docstring promises that
                  // "the full lattice ... stays visible throughout, so the
                  // highlighted piece is always seen in the context of the
                  // whole patch". At `stroke-border` — the panel-edge token,
                  // 1.41:1 on `--surface-muted`, under the 3:1 WCAG 2.1 SC
                  // 1.4.11 floor — that context was not actually visible on
                  // the dark theme, so every mode read as three or four
                  // floating lines rather than as one piece of a lattice.
                  // `--axis` clears 3:1 everywhere; the highlighted edges
                  // stay distinguishable by being brand/accent coloured at
                  // double the weight.
                  className={active ? (s.type === "X" ? "stroke-accent" : "stroke-brand") : "stroke-axis"}
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
                  <text x={px(s.x)} y={py(s.y) - 18} textAnchor="middle" fontSize={15} className={cn("font-semibold", isX ? "fill-accent" : "fill-brand")}>
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
                <text x={px(q.x)} y={py(q.y) - 16} textAnchor="middle" fontSize={15} className="fill-axis font-mono">
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

      <div aria-live="polite" className="rounded-panel border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
        {describeMode(mode)}
      </div>
    </div>
  );
}

// --- Lattice surgery: two small patches, merge/split ------------------

type MergeStage = "before" | "merging" | "after";
const MERGE_STAGE_OPTIONS: { label: string }[] = [{ label: "Before" }, { label: "Merging" }, { label: "After" }];
const MERGE_STAGES: MergeStage[] = ["before", "merging", "after"];

/** Same single-face-patch corner/edge layout as the lesson's own hand-drawn diagram, reused for both patches via a translate offset per patch. */
const PATCH_CORNERS: [number, number][] = [
  [40, 90],
  [100, 90],
  [40, 210],
  [100, 210],
];
const PATCH_EDGE_QUBITS: [number, number][] = [
  [70, 90],
  [70, 210],
  [40, 150],
  [100, 150],
];

function describeMergeStage(stage: MergeStage): string {
  switch (stage) {
    case "before":
      return "Two independent patches L1, L2: a physical gap separates them (their smooth boundaries face each other), each with its own weight-2 logical Z string and its own code space. No stabilizer spans both patches.";
    case "merging":
      return "Two bridge qubits fill the gap and the seam vertex stabilizer is extended onto them, so the joint operator Z_L1·Z_L2 becomes measurable. Measuring it projects the pair onto one definite eigenvalue, merging the two code spaces into one logical qubit with one logical string running through both patches.";
    case "after":
      return "The bridge qubits are removed and the gap is restored: two independent patches and two independent logical strings again, but the value of Z_L1·Z_L2 measured during the merge is now known — this is how lattice surgery reads out a joint parity without ever needing a transversal two-qubit gate.";
  }
}

function LatticeSurgeryPatch({
  offsetX,
  logicalLabel,
  showBridge,
  bridgeFilled,
}: {
  offsetX: number;
  logicalLabel: string;
  /** Whether this patch's inner edge faces the seam (draws the seam-side bridge-qubit slots). */
  showBridge: "left" | "right" | null;
  bridgeFilled: boolean;
}) {
  return (
    <g transform={`translate(${offsetX},0)`}>
      {/* The patch outline. It is the object under discussion at every stage
          of this toggle — "two independent patches" versus "one merged
          patch" is a claim about these rectangles — so it moves off
          `--border` (the panel-edge token, 1.41:1 on `--surface-muted`,
          under the 3:1 WCAG 2.1 SC 1.4.11 floor) onto `--axis`, which clears
          3:1 on every panel depth in both themes. */}
      <rect x={40} y={90} width={60} height={120} className="fill-none stroke-axis" strokeWidth={2} />
      {PATCH_CORNERS.map(([cx, cy]) => (
        <circle key={`v-${cx}-${cy}`} cx={cx} cy={cy} r={4} className="fill-foreground" />
      ))}
      {PATCH_EDGE_QUBITS.map(([qx, qy]) => (
        <rect key={`q-${qx}-${qy}`} x={qx - 7} y={qy - 7} width={14} height={14} rx={3} className="fill-muted-foreground/10 stroke-muted-foreground" strokeWidth={1.5} />
      ))}
      <line x1={40} y1={150} x2={100} y2={150} className="stroke-brand" strokeWidth={2} strokeDasharray="6 3" />
      {/* This panel's viewBox is 340 and it renders `w-full max-w-md`, so the
          scale is (box / 340) — and the box is not the 288px the last pass
          used. The box is 254px, not 288px: 288 is the *page column* on a 320px phone
          (320 less Container's `px-4` gutters), but this SVG renders inside
          `panel-inset p-4`, and `panel-inset` (globals.css) supplies border,
          radius and fill and no padding at all — the `p-4` does. Subtract
          2 x (16px padding + 1px border) = 34px.
          At the real 254px the scale is 0.747, not 0.847: 9.5 units painted at
          7.1px, 9 units at 6.7px, and the 12 units chosen to land "at 10.2px"
          actually landed at **8.96px** — a rounding error away from the floor
          rather than clear of it. 13 units gives 9.71px. */}
      <text x={70} y={240} textAnchor="middle" fontSize={13} className="fill-axis font-medium">
        {logicalLabel}
      </text>
      {showBridge && (
        <rect
          x={(showBridge === "right" ? 100 : 40) - 7}
          y={143}
          width={14}
          height={14}
          rx={3}
          className={bridgeFilled ? "fill-brand/70 stroke-brand" : "fill-none stroke-brand/40"}
          strokeWidth={1.5}
          strokeDasharray={bridgeFilled ? undefined : "3 2"}
        />
      )}
    </g>
  );
}

/**
 * The merge/split lattice-surgery picture, driven by a real Before /
 * Merging / After toggle over one shared lattice rather than three frozen
 * panels: two small (single-face, weight-2-logical) surface-code patches
 * with a gap between them, two bridge qubits that appear only in the
 * "Merging" stage, and the seam Z string that spans both patches only
 * while those bridge qubits are present. Geometry mirrors
 * `surface-codes-in-depth.mdx`'s lattice convention (data qubit = filled
 * square/circle, stabilizer/vertex = corner dot) at the smallest legible
 * size, exactly as the lesson's own retired hand-drawn version did.
 */
function MergeSplitPatchExplorer({ ariaLabel }: { ariaLabel: string }) {
  const [stageIndex, setStageIndex] = useState(0);
  const stage = MERGE_STAGES[stageIndex];
  const merging = stage === "merging";

  return (
    <div className="not-prose space-y-4 panel-inset p-4 sm:p-5">
      <div className="overflow-x-auto">
        <svg width={340} height={300} viewBox="0 0 340 300" className="mx-auto w-full max-w-md" role="img" aria-label={ariaLabel}>
          <text x={170} y={22} textAnchor="middle" fontSize={15} className="fill-foreground font-semibold">
            {stage === "before" ? "Two independent patches" : stage === "merging" ? "Joint Z stabilizer measured" : "Split apart again"}
          </text>

          {/* Seam gap markers — dashed accent lines showing the smooth boundaries facing each other, absent while merging. */}
          {!merging && (
            <>
              <line x1={100} y1={100} x2={100} y2={200} className="stroke-accent" strokeWidth={2} strokeDasharray="4 3" />
              <line x1={140} y1={100} x2={140} y2={200} className="stroke-accent" strokeWidth={2} strokeDasharray="4 3" />
            </>
          )}

          <LatticeSurgeryPatch offsetX={0} logicalLabel="Z_L1" showBridge="right" bridgeFilled={merging} />
          <LatticeSurgeryPatch offsetX={100} logicalLabel="Z_L2" showBridge="left" bridgeFilled={merging} />

          {/* The seam string spanning both patches, only while bridge qubits are present. */}
          {merging && (
            <>
              <rect x={160} y={78} width={72} height={30} rx={6} className="fill-brand/15 stroke-brand" strokeWidth={2} />
              <line x1={40} y1={150} x2={300} y2={150} className="stroke-brand" strokeWidth={2.5} strokeDasharray="6 3" />
              <text x={170} y={64} textAnchor="middle" fontSize={13} className="fill-brand font-medium">
                seam vertex gains the bridge qubits
              </text>
              <text x={170} y={262} textAnchor="middle" fontSize={13} className="fill-brand font-medium">
                Z_L(merged) = Z_L1·Z_L2
              </text>
            </>
          )}

          {/* "independent" dropped from the second branch. At 13 units the
              48-character original is ~324 units of body face centred at x =
              170, i.e. 8..332 in a 340-unit viewBox — inside it only if the
              face's average advance is exactly what was assumed, and clipped
              at both ends if a fallback face is a hair wider. The 36 kept are
              ~234 units (53..287), and the heading directly above this panel
              already says "Two independent patches". */}
          <text x={170} y={284} textAnchor="middle" fontSize={13} className="fill-axis">
            {merging ? "1 logical qubit, 1 code space" : "2 patches, gap: no shared stabilizers"}
          </text>
        </svg>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground">Stage</h3>
        <div className="mt-2">
          <PresetToggle options={MERGE_STAGE_OPTIONS} index={stageIndex} onChange={setStageIndex} ariaLabel="Lattice surgery stage" />
        </div>
      </div>

      <div aria-live="polite" className="rounded-panel border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
        {describeMergeStage(stage)}
      </div>
    </div>
  );
}
