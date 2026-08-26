import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
import { TechLabel } from "@/components/ui/Typography";
import { CourseProgressBadge } from "./CourseProgressBadge";
import { LessonCompletionMark } from "./LessonCompletionMark";
import { DifficultyMark } from "./DifficultyMark";
import { getCourse } from "@/lib/content/curriculum";
import { cn } from "@/lib/utils";
import type { Course, LessonMetaWithSlug } from "@/lib/content/types";

/**
 * ============================================================
 * CourseList
 * ============================================================
 * Each course renders as a substantial instrument row rather than a card in
 * a grid: a technical-voice header (course index, difficulty, hours,
 * authoring/visitor progress), a real progress bar, and a module manifest
 * that answers "what's inside" module by module — completed, available, or
 * not yet written — before the visitor commits to opening it.
 *
 * Props are unchanged from the previous card-grid implementation
 * (`courses`, `lessons`) — `/learn` and `/apex` (owned by other agents)
 * consume this component directly and neither needed to change.
 */
export function CourseList({
  courses,
  lessons,
}: {
  courses: Course[];
  lessons: LessonMetaWithSlug[];
}) {
  return (
    <div className="space-y-5">
      {courses.map((course, index) => {
        const lessonByModule = new Map(
          lessons.filter((lesson) => lesson.course === course.slug).map((lesson) => [lesson.module, lesson])
        );
        const totalModules = course.modules.length;
        const authoredModules = course.modules.filter((module) => lessonByModule.has(module.slug)).length;
        // `totalModules > 0` guard: a course authored with zero modules (not
        // currently in the data, but not impossible) would otherwise read
        // `0 === 0` and render as "0/0 lessons · complete".
        const isContentComplete = totalModules > 0 && authoredModules === totalModules;
        const authoredLessonSlugs = course.modules
          .map((module) => lessonByModule.get(module.slug)?.slug)
          .filter((slug): slug is string => Boolean(slug));
        const prerequisiteTitles = course.prerequisites
          .map((slug) => getCourse(slug)?.title)
          .filter((title): title is string => Boolean(title));
        const progressPercent = totalModules > 0 ? Math.round((authoredModules / totalModules) * 100) : 0;

        return (
          <Panel
            key={course.slug}
            as="article"
            className="overflow-hidden border-l-2 border-l-pillar-edge p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <TechLabel>Course {String(index + 1).padStart(2, "0")}</TechLabel>
                <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {course.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{course.description}</p>
                {prerequisiteTitles.length > 0 ? (
                  <p className="mt-3 text-xs text-subtle-foreground">
                    <span className="font-tech uppercase tracking-[0.1em]">Requires </span>
                    {prerequisiteTitles.join(", ")}
                  </p>
                ) : null}
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2.5">
                <DifficultyMark difficulty={course.difficulty} />
                <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1 font-tech text-xs text-subtle-foreground">
                  <span>{course.estimatedHours}h</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {authoredModules}/{totalModules} lessons{isContentComplete ? " · complete" : ""}
                  </span>
                </div>
                <CourseProgressBadge lessonSlugs={authoredLessonSlugs} />
              </div>
            </div>

            {/* Content-authoring completeness — how much of the course is
                *written*, not the reader's own progress. That distinction is
                easy to lose: `CourseProgressBadge` just above renders the
                visitor's own completed-lesson count in the same pillar hue,
                inches away. This caption is the disambiguator; without it
                the two read as one signal. */}
            <div className="mt-4">
              <div
                aria-hidden="true"
                data-decorative=""
                className="h-1 w-full overflow-hidden rounded-full bg-surface-muted"
              >
                <div
                  className="h-full rounded-full bg-pillar transition-[width] duration-[--dur-slow] ease-[--ease-instrument]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-1.5 font-tech text-[0.65rem] uppercase tracking-[0.1em] text-subtle-foreground">
                Content available — {progressPercent}%
              </p>
            </div>

            <ol className="mt-5 grid gap-2 sm:grid-cols-2">
              {course.modules.map((module, moduleIndex) => {
                const lesson = lessonByModule.get(module.slug);
                return (
                  <li
                    key={module.slug}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm",
                      lesson ? "border-border bg-surface-muted/40" : "border-border/60 bg-transparent"
                    )}
                  >
                    <span className="flex min-w-0 items-baseline gap-2">
                      <span className="font-tech text-[0.65rem] text-subtle-foreground">
                        {String(moduleIndex + 1).padStart(2, "0")}
                      </span>
                      <span className={cn("truncate", lesson ? "text-foreground" : "text-muted-foreground")}>
                        {module.title}
                      </span>
                    </span>
                    {lesson ? (
                      <span className="flex shrink-0 items-center gap-2.5">
                        <LessonCompletionMark slug={lesson.slug} />
                        <Link
                          href={`/lessons/${lesson.slug}`}
                          className="font-tech text-[0.7rem] font-medium uppercase tracking-wide text-pillar-text hover:underline"
                        >
                          View →
                        </Link>
                      </span>
                    ) : (
                      <span className="shrink-0 font-tech text-[0.65rem] uppercase tracking-wide text-subtle-foreground">
                        Coming soon
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </Panel>
        );
      })}
    </div>
  );
}
