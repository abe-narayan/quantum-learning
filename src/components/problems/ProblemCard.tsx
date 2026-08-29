import Link from "next/link";
import { cn } from "@/lib/utils";
import { Panel } from "@/components/ui/Panel";
import { TechValue } from "@/components/ui/Typography";
import { getCourse } from "@/lib/content/curriculum";
import { DIFFICULTY_LABEL } from "@/lib/content/types";
import { PROBLEM_TO_DIFFICULTY, type ProblemMeta } from "@/lib/problems/types";
import { DifficultyScale, TypeMark } from "./ProblemMetaMarks";
import { TYPE_LABEL } from "./problemDisplay";

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

/**
 * The accessible name for a whole-card link.
 *
 * Both treatments below make the *whole card* the problem's link — no
 * separate "View"/"Solve" button — but they do it with a stretched title
 * link (`after:absolute after:inset-0`) rather than an `<a>` wrapping the
 * card's contents. That change is what lets the card also carry a real link
 * to its source lesson: nesting one anchor inside another is invalid HTML
 * and unusable with a keyboard, so with the old shape the lesson could only
 * ever be inert text, and a stuck reader had nowhere to go from the catalog.
 * With the stretched link, the lesson link simply sits above the overlay
 * (`relative z-[1]`) and the rest of the card stays one big target.
 *
 * The cost of a stretched link is the accessible name: its name is the
 * concatenation of every descendant string, so a screen reader user tabbing
 * the catalog would hear the title, then the difficulty, the type, the
 * capstone marker, three tags, the minute count and the arrow, as one
 * run-on phrase per card — across hundreds of cards. Naming it explicitly
 * keeps the visible title first (so speech input and "Label in Name" still
 * work) and then states only the facts a reader actually decides on.
 */
function cardLabel(problem: ProblemMeta, solved: boolean, ready: boolean): string {
  const parts = [
    DIFFICULTY_LABEL[PROBLEM_TO_DIFFICULTY[problem.difficulty]],
    TYPE_LABEL[problem.problemType],
    `${problem.estimatedMinutes} min`,
  ];
  if (solved) parts.push("already solved");
  else if (ready) parts.push("prerequisites complete");
  return `${problem.title}. ${parts.join(", ")}.`;
}

/** The small pillar-tinted pill marking a capstone/challenge problem — the
 *  course's own synthesis exercise, not routine practice. Text-labelled
 *  (never icon-only), and additive to (never a replacement for) the
 *  `DifficultyScale` ladder every problem already carries. Outline-only, so
 *  it stays distinguishable from the filled `ReadyTag` beside it without
 *  relying on the two hues being told apart. */
function CapstoneTag() {
  return (
    <span className="tech-label !text-[0.625rem] rounded-full border border-pillar-edge px-2 py-0.5 text-pillar-text">
      Capstone
    </span>
  );
}

/**
 * "You've finished the lessons this one builds on."
 *
 * The catalog's answer to a beginner's real question — *which of these can I
 * actually attempt right now?* — and deliberately the positive form of it.
 * Marking the other 500 as not-yet-ready would put a discouraging chip on
 * nearly every row of a 547-problem list and imply a gate that does not
 * exist; marking the ready ones turns the same fact into a sparse, scannable
 * signal. Rendered only for a reader who has completed at least one lesson
 * (see `ProblemsCatalog`), because with no progress recorded the mark would
 * either be absent everywhere or meaningless everywhere. Nothing is locked:
 * every problem stays open to anyone who wants to try it cold.
 */
function ReadyTag() {
  return (
    <span className="tech-label !text-[0.625rem] rounded-full border border-pillar-edge bg-pillar-wash px-2 py-0.5 text-pillar-text">
      Ready
    </span>
  );
}

/** The small outbound mark on the lesson link — an arrow leaving its box, so
 *  the link reads as "goes somewhere else" rather than as another tag. */
function LessonArrow() {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M2.5 7.5 7.5 2.5M3.6 2.5h3.9v3.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * ============================================================
 * The way out of a card
 * ============================================================
 * Every problem in `src/content/problems` (547 of them) declares the lesson
 * it belongs to, and both treatments already *named* that lesson — but as
 * inert text, because the whole card used to be one `<a>` and an anchor
 * cannot contain another. So a beginner scanning the catalog could read
 * "from: Measurement and the Born rule", decide they didn't know that yet,
 * and have nowhere to click. That is the single highest-value link on this
 * page: the reader who needs it is by definition the reader who cannot
 * answer the problem.
 *
 * Sits above the stretched title link (`z-[1]`) so it wins the click over
 * the card overlay beneath it, and is the only interactive element on a card
 * besides that overlay — the "one card, one destination" rule is relaxed to
 * exactly two, both of them named.
 *
 * Degrades in three steps rather than truncating: with a resolved title it
 * names the lesson; with a lesson slug whose title didn't resolve (a lesson
 * renamed out from under a problem) it still links, under a plain generic
 * label, because the destination is the useful part; with no lesson at all
 * it renders nothing and the card simply shows its course instead. A row
 * therefore never ends up with a dangling "· " and half a title.
 *
 * `dense` is the row's variant, and its shape is dictated by the 44px floor
 * rather than by taste. In a ~60px row the *only* place a second 44px target
 * fits without colliding with the stretched overlay is beside it, not under
 * it: stacking the two vertically would either force every row 40% taller or
 * (with a transparent expanded hit area) put the lesson link's target on top
 * of the lower half of the problem title, silently stealing taps from the
 * card's own destination. So the dense variant is a fixed-width chip on the
 * row's trailing edge, full row height, horizontally clear of the title. It
 * drops to just the word "Lesson" below `sm` — at 320px there is no room for
 * a title beside it, and the link's `aria-label` carries the full name for
 * assistive tech and speech input regardless of what is painted.
 */
function LessonLink({
  lessonSlug,
  lessonTitle,
  dense = false,
}: {
  lessonSlug?: string;
  lessonTitle?: string;
  dense?: boolean;
}) {
  if (!lessonSlug) return null;
  const label = lessonTitle ? `Open the lesson “${lessonTitle}”` : "Open the lesson this problem comes from";

  if (dense) {
    return (
      <Link
        href={`/lessons/${lessonSlug}`}
        aria-label={label}
        className="relative z-[1] inline-flex min-h-11 max-w-[9rem] shrink-0 items-center gap-1.5 rounded-(--radius-tight) border border-border bg-surface px-2.5 text-[0.6875rem] text-subtle-foreground transition-colors duration-(--dur-fast) hover:border-pillar-edge hover:bg-surface-raised hover:text-pillar-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
      >
        <span className="font-tech shrink-0 uppercase tracking-[0.1em]">Lesson</span>
        {lessonTitle ? (
          <span aria-hidden="true" className="hidden truncate sm:inline">
            {lessonTitle}
          </span>
        ) : null}
      </Link>
    );
  }

  return (
    <Link
      href={`/lessons/${lessonSlug}`}
      aria-label={label}
      className="relative z-[1] inline-flex min-h-11 max-w-full items-center gap-1.5 rounded-(--radius-tight) text-xs text-subtle-foreground underline-offset-4 transition-colors duration-(--dur-fast) hover:text-pillar-text hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
    >
      <span className="font-tech shrink-0 uppercase tracking-[0.1em]">Lesson</span>
      <span aria-hidden="true" className="truncate">
        {lessonTitle ?? "open the source lesson"}
      </span>
      <LessonArrow />
    </Link>
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
      aria-hidden="true"
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path d="M2 6.2 5 9l5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** The row's version of the same affordance — rendered for every row
 *  (unsolved included) as a hollow-vs-filled ring, since "nothing there" on
 *  a dense list reads as missing content rather than "not solved yet."
 *  Decorative; the link's own accessible name carries the state. */
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
 * than only a color change. `solved`/`ready` are optional so this still
 * renders correctly from a server context that hasn't read progress.
 */
export function ProblemCard({
  problem,
  solved = false,
  ready = false,
  lessonTitle,
}: {
  problem: ProblemMeta;
  solved?: boolean;
  ready?: boolean;
  lessonTitle?: string;
}) {
  const course = getCourse(problem.course);
  const capstone = isCapstoneProblem(problem);

  return (
    // `Panel` takes an explicit prop list rather than spreading rest props, so
    // the pillar identity is declared on a wrapper around it — the same place
    // it used to sit when the wrapper was the card's `<a>`.
    <div data-pillar={course?.pillar} className="h-full">
      <Panel
        interactive
        className="group relative flex h-full flex-col gap-3 p-5 has-[a:focus-visible]:border-pillar-edge"
      >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug tracking-tight text-foreground group-hover:text-pillar-text">
          {/* The stretched link: the whole panel is this problem's target,
              with no separate "View"/"Solve" button competing with it. */}
          <Link
            href={`/problems/${problem.slug}`}
            aria-label={cardLabel(problem, solved, ready)}
            className="rounded-(--radius-tight) after:absolute after:inset-0 after:content-[''] focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
          >
            {problem.title}
          </Link>
        </h3>
        <SolvedMark solved={solved} />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <DifficultyScale difficulty={problem.difficulty} />
        <TypeMark type={problem.problemType} />
        {ready && !solved ? <ReadyTag /> : null}
        {capstone ? <CapstoneTag /> : null}
      </div>

      {/* Which course this belongs to, always; the lesson beneath it as a real
          link when there is one. With neither resolvable the card still reads
          as complete rather than as a row with a hole in it. */}
      {course ? <p className="text-xs leading-relaxed text-subtle-foreground">{course.title}</p> : null}
      <LessonLink lessonSlug={problem.lesson} lessonTitle={lessonTitle} />

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
        {/* Persistently visible, not hover-revealed. A destination that only
            announces itself once the pointer is already on it is invisible
            to a keyboard user, a touch user, and anyone scanning the page —
            the affordance has to be legible before the interaction, so
            hover only strengthens it rather than creating it. */}
        <span
          aria-hidden="true"
          className="text-subtle-foreground transition-colors duration-(--dur-fast) group-hover:text-pillar-text"
        >
          Open &rarr;
        </span>
      </div>
      </Panel>
    </div>
  );
}

/**
 * The dense treatment — a single scannable row, used for every problem that
 * isn't `master`-tier (the large majority; see `ProblemsCatalog`). A
 * foundational warm-up and an advanced problem both render this way: same
 * shape, because at that grain the difficulty ladder itself is the signal,
 * not the container's size. Everything a reader needs to decide whether to
 * open it — solved state, title, capstone/ready markers, difficulty, type,
 * length and course — sits on flex-wrapped lines that reflow rather than
 * overflow at narrow widths, with the lesson as a real link on the trailing
 * edge (see `LessonLink`).
 *
 * The row is a positioned container with a stretched link inside it rather
 * than an `<a>` wrapping everything, which is what makes two things true at
 * once that used to be mutually exclusive: the entire row is one 44px target
 * for the problem, *and* the lesson beside it is independently clickable.
 */
export function ProblemRow({
  problem,
  solved = false,
  ready = false,
  lessonTitle,
}: {
  problem: ProblemMeta;
  solved?: boolean;
  ready?: boolean;
  lessonTitle?: string;
}) {
  const course = getCourse(problem.course);
  const capstone = isCapstoneProblem(problem);

  return (
    <div
      data-pillar={course?.pillar}
      /*
        `min-h-11` alone was not enough to guarantee the 44px floor
        docs/A11Y_AUDIT.md flags here: `min-height` on a flex container is
        satisfied by the container, but the *link* inside it was the target,
        and a row with no lesson title and a short course name left that link
        shorter than its box. With the stretched overlay below, the link's hit
        area is now the row rectangle itself, so the floor is structural: the
        44px is on the element the pointer actually hits.
      */
      className="group relative -mx-3 flex min-h-11 items-center gap-3 rounded-(--radius-tight) border-l-2 border-l-transparent px-3 py-2.5 transition-colors duration-(--dur-fast) ease-instrument hover:border-l-pillar-edge hover:bg-surface-muted/60 has-[a:focus-visible]:border-l-pillar has-[a:focus-visible]:bg-surface-muted/60"
    >
      <RowStatusMark solved={solved} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {/* The truncation lives on the wrapper, never on the stretched link
              itself: `truncate` sets `overflow: hidden`, and an overflow
              container clips absolutely-positioned descendants — which would
              silently shrink the card-wide `::after` overlay back to the width
              of the title text and undo the whole-row target. */}
          <span className="min-w-0 truncate">
            <Link
              href={`/problems/${problem.slug}`}
              aria-label={cardLabel(problem, solved, ready)}
              className="rounded-(--radius-tight) text-sm font-medium text-foreground after:absolute after:inset-0 after:content-[''] group-hover:text-pillar-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-pillar focus-visible:outline-offset-2"
            >
              {problem.title}
            </Link>
          </span>
          {ready && !solved ? <ReadyTag /> : null}
          {capstone ? <CapstoneTag /> : null}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle-foreground">
          <DifficultyScale difficulty={problem.difficulty} />
          <TypeMark type={problem.problemType} />
          <span className="tech-value">
            {problem.estimatedMinutes}
            <span className="ml-0.5 text-[0.65rem] text-subtle-foreground">min</span>
          </span>
          {/* Below `sm` the course name is the first thing to go: every row is
              already inside a section headed by its pillar or its course, so
              it is the one fact here that is redundant at the width where
              width is scarcest. */}
          {course ? <span className="hidden truncate sm:inline">{course.title}</span> : null}
        </div>
      </div>

      <LessonLink lessonSlug={problem.lesson} lessonTitle={lessonTitle} dense />

      {/* Same rule as the card's "Open →": always visible, hover only
          intensifies it. */}
      <span
        aria-hidden="true"
        className="shrink-0 text-sm text-subtle-foreground transition-colors duration-(--dur-fast) group-hover:text-pillar-text"
      >
        &rarr;
      </span>
    </div>
  );
}
