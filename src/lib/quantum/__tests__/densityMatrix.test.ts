import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { Matrix } from "../matrix";
import { StateVector } from "../state";
import { PAULI_X, PAULI_Y, PAULI_Z, HADAMARD } from "../gates";
import { expectationValue } from "../observables";
import {
  pureStateDensityMatrix,
  computationalBasisDensityMatrix,
  maximallyMixedState,
  convexCombination,
  purity,
  isPureState,
  validateDensityMatrix,
  eigenvaluesHermitian2x2,
  vonNeumannEntropy,
  densityMatrixExpectationValue,
  densityMatrixMeasurementProbability,
  densityMatrixCollapse,
  evolveDensityMatrix,
} from "../densityMatrix";

const sqrt1_2 = Math.SQRT1_2;

describe("pureStateDensityMatrix", () => {
  it("|0> -> [[1,0],[0,0]]", () => {
    const rho = pureStateDensityMatrix(StateVector.zero(1));
    expect(rho.get(0, 0).equals(Complex.ONE)).toBe(true);
    expect(rho.get(0, 1).equals(Complex.ZERO)).toBe(true);
    expect(rho.get(1, 0).equals(Complex.ZERO)).toBe(true);
    expect(rho.get(1, 1).equals(Complex.ZERO)).toBe(true);
  });

  it("|+> -> 1/2 [[1,1],[1,1]]", () => {
    const plus = new StateVector([new Complex(sqrt1_2), new Complex(sqrt1_2)]);
    const rho = pureStateDensityMatrix(plus);
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        expect(rho.get(i, j).equals(new Complex(0.5), 1e-9)).toBe(true);
      }
    }
  });

  it("Bell state |Phi+> has the expected 4x4 density matrix", () => {
    const bell = new StateVector([new Complex(sqrt1_2), Complex.ZERO, Complex.ZERO, new Complex(sqrt1_2)]);
    const rho = pureStateDensityMatrix(bell);
    expect(rho.get(0, 0).equals(new Complex(0.5), 1e-9)).toBe(true);
    expect(rho.get(3, 3).equals(new Complex(0.5), 1e-9)).toBe(true);
    expect(rho.get(0, 3).equals(new Complex(0.5), 1e-9)).toBe(true);
    expect(rho.get(3, 0).equals(new Complex(0.5), 1e-9)).toBe(true);
    expect(rho.get(1, 1).equals(Complex.ZERO, 1e-9)).toBe(true);
    expect(rho.get(2, 2).equals(Complex.ZERO, 1e-9)).toBe(true);
  });

  it("is always Hermitian with trace 1, for an arbitrary normalized state", () => {
    const state = new StateVector([new Complex(0.6, 0.2), new Complex(0.3, -0.7)]).normalize();
    const rho = pureStateDensityMatrix(state);
    expect(rho.isHermitian()).toBe(true);
    expect(rho.trace().re).toBeCloseTo(1, 9);
    expect(rho.trace().im).toBeCloseTo(0, 9);
  });
});

describe("computationalBasisDensityMatrix", () => {
  it("matches pureStateDensityMatrix(StateVector.basis(...))", () => {
    const a = computationalBasisDensityMatrix(2, 2); // |10>
    const b = pureStateDensityMatrix(StateVector.basis(2, 2));
    expect(a.equals(b, 1e-9)).toBe(true);
  });
});

describe("maximallyMixedState", () => {
  it("I/2 for a single qubit", () => {
    const rho = maximallyMixedState(2);
    expect(rho.get(0, 0).equals(new Complex(0.5))).toBe(true);
    expect(rho.get(1, 1).equals(new Complex(0.5))).toBe(true);
    expect(rho.get(0, 1).equals(Complex.ZERO)).toBe(true);
    expect(rho.trace().re).toBeCloseTo(1, 9);
  });

  it("throws on a non-positive-integer dimension", () => {
    expect(() => maximallyMixedState(0)).toThrow();
    expect(() => maximallyMixedState(1.5)).toThrow();
  });
});

describe("convexCombination", () => {
  it("a 50/50 mixture of |0><0| and |1><1| gives diag(0.5, 0.5)", () => {
    const rho0 = computationalBasisDensityMatrix(1, 0);
    const rho1 = computationalBasisDensityMatrix(1, 1);
    const mixed = convexCombination([
      { probability: 0.5, density: rho0 },
      { probability: 0.5, density: rho1 },
    ]);
    expect(mixed.equals(maximallyMixedState(2), 1e-9)).toBe(true);
  });

  it("preserves Hermiticity and unit trace for an arbitrary valid mixture", () => {
    const plus = new StateVector([new Complex(sqrt1_2), new Complex(sqrt1_2)]);
    const mixed = convexCombination([
      { probability: 0.3, density: computationalBasisDensityMatrix(1, 0) },
      { probability: 0.7, density: pureStateDensityMatrix(plus) },
    ]);
    expect(mixed.isHermitian()).toBe(true);
    expect(mixed.trace().re).toBeCloseTo(1, 9);
  });

  it("throws when probabilities don't sum to 1", () => {
    const rho0 = computationalBasisDensityMatrix(1, 0);
    expect(() => convexCombination([{ probability: 0.5, density: rho0 }])).toThrow(/sum/);
  });

  it("throws on a negative probability", () => {
    const rho0 = computationalBasisDensityMatrix(1, 0);
    const rho1 = computationalBasisDensityMatrix(1, 1);
    expect(() =>
      convexCombination([
        { probability: 1.5, density: rho0 },
        { probability: -0.5, density: rho1 },
      ])
    ).toThrow(/non-negative/);
  });

  it("throws on an empty term list", () => {
    expect(() => convexCombination([])).toThrow(/at least one/);
  });
});

describe("purity / isPureState", () => {
  it("a pure state has purity exactly 1", () => {
    const rho = pureStateDensityMatrix(new StateVector([new Complex(sqrt1_2), new Complex(sqrt1_2)]));
    expect(purity(rho)).toBeCloseTo(1, 9);
    expect(isPureState(rho)).toBe(true);
  });

  it("the maximally mixed qubit has purity 1/2", () => {
    expect(purity(maximallyMixedState(2))).toBeCloseTo(0.5, 9);
    expect(isPureState(maximallyMixedState(2))).toBe(false);
  });

  it("a classical mixture of |0> and |1> has the same diagonal as |+> but is not pure", () => {
    const plusRho = pureStateDensityMatrix(new StateVector([new Complex(sqrt1_2), new Complex(sqrt1_2)]));
    const classicalMix = convexCombination([
      { probability: 0.5, density: computationalBasisDensityMatrix(1, 0) },
      { probability: 0.5, density: computationalBasisDensityMatrix(1, 1) },
    ]);
    // Same diagonal (same computational-basis measurement statistics)...
    expect(plusRho.get(0, 0).equals(classicalMix.get(0, 0), 1e-9)).toBe(true);
    expect(plusRho.get(1, 1).equals(classicalMix.get(1, 1), 1e-9)).toBe(true);
    // ...but different off-diagonal terms, and different purity.
    expect(plusRho.get(0, 1).magnitude()).toBeGreaterThan(0.4);
    expect(classicalMix.get(0, 1).magnitude()).toBeCloseTo(0, 9);
    expect(purity(plusRho)).toBeCloseTo(1, 9);
    expect(purity(classicalMix)).toBeCloseTo(0.5, 9);
  });

  it("an intermediate mixture has purity strictly between 0.5 and 1", () => {
    const rho0 = computationalBasisDensityMatrix(1, 0);
    const plus = pureStateDensityMatrix(new StateVector([new Complex(sqrt1_2), new Complex(sqrt1_2)]));
    const mixed = convexCombination([
      { probability: 0.2, density: rho0 },
      { probability: 0.8, density: plus },
    ]);
    const p = purity(mixed);
    expect(p).toBeLessThan(1);
    expect(p).toBeGreaterThan(0.5);
  });
});

describe("validateDensityMatrix", () => {
  it("a pure state is valid, with exact 2x2 positivity checked", () => {
    const rho = pureStateDensityMatrix(new StateVector([new Complex(sqrt1_2), new Complex(sqrt1_2)]));
    const result = validateDensityMatrix(rho);
    expect(result.valid).toBe(true);
    expect(result.isHermitian).toBe(true);
    expect(result.hasUnitTrace).toBe(true);
    expect(result.isPositiveSemiDefinite).toBe(true);
  });

  it("the maximally mixed qubit is valid", () => {
    expect(validateDensityMatrix(maximallyMixedState(2)).valid).toBe(true);
  });

  it("detects a non-Hermitian matrix as invalid", () => {
    const notHermitian = new Matrix([
      [new Complex(1), new Complex(1)],
      [new Complex(0), new Complex(0)],
    ]);
    const result = validateDensityMatrix(notHermitian);
    expect(result.isHermitian).toBe(false);
    expect(result.valid).toBe(false);
  });

  it("detects a Hermitian matrix with trace != 1 as invalid", () => {
    const badTrace = new Matrix([
      [new Complex(2), Complex.ZERO],
      [Complex.ZERO, new Complex(1)],
    ]);
    const result = validateDensityMatrix(badTrace);
    expect(result.isHermitian).toBe(true);
    expect(result.hasUnitTrace).toBe(false);
    expect(result.valid).toBe(false);
  });

  it("detects a Hermitian, trace-1, but non-positive-semi-definite 2x2 matrix as invalid", () => {
    // Eigenvalues 2 and -1 (trace 1, det -2): not physical.
    const notPositive = new Matrix([
      [new Complex(0.5), new Complex(1.5)],
      [new Complex(1.5), new Complex(0.5)],
    ]);
    const result = validateDensityMatrix(notPositive);
    expect(result.isHermitian).toBe(true);
    expect(result.hasUnitTrace).toBe(true);
    expect(result.isPositiveSemiDefinite).toBe(false);
    expect(result.valid).toBe(false);
  });

  it("does not attempt exact positivity checking for larger-than-2x2 matrices", () => {
    const bell = new StateVector([new Complex(sqrt1_2), Complex.ZERO, Complex.ZERO, new Complex(sqrt1_2)]);
    const result = validateDensityMatrix(pureStateDensityMatrix(bell));
    expect(result.isPositiveSemiDefinite).toBeNull();
    // Still considered valid overall, since Hermitian+trace-1 hold and positivity wasn't disproven.
    expect(result.valid).toBe(true);
  });
});

describe("eigenvaluesHermitian2x2", () => {
  it("diag(1,0) has eigenvalues 1 and 0", () => {
    const rho = computationalBasisDensityMatrix(1, 0);
    const [l1, l2] = eigenvaluesHermitian2x2(rho);
    expect(l1).toBeCloseTo(1, 9);
    expect(l2).toBeCloseTo(0, 9);
  });

  it("I/2 has both eigenvalues equal to 0.5", () => {
    const [l1, l2] = eigenvaluesHermitian2x2(maximallyMixedState(2));
    expect(l1).toBeCloseTo(0.5, 9);
    expect(l2).toBeCloseTo(0.5, 9);
  });

  it("|+><+| has eigenvalues 1 and 0 (a pure state, despite off-diagonal entries)", () => {
    const plus = pureStateDensityMatrix(new StateVector([new Complex(sqrt1_2), new Complex(sqrt1_2)]));
    const [l1, l2] = eigenvaluesHermitian2x2(plus);
    expect(l1).toBeCloseTo(1, 9);
    expect(l2).toBeCloseTo(0, 9);
  });

  it("eigenvalues sum to the trace and multiply to the determinant", () => {
    const rho = new Matrix([
      [new Complex(0.7), new Complex(0.1, 0.2)],
      [new Complex(0.1, -0.2), new Complex(0.3)],
    ]);
    const [l1, l2] = eigenvaluesHermitian2x2(rho);
    expect(l1 + l2).toBeCloseTo(rho.trace().re, 9);
    const det = rho.get(0, 0).mul(rho.get(1, 1)).sub(rho.get(0, 1).mul(rho.get(1, 0)));
    expect(l1 * l2).toBeCloseTo(det.re, 9);
  });

  it("throws for a non-2x2 matrix", () => {
    expect(() => eigenvaluesHermitian2x2(Matrix.identity(3))).toThrow(/2x2/);
  });
});

describe("vonNeumannEntropy", () => {
  it("a pure state has entropy 0", () => {
    const rho = pureStateDensityMatrix(new StateVector([new Complex(sqrt1_2), new Complex(sqrt1_2)]));
    expect(vonNeumannEntropy(rho)).toBeCloseTo(0, 9);
  });

  it("the maximally mixed qubit has entropy exactly 1 bit", () => {
    expect(vonNeumannEntropy(maximallyMixedState(2))).toBeCloseTo(1, 9);
  });

  it("a classical 50/50 mixture of |0> and |1> also has entropy 1 (it's diagonal with eigenvalues 0.5, 0.5)", () => {
    const classicalMix = convexCombination([
      { probability: 0.5, density: computationalBasisDensityMatrix(1, 0) },
      { probability: 0.5, density: computationalBasisDensityMatrix(1, 1) },
    ]);
    expect(vonNeumannEntropy(classicalMix)).toBeCloseTo(1, 9);
  });

  it("computes entropy from eigenvalues, not diagonal entries directly", () => {
    // |+><+| has diagonal (0.5, 0.5) -- identical to I/2's diagonal -- but
    // its eigenvalues are (1, 0), giving entropy 0, not 1.
    const plusRho = pureStateDensityMatrix(new StateVector([new Complex(sqrt1_2), new Complex(sqrt1_2)]));
    expect(plusRho.get(0, 0).re).toBeCloseTo(0.5, 9);
    expect(plusRho.get(1, 1).re).toBeCloseTo(0.5, 9);
    expect(vonNeumannEntropy(plusRho)).toBeCloseTo(0, 9);
  });

  it("an intermediate mixture has entropy strictly between 0 and 1", () => {
    const rho0 = computationalBasisDensityMatrix(1, 0);
    const mixed = convexCombination([
      { probability: 0.9, density: rho0 },
      { probability: 0.1, density: maximallyMixedState(2) },
    ]);
    const s = vonNeumannEntropy(mixed);
    expect(s).toBeGreaterThan(0);
    expect(s).toBeLessThan(1);
  });

  it("handles an exactly-zero eigenvalue without producing NaN (0*log2(0) = 0)", () => {
    const rho = computationalBasisDensityMatrix(1, 0); // eigenvalues 1, 0
    expect(Number.isNaN(vonNeumannEntropy(rho))).toBe(false);
    expect(vonNeumannEntropy(rho)).toBeCloseTo(0, 9);
  });
});

describe("densityMatrixExpectationValue", () => {
  it("agrees with observables.ts's expectationValue for a pure state, for several observables", () => {
    const state = new StateVector([new Complex(0.6), new Complex(0.8)]);
    const rho = pureStateDensityMatrix(state);
    for (const observable of [PAULI_X, PAULI_Y, PAULI_Z, HADAMARD]) {
      const fromDensityMatrix = densityMatrixExpectationValue(rho, observable);
      const fromStateVector = expectationValue(state, observable);
      expect(fromDensityMatrix.re).toBeCloseTo(fromStateVector.re, 9);
      expect(fromDensityMatrix.im).toBeCloseTo(fromStateVector.im, 9);
    }
  });

  it("the maximally mixed qubit has zero expectation for every Pauli operator", () => {
    const rho = maximallyMixedState(2);
    for (const observable of [PAULI_X, PAULI_Y, PAULI_Z]) {
      expect(densityMatrixExpectationValue(rho, observable).re).toBeCloseTo(0, 9);
    }
  });
});

describe("densityMatrixMeasurementProbability / densityMatrixCollapse", () => {
  it("matches StateVector-based probabilities for a pure state", () => {
    const state = new StateVector([new Complex(0.6), new Complex(0.8)]);
    const rho = pureStateDensityMatrix(state);
    const p0 = computationalBasisDensityMatrix(1, 0);
    const p1 = computationalBasisDensityMatrix(1, 1);
    expect(densityMatrixMeasurementProbability(rho, p0)).toBeCloseTo(state.probabilities()[0], 9);
    expect(densityMatrixMeasurementProbability(rho, p1)).toBeCloseTo(state.probabilities()[1], 9);
  });

  it("probabilities for all outcomes sum to 1", () => {
    const rho = maximallyMixedState(2);
    const p0 = computationalBasisDensityMatrix(1, 0);
    const p1 = computationalBasisDensityMatrix(1, 1);
    expect(
      densityMatrixMeasurementProbability(rho, p0) + densityMatrixMeasurementProbability(rho, p1)
    ).toBeCloseTo(1, 9);
  });

  it("collapsing the maximally mixed state onto |0> gives exactly |0><0|", () => {
    const rho = maximallyMixedState(2);
    const p0 = computationalBasisDensityMatrix(1, 0);
    const collapsed = densityMatrixCollapse(rho, p0);
    expect(collapsed.equals(p0, 1e-9)).toBe(true);
  });

  it("collapse of a pure state matches StateVector collapse", () => {
    const plus = new StateVector([new Complex(sqrt1_2), new Complex(sqrt1_2)]);
    const rho = pureStateDensityMatrix(plus);
    const p0 = computationalBasisDensityMatrix(1, 0);
    const collapsed = densityMatrixCollapse(rho, p0);
    // Should be exactly |0><0| (the state collapses to |0>, up to global phase which doesn't affect rho).
    expect(collapsed.equals(p0, 1e-9)).toBe(true);
  });

  it("throws when collapsing onto a zero-probability outcome", () => {
    const rho = computationalBasisDensityMatrix(1, 0);
    const p1 = computationalBasisDensityMatrix(1, 1);
    expect(() => densityMatrixCollapse(rho, p1)).toThrow(/zero probability/);
  });
});

describe("evolveDensityMatrix", () => {
  it("matches StateVector evolution for a pure state, under X", () => {
    const state = StateVector.zero(1);
    const rho = pureStateDensityMatrix(state);
    const evolvedRho = evolveDensityMatrix(rho, PAULI_X);
    const evolvedState = state.applyMatrix(PAULI_X);
    expect(evolvedRho.equals(pureStateDensityMatrix(evolvedState), 1e-9)).toBe(true);
  });

  it("preserves trace", () => {
    const rho = maximallyMixedState(2);
    const evolved = evolveDensityMatrix(rho, HADAMARD);
    expect(evolved.trace().re).toBeCloseTo(1, 9);
  });

  it("preserves Hermiticity", () => {
    const rho = convexCombination([
      { probability: 0.4, density: computationalBasisDensityMatrix(1, 0) },
      { probability: 0.6, density: pureStateDensityMatrix(new StateVector([new Complex(sqrt1_2), new Complex(sqrt1_2)])) },
    ]);
    expect(evolveDensityMatrix(rho, HADAMARD).isHermitian()).toBe(true);
  });

  it("preserves purity", () => {
    const rho = pureStateDensityMatrix(new StateVector([new Complex(sqrt1_2), new Complex(sqrt1_2)]));
    expect(purity(evolveDensityMatrix(rho, PAULI_Y))).toBeCloseTo(1, 9);

    const mixed = convexCombination([
      { probability: 0.3, density: computationalBasisDensityMatrix(1, 0) },
      { probability: 0.7, density: computationalBasisDensityMatrix(1, 1) },
    ]);
    const purityBefore = purity(mixed);
    const purityAfter = purity(evolveDensityMatrix(mixed, HADAMARD));
    expect(purityAfter).toBeCloseTo(purityBefore, 9);
  });

  it("preserves entropy", () => {
    const mixed = convexCombination([
      { probability: 0.25, density: computationalBasisDensityMatrix(1, 0) },
      { probability: 0.75, density: computationalBasisDensityMatrix(1, 1) },
    ]);
    const entropyBefore = vonNeumannEntropy(mixed);
    const entropyAfter = vonNeumannEntropy(evolveDensityMatrix(mixed, HADAMARD));
    expect(entropyAfter).toBeCloseTo(entropyBefore, 9);
  });
});
