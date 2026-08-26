/**
 * MDX usage (Apex complexity-theory lessons):
 *
 *   <ComplexityClassDiagram
 *     outer={{ id: "PSPACE", label: "PSPACE" }}
 *     lensA={{ id: "BQP", label: "BQP" }}
 *     lensB={{ id: "NP", label: "NP" }}
 *     core={{ id: "P", label: "P" }}
 *     openLabel="NP⊆BQP? / BQP⊆NP?"
 *     ariaLabel="Containment diagram: P proven inside both BQP and NP, both proven inside PSPACE; whether BQP and NP contain one another is open."
 *   />
 *
 *   // With a solid QMA ring (NP⊆QMA⊆PSPACE proven) and a specific
 *   // QMA-complete problem marked on its boundary:
 *   <ComplexityClassDiagram
 *     outer={{ id: "PSPACE", label: "PSPACE" }}
 *     ring={{ id: "QMA", label: "QMA" }}
 *     lensA={{ id: "BQP", label: "BQP" }}
 *     lensB={{ id: "NP", label: "NP" }}
 *     core={{ id: "P", label: "P" }}
 *     openLabel="NP⊆BQP? / BQP⊆NP?"
 *     markedPoint={{ label: "Local Hamiltonian", note: "QMA-complete" }}
 *     ariaLabel="..."
 *   />
 *
 * A nested/overlap complexity-class containment diagram — the reusable
 * version of the hand-drawn inline SVG that
 * `complexity-classes-p-np-and-bqp.mdx` and `the-local-hamiltonian-problem.mdx`
 * each built separately. This component draws no fact it isn't told:
 * every containment shown as a SOLID boundary (`outer`, `ring`, `core`) is
 * one the calling lesson asserts is a proven theorem; the two `lensA`/`lensB`
 * classes are always drawn as DASHED, mutually overlapping ellipses whose
 * relative size and overlap carry no claim — exactly the convention
 * `complexity-classes-p-np-and-bqp.mdx` derived for why BQP and NP must be
 * drawn as illustrative dashed shapes while PSPACE's boundary and P's core
 * are solid. `ring` (e.g. QMA) is drawn solid because its containments
 * (`lensB ⊆ ring ⊆ outer`) are asserted proven by the caller — but `ring`
 * is drawn *only* around `lensB`, never `lensA`, so passing a `ring` never
 * implies (and must never be used to imply) anything about `lensA ⊆ ring`.
 * If that relationship isn't a proven theorem in the source lesson, leave
 * `ring` and `lensA` un-connected, as this component does by construction.
 */

const WIDTH = 480;
const HEIGHT = 380;

const OUTER = { x: 40, y: 30, w: 400, h: 300, rx: 24 };
/** Ring (e.g. QMA): solid, strictly containing lensB's ellipse. */
const RING = { cx: 300, cy: 190, rx: 130, ry: 110 };
const LENS_B = { cx: 300, cy: 190, rx: 90, ry: 78 }; // e.g. NP
const LENS_A = { cx: 190, cy: 190, rx: 90, ry: 78 }; // e.g. BQP
/** Core (e.g. P): centered in the lensA/lensB overlap when both are present, else centered in lensB. */
const CORE_R = 15;

export type ComplexityClassSpec = { id: string; label: string };

export function ComplexityClassDiagram({
  outer,
  ring,
  lensA,
  lensB,
  core,
  openLabel,
  markedPoint,
  footnote,
  ariaLabel,
}: {
  /** The solid outermost boundary — every other class shown must be a proven subset of this one. */
  outer: ComplexityClassSpec;
  /** A solid ring strictly between `outer` and `lensB` — only drawn around `lensB`, never `lensA`. Omit if no such proven intermediate class applies. */
  ring?: ComplexityClassSpec;
  /** Left dashed lens (e.g. BQP). Omit for a simpler ring/lensB-only picture. */
  lensA?: ComplexityClassSpec;
  /** Right dashed lens (e.g. NP). Required whenever `ring` or `openLabel` is given. */
  lensB?: ComplexityClassSpec;
  /** Solid innermost class, proven to sit inside every drawn lens (e.g. P). */
  core?: ComplexityClassSpec;
  /** Text for the genuinely-open question about how `lensA` and `lensB` relate — placed in their overlap. Only meaningful when both lenses are given. */
  openLabel?: string;
  /** A single named problem/result to mark on `ring`'s boundary (e.g. "Local Hamiltonian — QMA-complete"). */
  markedPoint?: { label: string; note?: string };
  footnote?: string;
  ariaLabel: string;
}) {
  const hasLensA = Boolean(lensA);
  const hasRing = Boolean(ring);
  const overlapCx = hasLensA ? (LENS_A.cx + LENS_B.cx) / 2 : LENS_B.cx;
  const overlapCy = hasLensA ? (LENS_A.cy + LENS_B.cy) / 2 : LENS_B.cy;

  return (
    <div className="not-prose overflow-x-auto panel-inset p-4">
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={ariaLabel} className="mx-auto w-full max-w-lg">
        {/* Outer boundary — solid, proven container for everything drawn. */}
        <rect
          x={OUTER.x}
          y={OUTER.y}
          width={OUTER.w}
          height={OUTER.h}
          rx={OUTER.rx}
          className="fill-none stroke-foreground"
          strokeWidth={2}
        />
        <text x={OUTER.x + 14} y={OUTER.y + 26} className="fill-foreground text-sm font-semibold">
          {outer.label}
        </text>

        {/* Ring — solid, proven to sit inside outer and to strictly contain lensB only. */}
        {hasRing && ring && (
          <>
            <ellipse cx={RING.cx} cy={RING.cy} rx={RING.rx} ry={RING.ry} className="fill-none stroke-success" strokeWidth={2} />
            <text x={RING.cx} y={RING.cy - RING.ry + 20} textAnchor="middle" className="fill-success text-[13px] font-semibold">
              {ring.label}
            </text>
          </>
        )}

        {/* Lenses — always dashed: no claim about relative size or overlap extent, only about what's proven to sit inside each. */}
        {hasLensA && lensA && (
          <ellipse cx={LENS_A.cx} cy={LENS_A.cy} rx={LENS_A.rx} ry={LENS_A.ry} className="fill-brand/10 stroke-brand" strokeWidth={2} strokeDasharray="6 4" />
        )}
        {lensB && (
          <ellipse cx={LENS_B.cx} cy={LENS_B.cy} rx={LENS_B.rx} ry={LENS_B.ry} className="fill-accent/10 stroke-accent" strokeWidth={2} strokeDasharray="6 4" />
        )}
        {hasLensA && lensA && (
          <text x={LENS_A.cx - 40} y={LENS_A.cy - 40} textAnchor="middle" className="fill-brand text-base font-semibold">
            {lensA.label}
          </text>
        )}
        {lensB && (
          <text x={LENS_B.cx + 40} y={LENS_B.cy - 40} textAnchor="middle" className="fill-accent text-base font-semibold">
            {lensB.label}
          </text>
        )}

        {/* Open question, sitting in the region whose extent is genuinely unresolved. */}
        {openLabel && lensB && (
          <text x={overlapCx} y={overlapCy - 8} textAnchor="middle" className="fill-warning text-[11px] font-medium">
            {openLabel}
          </text>
        )}

        {/* Core — solid, proven to sit inside every lens drawn. */}
        {core && (
          <>
            <circle cx={overlapCx} cy={overlapCy + 24} r={CORE_R} className="fill-foreground" />
            <text x={overlapCx} y={overlapCy + 24 + 5} textAnchor="middle" className="fill-background text-sm font-semibold">
              {core.label}
            </text>
          </>
        )}

        {/* A single named result/problem marked on the ring's boundary. */}
        {markedPoint && hasRing && (
          <g>
            <circle cx={RING.cx + RING.rx * 0.68} cy={RING.cy - RING.ry * 0.55} r={5} className="fill-warning stroke-background" strokeWidth={1.5} />
            <text x={RING.cx + RING.rx * 0.68 + 10} y={RING.cy - RING.ry * 0.55 - 4} className="fill-warning text-[10.5px] font-semibold">
              {markedPoint.label}
            </text>
            {markedPoint.note && (
              <text x={RING.cx + RING.rx * 0.68 + 10} y={RING.cy - RING.ry * 0.55 + 10} className="fill-muted-foreground text-[9.5px]">
                {markedPoint.note}
              </text>
            )}
          </g>
        )}
      </svg>
      {footnote && <p className="mt-1 text-center text-xs text-muted-foreground">{footnote}</p>}
    </div>
  );
}
