import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { Matrix } from "../matrix";
import { StateVector, tensorStates } from "../state";

describe("StateVector construction", () => {
  it("rejects an empty amplitude array", () => {
    expect(() => new StateVector([])).toThrow(/power of two/);
  });

  it("rejects a single amplitude (dimension 1, i.e. zero qubits)", () => {
    expect(() => new StateVector([Complex.ONE])).toThrow(/power of two/);
  });

  it("accepts any true power-of-two dimension", () => {
    for (const numQubits of [1, 2, 3, 4]) {
      const dimension = 2 ** numQubits;
      const amplitudes = Array.from({ length: dimension }, (_, i) => (i === 0 ? Complex.ONE : Complex.ZERO));
      expect(new StateVector(amplitudes).numQubits).toBe(numQubits);
    }
  });
});

describe("StateVector.normalize", () => {
  it("scales an unnormalized state to unit norm while preserving amplitude ratios", () => {
    // Unnormalized: 3|0> + 4i|1>, norm = 5.
    const raw = new StateVector([new Complex(3, 0), new Complex(0, 4)]);
    expect(raw.isNormalized()).toBe(false);

    const normalized = raw.normalize();
    expect(normalized.norm()).toBeCloseTo(1, 9);
    // Ratio of the two amplitudes' magnitudes must be unchanged by a uniform rescale.
    const rawRatio = raw.amplitudes[0].magnitude() / raw.amplitudes[1].magnitude();
    const normRatio = normalized.amplitudes[0].magnitude() / normalized.amplitudes[1].magnitude();
    expect(normRatio).toBeCloseTo(rawRatio, 9);
    // Concretely: 3/5 and 4/5.
    expect(normalized.amplitudes[0].re).toBeCloseTo(0.6, 9);
    expect(normalized.amplitudes[1].im).toBeCloseTo(0.8, 9);
  });

  it("throws when normalizing the zero vector instead of dividing by zero", () => {
    const zero = new StateVector([Complex.ZERO, Complex.ZERO]);
    expect(() => zero.normalize()).toThrow(/zero vector/);
  });

  it("a state that is already normalized is left numerically unchanged", () => {
    const plus = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
    const renormalized = plus.normalize();
    expect(renormalized.amplitudes[0].equals(plus.amplitudes[0], 1e-12)).toBe(true);
    expect(renormalized.amplitudes[1].equals(plus.amplitudes[1], 1e-12)).toBe(true);
  });
});

describe("StateVector.isNormalized", () => {
  it("is true for a properly normalized state and false for a scaled-up one", () => {
    const plus = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
    expect(plus.isNormalized()).toBe(true);

    const scaled = new StateVector(plus.amplitudes.map((a) => a.scale(2)));
    expect(scaled.isNormalized()).toBe(false);
  });

  it("respects a custom epsilon at the boundary", () => {
    // norm = sqrt(1.01^2 + 0.1^2) = sqrt(1.0301) ~= 1.01494, so |norm - 1| ~= 0.01494.
    const almost = new StateVector([new Complex(1.01), new Complex(0.1)]);
    expect(almost.isNormalized(1e-9)).toBe(false);
    expect(almost.isNormalized(0.02)).toBe(true);
  });
});

describe("StateVector.innerProduct", () => {
  it("computational basis states are orthonormal", () => {
    const zero = StateVector.zero(1);
    const one = StateVector.basis(1, 1);
    expect(zero.innerProduct(one).equals(Complex.ZERO)).toBe(true);
    expect(one.innerProduct(zero).equals(Complex.ZERO)).toBe(true);
    expect(zero.innerProduct(zero).equals(Complex.ONE)).toBe(true);
  });

  it("is conjugate-symmetric: <psi|phi> = conj(<phi|psi>)", () => {
    const psi = new StateVector([new Complex(0.6, 0.2), new Complex(0.3, -0.7)]).normalize();
    const phi = new StateVector([new Complex(0.1, -0.4), new Complex(0.8, 0.5)]).normalize();
    const inner = psi.innerProduct(phi);
    const reverseConj = phi.innerProduct(psi).conjugate();
    expect(inner.equals(reverseConj, 1e-9)).toBe(true);
  });

  it("throws when the two states have different dimensions", () => {
    const oneQubit = StateVector.zero(1);
    const twoQubit = StateVector.zero(2);
    expect(() => oneQubit.innerProduct(twoQubit)).toThrow(/same dimension/);
  });
});

describe("StateVector.applyMatrix", () => {
  it("matches applying the matrix directly to the amplitude array", () => {
    const hadamard = new Matrix([
      [new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)],
      [new Complex(Math.SQRT1_2), new Complex(-Math.SQRT1_2)],
    ]);
    const state = StateVector.zero(1);
    const viaState = state.applyMatrix(hadamard);
    const viaMatrix = hadamard.apply(state.amplitudes);
    expect(viaState.amplitudes[0].equals(viaMatrix[0])).toBe(true);
    expect(viaState.amplitudes[1].equals(viaMatrix[1])).toBe(true);
  });
});

describe("StateVector.basisLabel", () => {
  it("zero-pads the binary label out to numQubits digits", () => {
    const state = StateVector.zero(4);
    expect(state.basisLabel(0)).toBe("0000");
    expect(state.basisLabel(1)).toBe("0001");
    expect(state.basisLabel(5)).toBe("0101");
    expect(state.basisLabel(15)).toBe("1111");
  });
});

describe("StateVector.tensor / tensorStates — precision and edge cases", () => {
  it("preserves a very small but nonzero amplitude component through a tensor product", () => {
    // A state with a deliberately tiny (but physically nonzero) component.
    const tiny = 1e-8;
    const almostZero = new StateVector([
      new Complex(Math.sqrt(1 - tiny * tiny)),
      new Complex(tiny),
    ]);
    const combined = almostZero.tensor(StateVector.zero(1));
    // |almostZero>|0>: amplitude on the "10" branch should be ~tiny, not
    // rounded away to exactly 0, and the state should still be normalized.
    expect(combined.amplitudes[2].re).toBeCloseTo(tiny, 12);
    expect(combined.amplitudes[2].re).not.toBe(0);
    expect(combined.norm()).toBeCloseTo(1, 9);
  });

  it("tensoring normalized states yields a state whose norm is the product of norms (1 * 1 = 1)", () => {
    const a = new StateVector([new Complex(0.6), new Complex(0.8)]);
    const b = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
    expect(a.tensor(b).norm()).toBeCloseTo(a.norm() * b.norm(), 9);
  });

  it("tensorStates on a single-element array is the identity (no spurious extra tensoring)", () => {
    const state = new StateVector([new Complex(0.6), new Complex(0.8)]);
    const result = tensorStates([state]);
    expect(result.dimension).toBe(state.dimension);
    expect(result.amplitudes[0].equals(state.amplitudes[0])).toBe(true);
    expect(result.amplitudes[1].equals(state.amplitudes[1])).toBe(true);
  });

  it("tensorStates throws for an empty list", () => {
    expect(() => tensorStates([])).toThrow(/at least one/);
  });
});
