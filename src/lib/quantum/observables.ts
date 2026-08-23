import { Complex } from "./complex";
import type { Matrix } from "./matrix";
import type { StateVector } from "./state";

/**
 * Statistics of a Hermitian observable against a state — the "sandwich"
 * ⟨ψ|A|ψ⟩ and what's built from it. Kept separate from `measurement.ts`
 * (which samples/collapses) since these are properties of the
 * *distribution* of outcomes, not the act of measuring one.
 */

/** ⟨ψ|A|ψ⟩, for any operator A (real automatically when A is Hermitian and |ψ⟩ is normalized). */
export function expectationValue(state: StateVector, operator: Matrix): Complex {
  const applied = operator.apply(state.amplitudes as Complex[]);
  return state.amplitudes.reduce((sum, amplitude, i) => sum.add(amplitude.conjugate().mul(applied[i])), Complex.ZERO);
}

/** Var(A) = ⟨A²⟩ − ⟨A⟩², via the operator's own matrix product A·A. Real whenever A is Hermitian. */
export function variance(state: StateVector, operator: Matrix): number {
  const meanSquared = expectationValue(state, operator.mul(operator)).re;
  const mean = expectationValue(state, operator).re;
  return meanSquared - mean * mean;
}

/** ΔA = sqrt(Var(A)) — the standard deviation of measurement outcomes for observable A in state |ψ⟩. */
export function uncertainty(state: StateVector, operator: Matrix): number {
  return Math.sqrt(Math.max(0, variance(state, operator)));
}

/** [A, B] = AB − BA. */
export function commutator(a: Matrix, b: Matrix): Matrix {
  return a.mul(b).add(b.mul(a).scale(-1));
}

/** ⟨ψ|[A,B]|ψ⟩ — the expectation value entering the generalized uncertainty relation ΔA·ΔB ≥ ½|⟨[A,B]⟩|. */
export function commutatorExpectation(state: StateVector, a: Matrix, b: Matrix): Complex {
  return expectationValue(state, commutator(a, b));
}
