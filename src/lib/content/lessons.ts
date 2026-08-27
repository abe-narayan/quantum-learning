import type { ComponentType } from "react";
import type { LessonMeta, LessonMetaWithSlug } from "./types";
import { LESSON_METAS } from "./lessonMeta.generated";

/**
 * Lesson METADATA comes from `lessonMeta.generated.ts` (produced by
 * `scripts/generate-lesson-registry.mjs` before every dev/build/test run);
 * lesson BODIES are dynamically imported per slug by `loadLesson()` below.
 *
 * This split is the site's core build-memory invariant. The previous version
 * of `getAllLessonsMeta()` obtained metadata by dynamically importing every
 * one of the 219 compiled MDX modules — each a full React component tree with
 * KaTeX-rendered math, ~36MB of compiled JS for the corpus — and caching them
 * for the life of the process. Because the root-layout Footer and every
 * catalog/lesson/problem page call it, every one of Next's static-generation
 * worker processes imported and retained the entire compiled corpus, which
 * multiplied into a SIGKILL/OOM on Vercel's 8GB build container. Now metadata
 * consumers touch only a small plain-data array, and the only compiled MDX
 * module a page ever imports is the one lesson body it renders.
 *
 * Staleness semantics match the problem registry: the generated file is
 * rewritten by the `predev`/`prebuild`/`pretest` hooks, so a lesson added
 * mid-`next dev` session appears after re-running the generator (or
 * restarting dev) — same accepted tradeoff as `registry.generated.ts`.
 * Drift between a registry entry and the real module's `lessonMeta` export is
 * caught by the equality assertion in `__tests__/lessons.test.ts`.
 */

/** All authored lesson slugs, e.g. "quantum-computing/qubits-and-quantum-states/what-is-a-qubit". */
export function getAllLessonSlugs(): Promise<string[]> {
  return Promise.resolve(LESSON_METAS.map((lesson) => lesson.slug));
}

/**
 * Known-good slugs as a Set for O(1) membership checks in `loadLesson`.
 * (Async APIs above are kept Promise-returning so the many existing call
 * sites — and any future move back to runtime discovery — stay unchanged.)
 */
const KNOWN_SLUGS = new Set(LESSON_METAS.map((lesson) => lesson.slug));

type LessonModule = {
  default: ComponentType;
  lessonMeta: LessonMeta;
};

const lessonModuleCache = new Map<string, Promise<LessonModule | null>>();

/**
 * Dynamically loads a single lesson's MDX component and metadata by slug.
 *
 * The generated registry (via `getAllLessonSlugs()`) establishes the full set
 * of known-good slugs up front, and the lesson route sets `dynamicParams =
 * false`. That means a thrown error here for a slug that IS in that known
 * set is never a legitimate "not found" — it's a real bug in the MDX file
 * (a parse-time or evaluation-time error, e.g. a ReferenceError) and must
 * fail the build loudly instead of silently rendering as a 404. Only a slug
 * that ISN'T in the known set gets its import errors swallowed, since that's
 * the only case where "the module genuinely doesn't exist" is a legitimate
 * explanation for the failure.
 */
export function loadLesson(slug: string): Promise<LessonModule | null> {
  const cached = lessonModuleCache.get(slug);
  if (cached) return cached;

  const promise = (async () => {
    if (!KNOWN_SLUGS.has(slug)) {
      // Unknown slug: a failed import here is expected ("no such lesson"),
      // so swallow it and let the caller 404.
      // `@vite-ignore`: harmless for webpack/Turbopack (which already
      // resolve this nested template-literal import fine); it just stops
      // Vite's static dynamic-import analysis (used by the Vitest test for
      // this file) from choking on a variable containing "/" segments.
      try {
        return (await import(/* @vite-ignore */ `@/content/lessons/${slug}.mdx`)) as LessonModule;
      } catch {
        return null;
      }
    }

    // Known-good slug: don't catch. Any error here is a genuine bug in the
    // lesson's MDX and should fail the build, not silently 404.
    return (await import(/* @vite-ignore */ `@/content/lessons/${slug}.mdx`)) as LessonModule;
  })();

  lessonModuleCache.set(slug, promise);
  return promise;
}

/** Metadata for every authored lesson, used to drive catalog pages. */
export function getAllLessonsMeta(): Promise<LessonMetaWithSlug[]> {
  return Promise.resolve(LESSON_METAS);
}

/** Registry lookup for a single lesson's metadata — no MDX module import. */
export function getLessonMeta(slug: string): LessonMetaWithSlug | undefined {
  return LESSON_METAS.find((lesson) => lesson.slug === slug);
}

/** Every authored lesson belonging to a given course slug. */
export async function getLessonsForCourse(courseSlug: string): Promise<LessonMetaWithSlug[]> {
  return LESSON_METAS.filter((lesson) => lesson.course === courseSlug);
}
