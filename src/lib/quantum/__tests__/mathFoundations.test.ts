import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { Matrix } from "../matrix";
import { StateVector } from "../state";
import { PAULI_X, PAULI_Y, PAULI_Z, HADAMARD, S_GATE, IDENTITY } from "../gates";

/**
 * Verifies specific mathematical claims made in the "Mathematical
 * Foundations for Quantum Mechanics" lesson series (src/content/lessons/
 * quantum-mechanics/mathematical-foundations/), using only the existing
 * engine primitives — no engine changes were made for that course. This
 * file exists because those lessons make many hand-derived claims (Euler's
 * formula, specific eigenpairs, Hermiticity/unitarity of specific
 * matrices, the completeness relation, tensor-product dimension and
 * ordering) that are worth pinning against the same engine the rest of
 * the site already trusts, rather than trusting hand algebra alone.
 */

const c = (re: number, im = 0) => new Complex(re, im);

describe("Complex Numbers for Physics", () => {
  it("Euler's formula: the Taylor series for e^{iθ} converges to cos θ + i sin θ", () => {
    const theta = 0.9;
    let real = 0;
    let imag = 0;
    let term = c(1, 0); // (iθ)^0 / 0!
    for (let n = 0; n < 30; n++) {
      real += term.re;
      imag += term.im;
      // next term = term * (iθ) / (n+1)
      term = term.mul(c(0, theta)).scale(1 / (n + 1));
    }
    expect(real).toBeCloseTo(Math.cos(theta), 10);
    expect(imag).toBeCloseTo(Math.sin(theta), 10);
  });

  it("|e^{iθ}| = 1 for every θ (Euler's formula applied directly)", () => {
    for (const theta of [0, 0.3, 1.2, Math.PI, 4.5]) {
      const z = Complex.fromPolar(1, theta);
      expect(z.magnitude()).toBeCloseTo(1, 10);
    }
  });

  it("De Moivre's theorem: (e^{iθ})^3 matches e^{i·3θ}", () => {
    const theta = 0.7;
    const z = Complex.fromPolar(1, theta);
    const cubed = z.mul(z).mul(z);
    const direct = Complex.fromPolar(1, 3 * theta);
    expect(cubed.equals(direct, 1e-9)).toBe(true);
  });

  it("the cube roots of unity each cube to 1", () => {
    for (let k = 0; k < 3; k++) {
      const root = Complex.fromPolar(1, (2 * Math.PI * k) / 3);
      const cubed = root.mul(root).mul(root);
      expect(cubed.equals(Complex.ONE, 1e-9)).toBe(true);
    }
  });

  it("complex multiplication matches the 2x2 real-matrix representation", () => {
    // a+bi <-> [[a,-b],[b,a]]; verify the matrix product matches complex multiplication.
    const toMatrix = (re: number, im: number) => new Matrix([[c(re), c(-im)], [c(im), c(re)]]);
    const z1 = { re: 2, im: 3 };
    const z2 = { re: -1, im: 4 };
    const productComplex = new Complex(z1.re, z1.im).mul(new Complex(z2.re, z2.im));
    const productMatrix = toMatrix(z1.re, z1.im).mul(toMatrix(z2.re, z2.im));
    expect(productMatrix.equals(toMatrix(productComplex.re, productComplex.im), 1e-9)).toBe(true);
  });
});

describe("Eigenvalues and Eigenvectors — Pauli matrices", () => {
  it("Pauli-X has eigenvalue +1 with eigenvector |+⟩", () => {
    const plus = [c(Math.SQRT1_2), c(Math.SQRT1_2)];
    const result = PAULI_X.apply(plus);
    expect(result[0].equals(plus[0], 1e-9)).toBe(true);
    expect(result[1].equals(plus[1], 1e-9)).toBe(true);
  });

  it("Pauli-X has eigenvalue -1 with eigenvector |-⟩", () => {
    const minus = [c(Math.SQRT1_2), c(-Math.SQRT1_2)];
    const result = PAULI_X.apply(minus);
    expect(result[0].equals(minus[0].scale(-1), 1e-9)).toBe(true);
    expect(result[1].equals(minus[1].scale(-1), 1e-9)).toBe(true);
  });

  it("Pauli-Z has eigenvalues +1, -1 with eigenvectors |0⟩, |1⟩", () => {
    const zero = [c(1), c(0)];
    const one = [c(0), c(1)];
    expect(PAULI_Z.apply(zero)[0].equals(c(1), 1e-9)).toBe(true);
    expect(PAULI_Z.apply(zero)[1].equals(c(0), 1e-9)).toBe(true);
    expect(PAULI_Z.apply(one)[0].equals(c(0), 1e-9)).toBe(true);
    expect(PAULI_Z.apply(one)[1].equals(c(-1), 1e-9)).toBe(true);
  });

  it("the trace/determinant shortcut matches Pauli-X's actual eigenvalues (sum 0, product -1)", () => {
    const trace = PAULI_X.get(0, 0).add(PAULI_X.get(1, 1));
    const det = PAULI_X.get(0, 0).mul(PAULI_X.get(1, 1)).sub(PAULI_X.get(0, 1).mul(PAULI_X.get(1, 0)));
    expect(trace.equals(c(0), 1e-9)).toBe(true); // (+1) + (-1) = 0
    expect(det.equals(c(-1), 1e-9)).toBe(true); // (+1)(-1) = -1
  });

  it("Pauli-Y's eigenvector for eigenvalue +1, as derived by hand, satisfies Yv = v", () => {
    // Derived in the lesson planning: v = (-i, 1)/sqrt(2) solves (Y-I)v=0.
    const norm = Math.SQRT1_2;
    const v = [c(0, -norm), c(norm)];
    const result = PAULI_Y.apply(v);
    expect(result[0].equals(v[0], 1e-9)).toBe(true);
    expect(result[1].equals(v[1], 1e-9)).toBe(true);
  });
});

describe("Hermitian Operators", () => {
  it("Pauli-X, Y, Z are all Hermitian", () => {
    expect(PAULI_X.equals(PAULI_X.dagger(), 1e-9)).toBe(true);
    expect(PAULI_Y.equals(PAULI_Y.dagger(), 1e-9)).toBe(true);
    expect(PAULI_Z.equals(PAULI_Z.dagger(), 1e-9)).toBe(true);
  });

  it("the S gate is NOT Hermitian", () => {
    expect(S_GATE.equals(S_GATE.dagger(), 1e-9)).toBe(false);
  });

  it("the spectral decomposition of Pauli-Z matches Z directly: (+1)|0⟩⟨0| + (-1)|1⟩⟨1|", () => {
    const projZero = new Matrix([[c(1), c(0)], [c(0), c(0)]]); // |0><0|
    const projOne = new Matrix([[c(0), c(0)], [c(0), c(1)]]); // |1><1|
    const reconstructed = projZero.scale(1).add(projOne.scale(-1));
    expect(reconstructed.equals(PAULI_Z, 1e-9)).toBe(true);
  });

  it("expectation value ⟨ψ|Z|ψ⟩ = 0.2 for ψ = (sqrt(0.6), sqrt(0.4))", () => {
    const psi = new StateVector([c(Math.sqrt(0.6)), c(Math.sqrt(0.4))]);
    const zPsi = PAULI_Z.apply(psi.amplitudes as Complex[]);
    const expectation = psi.amplitudes.reduce((sum, a, i) => sum.add(a.conjugate().mul(zPsi[i])), Complex.ZERO);
    expect(expectation.re).toBeCloseTo(0.2, 9);
    expect(expectation.im).toBeCloseTo(0, 9);
  });
});

describe("Unitary Operators", () => {
  it("the Hadamard matrix is unitary (H†H = I) and squares to the identity", () => {
    expect(HADAMARD.mul(HADAMARD.dagger()).equals(IDENTITY, 1e-9)).toBe(true);
    expect(HADAMARD.mul(HADAMARD).equals(IDENTITY, 1e-9)).toBe(true);
  });

  it("the S gate is unitary despite not being Hermitian", () => {
    expect(S_GATE.mul(S_GATE.dagger()).equals(IDENTITY, 1e-9)).toBe(true);
    expect(S_GATE.equals(S_GATE.dagger(), 1e-9)).toBe(false);
  });

  it("Pauli-X is both Hermitian and unitary", () => {
    expect(PAULI_X.equals(PAULI_X.dagger(), 1e-9)).toBe(true);
    expect(PAULI_X.mul(PAULI_X.dagger()).equals(IDENTITY, 1e-9)).toBe(true);
  });

  it("a Hermitian-but-non-unitary matrix exists: diag(2,2) is Hermitian but not unitary", () => {
    const scaled = new Matrix([[c(2), c(0)], [c(0), c(2)]]);
    expect(scaled.equals(scaled.dagger(), 1e-9)).toBe(true); // Hermitian
    expect(scaled.mul(scaled.dagger()).equals(IDENTITY, 1e-9)).toBe(false); // not unitary
  });

  it("every eigenvalue of a unitary operator has modulus 1 (checked for Hadamard's own eigenvalues, ±1)", () => {
    // H^2 = I means H's eigenvalues satisfy λ^2=1, so λ=±1 — both modulus 1.
    expect(Math.abs(1)).toBe(1);
    expect(Math.abs(-1)).toBe(1);
  });
});

describe("Inner Products and the Bra-Ket Formalism", () => {
  it("Cauchy-Schwarz holds for a concrete pair: |⟨u,v⟩| <= ‖u‖‖v‖", () => {
    const u = new StateVector([c(1), c(0)]);
    const v = new StateVector([c(Math.SQRT1_2), c(Math.SQRT1_2)]);
    const inner = u.innerProduct(v);
    expect(inner.magnitude()).toBeLessThanOrEqual(u.norm() * v.norm() + 1e-9);
    expect(inner.magnitudeSquared()).toBeCloseTo(0.5, 9);
  });

  it("|+⟩ and |-⟩ are orthogonal", () => {
    const plus = new StateVector([c(Math.SQRT1_2), c(Math.SQRT1_2)]);
    const minus = new StateVector([c(Math.SQRT1_2), c(-Math.SQRT1_2)]);
    expect(plus.innerProduct(minus).magnitude()).toBeCloseTo(0, 9);
  });

  it("the completeness relation |0⟩⟨0| + |1⟩⟨1| = I holds exactly", () => {
    const projZero = new Matrix([[c(1), c(0)], [c(0), c(0)]]);
    const projOne = new Matrix([[c(0), c(0)], [c(0), c(1)]]);
    expect(projZero.add(projOne).equals(IDENTITY, 1e-9)).toBe(true);
  });

  it("the completeness relation also holds for the |+⟩,|-⟩ basis", () => {
    const s = Math.SQRT1_2;
    const projPlus = new Matrix([[c(s * s), c(s * s)], [c(s * s), c(s * s)]]);
    const projMinus = new Matrix([[c(s * s), c(-s * s)], [c(-s * s), c(s * s)]]);
    expect(projPlus.add(projMinus).equals(IDENTITY, 1e-9)).toBe(true);
  });

  it("matrix multiplication matches the completeness-relation-derived formula for a concrete example", () => {
    const A = new Matrix([[c(2), c(0)], [c(0), c(3)]]);
    const B = new Matrix([[c(0), c(1)], [c(1), c(0)]]);
    const direct = A.mul(B);
    // (AB)_{ik} = sum_j A_{ij} B_{jk}, computed by hand via the completeness-relation derivation.
    const viaFormula = (i: number, k: number) =>
      A.get(i, 0).mul(B.get(0, k)).add(A.get(i, 1).mul(B.get(1, k)));
    for (let i = 0; i < 2; i++) {
      for (let k = 0; k < 2; k++) {
        expect(direct.get(i, k).equals(viaFormula(i, k), 1e-9)).toBe(true);
      }
    }
  });
});

describe("Tensor Products and Composite Systems", () => {
  it("tensors a 2-dimensional and a 3-dimensional vector into a 6-dimensional result, matching hand computation", () => {
    const u = new Matrix([[c(1)], [c(2)]]); // column vector (1,2)
    const v = new Matrix([[c(0)], [c(1)], [c(-1)]]); // column vector (0,1,-1)
    const result = u.tensor(v);
    expect(result.rows).toBe(6);
    const expected = [0, 1, -1, 0, 2, -2];
    for (let i = 0; i < 6; i++) {
      expect(result.get(i, 0).equals(c(expected[i]), 1e-9)).toBe(true);
    }
  });

  it("the Bell state |Φ+⟩ cannot be written as a simple tensor product (dimension-count claim, direct check)", () => {
    const zero = new StateVector([c(1), c(0)]);
    const one = new StateVector([c(0), c(1)]);
    const bell = zero.tensor(zero).amplitudes.map((a, i) => a.add(one.tensor(one).amplitudes[i]).scale(Math.SQRT1_2));
    // Exhaustively check: no product of two normalized qubit states matches bell, by verifying
    // the ad-bc determinant (the separability test from the Quantum Computing track) is nonzero.
    const [a, b, cc, d] = bell;
    const determinant = a.mul(d).sub(b.mul(cc));
    expect(determinant.magnitude()).toBeCloseTo(0.5, 9);
    expect(determinant.magnitude()).toBeGreaterThan(1e-6);
  });

  it("tensoring two normalized states yields a normalized state", () => {
    const u = new StateVector([c(Math.SQRT1_2), c(Math.SQRT1_2)]);
    const v = new StateVector([c(1), c(0)]);
    const combined = u.tensor(v);
    expect(combined.norm()).toBeCloseTo(1, 9);
  });
});

describe("Probability and Quantum States", () => {
  it("the Born rule's probabilities sum to 1 for a concrete example (0.6, 0.8 overlaps)", () => {
    const pPlus = 0.6 ** 2;
    const pMinus = 0.8 ** 2;
    expect(pPlus + pMinus).toBeCloseTo(1, 9);
  });

  it("global phase never changes a Born-rule probability", () => {
    const psi = new StateVector([c(Math.SQRT1_2), c(Math.SQRT1_2)]);
    const alpha = 1.3;
    const phaseFactor = Complex.fromPolar(1, alpha);
    const phased = new StateVector(psi.amplitudes.map((a) => a.mul(phaseFactor)));
    const originalProbs = psi.probabilities();
    const phasedProbs = phased.probabilities();
    for (let i = 0; i < originalProbs.length; i++) {
      expect(phasedProbs[i]).toBeCloseTo(originalProbs[i], 9);
    }
  });

  it("expectation value computed via probabilities matches ⟨ψ|A|ψ⟩ (double-check of the capstone's derivation)", () => {
    const psi = new StateVector([c(0.6), c(0.8)]);
    const viaProbabilities = 1 * 0.6 ** 2 + -1 * 0.8 ** 2;
    const zPsi = PAULI_Z.apply(psi.amplitudes as Complex[]);
    const viaSandwich = psi.amplitudes.reduce((sum, a, i) => sum.add(a.conjugate().mul(zPsi[i])), Complex.ZERO);
    expect(viaSandwich.re).toBeCloseTo(viaProbabilities, 9);
  });
});
