import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { StateVector } from "../state";
import { quantumFourierTransform, inverseQuantumFourierTransform, phaseEstimation } from "../qft";
import { phaseGate } from "../gates";

function directDFT(j: number, n: number): Complex[] {
  const N = 2 ** n;
  return Array.from({ length: N }, (_, k) => Complex.fromPolar(1 / Math.sqrt(N), (2 * Math.PI * j * k) / N));
}

function maxDiff(a: readonly Complex[], b: readonly Complex[]): number {
  return Math.max(...a.map((v, i) => v.sub(b[i]).magnitude()));
}

describe("quantumFourierTransform", () => {
  it("matches the direct DFT formula for every basis state, n=2..4", () => {
    for (const n of [2, 3, 4]) {
      for (let j = 0; j < 2 ** n; j++) {
        const result = quantumFourierTransform(StateVector.basis(n, j));
        expect(maxDiff(result.amplitudes, directDFT(j, n))).toBeLessThan(1e-9);
      }
    }
  });

  it("is inverted exactly by inverseQuantumFourierTransform", () => {
    const state = new StateVector([new Complex(0.5), new Complex(0.5, 0.2), new Complex(0.3, -0.1), new Complex(0.1)]).normalize();
    const roundTrip = inverseQuantumFourierTransform(quantumFourierTransform(state));
    expect(maxDiff(roundTrip.amplitudes, state.amplitudes)).toBeLessThan(1e-9);
  });

  it("preserves normalization", () => {
    const state = quantumFourierTransform(StateVector.basis(3, 5));
    const total = state.amplitudes.reduce((sum, a) => sum + a.magnitudeSquared(), 0);
    expect(total).toBeCloseTo(1, 9);
  });
});

describe("phaseEstimation", () => {
  it("recovers an exactly-representable eigenphase with probability 1", () => {
    const theta = (2 * Math.PI * 3) / 8; // phase 3/8, exact with 3 precision qubits
    const u = phaseGate(theta);
    const result = phaseEstimation(u, [Complex.ZERO, Complex.ONE], 3);
    // precision register = 011 (3), eigen qubit = 1 -> full index 0b0111 = 7
    expect(result.probabilities()[0b0111]).toBeCloseTo(1, 6);
  });

  it("recovers phase 0 as the all-zero precision register", () => {
    const u = phaseGate(0);
    const result = phaseEstimation(u, [Complex.ZERO, Complex.ONE], 3);
    expect(result.probabilities()[0b0001]).toBeCloseTo(1, 6); // precision=000, eigen qubit=1
  });

  it("throws for a non-2x2 unitary", () => {
    const bad = { rows: 4, cols: 4 } as never;
    expect(() => phaseEstimation(bad, [Complex.ZERO, Complex.ONE], 3)).toThrow(/2x2/);
  });
});
