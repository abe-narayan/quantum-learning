/*
 * SIZING, RECOMPUTED FROM THE REAL BOX
 * ------------------------------------
 * This SVG renders `w-full` inside `panel-inset p-4`, so on a 320px phone its
 * real box is 320 - 32 (Container `px-4`) = 288, less 2 x (16px padding + 1px
 * border) = **254px**. One viewBox unit therefore paints at 254/460 =
 * 0.5522px. The previous pass raised the labels from 9-10 units to 11-12 and
 * recorded that as fixed, but 11 x 0.5522 = 6.07px and 12 x 0.5522 = 6.63px,
 * both far under the ~9px legibility floor. 17 units is the first size that
 * clears it: 17 x 0.5522 = **9.39px**.
 *
 * At 17, monospace advance is ~10.2 units per character, so the label column
 * (LABEL_X to the 460-unit right edge) holds (460 - LABEL_X) / 10.2
 * characters. Fitting the six stages' detail strings at a legible size is
 * what drove the two structural changes below: the plates were narrowed and
 * moved left to buy label width, and every detail string was rewritten to
 * a counted length. SVG clips silently, so these are counted, not eyeballed.
 */

const WIDTH = 460;
const HEIGHT = 600;

/**
 * Moved left from 110. The plates carry no text, so narrowing them costs the
 * figure nothing; the label column is where all the information lives and it
 * is the thing that had to grow.
 */
const PLATE_CENTER_X = 70;

/**
 * The widest plate (110 units) reaches x = 125, so the label column can start
 * at 150 and still leave a readable 20-plus-unit leader from every plate.
 * That leaves 460 - 150 = 310 units = **30 characters** at 17-unit monospace,
 * which is the budget every `detail` and `title` string below is written to.
 */
const LABEL_X = 150;

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
//
// Stage `y` values are spaced so a three-line label block fits between
// consecutive stages. At 17 units with 21-unit leading, a block spans from
// (y - 18) to (y + 40), i.e. 58 units; the tightest gap below is 78, leaving
// 20 units of clear space between adjacent blocks.
//
// `detail` strings are all <= 30 characters (see LABEL_X). The longer
// originals ("wiring feedthroughs, vacuum can wall", "blocks room-temp
// blackbody radiation", "qubit chip mounted here; base ~= 15 mK") were 36-37
// characters and would have run 60-70 units past the viewBox at a legible
// size, where the SVG clips them without a scrollbar.
const STAGES: Stage[] = [
  { y: 58, plateWidth: 110, temp: "300 K", title: "room temperature", detail: "wiring and vacuum can wall" },
  { y: 152, plateWidth: 90, temp: "77 K", title: "nitrogen shield", detail: "blocks room-temp radiation" },
  { y: 256, plateWidth: 72, temp: "~4 K", title: "pulse-tube stage", detail: "HEMT amps, circulators" },
  { y: 360, plateWidth: 54, temp: "~0.7-1 K", title: "still", detail: "³He circulation, filtering" },
  { y: 450, plateWidth: 42, temp: "~100 mK", title: "cold plate", detail: "more attenuation, filtering" },
  { y: 528, plateWidth: 30, temp: "~10-20 mK", title: "mixing chamber", detail: "qubit chip sits here (~15 mK)" },
];

function StageLabel({ y, temp, title, detail }: { y: number; temp: string; title: string; detail: string }) {
  return (
    // All three lines at 17 units (9.39px). The previous split of 12/12/11 put
    // the detail line at 6.07px, and the detail line is where five of the six
    // stages say what the stage is actually FOR. Temperature stays visually
    // first by weight and colour rather than by size.
    <text x={LABEL_X} y={y} fontSize={17} className="font-mono">
      <tspan x={LABEL_X} className="fill-brand font-semibold">
        {temp}
      </tspan>
      <tspan x={LABEL_X} dy={21} className="fill-foreground">
        {title}
      </tspan>
      <tspan x={LABEL_X} dy={21} className="fill-muted-foreground">
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
        {/* 35 characters = 357 units at 17, centred on 230, so 51..409. The
            original wording ("dilution refrigerator: staged cooling, 300 K -> 15
            mK") is 51 characters = 520 units and would have been clipped at both
            ends; the six labelled plates below name the apparatus anyway. */}
        <text x={WIDTH / 2} y={22} textAnchor="middle" fontSize={17} className="fill-muted-foreground font-mono">
          staged cooling: 300 K down to 15 mK
        </text>

        {/* wiring bundle running down through every stage */}
        <line x1={PLATE_CENTER_X} y1={40} x2={PLATE_CENTER_X} y2={lastY} className="stroke-brand" strokeWidth={1.5} strokeDasharray="1 4" />

        {STAGES.map((s, i) => (
          <g key={i}>
            <line
              x1={PLATE_CENTER_X - s.plateWidth / 2}
              y1={s.y}
              x2={PLATE_CENTER_X + s.plateWidth / 2}
              y2={s.y}
              // The six plates ARE the data - this figure is a list of cooling
              // stages and each plate is one of them. They were `stroke-border`,
              // the panel-edge token (1.41:1 on `--surface-muted`), which put the
              // only marks the diagram consists of below WCAG 2.1 SC 1.4.11's 3:1
              // for meaningful graphical objects. `stroke-axis` is the chart
              // channel.
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
                  // nothing is read off them - the stages themselves are the plates
                  // and the labels. So they move to `--axis-grid`, the deliberately
                  // subordinate channel, rather than to `--axis` alongside the
                  // plates. Keeping them on `--border` would have left them
                  // invisible; putting them on `--axis` would have made a decorative
                  // outline compete with the six marks that matter.
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
            {/* Leader line. Load-bearing: it is the only thing tying a temperature
                and stage name to the plate it describes, and with six stages stacked
                this closely, a reader who cannot see it cannot tell which label goes
                with which plate. `stroke-border` left that association invisible. */}
            <line x1={PLATE_CENTER_X + s.plateWidth / 2} y1={s.y} x2={LABEL_X - 6} y2={s.y - 12} className="stroke-axis" strokeWidth={1} />
            <StageLabel y={s.y - 6} temp={s.temp} title={s.title} detail={s.detail} />
          </g>
        ))}

        {/* HEMT amplifier icon at the 4 K stage, where low-noise readout amps sit.
            The label moved from the icon's left to directly above it: right-anchored
            at 17 units it would have started at x = -7, off the viewBox. Centred on
            x = 45 it spans 29..61, clear of the wiring bundle at x = 70. */}
        <g transform={`translate(20, ${STAGES[2].y - 32})`}>
          <path d="M0,-6 L0,6 L11,0 Z" className="fill-accent" />
          <text x={25} y={-14} textAnchor="middle" fontSize={17} className="fill-muted-foreground font-mono">
            amp
          </text>
        </g>

        {/* Qubit chip at the mixing chamber, the coldest stage. The old 42-unit box
            held its label inside it; at 17 units "qubit" is 51 units and a box wide
            enough for it would be nearly twice the 30-unit mixing-chamber plate
            above, breaking the read that the chip is mounted *on* that stage. So the
            box shrinks to a marker and the word moves beside it, ending at x = 129,
            clear of the label column at x = 150. */}
        <rect x={PLATE_CENTER_X - 12} y={lastY + 8} width={24} height={16} rx={3} className="fill-accent/25 stroke-accent" strokeWidth={1.25} />
        <text x={PLATE_CENTER_X + 18} y={lastY + 21} fontSize={17} className="fill-accent font-mono">
          chip
        </text>
      </svg>
    </div>
  );
}
