import { describe, expect, it } from "vitest";
import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { rotationAboutAxis, rotationX, rotationY, rotationZ, applySingleQubitGate } from "@/lib/quantum/gates";
import { blochStateFromAngles, stateToBlochVector, densityMatrixToBlochVector, type BlochVector } from "@/lib/quantum/bloch";
import {
  pureStateDensityMatrix,
  convexCombination,
  purity,
  vonNeumannEntropy,
  validateDensityMatrix,
  eigenvaluesHermitian2x2,
  maximallyMixedState,
} from "@/lib/quantum/densityMatrix";
import { runInstructions, type GateInstruction } from "@/lib/quantum/circuitBuilder";
import {
  normalizedTwoLevelAmplitudes,
  interferenceProbability,
  classicalSumProbability,
  crossBasisProbability,
} from "@/lib/quantum/amplitude";
import { FIXED_GATES, ROTATION_AXES } from "../bloch-sphere/gateDefinitions";
import { isFullyProductState } from "../circuit-builder/separability";
import { AMPLITUDE_PRESETS } from "../complex-amplitude-explorer/presets";
import { MIXTURE_PRESETS } from "../density-matrix-explorer/presets";
import { STATE_PRESETS } from "../bloch-sphere/presets";

/**
 * The instrument claims `simulatorClaims.test.ts` does not already cover, each
 * checked against physics derived here rather than against the engine that
 * draws the screen.
 *
 * The organising idea is the same one that file states: comparing a simulator
 * against the engine it calls proves only that the call happened. So the Bloch
 * gates below are checked against Rodrigues' rotation formula on a plain
 * three-vector, with no quantum arithmetic in the expectation at all; the
 * circuit builder's Bell and GHZ amplitudes are written out by hand; and the
 * density-matrix instruments' validity is re-derived from ρ's own eigenvalues
 * across the whole reachable control surface rather than sampled at the
 * presets.
 */

const TOLERANCE = 1e-12;

// --- Independent classical rotation ---------------------------------------

/**
 * Rodrigues' rotation formula: `v` rotated by `angle` about the unit vector
 * `axis`, right-handed. Deliberately written in ordinary vector algebra, with
 * no reference to Pauli matrices, spinors, or anything in `lib/quantum`. This
 * is the picture the instrument draws and the sentence its narration makes
 * ("rotates the state by π about the X axis"), so it is what the gate has to
 * agree with, including the *sense* of the turn.
 */
function rotate(v: BlochVector, axis: BlochVector, angle: number): BlochVector {
  const norm = Math.hypot(axis.x, axis.y, axis.z);
  const n = { x: axis.x / norm, y: axis.y / norm, z: axis.z / norm };
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dot = n.x * v.x + n.y * v.y + n.z * v.z;
  const cross = {
    x: n.y * v.z - n.z * v.y,
    y: n.z * v.x - n.x * v.z,
    z: n.x * v.y - n.y * v.x,
  };
  return {
    x: v.x * cos + cross.x * sin + n.x * dot * (1 - cos),
    y: v.y * cos + cross.y * sin + n.y * dot * (1 - cos),
    z: v.z * cos + cross.z * sin + n.z * dot * (1 - cos),
  };
}

function expectVectorClose(actual: BlochVector, expected: BlochVector, label: string, digits = 9) {
  expect(actual.x, `${label} x`).toBeCloseTo(expected.x, digits);
  expect(actual.y, `${label} y`).toBeCloseTo(expected.y, digits);
  expect(actual.z, `${label} z`).toBeCloseTo(expected.z, digits);
}

/** A spread of starting states, including every preset and some generic off-axis points. */
const START_ANGLES = [
  ...STATE_PRESETS.map((preset) => preset.angles),
  { theta: 0.7, phi: 0.4 },
  { theta: 1.9, phi: 4.2 },
  { theta: 2.6, phi: 5.9 },
];

describe("Bloch sphere explorer: gates really are the rotations the buttons name", () => {
  it("turns every fixed gate's Bloch vector by exactly the stated axis, angle and sense", () => {
    for (const gate of FIXED_GATES) {
      for (const angles of START_ANGLES) {
        const start = blochStateFromAngles(angles);
        const after = stateToBlochVector(applySingleQubitGate(start, gate.matrix, 0));
        const expected = rotate(stateToBlochVector(start), gate.axis, gate.angle);
        expectVectorClose(after, expected, `${gate.id} from θ=${angles.theta.toFixed(2)}`);
      }
    }
  });

  /**
   * The sense of the turn is the half of "axis and angle" that a sign error
   * hides in: a π rotation is its own inverse, so X, Y, Z and H would all pass
   * the check above with the angle negated. S and T would not, and neither
   * would the Rx/Ry/Rz sliders, so those are pinned against a hand-computed
   * destination rather than against the formula.
   */
  it("sends |+⟩ to |+i⟩ under S, never to |−i⟩", () => {
    const plus = blochStateFromAngles({ theta: Math.PI / 2, phi: 0 });
    const sGate = FIXED_GATES.find((gate) => gate.id === "S")!;
    const after = stateToBlochVector(applySingleQubitGate(plus, sGate.matrix, 0));
    expectVectorClose(after, { x: 0, y: 1, z: 0 }, "S|+⟩");
  });

  it("sends |0⟩ to |−i⟩ under Rx(90°), the right-handed turn about x", () => {
    // ẑ rotated +90° about x̂ is −ŷ, by the right-hand rule. |−i⟩ is at y = −1.
    const after = stateToBlochVector(StateVector.zero(1).applyMatrix(rotationX(Math.PI / 2)));
    expectVectorClose(after, { x: 0, y: -1, z: 0 }, "Rx(90°)|0⟩");
  });

  it("turns each Rx/Ry/Rz slider by exactly its own angle about its own axis", () => {
    const matrixFor: Record<string, (theta: number) => ReturnType<typeof rotationX>> = {
      Rx: rotationX,
      Ry: rotationY,
      Rz: rotationZ,
    };
    for (const { id, axis } of ROTATION_AXES) {
      for (let step = -8; step <= 8; step++) {
        const angle = (step / 8) * Math.PI;
        for (const angles of START_ANGLES) {
          const start = blochStateFromAngles(angles);
          const after = stateToBlochVector(applySingleQubitGate(start, matrixFor[id](angle), 0));
          expectVectorClose(after, rotate(stateToBlochVector(start), axis, angle), `${id}(${angle.toFixed(2)})`);
        }
      }
    }
  });

  /**
   * `BlochSphereExplorer.applyGate` does not tween between the before and after
   * points: it re-applies `rotationAboutAxis(gate.axis, gate.angle * t)` at
   * every frame, so the drawn path is a claim about the physics too. A gate
   * whose matrix is right and whose declared (axis, angle) is wrong would land
   * in the correct place along a wrong arc. Every intermediate frame is checked
   * against the same Rodrigues rotation, at the same fraction of the angle.
   */
  it("draws every intermediate animation frame on the true rotation arc", () => {
    for (const gate of FIXED_GATES) {
      for (const angles of START_ANGLES) {
        const start = blochStateFromAngles(angles);
        const startVector = stateToBlochVector(start);
        for (let frame = 0; frame <= 10; frame++) {
          const t = frame / 10;
          const drawn = stateToBlochVector(start.applyMatrix(rotationAboutAxis(gate.axis, gate.angle * t)));
          expectVectorClose(drawn, rotate(startVector, gate.axis, gate.angle * t), `${gate.id} frame ${frame}`);
        }
      }
    }
  });

  /**
   * The animation ends by committing `applySingleQubitGate(state, gate.matrix)`
   * while the last frame drawn is `rotationAboutAxis(axis, angle)`. Those are
   * equal only up to a global phase; if they were not equal even up to that,
   * the vector would jump at the end of every gate.
   */
  it("lands the settled state exactly where the last animation frame drew it", () => {
    for (const gate of FIXED_GATES) {
      for (const angles of START_ANGLES) {
        const start = blochStateFromAngles(angles);
        const settled = stateToBlochVector(applySingleQubitGate(start, gate.matrix, 0));
        const lastFrame = stateToBlochVector(start.applyMatrix(rotationAboutAxis(gate.axis, gate.angle)));
        expectVectorClose(lastFrame, settled, `${gate.id} handoff`, 12);
      }
    }
  });

  /**
   * The "try this" copy tells the reader to press H, then S, then H. Clicking
   * three buttons has to mean H·S·H applied in click order, not the reverse,
   * and the composite is the standard identity H S H = e^{iπ/4} Rx(π/2): from
   * |0⟩ that is a right-handed quarter turn about x, landing on |−i⟩.
   */
  it("composes a gate sequence in the order the buttons were pressed", () => {
    const byId = Object.fromEntries(FIXED_GATES.map((gate) => [gate.id, gate]));
    let state = StateVector.zero(1);
    for (const id of ["H", "S", "H"] as const) {
      state = applySingleQubitGate(state, byId[id].matrix, 0);
    }
    expectVectorClose(stateToBlochVector(state), { x: 0, y: -1, z: 0 }, "H then S then H from |0⟩");

    // The reverse order is a different point, so the test above is not
    // order-blind: H then Z then H (Z and S differ, but the principle is the
    // same) is checked directly against the non-commuting partner.
    const sThenH = applySingleQubitGate(applySingleQubitGate(StateVector.zero(1), byId["S"].matrix, 0), byId["H"].matrix, 0);
    const hThenS = applySingleQubitGate(applySingleQubitGate(StateVector.zero(1), byId["H"].matrix, 0), byId["S"].matrix, 0);
    const a = stateToBlochVector(sThenH);
    const b = stateToBlochVector(hThenS);
    expect(Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z)).toBeGreaterThan(0.5);
  });

  it("keeps every gate on the sphere's surface, which is the one thing the drawing asserts", () => {
    for (const gate of FIXED_GATES) {
      for (const angles of START_ANGLES) {
        const after = stateToBlochVector(applySingleQubitGate(blochStateFromAngles(angles), gate.matrix, 0));
        expect(Math.hypot(after.x, after.y, after.z), `${gate.id} |r|`).toBeCloseTo(1, 9);
      }
    }
  });

  /**
   * The θ/φ sliders and the sphere are two readings of one number, so the map
   * from angles to the drawn point has to be the textbook one:
   * (sin θ cos φ, sin θ sin φ, cos θ).
   */
  it("maps (θ, φ) to the Cartesian point the sphere's axes are labelled for", () => {
    for (let i = 0; i <= 12; i++) {
      for (let j = 0; j <= 12; j++) {
        const theta = (i / 12) * Math.PI;
        const phi = (j / 12) * 2 * Math.PI;
        const vector = stateToBlochVector(blochStateFromAngles({ theta, phi }));
        expectVectorClose(
          vector,
          { x: Math.sin(theta) * Math.cos(phi), y: Math.sin(theta) * Math.sin(phi), z: Math.cos(theta) },
          `θ=${theta.toFixed(2)} φ=${phi.toFixed(2)}`
        );
      }
    }
  });
});

// --- Circuit builder ------------------------------------------------------

const SQRT1_2 = Math.SQRT1_2;

/** The amplitude vector, as plain numbers, for comparing against hand-written expectations. */
function amplitudePairs(state: StateVector): [number, number][] {
  return state.amplitudes.map((a) => [a.re, a.im] as [number, number]);
}

function expectAmplitudes(state: StateVector, expected: [number, number][], label: string) {
  const actual = amplitudePairs(state);
  expect(actual.length, `${label} dimension`).toBe(expected.length);
  for (let i = 0; i < expected.length; i++) {
    expect(actual[i][0], `${label} amplitude ${i} re`).toBeCloseTo(expected[i][0], 12);
    expect(actual[i][1], `${label} amplitude ${i} im`).toBeCloseTo(expected[i][1], 12);
  }
}

describe("Circuit builder: amplitudes, probabilities and the separability verdict", () => {
  /** The circuit the instrument mounts with, spelled out in `CircuitBuilder.tsx`. */
  const OPENING_CIRCUIT: GateInstruction[] = [
    { gate: "H", targets: [0] },
    { gate: "CNOT", targets: [0, 1] },
  ];

  it("produces the Bell pair the opening circuit claims, amplitude by amplitude", () => {
    const state = runInstructions(2, OPENING_CIRCUIT);
    expectAmplitudes(state, [[SQRT1_2, 0], [0, 0], [0, 0], [SQRT1_2, 0]], "|Φ+⟩");
    const probabilities = state.probabilities();
    for (const [index, expected] of [0.5, 0, 0, 0.5].entries()) {
      expect(probabilities[index], `P(|${state.basisLabel(index)}⟩)`).toBeCloseTo(expected, 12);
    }
    // Displayed as percentages, which is what the state inspector rounds to.
    expect(state.probabilities().map((p) => Math.round(p * 100))).toEqual([50, 0, 0, 50]);
  });

  it("still calls the state a product after H alone, and entangled only after the CNOT", () => {
    // The scrub-back-to-1 claim the framing copy makes in so many words.
    expect(isFullyProductState(runInstructions(2, []))).toBe(true);
    expect(isFullyProductState(runInstructions(2, OPENING_CIRCUIT.slice(0, 1)))).toBe(true);
    expect(isFullyProductState(runInstructions(2, OPENING_CIRCUIT))).toBe(false);
  });

  it("builds the three-qubit GHZ state the framing copy asks for, and calls it entangled", () => {
    const ghz = runInstructions(3, [
      { gate: "H", targets: [0] },
      { gate: "CNOT", targets: [0, 1] },
      { gate: "CNOT", targets: [0, 2] },
    ]);
    const expected: [number, number][] = Array.from({ length: 8 }, (_, i) =>
      i === 0 || i === 7 ? [SQRT1_2, 0] : [0, 0]
    );
    expectAmplitudes(ghz, expected, "GHZ");
    expect(isFullyProductState(ghz)).toBe(false);
    // And every intermediate prefix is a product state, so the note names the
    // right step as the one that entangles.
    expect(isFullyProductState(runInstructions(3, [{ gate: "H", targets: [0] }]))).toBe(true);
  });

  it("calls a genuine product state separable however many single-qubit gates it is dressed in", () => {
    const product = runInstructions(3, [
      { gate: "H", targets: [0] },
      { gate: "T", targets: [1] },
      { gate: "H", targets: [1] },
      { gate: "S", targets: [2] },
      { gate: "X", targets: [2] },
      { gate: "RY", targets: [0], param: 0.83 },
    ]);
    expect(isFullyProductState(product)).toBe(true);
    // The tensor factorisation, written out independently: q0 = Ry(0.83)H|0⟩,
    // q1 = HT|0⟩, q2 = XS|0⟩, and their tensor product must be this state.
    const q0 = applySingleQubitGate(
      applySingleQubitGate(StateVector.zero(1), FIXED_GATES.find((g) => g.id === "H")!.matrix, 0),
      rotationY(0.83),
      0
    );
    const q1 = applySingleQubitGate(
      applySingleQubitGate(StateVector.zero(1), FIXED_GATES.find((g) => g.id === "T")!.matrix, 0),
      FIXED_GATES.find((g) => g.id === "H")!.matrix,
      0
    );
    const q2 = applySingleQubitGate(
      applySingleQubitGate(StateVector.zero(1), FIXED_GATES.find((g) => g.id === "S")!.matrix, 0),
      FIXED_GATES.find((g) => g.id === "X")!.matrix,
      0
    );
    const factored = q0.tensor(q1).tensor(q2);
    expect(factored.innerProduct(product).magnitude()).toBeCloseTo(1, 12);
  });

  /**
   * The interesting half of a separability verdict is where it changes its
   * mind. cos ε|00⟩ + sin ε|11⟩ has reduced purity cos⁴ε + sin⁴ε = 1 − ½sin²2ε,
   * so the verdict flips at sin²2ε = 2 × 1e-6, i.e. ε ≈ 7.07e-4. This checks
   * both sides of that: a state that is close to separable but genuinely is
   * not gets called entangled, and one inside the tolerance gets called
   * separable, with the boundary landing where the closed form says it does.
   */
  it("gets the verdict right on either side of the near-separable boundary", () => {
    const nearlyProduct = (epsilon: number) =>
      new StateVector([new Complex(Math.cos(epsilon)), Complex.ZERO, Complex.ZERO, new Complex(Math.sin(epsilon))]);

    for (const epsilon of [1e-2, 5e-3, 2e-3, 1e-3]) {
      const reducedPurity = Math.cos(epsilon) ** 4 + Math.sin(epsilon) ** 4;
      expect(reducedPurity, `ε=${epsilon} is genuinely below tolerance`).toBeLessThan(1 - 1e-6);
      expect(isFullyProductState(nearlyProduct(epsilon)), `ε=${epsilon}`).toBe(false);
    }
    for (const epsilon of [0, 1e-5, 1e-4, 3e-4]) {
      const reducedPurity = Math.cos(epsilon) ** 4 + Math.sin(epsilon) ** 4;
      expect(reducedPurity, `ε=${epsilon} is genuinely within tolerance`).toBeGreaterThan(1 - 1e-6);
      expect(isFullyProductState(nearlyProduct(epsilon)), `ε=${epsilon}`).toBe(true);
    }
  });

  it("treats a measurement marker as a diagram symbol, leaving the state exactly as it was", () => {
    const withoutMarker = runInstructions(2, OPENING_CIRCUIT);
    const withMarker = runInstructions(2, [...OPENING_CIRCUIT, { gate: "MEASURE", targets: [0] }]);
    expectAmplitudes(withMarker, amplitudePairs(withoutMarker), "MEASURE marker");
  });

  it("keeps the state normalized after every prefix of a long mixed circuit", () => {
    const circuit: GateInstruction[] = [
      { gate: "H", targets: [0] },
      { gate: "CNOT", targets: [0, 1] },
      { gate: "T", targets: [1] },
      { gate: "SWAP", targets: [0, 2] },
      { gate: "CZ", targets: [1, 2] },
      { gate: "RZ", targets: [2], param: 1.2 },
      { gate: "Y", targets: [0] },
      { gate: "P", targets: [1], param: -0.6 },
    ];
    for (let step = 0; step <= circuit.length; step++) {
      const state = runInstructions(3, circuit.slice(0, step));
      expect(state.norm(), `step ${step}`).toBeCloseTo(1, 12);
      const total = state.probabilities().reduce((sum, p) => sum + p, 0);
      expect(total, `step ${step} probabilities sum`).toBeCloseTo(1, 12);
    }
  });
});

// --- Complex amplitude explorer -------------------------------------------

describe("Complex amplitude explorer", () => {
  it("reads magnitude, phase and |z|² off every preset exactly as a reader would compute them", () => {
    const expected: Record<string, { magnitude: number; phaseDeg: number; probability: number }> = {
      one: { magnitude: 1, phaseDeg: 0, probability: 1 },
      i: { magnitude: 1, phaseDeg: 90, probability: 1 },
      "neg-one": { magnitude: 1, phaseDeg: 180, probability: 1 },
      "neg-i": { magnitude: 1, phaseDeg: -90, probability: 1 },
      plus: { magnitude: 1, phaseDeg: 45, probability: 1 },
      "point6-point8i": { magnitude: 1, phaseDeg: 53.13010235415598, probability: 1 },
    };
    for (const preset of AMPLITUDE_PRESETS) {
      const z = new Complex(preset.re, preset.im);
      const target = expected[preset.id];
      expect(z.magnitude(), `${preset.label} |z|`).toBeCloseTo(target.magnitude, 12);
      expect((z.phase() * 180) / Math.PI, `${preset.label} phase`).toBeCloseTo(target.phaseDeg, 9);
      expect(z.magnitudeSquared(), `${preset.label} |z|²`).toBeCloseTo(target.probability, 12);
    }
  });

  it("leaves |z|² untouched under the phase slider, which is the instrument's entire claim", () => {
    const magnitude = 0.83;
    for (let deg = -180; deg <= 180; deg += 5) {
      const phase = (deg * Math.PI) / 180;
      const z = new Complex(magnitude * Math.cos(phase), magnitude * Math.sin(phase));
      expect(z.magnitudeSquared()).toBeCloseTo(magnitude * magnitude, 12);
      expect(z.magnitude()).toBeCloseTo(magnitude, 12);
    }
  });

  /**
   * The two-amplitude mode's readouts, against closed forms rather than
   * against `lib/quantum/amplitude.ts` itself. With |α| = cos ω and
   * |β| = sin ω and a relative phase δ,
   *   |α+β|² = 1 + sin(2ω)cos δ    and    |α|²+|β|² = 1,
   * so P(+) = |α+β|²/2 = (1 + sin(2ω)cos δ)/2 and P(−) = 1 − P(+).
   */
  it("matches the closed form for both interference readings across the sliders", () => {
    for (let i = 0; i <= 10; i++) {
      const omega = (i / 10) * (Math.PI / 2);
      const alphaMagnitude = Math.cos(omega);
      for (let deg = -180; deg <= 180; deg += 15) {
        const delta = (deg * Math.PI) / 180;
        const [alpha, beta] = normalizedTwoLevelAmplitudes(alphaMagnitude, 0, delta);
        const closedForm = 1 + Math.sin(2 * omega) * Math.cos(delta);

        expect(classicalSumProbability(alpha, beta)).toBeCloseTo(1, 12);
        expect(interferenceProbability(alpha, beta)).toBeCloseTo(closedForm, 12);

        const plus = crossBasisProbability(alpha, beta);
        expect(plus).toBeCloseTo(closedForm / 2, 12);
        expect(plus).toBeGreaterThanOrEqual(-TOLERANCE);
        expect(plus).toBeLessThanOrEqual(1 + TOLERANCE);
        expect(plus + (1 - plus)).toBeCloseTo(1, 12);
      }
    }
  });

  it("reaches exactly 2 and exactly 0 at the two ends of the relative-phase slider, for equal magnitudes", () => {
    const [alphaIn, betaIn] = normalizedTwoLevelAmplitudes(SQRT1_2, 0, 0);
    expect(interferenceProbability(alphaIn, betaIn)).toBeCloseTo(2, 12);
    const [alphaOut, betaOut] = normalizedTwoLevelAmplitudes(SQRT1_2, 0, Math.PI);
    expect(interferenceProbability(alphaOut, betaOut)).toBeCloseTo(0, 12);
    // The "classical" comparison bar never moves while that happens.
    expect(classicalSumProbability(alphaIn, betaIn)).toBeCloseTo(1, 12);
    expect(classicalSumProbability(alphaOut, betaOut)).toBeCloseTo(1, 12);
  });

  /**
   * The `global-vs-relative` variant's whole demonstration: dragging γ rotates
   * both arrows together, and P(0), P(1) and the α*β cross-term all stay put.
   */
  it("freezes both probabilities and the cross-term under a global phase, and moves the cross-term under a relative one", () => {
    const magnitude = 0.6;
    const delta = 0.9;
    const [alpha0, beta0] = normalizedTwoLevelAmplitudes(magnitude, 0, delta);
    const reference = alpha0.conjugate().mul(beta0);

    for (let deg = -180; deg <= 180; deg += 10) {
      const gamma = (deg * Math.PI) / 180;
      const [alpha, beta] = normalizedTwoLevelAmplitudes(magnitude, gamma, delta + gamma);
      expect(alpha.magnitudeSquared()).toBeCloseTo(magnitude * magnitude, 12);
      expect(beta.magnitudeSquared()).toBeCloseTo(1 - magnitude * magnitude, 12);
      const cross = alpha.conjugate().mul(beta);
      expect(cross.re).toBeCloseTo(reference.re, 12);
      expect(cross.im).toBeCloseTo(reference.im, 12);
    }

    const [alphaMoved, betaMoved] = normalizedTwoLevelAmplitudes(magnitude, 0, delta + 1.1);
    const moved = alphaMoved.conjugate().mul(betaMoved);
    expect(Math.hypot(moved.re - reference.re, moved.im - reference.im)).toBeGreaterThan(0.1);
  });
});

// --- Density matrix and mixture explorers ---------------------------------

/**
 * The full reachable control surface of `DensityMatrixExplorer`: two Bloch
 * angle pairs and a mixing weight. `simulatorClaims.test.ts` pins the six
 * presets; this sweeps the sliders, because "ρ is a valid density matrix" is
 * a claim the panel makes on every frame, not only at the presets.
 */
describe("Density matrix explorer: validity across the whole control surface", () => {
  const mixtureFor = (t1: number, p1: number, t2: number, p2: number, weight: number) =>
    convexCombination([
      { probability: weight, density: pureStateDensityMatrix(blochStateFromAngles({ theta: t1, phi: p1 })) },
      { probability: 1 - weight, density: pureStateDensityMatrix(blochStateFromAngles({ theta: t2, phi: p2 })) },
    ]);

  it("stays Hermitian, unit-trace and positive semi-definite everywhere the sliders reach", () => {
    for (let a = 0; a <= 4; a++) {
      for (let b = 0; b <= 4; b++) {
        for (let c = 0; c <= 4; c++) {
          for (let w = 0; w <= 5; w++) {
            const t1 = (a / 4) * Math.PI;
            const p1 = (b / 4) * 2 * Math.PI;
            const t2 = (c / 4) * Math.PI;
            const rho = mixtureFor(t1, p1, t2, 1.3, w / 5);
            const validation = validateDensityMatrix(rho);
            expect(validation.isHermitian).toBe(true);
            expect(validation.hasUnitTrace).toBe(true);
            expect(validation.isPositiveSemiDefinite).toBe(true);
            expect(validation.valid).toBe(true);

            // Re-derived rather than trusted: eigenvalues real, non-negative,
            // summing to 1, and purity = Σλ² in [1/2, 1] for a qubit.
            const [lambda1, lambda2] = eigenvaluesHermitian2x2(rho);
            expect(lambda1 + lambda2).toBeCloseTo(1, 9);
            expect(Math.min(lambda1, lambda2)).toBeGreaterThanOrEqual(-1e-12);
            const purityValue = purity(rho);
            expect(purityValue).toBeCloseTo(lambda1 ** 2 + lambda2 ** 2, 9);
            expect(purityValue).toBeGreaterThanOrEqual(0.5 - 1e-12);
            expect(purityValue).toBeLessThanOrEqual(1 + 1e-12);

            // And the drawn point is inside the ball, with |r| tied to purity
            // by the exact identity P = (1 + |r|²)/2 for a qubit.
            const vector = densityMatrixToBlochVector(rho);
            const radius = Math.hypot(vector.x, vector.y, vector.z);
            expect(radius).toBeLessThanOrEqual(1 + 1e-12);
            expect(purityValue).toBeCloseTo((1 + radius * radius) / 2, 9);
          }
        }
      }
    }
  });

  it("shows purity 1/d and entropy log2(d) for the maximally mixed qubit, not 0 and not 1", () => {
    const rho = maximallyMixedState(2);
    expect(purity(rho)).toBeCloseTo(0.5, 12);
    expect(vonNeumannEntropy(rho)).toBeCloseTo(1, 12);
    expect(purity(rho)).not.toBeCloseTo(0, 3);
    expect(purity(rho)).not.toBeCloseTo(1, 3);

    // Reached from the instrument's own controls, both ways round.
    for (const id of ["mix-0-1", "mix-plus-minus"]) {
      const preset = MIXTURE_PRESETS.find((p) => p.id === id)!;
      const built = mixtureFor(
        preset.component1.theta,
        preset.component1.phi,
        preset.component2.theta,
        preset.component2.phi,
        preset.weight
      );
      expect(built.equals(rho, 1e-12)).toBe(true);
      expect(purity(built)).toBeCloseTo(0.5, 12);
      expect(vonNeumannEntropy(built)).toBeCloseTo(1, 12);
    }
  });

  it("reads purity exactly 1 and entropy exactly 0 at both ends of the weight slider", () => {
    for (const weight of [0, 1]) {
      const rho = mixtureFor(0.9, 2.1, 2.4, 0.3, weight);
      expect(purity(rho)).toBeCloseTo(1, 12);
      expect(vonNeumannEntropy(rho)).toBeCloseTo(0, 9);
      expect(Math.hypot(...Object.values(densityMatrixToBlochVector(rho)))).toBeCloseTo(1, 9);
    }
  });

  /**
   * The three-component explorer's weights are p₀ and p₁ from sliders with p₊
   * derived as 1 − p₀ − p₁, so the reachable set is the whole simplex, and the
   * derived weight is where a floating-point sign error would live.
   */
  it("keeps the three-component mixture a valid state over the entire weight simplex", () => {
    const rho0 = pureStateDensityMatrix(blochStateFromAngles({ theta: 0, phi: 0 }));
    const rho1 = pureStateDensityMatrix(blochStateFromAngles({ theta: Math.PI, phi: 0 }));
    const rhoPlus = pureStateDensityMatrix(blochStateFromAngles({ theta: Math.PI / 2, phi: 0 }));

    for (let i = 0; i <= 20; i++) {
      const p0 = i / 20;
      for (let j = 0; j <= 20; j++) {
        const p1 = Math.min(j / 20, 1 - p0);
        const pPlus = 1 - p0 - p1;
        expect(pPlus).toBeGreaterThanOrEqual(-1e-12);
        const rho = convexCombination([
          { probability: p0, density: rho0 },
          { probability: p1, density: rho1 },
          { probability: pPlus, density: rhoPlus },
        ]);
        const validation = validateDensityMatrix(rho);
        expect(validation.valid, `p0=${p0} p1=${p1}`).toBe(true);
        expect(purity(rho)).toBeGreaterThanOrEqual(0.5 - 1e-12);
        expect(purity(rho)).toBeLessThanOrEqual(1 + 1e-12);
        expect(vonNeumannEntropy(rho)).toBeGreaterThanOrEqual(-1e-12);
        expect(vonNeumannEntropy(rho)).toBeLessThanOrEqual(1 + 1e-12);
      }
    }
  });
});
