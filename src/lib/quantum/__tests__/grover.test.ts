import { describe, expect, it } from "vitest";
import { uniformSuperposition, groverDiffusion, groverIteration, optimalGroverIterations, runGrover } from "../grover";

describe("uniformSuperposition", () => {
  it("gives every basis state equal probability", () => {
    const s = uniformSuperposition(3);
    for (const p of s.probabilities()) expect(p).toBeCloseTo(1 / 8, 9);
  });
});

describe("groverDiffusion", () => {
  it("fixes the uniform superposition exactly (2|s><s|-I applied to |s> is |s>)", () => {
    const s = uniformSuperposition(3);
    const d = groverDiffusion(s);
    for (let i = 0; i < s.amplitudes.length; i++) {
      expect(d.amplitudes[i].sub(s.amplitudes[i]).magnitude()).toBeLessThan(1e-9);
    }
  });

  it("negates a state orthogonal to |s> reflected about it (self-consistency: applying twice returns the original)", () => {
    const s = uniformSuperposition(2);
    const twice = groverDiffusion(groverDiffusion(s));
    for (let i = 0; i < s.amplitudes.length; i++) {
      expect(twice.amplitudes[i].sub(s.amplitudes[i]).magnitude()).toBeLessThan(1e-9);
    }
  });
});

describe("optimalGroverIterations", () => {
  it("gives 1 iteration for N=4, M=1 (the textbook exact case)", () => {
    expect(optimalGroverIterations(2, 1)).toBe(1);
  });

  it("grows roughly as sqrt(N)", () => {
    const iters8 = optimalGroverIterations(6, 1); // N=64
    const iters2 = optimalGroverIterations(2, 1); // N=4
    expect(iters8).toBeGreaterThan(iters2);
  });
});

describe("runGrover", () => {
  it("reaches near-certainty for N=4, M=1 in exactly 1 iteration", () => {
    const result = runGrover(2, [2], 1);
    expect(result.probabilities()[2]).toBeCloseTo(1, 6);
  });

  it("finds the marked item with high probability at the optimal iteration count across several N", () => {
    for (const n of [3, 4, 5]) {
      const marked = 1;
      const iters = optimalGroverIterations(n, 1);
      const result = runGrover(n, [marked], iters);
      expect(result.probabilities()[marked]).toBeGreaterThan(0.9);
    }
  });

  it("success probability after k iterations matches the exact closed form sin²((2k+1)θ), θ=asin(√(M/N))", () => {
    const n = 4;
    const N = 2 ** n;
    const marked = 3;
    const theta = Math.asin(Math.sqrt(1 / N));
    for (const k of [0, 1, 2, 5, 8]) {
      const expected = Math.sin((2 * k + 1) * theta) ** 2;
      const actual = runGrover(n, [marked], k).probabilities()[marked];
      expect(actual).toBeCloseTo(expected, 6);
    }
  });

  it("is exactly equivalent to composing groverIteration manually", () => {
    const n = 3;
    const marked = [2];
    let manual = uniformSuperposition(n);
    manual = groverIteration(manual, marked);
    manual = groverIteration(manual, marked);
    const viaRunGrover = runGrover(n, marked, 2);
    for (let i = 0; i < manual.amplitudes.length; i++) {
      expect(manual.amplitudes[i].sub(viaRunGrover.amplitudes[i]).magnitude()).toBeLessThan(1e-9);
    }
  });
});
