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
    // `role="group"`, not `role="img"`. This is the hardest call in the
    // directory and it goes the same way as the rest, for a reason worth
    // spelling out.
    //
    // The tempting argument for `img` is scale: `GroverAmplitudeSweep` and
    // `CircuitStateStepper` hand this component 2ⁿ bars, and
    // `PeriodFindingExplorer` renders one bar per counting-register outcome —
    // up to 128 of them at 7 counting qubits. Reading 128 outcome labels and
    // 128 percentages in sequence is not how anyone wants to meet a
    // distribution, and the callers' labels really are good summaries ("k=3
    // iterations. Marked-state probability 0.945", "Measurement probability
    // distribution over the 128 counting-register outcomes for a=2, N=21").
    //
    // But `img` does not *summarize* those 128 bars, it *deletes* them, and
    // the two are not the same trade. A `group` still announces its
    // accessible name on entry and on focus, so every word the `img` label was
    // delivering is delivered unchanged — nothing regresses for the reader who
    // only wants the summary, who steps past a named group in browse mode
    // exactly as they stepped past a named image. What changes is that the
    // reader who wants to check *which* outcomes carry the peaks — the one
    // question the period-finding figure exists to answer, since r is read off
    // the peak spacing and the summary can only assert that spacing — can now
    // go in and read them. `img` denied that second reader entirely, and this
    // is the only place those numbers appear on the page.
    //
    // Verbosity a reader can navigate past is strictly better than content a
    // reader cannot reach. Where a caller's bar set really is decorative, the
    // fix is for the caller not to render 128 labeled bars, not for this
    // component to hide the labels it went to the trouble of drawing.
    //
    // `tabIndex={0}`: each column is `min-w-[2.25rem]` (36px), so eight bars
    // already fill a ~256px content box on a 320px phone and the 2ⁿ callers
    // blow far past it — this container really scrolls, and `overflow-x-auto`
    // is focusable by default only in Firefox. Without the stop a keyboard-only
    // reader could see |000⟩ and |001⟩ and had no way to reach the marked
    // state. The global `:focus-visible` outline makes the stop visible.
    <div
      role="group"
      aria-label={ariaLabel}
      tabIndex={0}
      // The outer `gap-1` is gone. Each bar is `w-6` inside a column that is at least
      // 2.25rem wide, so the bars are already visibly separated by their own column
      // slack; the gap's only other job was spacing, and removing it lets the columns'
      // plot areas sit edge to edge so their bottom borders join into one continuous
      // baseline (see below) instead of a dashed row of 4px-broken segments.
      className="not-prose flex overflow-x-auto panel-inset p-4"
      style={{ height }}
    >
      {bars.map((bar, index) => {
        const barHeightPct = Math.min(100, (Math.abs(bar.value) / effectiveMax) * 90);
        return (
          <div key={index} className="flex min-w-[2.25rem] flex-1 flex-col items-center justify-end gap-1">
            <span className="font-mono text-[11px] text-muted-foreground">{bar.caption ?? defaultFormat(bar.value)}</span>
            {/* `border-b border-axis` gives the chart the zero line it never had. Bar
                heights were readable only relative to each other, with nothing marking
                where a probability of 0 sits — and for the negative-amplitude case this
                component explicitly supports (`bar.value < 0`), a bar drawn downward
                from an invisible origin is unreadable. `--axis` rather than `--border`
                because a bar chart's baseline is the canonical "mark a reader must
                perceive to read the figure" and `--border` measures 1.41:1 on
                `--surface-muted`, under WCAG 2.1 SC 1.4.11's 3:1. */}
            <div className="relative flex w-full flex-1 items-end justify-center border-b border-axis">
              <div
                className={cn(
                  "w-6 rounded-t-sm transition-[height] duration-500 ease-out motion-reduce:transition-none",
                  bar.highlight ? "bg-accent" : bar.value < 0 ? "bg-muted-foreground/60" : "bg-brand/70"
                )}
                style={{ height: `${barHeightPct}%` }}
              />
            </div>
            {/* Both the value caption above and this basis-state label are 10 -> 11px.
                Unlike this directory's SVG figures these are real CSS pixels, not
                viewBox units, so 10px was legible rather than broken — but these are
                the numbers a reader compares bar against bar (and the outcome labels
                that say which bar is which), so they get the extra pixel rather than
                sitting exactly on the floor. */}
            <span className={cn("font-mono text-[11px] text-center", bar.highlight ? "font-semibold text-accent" : "text-muted-foreground")}>
              {bar.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
