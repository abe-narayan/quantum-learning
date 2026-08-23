import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { Matrix } from "../matrix";
import {
  annihilationOperator,
  creationOperator,
  harmonicOscillatorEnergyLevels,
  numberOperator,
} from "../harmonicOscillator";

const c = (re: number, im = 0) => new Complex(re, im);

describe("annihilationOperator", () => {
  it("a|n⟩ = sqrt(n)|n-1⟩ for each basis state below the top", () => {
    const dimension = 5;
    const a = annihilationOperator(dimension);
    for (let n = 1; n < dimension; n++) {
      const basisN = Array.from({ length: dimension }, (_, i) => (i === n ? c(1) : c(0)));
      const result = a.apply(basisN);
      for (let i = 0; i < dimension; i++) {
        const expected = i === n - 1 ? Math.sqrt(n) : 0;
        expect(result[i].re).toBeCloseTo(expected, 9);
        expect(result[i].im).toBeCloseTo(0, 9);
      }
    }
  });

  it("a|0⟩ = 0 (can't lower below the ground state)", () => {
    const a = annihilationOperator(4);
    const ground = [c(1), c(0), c(0), c(0)];
    const result = a.apply(ground);
    for (const entry of result) {
      expect(entry.magnitude()).toBeCloseTo(0, 9);
    }
  });
});

describe("creationOperator", () => {
  it("is the conjugate transpose of the annihilation operator", () => {
    const dimension = 4;
    expect(creationOperator(dimension).equals(annihilationOperator(dimension).dagger(), 1e-9)).toBe(true);
  });

  it("a†|n⟩ = sqrt(n+1)|n+1⟩ for n below the truncation cutoff", () => {
    const dimension = 5;
    const aDagger = creationOperator(dimension);
    for (let n = 0; n < dimension - 1; n++) {
      const basisN = Array.from({ length: dimension }, (_, i) => (i === n ? c(1) : c(0)));
      const result = aDagger.apply(basisN);
      for (let i = 0; i < dimension; i++) {
        const expected = i === n + 1 ? Math.sqrt(n + 1) : 0;
        expect(result[i].re).toBeCloseTo(expected, 9);
      }
    }
  });

  it("a†|top level⟩ = 0 — the honest truncation-error case", () => {
    const dimension = 4;
    const aDagger = creationOperator(dimension);
    const top = [c(0), c(0), c(0), c(1)];
    const result = aDagger.apply(top);
    for (const entry of result) {
      expect(entry.magnitude()).toBeCloseTo(0, 9);
    }
  });
});

describe("numberOperator", () => {
  it("is exactly diagonal(0, 1, ..., dimension-1)", () => {
    const dimension = 5;
    const n = numberOperator(dimension);
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        expect(n.get(i, j).equals(i === j ? c(i) : c(0), 1e-9)).toBe(true);
      }
    }
  });

  it("equals a†a exactly, with no truncation error, for every basis state", () => {
    const dimension = 5;
    const aDaggerA = creationOperator(dimension).mul(annihilationOperator(dimension));
    expect(aDaggerA.equals(numberOperator(dimension), 1e-9)).toBe(true);
  });
});

describe("[a, a†] ≈ I away from the truncation boundary", () => {
  it("holds well below the cutoff, and visibly breaks down only at the very top level", () => {
    const dimension = 6;
    const a = annihilationOperator(dimension);
    const aDagger = creationOperator(dimension);
    const commutator = a.mul(aDagger).add(aDagger.mul(a).scale(-1));
    const identity = Matrix.identity(dimension);
    for (let i = 0; i < dimension - 1; i++) {
      expect(commutator.get(i, i).equals(identity.get(i, i), 1e-9)).toBe(true);
    }
    // At the truncated top level, [a,a†] deviates from I — the documented approximation.
    expect(commutator.get(dimension - 1, dimension - 1).equals(identity.get(dimension - 1, dimension - 1), 1e-9)).toBe(false);
  });
});

describe("harmonicOscillatorEnergyLevels", () => {
  it("gives E_n = (n + 1/2)ℏω", () => {
    const levels = harmonicOscillatorEnergyLevels(4, 2);
    expect(levels).toEqual([1, 3, 5, 7]);
  });

  it("the ground state energy is never zero (zero-point energy)", () => {
    const levels = harmonicOscillatorEnergyLevels(1, 1);
    expect(levels[0]).toBeCloseTo(0.5, 9);
  });
});

describe("input validation", () => {
  it("rejects non-positive dimensions", () => {
    expect(() => annihilationOperator(0)).toThrow();
    expect(() => numberOperator(-1)).toThrow();
  });
});
