import { TechLabel } from "@/components/ui/Typography";
import type { Difficulty } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * ============================================================
 * Objectives: density for the beginner, a fold for the expert
 * ============================================================
 * The objectives list is the last of the pre-content blocks
 * docs/BEGINNER_REVIEW.md counted in its "five stacked instruments before
 * 'Motivation'" — and the tallest of them: on a five-objective lesson it is
 * a numbered list roughly the height of the title, lede and instrument line
 * put together, sitting between the reader and the first sentence.
 *
 * It cannot simply be deleted or moved below the body. "What will I be able
 * to do after this?" is exactly the question a beginner landing cold on a
 * mid-curriculum lesson needs answered *before* committing ten minutes, and
 * the sprint brief is explicit that content must not become invisible until
 * you scroll.
 *
 * So the fold is conditional on who is likely reading:
 *
 * - **Foundational and intermediate lessons open expanded.** These are where
 *   beginners actually land, and for them the list is not friction, it's the
 *   orientation. Nothing changes for that reader.
 * - **Advanced and master lessons open collapsed.** Nobody reaches
 *   `apex/algorithmic-frontiers` cold; that reader knows what they came for
 *   and is paying the tallest block on the page for a list they already
 *   have. One click restores it.
 *
 * Either way the summary line is written to *advertise*, not merely to
 * exist: it states the count and what the items are ("4 things you'll be
 * able to do"), so a collapsed disclosure never reads as decorative chrome
 * the eye can skip. A native `<details>` gives keyboard operation, the
 * expanded/collapsed state announcement and zero client JS for free — and
 * the rotating chevron plus the browser's own state announcement mean the
 * open/closed distinction is never carried by color.
 */

/** Difficulty levels a cold beginner plausibly lands on — these keep the
 *  objectives list expanded. See the doc comment above. */
const EXPANDED_BY_DEFAULT: ReadonlySet<Difficulty> = new Set<Difficulty>([
  "foundational",
  "intermediate",
]);

export function LessonObjectives({
  objectives,
  difficulty,
  className,
}: {
  objectives: string[];
  difficulty: Difficulty;
  className?: string;
}) {
  if (objectives.length === 0) return null;

  const defaultOpen = EXPANDED_BY_DEFAULT.has(difficulty);

  return (
    <details
      open={defaultOpen}
      className={cn("group border-l-2 border-pillar-edge pl-5", className)}
    >
      <summary
        className={cn(
          "flex min-h-11 w-fit cursor-pointer list-none items-center gap-2.5 pr-2",
          "[&::-webkit-details-marker]:hidden"
        )}
      >
        <svg
          aria-hidden="true"
          data-decorative=""
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          className="h-3.5 w-3.5 shrink-0 text-pillar-text transition-transform group-open:rotate-90"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m7.5 5 5 5-5 5" />
        </svg>
        <TechLabel>Objectives</TechLabel>
        <span className="text-sm text-muted-foreground">
          {objectives.length} thing{objectives.length === 1 ? "" : "s"} you&rsquo;ll be able to do
        </span>
      </summary>
      <ol className="mb-1 mt-1.5 space-y-2">
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
