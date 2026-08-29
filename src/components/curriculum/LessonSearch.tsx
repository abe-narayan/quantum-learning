"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Panel } from "@/components/ui/Panel";
import { SearchShortcutHint } from "@/components/search/SearchShortcutHint";
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
          {/* `-my-4 py-4` is the touch-target fix, and it has to be padding
              cancelled by negative margin rather than `min-h-11`: this link is
              a baseline-aligned sibling of the `tech-label` beside it, so
              giving it a 44px content box would drop it off that baseline and
              shove the row open. Padding grows the hit area to ~46px in every
              direction the finger cares about; the negative margin hands the
              layout back its original box, so nothing moves. The band this
              overlaps below belongs to the search field's `relative` wrapper,
              which is positioned and therefore paints (and hit-tests) above
              this static box — the input keeps its own clicks. */}
          <Link
            href="/lessons"
            className="-my-4 py-4 font-tech text-[0.7rem] uppercase tracking-wide text-pillar-text underline-offset-4 hover:underline"
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
            // `.input-instrument` (globals.css §8) carries the shared field
            // identity — tight radius (no more SaaS pill), border, surface
            // fill, placeholder voice; only sizing stays here.
            // `text-base` below `sm` (like AnswerInput): iOS Safari zooms the
            // whole page on focusing any field under 16px.
            className="input-instrument w-full px-4 py-3 pr-11 text-base sm:text-sm"
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

      {/* Mounted from first paint, exactly like Feedback.tsx's status
          wrapper: a live region inserted into the DOM at the same moment it
          gains content is unreliably announced — several screen reader /
          browser pairs only observe mutations inside regions that were
          already present. So the element always exists and only its
          *contents* (and margin) change once the visitor types. */}
      <p
        role="status"
        aria-live="polite"
        className={trimmed ? "mt-8 font-tech text-xs uppercase tracking-wide text-subtle-foreground" : undefined}
      >
        {trimmed ? (
          <>
            {results.length} lesson{results.length === 1 ? "" : "s"} matching &ldquo;{query.trim()}&rdquo;
          </>
        ) : null}
      </p>

      {trimmed ? (
        <div>
          {results.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {results.map((lesson) => {
                const course = getCourse(lesson.course);
                const pillar = course ? getPillar(course.pillar) : undefined;
                return (
                  // The anchor wraps the whole card, so without an explicit
                  // name its computed accessible name is every string inside
                  // it concatenated: the title, then a full sentence of
                  // description, then "Advanced", then the course title, then
                  // the pillar. A screen-reader user arrowing through twenty
                  // results hears twenty paragraphs where they wanted twenty
                  // link names. This is the same fix, for the same reason, that
                  // `CourseTimeline` applies to its station links — the label
                  // carries the title plus the one disambiguator (which course
                  // it belongs to, since lesson titles repeat across pillars),
                  // and everything else stays readable in browse mode.
                  <Link
                    key={lesson.slug}
                    href={`/lessons/${lesson.slug}`}
                    aria-label={course ? `${lesson.title} — ${course.title}` : lesson.title}
                    className="group block h-full"
                  >
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
            // Every other zero-result state on the site ends in somewhere to
            // go (SearchOverlay's three routes, GlossaryFilter's map link,
            // CurriculumExplorer's "show all courses" button); this one was
            // the exception, a full stop with nothing after it. A reader who
            // searched a word the catalog does not use — "entanglement" is in
            // lesson *bodies*, not in every title this matches on — got a
            // dead end on the page whose entire job is to get them into a
            // lesson. The three ways out are deliberately different moves:
            // widen the same search, drop the filter entirely, or look the
            // word up rather than search for it.
            <div className="mt-8 text-sm text-muted-foreground">
              <p>
                No lesson title or description contains &ldquo;{query.trim()}&rdquo;. This box only
                matches those two fields, so a term covered inside a lesson can still be missing
                here.
              </p>
              <p className="mt-2">
                Search the full text of every lesson, problem and simulator with{" "}
                <SearchShortcutHint />, browse{" "}
                <button
                  type="button"
                  onClick={clear}
                  className="font-medium text-pillar-text underline underline-offset-4"
                >
                  all {lessons.length} lessons
                </button>
                , or look the term up in the{" "}
                <Link
                  href="/glossary"
                  className="text-pillar-text underline decoration-pillar-edge underline-offset-4 hover:decoration-pillar"
                >
                  glossary
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-14">{children}</div>
      )}
    </div>
  );
}
