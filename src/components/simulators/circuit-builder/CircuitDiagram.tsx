import type { KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import type { GateInstruction } from "@/lib/quantum/circuitBuilder";

const ROW_HEIGHT = 56;
const COLUMN_WIDTH = 64;
const LABEL_WIDTH = 40;

function instructionLabel(instr: GateInstruction): string {
  if (instr.gate === "CNOT" || instr.gate === "CZ" || instr.gate === "SWAP") return instr.gate;
  return instr.gate;
}

function handleStepKeyDown(event: KeyboardEvent<SVGGElement>, onSelectStep: (step: number) => void, col: number) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    onSelectStep(col + 1);
  }
}

/**
 * The "meter" symbol the notation lesson documents for a measurement: a
 * small gauge (dial arc + needle), drawn inside the same gate-box rect used
 * for single-qubit gates elsewhere in this file, so it reads as "a thing
 * that happens on this wire" the same way an H or X box does.
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
 * Builds a descriptive default aria-label from the actual circuit content
 * (qubit count, gate count, and which gates appear), replacing the old
 * static "Circuit diagram" string that told screen reader users nothing
 * about what was actually drawn.
 */
function summarizeCircuitForAria(numQubits: number, instructions: GateInstruction[]): string {
  const qubitPhrase = `${numQubits} qubit${numQubits === 1 ? "" : "s"}`;
  if (instructions.length === 0) {
    return `Circuit diagram, ${qubitPhrase}, no gates placed yet.`;
  }
  const counts = new Map<string, number>();
  for (const instr of instructions) {
    counts.set(instr.gate, (counts.get(instr.gate) ?? 0) + 1);
  }
  const gateSummary = Array.from(counts.entries())
    .map(([gate, count]) => `${count} ${gate}`)
    .join(", ");
  const gatePhrase = `${instructions.length} gate${instructions.length === 1 ? "" : "s"}`;
  return `Circuit diagram, ${qubitPhrase}, ${gatePhrase}: ${gateSummary}.`;
}

/**
 * A minimal, educational circuit diagram: `numQubits` horizontal wires,
 * one column per instruction. Single-qubit gates draw a labeled box on
 * their target's wire; two-qubit gates draw a connecting vertical line
 * between control and target, with the standard dot/⊕/× symbols.
 */
export function CircuitDiagram({
  numQubits,
  instructions,
  step,
  onSelectStep,
  ariaLabel,
}: {
  numQubits: number;
  instructions: GateInstruction[];
  step: number;
  onSelectStep: (step: number) => void;
  /** Optional override; defaults to a summary of qubit/gate counts generated from `instructions`. */
  ariaLabel?: string;
}) {
  const columns = instructions.length;
  const width = LABEL_WIDTH + (columns + 1) * COLUMN_WIDTH;
  const height = numQubits * ROW_HEIGHT;

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface-muted/40 p-4">
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={ariaLabel ?? summarizeCircuitForAria(numQubits, instructions)}
        className="min-w-full"
      >
        {Array.from({ length: numQubits }, (_, q) => (
          <g key={`wire-${q}`}>
            <line
              x1={LABEL_WIDTH}
              y1={q * ROW_HEIGHT + ROW_HEIGHT / 2}
              x2={width}
              y2={q * ROW_HEIGHT + ROW_HEIGHT / 2}
              className="stroke-border"
              strokeWidth={2}
            />
            <text
              x={4}
              y={q * ROW_HEIGHT + ROW_HEIGHT / 2 + 4}
              className="fill-muted-foreground text-xs font-mono"
            >
              q{q}
            </text>
          </g>
        ))}

        {instructions.map((instr, col) => {
          const cx = LABEL_WIDTH + col * COLUMN_WIDTH + COLUMN_WIDTH / 2;
          const isDone = col < step;
          const opacity = isDone ? 1 : 0.35;
          const rowY = (q: number) => q * ROW_HEIGHT + ROW_HEIGHT / 2;

          if (instr.targets.length === 1) {
            const q = instr.targets[0];
            return (
              <g
                key={col}
                style={{ opacity }}
                className="cursor-pointer rounded outline-none transition-opacity duration-200 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
                role="button"
                tabIndex={0}
                aria-label={
                  instr.gate === "MEASURE"
                    ? `Jump to right after measuring qubit ${q}`
                    : `Jump to right after ${instructionLabel(instr)} on qubit ${q}`
                }
                onClick={() => onSelectStep(col + 1)}
                onKeyDown={(event) => handleStepKeyDown(event, onSelectStep, col)}
              >
                <rect
                  x={cx - 18}
                  y={rowY(q) - 18}
                  width={36}
                  height={36}
                  rx={8}
                  className={cn("stroke-brand", isDone ? "fill-brand/15" : "fill-surface")}
                  strokeWidth={1.5}
                />
                {instr.gate === "MEASURE" ? (
                  <MeasurementGlyph cx={cx} cy={rowY(q)} />
                ) : (
                  <text x={cx} y={rowY(q) + 5} textAnchor="middle" className="fill-foreground text-sm font-semibold">
                    {instructionLabel(instr)}
                  </text>
                )}
              </g>
            );
          }

          const [a, b] = instr.targets;
          const top = Math.min(rowY(a), rowY(b));
          const bottom = Math.max(rowY(a), rowY(b));

          return (
            <g
              key={col}
              style={{ opacity }}
              className="cursor-pointer rounded outline-none transition-opacity duration-200 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              role="button"
              tabIndex={0}
              aria-label={`Jump to right after ${instr.gate} on qubits ${a} and ${b}`}
              onClick={() => onSelectStep(col + 1)}
              onKeyDown={(event) => handleStepKeyDown(event, onSelectStep, col)}
            >
              <line x1={cx} y1={top} x2={cx} y2={bottom} className="stroke-brand" strokeWidth={2} />
              {instr.gate === "CNOT" && (
                <>
                  <circle cx={cx} cy={rowY(a)} r={5} className="fill-brand" />
                  <circle
                    cx={cx}
                    cy={rowY(b)}
                    r={12}
                    className={cn("stroke-brand", isDone ? "fill-brand/15" : "fill-surface")}
                    strokeWidth={1.5}
                  />
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

        <line
          x1={LABEL_WIDTH + step * COLUMN_WIDTH}
          y1={-4}
          x2={LABEL_WIDTH + step * COLUMN_WIDTH}
          y2={height + 4}
          className="stroke-accent"
          strokeWidth={2}
          strokeDasharray="4 3"
        />
      </svg>
      <p className="mt-2 text-xs text-muted-foreground">
        Click a gate to jump the state display to right after it runs. The dashed line marks the current step.
      </p>
    </div>
  );
}
