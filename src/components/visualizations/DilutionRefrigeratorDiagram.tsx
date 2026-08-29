const WIDTH = 460;
const HEIGHT = 560;
const PLATE_CENTER_X = 110;
/**
 * Moved left from 230 to make room for larger label type. The stage text was
 * authored at 10 units; this 460-unit viewBox renders `w-full`, so inside the
 * `panel-inset p-4` of a 320px phone (a ~256px column) a unit is ~0.56px and
 * 10 units resolved to ~5.6px on screen. At the 12/11 units the labels now use,
 * the longest detail string ("qubit chip mounted here; base ≈ 15 mK", 37
 * monospace characters ≈ 244 units at 11) would have run past the 460-unit right
 * edge from x=230. From 214 it ends at ~458. The widest plate reaches x=200, so
 * the leader lines still have somewhere to go.
 */
const LABEL_X = 214;

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
    // Temperature and stage name at 12 units, the descriptive detail at 11: the
    // temperature is the number a reader takes away from this figure, the detail is
    // supporting prose, and 11 is what keeps the longest detail string inside the
    // viewBox from LABEL_X (see the note on LABEL_X). Leading opened 12 -> 14 to
    // match. The tightest stage gap is 78 units and a three-line block is 28, so
    // adjacent stages still do not collide.
    <text x={LABEL_X} y={y} className="text-[12px] font-mono">
      <tspan x={LABEL_X} className="fill-brand font-semibold">
        {temp}
      </tspan>
      <tspan x={LABEL_X} dy={14} className="fill-foreground">
        {title}
      </tspan>
      <tspan x={LABEL_X} dy={14} className="fill-muted-foreground text-[11px]">
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
        {/* 11 -> 12 units. The old wording, "…staged cooling, room temp → mixing
            chamber", is 64 monospace characters — ~461 units at 12, one unit wider
            than the whole viewBox, so it was shortened rather than kept unreadably
            small. "300 K → 15 mK" says the same thing as "room temp → mixing chamber"
            in half the characters, and the six labelled plates below spell out which
            stage is which anyway. */}
        <text x={WIDTH / 2} y={18} textAnchor="middle" className="fill-muted-foreground text-[12px] font-mono">
          dilution refrigerator: staged cooling, 300 K &rarr; 15 mK
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
              // The six plates ARE the data — this figure is a list of cooling stages
              // and each plate is one of them. They were `stroke-border`, the
              // panel-edge token (1.41:1 on `--surface-muted`), which put the only
              // marks the diagram consists of below WCAG 2.1 SC 1.4.11's 3:1 for
              // meaningful graphical objects. `stroke-axis` is the chart channel.
              className="stroke-axis"
              strokeWidth={2.5}
            />
            {i < STAGES.length - 1 && (
              <>
                <line
                  x1={PLATE_CENTER_X - s.plateWidth / 2}
                  y1={s.y}
                  x2={PLATE_CENTER_X - STAGES[i + 1].plateWidth / 2}
                  y2={STAGES[i + 1].y}
                  // The tapering side walls are scaffolding, not data: the docstring
                  // calls them a *suggestion* of the nested radiation shields, and
                  // nothing is read off them — the stages themselves are the plates
                  // and the labels. So they move to `--axis-grid`, the deliberately
                  // subordinate channel, rather than to `--axis` alongside the plates.
                  // Keeping them on `--border` would have left them invisible; putting
                  // them on `--axis` would have made a decorative outline compete with
                  // the six marks that matter.
                  className="stroke-axis-grid"
                  strokeWidth={1}
                  strokeDasharray="2 3"
                />
                <line
                  x1={PLATE_CENTER_X + s.plateWidth / 2}
                  y1={s.y}
                  x2={PLATE_CENTER_X + STAGES[i + 1].plateWidth / 2}
                  y2={STAGES[i + 1].y}
                  className="stroke-axis-grid"
                  strokeWidth={1}
                  strokeDasharray="2 3"
                />
              </>
            )}
            <circle cx={PLATE_CENTER_X} cy={s.y} r={3} className="fill-accent" />
            {/* Leader line. Load-bearing: it is the only thing tying a temperature and
                stage name to the plate it describes, and with six stages stacked this
                closely, a reader who cannot see it cannot tell which label goes with
                which plate. `stroke-border` left that association invisible. */}
            <line x1={PLATE_CENTER_X + s.plateWidth / 2} y1={s.y} x2={LABEL_X - 8} y2={s.y - 10} className="stroke-axis" strokeWidth={1} />
            <StageLabel y={s.y - 6} temp={s.temp} title={s.title} detail={s.detail} />
          </g>
        ))}

        {/* HEMT amplifier icon at the 4 K stage, where low-noise readout amps typically sit */}
        <g transform={`translate(${PLATE_CENTER_X - 44}, ${STAGES[2].y - 30})`}>
          <path d="M0,-6 L0,6 L11,0 Z" className="fill-accent" />
          {/* 9 -> 11 units (~5px -> ~6.2px on a 320px phone). */}
          <text x={-2} y={-10} textAnchor="end" className="fill-muted-foreground text-[11px] font-mono">
            amp
          </text>
        </g>

        {/* qubit chip at the mixing chamber, the coldest stage */}
        {/* The box widened 36 -> 42 units when its label went 9 -> 11: "qubit" is five
            monospace characters, ~33 units at 11, and a 36-unit box left it touching
            both walls. 42 units still sits inside the 48-unit mixing-chamber plate
            above it, so the chip still reads as mounted *on* that stage. */}
        <g transform={`translate(${PLATE_CENTER_X - 21}, ${lastY + 8})`}>
          <rect x={0} y={0} width={42} height={18} rx={3} className="fill-accent/15 stroke-accent" strokeWidth={1.25} />
          <text x={21} y={13} textAnchor="middle" className="fill-accent text-[11px] font-mono">
            qubit
          </text>
        </g>
      </svg>
    </div>
  );
}
