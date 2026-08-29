/**
 * TICK/AXIS TYPE, AND THE GEOMETRY THAT HAD TO MOVE WITH IT.
 *
 * This plot renders `w-full` on a 520-unit viewBox inside a
 * `SimulatorInstrument`, whose body is `p-4 sm:p-5` on a 1px-bordered
 * `.instrument`. On a 320px phone the page column is 320 - 32 = 288px and the
 * frame takes 2 x (16px padding + 1px border) = 34px, so the SVG's real box is
 * **254px** and authored type scales by 254/520 = 0.488. The old 9-unit tick
 * type therefore painted at **4.40px** - the y-axis scale of a plot whose
 * entire claim is "this quantity decays from 1 toward 0", rendered at half the
 * size anyone can read. 19 units gives 19 x 0.488 = 9.27px.
 *
 * Three constants move with the type, because 19-unit labels do not fit the
 * gutters that were cut for 9-unit ones:
 *  - PAD_LEFT 32 -> 44. The widest tick is "0.5": three characters of the mono
 *    face at ~0.6em advance = 3 x 11.4 = 34 units. Right-aligned 6 units clear
 *    of the axis it needs 40 units of gutter; at 32 it would have run through
 *    the axis line and across the plot.
 *  - PAD_BOTTOM 20 -> 30, so the bottom-right axis caption clears the x axis
 *    instead of straddling it.
 *  - HEIGHT +10 to match, so the *plot* keeps its old height rather than being
 *    squeezed by the padding - the same trade `TunnelingIntroCanvas` documents.
 *    The plot loses 12 of 488 units horizontally to the wider gutter, which is
 *    2.5% and invisible; losing 10 of its vertical range would have flattened
 *    the very decay this figure exists to show.
 */
const WIDTH = 520;
const HEIGHT = 190;
const PAD_LEFT = 44;
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
      <line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={HEIGHT - PAD_BOTTOM} className="stroke-border" strokeWidth={1} />
      <line x1={PAD_LEFT} y1={HEIGHT - PAD_BOTTOM} x2={WIDTH} y2={HEIGHT - PAD_BOTTOM} className="stroke-border" strokeWidth={1} />
      {[0, 0.5, 1].map((p) => (
        <g key={p}>
          <line x1={PAD_LEFT - 3} y1={yOf(p)} x2={WIDTH} y2={yOf(p)} className="stroke-border/40" strokeWidth={1} strokeDasharray="2 3" />
          <text x={PAD_LEFT - 6} y={yOf(p) + 6} textAnchor="end" className="fill-muted-foreground text-[19px] font-mono">
            {p}
          </text>
        </g>
      ))}
      <path d={path} fill="none" className="stroke-pillar" strokeWidth={2} />
      <line x1={xOf(currentT)} y1={PAD_TOP} x2={xOf(currentT)} y2={HEIGHT - PAD_BOTTOM} className="stroke-accent" strokeWidth={1.5} strokeDasharray="3 2" />
      <circle cx={xOf(currentT)} cy={yOf(currentP1)} r={4} className="fill-accent" />
      <text x={WIDTH - 4} y={HEIGHT - 6} textAnchor="end" className="fill-muted-foreground text-[19px] font-mono">
        t = {tMax.toFixed(1)}
      </text>
    </svg>
  );
}
