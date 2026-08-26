export type Pillar =
  | "quantum-mechanics"
  | "quantum-computing"
  | "quantum-hardware"
  | "quantum-software"
  | "quantum-mastery"
  | "apex";

export type Difficulty = "foundational" | "intermediate" | "advanced" | "master";

/**
 * The one difficulty→label map for the whole site (course rows, the lesson
 * timeline, lesson search, problem cards, the problem page, structured
 * data — everywhere `Difficulty` or a value translated onto it is shown).
 * Lives here rather than beside `DifficultyMark` (the component that
 * renders it as a tick ladder) because `structuredData.ts` needs the text
 * too and is a `lib/` module that must not import from `components/`. See
 * docs/UX_REVIEW.md P1-1 — this used to be hand-copied into nine files;
 * import it instead of redeclaring it.
 */
export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  foundational: "Foundational",
  intermediate: "Intermediate",
  advanced: "Advanced",
  master: "Master",
};

export type PillarInfo = {
  slug: Pillar;
  title: string;
  description: string;
};

export type Module = {
  slug: string;
  title: string;
};

export type Course = {
  slug: string;
  pillar: Pillar;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedHours: number;
  /** Slugs of other courses that should be completed first. */
  prerequisites: string[];
  modules: Module[];
};

/** Metadata a lesson's .mdx file exports as `lessonMeta`. */
export type LessonMeta = {
  title: string;
  description: string;
  /** Course slug this lesson belongs to. */
  course: string;
  /** Module slug within that course. */
  module: string;
  /** Position of this lesson within its module (modules can later hold more than one). */
  order: number;
  difficulty: Difficulty;
  estimatedMinutes: number;
  /** Lesson slugs that should be understood first. */
  prerequisites: string[];
  objectives: string[];
  /** Hand-curated pointers to other lessons with a real, verified connection. */
  related?: { slug: string; note: string }[];
};

/** A lesson's metadata plus the slug derived from its file path. */
export type LessonMetaWithSlug = LessonMeta & { slug: string };
