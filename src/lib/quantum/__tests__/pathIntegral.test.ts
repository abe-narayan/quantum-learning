import { describe, expect, it } from "vitest";
import { euclideanFreeParticleAction, euclideanFreePropagator, discretizedTwoSlicePropagator } from "../pathIntegral";

describe("euclideanFreeParticleAction", () => {
  it("gives m(xf-xi)^2/(2*tau)", () => {
    expect(euclideanFreeParticleAction(1, 0, 1, 1)).toBeCloseTo(0.5, 9);
    expect(euclideanFreeParticleAction(3, -1, 2, 1)).toBeCloseTo((16) / 4, 9);
  });

  it("throws for tau <= 0", () => {
    expect(() => euclideanFreeParticleAction(1, 0, 0, 1)).toThrow();
  });
});

describe("discretizedTwoSlicePropagator matches the exact propagator (Chapman-Kolmogorov composition law)", () => {
  it.each([
    [1, 0, 1],
    [3, -1, 2],
    [0, 0, 0.5],
    [-2, 2, 3],
  ])("xf=%s xi=%s tau=%s", (xf, xi, tau) => {
    const exact = euclideanFreePropagator(xf, xi, tau);
    const discretized = discretizedTwoSlicePropagator(xf, xi, tau, { xRange: 30, steps: 8000 });
    expect(discretized).toBeCloseTo(exact, 6);
  });

  it("relative error is tiny (better than 1e-8) for a well-resolved grid", () => {
    const exact = euclideanFreePropagator(1, 0, 1);
    const discretized = discretizedTwoSlicePropagator(1, 0, 1, { xRange: 20, steps: 8000 });
    expect(Math.abs(exact - discretized) / exact).toBeLessThan(1e-8);
  });
});

describe("euclideanFreePropagator", () => {
  it("is symmetric under xf <-> xi", () => {
    expect(euclideanFreePropagator(2, 0, 1)).toBeCloseTo(euclideanFreePropagator(0, 2, 1), 12);
  });

  it("is maximized at xf=xi (the classical/no-motion path)", () => {
    const atOrigin = euclideanFreePropagator(0, 0, 1);
    const displaced = euclideanFreePropagator(1, 0, 1);
    expect(atOrigin).toBeGreaterThan(displaced);
  });
});
