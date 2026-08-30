import { describe, expect, it } from "vitest";
import {
  MAX_SCALE,
  MIN_SCALE,
  applyPinch,
  beginPinch,
  clampScale,
  pinchMatchesPointers,
  pointerDistance,
  toWorld,
  zoomAbout,
  type Point,
  type Transform,
} from "../pinch";

const RECT = { left: 100, top: 50 };
const IDS = [1, 2] as const;

/**
 * The property every zoom path has to satisfy: the world point that was under
 * a given local point before the change is still under it afterwards.
 */
function localOf(world: Point, transform: Transform): Point {
  return {
    x: world.x * transform.scale + transform.x,
    y: world.y * transform.scale + transform.y,
  };
}

describe("clampScale", () => {
  it("bounds the scale to [MIN_SCALE, MAX_SCALE]", () => {
    expect(clampScale(0.01)).toBe(MIN_SCALE);
    expect(clampScale(99)).toBe(MAX_SCALE);
    expect(clampScale(1)).toBe(1);
  });

  it("does not let a degenerate pinch produce NaN or Infinity", () => {
    expect(clampScale(Number.NaN)).toBe(MIN_SCALE);
    expect(clampScale(Number.POSITIVE_INFINITY)).toBe(MAX_SCALE);
    expect(clampScale(Number.NEGATIVE_INFINITY)).toBe(MIN_SCALE);
  });
});

describe("beginPinch", () => {
  const transform: Transform = { x: -200, y: 30, scale: 0.85 };

  it("captures the world point under the pinch midpoint", () => {
    const a = { x: 300, y: 250 };
    const b = { x: 500, y: 250 };
    const pinch = beginPinch(a, b, IDS, RECT, transform);

    // Midpoint in local coords is (400 - 100, 250 - 50) = (300, 200).
    expect(pinch.worldX).toBeCloseTo((300 - transform.x) / transform.scale, 10);
    expect(pinch.worldY).toBeCloseTo((200 - transform.y) / transform.scale, 10);
    expect(pinch.startDist).toBeCloseTo(200, 10);
    expect(pinch.startScale).toBe(0.85);
  });

  it("floors a degenerate two-finger distance so the ratio stays finite", () => {
    const same = { x: 300, y: 300 };
    const pinch = beginPinch(same, same, IDS, RECT, transform);
    expect(pinch.startDist).toBe(1);
    const next = applyPinch(pinch, { x: 200, y: 300 }, { x: 400, y: 300 });
    expect(Number.isFinite(next.scale)).toBe(true);
    expect(next.scale).toBe(MAX_SCALE);
  });
});

describe("applyPinch", () => {
  const transform: Transform = { x: -200, y: 30, scale: 0.8 };
  const a0 = { x: 300, y: 250 };
  const b0 = { x: 500, y: 250 };

  it("scales by the ratio of finger distances", () => {
    const pinch = beginPinch(a0, b0, IDS, RECT, transform);
    // Fingers spread from 200px apart to 300px apart -> 1.5x.
    const next = applyPinch(pinch, { x: 250, y: 250 }, { x: 550, y: 250 });
    expect(next.scale).toBeCloseTo(0.8 * 1.5, 10);
  });

  it("keeps the anchored world point under the finger midpoint", () => {
    const pinch = beginPinch(a0, b0, IDS, RECT, transform);
    // Spread *and* drag the whole gesture down-right.
    const a1 = { x: 330, y: 320 };
    const b1 = { x: 610, y: 320 };
    const next = applyPinch(pinch, a1, b1);

    const expectedLocal = { x: (330 + 610) / 2 - RECT.left, y: (320 + 320) / 2 - RECT.top };
    const actualLocal = localOf({ x: pinch.worldX, y: pinch.worldY }, next);
    expect(actualLocal.x).toBeCloseTo(expectedLocal.x, 8);
    expect(actualLocal.y).toBeCloseTo(expectedLocal.y, 8);
  });

  it("is a no-op when the fingers have not moved", () => {
    const pinch = beginPinch(a0, b0, IDS, RECT, transform);
    const next = applyPinch(pinch, a0, b0);
    expect(next.scale).toBeCloseTo(transform.scale, 10);
    expect(next.x).toBeCloseTo(transform.x, 8);
    expect(next.y).toBeCloseTo(transform.y, 8);
  });

  it("still tracks the fingers once the scale saturates at MAX_SCALE", () => {
    const pinch = beginPinch(a0, b0, IDS, RECT, transform);
    // 200px -> 2000px would be 8x; clamped well past MAX_SCALE.
    const a1 = { x: -600, y: 400 };
    const b1 = { x: 1400, y: 400 };
    const next = applyPinch(pinch, a1, b1);

    expect(next.scale).toBe(MAX_SCALE);
    const expectedLocal = { x: (a1.x + b1.x) / 2 - RECT.left, y: 400 - RECT.top };
    const actualLocal = localOf({ x: pinch.worldX, y: pinch.worldY }, next);
    expect(actualLocal.x).toBeCloseTo(expectedLocal.x, 8);
    expect(actualLocal.y).toBeCloseTo(expectedLocal.y, 8);
  });

  it("clamps at MIN_SCALE when the fingers close together", () => {
    const pinch = beginPinch(a0, b0, IDS, RECT, transform);
    const next = applyPinch(pinch, { x: 399, y: 250 }, { x: 401, y: 250 });
    expect(next.scale).toBe(MIN_SCALE);
  });
});

describe("zoomAbout", () => {
  const transform: Transform = { x: -200, y: 30, scale: 0.9 };

  it("holds the anchor point still (button zoom, viewport centre)", () => {
    const next = zoomAbout(transform, transform.scale + 0.15, 400, 280);
    const world = toWorld({ x: 400, y: 280 }, transform);
    const actualLocal = localOf(world, next);
    expect(actualLocal.x).toBeCloseTo(400, 8);
    expect(actualLocal.y).toBeCloseTo(280, 8);
  });

  it("uses the same clamp as applyPinch", () => {
    expect(zoomAbout(transform, 99, 0, 0).scale).toBe(MAX_SCALE);
    expect(zoomAbout(transform, -5, 0, 0).scale).toBe(MIN_SCALE);
  });

  it("holds the anchor even when the requested scale is clamped away", () => {
    const next = zoomAbout(transform, 99, 400, 280);
    const world = toWorld({ x: 400, y: 280 }, transform);
    const actualLocal = localOf(world, next);
    expect(actualLocal.x).toBeCloseTo(400, 8);
    expect(actualLocal.y).toBeCloseTo(280, 8);
  });
});

describe("pinchMatchesPointers", () => {
  const pinch = beginPinch({ x: 0, y: 0 }, { x: 100, y: 0 }, IDS, RECT, {
    x: 0,
    y: 0,
    scale: 1,
  });

  it("accepts the pair it was seeded from", () => {
    expect(pinchMatchesPointers(pinch, [1, 2])).toBe(true);
  });

  it("rejects a changed pair, so the caller re-seeds instead of jumping", () => {
    // A third finger landed and is now first in pointer order.
    expect(pinchMatchesPointers(pinch, [3, 1])).toBe(false);
    // One of the original two lifted; a different finger took its slot.
    expect(pinchMatchesPointers(pinch, [1, 3])).toBe(false);
    // Same ids, swapped order, still a re-seed, since startDist/anchor were
    // derived from a specific (a, b) assignment.
    expect(pinchMatchesPointers(pinch, [2, 1])).toBe(false);
    expect(pinchMatchesPointers(null, [1, 2])).toBe(false);
  });
});

describe("pointerDistance", () => {
  it("is the euclidean distance between two client points", () => {
    expect(pointerDistance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
  });
});
