"use client";

import Link from "next/link";
import { Eyebrow, Readouts, SectionTitle } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { getCourseHref } from "@/components/curriculum/courseHref";
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
 * "two ways in" panel below already answers this question for them) and
 * nothing once every authored course is complete (there's no "next" to
 * recommend). Otherwise: the first course, in curriculum order, whose
 * prerequisites are all done but which isn't done itself — i.e. the next
 * genuinely-unlocked step — with a direct link to its first unfinished
 * lesson.
 *
 * Rendered *before* "two ways in" on `/learn` — a returning reader who
 * already has progress doesn't need to re-decide how to start, so this is
 * the first thing they see in that section, styled with more weight (a
 * heavier accent border, a larger heading) than the plain `Instrument`s
 * below it. (Deliberately not `bg-pillar-wash`: `.instrument` already
 * layers the pillar wash over an opaque `--surface`, and the utility's
 * `background-color` — in Tailwind's `utilities` layer, which beats
 * `components` regardless of specificity — would have replaced that opaque
 * base with the semi-transparent wash color itself, letting the canvas
 * field show through behind this card's text.) Its own bottom margin
 * (`mb-14`, not a margin on the block that follows it) is what keeps a
 * first-time visitor's layout byte-for-byte identical to before this was
 * reordered: when this returns null, no margin exists either, so nothing
 * shifts.
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

  // "Unlocked": authored, not finished, and every prerequisite finished.
  const unlocked = COURSES.filter((course) => {
    const status = statuses.get(course.slug);
    if (!status || status.done || status.slugs.length === 0) return false;
    return course.prerequisites.every((prereqSlug) => statuses.get(prereqSlug)?.done ?? false);
  });

  // A course already underway beats an untouched one, and this used to be the
  // other way round by accident. The rule was `COURSES.find(...)`, i.e. the
  // first *declared* unlocked course, and `mathematical-foundations` is
  // declared first and has no prerequisites — so a reader three lessons into
  // Qubits & Quantum States (the intuition route, whose whole premise is that
  // it is a complete way in) was told the one thing to do next was to switch
  // to the other route, under a progress bar reading 0/11. Continuing what you
  // are in the middle of is the answer to "if you only do one thing next"
  // whenever there is one; declaration order is only the tie-break.
  const next =
    unlocked.find((course) =>
      (statuses.get(course.slug)?.slugs ?? []).some((slug) => completed.has(slug))
    ) ?? unlocked[0];

  if (!next) return null;

  const nextStatus = statuses.get(next.slug);
  const nextLessonSlug = nextStatus?.slugs.find((slug) => !completed.has(slug));
  const nextLesson = nextLessonSlug ? lessons.find((lesson) => lesson.slug === nextLessonSlug) : undefined;
  const visual = pillarVisual(next.pillar);
  const completedInCourse = nextStatus?.slugs.filter((slug) => completed.has(slug)).length ?? 0;
  const prerequisiteTitles = next.prerequisites
    .map((slug) => getCourse(slug)?.title)
    .filter((title): title is string => Boolean(title));
  // Same helper CourseList/CourseTimeline use — one source of truth for
  // where a course actually goes (its `/courses/<slug>` page today; a
  // fallback lesson if that route is ever gated off).
  const courseHref = getCourseHref(next.slug, nextStatus?.slugs[0]);

  return (
    <div data-pillar={next.pillar} className="mb-14">
      <Eyebrow>If you only do one thing next</Eyebrow>
      <SectionTitle level={2} size="md" className="mt-2">
        {next.title}
      </SectionTitle>

      <Instrument
        className="mt-5 border-l-4 border-l-pillar-edge"
        label={completedInCourse > 0 ? "Course in progress" : "Recommended next course"}
        // "No prerequisites. Start it whenever you like." is the wrong sentence
        // for a course the reader is already four lessons into, which is now
        // the common case for this panel.
        footnote={
          completedInCourse > 0
            ? "You have already started this one. Picking it up is the shortest way forward."
            : prerequisiteTitles.length > 0
              ? `Unlocked by finishing ${prerequisiteTitles.join(" and ")}.`
              : "No prerequisites. Start it whenever you like."
        }
      >
        <p className="max-w-2xl text-sm text-muted-foreground">{next.description}</p>
        <Readouts
          className="mt-5"
          items={[
            { label: "Track", value: visual.short },
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
              className="h-full rounded-full bg-brand transition-[width] duration-(--dur-slow) ease-instrument"
              style={{
                width: `${nextStatus?.slugs.length ? Math.round((completedInCourse / nextStatus.slugs.length) * 100) : 0}%`,
              }}
            />
          </div>
          <p className="mt-1.5 tech-label text-subtle-foreground">
            Your progress: {completedInCourse}/{nextStatus?.slugs.length ?? 0} lessons
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          {nextLesson ? (
            <Button href={`/lessons/${nextLesson.slug}`}>
              Start &ldquo;{nextLesson.title}&rdquo;
            </Button>
          ) : null}
          {/* "View the full course →" appeared here *and* on the rigor card
              in the fork below, identical text pointing at two different
              courses; in a screen reader's link list that is two links to
              nowhere in particular. Naming the destination's contents fixes
              both the vagueness and the collision. */}
          {/* 44px target at no layout cost: this row is `items-center` next to
              a Button that is already at least 44px tall, so giving the link a
              44px box changes nothing except that it is now tappable. */}
          <Link
            href={courseHref}
            aria-label={`See all ${next.modules.length} modules in ${next.title}`}
            className="inline-flex min-h-11 items-center text-sm font-medium text-pillar-text underline-offset-4 hover:underline"
          >
            See all {next.modules.length} modules →
          </Link>
        </div>
      </Instrument>
    </div>
  );
}
