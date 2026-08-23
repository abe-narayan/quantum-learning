import type { Problem, ProblemMeta, Quiz } from "./types";
import { plusStateMeasurementProbability } from "@/content/problems/quantum-computing/qubits-and-quantum-states/plus-state-measurement-probability";
import { tensorProductBasisLabel } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/tensor-product-basis-label";
import { bellStateSeparability } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/bell-state-separability";
import { bellStateOutcomeProbability } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/bell-state-outcome-probability";
import { hThenCnotResult } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/h-then-cnot-result";
import { complexModulus } from "@/content/problems/quantum-mechanics/mathematical-foundations/complex-modulus";
import { eulersIdentity } from "@/content/problems/quantum-mechanics/mathematical-foundations/eulers-identity";
import { linearIndependenceCheck } from "@/content/problems/quantum-mechanics/mathematical-foundations/linear-independence-check";
import { realDimensionOfComplexSpace } from "@/content/problems/quantum-mechanics/mathematical-foundations/real-dimension-of-complex-space";
import { plusMinusOrthogonality } from "@/content/problems/quantum-mechanics/mathematical-foundations/plus-minus-orthogonality";
import { cauchySchwarzCheck } from "@/content/problems/quantum-mechanics/mathematical-foundations/cauchy-schwarz-check";
import { outerProductType } from "@/content/problems/quantum-mechanics/mathematical-foundations/outer-product-type";
import { completenessRelationSandwich } from "@/content/problems/quantum-mechanics/mathematical-foundations/completeness-relation-sandwich";
import { matrixProductEntry } from "@/content/problems/quantum-mechanics/mathematical-foundations/matrix-product-entry";
import { nonInvertibleMatrix } from "@/content/problems/quantum-mechanics/mathematical-foundations/non-invertible-matrix";
import { pauliXEigenvalueSum } from "@/content/problems/quantum-mechanics/mathematical-foundations/pauli-x-eigenvalue-sum";
import { pauliZEigenvalueProduct } from "@/content/problems/quantum-mechanics/mathematical-foundations/pauli-z-eigenvalue-product";
import { identifyHermitianMatrix } from "@/content/problems/quantum-mechanics/mathematical-foundations/identify-hermitian-matrix";
import { expectationValueCalculation } from "@/content/problems/quantum-mechanics/mathematical-foundations/expectation-value-calculation";
import { unitaryDefiningProperty } from "@/content/problems/quantum-mechanics/mathematical-foundations/unitary-defining-property";
import { unitaryEigenvalueModulus } from "@/content/problems/quantum-mechanics/mathematical-foundations/unitary-eigenvalue-modulus";
import { compositeSystemDimension } from "@/content/problems/quantum-mechanics/mathematical-foundations/composite-system-dimension";
import { whyEntanglementIsGeneric } from "@/content/problems/quantum-mechanics/mathematical-foundations/why-entanglement-is-generic";
import { bornRuleProbability } from "@/content/problems/quantum-mechanics/mathematical-foundations/born-rule-probability";
import { expectationValueFromProbabilities } from "@/content/problems/quantum-mechanics/mathematical-foundations/expectation-value-from-probabilities";
import { globalPhaseInvariance } from "@/content/problems/quantum-mechanics/mathematical-foundations/global-phase-invariance";
import { synthesisEigenvalueFromTraceDet } from "@/content/problems/quantum-mechanics/mathematical-foundations/synthesis-eigenvalue-from-trace-det";
import { synthesisHermitianAndUnitary } from "@/content/problems/quantum-mechanics/mathematical-foundations/synthesis-hermitian-and-unitary";
import { synthesisMeasurementPostulates } from "@/content/problems/quantum-mechanics/mathematical-foundations/synthesis-measurement-postulates";
import { classicalOscillatorEnergy } from "@/content/problems/quantum-mechanics/classical-to-quantum/classical-oscillator-energy";
import { epistemicVsQuantumProbability } from "@/content/problems/quantum-mechanics/classical-to-quantum/epistemic-vs-quantum-probability";
import { quantumInterferenceCalculation } from "@/content/problems/quantum-mechanics/classical-to-quantum/quantum-interference-calculation";
import { classicalSumComparison } from "@/content/problems/quantum-mechanics/classical-to-quantum/classical-sum-comparison";
import { phaseForEqualPredictions } from "@/content/problems/quantum-mechanics/classical-to-quantum/phase-for-equal-predictions";
import { whatPhaseProvides } from "@/content/problems/quantum-mechanics/classical-to-quantum/what-phase-provides";
import { postulateProbabilityCalculation } from "@/content/problems/quantum-mechanics/classical-to-quantum/postulate-probability-calculation";
import { postulateExpectationValue } from "@/content/problems/quantum-mechanics/classical-to-quantum/postulate-expectation-value";
import { observableOperatorType } from "@/content/problems/quantum-mechanics/classical-to-quantum/observable-operator-type";
import { uncertaintyOfYInPlusState } from "@/content/problems/quantum-mechanics/classical-to-quantum/uncertainty-of-y-in-plus-state";
import { uncertaintyBoundYZ } from "@/content/problems/quantum-mechanics/classical-to-quantum/uncertainty-bound-yz";
import { commutingObservablesNoTradeoff } from "@/content/problems/quantum-mechanics/classical-to-quantum/commuting-observables-no-tradeoff";
import { rabiProbabilityAtTime } from "@/content/problems/quantum-mechanics/classical-to-quantum/rabi-probability-at-time";
import { generatorMustBeHermitian } from "@/content/problems/quantum-mechanics/classical-to-quantum/generator-must-be-hermitian";
import { stationaryProbabilityCheck } from "@/content/problems/quantum-mechanics/classical-to-quantum/stationary-probability-check";
import { whyEnergyIsConserved } from "@/content/problems/quantum-mechanics/classical-to-quantum/why-energy-is-conserved";
import { ladderLoweringCoefficient } from "@/content/problems/quantum-mechanics/classical-to-quantum/ladder-lowering-coefficient";
import { harmonicOscillatorEnergyLevel } from "@/content/problems/quantum-mechanics/classical-to-quantum/harmonic-oscillator-energy-level";
import { zeroPointEnergy } from "@/content/problems/quantum-mechanics/classical-to-quantum/zero-point-energy";
import { minimumMomentumUncertainty } from "@/content/problems/quantum-mechanics/classical-to-quantum/minimum-momentum-uncertainty";
import { commutatorAntisymmetry } from "@/content/problems/quantum-mechanics/classical-to-quantum/commutator-antisymmetry";
import { crossBasisProbability } from "@/content/problems/quantum-mechanics/classical-to-quantum/cross-basis-probability";
import { fullyDestructiveCrossBasis } from "@/content/problems/quantum-mechanics/classical-to-quantum/fully-destructive-cross-basis";
import { basisDependenceOfInterference } from "@/content/problems/quantum-mechanics/classical-to-quantum/basis-dependence-of-interference";
import { whyGatesAreUnitary } from "@/content/problems/quantum-mechanics/classical-to-quantum/why-gates-are-unitary";
import { threeQubitDimensionSynthesis } from "@/content/problems/quantum-mechanics/classical-to-quantum/three-qubit-dimension-synthesis";
import { qubitAsInstanceOfPostulates } from "@/content/problems/quantum-mechanics/classical-to-quantum/qubit-as-instance-of-postulates";

/**
 * Problems are plain, statically-imported TypeScript objects rather than
 * MDX files scanned off disk (contrast `lib/content/lessons.ts`). See
 * docs/ARCHITECTURE.md §10 for the reasoning — in short, a problem is a
 * structured record (metadata + typed question/answer/hints/solution), not
 * prose-heavy long-form content, so a plain array of typed imports gives
 * full compile-time checking of every problem's shape with no MDX
 * compilation step. Adding a problem is: write the file, add one import
 * and one array entry here — the same amount of ceremony `curriculum.ts`
 * already asks of adding a course.
 */
export const PROBLEMS: Problem[] = [
  plusStateMeasurementProbability,
  tensorProductBasisLabel,
  bellStateSeparability,
  bellStateOutcomeProbability,
  hThenCnotResult,
  complexModulus,
  eulersIdentity,
  linearIndependenceCheck,
  realDimensionOfComplexSpace,
  plusMinusOrthogonality,
  cauchySchwarzCheck,
  outerProductType,
  completenessRelationSandwich,
  matrixProductEntry,
  nonInvertibleMatrix,
  pauliXEigenvalueSum,
  pauliZEigenvalueProduct,
  identifyHermitianMatrix,
  expectationValueCalculation,
  unitaryDefiningProperty,
  unitaryEigenvalueModulus,
  compositeSystemDimension,
  whyEntanglementIsGeneric,
  bornRuleProbability,
  expectationValueFromProbabilities,
  globalPhaseInvariance,
  synthesisEigenvalueFromTraceDet,
  synthesisHermitianAndUnitary,
  synthesisMeasurementPostulates,
  classicalOscillatorEnergy,
  epistemicVsQuantumProbability,
  quantumInterferenceCalculation,
  classicalSumComparison,
  phaseForEqualPredictions,
  whatPhaseProvides,
  postulateProbabilityCalculation,
  postulateExpectationValue,
  observableOperatorType,
  uncertaintyOfYInPlusState,
  uncertaintyBoundYZ,
  commutingObservablesNoTradeoff,
  rabiProbabilityAtTime,
  generatorMustBeHermitian,
  stationaryProbabilityCheck,
  whyEnergyIsConserved,
  ladderLoweringCoefficient,
  harmonicOscillatorEnergyLevel,
  zeroPointEnergy,
  minimumMomentumUncertainty,
  commutatorAntisymmetry,
  crossBasisProbability,
  fullyDestructiveCrossBasis,
  basisDependenceOfInterference,
  whyGatesAreUnitary,
  threeQubitDimensionSynthesis,
  qubitAsInstanceOfPostulates,
];

export function getAllProblems(): Problem[] {
  return PROBLEMS;
}

export function getAllProblemMeta(): ProblemMeta[] {
  return PROBLEMS.map((problem) => problem.meta);
}

export function getProblem(slug: string): Problem | undefined {
  return PROBLEMS.find((problem) => problem.meta.slug === slug);
}

export function getProblemsForLesson(lessonSlug: string): Problem[] {
  return PROBLEMS.filter((problem) => problem.meta.lesson === lessonSlug);
}

export function getProblemsForCourse(courseSlug: string): Problem[] {
  return PROBLEMS.filter((problem) => problem.meta.course === courseSlug);
}

/**
 * No quizzes are authored yet — this phase establishes the `Quiz` type and
 * its lookup functions (architecture) without building the quiz-taking UI.
 * See docs/ARCHITECTURE.md §10.
 */
export const QUIZZES: Quiz[] = [];

export function getAllQuizzes(): Quiz[] {
  return QUIZZES;
}

export function getQuiz(slug: string): Quiz | undefined {
  return QUIZZES.find((quiz) => quiz.slug === slug);
}
