import Link from "next/link";
import { TechLabel } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import type { Course, LessonMetaWithSlug, PillarInfo } from "@/lib/content/types";
import { cn } from "@/lib/utils";

const CARD_INTERACTIVE =
  "panel group flex min-h-11 flex-col justify-center gap-1.5 px-5 py-4 transition-[border-color,background-color,transform] duration-[--dur-fast] ease-[--ease-instrument] hover:border-pillar-edge hover:bg-surface-muted motion-safe:hover:-translate-y-0.5";

/** A next-step link inside the "course complete" panel. Block-level and
 *  44px-tall so the whole row is the target, rather than a short run of
 *  underlined text a thumb has to find. */
const NEXT_STEP_ROW =
  "flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 py-2 -mx-3 text-sm text-pillar-text transition-colors hover:bg-surface-muted";

/** Cap on how many "unlocks" lessons the footer names directly — beyond
 *  this, the full cross-course list (with pillar annotation) is still in
 *  LessonMetaStrip's "Resurfaces in" disclosure above; the footer's job is
 *  a motivating teaser, not the exhaustive index. */
const MAX_UNLOCKS_SHOWN = 4;

/**
 * The "what's next" moment. Keeps the previous implementation's behavior
 * exactly (prerequisite-graph-derived next-course suggestions, the terminal
 * "browse more" fallback) but replaces two flat bordered rectangles with a
 * discovery-shaped pairing: a quiet "previous" card and a next card/course
 * panel that carries the pillar's identity, so finishing a lesson reads as
 * forward motion rather than a form footer.
 *
 * This block never renders empty and never renders a half-empty grid. It
 * used to bail out entirely when a lesson had no prev/next/finished-course/
 * unlocks, and to leave a blank cell where the "Next" card belongs whenever
 * a lesson's course membership didn't resolve — both of which end the
 * reading experience on a dead end at precisely the moment the reader has
 * the most momentum. There is now always a forward target: the next lesson,
 * else the courses this one continues into, else the course page, else the
 * pillar, else the catalog.
 *
 * `unlocks` adds the other half of "I want to try another lesson": lessons
 * elsewhere in the curriculum that list *this* lesson as a prerequisite
 * (the same reverse-prerequisite-graph data LessonMetaStrip's "Resurfaces
 * in" already renders, computed for free, no authoring required). Previous/
 * next answers "what's adjacent"; this answers "what did finishing this
 * just make possible" — a concrete payoff for the reader who just spent
 * ten minutes on a lesson, not just a pointer to the next item in a queue.
 */
export function LessonFooterNav({
  prevLesson,
  nextLesson,
  finishedCourse,
  nextCourseSuggestions,
  pillar,
  unlocks,
  course,
  courseHref,
}: {
  prevLesson: LessonMetaWithSlug | null;
  nextLesson: LessonMetaWithSlug | null;
  finishedCourse: Course | undefined;
  nextCourseSuggestions: { course: Course; lesson: LessonMetaWithSlug }[];
  pillar: PillarInfo | undefined;
  unlocks: LessonMetaWithSlug[];
  /** The course this lesson belongs to, whether or not it is finished — used
   *  for the "back to the course" fallback below. */
  course?: Course | undefined;
  /** Resolved by `getCourseHref` in LessonLayout (the same decision point
   *  CourseList/CourseTimeline use), so this never hardcodes a route. */
  courseHref?: string | undefined;
}) {
  const shownUnlocks = unlocks.slice(0, MAX_UNLOCKS_SHOWN);
  const hiddenUnlockCount = unlocks.length - shownUnlocks.length;

  // "What do I do next" must never be answerable with "nothing." A lesson
  // whose course membership doesn't resolve (or which sits alone in its
  // course) previously rendered an empty grid cell where the Next card
  // should be — a literal dead end at the exact moment the reader is most
  // ready to continue. When there's no next lesson and no completed course
  // to celebrate, fall back to the course page, then the pillar, then the
  // catalog: one of those always exists.
  const fallbackHref = courseHref ?? (pillar ? `/learn#${pillar.slug}` : "/learn");
  const fallbackLabel = courseHref && course ? course.title : pillar ? pillar.title : "All courses";
  const showFallbackCard = !nextLesson && !finishedCourse;

  return (
    <nav aria-label="Lesson navigation" className="mt-12 max-w-3xl">
      <TechLabel className="text-subtle-foreground">What&rsquo;s next</TechLabel>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {prevLesson ? (
          <Link href={`/lessons/${prevLesson.slug}`} className={CARD_INTERACTIVE}>
            <span className="tech-label text-subtle-foreground">← Previous lesson</span>
            <p className="font-display text-base font-medium text-foreground group-hover:text-pillar-text">
              {prevLesson.title}
            </p>
          </Link>
        ) : (
          <div aria-hidden="true" />
        )}

        {nextLesson ? (
          <Link
            href={`/lessons/${nextLesson.slug}`}
            className={cn(CARD_INTERACTIVE, "items-end border-l-2 border-l-pillar-edge text-right sm:col-start-2")}
          >
            <span className="tech-label text-pillar-text">Next lesson →</span>
            <p className="font-display text-base font-medium text-foreground group-hover:text-pillar-text">
              {nextLesson.title}
            </p>
          </Link>
        ) : finishedCourse ? (
          <Instrument label="Course complete" className="sm:col-start-2">
            <p className="font-display text-lg font-semibold text-foreground">{finishedCourse.title}</p>
            {nextCourseSuggestions.length > 0 ? (
              <>
                <p className="mt-4 text-xs uppercase tracking-wide text-subtle-foreground">Continues into</p>
                <ul className="mt-1 space-y-0.5">
                  {nextCourseSuggestions.map(({ course: suggestedCourse, lesson }) => (
                    <li key={suggestedCourse.slug}>
                      <Link href={`/lessons/${lesson.slug}`} className={NEXT_STEP_ROW}>
                        <span>Start {suggestedCourse.title}</span>
                        <span aria-hidden="true" data-decorative="">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {/* Always offered, even when a next course exists: finishing the
                last lesson of a course is also the moment a reader wants to
                look back at what they just covered. Previously the only
                escape from a terminal course was a single small text link. */}
            <div className="mt-2 border-t border-border pt-1">
              <Link href={courseHref ?? (pillar ? `/learn#${pillar.slug}` : "/learn")} className={NEXT_STEP_ROW}>
                <span>
                  {nextCourseSuggestions.length > 0 ? "Review this course" : "Browse more courses"}
                </span>
                <span aria-hidden="true" data-decorative="">
                  →
                </span>
              </Link>
            </div>
          </Instrument>
        ) : showFallbackCard ? (
          <Link
            href={fallbackHref}
            className={cn(CARD_INTERACTIVE, "items-end border-l-2 border-l-pillar-edge text-right sm:col-start-2")}
          >
            <span className="tech-label text-subtle-foreground">Continue →</span>
            <p className="font-display text-base font-medium text-foreground group-hover:text-pillar-text">
              {fallbackLabel}
            </p>
          </Link>
        ) : (
          <div aria-hidden="true" />
        )}
      </div>

      {shownUnlocks.length > 0 ? (
        <div className="mt-6 border-t border-border pt-6">
          <TechLabel className="text-subtle-foreground">This unlocks</TechLabel>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Understanding this lesson feeds directly into:
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {shownUnlocks.map((lesson) => (
              <li key={lesson.slug}>
                <Link
                  href={`/lessons/${lesson.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-border-strong px-3.5 py-2 text-sm leading-tight text-foreground/90 transition-colors hover:border-pillar-edge hover:text-pillar-text"
                >
                  {lesson.title}
                </Link>
              </li>
            ))}
            {hiddenUnlockCount > 0 ? (
              <li className="inline-flex items-center px-1 text-sm text-subtle-foreground">
                +{hiddenUnlockCount} more in Lineage above
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
