/*
 * SIZING, RECOMPUTED FROM THE REAL BOX
 * ------------------------------------
 * This SVG renders `w-full` inside `panel-inset p-4`, so on a 320px phone its
 * real box is 320 - 32 (Container `px-4`) = 288, less 2 x (16px padding + 1px
 * border) = **254px**, and one viewBox unit paints at 254/460 = 0.5522px. The
 * previous pass raised labels to 11-13 units against a "~256px" column and
 * called them fixed; 13 x 0.5522 = 7.18px, still under the ~9px legibility
 * floor. 17 units is the first size that clears it (9.39px), and this figure
 * is entirely labels: the instrument names ARE the content.
 *
 * At 17 units monospace advance is ~10.2 units per character. Two hard
 * constraints follow, and every string below is counted against them rather
 * than eyeballed, because SVG clips a viewBox overrun silently:
 *
 *   1. A box label must fit its box: `label` and `sub` <= (w / 10.2) chars.
 *   2. A label left-anchored at the fridge wall must END before the drive
 *      line at x = 175, or the line paints through the middle of it. That is
 *      (175 - 38) / 10.2 = 13 characters, which is why the zone labels below
 *      are bare temperatures. The stage NAMES they used to carry
 *      ("still -> cold plate -> mixing chamber (~15 mK)", 44 characters) are
 *      what DilutionRefrigeratorDiagram draws in full, as the docstring says;
 *      the qubit box's own sub-label still names the mixing chamber.
 */

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

/** Bottom edge of the room-temperature amp box; where the readout line terminates. */
const AMP_BOX_BOTTOM = 122;

/**
 * Top of the qubit-chip box, and where both signal lines terminate. Set so the
 * box's 44-unit height (it needs two 17-unit lines now, up from 30) ends exactly
 * on FRIDGE_BOTTOM: the chip has to sit INSIDE the fridge wall, and growing the
 * box downward from its old y = 470 would have pushed it 14 units through the
 * bottom of the very thing that makes it cold.
 */
const QUBIT_BOX_TOP = FRIDGE_BOTTOM - 44;

// Same cold stages DilutionRefrigeratorDiagram shows in full, simplified to
// three zones here since what matters for the signal path is that each one
// gets its own attenuator on the way down.
const ZONES = [
  { yTop: FRIDGE_TOP, yBottom: 240, label: "77 K" },
  { yTop: 240, yBottom: 350, label: "~4 K" },
  { yTop: 350, yBottom: FRIDGE_BOTTOM, label: "~15 mK" },
];

function Box({ x, y, w, h, label, sub }: { x: number; y: number; w: number; h: number; label: string; sub?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} className="fill-surface stroke-brand" strokeWidth={1.5} />
      {/* Both lines at 17 units (9.39px), up from 12 and 11 (6.63px and 6.07px).
          The sub-label stays subordinate by weight, colour and monospace rather
          than by size, because at this scale a size step down lands under the
          floor. Boxes carrying a sub-label are 44 units tall so that a 17-unit
          baseline at h/2 - 4 and a second at h/2 + 14 both keep their cap heights
          and descenders inside the rectangle. */}
      <text x={x + w / 2} y={y + h / 2 + (sub ? -4 : 6)} textAnchor="middle" fontSize={17} className="fill-foreground font-semibold">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" fontSize={17} className="fill-muted-foreground font-mono">
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
        {/* Room-temperature drive electronics. The IQ mixer box widened 130 -> 150
            because "up-conversion" is 13 characters = 133 units at 17 and no longer
            fit the old width; it still ends at x = 285, clear of the Digitizer at
            x = 340. */}
        <Box x={20} y={16} w={80} h={40} label="AWG" />
        <line x1={100} y1={36} x2={135} y2={36} className="stroke-brand" strokeWidth={1.5} />
        <Box x={135} y={16} w={150} h={44} label="IQ mixer" sub="up-conversion" />

        {/* Room-temperature readout electronics. */}
        <Box x={340} y={16} w={100} h={40} label="Digitizer" />
        <line x1={READOUT_X} y1={78} x2={READOUT_X} y2={56} className="stroke-accent" strokeWidth={1.5} markerEnd="url(#chain-up-arrow)" />
        <Box x={340} y={78} w={100} h={44} label="amp" sub="room temp" />

        {/* fridge outline */}
        {/* The fridge wall and the stage boundaries are not chrome: which side of
            the wall a component sits on is what makes it cold, and *where each
            attenuator falls relative to a boundary* is the entire claim of the
            figure ("each cooling stage gets its own attenuator on the way down").
            Both were `stroke-border`, the panel-edge token at 1.41:1 on
            `--surface-muted`, so the reference the attenuators are read against
            failed WCAG 2.1 SC 1.4.11's 3:1 floor. `stroke-axis` is the chart
            channel. */}
        <rect
          x={FRIDGE_LEFT}
          y={FRIDGE_TOP}
          width={FRIDGE_RIGHT - FRIDGE_LEFT}
          height={FRIDGE_BOTTOM - FRIDGE_TOP}
          rx={10}
          className="fill-none stroke-axis"
          strokeWidth={1.5}
        />
        {/* Split onto two short lines at x = 20. As one line ("300 K (room temp)
            enters here") it ran 38..334 at 17 units, and the drive line descends
            through x = 175 in exactly that band, painting a 2px stroke through the
            middle of the sentence. Two lines of <= 9 characters each end at x = 112,
            well left of the drive line, and sit above the fridge wall at y = 130. */}
        <text x={20} y={100} fontSize={17} className="fill-muted-foreground font-mono">
          300 K
        </text>
        <text x={20} y={122} fontSize={17} className="fill-muted-foreground font-mono">
          room temp
        </text>
        {ZONES.map((z, i) => (
          <g key={i}>
            {i > 0 && <line x1={FRIDGE_LEFT} y1={z.yTop} x2={FRIDGE_RIGHT} y2={z.yTop} className="stroke-axis" strokeWidth={1} strokeDasharray="3 3" />}
            {/* 10 -> 17 units (6.07px -> 9.39px). Baseline offset +16 -> +22 so the
                taller cap height still clears the dashed boundary above it. */}
            <text x={FRIDGE_LEFT + 8} y={z.yTop + 22} fontSize={17} className="fill-muted-foreground font-mono">
              {z.label}
            </text>
          </g>
        ))}

        {/* drive line: room temp down to the qubit, attenuated at each stage */}
        <line x1={DRIVE_X} y1={60} x2={DRIVE_X} y2={QUBIT_BOX_TOP} className="stroke-brand" strokeWidth={2} markerEnd="url(#chain-down-arrow)" />
        <Attenuator x={DRIVE_X} y={195} color="brand" />
        <Attenuator x={DRIVE_X} y={295} color="brand" />
        <Attenuator x={DRIVE_X} y={425} color="brand" />
        {/* Right-anchored at x = 161 so it ends 14 units short of the drive line: 5
            characters = 51 units at 17, so 110..161, clear of the "77 K" zone label
            which ends at x = 79. */}
        <text x={DRIVE_X - 14} y={201} textAnchor="end" fontSize={17} className="fill-muted-foreground font-mono">
          atten
        </text>

        {/* Readout line: from the qubit back up through the amp chain. It now
            terminates at the amp box's BOTTOM edge (y = 122) rather than its top: it
            was drawn to y = 78, so a 2px accent line ran straight through the "amp /
            room temp" label and out the top of the box it was supposed to enter. */}
        <line
          x1={READOUT_X}
          y1={470}
          x2={READOUT_X}
          y2={AMP_BOX_BOTTOM}
          className="stroke-accent"
          strokeWidth={2}
          markerEnd="url(#chain-up-arrow)"
        />
        <Amp x={READOUT_X} y={295} />
        {/* Left of the readout line: 10 characters = 102 units at 17, right-anchored
            at 376 so it spans 274..376. Right-anchored at the viewBox edge instead it
            would have needed room past x = 402 and run off the 460-unit box. The gap
            between the drive line (x=175) and the readout line (x=390) is empty at
            this height, so the label lives there. */}
        <text x={READOUT_X - 14} y={301} textAnchor="end" fontSize={17} className="fill-muted-foreground font-mono">
          HEMT (4 K)
        </text>

        {/* Qubit at the mixing chamber, where both lines terminate. 44 units tall to
            hold two 17-unit lines; "mixing chamber, ~15 mK" is 22 characters = 224
            units, inside the 255-unit box. */}
        <Box x={DRIVE_X - 20} y={QUBIT_BOX_TOP} w={READOUT_X - DRIVE_X + 40} h={44} label="qubit chip" sub="mixing chamber, ~15 mK" />

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
