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

  /**
   * `toFixed` keeps the sign of a negative number that rounds to zero, so a
   * component that is zero to within display precision but happens to carry a
   * minus sign printed as "-0.00": a state-vector row claiming a negative
   * amplitude for an amplitude that is exactly zero, alongside another zero
   * printed as "0.00". Reachable from ordinary use: an H, CNOT, T, T, H, S,
   * Y, H sequence in the Circuit Builder leaves real parts at -5.6e-17.
   */
  it("never renders a rounds-to-zero component with a leading minus sign", () => {
    expect(formatAmplitudeLatex(new Complex(-5.551115123125784e-17, 0))).toBe("0.00");
    expect(formatAmplitudeLatex(new Complex(-0, 0))).toBe("0.00");
    expect(formatAmplitudeLatex(new Complex(0, -1e-15))).toBe("0.00");
    expect(formatAmplitudeLatex(new Complex(-1e-15, -0.5))).toBe("-0.50i");
    expect(formatAmplitudeLatex(new Complex(-0.5, -1e-15))).toBe("-0.50");
    // Values that genuinely round to a nonzero figure keep their sign.
    expect(formatAmplitudeLatex(new Complex(-0.006, 0))).toBe("-0.01");
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
