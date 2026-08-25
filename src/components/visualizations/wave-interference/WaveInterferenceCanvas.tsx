import { Complex } from "@/lib/quantum/complex";

/**
 * Two-coherent-point-source (Young's-double-slit-style) interference,
 * computed exactly rather than approximated for the picture.
 *
 * Each source emits a wave of the same amplitude and wavelength; source 2
 * carries an extra, user-controlled relative phase `phase` on top of it
 * (the same kind of relative phase, e^{i*phase}, that the lesson's own
 * |psi> = (1/sqrt2)(|0> + e^{i*phase}|1>) carries between its two terms).
 * At a point on the screen a distance r1, r2 from each source, the
 * complex field from each source is A*e^{i*k*r}, and the combined
 * intensity is the squared magnitude of their sum — real coherent-wave
 * superposition, built on the same `Complex` class the rest of the
 * codebase uses for quantum amplitudes.
 *
 * At the screen's midpoint the two path lengths are equal by symmetry, so
 * the path-length phase cancels out of the sum entirely and only `phase`
 * survives: intensity there reduces exactly to
 * 4*SOURCE_AMPLITUDE^2*cos^2(phase/2), matching the closed-form formula
 * this whole visualization is meant to demonstrate (4A^2 at phase=0,
 * fully constructive; 0 at phase=pi, fully destructive).
 */

export const SOURCE_AMPLITUDE = 1;
export const MAX_INTENSITY = 4 * SOURCE_AMPLITUDE * SOURCE_AMPLITUDE;

const WAVELENGTH = 8;
const K = (2 * Math.PI) / WAVELENGTH;

const VIEW_W = 748;
const VIEW_H = 320;

const SOURCES_X = 90;
const CENTER_Y = 160;
const SOURCE_SEPARATION = 70;
const SOURCE_1_Y = CENTER_Y - SOURCE_SEPARATION / 2;
const SOURCE_2_Y = CENTER_Y + SOURCE_SEPARATION / 2;

const SCREEN_X = 520;
const SCREEN_HALF_HEIGHT = 120;
const SCREEN_TOP = CENTER_Y - SCREEN_HALF_HEIGHT;
const SCREEN_BOTTOM = CENTER_Y + SCREEN_HALF_HEIGHT;

const SOURCE_TO_SCREEN_DISTANCE = SCREEN_X - SOURCES_X;

const STRIP_X0 = SCREEN_X + 14;
const STRIP_X1 = SCREEN_X + 64;
const CURVE_X0 = SCREEN_X + 80;
const CURVE_MAX_DEVIATION = 100;

const SAMPLE_COUNT = 121; // odd, so a sample lands exactly on the screen's midpoint (yOffset = 0)

/**
 * Complex field-intensity at a screen point `yOffset` (measured from the
 * screen's midpoint) for a given relative phase between the two sources.
 * `yOffset = 0` is exactly equidistant from both sources.
 */
export function intensityAtScreenOffset(yOffset: number, phase: number): number {
  const r1 = Math.hypot(SOURCE_TO_SCREEN_DISTANCE, CENTER_Y + yOffset - SOURCE_1_Y);
  const r2 = Math.hypot(SOURCE_TO_SCREEN_DISTANCE, CENTER_Y + yOffset - SOURCE_2_Y);
  const field1 = Complex.fromPolar(SOURCE_AMPLITUDE, K * r1);
  const field2 = Complex.fromPolar(SOURCE_AMPLITUDE, K * r2 + phase);
  return field1.add(field2).magnitudeSquared();
}

/** Intensity at the screen's midpoint, exactly equidistant from both sources — reduces to 4A^2cos^2(phase/2). */
export function centerIntensity(phase: number): number {
  return intensityAtScreenOffset(0, phase);
}

function buildFringeSamples(phase: number) {
  return Array.from({ length: SAMPLE_COUNT }, (_, i) => {
    const t = i / (SAMPLE_COUNT - 1); // 0..1 top to bottom
    const yOffset = -SCREEN_HALF_HEIGHT + t * (2 * SCREEN_HALF_HEIGHT);
    const intensity = intensityAtScreenOffset(yOffset, phase);
    return { y: CENTER_Y + yOffset, normalized: intensity / MAX_INTENSITY };
  });
}

function describeInterference(normalizedCenter: number): string {
  if (normalizedCenter > 0.9) return "near-fully constructive";
  if (normalizedCenter < 0.1) return "near-fully destructive";
  return "partial";
}

function buildAriaLabel(phase: number, normalizedCenter: number): string {
  const phaseDeg = Math.round(((phase % (2 * Math.PI)) * 180) / Math.PI);
  const pct = Math.round(normalizedCenter * 100);
  return (
    `Two coherent wave sources interfering on a screen. Relative phase is ${phaseDeg} degrees. ` +
    `The central fringe carries ${pct} percent of the maximum possible intensity — ${describeInterference(
      normalizedCenter
    )} interference. Bright and dark bands above and below the center repeat as the path-length difference to each source varies.`
  );
}

export function WaveInterferenceCanvas({ phase, className }: { phase: number; className?: string }) {
  const samples = buildFringeSamples(phase);
  const centerNormalized = centerIntensity(phase) / MAX_INTENSITY;
  const step = (2 * SCREEN_HALF_HEIGHT) / (SAMPLE_COUNT - 1);

  const curvePoints = samples.map((s) => `${(CURVE_X0 + s.normalized * CURVE_MAX_DEVIATION).toFixed(1)},${s.y.toFixed(1)}`);
  const curvePath = `M${CURVE_X0},${SCREEN_TOP} L${curvePoints.join(" L")} L${CURVE_X0},${SCREEN_BOTTOM} Z`;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={buildAriaLabel(phase, centerNormalized)}
      className={className ?? "mx-auto w-full max-w-2xl"}
    >
      {/* Decorative wavefront arcs from each source */}
      <g aria-hidden="true" className="stroke-border/50" fill="none" strokeWidth={1}>
        {[18, 34, 50, 66].map((r) => (
          <circle key={`s1-${r}`} cx={SOURCES_X} cy={SOURCE_1_Y} r={r} />
        ))}
        {[18, 34, 50, 66].map((r) => (
          <circle key={`s2-${r}`} cx={SOURCES_X} cy={SOURCE_2_Y} r={r} />
        ))}
      </g>

      {/* Sources */}
      <circle cx={SOURCES_X} cy={SOURCE_1_Y} r={5} className="fill-brand" />
      <text x={SOURCES_X - 10} y={SOURCE_1_Y - 10} textAnchor="end" className="fill-foreground text-[11px] font-mono">
        S₁
      </text>
      <circle cx={SOURCES_X} cy={SOURCE_2_Y} r={5} className="fill-brand" />
      <text x={SOURCES_X - 10} y={SOURCE_2_Y + 18} textAnchor="end" className="fill-foreground text-[11px] font-mono">
        S₂
      </text>
      <text x={SOURCES_X} y={SOURCE_1_Y - 34} textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono">
        φ applied to S₂
      </text>

      {/* Screen line */}
      <line x1={SCREEN_X} y1={SCREEN_TOP - 10} x2={SCREEN_X} y2={SCREEN_BOTTOM + 10} className="stroke-border" strokeWidth={2} />
      <text x={SCREEN_X} y={SCREEN_TOP - 16} textAnchor="middle" className="fill-muted-foreground text-[9px] font-mono uppercase tracking-wide">
        screen
      </text>

      {/* Fringe strip: dark background, bright rects with opacity = normalized intensity */}
      <rect x={STRIP_X0} y={SCREEN_TOP} width={STRIP_X1 - STRIP_X0} height={SCREEN_BOTTOM - SCREEN_TOP} className="fill-surface-muted" />
      {samples.map((s, i) => (
        <rect
          key={i}
          x={STRIP_X0}
          y={s.y - step / 2}
          width={STRIP_X1 - STRIP_X0}
          height={step + 0.6}
          style={{ fill: "var(--brand)", opacity: s.normalized }}
        />
      ))}
      <rect
        x={STRIP_X0}
        y={SCREEN_TOP}
        width={STRIP_X1 - STRIP_X0}
        height={SCREEN_BOTTOM - SCREEN_TOP}
        fill="none"
        className="stroke-border"
        strokeWidth={1}
      />

      {/* Intensity-vs-position curve */}
      <line x1={CURVE_X0} y1={SCREEN_TOP - 6} x2={CURVE_X0} y2={SCREEN_BOTTOM + 6} className="stroke-border/60" strokeWidth={1} strokeDasharray="2 3" />
      <path d={curvePath} className="fill-accent/25 stroke-accent" strokeWidth={1.5} />

      {/* Center-fringe marker */}
      <line
        x1={STRIP_X0 - 6}
        y1={CENTER_Y}
        x2={CURVE_X0 + CURVE_MAX_DEVIATION + 10}
        y2={CENTER_Y}
        className="stroke-accent"
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      <text x={CURVE_X0 + CURVE_MAX_DEVIATION + 14} y={CENTER_Y + 4} className="fill-accent text-[10px] font-mono font-semibold">
        {Math.round(centerNormalized * 100)}%
      </text>
    </svg>
  );
}
