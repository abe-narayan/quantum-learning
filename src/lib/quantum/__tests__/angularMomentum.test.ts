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

describe("the angular momentum algebra itself", () => {
  // The six matrix elements above check *construction*; these check the
  // defining relations the construction is supposed to satisfy. They are
  // what would catch a wrong ladder coefficient, a wrong basis ordering, or
  // a sign slip in Jy's 1/(2i) — none of which the j=1/2 Pauli comparisons
  // can see, since at j=1/2 almost every coefficient is 1.
  it("obeys [Jx, Jy] = iJz for every implemented j", () => {
    for (const j of [0.5, 1, 1.5, 2, 2.5, 3]) {
      const expected = angularMomentumZ(j).scale(new Complex(0, 1));
      const actual = commutator(angularMomentumX(j), angularMomentumY(j));
      expect(maxDiff(actual, expected), `j=${j}`).toBeLessThan(1e-9);
    }
  });

  it("obeys [Jy, Jz] = iJx and [Jz, Jx] = iJy, the other two cyclic relations", () => {
    for (const j of [0.5, 1, 1.5, 2]) {
      expect(
        maxDiff(commutator(angularMomentumY(j), angularMomentumZ(j)), angularMomentumX(j).scale(new Complex(0, 1))),
        `[Jy,Jz] at j=${j}`
      ).toBeLessThan(1e-9);
      expect(
        maxDiff(commutator(angularMomentumZ(j), angularMomentumX(j)), angularMomentumY(j).scale(new Complex(0, 1))),
        `[Jz,Jx] at j=${j}`
      ).toBeLessThan(1e-9);
    }
  });

  it("gives J² = j(j+1)I exactly, for every implemented j", () => {
    for (const j of [0.5, 1, 1.5, 2, 2.5, 3]) {
      const dimension = Math.round(2 * j + 1);
      const expected = Matrix.identity(dimension).scale(j * (j + 1));
      expect(maxDiff(totalAngularMomentumSquared(j), expected), `j=${j}`).toBeLessThan(1e-9);
    }
  });

  it("makes Jx, Jy and Jz Hermitian, so each is a genuine observable", () => {
    for (const j of [0.5, 1, 1.5, 2, 2.5]) {
      expect(angularMomentumX(j).isHermitian(1e-12), `Jx at j=${j}`).toBe(true);
      expect(angularMomentumY(j).isHermitian(1e-12), `Jy at j=${j}`).toBe(true);
      expect(angularMomentumZ(j).isHermitian(1e-12), `Jz at j=${j}`).toBe(true);
    }
  });

  it("makes J- the adjoint of J+, as the ladder operators of a Hermitian algebra must be", () => {
    for (const j of [0.5, 1, 1.5, 2]) {
      expect(maxDiff(angularMomentumRaising(j).dagger(), angularMomentumLowering(j)), `j=${j}`).toBeLessThan(1e-12);
    }
  });

  it("commutes J² with Jz, the statement that j and m are simultaneously measurable", () => {
    for (const j of [0.5, 1, 1.5, 2]) {
      const zero = Matrix.zeros(Math.round(2 * j + 1), Math.round(2 * j + 1));
      expect(maxDiff(commutator(totalAngularMomentumSquared(j), angularMomentumZ(j)), zero), `j=${j}`).toBeLessThan(1e-9);
    }
  });
});
