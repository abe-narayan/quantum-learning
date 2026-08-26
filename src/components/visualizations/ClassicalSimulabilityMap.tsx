/**
 * MDX usage (`when-classical-simulation-works.mdx`, and any lesson plotting
 * circuits against the two classical-simulability criteria):
 *
 *   <ClassicalSimulabilityMap
 *     maxEbits={3}
 *     points={[
 *       { label: "Circuit A", note: "Clifford, max-entangled", isClifford: true, entanglementEbits: cliffordCuts[2].renyiTwo },
 *       { label: "Circuit B", note: "one T-gate, bounded entanglement", isClifford: false, entanglementEbits: circuitBEntropy },
 *       { label: "Random circuit", note: "advantage attempt", isClifford: false, entanglementEbits: 2.9, color: "danger" },
 *     ]}
 *     ariaLabel="Classical-simulability map: gate set versus entanglement, with two independent easy bands."
 *   />
 *
 * The two sufficient conditions for efficient classical simulation —
 * Gottesman-Knill (gate set alone, any entanglement) and a bounded
 * tensor-network bond dimension (entanglement alone, any gate set) — are
 * logically independent, so a circuit only needs to satisfy one to be easy.
 * This plots real circuits on those two axes and shades both "escape hatch"
 * bands, making visible what `when-classical-simulation-works.mdx` proves
 * numerically: a maximally-entangled Clifford circuit and a low-entanglement
 * non-Clifford circuit are BOTH easy, for entirely different reasons, and
 * only a circuit satisfying neither condition is a genuine hardness
 * candidate. `entanglementEbits` must be a real value the caller computed
 * (e.g. from `purity`/`vonNeumannEntropy`'s Rényi-2 or von Neumann entropy
 * on an actual `partialTrace`) — this component only lays it out. `isClifford`
 * is the caller's own categorical fact about the circuit's gate set
 * (Gottesman-Knill's premise is a yes/no fact about which gates were used,
 * not a continuous quantity), not a value this component infers.
 */

const WIDTH = 480;
const HEIGHT = 380;
const PLOT = { x: 70, y: 30, w: 370, h: 290 };
/** Where the Clifford/non-Clifford divide sits within the plot, as a fraction of its width. */
const CLIFFORD_BAND_FRACTION = 0.24;
/** Where the low-entanglement band's top sits, as a fraction of the plot's height (from the top). */
const BOUNDED_BAND_FRACTION = 0.3;

export type SimulabilityPoint = {
  label: string;
  /** Whether this circuit is built entirely (or almost entirely) from Clifford gates + Pauli measurements — a categorical fact about its gate set, supplied by the caller. */
  isClifford: boolean;
  /** Real computed entanglement at the circuit's relevant cut, in ebits (e.g. Rényi-2 or von Neumann entropy). */
  entanglementEbits: number;
  note?: string;
  color?: "brand" | "accent" | "danger" | "muted";
};

const DOT_FILL: Record<NonNullable<SimulabilityPoint["color"]>, string> = {
  brand: "fill-brand",
  accent: "fill-accent",
  danger: "fill-danger",
  muted: "fill-muted-foreground",
};
const LABEL_FILL: Record<NonNullable<SimulabilityPoint["color"]>, string> = {
  brand: "fill-brand",
  accent: "fill-accent",
  danger: "fill-danger",
  muted: "fill-muted-foreground",
};

/** Greedy word-wrap for the narrow Clifford band's SVG label. `MAX_CHARS` is
 *  tuned to the band width at the component's fixed 9.5px type size; a word
 *  longer than that is left on its own line rather than broken mid-word. */
function wrapLabel(label: string, maxChars = 18): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of label.split(/\s+/).filter(Boolean)) {
    if (!current) current = word;
    else if (`${current} ${word}`.length <= maxChars) current = `${current} ${word}`;
    else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export function ClassicalSimulabilityMap({
  points,
  maxEbits,
  ariaLabel,
  cliffordBandLabel = "Easy via Gottesman-Knill (any entanglement)",
  boundedBandLabel = "Easy via bounded bond dimension (any gate set)",
  hardLabel = "Hard: violates both known criteria",
}: {
  points: SimulabilityPoint[];
  /** The real maximum possible entanglement for the cut(s) being plotted (e.g. min(|A|, n-|A|) ebits), used to scale the vertical axis. */
  maxEbits: number;
  ariaLabel: string;
  cliffordBandLabel?: string;
  boundedBandLabel?: string;
  hardLabel?: string;
}) {
  const cliffordBandW = PLOT.w * CLIFFORD_BAND_FRACTION;
  const boundedBandY = PLOT.y + PLOT.h * BOUNDED_BAND_FRACTION;
  const boundedBandH = PLOT.h - PLOT.h * BOUNDED_BAND_FRACTION;

  const yFor = (ebits: number) => {
    const t = Math.max(0, Math.min(1, ebits / Math.max(maxEbits, 1e-9)));
    return PLOT.y + PLOT.h * (1 - t);
  };
  // Non-Clifford points fan out across the right (1 - CLIFFORD_BAND_FRACTION) of the
  // plot by their index among non-Clifford points, purely to avoid overlap — this is
  // layout, not a claim about "how non-Clifford" a circuit is.
  const nonCliffordPoints = points.filter((p) => !p.isClifford);
  const xFor = (point: SimulabilityPoint) => {
    if (point.isClifford) return PLOT.x + cliffordBandW * 0.5;
    const i = nonCliffordPoints.indexOf(point);
    const slot = nonCliffordPoints.length > 1 ? i / (nonCliffordPoints.length - 1) : 0.5;
    return PLOT.x + cliffordBandW + (PLOT.w - cliffordBandW) * (0.15 + slot * 0.7);
  };

  return (
    <div className="not-prose overflow-x-auto panel-inset p-4">
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={ariaLabel} className="mx-auto w-full max-w-lg">
        {/* Hard region: everything outside both bands. */}
        <rect
          x={PLOT.x + cliffordBandW}
          y={PLOT.y}
          width={PLOT.w - cliffordBandW}
          height={boundedBandY - PLOT.y}
          className="fill-danger/10"
        />
        <text x={PLOT.x + cliffordBandW + (PLOT.w - cliffordBandW) / 2} y={PLOT.y + 20} textAnchor="middle" className="fill-danger text-[11px] font-bold">
          {hardLabel}
        </text>

        {/* Clifford band: left, full height. */}
        <rect x={PLOT.x} y={PLOT.y} width={cliffordBandW} height={PLOT.h} className="fill-brand/10" />
        <text
          x={PLOT.x + cliffordBandW / 2}
          y={PLOT.y + PLOT.h / 2 - 8}
          textAnchor="middle"
          className="fill-brand text-[9.5px] font-semibold"
        >
          {/* Wrapped from the prop rather than hardcoded: SVG `<text>` has no
              automatic wrapping, and this band is narrow, so the label has to
              be split into `<tspan>` lines by hand. Doing that from the
              literal string meant `cliffordBandLabel` was silently ignored
              while its two sibling label props worked — a prop that looks
              supported and isn't. */}
          {wrapLabel(cliffordBandLabel).map((line, index) => (
            <tspan key={line} x={PLOT.x + cliffordBandW / 2} dy={index === 0 ? "0" : "12"}>
              {line}
            </tspan>
          ))}
        </text>

        {/* Bounded-entanglement band: bottom, right of the Clifford band. */}
        <rect x={PLOT.x + cliffordBandW} y={boundedBandY} width={PLOT.w - cliffordBandW} height={boundedBandH} className="fill-accent/10" />
        <text
          x={PLOT.x + cliffordBandW + (PLOT.w - cliffordBandW) / 2}
          y={PLOT.y + PLOT.h - 10}
          textAnchor="middle"
          className="fill-accent text-[9.5px] font-semibold"
        >
          {boundedBandLabel}
        </text>

        {/* Axes — stroke-border at 1px, matching every other cartesian plot in this directory (DiscretizationLimit, ExpectationTrace, LossVsDecoherence, ParametricCurve, PotentialDiagram, …). */}
        <line x1={PLOT.x} y1={PLOT.y} x2={PLOT.x} y2={PLOT.y + PLOT.h} className="stroke-border" strokeWidth={1} />
        <line x1={PLOT.x} y1={PLOT.y + PLOT.h} x2={PLOT.x + PLOT.w} y2={PLOT.y + PLOT.h} className="stroke-border" strokeWidth={1} />
        <text x={PLOT.x + PLOT.w / 2} y={HEIGHT - 6} textAnchor="middle" className="fill-foreground text-[11px] font-semibold">
          Gate set: Clifford-only → arbitrary
        </text>
        <text
          x={18}
          y={PLOT.y + PLOT.h / 2}
          textAnchor="middle"
          className="fill-foreground text-[11px] font-semibold"
          transform={`rotate(-90 18 ${PLOT.y + PLOT.h / 2})`}
        >
          Entanglement (ebits)
        </text>
        <text x={PLOT.x + 4} y={PLOT.y + 12} className="fill-muted-foreground text-[10px]">
          {maxEbits.toFixed(1)} (max)
        </text>
        <text x={PLOT.x + 4} y={PLOT.y + PLOT.h - 6} className="fill-muted-foreground text-[10px]">
          0
        </text>

        {/* Plotted circuits. */}
        {points.map((point, i) => {
          const cx = xFor(point);
          const cy = yFor(point.entanglementEbits);
          const color = point.color ?? (point.isClifford ? "brand" : "accent");
          const labelAbove = cy > PLOT.y + 40;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={7} className={DOT_FILL[color]} stroke="var(--surface)" strokeWidth={1.5} />
              <text
                x={cx}
                y={labelAbove ? cy - 14 : cy + 20}
                textAnchor="middle"
                className={`text-[10px] font-semibold ${LABEL_FILL[color]}`}
              >
                {point.label}
              </text>
              {point.note && (
                <text
                  x={cx}
                  y={labelAbove ? cy - 2 : cy + 32}
                  textAnchor="middle"
                  className={`text-[9px] ${LABEL_FILL[color]}`}
                >
                  {point.note}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
