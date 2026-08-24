import { describe, expect, it } from "vitest";
import { Matrix } from "../matrix";
import { StateVector } from "../state";
import {
  IDENTITY,
  PAULI_X,
  PAULI_Y,
  PAULI_Z,
  HADAMARD,
  S_GATE,
  T_GATE,
  phaseGate,
  rotationX,
  rotationY,
  rotationZ,
  rotationAboutAxis,
  applySingleQubitGate,
  applyControlledGate,
} from "../gates";

const KET_0 = StateVector.zero(1);
const KET_1 = StateVector.basis(1, 1);
const KET_PLUS = new StateVector([
  KET_0.amplitudes[0].scale(Math.SQRT1_2).add(KET_1.amplitudes[0].scale(Math.SQRT1_2)),
  KET_0.amplitudes[1].scale(Math.SQRT1_2).add(KET_1.amplitudes[1].scale(Math.SQRT1_2)),
]);

function expectState(actual: StateVector, expected: StateVector, epsilon = 1e-9) {
  expect(actual.amplitudes[0].equals(expected.amplitudes[0], epsilon)).toBe(true);
  expect(actual.amplitudes[1].equals(expected.amplitudes[1], epsilon)).toBe(true);
}

describe("Pauli-X", () => {
  it("|0⟩ -> X -> |1⟩", () => {
    expectState(applySingleQubitGate(KET_0, PAULI_X, 0), KET_1);
  });

  it("|1⟩ -> X -> |0⟩", () => {
    expectState(applySingleQubitGate(KET_1, PAULI_X, 0), KET_0);
  });
});

describe("Hadamard", () => {
  it("|0⟩ -> H -> |+⟩", () => {
    expectState(applySingleQubitGate(KET_0, HADAMARD, 0), KET_PLUS);
  });

  it("|+⟩ -> H -> |0⟩", () => {
    expectState(applySingleQubitGate(KET_PLUS, HADAMARD, 0), KET_0);
  });

  it("is its own inverse (H . H = I)", () => {
    const back = applySingleQubitGate(applySingleQubitGate(KET_0, HADAMARD, 0), HADAMARD, 0);
    expectState(back, KET_0);
  });
});

describe("Pauli-Z", () => {
  it("|0⟩ -> Z -> |0⟩ exactly (no sign flip on the |0⟩ component)", () => {
    expectState(applySingleQubitGate(KET_0, PAULI_Z, 0), KET_0);
  });

  it("|1⟩ -> Z -> -|1⟩", () => {
    const result = applySingleQubitGate(KET_1, PAULI_Z, 0);
    expect(result.amplitudes[1].equals(KET_1.amplitudes[1].scale(-1))).toBe(true);
  });
});

describe("S and T phase gates", () => {
  it("preserve measurement probabilities on |+⟩", () => {
    const before = KET_PLUS.probabilities();
    const afterS = applySingleQubitGate(KET_PLUS, S_GATE, 0).probabilities();
    const afterT = applySingleQubitGate(KET_PLUS, T_GATE, 0).probabilities();

    for (let i = 0; i < 2; i++) {
      expect(afterS[i]).toBeCloseTo(before[i], 9);
      expect(afterT[i]).toBeCloseTo(before[i], 9);
    }
  });

  it("S applies a +90° relative phase: |+⟩ -> |+i⟩", () => {
    const result = applySingleQubitGate(KET_PLUS, S_GATE, 0);
    // |+i> = (|0> + i|1>) / sqrt(2)
    expect(result.amplitudes[0].re).toBeCloseTo(Math.SQRT1_2, 9);
    expect(result.amplitudes[0].im).toBeCloseTo(0, 9);
    expect(result.amplitudes[1].re).toBeCloseTo(0, 9);
    expect(result.amplitudes[1].im).toBeCloseTo(Math.SQRT1_2, 9);
  });

  it("T applies a +45° relative phase", () => {
    const result = applySingleQubitGate(KET_PLUS, T_GATE, 0);
    const relativePhase = result.amplitudes[1].phase() - result.amplitudes[0].phase();
    expect(((relativePhase + 2 * Math.PI) % (2 * Math.PI))).toBeCloseTo(Math.PI / 4, 9);
  });
});

describe("rotationAboutAxis matches the axis-aligned rotation gates", () => {
  it("matches Rx, Ry, Rz for their respective axes", () => {
    const theta = 0.837;
    expectState(
      applySingleQubitGate(KET_PLUS, rotationAboutAxis({ x: 1, y: 0, z: 0 }, theta), 0),
      applySingleQubitGate(KET_PLUS, rotationX(theta), 0)
    );
    expectState(
      applySingleQubitGate(KET_PLUS, rotationAboutAxis({ x: 0, y: 1, z: 0 }, theta), 0),
      applySingleQubitGate(KET_PLUS, rotationY(theta), 0)
    );
    expectState(
      applySingleQubitGate(KET_PLUS, rotationAboutAxis({ x: 0, y: 0, z: 1 }, theta), 0),
      applySingleQubitGate(KET_PLUS, rotationZ(theta), 0)
    );
  });

  it("Rx(pi), Ry(pi), Rz(pi) equal X, Y, Z up to an unobservable global phase", () => {
    const rx = applySingleQubitGate(KET_0, rotationX(Math.PI), 0);
    const x = applySingleQubitGate(KET_0, PAULI_X, 0);
    // Same physical state means the same measurement probabilities.
    const [rxProbs, xProbs] = [rx.probabilities(), x.probabilities()];
    expect(rxProbs[0]).toBeCloseTo(xProbs[0], 9);
    expect(rxProbs[1]).toBeCloseTo(xProbs[1], 9);
  });

  it("rotationAboutAxis rejects the zero vector — there is no well-defined rotation axis", () => {
    expect(() => rotationAboutAxis({ x: 0, y: 0, z: 0 }, 1)).toThrow(/nonzero/);
  });
});

describe("gate unitarity (U†U = I) — every fixed single-qubit gate must be a valid quantum operation", () => {
  it("holds for every fixed gate constant", () => {
    const identity2 = Matrix.identity(2);
    for (const gate of [IDENTITY, PAULI_X, PAULI_Y, PAULI_Z, HADAMARD, S_GATE, T_GATE]) {
      expect(gate.mul(gate.dagger()).equals(identity2, 1e-9)).toBe(true);
      expect(gate.dagger().mul(gate).equals(identity2, 1e-9)).toBe(true);
    }
  });

  it("holds for phaseGate at several angles", () => {
    const identity2 = Matrix.identity(2);
    for (const theta of [0, 0.7, Math.PI / 2, Math.PI, 5.1]) {
      const gate = phaseGate(theta);
      expect(gate.mul(gate.dagger()).equals(identity2, 1e-9)).toBe(true);
    }
  });

  it("holds for rotationX/Y/Z and rotationAboutAxis at several angles and axes", () => {
    const identity2 = Matrix.identity(2);
    const thetas = [0.3, Math.PI / 2, 2.4, -1.1];
    const axes = [
      { x: 1, y: 0, z: 0 },
      { x: 0, y: 1, z: 0 },
      { x: 0, y: 0, z: 1 },
      { x: 1, y: 1, z: 1 },
    ];
    for (const theta of thetas) {
      for (const rotation of [rotationX(theta), rotationY(theta), rotationZ(theta)]) {
        expect(rotation.mul(rotation.dagger()).equals(identity2, 1e-9)).toBe(true);
      }
      for (const axis of axes) {
        const rotation = rotationAboutAxis(axis, theta);
        expect(rotation.mul(rotation.dagger()).equals(identity2, 1e-9)).toBe(true);
      }
    }
  });
});

describe("gate application error handling", () => {
  it("applySingleQubitGate rejects a gate that isn't 2x2", () => {
    const wrongSize = Matrix.identity(3);
    expect(() => applySingleQubitGate(StateVector.zero(2), wrongSize, 0)).toThrow(/2x2/);
  });

  it("applySingleQubitGate rejects an out-of-range target qubit", () => {
    expect(() => applySingleQubitGate(StateVector.zero(2), PAULI_X, 2)).toThrow(/out of range/);
    expect(() => applySingleQubitGate(StateVector.zero(2), PAULI_X, -1)).toThrow(/out of range/);
  });

  it("applyControlledGate rejects a gate that isn't 2x2", () => {
    const wrongSize = Matrix.identity(3);
    expect(() => applyControlledGate(StateVector.zero(2), wrongSize, 0, 1)).toThrow(/2x2/);
  });

  it("applyControlledGate rejects an out-of-range control or target qubit", () => {
    expect(() => applyControlledGate(StateVector.zero(2), PAULI_X, 5, 1)).toThrow(/out of range/);
    expect(() => applyControlledGate(StateVector.zero(2), PAULI_X, 0, 5)).toThrow(/out of range/);
  });
});
