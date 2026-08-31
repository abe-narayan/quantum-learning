/*
 * SIZING, RECOMPUTED FROM THE REAL BOX
 * ------------------------------------
 * This SVG renders `w-full` inside `panel-inset p-4`. On a 320px phone the
 * real box is 320 - 32 (Container `px-4`) = 288, less 2 x (16px padding +
 * 1px border) = **254px**, so one viewBox unit paints at 254/460 = 0.5522px.
 * The previous pass raised the labels to 11-12 units against a "~256px"
 * column and recorded them as fixed; 12 x 0.5522 = 6.63px, still far under
 * the ~9px legibility floor. 17 units is the first size that clears it
 * (17 x 0.5522 = 9.39px), and every remaining in-SVG string is written to
 * fit at 17.
 *
 * The budget that follows from that: monospace advance is ~0.6 x font size,
 * so 17-unit type is 10.2 units per character and a full-width line holds
 * 460 / 10.2 = **45 characters**. SVG silently clips what overruns a
 * viewBox, so every string here is counted against that budget, not eyeballed.
 *
 * The title ("crosstalk: the drive leaks to a neighbour") and the closing
 * two-line conclusion ("the leak reaches the nearest neighbour only" /
 * "fidelity cost...") used to be drawn against this same 17-unit budget even
 * though 9.39px is still under the 12px floor `scripts/audit/responsive.mjs`
 * holds *running text* to (as opposed to the short positional labels this
 * figure is otherwise made of, which the audit treats as the design system's
 * metadata voice). Both are prose about the figure as a whole, not a label
 * pointing at one part of it, exactly the distinction
 * `HardwarePlatformSchematic` draws for its own former in-SVG caption - so
 * both now render as real HTML at `text-xs` (12px) beside the `<svg>`
 * instead, which also means they no longer compete for the same 45-character
 * budget as the positional labels.
 *
 * WHY THE LAYOUT IS A CHAIN AND NOT A GRID
 * ----------------------------------------
 * The old figure drew a 3x2 grid: target at (110, 105), spectator at
 * (230, 105), and an "idle" pad directly below the target at (110, 190).
 * Column pitch was 120 units and row pitch 85, so the pad the figure
 * labelled *unaffected* was the target's NEAREST neighbour and the pad it
 * labelled *spectator* was 41% farther away. The lesson's claim is "only the
 * physically nearby spectator picks up the leak ... which is why crosstalk
 * is a proximity effect", and the drawing contradicted it.
 *
 * A one-dimensional chain removes the contradiction rather than papering
 * over it: with four qubits on a uniform pitch, "nearest neighbour" is
 * unambiguous, and it matches the real 11-qubit chain shown in this same
 * lesson's micrograph. Only the target is driven, so only the target's
 * neighbour sees the drive field - Q2 and Q3 are coupled to their own
 * neighbours but nothing is driving them.
 */

const WIDTH = 460;
// 224, not 268: the two-line conclusion that used to occupy y=232..256 now
// renders as HTML below the figure (see CrosstalkDiagram), so the viewBox's
// lowest content is the chip's bottom edge at CHIP_Y + CHIP_H = 204, plus 20
// units of bottom padding to match the 20-unit top margin the title used to sit in.
const HEIGHT = 224;

const CHIP_X = 14;
const CHIP_Y = 96;
const CHIP_W = 432;
const CHIP_H = 108;

const PAD_W = 64;
const PAD_H = 52;
const PAD_CY = 146;

/** Uniform 112-unit pitch: the whole point is that neighbour distance is equal along the chain. */
const PAD_CXS = [66, 178, 290, 402];

type Variant = "target" | "spectator" | "idle";

type Pad = {
  cx: number;
  /** What this qubit is actually being rotated by, drawn inside the pad. */
  gate: string;
  name: string;
  variant: Variant;
};

const PADS: Pad[] = [
  { cx: PAD_CXS[0], gate: "X", name: "target", variant: "target" },
  { cx: PAD_CXS[1], gate: "R(ε)", name: "spectator", variant: "spectator" },
  { cx: PAD_CXS[2], gate: "", name: "idle", variant: "idle" },
  { cx: PAD_CXS[3], gate: "", name: "idle", variant: "idle" },
];

function QubitPad({ cx, gate, name, variant }: Pad) {
  const boxClass =
    variant === "target"
      ? "fill-brand/20 stroke-brand"
      : variant === "spectator"
        ? "fill-accent/15 stroke-accent"
        // The idle pads are data, not chrome: "crosstalk is about physical
        // proximity, not every qubit on the device" is an argument you can only
        // make by *seeing* the untouched qubits. Their outline is the only thing
        // that draws them (their fill is `--surface`, the panel colour), and on
        // `stroke-border` (1.41:1 on `--surface-muted`) half the chain was
        // effectively blank. `stroke-axis` clears WCAG 2.1 SC 1.4.11's 3:1. The
        // target and spectator keep their semantic brand/accent strokes and stay
        // louder.
        : "fill-surface stroke-axis";
  const textClass = variant === "target" ? "fill-brand" : variant === "spectator" ? "fill-accent" : "fill-muted-foreground";
  return (
    <g>
      <rect x={cx - PAD_W / 2} y={PAD_CY - PAD_H / 2} width={PAD_W} height={PAD_H} rx={8} className={boxClass} strokeWidth={1.5} />
      {gate && (
        // The gate each qubit actually receives, which is the quantity the lesson
        // then works out: an intended X on the target, an unintended R(ε) on its
        // neighbour, nothing at all further down the chain. "R(ε)" is 4 characters
        // = 41 units at 17, inside the 64-unit pad.
        <text x={cx} y={PAD_CY + 6} textAnchor="middle" fontSize={17} className={`${textClass} font-mono font-semibold`}>
          {gate}
        </text>
      )}
      {/* Names sit *below* the pads rather than inside them: "spectator" is 9
          characters = 92 units at 17 and a pad wide enough to hold it would not
          leave room for four of them across a 460-unit box. Below the pads the
          only constraint is the 112-unit pitch, which 92 clears. Baseline 192 puts
          descenders at 196, inside the chip's bottom edge at 204. */}
      <text x={cx} y={192} textAnchor="middle" fontSize={17} className={`${textClass} font-mono`}>
        {name}
      </text>
    </g>
  );
}

/**
 * A chip-layout sketch for crosstalk: four qubits on a uniform-pitch chain,
 * one of them driven by an intended pulse, with the drive field spilling
 * sideways onto its immediate neighbour as an unwanted small rotation
 * (epsilon). The two qubits further down the chain are coupled exactly like
 * the first two but are not being driven, so nothing leaks onto them, which
 * is what makes crosstalk a proximity effect rather than a device-wide one.
 */
export function CrosstalkDiagram({ ariaLabel }: { ariaLabel: string }) {
  return (
    // The title and the closing two-line conclusion used to be `<text>`
    // inside the SVG, sized to the same 17-unit budget as every positional
    // label in this figure even though neither one points at a specific
    // part of the drawing - both are prose about the figure as a whole
    // ("crosstalk: the drive leaks to a neighbour" / "the leak reaches the
    // nearest neighbour only"), the same shape as the caption
    // `HardwarePlatformSchematic` used to draw in-SVG. Real HTML at a real
    // 12px (`text-xs`), same as that component's fix, rather than a 17-unit
    // budget that still measured 9.39px effective on a 320px phone and, for
    // these two strings specifically, is running text over 40 characters -
    // exactly what `scripts/audit/responsive.mjs`'s tiny-text check flags.
    // The positional labels ("probe tone in", "readout resonator", pad
    // names) stay in the SVG: each is short (under the 40-character running-
    // text threshold) and sits beside the specific element it names.
    <div className="not-prose space-y-1.5">
      <p className="text-xs text-muted-foreground">crosstalk: the drive leaks to a neighbour</p>
      <div className="overflow-x-auto panel-inset p-4">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" role="img" aria-label={ariaLabel}>
          {/* Intended drive, aimed only at the target. Left-anchored at x=18 rather
              than centred on the arrow: centred, its 143 units would start at -5 and
              lose their first glyph off the viewBox. */}
          <text x={18} y={50} fontSize={17} className="fill-brand font-mono">
            intended drive
          </text>
          <line
            x1={PAD_CXS[0]}
            y1={58}
            x2={PAD_CXS[0]}
            y2={PAD_CY - PAD_H / 2 - 2}
            className="stroke-brand"
            strokeWidth={2.5}
            markerEnd="url(#ct-arrow-brand)"
          />

          {/* Chip substrate. Deliberately left on `stroke-border`: unlike the qubit
              pads inside it, this rectangle carries no part of the argument - nothing
              is read off the substrate edge, and "these qubits share a chip" is
              already stated by the label beside it. It is the panel-edge case
              `--border` exists for, and promoting it to `--axis` would put a loud
              rectangle around the marks that actually matter. */}
          <rect x={CHIP_X} y={CHIP_Y} width={CHIP_W} height={CHIP_H} rx={12} className="fill-surface stroke-border" strokeWidth={1} />
          {/* Right-anchored so it cannot run under the drive arrow at x=66: 23
              characters = 235 units ending at 446, so it starts at 211. */}
          <text x={CHIP_X + CHIP_W} y={90} textAnchor="end" fontSize={17} className="fill-muted-foreground font-mono">
            chain of coupled qubits
          </text>

          {/* The three couplers are identical by construction. That uniformity is the
              argument: nothing about Q1-Q2 or Q2-Q3 differs from Q0-Q1, so what
              singles out the spectator is not the coupling but the fact that its
              neighbour is the one being driven. `stroke-axis` because a reader who
              cannot see that the chain is uniformly coupled cannot read the figure. */}
          {PAD_CXS.slice(0, -1).map((cx, i) => (
            <line
              key={i}
              x1={cx + PAD_W / 2}
              y1={PAD_CY}
              x2={PAD_CXS[i + 1] - PAD_W / 2}
              y2={PAD_CY}
              className="stroke-axis"
              strokeWidth={1.5}
            />
          ))}

          {/* The leak. Drawn as an arc off the drive line rather than along the
              coupler, because that is what it physically is: the drive pulse's field
              is not perfectly localised and spills sideways onto whatever is nearest.
              Routing it along the coupler would have said the leak travels through
              the coupler, which is a different (and here wrong) mechanism.

              Quadratic Bezier M74,104 Q130,86 178,118 has its apex at
              ((74 + 2*130 + 178)/4, (104 + 2*86 + 118)/4) = (128, 98.5), which clears
              the label above it (descenders at 84) by 14 units and lands on the top
              edge of the spectator pad at y=120.

              No `opacity` on it. The leak is the subject of the figure, not a
              background hint, and dimming it made the one mark the whole diagram
              exists to show the faintest thing in the frame. The dash pattern already
              carries "unwanted/parasitic", and it costs no contrast. */}
          <path
            d={`M${PAD_CXS[0] + 8},104 Q130,86 ${PAD_CXS[1]},${PAD_CY - PAD_H / 2 - 2}`}
            fill="none"
            className="stroke-accent"
            strokeWidth={2}
            strokeDasharray="4 3"
            markerEnd="url(#ct-arrow-accent)"
          />
          <text x={130} y={80} textAnchor="middle" fontSize={17} className="fill-accent font-mono">
            leak ε
          </text>

          {PADS.map((p) => (
            <QubitPad key={p.cx} {...p} />
          ))}

          <defs>
            <marker id="ct-arrow-brand" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" className="fill-brand" />
            </marker>
            <marker id="ct-arrow-accent" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" className="fill-accent" />
            </marker>
          </defs>
        </svg>
      </div>
      {/* The quantitative claim the lesson then works out, moved out of the
          SVG for the same reason as the title above: "the leak reaches the
          nearest neighbour only" is 44 characters of running text that
          measured 9.39px effective in-SVG. */}
      <p className="text-xs text-muted-foreground">
        The leak reaches the nearest neighbour only. Fidelity cost: F(ε) = cos&sup2;(ε/2).
      </p>
    </div>
  );
}
