import type { Pillar } from "@/lib/content/types";
import { PILLAR_ORDER, PILLAR_VISUALS } from "@/lib/design/pillars";
import { ENTRY_BAR } from "@/lib/entryBar";

/**
 * ============================================================
 * The four curriculum tiers
 * ============================================================
 * The site has six pillar pages and, underneath them, only *four* levels of
 * commitment. Before this file existed the six pages were structurally
 * similar, so a visitor could not tell from `/mechanics` that it starts from
 * nothing, or from `/apex` that it is the summit: the difference was real and
 * invisible.
 *
 * The grouping is a claim about who each track is written for, not another
 * copy of the curriculum graph, so it lives here explicitly rather than being
 * inferred:
 *
 *   Foundations  Mechanics, Computing   the two entry points; see `ENTRY_BAR`
 *   Core         Hardware, Software     apply the foundations to machines and code
 *   Mastery      Quantum Mastery        the rigorous second pass over the same results
 *   Apex         Apex                   research depth, assumes everything above
 *
 * Position within the ladder is still derived (`PILLAR_ORDER`), so a tier can
 * never claim a place the curriculum order contradicts.
 *
 * These four names are the site's only vocabulary for curriculum depth, and
 * `/learn`'s jump nav now groups its six tracks by them rather than by a
 * private "Core (Mechanics–Software) / Advanced (Mastery, Apex)" split that
 * gave "Core" a second, incompatible meaning one click before a reader met
 * "Tier 2 of 4, Core" on `/hardware`. See `CurriculumExplorer`.
 */

export type CurriculumTier = "foundations" | "core" | "mastery" | "apex";

/** Foundational to terminal. Index + 1 is the tier number a page quotes. */
export const TIER_ORDER: CurriculumTier[] = ["foundations", "core", "mastery", "apex"];

export const TIER_OF_PILLAR: Record<Pillar, CurriculumTier> = {
  "quantum-mechanics": "foundations",
  "quantum-computing": "foundations",
  "quantum-hardware": "core",
  "quantum-software": "core",
  "quantum-mastery": "mastery",
  apex: "apex",
};

export type TierCopy = {
  /** The rung's name, as it appears on the ladder. */
  label: string;
  /** One sentence: who this rung is written for. No page rewrites this. */
  blurb: string;
};

export const TIER_COPY: Record<CurriculumTier, TierCopy> = {
  foundations: {
    label: "Foundations",
    // Was "Starts from nothing", eight pixels above a `PillarBriefing` on
    // /mechanics that correctly derives "Assumes: Quantum Gates & Circuits
    // (in Computing) and Entanglement & Measurement (in Computing)" from the
    // curriculum graph. Both statements cannot be true of the same track.
    //
    // The graph is the honest one: two Mechanics lessons are authored end to
    // end on Computing material (Degeneracy in Practice is built on a Bell
    // state; Open Quantum Systems & Kraus Operators is ρ → Σ Kₖ ρ Kₖ† and
    // needs the density matrix), and `curriculumCoverage.test.ts` enforces
    // that a lesson's cross-course prerequisites sit inside its course's
    // closure. So the ladder stopped claiming self-containment and now states
    // the thing that *is* true of this tier: it is where the curriculum opens,
    // and the bar to walk in is `ENTRY_BAR`. Which courses cite which is the
    // briefing's job, one block below, from the data.
    blurb: `The two ways in. ${ENTRY_BAR}`,
  },
  core: {
    label: "Core",
    blurb: "Builds on the foundations and turns them into real machines and real code.",
  },
  mastery: {
    label: "Mastery",
    blurb: "The rigorous second pass over results the core curriculum used but never proved.",
  },
  apex: {
    label: "Apex",
    blurb: "The summit. Research depth, and it assumes all three tiers before it are fluent.",
  },
};

/** Which pillars sit on a given rung, in curriculum order. */
export function pillarsInTier(tier: CurriculumTier): Pillar[] {
  return PILLAR_ORDER.filter((pillar) => TIER_OF_PILLAR[pillar] === tier);
}

/** Human-readable list of the *other* tracks sharing a pillar's rung. */
export function tierSiblings(pillar: Pillar): string[] {
  return pillarsInTier(TIER_OF_PILLAR[pillar])
    .filter((entry) => entry !== pillar)
    .map((entry) => PILLAR_VISUALS[entry].short);
}
