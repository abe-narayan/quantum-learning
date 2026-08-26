"use client";

import { COURSES, getCourse } from "@/lib/content/curriculum";
import { useCompletedLessonSlugs } from "@/lib/content/progress";
import { DifficultyMark } from "./DifficultyMark";
import { cn } from "@/lib/utils";
import type { Course, LessonMetaWithSlug, Pillar } from "@/lib/content/types";

const PILLAR_LABEL: Record<Pillar, string> = {
  "quantum-mechanics": "Mechanics",
  "quantum-computing": "Computing",
  "quantum-hardware": "Hardware",
  "quantum-software": "Software",
  "quantum-mastery": "Mastery",
  apex: "Apex",
};

/**
 * A horizontal (desktop) / vertical (mobile) progression rail of a pillar's
 * courses in real curriculum order, sitting above `CourseList` on each
 * pillar page. Each station mirrors `CourseList`'s exact completion math
 * (same `lessonByModule` derivation, same `useCompletedLessonSlugs()`
 * source) so the two views never disagree.
 *
 * Two things make this genuinely a *timeline* rather than a row of icons:
 * the connecting segment between two stations fills solid once the earlier
 * station is complete (so "how far have I actually gotten" reads at a
 * glance, not just "is this one done"), and any course another pillar's
 * course depends on gets a small "→ Pillar" marker, surfacing a real
 * cross-pillar dependency edge instead of only the within-pillar order.
 *
 * Stations are plain visual indicators, not links: `CourseList`'s course
 * rows don't currently expose a stable per-course anchor id.
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
      <p className="mb-4 max-w-2xl text-xs leading-relaxed text-subtle-foreground">
        Foundational = no prior background needed · Intermediate = builds on
        earlier courses · Advanced = college-level rigor · Master =
        graduate-level, proofs not just results.
      </p>
      <ol className="flex flex-col sm:min-w-max sm:flex-row sm:items-stretch">
        {courses.map((course, index) => {
          const lessonByModule = new Map(
            lessons
              .filter((lesson) => lesson.course === course.slug)
              .map((lesson) => [lesson.module, lesson])
          );
          const totalModules = course.modules.length;
          // Content-authoring completeness — identical math to CourseList's
          // "X/Y lessons" readout (how many modules have a written lesson).
          const authoredModules = course.modules.filter((module) =>
            lessonByModule.has(module.slug)
          ).length;
          const contentComplete = totalModules > 0 && authoredModules === totalModules;
          const authoredLessonSlugs = course.modules
            .map((module) => lessonByModule.get(module.slug)?.slug)
            .filter((slug): slug is string => Boolean(slug));
          // Visitor's own progress — identical source to CourseProgressBadge
          // (useCompletedLessonSlugs()), drives the station's ring/checkmark
          // and the fill on the connector leading out of it.
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
          // a prerequisite — surfaced as a small "-> Hardware" style marker.
          const dependentPillars = Array.from(
            new Set(
              COURSES.filter(
                (other) =>
                  other.pillar !== course.pillar && other.prerequisites.includes(course.slug)
              ).map((other) => other.pillar)
            )
          );

          return (
            <li key={course.slug} className="flex sm:min-w-[13rem] sm:flex-1 sm:flex-col">
              <div className="flex flex-col items-center sm:w-full sm:flex-row">
                <div
                  aria-hidden
                  data-decorative=""
                  className={cn(
                    "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-tech text-xs font-semibold",
                    isComplete
                      ? "border-pillar bg-pillar-wash text-pillar-text"
                      : isStarted
                        ? "border-pillar/60 bg-transparent text-pillar-text"
                        : "border-border bg-surface text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="M4 8.3 L6.6 11 L12 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                {!isLast ? (
                  <div
                    aria-hidden
                    data-decorative=""
                    className={cn(
                      "w-0.5 flex-1 sm:h-0.5 sm:w-auto",
                      isComplete ? "bg-pillar" : "bg-border"
                    )}
                  />
                ) : null}
              </div>

              <div className="flex flex-col gap-2 py-2 pl-3 sm:items-start sm:gap-2 sm:pb-8 sm:pl-0 sm:pt-3">
                <p className="text-sm font-semibold leading-snug text-foreground">
                  {course.title}
                  {/* The station circle (✓ / number, ring color) is `aria-hidden`
                      pure decoration — this is the only place a screen-reader
                      user gets the visitor-progress status it conveys visually
                      (the circle's own `title` attribute is unreachable once
                      the element is aria-hidden, so it's not a real fallback). */}
                  <span className="sr-only">
                    {" — "}
                    {isComplete ? "Complete" : isStarted ? "In progress" : "Not started"}
                  </span>
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <DifficultyMark difficulty={course.difficulty} />
                  <span className="font-tech text-[0.65rem] uppercase tracking-wide text-subtle-foreground">
                    {authoredModules}/{totalModules} lessons{contentComplete ? " · complete" : ""}
                  </span>
                </div>
                {dependentPillars.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {dependentPillars.map((pillar) => (
                      <span
                        key={pillar}
                        className="rounded-full border border-border px-2 py-0.5 font-tech text-[0.6rem] uppercase tracking-wide text-subtle-foreground"
                      >
                        → {PILLAR_LABEL[pillar]}
                      </span>
                    ))}
                  </div>
                ) : null}
                {prerequisiteTitles.length > 0 ? (
                  <p className="text-xs text-subtle-foreground">
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
