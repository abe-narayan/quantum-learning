import { Complex } from "@/lib/quantum/complex";
import { createGrid, Wavefunction1D, type Grid1D } from "@/lib/quantum/wavefunction";
import {
  freeParticlePotential,
  harmonicOscillatorPotential,
  infiniteSquareWellPotential,
  barrierPotential,
  infiniteSquareWellEigenstate,
  harmonicOscillatorEigenstate,
  infiniteSquareWellEnergyLevel,
  harmonicOscillatorEnergyLevel,
} from "@/lib/quantum/potentials";

export type PresetId =
  | "free-gaussian"
  | "infinite-well-ground"
  | "infinite-well-excited"
  | "harmonic-ground"
  | "harmonic-excited"
  | "harmonic-superposition"
  | "superposition"
  | "tunneling";

/** One adjustable numeric parameter a preset exposes, rendered as a slider by PresetControls. */
export type ParamSpec = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit?: string;
};

export type PresetSetup = {
  grid: Grid1D;
  potential: number[];
  psi0: Wavefunction1D;
  dt: number;
  stepsPerFrame: number;
  /** The known closed-form energy this state should have, if it's an energy eigenstate; undefined otherwise. */
  analyticalEnergy?: number;
  /** Whether |psi(x)|^2 is expected to stay fixed under time evolution (an eigenstate); drives the comparison UI. */
  isStationary: boolean;
  /** For the tunneling preset: the x value separating "reflected" from "transmitted" probability. */
  boundary?: number;
  /**
   * Rectangular-barrier geometry, for presets that have one. Display code
   * needs the two edges and the height to draw the wall as an object rather
   * than as a dashed polyline, and recovering them from the `potential` array
   * afterwards is guesswork (the array cannot say whether a nonzero region is
   * a barrier, a well wall or the arm of a parabola).
   */
  barrier?: { center: number; halfWidth: number; height: number };
  /**
   * How many animation frames one automatic playback pass should run for
   * *this* configuration, when the physics wants something other than the
   * shared default. Both autoplaying components (the homepage hero and the
   * `/simulators` bench) treat this as the frame budget for their one
   * self-stopping pass; see TUNNELING_AUTOPLAY_FRAMES for the only preset
   * that currently sets it, and why.
   */
  autoplayFrames?: number;
};

export type PresetDefinition = {
  id: PresetId;
  label: string;
  description: string;
  params: ParamSpec[];
  build: (params: Record<string, number>) => PresetSetup;
};

/**
 * A finite wall height for the "infinite" well presets; see
 * infiniteSquareWellPotential's doc comment for why a literal infinity
 * isn't used. This value is a deliberate balance, not an arbitrary one:
 * tall enough (thousands of times the confined states' energies, for every
 * n and half-width this simulator's sliders allow) that tunneling leakage
 * is astronomically negligible, but small enough that dt * wallHeight stays
 * well under 1: the split-operator method's per-step Trotter error scales
 * with the potential step's phase angle (V*dt), so a wall of 1e6 with the
 * dt these presets otherwise use produces a numerically well-behaved
 * *state* (norm and shape are unconditionally preserved) but a wildly
 * inaccurate *energy expectation value*, since <p^2> is disproportionately
 * sensitive to whatever small high-frequency content leaks past an
 * under-resolved wall step. Paired with dt=0.0002 below, wallHeight*dt=0.04.
 */
const INFINITE_WELL_WALL_HEIGHT = 200;

function defaultsOf(params: ParamSpec[]): Record<string, number> {
  return Object.fromEntries(params.map((p) => [p.key, p.default]));
}

export function defaultParamValues(preset: PresetDefinition): Record<string, number> {
  return defaultsOf(preset.params);
}

const FREE_GAUSSIAN: PresetDefinition = {
  id: "free-gaussian",
  label: "Free Gaussian Packet",
  description: "A localized wave packet with no potential. Watch it drift at its group velocity and spread (disperse) over time.",
  params: [
    { key: "center", label: "Starting position", min: -30, max: 0, step: 0.5, default: -15 },
    { key: "width", label: "Packet width (σ)", min: 0.5, max: 4, step: 0.1, default: 1.5 },
    { key: "momentum", label: "Momentum", min: -6, max: 6, step: 0.2, default: 2 },
  ],
  build: (p) => {
    const grid = createGrid(512, 0.25);
    const potential = freeParticlePotential(grid);
    const psi0 = Wavefunction1D.gaussianPacket(grid, { center: p.center, width: p.width, momentum: p.momentum });
    return { grid, potential, psi0, dt: 0.02, stepsPerFrame: 4, isStationary: false };
  },
};

const INFINITE_WELL_GROUND: PresetDefinition = {
  id: "infinite-well-ground",
  label: "Infinite Well: Ground State",
  description: "The lowest-energy standing wave in an infinite square well: a true energy eigenstate, so its probability density should stay perfectly fixed as it evolves.",
  params: [{ key: "halfWidth", label: "Well half-width", min: 2, max: 7, step: 0.5, default: 5 }],
  build: (p) => {
    const grid = createGrid(512, 0.03);
    const potential = infiniteSquareWellPotential(grid, p.halfWidth, INFINITE_WELL_WALL_HEIGHT);
    const psi0 = infiniteSquareWellEigenstate(grid, 1, p.halfWidth);
    return {
      grid,
      potential,
      psi0,
      dt: 0.0002,
      stepsPerFrame: 100,
      analyticalEnergy: infiniteSquareWellEnergyLevel(1, 2 * p.halfWidth),
      isStationary: true,
    };
  },
};

const INFINITE_WELL_EXCITED: PresetDefinition = {
  id: "infinite-well-excited",
  label: "Infinite Well: Excited State",
  description: "A higher energy level in the same well: still perfectly stationary, but with more nodes (points where the probability density touches zero).",
  params: [
    { key: "halfWidth", label: "Well half-width", min: 2, max: 7, step: 0.5, default: 5 },
    { key: "n", label: "Energy level n", min: 1, max: 4, step: 1, default: 3 },
  ],
  build: (p) => {
    const grid = createGrid(512, 0.03);
    const n = Math.round(p.n);
    const potential = infiniteSquareWellPotential(grid, p.halfWidth, INFINITE_WELL_WALL_HEIGHT);
    const psi0 = infiniteSquareWellEigenstate(grid, n, p.halfWidth);
    return {
      grid,
      potential,
      psi0,
      dt: 0.0002,
      stepsPerFrame: 100,
      analyticalEnergy: infiniteSquareWellEnergyLevel(n, 2 * p.halfWidth),
      isStationary: true,
    };
  },
};

const HARMONIC_GROUND: PresetDefinition = {
  id: "harmonic-ground",
  label: "Harmonic Oscillator: Ground State",
  description: "The Gaussian ground state of a parabolic potential well: the same zero-point-energy state derived algebraically with ladder operators in the last course, now as an actual position-space wavefunction.",
  params: [{ key: "omega", label: "Angular frequency ω", min: 0.5, max: 3, step: 0.1, default: 1 }],
  build: (p) => {
    const grid = createGrid(512, 0.05);
    const potential = harmonicOscillatorPotential(grid, p.omega);
    const psi0 = harmonicOscillatorEigenstate(grid, 0, p.omega);
    return {
      grid,
      potential,
      psi0,
      dt: 0.005,
      stepsPerFrame: 8,
      analyticalEnergy: harmonicOscillatorEnergyLevel(0, p.omega),
      isStationary: true,
    };
  },
};

const HARMONIC_EXCITED: PresetDefinition = {
  id: "harmonic-excited",
  label: "Harmonic Oscillator: Excited State",
  description: "A higher rung on the harmonic oscillator's ladder: energy hbar*omega above the one below it, exactly as derived algebraically, now visualized as a wavefunction with an extra node.",
  params: [
    { key: "omega", label: "Angular frequency ω", min: 0.5, max: 3, step: 0.1, default: 1 },
    { key: "n", label: "Energy level n", min: 1, max: 3, step: 1, default: 1 },
  ],
  build: (p) => {
    const grid = createGrid(512, 0.05);
    const n = Math.round(p.n);
    const potential = harmonicOscillatorPotential(grid, p.omega);
    const psi0 = harmonicOscillatorEigenstate(grid, n, p.omega);
    return {
      grid,
      potential,
      psi0,
      dt: 0.005,
      stepsPerFrame: 8,
      analyticalEnergy: harmonicOscillatorEnergyLevel(n, p.omega),
      isStationary: true,
    };
  },
};

const HARMONIC_SUPERPOSITION: PresetDefinition = {
  id: "harmonic-superposition",
  label: "Harmonic Oscillator: Superposition",
  description: "An equal superposition of the ground and first-excited harmonic-oscillator states is not itself an energy eigenstate: unlike either state alone, its probability density visibly sloshes back and forth at the classical oscillation frequency omega, a direct quantum echo of a classical mass on a spring.",
  params: [{ key: "omega", label: "Angular frequency ω", min: 0.5, max: 3, step: 0.1, default: 1 }],
  build: (p) => {
    const grid = createGrid(512, 0.05);
    const potential = harmonicOscillatorPotential(grid, p.omega);
    const psi0Ground = harmonicOscillatorEigenstate(grid, 0, p.omega);
    const psi1Excited = harmonicOscillatorEigenstate(grid, 1, p.omega);
    const psi0 = Wavefunction1D.superposition([
      { psi: psi0Ground, coefficient: new Complex(Math.SQRT1_2) },
      { psi: psi1Excited, coefficient: new Complex(Math.SQRT1_2) },
    ]);
    return { grid, potential, psi0, dt: 0.005, stepsPerFrame: 8, isStationary: false };
  },
};

const SUPERPOSITION: PresetDefinition = {
  id: "superposition",
  label: "Superposition of Two Eigenstates",
  description: "An equal superposition of two well eigenstates is not itself an eigenstate: its probability density visibly oscillates (\"beats\") at a frequency set exactly by the energy difference between the two levels.",
  params: [
    { key: "halfWidth", label: "Well half-width", min: 2, max: 7, step: 0.5, default: 5 },
    { key: "n2", label: "Second level n", min: 2, max: 4, step: 1, default: 2 },
  ],
  build: (p) => {
    const grid = createGrid(512, 0.03);
    const n2 = Math.round(p.n2);
    const potential = infiniteSquareWellPotential(grid, p.halfWidth, INFINITE_WELL_WALL_HEIGHT);
    const psi1 = infiniteSquareWellEigenstate(grid, 1, p.halfWidth);
    const psi2 = infiniteSquareWellEigenstate(grid, n2, p.halfWidth);
    const psi0 = Wavefunction1D.superposition([
      { psi: psi1, coefficient: new Complex(Math.SQRT1_2) },
      { psi: psi2, coefficient: new Complex(Math.SQRT1_2) },
    ]);
    return { grid, potential, psi0, dt: 0.0002, stepsPerFrame: 150, isStationary: false };
  },
};

/**
 * Where the incident packet starts, and how long one autoplay pass runs.
 * Both numbers are set by the same measurement, taken on the real evolver at
 * this preset's defaults (dt = 0.005, stepsPerFrame = 8, so 0.04 time units
 * per frame; momentum 2, barrier height 3, half-width 1, packet width 2).
 *
 * The packet used to start at x = -20. At the group velocity p/m = 2 that is
 * 250 frames of a bump sliding rightwards *before anything happens*, and the
 * autoplay pass then in force stopped at frame 260: mean position -2.71,
 * still left of the barrier, 11.4% of the probability sitting inside the wall
 * mid-collision. The homepage hero and the `/simulators` bench both showed a
 * packet approaching a barrier and freezing. Nothing tunneled on screen.
 *
 * Starting at x = -10 costs nothing physically. The transmitted fraction is
 * fixed by |phi(k)|^2, which free evolution leaves exactly invariant, so it
 * settles at the same 2.708% either way (verified: identical to four decimal
 * places), and at 5 sigma from the barrier the packet's initial overlap with
 * it is 3.8e-6.
 *
 * From there the run reads, in frames: arrival at ~60, the collision peaking
 * at ~120 (20.1% of the probability inside the wall), the transmitted lobe
 * clear of the barrier by ~180, and the split settled from ~200 onwards
 * (2.708%, drifting by less than 0.001 of a percentage point after that).
 *
 * 300 is where the pass stops, and the reason is separation rather than
 * settling: at frame 300 the reflected peak sits at x = -14.5 and the
 * transmitted peak at x = +17.3, about 32 units apart on a grid whose useful
 * window is 64 wide, with 1e-5 of the probability left inside the wall. A
 * reader sees two objects, not one object smeared across a barrier.
 *
 * The far end of the window is the periodic box. The FFT makes the grid
 * wrap, so the reflected packet eventually re-enters from the right and
 * P(transmitted) climbs to a meaningless 18.9%: `probabilityNearGridEdges`
 * first exceeds 1e-3 at frame ~515, and by 660 the reported transmission is
 * visibly corrupted. Stopping at 300 leaves a margin of over 200 frames.
 * That margin is comfortable at the defaults and not at the ends of the
 * sliders (momentum 6 crosses the barrier classically and reaches the edge by
 * frame ~240), which is why both autoplaying components also stop the pass
 * the moment the wrap detector fires, rather than trusting the count alone.
 */
const TUNNELING_PACKET_CENTER = -10;
const TUNNELING_PACKET_WIDTH = 2;
const TUNNELING_AUTOPLAY_FRAMES = 300;

const TUNNELING: PresetDefinition = {
  id: "tunneling",
  label: "Tunneling Through a Barrier",
  description: "A wave packet aimed at a rectangular energy barrier. Classically, if the packet's energy is below the barrier height it could never cross; quantum mechanically, part of it always does.",
  params: [
    // Default momentum=2, barrierHeight=3 keeps the packet's kinetic energy
    // (p^2/2m = 2, hbar=m=1 as elsewhere in this file) below the barrier
    // height by a clear margin on first load, so the preset actually shows
    // sub-barrier tunneling out of the box rather than ordinary classical
    // transmission (E > V). The slider ranges are untouched, so raising
    // momentum or lowering barrier height still lets a user cross into the
    // classical-transmission regime to contrast the two; see the "Try
    // this" copy in WavefunctionExplorer.tsx.
    { key: "momentum", label: "Momentum", min: 1, max: 6, step: 0.2, default: 2 },
    { key: "barrierHeight", label: "Barrier height", min: 0.5, max: 8, step: 0.25, default: 3 },
    { key: "barrierHalfWidth", label: "Barrier half-width", min: 0.25, max: 3, step: 0.25, default: 1 },
  ],
  build: (p) => {
    const grid = createGrid(1024, 0.1);
    const potential = barrierPotential(grid, 0, p.barrierHalfWidth, p.barrierHeight);
    const psi0 = Wavefunction1D.gaussianPacket(grid, {
      center: TUNNELING_PACKET_CENTER,
      width: TUNNELING_PACKET_WIDTH,
      momentum: p.momentum,
    });
    return {
      grid,
      potential,
      psi0,
      dt: 0.005,
      stepsPerFrame: 8,
      isStationary: false,
      boundary: 0,
      barrier: { center: 0, halfWidth: p.barrierHalfWidth, height: p.barrierHeight },
      autoplayFrames: TUNNELING_AUTOPLAY_FRAMES,
    };
  },
};

export const PRESETS: PresetDefinition[] = [
  FREE_GAUSSIAN,
  INFINITE_WELL_GROUND,
  INFINITE_WELL_EXCITED,
  HARMONIC_GROUND,
  HARMONIC_EXCITED,
  HARMONIC_SUPERPOSITION,
  SUPERPOSITION,
  TUNNELING,
];

export function getPreset(id: PresetId): PresetDefinition {
  const preset = PRESETS.find((p) => p.id === id);
  if (!preset) throw new Error(`Unknown preset id: ${id}`);
  return preset;
}
