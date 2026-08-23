import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { PILLARS, getCourse } from "@/lib/content/curriculum";
import type { Course, LessonMeta, LessonMetaWithSlug } from "@/lib/content/types";

const DIFFICULTY_LABEL: Record<LessonMeta["difficulty"], string> = {
  foundational: "Foundational",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

function moduleIndex(course: Course | undefined, moduleSlug: string): number {
  return course?.modules.findIndex((module) => module.slug === moduleSlug) ?? -1;
}

function sortByCourseOrder(lessons: LessonMetaWithSlug[], course: Course | undefined) {
  return [...lessons].sort((a, b) => moduleIndex(course, a.module) - moduleIndex(course, b.module));
}

export function LessonLayout({
  meta,
  slug,
  course,
  allLessons,
  children,
}: {
  meta: LessonMeta;
  slug: string;
  course: Course | undefined;
  /**
   * Every authored lesson site-wide. Prerequisites resolve against this
   * (so a lesson can require a lesson from a *different* course without
   * any special-casing); previous/next navigation is derived from the
   * subset that belongs to the current course, so it stays course-local.
   */
  allLessons: LessonMetaWithSlug[];
  children: ReactNode;
}) {
  const pillar = course ? PILLARS.find((p) => p.slug === course.pillar) : undefined;

  const position = moduleIndex(course, meta.module);
  const totalModules = course?.modules.length ?? 0;
  const progressPercent = position >= 0 && totalModules > 0 ? ((position + 1) / totalModules) * 100 : 0;

  const courseLessons = allLessons.filter((lesson) => lesson.course === course?.slug);
  const orderedLessons = sortByCourseOrder(courseLessons, course);
  const currentPos = orderedLessons.findIndex((lesson) => lesson.slug === slug);
  const prevLesson = currentPos > 0 ? orderedLessons[currentPos - 1] : null;
  const nextLesson =
    currentPos >= 0 && currentPos < orderedLessons.length - 1 ? orderedLessons[currentPos + 1] : null;

  const prerequisites = meta.prerequisites
    .map((prereqSlug) => allLessons.find((lesson) => lesson.slug === prereqSlug))
    .filter((lesson): lesson is LessonMetaWithSlug => Boolean(lesson));

  return (
    <Container className="py-16">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-foreground">
          Learn
        </Link>
        {pillar ? (
          <>
            <span aria-hidden="true">/</span>
            <Link href={`/learn#${pillar.slug}`} className="hover:text-foreground">
              {pillar.title}
            </Link>
          </>
        ) : null}
        {course ? (
          <>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">{course.title}</span>
          </>
        ) : null}
      </nav>

      {course && position >= 0 ? (
        <div className="mt-5 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Lesson {position + 1} of {totalModules}
          </p>
          <div className="mt-1.5 h-1 w-full max-w-xs overflow-hidden rounded-full bg-surface-muted">
            <div className="h-full rounded-full bg-brand" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      ) : null}

      <div className="mt-5 max-w-3xl">
        <div className="flex flex-wrap gap-2">
          <Badge tone="brand">{DIFFICULTY_LABEL[meta.difficulty]}</Badge>
          <Badge>{meta.estimatedMinutes} min</Badge>
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {meta.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{meta.description}</p>

        {prerequisites.length > 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Prerequisite{prerequisites.length > 1 ? "s" : ""}:{" "}
            {prerequisites.map((lesson, i) => {
              const prereqCourse = lesson.course !== meta.course ? getCourse(lesson.course) : undefined;
              return (
                <span key={lesson.slug}>
                  {i > 0 ? ", " : ""}
                  <Link href={`/lessons/${lesson.slug}`} className="text-brand hover:underline">
                    {lesson.title}
                  </Link>
                  {prereqCourse ? ` (${prereqCourse.title})` : ""}
                </span>
              );
            })}
          </p>
        ) : null}

        {meta.objectives.length > 0 ? (
          <div className="mt-6 rounded-2xl border border-border bg-surface-muted/60 p-5">
            <p className="text-sm font-semibold text-foreground">
              By the end of this lesson, you&rsquo;ll be able to:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {meta.objectives.map((objective) => (
                <li key={objective}>{objective}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="prose prose-neutral mt-12 max-w-3xl dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-brand">
        {children}
      </div>

      {prevLesson || nextLesson ? (
        <nav
          aria-label="Lesson navigation"
          className="mt-16 grid max-w-3xl gap-4 border-t border-border pt-8 sm:grid-cols-2"
        >
          {prevLesson ? (
            <Link
              href={`/lessons/${prevLesson.slug}`}
              className="group rounded-xl border border-border p-4 transition-colors hover:border-brand/40 hover:bg-surface-muted"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                ← Previous
              </span>
              <p className="mt-1 font-medium text-foreground group-hover:text-brand">{prevLesson.title}</p>
            </Link>
          ) : (
            <div aria-hidden="true" />
          )}
          {nextLesson ? (
            <Link
              href={`/lessons/${nextLesson.slug}`}
              className="group rounded-xl border border-border p-4 text-right transition-colors hover:border-brand/40 hover:bg-surface-muted sm:col-start-2"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Next →
              </span>
              <p className="mt-1 font-medium text-foreground group-hover:text-brand">{nextLesson.title}</p>
            </Link>
          ) : (
            <div aria-hidden="true" />
          )}
        </nav>
      ) : null}
    </Container>
  );
}
