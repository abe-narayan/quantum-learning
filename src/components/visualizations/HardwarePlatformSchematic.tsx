export type HardwarePlatformVariant = "superconducting" | "trapped-ion" | "neutral-atom" | "photonic" | "spin-qubit";

const WIDTH = 320;
const HEIGHT = 180;

/**
 * The three captions that used to be drawn as in-SVG `<text>`, one per
 * variant that has one. These are prose *about* the whole schematic
 * ("here is the concept this drawing demonstrates"), not a label pointing at
 * one part of it - each used to sit dead centre (`x=160`, the halfway point
 * of the 320-unit viewBox) rather than beside the element it named, which is
 * exactly what told them apart from `Label`'s other calls (see the `Label`
 * doc comment below). Superconducting and spin-qubit have no entry: every
 * piece of text in those two figures names one specific drawn part.
 *
 * Rendered as real HTML below the `<svg>`, at `text-xs` (12px), so they are
 * never subject to the viewBox's font-size floor at all, and land in the
 * accessibility tree as ordinary text rather than being pruned by the
 * figure's own `role="img"`.
 */
const CAPTION_BY_VARIANT: Partial<Record<HardwarePlatformVariant, string>> = {
  "trapped-ion": "linear ion chain (shared motional mode)",
  "neutral-atom": "optical tweezer array (filled traps highlighted)",
  photonic: "polarization encoding",
};

/**
 * A small, structurally-accurate (not decorative) schematic for each
 * physical qubit platform: the actual mechanism the lesson is describing,
 * not a generic "quantum computer" illustration. Kept intentionally
 * simple - a labeled diagram of the real physical structure, at the
 * level of detail a first pass through the platform-comparison lessons
 * needs, not an engineering drawing.
 */
export function HardwarePlatformSchematic({ variant, ariaLabel }: { variant: HardwarePlatformVariant; ariaLabel: string }) {
  const caption = CAPTION_BY_VARIANT[variant];
  return (
    <div className="not-prose">
      {/* `tabIndex={0}`. The note below this component already explains why this
          SVG is deliberately unresponsive - "Adding `w-full` here would scale
          these labels *down* to ~8px", so it keeps its intrinsic 320px width and
          "the `overflow-x-auto` wrapper takes the overflow on a narrower screen".
          That trade is right, but it was only ever honored for a mouse: an
          `overflow-x-auto` div is focusable by default in no browser except
          Firefox, so a keyboard-only reader got the left ~256px of a 320px
          schematic and no way to reach the right-hand labels (the tweezer array,
          the readout resonator - the parts that distinguish one platform from
          another). No `role`/`aria-label` on this inner wrapper: the `<svg>`
          inside already carries `role="img"` and the label, and naming both
          announces the figure twice. */}
      <div tabIndex={0} className="overflow-x-auto panel-inset p-3">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={ariaLabel}>
          {variant === "superconducting" && <SuperconductingSchematic />}
          {variant === "trapped-ion" && <TrappedIonSchematic />}
          {variant === "neutral-atom" && <NeutralAtomSchematic />}
          {variant === "photonic" && <PhotonicSchematic />}
          {variant === "spin-qubit" && <SpinQubitSchematic />}
        </svg>
      </div>
      {/* Real HTML, not SVG text: see CAPTION_BY_VARIANT. Not `aria-hidden` -
          it says something the caller's own `ariaLabel` on the `<svg>` above
          does not always spell out verbatim (e.g. "shared motional mode"),
          so it is additional content, not a duplicate announcement of the
          figure's name, the same distinction the wrapper note above draws for
          the inner `<div>`. */}
      {caption ? <p className="mt-1.5 text-center text-xs text-muted-foreground">{caption}</p> : null}
    </div>
  );
}

/**
 * 12 units, which is 12px: this SVG has no `w-full`, so it renders at its
 * intrinsic 320px and one unit is one CSS pixel. That is the whole reason the
 * size is written here rather than inherited. Elsewhere in this directory a
 * 10-unit label is a bug, because those figures do set `className="w-full"`
 * and a 460- or 480-unit viewBox shrinks to a ~256px phone column, turning 10
 * units into ~5.6px; adding `w-full` here would scale these *down*, so the
 * fixed width stays and the `overflow-x-auto` wrapper takes the overflow on
 * a narrower screen.
 *
 * This used to be 11, on the reasoning that the longest surviving label
 * ("RF electrode" at x=280) had to share the viewBox with the widest whole-
 * figure caption, still drawn in-SVG at the same size ("optical tweezer
 * array (filled traps highlighted)", 48 characters). That caption, and the
 * other two like it, moved out to real HTML below the `<svg>` (see
 * `CAPTION_BY_VARIANT` above): prose about the whole figure is not
 * positional, so it does not have to live inside the drawing's own
 * font-size floor. With the 48-character string gone, the binding
 * constraint changed, so this was re-measured rather than assumed still
 * binding - **in Chrome via CDP (`Element.getBBox`), not estimated** - over
 * the capstone lesson page, which renders all five variants and every
 * remaining label on one page:
 *
 *   12px   widest remaining label "field oscillation, head-on", 187.2 units,
 *          left 111.4 / right 298.6 of 320 - comfortably inside
 *   12px   "RF electrode" at the old x=280: right edge 321.2 of 320 - clipped
 *   12px   "RF electrode" at x=275 (moved, see TrappedIonSchematic): right
 *          edge 318.2 of 320 - inside, 1.8 units clear
 *
 * So every remaining label clears 12px, and the only adjustment 12px forced
 * was moving "RF electrode" 5 units left. If a label longer than "field
 * oscillation, head-on" (187 units at 12px) is ever added to this file,
 * re-measure again rather than assuming it still fits - the same CDP script
 * this note was produced with works for any figure in this tree: open the
 * page, `querySelectorAll('svg[role="img"] text')`, and read `getBBox()`.
 */
function Label({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" className="fill-muted-foreground text-[12px] font-mono">
      {children}
    </text>
  );
}

function SuperconductingSchematic() {
  return (
    <g>
      {/* Substrate. Kept on `stroke-border` on purpose: it is already drawn by its
          `--surface` fill standing against the darker `panel-inset` ground, so the
          stroke here is a panel edge and nothing else - nothing in the schematic is
          measured against it, and the qubit structure on top carries the content.
          `--axis` is for marks a reader must perceive; promoting a filled container
          to it would put a loud rectangle around the two things that matter. */}
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
      {/* x=275, not 280. Measured in Chrome (getBBox, not estimated) at the
          current 12px: "RF electrode" is 86.41 units wide, and at x=280
          `textAnchor="middle"` puts its right edge at 321.2 of a 320-unit
          viewBox - clipped, silently, since the outer `<svg>` has no
          scrollbar of its own. Five units left brings the right edge to
          318.2, 1.8 units clear; imperceptible against a rail that runs from
          20 to 300. See `Label`. */}
      <Label x={275} y={26}>
        RF electrode
      </Label>
      <Label x={275} y={162}>
        RF electrode
      </Label>
      {/* DC endcaps. Added 2026-08-30: the figure previously drew only the two
          RF rails, which reads as "the oscillating field does the whole job".
          It does not. In a linear Paul trap the RF pseudopotential confines the
          ions *radially*; along the trap axis the confinement is electrostatic,
          from a pair of DC endcap electrodes at either end. That is not an
          Earnshaw violation, because the RF is covering the other two
          directions. It is also the axial mode those endcaps define that an
          entangling gate usually drives, so the omission hid the very degree of
          freedom the label beneath the chain names. */}
      <rect x={26} y={62} width={14} height={46} rx={3} className="fill-surface stroke-brand" strokeWidth={1.5} />
      <rect x={280} y={62} width={14} height={46} rx={3} className="fill-surface stroke-brand" strokeWidth={1.5} />
      <Label x={33} y={124}>
        DC
      </Label>
      <Label x={287} y={124}>
        DC
      </Label>
      {ionXs.map((x, i) => (
        <circle key={i} cx={x} cy={85} r={9} className="fill-accent" />
      ))}
      {/* The trap axis threading the ion chain. Load-bearing: it is what the label
          directly beneath it names, and "the ions share one motional mode" - the
          physical fact this schematic exists to show - is carried by the line that
          joins them. On `stroke-border` (1.41:1 on `--surface-muted`) the ions read as
          five unrelated dots. `stroke-axis` clears WCAG 2.1 SC 1.4.11's 3:1. */}
      <line x1={70} y1={85} x2={270} y2={85} className="stroke-axis" strokeWidth={1} strokeDasharray="2 3" />
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
                // The empty traps are half the information: the label says "filled
                // traps highlighted", which is a claim about the *contrast* between
                // loaded and unloaded sites, so a reader who cannot see the unloaded
                // ones cannot see stochastic loading at all - they just see six atoms
                // in an odd arrangement. `stroke-border` (1.41:1 on `--surface-muted`)
                // left nine of the fifteen sites effectively blank; `stroke-axis`
                // clears WCAG 2.1 SC 1.4.11's 3:1 while the filled traps stay louder
                // by virtue of being solid `--accent`.
                className={isLoaded ? "fill-accent" : "fill-surface stroke-axis"}
                strokeWidth={1}
              />
            </g>
          );
        })
      )}
    </g>
  );
}

function PhotonicSchematic() {
  // A single beam (one physical path) traveling left to right. Polarization
  // isn't which route the photon takes - it's the orientation of the field's
  // oscillation plane, transverse to travel. That's shown as a head-on
  // cross-section of the SAME beam: two perpendicular double-headed arrows
  // (H and V), not two separate bent paths.
  return (
    <g>
      <circle cx={36} cy={100} r={4} className="fill-foreground" />
      <line x1={36} y1={100} x2={290} y2={100} className="stroke-brand" strokeWidth={2.5} markerEnd="url(#photon-travel-arrow)" />
      <Label x={110} y={122}>
        photon travels &rarr;
      </Label>

      {/* head-on view of the same beam: field oscillation plane */}
      {/* Kept on `stroke-border`: this dashed circle is a viewport, not a measurement.
          It says "what follows is drawn head-on", and the two double-headed arrows
          inside it are the whole content - nothing is read off the circle's edge, and
          its `--surface` fill already separates it from the beam line behind it. */}
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
      {/* Substrate, same reasoning as the superconducting one: a filled container, not
          a mark anything is measured against, so it stays on the panel-edge token. */}
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
