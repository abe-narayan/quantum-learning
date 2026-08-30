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
 * *not* share a layout, each has its own composition language (a reading
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

/**
 * A course in this pillar that needs material from another one, with the
 * outside courses it needs and where it sits in this pillar's run.
 */
export type OutsideDependency = {
  /** The course in this pillar that reaches outside. */
  course: Course;
  /** Its prerequisites that live outside this pillar, resolved to courses. */
  prerequisites: Course[];
  /** 1-based position in this pillar's curriculum order. */
  position: number;
};

export type PillarFacts = {
  /** Courses in this pillar, in curriculum order. */
  courses: Course[];
  /** Lessons actually written for those courses. */
  lessonCount: number;
  /** Modules declared across those courses, `lessonCount` of these are written. */
  moduleCount: number;
  totalHours: number;
  /**
   * Out-of-pillar prerequisites of the track's *first* course: the background
   * a reader needs before they can open this track at all.
   *
   * This used to be the union of every out-of-pillar prerequisite anywhere in
   * the track, which is a different question and gave a wrong answer to this
   * one. On `/mechanics` the union named two Computing courses and the
   * briefing reported them as what the track "assumes", eight pixels under a
   * tier ladder saying school algebra is the whole entry bar. Mechanics' first
   * course requires nothing; those two Computing courses are needed by its
   * 4th and its 10th. Entry and "somewhere along the way" are now two fields,
   * because a reader deciding whether to click needs the first one.
   */
  entryCourses: Course[];
  /**
   * Every course *after* the first that draws on another track, so the
   * briefing can say where the outside material actually bites instead of
   * folding it into the entry bar.
   */
  laterDependencies: OutsideDependency[];
  lowest: Difficulty;
  highest: Difficulty;
  firstCourse: Course | undefined;
  /** First authored lesson of `firstCourse`, in curriculum order. */
  firstLesson: LessonMetaWithSlug | undefined;
  /** Authored lesson count for `firstCourse` alone, what the hero CTA quotes. */
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

  /** A course's prerequisites that live outside this pillar, resolved. */
  const outsidePrerequisites = (course: Course): Course[] =>
    course.prerequisites
      .filter((slug) => !slugs.has(slug))
      .map((slug) => getCourse(slug))
      .filter((prerequisite): prerequisite is Course => Boolean(prerequisite));

  const entryCourses = courses.length > 0 ? outsidePrerequisites(courses[0]) : [];
  const laterDependencies: OutsideDependency[] = [];
  courses.slice(1).forEach((course, index) => {
    const prerequisites = outsidePrerequisites(course);
    // `index + 2`: the slice dropped the first course, and positions are
    // 1-based, so the reader's "4th of 10" survives a course being inserted.
    if (prerequisites.length > 0) laterDependencies.push({ course, prerequisites, position: index + 2 });
  });

  const levels = courses.map((course) => DIFFICULTY_ORDER.indexOf(course.difficulty));
  const firstCourse = courses[0];

  return {
    courses,
    lessonCount: pillarLessons.length,
    moduleCount: courses.reduce((sum, course) => sum + course.modules.length, 0),
    totalHours: courses.reduce((sum, course) => sum + course.estimatedHours, 0),
    entryCourses,
    laterDependencies,
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
 * the declared total as the unit when the pillar isn't finished, an
 * unqualified "58 lessons" for a partly-authored pillar would be a claim, not
 * a readout), and how many hours the curriculum estimates.
 *
 * Pillar-specific readouts (Hardware's cooling stages, Software's
 * state-vector wall) sit in their own separate `Readouts` on those pages,
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

/** Small counts read as words in prose; anything larger stays a numeral. */
const COUNT_WORDS = ["", "One", "Two", "Three", "Four", "Five", "Six"];
function countWord(count: number): string {
  return COUNT_WORDS[count] ?? String(count);
}

/** "4th of 10" is how a reader locates a course in a track's run. */
function ordinal(position: number): string {
  const teens = position % 100;
  if (teens >= 11 && teens <= 13) return `${position}th`;
  return `${position}${["th", "st", "nd", "rd"][position % 10] ?? "th"}`;
}

const COURSE_LINK_CLASS =
  "text-foreground underline decoration-border-strong underline-offset-2 transition-colors hover:text-pillar-text hover:decoration-pillar-edge focus-visible:text-pillar-text";

/** A course by name, optionally tagged with the track it lives in. */
function CourseRef({ course, withTrack = false }: { course: Course; withTrack?: boolean }) {
  return (
    <>
      <Link href={getCourseHref(course.slug)} className={COURSE_LINK_CLASS}>
        {course.title}
      </Link>
      {withTrack ? (
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
      ) : null}
    </>
  );
}

/**
 * ", " between items and " and " before the last, as prose expects.
 *
 * `clause` forces the comma back in front of the final "and". It is not a
 * style preference: the later-dependency list joins whole clauses ("X (4th)
 * needs A"), and without the comma two of them run together as "X needs A and
 * Y needs B", where the reader's first parse is that X needs both A and Y.
 */
function separator(index: number, total: number, clause = false): string | null {
  if (index === 0) return null;
  return index === total - 1 ? (total > 2 || clause ? ", and " : " and ") : ", ";
}

/**
 * "Is this pillar for me?", the block a beginner reads to find out whether
 * they're in the right place, and an advanced reader reads to find out
 * whether it's worth their time.
 *
 * Both answers come from real data. *Assumes* is `Course.prerequisites`
 * resolved to whole courses and filtered to the ones outside this pillar, so
 * it names (and links) exactly the background the curriculum itself
 * requires, and says so plainly when there is none. *Depth* is the real difficulty
 * range across the pillar's courses, on the same four-level ladder
 * `DifficultyMark` draws everywhere else. Only *After it* is authored prose,
 * because "what you can do at the end" is not something any field in the
 * registry knows.
 *
 * *Assumes* answers two questions, and the split is the whole point: what you
 * need **to start** (`facts.entryCourses`, the first course's out-of-pillar
 * prerequisites) and what the track reaches for **later**
 * (`facts.laterDependencies`, named with the position it bites at). Reporting
 * the union of both as the entry bar is what made `/mechanics` tell a reader
 * "school algebra is the whole entry bar" and "Assumes: two Computing
 * courses" in adjacent blocks, when in fact its first course requires
 * nothing.
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
  const { courses, entryCourses, laterDependencies, firstCourse, lowest, highest } = facts;
  const depth =
    lowest === highest
      ? DIFFICULTY_LABEL[lowest]
      : `${DIFFICULTY_LABEL[lowest]} → ${DIFFICULTY_LABEL[highest]}`;

  return (
    <div className={cn("border-l-2 border-pillar-edge pl-5", className)}>
      <TechLabel className="text-pillar-text">Is this track for you?</TechLabel>
      <dl className="mt-3 space-y-3 text-sm leading-relaxed">
        <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
          <dt className="shrink-0 tech-label text-subtle-foreground sm:w-24 sm:pt-1">
            Assumes
          </dt>
          <dd className="text-muted-foreground">
            {entryCourses.length > 0 ? (
              <>
                {entryCourses.length === 1 ? "One earlier course: " : "Earlier courses: "}
                {entryCourses.map((course, index) => (
                  <span key={course.slug}>
                    {separator(index, entryCourses.length)}
                    <CourseRef course={course} withTrack />
                  </span>
                ))}
                .
              </>
            ) : (
              <>
                {/* "Nothing to start" rather than "Nothing earlier in the
                    curriculum" when the track *does* reach outside later: the
                    longer phrase is a claim about the whole track, and the
                    sentence that follows immediately contradicts it. Where
                    there is nothing later either (Computing), the original,
                    stronger wording still holds and is kept verbatim. */}
                {laterDependencies.length > 0
                  ? "Nothing to start"
                  : "Nothing earlier in the curriculum. This is where it starts"}
                {firstCourse ? (
                  <>
                    : {firstCourse.title} is rated {DIFFICULTY_LABEL[firstCourse.difficulty]},{" "}
                    {DIFFICULTY_HINT[firstCourse.difficulty].toLowerCase()}
                  </>
                ) : null}
                .
              </>
            )}
            {laterDependencies.length > 0 ? (
              <>
                {" "}
                {countWord(laterDependencies.length)} of the {courses.length} courses here{" "}
                {laterDependencies.length === 1 ? "reaches" : "reach"} outside the track later:{" "}
                {laterDependencies.map((dependency, index) => (
                  <span key={dependency.course.slug}>
                    {separator(index, laterDependencies.length, true)}
                    <CourseRef course={dependency.course} /> ({ordinal(dependency.position)}) needs{" "}
                    {dependency.prerequisites.map((prerequisite, prerequisiteIndex) => (
                      <span key={prerequisite.slug}>
                        {separator(prerequisiteIndex, dependency.prerequisites.length)}
                        <CourseRef course={prerequisite} withTrack />
                      </span>
                    ))}
                  </span>
                ))}
                . Nothing else here does, and the course list below repeats it on the courses that
                do.
              </>
            ) : entryCourses.length > 0 ? (
              <> Nothing beyond that: everything else this track needs is built here.</>
            ) : null}
          </dd>
        </div>

        <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
          <dt className="shrink-0 tech-label text-subtle-foreground sm:w-24 sm:pt-1">
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
          <dt className="shrink-0 tech-label text-subtle-foreground sm:w-24 sm:pt-1">
            After it
          </dt>
          <dd className="text-muted-foreground">{outcome}</dd>
        </div>
      </dl>
    </div>
  );
}

/**
 * "The opening lesson of each course", real, clickable lesson titles, one per
 * course, placed above the course list rather than inside it.
 *
 * The heading used to read "Start anywhere in this track", which said the one
 * thing this strip is not for. Its rows are the courses in curriculum order,
 * so on `/mechanics` row 10 is Advanced Topics in Quantum Mechanics; an
 * invitation to start there is an invitation to fail. The rows are the
 * opening lesson of each course, the heading now says so, and where to
 * actually start is the numbered first row plus the hero button above it.
 *
 * This deliberately does not restate `CourseList`: that component is the
 * complete manifest (every module of every course, written or not) and it
 * sits far enough down the page that a first-time visitor can scroll past
 * the hero without ever seeing a lesson title. This is the opposite object,
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
        The opening lesson of each course
      </SectionTitle>
      <p className="mt-2 max-w-lede text-sm leading-relaxed text-muted-foreground">
        In curriculum order, so row one is where the track begins and each row after it assumes the
        rows above. The full manifest, every lesson of every course, is the list further down.
      </p>
      <ol className="mt-5 grid gap-2 sm:grid-cols-2">
        {rows.map(({ course, lesson, index }) => (
          <li key={lesson.slug}>
            <Link
              href={`/lessons/${lesson.slug}`}
              className="group flex min-h-11 items-center justify-between gap-3 rounded-(--radius-tight) border border-border bg-surface-muted/40 px-3 py-2 transition-colors duration-(--dur-fast) ease-mech hover:border-pillar-edge hover:bg-surface-muted focus-visible:border-pillar-edge focus-visible:bg-surface-muted"
            >
              {/* Neither line truncates, and the arithmetic is why, at the
                  *widest* rendering this strip ever gets. `Section
                  width="reading"` at 1024px: `Container`'s `max-w-reading` is
                  736px, less `lg:px-8` (64px) leaves 672px; `grid gap-2
                  sm:grid-cols-2` gives (672 - 8)/2 = 332px a column; the
                  link's `px-3` and 1px borders leave 306px; the
                  `justify-between gap-3` (12px) and the `shrink-0` minutes
                  span ("30 min" at `text-micro`, 6px a character, 36px) leave
                  258px for this `min-w-0` column. `.tech-label` is 11px Geist
                  Mono at 0.14em tracking, so 8.14px a character: 31.7
                  characters. "01 · Mathematical Foundations for Quantum
                  Mechanics" is 51 (415px). At 320px the column is 214px, i.e.
                  26 characters. The second line (`text-sm`) gets 37 characters
                  wide and 30 narrow, against lesson titles of 40 to 50.
                  So there is no viewport at which `truncate` was showing the
                  whole string; it was deleting the course name this line
                  exists to carry, on every track page. Same defect, same
                  remedy, as `curriculum/PillarLessonStrip.tsx`, which
                  documents its own version of this measurement. Wrapping costs
                  a few pixels of row height and `min-h-11` had already
                  reserved most of it. */}
              <span className="min-w-0">
                <span className="block tech-label leading-snug text-subtle-foreground">
                  {String(index + 1).padStart(2, "0")} · {course.title}
                </span>
                <span className="block text-sm text-foreground group-hover:text-pillar-text">
                  {lesson.title}
                </span>
              </span>
              <span className="shrink-0 font-tech text-micro text-subtle-foreground">
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
 * "Where this leads", the pillar immediately before and after this one in
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
