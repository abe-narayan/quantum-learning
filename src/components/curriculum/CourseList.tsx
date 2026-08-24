import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CourseProgressBadge } from "./CourseProgressBadge";
import { LessonCompletionMark } from "./LessonCompletionMark";
import type { Course, Difficulty, LessonMetaWithSlug } from "@/lib/content/types";

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  foundational: "Foundational",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function CourseList({
  courses,
  lessons,
}: {
  courses: Course[];
  lessons: LessonMetaWithSlug[];
}) {
  return (
    <div className="space-y-6">
      {courses.map((course) => {
        const lessonByModule = new Map(
          lessons.filter((lesson) => lesson.course === course.slug).map((lesson) => [lesson.module, lesson])
        );
        const totalModules = course.modules.length;
        const completedModules = course.modules.filter((module) => lessonByModule.has(module.slug)).length;
        const isComplete = completedModules === totalModules;
        const isStarted = completedModules > 0;
        const authoredLessonSlugs = course.modules
          .map((module) => lessonByModule.get(module.slug)?.slug)
          .filter((slug): slug is string => Boolean(slug));

        return (
          <Card key={course.slug}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">{course.description}</p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Badge tone="brand">{DIFFICULTY_LABEL[course.difficulty]}</Badge>
                <Badge>{course.estimatedHours}h</Badge>
                <Badge tone={isComplete ? "accent" : isStarted ? "neutral" : "neutral"}>
                  {completedModules}/{totalModules} lessons{isComplete ? " · complete" : ""}
                </Badge>
                <CourseProgressBadge lessonSlugs={authoredLessonSlugs} />
              </div>
            </div>

            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {course.modules.map((module) => {
                const lesson = lessonByModule.get(module.slug);
                return (
                  <li
                    key={module.slug}
                    className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <span className={lesson ? "text-foreground" : "text-muted-foreground"}>
                      {module.title}
                    </span>
                    {lesson ? (
                      <span className="flex shrink-0 items-center gap-2">
                        <LessonCompletionMark slug={lesson.slug} />
                        <Link
                          href={`/lessons/${lesson.slug}`}
                          className="text-xs font-medium text-brand hover:underline"
                        >
                          View →
                        </Link>
                      </span>
                    ) : (
                      <Badge>Coming soon</Badge>
                    )}
                  </li>
                );
              })}
            </ol>
          </Card>
        );
      })}
    </div>
  );
}
