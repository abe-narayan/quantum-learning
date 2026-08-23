import { describe, expect, it } from "vitest";
import {
  hydrogenEnergyLevel,
  radial1s,
  radial2s,
  radial2p,
  radialNormSquared,
  radialInnerProduct,
  mostProbableRadius1s,
  RYDBERG_EV,
} from "../hydrogenAtom";

describe("hydrogenEnergyLevel", () => {
  it("gives -13.6 eV for the ground state", () => {
    expect(hydrogenEnergyLevel(1)).toBeCloseTo(-13.6, 9);
  });

  it("gives -13.6/n^2 for several n", () => {
    expect(hydrogenEnergyLevel(2)).toBeCloseTo(-13.6 / 4, 9);
    expect(hydrogenEnergyLevel(4)).toBeCloseTo(-13.6 / 16, 9);
  });

  it("throws for n < 1 or non-integer n", () => {
    expect(() => hydrogenEnergyLevel(0)).toThrow();
    expect(() => hydrogenEnergyLevel(1.5)).toThrow();
  });

  it("levels increase (become less negative) monotonically with n", () => {
    expect(hydrogenEnergyLevel(1)).toBeLessThan(hydrogenEnergyLevel(2));
    expect(hydrogenEnergyLevel(2)).toBeLessThan(hydrogenEnergyLevel(3));
  });
});

describe("radial wavefunctions: normalization", () => {
  it("1s normalizes to 1", () => {
    expect(radialNormSquared(radial1s)).toBeCloseTo(1, 6);
  });
  it("2s normalizes to 1", () => {
    expect(radialNormSquared(radial2s)).toBeCloseTo(1, 6);
  });
  it("2p normalizes to 1", () => {
    expect(radialNormSquared(radial2p)).toBeCloseTo(1, 6);
  });
});

describe("radial wavefunctions: orthogonality", () => {
  it("1s and 2s are orthogonal (same l, different n)", () => {
    expect(radialInnerProduct(radial1s, radial2s)).toBeCloseTo(0, 6);
  });
});

describe("mostProbableRadius1s", () => {
  it("gives exactly the Bohr radius, r=1 in these units", () => {
    expect(mostProbableRadius1s()).toBeCloseTo(1, 2);
  });
});

describe("RYDBERG_EV", () => {
  it("is 13.6", () => {
    expect(RYDBERG_EV).toBe(13.6);
  });
});
