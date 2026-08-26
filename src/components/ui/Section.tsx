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
      <Container className={WIDTH_CLASSES[width]}>{children}</Container>
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
 * standard `left: 50%; margin-left: -50vw` escape hatch — and `100vw`
 * deliberately, not `100%`, since the point is to ignore the ancestor's
 * width. `overflow-x` is owned by the caller's own content: a full-bleed
 * element cannot itself cause horizontal page scroll, because it is exactly
 * viewport-wide, but anything wider placed inside it can.
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
      <div className={cn(reverse && "lg:order-2")}>{text}</div>
      <div className={cn(reverse && "lg:order-1")}>{figure}</div>
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
        // Above `2xl` there is genuine room outside the reading column; below
        // it, the note stays inline rather than overlapping the text.
        side === "right"
          ? "2xl:absolute 2xl:left-[calc(100%+3rem)] 2xl:w-56 2xl:border-l-2 2xl:pl-4"
          : "2xl:absolute 2xl:right-[calc(100%+3rem)] 2xl:w-56 2xl:border-l-0 2xl:border-r-2 2xl:pr-4 2xl:pl-0 2xl:text-right",
        className
      )}
    >
      {children}
    </aside>
  );
}
