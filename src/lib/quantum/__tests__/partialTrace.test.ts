import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { StateVector } from "../state";
import {
  pureStateDensityMatrix,
  maximallyMixedState,
  computationalBasisDensityMatrix,
  purity,
} from "../densityMatrix";
import { partialTrace, reducedDensityMatrixQubit0, reducedDensityMatrixQubit1 } from "../partialTrace";

const sqrt1_2 = Math.SQRT1_2;

function bellPhiPlus(): StateVector {
  return new StateVector([new Complex(sqrt1_2), Complex.ZERO, Complex.ZERO, new Complex(sqrt1_2)]);
}

function bellPsiPlus(): StateVector {
  return new StateVector([Complex.ZERO, new Complex(sqrt1_2), new Complex(sqrt1_2), Complex.ZERO]);
}

describe("partialTrace on product states", () => {
  it("|00> reduces to |0><0| on both qubits", () => {
    const rho = pureStateDensityMatrix(StateVector.basis(2, 0)); // |00>
    const reducedA = reducedDensityMatrixQubit0(rho);
    const reducedB = reducedDensityMatrixQubit1(rho);
    expect(reducedA.equals(computationalBasisDensityMatrix(1, 0), 1e-9)).toBe(true);
    expect(reducedB.equals(computationalBasisDensityMatrix(1, 0), 1e-9)).toBe(true);
  });

  it("|01> reduces to |0> on qubit 0 (MSB) and |1> on qubit 1 (LSB)", () => {
    const rho = pureStateDensityMatrix(StateVector.basis(2, 1)); // |01>, qubit0=0 (MSB), qubit1=1 (LSB)
    const reducedA = reducedDensityMatrixQubit0(rho);
    const reducedB = reducedDensityMatrixQubit1(rho);
    expect(reducedA.equals(computationalBasisDensityMatrix(1, 0), 1e-9)).toBe(true);
    expect(reducedB.equals(computationalBasisDensityMatrix(1, 1), 1e-9)).toBe(true);
  });

  it("|10> reduces to |1> on qubit 0 and |0> on qubit 1", () => {
    const rho = pureStateDensityMatrix(StateVector.basis(2, 2)); // |10>
    const reducedA = reducedDensityMatrixQubit0(rho);
    const reducedB = reducedDensityMatrixQubit1(rho);
    expect(reducedA.equals(computationalBasisDensityMatrix(1, 1), 1e-9)).toBe(true);
    expect(reducedB.equals(computationalBasisDensityMatrix(1, 0), 1e-9)).toBe(true);
  });

  it("|+>|0> reduces to |+><+| on qubit 0 and |0><0| on qubit 1", () => {
    // |+0> = (|00> + |10>)/sqrt2
    const state = new StateVector([new Complex(sqrt1_2), Complex.ZERO, new Complex(sqrt1_2), Complex.ZERO]);
    const rho = pureStateDensityMatrix(state);
    const reducedA = reducedDensityMatrixQubit0(rho);
    const reducedB = reducedDensityMatrixQubit1(rho);
    const plusRho = pureStateDensityMatrix(new StateVector([new Complex(sqrt1_2), new Complex(sqrt1_2)]));
    expect(reducedA.equals(plusRho, 1e-9)).toBe(true);
    expect(reducedB.equals(computationalBasisDensityMatrix(1, 0), 1e-9)).toBe(true);
  });

  it("a product state's reduced density matrices are both pure (product states carry no entanglement)", () => {
    const state = new StateVector([new Complex(sqrt1_2), Complex.ZERO, new Complex(sqrt1_2), Complex.ZERO]);
    const rho = pureStateDensityMatrix(state);
    expect(purity(reducedDensityMatrixQubit0(rho))).toBeCloseTo(1, 9);
    expect(purity(reducedDensityMatrixQubit1(rho))).toBeCloseTo(1, 9);
  });
});

describe("partialTrace on Bell states", () => {
  it("Phi+ reduces to I/2 on both qubits (maximally mixed)", () => {
    const rho = pureStateDensityMatrix(bellPhiPlus());
    const reducedA = reducedDensityMatrixQubit0(rho);
    const reducedB = reducedDensityMatrixQubit1(rho);
    expect(reducedA.equals(maximallyMixedState(2), 1e-9)).toBe(true);
    expect(reducedB.equals(maximallyMixedState(2), 1e-9)).toBe(true);
  });

  it("Psi+ also reduces to I/2 on both qubits", () => {
    const rho = pureStateDensityMatrix(bellPsiPlus());
    const reducedA = reducedDensityMatrixQubit0(rho);
    const reducedB = reducedDensityMatrixQubit1(rho);
    expect(reducedA.equals(maximallyMixedState(2), 1e-9)).toBe(true);
    expect(reducedB.equals(maximallyMixedState(2), 1e-9)).toBe(true);
  });

  it("both Bell-state reduced density matrices are maximally mixed (purity 0.5), despite the global state being pure", () => {
    const rho = pureStateDensityMatrix(bellPhiPlus());
    expect(purity(pureStateDensityMatrix(bellPhiPlus()))).toBeCloseTo(1, 9); // global state is pure
    expect(purity(reducedDensityMatrixQubit0(rho))).toBeCloseTo(0.5, 9); // but its reduced state isn't
  });
});

describe("partialTrace on an arbitrary entangled state", () => {
  it("cos(theta)|00> + sin(theta)|11> reduces to diag(cos^2, sin^2) on qubit 0", () => {
    const theta = 0.37;
    const state = new StateVector([
      new Complex(Math.cos(theta)),
      Complex.ZERO,
      Complex.ZERO,
      new Complex(Math.sin(theta)),
    ]);
    const rho = pureStateDensityMatrix(state);
    const reducedA = reducedDensityMatrixQubit0(rho);
    expect(reducedA.get(0, 0).re).toBeCloseTo(Math.cos(theta) ** 2, 9);
    expect(reducedA.get(1, 1).re).toBeCloseTo(Math.sin(theta) ** 2, 9);
    expect(reducedA.get(0, 1).magnitude()).toBeCloseTo(0, 9);
  });
});

describe("partialTrace validation", () => {
  it("throws when rho's dimension doesn't match totalQubits", () => {
    const rho = maximallyMixedState(2);
    expect(() => partialTrace(rho, 2, [0])).toThrow(/totalQubits/);
  });

  it("throws for an out-of-range qubit index", () => {
    const rho = pureStateDensityMatrix(bellPhiPlus());
    expect(() => partialTrace(rho, 2, [5])).toThrow(/out of range/);
  });

  it("throws when tracing out every qubit", () => {
    const rho = pureStateDensityMatrix(bellPhiPlus());
    expect(() => partialTrace(rho, 2, [0, 1])).toThrow(/at least one/);
  });

  it("always returns a Hermitian, unit-trace matrix", () => {
    const rho = pureStateDensityMatrix(bellPsiPlus());
    const reduced = reducedDensityMatrixQubit0(rho);
    expect(reduced.isHermitian()).toBe(true);
    expect(reduced.trace().re).toBeCloseTo(1, 9);
  });
});

describe("partialTrace on 3-qubit states (generality beyond the 2-qubit convenience wrappers)", () => {
  it("tracing out qubits 1 and 2 from |101> leaves |1><1| on the remaining qubit", () => {
    // |101>: qubit0=1 (MSB), qubit1=0, qubit2=1 (LSB) -> index 0b101 = 5
    const rho = pureStateDensityMatrix(StateVector.basis(3, 0b101));
    const reduced = partialTrace(rho, 3, [1, 2]);
    expect(reduced.rows).toBe(2);
    expect(reduced.equals(computationalBasisDensityMatrix(1, 1), 1e-9)).toBe(true);
  });

  it("tracing out just the middle qubit from a 3-qubit product state preserves the outer two", () => {
    // |1>|+>|0> : qubit0=1, qubit1=+, qubit2=0
    const one = [Complex.ZERO, Complex.ONE];
    const plus = [new Complex(sqrt1_2), new Complex(sqrt1_2)];
    const zero = [Complex.ONE, Complex.ZERO];
    const amplitudes: Complex[] = [];
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        for (let k = 0; k < 2; k++) {
          amplitudes.push(one[i].mul(plus[j]).mul(zero[k]));
        }
      }
    }
    const state = new StateVector(amplitudes);
    const rho = pureStateDensityMatrix(state);
    const reduced = partialTrace(rho, 3, [1]); // trace out qubit 1, keep qubits 0 and 2
    // Expected: |1><1| tensor |0><0| on the remaining (qubit0, qubit2) pair.
    const expected = computationalBasisDensityMatrix(1, 1).tensor(computationalBasisDensityMatrix(1, 0));
    expect(reduced.equals(expected, 1e-9)).toBe(true);
  });
});

describe("cross-check: reducedDensityMatrixQubit0/1 match partialTrace directly", () => {
  it("reducedDensityMatrixQubit0(rho) === partialTrace(rho, 2, [1])", () => {
    const rho = pureStateDensityMatrix(bellPsiPlus());
    expect(reducedDensityMatrixQubit0(rho).equals(partialTrace(rho, 2, [1]), 1e-9)).toBe(true);
  });

  it("reducedDensityMatrixQubit1(rho) === partialTrace(rho, 2, [0])", () => {
    const rho = pureStateDensityMatrix(bellPsiPlus());
    expect(reducedDensityMatrixQubit1(rho).equals(partialTrace(rho, 2, [0]), 1e-9)).toBe(true);
  });
});
