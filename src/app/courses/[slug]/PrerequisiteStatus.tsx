"use client";

import { useCompletedLessonSlugs } from "@/lib/content/progress";

/**
 * ============================================================
 * "Do I already have this prerequisite?", a readout, not a control
 * ============================================================
 * Answers the beginner question the course page's server component cannot.
 * A thin client leaf, per docs/DESIGN_SYSTEM.md §10, it only imports
 * `lib/content/progress` (explicitly allowed there; client-side storage by
 * design), never a content registry. The caller resolves the prerequisite
 * course's authored lesson slugs server-side and passes only that flat array
 * down.
 *
 * Three constraints this component has to hold, all of them consequences of
 * *where* it renders, inline inside a prerequisite row that is itself a
 * `<Link>` to that course:
 *
 *   1. **Nothing interactive.** Only `<span>` and `<svg>` come out of here.
 *      A `<button>`, an `<a>`, or anything with a click handler would be an
 *      interactive element nested inside an anchor, invalid HTML, and
 *      unreachable-or-duplicated for keyboard and screen-reader users.
 *   2. **Nothing that *looks* interactive.** It deliberately does not use
 *      the filled pill shape that `CourseProgressBadge` and the site's
 *      `Badge` use: sitting inside a clickable row, a bordered pill with a
 *      wash fill reads as a second, smaller button. This is drawn in the
 *      plain technical-readout voice instead (`font-tech`, uppercase, no
 *      border, no fill), the same register as `Readouts`, which is what it
 *      actually is.
 *   3. **Never color alone.** Done vs. not-done is carried by three
 *      redundant channels: the word ("Completed" / "Not started" / "3/8
 *      done"), the glyph shape (filled check-in-circle vs. hollow circle),
 *      and only then the color. Matches `PrerequisiteReadout`'s CheckGlyph
 *      on the lesson pages so the two never teach different vocabulary.
 *
 * Renders nothing for a prerequisite with no authored lessons yet, there is
 * no reader progress to report, and a permanent "not started" chip on a
 * course with zero content would just be noise (mirrors CourseProgressBadge's
 * same call). The caller's row degrades cleanly to title + difficulty. A
 * course with *no prerequisites at all* never mounts this component: the page
 * renders its "No course comes before this one" state instead.
 */
export function PrerequisiteStatus({ lessonSlugs }: { lessonSlugs: string[] }) {
  const completedSlugs = useCompletedLessonSlugs();
  if (lessonSlugs.length === 0) return null;

  const doneCount = lessonSlugs.filter((slug) => completedSlugs.has(slug)).length;
  const isComplete = doneCount === lessonSlugs.length;
  const label = doneCount === 0 ? "Not started" : isComplete ? "Completed" : `${doneCount}/${lessonSlugs.length} done`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 tech-label",
        isComplete ? "text-pillar-text" : "text-subtle-foreground"
      )}
    >
      <StatusGlyph done={isComplete} started={doneCount > 0} />
      {/* Without this the row announces as "…, Advanced, Completed", which
          could plausibly be read as the *difficulty* being completed. */}
      <span className="sr-only">Your progress: </span>
      {label}
    </span>
  );
}

/**
 * Filled check-in-circle when done, half-marked circle when part-way, hollow
 * circle when untouched, three distinguishable *shapes*, so the state
 * survives grayscale, forced-colors mode, and every form of color blindness
 * without depending on the text alone either.
 */
function StatusGlyph({ done, started }: { done: boolean; started: boolean }) {
  return (
    <svg aria-hidden="true" data-decorative="" viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0">
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
        <>
          <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth={1.3} opacity={0.6} />
          {started ? <path d="M8 1.75 A6.25 6.25 0 0 1 8 14.25 Z" className="fill-current" opacity={0.55} /> : null}
        </>
      )}
    </svg>
  );
}

// Local, dependency-free class joiner, pulling in `@/lib/utils` here would
// be fine size-wise, but this component's whole point is to be the smallest
// possible client leaf, so it avoids even that import.
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
