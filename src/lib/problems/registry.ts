import type { Problem, ProblemMeta, Quiz } from "./types";
import { plusStateMeasurementProbability } from "@/content/problems/quantum-computing/qubits-and-quantum-states/plus-state-measurement-probability";
import { tensorProductBasisLabel } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/tensor-product-basis-label";
import { bellStateSeparability } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/bell-state-separability";
import { bellStateOutcomeProbability } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/bell-state-outcome-probability";
import { hThenCnotResult } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/h-then-cnot-result";
import { biasedQubitP1 } from "@/content/problems/quantum-computing/qubits-and-quantum-states/biased-qubit-p1";
import { superpositionVsClassicalUncertainty } from "@/content/problems/quantum-computing/qubits-and-quantum-states/superposition-vs-classical-uncertainty";
import { modulusOf3Minus4i } from "@/content/problems/quantum-computing/qubits-and-quantum-states/modulus-of-3-minus-4i";
import { phaseOf1PlusI } from "@/content/problems/quantum-computing/qubits-and-quantum-states/phase-of-1-plus-i";
import { phaseOfProductOfTwoPhases } from "@/content/problems/quantum-computing/qubits-and-quantum-states/phase-of-product-of-two-phases";
import { zeroPlusInnerProduct } from "@/content/problems/quantum-computing/qubits-and-quantum-states/zero-plus-inner-product";
import { conjugateSymmetryOfInnerProduct } from "@/content/problems/quantum-computing/qubits-and-quantum-states/conjugate-symmetry-of-inner-product";
import { whyOrthonormalityLetsTermsCancel } from "@/content/problems/quantum-computing/qubits-and-quantum-states/why-orthonormality-lets-terms-cancel";
import { constructiveInterferenceAmplitudeSum } from "@/content/problems/quantum-computing/qubits-and-quantum-states/constructive-interference-amplitude-sum";
import { whichStateFailsNormalization } from "@/content/problems/quantum-computing/qubits-and-quantum-states/which-state-fails-normalization";
import { amplitudesVsProbabilitiesMixture } from "@/content/problems/quantum-computing/qubits-and-quantum-states/amplitudes-vs-probabilities-mixture";
import { blochXCoordinateCalculation } from "@/content/problems/quantum-computing/qubits-and-quantum-states/bloch-x-coordinate-calculation";
import { blochPoint100State } from "@/content/problems/quantum-computing/qubits-and-quantum-states/bloch-point-1-0-0-state";
import { equatorStatesSameThetaDifferentPhi } from "@/content/problems/quantum-computing/qubits-and-quantum-states/equator-states-same-theta-different-phi";
import { pPlusForKnownAmplitudes } from "@/content/problems/quantum-computing/qubits-and-quantum-states/p-plus-for-known-amplitudes";
import { stateWithCertainPlusOutcome } from "@/content/problems/quantum-computing/qubits-and-quantum-states/state-with-certain-plus-outcome";
import { whyRepeatedMeasurementFails } from "@/content/problems/quantum-computing/qubits-and-quantum-states/why-repeated-measurement-fails";
import { zOnPlusState } from "@/content/problems/quantum-computing/qubits-and-quantum-states/z-on-plus-state";
import { blochZAfterSOnPlus } from "@/content/problems/quantum-computing/qubits-and-quantum-states/bloch-z-after-s-on-plus";
import { whyTEightReturnsExactly } from "@/content/problems/quantum-computing/qubits-and-quantum-states/why-t-eight-returns-exactly";
import { thetaPreservedUnderRz } from "@/content/problems/quantum-computing/qubits-and-quantum-states/theta-preserved-under-rz";
import { whyRxNeedsFullTurnOnOne } from "@/content/problems/quantum-computing/qubits-and-quantum-states/why-rx-needs-full-turn-on-one";
import { rzPiOnPlusState } from "@/content/problems/quantum-computing/qubits-and-quantum-states/rz-pi-on-plus-state";
import { classifyIScaledPair } from "@/content/problems/quantum-computing/qubits-and-quantum-states/classify-i-scaled-pair";
import { pPlusAtTwoThirdsPiPhase } from "@/content/problems/quantum-computing/qubits-and-quantum-states/p-plus-at-two-thirds-pi-phase";
import { singleAmplitudePhaseArgument } from "@/content/problems/quantum-computing/qubits-and-quantum-states/single-amplitude-phase-argument";
import { p0AfterHSHOnZero } from "@/content/problems/quantum-computing/qubits-and-quantum-states/p0-after-h-s-h-on-zero";
import { hxhIdentity } from "@/content/problems/quantum-computing/qubits-and-quantum-states/hxh-identity";
import { fourSGatesSandwiched } from "@/content/problems/quantum-computing/qubits-and-quantum-states/four-s-gates-sandwiched";
import { minusIPlusTensorProbability } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/minus-i-plus-tensor-probability";
import { onePlusVsPlusOneTensorOrder } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/one-plus-vs-plus-one-tensor-order";
import { hOnQ1ThenCnot10Outcome } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/h-on-q1-then-cnot-1-0-outcome";
import { correctOperatorOrderHThenX } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/correct-operator-order-h-then-x";
import { whyBlankWireIsIdentity } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/why-blank-wire-is-identity";
import { cnotReversedControlTarget } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/cnot-reversed-control-target";
import { czAmplitudeOnEleven } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/cz-amplitude-on-eleven";
import { whyCnotSquaredIsIdentity } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/why-cnot-squared-is-identity";
import { psiPlusFromZeroOneProbability } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/psi-plus-from-zero-one-probability";
import { qubit1MeasurementProbabilityAsymmetricState } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/qubit1-measurement-probability-asymmetric-state";
import { psiMinusPostMeasurementOutcomeOne } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/psi-minus-post-measurement-outcome-one";
import { cnotDoesNotCloneSuperposition } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/cnot-does-not-clone-superposition";
import { forcedCloneStateProbability } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/forced-clone-state-probability";
import { whyTestingBasisStatesIsntEnough } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/why-testing-basis-states-isnt-enough";
import { teleportationFinalPopulationMatchesMessage } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/teleportation-final-population-matches-message";
import { teleportationCorrectionFor01 } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/teleportation-correction-for-01";
import { whyAliceOutcomesAreAlwaysFair } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/why-alice-outcomes-are-always-fair";
import { phaseOnQubitZeroConcentration } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/phase-on-qubit-zero-concentration";
import { whichVariantStillGives00 } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/which-variant-still-gives-00";
import { interferenceWithoutEntanglement } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/interference-without-entanglement";
import { ghzMeasurementProbability111 } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/ghz-measurement-probability-111";
import { ghzCollapseAfterMeasuringQubitZero } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/ghz-collapse-after-measuring-qubit-zero";
import { ghzCorrelationWithoutSignaling } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/ghz-correlation-without-signaling";
import { fourQubitParameterGap } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/four-qubit-parameter-gap";
import { doesThisStateFactor } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/does-this-state-factor";
import { noInteractionMeansNoEntanglement } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/no-interaction-means-no-entanglement";
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
import { threeQubitUniformSuperposition } from "@/content/problems/quantum-computing/quantum-algorithms-i/three-qubit-uniform-superposition";
import { oracleReversibilityProof } from "@/content/problems/quantum-computing/quantum-algorithms-i/oracle-reversibility-proof";
import { oneQueryInformationLimit } from "@/content/problems/quantum-computing/quantum-algorithms-i/one-query-information-limit";
import { phaseKickbackSignForF0 } from "@/content/problems/quantum-computing/quantum-algorithms-i/phase-kickback-sign-for-f0";
import { ancillaUnchangedByKickback } from "@/content/problems/quantum-computing/quantum-algorithms-i/ancilla-unchanged-by-kickback";
import { djConstantFunctionAmplitude } from "@/content/problems/quantum-computing/quantum-algorithms-i/dj-constant-function-amplitude";
import { djBalancedParityFunction } from "@/content/problems/quantum-computing/quantum-algorithms-i/dj-balanced-parity-function";
import { whyPromiseIsNecessary } from "@/content/problems/quantum-computing/quantum-algorithms-i/why-promise-is-necessary";
import { qftOfBasisState } from "@/content/problems/quantum-computing/quantum-algorithms-i/qft-of-basis-state";
import { qftReducesToHadamard } from "@/content/problems/quantum-computing/quantum-algorithms-i/qft-reduces-to-hadamard";
import { qftOfZeroIsUniform } from "@/content/problems/quantum-computing/quantum-algorithms-i/qft-of-zero-is-uniform";
import { phaseEstimationQuarterPhase } from "@/content/problems/quantum-computing/quantum-algorithms-i/phase-estimation-quarter-phase";
import { whichPrecisionQubitControlsLargestPower } from "@/content/problems/quantum-computing/quantum-algorithms-i/which-precision-qubit-controls-largest-power";
import { whyPhaseEstimationNeedsKnownEigenstate } from "@/content/problems/quantum-computing/quantum-algorithms-i/why-phase-estimation-needs-known-eigenstate";
import { diffusionOnNonUniformState } from "@/content/problems/quantum-computing/quantum-algorithms-i/diffusion-on-non-uniform-state";
import { phaseOracleVsDiffusionRole } from "@/content/problems/quantum-computing/quantum-algorithms-i/phase-oracle-vs-diffusion-role";
import { globalPhaseBugDiagnosis } from "@/content/problems/quantum-computing/quantum-algorithms-i/global-phase-bug-diagnosis";
import { groverSuccessProbabilityClosedForm } from "@/content/problems/quantum-computing/quantum-algorithms-i/grover-success-probability-closed-form";
import { zeroIterationsBaseline } from "@/content/problems/quantum-computing/quantum-algorithms-i/zero-iterations-baseline";
import { whyMoreIterationsIsntAlwaysBetter } from "@/content/problems/quantum-computing/quantum-algorithms-i/why-more-iterations-isnt-always-better";
import { speedupFactorComparison } from "@/content/problems/quantum-computing/quantum-algorithms-i/speedup-factor-comparison";
import { provablyOptimalVsBestKnown } from "@/content/problems/quantum-computing/quantum-algorithms-i/provably-optimal-vs-best-known";
import { queryComplexityVsWallClock } from "@/content/problems/quantum-computing/quantum-algorithms-i/query-complexity-vs-wall-clock";
import { orderOf2Mod21 } from "@/content/problems/quantum-computing/quantum-algorithms-ii/order-of-2-mod-21";
import { factorsOf21ViaGcd } from "@/content/problems/quantum-computing/quantum-algorithms-ii/factors-of-21-via-gcd";
import { whyOddOrderFails } from "@/content/problems/quantum-computing/quantum-algorithms-ii/why-odd-order-fails";
import { periodFindingPeakLocations } from "@/content/problems/quantum-computing/quantum-algorithms-ii/period-finding-peak-locations";
import { whyControlledModularExpNotBuilt } from "@/content/problems/quantum-computing/quantum-algorithms-ii/why-controlled-modular-exp-not-built";
import { periodFindingTotalProbability } from "@/content/problems/quantum-computing/quantum-algorithms-ii/period-finding-total-probability";
import { gcdOf7And15 } from "@/content/problems/quantum-computing/quantum-algorithms-ii/gcd-of-7-and-15";
import { whichStepWasQuantum } from "@/content/problems/quantum-computing/quantum-algorithms-ii/which-step-was-quantum";
import { groundEnergyOfPauliX } from "@/content/problems/quantum-computing/quantum-algorithms-ii/ground-energy-of-pauli-x";
import { variationalPrincipleEqualityCase } from "@/content/problems/quantum-computing/quantum-algorithms-ii/variational-principle-equality-case";
import { ansatzExpressivityCheck } from "@/content/problems/quantum-computing/quantum-algorithms-ii/ansatz-expressivity-check";
import { vqeConvergenceAccuracy } from "@/content/problems/quantum-computing/quantum-algorithms-ii/vqe-convergence-accuracy";
import { eigenvaluesViaTraceAndDeterminant } from "@/content/problems/quantum-computing/quantum-algorithms-ii/eigenvalues-via-trace-and-determinant";
import { expectedCutFourEdges } from "@/content/problems/quantum-computing/quantum-algorithms-ii/expected-cut-four-edges";
import { costUnitaryIsPurePhase } from "@/content/problems/quantum-computing/quantum-algorithms-ii/cost-unitary-is-pure-phase";
import { qaoaApproximationRatio } from "@/content/problems/quantum-computing/quantum-algorithms-ii/qaoa-approximation-ratio";
import { pigeonholeOddCycleArgument } from "@/content/problems/quantum-computing/quantum-algorithms-ii/pigeonhole-odd-cycle-argument";
import { identifyingNisqFriendlyAlgorithms } from "@/content/problems/quantum-computing/quantum-algorithms-ii/identifying-nisq-friendly-algorithms";
import { accountingTableRecall } from "@/content/problems/quantum-computing/quantum-algorithms-ii/accounting-table-recall";
import { threeKindsOfAdvantageClaims } from "@/content/problems/quantum-computing/quantum-algorithms-ii/three-kinds-of-advantage-claims";
import { yEqualsIxzVerification } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/y-equals-ixz-verification";
import { whyMeasurementWouldCollapseSuperposition } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/why-measurement-would-collapse-superposition";
import { syndromeForQubit0Error } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/syndrome-for-qubit-0-error";
import { encodingCircuitTrace } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/encoding-circuit-trace";
import { bitFlipCodeBlindToZ } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/bit-flip-code-blind-to-z";
import { hzhEqualsXDerivation } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/hzh-equals-x-derivation";
import { phaseFlipCodeCorrectsZError } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/phase-flip-code-corrects-z-error";
import { shorCodeQubitCount } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/shor-code-qubit-count";
import { yErrorDoubleDetection } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/y-error-double-detection";
import { verifyX2Anticommutation } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/verify-x2-anticommutation";
import { phaseFlipCodeStabilizers } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/phase-flip-code-stabilizers";
import { weight2ErrorLogicalFlip } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/weight-2-error-logical-flip";
import { codeParametersShorVsBitflip } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/code-parameters-shor-vs-bitflip";
import { vertexStabilizerLocality } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/vertex-stabilizer-locality";
import { surfaceCodeDistanceScaling } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/surface-code-distance-scaling";
import { thresholdQualitativeReasoning } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/threshold-qualitative-reasoning";
import { connectingBackToShorsAlgorithm } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/connecting-back-to-shors-algorithm";
import { verifyLxLyCommutatorSign } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/verify-lx-ly-commutator-sign";
import { jxJyCommutatorJ2 } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/jx-jy-commutator-j2";
import { allowedMValuesForJThreeHalves } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/allowed-m-values-for-j-three-halves";
import { jRaisingOperatorTopState } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/j-raising-operator-top-state";
import { y00NormalizationCheck } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/y00-normalization-check";
import { whyHalfIntegerLExcluded } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/why-half-integer-l-excluded";
import { spinSquaredEigenvalue } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/spin-squared-eigenvalue";
import { whySpinHasNoPositionWavefunction } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/why-spin-has-no-position-wavefunction";
import { sequentialSgJointProbability } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/sequential-sg-joint-probability";
import { repeatedSameAxisMeasurement } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/repeated-same-axis-measurement";
import { tripletUpJzEigenvalue } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/triplet-up-jz-eigenvalue";
import { singletMatchesBellState } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/singlet-matches-bell-state";
import { groundStateAngularDependence } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/ground-state-angular-dependence";
import { lEquals2DegeneracyCount } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/l-equals-2-degeneracy-count";
import { whichPotentialsAreCentral } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/which-potentials-are-central";
import { lzL2CommutatorNumerically } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/lz-l2-commutator-numerically";
import { whyHCommutesWithLz } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/why-h-commutes-with-lz";
import { centrifugalTermForLEquals2 } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/centrifugal-term-for-l-equals-2";
import { sStatesHaveNoCentrifugalBarrier } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/s-states-have-no-centrifugal-barrier";
import { uVsRBoundaryCondition } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/u-vs-r-boundary-condition";
import { balmerAlphaTransitionEnergy } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/balmer-alpha-transition-energy";
import { nEquals2TotalDegeneracy } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/n-equals-2-total-degeneracy";
import { whyCoulombEnergyIgnoresL } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/why-coulomb-energy-ignores-l";
import { nEquals3OrbitalCount } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/n-equals-3-orbital-count";
import { psi1sNormalizationFromFactors } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/psi-1s-normalization-from-factors";
import { bohrRadiusAgreementMeaning } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/bohr-radius-agreement-meaning";
import { fineStructureTwoEffects } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/fine-structure-two-effects";
import { whatFineStructureBreaks } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/what-fine-structure-breaks";
import { anharmonicFirstOrderShift } from "@/content/problems/quantum-mechanics/approximation-methods/anharmonic-first-order-shift";
import { whyGroundStateSecondOrderIsNegative } from "@/content/problems/quantum-mechanics/approximation-methods/why-ground-state-second-order-is-negative";
import { wrongBasisForPerturbationMatrix } from "@/content/problems/quantum-mechanics/approximation-methods/wrong-basis-for-perturbation-matrix";
import { variationalEnergyNeverBelowExact } from "@/content/problems/quantum-mechanics/approximation-methods/variational-energy-never-below-exact";
import { badWidthGivesWorseBound } from "@/content/problems/quantum-mechanics/approximation-methods/bad-width-gives-worse-bound";
import { provingTheVariationalTheorem } from "@/content/problems/quantum-mechanics/approximation-methods/proving-the-variational-theorem";
import { wkbEnergyForNEquals2 } from "@/content/problems/quantum-mechanics/approximation-methods/wkb-energy-for-n-equals-2";
import { whyTheMaslovHalfMatters } from "@/content/problems/quantum-mechanics/approximation-methods/why-the-maslov-half-matters";
import { wkbExactnessIsSpecialToSho } from "@/content/problems/quantum-mechanics/approximation-methods/wkb-exactness-is-special-to-sho";
import { transitionProbabilityWeakCoupling } from "@/content/problems/quantum-mechanics/approximation-methods/transition-probability-weak-coupling";
import { strongCouplingBreakdownGap } from "@/content/problems/quantum-mechanics/approximation-methods/strong-coupling-breakdown-gap";
import { unitarityBoundsTransitionProbability } from "@/content/problems/quantum-mechanics/approximation-methods/unitarity-bounds-transition-probability";
import { productStateNotEigenstate } from "@/content/problems/quantum-mechanics/identical-particles/product-state-not-eigenstate";
import { possibleExchangeEigenvalues } from "@/content/problems/quantum-mechanics/identical-particles/possible-exchange-eigenvalues";
import { quantumVsClassicalIndistinguishability } from "@/content/problems/quantum-mechanics/identical-particles/quantum-vs-classical-indistinguishability";
import { antisymmetricEigenvalueCheck } from "@/content/problems/quantum-mechanics/identical-particles/antisymmetric-eigenvalue-check";
import { photonVsElectronStatistics } from "@/content/problems/quantum-mechanics/identical-particles/photon-vs-electron-statistics";
import { whyNormalizationDiffers } from "@/content/problems/quantum-mechanics/identical-particles/why-normalization-differs";
import { sameOrbitalOppositeSpinAllowed } from "@/content/problems/quantum-mechanics/identical-particles/same-orbital-opposite-spin-allowed";
import { bosonsVsFermionsClustering } from "@/content/problems/quantum-mechanics/identical-particles/bosons-vs-fermions-clustering";
import { zeroVectorIsExact } from "@/content/problems/quantum-mechanics/identical-particles/zero-vector-is-exact";
import { shellCapacityNEquals4 } from "@/content/problems/quantum-mechanics/identical-particles/shell-capacity-n-equals-4";
import { oxygen2pElectronCount } from "@/content/problems/quantum-mechanics/identical-particles/oxygen-2p-electron-count";
import { whyFillingOrderDeviates } from "@/content/problems/quantum-mechanics/identical-particles/why-filling-order-deviates";
import { amplitudeDampingTraceCheck } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/amplitude-damping-trace-check";
import { identifyingInvalidKrausSet } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/identifying-invalid-kraus-set";
import { unitaryAsSpecialKrausCase } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/unitary-as-special-kraus-case";
import { offDiagonalAfterThreeApplications } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/off-diagonal-after-three-applications";
import { longRunPurityLimit } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/long-run-purity-limit";
import { decoherenceVsCollapse } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/decoherence-vs-collapse";
import { euclideanPropagatorAtOrigin } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/euclidean-propagator-at-origin";
import { compositionLawRelativeError } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/composition-law-relative-error";
import { whyWickRotationHelps } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/why-wick-rotation-helps";
import { channelsReusedInHardwarePillar } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/channels-reused-in-hardware-pillar";
import { statingTheMeasurementOverclaim } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/stating-the-measurement-overclaim";
import { strongestConsistencyEvidence } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/strongest-consistency-evidence";
import { piPulseDuration25Mhz } from "@/content/problems/quantum-hardware/physical-qubit-platforms/pi-pulse-duration-25mhz";
import { whyJosephsonJunctionNeeded } from "@/content/problems/quantum-hardware/physical-qubit-platforms/why-josephson-junction-needed";
import { gateTimeVsCoherenceRatio } from "@/content/problems/quantum-hardware/physical-qubit-platforms/gate-time-vs-coherence-ratio";
import { ionGateBudgetComputation } from "@/content/problems/quantum-hardware/physical-qubit-platforms/ion-gate-budget-computation";
import { whyStaticFieldsCantTrap } from "@/content/problems/quantum-hardware/physical-qubit-platforms/why-static-fields-cant-trap";
import { sharedMotionalModeMechanism } from "@/content/problems/quantum-hardware/physical-qubit-platforms/shared-motional-mode-mechanism";
import { rydbergBlockadeMechanism } from "@/content/problems/quantum-hardware/physical-qubit-platforms/rydberg-blockade-mechanism";
import { whyOpticalTweezersWorkForNeutralAtoms } from "@/content/problems/quantum-hardware/physical-qubit-platforms/why-optical-tweezers-work-for-neutral-atoms";
import { tweezersVsGateLasers } from "@/content/problems/quantum-hardware/physical-qubit-platforms/tweezers-vs-gate-lasers";
import { lossVsDecoherence } from "@/content/problems/quantum-hardware/physical-qubit-platforms/loss-vs-decoherence";
import { photonEncodingOptions } from "@/content/problems/quantum-hardware/physical-qubit-platforms/photon-encoding-options";
import { whyPhotonPhotonGatesAreHard } from "@/content/problems/quantum-hardware/physical-qubit-platforms/why-photon-photon-gates-are-hard";
import { quantumDotParticleInBoxParallel } from "@/content/problems/quantum-hardware/physical-qubit-platforms/quantum-dot-particle-in-box-parallel";
import { spinQubitScalabilitySource } from "@/content/problems/quantum-hardware/physical-qubit-platforms/spin-qubit-scalability-source";
import { manufacturabilityIsntAutomaticallyDecisive } from "@/content/problems/quantum-hardware/physical-qubit-platforms/manufacturability-isnt-automatically-decisive";
import { hypotheticalDeviceGateBudget } from "@/content/problems/quantum-hardware/physical-qubit-platforms/hypothetical-device-gate-budget";
import { recommendPlatformForNetworking } from "@/content/problems/quantum-hardware/physical-qubit-platforms/recommend-platform-for-networking";
import { isolationVsCouplingTradeoff } from "@/content/problems/quantum-hardware/physical-qubit-platforms/isolation-vs-coupling-tradeoff";
import { occupationAt50Mk } from "@/content/problems/quantum-hardware/control-and-readout/occupation-at-50mk";
import { why4kInsufficient } from "@/content/problems/quantum-hardware/control-and-readout/why-4k-insufficient";
import { higherFrequencyLowerOccupation } from "@/content/problems/quantum-hardware/control-and-readout/higher-frequency-lower-occupation";
import { pulseDurationForPiOver2 } from "@/content/problems/quantum-hardware/control-and-readout/pulse-duration-for-pi-over-2";
import { whyP1UsesHalfAngle } from "@/content/problems/quantum-hardware/control-and-readout/why-p1-uses-half-angle";
import { durationVsAmplitudeControl } from "@/content/problems/quantum-hardware/control-and-readout/duration-vs-amplitude-control";
import { expectedReadoutErrors99Percent } from "@/content/problems/quantum-hardware/control-and-readout/expected-readout-errors-99-percent";
import { whyDispersiveNotDirect } from "@/content/problems/quantum-hardware/control-and-readout/why-dispersive-not-direct";
import { readoutVsGateErrorTiming } from "@/content/problems/quantum-hardware/control-and-readout/readout-vs-gate-error-timing";
import { recoverOmegaFromScan } from "@/content/problems/quantum-hardware/control-and-readout/recover-omega-from-scan";
import { miscalibrationPercentageError } from "@/content/problems/quantum-hardware/control-and-readout/miscalibration-percentage-error";
import { classifyCoherentErrors } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/classify-coherent-errors";
import { whyClassificationMattersForMitigation } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/why-classification-matters-for-mitigation";
import { noiseSourceCatalogCheck } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/noise-source-catalog-check";
import { gammaFor100UsT1 } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/gamma-for-100us-t1";
import { maxT2ForGivenT1 } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/max-t2-for-given-t1";
import { whyT1NecessarilyDephases } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/why-t1-necessarily-dephases";
import { crosstalkFidelityAt01 } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/crosstalk-fidelity-at-0.1";
import { crosstalkVsT1T2Distinction } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/crosstalk-vs-t1t2-distinction";
import { successProbability500Gates } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/success-probability-500-gates";
import { gatesUntil50PercentAt9999 } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/gates-until-50-percent-at-99.99";
import { multiplicativeNotAdditiveError } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/multiplicative-not-additive-error";
import { physicalQubitsFor10Logical } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/physical-qubits-for-10-logical";
import { nisqMeaningCheck } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/nisq-meaning-check";
import { whyNisqFavorsVqeQaoa } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/why-nisq-favors-vqe-qaoa";
import { hzhEqualsXCheck } from "@/content/problems/quantum-software/programming-quantum-computers/hzh-equals-x-check";
import { whenDoesStateChange } from "@/content/problems/quantum-software/programming-quantum-computers/when-does-state-change";
import { whySeparationEnablesOptimization } from "@/content/problems/quantum-software/programming-quantum-computers/why-separation-enables-optimization";
import { pennylaneVqeFit } from "@/content/problems/quantum-software/programming-quantum-computers/pennylane-vqe-fit";
import { whatABackendAbstracts } from "@/content/problems/quantum-software/programming-quantum-computers/what-a-backend-abstracts";
import { sameCapabilityDifferentErgonomics } from "@/content/problems/quantum-software/programming-quantum-computers/same-capability-different-ergonomics";
import { ghzExactProbability } from "@/content/problems/quantum-software/programming-quantum-computers/ghz-exact-probability";
import { shotNoiseStandardDeviation10000 } from "@/content/problems/quantum-software/programming-quantum-computers/shot-noise-standard-deviation-10000";
import { fourThousandOneThousandSplitExplanation } from "@/content/problems/quantum-software/programming-quantum-computers/4000-1000-split-explanation";
import { amplitudesFor20Qubits } from "@/content/problems/quantum-software/programming-quantum-computers/amplitudes-for-20-qubits";
import { whyNoiseConfoundsDebugging } from "@/content/problems/quantum-software/programming-quantum-computers/why-noise-confounds-debugging";
import { oppositeFailureModes } from "@/content/problems/quantum-software/programming-quantum-computers/opposite-failure-modes";
import { exactVsSampledDistinction } from "@/content/problems/quantum-software/simulating-quantum-systems/exact-vs-sampled-distinction";
import { simulatingVsBeingQuantum } from "@/content/problems/quantum-software/simulating-quantum-systems/simulating-vs-being-quantum";
import { nameAPriorSimulationResult } from "@/content/problems/quantum-software/simulating-quantum-systems/name-a-prior-simulation-result";
import { memoryFor25Qubits } from "@/content/problems/quantum-software/simulating-quantum-systems/memory-for-25-qubits";
import { flopsFor1000Gates30Qubits } from "@/content/problems/quantum-software/simulating-quantum-systems/flops-for-1000-gates-30-qubits";
import { why2nIsFundamental } from "@/content/problems/quantum-software/simulating-quantum-systems/why-2n-is-fundamental";
import { groverPoorFitForTensorNetworks } from "@/content/problems/quantum-software/simulating-quantum-systems/grover-poor-fit-for-tensor-networks";
import { whatTensorNetworksExploit } from "@/content/problems/quantum-software/simulating-quantum-systems/what-tensor-networks-exploit";
import { tensorNetworksNotStrictlyBetter } from "@/content/problems/quantum-software/simulating-quantum-systems/tensor-networks-not-strictly-better";
import { hhWithDephasingP0 } from "@/content/problems/quantum-software/simulating-quantum-systems/hh-with-dephasing-p0";
import { purityNotStrictlyMonotonic } from "@/content/problems/quantum-software/simulating-quantum-systems/purity-not-strictly-monotonic";
import { whySingleQubitScope } from "@/content/problems/quantum-software/simulating-quantum-systems/why-single-qubit-scope";
import { swapOverhead14 } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/swap-overhead-1-4";
import { totalCnotEquivalentOps } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/total-cnot-equivalent-ops";
import { logicalResultUnchanged } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/logical-result-unchanged";
import { verifyXDecomposition } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/verify-x-decomposition";
import { whyGlobalPhaseToleranceCorrect } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/why-global-phase-tolerance-correct";
import { notEveryGateNeedsThreeRotations } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/not-every-gate-needs-three-rotations";
import { totalSwaps500Iterations } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/total-swaps-500-iterations";
import { onlyQuantumStep } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/only-quantum-step";
import { pennylaneFitsWhichStep } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/pennylane-fits-which-step";
import { circuitVqeMatchesExact } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/circuit-vqe-matches-exact";
import { whyExactVsApproximateConvergence } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/why-exact-vs-approximate-convergence";
import { twoImplementationsCrossCheck } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/two-implementations-cross-check";

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
  biasedQubitP1,
  superpositionVsClassicalUncertainty,
  modulusOf3Minus4i,
  phaseOf1PlusI,
  phaseOfProductOfTwoPhases,
  zeroPlusInnerProduct,
  conjugateSymmetryOfInnerProduct,
  whyOrthonormalityLetsTermsCancel,
  constructiveInterferenceAmplitudeSum,
  whichStateFailsNormalization,
  amplitudesVsProbabilitiesMixture,
  blochXCoordinateCalculation,
  blochPoint100State,
  equatorStatesSameThetaDifferentPhi,
  pPlusForKnownAmplitudes,
  stateWithCertainPlusOutcome,
  whyRepeatedMeasurementFails,
  zOnPlusState,
  blochZAfterSOnPlus,
  whyTEightReturnsExactly,
  thetaPreservedUnderRz,
  whyRxNeedsFullTurnOnOne,
  rzPiOnPlusState,
  classifyIScaledPair,
  pPlusAtTwoThirdsPiPhase,
  singleAmplitudePhaseArgument,
  p0AfterHSHOnZero,
  hxhIdentity,
  fourSGatesSandwiched,
  minusIPlusTensorProbability,
  onePlusVsPlusOneTensorOrder,
  hOnQ1ThenCnot10Outcome,
  correctOperatorOrderHThenX,
  whyBlankWireIsIdentity,
  cnotReversedControlTarget,
  czAmplitudeOnEleven,
  whyCnotSquaredIsIdentity,
  psiPlusFromZeroOneProbability,
  qubit1MeasurementProbabilityAsymmetricState,
  psiMinusPostMeasurementOutcomeOne,
  cnotDoesNotCloneSuperposition,
  forcedCloneStateProbability,
  whyTestingBasisStatesIsntEnough,
  teleportationFinalPopulationMatchesMessage,
  teleportationCorrectionFor01,
  whyAliceOutcomesAreAlwaysFair,
  phaseOnQubitZeroConcentration,
  whichVariantStillGives00,
  interferenceWithoutEntanglement,
  ghzMeasurementProbability111,
  ghzCollapseAfterMeasuringQubitZero,
  ghzCorrelationWithoutSignaling,
  fourQubitParameterGap,
  doesThisStateFactor,
  noInteractionMeansNoEntanglement,
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
  threeQubitUniformSuperposition,
  oracleReversibilityProof,
  oneQueryInformationLimit,
  phaseKickbackSignForF0,
  ancillaUnchangedByKickback,
  djConstantFunctionAmplitude,
  djBalancedParityFunction,
  whyPromiseIsNecessary,
  qftOfBasisState,
  qftReducesToHadamard,
  qftOfZeroIsUniform,
  phaseEstimationQuarterPhase,
  whichPrecisionQubitControlsLargestPower,
  whyPhaseEstimationNeedsKnownEigenstate,
  diffusionOnNonUniformState,
  phaseOracleVsDiffusionRole,
  globalPhaseBugDiagnosis,
  groverSuccessProbabilityClosedForm,
  zeroIterationsBaseline,
  whyMoreIterationsIsntAlwaysBetter,
  speedupFactorComparison,
  provablyOptimalVsBestKnown,
  queryComplexityVsWallClock,
  orderOf2Mod21,
  factorsOf21ViaGcd,
  whyOddOrderFails,
  periodFindingPeakLocations,
  whyControlledModularExpNotBuilt,
  periodFindingTotalProbability,
  gcdOf7And15,
  whichStepWasQuantum,
  groundEnergyOfPauliX,
  variationalPrincipleEqualityCase,
  ansatzExpressivityCheck,
  vqeConvergenceAccuracy,
  eigenvaluesViaTraceAndDeterminant,
  expectedCutFourEdges,
  costUnitaryIsPurePhase,
  qaoaApproximationRatio,
  pigeonholeOddCycleArgument,
  identifyingNisqFriendlyAlgorithms,
  accountingTableRecall,
  threeKindsOfAdvantageClaims,
  yEqualsIxzVerification,
  whyMeasurementWouldCollapseSuperposition,
  syndromeForQubit0Error,
  encodingCircuitTrace,
  bitFlipCodeBlindToZ,
  hzhEqualsXDerivation,
  phaseFlipCodeCorrectsZError,
  shorCodeQubitCount,
  yErrorDoubleDetection,
  verifyX2Anticommutation,
  phaseFlipCodeStabilizers,
  weight2ErrorLogicalFlip,
  codeParametersShorVsBitflip,
  vertexStabilizerLocality,
  surfaceCodeDistanceScaling,
  thresholdQualitativeReasoning,
  connectingBackToShorsAlgorithm,
  verifyLxLyCommutatorSign,
  jxJyCommutatorJ2,
  allowedMValuesForJThreeHalves,
  jRaisingOperatorTopState,
  y00NormalizationCheck,
  whyHalfIntegerLExcluded,
  spinSquaredEigenvalue,
  whySpinHasNoPositionWavefunction,
  sequentialSgJointProbability,
  repeatedSameAxisMeasurement,
  tripletUpJzEigenvalue,
  singletMatchesBellState,
  groundStateAngularDependence,
  lEquals2DegeneracyCount,
  whichPotentialsAreCentral,
  lzL2CommutatorNumerically,
  whyHCommutesWithLz,
  centrifugalTermForLEquals2,
  sStatesHaveNoCentrifugalBarrier,
  uVsRBoundaryCondition,
  balmerAlphaTransitionEnergy,
  nEquals2TotalDegeneracy,
  whyCoulombEnergyIgnoresL,
  nEquals3OrbitalCount,
  psi1sNormalizationFromFactors,
  bohrRadiusAgreementMeaning,
  fineStructureTwoEffects,
  whatFineStructureBreaks,
  anharmonicFirstOrderShift,
  whyGroundStateSecondOrderIsNegative,
  wrongBasisForPerturbationMatrix,
  variationalEnergyNeverBelowExact,
  badWidthGivesWorseBound,
  provingTheVariationalTheorem,
  wkbEnergyForNEquals2,
  whyTheMaslovHalfMatters,
  wkbExactnessIsSpecialToSho,
  transitionProbabilityWeakCoupling,
  strongCouplingBreakdownGap,
  unitarityBoundsTransitionProbability,
  productStateNotEigenstate,
  possibleExchangeEigenvalues,
  quantumVsClassicalIndistinguishability,
  antisymmetricEigenvalueCheck,
  photonVsElectronStatistics,
  whyNormalizationDiffers,
  sameOrbitalOppositeSpinAllowed,
  bosonsVsFermionsClustering,
  zeroVectorIsExact,
  shellCapacityNEquals4,
  oxygen2pElectronCount,
  whyFillingOrderDeviates,
  amplitudeDampingTraceCheck,
  identifyingInvalidKrausSet,
  unitaryAsSpecialKrausCase,
  offDiagonalAfterThreeApplications,
  longRunPurityLimit,
  decoherenceVsCollapse,
  euclideanPropagatorAtOrigin,
  compositionLawRelativeError,
  whyWickRotationHelps,
  channelsReusedInHardwarePillar,
  statingTheMeasurementOverclaim,
  strongestConsistencyEvidence,
  piPulseDuration25Mhz,
  whyJosephsonJunctionNeeded,
  gateTimeVsCoherenceRatio,
  ionGateBudgetComputation,
  whyStaticFieldsCantTrap,
  sharedMotionalModeMechanism,
  rydbergBlockadeMechanism,
  whyOpticalTweezersWorkForNeutralAtoms,
  tweezersVsGateLasers,
  lossVsDecoherence,
  photonEncodingOptions,
  whyPhotonPhotonGatesAreHard,
  quantumDotParticleInBoxParallel,
  spinQubitScalabilitySource,
  manufacturabilityIsntAutomaticallyDecisive,
  hypotheticalDeviceGateBudget,
  recommendPlatformForNetworking,
  isolationVsCouplingTradeoff,
  occupationAt50Mk,
  why4kInsufficient,
  higherFrequencyLowerOccupation,
  pulseDurationForPiOver2,
  whyP1UsesHalfAngle,
  durationVsAmplitudeControl,
  expectedReadoutErrors99Percent,
  whyDispersiveNotDirect,
  readoutVsGateErrorTiming,
  recoverOmegaFromScan,
  miscalibrationPercentageError,
  classifyCoherentErrors,
  whyClassificationMattersForMitigation,
  noiseSourceCatalogCheck,
  gammaFor100UsT1,
  maxT2ForGivenT1,
  whyT1NecessarilyDephases,
  crosstalkFidelityAt01,
  crosstalkVsT1T2Distinction,
  successProbability500Gates,
  gatesUntil50PercentAt9999,
  multiplicativeNotAdditiveError,
  physicalQubitsFor10Logical,
  nisqMeaningCheck,
  whyNisqFavorsVqeQaoa,
  hzhEqualsXCheck,
  whenDoesStateChange,
  whySeparationEnablesOptimization,
  pennylaneVqeFit,
  whatABackendAbstracts,
  sameCapabilityDifferentErgonomics,
  ghzExactProbability,
  shotNoiseStandardDeviation10000,
  fourThousandOneThousandSplitExplanation,
  amplitudesFor20Qubits,
  whyNoiseConfoundsDebugging,
  oppositeFailureModes,
  exactVsSampledDistinction,
  simulatingVsBeingQuantum,
  nameAPriorSimulationResult,
  memoryFor25Qubits,
  flopsFor1000Gates30Qubits,
  why2nIsFundamental,
  groverPoorFitForTensorNetworks,
  whatTensorNetworksExploit,
  tensorNetworksNotStrictlyBetter,
  hhWithDephasingP0,
  purityNotStrictlyMonotonic,
  whySingleQubitScope,
  swapOverhead14,
  totalCnotEquivalentOps,
  logicalResultUnchanged,
  verifyXDecomposition,
  whyGlobalPhaseToleranceCorrect,
  notEveryGateNeedsThreeRotations,
  totalSwaps500Iterations,
  onlyQuantumStep,
  pennylaneFitsWhichStep,
  circuitVqeMatchesExact,
  whyExactVsApproximateConvergence,
  twoImplementationsCrossCheck,
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
