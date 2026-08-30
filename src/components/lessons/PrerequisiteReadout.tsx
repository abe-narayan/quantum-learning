"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useCompletedLessonSlugs } from "@/lib/content/progress";
import { TechLabel } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import type { LessonMetaWithSlug } from "@/lib/content/types";
// Type-only, so it is erased at compile time and never drags `readiness.ts`
// (and through it `lib/content/curriculum`) across the client boundary. The
// whole graph walk happens in `LessonLayout`; this file receives flat arrays.
import type { ReadinessCourse } from "@/components/apex/readiness";

/**
 * ============================================================
 * "Do I have what I need?" — answered before the first sentence
 * ============================================================
 * docs/UX_REVIEW.md's P2-6 fix collapsed the old always-open "Lineage"
 * instrument (prerequisites + resurfaces-in + related-elsewhere, three
 * columns) into a `<details>` below the lesson body — the right call for
 * most of that block, since resurfacing/related links are nice-to-know, not
 * need-to-know-before-reading. But prerequisites are a different kind of
 * fact: a reader who lands on a mid-curriculum lesson from search, a
 * shared link, or the glossary has no way to discover they're missing
 * background until they're already lost a few paragraphs in — by which
 * point a disclosure below the body they never opened doesn't help.
 *
 * So this one piece of the old wall stays above the fold, but deliberately
 * does not reintroduce the metadata wall P2-6 removed: it's a single
 * compact row (a label, a completion readout, a line of chips), not a
 * multi-column bordered instrument. The full detail — cross-course
 * annotation, "resurfaces in", "related elsewhere" — still lives exactly
 * where P2-6 put it, in `LessonMetaStrip`'s collapsed disclosure below the
 * body. This component only surfaces enough to answer "what does this
 * assume, and where do I get it" at a glance, with a direct link to each.
 *
 * Completion is the other half of the honesty this component adds: a
 * beginner doesn't just need the *names* of the prerequisites (already
 * true before this component existed, just buried), they need to know
 * whether they personally already have them. `useCompletedLessonSlugs`
 * reads the same client-side progress store `LessonCompleteToggle` writes
 * to, so a reader who has already completed a prerequisite sees it marked
 * done instead of being told to go do it again.
 *
 * A thin client leaf per docs/DESIGN_SYSTEM.md §10 — the only cross-boundary
 * import is `lib/content/progress` (explicitly allowed there: client-side
 * storage by design, not a content registry). `LessonLayout` resolves the
 * actual prerequisite lessons server-side and passes only the flat,
 * already-shaped list down; this component never touches the lesson
 * corpus loader.
 *
 * Done/not-done is never color-only: a filled checkmark vs. a hollow ring
 * (a shape distinction, same principle as `DifficultyMark`'s filled/hollow
 * ticks) plus the "N/M complete" text readout carry the signal even in
 * grayscale.
 *
 * ============================================================
 * The distance line, and why "0 / 1 complete" needed one
 * ============================================================
 * The row above answers "what does this lesson name as its prerequisites",
 * and a beginner reads it as "how far away is this". Those are the same
 * question near the on-ramps and wildly different ones at the top of the
 * curriculum. On an Apex lesson whose single listed prerequisite is a Mastery
 * lesson, the row rendered `0 / 1 complete`, which a reviewer arriving from
 * search read as "one lesson away". The prerequisite graph put 110 lessons
 * behind that page. `/apex` had the honest number all along and said so
 * plainly, but a lesson page is reachable directly, from search, from Google,
 * from a shared link, without ever passing the track page, and there
 * `0 / 1 complete` is worse than saying nothing because it understates the
 * gap by two orders of magnitude.
 *
 * So `upstream` carries the transitive ancestry, walked server-side by
 * `lessonPrerequisiteChain` (the same `prerequisiteChain` function `/apex`
 * and `/mastery` call, rooted at one course instead of a pillar, so the
 * surfaces cannot drift apart), and the paragraph below reports it in the
 * track page's voice: the real distance, the name of the first course to read
 * instead as a link, and the fact that none of it is locked.
 *
 * When it fires, and why 60, is `DISTANT_UPSTREAM_LESSONS` in
 * `components/apex/readiness.ts`. It arrives here as a prop rather than an
 * import because that module reads the curriculum registry and must not cross
 * the boundary (docs/DESIGN_SYSTEM.md §10).
 */

/** Stable no-op subscription: the snapshot pair is the whole point. */
function subscribeToNothing() {
  return () => {};
}

function plural(count: number, singular: string, pluralForm: string) {
  return count === 1 ? singular : pluralForm;
}

/**
 * Which of the three sentences the readout opens with, or nothing at all.
 *
 * `graph` is the only one the server can honestly render: progress lives in
 * `localStorage`, so before hydration nothing about the reader is known and
 * the paragraph says only what the prerequisite graph says, which is true for
 * everyone. `standingStart` and `behind` are the reader-specific refinements
 * that replace it once hydration has actually read the store. That split is
 * what stops a returning reader watching a "no completed lessons are recorded"
 * claim get corrected: the pre-hydration text is a smaller true statement,
 * never a wrong number.
 */
export type DistanceVoice = "graph" | "standingStart" | "behind";

export type UpstreamDistance = {
  voice: DistanceVoice;
  /** Every authored lesson the graph puts before this one. */
  lessons: number;
  /** How many courses those lessons span. */
  courses: number;
  /** How many of them this reader has not marked complete. */
  unread: number;
  /** Index into `upstream` of the first course with anything left in it. */
  startHereIndex: number;
};

/**
 * The whole show/hide decision, pure and exported, so the states a reader can
 * be in are testable without a DOM or a storage mock.
 *
 * Takes flattened per-course counts rather than the courses themselves, so it
 * carries no content types and cannot become a second place the curriculum
 * graph is interpreted. `distantAt` is a parameter for the same reason the
 * component takes it as a prop: there is exactly one definition of the
 * threshold, and it is on the server side.
 */
export function upstreamDistance({
  lessonsPerCourse,
  unreadPerCourse,
  distantAt,
  hydrated,
  nothingRecorded,
  directPrerequisitesComplete,
}: {
  /** Authored lesson count per upstream course, in topological order. */
  lessonsPerCourse: number[];
  /** Of those, how many this reader has not completed, same order. */
  unreadPerCourse: number[];
  /** `DISTANT_UPSTREAM_LESSONS`, handed down by the server. */
  distantAt: number;
  hydrated: boolean;
  nothingRecorded: boolean;
  /** True when every lesson this one directly names is finished. */
  directPrerequisitesComplete: boolean;
}): UpstreamDistance | null {
  const lessons = lessonsPerCourse.reduce((total, count) => total + count, 0);
  const unread = unreadPerCourse.reduce((total, count) => total + count, 0);

  // A reader who has finished everything the lesson actually names is not the
  // reader this is for, whatever the graph behind them says. Nor is one who
  // has closed the distance to under a track's worth. Both get silence: this
  // is a readout, not a gate, and it must never become nagging.
  if (hydrated && directPrerequisitesComplete) return null;
  if ((hydrated ? unread : lessons) < distantAt) return null;

  const startHereIndex = hydrated ? unreadPerCourse.findIndex((count) => count > 0) : 0;
  if (startHereIndex < 0) return null;

  return {
    voice: !hydrated ? "graph" : nothingRecorded ? "standingStart" : "behind",
    lessons,
    courses: lessonsPerCourse.length,
    unread,
    startHereIndex,
  };
}

export function PrerequisiteReadout({
  prerequisites,
  upstream = [],
  distantAt,
}: {
  prerequisites: LessonMetaWithSlug[];
  /**
   * Every course the prerequisite graph puts before this lesson's own course,
   * topologically ordered, each with its authored lesson slugs. Empty unless
   * the server-side walk found enough of them to be worth reporting, so the
   * 147 lessons that can never cross the threshold carry no extra payload.
   */
  upstream?: ReadinessCourse[];
  /**
   * `DISTANT_UPSTREAM_LESSONS`. Travels with `upstream` as one decision: the
   * server applies it once to decide whether to send a chain at all, and the
   * client applies it again after hydration against the reader's own progress.
   * Absent means no distance readout, never a locally-invented default.
   */
  distantAt?: number;
}) {
  const completedSlugs = useCompletedLessonSlugs();
  // Progress lives in `localStorage`, so the server and the first client
  // render both see an empty set. Rather than let a returning reader watch a
  // "standing start" claim get corrected, everything the paragraph says
  // *about the reader* waits for this flag; everything it says about the
  // graph is true for everyone and renders server-side. So the pre-hydration
  // text is never a wrong number, it is a smaller true one.
  const hydrated = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );

  const doneCount = prerequisites.filter((lesson) => completedSlugs.has(lesson.slug)).length;
  const allDone = prerequisites.length > 0 && doneCount === prerequisites.length;

  const readout =
    distantAt === undefined
      ? null
      : upstreamDistance({
          lessonsPerCourse: upstream.map((course) => course.lessonSlugs.length),
          unreadPerCourse: upstream.map(
            (course) => course.lessonSlugs.filter((lesson) => !completedSlugs.has(lesson)).length
          ),
          distantAt,
          hydrated,
          nothingRecorded: completedSlugs.size === 0,
          directPrerequisitesComplete: allDone,
        });
  const startHere = readout ? upstream[readout.startHereIndex] : undefined;
  const upstreamLessonCount = upstream.reduce(
    (total, course) => total + course.lessonSlugs.length,
    0
  );

  const distance =
    readout && startHere ? <UpstreamDistanceLine readout={readout} startHere={startHere} /> : null;

  if (prerequisites.length === 0) {
    // A genuine on-ramp. The second sentence is for the reader who arrived
    // here directly (hero CTA, navbar Start, a shared link) and suspects
    // they were supposed to do some other track first: they weren't, and
    // saying so here costs one line.
    //
    // "You have not skipped anything" is only true when the graph agrees.
    // No lesson in the corpus today lists zero prerequisites while sitting
    // behind a deep ancestry, but nothing structurally prevents one, and that
    // lesson would carry the most confident false claim on the site. So the
    // claim is made against `upstream`, not against the empty chip row.
    if (upstreamLessonCount === 0) {
      return (
        <div className="mt-6 flex items-start gap-2 text-pillar-text">
          <CheckGlyph done />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">No prerequisites.</span> This is a
            starting point: you have not skipped anything, and no other lesson or track comes
            before it.
          </p>
        </div>
      );
    }
    return distance ? <div className="mt-6">{distance}</div> : null;
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <TechLabel>Before you start</TechLabel>
        <span className="tech-value text-xs text-subtle-foreground">
          {allDone ? `all ${prerequisites.length} complete` : `${doneCount} / ${prerequisites.length} complete`}
        </span>
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {prerequisites.map((lesson) => {
          const done = completedSlugs.has(lesson.slug);
          return (
            <li key={lesson.slug}>
              <Link
                href={`/lessons/${lesson.slug}`}
                // `min-h-11` (44px) rather than more padding or larger type:
                // the chip's text stays exactly the size it was, the tappable
                // box grows to the 44px minimum around it. `leading-tight`
                // replaces `leading-none` so a long prerequisite title that
                // wraps to two lines inside the taller chip doesn't collide
                // with itself.
                className={cn(
                  "inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm leading-tight transition-colors",
                  done
                    ? "border-pillar-edge bg-pillar-wash text-pillar-text"
                    : "border-border-strong text-foreground/90 hover:border-pillar-edge hover:text-pillar-text"
                )}
              >
                <CheckGlyph done={done} />
                {lesson.title}
                <span className="sr-only">{done ? ", completed" : ", not yet completed"}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      {distance}
    </div>
  );
}

/**
 * The distance sentence itself, in `/apex`'s voice and deliberately close to
 * its wording: the real number, the name of the first course to read instead
 * as a link, and the two closing sentences verbatim, because "read on
 * regardless" and "none of it is locked" are the site's promise and must not
 * be paraphrased into something weaker on 72 lesson pages.
 *
 * Split out and exported so a test can render each voice and read the prose
 * back. The component around it cannot be rendered into the `behind` or
 * `standingStart` states without a DOM: both depend on a `localStorage`
 * snapshot that only exists after hydration.
 */
export function UpstreamDistanceLine({
  readout,
  startHere,
}: {
  readout: UpstreamDistance;
  startHere: ReadinessCourse;
}) {
  return (
    <p className="mt-3 max-w-reading text-sm leading-relaxed text-muted-foreground">
      {readout.voice === "standingStart"
        ? "No completed lessons are recorded in this browser, so this reads as a standing start. "
        : null}
      The prerequisite graph puts {readout.lessons} {plural(readout.lessons, "lesson", "lessons")}{" "}
      {readout.courses === 1 ? "in" : "across"} {readout.courses}{" "}
      {plural(readout.courses, "course", "courses")} before this one
      {readout.voice === "behind" ? `, and ${readout.unread} of them are still unread` : ""}.{" "}
      {readout.voice === "behind" ? "The earliest one still open is " : "The first is "}
      <Link
        href={startHere.href}
        className="text-foreground underline decoration-border-strong underline-offset-2 transition-colors duration-(--dur-fast) ease-mech hover:text-pillar-text hover:decoration-pillar-edge focus-visible:text-pillar-text"
      >
        {startHere.title}
      </Link>
      , in <span className="tech-label text-subtle-foreground">{startHere.pillarLabel}</span>. Read
      on regardless if you have this background from elsewhere. None of it is locked.
    </p>
  );
}

function CheckGlyph({ done }: { done: boolean }) {
  return (
    <svg
      aria-hidden="true"
      data-decorative=""
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0"
    >
      {done ? (
        <>
          <circle cx="8" cy="8" r="7" className="fill-current" opacity={0.16} />
          <path
            d="M4.5 8.3 6.9 10.6 11.5 5.6"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth={1.3} opacity={0.55} />
      )}
    </svg>
  );
}
