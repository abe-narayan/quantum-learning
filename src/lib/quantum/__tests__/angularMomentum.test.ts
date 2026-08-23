import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { Matrix } from "../matrix";
import { PAULI_X, PAULI_Y, PAULI_Z } from "../gates";
import { commutator } from "../observables";
import {
  angularMomentumX,
  angularMomentumY,
  angularMomentumZ,
  angularMomentumRaising,
  angularMomentumLowering,
  totalAngularMomentumSquared,
} from "../angularMomentum";

function maxDiff(a: Matrix, b: Matrix): number {
  let m = 0;
  for (let r = 0; r < a.rows; r++) for (let c = 0; c < a.cols; c++) m = Math.max(m, a.get(r, c).sub(b.get(r, c)).magnitude());
  return m;
}

describe("j=1/2 matches (1/2) Pauli matrices exactly", () => {
  it("Jx = X/2", () => {
    expect(maxDiff(angularMomentumX(0.5), PAULI_X.scale(0.5))).toBeLessThan(1e-9);
  });
  it("Jy = Y/2", () => {
    expect(maxDiff(angularMomentumY(0.5), PAULI_Y.scale(0.5))).toBeLessThan(1e-9);
  });
  it("Jz = Z/2", () => {
    expect(maxDiff(angularMomentumZ(0.5), PAULI_Z.scale(0.5))).toBeLessThan(1e-9);
  });
});

describe("commutation relations [Jx,Jy]=iJz (and cyclic)", () => {
  it.each([0.5, 1, 1.5, 2])("holds for j=%s", (j) => {
    const Jx = angularMomentumX(j);
    const Jy = angularMomentumY(j);
    const Jz = angularMomentumZ(j);
    const lhs = commutator(Jx, Jy);
    let diff = 0;
    for (let r = 0; r < Jz.rows; r++)
      for (let c = 0; c < Jz.cols; c++) diff = Math.max(diff, lhs.get(r, c).sub(Jz.get(r, c).mul(Complex.I)).magnitude());
    expect(diff).toBeLessThan(1e-9);
  });
});

describe("J^2 = j(j+1)I", () => {
  it.each([0.5, 1, 1.5, 2, 2.5])("holds for j=%s", (j) => {
    const j2 = totalAngularMomentumSquared(j);
    for (let r = 0; r < j2.rows; r++) {
      for (let c = 0; c < j2.cols; c++) {
        const expected = r === c ? j * (j + 1) : 0;
        expect(j2.get(r, c).re).toBeCloseTo(expected, 8);
        expect(j2.get(r, c).im).toBeCloseTo(0, 8);
      }
    }
  });
});

describe("raising/lowering operators", () => {
  it("J+ acting on the top state (m=j) gives zero", () => {
    const jPlus = angularMomentumRaising(1);
    // top state m=j is index 0 in this module's descending-m basis
    const top = [Complex.ONE, Complex.ZERO, Complex.ZERO];
    const result = jPlus.apply(top);
    for (const amp of result) expect(amp.magnitude()).toBeLessThan(1e-9);
  });

  it("J- acting on the bottom state (m=-j) gives zero", () => {
    const jMinus = angularMomentumLowering(1);
    const bottom = [Complex.ZERO, Complex.ZERO, Complex.ONE];
    const result = jMinus.apply(bottom);
    for (const amp of result) expect(amp.magnitude()).toBeLessThan(1e-9);
  });

  it("Jx = (J+ + J-)/2 exactly, by construction", () => {
    const j = 1;
    const sum = angularMomentumRaising(j).add(angularMomentumLowering(j)).scale(0.5);
    expect(maxDiff(sum, angularMomentumX(j))).toBeLessThan(1e-9);
  });
});
