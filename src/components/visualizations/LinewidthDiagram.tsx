"use client";

import { useId, useState } from "react";

const WIDTH = 340;
const LEVEL_WIDTH = 140;
const LABEL_X = LEVEL_WIDTH + 14;
const LEVEL_PANEL_HEIGHT = 150;
const GROUND_Y = 128;
const EXCITED_CENTER_Y = 50;
const PANEL_GAP = 20;
const CURVE_PANEL_HEIGHT = 140;
const CURVE_PAD_X = 28;
const CURVE_PAD_Y = 18;
/** Energy-detuning half-width plotted either side of line center, natural units (hbar = 1). */
const CURVE_DOMAIN_HALF = 3;

/**
 * Two linked panels showing what Delta E * Delta t_A >= hbar/2 means for a
 * decaying excited state, complementing (not replacing) the lesson's
 * ParametricCurve, which only verifies the bound numerically.
 *
 * Panel A draws the excited level not as a sharp line but as a soft,
 * vertically-blurred band -- its width is the state's energy spread.
 * Panel B draws the corresponding emission line as a normalized Lorentzian.
 * Both are driven by the same slider, the lifetime Delta t_A; the energy
 * spread shown is the bound evaluated at equality, Delta E = hbar / (2
 * Delta t_A) -- the minimum, and physically realized, natural linewidth for
 * that lifetime. Dragging toward a short lifetime visibly smears the level
 * and broadens the peak; dragging toward a long lifetime sharpens both.
 */
export function LinewidthDiagram({
  ariaLabel,
  minDeltaT = 0.3,
  maxDeltaT = 4,
  initialDeltaT = 1,
  hbar = 1,
}: {
  ariaLabel: string;
  minDeltaT?: number;
  maxDeltaT?: number;
  initialDeltaT?: number;
  /** Natural units by default (hbar = 1), matching this lesson's worked example. */
  hbar?: number;
}) {
  const sliderId = useId();
  const [deltaT, setDeltaT] = useState(initialDeltaT);
  const deltaE = hbar / (2 * deltaT);

  // Both the band's half-height and how much it's blurred track the same
  // deltaE, so the level panel reads as one energy spread, not two
  // independently-tuned knobs.
  const bandHalfHeight = Math.max(2, deltaE * 28);
  const blurStdDev = Math.max(0.4, deltaE * 9);

  const curveWidth = WIDTH - 2 * CURVE_PAD_X;
  const curveHeight = CURVE_PANEL_HEIGHT - 2 * CURVE_PAD_Y;
  const samples = 120;
  const gammaHalf = deltaE;
  const lorentzianPath = Array.from({ length: samples + 1 }, (_, i) => {
    const x = -CURVE_DOMAIN_HALF + (i / samples) * 2 * CURVE_DOMAIN_HALF;
    const intensity = (gammaHalf * gammaHalf) / (x * x + gammaHalf * gammaHalf);
    const px = CURVE_PAD_X + ((x + CURVE_DOMAIN_HALF) / (2 * CURVE_DOMAIN_HALF)) * curveWidth;
    const py = CURVE_PAD_Y + (1 - intensity) * curveHeight;
    return `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`;
  }).join(" ");

  // The trailing 10 units are descender room for the x-axis name under the curve
  // panel: at 13 units its baseline sits 2 units below CURVE_PANEL_HEIGHT and would
  // otherwise be clipped by the viewBox rather than merely by the panel's nominal
  // bottom edge.
  const totalHeight = LEVEL_PANEL_HEIGHT + PANEL_GAP + CURVE_PANEL_HEIGHT + 10;

  return (
    <div className="not-prose space-y-4 panel-inset p-4">
      <div className="overflow-x-auto">
        <svg
          width={WIDTH}
          height={totalHeight}
          viewBox={`0 0 ${WIDTH} ${totalHeight}`}
          className="w-full"
          role="img"
          // The image label used to be the caller's static sentence, so a screen-reader
          // user moving the slider was told the figure had changed but never what it
          // now showed — the two panels are the *only* place the current spread is
          // drawn. Composing the live values in matches what `LossVsDecoherence` and
          // `DecoherenceBlochDecay` already do with their own state.
          aria-label={`${ariaLabel} Currently: lifetime Δt_A = ${deltaT.toFixed(2)}, giving an energy spread ΔE = ${deltaE.toFixed(
            3
          )} and an emission line of that width.`}
        >
          <defs>
            {/* Blur only along y (energy), so the band's horizontal extent
                stays crisp and only its energy spread reads as "smeared." */}
            <filter id="linewidth-band-blur" x="-20%" y="-200%" width="140%" height="500%">
              <feGaussianBlur stdDeviation={`0 ${blurStdDev.toFixed(2)}`} />
            </filter>
          </defs>

          <g>
            <line x1={0} y1={GROUND_Y} x2={LEVEL_WIDTH} y2={GROUND_Y} strokeWidth={2} className="stroke-brand/70" />
            {/* `text-xs` is 12px, i.e. 12 *user units* here; this 340-unit viewBox
                renders `w-full`, so in a ~256px column on a 320px phone a unit is
                ~0.75px and 12 came out at ~9px — right on the floor. 14 units gives
                ~10.5px. LABEL_X is 154, so a 14-unit "ground state" ends near x=246,
                well inside the box. */}
            <text x={LABEL_X} y={GROUND_Y + 4} className="fill-muted-foreground text-[14px]">
              ground state
            </text>

            <rect
              x={0}
              y={EXCITED_CENTER_Y - bandHalfHeight}
              width={LEVEL_WIDTH}
              height={bandHalfHeight * 2}
              className="fill-accent/60"
              filter="url(#linewidth-band-blur)"
            />
            <line
              x1={0}
              y1={EXCITED_CENTER_Y}
              x2={LEVEL_WIDTH}
              y2={EXCITED_CENTER_Y}
              strokeWidth={1}
              className="stroke-accent"
              strokeDasharray="3 2"
            />
            <text x={LABEL_X} y={EXCITED_CENTER_Y - 4} className="fill-accent text-[14px] font-semibold">
              excited state
            </text>
            {/* ΔE is the live quantity the slider drives and the number the reader is
                meant to tie to the band's width — 10 units put it at ~7.5px on a
                320px phone. 13 units, and the offset opens 12 -> 14 to match. */}
            <text x={LABEL_X} y={EXCITED_CENTER_Y + 14} className="fill-muted-foreground text-[13px]">
              ΔE = {deltaE.toFixed(3)}
            </text>
          </g>

          <g transform={`translate(0, ${LEVEL_PANEL_HEIGHT + PANEL_GAP})`}>
            <line
              x1={CURVE_PAD_X}
              y1={CURVE_PAD_Y + curveHeight}
              x2={WIDTH - CURVE_PAD_X}
              y2={CURVE_PAD_Y + curveHeight}
              // The Lorentzian's baseline. It is what "the peak broadens" is measured
              // against — the visible width of the curve where it meets this line IS
              // the linewidth the figure is about — so it is load-bearing, not a frame.
              // It was `stroke-border`, the panel-edge token at 1.41:1 on
              // `--surface-muted`, under WCAG 2.1 SC 1.4.11's 3:1 for meaningful
              // graphical objects. `stroke-axis` is the chart channel.
              className="stroke-axis"
              strokeWidth={1}
            />
            {/* Both axis names 10 -> 13 units (~7.5px -> ~9.8px in a ~256px column).
                At 13 the longer one is ~264 units and, anchored at x = 312, starts
                around x = 48 — clear of the 28-unit left pad. */}
            <text
              x={WIDTH - CURVE_PAD_X}
              y={CURVE_PAD_Y + curveHeight + 16}
              textAnchor="end"
              className="fill-muted-foreground text-[13px]"
            >
              emission energy (relative to line center)
            </text>
            <text x={CURVE_PAD_X} y={CURVE_PAD_Y - 4} className="fill-muted-foreground text-[13px]">
              intensity
            </text>
            <path d={lorentzianPath} fill="none" className="stroke-brand" strokeWidth={2} />
          </g>
        </svg>
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={sliderId} className="text-sm text-foreground">
            Lifetime Δt_A
          </label>
          <span className="font-mono text-xs text-muted-foreground">
            Δt_A = {deltaT.toFixed(2)}, ΔE = {deltaE.toFixed(3)} (ΔE·Δt_A = {(deltaE * deltaT).toFixed(2)} = ℏ/2)
          </span>
        </div>
        <input
          id={sliderId}
          type="range"
          min={minDeltaT}
          max={maxDeltaT}
          step={0.05}
          value={deltaT}
          onChange={(event) => setDeltaT(Number(event.target.value))}
          // `h-11`: a range input centres its track inside whatever height it is
          // given, so this buys the 44px touch target WCAG 2.5.8 asks for without
          // changing how the track looks. Same trick, same comment, as `FrameSlider`,
          // which every other scrubbable figure in this directory uses; this one
          // hand-rolls its input because its value is a continuous float rather than a
          // frame index, and it had been left at the browser default ~20px.
          //
          // `accent-brand` replaces `accent-[var(--brand)]`: identical output, but the
          // arbitrary-value form bypasses the theme token Tailwind already exposes as
          // a utility, and every other control in this directory writes `accent-brand`.
          className="h-11 w-full accent-brand"
          aria-valuetext={`lifetime Δt_A = ${deltaT.toFixed(2)}, ΔE = ${deltaE.toFixed(3)}`}
        />
        <p className="text-xs text-muted-foreground">
          Drag the slider to change the lifetime Δt_A; ΔE is fixed at the bound&rsquo;s minimum,
          ΔE = ℏ/(2Δt_A). A short-lived state (small Δt_A) forces a wide, smeared level and a
          broad emission peak &mdash; the natural linewidth. A long-lived state narrows both.
        </p>
      </div>
    </div>
  );
}
