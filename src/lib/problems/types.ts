/**
 * Problem data model.
 *
 * Deliberately separated into five concerns (per docs/ARCHITECTURE.md §6b's
 * layering convention, extended here): metadata, question, answer, hints,
 * and solution/explanation. A `Problem` composes these; nothing else (UI
 * state, progress, submission history) lives on this type — that's what
 * `progress/types.ts` and each component's own React state are for.
 */

/** Deliberately its own small vocabulary rather than reusing the site's
 * `Difficulty` ("foundational" | "intermediate" | "advanced"): problems are
 * individual exercises, not multi-hour courses, and "beginner" reads more
 * naturally at that grain than "foundational". */
export type ProblemDifficulty = "beginner" | "intermediate" | "advanced";

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

export type NumericAnswer = {
  type: "numeric";
  value: number;
  tolerance: number;
  /** "absolute" (default) compares |submitted - value| <= tolerance; "relative" scales tolerance by |value|. */
  toleranceType?: "absolute" | "relative";
  incorrectFeedback: string;
};

export type ConceptualAnswer = {
  type: "conceptual";
  /**
   * Each inner array is a group of acceptable synonyms/phrases for one
   * required idea; a submission must match at least one phrase from
   * *every* group (AND across groups, OR within a group) to count as
   * fully correct. Matching is case-insensitive substring matching — a
   * deliberately simple, deterministic, safe approach (see validators/conceptual.ts).
   */
  requiredConceptGroups: string[][];
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

export type Explanation = {
  /** The correct idea, stated plainly. */
  correctIdea: string;
  /** Why it's correct. */
  whyCorrect?: string;
  /** Why common alternative answers/misconceptions are wrong. */
  whyWrong?: string[];
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
