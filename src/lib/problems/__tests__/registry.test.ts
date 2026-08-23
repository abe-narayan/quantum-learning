import { describe, expect, it } from "vitest";
import { getAllProblems, getProblem, getProblemsForLesson } from "../registry";
import { getCourse } from "@/lib/content/curriculum";
import { StateVector } from "@/lib/quantum/state";
import { Complex } from "@/lib/quantum/complex";
import { HADAMARD, applySingleQubitGate, applyCNOT } from "@/lib/quantum/gates";

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
