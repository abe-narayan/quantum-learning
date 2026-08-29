/**
 * Problem data model.
 *
 * Deliberately separated into five concerns (per docs/ARCHITECTURE.md §6b's
 * layering convention, extended here): metadata, question, answer, hints,
 * and solution/explanation. A `Problem` composes these; nothing else (UI
 * state, progress, submission history) lives on this type — that's what
 * `progress/types.ts` and each component's own React state are for.
 */

import type { Difficulty } from "@/lib/content/types";

/** Deliberately its own small vocabulary rather than reusing the site's
 * `Difficulty` type directly: problems are individual exercises, not
 * multi-hour courses, and "beginner" reads more naturally at that grain than
 * "foundational". Structurally it is the same four rungs as `Difficulty`
 * though (see `PROBLEM_TO_DIFFICULTY` below), so the two are never rendered
 * as differently-shaped ladders — see docs/UX_REVIEW.md P0-3. */
export type ProblemDifficulty = "beginner" | "intermediate" | "advanced" | "master";

/**
 * The one place `ProblemDifficulty` is translated onto the curriculum's
 * `Difficulty` — every renderer of problem difficulty (the tick ladder in
 * `ProblemMetaMarks`, `structuredData.ts`'s JSON-LD) goes through this so a
 * reader is never shown a three-tick ladder next to a four-tick one for the
 * same idea. A straight 1:1 structural mapping, not a re-leveling: "beginner"
 * stays the authored word (it's more natural at single-problem grain) but
 * occupies the same rung, and reads as "Foundational" on screen like every
 * other rung-one item on the site once passed through
 * `DIFFICULTY_LABEL`. Lives here (rather than in a `components/` file)
 * because `structuredData.ts`, a `lib/` module, needs it too.
 */
export const PROBLEM_TO_DIFFICULTY: Record<ProblemDifficulty, Difficulty> = {
  beginner: "foundational",
  intermediate: "intermediate",
  advanced: "advanced",
  master: "master",
};

/**
 * Numeric rank of each difficulty rung, for ordering problem lists from
 * easiest to hardest. Kept here (next to the vocabulary it ranks) so both
 * `registry.ts` and `metaRegistry.ts` can sort identically without
 * `metaRegistry` importing the full problem graph. Used with a *stable*
 * sort, so authored order is preserved within a rung.
 */
export const PROBLEM_DIFFICULTY_RANK: Record<ProblemDifficulty, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
  master: 3,
};

/** Comparator for easiest-to-hardest ordering; ties compare equal so a
 *  stable sort keeps authored (content-path) order within a rung. */
export function compareProblemDifficulty(a: ProblemDifficulty, b: ProblemDifficulty): number {
  return PROBLEM_DIFFICULTY_RANK[a] - PROBLEM_DIFFICULTY_RANK[b];
}

/**
 * The set of problem types implemented so far. This is intentionally a
 * flat string union (not yet implemented types are simply absent) rather
 * than a union that includes stubbed-out future members — see
 * docs/ARCHITECTURE.md §10 for the full list of types this is designed to
 * grow into (multiple-select, symbolic, quantum-state, circuit, ...) and
 * why each was deferred.
 */
export type ProblemType = "multiple-choice" | "numeric" | "conceptual";

export type ProblemMeta = {
  /** Stable, URL-safe identifier — also the route segment at /problems/[slug]. */
  slug: string;
  title: string;
  /** Course slug (matches `Course.slug` in lib/content/curriculum.ts). */
  course: string;
  /** Full lesson slug (matches `LessonMetaWithSlug.slug`), if this problem is attached to a specific lesson. */
  lesson?: string;
  difficulty: ProblemDifficulty;
  estimatedMinutes: number;
  problemType: ProblemType;
  tags: string[];
  /** Full lesson slugs a student should understand first — same shape as `LessonMeta.prerequisites`. */
  prerequisites?: string[];
};

// --- Question (prompt + type-specific input shape; NO correctness info) ---

export type MultipleChoiceOption = {
  id: string;
  /** May contain inline LaTeX delimited by `$...$`, rendered via MathText. */
  text: string;
};

export type MultipleChoiceQuestion = {
  type: "multiple-choice";
  prompt: string;
  options: MultipleChoiceOption[];
};

export type NumericQuestion = {
  type: "numeric";
  prompt: string;
  /** Shown next to the input, e.g. a unit or a hint like "as a decimal". */
  inputHint?: string;
};

export type ConceptualQuestion = {
  type: "conceptual";
  prompt: string;
  placeholder?: string;
};

export type Question = MultipleChoiceQuestion | NumericQuestion | ConceptualQuestion;

// --- Answer (canonical correct answer + validation parameters) ---

export type MultipleChoiceAnswer = {
  type: "multiple-choice";
  correctOptionId: string;
  /** Feedback shown for a specific wrong option, keyed by option id. */
  optionFeedback?: Record<string, string>;
  /** Shown when no option-specific feedback exists for the chosen option. */
  defaultIncorrectFeedback: string;
};

/**
 * A recognizable wrong answer worth targeted feedback: a sign flip, a
 * forgotten square, probability instead of amplitude, and so on. Checked
 * only *after* the submission fails the correct-answer test, so a near miss
 * can never shadow the real answer even if the two tolerance windows overlap.
 */
export type NumericNearMiss = {
  value: number;
  /** Window around `value` for recognizing this miss; defaults to the answer's own `tolerance`. */
  tolerance?: number;
  /** Shown instead of `incorrectFeedback` when the submission lands in this window. */
  feedback: string;
};

export type NumericAnswer = {
  type: "numeric";
  value: number;
  tolerance: number;
  /** "absolute" (default) compares |submitted - value| <= tolerance; "relative" scales tolerance by |value|. */
  toleranceType?: "absolute" | "relative";
  incorrectFeedback: string;
  /** Optional targeted feedback for specific wrong values (see `NumericNearMiss`). Checked in order; first hit wins. */
  nearMisses?: NumericNearMiss[];
};

/**
 * One required idea, as a group of acceptable synonym phrases. The plain
 * `string[]` form is the original authoring shape and remains fully
 * supported; the object form adds an optional `missingFeedback` shown when
 * this group is the *only* one the submission failed to cover, so the
 * student hears which idea is missing instead of a generic "partly there".
 */
export type ConceptGroup =
  | string[]
  | {
      phrases: string[];
      /** Shown when this group alone blocks full correctness. */
      missingFeedback?: string;
    };

/** The phrase list of a `ConceptGroup`, regardless of which form it was authored in. */
export function conceptGroupPhrases(group: ConceptGroup): string[] {
  return Array.isArray(group) ? group : group.phrases;
}

export type ConceptualAnswer = {
  type: "conceptual";
  /**
   * Each entry is a group of acceptable synonyms/phrases for one required
   * idea; a submission must match at least one phrase from *every* group
   * (AND across groups, OR within a group) to count as fully correct.
   * Matching is normalized, deterministic substring/token matching — a
   * deliberately simple, safe approach (see validators/conceptual.ts).
   */
  requiredConceptGroups: ConceptGroup[];
  incorrectFeedback: string;
  /** Shown when some but not all concept groups are matched. */
  partialFeedback?: string;
};

export type Answer = MultipleChoiceAnswer | NumericAnswer | ConceptualAnswer;

// --- Hints (progressive; revealed one at a time by the UI) ---

export type Hint = {
  text: string;
};

// --- Solution & explanation (teaches, doesn't just reveal) ---

export type SolutionStep = {
  /** Prose for this step; may contain inline `$...$` LaTeX. */
  description: string;
  /** An optional display-mode equation for this step. */
  latex?: string;
};

export type Solution = {
  steps: SolutionStep[];
  /** The final boxed answer; may contain inline `$...$` LaTeX. */
  finalAnswer: string;
};

/**
 * One "common mistake" entry.
 *
 * The string form is prose that must stand on its own — it is rendered
 * verbatim, with nothing around it to anchor a cross-reference.
 *
 * The object form exists because of a specific, verified failure mode.
 * Multiple-choice options are displayed in a seeded shuffle (see
 * `components/problems/optionOrder.ts`), so an option's authored `id` — which
 * for most of the corpus is literally "a"/"b"/"c"/"d" — is *not* the letter
 * the reader sees beside it. Prose that hardcoded "Option b confuses V02 with
 * a different qubit" therefore named a letter that, for most problems, sat
 * next to a different answer entirely: the explanation contradicted the page
 * it was on. Naming the option by `optionId` instead lets the renderer look up
 * the letter that option actually carries in *this* reader's display order, so
 * the reference is correct by construction and stays correct if the shuffle
 * ever changes.
 *
 * Prefer describing an option by its content where that reads naturally; reach
 * for the object form when the entry genuinely needs to point at one specific
 * choice. `src/lib/problems/__tests__/optionLetterReferences.test.ts` fails the
 * build on any hardcoded letter reference that comes back.
 */
export type WhyWrongEntry = string | { optionId: string; text: string };

/** The prose of a `WhyWrongEntry`, regardless of which form it was authored
 *  in — the same accessor pattern `conceptGroupPhrases` uses above, so callers
 *  that only want the text never have to re-derive the union narrowing. */
export function whyWrongText(entry: WhyWrongEntry): string {
  return typeof entry === "string" ? entry : entry.text;
}

export type Explanation = {
  /** The correct idea, stated plainly. */
  correctIdea: string;
  /** Why it's correct. */
  whyCorrect?: string;
  /** Why common alternative answers/misconceptions are wrong. See
   *  `WhyWrongEntry`: entries that point at one specific option must use the
   *  object form so the UI can render that option's *displayed* letter. */
  whyWrong?: WhyWrongEntry[];
};

// --- Problem (ties the above together, keyed by problemType) ---

type ProblemVariant<T extends ProblemType> = {
  meta: ProblemMeta & { problemType: T };
  question: Extract<Question, { type: T }>;
  answer: Extract<Answer, { type: T }>;
  hints: Hint[];
  solution: Solution;
  explanation?: Explanation;
  /** Full lesson slugs this problem's idea also appears in, beyond its home lesson. */
  relatedConcepts?: string[];
};

export type MultipleChoiceProblem = ProblemVariant<"multiple-choice">;
export type NumericProblem = ProblemVariant<"numeric">;
export type ConceptualProblem = ProblemVariant<"conceptual">;

export type Problem = MultipleChoiceProblem | NumericProblem | ConceptualProblem;

// --- Quiz (data model + architecture only — no UI yet, see docs/ARCHITECTURE.md §10) ---

export type Quiz = {
  slug: string;
  title: string;
  description: string;
  course: string;
  /** Ordered problem slugs; a quiz is a curated sequence, not a filter query. */
  problemSlugs: string[];
  timeLimitMinutes?: number;
};
