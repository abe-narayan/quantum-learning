export { formatAmplitudeLatex } from "@/lib/quantum/format";

export function formatNumber(value: number, digits = 2): string {
  return value.toFixed(digits);
}

export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}
