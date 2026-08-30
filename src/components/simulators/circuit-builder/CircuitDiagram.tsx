import type { KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import type { GateInstruction } from "@/lib/quantum/circuitBuilder";

const ROW_HEIGHT = 56;
const COLUMN_WIDTH = 64;
const LABEL_WIDTH = 40;
/**
 * Half-width of the invisible tap target drawn behind every clickable gate
 * group. The painted symbols are small on purpose: a 36px gate box and a
 * 10px CNOT control dot are the standard circuit notation, and inflating them
 * would stop the diagram looking like a circuit diagram, but they were also
 * the whole of the hit area, which put a finger-sized tap well under the 44px
 * floor. A transparent rect behind each group takes the taps instead: the
 * notation keeps its size, the target does not. 22 (44px wide) fits inside
 * COLUMN_WIDTH/2 = 32, so adjacent columns still never overlap.
 */
const HIT_HALF_WIDTH = 22;
/** Same idea vertically. ROW_HEIGHT/2 = 28, so neighbouring wires stay distinct. */
const HIT_HALF_HEIGHT = 22;

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
    // Deliberately NO `tabIndex={0}` on this scroll container, unlike the
    // static `StaticCircuitDiagram`/`PeriodFindingSchematic` wrappers it
    // otherwise resembles. This one is wide for the same reason (`width` grows
    // with the gate count and the `<svg>` is `min-w-full`), but every gate in
    // it is already a `role="button" tabIndex={0}` group: tabbing through the
    // circuit walks gate to gate, and each focus move scrolls its gate into
    // view for free, so a keyboard-only reader reaches the far end of the
    // circuit by using the circuit. Adding a stop on the container would put a
    // redundant landing point in front of that walk on every simulator step,
    // exactly the tab-order noise the affordance is supposed to be worth.
    // (The empty-circuit case has no gates and also no overflow: `width` is
    // then `LABEL_WIDTH + COLUMN_WIDTH`, well inside the stage.)
    <div className="overflow-x-auto rounded-panel border border-border bg-surface-muted/40 p-4">
      <svg
        width={width}
        height={height}
        // `role="group"`, not `role="img"`: the same correction
        // `BlochSphereCanvas` documents, and for a sharper reason here. Every
        // gate below is a `<g role="button" tabIndex={0} aria-label="Jump to
        // right after …">`. `img` is a children-presentational role: Chrome
        // and Safari prune the entire subtree of an `img` from the
        // accessibility tree, so those gate buttons lost their roles and their
        // labels while keeping their DOM tab stops. The result was the worst
        // of both worlds: a screen-reader user tabbed onto N *silent* focus
        // stops (one per gate, growing as they build the circuit), heard
        // nothing about what any of them did, and the only announcement in the
        // whole widget was this container's static summary. `img` also claims
        // "static graphic, nothing to operate here", which is a false promise
        // about a diagram whose entire purpose is to be clicked through.
        //
        // `group` is the role for a container of related graphics that are
        // themselves operable: it exposes children normally, so each gate's
        // `role="button"` and its "Jump to right after H on qubit 0" label
        // reach the reader. `aria-roledescription` keeps the useful half of
        // what `img` conveyed (the reader hears "quantum circuit" instead of
        // a bare "group") without asserting the subtree is inert.
        //
        // NOTE for `src/lib/design/__tests__/scrollRegions.test.ts`: the
        // wrapper's excuse for having no tab stop depends on this. It is only
        // true because the gates are real, announced buttons; under `img` the
        // excuse described a DOM that the accessibility tree did not have.
        role="group"
        aria-roledescription="quantum circuit"
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
              // `--axis`, not `--border`. A qubit wire is this figure's
              // coordinate line: a gate's row is what says which qubit it acts
              // on, and a two-qubit gate is read by following the wire between
              // its control and its target. That is a mark the reader must
              // perceive, which is what `--axis` (4.5:1) is authored for, not
              // panel chrome at 1.41:1. The chip substrates and enclosures
              // elsewhere in this directory are chrome and correctly stay on
              // `--border`.
              className="stroke-axis"
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
                  x={cx - HIT_HALF_WIDTH}
                  y={rowY(q) - HIT_HALF_HEIGHT}
                  width={HIT_HALF_WIDTH * 2}
                  height={HIT_HALF_HEIGHT * 2}
                  fill="transparent"
                />
                <rect
                  x={cx - 18}
                  y={rowY(q) - 18}
                  width={36}
                  height={36}
                  rx={8}
                  className={cn("stroke-pillar", isDone ? "fill-pillar/15" : "fill-surface")}
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
              {/* Spans both wires plus the connecting line, so the whole
                  two-qubit symbol is one target rather than two ~10px dots. */}
              <rect
                x={cx - HIT_HALF_WIDTH}
                y={top - HIT_HALF_HEIGHT}
                width={HIT_HALF_WIDTH * 2}
                height={bottom - top + HIT_HALF_HEIGHT * 2}
                fill="transparent"
              />
              <line x1={cx} y1={top} x2={cx} y2={bottom} className="stroke-pillar" strokeWidth={2} />
              {instr.gate === "CNOT" && (
                <>
                  <circle cx={cx} cy={rowY(a)} r={5} className="fill-pillar" />
                  <circle
                    cx={cx}
                    cy={rowY(b)}
                    r={12}
                    className={cn("stroke-pillar", isDone ? "fill-pillar/15" : "fill-surface")}
                    strokeWidth={1.5}
                  />
                  <line x1={cx - 12} y1={rowY(b)} x2={cx + 12} y2={rowY(b)} className="stroke-pillar" strokeWidth={1.5} />
                  <line x1={cx} y1={rowY(b) - 12} x2={cx} y2={rowY(b) + 12} className="stroke-pillar" strokeWidth={1.5} />
                </>
              )}
              {instr.gate === "CZ" && (
                <>
                  <circle cx={cx} cy={rowY(a)} r={5} className="fill-pillar" />
                  <circle cx={cx} cy={rowY(b)} r={5} className="fill-pillar" />
                </>
              )}
              {instr.gate === "SWAP" && (
                <>
                  <text x={cx} y={rowY(a) + 5} textAnchor="middle" className="fill-pillar text-base font-bold">
                    ×
                  </text>
                  <text x={cx} y={rowY(b) + 5} textAnchor="middle" className="fill-pillar text-base font-bold">
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
