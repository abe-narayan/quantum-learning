"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { PresetToggle } from "@/components/visualizations/PresetToggle";
import { stateVectorAmplitudeCount, stateVectorMemoryBytes } from "@/lib/quantum/simulationCost";

const LEFT_WIDTH = 210;
const LEFT_HEIGHT = 190;
const LEFT_CENTER = { x: 105, y: 82 };
const LEFT_RADIUS = 58;
/** A small ring of points around the blob's circumference, all pairwise
 * connected — a visual stand-in for "every one of the 2ⁿ amplitudes is
 * independent information," not a literal amplitude count. */
const LEFT_RING_POINTS = 8;

const RIGHT_WIDTH = 280;
const RIGHT_HEIGHT = 190;
const CHAIN_Y = 82;
/** Five slots: three real qubits, an elided run, and a final "qₙ" — the
 * chain is illustrative of the MPS structure itself, independent of
 * whatever actual qubit count `n` is used for the memory readout below. */
const CHAIN_X = [34, 92, 150, 208, 266];
const NODE_R = 13;

/** Illustrative bond dimensions: minimal, the lesson's own D=16 baseline
 * (matching `ParametricCurve`'s fixed-D memory-scaling comparison above
 * this diagram), and the near-maximal 2^(n/2) the prose warns bond
 * dimension climbs back toward for highly-entangled states. */
function bondDimensionOptions(n: number): { value: number; label: string }[] {
  const halfN = n / 2;
  const nearMaximal = Math.round(2 ** halfN);
  const raw = [
    { value: 2, label: "D = 2 (minimal)" },
    { value: 16, label: "D = 16 (modest)" },
    { value: nearMaximal, label: `D = 2^${Number.isInteger(halfN) ? halfN : halfN.toFixed(1)} = ${nearMaximal.toLocaleString()} (near-maximal)` },
  ];
  // Dedupe in case a small `n` collapses two illustrative values together.
  const seen = new Set<number>();
  return raw.filter((option) => (seen.has(option.value) ? false : (seen.add(option.value), true)));
}

/** Edge stroke width grows with log2(D) so even D=2^(n/2)-scale values
 * (thousands+) stay on screen instead of blowing out the SVG. */
function edgeWidthFor(d: number): number {
  return Math.min(1.5 + Math.log2(Math.max(d, 1)) * 1.1, 12);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes.toFixed(0)} B`;
  const units = ["KB", "MB", "GB", "TB", "PB"];
  let value = bytes;
  let unitIndex = -1;
  do {
    value /= 1024;
    unitIndex++;
  } while (value >= 1024 && unitIndex < units.length - 1);
  return `${value.toFixed(value < 10 ? 2 : 1)} ${units[unitIndex]}`;
}

/**
 * Sketches the single structural idea this lesson's prose describes but
 * never draws: a generic state vector is one flat, fully-connected blob of
 * 2ⁿ independent amplitudes (left), while a matrix-product-state tensor
 * network instead chains together small per-qubit tensors linked by "bond"
 * indices of dimension D (right). A toggle lets the reader flip D across
 * illustrative values and watch the chain's edges thicken and the adjacent
 * 32·n·D² readout grow — complementing `ParametricCurve`'s memory-scaling
 * sweep (cost over qubit count at fixed D) with the structural picture
 * (cost over D at fixed qubit count) that motivates it.
 */
export function TensorNetworkDiagram({ n = 20, ariaLabel }: { n?: number; ariaLabel: string }) {
  const options = useMemo(() => bondDimensionOptions(n), [n]);
  const [index, setIndex] = useState(0);
  const d = options[Math.min(index, options.length - 1)].value;

  const amplitudeCount = stateVectorAmplitudeCount(n);
  const stateVectorBytes = stateVectorMemoryBytes(n);
  const mpsBytes = 32 * n * d * d;
  const edgeWidth = edgeWidthFor(d);

  const ringPoints = Array.from({ length: LEFT_RING_POINTS }, (_, i) => {
    const theta = (2 * Math.PI * i) / LEFT_RING_POINTS - Math.PI / 2;
    return {
      x: LEFT_CENTER.x + LEFT_RADIUS * 0.82 * Math.cos(theta),
      y: LEFT_CENTER.y + LEFT_RADIUS * 0.82 * Math.sin(theta),
    };
  });
  const ringChords: { a: { x: number; y: number }; b: { x: number; y: number } }[] = [];
  for (let i = 0; i < ringPoints.length; i++) {
    for (let j = i + 1; j < ringPoints.length; j++) {
      ringChords.push({ a: ringPoints[i], b: ringPoints[j] });
    }
  }

  return (
    <div className="not-prose space-y-4 panel-inset p-4 sm:p-5">
      {/* `role="group"`, not `role="img"`. `img` makes every descendant
          presentational, and both SVGs inside this wrapper are already
          `aria-hidden` — so the role was not hiding a picture, it was hiding
          the four `<p>` captions that are the only words attached to the two
          panels: "2ⁿ amplitudes, fully connected" / "no structure exploited"
          for the dense side, and "one small tensor per qubit" / "linked by
          bond dimension D = …" for the MPS side. Those four lines *are* the
          comparison the figure is making, and the last one carries the live D
          value the slider changes, so a screen-reader user got the summary
          sentence and then nothing that responded to the control.

          `group` keeps the same `aria-label` — the summary is still announced
          on entry — while leaving the captions in the tree. The SVGs stay
          `aria-hidden`, so nothing is read twice. */}
      {/* `tabIndex={0}` completes the fix the role change above started. The
          right-hand MPS panel's SVG has an intrinsic `width={RIGHT_WIDTH}`
          (280) and no responsive class, so on a 320px phone — a ~256px content
          box inside `panel-inset p-4` — that one flex item is wider than the
          row and `flex-wrap` cannot help, because wrapping only moves items
          between lines, it never shrinks one. This container therefore really
          scrolls, and an `overflow-x-auto` div is focusable by default in no
          browser except Firefox, so a keyboard-only reader could not reach the
          right edge of the MPS chain. The name is already on this element, so
          the new stop announces itself. */}
      <div
        role="group"
        aria-label={`${ariaLabel}. Currently showing bond dimension D = ${d.toLocaleString()}.`}
        tabIndex={0}
        className="flex flex-wrap items-start justify-center gap-8 overflow-x-auto"
      >
        <div className="flex flex-col items-center">
          <svg width={LEFT_WIDTH} height={LEFT_HEIGHT} viewBox={`0 0 ${LEFT_WIDTH} ${LEFT_HEIGHT}`} aria-hidden="true">
            {/* The blob's outline is the plotted region of the left panel —
                the "one flat, fully-connected object" the right panel is
                being contrasted against — so it is load-bearing and moves
                onto `--axis` (≥3:1 on every panel depth) from `--border`,
                the panel-edge token that measured 1.41:1 on
                `--surface-muted`. The 28 chords inside it are a different
                call: they carry no per-chord meaning — the comment on
                LEFT_RING_POINTS says so outright, they are a stand-in for
                "everything connects to everything" — and at 0.75 units,
                28 of them, they read as texture. So they go to
                `--axis-grid`, the token built to sit deliberately below the
                3:1 floor, rather than to `--axis`: drawing decorative fill
                at full axis contrast would make it shout over the outline
                that actually bounds the region. */}
            <circle cx={LEFT_CENTER.x} cy={LEFT_CENTER.y} r={LEFT_RADIUS} className="fill-muted-foreground/15 stroke-axis" strokeWidth={1.5} />
            {ringChords.map((chord, i) => (
              <line key={i} x1={chord.a.x} y1={chord.a.y} x2={chord.b.x} y2={chord.b.y} className="stroke-axis-grid" strokeWidth={0.75} />
            ))}
            {ringPoints.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={3} className="fill-muted-foreground" />
            ))}
          </svg>
          <p className="mt-1 text-center text-xs font-semibold text-foreground">2ⁿ amplitudes, fully connected</p>
          <p className="text-center text-[11px] text-muted-foreground">no structure exploited</p>
        </div>

        <div className="flex flex-col items-center">
          <svg width={RIGHT_WIDTH} height={RIGHT_HEIGHT} viewBox={`0 0 ${RIGHT_WIDTH} ${RIGHT_HEIGHT}`} aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1={CHAIN_X[i]}
                y1={CHAIN_Y}
                x2={CHAIN_X[i + 1]}
                y2={CHAIN_Y}
                strokeWidth={edgeWidth}
                strokeDasharray={i >= 2 ? "5 5" : undefined}
                className="stroke-accent"
              />
            ))}
            {CHAIN_X.map((x, i) =>
              i === 3 ? (
                <text key={i} x={x} y={CHAIN_Y + 5} textAnchor="middle" className="fill-muted-foreground text-sm font-semibold">
                  &#8942;
                </text>
              ) : (
                <g key={i}>
                  <circle cx={x} cy={CHAIN_Y} r={NODE_R} className="fill-brand" />
                  {/* These SVGs carry intrinsic width attributes and no `w-full`, so
                    the viewBox scale is 1.0 and 10 authored units was a literal
                    10px - on the floor, not under it. 12 clears it and still fits
                    inside the 26-unit-diameter node circle. */}
                  <text x={x} y={CHAIN_Y + 4} textAnchor="middle" fontSize={12} className="fill-brand-foreground font-semibold">
                    {i === 0 ? "q₁" : i === 1 ? "q₂" : i === 2 ? "q₃" : "qₙ"}
                  </text>
                </g>
              )
            )}
          </svg>
          <p className="mt-1 text-center text-xs font-semibold text-foreground">one small tensor per qubit</p>
          <p className="text-center text-[11px] text-muted-foreground">linked by bond dimension D = {d.toLocaleString()}</p>
        </div>
      </div>

      {options.length > 1 && (
        <PresetToggle
          options={options.map((o) => ({ label: o.label }))}
          index={index}
          onChange={setIndex}
          ariaLabel="Bond dimension D"
        />
      )}

      <div aria-live="polite" className="rounded-(--radius-tight) border border-brand/25 bg-brand/5 px-4 py-3 text-sm text-foreground">
        With <span className="font-mono">n = {n}</span> qubits and{" "}
        <span className="font-mono">D = {d.toLocaleString()}</span>, the MPS chain stores about{" "}
        <span className={cn("font-mono font-semibold", mpsBytes >= stateVectorBytes ? "text-warning" : "text-accent")}>
          32·n·D² &asymp; {formatBytes(mpsBytes)}
        </span>{" "}
        &mdash; versus <span className="font-mono">{formatBytes(stateVectorBytes)}</span> for the full{" "}
        <span className="font-mono">{amplitudeCount.toLocaleString()}</span>-amplitude state vector.
      </div>
    </div>
  );
}
