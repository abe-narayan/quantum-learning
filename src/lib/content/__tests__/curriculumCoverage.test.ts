import { describe, expect, it } from "vitest";
import { COURSES } from "../curriculum";
import { LESSON_METAS } from "../lessonMeta.generated";

/**
 * The reverse direction of the lesson→module check in `lessons.test.ts`:
 * that suite proves every lesson's `course`/`module` resolves to a real
 * curriculum entry, but nothing proved every curriculum module actually
 * contains a lesson — an empty module (a typo'd module slug in
 * curriculum.ts, or a module added before its lessons) would ship silently
 * as a dead entry on the course page.
 *
 * Deliberately built on the generated metadata registry rather than
 * `loadLesson`: this needs only `course` + `module` per lesson, so there is
 * no reason to pay for compiling the MDX corpus here.
 */
describe("curriculum coverage", () => {
  const populatedModules = new Set(LESSON_METAS.map((meta) => `${meta.course}/${meta.module}`));

  it("every module of every course contains at least one lesson", () => {
    for (const course of COURSES) {
      for (const mod of course.modules) {
        expect(
          populatedModules.has(`${course.slug}/${mod.slug}`),
          `module "${course.slug}/${mod.slug}" ("${mod.title}") has no lessons`
        ).toBe(true);
      }
    }
  });

  it("every course contains at least one module", () => {
    // An empty `modules` array would make the test above pass vacuously for
    // that course while the course page renders with no content at all.
    for (const course of COURSES) {
      expect(course.modules.length, `course "${course.slug}" has no modules`).toBeGreaterThan(0);
    }
  });
});
