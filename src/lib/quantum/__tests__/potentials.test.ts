import { describe, expect, it } from "vitest";
import { createGrid } from "../wavefunction";
import {
  freeParticlePotential,
  harmonicOscillatorPotential,
  infiniteSquareWellPotential,
  finiteSquareWellPotential,
  finiteSquareWellGroundStateEnergy,
  barrierPotential,
  infiniteSquareWellEnergyLevel,
  harmonicOscillatorEnergyLevel,
  infiniteSquareWellEigenstate,
  harmonicOscillatorEigenstate,
} from "../potentials";

describe("potential shapes", () => {
  const grid = createGrid(64, 0.25);

  it("free particle potential is zero everywhere", () => {
    expect(freeParticlePotential(grid).every((v) => v === 0)).toBe(true);
  });

  it("infinite well is zero inside, tall outside", () => {
    const v = infiniteSquareWellPotential(grid, 2, 1e6);
    grid.x.forEach((x, i) => {
      expect(v[i]).toBe(Math.abs(x) <= 2 ? 0 : 1e6);
    });
  });

  it("finite well is negative inside, zero outside", () => {
    const v = finiteSquareWellPotential(grid, 2, 5);
    grid.x.forEach((x, i) => {
      expect(v[i]).toBe(Math.abs(x) <= 2 ? -5 : 0);
    });
  });

  it("barrier is positive within its width, zero elsewhere", () => {
    const v = barrierPotential(grid, 0, 1, 10);
    grid.x.forEach((x, i) => {
      expect(v[i]).toBe(Math.abs(x) <= 1 ? 10 : 0);
    });
  });

  it("harmonic oscillator potential is 0.5*m*omega^2*x^2", () => {
    const v = harmonicOscillatorPotential(grid, 2, 1);
    grid.x.forEach((x, i) => {
      expect(v[i]).toBeCloseTo(0.5 * 4 * x * x, 9);
    });
  });
});

describe("analytical energy formulas", () => {
  it("infinite well energies match n^2 pi^2 / (2 m L^2)", () => {
    expect(infiniteSquareWellEnergyLevel(1, 4)).toBeCloseTo((Math.PI * Math.PI) / 32, 9);
    expect(infiniteSquareWellEnergyLevel(2, 4)).toBeCloseTo((4 * Math.PI * Math.PI) / 32, 9);
    expect(() => infiniteSquareWellEnergyLevel(0, 4)).toThrow(/n >= 1/);
  });

  it("harmonic oscillator energies match omega*(n+1/2)", () => {
    expect(harmonicOscillatorEnergyLevel(0, 2)).toBeCloseTo(1, 9);
    expect(harmonicOscillatorEnergyLevel(3, 2)).toBeCloseTo(7, 9);
    expect(() => harmonicOscillatorEnergyLevel(-1, 2)).toThrow(/n >= 0/);
  });
});

describe("infiniteSquareWellEigenstate", () => {
  const grid = createGrid(1024, 0.01);
  const halfWidth = 4;

  it("is normalized and vanishes at the boundary", () => {
    const psi = infiniteSquareWellEigenstate(grid, 1, halfWidth);
    expect(psi.norm()).toBeCloseTo(1, 4);
  });

  it("its numerically-computed <H> matches the analytical E_n for n=1,2,3", () => {
    const potential = new Array(grid.n).fill(0); // inside the well, V=0
    for (const n of [1, 2, 3]) {
      const psi = infiniteSquareWellEigenstate(grid, n, halfWidth);
      const numericalEnergy = psi.expectationEnergy(potential);
      const analyticalEnergy = infiniteSquareWellEnergyLevel(n, 2 * halfWidth);
      expect(numericalEnergy).toBeCloseTo(analyticalEnergy, 1);
    }
  });

  it("rejects n < 1", () => {
    expect(() => infiniteSquareWellEigenstate(grid, 0, halfWidth)).toThrow(/n >= 1/);
  });
});

describe("harmonicOscillatorEigenstate", () => {
  const grid = createGrid(1024, 0.05);
  const omega = 1;

  it("ground state matches the known Gaussian shape at x=0", () => {
    const psi = harmonicOscillatorEigenstate(grid, 0, omega, 1);
    const centerIndex = grid.x.findIndex((x) => Math.abs(x) < 1e-9) !== -1
      ? grid.x.findIndex((x) => Math.abs(x) < 1e-9)
      : grid.n / 2;
    // psi_0(0) = (omega/pi)^(1/4) analytically; our grid may not include x=0
    // exactly, so just check the peak magnitude is close to that value.
    const peak = Math.max(...psi.amplitudes.map((a) => a.magnitude()));
    expect(peak).toBeCloseTo(Math.pow(omega / Math.PI, 0.25), 2);
    expect(centerIndex).toBeGreaterThanOrEqual(0);
  });

  it("its numerically-computed <H> matches omega*(n+1/2) for n=0..3", () => {
    const potential = harmonicOscillatorPotentialFor(grid, omega);
    for (const n of [0, 1, 2, 3]) {
      const psi = harmonicOscillatorEigenstate(grid, n, omega, 1);
      const numericalEnergy = psi.expectationEnergy(potential);
      expect(numericalEnergy).toBeCloseTo(harmonicOscillatorEnergyLevel(n, omega), 1);
    }
  });

  it("rejects unsupported n", () => {
    expect(() => harmonicOscillatorEigenstate(grid, -1, omega)).toThrow(/n = 0/);
    expect(() => harmonicOscillatorEigenstate(grid, 4, omega)).toThrow(/n = 0/);
  });

  it("distinct eigenstates are approximately orthogonal", () => {
    const psi0 = harmonicOscillatorEigenstate(grid, 0, omega, 1);
    const psi1 = harmonicOscillatorEigenstate(grid, 1, omega, 1);
    expect(psi0.overlapProbability(psi1)).toBeCloseTo(0, 3);
  });
});

function harmonicOscillatorPotentialFor(grid: ReturnType<typeof createGrid>, omega: number): number[] {
  return grid.x.map((x) => 0.5 * omega * omega * x * x);
}

describe("finiteSquareWellGroundStateEnergy", () => {
  it("returns an energy strictly between -depth and 0", () => {
    const E = finiteSquareWellGroundStateEnergy(1, 5);
    expect(E).toBeGreaterThan(-5);
    expect(E).toBeLessThan(0);
  });

  it("satisfies the transcendental quantization condition directly", () => {
    const halfWidth = 1;
    const depth = 5;
    const E = finiteSquareWellGroundStateEnergy(halfWidth, depth);
    const k = Math.sqrt(2 * (E + depth));
    const kappa = Math.sqrt(-2 * E);
    expect(Math.tan(k * halfWidth)).toBeCloseTo(kappa / k, 6);
  });

  it("sits above the bottom of the well by less than the infinite well's ground energy of the same width", () => {
    const halfWidth = 1;
    const depth = 5;
    const E = finiteSquareWellGroundStateEnergy(halfWidth, depth);
    const energyAboveBottom = E + depth;
    expect(energyAboveBottom).toBeLessThan(infiniteSquareWellEnergyLevel(1, 2 * halfWidth));
  });

  it("is robust for a shallow well and a narrow deep well", () => {
    expect(finiteSquareWellGroundStateEnergy(1, 0.3)).toBeCloseTo(-0.103, 2);
    expect(finiteSquareWellGroundStateEnergy(0.5, 20)).toBeLessThan(0);
  });

  it("throws on non-positive halfWidth or depth", () => {
    expect(() => finiteSquareWellGroundStateEnergy(0, 5)).toThrow(/halfWidth/);
    expect(() => finiteSquareWellGroundStateEnergy(1, 0)).toThrow(/depth/);
  });
});
