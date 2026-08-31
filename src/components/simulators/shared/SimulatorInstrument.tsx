import type { ReactNode } from "react";
import { Instrument } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

/**
 * ============================================================
 * The shared simulator shell
 * ============================================================
 * Every simulator on the site used to hand-roll its own outer container:
 * a `rounded-3xl border` div with an ad hoc grid inside. This is the one
 * frame all 14 now converge on: it's an `<Instrument>` (pillar-tinted,
 * corner-ticked, with the label strip / readouts / footnote the design
 * system defines), split into a "stage" (the canvas/SVG, narration, and
 * framing) and a "controls" rail, the two things every simulator already
 * has, just laid out differently from one file to the next.
 *
 * `layout="split"` is the default: stage left, a fixed-width controls rail
 * right, which fits the single-qubit and dynamics simulators. `layout="stacked"`
 * drops the fixed rail width for simulators whose stage itself needs the
 * full row (circuit diagrams, period-finding histograms, syndrome tables),
 * controls sit in a full-width band underneath instead of a narrow sidebar
 * squeezing a wide diagram.
 *
 * **Split collapses on the instrument's own rendered width, not the
 * viewport.** This instrument is mounted in two very different places: full
 * page width on `/simulators`, and inside a ~46rem lesson reading column via
 * `<InteractiveSection>`, where the *viewport* is routinely a wide desktop
 * (>1024px) even though this component's own box is 600-700px wide at most.
 * A `lg:` viewport breakpoint can't see that difference and would force the
 * 320px rail to open inside a column too narrow to hold it. `@container`
 * (below) makes the split/stack decision, and the controls rail's own
 * internal grids, see `ControlSection`'s siblings in `controls.tsx`, query
 * *this component's* box instead, so the same markup degrades correctly
 * regardless of where it's mounted. See docs/UX_REVIEW.md and the embedded-
 * simulators mission notes for the full reasoning.
 *
 * ------------------------------------------------------------------
 * `stageAfter`, and why the stacked layout needed a third slot
 * ------------------------------------------------------------------
 * Measured on `/simulators` at 375x812, before this slot existed: **nine of
 * the thirteen instruments had zero controls anywhere in the first screen**,
 * and the first control on several of them sat 1500-2200px below the top of
 * their own mount. The cause was not the controls rail. It was that when the
 * split collapses, the rail lands after the *entire* stage, and every stage
 * on this bench ends with several hundred pixels of trailing narrative:
 * `<Predict>`, `<SimulatorFraming>`, a KaTeX slab. So a phone reader met a
 * title, a paragraph, a live narration box, a picture, an equation, a
 * prediction quiz and a three-part "what to watch for" essay before reaching
 * a single thing they could touch.
 *
 * `stageAfter` is that trailing narrative, handed to the shell separately so
 * the shell can order it. DOM order is stage → controls → stageAfter, which
 * is also the order a screen reader walks and the order the phone scrolls:
 * see the thing, drive the thing, then read about the thing. On the split
 * layout nothing moves: `stageAfter` auto-places into column 1 row 2, i.e.
 * directly under the stage exactly where it rendered before, with the rail
 * (given `row-span-2`) still running the full height beside both.
 *
 * It is optional. A simulator whose stage has no trailing narrative, or one
 * that hand-rolls its own controls inside the stage (`compare-states`,
 * `complex-amplitude-explorer` — neither passes `controls`), just omits it.
 */
export function SimulatorInstrument({
  label,
  readout,
  footnote,
  stage,
  stageAfter,
  controls,
  layout = "split",
  className,
  stageClassName,
  stageAfterClassName,
  controlsClassName,
}: {
  /** Instrument name for the label strip, e.g. "Bloch sphere: single qubit". */
  label: ReactNode;
  /** Live readouts opposite the label, e.g. P(0)/P(1). Optional. */
  readout?: ReactNode;
  /** One line: units, or what to look for. Rendered in the footer strip. */
  footnote?: ReactNode;
  stage: ReactNode;
  /** The stage's trailing narrative: framing, a prediction prompt, a summary
   *  equation. Rendered *after* the controls in DOM and scroll order, and
   *  directly under the stage on the split layout. See the note above. */
  stageAfter?: ReactNode;
  /** Omit entirely for a single-column instrument (e.g. a mode toggle that
   *  restyles the whole body rather than a fixed controls rail). */
  controls?: ReactNode;
  layout?: "split" | "stacked";
  className?: string;
  stageClassName?: string;
  /** Defaults to `stageClassName`, since `stageAfter` is a continuation of
   *  the stage and every caller wants the same vertical rhythm in both. */
  stageAfterClassName?: string;
  controlsClassName?: string;
}) {
  // Only ever attempt the side-by-side rail when there both is a controls
  // panel and the caller asked for it; `layout="stacked"` (or no controls
  // at all) never needs the container query in the first place.
  const splitEligible = Boolean(controls) && layout === "split";

  return (
    <Instrument
      label={label}
      readout={readout}
      footnote={footnote}
      className={cn("not-prose", className)}
      // `@container` here (not on the grid div itself) so the grid's own
      // `@…:` variants below query an ancestor's box, never their own;
      // querying an element's own inline-size from a property that could
      // feed back into that size is the exact case container queries
      // disallow.
      bodyClassName="@container"
    >
      <div
        className={cn(
          "grid gap-6",
          splitEligible && "@min-[42rem]:grid-cols-[minmax(0,1fr)_320px] @min-[42rem]:gap-8",
          // `auto 1fr`, not the implicit `auto auto`. The controls rail spans
          // both rows (see below), and on most of these instruments it is the
          // taller column: the Bloch sphere's rail is ~1300px against a
          // ~640px stage. With two auto rows, grid hands a spanning item's
          // surplus height to the rows it spans, so that surplus opened a
          // ~350px hole *between* the stage and the block under it, mid
          // instrument, where it reads as something failing to render. Pinning
          // row 1 to its content and letting row 2 absorb the surplus puts the
          // slack where it has always been: below the last thing in the left
          // column, beside the bottom of a rail that is simply longer.
          splitEligible && Boolean(stageAfter) && "@min-[42rem]:grid-rows-[auto_1fr]"
        )}
      >
        <div className={cn("min-w-0", stageClassName)}>{stage}</div>
        {controls ? (
          <div
            className={cn(
              // A container in its own right: the rail is a fixed 320px
              // when split is active, well under any viewport breakpoint,
              // but its *own* box is what the pill grids and control
              // sections inside `controls.tsx` need to query (see
              // `sm:grid-cols-6` there, now `@sm:grid-cols-6`) so a 6-column
              // gate row never renders inside a rail too narrow to hold it.
              "@container",
              splitEligible
                ? "@min-[42rem]:border-l @min-[42rem]:border-border @min-[42rem]:pl-8"
                : "border-t border-border pt-6",
              // Spans both stage rows so the rail's left border still runs
              // the full height of the instrument and the stage column keeps
              // the shape it had before `stageAfter` was a slot. Conditional:
              // applied with no `stageAfter` to span, it would open a second,
              // empty grid row.
              splitEligible && Boolean(stageAfter) && "@min-[42rem]:row-span-2",
              controlsClassName
            )}
          >
            {controls}
          </div>
        ) : null}
        {stageAfter ? (
          // Auto-placed into column 1 row 2 on the split layout: directly
          // under the stage, exactly where this content rendered before it
          // was a slot. On the stacked layout it is simply last, which is
          // the whole point of the slot.
          //
          // Spanning both columns instead was tried and reverted. It does
          // make DOM order and visual order agree on the split layout (the
          // rail's last control would no longer tab back up and left into
          // this block, a jump `a11y.mjs` reports as a focus-order-jump
          // warning). But the rail is the taller column on most of these
          // instruments — 1300px against a 700px stage on the Bloch sphere —
          // so moving this block out of column 1 leaves ~800px of empty
          // stage beside the controls on every wide screen. A backward tab
          // between the two columns of a two-column layout is what every
          // two-column layout does; an 800px hole is a defect. The pre-slot
          // order had the same jump and a larger one (the rail's *first*
          // control sat at the top of the column, so the jump was the full
          // height of the stage).
          <div className={cn("min-w-0", stageAfterClassName ?? stageClassName)}>{stageAfter}</div>
        ) : null}
      </div>
    </Instrument>
  );
}
