"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eyebrow, Readouts, SectionTitle, TechValue } from "@/components/ui/Typography";
import { FadeRule } from "@/components/ui/Panel";
import { FilterChips, type FilterOption } from "@/components/curriculum/FilterChips";
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

/** The chips, in ramp order, each carrying how many courses it would leave —
 *  so a reader can see that "Master" holds four courses *before* clicking it,
 *  rather than clicking and then interpreting five empty pillars. */
const FILTER_OPTIONS: FilterOption<FilterValue>[] = [
  { id: "all", label: "All levels", count: COURSES.length },
  ...(Object.entries(DIFFICULTY_LABEL) as [Difficulty, string][])
    .sort(([a], [b]) => DIFFICULTY_RANK[a] - DIFFICULTY_RANK[b])
    .map(([id, label]) => ({
      id: id as FilterValue,
      label,
      count: COURSES.filter((course) => course.difficulty === id).length,
    })),
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
 * A filtered-to-zero pillar gets an empty-state line instead, and every
 * per-pillar "Courses" readout reports "N of TOTAL" once filtered rather
 * than a bare count that could read as the curriculum having shrunk.
 *
 * A "Jump to a pillar" nav sits in the same instrument as the difficulty
 * filter, grouped Core (Mechanics–Software) / Advanced (Mastery, Apex) —
 * a one-click way for a reader who already knows the basics to skip the
 * beginner scaffolding, and a plain-language restatement of the six-pillar
 * order for a reader who doesn't yet know the word "pillar." Only the first
 * pillar section renders `CourseTimeline`; the rest go straight to
 * `CourseList`, so Mastery and Apex read denser and more direct rather than
 * Mechanics with a different tint.
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
          {/* `aria-live` so a filter change is *announced*, not left as a
              silent number swap beside a chip that only changed color. The
              sentence is written to stand alone out of context, because that
              is exactly how a screen reader will deliver it. */}
          <span aria-live="polite" className="tech-value text-xs text-muted-foreground">
            <TechValue>{visibleCount}</TechValue> of {COURSES.length} courses
            {filter === "all" ? "" : ` · ${DIFFICULTY_LABEL[filter].toLowerCase()} only`}
          </span>
        </div>
        <div className="space-y-5 p-4 sm:p-5">
          <FilterChips
            label="Difficulty"
            options={FILTER_OPTIONS}
            selected={filter}
            onChange={setFilter}
            // The one-click way back. "All levels" is already the first chip,
            // but a reader who has scrolled into the pillars and is looking at
            // an empty section should not have to work out *which* control put
            // them there — so the escape is spelled out, in words, next to the
            // label, and only exists while there is something to escape from.
            action={
              filter === "all" ? undefined : (
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="inline-flex min-h-11 items-center rounded-full border border-border-strong px-3.5 text-sm font-medium text-foreground transition-colors duration-[--dur-fast] hover:border-pillar-edge hover:text-pillar-text"
                >
                  Show all {COURSES.length} courses
                </button>
              )
            }
          />

          {/* One-click jump for a reader who already knows the basics and
              wants Mastery or Apex without scrolling past four pillars of
              beginner scaffolding first — mission brief's "skip past ... in
              one action." Grouped by plain-language weight ("Core" /
              "Advanced"), not just pillar name, so the six-pillar
              progression reads as an order even to someone who doesn't
              know what a "pillar" is. */}
          <div>
            <p className="tech-label">Jump to a track</p>
            <nav aria-label="Jump to a track" className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-0.5 font-tech text-[0.65rem] uppercase tracking-wide text-subtle-foreground">
                  Core
                </span>
                {PILLAR_ORDER.slice(0, 4).map((slug, i) => (
                  <a
                    key={slug}
                    href={`#${slug}`}
                    data-pillar={slug}
                    className="inline-flex min-h-11 items-center rounded-full border border-border px-3 font-tech text-[0.7rem] uppercase tracking-wide text-muted-foreground transition-colors duration-[--dur-fast] hover:border-pillar-edge hover:text-pillar-text"
                  >
                    {i + 1}. {pillarVisual(slug).short}
                  </a>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="mr-0.5 font-tech text-[0.65rem] uppercase tracking-wide text-subtle-foreground">
                  Advanced
                </span>
                {PILLAR_ORDER.slice(4).map((slug, i) => (
                  <a
                    key={slug}
                    href={`#${slug}`}
                    data-pillar={slug}
                    className="inline-flex min-h-11 items-center rounded-full border border-border-strong px-3 font-tech text-[0.7rem] font-medium uppercase tracking-wide text-foreground transition-colors duration-[--dur-fast] hover:border-pillar-edge hover:text-pillar-text"
                  >
                    {i + 5}. {pillarVisual(slug).short}
                  </a>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-20">
        {sections.map(({ pillar, allCourses, filteredCourses, stats }, index) => {
          const visual = pillarVisual(pillar.slug);
          const depth = PILLAR_ORDER.indexOf(pillar.slug);
          const isFiltered = filteredCourses.length !== allCourses.length;
          // The first pillar carries the one `CourseTimeline` this page
          // shows — enough to teach "courses within a pillar have an order
          // and cross-pillar dependencies" once. Repeating it identically
          // six times was the exact "Apex looks like Mechanics with a
          // different tint" composition problem the brief calls out:
          // Mastery and Apex go straight to `CourseList`, which reads
          // denser and more direct, matching their place in the escalation.
          const showTimeline = index === 0;
          // A chapter break before Mastery: four "core" pillars, then a
          // named seam into the two advanced ones — the same escalation the
          // "Jump to a pillar" nav above groups as Core/Advanced, restated
          // here in the reading flow for anyone scrolling instead of
          // jumping.
          const isAdvancedTrackStart = index === 4;

          return (
            <section key={pillar.slug} id={pillar.slug} data-pillar={pillar.slug}>
              {isAdvancedTrackStart ? (
                <div className="mb-16 flex items-center gap-4">
                  <span className="whitespace-nowrap font-tech text-xs font-medium uppercase tracking-[0.14em] text-subtle-foreground">
                    Beyond the core curriculum
                  </span>
                  <FadeRule className="flex-1" />
                </div>
              ) : index > 0 ? (
                <FadeRule className="mb-16" />
              ) : null}

              <Eyebrow>
                Track {String(depth + 1).padStart(2, "0")} / {String(PILLARS.length).padStart(2, "0")}
              </Eyebrow>
              <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <SectionTitle level={2} size="md">
                  {pillar.title}
                </SectionTitle>
                <Link
                  href={visual.route}
                  className="text-sm font-medium text-pillar-text underline-offset-4 hover:underline"
                >
                  Full track page →
                </Link>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {pillar.description}
              </p>

              <Readouts
                className="mt-6"
                items={[
                  {
                    label: "Courses",
                    // Filtering never implies the pillar is smaller than it
                    // is: once a filter narrows the count, show it as
                    // "N of TOTAL" (matching the top instrument bar's own
                    // phrasing) rather than a bare, unqualified number.
                    value: isFiltered ? `${filteredCourses.length} of ${allCourses.length}` : filteredCourses.length,
                  },
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
                    {showTimeline ? <CourseTimeline courses={filteredCourses} lessons={lessons} /> : null}
                    <div className={showTimeline ? "mt-6" : undefined}>
                      <CourseList courses={filteredCourses} lessons={lessons} />
                    </div>
                  </>
                ) : (
                  // Written so it reads as a *result*, not a failure: it names
                  // the filter that produced it, says what this pillar does
                  // hold, and offers the way back. A bare "No courses" here
                  // reads as a broken page — this pillar plainly has courses,
                  // the reader just narrowed them away.
                  <p className="rounded-[var(--radius-panel)] border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                    {filter === "all" ? (
                      <>No courses in {pillar.title} yet.</>
                    ) : (
                      <>
                        None of {pillar.title}&rsquo;s {allCourses.length} course
                        {allCourses.length === 1 ? " is" : "s are"}{" "}
                        <span className="text-foreground">
                          {DIFFICULTY_LABEL[filter].toLowerCase()}
                        </span>
                        . Pick another level, or{" "}
                        <button
                          type="button"
                          onClick={() => setFilter("all")}
                          className="font-medium text-pillar-text underline underline-offset-4"
                        >
                          show all {COURSES.length} courses
                        </button>
                        .
                      </>
                    )}
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
