/**
 * AUTO-GENERATED — do not hand-edit.
 *
 * Produced by `node scripts/generate-lesson-registry.mjs` (`npm run
 * generate:lesson-registry`; also runs automatically before `dev`/`build`/
 * `test` via the npm lifecycle hooks). Re-run it after adding, renaming, or
 * deleting a lesson under `src/content/lessons/**` or editing a lesson's
 * `lessonMeta` export — this file is silently overwritten on the next run.
 *
 * This is the ONLY place lesson metadata is materialized for consumers
 * (`src/lib/content/lessons.ts` re-exports it). Nothing outside a lesson
 * page's own render may import a compiled `.mdx` module — that is the
 * build-memory invariant this registry exists to protect; see the generator
 * script's header.
 */
import type { LessonMetaWithSlug } from "./types";

export const LESSON_METAS: LessonMetaWithSlug[] = [
  {
    "title": "Amplitude Estimation Without Phase Estimation",
    "description": "The original Grover-iterate-plus-QFT amplitude estimation algorithm hits the same O(1/epsilon) Heisenberg-limited scaling as a classically-scheduled sequence of plain Grover-iterate runs combined by maximum likelihood: a citable NISQ-era result, and not a consolation prize for giving up the QFT.",
    "course": "algorithmic-frontiers",
    "module": "amplitude-estimation-without-phase-estimation",
    "order": 4,
    "difficulty": "master",
    "estimatedMinutes": 50,
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/phase-estimation-precision-and-qft-depth",
      "apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries"
    ],
    "objectives": [
      "Recall the original amplitude-estimation algorithm (Grover iteration + quantum phase estimation) and its query-vs-precision tradeoff, achieving Heisenberg-limited O(1/epsilon) scaling instead of the classical O(1/epsilon^2) Monte Carlo scaling",
      "Explain modern 'QPE-free' amplitude estimation techniques (maximum-likelihood/iterative amplitude estimation) that achieve the same asymptotic O(1/epsilon) scaling using only Grover iterations and classical post-processing, without a QFT or large phase-estimation ancilla register",
      "Compare circuit depth/ancilla-count/coherence-time requirements of the two approaches and explain why the QPE-free version matters for near-term (NISQ-era) hardware specifically"
    ],
    "related": [
      {
        "slug": "quantum-mastery/advanced-algorithms-and-complexity/phase-estimation-precision-and-qft-depth",
        "note": "That lesson derives QPE's exact closed-form measurement probability and the QFT's O(t^2) gate cost; this lesson is the concrete payoff of caring about that cost: an entire algorithm family built specifically to avoid paying it."
      },
      {
        "slug": "quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification",
        "note": "This lesson's Grover iterate is exactly that lesson's rotation-by-2theta argument with the uniform-superposition state |s⟩ generalized to an arbitrary state-preparation unitary A|0⟩, and its success-probability formula sin²((2k+1)θ) reused without modification."
      }
    ],
    "slug": "apex/algorithmic-frontiers/amplitude-estimation-without-phase-estimation"
  },
  {
    "title": "Applications: Eigenvalues and Linear Systems",
    "description": "How QSVT turns a block encoding of a Hermitian matrix into an approximate matrix inverse, producing a quantum state proportional to the solution of Ax=b, plus a precise accounting of what that state gives you and which conditions a real speedup depends on.",
    "course": "algorithmic-frontiers",
    "module": "applications-eigenvalues-and-linear-systems",
    "order": 5,
    "difficulty": "master",
    "estimatedMinutes": 55,
    "prerequisites": [
      "apex/algorithmic-frontiers/the-quantum-singular-value-transformation"
    ],
    "objectives": [
      "State the quantum linear systems problem precisely: given a block encoding of a Hermitian matrix A and a way to prepare |b⟩, produce a quantum state proportional to A⁻¹|b⟩ = |x⟩, the solution of Ax=b",
      "Explain how QSVT applies a polynomial approximation to 1/x (suitably regularized) to realize A⁻¹ approximately, and why the achievable precision/query count depends on A's condition number kappa (the ratio of largest to smallest singular value)",
      "Pin down honestly and precisely what the algorithm does and does NOT give you: a quantum state encoding the solution vector (useful for reading out a few global properties via further measurement), NOT the classical solution vector itself, and explain exactly why that distinction matters for whether a real speedup is actually realized in a given application"
    ],
    "related": [
      {
        "slug": "apex/algorithmic-frontiers/the-quantum-singular-value-transformation",
        "note": "This lesson's entire construction (a polynomial applied to a block-encoded matrix via quantum signal processing) is exactly QSVT's machinery, specialized here to the single polynomial P(x)≈c/x that turns 'apply a function of A' into 'apply A⁻¹'."
      }
    ],
    "slug": "apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems"
  },
  {
    "title": "Block Encodings and Linear Combinations of Unitaries",
    "description": "Introduces block encodings, the modern universal input model for quantum linear algebra, and derives the linear-combination-of-unitaries (LCU) construction, verifying on a real two-qubit circuit that post-selecting an ancilla exactly reproduces an arbitrary bounded operator applied to the system register.",
    "course": "algorithmic-frontiers",
    "module": "block-encodings-and-linear-combinations-of-unitaries",
    "order": 1,
    "difficulty": "master",
    "estimatedMinutes": 65,
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization"
    ],
    "objectives": [
      "Define a block encoding of a matrix A: a unitary U such that A = (bra 0 on ancilla) U (ket 0 on ancilla), up to a normalization factor",
      "Construct the linear-combination-of-unitaries (LCU) technique explicitly: writing a target operator as A = sum_i alpha_i U_i for unitaries U_i, and implementing it via a PREPARE + SELECT + PREPARE-dagger circuit",
      "Explain why block encodings are the modern 'universal input model' that Hamiltonian simulation, amplitude estimation, and linear-systems solving all now build on, replacing older, more specialized constructions"
    ],
    "related": [
      {
        "slug": "quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization",
        "note": "Trotterization simulates e^(-iHt) for one specific, already-unitary operator by chopping time into small commuting-ish steps; block encodings instead take an arbitrary, not-necessarily-unitary A and embed the whole thing, unapproximated, as a sub-block of a single bigger unitary, which is what lets Hamiltonian simulation itself later be re-derived as a special case (via quantum signal processing) rather than needing its own bespoke product-formula argument."
      }
    ],
    "slug": "apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries"
  },
  {
    "title": "Capstone: The Toolbox That Ate Quantum Algorithms",
    "description": "Block encodings, quantum signal processing, and the quantum singular value transformation collapse into one framework whose only tunable ingredient is a polynomial. Grover's algorithm, amplitude estimation, Hamiltonian simulation, and linear-systems solving all turn out to be special cases of it. None of them is a coincidence.",
    "course": "algorithmic-frontiers",
    "module": "capstone-the-toolbox-that-ate-quantum-algorithms",
    "order": 6,
    "difficulty": "master",
    "estimatedMinutes": 55,
    "prerequisites": [
      "apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems",
      "apex/algorithmic-frontiers/amplitude-estimation-without-phase-estimation"
    ],
    "objectives": [
      "Synthesize the whole course: block encodings, QSP, and QSVT as one unified construction, and Grover's algorithm, amplitude estimation, Hamiltonian simulation, and linear-systems solving as its special cases",
      "Evaluate honestly which of these unifications are exact equivalences, which are asymptotic-scaling matches, and where real, still-open algorithmic questions remain",
      "Explain what kind of NEW algorithmic problem a researcher would now approach by first asking 'what polynomial do I need, and can I find/apply it via QSVT', as this course's practical takeaway skill"
    ],
    "related": [
      {
        "slug": "apex/algorithmic-frontiers/the-quantum-singular-value-transformation",
        "note": "That lesson derives the QSVT machinery itself, one polynomial applied to every singular value of a block-encoded matrix at once; this capstone's whole job is showing that machinery, unmodified, is what Grover's algorithm, Hamiltonian simulation, and linear-systems solving each turn out to already be doing."
      }
    ],
    "slug": "apex/algorithmic-frontiers/capstone-the-toolbox-that-ate-quantum-algorithms"
  },
  {
    "title": "Quantum Signal Processing",
    "description": "Derives quantum signal processing exactly for degree-1 and degree-2 phase sequences, verifying that an all-zero-phase sequence produces a Chebyshev polynomial and that tuned phases can multiply it by a controllable complex phase or collapse its effective degree. The algebra behind compiling a target polynomial into classical phase angles.",
    "course": "algorithmic-frontiers",
    "module": "quantum-signal-processing",
    "order": 2,
    "difficulty": "master",
    "estimatedMinutes": 75,
    "prerequisites": [
      "apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries"
    ],
    "objectives": [
      "Explain the quantum signal processing (QSP) protocol: alternating a fixed 'signal' rotation W(x) with tunable Z-rotations produces a single-qubit unitary whose top-left entry is a controllable polynomial P(x)",
      "State precisely which polynomials are achievable (real/complex, degree, parity, and boundedness constraints) and why these constraints matter",
      "Compute the resulting polynomial for a short, explicit sequence of phases by hand/derivation, verifying it numerically for specific x values"
    ],
    "related": [
      {
        "slug": "apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries",
        "note": "Block encoding buries an arbitrary bounded operator A in the top-left corner of some larger unitary; quantum signal processing is the special case where that larger unitary is built from a single fixed 2x2 signal rotation W(x) interleaved with tunable phases, and the polynomial it produces in x is exactly the kind of function the next lesson's quantum singular value transformation applies to A's singular values by combining both constructions."
      }
    ],
    "slug": "apex/algorithmic-frontiers/quantum-signal-processing"
  },
  {
    "title": "The Quantum Singular Value Transformation",
    "description": "How alternating a block-encoding unitary with ancilla-only phase rotations lifts single-qubit quantum signal processing onto the singular values of an arbitrary matrix: the construction now understood to unify Grover's algorithm, Hamiltonian simulation, and linear-systems solving.",
    "course": "algorithmic-frontiers",
    "module": "the-quantum-singular-value-transformation",
    "order": 3,
    "difficulty": "master",
    "estimatedMinutes": 70,
    "prerequisites": [
      "apex/algorithmic-frontiers/quantum-signal-processing"
    ],
    "objectives": [
      "Explain how QSVT lifts single-qubit Quantum Signal Processing to act on the singular values of an arbitrary block-encoded matrix, by alternating the block-encoding unitary with projector-controlled phase rotations",
      "State the key theorem, parity clause included: for a block-encoded matrix A with singular value decomposition A = sum_i sigma_i |u_i><v_i|, QSVT with the right phases produces a block encoding of the singular value transform, sum_i P(sigma_i) |u_i><v_i| for odd P and sum_i P(sigma_i) |v_i><v_i| for even P, for the same polynomial P realized in single-qubit QSP, the two coinciding when A is Hermitian",
      "Recover, concretely, Grover's amplitude amplification, Hamiltonian simulation, and (qualitatively) the HHL linear-systems algorithm as special cases of one construction"
    ],
    "related": [
      {
        "slug": "apex/algorithmic-frontiers/quantum-signal-processing",
        "note": "QSVT is that lesson's signal rotation W(x) and phase sequence, run independently inside one 2D subspace per singular value: same phases, same polynomial, same degree/parity constraints, embedded in an ancilla-tagged subspace instead of applied by hand to a bare qubit."
      },
      {
        "slug": "apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries",
        "note": "The unitary U and ancilla register this lesson alternates with U-dagger and phase rotations are exactly that lesson's block encoding and its |0>-ancilla subspace. QSVT is what you can do once a matrix is block-encoded, not a substitute for encoding it."
      }
    ],
    "slug": "apex/algorithmic-frontiers/the-quantum-singular-value-transformation"
  },
  {
    "title": "Capstone: Resource Estimation for a Real Algorithm",
    "description": "Chains this course's code-distance scaling law, magic-state distillation cost, and lattice-surgery overhead into one complete, explicitly-caveated physical-qubit estimate for a small toy circuit, then names which parts of that pipeline are the same methodology real published estimates use.",
    "course": "fault-tolerance-frontiers",
    "module": "capstone-resource-estimation-for-a-real-algorithm",
    "order": 6,
    "difficulty": "master",
    "estimatedMinutes": 60,
    "prerequisites": [
      "apex/fault-tolerance-frontiers/lattice-surgery",
      "apex/fault-tolerance-frontiers/the-threshold-theorem"
    ],
    "objectives": [
      "Combine every ingredient of this course, code distance/logical error rate, magic-state distillation cost, and lattice-surgery gate overhead, into one complete physical-resource estimate for a small, concrete toy algorithm",
      "Show explicitly how the required code distance depends on the algorithm's total gate count and target overall success probability",
      "State honestly which parts of a real resource estimate (like those published for Shor's algorithm factoring cryptographically-relevant numbers) are well-established methodology versus which numbers are sensitive to architecture-specific assumptions",
      "Work out what fraction of the final qubit count the magic-state factories claim, and why that share, not the data patches, is what a serious estimate argues about"
    ],
    "related": [
      {
        "slug": "apex/fault-tolerance-frontiers/magic-states-and-distillation",
        "note": "This capstone reuses that lesson's 15-to-1 distillation output-error formula p_out = 35 p_in³ directly, and the arithmetic below turns its 'the factory dominates the qubit count' finding into an exactly computed share rather than a qualitative echo."
      }
    ],
    "slug": "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm"
  },
  {
    "title": "Decoding Surface Codes",
    "description": "Turns 'which stabilizers flagged' into an actual algorithm: minimum-weight perfect matching on a graph of defects, worked by hand until it succeeds and until it deliberately fails, plus the real exponential-suppression-below-threshold law that makes bigger patches worth building.",
    "course": "fault-tolerance-frontiers",
    "module": "decoding-surface-codes",
    "order": 2,
    "difficulty": "master",
    "estimatedMinutes": 80,
    "prerequisites": [
      "apex/fault-tolerance-frontiers/surface-codes-in-depth"
    ],
    "objectives": [
      "Explain the decoding problem: given a syndrome (which stabilizers flagged), infer the most likely physical error and correct it, and why this is fundamentally a graph-matching problem for the surface code",
      "Describe minimum-weight perfect matching (MWPM) decoding explicitly: syndrome defects as graph vertices, edge weights from error probabilities, and a matching that pairs defects via plausible error chains",
      "State and interpret the empirical/numerical relationship between code distance d and logical error rate: exponential suppression below threshold, p_L ~ (p/p_th)^((d+1)/2), and explain precisely what 'threshold' means operationally"
    ],
    "related": [
      {
        "slug": "apex/fault-tolerance-frontiers/surface-codes-in-depth",
        "note": "That lesson built the lattice, the two stabilizer types, and the defect-pair mechanic this lesson's entire decoding graph is made of; nothing here introduces a new physical mechanism, only an algorithm for reading the syndrome it produces."
      },
      {
        "slug": "quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map",
        "note": "The general recovery procedure there (measure, look up, correct) used a small lookup table because the 3-qubit code's syndrome space was tiny; MWPM is what 'look up the syndrome' has to become once the syndrome space is combinatorially large."
      }
    ],
    "slug": "apex/fault-tolerance-frontiers/decoding-surface-codes"
  },
  {
    "title": "Lattice Surgery",
    "description": "Two separate surface-code patches have no natural transversal two-qubit gate between them. This lesson derives the real fix, lattice surgery's merge and split operations, and shows how a sequence of them, plus an ancilla patch and classical Pauli corrections, assembles a full logical CNOT from the code's own stabilizer measurements.",
    "course": "fault-tolerance-frontiers",
    "module": "lattice-surgery",
    "order": 3,
    "difficulty": "master",
    "estimatedMinutes": 65,
    "prerequisites": [
      "apex/fault-tolerance-frontiers/surface-codes-in-depth"
    ],
    "objectives": [
      "Explain why applying a transversal (physical-qubit-by-physical-qubit) two-qubit gate between two separate surface-code patches is NOT generally possible, motivating an alternative logical two-qubit gate mechanism",
      "Describe the lattice-surgery MERGE operation: temporarily measuring a new set of joint stabilizers along the boundary between two patches to fuse them into one larger patch, and the corresponding SPLIT operation to separate them again",
      "Assemble a full logical CNOT from a sequence of merge/split operations between two logical qubits' patches: a logical ZZ measurement, an ancilla patch, and classically-controlled Pauli corrections"
    ],
    "related": [
      {
        "slug": "apex/fault-tolerance-frontiers/surface-codes-in-depth",
        "note": "This lesson reuses that lesson's lattice convention (vertex Z-type and face X-type stabilizers, plus the rough/smooth boundary classification where X_L and Z_L strings terminate) and does nothing more exotic than adding or removing stabilizers along one of those boundaries."
      },
      {
        "slug": "quantum-mastery/quantum-information-theory/rigorous-teleportation-and-superdense-coding",
        "note": "The logical CNOT built here from an ancilla patch, two joint measurements, and classically-controlled Pauli corrections is structurally the same gate-teleportation gadget that lesson made rigorous at the single-qubit level, just running one level up, on entire code patches instead of bare physical qubits."
      }
    ],
    "slug": "apex/fault-tolerance-frontiers/lattice-surgery"
  },
  {
    "title": "Magic States and Distillation",
    "description": "Why the Gottesman-Knill and Eastin-Knill theorems force every fault-tolerant architecture to treat the T gate as a scarce, purchased resource rather than a free transversal operation, and the real 15-to-1 distillation protocol that manufactures it.",
    "course": "fault-tolerance-frontiers",
    "module": "magic-states-and-distillation",
    "order": 4,
    "difficulty": "master",
    "estimatedMinutes": 65,
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead",
      "apex/fault-tolerance-frontiers/surface-codes-in-depth",
      "apex/fault-tolerance-frontiers/lattice-surgery"
    ],
    "objectives": [
      "State the Gottesman-Knill theorem precisely: circuits built only from Clifford gates (H, S, CNOT) and Pauli measurements can be efficiently simulated classically, so Clifford gates alone are NOT universal for quantum computation, however fault-tolerantly you implement them",
      "Explain why the surface code admits fault-tolerant Clifford operations (CNOT via lattice surgery, S and H by less direct routes) but NOT a fault-tolerant transversal T gate (a no-go result, the Eastin-Knill theorem, stated precisely)",
      "Describe magic-state injection and distillation: preparing many noisy copies of a 'magic state' (e.g. the T-state |T⟩ = (|0⟩ + e^(iπ/4)|1⟩)/√2) and using a Clifford-only circuit plus post-selection to purify fewer, higher-fidelity copies, exponentially suppressing error with each distillation round"
    ],
    "related": [
      {
        "slug": "quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead",
        "note": "That capstone cited hundreds-to-thousands of physical qubits per logical qubit without saying what most of them are doing; this lesson names the answer, dedicated magic-state factories, and shows why they dominate the count."
      }
    ],
    "slug": "apex/fault-tolerance-frontiers/magic-states-and-distillation"
  },
  {
    "title": "Surface Codes in Depth",
    "description": "Surface Codes: A Conceptual Introduction described a 2D lattice of local stabilizers in the abstract. This lesson builds one explicit distance-3 patch by hand: every qubit, every stabilizer, every commutation check, and both logical operators, computed by hand.",
    "course": "fault-tolerance-frontiers",
    "module": "surface-codes-in-depth",
    "order": 1,
    "difficulty": "master",
    "estimatedMinutes": 70,
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/css-codes-and-the-general-stabilizer-formalism",
      "quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction"
    ],
    "objectives": [
      "Construct the surface code's 2D qubit lattice explicitly: data qubits on edges (or vertices, pick one standard convention and be consistent), X-type stabilizers on vertices/plaquettes and Z-type stabilizers on the dual lattice, and verify a small patch's stabilizers all commute",
      "Identify the code's logical X and Z operators as strings of Pauli operators running between opposite boundaries, and explain why the code distance equals the minimum such string length",
      "Compute the exact number of physical qubits, stabilizer generators, and logical qubits for a small dxd surface-code patch, and state the general d-dependence"
    ],
    "related": [
      {
        "slug": "quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction",
        "note": "That lesson's 3x3-vertex picture (Z on vertices, X on faces, both weight 4) is the convention this lesson makes fully explicit, with real boundaries, real qubit labels, and every commutation check carried out by hand."
      },
      {
        "slug": "quantum-mastery/quantum-information-theory/css-codes-and-the-general-stabilizer-formalism",
        "note": "The surface code is a CSS code; this lesson's X/Z commutation check is the same g.h-mod-2 rule proved there, applied here to a real 2D lattice instead of the Hamming code's abstract parity-check rows."
      }
    ],
    "slug": "apex/fault-tolerance-frontiers/surface-codes-in-depth"
  },
  {
    "title": "The Threshold Theorem",
    "description": "The theorem that turned quantum computing from a fragile theoretical curiosity into a scalable engineering target: below a constant physical error rate, concatenated encoding drives logical error arbitrarily low at only polylogarithmic cost.",
    "course": "fault-tolerance-frontiers",
    "module": "the-threshold-theorem",
    "order": 5,
    "difficulty": "master",
    "estimatedMinutes": 65,
    "prerequisites": [
      "apex/fault-tolerance-frontiers/decoding-surface-codes",
      "apex/fault-tolerance-frontiers/magic-states-and-distillation"
    ],
    "objectives": [
      "State the quantum threshold theorem precisely: if the physical error rate per gate/timestep is below a constant threshold p_th, an arbitrarily long quantum computation can be run with arbitrarily small logical error probability, at only polylogarithmic overhead in circuit size",
      "Explain the concatenated-code proof strategy at a conceptual level: nesting a code inside itself reduces the effective error rate at each level as (p/p_th)^2-like, and iterating enough levels drives the error arbitrarily low",
      "Contrast the concatenated-code threshold argument with the surface-code/topological threshold argument from the prerequisite lesson, and state honestly what is rigorously proven versus what is a well-supported numerical/heuristic estimate for real architectures"
    ],
    "related": [
      {
        "slug": "apex/fault-tolerance-frontiers/decoding-surface-codes",
        "note": "That lesson's numerical, decoder-specific surface-code threshold estimate is the 'realistic but not fully rigorous' counterpart this lesson's proven-but-pessimistic concatenated threshold is contrasted against below."
      }
    ],
    "slug": "apex/fault-tolerance-frontiers/the-threshold-theorem"
  },
  {
    "title": "Capstone: What We Know and Don't",
    "description": "This course's four lessons of real theorems, real conjectures, and real open questions, organized into one calibrated three-tier map, plus the one skill that map is for: classifying any new claim about quantum computational power, including 'quantum supremacy' experiments, precisely and honestly.",
    "course": "quantum-complexity-theory",
    "module": "capstone-what-we-know-and-dont",
    "order": 5,
    "difficulty": "master",
    "estimatedMinutes": 90,
    "prerequisites": [
      "apex/quantum-complexity-theory/the-local-hamiltonian-problem",
      "apex/quantum-complexity-theory/query-complexity-and-lower-bounds"
    ],
    "objectives": [
      "Synthesize the whole course into a single, calibrated map of what is PROVEN, what is CONJECTURED (with strong evidence), and what is genuinely OPEN in quantum complexity theory",
      "Explain precisely what 'quantum supremacy/advantage' experiments (e.g. random circuit sampling) do and do not establish, complexity-theoretically",
      "Articulate, as this course's practical takeaway, how to correctly classify a new claim about quantum computational power into the proven/conjectured/open framework",
      "Locate two results from the past decade, the quantum PCP conjecture's first necessary step and practical classical verification of quantum computation, on that map, and say which tier each moved"
    ],
    "related": [
      {
        "slug": "apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp",
        "note": "That lesson first drew the proven/conjectured/open line for P, NP, and BQP specifically; this capstone widens that same three-way distinction to everything the rest of the course added (QMA, Local Hamiltonian, query lower bounds) and to experimental claims like random circuit sampling."
      }
    ],
    "slug": "apex/quantum-complexity-theory/capstone-what-we-know-and-dont"
  },
  {
    "title": "Complexity Classes: P, NP, and BQP",
    "description": "Places BQP within the classical P/NP/PSPACE landscape and sorts every relationship among them into proven, disproven, and still undecided, taking the two directions of NP versus BQP and the status of P versus BQP as its three worked cases.",
    "course": "quantum-complexity-theory",
    "module": "complexity-classes-p-np-and-bqp",
    "order": 1,
    "difficulty": "master",
    "estimatedMinutes": 65,
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/bqp-and-oracle-complexity"
    ],
    "objectives": [
      "Define P, NP, and BQP precisely as classes of decision problems (with the standard error-bounded/verifier definitions), and state the known containment relationships (P subseteq BQP, P subseteq NP, BQP subseteq PSPACE)",
      "Explain why 'NP subseteq BQP?' and 'BQP subseteq NP?' are BOTH open questions, and what a positive/negative resolution of each would mean",
      "State Shor's algorithm's actual complexity-theoretic status honestly and precisely: it shows an integer-factoring problem is in BQP with no known classical polynomial algorithm, but does NOT prove P != BQP (since factoring is not known to be NP-complete, and even a superpolynomial classical hardness proof for factoring remains unproven)"
    ],
    "related": [
      {
        "slug": "quantum-mastery/advanced-algorithms-and-complexity/bqp-and-oracle-complexity",
        "note": "That lesson built BQP's formal bounded-error, polynomial-time-uniform circuit definition and its majority-vote amplification argument from scratch; this lesson takes that same class as given and places it precisely among P, NP, and PSPACE."
      }
    ],
    "slug": "apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp"
  },
  {
    "title": "QMA and Quantum Verification",
    "description": "The quantum analogue of NP: a precise definition of QMA via a polynomial-size quantum witness and verifier, a careful amplification argument that confronts no-cloning head-on, and the known containments NP ⊆ QMA ⊆ PSPACE.",
    "course": "quantum-complexity-theory",
    "module": "qma-and-quantum-verification",
    "order": 2,
    "difficulty": "master",
    "estimatedMinutes": 75,
    "prerequisites": [
      "apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp"
    ],
    "objectives": [
      "Define QMA precisely: decision problems where a YES instance has a polynomial-size QUANTUM state (the 'quantum witness') that a polynomial-time quantum verifier circuit accepts with probability >= 2/3, while every witness for a NO instance is accepted with probability <= 1/3",
      "Explain the amplitude/soundness-completeness gap and why it can be amplified (via parallel repetition, with care taken over how many repetitions are needed and why naive intuition about independent trials needs adjustment for quantum witnesses)",
      "State the known containment NP subseteq QMA subseteq PSPACE, and explain conceptually why a quantum witness could plausibly be MORE powerful than a classical NP witness for some problems"
    ],
    "related": [
      {
        "slug": "apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp",
        "note": "That lesson defines BQP as the quantum analogue of BPP (a decider with no help); this lesson defines QMA as the quantum analogue of NP (a decider with an untrustworthy, all-powerful helper), reusing the same 2/3-vs-1/3 bounded-error convention and the same Chernoff-Hoeffding amplification citation, but now applied to a witness that can't be re-read for free."
      }
    ],
    "slug": "apex/quantum-complexity-theory/qma-and-quantum-verification"
  },
  {
    "title": "Query Complexity and Lower Bounds",
    "description": "BQP and Oracle Complexity stated Grover's Ω(√N) lower bound via BBBV's hybrid method; this lesson goes deeper, developing the quantum adversary method and the polynomial method as two independent proof techniques for the same bound, and computing an adversary-method lower bound by hand.",
    "course": "quantum-complexity-theory",
    "module": "query-complexity-and-lower-bounds",
    "order": 4,
    "difficulty": "master",
    "estimatedMinutes": 75,
    "prerequisites": [
      "apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp"
    ],
    "objectives": [
      "Explain the query (black-box) complexity model precisely: an algorithm's cost is measured only in oracle queries, all other computation is free, and state why this model is the right setting for PROVING (not just conjecturing) lower bounds",
      "State and apply the quantum adversary method (Ambainis' method, at a conceptual/structural level) to derive a checkable lower bound for a small concrete search problem",
      "Contrast the polynomial method as a second, independent proof technique for query lower bounds, and state why having TWO independently-verified techniques both giving the Grover-optimality result strengthens confidence in it"
    ],
    "related": [
      {
        "slug": "quantum-mastery/advanced-algorithms-and-complexity/bqp-and-oracle-complexity",
        "note": "That lesson's BBBV proof sketch used the 'hybrid method' (comparing an algorithm's state against a no-marked-item baseline) to get Ω(√N). This lesson develops the more general adversary method (which compares pairs of hard instances against each other rather than against a baseline) and an entirely independent polynomial method, both confirming the identical bound."
      }
    ],
    "slug": "apex/quantum-complexity-theory/query-complexity-and-lower-bounds"
  },
  {
    "title": "The Local Hamiltonian Problem",
    "description": "A many-body ground state has no known compact classical description, yet fits as a poly-size quantum witness. This lesson makes that precise: the k-Local Hamiltonian problem is defined exactly, shown to sit inside QMA via an estimation argument on the witness, and shown to be QMA-hard via a sketch of Kitaev's history-state construction.",
    "course": "quantum-complexity-theory",
    "module": "the-local-hamiltonian-problem",
    "order": 3,
    "difficulty": "master",
    "estimatedMinutes": 80,
    "prerequisites": [
      "apex/quantum-complexity-theory/qma-and-quantum-verification",
      "quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization"
    ],
    "objectives": [
      "State the k-Local Hamiltonian problem precisely: given a Hamiltonian H = sum of terms each acting on at most k qubits, decide whether its ground-state energy is below a or above b (with b-a at least inverse-polynomial), promised one of the two holds",
      "Explain why this problem is naturally in QMA (the ground state itself is a natural quantum witness) and sketch, at a conceptual level, Kitaev's QMA-hardness construction via a 'history state' encoding a verification circuit's execution",
      "Trace the precise sequence of hardness results (5-local, then 2-local, then physically-motivated model-specific results like 2D nearest-neighbor spin lattices) and what each successive tightening actually establishes"
    ],
    "related": [
      {
        "slug": "apex/quantum-complexity-theory/qma-and-quantum-verification",
        "note": "That lesson closed by noting a many-body ground state has no known compact classical encoding yet is exactly the right size to serve as a QMA witness; this lesson turns that observation into an actual QMA-membership proof for Local Hamiltonian and completes the picture with Kitaev's QMA-hardness construction, the quantum analogue of that lesson's own NP-completeness intuition."
      },
      {
        "slug": "quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization",
        "note": "That lesson's Trotter-Suzuki machinery is what a verifier would need to simulate evolution under the FULL Hamiltonian H = sum H_i; this lesson's QMA-verification argument sidesteps that need entirely by estimating each k-qubit term H_i on its own, showing that it is the LOCAL structure of H, not general simulability, that makes Local Hamiltonian efficiently verifiable."
      }
    ],
    "slug": "apex/quantum-complexity-theory/the-local-hamiltonian-problem"
  },
  {
    "title": "Capstone: The Quantum Computing Landscape Today",
    "description": "The curriculum's last lesson: a full retracing of the journey from the postulates of quantum mechanics to today's research frontier, an honest and calibrated map of what quantum computing has actually proven, credibly evidenced, and still left open, and a closing statement of what completing it equips you to do.",
    "course": "research-methods-and-synthesis",
    "module": "capstone-the-quantum-computing-landscape-today",
    "order": 5,
    "difficulty": "master",
    "estimatedMinutes": 90,
    "prerequisites": [
      "apex/research-methods-and-synthesis/reproducing-and-designing-experiments",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm"
    ],
    "objectives": [
      "Synthesize the ENTIRE StudyQuantum curriculum's journey, from the postulates of quantum mechanics through algorithms, hardware, error correction, complexity theory, and research methods, into one coherent narrative",
      "Give an honest, current, well-calibrated map of the quantum computing field's actual state: what is built, what is proven, what is believed, and what remains genuinely open",
      "Articulate, as the platform's final message, what a student who has completed this entire curriculum is now actually equipped to do"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics",
        "note": "The four postulates stated there (state, observable, measurement, evolution) are the same four objects this capstone's entire state-of-the-field map is ultimately still about: a physical qubit realizing postulate 1, a logical qubit's syndrome measurement realizing postulate 3, a fault-tolerant gate realizing postulate 4. Nothing since has replaced them; everything since has been what it takes to engineer and reason about them at scale."
      }
    ],
    "slug": "apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today"
  },
  {
    "title": "Distinguishing Theorem from Heuristic",
    "description": "An explicit four-question checklist, built on a proven/conjectured/open framework, for classifying any quantum-computing claim as a theorem, a well-supported heuristic, a conjecture, or genuinely open, practiced on real results this platform already built.",
    "course": "research-methods-and-synthesis",
    "module": "distinguishing-theorem-from-heuristic",
    "order": 2,
    "difficulty": "master",
    "estimatedMinutes": 75,
    "prerequisites": [
      "apex/research-methods-and-synthesis/how-to-read-a-quantum-computing-paper",
      "apex/quantum-complexity-theory/capstone-what-we-know-and-dont"
    ],
    "objectives": [
      "Build an explicit checklist for classifying a claim as a proven theorem, a numerically/empirically supported heuristic, or a conjecture, using specific real examples this platform's OWN courses already covered",
      "Explain why some important, widely-used quantum algorithms (e.g. QAOA's real-world performance) rest on heuristic/numerical evidence rather than proven worst-case guarantees, and why this doesn't make them worthless",
      "Practice applying the checklist to several specific claims, correctly classifying each and stating what additional evidence (if any) would be needed to upgrade a heuristic to a theorem"
    ],
    "related": [
      {
        "slug": "apex/quantum-complexity-theory/capstone-what-we-know-and-dont",
        "note": "That capstone built the proven/strongly-evidenced-conjecture/genuinely-open three-tier map specifically for complexity-class questions (P vs. NP, BQP vs. NP, random circuit sampling); this lesson takes the exact same three-way distinction, splits its middle tier into 'well-supported heuristic' and 'conjecture' (two different kinds of unproven-but-evidenced claim), and generalizes the whole thing into a checklist for any quantum-computing claim at all, not just complexity classes."
      }
    ],
    "slug": "apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic"
  },
  {
    "title": "Evaluating Quantum Advantage Claims",
    "description": "A five-question checklist, built directly on this course's own classically-easy criteria, for turning any 'quantum advantage' headline into a set of concrete, checkable claims about a specific task, a specific classical baseline, and a specific assumption.",
    "course": "research-methods-and-synthesis",
    "module": "evaluating-quantum-advantage-claims",
    "order": 3,
    "difficulty": "master",
    "estimatedMinutes": 60,
    "prerequisites": [
      "apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic",
      "apex/simulation-and-compilation-frontiers/when-classical-simulation-works"
    ],
    "objectives": [
      "Build an explicit checklist for evaluating a 'quantum advantage/supremacy' claim: what specific task was solved, what specific classical baseline was compared against, was that baseline actually the best known classical approach, and what complexity-theoretic assumption (if any) underlies the claimed classical hardness",
      "Apply the checklist to the real, well-documented history of quantum advantage claims being challenged or narrowed by improved classical algorithms, correctly identifying what this pattern does and doesn't mean about the field's validity",
      "Explain the crucial distinction between a quantum advantage claim for a specifically-engineered task versus for a genuinely useful computational problem, and why this distinction matters for evaluating real-world impact"
    ],
    "related": [
      {
        "slug": "apex/simulation-and-compilation-frontiers/when-classical-simulation-works",
        "note": "That lesson's two classical-simulability loopholes, Gottesman-Knill/stabilizer structure and bounded bond-dimension/entanglement growth, are the exact structural checks this lesson's checklist asks a claimed-hard task to survive."
      }
    ],
    "slug": "apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims"
  },
  {
    "title": "How to Read a Quantum Computing Paper",
    "description": "The final course of StudyQuantum opens with a practical skill rather than new physics: a reading strategy for turning everything this platform built into the ability to evaluate a real research claim independently.",
    "course": "research-methods-and-synthesis",
    "module": "how-to-read-a-quantum-computing-paper",
    "order": 1,
    "difficulty": "master",
    "estimatedMinutes": 75,
    "prerequisites": [
      "apex/algorithmic-frontiers/capstone-the-toolbox-that-ate-quantum-algorithms"
    ],
    "objectives": [
      "Identify the standard structural anatomy of a quantum-computing research paper (abstract's actual claim, the precise theorem/result statement, the assumptions/model section, numerical results vs. proven bounds, and the honest limitations/discussion section) and what to look for in each",
      "Distinguish a paper's PRECISE technical claim from its abstract's more casually-worded framing, using a worked practice example",
      "Spot the common places where a paper's own abstract or introduction can (even unintentionally) oversell a result relative to its actual, precisely-stated theorem or numerical finding"
    ],
    "related": [
      {
        "slug": "apex/algorithmic-frontiers/capstone-the-toolbox-that-ate-quantum-algorithms",
        "note": "That capstone named this exact reading skill as APEX's own explicit later subject, promising that recognizing a block encoding or a QSVT construction in a real paper is a durable research-reading skill; this lesson is where that promise gets redeemed into a full, general reading strategy, applied here to a claim about oracle separations rather than to QSVT itself."
      }
    ],
    "slug": "apex/research-methods-and-synthesis/how-to-read-a-quantum-computing-paper"
  },
  {
    "title": "Reproducing and Designing Experiments",
    "description": "Reproducing a claim means fixing the exact circuit, hardware or simulator with a calibration snapshot, the classical post-processing pipeline, and a shot count large enough for the reported number to mean anything statistically. Works a real standard-error calculation and designs a complete, decidable benchmark for a QAOA claim.",
    "course": "research-methods-and-synthesis",
    "module": "reproducing-and-designing-experiments",
    "order": 4,
    "difficulty": "master",
    "estimatedMinutes": 55,
    "prerequisites": [
      "apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims"
    ],
    "objectives": [
      "Identify the components a real quantum-computing experimental claim needs to be reproducible: exact circuit specification, exact hardware/simulator and its calibration data, exact classical post-processing/error-mitigation pipeline, and honest statistical uncertainty reporting",
      "Explain why statistical/sampling noise (shot noise) requires a stated number of circuit repetitions and confidence interval, not just a single reported number, and compute a concrete example",
      "Design a small, well-specified benchmark experiment for a specific claim (reusing this platform's own simulator infrastructure conceptually) that would meaningfully test it, stating explicitly what result would confirm vs. refute the claim"
    ],
    "related": [
      {
        "slug": "apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims",
        "note": "That lesson audited whether a claim's classical baseline was fair; this lesson audits whether the claim is reproducible and statistically well-supported at all. A claim needs to pass both checks before it is worth believing."
      }
    ],
    "slug": "apex/research-methods-and-synthesis/reproducing-and-designing-experiments"
  },
  {
    "title": "Capstone: From Algorithm to Qubit Count",
    "description": "Chains every stage this course built, classical-simulability check, T-count synthesis, routing overhead, onto the Fault Tolerance Frontiers capstone's own four-step resource-estimation methodology, turning one toy molecular-simulation circuit into a single honestly-caveated physical-qubit estimate.",
    "course": "simulation-and-compilation-frontiers",
    "module": "capstone-from-algorithm-to-qubit-count",
    "order": 6,
    "difficulty": "master",
    "estimatedMinutes": 70,
    "prerequisites": [
      "apex/simulation-and-compilation-frontiers/noise-aware-compilation-and-resource-estimation",
      "apex/simulation-and-compilation-frontiers/quantum-simulation-of-molecules",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm"
    ],
    "objectives": [
      "Combine every ingredient of this course (classical-simulability boundary, T-count synthesis, routing/noise-aware compilation) with the Fault Tolerance Frontiers course's own resource-estimation methodology into one complete, end-to-end pipeline",
      "Walk a small toy molecular-simulation problem through every stage of this pipeline: algorithm gate count → T-count via synthesis → routing overhead → fault-tolerant physical-qubit estimate",
      "State honestly which parts of this pipeline are well-established engineering practice versus where genuine, active research uncertainty remains",
      "Check first whether the circuit is classically simulable at all, and recognize that a negative answer at that stage makes every later stage moot"
    ],
    "related": [
      {
        "slug": "apex/simulation-and-compilation-frontiers/quantum-simulation-of-molecules",
        "note": "This capstone takes that lesson's own toy Trotterized time-evolution circuit and, instead of stopping at 'here is the gate count,' pushes it the rest of the way through synthesis, routing, and fault tolerance to an actual qubit count."
      },
      {
        "slug": "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
        "note": "The four-step error-budget → code-distance → distillation → qubit-count methodology derived and worked there is reused here verbatim, applied to this course's own gate counts instead of that lesson's stand-alone $N_T,N_2$ pair."
      }
    ],
    "slug": "apex/simulation-and-compilation-frontiers/capstone-from-algorithm-to-qubit-count"
  },
  {
    "title": "Clifford+T Synthesis and Resource Counting",
    "description": "Every gate reduces to native rotations exactly; a fault-tolerant device instead needs an approximate Clifford+T sequence, and this lesson shows why the algorithm used to find that sequence, not just its length, decides whether a T-count is thousands or hundreds.",
    "course": "simulation-and-compilation-frontiers",
    "module": "clifford-t-synthesis-and-resource-counting",
    "order": 3,
    "difficulty": "master",
    "estimatedMinutes": 50,
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition",
      "apex/fault-tolerance-frontiers/magic-states-and-distillation"
    ],
    "objectives": [
      "Explain why T-count (the number of T gates in a Clifford+T circuit) is the dominant resource metric for fault-tolerant algorithm cost, directly connecting to the magic-state-distillation prerequisite's 'factories dominate cost' finding",
      "State the Solovay-Kitaev theorem precisely: any single-qubit unitary can be approximated to precision epsilon by a sequence of O(log^c(1/epsilon)) gates from a fixed universal gate set, for some constant c (historically c around 2-4 depending on the specific algorithm variant), and explain what this guarantees and what it doesn't",
      "Distinguish Solovay-Kitaev-style generic synthesis from NUMBER-THEORETIC exact/near-optimal synthesis algorithms (e.g. the Ross-Selinger algorithm for single-qubit Z-rotations) that achieve provably optimal or near-optimal T-count for SPECIFIC useful gate families, and explain why the distinction matters practically"
    ],
    "related": [
      {
        "slug": "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition",
        "note": "That lesson verified exact decompositions like H=Ry(π/2)Rz(π) to machine precision; a Clifford+T decomposition of a generic rotation can never be exact at all; this lesson is about the length of the best APPROXIMATE sequence instead, and the tradeoff behind that word 'best'."
      },
      {
        "slug": "apex/fault-tolerance-frontiers/magic-states-and-distillation",
        "note": "That lesson established that every T gate consumes one expensively-distilled magic state, making T-count the currency of fault-tolerant cost; this lesson is the compiler-side question of how few units of that currency a given circuit actually needs to spend."
      }
    ],
    "slug": "apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting"
  },
  {
    "title": "Noise-Aware Compilation and Resource Estimation",
    "description": "Adds the two pieces a real device forces onto SWAP-overhead counting beyond a uniform, error-blind linear chain: a 4-logical-qubit routing example's exact SWAP total, and a remapping of the same 17-gate circuit that changes only which physical coupler each gate runs on, then costs both layouts against a real per-edge error table.",
    "course": "simulation-and-compilation-frontiers",
    "module": "noise-aware-compilation-and-resource-estimation",
    "order": 4,
    "difficulty": "master",
    "estimatedMinutes": 45,
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation",
      "apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting"
    ],
    "objectives": [
      "Explain qubit routing and SWAP overhead precisely: mapping a circuit's logical two-qubit gates onto a real device's limited connectivity graph, and computing the SWAP-gate overhead for a specific concrete circuit and device topology",
      "Judge why noise-aware compilation (choosing among multiple valid circuit compilations based on WHICH specific physical qubits/gates have the lowest measured error rates, not just gate count) can meaningfully change a circuit's expected success probability on real, non-uniform hardware",
      "Combine gate count, routing overhead, and per-gate error rates into a single estimated circuit success probability for a concrete small example, synthesizing this course's compilation threads into one number a real experimentalist would actually care about"
    ],
    "related": [
      {
        "slug": "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation",
        "note": "That lesson's swapOverheadForLinearChain formula, 2(d-1) per non-adjacent gate, is reused directly below for a real 4-logical-qubit routing problem; this lesson's new ingredient is combining that overhead with a device's non-uniform per-coupler error rates to get an actual success probability, not just a SWAP count."
      }
    ],
    "slug": "apex/simulation-and-compilation-frontiers/noise-aware-compilation-and-resource-estimation"
  },
  {
    "title": "Quantum Simulation of Molecules",
    "description": "The electronic structure problem's combinatorial Hilbert space made concrete, then a fully explicit 2-mode Jordan-Wigner mapping verified numerically, not just asserted, to satisfy {a₁,a₂†}=0. Frames VQE and phase estimation as this field's two honestly-scoped paths toward a near-term-plausible quantum advantage.",
    "course": "simulation-and-compilation-frontiers",
    "module": "quantum-simulation-of-molecules",
    "order": 5,
    "difficulty": "master",
    "estimatedMinutes": 35,
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization"
    ],
    "objectives": [
      "State the electronic structure problem precisely: finding the ground-state energy of a molecular Hamiltonian (electrons in the Coulomb field of fixed nuclei, the Born-Oppenheimer approximation), and explain why this is believed classically hard for all but small/special molecules",
      "Explain the second-quantized molecular Hamiltonian and the Jordan-Wigner transformation for mapping fermionic creation/annihilation operators to qubit Pauli operators, verifying the mapping preserves the fermionic anticommutation relations on a small explicit example",
      "Weigh the two main quantum algorithmic approaches, VQE (variational, NISQ-friendly) and quantum phase estimation (fault-tolerant, asymptotically superior), and state honestly, with real numbers where possible, the qubit/gate-count scale needed for classically-hard, chemically-significant molecules"
    ],
    "related": [
      {
        "slug": "quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization",
        "note": "That lesson's first-order Trotter product formula and its derived error bound are exactly the circuit-cost machinery this lesson's phase-estimation approach depends on: 'simulate e^(-iHt)' here literally means running that lesson's Trotter steps on the Jordan-Wigner-mapped molecular Hamiltonian."
      },
      {
        "slug": "quantum-software/compilation-and-hybrid-algorithms/variational-algorithm-implementation",
        "note": "That lesson's QuantumCircuit-based ansatz and grid-search optimizer are the literal near-term implementation path referenced here when VQE is called the dominant NISQ-era approach to the Jordan-Wigner-mapped molecular Hamiltonian, without re-deriving VQE's own mechanics again."
      }
    ],
    "slug": "apex/simulation-and-compilation-frontiers/quantum-simulation-of-molecules"
  },
  {
    "title": "Tensor Networks and Matrix Product States",
    "description": "Tensor Network Methods introduced the picture in words; this lesson builds the actual matrix product state decomposition via repeated SVD, defines bond dimension exactly as the Schmidt rank it is, and works the GHZ state's decomposition by hand and in code.",
    "course": "simulation-and-compilation-frontiers",
    "module": "tensor-networks-and-matrix-product-states",
    "order": 1,
    "difficulty": "master",
    "estimatedMinutes": 55,
    "prerequisites": [
      "quantum-software/simulating-quantum-systems/tensor-network-methods"
    ],
    "objectives": [
      "Construct the matrix product state (MPS) decomposition of an n-qubit state explicitly via repeated singular value decomposition (SVD), and define bond dimension precisely as the number of singular values kept at each cut",
      "Prove, on a worked example, that a state's bond dimension across a given cut equals exactly the Schmidt rank of that bipartition, connecting directly to entanglement entropy across that cut",
      "Explain the area law for ground states of gapped, local 1D Hamiltonians (entanglement entropy across any cut is bounded, NOT growing with system size), and why entropy bounds bond dimension only from below, so that what makes an efficient MPS possible is the fast singular-value decay behind the law, giving a truncated bond dimension polynomial in n and 1/epsilon rather than a cap on the exact Schmidt rank"
    ],
    "related": [
      {
        "slug": "quantum-software/simulating-quantum-systems/tensor-network-methods",
        "note": "That lesson asserted bond dimension controls how much entanglement a tensor network can capture without ever performing the SVD that defines it; this lesson supplies that construction, and checks bond dimension 2 for GHZ by hand and against this platform's own partialTrace/eigenvaluesHermitian2x2 code, not merely a plausible-sounding number."
      },
      {
        "slug": "quantum-mastery/quantum-shannon-theory/entanglement-distillation-and-typical-subspaces",
        "note": "That lesson's typical-subspace argument runs the same bipartite Schmidt-decomposition machinery built here, applied to n identical copies of a state instead of n distinct sites, and its distillation rate is exactly the entanglement entropy per copy this lesson computes for GHZ across a single cut."
      }
    ],
    "slug": "apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states"
  },
  {
    "title": "When Classical Simulation Works",
    "description": "Two independent reasons a quantum circuit's output can be predicted on an ordinary computer: the Gottesman-Knill theorem's stabilizer tableau, and the tensor-network bond-dimension bound. Each is blind to exactly what the other tracks, which is why a real quantum-advantage experiment must defeat both at once.",
    "course": "simulation-and-compilation-frontiers",
    "module": "when-classical-simulation-works",
    "order": 2,
    "difficulty": "master",
    "estimatedMinutes": 80,
    "prerequisites": [
      "apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states",
      "quantum-computing/error-correction-and-fault-tolerance/stabilizer-formalism-basics"
    ],
    "objectives": [
      "State the Gottesman-Knill theorem precisely: stabilizer circuits (Clifford gates + Pauli measurements, starting from a computational-basis state) admit an efficient classical simulation algorithm, polynomial in qubit count and circuit depth",
      "Explain the low-entanglement/bounded-bond-dimension boundary for tensor-network-based classical simulation, using the area-law and bond-dimension ideas from the prerequisite lesson",
      "Synthesize both boundaries into a precise statement of what makes a quantum circuit or state 'classically easy,' and why this is the operational definition researchers actually use when evaluating a claimed quantum advantage result"
    ],
    "related": [
      {
        "slug": "apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states",
        "note": "That lesson defined bond dimension χ as the size of an MPS's virtual bond and showed the entanglement entropy across a cut is bounded by log2(χ); this lesson uses exactly that bound as its second classical-simulability criterion, and the worked example below computes χ explicitly (reaching the maximum possible value, then staying pinned at the minimum) for two concrete circuits using that same framework."
      },
      {
        "slug": "quantum-computing/error-correction-and-fault-tolerance/stabilizer-formalism-basics",
        "note": "That lesson's n×2n binary tableau for a handful of stabilizer generators (there, the bit-flip code's 2 generators for a 3-qubit code) is exactly the same object this lesson scales up to a full n-generator tableau describing an entire n-qubit state, with the explicit Clifford-gate update rules and the deterministic/random measurement split that make Gottesman-Knill's efficient algorithm work in general, not just for that one code's two generators."
      }
    ],
    "slug": "apex/simulation-and-compilation-frontiers/when-classical-simulation-works"
  },
  {
    "title": "Bell's Theorem and Local Hidden Variables",
    "description": "A complete, self-contained proof that no local hidden-variable theory can produce a CHSH correlation value greater than 2: the classical bound quantum mechanics is about to be shown violating.",
    "course": "entanglement-and-measurement",
    "module": "bells-theorem-and-local-hidden-variables",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 40,
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/evolution-and-measurement-of-density-matrices"
    ],
    "objectives": [
      "State the local hidden-variable (LHV) model precisely, including exactly what 'local' means",
      "Prove the CHSH inequality |S|≤2 holds for every LHV model, with no exceptions",
      "Explain precisely what kind of theory Bell's theorem does, and does not, rule out"
    ],
    "slug": "quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables"
  },
  {
    "title": "Capstone: Analyzing Quantum Correlations",
    "description": "Every tool this course built, applied end to end to one unfamiliar entangled state: purity, entropy, concurrence, partial trace, and a CHSH test run at angles that were tuned for a different state, plus a demonstration of where this engine's scope ends.",
    "course": "entanglement-and-measurement",
    "module": "capstone-analyzing-quantum-correlations",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 35,
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/the-chsh-inequality"
    ],
    "objectives": [
      "Apply every tool from this course (density matrix, partial trace, purity, entropy, concurrence, CHSH) to a single unfamiliar state",
      "Distinguish which computations require a pure global state and which work on any valid density matrix",
      "State precisely, with a working example, where this platform's density-matrix engine's scope ends"
    ],
    "slug": "quantum-computing/entanglement-and-measurement/capstone-analyzing-quantum-correlations"
  },
  {
    "title": "Concurrence: A Two-Qubit Entanglement Measure",
    "description": "A second, independently-computed entanglement measure for pure 2-qubit states, built directly from amplitudes rather than eigenvalues: proven to agree exactly with entanglement entropy on which states are entangled, and derived from machinery this platform already had.",
    "course": "entanglement-and-measurement",
    "module": "concurrence-a-two-qubit-measure",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/entanglement-entropy-for-pure-states"
    ],
    "objectives": [
      "Define concurrence for a pure 2-qubit state directly from its amplitudes",
      "Prove concurrence's exact algebraic relationship to reduced-state purity",
      "State precisely why the general mixed-state Wootters concurrence formula is out of scope here"
    ],
    "slug": "quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure"
  },
  {
    "title": "Convex Combinations and Physical Mixtures",
    "description": "The general N-component mixture, and the sharpest fact about density matrices yet: different preparation recipes can produce the same ρ, and no experiment can tell them apart.",
    "course": "entanglement-and-measurement",
    "module": "convex-combinations-and-physical-mixtures",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states"
    ],
    "objectives": [
      "Build a density matrix from an arbitrary N-component probabilistic ensemble",
      "Prove that two different ensembles can produce an identical density matrix",
      "State precisely why ρ, not the preparation recipe, is the physically complete description"
    ],
    "slug": "quantum-computing/entanglement-and-measurement/convex-combinations-and-physical-mixtures"
  },
  {
    "title": "Entanglement Entropy for Pure Bipartite States",
    "description": "Combining the last two lessons into the standard entanglement measure, with a counterexample showing why it stops being valid the moment the global state is mixed.",
    "course": "entanglement-and-measurement",
    "module": "entanglement-entropy-for-pure-states",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/why-entangled-subsystems-are-mixed",
      "quantum-computing/entanglement-and-measurement/purity-entropy-and-information"
    ],
    "objectives": [
      "Define entanglement entropy as the reduced state's von Neumann entropy, for globally pure states",
      "Compute entanglement entropy for a product state, a Bell state, and a partially entangled state",
      "Construct a counterexample proving reduced entropy fails as an entanglement measure for mixed global states"
    ],
    "related": [
      {
        "slug": "quantum-software/simulating-quantum-systems/tensor-network-methods",
        "note": "This lesson's entanglement entropy is the exact quantity that decides when a tensor-network simulation stays cheap: small entropy (an area law) means a small bond dimension suffices."
      }
    ],
    "slug": "quantum-computing/entanglement-and-measurement/entanglement-entropy-for-pure-states"
  },
  {
    "title": "Unitary Evolution and Measurement of Density Matrices",
    "description": "Gates and measurement, rebuilt for density matrices: ρ'=UρU† derived from the state-vector rule, the generalized Born rule and collapse formula derived the same way, and a mixed-state measurement worked out that a state vector alone could never express.",
    "course": "entanglement-and-measurement",
    "module": "evolution-and-measurement-of-density-matrices",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure"
    ],
    "objectives": [
      "Derive ρ'=UρU† from the state-vector evolution rule, and extend it to mixtures by linearity",
      "Derive the generalized Born rule pᵢ=Tr(Pᵢρ) and the post-measurement collapse formula",
      "Compute a measurement on a genuinely mixed state, with no state-vector equivalent available"
    ],
    "slug": "quantum-computing/entanglement-and-measurement/evolution-and-measurement-of-density-matrices"
  },
  {
    "title": "From State Vectors to Density Matrices",
    "description": "The operator ρ=|ψ⟩⟨ψ| that carries the same information as a state vector, derived rather than defined, and cross-checked against every expectation value this platform has computed so far.",
    "course": "entanglement-and-measurement",
    "module": "from-state-vectors-to-density-matrices",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors"
    ],
    "objectives": [
      "Construct the density matrix ρ=|ψ⟩⟨ψ| for a pure state from its amplitudes",
      "Prove Tr(ρ)=1 and ρ=ρ† follow directly from |ψ⟩ being normalized",
      "Derive ⟨A⟩=Tr(ρA) from the ordinary expectation-value formula ⟨ψ|A|ψ⟩"
    ],
    "slug": "quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices"
  },
  {
    "title": "Partial Trace and Reduced States",
    "description": "The operation state vectors cannot express at all: deriving the partial trace from the single requirement that it must reproduce local measurement statistics correctly, then computing it for a product state and a Bell pair.",
    "course": "entanglement-and-measurement",
    "module": "partial-trace-and-reduced-states",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 35,
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/convex-combinations-and-physical-mixtures"
    ],
    "objectives": [
      "Derive the partial trace from the requirement that it preserve local expectation values",
      "Compute the reduced density matrix of one qubit from a 2-qubit density matrix, product and entangled",
      "State and use this platform's qubit-ordering convention (qubit 0 = most significant bit) in a partial trace"
    ],
    "slug": "quantum-computing/entanglement-and-measurement/partial-trace-and-reduced-states"
  },
  {
    "title": "Pure States and Mixed States",
    "description": "What a density matrix can express that a state vector cannot: classical uncertainty about which quantum state you have, and why |+⟩ and a 50/50 mix of |0⟩,|1⟩ give identical computational-basis statistics but are provably different states.",
    "course": "entanglement-and-measurement",
    "module": "pure-states-and-mixed-states",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices"
    ],
    "objectives": [
      "Construct a mixed-state density matrix as a probability-weighted sum of pure-state density matrices",
      "Distinguish a classical mixture from a quantum superposition using an explicit worked example",
      "Use Tr(ρ²) to detect the difference between two states with identical diagonal entries"
    ],
    "slug": "quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states"
  },
  {
    "title": "Purity, von Neumann Entropy, and Information",
    "description": "The standard measure of mixedness, von Neumann entropy, built from a density matrix's eigenvalues via a closed-form 2×2 solver, and shown to reduce to classical Shannon entropy when ρ is diagonal.",
    "course": "entanglement-and-measurement",
    "module": "purity-entropy-and-information",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/why-entangled-subsystems-are-mixed"
    ],
    "objectives": [
      "Compute a qubit density matrix's eigenvalues in closed form and use them to define von Neumann entropy",
      "Show that von Neumann entropy reduces to classical Shannon entropy for a diagonal ρ",
      "Explain why entropy must be computed from eigenvalues, not diagonal entries, using a concrete counterexample"
    ],
    "slug": "quantum-computing/entanglement-and-measurement/purity-entropy-and-information"
  },
  {
    "title": "The CHSH Inequality and Quantum Violation",
    "description": "Deriving E(a,b)=cos(θₐ−θ_b) by hand for a Bell state, using it to compute S=2√2 exactly at the standard measurement angles, and watching the violation vanish as noise mixes entanglement away.",
    "course": "entanglement-and-measurement",
    "module": "the-chsh-inequality",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 35,
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables"
    ],
    "objectives": [
      "Derive the quantum correlation formula E(a,b)=cos(θₐ−θ_b) for a Bell state by direct calculation",
      "Compute the CHSH value S=2√2 exactly, at a specific measurement configuration, and verify it against the engine",
      "Explain, with numerical evidence, why entangled-but-noisy states produce a weaker or absent violation"
    ],
    "slug": "quantum-computing/entanglement-and-measurement/the-chsh-inequality"
  },
  {
    "title": "Why Entangled Subsystems Are Mixed",
    "description": "A complete proof, for 2-qubit pure states, that a reduced state is mixed exactly when the global state is entangled, connecting reduced purity directly to the separability determinant this platform already computes.",
    "course": "entanglement-and-measurement",
    "module": "why-entangled-subsystems-are-mixed",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/partial-trace-and-reduced-states"
    ],
    "objectives": [
      "Derive an exact algebraic identity relating a 2-qubit reduced state's purity to its separability determinant",
      "Prove that a pure 2-qubit state is a product state if and only if both reduced states are pure",
      "Explain why this identity does not, by itself, extend to systems larger than two qubits"
    ],
    "slug": "quantum-computing/entanglement-and-measurement/why-entangled-subsystems-are-mixed"
  },
  {
    "title": "Capstone: Fault-Tolerant Thresholds and Resource Overhead",
    "description": "The threshold theorem's qualitative logic: why increasing code distance helps only below a critical physical error rate, plus honest, explicitly-cited (not derived) figures for physical-to-logical qubit overhead, closing the loop back to Quantum Algorithms II's Shor's-algorithm capstone.",
    "course": "error-correction-and-fault-tolerance",
    "module": "capstone-fault-tolerant-thresholds-and-resource-overhead",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction"
    ],
    "objectives": [
      "Explain the threshold theorem's qualitative logic: why larger distance only helps below a critical physical error rate, and why it makes things worse above one",
      "Connect this course's own distance-3 codes to what Shor's algorithm (Quantum Algorithms II) actually needs at scale"
    ],
    "slug": "quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead"
  },
  {
    "title": "Stabilizer Formalism Basics",
    "description": "The bit-flip code's syndrome measurements, renamed and generalized: Z0Z1 and Z1Z2 are the code's stabilizer generators, and a syndrome bit flipping from 0 to 1 is the statement that an error anticommutes with that generator.",
    "course": "error-correction-and-fault-tolerance",
    "module": "stabilizer-formalism-basics",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/the-shor-code-combining-both"
    ],
    "objectives": [
      "Define a stabilizer generator and verify Z0Z1, Z1Z2 stabilize the bit-flip code's two basis states",
      "Explain syndrome measurement as measuring stabilizer generators' ±1 eigenvalues",
      "Derive why an X error anticommutes with exactly the stabilizers whose syndrome it flips"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/operators-observables-measurement/simultaneous-eigenstates-and-compatible-observables",
        "note": "The general theorem (commuting Hermitian operators share an eigenbasis) that stabilizer generators, as simultaneous +1 eigenstates, are a direct application of."
      }
    ],
    "slug": "quantum-computing/error-correction-and-fault-tolerance/stabilizer-formalism-basics"
  },
  {
    "title": "Surface Codes: A Conceptual Introduction",
    "description": "Why real quantum hardware roadmaps build toward surface codes rather than the Shor code: nearest-neighbor-only stabilizers on a 2D grid, arbitrarily improvable distance, and an honest account of why this platform doesn't simulate one.",
    "course": "error-correction-and-fault-tolerance",
    "module": "surface-codes-a-conceptual-introduction",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map"
    ],
    "objectives": [
      "Describe the surface code's 2D lattice structure and its two types of local stabilizers",
      "Explain why nearest-neighbor-only stabilizers matter for real hardware, using this platform's own qubit-connectivity-free engine as a contrast",
      "State precisely why this platform covers surface codes conceptually rather than in simulated code"
    ],
    "slug": "quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction"
  },
  {
    "title": "Syndrome Measurement and the Recovery Map",
    "description": "The general recovery procedure, measure every stabilizer, look up the syndrome, apply the matching correction, stated for any stabilizer code, plus the (n,k,d) parameters that describe a code's size, logical qubit count, and error-correcting power.",
    "course": "error-correction-and-fault-tolerance",
    "module": "syndrome-measurement-and-the-recovery-map",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/stabilizer-formalism-basics"
    ],
    "objectives": [
      "State the general recovery procedure for any stabilizer code",
      "Define the (n,k,d) code parameters and give the 3-qubit codes' own parameters",
      "Explain the relationship between code distance and how many errors a code can correct"
    ],
    "slug": "quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map"
  },
  {
    "title": "The Shor Code: Combining Both",
    "description": "Concatenating the bit-flip and phase-flip codes into a 9-qubit code that corrects an arbitrary single-qubit error, the construction derived from the last two lessons' building blocks, introduced conceptually since simulating its full circuit is beyond this course's engine.",
    "course": "error-correction-and-fault-tolerance",
    "module": "the-shor-code-combining-both",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-phase-flip-code"
    ],
    "objectives": [
      "Describe the Shor code's concatenated construction: phase-flip encoding, then bit-flip encoding each resulting qubit",
      "Explain why concatenation corrects a Y error, which neither 3-qubit code alone corrects",
      "State why the course's engine simulates the two 3-qubit codes but not the full 9-qubit Shor code"
    ],
    "slug": "quantum-computing/error-correction-and-fault-tolerance/the-shor-code-combining-both"
  },
  {
    "title": "The Three-Qubit Bit-Flip Code",
    "description": "Encoding α|0⟩+β|1⟩ into α|000⟩+β|111⟩ via two CNOTs, extracting a syndrome via two real ancilla qubits and genuine partial measurement, and recovering the exact original state after an X error on any of the three qubits, verified, not just described.",
    "course": "error-correction-and-fault-tolerance",
    "module": "the-three-qubit-bit-flip-code",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/why-quantum-errors-are-different"
    ],
    "objectives": [
      "Derive the encoding circuit α|0⟩+β|1⟩ → α|000⟩+β|111⟩ from two CNOTs",
      "Construct the Z0Z1/Z1Z2 syndrome-extraction circuit and its 4-outcome decode table",
      "Verify the full encode-error-correct cycle recovers the exact original state for every single-qubit X error"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized",
        "note": "Measuring the syndrome ancillas here leaves the encoded α,β undisturbed because it is a degenerate projective measurement in that lesson's generalized sense, not a measurement of the logical qubit itself."
      }
    ],
    "slug": "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code"
  },
  {
    "title": "The Three-Qubit Phase-Flip Code",
    "description": "Deriving Z=HXH to turn the bit-flip code into a phase-flip code by pure conjugation: same circuit, same syndrome table, a Hadamard sandwich on every step, verified to correct a Z error on any of the three qubits exactly.",
    "course": "error-correction-and-fault-tolerance",
    "module": "the-three-qubit-phase-flip-code",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code"
    ],
    "objectives": [
      "Derive Z=HXH and use it to explain why conjugating the bit-flip code by H produces a phase-flip code",
      "Construct the phase-flip code's encoding and correction circuit from the bit-flip code plus Hadamards",
      "Verify the phase-flip code corrects a Z error on any of the three qubits exactly"
    ],
    "slug": "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-phase-flip-code"
  },
  {
    "title": "Why Quantum Errors Are Different",
    "description": "Three obstacles classical error correction never faces: no-cloning rules out simple redundancy, a continuum of possible errors replaces two discrete ones, and measurement destroys the very superposition being protected, each derived from principles proven in earlier courses.",
    "course": "error-correction-and-fault-tolerance",
    "module": "why-quantum-errors-are-different",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope"
    ],
    "objectives": [
      "Explain why the no-cloning theorem rules out the classical repetition-code strategy directly",
      "Explain why a qubit's error space is continuous, not just {no error, bit flip}",
      "Explain why syndrome measurement must extract error information without measuring the encoded data"
    ],
    "slug": "quantum-computing/error-correction-and-fault-tolerance/why-quantum-errors-are-different"
  },
  {
    "title": "Capstone: Comparing Quantum Advantage",
    "description": "Deutsch-Jozsa's exponential separation and Grover's quadratic one, side by side: what each algorithm proves, what has to be true for it to matter, and why 'quantum computers are exponentially faster' is not a fair summary of either.",
    "course": "quantum-algorithms-i",
    "module": "capstone-comparing-quantum-advantage",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification"
    ],
    "objectives": [
      "State the query complexity of Deutsch-Jozsa and Grover's algorithm precisely, classical vs. quantum",
      "Explain why Deutsch-Jozsa's exponential separation depends entirely on its promise",
      "Explain why Grover's quadratic speedup is provably optimal, not merely the best known"
    ],
    "slug": "quantum-computing/quantum-algorithms-i/capstone-comparing-quantum-advantage"
  },
  {
    "title": "Grover's Algorithm: Amplitude Amplification",
    "description": "Each Grover iteration is a rotation by a fixed angle in a 2D subspace, derived exactly, giving the closed-form success probability sin²((2k+1)θ) and the O(√N) optimal iteration count, both checked against the engine's exact numbers.",
    "course": "quantum-algorithms-i",
    "module": "grovers-algorithm-amplitude-amplification",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion"
    ],
    "objectives": [
      "Derive that a Grover iteration is a rotation by angle 2θ in the 2D span of marked/unmarked superpositions",
      "Derive the exact closed-form success probability sin²((2k+1)θ) after k iterations",
      "Derive the O(√N) optimal iteration count from that closed form"
    ],
    "slug": "quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification"
  },
  {
    "title": "Grover's Algorithm: Oracle and Diffusion",
    "description": "The two building blocks of unstructured search: a phase-marking oracle, and a diffusion operator derived algebraically as H^⊗n(2|0⟩⟨0|−I)H^⊗n, including a real sign bug this exact derivation caught during engine development.",
    "course": "quantum-algorithms-i",
    "module": "grovers-algorithm-oracle-and-diffusion",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/quantum-phase-estimation"
    ],
    "objectives": [
      "State Grover's problem (unstructured search) and why no classical algorithm beats O(N) queries",
      "Derive the diffusion operator 2|s⟩⟨s|−I as H^⊗n(2|0⟩⟨0|−I)H^⊗n",
      "Explain why a sign error in the reflection step is invisible to a success-probability-only test"
    ],
    "slug": "quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion"
  },
  {
    "title": "Phase Kickback",
    "description": "Deriving, algebraically, why preparing the oracle's output qubit in |−⟩ turns f(x)'s value into a phase on the input register instead of a separate qubit's value, the one trick Deutsch-Jozsa and Grover's algorithm both build on.",
    "course": "quantum-algorithms-i",
    "module": "phase-kickback",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/quantum-parallelism-and-the-oracle-model"
    ],
    "objectives": [
      "Derive U_f|x⟩|−⟩=(−1)^f(x)|x⟩|−⟩ directly from the oracle's defining relation",
      "Explain why the ancilla qubit's own state is left unchanged by this process",
      "Connect the bit-oracle and phase-oracle engine primitives via this identity, not just by definition"
    ],
    "slug": "quantum-computing/quantum-algorithms-i/phase-kickback"
  },
  {
    "title": "Quantum Parallelism and the Oracle Model",
    "description": "Applying a Hadamard to every qubit puts every possible input into superposition at once, and why that alone doesn't let you read out a function's values on all of them, which is the problem the rest of this course solves.",
    "course": "quantum-algorithms-i",
    "module": "quantum-parallelism-and-the-oracle-model",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/capstone-analyzing-quantum-correlations"
    ],
    "objectives": [
      "Derive the result of applying a Hadamard to every qubit of the all-zeros state: the uniform superposition over all n-bit strings",
      "State the reversible oracle model, where a query maps input x and output register y to x and y XOR f(x), and explain why it's required",
      "Explain precisely why superposition alone doesn't let you extract all of f's values from one query"
    ],
    "slug": "quantum-computing/quantum-algorithms-i/quantum-parallelism-and-the-oracle-model"
  },
  {
    "title": "Quantum Phase Estimation",
    "description": "Reading a unitary's eigenphase directly out of a qubit register, derived by showing the pre-measurement state is exactly QFT|phase·N⟩, so the inverse QFT recovers the phase exactly, then verified on a phase gate with a known eigenphase.",
    "course": "quantum-algorithms-i",
    "module": "quantum-phase-estimation",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform"
    ],
    "objectives": [
      "Derive the phase estimation circuit's pre-measurement state as exactly QFT|phase·N⟩",
      "Explain why phase estimation is restricted, on this platform, to single-qubit unitaries with a known eigenstate",
      "Compute a phase estimation result by hand for an exactly-representable phase and check it against the engine"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/mathematical-foundations/unitary-operators",
        "note": "This lesson's entire target quantity, the phase θ in a unitary's eigenvalue e^(iθ), exists only because that lesson proves a unitary operator's eigenvalues always have modulus 1, i.e. are pure phases."
      }
    ],
    "slug": "quantum-computing/quantum-algorithms-i/quantum-phase-estimation"
  },
  {
    "title": "Simon's Algorithm",
    "description": "A 2-to-1 oracle hiding an XOR mask s, attacked with the same H-oracle-H structure as Deutsch-Jozsa and finished off by linear algebra over F₂: an unconditional exponential separation from randomized classical query complexity, and the direct ancestor of Shor's period-finding.",
    "course": "quantum-algorithms-i",
    "module": "simons-algorithm",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm"
    ],
    "objectives": [
      "State Simon's promise problem: a genuinely 2-to-1 oracle f(x)=f(x⊕s) hiding a nonzero string s",
      "Derive why every measurement of the input register lands on a z orthogonal to s (z·s≡0 mod 2), never on a random string",
      "Explain how n−1 independent measured z's let you solve for s via linear algebra over F₂, and how this generalizes to Shor's period-finding"
    ],
    "slug": "quantum-computing/quantum-algorithms-i/simons-algorithm"
  },
  {
    "title": "The Deutsch-Jozsa Algorithm",
    "description": "One oracle query settles constant-vs-balanced with certainty, derived by tracking the amplitude on |0...0⟩ through two Hadamard layers and a phase-kickback oracle, then checked against the actual engine for a balanced and a constant function.",
    "course": "quantum-algorithms-i",
    "module": "the-deutsch-jozsa-algorithm",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/phase-kickback"
    ],
    "objectives": [
      "State the Deutsch-Jozsa promise problem and the classical query lower bound it beats",
      "Derive the |0...0⟩-amplitude formula (1/N)Σₓ(−1)^f(x) after the full circuit",
      "Prove this amplitude is exactly ±1 for constant f and exactly 0 for balanced f"
    ],
    "slug": "quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm"
  },
  {
    "title": "The Quantum Fourier Transform",
    "description": "The discrete Fourier transform acting directly on amplitudes, defined, checked to reduce to H for a single qubit, built as a circuit from Hadamards and controlled-phase rotations, and cross-checked against the closed-form DFT formula for every basis state up to 4 qubits.",
    "course": "quantum-algorithms-i",
    "module": "the-quantum-fourier-transform",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm"
    ],
    "objectives": [
      "State the QFT's defining formula and verify it reduces to H for a single qubit",
      "Describe the standard QFT circuit (Hadamards, controlled-phase rotations, a final swap) and why each piece is there",
      "Compute the QFT of a small basis state by hand and cross-check it against the engine"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/wave-mechanics/momentum-space-and-the-fourier-transform",
        "note": "The continuous ancestor of this exact idea: a unitary Fourier-transform basis change from position amplitudes to momentum amplitudes, here discretized onto qubits."
      }
    ],
    "slug": "quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform"
  },
  {
    "title": "Capstone: Hybrid Algorithms, NISQ, and Honest Scope",
    "description": "Shor's algorithm and the VQE/QAOA family side by side: circuit depth, error tolerance, and hardware requirements, plus an explicit accounting of exactly which pieces of each algorithm this course built, simulated directly, or left as a documented, honest gap.",
    "course": "quantum-algorithms-ii",
    "module": "capstone-hybrid-algorithms-nisq-and-honest-scope",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/qaoa-a-worked-max-cut-example"
    ],
    "objectives": [
      "Contrast Shor's algorithm's circuit-depth and error-tolerance requirements with VQE/QAOA's",
      "Define the NISQ era precisely and explain why it favors hybrid algorithms",
      "Give a complete, honest accounting of this course's toy-vs-real-scale gaps"
    ],
    "slug": "quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope"
  },
  {
    "title": "QAOA: A Worked Max-Cut Example",
    "description": "p=1 QAOA run on a triangle graph and a single edge, both reaching within a fraction of a percent of the true brute-force optimum, good parameters found by grid search, then checked against the exact maximum.",
    "course": "quantum-algorithms-ii",
    "module": "qaoa-a-worked-max-cut-example",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/qaoa-and-combinatorial-optimization"
    ],
    "objectives": [
      "Run p=1 QAOA on two small graphs and compare the result to the brute-force optimum",
      "Explain why a grid search over (γ,β) was used to find good parameters, rather than a closed form",
      "Identify what changes for a graph large enough that brute force is no longer practical"
    ],
    "slug": "quantum-computing/quantum-algorithms-ii/qaoa-a-worked-max-cut-example"
  },
  {
    "title": "QAOA and Combinatorial Optimization",
    "description": "Max-Cut as a diagonal cost Hamiltonian, the alternating cost/mixer circuit, and why the resulting expectation value is exactly the expected number of cut edges, derived and checked exactly on the uniform superposition, where the answer is knowable in advance.",
    "course": "quantum-algorithms-ii",
    "module": "qaoa-and-combinatorial-optimization",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/vqe-a-worked-toy-example"
    ],
    "objectives": [
      "Formulate Max-Cut as a cost Hamiltonian C=Σ(1-Z_iZ_j)/2 over graph edges",
      "Derive the cost unitary's action as a pure phase e^(-iγ × cut count) on each basis state",
      "Explain the mixer's role and verify the uniform superposition gives exactly half of every edge cut in expectation"
    ],
    "slug": "quantum-computing/quantum-algorithms-ii/qaoa-and-combinatorial-optimization"
  },
  {
    "title": "Shor's Algorithm: Factoring via Period Finding",
    "description": "The classical number-theory reduction at the heart of Shor's algorithm: turning 'factor N' into 'find the order of a mod N', derived from a single algebraic identity, before any quantum circuit enters the picture.",
    "course": "quantum-algorithms-ii",
    "module": "shors-algorithm-factoring-via-period-finding",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/capstone-comparing-quantum-advantage"
    ],
    "objectives": [
      "State the order-finding problem and Shor's classical reduction from factoring to it",
      "Derive why a^(r/2) mod N, when r is even and not −1, yields nontrivial factors of N",
      "Identify which part of the algorithm is classical and which needs a quantum speedup"
    ],
    "slug": "quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding"
  },
  {
    "title": "The Quantum Period-Finding Circuit",
    "description": "Building (1/√2^t)Σₓ|x⟩|aˣ mod N⟩ and applying the QFT to the x register: the exact interference step that turns modular exponentiation's hidden period into a directly measurable pattern, honestly scoped around the one piece of circuitry this platform doesn't build.",
    "course": "quantum-algorithms-ii",
    "module": "the-quantum-period-finding-circuit",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding"
    ],
    "objectives": [
      "Describe the period-finding state (1/√2^t)Σₓ|x⟩|aˣ mod N⟩ and why applying the QFT to the x register reveals r",
      "Explain precisely which piece of the circuit this platform builds directly rather than gate-by-gate, and why",
      "Predict where the QFT's output amplitude peaks, in terms of 2^t and r"
    ],
    "slug": "quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit"
  },
  {
    "title": "The Variational Principle and Ansatz Circuits",
    "description": "Every state's energy expectation value sits above the true ground energy, a short, complete proof that motivates a different kind of quantum algorithm: search over circuit parameters with a classical optimizer, rather than a fixed sequence of gates.",
    "course": "quantum-algorithms-ii",
    "module": "the-variational-principle-and-ansatz-circuits",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/worked-example-factoring-15"
    ],
    "objectives": [
      "Prove the variational principle: ⟨ψ|H|ψ⟩ ≥ E₀ for any normalized |ψ⟩, given an H with a discrete spectrum bounded below",
      "Define an ansatz circuit and explain what 'expressive enough' means precisely",
      "Contrast the hybrid quantum-classical algorithm structure with Shor's fixed-circuit structure"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/approximation-methods/the-variational-method",
        "note": "The same variational theorem, proved the same way, minimized over a continuous trial wavefunction's width instead of a circuit's parameters."
      }
    ],
    "slug": "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits"
  },
  {
    "title": "VQE: A Worked Toy Example",
    "description": "Running the hybrid optimization loop end to end on H=0.6Z+0.8X, watching the cost function descend toward the true ground energy, and confirming convergence to 6 decimal places against the exact eigenvalue.",
    "course": "quantum-algorithms-ii",
    "module": "vqe-a-worked-toy-example",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits"
    ],
    "objectives": [
      "Run VQE on a specific Hamiltonian and interpret the resulting optimization history",
      "Compute a Hamiltonian's exact ground energy in closed form and compare it to VQE's result",
      "Explain what the pattern-search optimizer's shrinking step size represents physically"
    ],
    "slug": "quantum-computing/quantum-algorithms-ii/vqe-a-worked-toy-example"
  },
  {
    "title": "Worked Example: Factoring 15",
    "description": "Every piece from the last two lessons run end to end on N=15: the quantum period-finding circuit's exact output, a peak read off and checked against the classical order, then the gcd step that finishes the factorization, with an honest account of what did and didn't need a quantum computer.",
    "course": "quantum-algorithms-ii",
    "module": "worked-example-factoring-15",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit"
    ],
    "objectives": [
      "Run the complete factor-15 pipeline: quantum period-finding output, period recovery, classical gcd",
      "Identify exactly which step used quantum interference and which steps were classical arithmetic",
      "Explain why this toy example does not demonstrate a real cryptographic-scale quantum advantage"
    ],
    "slug": "quantum-computing/quantum-algorithms-ii/worked-example-factoring-15"
  },
  {
    "title": "BB84: Quantum Key Distribution",
    "description": "How Alice and Bob build a shared secret key by encoding bits in randomly-chosen conjugate bases, and why an eavesdropper intercepting the qubits necessarily introduces a detectable error rate.",
    "course": "quantum-gates-and-circuits",
    "module": "bb84-quantum-key-distribution",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 40,
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem"
    ],
    "objectives": [
      "Derive why matching-basis measurement recovers Alice's bit with certainty and mismatched-basis measurement gives a random result",
      "Explain how the sifting step (comparing bases, not bits) produces a shared secret key without revealing it",
      "Compute the detectable error rate an intercept-resend eavesdropper introduces on the sifted key"
    ],
    "related": [
      {
        "slug": "quantum-hardware/physical-qubit-platforms/photonic-qubits",
        "note": "Real BB84 systems send this protocol's Z/X-basis qubits as a single photon's polarization. What this lesson calls 'apply H, then measure' is, in that hardware, a waveplate and a polarizing beamsplitter."
      }
    ],
    "slug": "quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution"
  },
  {
    "title": "Bell States and Entanglement",
    "description": "Deriving (|00⟩ + |11⟩)/√2 from H and CNOT, proving it can't be a product state, and finding the measurement that separates it from ordinary classical correlation.",
    "course": "quantum-gates-and-circuits",
    "module": "bell-states-and-entanglement",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/controlled-gates-and-cnot"
    ],
    "objectives": [
      "Derive the Bell state (|00⟩+|11⟩)/√2 from H then CNOT applied to |00⟩",
      "Prove this state cannot be written as any single-qubit product state",
      "Explain, with a calculation, how far a two-basis check gets toward ruling out classical shared randomness, and where Bell's theorem has to take over"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/angular-momentum-and-spin/addition-of-angular-momentum",
        "note": "That lesson proves the Bell state |Ψ⁻⟩ is not merely analogous to but identical to the total-spin-zero singlet of two combined spin-1/2 particles, verified as the same J²=0 eigenstate."
      }
    ],
    "slug": "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement"
  },
  {
    "title": "Building Quantum Circuits",
    "description": "The capstone for this course: composing every tool so far into a real 3-qubit entangled circuit, built and analyzed from scratch.",
    "course": "quantum-gates-and-circuits",
    "module": "building-quantum-circuits",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits",
      "quantum-computing/qubits-and-quantum-states/building-qubit-circuits"
    ],
    "objectives": [
      "Design a circuit that prepares a specified 3-qubit entangled state",
      "Verify a multi-qubit circuit identity by tracking a state through it step by step",
      "Predict multi-qubit measurement statistics for a circuit you designed yourself"
    ],
    "slug": "quantum-computing/quantum-gates-and-circuits/building-quantum-circuits"
  },
  {
    "title": "Controlled Gates and CNOT",
    "description": "The general controlled-U operation, worked out in full for CNOT: matrix, truth table, and why SWAP is three CNOTs.",
    "course": "quantum-gates-and-circuits",
    "module": "controlled-gates-and-cnot",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/quantum-circuit-notation"
    ],
    "objectives": [
      "Derive the CNOT matrix from the general controlled-U construction",
      "Predict CNOT's action on any computational basis state",
      "Explain why SWAP decomposes into three CNOTs"
    ],
    "slug": "quantum-computing/quantum-gates-and-circuits/controlled-gates-and-cnot"
  },
  {
    "title": "Interference in Quantum Circuits",
    "description": "Extending single-qubit interference to multiple qubits: what a single phase gate, sandwiched between two layers of Hadamards, does to a uniform four-way superposition, worked end to end on the engine.",
    "course": "quantum-gates-and-circuits",
    "module": "interference-in-quantum-circuits",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/quantum-teleportation"
    ],
    "objectives": [
      "Explain how a multi-qubit circuit can concentrate amplitude onto a single outcome using only interference",
      "Distinguish interference that requires entanglement from interference that doesn't",
      "State the general principle behind why quantum algorithms use interference"
    ],
    "slug": "quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits"
  },
  {
    "title": "Multi-Qubit Measurement",
    "description": "Measuring one qubit of an entangled pair while leaving the others alone: the exact mechanism behind Bell-state correlation.",
    "course": "quantum-gates-and-circuits",
    "module": "multi-qubit-measurement",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement"
    ],
    "objectives": [
      "State the projective measurement rule for one qubit within a multi-qubit state",
      "Compute the exact post-measurement state after measuring part of an entangled system",
      "Contrast measuring an entangled qubit with measuring an unentangled one"
    ],
    "slug": "quantum-computing/quantum-gates-and-circuits/multi-qubit-measurement"
  },
  {
    "title": "Multi-Qubit State Vectors",
    "description": "Why some multi-qubit states can't be built from a tensor product at all, a dimension-counting argument for entanglement.",
    "course": "quantum-gates-and-circuits",
    "module": "multi-qubit-state-vectors",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/tensor-products"
    ],
    "objectives": [
      "Write the general normalized state of an n-qubit system",
      "Count the real parameters of a general 2-qubit state vs. a product state",
      "Define what it means for a state to be entangled"
    ],
    "related": [
      {
        "slug": "quantum-software/simulating-quantum-systems/state-vector-simulation",
        "note": "This lesson's 2^n-amplitude state vector, examined explicitly as the exact technique every simulation you've run on the site has used since day one."
      }
    ],
    "slug": "quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors"
  },
  {
    "title": "Quantum Circuit Notation",
    "description": "How to read and write multi-qubit circuit diagrams, and how they correspond to the operator products from the last course.",
    "course": "quantum-gates-and-circuits",
    "module": "quantum-circuit-notation",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors"
    ],
    "objectives": [
      "Read a multi-qubit circuit diagram: wires, gate boxes, controls, and meters",
      "Translate a circuit diagram into the corresponding operator expression",
      "Explain the relationship between a circuit's left-to-right layout and its right-to-left operator product"
    ],
    "slug": "quantum-computing/quantum-gates-and-circuits/quantum-circuit-notation"
  },
  {
    "title": "Quantum Teleportation",
    "description": "The full 3-qubit protocol, derived term by term: how an unknown qubit state moves from Alice to Bob without ever being measured directly.",
    "course": "quantum-gates-and-circuits",
    "module": "quantum-teleportation",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 35,
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem",
      "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement"
    ],
    "objectives": [
      "Derive the full teleportation protocol's state evolution term by term",
      "Explain why Bob's correction depends on Alice's two classical measurement outcomes",
      "Explain why teleportation does not violate the no-cloning theorem or allow faster-than-light signaling"
    ],
    "slug": "quantum-computing/quantum-gates-and-circuits/quantum-teleportation"
  },
  {
    "title": "Superdense Coding",
    "description": "How a pre-shared Bell pair lets Alice send Bob two classical bits by sending only one qubit: the teleportation circuit, encoded forward and decoded in reverse.",
    "course": "quantum-gates-and-circuits",
    "module": "superdense-coding",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 40,
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/quantum-teleportation"
    ],
    "objectives": [
      "Derive the four Bell states Alice's four possible gates produce from a shared pair",
      "Explain why Bob's CNOT-then-H decode circuit is the inverse of the Bell-pair preparation circuit",
      "Explain why sending one qubit can carry two classical bits without violating any communication bound, since a second qubit was already spent distributing the pair"
    ],
    "slug": "quantum-computing/quantum-gates-and-circuits/superdense-coding"
  },
  {
    "title": "Tensor Products: Combining Qubits",
    "description": "How two qubits become a single four-amplitude system, the tensor product, derived rather than just defined.",
    "course": "quantum-gates-and-circuits",
    "module": "tensor-products",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/building-qubit-circuits"
    ],
    "objectives": [
      "Compute the tensor product of two qubit states from their amplitudes",
      "Explain why an n-qubit system needs 2^n amplitudes, not 2n",
      "State and use the qubit-ordering convention this platform follows"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/mathematical-foundations/tensor-products-and-composite-systems",
        "note": "The same tensor-product construction generalized to vector spaces of any dimension, with a dimension-counting argument for why entanglement is generic."
      }
    ],
    "slug": "quantum-computing/quantum-gates-and-circuits/tensor-products"
  },
  {
    "title": "The No-Cloning Theorem",
    "description": "A complete proof by contradiction: no unitary can copy an arbitrary, unknown qubit state, derived, not asserted.",
    "course": "quantum-gates-and-circuits",
    "module": "the-no-cloning-theorem",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/multi-qubit-measurement"
    ],
    "objectives": [
      "State the no-cloning theorem precisely",
      "Reproduce the proof by contradiction using linearity",
      "Explain why copying a known basis state is not a counterexample"
    ],
    "slug": "quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem"
  },
  {
    "title": "Universal Quantum Computation",
    "description": "Why single-qubit gates alone can't reach every circuit, why adding CNOT is enough in principle, why real hardware wants a fixed discrete set instead, and why that set needs one non-Clifford gate; with T checked against the Clifford property and a Toffoli built from Clifford+T alone.",
    "course": "quantum-gates-and-circuits",
    "module": "universal-quantum-computation",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 55,
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/building-quantum-circuits",
      "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement"
    ],
    "objectives": [
      "Prove that single-qubit gates alone can never map a product state to an entangled one, and conclude that single-qubit gates alone can't reach every multi-qubit unitary",
      "State the universality theorem for arbitrary single-qubit gates plus CNOT, and explain in what sense a finite gate set can reach every unitary at all",
      "Explain why real (especially fault-tolerant) hardware wants a small, fixed, discrete gate set instead of arbitrary continuous rotations",
      "Define the Clifford group, state the Gottesman-Knill theorem, and explain why Clifford alone can't be a universal set",
      "Verify directly that T is not a Clifford gate by conjugating X with it and getting a non-Pauli result",
      "Build the standard Toffoli-from-Clifford+T circuit and verify it reproduces the Toffoli truth table exactly"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/mathematical-foundations/unitary-operators",
        "note": "Every gate in this lesson is a unitary operator in the sense that lesson built; 'generates a dense subgroup of SU(2)' is the same rotation-group language, just asking whether two fixed rotations can reach every other one."
      },
      {
        "slug": "quantum-computing/error-correction-and-fault-tolerance/stabilizer-formalism-basics",
        "note": "The Clifford group used here to state Gottesman-Knill is exactly the set of operations whose action on Pauli stabilizers that lesson tracks; H and CNOT are Clifford precisely because they map Paulis to Paulis, the same computation this lesson runs on T to show it fails."
      },
      {
        "slug": "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition",
        "note": "That lesson decomposes H, X, Z, S, T into a continuous native set (Rz, Ry) and explicitly declines to derive the general Euler decomposition. This lesson is the discrete counterpart: a FIXED, finite gate set, and the harder question of whether it can reach everything at all."
      }
    ],
    "slug": "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation"
  },
  {
    "title": "Putting It Together: Building and Analyzing Qubit Circuits",
    "description": "Composing gates into sequences, and the capstone identity HZH = X, derived on paper and verified in the simulator.",
    "course": "qubits-and-quantum-states",
    "module": "building-qubit-circuits",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/global-and-relative-phase",
      "quantum-computing/qubits-and-quantum-states/quantum-gates"
    ],
    "objectives": [
      "Compute the net effect of a sequence of single-qubit gates",
      "Prove the identity HZH = X and explain what it means geometrically",
      "Predict measurement statistics after a multi-gate sequence"
    ],
    "slug": "quantum-computing/qubits-and-quantum-states/building-qubit-circuits"
  },
  {
    "title": "Complex Numbers for Quantum Mechanics",
    "description": "The arithmetic and geometry of complex numbers, the language every quantum amplitude is written in.",
    "course": "qubits-and-quantum-states",
    "module": "complex-numbers-for-quantum-mechanics",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/what-is-a-qubit"
    ],
    "objectives": [
      "Add, multiply, and conjugate complex numbers confidently",
      "Convert between rectangular and polar form using Euler's formula",
      "Explain why multiplying complex numbers adds their phases"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/mathematical-foundations/complex-numbers-for-physics",
        "note": "The general-purpose version of this same toolkit, including a further derivation (De Moivre, roots of unity) this lesson doesn't need yet."
      }
    ],
    "slug": "quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics"
  },
  {
    "title": "Dirac Notation",
    "description": "Kets, bras, and the inner product, the compact algebra behind every quantum expression you'll write.",
    "course": "qubits-and-quantum-states",
    "module": "dirac-notation",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 26,
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics"
    ],
    "objectives": [
      "Explain what a bra is and how it relates to a ket",
      "Compute inner products between qubit states",
      "Use orthonormality to simplify bra-ket expressions",
      "Apply a 2x2 matrix to a ket, read the Pauli matrices X, Y and Z off their columns, and multiply two 2x2 matrices in the right order"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/mathematical-foundations/bra-ket-formalism",
        "note": "The same ket/bra/inner-product notation developed for a general vector space, plus outer products and the completeness relation this lesson doesn't cover."
      }
    ],
    "slug": "quantum-computing/qubits-and-quantum-states/dirac-notation"
  },
  {
    "title": "Global Phase vs. Relative Phase",
    "description": "A proof of which phases are physically real and which aren't, and how to tell them apart by calculation rather than by feel.",
    "course": "qubits-and-quantum-states",
    "module": "global-and-relative-phase",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/single-qubit-rotations"
    ],
    "objectives": [
      "Prove that a global phase changes no measurement probability in any basis",
      "Prove that a relative phase does change some measurement probabilities",
      "Identify whether two given states differ by global phase, relative phase, or neither"
    ],
    "slug": "quantum-computing/qubits-and-quantum-states/global-and-relative-phase"
  },
  {
    "title": "Measurement and Probability",
    "description": "The measurement postulate stated precisely, and what it means to measure a qubit in a basis other than {|0⟩, |1⟩}.",
    "course": "qubits-and-quantum-states",
    "module": "measurement-and-probability",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/the-bloch-sphere"
    ],
    "objectives": [
      "State the projective measurement postulate using inner products",
      "Compute measurement probabilities in bases other than the computational basis",
      "Explain why a single measurement can't reveal a state's amplitudes"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality",
        "note": "The general inner-product and orthogonality machinery this lesson's Born rule P(e_i) = |⟨e_i|ψ⟩|² is a direct, qubit-specific instance of."
      },
      {
        "slug": "quantum-hardware/control-and-readout/qubit-readout-techniques",
        "note": "This lesson's idealized, instantaneous projective measurement, contrasted there against how a real device reads out a qubit: indirectly, and imperfectly."
      }
    ],
    "slug": "quantum-computing/qubits-and-quantum-states/measurement-and-probability"
  },
  {
    "title": "Quantum Gates",
    "description": "The X, Y, Z, H, S, and T gates: what they do to a qubit, why they must be unitary, and how each one moves the Bloch vector.",
    "course": "qubits-and-quantum-states",
    "module": "quantum-gates",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/measurement-and-probability"
    ],
    "objectives": [
      "Explain why quantum gates must be unitary",
      "Apply X, Y, Z, H, S, and T to a given state by matrix multiplication",
      "Describe each gate as a specific rotation of the Bloch vector"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/mathematical-foundations/linear-operators",
        "note": "The general theory of linear operators and matrix representation, which every gate here is a specific (unitary) example of."
      }
    ],
    "slug": "quantum-computing/qubits-and-quantum-states/quantum-gates"
  },
  {
    "title": "Quantum States and State Vectors",
    "description": "The vector-space postulates that make superposition possible, and why a qubit's state has exactly two real degrees of freedom.",
    "course": "qubits-and-quantum-states",
    "module": "quantum-states-and-state-vectors",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/dirac-notation"
    ],
    "objectives": [
      "State the vector-space postulate that permits superposition",
      "Explain why quantum interference has no classical-probability analogue",
      "Derive that a normalized qubit state (up to global phase) has 2 real parameters"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics",
        "note": "The general state-space postulate (Postulate 1) this lesson specializes to a qubit's 2-dimensional Hilbert space; the same interference argument in its fully general form."
      }
    ],
    "slug": "quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors"
  },
  {
    "title": "Single-Qubit Rotations",
    "description": "The general rotation formula that every single-qubit gate is an instance of, and what Rx, Ry, Rz compute.",
    "course": "qubits-and-quantum-states",
    "module": "single-qubit-rotations",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/quantum-gates"
    ],
    "objectives": [
      "State the general axis-angle rotation formula for a single qubit",
      "Compute Rx, Ry, Rz as special cases and connect them to X, Y, Z, H, S, T",
      "Predict how Rz(θ) affects θ and φ separately"
    ],
    "related": [
      {
        "slug": "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition",
        "note": "The exact Rz/Ry rotation family this lesson derives is what every gate decomposition (H, X, S, T, ...) is compiled into before running on real hardware."
      }
    ],
    "slug": "quantum-computing/qubits-and-quantum-states/single-qubit-rotations"
  },
  {
    "title": "The Bloch Sphere",
    "description": "Deriving the geometric picture of a qubit: where θ and φ come from, and what the sphere's surface represents.",
    "course": "qubits-and-quantum-states",
    "module": "the-bloch-sphere",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors"
    ],
    "objectives": [
      "Derive the canonical form |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩",
      "Convert between amplitudes (α, β) and Bloch coordinates (θ, φ) and (x, y, z)",
      "Read the geometric meaning of a state directly off its position on the sphere"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/angular-momentum-and-spin/spin-one-half-systems",
        "note": "The physics origin of this two-level system, worked out from angular momentum first."
      }
    ],
    "slug": "quantum-computing/qubits-and-quantum-states/the-bloch-sphere"
  },
  {
    "title": "What Is a Qubit?",
    "description": "Why quantum computers need a new unit of information, and what a qubit is mathematically.",
    "course": "qubits-and-quantum-states",
    "module": "what-is-a-qubit",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 30,
    "prerequisites": [],
    "objectives": [
      "Explain why a classical bit can't describe a quantum system",
      "Write a qubit state in Dirac notation and check it's normalized",
      "Compute measurement probabilities from a qubit's amplitudes"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment",
        "note": "The experiment this lesson leans on for motivation, done properly: where the two discrete outcomes come from, and why measuring spin along a second axis erases the first answer."
      }
    ],
    "slug": "quantum-computing/qubits-and-quantum-states/what-is-a-qubit"
  },
  {
    "title": "Calibration",
    "description": "The θ=2Ωt formula is useless without knowing the qubit's actual Rabi frequency Ω. A Rabi calibration experiment finds it by scanning pulse duration and locating the first population-transfer peak, demonstrated here by recovering a hidden Ω to within 0.1% purely from scanned data.",
    "course": "control-and-readout",
    "module": "calibration",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-hardware/control-and-readout/qubit-readout-techniques"
    ],
    "objectives": [
      "Explain why every control parameter (Rabi frequency, resonance frequency) must be measured, not assumed",
      "Describe the Rabi calibration procedure: scan pulse duration, locate the first population peak",
      "Recover an unknown Rabi frequency numerically from scanned population-transfer data"
    ],
    "slug": "quantum-hardware/control-and-readout/calibration"
  },
  {
    "title": "Control Electronics",
    "description": "Turning an abstract gate like X or Rz(θ) into an actual microwave pulse, reusing the exact resonant two-level Rabi model already verified in Approximation Methods, now applied as a real control-engineering calculation: pulse duration and amplitude from a target rotation angle.",
    "course": "control-and-readout",
    "module": "control-electronics",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-hardware/control-and-readout/cryogenic-systems"
    ],
    "objectives": [
      "Explain how a classical microwave pulse implements a single-qubit rotation via resonant driving",
      "Compute pulse duration for an arbitrary target rotation angle, not just a full π-pulse",
      "Distinguish pulse duration control from pulse amplitude control as two equivalent ways to reach the same rotation"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/approximation-methods/time-dependent-perturbation-theory",
        "note": "The exact two-level Rabi model this lesson drives a real qubit with is the same RK4-verified 'exact' solution that lesson checks first-order perturbation theory against."
      }
    ],
    "slug": "quantum-hardware/control-and-readout/control-electronics"
  },
  {
    "title": "Cryogenic Systems",
    "description": "Why superconducting and spin qubits need millikelvin cooling, made precise: the Bose-Einstein occupation n̄=1/(exp(ħω/k_BT)-1) for a 5 GHz qubit is ~10⁻⁷ at 15 mK and exceeds 1000 at room temperature, fixing exactly where a qubit stops having a reliable ground state. The computed reason dilution refrigerators exist.",
    "course": "control-and-readout",
    "module": "cryogenic-systems",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms"
    ],
    "objectives": [
      "State the thermal photon occupation formula and explain what a large vs. small n̄ means physically for a qubit",
      "Compute n̄ for a realistic qubit frequency at several temperatures and identify why 4K alone is insufficient",
      "Describe a dilution refrigerator's staged cooling at a conceptual level"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator",
        "note": "The Bose-Einstein occupation formula this lesson computes describes the thermal population of that lesson's equally-spaced ħω energy ladder, the reason a qubit needs millikelvin cooling to sit reliably in its ground state."
      }
    ],
    "slug": "quantum-hardware/control-and-readout/cryogenic-systems"
  },
  {
    "title": "Qubit Readout Techniques",
    "description": "Measuring a qubit's state without destroying the information first: dispersive readout couples the qubit to a resonator whose frequency shifts depending on the qubit's state, an indirect measurement scheme, and readout fidelity is a probabilistic classification problem, not a perfect binary readout.",
    "course": "control-and-readout",
    "module": "qubit-readout-techniques",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-hardware/control-and-readout/control-electronics"
    ],
    "objectives": [
      "Explain the dispersive readout scheme at a conceptual level: measuring a resonator, not the qubit directly",
      "State why readout fidelity is an imperfect probabilistic quantity, distinct from ideal projective measurement",
      "Connect readout error to the broader error budget alongside gate errors and decoherence"
    ],
    "related": [
      {
        "slug": "quantum-computing/qubits-and-quantum-states/measurement-and-probability",
        "note": "The idealized, instantaneous projective measurement postulate this lesson contrasts against real, imperfect, indirect hardware readout."
      }
    ],
    "slug": "quantum-hardware/control-and-readout/qubit-readout-techniques"
  },
  {
    "title": "Crosstalk",
    "description": "T1/T2 are single-qubit noise; crosstalk is a multi-qubit problem: driving one qubit's gate unintentionally rotates a neighbor too. Built from this platform's gate engine: an intended X on qubit 0 with an ε-strength leak onto qubit 1 gives fidelity cos²(ε/2) exactly, verified to 1e-15.",
    "course": "noise-decoherence-and-scaling",
    "module": "crosstalk",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence"
    ],
    "objectives": [
      "Explain crosstalk as an unwanted multi-qubit effect, distinct from T1/T2's single-qubit picture",
      "Compute the fidelity loss from a small unwanted rotation leaking onto a spectator qubit",
      "Trace why crosstalk gets structurally worse as qubit count and density increase"
    ],
    "slug": "quantum-hardware/noise-decoherence-and-scaling/crosstalk"
  },
  {
    "title": "Roadmaps to Fault Tolerance",
    "description": "Closes the course by connecting every noise source covered, T1/T2, crosstalk, compounding gate error, to the physical-to-logical qubit overhead, often in the hundreds to low thousands of physical qubits per logical qubit, that real hardware roadmaps target, and how far current devices are from that goal.",
    "course": "noise-decoherence-and-scaling",
    "module": "roadmaps-to-fault-tolerance",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/scaling-challenges"
    ],
    "objectives": [
      "Summarize how this course's noise sources feed into the physical-to-logical qubit overhead question",
      "Explain the NISQ (noisy intermediate-scale quantum) era's defining characteristic, honestly",
      "State what 'fault tolerant' means as a target, distinguishing it from 'more qubits'"
    ],
    "slug": "quantum-hardware/noise-decoherence-and-scaling/roadmaps-to-fault-tolerance"
  },
  {
    "title": "Scaling Challenges",
    "description": "Compounding per-gate error rates across a deep circuit, computed directly: even a 99.9% per-gate fidelity drops below 37% success probability by 1000 sequential gates. The concrete numerical reason 'just add more qubits' badly understates what scaling a useful quantum computer requires.",
    "course": "noise-decoherence-and-scaling",
    "module": "scaling-challenges",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/crosstalk"
    ],
    "objectives": [
      "Compute how per-gate error compounds multiplicatively across a circuit of many sequential gates",
      "Explain why qubit COUNT alone is an incomplete measure of a device's usefulness",
      "Connect compounding error directly to Error Correction & Fault Tolerance's threshold theorem"
    ],
    "slug": "quantum-hardware/noise-decoherence-and-scaling/scaling-challenges"
  },
  {
    "title": "Sources of Noise",
    "description": "Every hardware course so far treated noise as a single abstract 'decoherence.' This lesson catalogs its physical sources, and classifies each as a coherent (gate) error or an incoherent (environment) error using the Kraus-channel language already built in Advanced Topics in Quantum Mechanics.",
    "course": "noise-decoherence-and-scaling",
    "module": "sources-of-noise",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-hardware/control-and-readout/calibration"
    ],
    "objectives": [
      "Distinguish coherent errors (miscalibration, systematic) from incoherent errors (environmental decoherence)",
      "Name at least four concrete physical noise sources across this platform's covered hardware types",
      "Explain why classifying a noise source correctly (coherent vs. incoherent) determines how it can be mitigated"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition",
        "note": "The abstract mathematics behind this lesson's 'incoherent error' category: a numerical demonstration of why environmental coupling is irreversible and can't be recalibrated away."
      }
    ],
    "slug": "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise"
  },
  {
    "title": "T1 & T2 Decoherence",
    "description": "T1 and T2 aren't new physics. They're amplitude damping and dephasing channels, connected to continuous exponential decay via decayProbabilityForTimestep, verified exactly: stepping a discrete Kraus channel over one full T1 gives P(1)=e⁻¹ to 9 decimal places, for any step count.",
    "course": "noise-decoherence-and-scaling",
    "module": "t1-and-t2-decoherence",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise"
    ],
    "objectives": [
      "State the definitions of T1 (energy relaxation time) and T2 (the total coherence time, distinct from the pure-dephasing time T_phi) as continuous exponential decay constants",
      "Connect T1/T2 to this platform's discrete Kraus-channel model via decayProbabilityForTimestep",
      "Derive where the inequality T2 ≤ 2T1 comes from, and state the Markovian, exponential-decay hypothesis it rests on"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators",
        "note": "The Kraus-operator machinery behind T1/T2 decay was built here first, in the general case."
      }
    ],
    "slug": "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence"
  },
  {
    "title": "Capstone: Comparing Qubit Platforms",
    "description": "No single platform wins on every axis: putting superconducting circuits, trapped ions, neutral atoms, photons, and spin qubits side by side on coherence time, gate speed, two-qubit gate fidelity, connectivity, and scalability makes the engineering tradeoff space visible at once.",
    "course": "physical-qubit-platforms",
    "module": "capstone-comparing-qubit-platforms",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/spin-qubits"
    ],
    "objectives": [
      "Compare all five platforms on the same five axes: coherence time, gate speed, two-qubit gate fidelity, connectivity, and scalability path",
      "Explain why no platform dominates on every axis simultaneously",
      "Identify which platform a given application's priorities (e.g. long computations vs. fast iteration) would favor"
    ],
    "slug": "quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms"
  },
  {
    "title": "Neutral Atoms",
    "description": "Uncharged atoms held in place by focused laser light (optical tweezers) rather than electric fields: trading trapped ions' Coulomb-based confinement for a scheme that scales to thousands of individually-trapped atoms in reconfigurable 2D and 3D arrangements.",
    "course": "physical-qubit-platforms",
    "module": "neutral-atoms",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/trapped-ions"
    ],
    "objectives": [
      "Explain how optical tweezers trap a neutral (uncharged) atom, in contrast to an ion trap's electric fields",
      "State why neutral-atom arrays scale differently from trapped-ion chains",
      "Describe Rydberg blockade at a conceptual level as the mechanism enabling two-qubit gates between neutral atoms"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels",
        "note": "A 'Rydberg state' is a hydrogen-like high-n state named for this lesson's Rydberg energy unit; the same Eₙ=-13.6 eV/n² physics is why exciting an atom's outer electron to large n gives it the enormous, strongly-interacting orbit Rydberg blockade depends on."
      }
    ],
    "slug": "quantum-hardware/physical-qubit-platforms/neutral-atoms"
  },
  {
    "title": "Photonic Qubits",
    "description": "A qubit encoded in a single photon's polarization or path: the only major platform where the qubit doesn't sit still, trading essentially perfect coherence (light doesn't decohere in flight) for the hard problem of making two photons interact at all.",
    "course": "physical-qubit-platforms",
    "module": "photonic-qubits",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/neutral-atoms"
    ],
    "objectives": [
      "Explain how a qubit can be encoded in a photon's polarization or spatial path",
      "State why photonic qubits have essentially no decoherence in the usual sense, and what limits them instead (loss)",
      "Account, at a conceptual level, for why two-photon gates are harder than gates on matter-based qubits"
    ],
    "related": [
      {
        "slug": "quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution",
        "note": "Polarization encoding is how real quantum key distribution hardware sends BB84's Z/X-basis qubits; this platform's abstract H-and-measure protocol is, physically, an experiment built from this lesson's photon optics."
      }
    ],
    "slug": "quantum-hardware/physical-qubit-platforms/photonic-qubits"
  },
  {
    "title": "Spin Qubits",
    "description": "A qubit encoded directly in a single electron's (or nucleus's) spin, confined in a semiconductor quantum dot: the spin-1/2 two-level system built into solid-state hardware small enough that existing semiconductor fabrication tooling applies almost directly, though registers are still on the order of ten qubits.",
    "course": "physical-qubit-platforms",
    "module": "spin-qubits",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/photonic-qubits"
    ],
    "objectives": [
      "Explain how a quantum dot confines a single electron whose spin serves as the qubit",
      "State why spin qubits' small physical size is a scalability advantage, and where that advantage has not yet paid off",
      "Compare spin qubits' coherence/gate-speed regime to superconducting qubits and trapped ions"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/wave-mechanics/the-infinite-square-well",
        "note": "The confinement mechanism behind a quantum dot (a particle trapped by a potential barrier, forcing discrete energy levels), worked out exactly for the idealized box instead of real electrode voltages."
      }
    ],
    "slug": "quantum-hardware/physical-qubit-platforms/spin-qubits"
  },
  {
    "title": "Superconducting Qubits",
    "description": "A qubit built from a nonlinear LC circuit cooled to millikelvin temperatures: the Josephson junction that makes it anharmonic, so it behaves like a two-level system, not a harmonic oscillator, driven by microwave pulses whose duration is a computable gate time reusing this platform's own Rabi model.",
    "course": "physical-qubit-platforms",
    "module": "superconducting-qubits",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-computing/qubits-and-quantum-states/the-bloch-sphere"
    ],
    "objectives": [
      "Explain why a Josephson junction's nonlinearity is required to isolate a usable two-level qubit from an otherwise-harmonic circuit",
      "State superconducting qubits' typical coherence-time and gate-speed regime, and why both matter for real computation",
      "Compute a single-qubit gate time from a given Rabi frequency, reusing this platform's exact two-level Rabi model"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator",
        "note": "A transmon qubit's energy levels are an anharmonic version of this oscillator."
      }
    ],
    "slug": "quantum-hardware/physical-qubit-platforms/superconducting-qubits"
  },
  {
    "title": "Trapped Ions",
    "description": "A qubit encoded in an individual ion's internal electronic (or hyperfine) states, held in place by oscillating electric fields: trading superconducting qubits' speed for dramatically longer coherence times and, uniquely, all-to-all connectivity via a shared vibrational mode.",
    "course": "physical-qubit-platforms",
    "module": "trapped-ions",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-hardware/physical-qubit-platforms/superconducting-qubits"
    ],
    "objectives": [
      "Explain how an ion trap confines a charged atom using oscillating electric fields",
      "State why trapped ions have much longer coherence times than superconducting qubits, and at what cost",
      "Trace how the shared motional (vibrational) mode enables two-qubit gates between ANY pair of trapped ions, not just neighbors"
    ],
    "slug": "quantum-hardware/physical-qubit-platforms/trapped-ions"
  },
  {
    "title": "Barren Plateaus and Variational Trainability",
    "description": "Derives why a variational circuit's parameter-shift gradient has exactly zero mean, then why its variance shrinks exponentially in qubit count via the concentration-of-measure argument, verified numerically by scaling VQE's own single-qubit ansatz pattern up to 2 through 6 qubits and measuring real gradient variance at each size.",
    "course": "advanced-algorithms-and-complexity",
    "module": "barren-plateaus-and-variational-trainability",
    "order": 5,
    "difficulty": "master",
    "estimatedMinutes": 45,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/vqe-a-worked-toy-example",
      "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits"
    ],
    "objectives": [
      "Derive that a variational circuit's parameter-shift gradient has exactly zero mean over uniformly random parameters",
      "State and motivate the concentration-of-measure argument for why gradient variance shrinks exponentially in qubit count",
      "Verify the exponential shrinkage numerically by scaling a real multi-qubit ansatz from 2 to 6 qubits and measuring actual gradient variance at each size"
    ],
    "slug": "quantum-mastery/advanced-algorithms-and-complexity/barren-plateaus-and-variational-trainability"
  },
  {
    "title": "BQP and Oracle Complexity",
    "description": "A formal definition of BQP, and a precise proof that Deutsch-Jozsa and Simon's algorithm establish oracle-relative separations, not unconditional P-vs-BQP results, plus exactly what Grover's BBBV Ω(√N) lower bound does and does not establish about quantum computational power.",
    "course": "advanced-algorithms-and-complexity",
    "module": "bqp-and-oracle-complexity",
    "order": 1,
    "difficulty": "master",
    "estimatedMinutes": 35,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope",
      "quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification",
      "quantum-computing/quantum-algorithms-i/simons-algorithm"
    ],
    "objectives": [
      "State the formal definition of BQP as a bounded-error, polynomial-time uniform quantum circuit class",
      "Prove precisely that Deutsch-Jozsa's and Simon's algorithms establish oracle-relative query-complexity separations, not unconditional time-complexity separations",
      "Delimit exactly what the BBBV Ω(√N) lower bound does and does not establish about quantum search, and connect this to the 'provably optimal / promise-dependent / heuristic' taxonomy"
    ],
    "related": [
      {
        "slug": "quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope",
        "note": "That capstone names the 'provably optimal / promise-dependent / heuristic' taxonomy without proving it; this lesson supplies the missing proofs."
      }
    ],
    "slug": "quantum-mastery/advanced-algorithms-and-complexity/bqp-and-oracle-complexity"
  },
  {
    "title": "Capstone: What Scale Actually Requires",
    "description": "Synthesizes BQP's oracle-relative separations, Trotterization's derived error bound, and barren plateaus' exponential trainability wall into one honest account of what separates every toy result verified exactly in this platform from at-scale quantum advantage, and what real research is doing about each wall.",
    "course": "advanced-algorithms-and-complexity",
    "module": "capstone-what-scale-actually-requires",
    "order": 6,
    "difficulty": "master",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/bqp-and-oracle-complexity",
      "quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization",
      "quantum-mastery/advanced-algorithms-and-complexity/quantum-walks",
      "quantum-mastery/advanced-algorithms-and-complexity/phase-estimation-precision-and-qft-depth",
      "quantum-mastery/advanced-algorithms-and-complexity/barren-plateaus-and-variational-trainability"
    ],
    "objectives": [
      "Synthesize BQP's oracle-relative separations, Trotterization's error bound, and barren plateaus' variance scaling into one account of what scale requires",
      "Explain why every exactly-verified toy result on this platform sits on the near side of all three walls",
      "State, honestly and without exaggeration in either direction, what real research is doing about each wall",
      "Recognize the shape all three walls share: each is a quantitative resource or trainability statement, not an impossibility proof, which is exactly why each is a target rather than a verdict"
    ],
    "slug": "quantum-mastery/advanced-algorithms-and-complexity/capstone-what-scale-actually-requires"
  },
  {
    "title": "Hamiltonian Simulation and Trotterization",
    "description": "Deriving the first-order Trotter-Suzuki product formula and a Taylor-series error bound for simulating exp(−iHt) when H's terms don't commute, then verifying both the mechanism and the O(1/n) error scaling numerically on a real 2-qubit Ising Hamiltonian against exact matrix exponentiation.",
    "course": "advanced-algorithms-and-complexity",
    "module": "hamiltonian-simulation-and-trotterization",
    "order": 2,
    "difficulty": "master",
    "estimatedMinutes": 40,
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation",
      "quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit",
      "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition"
    ],
    "objectives": [
      "Derive the first-order Trotter-Suzuki single-step error via direct Taylor expansion of matrix exponentials",
      "Prove a total-error bound over n steps via a submultiplicativity lemma for products of unitaries",
      "Verify the derivation numerically on a real 2-qubit Hamiltonian, comparing Trotterization against exact matrix exponentiation"
    ],
    "slug": "quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization"
  },
  {
    "title": "Phase Estimation Precision and QFT Depth",
    "description": "Derives the exact closed-form measurement probability of quantum phase estimation for a phase not exactly representable in n bits: the 4/π² success guarantee and a tail-probability bound, both proved from elementary geometric-series algebra, plus exact QFT gate counts and an approximate QFT's provable error bound.",
    "course": "advanced-algorithms-and-complexity",
    "module": "phase-estimation-precision-and-qft-depth",
    "order": 4,
    "difficulty": "master",
    "estimatedMinutes": 45,
    "prerequisites": [
      "quantum-computing/quantum-algorithms-i/quantum-phase-estimation",
      "quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform"
    ],
    "objectives": [
      "Derive the exact closed-form measurement probability of QPE for an arbitrary (not necessarily exactly representable) phase, via geometric series",
      "Prove the 4/π² worst-case success probability guarantee and a per-outcome tail-probability bound from that closed form",
      "Count the exact QFT gate cost and a provable error bound for an approximate QFT that drops small-angle controlled-phase gates"
    ],
    "slug": "quantum-mastery/advanced-algorithms-and-complexity/phase-estimation-precision-and-qft-depth"
  },
  {
    "title": "Quantum Walks",
    "description": "Derives the coined discrete-time quantum walk on a line via a coin operator and conditional shift, showing from its dispersion relation that spreading is ballistic (∝t) rather than the classical walk's diffusive (∝√t), verified numerically. Plus the continuous-time walk's exact identity with Hamiltonian simulation of a graph's adjacency matrix.",
    "course": "advanced-algorithms-and-complexity",
    "module": "quantum-walks",
    "order": 3,
    "difficulty": "master",
    "estimatedMinutes": 40,
    "prerequisites": [
      "quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization",
      "quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion"
    ],
    "objectives": [
      "Derive the coined discrete-time quantum walk on a line from a coin operator and a conditional shift operator",
      "Read off the walk's momentum-space dispersion relation and show it forces ballistic (∝t) rather than diffusive (∝√t) spreading",
      "Verify ballistic vs. diffusive spreading numerically for a real coined walk against a real classical random walk, and connect continuous-time quantum walks to Hamiltonian simulation of a graph's adjacency matrix"
    ],
    "slug": "quantum-mastery/advanced-algorithms-and-complexity/quantum-walks"
  },
  {
    "title": "Capstone: What Rigor Buys You",
    "description": "Four heuristic shortcuts the earlier curriculum used freely, from 'check A=A†' to 'match boundary conditions and move on,' reexamined against this course's actual theorems, plus one honest exception, the half-line momentum operator, showing why rigor is worth having even when the shortcuts never failed.",
    "course": "hilbert-space-and-spectral-theory",
    "module": "capstone-what-rigor-buys-you",
    "order": 6,
    "difficulty": "master",
    "estimatedMinutes": 26,
    "prerequisites": [
      "quantum-mastery/hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness",
      "quantum-mastery/hilbert-space-and-spectral-theory/the-spectral-theorem-for-unbounded-operators",
      "quantum-mastery/hilbert-space-and-spectral-theory/continuous-spectra-and-rigged-hilbert-space",
      "quantum-mastery/hilbert-space-and-spectral-theory/greens-functions-and-resolvents",
      "quantum-mastery/hilbert-space-and-spectral-theory/sturm-liouville-theory"
    ],
    "objectives": [
      "State precisely which four heuristic shortcuts from the earlier (non-Master) curriculum this course made rigorous, and what each one turned out to actually require",
      "Explain why none of those shortcuts ever produced a wrong physical prediction, using this course's own theorems as the reason rather than luck",
      "Identify a case (self-adjoint extensions) where informal reasoning alone would not have been enough, and why the main curriculum never ran into it"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths",
        "note": "That capstone closed Advanced Topics in Quantum Mechanics by stating honestly what remains open across formulations; this one closes Hilbert Space & Spectral Theory by stating honestly what was already secretly closed all along, underneath the earlier curriculum's working shortcuts."
      }
    ],
    "slug": "quantum-mastery/hilbert-space-and-spectral-theory/capstone-what-rigor-buys-you"
  },
  {
    "title": "Continuous Spectra and Rigged Hilbert Space",
    "description": "Momentum Space and the Fourier Transform used |p⟩ constantly and correctly, but ⟨p|p⟩ literally diverges: |p⟩ is not, and cannot be, a vector in L²(ℝ). Building the Gelfand triple Φ ⊂ H ⊂ Φ′ is what makes every one of those earlier calculations rigorous rather than a useful fiction.",
    "course": "hilbert-space-and-spectral-theory",
    "module": "continuous-spectra-and-rigged-hilbert-space",
    "order": 3,
    "difficulty": "master",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mastery/hilbert-space-and-spectral-theory/the-spectral-theorem-for-unbounded-operators",
      "quantum-mechanics/wave-mechanics/momentum-space-and-the-fourier-transform"
    ],
    "objectives": [
      "Derive directly that the momentum eigenfunction φₚ(x)=exp(ipx/ħ) has infinite L² norm, hence is not a Hilbert-space vector",
      "Build the Gelfand triple Φ ⊂ H ⊂ Φ′ and state precisely what kind of object |p⟩ actually is",
      "Verify ⟨p|p′⟩=δ(p−p′) as a delta-sequence limit, not an asserted identity"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/wave-mechanics/momentum-space-and-the-fourier-transform",
        "note": "Every plane-wave manipulation in that lesson is made rigorous here: the Gelfand triple is what |p⟩ and ∫|p⟩⟨p|dp=I mean, once 'vector in H' is no longer available as the reading."
      }
    ],
    "slug": "quantum-mastery/hilbert-space-and-spectral-theory/continuous-spectra-and-rigged-hilbert-space"
  },
  {
    "title": "Green's Functions and Resolvents",
    "description": "The resolvent (E−H)⁻¹ packages every bound state and every scattering state of a Hamiltonian into one analytic object: its poles are exactly the bound-state energies, and its branch cut is exactly the continuous spectrum, derived and verified against the already-known infinite-well and free-particle eigenvalues.",
    "course": "hilbert-space-and-spectral-theory",
    "module": "greens-functions-and-resolvents",
    "order": 4,
    "difficulty": "master",
    "estimatedMinutes": 32,
    "prerequisites": [
      "quantum-mastery/hilbert-space-and-spectral-theory/the-spectral-theorem-for-unbounded-operators",
      "quantum-mechanics/one-dimensional-systems/the-finite-square-well-setting-up-the-equation"
    ],
    "objectives": [
      "Derive the resolvent R(E)=(E−H)⁻¹=Σₙ Pₙ/(E−Eₙ) directly from the spectral theorem and identify its poles as bound-state energies",
      "Construct the free-particle and infinite-square-well Green's functions in closed form from a jump condition, and verify the well's poles reproduce the exact known energy levels",
      "Apply the Sokhotski–Plemelj imaginary-part identity and connect it to why the continuous spectrum shows up as a branch cut rather than isolated poles"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/one-dimensional-systems/solving-the-finite-well-numerically",
        "note": "That lesson found the finite well's bound states by bisection on a transcendental condition; this lesson's resolvent poles are the same bound states, reached from a completely different direction (an analytic function's singularities) and cross-checked against the infinite well's exact closed-form spectrum."
      }
    ],
    "slug": "quantum-mastery/hilbert-space-and-spectral-theory/greens-functions-and-resolvents"
  },
  {
    "title": "Hilbert Spaces and Self-Adjointness",
    "description": "Every earlier course checked A = A† and called it a day. Here that check splits into two distinct conditions, symmetric versus self-adjoint, distinguished only by whether the operator's domain matches its adjoint's domain, and the momentum operator on a half-line is a worked example where they come apart.",
    "course": "hilbert-space-and-spectral-theory",
    "module": "hilbert-spaces-and-self-adjointness",
    "order": 1,
    "difficulty": "master",
    "estimatedMinutes": 32,
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/the-position-and-momentum-operators",
      "quantum-mechanics/mathematical-foundations/hermitian-operators"
    ],
    "objectives": [
      "State precisely what makes L²(ℝ) a Hilbert space (completeness, separability) and why both properties matter physically",
      "Derive, not assert, that a function in the domain of p̂ = −iħd/dx on the whole line vanishes at ±∞",
      "Distinguish a symmetric (formally Hermitian) operator from a fully self-adjoint one, and settle by an explicit deficiency-subspace calculation whether p̂ on a half-line admits a self-adjoint extension"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/the-hydrogen-atom/the-radial-equation",
        "note": "The radial equation's boundary condition u(0)=0 is a domain choice of the kind this lesson makes precise. It is the physically forced condition for the radial momentum-like operator to be self-adjoint on a half-line, not an ad hoc requirement."
      }
    ],
    "slug": "quantum-mastery/hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness"
  },
  {
    "title": "Sturm-Liouville Theory",
    "description": "The general eigenvalue-problem theorem hiding behind every solvable potential taught so far: real eigenvalues, orthogonal eigenfunctions, and a complete eigenbasis, proved once from a single boundary-term identity, then tested against two problems that look nothing alike, the infinite well and the hydrogen radial equation.",
    "course": "hilbert-space-and-spectral-theory",
    "module": "sturm-liouville-theory",
    "order": 5,
    "difficulty": "master",
    "estimatedMinutes": 32,
    "prerequisites": [
      "quantum-mastery/hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness",
      "quantum-mechanics/the-hydrogen-atom/the-radial-equation"
    ],
    "objectives": [
      "Derive the Sturm-Liouville orthogonality theorem from Lagrange's identity and a vanishing boundary term",
      "Establish that Sturm-Liouville eigenvalues are real, by the same boundary-term technique applied to a function and its own conjugate",
      "Show explicitly that the infinite square well and the hydrogen radial equation are both special cases of one Sturm-Liouville problem, with different p, q, w, and boundary conditions"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/the-hydrogen-atom/the-radial-equation",
        "note": "The radial equation's u(0)=0 boundary condition and its 1D-Schrödinger-equation-shaped ODE are exactly the Sturm-Liouville data this lesson identifies explicitly (p=1, q=V_eff(r), w=1), rather than left as 'it happens to look like the infinite well's equation.'"
      }
    ],
    "slug": "quantum-mastery/hilbert-space-and-spectral-theory/sturm-liouville-theory"
  },
  {
    "title": "The Spectral Theorem for Unbounded Operators",
    "description": "The projection-valued-measure form of the spectral theorem, stated and connected explicitly to Spectral Decomposition and Degeneracy's finite-dimensional A=Σλᵢ|eᵢ⟩⟨eᵢ|: the discrete sum turns out to be the special case where the general theorem's continuous integral has a staircase measure.",
    "course": "hilbert-space-and-spectral-theory",
    "module": "the-spectral-theorem-for-unbounded-operators",
    "order": 2,
    "difficulty": "master",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mastery/hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness",
      "quantum-mechanics/operators-observables-measurement/spectral-decomposition-and-degeneracy"
    ],
    "objectives": [
      "State the projection-valued-measure (PVM) form of the spectral theorem for a self-adjoint operator",
      "Derive explicitly how the discrete-spectrum case reduces to Spectral Decomposition and Degeneracy's A=Σλᵢ|eᵢ⟩⟨eᵢ| formula",
      "Restate the measurement postulate (discrete and continuous) as one unified statement, P(outcome∈Δ)=⟨ψ|E(Δ)|ψ⟩"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/operators-observables-measurement/spectral-decomposition-and-degeneracy",
        "note": "This lesson's discrete-spectrum reduction reproduces that lesson's A=Σλᵢ Pᵢ formula exactly, now derived as a special case of the general theorem, where that lesson stated it as the whole story."
      }
    ],
    "slug": "quantum-mastery/hilbert-space-and-spectral-theory/the-spectral-theorem-for-unbounded-operators"
  },
  {
    "title": "CSS Codes and the General Stabilizer Formalism",
    "description": "Generalizes stabilizer syndrome measurement to arbitrary [[n,k,d]] stabilizer codes, then builds the Steane [[7,1,3]] code explicitly from a single classical Hamming code, with every stabilizer, every commutation check, and the code distance itself computed, not asserted.",
    "course": "quantum-information-theory",
    "module": "css-codes-and-the-general-stabilizer-formalism",
    "order": 7,
    "difficulty": "master",
    "estimatedMinutes": 35,
    "prerequisites": [
      "quantum-computing/error-correction-and-fault-tolerance/stabilizer-formalism-basics",
      "quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction"
    ],
    "objectives": [
      "Define general [[n,k,d]] stabilizer codes and the CSS construction from two nested classical linear codes",
      "Construct the Steane [[7,1,3]] code's stabilizer generators explicitly from the classical Hamming[7,4,3] code",
      "Verify every stabilizer generator commutes and compute the code's exact distance, both by classical linear algebra and by direct 128-dimensional operator computation"
    ],
    "related": [
      {
        "slug": "quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction",
        "note": "Surface codes are also CSS codes, built the same way from a different (topological, not Hamming) pair of classical codes; this lesson's machinery is what is conceptually gestured at there."
      }
    ],
    "slug": "quantum-mastery/quantum-information-theory/css-codes-and-the-general-stabilizer-formalism"
  },
  {
    "title": "Quantum Channels: Kraus and Choi",
    "description": "Open Quantum Systems & Kraus Operators asserted that every physical channel has a Kraus form; this lesson proves it, via the Choi-Jamiolkowski isomorphism, then reconstructs amplitude damping's own K0 and K1 from nothing but its Choi matrix's eigenvectors.",
    "course": "quantum-information-theory",
    "module": "quantum-channels-kraus-and-choi",
    "order": 3,
    "difficulty": "master",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators",
      "quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification"
    ],
    "objectives": [
      "Define the Choi matrix of a quantum channel and prove complete positivity is equivalent to Choi-matrix positive semi-definiteness",
      "Prove trace-preservation corresponds to the Choi matrix's output-partial-trace equaling the identity",
      "Reconstruct a channel's Kraus operators directly from its Choi matrix's eigendecomposition, verified against a real channel"
    ],
    "related": [
      {
        "slug": "quantum-mastery/quantum-information-theory/the-lindblad-master-equation",
        "note": "The Lindblad equation generates a continuous family of CP maps; every snapshot of it has a Choi matrix obeying this lesson's positivity condition."
      }
    ],
    "slug": "quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi"
  },
  {
    "title": "Relative Entropy and Mixed-State Entanglement",
    "description": "Quantum relative entropy, proved non-negative via Klein's inequality, then the general mixed-state Wootters concurrence formula, previously named and left uncomputed, built here and evaluated explicitly on a state that is actually mixed, not pure in disguise.",
    "course": "quantum-information-theory",
    "module": "relative-entropy-and-mixed-state-entanglement",
    "order": 5,
    "difficulty": "master",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure",
      "quantum-mastery/quantum-information-theory/trace-distance-and-fidelity"
    ],
    "objectives": [
      "Define quantum relative entropy and prove its non-negativity via Klein's inequality",
      "State the general (mixed-state) Wootters concurrence formula and prove it reduces to the platform's existing pure-state formula",
      "Compute the Wootters concurrence exactly for a properly mixed two-qubit state, using this platform's own eigensolver"
    ],
    "related": [
      {
        "slug": "quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure",
        "note": "That lesson names the general mixed-state formula and explicitly refuses to implement it; this is the lesson that closes the gap."
      }
    ],
    "slug": "quantum-mastery/quantum-information-theory/relative-entropy-and-mixed-state-entanglement"
  },
  {
    "title": "Rigorous Teleportation and Superdense Coding",
    "description": "Quantum Teleportation and Superdense Coding were derived with pure-state algebra and a perfect Bell pair. Re-derived here as explicit channels on density matrices, with a computed answer to the question those lessons couldn't ask: what happens when the shared entanglement is imperfect?",
    "course": "quantum-information-theory",
    "module": "rigorous-teleportation-and-superdense-coding",
    "order": 6,
    "difficulty": "master",
    "estimatedMinutes": 35,
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/quantum-teleportation",
      "quantum-computing/quantum-gates-and-circuits/superdense-coding",
      "quantum-mastery/quantum-information-theory/trace-distance-and-fidelity"
    ],
    "objectives": [
      "Re-derive teleportation as a single explicit quantum channel on density matrices, summed coherently over Alice's four measurement branches",
      "Prove this channel equals the identity channel exactly for a perfect Bell pair",
      "Compute the exact fidelity loss teleportation and superdense coding suffer when the shared Bell pair is itself mixed"
    ],
    "related": [
      {
        "slug": "quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi",
        "note": "That lesson gives the test this one's construction has to pass: the 'teleportation channel' built here is assembled from projectors, a partial trace and conditional corrections instead of a Kraus sum, so complete positivity is something to check and not assume, and the Choi criterion is what checks it."
      }
    ],
    "slug": "quantum-mastery/quantum-information-theory/rigorous-teleportation-and-superdense-coding"
  },
  {
    "title": "Schmidt Decomposition and Purification",
    "description": "The fact Entanglement Entropy for Pure Bipartite States quietly assumed, that a pure bipartite state's two reduced density matrices always share the same nonzero eigenvalues, proved from scratch via singular value decomposition, with purification following as an immediate corollary.",
    "course": "quantum-information-theory",
    "module": "schmidt-decomposition-and-purification",
    "order": 1,
    "difficulty": "master",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/entanglement-entropy-for-pure-states",
      "quantum-computing/entanglement-and-measurement/partial-trace-and-reduced-states"
    ],
    "objectives": [
      "Prove the Schmidt decomposition theorem for a bipartite pure state via singular value decomposition of its amplitude matrix",
      "Show the Schmidt coefficients are exactly the eigenvalues shared by both reduced density matrices",
      "Derive purification, every mixed state is the reduced state of some pure state on a larger system, as a direct corollary"
    ],
    "related": [
      {
        "slug": "quantum-mastery/quantum-information-theory/trace-distance-and-fidelity",
        "note": "That lesson is where the purifications built here start doing work: Uhlmann's theorem characterises fidelity as a maximum of overlaps over all purifications of two states, so the 'every purification differs from every other by a unitary on B' freedom proved here is precisely the set that maximisation ranges over. Without that classification the maximum would be over an unspecified collection."
      }
    ],
    "slug": "quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification"
  },
  {
    "title": "The Lindblad Master Equation",
    "description": "The continuous-time differential equation deliberately left unbuilt earlier, derived as the most general Markovian CP generator, then shown to reproduce this platform's existing discrete amplitude-damping channel exactly at every timestep, not just in an infinitesimal limit.",
    "course": "quantum-information-theory",
    "module": "the-lindblad-master-equation",
    "order": 4,
    "difficulty": "master",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi",
      "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence"
    ],
    "objectives": [
      "Derive the GKLS (Lindblad) equation's structure from the requirement that its generated dynamics stay completely positive and trace-preserving",
      "Solve the Lindblad equation for pure amplitude damping and pure dephasing in closed form",
      "Prove the discrete Kraus channel already implemented in this platform is the Lindblad equation evaluated exactly at t=dt, and derive the T2<=2T1 bound from first principles"
    ],
    "related": [
      {
        "slug": "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
        "note": "That lesson states T2<=2T1 with its Markovian proviso attached but no derivation; this lesson supplies the derivation, from the Lindblad generator's linearity in its jump operators, and shows exactly where that proviso is spent."
      }
    ],
    "slug": "quantum-mastery/quantum-information-theory/the-lindblad-master-equation"
  },
  {
    "title": "Trace Distance and Fidelity",
    "description": "The two standard ways to ask 'how close are two quantum states?', derived and proved related by the Fuchs–van de Graaf inequalities, then used to put an exact number on how well this platform's own amplitude-damping and dephasing channels preserve a state.",
    "course": "quantum-information-theory",
    "module": "trace-distance-and-fidelity",
    "order": 2,
    "difficulty": "master",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification",
      "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators"
    ],
    "objectives": [
      "Derive trace distance's variational (Helstrom) characterization and its closed form for qubits",
      "Establish the Uhlmann fidelity's pure-state shortcut and state Uhlmann's theorem",
      "Prove the Fuchs–van de Graaf inequalities relating trace distance and fidelity",
      "Compute real trace-distance and fidelity numbers for this platform's amplitude-damping and dephasing channels"
    ],
    "related": [
      {
        "slug": "quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi",
        "note": "This lesson measures how far a channel moves one input state; that lesson supplies the object that characterises the channel independently of any input, the Choi matrix, built there for these same two channels at the same strengths. Read together they answer 'how much damage on this state' and 'what kind of map is doing the damage' from the same numbers."
      }
    ],
    "slug": "quantum-mastery/quantum-information-theory/trace-distance-and-fidelity"
  },
  {
    "title": "Capstone: What Can Be Sent Through Noise",
    "description": "The course's throughline, generalized measurement, Stinespring dilation, entropy, data processing, entanglement distillation, converges on one computable question: how many classical bits and how many quantum bits survive one use of a noisy channel, and why those two numbers can be worlds apart.",
    "course": "quantum-shannon-theory",
    "module": "capstone-what-can-be-sent-through-noise",
    "order": 6,
    "difficulty": "master",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mastery/quantum-shannon-theory/the-data-processing-inequality",
      "quantum-mastery/quantum-shannon-theory/entanglement-distillation-and-typical-subspaces"
    ],
    "objectives": [
      "State the classical capacity of a quantum channel (Holevo-Schumacher-Westmoreland theorem, via the Holevo quantity) and the quantum capacity (via the coherent information, LSD theorem), and explain precisely what each one means operationally",
      "Compute the Holevo quantity for a concrete ensemble sent through a real depolarizing/dephasing channel and compare it to the classical Shannon capacity intuition",
      "Explain why quantum capacity can be zero even when classical capacity through the same channel is positive, and connect this to the whole course's throughline: what a channel destroys, and what survives"
    ],
    "related": [
      {
        "slug": "quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi",
        "note": "This capstone's depolarizing channel is the kind of completely positive, trace-preserving map that lesson's Choi-matrix machinery certifies as physical; this lesson reuses that same Choi-state construction, applied to a maximally entangled input, to prove the entanglement-breaking threshold below."
      }
    ],
    "slug": "quantum-mastery/quantum-shannon-theory/capstone-what-can-be-sent-through-noise"
  },
  {
    "title": "Entanglement Distillation and Typical Subspaces",
    "description": "Turns Schmidt Decomposition and Purification's abstract entanglement entropy into an operational quantity: the typical-subspace argument behind entanglement concentration, computed concretely, that says exactly how many near-perfect Bell pairs n copies of a partially-entangled state yield.",
    "course": "quantum-shannon-theory",
    "module": "entanglement-distillation-and-typical-subspaces",
    "order": 5,
    "difficulty": "master",
    "estimatedMinutes": 27,
    "prerequisites": [
      "quantum-mastery/quantum-shannon-theory/quantum-entropy-and-information-measures",
      "quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification"
    ],
    "objectives": [
      "Explain entanglement distillation: converting many copies of a partially-entangled (or noisy) state into fewer, nearly-perfect Bell pairs using only LOCC",
      "State the typical subspace idea: for many i.i.d. copies of a state, almost all of the probability weight concentrates on a subspace of dimension approximately 2^(n S(rho)), not the full 2^n-dimensional space",
      "Connect the typical-subspace dimension directly to the distillable entanglement rate, and to Schumacher compression's classical analogue"
    ],
    "related": [
      {
        "slug": "quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification",
        "note": "The n-copy joint Schmidt coefficients this lesson builds a typical subspace out of are what that lesson's SVD-based theorem guarantees exist for any bipartite pure state, applied here to |psi>^⊗n itself."
      }
    ],
    "slug": "quantum-mastery/quantum-shannon-theory/entanglement-distillation-and-typical-subspaces"
  },
  {
    "title": "POVMs and Generalized Measurement",
    "description": "Prior lessons on measurement and quantum channels both stopped at orthogonal projective measurement. This lesson proves that's a special case of the strictly more general POVM formalism, the only framework rigorous enough to state the optimal state-discrimination question underlying quantum cryptography and dispersive qubit readout.",
    "course": "quantum-shannon-theory",
    "module": "povms-and-generalized-measurement",
    "order": 1,
    "difficulty": "master",
    "estimatedMinutes": 28,
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi"
    ],
    "objectives": [
      "State the definition of a POVM and show why {E_i} summing to identity is exactly the condition needed for a valid, unbiased probability distribution",
      "Prove (or derive) Naimark's dilation theorem: every POVM measurement on a system is a projective (von Neumann) measurement on a larger system plus a partial trace",
      "Explain quantum instruments as the general object that specifies BOTH the measurement outcome probabilities and the post-measurement state, and why POVMs alone only give the former",
      "Build the three-effect POVM that unambiguously discriminates two non-orthogonal states, and settle what a two-outcome projective measurement on the same qubit can do by comparison"
    ],
    "related": [
      {
        "slug": "quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi",
        "note": "Every POVM element here is built the same way that lesson's Kraus operators build a channel (E_i = K_i-dagger K_i); this lesson's Naimark dilation is the measurement-only special case of that lesson's enlarge-then-project idea, and its Choi-positivity argument is reused almost verbatim to prove the completeness relation below."
      }
    ],
    "slug": "quantum-mastery/quantum-shannon-theory/povms-and-generalized-measurement"
  },
  {
    "title": "Quantum Entropy and Information Measures",
    "description": "Quantum mutual information and conditional entropy, built from the same von Neumann entropy this platform already computes, then evaluated on a maximally entangled pair, where the classical intuition for what a conditional entropy is even allowed to be stops holding.",
    "course": "quantum-shannon-theory",
    "module": "quantum-entropy-and-information-measures",
    "order": 3,
    "difficulty": "master",
    "estimatedMinutes": 28,
    "prerequisites": [
      "quantum-mastery/quantum-information-theory/relative-entropy-and-mixed-state-entanglement"
    ],
    "objectives": [
      "Define quantum mutual information I(A:B) = S(A) + S(B) - S(AB) and compute it for a worked bipartite state",
      "Compute conditional quantum entropy S(A|B) = S(AB) - S(B) and show, with a real example, that it can be NEGATIVE for entangled states, unlike its classical counterpart",
      "Interpret coherent information I(A>B) = -S(A|B) and explain why its sign controls whether a channel can be used to reliably send quantum information"
    ],
    "related": [
      {
        "slug": "quantum-mastery/quantum-information-theory/relative-entropy-and-mixed-state-entanglement",
        "note": "That lesson proved S(rho||sigma) >= 0 via Klein's inequality; this lesson's data-processing-flavored quantities (mutual information, conditional entropy) are built from the same von Neumann entropy, and the data-processing inequality itself is a direct descendant of Klein's inequality, proved next in this course."
      }
    ],
    "slug": "quantum-mastery/quantum-shannon-theory/quantum-entropy-and-information-measures"
  },
  {
    "title": "Stinespring Dilation and Channel Purification",
    "description": "Quantum channels are known to have a Kraus form, but not where the Kraus operators physically come from. This lesson derives their origin from scratch, building the explicit two-qubit unitary that reproduces amplitude damping's own K0 and K1 exactly, and showing a channel's dilation is just a purification of its Choi state.",
    "course": "quantum-shannon-theory",
    "module": "stinespring-dilation-and-channel-purification",
    "order": 2,
    "difficulty": "master",
    "estimatedMinutes": 26,
    "prerequisites": [
      "quantum-mastery/quantum-shannon-theory/povms-and-generalized-measurement",
      "quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi"
    ],
    "objectives": [
      "State and prove the Stinespring dilation theorem: every CPTP channel arises from a unitary on a larger system followed by a partial trace",
      "Construct the explicit ancilla-unitary realization of a given qubit channel's Kraus operators",
      "Explain why the Kraus representation is not unique, but the Stinespring dilation is unique up to a unitary on the environment (isometric extension)"
    ],
    "related": [
      {
        "slug": "quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi",
        "note": "That lesson proved every Kraus set is reconstructible from a Choi matrix; this one goes one physical layer deeper, deriving the actual joint system+environment unitary those Kraus operators secretly came from."
      }
    ],
    "slug": "quantum-mastery/quantum-shannon-theory/stinespring-dilation-and-channel-purification"
  },
  {
    "title": "The Data-Processing Inequality",
    "description": "Quantum relative entropy can only shrink under a physical channel, S(N(rho)||N(sigma)) <= S(rho||sigma). That is the exact reason correlated information can never be manufactured by processing, only lost, and it is checked here numerically on a dephased Bell pair.",
    "course": "quantum-shannon-theory",
    "module": "the-data-processing-inequality",
    "order": 4,
    "difficulty": "master",
    "estimatedMinutes": 26,
    "prerequisites": [
      "quantum-mastery/quantum-shannon-theory/quantum-entropy-and-information-measures",
      "quantum-mastery/quantum-shannon-theory/stinespring-dilation-and-channel-purification"
    ],
    "objectives": [
      "State the monotonicity of quantum relative entropy under CPTP maps: S(N(rho) || N(sigma)) <= S(rho || sigma)",
      "Derive the data-processing inequality for mutual information, I(A:B) >= I(A:B') when B' = N(B) for any channel N, as a direct corollary",
      "Explain concretely why this single inequality underlies 'you cannot gain information by processing data you already have', the impossibility of increasing entanglement by LOCC, and the security intuition behind quantum key distribution"
    ],
    "related": [
      {
        "slug": "quantum-mastery/quantum-information-theory/relative-entropy-and-mixed-state-entanglement",
        "note": "That lesson proves S(rho||sigma) >= 0 for a fixed pair of states via Klein's inequality; this lesson proves the strictly stronger, dynamical statement that any physical channel can only push that same quantity further toward zero, never away from it."
      }
    ],
    "slug": "quantum-mastery/quantum-shannon-theory/the-data-processing-inequality"
  },
  {
    "title": "Capstone: Symmetry and the Classical Limit",
    "description": "Berry phase, the adiabatic theorem, and WKB are three convergent routes to the same place: the classical/geometric structure hiding inside quantum phase. This capstone makes it explicit, computing both kinds of phase for the same slowly traversed loop and letting the loop's duration settle which is path and which is clock.",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "module": "capstone-symmetry-and-the-classical-limit",
    "order": 1,
    "difficulty": "master",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/the-adiabatic-theorem-and-berry-phase",
      "quantum-mechanics/approximation-methods/the-wkb-approximation"
    ],
    "objectives": [
      "Explain why WKB's action phase and the adiabatic theorem's dynamical phase both diverge in their respective classical limits, while a geometric residue (quantized action, Berry phase) survives",
      "State the connection between WKB's Bohr-Sommerfeld quantization and classical adiabatic invariance of the action variable",
      "Identify Berry phase's classical shadow (the Hannay angle) as the same geometric idea appearing one level down, in classical mechanics itself"
    ],
    "slug": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/capstone-symmetry-and-the-classical-limit"
  },
  {
    "title": "Clebsch-Gordan Coefficients and the Wigner-Eckart Theorem",
    "description": "Derives the general j₁⊗j₂ Clebsch-Gordan recursion, verifies it explicitly for l=1⊗s=1/2, the exact table a later lesson borrows, then proves the Wigner-Eckart theorem and reads off selection rules from symmetry alone, no integral needed.",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "module": "clebsch-gordan-coefficients-and-the-wigner-eckart-theorem",
    "order": 1,
    "difficulty": "master",
    "estimatedMinutes": 35,
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/addition-of-angular-momentum",
      "quantum-mechanics/angular-momentum-and-spin/ladder-operators-and-the-angular-momentum-spectrum",
      "quantum-mechanics/angular-momentum-and-spin/orbital-angular-momentum-and-spherical-harmonics"
    ],
    "objectives": [
      "Derive the general Clebsch-Gordan recursion relation for j₁⊗j₂ from the ladder operators alone, and explain the 'peel off the orthogonal state' step that generates each new j multiplet",
      "Work the l=1⊗s=1/2 example explicitly, producing a full numeric CG table verified as exact J² and Jz eigenstates",
      "State and justify the Wigner-Eckart theorem, and derive selection rules (Δm=q, the triangle rule) directly from Clebsch-Gordan vanishing conditions, without evaluating any integral"
    ],
    "related": [
      {
        "slug": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/degenerate-perturbation-theory-and-fine-structure",
        "note": "That lesson used this exact l=1⊗s=1/2 coupled basis to diagonalize hydrogen's spin-orbit operator, borrowing the coefficients this lesson now actually derives."
      }
    ],
    "slug": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/clebsch-gordan-coefficients-and-the-wigner-eckart-theorem"
  },
  {
    "title": "Coherent and Squeezed States",
    "description": "The harmonic oscillator states that most resemble a classical trajectory: eigenstates of the annihilation operator, proved here to saturate the uncertainty bound with equal position and momentum spread. Squeezed states break that equality on purpose, and working out what the trade costs makes the name squeezing literal.",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "module": "coherent-and-squeezed-states",
    "order": 1,
    "difficulty": "master",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator",
      "quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty"
    ],
    "objectives": [
      "Derive coherent states as eigenstates of the annihilation operator, â|α⟩=α|α⟩, and expand them in the Fock basis",
      "Prove coherent states saturate the position-momentum uncertainty bound with equal Δx and Δp",
      "Generalize to squeezed states as the full minimum-uncertainty family and compute how squeezing trades Δx against Δp while their product stays fixed"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator",
        "note": "This lesson's â|α⟩=α|α⟩ eigenvalue equation and its x,p uncertainty results are built directly on that lesson's a, a† ladder operators and its energy spectrum, no new physical postulate needed."
      }
    ],
    "slug": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/coherent-and-squeezed-states"
  },
  {
    "title": "Degenerate Perturbation Theory and Fine Structure",
    "description": "Derives degenerate perturbation theory properly, diagonalizing H′ within the degenerate subspace first, applies it to hydrogen's 2p spin-orbit coupling, and computes the actual 2p₃/₂–2p₁/₂ splitting in eV, the calculation a prior lesson named and declined to do.",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "module": "degenerate-perturbation-theory-and-fine-structure",
    "order": 1,
    "difficulty": "master",
    "estimatedMinutes": 35,
    "prerequisites": [
      "quantum-mechanics/approximation-methods/time-independent-perturbation-theory",
      "quantum-mechanics/the-hydrogen-atom/fine-structure-introduction",
      "quantum-mechanics/angular-momentum-and-spin/addition-of-angular-momentum"
    ],
    "objectives": [
      "Derive degenerate perturbation theory: show the correct zeroth-order states diagonalize H′ within the degenerate subspace, not just any basis of it",
      "Build the hydrogen 2p spin-orbit operator L·S explicitly and show it is diagonal in the coupled |j,mj⟩ basis but not the uncoupled |mL,mS⟩ basis",
      "Compute hydrogen's real 2p₃/₂–2p₁/₂ spin-orbit splitting in eV, the calculation Fine Structure (Introduction) explicitly withheld"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/the-hydrogen-atom/fine-structure-introduction",
        "note": "That lesson named this exact calculation as 'beyond this course's scope.' This lesson is the scope: the same L·S coupling, the same n=2 subspace, actually diagonalized and numerically evaluated."
      }
    ],
    "slug": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/degenerate-perturbation-theory-and-fine-structure"
  },
  {
    "title": "The Adiabatic Theorem and Berry Phase",
    "description": "A Hamiltonian that changes slowly enough keeps a system in its instantaneous eigenstate, proved directly from the time-dependent Schrödinger equation. Applied to a spin-1/2 dragged around a cone by a rotating field, the same derivation produces Berry's geometric phase, computed as a discretized loop integral matched to −½ the solid angle traced.",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "module": "the-adiabatic-theorem-and-berry-phase",
    "order": 1,
    "difficulty": "master",
    "estimatedMinutes": 35,
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment",
      "quantum-computing/qubits-and-quantum-states/the-bloch-sphere",
      "quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation"
    ],
    "objectives": [
      "Derive the adiabatic theorem from the time-dependent Schrödinger equation, and state the actual slowness condition it requires",
      "Identify the geometric (Berry) phase as the extra, non-dynamical phase term the adiabatic derivation itself produces",
      "Compute the Berry phase for a spin-1/2 in a slowly rotating field explicitly, and verify it equals minus half the solid angle traced by the field direction"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment",
        "note": "That lesson's spin-1/2 states, measured along an arbitrary axis, are exactly the instantaneous eigenstates this lesson drags slowly around a loop; the Berry phase is a property of that same family of states this lesson didn't need yet."
      }
    ],
    "slug": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/the-adiabatic-theorem-and-berry-phase"
  },
  {
    "title": "Three-Dimensional Scattering and the S-Matrix",
    "description": "Generalizes 1D scattering to a real 3D central potential: the partial-wave expansion, phase shifts δₗ, the cross-section formula built from them, and the S-matrix, worked explicitly for hard-sphere scattering with a closed-form δ₀=−ka and a famous low-energy cross-section limit that is not the sphere's geometric shadow.",
    "course": "symmetry-scattering-and-semiclassical-methods",
    "module": "three-dimensional-scattering-and-the-s-matrix",
    "order": 1,
    "difficulty": "master",
    "estimatedMinutes": 35,
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential",
      "quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier",
      "quantum-mechanics/angular-momentum-and-spin/orbital-angular-momentum-and-spherical-harmonics"
    ],
    "objectives": [
      "Derive the partial-wave radial equation from separating a 3D central-potential Schrödinger equation, and identify the phase shift δₗ as the full content of the scattering information in each channel",
      "State and apply the differential and total cross-section formulas built from the δₗ's, and define the S-matrix Sₗ=exp(2iδₗ)",
      "Work hard-sphere scattering explicitly, deriving the exact s-wave phase shift δ₀=−ka and evaluating its low-energy cross-section limit against the sphere's classical geometric area"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier",
        "note": "That lesson's two-boundary matching (continuity of ψ,ψ' at each edge) is exactly the technique this lesson reuses at r=a for hard-sphere scattering; the new ingredients are the centrifugal term and the discrete l-channel structure."
      }
    ],
    "slug": "quantum-mastery/symmetry-scattering-and-semiclassical-methods/three-dimensional-scattering-and-the-s-matrix"
  },
  {
    "title": "Capstone: Operators, Paths, and What's Still Open",
    "description": "Connecting this course's two new perspectives, open-system/Kraus-operator decoherence and the path-integral sum, back to the operator formalism running through every earlier course, and stating honestly what quantum foundations still leaves unresolved.",
    "course": "advanced-quantum-mechanics",
    "module": "capstone-operators-and-paths",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation"
    ],
    "objectives": [
      "Summarize how Kraus operators, decoherence, and the path integral each extend or reframe the operator formalism from earlier courses",
      "State clearly what decoherence explains and what it leaves open about measurement",
      "Identify where each of this course's tools will reappear in the Quantum Computing track (error correction, noise, hardware)"
    ],
    "slug": "quantum-mechanics/advanced-quantum-mechanics/capstone-operators-and-paths"
  },
  {
    "title": "Decoherence & the Quantum-to-Classical Transition",
    "description": "Applying the dephasing channel repeatedly to |+⟩ drives its off-diagonal coherence from 0.5 toward exactly 0 and its purity from 1.0 toward exactly 0.5, maximally mixed: a direct numerical demonstration of why macroscopic superpositions don't survive contact with an environment, using only repeated Kraus-channel application.",
    "course": "advanced-quantum-mechanics",
    "module": "decoherence-and-the-quantum-to-classical-transition",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators"
    ],
    "objectives": [
      "Track off-diagonal coherence decay numerically under repeated dephasing",
      "Explain decoherence's role in the quantum-to-classical transition, and what it does and doesn't resolve about measurement",
      "Distinguish decoherence (coherence loss into an unmeasured environment) from wavefunction collapse (an actual measurement outcome)"
    ],
    "related": [
      {
        "slug": "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise",
        "note": "Catalogues where the amplitude-damping and dephasing channels used here come from physically in real devices, and what an engineer can do about each one."
      }
    ],
    "slug": "quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition"
  },
  {
    "title": "Open Quantum Systems & Kraus Operators",
    "description": "Every evolution built so far, time evolution, unitary evolution and measurement of density matrices, was closed-system: no environment. Kraus operators, ρ→ΣₖKₖρKₖ†, extend this to open systems: non-unitary, trace-preserving, and the actual mathematical language of decoherence.",
    "course": "advanced-quantum-mechanics",
    "module": "open-quantum-systems-and-kraus-operators",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-computing/entanglement-and-measurement/evolution-and-measurement-of-density-matrices"
    ],
    "objectives": [
      "Explain why an open (environment-coupled) system cannot evolve purely unitarily",
      "State the Kraus operator sum representation and its trace-preservation condition",
      "Verify numerically that a specific Kraus set is (or isn't) a valid physical channel"
    ],
    "related": [
      {
        "slug": "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
        "note": "See this abstract machinery applied to real hardware decay."
      },
      {
        "slug": "quantum-software/simulating-quantum-systems/noise-simulation",
        "note": "See this abstract machinery applied to real circuit simulation."
      }
    ],
    "slug": "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators"
  },
  {
    "title": "The Path Integral Formulation (Introduction)",
    "description": "Feynman's alternative to the Schrödinger equation: sum a weight exp(-S/ħ) over every possible path, not just the classical one. Verified in Euclidean time: splitting one interval into two and summing over every intermediate position reproduces the exact free-particle propagator to 1 part in 10¹⁵.",
    "course": "advanced-quantum-mechanics",
    "module": "the-path-integral-formulation",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 35,
    "prerequisites": [
      "quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition"
    ],
    "objectives": [
      "State the path integral's central idea: sum over ALL paths, each weighted by exp(-S/ħ) or exp(iS/ħ)",
      "Explain why this course uses Euclidean (imaginary) time rather than real time for its numerical example",
      "Verify the Chapman-Kolmogorov composition law numerically: splitting one time step into two and integrating over the intermediate position reproduces the exact propagator"
    ],
    "slug": "quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation"
  },
  {
    "title": "Addition of Angular Momentum",
    "description": "Two spin-1/2 particles combine into a spin-0 singlet and a spin-1 triplet, and the singlet turns out to be exactly the Bell state |Ψ⁻⟩, verified directly as a J²=0 eigenstate using this platform's own total-angular-momentum operator.",
    "course": "angular-momentum-and-spin",
    "module": "addition-of-angular-momentum",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 35,
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment"
    ],
    "objectives": [
      "Construct the total angular momentum operator for two spin-1/2 particles from the individual spins",
      "Verify the singlet and triplet states as exact J² and Jz eigenstates",
      "Identify the singlet exactly as the Bell state |Ψ⁻⟩ from Quantum Gates & Circuits"
    ],
    "related": [
      {
        "slug": "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement",
        "note": "Builds |Ψ⁻⟩ from a Hadamard and a CNOT. That construction and this lesson's spin-0 singlet produce the same vector, which this lesson verifies by checking it is a J²=0 eigenstate."
      }
    ],
    "slug": "quantum-mechanics/angular-momentum-and-spin/addition-of-angular-momentum"
  },
  {
    "title": "Angular Momentum Commutation Relations",
    "description": "Deriving [Lx,Ly]=iħLz from the classical definition L=r×p and the canonical position-momentum commutators: the algebraic identity every result in this course is built from.",
    "course": "angular-momentum-and-spin",
    "module": "angular-momentum-commutation-relations",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge"
    ],
    "objectives": [
      "Write the orbital angular momentum operators Lx,Ly,Lz in terms of position and momentum operators",
      "Derive [Lx,Ly]=iħLz from the canonical commutators [x,pₓ]=iħ etc., with cross-axis operators commuting",
      "State the cyclic pattern this identity generalizes to, and why it defines the entire angular momentum algebra"
    ],
    "slug": "quantum-mechanics/angular-momentum-and-spin/angular-momentum-commutation-relations"
  },
  {
    "title": "Capstone: From Abstract Algebra to the Hydrogen Atom",
    "description": "A synthesis of this course's six lessons (commutation relations, ladder operators, spherical harmonics, spin, Stern-Gerlach, and addition of angular momentum) and a precise preview of exactly which pieces the next course reuses to solve a real three-dimensional atom.",
    "course": "angular-momentum-and-spin",
    "module": "capstone-from-abstract-algebra-to-the-hydrogen-atom",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/addition-of-angular-momentum"
    ],
    "objectives": [
      "Summarize the logical chain from commutation relations to the quantized angular momentum spectrum",
      "State precisely which of this course's results the Hydrogen Atom course will reuse directly, and how",
      "Explain why solving a 3D central-potential problem separates into a radial equation and an angular part this course already solved"
    ],
    "slug": "quantum-mechanics/angular-momentum-and-spin/capstone-from-abstract-algebra-to-the-hydrogen-atom"
  },
  {
    "title": "Ladder Operators and the Angular Momentum Spectrum",
    "description": "The full quantized spectrum of angular momentum, j(j+1)ħ² total, m from −j to +j in integer steps, derived from the commutation algebra alone, using the same raising/lowering strategy already proven for the harmonic oscillator.",
    "course": "angular-momentum-and-spin",
    "module": "ladder-operators-and-the-angular-momentum-spectrum",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/angular-momentum-commutation-relations"
    ],
    "objectives": [
      "Derive [Jz,J±]=±ħJ± and explain why this makes J± raise/lower Jz's eigenvalue by ħ",
      "Derive the boundedness argument that forces m between −j and +j",
      "State why j must be an integer or half-integer, not any real number"
    ],
    "slug": "quantum-mechanics/angular-momentum-and-spin/ladder-operators-and-the-angular-momentum-spectrum"
  },
  {
    "title": "Orbital Angular Momentum and Spherical Harmonics",
    "description": "Why orbital angular momentum is restricted to integer l specifically: single-valuedness of a position-space wavefunction under a full rotation, plus the explicit Y_l^m functions, verified for orthonormality by direct numerical integration over the sphere.",
    "course": "angular-momentum-and-spin",
    "module": "orbital-angular-momentum-and-spherical-harmonics",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/ladder-operators-and-the-angular-momentum-spectrum"
    ],
    "objectives": [
      "Derive why single-valuedness under φ→φ+2π restricts orbital angular momentum to integer l only",
      "Say why the same argument leaves spin untouched, and what that difference rests on",
      "State the explicit spherical harmonics Y_l^m for l=0,1,2 and their physical meaning",
      "Verify Y_l^m's normalization and orthogonality directly by numerical integration"
    ],
    "slug": "quantum-mechanics/angular-momentum-and-spin/orbital-angular-momentum-and-spherical-harmonics"
  },
  {
    "title": "Spin-1/2 Systems",
    "description": "The qubit engine built in Course 1 already is the j=1/2 representation of the angular momentum algebra: Sx,Sy,Sz equal (ħ/2)X,(ħ/2)Y,(ħ/2)Z entry for entry, and the Bloch sphere point has been a physical spin direction from the start.",
    "course": "angular-momentum-and-spin",
    "module": "spin-one-half-systems",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/orbital-angular-momentum-and-spherical-harmonics"
    ],
    "objectives": [
      "Identify the Pauli spin operators Sx,Sy,Sz as (ħ/2) times the Pauli matrices, the j=1/2 case of Jx,Jy,Jz",
      "Explain why spin-1/2, unlike orbital angular momentum, has no position-space wavefunction restriction",
      "Reinterpret the Bloch sphere (Qubits & Quantum States) as the physical spin direction for a spin-1/2 particle"
    ],
    "related": [
      {
        "slug": "quantum-computing/qubits-and-quantum-states/the-bloch-sphere",
        "note": "This is the same two-level math the Bloch sphere visualizes for a qubit."
      }
    ],
    "slug": "quantum-mechanics/angular-momentum-and-spin/spin-one-half-systems"
  },
  {
    "title": "The Stern-Gerlach Experiment",
    "description": "The 1922 experiment that first showed spin quantization directly: a silver atom beam splitting into two spots rather than a continuous smear, reproduced here as a sequence of qubit measurements along different axes.",
    "course": "angular-momentum-and-spin",
    "module": "the-stern-gerlach-experiment",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/spin-one-half-systems"
    ],
    "objectives": [
      "Explain what the original Stern-Gerlach experiment measured and why two spots (not a continuum) was the surprising result",
      "Compute the outcome probabilities for a sequential Z-then-X-then-Z Stern-Gerlach experiment",
      "Explain why the third measurement doesn't reproduce the first, using measurement's disturbance of incompatible observables"
    ],
    "slug": "quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment"
  },
  {
    "title": "The Variational Method",
    "description": "⟨H⟩ for any normalized trial wavefunction is guaranteed ≥ the true ground energy, a one-line inequality that turns 'guess a wavefunction, then minimize over its parameters' into a rigorous approximation method, checked here by minimizing a Gaussian trial's ⟨H⟩ on the harmonic oscillator to within 0.004% of the exact answer.",
    "course": "approximation-methods",
    "module": "the-variational-method",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/approximation-methods/time-independent-perturbation-theory"
    ],
    "objectives": [
      "State and justify the variational theorem: ⟨ψ_trial|H|ψ_trial⟩ ≥ E₀ for any normalized trial state",
      "Use a parametrized trial wavefunction (a Gaussian of variable width) and minimize its energy expectation numerically",
      "Explain why the variational method needs no small parameter, unlike perturbation theory"
    ],
    "related": [
      {
        "slug": "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits",
        "note": "Takes the inequality proved here, ⟨ψ|H|ψ⟩ ≥ E₀, and minimizes it over an ansatz circuit's parameters rather than a Gaussian's width. Same theorem, same proof, different family of trial states."
      }
    ],
    "slug": "quantum-mechanics/approximation-methods/the-variational-method"
  },
  {
    "title": "The WKB Approximation",
    "description": "The semiclassical quantization condition ∫p(x)dx=(n+½)πħ, applied to the harmonic oscillator, reproduces the exact spectrum Eₙ=(n+½)ħω to within ~0.05%. A route through classical mechanics and de Broglie wavelengths, unrelated to perturbation theory or the variational method, that arrives at nearly the same answer anyway.",
    "course": "approximation-methods",
    "module": "the-wkb-approximation",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/approximation-methods/the-variational-method"
    ],
    "objectives": [
      "State the WKB (Bohr-Sommerfeld) quantization condition and identify the classically allowed region it integrates over",
      "Explain physically why WKB works well for large quantum numbers (the semiclassical/correspondence-principle limit)",
      "Compute WKB-quantized energies numerically and compare them to the exact harmonic oscillator spectrum"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/one-dimensional-systems/solving-the-finite-well-numerically",
        "note": "The identical numerical strategy, bisecting on energy until a transcendental quantization condition is satisfied, reused here for the WKB action integral instead of that lesson's k tan(ka)=κ equation."
      }
    ],
    "slug": "quantum-mechanics/approximation-methods/the-wkb-approximation"
  },
  {
    "title": "Time-Dependent Perturbation Theory",
    "description": "First-order time-dependent perturbation theory gives a closed-form transition probability for a suddenly-switched-on coupling, verified against a direct 2-level Runge-Kutta integration: nearly exact for weak coupling, and dramatically wrong, predicting the wrong long-time probability entirely, once the coupling gets strong.",
    "course": "approximation-methods",
    "module": "time-dependent-perturbation-theory",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/approximation-methods/the-wkb-approximation"
    ],
    "objectives": [
      "State the first-order transition probability formula for a constant perturbation switched on at t=0",
      "Explain physically what each factor (Vfi, ωfi, t) controls in the resulting probability",
      "Identify, from a direct numerical comparison, the regime where first-order perturbation theory breaks down"
    ],
    "related": [
      {
        "slug": "quantum-hardware/control-and-readout/control-electronics",
        "note": "This lesson's exact two-level Rabi solution (the RK4-verified 'exact' curve, not the perturbative one) is reused directly there to compute real microwave pulse durations for single-qubit gates."
      }
    ],
    "slug": "quantum-mechanics/approximation-methods/time-dependent-perturbation-theory"
  },
  {
    "title": "Time-Independent Perturbation Theory",
    "description": "For a Hamiltonian H=H₀+H′ with H′ small, the corrected energies and states can be built order by order from H₀'s own eigenbasis, verified here against an exactly-known result: the quartic anharmonic oscillator's ground-state shift, λ⟨0|x⁴|0⟩=3λ/4.",
    "course": "approximation-methods",
    "module": "time-independent-perturbation-theory",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/fine-structure-introduction"
    ],
    "objectives": [
      "State the first- and second-order energy correction formulas and the first-order state correction formula",
      "Explain why the perturbation matrix H′ must be expressed in H₀'s eigenbasis for these formulas to apply directly",
      "Apply first-order perturbation theory to the quartic anharmonic oscillator and check it against an exact closed-form matrix element"
    ],
    "slug": "quantum-mechanics/approximation-methods/time-independent-perturbation-theory"
  },
  {
    "title": "Classical States and Observables",
    "description": "What classical physics means by a 'state' and an 'observable': phase space, determinism, and epistemic probability, the picture quantum mechanics has to replace, not extend.",
    "course": "classical-to-quantum",
    "module": "classical-states-and-observables",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/mathematical-foundations-challenge"
    ],
    "objectives": [
      "Describe a classical system's state as a point in phase space",
      "Explain why classical observables are ordinary functions of the state",
      "Distinguish epistemic probability, which records ignorance about one definite state, from the different kind of probability quantum mechanics needs"
    ],
    "slug": "quantum-mechanics/classical-to-quantum/classical-states-and-observables"
  },
  {
    "title": "Expectation Values and Uncertainty",
    "description": "A full derivation of the generalized uncertainty relation ΔA·ΔB ≥ ½|⟨[A,B]⟩| from Cauchy-Schwarz: the precise, general reason two observables can fail to both be definite at once.",
    "course": "classical-to-quantum",
    "module": "expectation-values-and-uncertainty",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics"
    ],
    "objectives": [
      "Compute the expectation value and uncertainty (standard deviation) of an observable in a given state",
      "Derive the generalized uncertainty relation from the Cauchy-Schwarz inequality",
      "Explain the uncertainty principle as a statement about commutators, not a measurement-disturbance story"
    ],
    "slug": "quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty"
  },
  {
    "title": "From Classical to Quantum Probability",
    "description": "The double-slit experiment, worked with real numbers: why no probability distribution over a hidden definite path can reproduce quantum interference, and what has to replace it.",
    "course": "classical-to-quantum",
    "module": "from-classical-to-quantum-probability",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/classical-states-and-observables"
    ],
    "objectives": [
      "State the classical addition rule for mutually exclusive probabilities",
      "Show, with a worked calculation, that combining amplitudes before squaring can violate that rule",
      "Explain why this rules out any hidden-definite-path explanation of interference"
    ],
    "slug": "quantum-mechanics/classical-to-quantum/from-classical-to-quantum-probability"
  },
  {
    "title": "From Postulates to Quantum Computing",
    "description": "A synthesis capstone connecting every idea in this course directly to qubits, gates, and circuits: a qubit is simply the smallest nontrivial example of everything just derived.",
    "course": "classical-to-quantum",
    "module": "from-postulates-to-quantum-computing",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/superposition-interference-and-phase"
    ],
    "objectives": [
      "Identify a qubit as a 2-dimensional Hilbert space with the same four postulates as any other quantum system",
      "Map each result from this course onto its counterpart in the Quantum Computing track",
      "Solve synthesis problems that combine tools from more than one lesson in this course"
    ],
    "slug": "quantum-mechanics/classical-to-quantum/from-postulates-to-quantum-computing"
  },
  {
    "title": "Position and Momentum",
    "description": "The canonical commutation relation [x,p]=iℏ, the Heisenberg uncertainty bound it implies via the general relation already derived, and how it connects directly to the harmonic oscillator's ladder algebra.",
    "course": "classical-to-quantum",
    "module": "position-and-momentum",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator"
    ],
    "objectives": [
      "State the canonical commutation relation [x,p] = iℏ",
      "Derive the Heisenberg uncertainty bound ΔxΔp ≥ ℏ/2 from the general relation proved earlier in this course",
      "Verify [x,p]=iℏ directly from the harmonic oscillator's ladder-operator commutator"
    ],
    "slug": "quantum-mechanics/classical-to-quantum/position-and-momentum"
  },
  {
    "title": "Stationary States",
    "description": "Why energy eigenstates never change their measurement statistics over time, and why the expectation value of any Hamiltonian is exactly conserved for every state, not just its eigenstates, both proved directly from the time evolution operator.",
    "course": "classical-to-quantum",
    "module": "stationary-states",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation"
    ],
    "objectives": [
      "Prove that an energy eigenstate evolves only by an overall phase",
      "Explain why that makes every measurement probability time-independent for such a state",
      "Prove that ⟨H⟩ is exactly conserved for any state, not only eigenstates of H"
    ],
    "slug": "quantum-mechanics/classical-to-quantum/stationary-states"
  },
  {
    "title": "Superposition, Interference, and Phase",
    "description": "A full derivation showing interference is basis-dependent: a relative phase invisible to a measurement in one basis becomes a continuously-varying probability in another, unifying the double-slit picture with the precession result from Time Evolution.",
    "course": "classical-to-quantum",
    "module": "superposition-interference-and-phase",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/position-and-momentum"
    ],
    "objectives": [
      "State the superposition principle as a direct consequence of Postulate 1",
      "Derive that relative phase is invisible when measuring in a superposition's own basis, but visible when measuring in a different one",
      "Recognize the same cos²(φ/2)-type formula appearing in both interference and time-evolution contexts"
    ],
    "slug": "quantum-mechanics/classical-to-quantum/superposition-interference-and-phase"
  },
  {
    "title": "The Postulates of Quantum Mechanics",
    "description": "The complete, compact statement of quantum theory's mathematical content: states, observables, measurement, and dynamics, with each postulate physically motivated by what the last three lessons showed experiment requires.",
    "course": "classical-to-quantum",
    "module": "the-postulates-of-quantum-mechanics",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/why-complex-amplitudes"
    ],
    "objectives": [
      "State all four postulates of quantum mechanics",
      "Explain the physical motivation behind each one, not just its mathematical statement",
      "Apply the postulates to compute measurement probabilities for a concrete two-level system"
    ],
    "related": [
      {
        "slug": "quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors",
        "note": "Postulate 1 (state = normalized vector), applied to the smallest concrete case: a qubit's 2-dimensional Hilbert space, with the same interference argument worked out again."
      }
    ],
    "slug": "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics"
  },
  {
    "title": "The Quantum Harmonic Oscillator",
    "description": "The most reused solvable system in quantum mechanics, built entirely from ladder operators: a full derivation of the integer, equally-spaced energy spectrum, with no calculus anywhere.",
    "course": "classical-to-quantum",
    "module": "the-quantum-harmonic-oscillator",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/stationary-states"
    ],
    "objectives": [
      "State the canonical commutation relation [a, a†] = 1 and derive the number operator's key algebraic identities",
      "Prove the harmonic oscillator's energy spectrum is a non-negative integer ladder, using only algebra",
      "Say what zero-point energy is and name one laboratory consequence of it",
      "Compute ladder-operator actions using the platform's truncated matrix representation"
    ],
    "related": [
      {
        "slug": "quantum-hardware/control-and-readout/cryogenic-systems",
        "note": "Supplies the ħω level spacing that the Bose-Einstein occupation formula there needs, which is how that lesson computes why a real qubit must be cooled to millikelvin temperatures to stay in its ground state."
      }
    ],
    "slug": "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator"
  },
  {
    "title": "Time Evolution and the Schrödinger Equation",
    "description": "Deriving what unitary evolution must look like: the Hamiltonian, the Schrödinger equation, and a worked two-level example computed with the same rotation machinery already built for the Bloch sphere.",
    "course": "classical-to-quantum",
    "module": "time-evolution-and-the-schrodinger-equation",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty"
    ],
    "objectives": [
      "Derive that the generator of unitary time evolution must be Hermitian",
      "State the time-dependent Schrödinger equation and derive it from the evolution operator U(t) = e^(-iHt/ℏ)",
      "Compute a concrete two-level time evolution using the existing quantum engine"
    ],
    "slug": "quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation"
  },
  {
    "title": "Why Complex Amplitudes?",
    "description": "Signed real numbers can only ever interfere fully constructively or fully destructively. Why the continuum of partial interference seen in experiment specifically requires a complex phase.",
    "course": "classical-to-quantum",
    "module": "why-complex-amplitudes",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/from-classical-to-quantum-probability"
    ],
    "objectives": [
      "Explain why a signed real amplitude only supports two interference outcomes",
      "Explain what a continuous phase provides that a sign bit cannot",
      "Connect the phase in an amplitude to the polar-form phase from the Mathematical Foundations course"
    ],
    "slug": "quantum-mechanics/classical-to-quantum/why-complex-amplitudes"
  },
  {
    "title": "Bosons & Fermions",
    "description": "symmetrize(a,b) and antisymmetrize(a,b) build the actual +1 and -1 exchange eigenstates from any two single-particle states, checked here against exchangeParticles rather than taken on faith.",
    "course": "identical-particles",
    "module": "bosons-and-fermions",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-mechanics/identical-particles/indistinguishability"
    ],
    "objectives": [
      "Construct the normalized symmetric and antisymmetric combinations of two single-particle states",
      "Verify numerically that these combinations are genuine +1 and -1 eigenstates of the exchange operator",
      "State the spin-statistics connection (integer spin = boson, half-integer spin = fermion) as an experimental fact this course doesn't derive"
    ],
    "slug": "quantum-mechanics/identical-particles/bosons-and-fermions"
  },
  {
    "title": "Indistinguishability",
    "description": "Two identical quantum particles cannot be tracked as 'particle 1' and 'particle 2': swapping their labels must leave every physical prediction unchanged, which forces the combined wavefunction to be either symmetric or antisymmetric under exchange.",
    "course": "identical-particles",
    "module": "indistinguishability",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/approximation-methods/time-dependent-perturbation-theory"
    ],
    "objectives": [
      "Explain why quantum indistinguishability is stronger than classical 'looks the same'",
      "Define the exchange operator P₁₂ and show its eigenvalues must be ±1",
      "Build a two-particle product state and confirm it is (in general) neither a +1 nor a -1 exchange eigenstate"
    ],
    "slug": "quantum-mechanics/identical-particles/indistinguishability"
  },
  {
    "title": "Multi-Electron Atoms (Introduction)",
    "description": "Combining hydrogen's already-derived n² orbital degeneracy with exclusion's 2-electrons-per-orbital (spin up/down) limit gives each shell a maximum capacity of 2n² electrons, explaining, without any new machinery, why the periodic table's shells fill the way they do.",
    "course": "identical-particles",
    "module": "multi-electron-atoms-introduction",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/identical-particles/the-pauli-exclusion-principle"
    ],
    "objectives": [
      "Derive the 2n² maximum shell capacity by combining hydrogen's n² orbital count with exclusion's spin-up/spin-down limit per orbital",
      "State why exact hydrogen-like orbitals are only an approximation for multi-electron atoms, and name the missing physics (electron-electron repulsion)",
      "Read off a simple electron configuration (e.g. for carbon or neon) using the shell-filling picture"
    ],
    "slug": "quantum-mechanics/identical-particles/multi-electron-atoms-introduction"
  },
  {
    "title": "The Pauli Exclusion Principle",
    "description": "No two identical fermions can occupy the same single-particle state. This isn't an extra postulate, but a direct algebraic consequence of antisymmetrization: antisymmetrize(a,a) is exactly the zero vector, which this platform's normalizeVector correctly refuses to treat as a state.",
    "course": "identical-particles",
    "module": "the-pauli-exclusion-principle",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/identical-particles/bosons-and-fermions"
    ],
    "objectives": [
      "State the Pauli exclusion principle and derive it directly from the antisymmetrization formula",
      "Explain why this platform's engine throwing on antisymmetrize(a,a) is the correct behavior, not a limitation",
      "Distinguish exclusion for fermions occupying the exact same single-particle state from any restriction on bosons"
    ],
    "slug": "quantum-mechanics/identical-particles/the-pauli-exclusion-principle"
  },
  {
    "title": "The Bra-Ket Formalism",
    "description": "Dirac's notation for general vector spaces: kets, bras, outer products as operators, the completeness relation, and operator matrix elements, the notation every remaining lesson in this course is written in.",
    "course": "mathematical-foundations",
    "module": "bra-ket-formalism",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality"
    ],
    "objectives": [
      "Translate between column-vector and bra-ket notation for vectors, inner products, and outer products",
      "Derive and apply the completeness relation for an orthonormal basis",
      "Compute operator matrix elements using bra-ket sandwiches"
    ],
    "related": [
      {
        "slug": "quantum-computing/qubits-and-quantum-states/dirac-notation",
        "note": "The same bra-ket notation and inner product, applied specifically to qubits, before this lesson generalizes it and adds outer products."
      }
    ],
    "slug": "quantum-mechanics/mathematical-foundations/bra-ket-formalism"
  },
  {
    "title": "Complex Numbers for Physics",
    "description": "Why physics needs numbers beyond the real line, and the full toolkit (conjugation, modulus, polar form, Euler's formula derived from first principles) that everything else in this course builds on.",
    "course": "mathematical-foundations",
    "module": "complex-numbers-for-physics",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 40,
    "prerequisites": [],
    "objectives": [
      "Perform arithmetic with complex numbers in rectangular and polar form",
      "Derive Euler's formula from the power series for e^x, cos θ, and sin θ (all three stated in this lesson, with no calculus required) and use it to multiply complex numbers by adding phases",
      "Explain, at least informally, why physics needs complex numbers rather than treating them as a bookkeeping trick"
    ],
    "related": [
      {
        "slug": "quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics",
        "note": "The same arithmetic (conjugation, modulus, Euler's formula) specialized to qubit amplitudes and phase gates."
      }
    ],
    "slug": "quantum-mechanics/mathematical-foundations/complex-numbers-for-physics"
  },
  {
    "title": "Eigenvalues and Eigenvectors",
    "description": "The vectors an operator only rescales, not rotates: the characteristic equation, worked eigenvalue problems for the Pauli matrices, and the trace/determinant shortcuts.",
    "course": "mathematical-foundations",
    "module": "eigenvalues-and-eigenvectors",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/linear-operators"
    ],
    "objectives": [
      "Derive and use the characteristic equation to find eigenvalues",
      "Find eigenvectors for a given eigenvalue and verify Av = λv directly",
      "Use the trace/determinant shortcut to check eigenvalue calculations",
      "Diagonalize a 2x2 operator and read its action off the eigenbasis"
    ],
    "slug": "quantum-mechanics/mathematical-foundations/eigenvalues-and-eigenvectors"
  },
  {
    "title": "Hermitian Operators",
    "description": "Why physical observables are represented by self-adjoint operators: full derivations that their eigenvalues are real and their eigenvectors orthogonal, plus expectation values.",
    "course": "mathematical-foundations",
    "module": "hermitian-operators",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/eigenvalues-and-eigenvectors"
    ],
    "objectives": [
      "Compute the adjoint of an operator and determine whether it is Hermitian",
      "Derive that Hermitian operators have real eigenvalues and orthogonal eigenvectors for distinct eigenvalues",
      "State the spectral theorem and write a Hermitian operator as a weighted sum of projectors",
      "Compute expectation values and connect them to the spectral decomposition"
    ],
    "slug": "quantum-mechanics/mathematical-foundations/hermitian-operators"
  },
  {
    "title": "Inner Products and Orthogonality",
    "description": "Adding geometry to a vector space: the conjugate-linear inner product, norm and normalization, orthogonality, and a full derivation of the Cauchy-Schwarz inequality.",
    "course": "mathematical-foundations",
    "module": "inner-products-and-orthogonality",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/vector-spaces"
    ],
    "objectives": [
      "State the inner product axioms for a complex vector space and explain why conjugation is required",
      "Compute norms, check orthogonality, and normalize vectors",
      "Derive and apply the Cauchy-Schwarz inequality"
    ],
    "related": [
      {
        "slug": "quantum-computing/qubits-and-quantum-states/measurement-and-probability",
        "note": "The general Born rule P(e_i) = |⟨e_i|ψ⟩|² is built directly from this lesson's inner product; orthogonality there is exactly 'perfectly distinguishable by one measurement' here."
      }
    ],
    "slug": "quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality"
  },
  {
    "title": "Linear Operators",
    "description": "Linear maps, their matrix representation, and a derivation of matrix multiplication from the completeness relation rather than as an assumed rule.",
    "course": "mathematical-foundations",
    "module": "linear-operators",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/bra-ket-formalism"
    ],
    "objectives": [
      "Determine whether a given map is linear",
      "Represent an operator as a matrix relative to a basis, and derive the composition rule from the completeness relation",
      "Determine whether a matrix is invertible"
    ],
    "related": [
      {
        "slug": "quantum-computing/qubits-and-quantum-states/quantum-gates",
        "note": "Every quantum gate is an instance of this lesson's object: a linear operator, represented as a matrix acting on a state vector."
      }
    ],
    "slug": "quantum-mechanics/mathematical-foundations/linear-operators"
  },
  {
    "title": "Mathematical Foundations Challenge",
    "description": "A synthesis capstone, no new mathematics, just problems and worked examples that require combining tools from more than one earlier lesson, and a recap map of how everything connects.",
    "course": "mathematical-foundations",
    "module": "mathematical-foundations-challenge",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 40,
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/probability-and-quantum-states"
    ],
    "objectives": [
      "Combine results from at least two earlier lessons to solve a single problem",
      "Recall which lesson each core tool (trace/determinant, Hermiticity, unitarity, the Born rule) came from and why",
      "Identify what mathematics this course deliberately left for later courses"
    ],
    "slug": "quantum-mechanics/mathematical-foundations/mathematical-foundations-challenge"
  },
  {
    "title": "Probability and Quantum States",
    "description": "The postulates that connect all of this course's linear algebra to physical predictions: states as unit vectors, observables as Hermitian operators, the Born rule, and expectation values, with every consistency check derived rather than assumed.",
    "course": "mathematical-foundations",
    "module": "probability-and-quantum-states",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/tensor-products-and-composite-systems"
    ],
    "objectives": [
      "State the postulates connecting quantum states, observables, and measurement outcomes",
      "Compute measurement probabilities and expectation values from a state and a Hermitian observable, and verify they agree with the direct sandwich formula",
      "Explain why an overall phase never affects any measurement prediction"
    ],
    "slug": "quantum-mechanics/mathematical-foundations/probability-and-quantum-states"
  },
  {
    "title": "Tensor Products and Composite Systems",
    "description": "How the state space of two systems combines into one: the construction for general (not just equal) dimensions, and a dimension-counting argument for why entanglement is the generic case.",
    "course": "mathematical-foundations",
    "module": "tensor-products-and-composite-systems",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/unitary-operators"
    ],
    "objectives": [
      "Construct the tensor product of two vectors of any dimensions and state the resulting space's dimension",
      "Explain, via dimension counting, why not every vector in a composite space is a simple product",
      "Represent an operator acting on only one subsystem as a tensor product with the identity"
    ],
    "related": [
      {
        "slug": "quantum-computing/quantum-gates-and-circuits/tensor-products",
        "note": "The qubit-specific case of this exact construction, worked out first for two-dimensional factors before this lesson generalizes it."
      }
    ],
    "slug": "quantum-mechanics/mathematical-foundations/tensor-products-and-composite-systems"
  },
  {
    "title": "Unitary Operators",
    "description": "The operators that preserve inner products and norms: why every quantum gate and every evolution in time has to be one, derived from the adjoint rather than asserted.",
    "course": "mathematical-foundations",
    "module": "unitary-operators",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/hermitian-operators"
    ],
    "objectives": [
      "Determine whether an operator is unitary using the condition U†U = I",
      "Derive that unitary operators preserve inner products and norms, and that their eigenvalues have modulus 1",
      "Distinguish Hermitian from unitary operators, including examples that are one, the other, both, or neither"
    ],
    "related": [
      {
        "slug": "quantum-computing/quantum-algorithms-i/quantum-phase-estimation",
        "note": "That algorithm's entire purpose, reading out the phase θ, exists only because this lesson proves a unitary's eigenvalues always have modulus 1, so each one is e^(iθ), a pure phase and nothing else."
      }
    ],
    "slug": "quantum-mechanics/mathematical-foundations/unitary-operators"
  },
  {
    "title": "Vector Spaces",
    "description": "Vectors as anything you can add and scale: axioms, span, linear independence, basis, dimension, change of basis, and the complex vector spaces quantum mechanics is built on.",
    "course": "mathematical-foundations",
    "module": "vector-spaces",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/complex-numbers-for-physics"
    ],
    "objectives": [
      "State the vector space axioms and check whether a given set with given operations satisfies them",
      "Determine whether a set of vectors is linearly independent, and find a basis and dimension",
      "Explain why the complex dimension of a space and its real dimension can differ"
    ],
    "slug": "quantum-mechanics/mathematical-foundations/vector-spaces"
  },
  {
    "title": "One-Dimensional Systems Challenge",
    "description": "A synthesis capstone connecting the finite well's bound states to the step and barrier's scattering states, and to every 1D potential the two courses have now solved, bound or unbound, exactly or numerically.",
    "course": "one-dimensional-systems",
    "module": "one-dimensional-systems-challenge",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier"
    ],
    "objectives": [
      "Classify every 1D potential covered across Wave Mechanics and this course as bound, scattering, or both",
      "Solve synthesis problems connecting the finite well's numerics to the barrier's closed-form scattering",
      "Identify what a truly 3-dimensional system would need beyond everything built so far"
    ],
    "slug": "quantum-mechanics/one-dimensional-systems/one-dimensional-systems-challenge"
  },
  {
    "title": "Resonant Transmission Through a Barrier",
    "description": "Extending the step-potential result to a full barrier reveals something the step alone couldn't: special energies where the barrier becomes perfectly transparent, on the same interference mechanism as anti-reflective optical coatings.",
    "course": "one-dimensional-systems",
    "module": "resonant-transmission-through-a-barrier",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 22,
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential",
      "quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier"
    ],
    "objectives": [
      "State the closed-form transmission probability for over-the-barrier scattering (E > barrier height)",
      "Derive the resonance condition where transmission is exactly 1",
      "Distinguish this over-the-barrier regime from the E < barrier height tunneling regime already covered"
    ],
    "slug": "quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier"
  },
  {
    "title": "Scattering Off a Step Potential",
    "description": "A particle with more than enough energy to classically cross a step still partially reflects, quantum mechanically. Derived in closed form from plane-wave boundary matching, with probability conservation checked algebraically.",
    "course": "one-dimensional-systems",
    "module": "scattering-off-a-step-potential",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 22,
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/free-particle-wave-packets"
    ],
    "objectives": [
      "Set up and solve the boundary-matching equations for a particle scattering off a potential step with E > step height",
      "Derive closed-form reflection and transmission probabilities and verify R + T = 1 algebraically",
      "Explain why quantum scattering off a step differs qualitatively from the classical prediction"
    ],
    "slug": "quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential"
  },
  {
    "title": "Solving the Finite Well Numerically",
    "description": "The graphical method for a transcendental equation with no closed form, made precise with bisection: a real, tested numerical root-finder, applied to a specific worked well and cross-checked against the infinite-well limit.",
    "course": "one-dimensional-systems",
    "module": "solving-the-finite-well-numerically",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-mechanics/one-dimensional-systems/the-finite-square-well-setting-up-the-equation"
    ],
    "objectives": [
      "Describe the graphical method for solving a transcendental quantization condition",
      "Use bisection to numerically find a specific finite well's ground-state energy",
      "Compare a finite well's ground state to the infinite well's, quantifying how much shallower it sits"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/approximation-methods/the-wkb-approximation",
        "note": "The same bisection-on-energy root-finding strategy this lesson uses on k tan(ka)=κ is reused there to solve WKB's action-integral quantization condition."
      }
    ],
    "slug": "quantum-mechanics/one-dimensional-systems/solving-the-finite-well-numerically"
  },
  {
    "title": "The Finite Square Well: Setting Up the Equation",
    "description": "Unlike the infinite well's hard walls, a finite-depth well lets the wavefunction leak into the classically forbidden region. Deriving the resulting transcendental quantization condition from boundary matching alone.",
    "course": "one-dimensional-systems",
    "module": "the-finite-square-well-setting-up-the-equation",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 24,
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/the-infinite-square-well",
      "quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier"
    ],
    "objectives": [
      "Write the three-region solution for a finite square well's bound states",
      "Apply continuity of psi and psi' to derive the even-parity transcendental quantization condition",
      "Explain why this equation has no closed-form solution, unlike the infinite well's"
    ],
    "slug": "quantum-mechanics/one-dimensional-systems/the-finite-square-well-setting-up-the-equation"
  },
  {
    "title": "Complete Sets of Commuting Observables",
    "description": "When one observable's eigenvalue doesn't fully pin down a state, a second compatible observable can resolve the ambiguity, built here as a concrete, computable construction rather than a name.",
    "course": "operators-observables-measurement",
    "module": "complete-sets-of-commuting-observables",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/simultaneous-eigenstates-and-compatible-observables"
    ],
    "objectives": [
      "Explain why a degenerate eigenvalue doesn't fully specify a unique basis state",
      "Construct a second observable, compatible with the first, that resolves a given degeneracy",
      "State what it means for a set of mutually commuting observables to be 'complete'"
    ],
    "slug": "quantum-mechanics/operators-observables-measurement/complete-sets-of-commuting-observables"
  },
  {
    "title": "Degeneracy in Practice: A Worked System",
    "description": "Every idea from this course applied to one familiar system, a Bell state, using two-qubit observables to build a complete set of commuting observables and watch it resolve a degeneracy.",
    "course": "operators-observables-measurement",
    "module": "degeneracy-in-practice",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 22,
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/sequential-measurements-and-incompatibility",
      "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement"
    ],
    "objectives": [
      "Construct a two-observable CSCO on a two-qubit system from single-qubit Pauli operators",
      "Compute a degenerate measurement probability and collapsed state for an entangled input",
      "Connect the collapse result directly to the Bell state's known perfect correlation"
    ],
    "slug": "quantum-mechanics/operators-observables-measurement/degeneracy-in-practice"
  },
  {
    "title": "Operators, Observables & Measurement Challenge",
    "description": "A synthesis capstone connecting this course's generalized theory back to the specific postulates it generalizes, and forward to where degeneracy and compatible observables reappear in more advanced systems.",
    "course": "operators-observables-measurement",
    "module": "operators-observables-measurement-challenge",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/degeneracy-in-practice"
    ],
    "objectives": [
      "Map every generalized result from this course onto the specific postulate it generalizes",
      "Solve synthesis problems combining spectral decomposition, compatibility, and the measurement postulate",
      "Identify what remains open for future courses that need degenerate spectra"
    ],
    "slug": "quantum-mechanics/operators-observables-measurement/operators-observables-measurement-challenge"
  },
  {
    "title": "Sequential Measurements and Incompatibility",
    "description": "A fully worked, numeric measure-then-measure-then-measure-again sequence on a single qubit, tracking step by step how an incompatible measurement destroys an earlier certainty.",
    "course": "operators-observables-measurement",
    "module": "sequential-measurements-and-incompatibility",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 18,
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized"
    ],
    "objectives": [
      "Track a state through a sequence of three measurements of two incompatible observables",
      "Show explicitly how an intervening incompatible measurement destroys a prior certainty",
      "Connect the numeric result back to the [X,Z] != 0 result from earlier in this course"
    ],
    "slug": "quantum-mechanics/operators-observables-measurement/sequential-measurements-and-incompatibility"
  },
  {
    "title": "Simultaneous Eigenstates and Compatible Observables",
    "description": "Proving, both directions, that two Hermitian operators share a complete eigenbasis if and only if they commute: the deeper fact underneath the last course's zero-uncertainty-tradeoff result for commuting observables.",
    "course": "operators-observables-measurement",
    "module": "simultaneous-eigenstates-and-compatible-observables",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 24,
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/spectral-decomposition-and-degeneracy"
    ],
    "objectives": [
      "Prove that a shared eigenbasis implies the two operators commute",
      "Prove that commuting operators share an eigenbasis, for the nondegenerate case",
      "Determine directly, from a commutator calculation, whether two given observables are simultaneously measurable"
    ],
    "related": [
      {
        "slug": "quantum-computing/error-correction-and-fault-tolerance/stabilizer-formalism-basics",
        "note": "A stabilizer code's states are exactly simultaneous eigenstates of a set of commuting Pauli operators, this lesson's theorem applied to error correction."
      }
    ],
    "slug": "quantum-mechanics/operators-observables-measurement/simultaneous-eigenstates-and-compatible-observables"
  },
  {
    "title": "Spectral Decomposition and Degeneracy",
    "description": "Turning the spectral theorem's notation into real, provable machinery: projection operators, their defining properties, and what happens when an eigenvalue has more than one eigenvector.",
    "course": "operators-observables-measurement",
    "module": "spectral-decomposition-and-degeneracy",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 24,
    "prerequisites": [
      "quantum-mechanics/mathematical-foundations/hermitian-operators"
    ],
    "objectives": [
      "Define a projection operator and prove its two defining properties: idempotence and completeness",
      "Write any Hermitian operator's spectral decomposition using projectors, including onto degenerate eigenspaces",
      "Compute the projector onto a multi-dimensional degenerate eigenspace and verify it against the engine"
    ],
    "slug": "quantum-mechanics/operators-observables-measurement/spectral-decomposition-and-degeneracy"
  },
  {
    "title": "The Energy-Time Uncertainty Relation",
    "description": "Deriving Delta E * Delta t >= hbar/2 honestly. Time is not an operator, so this is not a special case of the general commutator bound; it follows instead from Ehrenfest's theorem applied to an arbitrary observable.",
    "course": "operators-observables-measurement",
    "module": "the-energy-time-uncertainty-relation",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 24,
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty",
      "quantum-mechanics/wave-mechanics/wave-packet-dynamics-and-dispersion"
    ],
    "objectives": [
      "Explain why time cannot appear in the general uncertainty relation the way position and momentum do",
      "Define a characteristic evolution timescale for an arbitrary observable and derive the energy-time bound from it",
      "Show that a stationary state's infinite characteristic timescale is consistent with its zero energy uncertainty"
    ],
    "slug": "quantum-mechanics/operators-observables-measurement/the-energy-time-uncertainty-relation"
  },
  {
    "title": "The Measurement Postulate, Generalized",
    "description": "Restating Born's rule with projectors instead of raw coefficients: correct whether or not the measured eigenvalue is degenerate, and reducing exactly to the familiar |c_i|^2 form when it isn't.",
    "course": "operators-observables-measurement",
    "module": "the-measurement-postulate-generalized",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 22,
    "prerequisites": [
      "quantum-mechanics/operators-observables-measurement/complete-sets-of-commuting-observables",
      "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics"
    ],
    "objectives": [
      "State the measurement postulate using projectors and show it reduces to |c_i|^2 in the nondegenerate case",
      "Compute a measurement probability and the post-measurement collapsed state for a degenerate eigenvalue",
      "Explain why collapse is described by the projector rather than by picking one eigenvector out of the degenerate subspace"
    ],
    "related": [
      {
        "slug": "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code",
        "note": "Syndrome extraction there is a real, worked example of this lesson's degenerate projective measurement: measuring the ancilla parities collapses onto a syndrome subspace without ever touching the encoded α,β."
      }
    ],
    "slug": "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized"
  },
  {
    "title": "Central Potentials",
    "description": "Proving [H,L²]=[H,Lz]=0 for any potential depending only on r: the single fact that lets hydrogen's angular part reuse Angular Momentum & Spin's spherical harmonics without any new derivation.",
    "course": "the-hydrogen-atom",
    "module": "central-potentials",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/angular-momentum-and-spin/capstone-from-abstract-algebra-to-the-hydrogen-atom"
    ],
    "objectives": [
      "Define a central potential and identify hydrogen's Coulomb potential as one",
      "Explain why [H,L²]=[H,Lz]=0 for any central potential, at the level of what depends on angle vs. radius",
      "State why this lets energy eigenstates be chosen as simultaneous L², Lz eigenstates"
    ],
    "slug": "quantum-mechanics/the-hydrogen-atom/central-potentials"
  },
  {
    "title": "Fine Structure (Introduction)",
    "description": "A conceptual capstone: this course's Eₙ=−13.6 eV/n² is the non-relativistic, spin-free answer. Fine structure (spin-orbit coupling and relativistic corrections) splits the l-degeneracy this course relied on, at the ~10⁻⁴ eV scale. Honest about what was and wasn't derived.",
    "course": "the-hydrogen-atom",
    "module": "fine-structure-introduction",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers"
    ],
    "objectives": [
      "State what fine structure is (spin-orbit coupling + relativistic kinetic correction) at a qualitative level",
      "Explain which of this course's specific results (e.g. exact l-independence of Eₙ) fine structure breaks, and why"
    ],
    "slug": "quantum-mechanics/the-hydrogen-atom/fine-structure-introduction"
  },
  {
    "title": "Hydrogen Energy Levels",
    "description": "Solving the radial equation for the Coulomb potential gives Eₙ=−13.6 eV/n², quantized by the bound-state boundary condition alone, independent of l, and reproduced exactly by the course engine's verified hydrogenEnergyLevel() function.",
    "course": "the-hydrogen-atom",
    "module": "hydrogen-energy-levels",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/the-radial-equation"
    ],
    "objectives": [
      "State the hydrogen energy formula Eₙ=−13.6 eV/n² and identify where the constant 13.6 eV (one Rydberg) comes from physically",
      "Explain why the energy depends only on n, not on l or m, for the pure Coulomb potential specifically",
      "Connect the n=1 ground state energy to the reference scales already used in Wave Mechanics and the Bohr model"
    ],
    "related": [
      {
        "slug": "quantum-hardware/physical-qubit-platforms/neutral-atoms",
        "note": "Neutral-atom qubits' 'Rydberg blockade' gate excites an atom into the high-n hydrogen-like states this lesson derives; Eₙ=-13.6 eV/n² is why large n gives such an enormous, strongly-interacting orbit."
      }
    ],
    "slug": "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels"
  },
  {
    "title": "Orbitals & Quantum Numbers",
    "description": "Combining the verified radial1s/radial2s/radial2p functions with Angular Momentum & Spin's Yₗᵐ builds the actual full 3D wavefunctions ψₙₗₘ=Rₙₗ(r)Yₗᵐ(θ,φ), the real 'orbitals' behind chemistry's s/p/d shorthand.",
    "course": "the-hydrogen-atom",
    "module": "orbitals-and-quantum-numbers",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels"
    ],
    "objectives": [
      "State the three quantum numbers (n, l, m) that label a hydrogen orbital and their allowed ranges",
      "Assemble ψₙₗₘ(r,θ,φ)=Rₙₗ(r)Yₗᵐ(θ,φ) from the platform's already-verified radial and angular pieces",
      "Connect the most-probable-radius result to the classical Bohr model's radius, and explain what it does and doesn't mean"
    ],
    "slug": "quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers"
  },
  {
    "title": "The Radial Equation",
    "description": "Substituting ψ=R(r)Yₗᵐ(θ,φ) into the full 3D Schrödinger equation, then u(r)=rR(r), reduces hydrogen to a single 1D-Schrödinger-equation-shaped ODE, with a centrifugal term reusing exactly the effective-potential idea from One-Dimensional Systems.",
    "course": "the-hydrogen-atom",
    "module": "the-radial-equation",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/the-hydrogen-atom/central-potentials"
    ],
    "objectives": [
      "Substitute the separated ansatz ψ=R(r)Yₗᵐ into the 3D Schrödinger equation and isolate the radial ODE",
      "Derive the centrifugal term l(l+1)ħ²/2mr² and identify it as an effective potential addition",
      "Use the substitution u(r)=rR(r) to put the radial equation into exactly the 1D Schrödinger equation's form"
    ],
    "slug": "quantum-mechanics/the-hydrogen-atom/the-radial-equation"
  },
  {
    "title": "Expectation Values in Position Space",
    "description": "Turning the abstract ⟨A⟩ = ⟨ψ|A|ψ⟩ from the last course into concrete integrals over ψ(x), and deriving position variance and the shape of the uncertainty it measures.",
    "course": "wave-mechanics",
    "module": "expectation-values-in-position-space",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/probability-density-and-normalization"
    ],
    "objectives": [
      "Derive ⟨x⟩ and ⟨x²⟩ as integrals from the abstract expectation-value postulate",
      "Compute position variance and connect it to the engine's variancePosition() implementation",
      "Generalize to ⟨f(x)⟩ for an arbitrary function of position"
    ],
    "slug": "quantum-mechanics/wave-mechanics/expectation-values-in-position-space"
  },
  {
    "title": "Free-Particle Wave Packets",
    "description": "Why a single plane wave cannot represent a real, localized particle, and how superposing a narrow band of momenta builds a normalizable Gaussian wave packet with a well-defined group velocity.",
    "course": "wave-mechanics",
    "module": "free-particle-wave-packets",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 22,
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/the-schrodinger-equation-in-position-space"
    ],
    "objectives": [
      "Explain why a single plane wave is not normalizable and cannot represent a physical free particle",
      "Construct a Gaussian wave packet as a superposition of plane waves with a spread of momenta",
      "Derive the group velocity v = p0/m and identify it in the platform's live simulator"
    ],
    "slug": "quantum-mechanics/wave-mechanics/free-particle-wave-packets"
  },
  {
    "title": "Momentum Space and the Fourier Transform",
    "description": "The momentum-space wavefunction phi(k) as a basis change, of the same kind as the finite-dimensional basis changes from Mathematical Foundations, computed here by a real, tested numerical Fourier transform rather than a black box.",
    "course": "wave-mechanics",
    "module": "momentum-space-and-the-fourier-transform",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 26,
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/the-position-and-momentum-operators"
    ],
    "objectives": [
      "Explain phi(k) as psi(x) expressed in the momentum eigenbasis, via the same basis-change logic as finite dimensions",
      "State the Fourier transform pair connecting psi(x) and phi(k), including why the normalization constant makes it norm-preserving",
      "Trace how narrowing psi(x) necessarily widens phi(k), and why the Gaussian is the shape that saturates that trade-off",
      "Use the Wavefunction Explorer's momentum-space view to connect a wavefunction's spatial shape to its momentum content directly"
    ],
    "related": [
      {
        "slug": "quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform",
        "note": "The same unitary Fourier-transform basis change, discretized: the continuous kernel e^(ikx) here becomes e^(2πijk/N) there, amplitudes on a continuum versus amplitudes on qubits."
      }
    ],
    "slug": "quantum-mechanics/wave-mechanics/momentum-space-and-the-fourier-transform"
  },
  {
    "title": "Numerically Evolving Quantum States",
    "description": "How the Wavefunction Explorer integrates the Schrödinger equation forward in time: the split-operator Fourier method, why it is built from a Taylor-expandable approximation, and the numerical trade-offs that come with it.",
    "course": "wave-mechanics",
    "module": "numerically-evolving-quantum-states",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 24,
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier"
    ],
    "objectives": [
      "Derive the leading-order error in approximating exp(A+B) by exp(A)exp(B), and identify it with the commutator [A,B]",
      "Explain why the split-operator method is unconditionally norm-preserving regardless of time step, while still being only approximately accurate",
      "Describe, at a conceptual level, why the method needs the potential and wall-height parameters to be numerically well-matched to the time step"
    ],
    "slug": "quantum-mechanics/wave-mechanics/numerically-evolving-quantum-states"
  },
  {
    "title": "Probability Density and Normalization",
    "description": "Making the Born rule precise for continuous position: what normalization requires, how it survives time evolution, and how the platform's numerical engine enforces both.",
    "course": "wave-mechanics",
    "module": "probability-density-and-normalization",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/what-is-a-wavefunction"
    ],
    "objectives": [
      "State and apply the continuous normalization condition to find unknown constants in a wavefunction",
      "Compute the probability of finding a particle in a finite region by integrating the probability density",
      "Explain why unitary time evolution guarantees the norm stays exactly 1 for all time"
    ],
    "slug": "quantum-mechanics/wave-mechanics/probability-density-and-normalization"
  },
  {
    "title": "The Harmonic Oscillator in Position Space",
    "description": "A second, independent derivation of the harmonic oscillator's energy spectrum, this time by direct substitution into the position-space Schrödinger equation, confirming the ladder-operator result from the last course by an entirely different route.",
    "course": "wave-mechanics",
    "module": "the-harmonic-oscillator-in-position-space",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 24,
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/the-infinite-square-well",
      "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator"
    ],
    "objectives": [
      "Verify by direct substitution that the Gaussian ground state solves the position-space Schrödinger equation with E_0 = hbar*omega/2",
      "Recognize the ladder-operator spectrum and the position-space one as two routes to the same oscillator, and name the physical potential V(x) = (1/2) m omega^2 x^2 that the abstract H was standing in for"
    ],
    "slug": "quantum-mechanics/wave-mechanics/the-harmonic-oscillator-in-position-space"
  },
  {
    "title": "The Infinite Square Well",
    "description": "Solving the time-independent Schrödinger equation exactly for a particle confined between infinite walls, a complete derivation of quantized energies and normalized eigenstates from boundary conditions alone.",
    "course": "wave-mechanics",
    "module": "the-infinite-square-well",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 26,
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/free-particle-wave-packets"
    ],
    "objectives": [
      "Set up and solve the time-independent Schrödinger equation for the infinite square well",
      "Derive the boundary conditions that force quantized energy levels E_n = n^2*pi^2*hbar^2/(2mL^2)",
      "Normalize the resulting eigenstates and verify orthogonality between different levels",
      "Read the energy ordering off the node count, using the curvature the kinetic term charges for"
    ],
    "related": [
      {
        "slug": "quantum-hardware/physical-qubit-platforms/spin-qubits",
        "note": "A fabricated quantum dot confines a single electron by this lesson's mechanism, and the spin of that trapped electron is what becomes the qubit."
      }
    ],
    "slug": "quantum-mechanics/wave-mechanics/the-infinite-square-well"
  },
  {
    "title": "The Position and Momentum Operators",
    "description": "Redeeming the last course's preview: deriving p-hat = -i*hbar*d/dx from the plane-wave eigenfunction requirement, and reproving the canonical commutator [x,p]=i*hbar from calculus rather than assertion.",
    "course": "wave-mechanics",
    "module": "the-position-and-momentum-operators",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/expectation-values-in-position-space"
    ],
    "objectives": [
      "State the position operator's action in position space and explain why it's just multiplication",
      "Derive the momentum operator p-hat = -i*hbar*d/dx from requiring plane waves to be its eigenfunctions with eigenvalue p",
      "Show by integration by parts that the factor of i is exactly what makes p-hat Hermitian",
      "Compute [x,p]psi(x) directly by calculus and reproduce [x,p]=i*hbar exactly"
    ],
    "slug": "quantum-mechanics/wave-mechanics/the-position-and-momentum-operators"
  },
  {
    "title": "The Schrödinger Equation in Position Space",
    "description": "Translating the abstract i*hbar*d|psi>/dt = H|psi> from the last course into the position-space differential equation, by substituting the explicit p-hat this course just derived.",
    "course": "wave-mechanics",
    "module": "the-schrodinger-equation-in-position-space",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 24,
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/momentum-space-and-the-fourier-transform",
      "quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation"
    ],
    "objectives": [
      "Derive the position-space Schrödinger equation from the abstract time-evolution postulate and the explicit p-hat operator",
      "Identify the kinetic and potential energy terms in the resulting Hamiltonian",
      "Explain, at a physical level, how the Wavefunction Explorer numerically integrates this equation forward in time"
    ],
    "slug": "quantum-mechanics/wave-mechanics/the-schrodinger-equation-in-position-space"
  },
  {
    "title": "Tunneling and the Finite Barrier",
    "description": "Solving the Schrödinger equation inside a classically forbidden region to show the wavefunction decays exponentially rather than vanishing outright, which is the mechanism behind quantum tunneling, verified live via the simulator's transmission/reflection accounting.",
    "course": "wave-mechanics",
    "module": "tunneling-and-the-finite-barrier",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 24,
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/wave-packet-dynamics-and-dispersion"
    ],
    "objectives": [
      "Solve the Schrödinger equation inside a classically forbidden region (E < V) and show it gives exponential, not oscillatory, behavior",
      "Explain why a finite-width barrier lets some amplitude survive to the far side, unlike an infinitely thick one",
      "Verify numerically that transmitted and reflected probability sum to 1, confirming no probability is created or destroyed"
    ],
    "slug": "quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier"
  },
  {
    "title": "Wave Mechanics Challenge",
    "description": "A synthesis capstone connecting every idea in this course (the wavefunction, momentum space, the position-space Schrödinger equation, and the solvable systems) into a single coherent picture, alongside the finite-dimensional postulates from the last course.",
    "course": "wave-mechanics",
    "module": "wave-mechanics-challenge",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 30,
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/numerically-evolving-quantum-states"
    ],
    "objectives": [
      "Map every idea from this course onto its finite-dimensional counterpart from the last course",
      "Solve synthesis problems that combine tools from more than one lesson in this course",
      "Identify what remains open for future courses (angular momentum, three dimensions, multi-particle systems)"
    ],
    "slug": "quantum-mechanics/wave-mechanics/wave-mechanics-challenge"
  },
  {
    "title": "Wave Packet Dynamics and Dispersion",
    "description": "Deriving Ehrenfest's theorem (why ⟨x⟩ obeys Newton's law on average), and explaining, from the momentum-space phase evolution directly, why a free wave packet spreads over time.",
    "course": "wave-mechanics",
    "module": "wave-packet-dynamics-and-dispersion",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 22,
    "prerequisites": [
      "quantum-mechanics/wave-mechanics/the-harmonic-oscillator-in-position-space"
    ],
    "objectives": [
      "Derive Ehrenfest's theorem d⟨x⟩/dt = ⟨p⟩/m from the abstract time-evolution machinery",
      "Explain, from momentum-space phase evolution, why a free wave packet's position spread grows with time",
      "Verify the dispersion formula numerically against the Wavefunction Explorer's live variance readout"
    ],
    "slug": "quantum-mechanics/wave-mechanics/wave-packet-dynamics-and-dispersion"
  },
  {
    "title": "What Is a Wavefunction?",
    "description": "Extending the postulates from finite-dimensional qubits to continuous position, by taking the discrete basis you already know and letting the spacing shrink to zero.",
    "course": "wave-mechanics",
    "module": "what-is-a-wavefunction",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 22,
    "prerequisites": [
      "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics"
    ],
    "objectives": [
      "Derive the continuous wavefunction psi(x) as the continuum limit of a discrete position basis",
      "Explain why psi(x) is an amplitude density, not an amplitude, and why that distinction is forced by the continuum limit",
      "Identify which of the four postulates from the last course change in this limit, and which don't"
    ],
    "slug": "quantum-mechanics/wave-mechanics/what-is-a-wavefunction"
  },
  {
    "title": "Gate Decomposition",
    "description": "Real hardware implements only a small native gate set, typically RZ and one more rotation axis. Every other gate decomposes into that set, verified to machine precision: H=Ry(π/2)Rz(π), X=Rz(π)Ry(π), Z=Rz(π), S=Rz(π/2), T=Rz(π/4), using the physically correct decomposition, not what a linear-algebra library would default to.",
    "course": "compilation-and-hybrid-algorithms",
    "module": "gate-decomposition",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation"
    ],
    "objectives": [
      "Explain why real hardware implements only a small native gate set, not every named gate directly",
      "Verify a specific gate decomposition (H, X, Z, S, T into RZ/RY) using this platform's engine",
      "Justify what 'equal up to global phase' means for a decomposition, and why it's the correct equivalence to check"
    ],
    "related": [
      {
        "slug": "quantum-computing/qubits-and-quantum-states/single-qubit-rotations",
        "note": "The Rz/Ry rotation family used for every decomposition here is that lesson's general axis-angle rotation formula, specialized to two fixed axes."
      }
    ],
    "slug": "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition"
  },
  {
    "title": "Hybrid Quantum-Classical Workflows",
    "description": "VQE and QAOA were built as physics: a parametrized circuit and an energy function. This lesson names the software pattern underneath both, a repeated quantum-evaluate/classical-update loop, and shows every prior course's compilation concerns, transpilation, decomposition, noise, apply on every iteration, not just once.",
    "course": "compilation-and-hybrid-algorithms",
    "module": "hybrid-workflows",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition"
    ],
    "objectives": [
      "Describe the general hybrid quantum-classical loop structure underlying VQE and QAOA",
      "Explain why compilation overhead (transpilation, decomposition) matters more for hybrid algorithms than single-shot circuits",
      "Identify which parts of a hybrid algorithm run on the quantum device and which run classically"
    ],
    "slug": "quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows"
  },
  {
    "title": "Quantum Compilation & Transpilation",
    "description": "Physical Qubit Platforms' connectivity constraint made concrete: a CNOT(0,3) request on a linear-chain device needs exactly 4 extra SWAP gates to execute, verified to reproduce the logical CNOT's exact result, using nothing but gates.ts's existing applySwap and applyCNOT.",
    "course": "compilation-and-hybrid-algorithms",
    "module": "quantum-compilation-and-transpilation",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-software/simulating-quantum-systems/noise-simulation"
    ],
    "objectives": [
      "Explain why a logical circuit's gates may not directly match a specific device's connectivity constraints",
      "Compute the SWAP-gate overhead for bridging a given control/target distance on a linear-chain device",
      "Verify that a SWAP-network CNOT reproduces the same logical result as an idealized, connectivity-ignoring CNOT"
    ],
    "slug": "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation"
  },
  {
    "title": "Quantum Error Mitigation",
    "description": "Builds error mitigation from scratch: zero-noise extrapolation's linear-in-noise-level formula, derived from the same depolarizing channel used elsewhere and checked against this platform's own applyChannelRepeatedly, plus readout-error mitigation's confusion-matrix inversion, worked numerically end to end.",
    "course": "compilation-and-hybrid-algorithms",
    "module": "quantum-error-mitigation",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 35,
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows"
    ],
    "objectives": [
      "Distinguish error mitigation (a statistical correction of measured expectation values) from error correction (repairing the quantum state itself), and explain why they solve different problems",
      "Derive zero-noise extrapolation's linear-in-noise-level formula for a traceless observable under a depolarizing channel, and use it to extrapolate two noisy measurements to the zero-noise limit",
      "Build and invert a two-outcome readout confusion matrix to correct a measured probability distribution",
      "State the fundamental sampling-overhead limitation that keeps error mitigation from substituting for fault-tolerant error correction at scale"
    ],
    "related": [
      {
        "slug": "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators",
        "note": "The depolarizing channel this lesson's zero-noise extrapolation derivation uses is a Kraus channel in that lesson's sense, and applyKrausChannel/applyChannelRepeatedly (built there, reused by Noise Simulation) is what this lesson's E(1), E(3) numbers were checked against."
      },
      {
        "slug": "quantum-software/simulating-quantum-systems/noise-simulation",
        "note": "That lesson's runNoisyCircuit interleaves ideal evolution with a noise channel once per gate; this lesson's noise-scaling model (repeating the channel λ times) is the same idea, deliberately scaled up rather than applied once."
      },
      {
        "slug": "quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead",
        "note": "That capstone's threshold theorem gives exponential error SUPPRESSION at polynomial physical-qubit overhead. This lesson's closing section states the opposite-shaped tradeoff error mitigation faces: no extra qubits, but sampling overhead that grows with circuit noise, not free."
      },
      {
        "slug": "quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope",
        "note": "That capstone says a hybrid algorithm's classical loop can 'partially compensate for imperfect quantum execution' without saying how. This lesson names and derives the techniques behind that sentence."
      }
    ],
    "slug": "quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation"
  },
  {
    "title": "Variational Algorithm Implementation",
    "description": "A VQE ansatz built from this platform's own QuantumCircuit lands its grid search exactly on ⟨Z⟩'s true minimum, matching exactGroundStateEnergy to full precision, then extends to a two-parameter Hamiltonian and converges to within 0.04% of the true ground energy by grid search alone.",
    "course": "compilation-and-hybrid-algorithms",
    "module": "variational-algorithm-implementation",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-software/compilation-and-hybrid-algorithms/hybrid-workflows"
    ],
    "objectives": [
      "Build a VQE ansatz using QuantumCircuit rather than Quantum Algorithms II's separate matrix-based approach",
      "Compute a Hamiltonian expectation value directly from a QuantumCircuit's output state",
      "Run a simple classical optimization loop and verify convergence against exactGroundStateEnergy"
    ],
    "slug": "quantum-software/compilation-and-hybrid-algorithms/variational-algorithm-implementation"
  },
  {
    "title": "Circuit Representation in Code",
    "description": "Quantum Gates & Circuits applied matrices directly, immediately. Real software instead builds a circuit as DATA first, a list of named instructions, and only executes it later, the pattern this platform's own QuantumCircuit class implements, reusing every gate from gates.ts unchanged underneath.",
    "course": "programming-quantum-computers",
    "module": "circuit-representation-in-code",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 15,
    "prerequisites": [
      "quantum-computing/quantum-gates-and-circuits/building-quantum-circuits"
    ],
    "objectives": [
      "Explain why real quantum SDKs separate circuit CONSTRUCTION from circuit EXECUTION",
      "Describe a circuit as a list of gate instructions (name, targets, parameters), not a sequence of immediately-applied matrices",
      "Build and run a simple circuit using this platform's QuantumCircuit class"
    ],
    "slug": "quantum-software/programming-quantum-computers/circuit-representation-in-code"
  },
  {
    "title": "Quantum SDKs Overview",
    "description": "Qiskit, Cirq, and PennyLane look different on the surface but share the same core structure: build a circuit as data, target a backend, simulator or hardware, and read results back, with framework-specific differences mostly in ergonomics and target ecosystem, not fundamental capability.",
    "course": "programming-quantum-computers",
    "module": "quantum-sdks-overview",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-software/programming-quantum-computers/circuit-representation-in-code"
    ],
    "objectives": [
      "Name three major real-world quantum SDKs and one distinguishing characteristic of each",
      "Identify the shared structural pattern (circuit, backend, results) across all of them",
      "Explain what a 'backend' abstracts over, connecting to Simulators vs. Real Hardware"
    ],
    "slug": "quantum-software/programming-quantum-computers/quantum-sdks-overview"
  },
  {
    "title": "Simulators vs. Real Hardware",
    "description": "Real hardware adds physical error on top of pure shot noise, plus queue time and a hard qubit-count ceiling a simulator doesn't have, while an ideal noiseless simulator hits an entirely different wall: exponential memory cost in qubit count.",
    "course": "programming-quantum-computers",
    "module": "simulators-vs-real-hardware",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-software/programming-quantum-computers/writing-your-first-circuit"
    ],
    "objectives": [
      "List the practical differences between running a circuit on a simulator vs. real hardware",
      "Explain why an ideal noiseless simulator's cost grows exponentially with qubit count",
      "Decide, for a given development stage, whether a simulator or real hardware is the more appropriate target"
    ],
    "slug": "quantum-software/programming-quantum-computers/simulators-vs-real-hardware"
  },
  {
    "title": "Writing Your First Circuit",
    "description": "A complete, hands-on walkthrough: build a 3-qubit GHZ circuit, run it exactly to get its true probabilities, then sample it 5000 times and watch the measured counts wander by as much, and only as much, as binomial shot noise predicts. The full build-run-sample workflow in one worked example.",
    "course": "programming-quantum-computers",
    "module": "writing-your-first-circuit",
    "order": 1,
    "difficulty": "foundational",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-software/programming-quantum-computers/quantum-sdks-overview"
    ],
    "objectives": [
      "Build a multi-qubit circuit from scratch using QuantumCircuit's chained methods",
      "Distinguish exact simulation (runCircuit) from shot-based sampling (sampleMeasurements)",
      "Explain why real hardware always reports the sampled version, never the exact amplitudes directly"
    ],
    "slug": "quantum-software/programming-quantum-computers/writing-your-first-circuit"
  },
  {
    "title": "Computational Cost & Scaling",
    "description": "Computed exactly, not estimated: state-vector memory is 16×2ⁿ bytes, crossing 1 petabyte around 50 qubits, and per-gate cost scales the same way, since every gate application touches every one of the 2ⁿ amplitudes at least once.",
    "course": "simulating-quantum-systems",
    "module": "computational-cost-and-scaling",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-software/simulating-quantum-systems/state-vector-simulation"
    ],
    "objectives": [
      "Compute exact memory requirements for state-vector simulation at a given qubit count",
      "Explain why each gate application costs O(2ⁿ), and how this compounds over a full circuit",
      "State at what rough qubit count state-vector simulation becomes infeasible on real classical hardware, and why"
    ],
    "slug": "quantum-software/simulating-quantum-systems/computational-cost-and-scaling"
  },
  {
    "title": "Noise Simulation",
    "description": "A noisy simulator interleaves ideal gate evolution with a Kraus-channel noise model after every gate: H then H should implement identity, returning perfectly to |0⟩ with zero noise, verified, but with dephasing interleaved, the same two-gate circuit returns only 90% of the way to |0⟩ instead.",
    "course": "simulating-quantum-systems",
    "module": "noise-simulation",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 20,
    "prerequisites": [
      "quantum-software/simulating-quantum-systems/state-vector-simulation",
      "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators"
    ],
    "objectives": [
      "Explain how a noisy simulator interleaves ideal unitary evolution with a Kraus-channel noise model",
      "Compute the difference between an ideal and noisy circuit's output for a concrete example",
      "State this platform's specific scope limitation (single-qubit circuits) honestly, and why a general version needs more machinery"
    ],
    "related": [
      {
        "slug": "quantum-software/simulating-quantum-systems/tensor-network-methods",
        "note": "The previous lesson in this course's sequence, but not a dependency: nothing here uses tensor networks. The machinery this lesson actually leans on is the density-matrix/Kraus formalism listed as a prerequisite."
      }
    ],
    "slug": "quantum-software/simulating-quantum-systems/noise-simulation"
  },
  {
    "title": "State-Vector Simulation",
    "description": "Every StateVector calculation this platform has ever run, from the first Bell state through Quantum Algorithms II's Shor's-algorithm period finding, IS state-vector simulation, the technique this lesson names and examines as a technique, not a fact about qubits.",
    "course": "simulating-quantum-systems",
    "module": "state-vector-simulation",
    "order": 1,
    "difficulty": "intermediate",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-software/programming-quantum-computers/simulators-vs-real-hardware"
    ],
    "objectives": [
      "Identify state-vector simulation as the specific technique this platform's engine has used throughout, not a new algorithm",
      "State what a state-vector simulator computes and guarantees (exact amplitudes, up to floating-point precision)",
      "Distinguish 'simulating a quantum computer' from 'being a quantum computer' precisely"
    ],
    "related": [
      {
        "slug": "quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors",
        "note": "The 2^n-amplitude StateVector object this lesson names as a simulation technique is the state space built and reasoned about there."
      }
    ],
    "slug": "quantum-software/simulating-quantum-systems/state-vector-simulation"
  },
  {
    "title": "Tensor Network Methods",
    "description": "Computational Cost & Scaling's 2ⁿ wall assumes GENERIC states. Tensor networks exploit a specific structural fact (limited entanglement) to represent certain circuits far more cheaply, at the direct cost of being unable to represent a fully generic, highly-entangled state efficiently at all.",
    "course": "simulating-quantum-systems",
    "module": "tensor-network-methods",
    "order": 1,
    "difficulty": "advanced",
    "estimatedMinutes": 25,
    "prerequisites": [
      "quantum-software/simulating-quantum-systems/computational-cost-and-scaling"
    ],
    "objectives": [
      "Explain what a tensor network representation exploits (limited entanglement) that a generic state-vector cannot",
      "State why this technique is NOT a general solution to the 2ⁿ wall, only a workaround for a specific class of states",
      "Connect entanglement entropy (already built in Entanglement, Mixed States & Bell Tests) to when tensor networks are and aren't effective"
    ],
    "related": [
      {
        "slug": "quantum-computing/entanglement-and-measurement/entanglement-entropy-for-pure-states",
        "note": "The entanglement entropy measure this lesson relies on directly: bond dimension is only small when this quantity stays small (an area law), not for near-maximal entanglement."
      }
    ],
    "slug": "quantum-software/simulating-quantum-systems/tensor-network-methods"
  }
];

/**
 * How many lessons contain at least one `<PredictBeforeReveal>`, and how many
 * instances there are in total (some lessons ask more than once).
 *
 * Separate consts rather than a field on `LessonMetaWithSlug`: this array is
 * the largest plain-data module on the site and `clientBoundary.test.ts` holds
 * a ceiling on client-reachable data, so a per-lesson boolean would cost 219
 * entries to answer a question that has one number for an answer.
 */
export const PREDICTION_LESSON_COUNT = 218;
export const PREDICTION_INSTANCE_COUNT = 229;
