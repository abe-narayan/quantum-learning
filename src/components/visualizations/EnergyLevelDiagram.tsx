export type EnergyLevel = {
  label: string;
  energy: number;
  highlight?: boolean;
};

const WIDTH = 340;
const LEVEL_WIDTH = 120;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;
const LABEL_X = LEVEL_WIDTH + 14;

/**
 * A horizontal energy-level ladder: one line per level, vertically
 * positioned by its actual numeric energy (not just evenly spaced), so
 * unequal spacing (hydrogen's levels crowding near 0, a harmonic
 * oscillator's perfectly even rungs, an anharmonic transmon ladder) is
 * visually honest rather than schematic. Every energy value must come
 * from the caller's own engine computation.
 */
export function EnergyLevelDiagram({
  levels,
  ariaLabel,
  unit,
  transition,
  height = 260,
}: {
  levels: EnergyLevel[];
  ariaLabel: string;
  /** Shown next to each energy value, e.g. "eV" or "ħω". */
  unit?: string;
  /** Draws a labeled vertical arrow between two levels (matched by `label`). */
  transition?: { fromLabel: string; toLabel: string; caption?: string };
  height?: number;
}) {
  const energies = levels.map((l) => l.energy);
  const min = Math.min(...energies);
  const max = Math.max(...energies);
  const span = max - min || 1;
  const plotHeight = height - PAD_TOP - PAD_BOTTOM;

  const yOf = (energy: number) => PAD_TOP + (1 - (energy - min) / span) * plotHeight;

  const from = transition ? levels.find((l) => l.label === transition.fromLabel) : undefined;
  const to = transition ? levels.find((l) => l.label === transition.toLabel) : undefined;

  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-border bg-surface-muted/40 p-4">
      <svg width={WIDTH} height={height} viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label={ariaLabel}>
        {levels.map((level, i) => {
          const y = yOf(level.energy);
          return (
            <g key={i}>
              <line
                x1={0}
                y1={y}
                x2={LEVEL_WIDTH}
                y2={y}
                strokeWidth={level.highlight ? 3 : 2}
                className={level.highlight ? "stroke-accent" : "stroke-brand/70"}
              />
              <text x={LABEL_X} y={y + 4} className={level.highlight ? "fill-accent text-xs font-semibold" : "fill-muted-foreground text-xs"}>
                {level.label}
                {typeof level.energy === "number" ? ` (${level.energy.toFixed(3)}${unit ? ` ${unit}` : ""})` : ""}
              </text>
            </g>
          );
        })}
        {from && to && (
          <g>
            <line
              x1={LEVEL_WIDTH / 2}
              y1={yOf(from.energy)}
              x2={LEVEL_WIDTH / 2}
              y2={yOf(to.energy)}
              className="stroke-foreground"
              strokeWidth={1.5}
              markerEnd="url(#energy-transition-arrow)"
            />
            {transition?.caption && (
              <text
                x={LEVEL_WIDTH / 2 + 6}
                y={(yOf(from.energy) + yOf(to.energy)) / 2}
                className="fill-foreground text-[10px] font-medium"
              >
                {transition.caption}
              </text>
            )}
          </g>
        )}
        <defs>
          <marker id="energy-transition-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-foreground" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
