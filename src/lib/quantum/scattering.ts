/**
 * Closed-form 1D scattering off a step or rectangular barrier — plane-wave
 * boundary matching (continuity of psi and psi' across each discontinuity),
 * not the grid/Wavefunction1D machinery used elsewhere in this engine.
 * There's no grid here: reflection and transmission probabilities are
 * algebraic functions of energy alone, for a genuinely different physical
 * regime than the Wavefunction Explorer's tunneling preset — this module
 * is specifically E > (barrier height), "over the barrier" scattering,
 * where the wavefunction oscillates (not decays) everywhere, including
 * inside the barrier. Natural units, hbar = m = 1, throughout.
 */

function wavenumber(energy: number): number {
  if (!(energy > 0)) {
    throw new Error(`wavenumber requires a positive energy, got ${energy}.`);
  }
  return Math.sqrt(2 * energy);
}

export type ScatteringResult = { reflection: number; transmission: number };

/**
 * Reflection and transmission probabilities for a particle of energy
 * `energy` incident from the left on a step potential (V=0 for x<0,
 * V=stepHeight for x>=0), with energy > stepHeight (over-the-step
 * scattering — classically certain transmission, but quantum mechanically
 * partially reflected). Derived from matching psi, psi' at x=0.
 */
export function stepPotentialScattering(energy: number, stepHeight: number): ScatteringResult {
  if (!(energy > stepHeight)) {
    throw new Error(
      `stepPotentialScattering requires energy > stepHeight (got energy=${energy}, stepHeight=${stepHeight}). Energy <= stepHeight is total reflection, which is not covered by this over-the-step formula.`
    );
  }
  const k1 = wavenumber(energy);
  const k2 = wavenumber(energy - stepHeight);
  const reflection = ((k1 - k2) / (k1 + k2)) ** 2;
  const transmission = (4 * k1 * k2) / (k1 + k2) ** 2;
  return { reflection, transmission };
}

/**
 * Transmission probability through a rectangular barrier of height
 * `barrierHeight` and full width `barrierWidth` (= 2 * halfWidth, matching
 * `potentials.ts`'s barrierPotential half-width convention doubled), for a
 * particle of energy > barrierHeight. Derived from matching psi, psi' at
 * both edges of the barrier (three regions: incident+reflected,
 * oscillating-inside, transmitted) — a standard, closed-form result:
 *
 *   T = [1 + barrierHeight^2 * sin^2(k2 * barrierWidth) / (4 * energy * (energy - barrierHeight))]^-1
 *
 * with k2 = sqrt(2*(energy - barrierHeight)) the wavenumber *inside* the
 * barrier. T = 1 exactly whenever k2 * barrierWidth is a multiple of pi —
 * a resonance, where the barrier is perfectly transparent despite being
 * classically an obstacle, directly analogous to anti-reflective optical
 * coatings.
 */
export function barrierScatteringTransmission(energy: number, barrierHeight: number, barrierWidth: number): number {
  if (!(energy > barrierHeight)) {
    throw new Error(
      `barrierScatteringTransmission requires energy > barrierHeight (got energy=${energy}, barrierHeight=${barrierHeight}). Use the Wavefunction Explorer's tunneling preset for energy < barrierHeight.`
    );
  }
  const k2 = Math.sqrt(2 * (energy - barrierHeight));
  const sinTerm = Math.sin(k2 * barrierWidth) ** 2;
  const denominator = 1 + (barrierHeight ** 2 * sinTerm) / (4 * energy * (energy - barrierHeight));
  return 1 / denominator;
}
