import { Complex } from "./complex";
import { StateVector } from "./state";
import { HADAMARD, rotationX, applySingleQubitGate } from "./gates";

/**
 * QAOA for Max-Cut on a small graph — the cost and mixer unitaries built
 * directly (a diagonal phase for the cost operator, single-qubit rotations
 * for the mixer), reusing the same "operate directly on amplitudes"
 * approach as `applyPhaseOracle`. No general Hamiltonian-simulation
 * framework is built — this is scoped specifically to Max-Cut's diagonal
 * cost structure, the standard first example for QAOA.
 */

export type Edge = [number, number];

function bitAt(index: number, totalQubits: number, qubit: number): number {
  return (index >> (totalQubits - 1 - qubit)) & 1;
}

function cutCount(index: number, totalQubits: number, edges: Edge[]): number {
  let count = 0;
  for (const [i, j] of edges) {
    if (bitAt(index, totalQubits, i) !== bitAt(index, totalQubits, j)) count++;
  }
  return count;
}

/** The uniform superposition, H^⊗n|0...0⟩ — QAOA's standard starting state. */
export function uniformSuperposition(n: number): StateVector {
  let s = StateVector.zero(n);
  for (let q = 0; q < n; q++) s = applySingleQubitGate(s, HADAMARD, q);
  return s;
}

/** The cost unitary e^{-iγC}, C=Σ(1-Z_iZ_j)/2 over edges — a pure phase e^{-iγ·(cut count)} on each basis state. */
export function applyCostUnitary(state: StateVector, edges: Edge[], gamma: number): StateVector {
  const n = state.numQubits;
  const amps = state.amplitudes.map((amp, idx) => amp.mul(Complex.fromPolar(1, -gamma * cutCount(idx, n, edges))));
  return new StateVector(amps);
}

/** The mixer unitary e^{-iβB}, B=ΣXᵢ — Rx(2β) applied to every qubit. */
export function applyMixerUnitary(state: StateVector, beta: number): StateVector {
  let s = state;
  for (let q = 0; q < s.numQubits; q++) s = applySingleQubitGate(s, rotationX(2 * beta), q);
  return s;
}

/** The full p-layer QAOA circuit: uniform superposition, then p alternating cost/mixer layers. */
export function qaoaCircuit(n: number, edges: Edge[], gammas: number[], betas: number[]): StateVector {
  if (gammas.length !== betas.length) throw new Error("qaoaCircuit requires equal-length gamma and beta arrays (one pair per layer).");
  let s = uniformSuperposition(n);
  for (let p = 0; p < gammas.length; p++) {
    s = applyCostUnitary(s, edges, gammas[p]);
    s = applyMixerUnitary(s, betas[p]);
  }
  return s;
}

/** The expected cut size (number of cut edges), computed from measurement probabilities — the quantity QAOA is trying to maximize. */
export function expectedCutSize(state: StateVector, edges: Edge[]): number {
  const n = state.numQubits;
  const probs = state.probabilities();
  let total = 0;
  for (let idx = 0; idx < probs.length; idx++) total += probs[idx] * cutCount(idx, n, edges);
  return total;
}

/** The true maximum cut size, found by brute force over all 2^n bitstrings — small n only, used to check QAOA's result. */
export function bruteForceMaxCut(n: number, edges: Edge[]): number {
  let best = 0;
  for (let idx = 0; idx < 2 ** n; idx++) best = Math.max(best, cutCount(idx, n, edges));
  return best;
}
