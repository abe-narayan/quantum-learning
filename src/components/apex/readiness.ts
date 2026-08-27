import { getCourseHref } from "@/components/curriculum/courseHref";
import { getCourse } from "@/lib/content/curriculum";
import { PILLAR_VISUALS } from "@/lib/design/pillars";
import type { Course, LessonMetaWithSlug } from "@/lib/content/types";

/**
 * ============================================================
 * "Am I ready for this?" — computed, not asserted
 * ============================================================
 * Server-side only (it reads the curriculum registry). `ReadinessReadout`
 * in this same directory is the paired client leaf that turns the shapes
 * below into a rendered readout against the visitor's stored progress; per
 * docs/DESIGN_SYSTEM.md §10 the graph walk stays here so no content registry
 * is ever pulled into the client bundle.
 *
 * Both `/apex` and `/mastery` consume this. It lives under `components/apex/`
 * because `/apex` is where the two-audience problem is sharpest and where the
 * readout debuted; `/mastery` imports the same functions rather than growing
 * a second, drifting copy of the same traversal.
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
   * course exists in the curriculum but has no lessons written yet — such a
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

/** The first authored lesson for a course, in module order — the fallback
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
 * within-pillar prerequisites aren't assumed background — they're the
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
 * Post-order DFS with a three-state visit map, so a cycle in the data — not
 * present today, but nothing in `curriculum.ts` structurally prevents one —
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
