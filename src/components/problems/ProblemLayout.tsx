import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { MathText } from "@/components/ui/MathText";
import type { Problem, ProblemDifficulty, ProblemType } from "@/lib/problems/types";
import type { LessonMetaWithSlug } from "@/lib/content/types";

const DIFFICULTY_LABEL: Record<ProblemDifficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const TYPE_LABEL: Record<ProblemType, string> = {
  "multiple-choice": "Multiple Choice",
  numeric: "Numeric Answer",
  conceptual: "Short Answer",
};

/**
 * Everything about a problem page that doesn't need interactivity: the
 * breadcrumb, badges, title, prompt, prerequisite links, and a link back
 * to the home lesson. Server-rendered, same division of labor as
 * `LessonLayout` around an MDX lesson body — `children` is the one
 * interactive piece (`ProblemView`).
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

  return (
    <Container className="py-16">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/problems" className="hover:text-foreground">
          Problems
        </Link>
      </nav>

      <div className="mt-5 max-w-3xl">
        <div className="flex flex-wrap gap-2">
          <Badge tone="brand">{DIFFICULTY_LABEL[problem.meta.difficulty]}</Badge>
          <Badge>{problem.meta.estimatedMinutes} min</Badge>
          <Badge tone="accent">{TYPE_LABEL[problem.meta.problemType]}</Badge>
        </div>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{problem.meta.title}</h1>

        {prerequisites.length > 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Builds on:{" "}
            {prerequisites.map((lesson, index) => (
              <span key={lesson.slug}>
                {index > 0 ? ", " : ""}
                <Link href={`/lessons/${lesson.slug}`} className="text-brand hover:underline">
                  {lesson.title}
                </Link>
              </span>
            ))}
          </p>
        ) : null}

        <div className="mt-8 rounded-2xl border border-border bg-surface-muted/60 p-6">
          <MathText text={problem.question.prompt} className="text-lg leading-relaxed text-foreground" />
        </div>
      </div>

      <div className="mt-8 max-w-3xl">{children}</div>

      {homeLesson ? (
        <div className="mt-12 max-w-3xl border-t border-border pt-8">
          <Link
            href={`/lessons/${homeLesson.slug}`}
            className="text-sm font-medium text-brand hover:underline"
          >
            ← Back to &ldquo;{homeLesson.title}&rdquo;
          </Link>
        </div>
      ) : null}
    </Container>
  );
}
