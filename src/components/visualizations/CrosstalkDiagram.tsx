const WIDTH = 460;
const HEIGHT = 320;

const CHIP_X = 30;
const CHIP_Y = 55;
const CHIP_W = 400;
const CHIP_H = 200;

const PAD_W = 70;
const PAD_H = 46;

type Pad = { cx: number; cy: number; label: string; sub?: string; variant: "target" | "spectator" | "idle" };

const PADS: Pad[] = [
  { cx: 110, cy: 105, label: "target", sub: "driven", variant: "target" },
  { cx: 230, cy: 105, label: "spectator", sub: "leak ε", variant: "spectator" },
  { cx: 350, cy: 105, label: "idle", variant: "idle" },
  { cx: 110, cy: 190, label: "idle", variant: "idle" },
  { cx: 230, cy: 190, label: "idle", variant: "idle" },
  { cx: 350, cy: 190, label: "idle", variant: "idle" },
];

function QubitPad({ cx, cy, label, sub, variant }: Pad) {
  const boxClass =
    variant === "target"
      ? "fill-brand/20 stroke-brand"
      : variant === "spectator"
        ? "fill-accent/15 stroke-accent"
        : "fill-surface stroke-border";
  const labelClass = variant === "idle" ? "fill-muted-foreground" : variant === "target" ? "fill-brand" : "fill-accent";
  return (
    <g>
      <rect x={cx - PAD_W / 2} y={cy - PAD_H / 2} width={PAD_W} height={PAD_H} rx={6} className={boxClass} strokeWidth={1.5} />
      <text x={cx} y={cy + (sub ? -2 : 4)} textAnchor="middle" className={`${labelClass} text-[10px] font-semibold`}>
        {label}
      </text>
      {sub && (
        <text x={cx} y={cy + 12} textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">
          {sub}
        </text>
      )}
    </g>
  );
}

/**
 * A small chip-layout sketch for crosstalk: a target qubit being driven by
 * an intended pulse, with a faint/dashed coupling line to an adjacent
 * spectator qubit showing the same pulse leaking an unwanted rotation
 * (epsilon) onto it. Other qubits on the chip sit idle and unaffected,
 * making clear crosstalk is about physical proximity, not every qubit on
 * the device.
 */
export function CrosstalkDiagram({ ariaLabel }: { ariaLabel: string }) {
  return (
    <div className="not-prose overflow-x-auto panel-inset p-4">
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
        <text x={WIDTH / 2} y={16} textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">
          crosstalk: driving the target leaks onto a nearby spectator
        </text>

        {/* intended drive pulse, aimed only at the target */}
        <line x1={110} y1={28} x2={110} y2={105 - PAD_H / 2 - 2} className="stroke-brand" strokeWidth={2.5} markerEnd="url(#ct-arrow-brand)" />
        <text x={110} y={26} textAnchor="middle" className="fill-brand text-[9.5px] font-mono">
          drive pulse (intended)
        </text>

        {/* chip substrate */}
        <rect x={CHIP_X} y={CHIP_Y} width={CHIP_W} height={CHIP_H} rx={12} className="fill-surface stroke-border" strokeWidth={1} />
        <text x={CHIP_X + 10} y={CHIP_Y + 16} className="fill-muted-foreground text-[9px] font-mono">
          chip layout (top view)
        </text>

        {/* unwanted coupling: target leaks a small rotation onto the adjacent spectator */}
        <line
          x1={110 + PAD_W / 2}
          y1={105}
          x2={230 - PAD_W / 2}
          y2={105}
          className="stroke-muted-foreground"
          strokeWidth={1.5}
          strokeDasharray="3 3"
          opacity={0.75}
        />
        <text x={170} y={122} textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">
          unwanted leak
        </text>

        {PADS.map((p, i) => (
          <QubitPad key={i} {...p} />
        ))}

        <text x={CHIP_X} y={CHIP_Y + CHIP_H + 26} className="fill-muted-foreground text-[9.5px] font-mono">
          same pulse rotates the spectator by a small angle ε &mdash;
        </text>
        <text x={CHIP_X} y={CHIP_Y + CHIP_H + 38} className="fill-muted-foreground text-[9.5px] font-mono">
          the fidelity cost, F(ε) = cos&sup2;(ε/2), is worked out below
        </text>

        <defs>
          <marker id="ct-arrow-brand" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-brand" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
