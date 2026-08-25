import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import {
  classicalSumProbability,
  crossBasisProbability,
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

describe("crossBasisProbability", () => {
  it("reduces to (1+cos φ)/2 for the equal-magnitude state a=1/√2, b=e^{iφ}/√2", () => {
    for (const phi of [0, Math.PI / 3, Math.PI / 2, 2 * Math.PI / 3, Math.PI, 1.234]) {
      const a = new Complex(Math.SQRT1_2, 0);
      const b = Complex.fromPolar(Math.SQRT1_2, phi);
      expect(crossBasisProbability(a, b)).toBeCloseTo((1 + Math.cos(phi)) / 2, 9);
    }
  });

  it("is exactly 1 at φ=0 (fully constructive) and 0 at φ=π (fully destructive)", () => {
    const a = new Complex(Math.SQRT1_2, 0);
    expect(crossBasisProbability(a, new Complex(Math.SQRT1_2, 0))).toBeCloseTo(1, 9);
    expect(crossBasisProbability(a, new Complex(-Math.SQRT1_2, 0))).toBeCloseTo(0, 9);
  });

  it("is exactly half of interferenceProbability", () => {
    const a = new Complex(0.6, 0.2);
    const b = new Complex(-0.3, 0.4);
    expect(crossBasisProbability(a, b)).toBeCloseTo(interferenceProbability(a, b) / 2, 9);
  });

  it("stays within [0, 1] for any normalized (|a|²+|b|²=1) pair, unlike the raw interferenceProbability it's derived from", () => {
    for (const alphaMagnitude of [0, 0.2, 0.5, Math.SQRT1_2, 0.9, 1]) {
      for (const phase of [0, 0.7, Math.PI / 2, 2, Math.PI, 4, 2 * Math.PI - 0.1]) {
        const [a, b] = normalizedTwoLevelAmplitudes(alphaMagnitude, 0, phase);
        const p = crossBasisProbability(a, b);
        expect(p).toBeGreaterThanOrEqual(-1e-9);
        expect(p).toBeLessThanOrEqual(1 + 1e-9);
      }
    }
  });
});
