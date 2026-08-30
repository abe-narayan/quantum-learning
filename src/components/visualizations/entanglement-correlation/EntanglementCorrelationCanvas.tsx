import { cn } from "@/lib/utils";

/**
 * Two compositions of the same figure, chosen on the figure's **own rendered
 * width** rather than the viewport.
 *
 * Why two at all: the wide composition's viewBox is 640 units across and the
 * embedding panel is `rounded-3xl … p-6` inside the lesson's `Container`
 * (`px-4` at phone widths), so on a 320px phone the SVG's own box is only
 * ~240px — a scale of 240/640 = 0.375. Every label in the wide composition
 * then paints between 4.9px and 6.0px, and the previous pass established that
 * typography alone cannot close the gap: the centre caption is already 176
 * units wide inside a 188-unit corridor between the two glyphs, so there is no
 * slack to spend on larger type. The fix has to be a *layout* change, and this
 * file holds both layouts rather than compromising either.
 *
 * Why a container query and not `sm:`: this canvas is mounted inside a lesson
 * panel whose width is a function of the prose column, the panel padding and
 * (at `lg`) a sidebar — not a simple function of the viewport. `@min-[460px]`
 * asks the only question that actually matters, "is my box wide enough for the
 * wide composition", and 460px is where the wide composition's smallest
 * must-read label (13 units) reaches 13 × 460/640 = 9.3px. Below that the
 * narrow composition takes over.
 *
 * Both SVGs are always in the DOM and the inactive one is `display: none`, so
 * assistive tech announces exactly one `role="img"` — the same guarantee a
 * JS-measured swap would give, without the hydration flash or the SSR guess.
 */

const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 320;

const GLYPH_CENTER_Y = 168;
const GLYPH_RADIUS = 78;
const LEFT_CENTER_X = 148;
const RIGHT_CENTER_X = VIEW_WIDTH - 148;

/**
 * The dot's travel is a *fraction* of the glyph radius, not an absolute unit
 * count, and that is load-bearing: the reader reads z off this figure as "how
 * far up the axis, as a fraction of the circle", so the narrow composition's
 * smaller radius (62 vs 78) has to carry a proportionally smaller travel or
 * the same z would render as a different height. Keeping the ratio in one
 * constant is what makes the two compositions read the same number.
 */
const DOT_TRAVEL_FRACTION = 0.82;

/**
 * Narrow composition. Only the *horizontal* budget changes: the two glyphs
 * keep their full side-by-side arrangement (the figure's entire claim is that
 * two separated panels are correlated, so stacking them or hiding one behind a
 * horizontal scroller would cost the point of the figure), but the 176-unit
 * centre caption moves out of the corridor between them and down under the
 * pair, which is what frees the corridor to shrink from 188 units to 56 and
 * the whole box from 640 units to 320.
 *
 * 320 units against a ~240px phone box is a scale of 0.75, so the 14-unit
 * labels paint at 10.5px and the smallest (13-unit) caption at 9.75px — over
 * the ~9px floor with room to spare, against 5.3px and 4.9px before.
 *
 * `max-w-xs` (= 20rem = 320px) caps the SVG at exactly one unit per pixel, so
 * between a 320px and a 459px box the figure stops growing instead of blowing
 * the type up to 20px on its way to the wide composition's threshold.
 */
const NARROW_WIDTH = 320;
const NARROW_HEIGHT = 306;
const NARROW_CENTER_Y = 118;
const NARROW_RADIUS = 62;
const NARROW_LEFT_CENTER_X = 70;
const NARROW_RIGHT_CENTER_X = NARROW_WIDTH - 70;

/** One qubit-holder's glyph: a Bloch-sphere-style z-axis slice, not a full 3D
 * sphere (this component's job is the *correlation* between two distant
 * qubits, not another rotatable Bloch sphere — that already exists). `z`
 * ranges from -1 (south pole, |1>) to +1 (north pole, |0>); 0 (the center)
 * is what a maximally mixed reduced state looks like, which is exactly
 * where each glyph sits before either qubit is measured. */
export type GlyphState = {
  /** Bloch z-coordinate of this qubit's own (reduced) state, in [-1, 1]. */
  z: number;
  /** The definite outcome bit this qubit collapsed to, or null before measurement. */
  bit: 0 | 1 | null;
};

/** Everything that differs between the two compositions, so `Glyph` itself is
 * written once and neither layout can drift away from the other's geometry. */
type GlyphLayout = {
  centerY: number;
  radius: number;
  dotRadius: number;
  holderFontSize: number;
  holderBaselineY: number;
  ketFontSize: number;
  statusFontSize: number;
  /**
   * The narrow composition gives each glyph only ~160 units of horizontal
   * room, and the longest status string, `mixed (z ≈ -0.00)`, is ~143 units at
   * 14 units of monospace — it would clip the left edge and collide with the
   * other glyph's status. Splitting it into a word line and a value line keeps
   * every part under 90 units without dropping a single character of it, which
   * is why the narrow layout can afford full-size status type at all.
   */
  splitStatus: boolean;
};

const WIDE_GLYPH: GlyphLayout = {
  centerY: GLYPH_CENTER_Y,
  radius: GLYPH_RADIUS,
  dotRadius: 9,
  holderFontSize: 16,
  holderBaselineY: 40,
  ketFontSize: 14,
  statusFontSize: 14,
  splitStatus: false,
};

const NARROW_GLYPH: GlyphLayout = {
  centerY: NARROW_CENTER_Y,
  radius: NARROW_RADIUS,
  // 9 × 62/78 ≈ 7.15: the measurement dot is sized off the radius for the same
  // reason its travel is — a dot that kept its 9-unit size inside a 62-unit
  // circle would read as a fatter, less precisely placed marker.
  dotRadius: 7,
  holderFontSize: 15,
  holderBaselineY: 26,
  ketFontSize: 14,
  statusFontSize: 14,
  splitStatus: true,
};

export function EntanglementCorrelationCanvas({
  alice,
  bob,
  isMeasuring,
  collapseFlash,
  prefersReducedMotion,
  className,
}: {
  alice: GlyphState;
  bob: GlyphState;
  isMeasuring: boolean;
  collapseFlash: boolean;
  prefersReducedMotion: boolean;
  className?: string;
}) {
  const ariaLabel = buildAriaLabel(alice, bob, isMeasuring);

  const glyphProps = {
    isMeasuring,
    collapseFlash,
    prefersReducedMotion,
  };

  return (
    // `@container` on the wrapper, never on the SVGs themselves: the variants
    // below have to query an *ancestor's* box, since an element's own
    // inline-size is exactly what container queries refuse to feed back into.
    <div className={cn("@container", className)}>
      {/* Narrow composition — see NARROW_WIDTH above for the measured sizes
          this exists to fix. */}
      <svg
        viewBox={`0 0 ${NARROW_WIDTH} ${NARROW_HEIGHT}`}
        role="img"
        aria-label={ariaLabel}
        className="mx-auto block w-full max-w-xs @min-[460px]:hidden"
      >
        <line
          x1={NARROW_LEFT_CENTER_X + NARROW_RADIUS + 4}
          y1={NARROW_CENTER_Y}
          x2={NARROW_RIGHT_CENTER_X - NARROW_RADIUS - 4}
          y2={NARROW_CENTER_Y}
          className="stroke-muted-foreground"
          strokeWidth={1}
          strokeDasharray="2 6"
          opacity={0.6}
        />

        <Glyph
          centerX={NARROW_LEFT_CENTER_X}
          layout={NARROW_GLYPH}
          holder="Alice (qubit 0)"
          state={alice}
          {...glyphProps}
        />
        <Glyph
          centerX={NARROW_RIGHT_CENTER_X}
          layout={NARROW_GLYPH}
          holder="Bob (qubit 1)"
          state={bob}
          {...glyphProps}
        />

        {/* The two captions the wide composition threads through the corridor
            between the glyphs. Down here they get the full 320-unit width
            instead of a 56-unit gap, which is the whole reason the corridor
            could shrink — and they stay inside the SVG (rather than becoming
            HTML siblings) so this composition keeps a single `role="img"` with
            one aria-label, exactly like the wide one. */}
        {/* `fill-muted-foreground`, not `fill-axis`. These two lines are
            annotation prose: nothing is measured against them and no value is
            read off them. `--axis` is the 4.5:1 token and `--muted-foreground`
            the 6.78:1 one, so putting prose on `--axis` is a contrast *cut*.
            `--axis` stays where it belongs in this file: the glyph circle, the
            dashed z-axis rule, and the |0>/|1> pole labels the dot's height is
            actually read against.

            Effective type. This SVG is `w-full max-w-xs`, so it paints at
            min(box, 320)px against a 320-unit viewBox. Worst case is a 320px
            viewport: 320 - 32 (Container `px-4`) = 288, and this canvas's only
            wrapper is `EntanglementCorrelation`'s `rounded-3xl border p-6`, so
            288 - 2 x (24 + 1) = 238px. 238/320 = 0.744 px per unit, so 15 ->
            11.2px and 13 -> 9.7px: both clear the ~9px floor, the second by
            only 0.7px. It goes to 14 (-> 10.4px) for real margin rather than
            floor-scraping margin. 15 is the ceiling, not 14: at 15 units,
            uppercase with `tracking-wide`, "FAR APART, NO PHYSICAL LINK"
            measures ~15.9 em ~= 239 units in a 320-unit box, and at 14 it is
            ~223, which centred on x = 160 runs 48.5 to 271.5 and clears both
            edges. */}
        <text
          x={NARROW_WIDTH / 2}
          y={272}
          textAnchor="middle"
          fontSize={15}
          className="fill-muted-foreground font-mono"
        >
          one shared state |&#934;&#8314;&#10217;
        </text>
        <text
          x={NARROW_WIDTH / 2}
          y={294}
          textAnchor="middle"
          fontSize={14}
          className="fill-muted-foreground uppercase tracking-wide"
        >
          far apart, no physical link
        </text>
      </svg>

      {/* Wide composition. Its *layout* — viewBox, glyph centres, radius, the
          corridor the captions thread through — is unchanged; its type is not,
          and the comment that used to sit here claimed otherwise. The
          concurrent type pass raised every label in this composition (holder
          13 → 16, kets 12 → 14, status 11 → 14, captions 10 → 14 and 9 → 13)
          and nudged three baselines to follow, which is exactly how the
          second caption came to overflow the corridor above. Do not read this
          block as a frozen copy of the pre-sprint figure. */}
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        role="img"
        aria-label={ariaLabel}
        className="mx-auto hidden w-full max-w-2xl @min-[460px]:block"
      >
        {/* The shared state, drawn as a dashed link — deliberately not a solid
            "wire": nothing physical travels along it, which is the whole point
            of the no-signaling note below the component. */}
        <line
          x1={LEFT_CENTER_X + GLYPH_RADIUS + 4}
          y1={GLYPH_CENTER_Y}
          x2={RIGHT_CENTER_X - GLYPH_RADIUS - 4}
          y2={GLYPH_CENTER_Y}
          className="stroke-muted-foreground"
          strokeWidth={1}
          strokeDasharray="2 6"
          opacity={0.6}
        />
        {/* Same reclassification as the narrow composition's captions above:
            annotation prose belongs on `--muted-foreground` (6.78:1), not on
            `--axis` (4.5:1), which is a step down for text that measures
            nothing. Effective type here is safe by construction: the wide
            composition only renders above a 460px container, and 14 x 460/640
            = 10.1px, 13 x 460/640 = 9.3px. */}
        <text
          x={VIEW_WIDTH / 2}
          y={GLYPH_CENTER_Y - 12}
          textAnchor="middle"
          fontSize={14}
          className="fill-muted-foreground font-mono"
        >
          one shared state |&#934;&#8314;&#10217;
        </text>
        {/* Two lines, not one. The corridor between the glyph circles is only
            ~188 units wide at this height (the circles are r = 78 about
            x = 148 and x = 492), and at 13 units of Geist Sans, uppercase with
            `tracking-wide`, "FAR APART — NO PHYSICAL LINK" measures ~17.25 em
            ≈ 224 units. Centred on x = 320 it therefore ran from 208 to 432 —
            about 16 units into the left circle's stroke on one side and 18 into
            the right circle's on the other, with the caption's letters sitting
            directly on top of an `--axis` outline. It fitted at the 9 units this
            label used to be (~155 units) and stopped fitting when the type pass
            raised it; splitting it is what keeps every character of it at the
            size the pass wanted. Widths at 13 units: "FAR APART" ≈ 76 (282-358),
            "NO PHYSICAL LINK" ≈ 128 (256-384), both clear of the circles, whose
            inner edges are at 224.7/415.3 on the first line's band and
            213.7/426.3 on the second's. */}
        <text
          x={VIEW_WIDTH / 2}
          y={GLYPH_CENTER_Y + 24}
          textAnchor="middle"
          fontSize={13}
          className="fill-muted-foreground uppercase tracking-wide"
        >
          far apart
        </text>
        <text
          x={VIEW_WIDTH / 2}
          y={GLYPH_CENTER_Y + 42}
          textAnchor="middle"
          fontSize={13}
          className="fill-muted-foreground uppercase tracking-wide"
        >
          no physical link
        </text>

        <Glyph
          centerX={LEFT_CENTER_X}
          layout={WIDE_GLYPH}
          holder="Alice (qubit 0)"
          state={alice}
          {...glyphProps}
        />
        <Glyph
          centerX={RIGHT_CENTER_X}
          layout={WIDE_GLYPH}
          holder="Bob (qubit 1)"
          state={bob}
          {...glyphProps}
        />
      </svg>
    </div>
  );
}

function Glyph({
  centerX,
  layout,
  holder,
  state,
  isMeasuring,
  collapseFlash,
  prefersReducedMotion,
}: {
  centerX: number;
  layout: GlyphLayout;
  holder: string;
  state: GlyphState;
  isMeasuring: boolean;
  collapseFlash: boolean;
  prefersReducedMotion: boolean;
}) {
  const { centerY, radius, dotRadius, holderFontSize, holderBaselineY, ketFontSize, statusFontSize } = layout;
  const dotY = centerY - state.z * radius * DOT_TRAVEL_FRACTION;
  const isDefinite = state.bit !== null;
  const status = describeStatus(state, isMeasuring);

  return (
    <g>
      <text
        x={centerX}
        y={holderBaselineY}
        textAnchor="middle"
        fontSize={holderFontSize}
        className="fill-foreground font-semibold"
      >
        {holder}
      </text>

      {/* The glyph's circle bounds the plotted region and the dashed line is
          the z-axis the dot's height is read against: "the dot sits at the
          centre, so this qubit alone has no definite value" is unreadable
          without both. Load-bearing, so `--axis` (≥3:1 on every panel depth
          in both themes) replaces `--border`, the panel-edge token that
          measured 1.41:1 on `--surface-muted` — under the 3:1 WCAG 2.1 SC
          1.4.11 floor. */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        fill="none"
        className="stroke-axis"
        strokeWidth={1.5}
      />
      <line
        x1={centerX}
        y1={centerY - radius}
        x2={centerX}
        y2={centerY + radius}
        className="stroke-axis"
        strokeWidth={1}
        strokeDasharray="3 4"
      />

      <text
        x={centerX}
        y={centerY - radius - 10}
        textAnchor="middle"
        fontSize={ketFontSize}
        className="fill-axis font-mono"
      >
        |0&#10217;
      </text>
      <text
        x={centerX}
        y={centerY + radius + 22}
        textAnchor="middle"
        fontSize={ketFontSize}
        className="fill-axis font-mono"
      >
        |1&#10217;
      </text>

      <circle
        cx={centerX}
        cy={dotY}
        r={dotRadius}
        className={cn(
          isDefinite ? "fill-accent" : "fill-brand",
          "transition-[cy] duration-300 ease-out motion-reduce:transition-none"
        )}
      />
      {isDefinite && collapseFlash ? (
        <circle
          cx={centerX}
          cy={dotY}
          r={dotRadius}
          className="fill-accent animate-ping motion-reduce:animate-none"
          aria-hidden="true"
        />
      ) : null}
      {isMeasuring && !prefersReducedMotion ? (
        <circle
          cx={centerX}
          cy={centerY}
          r={dotRadius}
          className="fill-none stroke-brand animate-pulse motion-reduce:animate-none"
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : null}

      {layout.splitStatus ? (
        <>
          <text
            x={centerX}
            y={centerY + radius + 48}
            textAnchor="middle"
            fontSize={statusFontSize}
            className="fill-foreground font-mono font-semibold"
          >
            {status.word}
          </text>
          {status.value === null ? null : (
            <text
              x={centerX}
              y={centerY + radius + 66}
              textAnchor="middle"
              fontSize={statusFontSize}
              className="fill-foreground font-mono font-semibold"
            >
              {status.value}
            </text>
          )}
        </>
      ) : (
        <text
          x={centerX}
          y={centerY + radius + 48}
          textAnchor="middle"
          fontSize={statusFontSize}
          className="fill-foreground font-mono font-semibold"
        >
          {status.value === null ? status.word : `${status.word} ${status.value}`}
        </text>
      )}
    </g>
  );
}

/**
 * The status readout, split into the word that names the situation and the
 * value that quantifies it. The wide composition rejoins them with a space —
 * reproducing exactly the strings it printed before this pass — while the
 * narrow one stacks them on two lines. Producing both from one function is
 * what keeps the two compositions from ever disagreeing about what a glyph
 * currently says.
 */
function describeStatus(state: GlyphState, isMeasuring: boolean): { word: string; value: string | null } {
  if (isMeasuring) return { word: "measuring…", value: null };
  if (state.bit !== null) return { word: "measured", value: `|${state.bit}⟩` };
  return { word: "mixed", value: `(z ≈ ${state.z.toFixed(2)})` };
}

function describeGlyph(label: string, state: GlyphState): string {
  if (state.bit !== null) return `${label}'s qubit just collapsed to the definite state ket ${state.bit}.`;
  return `${label}'s qubit, on its own, has no definite value yet: its reduced state is maximally mixed (Bloch z near ${state.z.toFixed(2)}).`;
}

function buildAriaLabel(alice: GlyphState, bob: GlyphState, isMeasuring: boolean): string {
  const base = `${describeGlyph("Alice", alice)} ${describeGlyph("Bob", bob)}`;
  if (isMeasuring) return `${base} A joint measurement is in progress.`;
  if (alice.bit !== null && bob.bit !== null) {
    return `${base} Both qubits collapsed together to the same outcome: ${alice.bit}${bob.bit}, exactly as this Bell state's perfect correlation predicts.`;
  }
  return `${base} No measurement has been taken yet.`;
}
