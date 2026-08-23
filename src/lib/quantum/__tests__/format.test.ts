import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { Matrix } from "../matrix";
import { formatAmplitudeLatex, formatMatrixLatex } from "../format";

describe("formatAmplitudeLatex", () => {
  it("formats a purely real value", () => {
    expect(formatAmplitudeLatex(new Complex(0.5))).toBe("0.50");
  });

  it("formats a purely imaginary value", () => {
    expect(formatAmplitudeLatex(new Complex(0, -0.5))).toBe("-0.50i");
  });

  it("formats a mixed complex value with explicit sign", () => {
    expect(formatAmplitudeLatex(new Complex(0.5, 0.5))).toBe("0.50 + 0.50i");
    expect(formatAmplitudeLatex(new Complex(0.5, -0.5))).toBe("0.50 - 0.50i");
  });
});

describe("formatMatrixLatex", () => {
  it("formats a 2x2 real diagonal matrix as a pmatrix", () => {
    const rho = new Matrix([
      [new Complex(0.5), Complex.ZERO],
      [Complex.ZERO, new Complex(0.5)],
    ]);
    expect(formatMatrixLatex(rho)).toBe("\\begin{pmatrix} 0.50 & 0.00 \\\\ 0.00 & 0.50 \\end{pmatrix}");
  });

  it("formats a matrix with complex off-diagonal entries", () => {
    const m = new Matrix([
      [new Complex(1), new Complex(0, 0.5)],
      [new Complex(0, -0.5), new Complex(0)],
    ]);
    expect(formatMatrixLatex(m)).toBe("\\begin{pmatrix} 1.00 & 0.50i \\\\ -0.50i & 0.00 \\end{pmatrix}");
  });
});
