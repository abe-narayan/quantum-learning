import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { PILLARS } from "@/lib/content/curriculum";
import type { Course, LessonMeta } from "@/lib/content/types";

const DIFFICULTY_LABEL: Record<LessonMeta["difficulty"], string> = {
  foundational: "Foundational",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function LessonLayout({
  meta,
  course,
  children,
}: {
  meta: LessonMeta;
  course: Course | undefined;
  children: ReactNode;
}) {
  const pillar = course ? PILLARS.find((p) => p.slug === course.pillar) : undefined;

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

      <div className="mt-6 max-w-3xl">
        <div className="flex flex-wrap gap-2">
          <Badge tone="brand">{DIFFICULTY_LABEL[meta.difficulty]}</Badge>
          <Badge>{meta.estimatedMinutes} min</Badge>
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {meta.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{meta.description}</p>

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
    </Container>
  );
}
