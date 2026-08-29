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
    <div className="not-prose overflow-x-auto panel-inset p-4">
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
        {/* 11 -> 13 units. This 420-unit viewBox renders `w-full`, so on a 320px phone
            (a ~256px column inside `panel-inset p-4`) a unit is ~0.61px and 11 came out
            at ~6.7px. The old wording was also already too long for the box: 68
            monospace characters is ~449 units at 11 against a 420-unit viewBox, so it
            was clipping at *every* width. Trimmed to the claim itself — "surface-code-
            style" is what the picture shows, and the aria-label carries the full
            description for anyone who cannot see it. */}
        <text x={WIDTH / 2} y={18} textAnchor="middle" className="fill-muted-foreground text-[13px] font-mono">
          many physical qubits make one logical qubit
        </text>

        {/* The patch boundary is the whole argument: "everything inside this line is
            ONE logical qubit" is the overhead claim the figure exists to make, and it
            is the only mark that says where the logical qubit ends. It was
            `stroke-border` — the panel-edge token, 1.41:1 on `--surface-muted`, under
            WCAG 2.1 SC 1.4.11's 3:1 for meaningful graphical objects. */}
        <rect x={RECT_X} y={RECT_Y} width={RECT_W} height={RECT_H} rx={10} className="fill-none stroke-axis" strokeWidth={1.5} strokeDasharray="5 4" />

        {/* Lattice lines connecting neighboring data qubits. Deliberately NOT promoted
            to `--axis`: the docstring is explicit that these exist "for visual
            structure" — nothing is counted or measured along them, and the qubits
            themselves are the data. `--axis-grid` is the channel for exactly that,
            optional ruling that stays below the data. */}
        {dataPoints.map((row, r) =>
          row.map((p, c) => (
            <g key={`grid-${r}-${c}`}>
              {c < COLS - 1 && <line x1={p.x} y1={p.y} x2={row[c + 1].x} y2={row[c + 1].y} className="stroke-axis-grid" strokeWidth={1} />}
              {r < ROWS - 1 && (
                <line x1={p.x} y1={p.y} x2={dataPoints[r + 1][c].x} y2={dataPoints[r + 1][c].y} className="stroke-axis-grid" strokeWidth={1} />
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

        {/* Moved out from inside the patch to just below it. At 11 units this label sat
            at y = RECT_Y + RECT_H - 10 and already overlapped the bottom row of r=7
            data-qubit circles; at 13 it would have run straight through three of them.
            Sitting under the dashed boundary it still unambiguously names the boxed
            region, and it no longer hides data. */}
        <text x={RECT_X + RECT_W / 2} y={RECT_Y + RECT_H + 18} textAnchor="middle" className="fill-foreground text-[13px] font-semibold">
          one logical qubit
        </text>

        {/* Legend, 10 -> 12 units. Pushed down from y=286 to y=300 to make room for the
            relocated "one logical qubit" label. The longest entry is 24 monospace
            characters, ~173 units at 12, which from x=244 ends at ~417 — inside the
            420-unit box. */}
        <circle cx={100} cy={296} r={6} className="fill-brand" />
        <text x={112} y={301} className="fill-muted-foreground text-[12px] font-mono">
          data qubit
        </text>
        <rect x={224} y={290} width={12} height={12} rx={2} className="fill-accent/25 stroke-accent" strokeWidth={1.25} />
        <text x={244} y={301} className="fill-muted-foreground text-[12px] font-mono">
          ancilla (syndrome) qubit
        </text>

        {/* 9.5 -> 12 units, rewrapped from two lines to three. The old first line was
            62 monospace characters, ~446 units at 12 — wider than the 420-unit viewBox
            — so raising the size meant re-breaking the sentence rather than clipping
            the caveat that keeps this figure honest about not being to scale. The
            viewBox is 400 units tall and the last line now ends at ~372. */}
        <text x={RECT_X} y={336} className="fill-muted-foreground text-[12px] font-mono">
          illustrative, not to scale — a real
        </text>
        <text x={RECT_X} y={352} className="fill-muted-foreground text-[12px] font-mono">
          logical qubit runs 100s to several thousand
        </text>
        <text x={RECT_X} y={368} className="fill-muted-foreground text-[12px] font-mono">
          physical qubits, per this lesson&apos;s Synthesis
        </text>
      </svg>
    </div>
  );
}
