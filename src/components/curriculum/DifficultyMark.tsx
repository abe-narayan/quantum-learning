import { cn } from "@/lib/utils";
import type { Difficulty } from "@/lib/content/types";
import { DIFFICULTY_LABEL } from "@/lib/content/types";

/**
 * ============================================================
 * The difficulty encoding — one instrument, everywhere it appears
 * ============================================================
 * Difficulty is a first-class signal across the site — course rows, timeline
 * stations, lesson search results, the lesson page header, and (translated
 * via `PROBLEM_TO_DIFFICULTY`) every problem card and problem page too — and
 * it must be legible to a color-blind visitor, not just a sighted one with
 * typical color vision. So the encoding is two redundant channels stacked
 * together:
 *
 *   1. Shape:  four ticks of increasing height, each either FILLED (solid)
 *      or HOLLOW (outline only) up to the course's level. Filled-vs-hollow
 *      is a shape distinction, not a hue distinction — it survives
 *      grayscale, protanopia, deuteranopia, everything.
 *   2. Text:   the level's name, always rendered in the technical voice
 *      right next to the ticks. Never icon-only.
 *
 * Both channels use the pillar accent for the "on" state, so the mark reads
 * as part of this page's identity — but removing color entirely (forced
 * grayscale, a monochrome print) still leaves the filled/hollow pattern and
 * the word "Advanced" fully legible. The label text itself is
 * `DIFFICULTY_LABEL`, exported from `lib/content/types.ts` (not redeclared
 * here) so every renderer of difficulty — this component, `structuredData.ts`,
 * problem cards — draws from the same map. See docs/UX_REVIEW.md P1-1.
 */

const DIFFICULTY_LEVEL: Record<Difficulty, number> = {
  foundational: 1,
  intermediate: 2,
  advanced: 3,
  master: 4,
};

/** Longer form, surfaced as a native tooltip and used by CourseTimeline's
 *  legend line — kept here too so the two never drift apart. */
export const DIFFICULTY_HINT: Record<Difficulty, string> = {
  foundational: "No prior background needed",
  intermediate: "Builds directly on earlier courses",
  advanced: "College-level rigor",
  master: "Graduate-level — proofs, not just results",
};

export function DifficultyMark({
  difficulty,
  className,
}: {
  difficulty: Difficulty;
  className?: string;
}) {
  const level = DIFFICULTY_LEVEL[difficulty];

  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      title={DIFFICULTY_HINT[difficulty]}
    >
      <span aria-hidden="true" data-decorative="" className="flex items-end gap-[3px]">
        {[1, 2, 3, 4].map((tick) => (
          <span
            key={tick}
            className={cn(
              "w-1.5 rounded-[1px] border",
              tick <= level ? "border-pillar bg-pillar" : "border-border-strong bg-transparent"
            )}
            style={{ height: `${4 + tick * 3}px` }}
          />
        ))}
      </span>
      <span className="font-tech text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {DIFFICULTY_LABEL[difficulty]}
      </span>
    </span>
  );
}
