/**
 * A minimal, numerically well-behaved introduction to the path integral
 * formulation — deliberately using EUCLIDEAN (imaginary) time rather than
 * real time. The real-time free-particle propagator is a pure phase
 * (a genuine, undamped oscillatory Fresnel integral), which brute-force
 * grid integration cannot converge on reliably without a regularization
 * scheme beyond this course's scope. The Euclidean-time propagator is a
 * real, positive, rapidly-decaying Gaussian — trivial to integrate
 * numerically to high accuracy — while illustrating exactly the same
 * "sum over intermediate positions, weighted by exp(-action/hbar)"
 * structure. This is a genuine, standard technique (Wick rotation /
 * Euclidean path integrals are used throughout statistical mechanics and
 * QFT), not a toy simplification invented for this platform — stated
 * explicitly rather than silently substituted for the real-time case.
 */

/** The Euclidean (imaginary-time) classical action for a free particle traveling from xi to xf over imaginary-time interval tau: S_E = m(xf-xi)^2/(2*tau). */
export function euclideanFreeParticleAction(xf: number, xi: number, tau: number, mass = 1): number {
  if (!(tau > 0)) throw new Error("euclideanFreeParticleAction requires tau > 0.");
  return (mass * (xf - xi) * (xf - xi)) / (2 * tau);
}

/**
 * The EXACT Euclidean free-particle propagator (heat/diffusion kernel),
 * K_E(xf,xi;tau) = sqrt(m/(2*pi*hbar*tau)) * exp(-S_E/hbar) — the closed
 * form the discretized path sum below is checked against.
 */
export function euclideanFreePropagator(xf: number, xi: number, tau: number, mass = 1, hbar = 1): number {
  const prefactor = Math.sqrt(mass / (2 * Math.PI * hbar * tau));
  const action = euclideanFreeParticleAction(xf, xi, tau, mass);
  return prefactor * Math.exp(-action / hbar);
}

/**
 * A genuine discretized path-integral sum: splits the time interval tau
 * into two halves and numerically integrates over every possible
 * intermediate position x1, weighting each two-segment path by the
 * product of its two segment propagators — literally "sum over paths,"
 * with exactly one intermediate point. By the Chapman-Kolmogorov /
 * Gaussian-convolution identity, this must equal the single exact
 * full-interval propagator; the numerical agreement (to grid-resolution
 * precision) is a genuine confirmation of the path integral's composition
 * law, not a restatement of the formula that built it.
 */
export function discretizedTwoSlicePropagator(
  xf: number,
  xi: number,
  tau: number,
  options: { mass?: number; hbar?: number; xRange?: number; steps?: number } = {}
): number {
  const mass = options.mass ?? 1;
  const hbar = options.hbar ?? 1;
  const xRange = options.xRange ?? 20;
  const steps = options.steps ?? 4000;
  const halfTau = tau / 2;
  const dx = (2 * xRange) / steps;
  let total = 0;
  for (let i = 0; i < steps; i++) {
    const x1 = -xRange + (i + 0.5) * dx;
    const leg1 = euclideanFreePropagator(xf, x1, halfTau, mass, hbar);
    const leg2 = euclideanFreePropagator(x1, xi, halfTau, mass, hbar);
    total += leg1 * leg2 * dx;
  }
  return total;
}
