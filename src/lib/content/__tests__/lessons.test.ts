import { describe, expect, it } from "vitest";
import { getAllLessonSlugs, loadLesson } from "../lessons";
import { getCourse, getModule } from "../curriculum";

describe("lesson corpus integrity", () => {
  it("has at least one authored lesson slug", async () => {
    const slugs = await getAllLessonSlugs();
    expect(slugs.length).toBeGreaterThan(0);
  });

  it("loads every authored lesson without error", async () => {
    // This is the regression test for the bug that motivated this file: a
    // genuine MDX parse/evaluation error (e.g. a ReferenceError) was being
    // swallowed by loadLesson()'s blanket try/catch and silently rendering
    // as a false 404, despite `npm run build` reporting success. Every slug
    // returned by getAllLessonSlugs() is a known-good slug (it came straight
    // from the filesystem walk that also feeds generateStaticParams), so
    // loadLesson() must resolve every one of them to a real module — a null
    // here means either loadLesson regressed back to swallowing real errors,
    // or a lesson file's MDX/JS is genuinely broken.
    const slugs = await getAllLessonSlugs();

    for (const slug of slugs) {
      const mod = await loadLesson(slug);
      expect(mod, `loadLesson("${slug}") resolved to null`).not.toBeNull();
      expect(mod?.default, `lesson "${slug}" has no default export`).toBeTypeOf("function");
      expect(mod?.lessonMeta, `lesson "${slug}" has no lessonMeta export`).toBeDefined();
    }
  }, 120000);

  it("every lesson's lessonMeta.course/module resolves to a real curriculum entry", async () => {
    // Guards against the class of bug (already found and fixed once this
    // session on a different lesson) where a lesson's frontmatter course or
    // module slug drifts out of sync with curriculum.ts.
    const slugs = await getAllLessonSlugs();

    for (const slug of slugs) {
      const mod = await loadLesson(slug);
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
    const [slug] = await getAllLessonSlugs();
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
});
