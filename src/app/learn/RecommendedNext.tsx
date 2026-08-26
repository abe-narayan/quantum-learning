"use client";

import { Eyebrow, Readouts, SectionTitle } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { COURSES, getCourse } from "@/lib/content/curriculum";
import { pillarVisual } from "@/lib/design/pillars";
import { useCompletedLessonSlugs } from "@/lib/content/progress";
import type { LessonMetaWithSlug } from "@/lib/content/types";

type CourseStatus = {
  /** Authored lesson slugs for this course, in module order. */
  slugs: string[];
  done: boolean;
};

function buildCourseStatuses(lessons: LessonMetaWithSlug[]): Map<string, CourseStatus> {
  const statuses = new Map<string, CourseStatus>();
  for (const course of COURSES) {
    const slugs = course.modules
      .map((module) => lessons.find((lesson) => lesson.course === course.slug && lesson.module === module.slug)?.slug)
      .filter((slug): slug is string => Boolean(slug));
    statuses.set(course.slug, { slugs, done: false });
  }
  return statuses;
}

/**
 * The one-line answer to "if I only do one thing next, what should it be?" —
 * derived from two real sources, not a hand-picked default: the
 * prerequisite graph in `COURSES` (which course unlocks next) and the
 * visitor's own stored completion (which of those are actually finished).
 *
 * Renders nothing for a brand-new visitor (nothing completed yet — the
 * "two ways in" panel above already answers this question for them) and
 * nothing once every authored course is complete (there's no "next" to
 * recommend). Otherwise: the first course, in curriculum order, whose
 * prerequisites are all done but which isn't done itself — i.e. the next
 * genuinely-unlocked step — with a direct link to its first unfinished
 * lesson.
 */
export function RecommendedNext({ lessons }: { lessons: LessonMetaWithSlug[] }) {
  const completed = useCompletedLessonSlugs();

  if (completed.size === 0) return null;

  const statuses = buildCourseStatuses(lessons);
  for (const course of COURSES) {
    const status = statuses.get(course.slug);
    if (!status) continue;
    status.done = status.slugs.length > 0 && status.slugs.every((slug) => completed.has(slug));
  }

  const next = COURSES.find((course) => {
    const status = statuses.get(course.slug);
    if (!status || status.done || status.slugs.length === 0) return false;
    return course.prerequisites.every((prereqSlug) => statuses.get(prereqSlug)?.done ?? false);
  });

  if (!next) return null;

  const nextStatus = statuses.get(next.slug);
  const nextLessonSlug = nextStatus?.slugs.find((slug) => !completed.has(slug));
  const nextLesson = nextLessonSlug ? lessons.find((lesson) => lesson.slug === nextLessonSlug) : undefined;
  const visual = pillarVisual(next.pillar);
  const completedInCourse = nextStatus?.slugs.filter((slug) => completed.has(slug)).length ?? 0;
  const prerequisiteTitles = next.prerequisites
    .map((slug) => getCourse(slug)?.title)
    .filter((title): title is string => Boolean(title));

  return (
    <div data-pillar={next.pillar} className="mt-14">
      <Eyebrow>If you only do one thing next</Eyebrow>
      <SectionTitle level={2} size="sm" className="mt-2">
        {next.title}
      </SectionTitle>

      <Instrument
        className="mt-5 border-l-2 border-l-pillar-edge"
        label="Recommended next course"
        footnote={
          prerequisiteTitles.length > 0
            ? `Unlocked by finishing ${prerequisiteTitles.join(" and ")}.`
            : "No prerequisites — start anytime."
        }
      >
        <p className="max-w-2xl text-sm text-muted-foreground">{next.description}</p>
        <Readouts
          className="mt-5"
          items={[
            { label: "Pillar", value: visual.short },
            { label: "Difficulty", value: <DifficultyMark difficulty={next.difficulty} /> },
            { label: "Length", value: next.estimatedHours, unit: "h" },
          ]}
        />

        {/* A real progress bar, not just the "3/12" readout it used to be —
            gives the reader's own advance through this specific course the
            same visual weight CourseList gives content-authoring progress
            (deliberately using `bg-brand`, not `bg-pillar`, so it reads as a
            distinct signal from CourseList's authoring-completeness bar). */}
        <div className="mt-5">
          <div
            aria-hidden="true"
            data-decorative=""
            className="h-1 w-full max-w-2xl overflow-hidden rounded-full bg-surface-muted"
          >
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-[--dur-slow] ease-[--ease-instrument]"
              style={{
                width: `${nextStatus?.slugs.length ? Math.round((completedInCourse / nextStatus.slugs.length) * 100) : 0}%`,
              }}
            />
          </div>
          <p className="mt-1.5 font-tech text-[0.65rem] uppercase tracking-[0.1em] text-subtle-foreground">
            Your progress — {completedInCourse}/{nextStatus?.slugs.length ?? 0} lessons
          </p>
        </div>

        {nextLesson ? (
          <Button href={`/lessons/${nextLesson.slug}`} className="mt-5">
            Start &ldquo;{nextLesson.title}&rdquo;
          </Button>
        ) : null}
      </Instrument>
    </div>
  );
}
