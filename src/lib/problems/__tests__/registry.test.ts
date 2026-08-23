import { describe, expect, it } from "vitest";
import { getAllProblems, getProblem, getProblemsForLesson } from "../registry";
import { getCourse } from "@/lib/content/curriculum";
import { StateVector } from "@/lib/quantum/state";
import { Complex } from "@/lib/quantum/complex";
import { HADAMARD, PAULI_X, PAULI_Y, PAULI_Z, applySingleQubitGate, applyCNOT, rotationAboutAxis } from "@/lib/quantum/gates";
import { commutatorExpectation, uncertainty } from "@/lib/quantum/observables";
import { annihilationOperator, harmonicOscillatorEnergyLevels } from "@/lib/quantum/harmonicOscillator";

describe("problem registry integrity", () => {
  const problems = getAllProblems();

  it("is non-empty", () => {
    expect(problems.length).toBeGreaterThan(0);
  });

  it("has a unique slug for every problem", () => {
    const slugs = problems.map((p) => p.meta.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("keeps meta.problemType, question.type, and answer.type in lockstep for every problem", () => {
    // This invariant is what lets validators/index.ts dispatch safely with
    // a single narrow cast instead of re-validating shape at runtime.
    for (const problem of problems) {
      expect(problem.question.type).toBe(problem.meta.problemType);
      expect(problem.answer.type).toBe(problem.meta.problemType);
    }
  });

  it("references a real course for every problem", () => {
    for (const problem of problems) {
      expect(getCourse(problem.meta.course), `course "${problem.meta.course}" for ${problem.meta.slug}`).toBeDefined();
    }
  });

  it("has at least one hint and a non-empty solution for every problem", () => {
    for (const problem of problems) {
      expect(problem.hints.length, problem.meta.slug).toBeGreaterThan(0);
      expect(problem.solution.steps.length, problem.meta.slug).toBeGreaterThan(0);
      expect(problem.solution.finalAnswer.length, problem.meta.slug).toBeGreaterThan(0);
    }
  });

  it("getProblem finds a known problem by slug and returns undefined for an unknown one", () => {
    expect(getProblem("plus-state-measurement-probability")).toBeDefined();
    expect(getProblem("does-not-exist")).toBeUndefined();
  });

  it("getProblemsForLesson returns only problems attached to that lesson", () => {
    const lesson = "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement";
    const attached = getProblemsForLesson(lesson);
    expect(attached.length).toBeGreaterThan(0);
    for (const problem of attached) {
      expect(problem.meta.lesson).toBe(lesson);
    }
  });
});

describe("demonstration problems — expected answers match the real quantum engine", () => {
  it("P(measuring |1⟩) for |+⟩ is exactly what the engine computes", () => {
    const problem = getProblem("plus-state-measurement-probability");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");

    const plusState = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
    expect(problem.answer.value).toBeCloseTo(plusState.probabilities()[1], 9);
    expect(problem.answer.value).toBeCloseTo(0.5, 2);
  });

  it("P(measuring |11⟩) in the Bell state is exactly what the engine computes", () => {
    const problem = getProblem("bell-state-outcome-probability");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");

    const bellState = applyCNOT(applySingleQubitGate(StateVector.zero(2), HADAMARD, 0), 0, 1);
    expect(problem.answer.value).toBeCloseTo(bellState.probabilities()[3], 9);
    expect(problem.answer.value).toBeCloseTo(0.5, 2);
  });

  it("|0⟩⊗|1⟩'s correct option is the engine-computed basis label |01⟩", () => {
    const problem = getProblem("tensor-product-basis-label");
    if (problem?.answer.type !== "multiple-choice") throw new Error("expected a multiple-choice problem");

    const combined = StateVector.zero(1).tensor(StateVector.basis(1, 1));
    const expectedIndex = combined.probabilities().findIndex((p) => p > 0.5);
    expect(problem.answer.correctOptionId).toBe(combined.basisLabel(expectedIndex));
    expect(problem.answer.correctOptionId).toBe("01");
  });

  it("the H-then-CNOT problem's correct option text names both Bell-state terms", () => {
    const problem = getProblem("h-then-cnot-result");
    if (problem?.answer.type !== "multiple-choice" || problem.question.type !== "multiple-choice") {
      throw new Error("expected a multiple-choice problem");
    }

    // Destructured into `const`s so the narrowing above survives inside the
    // `.find` callback below — TypeScript doesn't preserve property
    // narrowing (as opposed to local `const` narrowing) across closures.
    const { answer, question } = problem;
    const correctOption = question.options.find((option) => option.id === answer.correctOptionId);
    expect(correctOption?.text).toContain("00");
    expect(correctOption?.text).toContain("11");
  });

  it("the Bell-state-separability conceptual answer accepts the lesson's own proof phrasing", () => {
    const problem = getProblem("bell-state-separability");
    if (problem?.answer.type !== "conceptual") throw new Error("expected a conceptual problem");

    for (const group of problem.answer.requiredConceptGroups) {
      expect(group.length).toBeGreaterThan(0);
    }
  });
});

describe("From Classical to Quantum — demonstration problems match the engine", () => {
  it("the Rabi-probability problem's answer matches rotationAboutAxis directly", () => {
    const problem = getProblem("rabi-probability-at-time");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");

    const plus = [new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)];
    const omegaT = Math.PI / 3;
    const evolved = rotationAboutAxis({ x: 0, y: 0, z: 1 }, omegaT).apply(plus);
    // P(+) = |<+|psi(t)>|^2
    const overlap = evolved.reduce(
      (sum, amplitude) => sum.add(new Complex(Math.SQRT1_2).conjugate().mul(amplitude)),
      Complex.ZERO
    );
    expect(problem.answer.value).toBeCloseTo(overlap.magnitudeSquared(), 6);
    expect(problem.answer.value).toBeCloseTo(0.75, 6);
  });

  it("the Y-uncertainty-in-|+> problem's answer matches the engine's uncertainty() function", () => {
    const problem = getProblem("uncertainty-of-y-in-plus-state");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");

    const plus = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
    expect(problem.answer.value).toBeCloseTo(uncertainty(plus, PAULI_Y), 9);
  });

  it("the Y,Z uncertainty-bound problem's answer matches the engine's commutatorExpectation()", () => {
    const problem = getProblem("uncertainty-bound-yz");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");

    const plus = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
    const bound = 0.5 * commutatorExpectation(plus, PAULI_Y, PAULI_Z).magnitude();
    expect(problem.answer.value).toBeCloseTo(bound, 9);
  });

  it("the harmonic-oscillator energy-level problem matches harmonicOscillatorEnergyLevels()", () => {
    const problem = getProblem("harmonic-oscillator-energy-level");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");

    const levels = harmonicOscillatorEnergyLevels(4, 3);
    expect(problem.answer.value).toBeCloseTo(levels[3], 9);
  });

  it("the ladder-lowering-coefficient problem matches annihilationOperator()", () => {
    const problem = getProblem("ladder-lowering-coefficient");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");

    const dimension = 5;
    const a = annihilationOperator(dimension);
    const basisFour = Array.from({ length: dimension }, (_, i) => (i === 4 ? new Complex(1) : Complex.ZERO));
    const result = a.apply(basisFour);
    expect(problem.answer.value).toBeCloseTo(result[3].magnitude(), 9);
  });

  it("the three-qubit dimension problem matches an actual tensor product", () => {
    const problem = getProblem("three-qubit-dimension-synthesis");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");

    const oneQubit = StateVector.zero(1);
    const threeQubits = oneQubit.tensor(oneQubit).tensor(oneQubit);
    expect(problem.answer.value).toBe(threeQubits.dimension);
  });

  it("the postulate probability/expectation-value problems are internally consistent", () => {
    const probProblem = getProblem("postulate-probability-calculation");
    const expProblem = getProblem("postulate-expectation-value");
    if (probProblem?.answer.type !== "numeric" || expProblem?.answer.type !== "numeric") {
      throw new Error("expected numeric problems");
    }

    const pPlus = Math.cos(Math.PI / 3) ** 2;
    const pMinus = 1 - pPlus;
    expect(probProblem.answer.value).toBeCloseTo(pPlus, 9);
    expect(expProblem.answer.value).toBeCloseTo(pPlus - pMinus, 9);
  });

  it("the interference-vs-classical problems match direct Complex arithmetic", () => {
    const quantumProblem = getProblem("quantum-interference-calculation");
    const classicalProblem = getProblem("classical-sum-comparison");
    if (quantumProblem?.answer.type !== "numeric" || classicalProblem?.answer.type !== "numeric") {
      throw new Error("expected numeric problems");
    }

    const psi1 = new Complex(0.3);
    const psi2 = Complex.fromPolar(0.3, (2 * Math.PI) / 3);
    expect(quantumProblem.answer.value).toBeCloseTo(psi1.add(psi2).magnitudeSquared(), 6);
    expect(classicalProblem.answer.value).toBeCloseTo(psi1.magnitudeSquared() + psi2.magnitudeSquared(), 9);
  });

  it("Pauli operators referenced across these problems are Hermitian, matching what the lessons claim", () => {
    for (const pauli of [PAULI_X, PAULI_Y, PAULI_Z]) {
      expect(pauli.equals(pauli.dagger(), 1e-9)).toBe(true);
    }
  });
});
