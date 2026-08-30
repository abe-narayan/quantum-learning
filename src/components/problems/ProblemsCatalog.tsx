"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FilterChips } from "@/components/curriculum/FilterChips";
import { ProblemCard, ProblemRow } from "./ProblemCard";
import { getCourse, COURSES } from "@/lib/content/curriculum";
import { useProblemsProgress } from "@/lib/problems/progress";
import { useCompletedLessonSlugs } from "@/lib/content/progress";
import { Eyebrow, Readouts, SectionTitle, TechValue } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { ListBypassEnd, ListBypassLink } from "@/components/ui/ListBypass";
import { PILLAR_ORDER, pillarVisual } from "@/lib/design/pillars";
import { DIFFICULTY_LABEL, type Pillar } from "@/lib/content/types";
import { PROBLEM_TO_DIFFICULTY } from "@/lib/problems/types";
import { DifficultyScale, TypeMark } from "./ProblemMetaMarks";
import { cn } from "@/lib/utils";
import type { ProblemProgress } from "@/lib/problems/progress";
import type { ProblemDifficulty, ProblemMeta, ProblemType } from "@/lib/problems/types";

/**
 * Fragment targets for the end-of-list bypass pair (`ui/ListBypass.tsx`).
 * Literals, not `useId`: a fragment target is a URL, and this catalog is
 * mounted once per page, so a fixed id has nothing to collide with.
 */
const RESULTS_ID = "problem-results";
const LIST_END_ID = "problems-list-end";

type PillarFilter = "all" | Pillar;
type DifficultyFilter = "all" | ProblemDifficulty;
type TypeFilter = "all" | ProblemType;
type StatusFilter = "all" | "unsolved" | "ready";

/**
 * Only offered once there is progress to filter *against* — see
 * `hasProgress` below. "Ready" means every lesson this problem lists as a
 * prerequisite is marked complete; it is a shortcut to the actionable
 * subset, not a gate, and nothing in the catalog is ever hidden by default.
 */
const STATUS_OPTIONS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unsolved", label: "Unsolved" },
  { id: "ready", label: "Ready for you" },
];

/**
 * Track chips, in curriculum order, labelled with the *short* pillar name.
 *
 * The names were spelled out ("Quantum Mechanics", "Quantum Computing", …) and
 * hand-listed, which put this page's filter row in a different vocabulary from
 * the navbar dropdown, the footer, the homepage strip and `/current-quantum`'s
 * identical control — all of which say "Mechanics", "Computing". A chip
 * labelled one way on one page and another way on the next is two taxonomies
 * for one axis, and the short form is the one that already dominates and the
 * one that fits a chip at 320px. `pillarVisual().short` is the site's single
 * source for it, so this row can no longer drift from the pillar table, and it
 * matches the group headings this same component already renders from it
 * below. The full title still appears wherever a heading or a sentence
 * introduces a track.
 */
const PILLAR_OPTIONS: { id: PillarFilter; label: string }[] = [
  { id: "all", label: "All" },
  ...PILLAR_ORDER.map((pillar) => ({ id: pillar as PillarFilter, label: pillarVisual(pillar).short })),
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

/** The four filter rows as one value, so "what would this row's other option
 *  leave?" is a single call with one field overridden rather than four
 *  near-identical predicates. */
type FilterState = {
  pillar: PillarFilter;
  difficulty: DifficultyFilter;
  type: TypeFilter;
  status: StatusFilter;
};

/** The one predicate the visible list, the per-option counts and the empty
 *  state all go through, so a chip can never claim a count the list then
 *  contradicts. `solved`/`ready` are passed in rather than read here: they
 *  come from client-side progress the caller has already gathered once for
 *  the whole corpus. */
function matchesFilters(problem: ProblemMeta, state: FilterState, solved: boolean, ready: boolean): boolean {
  const course = getCourse(problem.course);
  if (state.pillar !== "all" && course?.pillar !== state.pillar) return false;
  if (state.difficulty !== "all" && problem.difficulty !== state.difficulty) return false;
  if (state.type !== "all" && problem.problemType !== state.type) return false;
  if (state.status === "unsolved" && solved) return false;
  if (state.status === "ready" && (solved || !ready)) return false;
  return true;
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
 * The cold-start answer to "which one do I try first?"
 *
 * `pickRecommendation` below correctly declines to recommend anything to a
 * visitor with no completed lessons — it has nothing to reason from. But
 * that left the exact reader who most needs a starting point (someone
 * landing on `/problems` before they have read anything) facing 547 problems
 * across six pillars and a filter strip. This picks the first foundational
 * problem in curriculum order — the same order the rest of the site teaches
 * in, so it is the site's own opinion about where to begin rather than a
 * separate ranking invented here. Falls back to the first problem overall if
 * nothing is tagged `beginner`.
 */
function pickStartingPoint(problems: ProblemMeta[]): ProblemMeta | null {
  if (problems.length === 0) return null;
  const foundational = problems.filter((problem) => problem.difficulty === "beginner");
  return sortByCourseOrder(foundational.length > 0 ? foundational : problems)[0] ?? null;
}

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
  const [status, setStatus] = useState<StatusFilter>("all");

  // Where "show me the easy ones" and "clear the filters" both land the
  // reader. Focused as well as scrolled: a keyboard or screen-reader user who
  // activates a control at the top of the page and gets only a scroll has
  // been moved somewhere their focus isn't, and their next Tab goes back to
  // the filter strip they just left.
  const resultsRef = useRef<HTMLDivElement>(null);
  const goToResults = useCallback(() => {
    const node = resultsRef.current;
    if (!node) return;
    node.focus({ preventScroll: true });
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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

  // "Every lesson this problem lists as a prerequisite is already complete."
  // Computed once for the whole corpus rather than per card, because both the
  // `Ready` marker and the status filter need it, and because the status
  // filter has to reason about problems the other filters are hiding.
  // `hasProgress` gates the whole idea: with nothing completed, every problem
  // with prerequisites is un-ready and every one without is trivially ready,
  // which is noise rather than signal — see `ReadyTag` in ProblemCard.
  const hasProgress = completedLessons.size > 0;
  const readyBySlug = useMemo(() => {
    const ready = new Set<string>();
    if (!hasProgress) return ready;
    for (const problem of problems) {
      const prerequisites = problem.prerequisites ?? [];
      if (prerequisites.length > 0 && prerequisites.every((slug) => completedLessons.has(slug))) {
        ready.add(problem.slug);
      }
    }
    return ready;
  }, [problems, completedLessons, hasProgress]);

  const recommendation = useMemo(
    () => pickRecommendation(problems, completedLessons, progressBySlug),
    [problems, completedLessons, progressBySlug]
  );
  const recommendationCourse = recommendation ? getCourse(recommendation.problem.course) : undefined;

  // The cold-start path, derived from the real corpus rather than an authored
  // "start here" list: how many problems actually carry the lowest difficulty
  // rung, and which of those comes first in curriculum order.
  const foundationalCount = useMemo(
    () => problems.filter((problem) => problem.difficulty === "beginner").length,
    [problems]
  );
  const startingPoint = useMemo(() => pickStartingPoint(problems), [problems]);

  const active: FilterState = useMemo(
    () => ({ pillar, difficulty, type, status }),
    [pillar, difficulty, type, status]
  );

  const matches = useCallback(
    (problem: ProblemMeta, state: FilterState) => {
      const solved = progressBySlug.get(problem.slug)?.solved ?? false;
      return matchesFilters(problem, state, solved, readyBySlug.has(problem.slug));
    },
    [progressBySlug, readyBySlug]
  );

  const filtered = useMemo(
    () => problems.filter((problem) => matches(problem, active)),
    [problems, matches, active]
  );

  /**
   * How many problems each option would leave, with the *other* three rows
   * left as they are — the single most useful thing a filter row can say, and
   * the reason `FilterChips` takes a `count`. Without it the only way to find
   * out that "Foundational + Apex" is empty is to select it and watch the
   * page go blank, which reads as a bug rather than as a fact about the
   * corpus. Counted against the whole corpus rather than the visible set,
   * because the question each chip answers is "what if I switched to this",
   * not "what is here now".
   */
  const optionCounts = useMemo(() => {
    const countIf = (override: Partial<FilterState>) =>
      problems.reduce((total, problem) => total + (matches(problem, { ...active, ...override }) ? 1 : 0), 0);
    return {
      pillar: new Map(PILLAR_OPTIONS.map((option) => [option.id, countIf({ pillar: option.id })])),
      difficulty: new Map(DIFFICULTY_OPTIONS.map((option) => [option.id, countIf({ difficulty: option.id })])),
      type: new Map(TYPE_OPTIONS.map((option) => [option.id, countIf({ type: option.id })])),
      status: new Map(STATUS_OPTIONS.map((option) => [option.id, countIf({ status: option.id })])),
    };
  }, [problems, matches, active]);

  const withCounts = useCallback(
    <T extends string>(options: { id: T; label: string }[], counts: Map<T, number>) =>
      options.map((option) => ({ ...option, count: counts.get(option.id) ?? 0 })),
    []
  );

  /**
   * The active filters, as data — so the same list drives the visible
   * "what is on right now" readout, each chip's individual undo, and the
   * "Clear all" control, and the three can never disagree. Also what makes
   * the state announceable: `aria-pressed` on a chip tells a screen-reader
   * user the state of the chip they are *on*, but says nothing about the
   * three rows they already scrolled past, which is exactly the confusion of
   * a filtered list that looks empty for no visible reason.
   */
  const activeFilters = useMemo(() => {
    const none: FilterState = { pillar: "all", difficulty: "all", type: "all", status: "all" };
    const solo = (override: Partial<FilterState>) =>
      problems.reduce((total, problem) => total + (matches(problem, { ...none, ...override }) ? 1 : 0), 0);

    type ActiveFilter = {
      key: string;
      group: string;
      label: string;
      soloCount: number;
      /** Release just this row. Used by the "Active" chips, where the list
       *  around them survives the change and focus stays on the strip. */
      clear: () => void;
    };
    const list: ActiveFilter[] = [];
    if (pillar !== "all") {
      list.push({
        key: "topic",
        group: "Track",
        label: PILLAR_OPTIONS.find((option) => option.id === pillar)?.label ?? pillar,
        soloCount: solo({ pillar }),
        clear: () => setPillar("all"),
      });
    }
    if (difficulty !== "all") {
      list.push({
        key: "difficulty",
        group: "Difficulty",
        label: DIFFICULTY_OPTIONS.find((option) => option.id === difficulty)?.label ?? difficulty,
        soloCount: solo({ difficulty }),
        clear: () => setDifficulty("all"),
      });
    }
    if (type !== "all") {
      list.push({
        key: "type",
        group: "Type",
        label: TYPE_OPTIONS.find((option) => option.id === type)?.label ?? type,
        soloCount: solo({ type }),
        clear: () => setType("all"),
      });
    }
    if (status !== "all") {
      list.push({
        key: "status",
        group: "Showing",
        label: STATUS_OPTIONS.find((option) => option.id === status)?.label ?? status,
        soloCount: solo({ status }),
        clear: () => setStatus("all"),
      });
    }
    return list;
  }, [problems, matches, pillar, difficulty, type, status]);

  /**
   * Release one filter row and land the reader on the results header.
   *
   * The "Active" chips do not need the second half — the list around them
   * survives the change, so focus stays where it was. The empty state does:
   * its whole block, including the button being pressed, unmounts the moment
   * the list stops being empty, and without a destination focus falls to
   * `<body>` and the reader's next Tab restarts at the top of the page.
   *
   * A component-level callback taking the row's own `clear`, rather than a
   * `clearAndShowResults` composed per row: `goToResults` reads a ref, and
   * anything that composes it inside a `.map` in the JSX (or inside the
   * `useMemo` above, which also runs during render) is a ref read during
   * render as far as `react-hooks/refs` is concerned.
   */
  const clearFilterAndShowResults = useCallback(
    (clear: () => void) => {
      clear();
      goToResults();
    },
    [goToResults]
  );

  const clearAll = useCallback(() => {
    setPillar("all");
    setDifficulty("all");
    setType("all");
    setStatus("all");
  }, []);

  const showFoundational = useCallback(() => {
    clearAll();
    setDifficulty("beginner");
    goToResults();
  }, [clearAll, goToResults]);

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
                ? "You've already started this one. Pick it back up."
                : lessonTitleBySlug[recommendation.problem.lesson ?? ""]
                  ? `Unlocked by finishing "${lessonTitleBySlug[recommendation.problem.lesson ?? ""]}".`
                  : "Its prerequisites are complete, so you're ready for this one."
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

      {/*
        The cold-start counterpart to the recommendation above, and the one
        thing a beginner landing on this page most needs. `pickRecommendation`
        correctly declines to recommend anything to a reader with no completed
        lessons — it has nothing to reason from — which left exactly that
        reader facing 547 graduate-flavoured exercises, six pillar sections
        and a filter strip, with no visible answer to "which of these can I
        possibly do?". Both facts here come from the corpus, not from an
        authored starter list: how many problems actually sit on the lowest
        difficulty rung, and which of those comes first in the order the rest
        of the site teaches in.
      */}
      {!recommendation && startingPoint && foundationalCount > 0 ? (
        <Instrument className="mb-10" label="New here?">
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="text-foreground">
              {foundationalCount} of these {problems.length} problems are foundational
            </span>{": "}
            they assume a first lesson, not a degree. Everything else stays open to you; nothing here
            is locked.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3">
            <Button onClick={showFoundational}>Show the {foundationalCount} foundational problems</Button>
            <Link
              href={`/problems/${startingPoint.slug}`}
              className="inline-flex min-h-11 items-center rounded-(--radius-tight) text-sm text-pillar-text underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
            >
              Or start with &ldquo;{startingPoint.title}&rdquo;
            </Link>
          </div>
        </Instrument>
      ) : null}

      <div className="instrument overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5 sm:px-5">
          <span className="tech-label">Filters</span>
          {/* "12 of 547" beside the word "Filters" is two numbers and no noun
              in the accessibility tree. The unit is `sr-only` rather than
              painted because the visible figure sits under a page heading that
              already says what is being counted, and the header strip is the
              one row here with no width to spare at 320px. */}
          <span className="tech-value text-xs text-muted-foreground">
            <TechValue>{filtered.length}</TechValue> of {problems.length}
            <span className="sr-only"> problems shown</span>
          </span>
        </div>
        {/*
          `FilterChips` (shared with `/learn`) replaces this directory's own
          `ProblemFilters`, now deleted: it is the same control carrying the
          three things that one was missing — 44px chips, a filled-vs-hollow
          disc so the selected state is a shape and not only a tint, and a
          per-option count. It also fixes the bug those chips shipped with:
          `border-pillar-accent` is not a registered Tailwind color (the ramp
          exposes `pillar`, which *is* `--pillar-accent`), so the selected
          chip's outline compiled to nothing and the state really was
          color-only. The one thing lost in the swap is the small pillar-hued
          dot the Track row used to carry; the count is the better use of that
          slot, and the dot was decorative color anyway.
        */}
        {/* `countNoun` on every row: `FilterChips` renders the count as a bare
            figure and appends this word `sr-only`, so without it these chips
            announce as "All, 12" — a number with no unit — under the
            component's generic "results" default. */}
        <div className="flex flex-wrap gap-x-8 gap-y-5 p-4 sm:p-5">
          <FilterChips
            label="Track"
            countNoun="problems"
            options={withCounts(PILLAR_OPTIONS, optionCounts.pillar)}
            selected={pillar}
            onChange={setPillar}
          />
          <FilterChips
            label="Difficulty"
            countNoun="problems"
            options={withCounts(DIFFICULTY_OPTIONS, optionCounts.difficulty)}
            selected={difficulty}
            onChange={setDifficulty}
          />
          <FilterChips
            label="Type"
            countNoun="problems"
            options={withCounts(TYPE_OPTIONS, optionCounts.type)}
            selected={type}
            onChange={setType}
          />
          {/* Only offered once there is progress to filter *against* — with
              nothing completed, "Ready for you" and "Unsolved" would both be
              synonyms for "All" and the row would be three dead controls. */}
          {hasProgress ? (
            <FilterChips
              label="Showing"
              countNoun="problems"
              options={withCounts(STATUS_OPTIONS, optionCounts.status)}
              selected={status}
              onChange={setStatus}
            />
          ) : null}
        </div>

        {/*
          What is on right now, stated in words, with a one-click undo for
          each and for all of them at once. Rendered inside the filter
          instrument (not floating above the results) so the state and the
          controls that produced it stay in one place.
        */}
        {activeFilters.length > 0 ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-border px-4 py-3 sm:px-5">
            <span className="tech-label shrink-0">Active</span>
            {activeFilters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={filter.clear}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-pillar-edge bg-pillar-wash px-3.5 py-1 text-sm text-pillar-text transition-colors duration-(--dur-fast) hover:border-pillar focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
              >
                <span className="text-subtle-foreground">{filter.group}:</span>
                {filter.label}
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="shrink-0">
                  <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span className="sr-only">, remove this filter</span>
              </button>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="ml-auto inline-flex min-h-11 items-center rounded-(--radius-tight) px-1 text-sm text-muted-foreground underline underline-offset-4 transition-colors duration-(--dur-fast) hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
            >
              Show all {problems.length} problems
            </button>
          </div>
        ) : null}
      </div>

      {/*
        `tabIndex={-1}` so "Show the foundational problems" and "Clear all
        filters" can move focus here rather than only scrolling the viewport.
        The count line is a live region: a filter change repaints the whole
        list below silently otherwise, which is precisely the case where a
        screen-reader user is left not knowing whether anything happened.

        `role="group"` is what makes the `aria-label` below mean anything. A
        `<div>` with no role is `generic`, and ARIA prohibits naming a generic
        element — so the label was dropped by every major screen reader, and
        the one moment it exists for (focus landing here after "Show the
        foundational problems") announced an unnamed container instead of
        "Problem results". `group` rather than `region`: this is a two-line
        count header, not a landmark anyone should find in a landmark list.
      */}
      <div
        ref={resultsRef}
        // An `id` as well as the ref, because the end-of-list "Back to the
        // filters" link (`ui/ListBypass.tsx`) is a plain fragment anchor with
        // no JavaScript behind it, and this header is already the one
        // `tabIndex={-1}` element at the top of the results, so a fragment
        // link lands focus here exactly the way `goToResults()` does.
        id={RESULTS_ID}
        tabIndex={-1}
        role="group"
        aria-label="Problem results"
        className="mt-5 flex items-center justify-between gap-3 scroll-mt-24 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
      >
        {/* `aria-atomic` because React renders this sentence as several
            adjacent text nodes (the figure, the noun, the plural "s", the
            "matching …" clause) and a filter change usually mutates only one
            of them: switching Foundational → Advanced can change the number
            and nothing else, and a non-atomic region is permitted to announce
            just "37". The count without its filters is not the answer to the
            question the reader just asked, so the whole line is re-read. */}
        <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-muted-foreground">
          {filtered.length} problem{filtered.length === 1 ? "" : "s"}
          {activeFilters.length > 0
            ? ` matching ${activeFilters.map((filter) => filter.label.toLowerCase()).join(", ")}`
            : ""}
        </p>
        {solvedCount > 0 ? (
          <p className="tech-label text-pillar-text">
            {solvedCount} of {filtered.length} solved
          </p>
        ) : null}
      </div>

      {/* The bypass pair, shared with /glossary and /lessons, see
          `ui/ListBypass.tsx`. Served, this page is 1,138 anchors and 21
          buttons, and the only skip link on it lands above all of them. The
          link sits below the results header so that a reader who has just
          filtered hears the count first and then gets the option to leave. */}
      {filtered.length > 0 ? (
        <ListBypassLink targetId={LIST_END_ID}>
          Skip past the {filtered.length} {filtered.length === 1 ? "problem" : "problems"} below
        </ListBypassLink>
      ) : null}

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
                    readyBySlug={readyBySlug}
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
                  readyBySlug={readyBySlug}
                  lessonTitleBySlug={lessonTitleBySlug}
                />
              </section>
            ))}
          </div>
        ) : null
      ) : (
        /*
          A dead end with a way out of it. The previous version was a single
          grey sentence: it named the situation and offered nothing, so a
          reader who had narrowed to an empty intersection (easy to do — e.g.
          Foundational + Apex, which genuinely has no members) had to work out
          for themselves which of four chips to un-press. This states the
          combination that produced the emptiness and puts both escapes —
          drop everything, or fall back to the foundational set — in reach.
        */
        <div className="mt-10 rounded-panel border border-dashed border-border p-8 text-center">
          {/* "Nothing here yet" was the single-filter wording, and "yet"
              promised something this page will never do: the corpus is fixed,
              and "Ready for you" being empty is a fact about the reader's
              progress, not a queue that fills in later. State the fact. */}
          <p className="text-sm text-foreground">
            {activeFilters.length > 1
              ? `No problem is all of these at once: ${activeFilters.map((filter) => filter.label).join(" + ")}.`
              : activeFilters.length === 1
                ? `No problem matches ${activeFilters[0].label}.`
                : "There are no problems to show."}
          </p>
          {activeFilters.length > 0 ? (
            /* Each filter's own standalone total, so the emptiness reads as a
               fact about the corpus ("Apex has 99 problems, none of them
               foundational") rather than as a broken page. Derived through the
               same `matches` predicate as the list itself. */
            <p className="mt-2 text-sm text-muted-foreground">
              {activeFilters
                .map((filter) => `${filter.label} on its own: ${filter.soloCount}`)
                .join(" · ")}
            </p>
          ) : null}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => {
                clearAll();
                goToResults();
              }}
            >
              Show all {problems.length} problems
            </Button>
            {/*
              The surgical escape, not just the nuclear one. With two or more
              rows on, "show all 547" throws away the constraint the reader
              still wants along with the one that emptied the list — so each
              active row also gets its own release here, worded exactly as the
              "Active" chip above it ("Track: Apex"), so the two read as the
              same control in two places. Offered only above one filter:
              dropping the only active filter *is* "show all", already the
              primary button beside this.
            */}
            {activeFilters.length > 1 ? (
              <FilterEscapes filters={activeFilters} onClear={clearFilterAndShowResults} />
            ) : null}
            {activeFilters.length <= 1 && foundationalCount > 0 && difficulty !== "beginner" ? (
              <Button variant="secondary" onClick={showFoundational}>
                Show the {foundationalCount} foundational problems
              </Button>
            ) : null}
          </div>
        </div>
      )}

      {filtered.length > 0 ? (
        <ListBypassEnd
          id={LIST_END_ID}
          backTo={RESULTS_ID}
          backLabel="Back to the filters"
        >
          End of the problem catalog. {filtered.length} of {problems.length} problems listed.
        </ListBypassEnd>
      ) : null}
    </div>
  );
}

/**
 * One release control per active filter, for the empty state.
 *
 * Its own component rather than a `.map` inside `ProblemsCatalog`'s JSX, and
 * the reason is a lint one worth writing down so nobody inlines it back:
 * `onClear` composes `goToResults`, which reads `resultsRef`, and
 * `react-hooks/refs` treats a closure built inside a render-time `.map` as a
 * ref read during render. Passing the handler in as a prop puts the ref
 * behind a boundary the rule does not look through, and costs one component.
 */
function FilterEscapes({
  filters,
  onClear,
}: {
  filters: { key: string; group: string; label: string; clear: () => void }[];
  onClear: (clear: () => void) => void;
}) {
  return (
    <>
      {filters.map((filter) => (
        <Button key={filter.key} variant="secondary" onClick={() => onClear(filter.clear)}>
          Clear {filter.group}: {filter.label}
        </Button>
      ))}
    </>
  );
}

/** The body shared by both grouping modes: a feature grid for `master`-tier
 *  problems (if any), then a dense row list for the rest. Pulled out so
 *  `pillarGroups` and `courseGroups` render identically once grouped. */
function ProblemGroupBody({
  featured,
  rest,
  progressBySlug,
  readyBySlug,
  lessonTitleBySlug,
}: {
  featured: ProblemMeta[];
  rest: ProblemMeta[];
  progressBySlug: Map<string, ProblemProgress>;
  /** Slugs whose every prerequisite lesson is complete — empty for a reader
   *  with no progress, so the `Ready` marker stays absent rather than
   *  meaningless. See `readyBySlug` in `ProblemsCatalog`. */
  readyBySlug: ReadonlySet<string>;
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
                ready={readyBySlug.has(problem.slug)}
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
                ready={readyBySlug.has(problem.slug)}
                lessonTitle={lessonTitleBySlug[problem.lesson ?? ""]}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
