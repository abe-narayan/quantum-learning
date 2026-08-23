import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { StateVector } from "../state";
import { entanglementEntropy, concurrenceOfPureState, isEntangled } from "../entanglement";

const sqrt1_2 = Math.SQRT1_2;

function bellPhiPlus(): StateVector {
  return new StateVector([new Complex(sqrt1_2), Complex.ZERO, Complex.ZERO, new Complex(sqrt1_2)]);
}

function bellPhiMinus(): StateVector {
  return new StateVector([new Complex(sqrt1_2), Complex.ZERO, Complex.ZERO, new Complex(-sqrt1_2)]);
}

function bellPsiPlus(): StateVector {
  return new StateVector([Complex.ZERO, new Complex(sqrt1_2), new Complex(sqrt1_2), Complex.ZERO]);
}

function bellPsiMinus(): StateVector {
  return new StateVector([Complex.ZERO, new Complex(sqrt1_2), new Complex(-sqrt1_2), Complex.ZERO]);
}

function productState(): StateVector {
  // |+0> = (|00> + |10>)/sqrt2
  return new StateVector([new Complex(sqrt1_2), Complex.ZERO, new Complex(sqrt1_2), Complex.ZERO]);
}

function partiallyEntangled(theta: number): StateVector {
  return new StateVector([new Complex(Math.cos(theta)), Complex.ZERO, Complex.ZERO, new Complex(Math.sin(theta))]);
}

describe("entanglementEntropy", () => {
  it("is 0 for a product state", () => {
    expect(entanglementEntropy(productState())).toBeCloseTo(0, 9);
  });

  it("is 0 for a computational basis state", () => {
    expect(entanglementEntropy(StateVector.basis(2, 0))).toBeCloseTo(0, 9);
  });

  it("is exactly 1 bit for each of the four Bell states", () => {
    for (const bell of [bellPhiPlus(), bellPhiMinus(), bellPsiPlus(), bellPsiMinus()]) {
      expect(entanglementEntropy(bell)).toBeCloseTo(1, 9);
    }
  });

  it("is strictly between 0 and 1 for a partially entangled state", () => {
    const s = entanglementEntropy(partiallyEntangled(0.3));
    expect(s).toBeGreaterThan(0);
    expect(s).toBeLessThan(1);
  });

  it("increases monotonically as theta moves from 0 toward pi/4 (maximal entanglement)", () => {
    const near0 = entanglementEntropy(partiallyEntangled(0.05));
    const mid = entanglementEntropy(partiallyEntangled(0.4));
    const atMax = entanglementEntropy(partiallyEntangled(Math.PI / 4));
    expect(near0).toBeLessThan(mid);
    expect(mid).toBeLessThan(atMax);
    expect(atMax).toBeCloseTo(1, 9);
  });

  it("throws for a non-2-qubit state", () => {
    expect(() => entanglementEntropy(StateVector.basis(1, 0))).toThrow(/2-qubit/);
    expect(() => entanglementEntropy(StateVector.basis(3, 0))).toThrow(/2-qubit/);
  });
});

describe("concurrenceOfPureState", () => {
  it("is 0 for a product state", () => {
    expect(concurrenceOfPureState(productState())).toBeCloseTo(0, 9);
  });

  it("is 1 for each of the four Bell states", () => {
    for (const bell of [bellPhiPlus(), bellPhiMinus(), bellPsiPlus(), bellPsiMinus()]) {
      expect(concurrenceOfPureState(bell)).toBeCloseTo(1, 9);
    }
  });

  it("equals |sin(2 theta)| for cos(theta)|00> + sin(theta)|11>", () => {
    for (const theta of [0.1, 0.3, 0.5, 0.7, 1.0]) {
      const expected = Math.abs(Math.sin(2 * theta));
      expect(concurrenceOfPureState(partiallyEntangled(theta))).toBeCloseTo(expected, 9);
    }
  });

  it("agrees with entanglementEntropy on which states are entangled at all (both zero or both nonzero together)", () => {
    const states = [productState(), bellPhiPlus(), partiallyEntangled(0.2), StateVector.basis(2, 3)];
    for (const state of states) {
      const c = concurrenceOfPureState(state);
      const s = entanglementEntropy(state);
      if (c < 1e-9) {
        expect(s).toBeLessThan(1e-6);
      } else {
        expect(s).toBeGreaterThan(1e-6);
      }
    }
  });
});

describe("isEntangled", () => {
  it("is false for product states", () => {
    expect(isEntangled(productState())).toBe(false);
    expect(isEntangled(StateVector.basis(2, 0))).toBe(false);
  });

  it("is true for all four Bell states", () => {
    for (const bell of [bellPhiPlus(), bellPhiMinus(), bellPsiPlus(), bellPsiMinus()]) {
      expect(isEntangled(bell)).toBe(true);
    }
  });

  it("is true for a genuinely partially entangled state", () => {
    expect(isEntangled(partiallyEntangled(0.3))).toBe(true);
  });

  it("is false in the theta->0 limit (state approaches a product state)", () => {
    // theta = 0 exactly gives |00>, a product state.
    expect(isEntangled(partiallyEntangled(0))).toBe(false);
  });
});
