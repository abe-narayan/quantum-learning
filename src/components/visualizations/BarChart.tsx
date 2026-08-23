import { cn } from "@/lib/utils";

export type BarChartEntry = {
  label: string;
  value: number;
  /** Draws this bar in the accent color instead of the default brand color. */
  highlight?: boolean;
  /** Optional caption shown above the bar (e.g. a percentage or a raw value). */
  caption?: string;
};

/**
 * A small, dependency-free labeled bar chart for lesson prose: probability
 * distributions, amplitude magnitudes, side-by-side comparisons (qubit
 * counts, platform ratings, anything with a handful of labeled numeric
 * values). Every value must be computed by the caller from real engine
 * output — this component only renders whatever numbers it's handed.
 * Generalizes the pattern first used in the Grover Explorer's own
 * `AmplitudeBars`, so lesson-embedded charts and the Grover simulator look
 * and behave consistently.
 */
export function BarChart({
  bars,
  ariaLabel,
  maxValue,
  height = 160,
  formatCaption,
}: {
  bars: BarChartEntry[];
  ariaLabel: string;
  /** Defaults to the largest bar value (or 1 if all values are 0). */
  maxValue?: number;
  height?: number;
  /** Defaults to a plain 2-decimal number. Ignored when `caption` is set on an entry. */
  formatCaption?: (value: number) => string;
}) {
  const effectiveMax = maxValue ?? Math.max(0.001, ...bars.map((b) => Math.abs(b.value)));
  const defaultFormat = formatCaption ?? ((v: number) => v.toFixed(2));

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="not-prose flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface-muted/40 p-4"
      style={{ height }}
    >
      {bars.map((bar, index) => {
        const barHeightPct = (Math.abs(bar.value) / effectiveMax) * 90;
        return (
          <div key={index} className="flex min-w-[2.25rem] flex-1 flex-col items-center justify-end gap-1">
            <span className="font-mono text-[10px] text-muted-foreground">{bar.caption ?? defaultFormat(bar.value)}</span>
            <div className="relative flex w-full flex-1 items-end justify-center">
              <div
                className={cn(
                  "w-6 rounded-t-sm transition-[height] duration-500 ease-out motion-reduce:transition-none",
                  bar.highlight ? "bg-accent" : bar.value < 0 ? "bg-muted-foreground/60" : "bg-brand/70"
                )}
                style={{ height: `${barHeightPct}%` }}
              />
            </div>
            <span className={cn("font-mono text-[10px] text-center", bar.highlight ? "font-semibold text-accent" : "text-muted-foreground")}>
              {bar.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
