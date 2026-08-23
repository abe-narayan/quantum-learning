import { describe, expect, it } from "vitest";
import { sphericalHarmonic, sphericalHarmonicNormSquared, sphericalHarmonicInnerProduct } from "../sphericalHarmonics";

describe("sphericalHarmonic", () => {
  it("Y_0^0 is a real constant, 1/(2*sqrt(pi))", () => {
    const y = sphericalHarmonic({ l: 0, m: 0 }, 0.7, 1.2);
    expect(y.re).toBeCloseTo(1 / (2 * Math.sqrt(Math.PI)), 9);
    expect(y.im).toBeCloseTo(0, 9);
  });

  it("throws for an unsupported (l,m) pair", () => {
    expect(() => sphericalHarmonic({ l: 2 as const, m: 3 }, 0.5, 0.5)).toThrow(/unsupported/);
  });
});

describe("normalization: |Y_l^m|^2 integrates to 1 over the sphere", () => {
  const indices: { l: 0 | 1 | 2; m: number }[] = [
    { l: 0, m: 0 },
    { l: 1, m: -1 },
    { l: 1, m: 0 },
    { l: 1, m: 1 },
    { l: 2, m: -2 },
    { l: 2, m: -1 },
    { l: 2, m: 0 },
    { l: 2, m: 1 },
    { l: 2, m: 2 },
  ];

  it.each(indices)("l=%s m=%s", (index) => {
    expect(sphericalHarmonicNormSquared(index, 120)).toBeCloseTo(1, 3);
  });
});

describe("orthogonality between distinct (l,m) pairs", () => {
  it("Y_0^0 is orthogonal to Y_1^0", () => {
    expect(sphericalHarmonicInnerProduct({ l: 0, m: 0 }, { l: 1, m: 0 }, 120).magnitude()).toBeLessThan(1e-6);
  });

  it("Y_1^0 is orthogonal to Y_1^1 (different m, same l)", () => {
    expect(sphericalHarmonicInnerProduct({ l: 1, m: 0 }, { l: 1, m: 1 }, 120).magnitude()).toBeLessThan(1e-6);
  });

  it("Y_2^2 is orthogonal to Y_2^-2", () => {
    expect(sphericalHarmonicInnerProduct({ l: 2, m: 2 }, { l: 2, m: -2 }, 120).magnitude()).toBeLessThan(1e-6);
  });
});
