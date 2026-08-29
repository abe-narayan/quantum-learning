import { DifficultyMark } from "@/components/curriculum/DifficultyMark";
import type { Difficulty } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * ============================================================
 * The whole header instrument, on one line
 * ============================================================
 * docs/BEGINNER_REVIEW.md's headline friction on the lesson page was "five
 * stacked instruments before 'Motivation'": breadcrumb → title → lede →
 * difficulty + readouts → progress rule → prerequisites → objectives, every
 * one of them individually justified and collectively a wall.
 *
 * Three of those blocks were *the same fact* — "how hard, how far in, how
 * long" — rendered as three separately-stacked rows: a `DifficultyMark`, a
 * `Readouts` list (whose atom stacks a label *above* a `text-lg` value, so
 * two readouts cost ~52px of vertical space), and a bare progress hairline
 * underneath. This collapses them into a single dense row. Nothing is
 * removed and nothing is concealed — every value that was legible before is
 * still legible without any interaction, just set at instrument scale
 * (label and value on one baseline) instead of at display scale.
 *
 * It also completes the "you are here" chain the breadcrumb starts. The
 * breadcrumb gets as far as Learn → pillar → course; the module the lesson
 * actually sits in was named nowhere above the fold. `moduleTitle` is that
 * missing rung, read straight off `course.modules[position]` — real
 * curriculum data, no authoring — so pillar → course → module → position is
 * answerable without scrolling and without duplicating a breadcrumb
 * segment.
 *
 * Position is carried by *text* ("Module 03 / 12"), not by the meter: the
 * meter is `aria-hidden` decoration on top of a readout that already says
 * the same thing, so nothing here is bar-only or color-only.
 */
export function LessonInstrumentLine({
  difficulty,
  moduleTitle,
  position,
  totalModules,
  estimatedMinutes,
  className,
}: {
  difficulty: Difficulty;
  /** Title of the module this lesson sits in, when it resolves. */
  moduleTitle?: string;
  /** Zero-based index of this lesson's module in its course; `-1` when unresolved. */
  position: number;
  totalModules: number;
  estimatedMinutes: number;
  className?: string;
}) {
  const hasPosition = position >= 0 && totalModules > 0;
  const progressPercent = hasPosition ? ((position + 1) / totalModules) * 100 : 0;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-5 gap-y-2.5 border-y border-border py-2.5",
        className
      )}
    >
      {/* `withHint` on foundational only: "Foundational" is the one rung a
          first-time reader has to be able to decode on the spot ("can I
          start here without background?"), and the answer previously lived
          in a title= tooltip no touch device ever shows. The other rungs
          keep the tooltip: their readers are already navigating the
          curriculum and the header row stays one line. */}
      <DifficultyMark difficulty={difficulty} withHint={difficulty === "foundational"} />

      <dl className="flex flex-wrap items-center gap-x-5 gap-y-2.5">
        {hasPosition ? (
          <div className="flex min-w-0 items-center gap-2">
            <dt className="tech-label text-subtle-foreground">Module</dt>
            <dd className="flex min-w-0 items-center gap-2">
              <span className="tech-value text-xs text-foreground">
                {String(position + 1).padStart(2, "0")}
                <span className="sr-only"> of </span>
                <span aria-hidden="true" data-decorative="" className="text-subtle-foreground">
                  {" / "}
                </span>
                {totalModules}
              </span>
              {/* Decorative echo of the readout beside it — see the note
                  above on why position is never bar-only. */}
              <span
                aria-hidden="true"
                data-decorative=""
                className="hidden h-px w-14 overflow-hidden rounded-full bg-surface-muted sm:block"
              >
                <span className="block h-full bg-pillar" style={{ width: `${progressPercent}%` }} />
              </span>
              {moduleTitle ? (
                <span className="min-w-0 truncate text-xs text-muted-foreground">{moduleTitle}</span>
              ) : null}
            </dd>
          </div>
        ) : null}

        <div className="flex items-center gap-2">
          <dt className="tech-label text-subtle-foreground">Duration</dt>
          <dd className="tech-value text-xs text-foreground">
            {estimatedMinutes}
            <span className="ml-1 text-subtle-foreground">min</span>
          </dd>
        </div>
      </dl>
    </div>
  );
}
