import { Complex } from "./complex";
import type { Matrix } from "./matrix";

/**
 * Statistics of a Hermitian observable against a state — the "sandwich"
 * ⟨ψ|A|ψ⟩ and what's built from it. Kept separate from `measurement.ts`
 * (which samples/collapses) since these are properties of the
 * *distribution* of outcomes, not the act of measuring one.
 *
 * These functions take a minimal structural type (`{ amplitudes }`)
 * rather than `StateVector` itself, deliberately: `StateVector` enforces
 * a power-of-two dimension (a qubit register), but expectation values are
 * a general linear-algebra notion that makes sense for a vector of *any*
 * dimension — needed by "Operators, Observables & Measurement", whose
 * worked examples of degeneracy use plain 3-dimensional operators (no
 * qubit interpretation intended). Every existing call site that passes a
 * real `StateVector` keeps working unchanged, since `StateVector` already
 * has an `amplitudes` property and TypeScript's structural typing accepts
 * it directly — this is a widening of what's accepted, not a behavior
 * change for existing callers.
 */
type AmplitudeVector = { amplitudes: readonly Complex[] };

/** ⟨ψ|A|ψ⟩, for any operator A (real automatically when A is Hermitian and |ψ⟩ is normalized). */
export function expectationValue(state: AmplitudeVector, operator: Matrix): Complex {
  const applied = operator.apply(state.amplitudes as Complex[]);
  return state.amplitudes.reduce((sum, amplitude, i) => sum.add(amplitude.conjugate().mul(applied[i])), Complex.ZERO);
}

/** Var(A) = ⟨A²⟩ − ⟨A⟩², via the operator's own matrix product A·A. Real whenever A is Hermitian. */
export function variance(state: AmplitudeVector, operator: Matrix): number {
  const meanSquared = expectationValue(state, operator.mul(operator)).re;
  const mean = expectationValue(state, operator).re;
  return meanSquared - mean * mean;
}

/** ΔA = sqrt(Var(A)) — the standard deviation of measurement outcomes for observable A in state |ψ⟩. */
export function uncertainty(state: AmplitudeVector, operator: Matrix): number {
  return Math.sqrt(Math.max(0, variance(state, operator)));
}

/** [A, B] = AB − BA. */
export function commutator(a: Matrix, b: Matrix): Matrix {
  return a.mul(b).add(b.mul(a).scale(-1));
}

/** ⟨ψ|[A,B]|ψ⟩ — the expectation value entering the generalized uncertainty relation ΔA·ΔB ≥ ½|⟨[A,B]⟩|. */
export function commutatorExpectation(state: AmplitudeVector, a: Matrix, b: Matrix): Complex {
  return expectationValue(state, commutator(a, b));
}
