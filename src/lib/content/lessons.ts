import { readdir } from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";
import type { LessonMeta, LessonMetaWithSlug } from "./types";

const LESSONS_ROOT = path.join(process.cwd(), "src/content/lessons");

async function walk(dir: string, base = ""): Promise<string[]> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (base === "" && (error as NodeJS.ErrnoException).code === "ENOENT") {
      // The lessons root itself doesn't exist yet (e.g. a fresh checkout
      // before any content has been authored). That's a legitimate "no
      // lessons" state, not a bug, so an empty corpus is the honest answer.
      return [];
    }
    // Any other failure (permissions, a transient FS error, or ENOENT on a
    // nested directory that the top-level readdir just told us exists) is a
    // genuine bug, not "no lessons". Propagate it so the build fails loudly
    // instead of silently shipping a lesson-free site — mirroring how
    // `loadLesson()` below refuses to swallow errors for known-good slugs.
    throw error;
  }
  const slugs: string[] = [];

  for (const entry of entries) {
    const relativePath = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      slugs.push(...(await walk(path.join(dir, entry.name), relativePath)));
    } else if (entry.name.endsWith(".mdx")) {
      slugs.push(relativePath.replace(/\.mdx$/, ""));
    }
  }

  return slugs;
}

// Module-level (not React `cache()`) memoization is deliberate here. React's
// `cache()` from "react" only dedupes within a single request/render pass —
// in Next's static generation, each page's static generation is its own such
// pass, so `cache()` would NOT stop getAllLessonsMeta() from re-walking the
// filesystem and re-importing every lesson module on every one of the ~155+
// lesson pages (that's exactly the O(N^2) import blowup this file exists to
// fix). A plain module-level cache instead persists for the lifetime of the
// `next build` process, so the walk + every lesson import happens once total
// and is reused by every page/catalog call site, regardless of the "request"
// boundaries React's cache() respects.

let slugsPromise: Promise<string[]> | null = null;

/** All authored lesson slugs, e.g. "quantum-computing/qubits-and-quantum-states/what-is-a-qubit". */
export function getAllLessonSlugs(): Promise<string[]> {
  if (!slugsPromise) {
    // Deliberately not `.catch(() => [])`-ed: `walk()` already resolves a
    // missing lessons root to `[]` (a legitimate empty corpus) and rejects
    // for every other error. Swallowing that rejection here would turn any
    // real filesystem failure into a silent empty corpus, which — since
    // `generateStaticParams` and `dynamicParams = false` derive every
    // `/lessons/*` route from this list — would let `next build` succeed
    // while every lesson URL 404s. Let it throw and fail the build instead.
    slugsPromise = walk(LESSONS_ROOT);
  }
  return slugsPromise;
}

type LessonModule = {
  default: ComponentType;
  lessonMeta: LessonMeta;
};

const lessonModuleCache = new Map<string, Promise<LessonModule | null>>();

/**
 * Dynamically loads a single lesson's MDX component and metadata by slug.
 *
 * `generateStaticParams` (via `getAllLessonSlugs()`) establishes the full set
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
    const knownSlugs = await getAllLessonSlugs();
    if (!knownSlugs.includes(slug)) {
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

let allLessonsMetaPromise: Promise<LessonMetaWithSlug[]> | null = null;

/** Metadata for every authored lesson, used to drive catalog pages. */
export function getAllLessonsMeta(): Promise<LessonMetaWithSlug[]> {
  if (!allLessonsMetaPromise) {
    allLessonsMetaPromise = (async () => {
      const slugs = await getAllLessonSlugs();

      const lessons = await Promise.all(
        slugs.map(async (slug) => {
          const mod = await loadLesson(slug);
          if (!mod) return null;
          return { ...mod.lessonMeta, slug };
        })
      );

      return lessons.filter((lesson): lesson is LessonMetaWithSlug => lesson !== null);
    })();
  }
  return allLessonsMetaPromise;
}

/** Every authored lesson belonging to a given course slug. */
export async function getLessonsForCourse(courseSlug: string): Promise<LessonMetaWithSlug[]> {
  const all = await getAllLessonsMeta();
  return all.filter((lesson) => lesson.course === courseSlug);
}
