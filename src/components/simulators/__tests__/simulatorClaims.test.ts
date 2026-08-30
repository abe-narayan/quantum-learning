import { describe, expect, it } from "vitest";
import { Complex } from "@/lib/quantum/complex";
import { StateVector } from "@/lib/quantum/state";
import { pureStateDensityMatrix, purity, vonNeumannEntropy, convexCombination } from "@/lib/quantum/densityMatrix";
import { blochStateFromAngles, densityMatrixToBlochVector } from "@/lib/quantum/bloch";
import { applyKrausChannel, amplitudeDampingChannel, dephasingChannel } from "@/lib/quantum/openSystems";
import { reducedDensityMatrixQubit0, reducedDensityMatrixQubit1 } from "@/lib/quantum/partialTrace";
import { measureQubit } from "@/lib/quantum/measurement";
import { chshValue, spinObservableInXZPlane, CHSH_QUANTUM_BOUND, CHSH_CLASSICAL_BOUND } from "@/lib/quantum/chsh";
import { uniformSuperposition, groverIteration, optimalGroverIterations } from "@/lib/quantum/grover";
import { classicalOrder, periodFindingMeasurementDistribution } from "@/lib/quantum/shor";
import { qaoaCircuit, expectedCutSize, bruteForceMaxCut } from "@/lib/quantum/qaoa";
import { exactTwoLevelTrajectory } from "@/lib/quantum/approximationMethods";
import {
  encodeBitFlipCode,
  encodePhaseFlipCode,
  applyBitFlipErrors,
  applyPhaseFlipErrors,
  runBitFlipCorrectionCycle,
  runPhaseFlipCorrectionCycle,
} from "@/lib/quantum/errorCorrection";
import { QAOA_GRAPH_PRESETS } from "../qaoa-explorer/presets";
import { MIXTURE_PRESETS } from "../density-matrix-explorer/presets";
import { STATE_PRESETS } from "../bloch-sphere/presets";
import { coprimeBases } from "../period-finding-explorer/PeriodFindingControls";

/**
 * One test per simulator, for the single physical claim a reader takes away
 * from driving it, checked against closed-form physics rather than against
 * the engine that computes what is on screen.
 *
 * Everything here is deliberately re-derived: Grover's sin²((2k+1)θ), the
 * Rabi ceiling 4V²/(Δ²+4V²), CHSH's cos(a−b) correlations for |Φ+⟩, the
 * repetition code's syndrome table. Comparing a simulator against the engine
 * it calls proves only that the call happened.
 */

const SQRT1_2 = Math.SQRT1_2;

function bellPhiPlus(): StateVector {
  return new StateVector([new Complex(SQRT1_2), Complex.ZERO, Complex.ZERO, new Complex(SQRT1_2)]);
}

describe("CHSH Bell test explorer", () => {
  /**
   * For |Φ+⟩ and A = cos(θ)Z + sin(θ)X, ⟨A⊗B⟩ = ½Tr(A Bᵀ) = cos(θ_A − θ_B).
   * Everything the instrument shows follows from that one identity, so it is
   * the thing to check, not the engine's own arithmetic.
   */
  const rho = pureStateDensityMatrix(bellPhiPlus());
  const sOf = (a: number, aPrime: number, b: number, bPrime: number) =>
    chshValue(rho, {
      a: spinObservableInXZPlane(a),
      aPrime: spinObservableInXZPlane(aPrime),
      b: spinObservableInXZPlane(b),
      bPrime: spinObservableInXZPlane(bPrime),
    });

  it("matches the closed-form correlation cos(a − b) across the sliders' whole range", () => {
    for (let i = 0; i <= 24; i++) {
      const a = -Math.PI + (i / 24) * 2 * Math.PI;
      const aPrime = a + 1.1;
      const b = a - 0.7;
      const bPrime = a + 2.3;
      const closedForm =
        Math.cos(a - b) + Math.cos(a - bPrime) + Math.cos(aPrime - b) - Math.cos(aPrime - bPrime);
      expect(sOf(a, aPrime, b, bPrime)).toBeCloseTo(closedForm, 12);
    }
  });

  it("reaches exactly Tsirelson's bound at the quantum-optimal preset and exactly 2 at the all-zero preset", () => {
    expect(sOf(0, Math.PI / 2, Math.PI / 4, -Math.PI / 4)).toBeCloseTo(CHSH_QUANTUM_BOUND, 12);
    expect(sOf(0, 0, 0, 0)).toBeCloseTo(CHSH_CLASSICAL_BOUND, 12);
  });

  it("never exceeds Tsirelson's bound anywhere on the four sliders, so the gauge can never overflow", () => {
    for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 11; j++) {
        for (let k = 0; k < 11; k++) {
          const a = -Math.PI + (i / 10) * 2 * Math.PI;
          const aPrime = -Math.PI + (j / 10) * 2 * Math.PI;
          const b = -Math.PI + (k / 10) * 2 * Math.PI;
          expect(Math.abs(sOf(a, aPrime, b, b + 1.9))).toBeLessThanOrEqual(CHSH_QUANTUM_BOUND + 1e-9);
        }
      }
    }
  });
});

describe("Grover explorer", () => {
  it("matches sin²((2k+1)θ) exactly at every qubit count and iteration the controls allow", () => {
    for (let n = 2; n <= 4; n++) {
      const dimension = 2 ** n;
      const theta = Math.asin(1 / Math.sqrt(dimension));
      for (let marked = 0; marked < dimension; marked++) {
        let state = uniformSuperposition(n);
        for (let k = 0; k <= 8; k++) {
          expect(state.probabilities()[marked]).toBeCloseTo(Math.sin((2 * k + 1) * theta) ** 2, 12);
          expect(state.norm()).toBeCloseTo(1, 12);
          state = groverIteration(state, [marked]);
        }
      }
    }
  });

  it("reports the textbook optimal iteration count, and P(marked) really does fall past it", () => {
    for (let n = 2; n <= 4; n++) {
      const dimension = 2 ** n;
      const optimal = optimalGroverIterations(n, 1);
      expect(optimal).toBe(Math.floor((Math.PI / 4) * Math.sqrt(dimension)));

      let state = uniformSuperposition(n);
      const history: number[] = [];
      for (let k = 0; k <= optimal + 1; k++) {
        history.push(state.probabilities()[dimension - 1]);
        state = groverIteration(state, [dimension - 1]);
      }
      // The Predict panel's whole question: one step past the optimum, does it climb or fall?
      expect(history[optimal + 1]).toBeLessThan(history[optimal]);
      // And the optimum is genuinely the best of the run.
      expect(Math.max(...history)).toBeCloseTo(history[optimal], 12);
    }
  });
});

describe("Period finding explorer", () => {
  it("puts every peak exactly on a multiple of 2^t / r whenever that is an integer", () => {
    for (const [N, a, xBits] of [
      [15, 7, 6],
      [15, 2, 4],
      [15, 4, 5],
      [21, 8, 5],
    ] as const) {
      const r = classicalOrder(a, N);
      const dimension = 2 ** xBits;
      const spacing = dimension / r;
      expect(Number.isInteger(spacing)).toBe(true);

      const distribution = periodFindingMeasurementDistribution(a, N, xBits);
      expect(distribution.reduce((sum, p) => sum + p, 0)).toBeCloseTo(1, 9);
      const peaks = distribution.map((p, i) => [i, p] as const).filter(([, p]) => p > 1e-9);
      expect(peaks).toHaveLength(r);
      for (const [index, probability] of peaks) {
        expect(index % spacing).toBe(0);
        expect(probability).toBeCloseTo(1 / r, 9);
      }
    }
  });

  it("offers only bases genuinely coprime to N, for every N the control exposes", () => {
    const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
    for (const N of [15, 21, 35]) {
      const bases = coprimeBases(N);
      expect(bases.length).toBeGreaterThan(0);
      for (const a of bases) {
        expect(gcd(a, N)).toBe(1);
        // classicalOrder throws for a non-coprime base, so this also proves
        // the readout can never be driven into that error.
        expect(classicalOrder(a, N)).toBeGreaterThan(0);
      }
    }
  });
});

describe("QAOA explorer", () => {
  it("never reports an approximation ratio above 1, on any graph, anywhere on the two sliders", () => {
    for (const preset of QAOA_GRAPH_PRESETS) {
      const trueMax = bruteForceMaxCut(preset.n, preset.edges);
      expect(trueMax).toBe(
        preset.id === "single-edge" ? 1 : preset.id === "triangle" ? 2 : 4
      );
      for (let i = 0; i <= 20; i++) {
        for (let j = 0; j <= 20; j++) {
          const gamma = (i / 20) * 2 * Math.PI;
          const beta = (j / 20) * Math.PI;
          const state = qaoaCircuit(preset.n, preset.edges, [gamma], [beta]);
          expect(state.norm()).toBeCloseTo(1, 9);
          const expected = expectedCutSize(state, preset.edges);
          expect(expected).toBeGreaterThanOrEqual(0);
          expect(expected).toBeLessThanOrEqual(trueMax + 1e-9);
        }
      }
    }
  });

  it("agrees with the Predict panel's verdict on which graphs p=1 can solve exactly", () => {
    // A dense independent sweep, not the explorer's own coarse-then-refine
    // search: the 4-cycle really does plateau at 3 of 4.
    const bestOf = (preset: (typeof QAOA_GRAPH_PRESETS)[number]) => {
      let best = 0;
      for (let i = 0; i <= 120; i++) {
        for (let j = 0; j <= 120; j++) {
          const cut = expectedCutSize(
            qaoaCircuit(preset.n, preset.edges, [(i / 120) * 2 * Math.PI], [(j / 120) * Math.PI]),
            preset.edges
          );
          if (cut > best) best = cut;
        }
      }
      return best;
    };
    const byId = Object.fromEntries(QAOA_GRAPH_PRESETS.map((p) => [p.id, p]));
    expect(bestOf(byId["single-edge"])).toBeCloseTo(1, 6);
    expect(bestOf(byId["triangle"])).toBeGreaterThan(2 - 1e-3);
    expect(bestOf(byId["square"])).toBeCloseTo(3, 6);
    expect(bestOf(byId["square"])).toBeLessThan(4 * 0.995);
  });
});

describe("Rabi explorer", () => {
  /**
   * H = [[0, V], [V, Δ]] has exact solution
   * P(1) = 4V²/(Δ²+4V²) · sin²(√(Δ²+4V²) t / 2),
   * which is both the ceiling the narration quotes and the Ω_eff the readout
   * prints. The RK4 trajectory is checked against that, not against itself.
   */
  it("matches the exact two-level solution at both ends of both sliders", () => {
    for (const driveStrength of [0.2, 1, 3]) {
      for (const detuning of [-4, -1.3, 0, 2.5, 4]) {
        const omegaEff = Math.sqrt(detuning * detuning + 4 * driveStrength * driveStrength);
        const ceiling = (4 * driveStrength * driveStrength) / (detuning * detuning + 4 * driveStrength * driveStrength);
        const tMax = (3 * 2 * Math.PI) / omegaEff;
        const trajectory = exactTwoLevelTrajectory(0, detuning, driveStrength, tMax, 240);

        for (const point of trajectory) {
          const p1 = point.c[1].magnitudeSquared();
          const p0 = point.c[0].magnitudeSquared();
          expect(p0 + p1).toBeCloseTo(1, 6);
          expect(p1).toBeCloseTo(ceiling * Math.sin((omegaEff * point.t) / 2) ** 2, 5);
          expect(p1).toBeLessThanOrEqual(ceiling + 1e-5);
        }

        // The instrument opens on sample 40, which it claims is peak transfer
        // whatever V and Δ are; the window is exactly three Ω_eff cycles, so
        // sample 40 is a half cycle in.
        expect(trajectory[40].c[1].magnitudeSquared()).toBeCloseTo(ceiling, 5);
      }
    }
  });

  it("puts a full flip on resonance and never a full flip off it", () => {
    const onResonance = exactTwoLevelTrajectory(0, 0, 1, (3 * 2 * Math.PI) / 2, 240);
    expect(Math.max(...onResonance.map((p) => p.c[1].magnitudeSquared()))).toBeCloseTo(1, 5);

    const detuned = exactTwoLevelTrajectory(0, 2, 1, (3 * 2 * Math.PI) / Math.sqrt(8), 240);
    expect(Math.max(...detuned.map((p) => p.c[1].magnitudeSquared()))).toBeCloseTo(0.5, 5);
  });
});

describe("Density matrix explorer", () => {
  it("gives every preset the purity, entropy and Bloch length its narration claims", () => {
    const expected: Record<string, { purity: number; entropy: number; radius: number }> = {
      "pure-0": { purity: 1, entropy: 0, radius: 1 },
      "pure-plus": { purity: 1, entropy: 0, radius: 1 },
      "mix-0-1": { purity: 0.5, entropy: 1, radius: 0 },
      "mix-plus-minus": { purity: 0.5, entropy: 1, radius: 0 },
      "bell-partner": { purity: 0.5, entropy: 1, radius: 0 },
      "mostly-0": { purity: 0.82, entropy: 0.4689955935892812, radius: 0.8 },
    };
    for (const preset of MIXTURE_PRESETS) {
      const rho = convexCombination([
        { probability: preset.weight, density: pureStateDensityMatrix(blochStateFromAngles(preset.component1)) },
        { probability: 1 - preset.weight, density: pureStateDensityMatrix(blochStateFromAngles(preset.component2)) },
      ]);
      const vector = densityMatrixToBlochVector(rho);
      const target = expected[preset.id];
      expect(purity(rho), `${preset.id} purity`).toBeCloseTo(target.purity, 9);
      expect(vonNeumannEntropy(rho), `${preset.id} entropy`).toBeCloseTo(target.entropy, 9);
      expect(Math.hypot(vector.x, vector.y, vector.z), `${preset.id} |r|`).toBeCloseTo(target.radius, 9);
    }
  });

  it("puts two different recipes for I/2 at the same point, which is the panel's whole claim", () => {
    const zeroOne = MIXTURE_PRESETS.find((p) => p.id === "mix-0-1")!;
    const plusMinus = MIXTURE_PRESETS.find((p) => p.id === "mix-plus-minus")!;
    const build = (preset: typeof zeroOne) =>
      convexCombination([
        { probability: preset.weight, density: pureStateDensityMatrix(blochStateFromAngles(preset.component1)) },
        { probability: 1 - preset.weight, density: pureStateDensityMatrix(blochStateFromAngles(preset.component2)) },
      ]);
    expect(build(zeroOne).equals(build(plusMinus), 1e-12)).toBe(true);
  });
});

describe("Noise explorer", () => {
  /**
   * The Predict panel grades a reader on where the vector settles, and it
   * reads the answer off the preset's own starting angle rather than off the
   * 40-step trajectory (at the low end of the strength slider 40 steps is
   * nowhere near convergence). So the thing to check is the actual fixed
   * point of each channel, run far past what the instrument shows.
   */
  const settle = (angles: (typeof STATE_PRESETS)[number]["angles"], kraus: ReturnType<typeof dephasingChannel>) => {
    let rho = pureStateDensityMatrix(blochStateFromAngles(angles));
    for (let step = 0; step < 4000; step++) rho = applyKrausChannel(rho, kraus);
    return densityMatrixToBlochVector(rho);
  };

  it("sends every starting state to |0> under amplitude damping, pure again at the north pole", () => {
    for (const preset of STATE_PRESETS) {
      const vector = settle(preset.angles, amplitudeDampingChannel(0.15));
      expect(vector.x, `${preset.ket} x`).toBeCloseTo(0, 6);
      expect(vector.y, `${preset.ket} y`).toBeCloseTo(0, 6);
      expect(vector.z, `${preset.ket} z`).toBeCloseTo(1, 6);
    }
  });

  it("kills x and y and leaves z exactly where it started under dephasing", () => {
    for (const preset of STATE_PRESETS) {
      const start = densityMatrixToBlochVector(pureStateDensityMatrix(blochStateFromAngles(preset.angles)));
      const vector = settle(preset.angles, dephasingChannel(0.15));
      expect(vector.x, `${preset.ket} x`).toBeCloseTo(0, 9);
      expect(vector.y, `${preset.ket} y`).toBeCloseTo(0, 9);
      expect(vector.z, `${preset.ket} z`).toBeCloseTo(start.z, 12);
      // Which is the centre exactly for the four equator presets, and not for
      // the two poles: the distinction the Predict panel's options turn on.
      const startsOnEquator = Math.abs(Math.cos(preset.angles.theta)) < 1e-9;
      expect(Math.hypot(vector.x, vector.y, vector.z) < 1e-9, `${preset.ket} reaches the centre`).toBe(startsOnEquator);
    }
  });

  it("leaves the population split untouched under dephasing, which is the T2-versus-T1 distinction the control claims", () => {
    for (const preset of STATE_PRESETS) {
      const rho0 = pureStateDensityMatrix(blochStateFromAngles(preset.angles));
      let rho = rho0;
      for (let step = 0; step < 40; step++) rho = applyKrausChannel(rho, dephasingChannel(0.3));
      expect(rho.get(0, 0).re, `${preset.ket} P(0)`).toBeCloseTo(rho0.get(0, 0).re, 12);
      expect(rho.get(1, 1).re, `${preset.ket} P(1)`).toBeCloseTo(rho0.get(1, 1).re, 12);
    }
  });

  it("decays coherence by exactly (1 - lambda) per application, the law the T2 wiring depends on", () => {
    const lambda = 0.15;
    let rho = pureStateDensityMatrix(blochStateFromAngles({ theta: Math.PI / 2, phi: 0 }));
    for (let step = 1; step <= 20; step++) {
      rho = applyKrausChannel(rho, dephasingChannel(lambda));
      expect(rho.get(0, 1).magnitude()).toBeCloseTo(0.5 * (1 - lambda) ** step, 12);
    }
  });
});

describe("Two-qubit explorer", () => {
  it("gives each half of a Bell pair purity 0.5 and each half of a product state purity 1", () => {
    const bellPurities = [reducedDensityMatrixQubit0, reducedDensityMatrixQubit1].map((reduce) =>
      purity(reduce(pureStateDensityMatrix(bellPhiPlus())))
    );
    for (const value of bellPurities) expect(value).toBeCloseTo(0.5, 12);

    const plusPlus = new StateVector([0.5, 0.5, 0.5, 0.5].map((v) => new Complex(v)));
    const productPurities = [reducedDensityMatrixQubit0, reducedDensityMatrixQubit1].map((reduce) =>
      purity(reduce(pureStateDensityMatrix(plusPlus)))
    );
    for (const value of productPurities) expect(value).toBeCloseTo(1, 12);
  });

  it("makes measuring one half of a Bell pair fix the other, with the outcomes always agreeing", () => {
    for (const draw of [0.1, 0.9]) {
      const result = measureQubit(bellPhiPlus(), 0, draw);
      expect(result.probability).toBeCloseTo(0.5, 12);
      const probabilities = result.collapsed.probabilities();
      const pQubit1IsOne = probabilities.reduce((sum, p, index) => ((index & 1) === 1 ? sum + p : sum), 0);
      // Certain, and equal to qubit 0's outcome: the instrument's whole claim.
      expect(pQubit1IsOne).toBeCloseTo(result.outcome, 12);
    }
  });
});

describe("Bloch sphere explorer", () => {
  it("places every state preset where its ket says it is", () => {
    const expected: Record<string, [number, number, number]> = {
      "0": [0, 0, 1],
      "1": [0, 0, -1],
      "+": [1, 0, 0],
      "-": [-1, 0, 0],
      "+i": [0, 1, 0],
      "-i": [0, -1, 0],
    };
    for (const preset of STATE_PRESETS) {
      const rho = pureStateDensityMatrix(blochStateFromAngles(preset.angles));
      const vector = densityMatrixToBlochVector(rho);
      const [x, y, z] = expected[preset.id];
      expect(vector.x, `${preset.ket} x`).toBeCloseTo(x, 9);
      expect(vector.y, `${preset.ket} y`).toBeCloseTo(y, 9);
      expect(vector.z, `${preset.ket} z`).toBeCloseTo(z, 9);
    }
  });
});

describe("Syndrome explorer", () => {
  const ALPHA = new Complex(0.6);
  const BETA = new Complex(0.8);
  /** The deterministic ancilla draws the instrument itself passes in. */
  const DRAWS: [number, number] = [0.5, 0.5];

  it("names the flipped qubit for every single-qubit error, in both codes, and restores the logical state", () => {
    for (const mode of ["bit-flip", "phase-flip"] as const) {
      const encode = mode === "bit-flip" ? encodeBitFlipCode : encodePhaseFlipCode;
      const applyErrors = mode === "bit-flip" ? applyBitFlipErrors : applyPhaseFlipErrors;
      const runCycle = mode === "bit-flip" ? runBitFlipCorrectionCycle : runPhaseFlipCorrectionCycle;
      const clean = encode(ALPHA, BETA);

      // The parity-check table the decoder claims: q0 -> (1,0), q1 -> (1,1), q2 -> (0,1).
      const expectedSyndrome: Record<number, [0 | 1, 0 | 1]> = { 0: [1, 0], 1: [1, 1], 2: [0, 1] };
      for (const qubit of [0, 1, 2]) {
        const result = runCycle(applyErrors(clean, [qubit]), DRAWS);
        expect(result.syndrome, `${mode} q${qubit}`).toEqual(expectedSyndrome[qubit]);
        expect(result.correctedQubit).toBe(qubit);
        // Recovered exactly, up to the global phase a code cycle may introduce.
        const overlap = clean.innerProduct(result.corrected).magnitude();
        expect(overlap, `${mode} q${qubit} recovery`).toBeCloseTo(1, 9);
      }

      // No error at all: silent syndrome, untouched state.
      const undisturbed = runCycle(clean, DRAWS);
      expect(undisturbed.syndrome).toEqual([0, 0]);
      expect(undisturbed.correctedQubit).toBeNull();
      expect(clean.innerProduct(undisturbed.corrected).magnitude()).toBeCloseTo(1, 9);
    }
  });

  it("really does turn a weight-2 error into a logical flip, which is what the panel says happens", () => {
    const clean = encodeBitFlipCode(ALPHA, BETA);
    const flipped = encodeBitFlipCode(BETA, ALPHA); // the logically flipped codeword
    const result = runBitFlipCorrectionCycle(applyBitFlipErrors(clean, [0, 1]), DRAWS);
    expect(result.correctedQubit).toBe(2);
    expect(clean.innerProduct(result.corrected).magnitude()).toBeLessThan(0.99);
    expect(flipped.innerProduct(result.corrected).magnitude()).toBeCloseTo(1, 9);
  });

  it("leaves a weight-3 error completely invisible to the syndrome", () => {
    const clean = encodeBitFlipCode(ALPHA, BETA);
    const flipped = encodeBitFlipCode(BETA, ALPHA);
    const result = runBitFlipCorrectionCycle(applyBitFlipErrors(clean, [0, 1, 2]), DRAWS);
    expect(result.syndrome).toEqual([0, 0]);
    expect(result.correctedQubit).toBeNull();
    expect(flipped.innerProduct(result.corrected).magnitude()).toBeCloseTo(1, 9);
  });
});
