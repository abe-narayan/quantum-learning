import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { Matrix, tensorAll } from "../matrix";

describe("Matrix", () => {
  it("multiplies a gate by a state vector correctly (Hadamard on |0>)", () => {
    const h = new Matrix([
      [new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)],
      [new Complex(Math.SQRT1_2), new Complex(-Math.SQRT1_2)],
    ]);
    const ket0 = [new Complex(1), new Complex(0)];
    const result = h.apply(ket0);

    expect(result[0].re).toBeCloseTo(Math.SQRT1_2, 9);
    expect(result[1].re).toBeCloseTo(Math.SQRT1_2, 9);
  });

  it("dagger is the conjugate transpose", () => {
    const m = new Matrix([
      [new Complex(1, 2), new Complex(3, -4)],
      [new Complex(0, 1), new Complex(5, 0)],
    ]);
    const dagger = m.dagger();

    expect(dagger.get(0, 0).equals(new Complex(1, -2))).toBe(true);
    expect(dagger.get(1, 0).equals(new Complex(3, 4))).toBe(true);
    expect(dagger.get(0, 1).equals(new Complex(0, -1))).toBe(true);
    expect(dagger.get(1, 1).equals(new Complex(5, 0))).toBe(true);
  });

  it("tensor product has the right dimensions and values", () => {
    const a = Matrix.identity(2);
    const b = new Matrix([
      [new Complex(0), new Complex(1)],
      [new Complex(1), new Complex(0)],
    ]);
    const product = a.tensor(b);

    expect(product.rows).toBe(4);
    expect(product.cols).toBe(4);
    // I ⊗ X should place X in the top-left and bottom-right 2x2 blocks.
    expect(product.get(0, 1).equals(new Complex(1))).toBe(true);
    expect(product.get(1, 0).equals(new Complex(1))).toBe(true);
    expect(product.get(2, 3).equals(new Complex(1))).toBe(true);
    expect(product.get(3, 2).equals(new Complex(1))).toBe(true);
  });

  it("identity leaves a vector unchanged", () => {
    const identity = Matrix.identity(2);
    const vector = [new Complex(0.6, 0.1), new Complex(-0.3, 0.7)];
    const result = identity.apply(vector);
    expect(result[0].equals(vector[0])).toBe(true);
    expect(result[1].equals(vector[1])).toBe(true);
  });

  it("trace() sums the diagonal", () => {
    const m = new Matrix([
      [new Complex(3, 1), new Complex(0)],
      [new Complex(0), new Complex(-1, -1)],
    ]);
    const trace = m.trace();
    expect(trace.re).toBeCloseTo(2, 9);
    expect(trace.im).toBeCloseTo(0, 9);
  });

  it("trace() throws for a non-square matrix", () => {
    const m = new Matrix([[Complex.ONE, Complex.ZERO]]);
    expect(() => m.trace()).toThrow(/square/);
  });

  it("identity has trace equal to its dimension", () => {
    expect(Matrix.identity(4).trace().equals(new Complex(4))).toBe(true);
  });

  it("isHermitian() is true for Pauli-Z and false for a non-Hermitian matrix", () => {
    const z = new Matrix([
      [new Complex(1), Complex.ZERO],
      [Complex.ZERO, new Complex(-1)],
    ]);
    expect(z.isHermitian()).toBe(true);

    const notHermitian = new Matrix([
      [new Complex(1), new Complex(2)],
      [new Complex(0), new Complex(1)],
    ]);
    expect(notHermitian.isHermitian()).toBe(false);
  });

  it("isHermitian() is false for a non-square matrix", () => {
    const m = new Matrix([[Complex.ONE, Complex.ZERO]]);
    expect(m.isHermitian()).toBe(false);
  });

  it("mul() throws when the inner dimensions don't match", () => {
    const a = new Matrix([[Complex.ONE, Complex.ZERO]]); // 1x2
    const b = new Matrix([[Complex.ONE, Complex.ZERO]]); // 1x2, needs 2 rows to multiply
    expect(() => a.mul(b)).toThrow(/1x2.*1x2/);
  });

  it("apply() throws when the vector length doesn't match the matrix's column count", () => {
    const m = Matrix.identity(2);
    expect(() => m.apply([Complex.ONE, Complex.ZERO, Complex.ZERO])).toThrow(/length-3/);
  });

  it("add() throws for mismatched shapes", () => {
    const a = Matrix.identity(2);
    const b = Matrix.identity(3);
    expect(() => a.add(b)).toThrow(/shape/);
  });

  it("zeros() creates a matrix of the requested shape with every entry 0", () => {
    const z = Matrix.zeros(2, 3);
    expect(z.rows).toBe(2);
    expect(z.cols).toBe(3);
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        expect(z.get(r, c).equals(Complex.ZERO)).toBe(true);
      }
    }
  });

  it("equals() is false for matrices of different shapes, even with matching leading entries", () => {
    const a = Matrix.identity(2);
    const b = new Matrix([
      [Complex.ONE, Complex.ZERO, Complex.ZERO],
      [Complex.ZERO, Complex.ONE, Complex.ZERO],
    ]);
    expect(a.equals(b)).toBe(false);
  });

  it("tensorAll() throws for an empty list", () => {
    expect(() => tensorAll([])).toThrow(/at least one/);
  });

  it("tensorAll() of three matrices matches chained .tensor() calls, in order", () => {
    const x = new Matrix([
      [Complex.ZERO, Complex.ONE],
      [Complex.ONE, Complex.ZERO],
    ]);
    const z = new Matrix([
      [Complex.ONE, Complex.ZERO],
      [Complex.ZERO, new Complex(-1)],
    ]);
    const expected = Matrix.identity(2).tensor(x).tensor(z);
    const actual = tensorAll([Matrix.identity(2), x, z]);
    expect(actual.equals(expected)).toBe(true);
  });
});
