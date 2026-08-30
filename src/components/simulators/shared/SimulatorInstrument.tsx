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
 */
export function SimulatorInstrument({
  label,
  readout,
  footnote,
  stage,
  controls,
  layout = "split",
  className,
  stageClassName,
  controlsClassName,
}: {
  /** Instrument name for the label strip, e.g. "Bloch sphere: single qubit". */
  label: ReactNode;
  /** Live readouts opposite the label, e.g. P(0)/P(1). Optional. */
  readout?: ReactNode;
  /** One line: units, or what to look for. Rendered in the footer strip. */
  footnote?: ReactNode;
  stage: ReactNode;
  /** Omit entirely for a single-column instrument (e.g. a mode toggle that
   *  restyles the whole body rather than a fixed controls rail). */
  controls?: ReactNode;
  layout?: "split" | "stacked";
  className?: string;
  stageClassName?: string;
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
          splitEligible && "@min-[42rem]:grid-cols-[minmax(0,1fr)_320px] @min-[42rem]:gap-8"
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
              controlsClassName
            )}
          >
            {controls}
          </div>
        ) : null}
      </div>
    </Instrument>
  );
}
