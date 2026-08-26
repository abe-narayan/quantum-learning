import { beforeAll, describe, expect, it } from "vitest";
import { getAllLessonSlugs, loadLesson } from "../lessons";
import { getCourse, getModule } from "../curriculum";

/** The loaded-lesson shape, derived from `loadLesson` rather than imported:
 *  `LessonModule` is deliberately module-private in ../lessons.ts, and a test
 *  is not a reason to widen a module's public API. */
type LoadedLesson = Awaited<ReturnType<typeof loadLesson>>;

/**
 * Corpus-wide integrity checks. Every test here needs the same thing — every
 * lesson module, loaded — so the corpus is loaded exactly once in `beforeAll`
 * and shared, rather than each test re-walking it.
 *
 * That is not just tidiness. Importing a lesson runs it through the MDX
 * pipeline (remark-math + rehype-katex, plus every visualization and
 * quantum-engine module the lesson imports), and the original serial
 * `for (const slug of slugs) await loadLesson(slug)` gave the bundler exactly
 * one file to work on at a time. As the corpus grew past 200 lessons that
 * pushed the first test alone over its 120s timeout — the suite that exists to
 * catch a broken lesson had itself stopped completing, which is the worst
 * possible failure mode for a guard. Loading with bounded concurrency lets the
 * transforms overlap; `loadLesson`'s own module-level memoization then makes
 * every later test effectively free.
 */

/** How many lessons to import at once. High enough to keep the transform
 *  pipeline saturated, low enough not to hold 219 module graphs in flight. */
const LOAD_CONCURRENCY = 24;

async function loadAll(slugs: string[]): Promise<Map<string, LoadedLesson>> {
  const loaded = new Map<string, LoadedLesson>();
  let cursor = 0;

  async function worker() {
    while (cursor < slugs.length) {
      const slug = slugs[cursor];
      cursor += 1;
      loaded.set(slug, await loadLesson(slug));
    }
  }

  await Promise.all(Array.from({ length: LOAD_CONCURRENCY }, worker));
  return loaded;
}

let slugs: string[] = [];
let modules = new Map<string, LoadedLesson>();

describe("lesson corpus integrity", () => {
  beforeAll(async () => {
    slugs = await getAllLessonSlugs();
    modules = await loadAll(slugs);
    // Generous, because this genuinely compiles the whole corpus once — but
    // it is now the only place that pays that cost.
  }, 300_000);

  it("has at least one authored lesson slug", () => {
    expect(slugs.length).toBeGreaterThan(0);
  });

  it("loads every authored lesson without error", () => {
    // This is the regression test for the bug that motivated this file: a
    // genuine MDX parse/evaluation error (e.g. a ReferenceError) was being
    // swallowed by loadLesson()'s blanket try/catch and silently rendering
    // as a false 404, despite `npm run build` reporting success. Every slug
    // returned by getAllLessonSlugs() is a known-good slug (it came straight
    // from the filesystem walk that also feeds generateStaticParams), so
    // loadLesson() must resolve every one of them to a real module — a null
    // here means either loadLesson regressed back to swallowing real errors,
    // or a lesson file's MDX/JS is genuinely broken.
    for (const slug of slugs) {
      const mod = modules.get(slug);
      expect(mod, `loadLesson("${slug}") resolved to null`).not.toBeNull();
      expect(mod?.default, `lesson "${slug}" has no default export`).toBeTypeOf("function");
      expect(mod?.lessonMeta, `lesson "${slug}" has no lessonMeta export`).toBeDefined();
    }
  });

  it("every lesson's lessonMeta.course/module resolves to a real curriculum entry", () => {
    // Guards against the class of bug (already found and fixed once this
    // session on a different lesson) where a lesson's frontmatter course or
    // module slug drifts out of sync with curriculum.ts.
    for (const slug of slugs) {
      const mod = modules.get(slug);
      if (!mod) continue; // already asserted non-null above; skip to avoid double-failing

      const { course: courseSlug, module: moduleSlug } = mod.lessonMeta;

      const course = getCourse(courseSlug);
      expect(course, `lesson "${slug}" references unknown course "${courseSlug}"`).toBeDefined();

      const courseModule = getModule(courseSlug, moduleSlug);
      expect(
        courseModule,
        `lesson "${slug}" references unknown module "${moduleSlug}" in course "${courseSlug}"`
      ).toBeDefined();
    }
  });

  it("loadLesson caches repeated calls (returns the same promise/result)", async () => {
    const [slug] = slugs;
    expect(slug).toBeDefined();

    const first = loadLesson(slug);
    const second = loadLesson(slug);
    // Module-level memoization means repeated calls for the same slug reuse
    // the same in-flight/resolved promise instead of re-importing.
    expect(first).toBe(second);
    expect(await first).toBe(await second);
  });

  it("loadLesson returns null for a genuinely unknown slug instead of throwing", async () => {
    const mod = await loadLesson("this-lesson-does-not-exist/nope");
    expect(mod).toBeNull();
  });

  it("every lesson's prerequisites and related lessons resolve to a real lesson slug", () => {
    // Guards against dangling references in lessonMeta.prerequisites / related
    // (lesson slugs, not course/module slugs) — e.g. a lesson getting renamed
    // or removed while other lessons still point at its old slug.
    const knownSlugs = new Set(slugs);

    for (const slug of slugs) {
      const mod = modules.get(slug);
      if (!mod) continue; // already asserted non-null above; skip to avoid double-failing

      for (const prereqSlug of mod.lessonMeta.prerequisites) {
        expect(
          knownSlugs.has(prereqSlug),
          `lesson "${slug}" lists unknown prerequisite "${prereqSlug}"`
        ).toBe(true);
      }

      for (const related of mod.lessonMeta.related ?? []) {
        expect(
          knownSlugs.has(related.slug),
          `lesson "${slug}" lists unknown related lesson "${related.slug}"`
        ).toBe(true);
      }
    }
  });

  it("the lesson prerequisite graph has no cycles", () => {
    // Guards against a prerequisite cycle (e.g. A requires B requires A),
    // which would make a lesson's "what to read first" chain unsatisfiable.
    const prerequisitesBySlug = new Map<string, string[]>();

    for (const slug of slugs) {
      const mod = modules.get(slug);
      if (!mod) continue;
      prerequisitesBySlug.set(slug, mod.lessonMeta.prerequisites);
    }

    const VISITING = 1;
    const VISITED = 2;
    const state = new Map<string, typeof VISITING | typeof VISITED>();

    function visit(slug: string, path: string[]): void {
      const status = state.get(slug);
      if (status === VISITED) return;
      if (status === VISITING) {
        throw new Error(`prerequisite cycle detected: ${[...path, slug].join(" -> ")}`);
      }

      state.set(slug, VISITING);
      for (const prereqSlug of prerequisitesBySlug.get(slug) ?? []) {
        // Unknown prerequisites are covered by the dangling-reference test
        // above; skip them here so this test only ever reports real cycles.
        if (!prerequisitesBySlug.has(prereqSlug)) continue;
        visit(prereqSlug, [...path, slug]);
      }
      state.set(slug, VISITED);
    }

    for (const slug of slugs) {
      expect(() => visit(slug, [])).not.toThrow();
    }
  });
});
