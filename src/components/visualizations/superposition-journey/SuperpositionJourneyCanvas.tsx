import { cn } from "@/lib/utils";

const VIEW_WIDTH = 440;
const VIEW_HEIGHT = 320;

const COL_X: [number, number] = [130, 310];
const BAR_WIDTH = 64;

// Amplitude track: a signed scale from -1 (bottom) to +1 (top), zero in the middle.
const AMP_TOP = 22;
const AMP_ZERO = 74;
const AMP_BOTTOM = 126;
const AMP_HALF = AMP_ZERO - AMP_TOP; // 52

// Probability track: an unsigned 0%-100% scale, baseline at the bottom.
const PROB_TOP = 190;
const PROB_BASELINE = 272;
const PROB_HALF = PROB_BASELINE - PROB_TOP; // 82

const KET_BOX_Y = 284;
const KET_BOX_HEIGHT = 28;

export type JourneyColumn = {
  /** "0" or "1" */
  ketLabel: string;
  /** Signed real amplitude, in [-1, 1]. */
  amplitude: number;
  /** Born-rule probability, in [0, 1]. */
  probability: number;
};

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

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      role="img"
      aria-label={ariaLabel}
      className="w-full max-w-md mx-auto"
    >
      {/* Amplitude track */}
      <line
        x1={20}
        y1={AMP_ZERO}
        x2={VIEW_WIDTH - 20}
        y2={AMP_ZERO}
        className="stroke-border"
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text x={10} y={AMP_ZERO + 4} className="fill-muted-foreground text-[9px] font-mono">
        0
      </text>
      <text x={10} y={AMP_TOP + 4} className="fill-muted-foreground text-[9px] font-mono">
        +1
      </text>
      <text x={10} y={AMP_BOTTOM + 4} className="fill-muted-foreground text-[9px] font-mono">
        -1
      </text>
      <text
        x={VIEW_WIDTH / 2}
        y={12}
        textAnchor="middle"
        className="fill-muted-foreground text-[10px] font-semibold uppercase tracking-wide"
      >
        Amplitude (can be negative)
      </text>

      {columns.map((col, index) => {
        const colX = COL_X[index];
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
              x={colX - BAR_WIDTH / 2}
              y={ampBarY}
              width={BAR_WIDTH}
              height={Math.max(ampBarHeight, 0.5)}
              rx={3}
              className="fill-brand transition-[y,height] duration-300 ease-out motion-reduce:transition-none"
            />
            <text
              x={colX}
              y={AMP_TOP - 6}
              textAnchor="middle"
              className="fill-foreground text-[11px] font-mono font-semibold"
            >
              {symbol} = {col.amplitude.toFixed(2)}
            </text>

            {/* Connector: "squared" from amplitude down to probability */}
            <line
              x1={colX}
              y1={AMP_BOTTOM + 6}
              x2={colX}
              y2={PROB_TOP - 14}
              className="stroke-muted-foreground"
              strokeWidth={1}
              strokeDasharray="2 3"
            />
            <text
              x={colX}
              y={(AMP_BOTTOM + PROB_TOP) / 2 + 2}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px] font-mono"
            >
              ( )&#178;
            </text>

            {/* Probability bar */}
            <rect
              x={colX - BAR_WIDTH / 2}
              y={probBarY}
              width={BAR_WIDTH}
              height={Math.max(probBarHeight, 0.5)}
              rx={3}
              className={cn(
                "transition-[y,height] duration-300 ease-out motion-reduce:transition-none",
                isWinner ? "fill-accent" : "fill-accent/70",
                isMeasuring && !prefersReducedMotion ? "animate-pulse motion-reduce:animate-none" : null
              )}
            />
            <text
              x={colX}
              y={PROB_TOP - 8}
              textAnchor="middle"
              className="fill-foreground text-[11px] font-mono font-semibold"
            >
              {Math.round(col.probability * 100)}%
            </text>

            {/* Ket box, highlighted on measurement */}
            <rect
              x={colX - BAR_WIDTH / 2 - 6}
              y={KET_BOX_Y}
              width={BAR_WIDTH + 12}
              height={KET_BOX_HEIGHT}
              rx={8}
              className={cn(
                "transition-colors duration-300",
                isWinner ? "fill-accent/15" : "fill-surface-muted"
              )}
              style={{
                stroke: isWinner ? "var(--accent)" : "var(--border)",
                strokeWidth: isWinner ? 2 : 1,
              }}
            />
            <text
              x={colX}
              y={KET_BOX_Y + KET_BOX_HEIGHT / 2 + 5}
              textAnchor="middle"
              className={cn("text-[13px] font-mono font-semibold", isWinner ? "fill-accent" : "fill-foreground")}
            >
              |{col.ketLabel}⟩
            </text>

            {isWinner && collapseFlash ? (
              <circle
                cx={colX}
                cy={KET_BOX_Y + KET_BOX_HEIGHT / 2}
                r={6}
                className="fill-accent animate-ping motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : null}
          </g>
        );
      })}
    </svg>
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
