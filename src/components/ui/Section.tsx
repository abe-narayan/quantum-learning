import type { ElementType, ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/**
 * ============================================================
 * Editorial layout primitives
 * ============================================================
 * The composition vocabulary that replaces "another grid of cards."
 *
 * A page built from these should be able to alternate between a measured
 * reading column, a full-bleed instrument, an asymmetric split, and a
 * margin-annotated figure — without each page reinventing its own spacing
 * and max-widths. All vertical rhythm comes from `--rhythm-section` /
 * `--rhythm-block` in globals.css, so "how much air does a section get" is a
 * single decision, tuned once, that scales with the viewport.
 */

type Width = "reading" | "wide" | "full";

const WIDTH_CLASSES: Record<Width, string> = {
  /** The measured column: long-form text, ~68 characters. */
  reading: "mx-auto w-full max-w-[46rem]",
  /** The default page width — the same as `Container`. */
  wide: "",
  /** Edge to edge; the caller owns its own padding. */
  full: "",
};

export function Section({
  children,
  className,
  width = "wide",
  as: Component = "section",
  id,
  tight = false,
  bleed = false,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: {
  children: ReactNode;
  className?: string;
  width?: Width;
  as?: ElementType;
  id?: string;
  /** Half the usual vertical rhythm — for a section that continues the
   *  previous one rather than starting a new thought. */
  tight?: boolean;
  /** Skip the Container entirely: the section spans the viewport, and its
   *  children are responsible for their own horizontal insets. Use for
   *  instrument panels, timelines and imagery that should touch the edges. */
  bleed?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}) {
  const inner =
    width === "full" || bleed ? (
      children
    ) : (
      <Container
        // `data-reading-column` is what `Marginalia` anchors to (see its
        // docstring and the `.marginalia` rule in globals.css). Only the
        // measured column has a gutter beside it, so only the measured column
        // may host a note out in the margin. `relative` makes this element —
        // not some arbitrary positioned ancestor further up — the box that
        // `left: calc(100% + 3rem)` is measured from.
        {...(width === "reading" ? { "data-reading-column": "" } : null)}
        className={cn(width === "reading" && "relative", WIDTH_CLASSES[width])}
      >
        {children}
      </Container>
    );

  return (
    <Component
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn("relative", className)}
      style={{
        paddingTop: tight ? "var(--rhythm-block)" : "var(--rhythm-section)",
        paddingBottom: tight ? "var(--rhythm-block)" : "var(--rhythm-section)",
      }}
    >
      {inner}
    </Component>
  );
}

/**
 * A section that breaks out of its parent Container to span the full
 * viewport width, without needing the parent to be restructured. Uses the
 * standard `left: 50%; translate: -50%` escape hatch — and `100vw`
 * deliberately, not `100%`, since the point is to ignore the ancestor's
 * width.
 *
 * This used to claim that "a full-bleed element cannot itself cause
 * horizontal page scroll, because it is exactly viewport-wide". It is not:
 * `100vw` includes the classic scrollbar gutter, while the page's own
 * available width does not, so on any page long enough to have a vertical
 * scrollbar this element is ~15px wider than the content box and hangs over
 * both edges. Measured on `/mechanics`: `w-screen` = 1920 against a
 * `clientWidth` of 1905, giving 8px of real horizontal scroll.
 *
 * There is no pure-CSS width that means "viewport minus scrollbar" — `vw` is
 * defined to include it — so the overhang is absorbed by `overflow-x: clip`
 * on the root instead (globals.css §"Full-bleed overhang"). `clip` rather
 * than `hidden` specifically: `hidden` would turn the root into a scroll
 * container and break every `position: sticky` element on the site.
 */
export function FullBleed({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative left-1/2 w-screen -translate-x-1/2", className)}>{children}</div>
  );
}

/**
 * Asymmetric two-column composition: a narrow text column beside a wide
 * visual (or the reverse). Collapses to a single column below `lg`, with the
 * visual second in source order — so on a phone the reader gets the framing
 * text before the figure, which is the order that teaches.
 */
export function SplitFigure({
  text,
  figure,
  reverse = false,
  className,
  align = "center",
}: {
  text: ReactNode;
  figure: ReactNode;
  /** Put the figure on the left at `lg` and up. */
  reverse?: boolean;
  className?: string;
  align?: "start" | "center";
}) {
  return (
    <div
      className={cn(
        "grid gap-10 lg:gap-14",
        reverse ? "lg:grid-cols-[1.35fr_1fr]" : "lg:grid-cols-[1fr_1.35fr]",
        align === "center" ? "lg:items-center" : "lg:items-start",
        className
      )}
    >
      {/* `min-w-0` on both cells is load-bearing, not defensive noise. A grid
          item's default `min-width: auto` is its *min-content* width, so a
          child that legitimately refuses to shrink — a `min-w-max` timeline
          rail, a wide table, a KaTeX line — pushes its track past the grid's
          own width instead of overflowing inside it. The symptom is remote
          from the cause: an `overflow-x-auto` wrapper one level down is
          correct and still does nothing, because the track grew to fit and
          there is no overflow left to scroll. That is exactly what happened
          here — `CourseTimeline`'s `sm:min-w-max` rail stretched the figure
          track to 2871px inside a 1088px grid and gave every
          `/courses/<slug>` page a horizontal scrollbar 1.8 screens wide.
          `min-w-0` lets the track take its `fr` share and hands the overflow
          back to the scroll container that was already there to catch it. */}
      <div className={cn("min-w-0", reverse && "lg:order-2")}>{text}</div>
      <div className={cn("min-w-0", reverse && "lg:order-1")}>{figure}</div>
    </div>
  );
}

/**
 * A margin note: sits in the gutter beside the reading column on wide
 * screens, and folds into the flow (as a clearly-marked aside) on narrow
 * ones. The scientific-textbook move that a card grid cannot make.
 */
export function Marginalia({
  children,
  className,
  side = "right",
}: {
  children: ReactNode;
  className?: string;
  side?: "left" | "right";
}) {
  return (
    <aside
      className={cn(
        "my-6 border-l-2 border-pillar-edge pl-4 text-sm text-muted-foreground",
        // The move out into the margin lives in globals.css, under
        // `[data-reading-column] .marginalia`, because it has a precondition
        // Tailwind utilities on this element cannot express: *there has to be
        // a margin*.
        //
        // These classes used to say `2xl:absolute 2xl:left-[calc(100%+3rem)]`
        // unconditionally, which silently assumed the nearest positioned
        // ancestor was the ~46rem reading column. Two of the three call sites
        // sit in a full-width `Section` instead, so `100%` was the whole
        // container and the note was flung 3rem past its right edge — 272px
        // off the side of a 1905px viewport, giving the *homepage* a
        // horizontal scrollbar. Anchoring to an explicit marker means a note
        // in a wide section now stays inline, which is the correct rendering
        // for it, rather than being positioned against a box that was never
        // the reading column.
        "marginalia",
        side === "right" ? "marginalia-right" : "marginalia-left",
        className
      )}
    >
      {children}
    </aside>
  );
}
