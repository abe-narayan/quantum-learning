import { Complex } from "./complex";
import { StateVector } from "./state";

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
