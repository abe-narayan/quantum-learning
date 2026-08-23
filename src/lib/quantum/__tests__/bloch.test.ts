import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { StateVector } from "../state";
import { stateToBlochVector, stateToBlochAngles, blochStateFromAngles, densityMatrixToBlochVector } from "../bloch";
import { Matrix } from "../matrix";
import { pureStateDensityMatrix, maximallyMixedState, convexCombination } from "../densityMatrix";

function expectVector(actual: { x: number; y: number; z: number }, expected: { x: number; y: number; z: number }) {
  expect(actual.x).toBeCloseTo(expected.x, 9);
  expect(actual.y).toBeCloseTo(expected.y, 9);
  expect(actual.z).toBeCloseTo(expected.z, 9);
}

describe("stateToBlochVector", () => {
  it("maps |0⟩ and |1⟩ to the poles", () => {
    expectVector(stateToBlochVector(StateVector.basis(1, 0)), { x: 0, y: 0, z: 1 });
    expectVector(stateToBlochVector(StateVector.basis(1, 1)), { x: 0, y: 0, z: -1 });
  });

  it("maps |+⟩, |-⟩, |+i⟩, |-i⟩ to the equator", () => {
    const s = Math.SQRT1_2;
    const plus = new StateVector([new Complex(s), new Complex(s)]);
    const minus = new StateVector([new Complex(s), new Complex(-s)]);
    const plusI = new StateVector([new Complex(s), new Complex(0, s)]);
    const minusI = new StateVector([new Complex(s), new Complex(0, -s)]);

    expectVector(stateToBlochVector(plus), { x: 1, y: 0, z: 0 });
    expectVector(stateToBlochVector(minus), { x: -1, y: 0, z: 0 });
    expectVector(stateToBlochVector(plusI), { x: 0, y: 1, z: 0 });
    expectVector(stateToBlochVector(minusI), { x: 0, y: -1, z: 0 });
  });

  it("is invariant under a global phase", () => {
    const base = blochStateFromAngles({ theta: 0.9, phi: 1.7 });
    const phased = new StateVector(base.amplitudes.map((a) => a.mul(Complex.fromPolar(1, 0.42))));

    expectVector(stateToBlochVector(phased), stateToBlochVector(base));
  });
});

describe("densityMatrixToBlochVector", () => {
  it("agrees with stateToBlochVector for pure states", () => {
    const state = blochStateFromAngles({ theta: 0.9, phi: 1.7 });
    const rho = pureStateDensityMatrix(state);
    expectVector(densityMatrixToBlochVector(rho), stateToBlochVector(state));
  });

  it("maps the maximally mixed state to the origin", () => {
    expectVector(densityMatrixToBlochVector(maximallyMixedState(2)), { x: 0, y: 0, z: 0 });
  });

  it("is the probability-weighted average of the components' Bloch vectors for a mixture", () => {
    const zero = pureStateDensityMatrix(StateVector.basis(1, 0));
    const plus = pureStateDensityMatrix(blochStateFromAngles({ theta: Math.PI / 2, phi: 0 }));
    const mixed = convexCombination([
      { probability: 0.3, density: zero },
      { probability: 0.7, density: plus },
    ]);
    const expected = { x: 0.7 * 1, y: 0, z: 0.3 * 1 };
    expectVector(densityMatrixToBlochVector(mixed), expected);
  });

  it("throws for a non-2x2 matrix", () => {
    expect(() => densityMatrixToBlochVector(Matrix.identity(4))).toThrow(/2x2/);
  });
});

describe("blochStateFromAngles / stateToBlochAngles round-trip", () => {
  const cases: Array<{ theta: number; phi: number }> = [
    { theta: 0, phi: 0 },
    { theta: Math.PI, phi: 0 },
    { theta: Math.PI / 2, phi: 0 },
    { theta: Math.PI / 2, phi: Math.PI / 2 },
    { theta: Math.PI / 2, phi: Math.PI },
    { theta: 1.234, phi: 5.6 },
  ];

  for (const { theta, phi } of cases) {
    it(`round-trips theta=${theta.toFixed(3)}, phi=${phi.toFixed(3)}`, () => {
      const state = blochStateFromAngles({ theta, phi });
      const recovered = stateToBlochAngles(state);

      expect(recovered.theta).toBeCloseTo(theta, 9);

      // At the poles phi is undefined (any value maps to the same point),
      // so only compare phi away from theta = 0 or pi.
      if (theta > 1e-9 && theta < Math.PI - 1e-9) {
        const normalizedExpected = ((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        expect(recovered.phi).toBeCloseTo(normalizedExpected, 9);
      }
    });
  }
});
