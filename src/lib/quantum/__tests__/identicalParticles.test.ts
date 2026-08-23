import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { tensorProduct, symmetrize, antisymmetrize, exchangeParticles, innerProduct, normalizeVector } from "../identicalParticles";

const e0 = [new Complex(1), new Complex(0), new Complex(0)];
const e1 = [new Complex(0), new Complex(1), new Complex(0)];
const e2 = [new Complex(0), new Complex(0), new Complex(1)];

describe("symmetrize", () => {
  it("produces a normalized state", () => {
    const sym = symmetrize(e0, e1);
    const norm = Math.sqrt(sym.reduce((s, c) => s + c.magnitudeSquared(), 0));
    expect(norm).toBeCloseTo(1, 9);
  });

  it("is a +1 eigenstate of the exchange operator", () => {
    const sym = symmetrize(e0, e1);
    const swapped = exchangeParticles(sym, 3, 3);
    sym.forEach((c, i) => {
      expect(c.sub(swapped[i]).magnitude()).toBeCloseTo(0, 9);
    });
  });

  it("does not throw when both particles share the same single-particle state (bosons can pile up)", () => {
    expect(() => symmetrize(e0, e0)).not.toThrow();
    const sym = symmetrize(e0, e0);
    const product = tensorProduct(e0, e0);
    sym.forEach((c, i) => expect(c.sub(product[i]).magnitude()).toBeCloseTo(0, 9));
  });
});

describe("antisymmetrize", () => {
  it("produces a normalized state for two distinct single-particle states", () => {
    const anti = antisymmetrize(e1, e2);
    const norm = Math.sqrt(anti.reduce((s, c) => s + c.magnitudeSquared(), 0));
    expect(norm).toBeCloseTo(1, 9);
  });

  it("is a -1 eigenstate of the exchange operator", () => {
    const anti = antisymmetrize(e0, e1);
    const swapped = exchangeParticles(anti, 3, 3);
    anti.forEach((c, i) => {
      expect(c.add(swapped[i]).magnitude()).toBeCloseTo(0, 9);
    });
  });

  it("throws (Pauli exclusion) when both particles share the same single-particle state", () => {
    expect(() => antisymmetrize(e0, e0)).toThrow(/does not exist/);
  });
});

describe("symmetrize and antisymmetrize outputs are orthogonal", () => {
  it("⟨sym|anti⟩ = 0", () => {
    const sym = symmetrize(e0, e1);
    const anti = antisymmetrize(e0, e1);
    expect(innerProduct(sym, anti).magnitude()).toBeLessThan(1e-9);
  });
});

describe("exchangeParticles", () => {
  it("is its own inverse (applying it twice returns the original state)", () => {
    const psi = tensorProduct(e0, e1);
    const twice = exchangeParticles(exchangeParticles(psi, 3, 3), 3, 3);
    psi.forEach((c, i) => expect(c.sub(twice[i]).magnitude()).toBeCloseTo(0, 9));
  });

  it("throws for mismatched dimensions", () => {
    expect(() => exchangeParticles([Complex.ONE, Complex.ZERO], 1, 2)).toThrow();
  });
});

describe("normalizeVector", () => {
  it("throws for a near-zero vector", () => {
    expect(() => normalizeVector([Complex.ZERO, Complex.ZERO])).toThrow();
  });
});
