import type { Grid1D } from "@/lib/quantum/wavefunction";
import type { Wavefunction1D } from "@/lib/quantum/wavefunction";

const WIDTH = 640;
const HEIGHT = 280;
const PADDING_X = 12;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 16;
const PLOT_HEIGHT = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
const BASELINE_Y = HEIGHT - PADDING_BOTTOM;

/** A potential this tall or taller is treated as an effectively-infinite wall for *display* purposes only (never for the physics). */
const WALL_DISPLAY_THRESHOLD = 1000;

export type CanvasMode = "density" | "real-imaginary" | "momentum";

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
 * Plots either the position-space probability density, its real/imaginary
 * parts, or the momentum-space probability density — a pure SVG function of
 * `psi` (and `potential`, for the position-space views), redrawn on every
 * render with no CSS transitions or animation of its own. The animation
 * loop that produces successive `psi` values lives entirely in
 * WavefunctionExplorer; this component never animates independently, so
 * there's nothing here for prefers-reduced-motion to need to suppress.
 */
export function WavefunctionCanvas({
  grid,
  psi,
  potential,
  mode,
  analyticalDensity,
  showMeanSpreadOverlay = false,
}: {
  grid: Grid1D;
  psi: Wavefunction1D;
  potential: readonly number[];
  mode: CanvasMode;
  analyticalDensity?: readonly number[];
  /**
   * Draws ⟨x⟩ (dashed vertical line) and the [⟨x⟩−Δx, ⟨x⟩+Δx] band (light
   * fill) under the density curve, in "density" mode only. Off by default —
   * most presets/lessons embedding this canvas aren't about mean/spread, and
   * the extra lines would just be noise there; lessons specifically about
   * ⟨x⟩ and Δx (e.g. expectation-values-in-position-space) opt in.
   */
  showMeanSpreadOverlay?: boolean;
}) {
  if (mode === "momentum") {
    const { k, amplitudes } = psi.toMomentumSpace();
    const density = amplitudes.map((a) => a.magnitudeSquared());
    // Native FFT bin order isn't monotonic in k (0, positive frequencies,
    // then wrapped negative ones); sort first so both the plotted domain
    // and scaleX's min/max are computed from the same sorted array — using
    // the unsorted array for the scale would take its min/max from k[0]=0
    // and a small negative frequency near the end, collapsing everything
    // else off-screen.
    const order = k.map((_, i) => i).sort((a, b) => k[a] - k[b]);
    const sortedK = order.map((i) => k[i]);
    const sortedDensity = order.map((i) => density[i]);
    const maxDensity = Math.max(...sortedDensity, 1e-12);
    const toX = scaleX(sortedK);
    const xs = sortedK.map(toX);
    const ys = sortedDensity.map((p) => BASELINE_Y - (p / maxDensity) * PLOT_HEIGHT);

    return (
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Momentum-space probability density">
        <line x1={PADDING_X} y1={BASELINE_Y} x2={WIDTH - PADDING_X} y2={BASELINE_Y} stroke="currentColor" strokeOpacity={0.25} />
        <path d={`${pathFrom(xs, ys)} L ${xs[xs.length - 1]} ${BASELINE_Y} L ${xs[0]} ${BASELINE_Y} Z`} fill="var(--accent)" fillOpacity={0.18} stroke="var(--accent)" strokeWidth={1.75} />
        <text x={PADDING_X} y={16} fontSize={11} fill="currentColor" opacity={0.55}>|φ(k)|² — momentum space</text>
      </svg>
    );
  }

  const toX = scaleX(grid.x as number[]);
  const xs = grid.x.map(toX);

  if (mode === "real-imaginary") {
    const reMax = Math.max(...psi.amplitudes.map((a) => Math.abs(a.re)), 1e-12);
    const imMax = Math.max(...psi.amplitudes.map((a) => Math.abs(a.im)), 1e-12);
    const scaleMax = Math.max(reMax, imMax);
    const zeroY = PADDING_TOP + PLOT_HEIGHT / 2;
    const reYs = psi.amplitudes.map((a) => zeroY - (a.re / scaleMax) * (PLOT_HEIGHT / 2));
    const imYs = psi.amplitudes.map((a) => zeroY - (a.im / scaleMax) * (PLOT_HEIGHT / 2));

    return (
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Real and imaginary parts of the wavefunction">
        <line x1={PADDING_X} y1={zeroY} x2={WIDTH - PADDING_X} y2={zeroY} stroke="currentColor" strokeOpacity={0.25} />
        <path d={pathFrom(xs, imYs)} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeOpacity={0.8} />
        <path d={pathFrom(xs, reYs)} fill="none" stroke="var(--pillar-accent)" strokeWidth={2} />
        <text x={PADDING_X} y={16} fontSize={11} fill="var(--pillar-accent)">— Re(ψ)</text>
        <text x={PADDING_X + 70} y={16} fontSize={11} fill="var(--accent)">— Im(ψ)</text>
      </svg>
    );
  }

  // mode === "density"
  const density = psi.probabilityDensity();
  const maxDensity = Math.max(...density, analyticalDensity ? Math.max(...analyticalDensity) : 0, 1e-12);
  const ys = density.map((p) => BASELINE_Y - (p / maxDensity) * PLOT_HEIGHT);

  const finitePotential = potential.filter((v) => Math.abs(v) < WALL_DISPLAY_THRESHOLD);
  const potentialCeiling = Math.max(...finitePotential, 1e-6, 1);
  const potentialYs = potential.map((v) => {
    const clipped = Math.min(Math.max(v, 0), potentialCeiling * 1.05);
    return BASELINE_Y - (clipped / (potentialCeiling * 1.05)) * PLOT_HEIGHT;
  });

  // ⟨x⟩ and Δx = sqrt(Var(x)), only computed when the overlay is requested —
  // same expressions StatePanel already shows as text, just drawn on the plot.
  const meanX = showMeanSpreadOverlay ? psi.expectationPosition() : null;
  const spreadX = showMeanSpreadOverlay ? Math.sqrt(Math.max(psi.variancePosition(), 0)) : null;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Position-space probability density">
      <line x1={PADDING_X} y1={BASELINE_Y} x2={WIDTH - PADDING_X} y2={BASELINE_Y} stroke="currentColor" strokeOpacity={0.25} />

      {meanX !== null && spreadX !== null ? (
        <g aria-hidden="true">
          <rect
            x={Math.min(toX(meanX - spreadX), toX(meanX + spreadX))}
            y={PADDING_TOP}
            width={Math.max(0, Math.abs(toX(meanX + spreadX) - toX(meanX - spreadX)))}
            height={PLOT_HEIGHT}
            fill="var(--accent)"
            fillOpacity={0.08}
          />
          <line
            x1={toX(meanX)}
            y1={PADDING_TOP}
            x2={toX(meanX)}
            y2={BASELINE_Y}
            stroke="var(--accent)"
            strokeOpacity={0.6}
            strokeWidth={1.25}
            strokeDasharray="4 3"
          />
        </g>
      ) : null}

      {/* Potential V(x), shown schematically (its own vertical scale, not shared with probability density). */}
      <path d={pathFrom(xs, potentialYs)} fill="none" stroke="currentColor" strokeOpacity={0.35} strokeWidth={1.25} strokeDasharray="3 3" />

      {analyticalDensity ? (
        <path
          d={pathFrom(xs, analyticalDensity.map((p) => BASELINE_Y - (p / maxDensity) * PLOT_HEIGHT))}
          fill="none"
          stroke="var(--warning)"
          strokeWidth={1.5}
          strokeDasharray="5 3"
        />
      ) : null}

      <path
        d={`${pathFrom(xs, ys)} L ${xs[xs.length - 1]} ${BASELINE_Y} L ${xs[0]} ${BASELINE_Y} Z`}
        fill="var(--pillar-accent)"
        fillOpacity={0.22}
        stroke="var(--pillar-accent)"
        strokeWidth={2}
      />

      <text x={PADDING_X} y={16} fontSize={11} fill="var(--pillar-accent)">|ψ(x)|² (numerical)</text>
      <text x={PADDING_X} y={30} fontSize={11} fill="currentColor" opacity={0.5}>- - - V(x) (schematic scale)</text>
      {analyticalDensity ? (
        <text x={PADDING_X} y={44} fontSize={11} fill="var(--warning)">- - - analytical |ψ(x)|²</text>
      ) : null}
      {meanX !== null ? (
        <text x={WIDTH - PADDING_X} y={16} fontSize={11} fill="var(--accent)" textAnchor="end">- - - ⟨x⟩ ± Δx</text>
      ) : null}
    </svg>
  );
}
