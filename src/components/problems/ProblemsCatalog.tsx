"use client";

import { useMemo, useState } from "react";
import { ProblemFilters } from "./ProblemFilters";
import { ProblemCard, ProblemRow } from "./ProblemCard";
import { getCourse, COURSES } from "@/lib/content/curriculum";
import { useProblemsProgress } from "@/lib/problems/progress";
import { useCompletedLessonSlugs } from "@/lib/content/progress";
import { Eyebrow, Readouts, SectionTitle, TechValue } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { PILLAR_ORDER, pillarVisual } from "@/lib/design/pillars";
import { DIFFICULTY_LABEL, type Pillar } from "@/lib/content/types";
import { PROBLEM_TO_DIFFICULTY } from "@/lib/problems/types";
import { DifficultyScale, TypeMark } from "./ProblemMetaMarks";
import { cn } from "@/lib/utils";
import type { ProblemProgress } from "@/lib/problems/progress";
import type { ProblemDifficulty, ProblemMeta, ProblemType } from "@/lib/problems/types";

type PillarFilter = "all" | Pillar;
type DifficultyFilter = "all" | ProblemDifficulty;
type TypeFilter = "all" | ProblemType;

const PILLAR_OPTIONS: { id: PillarFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "quantum-mechanics", label: "Quantum Mechanics" },
  { id: "quantum-computing", label: "Quantum Computing" },
  { id: "quantum-hardware", label: "Quantum Hardware" },
  { id: "quantum-software", label: "Quantum Software" },
  { id: "quantum-mastery", label: "Quantum Mastery" },
  { id: "apex", label: "Apex" },
];

// Labels are read through the shared `DIFFICULTY_LABEL` (translating each
// `ProblemDifficulty` onto the curriculum's `Difficulty` first via
// `PROBLEM_TO_DIFFICULTY`) rather than a local copy, so a filter chip never
// disagrees with what `DifficultyMark` renders on the cards it filters —
// "beginner" reads "Foundational" here exactly as it does on every card.
// `master` is included so the site's hardest practice problems (Apex and
// Quantum Mastery, promoted from `advanced`) are reachable by filter, not
// only via "All". See docs/UX_REVIEW.md P0-3/P1-1.
const DIFFICULTY_OPTIONS: { id: DifficultyFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "beginner", label: DIFFICULTY_LABEL[PROBLEM_TO_DIFFICULTY.beginner] },
  { id: "intermediate", label: DIFFICULTY_LABEL[PROBLEM_TO_DIFFICULTY.intermediate] },
  { id: "advanced", label: DIFFICULTY_LABEL[PROBLEM_TO_DIFFICULTY.advanced] },
  { id: "master", label: DIFFICULTY_LABEL[PROBLEM_TO_DIFFICULTY.master] },
];

const TYPE_OPTIONS: { id: TypeFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "multiple-choice", label: "Multiple Choice" },
  { id: "numeric", label: "Numeric" },
  { id: "conceptual", label: "Short Answer" },
];

/** A small pillar-hued dot for the topic filter row. Wrapped in its own
 *  `data-pillar` so it resolves that pillar's color regardless of the
 *  page's own (pillar-less) scope — see globals.css §2. */
function pillarIndicator(id: PillarFilter) {
  if (id === "all") return null;
  return <span data-pillar={id} className="h-2 w-2 rounded-full bg-pillar-accent" aria-hidden="true" />;
}

/** Curriculum order (mechanics → apex, courses in authored order within each
 *  pillar) — the same ordering `COURSES` is already declared in. Used to
 *  sort problems for display and to rank recommendation candidates, so
 *  neither the row list nor "pick up where you left off" ever contradicts
 *  the progression the rest of the site teaches in. */
const COURSE_ORDER_INDEX = new Map(COURSES.map((course, index) => [course.slug, index]));

function sortByCourseOrder(items: ProblemMeta[]): ProblemMeta[] {
  return [...items].sort((a, b) => {
    const ca = COURSE_ORDER_INDEX.get(a.course) ?? Number.MAX_SAFE_INTEGER;
    const cb = COURSE_ORDER_INDEX.get(b.course) ?? Number.MAX_SAFE_INTEGER;
    return ca - cb;
  });
}

/** Splits a group into the small `master`-tier subset (rendered as feature
 *  `ProblemCard`s) and everything else (rendered as dense `ProblemRow`s) —
 *  see docs/DESIGN_SYSTEM.md §5: density should vary with meaning, not stay
 *  uniform across a foundational warm-up and the site's hardest problems.
 *  Only two of the six pillars (Quantum Mastery, Apex) currently have any
 *  `master`-tier problems, so this alone gives pillar sections genuinely
 *  different shapes rather than the same grid retinted. */
function splitFeatured(items: ProblemMeta[]): { featured: ProblemMeta[]; rest: ProblemMeta[] } {
  return {
    featured: items.filter((problem) => problem.difficulty === "master"),
    rest: items.filter((problem) => problem.difficulty !== "master"),
  };
}

type Recommendation = { problem: ProblemMeta; resumed: boolean };

/**
 * "If I only practice one thing next, what should it be?" — derived from
 * two real, already-persisted sources, mirroring the reasoning
 * `/learn`'s `RecommendedNext` applies at course grain (see that
 * component for the pattern this deliberately does NOT reuse: it operates
 * on course/lesson completion to unlock a *course*, while this operates on
 * a problem's own `prerequisites` — authored lesson slugs, see
 * `lib/problems/types.ts` — plus this catalog's own solved state to surface
 * a *problem*).
 *
 * A candidate must have at least one prerequisite lesson (so this never
 * recommends an already-available, no-prerequisite problem — that's what
 * browsing the sections below is for) and every one of those lessons must
 * be completed. Among genuinely unlocked, unsolved candidates, one already
 * attempted (a real "pick this back up" signal) outranks a fresh one;
 * ties break by curriculum order. Renders nothing for a brand-new visitor
 * with no completed lessons yet, the same bail-out `RecommendedNext` makes
 * for the same reason — there is nothing yet to derive a recommendation
 * from, and the sections below already serve that visitor.
 */
function pickRecommendation(
  problems: ProblemMeta[],
  completedLessons: ReadonlySet<string>,
  progressBySlug: Map<string, ProblemProgress>
): Recommendation | null {
  if (completedLessons.size === 0) return null;

  const candidates = problems.filter((problem) => {
    if (progressBySlug.get(problem.slug)?.solved) return false;
    const prerequisites = problem.prerequisites ?? [];
    return prerequisites.length > 0 && prerequisites.every((slug) => completedLessons.has(slug));
  });
  if (candidates.length === 0) return null;

  const resumedCandidates = candidates.filter(
    (problem) => (progressBySlug.get(problem.slug)?.attempts.length ?? 0) > 0
  );
  const pool = resumedCandidates.length > 0 ? resumedCandidates : candidates;

  return { problem: sortByCourseOrder(pool)[0], resumed: resumedCandidates.length > 0 };
}

export function ProblemsCatalog({
  problems,
  lessonTitleBySlug,
}: {
  problems: ProblemMeta[];
  /** Lesson slug → title, for just the lessons these problems reference —
   *  built server-side in `page.tsx` from the real lesson corpus. Never
   *  the problem registry: see docs/DESIGN_SYSTEM.md's client-bundle
   *  boundary rule and `src/lib/design/__tests__/clientBoundary.test.ts`. */
  lessonTitleBySlug: Record<string, string>;
}) {
  const [pillar, setPillar] = useState<PillarFilter>("all");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");

  // Read once, for every problem, not just the currently filtered set — a
  // recommendation or a section's "solved" readout has to reason about
  // problems the active filters are currently hiding. Cheap: bounded,
  // cached localStorage reads (see localStorageStore.ts), no registry
  // import, so this never mutates progress, only reads it.
  const allSlugs = useMemo(() => problems.map((problem) => problem.slug), [problems]);
  const allProgress = useProblemsProgress(allSlugs);
  const progressBySlug = useMemo(
    () => new Map(allSlugs.map((slug, index) => [slug, allProgress[index]])),
    [allSlugs, allProgress]
  );

  const completedLessons = useCompletedLessonSlugs();
  const recommendation = useMemo(
    () => pickRecommendation(problems, completedLessons, progressBySlug),
    [problems, completedLessons, progressBySlug]
  );
  const recommendationCourse = recommendation ? getCourse(recommendation.problem.course) : undefined;

  const filtered = useMemo(() => {
    return problems.filter((problem) => {
      const course = getCourse(problem.course);
      const matchesPillar = pillar === "all" || course?.pillar === pillar;
      const matchesDifficulty = difficulty === "all" || problem.difficulty === difficulty;
      const matchesType = type === "all" || problem.problemType === type;
      return matchesPillar && matchesDifficulty && matchesType;
    });
  }, [problems, pillar, difficulty, type]);

  const solvedCount = useMemo(
    () => filtered.filter((problem) => progressBySlug.get(problem.slug)?.solved).length,
    [filtered, progressBySlug]
  );

  // With no topic filter applied, group into one section per pillar
  // (curriculum order) instead of one undifferentiated wall of problems —
  // the same "grid of cards is not finished" bar every pillar page is held
  // to (docs/DESIGN_SYSTEM.md §4). Each section further splits into a
  // `master`-tier feature strip (if it has any) and a dense row list for
  // the rest, sorted into course-order runs. Once a specific topic is
  // selected, this group header would just repeat the active filter chip,
  // so `courseGroups` below (grouped by course instead) is used there.
  const pillarGroups = useMemo(() => {
    if (pillar !== "all") return null;
    const byPillar = new Map<Pillar, ProblemMeta[]>();
    for (const problem of filtered) {
      const problemPillar = getCourse(problem.course)?.pillar;
      if (!problemPillar) continue;
      if (!byPillar.has(problemPillar)) byPillar.set(problemPillar, []);
      byPillar.get(problemPillar)!.push(problem);
    }
    return PILLAR_ORDER.filter((p) => byPillar.has(p)).map((p) => {
      const items = sortByCourseOrder(byPillar.get(p)!);
      return { pillar: p, items, ...splitFeatured(items) };
    });
  }, [filtered, pillar]);

  // Once a topic is picked, there's room (and reason) to go one level
  // deeper than pillar: group by course, the same "grouped runs" idea
  // `CourseList`/`CourseTimeline` already use at `/learn`, so drilling into
  // one pillar reads as a genuinely different, more detailed composition
  // rather than the same grid narrowed down.
  const courseGroups = useMemo(() => {
    if (pillar === "all") return null;
    const byCourse = new Map<string, ProblemMeta[]>();
    for (const problem of filtered) {
      if (!byCourse.has(problem.course)) byCourse.set(problem.course, []);
      byCourse.get(problem.course)!.push(problem);
    }
    return COURSES.filter((course) => byCourse.has(course.slug)).map((course) => {
      const items = byCourse.get(course.slug)!;
      return { course, items, ...splitFeatured(items) };
    });
  }, [filtered, pillar]);

  return (
    <div>
      {recommendation && recommendationCourse ? (
        <div data-pillar={recommendationCourse.pillar} className="mb-12">
          <Eyebrow>Pick up where you left off</Eyebrow>
          <SectionTitle level={2} size="sm" className="mt-2">
            {recommendation.problem.title}
          </SectionTitle>
          <Instrument
            className="mt-5 border-l-2 border-l-pillar-edge"
            label="Recommended practice problem"
            footnote={
              recommendation.resumed
                ? "You've already started this one — pick it back up."
                : lessonTitleBySlug[recommendation.problem.lesson ?? ""]
                  ? `Unlocked by finishing "${lessonTitleBySlug[recommendation.problem.lesson ?? ""]}".`
                  : "Its prerequisites are complete — you're ready for this one."
            }
          >
            <Readouts
              items={[
                { label: "Pillar", value: pillarVisual(recommendationCourse.pillar).short },
                { label: "Difficulty", value: <DifficultyScale difficulty={recommendation.problem.difficulty} /> },
                { label: "Type", value: <TypeMark type={recommendation.problem.problemType} /> },
                { label: "Time", value: recommendation.problem.estimatedMinutes, unit: "min" },
              ]}
            />
            <Button href={`/problems/${recommendation.problem.slug}`} className="mt-5">
              {recommendation.resumed ? "Continue" : "Start"} &ldquo;{recommendation.problem.title}&rdquo;
            </Button>
          </Instrument>
        </div>
      ) : null}

      <div className="instrument overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5 sm:px-5">
          <span className="tech-label">Filters</span>
          <span className="tech-value text-xs text-muted-foreground">
            <TechValue>{filtered.length}</TechValue> of {problems.length}
          </span>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-5 p-4 sm:p-5">
          <ProblemFilters label="Topic" options={PILLAR_OPTIONS} selected={pillar} onChange={setPillar} indicator={pillarIndicator} />
          <ProblemFilters label="Difficulty" options={DIFFICULTY_OPTIONS} selected={difficulty} onChange={setDifficulty} />
          <ProblemFilters label="Type" options={TYPE_OPTIONS} selected={type} onChange={setType} />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {filtered.length} problem{filtered.length === 1 ? "" : "s"}
        </p>
        {solvedCount > 0 ? (
          <p className="tech-label text-pillar-text">
            {solvedCount} of {filtered.length} solved
          </p>
        ) : null}
      </div>

      {filtered.length > 0 ? (
        pillarGroups ? (
          <div className="mt-6 space-y-14">
            {pillarGroups.map(({ pillar: groupPillar, items, featured, rest }) => {
              const solved = items.filter((problem) => progressBySlug.get(problem.slug)?.solved).length;
              return (
                <section key={groupPillar} data-pillar={groupPillar} aria-labelledby={`problems-${groupPillar}`}>
                  <div className="flex items-baseline justify-between gap-3 border-b border-pillar-edge pb-2">
                    <SectionTitle level={2} size="sm" id={`problems-${groupPillar}`} className="text-pillar-text">
                      {pillarVisual(groupPillar).short}
                    </SectionTitle>
                    <span className="tech-label text-subtle-foreground">
                      {solved}/{items.length} solved
                    </span>
                  </div>

                  <ProblemGroupBody
                    featured={featured}
                    rest={rest}
                    progressBySlug={progressBySlug}
                    lessonTitleBySlug={lessonTitleBySlug}
                  />
                </section>
              );
            })}
          </div>
        ) : courseGroups ? (
          <div className="mt-6 space-y-12">
            {courseGroups.map(({ course, items, featured, rest }) => (
              <section key={course.slug} data-pillar={course.pillar} aria-labelledby={`problems-course-${course.slug}`}>
                <div className="flex items-baseline justify-between gap-3 border-b border-border pb-2">
                  <SectionTitle level={2} size="sm" id={`problems-course-${course.slug}`}>
                    {course.title}
                  </SectionTitle>
                  <span className="tech-label text-subtle-foreground">
                    {items.length} problem{items.length === 1 ? "" : "s"}
                  </span>
                </div>

                <ProblemGroupBody
                  featured={featured}
                  rest={rest}
                  progressBySlug={progressBySlug}
                  lessonTitleBySlug={lessonTitleBySlug}
                />
              </section>
            ))}
          </div>
        ) : null
      ) : (
        <p className="mt-10 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No problems match these filters yet.
        </p>
      )}
    </div>
  );
}

/** The body shared by both grouping modes: a feature grid for `master`-tier
 *  problems (if any), then a dense row list for the rest. Pulled out so
 *  `pillarGroups` and `courseGroups` render identically once grouped. */
function ProblemGroupBody({
  featured,
  rest,
  progressBySlug,
  lessonTitleBySlug,
}: {
  featured: ProblemMeta[];
  rest: ProblemMeta[];
  progressBySlug: Map<string, ProblemProgress>;
  lessonTitleBySlug: Record<string, string>;
}) {
  return (
    <>
      {featured.length > 0 ? (
        <div className="mt-5">
          <p className="tech-label text-pillar-text">Master tier</p>
          <div className="mt-3 grid gap-5 sm:grid-cols-2">
            {featured.map((problem) => (
              <ProblemCard
                key={problem.slug}
                problem={problem}
                solved={progressBySlug.get(problem.slug)?.solved ?? false}
                lessonTitle={lessonTitleBySlug[problem.lesson ?? ""]}
              />
            ))}
          </div>
        </div>
      ) : null}

      {rest.length > 0 ? (
        <ul className={cn("divide-y divide-border/70", featured.length > 0 && "mt-6")}>
          {rest.map((problem) => (
            <li key={problem.slug}>
              <ProblemRow
                problem={problem}
                solved={progressBySlug.get(problem.slug)?.solved ?? false}
                lessonTitle={lessonTitleBySlug[problem.lesson ?? ""]}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
