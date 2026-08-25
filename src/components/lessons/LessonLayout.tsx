import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { COURSES, PILLARS, getCourse } from "@/lib/content/curriculum";
import type { Course, LessonMeta, LessonMetaWithSlug } from "@/lib/content/types";
import { getCourseCheckpointProblems } from "@/lib/problems/registry";
import { CourseCheckpoint } from "@/components/problems/CourseCheckpoint";
import { LessonCompleteToggle } from "./LessonCompleteToggle";
import { ReadingProgressBar } from "./ReadingProgressBar";
import { TableOfContentsDesktop, TableOfContentsMobile } from "./TableOfContents";
import { RelatedCurrentQuantum } from "@/components/currentQuantum/RelatedCurrentQuantum";

/** `id` of the prose container — shared by the ToC and reading-progress bar
 * so they can each find it via `document.getElementById` after mount. */
const LESSON_PROSE_ID = "lesson-prose";

const DIFFICULTY_LABEL: Record<LessonMeta["difficulty"], string> = {
  foundational: "Foundational",
  intermediate: "Intermediate",
  advanced: "Advanced",
  master: "Master",
};

function moduleIndex(course: Course | undefined, moduleSlug: string): number {
  return course?.modules.findIndex((module) => module.slug === moduleSlug) ?? -1;
}

function sortByCourseOrder(lessons: LessonMetaWithSlug[], course: Course | undefined) {
  return [...lessons].sort((a, b) => moduleIndex(course, a.module) - moduleIndex(course, b.module));
}

/** The lesson that corresponds to a course's first module, if one has been authored. */
function firstLessonOf(targetCourse: Course, allLessons: LessonMetaWithSlug[]): LessonMetaWithSlug | undefined {
  const firstModule = targetCourse.modules[0];
  if (!firstModule) return undefined;
  return allLessons.find(
    (lesson) => lesson.course === targetCourse.slug && lesson.module === firstModule.slug,
  );
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

  // When this is the last lesson of its course, surface real courses that list this
  // course as a prerequisite (a genuine "what's next"), instead of silently omitting
  // the "Next" card. Falls back to a pointer back into the catalog for terminal courses
  // that nothing else builds on.
  const isLastLessonOfCourse = currentPos >= 0 && currentPos === orderedLessons.length - 1;
  const finishedCourse = isLastLessonOfCourse ? course : undefined;
  const nextCourseSuggestions = finishedCourse
    ? COURSES.filter((candidate) => candidate.prerequisites.includes(finishedCourse.slug))
        .map((candidate) => ({ course: candidate, lesson: firstLessonOf(candidate, allLessons) }))
        .filter(
          (entry): entry is { course: Course; lesson: LessonMetaWithSlug } => Boolean(entry.lesson),
        )
        .slice(0, 3)
    : [];
  const checkpointProblems = finishedCourse ? getCourseCheckpointProblems(finishedCourse.slug) : [];

  const prerequisites = meta.prerequisites
    .map((prereqSlug) => allLessons.find((lesson) => lesson.slug === prereqSlug))
    .filter((lesson): lesson is LessonMetaWithSlug => Boolean(lesson));

  // Reverse index of prerequisites, computed for free from data every lesson
  // already carries: other-course lessons that list this one as a
  // prerequisite. No authoring required, so it can be shown unconditionally
  // whenever it's non-empty.
  const resurfacesIn = allLessons.filter(
    (lesson) => lesson.prerequisites.includes(slug) && lesson.course !== meta.course,
  );

  // Hand-curated cross-links (see `related` on LessonMeta). Only populated
  // for a small, explicitly verified set of lessons.
  const relatedElsewhere = (meta.related ?? [])
    .map((entry) => {
      const lesson = allLessons.find((candidate) => candidate.slug === entry.slug);
      return lesson ? { lesson, note: entry.note } : null;
    })
    .filter((entry): entry is { lesson: LessonMetaWithSlug; note: string } => Boolean(entry));

  return (
    <>
      <ReadingProgressBar containerId={LESSON_PROSE_ID} />
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
          <h1 className="mt-5 font-display text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {meta.title}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">{meta.description}</p>

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

          {resurfacesIn.length > 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              This concept resurfaces in:{" "}
              {resurfacesIn.map((lesson, i) => {
                const resurfaceCourse = getCourse(lesson.course);
                const resurfacePillar = resurfaceCourse
                  ? PILLARS.find((p) => p.slug === resurfaceCourse.pillar)
                  : undefined;
                return (
                  <span key={lesson.slug}>
                    {i > 0 ? ", " : ""}
                    <Link href={`/lessons/${lesson.slug}`} className="text-brand hover:underline">
                      {lesson.title}
                    </Link>
                    {resurfacePillar ? ` (${resurfacePillar.title})` : ""}
                  </span>
                );
              })}
            </p>
          ) : null}

          {relatedElsewhere.length > 0 ? (
            <div className="mt-6 rounded-2xl border border-border bg-surface-muted/60 p-5">
              <p className="text-sm font-semibold text-foreground">Related elsewhere</p>
              <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                {relatedElsewhere.map(({ lesson, note }) => (
                  <li key={lesson.slug}>
                    <Link href={`/lessons/${lesson.slug}`} className="text-brand hover:underline">
                      {lesson.title}
                    </Link>
                    {" — "}
                    {note}
                  </li>
                ))}
              </ul>
            </div>
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

        <TableOfContentsMobile containerId={LESSON_PROSE_ID} />

        {/* Two-column at `lg`: prose keeps its own `max-w-3xl` regardless of
            which branch of `has-[nav:empty]` is active, so this grid switching
            between one and two columns never reflows the reading column
            itself — only whether the rail's space is reserved. */}
        <div className="mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start lg:gap-10 lg:has-[nav:empty]:grid-cols-1">
          <div
            id={LESSON_PROSE_ID}
            className={cn(
              // Dark-mode prose colors come from globals.css's `.prose`
              // overrides inside the `[data-theme="dark"]` / dark-media
              // blocks, not Tailwind's `dark:` variant: this app's dark mode
              // is driven by the `data-theme` attribute (ThemeToggle), and
              // Tailwind v4's `dark:` defaults to `@media
              // (prefers-color-scheme: dark)` with no `@custom-variant dark`
              // redefinition anywhere in this repo. `dark:prose-invert` here
              // would only track the OS preference — invisible-on-toggle in
              // the "explicit dark, OS light" case, and wrongly inverted in
              // the "explicit light, OS dark" case. See globals.css.
              "prose prose-neutral max-w-3xl prose-a:text-brand",
              // h2 = section-moment: display face, real weight/spacing, the
              // biggest thing in the prose body short of the page's own h1.
              "prose-h2:font-display prose-h2:mt-16 prose-h2:mb-4 prose-h2:text-3xl prose-h2:font-semibold prose-h2:tracking-tight",
              // h3 stays Geist Sans (inherits body font) but genuinely bolder
              // and more distinct from body copy than the plugin's default.
              "prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-xl prose-h3:font-bold prose-h3:tracking-tight",
              // h4 = small-caps-style label, not "h3 but smaller": uppercase,
              // tracking-wide, muted, small — a section label, not a heading.
              "prose-h4:mt-8 prose-h4:mb-2 prose-h4:text-xs prose-h4:font-semibold prose-h4:uppercase prose-h4:tracking-wide prose-h4:text-muted-foreground"
            )}
          >
            {children}
          </div>
          <TableOfContentsDesktop containerId={LESSON_PROSE_ID} />
        </div>

        <RelatedCurrentQuantum lessonSlug={slug} />

        <div className="mt-10 max-w-3xl border-t border-border pt-8">
          <LessonCompleteToggle slug={slug} />
        </div>

        {prevLesson || nextLesson || finishedCourse ? (
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
            ) : finishedCourse ? (
              <div className="rounded-xl border border-border p-4 text-right transition-colors hover:border-brand/40 hover:bg-surface-muted sm:col-start-2">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Next →
                </span>
                <p className="mt-1 font-medium text-foreground">You finished {finishedCourse.title}</p>
                {nextCourseSuggestions.length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {nextCourseSuggestions.map(({ course: suggestedCourse, lesson }) => (
                      <li key={suggestedCourse.slug}>
                        <Link
                          href={`/lessons/${lesson.slug}`}
                          className="text-sm text-brand hover:underline"
                        >
                          Start {suggestedCourse.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm">
                    <Link
                      href={pillar ? `/learn#${pillar.slug}` : "/learn"}
                      className="text-brand hover:underline"
                    >
                      Browse more courses
                    </Link>
                  </p>
                )}
              </div>
            ) : (
              <div aria-hidden="true" />
            )}
          </nav>
        ) : null}

        {finishedCourse && checkpointProblems.length > 0 ? (
          <div className="max-w-3xl">
            <CourseCheckpoint courseTitle={finishedCourse.title} problems={checkpointProblems} />
          </div>
        ) : null}
      </Container>
    </>
  );
}
