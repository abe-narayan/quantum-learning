import { Complex } from "./complex";

/**
 * Explicit closed-form spherical harmonics Y_l^m(θ,φ) for l=0,1,2 —
 * deliberately not a general-l recursive or Legendre-polynomial-based
 * implementation. This platform's angular-momentum scope (spin systems,
 * a few hydrogen orbitals) never needs l>2, so a general associated-
 * Legendre-polynomial engine would be unused machinery; these six
 * formulas are the standard closed forms, checked directly for
 * orthonormality by numerical integration over the sphere, not merely
 * transcribed from a table.
 */

export type SphericalHarmonicIndex = { l: 0 | 1 | 2; m: number };

export function sphericalHarmonic({ l, m }: SphericalHarmonicIndex, theta: number, phi: number): Complex {
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  if (l === 0) return new Complex(1 / (2 * Math.sqrt(Math.PI)));

  if (l === 1) {
    if (m === 0) return new Complex(Math.sqrt(3 / (4 * Math.PI)) * cosT);
    if (m === 1) return Complex.fromPolar(-Math.sqrt(3 / (8 * Math.PI)) * sinT, phi);
    if (m === -1) return Complex.fromPolar(Math.sqrt(3 / (8 * Math.PI)) * sinT, -phi);
  }

  if (l === 2) {
    if (m === 0) return new Complex(Math.sqrt(5 / (16 * Math.PI)) * (3 * cosT * cosT - 1));
    if (m === 1) return Complex.fromPolar(-Math.sqrt(15 / (8 * Math.PI)) * sinT * cosT, phi);
    if (m === -1) return Complex.fromPolar(Math.sqrt(15 / (8 * Math.PI)) * sinT * cosT, -phi);
    if (m === 2) return Complex.fromPolar(Math.sqrt(15 / (32 * Math.PI)) * sinT * sinT, 2 * phi);
    if (m === -2) return Complex.fromPolar(Math.sqrt(15 / (32 * Math.PI)) * sinT * sinT, -2 * phi);
  }

  throw new Error(`sphericalHarmonic: unsupported (l,m)=(${l},${m}) — this platform implements l=0,1,2 only.`);
}

/**
 * ∫|Y_l^m|² dΩ via numerical integration on a uniform θ,φ grid — the
 * measure is sinθ dθ dφ. Used to check normalization directly rather than
 * trusting the closed-form coefficients blindly.
 */
export function sphericalHarmonicNormSquared(index: SphericalHarmonicIndex, gridSize = 200): number {
  const dTheta = Math.PI / gridSize;
  const dPhi = (2 * Math.PI) / gridSize;
  let total = 0;
  for (let i = 0; i < gridSize; i++) {
    const theta = (i + 0.5) * dTheta;
    for (let j = 0; j < gridSize; j++) {
      const phi = (j + 0.5) * dPhi;
      total += sphericalHarmonic(index, theta, phi).magnitudeSquared() * Math.sin(theta) * dTheta * dPhi;
    }
  }
  return total;
}

/** ∫ Y_{l1}^{m1}* Y_{l2}^{m2} dΩ — used to check orthogonality between distinct (l,m) pairs. */
export function sphericalHarmonicInnerProduct(
  a: SphericalHarmonicIndex,
  b: SphericalHarmonicIndex,
  gridSize = 200
): Complex {
  const dTheta = Math.PI / gridSize;
  const dPhi = (2 * Math.PI) / gridSize;
  let total = Complex.ZERO;
  for (let i = 0; i < gridSize; i++) {
    const theta = (i + 0.5) * dTheta;
    for (let j = 0; j < gridSize; j++) {
      const phi = (j + 0.5) * dPhi;
      const weight = Math.sin(theta) * dTheta * dPhi;
      const term = sphericalHarmonic(a, theta, phi).conjugate().mul(sphericalHarmonic(b, theta, phi)).scale(weight);
      total = total.add(term);
    }
  }
  return total;
}
