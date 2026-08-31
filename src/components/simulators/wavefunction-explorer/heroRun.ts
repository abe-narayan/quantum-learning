import { probabilityInsideBarrier, probabilityLeftAndRightOf } from "@/lib/quantum/timeEvolution";
import type { Wavefunction1D } from "@/lib/quantum/wavefunction";
import type { PresetId, PresetSetup } from "./presets";

/**
 * Everything about the homepage hero's autoplay run that is decided by
 * physics rather than by React: how long a pass lasts, when it has to stop
 * early, which phase of the run a state is in, what the figure draws, and
 * what the sentence under it says.
 *
 * It lives in a plain module rather than inside the "use client" component so
 * the numbers below can be pinned against the real evolver in a node test
 * (`__tests__/heroRun.test.ts`) without rendering anything.
 */

// `satisfies` rather than a plain annotation: the literal union is what types
// the label and copy records below, and the check still fails the build if one
// of these ever stops being a real preset id.
export const HERO_PRESET_IDS = [
  "free-gaussian",
  "tunneling",
  "harmonic-superposition",
] as const satisfies readonly PresetId[];
export type HeroPresetId = (typeof HERO_PRESET_IDS)[number];

/**
 * The three buttons, in plain words rather than in the preset registry's
 * technical labels ("Free Gaussian Packet", "Harmonic Oscillator:
 * Superposition"). This is the first thing a first-time visitor reads on the
 * homepage; `/simulators` keeps the technical names.
 */
export const HERO_PRESET_LABELS: Record<HeroPresetId, string> = {
  "free-gaussian": "Free particle",
  tunneling: "Tunnel through a barrier",
  "harmonic-superposition": "Harmonic oscillator",
};

/**
 * How much the far side of the barrier is magnified in the hero figure.
 *
 * The transmitted lobe carries 2.708% of the probability, and because it is
 * about as wide as the reflected one, its *peak* is 3.1% of the reflected
 * peak (measured at the stop frame). On this figure's 248-unit plot that is
 * 7.7 units: 3 CSS pixels in the narrowest box the homepage paints it in.
 * Drawn honestly and unaided, the whole point of the preset is invisible.
 *
 * 10x puts that peak at 31% of the plot height: about 30 CSS pixels in the
 * narrowest box and 90 in the widest, so it is unmissable, while still
 * reading as much the smaller of the two lobes. The bound at the top matters
 * as much as the one at the bottom. Measured at 20x the magnified trace
 * reaches 64% of the reflected peak, and a picture where the two lobes look
 * comparable argues against its own caption.
 *
 * The true curve is still drawn underneath it, the magnified trace is a
 * different colour, and the legend and the sentence under the figure both say
 * the factor out loud. `__tests__/heroAutoplay.test.ts` pins the product
 * against the real evolver, so a change that moved the transmitted fraction
 * would fail rather than quietly leave a mislabelled picture.
 */
export const FAR_SIDE_MAGNIFICATION = 10;

/** Which part of the tunneling story a given state is in. */
export type TunnelingPhase = "approaching" | "crossing" | "settled";

/**
 * Approaching, crossing, or settled, from the state itself.
 *
 * The left/right probability split cannot tell these apart on its own:
 * before the packet arrives, all of its probability is already left of the
 * barrier, and calling that "100% reflected" describes something that has not
 * happened yet. Overlap with the barrier is what separates them.
 */
export function tunnelingPhase(psi: Wavefunction1D, setup: PresetSetup): TunnelingPhase {
  const inside = probabilityInsideBarrier(psi, setup.potential);
  if (inside > 1e-3) return "crossing";
  const boundary = setup.barrier ? setup.barrier.center + setup.barrier.halfWidth : (setup.boundary ?? 0);
  return probabilityLeftAndRightOf(psi, boundary).right > 1e-3 ? "settled" : "approaching";
}

/** The transmitted fraction as a reader should see it: one decimal, never "0.0%" for something nonzero. */
export function formatFraction(fraction: number): string {
  const percent = 100 * fraction;
  return `${percent < 0.1 ? percent.toFixed(2) : percent.toFixed(1)}%`;
}

/** How much wider the packet is than the state it started from. */
function spreadRatio(psi: Wavefunction1D, psi0: Wavefunction1D): number {
  const initial = Math.sqrt(Math.max(psi0.variancePosition(), 0));
  if (!(initial > 0)) return 1;
  return Math.sqrt(Math.max(psi.variancePosition(), 0)) / initial;
}

/**
 * What is on screen right now, in words a reader who has never seen a
 * wavefunction can act on. One or two short sentences: the homepage
 * introduces the phenomenon, the lesson teaches the mathematics.
 */
export function heroNarration(id: HeroPresetId, psi: Wavefunction1D, setup: PresetSetup): string {
  if (id === "free-gaussian") {
    const ratio = spreadRatio(psi, setup.psi0);
    return ratio < 1.15
      ? "The hill is where the particle probably is: tall where you are likely to find it, flat where you are not."
      : `The hill is where the particle probably is. Nothing is pushing on it, and it is already ${ratio.toFixed(
          1
        )}x as wide as it started.`;
  }

  if (id === "harmonic-superposition") {
    return "Two energy levels added together. Either one alone would hold perfectly still; their sum slides back and forth like a mass on a spring.";
  }

  const phase = tunnelingPhase(psi, setup);
  if (phase === "approaching") {
    return "The hill is where the particle probably is. The block ahead is a wall, and the packet does not carry the energy to get over it.";
  }
  if (phase === "crossing") {
    return "The packet is meeting the wall now. A classical particle with this much energy would come straight back, all of it.";
  }
  const boundary = setup.barrier ? setup.barrier.center + setup.barrier.halfWidth : (setup.boundary ?? 0);
  const transmitted = probabilityLeftAndRightOf(psi, boundary).right;
  return `${formatFraction(
    transmitted
  )} of it is past a wall it could not get over; the rest bounced back. The far piece is magnified ${FAR_SIDE_MAGNIFICATION}x here.`;
}

/** One thing the reader can do next, from the controls actually in front of them. */
export const HERO_TRY_THIS: Record<HeroPresetId, string> = {
  "free-gaussian": "Try this: switch to the barrier and watch the same packet meet something that pushes back.",
  tunneling: "Try this: open the full explorer and raise the barrier height. What gets through falls away exponentially.",
  "harmonic-superposition": "Try this: switch to the free particle and see what the same packet does with nothing holding it in.",
};

export type HeroLegendTone = "density" | "structure" | "energy" | "magnified";

export type HeroLegendItem = { key: string; label: string; tone: HeroLegendTone };

/**
 * The figure's key, in plain language and in HTML rather than in the SVG.
 *
 * `WavefunctionCanvas` carries a long note on how hard it is to keep SVG
 * `<text>` legible at this viewBox in a phone-width box, and on the fact that
 * `role="img"` prunes it from the accessibility tree so it is never announced
 * either. The hero sidesteps both: it has no SVG type at all, and its key is
 * ordinary 12px HTML above the plot, at every width.
 */
export function heroLegend(id: HeroPresetId): HeroLegendItem[] {
  const density: HeroLegendItem = {
    key: "density",
    label: "Where the particle probably is",
    tone: "density",
  };
  if (id === "free-gaussian") return [density];
  if (id === "harmonic-superposition") {
    return [
      density,
      { key: "well", label: "- - - The well it is held in", tone: "structure" },
      { key: "energy", label: "- - - Its energy", tone: "energy" },
    ];
  }
  return [
    density,
    { key: "wall", label: "The wall", tone: "structure" },
    { key: "energy", label: "- - - Its energy, below the top of the wall", tone: "energy" },
    // The "- - -" prefix is this codebase's key for a dashed trace, and the
    // magnified far side is dashed for a reason the canvas spells out: on a
    // cyan pillar its colour and the density's are the same hue.
    { key: "far", label: `- - - Got through, magnified ${FAR_SIDE_MAGNIFICATION}x`, tone: "magnified" },
  ];
}

/**
 * How this preset's figure is drawn. Everything here is display, and every
 * number in it is derived from the setup rather than typed.
 */
export type HeroDisplay = {
  /** Whether V(x) is drawn as a solid object, as a curve, or not at all. */
  potential: "wall" | "curve" | "hidden";
  /** Where the top of the plot's energy axis sits, in the same units as V and E. */
  energyCeiling: number;
  /** The state's own energy, drawn as a horizontal line against V. Omitted when there is no V to compare it to. */
  energyLevel?: number;
  /** Beyond this x, the density is drawn again at FAR_SIDE_MAGNIFICATION. */
  magnifyFrom?: number;
  /** The slice of the grid worth plotting, when the grid is much wider than the physics. */
  xWindow?: readonly [number, number];
  ariaLabel: string;
};

/**
 * Called once per mount (the hero remounts the run on every preset switch),
 * so the one FFT it costs to read the state's energy is paid once per
 * configuration, not once per frame.
 */
export function heroDisplay(id: HeroPresetId, setup: PresetSetup): HeroDisplay {
  if (id === "free-gaussian") {
    return {
      potential: "hidden",
      energyCeiling: 1,
      ariaLabel:
        "Probability density of a free wave packet, drifting to the right and spreading out as it goes.",
    };
  }

  const energy = setup.psi0.expectationEnergy(setup.potential, 1);

  if (id === "harmonic-superposition") {
    // The parabola's own maximum is 82 at the ends of this grid, so scaling
    // the curve to it draws a wall at each edge and something almost flat
    // across the middle, where the packet actually is. Three times the state's
    // energy puts the two classical turning points (where the curve crosses
    // the energy line, at x = +/- sqrt(2E)/omega = +/- 1.41) inside the
    // sloshing region a reader is watching, so the bowl and the level explain
    // each other.
    return {
      potential: "curve",
      energyCeiling: 3 * energy,
      energyLevel: energy,
      ariaLabel:
        "Probability density of two harmonic-oscillator energy levels added together, sliding back and forth inside the well.",
    };
  }

  const barrier = setup.barrier;
  const barrierHeight = barrier?.height ?? energy;
  return {
    potential: "wall",
    // Room above whichever is taller, so the wall's top edge and the energy
    // line are both inside the frame with the gap between them visible: at the
    // defaults (V0 = 3, E = 2.03) the wall reaches 74% of the plot and the
    // energy line 50%.
    energyCeiling: 1.35 * Math.max(barrierHeight, energy),
    energyLevel: energy,
    magnifyFrom: (barrier?.center ?? 0) + (barrier?.halfWidth ?? 0),
    // The grid runs to +/- 51.2 because the physics needs the room, but every
    // frame of this run happens inside +/- 32: at the stop frame the reflected
    // and transmitted peaks sit at -14.5 and +17.3, and the probability
    // outside this window never exceeds 1.0e-6 over the whole pass (pinned in
    // heroRun.test.ts). Plotting the empty two-fifths of the grid costs the
    // packets 40% of their width on screen for nothing.
    xWindow: [-32, 32] as const,
    ariaLabel:
      "Probability density of a wave packet after meeting a barrier: a large lobe on the near side, and a small magnified lobe on the far side.",
  };
}
