"use client";

import { Badge } from "@/components/ui/Badge";
import { COURSES, getCourse } from "@/lib/content/curriculum";
import { useCompletedLessonSlugs } from "@/lib/content/progress";
import { cn } from "@/lib/utils";
import type { Course, Difficulty, LessonMetaWithSlug, Pillar } from "@/lib/content/types";

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  foundational: "Foundational",
  intermediate: "Intermediate",
  advanced: "Advanced",
  master: "Master",
};

const PILLAR_LABEL: Record<Pillar, string> = {
  "quantum-mechanics": "Mechanics",
  "quantum-computing": "Computing",
  "quantum-hardware": "Hardware",
  "quantum-software": "Software",
  "quantum-mastery": "Mastery",
};

/**
 * A horizontal (desktop) / vertical (mobile) "timeline" of a pillar's
 * courses in real curriculum order, sitting above `CourseList` on each
 * pillar page. Each station mirrors `CourseList`'s exact completion math
 * (same `lessonByModule` derivation, same `useCompletedLessonSlugs()`
 * source) so the two views never disagree.
 *
 * Stations are plain visual indicators, not links: `CourseList`'s course
 * cards don't currently expose a stable per-course anchor id, and adding
 * one would mean editing `CourseList.tsx` beyond a trivial one-liner
 * (it renders `<Card>` directly with no wrapping element to attach an
 * `id` to, and `Card` itself doesn't forward an `id` prop) — see the
 * report for this limitation.
 */
export function CourseTimeline({
  courses,
  lessons,
}: {
  courses: Course[];
  lessons: LessonMetaWithSlug[];
}) {
  const completedSlugs = useCompletedLessonSlugs();

  return (
    <div className="overflow-x-auto">
      <p className="mb-3 text-xs text-muted-foreground">
        Foundational = no prior background needed · Intermediate = builds on
        earlier courses · Advanced = college-level rigor · Master =
        graduate-level, proofs not just results.
      </p>
      <ol className="flex min-w-max flex-col sm:min-w-0 sm:flex-row sm:items-stretch">
        {courses.map((course, index) => {
          const lessonByModule = new Map(
            lessons
              .filter((lesson) => lesson.course === course.slug)
              .map((lesson) => [lesson.module, lesson])
          );
          const totalModules = course.modules.length;
          // Content-authoring completeness — identical math to CourseList's
          // "X/Y lessons" badge (how many modules have a written lesson).
          const authoredModules = course.modules.filter((module) =>
            lessonByModule.has(module.slug)
          ).length;
          const contentComplete = authoredModules === totalModules;
          const authoredLessonSlugs = course.modules
            .map((module) => lessonByModule.get(module.slug)?.slug)
            .filter((slug): slug is string => Boolean(slug));
          // Visitor's own progress — identical source to CourseProgressBadge
          // (useCompletedLessonSlugs()), drives the station's ring/checkmark.
          const visitorCompleted = authoredLessonSlugs.filter((slug) =>
            completedSlugs.has(slug)
          ).length;
          const isComplete = authoredModules > 0 && visitorCompleted === authoredModules;
          const isStarted = visitorCompleted > 0 && !isComplete;
          const isLast = index === courses.length - 1;
          const prerequisiteTitles = course.prerequisites
            .map((slug) => getCourse(slug)?.title)
            .filter((title): title is string => Boolean(title));

          // Cross-pillar courses (in other pillars) that list this course as
          // a prerequisite — surfaced as a small "-> Hardware" style badge.
          const dependentPillars = Array.from(
            new Set(
              COURSES.filter(
                (other) =>
                  other.pillar !== course.pillar && other.prerequisites.includes(course.slug)
              ).map((other) => other.pillar)
            )
          );

          return (
            <li key={course.slug} className="flex sm:min-w-[12rem] sm:flex-1 sm:flex-col">
              <div className="flex flex-col items-center sm:w-full sm:flex-row">
                <div
                  aria-hidden
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold",
                    isComplete
                      ? "border-accent bg-accent text-white"
                      : isStarted
                        ? "border-brand bg-brand/10 text-brand"
                        : "border-border bg-surface text-muted-foreground"
                  )}
                  title={
                    isComplete
                      ? "Complete"
                      : isStarted
                        ? "In progress"
                        : "Not started"
                  }
                >
                  {isComplete ? "✓" : index + 1}
                </div>
                {!isLast ? (
                  <div
                    aria-hidden
                    className="w-0.5 flex-1 bg-border sm:h-0.5 sm:w-auto"
                  />
                ) : null}
              </div>

              <div className="flex flex-col gap-2 py-2 pl-3 sm:items-start sm:gap-2 sm:pb-8 sm:pl-0 sm:pt-3">
                <p className="text-sm font-semibold leading-snug text-foreground">
                  {course.title}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge tone="brand">{DIFFICULTY_LABEL[course.difficulty]}</Badge>
                  <Badge tone={contentComplete ? "accent" : "neutral"}>
                    {authoredModules}/{totalModules} lessons
                  </Badge>
                  {dependentPillars.map((pillar) => (
                    <Badge key={pillar} tone="neutral">
                      → {PILLAR_LABEL[pillar]}
                    </Badge>
                  ))}
                </div>
                {prerequisiteTitles.length > 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Requires: {prerequisiteTitles.join(", ")}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
