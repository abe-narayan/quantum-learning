import type { ReactNode } from "react";
import Link from "next/link";
import { COURSES, getCourse } from "@/lib/content/curriculum";
import { PILLAR_VISUALS } from "@/lib/design/pillars";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { CourseProgressBadge } from "@/components/curriculum/CourseProgressBadge";
import { getCourseHref } from "@/components/curriculum/courseHref";
import { cn } from "@/lib/utils";
import type { Course, LessonMetaWithSlug, Pillar } from "@/lib/content/types";

/**
 * ============================================================
 * A track drawn as the pipeline it teaches
 * ============================================================
 * `/software`'s subject is a pipeline: source becomes a circuit, the circuit
 * is transpiled onto a real device's connectivity, the compiled sequence is
 * run, and the bitstrings that come back are post-processed. A stack of
 * course cards renders that as three unrelated objects. This renders it as
 * three stages of one line, which is what the courses actually are.
 *
 * The shape earns its place only if it is true, so every edge in it is read
 * out of the curriculum registry rather than asserted:
 *
 *   Requires   `Course.prerequisites`, resolved to whole courses. The one
 *              inside this track is the stage upstream, and the spine
 *              between the two rows *is* that edge. The ones outside it are
 *              feed lines from another track, and they are named with the
 *              track they come from, because "you need a Computing course
 *              before stage 01" is the single most useful thing this block
 *              can tell a reader who has landed here first.
 *   Lessons    `Course.modules`, in curriculum order, joined against the
 *              lessons actually authored. A module with no lesson yet is
 *              shown as unwritten rather than quietly dropped, so the
 *              stage's length is the real one.
 *   Feeds      the reverse edge: every course anywhere in the curriculum
 *              that lists this one as a prerequisite, less the next stage
 *              down, which the spine already draws. This is the half a
 *              course list has never shown, and on this track it is the
 *              interesting half: the last stage feeds two courses in higher
 *              tiers, which is the only on-page evidence that a Core track
 *              is load-bearing for Mastery and Apex.
 *
 * Nothing here is a card grid, and deliberately: a grid of three would say
 * the stages are alternatives. They are a sequence, so they are one column
 * on a shared spine, and the spine is the dependency edge.
 *
 * It sets no colour of its own; the spine and stage nodes read the `pillar-*`
 * ramp `PillarScope` has already switched on the page wrapper.
 */

/** Rows of the `<dl>` inside a stage, in pipeline order. */
type StageRowProps = {
  label: string;
  children: ReactNode;
};

function StageRow({ label, children }: StageRowProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
      <dt className="shrink-0 font-tech text-meta uppercase tracking-meta text-subtle-foreground sm:w-20 sm:pt-1">
        {label}
      </dt>
      {/* `min-w-0`: this cell holds module titles and course names long
          enough to set a min-content width wider than the 236px a 320px
          viewport leaves it once the spine and its gap are taken out. */}
      <dd className="min-w-0 flex-1">{children}</dd>
    </div>
  );
}

/** A course named with its track, when that track is not the one being drawn. */
function CourseRef({ course, pillar }: { course: Course; pillar: Pillar }) {
  return (
    <>
      <Link
        href={getCourseHref(course.slug)}
        className="text-foreground underline decoration-border-strong underline-offset-2 transition-colors hover:text-pillar-text hover:decoration-pillar-edge focus-visible:text-pillar-text"
      >
        {course.title}
      </Link>
      {course.pillar === pillar ? null : (
        <span className="text-subtle-foreground"> ({PILLAR_VISUALS[course.pillar].short})</span>
      )}
    </>
  );
}

function CourseRefList({ courses, pillar }: { courses: Course[]; pillar: Pillar }) {
  return (
    <>
      {courses.map((course, index) => (
        <span key={course.slug}>
          {index > 0 ? (index === courses.length - 1 ? " and " : ", ") : null}
          <CourseRef course={course} pillar={pillar} />
        </span>
      ))}
      .
    </>
  );
}

export function PillarPipeline({
  courses,
  lessons,
  pillar,
  className,
}: {
  courses: Course[];
  lessons: LessonMetaWithSlug[];
  /** The track being drawn: a prerequisite from any other track is a feed line. */
  pillar: Pillar;
  className?: string;
}) {
  if (courses.length === 0) return null;

  return (
    <ol className={cn("relative", className)}>
      {courses.map((course, index) => {
        const isLast = index === courses.length - 1;
        const lessonByModule = new Map(
          lessons
            .filter((lesson) => lesson.course === course.slug)
            .map((lesson) => [lesson.module, lesson])
        );
        const totalModules = course.modules.length;
        const authoredModules = course.modules.filter((entry) =>
          lessonByModule.has(entry.slug)
        ).length;
        const contentComplete = totalModules > 0 && authoredModules === totalModules;
        const authoredLessonSlugs = course.modules
          .map((entry) => lessonByModule.get(entry.slug)?.slug)
          .filter((slug): slug is string => Boolean(slug));

        const upstream = course.prerequisites
          .map((slug) => getCourse(slug))
          .filter((entry): entry is Course => Boolean(entry));
        // The reverse edge, minus the one the spine has already drawn. Every
        // stage but the last is followed immediately by the course that names
        // it, so listing that course under "Feeds" printed its title twice
        // three lines apart, once as this stage's output and once as the next
        // stage's heading. What is left is the part no reading of the page
        // order gives you: which courses *elsewhere* in the curriculum wait on
        // this one.
        const nextInTrack = courses[index + 1]?.slug;
        const downstream = COURSES.filter(
          (entry) => entry.slug !== nextInTrack && entry.prerequisites.includes(course.slug)
        );

        return (
          <li key={course.slug} className="flex gap-4 sm:gap-6">
            {/* The spine. Pure decoration: the stage number repeats the
                `<ol>` position a screen reader already announces, and the
                rule is the prerequisite edge the "Requires" row states in
                words. Square node, not the round station `CourseTimeline`
                draws on `/mechanics`, because one track's rail should not be
                mistaken for another's at a glance. */}
            <div
              aria-hidden="true"
              data-decorative=""
              className="flex w-9 shrink-0 flex-col items-center"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-(--radius-tight) border border-pillar-edge bg-pillar-wash font-tech text-meta tabular-nums text-pillar-text">
                {String(index + 1).padStart(2, "0")}
              </span>
              {isLast ? null : <span className="mt-2 w-px flex-1 bg-border-strong" />}
            </div>

            <div className={cn("min-w-0 flex-1", isLast ? "pb-0" : "pb-10")}>
              {/* No "Stage 01" label above the title. The node beside it
                  already draws the index, `<ol>` already announces the
                  position to a screen reader, and the section's own
                  introduction is where the word "stage" is defined. Three
                  renderings of one ordinal is what the tier ladder next door
                  just stopped doing. */}
              <h3 className="font-display text-xl font-semibold tracking-tight">
                <Link
                  href={getCourseHref(course.slug, authoredLessonSlugs[0])}
                  className="text-foreground underline-offset-4 hover:text-pillar-text hover:underline focus-visible:text-pillar-text"
                >
                  {course.title}
                </Link>
              </h3>

              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2">
                <DifficultyMark difficulty={course.difficulty} />
                <span className="font-tech text-xs text-subtle-foreground">
                  {course.estimatedHours}h<span className="sr-only"> of study</span>
                </span>
                <span className="font-tech text-xs text-subtle-foreground">
                  {contentComplete
                    ? `All ${totalModules} lessons written`
                    : `${authoredModules} of ${totalModules} lessons written`}
                </span>
                <CourseProgressBadge lessonSlugs={authoredLessonSlugs} />
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {course.description}
              </p>

              <dl className="mt-5 space-y-4 text-sm leading-relaxed">
                {upstream.length > 0 ? (
                  <StageRow label="Requires">
                    <span className="text-muted-foreground">
                      <CourseRefList courses={upstream} pillar={pillar} />
                    </span>
                  </StageRow>
                ) : null}

                <StageRow label="Lessons">
                  <ol className="space-y-1.5">
                    {course.modules.map((entry, moduleIndex) => {
                      const lesson = lessonByModule.get(entry.slug);
                      const ordinal = String(moduleIndex + 1).padStart(2, "0");
                      return (
                        <li key={entry.slug}>
                          {lesson ? (
                            <Link
                              href={`/lessons/${lesson.slug}`}
                              className="group flex min-h-11 items-center justify-between gap-3 rounded-(--radius-tight) border border-border bg-surface-muted/40 px-3 py-2 transition-colors duration-(--dur-fast) ease-mech hover:border-pillar-edge hover:bg-surface-muted focus-visible:border-pillar-edge focus-visible:bg-surface-muted"
                            >
                              <span className="flex min-w-0 items-baseline gap-2">
                                <span className="font-tech text-meta tabular-nums text-subtle-foreground">
                                  {ordinal}
                                </span>
                                <span className="text-foreground group-hover:text-pillar-text">
                                  {lesson.title}
                                </span>
                              </span>
                              <span className="shrink-0 font-tech text-meta tabular-nums text-subtle-foreground">
                                {lesson.estimatedMinutes} min
                              </span>
                            </Link>
                          ) : (
                            <span className="flex min-h-11 items-center justify-between gap-3 rounded-(--radius-tight) border border-border/60 px-3 py-2">
                              <span className="flex min-w-0 items-baseline gap-2">
                                <span className="font-tech text-meta tabular-nums text-subtle-foreground">
                                  {ordinal}
                                </span>
                                <span className="text-muted-foreground">{entry.title}</span>
                              </span>
                              <span className="shrink-0 font-tech text-meta uppercase tracking-meta text-subtle-foreground">
                                Not written yet
                              </span>
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </StageRow>

                {downstream.length > 0 ? (
                  <StageRow label="Feeds">
                    <span className="text-muted-foreground">
                      <CourseRefList courses={downstream} pillar={pillar} />
                    </span>
                  </StageRow>
                ) : null}
              </dl>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
