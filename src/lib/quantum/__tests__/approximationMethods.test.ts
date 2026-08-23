import { describe, expect, it } from "vitest";
import {
  firstOrderEnergyCorrection,
  secondOrderEnergyCorrection,
  firstOrderStateCorrection,
  gaussianTrialEnergy,
  minimizeGaussianTrialEnergy,
  wkbActionIntegral,
  wkbQuantizedEnergy,
  firstOrderTransitionProbability,
  exactTwoLevelTransitionProbability,
  exactTwoLevelTrajectory,
} from "../approximationMethods";
import { harmonicOscillatorEnergyLevels, positionOperator } from "../harmonicOscillator";
import { createGrid } from "../wavefunction";
import { harmonicOscillatorPotential, harmonicOscillatorEnergyLevel } from "../potentials";

describe("perturbation theory: quartic anharmonic oscillator", () => {
  const dim = 8;
  const H0diag = harmonicOscillatorEnergyLevels(dim, 1);
  const x = positionOperator(dim, 1, 1);
  const x4 = x.mul(x).mul(x).mul(x);
  const lambda = 0.01;
  const Hprime = x4.scale(lambda);

  it("matches the known exact ground-state first-order shift, lambda*<0|x^4|0>=lambda*3/4", () => {
    expect(firstOrderEnergyCorrection(H0diag, Hprime, 0)).toBeCloseTo(lambda * 0.75, 6);
  });

  it("gives a negative second-order correction (standard sign for a perturbation lowering the ground state further)", () => {
    expect(secondOrderEnergyCorrection(H0diag, Hprime, 0)).toBeLessThan(0);
  });

  it("first-order state correction has zero overlap with |0> itself", () => {
    const correction = firstOrderStateCorrection(H0diag, Hprime, 0);
    expect(correction[0].magnitude()).toBeCloseTo(0, 9);
  });

  it("throws for an out-of-range n", () => {
    expect(() => firstOrderEnergyCorrection(H0diag, Hprime, 99)).toThrow();
  });
});

describe("variational method: Gaussian trial on the harmonic oscillator", () => {
  const grid = createGrid(1024, 0.05);
  const V = harmonicOscillatorPotential(grid, 1, 1);
  const exactE0 = harmonicOscillatorEnergyLevel(0, 1);

  it("the optimized trial energy is very close to (and, by the variational theorem, never below) the exact ground energy", () => {
    const { bestEnergy } = minimizeGaussianTrialEnergy(grid, V, { widthMin: 0.2, widthMax: 3, steps: 300 });
    expect(bestEnergy).toBeGreaterThanOrEqual(exactE0 - 1e-6);
    expect(bestEnergy).toBeCloseTo(exactE0, 3);
  });

  it("a badly-chosen fixed width gives a strictly worse (higher) trial energy than the optimized one", () => {
    const bad = gaussianTrialEnergy(grid, V, 3);
    const { bestEnergy } = minimizeGaussianTrialEnergy(grid, V, { widthMin: 0.2, widthMax: 3, steps: 300 });
    expect(bad).toBeGreaterThan(bestEnergy);
  });
});

describe("WKB approximation: exact for the harmonic oscillator", () => {
  const grid = createGrid(2048, 0.02);
  const V = harmonicOscillatorPotential(grid, 1, 1);

  it.each([0, 1, 2, 3])("n=%i WKB energy matches the exact (n+1/2) result closely", (n) => {
    const exact = harmonicOscillatorEnergyLevel(n, 1);
    const wkb = wkbQuantizedEnergy(grid, V, n, { eMin: 0.01, eMax: 20 });
    expect(wkb).toBeCloseTo(exact, 2);
  });

  it("the action integral increases with energy", () => {
    const low = wkbActionIntegral(grid, V, 1);
    const high = wkbActionIntegral(grid, V, 5);
    expect(high).toBeGreaterThan(low);
  });
});

describe("time-dependent perturbation theory: two-level system", () => {
  it("perturbative and exact transition probabilities agree closely for weak coupling", () => {
    const pert = firstOrderTransitionProbability(0.01, 1, 1);
    const exact = exactTwoLevelTransitionProbability(0, 1, 0.01, 1, 4000);
    expect(pert).toBeCloseTo(exact, 3);
  });

  it("perturbative and exact transition probabilities diverge for strong coupling and long times", () => {
    const pert = firstOrderTransitionProbability(0.5, 1, 3);
    const exact = exactTwoLevelTransitionProbability(0, 1, 0.5, 3, 4000);
    expect(Math.abs(pert - exact)).toBeGreaterThan(0.3);
  });

  it("exact transition probability never exceeds 1 (unlike the unbounded perturbative formula)", () => {
    const exact = exactTwoLevelTransitionProbability(0, 1, 0.5, 3, 4000);
    expect(exact).toBeLessThanOrEqual(1.0);
  });
});

describe("exactTwoLevelTrajectory: single-pass RK4 trajectory for the Rabi/Qubit Dynamics Explorer", () => {
  it("on resonance (Delta=0), P(1) at every sample matches the closed-form sin^2(Vt) exactly", () => {
    const V = 1;
    const tMax = 4;
    const trajectory = exactTwoLevelTrajectory(0, 0, V, tMax, 100);
    for (const point of trajectory) {
      const p1 = point.c[1].magnitudeSquared();
      const expected = Math.sin(V * point.t) ** 2;
      expect(p1).toBeCloseTo(expected, 3);
    }
  });

  it("preserves normalization (|c0|^2+|c1|^2=1) at every sample, on and off resonance", () => {
    const trajectory = exactTwoLevelTrajectory(0, 2, 1, 5, 80);
    for (const point of trajectory) {
      const norm = point.c[0].magnitudeSquared() + point.c[1].magnitudeSquared();
      expect(norm).toBeCloseTo(1, 5);
    }
  });

  it("agrees with an independent single-shot exactTwoLevelState integration at the final sample", () => {
    const Ei = 0;
    const Ef = 1.5;
    const V = 0.7;
    const tMax = 3;
    const trajectory = exactTwoLevelTrajectory(Ei, Ef, V, tMax, 300);
    const final = trajectory[trajectory.length - 1];
    const independent = exactTwoLevelTransitionProbability(Ei, Ef, V, tMax, 4000);
    expect(final.c[1].magnitudeSquared()).toBeCloseTo(independent, 3);
  });

  it("off-resonance, the maximum population over the trajectory matches the generalized Rabi formula 4V^2/(Delta^2+4V^2)", () => {
    const V = 1;
    const delta = 2;
    const omegaEff = Math.sqrt(delta * delta + 4 * V * V);
    const tMax = (3 * 2 * Math.PI) / omegaEff;
    const trajectory = exactTwoLevelTrajectory(0, delta, V, tMax, 500);
    const maxP1 = Math.max(...trajectory.map((point) => point.c[1].magnitudeSquared()));
    const expectedMax = (4 * V * V) / (delta * delta + 4 * V * V);
    expect(maxP1).toBeCloseTo(expectedMax, 2);
  });

  it("starts at |0> (c=[1,0]) at t=0 regardless of parameters", () => {
    const trajectory = exactTwoLevelTrajectory(0.3, -1.2, 0.8, 2, 50);
    expect(trajectory[0].t).toBe(0);
    expect(trajectory[0].c[0].magnitudeSquared()).toBeCloseTo(1, 9);
    expect(trajectory[0].c[1].magnitudeSquared()).toBeCloseTo(0, 9);
  });

  it("throws for a non-positive tMax or a non-positive sample count", () => {
    expect(() => exactTwoLevelTrajectory(0, 0, 1, 0, 10)).toThrow();
    expect(() => exactTwoLevelTrajectory(0, 0, 1, -1, 10)).toThrow();
    expect(() => exactTwoLevelTrajectory(0, 0, 1, 1, 0)).toThrow();
  });
});
