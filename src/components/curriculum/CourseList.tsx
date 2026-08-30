import Link from "next/link";
import { Panel } from "@/components/ui/Panel";
import { TechLabel } from "@/components/ui/Typography";
import { CourseProgressBadge } from "./CourseProgressBadge";
import { LessonCompletionMark } from "./LessonCompletionMark";
import { DifficultyMark } from "./DifficultyMark";
import { getCourseHref } from "./courseHref";
import { getCourse } from "@/lib/content/curriculum";
import { cn } from "@/lib/utils";
import type { Course, LessonMetaWithSlug } from "@/lib/content/types";

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
 *     right-hand stats block (DifficultyMark, hours, CourseProgressBadge) ·
 *     the "N of M lessons written" caption (`w-fit`,
 *     so only the words leave the card target) · every module row, authored
 *     (a link to its lesson) and unauthored (a plain span) alike.
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
        const progressPercent = totalModules > 0 ? Math.round((authoredModules / totalModules) * 100) : 0;
        const courseHref = getCourseHref(course.slug, authoredLessonSlugs[0]);

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
              <div className="max-w-2xl">
                <TechLabel>Course {String(index + 1).padStart(2, "0")}</TechLabel>
                <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight sm:text-2xl">
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
              </div>

              <div className="relative z-10 flex shrink-0 flex-col items-end gap-2.5">
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
              {/* `w-fit` keeps the raised box tight around the caption text
                  rather than spanning the panel, so only the words — not the
                  empty strip beside them — come out of the card click target. */}
              {/* "Content available — 47%" named neither whose progress this
                  is nor what the missing 53% would be. The counts say it
                  outright, in the same words the module manifest below uses,
                  and the visitor's own progress is the separately-labelled
                  badge above. */}
              <p className="relative z-10 mt-1.5 w-fit tech-label text-subtle-foreground">
                {isContentComplete
                  ? `All ${totalModules} lessons written`
                  : `${authoredModules} of ${totalModules} lessons written`}
              </p>
            </div>

            <ol className="mt-5 grid gap-2 sm:grid-cols-2">
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
                        className="group/module relative z-10 flex min-h-11 items-center justify-between gap-3 rounded-(--radius-tight) px-3 py-2 transition-colors duration-(--dur-fast) ease-mech hover:bg-surface-muted focus-visible:bg-surface-muted"
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
                        <span className="flex shrink-0 items-center gap-2.5">
                          <LessonCompletionMark slug={lesson.slug} />
                          <span className="font-tech text-micro tabular-nums text-subtle-foreground">
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
          </Panel>
        );
      })}
    </div>
  );
}
