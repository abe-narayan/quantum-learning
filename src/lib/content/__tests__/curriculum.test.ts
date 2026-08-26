import { describe, expect, it } from "vitest";
import { COURSES, PILLARS, getCourse } from "../curriculum";

describe("curriculum (course-level) integrity", () => {
  it("every course's prerequisites resolve to a real course slug", () => {
    // Course-level prerequisites (curriculum.ts) are a separate graph from
    // lesson-level prerequisites (lessonMeta.prerequisites, already checked
    // in lessons.test.ts) — nothing validated this one until now, so a typo
    // in a course's `prerequisites` array (e.g. when adding a new course)
    // would silently produce a dangling reference with no test failure.
    for (const course of COURSES) {
      for (const prereqSlug of course.prerequisites) {
        expect(
          getCourse(prereqSlug),
          `course "${course.slug}" lists unknown prerequisite course "${prereqSlug}"`
        ).toBeDefined();
      }
    }
  });

  it("the course prerequisite graph has no cycles", () => {
    const prerequisitesBySlug = new Map<string, string[]>();
    for (const course of COURSES) {
      prerequisitesBySlug.set(course.slug, course.prerequisites);
    }

    function visit(slug: string, path: string[]): void {
      if (path.includes(slug)) {
        throw new Error(`course prerequisite cycle detected: ${[...path, slug].join(" -> ")}`);
      }
      for (const prereqSlug of prerequisitesBySlug.get(slug) ?? []) {
        if (!prerequisitesBySlug.has(prereqSlug)) continue; // covered by the dangling-reference test above
        visit(prereqSlug, [...path, slug]);
      }
    }

    for (const course of COURSES) {
      expect(() => visit(course.slug, [])).not.toThrow();
    }
  });

  it("no course lists itself as its own prerequisite", () => {
    for (const course of COURSES) {
      expect(course.prerequisites).not.toContain(course.slug);
    }
  });

  it("every course belongs to a real pillar and has at least one module", () => {
    const pillarSlugs = new Set(PILLARS.map((pillar) => pillar.slug));
    for (const course of COURSES) {
      expect(pillarSlugs.has(course.pillar), `course "${course.slug}" has unknown pillar "${course.pillar}"`).toBe(
        true
      );
      expect(course.modules.length, `course "${course.slug}" has no modules`).toBeGreaterThan(0);
    }
  });

  it("every course has a unique slug, and every module slug is unique within its course", () => {
    const seenCourseSlugs = new Set<string>();
    for (const course of COURSES) {
      expect(seenCourseSlugs.has(course.slug), `duplicate course slug "${course.slug}"`).toBe(false);
      seenCourseSlugs.add(course.slug);

      const seenModuleSlugs = new Set<string>();
      for (const courseModule of course.modules) {
        expect(
          seenModuleSlugs.has(courseModule.slug),
          `duplicate module slug "${courseModule.slug}" within course "${course.slug}"`
        ).toBe(false);
        seenModuleSlugs.add(courseModule.slug);
      }
    }
  });

  it("every pillar has a unique slug", () => {
    const seen = new Set<string>();
    for (const pillar of PILLARS) {
      expect(seen.has(pillar.slug), `duplicate pillar slug "${pillar.slug}"`).toBe(false);
      seen.add(pillar.slug);
    }
  });
});
