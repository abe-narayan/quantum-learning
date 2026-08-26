import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { StateVector } from "../state";
import {
  encodeBitFlipCode,
  decodeBitFlipSyndrome,
  runBitFlipCorrectionCycle,
  applyBitFlipError,
  applyBitFlipErrors,
  encodePhaseFlipCode,
  runPhaseFlipCorrectionCycle,
  applyPhaseFlipError,
  applyPhaseFlipErrors,
} from "../errorCorrection";

const alpha = new Complex(0.6);
const beta = new Complex(0.8);

function maxDiff(a: readonly Complex[], b: readonly Complex[]): number {
  return Math.max(...a.map((v, i) => v.sub(b[i]).magnitude()));
}

describe("encodeBitFlipCode", () => {
  it("puts amplitude alpha on |000> and beta on |111>", () => {
    const s = encodeBitFlipCode(alpha, beta);
    expect(s.amplitudes[0].re).toBeCloseTo(0.6, 9);
    expect(s.amplitudes[7].re).toBeCloseTo(0.8, 9);
    for (const i of [1, 2, 3, 4, 5, 6]) expect(s.amplitudes[i].magnitude()).toBeLessThan(1e-9);
  });
});

describe("decodeBitFlipSyndrome", () => {
  it("maps every syndrome to the correct qubit (or none)", () => {
    expect(decodeBitFlipSyndrome([0, 0])).toBeNull();
    expect(decodeBitFlipSyndrome([1, 0])).toBe(0);
    expect(decodeBitFlipSyndrome([1, 1])).toBe(1);
    expect(decodeBitFlipSyndrome([0, 1])).toBe(2);
  });
});

describe("runBitFlipCorrectionCycle", () => {
  it("recovers the original encoded state exactly after no error", () => {
    const encoded = encodeBitFlipCode(alpha, beta);
    const result = runBitFlipCorrectionCycle(encoded, [0.1, 0.1]);
    expect(result.syndrome).toEqual([0, 0]);
    expect(result.correctedQubit).toBeNull();
    expect(maxDiff(result.corrected.amplitudes, encoded.amplitudes)).toBeLessThan(1e-9);
  });

  it("recovers the original state exactly after a single bit-flip error on any of the 3 qubits", () => {
    const encoded = encodeBitFlipCode(alpha, beta);
    for (const errorQubit of [0, 1, 2]) {
      const corrupted = applyBitFlipError(encoded, errorQubit);
      const result = runBitFlipCorrectionCycle(corrupted, [0.1, 0.1]);
      expect(result.correctedQubit).toBe(errorQubit);
      expect(maxDiff(result.corrected.amplitudes, encoded.amplitudes)).toBeLessThan(1e-9);
    }
  });

  it("throws for a non-3-qubit input", () => {
    expect(() => runBitFlipCorrectionCycle(StateVector.zero(2), [0.1, 0.1])).toThrow(/3-qubit/);
  });
});

describe("applyBitFlipErrors / applyPhaseFlipErrors", () => {
  it("applying to an empty set is the identity", () => {
    const encoded = encodeBitFlipCode(alpha, beta);
    expect(maxDiff(applyBitFlipErrors(encoded, []).amplitudes, encoded.amplitudes)).toBeLessThan(1e-9);
  });

  it("applying to a single qubit matches the singular helper", () => {
    const encoded = encodeBitFlipCode(alpha, beta);
    for (const q of [0, 1, 2]) {
      expect(maxDiff(applyBitFlipErrors(encoded, [q]).amplitudes, applyBitFlipError(encoded, q).amplitudes)).toBeLessThan(1e-9);
    }
  });

  it("a weight-2 X0X1 error is detected (nonzero syndrome) but recovery converts it into a full logical bit flip, matching the lesson's worked example", () => {
    const encoded = encodeBitFlipCode(alpha, beta);
    const corrupted = applyBitFlipErrors(encoded, [0, 1]);
    const result = runBitFlipCorrectionCycle(corrupted, [0.1, 0.1]);
    expect(result.syndrome).toEqual([0, 1]);
    expect(result.correctedQubit).toBe(2);
    // Net effect is X0X1X2, which swaps |000> and |111>, i.e. swaps alpha and beta.
    expect(result.corrected.amplitudes[0].re).toBeCloseTo(beta.re, 9);
    expect(result.corrected.amplitudes[7].re).toBeCloseTo(alpha.re, 9);
  });

  it("a weight-2 Z0Z1 error is likewise detected but mis-corrected into a full logical phase flip", () => {
    const encoded = encodePhaseFlipCode(alpha, beta);
    const corrupted = applyPhaseFlipErrors(encoded, [0, 1]);
    const result = runPhaseFlipCorrectionCycle(corrupted, [0.1, 0.1]);
    expect(result.syndrome).toEqual([0, 1]);
    expect(result.correctedQubit).toBe(2);
    expect(maxDiff(result.corrected.amplitudes, encoded.amplitudes)).toBeGreaterThan(0.1);
  });
});

describe("runPhaseFlipCorrectionCycle", () => {
  it("recovers the original encoded state exactly after no error", () => {
    const encoded = encodePhaseFlipCode(alpha, beta);
    const result = runPhaseFlipCorrectionCycle(encoded, [0.1, 0.1]);
    expect(maxDiff(result.corrected.amplitudes, encoded.amplitudes)).toBeLessThan(1e-6);
  });

  it("recovers the original state exactly after a single phase-flip error on any of the 3 qubits", () => {
    const encoded = encodePhaseFlipCode(alpha, beta);
    for (const errorQubit of [0, 1, 2]) {
      const corrupted = applyPhaseFlipError(encoded, errorQubit);
      const result = runPhaseFlipCorrectionCycle(corrupted, [0.1, 0.1]);
      expect(result.correctedQubit).toBe(errorQubit);
      expect(maxDiff(result.corrected.amplitudes, encoded.amplitudes)).toBeLessThan(1e-6);
    }
  });
});
