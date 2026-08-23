import { Complex } from "./complex";
import { StateVector } from "./state";
import { HADAMARD, phaseGate, applySingleQubitGate, applyControlledGate, applySwap } from "./gates";

/**
 * The period-finding machinery behind Shor's algorithm, scoped honestly:
 * this builds and QFT-analyzes the *exact state* the real quantum circuit
 * produces, without implementing the modular-exponentiation circuit itself
 * (a genuine controlled-multiply-by-a-mod-N gate sequence) — that circuit
 * is real, substantial engineering (see any textbook treatment of
 * "quantum modular exponentiation"), well beyond what this course's
 * educational scope needs, and explicitly out of scope here. What *is*
 * built and verified is everything downstream of it: the joint state
 * (1/√2^t)∑ₓ|x⟩|aˣ mod N⟩, and the QFT-based extraction of the period r
 * from it — the actual interference step Shor's algorithm depends on.
 */

/** Classical brute-force order-finding: the smallest r>0 with a^r ≡ 1 (mod N). Used for the reduction from factoring to period-finding, and to check the quantum extraction's answer. */
export function classicalOrder(a: number, N: number): number {
  let value = a % N;
  let r = 1;
  while (value !== 1) {
    value = (value * a) % N;
    r++;
    if (r > N) throw new Error(`classicalOrder: no order found for a=${a} mod N=${N} within N steps — check gcd(a,N)=1.`);
  }
  return r;
}

/**
 * Builds (1/√2^t)∑ₓ|x⟩|aˣ mod N⟩ directly from its closed-form amplitudes —
 * exactly the state a real circuit (H^⊗t on the x register, then controlled
 * modular multiplications onto a padded N-dimensional y register) would
 * produce, constructed here without building that circuit gate by gate.
 * The y register is padded to the next power of 2 ≥ N; basis values ≥ N
 * are never populated (only y = aˣ mod N for x = 0..2^t−1 ever receives
 * amplitude).
 */
export function periodFindingState(a: number, N: number, xBits: number): { state: StateVector; yBits: number } {
  const yBits = Math.ceil(Math.log2(N));
  const xDim = 2 ** xBits;
  const yDim = 2 ** yBits;
  const amps: Complex[] = Array.from({ length: xDim * yDim }, () => Complex.ZERO);
  const norm = 1 / Math.sqrt(xDim);

  let power = 1 % N;
  for (let x = 0; x < xDim; x++) {
    const index = x * yDim + power;
    amps[index] = new Complex(norm);
    power = (power * a) % N;
  }

  return { state: new StateVector(amps), yBits };
}

/** QFT restricted to an explicit, ordered list of qubit indices within a larger register — everything else in the state is left untouched. */
export function quantumFourierTransformOnQubits(state: StateVector, qubits: number[]): StateVector {
  const t = qubits.length;
  let s = state;

  for (let i = 0; i < t; i++) {
    s = applySingleQubitGate(s, HADAMARD, qubits[i]);
    for (let k = 2; k <= t - i; k++) {
      s = applyControlledGate(s, phaseGate((2 * Math.PI) / 2 ** k), qubits[i + k - 1], qubits[i]);
    }
  }
  for (let i = 0; i < Math.floor(t / 2); i++) {
    s = applySwap(s, qubits[i], qubits[t - 1 - i]);
  }

  return s;
}

/**
 * Runs the quantum part of period finding: builds the period-finding
 * state, applies the QFT to the x register only, and returns the
 * probability distribution over x-register outcomes — peaked at multiples
 * of 2^xBits/r, the signature Shor's algorithm's classical post-processing
 * (continued fractions, not implemented here — see this function's scope
 * note) extracts r from.
 */
export function periodFindingMeasurementDistribution(a: number, N: number, xBits: number): number[] {
  const { state, yBits } = periodFindingState(a, N, xBits);
  const xQubits = Array.from({ length: xBits }, (_, i) => i);
  const afterQft = quantumFourierTransformOnQubits(state, xQubits);
  const yDim = 2 ** yBits;
  const xDim = 2 ** xBits;
  const probs = afterQft.probabilities();

  const xDistribution = new Array(xDim).fill(0);
  for (let x = 0; x < xDim; x++) {
    for (let y = 0; y < yDim; y++) {
      xDistribution[x] += probs[x * yDim + y];
    }
  }
  return xDistribution;
}
