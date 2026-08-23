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
    <div className="not-prose overflow-x-auto rounded-xl border border-border bg-surface-muted/40 p-4">
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
  return (
    <g>
      <line x1={40} y1={90} x2={280} y2={90} className="stroke-border" strokeWidth={1} strokeDasharray="3 3" />
      <line x1={60} y1={110} x2={60} y2={70} className="stroke-brand" strokeWidth={2.5} />
      <line x1={60} y1={70} x2={100} y2={70} className="stroke-brand" strokeWidth={2.5} />
      <Label x={80} y={60}>
        H (|0⟩)
      </Label>
      <line x1={140} y1={110} x2={200} y2={110} className="stroke-accent" strokeWidth={2.5} />
      <line x1={200} y1={110} x2={200} y2={150} className="stroke-accent" strokeWidth={2.5} />
      <Label x={220} y={140}>
        V (|1⟩)
      </Label>
      <circle cx={60} cy={90} r={4} className="fill-foreground" />
      <Label x={160} y={30}>
        polarization encoding
      </Label>
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
