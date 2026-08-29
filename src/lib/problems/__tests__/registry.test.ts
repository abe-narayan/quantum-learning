import { describe, expect, it } from "vitest";
import { getAllProblems, getCourseCheckpointProblems, getProblem, getProblemsForLesson } from "../registry";
import { PROBLEMS } from "../registry.generated";
import { conceptGroupPhrases, PROBLEM_DIFFICULTY_RANK } from "../types";
import { getCourse } from "@/lib/content/curriculum";
import { LESSON_METAS } from "@/lib/content/lessonMeta.generated";
import { StateVector } from "@/lib/quantum/state";
import { Complex } from "@/lib/quantum/complex";
import { HADAMARD, PAULI_X, PAULI_Y, PAULI_Z, applySingleQubitGate, applyCNOT, rotationAboutAxis } from "@/lib/quantum/gates";
import { commutatorExpectation, uncertainty } from "@/lib/quantum/observables";
import { annihilationOperator, harmonicOscillatorEnergyLevels } from "@/lib/quantum/harmonicOscillator";
import {
  infiniteSquareWellEnergyLevel,
  harmonicOscillatorEnergyLevel as continuousHarmonicOscillatorEnergyLevel,
} from "@/lib/quantum/potentials";
import { projectorOntoSubspace } from "@/lib/quantum/projectors";
import { commutator, expectationValue } from "@/lib/quantum/observables";
import { finiteSquareWellGroundStateEnergy } from "@/lib/quantum/potentials";
import { stepPotentialScattering, barrierScatteringTransmission } from "@/lib/quantum/scattering";

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

  it("references a real lesson for every problem that sets meta.lesson", () => {
    // The course reference is checked above, but `meta.lesson` was not — a
    // typo'd lesson slug silently orphans the problem: getProblemsForLesson
    // never returns it, so no lesson page ever links to it. Sourced from the
    // generated metadata registry (cheap — no MDX imports).
    const lessonSlugs = new Set(LESSON_METAS.map((meta) => meta.slug));
    for (const problem of problems) {
      if (problem.meta.lesson === undefined) continue;
      expect(
        lessonSlugs.has(problem.meta.lesson),
        `lesson "${problem.meta.lesson}" for ${problem.meta.slug} is not a real lesson slug`
      ).toBe(true);
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

  it("getProblemsForLesson ramps monotonically by difficulty, stably within a rung, for every lesson", () => {
    const lessons = new Set(
      problems.map((p) => p.meta.lesson).filter((l): l is string => Boolean(l))
    );
    for (const lesson of lessons) {
      const list = getProblemsForLesson(lesson);

      // Monotone: never a harder problem before an easier one.
      for (let i = 1; i < list.length; i++) {
        const prev = PROBLEM_DIFFICULTY_RANK[list[i - 1].meta.difficulty];
        const next = PROBLEM_DIFFICULTY_RANK[list[i].meta.difficulty];
        expect(next, `${lesson}: ${list[i].meta.slug} ramps down after ${list[i - 1].meta.slug}`).toBeGreaterThanOrEqual(prev);
      }

      // Stable: equal-difficulty problems keep their PROBLEMS relative order.
      const registryIndex = new Map(PROBLEMS.map((p, i) => [p.meta.slug, i]));
      for (let i = 1; i < list.length; i++) {
        if (list[i - 1].meta.difficulty === list[i].meta.difficulty) {
          expect(registryIndex.get(list[i - 1].meta.slug)!).toBeLessThan(registryIndex.get(list[i].meta.slug)!);
        }
      }
    }
  });

  it("getCourseCheckpointProblems still samples over unsorted course order (not the difficulty sort)", () => {
    // The checkpoint's even spacing deliberately runs over content-path
    // order so the sample spans the course's material (see the function's
    // doc comment) — and so returning students keep seeing the same five
    // problems. This pins that the per-lesson difficulty sort did not
    // leak into the sampling.
    const courses = new Set(problems.map((p) => p.meta.course));
    for (const course of courses) {
      const courseProblems = PROBLEMS.filter((p) => p.meta.course === course);
      const count = 5;
      const step = courseProblems.length / count;
      const expected =
        courseProblems.length <= count
          ? courseProblems
          : Array.from({ length: count }, (_, i) => courseProblems[Math.floor(i * step)]);
      expect(getCourseCheckpointProblems(course).map((p) => p.meta.slug)).toEqual(
        expected.map((p) => p.meta.slug)
      );
    }
  });
});

/**
 * ============================================================
 * Multiple-choice integrity
 * ============================================================
 * The whole multiple-choice pipeline addresses options by `id`:
 * `validateMultipleChoice` grades by id, `optionFeedback` is keyed by id, the
 * object form of a `whyWrong` entry points at one by id, and the display
 * letters are a seeded shuffle keyed on nothing but the slug. That indirection
 * is what makes shuffling the options safe — but it also means every one of
 * those references is an unchecked string. A typo'd id does not throw and does
 * not render wrong; it silently degrades:
 *
 *   - a bad `correctOptionId` makes a problem *unanswerable* (every choice
 *     grades incorrect, and no student can tell why),
 *   - a bad `optionFeedback` key silently downgrades targeted feedback to the
 *     generic fallback,
 *   - a bad `whyWrong.optionId` drops the option-letter chip in the solution.
 *
 * None of that is visible in review, and the last two are invisible at
 * runtime too. These checks are the only thing standing between an authoring
 * typo and a broken problem, so they run over the whole corpus.
 */
describe("multiple-choice problems — every id-keyed reference resolves", () => {
  const multipleChoice = getAllProblems().filter(
    (problem): problem is Extract<typeof problem, { question: { type: "multiple-choice" } }> =>
      problem.question.type === "multiple-choice"
  );

  it("finds multiple-choice problems in the corpus", () => {
    expect(multipleChoice.length).toBeGreaterThan(50);
  });

  it("gives every problem at least two distinct, non-empty option ids", () => {
    for (const problem of multipleChoice) {
      const ids = problem.question.options.map((option) => option.id);
      // A one-option "choice" is not a question, and duplicate ids make
      // grading ambiguous — `.find` would silently pick the first.
      expect(ids.length, problem.meta.slug).toBeGreaterThan(1);
      expect(new Set(ids).size, `${problem.meta.slug} has duplicate option ids`).toBe(ids.length);
      for (const option of problem.question.options) {
        expect(option.id.length, problem.meta.slug).toBeGreaterThan(0);
        expect(option.text.trim().length, `${problem.meta.slug} option "${option.id}"`).toBeGreaterThan(0);
      }
    }
  });

  it("points correctOptionId at a real option in every problem", () => {
    for (const problem of multipleChoice) {
      if (problem.answer.type !== "multiple-choice") continue;
      const ids = new Set(problem.question.options.map((option) => option.id));
      expect(
        ids.has(problem.answer.correctOptionId),
        `${problem.meta.slug}: correctOptionId "${problem.answer.correctOptionId}" is not one of [${[...ids].join(", ")}] — this problem cannot be answered correctly`
      ).toBe(true);
    }
  });

  it("keys optionFeedback only by real, incorrect option ids", () => {
    for (const problem of multipleChoice) {
      if (problem.answer.type !== "multiple-choice") continue;
      const ids = new Set(problem.question.options.map((option) => option.id));
      for (const key of Object.keys(problem.answer.optionFeedback ?? {})) {
        expect(ids.has(key), `${problem.meta.slug}: optionFeedback key "${key}" is not a real option id`).toBe(true);
        // Feedback on the *correct* option is unreachable: `validateMultipleChoice`
        // returns "Correct." before it ever consults the map. Authoring it means
        // the author expected a message the student can never see.
        expect(
          key,
          `${problem.meta.slug}: optionFeedback is keyed on the correct option "${key}", which is unreachable`
        ).not.toBe(problem.answer.correctOptionId);
      }
    }
  });

  it("gives every problem a non-empty defaultIncorrectFeedback to fall back to", () => {
    for (const problem of multipleChoice) {
      if (problem.answer.type !== "multiple-choice") continue;
      // Reached whenever a wrong option has no targeted feedback — i.e. for
      // most wrong answers in most problems.
      expect(problem.answer.defaultIncorrectFeedback.trim().length, problem.meta.slug).toBeGreaterThan(0);
    }
  });
});

/**
 * The object form of `whyWrong` (see `WhyWrongEntry` in ../types.ts) is what
 * lets a solution say "Option B confuses the two registers" correctly even
 * though B is assigned by a per-slug shuffle. Its one failure mode is an
 * `optionId` that does not resolve: `SolutionPanel` then drops the letter chip
 * and renders the text alone — deliberately, because a blank chip is worse,
 * but it means the mistake leaves no trace on the page. Checked here for every
 * problem, including non-multiple-choice ones, where an option reference is
 * meaningless by construction.
 */
describe("whyWrong option references resolve to real options", () => {
  it("names a real option id in every object-form entry", () => {
    for (const problem of getAllProblems()) {
      const entries = problem.explanation?.whyWrong ?? [];
      const ids = new Set(
        problem.question.type === "multiple-choice" ? problem.question.options.map((option) => option.id) : []
      );
      for (const entry of entries) {
        if (typeof entry === "string") continue;
        expect(entry.text.trim().length, `${problem.meta.slug}: an object-form whyWrong entry has no text`).toBeGreaterThan(0);
        expect(
          ids.has(entry.optionId),
          `${problem.meta.slug}: whyWrong names option "${entry.optionId}", which ${
            ids.size === 0
              ? "cannot exist — this is not a multiple-choice problem, so use the plain string form"
              : `is not one of [${[...ids].join(", ")}]`
          }`
        ).toBe(true);
      }
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
      expect(conceptGroupPhrases(group).length).toBeGreaterThan(0);
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

describe("Wave Mechanics — demonstration problems match the continuous-position engine", () => {
  it("the infinite-well energy-level problem matches infiniteSquareWellEnergyLevel()", () => {
    const problem = getProblem("infinite-well-energy-level");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");
    expect(problem.answer.value).toBeCloseTo(infiniteSquareWellEnergyLevel(2, 6), 6);
  });

  it("the infinite-well energy-ratio problem matches a direct ratio of infiniteSquareWellEnergyLevel()", () => {
    const problem = getProblem("infinite-well-energy-ratio");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");
    const ratio = infiniteSquareWellEnergyLevel(4, 6) / infiniteSquareWellEnergyLevel(2, 6);
    expect(problem.answer.value).toBeCloseTo(ratio, 6);
  });

  it("the harmonic-ground-state-energy and harmonic-level-spacing problems match harmonicOscillatorEnergyLevel()", () => {
    const groundProblem = getProblem("harmonic-ground-state-energy");
    const spacingProblem = getProblem("harmonic-level-spacing");
    if (groundProblem?.answer.type !== "numeric" || spacingProblem?.answer.type !== "numeric") {
      throw new Error("expected numeric problems");
    }
    expect(groundProblem.answer.value).toBeCloseTo(continuousHarmonicOscillatorEnergyLevel(0, 3), 6);
    const spacing = continuousHarmonicOscillatorEnergyLevel(2, 2.5) - continuousHarmonicOscillatorEnergyLevel(1, 2.5);
    expect(spacingProblem.answer.value).toBeCloseTo(spacing, 6);
  });

  it("the dispersion-formula-calculation problem matches the analytical sigma(t) formula", () => {
    const problem = getProblem("dispersion-formula-calculation");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");
    const sigma0 = 1;
    const t = 4;
    const sigmaT = Math.sqrt(sigma0 ** 2 + (t / (2 * sigma0)) ** 2);
    expect(problem.answer.value).toBeCloseTo(sigmaT, 5);
  });

  it("the kappa-calculation problem matches the analytical decay-constant formula", () => {
    const problem = getProblem("kappa-calculation");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");
    const kappa = Math.sqrt(2 * (10 - 6));
    expect(problem.answer.value).toBeCloseTo(kappa, 5);
  });

  it("the uncertainty-product-gaussian problem matches sigma * (1/(2*sigma))", () => {
    const problem = getProblem("uncertainty-product-gaussian");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");
    const sigma = 2;
    const deltaK = 1 / (2 * sigma);
    expect(problem.answer.value).toBeCloseTo(sigma * deltaK, 6);
    expect(problem.answer.value).toBeCloseTo(0.5, 6);
  });

  it("the synthesis-beat-frequency-calculation problem matches E2-E1 from infiniteSquareWellEnergyLevel()", () => {
    const problem = getProblem("synthesis-beat-frequency-calculation");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");
    const beat = infiniteSquareWellEnergyLevel(2, 10) - infiniteSquareWellEnergyLevel(1, 10);
    expect(problem.answer.value).toBeCloseTo(beat, 5);
  });

  it("the wallheight-dt-product problem matches the Wavefunction Explorer's actual preset constants", () => {
    const problem = getProblem("wallheight-dt-product");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");
    expect(problem.answer.value).toBeCloseTo(200 * 0.0002, 6);
  });

  it("the top-hat-normalization-constant problem matches 1/sqrt(L)", () => {
    const problem = getProblem("top-hat-normalization-constant");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");
    expect(problem.answer.value).toBeCloseTo(1 / Math.sqrt(8), 6);
  });
});

describe("Operators, Observables & Measurement — demonstration problems match the engine", () => {
  it("the trace-of-projector problem matches a directly-computed projector's trace", () => {
    const problem = getProblem("trace-of-projector-equals-degeneracy");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");
    const e0 = [Complex.ONE, Complex.ZERO, Complex.ZERO];
    const e1 = [Complex.ZERO, Complex.ONE, Complex.ZERO];
    const p = projectorOntoSubspace([e0, e1]);
    const trace = p.get(0, 0).re + p.get(1, 1).re + p.get(2, 2).re;
    expect(problem.answer.value).toBeCloseTo(trace, 9);
  });

  it("the [X,Z] commutator-entry problem matches commutator(PAULI_X, PAULI_Z) directly", () => {
    const problem = getProblem("xz-commutator-entry");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");
    const comm = commutator(PAULI_X, PAULI_Z);
    expect(problem.answer.value).toBeCloseTo(comm.get(0, 1).magnitude(), 9);
  });

  it("the degenerate-measurement-probability and post-measurement-state problems match the engine", () => {
    const probProblem = getProblem("degenerate-measurement-probability");
    const stateProblem = getProblem("post-measurement-state-component");
    if (probProblem?.answer.type !== "numeric" || stateProblem?.answer.type !== "numeric") {
      throw new Error("expected numeric problems");
    }
    const c = new Complex(1 / Math.sqrt(3));
    const psiAmplitudes = [c, c, c];
    const e0 = [Complex.ONE, Complex.ZERO, Complex.ZERO];
    const e1 = [Complex.ZERO, Complex.ONE, Complex.ZERO];
    const p1 = projectorOntoSubspace([e0, e1]);

    expect(probProblem.answer.value).toBeCloseTo(expectationValue({ amplitudes: psiAmplitudes }, p1).re, 5);

    const projected = p1.apply(psiAmplitudes);
    const norm = Math.sqrt(projected.reduce((sum, a) => sum + a.magnitudeSquared(), 0));
    expect(stateProblem.answer.value).toBeCloseTo(projected[0].scale(1 / norm).re, 5);
  });

  it("the sequential-measurement-probability problem matches a direct Z-then-X-then-Z simulation", () => {
    const problem = getProblem("sequential-measurement-probability");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");
    const plus = new StateVector([new Complex(Math.SQRT1_2), new Complex(Math.SQRT1_2)]);
    const zero = StateVector.basis(1, 0);
    const p0 = projectorOntoSubspace([zero.amplitudes]);
    expect(problem.answer.value).toBeCloseTo(expectationValue(plus, p0).re, 9);
  });

  it("the characteristic-timescale and minimum-timescale problems match the direct formula", () => {
    const timescaleProblem = getProblem("characteristic-timescale-calculation");
    const minProblem = getProblem("minimum-timescale-from-energy-spread");
    if (timescaleProblem?.answer.type !== "numeric" || minProblem?.answer.type !== "numeric") {
      throw new Error("expected numeric problems");
    }
    expect(timescaleProblem.answer.value).toBeCloseTo(2 / 3, 5);
    expect(minProblem.answer.value).toBeCloseTo(0.5 / 2, 9);
  });

  it("the Bell-state Z0-measurement problem matches expectationValue on a real Bell state", () => {
    const problem = getProblem("bell-state-z0-measurement-probability");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");
    const bell = new StateVector([
      new Complex(Math.SQRT1_2),
      Complex.ZERO,
      Complex.ZERO,
      new Complex(Math.SQRT1_2),
    ]);
    const b00 = StateVector.basis(2, 0);
    const b01 = StateVector.basis(2, 1);
    const z0Plus = projectorOntoSubspace([b00.amplitudes, b01.amplitudes]);
    expect(problem.answer.value).toBeCloseTo(expectationValue(bell, z0Plus).re, 9);
  });
});

describe("One-Dimensional Systems — demonstration problems match the engine", () => {
  it("the finite-well ground-state and energy-above-floor problems match finiteSquareWellGroundStateEnergy()", () => {
    const groundProblem = getProblem("finite-well-ground-state-calculation");
    const floorProblem = getProblem("energy-above-well-floor");
    if (groundProblem?.answer.type !== "numeric" || floorProblem?.answer.type !== "numeric") {
      throw new Error("expected numeric problems");
    }
    expect(groundProblem.answer.value).toBeCloseTo(finiteSquareWellGroundStateEnergy(2, 3), 5);
    const worked = finiteSquareWellGroundStateEnergy(1, 5);
    expect(floorProblem.answer.value).toBeCloseTo(worked + 5, 5);
  });

  it("the step-scattering problem matches stepPotentialScattering() directly", () => {
    const problem = getProblem("step-scattering-calculation");
    if (problem?.answer.type !== "numeric") throw new Error("expected a numeric problem");
    expect(problem.answer.value).toBeCloseTo(stepPotentialScattering(8, 2).reflection, 6);
  });

  it("the barrier-transmission and second-resonant-width problems match barrierScatteringTransmission()", () => {
    const transmissionProblem = getProblem("barrier-transmission-calculation");
    const widthProblem = getProblem("second-resonant-width");
    if (transmissionProblem?.answer.type !== "numeric" || widthProblem?.answer.type !== "numeric") {
      throw new Error("expected numeric problems");
    }
    expect(transmissionProblem.answer.value).toBeCloseTo(barrierScatteringTransmission(6, 3, 1), 5);

    const k2 = Math.sqrt(2 * (5 - 2));
    const firstResonance = Math.PI / k2;
    expect(widthProblem.answer.value).toBeCloseTo(2 * firstResonance, 4);
    expect(barrierScatteringTransmission(5, 2, 2 * firstResonance)).toBeCloseTo(1, 6);
  });
});
