import { Matrix } from "./matrix";
import { StateVector } from "./state";
import { rotationY, rotationZ, applySingleQubitGate } from "./gates";
import { expectationValue } from "./observables";
import { eigenvaluesHermitian2x2 } from "./densityMatrix";

/**
 * A single-qubit variational quantum eigensolver — deliberately the
 * smallest genuinely useful case, reusing existing gate and expectation
 * machinery rather than building a general multi-qubit ansatz/optimizer
 * framework. The single-qubit ansatz Ry(θ)Rz(φ)|0⟩ reaches every point on
 * the Bloch sphere, so it can represent the exact ground state of *any*
 * single-qubit Hamiltonian — this is not a toy that merely resembles VQE,
 * it genuinely converges to the true ground state energy, checked directly
 * against the exact eigenvalue from `eigenvaluesHermitian2x2`.
 */

export type AnsatzParams = { theta: number; phi: number };

/** The ansatz circuit: Rz(φ)Ry(θ)|0⟩, reaching any point on the Bloch sphere. */
export function ansatzState(params: AnsatzParams): StateVector {
  let s = StateVector.zero(1);
  s = applySingleQubitGate(s, rotationY(params.theta), 0);
  s = applySingleQubitGate(s, rotationZ(params.phi), 0);
  return s;
}

/** The VQE cost function: ⟨ψ(θ,φ)|H|ψ(θ,φ)⟩, reusing `expectationValue` directly. */
export function costFunction(hamiltonian: Matrix, params: AnsatzParams): number {
  return expectationValue(ansatzState(params), hamiltonian).re;
}

/** The exact ground-state energy, via this platform's closed-form 2x2 eigensolver — the number VQE is trying to find. */
export function exactGroundStateEnergy(hamiltonian: Matrix): number {
  const [l1, l2] = eigenvaluesHermitian2x2(hamiltonian);
  return Math.min(l1, l2);
}

/**
 * A real (if simple) classical optimizer: coordinate-wise pattern search —
 * try a step in each parameter direction, keep whichever improves the cost
 * most, shrink the step when no direction improves. Not a general-purpose
 * optimizer (no momentum, no line search) — the smallest thing that
 * genuinely converges for this smooth, low-dimensional cost landscape.
 */
export function runVqe(
  hamiltonian: Matrix,
  iterations = 60,
  start: AnsatzParams = { theta: Math.PI / 2, phi: 0 }
): { params: AnsatzParams; energy: number; history: number[] } {
  let params = start;
  let energy = costFunction(hamiltonian, params);
  const history = [energy];
  let step = 0.5;

  for (let i = 0; i < iterations && step > 1e-6; i++) {
    const candidates: AnsatzParams[] = [
      { theta: params.theta + step, phi: params.phi },
      { theta: params.theta - step, phi: params.phi },
      { theta: params.theta, phi: params.phi + step },
      { theta: params.theta, phi: params.phi - step },
    ];
    let best = params;
    let bestEnergy = energy;
    for (const candidate of candidates) {
      const e = costFunction(hamiltonian, candidate);
      if (e < bestEnergy) {
        best = candidate;
        bestEnergy = e;
      }
    }
    if (bestEnergy < energy - 1e-12) {
      params = best;
      energy = bestEnergy;
    } else {
      step *= 0.5;
    }
    history.push(energy);
  }

  return { params, energy, history };
}
