/**
 * Pure progression logic for revealing hints one at a time, extracted out
 * of `ProblemView` so it's testable without rendering React — the same
 * reason the quantum engine never imports React either.
 */
export function revealNextHint(currentRevealed: number, totalHints: number): number {
  return Math.min(currentRevealed + 1, totalHints);
}
