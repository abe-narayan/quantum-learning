import { Complex } from "./complex";
import { Matrix } from "./matrix";
import { StateVector } from "./state";
import { outerProduct } from "./projectors";

/**
 * The density-matrix representation of a quantum state — a genuine
 * generalization of `StateVector`, not a parallel system: every pure
 * state |ψ⟩ has a density matrix ρ=|ψ⟩⟨ψ|, and every calculation this
 * module does on that ρ (expectation values, measurement probabilities)
 * reproduces exactly what `StateVector`-based code already computes for
 * that same state (proven in "From State Vectors to Density Matrices"
 * and checked directly in this module's tests) — density matrices exist
 * to describe two things `StateVector` structurally cannot: a *part* of
 * an entangled system (see `partialTrace.ts`), and genuine classical
 * uncertainty about which state a system is in (a probabilistic mixture,
 * not a superposition).
 *
 * A density matrix here is simply a `Matrix` — no new wrapper class. Any
 * `Matrix` can be tested for validity via `validateDensityMatrix`, but
 * nothing prevents constructing or working with one directly, matching
 * this codebase's existing convention of using `Matrix` for every kind of
 * operator (gates, observables, projectors) rather than one wrapper type
 * per physical role.
 */

/** ρ = |ψ⟩⟨ψ|, the density matrix of a pure state. Reuses `outerProduct` directly — no duplicated complex arithmetic. */
export function pureStateDensityMatrix(state: StateVector): Matrix {
  return outerProduct(state.amplitudes, state.amplitudes);
}

/** The density matrix of a computational basis state |index⟩, e.g. computationalBasisDensityMatrix(2, 0) = |00⟩⟨00|. */
export function computationalBasisDensityMatrix(numQubits: number, index: number): Matrix {
  return pureStateDensityMatrix(StateVector.basis(numQubits, index));
}

/** The maximally mixed state on `dimension` levels: I/dimension. For a single qubit, I/2. */
export function maximallyMixedState(dimension: number): Matrix {
  if (!Number.isInteger(dimension) || dimension < 1) {
    throw new Error(`maximallyMixedState requires a positive integer dimension, got ${dimension}.`);
  }
  return Matrix.identity(dimension).scale(1 / dimension);
}

export type MixtureTerm = { probability: number; density: Matrix };

/**
 * A genuine probabilistic (classical) mixture ρ = Σ p_i ρ_i — the general
 * convex-combination construction every physical mixed state reduces to.
 * Requires the probabilities to be non-negative and sum to 1 (an actual
 * classical probability distribution over which state the system is in).
 * A convex combination of valid density matrices is automatically
 * Hermitian, trace-1, and positive semi-definite — a fact this module's
 * tests check directly rather than merely asserting, and the reasoning
 * behind why `validateDensityMatrix` doesn't need to be re-run on
 * anything this function builds from already-valid inputs.
 */
export function convexCombination(terms: MixtureTerm[]): Matrix {
  if (terms.length === 0) throw new Error("convexCombination requires at least one term.");
  const totalProbability = terms.reduce((sum, term) => sum + term.probability, 0);
  if (Math.abs(totalProbability - 1) > 1e-9) {
    throw new Error(`convexCombination requires probabilities summing to 1, got ${totalProbability}.`);
  }
  if (terms.some((term) => term.probability < -1e-12)) {
    throw new Error("convexCombination requires every probability to be non-negative.");
  }
  return terms.reduce(
    (sum, term) => sum.add(term.density.scale(term.probability)),
    Matrix.zeros(terms[0].density.rows, terms[0].density.cols)
  );
}

/** Tr(ρ²) — exactly 1 for a pure state, strictly less than 1 for any genuinely mixed state (proven in "Pure States and Mixed States"). */
export function purity(rho: Matrix): number {
  return rho.mul(rho).trace().re;
}

/** Whether rho is (numerically) a pure state, i.e. purity ≈ 1. */
export function isPureState(rho: Matrix, tolerance = 1e-6): boolean {
  return Math.abs(purity(rho) - 1) < tolerance;
}

export type DensityMatrixValidation = {
  valid: boolean;
  isHermitian: boolean;
  hasUnitTrace: boolean;
  /**
   * true/false only for 2x2 matrices, computed exactly via
   * `eigenvaluesHermitian2x2`; null for any larger matrix, since this
   * platform does not implement a general eigensolver (see
   * docs/ARCHITECTURE.md) and a 2x2 closed-form routine is not one —
   * larger matrices built by this module's own constructors
   * (`pureStateDensityMatrix`, `convexCombination`, `partialTrace` of a
   * valid input) are positive semi-definite by construction, proven in
   * the course rather than re-verified numerically here.
   */
  isPositiveSemiDefinite: boolean | null;
};

/** Checks the defining physical properties of a density matrix: Hermitian, trace 1, and (for 2x2 only) positive semi-definite. */
export function validateDensityMatrix(rho: Matrix, tolerance = 1e-6): DensityMatrixValidation {
  if (rho.rows !== rho.cols) {
    throw new Error(`validateDensityMatrix requires a square matrix (got ${rho.rows}x${rho.cols}).`);
  }
  const isHermitian = rho.isHermitian(tolerance);
  const traceValue = rho.trace();
  const hasUnitTrace = Math.abs(traceValue.re - 1) < tolerance && Math.abs(traceValue.im) < tolerance;

  let isPositiveSemiDefinite: boolean | null = null;
  if (rho.rows === 2 && isHermitian) {
    const [lambda1, lambda2] = eigenvaluesHermitian2x2(rho);
    isPositiveSemiDefinite = lambda1 >= -tolerance && lambda2 >= -tolerance;
  }

  return {
    valid: isHermitian && hasUnitTrace && isPositiveSemiDefinite !== false,
    isHermitian,
    hasUnitTrace,
    isPositiveSemiDefinite,
  };
}

/**
 * The exact eigenvalues of a 2x2 Hermitian matrix [[a,b],[b*,d]], via the
 * closed-form quadratic-formula solution — not a numerical iteration, and
 * not a general eigensolver: this platform does not have one (see
 * docs/ARCHITECTURE.md), and this function is deliberately restricted to
 * dimension 2, where a closed form actually exists. Returned in
 * descending order.
 */
export function eigenvaluesHermitian2x2(matrix: Matrix): [number, number] {
  if (matrix.rows !== 2 || matrix.cols !== 2) {
    throw new Error(`eigenvaluesHermitian2x2 requires a 2x2 matrix (got ${matrix.rows}x${matrix.cols}).`);
  }
  const a = matrix.get(0, 0).re;
  const d = matrix.get(1, 1).re;
  const offDiagonalMagnitudeSquared = matrix.get(0, 1).magnitudeSquared();
  const mean = (a + d) / 2;
  const discriminant = Math.sqrt(((a - d) / 2) ** 2 + offDiagonalMagnitudeSquared);
  return [mean + discriminant, mean - discriminant];
}

function entropyTerm(lambda: number): number {
  // The 0*log2(0) = 0 convention: a zero-probability eigenvalue contributes
  // no entropy, even though log2(0) itself is -Infinity. Also guards
  // against tiny negative numerical noise from floating point.
  if (lambda <= 1e-12) return 0;
  return -lambda * Math.log2(lambda);
}

/**
 * Von Neumann entropy S(ρ) = -Tr(ρ log₂ρ) = -Σᵢ λᵢlog₂λᵢ, computed from
 * ρ's actual eigenvalues (via `eigenvaluesHermitian2x2`), not from its
 * diagonal entries — those agree only when ρ happens to already be
 * diagonal, which is not true in general (e.g. `|+⟩⟨+|` is pure, S=0,
 * despite having equal 1/2, 1/2 diagonal entries identical to the
 * maximally mixed state's). Scoped to 2x2 matrices only, for the same
 * reason `eigenvaluesHermitian2x2` is.
 */
export function vonNeumannEntropy(rho: Matrix): number {
  const eigenvalues = eigenvaluesHermitian2x2(rho);
  return eigenvalues.reduce((sum, lambda) => sum + entropyTerm(lambda), 0);
}

/** ⟨A⟩ = Tr(ρA), the density-matrix form of an expectation value — agrees with `observables.ts`'s ⟨ψ|A|ψ⟩ exactly when ρ = |ψ⟩⟨ψ| (proven and tested directly). */
export function densityMatrixExpectationValue(rho: Matrix, operator: Matrix): Complex {
  return rho.mul(operator).trace();
}

/** P(outcome i) = Tr(P_i ρ), the generalized Born rule restated for density matrices — the same projector-based formula "The Measurement Postulate, Generalized" derived for state vectors. */
export function densityMatrixMeasurementProbability(rho: Matrix, projector: Matrix): number {
  return densityMatrixExpectationValue(rho, projector).re;
}

/** The post-measurement state ρ_i = P_i ρ P_i / Tr(P_i ρ), given the outcome associated with projector P_i actually occurred. */
export function densityMatrixCollapse(rho: Matrix, projector: Matrix): Matrix {
  const probability = densityMatrixMeasurementProbability(rho, projector);
  if (probability < 1e-12) {
    throw new Error("Cannot collapse onto an outcome with (numerically) zero probability.");
  }
  return projector.mul(rho).mul(projector).scale(1 / probability);
}

/** Unitary evolution ρ' = UρU† — the density-matrix form of |ψ'⟩ = U|ψ⟩, provably trace-, Hermiticity-, and purity-preserving (checked directly in tests). */
export function evolveDensityMatrix(rho: Matrix, unitary: Matrix): Matrix {
  return unitary.mul(rho).mul(unitary.dagger());
}
