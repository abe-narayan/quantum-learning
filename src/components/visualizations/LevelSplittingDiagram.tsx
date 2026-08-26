export type SplitLevel = {
  label: string;
  highlight?: boolean;
};

const WIDTH = 340;
const HEIGHT = 180;
const LEFT_X = 0;
const LEFT_LEVEL_WIDTH = 70;
const RIGHT_LEVEL_WIDTH = 70;
const RIGHT_X = WIDTH - RIGHT_LEVEL_WIDTH - 90;
const CENTER_Y = HEIGHT / 2 - 6;
const RIGHT_LEVEL_GAP = 26;

/**
 * A static "one level fans into two" schematic: a single labeled level on
 * the left connects via diagonal lines to a pair of closely-spaced labeled
 * levels on the right. Deliberately schematic (evenly spaced, not drawn to
 * any energy scale) — for a diagram whose vertical positions ARE the real
 * numeric energies, use EnergyLevelDiagram instead. Always caption this as
 * schematic so it isn't mistaken for a to-scale plot.
 */
export function LevelSplittingDiagram({
  leftLabel,
  rightLevels,
  ariaLabel,
  caption = "Schematic — not to scale. The real splitting size is computed in Quantum Mastery.",
}: {
  leftLabel: string;
  /** Exactly two levels the left level fans into, top to bottom. */
  rightLevels: [SplitLevel, SplitLevel];
  ariaLabel: string;
  caption?: string;
}) {
  const leftY = CENTER_Y;
  const rightYs = [CENTER_Y - RIGHT_LEVEL_GAP / 2, CENTER_Y + RIGHT_LEVEL_GAP / 2];

  return (
    <div className="not-prose overflow-x-auto panel-inset p-4">
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={ariaLabel}>
        <line
          x1={LEFT_X}
          y1={leftY}
          x2={LEFT_X + LEFT_LEVEL_WIDTH}
          y2={leftY}
          strokeWidth={2}
          className="stroke-brand/70"
        />
        <text x={LEFT_X} y={leftY - 10} className="fill-muted-foreground text-xs">
          {leftLabel}
        </text>

        {rightLevels.map((level, i) => {
          const y = rightYs[i];
          return (
            <g key={i}>
              <line
                x1={LEFT_X + LEFT_LEVEL_WIDTH}
                y1={leftY}
                x2={RIGHT_X}
                y2={y}
                strokeWidth={1}
                strokeDasharray="3 3"
                className="stroke-foreground/30"
              />
              <line
                x1={RIGHT_X}
                y1={y}
                x2={RIGHT_X + RIGHT_LEVEL_WIDTH}
                y2={y}
                strokeWidth={level.highlight ? 3 : 2}
                className={level.highlight ? "stroke-accent" : "stroke-brand/70"}
              />
              <text
                x={RIGHT_X + RIGHT_LEVEL_WIDTH + 8}
                y={y + 4}
                className={level.highlight ? "fill-accent text-xs font-semibold" : "fill-muted-foreground text-xs"}
              >
                {level.label}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-2 text-xs italic text-muted-foreground">{caption}</p>
    </div>
  );
}
