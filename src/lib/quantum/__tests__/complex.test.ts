import { describe, expect, it } from "vitest";
import { Complex } from "../complex";

describe("Complex", () => {
  it("adds and multiplies correctly", () => {
    const a = new Complex(1, 2);
    const b = new Complex(3, -1);

    const sum = a.add(b);
    expect(sum.re).toBeCloseTo(4, 9);
    expect(sum.im).toBeCloseTo(1, 9);

    const product = a.mul(b);
    expect(product.re).toBeCloseTo(5, 9); // (1*3 - 2*-1)
    expect(product.im).toBeCloseTo(5, 9); // (1*-1 + 2*3)
  });

  it("conjugate negates the imaginary part only", () => {
    const a = new Complex(3, -4);
    const conj = a.conjugate();
    expect(conj.re).toBeCloseTo(3, 9);
    expect(conj.im).toBeCloseTo(4, 9);
  });

  it("magnitude matches the Pythagorean length", () => {
    expect(new Complex(3, 4).magnitude()).toBeCloseTo(5, 9);
    expect(new Complex(3, 4).magnitudeSquared()).toBeCloseTo(25, 9);
  });

  it("fromPolar round-trips through magnitude and phase", () => {
    const original = Complex.fromPolar(2, Math.PI / 3);
    expect(original.magnitude()).toBeCloseTo(2, 9);
    expect(original.phase()).toBeCloseTo(Math.PI / 3, 9);
  });
});
