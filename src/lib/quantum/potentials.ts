import { Complex } from "./complex";
import type { Grid1D } from "./wavefunction";
import { Wavefunction1D } from "./wavefunction";

/**
 * Reusable 1D potential-energy functions V(x), each returning one number
 * per grid point (natural units, hbar = 1) — plus, for the potentials with
 * a closed-form solution, the analytical energy levels and eigenstates
 * used to verify the numerical engine (time evolution + Fourier-based
 * kinetic energy) against known physics. See timeEvolution.ts and
 * docs/ARCHITECTURE.md for how these two halves (numerical potential,
 * analytical eigenstate) are used together — the eigenstate presets in
 * this simulator are the closed-form solution evaluated on the grid, and
 * the numerical time-evolution engine is what *verifies* that solution
 * (by confirming it's stationary and has the right energy), not what
 * discovers it. This platform deliberately does not implement a general
 * numerical eigensolver (matrix diagonalization) — see ARCHITECTURE.md.
 */

export function freeParticlePotential(grid: Grid1D): number[] {
  return grid.x.map(() => 0);
}

export function harmonicOscillatorPotential(grid: Grid1D, omega: number, mass = 1): number[] {
  return grid.x.map((x) => 0.5 * mass * omega * omega * x * x);
}

/**
 * An infinite square well of full width `2*halfWidth`, centered at x=0.
 * A literal infinite wall is incompatible with the split-operator method's
 * periodic-boundary FFT machinery, so this uses a very tall but finite
 * wall (`wallHeight`, default 1e6) — a standard, well-understood numerical
 * approximation: any amplitude that leaks past the boundary dephases so
 * fast relative to the simulation's time step that it stays negligible.
 * Documented explicitly, not hidden — see the Wave Mechanics course's
 * "Time Evolution of Quantum States" lesson.
 */
export function infiniteSquareWellPotential(grid: Grid1D, halfWidth: number, wallHeight = 1e6): number[] {
  return grid.x.map((x) => (Math.abs(x) <= halfWidth ? 0 : wallHeight));
}

/** A finite square well of full width `2*halfWidth` and depth `depth` (>0) below the V=0 outside region. */
export function finiteSquareWellPotential(grid: Grid1D, halfWidth: number, depth: number): number[] {
  return grid.x.map((x) => (Math.abs(x) <= halfWidth ? -depth : 0));
}

/** A rectangular barrier of full width `2*halfWidth`, height `height`, centered at `center`. */
export function barrierPotential(grid: Grid1D, center: number, halfWidth: number, height: number): number[] {
  return grid.x.map((x) => (Math.abs(x - center) <= halfWidth ? height : 0));
}

/** E_n = n^2 * pi^2 / (2 * m * L^2), for an infinite well of full width `width`, n = 1, 2, 3, ... */
export function infiniteSquareWellEnergyLevel(n: number, width: number, mass = 1): number {
  if (n < 1) throw new Error("infiniteSquareWellEnergyLevel requires n >= 1.");
  return (n * n * Math.PI * Math.PI) / (2 * mass * width * width);
}

/** E_n = hbar*omega*(n + 1/2) = omega*(n + 1/2) in natural units, n = 0, 1, 2, ... */
export function harmonicOscillatorEnergyLevel(n: number, omega: number): number {
  if (n < 0) throw new Error("harmonicOscillatorEnergyLevel requires n >= 0.");
  return omega * (n + 0.5);
}

/**
 * The n-th infinite-square-well eigenstate, psi_n(x) = sqrt(2/L) *
 * sin(n*pi*(x+L/2)/L) inside the well (0 outside), L = 2*halfWidth —
 * satisfies psi_n(-halfWidth) = psi_n(halfWidth) = 0 by construction.
 * Normalized numerically on the grid as a safety net against discretization
 * error in the closed-form formula's continuum normalization constant.
 */
export function infiniteSquareWellEigenstate(grid: Grid1D, n: number, halfWidth: number): Wavefunction1D {
  if (n < 1) throw new Error("infiniteSquareWellEigenstate requires n >= 1.");
  const width = 2 * halfWidth;
  const amplitudes = grid.x.map((x) => {
    if (Math.abs(x) > halfWidth) return Complex.ZERO;
    const value = Math.sqrt(2 / width) * Math.sin((n * Math.PI * (x + halfWidth)) / width);
    return new Complex(value, 0);
  });
  return new Wavefunction1D(grid, amplitudes).normalize();
}

// Physicists' Hermite polynomials H_0..H_3, enough for the ground state and
// first three excited states — the presets this simulator actually offers.
const HERMITE_POLYNOMIALS: ((xi: number) => number)[] = [
  () => 1,
  (xi) => 2 * xi,
  (xi) => 4 * xi * xi - 2,
  (xi) => 8 * xi ** 3 - 12 * xi,
];

function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

/**
 * The n-th quantum harmonic oscillator eigenstate, evaluated from its
 * closed form: psi_n(x) = (m*omega/pi)^(1/4) / sqrt(2^n n!) * H_n(sqrt(m*omega)*x)
 * * exp(-m*omega*x^2/2) (hbar = 1). Only n = 0..3 are supported (the
 * available closed-form Hermite polynomials); this is a deliberately
 * narrow, honest scope rather than a general polynomial generator.
 */
export function harmonicOscillatorEigenstate(grid: Grid1D, n: number, omega: number, mass = 1): Wavefunction1D {
  if (n < 0 || n >= HERMITE_POLYNOMIALS.length) {
    throw new Error(
      `harmonicOscillatorEigenstate only supports n = 0..${HERMITE_POLYNOMIALS.length - 1}.`
    );
  }
  const alpha = mass * omega;
  const hermite = HERMITE_POLYNOMIALS[n];
  const normalization = Math.pow(alpha / Math.PI, 0.25) / Math.sqrt(Math.pow(2, n) * factorial(n));
  const amplitudes = grid.x.map((x) => {
    const xi = Math.sqrt(alpha) * x;
    const value = normalization * hermite(xi) * Math.exp(-(xi * xi) / 2);
    return new Complex(value, 0);
  });
  return new Wavefunction1D(grid, amplitudes).normalize();
}
