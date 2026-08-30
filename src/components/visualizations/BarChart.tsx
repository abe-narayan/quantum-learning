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
  signed,
  height = 160,
  formatCaption,
}: {
  bars: BarChartEntry[];
  ariaLabel: string;
  /** Defaults to the largest bar value (or 1 if all values are 0). */
  maxValue?: number;
  /**
   * Forces the two-sided layout (zero line at the vertical midpoint, negative
   * bars hanging below it) even on a frame whose own values are all
   * non-negative. Left unset, the chart decides from `bars`.
   *
   * The vertical twin of `maxValue`: both name a piece of the axis, and both
   * have to be settled over a whole frame *set* rather than the frame on
   * screen, or a bar of the same value moves between frames.
   * `BarChartExplorer` passes it for exactly that reason; see the note there.
   *
   * Only ever forces the split on. `signed={false}` cannot make a negative
   * value draw upward as its own absolute value, which is the bug the split
   * exists to fix.
   */
  signed?: boolean;
  height?: number;
  /** Defaults to a plain 2-decimal number. Ignored when `caption` is set on an entry. */
  formatCaption?: (value: number) => string;
}) {
  const effectiveMax = maxValue ?? Math.max(0.001, ...bars.map((b) => Math.abs(b.value)));
  // `-0.00` was reaching the caption row. `quantumFourierTransform` returns
  // amplitudes whose "zero" components are floating-point residue on the order
  // of 1e-17, and `(-1e-17).toFixed(2)` is the string "-0.00": a minus sign in
  // front of a bar the geometry correctly draws at zero height. Anything that
  // rounds to zero at two decimals prints as an unsigned zero.
  const defaultFormat = formatCaption ?? ((v: number) => (Math.abs(v) < 5e-3 ? (0).toFixed(2) : v.toFixed(2)));

  // Sign has to live in the geometry, not only in the caption. Every bar used
  // to be drawn upward from the baseline at `Math.abs(value)` height and merely
  // tinted `muted-foreground` when negative, so in `bells-theorem-and-local-
  // hidden-variables` a correlation term of +1 and one of -1 were the same
  // height, and in `the-quantum-fourier-transform`'s real/imaginary charts
  // +0.5 and -0.5 were the same height. The one thing those two figures exist
  // to show (which terms carry which sign, which quadrant of the phase fan an
  // amplitude landed in) survived only as text under the picture.
  //
  // When any value is negative the plot area splits into two equal halves with
  // the zero line between them: positive bars grow up off it, negative bars
  // hang down from it. When every value is non-negative (which is every other
  // caller in the repo: probability distributions, log-scaled platform
  // comparisons, shot counts) the layout is byte-for-byte what it was, zero
  // line along the bottom, so nothing regresses.
  //
  // The `muted-foreground` tint is gone with it. Position now carries the sign,
  // and the tint was reading as "this bar matters less" on bars that matter
  // exactly as much as their positive neighbours.
  //
  // Deciding the split from *these* bars is only correct for a chart that is
  // the whole figure. Inside an explorer it silently rescales the axis between
  // frames: the split halves the height a bar can use, so a frame that happens
  // to be all-positive drew every bar at twice the height of the identical
  // value in a frame that contained a negative. `the-quantum-fourier-transform`
  // is the live case — the real-part sweep's j = 0 frame is four amplitudes of
  // +0.5 with no negative anywhere, while j = 1, 2 and 3 all carry one, so the
  // same 0.5 rendered at two different heights across one slider drag. That is
  // the one thing an axis exists to prevent, so the decision is liftable: the
  // `signed` prop settles it over the frame set (`BarChartExplorer` does this
  // for every explorer at once), and only when it is absent does the chart fall
  // back to reading its own bars.
  const hasNegative = signed === true || bars.some((b) => b.value < 0);

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
        const fill = bar.highlight ? "bg-accent" : "bg-brand/70";
        const barBase = "w-6 transition-[height] duration-500 ease-out motion-reduce:transition-none";
        // Both halves always render their bar, at zero height on the side the
        // value is not on, so a bar that flips sign between frames animates its
        // height down to the line and back out the other way instead of
        // unmounting and reappearing at full size.
        const upPct = bar.value > 0 ? barHeightPct : 0;
        const downPct = bar.value < 0 ? barHeightPct : 0;
        return (
          <div key={index} className="flex min-w-[2.25rem] flex-1 flex-col items-center justify-end gap-1">
            <span className="font-mono text-meta text-muted-foreground">{bar.caption ?? defaultFormat(bar.value)}</span>
            {/* `border-b border-axis` gives the chart the zero line it never had. Bar
                heights were readable only relative to each other, with nothing marking
                where a probability of 0 sits. `--axis` rather than `--border` because a
                bar chart's baseline is the canonical "mark a reader must perceive to
                read the figure" and `--border` measures 1.41:1 on `--surface-muted`,
                under WCAG 2.1 SC 1.4.11's 3:1. */}
            {hasNegative ? (
              <div className="relative flex w-full flex-1 flex-col">
                {/* Two `flex-1` halves over a `flex-col` parent split the plot area
                    exactly 50/50, so the zero line sits at the midpoint of the column
                    and a bar's distance from it is directly comparable up or down. */}
                <div className="flex flex-1 items-end justify-center border-b border-axis">
                  <div className={cn(barBase, "rounded-t-sm", fill)} style={{ height: `${upPct}%` }} />
                </div>
                <div className="flex flex-1 items-start justify-center">
                  <div className={cn(barBase, "rounded-b-sm", fill)} style={{ height: `${downPct}%` }} />
                </div>
              </div>
            ) : (
              <div className="relative flex w-full flex-1 items-end justify-center border-b border-axis">
                <div className={cn(barBase, "rounded-t-sm", fill)} style={{ height: `${barHeightPct}%` }} />
              </div>
            )}
            {/* Both the value caption above and this basis-state label are 10 -> 11px,
                now spelled `text-meta` (`--text-meta: 0.6875rem` = exactly the 11px
                they already were) rather than an arbitrary literal, so they sit on
                the same named step as every other piece of chart metadata.
                Unlike this directory's SVG figures these are real CSS pixels, not
                viewBox units, so 10px was legible rather than broken — but these are
                the numbers a reader compares bar against bar (and the outcome labels
                that say which bar is which), so they get the extra pixel rather than
                sitting exactly on the floor. */}
            <span className={cn("font-mono text-meta text-center", bar.highlight ? "font-semibold text-accent" : "text-muted-foreground")}>
              {bar.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
