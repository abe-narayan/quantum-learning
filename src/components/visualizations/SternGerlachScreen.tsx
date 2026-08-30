"use client";

import { useId } from "react";
import { PresetToggle } from "./PresetToggle";
import { useFrameIndex } from "./useFrameIndex";

const WIDTH = 480;
const HEIGHT = 220;

const EXIT_X = 260;
const EXIT_Y = 110;
const SCREEN_X = 408;
const SCREEN_WIDTH = 20;
const SCREEN_TOP = 40;
const SCREEN_BOTTOM = 180;
const SCREEN_CENTER_Y = (SCREEN_TOP + SCREEN_BOTTOM) / 2;

// The two discrete outcome positions on the screen for the "actual result"
// view, symmetric about the beam's undeflected centerline.
const UP_Y = 70;
const DOWN_Y = 150;

// A fan of paths spanning the full screen height, used only for the
// "classical prediction" view, to suggest a continuous spread rather than
// two discrete outcomes.
const CLASSICAL_FAN_YS = [50, 65, 80, 95, 110, 125, 140, 155, 170];

const modes = [
  {
    label: "Classical prediction",
    caption: "A classical magnetic moment, pointing every which way at random, should smear continuously across the screen.",
  },
  {
    label: "Actual result",
    caption: "Stern and Gerlach's silver atoms landed in exactly two spots, with nothing in between.",
  },
];

function Label({ x, y, children }: { x: number; y: number; children: string }) {
  // This SVG carries an intrinsic `width` and no `w-full`, so it renders at
  // its natural 480 units inside `overflow-x-auto` and the viewBox scale is
  // 1.0 — 10 authored units was a literal 10px, on the legibility floor
  // rather than under it, which is why these needed only a nudge to 12
  // rather than the ~2x other figures in this directory required.
  // `fill-axis` replaces `fill-muted-foreground`: these name the apparatus
  // (oven, poles, screen) and are read as part of the figure, not as caption
  // prose.
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={12} className="fill-axis font-mono">
      {children}
    </text>
  );
}

/**
 * A schematic of the original 1922 Stern-Gerlach apparatus — an atom beam
 * passing through an inhomogeneous magnet onto a screen — toggled between
 * what classical physics predicted (a continuous smear) and what was
 * actually observed (exactly two discrete spots). Purely conceptual: no
 * physics computation backs the two views, just the qualitative shapes the
 * lesson's opening claim describes.
 */
export function SternGerlachScreen({ ariaLabel }: { ariaLabel: string }) {
  const { index, setIndex, frame: mode } = useFrameIndex(modes);
  const isActual = index === 1;
  // `useId()` rather than a literal id string. Two instances of this figure
  // on one page emitted duplicate ids, which is invalid HTML and leaves
  // every reference ambiguous: an `id` lookup resolves to the first match in
  // document order, so the second instance's references silently pointed at
  // the first instance's element. Harmless while both are identical, wrong
  // the moment they are not. Matches `ProjectionShadow`, which already does
  // this.
  const idBase = useId();

  return (
    <div className="not-prose space-y-4 panel-inset p-4">
      <PresetToggle options={modes} index={index} onChange={setIndex} ariaLabel={ariaLabel} />

      {/* `tabIndex={0}`. The comment on `Label` above already establishes what
          makes this necessary: this SVG "renders at its natural 480 units
          inside `overflow-x-auto` and the viewBox scale is 1.0" — it is 480
          real pixels wide with no `w-full` to shrink it, against a ~256px
          content box on a 320px phone, so this wrapper is scrolled on every
          phone and most tablets. A scroll container is focusable by default
          only in Firefox, so without this a keyboard-only reader saw the oven
          and the magnet poles and could never reach the screen at the right
          end — which is the entire result the apparatus exists to produce.
          No `role`/`aria-label` on the wrapper: the `<svg>` is already
          `role="img"` with the mode-specific label, and naming this too would
          announce the figure twice (the same call `rehypeKatexHtml.mjs` makes
          for display math). */}
      <div tabIndex={0} className="overflow-x-auto">
        <svg
          width={WIDTH}
          height={HEIGHT}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`${ariaLabel}: ${mode.label}. ${mode.caption}`}
        >
          <defs>
            <radialGradient id={`${idBase}-classical-smear`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.5} />
              <stop offset="55%" stopColor="var(--brand)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
            </radialGradient>
            <marker id={`${idBase}-beam-arrow`} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" className="fill-foreground" />
            </marker>
          </defs>

          {/* source */}
          <circle cx={40} cy={EXIT_Y} r={10} className="fill-surface stroke-foreground" strokeWidth={1.5} />
          <Label x={40} y={140}>
            Ag oven
          </Label>

          {/* incoming beam */}
          <line
            x1={50}
            y1={EXIT_Y}
            x2={146}
            y2={EXIT_Y}
            className="stroke-foreground"
            strokeWidth={2}
            markerEnd={`url(#${idBase}-beam-arrow)`}
          />

          {/* inhomogeneous magnet: knife-edge N pole above, wide U-shaped S pole below */}
          <path
            d="M 150 60 L 250 60 L 250 90 L 200 100 L 150 90 Z"
            className="fill-brand/20 stroke-brand"
            strokeWidth={1.5}
          />
          <Label x={200} y={50}>
            N
          </Label>
          <path
            d="M 150 160 L 250 160 L 250 130 Q 200 112 150 130 Z"
            className="fill-brand/20 stroke-brand"
            strokeWidth={1.5}
          />
          <Label x={200} y={178}>
            S
          </Label>
          <Label x={200} y={198}>
            inhomogeneous magnet (&part;B/&part;z &ne; 0)
          </Label>

          {/* beam paths from magnet exit to screen */}
          {isActual ? (
            <>
              <line x1={EXIT_X} y1={EXIT_Y} x2={SCREEN_X} y2={UP_Y} className="stroke-accent" strokeWidth={2.25} />
              <line x1={EXIT_X} y1={EXIT_Y} x2={SCREEN_X} y2={DOWN_Y} className="stroke-accent" strokeWidth={2.25} />
            </>
          ) : (
            CLASSICAL_FAN_YS.map((y) => (
              <line
                key={y}
                x1={EXIT_X}
                y1={EXIT_Y}
                x2={SCREEN_X}
                y2={y}
                className="stroke-brand"
                strokeWidth={1.5}
                opacity={0.15 + 0.55 * (1 - Math.abs(y - SCREEN_CENTER_Y) / (SCREEN_CENTER_Y - SCREEN_TOP))}
              />
            ))
          )}

          {/* screen */}
          <rect
            x={SCREEN_X}
            y={SCREEN_TOP}
            width={SCREEN_WIDTH}
            height={SCREEN_BOTTOM - SCREEN_TOP}
            className="fill-surface stroke-foreground"
            strokeWidth={1.5}
          />
          {isActual ? (
            <>
              <rect x={SCREEN_X + 2} y={UP_Y - 9} width={SCREEN_WIDTH - 4} height={18} rx={4} className="fill-accent" />
              <rect x={SCREEN_X + 2} y={DOWN_Y - 9} width={SCREEN_WIDTH - 4} height={18} rx={4} className="fill-accent" />
            </>
          ) : (
            <rect
              x={SCREEN_X + 2}
              y={SCREEN_TOP + 2}
              width={SCREEN_WIDTH - 4}
              height={SCREEN_BOTTOM - SCREEN_TOP - 4}
              fill={`url(#${idBase}-classical-smear)`}
            />
          )}
          <Label x={SCREEN_X + SCREEN_WIDTH / 2} y={198}>
            screen
          </Label>
        </svg>
      </div>

      <p className="text-xs text-muted-foreground">{mode.caption}</p>
    </div>
  );
}
