import { compareProblemDifficulty, type Problem, type ProblemMeta, type Quiz } from "./types";
import { PROBLEMS } from "./registry.generated";

/**
 * Problems are plain, statically-imported TypeScript objects rather than
 * MDX files scanned off disk at runtime (contrast `lib/content/lessons.ts`).
 * See docs/ARCHITECTURE.md §10 for the reasoning — in short, a problem is a
 * structured record (metadata + typed question/answer/hints/solution), not
 * prose-heavy long-form content, so a plain array of typed imports gives
 * full compile-time checking of every problem's shape with no MDX
 * compilation step.
 *
 * The import list + array literal itself (`PROBLEMS`, in
 * `registry.generated.ts`) is produced by `scripts/generate-problem-registry.mjs`
 * walking `src/content/problems/**` — see that script's header for why this
 * stays a *build-time* codegen step rather than switching to lessons.ts's
 * runtime async-discovery pattern: 150+ MDX lesson files call
 * `getProblemsForLesson()` synchronously at module top level, so every
 * lookup below has to stay synchronous, which rules out `import()`.
 * Adding a problem is: write the file, run `npm run generate:registry` (or
 * just `next dev`/`next build`, which do it automatically) — no manual
 * import or array entry required.
 */
export { PROBLEMS };

export function getAllProblems(): Problem[] {
  return PROBLEMS;
}

export function getAllProblemMeta(): ProblemMeta[] {
  return PROBLEMS.map((problem) => problem.meta);
}

export function getProblem(slug: string): Problem | undefined {
  return PROBLEMS.find((problem) => problem.meta.slug === slug);
}

/**
 * A lesson's practice list, ordered easiest to hardest (stable within a
 * difficulty rung, so authored/content-path order breaks ties). File-path
 * order ramped arbitrarily — a lesson could open on its hardest problem —
 * and a student working a list top to bottom deserves a monotone ramp.
 * Must stay in lockstep with `getProblemMetaForLesson` in `metaRegistry.ts`
 * (the meta-only twin the lesson pages actually render);
 * `metaRegistry.test.ts` pins the two together.
 */
export function getProblemsForLesson(lessonSlug: string): Problem[] {
  return PROBLEMS.filter((problem) => problem.meta.lesson === lessonSlug).sort((a, b) =>
    compareProblemDifficulty(a.meta.difficulty, b.meta.difficulty)
  );
}

export function getProblemsForCourse(courseSlug: string): Problem[] {
  return PROBLEMS.filter((problem) => problem.meta.course === courseSlug);
}

/**
 * A small, deterministic sample of a course's own existing problems, meant
 * for a "checkpoint" widget at the course's last lesson (see
 * `CourseCheckpoint`) — not a new content type. Evenly spaced across
 * `getProblemsForCourse`'s result (which follows `PROBLEMS` order — see
 * `registry.generated.ts` for what that order is) so the sample spans the
 * whole course rather than clustering on whichever lesson happened to get
 * the most problems authored. No randomness, so static generation stays
 * reproducible and the same five problems show up on every visit.
 *
 * DELIBERATELY NOT difficulty-sorted (unlike `getProblemsForLesson`):
 * content-path order groups problems lesson by lesson, so even spacing over
 * it samples across the course's *material*. Sorting by difficulty first
 * would make the even spacing sample across difficulty rungs instead
 * (clustering picks by lesson) — and would silently swap out the checkpoint
 * problems every returning student has already seen.
 */
export function getCourseCheckpointProblems(courseSlug: string, count = 5): Problem[] {
  const courseProblems = getProblemsForCourse(courseSlug);
  if (courseProblems.length <= count) return courseProblems;

  const step = courseProblems.length / count;
  const indices = Array.from({ length: count }, (_, i) => Math.floor(i * step));
  return indices.map((i) => courseProblems[i]);
}

/**
 * No quizzes are authored yet — this phase establishes the `Quiz` type and
 * its lookup functions (architecture) without building the quiz-taking UI.
 * See docs/ARCHITECTURE.md §10.
 */
export const QUIZZES: Quiz[] = [];

export function getAllQuizzes(): Quiz[] {
  return QUIZZES;
}

export function getQuiz(slug: string): Quiz | undefined {
  return QUIZZES.find((quiz) => quiz.slug === slug);
}
