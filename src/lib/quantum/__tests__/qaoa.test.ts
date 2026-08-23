import { describe, expect, it } from "vitest";
import { uniformSuperposition, applyCostUnitary, applyMixerUnitary, qaoaCircuit, expectedCutSize, bruteForceMaxCut } from "../qaoa";

describe("uniformSuperposition", () => {
  it("gives equal probability to every basis state", () => {
    const s = uniformSuperposition(3);
    for (const p of s.probabilities()) expect(p).toBeCloseTo(1 / 8, 9);
  });
});

describe("applyCostUnitary", () => {
  it("leaves probabilities unchanged (it's a pure phase operator)", () => {
    const s = uniformSuperposition(2);
    const before = s.probabilities();
    const after = applyCostUnitary(s, [[0, 1]], 0.7).probabilities();
    for (let i = 0; i < before.length; i++) expect(after[i]).toBeCloseTo(before[i], 9);
  });

  it("applies zero phase (no-op) when gamma=0", () => {
    const s = uniformSuperposition(2);
    const after = applyCostUnitary(s, [[0, 1]], 0);
    for (let i = 0; i < 4; i++) expect(after.amplitudes[i].sub(s.amplitudes[i]).magnitude()).toBeLessThan(1e-9);
  });
});

describe("applyMixerUnitary", () => {
  it("is a no-op at beta=0", () => {
    const s = uniformSuperposition(2);
    const after = applyMixerUnitary(s, 0);
    for (let i = 0; i < 4; i++) expect(after.amplitudes[i].sub(s.amplitudes[i]).magnitude()).toBeLessThan(1e-9);
  });

  it("preserves normalization", () => {
    const s = uniformSuperposition(3);
    const after = applyMixerUnitary(s, 0.4);
    const total = after.probabilities().reduce((sum, p) => sum + p, 0);
    expect(total).toBeCloseTo(1, 9);
  });
});

describe("bruteForceMaxCut", () => {
  it("finds max cut 1 for a single edge", () => {
    expect(bruteForceMaxCut(2, [[0, 1]])).toBe(1);
  });

  it("finds max cut 2 for a triangle (3 nodes, all edges)", () => {
    expect(bruteForceMaxCut(3, [[0, 1], [1, 2], [0, 2]])).toBe(2);
  });
});

describe("qaoaCircuit / expectedCutSize", () => {
  it("throws when gamma and beta arrays have mismatched lengths", () => {
    expect(() => qaoaCircuit(2, [[0, 1]], [0.5], [0.5, 0.3])).toThrow(/equal-length/);
  });

  it("p=1 QAOA reaches within 5% of the true max cut for a single edge, at good parameters", () => {
    const state = qaoaCircuit(2, [[0, 1]], [1.55], [0.4]);
    const cut = expectedCutSize(state, [[0, 1]]);
    expect(cut).toBeGreaterThan(0.95 * bruteForceMaxCut(2, [[0, 1]]));
  });

  it("p=1 QAOA reaches within 5% of the true max cut for a triangle, at good parameters", () => {
    const edges: [number, number][] = [[0, 1], [1, 2], [0, 2]];
    const state = qaoaCircuit(3, edges, [0.6], [0.3]);
    const cut = expectedCutSize(state, edges);
    expect(cut).toBeGreaterThan(0.95 * bruteForceMaxCut(3, edges));
  });

  it("expectedCutSize at the uniform superposition equals half the edge count (no bias toward cut or uncut)", () => {
    const edges: [number, number][] = [[0, 1], [1, 2], [0, 2]];
    const s = uniformSuperposition(3);
    expect(expectedCutSize(s, edges)).toBeCloseTo(1.5, 9); // 3 edges * 0.5
  });
});
