import { describe, expect, it } from "vitest";
import { stateVectorAmplitudeCount, stateVectorMemoryBytes, estimatedGateFlops } from "../simulationCost";

describe("stateVectorAmplitudeCount", () => {
  it("gives 2^n", () => {
    expect(stateVectorAmplitudeCount(0)).toBe(1);
    expect(stateVectorAmplitudeCount(10)).toBe(1024);
    expect(stateVectorAmplitudeCount(20)).toBe(1048576);
  });

  it("throws for a negative or non-integer count", () => {
    expect(() => stateVectorAmplitudeCount(-1)).toThrow();
    expect(() => stateVectorAmplitudeCount(1.5)).toThrow();
  });
});

describe("stateVectorMemoryBytes", () => {
  it("gives 16 bytes per amplitude", () => {
    expect(stateVectorMemoryBytes(10)).toBe(1024 * 16);
  });

  it("exceeds a petabyte (10^15 bytes) around 50 qubits", () => {
    expect(stateVectorMemoryBytes(50)).toBeGreaterThan(1e15);
  });
});

describe("estimatedGateFlops", () => {
  it("scales linearly with gate count and exponentially with qubit count", () => {
    expect(estimatedGateFlops(10, 100)).toBe(100 * 1024);
    expect(estimatedGateFlops(20, 100)).toBe(100 * 1048576);
  });

  it("throws for a negative gate count", () => {
    expect(() => estimatedGateFlops(5, -1)).toThrow();
  });
});
