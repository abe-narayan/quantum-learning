import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import {
  classicalSumProbability,
  interferenceProbability,
  normalizedTwoLevelAmplitudes,
} from "../amplitude";

describe("normalizedTwoLevelAmplitudes", () => {
  it("always produces a pair with |α|² + |β|² = 1", () => {
    for (const alphaMagnitude of [0, 0.3, 0.5, 0.7071, 1]) {
      const [alpha, beta] = normalizedTwoLevelAmplitudes(alphaMagnitude, 0.4, 1.7);
      expect(alpha.magnitudeSquared() + beta.magnitudeSquared()).toBeCloseTo(1, 9);
    }
  });

  it("alphaMagnitude=1 gives beta magnitude 0", () => {
    const [alpha, beta] = normalizedTwoLevelAmplitudes(1, 0, 0);
    expect(alpha.magnitude()).toBeCloseTo(1, 9);
    expect(beta.magnitude()).toBeCloseTo(0, 9);
  });

  it("alphaMagnitude=0.6 gives betaMagnitude=0.8 (a 3-4-5 triangle)", () => {
    const [alpha, beta] = normalizedTwoLevelAmplitudes(0.6, 0, 0);
    expect(alpha.magnitude()).toBeCloseTo(0.6, 9);
    expect(beta.magnitude()).toBeCloseTo(0.8, 9);
  });

  it("respects the requested phases", () => {
    const [alpha, beta] = normalizedTwoLevelAmplitudes(0.5, Math.PI / 2, Math.PI);
    expect(alpha.phase()).toBeCloseTo(Math.PI / 2, 9);
    expect(beta.phase()).toBeCloseTo(Math.PI, 9);
  });

  it("rejects an out-of-range alphaMagnitude", () => {
    expect(() => normalizedTwoLevelAmplitudes(1.5, 0, 0)).toThrow();
    expect(() => normalizedTwoLevelAmplitudes(-0.1, 0, 0)).toThrow();
  });
});

describe("interferenceProbability vs classicalSumProbability", () => {
  it("agree when the two amplitudes are orthogonal in phase in a way that contributes no cross term — equal magnitude, opposite sign (destructive)", () => {
    const a = new Complex(0.5, 0);
    const b = new Complex(-0.5, 0);
    expect(interferenceProbability(a, b)).toBeCloseTo(0, 9); // fully destructive
    expect(classicalSumProbability(a, b)).toBeCloseTo(0.5, 9); // 0.25 + 0.25
  });

  it("constructive interference exceeds the classical sum", () => {
    const a = new Complex(0.5, 0);
    const b = new Complex(0.5, 0);
    expect(interferenceProbability(a, b)).toBeCloseTo(1, 9); // (0.5+0.5)^2 = 1
    expect(classicalSumProbability(a, b)).toBeCloseTo(0.5, 9); // 0.25 + 0.25
    expect(interferenceProbability(a, b)).toBeGreaterThan(classicalSumProbability(a, b));
  });

  it("a 90-degree relative phase gives interference equal to the classical sum (no net constructive or destructive effect)", () => {
    const a = new Complex(0.5, 0);
    const b = new Complex(0, 0.5);
    // |a+b|^2 = |0.5 + 0.5i|^2 = 0.25+0.25 = 0.5, same as classical 0.25+0.25.
    expect(interferenceProbability(a, b)).toBeCloseTo(classicalSumProbability(a, b), 9);
  });

  it("interference probability is never negative", () => {
    for (const phase of [0, 0.5, 1, 2, 3, Math.PI, 2 * Math.PI]) {
      const a = new Complex(0.6, 0);
      const b = Complex.fromPolar(0.6, phase);
      expect(interferenceProbability(a, b)).toBeGreaterThanOrEqual(-1e-9);
    }
  });
});
