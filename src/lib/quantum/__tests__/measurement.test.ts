import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { StateVector } from "../state";
import { measurementDistribution, measure } from "../measurement";

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
});
