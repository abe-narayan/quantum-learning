import { Complex } from "./complex";
import { Matrix } from "./matrix";

/**
 * General angular momentum operators for a fixed spin quantum number j
 * (j=0, 1/2, 1, 3/2, ...), built directly from the standard ladder-operator
 * matrix elements — the same "matrix representation of an abstract
 * operator algebra" approach already used for the harmonic oscillator's
 * ladder operators (`harmonicOscillator.ts`), applied here to angular
 * momentum instead of energy. Basis order is m = j, j-1, ..., -j (largest
 * first), a fixed convention used consistently across every function here.
 */

function basisM(j: number): number[] {
  const dim = Math.round(2 * j + 1);
  return Array.from({ length: dim }, (_, i) => j - i);
}

/** Jz, diagonal with eigenvalues m·ħ (ħ=1, this platform's convention — see angularMomentumOperators' doc comment). */
export function angularMomentumZ(j: number): Matrix {
  const ms = basisM(j);
  const dim = ms.length;
  const data = Array.from({ length: dim }, (_, row) =>
    Array.from({ length: dim }, (_, col) => (row === col ? new Complex(ms[row]) : Complex.ZERO))
  );
  return new Matrix(data);
}

/** J+ (raising) and J- (lowering), via ⟨j,m±1|J±|j,m⟩=√(j(j+1)-m(m±1)). */
export function angularMomentumRaising(j: number): Matrix {
  const ms = basisM(j);
  const dim = ms.length;
  const data = Array.from({ length: dim }, () => Array.from({ length: dim }, () => Complex.ZERO));
  for (let col = 1; col < dim; col++) {
    const m = ms[col]; // acting on |j,m>, raises to |j,m+1>, which is at row = col-1 (since basis is descending in m)
    const coeff = Math.sqrt(j * (j + 1) - m * (m + 1));
    data[col - 1][col] = new Complex(coeff);
  }
  return new Matrix(data);
}

export function angularMomentumLowering(j: number): Matrix {
  const ms = basisM(j);
  const dim = ms.length;
  const data = Array.from({ length: dim }, () => Array.from({ length: dim }, () => Complex.ZERO));
  for (let col = 0; col < dim - 1; col++) {
    const m = ms[col]; // lowers |j,m> to |j,m-1>, at row = col+1
    const coeff = Math.sqrt(j * (j + 1) - m * (m - 1));
    data[col + 1][col] = new Complex(coeff);
  }
  return new Matrix(data);
}

/** Jx = (J+ + J-)/2, Jy = (J+ - J-)/(2i) — derived from the ladder operators, not independently defined. */
export function angularMomentumX(j: number): Matrix {
  const plus = angularMomentumRaising(j);
  const minus = angularMomentumLowering(j);
  return plus.add(minus).scale(0.5);
}

export function angularMomentumY(j: number): Matrix {
  const plus = angularMomentumRaising(j);
  const minus = angularMomentumLowering(j);
  const diff = plus.add(minus.scale(-1));
  // divide by 2i == multiply by 1/(2i) = -i/2
  const negIOverTwo = new Complex(0, -0.5);
  const dim = diff.rows;
  const data = Array.from({ length: dim }, (_, r) => Array.from({ length: dim }, (_, c) => diff.get(r, c).mul(negIOverTwo)));
  return new Matrix(data);
}

/** J² = Jx²+Jy²+Jz² — should equal j(j+1)·I exactly, for any j (checked directly in this module's tests, not just asserted). */
export function totalAngularMomentumSquared(j: number): Matrix {
  const jx = angularMomentumX(j);
  const jy = angularMomentumY(j);
  const jz = angularMomentumZ(j);
  return jx.mul(jx).add(jy.mul(jy)).add(jz.mul(jz));
}
