import { describe, expect, it } from "vitest";
import { PROBLEMS } from "../registry.generated";
import { PROBLEM_METAS } from "../problemMeta.generated";
import {
  getAllProblemMeta,
  getProblemMeta,
  getProblemMetaForLesson,
  getProblemMetaForCourse,
} from "../metaRegistry";

/**
 * THE drift guard for the meta-only registry.
 *
 * `PROBLEM_METAS` is text-extracted from each problem file's source by
 * `scripts/generate-problem-registry.mjs` (so importing it never pulls in
 * the 547 problem modules or the quantum lib behind them), while `PROBLEMS`
 * imports the real modules. Nothing at the type level ties the two
 * together — this test is what guarantees the extracted metas can never
 * silently diverge from the real ones (a regex mis-extraction, a stale
 * generated file, an eval'd literal that differs from what TypeScript
 * actually evaluates).
 */
describe("problemMeta.generated stays in lockstep with registry.generated", () => {
  it("has exactly one meta per problem, in the same order", () => {
    expect(PROBLEM_METAS.length).toBe(PROBLEMS.length);
  });

  it("deep-equals PROBLEMS.map(p => p.meta) element by element", () => {
    for (let i = 0; i < PROBLEMS.length; i++) {
      // Element-wise (rather than one whole-array assertion) so a failure
      // names the exact problem that drifted instead of dumping 547 metas.
      expect(PROBLEM_METAS[i], `PROBLEM_METAS[${i}] (slug "${PROBLEMS[i].meta.slug}")`).toEqual(
        PROBLEMS[i].meta
      );
    }
  });
});

describe("metaRegistry lookups", () => {
  it("getAllProblemMeta returns every meta", () => {
    expect(getAllProblemMeta()).toBe(PROBLEM_METAS);
  });

  it("getProblemMeta finds a real slug and misses a fake one", () => {
    const first = PROBLEM_METAS[0];
    expect(getProblemMeta(first.slug)).toEqual(first);
    expect(getProblemMeta("definitely-not-a-problem-slug")).toBeUndefined();
  });

  it("getProblemMetaForLesson matches the full registry's per-lesson filter", () => {
    const lessons = new Set(
      PROBLEM_METAS.map((meta) => meta.lesson).filter((l): l is string => Boolean(l))
    );
    expect(lessons.size).toBeGreaterThan(0);
    for (const lesson of lessons) {
      expect(getProblemMetaForLesson(lesson)).toEqual(
        PROBLEMS.filter((p) => p.meta.lesson === lesson).map((p) => p.meta)
      );
    }
  });

  it("getProblemMetaForCourse matches the full registry's per-course filter", () => {
    const courses = new Set(PROBLEM_METAS.map((meta) => meta.course));
    expect(courses.size).toBeGreaterThan(0);
    for (const course of courses) {
      expect(getProblemMetaForCourse(course)).toEqual(
        PROBLEMS.filter((p) => p.meta.course === course).map((p) => p.meta)
      );
    }
  });
});
