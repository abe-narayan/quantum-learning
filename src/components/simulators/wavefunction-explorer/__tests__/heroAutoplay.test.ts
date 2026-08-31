import { describe, expect, it } from "vitest";
import {
  SplitOperatorEvolver,
  probabilityInsideBarrier,
  probabilityLeftAndRightOf,
  probabilityNearGridEdges,
} from "@/lib/quantum/timeEvolution";
import type { Wavefunction1D } from "@/lib/quantum/wavefunction";
import { defaultParamValues, getPreset } from "../presets";
import { autoplayFrameLimit, DEFAULT_AUTOPLAY_FRAMES, hasWrappedAround } from "../autoplayRun";
import {
  FAR_SIDE_MAGNIFICATION,
  heroDisplay,
  heroNarration,
  HERO_PRESET_IDS,
  tunnelingPhase,
  type HeroPresetId,
} from "../heroRun";

/**
 * What the homepage hero's three autoplay runs actually end on.
 *
 * Every number here comes from the same `SplitOperatorEvolver` the browser
 * runs, at each preset's own defaults and its own frame budget, so the test
 * fails if a change to the preset, the budget or the packet's starting
 * position moves the picture a reader is shown.
 *
 * The tunneling case is the one this file exists for. The hero used to stop
 * every preset at a flat 260 frames, and on that preset the packet was still
 * arriving: mean position -2.71, 11.4% of the probability inside the wall,
 * nothing yet on the far side. It froze mid-collision, so the one thing the
 * preset is named for never appeared.
 */

function runToFrame(presetId: HeroPresetId, frames: number) {
  const preset = getPreset(presetId);
  const setup = preset.build(defaultParamValues(preset));
  const evolver = new SplitOperatorEvolver(setup.grid, setup.potential, setup.dt, 1);
  let psi = setup.psi0;
  for (let frame = 0; frame < frames; frame++) psi = evolver.stepMultiple(psi, setup.stepsPerFrame);
  return { setup, psi };
}

/** The tallest density inside [lo, hi], and where it is. */
function peak(psi: Wavefunction1D, lo: number, hi: number): { value: number; at: number } {
  const density = psi.probabilityDensity();
  let value = 0;
  let at = Number.NaN;
  for (let i = 0; i < psi.grid.n; i++) {
    if (psi.grid.x[i] >= lo && psi.grid.x[i] <= hi && density[i] > value) {
      value = density[i];
      at = psi.grid.x[i];
    }
  }
  return { value, at };
}

describe("hero autoplay: tunneling", () => {
  const preset = getPreset("tunneling");
  const defaults = preset.build(defaultParamValues(preset));
  const limit = autoplayFrameLimit(defaults);
  const barrier = defaults.barrier!;
  const farSide = barrier.center + barrier.halfWidth;

  it("ends the run with the collision over and both lobes on screen", () => {
    const { setup, psi } = runToFrame("tunneling", limit);

    // The split is the claim the homepage makes in prose ("about 1 time in
    // 100 ... a little more than the single-energy formula's 1.24%"), so it is
    // pinned tightly rather than loosely.
    const { left, right } = probabilityLeftAndRightOf(psi, farSide);
    expect(left + right).toBeCloseTo(1, 9);
    expect(right).toBeGreaterThan(0.025);
    expect(right).toBeLessThan(0.03);

    // The collision is over, not in progress: what is left inside the wall is
    // a hundredth of a percent.
    expect(probabilityInsideBarrier(psi, setup.potential)).toBeLessThan(1e-4);
    expect(tunnelingPhase(psi, setup)).toBe("settled");

    // Two separated objects, not one smear across a barrier. Both peaks are
    // clear of the wall and 20+ units apart on a 64-unit display window.
    const reflected = peak(psi, setup.grid.x[0], barrier.center - barrier.halfWidth);
    const transmitted = peak(psi, farSide, setup.grid.x[setup.grid.n - 1]);
    expect(reflected.at).toBeLessThan(-8);
    expect(transmitted.at).toBeGreaterThan(8);
    expect(transmitted.at - reflected.at).toBeGreaterThan(20);

    // And the periodic box has not begun to wrap, so the numbers above still
    // describe one packet.
    expect(probabilityNearGridEdges(psi)).toBeLessThan(1e-5);
    expect(hasWrappedAround(psi)).toBe(false);
  });

  it("stops inside a window that is real at both ends", () => {
    // Non-vacuity, half of it: at half the budget the run has NOT settled, so
    // the limit is not a number any earlier frame would also have satisfied.
    const early = runToFrame("tunneling", Math.round(limit / 2));
    expect(tunnelingPhase(early.psi, early.setup)).toBe("crossing");
    expect(probabilityInsideBarrier(early.psi, early.setup.potential)).toBeGreaterThan(0.05);

    // The other half: run on, and the periodic box wraps the reflected packet
    // back in from the right, turning a measured 2.7% into nonsense. So "just
    // run it longer" is wrong, the window has a far edge, and the budget sits
    // inside it.
    const late = runToFrame("tunneling", 3 * limit);
    expect(hasWrappedAround(late.psi)).toBe(true);
    expect(probabilityLeftAndRightOf(late.psi, farSide).right).toBeGreaterThan(0.1);
  });

  it("magnifies the far side by enough to see and not so much as to overflow", () => {
    const { setup, psi } = runToFrame("tunneling", limit);
    const reflected = peak(psi, setup.grid.x[0], barrier.center - barrier.halfWidth);
    const transmitted = peak(psi, farSide, setup.grid.x[setup.grid.n - 1]);

    // Unmagnified, the transmitted lobe is ~3% of the frame's tallest point:
    // about 3 CSS pixels in the narrowest box the homepage paints this in.
    const trueRatio = transmitted.value / reflected.value;
    expect(trueRatio).toBeLessThan(0.05);

    // Magnified, it is a clearly visible second object that still reads as
    // much the smaller of the two lobes. The upper bound is the load-bearing
    // one: a magnified trace that stands as tall as the reflected packet
    // argues against its own caption.
    const drawnRatio = trueRatio * FAR_SIDE_MAGNIFICATION;
    expect(drawnRatio).toBeGreaterThan(0.2);
    expect(drawnRatio).toBeLessThan(0.5);
  });

  it("keeps every frame of the run inside the display window it plots", () => {
    const display = heroDisplay("tunneling", defaults);
    const [windowMin, windowMax] = display.xWindow!;
    const evolver = new SplitOperatorEvolver(defaults.grid, defaults.potential, defaults.dt, 1);
    let psi = defaults.psi0;
    let worstOutside = 0;
    for (let frame = 0; frame <= limit; frame++) {
      const density = psi.probabilityDensity();
      let outside = 0;
      for (let i = 0; i < defaults.grid.n; i++) {
        const x = defaults.grid.x[i];
        if (x < windowMin || x > windowMax) outside += density[i] * defaults.grid.dx;
      }
      worstOutside = Math.max(worstOutside, outside);
      psi = evolver.stepMultiple(psi, defaults.stepsPerFrame);
    }
    // Cropping the plot to this window is a zoom, not a truncation.
    expect(worstOutside).toBeLessThan(1e-4);

    // The wall a reader is told the packet cannot get over really is taller
    // than the packet's energy, and both fit in the frame.
    const energy = defaults.psi0.expectationEnergy(defaults.potential, 1);
    expect(energy).toBeLessThan(barrier.height);
    expect(display.energyLevel).toBeCloseTo(energy, 12);
    expect(display.energyCeiling).toBeGreaterThan(barrier.height);
  });

  it("narrates the phase it is actually in, with the fraction it measured", () => {
    const approaching = runToFrame("tunneling", 10);
    expect(heroNarration("tunneling", approaching.psi, approaching.setup)).toContain("does not carry the energy");

    const { setup, psi } = runToFrame("tunneling", limit);
    const settled = heroNarration("tunneling", psi, setup);
    const measured = probabilityLeftAndRightOf(psi, farSide).right;
    // The percentage in the sentence is read off the state, never typed.
    expect(settled).toContain(`${(100 * measured).toFixed(1)}%`);
    expect(settled).toContain(`magnified ${FAR_SIDE_MAGNIFICATION}x`);
  });
});

describe("hero autoplay: the other two presets", () => {
  it("shows a free packet visibly spreading, and stops before the box wraps", () => {
    const preset = getPreset("free-gaussian");
    const setup = preset.build(defaultParamValues(preset));
    expect(autoplayFrameLimit(setup)).toBe(DEFAULT_AUTOPLAY_FRAMES);

    const { psi } = runToFrame("free-gaussian", DEFAULT_AUTOPLAY_FRAMES);
    const initialWidth = Math.sqrt(setup.psi0.variancePosition());
    const finalWidth = Math.sqrt(psi.variancePosition());
    expect(finalWidth / initialWidth).toBeGreaterThan(3);
    expect(hasWrappedAround(psi)).toBe(false);

    // The sentence under the figure quotes the width it measured.
    expect(heroNarration("free-gaussian", psi, setup)).toContain(`${(finalWidth / initialWidth).toFixed(1)}x`);
  });

  it("shows the harmonic superposition come back at least once", () => {
    const preset = getPreset("harmonic-superposition");
    const setup = preset.build(defaultParamValues(preset));
    const evolver = new SplitOperatorEvolver(setup.grid, setup.potential, setup.dt, 1);
    let psi = setup.psi0;
    let previous = psi.expectationPosition();
    let turningPoints = 0;
    let direction = 0;
    for (let frame = 0; frame < DEFAULT_AUTOPLAY_FRAMES; frame++) {
      psi = evolver.stepMultiple(psi, setup.stepsPerFrame);
      const meanX = psi.expectationPosition();
      const nextDirection = Math.sign(meanX - previous);
      if (nextDirection !== 0 && direction !== 0 && nextDirection !== direction) turningPoints += 1;
      if (nextDirection !== 0) direction = nextDirection;
      previous = meanX;
    }
    // Two turning points is one full there-and-back: enough that the motion
    // reads as an oscillation rather than a drift.
    expect(turningPoints).toBeGreaterThanOrEqual(2);
    expect(hasWrappedAround(psi)).toBe(false);
  });

  it("gives every hero preset a legend, a figure label and something to try", () => {
    for (const id of HERO_PRESET_IDS) {
      const preset = getPreset(id);
      const setup = preset.build(defaultParamValues(preset));
      const display = heroDisplay(id, setup);
      expect(display.ariaLabel.length).toBeGreaterThan(20);
      expect(display.energyCeiling).toBeGreaterThan(0);
      // A drawn energy line always has a potential to be read against.
      if (display.energyLevel !== undefined) expect(display.potential).not.toBe("hidden");
    }
  });
});
