"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Panel } from "@/components/ui/Panel";
import { DifficultyMark } from "./DifficultyMark";
import { getCourse, getPillar } from "@/lib/content/curriculum";
import type { LessonMetaWithSlug } from "@/lib/content/types";

/**
 * Client-side search over the full lesson catalog. Filters on a simple
 * case-insensitive substring match across each lesson's title and
 * description. While the search box is empty, renders `children` (the
 * normal course-by-course catalog) unchanged; once the visitor types
 * something, it swaps in a flat list of matching lessons instead.
 *
 * Styled as an instrument control — a technical-voice label, a monospaced
 * readout of the match count, a keyboard-reachable clear affordance — and
 * Escape clears the query from anywhere in the field, matching the
 * close-on-Escape contract every other disclosure in the app follows
 * (see Navbar's dropdowns).
 */
export function LessonSearch({
  lessons,
  children,
}: {
  lessons: LessonMetaWithSlug[];
  children: ReactNode;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const trimmed = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!trimmed) return [];
    return lessons.filter((lesson) => {
      const haystack = `${lesson.title} ${lesson.description}`.toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [lessons, trimmed]);

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape" && query) {
      event.stopPropagation();
      setQuery("");
    }
  }

  function clear() {
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div>
      <div className="max-w-md">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <label htmlFor="lesson-search" className="tech-label">
            Search lessons
          </label>
          {/* The escape hatch, offered *before* the reader has to fail at
              searching. Search only helps someone who already knows the word
              they want; a beginner frequently does not, and the honest answer
              for them is "here is the whole list." */}
          <Link
            href="/lessons"
            className="font-tech text-[0.7rem] uppercase tracking-wide text-pillar-text underline-offset-4 hover:underline"
          >
            Browse all {lessons.length} →
          </Link>
        </div>
        <div className="relative mt-2">
          <input
            ref={inputRef}
            id="lesson-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by title or description…"
            className="w-full rounded-full border border-border bg-surface px-4 py-3 pr-11 text-sm text-foreground placeholder:text-subtle-foreground"
          />
          {query ? (
            // `w-11` (44px), flush with the input's full height via `inset-y-0`,
            // rather than a visually-sized icon button — the × glyph stays
            // small but the tappable area meets the 44px touch-target minimum.
            <button
              type="button"
              onClick={clear}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-subtle-foreground hover:text-foreground"
            >
              <svg aria-hidden="true" data-decorative="" viewBox="0 0 16 16" className="h-3.5 w-3.5">
                <path
                  d="M4 4 L12 12 M12 4 L4 12"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {trimmed ? (
        <div className="mt-8">
          <p className="font-tech text-xs uppercase tracking-wide text-subtle-foreground">
            {results.length} lesson{results.length === 1 ? "" : "s"} matching &ldquo;{query.trim()}&rdquo;
          </p>

          {results.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {results.map((lesson) => {
                const course = getCourse(lesson.course);
                const pillar = course ? getPillar(course.pillar) : undefined;
                return (
                  <Link key={lesson.slug} href={`/lessons/${lesson.slug}`} className="group block h-full">
                    <Panel interactive className="h-full p-5">
                      <h3 className="text-base font-semibold text-foreground group-hover:text-pillar-text">
                        {lesson.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">{lesson.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2.5">
                        <DifficultyMark difficulty={lesson.difficulty} />
                        {course ? (
                          <span className="font-tech text-[0.65rem] uppercase tracking-wide text-subtle-foreground">
                            {course.title}
                          </span>
                        ) : null}
                        {pillar ? (
                          <span className="rounded-full border border-pillar-edge px-2 py-0.5 font-tech text-[0.6rem] uppercase tracking-wide text-pillar-text">
                            {pillar.title}
                          </span>
                        ) : null}
                      </div>
                    </Panel>
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
