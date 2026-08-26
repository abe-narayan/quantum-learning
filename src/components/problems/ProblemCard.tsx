import Link from "next/link";
import { cn } from "@/lib/utils";
import { Panel } from "@/components/ui/Panel";
import { TechValue } from "@/components/ui/Typography";
import { getCourse } from "@/lib/content/curriculum";
import type { ProblemMeta } from "@/lib/problems/types";
import { DifficultyScale, TypeMark } from "./ProblemMetaMarks";

/**
 * A problem's own module slug follows one of two authored patterns when it
 * is the synthesis exercise for its course — `capstone-...` (Apex, Quantum
 * Mastery, and the later Quantum Computing courses) or `...-challenge(s)`
 * (the earlier Quantum Mechanics courses' end-of-course problem set). Both
 * are real naming conventions already used across `src/content/problems`
 * (56 problems across 21 lessons), not a new taxonomy invented for this
 * page — see the course capstone/challenge lessons themselves. Read off
 * `problem.lesson` alone (no registry import), so this is safe to call from
 * a client component.
 */
function isCapstoneProblem(problem: ProblemMeta): boolean {
  const moduleSlug = problem.lesson?.split("/").pop() ?? "";
  return moduleSlug.startsWith("capstone-") || /-challenges?$/.test(moduleSlug);
}

/** The small pillar-tinted pill marking a capstone/challenge problem — the
 *  course's own synthesis exercise, not routine practice. Text-labelled
 *  (never icon-only), and additive to (never a replacement for) the
 *  `DifficultyScale` ladder every problem already carries. */
function CapstoneTag() {
  return (
    <span className="tech-label !text-[0.625rem] rounded-full border border-pillar-edge px-2 py-0.5 text-pillar-text">
      Capstone
    </span>
  );
}

/** Shared "solved" affordance for the feature card — an explicit check
 *  glyph plus screen-reader text, never color alone. */
function SolvedMark({ solved }: { solved: boolean }) {
  if (!solved) return null;
  return (
    <span
      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-pillar-wash text-pillar-text"
      title="Solved"
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M2 6.2 5 9l5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only">Solved</span>
    </span>
  );
}

/** The row's version of the same affordance — rendered for every row
 *  (unsolved included) as a hollow-vs-filled ring, since "nothing there" on
 *  a dense list reads as missing content rather than "not solved yet."
 *  Decorative; the adjacent `sr-only` text in `ProblemRow` carries the
 *  state to assistive tech. */
function RowStatusMark({ solved }: { solved: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
        solved ? "border-transparent bg-pillar-wash text-pillar-text" : "border-border-strong text-transparent"
      )}
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path d="M2 6.2 5 9l5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/**
 * The feature treatment — a full `Panel`, reserved for a section's
 * `master`-tier problems (the site's hardest practice, promoted from
 * `advanced`; see `docs/UX_REVIEW.md` P0-3/P1-1). Everything else in the
 * catalog renders as a `ProblemRow` instead — see that component below and
 * `ProblemsCatalog`'s `splitFeatured`. Which course/pillar this belongs to
 * sets its identity (`data-pillar`), difficulty is the shared ladder plus a
 * label, and a solved problem gets an explicit checkmark readout rather
 * than only a color change. `solved` is optional so this still renders
 * correctly from a server context that hasn't read progress.
 */
export function ProblemCard({
  problem,
  solved = false,
  lessonTitle,
}: {
  problem: ProblemMeta;
  solved?: boolean;
  lessonTitle?: string;
}) {
  const course = getCourse(problem.course);
  const capstone = isCapstoneProblem(problem);

  return (
    <Link
      href={`/problems/${problem.slug}`}
      data-pillar={course?.pillar}
      className="group block h-full focus-visible:outline-none"
    >
      <Panel
        interactive
        className="flex h-full flex-col gap-3 p-5 focus-visible:outline-none group-focus-visible:border-pillar-accent group-focus-visible:ring-2 group-focus-visible:ring-pillar-accent group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground group-hover:text-pillar-text">
            {problem.title}
          </h3>
          <SolvedMark solved={solved} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <DifficultyScale difficulty={problem.difficulty} />
          <TypeMark type={problem.problemType} />
          {capstone ? <CapstoneTag /> : null}
        </div>

        {lessonTitle ? (
          <p className="text-xs leading-relaxed text-subtle-foreground">
            <span className="font-tech uppercase tracking-[0.1em]">From </span>
            {lessonTitle}
          </p>
        ) : null}

        {problem.tags.length > 0 ? (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {problem.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border px-2 py-0.5 text-[0.6875rem] text-subtle-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-subtle-foreground">
          <span>
            <TechValue className="text-foreground">{problem.estimatedMinutes}</TechValue> min
          </span>
          <span aria-hidden="true" className="text-pillar-text opacity-0 transition-opacity group-hover:opacity-100">
            Open →
          </span>
        </div>
      </Panel>
    </Link>
  );
}

/**
 * The dense treatment — a single scannable row, used for every problem that
 * isn't `master`-tier (the large majority; see `ProblemsCatalog`). A
 * foundational warm-up and an advanced problem both render this way: same
 * shape, because at that grain the difficulty ladder itself is the signal,
 * not the container's size. Everything a reader needs to decide whether to
 * open it — solved state, title, capstone marker, difficulty, type,
 * length, course and (when known) lesson — sits on one flex-wrapped line
 * that reflows rather than overflows at narrow widths.
 */
export function ProblemRow({
  problem,
  solved = false,
  lessonTitle,
}: {
  problem: ProblemMeta;
  solved?: boolean;
  lessonTitle?: string;
}) {
  const course = getCourse(problem.course);
  const capstone = isCapstoneProblem(problem);

  return (
    <Link
      href={`/problems/${problem.slug}`}
      data-pillar={course?.pillar}
      className="group -mx-3 flex items-center gap-3 rounded-[var(--radius-tight)] border-l-2 border-l-transparent px-3 py-2.5 transition-colors duration-[--dur-fast] ease-[--ease-instrument] hover:border-l-pillar-edge hover:bg-surface-muted/60 focus-visible:border-l-pillar-accent focus-visible:bg-surface-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pillar-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <RowStatusMark solved={solved} />
      <span className="sr-only">{solved ? "Solved. " : "Not solved yet. "}</span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="truncate text-sm font-medium text-foreground group-hover:text-pillar-text">
            {problem.title}
          </span>
          {capstone ? <CapstoneTag /> : null}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle-foreground">
          <DifficultyScale difficulty={problem.difficulty} />
          <TypeMark type={problem.problemType} />
          <span className="tech-value">
            {problem.estimatedMinutes}
            <span className="ml-0.5 text-[0.65rem] text-subtle-foreground">min</span>
          </span>
          {course ? <span className="truncate">{course.title}</span> : null}
          {lessonTitle ? (
            <span className="truncate text-subtle-foreground/80">
              <span aria-hidden="true">· </span>
              {lessonTitle}
            </span>
          ) : null}
        </span>
      </span>

      <span
        aria-hidden="true"
        className="shrink-0 text-sm text-pillar-text opacity-0 transition-opacity group-hover:opacity-100"
      >
        →
      </span>
    </Link>
  );
}
