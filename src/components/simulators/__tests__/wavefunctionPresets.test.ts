import { describe, expect, it } from "vitest";
import { createGrid, Wavefunction1D } from "@/lib/quantum/wavefunction";
import {
  SplitOperatorEvolver,
  probabilityLeftAndRightOf,
  probabilityNearGridEdges,
  probabilityInsideBarrier,
} from "@/lib/quantum/timeEvolution";
import { barrierPotential, freeParticlePotential } from "@/lib/quantum/potentials";
import { PRESETS, defaultParamValues, getPreset } from "../wavefunction-explorer/presets";

/**
 * What the Wavefunction Explorer actually puts on screen, checked against
 * closed-form physics rather than against the engine that produced it.
 *
 * The engine's own suites already prove the split-operator method is
 * unitary and that the closed-form eigenstates are what they claim to be.
 * What nothing covered is the *configurations this instrument can be driven
 * into*: eight presets, each with sliders, evaluated at their ends rather
 * than at the author's defaults.
 */

/** The instrument's own automatic first playback, from WavefunctionSimulation's AUTOPLAY_FRAME_LIMIT. */
const AUTOPLAY_FRAMES = 260;

describe("wavefunction explorer presets", () => {
  it("starts every preset from a normalized state, at every slider extreme", () => {
    for (const preset of PRESETS) {
      const configurations = [defaultParamValues(preset)];
      for (const param of preset.params) {
        configurations.push({ ...defaultParamValues(preset), [param.key]: param.min });
        configurations.push({ ...defaultParamValues(preset), [param.key]: param.max });
      }
      for (const params of configurations) {
        const setup = preset.build(params);
        expect(setup.psi0.norm(), `${preset.id} ${JSON.stringify(params)}`).toBeCloseTo(1, 9);
        for (const amplitude of setup.psi0.amplitudes) {
          expect(Number.isFinite(amplitude.re) && Number.isFinite(amplitude.im)).toBe(true);
        }
      }
    }
  });

  /**
   * The number the "Analytical vs. numerical" panel puts an Error percentage
   * on. It is computed from the FFT-based kinetic energy plus the
   * position-space potential integral, so it is a genuinely independent
   * route to E_n = n²π²/(2mL²) and to hbar*omega*(n+1/2), not a restatement
   * of the closed forms the eigenstate presets are built from.
   */
  it("reproduces the closed-form energy level for every eigenstate preset at every slider extreme", () => {
    const cases: { id: Parameters<typeof getPreset>[0]; params: Record<string, number>; tolerancePercent: number }[] = [
      { id: "infinite-well-ground", params: { halfWidth: 2 }, tolerancePercent: 0.6 },
      { id: "infinite-well-ground", params: { halfWidth: 7 }, tolerancePercent: 0.6 },
      { id: "infinite-well-excited", params: { halfWidth: 2, n: 4 }, tolerancePercent: 0.6 },
      { id: "infinite-well-excited", params: { halfWidth: 7, n: 1 }, tolerancePercent: 0.6 },
      { id: "harmonic-ground", params: { omega: 0.5 }, tolerancePercent: 0.01 },
      { id: "harmonic-ground", params: { omega: 3 }, tolerancePercent: 0.01 },
      { id: "harmonic-excited", params: { omega: 0.5, n: 3 }, tolerancePercent: 0.01 },
      { id: "harmonic-excited", params: { omega: 3, n: 1 }, tolerancePercent: 0.01 },
    ];
    for (const { id, params, tolerancePercent } of cases) {
      const setup = getPreset(id).build(params);
      expect(setup.analyticalEnergy).toBeDefined();
      const numerical = setup.psi0.expectationEnergy(setup.potential, 1);
      const percentError = (100 * Math.abs(numerical - setup.analyticalEnergy!)) / Math.abs(setup.analyticalEnergy!);
      expect(percentError, `${id} ${JSON.stringify(params)}`).toBeLessThan(tolerancePercent);
    }
  });

  it("keeps every eigenstate preset stationary through a full autoplay pass", () => {
    for (const id of ["infinite-well-ground", "harmonic-ground", "harmonic-excited"] as const) {
      const preset = getPreset(id);
      const setup = preset.build(defaultParamValues(preset));
      const evolver = new SplitOperatorEvolver(setup.grid, setup.potential, setup.dt, 1);
      let psi = setup.psi0;
      for (let frame = 0; frame < AUTOPLAY_FRAMES; frame++) psi = evolver.stepMultiple(psi, setup.stepsPerFrame);
      expect(psi.norm(), `${id} norm`).toBeCloseTo(1, 9);
      // |psi(t)|^2 unchanged is what "stationary" means, and the panel shows it as a fidelity.
      expect(psi.overlapProbability(setup.psi0), `${id} fidelity`).toBeGreaterThan(0.99);
      const energy = psi.expectationEnergy(setup.potential, 1);
      expect(Math.abs(energy - setup.psi0.expectationEnergy(setup.potential, 1)), `${id} energy drift`).toBeLessThan(1e-6);
    }
  });
});

describe("periodic-box wrap detection", () => {
  it("is quiet while the packet is well inside the box and fires once it reaches the edge", () => {
    const grid = createGrid(512, 0.25);
    const potential = freeParticlePotential(grid);
    const evolver = new SplitOperatorEvolver(grid, potential, 0.02, 1);

    let psi = Wavefunction1D.gaussianPacket(grid, { center: 0, width: 1.5, momentum: 6 });
    expect(probabilityNearGridEdges(psi)).toBeLessThan(1e-9);

    // Ehrenfest: <x> advances at p/m while the packet is genuinely free.
    let previousMeanX = psi.expectationPosition();
    let wrapped = false;
    for (let frame = 0; frame < 260; frame++) {
      psi = evolver.stepMultiple(psi, 4);
      const meanX = psi.expectationPosition();
      if (probabilityNearGridEdges(psi) > 1e-3) {
        wrapped = true;
        break;
      }
      // Until the detector fires, the reported centre must still be moving
      // forward, which is exactly the claim the narration makes.
      expect(meanX).toBeGreaterThan(previousMeanX - 1e-9);
      previousMeanX = meanX;
    }
    expect(wrapped, "a momentum-6 packet must reach the box edge inside one autoplay pass").toBe(true);

    // Norm is still exactly 1 after wrapping: the Norm readout gives no
    // warning, which is why a separate detector is needed at all.
    expect(psi.norm()).toBeCloseTo(1, 9);
  });

  it("stays quiet for the whole autoplay pass at the free-particle preset's defaults", () => {
    const preset = getPreset("free-gaussian");
    const setup = preset.build(defaultParamValues(preset));
    const evolver = new SplitOperatorEvolver(setup.grid, setup.potential, setup.dt, 1);
    let psi = setup.psi0;
    for (let frame = 0; frame < AUTOPLAY_FRAMES; frame++) {
      psi = evolver.stepMultiple(psi, setup.stepsPerFrame);
      expect(probabilityNearGridEdges(psi)).toBeLessThan(1e-3);
    }
  });
});

describe("tunneling phase detection", () => {
  it("separates approaching, crossing, and settled, and only calls the split reflection/transmission when it is one", () => {
    const preset = getPreset("tunneling");
    const setup = preset.build({ momentum: 3, barrierHeight: 2, barrierHalfWidth: 1 });
    const evolver = new SplitOperatorEvolver(setup.grid, setup.potential, setup.dt, 1);
    let psi = setup.psi0;

    // t = 0: the whole packet is left of the barrier and has never touched
    // it. That is not a reflection probability of 1.
    expect(probabilityInsideBarrier(psi, setup.potential)).toBeLessThan(1e-4);
    expect(probabilityLeftAndRightOf(psi, setup.boundary!).right).toBeLessThan(1e-4);

    const phasesSeen = new Set<string>();
    for (let frame = 0; frame < 600; frame++) {
      psi = evolver.stepMultiple(psi, setup.stepsPerFrame);
      const inside = probabilityInsideBarrier(psi, setup.potential);
      const { left, right } = probabilityLeftAndRightOf(psi, setup.boundary!);
      expect(left + right).toBeCloseTo(1, 9);
      phasesSeen.add(inside > 1e-4 ? "crossing" : right > 1e-4 ? "settled" : "approaching");
      if (phasesSeen.has("settled") && probabilityNearGridEdges(psi) > 1e-3) break;
    }
    expect(phasesSeen.has("approaching")).toBe(true);
    expect(phasesSeen.has("crossing")).toBe(true);
    expect(phasesSeen.has("settled")).toBe(true);

    // Both outcomes are real: some of a sub-barrier packet gets through, and
    // some does not.
    const { left, right } = probabilityLeftAndRightOf(psi, setup.boundary!);
    expect(right).toBeGreaterThan(1e-3);
    expect(left).toBeGreaterThan(1e-3);
  });

  it("counts only the barrier region, wherever the barrier is put", () => {
    const grid = createGrid(256, 0.1);
    const potential = barrierPotential(grid, 4, 0.5, 3);
    const onBarrier = Wavefunction1D.gaussianPacket(grid, { center: 4, width: 0.2, momentum: 0 });
    const farAway = Wavefunction1D.gaussianPacket(grid, { center: -8, width: 0.2, momentum: 0 });
    expect(probabilityInsideBarrier(onBarrier, potential)).toBeGreaterThan(0.9);
    expect(probabilityInsideBarrier(farAway, potential)).toBeLessThan(1e-9);
  });
});
