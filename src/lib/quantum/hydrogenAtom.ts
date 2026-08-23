/**
 * The hydrogen atom's radial wavefunctions and energy levels — explicit
 * closed-form R_nl(r) for the four lowest states (1s, 2s, 2p) only,
 * deliberately not a general Laguerre-polynomial solver. This mirrors
 * `harmonicOscillator.ts`'s Hermite-polynomial scope decision exactly:
 * the states this course's lessons actually need are hardcoded and
 * verified numerically (normalization, orthogonality), rather than
 * building unused general machinery. Atomic units (a₀=1, energies in
 * units of the Rydberg, 13.6 eV) throughout.
 */

export const RYDBERG_EV = 13.6;

/** E_n = -13.6 eV / n^2 — the hydrogen energy levels, in electron-volts. */
export function hydrogenEnergyLevel(n: number): number {
  if (!Number.isInteger(n) || n < 1) throw new Error(`hydrogenEnergyLevel requires a positive integer n, got ${n}.`);
  return -RYDBERG_EV / (n * n);
}

/** R_10(r), the 1s radial wavefunction, in units where the Bohr radius a₀=1. */
export function radial1s(r: number): number {
  return 2 * Math.exp(-r);
}

/** R_20(r), the 2s radial wavefunction. */
export function radial2s(r: number): number {
  return (1 / (2 * Math.sqrt(2))) * (2 - r) * Math.exp(-r / 2);
}

/** R_21(r), the 2p radial wavefunction. */
export function radial2p(r: number): number {
  return (1 / (2 * Math.sqrt(6))) * r * Math.exp(-r / 2);
}

/**
 * ∫|R_nl(r)|² r² dr from 0 to a large cutoff, via the trapezoidal rule —
 * the radial normalization integral (the r² comes from the spherical
 * volume element, with the angular part already normalized separately by
 * the spherical harmonics). Used to check each R_nl numerically rather
 * than trusting its coefficient blindly.
 */
export function radialNormSquared(R: (r: number) => number, rMax = 40, steps = 20000): number {
  const dr = rMax / steps;
  let total = 0;
  for (let i = 0; i < steps; i++) {
    const r = (i + 0.5) * dr;
    total += R(r) * R(r) * r * r * dr;
  }
  return total;
}

/** ∫ R_a(r) R_b(r) r² dr — checks orthogonality between two different radial functions. */
export function radialInnerProduct(Ra: (r: number) => number, Rb: (r: number) => number, rMax = 40, steps = 20000): number {
  const dr = rMax / steps;
  let total = 0;
  for (let i = 0; i < steps; i++) {
    const r = (i + 0.5) * dr;
    total += Ra(r) * Rb(r) * r * r * dr;
  }
  return total;
}

/** The most probable radius for the 1s state, found by maximizing r²|R_10(r)|² directly (a real, if simple, optimization, not a lookup). */
export function mostProbableRadius1s(rMax = 10, steps = 100000): number {
  let bestR = 0;
  let bestValue = -Infinity;
  for (let i = 0; i <= steps; i++) {
    const r = (i / steps) * rMax;
    const value = r * r * radial1s(r) * radial1s(r);
    if (value > bestValue) {
      bestValue = value;
      bestR = r;
    }
  }
  return bestR;
}
