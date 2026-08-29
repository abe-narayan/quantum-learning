import { StateVector } from "./state";
import { HADAMARD, applySingleQubitGate } from "./gates";
import { applyPhaseOracle } from "./oracles";

/**
 * Grover's algorithm. The diffusion operator 2|s⟩⟨s|−I (s = the uniform
 * superposition) is built the standard way — H^⊗n, a reflection about
 * |0...0⟩, H^⊗n again — with no multi-controlled-gate primitive needed
 * anywhere in this file.
 */

function hadamardAll(state: StateVector): StateVector {
  let s = state;
  for (let q = 0; q < state.numQubits; q++) s = applySingleQubitGate(s, HADAMARD, q);
  return s;
}

/** The uniform superposition over all n-qubit basis states, H^⊗n|0...0⟩. */
export function uniformSuperposition(n: number): StateVector {
  return hadamardAll(StateVector.zero(n));
}

/**
 * 2|0...0⟩⟨0...0|−I: leaves index 0 untouched, flips the sign of every
 * *other* basis amplitude. This is the reflection `groverDiffusion` needs
 * — the reverse of `applyPhaseOracle`, which marks specific indices and
 * leaves the rest untouched, so it's built directly here rather than by
 * composing `applyPhaseOracle` (an earlier version did exactly that and
 * got the reflection backward — flipping the marked index instead of
 * everything else — a real bug caught by testing `groverDiffusion(|s⟩)=|s⟩`
 * directly, not just Grover's overall success probability, which is
 * insensitive to a global phase and didn't expose the mistake at all).
 */
function reflectAboutZero(state: StateVector): StateVector {
  const amps = state.amplitudes.map((a, i) => (i === 0 ? a : a.scale(-1)));
  return new StateVector(amps);
}

/** 2|s⟩⟨s|−I, applied via H^⊗n · (reflection about |0⟩) · H^⊗n. */
export function groverDiffusion(state: StateVector): StateVector {
  let s = hadamardAll(state);
  s = reflectAboutZero(s);
  s = hadamardAll(s);
  return s;
}

/** One full Grover iteration: the marking oracle, then diffusion. */
export function groverIteration(state: StateVector, markedIndices: Iterable<number>): StateVector {
  const marked = [...markedIndices];
  return groverDiffusion(applyPhaseOracle(state, marked));
}

/**
 * The optimal iteration count ⌊(π/4)√(N/M)⌋ for N basis states and M marked
 * items, as an integer (at least 1) — the standard result from treating each
 * iteration as a rotation by angle 2θ where sinθ=√(M/N) in the 2D span of
 * "marked" and "unmarked" superpositions. `Math.round(x - 0.5)` is the floor
 * here; it is written that way rather than as `Math.floor` so that a value
 * sitting a floating-point hair below an integer still rounds to it instead
 * of dropping a whole iteration.
 */
export function optimalGroverIterations(n: number, markedCount = 1): number {
  const N = 2 ** n;
  return Math.max(1, Math.round((Math.PI / 4) * Math.sqrt(N / markedCount) - 0.5));
}

/** Runs `iterations` full Grover iterations starting from the uniform superposition, returning the final state. */
export function runGrover(n: number, markedIndices: Iterable<number>, iterations: number): StateVector {
  const marked = [...markedIndices];
  let s = uniformSuperposition(n);
  for (let i = 0; i < iterations; i++) s = groverIteration(s, marked);
  return s;
}
