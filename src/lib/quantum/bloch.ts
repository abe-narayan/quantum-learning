import { Complex } from "./complex";
import { StateVector } from "./state";
import type { Matrix } from "./matrix";
import { PAULI_X, PAULI_Y, PAULI_Z } from "./gates";
import { densityMatrixExpectationValue } from "./densityMatrix";

export type BlochVector = { x: number; y: number; z: number };
export type BlochAngles = { theta: number; phi: number };

function assertSingleQubit(state: StateVector) {
  if (state.numQubits !== 1) {
    throw new Error(`Bloch-sphere conversions require a single-qubit state (got ${state.numQubits} qubits).`);
  }
}

/**
 * The Bloch vector (x, y, z) of a single-qubit state, computed from Pauli
 * expectation values: x = ⟨X⟩, y = ⟨Y⟩, z = ⟨Z⟩. Global phase cancels out of
 * every expectation value, so this is exactly the physically observable
 * position on the sphere.
 */
export function stateToBlochVector(state: StateVector): BlochVector {
  assertSingleQubit(state);
  const [alpha, beta] = state.amplitudes;
  const cross = alpha.conjugate().mul(beta); // ⟨0|ψ⟩* ⟨ψ|1⟩-style cross term

  return {
    x: 2 * cross.re,
    y: 2 * cross.im,
    z: alpha.magnitudeSquared() - beta.magnitudeSquared(),
  };
}

/** Polar angle θ ∈ [0, π] and azimuthal angle φ ∈ [0, 2π) for a state. */
export function stateToBlochAngles(state: StateVector): BlochAngles {
  const { x, y, z } = stateToBlochVector(state);
  const theta = Math.acos(Math.min(1, Math.max(-1, z)));
  let phi = Math.atan2(y, x);
  if (phi < 0) phi += 2 * Math.PI;
  return { theta, phi };
}

/**
 * The canonical state for a given point on the Bloch sphere:
 * |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ} sin(θ/2)|1⟩. This is the standard convention
 * (α real and non-negative) — it's a specific choice of global phase, not a
 * physical constraint, but it's the one every textbook uses.
 */
export function blochStateFromAngles({ theta, phi }: BlochAngles): StateVector {
  const alpha = new Complex(Math.cos(theta / 2), 0);
  const beta = Complex.fromPolar(Math.sin(theta / 2), phi);
  return new StateVector([alpha, beta]);
}

function assertSingleQubitDensityMatrix(rho: Matrix) {
  if (rho.rows !== 2 || rho.cols !== 2) {
    throw new Error(`densityMatrixToBlochVector requires a single-qubit (2x2) density matrix (got ${rho.rows}x${rho.cols}).`);
  }
}

/**
 * The Bloch vector (x, y, z) of a single-qubit density matrix, computed the
 * same way as `stateToBlochVector` but via the generalized Born rule
 * ⟨A⟩=Tr(ρA) instead of ⟨ψ|A|ψ⟩ — so it works for a genuinely mixed ρ, not
 * just a pure state's outer product. Since Tr(·) is linear, this is exactly
 * the probability-weighted average of the component states' own Bloch
 * vectors for a mixture, and reduces to |r|=1 (the sphere's surface) only
 * for pure states — |r|<1 places the point strictly inside the sphere,
 * which is what makes the Bloch sphere a faithful picture of mixedness.
 */
export function densityMatrixToBlochVector(rho: Matrix): BlochVector {
  assertSingleQubitDensityMatrix(rho);
  return {
    x: densityMatrixExpectationValue(rho, PAULI_X).re,
    y: densityMatrixExpectationValue(rho, PAULI_Y).re,
    z: densityMatrixExpectationValue(rho, PAULI_Z).re,
  };
}
