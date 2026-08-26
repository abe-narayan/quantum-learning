const WIDTH = 480;
const HEIGHT = 220;
const PAD = 30;

function scaleFns(xValues: number[], yValuesForRange: number[]) {
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValuesForRange);
  const yMax = Math.max(...yValuesForRange);
  const xSpan = xMax - xMin || 1;
  const ySpan = yMax - yMin || 1;
  const plotW = WIDTH - 2 * PAD;
  const plotH = HEIGHT - 2 * PAD;
  return {
    xOf: (x: number) => PAD + ((x - xMin) / xSpan) * plotW,
    yOf: (y: number) => PAD + (1 - (y - yMin) / ySpan) * plotH,
  };
}

function pathFor(xValues: number[], yValues: number[], xOf: (x: number) => number, yOf: (y: number) => number): string {
  return xValues.map((x, i) => `${i === 0 ? "M" : "L"}${xOf(x).toFixed(1)},${yOf(yValues[i]).toFixed(1)}`).join(" ");
}

/**
 * A potential-energy curve V(x) with an optional wavefunction/density
 * overlay, an optional horizontal energy line, point markers (turning
 * points, well edges), and an optional shaded region (classically-allowed
 * range, a well's interior). Every array must come from the caller's own
 * real computation (a `potentials.ts` function, a closed-form V(r), etc.)
 * — this component only draws whatever curves it's given.
 */
export function PotentialDiagram({
  xValues,
  potential,
  wavefunction,
  energyLine,
  markers = [],
  shadedRegion,
  ariaLabel,
}: {
  xValues: number[];
  potential: number[];
  /** An optional second curve (e.g. |ψ(x)|² or ψ(x)), rescaled to share the plot visually. */
  wavefunction?: number[];
  /** Draws a horizontal dashed line at this energy value. */
  energyLine?: number;
  markers?: { x: number; label: string }[];
  shadedRegion?: { from: number; to: number; label?: string };
  ariaLabel: string;
}) {
  const yValuesForRange = [...potential, ...(wavefunction ?? []), ...(energyLine !== undefined ? [energyLine] : [])];
  const { xOf, yOf } = scaleFns(xValues, yValuesForRange);

  const potentialPath = pathFor(xValues, potential, xOf, yOf);
  const wavefunctionPath = wavefunction ? pathFor(xValues, wavefunction, xOf, yOf) : null;

  return (
    <div className="not-prose overflow-x-auto panel-inset p-4">
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={ariaLabel}>
        {shadedRegion && (
          <rect
            x={xOf(shadedRegion.from)}
            y={PAD}
            width={Math.max(0, xOf(shadedRegion.to) - xOf(shadedRegion.from))}
            height={HEIGHT - 2 * PAD}
            className="fill-accent/10"
          />
        )}
        <line x1={PAD} y1={HEIGHT - PAD} x2={WIDTH - PAD} y2={HEIGHT - PAD} className="stroke-border" strokeWidth={1} />
        <line x1={PAD} y1={PAD} x2={PAD} y2={HEIGHT - PAD} className="stroke-border" strokeWidth={1} />
        {energyLine !== undefined && (
          <line
            x1={PAD}
            y1={yOf(energyLine)}
            x2={WIDTH - PAD}
            y2={yOf(energyLine)}
            className="stroke-foreground/60"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
        )}
        <path d={potentialPath} fill="none" className="stroke-brand" strokeWidth={2} />
        {wavefunctionPath && <path d={wavefunctionPath} fill="none" className="stroke-accent" strokeWidth={1.75} />}
        {markers.map((marker, i) => (
          <g key={i}>
            <circle cx={xOf(marker.x)} cy={yOf(potential[xValues.findIndex((x) => x >= marker.x)] ?? 0)} r={3.5} className="fill-foreground" />
            <text x={xOf(marker.x)} y={HEIGHT - PAD + 14} textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono">
              {marker.label}
            </text>
          </g>
        ))}
      </svg>
      {wavefunctionPath && (
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="text-brand">━</span> potential energy &nbsp;
          <span className="text-accent">━</span> wavefunction
        </p>
      )}
    </div>
  );
}
