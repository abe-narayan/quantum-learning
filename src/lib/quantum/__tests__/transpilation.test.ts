import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
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

/**
 * A fixed-seed PRNG so a failure below is reproducible from the seed, and
 * a random 4-qubit state built from it. The suite above routes CNOTs on a
 * couple of hand-built basis-state superpositions; a SWAP network is a
 * *rewrite*, so the property that actually matters is that it agrees with
 * the direct CNOT on an arbitrary state, for every control/target pair and
 * in both routing directions.
 */
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomFourQubitState(rand: () => number): StateVector {
  return new StateVector(
    Array.from({ length: 16 }, () => new Complex(rand() * 2 - 1, rand() * 2 - 1))
  ).normalize();
}

describe("the SWAP network is an exact rewrite, not an approximation", () => {
  it("reproduces a direct CNOT exactly, for every control/target pair on the chain and an arbitrary input state", () => {
    // Including the qubit ordering: the un-swapping half of the network has
    // to put every relocated qubit back where it started, or the routed
    // circuit would agree on the marginals but scramble the register.
    const rand = seededRandom(4242);
    const pairs: [number, number][] = [
      [0, 1], [1, 0], [1, 2], [2, 1], [2, 3], [3, 2],
      [0, 2], [2, 0], [1, 3], [3, 1], [0, 3], [3, 0],
    ];
    for (let trial = 0; trial < 10; trial++) {
      const state = randomFourQubitState(rand);
      for (const [control, target] of pairs) {
        const routed = cnotOnLinearChain(state, control, target);
        const direct = applyCNOT(state, control, target);
        expect(maxAmplitudeDiff(routed, direct), `CNOT(${control},${target})`).toBeLessThan(1e-9);
      }
    }
  });

  it("uses exactly the number of SWAPs swapOverheadForLinearChain predicts, since routing is norm- and information-preserving either way", () => {
    // The overhead formula and the routing code are written independently;
    // this ties them together by checking that routing a distance-d CNOT
    // and then undoing it with the reverse-direction CNOT returns the exact
    // original state (both CNOTs and all 2*(d-1) SWAPs being involutions in
    // aggregate), which can only hold if the network is balanced.
    const rand = seededRandom(4243);
    const state = randomFourQubitState(rand);
    for (const [control, target] of [[0, 3], [3, 0], [0, 2]] as [number, number][]) {
      const there = cnotOnLinearChain(state, control, target);
      const andBack = cnotOnLinearChain(there, control, target);
      expect(maxAmplitudeDiff(andBack, state), `CNOT(${control},${target}) twice`).toBeLessThan(1e-9);
      expect(swapOverheadForLinearChain(control, target)).toBe(2 * (Math.abs(control - target) - 1));
    }
  });
});
