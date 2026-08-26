import type { Pillar } from "@/lib/content/types";

/**
 * ============================================================
 * Pillar visual identity — the single source of truth
 * ============================================================
 * Every surface that needs to look like a particular pillar (pillar landing
 * pages, lesson chrome, course cards, the concept map, the scroll-driven
 * background field) reads from this one table rather than hard-coding a
 * color or picking `--brand`/`--accent` by array index (which is what
 * PillarsOverview used to do — index parity, so the same pillar could change
 * color if the list order ever changed).
 *
 * Colors are expressed as OKLCH channel *parts* rather than finished hex
 * strings on purpose. globals.css composes them into a full ramp
 * (`--pillar-accent`, `--pillar-glow`, `--pillar-edge`, ...) per theme under
 * `[data-pillar="..."]`, so a component only has to set one attribute on a
 * wrapper and every descendant token re-resolves. That keeps light/dark
 * variants in CSS (where the rest of this app's theming already lives)
 * instead of duplicating a second palette in TypeScript.
 *
 * `regime` names the background environment QuantumField renders while the
 * visitor is inside that pillar — see src/components/field/regimes.ts.
 */

/** Which scroll-driven background environment a pillar lives in. `atlas` is
 *  not tied to any pillar — it is the calm, neutral environment for pages
 *  that survey the whole curriculum rather than standing inside one pillar's
 *  physics (see `src/components/field/regimes.ts`). */
export type FieldRegime =
  | "wave"
  | "state"
  | "lattice"
  | "graph"
  | "operator"
  | "frontier"
  | "journey"
  | "atlas";

export type PillarVisual = {
  /** Landing route for the pillar. */
  route: string;
  /** Short label for cramped chrome (breadcrumbs, badges, field HUD). */
  short: string;
  /** Background environment for QuantumField. */
  regime: FieldRegime;
  /**
   * OKLCH hue angle, degrees. Drives the whole per-pillar ramp in
   * globals.css. Chosen so adjacent pillars in the learning order are
   * clearly distinguishable at a glance, and so Apex sits closest to
   * neutral steel (it is deliberately the least "colorful" pillar — its
   * distinction comes from contrast and structure, not saturation).
   */
  hue: number;
  /**
   * OKLCH chroma for the pillar's accent. Apex is intentionally low —
   * a near-monochrome research aesthetic — while the earlier pillars carry
   * enough chroma to be identifiable in a small badge.
   */
  chroma: number;
  /** One-line description of what the pillar's visual environment depicts. */
  fieldCaption: string;
};

export const PILLAR_VISUALS: Record<Pillar, PillarVisual> = {
  "quantum-mechanics": {
    route: "/mechanics",
    short: "Mechanics",
    regime: "wave",
    hue: 195,
    chroma: 0.13,
    fieldCaption: "Propagating wave packets and their interference envelope",
  },
  "quantum-computing": {
    route: "/computing",
    short: "Computing",
    regime: "state",
    hue: 268,
    chroma: 0.14,
    fieldCaption: "State vectors precessing on the Bloch sphere",
  },
  "quantum-hardware": {
    route: "/hardware",
    short: "Hardware",
    regime: "lattice",
    hue: 62,
    chroma: 0.13,
    fieldCaption: "Control wiring and a coupled qubit lattice",
  },
  "quantum-software": {
    route: "/software",
    short: "Software",
    regime: "graph",
    hue: 152,
    chroma: 0.12,
    fieldCaption: "Circuit rails carrying gates left to right",
  },
  "quantum-mastery": {
    route: "/mastery",
    short: "Mastery",
    regime: "operator",
    hue: 330,
    chroma: 0.12,
    fieldCaption: "Operator matrices acting on a Hilbert-space lattice",
  },
  apex: {
    route: "/apex",
    short: "Apex",
    regime: "frontier",
    // Cold steel-blue, deliberately the lowest chroma in the table: Apex
    // reads as "research frontier," which here means near-monochrome with
    // strong contrast rather than a louder color than everything before it.
    hue: 232,
    chroma: 0.045,
    fieldCaption: "A sparse frontier: known results below, open problems above",
  },
};

/** Ordered walk through the curriculum, foundational → terminal. */
export const PILLAR_ORDER: Pillar[] = [
  "quantum-mechanics",
  "quantum-computing",
  "quantum-hardware",
  "quantum-software",
  "quantum-mastery",
  "apex",
];

export function pillarVisual(pillar: Pillar): PillarVisual {
  return PILLAR_VISUALS[pillar];
}

/** 0-based depth of a pillar in the curriculum, for progression visuals. */
export function pillarDepth(pillar: Pillar): number {
  return PILLAR_ORDER.indexOf(pillar);
}
