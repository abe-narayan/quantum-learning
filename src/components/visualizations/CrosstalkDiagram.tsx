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
        // The idle pads are data, not chrome: "crosstalk is about physical proximity,
        // not every qubit on the device" is an argument you can only make by *seeing*
        // the four unaffected qubits. Their outline is the only thing that draws them
        // (their fill is `--surface`, i.e. the panel colour), and on `stroke-border`
        // — 1.41:1 on `--surface-muted` — four sixths of the chip was effectively
        // blank. `stroke-axis` clears WCAG 2.1 SC 1.4.11's 3:1. The target and
        // spectator pads keep their semantic brand/accent strokes and stay louder.
        : "fill-surface stroke-axis";
  const labelClass = variant === "idle" ? "fill-muted-foreground" : variant === "target" ? "fill-brand" : "fill-accent";
  return (
    <g>
      <rect x={cx - PAD_W / 2} y={cy - PAD_H / 2} width={PAD_W} height={PAD_H} rx={6} className={boxClass} strokeWidth={1.5} />
      {/* 10 -> 12 and 9 -> 11 units. This 460-unit viewBox renders `w-full` into a
          ~256px column on a 320px phone, so a unit is ~0.56px and the old sizes came
          out at 5.6px and 5.0px — which of the six pads is the target and which is
          the spectator was unreadable, and that distinction is the figure. At 12,
          "spectator" is ~59 units and still fits the 70-unit pad. */}
      <text x={cx} y={cy + (sub ? -3 : 4)} textAnchor="middle" className={`${labelClass} text-[12px] font-semibold`}>
        {label}
      </text>
      {sub && (
        <text x={cx} y={cy + 12} textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">
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
        {/* Title 11 -> 12 units. Held at 12 rather than 13: this 58-character mono
            string is ~417 units wide at 12 and ~452 at 13, and the viewBox is 460 —
            13 would have left a 4-unit margin on each side and clipped on any
            fallback font with a wider advance. Moved from y=16 to y=14 so the taller
            "drive pulse (intended)" label below it has room. */}
        <text x={WIDTH / 2} y={14} textAnchor="middle" className="fill-muted-foreground text-[12px] font-mono">
          crosstalk: driving the target leaks onto a nearby spectator
        </text>

        {/* Intended drive pulse, aimed only at the target. The label grew 9.5 -> 12
            units (~5.3px -> ~6.7px on a 320px phone) and the arrow's tail dropped
            from y=28 to y=38 to keep clear of it. */}
        <line x1={110} y1={38} x2={110} y2={105 - PAD_H / 2 - 2} className="stroke-brand" strokeWidth={2.5} markerEnd="url(#ct-arrow-brand)" />
        <text x={110} y={32} textAnchor="middle" className="fill-brand text-[12px] font-mono">
          drive pulse (intended)
        </text>

        {/* Chip substrate. Deliberately left on `stroke-border`: unlike the qubit pads
            inside it, this rectangle carries no part of the argument — nothing is read
            off the substrate edge, and "these qubits share a chip" is already stated by
            the label sitting on it. It is the panel-edge case `--border` is for, and
            promoting it to `--axis` would have put a loud rectangle around the marks
            that actually matter. */}
        <rect x={CHIP_X} y={CHIP_Y} width={CHIP_W} height={CHIP_H} rx={12} className="fill-surface stroke-border" strokeWidth={1} />
        <text x={CHIP_X + 10} y={CHIP_Y + 16} className="fill-muted-foreground text-[11px] font-mono">
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
        />
        {/* The `opacity={0.75}` that used to sit on the coupling line is gone. The leak
            is the subject of the figure, not a background hint, and dimming it made the
            one mark the whole diagram exists to show the faintest thing in the frame.
            The dash pattern already carries "unwanted/parasitic" on its own — that was
            the intent the opacity was reaching for, and it costs no contrast.

            The label moved from y=122 to y=140: at 11 units it is ~86 units wide and,
            centred on x=170, its left end ran under the target pad, which extends to
            x=145 and down to y=128. y=140 clears both pad rows. */}
        <text x={170} y={140} textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">
          unwanted leak
        </text>

        {PADS.map((p, i) => (
          <QubitPad key={i} {...p} />
        ))}

        {/* 9.5 -> 12 units, with the leading opened from 12 to 15 to match. These two
            lines state the quantitative claim the lesson then works out, so they are
            the last thing that should be rendering at ~5.3px on a phone. At 12 the
            longer line is ~396 units of mono, inside the 460-unit box. */}
        <text x={CHIP_X} y={CHIP_Y + CHIP_H + 26} className="fill-muted-foreground text-[12px] font-mono">
          same pulse rotates the spectator by a small angle ε &mdash;
        </text>
        <text x={CHIP_X} y={CHIP_Y + CHIP_H + 41} className="fill-muted-foreground text-[12px] font-mono">
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
