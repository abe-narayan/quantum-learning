"use client";

import Link from "next/link";
import { COURSES, getCourse } from "@/lib/content/curriculum";
import { useCompletedLessonSlugs } from "@/lib/content/progress";
import { DifficultyMark, DIFFICULTY_HINT } from "./DifficultyMark";
import { getCourseHref } from "./courseHref";
import { cn } from "@/lib/utils";
import { DIFFICULTY_LABEL, type Course, type Difficulty, type LessonMetaWithSlug, type Pillar } from "@/lib/content/types";

/** Ramp order for the legend below. Declared here rather than derived from
 *  `Object.keys(DIFFICULTY_LABEL)`, whose order is an implementation detail of
 *  that object literal and would silently reorder the legend if it changed. */
const DIFFICULTY_LEGEND_ORDER: Difficulty[] = [
  "foundational",
  "intermediate",
  "advanced",
  "master",
];

const PILLAR_LABEL: Record<Pillar, string> = {
  "quantum-mechanics": "Mechanics",
  "quantum-computing": "Computing",
  "quantum-hardware": "Hardware",
  "quantum-software": "Software",
  "quantum-mastery": "Mastery",
  apex: "Apex",
};

/**
 * A horizontal (desktop) / vertical (mobile) progression rail of a pillar's
 * courses in real curriculum order, sitting above `CourseList` on each
 * pillar page. Each station mirrors `CourseList`'s exact completion math
 * (same `lessonByModule` derivation, same `useCompletedLessonSlugs()`
 * source) so the two views never disagree.
 *
 * Two things make this genuinely a *timeline* rather than a row of icons:
 * the connecting segment between two stations fills solid once the earlier
 * station is complete (so "how far have I actually gotten" reads at a
 * glance, not just "is this one done"), and any course another pillar's
 * course depends on gets a small "→ Pillar" marker, surfacing a real
 * cross-pillar dependency edge instead of only the within-pillar order.
 *
 * Each station's text block is a real link to its course (via the shared
 * `getCourseHref` — see that file for why the destination is conditional).
 * It wraps the title/meta text rather than the circle, because the
 * circle-and-connector row above it is pure decoration (`aria-hidden`) and
 * carries no accessible content of its own; `group` on the `<li>` lets the
 * circle pick up a matching hover highlight even though it sits outside the
 * anchor, so the station still reacts as one unit.
 *
 * The anchor carries an explicit `aria-label` because its contents are a
 * whole block — title, progress status, difficulty ticks, lesson count,
 * dependent-pillar markers and a "Requires: …" line. Without a label the
 * computed accessible name would concatenate all of that into one run-on
 * sentence, which is the same "the link is named with a paragraph" failure
 * this sprint fixed in `MechanicsSection`. The label keeps the *name* short
 * (title plus the one status fact the aria-hidden circle would otherwise
 * carry visually only); everything else stays readable in browse mode, where
 * it belongs. There is no stretched-`::after` overlay here, so nothing paints
 * over neighbouring static text the way it does in `CourseList`.
 */
export function CourseTimeline({
  courses,
  lessons,
}: {
  courses: Course[];
  lessons: LessonMetaWithSlug[];
}) {
  const completedSlugs = useCompletedLessonSlugs();

  return (
    // Three classes, three separate failures they each prevent:
    //
    // `overflow-x-auto` — the rail is `sm:min-w-max` by design and is routinely
    //   wider than the page.
    // `min-w-0` — whenever this lands inside a flex or grid item, that item's
    //   default `min-width: auto` resolves to the rail's max-content width, so
    //   the *parent* track grows to 2871px and this box never has anything
    //   left to scroll. That is what gave every `/courses/<slug>` page a
    //   horizontal scrollbar.
    // `relative` — the subtle one, and the one that actually caused a
    //   1357px-wide horizontal scroll on `/learn` and every track page.
    //   Tailwind's `sr-only` is `position: absolute`, and each course in this
    //   rail carries one ("— Not started"). An absolutely-positioned element
    //   is clipped by an ancestor scroll container only when its *containing
    //   block* is inside that container. With this div `position: static`,
    //   the containing block resolved past it to the nearest positioned
    //   ancestor — `FullBleed` — so ten invisible 1px spans sat outside the
    //   clip at x-offsets up to 2871px and dragged the document's scroll
    //   width out with them. Nothing was visible out there; the page just
    //   scrolled sideways into empty space. Making this the containing block
    //   brings them back inside the clip.
    <div className="relative min-w-0 overflow-x-auto">
      {/* Built from `DIFFICULTY_HINT`, not hand-copied. `DifficultyMark`'s own
          comment says that map exists "for CourseTimeline's legend line — kept
          here too so the two never drift apart", but this legend was a literal
          string and had already drifted (its wording and casing no longer
          matched the tooltip a reader gets by hovering the very ticks this
          legend explains). One source, two renderings. */}
      <p className="mb-4 max-w-2xl text-xs leading-relaxed text-subtle-foreground">
        {DIFFICULTY_LEGEND_ORDER.map((level, index) => (
          <span key={level}>
            {index > 0 ? " · " : null}
            <span className="text-muted-foreground">{DIFFICULTY_LABEL[level]}</span> ={" "}
            {DIFFICULTY_HINT[level].toLowerCase()}
          </span>
        ))}
      </p>
      <ol className="flex flex-col sm:min-w-max sm:flex-row sm:items-stretch">
        {courses.map((course, index) => {
          const lessonByModule = new Map(
            lessons
              .filter((lesson) => lesson.course === course.slug)
              .map((lesson) => [lesson.module, lesson])
          );
          const totalModules = course.modules.length;
          // Content-authoring completeness — identical math to CourseList's
          // "X/Y lessons" readout (how many modules have a written lesson).
          const authoredModules = course.modules.filter((module) =>
            lessonByModule.has(module.slug)
          ).length;
          const contentComplete = totalModules > 0 && authoredModules === totalModules;
          const authoredLessonSlugs = course.modules
            .map((module) => lessonByModule.get(module.slug)?.slug)
            .filter((slug): slug is string => Boolean(slug));
          // Visitor's own progress — identical source to CourseProgressBadge
          // (useCompletedLessonSlugs()), drives the station's ring/checkmark
          // and the fill on the connector leading out of it.
          const visitorCompleted = authoredLessonSlugs.filter((slug) =>
            completedSlugs.has(slug)
          ).length;
          const isComplete = authoredModules > 0 && visitorCompleted === authoredModules;
          const isStarted = visitorCompleted > 0 && !isComplete;
          const isLast = index === courses.length - 1;
          const prerequisiteTitles = course.prerequisites
            .map((slug) => getCourse(slug)?.title)
            .filter((title): title is string => Boolean(title));

          // Cross-pillar courses (in other pillars) that list this course as
          // a prerequisite — surfaced as a small "-> Hardware" style marker.
          const dependentPillars = Array.from(
            new Set(
              COURSES.filter(
                (other) =>
                  other.pillar !== course.pillar && other.prerequisites.includes(course.slug)
              ).map((other) => other.pillar)
            )
          );

          const courseHref = getCourseHref(course.slug, authoredLessonSlugs[0]);
          const statusLabel = isComplete ? "Complete" : isStarted ? "In progress" : "Not started";

          return (
            <li key={course.slug} className="group flex sm:min-w-[13rem] sm:flex-1 sm:flex-col">
              <div className="flex flex-col items-center sm:w-full sm:flex-row">
                <div
                  aria-hidden
                  data-decorative=""
                  className={cn(
                    "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 font-tech text-xs font-semibold transition-colors duration-(--dur-fast) ease-instrument group-hover:border-pillar group-focus-within:border-pillar",
                    isComplete
                      ? "border-pillar bg-pillar-wash text-pillar-text"
                      : isStarted
                        ? "border-pillar/60 bg-transparent text-pillar-text"
                        : "border-border bg-surface text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                      <path
                        d="M4 8.3 L6.6 11 L12 5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                {!isLast ? (
                  <div
                    aria-hidden
                    data-decorative=""
                    className={cn(
                      "w-0.5 flex-1 sm:h-0.5 sm:w-auto",
                      isComplete ? "bg-pillar" : "bg-border"
                    )}
                  />
                ) : null}
              </div>

              <Link
                href={courseHref}
                aria-label={`${course.title} — ${statusLabel}`}
                className="flex min-h-11 flex-col gap-2 rounded-(--radius-tight) py-2 pl-3 transition-colors duration-(--dur-fast) ease-instrument hover:bg-surface-muted sm:items-start sm:gap-2 sm:pb-8 sm:pl-0 sm:pt-3"
              >
                <p className="text-sm font-semibold leading-snug text-foreground transition-colors duration-(--dur-fast) ease-mech group-hover:text-pillar-text">
                  {course.title}
                  {/* The station circle (✓ / number, ring color) is `aria-hidden`
                      pure decoration — this is the only place a screen-reader
                      user gets the visitor-progress status it conveys visually
                      (the circle's own `title` attribute is unreachable once
                      the element is aria-hidden, so it's not a real fallback).
                      It is repeated in the anchor's `aria-label` so the status
                      survives the label override too. */}
                  <span className="sr-only">
                    {" — "}
                    {statusLabel}
                  </span>
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <DifficultyMark difficulty={course.difficulty} />
                  <span className="font-tech text-[0.65rem] uppercase tracking-wide text-subtle-foreground">
                    {authoredModules}/{totalModules} lessons{contentComplete ? " · complete" : ""}
                  </span>
                </div>
                {dependentPillars.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {dependentPillars.map((pillar) => (
                      <span
                        key={pillar}
                        className="rounded-full border border-border px-2 py-0.5 font-tech text-[0.6rem] uppercase tracking-wide text-subtle-foreground"
                      >
                        → {PILLAR_LABEL[pillar]}
                      </span>
                    ))}
                  </div>
                ) : null}
                {prerequisiteTitles.length > 0 ? (
                  <p className="text-xs text-subtle-foreground">
                    Requires: {prerequisiteTitles.join(", ")}
                  </p>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
