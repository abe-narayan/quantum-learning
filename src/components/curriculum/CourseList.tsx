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
 *     right-hand stats block (DifficultyMark, hours, "N/M lessons",
 *     CourseProgressBadge) · the "Content available — N%" caption (`w-fit`,
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
            className={cn(
              "isolate overflow-hidden border-l-2 border-l-pillar-edge p-5 transition-colors duration-[--dur-fast] ease-[--ease-instrument] sm:p-6",
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
                    <span className="font-tech uppercase tracking-[0.1em]">Requires </span>
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
                <div className="flex flex-wrap items-center justify-end gap-x-2 gap-y-1 font-tech text-xs text-subtle-foreground">
                  <span>{course.estimatedHours}h</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {authoredModules}/{totalModules} lessons{isContentComplete ? " · complete" : ""}
                  </span>
                </div>
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
                  className="h-full rounded-full bg-pillar transition-[width] duration-[--dur-slow] ease-[--ease-instrument]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {/* `w-fit` keeps the raised box tight around the caption text
                  rather than spanning the panel, so only the words — not the
                  empty strip beside them — come out of the card click target. */}
              <p className="relative z-10 mt-1.5 w-fit font-tech text-[0.65rem] uppercase tracking-[0.1em] text-subtle-foreground">
                Content available — {progressPercent}%
              </p>
            </div>

            <ol className="mt-5 grid gap-2 sm:grid-cols-2">
              {course.modules.map((module, moduleIndex) => {
                const lesson = lessonByModule.get(module.slug);
                return (
                  <li
                    key={module.slug}
                    className={cn(
                      "overflow-hidden rounded-lg border text-sm",
                      lesson ? "border-border bg-surface-muted/40" : "border-border/60 bg-transparent"
                    )}
                  >
                    {lesson ? (
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="group/module relative z-10 flex min-h-11 items-center justify-between gap-3 px-3 py-2 transition-colors duration-[--dur-fast] ease-[--ease-mech] hover:bg-surface-muted focus-visible:bg-surface-muted"
                      >
                        <span className="flex min-w-0 items-baseline gap-2">
                          <span className="font-tech text-[0.65rem] text-subtle-foreground">
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
                          <span className="truncate text-foreground group-hover/module:text-pillar-text">
                            {lesson.title}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2.5">
                          <LessonCompletionMark slug={lesson.slug} />
                          <span className="font-tech text-[0.65rem] tabular-nums text-subtle-foreground">
                            {lesson.estimatedMinutes} min
                          </span>
                          <span
                            aria-hidden="true"
                            data-decorative=""
                            className="font-tech text-[0.7rem] text-pillar-text opacity-0 transition-opacity duration-[--dur-fast] group-hover/module:opacity-100"
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
                          <span className="font-tech text-[0.65rem] text-subtle-foreground">
                            {String(moduleIndex + 1).padStart(2, "0")}
                          </span>
                          <span className="truncate text-muted-foreground">{module.title}</span>
                        </span>
                        <span className="shrink-0 font-tech text-[0.65rem] uppercase tracking-wide text-subtle-foreground">
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
