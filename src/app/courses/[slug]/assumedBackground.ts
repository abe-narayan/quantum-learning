import { DIFFICULTY_LABEL } from "@/lib/content/types";
import type { Difficulty, LessonMetaWithSlug } from "@/lib/content/types";

/**
 * ============================================================
 * "What does this course actually assume?", derived, not asserted
 * ============================================================
 * `docs/BEGINNER_REVIEW.md` blocker 4: a single course-level `difficulty`
 * value is doing more work than it can carry. "Mathematical Foundations for
 * Quantum Mechanics" and "What Is a Qubit?" both read *Foundational*,
 * because for a curriculum-graph purpose that is the correct value, it is
 * the pillar's zero-prerequisite entry point, and `CurriculumExplorer`'s
 * difficulty filter is exact-match, so promoting it would hide the one real
 * starting course from a beginner filtering for "Foundational". (See the
 * comment on that course in `src/lib/content/curriculum.ts`.)
 *
 * The fix is therefore not to relabel the course but to stop making one word
 * answer a question it cannot answer. This module derives the honest answer
 * from what the course's own authored lessons already say about themselves:
 *
 *   - `technicalRegister()`, which mathematical vocabulary a reader will be
 *     working in, matched against the lessons' own stated objectives. Never
 *     keyed on a course slug: a course only shows a signal when its own
 *     objectives contain it, so a new or rewritten course is described
 *     correctly with no edit here. "Vocabulary" includes notation: an
 *     objective is as likely to write `cos(θ/2)` as the word "cosine", and a
 *     signal that reads only the English half is blind to half the corpus.
 *     See the note on the trigonometry pattern below for the case that
 *     forced this.
 *   - `difficultySpread()`, the per-lesson difficulty distribution, which is
 *     the direct evidence that a single course-level mark is a summary. A
 *     "Foundational" course whose lessons are not all foundational says so.
 *
 * Both are deliberately weak claims about *observable text*, not confident
 * claims about a reader's preparation. Anything stronger ("assumes calculus")
 * would be exactly the unverifiable assertion the audit objected to.
 */

export type BackgroundSignal = {
  /** Shown to the reader. Noun phrases, not sentences, these render as chips. */
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
  /**
   * `\bcos\b`, `\bsin\b`, `\btan\b` are here because the English words were
   * not enough and the omission was load-bearing. /courses/qubits-and-quantum-
   * states listed complex numbers, vectors and matrices, probability and
   * proofs, and *not* trigonometry, on a course whose fifth lesson needs
   * cos²A − sin²A = cos 2A and whose second runs on radians and polar form.
   * The reason is that objectives write mathematics in notation, not in
   * prose: the Bloch lesson's own first objective is "Derive the canonical
   * form |ψ⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩", which the word list could
   * not see. Matching the notation is the same weak claim about observable
   * text the module is built on, just read in the alphabet the text is
   * actually written in.
   *
   * Zero false positives, which the word boundaries do the work for: "using"
   * and "single" contain the letters but not the token, and `\cos` in LaTeX
   * matches because a backslash is not a word character.
   *
   * RE-MEASURED 2026-08-30, and the number has moved: this fires on THREE
   * courses (qubits-and-quantum-states, mathematical-foundations,
   * entanglement-and-measurement), 6 matches. When the pattern landed it was
   * six courses and ten matches; classical-to-quantum, quantum-algorithms-i
   * and noise-decoherence-and-scaling have since dropped out, because their
   * lesson objectives were rewritten during the sprint and no longer spell
   * the notation, not because the mathematics left.
   *
   * That is a live gap, not a correct weakening. Those three courses use
   * LaTeX trigonometry 835, 712 and 353 times across 11, 9 and 5 lesson
   * files, i.e. as much as or more than qubits-and-quantum-states (638),
   * which still shows the chip. A beginner opening /courses/classical-to-
   * quantum is therefore not told trigonometry is assumed while a reader of
   * a lighter course is. The signal reads titles, descriptions and
   * objectives only, by design (a weak claim about observable text), so the
   * fix belongs in those courses' objectives or in widening what the corpus
   * reads. Do not "fix" it by keying on a course slug: that is the exact
   * thing this module refuses to do.
   *
   * The two halves of the alternation are not interchangeable. The word half
   * keeps the original's *prefix* match (no closing `\b`), because it has to
   * reach "trigonometry" and "radians" through their own suffixes. The
   * notation half must have the closing `\b` or "sin" swallows "single".
   */
  {
    label: "trigonometry",
    pattern: /\b(sine|cosine|tangent|trigonometr|radian)|\b(cos|sin|tan|arccos|arcsin|arctan)\b/i,
  },
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
 * this lesson, **no calculus required**)". Matching "calculus" there and
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
 * Empty when the course has no authored lessons yet, nothing to read, so
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
 * True when the course-level difficulty mark is hiding variation, i.e. the
 * lessons inside it are not all at one level. This is the condition under
 * which the spread is worth showing a reader at all; when every lesson
 * agrees with the course mark, repeating it would be noise.
 */
export function spreadIsInformative(spread: DifficultyCount[]): boolean {
  return spread.length > 1;
}
