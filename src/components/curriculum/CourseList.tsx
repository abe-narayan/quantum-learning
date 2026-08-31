import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
import { TechLabel } from "@/components/ui/Typography";
import { CourseProgressBadge } from "./CourseProgressBadge";
import { LessonCompletionMark } from "./LessonCompletionMark";
import { DifficultyMark } from "./DifficultyMark";
import { getCourseHref } from "./courseHref";
import { COURSES, getCourse } from "@/lib/content/curriculum";
import { pillarVisual } from "@/lib/design/pillars";
import { cn } from "@/lib/utils";
import type { Course, LessonMetaWithSlug } from "@/lib/content/types";

/** How many forward edges the "Leads to" line names before it counts the
 *  rest. Three is what fits on one line at 320px without the sentence
 *  turning into a manifest of its own. */
const MAX_LEADS_TO_SHOWN = 3;

/**
 * ============================================================
 * CourseList
 * ============================================================
 * Each course renders as a substantial instrument row rather than a card in
 * a grid: a technical-voice header (course index, difficulty, hours,
 * authoring/visitor progress), a real progress bar, and a module manifest
 * that answers "what's inside" module by module — completed, available, or
 * not yet written — before the visitor commits to opening it.
 *
 * Props are unchanged from the previous card-grid implementation
 * (`courses`, `lessons`) — `/learn` and `/apex` (owned by other agents)
 * consume this component directly and neither needed to change.
 *
 * ------------------------------------------------------------
 * Click targets — one stretched primary link, with real text raised above it
 * ------------------------------------------------------------
 * The whole panel used to look like a card but wasn't clickable at all — only
 * the tiny "View →" text next to an authored module actually went anywhere.
 * This has two real destinations per course (the course itself, and each of
 * its individual lessons), so it can't just be one big `<a>` — that would
 * nest the module links inside it, which is invalid HTML. Instead the course
 * title is a real `<a>` whose `::after` pseudo-element is stretched
 * (`absolute inset-0`) to the panel (`.panel` is `position: relative`), so
 * clicking the card's chrome activates the course link exactly like clicking
 * the title.
 *
 * The cost of that technique, and the thing this file has to get right: per
 * CSS 2.1 Appendix E, within one stacking context every *non-positioned*
 * in-flow descendant paints in steps 4-6 and every *positioned* descendant
 * with `z-index: auto` paints later, in step 7 — so a `position: static`
 * element paints **underneath** a positioned one no matter where it sits in
 * the DOM. Hit-testing follows painting order. Left alone, the stretched
 * (positioned) `::after` therefore covers the description, the prerequisite
 * line, the stats block, the progress caption and the module rows: a mouse
 * drag over any of that text hits the empty pseudo-element instead of the
 * text, so none of it can be selected or copied.
 *
 * The fix is to raise every element that is *real readable text* out of that
 * tie:
 *
 *   - `isolate` on the panel makes it a stacking context, so the z-indices
 *     below are scoped to one card and can never interact with page chrome.
 *   - Each text block carries `relative z-10`. A positive z-index paints in
 *     step 9 — strictly above the step-7 `::after` — which makes this
 *     independent of DOM order. (Bare `relative` would also work for blocks
 *     that follow the title in tree order, since step-7 siblings paint in
 *     tree order, but that is a fragile thing to depend on when someone
 *     later reorders the header.)
 *   - Each authored module row is its own `<a>` to its lesson and carries
 *     the same `relative z-10`, so module clicks reach the module, not the
 *     course.
 *   - The same applies to the prerequisite links in the "Requires …" line.
 *     A raised block with a positive z-index is itself a stacking context,
 *     so links *inside* one are raised with it and are genuinely clickable
 *     and independently focusable — a link left under the overlay would look
 *     like a link and quietly navigate somewhere else.
 *
 * What deliberately stays *under* the overlay, and so stays clickable as
 * "the card": the panel's padding, the gaps between blocks, the decorative
 * progress bar, the `Course NN` index label, and the title itself. That is
 * still the great majority of the card's area, so "click the card, go to the
 * course" holds; what changes is that a click landing on a paragraph of real
 * text selects that text instead of navigating — which is the correct
 * behaviour for text, and is now also what the hover affordance predicts,
 * since `has-[a[data-course-link]:hover]` only fires for pointer positions
 * that would actually activate the course link.
 *
 * Tab order falls out of this for free and never duplicates: the course
 * title link, then each prerequisite link, then each authored module's
 * lesson link, in document order. There is deliberately no separate
 * "View course →" button — the card itself is the way in.
 *
 * ------------------------------------------------------------
 * Overlay audit — every element in this card, checked
 * ------------------------------------------------------------
 * Re-verified element by element this pass; nothing was found still trapped
 * under the overlay. Recorded so the next reader doesn't have to redo it:
 *
 *   RAISED (`relative z-10`, selectable, independently clickable):
 *     description · "Requires …" line and each prerequisite link · the
 *     "Leads to …" line and each dependent link · the right-hand stats block
 *     (DifficultyMark, hours, CourseProgressBadge) · the module manifest's
 *     `<summary>` (a real control — under the overlay it would look like a
 *     disclosure and navigate to the course instead) and the manifest it
 *     opens · every module row, authored (a link to its lesson) and
 *     unauthored (a plain span) alike.
 *
 *   DELIBERATELY UNDER the overlay, i.e. still "click the card":
 *     the panel padding and the gaps between blocks · the `Course NN` index
 *     label · the course title itself (it *is* the link) · the progress bar,
 *     which is `aria-hidden` `data-decorative` with no text to select.
 *
 * The one thing worth not "fixing" later: raising the `Course NN` label or
 * the progress bar would carve two more holes in the card's click target for
 * no gain — neither is text anyone copies, and the bar carries no content at
 * all.
 *
 * ------------------------------------------------------------
 * Deciding before clicking, and why the manifest folds
 * ------------------------------------------------------------
 * A card has to answer five questions before a reader commits: what it
 * teaches (the title and description), roughly what level (`DifficultyMark`
 * and the hours), what it assumes ("Requires …"), what it leads to ("Leads
 * to …"), and how much of it exists (the bar and the manifest summary). Only
 * the fourth was missing, and it is the one that turns a catalog entry into
 * a position in a curriculum: it is the reverse prerequisite edge, computed
 * from `COURSES`, so a new course that lists this one appears here with no
 * authoring.
 *
 * The module manifest answers a sixth question — "which lessons exactly" —
 * and that one is not a *decision* question, it is what you read after you
 * have decided. Open by default it was also the single largest thing on
 * `/learn`: measured at 375px, the 32 manifests were 13,074px of a
 * 38,397px page, a third of the whole scroll, and `/learn` is the page a
 * reader lands on from "Browse the curriculum". So it is a native
 * `<details>`, collapsed, with the authoring-completeness caption that used
 * to sit under the progress bar promoted to its summary — the caption was
 * already the one-line description of what is inside, so the fold costs a
 * row rather than adding one. Every lesson link is one keystroke or tap
 * away, and every course also has its own page with the manifest open.
 */
export function CourseList({
  courses,
  lessons,
}: {
  courses: Course[];
  lessons: LessonMetaWithSlug[];
}) {
  return (
    <div className="space-y-5">
      {courses.map((course, index) => {
        const lessonByModule = new Map(
          lessons.filter((lesson) => lesson.course === course.slug).map((lesson) => [lesson.module, lesson])
        );
        const totalModules = course.modules.length;
        const authoredModules = course.modules.filter((module) => lessonByModule.has(module.slug)).length;
        // `totalModules > 0` guard: a course authored with zero modules (not
        // currently in the data, but not impossible) would otherwise read
        // `0 === 0` and render as "0/0 lessons · complete".
        const isContentComplete = totalModules > 0 && authoredModules === totalModules;
        const authoredLessonSlugs = course.modules
          .map((module) => lessonByModule.get(module.slug)?.slug)
          .filter((slug): slug is string => Boolean(slug));
        // Resolved to whole courses, not just titles: a reader who doesn't
        // recognise a prerequisite needs to be able to go read about it, the
        // way `PrerequisiteStatus` (on /courses/<slug>) and
        // `PrerequisiteReadout` (on lesson pages) already let them.
        const prerequisiteCourses = course.prerequisites
          .map((slug) => getCourse(slug))
          .filter((prerequisite): prerequisite is Course => Boolean(prerequisite));
        // The forward edge, read straight off the graph: the courses that
        // name this one as a prerequisite. Cross-track dependents carry their
        // track name, because "this Computing course opens a Hardware course"
        // is the fact a reader is scanning a track page for and the title
        // alone does not say it.
        const dependentCourses = COURSES.filter((candidate) =>
          candidate.prerequisites.includes(course.slug)
        );
        const shownDependents = dependentCourses.slice(0, MAX_LEADS_TO_SHOWN);
        const hiddenDependentCount = dependentCourses.length - shownDependents.length;
        const progressPercent = totalModules > 0 ? Math.round((authoredModules / totalModules) * 100) : 0;
        const courseHref = getCourseHref(course.slug, authoredLessonSlugs[0]);
        // Two facts on one baseline: what opening this shows you, and how
        // much of it exists. The second half is the caption that used to sit
        // alone under the progress bar and is the only thing distinguishing
        // authoring completeness from the reader's own progress badge above.
        const manifestAuthoring = isContentComplete
          ? "all written"
          : `${authoredModules} written so far`;

        return (
          <Panel
            key={course.slug}
            as="article"
            // `article` is one of the roles a screen reader announces on
            // entry, and a page of ten of them announced "article" ten times
            // with nothing to tell them apart. `<article>` takes a name (unlike
            // the bare `div` this primitive defaults to, where ARIA forbids
            // one and the attribute is dropped), so naming it costs nothing
            // and makes the card list navigable by container.
            aria-label={course.title}
            className={cn(
              "isolate overflow-hidden border-l-2 border-l-pillar-edge p-5 transition-colors duration-(--dur-fast) ease-instrument sm:p-6",
              // `border-l-pillar`, not `border-l-pillar-accent`: the pillar
              // ramp is exposed to Tailwind as `pillar`/`pillar-edge`/
              // `pillar-wash`/… (globals.css §"Pillar ramp"), and `pillar`
              // *is* `--pillar-accent`. `pillar-accent` is not a registered
              // color, so that class name compiles to nothing at all and the
              // whole-card hover affordance silently does not exist.
              "has-[a[data-course-link]:hover]:border-l-pillar has-[a[data-course-link]:hover]:bg-surface-muted/40",
              "has-[a[data-course-link]:focus-visible]:border-l-pillar has-[a[data-course-link]:focus-visible]:bg-surface-muted/40"
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              {/* `min-w-0`: `max-w-2xl` is only a ceiling, not a shrink hint,
                  so without this the column's own `min-width: auto` (its
                  widest unbreakable word, e.g. in the title or description)
                  could still exceed the row's available width at 200% text
                  zoom (WCAG 1.4.4), by as little as a few px — enough to
                  clip through the card's `overflow-hidden`. */}
              <div className="min-w-0 max-w-2xl">
                <TechLabel>Course {String(index + 1).padStart(2, "0")}</TechLabel>
                {/* `[overflow-wrap:anywhere]`: the display face is large
                    enough (`text-xl`/`sm:text-2xl`) that at 200% text zoom a
                    single long word in the title ("Approximation") can, on
                    its own, exceed the column's available width by a few px
                    even with normal wrapping between words (WCAG 1.4.4). */}
                <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight [overflow-wrap:anywhere] sm:text-2xl">
                  <Link
                    href={courseHref}
                    data-course-link
                    className="text-foreground underline-offset-4 after:absolute after:inset-0 after:content-[''] hover:text-pillar-text hover:underline focus-visible:text-pillar-text"
                  >
                    {course.title}
                  </Link>
                </h3>
                <p className="relative z-10 mt-2 text-sm leading-relaxed text-muted-foreground">
                  {course.description}
                </p>
                {prerequisiteCourses.length > 0 ? (
                  // `relative z-10` raises this whole line — and with it the
                  // links inside, which paint in this element's own stacking
                  // context — clear of the stretched `::after`. Without it the
                  // overlay would sit on top and every one of these links would
                  // silently navigate to *this* course instead of the
                  // prerequisite, which is worse than the plain text it
                  // replaces. They are inline links inside a sentence, so the
                  // 44px target rule doesn't apply (WCAG 2.5.8's inline
                  // exception) and inflating them would break the line.
                  <p className="relative z-10 mt-3 text-xs text-subtle-foreground">
                    <span className="font-tech uppercase tracking-meta">Requires </span>
                    {prerequisiteCourses.map((prerequisite, prerequisiteIndex) => (
                      <span key={prerequisite.slug}>
                        {prerequisiteIndex > 0 ? ", " : null}
                        <Link
                          href={getCourseHref(prerequisite.slug)}
                          className="underline decoration-border-strong underline-offset-2 transition-colors hover:text-pillar-text hover:decoration-pillar-edge focus-visible:text-pillar-text"
                        >
                          {prerequisite.title}
                        </Link>
                      </span>
                    ))}
                  </p>
                ) : null}
                {shownDependents.length > 0 ? (
                  // Same `relative z-10` reasoning as the "Requires" line
                  // above, and the same inline-link exception to the 44px
                  // target rule. The two lines are deliberately the same
                  // voice and the same size: they are the two directions of
                  // one edge, and a reader should be able to read the card's
                  // position in the graph in one glance down its left edge.
                  <p className="relative z-10 mt-1.5 text-xs text-subtle-foreground">
                    <span className="font-tech uppercase tracking-meta">Leads to </span>
                    {shownDependents.map((dependent, dependentIndex) => {
                      // The short track name, not the full pillar title:
                      // "Advanced Topics in Quantum Mechanics (Quantum
                      // Mechanics)" spends nine characters restating the end
                      // of the title it annotates. `pillarVisual` is the same
                      // short-label source the filter chips and the jump nav
                      // use, so one vocabulary across the page.
                      const dependentTrack =
                        dependent.pillar === course.pillar
                          ? undefined
                          : pillarVisual(dependent.pillar).short;
                      return (
                        <span key={dependent.slug}>
                          {dependentIndex > 0 ? ", " : null}
                          <Link
                            href={getCourseHref(dependent.slug)}
                            className="underline decoration-border-strong underline-offset-2 transition-colors hover:text-pillar-text hover:decoration-pillar-edge focus-visible:text-pillar-text"
                          >
                            {dependent.title}
                          </Link>
                          {dependentTrack ? <span> ({dependentTrack})</span> : null}
                        </span>
                      );
                    })}
                    {hiddenDependentCount > 0 ? <span> and {hiddenDependentCount} more</span> : null}
                  </p>
                ) : null}
              </div>

              {/* `min-w-0`, not `shrink-0`: the header row above is already
                  `flex-wrap`, but a `shrink-0` column still renders at its
                  own max-content width even alone on its own wrapped line —
                  `DifficultyMark`'s ticks-plus-label alone can exceed the
                  card's available width at 200% text zoom (WCAG 1.4.4).
                  `min-w-0` lets this column (and, through it, `DifficultyMark`'s
                  own internal `flex-wrap`) actually give up width. */}
              <div className="relative z-10 flex min-w-0 flex-col items-end gap-2.5">
                <DifficultyMark difficulty={course.difficulty} />
                {/* Just the length here. The "N/M lessons" fraction that used
                    to sit beside it said exactly what the progress bar and its
                    caption below already say, two inches apart and in a
                    different phrasing, which is what made the two numbers on
                    this card read as one confusing signal. One statement of
                    how much is written (the bar), one of how much *you* have
                    read (the badge). */}
                <span className="font-tech text-xs text-subtle-foreground">
                  {course.estimatedHours}h<span className="sr-only"> of study</span>
                </span>
                <CourseProgressBadge lessonSlugs={authoredLessonSlugs} />
              </div>
            </div>

            {/* Content-authoring completeness — how much of the course is
                *written*, not the reader's own progress. That distinction is
                easy to lose: `CourseProgressBadge` just above renders the
                visitor's own completed-lesson count in the same pillar hue,
                inches away. This caption is the disambiguator; without it
                the two read as one signal. */}
            <div className="mt-4">
              <div
                aria-hidden="true"
                data-decorative=""
                className="h-1 w-full overflow-hidden rounded-full bg-surface-muted"
              >
                <div
                  className="h-full rounded-full bg-pillar transition-[width] duration-(--dur-slow) ease-instrument"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* The caption that used to sit alone under the bar is now this
                disclosure's summary. "Content available — 47%" named neither
                whose progress it was nor what the missing 53% would be; the
                counts say it outright, in the same words the manifest inside
                uses, and the visitor's own progress is the separately-labelled
                badge above.

                `relative z-10` for the same reason every other real control on
                this card carries it: left under the stretched `::after` it
                would look like a disclosure and navigate to the course
                instead. `w-fit` keeps the raised box tight around the words,
                so only they — not the empty strip beside them — come out of
                the card's click target.

                `max-w-full` plus `flex-wrap` on top of that `w-fit`: per
                CLAUDE.md's own note, `w-fit` is `width: fit-content`, which
                never shrinks below its children's combined min-content — the
                icon, "N lessons", "·" and "all written"/"N written so far"
                all sitting on one un-wrapping line. At 200% text zoom that
                combined run measured 328px against a 228px card (WCAG
                1.4.4), spilling out through the panel's `overflow-hidden`
                well past its edge. `max-w-full` caps the box at the width
                `w-fit` is trying to hug *within*, and `flex-wrap` lets the
                line genuinely break there instead of just being capped and
                still overflowing. */}
            <details className="group/manifest mt-3">
              <summary
                className={cn(
                  "relative z-10 flex w-fit max-w-full flex-wrap min-h-11 cursor-pointer list-none items-center gap-x-2 gap-y-1",
                  "rounded-(--radius-tight) pr-1 tech-label text-subtle-foreground",
                  "transition-colors hover:text-foreground",
                  "[&::-webkit-details-marker]:hidden"
                )}
              >
                <svg
                  aria-hidden="true"
                  data-decorative=""
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  className="h-3.5 w-3.5 shrink-0 text-pillar-text transition-transform group-open/manifest:rotate-90"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m7.5 5 5 5-5 5" />
                </svg>
                <span className="min-w-0 text-muted-foreground [overflow-wrap:anywhere]">
                  {totalModules} lesson{totalModules === 1 ? "" : "s"}
                </span>
                <span aria-hidden="true" data-decorative="">
                  ·
                </span>
                <span className="min-w-0 [overflow-wrap:anywhere]">{manifestAuthoring}</span>
              </summary>

              <ol className="relative z-10 mt-3 grid gap-2 sm:grid-cols-2">
              {course.modules.map((module, moduleIndex) => {
                const lesson = lessonByModule.get(module.slug);
                return (
                  // No `overflow-hidden` here, and that is the whole point of
                  // this comment. The `<Link>` below is a block-level flex that
                  // fills this element's content box exactly, and the site's
                  // one focus treatment is an *outline* with a 2px offset
                  // (globals.css §5), so a focused module row painted its
                  // indicator in the band from 2px to 4px outside the link's
                  // border box — which is 1px to 3px outside this `<li>`'s
                  // padding box, i.e. entirely in the region `overflow: hidden`
                  // clips. Every lesson link in every course card was therefore
                  // focusable with no visible focus indicator at all (WCAG
                  // 2.4.7), and the only remaining cue was a background tint
                  // identical to the hover state. The radius moves onto the
                  // link itself, which is what `overflow-hidden` was rounding
                  // in the first place.
                  <li
                    key={module.slug}
                    className={cn(
                      "rounded-(--radius-tight) border text-sm",
                      lesson ? "border-border bg-surface-muted/40" : "border-border/60 bg-transparent"
                    )}
                  >
                    {lesson ? (
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="group/module relative z-10 flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 rounded-(--radius-tight) px-3 py-2 transition-colors duration-(--dur-fast) ease-mech hover:bg-surface-muted focus-visible:bg-surface-muted"
                      >
                        <span className="flex min-w-0 items-baseline gap-2">
                          <span className="font-tech text-micro text-subtle-foreground">
                            {String(moduleIndex + 1).padStart(2, "0")}
                          </span>
                          {/* The *lesson's* title, not the module's. They
                              happen to agree for every lesson written so far,
                              but they are two independent fields (`Module.title`
                              in curriculum.ts vs `lessonMeta.title` in the .mdx)
                              and only one of them names where this link goes.
                              Link text has to describe its destination, so the
                              destination's own title wins; the module title is
                              the fallback for the "coming soon" branch below,
                              where there is no lesson to name. */}
                          {/* Wraps; it used to `truncate`, and the arithmetic
                              says truncation ate the title at every width the
                              site targets. At a 320px viewport `Container`
                              leaves 288px, this `Panel` takes 2px + 1px of
                              border and 2 x 20px of `p-5`, so the `<ol>` cell
                              is 245px; the `<li>` border leaves 243px and the
                              link's `px-3` leaves 219px. The right-hand group
                              ("45 min" is 6 monospace characters at 0.65rem,
                              about 37px, plus a 10px gap and the arrow) takes
                              54px, the `gap-3` takes 12px and the "01" index
                              plus its gap takes 21px, leaving 132px. At 14px
                              body text that is about 19 characters, so
                              "Superposition and Interference" arrived as
                              "Superposition an...". The two-column grid at `sm`
                              is no better: 640px gives a 266px cell and the
                              same clamp at about 22 characters. A module
                              manifest exists to name its lessons, so the row
                              grows to two lines instead of the name being
                              destroyed. `min-h-11` already sized the row for
                              touch, and `items-baseline` on this group keeps
                              the "01" on the first line's baseline. */}
                          <span className="text-foreground group-hover/module:text-pillar-text">
                            {lesson.title}
                          </span>
                        </span>
                        {/* `ml-auto`, not `justify-between` on the row: at
                            200% text zoom this group's own min-content width
                            (icon + "45 min", both un-shrinkable atomic
                            content) can exceed what is left beside the title,
                            and `justify-between` on a no-wrap flex row has no
                            way to relieve that short of clipping it — which is
                            exactly the WCAG 1.4.4 failure this replaced. The
                            row now carries `flex-wrap`, so this group drops to
                            its own line when it does not fit, and `ml-auto`
                            keeps it flush right whether it shares the first
                            line or owns a second one (an auto margin absorbs
                            all the free space before the item on its line,
                            which for a lone wrapped item is the whole line).
                            Not `shrink-0` either, even once wrapped alone:
                            a `shrink-0` item still renders at its own
                            max-content width regardless of what line it is
                            on, so at 2x zoom "45 min" alone could still be
                            wider than the row and clip. `min-w-0` lets this
                            group (and via default `flex-shrink`, its "45 min"
                            child) actually give up width down to wrapping
                            between "45" and "min" if it has to. */}
                        <span className="ml-auto flex min-w-0 items-center gap-2.5">
                          <LessonCompletionMark slug={lesson.slug} />
                          <span className="font-tech text-micro tabular-nums text-subtle-foreground [overflow-wrap:anywhere]">
                            {lesson.estimatedMinutes} min
                          </span>
                          {/* `max-sm:hidden`: this is a hover affordance, and a
                              phone has no hover, so below `sm` it was 17px of
                              permanently invisible glyph (6.7px of arrow plus a
                              10px gap) taken out of a 132px title budget — more
                              than two characters of every lesson name, spent on
                              something no touch reader can ever see. */}
                          <span
                            aria-hidden="true"
                            data-decorative=""
                            className="font-tech text-meta text-pillar-text opacity-0 transition-opacity duration-(--dur-fast) max-sm:hidden group-hover/module:opacity-100 group-focus-visible/module:opacity-100"
                          >
                            →
                          </span>
                        </span>
                      </Link>
                    ) : (
                      // Not a link — there is no lesson to open yet — but it is
                      // still a module title a reader may want to copy, so it
                      // is raised out of the stretched link's paint layer for
                      // the same reason the paragraphs above are.
                      <span className="relative z-10 flex min-h-11 items-center justify-between gap-3 px-3 py-2">
                        <span className="flex min-w-0 items-baseline gap-2">
                          <span className="font-tech text-micro text-subtle-foreground">
                            {String(moduleIndex + 1).padStart(2, "0")}
                          </span>
                          {/* Wraps, for the same measurement as the authored
                              row above: "Coming soon" is 11 monospace
                              characters in the `.tech-label` voice (0.6875rem
                              at 0.14em), about 90px, so this branch leaves the
                              module title even less room than the lesson link
                              does. `shrink-0` here plus `min-w-0` on the title
                              means the title absorbs the difference rather
                              than the row overflowing. */}
                          <span className="text-muted-foreground">{module.title}</span>
                        </span>
                        <span className="shrink-0 tech-label text-subtle-foreground">
                          Coming soon
                        </span>
                      </span>
                    )}
                  </li>
                );
              })}
              </ol>
            </details>
          </Panel>
        );
      })}
    </div>
  );
}
