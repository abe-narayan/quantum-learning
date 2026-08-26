"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eyebrow, Readouts, SectionTitle, TechValue } from "@/components/ui/Typography";
import { FadeRule } from "@/components/ui/Panel";
import { ProblemFilters } from "@/components/problems/ProblemFilters";
import { CourseList } from "@/components/curriculum/CourseList";
import { CourseTimeline } from "@/components/curriculum/CourseTimeline";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { COURSES, PILLARS, getCoursesByPillar } from "@/lib/content/curriculum";
import { PILLAR_ORDER, pillarVisual } from "@/lib/design/pillars";
import { DIFFICULTY_LABEL, type Course, type Difficulty, type LessonMetaWithSlug } from "@/lib/content/types";

// Ranking only — for sorting/comparing `Difficulty` values, not for its text.
// The label itself comes from the shared `DIFFICULTY_LABEL` above (see
// docs/UX_REVIEW.md P1-1 — this file used to hand-copy that map too).
const DIFFICULTY_RANK: Record<Difficulty, number> = {
  foundational: 0,
  intermediate: 1,
  advanced: 2,
  master: 3,
};

type FilterValue = "all" | Difficulty;

const FILTER_OPTIONS: { id: FilterValue; label: string }[] = [
  { id: "all", label: "All" },
  ...(Object.entries(DIFFICULTY_LABEL) as [Difficulty, string][])
    .sort(([a], [b]) => DIFFICULTY_RANK[a] - DIFFICULTY_RANK[b])
    .map(([id, label]) => ({ id, label })),
];

function pillarStats(courses: Course[], lessons: LessonMetaWithSlug[]) {
  const courseSlugs = new Set(courses.map((course) => course.slug));
  const totalModules = courses.reduce((sum, course) => sum + course.modules.length, 0);
  const authoredLessons = lessons.filter((lesson) => courseSlugs.has(lesson.course)).length;
  const totalHours = courses.reduce((sum, course) => sum + course.estimatedHours, 0);
  // The actual min/max `Difficulty` values, not a synthesized text range —
  // rendered as real `DifficultyMark` ticks below instead of an arrow-joined
  // string. See docs/UX_REVIEW.md P0-3: this was previously the one place on
  // the site showing difficulty with no ticks at all.
  const difficulties = Array.from(new Set(courses.map((course) => course.difficulty))).sort(
    (a, b) => DIFFICULTY_RANK[a] - DIFFICULTY_RANK[b]
  );

  return { totalModules, authoredLessons, totalHours, difficulties };
}

/**
 * The pillar-by-pillar catalog: `LessonSearch`'s `children` when no search
 * query is active. A client component (not the page itself) because the
 * difficulty filter needs interactive state — everything it filters
 * (`PILLARS`/`COURSES` via `getCoursesByPillar`) is plain data, safe to
 * import directly rather than threading it all through props.
 *
 * All six pillar sections stay mounted regardless of the filter — hiding a
 * whole pillar because none of its courses match today's difficulty pick
 * would break the "progression across six pillars" the page exists to show.
 * A filtered-to-zero pillar gets an empty-state line instead.
 */
export function CurriculumExplorer({ lessons }: { lessons: LessonMetaWithSlug[] }) {
  const [filter, setFilter] = useState<FilterValue>("all");

  const sections = useMemo(
    () =>
      PILLARS.map((pillar) => {
        const allCourses = getCoursesByPillar(pillar.slug);
        const filteredCourses =
          filter === "all" ? allCourses : allCourses.filter((course) => course.difficulty === filter);
        return { pillar, allCourses, filteredCourses, stats: pillarStats(allCourses, lessons) };
      }),
    [filter, lessons]
  );
  const visibleCount = sections.reduce((sum, section) => sum + section.filteredCourses.length, 0);

  return (
    <div>
      <div className="instrument overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5 sm:px-5">
          <span className="tech-label">Scan the curriculum</span>
          <span className="tech-value text-xs text-muted-foreground">
            <TechValue>{visibleCount}</TechValue> of {COURSES.length} courses
          </span>
        </div>
        <div className="p-4 sm:p-5">
          <ProblemFilters label="Difficulty" options={FILTER_OPTIONS} selected={filter} onChange={setFilter} />
        </div>
      </div>

      <div className="mt-12 space-y-20">
        {sections.map(({ pillar, filteredCourses, stats }, index) => {
          const visual = pillarVisual(pillar.slug);
          const depth = PILLAR_ORDER.indexOf(pillar.slug);

          return (
            <section key={pillar.slug} id={pillar.slug} data-pillar={pillar.slug}>
              {index > 0 ? <FadeRule className="mb-16" /> : null}

              <Eyebrow>
                Pillar {String(depth + 1).padStart(2, "0")} / {String(PILLARS.length).padStart(2, "0")}
              </Eyebrow>
              <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <SectionTitle level={2} size="md">
                  {pillar.title}
                </SectionTitle>
                <Link
                  href={visual.route}
                  className="text-sm font-medium text-pillar-text underline-offset-4 hover:underline"
                >
                  Full pillar page →
                </Link>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>

              <Readouts
                className="mt-6"
                items={[
                  { label: "Courses", value: filteredCourses.length },
                  { label: "Modules", value: stats.totalModules },
                  { label: "Lessons authored", value: stats.authoredLessons },
                  { label: "Curriculum length", value: stats.totalHours, unit: "h" },
                  {
                    label: "Range",
                    value:
                      stats.difficulties.length === 0 ? (
                        "—"
                      ) : (
                        <span className="flex flex-wrap items-center gap-2">
                          <DifficultyMark difficulty={stats.difficulties[0]} />
                          {stats.difficulties.length > 1 ? (
                            <>
                              <span aria-hidden="true" className="text-subtle-foreground">
                                →
                              </span>
                              <DifficultyMark difficulty={stats.difficulties[stats.difficulties.length - 1]} />
                            </>
                          ) : null}
                        </span>
                      ),
                  },
                ]}
              />

              <div className="mt-8">
                {filteredCourses.length > 0 ? (
                  <>
                    <CourseTimeline courses={filteredCourses} lessons={lessons} />
                    <div className="mt-6">
                      <CourseList courses={filteredCourses} lessons={lessons} />
                    </div>
                  </>
                ) : (
                  <p className="rounded-[var(--radius-panel)] border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                    No {filter === "all" ? "" : `${DIFFICULTY_LABEL[filter].toLowerCase()} `}courses in{" "}
                    {pillar.title} yet — try a different level, or{" "}
                    <button
                      type="button"
                      onClick={() => setFilter("all")}
                      className="font-medium text-pillar-text underline-offset-4 hover:underline"
                    >
                      clear the filter
                    </button>
                    .
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
