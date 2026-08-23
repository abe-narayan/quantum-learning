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
import { topHatNormalizationConstant } from "@/content/problems/quantum-mechanics/wave-mechanics/top-hat-normalization-constant";
import { amplitudeDensityVsProbability } from "@/content/problems/quantum-mechanics/wave-mechanics/amplitude-density-vs-probability";
import { probabilityInSubregion } from "@/content/problems/quantum-mechanics/wave-mechanics/probability-in-subregion";
import { whyNormIsPreserved } from "@/content/problems/quantum-mechanics/wave-mechanics/why-norm-is-preserved";
import { meanPositionTophat } from "@/content/problems/quantum-mechanics/wave-mechanics/mean-position-tophat";
import { varianceTophat } from "@/content/problems/quantum-mechanics/wave-mechanics/variance-tophat";
import { momentumEigenvalueCalculation } from "@/content/problems/quantum-mechanics/wave-mechanics/momentum-eigenvalue-calculation";
import { whyPHatNeedsI } from "@/content/problems/quantum-mechanics/wave-mechanics/why-p-hat-needs-i";
import { commutatorAntisymmetryPositionMomentum } from "@/content/problems/quantum-mechanics/wave-mechanics/commutator-antisymmetry-position-momentum";
import { uncertaintyProductGaussian } from "@/content/problems/quantum-mechanics/wave-mechanics/uncertainty-product-gaussian";
import { momentumWidthFromPositionWidth } from "@/content/problems/quantum-mechanics/wave-mechanics/momentum-width-from-position-width";
import { stationaryPhaseCalculation } from "@/content/problems/quantum-mechanics/wave-mechanics/stationary-phase-calculation";
import { kineticTermForm } from "@/content/problems/quantum-mechanics/wave-mechanics/kinetic-term-form";
import { groupVelocityCalculation } from "@/content/problems/quantum-mechanics/wave-mechanics/group-velocity-calculation";
import { whyPlaneWaveNotNormalizable } from "@/content/problems/quantum-mechanics/wave-mechanics/why-plane-wave-not-normalizable";
import { infiniteWellEnergyLevel } from "@/content/problems/quantum-mechanics/wave-mechanics/infinite-well-energy-level";
import { infiniteWellEnergyRatio } from "@/content/problems/quantum-mechanics/wave-mechanics/infinite-well-energy-ratio";
import { infiniteWellNodeCount } from "@/content/problems/quantum-mechanics/wave-mechanics/infinite-well-node-count";
import { harmonicGroundStateEnergy } from "@/content/problems/quantum-mechanics/wave-mechanics/harmonic-ground-state-energy";
import { harmonicLevelSpacing } from "@/content/problems/quantum-mechanics/wave-mechanics/harmonic-level-spacing";
import { ehrenfestSecondTheorem } from "@/content/problems/quantum-mechanics/wave-mechanics/ehrenfest-second-theorem";
import { dispersionFormulaCalculation } from "@/content/problems/quantum-mechanics/wave-mechanics/dispersion-formula-calculation";
import { kappaCalculation } from "@/content/problems/quantum-mechanics/wave-mechanics/kappa-calculation";
import { transmissionQualitative } from "@/content/problems/quantum-mechanics/wave-mechanics/transmission-qualitative";
import { trotterErrorOrder } from "@/content/problems/quantum-mechanics/wave-mechanics/trotter-error-order";
import { whySymmetricSplitBetter } from "@/content/problems/quantum-mechanics/wave-mechanics/why-symmetric-split-better";
import { wallheightDtProduct } from "@/content/problems/quantum-mechanics/wave-mechanics/wallheight-dt-product";
import { synthesisStationaryDensityConstant } from "@/content/problems/quantum-mechanics/wave-mechanics/synthesis-stationary-density-constant";
import { synthesisBeatFrequencyCalculation } from "@/content/problems/quantum-mechanics/wave-mechanics/synthesis-beat-frequency-calculation";
import { synthesisContinuumVsFiniteMapping } from "@/content/problems/quantum-mechanics/wave-mechanics/synthesis-continuum-vs-finite-mapping";
import { traceOfProjectorEqualsDegeneracy } from "@/content/problems/quantum-mechanics/operators-observables-measurement/trace-of-projector-equals-degeneracy";
import { whyGroupDegenerateEigenvectors } from "@/content/problems/quantum-mechanics/operators-observables-measurement/why-group-degenerate-eigenvectors";
import { xzCommutatorEntry } from "@/content/problems/quantum-mechanics/operators-observables-measurement/xz-commutator-entry";
import { sharedEigenbasisImpliesCommuteRecap } from "@/content/problems/quantum-mechanics/operators-observables-measurement/shared-eigenbasis-implies-commute-recap";
import { whichPairCommutes } from "@/content/problems/quantum-mechanics/operators-observables-measurement/which-pair-commutes";
import { distinctJointEigenvaluePairs } from "@/content/problems/quantum-mechanics/operators-observables-measurement/distinct-joint-eigenvalue-pairs";
import { whyOneObservableMayNotSuffice } from "@/content/problems/quantum-mechanics/operators-observables-measurement/why-one-observable-may-not-suffice";
import { degenerateMeasurementProbability } from "@/content/problems/quantum-mechanics/operators-observables-measurement/degenerate-measurement-probability";
import { postMeasurementStateComponent } from "@/content/problems/quantum-mechanics/operators-observables-measurement/post-measurement-state-component";
import { whyCollapseUsesWholeProjector } from "@/content/problems/quantum-mechanics/operators-observables-measurement/why-collapse-uses-whole-projector";
import { sequentialMeasurementProbability } from "@/content/problems/quantum-mechanics/operators-observables-measurement/sequential-measurement-probability";
import { whyOutcomeIndependentDisturbance } from "@/content/problems/quantum-mechanics/operators-observables-measurement/why-outcome-independent-disturbance";
import { characteristicTimescaleCalculation } from "@/content/problems/quantum-mechanics/operators-observables-measurement/characteristic-timescale-calculation";
import { minimumTimescaleFromEnergySpread } from "@/content/problems/quantum-mechanics/operators-observables-measurement/minimum-timescale-from-energy-spread";
import { stationaryStateInfiniteTimescale } from "@/content/problems/quantum-mechanics/operators-observables-measurement/stationary-state-infinite-timescale";
import { bellStateZ0MeasurementProbability } from "@/content/problems/quantum-mechanics/operators-observables-measurement/bell-state-z0-measurement-probability";
import { whyDifferentFactorObservablesCommute } from "@/content/problems/quantum-mechanics/operators-observables-measurement/why-different-factor-observables-commute";
import { synthesisRepeatedMeasurementCertainty } from "@/content/problems/quantum-mechanics/operators-observables-measurement/synthesis-repeated-measurement-certainty";
import { synthesisWhatCompleteMeans } from "@/content/problems/quantum-mechanics/operators-observables-measurement/synthesis-what-complete-means";
import { synthesisNotAStrictGeneralization } from "@/content/problems/quantum-mechanics/operators-observables-measurement/synthesis-not-a-strict-generalization";
import { synthesisZeroEnergyUncertaintyConsequence } from "@/content/problems/quantum-mechanics/operators-observables-measurement/synthesis-zero-energy-uncertainty-consequence";
import { tangentBranchDivergencePoint } from "@/content/problems/quantum-mechanics/one-dimensional-systems/tangent-branch-divergence-point";
import { whyNoClosedFormFiniteWell } from "@/content/problems/quantum-mechanics/one-dimensional-systems/why-no-closed-form-finite-well";
import { finiteWellGroundStateCalculation } from "@/content/problems/quantum-mechanics/one-dimensional-systems/finite-well-ground-state-calculation";
import { energyAboveWellFloor } from "@/content/problems/quantum-mechanics/one-dimensional-systems/energy-above-well-floor";
import { whyFiniteWellAlwaysBinds } from "@/content/problems/quantum-mechanics/one-dimensional-systems/why-finite-well-always-binds";
import { stepScatteringCalculation } from "@/content/problems/quantum-mechanics/one-dimensional-systems/step-scattering-calculation";
import { whyReflectionAlwaysPositive } from "@/content/problems/quantum-mechanics/one-dimensional-systems/why-reflection-always-positive";
import { whatIsActuallyBounded } from "@/content/problems/quantum-mechanics/one-dimensional-systems/what-is-actually-bounded";
import { barrierTransmissionCalculation } from "@/content/problems/quantum-mechanics/one-dimensional-systems/barrier-transmission-calculation";
import { secondResonantWidth } from "@/content/problems/quantum-mechanics/one-dimensional-systems/second-resonant-width";
import { whyResonanceDependsOnK2L } from "@/content/problems/quantum-mechanics/one-dimensional-systems/why-resonance-depends-on-k2l";
import { synthesisBoundVsContinuousSpectrum } from "@/content/problems/quantum-mechanics/one-dimensional-systems/synthesis-bound-vs-continuous-spectrum";
import { synthesisWellDepthAndBoundStateCount } from "@/content/problems/quantum-mechanics/one-dimensional-systems/synthesis-well-depth-and-bound-state-count";
import { synthesisTunnelingVsResonanceRegimes } from "@/content/problems/quantum-mechanics/one-dimensional-systems/synthesis-tunneling-vs-resonance-regimes";
import { minusStateXExpectationViaRho } from "@/content/problems/quantum-computing/entanglement-and-measurement/minus-state-x-expectation-via-rho";
import { oneStateDensityMatrixChoice } from "@/content/problems/quantum-computing/entanglement-and-measurement/one-state-density-matrix-choice";
import { whyRhoIsHermitian } from "@/content/problems/quantum-computing/entanglement-and-measurement/why-rho-is-hermitian";
import { biasedMixturePurity } from "@/content/problems/quantum-computing/entanglement-and-measurement/biased-mixture-purity";
import { plusMinusMixtureIdentity } from "@/content/problems/quantum-computing/entanglement-and-measurement/plus-minus-mixture-identity";
import { superpositionVsMixture } from "@/content/problems/quantum-computing/entanglement-and-measurement/superposition-vs-mixture";
import { threeComponentMixtureEntry } from "@/content/problems/quantum-computing/entanglement-and-measurement/three-component-mixture-entry";
import { indistinguishableEnsembles } from "@/content/problems/quantum-computing/entanglement-and-measurement/indistinguishable-ensembles";
import { zeroOneProductReducedState } from "@/content/problems/quantum-computing/entanglement-and-measurement/zero-one-product-reduced-state";
import { definingRequirementXCheck } from "@/content/problems/quantum-computing/entanglement-and-measurement/defining-requirement-x-check";
import { whyTraceOutEverythingIsMeaningless } from "@/content/problems/quantum-computing/entanglement-and-measurement/why-trace-out-everything-is-meaningless";
import { psiMinusPurityViaIdentity } from "@/content/problems/quantum-computing/entanglement-and-measurement/psi-minus-purity-via-identity";
import { whyProofNeedsTwoQubits } from "@/content/problems/quantum-computing/entanglement-and-measurement/why-proof-needs-two-qubits";
import { entropyOfSixtyFortyMixture } from "@/content/problems/quantum-computing/entanglement-and-measurement/entropy-of-sixty-forty-mixture";
import { nearPureEntropyCalculation } from "@/content/problems/quantum-computing/entanglement-and-measurement/near-pure-entropy-calculation";
import { whyOneBitIsTheMaximum } from "@/content/problems/quantum-computing/entanglement-and-measurement/why-one-bit-is-the-maximum";
import { weaklyEntangledStateEntropy } from "@/content/problems/quantum-computing/entanglement-and-measurement/weakly-entangled-state-entropy";
import { diagnosingTheI4Counterexample } from "@/content/problems/quantum-computing/entanglement-and-measurement/diagnosing-the-i4-counterexample";
import { psiMinusConcurrence } from "@/content/problems/quantum-computing/entanglement-and-measurement/psi-minus-concurrence";
import { purityFromConcurrence } from "@/content/problems/quantum-computing/entanglement-and-measurement/purity-from-concurrence";
import { maxConcurrenceImpliesMaximallyMixed } from "@/content/problems/quantum-computing/entanglement-and-measurement/max-concurrence-implies-maximally-mixed";
import { xGateOnBiasedMixture } from "@/content/problems/quantum-computing/entanglement-and-measurement/x-gate-on-biased-mixture";
import { measuringP1OnBiasedMixture } from "@/content/problems/quantum-computing/entanglement-and-measurement/measuring-p1-on-biased-mixture";
import { maximallyMixedInvarianceProof } from "@/content/problems/quantum-computing/entanglement-and-measurement/maximally-mixed-invariance-proof";
import { deterministicLhvChshValue } from "@/content/problems/quantum-computing/entanglement-and-measurement/deterministic-lhv-chsh-value";
import { localityAssumptionNonlocalHv } from "@/content/problems/quantum-computing/entanglement-and-measurement/locality-assumption-nonlocal-hv";
import { sameSettingsChshValue } from "@/content/problems/quantum-computing/entanglement-and-measurement/same-settings-chsh-value";
import { sameAxisPerfectCorrelation } from "@/content/problems/quantum-computing/entanglement-and-measurement/same-axis-perfect-correlation";
import { whatAChshViolationRulesOut } from "@/content/problems/quantum-computing/entanglement-and-measurement/what-a-chsh-violation-rules-out";
import { phaseInvarianceOfEntanglementMeasures } from "@/content/problems/quantum-computing/entanglement-and-measurement/phase-invariance-of-entanglement-measures";
import { whyConcurrenceNeedsStatevector } from "@/content/problems/quantum-computing/entanglement-and-measurement/why-concurrence-needs-statevector";
import { purityBetweenTwoKnownValues } from "@/content/problems/quantum-computing/entanglement-and-measurement/purity-between-two-known-values";

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
  topHatNormalizationConstant,
  amplitudeDensityVsProbability,
  probabilityInSubregion,
  whyNormIsPreserved,
  meanPositionTophat,
  varianceTophat,
  momentumEigenvalueCalculation,
  whyPHatNeedsI,
  commutatorAntisymmetryPositionMomentum,
  uncertaintyProductGaussian,
  momentumWidthFromPositionWidth,
  stationaryPhaseCalculation,
  kineticTermForm,
  groupVelocityCalculation,
  whyPlaneWaveNotNormalizable,
  infiniteWellEnergyLevel,
  infiniteWellEnergyRatio,
  infiniteWellNodeCount,
  harmonicGroundStateEnergy,
  harmonicLevelSpacing,
  ehrenfestSecondTheorem,
  dispersionFormulaCalculation,
  kappaCalculation,
  transmissionQualitative,
  trotterErrorOrder,
  whySymmetricSplitBetter,
  wallheightDtProduct,
  synthesisStationaryDensityConstant,
  synthesisBeatFrequencyCalculation,
  synthesisContinuumVsFiniteMapping,
  traceOfProjectorEqualsDegeneracy,
  whyGroupDegenerateEigenvectors,
  xzCommutatorEntry,
  sharedEigenbasisImpliesCommuteRecap,
  whichPairCommutes,
  distinctJointEigenvaluePairs,
  whyOneObservableMayNotSuffice,
  degenerateMeasurementProbability,
  postMeasurementStateComponent,
  whyCollapseUsesWholeProjector,
  sequentialMeasurementProbability,
  whyOutcomeIndependentDisturbance,
  characteristicTimescaleCalculation,
  minimumTimescaleFromEnergySpread,
  stationaryStateInfiniteTimescale,
  bellStateZ0MeasurementProbability,
  whyDifferentFactorObservablesCommute,
  synthesisRepeatedMeasurementCertainty,
  synthesisWhatCompleteMeans,
  synthesisNotAStrictGeneralization,
  synthesisZeroEnergyUncertaintyConsequence,
  tangentBranchDivergencePoint,
  whyNoClosedFormFiniteWell,
  finiteWellGroundStateCalculation,
  energyAboveWellFloor,
  whyFiniteWellAlwaysBinds,
  stepScatteringCalculation,
  whyReflectionAlwaysPositive,
  whatIsActuallyBounded,
  barrierTransmissionCalculation,
  secondResonantWidth,
  whyResonanceDependsOnK2L,
  synthesisBoundVsContinuousSpectrum,
  synthesisWellDepthAndBoundStateCount,
  synthesisTunnelingVsResonanceRegimes,
  minusStateXExpectationViaRho,
  oneStateDensityMatrixChoice,
  whyRhoIsHermitian,
  biasedMixturePurity,
  plusMinusMixtureIdentity,
  superpositionVsMixture,
  threeComponentMixtureEntry,
  indistinguishableEnsembles,
  zeroOneProductReducedState,
  definingRequirementXCheck,
  whyTraceOutEverythingIsMeaningless,
  psiMinusPurityViaIdentity,
  whyProofNeedsTwoQubits,
  entropyOfSixtyFortyMixture,
  nearPureEntropyCalculation,
  whyOneBitIsTheMaximum,
  weaklyEntangledStateEntropy,
  diagnosingTheI4Counterexample,
  psiMinusConcurrence,
  purityFromConcurrence,
  maxConcurrenceImpliesMaximallyMixed,
  xGateOnBiasedMixture,
  measuringP1OnBiasedMixture,
  maximallyMixedInvarianceProof,
  deterministicLhvChshValue,
  localityAssumptionNonlocalHv,
  sameSettingsChshValue,
  sameAxisPerfectCorrelation,
  whatAChshViolationRulesOut,
  phaseInvarianceOfEntanglementMeasures,
  whyConcurrenceNeedsStatevector,
  purityBetweenTwoKnownValues,
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
