import { Complex } from "./complex";

/**
 * Small, genuinely new helpers for the Complex Amplitude Explorer and the
 * lessons that use it — deliberately not folded into `complex.ts` (whose
 * methods, magnitude/phase/fromPolar, this builds on rather than
 * duplicates) since these are about *two-amplitude* systems and
 * *interference*, not properties of a single complex number.
 */

/**
 * Builds a normalized two-level amplitude pair [α, β] with
 * |α|² + |β|² = 1, from a single "how much weight is on α" parameter.
 * `alphaMagnitude` must be in [0, 1]; β's magnitude is the unique
 * non-negative value making the pair normalized,
 * √(1 − |α|²). Phases are independent and don't affect normalization.
 */
export function normalizedTwoLevelAmplitudes(
  alphaMagnitude: number,
  alphaPhase: number,
  betaPhase: number
): [Complex, Complex] {
  if (alphaMagnitude < 0 || alphaMagnitude > 1) {
    throw new Error(`alphaMagnitude must be in [0, 1] (got ${alphaMagnitude}).`);
  }
  const betaMagnitude = Math.sqrt(Math.max(0, 1 - alphaMagnitude * alphaMagnitude));
  return [Complex.fromPolar(alphaMagnitude, alphaPhase), Complex.fromPolar(betaMagnitude, betaPhase)];
}

/**
 * The quantum ("interfering") probability of two amplitudes contributing
 * to the *same* outcome: |a + b|², which depends on their relative phase.
 */
export function interferenceProbability(a: Complex, b: Complex): number {
  return a.add(b).magnitudeSquared();
}

/**
 * The classical ("non-interfering") probability of the same two
 * contributions: |a|² + |b|², as if they were independent probabilities
 * simply added — the quantity interference differs from, and the reason
 * relative phase is physically meaningful.
 */
export function classicalSumProbability(a: Complex, b: Complex): number {
  return a.magnitudeSquared() + b.magnitudeSquared();
}
