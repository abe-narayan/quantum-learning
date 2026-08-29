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

describe("the discrete channel model reproduces the continuous T1/T2 decay laws", () => {
  // `decayProbabilityForTimestep` exists precisely so that N applications
  // of a channel over total time N*dt reproduce exp(-N*dt/T) *exactly*, not
  // approximately in a fine-stepping limit. These check both decay laws
  // against that closed form at several step counts, which is what ties the
  // Kraus-operator picture to the T1/T2 numbers hardware datasheets quote.
  const excited = pureStateDensityMatrix(new StateVector([Complex.ZERO, Complex.ONE]));
  const plus = pureStateDensityMatrix(new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]));

  it("decays the excited-state population as exp(-t/T1), for any step count reaching the same total time", () => {
    const T1 = 100;
    for (const steps of [10, 50, 200]) {
      const dt = 50 / steps; // total time 50, i.e. t/T1 = 0.5, however finely stepped
      const rho = applyChannelRepeatedly(excited, amplitudeDampingChannel(decayProbabilityForTimestep(T1, dt)), steps);
      expect(rho.get(1, 1).re, `steps=${steps}`).toBeCloseTo(Math.exp(-0.5), 9);
    }
  });

  it("decays the off-diagonal coherence as exp(-t/T2), leaving populations untouched", () => {
    const T2 = 80;
    for (const totalTime of [20, 80, 160]) {
      const steps = 40;
      const dt = totalTime / steps;
      const rho = applyChannelRepeatedly(plus, dephasingChannel(decayProbabilityForTimestep(T2, dt)), steps);
      expect(rho.get(0, 1).re, `t=${totalTime}`).toBeCloseTo(0.5 * Math.exp(-totalTime / T2), 9);
      // Pure dephasing is exactly that: no energy leaves the system.
      expect(rho.get(0, 0).re, `t=${totalTime} population`).toBeCloseTo(0.5, 12);
      expect(rho.get(1, 1).re, `t=${totalTime} population`).toBeCloseTo(0.5, 12);
    }
  });

  it("drives amplitude damping to the ground state and dephasing to the fully-decohered diagonal, its two fixed points", () => {
    const damped = applyChannelRepeatedly(excited, amplitudeDampingChannel(0.3), 200);
    expect(damped.get(0, 0).re).toBeCloseTo(1, 9);
    expect(damped.get(1, 1).re).toBeCloseTo(0, 9);
    expect(purity(damped)).toBeCloseTo(1, 9); // |0><0| is pure: T1 decay ends somewhere definite

    const decohered = applyChannelRepeatedly(plus, dephasingChannel(0.3), 200);
    expect(decohered.get(0, 1).magnitude()).toBeCloseTo(0, 9);
    expect(purity(decohered)).toBeCloseTo(0.5, 9); // T2 decay ends maximally mixed
  });
});
