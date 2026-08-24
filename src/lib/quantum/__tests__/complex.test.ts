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

  it("sub is the inverse of add", () => {
    const a = new Complex(5, -2);
    const b = new Complex(1.5, 3);
    expect(a.add(b).sub(b).equals(a)).toBe(true);
    expect(a.sub(b).re).toBeCloseTo(3.5, 9);
    expect(a.sub(b).im).toBeCloseTo(-5, 9);
  });

  it("div is the inverse of mul: (a * b) / b == a", () => {
    const a = new Complex(2, 3);
    const b = new Complex(-1, 4);
    const roundTripped = a.mul(b).div(b);
    expect(roundTripped.equals(a, 1e-9)).toBe(true);
  });

  it("div matches the textbook formula for a known case: (1+i)/(1-i) = i", () => {
    const result = new Complex(1, 1).div(new Complex(1, -1));
    expect(result.equals(Complex.I)).toBe(true);
  });

  it("equals respects the epsilon boundary", () => {
    const a = new Complex(1, 1);
    // Just inside a 1e-3 epsilon.
    expect(a.equals(new Complex(1.0005, 1), 1e-3)).toBe(true);
    // Just outside it.
    expect(a.equals(new Complex(1.005, 1), 1e-3)).toBe(false);
  });

  it("toString formats a pure real number with no imaginary term", () => {
    expect(new Complex(2.5, 0).toString()).toBe("2.500");
  });

  it("toString formats a pure imaginary number with no real term", () => {
    expect(new Complex(0, 3).toString()).toBe("3.000i");
  });

  it("toString formats a mixed number with the correct sign for a negative imaginary part", () => {
    expect(new Complex(1, 2).toString()).toBe("1.000 + 2.000i");
    expect(new Complex(1, -2).toString()).toBe("1.000 - 2.000i");
  });

  it("scale by 0 gives the zero complex number, scale by -1 negates both parts", () => {
    const a = new Complex(3, -4);
    expect(a.scale(0).equals(Complex.ZERO)).toBe(true);
    expect(a.scale(-1).equals(new Complex(-3, 4))).toBe(true);
  });
});
