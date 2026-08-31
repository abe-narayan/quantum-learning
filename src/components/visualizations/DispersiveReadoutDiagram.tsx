/*
 * SIZING, RECOMPUTED FROM THE REAL BOX
 * ------------------------------------
 * This SVG renders `w-full` inside `panel-inset p-4`, so on a 320px phone its
 * real box is 320 - 32 (Container `px-4`) = 288, less 2 x (16px padding + 1px
 * border) = **254px**, and one viewBox unit paints at 254/420 = 0.6048px. The
 * previous pass raised labels to 11-13 units against a "~256px" column and
 * recorded that as fixed; 13 x 0.6048 = 7.86px and 11 x 0.6048 = 6.65px, both
 * under the ~9px legibility floor. 15 units is the first size that clears it
 * (15 x 0.6048 = **9.07px**), and every remaining in-SVG label is written to
 * that size.
 *
 * At 15 units monospace advance is ~9 units per character, so a full-width
 * line holds 420 / 9 = **46 characters**, and a label anchored at x must fit
 * (420 - x) / 9. Every string below is counted against that, not eyeballed:
 * SVG clips a viewBox overrun silently, with no scrollbar and no error.
 *
 * The title ("dispersive readout: the resonator is probed") and the closing
 * two-line conclusion ("the qubit state is inferred indirectly." / "it is
 * never on the measured feedline path.") used to be drawn at this same
 * 15-unit, 9.07px size, which clears the ~9px guard this file's own comments
 * are written against but not the 12px floor
 * `scripts/audit/responsive.mjs` holds *running text* to - and two of those
 * three strings are running text over 40 characters by that check's own
 * definition. Neither one points at a specific part of the drawing the way
 * "readout resonator" or "coupling C" do, so both now render as real HTML at
 * `text-xs` (12px) beside the `<svg>` instead, the same fix
 * `HardwarePlatformSchematic` made for its own former in-SVG caption.
 */

const WIDTH = 420;
// 236, not 272: the closing two-line conclusion that used to occupy
// y=240..260 now renders as HTML below the figure, so the viewBox's lowest
// content is the qubit box's bottom edge at QUBIT_BOX_Y + QUBIT_BOX_H = 216,
// plus 20 units of padding.
const HEIGHT = 236;

const FEEDLINE_Y = 56;
const RESONATOR_X = 190;

/**
 * The qubit box widened 80 -> 104 and grew 42 -> 48. Its second line, "|0⟩ or
 * |1⟩", is 10 characters = 90 units at 15 and did not fit the old 80-unit box;
 * two 15-unit lines need 48 units of height to keep both cap heights and
 * descenders inside the rectangle.
 */
const QUBIT_BOX_W = 104;
const QUBIT_BOX_H = 48;
const QUBIT_BOX_Y = FEEDLINE_Y + 112;

/**
 * Dispersive readout: a qubit capacitively coupled to a readout resonator,
 * which is itself capacitively coupled to a feedline carrying a probe tone
 * in and a shifted tone out to an amplifier chain. Labeled so it's clear
 * the RESONATOR sits on the measured signal path: the qubit only couples
 * to it dispersively (off-resonant) and is never probed directly.
 */
export function DispersiveReadoutDiagram({ ariaLabel }: { ariaLabel: string }) {
  return (
    // Title and closing conclusion moved to real HTML at `text-xs` (12px):
    // see the SIZING comment above this component.
    <div className="not-prose space-y-1.5">
      <p className="text-xs text-muted-foreground">dispersive readout: the resonator is probed</p>
      <div className="overflow-x-auto panel-inset p-4">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
        {/* feedline: the actual measured signal path */}
        <line x1={20} y1={FEEDLINE_Y} x2={400} y2={FEEDLINE_Y} className="stroke-brand" strokeWidth={2.5} markerEnd="url(#dr-arrow)" />
        <text x={20} y={42} fontSize={15} className="fill-muted-foreground font-mono">
          probe tone in
        </text>
        {/* Right-anchored at 400, 23 characters = 207 units, so 193..400. The old
            string ("to amp chain (4 K -> room temp) ->", 32 characters) is 288 units
            at 15 and would have started at 112, overlapping "probe tone in" (which
            ends at 137) on the same baseline. */}
        <text x={400} y={42} textAnchor="end" fontSize={15} className="fill-muted-foreground font-mono">
          to amps (4 K &rarr; 300 K) &rarr;
        </text>

        {/* coupling capacitor: feedline to resonator */}
        <line x1={RESONATOR_X - 10} y1={FEEDLINE_Y + 6} x2={RESONATOR_X + 10} y2={FEEDLINE_Y + 6} className="stroke-foreground" strokeWidth={2} />
        <line x1={RESONATOR_X - 10} y1={FEEDLINE_Y + 12} x2={RESONATOR_X + 10} y2={FEEDLINE_Y + 12} className="stroke-foreground" strokeWidth={2} />
        <text x={RESONATOR_X + 18} y={FEEDLINE_Y + 16} fontSize={15} className="fill-muted-foreground font-mono">
          coupling C
        </text>

        {/* readout resonator: a meander to read visually as a resonator, not a plain wire */}
        <path
          d={`M${RESONATOR_X},${FEEDLINE_Y + 18}
              L${RESONATOR_X},${FEEDLINE_Y + 34}
              L${RESONATOR_X - 34},${FEEDLINE_Y + 34}
              L${RESONATOR_X - 34},${FEEDLINE_Y + 56}
              L${RESONATOR_X + 34},${FEEDLINE_Y + 56}
              L${RESONATOR_X + 34},${FEEDLINE_Y + 78}
              L${RESONATOR_X},${FEEDLINE_Y + 78}
              L${RESONATOR_X},${FEEDLINE_Y + 96}`}
          fill="none"
          className="stroke-accent"
          strokeWidth={2.5}
        />
        <text x={RESONATOR_X + 46} y={FEEDLINE_Y + 60} fontSize={15} className="fill-accent font-semibold">
          readout resonator
        </text>
        {/* The two detail lines now name WHICH shift goes with WHICH qubit state
            rather than saying only "shifts by ±χ with qubit state". That mapping is
            the whole mechanism: the probe tone comes back at one of two resolvably
            different frequencies, and which one it is IS the measurement outcome. It
            also fits: 15 and 14 characters = 135 and 126 units, anchored at 236, so
            236..371 and 236..362, inside the 420-unit box (the old 22-character
            "frequency shifts by ±χ" would have ended at 434 and been clipped). */}
        <text x={RESONATOR_X + 46} y={FEEDLINE_Y + 80} fontSize={15} className="fill-muted-foreground font-mono">
          shifts +χ or &#8722;χ
        </text>
        <text x={RESONATOR_X + 46} y={FEEDLINE_Y + 100} fontSize={15} className="fill-muted-foreground font-mono">
          for |0&#10217; or |1&#10217;
        </text>

        {/* dispersive coupling: resonator to qubit (off-resonant, weak) */}
        <line x1={RESONATOR_X - 8} y1={FEEDLINE_Y + 100} x2={RESONATOR_X + 8} y2={FEEDLINE_Y + 100} className="stroke-foreground" strokeWidth={2} />
        <line x1={RESONATOR_X - 8} y1={FEEDLINE_Y + 106} x2={RESONATOR_X + 8} y2={FEEDLINE_Y + 106} className="stroke-foreground" strokeWidth={2} />
        {/* Both labels hang right-aligned off the qubit box's left edge minus 6, so
            they end just clear of it whatever size they take. "(off-resonant)" is 14
            characters = 126 units at 15, running 6..132 from that anchor. */}
        <text x={RESONATOR_X - QUBIT_BOX_W / 2 - 6} y={FEEDLINE_Y + 105} textAnchor="end" fontSize={15} className="fill-muted-foreground font-mono">
          dispersive g
        </text>
        <text x={RESONATOR_X - QUBIT_BOX_W / 2 - 6} y={FEEDLINE_Y + 123} textAnchor="end" fontSize={15} className="fill-muted-foreground font-mono">
          (off-resonant)
        </text>

        {/* Qubit: coupled to the resonator only, never on the measured feedline. */}
        <rect
          x={RESONATOR_X - QUBIT_BOX_W / 2}
          y={QUBIT_BOX_Y}
          width={QUBIT_BOX_W}
          height={QUBIT_BOX_H}
          rx={6}
          className="fill-surface stroke-brand"
          strokeWidth={1.5}
        />
        <text x={RESONATOR_X} y={QUBIT_BOX_Y + 22} textAnchor="middle" fontSize={15} className="fill-foreground font-semibold">
          qubit
        </text>
        <text x={RESONATOR_X} y={QUBIT_BOX_Y + 42} textAnchor="middle" fontSize={15} className="fill-muted-foreground font-mono">
          |0&#10217; or |1&#10217;
        </text>

        <defs>
          <marker id="dr-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-brand" />
          </marker>
        </defs>
        </svg>
      </div>
      <p className="text-xs text-muted-foreground">
        The qubit state is inferred indirectly. It is never on the measured feedline path.
      </p>
    </div>
  );
}
