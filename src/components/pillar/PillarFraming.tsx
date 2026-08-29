import type { ReactNode } from "react";
import Link from "next/link";
import { PILLARS, getCourse } from "@/lib/content/curriculum";
import { DIFFICULTY_LABEL } from "@/lib/content/types";
import type { Course, Difficulty, LessonMetaWithSlug, Pillar } from "@/lib/content/types";
import { PILLAR_ORDER, PILLAR_VISUALS } from "@/lib/design/pillars";
import { DIFFICULTY_HINT } from "@/components/curriculum/DifficultyMark";
import { getCourseHref } from "@/components/curriculum/courseHref";
import { Panel } from "@/components/ui/Panel";
import { SectionTitle, TechLabel } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

/**
 * ============================================================
 * The four pillar pages' shared framing
 * ============================================================
 * `/mechanics`, `/computing`, `/hardware` and `/software` deliberately do
 * *not* share a layout — each has its own composition language (a reading
 * column, an asymmetric split, a device schematic, a flow strip) and its own
 * tint, field regime and figures. What they must share is the *questions they
 * answer, in the same order*:
 *
 *   eyebrow → what this pillar is, in one plain sentence → what it assumes
 *   and how deep it goes → honest readouts → what you can do after it →
 *   real lesson titles you can start from → the course list → where it leads
 *
 * Those pieces live here so the answers cannot drift apart page to page, and
 * so the ones that *can* be derived from real curriculum data are derived
 * rather than hand-written into four separate files where they would go
 * stale the moment a course moves.
 *
 * Nothing here sets a color: everything reads the `pillar-*` ramp, which
 * `PillarScope` has already switched on the wrapper. Dropping one of these
 * into a page therefore inherits that page's identity instead of flattening
 * it.
 */

const DIFFICULTY_ORDER: Difficulty[] = ["foundational", "intermediate", "advanced", "master"];

export type PillarFacts = {
  /** Courses in this pillar, in curriculum order. */
  courses: Course[];
  /** Lessons actually written for those courses. */
  lessonCount: number;
  /** Modules declared across those courses — `lessonCount` of these are written. */
  moduleCount: number;
  totalHours: number;
  /**
   * Prerequisite courses that live *outside* this pillar — i.e. the real
   * background this pillar assumes, taken from `Course.prerequisites` rather
   * than from a hand-written claim.
   */
  entryCourses: Course[];
  lowest: Difficulty;
  highest: Difficulty;
  firstCourse: Course | undefined;
  /** First authored lesson of `firstCourse`, in curriculum order. */
  firstLesson: LessonMetaWithSlug | undefined;
  /** Authored lesson count for `firstCourse` alone — what the hero CTA quotes. */
  firstCourseLessonCount: number;
};

/** First authored lesson of a course, walking its modules in curriculum order. */
function firstAuthoredLesson(
  course: Course,
  lessons: LessonMetaWithSlug[]
): LessonMetaWithSlug | undefined {
  const byModule = new Map(
    lessons.filter((lesson) => lesson.course === course.slug).map((lesson) => [lesson.module, lesson])
  );
  // Named `courseModule`, not `module`: `@next/next/no-assign-module-variable`
  // rejects binding the identifier `module` because it shadows the CommonJS
  // `module` object in any file that ends up in a CJS interop context.
  for (const courseModule of course.modules) {
    const lesson = byModule.get(courseModule.slug);
    if (lesson) return lesson;
  }
  return undefined;
}

/**
 * Everything the four pages quote about themselves, computed once from the
 * real curriculum + lesson registry. Called at the top of each page so a
 * figure can never be quoted from memory.
 */
export function pillarFacts(courses: Course[], lessons: LessonMetaWithSlug[]): PillarFacts {
  const slugs = new Set(courses.map((course) => course.slug));
  const pillarLessons = lessons.filter((lesson) => slugs.has(lesson.course));

  const entrySlugs: string[] = [];
  for (const course of courses) {
    for (const prerequisite of course.prerequisites) {
      if (!slugs.has(prerequisite) && !entrySlugs.includes(prerequisite)) entrySlugs.push(prerequisite);
    }
  }
  const entryCourses = entrySlugs
    .map((slug) => getCourse(slug))
    .filter((course): course is Course => Boolean(course));

  const levels = courses.map((course) => DIFFICULTY_ORDER.indexOf(course.difficulty));
  const firstCourse = courses[0];

  return {
    courses,
    lessonCount: pillarLessons.length,
    moduleCount: courses.reduce((sum, course) => sum + course.modules.length, 0),
    totalHours: courses.reduce((sum, course) => sum + course.estimatedHours, 0),
    entryCourses,
    lowest: DIFFICULTY_ORDER[levels.length > 0 ? Math.min(...levels) : 0],
    highest: DIFFICULTY_ORDER[levels.length > 0 ? Math.max(...levels) : 0],
    firstCourse,
    firstLesson: firstCourse ? firstAuthoredLesson(firstCourse, lessons) : undefined,
    firstCourseLessonCount: firstCourse
      ? lessons.filter((lesson) => lesson.course === firstCourse.slug).length
      : 0,
  };
}

/**
 * The three readouts every pillar page carries, in the same order with the
 * same labels: how many courses, how many lessons are actually written (with
 * the declared total as the unit when the pillar isn't finished — an
 * unqualified "58 lessons" for a partly-authored pillar would be a claim, not
 * a readout), and how many hours the curriculum estimates.
 *
 * Pillar-specific readouts (Hardware's cooling stages, Software's
 * state-vector wall) sit in their own separate `Readouts` on those pages —
 * they're part of each pillar's identity and deliberately don't get folded
 * into this shared row.
 */
export function pillarReadoutItems(facts: PillarFacts) {
  return [
    { label: "Courses", value: facts.courses.length },
    {
      label: "Lessons",
      value: facts.lessonCount,
      unit: facts.lessonCount === facts.moduleCount ? undefined : `of ${facts.moduleCount}`,
    },
    { label: "Curriculum hours", value: facts.totalHours },
  ];
}

/**
 * "Is this pillar for me?" — the block a beginner reads to find out whether
 * they're in the right place, and an advanced reader reads to find out
 * whether it's worth their time.
 *
 * Both answers come from real data. *Assumes* is `Course.prerequisites`
 * resolved to whole courses and filtered to the ones outside this pillar, so
 * it names (and links) exactly the background the curriculum itself requires
 * — and says so plainly when there is none. *Depth* is the real difficulty
 * range across the pillar's courses, on the same four-level ladder
 * `DifficultyMark` draws everywhere else. Only *After it* is authored prose,
 * because "what you can do at the end" is not something any field in the
 * registry knows.
 */
export function PillarBriefing({
  facts,
  outcome,
  className,
}: {
  facts: PillarFacts;
  /** One plain sentence: what a reader can actually do once they finish. */
  outcome: ReactNode;
  className?: string;
}) {
  const { entryCourses, firstCourse, lowest, highest } = facts;
  const depth =
    lowest === highest
      ? DIFFICULTY_LABEL[lowest]
      : `${DIFFICULTY_LABEL[lowest]} → ${DIFFICULTY_LABEL[highest]}`;

  return (
    <div className={cn("border-l-2 border-pillar-edge pl-5", className)}>
      <TechLabel className="text-pillar-text">Is this track for you?</TechLabel>
      <dl className="mt-3 space-y-3 text-sm leading-relaxed">
        <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
          <dt className="shrink-0 font-tech text-[0.65rem] uppercase tracking-[0.12em] text-subtle-foreground sm:w-24 sm:pt-1">
            Assumes
          </dt>
          <dd className="text-muted-foreground">
            {entryCourses.length > 0 ? (
              <>
                {entryCourses.length === 1 ? "One earlier course: " : "Earlier courses: "}
                {entryCourses.map((course, index) => (
                  <span key={course.slug}>
                    {index > 0 ? (index === entryCourses.length - 1 ? " and " : ", ") : null}
                    <Link
                      href={getCourseHref(course.slug)}
                      className="text-foreground underline decoration-border-strong underline-offset-2 transition-colors hover:text-pillar-text hover:decoration-pillar-edge focus-visible:text-pillar-text"
                    >
                      {course.title}
                    </Link>
                    <span className="text-subtle-foreground">
                      {" "}
                      (in{" "}
                      <Link
                        href={PILLAR_VISUALS[course.pillar].route}
                        className="underline decoration-border underline-offset-2 transition-colors hover:text-pillar-text"
                      >
                        {PILLAR_VISUALS[course.pillar].short}
                      </Link>
                      )
                    </span>
                  </span>
                ))}
                . Nothing beyond that — everything else this track needs is built here.
              </>
            ) : (
              <>
                Nothing earlier in the curriculum. This is where it starts
                {firstCourse ? (
                  <>
                    : {firstCourse.title} is rated {DIFFICULTY_LABEL[firstCourse.difficulty]} —{" "}
                    {DIFFICULTY_HINT[firstCourse.difficulty].toLowerCase()}
                  </>
                ) : null}
                .
              </>
            )}
          </dd>
        </div>

        <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
          <dt className="shrink-0 font-tech text-[0.65rem] uppercase tracking-[0.12em] text-subtle-foreground sm:w-24 sm:pt-1">
            Depth
          </dt>
          <dd className="text-muted-foreground">
            {depth}.{" "}
            {lowest === highest
              ? DIFFICULTY_HINT[highest]
              : `Ends at ${DIFFICULTY_HINT[highest].toLowerCase()}`}
            .
          </dd>
        </div>

        <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
          <dt className="shrink-0 font-tech text-[0.65rem] uppercase tracking-[0.12em] text-subtle-foreground sm:w-24 sm:pt-1">
            After it
          </dt>
          <dd className="text-muted-foreground">{outcome}</dd>
        </div>
      </dl>
    </div>
  );
}

/**
 * "Start anywhere in this track" — real, clickable lesson titles, one per
 * course, placed above the course list rather than inside it.
 *
 * This deliberately does not restate `CourseList`: that component is the
 * complete manifest (every module of every course, written or not) and it
 * sits far enough down the page that a first-time visitor can scroll past
 * the hero without ever seeing a lesson title. This is the opposite object —
 * one real entry point per course, high on the page, so "what does a lesson
 * here actually look like" is answered before any commitment. A course with
 * nothing authored yet is simply absent; it is not shown as a dead row.
 */
export function PillarLessonStrip({
  courses,
  lessons,
  headingId,
  className,
}: {
  courses: Course[];
  lessons: LessonMetaWithSlug[];
  /** Id for the heading, so the wrapping `<Section>` can `aria-labelledby` it. */
  headingId: string;
  className?: string;
}) {
  const rows = courses
    .map((course, index) => {
      const lesson = firstAuthoredLesson(course, lessons);
      return lesson ? { course, lesson, index } : null;
    })
    .filter((row): row is { course: Course; lesson: LessonMetaWithSlug; index: number } => row !== null);

  if (rows.length === 0) return null;

  return (
    <div className={className}>
      <SectionTitle level={2} size="sm" id={headingId}>
        Start anywhere in this track
      </SectionTitle>
      <p className="mt-2 max-w-[42rem] text-sm leading-relaxed text-muted-foreground">
        The opening lesson of each course, in curriculum order. The full manifest — every lesson of
        every course — is the list further down.
      </p>
      <ol className="mt-5 grid gap-2 sm:grid-cols-2">
        {rows.map(({ course, lesson, index }) => (
          <li key={lesson.slug}>
            <Link
              href={`/lessons/${lesson.slug}`}
              className="group flex min-h-11 items-center justify-between gap-3 rounded-(--radius-tight) border border-border bg-surface-muted/40 px-3 py-2 transition-colors duration-(--dur-fast) ease-mech hover:border-pillar-edge hover:bg-surface-muted focus-visible:border-pillar-edge focus-visible:bg-surface-muted"
            >
              <span className="min-w-0">
                <span className="block truncate font-tech text-[0.65rem] uppercase tracking-[0.1em] text-subtle-foreground">
                  {String(index + 1).padStart(2, "0")} · {course.title}
                </span>
                <span className="block truncate text-sm text-foreground group-hover:text-pillar-text">
                  {lesson.title}
                </span>
              </span>
              <span className="shrink-0 font-tech text-[0.65rem] text-subtle-foreground">
                {lesson.estimatedMinutes} min
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * "Where this leads" — the pillar immediately before and after this one in
 * `PILLAR_ORDER`, so a pillar page is never a dead end and a reader who has
 * landed in the wrong one can see, by name, which way to go.
 *
 * Each panel is a whole-panel click target via the stretched-`::after`
 * technique `CourseList` documents at length: the title is the real `<a>` (so
 * the accessible name is just the pillar's name, not the paragraph under it),
 * `.panel` is already `position: relative`, and the description is raised
 * with `relative z-10` so it stays selectable text rather than becoming part
 * of the click surface.
 */
export function PillarNext({
  pillar,
  headingId,
  className,
}: {
  pillar: Pillar;
  headingId: string;
  className?: string;
}) {
  const index = PILLAR_ORDER.indexOf(pillar);
  const neighbours = (
    [
      { label: "Comes before this", slug: PILLAR_ORDER[index - 1] },
      { label: "Leads to", slug: PILLAR_ORDER[index + 1] },
    ] as const
  ).filter((entry) => Boolean(entry.slug));

  return (
    <div className={className}>
      <SectionTitle level={2} size="sm" id={headingId}>
        Where this leads
      </SectionTitle>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {neighbours.map(({ label, slug }) => {
          const info = PILLARS.find((entry) => entry.slug === slug);
          if (!info) return null;
          return (
            <Panel key={slug} data-pillar={slug} className="isolate p-5">
              <TechLabel>{label}</TechLabel>
              <h3 className="mt-1.5 font-display text-lg font-semibold tracking-tight">
                <Link
                  href={PILLAR_VISUALS[slug].route}
                  className="text-foreground underline-offset-4 after:absolute after:inset-0 after:content-[''] hover:text-pillar-text hover:underline focus-visible:text-pillar-text"
                >
                  {info.title}
                </Link>
              </h3>
              <p className="relative z-10 mt-2 text-sm leading-relaxed text-muted-foreground">
                {info.description}
              </p>
            </Panel>
          );
        })}
      </div>
      <p className="mt-5 text-sm text-muted-foreground">
        Or see all six tracks side by side on the{" "}
        <Link
          href="/learn"
          className="text-pillar-text underline decoration-border-strong underline-offset-2 hover:decoration-pillar-edge"
        >
          curriculum overview
        </Link>
        .
      </p>
    </div>
  );
}
