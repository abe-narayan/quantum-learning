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
  const pxOfDetuning = (x: number) => CURVE_PAD_X + ((x + CURVE_DOMAIN_HALF) / (2 * CURVE_DOMAIN_HALF)) * curveWidth;
  const pyOfIntensity = (intensity: number) => CURVE_PAD_Y + (1 - intensity) * curveHeight;
  const lorentzianPath = Array.from({ length: samples + 1 }, (_, i) => {
    const x = -CURVE_DOMAIN_HALF + (i / samples) * 2 * CURVE_DOMAIN_HALF;
    const intensity = (gammaHalf * gammaHalf) / (x * x + gammaHalf * gammaHalf);
    return `${i === 0 ? "M" : "L"}${pxOfDetuning(x).toFixed(1)},${pyOfIntensity(intensity).toFixed(1)}`;
  }).join(" ");

  /**
   * Full width at half maximum. For I(x) = γ²/(x² + γ²) the half-maximum
   * crossings are exactly x = ±γ, so FWHM = 2γ = 2ΔE. This is what makes the
   * lower panel readable as a *measurement* rather than a shape that gets
   * fatter: the reader can put a ruler on the marked span and get the same
   * number the readout prints, and see it equal twice the ΔE drawn as the
   * band's height in the panel above.
   */
  const fwhm = 2 * gammaHalf;
  const halfMaxY = pyOfIntensity(0.5);
  const fwhmLeftPx = pxOfDetuning(-gammaHalf);
  const fwhmRightPx = pxOfDetuning(gammaHalf);

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
          // now showed - the two panels are the *only* place the current spread is
          // drawn. Composing the live values in matches what `LossVsDecoherence` and
          // `DecoherenceBlochDecay` already do with their own state.
          aria-label={`${ariaLabel} Currently: lifetime Δt_A = ${deltaT.toFixed(2)}, giving an energy spread ΔE = ${deltaE.toFixed(
            3
          )} and an emission line whose full width at half maximum is ${fwhm.toFixed(3)}.`}
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
                ~0.75px and 12 came out at ~9px - right on the floor. 14 units gives
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
                meant to tie to the band's width - 10 units put it at ~7.5px on a
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
              // against - the visible width of the curve where it meets this line IS
              // the linewidth the figure is about - so it is load-bearing, not a frame.
              // It was `stroke-border`, the panel-edge token at 1.41:1 on
              // `--surface-muted`, under WCAG 2.1 SC 1.4.11's 3:1 for meaningful
              // graphical objects. `stroke-axis` is the chart channel.
              className="stroke-axis"
              strokeWidth={1}
            />
            {/* Both axis names 10 -> 13 units (~7.5px -> ~9.8px in a ~256px column).
                At 13 the longer one is ~264 units and, anchored at x = 312, starts
                around x = 48 - clear of the 28-unit left pad.

                "relative to line center", not "relative to center": at 42
                characters the longer wording was running text over
                `scripts/audit/responsive.mjs`'s 40-character running-text
                threshold, painting at 13 x 254/340 = 9.71px effective on a
                320px phone - under that check's 12px floor even though it
                clears this file's own ~9px in-SVG guard. "line" is
                redundant here (the whole panel is the emission line), so
                dropping it gets to 36 characters without losing the claim. */}
            <text
              x={WIDTH - CURVE_PAD_X}
              y={CURVE_PAD_Y + curveHeight + 16}
              textAnchor="end"
              className="fill-muted-foreground text-[13px]"
            >
              emission energy (relative to center)
            </text>
            <text x={CURVE_PAD_X} y={CURVE_PAD_Y - 4} className="fill-muted-foreground text-[13px]">
              intensity
            </text>

            {/* HALF-MAXIMUM RULING AND THE FWHM SPAN.
                Before this, the lower panel had no vertical scale at all: "intensity"
                named the quantity but nothing said where the peak's maximum was or
                where half of it fell, so "the peak broadens" was something the reader
                had to take on trust from the caption. The ruling at I = 1/2 turns the
                panel into a measurement - the curve's width where it crosses this line
                IS the linewidth, and the marked span is exactly 2ΔE (see `fwhm`),
                which is the number the readout below prints and twice the ΔE drawn as
                the band height in the panel above.

                `stroke-axis-grid` for the ruling: it is optional background reference
                that runs the full panel width. The span bracket on top of it is
                `stroke-accent`, matching the excited-state band above, because that is
                the mark the reader is asked to actually look at. */}
            <line
              x1={CURVE_PAD_X}
              y1={halfMaxY}
              x2={WIDTH - CURVE_PAD_X}
              y2={halfMaxY}
              className="stroke-axis-grid"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            {/* Left-anchored just inside the pad and just above the ruling, which
                puts it in a band that is provably clear of the curve rather than
                merely clear at the default state. The Lorentzian is above the
                half-maximum ruling only between x = ±γ, i.e. only between
                fwhmLeftPx and fwhmRightPx; the widest γ the slider reaches
                (Δt_A = 0.3, so γ = 1.667) puts fwhmLeftPx at 91.1, and this
                8-character label ends near x = 86. So at every slider position the
                curve is at or below y = halfMaxY wherever this label sits. */}
            <text x={CURVE_PAD_X + 2} y={halfMaxY - 5} className="fill-muted-foreground text-[13px]">
              half max
            </text>
            <g className="stroke-accent" strokeWidth={1.5}>
              <line x1={fwhmLeftPx} y1={halfMaxY} x2={fwhmRightPx} y2={halfMaxY} />
              <line x1={fwhmLeftPx} y1={halfMaxY - 5} x2={fwhmLeftPx} y2={halfMaxY + 5} />
              <line x1={fwhmRightPx} y1={halfMaxY - 5} x2={fwhmRightPx} y2={halfMaxY + 5} />
            </g>

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
            Δt_A = {deltaT.toFixed(2)}, ΔE = {deltaE.toFixed(3)}, FWHM = {fwhm.toFixed(3)} (ΔE·Δt_A = {(deltaE * deltaT).toFixed(2)} = ℏ/2)
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
          aria-valuetext={`lifetime Δt_A = ${deltaT.toFixed(2)}, ΔE = ${deltaE.toFixed(3)}, emission linewidth FWHM = ${fwhm.toFixed(3)}`}
        />
        <p className="text-xs text-muted-foreground">
          Drag the slider to change the lifetime Δt_A; ΔE is fixed at the bound&rsquo;s minimum,
          ΔE = ℏ/(2Δt_A). A short-lived state (small Δt_A) forces a wide, smeared level and a
          broad emission peak, the natural linewidth. The marked span on the lower panel is the
          full width at half maximum, and it is always exactly 2ΔE. A long-lived state narrows both.
        </p>
      </div>
    </div>
  );
}
