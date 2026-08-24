import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { StateVector } from "../state";
import { applyCNOT, applySingleQubitGate, HADAMARD } from "../gates";
import { measurementDistribution, measure, qubitMeasurementProbabilities } from "../measurement";

describe("measurementDistribution", () => {
  it("equals the squared amplitudes for an asymmetric state", () => {
    // |psi> = 0.6|0> + 0.8i|1>  =>  P(0) = 0.36, P(1) = 0.64
    const state = new StateVector([new Complex(0.6, 0), new Complex(0, 0.8)]);
    const dist = measurementDistribution(state);

    expect(dist[0].probability).toBeCloseTo(0.36, 9);
    expect(dist[1].probability).toBeCloseTo(0.64, 9);
    expect(dist[0].label).toBe("0");
    expect(dist[1].label).toBe("1");
  });

  it("always sums to 1 for a normalized state", () => {
    const state = new StateVector([new Complex(Math.SQRT1_2), new Complex(0, Math.SQRT1_2)]);
    const total = measurementDistribution(state).reduce((sum, o) => sum + o.probability, 0);
    expect(total).toBeCloseTo(1, 9);
  });
});

describe("measure", () => {
  it("collapses to |0⟩ when the random draw falls in the P(0) bucket", () => {
    const state = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
    const { outcome, collapsed } = measure(state, 0.1); // < P(0) = 0.5
    expect(outcome.index).toBe(0);
    expect(collapsed.probabilities()).toEqual([1, 0]);
  });

  it("collapses to |1⟩ when the random draw falls in the P(1) bucket", () => {
    const state = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
    const { outcome, collapsed } = measure(state, 0.9); // >= P(0) = 0.5
    expect(outcome.index).toBe(1);
    expect(collapsed.probabilities()).toEqual([0, 1]);
  });

  it("is deterministic for a definite state regardless of the random draw", () => {
    const state = StateVector.zero(1); // |0>
    for (const random of [0, 0.3, 0.6, 0.999]) {
      const { outcome } = measure(state, random);
      expect(outcome.index).toBe(0);
    }
  });

  it("falls back to the last nonzero-probability outcome when cumulative probability never exceeds the random draw", () => {
    // The cumulative-probability loop in `measure` is exactly the kind of
    // code that a normalized state's floating-point summation can leave a
    // hair short of 1 (e.g. 0.9999999999999999 instead of 1) — a random draw
    // in that gap must not fall through to `undefined`. Model that directly
    // with a state whose probabilities sum to just under 1 (standing in for
    // that floating-point drift) and a random draw past the true sum: the
    // fallback must still resolve to the last outcome with nonzero probability.
    const state = new StateVector([new Complex(Math.sqrt(0.4)), new Complex(Math.sqrt(0.5999))]);
    expect(state.norm()).toBeLessThan(1); // sum of probabilities is 0.9999, not 1
    const { outcome, collapsed } = measure(state, 0.99995);
    expect(outcome.index).toBe(1);
    expect(collapsed.probabilities()).toEqual([0, 1]);
  });

  it("correctly selects a basis state with a very small but nonzero probability", () => {
    // amplitude 1e-6 -> probability 1e-12: a near-zero but physically real outcome.
    const tiny = 1e-6;
    const big = Math.sqrt(1 - tiny * tiny);
    const state = new StateVector([new Complex(big), new Complex(tiny)]);
    // A random draw landing just past P(0) must select the tiny-probability outcome.
    const { outcome } = measure(state, 1 - tiny * tiny / 2);
    expect(outcome.index).toBe(1);
  });
});

describe("qubitMeasurementProbabilities", () => {
  it("gives 50/50 marginals for each qubit of a Bell state, even though the joint state is entangled", () => {
    const bell = applyCNOT(applySingleQubitGate(StateVector.zero(2), HADAMARD, 0), 0, 1);
    const [p0q0, p1q0] = qubitMeasurementProbabilities(bell, 0);
    const [p0q1, p1q1] = qubitMeasurementProbabilities(bell, 1);
    expect(p0q0).toBeCloseTo(0.5, 9);
    expect(p1q0).toBeCloseTo(0.5, 9);
    expect(p0q1).toBeCloseTo(0.5, 9);
    expect(p1q1).toBeCloseTo(0.5, 9);
  });

  it("gives a definite (0 or 1) marginal for each qubit of an unentangled product basis state", () => {
    const state = StateVector.basis(2, 0b10); // |10>
    expect(qubitMeasurementProbabilities(state, 0)).toEqual([0, 1]);
    expect(qubitMeasurementProbabilities(state, 1)).toEqual([1, 0]);
  });

  it("always sums to 1", () => {
    const state = new StateVector([new Complex(0.6), Complex.ZERO, new Complex(0, 0.8), Complex.ZERO]);
    for (const qubit of [0, 1]) {
      const [p0, p1] = qubitMeasurementProbabilities(state, qubit);
      expect(p0 + p1).toBeCloseTo(1, 9);
    }
  });

  it("throws for an out-of-range qubit index", () => {
    const state = StateVector.zero(2);
    expect(() => qubitMeasurementProbabilities(state, 2)).toThrow(/out of range/);
    expect(() => qubitMeasurementProbabilities(state, -1)).toThrow(/out of range/);
  });
});
