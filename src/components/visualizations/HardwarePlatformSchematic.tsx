export type HardwarePlatformVariant = "superconducting" | "trapped-ion" | "neutral-atom" | "photonic" | "spin-qubit";

const WIDTH = 320;
const HEIGHT = 180;

/**
 * A small, structurally-accurate (not decorative) schematic for each
 * physical qubit platform: the actual mechanism the lesson is describing,
 * not a generic "quantum computer" illustration. Kept intentionally
 * simple — a labeled diagram of the real physical structure, at the
 * level of detail a first pass through the platform-comparison lessons
 * needs, not an engineering drawing.
 */
export function HardwarePlatformSchematic({ variant, ariaLabel }: { variant: HardwarePlatformVariant; ariaLabel: string }) {
  return (
    <div className="not-prose overflow-x-auto panel-inset p-4">
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={ariaLabel}>
        {variant === "superconducting" && <SuperconductingSchematic />}
        {variant === "trapped-ion" && <TrappedIonSchematic />}
        {variant === "neutral-atom" && <NeutralAtomSchematic />}
        {variant === "photonic" && <PhotonicSchematic />}
        {variant === "spin-qubit" && <SpinQubitSchematic />}
      </svg>
    </div>
  );
}

function Label({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono">
      {children}
    </text>
  );
}

function SuperconductingSchematic() {
  return (
    <g>
      <rect x={20} y={20} width={280} height={140} rx={8} className="fill-surface stroke-border" strokeWidth={1} />
      <Label x={160} y={34}>
        chip substrate
      </Label>
      <path d="M 100 100 L 100 70 L 220 70 L 220 100" fill="none" className="stroke-brand" strokeWidth={2.5} />
      <path d="M 100 100 L 100 130 L 220 130 L 220 100" fill="none" className="stroke-brand" strokeWidth={2.5} />
      <line x1={100} y1={90} x2={110} y2={110} className="stroke-accent" strokeWidth={3} />
      <line x1={110} y1={90} x2={100} y2={110} className="stroke-accent" strokeWidth={3} />
      <rect x={95} y={85} width={20} height={30} className="fill-surface" opacity={0} />
      <Label x={105} y={145}>
        Josephson junction
      </Label>
      <line x1={220} y1={80} x2={220} y2={120} className="stroke-brand" strokeWidth={2.5} />
      <line x1={210} y1={80} x2={210} y2={120} className="stroke-brand" strokeWidth={2.5} />
      <Label x={215} y={145}>
        capacitor
      </Label>
    </g>
  );
}

function TrappedIonSchematic() {
  const ionXs = [90, 130, 170, 210, 250];
  return (
    <g>
      <rect x={20} y={30} width={280} height={12} rx={4} className="fill-surface stroke-brand" strokeWidth={1.5} />
      <rect x={20} y={138} width={280} height={12} rx={4} className="fill-surface stroke-brand" strokeWidth={1.5} />
      <Label x={280} y={26}>
        RF electrode
      </Label>
      <Label x={280} y={162}>
        RF electrode
      </Label>
      {ionXs.map((x, i) => (
        <circle key={i} cx={x} cy={85} r={9} className="fill-accent" />
      ))}
      <line x1={70} y1={85} x2={270} y2={85} className="stroke-border" strokeWidth={1} strokeDasharray="2 3" />
      <Label x={160} y={110}>
        linear ion chain (shared motional mode)
      </Label>
    </g>
  );
}

function NeutralAtomSchematic() {
  const rows = 3;
  const cols = 5;
  const startX = 50;
  const startY = 40;
  const gap = 45;
  const loaded = new Set(["0,0", "0,2", "1,1", "1,3", "2,0", "2,4"]);
  return (
    <g>
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const key = `${r},${c}`;
          const isLoaded = loaded.has(key);
          return (
            <g key={key}>
              <circle
                cx={startX + c * gap}
                cy={startY + r * gap}
                r={10}
                className={isLoaded ? "fill-accent" : "fill-surface stroke-border"}
                strokeWidth={1}
              />
            </g>
          );
        })
      )}
      <Label x={160} y={170}>
        optical tweezer array (filled traps highlighted)
      </Label>
    </g>
  );
}

function PhotonicSchematic() {
  // A single beam (one physical path) traveling left to right. Polarization
  // isn't which route the photon takes — it's the orientation of the field's
  // oscillation plane, transverse to travel. That's shown as a head-on
  // cross-section of the SAME beam: two perpendicular double-headed arrows
  // (H and V), not two separate bent paths.
  return (
    <g>
      <Label x={160} y={22}>
        polarization encoding
      </Label>

      <circle cx={36} cy={100} r={4} className="fill-foreground" />
      <line x1={36} y1={100} x2={290} y2={100} className="stroke-brand" strokeWidth={2.5} markerEnd="url(#photon-travel-arrow)" />
      <Label x={110} y={122}>
        photon travels &rarr;
      </Label>

      {/* head-on view of the same beam: field oscillation plane */}
      <circle cx={205} cy={100} r={32} className="fill-surface stroke-border" strokeWidth={1} strokeDasharray="2 3" />
      <line
        x1={205}
        y1={74}
        x2={205}
        y2={126}
        className="stroke-accent"
        strokeWidth={2.5}
        markerStart="url(#pol-arrowhead)"
        markerEnd="url(#pol-arrowhead)"
      />
      <line
        x1={177}
        y1={100}
        x2={233}
        y2={100}
        className="stroke-brand"
        strokeWidth={2.5}
        markerStart="url(#pol-arrowhead)"
        markerEnd="url(#pol-arrowhead)"
      />
      <Label x={205} y={62}>
        V (|1⟩)
      </Label>
      {/* offset below the H arrow (mirroring V's label offset above its own
          arrow) so it clears the long travel line's arrowhead at x=290,
          which sits at the same height as the H arrow itself */}
      <Label x={255} y={118}>
        H (|0⟩)
      </Label>
      <Label x={205} y={168}>
        field oscillation, head-on
      </Label>

      <defs>
        <marker id="photon-travel-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className="fill-brand" />
        </marker>
        <marker id="pol-arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className="fill-foreground" />
        </marker>
      </defs>
    </g>
  );
}

function SpinQubitSchematic() {
  return (
    <g>
      <rect x={30} y={20} width={260} height={130} rx={4} className="fill-surface stroke-border" strokeWidth={1} />
      <Label x={160} y={34}>
        semiconductor substrate
      </Label>
      {[70, 110, 150, 190, 230].map((x, i) => (
        <rect key={i} x={x} y={50} width={24} height={40} rx={3} className="fill-brand/20 stroke-brand" strokeWidth={1.25} />
      ))}
      <circle cx={160} cy={100} r={10} className="fill-accent" />
      <Label x={160} y={125}>
        confined electron
      </Label>
      <Label x={160} y={44}>
        gate electrodes
      </Label>
    </g>
  );
}
