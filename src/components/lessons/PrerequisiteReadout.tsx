"use client";

import Link from "next/link";
import { useCompletedLessonSlugs } from "@/lib/content/progress";
import { TechLabel } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import type { LessonMetaWithSlug } from "@/lib/content/types";

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
 */
export function PrerequisiteReadout({ prerequisites }: { prerequisites: LessonMetaWithSlug[] }) {
  const completedSlugs = useCompletedLessonSlugs();

  if (prerequisites.length === 0) {
    return (
      <div className="mt-6 flex items-center gap-2 text-pillar-text">
        <CheckGlyph done />
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">No prerequisites.</span> This is a starting point.
        </p>
      </div>
    );
  }

  const doneCount = prerequisites.filter((lesson) => completedSlugs.has(lesson.slug)).length;
  const allDone = doneCount === prerequisites.length;

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <TechLabel>Before you start</TechLabel>
        <span className="tech-value text-xs text-subtle-foreground">
          {allDone ? `all ${prerequisites.length} complete` : `${doneCount} / ${prerequisites.length} complete`}
        </span>
      </div>
      <ul className="mt-2.5 flex flex-wrap gap-2">
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
                <span className="sr-only">{done ? " — completed" : " — not yet completed"}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
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
