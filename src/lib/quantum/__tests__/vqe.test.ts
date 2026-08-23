import { describe, expect, it } from "vitest";
import { PAULI_X, PAULI_Z } from "../gates";
import { ansatzState, costFunction, exactGroundStateEnergy, runVqe } from "../vqe";

describe("ansatzState / costFunction", () => {
  it("theta=0 gives |0>, matching Rz(phi)|0> up to global phase", () => {
    const state = ansatzState({ theta: 0, phi: 0.7 });
    expect(state.probabilities()[0]).toBeCloseTo(1, 9);
  });

  it("costFunction matches direct expectation value for a known state", () => {
    // theta=pi -> |1>, cost with H=Z should be -1
    const cost = costFunction(PAULI_Z, { theta: Math.PI, phi: 0 });
    expect(cost).toBeCloseTo(-1, 6);
  });
});

describe("exactGroundStateEnergy", () => {
  it("gives -1 for H=Z (eigenvalues +-1)", () => {
    expect(exactGroundStateEnergy(PAULI_Z)).toBeCloseTo(-1, 9);
  });

  it("gives -sqrt(a^2+b^2) for H=aZ+bX", () => {
    const H = PAULI_Z.scale(0.6).add(PAULI_X.scale(0.8));
    expect(exactGroundStateEnergy(H)).toBeCloseTo(-1, 9); // 0.6^2+0.8^2=1
  });
});

describe("runVqe", () => {
  it("converges to the exact ground state energy for H=Z", () => {
    const result = runVqe(PAULI_Z, 60);
    expect(result.energy).toBeCloseTo(exactGroundStateEnergy(PAULI_Z), 4);
  });

  it("converges to the exact ground state energy for a mixed Pauli Hamiltonian", () => {
    const H = PAULI_Z.scale(1.5).add(PAULI_X.scale(-0.5));
    const result = runVqe(H, 80);
    expect(result.energy).toBeCloseTo(exactGroundStateEnergy(H), 4);
  });

  it("never finds an energy below the true ground state (the variational principle)", () => {
    const H = PAULI_Z.scale(0.3).add(PAULI_X.scale(0.9));
    const exact = exactGroundStateEnergy(H);
    const result = runVqe(H, 60);
    expect(result.energy).toBeGreaterThanOrEqual(exact - 1e-6);
  });

  it("the cost history is non-increasing (the optimizer never accepts a worse point)", () => {
    const H = PAULI_Z.add(PAULI_X);
    const result = runVqe(H, 40);
    for (let i = 1; i < result.history.length; i++) {
      expect(result.history[i]).toBeLessThanOrEqual(result.history[i - 1] + 1e-12);
    }
  });
});
