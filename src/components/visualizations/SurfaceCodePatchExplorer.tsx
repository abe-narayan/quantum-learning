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
      return "xB (q4,q5,q2,q7) and zC (q6,q7,q4,q9) share exactly 2 qubits, q4 and q7. X and Z anticommute at each shared qubit individually, but two sign flips cancel, so xB and zC commute overall: the CSS commutation check, applied concretely.";
    case "logical-x":
      return "Logical X̄ = X⊗X⊗X on q6, q7, q8 (weight 3): a horizontal string running from the left rough boundary to the right rough boundary through the center qubit q7.";
    case "logical-z":
      return "Logical Z̄ = Z⊗Z⊗Z on q2, q7, q12 (weight 3): a vertical string running from the top smooth boundary to the bottom smooth boundary through the same center qubit q7. X̄ and Z̄ share exactly q7, so they anticommute, the correct structure for one logical qubit's own X and Z.";
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
 * site = rounded square, brand = vertex/Z-type, accent = face/X-type): two
 * two-face patches undergoing lattice surgery across their facing **rough**
 * boundaries, replacing `lattice-surgery.mdx`'s hand-rolled,
 * non-interactive 3-panel `<svg>` with a real Before / Merging / After
 * toggle over one lattice, not three frozen copies. Defaults to `"patch"`
 * so every existing call site (currently just `surface-codes-in-depth.mdx`,
 * which passes no `variant`) is unaffected.
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
          {/* `fill-muted-foreground`, not `fill-axis`, for these two title lines.
              They are prose naming the figure, not marks anything is measured
              against, and `--axis` (4.5:1) sits a step *below*
              `--muted-foreground` (6.78:1): putting prose on it lowers the
              contrast of the only two lines that say what the picture is.
              `--axis` keeps the qubit ids, the boundary names and the lattice
              itself, which are the marks a reader actually reads positions
              off. */}
          <text x={WIDTH / 2} y={16} textAnchor="middle" fontSize={15} className="fill-muted-foreground font-mono">
            distance-3 unrotated surface code
          </text>
          <text x={WIDTH / 2} y={34} textAnchor="middle" fontSize={15} className="fill-muted-foreground font-mono">
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

      <div aria-live="polite" aria-atomic="true" className="rounded-panel border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
        {describeMode(mode)}
      </div>
    </div>
  );
}

// --- Lattice surgery: two small patches, merge/split ------------------

type MergeStage = "before" | "merging" | "after";
const MERGE_STAGE_OPTIONS: { label: string }[] = [{ label: "Before" }, { label: "Merging" }, { label: "After" }];
const MERGE_STAGES: MergeStage[] = ["before", "merging", "after"];

/**
 * Lattice coordinates, in exactly the scheme `surface-codes-in-depth.mdx`
 * fixes: a site with x+y even holds a data qubit, x odd / y even is a
 * *vertex* (Z-type) stabilizer, x even / y odd is a *face* (X-type) one.
 * Each patch here is a two-face column, the smallest patch that reproduces
 * this lesson's own merge ledger rather than a schematic that does not:
 *
 *   L1 on x = 0..2, L2 on x = 4..6, both on y = 0..4, gap column x = 3.
 *
 * Per patch: 8 data qubits, 3 vertex (Z) generators of weight 3, 4, 3 and
 * 4 face (X) generators of weight 3, so m = 7 and k = 8 - 7 = 1. Merging
 * adds b = 2 bridge qubits at (3,1) and (3,3) and b+1 = 3 new vertex
 * generators at (3,0), (3,2), (3,4) of weight 3, 4, 3 — the lesson's
 * "weight 4 in the middle of the seam and weight 3 at the seam's two
 * ends" — giving n = 18, m = 17, k = 1.
 *
 * The boundary labels follow from those coordinates and are not a stylistic
 * choice: the *face* generators are the ones truncated on x = 0 and x = 2,
 * so left/right is **rough**; the *vertex* generators are the ones
 * truncated on y = 0 and y = 4, so top/bottom is **smooth**. Z̄ is
 * therefore the vertical column string (smooth to smooth) and X̄ the
 * horizontal row string (rough to rough), matching the single-patch panel
 * above. Two patches placed side by side face each other along **rough**
 * edges, the seam sites in the gap column are vertex (Z-type) sites, and
 * the product of the three seam generators is Z̄₁Z̄₂ with every bridge
 * qubit cancelling between its two neighbours: a rough merge measures
 * Z̄₁Z̄₂. (The literature more often runs the dual assignment, vertex =
 * X-type, in which the same physical picture is described as a *smooth*
 * merge measuring Z⊗Z. Same construction, X and Z relabelled throughout.)
 */
const MERGE_X0 = 65;
const MERGE_DX = 35;
const MERGE_Y0 = 90;
const MERGE_DY = 30;
const mx = (x: number) => MERGE_X0 + x * MERGE_DX;
const my = (y: number) => MERGE_Y0 + y * MERGE_DY;

const PATCH_COLUMNS = [
  [0, 1, 2],
  [4, 5, 6],
];

/** Sites of one kind, listed by lattice coordinate, for the given columns. */
function sitesIn(columns: number[], kind: "data" | "vertex" | "face"): [number, number][] {
  const out: [number, number][] = [];
  for (const x of columns) {
    for (let y = 0; y <= 4; y += 1) {
      const even = (x + y) % 2 === 0;
      if (kind === "data" && even) out.push([x, y]);
      if (kind === "vertex" && !even && x % 2 === 1) out.push([x, y]);
      if (kind === "face" && !even && x % 2 === 0) out.push([x, y]);
    }
  }
  return out;
}

const PATCH_DATA = PATCH_COLUMNS.flatMap((c) => sitesIn(c, "data"));
const PATCH_VERTEX = PATCH_COLUMNS.flatMap((c) => sitesIn(c, "vertex"));
const PATCH_FACE = PATCH_COLUMNS.flatMap((c) => sitesIn(c, "face"));
const BRIDGE_DATA = sitesIn([3], "data");
const SEAM_VERTEX = sitesIn([3], "vertex");

/** The (up to 4) data qubits a stabilizer site touches, given which data qubits exist. */
function stabilizerEdges(site: [number, number], data: [number, number][]): [number, number][] {
  const [x, y] = site;
  const cand: [number, number][] = [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ];
  return cand.filter(([cx, cy]) => data.some(([dx, dy]) => dx === cx && dy === cy));
}

function describeMergeStage(stage: MergeStage): string {
  switch (stage) {
    case "before":
      return "Two independent patches, L1 and L2, separated by a physical gap. Each carries 8 data qubits, 3 vertex (Z-type) and 4 face (X-type) generators, and so one logical qubit of its own. Their facing edges are rough boundaries (the face generators are the truncated ones there), so each patch's Z string runs vertically, top smooth boundary to bottom smooth boundary, parallel to the gap. No generator spans both patches.";
    case "merging":
      return "Two bridge qubits fill the gap and three new vertex (Z-type) generators switch on along the seam, weight 3 at each end and weight 4 in the middle. Multiply all three together: every bridge qubit sits in exactly two of them and cancels, leaving Z on L1's seam-side column times Z on L2's, which is Z_L1·Z_L2. That product is now a stabilizer, so the merge has measured it. Z_L1 and Z_L2 have become two representatives of the merged patch's single Z string, while X_L1 alone anticommutes with the middle seam generator and dies: only the joined string X_L1·X_L2 survives as a logical X.";
    case "after":
      return "The bridge qubits are measured out and discarded and the gap is restored: two independent patches and two independent logical qubits again. What does not come back is the state the merge projected. The classical outcome of Z_L1·Z_L2 is now on record, which is how lattice surgery reads a joint parity using nothing but the local stabilizer measurements the code already runs.";
  }
}

function LatticeSurgeryPatch({ columns }: { columns: number[] }) {
  const data = sitesIn(columns, "data");
  const vertex = sitesIn(columns, "vertex");
  const face = sitesIn(columns, "face");
  return (
    <g>
      {[...vertex, ...face].map((site) =>
        stabilizerEdges(site, data).map(([qx, qy]) => (
          <line
            key={`e-${site[0]}-${site[1]}-${qx}-${qy}`}
            x1={mx(site[0])}
            y1={my(site[1])}
            x2={mx(qx)}
            y2={my(qy)}
            className="stroke-axis"
            strokeWidth={1}
          />
        ))
      )}
    </g>
  );
}

/**
 * The merge/split lattice-surgery picture, driven by a real Before /
 * Merging / After toggle over one shared lattice rather than three frozen
 * panels. Drawing convention matches the single-patch panel above exactly:
 * a data qubit is a filled circle, a stabilizer site is a rounded square,
 * brand = vertex/Z-type, accent = face/X-type. Two two-face patches sit
 * side by side across a gap; the "Merging" stage fills the gap with the
 * two bridge qubits and switches on the three seam vertex generators the
 * lesson's own ledger counts.
 */
function MergeSplitPatchExplorer({ ariaLabel }: { ariaLabel: string }) {
  const [stageIndex, setStageIndex] = useState(0);
  const stage = MERGE_STAGES[stageIndex];
  const merging = stage === "merging";
  const allData = merging ? [...PATCH_DATA, ...BRIDGE_DATA] : PATCH_DATA;

  return (
    <div className="not-prose space-y-4 panel-inset p-4 sm:p-5">
      <div className="overflow-x-auto">
        <svg width={340} height={300} viewBox="0 0 340 300" className="mx-auto w-full max-w-md" role="img" aria-label={ariaLabel}>
          {/* This panel's viewBox is 340 and it renders `w-full max-w-md`, so
              the scale is (box / 340), and the box is 254px: 288 is the *page
              column* on a 320px phone (320 less Container's `px-4` gutters),
              but this SVG renders inside `panel-inset p-4`, and `panel-inset`
              (globals.css) supplies border, radius and fill and no padding at
              all — the `p-4` does. Subtract 2 x (16px padding + 1px border)
              = 34px. At 254px the scale is 0.747, so 13 units paints at
              9.71px and 15 units at 11.2px; nothing here goes below 13. */}
          <text x={170} y={22} textAnchor="middle" fontSize={15} className="fill-foreground font-semibold">
            {stage === "before" ? "Two independent patches" : stage === "merging" ? "Seam vertex generators on" : "Split apart again"}
          </text>
          <text x={170} y={42} textAnchor="middle" fontSize={13} className="fill-muted-foreground">
            {merging ? "Z_L1·Z_L2 is now a stabilizer" : "rough edges face the gap"}
          </text>

          {/* Lattice edges first, so qubits and stabilizer sites sit on top. */}
          {PATCH_COLUMNS.map((columns) => (
            <LatticeSurgeryPatch key={`patch-${columns[0]}`} columns={columns} />
          ))}
          {merging &&
            SEAM_VERTEX.map((site) =>
              stabilizerEdges(site, allData).map(([qx, qy]) => (
                <line
                  key={`se-${site[1]}-${qx}-${qy}`}
                  x1={mx(site[0])}
                  y1={my(site[1])}
                  x2={mx(qx)}
                  y2={my(qy)}
                  className="stroke-brand"
                  strokeWidth={1.5}
                />
              ))
            )}

          {/* Logical strings. Z̄ is vertical (smooth boundary to smooth
              boundary, parallel to the seam); X̄ is horizontal (rough to
              rough, perpendicular to it). The merge identifies the two Z
              strings with each other and joins the two X strings into one. */}
          <line x1={mx(0)} y1={my(0)} x2={mx(0)} y2={my(4)} className="stroke-brand" strokeWidth={3.5} strokeLinecap="round" />
          <line x1={mx(6)} y1={my(0)} x2={mx(6)} y2={my(4)} className="stroke-brand" strokeWidth={3.5} strokeLinecap="round" />
          {merging ? (
            <line x1={mx(0)} y1={my(2)} x2={mx(6)} y2={my(2)} className="stroke-accent" strokeWidth={3.5} strokeLinecap="round" />
          ) : (
            <>
              <line x1={mx(0)} y1={my(2)} x2={mx(2)} y2={my(2)} className="stroke-accent" strokeWidth={3.5} strokeLinecap="round" />
              <line x1={mx(4)} y1={my(2)} x2={mx(6)} y2={my(2)} className="stroke-accent" strokeWidth={3.5} strokeLinecap="round" />
            </>
          )}

          {/* Stabilizer sites. */}
          {[...PATCH_VERTEX, ...(merging ? SEAM_VERTEX : [])].map(([x, y]) => (
            <rect
              key={`v-${x}-${y}`}
              x={mx(x) - 8}
              y={my(y) - 8}
              width={16}
              height={16}
              rx={4}
              className={x === 3 ? "fill-brand/30 stroke-brand" : "fill-brand/10 stroke-brand/60"}
              strokeWidth={x === 3 ? 2 : 1.25}
            />
          ))}
          {PATCH_FACE.map(([x, y]) => (
            <rect
              key={`f-${x}-${y}`}
              x={mx(x) - 8}
              y={my(y) - 8}
              width={16}
              height={16}
              rx={4}
              className="fill-accent/10 stroke-accent/60"
              strokeWidth={1.25}
              strokeDasharray="3 2"
            />
          ))}

          {/* Data qubits, drawn last. The two bridge slots stay visible as
              empty outlines when the patches are apart, so the reader can
              see what the merge adds and the split takes away. */}
          {PATCH_DATA.map(([x, y]) => (
            <circle key={`q-${x}-${y}`} cx={mx(x)} cy={my(y)} r={5} className="fill-foreground" />
          ))}
          {BRIDGE_DATA.map(([x, y]) => (
            <circle
              key={`b-${x}-${y}`}
              cx={mx(x)}
              cy={my(y)}
              r={5}
              className={merging ? "fill-brand stroke-brand" : "fill-none stroke-brand/40"}
              strokeWidth={1.5}
              strokeDasharray={merging ? undefined : "3 2"}
            />
          ))}

          <text x={mx(1)} y={244} textAnchor="middle" fontSize={13} className="fill-brand font-medium">
            Z_L1
          </text>
          <text x={mx(5)} y={244} textAnchor="middle" fontSize={13} className="fill-brand font-medium">
            Z_L2
          </text>
          <text x={170} y={266} textAnchor="middle" fontSize={13} className="fill-accent font-medium">
            {merging ? "X_L(merged) = X_L1·X_L2" : "X_L1, X_L2 separate"}
          </text>
          {/* Caption prose, so `--muted-foreground` (6.78:1) rather than
              `--axis` (4.5:1): this line states the panel's conclusion in
              words, it is not a mark anything is measured against. */}
          <text x={170} y={288} textAnchor="middle" fontSize={13} className="fill-muted-foreground">
            {merging ? "n=18, 17 generators, 1 logical qubit" : "n=16, 14 generators, 2 logical qubits"}
          </text>
        </svg>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground">Stage</h3>
        <div className="mt-2">
          <PresetToggle options={MERGE_STAGE_OPTIONS} index={stageIndex} onChange={setStageIndex} ariaLabel="Lattice surgery stage" />
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true" className="rounded-panel border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
        {describeMergeStage(stage)}
      </div>
    </div>
  );
}
