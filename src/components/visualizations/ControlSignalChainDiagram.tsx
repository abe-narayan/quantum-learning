const WIDTH = 460;
const HEIGHT = 560;

const FRIDGE_TOP = 130;
const FRIDGE_BOTTOM = 500;
const FRIDGE_LEFT = 30;
const FRIDGE_RIGHT = 430;

const DRIVE_X = 175;
// Aligned with the amp/Digitizer box column (both centered at x=390) so the
// readout line's arrowhead actually terminates inside the "amp" box instead
// of in the empty space to its left.
const READOUT_X = 390;

// Same cold stages DilutionRefrigeratorDiagram shows in full, simplified to
// three zones here since what matters for the signal path is that each one
// gets its own attenuator on the way down.
const ZONES = [
  { yTop: FRIDGE_TOP, yBottom: 240, label: "77 K" },
  { yTop: 240, yBottom: 350, label: "~4 K" },
  { yTop: 350, yBottom: FRIDGE_BOTTOM, label: "still → cold plate → mixing chamber (~15 mK)" },
];

function Box({ x, y, w, h, label, sub }: { x: number; y: number; w: number; h: number; label: string; sub?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} className="fill-surface stroke-brand" strokeWidth={1.5} />
      {/* 10 -> 12 and 9 -> 11 units. This 460-unit viewBox renders `w-full`, so on a
          320px phone (a ~256px column inside `panel-inset p-4`) a unit is ~0.56px:
          the old sizes resolved to 5.6px and 5.0px on screen — the names of the
          instruments this diagram is entirely *about* were the least readable marks
          in it. The sub-label's offset drops from +12 to +10 because at 11 units its
          descenders otherwise cleared the bottom of the 30-unit "amp" box. */}
      <text x={x + w / 2} y={y + h / 2 + (sub ? -3 : 4)} textAnchor="middle" className="fill-foreground text-[12px] font-semibold">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">
          {sub}
        </text>
      )}
    </g>
  );
}

/** A small resistor-style zigzag marking a coax attenuator at a cooling stage. */
function Attenuator({ x, y, color }: { x: number; y: number; color: "brand" | "accent" }) {
  const stroke = color === "brand" ? "stroke-brand" : "stroke-accent";
  return (
    <path
      d={`M${x},${y - 10} L${x + 6},${y - 6} L${x - 6},${y - 2} L${x + 6},${y + 2} L${x - 6},${y + 6} L${x},${y + 10}`}
      fill="none"
      className={stroke}
      strokeWidth={1.5}
    />
  );
}

/** A small triangle marking an amplifier along the readout chain. */
function Amp({ x, y }: { x: number; y: number }) {
  return <path d={`M${x - 7},${y - 7} L${x - 7},${y + 7} L${x + 7},${y} Z`} className="fill-accent" />;
}

/**
 * The full drive/readout signal chain, physically: a room-temperature
 * arbitrary waveform generator up-converted to a microwave tone, sent down
 * through the fridge's cooling stages (attenuated at each one, reusing the
 * same stage boundaries DilutionRefrigeratorDiagram draws in full) to the
 * qubit, and the reflected readout tone carried back up through an
 * amplifier chain to a room-temperature digitizer.
 */
export function ControlSignalChainDiagram({ ariaLabel }: { ariaLabel: string }) {
  return (
    <div className="not-prose overflow-x-auto panel-inset p-4">
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
        {/* room-temperature drive electronics */}
        <Box x={20} y={16} w={80} h={34} label="AWG" />
        <line x1={100} y1={33} x2={135} y2={33} className="stroke-brand" strokeWidth={1.5} />
        <Box x={135} y={16} w={130} h={34} label="IQ mixer" sub="up-conversion" />

        {/* room-temperature readout electronics */}
        <Box x={340} y={16} w={100} h={34} label="Digitizer" />
        <line x1={390} y1={78} x2={390} y2={52} className="stroke-accent" strokeWidth={1.5} markerEnd="url(#chain-up-arrow)" />
        <Box x={340} y={78} w={100} h={30} label="amp" sub="room temp" />

        {/* fridge outline */}
        {/* The fridge wall and the stage boundaries are not chrome: which side of the
            wall a component sits on is what makes it cold, and *where each attenuator
            falls relative to a boundary* is the entire claim of the figure ("each
            cooling stage gets its own attenuator on the way down"). Both were
            `stroke-border`, the panel-edge token at 1.41:1 on `--surface-muted`, so
            the reference the attenuators are read against failed WCAG 2.1 SC 1.4.11's
            3:1 floor. `stroke-axis` is the chart channel. */}
        <rect x={FRIDGE_LEFT} y={FRIDGE_TOP} width={FRIDGE_RIGHT - FRIDGE_LEFT} height={FRIDGE_BOTTOM - FRIDGE_TOP} rx={10} className="fill-none stroke-axis" strokeWidth={1.5} />
        <text x={FRIDGE_LEFT + 8} y={FRIDGE_TOP - 8} className="fill-muted-foreground text-[13px] font-mono">
          300 K (room temp) enters here
        </text>
        {ZONES.map((z, i) => (
          <g key={i}>
            {i > 0 && <line x1={FRIDGE_LEFT} y1={z.yTop} x2={FRIDGE_RIGHT} y2={z.yTop} className="stroke-axis" strokeWidth={1} strokeDasharray="3 3" />}
            {/* 10 -> 13 units (~7.2px on a 320px phone, up from ~5.6px). The longest
                label, "still → cold plate → mixing chamber (~15 mK)", is ~343 units of
                mono at 13 and still ends well inside the 400-unit-wide fridge. */}
            <text x={FRIDGE_LEFT + 8} y={z.yTop + 16} className="fill-muted-foreground text-[13px] font-mono">
              {z.label}
            </text>
          </g>
        ))}

        {/* drive line: room temp down to the qubit, attenuated at each stage */}
        <line x1={DRIVE_X} y1={50} x2={DRIVE_X} y2={470} className="stroke-brand" strokeWidth={2} markerEnd="url(#chain-down-arrow)" />
        <Attenuator x={DRIVE_X} y={195} color="brand" />
        <Attenuator x={DRIVE_X} y={295} color="brand" />
        <Attenuator x={DRIVE_X} y={425} color="brand" />
        <text x={DRIVE_X - 10} y={195} textAnchor="end" className="fill-muted-foreground text-[12px] font-mono">
          atten
        </text>

        {/* readout line: from the qubit back up through the amp chain */}
        <line x1={READOUT_X} y1={470} x2={READOUT_X} y2={78} className="stroke-accent" strokeWidth={2} markerEnd="url(#chain-up-arrow)" />
        <Amp x={READOUT_X} y={295} />
        {/* Flipped to the left of the readout line. At 9 units "HEMT (4 K)" was ~54
            units of mono and just fit between x=402 and the 460-unit right edge; at
            the 12 units it needs to be readable it is ~79 units and would have run off
            the viewBox. The gap between the drive line (x=175) and the readout line
            (x=390) is empty at this height, so the label moves there instead. */}
        <text x={READOUT_X - 12} y={299} textAnchor="end" className="fill-muted-foreground text-[12px] font-mono">
          HEMT (4 K)
        </text>

        {/* qubit at the mixing chamber, where both lines terminate */}
        <Box x={DRIVE_X - 20} y={470} w={READOUT_X - DRIVE_X + 40} h={30} label="qubit chip" sub="mixing chamber, ~15 mK" />

        <defs>
          {/* both markers point along +x by construction; orient="auto" rotates
              each to match its own line's actual direction of travel */}
          <marker id="chain-down-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-brand" />
          </marker>
          <marker id="chain-up-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-accent" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
