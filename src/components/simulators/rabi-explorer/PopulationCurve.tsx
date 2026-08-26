const WIDTH = 520;
const HEIGHT = 180;
const PAD_LEFT = 32;
const PAD_BOTTOM = 20;
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
          <text x={2} y={yOf(p) + 3} className="fill-muted-foreground text-[9px] font-mono">
            {p}
          </text>
        </g>
      ))}
      <path d={path} fill="none" className="stroke-pillar" strokeWidth={2} />
      <line x1={xOf(currentT)} y1={PAD_TOP} x2={xOf(currentT)} y2={HEIGHT - PAD_BOTTOM} className="stroke-accent" strokeWidth={1.5} strokeDasharray="3 2" />
      <circle cx={xOf(currentT)} cy={yOf(currentP1)} r={4} className="fill-accent" />
      <text x={WIDTH - 4} y={HEIGHT - 4} textAnchor="end" className="fill-muted-foreground text-[9px] font-mono">
        t = {tMax.toFixed(1)}
      </text>
    </svg>
  );
}
