import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { Matrix } from "../matrix";
import { StateVector } from "../state";
import { pureStateDensityMatrix, purity } from "../densityMatrix";
import {
  applyKrausChannel,
  isTracePreserving,
  amplitudeDampingChannel,
  dephasingChannel,
  applyChannelRepeatedly,
  decayProbabilityForTimestep,
} from "../openSystems";

describe("isTracePreserving", () => {
  it("is true for amplitude damping and dephasing at various strengths", () => {
    expect(isTracePreserving(amplitudeDampingChannel(0.3))).toBe(true);
    expect(isTracePreserving(dephasingChannel(0.5))).toBe(true);
    expect(isTracePreserving(amplitudeDampingChannel(0))).toBe(true);
    expect(isTracePreserving(amplitudeDampingChannel(1))).toBe(true);
  });

  it("is false for a non-physical (non-trace-preserving) Kraus set", () => {
    const bad = [new Matrix([[new Complex(2), Complex.ZERO], [Complex.ZERO, Complex.ONE]])];
    expect(isTracePreserving(bad)).toBe(false);
  });
});

describe("dephasingChannel: repeated application decoheres |+> toward the maximally mixed state", () => {
  const plus = new StateVector([new Complex(1 / Math.sqrt(2)), new Complex(1 / Math.sqrt(2))]);
  const rho0 = pureStateDensityMatrix(plus);
  const channel = dephasingChannel(0.3);

  it("off-diagonal coherence strictly decreases with more applications", () => {
    const after1 = applyChannelRepeatedly(rho0, channel, 1);
    const after10 = applyChannelRepeatedly(rho0, channel, 10);
    expect(after10.get(0, 1).magnitude()).toBeLessThan(after1.get(0, 1).magnitude());
  });

  it("purity decays toward 0.5 (maximally mixed) as applications grow", () => {
    const after20 = applyChannelRepeatedly(rho0, channel, 20);
    expect(purity(after20)).toBeCloseTo(0.5, 3);
  });

  it("trace is preserved (still 1) after many applications", () => {
    const after20 = applyChannelRepeatedly(rho0, channel, 20);
    const trace = after20.get(0, 0).add(after20.get(1, 1)).re;
    expect(trace).toBeCloseTo(1, 9);
  });
});

describe("amplitudeDampingChannel: |1><1| decays toward |0><0|", () => {
  const one = new StateVector([Complex.ZERO, Complex.ONE]);
  const rho0 = pureStateDensityMatrix(one);
  const channel = amplitudeDampingChannel(0.2);

  it("P(1) strictly decreases with repeated applications, approaching 0", () => {
    const after1 = applyChannelRepeatedly(rho0, channel, 1);
    const after50 = applyChannelRepeatedly(rho0, channel, 50);
    expect(after50.get(1, 1).re).toBeLessThan(after1.get(1, 1).re);
    expect(after50.get(1, 1).re).toBeLessThan(0.001);
  });

  it("dephasing (gamma=0) leaves the state unchanged", () => {
    const noOp = applyChannelRepeatedly(rho0, amplitudeDampingChannel(0), 10);
    expect(noOp.get(1, 1).re).toBeCloseTo(1, 9);
  });
});

describe("applyKrausChannel", () => {
  it("throws for an empty Kraus set", () => {
    expect(() => applyKrausChannel(Matrix.zeros(2, 2), [])).toThrow();
  });
});

describe("decayProbabilityForTimestep: connects discrete channels to continuous T1/T2 decay", () => {
  const T1 = 50;
  const one = new StateVector([Complex.ZERO, Complex.ONE]);
  const rho0 = pureStateDensityMatrix(one);

  it.each([10, 100, 1000])("N=%i steps over one full T1 gives P(1)=e^-1 exactly", (N) => {
    const dt = T1 / N;
    const gamma = decayProbabilityForTimestep(T1, dt);
    const rhoFinal = applyChannelRepeatedly(rho0, amplitudeDampingChannel(gamma), N);
    expect(rhoFinal.get(1, 1).re).toBeCloseTo(Math.exp(-1), 9);
  });

  it("half a T1 gives P(1)=e^-0.5", () => {
    const N = 200;
    const dt = (T1 / 2) / N;
    const gamma = decayProbabilityForTimestep(T1, dt);
    const rhoFinal = applyChannelRepeatedly(rho0, amplitudeDampingChannel(gamma), N);
    expect(rhoFinal.get(1, 1).re).toBeCloseTo(Math.exp(-0.5), 6);
  });

  it("throws for non-positive characteristicTime or dt", () => {
    expect(() => decayProbabilityForTimestep(0, 1)).toThrow();
    expect(() => decayProbabilityForTimestep(1, 0)).toThrow();
  });
});
