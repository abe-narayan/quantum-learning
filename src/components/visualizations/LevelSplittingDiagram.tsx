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
    // `tabIndex={0}`. The `<svg>` carries an intrinsic `width={WIDTH}` (340)
    // and no `w-full`, so it paints at 340 real pixels against a ~256px
    // content box on a 320px phone and this wrapper is what scrolls. A scroll
    // container is focusable by default in no browser but Firefox, so a
    // keyboard-only reader saw the unsplit level on the left and could not
    // reach the split levels on the right — the entire content of the figure.
    // No `role`/`aria-label` on the wrapper: the `<svg>` is already
    // `role="img"` with the label and naming both announces it twice.
    <div tabIndex={0} className="not-prose overflow-x-auto panel-inset p-4">
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
                // The fan lines are the diagram's verb: "this one level splits into
                // these two" is carried entirely by them, and without them the figure
                // is three unrelated horizontal rules. `--foreground` at 30% opacity
                // composites to roughly 3.2:1 on `--surface-muted` — right at the WCAG
                // 2.1 SC 1.4.11 boundary and below it on the lighter panel depths.
                // `--axis` is the token that guarantees the 3:1 on every depth in both
                // themes, and the 1px dashed treatment already keeps them subordinate
                // to the 2–3px level lines.
                className="stroke-axis"
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
