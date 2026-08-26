import type { ProblemType } from "@/lib/problems/types";

/**
 * ============================================================
 * Shared problem-metadata vocabulary
 * ============================================================
 * `ProblemCard`, `ProblemLayout` and `ProblemsCatalog` all need to render the
 * same three facts about a problem — difficulty, type, estimated time — and
 * previously each kept its own copy of the label maps. Centralised here so
 * the catalog, the card and the problem page itself can never drift.
 *
 * Difficulty itself is not re-declared here: `ProblemMetaMarks`'s
 * `DifficultyScale` renders it by translating `ProblemDifficulty` onto the
 * curriculum's `Difficulty` via `PROBLEM_TO_DIFFICULTY`
 * (`lib/problems/types.ts`) and drawing the same `DifficultyMark` ladder
 * used everywhere else on the site — see docs/UX_REVIEW.md P0-3/P1-1. Type
 * is the one piece of problem metadata with no curriculum-wide analogue, so
 * its label map still lives here.
 */

export const TYPE_LABEL: Record<ProblemType, string> = {
  "multiple-choice": "Multiple Choice",
  numeric: "Numeric Answer",
  conceptual: "Short Answer",
};
