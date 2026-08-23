import type { Complex } from "./complex";

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
