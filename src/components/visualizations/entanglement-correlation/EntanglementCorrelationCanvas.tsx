import { cn } from "@/lib/utils";

const VIEW_WIDTH = 640;
const VIEW_HEIGHT = 320;

const GLYPH_CENTER_Y = 168;
const GLYPH_RADIUS = 78;
const LEFT_CENTER_X = 148;
const RIGHT_CENTER_X = VIEW_WIDTH - 148;
const DOT_TRAVEL = GLYPH_RADIUS * 0.82;

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

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("w-full max-w-2xl mx-auto", className)}
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
      <text
        x={VIEW_WIDTH / 2}
        y={GLYPH_CENTER_Y - 10}
        textAnchor="middle"
        className="fill-muted-foreground text-[10px] font-mono"
      >
        one shared state |&#934;&#8314;&#10217;
      </text>
      <text
        x={VIEW_WIDTH / 2}
        y={GLYPH_CENTER_Y + 20}
        textAnchor="middle"
        className="fill-muted-foreground text-[9px] uppercase tracking-wide"
      >
        far apart — no physical link
      </text>

      <Glyph
        centerX={LEFT_CENTER_X}
        holder="Alice — qubit 0"
        state={alice}
        isMeasuring={isMeasuring}
        collapseFlash={collapseFlash}
        prefersReducedMotion={prefersReducedMotion}
      />
      <Glyph
        centerX={RIGHT_CENTER_X}
        holder="Bob — qubit 1"
        state={bob}
        isMeasuring={isMeasuring}
        collapseFlash={collapseFlash}
        prefersReducedMotion={prefersReducedMotion}
      />
    </svg>
  );
}

function Glyph({
  centerX,
  holder,
  state,
  isMeasuring,
  collapseFlash,
  prefersReducedMotion,
}: {
  centerX: number;
  holder: string;
  state: GlyphState;
  isMeasuring: boolean;
  collapseFlash: boolean;
  prefersReducedMotion: boolean;
}) {
  const dotY = GLYPH_CENTER_Y - state.z * DOT_TRAVEL;
  const isDefinite = state.bit !== null;

  return (
    <g>
      <text
        x={centerX}
        y={40}
        textAnchor="middle"
        className="fill-foreground text-[13px] font-semibold"
      >
        {holder}
      </text>

      <circle
        cx={centerX}
        cy={GLYPH_CENTER_Y}
        r={GLYPH_RADIUS}
        fill="none"
        className="stroke-border"
        strokeWidth={1.5}
      />
      <line
        x1={centerX}
        y1={GLYPH_CENTER_Y - GLYPH_RADIUS}
        x2={centerX}
        y2={GLYPH_CENTER_Y + GLYPH_RADIUS}
        className="stroke-border"
        strokeWidth={1}
        strokeDasharray="3 4"
      />

      <text
        x={centerX}
        y={GLYPH_CENTER_Y - GLYPH_RADIUS - 10}
        textAnchor="middle"
        className="fill-muted-foreground font-mono text-[12px]"
      >
        |0&#10217;
      </text>
      <text
        x={centerX}
        y={GLYPH_CENTER_Y + GLYPH_RADIUS + 20}
        textAnchor="middle"
        className="fill-muted-foreground font-mono text-[12px]"
      >
        |1&#10217;
      </text>

      <circle
        cx={centerX}
        cy={dotY}
        r={9}
        className={cn(
          isDefinite ? "fill-accent" : "fill-brand",
          "transition-[cy] duration-300 ease-out motion-reduce:transition-none"
        )}
      />
      {isDefinite && collapseFlash ? (
        <circle
          cx={centerX}
          cy={dotY}
          r={9}
          className="fill-accent animate-ping motion-reduce:animate-none"
          aria-hidden="true"
        />
      ) : null}
      {isMeasuring && !prefersReducedMotion ? (
        <circle
          cx={centerX}
          cy={GLYPH_CENTER_Y}
          r={9}
          className="fill-none stroke-brand animate-pulse motion-reduce:animate-none"
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : null}

      <text
        x={centerX}
        y={GLYPH_CENTER_Y + GLYPH_RADIUS + 44}
        textAnchor="middle"
        className="fill-foreground text-[11px] font-mono font-semibold"
      >
        {isMeasuring ? "measuring…" : isDefinite ? `measured |${state.bit}⟩` : `mixed (z ≈ ${state.z.toFixed(2)})`}
      </text>
    </g>
  );
}

function describeGlyph(label: string, state: GlyphState): string {
  if (state.bit !== null) return `${label}'s qubit just collapsed to the definite state ket ${state.bit}.`;
  return `${label}'s qubit, on its own, has no definite value yet — its reduced state is maximally mixed (Bloch z near ${state.z.toFixed(2)}).`;
}

function buildAriaLabel(alice: GlyphState, bob: GlyphState, isMeasuring: boolean): string {
  const base = `${describeGlyph("Alice", alice)} ${describeGlyph("Bob", bob)}`;
  if (isMeasuring) return `${base} A joint measurement is in progress.`;
  if (alice.bit !== null && bob.bit !== null) {
    return `${base} Both qubits collapsed together to the same outcome: ${alice.bit}${bob.bit}, exactly as this Bell state's perfect correlation predicts.`;
  }
  return `${base} No measurement has been taken yet.`;
}
