import type { StateVector } from "./state";

const DEFAULT_TOLERANCE = 1e-9;

function assertTwoQubits(state: StateVector, fn: string) {
  if (state.numQubits !== 2) {
    throw new Error(`${fn} requires a 2-qubit state (got ${state.numQubits} qubits).`);
  }
}

export type SeparabilityResult = {
  separable: boolean;
  /** |ad - bc|; exactly 0 for a genuine product state, up to the given tolerance. */
  determinantMagnitude: number;
};

/**
 * Tests whether a 2-qubit pure state a|00⟩ + b|01⟩ + c|10⟩ + d|11⟩ is
 * separable (expressible as |x⟩ ⊗ |y⟩ for some single-qubit x, y) or
 * entangled.
 *
 * This is an exact test, not a heuristic: arrange the amplitudes as the
 * 2x2 matrix M = [[a,b],[c,d]] (row = qubit 0's value, column = qubit 1's).
 * A product state |x⟩⊗|y⟩ has M = x·yᵀ (an outer product), which always has
 * rank ≤ 1, i.e. det(M) = ad - bc = 0. Conversely, any nonzero M with
 * det = 0 has rank 1 and *is* an outer product of two vectors — so the
 * determinant test is both necessary and sufficient, not an approximation.
 */
export function testSeparability(state: StateVector, tolerance = DEFAULT_TOLERANCE): SeparabilityResult {
  assertTwoQubits(state, "testSeparability");
  const [a, b, c, d] = state.amplitudes;
  const determinant = a.mul(d).sub(b.mul(c));
  const determinantMagnitude = determinant.magnitude();
  return { separable: determinantMagnitude < tolerance, determinantMagnitude };
}

export type TwoQubitJointProbabilities = {
  p00: number;
  p01: number;
  p10: number;
  p11: number;
};

/** The joint distribution P(q0=i, q1=j) for a 2-qubit state, as a labeled 2x2 table. */
export function twoQubitJointProbabilities(state: StateVector): TwoQubitJointProbabilities {
  assertTwoQubits(state, "twoQubitJointProbabilities");
  const [p00, p01, p10, p11] = state.probabilities();
  return { p00, p01, p10, p11 };
}
