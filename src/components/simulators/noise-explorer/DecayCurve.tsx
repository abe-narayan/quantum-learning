const WIDTH = 520;
const HEIGHT = 160;
const PAD_LEFT = 32;
const PAD_BOTTOM = 20;
const PAD_TOP = 10;

/** A step-indexed SVG line plot (e.g. purity or |Bloch vector| vs. channel application count), with a marker at the current step. */
export function DecayCurve({
  samples,
  currentStep,
  label,
}: {
  samples: number[];
  currentStep: number;
  label: string;
}) {
  const plotWidth = WIDTH - PAD_LEFT;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const maxStep = samples.length - 1;

  const xOf = (step: number) => PAD_LEFT + (maxStep === 0 ? 0 : (step / maxStep) * plotWidth);
  const yOf = (v: number) => PAD_TOP + (1 - v) * plotHeight;

  const path = samples.map((v, i) => `${i === 0 ? "M" : "L"}${xOf(i).toFixed(1)},${yOf(v).toFixed(1)}`).join(" ");

  return (
    <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={label}>
      <line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={HEIGHT - PAD_BOTTOM} className="stroke-border" strokeWidth={1} />
      <line x1={PAD_LEFT} y1={HEIGHT - PAD_BOTTOM} x2={WIDTH} y2={HEIGHT - PAD_BOTTOM} className="stroke-border" strokeWidth={1} />
      {[0, 0.5, 1].map((v) => (
        <g key={v}>
          <line x1={PAD_LEFT - 3} y1={yOf(v)} x2={WIDTH} y2={yOf(v)} className="stroke-border/40" strokeWidth={1} strokeDasharray="2 3" />
          <text x={2} y={yOf(v) + 3} className="fill-muted-foreground text-[9px] font-mono">
            {v}
          </text>
        </g>
      ))}
      <path d={path} fill="none" className="stroke-brand" strokeWidth={2} />
      <line x1={xOf(currentStep)} y1={PAD_TOP} x2={xOf(currentStep)} y2={HEIGHT - PAD_BOTTOM} className="stroke-accent" strokeWidth={1.5} strokeDasharray="3 2" />
      <circle cx={xOf(currentStep)} cy={yOf(samples[currentStep] ?? 0)} r={4} className="fill-accent" />
      <text x={WIDTH - 4} y={HEIGHT - 4} textAnchor="end" className="fill-muted-foreground text-[9px] font-mono">
        step {maxStep}
      </text>
    </svg>
  );
}
