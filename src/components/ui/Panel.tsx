import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TechLabel } from "@/components/ui/Typography";

/**
 * ============================================================
 * Instrument surfaces
 * ============================================================
 * The container vocabulary. `Card` (the older primitive) still exists and
 * still works — it is the plain, quiet box. These add the two treatments the
 * redesign leans on:
 *
 *   Panel       a machined face: hairline edge, faint top highlight, four
 *               elevation levels available via the `--depth-*` ladder.
 *   Instrument  a Panel that is mounted equipment: pillar-tinted, with corner
 *               ticks and an optional header strip carrying a label and live
 *               readouts. Everything that contains a canvas, a simulator or a
 *               large diagram should be one of these.
 *
 * The visual weight lives in globals.css (`.panel`, `.instrument`) rather
 * than in long Tailwind chains here, because both are used from raw class
 * strings elsewhere too (MDX wrappers, simulator internals) and there must be
 * exactly one definition of what a panel looks like.
 */

export function Panel({
  children,
  className,
  as: Component = "div",
  inset = false,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  /** Recessed rather than raised — for wells that content sits *in*. */
  inset?: boolean;
  /** Adds the shared hover/focus affordance for panels that are links or
   *  buttons. Never set this on a non-interactive panel: a surface that
   *  lifts on hover but does nothing is a broken promise. */
  interactive?: boolean;
}) {
  return (
    <Component
      className={cn(
        inset ? "panel-inset" : "panel",
        interactive &&
          "transition-[border-color,background-color,transform] duration-(--dur-fast) ease-instrument hover:border-pillar-edge hover:bg-surface-muted motion-safe:hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </Component>
  );
}

/**
 * A framed instrument. `label` renders a header strip in the technical voice;
 * `readout` sits opposite it for live values, and `footnote` below the body
 * for units, sources or a one-line "what to look for".
 */
export function Instrument({
  children,
  className,
  bodyClassName,
  label,
  readout,
  footnote,
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  label?: ReactNode;
  readout?: ReactNode;
  footnote?: ReactNode;
  as?: ElementType;
}) {
  return (
    <Component className={cn("instrument overflow-hidden", className)}>
      {label || readout ? (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border px-4 py-2.5 sm:px-5">
          {label ? <TechLabel>{label}</TechLabel> : <span />}
          {/* `flex-wrap` because a readout is data. The outer row wraps the
              label and the readout onto separate lines on a narrow screen,
              which leaves this group ~256px at 320px — enough for one value,
              not always for three (a date, a difficulty ladder and a units
              string), and a non-wrapping row would have pushed the last one
              out through the `overflow-hidden` on `.instrument` above, where
              it is clipped rather than scrollable and so disappears with no
              symptom. `gap-y-1` keeps a wrapped second line tight against the
              first instead of inheriting the 16px horizontal gap. */}
          {readout ? <div className="flex flex-wrap items-center gap-x-4 gap-y-1">{readout}</div> : null}
        </div>
      ) : null}
      <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
      {footnote ? (
        <div className="border-t border-border px-4 py-2.5 text-xs text-subtle-foreground sm:px-5">
          {footnote}
        </div>
      ) : null}
    </Component>
  );
}

/**
 * A hairline separator that fades at both ends, so sections divide without
 * the hard rule that would fight the atmospheric background behind them.
 * Decorative by definition — an `<hr>` would be announced as a thematic break
 * that the heading structure already conveys.
 */
export function FadeRule({ className }: { className?: string }) {
  return <div aria-hidden="true" data-decorative="" className={cn("rule-fade", className)} />;
}
