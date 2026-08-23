import { describe, expect, it } from "vitest";
import { thermalPhotonOccupation } from "../thermalPhysics";

describe("thermalPhotonOccupation", () => {
  it("is very small (<<1) for a 5 GHz qubit at typical dilution-fridge base temperature (15 mK)", () => {
    expect(thermalPhotonOccupation(5e9, 0.015)).toBeLessThan(1e-6);
  });

  it("exceeds 1 at 4 K for the same qubit frequency — explaining why 4K alone is insufficient", () => {
    expect(thermalPhotonOccupation(5e9, 4)).toBeGreaterThan(1);
  });

  it("is very large (>>1) at room temperature", () => {
    expect(thermalPhotonOccupation(5e9, 300)).toBeGreaterThan(1000);
  });

  it("increases monotonically with temperature at fixed frequency", () => {
    const low = thermalPhotonOccupation(5e9, 0.01);
    const mid = thermalPhotonOccupation(5e9, 0.1);
    const high = thermalPhotonOccupation(5e9, 1);
    expect(low).toBeLessThan(mid);
    expect(mid).toBeLessThan(high);
  });

  it("decreases monotonically with frequency at fixed temperature", () => {
    const low = thermalPhotonOccupation(1e9, 0.02);
    const high = thermalPhotonOccupation(10e9, 0.02);
    expect(high).toBeLessThan(low);
  });

  it("throws for non-positive frequency or temperature", () => {
    expect(() => thermalPhotonOccupation(0, 1)).toThrow();
    expect(() => thermalPhotonOccupation(1e9, 0)).toThrow();
  });
});
