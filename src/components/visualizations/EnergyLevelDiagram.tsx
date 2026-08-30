"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";
import { easeInOutCubic } from "@/components/simulators/bloch-sphere/useAnimatedBlochPoint";

export type EnergyLevel = {
  label: string;
  energy: number;
  highlight?: boolean;
};

/**
 * 340 -> 380, and the level lines moved right by LEVEL_X0, to make room for the
 * energy axis added below. The extra 40 units are spent entirely on the axis
 * gutter: the label column is still 380 - 174 = 206 units wide, exactly what it
 * was at 340 - 134, so no caller's level label loses room. This SVG has no
 * `w-full` (see the wrapper note), so a unit is a real CSS pixel and widening it
 * costs a little more horizontal scroll on a phone, not any type size.
 */
const WIDTH = 380;
const LEVEL_WIDTH = 120;
const PAD_TOP = 16;
const PAD_BOTTOM = 28;
/** Vertical energy axis, in the gutter left of the level lines. */
const AXIS_X = 24;
/** Left end of every level line, clear of the axis and its rotated name. */
const LEVEL_X0 = 40;
const LABEL_X = LEVEL_X0 + LEVEL_WIDTH + 14;
/** One full from->to->from cycle of the traveling transition dot. */
const TRANSITION_PERIOD_MS = 1400;
/** Cycles before the dot settles rather than ping-ponging forever - "brief,
 *  not a loop," the same framing `TunnelingIntroVisual`'s autoplay uses:
 *  nothing should animate indefinitely next to body text. */
const MAX_TRANSITION_CYCLES = 3;
/** Gap (px) below which two labels are considered visually colliding. */
const LABEL_COLLISION_PX = 9;
/** Spacing (px) enforced between labels once they're identified as a cluster. */
const LABEL_MIN_GAP_PX = 11;
/** Below this magnitude, toFixed(3) would render as "0.000"/"-0.000". */
const SMALL_ENERGY_THRESHOLD = 0.0005;

const SUPERSCRIPT_DIGITS: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "-": "⁻",
};

function toSuperscript(text: string): string {
  return text
    .split("")
    .map((ch) => SUPERSCRIPT_DIGITS[ch] ?? ch)
    .join("");
}

/**
 * Formats an energy value for its on-image label. A value whose magnitude
 * is small enough that `toFixed(3)` would collapse it to "0.000"/"-0.000"
 * (e.g. a ~10⁻⁵ eV fine-structure splitting) is instead rendered in
 * scientific notation, so a real, nonzero level never reads as zero.
 * Exact zero always renders as a plain "0.000".
 */
function formatEnergy(value: number): string {
  if (value === 0) return (0).toFixed(3);
  if (Math.abs(value) < SMALL_ENERGY_THRESHOLD) {
    const [mantissa, exponent] = value.toExponential(3).split("e");
    return `${mantissa}×10${toSuperscript(exponent.replace("+", ""))}`;
  }
  return value.toFixed(3);
}

/**
 * Returns a y-position for each level's *label* (not its line): levels
 * whose true y-positions are close enough to visually collide (identical
 * or near-identical energies, e.g. degenerate levels) are grouped and
 * spread evenly around their shared position by `LABEL_MIN_GAP_PX`, so
 * text stays legible while the (unmoved) level lines still show the real,
 * possibly-tied, energies.
 */
function computeLabelYs(ys: number[], minY: number, maxY: number): number[] {
  const order = ys.map((_, i) => i).sort((a, b) => ys[a] - ys[b]);
  const labelYs = new Array(ys.length).fill(0);

  let i = 0;
  while (i < order.length) {
    let j = i;
    while (j + 1 < order.length && ys[order[j + 1]] - ys[order[j]] < LABEL_COLLISION_PX) {
      j++;
    }
    const group = order.slice(i, j + 1);
    if (group.length === 1) {
      labelYs[group[0]] = ys[group[0]];
    } else {
      const mean = group.reduce((sum, idx) => sum + ys[idx], 0) / group.length;
      const spread = (group.length - 1) * LABEL_MIN_GAP_PX;
      // Clamp the spread group into the plot box before laying it out. A cluster
      // of degenerate levels sitting at the very top or bottom of the range (four
      // degenerate levels at the maximum energy, say) used to be spread
      // symmetrically about its own mean, which put its first label at
      // PAD_TOP - 16.5, above the viewBox, where the SVG clips silently and the
      // level simply had no label at all. Shifting the whole group keeps the
      // spacing that made it legible in the first place.
      const start = Math.min(Math.max(mean - spread / 2, minY), Math.max(minY, maxY - spread));
      group.forEach((idx, k) => {
        labelYs[idx] = start + k * LABEL_MIN_GAP_PX;
      });
    }
    i = j + 1;
  }

  return labelYs;
}

/**
 * A horizontal energy-level ladder: one line per level, vertically
 * positioned by its actual numeric energy (not just evenly spaced), so
 * unequal spacing (hydrogen's levels crowding near 0, a harmonic
 * oscillator's perfectly even rungs, an anharmonic transmon ladder) is
 * visually honest rather than schematic. Every energy value must come
 * from the caller's own engine computation.
 */
export function EnergyLevelDiagram({
  levels,
  ariaLabel,
  unit,
  transition,
  height = 260,
}: {
  levels: EnergyLevel[];
  ariaLabel: string;
  /** Shown next to each energy value, e.g. "eV" or "ħω". */
  unit?: string;
  /** Draws a labeled vertical arrow between two levels (matched by `label`). */
  transition?: { fromLabel: string; toLabel: string; caption?: string };
  height?: number;
}) {
  // Scopes this instance's SVG `<marker>` ids. They used to be the bare,
  // global `energy-axis-arrow` / `energy-transition-arrow`, so a lesson with
  // two of these diagrams shipped duplicate `id`s and the second diagram's
  // arrowheads were resolved out of the FIRST diagram's `<defs>` (a rendered
  // HTML scan found exactly that on
  // `quantum-hardware/physical-qubit-platforms/superconducting-qubits`).
  // Duplicate ids are invalid HTML, and the dependency is invisible: the
  // second figure's arrowheads survive only while the first figure is present
  // and rendered. Same `useId()` treatment `ProjectionShadow`,
  // `RydbergBlockadeDiagram`, `PathPhasorSum` and `SternGerlachScreen`
  // already use.
  const idBase = useId();
  const energies = levels.map((l) => l.energy);
  const min = Math.min(...energies);
  const max = Math.max(...energies);
  const span = max - min || 1;
  const plotHeight = height - PAD_TOP - PAD_BOTTOM;

  const yOf = (energy: number) => PAD_TOP + (1 - (energy - min) / span) * plotHeight;
  const labelYs = computeLabelYs(
    levels.map((l) => yOf(l.energy)),
    PAD_TOP,
    height - PAD_BOTTOM
  );

  const from = transition ? levels.find((l) => l.label === transition.fromLabel) : undefined;
  const to = transition ? levels.find((l) => l.label === transition.toLabel) : undefined;

  const prefersReducedMotion = usePrefersReducedMotion();
  // Position (0 = at `from`, 1 = at `to`) of the traveling dot, ping-ponging
  // back and forth to read as an ongoing transition (e.g. photon
  // absorption/emission) rather than a one-shot event.
  const [dotT, setDotT] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!from || !to || prefersReducedMotion) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const start = performance.now();
    const totalDurationMs = TRANSITION_PERIOD_MS * MAX_TRANSITION_CYCLES;
    const frame = (now: number) => {
      const elapsed = now - start;
      if (elapsed >= totalDurationMs) {
        // Settle at `to` - the transition has visibly completed - instead of
        // ping-ponging forever beside the lesson's prose.
        setDotT(1);
        rafRef.current = null;
        return;
      }
      const cycleElapsed = elapsed % TRANSITION_PERIOD_MS;
      const phase = (cycleElapsed / TRANSITION_PERIOD_MS) * 2;
      const linear = phase <= 1 ? phase : 2 - phase;
      setDotT(easeInOutCubic(linear));
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [from, to, prefersReducedMotion]);

  const dotY = from && to ? yOf(from.energy) + (yOf(to.energy) - yOf(from.energy)) * dotT : undefined;

  return (
    // `tabIndex={0}`. The `<svg>` has an intrinsic `width={WIDTH}` (340) and
    // no `w-full`, so it paints at 340 real pixels inside a ~256px content box
    // on a 320px phone and this wrapper takes the overflow. `overflow-x-auto`
    // is focusable by default in no browser except Firefox, so a keyboard-only
    // reader could not scroll to the right-hand energy labels and transition
    // arrows - the numbers the diagram exists to let you read off. No
    // `role`/`aria-label` on the wrapper: the `<svg>` is already `role="img"`
    // with the label, and naming this too would announce the figure twice.
    <div tabIndex={0} className="not-prose overflow-x-auto panel-inset p-4">
      <svg width={WIDTH} height={height} viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label={ariaLabel}>
        {/* THE ENERGY AXIS.
            This component's whole claim is that a level's height on the page is its
            real computed energy, "so unequal spacing (hydrogen's levels crowding
            near 0, a harmonic oscillator's perfectly even rungs, an anharmonic
            transmon ladder) is visually honest rather than schematic". Until now
            nothing in the drawing said so: there was no axis, no direction and no
            named quantity, so a reader had no way to tell this apart from the
            deliberately schematic LevelSplittingDiagram, which is evenly spaced by
            construction and carries a caption saying so. An arrowed, named axis is
            what turns "these lines are at different heights" into "these lines are
            at different energies, and up is more".

            `stroke-axis` / `fill-axis`: this is the one mark in the figure that IS
            an axis, and `--axis` is the token for an axis line and its name. The
            level labels stay on `--muted-foreground` (6.78:1, a step higher than
            `--axis`) because they are annotations, not tick labels. */}
        <line
          x1={AXIS_X}
          y1={height - PAD_BOTTOM}
          x2={AXIS_X}
          y2={PAD_TOP - 6}
          className="stroke-axis"
          strokeWidth={1}
          markerEnd={`url(#${idBase}-axis-arrow)`}
        />
        {/* rotate(-90) sends the text's advance direction to -y (up the page) and
            its descender direction to +x, so glyphs sit LEFT of the baseline: an
            11px cap height off a baseline at x = 13 occupies x = 2..16, clear of
            both the viewBox edge and the axis line at x = 24. */}
        <text
          x={13}
          y={(PAD_TOP + height - PAD_BOTTOM) / 2}
          textAnchor="middle"
          transform={`rotate(-90 13 ${(PAD_TOP + height - PAD_BOTTOM) / 2})`}
          className="fill-axis text-[11px]"
        >
          {unit ? `energy (${unit})` : "energy"}
        </text>
        {levels.map((level, i) => {
          const y = yOf(level.energy);
          const labelY = labelYs[i];
          return (
            <g key={i}>
              <line
                x1={LEVEL_X0}
                y1={y}
                x2={LEVEL_X0 + LEVEL_WIDTH}
                y2={y}
                strokeWidth={level.highlight ? 3 : 2}
                className={level.highlight ? "stroke-accent" : "stroke-brand/70"}
              />
              <text x={LABEL_X} y={labelY + 4} className={level.highlight ? "fill-accent text-xs font-semibold" : "fill-muted-foreground text-xs"}>
                {level.label}
                {typeof level.energy === "number" ? ` (${formatEnergy(level.energy)}${unit ? ` ${unit}` : ""})` : ""}
              </text>
            </g>
          );
        })}
        {from && to && (
          <g>
            <line
              x1={LEVEL_X0 + LEVEL_WIDTH / 2}
              y1={yOf(from.energy)}
              x2={LEVEL_X0 + LEVEL_WIDTH / 2}
              y2={yOf(to.energy)}
              className={prefersReducedMotion ? "stroke-foreground" : "stroke-foreground/40"}
              strokeWidth={1.5}
              markerEnd={prefersReducedMotion ? `url(#${idBase}-transition-arrow)` : undefined}
            />
            {!prefersReducedMotion && dotY !== undefined && (
              <circle cx={LEVEL_X0 + LEVEL_WIDTH / 2} cy={dotY} r={3.5} className="fill-accent" />
            )}
            {transition?.caption && (
              <text
                x={LEVEL_X0 + LEVEL_WIDTH / 2 + 6}
                y={(yOf(from.energy) + yOf(to.energy)) / 2}
                // 10 -> 11 units. This SVG has no `w-full`, so it renders at its
                // intrinsic 340px and a unit is a real CSS pixel - 10px was legible
                // rather than broken. But the transition caption names the physical
                // process the animated dot is acting out, and it was the only text in
                // the figure smaller than the level labels' 12px; matching them costs
                // nothing at this width.
                className="fill-foreground text-[11px] font-medium"
              >
                {transition.caption}
              </text>
            )}
          </g>
        )}
        <defs>
          <marker id={`${idBase}-axis-arrow`} markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" className="fill-axis" />
          </marker>
          <marker id={`${idBase}-transition-arrow`} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" className="fill-foreground" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
