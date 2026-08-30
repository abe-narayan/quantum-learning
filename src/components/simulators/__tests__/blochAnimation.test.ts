import { describe, expect, it } from "vitest";
import { slerpBlochVector } from "../bloch-sphere/useAnimatedBlochPoint";
import type { BlochVector } from "@/lib/quantum/bloch";
import { blochStateFromAngles, densityMatrixToBlochVector, stateToBlochVector } from "@/lib/quantum/bloch";
import { pureStateDensityMatrix } from "@/lib/quantum/densityMatrix";
import { applyKrausChannel, amplitudeDampingChannel, dephasingChannel } from "@/lib/quantum/openSystems";
import { STATE_PRESETS } from "../bloch-sphere/presets";

/**
 * The Bloch-sphere *animation*, tested against the same physical invariant
 * `lib/quantum/__tests__/physicalInvariants.test.ts` already enforces on the
 * engine: a state's Bloch vector never leaves the ball, and a noise channel
 * never lengthens it.
 *
 * Those engine tests pass while the drawn arrow does something the engine
 * cannot, because every frame between two engine-computed endpoints is
 * produced here, by `slerpBlochVector`, and nothing was checking it. Three
 * of the fourteen simulators draw a Bloch vector through this function, and
 * two of them (Noise, Density Matrix) feed it genuinely mixed states, whose
 * vectors are shorter than 1 and whose length is the entire reading.
 */

const length = (v: BlochVector) => Math.hypot(v.x, v.y, v.z);

function sampleTween(a: BlochVector, b: BlochVector, steps = 64): BlochVector[] {
  return Array.from({ length: steps + 1 }, (_, i) => slerpBlochVector(a, b, i / steps));
}

describe("slerpBlochVector", () => {
  it("keeps a pure state's vector on the sphere's surface, including through an antipodal reset", () => {
    const pairs: [BlochVector, BlochVector][] = [
      [{ x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }], // |0> -> |1>, the antipodal case
      [{ x: 0, y: 0, z: 1 }, { x: 1, y: 0, z: 0 }], // |0> -> |+>
      [{ x: 1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }], // |+> -> |+i>
      [{ x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: 1 }], // no movement at all
    ];
    for (const [a, b] of pairs) {
      for (const point of sampleTween(a, b)) {
        expect(length(point)).toBeCloseTo(1, 9);
      }
    }
  });

  it("hits both endpoints exactly", () => {
    for (const preset of STATE_PRESETS) {
      const a = stateToBlochVector(blochStateFromAngles(preset.angles));
      const b = { x: 0.13, y: -0.42, z: 0.2 };
      const start = slerpBlochVector(a, b, 0);
      const end = slerpBlochVector(a, b, 1);
      expect(start.x).toBeCloseTo(a.x, 12);
      expect(start.y).toBeCloseTo(a.y, 12);
      expect(start.z).toBeCloseTo(a.z, 12);
      expect(end.x).toBeCloseTo(b.x, 12);
      expect(end.y).toBeCloseTo(b.y, 12);
      expect(end.z).toBeCloseTo(b.z, 12);
    }
  });

  /**
   * The regression this file exists for. The engine's own invariant test
   * says a noise channel never lengthens the Bloch vector; the tween between
   * two of its consecutive outputs was lengthening it anyway, because the
   * slerp weights sin((1-t)θ)/sinθ and sin(tθ)/sinθ only sum to 1 when a and
   * b are unit vectors, and these are not. On the Noise Explorer's opening
   * configuration the arrow swelled from |r| = 0.377 out to |r| = 0.468
   * before shrinking to 0.321: 24% growth, drawn in the one instrument whose
   * subject is decoherence shrinking that arrow.
   */
  it("never lengthens a decaying Bloch vector mid-tween, for either noise channel", () => {
    for (const preset of STATE_PRESETS) {
      for (const channel of [dephasingChannel(0.15), amplitudeDampingChannel(0.15), dephasingChannel(0.5)]) {
        let rho = pureStateDensityMatrix(blochStateFromAngles(preset.angles));
        const vectors = [densityMatrixToBlochVector(rho)];
        for (let step = 0; step < 40; step++) {
          rho = applyKrausChannel(rho, channel);
          vectors.push(densityMatrixToBlochVector(rho));
        }
        for (let step = 0; step + 1 < vectors.length; step++) {
          const a = vectors[step];
          const b = vectors[step + 1];
          const hi = Math.max(length(a), length(b));
          const lo = Math.min(length(a), length(b));
          for (const point of sampleTween(a, b)) {
            expect(length(point)).toBeLessThanOrEqual(hi + 1e-9);
            expect(length(point)).toBeGreaterThanOrEqual(lo - 1e-9);
            // And never outside the Bloch ball, which is the same bound the
            // engine's own invariant test enforces on every rho it builds.
            expect(length(point)).toBeLessThanOrEqual(1 + 1e-9);
          }
        }
      }
    }
  });

  it("interpolates a mixed state's length monotonically between the two endpoints", () => {
    const a: BlochVector = { x: 0.8, y: 0, z: 0 };
    const b: BlochVector = { x: 0, y: 0, z: 0.2 };
    const lengths = sampleTween(a, b).map(length);
    for (let i = 1; i < lengths.length; i++) {
      expect(lengths[i]).toBeLessThanOrEqual(lengths[i - 1] + 1e-12);
    }
    expect(lengths[0]).toBeCloseTo(0.8, 12);
    expect(lengths[lengths.length - 1]).toBeCloseTo(0.2, 12);
  });

  it("stays at the centre when both endpoints are the maximally mixed state", () => {
    const centre: BlochVector = { x: 0, y: 0, z: 0 };
    for (const point of sampleTween(centre, centre)) {
      expect(Number.isFinite(length(point))).toBe(true);
      expect(length(point)).toBeCloseTo(0, 12);
    }
  });

  it("travels straight out from the centre when one endpoint is the centre", () => {
    const centre: BlochVector = { x: 0, y: 0, z: 0 };
    const edge: BlochVector = { x: 0, y: 0.6, z: -0.8 };
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      const point = slerpBlochVector(centre, edge, t);
      expect(length(point)).toBeCloseTo(t * length(edge), 12);
      if (t > 0) {
        // Same direction as `edge` the whole way, never a detour.
        const cosine = (point.x * edge.x + point.y * edge.y + point.z * edge.z) / (length(point) * length(edge));
        expect(cosine).toBeCloseTo(1, 9);
      }
    }
  });
});
