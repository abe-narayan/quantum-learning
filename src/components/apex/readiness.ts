import { getCourseHref } from "@/components/curriculum/courseHref";
import { getCourse } from "@/lib/content/curriculum";
import { PILLAR_VISUALS } from "@/lib/design/pillars";
import type { Course, LessonMetaWithSlug } from "@/lib/content/types";

/**
 * ============================================================
 * "Am I ready for this?", computed, not asserted
 * ============================================================
 * Server-side only (it reads the curriculum registry). `ReadinessReadout`
 * in this same directory is the paired client leaf that turns the shapes
 * below into a rendered readout against the visitor's stored progress; per
 * docs/DESIGN_SYSTEM.md §10 the graph walk stays here so no content registry
 * is ever pulled into the client bundle.
 *
 * `/apex`, `/mastery` and every lesson page consume this. It lives under
 * `components/apex/` because `/apex` is where the two-audience problem is
 * sharpest and where the readout debuted; the other two import the same
 * functions rather than growing a second, drifting copy of the same traversal.
 *
 * That third consumer exists because the divergence it prevents already
 * happened. `/apex` walked this graph transitively and reported "18 courses
 * between a standing start and Apex"; the lesson page's own
 * `PrerequisiteReadout` counted `meta.prerequisites`, which is the *immediate*
 * edge list, and reported "0 / 1 complete" on a lesson with 110 lessons of
 * ancestry behind it. A reader who reached the lesson from search never saw
 * the honest figure, and the one they did see understated the gap by two
 * orders of magnitude. `lessonPrerequisiteChain` below is the same
 * `prerequisiteChain` walk rooted at a single course, so the two surfaces
 * cannot disagree: there is only one traversal.
 *
 * Nothing here hardcodes a course slug or a "path". Every edge comes from a
 * real `course.prerequisites` array in `src/lib/content/curriculum.ts`, and
 * every completion figure comes from lessons that are actually authored, so
 * a curriculum edit moves the readout automatically instead of leaving a
 * stale claim on screen.
 */

export type ReadinessCourse = {
  slug: string;
  title: string;
  /** Where this course's own page lives, via the single `getCourseHref` rule. */
  href: string;
  /** Short name of the pillar it belongs to, e.g. "Software". */
  pillarLabel: string;
  /**
   * The course's authored lesson slugs, in module order. Empty means the
   * course exists in the curriculum but has no lessons written yet, such a
   * course can never be "complete" and is deliberately excluded from every
   * count below rather than being reported as permanently unfinished.
   */
  lessonSlugs: string[];
};

/** A course's authored lesson slugs, in module order. */
export function authoredLessonSlugs(courseSlug: string, lessons: LessonMetaWithSlug[]): string[] {
  const course = getCourse(courseSlug);
  if (!course) return [];
  const lessonByModule = new Map(
    lessons.filter((lesson) => lesson.course === courseSlug).map((lesson) => [lesson.module, lesson])
  );
  return course.modules
    .map((courseModule) => lessonByModule.get(courseModule.slug)?.slug)
    .filter((slug): slug is string => Boolean(slug));
}

/** The first authored lesson for a course, in module order, the fallback
 *  destination `getCourseHref` uses if `/courses/<slug>` is ever gated again,
 *  so a link built from it never depends on that flag alone. */
export function firstAuthoredLessonSlug(
  courseSlug: string,
  lessons: LessonMetaWithSlug[]
): string | undefined {
  return authoredLessonSlugs(courseSlug, lessons)[0];
}

function toReadinessCourse(course: Course, lessons: LessonMetaWithSlug[]): ReadinessCourse {
  const lessonSlugs = authoredLessonSlugs(course.slug, lessons);
  return {
    slug: course.slug,
    title: course.title,
    href: getCourseHref(course.slug, lessonSlugs[0]),
    pillarLabel: PILLAR_VISUALS[course.pillar].short,
    lessonSlugs,
  };
}

/**
 * The courses a pillar *directly* assumes: every entry of its courses'
 * `prerequisites` arrays whose own course lives outside the pillar. The
 * within-pillar prerequisites aren't assumed background, they're the
 * pillar's own internal structure, surfaced by its course index instead.
 * De-duplicated by slug, since two courses can share a prerequisite.
 */
export function directPrerequisites(
  courses: Course[],
  lessons: LessonMetaWithSlug[]
): ReadinessCourse[] {
  const ownSlugs = new Set(courses.map((course) => course.slug));
  const seen = new Map<string, ReadinessCourse>();
  for (const course of courses) {
    for (const slug of course.prerequisites) {
      if (seen.has(slug) || ownSlugs.has(slug)) continue;
      const prerequisite = getCourse(slug);
      if (!prerequisite) continue;
      seen.set(slug, toReadinessCourse(prerequisite, lessons));
    }
  }
  return Array.from(seen.values());
}

/**
 * The full transitive prerequisite closure of a pillar, topologically
 * ordered so a course never appears before something it requires. The
 * pillar's own courses are traversed (an Apex capstone requiring four other
 * Apex courses still pulls their ancestors in) but excluded from the result,
 * which is the ancestry only.
 *
 * Post-order DFS with a three-state visit map, so a cycle in the data, not
 * present today, but nothing in `curriculum.ts` structurally prevents one,
 * terminates instead of blowing the stack.
 */
export function prerequisiteChain(
  courses: Course[],
  lessons: LessonMetaWithSlug[]
): ReadinessCourse[] {
  const ownSlugs = new Set(courses.map((course) => course.slug));
  const ordered: ReadinessCourse[] = [];
  const state = new Map<string, "visiting" | "done">();

  function visit(slug: string) {
    if (state.has(slug)) return;
    const course = getCourse(slug);
    if (!course) return;
    state.set(slug, "visiting");
    for (const prerequisite of course.prerequisites) visit(prerequisite);
    state.set(slug, "done");
    if (!ownSlugs.has(slug)) ordered.push(toReadinessCourse(course, lessons));
  }

  for (const course of courses) {
    for (const prerequisite of course.prerequisites) visit(prerequisite);
  }
  return ordered;
}

/**
 * The complement of `prerequisiteChain`: every course in the curriculum that a
 * pillar neither contains nor requires, in curriculum order.
 *
 * This exists because `/apex` is the one track page with no track after it, and
 * `PillarNext` (which keeps the other five off a dead end by naming the pillar
 * on either side) has nothing to offer at the end of `PILLAR_ORDER`. The honest
 * answer to "what now" at the summit is not "nothing" and not a generic
 * "explore more": nine of the thirty-two courses sit outside Apex's entire
 * prerequisite closure, so a reader who has finished every Apex course has
 * demonstrably not finished the curriculum, and the nine are nameable.
 *
 * Derived rather than listed, for the usual reason: an Apex course that later
 * declares a prerequisite in the deep Mechanics line removes it from this list
 * automatically instead of leaving a page recommending something the reader has
 * already read.
 */
export function coursesOutsideChain(
  courses: Course[],
  lessons: LessonMetaWithSlug[],
  allCourses: Course[]
): ReadinessCourse[] {
  const covered = new Set(courses.map((course) => course.slug));
  for (const entry of prerequisiteChain(courses, lessons)) covered.add(entry.slug);
  return allCourses
    .filter((course) => !covered.has(course.slug))
    .map((course) => toReadinessCourse(course, lessons));
}

/**
 * The same walk, rooted at the one course a lesson belongs to, filtered to
 * courses that actually have lessons written.
 *
 * Rooting at a single course rather than a whole pillar is the only
 * difference, and it is the right one: sibling courses inside the pillar are
 * no longer "the pillar's own internal structure" when the question is about
 * one lesson. An Apex capstone that requires four other Apex courses genuinely
 * does sit behind them, and this returns them, where the pillar-rooted call on
 * `/apex` correctly does not.
 *
 * Server-side only, like everything else here. Callers hand the result to
 * `PrerequisiteReadout` as a flat prop; nothing about this reaches a bundle.
 */
export function lessonPrerequisiteChain(
  courseSlug: string | undefined,
  lessons: LessonMetaWithSlug[]
): ReadinessCourse[] {
  const course = courseSlug ? getCourse(courseSlug) : undefined;
  if (!course) return [];
  return prerequisiteChain([course], lessons).filter((entry) => entry.lessonSlugs.length > 0);
}

/** Total authored lessons across a chain, the honest "how far is this" figure. */
export function chainLessonCount(chain: ReadinessCourse[]): number {
  return chain.reduce((total, course) => total + course.lessonSlugs.length, 0);
}

/**
 * ============================================================
 * When is a lesson far enough away that its chip row lies?
 * ============================================================
 * How many *unread* upstream lessons it takes before `PrerequisiteReadout`
 * stops trusting "0 / N complete" to describe the gap and prints the distance
 * paragraph instead.
 *
 * The number is not a round guess; it sits in a real gap in the data. Rank all
 * 32 courses by `chainLessonCount(lessonPrerequisiteChain(course))` and there
 * is a tight run from 0 up to 58 (Operators, Observables & Measurement, the
 * deepest course in a foundational track) and then nothing at all until 66.
 * Everything at or above that break is Apex, Quantum Mastery, the two deep
 * Software courses, and Advanced Quantum Mechanics, which is the one Mechanics
 * course `/mastery` itself names as a prerequisite. Everything below it is
 * Computing, Hardware, and the foundational half of Mechanics.
 *
 * So 60 is the line between "deep inside one track", where the breadcrumb, the
 * course page and the prerequisite chips already tell a reader where they are,
 * and "behind more than a whole track's worth of reading" (the entire Quantum
 * Computing route is 60 lessons), where they do not. It fires on 72 of the 219
 * lessons at a standing start: every Apex lesson and every Mastery lesson,
 * which is exactly the audience `/apex` and `/mastery` already rescue with the
 * same figures, plus the nine Software and four Mechanics lessons sitting at
 * the same depth. Firing on all 219 would be noise; firing only on Apex would
 * miss the Mastery reader in precisely the same position.
 *
 * Measured against unread lessons rather than total ones, so it decays as a
 * reader advances and goes quiet well before they arrive.
 *
 * It lives here, on the server side of the boundary, and reaches the client as
 * a prop rather than an import, for two reasons. A `"use client"` module's
 * exports become client-reference proxies when a Server Component imports
 * them, so a constant shared the other way round silently compares as an
 * object (that bug cost a debugging pass: `tsc` was happy, the page rendered,
 * minus the entire feature). And a new client-reachable `.ts` module, however
 * small, spends headroom in `CLIENT_DATA_TOTAL_CEILING_KB` that belongs to
 * data which actually scales with the corpus.
 */
export const DISTANT_UPSTREAM_LESSONS = 60;
