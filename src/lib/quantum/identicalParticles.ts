import { Complex } from "./complex";

/**
 * Two-identical-particle states, built directly on plain Complex[] vectors
 * (not StateVector, which forces a power-of-2 qubit dimension — an
 * unnecessary restriction for an arbitrary single-particle orbital basis).
 * Deliberately scoped to exactly two particles: symmetrization,
 * antisymmetrization, and the exchange operator all generalize to N
 * particles via permutation sums, but implementing that general case
 * (needed nowhere in this course's lessons) would be exactly the kind of
 * "build machinery nothing uses yet" this platform avoids. See
 * docs/ARCHITECTURE.md.
 */

function assertSameLength(a: readonly Complex[], b: readonly Complex[]) {
  if (a.length !== b.length) throw new Error(`Vectors must have the same length (got ${a.length} and ${b.length}).`);
}

function vectorAdd(a: readonly Complex[], b: readonly Complex[]): Complex[] {
  assertSameLength(a, b);
  return a.map((v, i) => v.add(b[i]));
}

function vectorSub(a: readonly Complex[], b: readonly Complex[]): Complex[] {
  assertSameLength(a, b);
  return a.map((v, i) => v.sub(b[i]));
}

function vectorNorm(v: readonly Complex[]): number {
  return Math.sqrt(v.reduce((sum, c) => sum + c.magnitudeSquared(), 0));
}

/** Normalizes a vector; throws for a (near-)zero vector rather than dividing by ~0 — this is deliberately not silently handled, since a zero result is itself meaningful (see antisymmetrize). */
export function normalizeVector(v: readonly Complex[]): Complex[] {
  const n = vectorNorm(v);
  if (n < 1e-9) throw new Error("Cannot normalize a (near-)zero vector — this state does not exist.");
  return v.map((c) => c.scale(1 / n));
}

/** ⟨a|b⟩ for two single-particle (or already-combined) amplitude vectors. */
export function innerProduct(a: readonly Complex[], b: readonly Complex[]): Complex {
  assertSameLength(a, b);
  return a.reduce((sum, c, i) => sum.add(c.conjugate().mul(b[i])), Complex.ZERO);
}

/** The (Kronecker) tensor product of two single-particle vectors, |a⟩⊗|b⟩ — the two-particle "particle 1 in a, particle 2 in b" product state, before any symmetrization. */
export function tensorProduct(a: readonly Complex[], b: readonly Complex[]): Complex[] {
  const combined: Complex[] = [];
  for (const x of a) {
    for (const y of b) {
      combined.push(x.mul(y));
    }
  }
  return combined;
}

/**
 * The exchange (swap) operator P₁₂ acting on a combined two-particle
 * vector built from single-particle dimension `dimA`/`dimB`: relabels
 * coefficient c_ij (particle 1 in i, particle 2 in j) to sit at the (j,i)
 * position instead — i.e. swaps which particle is "in" which state. Used
 * to numerically verify that symmetrize/antisymmetrize outputs are
 * genuine ±1 eigenstates of this operator, not just plausible-looking
 * combinations.
 */
export function exchangeParticles(psi: readonly Complex[], dimA: number, dimB: number): Complex[] {
  if (psi.length !== dimA * dimB) throw new Error(`exchangeParticles: expected length ${dimA * dimB}, got ${psi.length}.`);
  if (dimA !== dimB) throw new Error("exchangeParticles requires dimA === dimB (identical particles share one single-particle basis).");
  const dim = dimA;
  const result = new Array<Complex>(psi.length).fill(Complex.ZERO);
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      result[j * dim + i] = psi[i * dim + j];
    }
  }
  return result;
}

/**
 * The normalized symmetric combination (|a⟩⊗|b⟩+|b⟩⊗|a⟩), appropriate
 * for two identical BOSONS — a valid, normalizable state whether or not
 * a=b (bosons happily "pile up" in the same single-particle state).
 */
export function symmetrize(a: readonly Complex[], b: readonly Complex[]): Complex[] {
  const sum = vectorAdd(tensorProduct(a, b), tensorProduct(b, a));
  return normalizeVector(sum);
}

/**
 * The normalized antisymmetric combination (|a⟩⊗|b⟩-|b⟩⊗|a⟩), appropriate
 * for two identical FERMIONS. When a and b are the same single-particle
 * state, this difference is exactly the zero vector — `normalizeVector`
 * then throws, which is not an implementation limitation but the Pauli
 * exclusion principle itself, falling directly out of the antisymmetric
 * construction rather than being asserted separately.
 */
export function antisymmetrize(a: readonly Complex[], b: readonly Complex[]): Complex[] {
  const diff = vectorSub(tensorProduct(a, b), tensorProduct(b, a));
  return normalizeVector(diff);
}
