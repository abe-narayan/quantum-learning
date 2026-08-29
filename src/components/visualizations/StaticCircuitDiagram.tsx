import type { GateInstruction } from "@/lib/quantum/circuitBuilder";

const ROW_HEIGHT = 56;
const COLUMN_WIDTH = 64;
const LABEL_WIDTH = 40;

/**
 * The "meter" symbol the quantum-circuit-notation lesson documents for a
 * measurement: a small gauge (dial arc + needle), drawn inside the same
 * gate-box rect used for single-qubit gates below — matches
 * `CircuitDiagram.tsx`'s interactive counterpart exactly.
 */
function MeasurementGlyph({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g className="stroke-foreground" strokeWidth={1.5} strokeLinecap="round" fill="none">
      <path d={`M ${cx - 9} ${cy + 6} A 9 9 0 0 1 ${cx + 9} ${cy + 6}`} />
      <line x1={cx} y1={cy + 6} x2={cx + 6} y2={cy - 5} />
      <circle cx={cx} cy={cy + 6} r={1.4} className="fill-foreground" stroke="none" />
    </g>
  );
}

/**
 * A fixed, non-interactive circuit diagram — the same SVG rendering
 * approach as the Circuit Builder simulator's `CircuitDiagram`, but for a
 * lesson that just wants to SHOW a specific circuit (e.g. "here is the
 * teleportation circuit") rather than let a student build one. Takes the
 * platform's real `GateInstruction[]` type directly, so a lesson can
 * either hand-write a short instruction list or reuse one already built
 * with `QuantumCircuit` elsewhere in the same file — never a hand-drawn
 * picture disconnected from the actual gate sequence being taught.
 */
export function StaticCircuitDiagram({
  numQubits,
  instructions,
  highlightColumn,
  ariaLabel,
}: {
  numQubits: number;
  instructions: GateInstruction[];
  /** Optional 0-indexed column to draw at full emphasis while the rest dim slightly. */
  highlightColumn?: number;
  ariaLabel?: string;
}) {
  const columns = instructions.length;
  const width = LABEL_WIDTH + (columns + 1) * COLUMN_WIDTH;
  const height = numQubits * ROW_HEIGHT;

  return (
    // `tabIndex={0}`. `width` here is computed from the gate count
    // (`LABEL_WIDTH + columns * COLUMN_WIDTH`), and the `<svg>` is `min-w-full`
    // — a floor, not a ceiling — so a circuit of more than a handful of gates
    // is wider than the column and this wrapper is what scrolls. That is the
    // canonical case for WCAG 2.1.1: an `overflow-x-auto` div is focusable by
    // default in no browser but Firefox, so a keyboard-only reader could read
    // the first few gates of a QFT or a Bell-pair circuit and had no way to
    // reach the measurement at the end. No `role`/`aria-label` on the wrapper:
    // the `<svg>` already carries `role="img"` and the circuit summary, and
    // naming both would announce the figure twice.
    <div tabIndex={0} className="not-prose overflow-x-auto panel-inset p-4">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel ?? "Circuit diagram"} className="min-w-full">
        {Array.from({ length: numQubits }, (_, q) => (
          <g key={`wire-${q}`}>
            <line
              x1={LABEL_WIDTH}
              y1={q * ROW_HEIGHT + ROW_HEIGHT / 2}
              x2={width}
              y2={q * ROW_HEIGHT + ROW_HEIGHT / 2}
              // The qubit wires. A circuit diagram is its wires: which gate
              // acts on which qubit is read entirely off them, so they are as
              // load-bearing as a mark gets. They were on `--border`, the
              // panel-edge token (1.41:1 on `--surface-muted`, under the 3:1
              // WCAG 2.1 SC 1.4.11 floor); `--axis` clears 3:1 on every panel
              // depth in both themes.
              className="stroke-axis"
              strokeWidth={2}
            />
            <text x={4} y={q * ROW_HEIGHT + ROW_HEIGHT / 2 + 4} className="fill-muted-foreground text-xs font-mono">
              q{q}
            </text>
          </g>
        ))}

        {instructions.map((instr, col) => {
          const cx = LABEL_WIDTH + col * COLUMN_WIDTH + COLUMN_WIDTH / 2;
          const opacity = highlightColumn === undefined || col === highlightColumn ? 1 : 0.35;
          const rowY = (q: number) => q * ROW_HEIGHT + ROW_HEIGHT / 2;

          if (instr.targets.length === 1) {
            const q = instr.targets[0];
            const label = instr.gate === "RX" || instr.gate === "RY" || instr.gate === "RZ" || instr.gate === "P"
              ? `${instr.gate}(${instr.param.toFixed(2)})`
              : instr.gate;
            return (
              <g key={col} opacity={opacity}>
                <rect x={cx - 18} y={rowY(q) - 18} width={36} height={36} rx={8} className="fill-surface stroke-brand" strokeWidth={1.5} />
                {instr.gate === "MEASURE" ? (
                  <MeasurementGlyph cx={cx} cy={rowY(q)} />
                ) : (
                  <text x={cx} y={rowY(q) + 5} textAnchor="middle" className="fill-foreground text-sm font-semibold">
                    {label}
                  </text>
                )}
              </g>
            );
          }

          const [a, b] = instr.targets;
          const top = Math.min(rowY(a), rowY(b));
          const bottom = Math.max(rowY(a), rowY(b));

          return (
            <g key={col} opacity={opacity}>
              <line x1={cx} y1={top} x2={cx} y2={bottom} className="stroke-brand" strokeWidth={2} />
              {instr.gate === "CNOT" && (
                <>
                  <circle cx={cx} cy={rowY(a)} r={5} className="fill-brand" />
                  <circle cx={cx} cy={rowY(b)} r={12} className="fill-surface stroke-brand" strokeWidth={1.5} />
                  <line x1={cx - 12} y1={rowY(b)} x2={cx + 12} y2={rowY(b)} className="stroke-brand" strokeWidth={1.5} />
                  <line x1={cx} y1={rowY(b) - 12} x2={cx} y2={rowY(b) + 12} className="stroke-brand" strokeWidth={1.5} />
                </>
              )}
              {instr.gate === "CZ" && (
                <>
                  <circle cx={cx} cy={rowY(a)} r={5} className="fill-brand" />
                  <circle cx={cx} cy={rowY(b)} r={5} className="fill-brand" />
                </>
              )}
              {instr.gate === "SWAP" && (
                <>
                  <text x={cx} y={rowY(a) + 5} textAnchor="middle" className="fill-brand text-base font-bold">
                    ×
                  </text>
                  <text x={cx} y={rowY(b) + 5} textAnchor="middle" className="fill-brand text-base font-bold">
                    ×
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
