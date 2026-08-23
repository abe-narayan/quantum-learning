import type { Complex } from "./complex";
import { Matrix } from "./matrix";

/**
 * Projection operators — built for the "Operators, Observables &
 * Measurement" course's generalized measurement postulate (Born's rule
 * restated via projectors, correct for degenerate eigenspaces where the
 * earlier |c_i|^2 form silently assumed a nondegenerate eigenvalue) and
 * spectral decomposition (writing a Hermitian operator as a sum over its
 * eigenspaces' projectors). Deliberately its own small file rather than
 * folded into `observables.ts`: those functions describe statistics of an
 * existing operator, these *construct* operators (rank-1 or higher-rank
 * projectors) from state vectors.
 */

/** The outer product |ket⟩⟨bra|, a rank-1 matrix: (|ket⟩⟨bra|)_ij = ket_i · conj(bra_j). */
export function outerProduct(ket: readonly Complex[], bra: readonly Complex[]): Matrix {
  if (ket.length !== bra.length) {
    throw new Error("outerProduct requires ket and bra of the same dimension.");
  }
  return new Matrix(ket.map((ki) => bra.map((bj) => ki.mul(bj.conjugate()))));
}

/**
 * The projector onto the subspace spanned by an orthonormal set of
 * vectors (plain amplitude arrays, not `StateVector` — a projector is a
 * general linear-algebra object with no built-in restriction to
 * power-of-two, qubit-register dimensions): P = sum_k |v_k⟩⟨v_k|. For a
 * single nondegenerate eigenvector this is the familiar rank-1 |a⟩⟨a|;
 * for several vectors spanning a degenerate eigenspace, it's the
 * higher-rank projector onto that whole eigenspace. Callers are
 * responsible for passing an orthonormal set (not re-verified here,
 * matching this codebase's convention of trusting internal callers — see
 * docs/ARCHITECTURE.md). Pass `someStateVector.amplitudes` directly for
 * qubit-register examples, or a plain `Complex[]` for others.
 */
export function projectorOntoSubspace(vectors: readonly (readonly Complex[])[]): Matrix {
  if (vectors.length === 0) {
    throw new Error("projectorOntoSubspace requires at least one vector.");
  }
  return vectors
    .map((v) => outerProduct(v, v))
    .reduce((sum, p) => sum.add(p));
}
