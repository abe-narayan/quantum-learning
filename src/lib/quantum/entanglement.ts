import type { StateVector } from "./state";
import { testSeparability } from "./twoQubit";
import { pureStateDensityMatrix, vonNeumannEntropy } from "./densityMatrix";
import { reducedDensityMatrixQubit0 } from "./partialTrace";

/**
 * Entanglement measures — deliberately narrow in scope, matching this
 * platform's existing "prove what's claimed, don't overreach" discipline.
 * Two genuinely different tools, for two genuinely different questions:
 *
 * - `entanglementEntropy` answers "how entangled is this *pure* bipartite
 *   state?" — valid ONLY when the global state is pure. It is NOT a
 *   general mixed-state entanglement measure (a mixed global state's
 *   reduced-state entropy conflates entanglement with the observer's
 *   prior ignorance about which state was prepared — a distinction this
 *   course proves explicitly, not just asserts).
 * - `concurrenceOfPureState` answers the same question a different way,
 *   for two-qubit *pure* states specifically, reusing the exact
 *   determinant `testSeparability` already computes (concurrence is
 *   twice that determinant's magnitude) — not a coincidence, a direct
 *   mathematical identity. This is the pure-state formula only; the
 *   general Wootters concurrence for *mixed* two-qubit states requires
 *   eigenvalues of a non-Hermitian 4x4 matrix product, a genuinely harder
 *   numerical problem this platform does not implement (no general
 *   eigensolver — see docs/ARCHITECTURE.md).
 */

/**
 * The entanglement entropy of a pure 2-qubit state: the von Neumann
 * entropy of qubit 0's reduced density matrix (equivalently qubit 1's —
 * a pure bipartite state's two reduced entropies are always equal, since
 * Tr_B(ρ) and Tr_A(ρ) share the same nonzero eigenvalues, a standard fact
 * of the Schmidt decomposition, verified directly in this module's
 * tests). Valid *only* for a globally pure state — for a mixed global
 * state, use a genuine mixed-state measure (this platform implements
 * `concurrenceOfPureState` for the pure two-qubit case only; a general
 * mixed-state entanglement measure remains out of scope).
 */
export function entanglementEntropy(state: StateVector): number {
  if (state.numQubits !== 2) {
    throw new Error(`entanglementEntropy currently supports only 2-qubit states (got ${state.numQubits} qubits).`);
  }
  const rho = pureStateDensityMatrix(state);
  const reduced = reducedDensityMatrixQubit0(rho);
  return vonNeumannEntropy(reduced);
}

/**
 * Concurrence for a PURE two-qubit state a|00⟩+b|01⟩+c|10⟩+d|11⟩:
 * C = 2|ad-bc|, exactly twice the determinant magnitude
 * `testSeparability` already computes for exactly the same reason
 * (a nonzero determinant is precisely the signature of entanglement).
 * Ranges from 0 (product state) to 1 (a Bell state, maximally
 * entangled). This is the pure-state formula only — see this module's
 * top-level doc comment for why the general mixed-state Wootters
 * concurrence is out of scope.
 */
export function concurrenceOfPureState(state: StateVector): number {
  const { determinantMagnitude } = testSeparability(state);
  return 2 * determinantMagnitude;
}

/** Whether a 2-qubit pure state is entangled at all — a thin, explicit re-export of testSeparability's own result, since "entangled" and "not separable" are the same question. */
export function isEntangled(state: StateVector, tolerance = 1e-9): boolean {
  return !testSeparability(state, tolerance).separable;
}
