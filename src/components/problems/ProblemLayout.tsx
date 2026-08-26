import type { ReactNode } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/Typography";
import { FadeRule } from "@/components/ui/Panel";
import { PillarScope } from "@/components/field/PillarScope";
import { MathText } from "@/components/ui/MathText";
import { getCourse, getPillar } from "@/lib/content/curriculum";
import { DifficultyScale, TypeMark } from "./ProblemMetaMarks";
import type { Problem } from "@/lib/problems/types";
import type { LessonMetaWithSlug } from "@/lib/content/types";

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
          <Link href="/problems" className="tech-label text-muted-foreground transition-colors hover:text-foreground">
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

        {prerequisites.length > 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Builds on:{" "}
            {prerequisites.map((lesson, index) => (
              <span key={lesson.slug}>
                {index > 0 ? ", " : ""}
                <Link href={`/lessons/${lesson.slug}`} className="text-pillar-text hover:underline">
                  {lesson.title}
                </Link>
              </span>
            ))}
          </p>
        ) : null}

        <div className="mt-8 rounded-[--radius-panel] border border-border border-l-4 border-l-pillar-edge bg-surface-muted/60 p-6">
          <MathText text={problem.question.prompt} className="text-lg leading-relaxed text-foreground" />
        </div>

        <div className="mt-8">{children}</div>

        {homeLesson ? (
          <>
            <FadeRule className="mt-14" />
            <div className="mt-8">
              <Link href={`/lessons/${homeLesson.slug}`} className="text-sm font-medium text-pillar-text hover:underline">
                ← Back to &ldquo;{homeLesson.title}&rdquo;
              </Link>
            </div>
          </>
        ) : null}
      </Section>
    </PillarScope>
  );
}
