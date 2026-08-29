import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { createGrid, Wavefunction1D } from "../wavefunction";
import { infiniteSquareWellEigenstate } from "../potentials";

describe("createGrid", () => {
  it("builds a centered grid with the expected spacing and length", () => {
    const grid = createGrid(8, 0.5);
    expect(grid.n).toBe(8);
    expect(grid.length).toBeCloseTo(4, 12);
    expect(grid.x[0]).toBeCloseTo(-2, 12);
    expect(grid.x[7]).toBeCloseTo(1.5, 12);
  });

  it("rejects a non-power-of-two n", () => {
    expect(() => createGrid(6, 0.5)).toThrow(/power-of-two/);
  });

  it("rejects a non-positive dx", () => {
    expect(() => createGrid(8, 0)).toThrow(/dx/);
    expect(() => createGrid(8, -1)).toThrow(/dx/);
  });
});

describe("Wavefunction1D construction", () => {
  it("rejects a mismatched amplitude count", () => {
    const grid = createGrid(8, 0.5);
    expect(() => new Wavefunction1D(grid, [Complex.ONE, Complex.ONE])).toThrow(/amplitude count/);
  });
});

describe("gaussianPacket", () => {
  const grid = createGrid(256, 0.1);

  it("is normalized", () => {
    const psi = Wavefunction1D.gaussianPacket(grid, { center: 0, width: 1, momentum: 0 });
    expect(psi.norm()).toBeCloseTo(1, 6);
  });

  it("has the expected mean position", () => {
    const psi = Wavefunction1D.gaussianPacket(grid, { center: 2.5, width: 1, momentum: 0 });
    expect(psi.expectationPosition()).toBeCloseTo(2.5, 3);
  });

  it("has the expected position variance (width^2)", () => {
    const psi = Wavefunction1D.gaussianPacket(grid, { center: 0, width: 0.8, momentum: 0 });
    expect(psi.variancePosition()).toBeCloseTo(0.8 * 0.8, 2);
  });

  it("has the expected mean momentum from its plane-wave phase", () => {
    const psi = Wavefunction1D.gaussianPacket(grid, { center: 0, width: 1, momentum: 3 });
    expect(psi.expectationMomentum()).toBeCloseTo(3, 1);
  });

  it("throws when normalizing a near-zero wavefunction", () => {
    const zero = new Wavefunction1D(grid, grid.x.map(() => Complex.ZERO));
    expect(() => zero.normalize()).toThrow(/near-zero/);
  });

  it("throws on a non-positive width", () => {
    expect(() => Wavefunction1D.gaussianPacket(grid, { center: 0, width: 0, momentum: 0 })).toThrow(/width/);
  });
});

describe("innerProduct / overlapProbability", () => {
  const grid = createGrid(256, 0.1);

  it("a normalized state has unit self-overlap", () => {
    const psi = Wavefunction1D.gaussianPacket(grid, { center: 0, width: 1, momentum: 0 });
    const selfOverlap = psi.innerProduct(psi);
    expect(selfOverlap.re).toBeCloseTo(1, 6);
    expect(selfOverlap.im).toBeCloseTo(0, 6);
  });

  it("distinct infinite-well eigenstates are approximately orthogonal", () => {
    const wellGrid = createGrid(512, 0.02);
    const psi1 = infiniteSquareWellEigenstate(wellGrid, 1, 5);
    const psi2 = infiniteSquareWellEigenstate(wellGrid, 2, 5);
    expect(psi1.overlapProbability(psi2)).toBeCloseTo(0, 3);
  });

  it("throws when grids differ", () => {
    const otherGrid = createGrid(128, 0.1);
    const a = Wavefunction1D.gaussianPacket(grid, { center: 0, width: 1, momentum: 0 });
    const b = Wavefunction1D.gaussianPacket(otherGrid, { center: 0, width: 1, momentum: 0 });
    expect(() => a.innerProduct(b)).toThrow(/same grid/);
  });
});

describe("superposition", () => {
  const grid = createGrid(512, 0.02);

  it("an equal superposition of two orthogonal eigenstates is normalized and has both amplitudes present", () => {
    const psi1 = infiniteSquareWellEigenstate(grid, 1, 5);
    const psi2 = infiniteSquareWellEigenstate(grid, 2, 5);
    const combined = Wavefunction1D.superposition([
      { psi: psi1, coefficient: new Complex(Math.SQRT1_2) },
      { psi: psi2, coefficient: new Complex(Math.SQRT1_2) },
    ]);
    expect(combined.norm()).toBeCloseTo(1, 6);
    // Each eigenstate should contribute ~50% probability weight to the combined state.
    expect(combined.overlapProbability(psi1)).toBeCloseTo(0.5, 2);
    expect(combined.overlapProbability(psi2)).toBeCloseTo(0.5, 2);
  });

  it("rejects an empty term list", () => {
    expect(() => Wavefunction1D.superposition([])).toThrow(/at least one term/);
  });

  it("rejects terms on mismatched grids", () => {
    const psi1 = infiniteSquareWellEigenstate(grid, 1, 5);
    const otherGrid = createGrid(256, 0.02);
    const psi2 = infiniteSquareWellEigenstate(otherGrid, 1, 5);
    expect(() =>
      Wavefunction1D.superposition([
        { psi: psi1, coefficient: Complex.ONE },
        { psi: psi2, coefficient: Complex.ONE },
      ])
    ).toThrow(/same grid/);
  });
});

describe("momentumStatistics", () => {
  it("matches expectationMomentum() and expectationKineticEnergy() called separately", () => {
    const grid = createGrid(256, 0.1);
    const psi = Wavefunction1D.gaussianPacket(grid, { center: 1, width: 1.2, momentum: 3 });
    const { meanMomentum, kineticEnergy } = psi.momentumStatistics(1);
    expect(meanMomentum).toBeCloseTo(psi.expectationMomentum(), 9);
    expect(kineticEnergy).toBeCloseTo(psi.expectationKineticEnergy(1), 9);
  });
});

describe("expectationPotential / expectationEnergy", () => {
  const grid = createGrid(64, 0.5);

  it("throws when the potential array length doesn't match the grid", () => {
    const psi = Wavefunction1D.gaussianPacket(grid, { center: 0, width: 1, momentum: 0 });
    expect(() => psi.expectationPotential([0, 0, 0])).toThrow(/grid.n/);
  });
});

describe("position and momentum are two views of the same wavefunction", () => {
  // These tie `Wavefunction1D`'s position-space sums to its momentum-space
  // ones. The two halves go through completely different machinery (a plain
  // Riemann sum over grid.x on one side, an FFT plus the momentum grid on
  // the other), so they are exactly the pair where a convention could drift
  // apart while each side's own tests kept passing.
  const grid = createGrid(512, 0.05);

  it("satisfies the Heisenberg uncertainty relation, with a Gaussian packet saturating it at exactly 1/2", () => {
    // A minimum-uncertainty (Gaussian) packet has Dx*Dp = hbar/2 = 1/2 in
    // these natural units, whatever its width or momentum — the strongest
    // available cross-check that Dx and Dp are measured in conjugate units
    // on grids that genuinely correspond.
    for (const width of [0.4, 0.8, 1.5]) {
      for (const momentum of [0, 1.3, -2.1]) {
        const psi = Wavefunction1D.gaussianPacket(grid, { center: 0, width, momentum });
        const product = Math.sqrt(psi.variancePosition()) * Math.sqrt(psi.varianceMomentum());
        expect(product, `width=${width} p=${momentum}`).toBeGreaterThan(0.5 - 1e-3);
        expect(product, `width=${width} p=${momentum}`).toBeCloseTo(0.5, 2);
      }
    }
  });

  it("keeps the uncertainty product above 1/2 for a non-Gaussian (two-packet) superposition", () => {
    const left = Wavefunction1D.gaussianPacket(grid, { center: -3, width: 0.6, momentum: 0 });
    const right = Wavefunction1D.gaussianPacket(grid, { center: 3, width: 0.6, momentum: 0 });
    const superposed = Wavefunction1D.superposition([
      { psi: left, coefficient: Complex.ONE },
      { psi: right, coefficient: Complex.ONE },
    ]);
    const product = Math.sqrt(superposed.variancePosition()) * Math.sqrt(superposed.varianceMomentum());
    expect(product).toBeGreaterThan(0.5);
  });

  it("leaves the momentum distribution unchanged when a packet is translated, while <x> follows the shift", () => {
    // Translating a wavefunction changes phi(k) only by a phase, so every
    // momentum *moment* is shift-invariant while every position moment
    // moves with it. Getting this wrong in either direction would mean the
    // two representations were referred to different coordinate origins.
    const reference = Wavefunction1D.gaussianPacket(grid, { center: 0, width: 0.7, momentum: 1.1 });
    for (const center of [-4, -1.5, 2.5]) {
      const shifted = Wavefunction1D.gaussianPacket(grid, { center, width: 0.7, momentum: 1.1 });
      expect(shifted.expectationPosition(), `center=${center}`).toBeCloseTo(center, 6);
      expect(shifted.expectationMomentum(), `center=${center}`).toBeCloseTo(reference.expectationMomentum(), 6);
      expect(shifted.varianceMomentum(), `center=${center}`).toBeCloseTo(reference.varianceMomentum(), 6);
    }
  });

  it("gives a free packet the kinetic energy <p^2>/2m = (<p>^2 + Dp^2)/2m its own momentum statistics imply", () => {
    for (const momentum of [0, 0.8, -1.7]) {
      const psi = Wavefunction1D.gaussianPacket(grid, { center: 0, width: 0.9, momentum });
      const expected = (psi.expectationMomentum() ** 2 + psi.varianceMomentum()) / 2;
      expect(psi.expectationKineticEnergy(), `p=${momentum}`).toBeCloseTo(expected, 9);
    }
  });
});
