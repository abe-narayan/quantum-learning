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

/**
 * LEGEND TYPE — the measurement, and why 11 units was unreadable.
 *
 * This SVG renders `w-full` on a 640-unit viewBox inside a
 * `SimulatorInstrument`, whose body is `p-4 sm:p-5` on an `.instrument`
 * (1px border). On a 320px phone the page column is 320 − 32 = 288px and the
 * instrument takes 2 × (16px padding + 1px border) = 34px out of it, so the
 * SVG's real box is **254px** — not the 288px figure that the
 * `visualizations/` type pass quoted, which measured the column and forgot the
 * frame it sits in. Effective px = fontSize × 254 ÷ 640 = fontSize × 0.397.
 *
 * At the old `fontSize={11}` that is **4.37px**. This is the only key to which
 * curve is Re(ψ) and which is Im(ψ), which trace is the numerical density and
 * which the analytical one — and because it is SVG `<text>` inside a
 * `role="img"`, it is children-presentational and never announced either. So
 * the legend was simultaneously too small to read and invisible to assistive
 * tech: on the narrowest phone the figure had no key at all.
 *
 * 20 units is the same size `visualizations/tunneling-intro/TunnelingIntroCanvas`
 * settled on for its legend on an identical 640-unit viewBox, and the 340px
 * threshold below is its threshold too: 20 × 340 ÷ 640 = 10.6px, comfortably
 * over the ~9px floor, and the SVG legend is simply not rendered under it.
 */
const LEGEND_FONT_SIZE = 20;

/**
 * Baselines for the in-SVG legend. `LEGEND_FONT_SIZE` needs ~15 units of
 * ascent, so a baseline at the old y=16 would have clipped the cap heights
 * against the top edge of the viewBox (SVG overflow is hidden, silently), and
 * the old 14-unit line step is under the type's own line height. 22 clears the
 * edge; 26 units of step clears the descenders.
 */
const LEGEND_Y1 = 22;
const LEGEND_Y2 = 48;

/**
 * The visibility gate, shared by the three views. Below a 340px *container*
 * (not viewport — the stage's own box is what scales the viewBox, and a
 * `SimulatorInstrument` in split layout hands the stage ~320px at container
 * widths a viewport breakpoint would call "desktop") the SVG legend is
 * `display: none` and the HTML `FigureLegend` above takes over at a real 12px.
 */
const LEGEND_SVG_GATE = "hidden @min-[340px]:block";

/**
 * The narrow-viewport legend, in HTML, at a real 12px however narrow the box
 * gets — the pattern `TunnelingIntroCanvas` established, with one deliberate
 * difference: it is NOT `aria-hidden`.
 *
 * There, hiding it kept the narrow variant's announcement identical to the
 * wide one, because that figure's `role="img"` label already narrates the
 * numbers the legend repeats. Here the three `aria-label`s are bare titles
 * ("Real and imaginary parts of the wavefunction") that never say which colour
 * is which, and the SVG `<text>` that does say so is pruned by `role="img"`.
 * Marking this block `aria-hidden` would therefore delete the curve identities
 * from the accessibility tree entirely rather than avoid duplicating them.
 *
 * So above the threshold it becomes `sr-only` rather than `hidden`: visually
 * replaced by the in-SVG legend, still announced. `display: none` would take it
 * out of the tree; `sr-only` keeps it in.
 */
function FigureLegend({ items }: { items: { key: string; label: string; className: string }[] }) {
  return (
    // `flex-wrap`: at a 254px box two entries do not fit on one line, and
    // wrapping is better than letting them shrink back under the floor this
    // variant exists to clear.
    <div className="mb-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs font-medium @min-[340px]:sr-only">
      {items.map((item) => (
        <span key={item.key} className={item.className}>
          {item.label}
        </span>
      ))}
    </div>
  );
}

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
      // `@container` on the wrapper, so `@min-[340px]:` below asks about this
      // figure's own box rather than the viewport — see LEGEND_SVG_GATE.
      <div className="@container">
        <FigureLegend items={[{ key: "k", label: "|φ(k)|² — momentum space", className: "text-accent" }]} />
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Momentum-space probability density">
          <line x1={PADDING_X} y1={BASELINE_Y} x2={WIDTH - PADDING_X} y2={BASELINE_Y} stroke="currentColor" strokeOpacity={0.25} />
          <path d={`${pathFrom(xs, ys)} L ${xs[xs.length - 1]} ${BASELINE_Y} L ${xs[0]} ${BASELINE_Y} Z`} fill="var(--accent)" fillOpacity={0.18} stroke="var(--accent)" strokeWidth={1.75} />
          {/* Dropped the `opacity={0.55}` along with the size rise: at 8px
              effective this label was faint *and* tiny, and `currentColor` at
              55% on `--surface` does not reach 4.5:1. It now uses the same
              `--accent` as the curve it names, which is also what makes it a
              legend rather than a caption. */}
          <g className={LEGEND_SVG_GATE}>
            <text x={PADDING_X} y={LEGEND_Y1} fontSize={LEGEND_FONT_SIZE} fill="var(--accent)">
              |φ(k)|² — momentum space
            </text>
          </g>
        </svg>
      </div>
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
      <div className="@container">
        <FigureLegend
          items={[
            { key: "re", label: "— Re(ψ)", className: "text-pillar-text" },
            { key: "im", label: "— Im(ψ)", className: "text-accent" },
          ]}
        />
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Real and imaginary parts of the wavefunction">
          <line x1={PADDING_X} y1={zeroY} x2={WIDTH - PADDING_X} y2={zeroY} stroke="currentColor" strokeOpacity={0.25} />
          <path d={pathFrom(xs, imYs)} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeOpacity={0.8} />
          <path d={pathFrom(xs, reYs)} fill="none" stroke="var(--pillar-accent)" strokeWidth={2} />
          {/* The Im entry moved from PADDING_X + 70 to + 110, because the
              70-unit offset was sized for 11-unit type. "— Re(ψ)" is an em
              dash (1.0em), a space (0.26), R (0.66), e (0.55), "(" (0.32), ψ
              (0.60) and ")" (0.32) — 3.71em, which at 20 units is 74 units
              wide and would have run straight through the Im label. 110 leaves
              a 36-unit gap, enough slack that a font substitution for ψ cannot
              close it, and the pair still ends at x ≈ 195 of 628. */}
          <g className={LEGEND_SVG_GATE}>
            <text x={PADDING_X} y={LEGEND_Y1} fontSize={LEGEND_FONT_SIZE} fill="var(--pillar-accent)">
              — Re(ψ)
            </text>
            <text x={PADDING_X + 110} y={LEGEND_Y1} fontSize={LEGEND_FONT_SIZE} fill="var(--accent)">
              — Im(ψ)
            </text>
          </g>
        </svg>
      </div>
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

  const densityLegendItems = [
    { key: "numerical", label: "|ψ(x)|² (numerical)", className: "text-pillar-text" },
    { key: "potential", label: "- - - V(x) (schematic scale)", className: "text-muted-foreground" },
    ...(analyticalDensity ? [{ key: "analytical", label: "- - - analytical |ψ(x)|²", className: "text-warning" }] : []),
    ...(meanX !== null ? [{ key: "mean", label: "- - - ⟨x⟩ ± Δx", className: "text-accent" }] : []),
  ];

  return (
    <div className="@container">
      <FigureLegend items={densityLegendItems} />
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

        {/* Two rows of two, not four stacked lines. At 20 units a four-line
            legend on a 26-unit step would reach y = 100 — 84 units below
            PADDING_TOP, a third of the way down a 248-unit plot, straight
            through the crest of a packet sitting on the left of the axis. Two
            rows keep the intrusion at ~37 units, comparable to the 28 the old
            11-unit legend already had, and the widths allow it: at 20 units the
            bottom row is ~235 units ("- - - V(x) (schematic scale)") plus ~183
            ("- - - analytical |ψ(x)|²") = 418 of the 616 available between the
            padding, and the top row ~162 + ~106 = 268. Neither row can collide
            even with a wide fallback face for ψ, ⟨⟩ and Δ. */}
        <g className={LEGEND_SVG_GATE}>
          <text x={PADDING_X} y={LEGEND_Y1} fontSize={LEGEND_FONT_SIZE} fill="var(--pillar-accent)">|ψ(x)|² (numerical)</text>
          {/* `--axis`, not `currentColor` at 50% opacity. This names the dashed
              V(x) trace, which the reader has to be able to tell apart from the
              other two dashed traces, and a half-opacity body colour was the
              faintest text in the frame at the smallest size in the frame. */}
          <text x={PADDING_X} y={LEGEND_Y2} fontSize={LEGEND_FONT_SIZE} className="fill-axis">- - - V(x) (schematic scale)</text>
          {meanX !== null ? (
            <text x={WIDTH - PADDING_X} y={LEGEND_Y1} fontSize={LEGEND_FONT_SIZE} fill="var(--accent)" textAnchor="end">- - - ⟨x⟩ ± Δx</text>
          ) : null}
          {analyticalDensity ? (
            <text x={WIDTH - PADDING_X} y={LEGEND_Y2} fontSize={LEGEND_FONT_SIZE} fill="var(--warning)" textAnchor="end">- - - analytical |ψ(x)|²</text>
          ) : null}
        </g>
      </svg>
    </div>
  );
}
