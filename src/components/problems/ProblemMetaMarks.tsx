import { cn } from "@/lib/utils";
import type { ProblemDifficulty, ProblemType } from "@/lib/problems/types";
import { PROBLEM_TO_DIFFICULTY } from "@/lib/problems/types";
import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import { TYPE_LABEL } from "./problemDisplay";

/**
 * Problem difficulty renders through the exact same instrument courses and
 * lessons use — `DifficultyMark`'s four-tick ladder — rather than a
 * look-alike three-tick ladder of its own. Previously this component drew
 * its own three-tick scale, so an "Advanced" problem (top of a 3-level
 * scale) and an "Advanced" lesson (third of 4) looked identical despite
 * meaning different things; see docs/UX_REVIEW.md P0-3. `difficulty` is
 * translated onto the curriculum's `Difficulty` via `PROBLEM_TO_DIFFICULTY`
 * before rendering, so there is exactly one ladder shape on screen anywhere
 * on the site. Kept as its own named export (rather than having callers use
 * `DifficultyMark` directly) so `ProblemCard` and `ProblemLayout` keep
 * talking in `ProblemDifficulty`, the vocabulary problems are authored in.
 */
export function DifficultyScale({
  difficulty,
  className,
  withHint = false,
}: {
  difficulty: ProblemDifficulty;
  className?: string;
  /** Render `DIFFICULTY_HINT` as visible text rather than leaving it in the
   *  hover-only `title`. Passed by `ProblemLayout`'s context panel, where the
   *  reader has deliberately opened a disclosure to ask what the rung means —
   *  and where a tooltip would be useless anyway, since the panel's other
   *  reason for existing is that this page is read on a phone. */
  withHint?: boolean;
}) {
  return (
    <DifficultyMark
      difficulty={PROBLEM_TO_DIFFICULTY[difficulty]}
      className={className}
      withHint={withHint}
    />
  );
}

/** A small instrument glyph per problem type — paired with `TYPE_LABEL` text
 *  everywhere it's used, so it's a scanning aid, not the only signal. */
export function TypeGlyph({ type, className }: { type: ProblemType; className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0 text-muted-foreground", className)}
    >
      {type === "multiple-choice" ? (
        <>
          <circle cx="4" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="4" cy="3.5" r="0.75" fill="currentColor" />
          <circle cx="4" cy="10.5" r="2" stroke="currentColor" strokeWidth="1.2" />
        </>
      ) : null}
      {type === "numeric" ? (
        <>
          <path d="M1.5 7h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M3.5 3v2M6.5 3v2M9.5 3v2M3.5 9v2M6.5 9v2M9.5 9v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </>
      ) : null}
      {type === "conceptual" ? (
        <>
          <path d="M1.5 3.5h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M1.5 7h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M1.5 10.5h6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </>
      ) : null}
    </svg>
  );
}

/** The type glyph plus its text label — the small "what kind of answer does
 *  this take" chip reused by the card and the problem page header. */
export function TypeMark({ type, className }: { type: ProblemType; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 tech-label text-muted-foreground", className)}>
      <TypeGlyph type={type} />
      {TYPE_LABEL[type]}
    </span>
  );
}
