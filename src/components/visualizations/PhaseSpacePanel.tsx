"use client";

import { useFrameIndex } from "./useFrameIndex";
import { FrameSlider } from "./FrameSlider";

export type PhaseSpaceEllipseFrame = {
  /** Pre-formatted, e.g. "x = 1, p = 2.0 → E(x,p) = 4.00" — computed by the caller, reused verbatim from an existing frame array rather than recomputed. */
  paramLabel: string;
  /** Position coordinate of the state point (x, p) for this frame. */
  x: number;
  /** Momentum coordinate of the state point (x, p) for this frame. */
  p: number;
};

export type PhaseSpaceBoxFrame = {
  /** Pre-formatted, e.g. "Δx = 1.0×10⁻¹⁰ m" — computed by the caller. */
  paramLabel: string;
  /** Full box width along x for this frame (the box spans -deltaX/2 .. +deltaX/2). */
  deltaX: number;
  /** Full box height along p for this frame — callers pass ħ/(2·deltaX) (the Heisenberg minimum Δp), so deltaX·deltaP stays pinned at ħ/2 across every frame. */
  deltaP: number;
};

const WIDTH = 360;
const HEIGHT = 320;
const PAD = 44;
/** Gridlines drawn at these fractions of the axis half-extent, mirrored to both sides of the origin. */
const GRID_FRACTIONS = [0.25, 0.5, 0.75];

type ToSvg = (x: number, p: number) => { x: number; y: number };

/** Axes, gridlines, and axis labels shared by both panel modes — everything except the plotted shape itself. */
function PhaseSpaceAxes({ maxX, maxP, toSvg }: { maxX: number; maxP: number; toSvg: ToSvg }) {
  const origin = toSvg(0, 0);
  const xAxisStart = toSvg(-maxX, 0);
  const xAxisEnd = toSvg(maxX, 0);
  const pAxisStart = toSvg(0, -maxP);
  const pAxisEnd = toSvg(0, maxP);
  const xTicks = GRID_FRACTIONS.flatMap((f) => [f * maxX, -f * maxX]);
  const pTicks = GRID_FRACTIONS.flatMap((f) => [f * maxP, -f * maxP]);

  return (
    <>
      <g className="stroke-border/50" strokeWidth={1}>
        {xTicks.map((v, i) => {
          const top = toSvg(v, maxP);
          const bottom = toSvg(v, -maxP);
          return <line key={`gx${i}`} x1={top.x} y1={top.y} x2={bottom.x} y2={bottom.y} />;
        })}
        {pTicks.map((v, i) => {
          const left = toSvg(-maxX, v);
          const right = toSvg(maxX, v);
          return <line key={`gp${i}`} x1={left.x} y1={left.y} x2={right.x} y2={right.y} />;
        })}
      </g>
      <g className="stroke-border" strokeWidth={1}>
        <line x1={xAxisStart.x} y1={xAxisStart.y} x2={xAxisEnd.x} y2={xAxisEnd.y} />
        <line x1={pAxisStart.x} y1={pAxisStart.y} x2={pAxisEnd.x} y2={pAxisEnd.y} />
      </g>
      <text x={xAxisEnd.x - 4} y={xAxisEnd.y - 6} textAnchor="end" className="fill-muted-foreground text-[11px]">
        x
      </text>
      <text x={pAxisEnd.x + 6} y={pAxisEnd.y + 4} textAnchor="start" className="fill-muted-foreground text-[11px]">
        p
      </text>
      <circle cx={origin.x} cy={origin.y} r={1.5} className="fill-muted-foreground" />
    </>
  );
}

function PhaseSpaceEllipsePanel({
  frames,
  energy,
  mass,
  springK,
  sliderLabel = "",
  ariaLabel,
}: {
  frames: PhaseSpaceEllipseFrame[];
  energy: number;
  mass: number;
  springK: number;
  sliderLabel?: string;
  ariaLabel: string;
}) {
  const { index, setIndex, frame } = useFrameIndex(frames);

  // Semi-axes of the fixed energy contour p²/2m + ½kx² = energy: p=0 gives
  // x=±√(2E/k), x=0 gives p=±√(2mE). Drawn once — this ellipse never
  // changes shape across frames, only the state-point marker moves.
  const a = Math.sqrt((2 * energy) / springK);
  const b = Math.sqrt(2 * mass * energy);

  const plotW = WIDTH - 2 * PAD;
  const plotH = HEIGHT - 2 * PAD;
  const maxX = Math.max(a, ...frames.map((f) => Math.abs(f.x))) * 1.3;
  const maxP = Math.max(b, ...frames.map((f) => Math.abs(f.p))) * 1.3;
  // Isotropic scale (one shared factor, like `VectorDiagram`/`UncertaintyEllipse`)
  // so the ellipse's true geometric shape is never distorted.
  const scale = Math.min(plotW / (2 * maxX), plotH / (2 * maxP));

  const toSvg: ToSvg = (x, p) => ({ x: WIDTH / 2 + x * scale, y: HEIGHT / 2 - p * scale });
  const center = toSvg(0, 0);
  const point = toSvg(frame.x, frame.p);
  const xFoot = toSvg(frame.x, 0);

  // The state point only lies on this fixed-E contour for the one frame
  // whose (x, p) actually has this energy — everywhere else it's off the
  // curve, which is the point: E(x,p) is a function of the state, not a
  // free dial.
  const onCurve = Math.abs((frame.p ** 2) / (2 * mass) + 0.5 * springK * frame.x ** 2 - energy) < 0.05;

  return (
    <div className="not-prose space-y-3 panel-inset p-4">
      <div className="overflow-x-auto">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
          <PhaseSpaceAxes maxX={maxX} maxP={maxP} toSvg={toSvg} />
          <ellipse
            cx={center.x}
            cy={center.y}
            rx={a * scale}
            ry={b * scale}
            className="fill-brand/10 stroke-brand"
            strokeWidth={2}
          />
          <text x={center.x + a * scale + 4} y={center.y - 4} className="fill-brand text-[10px] font-medium">
            E = {energy}
          </text>
          <line
            x1={xFoot.x}
            y1={xFoot.y}
            x2={point.x}
            y2={point.y}
            className="stroke-muted-foreground/60"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <circle cx={point.x} cy={point.y} r={4} className={onCurve ? "fill-accent stroke-accent" : "fill-foreground stroke-none"} />
          <text x={point.x + 8} y={point.y - 8} className="fill-foreground text-[10px] font-medium">
            (x, p)
          </text>
        </svg>
      </div>

      <p className="text-xs text-muted-foreground">
        {onCurve ? (
          <span className="text-accent font-medium">On the E = {energy} contour.</span>
        ) : (
          <span>Off the E = {energy} contour — this state has a different energy.</span>
        )}
      </p>

      {frames.length > 1 && (
        <FrameSlider label={sliderLabel} valueLabel={frame.paramLabel} index={index} max={frames.length - 1} onChange={setIndex} boxed={false} />
      )}
    </div>
  );
}

function PhaseSpaceBoxPanel({
  frames,
  sliderLabel = "",
  ariaLabel,
  productSuffix = "= ħ/2 (pinned)",
}: {
  frames: PhaseSpaceBoxFrame[];
  sliderLabel?: string;
  ariaLabel: string;
  productSuffix?: string;
}) {
  const { index, setIndex, frame } = useFrameIndex(frames);

  const plotW = WIDTH - 2 * PAD;
  const plotH = HEIGHT - 2 * PAD;
  const maxX = Math.max(...frames.map((f) => f.deltaX / 2)) * 1.3;
  const maxP = Math.max(...frames.map((f) => f.deltaP / 2)) * 1.3;
  // Independent per-axis scale (unlike the ellipse panel): Δx and Δp live
  // in very different display units here, so forcing one shared scale
  // would make the box unreadably thin or tall rather than showing the
  // width/height trade-off clearly.
  const scaleX = plotW / (2 * maxX);
  const scaleY = plotH / (2 * maxP);

  const toSvg: ToSvg = (x, p) => ({ x: WIDTH / 2 + x * scaleX, y: HEIGHT / 2 - p * scaleY });
  const topLeft = toSvg(-frame.deltaX / 2, frame.deltaP / 2);
  const product = frame.deltaX * frame.deltaP;

  return (
    <div className="not-prose space-y-3 panel-inset p-4">
      <div className="overflow-x-auto">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
          <PhaseSpaceAxes maxX={maxX} maxP={maxP} toSvg={toSvg} />
          <rect
            x={topLeft.x}
            y={topLeft.y}
            width={Math.max(frame.deltaX * scaleX, 1)}
            height={Math.max(frame.deltaP * scaleY, 1)}
            className="fill-brand/15 stroke-brand"
            strokeWidth={2}
          />
        </svg>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>
          Δx = <span className="font-mono text-foreground">{frame.deltaX.toFixed(2)}</span>
        </span>
        <span>
          Δp = <span className="font-mono text-foreground">{frame.deltaP.toFixed(2)}</span>
        </span>
        <span>
          Δx·Δp = <span className="font-mono text-foreground">{product.toFixed(2)}</span> {productSuffix}
        </span>
      </div>

      {frames.length > 1 && (
        <FrameSlider label={sliderLabel} valueLabel={frame.paramLabel} index={index} max={frames.length - 1} onChange={setIndex} boxed={false} />
      )}
    </div>
  );
}

/**
 * A lightweight (x, p) phase-space panel shared by two Classical-to-Quantum
 * lessons that both need a phase-space picture, for structurally different
 * reasons:
 *
 * - `mode="ellipse"` (Classical States and Observables): draws ONE fixed
 *   constant-energy contour p²/2m + ½kx² = energy, plus a state-point
 *   marker at (x, p) that moves as the slider scrubs frames. The point
 *   lands ON the ellipse only for the frame whose (x, p) actually has that
 *   energy — everywhere else it's visibly off the curve, reinforcing that
 *   E(x,p) is a function evaluated at a state, not a free constant.
 * - `mode="box"` (Position and Momentum): draws a rectangle of width Δx
 *   (slider-controlled) and height Δp centered at the origin. Callers pass
 *   Δp = ħ/(2Δx) (the Heisenberg minimum) as the box height per frame, so
 *   the box visibly stretches vertically as it's squeezed horizontally
 *   while Δx·Δp stays pinned at ħ/2.
 *
 * Both modes share the same axes/gridline rendering; only the plotted
 * shape differs. Every frame's numbers must come from the lesson's own
 * real data — reused from an existing frame array, never recomputed here —
 * this component only draws what it's handed.
 */
export function PhaseSpacePanel(
  props:
    | {
        mode: "ellipse";
        frames: PhaseSpaceEllipseFrame[];
        /** Fixed energy of the contour to draw (e.g. the worked example's E = 4). */
        energy: number;
        /** Mass m used in p²/2m. */
        mass: number;
        /** Spring constant k used in ½kx². */
        springK: number;
        sliderLabel?: string;
        ariaLabel: string;
      }
    | {
        mode: "box";
        frames: PhaseSpaceBoxFrame[];
        sliderLabel?: string;
        ariaLabel: string;
        /** Overrides the box panel's "Δx·Δp = <value> …" trailing text. Defaults to "= ħ/2 (pinned)", which is only literally true in natural units (ħ=1); callers feeding SI-scaled-but-not-nondimensionalized values (e.g. Δx in ×10⁻¹⁰ m) should pass an honest suffix instead. */
        productSuffix?: string;
      },
) {
  if (props.mode === "ellipse") {
    return (
      <PhaseSpaceEllipsePanel
        frames={props.frames}
        energy={props.energy}
        mass={props.mass}
        springK={props.springK}
        sliderLabel={props.sliderLabel}
        ariaLabel={props.ariaLabel}
      />
    );
  }
  return (
    <PhaseSpaceBoxPanel
      frames={props.frames}
      sliderLabel={props.sliderLabel}
      ariaLabel={props.ariaLabel}
      productSuffix={props.productSuffix}
    />
  );
}
