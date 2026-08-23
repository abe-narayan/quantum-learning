const SIZE = 300;
const CENTER = SIZE / 2;
const SCALE = 100; // pixels per unit of magnitude

function toScreen(re: number, im: number): { x: number; y: number } {
  return { x: CENTER + re * SCALE, y: CENTER - im * SCALE };
}

/**
 * A pure SVG rendering of a single complex number as a point/vector on
 * the complex plane — axes, a unit-circle reference, the vector itself,
 * and an arc marking its phase. No canvas/WebGL, no animation loop: the
 * whole picture is a deterministic function of `re`/`im`, redrawn on
 * every parent re-render exactly like `BlochSphereCanvas`'s SVG geometry
 * is. Purely decorative relative to `StatePanel`'s text readout, so it's
 * marked `aria-hidden`.
 */
export function ComplexPlaneCanvas({ re, im }: { re: number; im: number }) {
  const point = toScreen(re, im);
  const magnitude = Math.hypot(re, im);
  const phase = Math.atan2(im, re);

  // A short arc from the positive real axis to the vector's angle, radius scaled below 1 unit so it never overlaps the vector itself.
  const arcRadius = 28;
  const arcStart = toScreen(arcRadius / SCALE, 0);
  const arcEnd = { x: CENTER + arcRadius * Math.cos(phase), y: CENTER - arcRadius * Math.sin(phase) };
  const largeArcFlag = Math.abs(phase) > Math.PI ? 1 : 0;
  const sweepFlag = phase < 0 ? 1 : 0;

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full max-w-xs"
      role="img"
      aria-hidden="true"
    >
      {/* Unit circle */}
      <circle cx={CENTER} cy={CENTER} r={SCALE} fill="none" stroke="currentColor" strokeOpacity={0.15} strokeDasharray="4 4" />

      {/* Axes */}
      <line x1={0} y1={CENTER} x2={SIZE} y2={CENTER} stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} />
      <line x1={CENTER} y1={0} x2={CENTER} y2={SIZE} stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} />
      <text x={SIZE - 14} y={CENTER - 8} fontSize={12} fill="currentColor" opacity={0.5}>Re</text>
      <text x={CENTER + 8} y={14} fontSize={12} fill="currentColor" opacity={0.5}>Im</text>

      {/* Phase arc (only drawn once the vector has non-negligible magnitude) */}
      {magnitude > 0.05 ? (
        <path
          d={`M ${arcStart.x} ${arcStart.y} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${sweepFlag} ${arcEnd.x} ${arcEnd.y}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={1.5}
        />
      ) : null}

      {/* The vector itself */}
      <line
        x1={CENTER}
        y1={CENTER}
        x2={point.x}
        y2={point.y}
        stroke="var(--brand)"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <circle cx={point.x} cy={point.y} r={5} fill="var(--brand)" />
      <circle cx={CENTER} cy={CENTER} r={2.5} fill="currentColor" opacity={0.4} />
    </svg>
  );
}
