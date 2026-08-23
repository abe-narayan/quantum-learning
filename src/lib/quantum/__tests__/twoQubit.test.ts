import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { StateVector } from "../state";
import { applySingleQubitGate, applyCNOT, HADAMARD } from "../gates";
import { testSeparability, twoQubitJointProbabilities } from "../twoQubit";

const s = Math.SQRT1_2;

describe("testSeparability", () => {
  it("detects computational basis states as separable", () => {
    for (const index of [0b00, 0b01, 0b10, 0b11]) {
      const result = testSeparability(StateVector.basis(2, index));
      expect(result.separable).toBe(true);
      expect(result.determinantMagnitude).toBeCloseTo(0, 9);
    }
  });

  it("detects |+⟩⊗|+⟩ (a genuine product state) as separable", () => {
    const plus = new StateVector([new Complex(s), new Complex(s)]);
    const plusPlus = plus.tensor(plus);
    const result = testSeparability(plusPlus);
    expect(result.separable).toBe(true);
    expect(result.determinantMagnitude).toBeCloseTo(0, 9);
  });

  it("detects an arbitrary product state |a⟩⊗|b⟩ as separable", () => {
    // |a> = 0.6|0> + 0.8|1>, |b> = |+i>
    const a = new StateVector([new Complex(0.6), new Complex(0.8)]);
    const b = new StateVector([new Complex(s), new Complex(0, s)]);
    const result = testSeparability(a.tensor(b));
    expect(result.separable).toBe(true);
    expect(result.determinantMagnitude).toBeCloseTo(0, 9);
  });

  it("detects the Bell state (|00> + |11>)/sqrt2 as entangled", () => {
    const bell = applyCNOT(applySingleQubitGate(StateVector.zero(2), HADAMARD, 0), 0, 1);
    const result = testSeparability(bell);
    expect(result.separable).toBe(false);
    // ad - bc = (1/sqrt2)(1/sqrt2) - 0*0 = 1/2, magnitude 0.5
    expect(result.determinantMagnitude).toBeCloseTo(0.5, 9);
  });

  it("detects all four Bell states as entangled", () => {
    // |Phi-> = (|00> - |11>)/sqrt2
    const phiMinus = new StateVector([new Complex(s), Complex.ZERO, Complex.ZERO, new Complex(-s)]);
    // |Psi+> = (|01> + |10>)/sqrt2
    const psiPlus = new StateVector([Complex.ZERO, new Complex(s), new Complex(s), Complex.ZERO]);
    // |Psi-> = (|01> - |10>)/sqrt2
    const psiMinus = new StateVector([Complex.ZERO, new Complex(s), new Complex(-s), Complex.ZERO]);

    for (const bellState of [phiMinus, psiPlus, psiMinus]) {
      expect(testSeparability(bellState).separable).toBe(false);
    }
  });

  it("does not label a state entangled just because it isn't named a Bell state", () => {
    // A state that "looks complicated" but is still a plain product state.
    const a = new StateVector([new Complex(0, s), new Complex(-s, 0)]); // some single-qubit state
    const b = new StateVector([new Complex(0.28, 0), new Complex(0.96, 0)]); // another
    const product = a.tensor(b);
    expect(testSeparability(product).separable).toBe(true);
  });

  it("respects numerical tolerance for a near-zero but nonzero determinant", () => {
    // a=1, b=0, c=0, d=1e-10 gives determinant ad - bc = 1e-10 exactly —
    // below the 1e-9 default tolerance (reads as separable), but above a
    // tighter 1e-15 tolerance (reads as entangled).
    const tinyOffState = new StateVector([
      new Complex(1, 0),
      Complex.ZERO,
      Complex.ZERO,
      new Complex(1e-10, 0),
    ]).normalize();

    const resultDefault = testSeparability(tinyOffState);
    expect(resultDefault.separable).toBe(true);
    expect(resultDefault.determinantMagnitude).toBeCloseTo(1e-10, 12);

    const resultStrict = testSeparability(tinyOffState, 1e-15);
    expect(resultStrict.separable).toBe(false);
  });

  it("throws for a state that isn't exactly 2 qubits", () => {
    expect(() => testSeparability(StateVector.zero(1))).toThrow();
    expect(() => testSeparability(StateVector.zero(3))).toThrow();
  });
});

describe("twoQubitJointProbabilities", () => {
  it("matches the Bell state's known 50/50 diagonal distribution", () => {
    const bell = applyCNOT(applySingleQubitGate(StateVector.zero(2), HADAMARD, 0), 0, 1);
    const { p00, p01, p10, p11 } = twoQubitJointProbabilities(bell);
    expect(p00).toBeCloseTo(0.5, 9);
    expect(p01).toBeCloseTo(0, 9);
    expect(p10).toBeCloseTo(0, 9);
    expect(p11).toBeCloseTo(0.5, 9);
  });

  it("sums to 1 for any normalized state", () => {
    const plus = new StateVector([new Complex(s), new Complex(s)]);
    const state = plus.tensor(plus);
    const { p00, p01, p10, p11 } = twoQubitJointProbabilities(state);
    expect(p00 + p01 + p10 + p11).toBeCloseTo(1, 9);
  });

  it("throws for a state that isn't exactly 2 qubits", () => {
    expect(() => twoQubitJointProbabilities(StateVector.zero(1))).toThrow();
  });
});
