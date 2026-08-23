import { describe, expect, it } from "vitest";
import { createGrid, Wavefunction1D } from "../wavefunction";
import {
  freeParticlePotential,
  harmonicOscillatorPotential,
  infiniteSquareWellPotential,
  barrierPotential,
  infiniteSquareWellEnergyLevel,
  harmonicOscillatorEnergyLevel,
  infiniteSquareWellEigenstate,
  harmonicOscillatorEigenstate,
} from "../potentials";
import { SplitOperatorEvolver, probabilityLeftAndRightOf } from "../timeEvolution";

describe("SplitOperatorEvolver construction", () => {
  const grid = createGrid(64, 0.25);

  it("rejects a mismatched potential length", () => {
    expect(() => new SplitOperatorEvolver(grid, [0, 0, 0], 0.01)).toThrow(/grid.n/);
  });

  it("rejects a non-positive dt", () => {
    const v = freeParticlePotential(grid);
    expect(() => new SplitOperatorEvolver(grid, v, 0)).toThrow(/dt/);
    expect(() => new SplitOperatorEvolver(grid, v, -1)).toThrow(/dt/);
  });

  it("rejects a non-positive mass", () => {
    const v = freeParticlePotential(grid);
    expect(() => new SplitOperatorEvolver(grid, v, 0.01, 0)).toThrow(/mass/);
  });

  it("step rejects a wavefunction on a different grid", () => {
    const v = freeParticlePotential(grid);
    const evolver = new SplitOperatorEvolver(grid, v, 0.01);
    const otherGrid = createGrid(128, 0.25);
    const psi = Wavefunction1D.gaussianPacket(otherGrid, { center: 0, width: 1, momentum: 0 });
    expect(() => evolver.step(psi)).toThrow(/grid/);
  });
});

describe("norm preservation", () => {
  it("stays within floating-point precision over many steps, for a free particle", () => {
    const grid = createGrid(256, 0.2);
    const v = freeParticlePotential(grid);
    const evolver = new SplitOperatorEvolver(grid, v, 0.02);
    let psi = Wavefunction1D.gaussianPacket(grid, { center: -5, width: 1, momentum: 2 });
    const initialNorm = psi.norm();
    psi = evolver.stepMultiple(psi, 400);
    expect(psi.norm()).toBeCloseTo(initialNorm, 8);
  });

  it("stays within floating-point precision under a harmonic potential", () => {
    const grid = createGrid(256, 0.15);
    const v = harmonicOscillatorPotential(grid, 1, 1);
    const evolver = new SplitOperatorEvolver(grid, v, 0.01);
    let psi = harmonicOscillatorEigenstate(grid, 1, 1, 1);
    psi = evolver.stepMultiple(psi, 300);
    expect(psi.norm()).toBeCloseTo(1, 8);
  });

  it("holds even for a deliberately large, physically-inaccurate dt", () => {
    const grid = createGrid(128, 0.25);
    const v = freeParticlePotential(grid);
    const evolver = new SplitOperatorEvolver(grid, v, 2.0);
    let psi = Wavefunction1D.gaussianPacket(grid, { center: 0, width: 1, momentum: 0 });
    psi = evolver.stepMultiple(psi, 20);
    expect(psi.norm()).toBeCloseTo(1, 8);
  });
});

describe("stationary states stay stationary", () => {
  it("an infinite-well eigenstate's probability density is essentially unchanged after evolving", () => {
    const grid = createGrid(1024, 0.02);
    const halfWidth = 4;
    const v = infiniteSquareWellPotential(grid, halfWidth);
    const evolver = new SplitOperatorEvolver(grid, v, 0.001);

    const psi0 = infiniteSquareWellEigenstate(grid, 1, halfWidth);
    const density0 = psi0.probabilityDensity();
    const psiT = evolver.stepMultiple(psi0, 200);
    const densityT = psiT.probabilityDensity();

    const maxDrift = Math.max(...density0.map((p, i) => Math.abs(p - densityT[i])));
    expect(maxDrift).toBeLessThan(0.01);
  });

  it("a harmonic-oscillator eigenstate's probability density is essentially unchanged after evolving", () => {
    const grid = createGrid(512, 0.05);
    const omega = 1;
    const v = harmonicOscillatorPotential(grid, omega, 1);
    const evolver = new SplitOperatorEvolver(grid, v, 0.005);

    const psi0 = harmonicOscillatorEigenstate(grid, 0, omega, 1);
    const density0 = psi0.probabilityDensity();
    const psiT = evolver.stepMultiple(psi0, 200);
    const densityT = psiT.probabilityDensity();

    const maxDrift = Math.max(...density0.map((p, i) => Math.abs(p - densityT[i])));
    expect(maxDrift).toBeLessThan(0.005);
  });
});

describe("energy conservation under a static potential", () => {
  it("<H> for an infinite-well eigenstate stays close to its analytical value during evolution (a tall-but-finite wall needs dt*wallHeight kept small for Trotter accuracy, not just norm preservation)", () => {
    const grid = createGrid(512, 0.03);
    const halfWidth = 5;
    const wallHeight = 200; // matches the Wavefunction Explorer's infinite-well presets
    const v = infiniteSquareWellPotential(grid, halfWidth, wallHeight);
    const evolver = new SplitOperatorEvolver(grid, v, 0.0002);

    let psi = infiniteSquareWellEigenstate(grid, 1, halfWidth);
    const analyticalEnergy = infiniteSquareWellEnergyLevel(1, 2 * halfWidth);
    expect(psi.expectationEnergy(v)).toBeCloseTo(analyticalEnergy, 1);

    psi = evolver.stepMultiple(psi, 400);
    expect(psi.expectationEnergy(v)).toBeCloseTo(analyticalEnergy, 1);
  });

  it("an under-resolved wall (dt*wallHeight too large) visibly corrupts <H> even though norm and density stay fine — documents why the preset uses a smaller wallHeight/dt pair", () => {
    const grid = createGrid(512, 0.03);
    const halfWidth = 5;
    const v = infiniteSquareWellPotential(grid, halfWidth, 1e6);
    const evolver = new SplitOperatorEvolver(grid, v, 0.001);

    let psi = infiniteSquareWellEigenstate(grid, 1, halfWidth);
    const analyticalEnergy = infiniteSquareWellEnergyLevel(1, 2 * halfWidth);
    psi = evolver.stepMultiple(psi, 80);

    expect(psi.norm()).toBeCloseTo(1, 8);
    expect(Math.abs(psi.expectationEnergy(v) - analyticalEnergy)).toBeGreaterThan(1);
  });

  it("<H> for a harmonic eigenstate stays close to its analytical value during evolution", () => {
    const grid = createGrid(512, 0.05);
    const omega = 1.5;
    const v = harmonicOscillatorPotential(grid, omega, 1);
    const evolver = new SplitOperatorEvolver(grid, v, 0.005);

    let psi = harmonicOscillatorEigenstate(grid, 2, omega, 1);
    const analyticalEnergy = harmonicOscillatorEnergyLevel(2, omega);
    expect(psi.expectationEnergy(v)).toBeCloseTo(analyticalEnergy, 1);

    psi = evolver.stepMultiple(psi, 200);
    expect(psi.expectationEnergy(v)).toBeCloseTo(analyticalEnergy, 1);
  });
});

describe("free-particle wave packet dynamics", () => {
  it("a zero-momentum packet's position variance grows over time (dispersion)", () => {
    const grid = createGrid(512, 0.2);
    const v = freeParticlePotential(grid);
    const evolver = new SplitOperatorEvolver(grid, v, 0.02);

    let psi = Wavefunction1D.gaussianPacket(grid, { center: 0, width: 1, momentum: 0 });
    const varianceBefore = psi.variancePosition();
    psi = evolver.stepMultiple(psi, 250); // T = 5
    const varianceAfter = psi.variancePosition();

    expect(varianceAfter).toBeGreaterThan(varianceBefore);
    // Analytical free-particle spreading: sigma(t)^2 = sigma0^2 + (t/(2*m*sigma0))^2, hbar=m=1.
    const predicted = 1 * 1 + (5 / (2 * 1 * 1)) ** 2;
    expect(varianceAfter).toBeCloseTo(predicted, 0);
  });

  it("a moving packet's mean position advances at group velocity p/m", () => {
    const grid = createGrid(512, 0.2);
    const v = freeParticlePotential(grid);
    const evolver = new SplitOperatorEvolver(grid, v, 0.02);
    const momentum = 2;
    const mass = 1;

    let psi = Wavefunction1D.gaussianPacket(grid, { center: -10, width: 1, momentum });
    const meanXBefore = psi.expectationPosition();
    psi = evolver.stepMultiple(psi, 100); // T = 2
    const meanXAfter = psi.expectationPosition();

    const predictedShift = (momentum / mass) * 2;
    expect(meanXAfter - meanXBefore).toBeCloseTo(predictedShift, 0);
  });
});

describe("tunneling / barrier probability accounting", () => {
  it("transmitted + reflected probability sums to ~1 after a packet crosses a barrier", () => {
    const grid = createGrid(1024, 0.1);
    const v = barrierPotential(grid, 0, 1, 2);
    const evolver = new SplitOperatorEvolver(grid, v, 0.005);

    let psi = Wavefunction1D.gaussianPacket(grid, { center: -20, width: 2, momentum: 3 });
    psi = evolver.stepMultiple(psi, 2000); // enough time to fully interact with and pass the barrier

    const { left, right } = probabilityLeftAndRightOf(psi, 0);
    expect(left + right).toBeCloseTo(1, 6);
    // Some amplitude should have made it past the barrier, and some should remain reflected.
    expect(right).toBeGreaterThan(0.001);
    expect(left).toBeGreaterThan(0.001);
  });
});
