import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { Matrix } from "../matrix";
import { StateVector } from "../state";
import { outerProduct, projectorOntoSubspace } from "../projectors";
import { expectationValue } from "../observables";
import { PAULI_Z } from "../gates";

describe("outerProduct", () => {
  it("|0><0| is the rank-1 projector [[1,0],[0,0]]", () => {
    const zero = StateVector.zero(1).amplitudes;
    const p = outerProduct(zero, zero);
    expect(p.get(0, 0).equals(Complex.ONE)).toBe(true);
    expect(p.get(0, 1).equals(Complex.ZERO)).toBe(true);
    expect(p.get(1, 0).equals(Complex.ZERO)).toBe(true);
    expect(p.get(1, 1).equals(Complex.ZERO)).toBe(true);
  });

  it("throws on mismatched dimensions", () => {
    expect(() => outerProduct([Complex.ONE], [Complex.ONE, Complex.ZERO])).toThrow(/dimension/);
  });
});

describe("projectorOntoSubspace (qubit-register examples, power-of-two dimension)", () => {
  it("a single-vector projector is idempotent (P^2 = P)", () => {
    const plus = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
    const p = projectorOntoSubspace([plus.amplitudes]);
    expect(p.mul(p).equals(p, 1e-9)).toBe(true);
  });

  it("the sum of projectors onto a complete orthonormal basis is the identity", () => {
    const zero = StateVector.basis(1, 0);
    const one = StateVector.basis(1, 1);
    const p0 = projectorOntoSubspace([zero.amplitudes]);
    const p1 = projectorOntoSubspace([one.amplitudes]);
    expect(p0.add(p1).equals(Matrix.identity(2), 1e-9)).toBe(true);
  });

  it("a degenerate (rank-2) projector spans exactly its two basis vectors", () => {
    const b0 = StateVector.basis(2, 0); // |00>
    const b1 = StateVector.basis(2, 1); // |01>
    const p = projectorOntoSubspace([b0.amplitudes, b1.amplitudes]);
    // Should act as the identity on the span{|00>,|01>} subspace and annihilate |10>, |11>.
    const b2 = StateVector.basis(2, 2); // |10>
    const applied = p.apply(b2.amplitudes as Complex[]);
    expect(applied.every((a) => a.magnitude() < 1e-9)).toBe(true);

    const combined = new StateVector([
      new Complex(Math.SQRT1_2),
      new Complex(Math.SQRT1_2),
      Complex.ZERO,
      Complex.ZERO,
    ]);
    const appliedCombined = p.apply(combined.amplitudes as Complex[]);
    expect(appliedCombined[0].equals(new Complex(Math.SQRT1_2), 1e-9)).toBe(true);
    expect(appliedCombined[1].equals(new Complex(Math.SQRT1_2), 1e-9)).toBe(true);
  });

  it("<psi|P|psi> reduces to |c_i|^2 exactly, for a nondegenerate rank-1 projector", () => {
    const state = new StateVector([new Complex(0.6), new Complex(0.8)]);
    const zero = StateVector.basis(1, 0);
    const p0 = projectorOntoSubspace([zero.amplitudes]);
    expect(expectationValue(state, p0).re).toBeCloseTo(0.36, 9);
  });

  it("a degenerate projector's measurement probability sums the individual |c_i|^2's", () => {
    const state = new StateVector([
      new Complex(0.5),
      new Complex(0.5),
      new Complex(Math.sqrt(0.5)),
      Complex.ZERO,
    ]);
    const b0 = StateVector.basis(2, 0);
    const b1 = StateVector.basis(2, 1);
    const p = projectorOntoSubspace([b0.amplitudes, b1.amplitudes]);
    expect(expectationValue(state, p).re).toBeCloseTo(0.25 + 0.25, 9);
  });

  it("throws on an empty vector list", () => {
    expect(() => projectorOntoSubspace([])).toThrow(/at least one vector/);
  });

  it("PAULI_Z's spectral decomposition P0 - P1 reconstructs Z exactly", () => {
    const p0 = projectorOntoSubspace([StateVector.basis(1, 0).amplitudes]);
    const p1 = projectorOntoSubspace([StateVector.basis(1, 1).amplitudes]);
    const reconstructed = p0.add(p1.scale(-1));
    expect(reconstructed.equals(PAULI_Z, 1e-9)).toBe(true);
  });
});

describe("projectorOntoSubspace (non-power-of-two dimension — Operators, Observables & Measurement's worked examples)", () => {
  // N = diag(1,1,2) on C^3 — the course's running example. Not representable
  // as a StateVector (log2(3) isn't an integer), which is exactly why
  // projectorOntoSubspace and expectationValue take plain amplitude arrays.
  const e0 = [Complex.ONE, Complex.ZERO, Complex.ZERO];
  const e1 = [Complex.ZERO, Complex.ONE, Complex.ZERO];
  const e2 = [Complex.ZERO, Complex.ZERO, Complex.ONE];

  it("reconstructs N = diag(1,1,2) from its spectral decomposition", () => {
    const p1 = projectorOntoSubspace([e0, e1]); // degenerate eigenvalue 1
    const p2 = projectorOntoSubspace([e2]); // nondegenerate eigenvalue 2
    const n = p1.scale(1).add(p2.scale(2));
    const expected = new Matrix([
      [Complex.ONE, Complex.ZERO, Complex.ZERO],
      [Complex.ZERO, Complex.ONE, Complex.ZERO],
      [Complex.ZERO, Complex.ZERO, new Complex(2)],
    ]);
    expect(n.equals(expected, 1e-9)).toBe(true);
  });

  it("matches the lesson's P(N=1) = 2/3 for psi = (|0>+|1>+|2>)/sqrt(3)", () => {
    const c = new Complex(1 / Math.sqrt(3));
    const psi = { amplitudes: [c, c, c] };
    const p1 = projectorOntoSubspace([e0, e1]);
    expect(expectationValue(psi, p1).re).toBeCloseTo(2 / 3, 9);
  });

  it("matches the lesson's post-measurement state (1/sqrt2, 1/sqrt2, 0)", () => {
    const c = new Complex(1 / Math.sqrt(3));
    const psi = [c, c, c];
    const p1 = projectorOntoSubspace([e0, e1]);
    const projected = p1.apply(psi);
    const norm = Math.sqrt(projected.reduce((sum, a) => sum + a.magnitudeSquared(), 0));
    const collapsed = projected.map((a) => a.scale(1 / norm));
    expect(collapsed[0].re).toBeCloseTo(Math.SQRT1_2, 9);
    expect(collapsed[1].re).toBeCloseTo(Math.SQRT1_2, 9);
    expect(collapsed[2].magnitude()).toBeCloseTo(0, 9);
  });

  it("p1 is idempotent and orthogonal to p2, on this non-power-of-two space", () => {
    const p1 = projectorOntoSubspace([e0, e1]);
    const p2 = projectorOntoSubspace([e2]);
    expect(p1.mul(p1).equals(p1, 1e-9)).toBe(true);
    expect(p1.mul(p2).equals(Matrix.zeros(3, 3), 1e-9)).toBe(true);
  });
});
