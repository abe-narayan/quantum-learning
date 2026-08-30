import Link from "next/link";
import { TechLabel } from "@/components/ui/Typography";
import { Instrument } from "@/components/ui/Panel";
import type { Course, LessonMetaWithSlug, PillarInfo } from "@/lib/content/types";
import { cn } from "@/lib/utils";

const CARD_INTERACTIVE =
  "panel group flex min-h-11 flex-col justify-center gap-1.5 px-5 py-4 transition-[border-color,background-color,transform] duration-(--dur-fast) ease-instrument hover:border-pillar-edge hover:bg-surface-muted motion-safe:hover:-translate-y-0.5";

/** A next-step link inside the "course complete" panel. Block-level and
 *  44px-tall so the whole row is the target, rather than a short run of
 *  underlined text a thumb has to find. */
const NEXT_STEP_ROW =
  "flex min-h-11 items-center justify-between gap-3 rounded-(--radius-tight) px-3 py-2 -mx-3 text-sm text-pillar-text transition-colors hover:bg-surface-muted";

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
  /**
   * Courses to offer on finishing this one, resolved by `nextCoursesAfter` in
   * LessonLayout (the same computation `/courses/[slug]` runs). `alsoNeeds`
   * is the suggestion's *other* prerequisites, the ones finishing this course
   * does not supply, and is empty for a course the reader can start straight
   * away. Startable suggestions come first.
   */
  nextCourseSuggestions: { course: Course; lesson: LessonMetaWithSlug; alsoNeeds: Course[] }[];
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

  /**
   * The standing links at the foot of the "course complete" panel: look back
   * at the course just finished, and — when nothing in the curriculum builds
   * on it — a way onward that is not the course itself.
   *
   * Both rows used to be one link to `courseHref` under two different
   * labels, so a terminal course (the last one in its pillar, where the
   * reader has genuinely run out of curriculum and needs the most help)
   * showed a row reading "Browse more courses" that went back to the page
   * for the course they had just completed. The label promised the one thing
   * the destination could not do. Two rows, two destinations, and the pillar
   * index is a real onward move because it lists that pillar's other
   * courses. Never empty while `finishedCourse` is set: `courseHref` is
   * resolved from that same course by `getCourseHref`, and the second row
   * falls back to `/learn` with no pillar.
   *
   * The onward row is suppressed only when a suggestion above it is genuinely
   * startable, which is the one case where it would be a third competing
   * answer to a question already answered. A suggestion the reader cannot
   * open yet ("Also needs …") does not count as an answer, so a course whose
   * every forward edge is blocked keeps its way out.
   */
  const hasStartableSuggestion = nextCourseSuggestions.some(
    (suggestion) => suggestion.alsoNeeds.length === 0
  );
  const escapeRoutes: { href: string; label: string }[] = [
    ...(courseHref ? [{ href: courseHref, label: "Review this course" }] : []),
    ...(hasStartableSuggestion
      ? []
      : [
          pillar
            ? { href: `/learn#${pillar.slug}`, label: `More in ${pillar.title}` }
            : { href: "/learn", label: "Browse all courses" },
        ]),
  ];

  return (
    // `max-w-reading` is the lesson page's reading measure
    // (docs/DESIGN_SYSTEM.md); `max-w-3xl` is 48rem and left this nav's right
    // edge 32px outside the `FadeRule` and completion instrument directly
    // above it. See the matching note in LessonMetaStrip.tsx.
    <nav aria-label="Lesson navigation" className="mt-12 max-w-reading">
      <TechLabel className="text-subtle-foreground">What&rsquo;s next</TechLabel>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {prevLesson ? (
          <Link href={`/lessons/${prevLesson.slug}`} className={CARD_INTERACTIVE}>
            {/* The arrow is a direction cue for the eye, not a word. Left
                bare it was announced literally — VoiceOver reads "←" as
                "left arrow", so this card opened with "left arrow previous
                lesson" — and the sr-only cost of that is paid on every one
                of the 219 lesson pages. Marked decorative, matching the
                bare "→" glyphs already handled that way further down this
                file; "Previous lesson" plus the title carries the whole
                meaning on its own. */}
            <span className="tech-label text-subtle-foreground">
              <span aria-hidden="true" data-decorative="">
                {"← "}
              </span>
              Previous lesson
            </span>
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
            <span className="tech-label text-pillar-text">
              Next lesson
              <span aria-hidden="true" data-decorative="">
                {" →"}
              </span>
            </span>
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
                  {nextCourseSuggestions.map(({ course: suggestedCourse, lesson, alsoNeeds }) => (
                    <li key={suggestedCourse.slug}>
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className={cn(NEXT_STEP_ROW, "items-start")}
                      >
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span>Start {suggestedCourse.title}</span>
                          {/* The clause that stops this being a wall. Half the
                              graph's forward edges point at a course with a
                              second, unmet prerequisite, and an unannotated
                              link sent the reader to a page telling them they
                              were not ready. Naming the specific gap turns
                              that into an itinerary. Same wording as
                              `/courses/[slug]`, deliberately, so the two
                              surfaces read as one voice. */}
                          {alsoNeeds.length > 0 ? (
                            <span className="text-xs text-subtle-foreground">
                              Also needs {alsoNeeds.map((needed) => needed.title).join(" and ")}
                            </span>
                          ) : null}
                        </span>
                        <span aria-hidden="true" data-decorative="" className="mt-0.5">
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
                escape from a terminal course was a single small text link.

                The two labels also need two different destinations, which
                they did not have. Both used to resolve to `courseHref`, so on
                a terminal course — the last course of a pillar, the one case
                where the reader has genuinely run out of curriculum and needs
                the most help — a row reading "Browse more courses" linked
                back to the course page of the course they had just finished.
                The label promised the one thing the link could not do. A
                terminal course now gets both rows: the review link it always
                had, plus a real way out, into the rest of its pillar. */}
            {escapeRoutes.length > 0 ? (
              <div className="mt-2 border-t border-border pt-1">
                {escapeRoutes.map((route) => (
                  <Link key={route.href} href={route.href} className={NEXT_STEP_ROW}>
                    <span>{route.label}</span>
                    <span aria-hidden="true" data-decorative="">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
          </Instrument>
        ) : showFallbackCard ? (
          <Link
            href={fallbackHref}
            className={cn(CARD_INTERACTIVE, "items-end border-l-2 border-l-pillar-edge text-right sm:col-start-2")}
          >
            <span className="tech-label text-subtle-foreground">
              Continue
              <span aria-hidden="true" data-decorative="">
                {" →"}
              </span>
            </span>
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
              /* The overflow pointer named the panel by its old label,
                 "Lineage", which was jargon; it also named the wrong half of
                 it. These are lessons this one feeds *into*, which that panel
                 files under "Resurfaces in", not under its prerequisites. */
              <li className="inline-flex items-center px-1 text-sm text-subtle-foreground">
                +{hiddenUnlockCount} more under &ldquo;Resurfaces in&rdquo; above
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}
    </nav>
  );
}
