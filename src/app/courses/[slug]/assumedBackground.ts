import { DIFFICULTY_LABEL } from "@/lib/content/types";
import type { Difficulty, LessonMetaWithSlug } from "@/lib/content/types";

/**
 * ============================================================
 * "What does this course actually assume?" — derived, not asserted
 * ============================================================
 * `docs/BEGINNER_REVIEW.md` blocker 4: a single course-level `difficulty`
 * value is doing more work than it can carry. "Mathematical Foundations for
 * Quantum Mechanics" and "What Is a Qubit?" both read *Foundational*,
 * because for a curriculum-graph purpose that is the correct value — it is
 * the pillar's zero-prerequisite entry point, and `CurriculumExplorer`'s
 * difficulty filter is exact-match, so promoting it would hide the one real
 * starting course from a beginner filtering for "Foundational". (See the
 * comment on that course in `src/lib/content/curriculum.ts`.)
 *
 * The fix is therefore not to relabel the course but to stop making one word
 * answer a question it cannot answer. This module derives the honest answer
 * from what the course's own authored lessons already say about themselves:
 *
 *   - `technicalRegister()` — which mathematical vocabulary a reader will be
 *     working in, matched against the lessons' own stated objectives. Never
 *     keyed on a course slug: a course only shows a signal when its own
 *     objectives contain it, so a new or rewritten course is described
 *     correctly with no edit here.
 *   - `difficultySpread()` — the per-lesson difficulty distribution, which is
 *     the direct evidence that a single course-level mark is a summary. A
 *     "Foundational" course whose lessons are not all foundational says so.
 *
 * Both are deliberately weak claims about *observable text*, not confident
 * claims about a reader's preparation. Anything stronger ("assumes calculus")
 * would be exactly the unverifiable assertion the audit objected to.
 */

export type BackgroundSignal = {
  /** Shown to the reader. Noun phrases, not sentences — these render as chips. */
  label: string;
  /** Matched against the concatenated objectives of the course's own lessons. */
  pattern: RegExp;
};

/**
 * Ordered roughly from "school mathematics" to "university mathematics", so
 * the rendered list reads as a rising ramp rather than an arbitrary set.
 * Each pattern is intentionally narrow: a false positive here tells a
 * beginner they need something they don't, which is worse than saying
 * nothing.
 */
const SIGNALS: BackgroundSignal[] = [
  { label: "trigonometry", pattern: /\b(sine|cosine|tangent|trigonometr|radian)/i },
  {
    label: "complex numbers",
    pattern: /\b(complex (number|amplitude|conjugat|vector|dimension|plane)|imaginary|euler'?s formula|polar form)/i,
  },
  {
    label: "vectors and matrices",
    pattern: /\b(vector|matrix|matrices|basis|bases|linear(ly)?[- ](independen|combinat|algebra|map)|orthonormal|determinant|trace)\b/i,
  },
  {
    label: "eigenvalues and eigenvectors",
    pattern: /\beigen(value|vector|basis|state|decompos)/i,
  },
  {
    label: "probability",
    pattern: /\b(probabilit|expectation value|distribution|variance|stochastic|born rule)/i,
  },
  {
    label: "calculus",
    pattern: /\b(derivative|integral|integrat|differentiat|differential equation|calculus|partial derivative)/i,
  },
  {
    label: "reading and writing proofs",
    pattern: /\b(prove|proof|derive|derivation|theorem|axiom|show that)/i,
  },
  {
    label: "writing code",
    pattern: /\b(python|qiskit|cirq|pennylane|numpy|implement|API|SDK|compile|debug)/i,
  },
];

/**
 * Authored content says what it *doesn't* need as often as what it does, and
 * a keyword match cannot tell the two apart. The real sentence that forced
 * this: "Derive Euler's formula from the power series … (all three stated in
 * this lesson — **no calculus required**)". Matching "calculus" there and
 * printing "calculus" on the page would tell a beginner the exact opposite
 * of what the lesson took care to promise. So a match is only counted if at
 * least one occurrence is *not* inside a negated clause.
 */
const NEGATION_BEFORE = /\b(no|not|without|never|non|free of|instead of|rather than|little)\b[^.;]*$/i;
const NEGATION_WINDOW = 26;

function isAsserted(corpus: string, pattern: RegExp): boolean {
  const global = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);
  for (const match of corpus.matchAll(global)) {
    const index = match.index ?? 0;
    const before = corpus.slice(Math.max(0, index - NEGATION_WINDOW), index);
    if (!NEGATION_BEFORE.test(before)) return true;
  }
  return false;
}

/**
 * The mathematical/technical vocabulary a reader will meet in this course,
 * read off the course's own lesson titles, descriptions and objectives.
 * Empty when the course has no authored lessons yet — nothing to read, so
 * nothing is claimed.
 */
export function technicalRegister(lessons: LessonMetaWithSlug[]): string[] {
  if (lessons.length === 0) return [];
  const corpus = lessons
    .flatMap((lesson) => [lesson.title, lesson.description, ...lesson.objectives])
    .join("\n");
  return SIGNALS.filter((signal) => isAsserted(corpus, signal.pattern)).map(
    (signal) => signal.label,
  );
}

export type DifficultyCount = { difficulty: Difficulty; label: string; count: number };

const DIFFICULTY_ORDER: Difficulty[] = ["foundational", "intermediate", "advanced", "master"];

/** Per-lesson difficulty counts, in ramp order, omitting levels with none. */
export function difficultySpread(lessons: LessonMetaWithSlug[]): DifficultyCount[] {
  const counts = new Map<Difficulty, number>();
  for (const lesson of lessons) {
    counts.set(lesson.difficulty, (counts.get(lesson.difficulty) ?? 0) + 1);
  }
  return DIFFICULTY_ORDER.filter((difficulty) => counts.has(difficulty)).map((difficulty) => ({
    difficulty,
    label: DIFFICULTY_LABEL[difficulty].toLowerCase(),
    count: counts.get(difficulty) ?? 0,
  }));
}

/**
 * True when the course-level difficulty mark is hiding variation — i.e. the
 * lessons inside it are not all at one level. This is the condition under
 * which the spread is worth showing a reader at all; when every lesson
 * agrees with the course mark, repeating it would be noise.
 */
export function spreadIsInformative(spread: DifficultyCount[]): boolean {
  return spread.length > 1;
}
