const WIDTH = 480;
const HEIGHT = 400;

const ATOM_A_X = 170;
const ATOM_B_X = 300;
const ATOM_Y = 220;

const ORBITAL_R = 55;
const BLOCKADE_R = 165;
const SUPPRESSED_R = 24;

/**
 * Rydberg blockade, the neutral-atom two-qubit gate mechanism: exciting one
 * atom to a Rydberg state expands its electron orbital enormously, which
 * shifts a nearby atom's energy levels strongly enough that IT can no
 * longer be excited to the same Rydberg state at the same time. Atom A
 * (left) is shown mid-excitation with its expanded orbital and the
 * blockade radius it creates; atom B (right), sitting inside that radius,
 * has its own excitation attempt shown dimmed/dashed to read as
 * suppressed, not merely "a second, smaller atom."
 */
export function RydbergBlockadeDiagram({ ariaLabel }: { ariaLabel: string }) {
  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-border bg-surface-muted/40 p-4">
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
        <text x={WIDTH / 2} y={18} textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">
          Rydberg blockade: atom A&apos;s excitation suppresses atom B&apos;s
        </text>

        {/* blockade radius: the region around atom A where a second Rydberg
            excitation is suppressed. Drawn first so every other element
            paints on top of it. */}
        <circle cx={ATOM_A_X} cy={ATOM_Y} r={BLOCKADE_R} className="fill-none stroke-border" strokeWidth={1.25} strokeDasharray="4 4" />

        {/* laser driving both atoms' ground -> Rydberg transition */}
        <text x={(ATOM_A_X + ATOM_B_X) / 2} y={48} textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono">
          same laser addresses both atoms: ground &rarr; |r&#10217;
        </text>
        <line
          x1={ATOM_A_X}
          y1={60}
          x2={ATOM_A_X}
          y2={ATOM_Y - ORBITAL_R - 6}
          className="stroke-brand"
          strokeWidth={2}
          markerEnd="url(#rb-arrow-brand)"
        />
        <line
          x1={ATOM_B_X}
          y1={60}
          x2={ATOM_B_X}
          y2={ATOM_Y - SUPPRESSED_R - 6}
          className="stroke-muted-foreground"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          opacity={0.6}
          markerEnd="url(#rb-arrow-muted)"
        />

        {/* atom A: successfully excited, enormous Rydberg orbital */}
        <circle cx={ATOM_A_X} cy={ATOM_Y} r={ORBITAL_R} className="fill-accent/15 stroke-accent" strokeWidth={1.5} />
        <circle cx={ATOM_A_X} cy={ATOM_Y} r={6} className="fill-accent" />
        <text x={ATOM_A_X} y={ATOM_Y - ORBITAL_R - 12} textAnchor="middle" className="fill-accent text-[10px] font-semibold">
          atom A: excited to |r&#10217;
        </text>
        <text x={ATOM_A_X} y={ATOM_Y + 6} textAnchor="middle" className="fill-accent-foreground text-[8px] font-mono">
          A
        </text>

        {/* atom B: excitation attempt suppressed by the blockade */}
        <circle
          cx={ATOM_B_X}
          cy={ATOM_Y}
          r={SUPPRESSED_R}
          className="fill-muted-foreground/10 stroke-muted-foreground"
          strokeWidth={1.25}
          strokeDasharray="2 3"
          opacity={0.7}
        />
        <circle cx={ATOM_B_X} cy={ATOM_Y} r={6} className="fill-surface stroke-border" strokeWidth={1.5} />
        <text x={ATOM_B_X} y={ATOM_Y + 5} textAnchor="middle" className="fill-muted-foreground text-[8px] font-mono">
          B
        </text>
        <text x={ATOM_B_X} y={ATOM_Y - SUPPRESSED_R - 12} textAnchor="middle" className="fill-muted-foreground text-[10px] font-semibold">
          atom B: excitation blocked
        </text>

        {/* blockade radius callout, anchored on the dashed circle itself */}
        <line
          x1={ATOM_A_X}
          y1={ATOM_Y}
          x2={ATOM_A_X + BLOCKADE_R * Math.cos(-0.55)}
          y2={ATOM_Y + BLOCKADE_R * Math.sin(-0.55)}
          className="stroke-border"
          strokeWidth={1}
          strokeDasharray="2 2"
        />
        <text
          x={ATOM_A_X + BLOCKADE_R * Math.cos(-0.55) + 6}
          y={ATOM_Y + BLOCKADE_R * Math.sin(-0.55) - 4}
          className="fill-muted-foreground text-[10px] font-mono"
        >
          blockade radius r_b
        </text>

        <text x={ATOM_A_X - ORBITAL_R} y={ATOM_Y + ORBITAL_R + 32} className="fill-muted-foreground text-[9.5px] font-mono">
          atom B sits within r_b, so its energy levels
        </text>
        <text x={ATOM_A_X - ORBITAL_R} y={ATOM_Y + ORBITAL_R + 44} className="fill-muted-foreground text-[9.5px] font-mono">
          are shifted off resonance with the laser
        </text>

        <defs>
          <marker id="rb-arrow-brand" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-brand" />
          </marker>
          <marker id="rb-arrow-muted" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-muted-foreground" opacity={0.6} />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
