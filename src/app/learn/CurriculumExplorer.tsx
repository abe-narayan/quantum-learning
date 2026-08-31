"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eyebrow, Readouts, SectionTitle, TechValue } from "@/components/ui/Typography";
import { FadeRule } from "@/components/ui/Panel";
import { FilterChips, type FilterOption } from "@/components/curriculum/FilterChips";
import { CourseList } from "@/components/curriculum/CourseList";
import { CourseTimeline } from "@/components/curriculum/CourseTimeline";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { TIER_COPY, TIER_OF_PILLAR, TIER_ORDER, pillarsInTier } from "@/components/pillar/tiers";
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
 *  rather than clicking and then interpreting five empty pillars.
 *
 *  The reset chip is "All", the one word every filter on the site now uses.
 *  It read "All levels" here, "Any level" on /lessons and "All" on /problems
 *  and /current-quantum: four names for one control. The row is already
 *  labelled "Difficulty" above the chips, so the noun was never carrying
 *  anything the reader could not see. */
const FILTER_OPTIONS: FilterOption<FilterValue>[] = [
  { id: "all", label: "All", count: COURSES.length },
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
 * A "Jump down to a track" nav sits in the same instrument as the difficulty
 * filter, grouped by the four curriculum tiers (`components/pillar/tiers`) —
 * a one-click way for a reader who already knows the basics to skip the
 * beginner scaffolding, and a restatement of the same four-rung structure
 * `TierLadder` draws on every track and course page, so the two screens teach
 * one shape rather than two. Only the first
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
      {/* `id` so each track section below can offer a way back to this
          instrument. The catalog is tens of thousands of pixels tall on a
          phone (26,959px at 375px after this sprint's course-card fold, down
          from 38,397px), and until now the jump nav was a one-way door: a
          reader who took it into Apex had 22,000px of scrolling between them
          and the only control that moves between tracks. */}
      <div id="tracks" className="instrument overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-2.5 sm:px-5">
          <span className="tech-label">Scan the curriculum</span>
          {/* `aria-live` so a filter change is *announced*, not left as a
              silent number swap beside a chip that only changed color. The
              sentence is written to stand alone out of context, because that
              is exactly how a screen reader will deliver it.

              `aria-atomic` is what actually lets it stand alone. This element
              has no role, so its implicit `aria-atomic` is `false` and a screen
              reader announces only the nodes that changed — which for a filter
              switch is the count on its own: "5", with no unit, no total, and
              no mention of the filter that produced it. The sentence was
              written to be self-contained and was then delivered one word at a
              time. `aria-atomic="true"` re-reads the whole of it. */}
          <span aria-live="polite" aria-atomic="true" className="tech-value text-xs text-muted-foreground">
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
            countNoun="courses"
            // The one-click way back. "All" is already the first chip,
            // but a reader who has scrolled into the pillars and is looking at
            // an empty section should not have to work out *which* control put
            // them there — so the escape is spelled out, in words, next to the
            // label, and only exists while there is something to escape from.
            action={
              filter === "all" ? undefined : (
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="inline-flex min-h-11 items-center rounded-full border border-border-strong px-3.5 text-sm font-medium text-foreground transition-colors duration-(--dur-fast) hover:border-pillar-edge hover:text-pillar-text"
                >
                  Show all {COURSES.length} courses
                </button>
              )
            }
          />

          {/* One-click jump for a reader who already knows the basics and
              wants Mastery or Apex without scrolling past four tracks of
              beginner scaffolding first — mission brief's "skip past ... in
              one action."

              Grouped by the four curriculum tiers (`components/pillar/tiers`),
              which is the site's only vocabulary for curriculum depth and the
              one `TierLadder` prints on every track and course page. It used
              to be a private two-way split, "Core" = the first four tracks and
              "Advanced" = the last two, which gave "Core" a second, smaller
              meaning: a reader who read "Core: Mechanics, Computing, Hardware,
              Software" here and then clicked the Hardware chip landed on a
              page whose ladder says "Tier 2 of 4, Core" about Hardware and
              Software alone. Two screens, one word, two structures, and the
              ladder was the one a reader could not read correctly. Four rungs
              here means both screens teach the same shape. */}
          {/* These are *links down the page*, and until this pass they were
              `rounded-full` chips with a `min-h-11` box and a hairline border:
              pixel-for-pixel the difficulty filter sitting directly above
              them. Two rows of identical pills in one instrument, one
              filtering and one navigating, is the exact "what am I supposed to
              click, and what will it do?" failure this surface exists to
              avoid. They now take the tight control radius instead of the
              filter's pill, and each carries a "↓" so the move it makes reads
              off the control itself. */}
          <div>
            <p className="tech-label">Jump down to a track</p>
            <nav aria-label="Jump to a track" className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2">
              {TIER_ORDER.map((tier, tierIndex) => {
                const tracks = pillarsInTier(tier);
                if (tracks.length === 0) return null;
                // The last two rungs are the ones a returning reader is
                // skipping ahead to, so they keep the heavier border and
                // foreground text the old "Advanced" group carried. Derived
                // from the rung's own position, not from a slice index.
                const emphasised = tierIndex >= TIER_ORDER.indexOf("mastery");
                return (
                  <div key={tier} className="flex flex-wrap items-center gap-1.5">
                    <span className="mr-0.5 tech-label text-subtle-foreground">
                      {TIER_COPY[tier].label}
                    </span>
                    {tracks.map((slug) => (
                      <a
                        key={slug}
                        href={`#${slug}`}
                        data-pillar={slug}
                        className={
                          emphasised
                            ? "inline-flex min-h-11 items-center gap-1.5 rounded-(--radius-tight) border border-border-strong px-3 tech-label text-foreground transition-colors duration-(--dur-fast) hover:border-pillar-edge hover:text-pillar-text"
                            : "inline-flex min-h-11 items-center gap-1.5 rounded-(--radius-tight) border border-border px-3 tech-label text-muted-foreground transition-colors duration-(--dur-fast) hover:border-pillar-edge hover:text-pillar-text"
                        }
                      >
                        <span aria-hidden="true" data-decorative="">
                          ↓
                        </span>
                        {PILLAR_ORDER.indexOf(slug) + 1}. {pillarVisual(slug).short}
                      </a>
                    ))}
                  </div>
                );
              })}
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
          // A named chapter break wherever the tier changes, restating in the
          // reading flow the same four rungs the jump nav above groups by and
          // `TierLadder` draws on every track page. It used to be a single
          // seam before Mastery reading "Beyond the core curriculum", which
          // named a "core" that stopped at Software here and means Hardware
          // plus Software one click away.
          const tier = TIER_OF_PILLAR[pillar.slug];
          const previousTier = index > 0 ? TIER_OF_PILLAR[PILLARS[index - 1].slug] : undefined;
          // True for the first track too, so the catalog opens on rung 1 and
          // the reader meets all four in order rather than starting at "Tier 2
          // of 4" with no rung 1 anywhere above it.
          const startsTier = tier !== previousTier;

          return (
            <section key={pillar.slug} id={pillar.slug} data-pillar={pillar.slug}>
              {startsTier ? (
                <div className="mb-16 flex items-center gap-4">
                  <span className="whitespace-nowrap font-tech text-xs font-medium uppercase tracking-meta text-subtle-foreground">
                    Tier {TIER_ORDER.indexOf(tier) + 1} of {TIER_ORDER.length} ·{" "}
                    {TIER_COPY[tier].label}
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
                {/* Six of these render on this page with byte-identical link
                    text, so the accessible name has to carry the track or a
                    screen reader's link list is six entries called "Full track
                    page". The visible text stays short because the heading it
                    sits beside already names the track for a sighted reader.

                    The track name goes *after* the visible words, not inside
                    them. `"Full ${pillar.title} track page"` disambiguated
                    correctly and broke WCAG 2.5.3 Label in Name doing it: the
                    visible label "Full track page" was no longer a contiguous
                    run inside the accessible name, so a speech-input user
                    saying "click Full track page" matched nothing. Appending
                    keeps the visible string intact at the front of the name and
                    disambiguates just as well.

                    `-my-3 py-3` is the touch target: the visible box is one
                    14px line (a 20px line box), which is over WCAG 2.5.8's
                    24px floor only by the spacing exception and well under the
                    44px this site holds itself to. 12px of padding each way
                    makes it 44px; the negative margin hands the layout its
                    original box back, which matters because this link is
                    baseline-aligned with the `<h2>` beside it and a real 44px
                    content box would drop it off that baseline. */}
                <Link
                  href={visual.route}
                  aria-label={`Full track page: ${pillar.title}`}
                  className="-my-3 py-3 text-sm font-medium text-pillar-text underline-offset-4 hover:underline"
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
                  // Same rule as `pillarReadoutItems` and /learn's hero strip:
                  // the "authored" hedge only appears while there is a gap to
                  // hedge against. Today every declared module has a lesson.
                  stats.authoredLessons === stats.totalModules
                    ? { label: "Lessons", value: stats.authoredLessons }
                    : { label: "Lessons authored", value: stats.authoredLessons },
                  // "Est. time", matching this page's own hero strip, the
                  // homepage hero and every `PillarFooter`. Study hours have
                  // one name on the site now; the scope is whatever block the
                  // readout sits in.
                  { label: "Est. time", value: stats.totalHours, unit: "h" },
                  {
                    label: "Range",
                    value:
                      stats.difficulties.length === 0 ? (
                        "None yet"
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
                  <p className="rounded-panel border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
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

              {/* The way back out of a track, at the end of the track. Six of
                  these render, so the accessible name carries which track it
                  is leaving — otherwise a screen reader's link list is six
                  entries reading "Back to all six tracks". The visible label
                  stays a contiguous run at the front of that name (WCAG 2.5.3
                  Label in Name), the same construction the "Full track page"
                  link above uses.

                  `inline-flex min-h-11 items-center`, not the `-my-3 py-3`
                  the "Full track page" link uses: that recipe exists to keep
                  a link on a shared baseline with a heading beside it, and
                  buys only 24px of padding around a 13px `.tech-label` line
                  box — 37px, which `responsive.mjs` correctly flagged. This
                  link sits alone on its own line, so it can simply be 44px
                  tall, the same way every breadcrumb crumb is. */}
              <p className="mt-8">
                <a
                  href="#tracks"
                  aria-label={`Back to all ${PILLARS.length} tracks: from ${pillar.title}`}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-(--radius-tight) tech-label text-subtle-foreground transition-colors duration-(--dur-fast) hover:text-pillar-text"
                >
                  <span aria-hidden="true" data-decorative="">
                    ↑
                  </span>
                  Back to all {PILLARS.length} tracks
                </a>
              </p>
            </section>
          );
        })}
      </div>
    </div>
  );
}
