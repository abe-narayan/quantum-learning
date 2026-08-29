import { describe, expect, it } from "vitest";
import { COURSES, PILLARS, getCourse } from "../curriculum";
import { DIFFICULTY_LABEL, type Difficulty } from "../types";

/**
 * Slug shape shared by courses, modules and (in `curriculumCoverage.test.ts`)
 * lessons. Every one of these ends up in a URL path segment —
 * `/courses/<course>`, `/lessons/<pillar>/<course>/<lesson>` — so anything
 * outside lowercase-alphanumeric-with-single-hyphens either needs escaping
 * (and then no longer round-trips through `getCourse`) or silently produces a
 * second, differently-cased URL for the same page.
 */
const URL_SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Difficulty as an ordered ladder, for the monotonicity check below. */
const DIFFICULTY_RANK: Record<Difficulty, number> = {
  foundational: 0,
  intermediate: 1,
  advanced: 2,
  master: 3,
};

/**
 * Courses allowed to be marked `foundational` despite listing prerequisites,
 * with the reason each one earns the exception. `foundational` is rendered by
 * `DifficultyMark` as the visible gloss "no prior background needed", so a
 * course carrying both that badge and a "Requires …" line is telling a reader
 * two contradictory things on one card — the exact failure that had
 * "Programming Quantum Computers" advertising no background needed above a
 * requirement for two full Computing courses.
 *
 * The one legitimate case is a declared *entry point*: `/learn` offers a fork,
 * and its intuition-first door is "What Is a Qubit?", the first lesson of
 * Qubits & Quantum States, which genuinely has no lesson-level prerequisites
 * and assumes no math. That course's link to Mathematical Foundations is a
 * recommendation the reader can defer, not a gate — see the report in
 * curriculum.ts. Adding a slug here should mean writing down why, not silencing
 * the test.
 */
const FOUNDATIONAL_WITH_PREREQUISITES_EXCEPTIONS = new Set(["qubits-and-quantum-states"]);

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

  it("every course slug and module slug is URL-safe", () => {
    // Course slugs become `/courses/<slug>` and module slugs are the middle
    // segment of a lesson path. An uppercase letter, a space, or a stray
    // underscore here does not throw — it produces a route that either 404s or
    // resolves to a second URL for the same page, which is the kind of thing
    // that is only ever noticed in production.
    for (const course of COURSES) {
      expect(
        URL_SAFE_SLUG.test(course.slug),
        `course slug "${course.slug}" is not URL-safe — use lowercase words joined by single hyphens`
      ).toBe(true);
      for (const courseModule of course.modules) {
        expect(
          URL_SAFE_SLUG.test(courseModule.slug),
          `module slug "${course.slug}/${courseModule.slug}" is not URL-safe — use lowercase words joined by single hyphens`
        ).toBe(true);
      }
    }
  });

  it("every course is reachable from a course with no prerequisites", () => {
    // The acyclicity test above proves nobody is stuck in a loop; this proves
    // there is a way *in*. A course whose prerequisite chain never bottoms out
    // at a zero-prerequisite course can never become "ready" for any reader,
    // and — because `/learn` derives its rigor-first entry card by filtering
    // for `prerequisites.length === 0` — an orphaned island would simply never
    // be offered to anyone. In a finite acyclic graph the two failure modes
    // that produce this are a cycle (already covered) and a dangling
    // prerequisite slug (also already covered), so a failure here after those
    // pass means every course in some subgraph has prerequisites but the
    // subgraph has no root.
    const roots = COURSES.filter((course) => course.prerequisites.length === 0).map(
      (course) => course.slug
    );
    expect(roots.length, "no course has an empty prerequisite list — the curriculum has no way in").toBeGreaterThan(0);

    const reachable = new Set(roots);
    // Repeated relaxation rather than a topological sort: a course becomes
    // reachable only once *every* one of its prerequisites is, which is the
    // AND semantics a reader actually experiences ("all of these first"), not
    // the OR semantics a plain graph traversal would give.
    let grew = true;
    while (grew) {
      grew = false;
      for (const course of COURSES) {
        if (reachable.has(course.slug)) continue;
        if (course.prerequisites.every((slug) => reachable.has(slug))) {
          reachable.add(course.slug);
          grew = true;
        }
      }
    }

    const unreachable = COURSES.filter((course) => !reachable.has(course.slug)).map(
      (course) => course.slug
    );
    expect(
      unreachable,
      `these courses can never be unlocked — every path back from them loops or dead-ends before reaching a zero-prerequisite course: ${unreachable.join(", ")}`
    ).toEqual([]);
  });

  it("no course is advertised as easier than a course it requires", () => {
    // `DifficultyMark` is the one signal a reader scanning `/learn` uses to
    // decide what they are ready for, and `CurriculumExplorer`'s level filter
    // is an exact match on it. A course marked `intermediate` whose
    // prerequisite is marked `advanced` therefore appears in a strictly
    // easier bucket than material it cannot be read without — the reader
    // filters for "Intermediate", starts there, and lands in the harder course
    // anyway one link later. (Found once, in Simulating Quantum Systems, when
    // its real dependency on Advanced Topics in Quantum Mechanics' Kraus
    // channels was written down; the fix was to raise the course, not to hide
    // the edge.)
    for (const course of COURSES) {
      for (const prereqSlug of course.prerequisites) {
        const prerequisite = getCourse(prereqSlug);
        if (!prerequisite) continue; // covered by the dangling-reference test above
        expect(
          DIFFICULTY_RANK[course.difficulty] >= DIFFICULTY_RANK[prerequisite.difficulty],
          `course "${course.slug}" is marked ${DIFFICULTY_LABEL[course.difficulty]} but requires "${prereqSlug}", which is marked ${DIFFICULTY_LABEL[prerequisite.difficulty]} — either raise this course's difficulty or drop the prerequisite`
        ).toBe(true);
      }
    }
  });

  it("only a declared entry point is marked foundational while having prerequisites", () => {
    // See FOUNDATIONAL_WITH_PREREQUISITES_EXCEPTIONS above for why the list
    // exists and what belongs on it.
    for (const course of COURSES) {
      if (course.difficulty !== "foundational") continue;
      if (course.prerequisites.length === 0) continue;
      expect(
        FOUNDATIONAL_WITH_PREREQUISITES_EXCEPTIONS.has(course.slug),
        `course "${course.slug}" is marked Foundational — which renders to a reader as "no prior background needed" — but requires ${course.prerequisites.join(", ")}. Mark it Intermediate, or add it to FOUNDATIONAL_WITH_PREREQUISITES_EXCEPTIONS with the reason it is a real entry point.`
      ).toBe(true);
    }
  });

  it("every course declares a positive estimatedHours", () => {
    // The exact value is re-derived from the lesson corpus in
    // curriculumCoverage.test.ts; this is the cheap shape check that runs even
    // if the lesson registry is unavailable, and it catches the one thing that
    // silently renders as a plausible-looking card: `0h`.
    for (const course of COURSES) {
      expect(
        Number.isFinite(course.estimatedHours) && course.estimatedHours > 0,
        `course "${course.slug}" has estimatedHours ${course.estimatedHours} — every course must declare a positive length`
      ).toBe(true);
    }
  });
});
