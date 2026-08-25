import { StateVector } from "./state";
import type { Matrix } from "./matrix";
import {
  PAULI_X,
  PAULI_Y,
  PAULI_Z,
  HADAMARD,
  S_GATE,
  T_GATE,
  rotationX,
  rotationY,
  rotationZ,
  phaseGate,
  applySingleQubitGate,
  applyCNOT,
  applyCZ,
  applySwap,
} from "./gates";

/**
 * A software-SDK-style circuit representation: a circuit is built as DATA
 * (a list of named gate instructions) and only later executed against the
 * existing gate-application engine — the same "build first, run later"
 * pattern real quantum SDKs (Qiskit, Cirq, PennyLane) use, distinct from
 * Quantum Gates & Circuits' direct "apply this matrix now" approach. No
 * new gate physics here — every instruction dispatches straight to the
 * already-built, already-tested gates.ts functions.
 */

export type SingleQubitGateName = "X" | "Y" | "Z" | "H" | "S" | "T";
export type ParametrizedGateName = "RX" | "RY" | "RZ" | "P";
export type TwoQubitGateName = "CNOT" | "CZ" | "SWAP";
/** Not a unitary gate — a diagram/notation marker for "measure this wire here." See `applyInstruction` for why it doesn't touch the statevector. */
export type MeasurementInstructionName = "MEASURE";

export type GateInstruction =
  | { gate: SingleQubitGateName; targets: [number] }
  | { gate: ParametrizedGateName; targets: [number]; param: number }
  | { gate: TwoQubitGateName; targets: [number, number] }
  | { gate: MeasurementInstructionName; targets: [number] };

const SINGLE_QUBIT_MATRICES: Record<SingleQubitGateName, Matrix> = {
  X: PAULI_X,
  Y: PAULI_Y,
  Z: PAULI_Z,
  H: HADAMARD,
  S: S_GATE,
  T: T_GATE,
};

/** A circuit is built up by chaining calls, then executed with `runCircuit`. */
export class QuantumCircuit {
  readonly numQubits: number;
  readonly instructions: GateInstruction[] = [];

  constructor(numQubits: number) {
    if (!Number.isInteger(numQubits) || numQubits < 1) {
      throw new Error(`QuantumCircuit requires a positive integer numQubits, got ${numQubits}.`);
    }
    this.numQubits = numQubits;
  }

  private assertTarget(target: number) {
    if (!Number.isInteger(target) || target < 0 || target >= this.numQubits) {
      throw new Error(`Target qubit ${target} out of range for a ${this.numQubits}-qubit circuit.`);
    }
  }

  private addSingleQubit(gate: SingleQubitGateName, target: number): this {
    this.assertTarget(target);
    this.instructions.push({ gate, targets: [target] });
    return this;
  }

  private addParametrized(gate: ParametrizedGateName, target: number, param: number): this {
    this.assertTarget(target);
    this.instructions.push({ gate, targets: [target], param });
    return this;
  }

  x(target: number): this { return this.addSingleQubit("X", target); }
  y(target: number): this { return this.addSingleQubit("Y", target); }
  z(target: number): this { return this.addSingleQubit("Z", target); }
  h(target: number): this { return this.addSingleQubit("H", target); }
  s(target: number): this { return this.addSingleQubit("S", target); }
  t(target: number): this { return this.addSingleQubit("T", target); }
  rx(target: number, theta: number): this { return this.addParametrized("RX", target, theta); }
  ry(target: number, theta: number): this { return this.addParametrized("RY", target, theta); }
  rz(target: number, theta: number): this { return this.addParametrized("RZ", target, theta); }
  p(target: number, theta: number): this { return this.addParametrized("P", target, theta); }

  cnot(control: number, target: number): this {
    this.assertTarget(control);
    this.assertTarget(target);
    if (control === target) throw new Error("CNOT control and target must differ.");
    this.instructions.push({ gate: "CNOT", targets: [control, target] });
    return this;
  }

  cz(control: number, target: number): this {
    this.assertTarget(control);
    this.assertTarget(target);
    if (control === target) throw new Error("CZ control and target must differ.");
    this.instructions.push({ gate: "CZ", targets: [control, target] });
    return this;
  }

  swap(a: number, b: number): this {
    this.assertTarget(a);
    this.assertTarget(b);
    if (a === b) throw new Error("SWAP targets must differ.");
    this.instructions.push({ gate: "SWAP", targets: [a, b] });
    return this;
  }
}

/** Executes a QuantumCircuit's instructions in order, starting from |0...0>, returning the final StateVector. */
export function runCircuit(circuit: QuantumCircuit): StateVector {
  return runInstructions(circuit.numQubits, circuit.instructions);
}

/**
 * Executes a bare instruction list directly, without needing a
 * QuantumCircuit instance — used by the Circuit Builder simulator to
 * replay any PREFIX of a circuit (e.g. "the state after the first 3
 * gates") without rebuilding a circuit object for every prefix length.
 */
export function runInstructions(numQubits: number, instructions: readonly GateInstruction[]): StateVector {
  let state = StateVector.zero(numQubits);
  for (const instr of instructions) {
    state = applyInstruction(state, instr);
  }
  return state;
}

/**
 * Scope note on "MEASURE": this is a DIAGRAM-only marker (see CircuitDiagram
 * / StaticCircuitDiagram for the meter-symbol rendering the notation lesson
 * documents). It deliberately does NOT collapse the statevector here.
 *
 * Real projective collapse (see `measureQubit` in `./measurement.ts`) needs a
 * random outcome, and `runInstructions` is called from `CircuitBuilder.tsx`
 * on every step-slider move to replay an arbitrary PREFIX of the circuit
 * (`instructions.slice(0, step)`) — scrubbing back and forth, or re-rendering,
 * would re-sample a fresh random outcome each time, so the exact same prefix
 * could show a different, inconsistent state on every render. Making that
 * deterministic would mean storing a resolved outcome per placed instruction
 * (new state, new UI for showing collapse, new interaction with the existing
 * entanglement callouts) — a materially bigger change than this pass's scope
 * of "let a circuit diagram depict a measurement." So MEASURE is treated as
 * a no-op on the statevector: it acts as identity, exactly like a blank wire
 * in the notation lesson's own convention. Wiring real mid-circuit collapse
 * is a reasonable follow-up if the Circuit Builder UI grows to show sampled
 * outcomes explicitly.
 */
function applyInstruction(state: StateVector, instr: GateInstruction): StateVector {
  switch (instr.gate) {
    case "MEASURE":
      return state;
    case "X":
    case "Y":
    case "Z":
    case "H":
    case "S":
    case "T":
      return applySingleQubitGate(state, SINGLE_QUBIT_MATRICES[instr.gate], instr.targets[0]);
    case "RX":
      return applySingleQubitGate(state, rotationX(instr.param), instr.targets[0]);
    case "RY":
      return applySingleQubitGate(state, rotationY(instr.param), instr.targets[0]);
    case "RZ":
      return applySingleQubitGate(state, rotationZ(instr.param), instr.targets[0]);
    case "P":
      return applySingleQubitGate(state, phaseGate(instr.param), instr.targets[0]);
    case "CNOT":
      return applyCNOT(state, instr.targets[0], instr.targets[1]);
    case "CZ":
      return applyCZ(state, instr.targets[0], instr.targets[1]);
    case "SWAP":
      return applySwap(state, instr.targets[0], instr.targets[1]);
  }
}

/**
 * Simulates `shots` repeated measurements of `state` in the computational
 * basis, returning observed counts per basis label — the "sample like
 * real hardware does" alternative to reading exact amplitudes directly,
 * used to illustrate shot noise (Simulators vs. Real Hardware).
 */
export function sampleMeasurements(state: StateVector, shots: number): Record<string, number> {
  if (!Number.isInteger(shots) || shots < 1) throw new Error(`sampleMeasurements requires a positive integer shots, got ${shots}.`);
  const probabilities = state.probabilities();
  const cumulative: number[] = [];
  let running = 0;
  for (const p of probabilities) {
    running += p;
    cumulative.push(running);
  }
  const counts: Record<string, number> = {};
  for (let shot = 0; shot < shots; shot++) {
    const r = Math.random();
    let index = cumulative.findIndex((c) => r < c);
    if (index === -1) index = probabilities.length - 1;
    const label = state.basisLabel(index);
    counts[label] = (counts[label] ?? 0) + 1;
  }
  return counts;
}
