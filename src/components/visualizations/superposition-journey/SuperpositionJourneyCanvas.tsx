import { cn } from "@/lib/utils";

/**
 * Two compositions of the same figure, chosen on the figure's **own rendered
 * width** rather than the viewport — this canvas is mounted in a
 * `lg:grid-cols-[minmax(0,1fr)_300px]` cell inside a `p-6` panel inside the
 * lesson column, so its box is ~240px on a 320px phone and ~364px on a
 * 1024px desktop, and no viewport breakpoint can tell those apart.
 *
 * The two differ only in horizontal budget: 440 units wide against 340. Every
 * vertical position, every font size, and every scale a reader reads a number
 * off (the ±1 amplitude axis, the 0-100% probability baseline) is identical in
 * both, so the two bars encode exactly the same quantities at exactly the same
 * heights; the narrow one simply stops spending 100 units on horizontal air.
 */
const VIEW_WIDTH = 440;
/**
 * Was 320. The figure grew 32 units taller purely to absorb larger type:
 * this SVG renders `w-full max-w-md` on a 440-unit viewBox, so a ~240px
 * lesson-panel box on a 320px phone scales authored type by 240/440 = 0.545 —
 * the previous 9-unit axis labels painted at 4.9px and the 11-unit
 * amplitude/probability readouts at 6.0px. Raising them to 14-16 units
 * made the amplitude track's top label collide with the section heading
 * above it, so the two tracks were pushed apart rather than the type pushed
 * back down. Even at 14-16 units, though, the wide composition only reaches
 * 7.6-8.7px in that box, which is what NARROW_WIDTH below exists to fix.
 */
const VIEW_HEIGHT = 352;

const COL_X: [number, number] = [130, 310];
const BAR_WIDTH = 64;

/**
 * Narrow composition: the same drawing on a 340-unit horizontal budget.
 *
 * Why narrowing the box is the whole fix here, with no reflow: unlike the
 * entanglement and interference figures, nothing in this one is *positionally*
 * meaningful left-to-right. The two columns are two basis states; the gap
 * between them and the width of a bar carry no quantity. So taking 100 units
 * of horizontal air out of the box raises every label's effective size by
 * 440/340 = 1.29× and distorts nothing — the amplitude bars still run from
 * AMP_ZERO to ±AMP_HALF and the probability bars still run from
 * PROB_BASELINE up by probability × PROB_HALF, at the identical unit heights.
 *
 * At a ~240px box that is a scale of 0.706: the 13-unit heading paints at
 * 9.2px, the 14-unit axis labels at 9.9px and the 15/16-unit readouts at
 * 10.6/11.3px — against 7.1/7.6/8.2/8.7px in the wide composition at the same
 * width.
 *
 * The 330px threshold is where the wide composition's smallest label (13
 * units) reaches 13 × 330/440 = 9.8px, i.e. the last width at which it is
 * still comfortably readable on its own.
 */
const NARROW_WIDTH = 340;
const NARROW_COL_X: [number, number] = [100, 240];
const NARROW_BAR_WIDTH = 50;

// Amplitude track: a signed scale from -1 (bottom) to +1 (top), zero in the middle.
const AMP_TOP = 40;
const AMP_ZERO = 92;
const AMP_BOTTOM = 144;
const AMP_HALF = AMP_ZERO - AMP_TOP; // 52

// Probability track: an unsigned 0%-100% scale, baseline at the bottom.
const PROB_TOP = 212;
const PROB_BASELINE = 294;
const PROB_HALF = PROB_BASELINE - PROB_TOP; // 82

const KET_BOX_Y = 306;
const KET_BOX_HEIGHT = 28;

export type JourneyColumn = {
  /** "0" or "1" */
  ketLabel: string;
  /** Signed real amplitude, in [-1, 1]. */
  amplitude: number;
  /** Born-rule probability, in [0, 1]. */
  probability: number;
};

/** The only things that differ between the two compositions. Font sizes are
 * deliberately absent: they are identical in both, which is precisely how the
 * narrow box buys legibility. */
type JourneyLayout = {
  width: number;
  colX: [number, number];
  barWidth: number;
};

const WIDE_LAYOUT: JourneyLayout = { width: VIEW_WIDTH, colX: COL_X, barWidth: BAR_WIDTH };
const NARROW_LAYOUT: JourneyLayout = { width: NARROW_WIDTH, colX: NARROW_COL_X, barWidth: NARROW_BAR_WIDTH };

/**
 * The single connected picture this whole component is built around: two
 * basis states, each shown first as a signed amplitude (which can be
 * negative) and then, directly below and visually linked, as the always-
 * positive Born-rule probability that amplitude produces once squared. A
 * "measure" event highlights the surviving column and dims the other one,
 * so the collapse reads as a snap to one definite ket rather than an
 * abstract state change.
 */
export function SuperpositionJourneyCanvas({
  columns,
  measuredIndex,
  isMeasuring,
  collapseFlash,
  prefersReducedMotion,
}: {
  columns: [JourneyColumn, JourneyColumn];
  measuredIndex: 0 | 1 | null;
  isMeasuring: boolean;
  collapseFlash: boolean;
  prefersReducedMotion: boolean;
}) {
  const ariaLabel = buildAriaLabel(columns, measuredIndex, isMeasuring);
  const shared = { columns, measuredIndex, isMeasuring, collapseFlash, prefersReducedMotion };

  return (
    // `@container` on the wrapper, never on the SVGs: the `@min-[330px]:`
    // variants have to query an ancestor's box, since an element's own
    // inline-size is the one thing a container query may not feed back into.
    // Both SVGs stay in the DOM and the inactive one is `display: none`, so
    // assistive tech announces exactly one `role="img"`.
    <div className="@container">
      <svg
        viewBox={`0 0 ${NARROW_WIDTH} ${VIEW_HEIGHT}`}
        role="img"
        aria-label={ariaLabel}
        className="mx-auto block w-full max-w-md @min-[330px]:hidden"
      >
        <JourneyTracks layout={NARROW_LAYOUT} {...shared} />
      </svg>

      {/* Wide composition. Its *scales* are unchanged and that is the part
          that matters — AMP_HALF is still 52 units per unit of amplitude and
          PROB_HALF still 82 units per unit of probability, so a bar of a given
          height still means the same number it did. Its geometry and type are
          not unchanged, and the comment that used to sit here claimed both
          were: VIEW_HEIGHT went 320 → 352 and both tracks slid down with it
          (AMP_TOP 22 → 40, PROB_TOP 190 → 212, KET_BOX_Y 284 → 306) to absorb
          the type pass, which raised the axis labels 9 → 14, the readouts
          11 → 15, the ket labels 13 → 16 and the heading 10 → 13. Verified
          against `git show HEAD`, not taken on the comment's word. */}
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        role="img"
        aria-label={ariaLabel}
        className="mx-auto hidden w-full max-w-md @min-[330px]:block"
      >
        <JourneyTracks layout={WIDE_LAYOUT} {...shared} />
      </svg>
    </div>
  );
}

function JourneyTracks({
  layout,
  columns,
  measuredIndex,
  isMeasuring,
  collapseFlash,
  prefersReducedMotion,
}: {
  layout: JourneyLayout;
  columns: [JourneyColumn, JourneyColumn];
  measuredIndex: 0 | 1 | null;
  isMeasuring: boolean;
  collapseFlash: boolean;
  prefersReducedMotion: boolean;
}) {
  const { width, colX, barWidth } = layout;

  return (
    <>
      {/* Amplitude track. The zero line is the reference a signed bar is
          read against — whether α is positive or negative, the one property
          this half of the figure exists to show, is literally "which side of
          this line is the bar on" — so it is load-bearing and moves off
          `--border` (the panel-edge token, measured 1.41:1 on
          `--surface-muted`, under the 3:1 WCAG 2.1 SC 1.4.11 floor) onto
          `--axis`, which clears 3:1 on every panel depth in both themes. */}
      <line
        x1={20}
        y1={AMP_ZERO}
        x2={width - 20}
        y2={AMP_ZERO}
        className="stroke-axis"
        strokeWidth={1.25}
        strokeDasharray="3 3"
      />
      <text x={8} y={AMP_ZERO + 5} fontSize={14} className="fill-axis font-mono">
        0
      </text>
      <text x={8} y={AMP_TOP + 5} fontSize={14} className="fill-axis font-mono">
        +1
      </text>
      <text x={8} y={AMP_BOTTOM + 5} fontSize={14} className="fill-axis font-mono">
        -1
      </text>
      {/* Kept at 13 rather than pushed to 15 like the numbers below it: this
          is a section heading, and at 15 units its ~26 characters ran into
          the α readout that sits just under it at the top of the left
          column. The values a reader compares get the size; the label
          naming them can afford to be a step smaller. In the narrow
          composition it is instead the smaller box that buys the size back —
          13 units of 340 is the same on-screen height as 17 units of 440. */}
      <text
        x={width / 2}
        y={16}
        textAnchor="middle"
        fontSize={13}
        className="fill-axis font-semibold uppercase tracking-wide"
      >
        Amplitude (can be negative)
      </text>

      {columns.map((col, index) => {
        const columnX = colX[index];
        const isPositive = col.amplitude >= 0;
        const ampBarHeight = Math.abs(col.amplitude) * AMP_HALF;
        const ampBarY = isPositive ? AMP_ZERO - ampBarHeight : AMP_ZERO;

        const probBarHeight = col.probability * PROB_HALF;
        const probBarY = PROB_BASELINE - probBarHeight;

        const isWinner = measuredIndex === index;
        const isLoser = measuredIndex !== null && !isWinner;
        const symbol = index === 0 ? "α" : "β";

        return (
          <g key={col.ketLabel} opacity={isLoser ? 0.35 : 1} className="transition-opacity duration-300">
            {/* Amplitude bar */}
            <rect
              x={columnX - barWidth / 2}
              y={ampBarY}
              width={barWidth}
              height={Math.max(ampBarHeight, 0.5)}
              rx={3}
              className="fill-brand transition-[y,height] duration-300 ease-out motion-reduce:transition-none"
            />
            <text
              x={columnX}
              y={AMP_TOP - 8}
              textAnchor="middle"
              fontSize={15}
              className="fill-foreground font-mono font-semibold"
            >
              {symbol} = {col.amplitude.toFixed(2)}
            </text>

            {/* Connector: "squared" from amplitude down to probability */}
            <line
              x1={columnX}
              y1={AMP_BOTTOM + 6}
              x2={columnX}
              y2={PROB_TOP - 16}
              className="stroke-muted-foreground"
              strokeWidth={1}
              strokeDasharray="2 3"
            />
            <text
              x={columnX}
              y={(AMP_BOTTOM + PROB_TOP) / 2 + 2}
              textAnchor="middle"
              fontSize={15}
              className="fill-muted-foreground font-mono"
            >
              ( )&#178;
            </text>

            {/* Probability bar */}
            <rect
              x={columnX - barWidth / 2}
              y={probBarY}
              width={barWidth}
              height={Math.max(probBarHeight, 0.5)}
              rx={3}
              className={cn(
                "transition-[y,height] duration-300 ease-out motion-reduce:transition-none",
                isWinner ? "fill-accent" : "fill-accent/70",
                isMeasuring && !prefersReducedMotion ? "animate-pulse motion-reduce:animate-none" : null
              )}
            />
            <text
              x={columnX}
              y={PROB_TOP - 8}
              textAnchor="middle"
              fontSize={15}
              className="fill-foreground font-mono font-semibold"
            >
              {Math.round(col.probability * 100)}%
            </text>

            {/* Ket box, highlighted on measurement */}
            <rect
              x={columnX - barWidth / 2 - 6}
              y={KET_BOX_Y}
              width={barWidth + 12}
              height={KET_BOX_HEIGHT}
              rx={8}
              className={cn(
                "transition-colors duration-300",
                isWinner ? "fill-accent/15" : "fill-surface-muted"
              )}
              style={{
                // The unselected ket box's outline was `var(--border)` — the
                // panel-edge token — but these two boxes are the figure's
                // outcome labels, and the reader has to see BOTH to register
                // that one of them was picked. `var(--axis)` keeps it clearly
                // subordinate to the accent-outlined winner while staying
                // above the 3:1 SC 1.4.11 floor.
                stroke: isWinner ? "var(--accent)" : "var(--axis)",
                strokeWidth: isWinner ? 2 : 1.25,
              }}
            />
            <text
              x={columnX}
              y={KET_BOX_Y + KET_BOX_HEIGHT / 2 + 6}
              textAnchor="middle"
              fontSize={16}
              className={cn("font-mono font-semibold", isWinner ? "fill-accent" : "fill-foreground")}
            >
              |{col.ketLabel}⟩
            </text>

            {isWinner && collapseFlash ? (
              <circle
                cx={columnX}
                cy={KET_BOX_Y + KET_BOX_HEIGHT / 2}
                r={6}
                className="fill-accent animate-ping motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : null}
          </g>
        );
      })}
    </>
  );
}

function buildAriaLabel(
  columns: [JourneyColumn, JourneyColumn],
  measuredIndex: 0 | 1 | null,
  isMeasuring: boolean
): string {
  const [c0, c1] = columns;
  const base = `Amplitude and probability chart for the state alpha ket 0 plus beta ket 1. Alpha equals ${c0.amplitude.toFixed(
    2
  )}, giving probability ${Math.round(c0.probability * 100)} percent for outcome 0. Beta equals ${c1.amplitude.toFixed(
    2
  )}, giving probability ${Math.round(c1.probability * 100)} percent for outcome 1.`;

  if (isMeasuring) return `${base} A measurement is in progress.`;
  if (measuredIndex === null) return `${base} No measurement has been taken yet.`;
  return `${base} The most recent measurement collapsed the state to ket ${measuredIndex}.`;
}
