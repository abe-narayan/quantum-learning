import type { ReactNode } from "react";
import { TechLabel } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

/**
 * MDX usage:
 * ```mdx
 * <HistoricalMoment date="1935" place="Institute for Advanced Study, Princeton">
 *   Einstein, Podolsky and Rosen publish the paper arguing that quantum
 *   mechanics must be incomplete — the argument that, three decades later,
 *   Bell would turn into a testable prediction.
 * </HistoricalMoment>
 * ```
 * `place` is optional.
 */

/**
 * A dated moment with real historical context — margin-rule styling (like
 * `Question`) rather than a boxed panel, so a run of `HistoricalMoment`s
 * reads as a timeline the reader scrolls through, not a stack of separate
 * cards. The date is set in display type at real size: it's the thing this
 * component exists to foreground.
 */
export function HistoricalMoment({
  date,
  place,
  children,
  className,
}: {
  date: string;
  place?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn("not-prose my-8 border-l-2 border-border pl-5 sm:pl-6", className)}>
      <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{date}</span>
        {place ? <TechLabel>{place}</TechLabel> : null}
      </figcaption>
      {/* `text-base`: `not-prose` above excludes this subtree from the
          typography plugin's selectors but does not reset the inherited
          `font-size`, so an absolute size here is measured against `.prose`'s
          18px body. This is the narrative itself, not a caption. */}
      <div className="mt-2 space-y-2 text-base leading-relaxed text-muted-foreground">{children}</div>
    </figure>
  );
}
