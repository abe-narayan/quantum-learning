import { Complex } from "@/lib/quantum/complex";
import { cn } from "@/lib/utils";

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

/**
 * The one number in this file that is physics rather than drawing: it feeds
 * `intensityAtScreenOffset`, so it sets the real path-length difference and
 * therefore the real fringe spacing. It is defined from the wide
 * composition's `SCREEN_X`/`SOURCES_X` and *nothing else may redefine it* —
 * the narrow composition below draws a shorter gap on the page but still
 * computes every fringe from this same 430-unit distance. See
 * NARROW_SCREEN_X for why that is honest and how it is labelled.
 */
const SOURCE_TO_SCREEN_DISTANCE = SCREEN_X - SOURCES_X;

const STRIP_X0 = SCREEN_X + 14;
const STRIP_X1 = SCREEN_X + 64;
const CURVE_X0 = SCREEN_X + 80;
const CURVE_MAX_DEVIATION = 100;

const SAMPLE_COUNT = 121; // odd, so a sample lands exactly on the screen's midpoint (yOffset = 0)

/**
 * Narrow composition. The wide viewBox is 748 units across and the embedding
 * panel is `rounded-3xl … p-6` inside the lesson's `Container` (`px-4` at
 * phone widths), so on a 320px phone this SVG's own box is only ~240px — a
 * scale of 240/748 = 0.32, at which the 18-unit labels paint at 5.8px. No
 * amount of type adjustment reaches the ~9px floor from there: two thirds of
 * the 748 units are the source-to-screen gap, and that gap is what makes the
 * box wide.
 *
 * So the narrow composition **compresses the drawn gap and nothing else**:
 * 92 units on the page in place of 430, a 4.7× foreshortening, while
 * `SOURCE_TO_SCREEN_DISTANCE` — the number `intensityAtScreenOffset` actually
 * integrates — is untouched. What that costs and what it does not:
 *
 * - The **vertical** scale is identical to the wide composition and to the
 *   model: sources 70 units apart, screen spanning yOffset ±120, one SVG unit
 *   per model unit. Fringe positions and fringe spacing — the only spatial
 *   quantities a reader is meant to read off this figure — are therefore
 *   pixel-for-pixel the same story in both compositions.
 * - What *is* distorted is the apparatus aspect ratio, and with it the
 *   source-to-screen angles. Nothing in the lesson or the readouts asks the
 *   reader to measure either, but a squashed apparatus could still be
 *   mistaken for a to-scale one, so the narrow composition says so in the
 *   figure ("source–screen gap / not to scale") and again in the note beneath
 *   it. Labelled schematic, not silently rescaled.
 *
 * At 320 units against a ~240px phone box the scale is 0.75: 15-unit labels
 * paint at 11.3px and the 14-unit ones at 10.5px, against 5.8px before.
 * `max-w-xs` (= 20rem = 320px) caps the SVG at one unit per pixel so the type
 * stops growing once the box is wide enough, instead of ballooning on the way
 * up to the wide composition's threshold.
 *
 * The threshold itself, 420px, is where the wide composition's 18-unit labels
 * reach 18 × 420/748 = 10.1px.
 */
const NARROW_W = 320;
const NARROW_H = 320;
const NARROW_SOURCES_X = 50;
const NARROW_SCREEN_X = 142;
const NARROW_STRIP_X0 = 150;
const NARROW_STRIP_X1 = 184;
const NARROW_CURVE_X0 = 196;
/**
 * 78 rather than the wide composition's 100. This is a display gain on an
 * already-normalized quantity (`intensity / MAX_INTENSITY`, 0..1), not a
 * physical length: full deviation still means exactly 100% of the maximum
 * possible intensity, and the numeric readout at the right of the centre
 * fringe states that percentage outright. Shrinking it is what leaves room
 * for that readout to sit clear of the curve's own maximum.
 */
const NARROW_CURVE_MAX_DEVIATION = 78;

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
    `The central fringe carries ${pct} percent of the maximum possible intensity: ${describeInterference(
      normalizedCenter
    )} interference. Bright and dark bands above and below the center repeat as the path-length difference to each source varies.`
  );
}

export function WaveInterferenceCanvas({ phase, className }: { phase: number; className?: string }) {
  const samples = buildFringeSamples(phase);
  const centerNormalized = centerIntensity(phase) / MAX_INTENSITY;
  const step = (2 * SCREEN_HALF_HEIGHT) / (SAMPLE_COUNT - 1);
  const centerPct = Math.round(centerNormalized * 100);
  const ariaLabel = buildAriaLabel(phase, centerNormalized);

  const curvePath = buildCurvePath(samples, CURVE_X0, CURVE_MAX_DEVIATION);
  const narrowCurvePath = buildCurvePath(samples, NARROW_CURVE_X0, NARROW_CURVE_MAX_DEVIATION);

  return (
    // `@container` on the wrapper, not on either SVG: the `@min-[420px]:`
    // variants below have to query an ancestor's box, since an element's own
    // inline-size is the one thing a container query may not feed back into.
    // Both SVGs stay in the DOM and the inactive one is `display: none`, so
    // assistive tech announces exactly one `role="img"`. It is *appended* to a
    // caller's className rather than replaced by it: the whole composition
    // swap depends on it, and losing it to an override would silently strand
    // the figure in one layout with no error to notice.
    <div className={cn("@container", className ?? "mx-auto w-full max-w-2xl")}>
      {/* Narrow composition — see NARROW_W above for the measured type sizes
          this exists to fix and for what the compressed gap does and does not
          distort. */}
      <svg
        viewBox={`0 0 ${NARROW_W} ${NARROW_H}`}
        role="img"
        aria-label={ariaLabel}
        className="mx-auto block w-full max-w-xs @min-[420px]:hidden"
      >
        {/* Wavefront arcs, decorative (`--axis-grid` is deliberately below the
            3:1 floor). Drawn as true circles at the same 16-unit radial
            spacing as the wide composition even though the horizontal gap is
            foreshortened: the vertical scale is the true one, so circles keep
            the wavelength honest in the direction the fringes are read. */}
        <g aria-hidden="true" className="stroke-axis-grid" fill="none" strokeWidth={1}>
          {[16, 32, 48].map((r) => (
            <circle key={`n-s1-${r}`} cx={NARROW_SOURCES_X} cy={SOURCE_1_Y} r={r} />
          ))}
          {[16, 32, 48].map((r) => (
            <circle key={`n-s2-${r}`} cx={NARROW_SOURCES_X} cy={SOURCE_2_Y} r={r} />
          ))}
        </g>

        <circle cx={NARROW_SOURCES_X} cy={SOURCE_1_Y} r={5} className="fill-brand" />
        <text x={NARROW_SOURCES_X - 10} y={SOURCE_1_Y - 10} textAnchor="end" fontSize={15} className="fill-foreground font-mono">
          S₁
        </text>
        <circle cx={NARROW_SOURCES_X} cy={SOURCE_2_Y} r={5} className="fill-brand" />
        <text x={NARROW_SOURCES_X - 10} y={SOURCE_2_Y + 20} textAnchor="end" fontSize={15} className="fill-foreground font-mono">
          S₂
        </text>
        {/* Anchored to the left edge rather than centred on the sources: at 14
            units this string is ~126 wide, and centring it on x = 50 would
            push its head off the viewBox where the SVG clips silently. */}
        <text x={4} y={SOURCE_1_Y - 34} textAnchor="start" fontSize={14} className="fill-axis font-mono">
          φ applied to S₂
        </text>

        {/* The "not to scale" disclosure, in the figure itself rather than only
            in the prose beneath it — a reader who screenshots or skims the
            picture alone still sees that the gap is foreshortened. 12 units
            (≈9px at a 240px box) is deliberately the smallest type here: it is
            a caveat about the drawing, not a quantity to read.

            Baselines 266/282 rather than 248/264. The outermost wavefront arc
            (r = 48 about the lower source at y = 195) reaches y = 243, and at a
            248 baseline this caption's cap-height band starts at 239.4 — so the
            arc crossed the top of "source–screen gap" between x ≈ 31 and 69.
            A faint 2.2:1 rule drawn through the one sentence that stops the
            figure being read as to-scale is the wrong place to save 18 units;
            266 starts the band at 257.4, clear of the arc, and the second
            line's descender lands at ~285 inside the 320-unit box. */}
        {/* And `fill-muted-foreground`, not `fill-axis`. This is a caveat about
            the drawing, which is exactly the kind of prose `--axis` is not for:
            at 4.5:1 it sits a step below `--muted-foreground` at 6.78:1, so the
            smallest type in the figure was also being given the lower of the two
            available contrasts. `--axis` keeps the screen rule, the source
            markers and the fringe strip, which are the marks positions are read
            against. */}
        <text x={64} y={266} textAnchor="middle" fontSize={12} className="fill-muted-foreground">
          source–screen gap
        </text>
        <text x={64} y={282} textAnchor="middle" fontSize={12} className="fill-muted-foreground">
          not to scale
        </text>

        <line
          x1={NARROW_SCREEN_X}
          y1={SCREEN_TOP - 10}
          x2={NARROW_SCREEN_X}
          y2={SCREEN_BOTTOM + 10}
          className="stroke-axis"
          strokeWidth={2}
        />
        <text
          x={NARROW_SCREEN_X}
          y={SCREEN_TOP - 18}
          textAnchor="middle"
          fontSize={14}
          className="fill-axis font-mono uppercase tracking-wide"
        >
          screen
        </text>

        <rect
          x={NARROW_STRIP_X0}
          y={SCREEN_TOP}
          width={NARROW_STRIP_X1 - NARROW_STRIP_X0}
          height={SCREEN_BOTTOM - SCREEN_TOP}
          className="fill-surface-muted"
        />
        {samples.map((s, i) => (
          <rect
            key={`n-${i}`}
            x={NARROW_STRIP_X0}
            y={s.y - step / 2}
            width={NARROW_STRIP_X1 - NARROW_STRIP_X0}
            height={step + 0.6}
            className="fill-brand"
            style={{ opacity: s.normalized }}
          />
        ))}
        <rect
          x={NARROW_STRIP_X0}
          y={SCREEN_TOP}
          width={NARROW_STRIP_X1 - NARROW_STRIP_X0}
          height={SCREEN_BOTTOM - SCREEN_TOP}
          fill="none"
          className="stroke-axis"
          strokeWidth={1}
        />

        <line
          x1={NARROW_CURVE_X0}
          y1={SCREEN_TOP - 6}
          x2={NARROW_CURVE_X0}
          y2={SCREEN_BOTTOM + 6}
          className="stroke-axis"
          strokeWidth={1}
          strokeDasharray="2 3"
        />
        <path d={narrowCurvePath} className="fill-accent/25 stroke-accent" strokeWidth={1.5} />

        <line
          x1={NARROW_STRIP_X0 - 6}
          y1={CENTER_Y}
          x2={NARROW_CURVE_X0 + NARROW_CURVE_MAX_DEVIATION + 8}
          y2={CENTER_Y}
          className="stroke-accent"
          strokeWidth={1}
          strokeDasharray="4 3"
        />
        {/* Right-edge anchored and lifted above the centre rule for the same
            reason as in the wide composition: at 100% the curve reaches
            x = 274, and a centred or curve-relative label would either sit on
            top of it or run past the 320-unit viewBox and be clipped. */}
        <text x={NARROW_W - 4} y={CENTER_Y - 6} textAnchor="end" fontSize={15} className="fill-accent font-mono font-semibold">
          {centerPct}%
        </text>
      </svg>

      {/* The same disclosure as the in-figure "not to scale" caption, spelled
          out in HTML so it lands at a real 12px regardless of how narrow the
          box gets — and so a screen-reader user, who never sees either
          caption, is told the drawing is schematic at all. It reads *after*
          the SVG, not before it: an earlier note here claimed the reverse, and
          it is worth being accurate about, because it means the accessible
          order is "fringes described, then told the gap is schematic". That is
          acceptable — the caveat is about the drawing, and the aria-label
          never asserts a distance — but if the ordering ever has to be
          guaranteed, this paragraph has to move above the narrow `<svg>`,
          not be described as if it already had. Narrow-only: the wide
          composition draws the gap at one unit per model unit and needs no
          caveat. */}
      <p className="mx-auto mt-2 max-w-xs text-center text-xs text-muted-foreground @min-[420px]:hidden">
        The gap drawn between the sources and the screen is compressed to fit this width. Fringe positions
        and spacing are unaffected; they are still computed from the true source-to-screen distance.
      </p>

      {/* Wide composition. The *geometry* is unchanged — same 748 × 320
          viewBox, same SOURCES_X/SCREEN_X/CENTER_Y, same strip, curve baseline
          and sample positions — and so is every number
          `intensityAtScreenOffset` touches. The type is not, and the comment
          that used to sit here claimed it was: the concurrent type pass raised
          the source kets 11 → 18, the "φ applied to S₂" and "screen" captions
          9 → 18 and the centre-fringe percentage 10 → 18, moved that
          percentage from a curve-relative start anchor to a right-edge end
          anchor (it clipped past the viewBox at the larger size), and nudged
          the S₂ and "screen" baselines by 2 units to follow. Verified against
          `git show HEAD` rather than taken on the comment's word. */}
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-label={ariaLabel}
        className="mx-auto hidden w-full @min-[420px]:block"
      >
        {/* These wavefront arcs are the one mark here the comment already
            called decorative: they suggest "waves are radiating" and carry no
            value a reader reads off. That is exactly what `--axis-grid` is
            for — a token deliberately below the 3:1 floor — rather than
            `--border`, which landed in the same place only by accident. */}
        <g aria-hidden="true" className="stroke-axis-grid" fill="none" strokeWidth={1}>
          {[18, 34, 50, 66].map((r) => (
            <circle key={`s1-${r}`} cx={SOURCES_X} cy={SOURCE_1_Y} r={r} />
          ))}
          {[18, 34, 50, 66].map((r) => (
            <circle key={`s2-${r}`} cx={SOURCES_X} cy={SOURCE_2_Y} r={r} />
          ))}
        </g>

        {/* Sources */}
        <circle cx={SOURCES_X} cy={SOURCE_1_Y} r={5} className="fill-brand" />
        <text x={SOURCES_X - 10} y={SOURCE_1_Y - 10} textAnchor="end" fontSize={18} className="fill-foreground font-mono">
          S₁
        </text>
        <circle cx={SOURCES_X} cy={SOURCE_2_Y} r={5} className="fill-brand" />
        <text x={SOURCES_X - 10} y={SOURCE_2_Y + 20} textAnchor="end" fontSize={18} className="fill-foreground font-mono">
          S₂
        </text>
        <text x={SOURCES_X} y={SOURCE_1_Y - 34} textAnchor="middle" fontSize={18} className="fill-axis font-mono">
          φ applied to S₂
        </text>

        {/* The screen is a physical element of the apparatus, not chrome: the
            fringes are what lands ON it, and "how far the screen sits from the
            sources" is the geometry driving every path length in
            `intensityAtScreenOffset`. Load-bearing, so `--axis` (≥3:1 on every
            panel depth) replaces `--border`, the panel-edge token measured at
            1.41:1 on `--surface-muted` — under the 3:1 WCAG 2.1 SC 1.4.11
            floor. */}
        <line x1={SCREEN_X} y1={SCREEN_TOP - 10} x2={SCREEN_X} y2={SCREEN_BOTTOM + 10} className="stroke-axis" strokeWidth={2} />
        <text x={SCREEN_X} y={SCREEN_TOP - 18} textAnchor="middle" fontSize={18} className="fill-axis font-mono uppercase tracking-wide">
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
            className="fill-brand"
            style={{ opacity: s.normalized }}
          />
        ))}
        <rect
          x={STRIP_X0}
          y={SCREEN_TOP}
          width={STRIP_X1 - STRIP_X0}
          height={SCREEN_BOTTOM - SCREEN_TOP}
          fill="none"
          // Outline of the fringe strip — the boundary of the plotted region,
          // and the only thing separating "screen" from "graph" for a reader
          // scanning left to right. Moved off `--border` for the same 1.41:1
          // reason as the screen line above.
          className="stroke-axis"
          strokeWidth={1}
        />

        {/* Intensity-vs-position curve. Its vertical baseline is the zero-
            intensity reference: the curve's whole meaning is how far it bulges
            off this line, so the line is load-bearing and moves to `--axis`. */}
        <line x1={CURVE_X0} y1={SCREEN_TOP - 6} x2={CURVE_X0} y2={SCREEN_BOTTOM + 6} className="stroke-axis" strokeWidth={1} strokeDasharray="2 3" />
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
        {/* Anchored to the right edge rather than offset from the curve's
            maximum: at 18 units "100%" is ~43 wide, and starting it at
            CURVE_X0 + CURVE_MAX_DEVIATION + 14 = 714 put its tail past the
            748-unit viewBox, where the SVG silently clipped it. Lifted above
            the centre-fringe rule so it clears the curve at full intensity. */}
        <text x={VIEW_W - 4} y={CENTER_Y - 6} textAnchor="end" fontSize={18} className="fill-accent font-mono font-semibold">
          {centerPct}%
        </text>
      </svg>
    </div>
  );
}

/**
 * The filled intensity-vs-position band, as a closed path anchored on the
 * zero-intensity baseline at `curveX0`. `maxDeviation` is purely how many SVG
 * units a normalized intensity of 1 is drawn as, which is why the two
 * compositions can pass different values without either of them saying
 * anything different about the physics.
 */
function buildCurvePath(
  samples: ReadonlyArray<{ y: number; normalized: number }>,
  curveX0: number,
  maxDeviation: number
): string {
  const points = samples.map((s) => `${(curveX0 + s.normalized * maxDeviation).toFixed(1)},${s.y.toFixed(1)}`);
  return `M${curveX0},${SCREEN_TOP} L${points.join(" L")} L${curveX0},${SCREEN_BOTTOM} Z`;
}
