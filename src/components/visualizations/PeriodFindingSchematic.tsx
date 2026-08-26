const ROW_HEIGHT = 56;
const COLUMN_WIDTH = 72;
const LABEL_WIDTH = 96;
const TARGET_GAP = 28;

/**
 * A static, non-interactive schematic of the period-finding circuit's
 * *structure* — t Hadamards on the counting register, a staircase of
 * controlled-U_a^(2^k) modular multiplications each reaching down to a
 * single bundled target-register wire, then a QFT box spanning the
 * counting register. `StaticCircuitDiagram` can't draw this: its
 * `GateInstruction` type only knows concrete single/two-qubit gates, not
 * an abstract multi-qubit "controlled-U^(2^k)" box or a register-spanning
 * "QFT" box. This component exists purely to show the *shape* of the
 * circuit the lesson describes in prose — it is not wired to any real
 * gate sequence or amplitudes, matching the lesson's own framing that the
 * platform builds the period-finding *state* directly rather than this
 * gate-by-gate circuit.
 */
export function PeriodFindingSchematic({
  t = 4,
  ariaLabel,
}: {
  /** Number of counting qubits to draw (kept small for legibility; the real circuit uses many more). */
  t?: number;
  ariaLabel?: string;
}) {
  const countingRows = t;
  const targetRow = countingRows;
  const numRows = countingRows + 1;

  const staircaseCols = t;
  const hadamardCol = 0;
  const qftCol = 1 + staircaseCols;
  const totalCols = qftCol + 1;

  const width = LABEL_WIDTH + totalCols * COLUMN_WIDTH + COLUMN_WIDTH / 2;
  const height = numRows * ROW_HEIGHT + TARGET_GAP;

  const rowY = (row: number) => (row < countingRows ? row * ROW_HEIGHT + ROW_HEIGHT / 2 : countingRows * ROW_HEIGHT + TARGET_GAP + ROW_HEIGHT / 2);
  const colX = (col: number) => LABEL_WIDTH + col * COLUMN_WIDTH + COLUMN_WIDTH / 2;

  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-border bg-surface-muted/40 p-4">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel ?? "Schematic of the period-finding circuit's structure"} className="min-w-full">
        {/* Counting register wires */}
        {Array.from({ length: countingRows }, (_, q) => (
          <g key={`wire-${q}`}>
            <line x1={LABEL_WIDTH} y1={rowY(q)} x2={width} y2={rowY(q)} className="stroke-border" strokeWidth={2} />
            <text x={4} y={rowY(q) + 4} className="fill-muted-foreground text-xs font-mono">
              {`q${q}`}
            </text>
          </g>
        ))}

        {/* Bundled target register wire (drawn as a double line to signal "register", not a single qubit) */}
        <g>
          <line x1={LABEL_WIDTH} y1={rowY(targetRow) - 2} x2={width} y2={rowY(targetRow) - 2} className="stroke-border" strokeWidth={2} />
          <line x1={LABEL_WIDTH} y1={rowY(targetRow) + 2} x2={width} y2={rowY(targetRow) + 2} className="stroke-border" strokeWidth={2} />
          <text x={4} y={rowY(targetRow) + 4} className="fill-muted-foreground text-xs font-mono">
            {"|1⟩"}
          </text>
        </g>

        {/* Hadamards on every counting qubit */}
        {Array.from({ length: countingRows }, (_, q) => (
          <g key={`h-${q}`}>
            <rect x={colX(hadamardCol) - 18} y={rowY(q) - 18} width={36} height={36} rx={8} className="fill-surface stroke-brand" strokeWidth={1.5} />
            <text x={colX(hadamardCol)} y={rowY(q) + 5} textAnchor="middle" className="fill-foreground text-sm font-semibold">
              H
            </text>
          </g>
        ))}

        {/* Staircase of controlled-U_a^(2^k) modular multiplications */}
        {Array.from({ length: staircaseCols }, (_, k) => {
          const col = 1 + k;
          const cx = colX(col);
          const q = k;
          return (
            <g key={`u-${k}`}>
              <line x1={cx} y1={rowY(q)} x2={cx} y2={rowY(targetRow)} className="stroke-brand" strokeWidth={2} />
              <circle cx={cx} cy={rowY(q)} r={5} className="fill-brand" />
              <rect x={cx - 26} y={rowY(targetRow) - 18} width={52} height={36} rx={8} className="fill-surface stroke-brand" strokeWidth={1.5} />
              <text x={cx} y={rowY(targetRow) - 24} textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono">
                {`k=${k}`}
              </text>
              <text x={cx} y={rowY(targetRow) + 4} textAnchor="middle" className="fill-foreground text-[11px] font-semibold">
                {`U_a^(2^${t - 1 - k})`}
              </text>
            </g>
          );
        })}

        {/* QFT box spanning the whole counting register */}
        <rect
          x={colX(qftCol) - 22}
          y={rowY(0) - 24}
          width={44}
          height={rowY(countingRows - 1) - rowY(0) + 48}
          rx={10}
          className="fill-accent/10 stroke-accent"
          strokeWidth={1.5}
        />
        <text
          x={colX(qftCol)}
          y={(rowY(0) + rowY(countingRows - 1)) / 2 + 4}
          textAnchor="middle"
          transform={`rotate(-90 ${colX(qftCol)} ${(rowY(0) + rowY(countingRows - 1)) / 2 + 4})`}
          className="fill-accent text-sm font-bold"
        >
          QFT
        </text>
      </svg>
    </div>
  );
}
