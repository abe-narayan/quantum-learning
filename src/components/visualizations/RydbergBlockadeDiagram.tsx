"use client";

import { useId, useState } from "react";

// WIDTH and ATOM_A_X are chosen together so the (fixed-radius) blockade
// circle never touches the viewBox edges: its leftmost point sits at
// ATOM_A_X - BLOCKADE_R, which must stay comfortably >= 0, and its
// rightmost point (plus atom B's orbital at max separation) must stay
// comfortably <= WIDTH.
const WIDTH = 520;
const HEIGHT = 400;

const ATOM_A_X = 175;
const ATOM_Y = 220;

const ORBITAL_R = 55;
const BLOCKADE_R = 165;
const SUPPRESSED_R = 24;

// Separation range the slider sweeps atom B across. The minimum sits well
// inside the blockade radius (clearly suppressed); the maximum sits well
// outside it (clearly allowed), so dragging across the full range always
// crosses the boundary at separation = BLOCKADE_R.
const MIN_SEPARATION = 70;
const MAX_SEPARATION = 250;
// Matches the diagram's original fixed separation (ATOM_B_X - ATOM_A_X =
// 130), which sat inside the blockade radius -- so the default, no-drag
// view still reads exactly as the suppressed case it always used to show.
const DEFAULT_SEPARATION = 130;

/**
 * Rydberg blockade, the neutral-atom two-qubit gate mechanism: exciting one
 * atom to a Rydberg state expands its electron orbital enormously, which
 * shifts a nearby atom's energy levels strongly enough that IT can no
 * longer be excited to the same Rydberg state at the same time -- but only
 * if that nearby atom sits within the blockade radius r_b. Atom A (left) is
 * shown mid-excitation with its expanded orbital and the blockade radius it
 * creates; atom B (right) can be dragged closer or farther via the
 * separation slider, crossing r_b to see its excitation attempt flip
 * between suppressed (dimmed/dashed) and allowed (a full Rydberg orbital of
 * its own), making the distance-dependence of the blockade tangible rather
 * than asserted.
 */
export function RydbergBlockadeDiagram({ ariaLabel }: { ariaLabel: string }) {
  const idBase = useId();
  const [separation, setSeparation] = useState(DEFAULT_SEPARATION);
  const atomBX = ATOM_A_X + separation;
  const blocked = separation < BLOCKADE_R;

  const stateDescription = blocked
    ? `atom B is ${separation.toFixed(0)} units from atom A, inside the blockade radius of ${BLOCKADE_R}, so its excitation is suppressed`
    : `atom B is ${separation.toFixed(0)} units from atom A, outside the blockade radius of ${BLOCKADE_R}, so it excites to |r⟩ normally, unaffected by atom A`;

  return (
    <div className="not-prose space-y-3 panel-inset p-4">
      <div className="overflow-x-auto">
        <svg
          width={WIDTH}
          height={HEIGHT}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full"
          role="img"
          aria-label={`${ariaLabel}. ${stateDescription}.`}
        >
          {/* THE SCALE FACTOR HERE WAS WRONG, AND EVERY SIZE BELOW WITH IT.
              The previous note divided by a "~288px lesson column". 288px is
              the *page column* on a 320px phone (320 less Container's `px-4`
              gutters), but this SVG renders into `panel-inset p-4`, and
              `panel-inset` (globals.css) supplies border, radius and fill and
              no padding — the `p-4` does. The real box is 288 − 2 × (16px
              padding + 1px border) = **254px**, so the scale is 254/520 =
              0.4885 and every figure in the old note was ~13% optimistic.

              Corrected: the 15 and 16 unit sizes the last pass installed
              painted at **7.33px and 7.82px**, still under the ~9px floor it
              was trying to clear. 19 and 20 units give 9.28px and 9.77px.

              Four strings had to change again, because 19-unit mono is 11.4
              units per character and the 520-unit viewBox holds ~45 of them
              edge to edge — and SVG silently CLIPS what overruns a viewBox,
              it does not scroll it. Each shortening is noted where it
              happens; none of them drops a fact the drawing does not already
              make. */}
          <text x={WIDTH / 2} y={22} textAnchor="middle" fontSize={20} className="fill-axis font-mono">
            {/* The blocked branch was 45 characters = 540 units at 20 — 20
                units wider than the whole viewBox, so it was clipped at both
                ends. The 32 kept are 384 units, centred at 260, so 68..452.
                What was dropped ("'s excitation") is what the suppressed
                orbital under this caption is already showing. */}
            {blocked
              ? "Rydberg blockade: A suppresses B"
              : "Beyond r_b: A no longer affects B"}
          </text>

          {/* blockade radius: the region around atom A where a second Rydberg
              excitation is suppressed. Drawn first so every other element
              paints on top of it. */}
          {/* r_b, the blockade radius. This is the figure's threshold line:
              the entire lesson point is whether atom B falls inside or
              outside THIS circle, so it is the most load-bearing mark on the
              canvas — and it was drawn in `--border`, the panel-edge token,
              measured at 1.41:1 on `--surface-muted` against the 3:1 WCAG
              2.1 SC 1.4.11 floor. `--axis` clears 3:1 on every panel depth
              in both themes. */}
          <circle cx={ATOM_A_X} cy={ATOM_Y} r={BLOCKADE_R} className="fill-none stroke-axis" strokeWidth={1.5} strokeDasharray="4 4" />

          {/* laser driving both atoms' ground -> Rydberg transition */}
          {/* Centred on the viewBox, not on the midpoint between the atoms.
              This caption is about both atoms equally, and at 19 units it is
              38 characters = 433 units wide, so half of it is 217. Atom B is
              draggable, so the old midpoint anchor swept between x = 210 (at
              minimum separation) and x = 300 — at 210 the string started at
              −7 and its first characters were clipped away. Anchoring at
              WIDTH/2 = 260 puts it at 43..477 at every separation. */}
          <text x={WIDTH / 2} y={54} textAnchor="middle" fontSize={19} className="fill-axis font-mono">
            same laser on both atoms: ground &rarr; |r&#10217;
          </text>
          <line
            x1={ATOM_A_X}
            y1={60}
            x2={ATOM_A_X}
            y2={ATOM_Y - ORBITAL_R - 6}
            className="stroke-brand"
            strokeWidth={2}
            markerEnd={`url(#${idBase}-arrow-brand)`}
          />
          <line
            x1={atomBX}
            y1={60}
            x2={atomBX}
            y2={ATOM_Y - (blocked ? SUPPRESSED_R : ORBITAL_R) - 6}
            className={blocked ? "stroke-muted-foreground" : "stroke-brand"}
            strokeWidth={blocked ? 1.5 : 2}
            strokeDasharray={blocked ? "3 3" : undefined}
            opacity={blocked ? 0.6 : 1}
            markerEnd={`url(#${idBase}-arrow-${blocked ? "muted" : "brand"})`}
          />

          {/* atom A: successfully excited, enormous Rydberg orbital */}
          <circle cx={ATOM_A_X} cy={ATOM_Y} r={ORBITAL_R} className="fill-accent/15 stroke-accent" strokeWidth={1.5} />
          {/* Core radius 6 -> 11 -> 13, tracking the letter inside it: the
              "A"/"B" glyphs went 8 -> 15 -> 19 units, and a glyph whose cap
              height is ~13.5 units needs more than an 11-unit radius around
              it or it crowds the fill edge. 13 still sits well inside
              SUPPRESSED_R (24) and ORBITAL_R (55), so nothing else moves. */}
          <circle cx={ATOM_A_X} cy={ATOM_Y} r={13} className="fill-accent" />
          <text x={ATOM_A_X} y={ATOM_Y - ORBITAL_R - 14} textAnchor="middle" fontSize={19} className="fill-accent font-semibold">
            A: excited to |r&#10217;
          </text>
          <text x={ATOM_A_X} y={ATOM_Y + 7} textAnchor="middle" fontSize={19} className="fill-accent-foreground font-mono">
            A
          </text>

          {/* atom B: excitation attempt is suppressed inside r_b, or
              succeeds (its own full Rydberg orbital) outside r_b */}
          {blocked ? (
            <circle
              cx={atomBX}
              cy={ATOM_Y}
              r={SUPPRESSED_R}
              className="fill-muted-foreground/10 stroke-muted-foreground"
              strokeWidth={1.25}
              strokeDasharray="2 3"
              opacity={0.7}
            />
          ) : (
            <circle cx={atomBX} cy={ATOM_Y} r={ORBITAL_R} className="fill-accent/15 stroke-accent" strokeWidth={1.5} />
          )}
          <circle
            cx={atomBX}
            cy={ATOM_Y}
            r={13}
            className={blocked ? "fill-surface stroke-axis" : "fill-accent"}
            strokeWidth={blocked ? 1.5 : undefined}
          />
          <text
            x={atomBX}
            y={ATOM_Y + 7}
            textAnchor="middle"
            fontSize={19}
            className={blocked ? "fill-foreground font-mono" : "fill-accent-foreground font-mono"}
          >
            B
          </text>
          <text
            x={atomBX}
            y={ATOM_Y - (blocked ? SUPPRESSED_R : ORBITAL_R) - 14}
            textAnchor="middle"
            fontSize={19}
            className={blocked ? "fill-axis font-semibold" : "fill-accent font-semibold"}
          >
            {/* "B: excited to |r⟩" is 17 characters = 194 units at 19, and
                this label is centred on the draggable atom. The unblocked
                branch only appears past r_b, where atomBX runs out to 425, so
                the label would have ended at 522 and lost its last glyph off
                the right edge. "B: excited" is 114 units, ending at 482, and
                the ket it is excited *to* is already named twice above — in
                the laser caption and on atom A. */}
            {blocked ? "B: blocked" : "B: excited"}
          </text>

          {/* live separation readout, spanning the gap between the atoms */}
          <line
            x1={ATOM_A_X}
            y1={ATOM_Y + 14}
            x2={atomBX}
            y2={ATOM_Y + 14}
            className={blocked ? "stroke-muted-foreground" : "stroke-brand"}
            strokeWidth={1}
          />
          <text
            x={(ATOM_A_X + atomBX) / 2}
            y={ATOM_Y + 30}
            textAnchor="middle"
            fontSize={19}
            className={blocked ? "fill-axis font-mono" : "fill-brand font-mono"}
          >
            separation = {separation.toFixed(0)}
          </text>

          {/* blockade radius callout, anchored on the dashed circle itself */}
          <line
            x1={ATOM_A_X}
            y1={ATOM_Y}
            x2={ATOM_A_X + BLOCKADE_R * Math.cos(-0.55)}
            y2={ATOM_Y + BLOCKADE_R * Math.sin(-0.55)}
            className="stroke-axis"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
          <text
            x={ATOM_A_X + BLOCKADE_R * Math.cos(-0.55) + 6}
            y={ATOM_Y + BLOCKADE_R * Math.sin(-0.55) - 4}
            fontSize={19}
            className="fill-axis font-mono"
          >
            r_b = {BLOCKADE_R}
          </text>

          {/* x moved from ATOM_A_X - ORBITAL_R (= 120) to 12, and the
              leading "atom B" trimmed to "B". Left-aligned at 120, the longer
              branch ("atom B sits outside r_b, so its energy levels", 44
              characters = 502 units at 19) would have ended at 622 — 102
              units past the viewBox, with most of the sentence clipped away.
              At x = 12 the trimmed 40-character version runs 12..468, which
              leaves enough room that a wide fallback face cannot push it off
              the edge. The pair no longer sits under atom A specifically,
              which is right: it describes atom B. */}
          <text x={12} y={ATOM_Y + ORBITAL_R + 56} fontSize={19} className="fill-axis font-mono">
            {blocked
              ? "B sits within r_b, so its energy levels"
              : "B sits outside r_b, so its energy levels"}
          </text>
          <text x={12} y={ATOM_Y + ORBITAL_R + 82} fontSize={19} className="fill-axis font-mono">
            {blocked
              ? "are shifted off resonance with the laser"
              : "are unaffected -- it excites normally"}
          </text>

          <defs>
            <marker id={`${idBase}-arrow-brand`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" className="fill-brand" />
            </marker>
            <marker id={`${idBase}-arrow-muted`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" className="fill-muted-foreground" opacity={0.6} />
            </marker>
          </defs>
        </svg>
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={`${idBase}-separation`} className="text-sm text-foreground">
            Atom B separation
          </label>
          <span className="font-mono text-xs text-muted-foreground">
            r = {separation.toFixed(0)} ({blocked ? "< r_b, blocked" : "> r_b, allowed"})
          </span>
        </div>
        <input
          id={`${idBase}-separation`}
          type="range"
          min={MIN_SEPARATION}
          max={MAX_SEPARATION}
          step={1}
          value={separation}
          onChange={(event) => setSeparation(Number(event.target.value))}
          // `h-11` (44px) touch target — a range input centres its track in
          // whatever height it gets, so only the hit area changes (it was the
          // browser default ~16px). `accent-brand` rather than the raw
          // `accent-[var(--brand)]` arbitrary value: `--color-brand` is
          // already registered in the Tailwind v4 theme, so the utility
          // exists, and every other slider in this directory uses it.
          className="h-11 w-full accent-brand"
          aria-label="Distance between atom B and atom A"
          aria-valuetext={`separation = ${separation.toFixed(0)}, ${blocked ? "inside" : "outside"} the blockade radius`}
        />
        <p className="text-xs text-muted-foreground">
          Drag the slider to move atom B closer to or farther from atom A. Inside the blockade
          radius r_b, atom B&rsquo;s excitation is suppressed; drag past r_b and atom B excites to
          |r&#10217; just like atom A &mdash; the blockade is a distance-limited effect, not a
          property of the atoms themselves.
        </p>
      </div>
    </div>
  );
}
