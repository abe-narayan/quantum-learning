"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getCourse, getPillar } from "@/lib/content/curriculum";
import type { Difficulty, LessonMetaWithSlug } from "@/lib/content/types";

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  foundational: "Foundational",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/**
 * Client-side search over the full lesson catalog. Filters on a simple
 * case-insensitive substring match across each lesson's title and
 * description. While the search box is empty, renders `children` (the
 * normal course-by-course catalog) unchanged; once the visitor types
 * something, it swaps in a flat list of matching lessons instead.
 */
export function LessonSearch({
  lessons,
  children,
}: {
  lessons: LessonMetaWithSlug[];
  children: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!trimmed) return [];
    return lessons.filter((lesson) => {
      const haystack = `${lesson.title} ${lesson.description}`.toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [lessons, trimmed]);

  return (
    <div>
      <div className="max-w-md">
        <label
          htmlFor="lesson-search"
          className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
        >
          Search lessons
        </label>
        <input
          id="lesson-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by title or description…"
          className="mt-2 w-full rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        />
      </div>

      {trimmed ? (
        <div className="mt-8">
          <p className="text-sm text-muted-foreground">
            {results.length} lesson{results.length === 1 ? "" : "s"} matching &ldquo;{query.trim()}&rdquo;
          </p>

          {results.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {results.map((lesson) => {
                const course = getCourse(lesson.course);
                const pillar = course ? getPillar(course.pillar) : undefined;
                return (
                  <Link key={lesson.slug} href={`/lessons/${lesson.slug}`} className="group block h-full">
                    <Card className="h-full transition-colors group-hover:border-brand/40 group-hover:bg-surface-muted">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-base font-semibold text-foreground group-hover:text-brand">
                          {lesson.title}
                        </h3>
                        <Badge tone="brand">{DIFFICULTY_LABEL[lesson.difficulty]}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{lesson.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        {course ? <span>{course.title}</span> : null}
                        {pillar ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <Badge>{pillar.title}</Badge>
                          </>
                        ) : null}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="mt-8 text-sm text-muted-foreground">No lessons match &ldquo;{query.trim()}&rdquo;.</p>
          )}
        </div>
      ) : (
        <div className="mt-14">{children}</div>
      )}
    </div>
  );
}
