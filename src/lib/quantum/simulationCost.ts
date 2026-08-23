/**
 * The exact resource-cost formulas behind state-vector simulation's
 * exponential wall — plain arithmetic, not new physics, but worth
 * making into real, checkable functions (used directly by lesson
 * problems) rather than only quoted as numbers in prose.
 */

/** Number of complex amplitudes a state-vector simulation of `numQubits` qubits requires: 2^numQubits. */
export function stateVectorAmplitudeCount(numQubits: number): number {
  if (!Number.isInteger(numQubits) || numQubits < 0) throw new Error(`stateVectorAmplitudeCount requires a non-negative integer, got ${numQubits}.`);
  return 2 ** numQubits;
}

/** Memory in bytes for a state-vector simulation, using double-precision complex numbers (2 × 8 bytes per amplitude). */
export function stateVectorMemoryBytes(numQubits: number): number {
  return stateVectorAmplitudeCount(numQubits) * 16;
}

/** Approximate floating-point operation count for simulating `numGates` single/two-qubit gates on `numQubits` qubits: each gate touches every amplitude once, so cost is roughly numGates × 2^numQubits. */
export function estimatedGateFlops(numQubits: number, numGates: number): number {
  if (!Number.isInteger(numGates) || numGates < 0) throw new Error(`estimatedGateFlops requires a non-negative integer numGates, got ${numGates}.`);
  return numGates * stateVectorAmplitudeCount(numQubits);
}
