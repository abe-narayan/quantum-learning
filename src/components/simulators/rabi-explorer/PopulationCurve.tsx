/**
 * TICK/AXIS TYPE, AND THE GEOMETRY THAT HAD TO MOVE WITH IT.
 *
 * This plot renders `w-full` on a 520-unit viewBox inside a
 * `SimulatorInstrument`, whose body is `p-4 sm:p-5` on a 1px-bordered
 * `.instrument`.
 *
 * THE BOX, RE-MEASURED. The previous pass measured 254px: a 320px viewport,
 * less the `Container px-4` gutters (288px of column), less one instrument
 * frame at 2 x (16px padding + 1px border) = 34px. That is the `/simulators`
 * bench box, and it is not the narrowest mount this plot has. `RabiExplorer`
 * is embedded in seven lessons, and a lesson embed goes through
 * `InteractiveSection`, itself an `.instrument` with a `p-4` body: its
 * de-framing selector (`has-[[data-mdx-slot=embed]_.instrument]`) switches off
 * that wrapper's border *colour*, wash and shadow, but the 1px border box and
 * the 16px of padding both stay. So the real narrowest box is
 *
 *     320 - 32 (Container px-4) - 34 (InteractiveSection) - 34 (this
 *     instrument) = **220px**
 *
 * confirmed against the served markup of a lesson that embeds a simulator,
 * where the two `.instrument` divs nest exactly that way. Authored type scales
 * by 220/520 = 0.423, not 0.488: 19 units painted at **8.04px** in every
 * lesson, under the ~9px floor. 22 units gives 22 x 0.423 = **9.31px** at
 * 220px, 10.74px on the bench at 254px, and a literal 22px at the widest.
 * The matching note in noise-explorer/DecayCurve.tsx carries the same
 * arithmetic for the same reason; the two plots are deliberately sized alike.
 *
 * Constants that move with the type, because larger labels do not fit gutters
 * cut for smaller ones:
 *  - PAD_LEFT 44 -> 50. The widest tick is "0.5": three characters of the mono
 *    face at ~0.6em advance = 3 x 13.2 = 39.6 units. Right-aligned 6 units
 *    clear of the axis it needs 45.6 units of gutter, so 44 would have pushed
 *    its left edge past x = 0, where SVG clips it silently.
 *  - The tick baseline offset 6 -> 8, the ~0.36em that centres the glyph on
 *    its gridline at this size; the topmost tick's cap height then lands at
 *    y = 2.2, still inside the viewBox.
 *  - PAD_BOTTOM stays 30 and HEIGHT stays 190, so the plot keeps its full
 *    vertical range: the bottom caption's cap top lands at y = 168 against an
 *    x axis at y = 160, clearing it rather than straddling it.
 */
const WIDTH = 520;
const HEIGHT = 190;
const PAD_LEFT = 50;
const PAD_BOTTOM = 30;
const PAD_TOP = 10;

/** A simple SVG line plot of P1(t) over [0, tMax], with a marker at the current time. */
export function PopulationCurve({
  samples,
  tMax,
  currentT,
  currentP1,
}: {
  samples: { t: number; p1: number }[];
  tMax: number;
  currentT: number;
  currentP1: number;
}) {
  const plotWidth = WIDTH - PAD_LEFT;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const xOf = (t: number) => PAD_LEFT + (t / tMax) * plotWidth;
  const yOf = (p: number) => PAD_TOP + (1 - p) * plotHeight;

  const path = samples.map((s, i) => `${i === 0 ? "M" : "L"}${xOf(s.t).toFixed(1)},${yOf(s.p1).toFixed(1)}`).join(" ");

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label="Population transfer over time">
      {/* `--axis`, not `--border`. The two frame lines are what the curve is
          measured against, so they are marks the reader has to perceive:
          `--axis` is authored at 4.5:1 for exactly that, while `--border` is
          1.41:1 decorative panel chrome and drew this frame at the edge of
          invisible. The dashed ruling below is optional background ruling, so
          it takes `--axis-grid` (deliberately under 3:1) at full alpha rather
          than `--border` at 40%. */}
      <line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={HEIGHT - PAD_BOTTOM} className="stroke-axis" strokeWidth={1} />
      <line x1={PAD_LEFT} y1={HEIGHT - PAD_BOTTOM} x2={WIDTH} y2={HEIGHT - PAD_BOTTOM} className="stroke-axis" strokeWidth={1} />
      {[0, 0.5, 1].map((p) => (
        <g key={p}>
          <line x1={PAD_LEFT - 3} y1={yOf(p)} x2={WIDTH} y2={yOf(p)} className="stroke-axis-grid" strokeWidth={1} strokeDasharray="2 3" />
          <text x={PAD_LEFT - 6} y={yOf(p) + 8} textAnchor="end" className="fill-muted-foreground text-[22px] font-mono">
            {p}
          </text>
        </g>
      ))}
      <path d={path} fill="none" className="stroke-pillar" strokeWidth={2} />
      <line x1={xOf(currentT)} y1={PAD_TOP} x2={xOf(currentT)} y2={HEIGHT - PAD_BOTTOM} className="stroke-accent" strokeWidth={1.5} strokeDasharray="3 2" />
      <circle cx={xOf(currentT)} cy={yOf(currentP1)} r={4} className="fill-accent" />
      <text x={WIDTH - 4} y={HEIGHT - 6} textAnchor="end" className="fill-muted-foreground text-[22px] font-mono">
        t = {tMax.toFixed(1)}
      </text>
    </svg>
  );
}
