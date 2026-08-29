const WIDTH = 420;
const HEIGHT = 260;

const FEEDLINE_Y = 56;
const RESONATOR_X = 190;

/**
 * Dispersive readout: a qubit capacitively coupled to a readout resonator,
 * which is itself capacitively coupled to a feedline carrying a probe tone
 * in and a shifted tone out to an amplifier chain. Labeled so it's clear
 * the RESONATOR sits on the measured signal path — the qubit only couples
 * to it dispersively (off-resonant) and is never probed directly.
 */
export function DispersiveReadoutDiagram({ ariaLabel }: { ariaLabel: string }) {
  return (
    <div className="not-prose overflow-x-auto panel-inset p-4">
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
        {/* Every label in this file was authored between 9 and 11 units. The viewBox is
            420 units wide and renders `w-full`, so inside `panel-inset p-4` on a 320px
            phone (a ~256px column) a unit is ~0.61px and those resolved to 5.5–6.7px
            on screen — for a diagram that is *entirely* labels, that made the figure
            unreadable at the width most readers meet it. Sizes below go to 11–13, each
            checked against the 420-unit box for overflow. The title stays at 12 rather
            than 13 because at 13 its 52 monospace characters are ~406 units and would
            leave a 7-unit margin. */}
        <text x={WIDTH / 2} y={16} textAnchor="middle" className="fill-muted-foreground text-[12px] font-mono">
          dispersive readout: the resonator is what gets probed
        </text>

        {/* feedline: the actual measured signal path */}
        <line x1={20} y1={FEEDLINE_Y} x2={400} y2={FEEDLINE_Y} className="stroke-brand" strokeWidth={2.5} markerEnd="url(#dr-arrow)" />
        <text x={20} y={FEEDLINE_Y - 10} className="fill-muted-foreground text-[12px] font-mono">
          probe tone in
        </text>
        <text x={400} y={FEEDLINE_Y - 10} textAnchor="end" className="fill-muted-foreground text-[12px] font-mono">
          to amp chain (4 K &rarr; room temp) &rarr;
        </text>

        {/* coupling capacitor: feedline to resonator */}
        <line x1={RESONATOR_X - 10} y1={FEEDLINE_Y + 6} x2={RESONATOR_X + 10} y2={FEEDLINE_Y + 6} className="stroke-foreground" strokeWidth={2} />
        <line x1={RESONATOR_X - 10} y1={FEEDLINE_Y + 12} x2={RESONATOR_X + 10} y2={FEEDLINE_Y + 12} className="stroke-foreground" strokeWidth={2} />
        <text x={RESONATOR_X + 18} y={FEEDLINE_Y + 14} className="fill-muted-foreground text-[11px] font-mono">
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
        <text x={RESONATOR_X + 46} y={FEEDLINE_Y + 60} className="fill-accent text-[13px] font-semibold">
          readout resonator
        </text>
        <text x={RESONATOR_X + 46} y={FEEDLINE_Y + 76} className="fill-muted-foreground text-[11px] font-mono">
          frequency shifts by ±χ
        </text>
        <text x={RESONATOR_X + 46} y={FEEDLINE_Y + 90} className="fill-muted-foreground text-[11px] font-mono">
          with qubit state
        </text>

        {/* dispersive coupling: resonator to qubit (off-resonant, weak) */}
        <line x1={RESONATOR_X - 8} y1={FEEDLINE_Y + 100} x2={RESONATOR_X + 8} y2={FEEDLINE_Y + 100} className="stroke-foreground" strokeWidth={2} />
        <line x1={RESONATOR_X - 8} y1={FEEDLINE_Y + 106} x2={RESONATOR_X + 8} y2={FEEDLINE_Y + 106} className="stroke-foreground" strokeWidth={2} />
        {/* Both labels now hang right-aligned off x = RESONATOR_X - 46, i.e. they end
            just left of the qubit box (which starts at RESONATOR_X - 40). The previous
            left-aligned placement was tuned to 9-unit type; at 11 "dispersive g" grew
            to ~79 units and ran under the coupling-capacitor plates at x = 182–198,
            and "(off-resonant)" ran into the qubit box. Anchoring at the box's left
            edge keeps both clear at any size they are likely to take. */}
        <text x={RESONATOR_X - 46} y={FEEDLINE_Y + 105} textAnchor="end" className="fill-muted-foreground text-[11px] font-mono">
          dispersive g
        </text>
        <text x={RESONATOR_X - 46} y={FEEDLINE_Y + 119} textAnchor="end" className="fill-muted-foreground text-[11px] font-mono">
          (off-resonant)
        </text>

        {/* Qubit: coupled to the resonator only, never on the measured feedline itself.
            The box grew 34 -> 42 units tall because at 13/11 units its two lines of
            label no longer fit inside a 34-unit box — the "|0⟩ or |1⟩" descenders sat
            exactly on the bottom edge. */}
        <rect x={RESONATOR_X - 40} y={FEEDLINE_Y + 112} width={80} height={42} rx={6} className="fill-surface stroke-brand" strokeWidth={1.5} />
        <text x={RESONATOR_X} y={FEEDLINE_Y + 131} textAnchor="middle" className="fill-foreground text-[13px] font-semibold">
          qubit
        </text>
        <text x={RESONATOR_X} y={FEEDLINE_Y + 147} textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">
          |0⟩ or |1⟩
        </text>

        {/* Moved to the left margin (x=20) from x = RESONATOR_X - 40 = 150: at 12 units
            the longer of these two lines is ~302 monospace units, which from x=150
            would have ended at ~452 in a 420-unit viewBox. From x=20 it ends at ~322. */}
        <text x={20} y={FEEDLINE_Y + 176} className="fill-muted-foreground text-[12px] font-mono">
          qubit state is inferred indirectly — it is
        </text>
        <text x={20} y={FEEDLINE_Y + 191} className="fill-muted-foreground text-[12px] font-mono">
          never on the measured feedline path itself
        </text>

        <defs>
          <marker id="dr-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-brand" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
