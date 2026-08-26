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
        <text x={WIDTH / 2} y={16} textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">
          dispersive readout: the resonator is what gets probed
        </text>

        {/* feedline: the actual measured signal path */}
        <line x1={20} y1={FEEDLINE_Y} x2={400} y2={FEEDLINE_Y} className="stroke-brand" strokeWidth={2.5} markerEnd="url(#dr-arrow)" />
        <text x={20} y={FEEDLINE_Y - 10} className="fill-muted-foreground text-[10px] font-mono">
          probe tone in
        </text>
        <text x={400} y={FEEDLINE_Y - 10} textAnchor="end" className="fill-muted-foreground text-[10px] font-mono">
          to amp chain (4 K &rarr; room temp) &rarr;
        </text>

        {/* coupling capacitor: feedline to resonator */}
        <line x1={RESONATOR_X - 10} y1={FEEDLINE_Y + 6} x2={RESONATOR_X + 10} y2={FEEDLINE_Y + 6} className="stroke-foreground" strokeWidth={2} />
        <line x1={RESONATOR_X - 10} y1={FEEDLINE_Y + 12} x2={RESONATOR_X + 10} y2={FEEDLINE_Y + 12} className="stroke-foreground" strokeWidth={2} />
        <text x={RESONATOR_X + 18} y={FEEDLINE_Y + 13} className="fill-muted-foreground text-[9px] font-mono">
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
        <text x={RESONATOR_X + 46} y={FEEDLINE_Y + 60} className="fill-accent text-[10px] font-semibold">
          readout resonator
        </text>
        <text x={RESONATOR_X + 46} y={FEEDLINE_Y + 74} className="fill-muted-foreground text-[9px] font-mono">
          frequency shifts by ±χ
        </text>
        <text x={RESONATOR_X + 46} y={FEEDLINE_Y + 87} className="fill-muted-foreground text-[9px] font-mono">
          with qubit state
        </text>

        {/* dispersive coupling: resonator to qubit (off-resonant, weak) */}
        <line x1={RESONATOR_X - 8} y1={FEEDLINE_Y + 100} x2={RESONATOR_X + 8} y2={FEEDLINE_Y + 100} className="stroke-foreground" strokeWidth={2} />
        <line x1={RESONATOR_X - 8} y1={FEEDLINE_Y + 106} x2={RESONATOR_X + 8} y2={FEEDLINE_Y + 106} className="stroke-foreground" strokeWidth={2} />
        {/* shifted further left than the coupling label above so this line,
            which sits at the qubit box's y-level, doesn't run into (and get
            painted over by) the box's x-range */}
        <text x={RESONATOR_X - 76} y={FEEDLINE_Y + 107} className="fill-muted-foreground text-[9px] font-mono">
          dispersive g
        </text>
        <text x={RESONATOR_X - 128} y={FEEDLINE_Y + 118} className="fill-muted-foreground text-[9px] font-mono">
          (off-resonant)
        </text>

        {/* qubit: coupled to the resonator only, never on the measured feedline itself */}
        <rect x={RESONATOR_X - 40} y={FEEDLINE_Y + 112} width={80} height={34} rx={6} className="fill-surface stroke-brand" strokeWidth={1.5} />
        <text x={RESONATOR_X} y={FEEDLINE_Y + 132} textAnchor="middle" className="fill-foreground text-[11px] font-semibold">
          qubit
        </text>
        <text x={RESONATOR_X} y={FEEDLINE_Y + 143} textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">
          |0⟩ or |1⟩
        </text>

        <text x={RESONATOR_X - 40} y={FEEDLINE_Y + 168} className="fill-muted-foreground text-[9.5px] font-mono">
          qubit state is inferred indirectly — it is
        </text>
        <text x={RESONATOR_X - 40} y={FEEDLINE_Y + 180} className="fill-muted-foreground text-[9.5px] font-mono">
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
