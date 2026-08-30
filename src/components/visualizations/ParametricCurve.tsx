import { ParametricCurveView, type CurveFrame, type CurveSeries } from "./ParametricCurveView";

export type { CurveFrame, CurveSeries };

/**
 * ============================================================
 * ParametricCurve — the server half
 * ============================================================
 * `ParametricCurveView` is a Client Component, so every number in `frames`
 * is serialized into the page's flight payload on the way into it. Lessons
 * generate those frames with real arithmetic, and JavaScript prints a double
 * with every digit it needs to round-trip: one sample of one curve arrives as
 *
 *     {"x":3.8523489932885906,"y":-0.9880153329307066}
 *
 * about 55 bytes for two numbers.
 *
 * On
 * `quantum-mastery/symmetry-scattering-and-semiclassical-methods/three-dimensional-scattering-and-the-s-matrix`
 * that was 34,630 numbers carrying eight or more decimal places — 608KB, 39%
 * of a 1,565KB document, the heaviest page on the site by a factor of two and
 * a half over the next lesson.
 *
 * **None of that precision is rendered.** The view writes its path as
 * `px(p.x).toFixed(1)` in a 480 x 220 viewBox, and its tick labels with
 * `toPrecision(3)`. Its own output is quantized to a tenth of a viewBox unit
 * — about 0.15 CSS pixels on the widest desktop figure (~700px) — before a
 * pixel is painted.
 *
 * So this wrapper rounds each coordinate to the last digit the view can
 * distinguish, and does it *here*, on the server, because the cost is
 * incurred crossing the boundary: rounding inside the view would shrink
 * nothing.
 *
 * Measured on that page, against the rendered HTML: the coordinate text went
 * from 611KB to 242.5KB (mean 17.1 characters a number to 6.8), the document
 * from 1,610KB to 1,243KB raw, 264.3KB to 162.8KB gzip, 175.1KB to 88.9KB
 * brotli. Every `<text>` element — tick labels, axis names, reference-line
 * labels — is byte-identical, and one path coordinate out of 1,315 moved, by
 * exactly the 0.1 viewBox units `toFixed(1)` already quantizes to.
 * `__tests__/parametricCurvePrecision.test.ts` holds both halves of that.
 *
 * Registering another MDX component name would have cost one of the 30-entry
 * budget in `src/mdx-components.tsx` (27 used). Splitting the existing one
 * into a server shell and a client view costs none: the mapping still points
 * at `ParametricCurve`, at the same path, with the same props, and every
 * lesson in the corpus gets the reduction without being edited — which
 * matters, because the second-heaviest page
 * (`quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers`) is a
 * different author's file.
 */

/** The view's viewBox. Used as an upper bound on the plot rect, which is
 *  strictly smaller (the axis gutters take a bite out of it), so the
 *  precision derived below is if anything finer than needed. */
const VIEWBOX_WIDTH = 480;
const VIEWBOX_HEIGHT = 220;

/**
 * How far a rounded point may move, in viewBox units.
 *
 * A hundredth of the view's own `toFixed(1)` step, which is the coarsest
 * thing between the data and the screen. Concretely, at the widest the figure
 * is ever drawn (~700px CSS for a 480-unit viewBox, so 1.46 CSS px per unit)
 * this bounds the displacement at 0.0015 CSS pixels — 1/230th of a device
 * pixel on a 3x display.
 *
 * That is deliberately far tighter than "the same rendered pixel" requires,
 * and the reason is the interaction with `toFixed(1)` rather than the
 * displacement itself: a point already sitting within this distance of a
 * tenth-of-a-unit boundary can be rounded across it, and then the emitted
 * path coordinate moves by a whole step (0.1 units, ~0.15 CSS px, under half
 * a device pixel at 3x). The tolerance is what sets how often that happens —
 * roughly `20 x tolerance` of vertices, so ~2% here — and each occurrence is
 * the same sub-pixel motion the view already applies to the exact data. It is
 * a fifth of a decimal digit's worth of payload to buy a factor of ten, so it
 * is bought.
 */
const TOLERANCE_UNITS = 0.001;

/**
 * Significant digits kept regardless of the tolerance above.
 *
 * Purely defensive now that `roundInDomain` pins the axis endpoints, and
 * cheap: it binds only on values so close to zero that the tolerance's own
 * step has no digits left to hold, and it is what makes "no sample is ever
 * quietly annihilated" true rather than merely likely — zero is the one value
 * `formatTick` treats as a special case. Four, against the three
 * `toPrecision(3)` consumes and the two `toExponential(1)` consumes, so a
 * printed string could not turn on the last digit kept even if one of these
 * values ever reached a label.
 */
const SIGNIFICANT_DIGIT_FLOOR = 4;

/**
 * The largest step a coordinate may be moved by, in data units, for a plot of
 * `extent` viewBox units showing a data range of `span`. Rounding to a step
 * `q` has a worst-case error of `q / 2`, which the plot magnifies by
 * `extent / span`, and that product is what `TOLERANCE_UNITS` bounds.
 */
function quantumFor(span: number, extent: number): number | null {
  // A degenerate or non-finite span has no scale to reason about, and the
  // view has its own handling for it. Round nothing.
  if (!Number.isFinite(span) || span <= 0) return null;
  return 2 * TOLERANCE_UNITS * (span / extent);
}

/**
 * `value`, rounded to a step of `quantum`.
 *
 * Expressed in *significant* digits rather than decimal places, which is the
 * same rounding said in the units the number is actually stored in. Decimal
 * places break down at both ends of the corpus's range: a fidelity curve
 * covering 0.98446 to 1 needs six of them to keep its shape, and a
 * path-integral amplitude around 1e-27 would need thirty-three, past the
 * point where a double has digits to drop and past `toFixed`'s own limit.
 * Significant digits are scale-free, so one rule covers both.
 *
 * `k = floor(log10|v|) + 1 + ceil(-log10 q)` is exactly the number of
 * significant digits that rounding to a step of `q` would leave on a value of
 * this magnitude, so this is a restatement, not an approximation.
 */
function round(value: number, quantum: number | null): number {
  if (quantum === null || value === 0 || !Number.isFinite(value)) return value;
  const magnitude = Math.floor(Math.log10(Math.abs(value)));
  const digits = magnitude + 1 + Math.ceil(-Math.log10(quantum));
  if (!Number.isFinite(digits)) return value;
  // `toPrecision` accepts 1..100. Past 100 digits there is nothing left of a
  // double to round anyway, so clamping only makes the call legal.
  return Number(value.toPrecision(Math.min(100, Math.max(SIGNIFICANT_DIGIT_FLOOR, digits))));
}

type Axis = { min: number; max: number; span: number };

/** Min/max over `values`, or null if there is nothing finite to measure. */
function extent(values: number[]): Axis | null {
  const finite = values.filter((value) => Number.isFinite(value));
  if (finite.length === 0) return null;
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  return { min, max, span: max - min };
}

/**
 * The domain the *plot* is scaled to, which is not the extent of every point.
 * `excludeFromDomain` series (a wall, a threshold rule) are drawn clamped and
 * have no say in the axis, so counting them would overstate the range and
 * under-round. Mirrors the view's own derivation, including its fallback to
 * all points when every series opts out.
 */
function scalingSeries(frames: CurveFrame[]): CurveSeries[] {
  const all: CurveSeries[] = frames.flatMap((frame) => frame.series);
  const scaling = all.filter((series) => !series.excludeFromDomain);
  return scaling.length > 0 ? scaling : all;
}

/**
 * A coordinate of a series that sets the axis, rounded but pinned inside the
 * domain it came from.
 *
 * **The axis is never rounded, only the samples inside it.** Everything the
 * view computes from `min`/`max` is either typography or geometry that a
 * fractional change would show: `formatTick` prints the endpoints and the
 * midpoint, `padLeft` is sized from the *character length* of the widest of
 * those labels, and `xOf`/`yOf` map the whole curve into what is left. On the
 * hard-sphere lesson the free-wave figure runs y = -0.99999994 to 0.99999994,
 * so its midpoint is a cancellation residue that `formatTick` prints as
 * "3.7×10⁻⁸" — nine characters of gutter for a number that is zero. Rounding
 * the endpoints to a five-figure -1 and 1 turns that label into "0", which
 * hands the plot 58 viewBox units it did not have before: a better figure,
 * and a different one. Keeping the extremes exact keeps every label, the
 * gutter, and therefore the plot rect byte-identical, and costs four numbers
 * per figure.
 *
 * The clamp is the other half of the same promise: a sample just inside an
 * endpoint could otherwise round *past* it and become the new extreme.
 */
function roundInDomain(value: number, quantum: number | null, axis: Axis | null): number {
  if (axis === null) return round(value, quantum);
  if (value === axis.min || value === axis.max) return value;
  return Math.min(axis.max, Math.max(axis.min, round(value, quantum)));
}

/** `frames`, with every coordinate rounded to the precision the view can
 *  draw. Exported for the test that pins the rendered figure to the
 *  unrounded one. */
export function roundFrames(frames: CurveFrame[]): CurveFrame[] {
  const scaling = new Set(scalingSeries(frames));
  const points = [...scaling].flatMap((series) => series.points);
  const xAxis = extent(points.map((point) => point.x));
  const yAxis = extent(points.map((point) => point.y));
  const xQuantum = quantumFor(xAxis?.span ?? 0, VIEWBOX_WIDTH);
  const yQuantum = quantumFor(yAxis?.span ?? 0, VIEWBOX_HEIGHT);
  if (xQuantum === null && yQuantum === null) return frames;

  return frames.map((frame) => ({
    ...frame,
    series: frame.series.map((series) => {
      // A series outside the domain is drawn clamped to the plot rect, so its
      // values have no say in anything and need no pinning — but they still
      // travel, so they still get rounded.
      const sets = scaling.has(series);
      return {
        ...series,
        points: series.points.map((point) => ({
          x: sets ? roundInDomain(point.x, xQuantum, xAxis) : round(point.x, xQuantum),
          y: sets ? roundInDomain(point.y, yQuantum, yAxis) : round(point.y, yQuantum),
        })),
      };
    }),
  }));
}

/**
 * A slider-driven line plot over a set of precomputed frames. See
 * `./ParametricCurveView.tsx` for what it draws and how; this file only
 * decides how precisely the samples are worth sending.
 */
export function ParametricCurve({
  frames,
  ...rest
}: React.ComponentProps<typeof ParametricCurveView>) {
  return <ParametricCurveView frames={roundFrames(frames)} {...rest} />;
}
