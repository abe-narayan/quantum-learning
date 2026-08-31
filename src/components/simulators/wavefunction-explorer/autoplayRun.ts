import { probabilityNearGridEdges } from "@/lib/quantum/timeEvolution";
import type { Wavefunction1D } from "@/lib/quantum/wavefunction";
import type { PresetSetup } from "./presets";

/**
 * The rules both autoplaying wavefunction instruments share: the homepage
 * hero and the `/simulators` bench each run one bounded, self-stopping pass on
 * first contact, and this module decides how long it lasts and when it has to
 * end early. In a plain module, not in either "use client" component, so the
 * numbers can be pinned against the real evolver in a node test.
 */

/**
 * The frame budget for one pass, for a configuration that does not ask for its
 * own: long enough to show the physics develop, short enough to read as a
 * proof of concept rather than a looping background animation. At 60fps this
 * is about 4.3 seconds.
 *
 * Measured on the two homepage presets that use it. The free packet ends the
 * pass at 4.7x its starting width (it passes 2x at frame 100 and 3x at frame
 * 160, so the spreading is unmistakable well before the end) with 3.2e-6 of
 * its probability near the box edge, so the run ends before the periodic wrap
 * begins. The harmonic superposition covers 1.66 sloshes of its period
 * 2*pi/omega = 6.28, so a reader sees the packet come back at least once,
 * which is what makes it read as an oscillation rather than a drift.
 */
export const DEFAULT_AUTOPLAY_FRAMES = 260;

/** The frame budget for one autoplay pass of this configuration; see `PresetSetup.autoplayFrames`. */
export function autoplayFrameLimit(setup: PresetSetup): number {
  return setup.autoplayFrames ?? DEFAULT_AUTOPLAY_FRAMES;
}

/**
 * The fraction of probability within 4% of either end of the grid that counts
 * as "the periodic box has started to wrap". The same threshold the bench's
 * narration already uses to stop describing the state as a single packet.
 */
export const WRAP_EDGE_THRESHOLD = 1e-3;

/**
 * Whether the packet has reached the end of the (periodic) simulation box, at
 * which point every position-space quantity stops describing one packet and
 * the picture stops being physics.
 *
 * A frame count alone cannot catch this: the count is fixed and the crossing
 * time is not, since it depends on where the sliders are. At the tunneling
 * preset's default momentum the wrap is 200 frames past the end of the pass;
 * at momentum 6 (where the packet clears the barrier classically instead of
 * tunneling) it arrives before the pass would otherwise end. So both
 * instruments stop the pass on whichever comes first.
 */
export function hasWrappedAround(psi: Wavefunction1D): boolean {
  return probabilityNearGridEdges(psi) > WRAP_EDGE_THRESHOLD;
}
