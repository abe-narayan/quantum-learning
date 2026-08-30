import { describe, expect, it } from "vitest";
import { COURSES, getCourse, getCoursesByPillar } from "@/lib/content/curriculum";
import { LESSON_METAS } from "@/lib/content/lessonMeta.generated";
import { PILLAR_ORDER } from "@/lib/design/pillars";
import { coursesOutsideChain } from "@/components/apex/readiness";
import type { LessonMetaWithSlug } from "@/lib/content/types";

/**
 * ============================================================
 * The progression, as invariants rather than as prose
 * ============================================================
 * `curriculum.test.ts` proves the course graph is well formed (no cycles, no
 * dangling slugs, no difficulty inversion, every course reachable from a root).
 * `curriculumCoverage.test.ts` proves the lesson graph agrees with it. Neither
 * of them asks the question a reader asks, which is not "is this graph valid"
 * but "having finished this, can I actually start something?"
 *
 * Those are different questions and the answer to the second one was no in two
 * places. `/courses/noise-decoherence-and-scaling` printed exactly one forward
 * link, to Rigorous Quantum Information Theory, which also requires Advanced
 * Topics in Quantum Mechanics and Quantum Error Correction & Fault Tolerance;
 * a reader who did what the page said arrived at a course they could not open,
 * with nothing on the previous page having warned them. Five more courses have
 * no reverse edge at all and ended on the sentence "as far as the curriculum is
 * concerned today, this is a terminal course", which is a full stop rather than
 * a next step.
 *
 * The tests below pin the two guarantees the fixed pages make.
 */

/** Transitive prerequisite closure of a course, including the course itself. */
function readBy(slug: string): Set<string> {
  const seen = new Set<string>([slug]);
  const queue = [slug];
  while (queue.length > 0) {
    for (const prereqSlug of getCourse(queue.pop()!)?.prerequisites ?? []) {
      if (seen.has(prereqSlug)) continue;
      seen.add(prereqSlug);
      queue.push(prereqSlug);
    }
  }
  return seen;
}

describe("every course offers a forward move a reader can actually take", () => {
  it("names at least one course that is startable on finishing it", () => {
    // The exact computation `/courses/[slug]` renders: a dependent course whose
    // *other* prerequisites are already behind the reader, or — when there is
    // no such dependent — any course the closure now opens. If both are empty
    // the page falls back to the track and the catalog, which is a real link
    // but a generic one, so this asserts the specific answer exists.
    for (const course of COURSES) {
      const behind = readBy(course.slug);
      const startableDependents = COURSES.filter(
        (candidate) =>
          candidate.prerequisites.includes(course.slug) &&
          candidate.prerequisites.every((slug) => behind.has(slug))
      );
      const nowOpen = COURSES.filter(
        (candidate) =>
          !behind.has(candidate.slug) &&
          candidate.prerequisites.every((slug) => behind.has(slug))
      );
      expect(
        startableDependents.length + nowOpen.length,
        `course "${course.slug}" is a dead end: nothing lists it as a prerequisite whose other prerequisites it also covers, and finishing it plus everything it required opens no further course. /courses/${course.slug} would end on a generic link.`
      ).toBeGreaterThan(0);
    }
  });

  it("the last track in curriculum order still has courses left to name", () => {
    // `PillarNext` keeps the first five track pages off a dead end by naming
    // the track on either side. Apex is last in `PILLAR_ORDER`, so it has no
    // "leads to" neighbour and its § 03 block carries the job instead: the
    // courses Apex neither contains nor requires. If that list ever empties,
    // the section renders nothing and /apex is a terminal page again — so it
    // fails here rather than silently disappearing.
    const lastPillar = PILLAR_ORDER[PILLAR_ORDER.length - 1];
    const lastPillarCourses = getCoursesByPillar(lastPillar);
    const remaining = coursesOutsideChain(
      lastPillarCourses,
      LESSON_METAS as LessonMetaWithSlug[],
      COURSES
    );
    expect(
      remaining.length,
      `"${lastPillar}" is the last track and now requires the entire curriculum, so /apex's "what the summit route leaves out" section renders nothing and the page ends with no forward move. Give it another closing block before removing this test.`
    ).toBeGreaterThan(0);
  });
});

describe("lesson order inside a course", () => {
  it("no lesson requires a lesson from a later module of its own course", () => {
    // `curriculumCoverage.test.ts` checks cross-course prerequisites against
    // the course closure and explicitly skips same-course edges
    // (`if (prereqCourse === meta.course) continue`). That leaves the ordering
    // *within* a course unchecked, which is the one a reader meets first: the
    // module list on /courses/<slug> is read top to bottom, so a lesson at
    // position 2 requiring one at position 7 is a wall with no signpost, and
    // nothing about it is visible in the course data.
    const moduleIndex = new Map<string, number>();
    for (const course of COURSES) {
      course.modules.forEach((courseModule, index) => {
        moduleIndex.set(`${course.slug}/${courseModule.slug}`, index);
      });
    }
    const bySlug = new Map(LESSON_METAS.map((meta) => [meta.slug, meta]));

    for (const meta of LESSON_METAS) {
      const own = moduleIndex.get(`${meta.course}/${meta.module}`);
      if (own === undefined) continue; // module/course mismatch is another test's job
      for (const prereqSlug of meta.prerequisites) {
        const prereq = bySlug.get(prereqSlug);
        if (!prereq || prereq.course !== meta.course) continue;
        const theirs = moduleIndex.get(`${prereq.course}/${prereq.module}`);
        if (theirs === undefined) continue;
        expect(
          theirs <= own,
          `lesson "${meta.slug}" sits at module ${own + 1} of "${meta.course}" but requires "${prereqSlug}", which is module ${theirs + 1} of the same course. Reorder the modules in curriculum.ts or drop the prerequisite.`
        ).toBe(true);
      }
    }
  });
});
