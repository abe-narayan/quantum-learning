import { StateVector } from "./state";

export type MeasurementOutcome = {
  index: number;
  label: string;
  probability: number;
};

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
