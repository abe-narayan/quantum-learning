import { Complex } from "./complex";
import { Matrix } from "./matrix";
import { StateVector } from "./state";
import { HADAMARD, phaseGate, applySingleQubitGate, applyControlledGate, applySwap } from "./gates";

/**
 * The quantum Fourier transform, built entirely from existing gate
 * primitives (Hadamard, controlled-phase, swap) — no new matrix-level math
 * needed, only new circuit composition. Matches
 * QFT|j⟩ = (1/√N)∑ₖ e^{2πijk/N}|k⟩ exactly (checked directly against that
 * closed-form definition in this module's tests, not just self-consistency).
 *
 * Respects this platform's qubit-0-is-MSB convention throughout — the
 * standard textbook QFT circuit (usually presented qubit-0-is-LSB) is
 * adapted accordingly: the per-qubit rotation angles are unchanged, but
 * which qubit is "first" and which pairs get swapped at the end follow this
 * platform's own convention, not a textbook diagram.
 */
export function quantumFourierTransform(state: StateVector): StateVector {
  const n = state.numQubits;
  let s = state;

  for (let q = 0; q < n; q++) {
    s = applySingleQubitGate(s, HADAMARD, q);
    for (let k = 2; k <= n - q; k++) {
      const control = q + k - 1;
      s = applyControlledGate(s, phaseGate((2 * Math.PI) / 2 ** k), control, q);
    }
  }

  for (let i = 0; i < Math.floor(n / 2); i++) {
    s = applySwap(s, i, n - 1 - i);
  }

  return s;
}

/** The exact inverse: applying this after `quantumFourierTransform` returns the original state. */
export function inverseQuantumFourierTransform(state: StateVector): StateVector {
  const n = state.numQubits;
  let s = state;

  for (let i = 0; i < Math.floor(n / 2); i++) {
    s = applySwap(s, i, n - 1 - i);
  }

  for (let q = n - 1; q >= 0; q--) {
    for (let k = n - q; k >= 2; k--) {
      const control = q + k - 1;
      s = applyControlledGate(s, phaseGate(-(2 * Math.PI) / 2 ** k), control, q);
    }
    s = applySingleQubitGate(s, HADAMARD, q);
  }

  return s;
}

/** Repeated matrix multiplication — U^power via power-many `Matrix.mul` calls, not a general matrix-power algorithm. */
function matrixPower(u: Matrix, power: number): Matrix {
  let result = Matrix.identity(u.rows);
  for (let i = 0; i < power; i++) result = result.mul(u);
  return result;
}

/**
 * Quantum phase estimation for a single-qubit unitary `u` with a *known*
 * eigenstate `eigenstate` (2 amplitudes) — deliberately restricted to this
 * case (not a general multi-qubit controlled-U), since every worked example
 * this course needs (phase gates, Pauli rotations) is a 2×2 unitary with a
 * known eigenstate, and controlled-U for a larger unitary would need a
 * general multi-qubit controlled-gate primitive this platform doesn't build.
 * Returns the full `precisionQubits + 1`-qubit state after the standard QPE
 * circuit (Hadamards, controlled-U^(2^k), inverse QFT on the precision
 * register) — measuring the first `precisionQubits` qubits and dividing by
 * 2^precisionQubits recovers the eigenphase.
 */
export function phaseEstimation(u: Matrix, eigenstate: [Complex, Complex], precisionQubits: number): StateVector {
  if (u.rows !== 2 || u.cols !== 2) {
    throw new Error(`phaseEstimation requires a 2x2 unitary (got ${u.rows}x${u.cols}). See this function's scope note.`);
  }
  const eigenQubit = precisionQubits; // the last qubit holds the eigenstate
  const zeros = Array.from({ length: 2 ** precisionQubits }, (_, i) => (i === 0 ? Complex.ONE : Complex.ZERO));
  let s = new StateVector(zeros.flatMap((a) => [a.mul(eigenstate[0]), a.mul(eigenstate[1])]));

  for (let q = 0; q < precisionQubits; q++) {
    s = applySingleQubitGate(s, HADAMARD, q);
  }

  for (let q = 0; q < precisionQubits; q++) {
    const power = 2 ** (precisionQubits - 1 - q);
    s = applyControlledGate(s, matrixPower(u, power), q, eigenQubit);
  }

  // Inverse QFT on the precision register only: build it via the same
  // circuit as `inverseQuantumFourierTransform`, restricted to qubits
  // 0..precisionQubits-1 (the eigenstate qubit is never touched).
  for (let i = 0; i < Math.floor(precisionQubits / 2); i++) {
    s = applySwap(s, i, precisionQubits - 1 - i);
  }
  for (let q = precisionQubits - 1; q >= 0; q--) {
    for (let k = precisionQubits - q; k >= 2; k--) {
      const control = q + k - 1;
      s = applyControlledGate(s, phaseGate(-(2 * Math.PI) / 2 ** k), control, q);
    }
    s = applySingleQubitGate(s, HADAMARD, q);
  }

  return s;
}
