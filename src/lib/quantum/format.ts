import type { Complex } from "./complex";
import type { Matrix } from "./matrix";

/** Formats a complex amplitude as a LaTeX-safe string, e.g. "0.71", "-0.50i", "0.50 + 0.50i". */
export function formatAmplitudeLatex(value: Complex, digits = 2): string {
  const re = value.re;
  const im = value.im;
  const epsilon = 5 * 10 ** -(digits + 1);

  if (Math.abs(im) < epsilon) return re.toFixed(digits);
  if (Math.abs(re) < epsilon) return `${im.toFixed(digits)}i`;

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
