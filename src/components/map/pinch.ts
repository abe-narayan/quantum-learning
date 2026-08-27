/**
 * Pure pan/zoom math for the concept map's viewport.
 *
 * Split out of `ConceptMapExplorer.tsx` because this is the part that is easy
 * to get subtly wrong (anchor drift, clamping applied at the wrong moment,
 * a stale pinch pair after a finger lifts) and impossible to test while it
 * lives inside pointer-event handlers. Nothing here touches the DOM or React.
 *
 * Coordinate systems
 * ------------------
 * - **client**: `event.clientX/Y`, relative to the browser viewport.
 * - **local**: relative to the map viewport element's top-left corner
 *   (`client - rect.left/top`).
 * - **world** (a.k.a. graph space): the coordinate system `buildConceptGraph`
 *   lays nodes out in.
 *
 * The rendered wrapper uses `origin-top-left` with
 * `translate(t.x, t.y) scale(t.scale)`, so the mapping is exactly
 *
 *     local = world * scale + t
 *     world = (local - t) / scale
 *
 * Every function below is derived from that one identity.
 */

export const MIN_SCALE = 0.4;
export const MAX_SCALE = 1.75;

export type Point = { x: number; y: number };
export type Transform = { x: number; y: number; scale: number };
export type Rect = { left: number; top: number };

/**
 * The single clamp used by *every* zoom path — pinch, the +/- buttons and the
 * wheel — so the three can never disagree about how far in or out the map goes.
 */
export function clampScale(scale: number): number {
  // NaN would survive both Math.min and Math.max and poison the transform;
  // ±Infinity is fine to clamp normally (it saturates at the right end).
  if (Number.isNaN(scale)) return MIN_SCALE;
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

export function pointerDistance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** local point -> world point, under `transform`. */
export function toWorld(local: Point, transform: Transform): Point {
  return {
    x: (local.x - transform.x) / transform.scale,
    y: (local.y - transform.y) / transform.scale,
  };
}

/**
 * A pinch gesture in progress. `pointerIds` is part of the state on purpose:
 * a gesture is only valid for the exact pair of pointers it was seeded from,
 * so a third finger landing (or one of the original two lifting while a
 * different one stays down) forces a re-seed instead of silently re-reading
 * `startDist` against a different pair — which is what makes the map jump.
 */
export type PinchState = {
  pointerIds: readonly [number, number];
  /** Never zero: a degenerate two-finger distance would divide to Infinity. */
  startDist: number;
  startScale: number;
  /** The world point under the pinch's midpoint, held fixed for the gesture. */
  worldX: number;
  worldY: number;
  /** Cached at gesture start — the viewport's screen position cannot change
   *  mid-gesture (the element is `touch-none`, so the page cannot scroll
   *  under the fingers), and re-reading it per pointermove would force a
   *  layout on every frame. */
  rectLeft: number;
  rectTop: number;
};

export function beginPinch(
  a: Point,
  b: Point,
  pointerIds: readonly [number, number],
  rect: Rect,
  transform: Transform
): PinchState {
  const mid = midpoint(a, b);
  const local = { x: mid.x - rect.left, y: mid.y - rect.top };
  const world = toWorld(local, transform);
  return {
    pointerIds,
    // Two fingers can land on (near) the same pixel; a floor of 1 keeps the
    // ratio finite instead of producing Infinity on the first move.
    startDist: Math.max(pointerDistance(a, b), 1),
    startScale: transform.scale,
    worldX: world.x,
    worldY: world.y,
    rectLeft: rect.left,
    rectTop: rect.top,
  };
}

/**
 * Anchor-preserving pinch: the world point captured at gesture start stays
 * exactly under the fingers' midpoint, at the clamped scale. The clamp is
 * applied *before* the translation is solved, so a pinch that runs past
 * MIN/MAX_SCALE still tracks the fingers rather than drifting away from them.
 */
export function applyPinch(pinch: PinchState, a: Point, b: Point): Transform {
  const scale = clampScale(pinch.startScale * (pointerDistance(a, b) / pinch.startDist));
  const mid = midpoint(a, b);
  const localX = mid.x - pinch.rectLeft;
  const localY = mid.y - pinch.rectTop;
  return {
    x: localX - pinch.worldX * scale,
    y: localY - pinch.worldY * scale,
    scale,
  };
}

/**
 * Zoom to `nextScale` while holding the local point (`anchorX`, `anchorY`)
 * still — used by the +/- buttons (anchored on the viewport's centre, so the
 * thing you were looking at stays put) and by the wheel (anchored under the
 * cursor). Same clamp as `applyPinch`.
 */
export function zoomAbout(
  transform: Transform,
  nextScale: number,
  anchorX: number,
  anchorY: number
): Transform {
  const scale = clampScale(nextScale);
  const world = toWorld({ x: anchorX, y: anchorY }, transform);
  return {
    x: anchorX - world.x * scale,
    y: anchorY - world.y * scale,
    scale,
  };
}

/**
 * True when `pinch` was seeded from exactly `pointerIds`, in order. Callers
 * re-seed when this is false rather than reusing a gesture whose pair changed.
 */
export function pinchMatchesPointers(
  pinch: PinchState | null,
  pointerIds: readonly [number, number]
): boolean {
  if (!pinch) return false;
  return pinch.pointerIds[0] === pointerIds[0] && pinch.pointerIds[1] === pointerIds[1];
}
