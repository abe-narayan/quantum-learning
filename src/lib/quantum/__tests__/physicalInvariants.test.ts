import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { Matrix, tensorAll } from "../matrix";
import { StateVector } from "../state";
import {
  IDENTITY,
  PAULI_X,
  PAULI_Y,
  PAULI_Z,
  HADAMARD,
  S_GATE,
  T_GATE,
  phaseGate,
  rotationX,
  rotationY,
  rotationZ,
  rotationAboutAxis,
  applySingleQubitGate,
  applyControlledGate,
} from "../gates";
import { measureQubit, qubitMeasurementProbabilities, measurementDistribution } from "../measurement";
import { expectationValue } from "../observables";
import { outerProduct } from "../projectors";
import {
  pureStateDensityMatrix,
  maximallyMixedState,
  convexCombination,
  purity,
  vonNeumannEntropy,
  validateDensityMatrix,
  densityMatrixExpectationValue,
  evolveDensityMatrix,
} from "../densityMatrix";
import { partialTrace } from "../partialTrace";
import { entanglementEntropy, concurrenceOfPureState } from "../entanglement";
import { chshValue, spinObservableInXZPlane, CHSH_CLASSICAL_BOUND, CHSH_QUANTUM_BOUND } from "../chsh";
import { applyKrausChannel, amplitudeDampingChannel, dephasingChannel, isTracePreserving } from "../openSystems";
import { stateToBlochVector, densityMatrixToBlochVector, stateToBlochAngles, blochStateFromAngles } from "../bloch";
import { createGrid, Wavefunction1D } from "../wavefunction";
import { SplitOperatorEvolver } from "../timeEvolution";
import { harmonicOscillatorPotential } from "../potentials";

/**
 * Property-based physical invariants, spanning modules.
 *
 * Every other suite in this directory checks *specific* worked values —
 * which proves the code does what its author expected for the cases they
 * thought of. These tests instead check the properties physics requires of
 * *every* input: unitarity, normalization, positivity, the Tsirelson
 * bound, and so on. That's the only kind of check that catches a
 * convention mismatch between two modules that are each internally
 * consistent (a qubit-ordering disagreement, a half-angle vs full-angle
 * rotation, a dropped phase), because both modules' own example-based
 * tests would keep passing.
 *
 * Randomized inputs come from a fixed-seed PRNG rather than `Math.random`,
 * so a failure here is always reproducible from the seed printed in the
 * test name — a randomized test that can't be re-run on the same input
 * isn't debuggable.
 */
function seededRandom(seed: number): () => number {
  // mulberry32 — small, fast, and good enough for test inputs; the point is
  // determinism, not cryptographic or statistical quality.
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A uniformly-drawn (in the crude box sense) normalized state on `numQubits` qubits. */
function randomState(numQubits: number, rand: () => number): StateVector {
  const dimension = 2 ** numQubits;
  return new StateVector(
    Array.from({ length: dimension }, () => new Complex(rand() * 2 - 1, rand() * 2 - 1))
  ).normalize();
}

/** A random single-qubit unitary, as a rotation about a random axis by a random angle. */
function randomUnitary(rand: () => number): Matrix {
  return rotationAboutAxis(
    { x: rand() * 2 - 1, y: rand() * 2 - 1, z: rand() * 2 - 1 },
    rand() * 4 * Math.PI - 2 * Math.PI
  );
}

const FIXED_GATES: [string, Matrix][] = [
  ["I", IDENTITY],
  ["X", PAULI_X],
  ["Y", PAULI_Y],
  ["Z", PAULI_Z],
  ["H", HADAMARD],
  ["S", S_GATE],
  ["T", T_GATE],
];

describe("gates are unitary, individually and composed", () => {
  it("satisfies U†U = UU† = I for every fixed gate and for random rotations", () => {
    const rand = seededRandom(1001);
    const gates: [string, Matrix][] = [
      ...FIXED_GATES,
      ["P(0.37)", phaseGate(0.37)],
      ["Rx(2.1)", rotationX(2.1)],
      ["Ry(-0.8)", rotationY(-0.8)],
      ["Rz(5.3)", rotationZ(5.3)],
      ...Array.from({ length: 40 }, (_, i) => [`random#${i}`, randomUnitary(rand)] as [string, Matrix]),
    ];
    for (const [name, gate] of gates) {
      expect(gate.dagger().mul(gate).equals(Matrix.identity(2), 1e-12), `${name}: U†U`).toBe(true);
      expect(gate.mul(gate.dagger()).equals(Matrix.identity(2), 1e-12), `${name}: UU†`).toBe(true);
    }
  });

  it("preserves the norm and every inner product through a long random circuit", () => {
    // Unitarity of the *composed* circuit, tested where it actually
    // matters: on the amplitude-array fast path (`applySingleQubitGate` /
    // `applyControlledGate`), not on the 2x2 matrices those are built from.
    const rand = seededRandom(1002);
    const numQubits = 3;
    for (let trial = 0; trial < 25; trial++) {
      let a = randomState(numQubits, rand);
      let b = randomState(numQubits, rand);
      const overlapBefore = a.innerProduct(b);

      for (let step = 0; step < 20; step++) {
        const target = Math.floor(rand() * numQubits);
        if (rand() < 0.5) {
          const gate = randomUnitary(rand);
          a = applySingleQubitGate(a, gate, target);
          b = applySingleQubitGate(b, gate, target);
        } else {
          let control = Math.floor(rand() * numQubits);
          if (control === target) control = (control + 1) % numQubits;
          const gate = randomUnitary(rand);
          a = applyControlledGate(a, gate, control, target);
          b = applyControlledGate(b, gate, control, target);
        }
      }

      expect(a.norm()).toBeCloseTo(1, 9);
      expect(b.norm()).toBeCloseTo(1, 9);
      const overlapAfter = a.innerProduct(b);
      expect(overlapAfter.re).toBeCloseTo(overlapBefore.re, 9);
      expect(overlapAfter.im).toBeCloseTo(overlapBefore.im, 9);
    }
  });

  it("agrees with the explicitly tensored 2^n x 2^n matrix for every qubit position", () => {
    // The bitmask math in `applySingleQubitGate` is fast but implicit about
    // qubit ordering; `Matrix.tensor` is slow but makes the ordering
    // explicit (leftmost factor = qubit 0 = most significant bit). Building
    // the same operator both ways and comparing is a genuinely independent
    // check that the two agree — exactly the kind of ordering mismatch that
    // each module's own tests would never expose.
    const rand = seededRandom(1003);
    for (const numQubits of [1, 2, 3]) {
      for (let target = 0; target < numQubits; target++) {
        const gate = randomUnitary(rand);
        const factors = Array.from({ length: numQubits }, (_, q) => (q === target ? gate : IDENTITY));
        const full = tensorAll(factors);
        const state = randomState(numQubits, rand);
        const viaBitmask = applySingleQubitGate(state, gate, target);
        const viaMatrix = state.applyMatrix(full);
        for (let i = 0; i < state.dimension; i++) {
          expect(
            viaBitmask.amplitudes[i].equals(viaMatrix.amplitudes[i], 1e-9),
            `n=${numQubits} target=${target} amplitude ${i}`
          ).toBe(true);
        }
      }
    }
  });

  it("agrees with the explicitly tensored controlled operator |0><0|⊗I + |1><1|⊗U", () => {
    // Same independent-construction check for the controlled path, which
    // has *two* qubit indices to get right rather than one. Built here for
    // 2 qubits in both control/target orders, where the projector form can
    // be written down unambiguously.
    const rand = seededRandom(1004);
    const ketZero = [Complex.ONE, Complex.ZERO];
    const ketOne = [Complex.ZERO, Complex.ONE];
    const p0 = outerProduct(ketZero, ketZero);
    const p1 = outerProduct(ketOne, ketOne);

    for (let trial = 0; trial < 20; trial++) {
      const gate = randomUnitary(rand);
      const state = randomState(2, rand);

      // control = qubit 0 (the leading tensor factor), target = qubit 1
      const controlFirst = p0.tensor(IDENTITY).add(p1.tensor(gate));
      const viaBitmaskA = applyControlledGate(state, gate, 0, 1);
      const viaMatrixA = state.applyMatrix(controlFirst);
      for (let i = 0; i < 4; i++) {
        expect(viaBitmaskA.amplitudes[i].equals(viaMatrixA.amplitudes[i], 1e-9), `control=0 amplitude ${i}`).toBe(true);
      }

      // control = qubit 1 (the trailing factor), target = qubit 0
      const controlSecond = IDENTITY.tensor(p0).add(gate.tensor(p1));
      const viaBitmaskB = applyControlledGate(state, gate, 1, 0);
      const viaMatrixB = state.applyMatrix(controlSecond);
      for (let i = 0; i < 4; i++) {
        expect(viaBitmaskB.amplitudes[i].equals(viaMatrixB.amplitudes[i], 1e-9), `control=1 amplitude ${i}`).toBe(true);
      }
    }
  });
});

describe("measurement keeps probability accounted for", () => {
  it("keeps the computational-basis distribution normalized for any random state", () => {
    const rand = seededRandom(2001);
    for (let trial = 0; trial < 100; trial++) {
      const state = randomState(3, rand);
      const total = measurementDistribution(state).reduce((sum, outcome) => sum + outcome.probability, 0);
      expect(total).toBeCloseTo(1, 9);
    }
  });

  it("keeps probabilities normalized after a partial measurement, and leaves the collapsed state normalized", () => {
    const rand = seededRandom(2002);
    for (let trial = 0; trial < 100; trial++) {
      const state = randomState(3, rand);
      const qubit = Math.floor(rand() * 3);
      const [p0, p1] = qubitMeasurementProbabilities(state, qubit);
      expect(p0 + p1).toBeCloseTo(1, 9);

      // Force each branch in turn, rather than sampling, so both are covered
      // on every trial: `random` below p0 selects outcome 0, at or above it 1.
      for (const draw of [p0 / 2, (p0 + 1) / 2]) {
        const result = measureQubit(state, qubit, draw);
        expect(result.collapsed.norm()).toBeCloseTo(1, 9);
        // Every amplitude inconsistent with the observed outcome is gone.
        const mask = 1 << (3 - 1 - qubit);
        result.collapsed.amplitudes.forEach((amplitude, i) => {
          const bit = (i & mask) !== 0 ? 1 : 0;
          if (bit !== result.outcome) expect(amplitude.magnitude()).toBeCloseTo(0, 12);
        });
      }
    }
  });

  it("obeys the law of total probability: the pre-measurement distribution is the outcome-weighted average of the two collapsed ones", () => {
    // This is what makes measurement a genuine refinement of information
    // rather than a change to the physics: not measuring a qubit has to
    // leave every *other* prediction exactly where it was.
    const rand = seededRandom(2003);
    for (let trial = 0; trial < 50; trial++) {
      const state = randomState(3, rand);
      const qubit = Math.floor(rand() * 3);
      const [p0, p1] = qubitMeasurementProbabilities(state, qubit);
      if (p0 < 1e-6 || p1 < 1e-6) continue; // a forced outcome has nothing to average

      const branch0 = measureQubit(state, qubit, p0 / 2).collapsed.probabilities();
      const branch1 = measureQubit(state, qubit, (p0 + 1) / 2).collapsed.probabilities();
      const before = state.probabilities();
      for (let i = 0; i < before.length; i++) {
        expect(p0 * branch0[i] + p1 * branch1[i]).toBeCloseTo(before[i], 9);
      }
    }
  });
});

describe("density matrices stay physical under every operation", () => {
  it("stays Hermitian, unit-trace and positive semi-definite through unitary evolution and noise channels", () => {
    const rand = seededRandom(3001);
    for (let trial = 0; trial < 100; trial++) {
      let rho = pureStateDensityMatrix(randomState(1, rand));
      for (let step = 0; step < 6; step++) {
        rho = evolveDensityMatrix(rho, randomUnitary(rand));
        const channel = rand() < 0.5 ? amplitudeDampingChannel(rand()) : dephasingChannel(rand());
        expect(isTracePreserving(channel)).toBe(true);
        rho = applyKrausChannel(rho, channel);

        const validation = validateDensityMatrix(rho, 1e-9);
        expect(validation.isHermitian, `step ${step}: Hermitian`).toBe(true);
        expect(validation.hasUnitTrace, `step ${step}: unit trace`).toBe(true);
        expect(validation.isPositiveSemiDefinite, `step ${step}: PSD`).toBe(true);
      }
    }
  });

  it("keeps purity inside [1/d, 1], reaching 1 exactly for pure states and 1/d for the maximally mixed one", () => {
    const rand = seededRandom(3002);
    expect(purity(maximallyMixedState(2))).toBeCloseTo(0.5, 12);
    expect(purity(maximallyMixedState(4))).toBeCloseTo(0.25, 12);
    for (let trial = 0; trial < 100; trial++) {
      const pure = pureStateDensityMatrix(randomState(1, rand));
      expect(purity(pure)).toBeCloseTo(1, 9);

      const weight = rand();
      const mixture = convexCombination([
        { probability: weight, density: pure },
        { probability: 1 - weight, density: pureStateDensityMatrix(randomState(1, rand)) },
      ]);
      const p = purity(mixture);
      expect(p).toBeGreaterThan(0.5 - 1e-9);
      expect(p).toBeLessThan(1 + 1e-9);
    }
  });

  it("gives entropy 0 for pure states, log2(d) for the maximally mixed state, and is concave under mixing", () => {
    // Concavity — S(p*rho_a + (1-p)*rho_b) >= p*S(rho_a) + (1-p)*S(rho_b) —
    // is the precise statement that classically mixing two states can only
    // *add* ignorance, never subtract it.
    const rand = seededRandom(3003);
    expect(vonNeumannEntropy(maximallyMixedState(2))).toBeCloseTo(1, 12);
    for (let trial = 0; trial < 100; trial++) {
      const rhoA = pureStateDensityMatrix(randomState(1, rand));
      const rhoB = pureStateDensityMatrix(randomState(1, rand));
      expect(vonNeumannEntropy(rhoA)).toBeCloseTo(0, 8);

      const weight = rand();
      const mixture = convexCombination([
        { probability: weight, density: rhoA },
        { probability: 1 - weight, density: rhoB },
      ]);
      const mixed = vonNeumannEntropy(mixture);
      expect(mixed).toBeGreaterThan(weight * vonNeumannEntropy(rhoA) + (1 - weight) * vonNeumannEntropy(rhoB) - 1e-9);
      expect(mixed).toBeLessThan(1 + 1e-9);
    }
  });

  it("reproduces <psi|A|psi> exactly via Tr(rho A) for every pure state and observable", () => {
    const rand = seededRandom(3004);
    for (let trial = 0; trial < 100; trial++) {
      const state = randomState(1, rand);
      const rho = pureStateDensityMatrix(state);
      for (const [, observable] of FIXED_GATES) {
        const viaState = expectationValue(state, observable);
        const viaDensity = densityMatrixExpectationValue(rho, observable);
        expect(viaDensity.re).toBeCloseTo(viaState.re, 9);
        expect(viaDensity.im).toBeCloseTo(viaState.im, 9);
      }
    }
  });

  it("never lengthens the Bloch vector under a noise channel, and never leaves the ball", () => {
    // Physically: a noise channel can only move a state toward the centre
    // of the Bloch sphere (or hold it), never manufacture coherence.
    const rand = seededRandom(3005);
    for (let trial = 0; trial < 100; trial++) {
      const rho = pureStateDensityMatrix(randomState(1, rand));
      const before = densityMatrixToBlochVector(rho);
      const lengthBefore = Math.hypot(before.x, before.y, before.z);
      const after = densityMatrixToBlochVector(
        applyKrausChannel(rho, rand() < 0.5 ? amplitudeDampingChannel(rand()) : dephasingChannel(rand()))
      );
      const lengthAfter = Math.hypot(after.x, after.y, after.z);
      expect(lengthBefore).toBeCloseTo(1, 9);
      expect(lengthAfter).toBeLessThan(1 + 1e-9);
    }
  });
});

describe("Bloch-sphere conventions agree everywhere", () => {
  it("places |0> at the north pole, |1> at the south, and the maximally mixed state at the centre", () => {
    expect(stateToBlochVector(StateVector.basis(1, 0)).z).toBeCloseTo(1, 12);
    expect(stateToBlochVector(StateVector.basis(1, 1)).z).toBeCloseTo(-1, 12);
    const centre = densityMatrixToBlochVector(maximallyMixedState(2));
    expect(Math.hypot(centre.x, centre.y, centre.z)).toBeCloseTo(0, 12);
  });

  it("agrees between the state-vector and density-matrix routes, and round-trips through (theta, phi)", () => {
    const rand = seededRandom(4001);
    for (let trial = 0; trial < 100; trial++) {
      const state = randomState(1, rand);
      const fromState = stateToBlochVector(state);
      expect(Math.hypot(fromState.x, fromState.y, fromState.z)).toBeCloseTo(1, 9);

      const fromDensity = densityMatrixToBlochVector(pureStateDensityMatrix(state));
      expect(fromDensity.x).toBeCloseTo(fromState.x, 9);
      expect(fromDensity.y).toBeCloseTo(fromState.y, 9);
      expect(fromDensity.z).toBeCloseTo(fromState.z, 9);

      // The angles discard global phase, so the round trip is only required
      // to land on the same *point*, not the same amplitude pair.
      const roundTripped = stateToBlochVector(blochStateFromAngles(stateToBlochAngles(state)));
      expect(roundTripped.x).toBeCloseTo(fromState.x, 8);
      expect(roundTripped.y).toBeCloseTo(fromState.y, 8);
      expect(roundTripped.z).toBeCloseTo(fromState.z, 8);
    }
  });
});

describe("partial trace behaves like a genuine reduced state", () => {
  it("returns the exact factors of a product state and I/2 for a Bell state", () => {
    const rand = seededRandom(5001);
    for (let trial = 0; trial < 50; trial++) {
      const a = randomState(1, rand);
      const b = randomState(1, rand);
      const rho = pureStateDensityMatrix(a.tensor(b));
      expect(partialTrace(rho, 2, [1]).equals(pureStateDensityMatrix(a), 1e-9)).toBe(true);
      expect(partialTrace(rho, 2, [0]).equals(pureStateDensityMatrix(b), 1e-9)).toBe(true);
    }
    const bell = new StateVector([
      new Complex(Math.SQRT1_2),
      Complex.ZERO,
      Complex.ZERO,
      new Complex(Math.SQRT1_2),
    ]);
    const bellRho = pureStateDensityMatrix(bell);
    expect(partialTrace(bellRho, 2, [1]).equals(maximallyMixedState(2), 1e-9)).toBe(true);
    expect(partialTrace(bellRho, 2, [0]).equals(maximallyMixedState(2), 1e-9)).toBe(true);
  });

  it("preserves Hermiticity and trace, and composes: tracing two qubits at once equals tracing them one at a time", () => {
    const rand = seededRandom(5002);
    for (let trial = 0; trial < 30; trial++) {
      const rho = pureStateDensityMatrix(randomState(3, rand));
      const both = partialTrace(rho, 3, [1, 2]);
      const oneAtATime = partialTrace(partialTrace(rho, 3, [2]), 2, [1]);
      expect(both.equals(oneAtATime, 1e-9)).toBe(true);
      expect(both.isHermitian(1e-9)).toBe(true);
      expect(both.trace().re).toBeCloseTo(1, 9);
      expect(both.trace().im).toBeCloseTo(0, 12);
    }
  });
});

describe("entanglement measures agree with each other", () => {
  it("gives both halves of a pure pair the same entropy, and ties it to concurrence by the exact closed form", () => {
    // S = h((1+sqrt(1-C^2))/2) is an identity for pure two-qubit states, so
    // it cross-checks `entanglementEntropy` (which goes through partial
    // trace and eigenvalues) against `concurrenceOfPureState` (which goes
    // through a 2x2 determinant) — two completely different code paths.
    const binaryEntropy = (x: number) =>
      x <= 1e-12 || x >= 1 - 1e-12 ? 0 : -x * Math.log2(x) - (1 - x) * Math.log2(1 - x);
    const rand = seededRandom(6001);
    for (let trial = 0; trial < 100; trial++) {
      const state = randomState(2, rand);
      const rho = pureStateDensityMatrix(state);
      const entropyA = vonNeumannEntropy(partialTrace(rho, 2, [1]));
      const entropyB = vonNeumannEntropy(partialTrace(rho, 2, [0]));
      expect(entropyA).toBeCloseTo(entropyB, 8);
      expect(entanglementEntropy(state)).toBeCloseTo(entropyA, 12);

      const concurrence = concurrenceOfPureState(state);
      expect(concurrence).toBeGreaterThan(-1e-12);
      expect(concurrence).toBeLessThan(1 + 1e-9);
      const larger = (1 + Math.sqrt(Math.max(0, 1 - concurrence * concurrence))) / 2;
      expect(entropyA).toBeCloseTo(binaryEntropy(larger), 7);
    }
  });

  it("gives concurrence 1 for every Bell state and 0 for every product state", () => {
    const h = Math.SQRT1_2;
    const bellStates: [string, StateVector][] = [
      ["Phi+", new StateVector([new Complex(h), Complex.ZERO, Complex.ZERO, new Complex(h)])],
      ["Phi-", new StateVector([new Complex(h), Complex.ZERO, Complex.ZERO, new Complex(-h)])],
      ["Psi+", new StateVector([Complex.ZERO, new Complex(h), new Complex(h), Complex.ZERO])],
      ["Psi-", new StateVector([Complex.ZERO, new Complex(h), new Complex(-h), Complex.ZERO])],
    ];
    for (const [name, state] of bellStates) {
      expect(concurrenceOfPureState(state), name).toBeCloseTo(1, 9);
      expect(entanglementEntropy(state), name).toBeCloseTo(1, 9);
    }

    const rand = seededRandom(6002);
    for (let trial = 0; trial < 50; trial++) {
      const product = randomState(1, rand).tensor(randomState(1, rand));
      expect(concurrenceOfPureState(product)).toBeCloseTo(0, 9);
      expect(entanglementEntropy(product)).toBeCloseTo(0, 8);
    }
  });
});

describe("CHSH respects both of its bounds", () => {
  it("never exceeds Tsirelson's 2√2 for any state and any four angles", () => {
    const rand = seededRandom(7001);
    for (let trial = 0; trial < 400; trial++) {
      const rho = pureStateDensityMatrix(randomState(2, rand));
      const value = Math.abs(
        chshValue(rho, {
          a: spinObservableInXZPlane(rand() * 2 * Math.PI),
          aPrime: spinObservableInXZPlane(rand() * 2 * Math.PI),
          b: spinObservableInXZPlane(rand() * 2 * Math.PI),
          bPrime: spinObservableInXZPlane(rand() * 2 * Math.PI),
        })
      );
      expect(value).toBeLessThan(CHSH_QUANTUM_BOUND + 1e-9);
    }
  });

  it("never exceeds the classical bound of 2 for a separable state, however the angles are chosen", () => {
    // The converse of the headline result: a product state carries no
    // entanglement, so no measurement configuration can make it look like a
    // local hidden-variable model is impossible.
    const rand = seededRandom(7002);
    for (let trial = 0; trial < 400; trial++) {
      const rho = pureStateDensityMatrix(randomState(1, rand).tensor(randomState(1, rand)));
      const value = Math.abs(
        chshValue(rho, {
          a: spinObservableInXZPlane(rand() * 2 * Math.PI),
          aPrime: spinObservableInXZPlane(rand() * 2 * Math.PI),
          b: spinObservableInXZPlane(rand() * 2 * Math.PI),
          bPrime: spinObservableInXZPlane(rand() * 2 * Math.PI),
        })
      );
      expect(value).toBeLessThan(CHSH_CLASSICAL_BOUND + 1e-9);
    }
  });

  it("also respects the classical bound for a separable *mixed* state, not only a product pure state", () => {
    const rand = seededRandom(7003);
    for (let trial = 0; trial < 100; trial++) {
      const terms = Array.from({ length: 3 }, () => ({
        probability: 1 / 3,
        density: pureStateDensityMatrix(randomState(1, rand).tensor(randomState(1, rand))),
      }));
      const rho = convexCombination(terms);
      const value = Math.abs(
        chshValue(rho, {
          a: spinObservableInXZPlane(rand() * 2 * Math.PI),
          aPrime: spinObservableInXZPlane(rand() * 2 * Math.PI),
          b: spinObservableInXZPlane(rand() * 2 * Math.PI),
          bPrime: spinObservableInXZPlane(rand() * 2 * Math.PI),
        })
      );
      expect(value).toBeLessThan(CHSH_CLASSICAL_BOUND + 1e-9);
    }
  });
});

describe("time evolution conserves what it must", () => {
  it("preserves the norm exactly, at any step size, however long it runs", () => {
    // The split-operator method is a product of pure phases, so norm
    // conservation is exact rather than approximate — this is what keeps a
    // long-running animation from drifting even at a coarse dt.
    const grid = createGrid(128, 0.15);
    const potential = harmonicOscillatorPotential(grid, 1);
    for (const dt of [0.001, 0.05, 0.5]) {
      const evolver = new SplitOperatorEvolver(grid, potential, dt);
      let psi = Wavefunction1D.gaussianPacket(grid, { center: -2, width: 0.8, momentum: 1.5 });
      for (let step = 0; step < 200; step++) psi = evolver.step(psi);
      expect(psi.normSquared(), `dt=${dt}`).toBeCloseTo(1, 9);
    }
  });

  it("composes like a time-evolution operator: U(dt) twice converges on U(2dt) as dt shrinks", () => {
    // U(t1)U(t2) = U(t1+t2) holds exactly for the true propagator; the
    // split-operator approximation reproduces it to second order in dt, so
    // the right invariant to assert is that the gap *shrinks like dt^2*,
    // not that it vanishes.
    const grid = createGrid(128, 0.15);
    const potential = harmonicOscillatorPotential(grid, 1);
    const initial = Wavefunction1D.gaussianPacket(grid, { center: -1, width: 0.7, momentum: 0.5 });

    const gapAt = (dt: number) => {
      const fine = new SplitOperatorEvolver(grid, potential, dt);
      const coarse = new SplitOperatorEvolver(grid, potential, 2 * dt);
      const twoSmallSteps = fine.step(fine.step(initial));
      const oneBigStep = coarse.step(initial);
      let worst = 0;
      for (let i = 0; i < grid.n; i++) {
        worst = Math.max(worst, twoSmallSteps.amplitudes[i].sub(oneBigStep.amplitudes[i]).magnitude());
      }
      return worst;
    };

    const coarseGap = gapAt(0.02);
    const fineGap = gapAt(0.01);
    expect(fineGap).toBeLessThan(coarseGap);
    // Second-order accuracy: halving dt should shrink the gap by roughly 4x.
    expect(coarseGap / fineGap).toBeGreaterThan(3);
  });
});
