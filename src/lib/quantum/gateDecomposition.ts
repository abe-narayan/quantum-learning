import type { Matrix } from "./matrix";
import type { Complex } from "./complex";

/**
 * Gate decomposition support: a single reusable utility for checking
 * whether two single-qubit matrices implement the same physical gate up
 * to an unobservable global phase (Mathematical Foundations' global-phase
 * invariance, revisited here as a real compilation concern — a hardware
 * backend's native gate set only needs to reproduce a target gate up to
 * this phase, not exactly). The specific decompositions this course's
 * lessons use (H = Ry(π/2)Rz(π), X = Rz(π)Ry(π), etc.) are plain
 * compositions of gates.ts's existing rotationY/rotationZ — no separate
 * wrapper functions needed for each, since they're just matrix products
 * already expressible with what this platform has.
 */
export function matricesEqualUpToGlobalPhase(a: Matrix, b: Matrix, tolerance = 1e-9): boolean {
  if (a.rows !== b.rows || a.cols !== b.cols) return false;
  let phaseNumerator: Complex | null = null;
  let phaseDenominator: Complex | null = null;
  for (let r = 0; r < a.rows && phaseNumerator === null; r++) {
    for (let c = 0; c < a.cols; c++) {
      const av = a.get(r, c);
      if (av.magnitude() > 1e-6) {
        phaseNumerator = b.get(r, c);
        phaseDenominator = av;
        break;
      }
    }
  }
  if (phaseNumerator === null || phaseDenominator === null) {
    // `a` is the zero matrix; equal up to phase iff `b` is also zero.
    for (let r = 0; r < b.rows; r++) {
      for (let c = 0; c < b.cols; c++) {
        if (b.get(r, c).magnitude() > tolerance) return false;
      }
    }
    return true;
  }
  const phase = phaseNumerator.div(phaseDenominator);
  if (Math.abs(phase.magnitude() - 1) > 1e-6) return false; // must be a genuine phase (unit magnitude)
  for (let r = 0; r < a.rows; r++) {
    for (let c = 0; c < a.cols; c++) {
      if (a.get(r, c).mul(phase).sub(b.get(r, c)).magnitude() > tolerance) return false;
    }
  }
  return true;
}
