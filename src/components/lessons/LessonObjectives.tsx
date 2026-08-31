import { TechLabel } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

/**
 * ============================================================
 * Objectives: a control, not a block
 * ============================================================
 * The objectives list is the last of the pre-content blocks
 * docs/BEGINNER_REVIEW.md counted in its "five stacked instruments before
 * 'Motivation'" — and the tallest of them: expanded, a three-objective lesson
 * spends 203px of a 375x812 phone on it, a five-objective one closer to 280,
 * sitting between the reader and the first sentence of the teaching.
 *
 * It cannot be deleted or moved below the body. "What will I be able to do
 * after this?" is exactly the question a reader landing cold on a
 * mid-curriculum lesson needs answered *before* committing ten minutes.
 *
 * ------------------------------------------------------------
 * Why it now folds for everyone, and not only for the expert
 * ------------------------------------------------------------
 * This used to open expanded on foundational and intermediate lessons and
 * collapsed on advanced/master ones, on the reasoning that beginners land on
 * the former and need the orientation. The reasoning was right about who
 * lands where and wrong about what it costs them: the entry lesson is
 * precisely the page where the fold is worth the most, because it is the one
 * lesson whose lede is short enough for the teaching to reach the first
 * viewport once this block is a single row. Measured at 375x812, folding it
 * moves `What Is a Qubit?`'s first teaching paragraph from 905px (a screenful
 * below the fold) to inside the first screen. The expanded list bought a
 * beginner three sentences they had not asked for at the price of never
 * seeing the lesson start.
 *
 * Nothing becomes invisible. The summary is written to *advertise* rather
 * than merely to exist — it states the count and what the items are ("3
 * things you'll be able to do") — so a collapsed disclosure never reads as
 * chrome the eye can skip, and one tap restores the list. A native
 * `<details>` gives keyboard operation, the expanded/collapsed state
 * announcement and zero client JS for free; the rotating chevron plus the
 * browser's own state announcement mean the open/closed distinction is never
 * carried by colour.
 *
 * The trigger is deliberately shaped like `TableOfContentsMobile`'s: the two
 * sit side by side in one row under the lesson header (see `LessonLayout`),
 * and a reader should be able to read them as a pair of previews on the same
 * lesson rather than as two unrelated widgets.
 */
export function LessonObjectives({
  objectives,
  className,
}: {
  objectives: string[];
  className?: string;
}) {
  if (objectives.length === 0) return null;

  return (
    <details className={cn("group", className)}>
      <summary
        className={cn(
          "flex min-h-11 cursor-pointer list-none items-center justify-between gap-3",
          "rounded-panel border border-border bg-surface-muted/60 px-4 py-2.5 text-left",
          "transition-colors hover:bg-surface-muted",
          "[&::-webkit-details-marker]:hidden"
        )}
      >
        <span className="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <TechLabel>Objectives</TechLabel>
          <span className="text-sm text-muted-foreground">
            {objectives.length} thing{objectives.length === 1 ? "" : "s"} you&rsquo;ll be able to do
          </span>
        </span>
        <svg
          aria-hidden="true"
          data-decorative=""
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          className="h-4 w-4 shrink-0 text-pillar-text transition-transform group-open:rotate-180"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 7.5 5 5 5-5" />
        </svg>
      </summary>
      <ol className="mt-2 space-y-2 rounded-panel border border-border bg-surface px-4 py-3.5">
        {objectives.map((objective, i) => (
          <li
            key={objective}
            className="flex gap-3 text-sm leading-relaxed text-foreground/90 sm:text-base"
          >
            <span className="tech-value shrink-0 pt-px text-xs text-pillar-text">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{objective}</span>
          </li>
        ))}
      </ol>
    </details>
  );
}
