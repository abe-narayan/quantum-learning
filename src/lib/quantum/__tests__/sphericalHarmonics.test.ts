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

// Every (l,m) this module implements. The closed forms are transcribed
// constants, so the thing worth checking is not any one of them in
// isolation but that the whole set is orthonormal on the sphere — a single
// wrong normalization coefficient or a wrong sinT/cosT power shows up
// immediately in one of these integrals and nowhere else.
const ALL_INDICES = [
  { l: 0 as const, m: 0 },
  { l: 1 as const, m: -1 },
  { l: 1 as const, m: 0 },
  { l: 1 as const, m: 1 },
  { l: 2 as const, m: -2 },
  { l: 2 as const, m: -1 },
  { l: 2 as const, m: 0 },
  { l: 2 as const, m: 1 },
  { l: 2 as const, m: 2 },
];

describe("the implemented spherical harmonics are an orthonormal set", () => {
  it("normalizes every Y_l^m to 1 over the sphere", () => {
    for (const index of ALL_INDICES) {
      // The midpoint rule on a 300x300 theta/phi grid converges to about
      // 1e-4 here; the tolerance is set by that discretization, not by any
      // uncertainty about the closed forms themselves.
      expect(sphericalHarmonicNormSquared(index, 300), `Y_${index.l}^${index.m}`).toBeCloseTo(1, 3);
    }
  });

  it("makes every distinct pair orthogonal, across both different l and different m", () => {
    for (const a of ALL_INDICES) {
      for (const b of ALL_INDICES) {
        if (a.l === b.l && a.m === b.m) continue;
        const overlap = sphericalHarmonicInnerProduct(a, b, 300).magnitude();
        expect(overlap, `<Y_${a.l}^${a.m}|Y_${b.l}^${b.m}>`).toBeLessThan(1e-3);
      }
    }
  });

  it("gives |Y_l^m|² no dependence on phi, so the probability density is axially symmetric", () => {
    // |Y|^2 depending only on theta is what makes an orbital's shape a
    // surface of revolution about z; it also pins the e^{i m phi} azimuthal
    // factor down to a pure phase, which is the one part of these formulas
    // a sign error would otherwise hide in.
    for (const index of ALL_INDICES) {
      const reference = sphericalHarmonic(index, 0.9, 0).magnitudeSquared();
      for (const phi of [0.4, 1.7, 3.3, 5.9]) {
        expect(sphericalHarmonic(index, 0.9, phi).magnitudeSquared(), `Y_${index.l}^${index.m} at phi=${phi}`).toBeCloseTo(reference, 9);
      }
    }
  });

  it("makes Y_l^-m the conjugate of Y_l^m up to the standard (-1)^m sign (the Condon-Shortley convention)", () => {
    for (const [l, m] of [[1, 1], [2, 1], [2, 2]] as [1 | 2, number][]) {
      const positive = sphericalHarmonic({ l, m }, 0.8, 1.1);
      const negative = sphericalHarmonic({ l, m: -m }, 0.8, 1.1);
      const expected = positive.conjugate().scale(m % 2 === 0 ? 1 : -1);
      expect(negative.re, `Y_${l}^-${m} re`).toBeCloseTo(expected.re, 9);
      expect(negative.im, `Y_${l}^-${m} im`).toBeCloseTo(expected.im, 9);
    }
  });
});
