import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionTitle, Lede, TechLabel, Readouts } from "@/components/ui/Typography";
import { FadeRule } from "@/components/ui/Panel";
import { PillarScope } from "@/components/field/PillarScope";
import { COURSES, PILLARS } from "@/lib/content/curriculum";
import type { Course, LessonMeta, LessonMetaWithSlug } from "@/lib/content/types";
import { getCourseCheckpointProblems } from "@/lib/problems/registry";
import { CourseCheckpoint } from "@/components/problems/CourseCheckpoint";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { LessonCompleteToggle } from "./LessonCompleteToggle";
import { ReadingProgressBar } from "./ReadingProgressBar";
import { TableOfContentsDesktop, TableOfContentsMobile } from "./TableOfContents";
import { LessonMetaStrip } from "./LessonMetaStrip";
import { LessonFooterNav } from "./LessonFooterNav";
import { RelatedCurrentQuantum } from "@/components/currentQuantum/RelatedCurrentQuantum";

/** `id` of the prose container — shared by the ToC and reading-progress bar
 * so they can each find it via `document.getElementById` after mount. */
const LESSON_PROSE_ID = "lesson-prose";

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

  // Difficulty is rendered separately via `DifficultyMark` (the tick ladder
  // + label used everywhere else difficulty appears — courses, timeline,
  // lesson search, problems) rather than as a plain-text item here, so a
  // reader gets the same at-a-glance instrument before committing to a
  // lesson that they'd get anywhere else on the site. See docs/UX_REVIEW.md
  // P0-3.
  const readoutItems = [
    ...(course && position >= 0
      ? [{ label: "Module", value: position + 1, unit: `/ ${totalModules}` }]
      : []),
    { label: "Duration", value: meta.estimatedMinutes, unit: "min" },
  ];

  return (
    // Retints accents, focus rings, prose links, equation slabs and the
    // background field to this lesson's course's pillar — see
    // docs/DESIGN_SYSTEM.md §2. `course` (and therefore `pillar`) can be
    // undefined for a lesson with no resolvable course; PillarScope's own
    // `pillar` prop is optional for exactly this reason, and everything
    // below reads pillar-tinted tokens that fall back to the default
    // (brand-family) ramp when no `data-pillar` is set.
    <PillarScope pillar={course?.pillar}>
      <ReadingProgressBar containerId={LESSON_PROSE_ID} />
      <Container className="pb-20 pt-10 sm:pt-14">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link href="/learn" className="tech-label text-muted-foreground transition-colors hover:text-foreground">
            Learn
          </Link>
          {pillar ? (
            <>
              <span aria-hidden="true" data-decorative="" className="tech-label text-subtle-foreground">
                /
              </span>
              <Link
                href={`/learn#${pillar.slug}`}
                className="tech-label text-muted-foreground transition-colors hover:text-foreground"
              >
                {pillar.title}
              </Link>
            </>
          ) : null}
          {course ? (
            <>
              <span aria-hidden="true" data-decorative="" className="tech-label text-subtle-foreground">
                /
              </span>
              <span className="tech-label text-pillar-text">{course.title}</span>
            </>
          ) : null}
        </nav>

        {/* The title moment (see docs/UX_REVIEW.md P2-6). The title used to
            arrive fourth — after a readouts row and a progress rule — so the
            biggest, quietest thing on the page was preceded by two chrome
            blocks instead of leading with it. Title and lede now come
            immediately after the breadcrumb; the "how hard, how long, how
            far into the course" instrument strip drops to a single compact
            row right below the lede instead of gating the title. Nothing
            here was removed, only reordered and tightened — see
            LessonMetaStrip.tsx for where the heavier "Lineage" block (the
            other half of the six-block wall the review flagged) went. */}
        <div className="mt-6 max-w-3xl">
          <SectionTitle level={1} size="xl">
            {meta.title}
          </SectionTitle>
          <Lede className="mt-5">{meta.description}</Lede>

          <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4">
            <DifficultyMark difficulty={meta.difficulty} />
            <Readouts items={readoutItems} />
          </div>

          {course && position >= 0 ? (
            <div
              className="mt-3 h-px w-full max-w-[14rem] overflow-hidden rounded-full bg-surface-muted"
              role="presentation"
            >
              <div className="h-full bg-pillar" style={{ width: `${progressPercent}%` }} />
            </div>
          ) : null}

          {meta.objectives.length > 0 ? (
            <div className="mt-7 border-l-2 border-pillar-edge pl-5">
              <TechLabel>Objectives</TechLabel>
              <ol className="mt-3 space-y-2.5">
                {meta.objectives.map((objective, i) => (
                  <li key={objective} className="flex gap-3 text-sm leading-relaxed text-foreground/90 sm:text-[0.95rem]">
                    <span className="tech-value shrink-0 pt-px text-xs text-pillar-text">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ol>
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
              // Prose colors are theme-switched entirely in globals.css, not
              // via Tailwind's `dark:` variant. The site is dark-first, so
              // the bare `.prose` block there IS the dark ramp and the
              // *light* values live under `[data-theme="light"]` /
              // `prefers-color-scheme: light`. Either direction, `dark:` is
              // the wrong tool: this app's theme is driven by the
              // `data-theme` attribute (ThemeToggle), while Tailwind v4's
              // `dark:` defaults to `@media (prefers-color-scheme: dark)`
              // with no `@custom-variant dark` redefinition anywhere in this
              // repo — so it would only ever track the OS preference and
              // invert wrongly whenever an explicit choice disagrees with it.
              "prose prose-neutral max-w-3xl prose-a:text-pillar-text",
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

        {/* Curriculum lineage (prerequisites / resurfaces-in / related
            elsewhere) moves below the lesson body rather than sitting
            between the title and the prose — see docs/UX_REVIEW.md P2-6 and
            the comment in LessonMetaStrip.tsx. It's a collapsed `<details>`,
            not deleted or hidden: a reader who wants it before starting can
            still scroll down and open it in one glance at the summary line,
            but it no longer taxes every reader on every lesson. */}
        <LessonMetaStrip
          currentCourseSlug={meta.course}
          prerequisites={prerequisites}
          resurfacesIn={resurfacesIn}
          relatedElsewhere={relatedElsewhere}
        />

        <FadeRule className="mt-14 max-w-3xl" />

        <div className="mt-10 max-w-3xl">
          <LessonCompleteToggle slug={slug} />
        </div>

        <LessonFooterNav
          prevLesson={prevLesson}
          nextLesson={nextLesson}
          finishedCourse={finishedCourse}
          nextCourseSuggestions={nextCourseSuggestions}
          pillar={pillar}
        />

        {finishedCourse && checkpointProblems.length > 0 ? (
          <div className="mt-10 max-w-3xl">
            <CourseCheckpoint courseTitle={finishedCourse.title} problems={checkpointProblems} />
          </div>
        ) : null}
      </Container>
    </PillarScope>
  );
}
