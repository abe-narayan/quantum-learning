import type { Difficulty } from "../types";

/**
 * Broad buckets for "Current Quantum" entries. Deliberately a small, flat
 * union (not a nested taxonomy) so a new entry only ever has to pick one
 * existing label. See AGENTS.md-style guidance in `data.ts` for why this
 * collection favors "easy for a human to hand-edit" over structural cleverness.
 */
export type CurrentQuantumCategory =
  | "algorithms"
  | "hardware milestone"
  | "error correction"
  | "quantum networking"
  | "sensing"
  | "historical experiment"
  | "cryptography";

/** Where a fact in an entry came from. Always a real, checkable source. */
export type CurrentQuantumSource = {
  /** Publisher/outlet name, e.g. "Nature", "Google Quantum AI", "NIST". */
  name: string;
  /** A real, dereferenceable URL for the primary source (paper, press release, blog post). */
  url: string;
};

/**
 * The half of an entry that a *link* to that entry needs: identity, when it
 * happened, what to call it, which bucket it sits in, and which lesson it
 * hangs off. No prose, no source, no image.
 *
 * WHY THIS IS ITS OWN TYPE: this is the only half that may cross into a
 * client bundle. `ConceptDetailPanel` is a `"use client"` component that
 * reverse-looks-up entries by lesson slug and renders date/category/title as
 * a mini-card link. It needs exactly these five fields, and used to reach
 * the whole corpus (prose, citations, image metadata and all) to get them.
 * See `metaRegistry.ts` for the full reasoning and the rule that keeps it
 * that way.
 *
 * Modeled on `ProblemMeta` (`src/lib/problems/types.ts`), which draws the
 * same line for the same reason.
 */
export type CurrentQuantumEntryMeta = {
  /** URL-safe unique identifier, e.g. "google-willow-below-threshold-2024". */
  slug: string;
  /** ISO 8601 date (YYYY-MM-DD, or YYYY-MM when only a month is confirmed). */
  date: string;
  title: string;
  category: CurrentQuantumCategory;
  /** A real, existing lesson slug (validated against src/content/lessons/**\/*.mdx). */
  relatedLessonSlug: string;
};

/**
 * The half of an entry that only a full card render needs: the prose, the
 * citation, the difficulty readout and the optional figure. Server-only by
 * construction: it lives in `data.ts`, keyed by slug, alongside the
 * editorial provenance comments for each entry.
 *
 * Every field here is rendered by `CurrentQuantumCard`, which is only ever
 * handed entries by a server component (`/current-quantum`,
 * `RelatedCurrentQuantum`). If you find yourself wanting one of these fields
 * on the client, pass it as a prop rather than importing `data.ts`.
 */
export type CurrentQuantumEntryBody = {
  /** One paragraph, in plain original prose (not copied from the source). */
  summary: string;
  source: CurrentQuantumSource;
  /** One sentence connecting this real-world development to that lesson's actual content. */
  whyThisMatters: string;
  /** Optional. How advanced the underlying physics/CS is, matching `Difficulty` elsewhere. */
  difficulty?: Difficulty;
  /** Optional. A genuinely reusable real image, rendered via `ExternalFigure`. */
  imageUrl?: string;
  /**
   * Alt text describing what the image itself actually shows (a person,
   * apparatus, chip, etc.), required alongside `imageUrl`. Deliberately a
   * separate field from `title`: the card used to pass `entry.title` as the
   * `<img alt>`, which describes the news event, not the picture, and is
   * wrong for a screen reader announcing the image itself.
   */
  imageAlt?: string;
  /**
   * One sentence, rendered as the figure caption, saying what the image
   * actually depicts and how (or whether) it relates to this entry: e.g.
   * naming the real device/person shown and being explicit when it's a
   * general/illustrative match rather than a photo of the specific
   * experiment. Never a restatement of `title`.
   */
  imageCaption?: string;
  imageAttribution?: {
    credit: string;
    creditUrl?: string;
    license: string;
  };
};

/**
 * One real quantum-computing/physics development, connected back to a real
 * StudyQuantum lesson, meta and body rejoined.
 *
 * This is still the shape every renderer sees; the split above is a payload
 * boundary, not a modelling change. `registry.ts` is the one place that
 * performs the join (`getAllCurrentQuantumEntries`), and it is server-only.
 *
 * Modeled on `GlossaryTerm` (`src/lib/content/glossary.ts`) and `ProblemMeta`
 * (`src/lib/problems/types.ts`): a flat, hand-authored record with no nested
 * sub-objects beyond `source` (which is just {name, url}), so adding or
 * editing an entry by hand only ever means changing scalar string fields in
 * `metaRegistry.ts` and `data.ts`.
 */
export type CurrentQuantumEntry = CurrentQuantumEntryMeta & CurrentQuantumEntryBody;
