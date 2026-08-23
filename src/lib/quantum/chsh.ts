import { Matrix } from "./matrix";
import { PAULI_X, PAULI_Z } from "./gates";
import { densityMatrixExpectationValue } from "./densityMatrix";

/**
 * The CHSH correlation machinery — everything needed to compute
 * S = E(A,B) + E(A,B') + E(A',B) - E(A',B') for a two-qubit density
 * matrix and four single-qubit measurement observables, and to check it
 * against the classical (local hidden variable) bound |S| ≤ 2 and the
 * quantum (Tsirelson) bound 2√2.
 */

/**
 * A spin measurement observable along the axis at angle `theta` from Z,
 * confined to the X-Z plane: cos(θ)Z + sin(θ)X. Hermitian (a real linear
 * combination of Hermitian Paulis) with eigenvalues exactly ±1 — a
 * rotated Pauli operator, in exactly the sense `rotationAboutAxis`
 * rotates Bloch-sphere *states*; this rotates the *measurement axis*
 * instead. This is the standard family of observables used to probe
 * CHSH violations, deliberately restricted to one plane (two angles is
 * already enough to see a violation, and restricting to a plane keeps
 * the numbers in a lesson concrete without losing any of the physics).
 */
export function spinObservableInXZPlane(theta: number): Matrix {
  return PAULI_Z.scale(Math.cos(theta)).add(PAULI_X.scale(Math.sin(theta)));
}

/** E(A,B) = Tr[ρ(A⊗B)] — the correlation between measuring observable A on qubit 0 and B on qubit 1. */
export function correlationExpectation(rho: Matrix, observableA: Matrix, observableB: Matrix): number {
  const combined = observableA.tensor(observableB);
  return densityMatrixExpectationValue(rho, combined).re;
}

export type ChshObservables = { a: Matrix; aPrime: Matrix; b: Matrix; bPrime: Matrix };

/**
 * The CHSH combination S = E(A,B) + E(A,B') + E(A',B) - E(A',B'). Local
 * hidden-variable theories are provably bounded by |S| ≤ 2 (Bell's
 * theorem — see the lesson for the derivation); quantum mechanics can
 * reach |S| = 2√2 ≈ 2.828 (Tsirelson's bound) for an entangled state
 * with the right choice of A, A', B, B'.
 */
export function chshValue(rho: Matrix, observables: ChshObservables): number {
  const { a, aPrime, b, bPrime } = observables;
  return (
    correlationExpectation(rho, a, b) +
    correlationExpectation(rho, a, bPrime) +
    correlationExpectation(rho, aPrime, b) -
    correlationExpectation(rho, aPrime, bPrime)
  );
}

/** The classical (local hidden variable) bound every local realistic theory must satisfy. */
export const CHSH_CLASSICAL_BOUND = 2;

/** Tsirelson's bound — the maximum |S| quantum mechanics can produce for any state and any choice of observables. */
export const CHSH_QUANTUM_BOUND = 2 * Math.SQRT2;
