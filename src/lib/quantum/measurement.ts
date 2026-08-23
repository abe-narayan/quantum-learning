import { Complex } from "./complex";
import { StateVector } from "./state";

export type MeasurementOutcome = {
  index: number;
  label: string;
  probability: number;
};

function assertValidQubit(qubit: number, numQubits: number) {
  if (!Number.isInteger(qubit) || qubit < 0 || qubit >= numQubits) {
    throw new Error(`Qubit index ${qubit} is out of range for a ${numQubits}-qubit state.`);
  }
}

/** The full computational-basis measurement distribution for a state. */
export function measurementDistribution(state: StateVector): MeasurementOutcome[] {
  return state.probabilities().map((probability, index) => ({
    index,
    label: state.basisLabel(index),
    probability,
  }));
}

/**
 * Samples one measurement outcome and returns the collapsed post-measurement
 * state. Pass `random` (a value in [0, 1)) for deterministic/testable
 * sampling; it defaults to `Math.random()`.
 */
export function measure(
  state: StateVector,
  random: number = Math.random()
): { outcome: MeasurementOutcome; collapsed: StateVector } {
  const distribution = measurementDistribution(state);

  let cumulative = 0;
  for (const outcome of distribution) {
    cumulative += outcome.probability;
    if (random < cumulative) {
      return { outcome, collapsed: StateVector.basis(state.numQubits, outcome.index) };
    }
  }

  const last = distribution[distribution.length - 1];
  return { outcome: last, collapsed: StateVector.basis(state.numQubits, last.index) };
}

/**
 * P(0) and P(1) for measuring a single qubit within a (possibly entangled)
 * multi-qubit state, without touching the other qubits. Sums |amplitude|^2
 * over every basis state consistent with that qubit being 0 or 1.
 */
export function qubitMeasurementProbabilities(state: StateVector, qubit: number): [number, number] {
  const n = state.numQubits;
  assertValidQubit(qubit, n);
  const mask = 1 << (n - 1 - qubit);

  let p0 = 0;
  let p1 = 0;
  state.amplitudes.forEach((amplitude, i) => {
    const p = amplitude.magnitudeSquared();
    if ((i & mask) === 0) p0 += p;
    else p1 += p;
  });

  return [p0, p1];
}

export type QubitMeasurementResult = {
  qubit: number;
  outcome: 0 | 1;
  probability: number;
  collapsed: StateVector;
};

/**
 * Measures a single qubit within a multi-qubit state, projectively — the
 * other qubits are left alone (still possibly in superposition, or still
 * entangled with each other), but every amplitude inconsistent with the
 * observed outcome is zeroed out and the survivors are renormalized. This
 * is what makes measuring one half of an entangled pair collapse the
 * other half too: for a Bell state, only one branch of the sum survives.
 *
 * Pass `random` (a value in [0, 1)) for deterministic/testable sampling;
 * it defaults to `Math.random()`.
 */
export function measureQubit(
  state: StateVector,
  qubit: number,
  random: number = Math.random()
): QubitMeasurementResult {
  const n = state.numQubits;
  assertValidQubit(qubit, n);
  const mask = 1 << (n - 1 - qubit);

  const [p0, p1] = qubitMeasurementProbabilities(state, qubit);
  const outcome: 0 | 1 = random < p0 ? 0 : 1;
  const probability = outcome === 0 ? p0 : p1;
  if (probability === 0) {
    throw new Error(`Measured an outcome (${outcome}) with zero probability — this should never happen.`);
  }

  const norm = Math.sqrt(probability);
  const survives = (i: number) => ((i & mask) !== 0) === (outcome === 1);
  const collapsedAmplitudes = state.amplitudes.map((amplitude, i) =>
    survives(i) ? amplitude.scale(1 / norm) : Complex.ZERO
  );

  return { qubit, outcome, probability, collapsed: new StateVector(collapsedAmplitudes) };
}
