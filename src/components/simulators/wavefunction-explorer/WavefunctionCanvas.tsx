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
 * ===========================================================================
 * THE MOMENTUM AXIS
 * ===========================================================================
 * The momentum view used to plot |phi(k)|^2 across the whole FFT domain,
 * +/- pi/dx, with no numeric axis at all. Both halves of that were wrong in
 * the same direction: the numbers were right and the picture was unreadable.
 *
 * WHAT THE DISTRIBUTION ACTUALLY OCCUPIES. Measured on every preset in
 * `presets.ts`, at every combination of its sliders' min / default / max, at
 * t = 0 and again every fourth frame through 400 frames of the real
 * `SplitOperatorEvolver` (the autoplay pass is 260):
 *
 *   grid dx    +/- pi/dx    widest |k| carrying > 1e-4 of the peak
 *   0.25          12.57     10.26   (free Gaussian, sigma 0.5, p 6)
 *   0.10          31.42      8.10   (tunneling, p 6)
 *   0.05          62.83      6.14   (harmonic, omega 3, n 1)
 *   0.03         104.72     20.86   (infinite well, half-width 2, n 4)
 *
 * So the useful window is never wider than ~21 and is often under 2, against
 * an axis drawn out to 104.7. The narrowest case measured is the infinite
 * well at half-width 7, whose whole distribution lives inside |k| < 1.64:
 * 1.6% of the plotted width, twelve bins of five hundred and twelve. That is
 * the needle. Note the needle is NOT the free Gaussian at p = 2, which sits
 * on dx = 0.25 and fills a respectable quarter of its half-axis; the dx =
 * 0.03 presets (infinite well, superposition) have no momentum slider at all.
 *
 * WHY THE WINDOW IS DERIVED ONCE, FROM psi0, AND PASSED IN. The obvious
 * implementation, sizing the axis from the frame being drawn, was measured
 * and rejected: quantized onto the ladder below it hops 38 times over 400
 * frames on `infinite-well-excited` at half-width 5, n 3, because the
 * eigenstate's slow 1/k^4 tail wobbles across a rung boundary every few
 * frames under the finite-wall Trotter error. An axis that rescales while you
 * watch is worse than one that is too wide: nothing on it can be compared to
 * anything. So `momentumDisplayRange` is evaluated once per mount, on the
 * starting state, by `WavefunctionSimulation`, and handed down as a fixed
 * number. A preset or parameter change remounts that component, so the axis
 * is re-derived exactly when the physics changes and never while it runs.
 *
 * WHY NOTHING VISIBLE IS CUT OFF. The window is the smallest ladder rung
 * holding every bin above 1e-4 of psi0's peak, and the state then evolves
 * away from psi0 inside a fixed window. The quantity that matters is what
 * ends up outside it later: measured over the same 400-frame sweep, across
 * every preset and every slider extreme, the tallest bin ever excluded is
 * 2.1e-3 of that frame's peak, on `tunneling` at momentum 2 / barrier height
 * 8, where the packet reflects off the wall and acquires a spectrum psi0
 * never had. On a 212-unit plot that is 0.44 viewBox units: 0.18 CSS pixels
 * at the narrowest real box, 0.44 at a 640px one. Everything else is an order
 * of magnitude smaller again (worst 3.6e-4, on `superposition` at half-width
 * 2, n2 4). The crop is a zoom (1.0x to 69.8x, depending on preset), not a
 * truncation, and a reader is told the plotted range by the tick labels and
 * the figure's `aria-label` either way.
 */

/**
 * Round half-widths the momentum axis is allowed to take. Round because the
 * reader reads them: every tick label is one of these or its half, so two runs
 * that land on the same rung are directly comparable, and no label ever needs
 * more than two decimals.
 */
const MOMENTUM_RANGE_LADDER = [1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128];

/** Below this fraction of the peak a momentum bin is treated as empty when sizing the axis; see the note above for what that costs. */
const MOMENTUM_RANGE_FLOOR = 1e-4;

/**
 * The vertical band reserved under the momentum plot for the k axis, and the
 * type that sits in it.
 *
 * 24 units, not the legend's 20, and ungated, unlike the legend. The legend
 * can afford 20 because `LEGEND_SVG_GATE` hides it under a 340px container
 * and hands the job to `FigureLegend`, so its narrowest painted width is
 * 340px and 20 x 340 / 640 = 10.63px. An axis has no HTML fallback to hand
 * off to, so it has to clear the floor at the narrowest box this component is
 * ever painted in, which is 254px (see `lib/design/__tests__/
 * figureLegibility.test.ts`; a lesson embed and the `/simulators` bench now
 * agree on that number). 24 x 254 / 640 = 9.53px, over the ~9px floor at every
 * width, and 12.75px at the 340px the legend beside it starts at.
 *
 * The band is 36 units, which at a 264-unit baseline would run off the bottom,
 * so the momentum view drops its baseline to 228 and gives up 36 units of plot
 * height (248 -> 212) rather than growing the viewBox: the three views share
 * one 640 x 280 box and a reader switching between them should not have the
 * page jump.
 */
const MOMENTUM_AXIS_BAND = 36;
const MOMENTUM_BASELINE_Y = HEIGHT - PADDING_BOTTOM - MOMENTUM_AXIS_BAND;
const MOMENTUM_PLOT_HEIGHT = MOMENTUM_BASELINE_Y - PADDING_TOP;
const MOMENTUM_AXIS_FONT_SIZE = 24;
/** Baseline for the tick labels: 28 below the axis line, which clears 24-unit cap heights and leaves the descenders 24 units of room inside the viewBox. */
const MOMENTUM_TICK_LABEL_Y = MOMENTUM_BASELINE_Y + 28;
/** How far the tick marks drop below the axis line. */
const MOMENTUM_TICK_LENGTH = 7;

/**
 * The half-width of the k window this state should be plotted in: the
 * smallest {@link MOMENTUM_RANGE_LADDER} rung containing every momentum bin
 * that carries more than {@link MOMENTUM_RANGE_FLOOR} of the peak, never
 * wider than the grid's own Nyquist limit pi/dx.
 *
 * Call this on the state a run *starts* from, once, and hold the result for
 * the life of that run. See the note above for the measurements behind both
 * halves of that instruction.
 */
export function momentumDisplayRange(psi: Wavefunction1D): number {
  const { k, amplitudes } = psi.toMomentumSpace();
  const density = amplitudes.map((a) => a.magnitudeSquared());
  const peak = Math.max(...density, Number.MIN_VALUE);

  let nyquist = 0;
  let occupied = 0;
  for (let i = 0; i < k.length; i++) {
    const magnitude = Math.abs(k[i]);
    if (magnitude > nyquist) nyquist = magnitude;
    if (density[i] > MOMENTUM_RANGE_FLOOR * peak && magnitude > occupied) occupied = magnitude;
  }

  return Math.min(MOMENTUM_RANGE_LADDER.find((rung) => rung >= occupied) ?? nyquist, nyquist);
}

/** A tick value as a reader should see it: no trailing zeros, at most two decimals (the ladder above never needs more). */
function formatMomentumTick(value: number): string {
  return Number(value.toFixed(2)).toString();
}

/**
 * LEGEND TYPE: the measurement, and why 11 units was unreadable.
 *
 * This SVG renders `w-full` on a 640-unit viewBox inside a
 * `SimulatorInstrument`, whose body is `p-4 sm:p-5` on an `.instrument`
 * (1px border). On a 320px phone the page column is 320 − 32 = 288px and that
 * instrument takes 2 × (16px padding + 1px border) = 34px out of it, giving
 * 254px on the `/simulators` bench — not the 288px figure the
 * `visualizations/` type pass quoted, which measured the column and forgot the
 * frame it sits in. `WavefunctionExplorer` is also embedded in thirteen
 * lessons, and a lesson embed nests inside `InteractiveSection`, itself an
 * `.instrument` with a `p-4` body whose de-framing selector
 * (`has-[[data-mdx-slot=embed]_.instrument]`) drops that wrapper's border
 * *colour*, wash and shadow but keeps its 1px border box and its padding. So
 * the narrowest real box is 320 − 32 − 34 − 34 = **220px**, and the general
 * rule is effective px = fontSize × box ÷ 640.
 *
 * At the old `fontSize={11}` that is **3.78px** at 220px (4.37px on the
 * bench). This is the only key to which curve is Re(ψ) and which is Im(ψ),
 * which trace is the numerical density and which the analytical one. And
 * because it is SVG `<text>` inside a `role="img"`, it is
 * children-presentational and never announced either. So the legend was
 * simultaneously too small to read and invisible to assistive tech: on the
 * narrowest phone the figure had no key at all.
 *
 * 20 units is the same size `visualizations/tunneling-intro/TunnelingIntroCanvas`
 * settled on for its legend on an identical 640-unit viewBox, and the 340px
 * threshold below is its threshold too. That gate is what makes the 220px box
 * moot for this type: the SVG legend is `display: none` under a 340px
 * container, so the narrowest width it is ever *painted* at is 340px, where it
 * is 20 × 340 ÷ 640 = **10.63px**. The one width worth checking separately is
 * the split-layout threshold, because the gate reads the instrument body while
 * the SVG gets the stage: at a 672px body the stage is 672 − 320 (rail) − 32
 * (gap) = 320px, the narrowest stage on which the legend is visible at all, and
 * 20 × 320 ÷ 640 = 10.00px. Both clear the ~9px floor.
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
 * (not viewport; the stage's own box is what scales the viewBox, and a
 * `SimulatorInstrument` in split layout hands the stage ~320px at container
 * widths a viewport breakpoint would call "desktop") the SVG legend is
 * `display: none` and the HTML `FigureLegend` above takes over at a real 12px.
 */
const LEGEND_SVG_GATE = "hidden @min-[340px]:block";

/**
 * The narrow-viewport legend, in HTML, at a real 12px however narrow the box
 * gets, the pattern `TunnelingIntroCanvas` established, with one deliberate
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

/**
 * ZERO_BASELINE_NOTE
 *
 * All three views draw a horizontal zero line, and all three used to draw it
 * as `stroke="currentColor" strokeOpacity={0.25}`. A quarter of the body
 * foreground is an alpha, not a token, and it put the line under every
 * contrast floor in the system on both themes: 25% of `--foreground` over
 * `--surface` does not reach 3:1, let alone the 4.5:1 the chart channel is
 * authored to.
 *
 * A zero baseline is the canonical mark a reader must perceive: every height
 * in the frame is read as a distance from it, and in the Re/Im view the two
 * curves cross it. `--axis` (4.5:1, `globals.css` section 1) is the token for
 * exactly that. Not `--axis-grid`, which is deliberately under 3:1 and is for
 * optional ruling; not `--border`, which is 1.41:1 panel chrome and is the
 * misuse this whole channel exists to end.
 *
 * The legend text in these same views stays on `--muted-foreground` (6.78:1).
 * Moving annotation text onto `--axis` would *lower* its contrast, since
 * `--axis` sits a step below `--muted-foreground` on purpose; see the notes at
 * the legend entries below.
 */
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
 * parts, or the momentum-space probability density: a pure SVG function of
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
  momentumRange,
}: {
  grid: Grid1D;
  psi: Wavefunction1D;
  potential: readonly number[];
  mode: CanvasMode;
  analyticalDensity?: readonly number[];
  /**
   * Half-width of the k window the momentum view is plotted in, from
   * {@link momentumDisplayRange} called on the run's *starting* state. Omit it
   * and the momentum view falls back to the full +/- pi/dx domain, which is
   * what it drew before this existed and which is unreadable for most presets
   * (see THE MOMENTUM AXIS above). Only `WavefunctionSimulation` ever selects
   * `mode="momentum"`, and it always passes this; the homepage hero renders
   * this canvas in `"density"` mode only, where the prop is unused.
   */
  momentumRange?: number;
  /**
   * Draws ⟨x⟩ (dashed vertical line) and the [⟨x⟩−Δx, ⟨x⟩+Δx] band (light
   * fill) under the density curve, in "density" mode only. Off by default:
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
    // and scaleX's min/max are computed from the same sorted array; using
    // the unsorted array for the scale would take its min/max from k[0]=0
    // and a small negative frequency near the end, collapsing everything
    // else off-screen.
    const order = k.map((_, i) => i).sort((a, b) => k[a] - k[b]);

    // The grid's own Nyquist limit, read off the transform rather than
    // recomputed as pi/dx, so the two can never disagree.
    const nyquist = order.length > 0 ? Math.max(Math.abs(k[order[0]]), Math.abs(k[order[order.length - 1]])) : 1;
    // A caller-supplied window is clamped to the domain that exists; a missing
    // or nonsensical one falls back to the whole domain rather than to a plot
    // with nothing in it.
    const halfRange =
      momentumRange !== undefined && Number.isFinite(momentumRange) && momentumRange > 0
        ? Math.min(momentumRange, nyquist)
        : nyquist;

    // Two bins is the minimum a path can be drawn from. A window this tight is
    // not reachable from `momentumDisplayRange` (its smallest rung, 1, holds
    // twenty bins on the coarsest grid here and seven on the finest), but a
    // hand-passed one could be, and a blank plot is a worse answer than a wide
    // one.
    const insideWindow = order.filter((i) => Math.abs(k[i]) <= halfRange);
    const shown = insideWindow.length >= 2 ? insideWindow : order;
    const sortedK = shown.map((i) => k[i]);
    const sortedDensity = shown.map((i) => density[i]);
    // Normalized to the tallest bin *on screen*, so the curve always fills the
    // frame. That is the same quantity as the global peak for every window
    // this component is actually handed, because the window is built around
    // the peak; it stays correct if it ever is not.
    const maxDensity = Math.max(...sortedDensity, 1e-12);
    const shownHalfRange = insideWindow.length >= 2 ? halfRange : nyquist;
    const toX = (value: number) =>
      PADDING_X + ((value + shownHalfRange) / (2 * shownHalfRange)) * (WIDTH - 2 * PADDING_X);
    const xs = sortedK.map(toX);
    const ys = sortedDensity.map((p) => MOMENTUM_BASELINE_Y - (p / maxDensity) * MOMENTUM_PLOT_HEIGHT);
    const ticks = [-shownHalfRange, -shownHalfRange / 2, 0, shownHalfRange / 2, shownHalfRange];

    return (
      // `@container` on the wrapper, so `@min-[340px]:` below asks about this
      // figure's own box rather than the viewport; see LEGEND_SVG_GATE.
      <div className="@container">
        <FigureLegend items={[{ key: "k", label: "|φ(k)|² (momentum space)", className: "text-accent" }]} />
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full"
          role="img"
          // The plotted range belongs in the label, not just on the ticks: this
          // is the one figure here whose axis is a zoom rather than the whole
          // domain, and the SVG `<text>` that says so is children-presentational
          // under `role="img"` and never announced.
          aria-label={`Momentum-space probability density, plotted for k from ${formatMomentumTick(
            -shownHalfRange
          )} to ${formatMomentumTick(shownHalfRange)}`}
        >
          {/* `--axis`, not `currentColor` at 25%. See ZERO_BASELINE_NOTE. */}
          <line x1={PADDING_X} y1={MOMENTUM_BASELINE_Y} x2={WIDTH - PADDING_X} y2={MOMENTUM_BASELINE_Y} className="stroke-axis" />
          <path d={`${pathFrom(xs, ys)} L ${xs[xs.length - 1]} ${MOMENTUM_BASELINE_Y} L ${xs[0]} ${MOMENTUM_BASELINE_Y} Z`} fill="var(--accent)" fillOpacity={0.18} stroke="var(--accent)" strokeWidth={1.75} />

          {/* The k axis: five ticks, and the centre one carries the axis's name
              as well as its value ("k = 0") because there is no second row to
              put a caption in and the numbers mean nothing unnamed. The tick
              *marks* are `--axis`, the token for a rule that carries a
              coordinate; the tick *labels* are `--muted-foreground` (6.78:1),
              because `--axis` sits a step below it by design and text is the
              one thing that must not be moved down a step. Same split as the
              rest of this file: `stroke-axis` on the lines,
              `fill-muted-foreground` on the words. The end labels anchor
              inward so neither can overhang the viewBox at the padding. */}
          {ticks.map((value, index) => {
            const x = toX(value);
            const isFirst = index === 0;
            const isLast = index === ticks.length - 1;
            return (
              <g key={value}>
                <line
                  x1={x}
                  y1={MOMENTUM_BASELINE_Y}
                  x2={x}
                  y2={MOMENTUM_BASELINE_Y + MOMENTUM_TICK_LENGTH}
                  className="stroke-axis"
                />
                <text
                  x={x}
                  y={MOMENTUM_TICK_LABEL_Y}
                  fontSize={MOMENTUM_AXIS_FONT_SIZE}
                  textAnchor={isFirst ? "start" : isLast ? "end" : "middle"}
                  className="fill-muted-foreground"
                >
                  {value === 0 ? "k = 0" : formatMomentumTick(value)}
                </text>
              </g>
            );
          })}

          {/* Dropped the `opacity={0.55}` along with the size rise: at 8px
              effective this label was faint *and* tiny, and `currentColor` at
              55% on `--surface` does not reach 4.5:1. It now uses the same
              `--accent` as the curve it names, which is also what makes it a
              legend rather than a caption. */}
          <g className={LEGEND_SVG_GATE}>
            <text x={PADDING_X} y={LEGEND_Y1} fontSize={LEGEND_FONT_SIZE} fill="var(--accent)">
              |φ(k)|² (momentum space)
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
            { key: "re", label: "Re(ψ)", className: "text-pillar-text" },
            { key: "im", label: "- - - Im(ψ)", className: "text-accent" },
          ]}
        />
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Real and imaginary parts of the wavefunction">
          {/* `--axis`, not `currentColor` at 25%. See ZERO_BASELINE_NOTE. This
              is the one view where the baseline is a genuine zero the curves
              cross rather than a floor they sit on: Re(psi) and Im(psi) both
              swing through it, and their crossings are how you read the phase. */}
          <line x1={PADDING_X} y1={zeroY} x2={WIDTH - PADDING_X} y2={zeroY} className="stroke-axis" />
          {/* Im is dashed, Re is solid. These two curves used to be told apart
              by colour alone (WCAG 1.4.1), with the legend's only swatch being
              a leading em dash on both entries: identical glyph, different
              fill. That dash also read aloud on some screen readers, and it
              was doing swatch duty in a file whose every other legend entry
              already uses the "- - -" prefix for a dashed trace and a bare
              label for a solid one. Dashing the Im path adopts that same
              convention here, so the key works in greyscale and the entries
              no longer open with a spoken dash. */}
          <path d={pathFrom(xs, imYs)} fill="none" stroke="var(--accent)" strokeWidth={1.5} strokeOpacity={0.8} strokeDasharray="5 3" />
          <path d={pathFrom(xs, reYs)} fill="none" stroke="var(--pillar-accent)" strokeWidth={2} />
          {/* The Im entry sits at PADDING_X + 110, sized for 20-unit type.
              "Re(ψ)" is R (0.66), e (0.55), "(" (0.32), ψ (0.60) and ")"
              (0.32) = 2.45em, which at 20 units is 49 units wide, so the gap
              before the Im entry is 61 units: more slack than the 36 the
              older, wider dash-prefixed label left, and enough that a font
              substitution for ψ cannot close it. "- - - Im(ψ)" is ~6.0em =
              120 units, so
              the pair still ends at x ≈ 242 of 628. */}
          <g className={LEGEND_SVG_GATE}>
            <text x={PADDING_X} y={LEGEND_Y1} fontSize={LEGEND_FONT_SIZE} fill="var(--pillar-accent)">
              Re(ψ)
            </text>
            <text x={PADDING_X + 110} y={LEGEND_Y1} fontSize={LEGEND_FONT_SIZE} fill="var(--accent)">
              - - - Im(ψ)
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

  // ⟨x⟩ and Δx = sqrt(Var(x)), only computed when the overlay is requested,
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
        {/* `--axis`, not `currentColor` at 25%. See ZERO_BASELINE_NOTE. */}
        <line x1={PADDING_X} y1={BASELINE_Y} x2={WIDTH - PADDING_X} y2={BASELINE_Y} className="stroke-axis" />

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

        {/* Potential V(x), shown schematically (its own vertical scale, not shared with probability density).

            `--muted-foreground` at full strength, not `currentColor` at 35%.
            The intent was right and the execution was not: 35% of the body
            foreground is not a token, it is a number, and it lands this trace
            under every contrast floor in the system on both themes. "Secondary"
            is a job for the *dash pattern* and for the muted end of the text
            ramp, both of which this trace can have without going translucent,
            and one of which it already had (the `3 3` dashes the legend
            advertises with its "- - -" prefix).

            The colour is `--muted-foreground` rather than `--axis` for the
            reason spelled out at the legend below: `--axis` sits a step *under*
            `--muted-foreground` by design, so it would have lowered the
            contrast, not raised it. And it is the same token the two legend
            entries for this trace already use (`text-muted-foreground` in the
            DOM legend, `fill-muted-foreground` in the SVG one), so the key and
            the thing it keys are finally the same colour: at 35% of the
            foreground they were not, and a key whose label is a different
            colour from the line it names is a key that has to be guessed at. */}
        <path d={pathFrom(xs, potentialYs)} fill="none" className="stroke-muted-foreground" strokeWidth={1.25} strokeDasharray="3 3" />

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
            legend on a 26-unit step would reach y = 100, 84 units below
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
          {/* `--muted-foreground`, not `--axis`. The previous value here was
              `currentColor` at 50% opacity, which was correctly identified as
              the faintest text in the frame at the smallest size in it — but
              `--axis` is the wrong repair. `--axis` sits a *step below*
              `--muted-foreground` by design (see DESIGN_SYSTEM §2: the frame
              of a figure should be legible without competing with the data),
              so moving annotation text onto it lowers contrast rather than
              raising it. `--axis` is for marks that carry a coordinate; a word
              that names a trace is annotation, and annotation text is
              `--muted-foreground` (6.78:1). This also puts the SVG legend back
              in step with the DOM legend above, whose matching entry has been
              on `text-muted-foreground` all along. */}
          <text x={PADDING_X} y={LEGEND_Y2} fontSize={LEGEND_FONT_SIZE} className="fill-muted-foreground">- - - V(x) (schematic scale)</text>
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
