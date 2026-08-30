import { describe, expect, it } from "vitest";

import { LESSON_METAS } from "../lessonMeta.generated";
import { COURSES } from "../curriculum";

/**
 * Lesson ordering rests on an invariant nothing states out loud: **every
 * (course, module) pair holds exactly one lesson.**
 *
 * `LessonMeta.order` is documented as "position of this lesson within its
 * module (modules can later hold more than one)". Today no module holds more
 * than one, so `order` never actually decides anything: consumers sort by the
 * module's index in `curriculum.ts` and only reach `order` as a tiebreaker
 * between lessons sharing a module slug, which never happens. 175 of the 219
 * lessons carry `order: 1` and the Mastery and Apex lessons carry real
 * ordinals, and the site renders identically either way.
 *
 * That makes it a trap rather than a bug. It is a reasonable affordance to
 * keep, and deleting it would mean touching all 219 lessons to remove a field
 * that costs nothing. But the moment somebody adds a second lesson to an
 * existing module, `order` stops being decorative and starts deciding reading
 * sequence, and if both lessons carry the inherited `order: 1` the sort falls
 * back to whatever order the registry happened to be built in. That is a
 * silent, non-deterministic curriculum reordering: no error, no type error,
 * and a reader sent through the material in the wrong sequence.
 *
 * So this test does not forbid a module holding two lessons. It requires that
 * when one does, the `order` values actually distinguish them.
 */

describe("lesson ordering", () => {
  const byModule = new Map<string, typeof LESSON_METAS>();
  for (const lesson of LESSON_METAS) {
    const key = `${lesson.course}/${lesson.module}`;
    const bucket = byModule.get(key) ?? [];
    bucket.push(lesson);
    byModule.set(key, bucket);
  }

  it("scans the whole corpus, so the checks below cannot be vacuous", () => {
    expect(LESSON_METAS.length).toBeGreaterThan(200);
    expect(byModule.size).toBeGreaterThan(200);
  });

  it("gives every lesson in a shared module a distinct order", () => {
    const ambiguous: string[] = [];

    for (const [key, lessons] of byModule) {
      if (lessons.length < 2) continue;
      const orders = lessons.map((lesson) => lesson.order);
      if (new Set(orders).size !== orders.length) {
        ambiguous.push(
          `${key} has ${lessons.length} lessons sharing order values [${orders.join(", ")}]: ` +
            lessons.map((lesson) => lesson.slug).join(", ")
        );
      }
    }

    expect(
      ambiguous,
      "these modules hold more than one lesson, so `order` now decides the " +
        "reading sequence, but the values do not distinguish them. The sort " +
        "falls back to registry insertion order, which is not a curriculum " +
        "decision. Give each lesson in the module its real position."
    ).toEqual([]);
  });

  it("gives every lesson a module its course actually declares", () => {
    const courseModules = new Map(
      COURSES.map((course) => [course.slug, new Set(course.modules.map((m) => m.slug))])
    );

    const orphans = LESSON_METAS.filter((lesson) => {
      const modules = courseModules.get(lesson.course);
      return !modules || !modules.has(lesson.module);
    }).map((lesson) => `${lesson.slug} -> ${lesson.course}/${lesson.module}`);

    expect(
      orphans,
      "a lesson whose module is not declared by its course has no position in " +
        "the reading order at all, because the sort keys off the module's index " +
        "in curriculum.ts"
    ).toEqual([]);
  });

  it("declares a positive order on every lesson", () => {
    const bad = LESSON_METAS.filter(
      (lesson) => !Number.isInteger(lesson.order) || lesson.order < 1
    ).map((lesson) => `${lesson.slug} (order: ${String(lesson.order)})`);

    expect(bad).toEqual([]);
  });
});
