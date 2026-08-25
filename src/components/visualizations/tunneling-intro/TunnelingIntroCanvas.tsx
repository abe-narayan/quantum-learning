import type { Grid1D } from "@/lib/quantum/wavefunction";
import type { TunnelingFrame } from "./tunnelingTrajectory";

const WIDTH = 640;
const HEIGHT = 220;
const PADDING_X = 12;
const PADDING_TOP = 34;
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
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
      <line x1={PADDING_X} y1={BASELINE_Y} x2={WIDTH - PADDING_X} y2={BASELINE_Y} stroke="currentColor" strokeOpacity={0.25} />

      {/* Barrier V(x): classically-forbidden region, height V0 = {barrierHeight}, schematic scale. */}
      <rect
        x={leftEdgeX}
        y={barrierTopY}
        width={Math.max(rightEdgeX - leftEdgeX, 0)}
        height={BASELINE_Y - barrierTopY}
        fill="currentColor"
        fillOpacity={0.06}
      />
      <path d={barrierPath} fill="none" stroke="currentColor" strokeOpacity={0.4} strokeWidth={1.25} strokeDasharray="3 3" />
      <text x={(leftEdgeX + rightEdgeX) / 2} y={barrierTopY - 8} textAnchor="middle" fontSize={10} fill="currentColor" opacity={0.55}>
        V₀ = {barrierHeight}
      </text>

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

      <text x={PADDING_X} y={16} fontSize={11} fill="var(--brand)">
        ■ reflected {reflectedPct}%
      </text>
      <text x={PADDING_X + 130} y={16} fontSize={11} fill="var(--accent)">
        ■ transmitted {transmittedPct}%
      </text>
    </svg>
  );
}
