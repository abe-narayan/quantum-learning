import { describe, expect, it } from "vitest";
/* Components are constructed with `createElement` rather than JSX, for the
   reason `src/components/mdx/__tests__/Term.test.ts` documents: vitest's
   `include` is `src/**\/*.test.ts`, and `.ts` files are not parsed for JSX. */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { UpstreamDistanceLine, upstreamDistance } from "@/components/lessons/PrerequisiteReadout";
import { COURSES, getCourse } from "@/lib/content/curriculum";
import { LESSON_METAS } from "@/lib/content/lessonMeta.generated";
import {
  DISTANT_UPSTREAM_LESSONS,
  authoredLessonSlugs,
  chainLessonCount,
  directPrerequisites,
  lessonPrerequisiteChain,
  prerequisiteChain,
} from "@/components/apex/readiness";

/**
 * ============================================================
 * "0 / 1 complete" on a lesson 110 lessons deep
 * ============================================================
 * A reviewer reading the site cold clicked from `/apex` into an Apex lesson.
 * The track page had told them the truth ("the prerequisite graph puts 18
 * courses between that and Apex"); the lesson page said `0 / 1 complete`,
 * which they read as one lesson away. They were 110. The two surfaces
 * disagreed because only one of them walked the graph: `/apex` used
 * `prerequisiteChain`, and the lesson page counted `meta.prerequisites`, the
 * immediate edge list.
 *
 * These tests pin both halves of the fix: that the traversal is now literally
 * shared (so the surfaces cannot drift), and that the four states a reader can
 * be in each produce the right readout, including the two that must produce
 * none.
 */

const UPSTREAM_OF = (courseSlug: string) => lessonPrerequisiteChain(courseSlug, LESSON_METAS);

/** The shape `PrerequisiteReadout` derives from a chain plus a progress set. */
function readoutFor(
  courseSlug: string,
  {
    completed = new Set<string>(),
    hydrated = true,
    directPrerequisitesComplete = false,
  }: { completed?: Set<string>; hydrated?: boolean; directPrerequisitesComplete?: boolean } = {}
) {
  const upstream = UPSTREAM_OF(courseSlug);
  return upstreamDistance({
    lessonsPerCourse: upstream.map((course) => course.lessonSlugs.length),
    unreadPerCourse: upstream.map(
      (course) => course.lessonSlugs.filter((slug) => !completed.has(slug)).length
    ),
    distantAt: DISTANT_UPSTREAM_LESSONS,
    hydrated,
    nothingRecorded: completed.size === 0,
    directPrerequisitesComplete,
  });
}

describe("one traversal, two surfaces", () => {
  it("stays consistent with what /apex reports for the pillar as a whole", () => {
    // `/apex` roots the walk at the whole pillar, so its chain is the union of
    // the five courses' ancestries with the five themselves removed. A lesson
    // roots the same walk at its own course, where an Apex sibling *is* real
    // upstream distance. Two invariants follow, and together they say the two
    // surfaces are reading one graph:
    //   1. no lesson chain contains anything the pillar union does not, apart
    //      from Apex courses themselves;
    //   2. the pillar's terminal course (the one that requires the other four)
    //      reaches everything the pillar page reaches, and then some.
    const apexCourses = COURSES.filter((course) => course.pillar === "apex");
    const apexSlugs = new Set(apexCourses.map((course) => course.slug));
    const trackChain = prerequisiteChain(apexCourses, LESSON_METAS).filter(
      (course) => course.lessonSlugs.length > 0
    );
    expect(trackChain).toHaveLength(18);
    const trackSlugs = new Set(trackChain.map((course) => course.slug));

    for (const course of apexCourses) {
      for (const ancestor of UPSTREAM_OF(course.slug)) {
        expect(trackSlugs.has(ancestor.slug) || apexSlugs.has(ancestor.slug), ancestor.slug).toBe(
          true
        );
      }
    }

    const terminal = apexCourses.find((course) =>
      apexCourses.every(
        (sibling) => sibling.slug === course.slug || course.prerequisites.includes(sibling.slug)
      )
    );
    expect(terminal).toBeDefined();
    const terminalSlugs = new Set(UPSTREAM_OF(terminal!.slug).map((course) => course.slug));
    for (const ancestor of trackChain) expect(terminalSlugs.has(ancestor.slug)).toBe(true);
    expect(chainLessonCount(UPSTREAM_OF(terminal!.slug))).toBeGreaterThan(
      chainLessonCount(trackChain)
    );
  });

  it("names a first course that really is first, and really is unfinished", () => {
    const chain = UPSTREAM_OF("algorithmic-frontiers");
    const first = chain[0];
    expect(first).toBeDefined();
    // Topological: nothing before the head of the chain.
    expect(getCourse(first.slug)?.prerequisites ?? []).toEqual([]);
    expect(first.lessonSlugs.length).toBeGreaterThan(0);
    expect(first.href).toMatch(/^\/(courses|lessons)\//);
  });

  it("still resolves the direct prerequisites /apex lists", () => {
    // Guards the extraction: adding the lesson-level entry point must not
    // change what the track pages compute.
    const apexCourses = COURSES.filter((course) => course.pillar === "apex");
    expect(directPrerequisites(apexCourses, LESSON_METAS).length).toBeGreaterThan(0);
    expect(authoredLessonSlugs("qubits-and-quantum-states", LESSON_METAS).length).toBe(10);
  });
});

describe("the reviewer's lesson", () => {
  const APEX_LESSON = "apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries";

  it("has exactly one direct prerequisite and a three-figure ancestry", () => {
    const lesson = LESSON_METAS.find((entry) => entry.slug === APEX_LESSON);
    expect(lesson).toBeDefined();
    // The `0 / 1` the reviewer read as "one lesson away".
    expect(lesson!.prerequisites).toHaveLength(1);
    // What it actually was.
    expect(chainLessonCount(UPSTREAM_OF(lesson!.course))).toBe(110);
  });

  it("reports the graph figure before hydration, saying nothing about the reader", () => {
    const readout = readoutFor("algorithmic-frontiers", { hydrated: false });
    expect(readout).toMatchObject({ voice: "graph", lessons: 110, courses: 13, startHereIndex: 0 });
  });

  it("reports a standing start once hydration confirms an empty store", () => {
    const readout = readoutFor("algorithmic-frontiers");
    expect(readout).toMatchObject({ voice: "standingStart", lessons: 110, unread: 110 });
  });
});

describe("a reader who has made progress", () => {
  const chain = UPSTREAM_OF("algorithmic-frontiers");

  it("switches voice and moves the start-here pointer past what is finished", () => {
    const completed = new Set(chain[0].lessonSlugs);
    const readout = readoutFor("algorithmic-frontiers", { completed });
    expect(readout).toMatchObject({
      voice: "behind",
      lessons: 110,
      unread: 110 - chain[0].lessonSlugs.length,
      startHereIndex: 1,
    });
  });

  it("goes quiet once the remaining distance is under a track's worth", () => {
    // Everything but the last upstream course.
    const completed = new Set(chain.slice(0, -1).flatMap((course) => course.lessonSlugs));
    expect(readoutFor("algorithmic-frontiers", { completed })).toBeNull();
  });

  it("goes quiet the moment the lesson's own prerequisites are complete, whatever the graph says", () => {
    // The advanced reader with outside background: they marked the one lesson
    // this page names, and nothing on the site may then tell them to go back.
    expect(
      readoutFor("algorithmic-frontiers", { directPrerequisitesComplete: true })
    ).toBeNull();
  });

  it("does not act on that before hydration, when the store has not been read", () => {
    // The server has no way to know, so it renders the graph statement and
    // hydration removes it. A removal is not a wrong number.
    expect(
      readoutFor("algorithmic-frontiers", {
        hydrated: false,
        directPrerequisitesComplete: true,
      })
    ).toMatchObject({ voice: "graph" });
  });
});

describe("the threshold", () => {
  it("sits in the empty band between the foundational tracks and the advanced ones", () => {
    const depths = COURSES.map((course) => chainLessonCount(UPSTREAM_OF(course.slug))).sort(
      (a, b) => a - b
    );
    const below = depths.filter((depth) => depth < DISTANT_UPSTREAM_LESSONS);
    const above = depths.filter((depth) => depth >= DISTANT_UPSTREAM_LESSONS);
    expect(below.length).toBeGreaterThan(0);
    expect(above.length).toBeGreaterThan(0);
    // A real gap, not a cut through a cluster: no course sits within five
    // lessons of the line on either side of it. If a curriculum edit closes
    // this gap, the number needs re-deciding rather than silently splitting
    // near-identical courses.
    expect(DISTANT_UPSTREAM_LESSONS - below[below.length - 1]).toBeGreaterThanOrEqual(2);
    expect(above[0] - DISTANT_UPSTREAM_LESSONS).toBeGreaterThanOrEqual(5);
  });

  it("is silent on both entry lessons and on the mid-curriculum", () => {
    for (const slug of [
      "quantum-computing/qubits-and-quantum-states/what-is-a-qubit",
      "quantum-mechanics/mathematical-foundations/complex-numbers-for-physics",
      "quantum-computing/quantum-algorithms-ii/qaoa-and-combinatorial-optimization",
      "quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction",
      "quantum-hardware/physical-qubit-platforms/neutral-atoms",
    ]) {
      const lesson = LESSON_METAS.find((entry) => entry.slug === slug);
      expect(lesson, slug).toBeDefined();
      expect(readoutFor(lesson!.course), slug).toBeNull();
      expect(readoutFor(lesson!.course, { hydrated: false }), slug).toBeNull();
    }
  });

  it("fires on every Apex and every Mastery lesson at a standing start", () => {
    const advanced = LESSON_METAS.filter((lesson) => {
      const course = getCourse(lesson.course);
      return course?.pillar === "apex" || course?.pillar === "quantum-mastery";
    });
    expect(advanced.length).toBe(59);
    for (const lesson of advanced) {
      expect(readoutFor(lesson.course), lesson.slug).not.toBeNull();
    }
  });

  it("stays a minority of the corpus", () => {
    const firing = LESSON_METAS.filter((lesson) => readoutFor(lesson.course) !== null);
    expect(firing.length).toBe(72);
    expect(firing.length).toBeLessThan(LESSON_METAS.length / 2);
  });
});

describe("the sentence a reader actually gets", () => {
  const chain = UPSTREAM_OF("algorithmic-frontiers");

  function prose(options?: Parameters<typeof readoutFor>[1]) {
    const readout = readoutFor("algorithmic-frontiers", options);
    expect(readout).not.toBeNull();
    const startHere = chain[readout!.startHereIndex];
    return renderToStaticMarkup(
      createElement(UpstreamDistanceLine, { readout: readout!, startHere })
    )
      .replace(/<[^>]+>/g, "")
      .replace(/&#x27;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
  }

  it("says only what the graph says before hydration", () => {
    expect(prose({ hydrated: false })).toBe(
      "The prerequisite graph puts 110 lessons across 13 courses before this one. " +
        "The first is Qubits & Quantum States, in Computing. " +
        "Read on regardless if you have this background from elsewhere. None of it is locked."
    );
  });

  it("names the standing start once the store is known to be empty", () => {
    expect(prose()).toBe(
      "No completed lessons are recorded in this browser, so this reads as a standing start. " +
        "The prerequisite graph puts 110 lessons across 13 courses before this one. " +
        "The first is Qubits & Quantum States, in Computing. " +
        "Read on regardless if you have this background from elsewhere. None of it is locked."
    );
  });

  it("counts down, and re-points, for a reader partway in", () => {
    const completed = new Set(chain[0].lessonSlugs);
    expect(prose({ completed })).toBe(
      "The prerequisite graph puts 110 lessons across 13 courses before this one, " +
        "and 100 of them are still unread. " +
        "The earliest one still open is Quantum Gates & Circuits, in Computing. " +
        "Read on regardless if you have this background from elsewhere. None of it is locked."
    );
  });

  it("never scolds, never gates, and always offers a link out", () => {
    for (const options of [{ hydrated: false }, {}, { completed: new Set(chain[0].lessonSlugs) }]) {
      const readout = readoutFor("algorithmic-frontiers", options);
      const markup = renderToStaticMarkup(
        createElement(UpstreamDistanceLine, {
          readout: readout!,
          startHere: chain[readout!.startHereIndex],
        })
      );
      expect(markup).toContain("None of it is locked.");
      expect(markup).toContain("Read on regardless");
      expect(markup).toContain('href="/courses/');
      // No em dashes anywhere in reader-facing copy on this site.
      expect(markup).not.toContain("—");
      for (const scold of ["should", "must", "need to", "not ready", "too early", "go back"]) {
        expect(markup.toLowerCase()).not.toContain(scold);
      }
    }
  });
});

describe("a lesson with no listed prerequisites", () => {
  it("is only ever called a starting point when the graph agrees", () => {
    // `PrerequisiteReadout` prints "you have not skipped anything" only when
    // the transitive chain is empty too, not merely when the chip row is. Both
    // of today's zero-prerequisite lessons are genuine on-ramps; this pins that
    // so a future one that isn't cannot inherit the claim.
    const onRamps = LESSON_METAS.filter((lesson) => lesson.prerequisites.length === 0);
    expect(onRamps.length).toBeGreaterThan(0);
    for (const lesson of onRamps) {
      expect(chainLessonCount(UPSTREAM_OF(lesson.course)), lesson.slug).toBe(0);
    }
  });
});
