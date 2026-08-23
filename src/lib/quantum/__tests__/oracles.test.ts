import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { StateVector } from "../state";
import { applyBitOracle, applyPhaseOracle, constantFunction, balancedFunction } from "../oracles";

describe("applyBitOracle", () => {
  it("flips the output qubit exactly when f(x)=1", () => {
    const state = StateVector.basis(2, 0b10); // x=1, y=0
    const result = applyBitOracle(state, (x) => (x === 1 ? 1 : 0));
    expect(result.amplitudes[0b11].re).toBeCloseTo(1, 9);
  });

  it("leaves the output qubit unchanged when f(x)=0", () => {
    const state = StateVector.basis(2, 0b10);
    const result = applyBitOracle(state, () => 0);
    expect(result.amplitudes[0b10].re).toBeCloseTo(1, 9);
  });

  it("is its own inverse (applying it twice returns the original state)", () => {
    const state = new StateVector([new Complex(0.5), new Complex(0.5), new Complex(0.5), new Complex(0.5)]);
    const f = balancedFunction(0b10);
    const twice = applyBitOracle(applyBitOracle(state, f), f);
    for (let i = 0; i < 4; i++) expect(twice.amplitudes[i].sub(state.amplitudes[i]).magnitude()).toBeLessThan(1e-9);
  });

  it("throws for fewer than 2 qubits", () => {
    expect(() => applyBitOracle(StateVector.zero(1), () => 0)).toThrow(/at least 2 qubits/);
  });

  it("phase kickback: bit oracle with ancilla in |-> equals a phase oracle on the input register", () => {
    const s = Math.SQRT1_2;
    const xPlus = new StateVector([new Complex(s), new Complex(s)]);
    const minus = [new Complex(s), new Complex(-s)];
    const full = new StateVector(xPlus.amplitudes.flatMap((a) => minus.map((m) => a.mul(m))));
    const f = (x: number) => (x === 1 ? 1 : 0) as 0 | 1;
    const afterBitOracle = applyBitOracle(full, f);
    const expectedX = applyPhaseOracle(xPlus, [1]);

    const extracted = [
      afterBitOracle.amplitudes[0].mul(minus[0]).add(afterBitOracle.amplitudes[1].mul(minus[1])),
      afterBitOracle.amplitudes[2].mul(minus[0]).add(afterBitOracle.amplitudes[3].mul(minus[1])),
    ];
    for (let i = 0; i < 2; i++) expect(extracted[i].sub(expectedX.amplitudes[i]).magnitude()).toBeLessThan(1e-9);
  });
});

describe("applyPhaseOracle", () => {
  it("flips the sign of exactly the marked indices", () => {
    const state = new StateVector([new Complex(0.5), new Complex(0.5), new Complex(0.5), new Complex(0.5)]);
    const result = applyPhaseOracle(state, [1, 3]);
    expect(result.amplitudes[0].re).toBeCloseTo(0.5, 9);
    expect(result.amplitudes[1].re).toBeCloseTo(-0.5, 9);
    expect(result.amplitudes[2].re).toBeCloseTo(0.5, 9);
    expect(result.amplitudes[3].re).toBeCloseTo(-0.5, 9);
  });

  it("throws for an out-of-range index", () => {
    expect(() => applyPhaseOracle(StateVector.zero(2), [10])).toThrow(/out of range/);
  });
});

describe("constantFunction / balancedFunction", () => {
  it("constantFunction always returns the same value", () => {
    const f = constantFunction(1);
    expect([0, 1, 2, 3].map(f)).toEqual([1, 1, 1, 1]);
  });

  it("balancedFunction is exactly half 0 and half 1 over a 2-bit domain", () => {
    const f = balancedFunction(0b10);
    const outputs = [0, 1, 2, 3].map(f);
    expect(outputs.filter((v) => v === 1).length).toBe(2);
    expect(outputs.filter((v) => v === 0).length).toBe(2);
  });

  it("balancedFunction throws for a zero mask", () => {
    expect(() => balancedFunction(0)).toThrow(/nonzero mask/);
  });
});
