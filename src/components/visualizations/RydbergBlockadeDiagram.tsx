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
          <text x={WIDTH / 2} y={18} textAnchor="middle" className="fill-muted-foreground text-[11px] font-mono">
            {blocked
              ? "Rydberg blockade: atom A's excitation suppresses atom B's"
              : "Beyond r_b: atom A's excitation no longer affects atom B"}
          </text>

          {/* blockade radius: the region around atom A where a second Rydberg
              excitation is suppressed. Drawn first so every other element
              paints on top of it. */}
          <circle cx={ATOM_A_X} cy={ATOM_Y} r={BLOCKADE_R} className="fill-none stroke-border" strokeWidth={1.25} strokeDasharray="4 4" />

          {/* laser driving both atoms' ground -> Rydberg transition */}
          <text x={(ATOM_A_X + atomBX) / 2} y={48} textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono">
            same laser addresses both atoms: ground &rarr; |r&#10217;
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
          <circle cx={ATOM_A_X} cy={ATOM_Y} r={6} className="fill-accent" />
          <text x={ATOM_A_X} y={ATOM_Y - ORBITAL_R - 12} textAnchor="middle" className="fill-accent text-[10px] font-semibold">
            atom A: excited to |r&#10217;
          </text>
          <text x={ATOM_A_X} y={ATOM_Y + 6} textAnchor="middle" className="fill-accent-foreground text-[8px] font-mono">
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
            r={6}
            className={blocked ? "fill-surface stroke-border" : "fill-accent"}
            strokeWidth={blocked ? 1.5 : undefined}
          />
          <text
            x={atomBX}
            y={ATOM_Y + 5}
            textAnchor="middle"
            className={blocked ? "fill-muted-foreground text-[8px] font-mono" : "fill-accent-foreground text-[8px] font-mono"}
          >
            B
          </text>
          <text
            x={atomBX}
            y={ATOM_Y - (blocked ? SUPPRESSED_R : ORBITAL_R) - 12}
            textAnchor="middle"
            className={blocked ? "fill-muted-foreground text-[10px] font-semibold" : "fill-accent text-[10px] font-semibold"}
          >
            {blocked ? "atom B: excitation blocked" : "atom B: excited to |r⟩"}
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
            y={ATOM_Y + 28}
            textAnchor="middle"
            className={blocked ? "fill-muted-foreground text-[9.5px] font-mono" : "fill-brand text-[9.5px] font-mono"}
          >
            separation = {separation.toFixed(0)}
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
            blockade radius r_b = {BLOCKADE_R}
          </text>

          <text x={ATOM_A_X - ORBITAL_R} y={ATOM_Y + ORBITAL_R + 46} className="fill-muted-foreground text-[9.5px] font-mono">
            {blocked
              ? "atom B sits within r_b, so its energy levels"
              : "atom B sits outside r_b, so its energy levels"}
          </text>
          <text x={ATOM_A_X - ORBITAL_R} y={ATOM_Y + ORBITAL_R + 58} className="fill-muted-foreground text-[9.5px] font-mono">
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
          className="w-full accent-[var(--brand)]"
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
