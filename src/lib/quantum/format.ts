import type { Matrix } from "./matrix";

/** Structurally satisfied by `Complex` and by any plain `{re, im}` data (e.g. after crossing a Server→Client boundary). */
export type ComplexLike = { re: number; im: number };

/** Formats a complex amplitude as a LaTeX-safe string, e.g. "0.71", "-0.50i", "0.50 + 0.50i". */
export function formatAmplitudeLatex(value: ComplexLike, digits = 2): string {
  const epsilon = 5 * 10 ** -(digits + 1);
  // Snap a component that rounds to zero all the way to zero *before*
  // formatting it. `toFixed` keeps the sign of a negative number that rounds
  // to zero, so a float which is zero to within rounding but happens to be
  // slightly negative printed as "-0.00" — a state-vector row claiming a
  // negative amplitude for what is exactly zero, next to another zero printed
  // as "0.00". Not hypothetical: an ordinary H, CNOT, T, T, H, S, Y, H
  // sequence in the Circuit Builder leaves amplitudes at -5.6e-17, and its
  // table showed those two zeros differently.
  const re = Math.abs(value.re) < epsilon ? 0 : value.re;
  const im = Math.abs(value.im) < epsilon ? 0 : value.im;

  if (im === 0) return re.toFixed(digits);
  if (re === 0) return `${im.toFixed(digits)}i`;

  const sign = im >= 0 ? "+" : "-";
  return `${re.toFixed(digits)} ${sign} ${Math.abs(im).toFixed(digits)}i`;
}

/** Formats a matrix as a LaTeX `pmatrix`, entry by entry, using `formatAmplitudeLatex`. */
export function formatMatrixLatex(matrix: Matrix, digits = 2): string {
  const rows = Array.from({ length: matrix.rows }, (_, row) =>
    Array.from({ length: matrix.cols }, (_, col) => formatAmplitudeLatex(matrix.get(row, col), digits)).join(" & ")
  );
  return `\\begin{pmatrix} ${rows.join(" \\\\ ")} \\end{pmatrix}`;
}
