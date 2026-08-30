const WIDTH = 480;
const HEIGHT = 220;
const PAD = 30;

/**
 * Type size for an energy-line label, in viewBox units.
 *
 * This SVG carries an intrinsic `width` and no `w-full`, so the viewBox scale
 * is 1.0 and 12 units is a literal 12 CSS pixels at every viewport, including
 * 320px (the figure overflows into its `overflow-x-auto` wrapper there rather
 * than shrinking). Same reasoning as the marker labels below.
 */
const LEVEL_FONT = 12;
/**
 * Minimum vertical separation, in units, between two energy labels sharing an
 * end of the plot. One label's box is LEVEL_FONT tall plus the 3-unit lift off
 * its line, so 16 is the first value at which two consecutive labels cannot
 * touch. Levels closer together than this alternate ends instead of stacking.
 */
const LEVEL_LABEL_GAP = 16;

const SUBSCRIPT_DIGITS = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];

function subscript(n: number): string {
  return String(n)
    .split("")
    .map((d) => SUBSCRIPT_DIGITS[Number(d)] ?? d)
    .join("");
}

export type EnergyLevel = { value: number; label?: string };

/**
 * Normalizes the two energy-line APIs into one labelled, ascending ladder.
 *
 * A bare `number` in `energyLines` is auto-labelled E₁, E₂, … by ascending
 * value, which is the convention for the thing this array exists to draw: a
 * ladder of bound-state energies in one well. Passing `{ value, label }`
 * overrides that for a ladder whose rungs are not eigenvalues (a Fermi level,
 * a drive detuning). The legacy single `energyLine` is deliberately left
 * unlabelled, because every existing call site draws it unlabelled today and
 * an API kept "backward compatible" while quietly adding ink to three shipped
 * figures is not backward compatible.
 */
function normalizeLevels(energyLine: number | undefined, energyLines: (number | EnergyLevel)[] | undefined): EnergyLevel[] {
  const extra = (energyLines ?? []).map((entry) => (typeof entry === "number" ? { value: entry } : entry));
  const sorted = [...extra].sort((a, b) => a.value - b.value);
  const labelled = sorted.map((level, i) => ({
    value: level.value,
    label: level.label ?? (sorted.length > 1 ? `E${subscript(i + 1)}` : undefined),
  }));
  return energyLine === undefined ? labelled : [{ value: energyLine }, ...labelled];
}

function scaleFns(xValues: number[], yValuesForRange: number[]) {
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValuesForRange);
  const yMax = Math.max(...yValuesForRange);
  const xSpan = xMax - xMin || 1;
  const ySpan = yMax - yMin || 1;
  const plotW = WIDTH - 2 * PAD;
  const plotH = HEIGHT - 2 * PAD;
  return {
    xOf: (x: number) => PAD + ((x - xMin) / xSpan) * plotW,
    yOf: (y: number) => PAD + (1 - (y - yMin) / ySpan) * plotH,
  };
}

function pathFor(xValues: number[], yValues: number[], xOf: (x: number) => number, yOf: (y: number) => number): string {
  return xValues.map((x, i) => `${i === 0 ? "M" : "L"}${xOf(x).toFixed(1)},${yOf(yValues[i]).toFixed(1)}`).join(" ");
}

/**
 * A potential-energy curve V(x) with an optional wavefunction/density
 * overlay, one or a whole ladder of horizontal energy lines, point markers
 * (turning points, well edges), and an optional shaded region
 * (classically-allowed range, a well's interior). Every array must come from the caller's own
 * real computation (a `potentials.ts` function, a closed-form V(r), etc.)
 * — this component only draws whatever curves it's given.
 */
export function PotentialDiagram({
  xValues,
  potential,
  wavefunction,
  energyLine,
  energyLines,
  markers = [],
  shadedRegion,
  ariaLabel,
}: {
  xValues: number[];
  potential: number[];
  /** An optional second curve (e.g. |ψ(x)|² or ψ(x)), rescaled to share the plot visually. */
  wavefunction?: number[];
  /** Draws a single unlabelled horizontal dashed line at this energy value. */
  energyLine?: number;
  /**
   * Draws a ladder of labelled horizontal dashed lines — the bound-state
   * spectrum of one well, rather than one level per figure.
   *
   * This is the whole reason the prop exists. With only `energyLine`, showing
   * three levels of a well meant three copies of the same figure differing in
   * one dashed line, which is what shipped: the reader has to hold two
   * near-identical pictures in memory to see the one difference between them,
   * and the spacing *between* levels — the physical content of a spectrum —
   * is never drawn at all. Passing `[E1, E2, E3]` here draws one well.
   *
   * Bare numbers are auto-labelled E₁… by ascending value; pass
   * `{ value, label }` to name them yourself. Composes with `energyLine`,
   * which stays exactly as it was.
   */
  energyLines?: (number | EnergyLevel)[];
  markers?: { x: number; label: string }[];
  shadedRegion?: { from: number; to: number; label?: string };
  ariaLabel: string;
}) {
  const levels = normalizeLevels(energyLine, energyLines);
  const yValuesForRange = [...potential, ...(wavefunction ?? []), ...levels.map((l) => l.value)];
  const { xOf, yOf } = scaleFns(xValues, yValuesForRange);

  // Label placement, in two columns.
  //
  // Levels are walked top-of-plot downward (highest energy first). A label
  // goes to the right end of its line by default; when the last label already
  // at that end is closer than LEVEL_LABEL_GAP it goes to whichever end has
  // more room. Two alternating columns double the vertical space a ladder has
  // before its labels touch, so labels stay clear down to 8 units of line
  // separation — about 5% of the 160-unit plot, or five evenly spaced levels
  // across a third of the well's depth. This SVG draws 1 unit to 1 CSS pixel
  // at every viewport (intrinsic width, no `w-full`), so that bound is the
  // same on a 320px phone as on a desktop.
  //
  // Below that separation two columns are not enough and the placement only
  // maximizes the gap it can get. A ladder that dense wants fewer labelled
  // rungs, not smaller type: LEVEL_FONT is already at the ~9px legibility
  // floor's own margin and cannot absorb the difference.
  const placed = [...levels]
    .map((level) => ({ ...level, y: yOf(level.value) }))
    .sort((a, b) => a.y - b.y)
    .reduce<{ level: EnergyLevel; y: number; side: "left" | "right" }[]>((acc, level) => {
      const lastOn = (side: "left" | "right") => [...acc].reverse().find((p) => p.side === side)?.y;
      const gap = (side: "left" | "right") => {
        const last = lastOn(side);
        return last === undefined ? Number.POSITIVE_INFINITY : level.y - last;
      };
      const side = gap("right") >= LEVEL_LABEL_GAP || gap("right") >= gap("left") ? "right" : "left";
      acc.push({ level, y: level.y, side });
      return acc;
    }, []);

  const potentialPath = pathFor(xValues, potential, xOf, yOf);
  const wavefunctionPath = wavefunction ? pathFor(xValues, wavefunction, xOf, yOf) : null;

  return (
    // `tabIndex={0}`. The marker-label comment further down already states the
    // geometry: this SVG "renders at its natural 480 units inside
    // `overflow-x-auto` and the viewBox scale is 1.0" — 480 real pixels, no
    // `w-full`, against a ~256px content box on a 320px phone. So this wrapper
    // scrolls on every phone, and an `overflow-x-auto` div is focusable by
    // default only in Firefox: a keyboard-only reader could see the left wall
    // of the well and never reach the right one, or the classical turning
    // point the shaded region marks. No `role`/`aria-label` on the wrapper —
    // the `<svg>` already carries `role="img"` and the label.
    <div tabIndex={0} className="not-prose overflow-x-auto panel-inset p-4">
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={ariaLabel}>
        {shadedRegion && (
          <rect
            x={xOf(shadedRegion.from)}
            y={PAD}
            width={Math.max(0, xOf(shadedRegion.to) - xOf(shadedRegion.from))}
            height={HEIGHT - 2 * PAD}
            className="fill-accent/10"
          />
        )}
        {/* The x and V axes. The baseline in particular is what a
            wavefunction's amplitude and a barrier's height are read against,
            so it is load-bearing. Was `stroke-border`: the panel-edge token,
            1.41:1 on `--surface-muted`, under the 3:1 WCAG 2.1 SC 1.4.11
            floor. `--axis` clears 3:1 on every panel depth in both themes. */}
        <line x1={PAD} y1={HEIGHT - PAD} x2={WIDTH - PAD} y2={HEIGHT - PAD} className="stroke-axis" strokeWidth={1.25} />
        <line x1={PAD} y1={PAD} x2={PAD} y2={HEIGHT - PAD} className="stroke-axis" strokeWidth={1.25} />
        {placed.map((entry, i) => (
          <g key={`level-${i}`}>
            <line
              x1={PAD}
              y1={entry.y}
              x2={WIDTH - PAD}
              y2={entry.y}
              className="stroke-foreground/60"
              strokeWidth={1.5}
              strokeDasharray="4 3"
            />
            {entry.level.label ? (
              /* `fill-muted-foreground` (6.78:1), not `fill-axis` (4.5:1):
                 this is annotation naming a line the reader can already see,
                 and "upgrading" it to the axis token would lower its
                 contrast, not raise it. */
              <text
                x={entry.side === "right" ? WIDTH - PAD - 2 : PAD + 2}
                y={entry.y - 3}
                textAnchor={entry.side === "right" ? "end" : "start"}
                fontSize={LEVEL_FONT}
                className="fill-muted-foreground font-mono"
              >
                {entry.level.label}
              </text>
            ) : null}
          </g>
        ))}
        <path d={potentialPath} fill="none" className="stroke-brand" strokeWidth={2} />
        {wavefunctionPath && <path d={wavefunctionPath} fill="none" className="stroke-accent" strokeWidth={1.75} />}
        {markers.map((marker, i) => (
          <g key={i}>
            <circle cx={xOf(marker.x)} cy={yOf(potential[xValues.findIndex((x) => x >= marker.x)] ?? 0)} r={3.5} className="fill-foreground" />
            {/* This SVG carries an intrinsic `width` and no `w-full`, so it
                renders at its natural 480 units inside `overflow-x-auto` and
                the viewBox scale is 1.0 - 10 authored units is a literal
                10px, right on the floor rather than under it, which is why
                these marker labels only needed a nudge to 12 rather than the
                1.6-2x other figures in this directory required. */}
            <text x={xOf(marker.x)} y={HEIGHT - PAD + 16} textAnchor="middle" fontSize={12} className="fill-axis font-mono">
              {marker.label}
            </text>
          </g>
        ))}
      </svg>
      {wavefunctionPath && (
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="text-brand">━</span> potential energy &nbsp;
          <span className="text-accent">━</span> wavefunction
        </p>
      )}
    </div>
  );
}
