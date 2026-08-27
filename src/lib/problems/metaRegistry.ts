import type { ProblemMeta } from "./types";
import { PROBLEM_METAS } from "./problemMeta.generated";

/**
 * Meta-only view of the problem corpus.
 *
 * WHY THIS EXISTS: `registry.ts` re-exports `PROBLEMS` from
 * `registry.generated.ts`, which statically imports all 547 problem modules
 * (~1.4MB compiled) — and, through their question/answer/solution code, the
 * whole `src/lib/quantum` graph. Any module that imports `registry.ts`
 * therefore drags that entire graph into its own server module graph, even
 * if all it wanted was a slug or a title. Every one of the 219 lesson MDX
 * files used to do exactly that for its `practiceProblems` list (which only
 * ever renders `ProblemMeta` fields via `<PracticeLinks>`), as did the
 * sitemap and several catalog/landing pages — a large share of every lesson
 * page's server graph, and of the Vercel build-memory problem.
 *
 * `PROBLEM_METAS` (see `problemMeta.generated.ts`) is instead a plain-data
 * array text-extracted from the problem sources at generate time, importing
 * nothing but the `ProblemMeta` type — so consumers of THIS module stay out
 * of the full problem/quantum graph entirely. A drift test
 * (`__tests__/metaRegistry.test.ts`) pins it element-for-element to
 * `PROBLEMS.map((p) => p.meta)`.
 *
 * `registry.ts` remains the home of the full-`Problem` lookups
 * (`getProblem`, `getProblemsForLesson`, `getCourseCheckpointProblems`, ...)
 * for the consumers that genuinely need question/answer content: the
 * `/problems/[slug]` page render, `DailyPuzzle`, and `CourseCheckpoint`.
 * If you only need metadata, import from here instead.
 */

export function getAllProblemMeta(): ProblemMeta[] {
  return PROBLEM_METAS;
}

export function getProblemMeta(slug: string): ProblemMeta | undefined {
  return PROBLEM_METAS.find((meta) => meta.slug === slug);
}

export function getProblemMetaForLesson(lessonSlug: string): ProblemMeta[] {
  return PROBLEM_METAS.filter((meta) => meta.lesson === lessonSlug);
}

export function getProblemMetaForCourse(courseSlug: string): ProblemMeta[] {
  return PROBLEM_METAS.filter((meta) => meta.course === courseSlug);
}
