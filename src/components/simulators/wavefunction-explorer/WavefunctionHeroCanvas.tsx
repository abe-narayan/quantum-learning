import type { Grid1D, Wavefunction1D } from "@/lib/quantum/wavefunction";
import type { HeroDisplay, HeroLegendItem } from "./heroRun";
import { FAR_SIDE_MAGNIFICATION } from "./heroRun";

/**
 * The homepage hero's position-space figure.
 *
 * A sibling of `WavefunctionCanvas`'s density view rather than a prop on it,
 * for two reasons that pull in opposite directions from the thirteen lesson
 * embeds and the `/simulators` bench that canvas serves:
 *
 *   - Its key is written for someone who has never seen a wavefunction
 *     ("Where the particle probably is"), where the shared canvas is
 *     deliberately technical ("|psi(x)|^2 (numerical)"). Both are right for
 *     their reader.
 *   - It draws three things the shared canvas has no business carrying: a
 *     barrier as a solid object rather than a dashed polyline, the state's own
 *     energy as a line across it (so "not enough energy to get over the wall"
 *     is visible rather than asserted), and a magnified trace of the far side,
 *     without which the transmitted lobe is three pixels tall.
 *
 * What it borrows unchanged is the geometry: the same 640 x 280 viewBox and
 * padding, so the hero figure and the bench figure are the same size and
 * shape, and a reader who follows "Full explorer" is not handed a different
 * plot of the same thing.
 *
 * Pure function of props. No timers, no transitions, no animation of its own;
 * the parent owns the frame loop and the reduced-motion decision.
 */

const WIDTH = 640;
const HEIGHT = 280;
const PADDING_X = 12;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 16;
const PLOT_HEIGHT = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
const BASELINE_Y = HEIGHT - PADDING_BOTTOM;

/**
 * There is no `<text>` in this SVG at all, and that is deliberate. The
 * measurements in `WavefunctionCanvas`'s legend note are that a 640-unit
 * viewBox painted into a 254px box scales type by 0.4, so a legend inside the
 * SVG has to be gated behind a container query and mirrored in HTML to stay
 * above the ~9px floor, and `role="img"` prunes it from the accessibility tree
 * regardless. The hero has one legend, in HTML, at a real 12px, at every
 * width, announced like any other text.
 */
const TONE_CLASS: Record<HeroLegendItem["tone"], string> = {
  density: "text-pillar-text",
  structure: "text-muted-foreground",
  energy: "text-warning",
  magnified: "text-accent",
};

function pathFrom(xs: readonly number[], ys: readonly number[]): string {
  return xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${ys[i].toFixed(2)}`).join(" ");
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function WavefunctionHeroCanvas({
  grid,
  psi,
  potential,
  display,
  legend,
  barrier,
}: {
  grid: Grid1D;
  psi: Wavefunction1D;
  potential: readonly number[];
  display: HeroDisplay;
  legend: readonly HeroLegendItem[];
  /** The rectangular barrier to draw as a solid wall, when `display.potential` is "wall". */
  barrier?: { center: number; halfWidth: number; height: number };
}) {
  const [windowMin, windowMax] = display.xWindow ?? [grid.x[0], grid.x[grid.n - 1]];
  const span = windowMax - windowMin || 1;
  const toX = (x: number) => PADDING_X + ((x - windowMin) / span) * (WIDTH - 2 * PADDING_X);

  // Only the plotted slice. Outside a window the physics has left empty (see
  // `heroDisplay`), dropping the points is exactly equivalent to drawing them
  // on the baseline, and it keeps every scale below measured on what is
  // actually on screen.
  const visible: number[] = [];
  for (let i = 0; i < grid.n; i++) {
    if (grid.x[i] >= windowMin && grid.x[i] <= windowMax) visible.push(i);
  }

  const density = psi.probabilityDensity();
  const maxDensity = Math.max(...visible.map((i) => density[i]), 1e-12);
  const xs = visible.map((i) => toX(grid.x[i]));
  const ys = visible.map((i) => BASELINE_Y - (density[i] / maxDensity) * PLOT_HEIGHT);
  const closedDensity = `${pathFrom(xs, ys)} L ${xs[xs.length - 1].toFixed(2)} ${BASELINE_Y} L ${xs[0].toFixed(
    2
  )} ${BASELINE_Y} Z`;

  // V(x) and E share one vertical scale, in energy units, which is not the
  // probability scale above. That is the standard textbook overlay and the
  // same "schematic, its own scale" framing the shared canvas uses; the legend
  // names the two traces rather than implying they are heights of the same
  // thing.
  const energyToY = (value: number) =>
    BASELINE_Y - clamp(value / display.energyCeiling, 0, 1) * PLOT_HEIGHT;

  const magnified = display.magnifyFrom;
  const magnifiedIndices = magnified === undefined ? [] : visible.filter((i) => grid.x[i] >= magnified);
  const magnifiedXs = magnifiedIndices.map((i) => toX(grid.x[i]));
  const magnifiedYs = magnifiedIndices.map(
    (i) => BASELINE_Y - clamp((density[i] * FAR_SIDE_MAGNIFICATION) / maxDensity, 0, 1) * PLOT_HEIGHT
  );

  return (
    <div>
      {/* The key, in HTML at a real 12px however narrow the box gets, and in
          the accessibility tree. `flex-wrap` because at 254px the tunneling
          preset's four entries do not fit on one line and wrapping beats
          shrinking. */}
      <div className="mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs font-medium">
        {legend.map((item) => (
          <span key={item.key} className={TONE_CLASS[item.tone]}>
            {item.label}
          </span>
        ))}
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={display.ariaLabel}>
        {/* Every height in the frame is read as a distance from this line, so
            it is `--axis` (4.5:1) rather than an alpha on the body colour. See
            ZERO_BASELINE_NOTE in WavefunctionCanvas. */}
        <line x1={PADDING_X} y1={BASELINE_Y} x2={WIDTH - PADDING_X} y2={BASELINE_Y} className="stroke-axis" />

        {display.potential === "wall" && barrier ? (
          <g>
            <rect
              x={toX(barrier.center - barrier.halfWidth)}
              y={energyToY(barrier.height)}
              width={Math.max(toX(barrier.center + barrier.halfWidth) - toX(barrier.center - barrier.halfWidth), 0)}
              height={Math.max(BASELINE_Y - energyToY(barrier.height), 0)}
              fill="currentColor"
              fillOpacity={0.14}
            />
            {/* Solid, not dashed: "the density is nonzero on the far side of
                THIS" is the whole claim the figure makes, so the object making
                it should look like an object. `--axis` carries the 3:1 floor
                for a graphical mark a reader must perceive. */}
            <path
              d={`M ${toX(barrier.center - barrier.halfWidth).toFixed(2)} ${BASELINE_Y} L ${toX(
                barrier.center - barrier.halfWidth
              ).toFixed(2)} ${energyToY(barrier.height).toFixed(2)} L ${toX(
                barrier.center + barrier.halfWidth
              ).toFixed(2)} ${energyToY(barrier.height).toFixed(2)} L ${toX(
                barrier.center + barrier.halfWidth
              ).toFixed(2)} ${BASELINE_Y}`}
              fill="none"
              className="stroke-axis"
              strokeWidth={1.75}
            />
          </g>
        ) : null}

        {display.potential === "curve" ? (
          <path
            d={pathFrom(
              xs,
              visible.map((i) => energyToY(potential[i]))
            )}
            fill="none"
            className="stroke-muted-foreground"
            strokeWidth={1.25}
            strokeDasharray="3 3"
          />
        ) : null}

        {display.energyLevel !== undefined ? (
          <line
            x1={PADDING_X}
            y1={energyToY(display.energyLevel)}
            x2={WIDTH - PADDING_X}
            y2={energyToY(display.energyLevel)}
            stroke="var(--warning)"
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
        ) : null}

        <path
          d={closedDensity}
          fill="var(--pillar-accent)"
          fillOpacity={0.22}
          stroke="var(--pillar-accent)"
          strokeWidth={2}
        />

        {/* The far side, magnified. The true curve is still drawn underneath
            it by the path above; this one is a second trace of the same
            numbers, and both the legend and the sentence under the figure say
            the factor.

            Dashed, and keyed as dashed in the legend, rather than told apart
            from the density by colour alone. `--accent` is the transmitted
            side's colour in `TunnelingIntroCanvas` and this borrows it, but
            `--pillar-accent` is not a fixed hue: it is re-aimed per pillar, and
            on the quantum-mechanics pillar (hue 195) it lands within a few
            degrees of `--accent`. Colour alone would key the two lobes
            identically on the one non-homepage route this component is
            embedded in, and would fail SC 1.4.1 in greyscale everywhere. */}
        {magnifiedXs.length >= 2 ? (
          <path
            d={`${pathFrom(magnifiedXs, magnifiedYs)} L ${magnifiedXs[magnifiedXs.length - 1].toFixed(
              2
            )} ${BASELINE_Y} L ${magnifiedXs[0].toFixed(2)} ${BASELINE_Y} Z`}
            fill="var(--accent)"
            fillOpacity={0.4}
            stroke="var(--accent)"
            strokeWidth={2}
            strokeDasharray="7 4"
          />
        ) : null}
      </svg>
    </div>
  );
}
