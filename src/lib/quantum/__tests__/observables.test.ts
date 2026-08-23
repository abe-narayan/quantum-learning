import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { Matrix } from "../matrix";
import { StateVector } from "../state";
import { PAULI_X, PAULI_Y, PAULI_Z } from "../gates";
import { commutator, commutatorExpectation, expectationValue, uncertainty, variance } from "../observables";

const c = (re: number, im = 0) => new Complex(re, im);

describe("expectationValue", () => {
  it("gives ±1 for Pauli-Z on its own eigenstates", () => {
    const zero = new StateVector([c(1), c(0)]);
    const one = new StateVector([c(0), c(1)]);
    expect(expectationValue(zero, PAULI_Z).re).toBeCloseTo(1, 9);
    expect(expectationValue(one, PAULI_Z).re).toBeCloseTo(-1, 9);
  });

  it("gives 0.2 for the state (sqrt(0.6), sqrt(0.4)) against Pauli-Z", () => {
    const psi = new StateVector([c(Math.sqrt(0.6)), c(Math.sqrt(0.4))]);
    expect(expectationValue(psi, PAULI_Z).re).toBeCloseTo(0.2, 9);
  });

  it("gives 0 for |+⟩ against Pauli-Z (equal superposition, no bias)", () => {
    const plus = new StateVector([c(Math.SQRT1_2), c(Math.SQRT1_2)]);
    expect(expectationValue(plus, PAULI_Z).re).toBeCloseTo(0, 9);
  });

  it("is always real for a Hermitian operator, even with complex amplitudes", () => {
    const psi = new StateVector([c(0.6), c(0, 0.8)]);
    expect(expectationValue(psi, PAULI_Y).im).toBeCloseTo(0, 9);
  });
});

describe("variance and uncertainty", () => {
  it("is zero for an eigenstate of the observable (a definite value has no spread)", () => {
    const zero = new StateVector([c(1), c(0)]);
    expect(variance(zero, PAULI_Z)).toBeCloseTo(0, 9);
    expect(uncertainty(zero, PAULI_Z)).toBeCloseTo(0, 9);
  });

  it("is maximal (variance 1) for |+⟩ measured in Z, since outcomes are ±1 with 50/50 odds", () => {
    const plus = new StateVector([c(Math.SQRT1_2), c(Math.SQRT1_2)]);
    // Var(Z) = <Z^2> - <Z>^2 = 1 - 0 = 1 (Z^2 = I, so <Z^2> = 1 always).
    expect(variance(plus, PAULI_Z)).toBeCloseTo(1, 9);
    expect(uncertainty(plus, PAULI_Z)).toBeCloseTo(1, 9);
  });

  it("matches a hand-computed variance for an asymmetric state", () => {
    const psi = new StateVector([c(Math.sqrt(0.6)), c(Math.sqrt(0.4))]);
    // <Z> = 0.6 - 0.4 = 0.2; <Z^2> = 1 (Z^2=I); Var = 1 - 0.04 = 0.96.
    expect(variance(psi, PAULI_Z)).toBeCloseTo(0.96, 9);
  });
});

describe("commutator", () => {
  it("[X, Y] = 2iZ (the standard Pauli commutation relation)", () => {
    const result = commutator(PAULI_X, PAULI_Y);
    const expected = PAULI_Z.scale(c(0, 2));
    expect(result.equals(expected, 1e-9)).toBe(true);
  });

  it("[Y, Z] = 2iX", () => {
    const result = commutator(PAULI_Y, PAULI_Z);
    const expected = PAULI_X.scale(c(0, 2));
    expect(result.equals(expected, 1e-9)).toBe(true);
  });

  it("any operator commutes with itself: [A, A] = 0", () => {
    const result = commutator(PAULI_X, PAULI_X);
    const zero = new Matrix([[c(0), c(0)], [c(0), c(0)]]);
    expect(result.equals(zero, 1e-9)).toBe(true);
  });

  it("the identity commutes with everything", () => {
    const identity = Matrix.identity(2);
    const result = commutator(identity, PAULI_X);
    const zero = new Matrix([[c(0), c(0)], [c(0), c(0)]]);
    expect(result.equals(zero, 1e-9)).toBe(true);
  });
});

describe("commutatorExpectation", () => {
  it("⟨[X,Y]⟩ = 2i⟨Z⟩ for a state with known ⟨Z⟩", () => {
    const zero = new StateVector([c(1), c(0)]); // <Z> = 1 here
    const result = commutatorExpectation(zero, PAULI_X, PAULI_Y);
    expect(result.re).toBeCloseTo(0, 9);
    expect(result.im).toBeCloseTo(2, 9); // 2i * 1
  });
});
