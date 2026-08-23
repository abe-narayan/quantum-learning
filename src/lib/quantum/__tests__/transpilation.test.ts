import { describe, expect, it } from "vitest";
import { StateVector } from "../state";
import { applySingleQubitGate, applyCNOT, HADAMARD } from "../gates";
import { cnotOnLinearChain, swapOverheadForLinearChain } from "../transpilation";

function prepTestState(): StateVector {
  let s = StateVector.zero(4);
  s = applySingleQubitGate(s, HADAMARD, 0);
  s = applySingleQubitGate(s, HADAMARD, 1);
  s = applySingleQubitGate(s, HADAMARD, 2);
  return s;
}

function maxAmplitudeDiff(a: StateVector, b: StateVector): number {
  let maxDiff = 0;
  for (let i = 0; i < a.amplitudes.length; i++) {
    maxDiff = Math.max(maxDiff, a.amplitudes[i].sub(b.amplitudes[i]).magnitude());
  }
  return maxDiff;
}

describe("cnotOnLinearChain reproduces a direct (connectivity-ignoring) CNOT exactly", () => {
  it("control=0, target=3 (forward, distant)", () => {
    const direct = applyCNOT(prepTestState(), 0, 3);
    const viaChain = cnotOnLinearChain(prepTestState(), 0, 3);
    expect(maxAmplitudeDiff(direct, viaChain)).toBeCloseTo(0, 9);
  });

  it("control=3, target=0 (backward, distant)", () => {
    const direct = applyCNOT(prepTestState(), 3, 0);
    const viaChain = cnotOnLinearChain(prepTestState(), 3, 0);
    expect(maxAmplitudeDiff(direct, viaChain)).toBeCloseTo(0, 9);
  });

  it("already-adjacent control/target needs no swaps and matches directly", () => {
    const direct = applyCNOT(prepTestState(), 1, 2);
    const viaChain = cnotOnLinearChain(prepTestState(), 1, 2);
    expect(maxAmplitudeDiff(direct, viaChain)).toBeCloseTo(0, 9);
  });

  it("throws for control === target", () => {
    expect(() => cnotOnLinearChain(prepTestState(), 1, 1)).toThrow();
  });
});

describe("swapOverheadForLinearChain", () => {
  it("gives 0 for adjacent qubits", () => {
    expect(swapOverheadForLinearChain(1, 2)).toBe(0);
  });

  it("gives 4 for control=0, target=3", () => {
    expect(swapOverheadForLinearChain(0, 3)).toBe(4);
  });

  it("is symmetric in control/target", () => {
    expect(swapOverheadForLinearChain(0, 3)).toBe(swapOverheadForLinearChain(3, 0));
  });

  it("throws for control === target", () => {
    expect(() => swapOverheadForLinearChain(2, 2)).toThrow();
  });
});
