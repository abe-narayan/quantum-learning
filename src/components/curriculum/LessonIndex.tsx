"use client";

import Link from "next/link";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Instrument } from "@/components/ui/Panel";
import { Eyebrow, SectionTitle, TechValue } from "@/components/ui/Typography";
import { DifficultyMark } from "./DifficultyMark";
import { FilterChips, type FilterOption } from "./FilterChips";
import { LessonCompletionMark } from "./LessonCompletionMark";
import { getCourseHref } from "./courseHref";
import { COURSES, PILLARS } from "@/lib/content/curriculum";
import { PILLAR_ORDER } from "@/lib/design/pillars";
import {
  DIFFICULTY_LABEL,
  type Difficulty,
  type LessonMetaWithSlug,
  type Pillar,
} from "@/lib/content/types";

/**
 * ============================================================
 * LessonIndex — the escape hatch from the curriculum structure
 * ============================================================
 * `/learn` answers "what is the right order?" This answers "just show me
 * everything." It is the page a beginner lands on when the six-pillar
 * progression is more structure than they can hold, and the page an advanced
 * reader uses to find one specific lesson without caring which course owns it.
 *
 * So the shape is a flat, complete, filterable manifest rather than a second
 * curriculum view:
 *
 *   - **Every authored lesson is on the page**, grouped pillar → course, in
 *     real curriculum order (`PILLAR_ORDER`, then `COURSES` order, then module
 *     order). Grouping is what keeps a 200-row list navigable; it is not a
 *     second attempt at teaching the progression.
 *   - **Every row carries its own context** — the lesson title, its course
 *     (as the group header, and the course link beside it), its difficulty as
 *     a real `DifficultyMark`, its length, and the visitor's own completion
 *     mark. Nothing about a row requires reading a different part of the page.
 *   - **Search and both filters compose**, and the counts on every chip are
 *     computed against the *other* active constraints, so a chip showing `0`
 *     is telling the truth about what choosing it would do.
 *   - **Rows are `min-h-11`.** A 200-row list of 30px rows is the worst
 *     touch-target offender a site can have.
 *
 * Deliberately not virtualised and deliberately not paginated: the full list
 * is in the server-rendered HTML, so Ctrl-F works, the page is crawlable, and
 * a reader with JS off still gets every lesson as a link.
 */

type PillarFilter = "all" | Pillar;
type DifficultyFilter = "all" | Difficulty;

const DIFFICULTY_RANK: Record<Difficulty, number> = {
  foundational: 0,
  intermediate: 1,
  advanced: 2,
  master: 3,
};

/** Course slug → its pillar and its position in the global curriculum order. */
const COURSE_INDEX = new Map(
  COURSES.map((course, index) => [course.slug, { course, order: index }] as const)
);

type Row = {
  lesson: LessonMetaWithSlug;
  pillar: Pillar;
  courseSlug: string;
  courseTitle: string;
  /** Sort key: pillar order, then course order, then module order. */
  sort: [number, number, number, number];
};

function buildRows(lessons: LessonMetaWithSlug[]): Row[] {
  const rows: Row[] = [];
  for (const lesson of lessons) {
    const entry = COURSE_INDEX.get(lesson.course);
    if (!entry) continue;
    const moduleOrder = entry.course.modules.findIndex((m) => m.slug === lesson.module);
    rows.push({
      lesson,
      pillar: entry.course.pillar,
      courseSlug: entry.course.slug,
      courseTitle: entry.course.title,
      sort: [
        PILLAR_ORDER.indexOf(entry.course.pillar),
        entry.order,
        moduleOrder === -1 ? Number.MAX_SAFE_INTEGER : moduleOrder,
        lesson.order,
      ],
    });
  }
  return rows.sort((a, b) => {
    for (let i = 0; i < a.sort.length; i++) {
      if (a.sort[i] !== b.sort[i]) return a.sort[i] - b.sort[i];
    }
    return a.lesson.title.localeCompare(b.lesson.title);
  });
}

/**
 * Module scope, and taking `trimmed` as an argument rather than closing over
 * it, for two separate reasons that pull the same way:
 *
 * - As a `useMemo` returning a closure it bailed the whole component out of
 *   React Compiler optimisation ("Compilation Skipped: Existing memoization
 *   could not be preserved") — a far larger cost than the allocation it saved.
 * - As a function defined during render it was a new identity every render,
 *   so `react-hooks/exhaustive-deps` wanted it in three dependency arrays,
 *   where it would have invalidated all three memos on every keystroke.
 *
 * Hoisted and parameterised, it is stable, uncached and free.
 */
function matchesQuery(row: Row, trimmed: string): boolean {
  if (!trimmed) return true;
  return `${row.lesson.title} ${row.lesson.description} ${row.courseTitle}`
    .toLowerCase()
    .includes(trimmed);
}

export function LessonIndex({ lessons }: { lessons: LessonMetaWithSlug[] }) {
  const [query, setQuery] = useState("");
  const [pillar, setPillar] = useState<PillarFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchId = useId();

  const allRows = useMemo(() => buildRows(lessons), [lessons]);
  const trimmed = query.trim().toLowerCase();



  const rows = useMemo(
    () =>
      allRows.filter(
        (row) =>
          matchesQuery(row, trimmed) &&
          (pillar === "all" || row.pillar === pillar) &&
          (difficulty === "all" || row.lesson.difficulty === difficulty)
      ),
    [allRows, trimmed, pillar, difficulty]
  );

  // Chip counts are computed against every *other* active constraint, so
  // "Hardware 0" means "0 given what else you've picked", which is the only
  // useful reading of that number.
  const pillarOptions: FilterOption<PillarFilter>[] = useMemo(() => {
    const base = allRows.filter(
      (row) => matchesQuery(row, trimmed) && (difficulty === "all" || row.lesson.difficulty === difficulty)
    );
    return [
      { id: "all", label: "All tracks", count: base.length },
      ...PILLAR_ORDER.map((slug) => ({
        id: slug as PillarFilter,
        label: PILLARS.find((p) => p.slug === slug)?.title ?? slug,
        count: base.filter((row) => row.pillar === slug).length,
      })),
    ];
  }, [allRows, trimmed, difficulty]);

  const difficultyOptions: FilterOption<DifficultyFilter>[] = useMemo(() => {
    const base = allRows.filter(
      (row) => matchesQuery(row, trimmed) && (pillar === "all" || row.pillar === pillar)
    );
    return [
      { id: "all", label: "Any level", count: base.length },
      ...(Object.entries(DIFFICULTY_LABEL) as [Difficulty, string][])
        .sort(([a], [b]) => DIFFICULTY_RANK[a] - DIFFICULTY_RANK[b])
        .map(([id, label]) => ({
          id: id as DifficultyFilter,
          label,
          count: base.filter((row) => row.lesson.difficulty === id).length,
        })),
    ];
  }, [allRows, trimmed, pillar]);

  // Grouped for rendering: pillar → course → rows, preserving the sort above.
  const groups = useMemo(() => {
    const byPillar = new Map<Pillar, Map<string, { title: string; rows: Row[] }>>();
    for (const row of rows) {
      let courses = byPillar.get(row.pillar);
      if (!courses) {
        courses = new Map();
        byPillar.set(row.pillar, courses);
      }
      let course = courses.get(row.courseSlug);
      if (!course) {
        course = { title: row.courseTitle, rows: [] };
        courses.set(row.courseSlug, course);
      }
      course.rows.push(row);
    }
    return [...byPillar.entries()].map(([slug, courses]) => ({
      slug,
      title: PILLARS.find((p) => p.slug === slug)?.title ?? slug,
      index: PILLAR_ORDER.indexOf(slug),
      courses: [...courses.entries()].map(([courseSlug, course]) => ({ courseSlug, ...course })),
    }));
  }, [rows]);

  const isFiltered = Boolean(trimmed) || pillar !== "all" || difficulty !== "all";

  function clearAll() {
    setQuery("");
    setPillar("all");
    setDifficulty("all");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape" && query) {
      event.stopPropagation();
      setQuery("");
    }
  }

  const clearButton = (
    <button
      type="button"
      onClick={clearAll}
      className="inline-flex min-h-11 items-center rounded-full border border-border-strong px-3.5 text-sm font-medium text-foreground transition-colors duration-[--dur-fast] hover:border-pillar-edge hover:text-pillar-text"
    >
      Show all {allRows.length} lessons
    </button>
  );

  return (
    <div>
      <Instrument
        label="Find a lesson"
        readout={
          // `aria-live` so changing a filter is announced, not left as a
          // silent number change next to a chip that only changed color.
          <span aria-live="polite" className="font-tech text-xs text-muted-foreground">
            <TechValue>{rows.length}</TechValue> of {allRows.length} lessons
          </span>
        }
      >
        <div className="space-y-5">
          <div className="max-w-md">
            <label htmlFor={searchId} className="tech-label">
              Search by title, description or course
            </label>
            <div className="relative mt-2">
              <input
                ref={inputRef}
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="entanglement, error correction, Shor…"
                className="w-full rounded-full border border-border bg-surface px-4 py-3 pr-11 text-sm text-foreground placeholder:text-subtle-foreground"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-subtle-foreground hover:text-foreground"
                >
                  <svg aria-hidden="true" data-decorative="" viewBox="0 0 16 16" className="h-3.5 w-3.5">
                    <path d="M4 4 L12 12 M12 4 L4 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
              ) : null}
            </div>
          </div>

          <FilterChips
            label="Track"
            options={pillarOptions}
            selected={pillar}
            onChange={setPillar}
          />
          <FilterChips
            label="Level"
            options={difficultyOptions}
            selected={difficulty}
            onChange={setDifficulty}
            action={isFiltered ? clearButton : undefined}
          />
        </div>
      </Instrument>

      {rows.length === 0 ? (
        <p className="mt-10 rounded-[var(--radius-panel)] border border-dashed border-border px-5 py-8 text-sm text-muted-foreground">
          No lesson matches those constraints yet. Widen the level or the pillar — or{" "}
          <button
            type="button"
            onClick={clearAll}
            className="font-medium text-pillar-text underline underline-offset-4"
          >
            show all {allRows.length} lessons
          </button>
          .
        </p>
      ) : (
        <div className="mt-12 space-y-14">
          {groups.map((group) => (
            <section key={group.slug} data-pillar={group.slug} aria-labelledby={`group-${group.slug}`}>
              <Eyebrow>
                Track {String(group.index + 1).padStart(2, "0")} /{" "}
                {String(PILLARS.length).padStart(2, "0")}
              </Eyebrow>
              <SectionTitle level={2} size="sm" id={`group-${group.slug}`} className="mt-2">
                {group.title}
              </SectionTitle>

              <div className="mt-6 space-y-8">
                {group.courses.map((course) => (
                  <div key={course.courseSlug}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border pb-2">
                      <h3 className="font-display text-base font-semibold text-foreground">
                        {course.title}
                      </h3>
                      <Link
                        href={getCourseHref(course.courseSlug, course.rows[0]?.lesson.slug)}
                        className="font-tech text-[0.7rem] uppercase tracking-wide text-pillar-text underline-offset-4 hover:underline"
                      >
                        Course overview →
                      </Link>
                    </div>
                    <ul className="mt-1">
                      {course.rows.map((row) => (
                        <li key={row.lesson.slug}>
                          <Link
                            href={`/lessons/${row.lesson.slug}`}
                            className="group flex min-h-11 flex-wrap items-center gap-x-4 gap-y-1 rounded-[--radius-tight] px-2.5 py-2 transition-colors duration-[--dur-fast] ease-[--ease-mech] hover:bg-surface-muted focus-visible:bg-surface-muted"
                          >
                            <span className="flex min-w-0 flex-1 items-center gap-2.5">
                              <LessonCompletionMark slug={row.lesson.slug} />
                              <span className="min-w-0 text-sm text-foreground group-hover:text-pillar-text">
                                {row.lesson.title}
                              </span>
                            </span>
                            <span className="flex shrink-0 items-center gap-4">
                              <DifficultyMark difficulty={row.lesson.difficulty} />
                              <span className="w-14 text-right font-tech text-[0.65rem] tabular-nums text-subtle-foreground">
                                {row.lesson.estimatedMinutes} min
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
