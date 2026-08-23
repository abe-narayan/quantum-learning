import { Complex } from "./complex";
import { StateVector } from "./state";
import { HADAMARD, PAULI_X, PAULI_Z, applySingleQubitGate, applyCNOT } from "./gates";
import { measureQubit } from "./measurement";

/**
 * The 3-qubit bit-flip and phase-flip repetition codes, built entirely from
 * existing primitives (CNOT, X, Z, H, partial measurement) — no new
 * fundamental gate or measurement capability is needed. Syndrome extraction
 * uses two real ancilla qubits and genuine partial measurement (exactly
 * `measureQubit`, unmodified), not a shortcut computed from the data
 * qubits' state directly. Deliberately scoped to distance-3 repetition
 * codes only — the 9-qubit Shor code (concatenating both) and surface
 * codes are covered conceptually in this course's lessons, not simulated
 * here; building their full decoders is real, substantial engineering
 * this platform doesn't attempt.
 */

export type Syndrome = readonly [0 | 1, 0 | 1];

/** Encodes a single logical qubit α|0⟩+β|1⟩ into α|000⟩+β|111⟩ via two CNOTs. */
export function encodeBitFlipCode(alpha: Complex, beta: Complex): StateVector {
  // Qubit 0 (this platform's MSB) carries the logical amplitudes; qubits 1,2 start at |0>.
  // |000> = index 0, |100> = index 4 (with q0 as the most significant of 3 bits).
  let s = new StateVector([alpha, Complex.ZERO, Complex.ZERO, Complex.ZERO, beta, Complex.ZERO, Complex.ZERO, Complex.ZERO]);
  s = applyCNOT(s, 0, 1);
  s = applyCNOT(s, 0, 2);
  return s;
}

/** Which data qubit (if any) an (s1,s2) syndrome indicates has a bit-flip error, for the standard Z0Z1/Z1Z2 parity-check convention. */
export function decodeBitFlipSyndrome([s1, s2]: Syndrome): number | null {
  if (s1 === 0 && s2 === 0) return null;
  if (s1 === 1 && s2 === 0) return 0;
  if (s1 === 1 && s2 === 1) return 1;
  return 2; // s1===0 && s2===1
}

/**
 * Runs one full bit-flip-code cycle: append two |0⟩ ancillas to a 3-qubit
 * encoded state, extract the Z0Z1/Z1Z2 syndrome via CNOTs into the
 * ancillas and genuine partial measurement, decode it, and apply the
 * indicated correction. `ancillaRandoms` (two values in [0,1)) makes the
 * otherwise-random ancilla measurement outcomes deterministic, for
 * reproducible worked examples and tests.
 */
export function runBitFlipCorrectionCycle(
  encoded: StateVector,
  ancillaRandoms: [number, number]
): { corrected: StateVector; syndrome: Syndrome; correctedQubit: number | null } {
  if (encoded.numQubits !== 3) throw new Error(`runBitFlipCorrectionCycle requires a 3-qubit encoded state (got ${encoded.numQubits}).`);

  let s = new StateVector(encoded.amplitudes.flatMap((a) => [a, Complex.ZERO, Complex.ZERO, Complex.ZERO]));
  // qubits: 0,1,2 = data, 3,4 = ancillas (both start |0>)
  s = applyCNOT(s, 0, 3);
  s = applyCNOT(s, 1, 3);
  s = applyCNOT(s, 1, 4);
  s = applyCNOT(s, 2, 4);

  const m1 = measureQubit(s, 3, ancillaRandoms[0]);
  const m2 = measureQubit(m1.collapsed, 4, ancillaRandoms[1]);
  const syndrome: Syndrome = [m1.outcome, m2.outcome];

  const errorQubit = decodeBitFlipSyndrome(syndrome);
  let corrected = m2.collapsed;
  if (errorQubit !== null) corrected = applySingleQubitGate(corrected, PAULI_X, errorQubit);

  // trace out the two (now classical, already-measured) ancilla qubits by restricting to the data-qubit amplitudes
  const dataAmplitudes = Array.from({ length: 8 }, (_, i) => corrected.amplitudes[i * 4 + syndrome[0] * 2 + syndrome[1]]);
  const norm = Math.sqrt(dataAmplitudes.reduce((sum, a) => sum + a.magnitudeSquared(), 0));
  const dataState = new StateVector(dataAmplitudes.map((a) => a.scale(1 / norm)));

  return { corrected: dataState, syndrome, correctedQubit: errorQubit };
}

/** The phase-flip code: identical to the bit-flip code, conjugated by H on every qubit (H turns X errors into Z errors and vice versa). */
export function encodePhaseFlipCode(alpha: Complex, beta: Complex): StateVector {
  let s = encodeBitFlipCode(alpha, beta);
  for (let q = 0; q < 3; q++) s = applySingleQubitGate(s, HADAMARD, q);
  return s;
}

export function runPhaseFlipCorrectionCycle(
  encoded: StateVector,
  ancillaRandoms: [number, number]
): { corrected: StateVector; syndrome: Syndrome; correctedQubit: number | null } {
  let s = encoded;
  for (let q = 0; q < 3; q++) s = applySingleQubitGate(s, HADAMARD, q);
  const result = runBitFlipCorrectionCycle(s, ancillaRandoms);
  let corrected = result.corrected;
  for (let q = 0; q < 3; q++) corrected = applySingleQubitGate(corrected, HADAMARD, q);
  return { ...result, corrected };
}

/** Applies a Z (phase-flip) error to one qubit of a 3-qubit state — a thin, explicit wrapper naming the error type for lesson clarity. */
export function applyPhaseFlipError(state: StateVector, qubit: number): StateVector {
  return applySingleQubitGate(state, PAULI_Z, qubit);
}

/** Applies an X (bit-flip) error to one qubit — same purpose as `applyPhaseFlipError`, for the other error type. */
export function applyBitFlipError(state: StateVector, qubit: number): StateVector {
  return applySingleQubitGate(state, PAULI_X, qubit);
}
