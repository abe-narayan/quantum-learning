const WIDTH = 420;
const HEIGHT = 400;

const COLS = 4;
const ROWS = 4;
const GAP = 46;
const START_X = 110;
const START_Y = 90;

const RECT_PAD = 26;
const RECT_X = START_X - RECT_PAD;
const RECT_Y = START_Y - RECT_PAD;
const RECT_W = (COLS - 1) * GAP + 2 * RECT_PAD;
const RECT_H = (ROWS - 1) * GAP + 2 * RECT_PAD;

/**
 * A small surface-code-style patch: data qubits on a grid, with an ancilla
 * (syndrome-measurement) qubit interleaved at each interior intersection.
 * The whole patch is boxed and labeled "one logical qubit" to make the
 * physical-to-logical overhead concrete: this entire lattice of physical
 * qubits, most of which never directly hold the "useful" data, is what
 * one error-corrected logical qubit costs. The patch shown is deliberately
 * small/illustrative — the caption ties back to the lesson's own stated
 * range rather than asserting this diagram's qubit count IS the real ratio.
 */
export function LogicalQubitPatchDiagram({ ariaLabel }: { ariaLabel: string }) {
  const dataPoints = Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => ({ x: START_X + c * GAP, y: START_Y + r * GAP })));
  const ancillaPoints = Array.from({ length: ROWS - 1 }, (_, r) =>
    Array.from({ length: COLS - 1 }, (_, c) => ({ x: START_X + GAP / 2 + c * GAP, y: START_Y + GAP / 2 + r * GAP }))
  );

  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-border bg-surface-muted/40 p-4">
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
        <text x={WIDTH / 2} y={18} textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">
          surface-code-style patch: many physical qubits make one logical qubit
        </text>

        {/* boundary of the whole logical-qubit patch */}
        <rect x={RECT_X} y={RECT_Y} width={RECT_W} height={RECT_H} rx={10} className="fill-none stroke-border" strokeWidth={1.5} strokeDasharray="5 4" />

        {/* lattice lines connecting neighboring data qubits, for visual structure */}
        {dataPoints.map((row, r) =>
          row.map((p, c) => (
            <g key={`grid-${r}-${c}`}>
              {c < COLS - 1 && <line x1={p.x} y1={p.y} x2={row[c + 1].x} y2={row[c + 1].y} className="stroke-border" strokeWidth={1} />}
              {r < ROWS - 1 && (
                <line x1={p.x} y1={p.y} x2={dataPoints[r + 1][c].x} y2={dataPoints[r + 1][c].y} className="stroke-border" strokeWidth={1} />
              )}
            </g>
          ))
        )}

        {/* ancilla (syndrome-measurement) qubits, one per interior cell */}
        {ancillaPoints.map((row, r) =>
          row.map((p, c) => (
            <rect
              key={`anc-${r}-${c}`}
              x={p.x - 6}
              y={p.y - 6}
              width={12}
              height={12}
              rx={2}
              className="fill-accent/25 stroke-accent"
              strokeWidth={1.25}
            />
          ))
        )}

        {/* data qubits, drawn on top of the lattice lines and ancilla squares */}
        {dataPoints.map((row, r) =>
          row.map((p, c) => <circle key={`data-${r}-${c}`} cx={p.x} cy={p.y} r={7} className="fill-brand" />)
        )}

        <text x={RECT_X + RECT_W / 2} y={RECT_Y + RECT_H - 10} textAnchor="middle" className="fill-foreground text-[11px] font-semibold">
          one logical qubit
        </text>

        {/* legend */}
        <circle cx={100} cy={286} r={6} className="fill-brand" />
        <text x={112} y={290} className="fill-muted-foreground text-[10px] font-mono">
          data qubit
        </text>
        <rect x={224} y={280} width={12} height={12} rx={2} className="fill-accent/25 stroke-accent" strokeWidth={1.25} />
        <text x={244} y={290} className="fill-muted-foreground text-[10px] font-mono">
          ancilla (syndrome) qubit
        </text>

        <text x={RECT_X} y={324} className="fill-muted-foreground text-[9.5px] font-mono">
          illustrative, not to scale — a real logical qubit runs 100s to
        </text>
        <text x={RECT_X} y={337} className="fill-muted-foreground text-[9.5px] font-mono">
          several thousand physical qubits, per this lesson&apos;s Synthesis
        </text>
      </svg>
    </div>
  );
}
