import { describe, expect, it } from "vitest";
import { COURSES, getCourse } from "../curriculum";
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

/**
 * ============================================================
 * The lesson prerequisite graph, checked without compiling a single lesson
 * ============================================================
 * `lessons.test.ts` already asserts dangling-reference-freedom and acyclicity
 * over the same edges — but it does so *after* importing all 219 compiled MDX
 * modules, which is a five-minute, multi-gigabyte operation that exists to
 * catch a different class of bug (a lesson that fails to evaluate at all) and
 * has already had to have its timeout raised twice. A structural claim about
 * the prerequisite graph does not need the corpus compiled; it needs the
 * numbers and slugs, which `LESSON_METAS` already holds as plain data. So the
 * graph invariants live here, where they run in milliseconds and stay
 * runnable in isolation while someone is editing curriculum.ts. The overlap
 * with `lessons.test.ts` is deliberate redundancy on the cheap side of the
 * cost curve, not duplication to be tidied away.
 *
 * The invariant this suite exists for, and the one nothing else covered, is
 * the last test: a lesson may only depend on a lesson from its own course or
 * from a course the *course-level* graph actually promises. Both graphs were
 * individually consistent and quietly disagreed with each other in nine
 * places — including one that put a Bell state, from the Computing pillar, in
 * the middle of the Mechanics pillar's rigor-first path, where a reader
 * following that path had never been offered it.
 */
describe("the lesson prerequisite graph", () => {
  const bySlug = new Map(LESSON_METAS.map((meta) => [meta.slug, meta] as const));

  /** Same shape rule the course/module slugs are held to, per path segment. */
  const URL_SAFE_SEGMENT = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  /**
   * The band a lesson's `estimatedMinutes` has to fall in. Not a style
   * preference: below the floor the thing is a note rather than a lesson (and
   * the "N min" readout on every catalog row stops being worth rendering),
   * and above the ceiling a reader cannot finish it in one sitting, which is
   * the unit `ContinueLearning` and the completion marks are built around —
   * the fix for a 2-hour lesson is to split it, not to print "120 min".
   */
  const MIN_LESSON_MINUTES = 5;
  const MAX_LESSON_MINUTES = 90;

  /** Every lesson slug reachable from `slug` by following prerequisites. */
  function prerequisiteClosure(slug: string): Set<string> {
    const closure = new Set<string>();
    const stack = [...(bySlug.get(slug)?.prerequisites ?? [])];
    while (stack.length > 0) {
      const next = stack.pop()!;
      if (closure.has(next)) continue;
      closure.add(next);
      for (const deeper of bySlug.get(next)?.prerequisites ?? []) stack.push(deeper);
    }
    return closure;
  }

  it("every lesson slug is unique, URL-safe, and ends in its own module", () => {
    const seen = new Set<string>();
    for (const meta of LESSON_METAS) {
      expect(seen.has(meta.slug), `duplicate lesson slug "${meta.slug}"`).toBe(false);
      seen.add(meta.slug);

      const segments = meta.slug.split("/");
      expect(
        segments.length,
        `lesson slug "${meta.slug}" should have exactly three segments (pillar/course/lesson)`
      ).toBe(3);
      for (const segment of segments) {
        expect(
          URL_SAFE_SEGMENT.test(segment),
          `lesson slug "${meta.slug}" has a segment that is not URL-safe — use lowercase words joined by single hyphens`
        ).toBe(true);
      }

      // The slug is what `/lessons/[...slug]` resolves and what every
      // prerequisite and `related` entry elsewhere in the corpus points at, so
      // its middle segment drifting from `meta.course` would give one lesson
      // two identities: one the router knows and one the curriculum does.
      expect(
        segments[1],
        `lesson "${meta.slug}" sits at course segment "${segments[1]}" but declares course "${meta.course}"`
      ).toBe(meta.course);
      const pillar = getCourse(meta.course)?.pillar;
      if (pillar) {
        expect(
          segments[0],
          `lesson "${meta.slug}" sits under pillar segment "${segments[0]}" but its course belongs to pillar "${pillar}"`
        ).toBe(pillar);
      }
    }
  });

  it("every lesson prerequisite resolves to a lesson that exists", () => {
    for (const meta of LESSON_METAS) {
      for (const prereqSlug of meta.prerequisites) {
        expect(
          bySlug.has(prereqSlug),
          `lesson "${meta.slug}" lists prerequisite "${prereqSlug}", which is not a lesson in the registry — check for a rename, or re-run \`npm run generate:lesson-registry\``
        ).toBe(true);
      }
    }
  });

  it("no lesson is its own prerequisite, directly or transitively", () => {
    // The self-referential case ("A requires A") reads as an obvious typo and
    // is; the transitive case ("A requires B requires C requires A") is the
    // one that gets authored by accident, when two lessons are each written
    // to lean on something the other established. Either way the effect on a
    // reader is identical and total: `PrerequisiteReadout` can never show the
    // lesson as ready, because satisfying it requires having already read it.
    for (const meta of LESSON_METAS) {
      const closure = prerequisiteClosure(meta.slug);
      expect(
        closure.has(meta.slug),
        `lesson "${meta.slug}" is in its own prerequisite closure — following its prerequisites leads back to itself, so it can never become readable`
      ).toBe(false);
    }
  });

  it("every lesson is reachable from a lesson with no prerequisites", () => {
    // The entry-point guarantee, at lesson granularity: `/learn` offers two
    // doors ("What Is a Qubit?" for the intuition-first path, Mathematical
    // Foundations' first lesson for the rigor-first one), and both are doors
    // precisely because they declare no prerequisites. Anything not reachable
    // from some such door is a lesson nobody is ever told how to get to.
    const roots = LESSON_METAS.filter((meta) => meta.prerequisites.length === 0);
    expect(
      roots.length,
      "no lesson has an empty prerequisite list — the corpus has no entry point"
    ).toBeGreaterThan(0);

    // AND semantics, exactly as in the course-level version: a lesson opens up
    // only when *all* of its prerequisites already have.
    const reachable = new Set(roots.map((meta) => meta.slug));
    let grew = true;
    while (grew) {
      grew = false;
      for (const meta of LESSON_METAS) {
        if (reachable.has(meta.slug)) continue;
        if (meta.prerequisites.every((slug) => reachable.has(slug))) {
          reachable.add(meta.slug);
          grew = true;
        }
      }
    }

    const unreachable = LESSON_METAS.filter((meta) => !reachable.has(meta.slug)).map(
      (meta) => meta.slug
    );
    expect(
      unreachable,
      `these lessons can never become ready — their prerequisite chains loop or dead-end before reaching a lesson with none: ${unreachable.join(", ")}`
    ).toEqual([]);
  });

  it("every lesson declares an estimatedMinutes a reader could actually sit through", () => {
    for (const meta of LESSON_METAS) {
      expect(
        typeof meta.estimatedMinutes === "number" && Number.isFinite(meta.estimatedMinutes),
        `lesson "${meta.slug}" has no numeric estimatedMinutes — every catalog row renders it`
      ).toBe(true);
      expect(
        meta.estimatedMinutes >= MIN_LESSON_MINUTES && meta.estimatedMinutes <= MAX_LESSON_MINUTES,
        `lesson "${meta.slug}" claims ${meta.estimatedMinutes} min, outside the ${MIN_LESSON_MINUTES}-${MAX_LESSON_MINUTES} min band — under the floor it is a note, not a lesson; over the ceiling it should be split into two`
      ).toBe(true);
    }
  });

  it("no lesson requires a lesson from a course the curriculum never promised", () => {
    // The invariant that ties the two prerequisite graphs together, and the
    // reason this file exists in its current form.
    //
    // A lesson's prerequisites are lesson slugs; a course's prerequisites are
    // course slugs. Nothing forced them to agree, and for nine edges they did
    // not: "Degeneracy in Practice" (Mechanics) opened by calling a Bell state
    // "a system you already know" while its course promised only Wave
    // Mechanics; "Noise Simulation" (Software) imported Kraus channels its
    // course never mentioned; the Lindblad lesson derived a hardware result
    // its course never sent the reader to see. In every case the *lesson* was
    // right and the *course card* was hiding the dependency, so the reader met
    // it as a wall rather than a plan.
    //
    // The rule: a lesson may depend on its own course, or on any course inside
    // its course's transitive prerequisite closure. Anything else is a
    // dependency the curriculum structure never told anyone about — fix it by
    // adding the missing course prerequisite (usually right), or by changing
    // the lesson to stop leaning on it.
    const closureByCourse = new Map<string, Set<string>>();
    function courseClosure(slug: string): Set<string> {
      const cached = closureByCourse.get(slug);
      if (cached) return cached;
      const closure = new Set<string>();
      // Seeded before recursing so a (separately tested) course-level cycle
      // cannot turn a failure here into an infinite loop.
      closureByCourse.set(slug, closure);
      for (const prereqSlug of getCourse(slug)?.prerequisites ?? []) {
        closure.add(prereqSlug);
        for (const deeper of courseClosure(prereqSlug)) closure.add(deeper);
      }
      return closure;
    }

    for (const meta of LESSON_METAS) {
      const promised = courseClosure(meta.course);
      for (const prereqSlug of meta.prerequisites) {
        const prereqCourse = bySlug.get(prereqSlug)?.course;
        if (!prereqCourse) continue; // covered by the dangling-reference test above
        if (prereqCourse === meta.course) continue;
        expect(
          promised.has(prereqCourse),
          `lesson "${meta.slug}" requires "${prereqSlug}", which belongs to course "${prereqCourse}" — but course "${meta.course}" does not list "${prereqCourse}" among its prerequisites, directly or transitively. Add it to that course's \`prerequisites\` in curriculum.ts, or rewrite the lesson not to depend on it.`
        ).toBe(true);
      }
    }
  });
});

describe("course length matches the lessons behind it", () => {
  it("every course's estimatedHours is the sum of its lessons' estimatedMinutes, to the nearest half hour", () => {
    // `CourseList` prints `{course.estimatedHours}h` in the stats block and
    // `{lesson.estimatedMinutes} min` on every module row of the same card, so
    // these two numbers are compared by every reader who looks twice. Before
    // this rule they disagreed by between 1.1x and 4.1x with no consistent
    // factor — Quantum Shannon Theory advertised 11h above six rows totalling
    // 160 minutes — which is not a rounding difference a reader can charitably
    // explain away, and once noticed it discredits every other figure on the
    // page.
    //
    // Asserting the derivation rather than the values is what makes it stay
    // true: adding a lesson, or retiming one, now fails here with the number
    // to write down instead of silently widening the gap again.
    for (const course of COURSES) {
      const minutes = LESSON_METAS.filter((meta) => meta.course === course.slug).reduce(
        (sum, meta) => sum + meta.estimatedMinutes,
        0
      );
      if (minutes === 0) continue; // an unauthored course has nothing to derive from yet
      const expected = Math.round(minutes / 30) / 2;
      expect(
        course.estimatedHours,
        `course "${course.slug}" declares ${course.estimatedHours}h but its ${minutes} minutes of authored lessons round to ${expected}h — set estimatedHours to ${expected}`
      ).toBe(expected);
    }
  });
});
