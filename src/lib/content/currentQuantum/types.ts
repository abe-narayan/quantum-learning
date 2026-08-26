import type { Difficulty } from "../types";

/**
 * Broad buckets for "Current Quantum" entries. Deliberately a small, flat
 * union (not a nested taxonomy) so a new entry only ever has to pick one
 * existing label — see AGENTS.md-style guidance in `data.ts` for why this
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

/** Where a fact in an entry came from — always a real, checkable source. */
export type CurrentQuantumSource = {
  /** Publisher/outlet name, e.g. "Nature", "Google Quantum AI", "NIST". */
  name: string;
  /** A real, dereferenceable URL for the primary source (paper, press release, blog post). */
  url: string;
};

/**
 * One real quantum-computing/physics development, connected back to a real
 * QuantumLearn lesson.
 *
 * Modeled on `GlossaryTerm` (`src/lib/content/glossary.ts`) and `ProblemMeta`
 * (`src/lib/problems/types.ts`): a flat, hand-authored record with no nested
 * sub-objects beyond `source` (which is just {name, url}), so adding or
 * editing an entry by hand only ever means changing scalar string fields in
 * `data.ts`.
 */
export type CurrentQuantumEntry = {
  /** URL-safe unique identifier, e.g. "google-willow-below-threshold-2024". */
  slug: string;
  /** ISO 8601 date (YYYY-MM-DD, or YYYY-MM when only a month is confirmed). */
  date: string;
  title: string;
  /** One paragraph, in plain original prose (not copied from the source). */
  summary: string;
  category: CurrentQuantumCategory;
  source: CurrentQuantumSource;
  /** A real, existing lesson slug (validated against src/content/lessons/**\/*.mdx). */
  relatedLessonSlug: string;
  /** One sentence connecting this real-world development to that lesson's actual content. */
  whyThisMatters: string;
  /** Optional — how advanced the underlying physics/CS is, matching `Difficulty` elsewhere. */
  difficulty?: Difficulty;
  /** Optional — a genuinely reusable real image, rendered via `ExternalFigure`. */
  imageUrl?: string;
  /**
   * Alt text describing what the image itself actually shows (a person,
   * apparatus, chip, etc.) — required alongside `imageUrl`. Deliberately a
   * separate field from `title`: the card used to pass `entry.title` as the
   * `<img alt>`, which describes the news event, not the picture, and is
   * wrong for a screen reader announcing the image itself.
   */
  imageAlt?: string;
  /**
   * One sentence, rendered as the figure caption, saying what the image
   * actually depicts and how (or whether) it relates to this entry — e.g.
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
