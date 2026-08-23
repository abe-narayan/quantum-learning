import { describe, expect, it } from "vitest";
import { StateVector } from "../state";
import { quantumFourierTransform } from "../qft";
import { classicalOrder, periodFindingState, quantumFourierTransformOnQubits, periodFindingMeasurementDistribution } from "../shor";

describe("classicalOrder", () => {
  it("finds order 4 for a=7, N=15 (the textbook factoring-15 example)", () => {
    expect(classicalOrder(7, 15)).toBe(4);
  });

  it("finds order 1 for a=1 (trivial case)", () => {
    expect(classicalOrder(1, 5)).toBe(1);
  });

  it("finds order 2 for a=4, N=15", () => {
    expect(classicalOrder(4, 15)).toBe(2);
  });
});

describe("periodFindingState", () => {
  it("puts equal amplitude on every x, at the correct y=a^x mod N", () => {
    const { state, yBits } = periodFindingState(7, 15, 4);
    expect(yBits).toBe(4); // ceil(log2(15))
    const yDim = 2 ** yBits;
    // x=0 -> y=1, x=1 -> y=7, x=2 -> y=4, x=3 -> y=13, x=4 -> y=1 (period 4)
    const expectedY = [1, 7, 4, 13, 1, 7, 4, 13, 1, 7, 4, 13, 1, 7, 4, 13];
    for (let x = 0; x < 16; x++) {
      const idx = x * yDim + expectedY[x];
      expect(state.amplitudes[idx].re).toBeCloseTo(0.25, 9);
    }
  });

  it("is normalized", () => {
    const { state } = periodFindingState(7, 15, 4);
    const total = state.amplitudes.reduce((sum, a) => sum + a.magnitudeSquared(), 0);
    expect(total).toBeCloseTo(1, 9);
  });
});

describe("quantumFourierTransformOnQubits", () => {
  it("matches the whole-register QFT when given every qubit in order", () => {
    const state = StateVector.basis(3, 5);
    const viaSubset = quantumFourierTransformOnQubits(state, [0, 1, 2]);
    const viaFull = quantumFourierTransform(state);
    for (let i = 0; i < 8; i++) {
      expect(viaSubset.amplitudes[i].sub(viaFull.amplitudes[i]).magnitude()).toBeLessThan(1e-9);
    }
  });
});

describe("periodFindingMeasurementDistribution", () => {
  it("peaks at exact multiples of 2^xBits/r for a=7, N=15, r=4", () => {
    const xBits = 6;
    const dist = periodFindingMeasurementDistribution(7, 15, xBits);
    const expectedPeaks = [0, 16, 32, 48];
    for (const peak of expectedPeaks) {
      expect(dist[peak]).toBeCloseTo(0.25, 6);
    }
    const total = dist.reduce((s, p) => s + p, 0);
    expect(total).toBeCloseTo(1, 6);
    // every non-peak index should carry ~0 probability
    for (let x = 0; x < dist.length; x++) {
      if (!expectedPeaks.includes(x)) expect(dist[x]).toBeLessThan(1e-6);
    }
  });

  it("recovers factors of 15 via gcd from the period", () => {
    const r = 4; // classicalOrder(7, 15)
    function gcd(x: number, y: number): number {
      return y === 0 ? x : gcd(y, x % y);
    }
    const half = 2 ** (r / 2);
    const factor1 = gcd((half - 1 + 15) % 15, 15);
    const factor2 = gcd((half + 1) % 15, 15);
    expect([factor1, factor2].sort()).toEqual([3, 5]);
  });
});
