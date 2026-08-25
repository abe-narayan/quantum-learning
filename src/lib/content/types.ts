export type Pillar =
  | "quantum-mechanics"
  | "quantum-computing"
  | "quantum-hardware"
  | "quantum-software"
  | "quantum-mastery";

export type Difficulty = "foundational" | "intermediate" | "advanced" | "master";

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
