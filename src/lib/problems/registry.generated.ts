/**
 * AUTO-GENERATED — do not hand-edit.
 *
 * Produced by `node scripts/generate-problem-registry.mjs` (`npm run
 * generate:registry`; also runs automatically before `dev`/`build` via the
 * `predev`/`prebuild` npm lifecycle hooks). Re-run it after adding,
 * renaming, or deleting a file under `src/content/problems/**` — this file
 * will be silently overwritten on the next run either way.
 *
 * Entries are sorted by content path for reproducibility, which is NOT the
 * same as the previous hand-authored order. The only place PROBLEMS order is
 * read semantically is `getCourseCheckpointProblems` in `registry.ts`
 * (spreads a sample across a course) — a reordering changes which sample
 * problems it picks, not correctness.
 *
 * See `registry.ts`, which imports `PROBLEMS` from here and owns every
 * lookup function (`getProblem`, `getProblemsForLesson`, ...); this file's
 * job ends at producing the array.
 */
import type { Problem } from "./types";

import { amplitudeEstimationGroverIterateProbability } from "@/content/problems/apex/algorithmic-frontiers/amplitude-estimation-grover-iterate-probability";
import { amplitudeEstimationQpeFreeScalingMc } from "@/content/problems/apex/algorithmic-frontiers/amplitude-estimation-qpe-free-scaling-mc";
import { capstoneToolboxHonestUnificationMc } from "@/content/problems/apex/algorithmic-frontiers/capstone-toolbox-honest-unification-mc";
import { capstoneToolboxTrotterStepsT10 } from "@/content/problems/apex/algorithmic-frontiers/capstone-toolbox-trotter-steps-t10";
import { lcuPrepareRegisterSize } from "@/content/problems/apex/algorithmic-frontiers/lcu-prepare-register-size";
import { lcuSuccessProbabilityPlusState } from "@/content/problems/apex/algorithmic-frontiers/lcu-success-probability-plus-state";
import { linearSystemsPolynomialDegreeForTargetEpsilon } from "@/content/problems/apex/algorithmic-frontiers/linear-systems-polynomial-degree-for-target-epsilon";
import { linearSystemsReadoutVsFullVector } from "@/content/problems/apex/algorithmic-frontiers/linear-systems-readout-vs-full-vector";
import { qspD1PhaseSumRealPart } from "@/content/problems/apex/algorithmic-frontiers/qsp-d1-phase-sum-real-part";
import { qspD2DegreeCollapseImaginaryPart } from "@/content/problems/apex/algorithmic-frontiers/qsp-d2-degree-collapse-imaginary-part";
import { qsvtPolynomialValueAtASingularValue } from "@/content/problems/apex/algorithmic-frontiers/qsvt-polynomial-value-at-a-singular-value";
import { qsvtVersusTrotterAsymptoticClaim } from "@/content/problems/apex/algorithmic-frontiers/qsvt-versus-trotter-asymptotic-claim";
import { decodingDefectPairForABoundaryQubit } from "@/content/problems/apex/fault-tolerance-frontiers/decoding-defect-pair-for-a-boundary-qubit";
import { decodingThresholdScalingRatio } from "@/content/problems/apex/fault-tolerance-frontiers/decoding-threshold-scaling-ratio";
import { latticeSurgeryCnotMergeCount } from "@/content/problems/apex/fault-tolerance-frontiers/lattice-surgery-cnot-merge-count";
import { latticeSurgeryTransversalGateFailure } from "@/content/problems/apex/fault-tolerance-frontiers/lattice-surgery-transversal-gate-failure";
import { magicStateDistillationRoundsNeeded } from "@/content/problems/apex/fault-tolerance-frontiers/magic-state-distillation-rounds-needed";
import { magicStateEastinKnillTransversalGates } from "@/content/problems/apex/fault-tolerance-frontiers/magic-state-eastin-knill-transversal-gates";
import { resourceEstimationCodeDistanceForTighterBudget } from "@/content/problems/apex/fault-tolerance-frontiers/resource-estimation-code-distance-for-tighter-budget";
import { resourceEstimationFactoryShareWithNineLogicalQubits } from "@/content/problems/apex/fault-tolerance-frontiers/resource-estimation-factory-share-with-nine-logical-qubits";
import { surfaceCodeGeneratorCountAtDistance5 } from "@/content/problems/apex/fault-tolerance-frontiers/surface-code-generator-count-at-distance-5";
import { thresholdConcatenationTwoLevels } from "@/content/problems/apex/fault-tolerance-frontiers/threshold-concatenation-two-levels";
import { thresholdDifferingValuesNotContradiction } from "@/content/problems/apex/fault-tolerance-frontiers/threshold-differing-values-not-contradiction";
import { whyStabilizerOverlapsAreAlwaysEven } from "@/content/problems/apex/fault-tolerance-frontiers/why-stabilizer-overlaps-are-always-even";
import { capstoneClassifyRcsClaimMc } from "@/content/problems/apex/quantum-complexity-theory/capstone-classify-rcs-claim-mc";
import { capstoneNpNotSubsetBqpConjecture } from "@/content/problems/apex/quantum-complexity-theory/capstone-np-not-subset-bqp-conjecture";
import { evaluatingAWorstCaseNpCompleteClaimMc } from "@/content/problems/apex/quantum-complexity-theory/evaluating-a-worst-case-np-complete-claim-mc";
import { localHamiltonianPropagationTermNullSpaceMc } from "@/content/problems/apex/quantum-complexity-theory/local-hamiltonian-propagation-term-null-space-mc";
import { localHamiltonianVerificationPrecisionUnionBound } from "@/content/problems/apex/quantum-complexity-theory/local-hamiltonian-verification-precision-union-bound";
import { qmaAmplificationThreshold5Percent } from "@/content/problems/apex/quantum-complexity-theory/qma-amplification-threshold-5-percent";
import { qmaSoundnessQuantifierMc } from "@/content/problems/apex/quantum-complexity-theory/qma-soundness-quantifier-mc";
import { queryComplexityAdversaryBoundN64 } from "@/content/problems/apex/quantum-complexity-theory/query-complexity-adversary-bound-n64";
import { shorsAlgorithmDoesNotProvePNeqBqp } from "@/content/problems/apex/quantum-complexity-theory/shors-algorithm-does-not-prove-p-neq-bqp";
import { twoIndependentProofsOfGroverOptimalityMc } from "@/content/problems/apex/quantum-complexity-theory/two-independent-proofs-of-grover-optimality-mc";
import { capstoneLandscapeHardwareClaimClassification } from "@/content/problems/apex/research-methods-and-synthesis/capstone-landscape-hardware-claim-classification";
import { capstoneLandscapeTimelinePredictionEvaluation } from "@/content/problems/apex/research-methods-and-synthesis/capstone-landscape-timeline-prediction-evaluation";
import { classifyingTheOracleSpeedupAbstractMc } from "@/content/problems/apex/research-methods-and-synthesis/classifying-the-oracle-speedup-abstract-mc";
import { explainingTheOracleModelGap } from "@/content/problems/apex/research-methods-and-synthesis/explaining-the-oracle-model-gap";
import { quantumAdvantageHardVsUsefulTwoAxes } from "@/content/problems/apex/research-methods-and-synthesis/quantum-advantage-hard-vs-useful-two-axes";
import { quantumAdvantageWeakClassicalBaselineMc } from "@/content/problems/apex/research-methods-and-synthesis/quantum-advantage-weak-classical-baseline-mc";
import { reproducibilityComponentsMissingMc } from "@/content/problems/apex/research-methods-and-synthesis/reproducibility-components-missing-mc";
import { shotNoiseStandardErrorP75N300 } from "@/content/problems/apex/research-methods-and-synthesis/shot-noise-standard-error-p75-n300";
import { theoremVsHeuristicClassifySurfaceCodeThreshold } from "@/content/problems/apex/research-methods-and-synthesis/theorem-vs-heuristic-classify-surface-code-threshold";
import { theoremVsHeuristicQaoaVsGroverMc } from "@/content/problems/apex/research-methods-and-synthesis/theorem-vs-heuristic-qaoa-vs-grover-mc";
import { areaLawMinimumBondDimension } from "@/content/problems/apex/simulation-and-compilation-frontiers/area-law-minimum-bond-dimension";
import { capstonePipelineRoutedGateCountFewerSteps } from "@/content/problems/apex/simulation-and-compilation-frontiers/capstone-pipeline-routed-gate-count-fewer-steps";
import { capstonePipelineWhichStagesAreSettled } from "@/content/problems/apex/simulation-and-compilation-frontiers/capstone-pipeline-which-stages-are-settled";
import { classicalSimulationBellPairBondDimension } from "@/content/problems/apex/simulation-and-compilation-frontiers/classical-simulation-bell-pair-bond-dimension";
import { classicalSimulationCliffordVsNonCliffordAdvantageCandidateMc } from "@/content/problems/apex/simulation-and-compilation-frontiers/classical-simulation-clifford-vs-nonclifford-advantage-candidate-mc";
import { cliffordTRossSelingerTCountForEpsilon } from "@/content/problems/apex/simulation-and-compilation-frontiers/clifford-t-ross-selinger-tcount-for-epsilon";
import { cliffordTSolovayKitaevVersusOptimalMc } from "@/content/problems/apex/simulation-and-compilation-frontiers/clifford-t-solovay-kitaev-versus-optimal-mc";
import { molecularSimulationElectronConfigurationCount } from "@/content/problems/apex/simulation-and-compilation-frontiers/molecular-simulation-electron-configuration-count";
import { molecularSimulationPhaseEstimationOverlapCaveat } from "@/content/problems/apex/simulation-and-compilation-frontiers/molecular-simulation-phase-estimation-overlap-caveat";
import { noiseAwareCompilationSuccessProbabilityMc } from "@/content/problems/apex/simulation-and-compilation-frontiers/noise-aware-compilation-success-probability-mc";
import { noiseAwareCompilationSwapOverheadAlternateRouting } from "@/content/problems/apex/simulation-and-compilation-frontiers/noise-aware-compilation-swap-overhead-alternate-routing";
import { wStateEntropyAndBondDimension } from "@/content/problems/apex/simulation-and-compilation-frontiers/w-state-entropy-and-bond-dimension";
import { biasedMixturePurity } from "@/content/problems/quantum-computing/entanglement-and-measurement/biased-mixture-purity";
import { definingRequirementXCheck } from "@/content/problems/quantum-computing/entanglement-and-measurement/defining-requirement-x-check";
import { deterministicLhvChshValue } from "@/content/problems/quantum-computing/entanglement-and-measurement/deterministic-lhv-chsh-value";
import { diagnosingTheI4Counterexample } from "@/content/problems/quantum-computing/entanglement-and-measurement/diagnosing-the-i4-counterexample";
import { entropyOfSixtyFortyMixture } from "@/content/problems/quantum-computing/entanglement-and-measurement/entropy-of-sixty-forty-mixture";
import { indistinguishableEnsembles } from "@/content/problems/quantum-computing/entanglement-and-measurement/indistinguishable-ensembles";
import { localityAssumptionNonlocalHv } from "@/content/problems/quantum-computing/entanglement-and-measurement/locality-assumption-nonlocal-hv";
import { maxConcurrenceImpliesMaximallyMixed } from "@/content/problems/quantum-computing/entanglement-and-measurement/max-concurrence-implies-maximally-mixed";
import { maximallyMixedInvarianceProof } from "@/content/problems/quantum-computing/entanglement-and-measurement/maximally-mixed-invariance-proof";
import { measuringP1OnBiasedMixture } from "@/content/problems/quantum-computing/entanglement-and-measurement/measuring-p1-on-biased-mixture";
import { minusStateXExpectationViaRho } from "@/content/problems/quantum-computing/entanglement-and-measurement/minus-state-x-expectation-via-rho";
import { nearPureEntropyCalculation } from "@/content/problems/quantum-computing/entanglement-and-measurement/near-pure-entropy-calculation";
import { oneStateDensityMatrixChoice } from "@/content/problems/quantum-computing/entanglement-and-measurement/one-state-density-matrix-choice";
import { phaseInvarianceOfEntanglementMeasures } from "@/content/problems/quantum-computing/entanglement-and-measurement/phase-invariance-of-entanglement-measures";
import { plusMinusMixtureIdentity } from "@/content/problems/quantum-computing/entanglement-and-measurement/plus-minus-mixture-identity";
import { psiMinusConcurrence } from "@/content/problems/quantum-computing/entanglement-and-measurement/psi-minus-concurrence";
import { psiMinusPurityViaIdentity } from "@/content/problems/quantum-computing/entanglement-and-measurement/psi-minus-purity-via-identity";
import { purityBetweenTwoKnownValues } from "@/content/problems/quantum-computing/entanglement-and-measurement/purity-between-two-known-values";
import { purityFromConcurrence } from "@/content/problems/quantum-computing/entanglement-and-measurement/purity-from-concurrence";
import { sameAxisPerfectCorrelation } from "@/content/problems/quantum-computing/entanglement-and-measurement/same-axis-perfect-correlation";
import { sameSettingsChshValue } from "@/content/problems/quantum-computing/entanglement-and-measurement/same-settings-chsh-value";
import { superpositionVsMixture } from "@/content/problems/quantum-computing/entanglement-and-measurement/superposition-vs-mixture";
import { threeComponentMixtureEntry } from "@/content/problems/quantum-computing/entanglement-and-measurement/three-component-mixture-entry";
import { weaklyEntangledStateEntropy } from "@/content/problems/quantum-computing/entanglement-and-measurement/weakly-entangled-state-entropy";
import { whatAChshViolationRulesOut } from "@/content/problems/quantum-computing/entanglement-and-measurement/what-a-chsh-violation-rules-out";
import { whyConcurrenceNeedsStatevector } from "@/content/problems/quantum-computing/entanglement-and-measurement/why-concurrence-needs-statevector";
import { whyOneBitIsTheMaximum } from "@/content/problems/quantum-computing/entanglement-and-measurement/why-one-bit-is-the-maximum";
import { whyProofNeedsTwoQubits } from "@/content/problems/quantum-computing/entanglement-and-measurement/why-proof-needs-two-qubits";
import { whyRhoIsHermitian } from "@/content/problems/quantum-computing/entanglement-and-measurement/why-rho-is-hermitian";
import { whyTraceOutEverythingIsMeaningless } from "@/content/problems/quantum-computing/entanglement-and-measurement/why-trace-out-everything-is-meaningless";
import { xGateOnBiasedMixture } from "@/content/problems/quantum-computing/entanglement-and-measurement/x-gate-on-biased-mixture";
import { zeroOneProductReducedState } from "@/content/problems/quantum-computing/entanglement-and-measurement/zero-one-product-reduced-state";
import { bitFlipCodeBlindToZ } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/bit-flip-code-blind-to-z";
import { codeParametersShorVsBitflip } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/code-parameters-shor-vs-bitflip";
import { connectingBackToShorsAlgorithm } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/connecting-back-to-shors-algorithm";
import { encodingCircuitTrace } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/encoding-circuit-trace";
import { hzhEqualsXDerivation } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/hzh-equals-x-derivation";
import { phaseFlipCodeCorrectsZError } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/phase-flip-code-corrects-z-error";
import { phaseFlipCodeStabilizers } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/phase-flip-code-stabilizers";
import { shorCodeQubitCount } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/shor-code-qubit-count";
import { surfaceCodeDistanceScaling } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/surface-code-distance-scaling";
import { syndromeForQubit0Error } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/syndrome-for-qubit-0-error";
import { thresholdQualitativeReasoning } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/threshold-qualitative-reasoning";
import { verifyX2Anticommutation } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/verify-x2-anticommutation";
import { vertexStabilizerLocality } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/vertex-stabilizer-locality";
import { weight2ErrorLogicalFlip } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/weight-2-error-logical-flip";
import { whyMeasurementWouldCollapseSuperposition } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/why-measurement-would-collapse-superposition";
import { yEqualsIxzVerification } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/y-equals-ixz-verification";
import { yErrorDoubleDetection } from "@/content/problems/quantum-computing/error-correction-and-fault-tolerance/y-error-double-detection";
import { ancillaUnchangedByKickback } from "@/content/problems/quantum-computing/quantum-algorithms-i/ancilla-unchanged-by-kickback";
import { diffusionOnNonUniformState } from "@/content/problems/quantum-computing/quantum-algorithms-i/diffusion-on-non-uniform-state";
import { djBalancedParityFunction } from "@/content/problems/quantum-computing/quantum-algorithms-i/dj-balanced-parity-function";
import { djConstantFunctionAmplitude } from "@/content/problems/quantum-computing/quantum-algorithms-i/dj-constant-function-amplitude";
import { globalPhaseBugDiagnosis } from "@/content/problems/quantum-computing/quantum-algorithms-i/global-phase-bug-diagnosis";
import { groverSuccessProbabilityClosedForm } from "@/content/problems/quantum-computing/quantum-algorithms-i/grover-success-probability-closed-form";
import { oneQueryInformationLimit } from "@/content/problems/quantum-computing/quantum-algorithms-i/one-query-information-limit";
import { oracleReversibilityProof } from "@/content/problems/quantum-computing/quantum-algorithms-i/oracle-reversibility-proof";
import { phaseEstimationQuarterPhase } from "@/content/problems/quantum-computing/quantum-algorithms-i/phase-estimation-quarter-phase";
import { phaseKickbackSignForF0 } from "@/content/problems/quantum-computing/quantum-algorithms-i/phase-kickback-sign-for-f0";
import { phaseOracleVsDiffusionRole } from "@/content/problems/quantum-computing/quantum-algorithms-i/phase-oracle-vs-diffusion-role";
import { provablyOptimalVsBestKnown } from "@/content/problems/quantum-computing/quantum-algorithms-i/provably-optimal-vs-best-known";
import { qftOfBasisState } from "@/content/problems/quantum-computing/quantum-algorithms-i/qft-of-basis-state";
import { qftOfZeroIsUniform } from "@/content/problems/quantum-computing/quantum-algorithms-i/qft-of-zero-is-uniform";
import { qftReducesToHadamard } from "@/content/problems/quantum-computing/quantum-algorithms-i/qft-reduces-to-hadamard";
import { queryComplexityVsWallClock } from "@/content/problems/quantum-computing/quantum-algorithms-i/query-complexity-vs-wall-clock";
import { simonMeasurementProbabilityS10 } from "@/content/problems/quantum-computing/quantum-algorithms-i/simon-measurement-probability-s10";
import { simonOracleOutputS10X3 } from "@/content/problems/quantum-computing/quantum-algorithms-i/simon-oracle-output-s10-x3";
import { simonOrthogonalComplementRecoversS } from "@/content/problems/quantum-computing/quantum-algorithms-i/simon-orthogonal-complement-recovers-s";
import { simonWhyZeroStringUninformative } from "@/content/problems/quantum-computing/quantum-algorithms-i/simon-why-zero-string-uninformative";
import { speedupFactorComparison } from "@/content/problems/quantum-computing/quantum-algorithms-i/speedup-factor-comparison";
import { threeQubitUniformSuperposition } from "@/content/problems/quantum-computing/quantum-algorithms-i/three-qubit-uniform-superposition";
import { whichPrecisionQubitControlsLargestPower } from "@/content/problems/quantum-computing/quantum-algorithms-i/which-precision-qubit-controls-largest-power";
import { whyMoreIterationsIsntAlwaysBetter } from "@/content/problems/quantum-computing/quantum-algorithms-i/why-more-iterations-isnt-always-better";
import { whyPhaseEstimationNeedsKnownEigenstate } from "@/content/problems/quantum-computing/quantum-algorithms-i/why-phase-estimation-needs-known-eigenstate";
import { whyPromiseIsNecessary } from "@/content/problems/quantum-computing/quantum-algorithms-i/why-promise-is-necessary";
import { zeroIterationsBaseline } from "@/content/problems/quantum-computing/quantum-algorithms-i/zero-iterations-baseline";
import { accountingTableRecall } from "@/content/problems/quantum-computing/quantum-algorithms-ii/accounting-table-recall";
import { ansatzExpressivityCheck } from "@/content/problems/quantum-computing/quantum-algorithms-ii/ansatz-expressivity-check";
import { costUnitaryIsPurePhase } from "@/content/problems/quantum-computing/quantum-algorithms-ii/cost-unitary-is-pure-phase";
import { eigenvaluesViaTraceAndDeterminant } from "@/content/problems/quantum-computing/quantum-algorithms-ii/eigenvalues-via-trace-and-determinant";
import { expectedCutFourEdges } from "@/content/problems/quantum-computing/quantum-algorithms-ii/expected-cut-four-edges";
import { factorsOf21ViaGcd } from "@/content/problems/quantum-computing/quantum-algorithms-ii/factors-of-21-via-gcd";
import { gcdOf7And15 } from "@/content/problems/quantum-computing/quantum-algorithms-ii/gcd-of-7-and-15";
import { groundEnergyOfPauliX } from "@/content/problems/quantum-computing/quantum-algorithms-ii/ground-energy-of-pauli-x";
import { identifyingNisqFriendlyAlgorithms } from "@/content/problems/quantum-computing/quantum-algorithms-ii/identifying-nisq-friendly-algorithms";
import { orderOf2Mod21 } from "@/content/problems/quantum-computing/quantum-algorithms-ii/order-of-2-mod-21";
import { periodFindingPeakLocations } from "@/content/problems/quantum-computing/quantum-algorithms-ii/period-finding-peak-locations";
import { periodFindingTotalProbability } from "@/content/problems/quantum-computing/quantum-algorithms-ii/period-finding-total-probability";
import { pigeonholeOddCycleArgument } from "@/content/problems/quantum-computing/quantum-algorithms-ii/pigeonhole-odd-cycle-argument";
import { qaoaApproximationRatio } from "@/content/problems/quantum-computing/quantum-algorithms-ii/qaoa-approximation-ratio";
import { threeKindsOfAdvantageClaims } from "@/content/problems/quantum-computing/quantum-algorithms-ii/three-kinds-of-advantage-claims";
import { variationalPrincipleEqualityCase } from "@/content/problems/quantum-computing/quantum-algorithms-ii/variational-principle-equality-case";
import { vqeConvergenceAccuracy } from "@/content/problems/quantum-computing/quantum-algorithms-ii/vqe-convergence-accuracy";
import { whichStepWasQuantum } from "@/content/problems/quantum-computing/quantum-algorithms-ii/which-step-was-quantum";
import { whyControlledModularExpNotBuilt } from "@/content/problems/quantum-computing/quantum-algorithms-ii/why-controlled-modular-exp-not-built";
import { whyOddOrderFails } from "@/content/problems/quantum-computing/quantum-algorithms-ii/why-odd-order-fails";
import { bb84FixedEveStrategyErrorRate } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/bb84-fixed-eve-strategy-error-rate";
import { bb84MismatchEqualsEveProbability } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/bb84-mismatch-equals-eve-probability";
import { bb84MismatchedBasisProbability } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/bb84-mismatched-basis-probability";
import { bb84WhySamplingDetectsEavesdropping } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/bb84-why-sampling-detects-eavesdropping";
import { bellStateOutcomeProbability } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/bell-state-outcome-probability";
import { bellStateSeparability } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/bell-state-separability";
import { cnotDoesNotCloneSuperposition } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/cnot-does-not-clone-superposition";
import { cnotReversedControlTarget } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/cnot-reversed-control-target";
import { correctOperatorOrderHThenX } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/correct-operator-order-h-then-x";
import { czAmplitudeOnEleven } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/cz-amplitude-on-eleven";
import { doesThisStateFactor } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/does-this-state-factor";
import { forcedCloneStateProbability } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/forced-clone-state-probability";
import { fourQubitParameterGap } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/four-qubit-parameter-gap";
import { ghzCollapseAfterMeasuringQubitZero } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/ghz-collapse-after-measuring-qubit-zero";
import { ghzCorrelationWithoutSignaling } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/ghz-correlation-without-signaling";
import { ghzMeasurementProbability111 } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/ghz-measurement-probability-111";
import { hOnQ1ThenCnot10Outcome } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/h-on-q1-then-cnot-1-0-outcome";
import { hThenCnotResult } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/h-then-cnot-result";
import { interferenceWithoutEntanglement } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/interference-without-entanglement";
import { minusIPlusTensorProbability } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/minus-i-plus-tensor-probability";
import { noInteractionMeansNoEntanglement } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/no-interaction-means-no-entanglement";
import { onePlusVsPlusOneTensorOrder } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/one-plus-vs-plus-one-tensor-order";
import { phaseOnQubitZeroConcentration } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/phase-on-qubit-zero-concentration";
import { psiMinusPostMeasurementOutcomeOne } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/psi-minus-post-measurement-outcome-one";
import { psiPlusFromZeroOneProbability } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/psi-plus-from-zero-one-probability";
import { qubit1MeasurementProbabilityAsymmetricState } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/qubit1-measurement-probability-asymmetric-state";
import { superdense01MessageDecodeProbability } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/superdense-01-message-decode-probability";
import { superdenseEntanglementFree25PercentExplanation } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/superdense-entanglement-free-25-percent-explanation";
import { superdenseNonOrthogonalMessagesConsequence } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/superdense-non-orthogonal-messages-consequence";
import { superdenseVsTeleportationSharedResource } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/superdense-vs-teleportation-shared-resource";
import { tFourthPowerEqualsZ } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/t-fourth-power-equals-z";
import { teleportationCorrectionFor01 } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/teleportation-correction-for-01";
import { teleportationFinalPopulationMatchesMessage } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/teleportation-final-population-matches-message";
import { tensorProductBasisLabel } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/tensor-product-basis-label";
import { toffoliTCountOnTargetQubit } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/toffoli-t-count-on-target-qubit";
import { whichVariantStillGives00 } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/which-variant-still-gives-00";
import { whyAliceOutcomesAreAlwaysFair } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/why-alice-outcomes-are-always-fair";
import { whyBlankWireIsIdentity } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/why-blank-wire-is-identity";
import { whyCliffordAloneIsntUniversal } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/why-clifford-alone-isnt-universal";
import { whyCnotSquaredIsIdentity } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/why-cnot-squared-is-identity";
import { whyTestingBasisStatesIsntEnough } from "@/content/problems/quantum-computing/quantum-gates-and-circuits/why-testing-basis-states-isnt-enough";
import { amplitudesVsProbabilitiesMixture } from "@/content/problems/quantum-computing/qubits-and-quantum-states/amplitudes-vs-probabilities-mixture";
import { biasedQubitP1 } from "@/content/problems/quantum-computing/qubits-and-quantum-states/biased-qubit-p1";
import { blochPoint100State } from "@/content/problems/quantum-computing/qubits-and-quantum-states/bloch-point-1-0-0-state";
import { blochXCoordinateCalculation } from "@/content/problems/quantum-computing/qubits-and-quantum-states/bloch-x-coordinate-calculation";
import { blochZAfterSOnPlus } from "@/content/problems/quantum-computing/qubits-and-quantum-states/bloch-z-after-s-on-plus";
import { classifyIScaledPair } from "@/content/problems/quantum-computing/qubits-and-quantum-states/classify-i-scaled-pair";
import { conjugateSymmetryOfInnerProduct } from "@/content/problems/quantum-computing/qubits-and-quantum-states/conjugate-symmetry-of-inner-product";
import { constructiveInterferenceAmplitudeSum } from "@/content/problems/quantum-computing/qubits-and-quantum-states/constructive-interference-amplitude-sum";
import { equatorStatesSameThetaDifferentPhi } from "@/content/problems/quantum-computing/qubits-and-quantum-states/equator-states-same-theta-different-phi";
import { fourSGatesSandwiched } from "@/content/problems/quantum-computing/qubits-and-quantum-states/four-s-gates-sandwiched";
import { hxhIdentity } from "@/content/problems/quantum-computing/qubits-and-quantum-states/hxh-identity";
import { modulusOf3Minus4i } from "@/content/problems/quantum-computing/qubits-and-quantum-states/modulus-of-3-minus-4i";
import { pPlusAtTwoThirdsPiPhase } from "@/content/problems/quantum-computing/qubits-and-quantum-states/p-plus-at-two-thirds-pi-phase";
import { pPlusForKnownAmplitudes } from "@/content/problems/quantum-computing/qubits-and-quantum-states/p-plus-for-known-amplitudes";
import { p0AfterHSHOnZero } from "@/content/problems/quantum-computing/qubits-and-quantum-states/p0-after-h-s-h-on-zero";
import { phaseOf1PlusI } from "@/content/problems/quantum-computing/qubits-and-quantum-states/phase-of-1-plus-i";
import { phaseOfProductOfTwoPhases } from "@/content/problems/quantum-computing/qubits-and-quantum-states/phase-of-product-of-two-phases";
import { plusStateMeasurementProbability } from "@/content/problems/quantum-computing/qubits-and-quantum-states/plus-state-measurement-probability";
import { rzPiOnPlusState } from "@/content/problems/quantum-computing/qubits-and-quantum-states/rz-pi-on-plus-state";
import { singleAmplitudePhaseArgument } from "@/content/problems/quantum-computing/qubits-and-quantum-states/single-amplitude-phase-argument";
import { stateWithCertainPlusOutcome } from "@/content/problems/quantum-computing/qubits-and-quantum-states/state-with-certain-plus-outcome";
import { superpositionVsClassicalUncertainty } from "@/content/problems/quantum-computing/qubits-and-quantum-states/superposition-vs-classical-uncertainty";
import { thetaPreservedUnderRz } from "@/content/problems/quantum-computing/qubits-and-quantum-states/theta-preserved-under-rz";
import { whichStateFailsNormalization } from "@/content/problems/quantum-computing/qubits-and-quantum-states/which-state-fails-normalization";
import { whyOrthonormalityLetsTermsCancel } from "@/content/problems/quantum-computing/qubits-and-quantum-states/why-orthonormality-lets-terms-cancel";
import { whyRepeatedMeasurementFails } from "@/content/problems/quantum-computing/qubits-and-quantum-states/why-repeated-measurement-fails";
import { whyRxNeedsFullTurnOnOne } from "@/content/problems/quantum-computing/qubits-and-quantum-states/why-rx-needs-full-turn-on-one";
import { whyTEightReturnsExactly } from "@/content/problems/quantum-computing/qubits-and-quantum-states/why-t-eight-returns-exactly";
import { zOnPlusState } from "@/content/problems/quantum-computing/qubits-and-quantum-states/z-on-plus-state";
import { zeroPlusInnerProduct } from "@/content/problems/quantum-computing/qubits-and-quantum-states/zero-plus-inner-product";
import { durationVsAmplitudeControl } from "@/content/problems/quantum-hardware/control-and-readout/duration-vs-amplitude-control";
import { expectedReadoutErrors99Percent } from "@/content/problems/quantum-hardware/control-and-readout/expected-readout-errors-99-percent";
import { higherFrequencyLowerOccupation } from "@/content/problems/quantum-hardware/control-and-readout/higher-frequency-lower-occupation";
import { miscalibrationPercentageError } from "@/content/problems/quantum-hardware/control-and-readout/miscalibration-percentage-error";
import { occupationAt50Mk } from "@/content/problems/quantum-hardware/control-and-readout/occupation-at-50mk";
import { pulseDurationForPiOver2 } from "@/content/problems/quantum-hardware/control-and-readout/pulse-duration-for-pi-over-2";
import { readoutVsGateErrorTiming } from "@/content/problems/quantum-hardware/control-and-readout/readout-vs-gate-error-timing";
import { recoverOmegaFromScan } from "@/content/problems/quantum-hardware/control-and-readout/recover-omega-from-scan";
import { why4kInsufficient } from "@/content/problems/quantum-hardware/control-and-readout/why-4k-insufficient";
import { whyDispersiveNotDirect } from "@/content/problems/quantum-hardware/control-and-readout/why-dispersive-not-direct";
import { whyP1UsesHalfAngle } from "@/content/problems/quantum-hardware/control-and-readout/why-p1-uses-half-angle";
import { classifyCoherentErrors } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/classify-coherent-errors";
import { crosstalkFidelityAt01 } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/crosstalk-fidelity-at-0.1";
import { crosstalkVsT1T2Distinction } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/crosstalk-vs-t1t2-distinction";
import { gammaFor100UsT1 } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/gamma-for-100us-t1";
import { gatesUntil50PercentAt9999 } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/gates-until-50-percent-at-99.99";
import { maxT2ForGivenT1 } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/max-t2-for-given-t1";
import { multiplicativeNotAdditiveError } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/multiplicative-not-additive-error";
import { nisqMeaningCheck } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/nisq-meaning-check";
import { noiseSourceCatalogCheck } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/noise-source-catalog-check";
import { physicalQubitsFor10Logical } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/physical-qubits-for-10-logical";
import { successProbability500Gates } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/success-probability-500-gates";
import { whyClassificationMattersForMitigation } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/why-classification-matters-for-mitigation";
import { whyNisqFavorsVqeQaoa } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/why-nisq-favors-vqe-qaoa";
import { whyT1NecessarilyDephases } from "@/content/problems/quantum-hardware/noise-decoherence-and-scaling/why-t1-necessarily-dephases";
import { gateTimeVsCoherenceRatio } from "@/content/problems/quantum-hardware/physical-qubit-platforms/gate-time-vs-coherence-ratio";
import { hypotheticalDeviceGateBudget } from "@/content/problems/quantum-hardware/physical-qubit-platforms/hypothetical-device-gate-budget";
import { ionGateBudgetComputation } from "@/content/problems/quantum-hardware/physical-qubit-platforms/ion-gate-budget-computation";
import { isolationVsCouplingTradeoff } from "@/content/problems/quantum-hardware/physical-qubit-platforms/isolation-vs-coupling-tradeoff";
import { lossVsDecoherence } from "@/content/problems/quantum-hardware/physical-qubit-platforms/loss-vs-decoherence";
import { manufacturabilityIsntAutomaticallyDecisive } from "@/content/problems/quantum-hardware/physical-qubit-platforms/manufacturability-isnt-automatically-decisive";
import { photonEncodingOptions } from "@/content/problems/quantum-hardware/physical-qubit-platforms/photon-encoding-options";
import { piPulseDuration25Mhz } from "@/content/problems/quantum-hardware/physical-qubit-platforms/pi-pulse-duration-25mhz";
import { quantumDotParticleInBoxParallel } from "@/content/problems/quantum-hardware/physical-qubit-platforms/quantum-dot-particle-in-box-parallel";
import { recommendPlatformForNetworking } from "@/content/problems/quantum-hardware/physical-qubit-platforms/recommend-platform-for-networking";
import { rydbergBlockadeMechanism } from "@/content/problems/quantum-hardware/physical-qubit-platforms/rydberg-blockade-mechanism";
import { sharedMotionalModeMechanism } from "@/content/problems/quantum-hardware/physical-qubit-platforms/shared-motional-mode-mechanism";
import { spinQubitScalabilitySource } from "@/content/problems/quantum-hardware/physical-qubit-platforms/spin-qubit-scalability-source";
import { tweezersVsGateLasers } from "@/content/problems/quantum-hardware/physical-qubit-platforms/tweezers-vs-gate-lasers";
import { whyJosephsonJunctionNeeded } from "@/content/problems/quantum-hardware/physical-qubit-platforms/why-josephson-junction-needed";
import { whyOpticalTweezersWorkForNeutralAtoms } from "@/content/problems/quantum-hardware/physical-qubit-platforms/why-optical-tweezers-work-for-neutral-atoms";
import { whyPhotonPhotonGatesAreHard } from "@/content/problems/quantum-hardware/physical-qubit-platforms/why-photon-photon-gates-are-hard";
import { whyStaticFieldsCantTrap } from "@/content/problems/quantum-hardware/physical-qubit-platforms/why-static-fields-cant-trap";
import { bbbvScopeMultipleChoice } from "@/content/problems/quantum-mastery/advanced-algorithms-and-complexity/bbbv-scope-multiple-choice";
import { classicalVarianceIndependenceMc } from "@/content/problems/quantum-mastery/advanced-algorithms-and-complexity/classical-variance-independence-mc";
import { commutingTermsZeroError } from "@/content/problems/quantum-mastery/advanced-algorithms-and-complexity/commuting-terms-zero-error";
import { djClassicalQueriesN12 } from "@/content/problems/quantum-mastery/advanced-algorithms-and-complexity/dj-classical-queries-n12";
import { gradientVarianceAtN4Recall } from "@/content/problems/quantum-mastery/advanced-algorithms-and-complexity/gradient-variance-at-n4-recall";
import { qpeBestEstimateProbabilityPhi15 } from "@/content/problems/quantum-mastery/advanced-algorithms-and-complexity/qpe-best-estimate-probability-phi-1-5";
import { qpeTailBoundAtJ5 } from "@/content/problems/quantum-mastery/advanced-algorithms-and-complexity/qpe-tail-bound-at-j5";
import { quantumWalkDisplacementAt10000 } from "@/content/problems/quantum-mastery/advanced-algorithms-and-complexity/quantum-walk-displacement-at-10000";
import { threeWallsClassificationMc } from "@/content/problems/quantum-mastery/advanced-algorithms-and-complexity/three-walls-classification-mc";
import { trotterStepsForTargetError } from "@/content/problems/quantum-mastery/advanced-algorithms-and-complexity/trotter-steps-for-target-error";
import { whyShorsEvadesWallOne } from "@/content/problems/quantum-mastery/advanced-algorithms-and-complexity/why-shors-evades-wall-one";
import { zeroMeanNotSufficientMc } from "@/content/problems/quantum-mastery/advanced-algorithms-and-complexity/zero-mean-not-sufficient-mc";
import { dirichletKernelPeakHeight } from "@/content/problems/quantum-mastery/hilbert-space-and-spectral-theory/dirichlet-kernel-peak-height";
import { fourthRungOfTheLadder } from "@/content/problems/quantum-mastery/hilbert-space-and-spectral-theory/fourth-rung-of-the-ladder";
import { freeParticleGreensFunctionMagnitude } from "@/content/problems/quantum-mastery/hilbert-space-and-spectral-theory/free-particle-greens-function-magnitude";
import { halfLineDeficiencyNormalization } from "@/content/problems/quantum-mastery/hilbert-space-and-spectral-theory/half-line-deficiency-normalization";
import { infiniteWellOrthogonalityCheck } from "@/content/problems/quantum-mastery/hilbert-space-and-spectral-theory/infinite-well-orthogonality-check";
import { infiniteWellPoleLocation } from "@/content/problems/quantum-mastery/hilbert-space-and-spectral-theory/infinite-well-pole-location";
import { pvmOutcomeProbability } from "@/content/problems/quantum-mastery/hilbert-space-and-spectral-theory/pvm-outcome-probability";
import { symmetricVersusSelfAdjoint } from "@/content/problems/quantum-mastery/hilbert-space-and-spectral-theory/symmetric-versus-self-adjoint";
import { whyPPDiverges } from "@/content/problems/quantum-mastery/hilbert-space-and-spectral-theory/why-p-p-diverges";
import { whyStaircaseGivesASum } from "@/content/problems/quantum-mastery/hilbert-space-and-spectral-theory/why-staircase-gives-a-sum";
import { whyTheShortcutsNeverFailed } from "@/content/problems/quantum-mastery/hilbert-space-and-spectral-theory/why-the-shortcuts-never-failed";
import { whyUZeroKillsTheBoundaryTerm } from "@/content/problems/quantum-mastery/hilbert-space-and-spectral-theory/why-u-zero-kills-the-boundary-term";
import { averageTeleportationFidelity } from "@/content/problems/quantum-mastery/quantum-information-theory/average-teleportation-fidelity";
import { choiBlockEigenvalueAtGamma } from "@/content/problems/quantum-mastery/quantum-information-theory/choi-block-eigenvalue-at-gamma";
import { coherenceDecayRateHalfPopulation } from "@/content/problems/quantum-mastery/quantum-information-theory/coherence-decay-rate-half-population";
import { combinedT2FromTwoProcesses } from "@/content/problems/quantum-mastery/quantum-information-theory/combined-t2-from-two-processes";
import { cssCommutationCondition } from "@/content/problems/quantum-mastery/quantum-information-theory/css-commutation-condition";
import { fuchsVanDeGraafPureEquality } from "@/content/problems/quantum-mastery/quantum-information-theory/fuchs-van-de-graaf-pure-equality";
import { purificationUnitaryFreedom } from "@/content/problems/quantum-mastery/quantum-information-theory/purification-unitary-freedom";
import { relativeEntropyNearPure } from "@/content/problems/quantum-mastery/quantum-information-theory/relative-entropy-near-pure";
import { schmidtCoefficientsToEntropy } from "@/content/problems/quantum-mastery/quantum-information-theory/schmidt-coefficients-to-entropy";
import { steaneCodespaceDimension } from "@/content/problems/quantum-mastery/quantum-information-theory/steane-codespace-dimension";
import { superdenseLambdaForTargetSuccess } from "@/content/problems/quantum-mastery/quantum-information-theory/superdense-lambda-for-target-success";
import { traceDistanceAtHalfDamping } from "@/content/problems/quantum-mastery/quantum-information-theory/trace-distance-at-half-damping";
import { wernerConcurrenceAtHalf } from "@/content/problems/quantum-mastery/quantum-information-theory/werner-concurrence-at-half";
import { zeroEigenvalueStillCp } from "@/content/problems/quantum-mastery/quantum-information-theory/zero-eigenvalue-still-cp";
import { capacityEntanglementBreakingThreshold } from "@/content/problems/quantum-mastery/quantum-shannon-theory/capacity-entanglement-breaking-threshold";
import { dataProcessingLoccEntanglement } from "@/content/problems/quantum-mastery/quantum-shannon-theory/data-processing-locc-entanglement";
import { dataProcessingMutualInformationAtLambda } from "@/content/problems/quantum-mastery/quantum-shannon-theory/data-processing-mutual-information-at-lambda";
import { distillationRateFromEntanglementEntropy } from "@/content/problems/quantum-mastery/quantum-shannon-theory/distillation-rate-from-entanglement-entropy";
import { holevoChiBb84AtP } from "@/content/problems/quantum-mastery/quantum-shannon-theory/holevo-chi-bb84-at-p";
import { mutualInformationClassicalCorrelation } from "@/content/problems/quantum-mastery/quantum-shannon-theory/mutual-information-classical-correlation";
import { negativeConditionalEntropyExplanation } from "@/content/problems/quantum-mastery/quantum-shannon-theory/negative-conditional-entropy-explanation";
import { normalizingAFourOutcomeQubitPovm } from "@/content/problems/quantum-mastery/quantum-shannon-theory/normalizing-a-four-outcome-qubit-povm";
import { stinespringEnvironmentOutcomeProbability } from "@/content/problems/quantum-mastery/quantum-shannon-theory/stinespring-environment-outcome-probability";
import { stinespringKrausNonuniquenessEntry } from "@/content/problems/quantum-mastery/quantum-shannon-theory/stinespring-kraus-nonuniqueness-entry";
import { typicalSubspaceProbabilityMass } from "@/content/problems/quantum-mastery/quantum-shannon-theory/typical-subspace-probability-mass";
import { unambiguousDiscriminationSuccessProbability } from "@/content/problems/quantum-mastery/quantum-shannon-theory/unambiguous-discrimination-success-probability";
import { twoPToThreePSplittingRatio } from "@/content/problems/quantum-mastery/symmetry-scattering-and-semiclassical-methods/2p-to-3p-splitting-ratio";
import { threePSpinOrbitSplitting } from "@/content/problems/quantum-mastery/symmetry-scattering-and-semiclassical-methods/3p-spin-orbit-splitting";
import { berryPhaseAt90Degrees } from "@/content/problems/quantum-mastery/symmetry-scattering-and-semiclassical-methods/berry-phase-at-90-degrees";
import { cgCoefficientValue } from "@/content/problems/quantum-mastery/symmetry-scattering-and-semiclassical-methods/cg-coefficient-value";
import { coherentStateMeanPhotonNumber } from "@/content/problems/quantum-mastery/symmetry-scattering-and-semiclassical-methods/coherent-state-mean-photon-number";
import { crossSectionRatioAtKa1 } from "@/content/problems/quantum-mastery/symmetry-scattering-and-semiclassical-methods/cross-section-ratio-at-ka-1";
import { dynamicalEqualsGeometricPhaseDuration } from "@/content/problems/quantum-mastery/symmetry-scattering-and-semiclassical-methods/dynamical-equals-geometric-phase-duration";
import { hardSphereCrossSectionAtKaHalf } from "@/content/problems/quantum-mastery/symmetry-scattering-and-semiclassical-methods/hard-sphere-cross-section-at-ka-half";
import { j1j1TopMultipletSize } from "@/content/problems/quantum-mastery/symmetry-scattering-and-semiclassical-methods/j1-j1-top-multiplet-size";
import { squeezedStateDeltaXAtR1 } from "@/content/problems/quantum-mastery/symmetry-scattering-and-semiclassical-methods/squeezed-state-delta-x-at-r-1";
import { whyBerryPhaseIsRateIndependent } from "@/content/problems/quantum-mastery/symmetry-scattering-and-semiclassical-methods/why-berry-phase-is-rate-independent";
import { wkbAsQuantizedAdiabaticInvariant } from "@/content/problems/quantum-mastery/symmetry-scattering-and-semiclassical-methods/wkb-as-quantized-adiabatic-invariant";
import { amplitudeDampingTraceCheck } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/amplitude-damping-trace-check";
import { channelsReusedInHardwarePillar } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/channels-reused-in-hardware-pillar";
import { compositionLawRelativeError } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/composition-law-relative-error";
import { decoherenceVsCollapse } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/decoherence-vs-collapse";
import { euclideanPropagatorAtOrigin } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/euclidean-propagator-at-origin";
import { identifyingInvalidKrausSet } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/identifying-invalid-kraus-set";
import { longRunPurityLimit } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/long-run-purity-limit";
import { offDiagonalAfterThreeApplications } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/off-diagonal-after-three-applications";
import { statingTheMeasurementOverclaim } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/stating-the-measurement-overclaim";
import { strongestConsistencyEvidence } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/strongest-consistency-evidence";
import { unitaryAsSpecialKrausCase } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/unitary-as-special-kraus-case";
import { whyWickRotationHelps } from "@/content/problems/quantum-mechanics/advanced-quantum-mechanics/why-wick-rotation-helps";
import { allowedMValuesForJThreeHalves } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/allowed-m-values-for-j-three-halves";
import { groundStateAngularDependence } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/ground-state-angular-dependence";
import { jRaisingOperatorTopState } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/j-raising-operator-top-state";
import { jxJyCommutatorJ2 } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/jx-jy-commutator-j2";
import { lEquals2DegeneracyCount } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/l-equals-2-degeneracy-count";
import { repeatedSameAxisMeasurement } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/repeated-same-axis-measurement";
import { sequentialSgJointProbability } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/sequential-sg-joint-probability";
import { singletMatchesBellState } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/singlet-matches-bell-state";
import { spinSquaredEigenvalue } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/spin-squared-eigenvalue";
import { tripletUpJzEigenvalue } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/triplet-up-jz-eigenvalue";
import { verifyLxLyCommutatorSign } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/verify-lx-ly-commutator-sign";
import { whyHalfIntegerLExcluded } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/why-half-integer-l-excluded";
import { whySpinHasNoPositionWavefunction } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/why-spin-has-no-position-wavefunction";
import { y00NormalizationCheck } from "@/content/problems/quantum-mechanics/angular-momentum-and-spin/y00-normalization-check";
import { anharmonicFirstOrderShift } from "@/content/problems/quantum-mechanics/approximation-methods/anharmonic-first-order-shift";
import { badWidthGivesWorseBound } from "@/content/problems/quantum-mechanics/approximation-methods/bad-width-gives-worse-bound";
import { provingTheVariationalTheorem } from "@/content/problems/quantum-mechanics/approximation-methods/proving-the-variational-theorem";
import { strongCouplingBreakdownGap } from "@/content/problems/quantum-mechanics/approximation-methods/strong-coupling-breakdown-gap";
import { transitionProbabilityWeakCoupling } from "@/content/problems/quantum-mechanics/approximation-methods/transition-probability-weak-coupling";
import { unitarityBoundsTransitionProbability } from "@/content/problems/quantum-mechanics/approximation-methods/unitarity-bounds-transition-probability";
import { variationalEnergyNeverBelowExact } from "@/content/problems/quantum-mechanics/approximation-methods/variational-energy-never-below-exact";
import { whyGroundStateSecondOrderIsNegative } from "@/content/problems/quantum-mechanics/approximation-methods/why-ground-state-second-order-is-negative";
import { whyTheMaslovHalfMatters } from "@/content/problems/quantum-mechanics/approximation-methods/why-the-maslov-half-matters";
import { wkbEnergyForNEquals2 } from "@/content/problems/quantum-mechanics/approximation-methods/wkb-energy-for-n-equals-2";
import { wkbExactnessIsSpecialToSho } from "@/content/problems/quantum-mechanics/approximation-methods/wkb-exactness-is-special-to-sho";
import { wrongBasisForPerturbationMatrix } from "@/content/problems/quantum-mechanics/approximation-methods/wrong-basis-for-perturbation-matrix";
import { basisDependenceOfInterference } from "@/content/problems/quantum-mechanics/classical-to-quantum/basis-dependence-of-interference";
import { classicalOscillatorEnergy } from "@/content/problems/quantum-mechanics/classical-to-quantum/classical-oscillator-energy";
import { classicalSumComparison } from "@/content/problems/quantum-mechanics/classical-to-quantum/classical-sum-comparison";
import { commutatorAntisymmetry } from "@/content/problems/quantum-mechanics/classical-to-quantum/commutator-antisymmetry";
import { commutingObservablesNoTradeoff } from "@/content/problems/quantum-mechanics/classical-to-quantum/commuting-observables-no-tradeoff";
import { crossBasisProbability } from "@/content/problems/quantum-mechanics/classical-to-quantum/cross-basis-probability";
import { epistemicVsQuantumProbability } from "@/content/problems/quantum-mechanics/classical-to-quantum/epistemic-vs-quantum-probability";
import { fullyDestructiveCrossBasis } from "@/content/problems/quantum-mechanics/classical-to-quantum/fully-destructive-cross-basis";
import { generatorMustBeHermitian } from "@/content/problems/quantum-mechanics/classical-to-quantum/generator-must-be-hermitian";
import { harmonicOscillatorEnergyLevel } from "@/content/problems/quantum-mechanics/classical-to-quantum/harmonic-oscillator-energy-level";
import { ladderLoweringCoefficient } from "@/content/problems/quantum-mechanics/classical-to-quantum/ladder-lowering-coefficient";
import { minimumMomentumUncertainty } from "@/content/problems/quantum-mechanics/classical-to-quantum/minimum-momentum-uncertainty";
import { observableOperatorType } from "@/content/problems/quantum-mechanics/classical-to-quantum/observable-operator-type";
import { phaseForEqualPredictions } from "@/content/problems/quantum-mechanics/classical-to-quantum/phase-for-equal-predictions";
import { postulateExpectationValue } from "@/content/problems/quantum-mechanics/classical-to-quantum/postulate-expectation-value";
import { postulateProbabilityCalculation } from "@/content/problems/quantum-mechanics/classical-to-quantum/postulate-probability-calculation";
import { quantumInterferenceCalculation } from "@/content/problems/quantum-mechanics/classical-to-quantum/quantum-interference-calculation";
import { qubitAsInstanceOfPostulates } from "@/content/problems/quantum-mechanics/classical-to-quantum/qubit-as-instance-of-postulates";
import { rabiProbabilityAtTime } from "@/content/problems/quantum-mechanics/classical-to-quantum/rabi-probability-at-time";
import { stationaryProbabilityCheck } from "@/content/problems/quantum-mechanics/classical-to-quantum/stationary-probability-check";
import { threeQubitDimensionSynthesis } from "@/content/problems/quantum-mechanics/classical-to-quantum/three-qubit-dimension-synthesis";
import { uncertaintyBoundYZ } from "@/content/problems/quantum-mechanics/classical-to-quantum/uncertainty-bound-yz";
import { uncertaintyOfYInPlusState } from "@/content/problems/quantum-mechanics/classical-to-quantum/uncertainty-of-y-in-plus-state";
import { whatPhaseProvides } from "@/content/problems/quantum-mechanics/classical-to-quantum/what-phase-provides";
import { whyEnergyIsConserved } from "@/content/problems/quantum-mechanics/classical-to-quantum/why-energy-is-conserved";
import { whyGatesAreUnitary } from "@/content/problems/quantum-mechanics/classical-to-quantum/why-gates-are-unitary";
import { zeroPointEnergy } from "@/content/problems/quantum-mechanics/classical-to-quantum/zero-point-energy";
import { antisymmetricEigenvalueCheck } from "@/content/problems/quantum-mechanics/identical-particles/antisymmetric-eigenvalue-check";
import { bosonsVsFermionsClustering } from "@/content/problems/quantum-mechanics/identical-particles/bosons-vs-fermions-clustering";
import { oxygen2pElectronCount } from "@/content/problems/quantum-mechanics/identical-particles/oxygen-2p-electron-count";
import { photonVsElectronStatistics } from "@/content/problems/quantum-mechanics/identical-particles/photon-vs-electron-statistics";
import { possibleExchangeEigenvalues } from "@/content/problems/quantum-mechanics/identical-particles/possible-exchange-eigenvalues";
import { productStateNotEigenstate } from "@/content/problems/quantum-mechanics/identical-particles/product-state-not-eigenstate";
import { quantumVsClassicalIndistinguishability } from "@/content/problems/quantum-mechanics/identical-particles/quantum-vs-classical-indistinguishability";
import { sameOrbitalOppositeSpinAllowed } from "@/content/problems/quantum-mechanics/identical-particles/same-orbital-opposite-spin-allowed";
import { shellCapacityNEquals4 } from "@/content/problems/quantum-mechanics/identical-particles/shell-capacity-n-equals-4";
import { whyFillingOrderDeviates } from "@/content/problems/quantum-mechanics/identical-particles/why-filling-order-deviates";
import { whyNormalizationDiffers } from "@/content/problems/quantum-mechanics/identical-particles/why-normalization-differs";
import { zeroVectorIsExact } from "@/content/problems/quantum-mechanics/identical-particles/zero-vector-is-exact";
import { bornRuleProbability } from "@/content/problems/quantum-mechanics/mathematical-foundations/born-rule-probability";
import { cauchySchwarzCheck } from "@/content/problems/quantum-mechanics/mathematical-foundations/cauchy-schwarz-check";
import { completenessRelationSandwich } from "@/content/problems/quantum-mechanics/mathematical-foundations/completeness-relation-sandwich";
import { complexModulus } from "@/content/problems/quantum-mechanics/mathematical-foundations/complex-modulus";
import { compositeSystemDimension } from "@/content/problems/quantum-mechanics/mathematical-foundations/composite-system-dimension";
import { eulersIdentity } from "@/content/problems/quantum-mechanics/mathematical-foundations/eulers-identity";
import { expectationValueCalculation } from "@/content/problems/quantum-mechanics/mathematical-foundations/expectation-value-calculation";
import { expectationValueFromProbabilities } from "@/content/problems/quantum-mechanics/mathematical-foundations/expectation-value-from-probabilities";
import { globalPhaseInvariance } from "@/content/problems/quantum-mechanics/mathematical-foundations/global-phase-invariance";
import { identifyHermitianMatrix } from "@/content/problems/quantum-mechanics/mathematical-foundations/identify-hermitian-matrix";
import { linearIndependenceCheck } from "@/content/problems/quantum-mechanics/mathematical-foundations/linear-independence-check";
import { matrixProductEntry } from "@/content/problems/quantum-mechanics/mathematical-foundations/matrix-product-entry";
import { nonInvertibleMatrix } from "@/content/problems/quantum-mechanics/mathematical-foundations/non-invertible-matrix";
import { outerProductType } from "@/content/problems/quantum-mechanics/mathematical-foundations/outer-product-type";
import { pauliXEigenvalueSum } from "@/content/problems/quantum-mechanics/mathematical-foundations/pauli-x-eigenvalue-sum";
import { pauliZEigenvalueProduct } from "@/content/problems/quantum-mechanics/mathematical-foundations/pauli-z-eigenvalue-product";
import { plusMinusOrthogonality } from "@/content/problems/quantum-mechanics/mathematical-foundations/plus-minus-orthogonality";
import { realDimensionOfComplexSpace } from "@/content/problems/quantum-mechanics/mathematical-foundations/real-dimension-of-complex-space";
import { synthesisEigenvalueFromTraceDet } from "@/content/problems/quantum-mechanics/mathematical-foundations/synthesis-eigenvalue-from-trace-det";
import { synthesisHermitianAndUnitary } from "@/content/problems/quantum-mechanics/mathematical-foundations/synthesis-hermitian-and-unitary";
import { synthesisMeasurementPostulates } from "@/content/problems/quantum-mechanics/mathematical-foundations/synthesis-measurement-postulates";
import { unitaryDefiningProperty } from "@/content/problems/quantum-mechanics/mathematical-foundations/unitary-defining-property";
import { unitaryEigenvalueModulus } from "@/content/problems/quantum-mechanics/mathematical-foundations/unitary-eigenvalue-modulus";
import { whyEntanglementIsGeneric } from "@/content/problems/quantum-mechanics/mathematical-foundations/why-entanglement-is-generic";
import { barrierTransmissionCalculation } from "@/content/problems/quantum-mechanics/one-dimensional-systems/barrier-transmission-calculation";
import { energyAboveWellFloor } from "@/content/problems/quantum-mechanics/one-dimensional-systems/energy-above-well-floor";
import { finiteWellGroundStateCalculation } from "@/content/problems/quantum-mechanics/one-dimensional-systems/finite-well-ground-state-calculation";
import { secondResonantWidth } from "@/content/problems/quantum-mechanics/one-dimensional-systems/second-resonant-width";
import { stepScatteringCalculation } from "@/content/problems/quantum-mechanics/one-dimensional-systems/step-scattering-calculation";
import { synthesisBoundVsContinuousSpectrum } from "@/content/problems/quantum-mechanics/one-dimensional-systems/synthesis-bound-vs-continuous-spectrum";
import { synthesisTunnelingVsResonanceRegimes } from "@/content/problems/quantum-mechanics/one-dimensional-systems/synthesis-tunneling-vs-resonance-regimes";
import { synthesisWellDepthAndBoundStateCount } from "@/content/problems/quantum-mechanics/one-dimensional-systems/synthesis-well-depth-and-bound-state-count";
import { tangentBranchDivergencePoint } from "@/content/problems/quantum-mechanics/one-dimensional-systems/tangent-branch-divergence-point";
import { whatIsActuallyBounded } from "@/content/problems/quantum-mechanics/one-dimensional-systems/what-is-actually-bounded";
import { whyFiniteWellAlwaysBinds } from "@/content/problems/quantum-mechanics/one-dimensional-systems/why-finite-well-always-binds";
import { whyNoClosedFormFiniteWell } from "@/content/problems/quantum-mechanics/one-dimensional-systems/why-no-closed-form-finite-well";
import { whyReflectionAlwaysPositive } from "@/content/problems/quantum-mechanics/one-dimensional-systems/why-reflection-always-positive";
import { whyResonanceDependsOnK2L } from "@/content/problems/quantum-mechanics/one-dimensional-systems/why-resonance-depends-on-k2l";
import { bellStateZ0MeasurementProbability } from "@/content/problems/quantum-mechanics/operators-observables-measurement/bell-state-z0-measurement-probability";
import { characteristicTimescaleCalculation } from "@/content/problems/quantum-mechanics/operators-observables-measurement/characteristic-timescale-calculation";
import { degenerateMeasurementProbability } from "@/content/problems/quantum-mechanics/operators-observables-measurement/degenerate-measurement-probability";
import { distinctJointEigenvaluePairs } from "@/content/problems/quantum-mechanics/operators-observables-measurement/distinct-joint-eigenvalue-pairs";
import { minimumTimescaleFromEnergySpread } from "@/content/problems/quantum-mechanics/operators-observables-measurement/minimum-timescale-from-energy-spread";
import { postMeasurementStateComponent } from "@/content/problems/quantum-mechanics/operators-observables-measurement/post-measurement-state-component";
import { sequentialMeasurementProbability } from "@/content/problems/quantum-mechanics/operators-observables-measurement/sequential-measurement-probability";
import { sharedEigenbasisImpliesCommuteRecap } from "@/content/problems/quantum-mechanics/operators-observables-measurement/shared-eigenbasis-implies-commute-recap";
import { stationaryStateInfiniteTimescale } from "@/content/problems/quantum-mechanics/operators-observables-measurement/stationary-state-infinite-timescale";
import { synthesisNotAStrictGeneralization } from "@/content/problems/quantum-mechanics/operators-observables-measurement/synthesis-not-a-strict-generalization";
import { synthesisRepeatedMeasurementCertainty } from "@/content/problems/quantum-mechanics/operators-observables-measurement/synthesis-repeated-measurement-certainty";
import { synthesisWhatCompleteMeans } from "@/content/problems/quantum-mechanics/operators-observables-measurement/synthesis-what-complete-means";
import { synthesisZeroEnergyUncertaintyConsequence } from "@/content/problems/quantum-mechanics/operators-observables-measurement/synthesis-zero-energy-uncertainty-consequence";
import { traceOfProjectorEqualsDegeneracy } from "@/content/problems/quantum-mechanics/operators-observables-measurement/trace-of-projector-equals-degeneracy";
import { whichPairCommutes } from "@/content/problems/quantum-mechanics/operators-observables-measurement/which-pair-commutes";
import { whyCollapseUsesWholeProjector } from "@/content/problems/quantum-mechanics/operators-observables-measurement/why-collapse-uses-whole-projector";
import { whyDifferentFactorObservablesCommute } from "@/content/problems/quantum-mechanics/operators-observables-measurement/why-different-factor-observables-commute";
import { whyGroupDegenerateEigenvectors } from "@/content/problems/quantum-mechanics/operators-observables-measurement/why-group-degenerate-eigenvectors";
import { whyOneObservableMayNotSuffice } from "@/content/problems/quantum-mechanics/operators-observables-measurement/why-one-observable-may-not-suffice";
import { whyOutcomeIndependentDisturbance } from "@/content/problems/quantum-mechanics/operators-observables-measurement/why-outcome-independent-disturbance";
import { xzCommutatorEntry } from "@/content/problems/quantum-mechanics/operators-observables-measurement/xz-commutator-entry";
import { balmerAlphaTransitionEnergy } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/balmer-alpha-transition-energy";
import { bohrRadiusAgreementMeaning } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/bohr-radius-agreement-meaning";
import { centrifugalTermForLEquals2 } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/centrifugal-term-for-l-equals-2";
import { fineStructureTwoEffects } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/fine-structure-two-effects";
import { lzL2CommutatorNumerically } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/lz-l2-commutator-numerically";
import { nEquals2TotalDegeneracy } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/n-equals-2-total-degeneracy";
import { nEquals3OrbitalCount } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/n-equals-3-orbital-count";
import { psi1sNormalizationFromFactors } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/psi-1s-normalization-from-factors";
import { sStatesHaveNoCentrifugalBarrier } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/s-states-have-no-centrifugal-barrier";
import { uVsRBoundaryCondition } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/u-vs-r-boundary-condition";
import { whatFineStructureBreaks } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/what-fine-structure-breaks";
import { whichPotentialsAreCentral } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/which-potentials-are-central";
import { whyCoulombEnergyIgnoresL } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/why-coulomb-energy-ignores-l";
import { whyHCommutesWithLz } from "@/content/problems/quantum-mechanics/the-hydrogen-atom/why-h-commutes-with-lz";
import { amplitudeDensityVsProbability } from "@/content/problems/quantum-mechanics/wave-mechanics/amplitude-density-vs-probability";
import { commutatorAntisymmetryPositionMomentum } from "@/content/problems/quantum-mechanics/wave-mechanics/commutator-antisymmetry-position-momentum";
import { dispersionFormulaCalculation } from "@/content/problems/quantum-mechanics/wave-mechanics/dispersion-formula-calculation";
import { ehrenfestSecondTheorem } from "@/content/problems/quantum-mechanics/wave-mechanics/ehrenfest-second-theorem";
import { groupVelocityCalculation } from "@/content/problems/quantum-mechanics/wave-mechanics/group-velocity-calculation";
import { harmonicGroundStateEnergy } from "@/content/problems/quantum-mechanics/wave-mechanics/harmonic-ground-state-energy";
import { harmonicLevelSpacing } from "@/content/problems/quantum-mechanics/wave-mechanics/harmonic-level-spacing";
import { infiniteWellEnergyLevel } from "@/content/problems/quantum-mechanics/wave-mechanics/infinite-well-energy-level";
import { infiniteWellEnergyRatio } from "@/content/problems/quantum-mechanics/wave-mechanics/infinite-well-energy-ratio";
import { infiniteWellNodeCount } from "@/content/problems/quantum-mechanics/wave-mechanics/infinite-well-node-count";
import { kappaCalculation } from "@/content/problems/quantum-mechanics/wave-mechanics/kappa-calculation";
import { kineticTermForm } from "@/content/problems/quantum-mechanics/wave-mechanics/kinetic-term-form";
import { meanPositionTophat } from "@/content/problems/quantum-mechanics/wave-mechanics/mean-position-tophat";
import { momentumEigenvalueCalculation } from "@/content/problems/quantum-mechanics/wave-mechanics/momentum-eigenvalue-calculation";
import { momentumWidthFromPositionWidth } from "@/content/problems/quantum-mechanics/wave-mechanics/momentum-width-from-position-width";
import { probabilityInSubregion } from "@/content/problems/quantum-mechanics/wave-mechanics/probability-in-subregion";
import { stationaryPhaseCalculation } from "@/content/problems/quantum-mechanics/wave-mechanics/stationary-phase-calculation";
import { synthesisBeatFrequencyCalculation } from "@/content/problems/quantum-mechanics/wave-mechanics/synthesis-beat-frequency-calculation";
import { synthesisContinuumVsFiniteMapping } from "@/content/problems/quantum-mechanics/wave-mechanics/synthesis-continuum-vs-finite-mapping";
import { synthesisStationaryDensityConstant } from "@/content/problems/quantum-mechanics/wave-mechanics/synthesis-stationary-density-constant";
import { topHatNormalizationConstant } from "@/content/problems/quantum-mechanics/wave-mechanics/top-hat-normalization-constant";
import { transmissionQualitative } from "@/content/problems/quantum-mechanics/wave-mechanics/transmission-qualitative";
import { trotterErrorOrder } from "@/content/problems/quantum-mechanics/wave-mechanics/trotter-error-order";
import { uncertaintyProductGaussian } from "@/content/problems/quantum-mechanics/wave-mechanics/uncertainty-product-gaussian";
import { varianceTophat } from "@/content/problems/quantum-mechanics/wave-mechanics/variance-tophat";
import { wallheightDtProduct } from "@/content/problems/quantum-mechanics/wave-mechanics/wallheight-dt-product";
import { whyNormIsPreserved } from "@/content/problems/quantum-mechanics/wave-mechanics/why-norm-is-preserved";
import { whyPHatNeedsI } from "@/content/problems/quantum-mechanics/wave-mechanics/why-p-hat-needs-i";
import { whyPlaneWaveNotNormalizable } from "@/content/problems/quantum-mechanics/wave-mechanics/why-plane-wave-not-normalizable";
import { whySymmetricSplitBetter } from "@/content/problems/quantum-mechanics/wave-mechanics/why-symmetric-split-better";
import { circuitVqeMatchesExact } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/circuit-vqe-matches-exact";
import { confusionMatrixCorrection9590 } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/confusion-matrix-correction-95-90";
import { logicalResultUnchanged } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/logical-result-unchanged";
import { mitigationVsCorrectionWhatGetsRepaired } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/mitigation-vs-correction-what-gets-repaired";
import { notEveryGateNeedsThreeRotations } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/not-every-gate-needs-three-rotations";
import { onlyQuantumStep } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/only-quantum-step";
import { pennylaneFitsWhichStep } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/pennylane-fits-which-step";
import { swapOverhead14 } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/swap-overhead-1-4";
import { totalCnotEquivalentOps } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/total-cnot-equivalent-ops";
import { totalSwaps500Iterations } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/total-swaps-500-iterations";
import { twoImplementationsCrossCheck } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/two-implementations-cross-check";
import { verifyXDecomposition } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/verify-x-decomposition";
import { whyExactVsApproximateConvergence } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/why-exact-vs-approximate-convergence";
import { whyGlobalPhaseToleranceCorrect } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/why-global-phase-tolerance-correct";
import { zeroNoiseExtrapolationAtP01 } from "@/content/problems/quantum-software/compilation-and-hybrid-algorithms/zero-noise-extrapolation-at-p-0-1";
import { fourThousandOneThousandSplitExplanation } from "@/content/problems/quantum-software/programming-quantum-computers/4000-1000-split-explanation";
import { amplitudesFor20Qubits } from "@/content/problems/quantum-software/programming-quantum-computers/amplitudes-for-20-qubits";
import { ghzExactProbability } from "@/content/problems/quantum-software/programming-quantum-computers/ghz-exact-probability";
import { hzhEqualsXCheck } from "@/content/problems/quantum-software/programming-quantum-computers/hzh-equals-x-check";
import { oppositeFailureModes } from "@/content/problems/quantum-software/programming-quantum-computers/opposite-failure-modes";
import { pennylaneVqeFit } from "@/content/problems/quantum-software/programming-quantum-computers/pennylane-vqe-fit";
import { sameCapabilityDifferentErgonomics } from "@/content/problems/quantum-software/programming-quantum-computers/same-capability-different-ergonomics";
import { shotNoiseStandardDeviation10000 } from "@/content/problems/quantum-software/programming-quantum-computers/shot-noise-standard-deviation-10000";
import { whatABackendAbstracts } from "@/content/problems/quantum-software/programming-quantum-computers/what-a-backend-abstracts";
import { whenDoesStateChange } from "@/content/problems/quantum-software/programming-quantum-computers/when-does-state-change";
import { whyNoiseConfoundsDebugging } from "@/content/problems/quantum-software/programming-quantum-computers/why-noise-confounds-debugging";
import { whySeparationEnablesOptimization } from "@/content/problems/quantum-software/programming-quantum-computers/why-separation-enables-optimization";
import { exactVsSampledDistinction } from "@/content/problems/quantum-software/simulating-quantum-systems/exact-vs-sampled-distinction";
import { flopsFor1000Gates30Qubits } from "@/content/problems/quantum-software/simulating-quantum-systems/flops-for-1000-gates-30-qubits";
import { groverPoorFitForTensorNetworks } from "@/content/problems/quantum-software/simulating-quantum-systems/grover-poor-fit-for-tensor-networks";
import { hhWithDephasingP0 } from "@/content/problems/quantum-software/simulating-quantum-systems/hh-with-dephasing-p0";
import { memoryFor25Qubits } from "@/content/problems/quantum-software/simulating-quantum-systems/memory-for-25-qubits";
import { nameAPriorSimulationResult } from "@/content/problems/quantum-software/simulating-quantum-systems/name-a-prior-simulation-result";
import { purityNotStrictlyMonotonic } from "@/content/problems/quantum-software/simulating-quantum-systems/purity-not-strictly-monotonic";
import { simulatingVsBeingQuantum } from "@/content/problems/quantum-software/simulating-quantum-systems/simulating-vs-being-quantum";
import { tensorNetworksNotStrictlyBetter } from "@/content/problems/quantum-software/simulating-quantum-systems/tensor-networks-not-strictly-better";
import { whatTensorNetworksExploit } from "@/content/problems/quantum-software/simulating-quantum-systems/what-tensor-networks-exploit";
import { why2nIsFundamental } from "@/content/problems/quantum-software/simulating-quantum-systems/why-2n-is-fundamental";
import { whySingleQubitScope } from "@/content/problems/quantum-software/simulating-quantum-systems/why-single-qubit-scope";

export const PROBLEMS: Problem[] = [
  amplitudeEstimationGroverIterateProbability,
  amplitudeEstimationQpeFreeScalingMc,
  capstoneToolboxHonestUnificationMc,
  capstoneToolboxTrotterStepsT10,
  lcuPrepareRegisterSize,
  lcuSuccessProbabilityPlusState,
  linearSystemsPolynomialDegreeForTargetEpsilon,
  linearSystemsReadoutVsFullVector,
  qspD1PhaseSumRealPart,
  qspD2DegreeCollapseImaginaryPart,
  qsvtPolynomialValueAtASingularValue,
  qsvtVersusTrotterAsymptoticClaim,
  decodingDefectPairForABoundaryQubit,
  decodingThresholdScalingRatio,
  latticeSurgeryCnotMergeCount,
  latticeSurgeryTransversalGateFailure,
  magicStateDistillationRoundsNeeded,
  magicStateEastinKnillTransversalGates,
  resourceEstimationCodeDistanceForTighterBudget,
  resourceEstimationFactoryShareWithNineLogicalQubits,
  surfaceCodeGeneratorCountAtDistance5,
  thresholdConcatenationTwoLevels,
  thresholdDifferingValuesNotContradiction,
  whyStabilizerOverlapsAreAlwaysEven,
  capstoneClassifyRcsClaimMc,
  capstoneNpNotSubsetBqpConjecture,
  evaluatingAWorstCaseNpCompleteClaimMc,
  localHamiltonianPropagationTermNullSpaceMc,
  localHamiltonianVerificationPrecisionUnionBound,
  qmaAmplificationThreshold5Percent,
  qmaSoundnessQuantifierMc,
  queryComplexityAdversaryBoundN64,
  shorsAlgorithmDoesNotProvePNeqBqp,
  twoIndependentProofsOfGroverOptimalityMc,
  capstoneLandscapeHardwareClaimClassification,
  capstoneLandscapeTimelinePredictionEvaluation,
  classifyingTheOracleSpeedupAbstractMc,
  explainingTheOracleModelGap,
  quantumAdvantageHardVsUsefulTwoAxes,
  quantumAdvantageWeakClassicalBaselineMc,
  reproducibilityComponentsMissingMc,
  shotNoiseStandardErrorP75N300,
  theoremVsHeuristicClassifySurfaceCodeThreshold,
  theoremVsHeuristicQaoaVsGroverMc,
  areaLawMinimumBondDimension,
  capstonePipelineRoutedGateCountFewerSteps,
  capstonePipelineWhichStagesAreSettled,
  classicalSimulationBellPairBondDimension,
  classicalSimulationCliffordVsNonCliffordAdvantageCandidateMc,
  cliffordTRossSelingerTCountForEpsilon,
  cliffordTSolovayKitaevVersusOptimalMc,
  molecularSimulationElectronConfigurationCount,
  molecularSimulationPhaseEstimationOverlapCaveat,
  noiseAwareCompilationSuccessProbabilityMc,
  noiseAwareCompilationSwapOverheadAlternateRouting,
  wStateEntropyAndBondDimension,
  biasedMixturePurity,
  definingRequirementXCheck,
  deterministicLhvChshValue,
  diagnosingTheI4Counterexample,
  entropyOfSixtyFortyMixture,
  indistinguishableEnsembles,
  localityAssumptionNonlocalHv,
  maxConcurrenceImpliesMaximallyMixed,
  maximallyMixedInvarianceProof,
  measuringP1OnBiasedMixture,
  minusStateXExpectationViaRho,
  nearPureEntropyCalculation,
  oneStateDensityMatrixChoice,
  phaseInvarianceOfEntanglementMeasures,
  plusMinusMixtureIdentity,
  psiMinusConcurrence,
  psiMinusPurityViaIdentity,
  purityBetweenTwoKnownValues,
  purityFromConcurrence,
  sameAxisPerfectCorrelation,
  sameSettingsChshValue,
  superpositionVsMixture,
  threeComponentMixtureEntry,
  weaklyEntangledStateEntropy,
  whatAChshViolationRulesOut,
  whyConcurrenceNeedsStatevector,
  whyOneBitIsTheMaximum,
  whyProofNeedsTwoQubits,
  whyRhoIsHermitian,
  whyTraceOutEverythingIsMeaningless,
  xGateOnBiasedMixture,
  zeroOneProductReducedState,
  bitFlipCodeBlindToZ,
  codeParametersShorVsBitflip,
  connectingBackToShorsAlgorithm,
  encodingCircuitTrace,
  hzhEqualsXDerivation,
  phaseFlipCodeCorrectsZError,
  phaseFlipCodeStabilizers,
  shorCodeQubitCount,
  surfaceCodeDistanceScaling,
  syndromeForQubit0Error,
  thresholdQualitativeReasoning,
  verifyX2Anticommutation,
  vertexStabilizerLocality,
  weight2ErrorLogicalFlip,
  whyMeasurementWouldCollapseSuperposition,
  yEqualsIxzVerification,
  yErrorDoubleDetection,
  ancillaUnchangedByKickback,
  diffusionOnNonUniformState,
  djBalancedParityFunction,
  djConstantFunctionAmplitude,
  globalPhaseBugDiagnosis,
  groverSuccessProbabilityClosedForm,
  oneQueryInformationLimit,
  oracleReversibilityProof,
  phaseEstimationQuarterPhase,
  phaseKickbackSignForF0,
  phaseOracleVsDiffusionRole,
  provablyOptimalVsBestKnown,
  qftOfBasisState,
  qftOfZeroIsUniform,
  qftReducesToHadamard,
  queryComplexityVsWallClock,
  simonMeasurementProbabilityS10,
  simonOracleOutputS10X3,
  simonOrthogonalComplementRecoversS,
  simonWhyZeroStringUninformative,
  speedupFactorComparison,
  threeQubitUniformSuperposition,
  whichPrecisionQubitControlsLargestPower,
  whyMoreIterationsIsntAlwaysBetter,
  whyPhaseEstimationNeedsKnownEigenstate,
  whyPromiseIsNecessary,
  zeroIterationsBaseline,
  accountingTableRecall,
  ansatzExpressivityCheck,
  costUnitaryIsPurePhase,
  eigenvaluesViaTraceAndDeterminant,
  expectedCutFourEdges,
  factorsOf21ViaGcd,
  gcdOf7And15,
  groundEnergyOfPauliX,
  identifyingNisqFriendlyAlgorithms,
  orderOf2Mod21,
  periodFindingPeakLocations,
  periodFindingTotalProbability,
  pigeonholeOddCycleArgument,
  qaoaApproximationRatio,
  threeKindsOfAdvantageClaims,
  variationalPrincipleEqualityCase,
  vqeConvergenceAccuracy,
  whichStepWasQuantum,
  whyControlledModularExpNotBuilt,
  whyOddOrderFails,
  bb84FixedEveStrategyErrorRate,
  bb84MismatchEqualsEveProbability,
  bb84MismatchedBasisProbability,
  bb84WhySamplingDetectsEavesdropping,
  bellStateOutcomeProbability,
  bellStateSeparability,
  cnotDoesNotCloneSuperposition,
  cnotReversedControlTarget,
  correctOperatorOrderHThenX,
  czAmplitudeOnEleven,
  doesThisStateFactor,
  forcedCloneStateProbability,
  fourQubitParameterGap,
  ghzCollapseAfterMeasuringQubitZero,
  ghzCorrelationWithoutSignaling,
  ghzMeasurementProbability111,
  hOnQ1ThenCnot10Outcome,
  hThenCnotResult,
  interferenceWithoutEntanglement,
  minusIPlusTensorProbability,
  noInteractionMeansNoEntanglement,
  onePlusVsPlusOneTensorOrder,
  phaseOnQubitZeroConcentration,
  psiMinusPostMeasurementOutcomeOne,
  psiPlusFromZeroOneProbability,
  qubit1MeasurementProbabilityAsymmetricState,
  superdense01MessageDecodeProbability,
  superdenseEntanglementFree25PercentExplanation,
  superdenseNonOrthogonalMessagesConsequence,
  superdenseVsTeleportationSharedResource,
  tFourthPowerEqualsZ,
  teleportationCorrectionFor01,
  teleportationFinalPopulationMatchesMessage,
  tensorProductBasisLabel,
  toffoliTCountOnTargetQubit,
  whichVariantStillGives00,
  whyAliceOutcomesAreAlwaysFair,
  whyBlankWireIsIdentity,
  whyCliffordAloneIsntUniversal,
  whyCnotSquaredIsIdentity,
  whyTestingBasisStatesIsntEnough,
  amplitudesVsProbabilitiesMixture,
  biasedQubitP1,
  blochPoint100State,
  blochXCoordinateCalculation,
  blochZAfterSOnPlus,
  classifyIScaledPair,
  conjugateSymmetryOfInnerProduct,
  constructiveInterferenceAmplitudeSum,
  equatorStatesSameThetaDifferentPhi,
  fourSGatesSandwiched,
  hxhIdentity,
  modulusOf3Minus4i,
  pPlusAtTwoThirdsPiPhase,
  pPlusForKnownAmplitudes,
  p0AfterHSHOnZero,
  phaseOf1PlusI,
  phaseOfProductOfTwoPhases,
  plusStateMeasurementProbability,
  rzPiOnPlusState,
  singleAmplitudePhaseArgument,
  stateWithCertainPlusOutcome,
  superpositionVsClassicalUncertainty,
  thetaPreservedUnderRz,
  whichStateFailsNormalization,
  whyOrthonormalityLetsTermsCancel,
  whyRepeatedMeasurementFails,
  whyRxNeedsFullTurnOnOne,
  whyTEightReturnsExactly,
  zOnPlusState,
  zeroPlusInnerProduct,
  durationVsAmplitudeControl,
  expectedReadoutErrors99Percent,
  higherFrequencyLowerOccupation,
  miscalibrationPercentageError,
  occupationAt50Mk,
  pulseDurationForPiOver2,
  readoutVsGateErrorTiming,
  recoverOmegaFromScan,
  why4kInsufficient,
  whyDispersiveNotDirect,
  whyP1UsesHalfAngle,
  classifyCoherentErrors,
  crosstalkFidelityAt01,
  crosstalkVsT1T2Distinction,
  gammaFor100UsT1,
  gatesUntil50PercentAt9999,
  maxT2ForGivenT1,
  multiplicativeNotAdditiveError,
  nisqMeaningCheck,
  noiseSourceCatalogCheck,
  physicalQubitsFor10Logical,
  successProbability500Gates,
  whyClassificationMattersForMitigation,
  whyNisqFavorsVqeQaoa,
  whyT1NecessarilyDephases,
  gateTimeVsCoherenceRatio,
  hypotheticalDeviceGateBudget,
  ionGateBudgetComputation,
  isolationVsCouplingTradeoff,
  lossVsDecoherence,
  manufacturabilityIsntAutomaticallyDecisive,
  photonEncodingOptions,
  piPulseDuration25Mhz,
  quantumDotParticleInBoxParallel,
  recommendPlatformForNetworking,
  rydbergBlockadeMechanism,
  sharedMotionalModeMechanism,
  spinQubitScalabilitySource,
  tweezersVsGateLasers,
  whyJosephsonJunctionNeeded,
  whyOpticalTweezersWorkForNeutralAtoms,
  whyPhotonPhotonGatesAreHard,
  whyStaticFieldsCantTrap,
  bbbvScopeMultipleChoice,
  classicalVarianceIndependenceMc,
  commutingTermsZeroError,
  djClassicalQueriesN12,
  gradientVarianceAtN4Recall,
  qpeBestEstimateProbabilityPhi15,
  qpeTailBoundAtJ5,
  quantumWalkDisplacementAt10000,
  threeWallsClassificationMc,
  trotterStepsForTargetError,
  whyShorsEvadesWallOne,
  zeroMeanNotSufficientMc,
  dirichletKernelPeakHeight,
  fourthRungOfTheLadder,
  freeParticleGreensFunctionMagnitude,
  halfLineDeficiencyNormalization,
  infiniteWellOrthogonalityCheck,
  infiniteWellPoleLocation,
  pvmOutcomeProbability,
  symmetricVersusSelfAdjoint,
  whyPPDiverges,
  whyStaircaseGivesASum,
  whyTheShortcutsNeverFailed,
  whyUZeroKillsTheBoundaryTerm,
  averageTeleportationFidelity,
  choiBlockEigenvalueAtGamma,
  coherenceDecayRateHalfPopulation,
  combinedT2FromTwoProcesses,
  cssCommutationCondition,
  fuchsVanDeGraafPureEquality,
  purificationUnitaryFreedom,
  relativeEntropyNearPure,
  schmidtCoefficientsToEntropy,
  steaneCodespaceDimension,
  superdenseLambdaForTargetSuccess,
  traceDistanceAtHalfDamping,
  wernerConcurrenceAtHalf,
  zeroEigenvalueStillCp,
  capacityEntanglementBreakingThreshold,
  dataProcessingLoccEntanglement,
  dataProcessingMutualInformationAtLambda,
  distillationRateFromEntanglementEntropy,
  holevoChiBb84AtP,
  mutualInformationClassicalCorrelation,
  negativeConditionalEntropyExplanation,
  normalizingAFourOutcomeQubitPovm,
  stinespringEnvironmentOutcomeProbability,
  stinespringKrausNonuniquenessEntry,
  typicalSubspaceProbabilityMass,
  unambiguousDiscriminationSuccessProbability,
  twoPToThreePSplittingRatio,
  threePSpinOrbitSplitting,
  berryPhaseAt90Degrees,
  cgCoefficientValue,
  coherentStateMeanPhotonNumber,
  crossSectionRatioAtKa1,
  dynamicalEqualsGeometricPhaseDuration,
  hardSphereCrossSectionAtKaHalf,
  j1j1TopMultipletSize,
  squeezedStateDeltaXAtR1,
  whyBerryPhaseIsRateIndependent,
  wkbAsQuantizedAdiabaticInvariant,
  amplitudeDampingTraceCheck,
  channelsReusedInHardwarePillar,
  compositionLawRelativeError,
  decoherenceVsCollapse,
  euclideanPropagatorAtOrigin,
  identifyingInvalidKrausSet,
  longRunPurityLimit,
  offDiagonalAfterThreeApplications,
  statingTheMeasurementOverclaim,
  strongestConsistencyEvidence,
  unitaryAsSpecialKrausCase,
  whyWickRotationHelps,
  allowedMValuesForJThreeHalves,
  groundStateAngularDependence,
  jRaisingOperatorTopState,
  jxJyCommutatorJ2,
  lEquals2DegeneracyCount,
  repeatedSameAxisMeasurement,
  sequentialSgJointProbability,
  singletMatchesBellState,
  spinSquaredEigenvalue,
  tripletUpJzEigenvalue,
  verifyLxLyCommutatorSign,
  whyHalfIntegerLExcluded,
  whySpinHasNoPositionWavefunction,
  y00NormalizationCheck,
  anharmonicFirstOrderShift,
  badWidthGivesWorseBound,
  provingTheVariationalTheorem,
  strongCouplingBreakdownGap,
  transitionProbabilityWeakCoupling,
  unitarityBoundsTransitionProbability,
  variationalEnergyNeverBelowExact,
  whyGroundStateSecondOrderIsNegative,
  whyTheMaslovHalfMatters,
  wkbEnergyForNEquals2,
  wkbExactnessIsSpecialToSho,
  wrongBasisForPerturbationMatrix,
  basisDependenceOfInterference,
  classicalOscillatorEnergy,
  classicalSumComparison,
  commutatorAntisymmetry,
  commutingObservablesNoTradeoff,
  crossBasisProbability,
  epistemicVsQuantumProbability,
  fullyDestructiveCrossBasis,
  generatorMustBeHermitian,
  harmonicOscillatorEnergyLevel,
  ladderLoweringCoefficient,
  minimumMomentumUncertainty,
  observableOperatorType,
  phaseForEqualPredictions,
  postulateExpectationValue,
  postulateProbabilityCalculation,
  quantumInterferenceCalculation,
  qubitAsInstanceOfPostulates,
  rabiProbabilityAtTime,
  stationaryProbabilityCheck,
  threeQubitDimensionSynthesis,
  uncertaintyBoundYZ,
  uncertaintyOfYInPlusState,
  whatPhaseProvides,
  whyEnergyIsConserved,
  whyGatesAreUnitary,
  zeroPointEnergy,
  antisymmetricEigenvalueCheck,
  bosonsVsFermionsClustering,
  oxygen2pElectronCount,
  photonVsElectronStatistics,
  possibleExchangeEigenvalues,
  productStateNotEigenstate,
  quantumVsClassicalIndistinguishability,
  sameOrbitalOppositeSpinAllowed,
  shellCapacityNEquals4,
  whyFillingOrderDeviates,
  whyNormalizationDiffers,
  zeroVectorIsExact,
  bornRuleProbability,
  cauchySchwarzCheck,
  completenessRelationSandwich,
  complexModulus,
  compositeSystemDimension,
  eulersIdentity,
  expectationValueCalculation,
  expectationValueFromProbabilities,
  globalPhaseInvariance,
  identifyHermitianMatrix,
  linearIndependenceCheck,
  matrixProductEntry,
  nonInvertibleMatrix,
  outerProductType,
  pauliXEigenvalueSum,
  pauliZEigenvalueProduct,
  plusMinusOrthogonality,
  realDimensionOfComplexSpace,
  synthesisEigenvalueFromTraceDet,
  synthesisHermitianAndUnitary,
  synthesisMeasurementPostulates,
  unitaryDefiningProperty,
  unitaryEigenvalueModulus,
  whyEntanglementIsGeneric,
  barrierTransmissionCalculation,
  energyAboveWellFloor,
  finiteWellGroundStateCalculation,
  secondResonantWidth,
  stepScatteringCalculation,
  synthesisBoundVsContinuousSpectrum,
  synthesisTunnelingVsResonanceRegimes,
  synthesisWellDepthAndBoundStateCount,
  tangentBranchDivergencePoint,
  whatIsActuallyBounded,
  whyFiniteWellAlwaysBinds,
  whyNoClosedFormFiniteWell,
  whyReflectionAlwaysPositive,
  whyResonanceDependsOnK2L,
  bellStateZ0MeasurementProbability,
  characteristicTimescaleCalculation,
  degenerateMeasurementProbability,
  distinctJointEigenvaluePairs,
  minimumTimescaleFromEnergySpread,
  postMeasurementStateComponent,
  sequentialMeasurementProbability,
  sharedEigenbasisImpliesCommuteRecap,
  stationaryStateInfiniteTimescale,
  synthesisNotAStrictGeneralization,
  synthesisRepeatedMeasurementCertainty,
  synthesisWhatCompleteMeans,
  synthesisZeroEnergyUncertaintyConsequence,
  traceOfProjectorEqualsDegeneracy,
  whichPairCommutes,
  whyCollapseUsesWholeProjector,
  whyDifferentFactorObservablesCommute,
  whyGroupDegenerateEigenvectors,
  whyOneObservableMayNotSuffice,
  whyOutcomeIndependentDisturbance,
  xzCommutatorEntry,
  balmerAlphaTransitionEnergy,
  bohrRadiusAgreementMeaning,
  centrifugalTermForLEquals2,
  fineStructureTwoEffects,
  lzL2CommutatorNumerically,
  nEquals2TotalDegeneracy,
  nEquals3OrbitalCount,
  psi1sNormalizationFromFactors,
  sStatesHaveNoCentrifugalBarrier,
  uVsRBoundaryCondition,
  whatFineStructureBreaks,
  whichPotentialsAreCentral,
  whyCoulombEnergyIgnoresL,
  whyHCommutesWithLz,
  amplitudeDensityVsProbability,
  commutatorAntisymmetryPositionMomentum,
  dispersionFormulaCalculation,
  ehrenfestSecondTheorem,
  groupVelocityCalculation,
  harmonicGroundStateEnergy,
  harmonicLevelSpacing,
  infiniteWellEnergyLevel,
  infiniteWellEnergyRatio,
  infiniteWellNodeCount,
  kappaCalculation,
  kineticTermForm,
  meanPositionTophat,
  momentumEigenvalueCalculation,
  momentumWidthFromPositionWidth,
  probabilityInSubregion,
  stationaryPhaseCalculation,
  synthesisBeatFrequencyCalculation,
  synthesisContinuumVsFiniteMapping,
  synthesisStationaryDensityConstant,
  topHatNormalizationConstant,
  transmissionQualitative,
  trotterErrorOrder,
  uncertaintyProductGaussian,
  varianceTophat,
  wallheightDtProduct,
  whyNormIsPreserved,
  whyPHatNeedsI,
  whyPlaneWaveNotNormalizable,
  whySymmetricSplitBetter,
  circuitVqeMatchesExact,
  confusionMatrixCorrection9590,
  logicalResultUnchanged,
  mitigationVsCorrectionWhatGetsRepaired,
  notEveryGateNeedsThreeRotations,
  onlyQuantumStep,
  pennylaneFitsWhichStep,
  swapOverhead14,
  totalCnotEquivalentOps,
  totalSwaps500Iterations,
  twoImplementationsCrossCheck,
  verifyXDecomposition,
  whyExactVsApproximateConvergence,
  whyGlobalPhaseToleranceCorrect,
  zeroNoiseExtrapolationAtP01,
  fourThousandOneThousandSplitExplanation,
  amplitudesFor20Qubits,
  ghzExactProbability,
  hzhEqualsXCheck,
  oppositeFailureModes,
  pennylaneVqeFit,
  sameCapabilityDifferentErgonomics,
  shotNoiseStandardDeviation10000,
  whatABackendAbstracts,
  whenDoesStateChange,
  whyNoiseConfoundsDebugging,
  whySeparationEnablesOptimization,
  exactVsSampledDistinction,
  flopsFor1000Gates30Qubits,
  groverPoorFitForTensorNetworks,
  hhWithDephasingP0,
  memoryFor25Qubits,
  nameAPriorSimulationResult,
  purityNotStrictlyMonotonic,
  simulatingVsBeingQuantum,
  tensorNetworksNotStrictlyBetter,
  whatTensorNetworksExploit,
  why2nIsFundamental,
  whySingleQubitScope,
];
