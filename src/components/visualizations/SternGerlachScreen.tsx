"use client";

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
    caption: "Stern and Gerlach's silver atoms landed in exactly two spots — nothing in between.",
  },
];

function Label({ x, y, children }: { x: number; y: number; children: string }) {
  return (
    <text x={x} y={y} textAnchor="middle" className="fill-muted-foreground text-[10px] font-mono">
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

  return (
    <div className="not-prose space-y-4 rounded-xl border border-border bg-surface-muted/40 p-4">
      <PresetToggle options={modes} index={index} onChange={setIndex} ariaLabel={ariaLabel} />

      <div role="img" aria-label={`${ariaLabel}: ${mode.label}. ${mode.caption}`} className="overflow-x-auto">
        <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
          <defs>
            <radialGradient id="sg-classical-smear" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.5} />
              <stop offset="55%" stopColor="var(--brand)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
            </radialGradient>
            <marker id="sg-beam-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
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
            markerEnd="url(#sg-beam-arrow)"
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
              fill="url(#sg-classical-smear)"
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
