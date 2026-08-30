"use client";

import Link from "next/link";
import { useCompletedLessonSlugs } from "@/lib/content/progress";
import { TechLabel, TechValue } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import type { ReadinessCourse } from "./readiness";

/**
 * ============================================================
 * The two-audience bridge
 * ============================================================
 * `/apex` and `/mastery` are the two pages where an advanced reader decides
 * whether this site is serious, and they are also, inevitably, pages a
 * reader arrives at far too early, from search or from the pillar nav. The
 * honest signposting those pages already carry ("for readers who've finished
 * the core curriculum") tells that second reader they're early but not what
 * to do about it, which is the part that reads as a wall.
 *
 * So this answers the follow-up precisely rather than generically: which of
 * the assumed prerequisite courses are already done, how many courses the
 * prerequisite graph actually puts between a standing start and this pillar,
 * and the *name* of the specific first course that isn't finished, resolved
 * from `prerequisiteChain`'s topological walk of the real `prerequisites`
 * data, never a hand-typed "start with the basics".
 *
 * Register discipline: this is a status readout in the same technical voice
 * as everything else on these two pages, not an encouragement. No "don't
 * worry", no "you've got this", no gate. Nothing on either page is locked,
 * the copy says so, because an advanced reader who genuinely does have the
 * background from elsewhere must not be told to go take a course.
 *
 * A thin client leaf per docs/DESIGN_SYSTEM.md §10: the only cross-boundary
 * import is `lib/content/progress` (explicitly allowed, client-side storage
 * by design) plus a type-only import from `./readiness`, which is erased at
 * compile time and so never pulls the curriculum registry into the bundle.
 * The caller does the whole graph walk server-side and passes flat arrays.
 *
 * Done / partial / not-started is never color-only: a filled check, a ring
 * with a solid core, and a hollow ring are three shape states (the same
 * principle as `DifficultyMark`'s filled/hollow ticks and
 * `PrerequisiteReadout`'s check glyph), each with an `sr-only` text label.
 */

type Status = "done" | "partial" | "none" | "unwritten";

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

export function ReadinessReadout({
  pillarLabel,
  direct,
  chain,
  className,
  label = "Prerequisites assumed",
}: {
  /** How this pillar is named in prose, e.g. "Apex", "Quantum Mastery". */
  pillarLabel: string;
  /** The pillar's direct, out-of-pillar prerequisite courses. */
  direct: ReadinessCourse[];
  /** The full transitive prerequisite ancestry, topologically ordered. */
  chain: ReadinessCourse[];
  className?: string;
  label?: string;
}) {
  const completedSlugs = useCompletedLessonSlugs();

  if (direct.length === 0) return null;

  function statusOf(course: ReadinessCourse): Status {
    if (course.lessonSlugs.length === 0) return "unwritten";
    const done = course.lessonSlugs.filter((slug) => completedSlugs.has(slug)).length;
    if (done === 0) return "none";
    if (done === course.lessonSlugs.length) return "done";
    return "partial";
  }

  // Courses with no authored lessons yet are excluded from every count,
  // reporting one as permanently unfinished would be a fact about the
  // curriculum's authoring state, not about the reader.
  const graded = direct.filter((course) => course.lessonSlugs.length > 0);
  const doneCount = graded.filter((course) => statusOf(course) === "done").length;
  const allDone = graded.length > 0 && doneCount === graded.length;

  const gradedChain = chain.filter((course) => course.lessonSlugs.length > 0);
  const outstanding = gradedChain.filter((course) => statusOf(course) !== "done");
  const startHere = outstanding[0] ?? graded.find((course) => statusOf(course) !== "done");
  const nothingRecorded = completedSlugs.size === 0;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <TechLabel as="p">{label}</TechLabel>
        <TechValue className="text-xs text-subtle-foreground">
          {graded.length === 0
            ? "not yet authored"
            : allDone
              ? `all ${graded.length} complete`
              : `${doneCount} / ${graded.length} complete`}
        </TechValue>
      </div>

      <ul className="mt-2.5 flex flex-wrap gap-2">
        {direct.map((course) => {
          const status = statusOf(course);
          return (
            <li key={course.slug} className="max-w-full">
              <Link
                href={course.href}
                // `min-h-11` (44px) rather than larger type or more padding:
                // the chip reads at the same size, the tappable box grows
                // around it. `leading-tight` so a long title that wraps to two
                // lines inside the taller chip doesn't collide with itself.
                className={cn(
                  // `max-w-full` so a long course title wraps inside the chip
                  // at 320px instead of pushing the row into a horizontal
                  // scroll.
                  "inline-flex min-h-11 max-w-full items-center gap-2 rounded-full border px-3.5 py-2 text-sm leading-tight",
                  "transition-colors duration-(--dur-fast) ease-mech",
                  status === "done"
                    ? "border-pillar-edge bg-pillar-wash text-pillar-text"
                    : "border-border-strong text-foreground/90 hover:border-pillar-edge hover:text-pillar-text focus-visible:border-pillar-edge focus-visible:text-pillar-text"
                )}
              >
                <StatusGlyph status={status} />
                <span>{course.title}</span>
                <span className="tech-label shrink-0 text-subtle-foreground">{course.pillarLabel}</span>
                <span className="sr-only">
                  {status === "done"
                    ? " (completed)"
                    : status === "partial"
                      ? " (partly completed)"
                      : status === "unwritten"
                        ? " (no lessons authored yet)"
                        : " (not started)"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 max-w-reading text-sm leading-relaxed text-muted-foreground">
        {allDone ? (
          <>
            Every course {pillarLabel} assumes is complete. Nothing on this page was
            gated in the first place; now the index below is also the right place to
            start.
          </>
        ) : startHere ? (
          <>
            {nothingRecorded
              ? "No completed lessons are recorded in this browser, so this reads as a standing start. "
              : `${outstanding.length} of the ${gradedChain.length} courses ${pillarLabel} is built on ${pluralize(outstanding.length, "is", "are")} still outstanding. `}
            {nothingRecorded ? (
              <>
                The prerequisite graph puts {gradedChain.length}{" "}
                {pluralize(gradedChain.length, "course", "courses")} between that and{" "}
                {pillarLabel}. The first is{" "}
              </>
            ) : (
              <>The earliest one still open is </>
            )}
            <Link
              href={startHere.href}
              className="text-foreground underline decoration-border-strong underline-offset-2 transition-colors duration-(--dur-fast) ease-mech hover:text-pillar-text hover:decoration-pillar-edge focus-visible:text-pillar-text"
            >
              {startHere.title}
            </Link>
            , in <span className="tech-label text-subtle-foreground">{startHere.pillarLabel}</span>.
            Read on regardless if you have this background from elsewhere. None of it is locked.
          </>
        ) : null}
      </p>
    </div>
  );
}

/**
 * Three states, three shapes, legible in grayscale, in forced-colors mode,
 * and to a reader who can't distinguish the pillar hue from the border hue:
 * filled disc + check (done), ring + solid core (partly done), hollow ring
 * (not started or nothing to start yet).
 */
function StatusGlyph({ status }: { status: Status }) {
  return (
    <svg aria-hidden="true" data-decorative="" viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0">
      {status === "done" ? (
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
      ) : status === "partial" ? (
        <>
          <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth={1.3} opacity={0.55} />
          <circle cx="8" cy="8" r="2.75" className="fill-current" />
        </>
      ) : (
        <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth={1.3} opacity={0.55} />
      )}
    </svg>
  );
}
