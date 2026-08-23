import { Complex } from "./complex";
import { Matrix } from "./matrix";

/**
 * The quantum harmonic oscillator's ladder operators, truncated to a
 * finite `dimension`-level Fock basis {|0⟩,...,|dimension-1⟩}. This is a
 * genuine, standard numerical technique (not a toy simplification of the
 * physics) — the harmonic oscillator's true Hilbert space is infinite-
 * dimensional, but truncating far above the energy levels you care about
 * approximates the low-lying structure well, and lets the existing
 * finite-dimensional `Matrix`/`StateVector` engine represent it exactly
 * like every other operator on this platform, with no PDE solver or
 * continuous wavefunction machinery required.
 *
 * a|n⟩ = √n|n-1⟩, a†|n⟩ = √(n+1)|n+1⟩ are both exact identities of the
 * true (untruncated) oscillator; the only approximation introduced here
 * is that a† sends the top basis state |dimension-1⟩ to 0 instead of to
 * |dimension⟩, since there's no room left in the truncated basis — the
 * standard, well-understood truncation error, worth stating honestly
 * rather than hiding.
 */

/** The annihilation operator a, truncated to a `dimension`-level Fock basis. */
export function annihilationOperator(dimension: number): Matrix {
  if (!Number.isInteger(dimension) || dimension < 1) {
    throw new Error(`annihilationOperator requires a positive integer dimension (got ${dimension}).`);
  }
  const data = Array.from({ length: dimension }, () => Array.from({ length: dimension }, () => Complex.ZERO));
  for (let j = 1; j < dimension; j++) {
    data[j - 1][j] = new Complex(Math.sqrt(j));
  }
  return new Matrix(data);
}

/** The creation operator a† = a's conjugate transpose, truncated the same way. */
export function creationOperator(dimension: number): Matrix {
  return annihilationOperator(dimension).dagger();
}

/** The number operator N = a†a, exactly diagonal(0, 1, ..., dimension-1) — no truncation error, since N never needs the state just above the cutoff. */
export function numberOperator(dimension: number): Matrix {
  if (!Number.isInteger(dimension) || dimension < 1) {
    throw new Error(`numberOperator requires a positive integer dimension (got ${dimension}).`);
  }
  const data = Array.from({ length: dimension }, (_, i) =>
    Array.from({ length: dimension }, (_, j) => (i === j ? new Complex(i) : Complex.ZERO))
  );
  return new Matrix(data);
}

/** Energy eigenvalues E_n = (n + 1/2)ℏω for n = 0..dimension-1, in units where ℏω is passed explicitly. */
export function harmonicOscillatorEnergyLevels(dimension: number, hbarOmega: number): number[] {
  return Array.from({ length: dimension }, (_, n) => (n + 0.5) * hbarOmega);
}
