import type { ReactNode } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/Typography";
import { FadeRule } from "@/components/ui/Panel";
import { PillarScope } from "@/components/field/PillarScope";
import { PrerequisiteReadout } from "@/components/lessons/PrerequisiteReadout";
import { ScrollableMathText } from "./ScrollableMathText";
import { getCourse, getPillar } from "@/lib/content/curriculum";
import { getCourseHref } from "@/components/curriculum/courseHref";
import { DifficultyScale, TypeMark } from "./ProblemMetaMarks";
import type { Problem } from "@/lib/problems/types";
import type { LessonMetaWithSlug } from "@/lib/content/types";

/** The in-page target `ProblemView` links to after a wrong answer. Exported
 *  so the caller that decides whether that link is worth offering (the route,
 *  which knows whether this problem declares any prerequisites) and the
 *  element it points at can never disagree about the id. */
export const PREREQUISITE_ANCHOR_ID = "problem-prerequisites";

/**
 * Everything about a problem page that doesn't need interactivity: the
 * breadcrumb, metadata, title, prompt, prerequisite links, and a link back
 * to the home lesson. Server-rendered, same division of labor as
 * `LessonLayout` around an MDX lesson body — `children` is the one
 * interactive piece (`ProblemView`). Sets the problem's course's pillar via
 * `PillarScope`, the same identity a student sees on the lesson this problem
 * came from.
 */
export function ProblemLayout({
  problem,
  allLessons,
  children,
}: {
  problem: Problem;
  allLessons: LessonMetaWithSlug[];
  children: ReactNode;
}) {
  const homeLesson = problem.meta.lesson ? allLessons.find((lesson) => lesson.slug === problem.meta.lesson) : undefined;
  const prerequisites = (problem.meta.prerequisites ?? [])
    .map((slug) => allLessons.find((lesson) => lesson.slug === slug))
    .filter((lesson): lesson is LessonMetaWithSlug => Boolean(lesson));

  const course = getCourse(problem.meta.course);
  const pillar = course ? getPillar(course.pillar) : undefined;

  return (
    <PillarScope pillar={course?.pillar}>
      <Section width="reading">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link
            href="/problems"
            className="tech-label inline-flex min-h-11 items-center rounded-(--radius-tight) text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
          >
            Problems
          </Link>
          {pillar ? (
            <>
              <span aria-hidden="true" className="tech-label text-subtle-foreground">
                /
              </span>
              <span className="tech-label text-pillar-text">{pillar.title}</span>
            </>
          ) : null}
          {/* The course is the crumb a reader actually needs when they landed
              here from search or a shared link: it is the page that says what
              this material is and in what order it is meant to be read. It
              was previously the one level of the hierarchy the breadcrumb
              skipped, even though `/courses/<slug>` is a real, statically
              generated route. */}
          {course ? (
            <>
              <span aria-hidden="true" className="tech-label text-subtle-foreground">
                /
              </span>
              <Link
                href={getCourseHref(course.slug)}
                className="tech-label inline-flex min-h-11 items-center rounded-(--radius-tight) text-muted-foreground transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
              >
                {course.title}
              </Link>
            </>
          ) : null}
        </nav>

        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
          <DifficultyScale difficulty={problem.meta.difficulty} />
          <TypeMark type={problem.meta.problemType} />
          <span className="tech-label">
            <span className="tech-value text-foreground">{problem.meta.estimatedMinutes}</span> min
          </span>
        </div>

        <SectionTitle level={1} size="xl" className="mt-6">
          {problem.meta.title}
        </SectionTitle>

        {/*
          "Can I attempt this yet?" — the same instrument a lesson answers it
          with, reused verbatim rather than re-implemented. The previous
          version listed prerequisite titles as a comma-separated line of
          links, which named what the problem assumes but said nothing about
          whether *this* reader already has it; a beginner arriving from the
          catalog, a search result or a shared link could only find out by
          opening each one. `PrerequisiteReadout` adds the missing half —
          per-prerequisite done/not-done (filled check vs. hollow ring, never
          color alone) plus an "N / M complete" readout — and its chips are
          already 44px tap targets. It reads client-side progress; nothing
          here gates or locks the problem, and a reader who wants to attempt
          something cold still can.
        */}
        {/* `id` so the "what does this build on?" route out of a wrong answer
            (`ProblemView`'s Next step block) can land the reader on this
            readout rather than only near it — `scroll-mt` keeps it clear of
            the sticky chrome. */}
        <div id={PREREQUISITE_ANCHOR_ID} className="scroll-mt-24">
          <PrerequisiteReadout prerequisites={prerequisites} />
        </div>

        {/* `min-w-0` + `ScrollableMathText`: problem prompts are plain strings
            with inline `$...$`, so they never pass through the MDX pipeline and
            never meet `rehypeKatexHtml`. Without this a long bra-ket or
            matrix run pushes the whole document sideways at 320px. */}
        <div className="mt-8 min-w-0 rounded-panel border border-border border-l-4 border-l-pillar-edge bg-surface-muted/60 p-6">
          <ScrollableMathText text={problem.question.prompt} className="text-lg leading-relaxed text-foreground" />
        </div>

        <div className="mt-8">{children}</div>

        {homeLesson ? (
          <>
            <FadeRule className="mt-14" />
            <div className="mt-8">
              <Link
                href={`/lessons/${homeLesson.slug}`}
                className="inline-flex min-h-11 items-center rounded-(--radius-tight) text-sm font-medium text-pillar-text hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
              >
                ← Back to &ldquo;{homeLesson.title}&rdquo;
              </Link>
            </div>
          </>
        ) : null}
      </Section>
    </PillarScope>
  );
}
