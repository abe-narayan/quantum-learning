import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The "grid of labelled numeric readouts under a figure" pattern — real
 * `<dl>` semantics (a screen reader announces each as a label/value pair),
 * `.tech-label` above `.tech-value` (tabular figures, so a live-updating
 * number doesn't reflow its neighbors). Before this existed, five separate
 * visualizations (`SpinAxisMeasurement`, `ErrorCorrectionCycle`,
 * `EntanglementCorrelation`, `SuperpositionJourney`, `WaveInterference`)
 * each hand-rolled the identical
 * `grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-N` / `dt.tech-label`
 * / `dd.tech-value` markup — the "same axis or legend markup a fourth time"
 * case the design system calls out for extraction. `columns` is the
 * `sm:`-and-up column count; the grid is always 2 columns below `sm`, which
 * is what every one of those call sites already independently converged on.
 *
 * `Readout`/`Readouts` in `src/components/ui/Typography.tsx` cover the same
 * *voice* (tech-label/tech-value) but a different layout (flex-wrap, larger
 * value type) meant for instrument headers site-wide; this is the narrower,
 * figure-caption-sized sibling those five call sites actually needed and
 * this directory owns, so it lives here rather than in `ui/`.
 */
export type FigureReadoutItem = {
  label: ReactNode;
  value: ReactNode;
  /**
   * Use the quiet `text-xs text-muted-foreground` label voice instead of the
   * tracked/uppercase `.tech-label` one — for a raw outcome key (e.g. a
   * basis-state string like "00") rather than a named physical quantity
   * (e.g. "P(00)" or "purity of ρ_A"). Matches the distinction
   * `EntanglementCorrelation` and `SuperpositionJourney` already draw between
   * their live-quantity readouts and their measurement-tally readouts.
   */
  plainLabel?: boolean;
};

export function FigureReadouts({
  items,
  columns = 4,
  className,
}: {
  items: FigureReadoutItem[];
  /** Column count at `sm:` and up. Always 2 columns below `sm`. */
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-3 text-sm",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3",
        columns === 4 && "sm:grid-cols-4",
        className
      )}
    >
      {items.map((item, index) => (
        <div key={index}>
          <dt className={item.plainLabel ? "text-xs text-muted-foreground" : "tech-label"}>{item.label}</dt>
          <dd className={item.plainLabel ? "tech-value" : "mt-0.5 tech-value"}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
