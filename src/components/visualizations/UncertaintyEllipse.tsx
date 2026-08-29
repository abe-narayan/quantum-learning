"use client";

import { useFrameIndex } from "./useFrameIndex";
import { FrameSlider } from "./FrameSlider";

export type UncertaintyFrame = {
  /** Pre-formatted, e.g. "r = 0.50" — computed by the caller, matching `ParametricCurve`'s `CurveFrame`. */
  paramLabel: string;
  /** Δx for this frame — the ellipse's semi-axis along x. */
  deltaX: number;
  /** Δp for this frame — the ellipse's semi-axis along p. */
  deltaP: number;
};

const WIDTH = 360;
const HEIGHT = 320;
const PAD = 44;

/**
 * A phase-space (x, p) uncertainty region: the ellipse of semi-axes
 * (Δx, Δp) centered at a fixed (⟨x⟩, ⟨p⟩), scrubbed across precomputed
 * frames via a slider — the same "scrub a precomputed array" pattern as
 * `ParametricCurve`/`VectorDiagramExplorer`, applied to a single filled
 * region instead of a line series or vector arrows. Every frame's Δx, Δp
 * must come from the lesson's own real formulas (e.g. e^{-r}/√2, e^{r}/√2)
 * — this component only draws the ellipse it's handed. The x/p scale is
 * isotropic (one shared `scale`, exactly like `VectorDiagram`'s `toSvg`),
 * so a true circle (Δx=Δp, r=0) always renders as a circle, never
 * distorted into an ellipse by mismatched per-axis scaling.
 */
export function UncertaintyEllipse({
  frames,
  center,
  sliderLabel = "",
  ariaLabel,
  xLabel = "x",
  pLabel = "p",
  centerLabel,
}: {
  frames: UncertaintyFrame[];
  /** Fixed phase-space center (⟨x⟩, ⟨p⟩) — the same for every frame; only the ellipse's shape changes across frames. */
  center: { x: number; y: number };
  sliderLabel?: string;
  ariaLabel: string;
  /** Axis label and Δ-readout label for the horizontal quantity. Defaults to "x" for backward compatibility. */
  xLabel?: string;
  /** Axis label and Δ-readout label for the vertical quantity. Defaults to "p" for backward compatibility. */
  pLabel?: string;
  /**
   * Label drawn next to the dot at `center`. Defaults to "(⟨xLabel⟩, ⟨pLabel⟩)", asserting
   * that `center` is a tracked live expectation value — appropriate only when it actually is.
   * Pass a neutral string (e.g. "(0, 0)") or `null` (to omit the label and keep just the dot)
   * when `center` is a fixed reference point rather than a real ⟨x⟩, ⟨p⟩ being tracked.
   */
  centerLabel?: string | null;
}) {
  const { index, setIndex, frame } = useFrameIndex(frames);
  const resolvedCenterLabel = centerLabel === null ? null : centerLabel ?? `(⟨${xLabel}⟩, ⟨${pLabel}⟩)`;

  const maxDeltaX = Math.max(...frames.map((f) => f.deltaX));
  const maxDeltaP = Math.max(...frames.map((f) => f.deltaP));
  const xs = [center.x - maxDeltaX, center.x + maxDeltaX, 0];
  const ys = [center.y - maxDeltaP, center.y + maxDeltaP, 0];
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = (maxX - minX || 1) * 1.3;
  const spanY = (maxY - minY || 1) * 1.3;
  const plotW = WIDTH - 2 * PAD;
  const plotH = HEIGHT - 2 * PAD;
  const scale = Math.min(plotW / spanX, plotH / spanY);
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  const toSvg = (x: number, y: number) => ({
    x: WIDTH / 2 + (x - midX) * scale,
    y: HEIGHT / 2 - (y - midY) * scale,
  });

  const origin = toSvg(0, 0);
  const axisXStart = toSvg(minX - spanX * 0.1, 0);
  const axisXEnd = toSvg(maxX + spanX * 0.1, 0);
  const axisYStart = toSvg(0, minY - spanY * 0.1);
  const axisYEnd = toSvg(0, maxY + spanY * 0.1);
  const centerSvg = toSvg(center.x, center.y);
  const product = frame.deltaX * frame.deltaP;

  return (
    <div className="not-prose space-y-3 panel-inset p-4">
      <div className="overflow-x-auto">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
          {/* The axes. This figure's claim is that the ellipse's *extent
              along each axis* is the pair of uncertainties, which is
              unreadable if the axes aren't. Moved off `--border` - the
              panel-edge token, 1.41:1 on `--surface-muted`, under the 3:1
              WCAG 2.1 SC 1.4.11 floor - onto `--axis`, which clears 3:1 on
              every panel depth in both themes. */}
          <g className="stroke-axis" strokeWidth={1.25}>
            <line x1={axisXStart.x} y1={axisXStart.y} x2={axisXEnd.x} y2={axisXEnd.y} />
            <line x1={axisYStart.x} y1={axisYStart.y} x2={axisYEnd.x} y2={axisYEnd.y} />
          </g>
          {/* viewBox 360 rendered `w-full`. The scale is NOT 0.8:
              The box is 254px, not 288px: 288 is the *page column* on a 320px phone
              (320 less Container's `px-4` gutters), but this SVG renders inside
              `panel-inset p-4`, and `panel-inset` (globals.css) supplies border,
              radius and fill and no padding at all — the `p-4` does. Subtract
              2 x (16px padding + 1px border) = 34px.
              The real box is 254px, so the scale is 254/360 = 0.706 —
              `text-[11px]` painted at 7.8px, not 8.8px, and 14 units gives
              **9.88px**, not 11.2px. 14 still clears the ~9px floor, so the
              size stands and only the arithmetic is corrected. */}
          <text x={axisXEnd.x - 4} y={axisXEnd.y - 8} textAnchor="end" fontSize={14} className="fill-axis">
            {xLabel}
          </text>
          <text x={axisYEnd.x + 7} y={axisYEnd.y + 5} textAnchor="start" fontSize={14} className="fill-axis">
            {pLabel}
          </text>
          <circle cx={origin.x} cy={origin.y} r={2} className="fill-axis" />
          <ellipse
            cx={centerSvg.x}
            cy={centerSvg.y}
            rx={Math.max(frame.deltaX * scale, 1)}
            ry={Math.max(frame.deltaP * scale, 1)}
            className="fill-brand/15 stroke-brand"
            strokeWidth={2}
          />
          <circle cx={centerSvg.x} cy={centerSvg.y} r={2.5} className="fill-foreground" />
          {/* viewBox 360 rendered `w-full`: 0.706 scale against the real
              254px box (see the axis-label note above), so 10 units painted
              at 7.06px and 13 gives **9.17px** — still clear of the ~9px
              floor, so the size stands. */}
          {resolvedCenterLabel !== null && (
            <text x={centerSvg.x + 8} y={centerSvg.y - 8} fontSize={13} className="fill-foreground font-medium">
              {resolvedCenterLabel}
            </text>
          )}
        </svg>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>
          Δ{xLabel} = <span className="font-mono text-foreground">{frame.deltaX.toFixed(4)}</span>
        </span>
        <span>
          Δ{pLabel} = <span className="font-mono text-foreground">{frame.deltaP.toFixed(4)}</span>
        </span>
        <span>
          Δ{xLabel}·Δ{pLabel} = <span className="font-mono text-foreground">{product.toFixed(4)}</span>
        </span>
      </div>

      {frames.length > 1 && (
        <FrameSlider
          label={sliderLabel}
          valueLabel={frame.paramLabel}
          index={index}
          max={frames.length - 1}
          onChange={setIndex}
          boxed={false}
        />
      )}
    </div>
  );
}
