import { describe, expect, it } from "vitest";
import { Complex } from "../complex";
import { StateVector, tensorStates } from "../state";
import { PAULI_X, PAULI_Z, HADAMARD, applySingleQubitGate, applyControlledGate, applyCNOT, applyCZ, applySwap } from "../gates";
import { qubitMeasurementProbabilities, measureQubit, measurementDistribution } from "../measurement";

const KET_0 = StateVector.zero(1);
const KET_1 = StateVector.basis(1, 1);

function expectState(actual: StateVector, expected: StateVector, epsilon = 1e-9) {
  expect(actual.amplitudes.length).toBe(expected.amplitudes.length);
  actual.amplitudes.forEach((amplitude, i) => {
    expect(amplitude.equals(expected.amplitudes[i], epsilon)).toBe(true);
  });
}

// ---------------------------------------------------------------------------
// Qubit ordering convention: qubit 0 is the most significant (leftmost) bit
// of the basis label. |q0 q1⟩ for two qubits, |q0 q1 q2⟩ for three, etc.
// This is documented in gates.ts and must hold everywhere: tensor products,
// gate application, CNOT, SWAP, and measurement all rely on it.
// ---------------------------------------------------------------------------

describe("qubit ordering convention", () => {
  it("qubit 0 is the leftmost bit of the basis label", () => {
    // basis(2, 1) = the state with index 0b01 = 1, i.e. |01⟩: qubit 0 = 0, qubit 1 = 1.
    expect(StateVector.basis(2, 0b01).basisLabel(0b01)).toBe("01");
    expect(StateVector.basis(2, 0b10).basisLabel(0b10)).toBe("10");
  });

  it("applying X to qubit 0 vs qubit 1 flips different basis labels", () => {
    const zeroZero = StateVector.zero(2); // |00>
    const flipQubit0 = applySingleQubitGate(zeroZero, PAULI_X, 0);
    const flipQubit1 = applySingleQubitGate(zeroZero, PAULI_X, 1);

    // X on qubit 0 should produce |10>, X on qubit 1 should produce |01>.
    expect(measurementDistribution(flipQubit0).find((o) => o.probability > 0.99)?.label).toBe("10");
    expect(measurementDistribution(flipQubit1).find((o) => o.probability > 0.99)?.label).toBe("01");
  });
});

// ---------------------------------------------------------------------------
// Tensor products
// ---------------------------------------------------------------------------

describe("tensor products", () => {
  it("|0>⊗|0> = |00>, |0>⊗|1> = |01>, |1>⊗|0> = |10>, |1>⊗|1> = |11>", () => {
    const cases: Array<[StateVector, StateVector, string]> = [
      [KET_0, KET_0, "00"],
      [KET_0, KET_1, "01"],
      [KET_1, KET_0, "10"],
      [KET_1, KET_1, "11"],
    ];

    for (const [a, b, expectedLabel] of cases) {
      const combined = a.tensor(b);
      expect(combined.numQubits).toBe(2);
      const certain = measurementDistribution(combined).find((o) => o.probability > 0.99);
      expect(certain?.label).toBe(expectedLabel);
    }
  });

  it("dimension grows as 2^n: tensoring k single-qubit states gives a 2^k-dimensional vector", () => {
    const three = tensorStates([KET_0, KET_1, KET_0]); // |010>
    expect(three.numQubits).toBe(3);
    expect(three.dimension).toBe(8);
    expect(measurementDistribution(three).find((o) => o.probability > 0.99)?.label).toBe("010");
  });

  it("tensoring two normalized states yields a normalized state", () => {
    const plus = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
    const combined = plus.tensor(plus);
    expect(combined.isNormalized()).toBe(true);
    // Equal superposition over all 4 basis states.
    combined.probabilities().forEach((p) => expect(p).toBeCloseTo(0.25, 9));
  });

  it("tensor product order matters — |0>⊗|1> and |1>⊗|0> are different states", () => {
    const a = KET_0.tensor(KET_1); // |01>
    const b = KET_1.tensor(KET_0); // |10>
    expect(measurementDistribution(a).find((o) => o.probability > 0.99)?.label).toBe("01");
    expect(measurementDistribution(b).find((o) => o.probability > 0.99)?.label).toBe("10");
  });
});

// ---------------------------------------------------------------------------
// Multi-qubit gates: single-qubit gates targeting a specific qubit, CNOT, SWAP
// ---------------------------------------------------------------------------

describe("two-qubit gates", () => {
  it("CNOT(control=0, target=1) on |10> gives |11>", () => {
    const state = StateVector.basis(2, 0b10);
    const result = applyCNOT(state, 0, 1);
    expect(measurementDistribution(result).find((o) => o.probability > 0.99)?.label).toBe("11");
  });

  it("CNOT(control=0, target=1) on |00> leaves the state unchanged", () => {
    const state = StateVector.zero(2);
    const result = applyCNOT(state, 0, 1);
    expect(measurementDistribution(result).find((o) => o.probability > 0.99)?.label).toBe("00");
  });

  it("CNOT works with the control on qubit 1 and target on qubit 0", () => {
    const state = StateVector.basis(2, 0b01); // |01>, qubit 1 is the control and is 1
    const result = applyCNOT(state, 1, 0);
    expect(measurementDistribution(result).find((o) => o.probability > 0.99)?.label).toBe("11");
  });

  it("CZ leaves computational basis states' probabilities unchanged (it's a phase gate)", () => {
    const state = StateVector.basis(2, 0b11);
    const result = applyCZ(state, 0, 1);
    // |11> -> -|11>: same probabilities, flipped sign.
    expect(result.probabilities()).toEqual(state.probabilities());
    expect(result.amplitudes[0b11].re).toBeCloseTo(-1, 9);
  });

  it("SWAP(0, 1) on |10> gives |01>", () => {
    const state = StateVector.basis(2, 0b10);
    const result = applySwap(state, 0, 1);
    expect(measurementDistribution(result).find((o) => o.probability > 0.99)?.label).toBe("01");
  });

  it("SWAP is its own inverse", () => {
    const state = StateVector.basis(2, 0b10);
    const roundTrip = applySwap(applySwap(state, 0, 1), 0, 1);
    expectState(roundTrip, state);
  });

  it("a general controlled gate (controlled-H) only acts when the control qubit is 1", () => {
    const controlOff = applyControlledGate(StateVector.zero(2), HADAMARD, 0, 1); // control=|0>
    expect(measurementDistribution(controlOff).find((o) => o.probability > 0.99)?.label).toBe("00");

    const controlOn = applyControlledGate(StateVector.basis(2, 0b10), HADAMARD, 0, 1); // control=|1>
    const probs = controlOn.probabilities();
    expect(probs[0b10]).toBeCloseTo(0.5, 9);
    expect(probs[0b11]).toBeCloseTo(0.5, 9);
  });

  it("throws for an out-of-range qubit index", () => {
    const state = StateVector.zero(2);
    expect(() => applySingleQubitGate(state, PAULI_X, 5)).toThrow();
    expect(() => applyCNOT(state, -1, 0)).toThrow();
  });

  it("throws when control and target are the same qubit", () => {
    const state = StateVector.zero(2);
    expect(() => applyCNOT(state, 0, 0)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// Bell state: |00> -> H(qubit 0) -> CNOT(0, 1) -> (|00> + |11>) / sqrt(2)
// ---------------------------------------------------------------------------

describe("Bell state preparation", () => {
  it("H on qubit 0 then CNOT(0,1) from |00> gives (|00> + |11>)/sqrt(2)", () => {
    const afterH = applySingleQubitGate(StateVector.zero(2), HADAMARD, 0);
    const bell = applyCNOT(afterH, 0, 1);

    const expected = new StateVector([
      new Complex(Math.SQRT1_2),
      Complex.ZERO,
      Complex.ZERO,
      new Complex(Math.SQRT1_2),
    ]);
    expectState(bell, expected);
  });

  it("the Bell state is not a product of any two single-qubit states (it's entangled)", () => {
    // If |Phi+> = |a> ⊗ |b> for some single-qubit |a>,|b>, then amplitude(01) = a0*b1 and
    // amplitude(10) = a1*b0 would both have to be 0 while amplitude(00)=a0*b0 and
    // amplitude(11)=a1*b1 are both nonzero. That forces one of a0,a1 to be 0 (killing
    // amplitude 00 or 11) — a direct contradiction. We check the weaker, easily testable
    // consequence: amplitude(00)*amplitude(11) != amplitude(01)*amplitude(10) would hold
    // for *any* product state (a0 b0)(a1 b1) = (a0 b1)(a1 b0), but the Bell state violates it.
    const afterH = applySingleQubitGate(StateVector.zero(2), HADAMARD, 0);
    const bell = applyCNOT(afterH, 0, 1);
    const [a00, a01, a10, a11] = bell.amplitudes;

    const crossProductsEqual = a00.mul(a11).equals(a01.mul(a10));
    expect(crossProductsEqual).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Partial (single-qubit) measurement of a multi-qubit state
// ---------------------------------------------------------------------------

describe("partial measurement", () => {
  function bellState(): StateVector {
    const afterH = applySingleQubitGate(StateVector.zero(2), HADAMARD, 0);
    return applyCNOT(afterH, 0, 1);
  }

  it("each qubit of a Bell state has 50/50 marginal probability", () => {
    const bell = bellState();
    const [p0Qubit0, p1Qubit0] = qubitMeasurementProbabilities(bell, 0);
    const [p0Qubit1, p1Qubit1] = qubitMeasurementProbabilities(bell, 1);
    expect(p0Qubit0).toBeCloseTo(0.5, 9);
    expect(p1Qubit0).toBeCloseTo(0.5, 9);
    expect(p0Qubit1).toBeCloseTo(0.5, 9);
    expect(p1Qubit1).toBeCloseTo(0.5, 9);
  });

  it("measuring qubit 0 of a Bell state collapses qubit 1 to match, exactly", () => {
    const bell = bellState();

    const zeroOutcome = measureQubit(bell, 0, 0.1); // < P(0) = 0.5
    expect(zeroOutcome.outcome).toBe(0);
    expectState(zeroOutcome.collapsed, StateVector.basis(2, 0b00));

    const oneOutcome = measureQubit(bell, 0, 0.9); // >= P(0) = 0.5
    expect(oneOutcome.outcome).toBe(1);
    expectState(oneOutcome.collapsed, StateVector.basis(2, 0b11));
  });

  it("the collapsed state after partial measurement is normalized", () => {
    const bell = bellState();
    const result = measureQubit(bell, 1, 0.3);
    expect(result.collapsed.isNormalized()).toBe(true);
  });

  it("partial measurement on an unentangled qubit leaves the other qubit's superposition intact", () => {
    // |+> ⊗ |0>: measuring qubit 1 (definitely 0) should not disturb qubit 0's superposition.
    const plus = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
    const state = plus.tensor(KET_0);

    const result = measureQubit(state, 1, 0.5);
    expect(result.outcome).toBe(0);
    expect(result.probability).toBeCloseTo(1, 9);

    // Remaining state should still be |+> ⊗ |0>.
    const [p00, p01, p10, p11] = result.collapsed.probabilities();
    expect(p00).toBeCloseTo(0.5, 9);
    expect(p10).toBeCloseTo(0.5, 9);
    expect(p01).toBeCloseTo(0, 9);
    expect(p11).toBeCloseTo(0, 9);
  });

  it("throws for an out-of-range qubit index", () => {
    const bell = bellState();
    expect(() => qubitMeasurementProbabilities(bell, 7)).toThrow();
    expect(() => measureQubit(bell, -1)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// Construction edge cases
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Quantum teleportation: the full 3-qubit protocol, run against the real
// engine for several message states and all 4 of Alice's measurement
// branches, checking Bob's corrected qubit against the original state.
// This doubles as verification of the lesson's hand-derived math.
// ---------------------------------------------------------------------------

describe("quantum teleportation protocol", () => {
  function teleport(message: StateVector, random0: number, random1: number) {
    // Qubit 0 = Alice's message; qubits 1,2 = a shared Bell pair (Alice
    // holds qubit 1, Bob holds qubit 2).
    const bellPair = applyCNOT(applySingleQubitGate(StateVector.zero(2), HADAMARD, 0), 0, 1);
    let state = message.tensor(bellPair);

    // Alice entangles her message qubit with her half of the pair, then
    // measures both of her qubits in the computational basis.
    state = applyCNOT(state, 0, 1);
    state = applySingleQubitGate(state, HADAMARD, 0);

    const m0 = measureQubit(state, 0, random0);
    const m1 = measureQubit(m0.collapsed, 1, random1);

    // Bob corrects his qubit based on Alice's two classical bits.
    let bobState = m1.collapsed;
    if (m1.outcome === 1) bobState = applySingleQubitGate(bobState, PAULI_X, 2);
    if (m0.outcome === 1) bobState = applySingleQubitGate(bobState, PAULI_Z, 2);

    return { outcome0: m0.outcome, outcome1: m1.outcome, bobState };
  }

  const messageStates: Array<[string, StateVector]> = [
    ["|0>", StateVector.zero(1)],
    ["|1>", StateVector.basis(1, 1)],
    ["|+>", new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)])],
    ["0.6|0> + 0.8i|1>", new StateVector([new Complex(0.6), new Complex(0, 0.8)])],
  ];

  // Every branch is exactly 50/50 at each of Alice's two measurements,
  // regardless of the message state (required for no-signaling) — so these
  // four (random0, random1) pairs deterministically select each of the 4
  // outcome combinations for any message.
  const branches: Array<[number, number]> = [
    [0.1, 0.1],
    [0.1, 0.9],
    [0.9, 0.1],
    [0.9, 0.9],
  ];

  for (const [name, message] of messageStates) {
    it(`recovers ${name} exactly on Bob's qubit for all 4 of Alice's measurement outcomes`, () => {
      for (const [r0, r1] of branches) {
        const { outcome0, outcome1, bobState } = teleport(message, r0, r1);
        // After Alice's measurements and Bob's correction, the protocol
        // predicts the 3-qubit state factors completely — Alice's two
        // qubits sit in the definite classical outcomes she observed, and
        // Bob's qubit is exactly the original message, un-entangled from
        // everything else. Check the *entire* state, not just Bob's
        // marginal probabilities, so a phase error can't slip through.
        const expected = tensorStates([
          StateVector.basis(1, outcome0),
          StateVector.basis(1, outcome1),
          message,
        ]);
        expectState(bobState, expected);
      }
    });
  }

  it("Alice's two measurement outcomes are exactly 50/50, independent of the message state", () => {
    for (const [, message] of messageStates) {
      const bellPair = applyCNOT(applySingleQubitGate(StateVector.zero(2), HADAMARD, 0), 0, 1);
      let state = message.tensor(bellPair);
      state = applyCNOT(state, 0, 1);
      state = applySingleQubitGate(state, HADAMARD, 0);

      const [p0] = qubitMeasurementProbabilities(state, 0);
      expect(p0).toBeCloseTo(0.5, 9);
    }
  });
});

// ---------------------------------------------------------------------------
// GHZ state: a 3-qubit generalization of a Bell pair, prepared with H and
// two CNOTs. Used as the capstone lesson's worked example.
// ---------------------------------------------------------------------------

describe("GHZ state", () => {
  function ghzState(): StateVector {
    let state = applySingleQubitGate(StateVector.zero(3), HADAMARD, 0);
    state = applyCNOT(state, 0, 1);
    state = applyCNOT(state, 0, 2);
    return state;
  }

  it("H on qubit 0 then CNOT(0,1) then CNOT(0,2) from |000> gives (|000> + |111>)/sqrt(2)", () => {
    const expected = new StateVector([
      new Complex(Math.SQRT1_2),
      Complex.ZERO,
      Complex.ZERO,
      Complex.ZERO,
      Complex.ZERO,
      Complex.ZERO,
      Complex.ZERO,
      new Complex(Math.SQRT1_2),
    ]);
    expectState(ghzState(), expected);
  });

  it("all three qubits are perfectly correlated: measuring any one determines the other two", () => {
    const ghz = ghzState();
    const first = measureQubit(ghz, 0, 0.1); // outcome 0
    const [p0Second] = qubitMeasurementProbabilities(first.collapsed, 1);
    expect(p0Second).toBeCloseTo(1, 9); // qubit 1 is now definitely 0 too
    const [p0Third] = qubitMeasurementProbabilities(first.collapsed, 2);
    expect(p0Third).toBeCloseTo(1, 9); // and so is qubit 2
  });
});

// ---------------------------------------------------------------------------
// Multi-qubit interference: product-state interference (no entanglement
// needed) concentrating a uniform 4-way superposition onto a single outcome.
// ---------------------------------------------------------------------------

describe("multi-qubit interference", () => {
  it("H, Z (on qubit 1), H concentrates |00> into |01> via pure interference", () => {
    let state = StateVector.zero(2);
    state = applySingleQubitGate(state, HADAMARD, 0);
    state = applySingleQubitGate(state, HADAMARD, 1);
    // Uniform superposition over all four outcomes before the phase flip.
    state.probabilities().forEach((p) => expect(p).toBeCloseTo(0.25, 9));

    state = applySingleQubitGate(state, PAULI_Z, 1);
    state = applySingleQubitGate(state, HADAMARD, 0);
    state = applySingleQubitGate(state, HADAMARD, 1);

    expectState(state, StateVector.basis(2, 0b01));
  });
});

describe("StateVector construction", () => {
  it("rejects a non-power-of-two amplitude count", () => {
    expect(() => new StateVector([Complex.ONE, Complex.ZERO, Complex.ZERO])).toThrow();
  });

  it("tensorStates requires at least one state", () => {
    expect(() => tensorStates([])).toThrow();
  });
});
