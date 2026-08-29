import type { Grid1D } from "@/lib/quantum/wavefunction";
import type { TunnelingFrame } from "./tunnelingTrajectory";

const WIDTH = 640;
/**
 * HEIGHT 220 -> 240 and PADDING_TOP 34 -> 52, both purely to make room for
 * legible type. This SVG renders `w-full` on a 640-unit viewBox.
 *
 * The "~288px lesson column" in the original version of this note was the
 * wrong box, and it was wrong in this file twice over. 288px is the page
 * column on a 320px phone (320 less Container's `px-4` gutters), but no SVG
 * on this bench renders into the page column: a plain figure sits inside
 * `panel-inset p-4`, and `panel-inset` (globals.css) supplies border, radius
 * and fill and no padding — the `p-4` does — which leaves 288 − 2 × (16 + 1) =
 * 254px. This figure is nested one level deeper still (`panel p-5` wrapping
 * `panel-inset p-3`), which is the ~220px the container-query note below
 * already computes correctly for itself.
 *
 * Recomputed at 220px, the scale is 0.344, not 0.45: the old `fontSize={10}`
 * and `fontSize={11}` painted at **3.4px and 3.8px**, worse than the 4.5/5.0
 * the note claimed. And 20 units would land at 6.9px, not 9.0px — which is
 * exactly why the sizes below are not what makes this figure legible on a
 * phone. The container query is: under a 340px box the SVG labels are
 * `display: none` and the HTML block above renders them at a real 12px. The
 * 20- and 18-unit sizes only ever paint at or above that 340px threshold,
 * where they are 10.6px and 9.6px. That threshold is measured against the
 * container directly, so it was never affected by the 288px error.
 *
 * Growing the box rather than the padding alone keeps PLOT_HEIGHT (and so the
 * density curve's amplitude) essentially where it was — 172 units against the
 * old 170.
 */
const HEIGHT = 240;
const PADDING_X = 12;
const PADDING_TOP = 52;
const PADDING_BOTTOM = 16;
const PLOT_HEIGHT = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
const BASELINE_Y = HEIGHT - PADDING_BOTTOM;

function pathFrom(xs: readonly number[], ys: readonly number[]): string {
  return xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${ys[i].toFixed(2)}`).join(" ");
}

function scaleX(xValues: readonly number[]): (x: number) => number {
  const min = xValues[0];
  const max = xValues[xValues.length - 1];
  const span = max - min || 1;
  return (x) => PADDING_X + ((x - min) / span) * (WIDTH - 2 * PADDING_X);
}

/**
 * A compact, CSS/SVG-only render of one precomputed trajectory frame: the
 * probability density |psi(x)|^2 as a filled curve, colored brand
 * (incident/reflected side) up to the barrier's far edge and accent
 * (transmitted side) beyond it — so "a piece got through" reads directly
 * as a color change, not just a small bump a reader might miss. The
 * barrier itself is drawn the same schematic way as the full
 * WavefunctionCanvas (a dashed outline, its own vertical scale) so this
 * visual and the full explorer below it on the page share a visual
 * vocabulary.
 *
 * Pure function of props — no animation, transitions, or timers of its
 * own. The parent owns the frame-stepping loop and prefers-reduced-motion
 * handling; this component only ever draws whichever single frame it's
 * given.
 */
export function TunnelingIntroCanvas({
  grid,
  frame,
  maxDensity,
  barrierLeftEdge,
  barrierRightEdge,
  barrierHeight,
  ariaLabel,
}: {
  grid: Grid1D;
  frame: TunnelingFrame;
  maxDensity: number;
  barrierLeftEdge: number;
  barrierRightEdge: number;
  barrierHeight: number;
  ariaLabel: string;
}) {
  const toX = scaleX(grid.x as number[]);
  const xs = grid.x.map(toX);
  const ys = frame.density.map((p) => BASELINE_Y - (p / maxDensity) * PLOT_HEIGHT);

  const rightEdgeX = toX(barrierRightEdge);
  const leftEdgeX = toX(barrierLeftEdge);

  // Split the filled curve into a reflected-side path (x <= barrier's far
  // edge) and a transmitted-side path (x > barrier's far edge), sharing the
  // one boundary point so the two fills meet with no gap or overlap.
  let splitIndex = grid.x.findIndex((x) => x > barrierRightEdge);
  if (splitIndex === -1) splitIndex = grid.x.length - 1;
  if (splitIndex === 0) splitIndex = 1;

  const leftXs = xs.slice(0, splitIndex + 1);
  const leftYs = ys.slice(0, splitIndex + 1);
  const rightXs = xs.slice(splitIndex);
  const rightYs = ys.slice(splitIndex);

  // Barrier schematic: a flat-topped rectangle outline at a fixed display
  // height (never the physics scale) — same "schematic, its own scale"
  // framing WavefunctionCanvas uses for V(x).
  const barrierTopY = PADDING_TOP;
  const barrierPath = [
    `M ${leftEdgeX.toFixed(2)} ${BASELINE_Y}`,
    `L ${leftEdgeX.toFixed(2)} ${barrierTopY}`,
    `L ${rightEdgeX.toFixed(2)} ${barrierTopY}`,
    `L ${rightEdgeX.toFixed(2)} ${BASELINE_Y}`,
  ].join(" ");

  const transmittedPct = Math.round(frame.transmittedFraction * 100);
  const reflectedPct = Math.round(frame.reflectedFraction * 100);

  return (
    /**
     * `@container` so the annotation swap below asks about *this figure's* own
     * box, not the viewport: the canvas sits inside `panel p-5` wrapping
     * `panel-inset p-3`, so on a 320px phone its box is ~220px wide even
     * though nothing about the viewport says so, and at `lg` the same markup
     * can be much wider. A viewport breakpoint cannot see either fact.
     *
     * The threshold, 340px, is where the smallest SVG label (18 units on a
     * 640-unit viewBox) reaches 18 × 340/640 = 9.6px. Below it the figure's
     * *type* is what breaks, not its geometry — the plot is a 1-D position
     * axis and reads perfectly well small — so the narrow variant keeps the
     * plot exactly as it is and moves the three labels out of the SVG and
     * into HTML above it, where they render at a real 12px however narrow the
     * box gets. At a 220px box that is 12px against the 6.2px (V₀) and 6.9px
     * (legend) they painted at before; no second viewBox, no reflowed
     * geometry, and nothing about the plot itself changes.
     */
    <div className="@container">
      {/* Narrow-only annotations. `flex-wrap` rather than a fixed row: at 220px
          "reflected 100%" and "transmitted 100%" together overrun the box, and
          wrapping them is better than shrinking them back under the floor this
          variant exists to clear. */}
      <div
        // `aria-hidden`: the SVG's `role="img"` aria-label already narrates
        // the transmitted/reflected split, and it is the only thing announced
        // in the wide variant (SVG `<text>` inside a `role="img"` never is).
        // Hiding this block keeps the narrow variant's announcement identical
        // to the wide one instead of prefixing it with a second, decorative
        // "■ reflected 42% ■ transmitted 58%".
        aria-hidden="true"
        className="mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs font-medium @min-[340px]:hidden"
      >
        <span className="text-brand">■ reflected {reflectedPct}%</span>
        <span className="text-accent">■ transmitted {transmittedPct}%</span>
        {/* `text-muted-foreground`, not `text-axis`: `--axis` is tuned to the
            3:1 floor for graphical objects, and this is now real 12px body
            text, which owes 4.5:1 under SC 1.4.3. */}
        <span className="text-muted-foreground">barrier V₀ = {barrierHeight}</span>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
        {/* The baseline. Both filled densities are measured up from it and the
            barrier stands on it, so it is the figure's axis — and at
            `strokeOpacity={0.25}` on `currentColor` it was well under the 3:1
            WCAG 2.1 SC 1.4.11 floor for a graphical object a reader must
            perceive. `stroke-axis` clears 3:1 on every panel depth in both
            themes without the guesswork of an alpha on inherited colour. */}
        <line x1={PADDING_X} y1={BASELINE_Y} x2={WIDTH - PADDING_X} y2={BASELINE_Y} className="stroke-axis" strokeWidth={1.25} />

        {/* Barrier V(x): classically-forbidden region, height V0 = {barrierHeight}, schematic scale. */}
        <rect
          x={leftEdgeX}
          y={barrierTopY}
          width={Math.max(rightEdgeX - leftEdgeX, 0)}
          height={BASELINE_Y - barrierTopY}
          fill="currentColor"
          fillOpacity={0.06}
        />
        {/* The barrier outline delimits the classically-forbidden region —
            "the density is nonzero on the far side of THIS" is the entire
            claim — so it moves off a 0.4-alpha `currentColor` (under the 3:1
            floor) onto `--axis`. It stays visually distinct from the solid
            baseline by being dashed, as before. */}
        <path d={barrierPath} fill="none" className="stroke-axis" strokeWidth={1.5} strokeDasharray="3 3" />
        {/* Gated off below 340px, where 18 units stops clearing ~9.5px and the
            HTML block above takes over. `display: none` (rather than
            `visibility` or an opacity) is what keeps the hidden copy out of
            the accessibility tree as well, so the barrier height is never
            announced twice. Left in its original position in the paint order
            so the wide figure is byte-for-byte the picture it was. */}
        <g className="hidden @min-[340px]:block">
          <text x={(leftEdgeX + rightEdgeX) / 2} y={barrierTopY - 10} textAnchor="middle" fontSize={18} className="fill-axis">
            V₀ = {barrierHeight}
          </text>
        </g>

        {/* |psi(x)|^2, reflected/incident side (brand) vs. transmitted side (accent). */}
        <path
          d={`${pathFrom(leftXs, leftYs)} L ${leftXs[leftXs.length - 1]} ${BASELINE_Y} L ${leftXs[0]} ${BASELINE_Y} Z`}
          fill="var(--brand)"
          fillOpacity={0.24}
          stroke="var(--brand)"
          strokeWidth={2}
        />
        <path
          d={`${pathFrom(rightXs, rightYs)} L ${rightXs[rightXs.length - 1]} ${BASELINE_Y} L ${rightXs[0]} ${BASELINE_Y} Z`}
          fill="var(--accent)"
          fillOpacity={0.55}
          stroke="var(--accent)"
          strokeWidth={2}
        />

        {/* Pinned to the two outer edges rather than sitting 130 units apart:
            at 20 units each legend entry is ~190 wide, so the old spacing
            overlapped them, and centring the pair would have run them into the
            V₀ label that sits above the barrier in the middle of the plot.
            Gated off below 340px for the same reason as the V₀ label above. */}
        <g className="hidden @min-[340px]:block">
          <text x={PADDING_X} y={22} fontSize={20} fill="var(--brand)">
            ■ reflected {reflectedPct}%
          </text>
          <text x={WIDTH - PADDING_X} y={22} textAnchor="end" fontSize={20} fill="var(--accent)">
            ■ transmitted {transmittedPct}%
          </text>
        </g>
      </svg>
    </div>
  );
}
