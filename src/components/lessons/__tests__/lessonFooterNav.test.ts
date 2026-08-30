import { describe, expect, it } from "vitest";
/* Components are constructed with `createElement` rather than JSX, for the
   reason `src/components/mdx/__tests__/Term.test.ts` documents: vitest's
   `include` is `src/**\/*.test.ts`, and `.ts` files are not parsed for JSX. */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LessonFooterNav } from "@/components/lessons/LessonFooterNav";
import { nextCoursesAfter } from "@/components/lessons/LessonLayout";
import { getCourseHref } from "@/components/curriculum/courseHref";
import { COURSES, PILLARS, getCourse } from "@/lib/content/curriculum";
import { LESSON_METAS } from "@/lib/content/lessonMeta.generated";
import type { Course, LessonMetaWithSlug, PillarInfo } from "@/lib/content/types";

/**
 * ============================================================
 * "What do I do next" must never be answerable with "nothing"
 * ============================================================
 * The end of a lesson is the moment a reader has the most momentum and the
 * least patience for a dead end, and this component is the only thing on the
 * page that answers the question. Its own header states the invariant it is
 * built around: *there is always a forward target — the next lesson, else the
 * courses this one continues into, else the course page, else the pillar,
 * else the catalog.* Nothing enforced it, and it had already been broken once
 * in a way nobody could see from the markup:
 *
 *   The "course complete" panel's two closing rows, "Review this course" and
 *   "Browse more courses", were one `<Link>` under a ternary label pointing at
 *   one destination, `courseHref`. On a *terminal* course — the last course in
 *   its pillar, with nothing in `COURSES` listing it as a prerequisite, which
 *   is the single case where the reader has genuinely run out of curriculum —
 *   the row said "Browse more courses" and went to the page for the course
 *   they had just finished. The label promised the one thing the link could
 *   not do, and every terminal course in the corpus shipped it.
 *
 * These tests pin the invariant against the real curriculum rather than
 * against a fixture, because the interesting inputs are all real: the first
 * lesson of a course (no previous), the last lesson of a course that
 * something continues into, the last lesson of a *terminal* course, and a
 * lesson whose course does not resolve at all.
 */

const LESSONS = LESSON_METAS as LessonMetaWithSlug[];

/** Every `href` the footer renders, in document order. */
function hrefsFrom(markup: string): string[] {
  return [...markup.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
}

/**
 * Course titles in this curriculum contain ampersands ("Quantum Gates &
 * Circuits", "Entanglement, Mixed States & Bell Tests"), and
 * `renderToStaticMarkup` escapes them. Comparing a raw title against the
 * markup therefore fails on exactly the courses this file cares most about,
 * and it fails *silently correct* — the page is right, the assertion is
 * wrong — which is the worst way for a test to be red.
 */
function asRendered(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

type NavProps = Parameters<typeof LessonFooterNav>[0];

function render(props: NavProps): string {
  return renderToStaticMarkup(createElement(LessonFooterNav, props));
}

/**
 * Reproduces the four props `LessonLayout` derives per lesson. Kept in one
 * place so a test that means "the last lesson of a terminal course" says only
 * that, and so the derivation being exercised is the real one (`COURSES`,
 * `getCourse`, `getCourseHref`) rather than a hand-built stand-in.
 */
function propsForLesson(slug: string): NavProps {
  const lesson = LESSONS.find((l) => l.slug === slug);
  if (!lesson) throw new Error(`No such lesson: ${slug}`);
  const course = getCourse(lesson.course);
  const pillar: PillarInfo | undefined = course
    ? PILLARS.find((p) => p.slug === course.pillar)
    : undefined;

  const moduleIndex = (c: Course | undefined, moduleSlug: string) =>
    c?.modules.findIndex((m) => m.slug === moduleSlug) ?? -1;
  const ordered = LESSONS.filter((l) => l.course === course?.slug).sort(
    (a, b) => moduleIndex(course, a.module) - moduleIndex(course, b.module)
  );
  const pos = ordered.findIndex((l) => l.slug === slug);
  const isLast = pos >= 0 && pos === ordered.length - 1;
  const finishedCourse = isLast ? course : undefined;

  const firstLessonOf = (target: Course) => {
    const firstModule = target.modules[0];
    return firstModule
      ? LESSONS.find((l) => l.course === target.slug && l.module === firstModule.slug)
      : undefined;
  };

  return {
    prevLesson: pos > 0 ? ordered[pos - 1] : null,
    nextLesson: pos >= 0 && pos < ordered.length - 1 ? ordered[pos + 1] : null,
    finishedCourse,
    // The real derivation, imported rather than reimplemented: the whole
    // point of these tests is that the footer's suggestions are the ones the
    // page actually renders, co-prerequisite annotation included.
    nextCourseSuggestions: finishedCourse ? nextCoursesAfter(finishedCourse, LESSONS) : [],
    pillar,
    unlocks: LESSONS.filter(
      (l) => l.prerequisites.includes(slug) && l.course !== lesson.course
    ),
    course,
    courseHref: course ? getCourseHref(course.slug, firstLessonOf(course)?.slug) : undefined,
  };
}

/** The last lesson of every course, keyed by course slug. */
const LAST_LESSON_OF: Map<string, string> = (() => {
  const out = new Map<string, string>();
  for (const course of COURSES) {
    const idx = (moduleSlug: string) => course.modules.findIndex((m) => m.slug === moduleSlug);
    const ordered = LESSONS.filter((l) => l.course === course.slug).sort(
      (a, b) => idx(a.module) - idx(b.module)
    );
    const last = ordered[ordered.length - 1];
    if (last) out.set(course.slug, last.slug);
  }
  return out;
})();

/** Courses nothing else in `COURSES` lists as a prerequisite. */
const TERMINAL_COURSES = COURSES.filter(
  (course) => !COURSES.some((other) => other.prerequisites.includes(course.slug))
);

describe("LessonFooterNav always resolves", () => {
  it("guards the guard: the corpus supplies every case these tests need", () => {
    expect(LESSONS.length).toBeGreaterThan(200);
    expect(LAST_LESSON_OF.size).toBeGreaterThan(20);
    // If nothing were terminal the most important case below would pass
    // vacuously, and if everything were, the "continues into" case would.
    expect(TERMINAL_COURSES.length).toBeGreaterThan(0);
    expect(TERMINAL_COURSES.length).toBeLessThan(COURSES.length);
  });

  it("renders at least one real destination for every lesson in the corpus", () => {
    const dead: string[] = [];
    for (const lesson of LESSONS) {
      const hrefs = hrefsFrom(render(propsForLesson(lesson.slug)));
      const usable = hrefs.filter((h) => h && h !== "#" && h !== "undefined");
      if (usable.length === 0) dead.push(lesson.slug);
    }
    expect(dead).toEqual([]);
  });

  it("offers a forward destination, not just the previous lesson, for every lesson", () => {
    const backOnly: string[] = [];
    for (const lesson of LESSONS) {
      const props = propsForLesson(lesson.slug);
      const hrefs = hrefsFrom(render(props));
      const backwards = props.prevLesson ? `/lessons/${props.prevLesson.slug}` : null;
      const forward = hrefs.filter((h) => h && h !== backwards);
      if (forward.length === 0) backOnly.push(lesson.slug);
    }
    expect(backOnly).toEqual([]);
  });

  it("never links a lesson back to itself", () => {
    const selfLinks: string[] = [];
    for (const lesson of LESSONS) {
      const hrefs = hrefsFrom(render(propsForLesson(lesson.slug)));
      if (hrefs.includes(`/lessons/${lesson.slug}`)) selfLinks.push(lesson.slug);
    }
    expect(selfLinks).toEqual([]);
  });

  it("gives the last lesson of a terminal course a way out of that course", () => {
    // The regression this file exists for. On a terminal course there is no
    // "continues into" list, so the only rows are the closing ones — and at
    // least one of them has to lead somewhere that is not the course page the
    // reader has just finished.
    const stuck: string[] = [];
    for (const course of TERMINAL_COURSES) {
      const slug = LAST_LESSON_OF.get(course.slug);
      if (!slug) continue;
      const markup = render(propsForLesson(slug));
      const ownCoursePage = `/courses/${course.slug}`;
      const away = hrefsFrom(markup).filter((h) => h && h !== ownCoursePage);
      if (away.length === 0) stuck.push(course.slug);
    }
    expect(stuck).toEqual([]);
  });

  it("always keeps the review link on a finished course", () => {
    for (const course of COURSES) {
      const slug = LAST_LESSON_OF.get(course.slug);
      if (!slug) continue;
      expect(render(propsForLesson(slug))).toContain("Review this course");
    }
  });

  it("offers the next course, with its link, on a non-terminal course", () => {
    const continued = COURSES.filter((course) =>
      COURSES.some((other) => other.prerequisites.includes(course.slug))
    );
    expect(continued.length).toBeGreaterThan(0);
    for (const course of continued) {
      const slug = LAST_LESSON_OF.get(course.slug);
      if (!slug) continue;
      const props = propsForLesson(slug);
      if (props.nextCourseSuggestions.length === 0) continue; // no authored first lesson
      const markup = render(props);
      expect(markup).toContain("Continues into");
      for (const suggestion of props.nextCourseSuggestions) {
        expect(markup).toContain(`href="/lessons/${suggestion.lesson.slug}"`);
      }
    }
  });
});

/**
 * ============================================================
 * A forward link the reader can actually follow
 * ============================================================
 * The footer used to compute its suggestions as the bare reverse edge,
 * `COURSES.filter(c => c.prerequisites.includes(finished))`, with no check
 * that finishing this course was *enough* to start them. 24 forward edges in
 * the graph point at a course with a second, unmet prerequisite: the
 * confirmed case is the end of Wave Mechanics, whose footer offered "Start
 * Operators, Observables & Measurement", a course that also requires Quantum
 * Gates & Circuits from a different track. A reader who did what the footer
 * said landed on a page telling them they were not ready.
 *
 * `/courses/[slug]` was fixed the same way in this sprint and is pinned by
 * `components/curriculum/__tests__/curriculumProgression.test.ts`. These
 * cover the lesson footer, the other surface that answers the same question,
 * so the two cannot drift apart.
 */
describe("LessonFooterNav never offers a course the reader cannot start", () => {
  /** Transitive prerequisite closure, the course included. */
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

  it("guards the guard: the graph really does contain blocked forward edges", () => {
    const blocked = COURSES.flatMap((course) => {
      const behind = readBy(course.slug);
      return COURSES.filter(
        (candidate) =>
          candidate.prerequisites.includes(course.slug) &&
          candidate.prerequisites.some((slug) => !behind.has(slug))
      ).map((candidate) => `${course.slug} -> ${candidate.slug}`);
    });
    // If this ever reaches zero the annotation below is untested, not fixed.
    expect(blocked.length).toBeGreaterThan(0);
  });

  it("annotates every blocked suggestion with the specific courses still missing", () => {
    const unannotated: string[] = [];
    for (const course of COURSES) {
      const slug = LAST_LESSON_OF.get(course.slug);
      if (!slug) continue;
      const props = propsForLesson(slug);
      const markup = render(props);
      for (const suggestion of props.nextCourseSuggestions) {
        if (suggestion.alsoNeeds.length === 0) continue;
        const clause = asRendered(
          `Also needs ${suggestion.alsoNeeds.map((c) => c.title).join(" and ")}`
        );
        if (!markup.includes(clause)) unannotated.push(`${course.slug} -> ${suggestion.course.slug}`);
      }
    }
    expect(unannotated).toEqual([]);
  });

  it("never claims a course is startable when it is not", () => {
    const lies: string[] = [];
    for (const course of COURSES) {
      const slug = LAST_LESSON_OF.get(course.slug);
      if (!slug) continue;
      const behind = readBy(course.slug);
      for (const suggestion of propsForLesson(slug).nextCourseSuggestions) {
        const reallyBlocked = suggestion.course.prerequisites.filter((p) => !behind.has(p));
        // `alsoNeeds` must be exactly the unmet set — not empty, not padded.
        const claimed = new Set(suggestion.alsoNeeds.map((c) => c.slug));
        if (
          claimed.size !== reallyBlocked.length ||
          reallyBlocked.some((p) => !claimed.has(p))
        ) {
          lies.push(`${course.slug} -> ${suggestion.course.slug}`);
        }
      }
    }
    expect(lies).toEqual([]);
  });

  it("puts a startable suggestion first when one exists", () => {
    for (const course of COURSES) {
      const slug = LAST_LESSON_OF.get(course.slug);
      if (!slug) continue;
      const suggestions = propsForLesson(slug).nextCourseSuggestions;
      if (!suggestions.some((s) => s.alsoNeeds.length === 0)) continue;
      expect(suggestions[0].alsoNeeds).toEqual([]);
    }
  });

  it("gives every finished course at least one destination it can actually open", () => {
    const stranded: string[] = [];
    for (const course of COURSES) {
      const slug = LAST_LESSON_OF.get(course.slug);
      if (!slug) continue;
      const props = propsForLesson(slug);
      const startable = props.nextCourseSuggestions.filter((s) => s.alsoNeeds.length === 0);
      const markup = render(props);
      const hasWayOut =
        startable.length > 0 ||
        markup.includes("More in ") ||
        markup.includes("Browse all courses");
      if (!hasWayOut) stranded.push(course.slug);
    }
    expect(stranded).toEqual([]);
  });

  it("the confirmed case: the end of Wave Mechanics no longer promises a blocked course", () => {
    const waveMechanics = COURSES.find((c) => c.slug === "wave-mechanics");
    expect(waveMechanics, "wave-mechanics is the reported case; if it was renamed, retarget this test").toBeDefined();
    const slug = LAST_LESSON_OF.get(waveMechanics!.slug);
    expect(slug).toBeDefined();
    const props = propsForLesson(slug!);
    const markup = render(props);
    const behind = readBy(waveMechanics!.slug);
    for (const suggestion of props.nextCourseSuggestions) {
      const unmet = suggestion.course.prerequisites.filter((p) => !behind.has(p));
      if (unmet.length === 0) continue;
      // Offered, but honestly: the bare "Start X" with nothing after it is
      // exactly what stranded the reader.
      expect(markup).toContain(
        asRendered(`Also needs ${suggestion.alsoNeeds.map((c) => c.title).join(" and ")}`)
      );
    }
    // And there is somewhere real to go either way.
    const startable = props.nextCourseSuggestions.filter((s) => s.alsoNeeds.length === 0);
    expect(
      startable.length > 0 || markup.includes("More in ") || markup.includes("Browse all courses")
    ).toBe(true);
  });

  describe("degenerate shapes the corpus does not currently contain", () => {
    const base: NavProps = {
      prevLesson: null,
      nextLesson: null,
      finishedCourse: undefined,
      nextCourseSuggestions: [],
      pillar: undefined,
      unlocks: [],
      course: undefined,
      courseHref: undefined,
    };

    it("falls all the way back to the catalog with no course and no pillar", () => {
      const markup = render(base);
      expect(hrefsFrom(markup)).toContain("/learn");
      expect(markup).toContain("All courses");
    });

    it("prefers the pillar over the catalog when only a pillar resolves", () => {
      const pillar = PILLARS[0];
      const markup = render({ ...base, pillar });
      expect(hrefsFrom(markup)).toContain(`/learn#${pillar.slug}`);
      expect(markup).toContain(asRendered(pillar.title));
    });

    it("shows a finished course with no suggestions both a review and an exit", () => {
      const course = COURSES[0];
      const pillar = PILLARS.find((p) => p.slug === course.pillar);
      const markup = render({
        ...base,
        finishedCourse: course,
        course,
        pillar,
        courseHref: getCourseHref(course.slug),
      });
      const hrefs = hrefsFrom(markup);
      expect(hrefs).toContain(`/courses/${course.slug}`);
      expect(hrefs.some((h) => h !== `/courses/${course.slug}`)).toBe(true);
    });

    it("renders no empty closing rule when a finished course resolves no href at all", () => {
      const course = COURSES[0];
      const markup = render({
        ...base,
        finishedCourse: course,
        course,
        // Deliberately impossible today (`getCourseHref` always returns a
        // string), but the prop is optional, so the component must not draw a
        // bordered container with nothing inside it.
        courseHref: undefined,
        nextCourseSuggestions: [],
      });
      // With no courseHref there is still the pillar-less catalog exit.
      expect(hrefsFrom(markup)).toContain("/learn");
    });
  });
});
