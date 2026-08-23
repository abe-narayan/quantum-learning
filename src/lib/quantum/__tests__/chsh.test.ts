import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { StateVector } from "../state";
import { PAULI_X, PAULI_Z } from "../gates";
import { pureStateDensityMatrix, convexCombination, maximallyMixedState } from "../densityMatrix";
import {
  spinObservableInXZPlane,
  correlationExpectation,
  chshValue,
  CHSH_CLASSICAL_BOUND,
  CHSH_QUANTUM_BOUND,
} from "../chsh";

const sqrt1_2 = Math.SQRT1_2;

function bellPhiPlus(): StateVector {
  return new StateVector([new Complex(sqrt1_2), Complex.ZERO, Complex.ZERO, new Complex(sqrt1_2)]);
}

// The standard optimal CHSH measurement configuration for |Phi+>, verified
// numerically (including a brute-force search over B, B') to reach the
// Tsirelson bound exactly: A=Z, A'=X, B and B' at +-45 degrees from Z.
const A = spinObservableInXZPlane(0);
const A_PRIME = spinObservableInXZPlane(Math.PI / 2);
const B = spinObservableInXZPlane(Math.PI / 4);
const B_PRIME = spinObservableInXZPlane(-Math.PI / 4);

describe("spinObservableInXZPlane", () => {
  it("theta=0 recovers Pauli Z", () => {
    expect(spinObservableInXZPlane(0).equals(PAULI_Z, 1e-9)).toBe(true);
  });

  it("theta=pi/2 recovers Pauli X", () => {
    expect(spinObservableInXZPlane(Math.PI / 2).equals(PAULI_X, 1e-9)).toBe(true);
  });

  it("is Hermitian with eigenvalues +-1 for an arbitrary angle", () => {
    const observable = spinObservableInXZPlane(0.73);
    expect(observable.isHermitian()).toBe(true);
    // Tr = 0 and det = -1 for a traceless +-1-eigenvalue 2x2 Hermitian operator.
    expect(observable.trace().re).toBeCloseTo(0, 9);
    const det = observable
      .get(0, 0)
      .mul(observable.get(1, 1))
      .sub(observable.get(0, 1).mul(observable.get(1, 0)));
    expect(det.re).toBeCloseTo(-1, 9);
  });
});

describe("correlationExpectation", () => {
  it("E(Z,Z) = +1 for the Phi+ Bell state (perfectly correlated in Z)", () => {
    const rho = pureStateDensityMatrix(bellPhiPlus());
    expect(correlationExpectation(rho, PAULI_Z, PAULI_Z)).toBeCloseTo(1, 9);
  });

  it("E(Z,Z) = 0 for the maximally mixed 2-qubit state (no correlation)", () => {
    const rho = maximallyMixedState(4);
    expect(correlationExpectation(rho, PAULI_Z, PAULI_Z)).toBeCloseTo(0, 9);
  });

  it("E(A,B) = cos(theta_A - theta_B) for Phi+ and in-plane spin observables (standard QM prediction)", () => {
    const rho = pureStateDensityMatrix(bellPhiPlus());
    for (const [thetaA, thetaB] of [
      [0, Math.PI / 4],
      [Math.PI / 2, -Math.PI / 4],
      [0.3, 1.1],
    ]) {
      const observableA = spinObservableInXZPlane(thetaA);
      const observableB = spinObservableInXZPlane(thetaB);
      const expected = Math.cos(thetaA - thetaB);
      expect(correlationExpectation(rho, observableA, observableB)).toBeCloseTo(expected, 9);
    }
  });
});

describe("chshValue", () => {
  it("reaches exactly the Tsirelson bound 2*sqrt(2) for Phi+ at the standard optimal angles", () => {
    const rho = pureStateDensityMatrix(bellPhiPlus());
    const s = chshValue(rho, { a: A, aPrime: A_PRIME, b: B, bPrime: B_PRIME });
    expect(s).toBeCloseTo(CHSH_QUANTUM_BOUND, 9);
    expect(Math.abs(s)).toBeGreaterThan(CHSH_CLASSICAL_BOUND);
  });

  it("stays within the classical bound for an unentangled product state, at the same angles", () => {
    const product = pureStateDensityMatrix(new StateVector([Complex.ONE, Complex.ZERO, Complex.ZERO, Complex.ZERO]));
    const s = chshValue(product, { a: A, aPrime: A_PRIME, b: B, bPrime: B_PRIME });
    expect(Math.abs(s)).toBeLessThanOrEqual(CHSH_CLASSICAL_BOUND + 1e-9);
  });

  it("stays within the classical bound for the maximally mixed 2-qubit state", () => {
    const rho = maximallyMixedState(4);
    const s = chshValue(rho, { a: A, aPrime: A_PRIME, b: B, bPrime: B_PRIME });
    expect(Math.abs(s)).toBeLessThanOrEqual(CHSH_CLASSICAL_BOUND + 1e-9);
  });

  it("degrades monotonically as Werner-state noise is mixed into a Bell state, dropping below the classical bound by noise=0.5", () => {
    const rho = pureStateDensityMatrix(bellPhiPlus());
    const noiseLevels = [0, 0.1, 0.2, 0.3, 0.5];
    const values = noiseLevels.map((noise) => {
      const noisy = convexCombination([
        { probability: 1 - noise, density: rho },
        { probability: noise, density: maximallyMixedState(4) },
      ]);
      return Math.abs(chshValue(noisy, { a: A, aPrime: A_PRIME, b: B, bPrime: B_PRIME }));
    });
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeLessThan(values[i - 1]);
    }
    expect(values[0]).toBeCloseTo(CHSH_QUANTUM_BOUND, 9);
    expect(values[values.length - 1]).toBeLessThan(CHSH_CLASSICAL_BOUND);
  });

  it("never exceeds the Tsirelson bound for any angle choice on any physical two-qubit state (spot check)", () => {
    const rho = pureStateDensityMatrix(bellPhiPlus());
    const angleSets = [
      [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4],
      [0.1, 0.9, 0.5, 1.3],
      [-0.4, 2.1, 0.7, -1.0],
    ];
    for (const [ta, taP, tb, tbP] of angleSets) {
      const s = chshValue(rho, {
        a: spinObservableInXZPlane(ta),
        aPrime: spinObservableInXZPlane(taP),
        b: spinObservableInXZPlane(tb),
        bPrime: spinObservableInXZPlane(tbP),
      });
      expect(Math.abs(s)).toBeLessThanOrEqual(CHSH_QUANTUM_BOUND + 1e-6);
    }
  });
});

describe("CHSH bound constants", () => {
  it("CHSH_CLASSICAL_BOUND is 2", () => {
    expect(CHSH_CLASSICAL_BOUND).toBe(2);
  });

  it("CHSH_QUANTUM_BOUND is 2*sqrt(2)", () => {
    expect(CHSH_QUANTUM_BOUND).toBeCloseTo(2 * Math.sqrt(2), 12);
  });
});
