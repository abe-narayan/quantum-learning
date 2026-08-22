import { Complex } from "./complex";
import { Matrix } from "./matrix";
import { StateVector } from "./state";

const c = (re: number, im = 0) => new Complex(re, im);

// --- Single-qubit gate matrices -------------------------------------------

export const IDENTITY = Matrix.identity(2);

export const PAULI_X = new Matrix([
  [c(0), c(1)],
  [c(1), c(0)],
]);

export const PAULI_Y = new Matrix([
  [c(0), c(0, -1)],
  [c(0, 1), c(0)],
]);

export const PAULI_Z = new Matrix([
  [c(1), c(0)],
  [c(0), c(-1)],
]);

export const HADAMARD = new Matrix([
  [c(Math.SQRT1_2), c(Math.SQRT1_2)],
  [c(Math.SQRT1_2), c(-Math.SQRT1_2)],
]);

export const S_GATE = new Matrix([
  [c(1), c(0)],
  [c(0), c(0, 1)],
]);

export const T_GATE = new Matrix([
  [c(1), c(0)],
  [c(0), Complex.fromPolar(1, Math.PI / 4)],
]);

export function phaseGate(theta: number): Matrix {
  return new Matrix([
    [c(1), c(0)],
    [c(0), Complex.fromPolar(1, theta)],
  ]);
}

export function rotationX(theta: number): Matrix {
  const cos = Math.cos(theta / 2);
  const sin = Math.sin(theta / 2);
  return new Matrix([
    [c(cos), c(0, -sin)],
    [c(0, -sin), c(cos)],
  ]);
}

export function rotationY(theta: number): Matrix {
  const cos = Math.cos(theta / 2);
  const sin = Math.sin(theta / 2);
  return new Matrix([
    [c(cos), c(-sin)],
    [c(sin), c(cos)],
  ]);
}

export function rotationZ(theta: number): Matrix {
  return new Matrix([
    [Complex.fromPolar(1, -theta / 2), c(0)],
    [c(0), Complex.fromPolar(1, theta / 2)],
  ]);
}

// --- Applying gates to a multi-qubit state ---------------------------------
//
// Qubit `0` is the most significant (leftmost) bit of the basis label, e.g.
// for 3 qubits the basis index 0b100 = |100⟩ has qubit 0 set. Gates are
// applied by iterating the amplitude array directly rather than building the
// full 2^n x 2^n matrix, which keeps this practical well beyond a handful of
// qubits.

function assertValidTarget(target: number, numQubits: number) {
  if (!Number.isInteger(target) || target < 0 || target >= numQubits) {
    throw new Error(`Qubit index ${target} is out of range for a ${numQubits}-qubit state.`);
  }
}

/** Applies a single-qubit gate to one qubit within a multi-qubit state. */
export function applySingleQubitGate(state: StateVector, gate: Matrix, target: number): StateVector {
  if (gate.rows !== 2 || gate.cols !== 2) throw new Error("Expected a 2x2 single-qubit gate.");
  const n = state.numQubits;
  assertValidTarget(target, n);

  const mask = 1 << (n - 1 - target);
  const amps = state.amplitudes;
  const result = amps.slice();

  for (let i = 0; i < amps.length; i++) {
    if ((i & mask) !== 0) continue;
    const i0 = i;
    const i1 = i | mask;
    const a0 = amps[i0];
    const a1 = amps[i1];
    result[i0] = gate.get(0, 0).mul(a0).add(gate.get(0, 1).mul(a1));
    result[i1] = gate.get(1, 0).mul(a0).add(gate.get(1, 1).mul(a1));
  }

  return new StateVector(result);
}

/** Applies a 2x2 gate to `target`, conditioned on `control` being |1⟩. */
export function applyControlledGate(
  state: StateVector,
  gate: Matrix,
  control: number,
  target: number
): StateVector {
  if (gate.rows !== 2 || gate.cols !== 2) throw new Error("Expected a 2x2 gate.");
  const n = state.numQubits;
  assertValidTarget(control, n);
  assertValidTarget(target, n);
  if (control === target) throw new Error("Control and target qubits must differ.");

  const controlMask = 1 << (n - 1 - control);
  const targetMask = 1 << (n - 1 - target);
  const amps = state.amplitudes;
  const result = amps.slice();

  for (let i = 0; i < amps.length; i++) {
    if ((i & controlMask) === 0) continue;
    if ((i & targetMask) !== 0) continue;
    const i0 = i;
    const i1 = i | targetMask;
    const a0 = amps[i0];
    const a1 = amps[i1];
    result[i0] = gate.get(0, 0).mul(a0).add(gate.get(0, 1).mul(a1));
    result[i1] = gate.get(1, 0).mul(a0).add(gate.get(1, 1).mul(a1));
  }

  return new StateVector(result);
}

export function applyCNOT(state: StateVector, control: number, target: number): StateVector {
  return applyControlledGate(state, PAULI_X, control, target);
}

export function applyCZ(state: StateVector, control: number, target: number): StateVector {
  return applyControlledGate(state, PAULI_Z, control, target);
}

/** SWAP via the standard three-CNOT decomposition. */
export function applySwap(state: StateVector, qubitA: number, qubitB: number): StateVector {
  return applyCNOT(applyCNOT(applyCNOT(state, qubitA, qubitB), qubitB, qubitA), qubitA, qubitB);
}
