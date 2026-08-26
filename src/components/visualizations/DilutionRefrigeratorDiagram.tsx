const WIDTH = 460;
const HEIGHT = 560;
const PLATE_CENTER_X = 110;
const LABEL_X = 230;

type Stage = {
  y: number;
  plateWidth: number;
  temp: string;
  title: string;
  detail: string;
};

// Six real cooling stages, top (warm) to bottom (cold). Temperatures match
// this lesson's own worked numbers: the 100 mK and ~15 mK / 10-20 mK values
// are exactly the cryogenic-systems lesson's table entries and dilution
// fridge base figure, not new numbers invented here.
const STAGES: Stage[] = [
  { y: 46, plateWidth: 180, temp: "300 K", title: "room temperature", detail: "wiring feedthroughs, vacuum can wall" },
  { y: 150, plateWidth: 148, temp: "77 K", title: "nitrogen radiation shield", detail: "blocks room-temp blackbody radiation" },
  { y: 254, plateWidth: 116, temp: "~4 K", title: "pulse-tube stage", detail: "HEMT amps, circulators, isolators" },
  { y: 358, plateWidth: 88, temp: "~0.7-1 K", title: "still", detail: "³He circulation, first heavy filtering" },
  { y: 448, plateWidth: 66, temp: "~100 mK", title: "cold plate", detail: "further attenuation and filtering" },
  { y: 526, plateWidth: 48, temp: "~10-20 mK", title: "mixing chamber", detail: "qubit chip mounted here; base ≈ 15 mK" },
];

function StageLabel({ y, temp, title, detail }: { y: number; temp: string; title: string; detail: string }) {
  return (
    <text x={LABEL_X} y={y} className="text-[10px] font-mono">
      <tspan x={LABEL_X} className="fill-brand font-semibold">
        {temp}
      </tspan>
      <tspan x={LABEL_X} dy={12} className="fill-foreground">
        {title}
      </tspan>
      <tspan x={LABEL_X} dy={12} className="fill-muted-foreground">
        {detail}
      </tspan>
    </text>
  );
}

/**
 * A vertical cross-section of a dilution refrigerator's staged cooling, from
 * room temperature down to the qubit's actual operating point. Plates get
 * narrower with depth to suggest the nested radiation shields a real fridge
 * uses; the wiring bundle running down the center is attenuated at each
 * stage, exactly the staged-attenuation picture ControlSignalChainDiagram
 * reuses for the drive/readout signal path.
 */
export function DilutionRefrigeratorDiagram({ ariaLabel }: { ariaLabel: string }) {
  const lastY = STAGES[STAGES.length - 1].y;
  return (
    <div className="not-prose overflow-x-auto panel-inset p-4">
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
        <text x={WIDTH / 2} y={18} textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">
          dilution refrigerator: staged cooling, room temp &rarr; mixing chamber
        </text>

        {/* wiring bundle running down through every stage */}
        <line x1={PLATE_CENTER_X} y1={30} x2={PLATE_CENTER_X} y2={lastY} className="stroke-brand" strokeWidth={1.5} strokeDasharray="1 4" />

        {STAGES.map((s, i) => (
          <g key={i}>
            <line
              x1={PLATE_CENTER_X - s.plateWidth / 2}
              y1={s.y}
              x2={PLATE_CENTER_X + s.plateWidth / 2}
              y2={s.y}
              className="stroke-border"
              strokeWidth={2.5}
            />
            {i < STAGES.length - 1 && (
              <>
                <line
                  x1={PLATE_CENTER_X - s.plateWidth / 2}
                  y1={s.y}
                  x2={PLATE_CENTER_X - STAGES[i + 1].plateWidth / 2}
                  y2={STAGES[i + 1].y}
                  className="stroke-border"
                  strokeWidth={1}
                  strokeDasharray="2 3"
                />
                <line
                  x1={PLATE_CENTER_X + s.plateWidth / 2}
                  y1={s.y}
                  x2={PLATE_CENTER_X + STAGES[i + 1].plateWidth / 2}
                  y2={STAGES[i + 1].y}
                  className="stroke-border"
                  strokeWidth={1}
                  strokeDasharray="2 3"
                />
              </>
            )}
            <circle cx={PLATE_CENTER_X} cy={s.y} r={3} className="fill-accent" />
            <line x1={PLATE_CENTER_X + s.plateWidth / 2} y1={s.y} x2={LABEL_X - 8} y2={s.y - 10} className="stroke-border" strokeWidth={1} />
            <StageLabel y={s.y - 6} temp={s.temp} title={s.title} detail={s.detail} />
          </g>
        ))}

        {/* HEMT amplifier icon at the 4 K stage, where low-noise readout amps typically sit */}
        <g transform={`translate(${PLATE_CENTER_X - 44}, ${STAGES[2].y - 30})`}>
          <path d="M0,-6 L0,6 L11,0 Z" className="fill-accent" />
          <text x={-2} y={-10} textAnchor="end" className="fill-muted-foreground text-[9px] font-mono">
            amp
          </text>
        </g>

        {/* qubit chip at the mixing chamber, the coldest stage */}
        <g transform={`translate(${PLATE_CENTER_X - 18}, ${lastY + 8})`}>
          <rect x={0} y={0} width={36} height={16} rx={3} className="fill-accent/15 stroke-accent" strokeWidth={1.25} />
          <text x={18} y={11} textAnchor="middle" className="fill-accent text-[9px] font-mono">
            qubit
          </text>
        </g>
      </svg>
    </div>
  );
}
