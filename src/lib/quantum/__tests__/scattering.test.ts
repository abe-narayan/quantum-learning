import { describe, expect, it } from "vitest";
import { stepPotentialScattering, barrierScatteringTransmission } from "../scattering";

describe("stepPotentialScattering", () => {
  it("R + T = 1 (probability conservation) across a range of energies and step heights", () => {
    for (const energy of [1, 2, 5, 10]) {
      for (const stepHeight of [0.1, 0.5, 1, energy - 0.01]) {
        if (energy <= stepHeight) continue;
        const { reflection, transmission } = stepPotentialScattering(energy, stepHeight);
        expect(reflection + transmission).toBeCloseTo(1, 9);
      }
    }
  });

  it("gives zero reflection when stepHeight = 0 (no actual step)", () => {
    const { reflection, transmission } = stepPotentialScattering(5, 0);
    expect(reflection).toBeCloseTo(0, 9);
    expect(transmission).toBeCloseTo(1, 9);
  });

  it("reflection grows as the step height approaches the particle's energy", () => {
    const low = stepPotentialScattering(10, 1).reflection;
    const high = stepPotentialScattering(10, 9).reflection;
    expect(high).toBeGreaterThan(low);
  });

  it("throws when energy does not exceed stepHeight", () => {
    expect(() => stepPotentialScattering(1, 1)).toThrow(/energy > stepHeight/);
    expect(() => stepPotentialScattering(1, 2)).toThrow(/energy > stepHeight/);
  });
});

describe("barrierScatteringTransmission", () => {
  it("is exactly 1 at a resonance (k2 * width = pi)", () => {
    const barrierHeight = 2;
    const energy = 5;
    const k2 = Math.sqrt(2 * (energy - barrierHeight));
    const width = Math.PI / k2; // k2*width = pi exactly
    expect(barrierScatteringTransmission(energy, barrierHeight, width)).toBeCloseTo(1, 9);
  });

  it("is less than 1 away from resonance", () => {
    const t = barrierScatteringTransmission(5, 2, 1.3);
    expect(t).toBeLessThan(1);
    expect(t).toBeGreaterThan(0);
  });

  it("approaches 1 as barrierHeight -> 0 (no actual barrier)", () => {
    const t = barrierScatteringTransmission(5, 1e-6, 1);
    expect(t).toBeCloseTo(1, 4);
  });

  it("throws when energy does not exceed barrierHeight", () => {
    expect(() => barrierScatteringTransmission(1, 2, 1)).toThrow(/energy > barrierHeight/);
  });
});
