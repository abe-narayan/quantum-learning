/**
 * AUTO-GENERATED — do not hand-edit.
 *
 * Produced by `node scripts/generate-problem-registry.mjs` (`npm run
 * generate:registry`; also runs automatically before `dev`/`build` via the
 * `predev`/`prebuild` npm lifecycle hooks), in the same run that emits
 * `registry.generated.ts` — both walk the same file list in the same
 * sorted order, so PROBLEM_METAS[i] is PROBLEMS[i].meta, element for
 * element (guarded by `src/lib/problems/__tests__/metaRegistry.test.ts`).
 *
 * Unlike `registry.generated.ts`, this file imports NOTHING but the
 * `ProblemMeta` type: each `meta` block below was text-extracted from its
 * problem file's source (see scripts/lib/extract.mjs) rather than imported,
 * so pulling this module in does NOT pull in the problem modules or the
 * `src/lib/quantum` graph behind them. Meta-only consumers must import
 * `src/lib/problems/metaRegistry.ts` (which wraps this array) — see its
 * doc comment for the build-memory rationale.
 */
import type { ProblemMeta } from "./types";

export const PROBLEM_METAS: ProblemMeta[] = [
  {
    "slug": "amplitude-estimation-grover-iterate-probability",
    "title": "Grover-Iterate Success Probability for θ=π/12, m=2",
    "course": "algorithmic-frontiers",
    "lesson": "apex/algorithmic-frontiers/amplitude-estimation-without-phase-estimation",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "amplitude-estimation",
      "grover-iterate",
      "closed-form"
    ],
    "prerequisites": [
      "apex/algorithmic-frontiers/amplitude-estimation-without-phase-estimation"
    ]
  },
  {
    "slug": "amplitude-estimation-qpe-free-scaling-mc",
    "title": "What QPE-Free Amplitude Estimation Actually Achieves",
    "course": "algorithmic-frontiers",
    "lesson": "apex/algorithmic-frontiers/amplitude-estimation-without-phase-estimation",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "amplitude-estimation",
      "qpe-free",
      "nisq",
      "maximum-likelihood"
    ],
    "prerequisites": [
      "apex/algorithmic-frontiers/amplitude-estimation-without-phase-estimation"
    ]
  },
  {
    "slug": "block-encoding-subnormalization-factor-of-a-unitary-block",
    "title": "Reading the Subnormalization Factor Off a Block",
    "course": "algorithmic-frontiers",
    "lesson": "apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "numeric",
    "tags": [
      "block-encoding",
      "lcu",
      "subnormalization",
      "operator-norm"
    ],
    "prerequisites": [
      "apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries"
    ]
  },
  {
    "slug": "capstone-toolbox-honest-unification-mc",
    "title": "What QSVT Does and Doesn't Prove",
    "course": "algorithmic-frontiers",
    "lesson": "apex/algorithmic-frontiers/capstone-the-toolbox-that-ate-quantum-algorithms",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "multiple-choice",
    "tags": [
      "capstone",
      "synthesis",
      "qsvt",
      "block-encoding"
    ],
    "prerequisites": [
      "apex/algorithmic-frontiers/the-quantum-singular-value-transformation",
      "apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems"
    ]
  },
  {
    "slug": "capstone-toolbox-trotter-steps-t10",
    "title": "First-Order Trotter Steps at t=10",
    "course": "algorithmic-frontiers",
    "lesson": "apex/algorithmic-frontiers/capstone-the-toolbox-that-ate-quantum-algorithms",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "capstone",
      "synthesis",
      "hamiltonian-simulation",
      "trotterization"
    ],
    "prerequisites": [
      "apex/algorithmic-frontiers/capstone-the-toolbox-that-ate-quantum-algorithms"
    ]
  },
  {
    "slug": "lcu-prepare-register-size",
    "title": "Sizing the PREPARE Ancilla Register",
    "course": "algorithmic-frontiers",
    "lesson": "apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "lcu",
      "prepare",
      "ancilla-overhead"
    ],
    "prerequisites": [
      "apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries"
    ]
  },
  {
    "slug": "lcu-success-probability-plus-state",
    "title": "Block-Encoding Success Probability for |+⟩",
    "course": "algorithmic-frontiers",
    "lesson": "apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "numeric",
    "tags": [
      "block-encoding",
      "lcu",
      "post-selection"
    ],
    "prerequisites": [
      "apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries"
    ]
  },
  {
    "slug": "linear-systems-polynomial-degree-for-target-epsilon",
    "title": "Polynomial Degree for a Target Inversion Accuracy",
    "course": "algorithmic-frontiers",
    "lesson": "apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "quantum-linear-systems",
      "qsvt",
      "condition-number",
      "hhl"
    ],
    "prerequisites": [
      "apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems"
    ]
  },
  {
    "slug": "linear-systems-readout-vs-full-vector",
    "title": "Why a Small Readout Preserves the Speedup and Full Readout Doesn't",
    "course": "algorithmic-frontiers",
    "lesson": "apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "conceptual",
    "tags": [
      "quantum-linear-systems",
      "hhl",
      "qsvt",
      "misleading-claims"
    ],
    "prerequisites": [
      "apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems"
    ]
  },
  {
    "slug": "qsp-d1-phase-sum-real-part",
    "title": "QSP Degree-1 Closed Form: Real Part of P(x)",
    "course": "algorithmic-frontiers",
    "lesson": "apex/algorithmic-frontiers/quantum-signal-processing",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "quantum-signal-processing",
      "phase-sequence"
    ],
    "prerequisites": [
      "apex/algorithmic-frontiers/quantum-signal-processing"
    ]
  },
  {
    "slug": "qsp-d2-degree-collapse-imaginary-part",
    "title": "When a Degree-2 QSP Sequence Collapses to a Constant",
    "course": "algorithmic-frontiers",
    "lesson": "apex/algorithmic-frontiers/quantum-signal-processing",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "quantum-signal-processing",
      "phase-sequence",
      "degree-bound"
    ],
    "prerequisites": [
      "apex/algorithmic-frontiers/quantum-signal-processing"
    ]
  },
  {
    "slug": "qsvt-polynomial-value-at-a-singular-value",
    "title": "Evaluating a QSVT Polynomial at a Singular Value",
    "course": "algorithmic-frontiers",
    "lesson": "apex/algorithmic-frontiers/the-quantum-singular-value-transformation",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "qsvt",
      "quantum-signal-processing",
      "block-encoding"
    ],
    "prerequisites": [
      "apex/algorithmic-frontiers/the-quantum-singular-value-transformation"
    ]
  },
  {
    "slug": "qsvt-three-polynomials-three-special-cases-mc",
    "title": "Three Polynomials, Three Algorithms",
    "course": "algorithmic-frontiers",
    "lesson": "apex/algorithmic-frontiers/the-quantum-singular-value-transformation",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "multiple-choice",
    "tags": [
      "qsvt",
      "quantum-signal-processing",
      "hamiltonian-simulation",
      "amplitude-amplification",
      "linear-systems"
    ],
    "prerequisites": [
      "apex/algorithmic-frontiers/the-quantum-singular-value-transformation"
    ]
  },
  {
    "slug": "qsvt-versus-trotter-asymptotic-claim",
    "title": "Does QSVT Make Trotterization Obsolete?",
    "course": "algorithmic-frontiers",
    "lesson": "apex/algorithmic-frontiers/the-quantum-singular-value-transformation",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "conceptual",
    "tags": [
      "qsvt",
      "hamiltonian-simulation",
      "trotterization",
      "asymptotics"
    ],
    "prerequisites": [
      "apex/algorithmic-frontiers/the-quantum-singular-value-transformation"
    ]
  },
  {
    "slug": "decoding-defect-pair-for-a-boundary-qubit",
    "title": "Which Defect Pair Does a Boundary-Column Error Flip?",
    "course": "fault-tolerance-frontiers",
    "lesson": "apex/fault-tolerance-frontiers/decoding-surface-codes",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "surface-codes",
      "decoding",
      "minimum-weight-perfect-matching"
    ],
    "prerequisites": [
      "apex/fault-tolerance-frontiers/decoding-surface-codes"
    ]
  },
  {
    "slug": "decoding-mwpm-four-defect-matching-weight",
    "title": "Minimum Matching Weight for a Four-Defect Syndrome",
    "course": "fault-tolerance-frontiers",
    "lesson": "apex/fault-tolerance-frontiers/decoding-surface-codes",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "numeric",
    "tags": [
      "surface-codes",
      "decoding",
      "minimum-weight-perfect-matching",
      "graph-matching"
    ],
    "prerequisites": [
      "apex/fault-tolerance-frontiers/decoding-surface-codes"
    ]
  },
  {
    "slug": "decoding-threshold-scaling-ratio",
    "title": "Comparing Logical Error Rates Across Code Distances",
    "course": "fault-tolerance-frontiers",
    "lesson": "apex/fault-tolerance-frontiers/decoding-surface-codes",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "surface-codes",
      "decoding",
      "threshold-theorem"
    ],
    "prerequisites": [
      "apex/fault-tolerance-frontiers/decoding-surface-codes"
    ]
  },
  {
    "slug": "gottesman-knill-which-circuit-is-simulable-mc",
    "title": "Which Circuit Gottesman-Knill Covers",
    "course": "fault-tolerance-frontiers",
    "lesson": "apex/fault-tolerance-frontiers/magic-states-and-distillation",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "multiple-choice",
    "tags": [
      "gottesman-knill",
      "clifford-group",
      "stabilizer-circuits",
      "t-gate",
      "magic-states"
    ],
    "prerequisites": [
      "apex/fault-tolerance-frontiers/magic-states-and-distillation"
    ]
  },
  {
    "slug": "lattice-surgery-cnot-merge-count",
    "title": "Counting Merges in the Lattice-Surgery CNOT",
    "course": "fault-tolerance-frontiers",
    "lesson": "apex/fault-tolerance-frontiers/lattice-surgery",
    "difficulty": "master",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "lattice-surgery",
      "cnot",
      "fault-tolerance"
    ],
    "prerequisites": [
      "apex/fault-tolerance-frontiers/surface-codes-in-depth",
      "apex/fault-tolerance-frontiers/lattice-surgery"
    ]
  },
  {
    "slug": "lattice-surgery-merge-split-measured-operator-mc",
    "title": "What a Rough-Boundary Merge and Split Measured",
    "course": "fault-tolerance-frontiers",
    "lesson": "apex/fault-tolerance-frontiers/lattice-surgery",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "multiple-choice",
    "tags": [
      "lattice-surgery",
      "surface-codes",
      "logical-measurement",
      "measurement-back-action"
    ],
    "prerequisites": [
      "apex/fault-tolerance-frontiers/lattice-surgery"
    ]
  },
  {
    "slug": "lattice-surgery-transversal-gate-failure",
    "title": "Why No Transversal Gate Between Two Patches?",
    "course": "fault-tolerance-frontiers",
    "lesson": "apex/fault-tolerance-frontiers/lattice-surgery",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "lattice-surgery",
      "surface-codes",
      "fault-tolerance"
    ],
    "prerequisites": [
      "apex/fault-tolerance-frontiers/surface-codes-in-depth",
      "apex/fault-tolerance-frontiers/lattice-surgery"
    ]
  },
  {
    "slug": "magic-state-distillation-rounds-needed",
    "title": "How Many 15-to-1 Distillation Rounds Reach a 10⁻¹⁰ Target?",
    "course": "fault-tolerance-frontiers",
    "lesson": "apex/fault-tolerance-frontiers/magic-states-and-distillation",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "magic-state-distillation",
      "resource-estimation",
      "cubic-suppression"
    ],
    "prerequisites": [
      "apex/fault-tolerance-frontiers/magic-states-and-distillation"
    ]
  },
  {
    "slug": "magic-state-eastin-knill-transversal-gates",
    "title": "Which Gates Are Transversal on the Surface Code, and Why Not All of Them?",
    "course": "fault-tolerance-frontiers",
    "lesson": "apex/fault-tolerance-frontiers/magic-states-and-distillation",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "eastin-knill",
      "gottesman-knill",
      "transversal-gates",
      "magic-states"
    ],
    "prerequisites": [
      "apex/fault-tolerance-frontiers/magic-states-and-distillation"
    ]
  },
  {
    "slug": "resource-estimation-code-distance-for-tighter-budget",
    "title": "Code Distance for a Smaller Toy Circuit",
    "course": "fault-tolerance-frontiers",
    "lesson": "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "resource-estimation",
      "code-distance",
      "surface-codes",
      "threshold-theorem"
    ],
    "prerequisites": [
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm"
    ]
  },
  {
    "slug": "resource-estimation-factory-share-with-nine-logical-qubits",
    "title": "Factory Share of the Total With Nine Logical Qubits",
    "course": "fault-tolerance-frontiers",
    "lesson": "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "resource-estimation",
      "magic-states",
      "distillation",
      "qubit-counting"
    ],
    "prerequisites": [
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm"
    ]
  },
  {
    "slug": "surface-code-generator-count-at-distance-5",
    "title": "Independent Stabilizer Generators at Distance 5",
    "course": "fault-tolerance-frontiers",
    "lesson": "apex/fault-tolerance-frontiers/surface-codes-in-depth",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "surface-codes",
      "css-codes",
      "stabilizer-formalism"
    ],
    "prerequisites": [
      "apex/fault-tolerance-frontiers/surface-codes-in-depth"
    ]
  },
  {
    "slug": "surface-code-logical-string-minimum-weight",
    "title": "Weight of the Shortest Boundary-to-Boundary String",
    "course": "fault-tolerance-frontiers",
    "lesson": "apex/fault-tolerance-frontiers/surface-codes-in-depth",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "surface-codes",
      "code-distance",
      "logical-operators",
      "stabilizer-formalism"
    ],
    "prerequisites": [
      "apex/fault-tolerance-frontiers/surface-codes-in-depth"
    ]
  },
  {
    "slug": "threshold-concatenation-two-levels",
    "title": "Two Levels of Concatenation Below Threshold",
    "course": "fault-tolerance-frontiers",
    "lesson": "apex/fault-tolerance-frontiers/the-threshold-theorem",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "threshold-theorem",
      "concatenated-codes",
      "fault-tolerance"
    ],
    "prerequisites": [
      "apex/fault-tolerance-frontiers/the-threshold-theorem"
    ]
  },
  {
    "slug": "threshold-differing-values-not-contradiction",
    "title": "Why Threshold Theorems Quote Different Numbers",
    "course": "fault-tolerance-frontiers",
    "lesson": "apex/fault-tolerance-frontiers/the-threshold-theorem",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "conceptual",
    "tags": [
      "threshold-theorem",
      "surface-codes",
      "concatenated-codes"
    ],
    "prerequisites": [
      "apex/fault-tolerance-frontiers/the-threshold-theorem",
      "apex/fault-tolerance-frontiers/decoding-surface-codes"
    ]
  },
  {
    "slug": "why-stabilizer-overlaps-are-always-even",
    "title": "Why Every X/Z Stabilizer Pair Shares an Even Number of Qubits",
    "course": "fault-tolerance-frontiers",
    "lesson": "apex/fault-tolerance-frontiers/surface-codes-in-depth",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "conceptual",
    "tags": [
      "surface-codes",
      "css-codes",
      "commutation"
    ],
    "prerequisites": [
      "apex/fault-tolerance-frontiers/surface-codes-in-depth",
      "quantum-mastery/quantum-information-theory/css-codes-and-the-general-stabilizer-formalism"
    ]
  },
  {
    "slug": "capstone-classify-rcs-claim-mc",
    "title": "Classifying a Random Circuit Sampling Claim",
    "course": "quantum-complexity-theory",
    "lesson": "apex/quantum-complexity-theory/capstone-what-we-know-and-dont",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "multiple-choice",
    "tags": [
      "complexity-theory",
      "quantum-supremacy",
      "random-circuit-sampling",
      "claim-evaluation"
    ],
    "prerequisites": [
      "apex/quantum-complexity-theory/capstone-what-we-know-and-dont"
    ]
  },
  {
    "slug": "capstone-np-not-subset-bqp-conjecture",
    "title": "Why NP ⊄ BQP Is a Conjecture, Not a Theorem",
    "course": "quantum-complexity-theory",
    "lesson": "apex/quantum-complexity-theory/capstone-what-we-know-and-dont",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "conceptual",
    "tags": [
      "complexity-theory",
      "np",
      "bqp",
      "query-complexity",
      "claim-evaluation"
    ],
    "prerequisites": [
      "apex/quantum-complexity-theory/capstone-what-we-know-and-dont",
      "apex/quantum-complexity-theory/query-complexity-and-lower-bounds"
    ]
  },
  {
    "slug": "capstone-tiering-nlts-against-quantum-pcp-mc",
    "title": "Tiering NLTS Against the Quantum PCP Conjecture",
    "course": "quantum-complexity-theory",
    "lesson": "apex/quantum-complexity-theory/capstone-what-we-know-and-dont",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "multiple-choice",
    "tags": [
      "complexity-theory",
      "quantum-pcp",
      "nlts",
      "claim-evaluation",
      "proven-vs-conjectured"
    ],
    "prerequisites": [
      "apex/quantum-complexity-theory/capstone-what-we-know-and-dont"
    ]
  },
  {
    "slug": "evaluating-a-worst-case-np-complete-claim-mc",
    "title": "Evaluating a Worst-Case NP-Complete Speedup Claim",
    "course": "quantum-complexity-theory",
    "lesson": "apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "multiple-choice",
    "tags": [
      "complexity-theory",
      "np",
      "bqp",
      "quantum-advantage-claims"
    ],
    "prerequisites": [
      "apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp"
    ]
  },
  {
    "slug": "local-hamiltonian-propagation-term-null-space-mc",
    "title": "Which Slice Does the Propagation Term Accept?",
    "course": "quantum-complexity-theory",
    "lesson": "apex/quantum-complexity-theory/the-local-hamiltonian-problem",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "multiple-choice",
    "tags": [
      "local-hamiltonian",
      "kitaev-construction",
      "history-state",
      "propagation-term"
    ],
    "prerequisites": [
      "apex/quantum-complexity-theory/the-local-hamiltonian-problem"
    ]
  },
  {
    "slug": "local-hamiltonian-verification-precision-union-bound",
    "title": "Per-Term Precision for Local Hamiltonian Verification",
    "course": "quantum-complexity-theory",
    "lesson": "apex/quantum-complexity-theory/the-local-hamiltonian-problem",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "local-hamiltonian",
      "qma-membership",
      "union-bound",
      "precision"
    ],
    "prerequisites": [
      "apex/quantum-complexity-theory/the-local-hamiltonian-problem"
    ]
  },
  {
    "slug": "qma-amplification-threshold-5-percent",
    "title": "Witness Copies Needed for a 5% Failure Bound",
    "course": "quantum-complexity-theory",
    "lesson": "apex/quantum-complexity-theory/qma-and-quantum-verification",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "qma",
      "amplification",
      "chernoff-bound",
      "no-cloning"
    ],
    "prerequisites": [
      "apex/quantum-complexity-theory/qma-and-quantum-verification"
    ]
  },
  {
    "slug": "qma-soundness-quantifier-mc",
    "title": "QMA's Soundness Condition, Stated Precisely",
    "course": "quantum-complexity-theory",
    "lesson": "apex/quantum-complexity-theory/qma-and-quantum-verification",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "qma",
      "definitions",
      "soundness",
      "quantifiers"
    ],
    "prerequisites": [
      "apex/quantum-complexity-theory/qma-and-quantum-verification"
    ]
  },
  {
    "slug": "query-complexity-adversary-bound-n64",
    "title": "Computing the Adversary Bound for N=64",
    "course": "quantum-complexity-theory",
    "lesson": "apex/quantum-complexity-theory/query-complexity-and-lower-bounds",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "adversary-method",
      "query-complexity",
      "ambainis",
      "grover"
    ],
    "prerequisites": [
      "apex/quantum-complexity-theory/query-complexity-and-lower-bounds"
    ]
  },
  {
    "slug": "query-lower-bound-versus-wall-clock-time",
    "title": "What the √N Bound Does and Does Not Fix",
    "course": "quantum-complexity-theory",
    "lesson": "apex/quantum-complexity-theory/query-complexity-and-lower-bounds",
    "difficulty": "master",
    "estimatedMinutes": 9,
    "problemType": "conceptual",
    "tags": [
      "query-complexity",
      "lower-bounds",
      "oracle-model",
      "scope-of-a-theorem"
    ],
    "prerequisites": [
      "apex/quantum-complexity-theory/query-complexity-and-lower-bounds"
    ]
  },
  {
    "slug": "shors-algorithm-does-not-prove-p-neq-bqp",
    "title": "Why Shor's Algorithm Does Not Prove P ≠ BQP",
    "course": "quantum-complexity-theory",
    "lesson": "apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "conceptual",
    "tags": [
      "complexity-theory",
      "bqp",
      "shors-algorithm",
      "np-completeness"
    ],
    "prerequisites": [
      "apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp"
    ]
  },
  {
    "slug": "two-independent-proofs-of-grover-optimality-mc",
    "title": "What 'Two Independent Proofs' Actually Establishes",
    "course": "quantum-complexity-theory",
    "lesson": "apex/quantum-complexity-theory/query-complexity-and-lower-bounds",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "multiple-choice",
    "tags": [
      "adversary-method",
      "polynomial-method",
      "grover",
      "proof-technique",
      "complexity-theory"
    ],
    "prerequisites": [
      "apex/quantum-complexity-theory/query-complexity-and-lower-bounds"
    ]
  },
  {
    "slug": "capstone-landscape-hardware-claim-classification",
    "title": "Classifying a 'Fault-Tolerant Quantum Computing Has Arrived' Claim",
    "course": "research-methods-and-synthesis",
    "lesson": "apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today",
    "difficulty": "master",
    "estimatedMinutes": 10,
    "problemType": "conceptual",
    "tags": [
      "state-of-the-field",
      "hardware",
      "fault-tolerance",
      "claim-evaluation",
      "synthesis"
    ],
    "prerequisites": [
      "apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today",
      "apex/fault-tolerance-frontiers/the-threshold-theorem"
    ]
  },
  {
    "slug": "capstone-landscape-logical-qubits-from-a-physical-count",
    "title": "What 1,121 Physical Qubits Actually Buys",
    "course": "research-methods-and-synthesis",
    "lesson": "apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today",
    "difficulty": "master",
    "estimatedMinutes": 9,
    "problemType": "numeric",
    "tags": [
      "state-of-the-field",
      "resource-estimation",
      "fault-tolerance",
      "claim-evaluation",
      "synthesis"
    ],
    "prerequisites": [
      "apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm"
    ]
  },
  {
    "slug": "capstone-landscape-timeline-prediction-evaluation",
    "title": "Evaluating a Confident Quantum Computing Timeline Claim",
    "course": "research-methods-and-synthesis",
    "lesson": "apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today",
    "difficulty": "master",
    "estimatedMinutes": 10,
    "problemType": "conceptual",
    "tags": [
      "state-of-the-field",
      "timelines",
      "claim-evaluation",
      "synthesis",
      "calibration"
    ],
    "prerequisites": [
      "apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm"
    ]
  },
  {
    "slug": "classifying-the-oracle-speedup-abstract-mc",
    "title": "Classifying an 'Exponential Speedup' Abstract",
    "course": "research-methods-and-synthesis",
    "lesson": "apex/research-methods-and-synthesis/how-to-read-a-quantum-computing-paper",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "multiple-choice",
    "tags": [
      "paper-reading",
      "oracle-separation",
      "abstract-vs-theorem",
      "claim-evaluation"
    ],
    "prerequisites": [
      "apex/research-methods-and-synthesis/how-to-read-a-quantum-computing-paper"
    ]
  },
  {
    "slug": "explaining-the-oracle-model-gap",
    "title": "Explaining Why the Speedup Claim Needs Two Caveats",
    "course": "research-methods-and-synthesis",
    "lesson": "apex/research-methods-and-synthesis/how-to-read-a-quantum-computing-paper",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "conceptual",
    "tags": [
      "paper-reading",
      "oracle-separation",
      "numerical-vs-proven",
      "claim-evaluation"
    ],
    "prerequisites": [
      "apex/research-methods-and-synthesis/how-to-read-a-quantum-computing-paper"
    ]
  },
  {
    "slug": "quantum-advantage-hard-vs-useful-two-axes",
    "title": "Hard to Simulate vs. Practically Useful: Two Separate Axes",
    "course": "research-methods-and-synthesis",
    "lesson": "apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "conceptual",
    "tags": [
      "quantum-advantage",
      "random-circuit-sampling",
      "quantum-chemistry",
      "claim-evaluation"
    ],
    "prerequisites": [
      "apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims"
    ]
  },
  {
    "slug": "quantum-advantage-weak-classical-baseline-mc",
    "title": "A Quantum Advantage Claim Against the Wrong Baseline",
    "course": "research-methods-and-synthesis",
    "lesson": "apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "multiple-choice",
    "tags": [
      "quantum-advantage",
      "quantum-supremacy",
      "claim-evaluation",
      "classical-simulation"
    ],
    "prerequisites": [
      "apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims"
    ]
  },
  {
    "slug": "reproducibility-components-missing-mc",
    "title": "What's Missing From a Quantum-Computing Claim",
    "course": "research-methods-and-synthesis",
    "lesson": "apex/research-methods-and-synthesis/reproducing-and-designing-experiments",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "multiple-choice",
    "tags": [
      "reproducibility",
      "calibration",
      "error-mitigation",
      "statistics"
    ],
    "prerequisites": [
      "apex/research-methods-and-synthesis/reproducing-and-designing-experiments"
    ]
  },
  {
    "slug": "shot-noise-standard-error-p75-n300",
    "title": "Standard Error of an Estimated Probability from Shot Count",
    "course": "research-methods-and-synthesis",
    "lesson": "apex/research-methods-and-synthesis/reproducing-and-designing-experiments",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "shot-noise",
      "standard-error",
      "reproducibility",
      "statistics"
    ],
    "prerequisites": [
      "apex/research-methods-and-synthesis/reproducing-and-designing-experiments"
    ]
  },
  {
    "slug": "theorem-vs-heuristic-classify-surface-code-threshold",
    "title": "Classifying the Surface Code's ~1% Threshold",
    "course": "research-methods-and-synthesis",
    "lesson": "apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "conceptual",
    "tags": [
      "research-methods",
      "theorem-vs-heuristic",
      "surface-codes",
      "error-correction"
    ],
    "prerequisites": [
      "apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic"
    ]
  },
  {
    "slug": "theorem-vs-heuristic-qaoa-vs-grover-mc",
    "title": "Why QAOA's Heuristic Status Doesn't Make It Worthless",
    "course": "research-methods-and-synthesis",
    "lesson": "apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "multiple-choice",
    "tags": [
      "research-methods",
      "theorem-vs-heuristic",
      "qaoa",
      "grovers-algorithm"
    ],
    "prerequisites": [
      "apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic"
    ]
  },
  {
    "slug": "area-law-minimum-bond-dimension",
    "title": "Minimum Bond Dimension From an Area-Law Entropy Bound",
    "course": "simulation-and-compilation-frontiers",
    "lesson": "apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "area-law",
      "bond-dimension",
      "matrix-product-states",
      "gapped-hamiltonians"
    ],
    "prerequisites": [
      "apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states"
    ]
  },
  {
    "slug": "capstone-pipeline-routed-gate-count-fewer-steps",
    "title": "Routed Gate Count With Fewer Trotter Steps",
    "course": "simulation-and-compilation-frontiers",
    "lesson": "apex/simulation-and-compilation-frontiers/capstone-from-algorithm-to-qubit-count",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "trotterization",
      "t-count",
      "routing-overhead",
      "compilation-pipeline"
    ],
    "prerequisites": [
      "apex/simulation-and-compilation-frontiers/capstone-from-algorithm-to-qubit-count"
    ]
  },
  {
    "slug": "capstone-pipeline-which-stages-are-settled",
    "title": "Which Pipeline Stages Are Settled, and Which Are Still Research",
    "course": "simulation-and-compilation-frontiers",
    "lesson": "apex/simulation-and-compilation-frontiers/capstone-from-algorithm-to-qubit-count",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "conceptual",
    "tags": [
      "resource-estimation",
      "compilation-pipeline",
      "fault-tolerance",
      "research-calibration"
    ],
    "prerequisites": [
      "apex/simulation-and-compilation-frontiers/capstone-from-algorithm-to-qubit-count"
    ]
  },
  {
    "slug": "classical-simulation-bell-pair-bond-dimension",
    "title": "Bond Dimension of a Maximally-Entangled Clifford Circuit",
    "course": "simulation-and-compilation-frontiers",
    "lesson": "apex/simulation-and-compilation-frontiers/when-classical-simulation-works",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "gottesman-knill",
      "stabilizer-circuits",
      "bond-dimension",
      "tensor-networks"
    ],
    "prerequisites": [
      "apex/simulation-and-compilation-frontiers/when-classical-simulation-works"
    ]
  },
  {
    "slug": "classical-simulation-clifford-vs-nonclifford-advantage-candidate-mc",
    "title": "Choosing a Quantum-Advantage Candidate Circuit",
    "course": "simulation-and-compilation-frontiers",
    "lesson": "apex/simulation-and-compilation-frontiers/when-classical-simulation-works",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "multiple-choice",
    "tags": [
      "gottesman-knill",
      "quantum-advantage",
      "tensor-networks",
      "classical-simulability"
    ],
    "prerequisites": [
      "apex/simulation-and-compilation-frontiers/when-classical-simulation-works"
    ]
  },
  {
    "slug": "clifford-t-ross-selinger-tcount-for-epsilon",
    "title": "Ross-Selinger-Style T-Count for ε = 10⁻⁶",
    "course": "simulation-and-compilation-frontiers",
    "lesson": "apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "clifford-t",
      "t-count",
      "ross-selinger",
      "resource-estimation"
    ],
    "prerequisites": [
      "apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting"
    ]
  },
  {
    "slug": "clifford-t-solovay-kitaev-versus-optimal-mc",
    "title": "Does Solovay-Kitaev Already Give You the Best T-Count?",
    "course": "simulation-and-compilation-frontiers",
    "lesson": "apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "clifford-t",
      "solovay-kitaev",
      "ross-selinger",
      "t-count"
    ],
    "prerequisites": [
      "apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting"
    ]
  },
  {
    "slug": "molecular-simulation-electron-configuration-count",
    "title": "Counting Electron Configurations in a Small Active Space",
    "course": "simulation-and-compilation-frontiers",
    "lesson": "apex/simulation-and-compilation-frontiers/quantum-simulation-of-molecules",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "numeric",
    "tags": [
      "electronic-structure",
      "second-quantization",
      "combinatorics",
      "hilbert-space-scaling"
    ],
    "prerequisites": [
      "apex/simulation-and-compilation-frontiers/quantum-simulation-of-molecules"
    ]
  },
  {
    "slug": "molecular-simulation-phase-estimation-overlap-caveat",
    "title": "Is Quantum Phase Estimation's Efficiency Really Unconditional?",
    "course": "simulation-and-compilation-frontiers",
    "lesson": "apex/simulation-and-compilation-frontiers/quantum-simulation-of-molecules",
    "difficulty": "master",
    "estimatedMinutes": 9,
    "problemType": "conceptual",
    "tags": [
      "quantum-phase-estimation",
      "vqe",
      "ground-state-overlap",
      "fault-tolerance",
      "honest-scope"
    ],
    "prerequisites": [
      "apex/simulation-and-compilation-frontiers/quantum-simulation-of-molecules"
    ]
  },
  {
    "slug": "noise-aware-compilation-success-probability-mc",
    "title": "Why the Two Compilations Differ",
    "course": "simulation-and-compilation-frontiers",
    "lesson": "apex/simulation-and-compilation-frontiers/noise-aware-compilation-and-resource-estimation",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "compilation",
      "noise-aware-routing",
      "calibration",
      "resource-estimation"
    ],
    "prerequisites": [
      "apex/simulation-and-compilation-frontiers/noise-aware-compilation-and-resource-estimation"
    ]
  },
  {
    "slug": "noise-aware-compilation-swap-overhead-alternate-routing",
    "title": "SWAP Overhead for a Different Set of Interactions",
    "course": "simulation-and-compilation-frontiers",
    "lesson": "apex/simulation-and-compilation-frontiers/noise-aware-compilation-and-resource-estimation",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "compilation",
      "routing",
      "swap-overhead",
      "transpilation"
    ],
    "prerequisites": [
      "apex/simulation-and-compilation-frontiers/noise-aware-compilation-and-resource-estimation"
    ]
  },
  {
    "slug": "w-state-entropy-and-bond-dimension",
    "title": "Entanglement Entropy and Bond Dimension for the W State",
    "course": "simulation-and-compilation-frontiers",
    "lesson": "apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "numeric",
    "tags": [
      "matrix-product-states",
      "bond-dimension",
      "schmidt-rank",
      "entanglement-entropy"
    ],
    "prerequisites": [
      "apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states"
    ]
  },
  {
    "slug": "biased-mixture-purity",
    "title": "Purity of an 80/20 Mixture",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "purity",
      "mixed-states"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states"
    ]
  },
  {
    "slug": "defining-requirement-x-check",
    "title": "Checking the Partial Trace's Defining Requirement with X",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/partial-trace-and-reduced-states",
    "difficulty": "advanced",
    "estimatedMinutes": 8,
    "problemType": "numeric",
    "tags": [
      "partial-trace",
      "expectation-value"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/partial-trace-and-reduced-states"
    ]
  },
  {
    "slug": "deterministic-lhv-chsh-value",
    "title": "S for a Fully Deterministic LHV Model",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "bell-theorem",
      "chsh",
      "local-hidden-variables"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables"
    ]
  },
  {
    "slug": "diagnosing-the-i4-counterexample",
    "title": "Diagnosing the I/4 Counterexample",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/entanglement-entropy-for-pure-states",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "conceptual",
    "tags": [
      "entanglement-entropy",
      "scope",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/entanglement-entropy-for-pure-states"
    ]
  },
  {
    "slug": "entropy-of-sixty-forty-mixture",
    "title": "Von Neumann Entropy of diag(0.6, 0.4)",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/purity-entropy-and-information",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "von-neumann-entropy",
      "shannon-entropy"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/purity-entropy-and-information"
    ]
  },
  {
    "slug": "indistinguishable-ensembles",
    "title": "Why No Experiment Reveals the Preparation Ensemble",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/convex-combinations-and-physical-mixtures",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "mixed-states",
      "convex-combination",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/convex-combinations-and-physical-mixtures"
    ]
  },
  {
    "slug": "locality-assumption-nonlocal-hv",
    "title": "Why Nonlocal Hidden-Variable Theories Escape Bell's Theorem",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "bell-theorem",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables"
    ]
  },
  {
    "slug": "max-concurrence-implies-maximally-mixed",
    "title": "Why C=1 Forces the Reduced State to Be Maximally Mixed",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "concurrence",
      "purity",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure"
    ]
  },
  {
    "slug": "maximally-mixed-invariance-proof",
    "title": "Proving U(I/2)U† = I/2 for Any Unitary U",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/evolution-and-measurement-of-density-matrices",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "unitary-evolution",
      "proof"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/evolution-and-measurement-of-density-matrices"
    ]
  },
  {
    "slug": "measuring-p1-on-biased-mixture",
    "title": "Measuring P₁ on a Biased Mixture",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/evolution-and-measurement-of-density-matrices",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "measurement",
      "born-rule"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/evolution-and-measurement-of-density-matrices"
    ]
  },
  {
    "slug": "minus-state-x-expectation-via-rho",
    "title": "⟨X⟩ for |−⟩, Computed via Tr(ρX)",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "density-matrix",
      "expectation-value",
      "trace"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices"
    ]
  },
  {
    "slug": "near-pure-entropy-calculation",
    "title": "Entropy of a Near-Pure Density Matrix",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/purity-entropy-and-information",
    "difficulty": "advanced",
    "estimatedMinutes": 8,
    "problemType": "numeric",
    "tags": [
      "von-neumann-entropy",
      "eigenvalues"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/purity-entropy-and-information"
    ]
  },
  {
    "slug": "one-state-density-matrix-choice",
    "title": "The Density Matrix of |1⟩",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "density-matrix",
      "outer-product"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices"
    ]
  },
  {
    "slug": "phase-invariance-of-entanglement-measures",
    "title": "A Relative Phase Doesn't Change Concurrence or Entropy",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/capstone-analyzing-quantum-correlations",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "concurrence",
      "entanglement-entropy",
      "capstone"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/capstone-analyzing-quantum-correlations"
    ]
  },
  {
    "slug": "plus-minus-mixture-identity",
    "title": "A 50/50 Mixture of |+⟩ and |−⟩",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "mixed-states",
      "maximally-mixed"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states"
    ]
  },
  {
    "slug": "psi-minus-concurrence",
    "title": "Concurrence of |Ψ−⟩",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "concurrence",
      "bell-states"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure"
    ]
  },
  {
    "slug": "psi-minus-purity-via-identity",
    "title": "Reduced Purity of |Ψ−⟩ via the Boxed Identity",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/why-entangled-subsystems-are-mixed",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "purity",
      "entanglement",
      "bell-states"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/why-entangled-subsystems-are-mixed"
    ]
  },
  {
    "slug": "purity-between-two-known-values",
    "title": "Reduced Purity for |ad−bc|=0.48",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/capstone-analyzing-quantum-correlations",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "purity",
      "entanglement",
      "capstone"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/capstone-analyzing-quantum-correlations"
    ]
  },
  {
    "slug": "purity-from-concurrence",
    "title": "Reduced Purity from Concurrence",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "concurrence",
      "purity"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure"
    ]
  },
  {
    "slug": "same-axis-perfect-correlation",
    "title": "E(a,a)=1 for Any Shared Measurement Axis",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/the-chsh-inequality",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "chsh",
      "correlation",
      "bell-states"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/the-chsh-inequality"
    ]
  },
  {
    "slug": "same-settings-chsh-value",
    "title": "CHSH Value When Bob Reuses Alice's Settings",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/the-chsh-inequality",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "chsh",
      "bell-states"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/the-chsh-inequality"
    ]
  },
  {
    "slug": "superposition-vs-mixture",
    "title": "Superposition vs. Mixture",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "mixed-states",
      "superposition",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states"
    ]
  },
  {
    "slug": "three-component-mixture-entry",
    "title": "An Entry of a Three-Component Mixture",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/convex-combinations-and-physical-mixtures",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "mixed-states",
      "convex-combination"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/convex-combinations-and-physical-mixtures"
    ]
  },
  {
    "slug": "weakly-entangled-state-entropy",
    "title": "Entanglement Entropy of a Weakly Entangled State",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/entanglement-entropy-for-pure-states",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "entanglement-entropy"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/entanglement-entropy-for-pure-states"
    ]
  },
  {
    "slug": "what-a-chsh-violation-rules-out",
    "title": "What a Measured CHSH Violation Actually Rules Out",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/the-chsh-inequality",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "chsh",
      "bell-theorem",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/the-chsh-inequality"
    ]
  },
  {
    "slug": "why-concurrence-needs-statevector",
    "title": "Why concurrenceOfPureState Takes a StateVector, Not a Matrix",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/capstone-analyzing-quantum-correlations",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "concurrence",
      "scope",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/capstone-analyzing-quantum-correlations"
    ]
  },
  {
    "slug": "why-one-bit-is-the-maximum",
    "title": "Why a Qubit's Entropy Can't Exceed 1 Bit",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/purity-entropy-and-information",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "von-neumann-entropy",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/purity-entropy-and-information"
    ]
  },
  {
    "slug": "why-proof-needs-two-qubits",
    "title": "Why the Purity Identity Doesn't Extend to Three Qubits",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/why-entangled-subsystems-are-mixed",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "entanglement",
      "scope",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/why-entangled-subsystems-are-mixed"
    ]
  },
  {
    "slug": "why-rho-is-hermitian",
    "title": "Why ρ=|ψ⟩⟨ψ| Is Always Hermitian",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "density-matrix",
      "hermitian",
      "proof"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices"
    ]
  },
  {
    "slug": "why-trace-out-everything-is-meaningless",
    "title": "Why You Can't Trace Out Every Qubit",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/partial-trace-and-reduced-states",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "partial-trace",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/partial-trace-and-reduced-states"
    ]
  },
  {
    "slug": "x-gate-on-biased-mixture",
    "title": "Applying X to a Biased Mixture",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/evolution-and-measurement-of-density-matrices",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "unitary-evolution",
      "mixed-states"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/evolution-and-measurement-of-density-matrices"
    ]
  },
  {
    "slug": "zero-one-product-reduced-state",
    "title": "Reduced State of |01⟩'s Qubit 1",
    "course": "entanglement-and-measurement",
    "lesson": "quantum-computing/entanglement-and-measurement/partial-trace-and-reduced-states",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "partial-trace",
      "reduced-state"
    ],
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/partial-trace-and-reduced-states"
    ]
  },
  {
    "slug": "bit-flip-code-blind-to-z",
    "title": "The Bit-Flip Code's Syndrome for a Z Error",
    "course": "error-correction-and-fault-tolerance",
    "lesson": "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "quantum-error-correction",
      "bit-flip-code"
    ],
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code"
    ]
  },
  {
    "slug": "code-parameters-shor-vs-bitflip",
    "title": "Comparing [[n,k,d]] for the Bit-Flip Code and the Shor Code",
    "course": "error-correction-and-fault-tolerance",
    "lesson": "quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "code-parameters"
    ],
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map"
    ]
  },
  {
    "slug": "connecting-back-to-shors-algorithm",
    "title": "Why Shor's Algorithm Specifically Needs Fault Tolerance",
    "course": "error-correction-and-fault-tolerance",
    "lesson": "quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "fault-tolerance",
      "capstone"
    ],
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead"
    ]
  },
  {
    "slug": "encoding-circuit-trace",
    "title": "Tracing the Bit-Flip Code's Encoding Circuit",
    "course": "error-correction-and-fault-tolerance",
    "lesson": "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "quantum-error-correction",
      "bit-flip-code"
    ],
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code"
    ]
  },
  {
    "slug": "hzh-equals-x-derivation",
    "title": "Deriving HZH=X from HXH=Z",
    "course": "error-correction-and-fault-tolerance",
    "lesson": "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-phase-flip-code",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "quantum-error-correction",
      "phase-flip-code"
    ],
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-phase-flip-code"
    ]
  },
  {
    "slug": "phase-flip-code-corrects-z-error",
    "title": "Does the Phase-Flip Code Correct a Z Error on Qubit 2?",
    "course": "error-correction-and-fault-tolerance",
    "lesson": "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-phase-flip-code",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "quantum-error-correction",
      "phase-flip-code"
    ],
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-phase-flip-code"
    ]
  },
  {
    "slug": "phase-flip-code-stabilizers",
    "title": "The Phase-Flip Code's Stabilizer Generators",
    "course": "error-correction-and-fault-tolerance",
    "lesson": "quantum-computing/error-correction-and-fault-tolerance/stabilizer-formalism-basics",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "stabilizer-formalism",
      "phase-flip-code"
    ],
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/stabilizer-formalism-basics"
    ]
  },
  {
    "slug": "shor-code-qubit-count",
    "title": "Counting the Shor Code's Physical Qubits",
    "course": "error-correction-and-fault-tolerance",
    "lesson": "quantum-computing/error-correction-and-fault-tolerance/the-shor-code-combining-both",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "shor-code"
    ],
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/the-shor-code-combining-both"
    ]
  },
  {
    "slug": "surface-code-distance-scaling",
    "title": "How Does Reaching a Larger Distance Change the Construction?",
    "course": "error-correction-and-fault-tolerance",
    "lesson": "quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "surface-codes"
    ],
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction"
    ]
  },
  {
    "slug": "syndrome-for-qubit-0-error",
    "title": "Syndrome for an X Error on Qubit 0",
    "course": "error-correction-and-fault-tolerance",
    "lesson": "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "quantum-error-correction",
      "bit-flip-code"
    ],
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code"
    ]
  },
  {
    "slug": "threshold-qualitative-reasoning",
    "title": "Explaining Why Above-Threshold Error Correction Backfires",
    "course": "error-correction-and-fault-tolerance",
    "lesson": "quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "fault-tolerance",
      "capstone"
    ],
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead"
    ]
  },
  {
    "slug": "verify-x2-anticommutation",
    "title": "Which Stabilizer Does X₂ Anticommute With?",
    "course": "error-correction-and-fault-tolerance",
    "lesson": "quantum-computing/error-correction-and-fault-tolerance/stabilizer-formalism-basics",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "stabilizer-formalism"
    ],
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/stabilizer-formalism-basics"
    ]
  },
  {
    "slug": "vertex-stabilizer-locality",
    "title": "Why Vertex Stabilizers Stay 4-Local at Any Grid Size",
    "course": "error-correction-and-fault-tolerance",
    "lesson": "quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "surface-codes"
    ],
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction"
    ]
  },
  {
    "slug": "weight-2-error-logical-flip",
    "title": "The Recovered Amplitude After a Weight-2 Error",
    "course": "error-correction-and-fault-tolerance",
    "lesson": "quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "quantum-error-correction",
      "code-distance"
    ],
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map"
    ]
  },
  {
    "slug": "why-measurement-would-collapse-superposition",
    "title": "Why Direct Measurement Fails as an Error-Check Strategy",
    "course": "error-correction-and-fault-tolerance",
    "lesson": "quantum-computing/error-correction-and-fault-tolerance/why-quantum-errors-are-different",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "quantum-error-correction",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/why-quantum-errors-are-different"
    ]
  },
  {
    "slug": "y-equals-ixz-verification",
    "title": "Verifying Y=iXZ's (0,1) Entry",
    "course": "error-correction-and-fault-tolerance",
    "lesson": "quantum-computing/error-correction-and-fault-tolerance/why-quantum-errors-are-different",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "pauli-operators"
    ],
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/why-quantum-errors-are-different"
    ]
  },
  {
    "slug": "y-error-double-detection",
    "title": "Why a Y Error Is Caught by Both Shor Code Mechanisms",
    "course": "error-correction-and-fault-tolerance",
    "lesson": "quantum-computing/error-correction-and-fault-tolerance/the-shor-code-combining-both",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "shor-code",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/the-shor-code-combining-both"
    ]
  },
  {
    "slug": "ancilla-unchanged-by-kickback",
    "title": "Why the Ancilla Stays in |−⟩ Throughout Phase Kickback",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/phase-kickback",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "phase-kickback"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/phase-kickback"
    ]
  },
  {
    "slug": "diffusion-on-non-uniform-state",
    "title": "Applying Diffusion to |00⟩ Instead of |s⟩",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "grovers-algorithm",
      "diffusion"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion"
    ]
  },
  {
    "slug": "dj-balanced-parity-function",
    "title": "Deutsch-Jozsa on a Balanced Parity Function",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "deutsch-jozsa"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm"
    ]
  },
  {
    "slug": "dj-constant-function-amplitude",
    "title": "Deutsch-Jozsa on a Constant Function, n=3",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "deutsch-jozsa"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm"
    ]
  },
  {
    "slug": "global-phase-bug-diagnosis",
    "title": "Diagnosing the Global-Phase Diffusion Bug",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "grovers-algorithm",
      "testing"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion"
    ]
  },
  {
    "slug": "grover-success-probability-closed-form",
    "title": "Grover Success Probability via the Closed Form",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "grovers-algorithm",
      "amplitude-amplification"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification"
    ]
  },
  {
    "slug": "one-query-information-limit",
    "title": "What One Query on a Superposition Actually Reveals",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/quantum-parallelism-and-the-oracle-model",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "quantum-parallelism",
      "oracle-model"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/quantum-parallelism-and-the-oracle-model"
    ]
  },
  {
    "slug": "oracle-reversibility-proof",
    "title": "Why the Oracle Model Is Reversible for Any f",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/quantum-parallelism-and-the-oracle-model",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "oracle-model",
      "reversibility"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/quantum-parallelism-and-the-oracle-model"
    ]
  },
  {
    "slug": "phase-estimation-quarter-phase",
    "title": "Phase Estimation for φ=1/4 with 2 Precision Qubits",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/quantum-phase-estimation",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "phase-estimation"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/quantum-phase-estimation"
    ]
  },
  {
    "slug": "phase-kickback-sign-for-f0",
    "title": "Phase Kickback Sign When f(0)=1",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/phase-kickback",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "phase-kickback"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/phase-kickback"
    ]
  },
  {
    "slug": "phase-oracle-vs-diffusion-role",
    "title": "What the Oracle Reflects About, vs. What Diffusion Reflects About",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "grovers-algorithm"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion"
    ]
  },
  {
    "slug": "provably-optimal-vs-best-known",
    "title": "Grover's Optimality vs. Deutsch-Jozsa's Separation",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/capstone-comparing-quantum-advantage",
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "quantum-advantage",
      "capstone"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/capstone-comparing-quantum-advantage"
    ]
  },
  {
    "slug": "qft-of-basis-state",
    "title": "The Imaginary Part of QFT|10⟩'s Last Amplitude",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "qft"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform"
    ]
  },
  {
    "slug": "qft-of-zero-is-uniform",
    "title": "QFT of the All-Zero State",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "qft"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform"
    ]
  },
  {
    "slug": "qft-reduces-to-hadamard",
    "title": "Why QFT Equals H for a Single Qubit",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "qft"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform"
    ]
  },
  {
    "slug": "query-complexity-vs-wall-clock",
    "title": "Query Complexity Is Not the Same as Real-World Speed",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/capstone-comparing-quantum-advantage",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "quantum-advantage",
      "capstone"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/capstone-comparing-quantum-advantage"
    ]
  },
  {
    "slug": "simon-measurement-probability-s10",
    "title": "Measurement Probability of z=01 for Hidden String s=10",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/simons-algorithm",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "simons-algorithm",
      "interference"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/simons-algorithm"
    ]
  },
  {
    "slug": "simon-oracle-output-s10-x3",
    "title": "Computing f(x) for Hidden String s=10",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/simons-algorithm",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "simons-algorithm",
      "oracle"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/simons-algorithm"
    ]
  },
  {
    "slug": "simon-orthogonal-complement-recovers-s",
    "title": "Why n-1 Constraints Pin Down s Uniquely",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/simons-algorithm",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "conceptual",
    "tags": [
      "simons-algorithm",
      "linear-algebra"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/simons-algorithm"
    ]
  },
  {
    "slug": "simon-why-zero-string-uninformative",
    "title": "Why Measuring the All-Zeros String Teaches Nothing",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/simons-algorithm",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "simons-algorithm",
      "linear-algebra"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/simons-algorithm"
    ]
  },
  {
    "slug": "speedup-factor-comparison",
    "title": "Deutsch-Jozsa's Speedup Factor at n=16",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/capstone-comparing-quantum-advantage",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "quantum-advantage",
      "capstone"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/capstone-comparing-quantum-advantage"
    ]
  },
  {
    "slug": "three-qubit-uniform-superposition",
    "title": "Probability of One Outcome in H^⊗3|000⟩",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/quantum-parallelism-and-the-oracle-model",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "quantum-parallelism",
      "hadamard"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/quantum-parallelism-and-the-oracle-model"
    ]
  },
  {
    "slug": "which-precision-qubit-controls-largest-power",
    "title": "Which Precision Qubit Controls the Largest Power of U",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/quantum-phase-estimation",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "phase-estimation"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/quantum-phase-estimation"
    ]
  },
  {
    "slug": "why-more-iterations-isnt-always-better",
    "title": "Why Running Extra Grover Iterations Can Hurt, Not Help",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "grovers-algorithm"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification"
    ]
  },
  {
    "slug": "why-phase-estimation-needs-known-eigenstate",
    "title": "Why This Platform's phaseEstimation Requires a Known Eigenstate",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/quantum-phase-estimation",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "phase-estimation",
      "scope"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/quantum-phase-estimation"
    ]
  },
  {
    "slug": "why-promise-is-necessary",
    "title": "Why Deutsch-Jozsa Needs the Constant-or-Balanced Promise",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "deutsch-jozsa",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm"
    ]
  },
  {
    "slug": "zero-iterations-baseline",
    "title": "Grover's Success Probability at Zero Iterations",
    "course": "quantum-algorithms-i",
    "lesson": "quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "grovers-algorithm"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification"
    ]
  },
  {
    "slug": "accounting-table-recall",
    "title": "What Was Scoped Out of the Shor's Algorithm Implementation",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "capstone",
      "scope"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope"
    ]
  },
  {
    "slug": "ansatz-expressivity-check",
    "title": "Why Rz(φ)Ry(θ)|0⟩ Reaches Every Point on the Bloch Sphere",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "vqe",
      "ansatz"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits"
    ]
  },
  {
    "slug": "cost-unitary-is-pure-phase",
    "title": "Why the Cost Unitary Alone Can't Improve the Measured Cut",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/qaoa-and-combinatorial-optimization",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "qaoa"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/qaoa-and-combinatorial-optimization"
    ]
  },
  {
    "slug": "eigenvalues-via-trace-and-determinant",
    "title": "Finding H's Eigenvalues from Trace and Determinant",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/vqe-a-worked-toy-example",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "vqe",
      "eigenvalues"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/vqe-a-worked-toy-example"
    ]
  },
  {
    "slug": "expected-cut-four-edges",
    "title": "Expected Cut Size for a 4-Edge Graph at Baseline",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/qaoa-and-combinatorial-optimization",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "qaoa"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/qaoa-and-combinatorial-optimization"
    ]
  },
  {
    "slug": "factors-of-21-via-gcd",
    "title": "Factoring 21 from Its Order",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "multiple-choice",
    "tags": [
      "shors-algorithm"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding"
    ]
  },
  {
    "slug": "gcd-of-7-and-15",
    "title": "Confirming gcd(7, 15) = 1",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/worked-example-factoring-15",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "shors-algorithm"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/worked-example-factoring-15"
    ]
  },
  {
    "slug": "ground-energy-of-pauli-x",
    "title": "Ground State Energy of H=X",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "vqe",
      "variational-principle"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits"
    ]
  },
  {
    "slug": "identifying-nisq-friendly-algorithms",
    "title": "Which Algorithm Is More NISQ-Friendly, and Why",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "nisq",
      "capstone"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope"
    ]
  },
  {
    "slug": "order-of-2-mod-21",
    "title": "The Order of 2 mod 21",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "shors-algorithm",
      "order-finding"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding"
    ]
  },
  {
    "slug": "period-finding-peak-locations",
    "title": "Number of Peaks for a=4, N=15",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "shors-algorithm",
      "period-finding"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit"
    ]
  },
  {
    "slug": "period-finding-total-probability",
    "title": "Total Probability Across the Period-Finding Distribution",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "shors-algorithm"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit"
    ]
  },
  {
    "slug": "pigeonhole-odd-cycle-argument",
    "title": "Generalizing the Triangle's Pigeonhole Argument to Any Odd Cycle",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/qaoa-a-worked-max-cut-example",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "qaoa",
      "graph-theory"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/qaoa-a-worked-max-cut-example"
    ]
  },
  {
    "slug": "qaoa-approximation-ratio",
    "title": "QAOA's Approximation Ratio on the Triangle Graph",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/qaoa-a-worked-max-cut-example",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "qaoa"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/qaoa-a-worked-max-cut-example"
    ]
  },
  {
    "slug": "three-kinds-of-advantage-claims",
    "title": "Matching Algorithms to Their Kind of Advantage Claim",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "multiple-choice",
    "tags": [
      "capstone",
      "quantum-advantage"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope"
    ]
  },
  {
    "slug": "variational-principle-equality-case",
    "title": "When Does ⟨ψ|H|ψ⟩ Exactly Equal E₀?",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "vqe",
      "variational-principle"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits"
    ]
  },
  {
    "slug": "vqe-convergence-accuracy",
    "title": "How Close Does VQE Get to the Exact Answer?",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/vqe-a-worked-toy-example",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "vqe"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/vqe-a-worked-toy-example"
    ]
  },
  {
    "slug": "which-step-was-quantum",
    "title": "Identifying the One Quantum Step in the Factor-15 Pipeline",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/worked-example-factoring-15",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "shors-algorithm",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/worked-example-factoring-15"
    ]
  },
  {
    "slug": "why-controlled-modular-exp-not-built",
    "title": "Why This Platform Builds the Period-Finding State Directly",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "shors-algorithm",
      "scope"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit"
    ]
  },
  {
    "slug": "why-odd-order-fails",
    "title": "Why an Odd Order Gives the Reduction Nothing to Work With",
    "course": "quantum-algorithms-ii",
    "lesson": "quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "shors-algorithm"
    ],
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding"
    ]
  },
  {
    "slug": "bb84-fixed-eve-strategy-error-rate",
    "title": "Eve Always Guessing the Z Basis",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "multiple-choice",
    "tags": [
      "bb84",
      "quantum-key-distribution",
      "eavesdropping"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution"
    ]
  },
  {
    "slug": "bb84-mismatch-equals-eve-probability",
    "title": "Why Bob's Mismatch Probability Equals Eve's",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "bb84",
      "quantum-key-distribution",
      "measurement"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution"
    ]
  },
  {
    "slug": "bb84-mismatched-basis-probability",
    "title": "Bob's Mismatched-Basis Probability for Bit 0",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "bb84",
      "quantum-key-distribution",
      "measurement"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution"
    ]
  },
  {
    "slug": "bb84-why-sampling-detects-eavesdropping",
    "title": "Why a Public Sample Suffices to Detect Eve",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "bb84",
      "quantum-key-distribution",
      "eavesdropping"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution"
    ]
  },
  {
    "slug": "bell-state-outcome-probability",
    "title": "Measurement Probability in a Bell State",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/multi-qubit-measurement",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "born-rule",
      "measurement",
      "entanglement",
      "bell-states"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement"
    ]
  },
  {
    "slug": "bell-state-separability",
    "title": "Why the Bell State Isn't Separable",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "entanglement",
      "separability",
      "bell-states"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement"
    ]
  },
  {
    "slug": "cnot-does-not-clone-superposition",
    "title": "Why CNOT Isn't a Counterexample to No-Cloning",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "no-cloning",
      "cnot",
      "linearity"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem"
    ]
  },
  {
    "slug": "cnot-reversed-control-target",
    "title": "CNOT With the Control and Target Swapped",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/controlled-gates-and-cnot",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "cnot",
      "control-target"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/controlled-gates-and-cnot"
    ]
  },
  {
    "slug": "correct-operator-order-h-then-x",
    "title": "Diagram Order vs. Operator Order",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/quantum-circuit-notation",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "circuits",
      "operator-order"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/quantum-circuit-notation"
    ]
  },
  {
    "slug": "cz-amplitude-on-eleven",
    "title": "CZ's Effect on |11⟩",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/controlled-gates-and-cnot",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "controlled-gates",
      "cz",
      "phase"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/controlled-gates-and-cnot"
    ]
  },
  {
    "slug": "does-this-state-factor",
    "title": "Does This State Factor as a Product State?",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors",
    "difficulty": "intermediate",
    "estimatedMinutes": 7,
    "problemType": "multiple-choice",
    "tags": [
      "entanglement",
      "product-states",
      "factorization"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors"
    ]
  },
  {
    "slug": "forced-clone-state-probability",
    "title": "What Linearity Forces for an |i⟩ Input",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "no-cloning",
      "linearity",
      "measurement"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem"
    ]
  },
  {
    "slug": "four-qubit-parameter-gap",
    "title": "The Parameter Gap for Four Qubits",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "entanglement",
      "parameter-counting"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors"
    ]
  },
  {
    "slug": "ghz-collapse-after-measuring-qubit-zero",
    "title": "Collapsing the GHZ State by Measuring Qubit 0",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/building-quantum-circuits",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "ghz",
      "measurement",
      "collapse"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/building-quantum-circuits"
    ]
  },
  {
    "slug": "ghz-correlation-without-signaling",
    "title": "Why GHZ Correlation Isn't a Faster-Than-Light Signal",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/building-quantum-circuits",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "ghz",
      "entanglement",
      "no-signaling"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/building-quantum-circuits"
    ]
  },
  {
    "slug": "ghz-measurement-probability-111",
    "title": "P(111) for the GHZ State",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/building-quantum-circuits",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "ghz",
      "measurement",
      "multi-qubit"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/building-quantum-circuits"
    ]
  },
  {
    "slug": "h-on-q1-then-cnot-1-0-outcome",
    "title": "A Circuit With Qubit 1 as Control",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/quantum-circuit-notation",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "circuits",
      "cnot",
      "measurement"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/quantum-circuit-notation"
    ]
  },
  {
    "slug": "h-then-cnot-result",
    "title": "H Then CNOT, Starting From |00⟩",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "bell-states",
      "entanglement",
      "circuits"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement"
    ]
  },
  {
    "slug": "interference-without-entanglement",
    "title": "Interference on Entangled vs. Product States",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "interference",
      "entanglement"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits"
    ]
  },
  {
    "slug": "minus-i-plus-tensor-probability",
    "title": "Measuring |−i⟩ ⊗ |+⟩",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/tensor-products",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "tensor-product",
      "complex-amplitudes",
      "measurement"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/tensor-products"
    ]
  },
  {
    "slug": "no-interaction-means-no-entanglement",
    "title": "Can Qubits Entangle Without a Shared Gate?",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "entanglement",
      "product-states"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors"
    ]
  },
  {
    "slug": "one-plus-vs-plus-one-tensor-order",
    "title": "|1⟩ ⊗ |+⟩ Is Not |+⟩ ⊗ |1⟩",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/tensor-products",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "tensor-product",
      "ordering-convention"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/tensor-products"
    ]
  },
  {
    "slug": "phase-on-qubit-zero-concentration",
    "title": "Moving the Phase Gate to Qubit 0",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits",
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "interference",
      "phase",
      "hadamard"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits"
    ]
  },
  {
    "slug": "psi-minus-post-measurement-outcome-one",
    "title": "Collapsing |Ψ−⟩ After Measuring Qubit 0",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/multi-qubit-measurement",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "multiple-choice",
    "tags": [
      "partial-measurement",
      "entanglement",
      "collapse"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/multi-qubit-measurement"
    ]
  },
  {
    "slug": "psi-plus-from-zero-one-probability",
    "title": "Deriving |Ψ+⟩ From |01⟩",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "bell-states",
      "entanglement",
      "measurement"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement"
    ]
  },
  {
    "slug": "qubit1-measurement-probability-asymmetric-state",
    "title": "Measuring the Other Qubit",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/multi-qubit-measurement",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "partial-measurement",
      "born-rule"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/multi-qubit-measurement"
    ]
  },
  {
    "slug": "superdense-01-message-decode-probability",
    "title": "Verifying the 01 Row of Superdense Coding",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/superdense-coding",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "superdense-coding",
      "bell-states",
      "measurement"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/superdense-coding"
    ]
  },
  {
    "slug": "superdense-entanglement-free-25-percent-explanation",
    "title": "Why the Entanglement-Free Case Gives Exactly 0.25 Each",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/superdense-coding",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "superdense-coding",
      "entanglement",
      "measurement"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/superdense-coding"
    ]
  },
  {
    "slug": "superdense-non-orthogonal-messages-consequence",
    "title": "Why Alice's Four Encodings Must Be Orthogonal",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/superdense-coding",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "superdense-coding",
      "bell-states",
      "distinguishability"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/superdense-coding"
    ]
  },
  {
    "slug": "superdense-vs-teleportation-shared-resource",
    "title": "Comparing Teleportation's and Superdense Coding's Resources",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/superdense-coding",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "conceptual",
    "tags": [
      "superdense-coding",
      "quantum-teleportation",
      "entanglement"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/superdense-coding",
      "quantum-computing/quantum-gates-and-circuits/quantum-teleportation"
    ]
  },
  {
    "slug": "t-fourth-power-equals-z",
    "title": "Is T·T·T·T a Valid Decomposition of Z?",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "universal-quantum-computation",
      "clifford-group",
      "t-gate"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation"
    ]
  },
  {
    "slug": "teleportation-correction-for-01",
    "title": "Bob's Correction When Alice's Outcomes Are (0, 1)",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/quantum-teleportation",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "teleportation",
      "correction-table"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/quantum-teleportation"
    ]
  },
  {
    "slug": "teleportation-final-population-matches-message",
    "title": "Checking Bob's Corrected Qubit Against the Original Message",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/quantum-teleportation",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "teleportation",
      "measurement",
      "verification"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/quantum-teleportation"
    ]
  },
  {
    "slug": "tensor-product-basis-label",
    "title": "Tensoring Two Basis States",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/tensor-products",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "tensor-product",
      "basis-states"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/tensor-products"
    ]
  },
  {
    "slug": "toffoli-t-count-on-target-qubit",
    "title": "T-Count on the Target Qubit of the Toffoli Circuit",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "universal-quantum-computation",
      "toffoli",
      "t-count"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation"
    ]
  },
  {
    "slug": "which-variant-still-gives-00",
    "title": "Which Variant of the Circuit Still Gives |00⟩?",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "multiple-choice",
    "tags": [
      "interference",
      "phase",
      "measurement"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits"
    ]
  },
  {
    "slug": "why-alice-outcomes-are-always-fair",
    "title": "Why Alice's Outcomes Must Be Independent of the Message",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/quantum-teleportation",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "teleportation",
      "no-signaling"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/quantum-teleportation"
    ]
  },
  {
    "slug": "why-blank-wire-is-identity",
    "title": "What a Blank Wire Actually Means",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/quantum-circuit-notation",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "conceptual",
    "tags": [
      "circuits",
      "identity",
      "tensor-product"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/quantum-circuit-notation"
    ]
  },
  {
    "slug": "why-clifford-alone-isnt-universal",
    "title": "Why {H, S, CNOT} Can't Be Universal",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation",
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "universal-quantum-computation",
      "clifford-group",
      "gottesman-knill"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation"
    ]
  },
  {
    "slug": "why-cnot-squared-is-identity",
    "title": "Why CNOT² = I",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/controlled-gates-and-cnot",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "conceptual",
    "tags": [
      "cnot",
      "reversibility"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/controlled-gates-and-cnot"
    ]
  },
  {
    "slug": "why-testing-basis-states-isnt-enough",
    "title": "Why a Device That Clones |0⟩ and |1⟩ Still Isn't a Cloner",
    "course": "quantum-gates-and-circuits",
    "lesson": "quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "no-cloning",
      "linearity",
      "unknown-state"
    ],
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem"
    ]
  },
  {
    "slug": "amplitudes-vs-probabilities-mixture",
    "title": "Amplitudes vs. Classical Mixture Probabilities",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "interference",
      "amplitudes",
      "classical-probability"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors"
    ]
  },
  {
    "slug": "biased-qubit-p1",
    "title": "A Biased Qubit's Measurement Probability",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/what-is-a-qubit",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "born-rule",
      "measurement",
      "normalization"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/what-is-a-qubit"
    ]
  },
  {
    "slug": "bloch-point-1-0-0-state",
    "title": "What State Sits at Bloch Point (1, 0, 0)?",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/the-bloch-sphere",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "bloch-sphere",
      "canonical-form"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/the-bloch-sphere"
    ]
  },
  {
    "slug": "bloch-x-coordinate-calculation",
    "title": "Computing a Bloch Sphere x-Coordinate",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/the-bloch-sphere",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "bloch-sphere",
      "spherical-coordinates"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/the-bloch-sphere"
    ]
  },
  {
    "slug": "bloch-z-after-s-on-plus",
    "title": "Bloch z-Coordinate After S|+⟩",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/quantum-gates",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "gates",
      "s-gate",
      "bloch-sphere"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/quantum-gates"
    ]
  },
  {
    "slug": "classify-i-scaled-pair",
    "title": "Classifying an i-Scaled State Pair",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/global-and-relative-phase",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "global-phase",
      "relative-phase"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/global-and-relative-phase"
    ]
  },
  {
    "slug": "conjugate-symmetry-of-inner-product",
    "title": "Reversing an Inner Product's Order",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/dirac-notation",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "dirac-notation",
      "inner-product",
      "conjugate"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/dirac-notation"
    ]
  },
  {
    "slug": "constructive-interference-amplitude-sum",
    "title": "Adding Amplitudes That Reinforce",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "interference",
      "amplitudes",
      "superposition"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors"
    ]
  },
  {
    "slug": "equator-states-same-theta-different-phi",
    "title": "What Distinguishes Two Equator States?",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/the-bloch-sphere",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "conceptual",
    "tags": [
      "bloch-sphere",
      "phase",
      "measurement"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/the-bloch-sphere"
    ]
  },
  {
    "slug": "four-s-gates-sandwiched",
    "title": "Four S Gates Sandwiched by H",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/building-qubit-circuits",
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "circuits",
      "composition",
      "s-gate"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/building-qubit-circuits",
      "quantum-computing/qubits-and-quantum-states/quantum-gates"
    ]
  },
  {
    "slug": "hxh-identity",
    "title": "The HXH Identity",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/building-qubit-circuits",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "multiple-choice",
    "tags": [
      "circuits",
      "composition",
      "identities"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/building-qubit-circuits"
    ]
  },
  {
    "slug": "modulus-of-3-minus-4i",
    "title": "Modulus of 3 − 4i",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "complex-numbers",
      "modulus"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics"
    ]
  },
  {
    "slug": "p-plus-at-two-thirds-pi-phase",
    "title": "P(+) at a Relative Phase of 2π/3",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/global-and-relative-phase",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "relative-phase",
      "interference",
      "x-basis"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/global-and-relative-phase",
      "quantum-computing/qubits-and-quantum-states/measurement-and-probability"
    ]
  },
  {
    "slug": "p-plus-for-known-amplitudes",
    "title": "P(+) for a Tilted State",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/measurement-and-probability",
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "measurement",
      "born-rule",
      "x-basis"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/measurement-and-probability"
    ]
  },
  {
    "slug": "p0-after-h-s-h-on-zero",
    "title": "P(0) After H, S, H on |0⟩",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/building-qubit-circuits",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "circuits",
      "composition",
      "measurement"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/building-qubit-circuits"
    ]
  },
  {
    "slug": "phase-of-1-plus-i",
    "title": "Phase of 1 + i",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "complex-numbers",
      "polar-form",
      "phase"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics"
    ]
  },
  {
    "slug": "phase-of-product-of-two-phases",
    "title": "Multiplying Two Complex Numbers by Phase",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "complex-numbers",
      "polar-form",
      "phase"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics"
    ]
  },
  {
    "slug": "plus-state-measurement-probability",
    "title": "Measuring the |+⟩ State",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/what-is-a-qubit",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "born-rule",
      "measurement",
      "superposition"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/what-is-a-qubit"
    ]
  },
  {
    "slug": "rz-pi-on-plus-state",
    "title": "Rz(π) Applied to |+⟩",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/single-qubit-rotations",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "rotations",
      "rz"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/single-qubit-rotations"
    ]
  },
  {
    "slug": "single-amplitude-phase-argument",
    "title": "Phase on a Single Amplitude",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/global-and-relative-phase",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "global-phase",
      "relative-phase"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/global-and-relative-phase"
    ]
  },
  {
    "slug": "state-with-certain-plus-outcome",
    "title": "Which State Gives P(+) = 1?",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/measurement-and-probability",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "measurement",
      "born-rule",
      "x-basis"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/measurement-and-probability"
    ]
  },
  {
    "slug": "superposition-vs-classical-uncertainty",
    "title": "Superposition Is Not Classical Uncertainty",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/what-is-a-qubit",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "conceptual",
    "tags": [
      "superposition",
      "measurement",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/what-is-a-qubit"
    ]
  },
  {
    "slug": "theta-preserved-under-rz",
    "title": "θ Preserved Under Rz",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/single-qubit-rotations",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "rotations",
      "rz",
      "bloch-sphere"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/single-qubit-rotations"
    ]
  },
  {
    "slug": "which-state-fails-normalization",
    "title": "Which State Fails Normalization?",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "normalization",
      "vector-space"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors"
    ]
  },
  {
    "slug": "why-orthonormality-lets-terms-cancel",
    "title": "Why Orthonormality Simplifies Inner Products",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/dirac-notation",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "conceptual",
    "tags": [
      "dirac-notation",
      "orthonormality",
      "inner-product"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/dirac-notation"
    ]
  },
  {
    "slug": "why-repeated-measurement-fails",
    "title": "Why You Can't Re-Measure the Same Qubit",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/measurement-and-probability",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "conceptual",
    "tags": [
      "measurement",
      "collapse"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/measurement-and-probability"
    ]
  },
  {
    "slug": "why-rx-needs-full-turn-on-one",
    "title": "Why Rx Needs a Full 2π Turn on |1⟩",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/single-qubit-rotations",
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "rotations",
      "rx",
      "bloch-sphere"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/single-qubit-rotations"
    ]
  },
  {
    "slug": "why-t-eight-returns-exactly",
    "title": "Why T⁸ Returns a Qubit Exactly",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/quantum-gates",
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "gates",
      "t-gate",
      "phase"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/quantum-gates"
    ]
  },
  {
    "slug": "z-on-plus-state",
    "title": "Z Applied to |+⟩",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/quantum-gates",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "gates",
      "pauli-z",
      "bloch-sphere"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/quantum-gates"
    ]
  },
  {
    "slug": "zero-plus-inner-product",
    "title": "Computing ⟨0|+⟩",
    "course": "qubits-and-quantum-states",
    "lesson": "quantum-computing/qubits-and-quantum-states/dirac-notation",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "dirac-notation",
      "inner-product",
      "orthonormality"
    ],
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/dirac-notation"
    ]
  },
  {
    "slug": "duration-vs-amplitude-control",
    "title": "Two Ways to Reach the Same Rotation",
    "course": "control-and-readout",
    "lesson": "quantum-hardware/control-and-readout/control-electronics",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "control-electronics"
    ],
    "prerequisites": [
      "quantum-hardware/control-and-readout/control-electronics"
    ]
  },
  {
    "slug": "expected-readout-errors-99-percent",
    "title": "Expected Readout Errors at 99% Fidelity",
    "course": "control-and-readout",
    "lesson": "quantum-hardware/control-and-readout/qubit-readout-techniques",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "readout"
    ],
    "prerequisites": [
      "quantum-hardware/control-and-readout/qubit-readout-techniques"
    ]
  },
  {
    "slug": "higher-frequency-lower-occupation",
    "title": "Does Higher Qubit Frequency Help or Hurt Thermal Noise?",
    "course": "control-and-readout",
    "lesson": "quantum-hardware/control-and-readout/cryogenic-systems",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "cryogenics"
    ],
    "prerequisites": [
      "quantum-hardware/control-and-readout/cryogenic-systems"
    ]
  },
  {
    "slug": "miscalibration-percentage-error",
    "title": "The Actual Ω When the Peak Is Found at 20ns Instead of 13.89ns",
    "course": "control-and-readout",
    "lesson": "quantum-hardware/control-and-readout/calibration",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "calibration"
    ],
    "prerequisites": [
      "quantum-hardware/control-and-readout/calibration"
    ]
  },
  {
    "slug": "occupation-at-50mk",
    "title": "Thermal Occupation for a 5 GHz Qubit at 50 mK",
    "course": "control-and-readout",
    "lesson": "quantum-hardware/control-and-readout/cryogenic-systems",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "cryogenics"
    ],
    "prerequisites": [
      "quantum-hardware/control-and-readout/cryogenic-systems"
    ]
  },
  {
    "slug": "pulse-duration-for-pi-over-2",
    "title": "Pulse Duration for a θ=π/2 Rotation",
    "course": "control-and-readout",
    "lesson": "quantum-hardware/control-and-readout/control-electronics",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "control-electronics",
      "rabi"
    ],
    "prerequisites": [
      "quantum-hardware/control-and-readout/control-electronics"
    ]
  },
  {
    "slug": "readout-vs-gate-error-timing",
    "title": "Readout Error vs. Gate Error: When Each Happens",
    "course": "control-and-readout",
    "lesson": "quantum-hardware/control-and-readout/qubit-readout-techniques",
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "readout",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-hardware/control-and-readout/qubit-readout-techniques"
    ]
  },
  {
    "slug": "recover-omega-from-scan",
    "title": "Recovering Ω From a Rabi Calibration Scan",
    "course": "control-and-readout",
    "lesson": "quantum-hardware/control-and-readout/calibration",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "calibration",
      "rabi"
    ],
    "prerequisites": [
      "quantum-hardware/control-and-readout/calibration"
    ]
  },
  {
    "slug": "why-4k-insufficient",
    "title": "Why 4K Alone Isn't Cold Enough",
    "course": "control-and-readout",
    "lesson": "quantum-hardware/control-and-readout/cryogenic-systems",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "cryogenics"
    ],
    "prerequisites": [
      "quantum-hardware/control-and-readout/cryogenic-systems"
    ]
  },
  {
    "slug": "why-dispersive-not-direct",
    "title": "Why Measure a Resonator Instead of the Qubit Directly",
    "course": "control-and-readout",
    "lesson": "quantum-hardware/control-and-readout/qubit-readout-techniques",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "readout",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-hardware/control-and-readout/qubit-readout-techniques"
    ]
  },
  {
    "slug": "why-p1-uses-half-angle",
    "title": "Why P₁(t)=sin²(θ/2), Not sin²(θ)",
    "course": "control-and-readout",
    "lesson": "quantum-hardware/control-and-readout/control-electronics",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "control-electronics",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-hardware/control-and-readout/control-electronics"
    ]
  },
  {
    "slug": "classify-coherent-errors",
    "title": "Classifying a Drifting Calibration Error",
    "course": "noise-decoherence-and-scaling",
    "lesson": "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "noise-sources"
    ],
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise"
    ]
  },
  {
    "slug": "crosstalk-fidelity-at-0.1",
    "title": "How Long a Spectator Survives ε=0.1 Crosstalk",
    "course": "noise-decoherence-and-scaling",
    "lesson": "quantum-hardware/noise-decoherence-and-scaling/crosstalk",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "crosstalk",
      "scaling"
    ],
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/crosstalk"
    ]
  },
  {
    "slug": "crosstalk-vs-t1t2-distinction",
    "title": "Crosstalk vs. T1/T2: A Structural Difference",
    "course": "noise-decoherence-and-scaling",
    "lesson": "quantum-hardware/noise-decoherence-and-scaling/crosstalk",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "crosstalk",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/crosstalk"
    ]
  },
  {
    "slug": "gamma-for-100us-t1",
    "title": "Per-Step Damping Probability for T1=100μs, dt=1μs",
    "course": "noise-decoherence-and-scaling",
    "lesson": "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "t1-t2"
    ],
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence"
    ]
  },
  {
    "slug": "gates-until-50-percent-at-99.99",
    "title": "How Many Gates at 99.99% Fidelity Before 50% Success?",
    "course": "noise-decoherence-and-scaling",
    "lesson": "quantum-hardware/noise-decoherence-and-scaling/scaling-challenges",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "scaling"
    ],
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/scaling-challenges"
    ]
  },
  {
    "slug": "max-t2-for-given-t1",
    "title": "The Maximum Possible T2 for T1=80μs",
    "course": "noise-decoherence-and-scaling",
    "lesson": "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "t1-t2"
    ],
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence"
    ]
  },
  {
    "slug": "multiplicative-not-additive-error",
    "title": "Does Error Compound Additively or Multiplicatively?",
    "course": "noise-decoherence-and-scaling",
    "lesson": "quantum-hardware/noise-decoherence-and-scaling/scaling-challenges",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "scaling"
    ],
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/scaling-challenges"
    ]
  },
  {
    "slug": "nisq-meaning-check",
    "title": "What Does NISQ Actually Describe?",
    "course": "noise-decoherence-and-scaling",
    "lesson": "quantum-hardware/noise-decoherence-and-scaling/roadmaps-to-fault-tolerance",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "fault-tolerance"
    ],
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/roadmaps-to-fault-tolerance"
    ]
  },
  {
    "slug": "noise-source-catalog-check",
    "title": "Which Noise Source Is Modeled by dephasingChannel?",
    "course": "noise-decoherence-and-scaling",
    "lesson": "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "noise-sources"
    ],
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise"
    ]
  },
  {
    "slug": "physical-qubits-for-10-logical",
    "title": "Physical Qubits Needed for 10 Logical Qubits",
    "course": "noise-decoherence-and-scaling",
    "lesson": "quantum-hardware/noise-decoherence-and-scaling/roadmaps-to-fault-tolerance",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "fault-tolerance"
    ],
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/roadmaps-to-fault-tolerance"
    ]
  },
  {
    "slug": "success-probability-500-gates",
    "title": "Success Probability for 500 Gates at 99.9% Fidelity",
    "course": "noise-decoherence-and-scaling",
    "lesson": "quantum-hardware/noise-decoherence-and-scaling/scaling-challenges",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "scaling"
    ],
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/scaling-challenges"
    ]
  },
  {
    "slug": "why-classification-matters-for-mitigation",
    "title": "Why Misclassifying an Error Wastes Engineering Effort",
    "course": "noise-decoherence-and-scaling",
    "lesson": "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "conceptual",
    "tags": [
      "noise-sources",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise"
    ]
  },
  {
    "slug": "why-nisq-favors-vqe-qaoa",
    "title": "Why VQE and QAOA Fit the NISQ Era",
    "course": "noise-decoherence-and-scaling",
    "lesson": "quantum-hardware/noise-decoherence-and-scaling/roadmaps-to-fault-tolerance",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "fault-tolerance",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/roadmaps-to-fault-tolerance"
    ]
  },
  {
    "slug": "why-t1-necessarily-dephases",
    "title": "Why Energy Relaxation Necessarily Disturbs Phase",
    "course": "noise-decoherence-and-scaling",
    "lesson": "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "t1-t2",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence"
    ]
  },
  {
    "slug": "gate-time-vs-coherence-ratio",
    "title": "What Actually Determines the Operation Budget?",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/superconducting-qubits",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "superconducting-qubits"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/superconducting-qubits"
    ]
  },
  {
    "slug": "hypothetical-device-gate-budget",
    "title": "Gate Budget for a 500μs Coherence, 50ns Gate Device",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "capstone"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms"
    ]
  },
  {
    "slug": "ion-gate-budget-computation",
    "title": "Gate Budget for a 2s Coherence, 20μs Gate Device",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/trapped-ions",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "trapped-ions"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/trapped-ions"
    ]
  },
  {
    "slug": "isolation-vs-coupling-tradeoff",
    "title": "Why Isolation and Fast Coupling Pull in Opposite Directions",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "capstone",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms"
    ]
  },
  {
    "slug": "loss-vs-decoherence",
    "title": "Photon Loss Is Not the Same Kind of Error as Decoherence",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/photonic-qubits",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "photonic-qubits"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/photonic-qubits"
    ]
  },
  {
    "slug": "manufacturability-isnt-automatically-decisive",
    "title": "Why Manufacturability Alone Doesn't Settle the Question",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/spin-qubits",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "spin-qubits",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/spin-qubits"
    ]
  },
  {
    "slug": "photon-encoding-options",
    "title": "Which Property Can Encode a Photonic Qubit?",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/photonic-qubits",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "photonic-qubits"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/photonic-qubits"
    ]
  },
  {
    "slug": "pi-pulse-duration-25mhz",
    "title": "π-Pulse Duration at Ω=2π×25 MHz",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/superconducting-qubits",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "superconducting-qubits",
      "rabi"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/superconducting-qubits"
    ]
  },
  {
    "slug": "quantum-dot-particle-in-box-parallel",
    "title": "The Quantum Dot Is a Real Particle-in-a-Box",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/spin-qubits",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "spin-qubits"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/spin-qubits"
    ]
  },
  {
    "slug": "recommend-platform-for-networking",
    "title": "Which Platform Fits a Networking-First Application?",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "capstone"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms"
    ]
  },
  {
    "slug": "rydberg-blockade-mechanism",
    "title": "What Does Rydberg Blockade Actually Do?",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/neutral-atoms",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "neutral-atoms"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/neutral-atoms"
    ]
  },
  {
    "slug": "shared-motional-mode-mechanism",
    "title": "How Do Two Trapped Ions Become Entangled?",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/trapped-ions",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "trapped-ions"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/trapped-ions"
    ]
  },
  {
    "slug": "spin-qubit-scalability-source",
    "title": "Where Does Spin Qubits' Scalability Argument Come From?",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/spin-qubits",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "spin-qubits"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/spin-qubits"
    ]
  },
  {
    "slug": "tweezers-vs-gate-lasers",
    "title": "Trapping Light vs. Gate Light",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/neutral-atoms",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "neutral-atoms"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/neutral-atoms"
    ]
  },
  {
    "slug": "why-josephson-junction-needed",
    "title": "Why a Plain LC Circuit Can't Be a Qubit",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/superconducting-qubits",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "superconducting-qubits"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/superconducting-qubits"
    ]
  },
  {
    "slug": "why-optical-tweezers-work-for-neutral-atoms",
    "title": "Why Optical Tweezers, Not Electric Fields, Trap Neutral Atoms",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/neutral-atoms",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "neutral-atoms"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/neutral-atoms"
    ]
  },
  {
    "slug": "why-photon-photon-gates-are-hard",
    "title": "Why Two-Photon Gates Lack a Direct Interaction Mechanism",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/photonic-qubits",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "photonic-qubits"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/photonic-qubits"
    ]
  },
  {
    "slug": "why-static-fields-cant-trap",
    "title": "Why a Static Electric Field Can't Trap an Ion in 3D",
    "course": "physical-qubit-platforms",
    "lesson": "quantum-hardware/physical-qubit-platforms/trapped-ions",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "trapped-ions"
    ],
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/trapped-ions"
    ]
  },
  {
    "slug": "bbbv-scope-multiple-choice",
    "title": "What the BBBV Bound Does and Doesn't Establish",
    "course": "advanced-algorithms-and-complexity",
    "lesson": "quantum-mastery/advanced-algorithms-and-complexity/bqp-and-oracle-complexity",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "bqp",
      "grover",
      "bbbv",
      "np"
    ],
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/bqp-and-oracle-complexity"
    ]
  },
  {
    "slug": "classical-variance-independence-mc",
    "title": "Why the Classical Walk's Variance Is Exact, Not Asymptotic",
    "course": "advanced-algorithms-and-complexity",
    "lesson": "quantum-mastery/advanced-algorithms-and-complexity/quantum-walks",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "quantum-walks",
      "classical-random-walk"
    ],
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/quantum-walks"
    ]
  },
  {
    "slug": "commuting-terms-zero-error",
    "title": "Trotter Error When [A,B]=0",
    "course": "advanced-algorithms-and-complexity",
    "lesson": "quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "trotterization",
      "commutators"
    ],
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization"
    ]
  },
  {
    "slug": "dj-classical-queries-n12",
    "title": "Deutsch-Jozsa's Exact Classical Query Count at n=12",
    "course": "advanced-algorithms-and-complexity",
    "lesson": "quantum-mastery/advanced-algorithms-and-complexity/bqp-and-oracle-complexity",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "bqp",
      "oracle-complexity",
      "deutsch-jozsa"
    ],
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/bqp-and-oracle-complexity"
    ]
  },
  {
    "slug": "gradient-variance-at-n4-recall",
    "title": "Extrapolating Gradient Variance from n=4 to n=6",
    "course": "advanced-algorithms-and-complexity",
    "lesson": "quantum-mastery/advanced-algorithms-and-complexity/barren-plateaus-and-variational-trainability",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "barren-plateaus",
      "vqe"
    ],
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/barren-plateaus-and-variational-trainability"
    ]
  },
  {
    "slug": "qpe-best-estimate-probability-phi-1-5",
    "title": "QPE Success Probability for φ=1/5, t=4",
    "course": "advanced-algorithms-and-complexity",
    "lesson": "quantum-mastery/advanced-algorithms-and-complexity/phase-estimation-precision-and-qft-depth",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "phase-estimation",
      "closed-form"
    ],
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/phase-estimation-precision-and-qft-depth"
    ]
  },
  {
    "slug": "qpe-tail-bound-at-j5",
    "title": "QPE Tail-Probability Bound at j=5",
    "course": "advanced-algorithms-and-complexity",
    "lesson": "quantum-mastery/advanced-algorithms-and-complexity/phase-estimation-precision-and-qft-depth",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "phase-estimation",
      "tail-bound"
    ],
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/phase-estimation-precision-and-qft-depth"
    ]
  },
  {
    "slug": "quantum-walk-displacement-at-10000",
    "title": "Classical Steps Needed to Match 10000 Quantum Walk Steps",
    "course": "advanced-algorithms-and-complexity",
    "lesson": "quantum-mastery/advanced-algorithms-and-complexity/quantum-walks",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "quantum-walks",
      "ballistic-spreading",
      "diffusive-spreading"
    ],
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/quantum-walks"
    ]
  },
  {
    "slug": "three-walls-classification-mc",
    "title": "Classifying the Course's Three Walls",
    "course": "advanced-algorithms-and-complexity",
    "lesson": "quantum-mastery/advanced-algorithms-and-complexity/capstone-what-scale-actually-requires",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "capstone",
      "synthesis"
    ],
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/capstone-what-scale-actually-requires"
    ]
  },
  {
    "slug": "trotter-steps-for-target-error",
    "title": "Trotter Steps Needed for a Target Error",
    "course": "advanced-algorithms-and-complexity",
    "lesson": "quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "trotterization",
      "error-bound",
      "hamiltonian-simulation"
    ],
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization"
    ]
  },
  {
    "slug": "why-shors-evades-wall-one",
    "title": "Why Shor's Algorithm Evades the Oracle-Separation Wall",
    "course": "advanced-algorithms-and-complexity",
    "lesson": "quantum-mastery/advanced-algorithms-and-complexity/capstone-what-scale-actually-requires",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "capstone",
      "synthesis",
      "shors-algorithm"
    ],
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/capstone-what-scale-actually-requires"
    ]
  },
  {
    "slug": "zero-mean-not-sufficient-mc",
    "title": "Why Zero Mean Gradient Isn't the Barren Plateau",
    "course": "advanced-algorithms-and-complexity",
    "lesson": "quantum-mastery/advanced-algorithms-and-complexity/barren-plateaus-and-variational-trainability",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "barren-plateaus",
      "gradients"
    ],
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/barren-plateaus-and-variational-trainability"
    ]
  },
  {
    "slug": "dirichlet-kernel-peak-height",
    "title": "How Tall Is the Delta-Sequence's Peak?",
    "course": "hilbert-space-and-spectral-theory",
    "lesson": "quantum-mastery/hilbert-space-and-spectral-theory/continuous-spectra-and-rigged-hilbert-space",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "rigged-hilbert-space",
      "delta-function",
      "fourier"
    ],
    "prerequisites": [
      "quantum-mastery/hilbert-space-and-spectral-theory/continuous-spectra-and-rigged-hilbert-space"
    ]
  },
  {
    "slug": "fourth-rung-of-the-ladder",
    "title": "The Third Rung, From Any of the Four Directions",
    "course": "hilbert-space-and-spectral-theory",
    "lesson": "quantum-mastery/hilbert-space-and-spectral-theory/capstone-what-rigor-buys-you",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "capstone",
      "infinite-well",
      "synthesis"
    ],
    "prerequisites": [
      "quantum-mastery/hilbert-space-and-spectral-theory/capstone-what-rigor-buys-you"
    ]
  },
  {
    "slug": "free-particle-greens-function-magnitude",
    "title": "Magnitude of the Free-Particle Green's Function",
    "course": "hilbert-space-and-spectral-theory",
    "lesson": "quantum-mastery/hilbert-space-and-spectral-theory/greens-functions-and-resolvents",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "greens-functions",
      "resolvent",
      "free-particle"
    ],
    "prerequisites": [
      "quantum-mastery/hilbert-space-and-spectral-theory/greens-functions-and-resolvents"
    ]
  },
  {
    "slug": "half-line-deficiency-normalization",
    "title": "Is the Deficiency Solution Normalizable?",
    "course": "hilbert-space-and-spectral-theory",
    "lesson": "quantum-mastery/hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "self-adjointness",
      "deficiency-indices",
      "half-line"
    ],
    "prerequisites": [
      "quantum-mastery/hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness"
    ]
  },
  {
    "slug": "infinite-well-orthogonality-check",
    "title": "Predict the Overlap of Two Different Eigenstates",
    "course": "hilbert-space-and-spectral-theory",
    "lesson": "quantum-mastery/hilbert-space-and-spectral-theory/sturm-liouville-theory",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "sturm-liouville",
      "orthogonality"
    ],
    "prerequisites": [
      "quantum-mastery/hilbert-space-and-spectral-theory/sturm-liouville-theory"
    ]
  },
  {
    "slug": "infinite-well-pole-location",
    "title": "Where Is the First Pole for a Different Half-Width?",
    "course": "hilbert-space-and-spectral-theory",
    "lesson": "quantum-mastery/hilbert-space-and-spectral-theory/greens-functions-and-resolvents",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "greens-functions",
      "resolvent",
      "infinite-well"
    ],
    "prerequisites": [
      "quantum-mastery/hilbert-space-and-spectral-theory/greens-functions-and-resolvents"
    ]
  },
  {
    "slug": "pvm-outcome-probability",
    "title": "P(outcome ≤ 1.5) from the Staircase PVM",
    "course": "hilbert-space-and-spectral-theory",
    "lesson": "quantum-mastery/hilbert-space-and-spectral-theory/the-spectral-theorem-for-unbounded-operators",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "spectral-theorem",
      "pvm",
      "born-rule"
    ],
    "prerequisites": [
      "quantum-mastery/hilbert-space-and-spectral-theory/the-spectral-theorem-for-unbounded-operators"
    ]
  },
  {
    "slug": "symmetric-versus-self-adjoint",
    "title": "What Exactly Is the Gap Between Symmetric and Self-Adjoint?",
    "course": "hilbert-space-and-spectral-theory",
    "lesson": "quantum-mastery/hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "self-adjointness",
      "domains",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mastery/hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness"
    ]
  },
  {
    "slug": "why-p-p-diverges",
    "title": "Why ⟨p|p⟩ Diverges, and Why That's Not a Problem",
    "course": "hilbert-space-and-spectral-theory",
    "lesson": "quantum-mastery/hilbert-space-and-spectral-theory/continuous-spectra-and-rigged-hilbert-space",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "rigged-hilbert-space",
      "momentum-eigenstates",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mastery/hilbert-space-and-spectral-theory/continuous-spectra-and-rigged-hilbert-space"
    ]
  },
  {
    "slug": "why-staircase-gives-a-sum",
    "title": "Why a Staircase PVM Reduces the Integral to a Sum",
    "course": "hilbert-space-and-spectral-theory",
    "lesson": "quantum-mastery/hilbert-space-and-spectral-theory/the-spectral-theorem-for-unbounded-operators",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "spectral-theorem",
      "pvm",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mastery/hilbert-space-and-spectral-theory/the-spectral-theorem-for-unbounded-operators"
    ]
  },
  {
    "slug": "why-the-shortcuts-never-failed",
    "title": "Why the Earlier Curriculum's Shortcuts Never Produced a Wrong Answer",
    "course": "hilbert-space-and-spectral-theory",
    "lesson": "quantum-mastery/hilbert-space-and-spectral-theory/capstone-what-rigor-buys-you",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "conceptual",
    "tags": [
      "capstone",
      "self-adjointness",
      "synthesis",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mastery/hilbert-space-and-spectral-theory/capstone-what-rigor-buys-you"
    ]
  },
  {
    "slug": "why-u-zero-kills-the-boundary-term",
    "title": "Why u(0)=0 Is Enough at the Radial Equation's Singular Origin",
    "course": "hilbert-space-and-spectral-theory",
    "lesson": "quantum-mastery/hilbert-space-and-spectral-theory/sturm-liouville-theory",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "sturm-liouville",
      "boundary-conditions",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mastery/hilbert-space-and-spectral-theory/sturm-liouville-theory"
    ]
  },
  {
    "slug": "average-teleportation-fidelity",
    "title": "Average Teleportation Fidelity from Singlet Fraction",
    "course": "quantum-information-theory",
    "lesson": "quantum-mastery/quantum-information-theory/rigorous-teleportation-and-superdense-coding",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "teleportation",
      "fidelity"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/rigorous-teleportation-and-superdense-coding"
    ]
  },
  {
    "slug": "choi-block-eigenvalue-at-gamma",
    "title": "Amplitude Damping's Choi-Matrix Block Eigenvalue",
    "course": "quantum-information-theory",
    "lesson": "quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "choi-matrix",
      "amplitude-damping"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi"
    ]
  },
  {
    "slug": "coherence-decay-rate-half-population",
    "title": "Why Amplitude Damping's Coherence Decays at Half the Population Rate",
    "course": "quantum-information-theory",
    "lesson": "quantum-mastery/quantum-information-theory/the-lindblad-master-equation",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "lindblad",
      "amplitude-damping"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/the-lindblad-master-equation"
    ]
  },
  {
    "slug": "combined-t2-from-two-processes",
    "title": "Combined T2 from Amplitude Damping and Pure Dephasing",
    "course": "quantum-information-theory",
    "lesson": "quantum-mastery/quantum-information-theory/the-lindblad-master-equation",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "lindblad",
      "t1-t2"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/the-lindblad-master-equation"
    ]
  },
  {
    "slug": "css-commutation-condition",
    "title": "Why CSS Stabilizer Generators Require C2 Contained in C1",
    "course": "quantum-information-theory",
    "lesson": "quantum-mastery/quantum-information-theory/css-codes-and-the-general-stabilizer-formalism",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "css-codes",
      "stabilizer-formalism"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/css-codes-and-the-general-stabilizer-formalism"
    ]
  },
  {
    "slug": "fuchs-van-de-graaf-pure-equality",
    "title": "Why the Upper Fuchs-van de Graaf Bound Is Tight for Pure States",
    "course": "quantum-information-theory",
    "lesson": "quantum-mastery/quantum-information-theory/trace-distance-and-fidelity",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "fuchs-van-de-graaf",
      "trace-distance",
      "fidelity"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/trace-distance-and-fidelity"
    ]
  },
  {
    "slug": "purification-unitary-freedom",
    "title": "Why Purifications of the Same State Are Related by a Unitary on B Alone",
    "course": "quantum-information-theory",
    "lesson": "quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "conceptual",
    "tags": [
      "purification",
      "non-uniqueness"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification"
    ]
  },
  {
    "slug": "relative-entropy-near-pure",
    "title": "Relative Entropy for a Nearly Pure State vs. the Maximally Mixed State",
    "course": "quantum-information-theory",
    "lesson": "quantum-mastery/quantum-information-theory/relative-entropy-and-mixed-state-entanglement",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "relative-entropy",
      "klein-inequality"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/relative-entropy-and-mixed-state-entanglement"
    ]
  },
  {
    "slug": "schmidt-coefficients-to-entropy",
    "title": "Entanglement Entropy from Schmidt Coefficients",
    "course": "quantum-information-theory",
    "lesson": "quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "schmidt-decomposition",
      "entanglement-entropy"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification"
    ]
  },
  {
    "slug": "steane-codespace-dimension",
    "title": "Steane Code Codespace Dimension from Generator Count",
    "course": "quantum-information-theory",
    "lesson": "quantum-mastery/quantum-information-theory/css-codes-and-the-general-stabilizer-formalism",
    "difficulty": "master",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "stabilizer-formalism",
      "css-codes"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/css-codes-and-the-general-stabilizer-formalism"
    ]
  },
  {
    "slug": "superdense-lambda-for-target-success",
    "title": "Dephasing Strength for a Target Superdense-Coding Success Rate",
    "course": "quantum-information-theory",
    "lesson": "quantum-mastery/quantum-information-theory/rigorous-teleportation-and-superdense-coding",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "superdense-coding",
      "dephasing"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/rigorous-teleportation-and-superdense-coding"
    ]
  },
  {
    "slug": "trace-distance-at-half-damping",
    "title": "Trace Distance for Amplitude Damping at gamma=0.5",
    "course": "quantum-information-theory",
    "lesson": "quantum-mastery/quantum-information-theory/trace-distance-and-fidelity",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "trace-distance",
      "amplitude-damping"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/trace-distance-and-fidelity"
    ]
  },
  {
    "slug": "werner-concurrence-at-half",
    "title": "Werner-State Concurrence at p=0.5",
    "course": "quantum-information-theory",
    "lesson": "quantum-mastery/quantum-information-theory/relative-entropy-and-mixed-state-entanglement",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "concurrence",
      "werner-state"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/relative-entropy-and-mixed-state-entanglement"
    ]
  },
  {
    "slug": "zero-eigenvalue-still-cp",
    "title": "A Zero Choi Eigenvalue Does Not Threaten Complete Positivity",
    "course": "quantum-information-theory",
    "lesson": "quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi",
    "difficulty": "master",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "choi-matrix",
      "complete-positivity"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi"
    ]
  },
  {
    "slug": "capacity-entanglement-breaking-threshold",
    "title": "Where the Depolarizing Channel's Quantum Capacity Provably Hits Zero",
    "course": "quantum-shannon-theory",
    "lesson": "quantum-mastery/quantum-shannon-theory/capstone-what-can-be-sent-through-noise",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "quantum-capacity",
      "entanglement-breaking",
      "depolarizing-channel"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-shannon-theory/capstone-what-can-be-sent-through-noise"
    ]
  },
  {
    "slug": "data-processing-locc-entanglement",
    "title": "Why LOCC Can Never Increase Entanglement",
    "course": "quantum-shannon-theory",
    "lesson": "quantum-mastery/quantum-shannon-theory/the-data-processing-inequality",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "data-processing-inequality",
      "locc",
      "entanglement-monotone"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-shannon-theory/the-data-processing-inequality"
    ]
  },
  {
    "slug": "data-processing-mutual-information-at-lambda",
    "title": "Mutual Information After Dephasing at lambda=0.6",
    "course": "quantum-shannon-theory",
    "lesson": "quantum-mastery/quantum-shannon-theory/the-data-processing-inequality",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "data-processing-inequality",
      "mutual-information",
      "dephasing-channel"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-shannon-theory/the-data-processing-inequality"
    ]
  },
  {
    "slug": "distillation-rate-from-entanglement-entropy",
    "title": "Distillable Bell Pairs from Entanglement Concentration",
    "course": "quantum-shannon-theory",
    "lesson": "quantum-mastery/quantum-shannon-theory/entanglement-distillation-and-typical-subspaces",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "entanglement-distillation",
      "entanglement-concentration",
      "typical-subspace"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-shannon-theory/entanglement-distillation-and-typical-subspaces"
    ]
  },
  {
    "slug": "holevo-chi-bb84-at-p",
    "title": "The Holevo Quantity for a Non-Orthogonal Ensemble Through Noise",
    "course": "quantum-shannon-theory",
    "lesson": "quantum-mastery/quantum-shannon-theory/capstone-what-can-be-sent-through-noise",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "holevo-quantity",
      "classical-capacity",
      "depolarizing-channel"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-shannon-theory/capstone-what-can-be-sent-through-noise"
    ]
  },
  {
    "slug": "mutual-information-classical-correlation",
    "title": "Mutual Information of an Asymmetric Classically Correlated State",
    "course": "quantum-shannon-theory",
    "lesson": "quantum-mastery/quantum-shannon-theory/quantum-entropy-and-information-measures",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "numeric",
    "tags": [
      "quantum-mutual-information",
      "von-neumann-entropy",
      "classical-correlation"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-shannon-theory/quantum-entropy-and-information-measures"
    ]
  },
  {
    "slug": "negative-conditional-entropy-explanation",
    "title": "Why S(A|B) = -1 Bit for the Bell State Is Not a Paradox",
    "course": "quantum-shannon-theory",
    "lesson": "quantum-mastery/quantum-shannon-theory/quantum-entropy-and-information-measures",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "conceptual",
    "tags": [
      "conditional-entropy",
      "entanglement",
      "state-merging"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-shannon-theory/quantum-entropy-and-information-measures"
    ]
  },
  {
    "slug": "normalizing-a-four-outcome-qubit-povm",
    "title": "Normalizing a Four-Outcome Qubit POVM",
    "course": "quantum-shannon-theory",
    "lesson": "quantum-mastery/quantum-shannon-theory/povms-and-generalized-measurement",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "povm",
      "completeness-relation"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-shannon-theory/povms-and-generalized-measurement"
    ]
  },
  {
    "slug": "stinespring-environment-outcome-probability",
    "title": "Probability the Environment Learns a Decay Occurred",
    "course": "quantum-shannon-theory",
    "lesson": "quantum-mastery/quantum-shannon-theory/stinespring-dilation-and-channel-purification",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "stinespring-dilation",
      "amplitude-damping",
      "kraus-operators"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-shannon-theory/stinespring-dilation-and-channel-purification"
    ]
  },
  {
    "slug": "stinespring-kraus-nonuniqueness-entry",
    "title": "A Rotated Kraus Operator from Environment-Basis Freedom",
    "course": "quantum-shannon-theory",
    "lesson": "quantum-mastery/quantum-shannon-theory/stinespring-dilation-and-channel-purification",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "numeric",
    "tags": [
      "stinespring-dilation",
      "kraus-nonuniqueness",
      "amplitude-damping"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-shannon-theory/stinespring-dilation-and-channel-purification"
    ]
  },
  {
    "slug": "typical-subspace-probability-mass",
    "title": "How Much Probability Sits in the Typical Set?",
    "course": "quantum-shannon-theory",
    "lesson": "quantum-mastery/quantum-shannon-theory/entanglement-distillation-and-typical-subspaces",
    "difficulty": "master",
    "estimatedMinutes": 8,
    "problemType": "numeric",
    "tags": [
      "typical-subspace",
      "binomial-distribution",
      "entanglement-distillation"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-shannon-theory/entanglement-distillation-and-typical-subspaces"
    ]
  },
  {
    "slug": "unambiguous-discrimination-success-probability",
    "title": "Success Probability of Optimal Unambiguous Discrimination",
    "course": "quantum-shannon-theory",
    "lesson": "quantum-mastery/quantum-shannon-theory/povms-and-generalized-measurement",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "povm",
      "unambiguous-state-discrimination",
      "naimark"
    ],
    "prerequisites": [
      "quantum-mastery/quantum-shannon-theory/povms-and-generalized-measurement"
    ]
  },
  {
    "slug": "2p-to-3p-splitting-ratio",
    "title": "The n³ Scaling of Spin-Orbit Splitting",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "lesson": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/degenerate-perturbation-theory-and-fine-structure",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "fine-structure",
      "hydrogen",
      "scaling"
    ],
    "prerequisites": [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/degenerate-perturbation-theory-and-fine-structure"
    ]
  },
  {
    "slug": "3p-spin-orbit-splitting",
    "title": "Spin-Orbit Splitting of the 3p Level",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "lesson": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/degenerate-perturbation-theory-and-fine-structure",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "fine-structure",
      "degenerate-perturbation-theory",
      "hydrogen"
    ],
    "prerequisites": [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/degenerate-perturbation-theory-and-fine-structure"
    ]
  },
  {
    "slug": "berry-phase-at-90-degrees",
    "title": "Berry Phase for a Field Sweeping the Equator",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "lesson": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/the-adiabatic-theorem-and-berry-phase",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "berry-phase",
      "adiabatic-theorem"
    ],
    "prerequisites": [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/the-adiabatic-theorem-and-berry-phase"
    ]
  },
  {
    "slug": "cg-coefficient-value",
    "title": "Reading a Clebsch-Gordan Coefficient Off the l=1⊗s=1/2 Table",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "lesson": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/clebsch-gordan-coefficients-and-the-wigner-eckart-theorem",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "clebsch-gordan",
      "angular-momentum"
    ],
    "prerequisites": [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/clebsch-gordan-coefficients-and-the-wigner-eckart-theorem"
    ]
  },
  {
    "slug": "coherent-state-mean-photon-number",
    "title": "Second Moment of the Photon Number in a Coherent State",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "lesson": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/coherent-and-squeezed-states",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "coherent-states",
      "harmonic-oscillator",
      "ladder-operators"
    ],
    "prerequisites": [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/coherent-and-squeezed-states"
    ]
  },
  {
    "slug": "cross-section-ratio-at-ka-1",
    "title": "s-Wave Cross Section as a Fraction of the Low-Energy Limit",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "lesson": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/three-dimensional-scattering-and-the-s-matrix",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "scattering",
      "partial-waves"
    ],
    "prerequisites": [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/three-dimensional-scattering-and-the-s-matrix"
    ]
  },
  {
    "slug": "dynamical-equals-geometric-phase-duration",
    "title": "When Does the Dynamical Phase Catch Up to the Geometric Phase?",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "lesson": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/capstone-symmetry-and-the-classical-limit",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "berry-phase",
      "adiabatic-theorem",
      "synthesis"
    ],
    "prerequisites": [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/capstone-symmetry-and-the-classical-limit"
    ]
  },
  {
    "slug": "hard-sphere-cross-section-at-ka-half",
    "title": "Where the Hard Sphere Reaches Half Its Unitarity Bound",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "lesson": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/three-dimensional-scattering-and-the-s-matrix",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "scattering",
      "partial-waves",
      "s-matrix",
      "unitarity"
    ],
    "prerequisites": [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/three-dimensional-scattering-and-the-s-matrix"
    ]
  },
  {
    "slug": "j1-j1-top-multiplet-size",
    "title": "Selection Rules Inside the Top Multiplet of j=1 ⊗ j=1",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "lesson": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/clebsch-gordan-coefficients-and-the-wigner-eckart-theorem",
    "difficulty": "master",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "clebsch-gordan",
      "wigner-eckart",
      "selection-rules",
      "angular-momentum"
    ],
    "prerequisites": [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/clebsch-gordan-coefficients-and-the-wigner-eckart-theorem"
    ]
  },
  {
    "slug": "squeezed-state-delta-x-at-r-1",
    "title": "Position Uncertainty of a Squeezed State at r=1",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "lesson": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/coherent-and-squeezed-states",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "squeezed-states",
      "uncertainty"
    ],
    "prerequisites": [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/coherent-and-squeezed-states"
    ]
  },
  {
    "slug": "why-berry-phase-is-rate-independent",
    "title": "Why the Berry Phase Doesn't Depend on How Fast the Loop Is Traversed",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "lesson": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/the-adiabatic-theorem-and-berry-phase",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "berry-phase",
      "adiabatic-theorem",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/the-adiabatic-theorem-and-berry-phase"
    ]
  },
  {
    "slug": "wkb-as-quantized-adiabatic-invariant",
    "title": "WKB Quantization as a Quantized Classical Adiabatic Invariant",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "lesson": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/capstone-symmetry-and-the-classical-limit",
    "difficulty": "master",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "wkb",
      "adiabatic-invariance",
      "synthesis",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/capstone-symmetry-and-the-classical-limit"
    ]
  },
  {
    "slug": "amplitude-damping-trace-check",
    "title": "Checking K₀†K₀+K₁†K₁'s (1,1) Entry for γ=0.4",
    "course": "advanced-quantum-mechanics",
    "lesson": "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "open-systems",
      "kraus-operators"
    ],
    "prerequisites": [
      "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators"
    ]
  },
  {
    "slug": "channels-reused-in-hardware-pillar",
    "title": "What Amplitude Damping and Dephasing Each Leave Behind",
    "course": "advanced-quantum-mechanics",
    "lesson": "quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "capstone",
      "open-systems",
      "decoherence"
    ],
    "prerequisites": [
      "quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths"
    ]
  },
  {
    "slug": "composition-law-relative-error",
    "title": "How Close Does the Discretized Sum Get?",
    "course": "advanced-quantum-mechanics",
    "lesson": "quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "path-integral"
    ],
    "prerequisites": [
      "quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation"
    ]
  },
  {
    "slug": "decoherence-vs-collapse",
    "title": "Decoherence Is Not Wavefunction Collapse",
    "course": "advanced-quantum-mechanics",
    "lesson": "quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "decoherence",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition"
    ]
  },
  {
    "slug": "euclidean-propagator-at-origin",
    "title": "The Euclidean Propagator for No Net Motion",
    "course": "advanced-quantum-mechanics",
    "lesson": "quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "path-integral"
    ],
    "prerequisites": [
      "quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation"
    ]
  },
  {
    "slug": "identifying-invalid-kraus-set",
    "title": "Which Kraus Set Is NOT Trace-Preserving?",
    "course": "advanced-quantum-mechanics",
    "lesson": "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "open-systems",
      "kraus-operators"
    ],
    "prerequisites": [
      "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators"
    ]
  },
  {
    "slug": "long-run-purity-limit",
    "title": "The Long-Run Purity Limit Under Repeated Dephasing",
    "course": "advanced-quantum-mechanics",
    "lesson": "quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "decoherence"
    ],
    "prerequisites": [
      "quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition"
    ]
  },
  {
    "slug": "off-diagonal-after-three-applications",
    "title": "Off-Diagonal Magnitude After 3 Dephasing Applications",
    "course": "advanced-quantum-mechanics",
    "lesson": "quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "decoherence"
    ],
    "prerequisites": [
      "quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition"
    ]
  },
  {
    "slug": "stating-the-measurement-overclaim",
    "title": "Stating the Decoherence Overclaim Precisely",
    "course": "advanced-quantum-mechanics",
    "lesson": "quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths",
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "capstone",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths"
    ]
  },
  {
    "slug": "strongest-consistency-evidence",
    "title": "The Strongest Evidence for Operator/Path-Integral Consistency in This Course",
    "course": "advanced-quantum-mechanics",
    "lesson": "quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "capstone",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths"
    ]
  },
  {
    "slug": "unitary-as-special-kraus-case",
    "title": "Why Unitary Evolution Is a Special Case of Kraus Channels",
    "course": "advanced-quantum-mechanics",
    "lesson": "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "open-systems",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators"
    ]
  },
  {
    "slug": "why-wick-rotation-helps",
    "title": "Why Euclidean Time Makes the Path Sum Numerically Tractable",
    "course": "advanced-quantum-mechanics",
    "lesson": "quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "path-integral",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation"
    ]
  },
  {
    "slug": "allowed-m-values-for-j-three-halves",
    "title": "Allowed m Values for j=3/2",
    "course": "angular-momentum-and-spin",
    "lesson": "quantum-mechanics/angular-momentum-and-spin/ladder-operators-and-the-angular-momentum-spectrum",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "angular-momentum",
      "ladder-operators"
    ],
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/ladder-operators-and-the-angular-momentum-spectrum"
    ]
  },
  {
    "slug": "ground-state-angular-dependence",
    "title": "Predicting Hydrogen's Ground-State Angular Shape",
    "course": "angular-momentum-and-spin",
    "lesson": "quantum-mechanics/angular-momentum-and-spin/capstone-from-abstract-algebra-to-the-hydrogen-atom",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "capstone",
      "hydrogen-preview"
    ],
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/capstone-from-abstract-algebra-to-the-hydrogen-atom"
    ]
  },
  {
    "slug": "j-raising-operator-top-state",
    "title": "J+ Acting on the Top Rung, j=3/2",
    "course": "angular-momentum-and-spin",
    "lesson": "quantum-mechanics/angular-momentum-and-spin/ladder-operators-and-the-angular-momentum-spectrum",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "angular-momentum",
      "ladder-operators"
    ],
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/ladder-operators-and-the-angular-momentum-spectrum"
    ]
  },
  {
    "slug": "jx-jy-commutator-j2",
    "title": "Checking [Jx,Jy]=iJz for j=2",
    "course": "angular-momentum-and-spin",
    "lesson": "quantum-mechanics/angular-momentum-and-spin/angular-momentum-commutation-relations",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "angular-momentum",
      "commutators"
    ],
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/angular-momentum-commutation-relations"
    ]
  },
  {
    "slug": "l-equals-2-degeneracy-count",
    "title": "From the Commutation Relations to Hydrogen's Shell Degeneracy",
    "course": "angular-momentum-and-spin",
    "lesson": "quantum-mechanics/angular-momentum-and-spin/capstone-from-abstract-algebra-to-the-hydrogen-atom",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "capstone",
      "degeneracy",
      "synthesis"
    ],
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/capstone-from-abstract-algebra-to-the-hydrogen-atom"
    ]
  },
  {
    "slug": "repeated-same-axis-measurement",
    "title": "Measuring the Same Axis Twice in a Row",
    "course": "angular-momentum-and-spin",
    "lesson": "quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "stern-gerlach"
    ],
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment"
    ]
  },
  {
    "slug": "sequential-sg-joint-probability",
    "title": "Joint Probability for a Different SG Sequence",
    "course": "angular-momentum-and-spin",
    "lesson": "quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "stern-gerlach"
    ],
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment"
    ]
  },
  {
    "slug": "singlet-matches-bell-state",
    "title": "Which Bell State Is the Spin Singlet?",
    "course": "angular-momentum-and-spin",
    "lesson": "quantum-mechanics/angular-momentum-and-spin/addition-of-angular-momentum",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "addition-of-angular-momentum",
      "bell-states"
    ],
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/addition-of-angular-momentum"
    ]
  },
  {
    "slug": "spin-squared-eigenvalue",
    "title": "S² Eigenvalue for Spin-1/2 (in units of ħ²)",
    "course": "angular-momentum-and-spin",
    "lesson": "quantum-mechanics/angular-momentum-and-spin/spin-one-half-systems",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "spin"
    ],
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/spin-one-half-systems"
    ]
  },
  {
    "slug": "triplet-up-jz-eigenvalue",
    "title": "Jz Eigenvalue of |↑↑⟩",
    "course": "angular-momentum-and-spin",
    "lesson": "quantum-mechanics/angular-momentum-and-spin/addition-of-angular-momentum",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "addition-of-angular-momentum"
    ],
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/addition-of-angular-momentum"
    ]
  },
  {
    "slug": "verify-lx-ly-commutator-sign",
    "title": "The Sign of [Ly,Lx]",
    "course": "angular-momentum-and-spin",
    "lesson": "quantum-mechanics/angular-momentum-and-spin/angular-momentum-commutation-relations",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "angular-momentum",
      "commutators"
    ],
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/angular-momentum-commutation-relations"
    ]
  },
  {
    "slug": "why-half-integer-l-excluded",
    "title": "Why Half-Integer Orbital Angular Momentum Is Excluded",
    "course": "angular-momentum-and-spin",
    "lesson": "quantum-mechanics/angular-momentum-and-spin/orbital-angular-momentum-and-spherical-harmonics",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "spherical-harmonics",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/orbital-angular-momentum-and-spherical-harmonics"
    ]
  },
  {
    "slug": "why-spin-has-no-position-wavefunction",
    "title": "Why Spin Escapes the Integer-Only Restriction",
    "course": "angular-momentum-and-spin",
    "lesson": "quantum-mechanics/angular-momentum-and-spin/spin-one-half-systems",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "spin",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/spin-one-half-systems"
    ]
  },
  {
    "slug": "y00-normalization-check",
    "title": "Confirming Y₀⁰'s Normalization Numerically",
    "course": "angular-momentum-and-spin",
    "lesson": "quantum-mechanics/angular-momentum-and-spin/orbital-angular-momentum-and-spherical-harmonics",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "spherical-harmonics"
    ],
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/orbital-angular-momentum-and-spherical-harmonics"
    ]
  },
  {
    "slug": "anharmonic-first-order-shift",
    "title": "First-Order Ground-State Shift for λ=0.02",
    "course": "approximation-methods",
    "lesson": "quantum-mechanics/approximation-methods/time-independent-perturbation-theory",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "perturbation-theory"
    ],
    "prerequisites": [
      "quantum-mechanics/approximation-methods/time-independent-perturbation-theory"
    ]
  },
  {
    "slug": "bad-width-gives-worse-bound",
    "title": "A Poorly-Chosen Trial Width Gives a Worse Bound",
    "course": "approximation-methods",
    "lesson": "quantum-mechanics/approximation-methods/the-variational-method",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "variational-method"
    ],
    "prerequisites": [
      "quantum-mechanics/approximation-methods/the-variational-method"
    ]
  },
  {
    "slug": "proving-the-variational-theorem",
    "title": "Proving ⟨H⟩ ≥ E₀ for Any Normalized State",
    "course": "approximation-methods",
    "lesson": "quantum-mechanics/approximation-methods/the-variational-method",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "variational-method",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/approximation-methods/the-variational-method"
    ]
  },
  {
    "slug": "strong-coupling-breakdown-gap",
    "title": "How Far Off Is Perturbation Theory at Strong Coupling?",
    "course": "approximation-methods",
    "lesson": "quantum-mechanics/approximation-methods/time-dependent-perturbation-theory",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "time-dependent-perturbation-theory"
    ],
    "prerequisites": [
      "quantum-mechanics/approximation-methods/time-dependent-perturbation-theory"
    ]
  },
  {
    "slug": "transition-probability-weak-coupling",
    "title": "Transition Probability for V=0.01, ω=1, t=3",
    "course": "approximation-methods",
    "lesson": "quantum-mechanics/approximation-methods/time-dependent-perturbation-theory",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "time-dependent-perturbation-theory"
    ],
    "prerequisites": [
      "quantum-mechanics/approximation-methods/time-dependent-perturbation-theory"
    ]
  },
  {
    "slug": "unitarity-bounds-transition-probability",
    "title": "Why the Exact Transition Probability Can Never Exceed 1",
    "course": "approximation-methods",
    "lesson": "quantum-mechanics/approximation-methods/time-dependent-perturbation-theory",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "time-dependent-perturbation-theory",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/approximation-methods/time-dependent-perturbation-theory"
    ]
  },
  {
    "slug": "variational-energy-never-below-exact",
    "title": "The Optimized Trial Energy Minus the Exact Ground Energy",
    "course": "approximation-methods",
    "lesson": "quantum-mechanics/approximation-methods/the-variational-method",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "variational-method"
    ],
    "prerequisites": [
      "quantum-mechanics/approximation-methods/the-variational-method"
    ]
  },
  {
    "slug": "why-ground-state-second-order-is-negative",
    "title": "Why the Ground State's Second-Order Correction Is Always ≤0",
    "course": "approximation-methods",
    "lesson": "quantum-mechanics/approximation-methods/time-independent-perturbation-theory",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "perturbation-theory",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/approximation-methods/time-independent-perturbation-theory"
    ]
  },
  {
    "slug": "why-the-maslov-half-matters",
    "title": "What Happens Without the +1/2 in the WKB Condition?",
    "course": "approximation-methods",
    "lesson": "quantum-mechanics/approximation-methods/the-wkb-approximation",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "wkb"
    ],
    "prerequisites": [
      "quantum-mechanics/approximation-methods/the-wkb-approximation"
    ]
  },
  {
    "slug": "wkb-energy-for-n-equals-2",
    "title": "The WKB-Quantized Energy for n=2",
    "course": "approximation-methods",
    "lesson": "quantum-mechanics/approximation-methods/the-wkb-approximation",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "wkb"
    ],
    "prerequisites": [
      "quantum-mechanics/approximation-methods/the-wkb-approximation"
    ]
  },
  {
    "slug": "wkb-exactness-is-special-to-sho",
    "title": "Why the Harmonic Oscillator's WKB Exactness Doesn't Generalize",
    "course": "approximation-methods",
    "lesson": "quantum-mechanics/approximation-methods/the-wkb-approximation",
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "wkb",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/approximation-methods/the-wkb-approximation"
    ]
  },
  {
    "slug": "wrong-basis-for-perturbation-matrix",
    "title": "Which Basis Must H′ Be Expressed In?",
    "course": "approximation-methods",
    "lesson": "quantum-mechanics/approximation-methods/time-independent-perturbation-theory",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "perturbation-theory"
    ],
    "prerequisites": [
      "quantum-mechanics/approximation-methods/time-independent-perturbation-theory"
    ]
  },
  {
    "slug": "basis-dependence-of-interference",
    "title": "Why Interference Depends on the Measurement Basis",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/superposition-interference-and-phase",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "interference",
      "superposition"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/superposition-interference-and-phase"
    ]
  },
  {
    "slug": "classical-oscillator-energy",
    "title": "A Classical Observable Calculation",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/classical-states-and-observables",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "classical-mechanics",
      "phase-space"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/classical-states-and-observables"
    ]
  },
  {
    "slug": "classical-sum-comparison",
    "title": "The Classical Prediction, For Comparison",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/from-classical-to-quantum-probability",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "interference",
      "probability"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/from-classical-to-quantum-probability"
    ]
  },
  {
    "slug": "commutator-antisymmetry",
    "title": "[p,x] From [x,p]",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/position-and-momentum",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "commutators",
      "position-momentum"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/position-and-momentum"
    ]
  },
  {
    "slug": "commuting-observables-no-tradeoff",
    "title": "Why Commuting Observables Have No Uncertainty Trade-off",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "uncertainty",
      "commutators"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty"
    ]
  },
  {
    "slug": "cross-basis-probability",
    "title": "A Cross-Basis Measurement Probability",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/superposition-interference-and-phase",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "interference",
      "superposition"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/superposition-interference-and-phase"
    ]
  },
  {
    "slug": "epistemic-vs-quantum-probability",
    "title": "Epistemic vs. Quantum Probability",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/classical-states-and-observables",
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "classical-mechanics",
      "probability"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/classical-states-and-observables"
    ]
  },
  {
    "slug": "fully-destructive-cross-basis",
    "title": "Fully Destructive Interference in a Different Basis",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/superposition-interference-and-phase",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "interference",
      "superposition"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/superposition-interference-and-phase"
    ]
  },
  {
    "slug": "generator-must-be-hermitian",
    "title": "The Generator of Time Evolution",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "time-evolution",
      "schrodinger-equation"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation"
    ]
  },
  {
    "slug": "harmonic-oscillator-energy-level",
    "title": "An Energy Level Calculation",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "harmonic-oscillator",
      "energy-levels"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator"
    ]
  },
  {
    "slug": "ladder-lowering-coefficient",
    "title": "A Lowering-Operator Coefficient",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "harmonic-oscillator",
      "ladder-operators"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator"
    ]
  },
  {
    "slug": "minimum-momentum-uncertainty",
    "title": "Minimum Momentum Uncertainty",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/position-and-momentum",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "uncertainty",
      "position-momentum"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/position-and-momentum"
    ]
  },
  {
    "slug": "observable-operator-type",
    "title": "What Kind of Operator Represents an Observable",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "postulates"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics"
    ]
  },
  {
    "slug": "phase-for-equal-predictions",
    "title": "Where Quantum and Classical Predictions Agree",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/why-complex-amplitudes",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "complex-amplitudes",
      "interference"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/why-complex-amplitudes"
    ]
  },
  {
    "slug": "postulate-expectation-value",
    "title": "Expectation Value From the Postulates",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "postulates",
      "expectation-value"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics"
    ]
  },
  {
    "slug": "postulate-probability-calculation",
    "title": "Applying the Measurement Postulate",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics",
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "postulates",
      "born-rule"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics"
    ]
  },
  {
    "slug": "quantum-interference-calculation",
    "title": "A Quantum Interference Calculation",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/from-classical-to-quantum-probability",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "interference",
      "probability"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/from-classical-to-quantum-probability"
    ]
  },
  {
    "slug": "qubit-as-instance-of-postulates",
    "title": "Synthesis: A Qubit as an Instance of the Postulates",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/from-postulates-to-quantum-computing",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "conceptual",
    "tags": [
      "synthesis",
      "postulates",
      "quantum-computing"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/from-postulates-to-quantum-computing"
    ]
  },
  {
    "slug": "rabi-probability-at-time",
    "title": "Precession Probability at a Given Time",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "time-evolution",
      "schrodinger-equation"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation"
    ]
  },
  {
    "slug": "stationary-probability-check",
    "title": "A Stationary State's Probability Over Time",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/stationary-states",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "stationary-states"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/stationary-states"
    ]
  },
  {
    "slug": "three-qubit-dimension-synthesis",
    "title": "Synthesis: Three-Qubit State Space Dimension",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/from-postulates-to-quantum-computing",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "synthesis",
      "tensor-products",
      "quantum-computing"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/from-postulates-to-quantum-computing"
    ]
  },
  {
    "slug": "uncertainty-bound-yz",
    "title": "The Uncertainty Bound for Y and Z",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "uncertainty",
      "commutators"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty"
    ]
  },
  {
    "slug": "uncertainty-of-y-in-plus-state",
    "title": "Uncertainty of Pauli-Y in |+⟩",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "uncertainty",
      "pauli-operators"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty"
    ]
  },
  {
    "slug": "what-phase-provides",
    "title": "What a Complex Phase Provides",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/why-complex-amplitudes",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "complex-amplitudes"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/why-complex-amplitudes"
    ]
  },
  {
    "slug": "why-energy-is-conserved",
    "title": "Why ⟨H⟩ Is Conserved for Any State",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/stationary-states",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "stationary-states",
      "conservation"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/stationary-states"
    ]
  },
  {
    "slug": "why-gates-are-unitary",
    "title": "Synthesis: Why Every Quantum Gate Is Unitary",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/from-postulates-to-quantum-computing",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "synthesis",
      "postulates",
      "quantum-computing"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/from-postulates-to-quantum-computing"
    ]
  },
  {
    "slug": "zero-point-energy",
    "title": "Why the Ground State Cannot Sit at the Bottom",
    "course": "classical-to-quantum",
    "lesson": "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "multiple-choice",
    "tags": [
      "harmonic-oscillator",
      "zero-point-energy",
      "uncertainty"
    ],
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator"
    ]
  },
  {
    "slug": "antisymmetric-eigenvalue-check",
    "title": "Confirming the -1 Eigenvalue Numerically",
    "course": "identical-particles",
    "lesson": "quantum-mechanics/identical-particles/bosons-and-fermions",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "fermions",
      "exchange-operator"
    ],
    "prerequisites": [
      "quantum-mechanics/identical-particles/bosons-and-fermions"
    ]
  },
  {
    "slug": "bosons-vs-fermions-clustering",
    "title": "Why Bosons Can Cluster and Fermions Cannot",
    "course": "identical-particles",
    "lesson": "quantum-mechanics/identical-particles/the-pauli-exclusion-principle",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "pauli-exclusion",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/identical-particles/the-pauli-exclusion-principle"
    ]
  },
  {
    "slug": "oxygen-2p-electron-count",
    "title": "How Many 2p Electrons Does Oxygen Have?",
    "course": "identical-particles",
    "lesson": "quantum-mechanics/identical-particles/multi-electron-atoms-introduction",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "shell-filling"
    ],
    "prerequisites": [
      "quantum-mechanics/identical-particles/multi-electron-atoms-introduction"
    ]
  },
  {
    "slug": "photon-vs-electron-statistics",
    "title": "Spin-Statistics: Photons vs. Electrons",
    "course": "identical-particles",
    "lesson": "quantum-mechanics/identical-particles/bosons-and-fermions",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "spin-statistics"
    ],
    "prerequisites": [
      "quantum-mechanics/identical-particles/bosons-and-fermions"
    ]
  },
  {
    "slug": "possible-exchange-eigenvalues",
    "title": "What Eigenvalues Can P₁₂ Have?",
    "course": "identical-particles",
    "lesson": "quantum-mechanics/identical-particles/indistinguishability",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "exchange-operator"
    ],
    "prerequisites": [
      "quantum-mechanics/identical-particles/indistinguishability"
    ]
  },
  {
    "slug": "product-state-not-eigenstate",
    "title": "How Different Is a Product State From Its Own Exchange?",
    "course": "identical-particles",
    "lesson": "quantum-mechanics/identical-particles/indistinguishability",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "exchange-operator"
    ],
    "prerequisites": [
      "quantum-mechanics/identical-particles/indistinguishability"
    ]
  },
  {
    "slug": "quantum-vs-classical-indistinguishability",
    "title": "Quantum vs. Classical Indistinguishability",
    "course": "identical-particles",
    "lesson": "quantum-mechanics/identical-particles/indistinguishability",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "indistinguishability",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/identical-particles/indistinguishability"
    ]
  },
  {
    "slug": "same-orbital-opposite-spin-allowed",
    "title": "Which Electron Pairs Violate Exclusion?",
    "course": "identical-particles",
    "lesson": "quantum-mechanics/identical-particles/the-pauli-exclusion-principle",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "pauli-exclusion"
    ],
    "prerequisites": [
      "quantum-mechanics/identical-particles/the-pauli-exclusion-principle"
    ]
  },
  {
    "slug": "shell-capacity-n-equals-4",
    "title": "Maximum Electron Capacity of the n=4 Shell",
    "course": "identical-particles",
    "lesson": "quantum-mechanics/identical-particles/multi-electron-atoms-introduction",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "shell-filling"
    ],
    "prerequisites": [
      "quantum-mechanics/identical-particles/multi-electron-atoms-introduction"
    ]
  },
  {
    "slug": "why-filling-order-deviates",
    "title": "Why 4s Fills Before 3d",
    "course": "identical-particles",
    "lesson": "quantum-mechanics/identical-particles/multi-electron-atoms-introduction",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "shell-filling",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/identical-particles/multi-electron-atoms-introduction"
    ]
  },
  {
    "slug": "why-normalization-differs",
    "title": "Why the Normalization Constant Isn't Always 1/√2",
    "course": "identical-particles",
    "lesson": "quantum-mechanics/identical-particles/bosons-and-fermions",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "bosons-fermions",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/identical-particles/bosons-and-fermions"
    ]
  },
  {
    "slug": "zero-vector-is-exact",
    "title": "The Vanishing Is Exact, Not Approximate",
    "course": "identical-particles",
    "lesson": "quantum-mechanics/identical-particles/the-pauli-exclusion-principle",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "pauli-exclusion"
    ],
    "prerequisites": [
      "quantum-mechanics/identical-particles/the-pauli-exclusion-principle"
    ]
  },
  {
    "slug": "born-rule-probability",
    "title": "A Born Rule Calculation",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/probability-and-quantum-states",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "born-rule",
      "measurement"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/probability-and-quantum-states"
    ]
  },
  {
    "slug": "cauchy-schwarz-check",
    "title": "A Cauchy-Schwarz Calculation",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "inner-products",
      "cauchy-schwarz"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality"
    ]
  },
  {
    "slug": "completeness-relation-sandwich",
    "title": "Sandwiching the Completeness Relation",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/bra-ket-formalism",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "bra-ket",
      "completeness-relation"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/bra-ket-formalism"
    ]
  },
  {
    "slug": "complex-modulus",
    "title": "The Modulus of a Complex Number",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/complex-numbers-for-physics",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "complex-numbers",
      "modulus"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/complex-numbers-for-physics"
    ]
  },
  {
    "slug": "composite-system-dimension",
    "title": "Dimension of a Composite System",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/tensor-products-and-composite-systems",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "tensor-products",
      "dimension"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/tensor-products-and-composite-systems"
    ]
  },
  {
    "slug": "eulers-identity",
    "title": "Euler's Identity",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/complex-numbers-for-physics",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "complex-numbers",
      "eulers-formula"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/complex-numbers-for-physics"
    ]
  },
  {
    "slug": "expectation-value-calculation",
    "title": "Computing an Expectation Value",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/hermitian-operators",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "hermitian-operators",
      "expectation-value"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/hermitian-operators"
    ]
  },
  {
    "slug": "expectation-value-from-probabilities",
    "title": "Expectation Value From Outcome Probabilities",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/probability-and-quantum-states",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "born-rule",
      "expectation-value"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/probability-and-quantum-states"
    ]
  },
  {
    "slug": "global-phase-invariance",
    "title": "Why Global Phase Doesn't Affect Probabilities",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/probability-and-quantum-states",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "born-rule",
      "global-phase"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/probability-and-quantum-states"
    ]
  },
  {
    "slug": "identify-hermitian-matrix",
    "title": "Identifying a Hermitian Matrix",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/hermitian-operators",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "hermitian-operators",
      "adjoint"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/hermitian-operators"
    ]
  },
  {
    "slug": "linear-independence-check",
    "title": "Checking Linear Independence Over ℂ",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/vector-spaces",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "vector-spaces",
      "linear-independence"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/vector-spaces"
    ]
  },
  {
    "slug": "matrix-product-entry",
    "title": "An Entry of a Matrix Product",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/linear-operators",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "linear-operators",
      "matrix-multiplication"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/linear-operators"
    ]
  },
  {
    "slug": "non-invertible-matrix",
    "title": "Spotting a Non-Invertible Matrix",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/linear-operators",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "linear-operators",
      "invertibility"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/linear-operators"
    ]
  },
  {
    "slug": "outer-product-type",
    "title": "What Kind of Object Is |0⟩⟨1|?",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/bra-ket-formalism",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "bra-ket",
      "outer-product"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/bra-ket-formalism"
    ]
  },
  {
    "slug": "pauli-x-eigenvalue-sum",
    "title": "Sum of Pauli-X's Eigenvalues",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/eigenvalues-and-eigenvectors",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "eigenvalues",
      "trace"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/eigenvalues-and-eigenvectors"
    ]
  },
  {
    "slug": "pauli-z-eigenvalue-product",
    "title": "Product of Pauli-Z's Eigenvalues",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/eigenvalues-and-eigenvectors",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "eigenvalues",
      "determinant"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/eigenvalues-and-eigenvectors"
    ]
  },
  {
    "slug": "plus-minus-orthogonality",
    "title": "Are |+⟩ and |−⟩ Orthogonal?",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "inner-products",
      "orthogonality"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality"
    ]
  },
  {
    "slug": "real-dimension-of-complex-space",
    "title": "Real Dimension of a Complex Vector Space",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/vector-spaces",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "vector-spaces",
      "dimension"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/vector-spaces"
    ]
  },
  {
    "slug": "synthesis-eigenvalue-from-trace-det",
    "title": "Synthesis: Eigenvalues From Trace and Determinant",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/mathematical-foundations-challenge",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "eigenvalues",
      "synthesis"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/eigenvalues-and-eigenvectors"
    ]
  },
  {
    "slug": "synthesis-hermitian-and-unitary",
    "title": "Synthesis: Real, Symmetric, and Its Own Inverse",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/mathematical-foundations-challenge",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "multiple-choice",
    "tags": [
      "hermitian-operators",
      "unitary-operators",
      "synthesis"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/hermitian-operators",
      "quantum-mechanics/mathematical-foundations/unitary-operators"
    ]
  },
  {
    "slug": "synthesis-measurement-postulates",
    "title": "Synthesis: How the Postulates Fit Together",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/mathematical-foundations-challenge",
    "difficulty": "advanced",
    "estimatedMinutes": 8,
    "problemType": "conceptual",
    "tags": [
      "synthesis",
      "born-rule",
      "hermitian-operators"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/hermitian-operators",
      "quantum-mechanics/mathematical-foundations/probability-and-quantum-states"
    ]
  },
  {
    "slug": "unitary-defining-property",
    "title": "What's True of Every Unitary Operator",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/unitary-operators",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "unitary-operators"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/unitary-operators"
    ]
  },
  {
    "slug": "unitary-eigenvalue-modulus",
    "title": "The Modulus of a Unitary Operator's Eigenvalue",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/unitary-operators",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "unitary-operators",
      "eigenvalues"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/unitary-operators"
    ]
  },
  {
    "slug": "why-entanglement-is-generic",
    "title": "Why Not Every Tensor-Product-Space Vector Factors",
    "course": "mathematical-foundations",
    "lesson": "quantum-mechanics/mathematical-foundations/tensor-products-and-composite-systems",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "tensor-products",
      "entanglement"
    ],
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/tensor-products-and-composite-systems"
    ]
  },
  {
    "slug": "barrier-transmission-calculation",
    "title": "Transmission Through an Off-Resonance Barrier",
    "course": "one-dimensional-systems",
    "lesson": "quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "scattering",
      "barrier",
      "resonance"
    ],
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier"
    ]
  },
  {
    "slug": "energy-above-well-floor",
    "title": "Energy Above the Well's Floor",
    "course": "one-dimensional-systems",
    "lesson": "quantum-mechanics/one-dimensional-systems/solving-the-finite-well-numerically",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "finite-square-well",
      "numerical-methods"
    ],
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/solving-the-finite-well-numerically"
    ]
  },
  {
    "slug": "finite-well-ground-state-calculation",
    "title": "A Finite Well's Ground-State Energy",
    "course": "one-dimensional-systems",
    "lesson": "quantum-mechanics/one-dimensional-systems/solving-the-finite-well-numerically",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "finite-square-well",
      "numerical-methods"
    ],
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/solving-the-finite-well-numerically"
    ]
  },
  {
    "slug": "second-resonant-width",
    "title": "The Second Resonant Barrier Width",
    "course": "one-dimensional-systems",
    "lesson": "quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "scattering",
      "barrier",
      "resonance"
    ],
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier"
    ]
  },
  {
    "slug": "step-scattering-calculation",
    "title": "Reflection and Transmission at a Step",
    "course": "one-dimensional-systems",
    "lesson": "quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "scattering",
      "step-potential"
    ],
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential"
    ]
  },
  {
    "slug": "synthesis-bound-vs-continuous-spectrum",
    "title": "Synthesis: Bound vs. Continuous Spectra",
    "course": "one-dimensional-systems",
    "lesson": "quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "conceptual",
    "tags": [
      "synthesis",
      "bound-states",
      "scattering"
    ],
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge"
    ]
  },
  {
    "slug": "synthesis-tunneling-vs-resonance-regimes",
    "title": "Synthesis: The Two Barrier-Scattering Regimes",
    "course": "one-dimensional-systems",
    "lesson": "quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "conceptual",
    "tags": [
      "synthesis",
      "tunneling",
      "resonance"
    ],
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge"
    ]
  },
  {
    "slug": "synthesis-well-depth-and-bound-state-count",
    "title": "Synthesis: Well Depth and Bound-State Count",
    "course": "one-dimensional-systems",
    "lesson": "quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "synthesis",
      "finite-square-well"
    ],
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge"
    ]
  },
  {
    "slug": "tangent-branch-divergence-point",
    "title": "Where the First Tangent Branch Diverges",
    "course": "one-dimensional-systems",
    "lesson": "quantum-mechanics/one-dimensional-systems/the-finite-square-well-setting-up-the-equation",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "finite-square-well",
      "transcendental-equation"
    ],
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/the-finite-square-well-setting-up-the-equation"
    ]
  },
  {
    "slug": "what-is-actually-bounded",
    "title": "Why the Transmission Amplitude Can Exceed 1",
    "course": "one-dimensional-systems",
    "lesson": "quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "scattering",
      "step-potential"
    ],
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential"
    ]
  },
  {
    "slug": "why-finite-well-always-binds",
    "title": "Why a Finite Well Always Has At Least One Bound State",
    "course": "one-dimensional-systems",
    "lesson": "quantum-mechanics/one-dimensional-systems/solving-the-finite-well-numerically",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "conceptual",
    "tags": [
      "finite-square-well"
    ],
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/solving-the-finite-well-numerically"
    ]
  },
  {
    "slug": "why-no-closed-form-finite-well",
    "title": "Why the Finite Well Has No Closed-Form Solution",
    "course": "one-dimensional-systems",
    "lesson": "quantum-mechanics/one-dimensional-systems/the-finite-square-well-setting-up-the-equation",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "finite-square-well",
      "transcendental-equation"
    ],
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/the-finite-square-well-setting-up-the-equation"
    ]
  },
  {
    "slug": "why-reflection-always-positive",
    "title": "Why R > 0 for Any Nonzero Step",
    "course": "one-dimensional-systems",
    "lesson": "quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "scattering",
      "step-potential"
    ],
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential"
    ]
  },
  {
    "slug": "why-resonance-depends-on-k2l",
    "title": "Why Resonance Depends Only on k2*L",
    "course": "one-dimensional-systems",
    "lesson": "quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "scattering",
      "barrier",
      "resonance"
    ],
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier"
    ]
  },
  {
    "slug": "bell-state-z0-measurement-probability",
    "title": "Measuring Z_0 on a Bell State",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/degeneracy-in-practice",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "csco",
      "bell-states",
      "measurement"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/degeneracy-in-practice"
    ]
  },
  {
    "slug": "characteristic-timescale-calculation",
    "title": "Computing a Characteristic Evolution Timescale",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/the-energy-time-uncertainty-relation",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "energy-time-uncertainty"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/the-energy-time-uncertainty-relation"
    ]
  },
  {
    "slug": "degenerate-measurement-probability",
    "title": "A Degenerate Measurement Probability",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "measurement",
      "degeneracy",
      "born-rule"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized"
    ]
  },
  {
    "slug": "distinct-joint-eigenvalue-pairs",
    "title": "Counting Distinct Joint Eigenvalue Pairs",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/complete-sets-of-commuting-observables",
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "csco",
      "degeneracy"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/complete-sets-of-commuting-observables"
    ]
  },
  {
    "slug": "minimum-timescale-from-energy-spread",
    "title": "Minimum Timescale From an Energy Spread",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/the-energy-time-uncertainty-relation",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "energy-time-uncertainty"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/the-energy-time-uncertainty-relation"
    ]
  },
  {
    "slug": "post-measurement-state-component",
    "title": "A Post-Measurement State's Amplitude",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "measurement",
      "degeneracy",
      "collapse"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized"
    ]
  },
  {
    "slug": "sequential-measurement-probability",
    "title": "Probability After an Intervening Measurement",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/sequential-measurements-and-incompatibility",
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "measurement",
      "incompatibility"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/sequential-measurements-and-incompatibility"
    ]
  },
  {
    "slug": "shared-eigenbasis-implies-commute-recap",
    "title": "Why a Shared Eigenbasis Forces Commuting",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/simultaneous-eigenstates-and-compatible-observables",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "commutators",
      "compatible-observables"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/simultaneous-eigenstates-and-compatible-observables"
    ]
  },
  {
    "slug": "stationary-state-infinite-timescale",
    "title": "Why a Stationary State Has Infinite Delta t",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/the-energy-time-uncertainty-relation",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "conceptual",
    "tags": [
      "energy-time-uncertainty",
      "stationary-states"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/the-energy-time-uncertainty-relation"
    ]
  },
  {
    "slug": "synthesis-not-a-strict-generalization",
    "title": "Synthesis: The One Genuinely New Result",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "conceptual",
    "tags": [
      "synthesis",
      "energy-time-uncertainty"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge"
    ]
  },
  {
    "slug": "synthesis-repeated-measurement-certainty",
    "title": "Synthesis: Repeating the Same Measurement",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "synthesis",
      "measurement",
      "idempotence"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge"
    ]
  },
  {
    "slug": "synthesis-what-complete-means",
    "title": "Synthesis: What 'Complete' Means in CSCO",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "conceptual",
    "tags": [
      "synthesis",
      "csco"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge"
    ]
  },
  {
    "slug": "synthesis-zero-energy-uncertainty-consequence",
    "title": "Synthesis: Repeated Measurement on a Zero-Uncertainty State",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge",
    "difficulty": "advanced",
    "estimatedMinutes": 8,
    "problemType": "conceptual",
    "tags": [
      "synthesis",
      "measurement",
      "energy-time-uncertainty"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge"
    ]
  },
  {
    "slug": "trace-of-projector-equals-degeneracy",
    "title": "The Trace of a Degenerate Projector",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/spectral-decomposition-and-degeneracy",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "projectors",
      "degeneracy"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/spectral-decomposition-and-degeneracy"
    ]
  },
  {
    "slug": "which-pair-commutes",
    "title": "Which Pair of Operators Commutes?",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/simultaneous-eigenstates-and-compatible-observables",
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "commutators",
      "pauli-operators"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/simultaneous-eigenstates-and-compatible-observables"
    ]
  },
  {
    "slug": "why-collapse-uses-whole-projector",
    "title": "Why Collapse Uses the Whole Projector",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "measurement",
      "collapse",
      "degeneracy"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized"
    ]
  },
  {
    "slug": "why-different-factor-observables-commute",
    "title": "Why X_0 and Z_1 Commute",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/degeneracy-in-practice",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "csco",
      "tensor-products",
      "commutators"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/degeneracy-in-practice"
    ]
  },
  {
    "slug": "why-group-degenerate-eigenvectors",
    "title": "Why Degenerate Eigenvectors Share One Projector",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/spectral-decomposition-and-degeneracy",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "projectors",
      "degeneracy",
      "spectral-decomposition"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/spectral-decomposition-and-degeneracy"
    ]
  },
  {
    "slug": "why-one-observable-may-not-suffice",
    "title": "Why One Observable Doesn't Always Suffice",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/complete-sets-of-commuting-observables",
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "csco",
      "degeneracy"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/complete-sets-of-commuting-observables"
    ]
  },
  {
    "slug": "why-outcome-independent-disturbance",
    "title": "Why the Disturbance Doesn't Depend on Which Outcome Occurred",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/sequential-measurements-and-incompatibility",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "measurement",
      "incompatibility"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/sequential-measurements-and-incompatibility"
    ]
  },
  {
    "slug": "xz-commutator-entry",
    "title": "An Entry of [X, Z]",
    "course": "operators-observables-measurement",
    "lesson": "quantum-mechanics/operators-observables-measurement/simultaneous-eigenstates-and-compatible-observables",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "commutators",
      "pauli-operators"
    ],
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/simultaneous-eigenstates-and-compatible-observables"
    ]
  },
  {
    "slug": "balmer-alpha-transition-energy",
    "title": "The Balmer-Alpha Transition Energy (n=3 → n=2)",
    "course": "the-hydrogen-atom",
    "lesson": "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels",
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "energy-levels",
      "spectroscopy"
    ],
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels"
    ]
  },
  {
    "slug": "bohr-radius-agreement-meaning",
    "title": "What the Bohr-Radius Agreement Does and Doesn't Mean",
    "course": "the-hydrogen-atom",
    "lesson": "quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "orbitals",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers"
    ]
  },
  {
    "slug": "centrifugal-term-for-l-equals-2",
    "title": "The Centrifugal Coefficient for l=2 (d States)",
    "course": "the-hydrogen-atom",
    "lesson": "quantum-mechanics/the-hydrogen-atom/the-radial-equation",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "radial-equation",
      "centrifugal-term"
    ],
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/the-radial-equation"
    ]
  },
  {
    "slug": "fine-structure-two-effects",
    "title": "The Two Physical Effects Behind Fine Structure",
    "course": "the-hydrogen-atom",
    "lesson": "quantum-mechanics/the-hydrogen-atom/fine-structure-introduction",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "fine-structure"
    ],
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/fine-structure-introduction"
    ]
  },
  {
    "slug": "lz-l2-commutator-numerically",
    "title": "Checking [Lz, L²]=0 Numerically for j=1",
    "course": "the-hydrogen-atom",
    "lesson": "quantum-mechanics/the-hydrogen-atom/central-potentials",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "commutator",
      "angular-momentum"
    ],
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/central-potentials"
    ]
  },
  {
    "slug": "n-equals-2-total-degeneracy",
    "title": "Total Degeneracy of the n=2 Level",
    "course": "the-hydrogen-atom",
    "lesson": "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "energy-levels",
      "degeneracy"
    ],
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels"
    ]
  },
  {
    "slug": "n-equals-3-orbital-count",
    "title": "How Many Distinct Orbitals Share n=3?",
    "course": "the-hydrogen-atom",
    "lesson": "quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "orbitals",
      "quantum-numbers"
    ],
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers"
    ]
  },
  {
    "slug": "psi-1s-normalization-from-factors",
    "title": "The 1s Orbital's Full 3D Normalization",
    "course": "the-hydrogen-atom",
    "lesson": "quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "orbitals",
      "normalization"
    ],
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers"
    ]
  },
  {
    "slug": "s-states-have-no-centrifugal-barrier",
    "title": "Why s States (l=0) Have No Centrifugal Barrier",
    "course": "the-hydrogen-atom",
    "lesson": "quantum-mechanics/the-hydrogen-atom/the-radial-equation",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "conceptual",
    "tags": [
      "radial-equation",
      "centrifugal-term"
    ],
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/the-radial-equation"
    ]
  },
  {
    "slug": "u-vs-r-boundary-condition",
    "title": "u(0)=0 vs. R(0)=0: Which Is the Real Boundary Condition?",
    "course": "the-hydrogen-atom",
    "lesson": "quantum-mechanics/the-hydrogen-atom/the-radial-equation",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "radial-equation",
      "boundary-conditions"
    ],
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/the-radial-equation"
    ]
  },
  {
    "slug": "what-fine-structure-breaks",
    "title": "What Specifically Does Fine Structure Break?",
    "course": "the-hydrogen-atom",
    "lesson": "quantum-mechanics/the-hydrogen-atom/fine-structure-introduction",
    "difficulty": "advanced",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "fine-structure",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/fine-structure-introduction"
    ]
  },
  {
    "slug": "which-potentials-are-central",
    "title": "Which of These Potentials Is Central?",
    "course": "the-hydrogen-atom",
    "lesson": "quantum-mechanics/the-hydrogen-atom/central-potentials",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "central-potential"
    ],
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/central-potentials"
    ]
  },
  {
    "slug": "why-coulomb-energy-ignores-l",
    "title": "Why Hydrogen's Energy Doesn't Depend on l",
    "course": "the-hydrogen-atom",
    "lesson": "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "energy-levels",
      "degeneracy",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels"
    ]
  },
  {
    "slug": "why-h-commutes-with-lz",
    "title": "Why the Full Hamiltonian Commutes With Lz",
    "course": "the-hydrogen-atom",
    "lesson": "quantum-mechanics/the-hydrogen-atom/central-potentials",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "central-potential",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/central-potentials"
    ]
  },
  {
    "slug": "amplitude-density-vs-probability",
    "title": "Why psi(x) Isn't a Probability",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/what-is-a-wavefunction",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "wavefunction",
      "born-rule"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/what-is-a-wavefunction"
    ]
  },
  {
    "slug": "commutator-antisymmetry-position-momentum",
    "title": "Why [p,x] = -[x,p]",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/the-position-and-momentum-operators",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "conceptual",
    "tags": [
      "commutator",
      "position-operator",
      "momentum-operator"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/the-position-and-momentum-operators"
    ]
  },
  {
    "slug": "dispersion-formula-calculation",
    "title": "Wave Packet Spreading Over Time",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/wave-packet-dynamics-and-dispersion",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "dispersion",
      "wave-packet"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/wave-packet-dynamics-and-dispersion"
    ]
  },
  {
    "slug": "ehrenfest-second-theorem",
    "title": "Ehrenfest's Theorem for Momentum",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/wave-packet-dynamics-and-dispersion",
    "difficulty": "advanced",
    "estimatedMinutes": 8,
    "problemType": "conceptual",
    "tags": [
      "ehrenfest-theorem",
      "momentum"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/wave-packet-dynamics-and-dispersion"
    ]
  },
  {
    "slug": "group-velocity-calculation",
    "title": "Group Velocity of a Wave Packet",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/free-particle-wave-packets",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "wave-packet",
      "group-velocity"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/free-particle-wave-packets"
    ]
  },
  {
    "slug": "harmonic-ground-state-energy",
    "title": "Harmonic Oscillator Ground State Energy",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/the-harmonic-oscillator-in-position-space",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "harmonic-oscillator",
      "energy-levels"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/the-harmonic-oscillator-in-position-space"
    ]
  },
  {
    "slug": "harmonic-level-spacing",
    "title": "Harmonic Oscillator Level Spacing",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/the-harmonic-oscillator-in-position-space",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "harmonic-oscillator",
      "energy-levels"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/the-harmonic-oscillator-in-position-space"
    ]
  },
  {
    "slug": "infinite-well-energy-level",
    "title": "Infinite Well Energy Level",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/the-infinite-square-well",
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "infinite-square-well",
      "energy-levels"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/the-infinite-square-well"
    ]
  },
  {
    "slug": "infinite-well-energy-ratio",
    "title": "Infinite Well Energy Ratio",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/the-infinite-square-well",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "infinite-square-well",
      "energy-levels"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/the-infinite-square-well"
    ]
  },
  {
    "slug": "infinite-well-node-count",
    "title": "From a Node Count to an Energy",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/the-infinite-square-well",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "infinite-square-well",
      "eigenstates",
      "energy-levels"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/the-infinite-square-well"
    ]
  },
  {
    "slug": "kappa-calculation",
    "title": "The Decay Constant Inside a Barrier",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "tunneling",
      "barrier"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier"
    ]
  },
  {
    "slug": "kinetic-term-form",
    "title": "The Correct Form of the Kinetic Energy Term",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/the-schrodinger-equation-in-position-space",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "multiple-choice",
    "tags": [
      "schrodinger-equation",
      "hamiltonian"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/the-schrodinger-equation-in-position-space"
    ]
  },
  {
    "slug": "mean-position-tophat",
    "title": "Mean Position of a Top-Hat Wavefunction",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/expectation-values-in-position-space",
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "expectation-value",
      "position"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/expectation-values-in-position-space"
    ]
  },
  {
    "slug": "momentum-eigenvalue-calculation",
    "title": "Momentum Eigenvalue of a Plane Wave",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/the-position-and-momentum-operators",
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "momentum-operator",
      "eigenvalue"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/the-position-and-momentum-operators"
    ]
  },
  {
    "slug": "momentum-width-from-position-width",
    "title": "Momentum-Space Width From Position-Space Width",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/momentum-space-and-the-fourier-transform",
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "fourier-transform",
      "gaussian"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/momentum-space-and-the-fourier-transform"
    ]
  },
  {
    "slug": "probability-in-subregion",
    "title": "Probability of Being in a Subregion",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/probability-density-and-normalization",
    "difficulty": "beginner",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "probability-density",
      "normalization"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/probability-density-and-normalization"
    ]
  },
  {
    "slug": "stationary-phase-calculation",
    "title": "The Phase of a Stationary State",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/the-schrodinger-equation-in-position-space",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "schrodinger-equation",
      "stationary-states"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/the-schrodinger-equation-in-position-space"
    ]
  },
  {
    "slug": "synthesis-beat-frequency-calculation",
    "title": "Synthesis: Beat Frequency of a Superposition",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/wave-mechanics-challenge",
    "difficulty": "advanced",
    "estimatedMinutes": 8,
    "problemType": "numeric",
    "tags": [
      "synthesis",
      "superposition",
      "infinite-square-well"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/wave-mechanics-challenge"
    ]
  },
  {
    "slug": "synthesis-continuum-vs-finite-mapping",
    "title": "Synthesis: What's Genuinely New About Continuous Position",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/wave-mechanics-challenge",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "conceptual",
    "tags": [
      "synthesis",
      "postulates"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/wave-mechanics-challenge"
    ]
  },
  {
    "slug": "synthesis-stationary-density-constant",
    "title": "Synthesis: Why Stationary States Don't Move",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/wave-mechanics-challenge",
    "difficulty": "advanced",
    "estimatedMinutes": 8,
    "problemType": "conceptual",
    "tags": [
      "synthesis",
      "stationary-states",
      "ehrenfest-theorem"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/wave-mechanics-challenge"
    ]
  },
  {
    "slug": "top-hat-normalization-constant",
    "title": "Normalizing a Top-Hat Wavefunction",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/what-is-a-wavefunction",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "normalization",
      "wavefunction"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/what-is-a-wavefunction"
    ]
  },
  {
    "slug": "transmission-qualitative",
    "title": "How Barrier Width Affects Transmission",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "tunneling",
      "barrier"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier"
    ]
  },
  {
    "slug": "trotter-error-order",
    "title": "The Order of the Symmetric Split-Operator Error",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/numerically-evolving-quantum-states",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "split-operator",
      "numerical-methods"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/numerically-evolving-quantum-states"
    ]
  },
  {
    "slug": "uncertainty-product-gaussian",
    "title": "The Uncertainty Product for a Gaussian Packet",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/momentum-space-and-the-fourier-transform",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "fourier-transform",
      "uncertainty",
      "gaussian"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/momentum-space-and-the-fourier-transform"
    ]
  },
  {
    "slug": "variance-tophat",
    "title": "Position Uncertainty of a Top-Hat Wavefunction",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/expectation-values-in-position-space",
    "difficulty": "intermediate",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "expectation-value",
      "variance",
      "uncertainty"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/expectation-values-in-position-space"
    ]
  },
  {
    "slug": "wallheight-dt-product",
    "title": "Checking a Numerical Wall Height Against the Time Step",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/numerically-evolving-quantum-states",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "split-operator",
      "numerical-methods",
      "infinite-square-well"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/numerically-evolving-quantum-states"
    ]
  },
  {
    "slug": "why-norm-is-preserved",
    "title": "Why Time Evolution Preserves Normalization",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/probability-density-and-normalization",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "normalization",
      "unitarity",
      "time-evolution"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/probability-density-and-normalization"
    ]
  },
  {
    "slug": "why-p-hat-needs-i",
    "title": "Why the Momentum Operator Needs a Factor of i",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/the-position-and-momentum-operators",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "momentum-operator",
      "hermitian"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/the-position-and-momentum-operators"
    ]
  },
  {
    "slug": "why-plane-wave-not-normalizable",
    "title": "Why a Plane Wave Cannot Be Normalized",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/free-particle-wave-packets",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "wave-packet",
      "normalization"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/free-particle-wave-packets"
    ]
  },
  {
    "slug": "why-symmetric-split-better",
    "title": "Why the Split-Operator Method Uses a Symmetric Ordering",
    "course": "wave-mechanics",
    "lesson": "quantum-mechanics/wave-mechanics/numerically-evolving-quantum-states",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "split-operator",
      "numerical-methods"
    ],
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/numerically-evolving-quantum-states"
    ]
  },
  {
    "slug": "circuit-vqe-matches-exact",
    "title": "Grid-Search VQE Result for H=Z",
    "course": "compilation-and-hybrid-algorithms",
    "lesson": "quantum-software/compilation-and-hybrid-algorithms/variational-algorithm-implementation",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "variational-algorithms"
    ],
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/variational-algorithm-implementation"
    ]
  },
  {
    "slug": "confusion-matrix-correction-95-90",
    "title": "Correcting a Measured Distribution with a New Confusion Matrix",
    "course": "compilation-and-hybrid-algorithms",
    "lesson": "quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "quantum-error-mitigation",
      "readout-error-mitigation",
      "confusion-matrix"
    ],
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation"
    ]
  },
  {
    "slug": "logical-result-unchanged",
    "title": "Does Transpilation Change What a Circuit Computes?",
    "course": "compilation-and-hybrid-algorithms",
    "lesson": "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "transpilation",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation"
    ]
  },
  {
    "slug": "mitigation-vs-correction-what-gets-repaired",
    "title": "Error Mitigation vs. Error Correction: What Actually Gets Repaired?",
    "course": "compilation-and-hybrid-algorithms",
    "lesson": "quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "quantum-error-mitigation",
      "error-correction",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation"
    ]
  },
  {
    "slug": "not-every-gate-needs-three-rotations",
    "title": "How Many Native Rotations Does Z Actually Need?",
    "course": "compilation-and-hybrid-algorithms",
    "lesson": "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "gate-decomposition"
    ],
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition"
    ]
  },
  {
    "slug": "only-quantum-step",
    "title": "Which Step of the Hybrid Loop Must Run on a Quantum Device?",
    "course": "compilation-and-hybrid-algorithms",
    "lesson": "quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "hybrid-workflows"
    ],
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows"
    ]
  },
  {
    "slug": "pennylane-fits-which-step",
    "title": "Which Step of the Loop Does PennyLane's Design Target?",
    "course": "compilation-and-hybrid-algorithms",
    "lesson": "quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "hybrid-workflows",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows"
    ]
  },
  {
    "slug": "swap-overhead-1-4",
    "title": "SWAP Overhead for Control=1, Target=4",
    "course": "compilation-and-hybrid-algorithms",
    "lesson": "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "transpilation"
    ],
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation"
    ]
  },
  {
    "slug": "total-cnot-equivalent-ops",
    "title": "Total CNOT-Equivalent Operations After Transpilation",
    "course": "compilation-and-hybrid-algorithms",
    "lesson": "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "transpilation"
    ],
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation"
    ]
  },
  {
    "slug": "total-swaps-500-iterations",
    "title": "How Many VQE Iterations the Routing Overhead Survives",
    "course": "compilation-and-hybrid-algorithms",
    "lesson": "quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows",
    "difficulty": "advanced",
    "estimatedMinutes": 7,
    "problemType": "numeric",
    "tags": [
      "hybrid-workflows",
      "routing",
      "noise"
    ],
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows"
    ]
  },
  {
    "slug": "two-implementations-cross-check",
    "title": "Why Two Different Code Paths Agreeing Is Meaningful",
    "course": "compilation-and-hybrid-algorithms",
    "lesson": "quantum-software/compilation-and-hybrid-algorithms/variational-algorithm-implementation",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "variational-algorithms"
    ],
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/variational-algorithm-implementation"
    ]
  },
  {
    "slug": "verify-x-decomposition",
    "title": "Does Rz(π)Ry(π) Equal X?",
    "course": "compilation-and-hybrid-algorithms",
    "lesson": "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "gate-decomposition"
    ],
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition"
    ]
  },
  {
    "slug": "why-exact-vs-approximate-convergence",
    "title": "Why H=Z Converges Exactly but 0.6Z+0.8X Doesn't",
    "course": "compilation-and-hybrid-algorithms",
    "lesson": "quantum-software/compilation-and-hybrid-algorithms/variational-algorithm-implementation",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "variational-algorithms",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/variational-algorithm-implementation"
    ]
  },
  {
    "slug": "why-global-phase-tolerance-correct",
    "title": "Why Checking 'Up to Global Phase' Is Correct, Not a Shortcut",
    "course": "compilation-and-hybrid-algorithms",
    "lesson": "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "gate-decomposition",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition"
    ]
  },
  {
    "slug": "zero-noise-extrapolation-at-p-0-1",
    "title": "Zero-Noise Extrapolation at p = 0.1",
    "course": "compilation-and-hybrid-algorithms",
    "lesson": "quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "numeric",
    "tags": [
      "quantum-error-mitigation",
      "zero-noise-extrapolation"
    ],
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation"
    ]
  },
  {
    "slug": "4000-1000-split-explanation",
    "title": "Is a 4000/1000 Split Shot Noise or Something Else?",
    "course": "programming-quantum-computers",
    "lesson": "quantum-software/programming-quantum-computers/writing-your-first-circuit",
    "difficulty": "intermediate",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "shot-noise",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-software/programming-quantum-computers/writing-your-first-circuit"
    ]
  },
  {
    "slug": "amplitudes-for-20-qubits",
    "title": "How Many Amplitudes for 20-Qubit Exact Simulation?",
    "course": "programming-quantum-computers",
    "lesson": "quantum-software/programming-quantum-computers/simulators-vs-real-hardware",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "simulators"
    ],
    "prerequisites": [
      "quantum-software/programming-quantum-computers/simulators-vs-real-hardware"
    ]
  },
  {
    "slug": "ghz-exact-probability",
    "title": "Exact P(|000⟩) for the GHZ Circuit",
    "course": "programming-quantum-computers",
    "lesson": "quantum-software/programming-quantum-computers/writing-your-first-circuit",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "numeric",
    "tags": [
      "ghz",
      "circuits"
    ],
    "prerequisites": [
      "quantum-software/programming-quantum-computers/writing-your-first-circuit"
    ]
  },
  {
    "slug": "hzh-equals-x-check",
    "title": "Running H-Z-H on |0⟩",
    "course": "programming-quantum-computers",
    "lesson": "quantum-software/programming-quantum-computers/circuit-representation-in-code",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "numeric",
    "tags": [
      "circuit-representation"
    ],
    "prerequisites": [
      "quantum-software/programming-quantum-computers/circuit-representation-in-code"
    ]
  },
  {
    "slug": "opposite-failure-modes",
    "title": "How Do Simulators and Hardware Fail Differently?",
    "course": "programming-quantum-computers",
    "lesson": "quantum-software/programming-quantum-computers/simulators-vs-real-hardware",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "simulators"
    ],
    "prerequisites": [
      "quantum-software/programming-quantum-computers/simulators-vs-real-hardware"
    ]
  },
  {
    "slug": "pennylane-vqe-fit",
    "title": "Why PennyLane Fits VQE Well",
    "course": "programming-quantum-computers",
    "lesson": "quantum-software/programming-quantum-computers/quantum-sdks-overview",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "sdks"
    ],
    "prerequisites": [
      "quantum-software/programming-quantum-computers/quantum-sdks-overview"
    ]
  },
  {
    "slug": "same-capability-different-ergonomics",
    "title": "Do Different SDKs Have Fundamentally Different Capabilities?",
    "course": "programming-quantum-computers",
    "lesson": "quantum-software/programming-quantum-computers/quantum-sdks-overview",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "sdks"
    ],
    "prerequisites": [
      "quantum-software/programming-quantum-computers/quantum-sdks-overview"
    ]
  },
  {
    "slug": "shot-noise-standard-deviation-10000",
    "title": "Shot-Noise Standard Deviation at 10,000 Shots",
    "course": "programming-quantum-computers",
    "lesson": "quantum-software/programming-quantum-computers/writing-your-first-circuit",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "shot-noise"
    ],
    "prerequisites": [
      "quantum-software/programming-quantum-computers/writing-your-first-circuit"
    ]
  },
  {
    "slug": "what-a-backend-abstracts",
    "title": "What Does a 'Backend' Actually Abstract Over?",
    "course": "programming-quantum-computers",
    "lesson": "quantum-software/programming-quantum-computers/quantum-sdks-overview",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "sdks",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-software/programming-quantum-computers/quantum-sdks-overview"
    ]
  },
  {
    "slug": "when-does-state-change",
    "title": "When Does the Quantum State Actually Change?",
    "course": "programming-quantum-computers",
    "lesson": "quantum-software/programming-quantum-computers/circuit-representation-in-code",
    "difficulty": "beginner",
    "estimatedMinutes": 4,
    "problemType": "conceptual",
    "tags": [
      "circuit-representation"
    ],
    "prerequisites": [
      "quantum-software/programming-quantum-computers/circuit-representation-in-code"
    ]
  },
  {
    "slug": "why-noise-confounds-debugging",
    "title": "Why Hardware Noise Makes Logic Bugs Harder to Find",
    "course": "programming-quantum-computers",
    "lesson": "quantum-software/programming-quantum-computers/simulators-vs-real-hardware",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "simulators",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-software/programming-quantum-computers/simulators-vs-real-hardware"
    ]
  },
  {
    "slug": "why-separation-enables-optimization",
    "title": "Why Build-Then-Run Enables Circuit Optimization",
    "course": "programming-quantum-computers",
    "lesson": "quantum-software/programming-quantum-computers/circuit-representation-in-code",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "circuit-representation",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-software/programming-quantum-computers/circuit-representation-in-code"
    ]
  },
  {
    "slug": "exact-vs-sampled-distinction",
    "title": "Exact Amplitudes vs. Sampled Estimates",
    "course": "simulating-quantum-systems",
    "lesson": "quantum-software/simulating-quantum-systems/state-vector-simulation",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "state-vector-simulation"
    ],
    "prerequisites": [
      "quantum-software/simulating-quantum-systems/state-vector-simulation"
    ]
  },
  {
    "slug": "flops-for-1000-gates-30-qubits",
    "title": "Estimated Operations for 1000 Gates on 30 Qubits",
    "course": "simulating-quantum-systems",
    "lesson": "quantum-software/simulating-quantum-systems/computational-cost-and-scaling",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "computational-cost"
    ],
    "prerequisites": [
      "quantum-software/simulating-quantum-systems/computational-cost-and-scaling"
    ]
  },
  {
    "slug": "grover-poor-fit-for-tensor-networks",
    "title": "Why Grover's Algorithm Doesn't Benefit From Tensor Networks",
    "course": "simulating-quantum-systems",
    "lesson": "quantum-software/simulating-quantum-systems/tensor-network-methods",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "tensor-networks",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-software/simulating-quantum-systems/tensor-network-methods"
    ]
  },
  {
    "slug": "hh-with-dephasing-p0",
    "title": "P(0) After a Noisy H,H Circuit",
    "course": "simulating-quantum-systems",
    "lesson": "quantum-software/simulating-quantum-systems/noise-simulation",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "noise-simulation"
    ],
    "prerequisites": [
      "quantum-software/simulating-quantum-systems/noise-simulation"
    ]
  },
  {
    "slug": "memory-for-25-qubits",
    "title": "Exact Memory Required for 25-Qubit Simulation",
    "course": "simulating-quantum-systems",
    "lesson": "quantum-software/simulating-quantum-systems/computational-cost-and-scaling",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "numeric",
    "tags": [
      "computational-cost"
    ],
    "prerequisites": [
      "quantum-software/simulating-quantum-systems/computational-cost-and-scaling"
    ]
  },
  {
    "slug": "name-a-prior-simulation-result",
    "title": "Which Prior Result Used State-Vector Simulation?",
    "course": "simulating-quantum-systems",
    "lesson": "quantum-software/simulating-quantum-systems/state-vector-simulation",
    "difficulty": "beginner",
    "estimatedMinutes": 3,
    "problemType": "multiple-choice",
    "tags": [
      "state-vector-simulation"
    ],
    "prerequisites": [
      "quantum-software/simulating-quantum-systems/state-vector-simulation"
    ]
  },
  {
    "slug": "purity-not-strictly-monotonic",
    "title": "Does Purity Always Strictly Decrease Gate by Gate?",
    "course": "simulating-quantum-systems",
    "lesson": "quantum-software/simulating-quantum-systems/noise-simulation",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "noise-simulation",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-software/simulating-quantum-systems/noise-simulation"
    ]
  },
  {
    "slug": "simulating-vs-being-quantum",
    "title": "Is a Classical Simulation 'Really' Doing Quantum Mechanics?",
    "course": "simulating-quantum-systems",
    "lesson": "quantum-software/simulating-quantum-systems/state-vector-simulation",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "state-vector-simulation",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-software/simulating-quantum-systems/state-vector-simulation"
    ]
  },
  {
    "slug": "tensor-networks-not-strictly-better",
    "title": "Why 'More Advanced' Doesn't Mean 'Strictly Better' Here",
    "course": "simulating-quantum-systems",
    "lesson": "quantum-software/simulating-quantum-systems/tensor-network-methods",
    "difficulty": "intermediate",
    "estimatedMinutes": 5,
    "problemType": "conceptual",
    "tags": [
      "tensor-networks",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-software/simulating-quantum-systems/tensor-network-methods"
    ]
  },
  {
    "slug": "what-tensor-networks-exploit",
    "title": "The Specific Property Tensor Networks Exploit",
    "course": "simulating-quantum-systems",
    "lesson": "quantum-software/simulating-quantum-systems/tensor-network-methods",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "tensor-networks"
    ],
    "prerequisites": [
      "quantum-software/simulating-quantum-systems/tensor-network-methods"
    ]
  },
  {
    "slug": "why-2n-is-fundamental",
    "title": "Why 2ⁿ Growth Is Physics, Not an Implementation Choice",
    "course": "simulating-quantum-systems",
    "lesson": "quantum-software/simulating-quantum-systems/computational-cost-and-scaling",
    "difficulty": "advanced",
    "estimatedMinutes": 6,
    "problemType": "conceptual",
    "tags": [
      "computational-cost",
      "conceptual"
    ],
    "prerequisites": [
      "quantum-software/simulating-quantum-systems/computational-cost-and-scaling"
    ]
  },
  {
    "slug": "why-single-qubit-scope",
    "title": "Why runNoisyCircuit Is Scoped to a Single Qubit",
    "course": "simulating-quantum-systems",
    "lesson": "quantum-software/simulating-quantum-systems/noise-simulation",
    "difficulty": "intermediate",
    "estimatedMinutes": 4,
    "problemType": "multiple-choice",
    "tags": [
      "noise-simulation"
    ],
    "prerequisites": [
      "quantum-software/simulating-quantum-systems/noise-simulation"
    ]
  }
];
