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
/** Where the Clifford/non-Clifford divide sits within the plot, as a fraction of its width.
 *  Widened from 0.24 to 0.30 when the band's label was raised from 9.5 to 12 units for
 *  legibility: "Gottesman-Knill" is a single 15-character unbreakable word, ~99 units
 *  wide at 12 units, and it overflowed a 0.24-fraction (89-unit) band into the hard
 *  region. The x axis here is categorical — the comment on `xFor` already notes that
 *  horizontal position within the non-Clifford side is layout, not a quantity — so the
 *  divide's exact fraction carries no claim and is free to follow the type. */
const CLIFFORD_BAND_FRACTION = 0.3;
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

/** Greedy word-wrap for the two band labels, which SVG `<text>` will not wrap
 *  for us. `maxChars` is a per-band character budget: at the 12-unit type the
 *  bands now use, a character averages ~6.6 units, so the Clifford band's ~111
 *  units takes ~13 characters and the wider bounded-entanglement band's ~259
 *  units takes ~30. (Both budgets were previously computed against 9.5-unit
 *  type, which resolved to roughly 5px on a 320px phone.) A word longer than
 *  the budget is left on its own line rather than broken mid-word. */
function wrapLabel(label: string, maxChars = 13): string[] {
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
    // `w-full max-w-lg` is gone from the `<svg>`, and that is what finally
    // makes the type in this figure legible. The arithmetic the two notes
    // below run is right and their conclusion was still a failure: a 480-unit
    // viewBox painting `w-full` into the real content box scales by
    // 320 - 32 (Container `px-4`) = 288, less 2 x (16px `p-4` + 1px
    // `panel-inset` border) = 254px, i.e. 254/480 = 0.529 px per unit. At that
    // scale the sizes the last pass installed paint at
    //   13 units -> 6.88px   (band labels, axis names, dot names, y endpoints)
    //   12 units -> 6.35px   (Clifford and bounded-band labels)
    //   11 units -> 5.82px   (per-dot notes)
    // Every one of those is under the ~9px floor, and the notes say so ("~7px",
    // "~5.9px") while leaving them there, because no size that fits the 259-unit
    // hard region horizontally can clear 9px at a 0.529 scale: 9px needs
    // 9 x 480/254 = 17 units, and the 34-character hard-region label is ~320
    // units at 17 against a 259-unit band.
    //
    // With no `w-full` the `<svg>`'s intrinsic `width={480}` wins, one unit is
    // one CSS pixel, and 13/12/11 units are a literal 13/12/11px. The wrapper's
    // `overflow-x-auto` (already here, and until now never triggered because
    // `w-full` guaranteed it fit) takes the 226px of overflow on a phone. This
    // is the same trade `EnergyLevelDiagram` and `LevelSplittingDiagram` make:
    // a figure a reader must pan is strictly better than one they cannot read.
    //
    // `tabIndex={0}` because that scroller is now real. `overflow-x-auto` is
    // focusable by default in no browser but Firefox, so without it a
    // keyboard-only reader could see the Clifford band and never reach the
    // non-Clifford dots on the right, which are half the figure's content. No
    // `role`/`aria-label` here: the `<svg>` already carries both.
    <div tabIndex={0} className="not-prose overflow-x-auto panel-inset p-4">
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={ariaLabel}>
        {/* Hard region: everything outside both bands. */}
        <rect
          x={PLOT.x + cliffordBandW}
          y={PLOT.y}
          width={PLOT.w - cliffordBandW}
          height={boundedBandY - PLOT.y}
          className="fill-danger/10"
        />
        {/* 11 -> 13 units. This 480-unit viewBox renders `w-full` into roughly a 256px
            column on a 320px phone, so 11 units resolved to about 5.9px on screen.
            13 units keeps the 34-character label (~245 units) inside the 259-unit hard
            region while reaching ~7px. */}
        <text x={PLOT.x + cliffordBandW + (PLOT.w - cliffordBandW) / 2} y={PLOT.y + 20} textAnchor="middle" className="fill-danger text-[13px] font-bold">
          {hardLabel}
        </text>

        {/* Clifford band: left, full height. */}
        <rect x={PLOT.x} y={PLOT.y} width={cliffordBandW} height={PLOT.h} className="fill-brand/10" />
        <text
          x={PLOT.x + cliffordBandW / 2}
          y={PLOT.y + PLOT.h / 2 - 24}
          textAnchor="middle"
          className="fill-brand text-[12px] font-semibold"
        >
          {/* Wrapped from the prop rather than hardcoded: SVG `<text>` has no
              automatic wrapping, and this band is narrow, so the label has to
              be split into `<tspan>` lines by hand. Doing that from the
              literal string meant `cliffordBandLabel` was silently ignored
              while its two sibling label props worked — a prop that looks
              supported and isn't. */}
          {wrapLabel(cliffordBandLabel).map((line, index) => (
            <tspan key={line} x={PLOT.x + cliffordBandW / 2} dy={index === 0 ? "0" : "14"}>
              {line}
            </tspan>
          ))}
        </text>

        {/* Bounded-entanglement band: bottom, right of the Clifford band. Its label is
            now wrapped too: at 12 units the 45-character string is ~297 units wide and
            would have run out of the 259-unit band, and silently clipping the words
            "(any gate set)" would have thrown away the half of the sentence that says
            the criterion is independent of the gate set — the whole point of the figure. */}
        <rect x={PLOT.x + cliffordBandW} y={boundedBandY} width={PLOT.w - cliffordBandW} height={boundedBandH} className="fill-accent/10" />
        <text
          x={PLOT.x + cliffordBandW + (PLOT.w - cliffordBandW) / 2}
          y={PLOT.y + PLOT.h - 24}
          textAnchor="middle"
          className="fill-accent text-[12px] font-semibold"
        >
          {wrapLabel(boundedBandLabel, 30).map((line, index) => (
            <tspan key={line} x={PLOT.x + cliffordBandW + (PLOT.w - cliffordBandW) / 2} dy={index === 0 ? "0" : "14"}>
              {line}
            </tspan>
          ))}
        </text>

        {/* The two band boundaries. Which side of the vertical divide a dot sits on IS
            the Gottesman-Knill verdict, and whether a dot is above or below the
            horizontal one IS the bond-dimension verdict — so both edges are the
            "outline of a plotted region" the `--axis` token exists for. Previously the
            regions were delimited only by a 10%-opacity fill wash, which on
            `--surface-muted` is well under 3:1 against its neighbour: a reader could
            not reliably see where "easy" stopped and "hard" started, which is the one
            thing this figure is for. */}
        <line x1={PLOT.x + cliffordBandW} y1={PLOT.y} x2={PLOT.x + cliffordBandW} y2={PLOT.y + PLOT.h} className="stroke-axis" strokeWidth={1} strokeDasharray="4 3" />
        <line x1={PLOT.x + cliffordBandW} y1={boundedBandY} x2={PLOT.x + PLOT.w} y2={boundedBandY} className="stroke-axis" strokeWidth={1} strokeDasharray="4 3" />

        {/* Axes. Were `stroke-border`, the panel-edge token — 1.41:1 on `--surface-muted`,
            under WCAG 2.1 SC 1.4.11's 3:1 for meaningful graphical objects. The old
            comment here justified that by consistency with the other cartesian plots in
            this directory; those have all moved to `stroke-axis` for the same reason. */}
        <line x1={PLOT.x} y1={PLOT.y} x2={PLOT.x} y2={PLOT.y + PLOT.h} className="stroke-axis" strokeWidth={1} />
        <line x1={PLOT.x} y1={PLOT.y + PLOT.h} x2={PLOT.x + PLOT.w} y2={PLOT.y + PLOT.h} className="stroke-axis" strokeWidth={1} />
        {/* Axis names 11 -> 13 units (~7px at a 320px phone, up from ~5.9px). The
            horizontal name is 35 characters, ~252 units at 13, which still centres
            inside the 480-unit box; the rotated one is ~144 units against 290 of plot
            height, and its ascenders reach x = 18 - 13 = 5, inside the viewBox. */}
        <text x={PLOT.x + PLOT.w / 2} y={HEIGHT - 6} textAnchor="middle" className="fill-foreground text-[13px] font-semibold">
          Gate set: Clifford-only → arbitrary
        </text>
        <text
          x={18}
          y={PLOT.y + PLOT.h / 2}
          textAnchor="middle"
          className="fill-foreground text-[13px] font-semibold"
          transform={`rotate(-90 18 ${PLOT.y + PLOT.h / 2})`}
        >
          Entanglement (ebits)
        </text>
        {/* The two y-axis endpoints: 10 -> 13 units. These are the values a reader reads
            a dot's height against, so they are the figure's only quantitative scale. */}
        <text x={PLOT.x + 4} y={PLOT.y + 14} className="fill-muted-foreground text-[13px]">
          {maxEbits.toFixed(1)} (max)
        </text>
        <text x={PLOT.x + 4} y={PLOT.y + PLOT.h - 6} className="fill-muted-foreground text-[13px]">
          0
        </text>

        {/* Plotted circuits. */}
        {points.map((point, i) => {
          const cx = xFor(point);
          const cy = yFor(point.entanglementEbits);
          const color = point.color ?? (point.isClifford ? "brand" : "accent");
          // Flip the label stack below the dot when the dot is too near the top of the
          // plot for a two-line stack to fit above it. The clearance needed grew with
          // the type (a 13-unit name plus an 11-unit note plus leading is ~40 units),
          // so the threshold moved from 40 to 46.
          const labelAbove = cy > PLOT.y + 46;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={7} className={DOT_FILL[color]} stroke="var(--surface)" strokeWidth={1.5} />
              {/* Circuit name 10 -> 13 units, note 9 -> 11. At the old sizes these
                  resolved to ~5.3px and ~4.8px on a 320px phone — the labels that say
                  *which circuit each dot is* were the least readable marks in the
                  figure. The offsets also grew: the note used to sit at `cy - 2`, i.e.
                  directly on top of the r=7 dot it annotates, so the two overlapped. */}
              <text
                x={cx}
                y={labelAbove ? cy - 26 : cy + 24}
                textAnchor="middle"
                className={`text-[13px] font-semibold ${LABEL_FILL[color]}`}
              >
                {point.label}
              </text>
              {point.note && (
                <text
                  x={cx}
                  y={labelAbove ? cy - 13 : cy + 38}
                  textAnchor="middle"
                  className={`text-[11px] ${LABEL_FILL[color]}`}
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
