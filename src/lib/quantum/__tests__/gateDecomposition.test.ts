import { describe, expect, it } from "vitest";
import { PAULI_X, PAULI_Z, S_GATE, T_GATE, HADAMARD, rotationY, rotationZ } from "../gates";
import { Matrix } from "../matrix";
import { matricesEqualUpToGlobalPhase } from "../gateDecomposition";

describe("matricesEqualUpToGlobalPhase: verified native-gate decompositions", () => {
  it("Z = Rz(pi)", () => {
    expect(matricesEqualUpToGlobalPhase(rotationZ(Math.PI), PAULI_Z)).toBe(true);
  });

  it("S = Rz(pi/2)", () => {
    expect(matricesEqualUpToGlobalPhase(rotationZ(Math.PI / 2), S_GATE)).toBe(true);
  });

  it("T = Rz(pi/4)", () => {
    expect(matricesEqualUpToGlobalPhase(rotationZ(Math.PI / 4), T_GATE)).toBe(true);
  });

  it("H = Ry(pi/2) Rz(pi)", () => {
    const composed = rotationY(Math.PI / 2).mul(rotationZ(Math.PI));
    expect(matricesEqualUpToGlobalPhase(composed, HADAMARD)).toBe(true);
  });

  it("X = Rz(pi) Ry(pi)", () => {
    const composed = rotationZ(Math.PI).mul(rotationY(Math.PI));
    expect(matricesEqualUpToGlobalPhase(composed, PAULI_X)).toBe(true);
  });
});

describe("matricesEqualUpToGlobalPhase: negative cases", () => {
  it("returns false for genuinely different gates", () => {
    expect(matricesEqualUpToGlobalPhase(PAULI_X, PAULI_Z)).toBe(false);
  });

  it("returns false for matrices of different dimension", () => {
    expect(matricesEqualUpToGlobalPhase(PAULI_X, Matrix.identity(4))).toBe(false);
  });

  it("returns true for a matrix compared to itself", () => {
    expect(matricesEqualUpToGlobalPhase(HADAMARD, HADAMARD)).toBe(true);
  });

  it("returns true for the zero matrix compared to itself", () => {
    expect(matricesEqualUpToGlobalPhase(Matrix.zeros(2, 2), Matrix.zeros(2, 2))).toBe(true);
  });
});
