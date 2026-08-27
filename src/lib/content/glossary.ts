import { CONCEPT_NODES, type ConceptNode, type SimulatorId } from "./concepts";
import type { Difficulty, Pillar } from "./types";

export type GlossaryTerm = {
  id: string;
  title: string;
  /** 1-2 sentence definition, glossary-quality prose. */
  definition: string;
  pillar: Pillar;
  /** Real lesson slugs (verified against src/content/lessons/**\/*.mdx). */
  lessonSlugs: string[];
  /** A real simulator id from /simulators, if one directly covers this term. */
  simulatorId?: SimulatorId;
  /** See `GlossaryEntry`, where these two are required rather than optional. */
  level?: Difficulty;
  relatedIds?: string[];
};

/**
 * A term plus the two derived signals `/glossary` renders.
 *
 * Why this is a second type rather than two more required fields on
 * `GlossaryTerm`: nothing *authors* them. They are attached by
 * `withMetadata()` from the tables below rather than repeated on ~145 object
 * literals — which is also the only thing that lets the ~60 terms sourced
 * from `CONCEPT_NODES` (a file this module only reads, and must not edit)
 * carry them at all. So the authored shape and the rendered shape genuinely
 * differ, and `GlossaryTerm` keeps them optional so that either shape
 * satisfies a consumer that only needs id/title/definition/pillar.
 *
 * Everything read off `GLOSSARY_TERMS` gets this narrower type, where both
 * are guaranteed present.
 */
export type GlossaryEntry = Omit<GlossaryTerm, "level" | "relatedIds"> & {
  /**
   * How much background this entry assumes — the same four-level scale
   * courses, lessons and problems already use (`lib/content/types.ts`), so
   * `/glossary` can render it with the identical redundant shape+word
   * encoding `DifficultyMark` uses rather than inventing a parallel one.
   */
  level: Difficulty;
  /**
   * Other glossary ids worth reading next — deliberately two-directional, so
   * a beginner entry points *up* at the research-level entry that generalizes
   * it and that entry points back *down* at the thing it generalizes. Every
   * id here is guaranteed to resolve to a real entry (`buildRelated()` drops
   * anything unknown), so a rendered `#<id>` link can never dangle.
   */
  relatedIds: string[];
};

function fromConceptNode(node: ConceptNode): GlossaryTerm {
  return {
    id: node.id,
    title: node.title,
    definition: node.definition,
    pillar: node.pillar,
    lessonSlugs: node.lessonSlugs,
    simulatorId: node.simulatorId,
  };
}

/**
 * Terms beyond the ~25 already curated in `concepts.ts` for the `/map`
 * concept graph. These don't need a place in that dependency graph (no
 * `prerequisiteIds`), but a real glossary should cover more ground than a
 * map of only the most load-bearing ideas. Every `lessonSlugs` entry here
 * was cross-checked against the real file paths under `src/content/lessons/`.
 */
const ADDITIONAL_GLOSSARY_TERMS: GlossaryTerm[] = [
  // ---------------------------------------------------------------------
  // First-encounter vocabulary
  //
  // The words a quantum-naive reader stalls on inside the first lesson or
  // two, which the rest of this file (weighted toward research-adjacent
  // terms) did not cover. These are the entries `<Term>` reaches for most
  // often in the introductory courses, so they carry the same burden the
  // advanced entries do: precise first, plain second. Where the physics is
  // genuinely unsettled — collapse above all — the entry says so rather
  // than quietly adopting one interpretation as fact.
  // ---------------------------------------------------------------------
  {
    id: "amplitude",
    title: "Amplitude (Probability Amplitude)",
    definition:
      "The complex number multiplying a basis state in a superposition — the α and β in α|0⟩ + β|1⟩. An amplitude is not itself a probability: the Born rule gives the probability as its squared modulus, |α|². That an amplitude can be negative or complex is the whole point, since the relative phase it carries is what lets amplitudes cancel or reinforce when they combine.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-computing/qubits-and-quantum-states/what-is-a-qubit",
      "quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics",
      "quantum-mechanics/classical-to-quantum/why-complex-amplitudes",
    ],
    simulatorId: "complex-amplitude-explorer",
  },
  {
    id: "born-rule",
    title: "Born Rule",
    definition:
      "The rule connecting a quantum state to what a measurement actually shows: measuring |ψ⟩ in an orthonormal basis {|eᵢ⟩} gives outcome i with probability |⟨eᵢ|ψ⟩|², the squared modulus of that outcome's amplitude. It is a separate postulate, not something unitary evolution produces on its own, and it is why amplitudes' squared moduli rather than the amplitudes themselves are the quantities an experiment can measure.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-computing/qubits-and-quantum-states/what-is-a-qubit",
      "quantum-computing/qubits-and-quantum-states/measurement-and-probability",
      "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized",
    ],
    simulatorId: "bloch-sphere",
  },
  {
    id: "computational-basis",
    title: "Computational Basis",
    definition:
      "The orthonormal basis {|0⟩, |1⟩} that a qubit's amplitudes are conventionally written in — for n qubits, the 2ⁿ states |x⟩ labeled by bitstrings. Nothing physical singles it out over any other orthonormal basis; it is the convention that lets quantum states be labeled by classical bit values, and \"measure the qubit\" with no basis named means measuring in this one.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/qubits-and-quantum-states/dirac-notation",
      "quantum-computing/qubits-and-quantum-states/measurement-and-probability",
    ],
  },
  {
    id: "observable",
    title: "Observable",
    definition:
      "A physical quantity a measurement can return a value for, represented by a Hermitian operator: its eigenvalues are the possible outcomes and its eigenvectors are the states that give one of those outcomes with certainty. Two observables have simultaneously well-defined values only when their operators commute.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/classical-to-quantum/classical-states-and-observables",
      "quantum-mechanics/mathematical-foundations/hermitian-operators",
      "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized",
    ],
  },
  {
    id: "orthonormal-basis",
    title: "Orthonormal Basis",
    definition:
      "A basis whose vectors are mutually orthogonal and each of unit length: ⟨eᵢ|eⱼ⟩ equals 1 when i = j and 0 otherwise. Every measurement is stated relative to some orthonormal basis, and orthonormality is exactly what makes the Born-rule probabilities |⟨eᵢ|ψ⟩|² sum to 1 for any normalized state.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-computing/qubits-and-quantum-states/dirac-notation",
      "quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality",
    ],
  },
  {
    id: "quantum-state",
    title: "Quantum State (State Vector)",
    definition:
      "The single mathematical object holding everything predictable about a quantum system: a normalized vector |ψ⟩ in a Hilbert space — a state vector, or pure state — when the system is treated in isolation, and a density matrix in the general case, which is what's needed once the system is entangled with something else or is a statistical mixture of pure states.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors",
      "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics",
    ],
  },
  {
    id: "wavefunction-collapse",
    title: "Wavefunction Collapse",
    definition:
      "The abrupt update of a quantum state on measurement, from a superposition to the outcome actually observed — for a projective measurement, the normalized projection of |ψ⟩ onto the subspace belonging to that outcome, discarding every other branch. As a calculation the rule is unambiguous and matches every experiment; what physically underlies it is not settled, and interpretations disagree on whether collapse is a real physical process, a bookkeeping update of the observer's description, or an appearance produced by decoherence with no collapse happening at all.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-computing/qubits-and-quantum-states/measurement-and-probability",
      "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized",
      "quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition",
    ],
    simulatorId: "bloch-sphere",
  },
  {
    id: "dirac-notation",
    title: "Dirac Notation (Bra-Ket)",
    definition:
      "A compact notation for quantum states — |ψ⟩ for a state vector (ket) and ⟨ψ| for its conjugate transpose (bra) — that makes inner products, outer products, and operator expressions easy to write and manipulate.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/mathematical-foundations/bra-ket-formalism",
      "quantum-computing/qubits-and-quantum-states/dirac-notation",
    ],
  },
  {
    id: "bloch-sphere-term",
    title: "Bloch Sphere",
    definition:
      "A geometric picture of a single qubit's state as a point on (or inside, for mixed states) a unit sphere, where the poles are |0⟩ and |1⟩ and every other point is some superposition set by two angles.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/qubits-and-quantum-states/the-bloch-sphere"],
    simulatorId: "bloch-sphere",
  },
  {
    id: "single-qubit-gates",
    title: "Single-Qubit Gates",
    definition:
      "2×2 unitary matrices — Pauli X/Y/Z, Hadamard, and general rotations — that act on one qubit, visualized as rotations of its Bloch vector around an axis.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/qubits-and-quantum-states/single-qubit-rotations"],
    simulatorId: "bloch-sphere",
  },
  {
    id: "cnot-controlled-gates",
    title: "CNOT & Controlled Gates",
    definition:
      "A two-qubit gate that flips a target qubit's state only when a control qubit is |1⟩; controlled gates like CNOT are what let quantum circuits create entanglement between qubits.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-gates-and-circuits/controlled-gates-and-cnot"],
  },
  {
    id: "no-cloning-theorem",
    title: "No-Cloning Theorem",
    definition:
      "It's provably impossible to build a unitary operation that copies an arbitrary unknown quantum state, a direct consequence of linearity that explains why quantum error correction and quantum cryptography have to work so differently from their classical counterparts.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem"],
  },
  {
    id: "quantum-teleportation",
    title: "Quantum Teleportation",
    definition:
      "A protocol that transmits an unknown qubit's state to a distant party using a shared entangled pair plus two classical bits of information, without ever physically moving the qubit itself.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-gates-and-circuits/quantum-teleportation"],
  },
  {
    id: "superdense-coding",
    title: "Superdense Coding",
    definition:
      "A protocol that sends two classical bits of information by transmitting just one qubit, made possible by a pre-shared entangled pair between sender and receiver.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-gates-and-circuits/superdense-coding"],
  },
  {
    id: "qkd-bb84",
    title: "Quantum Key Distribution (BB84)",
    definition:
      "A protocol that lets two parties establish a shared secret key whose security is guaranteed by quantum mechanics — any eavesdropper's measurement disturbs the transmitted states enough to be detected.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution"],
  },
  {
    id: "tensor-product",
    title: "Tensor Product",
    definition:
      "The operation that combines the state spaces of separate quantum systems into one joint state space, and the mathematical structure that makes multi-qubit states — and entanglement — possible.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/mathematical-foundations/tensor-products-and-composite-systems",
      "quantum-computing/quantum-gates-and-circuits/tensor-products",
    ],
  },
  {
    id: "global-relative-phase",
    title: "Global & Relative Phase",
    definition:
      "A global phase multiplying an entire state vector is physically unobservable, but a relative phase between terms of a superposition is measurable and is exactly what interference experiments detect.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/qubits-and-quantum-states/global-and-relative-phase"],
  },
  {
    id: "deutsch-jozsa",
    title: "Deutsch-Jozsa Algorithm",
    definition:
      "The first algorithm to prove a quantum computer can solve a problem — determining whether a function is constant or balanced — with exponentially fewer oracle calls than any classical deterministic algorithm.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm"],
  },
  {
    id: "simons-algorithm",
    title: "Simon's Algorithm",
    definition:
      "Finds a hidden bitstring period of a function exponentially faster than any classical algorithm, and the algorithm whose structure directly inspired Shor's period-finding approach to factoring.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-algorithms-i/simons-algorithm"],
  },
  {
    id: "phase-kickback",
    title: "Phase Kickback",
    definition:
      "When a controlled unitary acts on a target qubit that's an eigenstate of that unitary, the resulting phase appears on the control qubit instead — the trick that makes quantum phase estimation and most oracle-based algorithms work.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-algorithms-i/phase-kickback"],
  },
  {
    id: "quantum-phase-estimation",
    title: "Quantum Phase Estimation",
    definition:
      "Estimates the phase eigenvalue of a unitary operator's eigenstate using the quantum Fourier transform, and serves as a subroutine inside Shor's algorithm and many other quantum algorithms.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-algorithms-i/quantum-phase-estimation"],
  },
  {
    id: "vqe",
    title: "Variational Quantum Eigensolver (VQE)",
    definition:
      "A hybrid quantum-classical algorithm that uses a parameterized quantum circuit to prepare trial states and a classical optimizer to minimize their energy, aimed at finding ground-state energies on near-term noisy hardware.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits",
      "quantum-computing/quantum-algorithms-ii/vqe-a-worked-toy-example",
    ],
  },
  {
    id: "stabilizer-formalism",
    title: "Stabilizer Formalism",
    definition:
      "Describes certain quantum states and codes not by their state vector but by a set of operators that leave them unchanged, giving a compact, efficient way to design and analyze quantum error-correcting codes.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/error-correction-and-fault-tolerance/stabilizer-formalism-basics"],
  },
  {
    id: "surface-codes",
    title: "Surface Codes",
    definition:
      "A family of quantum error-correcting codes that arrange physical qubits on a 2D lattice with only nearest-neighbor interactions, currently the leading practical approach to fault-tolerant quantum computing.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction"],
  },
  {
    id: "von-neumann-entropy-purity",
    title: "Von Neumann Entropy & Purity",
    definition:
      "Quantify how mixed a quantum state is: purity equals 1 only for a pure state, and von Neumann entropy equals 0 only for a pure state, rising as a system becomes more entangled with — or decohered by — its environment.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/entanglement-and-measurement/purity-entropy-and-information"],
  },
  {
    id: "partial-trace",
    title: "Partial Trace",
    definition:
      "The operation that discards one subsystem of a composite quantum state to obtain the reduced density matrix describing what remains — the standard way to describe part of an entangled system on its own.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/entanglement-and-measurement/partial-trace-and-reduced-states"],
  },
  {
    id: "neutral-atoms",
    title: "Neutral Atom Qubits",
    definition:
      "Qubits encoded in the internal states of individual neutral atoms held in optical tweezers, offering large, flexibly-arranged qubit arrays without the charge noise that affects superconducting circuits.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/physical-qubit-platforms/neutral-atoms"],
  },
  {
    id: "photonic-qubits",
    title: "Photonic Qubits",
    definition:
      "Qubits encoded in properties of single photons, such as polarization or path, naturally suited to quantum communication since photons travel long distances with minimal decoherence.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/physical-qubit-platforms/photonic-qubits"],
  },
  {
    id: "spin-qubits",
    title: "Spin Qubits",
    definition:
      "Qubits encoded in the spin state of a single electron or nucleus confined in a semiconductor quantum dot, leveraging decades of existing silicon fabrication technology.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/physical-qubit-platforms/spin-qubits"],
  },
  {
    id: "crosstalk",
    title: "Crosstalk",
    definition:
      "Unwanted interaction between qubits or control lines that are supposed to be addressed independently, one of the practical noise sources that grows as more qubits are packed onto a chip.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/noise-decoherence-and-scaling/crosstalk"],
  },
  {
    id: "quantum-compilation-transpilation",
    title: "Quantum Compilation & Transpilation",
    definition:
      "The process of rewriting an abstract quantum circuit into an equivalent one that only uses the gates and qubit connectivity a specific real quantum device actually supports.",
    pillar: "quantum-software",
    lessonSlugs: ["quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation"],
  },
  {
    id: "tensor-network-methods",
    title: "Tensor Network Methods",
    definition:
      "Classical simulation techniques that represent a quantum state as a network of contracted tensors instead of a full state vector, letting certain low-entanglement quantum circuits be simulated far beyond the naive 2ⁿ-scaling limit.",
    pillar: "quantum-software",
    lessonSlugs: ["quantum-software/simulating-quantum-systems/tensor-network-methods"],
  },
  {
    id: "quantum-harmonic-oscillator",
    title: "Quantum Harmonic Oscillator",
    definition:
      "The quantum-mechanical version of a mass on a spring, with equally-spaced discrete energy levels; it's exactly solvable and appears as an approximation all over physics, from molecular vibrations to superconducting qubit circuits.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator"],
  },
  {
    id: "heisenberg-uncertainty-principle",
    title: "Heisenberg Uncertainty Principle",
    definition:
      "Two observables whose operators don't commute — like position and momentum — can't both have arbitrarily well-defined values in the same state; the product of their uncertainties is bounded below by half the magnitude of their commutator's expectation value, which for position and momentum reduces to the fixed constant ħ/2.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty"],
  },
  {
    id: "quantum-tunneling",
    title: "Quantum Tunneling",
    definition:
      "A particle has a nonzero probability of appearing on the far side of a potential energy barrier it classically shouldn't have enough energy to cross, a direct consequence of the wavefunction not dropping to exactly zero inside the barrier.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier"],
  },
  {
    id: "pauli-exclusion-principle",
    title: "Pauli Exclusion Principle",
    definition:
      "No two identical fermions — electrons, for instance — can occupy the same complete quantum state simultaneously, the principle that explains atomic shell structure and the periodic table.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/identical-particles/the-pauli-exclusion-principle"],
  },
  {
    id: "stern-gerlach-experiment",
    title: "Stern-Gerlach Experiment",
    definition:
      "Sent silver atoms through an inhomogeneous magnetic field and observed the beam split into discrete spots rather than a continuous smear — the historical experiment that first demonstrated spin quantization.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment"],
  },
  {
    id: "vector-space",
    title: "Vector Space",
    definition:
      "A set of objects (vectors) closed under addition and scalar multiplication, satisfying axioms like associativity and distributivity — the abstract structure that quantum states live in, whether those vectors are arrows, functions, or columns of complex numbers.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/vector-spaces"],
  },
  {
    id: "basis",
    title: "Basis",
    definition:
      "A set of linearly independent vectors that spans an entire vector space, so every vector in that space can be written as a unique linear combination of them — the |0⟩, |1⟩ standard basis being the qubit's simplest example.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/vector-spaces"],
  },
  {
    id: "span",
    title: "Span",
    definition:
      "The set of every vector reachable as a linear combination of a given collection of vectors — a basis is simply a spanning set that's also linearly independent.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/vector-spaces"],
  },
  {
    id: "linear-independence",
    title: "Linear Independence",
    definition:
      "A set of vectors is linearly independent if none of them can be written as a linear combination of the others — equivalently, the only way to combine them into the zero vector is with every coefficient equal to zero.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/vector-spaces"],
  },
  {
    id: "eigenvalue-eigenvector",
    title: "Eigenvalue & Eigenvector",
    definition:
      "For an operator A, a nonzero vector v is an eigenvector with eigenvalue λ if Av = λv — applying A to v only rescales it. In quantum mechanics, an observable's eigenvalues are its possible measurement outcomes, and its eigenvectors are the states that produce them with certainty.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/eigenvalues-and-eigenvectors"],
  },
  {
    id: "hermitian-operator",
    title: "Hermitian Operator",
    definition:
      "An operator equal to its own conjugate transpose (A = A†), guaranteeing real eigenvalues and orthogonal eigenvectors — the mathematical property that lets Hermitian operators represent physical observables, whose measured values must be real numbers.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/hermitian-operators"],
  },
  {
    id: "unitary-operator",
    title: "Unitary Operator",
    definition:
      "An operator U whose conjugate transpose is also its inverse (U†U = I), which preserves inner products and therefore vector length — the property that makes unitary operators the only ones that can represent valid quantum time evolution or quantum gates.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/unitary-operators"],
  },
  {
    id: "inner-product",
    title: "Inner Product",
    definition:
      "A generalization of the dot product, ⟨φ|ψ⟩, that takes two vectors and returns a (possibly complex) scalar measuring their overlap — the operation underlying norms, orthogonality, and the probabilities the Born rule predicts.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality"],
  },
  {
    id: "hilbert-space",
    title: "Hilbert Space",
    definition:
      "A vector space equipped with an inner product and complete under the norm that inner product defines — the mathematical setting quantum states formally live in, generalizing familiar Euclidean space to complex, sometimes infinite dimensions.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality"],
  },
  {
    id: "cauchy-schwarz-inequality",
    title: "Cauchy-Schwarz Inequality",
    definition:
      "States that the magnitude of an inner product between two vectors never exceeds the product of their individual norms, |⟨φ|ψ⟩| ≤ ‖φ‖‖ψ‖ — the inequality underlying the Heisenberg uncertainty principle's general derivation.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality"],
  },
  {
    id: "taylor-series",
    title: "Taylor Series",
    definition:
      "Represents a smooth function as an infinite sum of terms built from its derivatives at a single point — the tool used to derive Euler's formula, e^(iθ) = cos θ + i sin θ, by comparing the series for e^x, sin x, and cos x term by term.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/complex-numbers-for-physics"],
  },
  {
    id: "modulus",
    title: "Modulus (of a Complex Number)",
    definition:
      "The distance |z| of a complex number z = a + bi from the origin, equal to √(a² + b²) — for a quantum amplitude, its squared modulus gives the Born-rule probability of the outcome it belongs to.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/complex-numbers-for-physics"],
  },
  {
    id: "normalization",
    title: "Normalization",
    definition:
      "The requirement that a quantum state's amplitudes have squared moduli summing (or integrating) to 1, so the total probability of all possible measurement outcomes is exactly 100%.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/probability-and-quantum-states"],
  },

  // ---------------------------------------------------------------------
  // Quantum Mastery
  // ---------------------------------------------------------------------
  {
    id: "rigged-hilbert-space",
    title: "Rigged Hilbert Space (Gelfand Triple)",
    definition:
      "The nested structure Φ⊂H⊂Φ′ (a space of nice test functions, inside the ordinary Hilbert space, inside a space of generalized functions) that gives improper eigenstates like |p⟩ — which have infinite norm and so cannot belong to H itself — a fully rigorous home as generalized eigenvectors.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/hilbert-space-and-spectral-theory/continuous-spectra-and-rigged-hilbert-space"],
  },
  {
    id: "greens-functions-resolvents",
    title: "Green's Functions & Resolvents",
    definition:
      "The resolvent R(E)=(E−H)⁻¹ packages every bound state and scattering state of a Hamiltonian into a single analytic function of complex energy E: its poles land exactly on the discrete bound-state energies, and its branch cut marks the continuous spectrum, via the Sokhotski–Plemelji identity.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/hilbert-space-and-spectral-theory/greens-functions-and-resolvents"],
  },
  {
    id: "sturm-liouville-theory",
    title: "Sturm-Liouville Theory",
    definition:
      "The general eigenvalue-problem theorem, (py′)′−qy+λwy=0 with boundary conditions killing a specific boundary term, that guarantees real eigenvalues and orthogonal eigenfunctions for any such problem — proving once, from a single boundary-term identity, why the infinite well, the harmonic oscillator, and the hydrogen radial equation all come with the same guarantees.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/hilbert-space-and-spectral-theory/sturm-liouville-theory"],
  },
  {
    id: "degenerate-perturbation-theory",
    title: "Degenerate Perturbation Theory",
    definition:
      "When ordinary perturbation theory's energy-denominator formula would divide by zero because unperturbed states are degenerate, the correct zeroth-order states are instead the eigenvectors of the perturbation restricted to the degenerate subspace — the fix needed to actually compute hydrogen's 2p spin-orbit splitting from its L·S coupling.",
    pillar: "quantum-mastery",
    lessonSlugs: [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/degenerate-perturbation-theory-and-fine-structure",
    ],
  },
  {
    id: "coherent-states",
    title: "Coherent States",
    definition:
      "Eigenstates |α⟩ of the harmonic oscillator's (non-Hermitian) annihilation operator, â|α⟩=α|α⟩, with Poisson-distributed photon number and equal position/momentum uncertainty saturating the Heisenberg bound — the quantum states that most closely track a classical oscillator trajectory, and what real laser light approximates.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/symmetry-scattering-and-semiclassical-methods/coherent-and-squeezed-states"],
  },
  {
    id: "squeezed-states",
    title: "Squeezed States",
    definition:
      "Minimum-uncertainty harmonic-oscillator states with unequal position and momentum spread, Δx=e⁻ʳ/√2 and Δp=eʳ/√2 for squeeze parameter r, that still saturate ΔxΔp=½ exactly — used in real gravitational-wave detectors like LIGO to push measurement noise below what any coherent state could achieve on one quadrature.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/symmetry-scattering-and-semiclassical-methods/coherent-and-squeezed-states"],
  },
  {
    id: "partial-wave-scattering-s-matrix",
    title: "Partial-Wave Scattering & the S-Matrix",
    definition:
      "A central potential separates 3D scattering into independent angular-momentum channels, each carrying a single phase shift δₗ that encodes the potential's entire effect on that channel; every cross section is built from the {δₗ}, and the S-matrix Sₗ=e^(2iδₗ) has |Sₗ|=1 exactly whenever no absorption occurs.",
    pillar: "quantum-mastery",
    lessonSlugs: [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/three-dimensional-scattering-and-the-s-matrix",
    ],
  },
  {
    id: "quantum-state-purification",
    title: "Purification",
    definition:
      "Every mixed state ρ on a system can be written as the reduced state of some pure state on a larger system — a direct corollary of the Schmidt decomposition, and never unique, since any unitary acting only on the auxiliary system leaves the reduced state unchanged.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification"],
  },
  {
    id: "choi-jamiolkowski-isomorphism",
    title: "Choi-Jamiolkowski Isomorphism",
    definition:
      "Turns an entire quantum channel into a single ordinary matrix, J(E)=Σᵢⱼ|i⟩⟨j|⊗E(|i⟩⟨j|), such that the channel is completely positive exactly when J(E)≥0 and trace-preserving exactly when tracing out its output half gives the identity — reducing 'is this map physically valid' to an ordinary linear-algebra check.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi"],
  },
  {
    id: "quantum-relative-entropy",
    title: "Quantum Relative Entropy",
    definition:
      "S(ρ‖σ)=Tr(ρ log₂ρ)−Tr(ρ log₂σ), the quantum generalization of the classical Kullback-Leibler divergence, measuring how costly it is to mistake σ for the true state ρ; Klein's inequality guarantees it is never negative, and it vanishes only when ρ=σ exactly.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-information-theory/relative-entropy-and-mixed-state-entanglement"],
  },
  {
    id: "mixed-state-concurrence",
    title: "Mixed-State Concurrence (Wootters Formula)",
    definition:
      "The general two-qubit entanglement measure C(ρ)=max(0, √μ₁−√μ₂−√μ₃−√μ₄), built from the eigenvalues of R=ρρ̃ for ρ̃=(σy⊗σy)ρ*(σy⊗σy), that reduces exactly to the pure-state formula 2|ad−bc| and equals the entanglement of formation — the tool needed once a state is no longer pure.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-information-theory/relative-entropy-and-mixed-state-entanglement"],
  },
  {
    id: "oracle-relativization-barrier",
    title: "Relativization Barrier (Baker-Gill-Solovay)",
    definition:
      "Oracles exist relative to which P=NP, and other oracles relative to which P≠NP, so no proof technique that works identically for every oracle can settle such questions unconditionally — the reason Deutsch-Jozsa's and Simon's algorithms' oracle-relative speedups, however rigorous, say nothing unconditional about BPP versus BQP for ordinary, structured problems.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/advanced-algorithms-and-complexity/bqp-and-oracle-complexity"],
  },
  {
    id: "quantum-phase-estimation-precision",
    title: "Phase Estimation Precision & Approximate QFT",
    definition:
      "For a phase not exactly representable in a finite register, quantum phase estimation's measurement probability follows an exact closed form built from a geometric series, guaranteeing at least 4/π² success probability on the best t-bit estimate; dropping small-angle controlled-phase gates below a cutoff gives an approximate QFT with a provable, exponentially small error bound and far fewer gates.",
    pillar: "quantum-mastery",
    lessonSlugs: [
      "quantum-mastery/advanced-algorithms-and-complexity/phase-estimation-precision-and-qft-depth",
    ],
  },
  // ---------------------------------------------------------------------
  // Quantum Shannon Theory (quantum-mastery)
  // ---------------------------------------------------------------------
  {
    id: "povm",
    title: "POVM (Positive Operator-Valued Measure)",
    definition:
      "A set of positive semi-definite operators {E_i} summing to the identity, generalizing projective measurement so that outcome probabilities are still given by the Born rule P(i)=Tr(E_iρ) even when the E_i are not orthogonal projectors or outnumber the Hilbert space's dimension.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-shannon-theory/povms-and-generalized-measurement"],
  },
  {
    id: "naimark-dilation-theorem",
    title: "Naimark's Dilation Theorem",
    definition:
      "The theorem that any POVM measurement on a system can be realized as an ordinary projective measurement on that system plus an ancilla, via a fixed unitary followed by measuring the enlarged system in an orthonormal basis.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-shannon-theory/povms-and-generalized-measurement"],
  },
  {
    id: "quantum-instrument",
    title: "Quantum Instrument",
    definition:
      "A collection of completely positive maps, one per measurement outcome, that specifies both the outcome probabilities (via the induced POVM) and the actual post-measurement state — strictly more information than the POVM alone, since infinitely many instruments can induce the same POVM element while leaving different post-measurement states.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-shannon-theory/povms-and-generalized-measurement"],
  },
  {
    id: "kraus-operators-cptp-maps",
    title: "Kraus Operators & CPTP Maps",
    definition:
      "The operators {K_i} satisfying ΣK_i†K_i=I that write any completely positive, trace-preserving (physical) quantum channel as E(ρ)=ΣK_iρK_i†; the Stinespring dilation theorem shows these operators are literally the blocks of a unitary acting on the system plus a fixed environment.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-shannon-theory/stinespring-dilation-and-channel-purification"],
  },
  {
    id: "quantum-mutual-information-conditional-entropy",
    title: "Quantum Mutual Information & Conditional Entropy",
    definition:
      "I(A:B)=S(A)+S(B)-S(AB) measures total correlation between two quantum systems, while conditional entropy S(A|B)=S(AB)-S(B) measures the uncertainty about A remaining once B is known; unlike its classical counterpart, S(A|B) can be negative for entangled states, its magnitude equal to the qubit cost (or yield) of quantum state merging.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-shannon-theory/quantum-entropy-and-information-measures"],
  },
  {
    id: "coherent-information",
    title: "Coherent Information",
    definition:
      "I(A>B)=-S(A|B)=S(ρ_B)-S(ρ_{AB}) for a channel with reference system A and output B; its regularized maximum over channel uses equals the channel's quantum capacity by the Lloyd-Shor-Devetak theorem, and it can be negative, signaling a channel through which no quantum information survives.",
    pillar: "quantum-mastery",
    lessonSlugs: [
      "quantum-mastery/quantum-shannon-theory/quantum-entropy-and-information-measures",
      "quantum-mastery/quantum-shannon-theory/capstone-what-can-be-sent-through-noise",
    ],
  },
  {
    id: "holevo-quantity",
    title: "Holevo Quantity & Holevo's Theorem",
    definition:
      "χ({p_i,ρ_i})=S(Σp_iρ_i)-Σp_iS(ρ_i) upper-bounds the classical information any single measurement can extract from an ensemble of quantum states (Holevo's theorem); its channel-optimized, regularized value equals the channel's classical capacity by the Holevo-Schumacher-Westmoreland theorem.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-shannon-theory/capstone-what-can-be-sent-through-noise"],
  },
  {
    id: "entanglement-breaking-channel",
    title: "Entanglement-Breaking Channel",
    definition:
      "A channel that, applied to half of any maximally entangled pair, always leaves a separable (unentangled) output; every entanglement-breaking channel has exactly zero quantum capacity, since no entanglement — and hence no quantum information — survives passage through it even in principle.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-shannon-theory/capstone-what-can-be-sent-through-noise"],
  },
  // ---------------------------------------------------------------------
  // Apex — Algorithmic Frontiers
  // ---------------------------------------------------------------------
  {
    id: "block-encoding",
    title: "Block Encoding",
    definition:
      "A unitary U on a system register plus ancilla such that (⟨0|_anc⊗I)U(|0⟩_anc⊗I) = A for a matrix A with ‖A‖≤1; running U and post-selecting the ancilla on |0⟩ applies A to a state with probability ‖A|ψ⟩‖².",
    pillar: "apex",
    lessonSlugs: ["apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries"],
  },
  {
    id: "linear-combination-of-unitaries",
    title: "Linear Combination of Unitaries (LCU)",
    definition:
      "A technique for block-encoding a matrix A=Σᵢαᵢ Uᵢ written as a weighted sum of unitaries, via a PREPARE (ancilla superposition weighted by √(αᵢ/‖α‖₁)), SELECT (apply Uᵢ conditioned on the ancilla), PREPARE† circuit.",
    pillar: "apex",
    lessonSlugs: ["apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries"],
  },
  {
    id: "signal-rotation",
    title: "Signal Rotation W(x)",
    definition:
      "The fixed 2×2 unitary [[x, i√(1-x²)], [i√(1-x²), x]] = e^{i·arccos(x)·X} at the heart of quantum signal processing, whose interleaving with tunable phase gates produces a controllable polynomial in the signal x.",
    pillar: "apex",
    lessonSlugs: ["apex/algorithmic-frontiers/quantum-signal-processing"],
  },
  {
    id: "qsvt-polynomial",
    title: "QSVT Polynomial P(A)",
    definition:
      "For a block-encoded matrix A=Σᵢσᵢ|uᵢ⟩⟨vᵢ| and a polynomial P realized via quantum signal processing, QSVT produces a block encoding of P(A):=Σᵢ P(σᵢ)|uᵢ⟩⟨vᵢ| — the same polynomial applied independently and simultaneously to every singular value of A.",
    pillar: "apex",
    lessonSlugs: ["apex/algorithmic-frontiers/the-quantum-singular-value-transformation"],
  },
  {
    id: "qubitization",
    title: "Qubitization",
    definition:
      "Low and Chuang's technique (predating QSVT) of embedding a Hamiltonian's block encoding so that it decomposes into independent two-dimensional invariant subspaces, one per eigen/singular value, each behaving exactly like a single-qubit QSP signal rotation — the structural fact QSVT builds on and generalizes.",
    pillar: "apex",
    lessonSlugs: ["apex/algorithmic-frontiers/the-quantum-singular-value-transformation"],
  },
  {
    id: "maximum-likelihood-amplitude-estimation",
    title: "Maximum-Likelihood Amplitude Estimation",
    definition:
      "A QPE-free amplitude estimation method that runs the Grover iterate at a classically-chosen, increasing schedule of depths, measures each directly, and combines the results with a classical maximum-likelihood estimator to reach the same Heisenberg-limited O(1/ε) scaling as phase-estimation-based amplitude estimation.",
    pillar: "apex",
    lessonSlugs: ["apex/algorithmic-frontiers/amplitude-estimation-without-phase-estimation"],
  },
  {
    id: "condition-number-kappa",
    title: "Condition Number (κ)",
    definition:
      "The ratio of a matrix's largest to smallest singular value, κ=σ_max/σ_min; it sets both the degree of the polynomial QSVT needs to approximate 1/x for quantum linear-systems solving and the cost of classical iterative solvers, making it the key resource cost — not just matrix dimension N — for how hard a linear system is to solve on either kind of computer.",
    pillar: "apex",
    lessonSlugs: ["apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems"],
  },
  {
    id: "dequantization",
    title: "Dequantization",
    definition:
      "The discovery (e.g. Ewin Tang's 2018 result) that, under a classical data-access model analogous to efficient quantum state preparation, a classical algorithm can sometimes match a quantum algorithm's polylogarithmic scaling for certain low-rank problems — a concrete caution against overclaiming exponential speedups for algorithms like quantum linear-systems solvers without checking every scope condition.",
    pillar: "apex",
    lessonSlugs: ["apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems"],
  },
  // ---------------------------------------------------------------------
  // Apex — Fault Tolerance Frontiers
  // ---------------------------------------------------------------------
  {
    id: "code-distance",
    title: "Code Distance",
    definition:
      "The minimum weight of any nontrivial logical operator in a stabilizer code, determining how many physical errors it can correct; for the surface code it equals the length of the shortest Pauli string running between two opposite lattice boundaries.",
    pillar: "apex",
    lessonSlugs: [
      "apex/fault-tolerance-frontiers/surface-codes-in-depth",
      "apex/fault-tolerance-frontiers/decoding-surface-codes",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
    ],
  },
  {
    id: "syndrome-defect-graph",
    title: "Decoding Graph (Syndrome Defects)",
    definition:
      "The abstract graph a decoder builds each correction cycle, with one vertex per flipped stabilizer ('defect') and edge weights reflecting how plausible a physical error chain connecting two defects is; minimum-weight perfect matching on this graph is the standard surface-code decoding algorithm.",
    pillar: "apex",
    lessonSlugs: ["apex/fault-tolerance-frontiers/decoding-surface-codes"],
  },
  {
    id: "logical-error-rate",
    title: "Logical Error Rate",
    definition:
      "The probability that an error corrupts a code's encoded information beyond what it can catch and correct; for the surface code it scales exponentially with code distance below threshold, roughly as p_L ~ (p/p_th)^((d+1)/2).",
    pillar: "apex",
    lessonSlugs: [
      "apex/fault-tolerance-frontiers/decoding-surface-codes",
      "apex/fault-tolerance-frontiers/the-threshold-theorem",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
    ],
  },
  {
    id: "lattice-surgery-term",
    title: "Lattice Surgery",
    definition:
      "Merging two adjacent surface-code patches by measuring new joint stabilizers along their shared boundary — fusing them into one code block that projectively measures the product of their logical operators — then splitting them apart again; the standard mechanism for implementing logical multi-qubit gates without any transversal or long-range operation.",
    pillar: "apex",
    lessonSlugs: ["apex/fault-tolerance-frontiers/lattice-surgery"],
  },
  {
    id: "magic-state-factory",
    title: "Magic-State Factory",
    definition:
      "A dedicated region of a fault-tolerant architecture continuously running magic-state distillation rounds to keep a supply of high-fidelity T-states flowing to the computation; in realistic resource estimates the factory typically dominates both total physical qubit count and runtime.",
    pillar: "apex",
    lessonSlugs: [
      "apex/fault-tolerance-frontiers/magic-states-and-distillation",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
    ],
  },
  {
    id: "eastin-knill-theorem",
    title: "Eastin–Knill Theorem",
    definition:
      "A no-go result stating that no quantum error-correcting code can simultaneously have a universal set of transversal logical gates and the ability to correct arbitrary errors on any single physical qubit; for the surface code this forces Clifford gates to be transversal while the T gate provably cannot be.",
    pillar: "apex",
    lessonSlugs: ["apex/fault-tolerance-frontiers/magic-states-and-distillation"],
  },
  {
    id: "gottesman-knill-theorem",
    title: "Gottesman–Knill Theorem",
    definition:
      "Any stabilizer circuit — built from Clifford gates (H, S, CNOT) and Pauli measurements/preparations starting from a computational-basis state — simulates classically in time polynomial in qubit count and circuit size, via an n×2n binary tableau updated by simple per-gate bit rules, regardless of how entangled the resulting state becomes; for the surface code this is exactly why Clifford gates alone can never demonstrate quantum advantage, forcing the non-Clifford T gate to be injected via magic-state distillation instead.",
    pillar: "apex",
    lessonSlugs: [
      "apex/simulation-and-compilation-frontiers/when-classical-simulation-works",
      "apex/fault-tolerance-frontiers/magic-states-and-distillation",
    ],
  },
  {
    id: "rough-smooth-boundary",
    title: "Rough & Smooth Boundaries",
    definition:
      "The two distinct edge types of a finite surface-code patch — 'rough' where face (X-type) stabilizers are truncated to weight 2, 'smooth' where vertex (Z-type) stabilizers are truncated — between which the logical X̄ and Z̄ operators respectively run as boundary-to-boundary Pauli strings.",
    pillar: "apex",
    lessonSlugs: [
      "apex/fault-tolerance-frontiers/surface-codes-in-depth",
      "apex/fault-tolerance-frontiers/lattice-surgery",
    ],
  },
  // ---------------------------------------------------------------------
  // Apex — Quantum Complexity Theory
  // ---------------------------------------------------------------------
  {
    id: "qma-completeness",
    title: "QMA-Completeness",
    definition:
      "A problem is QMA-complete if it is in QMA and every other QMA problem reduces to it in polynomial time, making it exactly as hard as any problem a quantum computer can efficiently verify — the quantum analogue of NP-completeness. The Local Hamiltonian problem was the first problem shown QMA-complete, via Kitaev's history-state reduction, playing the same role for QMA that 3-SAT plays for NP via Cook-Levin.",
    pillar: "apex",
    lessonSlugs: [
      "apex/quantum-complexity-theory/the-local-hamiltonian-problem",
      "apex/quantum-complexity-theory/qma-and-quantum-verification",
    ],
  },
  {
    id: "quantum-adversary-method",
    title: "Quantum Adversary Method",
    definition:
      "A technique (Ambainis, 2000-2002) for proving quantum query lower bounds by tracking a numerical distinguishability measure between an algorithm's states on a chosen hard pair of problem instances; because a single oracle query can only change that measure by a bounded amount, it yields an unconditional lower bound such as Ω(√N) for unstructured search.",
    pillar: "apex",
    lessonSlugs: ["apex/quantum-complexity-theory/query-complexity-and-lower-bounds"],
  },
  {
    id: "polynomial-method-query-lower-bounds",
    title: "Polynomial Method (Query Lower Bounds)",
    definition:
      "A technique (Beals, Buhrman, Cleve, Mosca, and de Wolf, 1998) for proving quantum query lower bounds by showing a T-query algorithm's acceptance probability is a multilinear polynomial of degree at most 2T in the oracle's input bits, then invoking classical results on the approximate degree of Boolean functions to bound T from below.",
    pillar: "apex",
    lessonSlugs: ["apex/quantum-complexity-theory/query-complexity-and-lower-bounds"],
  },
  {
    id: "query-complexity-black-box-model",
    title: "Query Complexity (Black-Box Model)",
    definition:
      "A cost model in which an algorithm accesses an unknown function only through oracle queries, with all other computation free and unlimited; a query lower bound of T queries proves no algorithm, however clever its free computation, can succeed with fewer than T queries against every oracle consistent with the problem's promise.",
    pillar: "apex",
    lessonSlugs: ["apex/quantum-complexity-theory/query-complexity-and-lower-bounds"],
  },
  {
    id: "history-state-kitaev",
    title: "History State (Kitaev's Construction)",
    definition:
      "A superposition, tagged by an auxiliary clock register, over every intermediate snapshot of a verification circuit's execution on a witness; Kitaev's Local Hamiltonian construction penalizes deviations from a valid history state with local Hamiltonian terms, so the construction's ground-state energy is low exactly when some witness makes the original circuit accept.",
    pillar: "apex",
    lessonSlugs: ["apex/quantum-complexity-theory/the-local-hamiltonian-problem"],
  },
  {
    id: "p-np-bqp-containments",
    title: "P, NP, and BQP Containments",
    definition:
      "The three proven containments among the classical complexity classes P and NP and the quantum class BQP — P⊆BQP, P⊆NP, and BQP⊆PSPACE — together with the three genuinely open questions about how BQP and NP otherwise relate (NP⊆BQP?, BQP⊆NP?, P=BQP?), which popular accounts routinely conflate with settled fact.",
    pillar: "apex",
    lessonSlugs: ["apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp"],
  },
  {
    id: "random-circuit-sampling",
    title: "Random Circuit Sampling",
    definition:
      "A computational task — sampling from the output distribution of a specific random quantum circuit — chosen because it is conjectured to be classically hard (under the assumption that the polynomial hierarchy does not collapse) while being efficient for a quantum computer. Google's 2019 Sycamore experiment used it as an empirical 'quantum supremacy' demonstration, though it establishes strong conjecture-level evidence for one narrow, practically-useless task, not an unconditional proof or a demonstration of advantage on useful problems.",
    pillar: "apex",
    lessonSlugs: ["apex/quantum-complexity-theory/capstone-what-we-know-and-dont"],
  },
  // ---------------------------------------------------------------------
  // Apex — Simulation and Compilation Frontiers
  // ---------------------------------------------------------------------
  {
    id: "matrix-product-state",
    title: "Matrix Product State (MPS)",
    definition:
      "A representation of an n-qubit state as a chain of small tensors connected by bond indices, built by repeated singular value decomposition across each cut; keeping every nonzero singular value makes it an exact rewriting of the state, while truncating the smallest ones gives a controlled approximation.",
    pillar: "apex",
    lessonSlugs: ["apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states"],
  },
  {
    id: "bond-dimension",
    title: "Bond Dimension",
    definition:
      "The size χ of the shared index linking two adjacent tensors in a matrix product state, equal exactly to the Schmidt rank of the state across that cut; an area-law state needs bond dimension bounded by a constant independent of system size, while a volume-law state can require χ up to 2^(n/2).",
    pillar: "apex",
    lessonSlugs: [
      "apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states",
      "apex/simulation-and-compilation-frontiers/when-classical-simulation-works",
    ],
  },
  {
    id: "clifford-group",
    title: "Clifford Group",
    definition:
      "The group of unitaries — generated by Hadamard, the phase gate S, and CNOT — that map Pauli operators to Pauli operators under conjugation; Clifford-only circuits are classically simulable by the Gottesman-Knill theorem no matter how entangled they get, which is exactly why a fault-tolerant algorithm's real cost is measured by its non-Clifford (T) gate count instead.",
    pillar: "apex",
    lessonSlugs: [
      "apex/simulation-and-compilation-frontiers/when-classical-simulation-works",
      "apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting",
    ],
  },
  {
    id: "t-count-t-depth",
    title: "T-Count & T-Depth",
    definition:
      "T-count is the total number of T gates in a compiled Clifford+T circuit, the direct measure of how many expensive magic states a fault-tolerant computation consumes; T-depth counts sequential layers of T gates after parallelizing independent ones, bounding wall-clock time against a magic-state factory's finite production rate.",
    pillar: "apex",
    lessonSlugs: [
      "apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting",
      "apex/simulation-and-compilation-frontiers/capstone-from-algorithm-to-qubit-count",
    ],
  },
  {
    id: "solovay-kitaev-theorem",
    title: "Solovay-Kitaev Theorem",
    definition:
      "Guarantees that any single-qubit unitary can be approximated to precision ε by O(log^c(1/ε)) gates from a fixed universal gate set, found efficiently by a classical algorithm; it proves efficient synthesis is always possible but says nothing about whether the sequence found is the shortest possible for that specific target.",
    pillar: "apex",
    lessonSlugs: ["apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting"],
  },
  {
    id: "ross-selinger-synthesis",
    title: "Ross-Selinger (Number-Theoretic) Synthesis",
    definition:
      "A synthesis algorithm that exploits the number-theoretic structure of the ring ℤ[1/√2, i] — every entry a Clifford+T circuit can produce — to find near-optimal T-count circuits, roughly 3-4·log₂(1/ε), for compiling single-qubit Rz(θ) rotations, dramatically beating generic Solovay-Kitaev synthesis for that structured gate family.",
    pillar: "apex",
    lessonSlugs: ["apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting"],
  },
  {
    id: "qubit-routing-swap-overhead",
    title: "Qubit Routing & SWAP Overhead",
    definition:
      "Mapping a circuit's logical two-qubit gates onto a device's limited connectivity graph forces inserted SWAP gates for every non-adjacent interaction, at a cost of 2(d-1) SWAPs for chain distance d; a noise-aware compiler then chooses, among mappings with identical SWAP overhead, the one that routes the heaviest gate load through the device's best-calibrated qubits and couplers.",
    pillar: "apex",
    lessonSlugs: ["apex/simulation-and-compilation-frontiers/noise-aware-compilation-and-resource-estimation"],
  },
  {
    id: "jordan-wigner-transformation",
    title: "Jordan-Wigner Transformation",
    definition:
      "Maps fermionic creation/annihilation operators to qubit Pauli operators via a_j = (Z_1⊗...⊗Z_{j-1})⊗σ⁻_j; the prepended 'Z-string' is what converts qubit operators' natural commutation into the anticommutation the canonical fermionic algebra requires, letting a molecular Hamiltonian run on a qubit-based quantum computer.",
    pillar: "apex",
    lessonSlugs: ["apex/simulation-and-compilation-frontiers/quantum-simulation-of-molecules"],
  },
  {
    id: "electronic-structure-problem",
    title: "Electronic Structure Problem",
    definition:
      "Finding the ground-state energy of a molecule's electrons in the fixed Coulomb field of its nuclei (the Born-Oppenheimer approximation); reaching chemical accuracy (~1.6 milli-Hartree) for strongly correlated molecules like transition-metal catalysts is believed to require classical resources scaling exponentially, making it the most frequently cited candidate for a first practical fault-tolerant quantum advantage.",
    pillar: "apex",
    lessonSlugs: ["apex/simulation-and-compilation-frontiers/quantum-simulation-of-molecules"],
  },
  // ---------------------------------------------------------------------
  // Apex — Research Methods and Synthesis
  // ---------------------------------------------------------------------
  {
    id: "quantum-advantage-supremacy",
    title: "Quantum Advantage / Quantum Supremacy",
    definition:
      "The claim that a quantum device solved or sampled from some specific computational task faster than any known classical approach can; the term compresses a family of genuinely different sub-claims (which task, compared against which classical baseline, under which unproven hardness assumption) into a single headline word, which is exactly why it needs unpacking rather than a flat accept-or-reject read.",
    pillar: "apex",
    lessonSlugs: [
      "apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims",
      "apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today",
    ],
  },
  {
    id: "shot-noise-standard-error",
    title: "Shot Noise & Standard Error",
    definition:
      "The unavoidable statistical scatter in a probability estimated from a finite number of circuit runs (shots); for an estimate p̂ = k/N the standard error √(p(1−p)/N) shrinks only as 1/√N, so a reported probability is not meaningful without also stating the shot count it came from.",
    pillar: "apex",
    lessonSlugs: ["apex/research-methods-and-synthesis/reproducing-and-designing-experiments"],
  },
  {
    id: "reproducibility-four-components",
    title: "Reproducibility Standard (Four Components)",
    definition:
      "A quantum-computing experimental claim counts as reproducible only when it specifies all four of: the exact circuit, the exact hardware or simulator (including a dated calibration snapshot for real hardware), the exact classical post-processing/error-mitigation pipeline, and the statistical uncertainty — shot count and confidence interval — behind any reported number.",
    pillar: "apex",
    lessonSlugs: ["apex/research-methods-and-synthesis/reproducing-and-designing-experiments"],
  },
  {
    id: "theorem-heuristic-conjecture-open",
    title: "Theorem / Heuristic / Conjecture / Genuinely Open (Claim Classification)",
    definition:
      "A four-question checklist for classifying any technical claim by its actual evidentiary status: a complete proof makes it a theorem, broad numerical support without a matching proof makes it a heuristic, a motivated-but-unverified theoretical argument makes it a conjecture, and none of these leaves it genuinely open — a single claim can even split across tiers depending on exactly which sub-statement is being evaluated.",
    pillar: "apex",
    lessonSlugs: ["apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic"],
  },
  {
    id: "calibration-drift",
    title: "Calibration Drift",
    definition:
      "The day-to-day change in a real quantum device's physical error rates — gate fidelities, T1/T2 coherence times, readout asymmetry — caused by temperature fluctuations and slow electronic drift, which is why a result reported without a dated calibration snapshot cannot be fully reproduced even on the identical physical device.",
    pillar: "apex",
    lessonSlugs: ["apex/research-methods-and-synthesis/reproducing-and-designing-experiments"],
  },
  {
    id: "best-known-classical-baseline",
    title: "Best-Known Classical Baseline",
    definition:
      "The strongest classical algorithm and hardware actually published at the time a quantum-advantage claim was made, which a fair comparison must be measured against rather than a weaker or naive classical method; because 'best known' is a moving target, a later, better classical algorithm narrowing the gap tests the original claim rather than invalidating it.",
    pillar: "apex",
    lessonSlugs: ["apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims"],
  },
  {
    id: "popoviciu-inequality",
    title: "Popoviciu's Inequality",
    definition:
      "A general bound on a bounded random variable's variance, Var(X) ≤ (max−min)²/4, used to compute a worst-case standard error for an experimental estimator (such as a measured cut value) even when its exact probability distribution isn't known in closed form.",
    pillar: "apex",
    lessonSlugs: ["apex/research-methods-and-synthesis/reproducing-and-designing-experiments"],
  },

  // ---------------------------------------------------------------------
  // The bottom of the ladder
  //
  // The prose vocabulary a reader meets in the *first two modules* of each
  // course — read off the actual lesson text under `src/content/lessons/`,
  // not guessed — that this file, weighted toward research-adjacent terms,
  // had no entry for. Every one of these is a word an introductory lesson
  // uses in running prose while assuming the reader already has it.
  //
  // The house rule for these, and the reason they are worth writing at all:
  // **beginner-legible by the end of the first sentence, technically exact
  // by the end of the last.** A newcomer must be able to stop after sentence
  // one and have gained something true; a graduate reader must be able to
  // finish the entry without finding anything they'd have to unlearn. No
  // analogies that trade accuracy for warmth, and no "it's basically like a
  // coin" — an entry that has to lie to be friendly isn't friendly.
  // ---------------------------------------------------------------------

  {
    id: "wavefunction",
    title: "Wavefunction",
    definition:
      "The quantum state of a particle written as a function of position, ψ(x) — one complex number for every place the particle could be found. It is the same state vector |ψ⟩ that Dirac notation writes abstractly, just expressed in the position basis, where the coefficients form a continuum rather than a list; |ψ(x)|² is then the probability density for finding the particle at x, and the wavefunction's spatial derivative encodes its momentum content.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/wave-mechanics/what-is-a-wavefunction",
      "quantum-mechanics/wave-mechanics/probability-density-and-normalization",
      "quantum-mechanics/wave-mechanics/the-schrodinger-equation-in-position-space",
    ],
    simulatorId: "wavefunction-explorer",
  },
  {
    id: "schrodinger-equation",
    title: "Schrödinger Equation",
    definition:
      "The equation of motion of quantum mechanics: it says how a state changes from one moment to the next, the way Newton's second law does for a classical particle. In its general form iℏ d|ψ⟩/dt = Ĥ|ψ⟩, the Hamiltonian Ĥ — the system's energy operator — generates the motion; the equation is linear and deterministic, so nothing random enters quantum mechanics through it. Randomness enters only at measurement, through the Born rule.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation",
      "quantum-mechanics/wave-mechanics/the-schrodinger-equation-in-position-space",
    ],
    simulatorId: "wavefunction-explorer",
  },
  {
    id: "unitary-evolution",
    title: "Unitary Evolution",
    definition:
      "The rule that an isolated quantum system's state changes by a reversible, length-preserving transformation — no information is created or destroyed. Formally the state at time t is |ψ(t)⟩ = U(t)|ψ(0)⟩ with U†U = I, which is what the Schrödinger equation integrates to for a time-independent Hamiltonian, U(t) = e^(−iĤt/ℏ). This is why every quantum gate must be a unitary matrix and why every quantum circuit can, in principle, be run backwards.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/mathematical-foundations/unitary-operators",
      "quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation",
      "quantum-computing/qubits-and-quantum-states/quantum-gates",
    ],
  },
  {
    id: "expectation-value",
    title: "Expectation Value",
    definition:
      "The average result you would get by preparing the same state many times and measuring the same observable each time — written ⟨A⟩ = ⟨ψ|Â|ψ⟩, or Tr(ρÂ) for a mixed state. It is a statistical average over outcomes, not a prediction about any single run, and it need not be a value the measurement can actually return: a qubit's ⟨Z⟩ can be 0.3 even though every individual measurement yields +1 or −1.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/classical-to-quantum/expectation-values-and-uncertainty",
      "quantum-mechanics/wave-mechanics/expectation-values-in-position-space",
      "quantum-computing/entanglement-and-measurement/evolution-and-measurement-of-density-matrices",
    ],
  },
  {
    id: "energy-eigenstate",
    title: "Energy Eigenstate (Stationary State)",
    definition:
      "A state with one definite energy: measure its energy and you get the same value every time. Mathematically it satisfies Ĥ|ψₙ⟩ = Eₙ|ψₙ⟩, and under time evolution it picks up only the global phase e^(−iEₙt/ℏ) — which is unobservable, so every measurable property stays constant, hence 'stationary'. Any other state is a superposition of energy eigenstates, and the *relative* phases between those terms do evolve, which is where all quantum dynamics comes from.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/classical-to-quantum/stationary-states",
      "quantum-mechanics/wave-mechanics/the-infinite-square-well",
      "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels",
    ],
    simulatorId: "wavefunction-explorer",
  },
  {
    id: "probability-density",
    title: "Probability Density",
    definition:
      "For a particle described by a wavefunction, |ψ(x)|² is not itself a probability but a probability *per unit length*: the probability of finding the particle between x and x + dx is |ψ(x)|² dx. Because position is continuous, any single exact point has probability zero, and only integrals over a region are meaningful. Normalization is the requirement that this density integrate to 1 over all space.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/wave-mechanics/probability-density-and-normalization",
      "quantum-mechanics/wave-mechanics/what-is-a-wavefunction",
    ],
    simulatorId: "wavefunction-explorer",
  },
  {
    id: "commutator",
    title: "Commutator",
    definition:
      "The measure of how much two operators fail to be interchangeable: [Â, B̂] = ÂB̂ − B̂Â, which is zero exactly when applying them in either order gives the same result. Physically it decides whether two observables can have definite values at once — commuting observables share a full set of eigenstates and are simultaneously measurable, while a non-zero commutator forces an uncertainty relation, of which [x̂, p̂] = iℏ giving ΔxΔp ≥ ℏ/2 is the canonical case.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/operators-observables-measurement/simultaneous-eigenstates-and-compatible-observables",
      "quantum-mechanics/operators-observables-measurement/sequential-measurements-and-incompatibility",
      "quantum-mechanics/angular-momentum-and-spin/angular-momentum-commutation-relations",
    ],
  },
  {
    id: "linear-operator",
    title: "Linear Operator",
    definition:
      "A rule that turns one state vector into another while respecting sums and scalar multiples: Â(α|ψ⟩ + β|φ⟩) = αÂ|ψ⟩ + βÂ|φ⟩. In finite dimensions an operator is just a matrix once a basis is fixed. Linearity is not a simplifying assumption but a postulate of quantum mechanics, and much of what makes quantum information distinctive — the no-cloning theorem above all — follows from it directly.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/mathematical-foundations/linear-operators",
      "quantum-mechanics/mathematical-foundations/vector-spaces",
    ],
  },
  {
    id: "complex-number",
    title: "Complex Number",
    definition:
      "A number of the form a + bi, where i² = −1 — equivalently a magnitude paired with an angle, re^(iθ), which is the form quantum mechanics almost always uses. Quantum amplitudes are complex because that angle is the *phase*, and phase is what allows two contributions to a probability to cancel; a theory built on real, non-negative numbers alone could add possibilities but never subtract them, and so could not produce interference.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/mathematical-foundations/complex-numbers-for-physics",
      "quantum-computing/qubits-and-quantum-states/complex-numbers-for-quantum-mechanics",
      "quantum-mechanics/classical-to-quantum/why-complex-amplitudes",
    ],
    simulatorId: "complex-amplitude-explorer",
  },
  {
    id: "quantization",
    title: "Quantization",
    definition:
      "The fact that some physical quantities can only take certain discrete values rather than any value on a continuum — the observation the whole field is named after. It is not imposed by hand: solving the Schrödinger equation for a bound system with physically acceptable boundary conditions admits solutions only at particular energies, exactly as a string clamped at both ends supports only particular harmonics. Unbound systems, by contrast, generally have continuous spectra.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/wave-mechanics/the-infinite-square-well",
      "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels",
      "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator",
    ],
  },
  {
    id: "photon",
    title: "Photon",
    definition:
      "The quantum of the electromagnetic field — the smallest indivisible amount of light at a given frequency, carrying energy E = hf. A photon is an excitation of a field mode rather than a small ball of light, which is why photon *number* is discrete while the field's phase and polarization remain continuous degrees of freedom. Those degrees of freedom are what photonic quantum computers and quantum key distribution actually encode qubits in.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-hardware/physical-qubit-platforms/photonic-qubits",
      "quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution",
    ],
  },
  {
    id: "double-slit-experiment",
    title: "Double-Slit Experiment",
    definition:
      "The experiment in which particles sent one at a time through two slits build up an interference pattern on a screen behind them, even though each particle arrives as a single localized hit. The pattern is the Born rule applied to a sum of amplitudes — |ψ₁ + ψ₂|², not |ψ₁|² + |ψ₂|² — so the fringes are the cross-term. Determining which slit a particle went through, by any means, destroys the pattern, because the which-path information leaves the two paths no longer able to interfere.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/classical-to-quantum/superposition-interference-and-phase",
      "quantum-mechanics/classical-to-quantum/from-classical-to-quantum-probability",
    ],
  },
  {
    id: "coherence",
    title: "Coherence",
    definition:
      "A quantum system has coherence when the relative phases between the branches of its superposition are still well-defined — which is precisely the resource interference needs. In the density-matrix picture, coherence lives in the off-diagonal elements of ρ; decoherence is those elements decaying toward zero as the system entangles with its environment, leaving a state that behaves like a classical probabilistic mixture. Every quantum computation is a race against that decay.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition",
      "quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices",
      "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
    ],
    simulatorId: "noise-explorer",
  },
  {
    id: "pure-state",
    title: "Pure State",
    definition:
      "A state about which there is nothing further to know — it can be written as a single state vector |ψ⟩, and its density matrix ρ = |ψ⟩⟨ψ| satisfies ρ² = ρ, so its purity Tr(ρ²) equals 1. A pure state is not a state with a definite measurement outcome: a superposition is perfectly pure and still yields random outcomes. Purity is about the completeness of the description, not the predictability of the result.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states",
      "quantum-computing/entanglement-and-measurement/purity-entropy-and-information",
    ],
    simulatorId: "density-matrix-explorer",
  },
  {
    id: "mixed-state",
    title: "Mixed State",
    definition:
      "A state that is a classical probabilistic mixture of quantum states, described by a density matrix ρ = Σᵢ pᵢ|ψᵢ⟩⟨ψᵢ| with purity Tr(ρ²) < 1. Mixedness arises in two quite different ways that the density matrix deliberately does not distinguish: genuine ignorance about which state was prepared, and — more fundamentally — being one half of an entangled pair, where the reduced state of either half is mixed even though the pair as a whole is pure.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states",
      "quantum-computing/entanglement-and-measurement/why-entangled-subsystems-are-mixed",
      "quantum-computing/entanglement-and-measurement/convex-combinations-and-physical-mixtures",
    ],
    simulatorId: "density-matrix-explorer",
  },
  {
    id: "hadamard-gate",
    title: "Hadamard Gate (H)",
    definition:
      "The single-qubit gate that turns a definite basis state into an equal superposition: H|0⟩ = (|0⟩ + |1⟩)/√2 and H|1⟩ = (|0⟩ − |1⟩)/√2. It is its own inverse, and the minus sign in the second line is what makes it more than a coin flip — applying H twice returns the original state exactly, because the two paths interfere rather than merely randomizing. Geometrically it is a 180° Bloch-sphere rotation about the axis halfway between X and Z.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/qubits-and-quantum-states/quantum-gates",
      "quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits",
    ],
    simulatorId: "circuit-builder",
  },
  {
    id: "pauli-matrices",
    title: "Pauli Matrices (X, Y, Z)",
    definition:
      "The three 2×2 matrices that, with the identity, form a basis for every single-qubit operator. X is the quantum bit flip (X|0⟩ = |1⟩), Z the phase flip (Z|1⟩ = −|1⟩), and Y = iXZ combines both. They are simultaneously Hermitian and unitary, so each is both a valid gate and a measurable observable with eigenvalues ±1 — which is why single-qubit error is fully described by X, Z and their product, and why Bloch-sphere coordinates are just ⟨X⟩, ⟨Y⟩, ⟨Z⟩.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/qubits-and-quantum-states/single-qubit-rotations",
      "quantum-computing/qubits-and-quantum-states/the-bloch-sphere",
      "quantum-computing/error-correction-and-fault-tolerance/why-quantum-errors-are-different",
    ],
    simulatorId: "bloch-sphere",
  },
  {
    id: "quantum-register",
    title: "Quantum Register",
    definition:
      "A named collection of qubits treated as one unit, the quantum counterpart of a classical register of bits. The crucial difference is that an n-qubit register is not n independent qubits: its state lives in a 2ⁿ-dimensional space and generally cannot be factored into individual qubit states at all. Algorithms routinely use several registers — a work register and an ancilla or output register — and measure them at different times.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors",
      "quantum-computing/quantum-gates-and-circuits/quantum-circuit-notation",
      "quantum-software/programming-quantum-computers/writing-your-first-circuit",
    ],
    simulatorId: "circuit-builder",
  },
  {
    id: "circuit-depth",
    title: "Circuit Depth",
    definition:
      "The number of sequential layers of gates in a circuit — how many gate times must elapse from input to output, counting gates that act on disjoint qubits in the same layer as one step. Depth, not total gate count, is what competes against a qubit's coherence time, so it is the resource that decides whether a circuit will produce signal or noise on present hardware, and the quantity compilers work hardest to reduce.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-gates-and-circuits/building-quantum-circuits",
      "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation",
      "quantum-software/simulating-quantum-systems/computational-cost-and-scaling",
    ],
    simulatorId: "circuit-builder",
  },
  {
    id: "universal-gate-set",
    title: "Universal Gate Set",
    definition:
      "A finite collection of gates from which any unitary operation can be built to arbitrary accuracy — the quantum analogue of NAND being universal for classical logic. Any entangling two-qubit gate plus a suitable set of single-qubit gates suffices; the standard fault-tolerant choice is Clifford+T. Universality is an approximation result, not an exact one, and the Solovay-Kitaev theorem bounds how many gates the approximation costs.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation",
      "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition",
    ],
  },
  {
    id: "oracle",
    title: "Oracle (Black-Box Function)",
    definition:
      "A subroutine an algorithm is allowed to call but not look inside, used to state a problem in terms of how many *queries* a solution needs rather than how much total computation. On a quantum computer an oracle must be a unitary, so a function f is supplied reversibly as Uf|x⟩|y⟩ = |x⟩|y ⊕ f(x)⟩ — and because it is unitary it can be queried on a superposition of inputs. Oracle separations are provable but conditional: they bound query cost, not the cost of any particular real implementation.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-i/quantum-parallelism-and-the-oracle-model",
      "quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion",
      "quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm",
    ],
    simulatorId: "grover-explorer",
  },
  {
    id: "ansatz",
    title: "Ansatz",
    definition:
      "A guessed form for a solution, with free parameters left in to be fixed later — in variational quantum algorithms, a fixed circuit shape whose rotation angles a classical optimizer tunes. The choice is a genuine trade-off rather than a detail: an ansatz expressive enough to contain the true answer may be untrainable (barren plateaus) or too deep for real hardware, while a hardware-friendly one may simply not contain the state being searched for.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits",
      "quantum-computing/quantum-algorithms-ii/vqe-a-worked-toy-example",
      "quantum-software/compilation-and-hybrid-algorithms/variational-algorithm-implementation",
    ],
    simulatorId: "qaoa-explorer",
  },
  {
    id: "shot",
    title: "Shot",
    definition:
      "One execution of a quantum circuit, from state preparation through measurement, producing exactly one classical bitstring. Because measurement is probabilistic, a single shot tells you almost nothing; a result is a histogram over many shots, typically thousands. The statistical error on any estimate from N shots falls only as 1/√N, so halving an error bar costs four times the runtime — which is why shot count is a first-class budget line in any experiment.",
    pillar: "quantum-software",
    lessonSlugs: [
      "quantum-software/programming-quantum-computers/writing-your-first-circuit",
      "quantum-software/programming-quantum-computers/simulators-vs-real-hardware",
      "apex/research-methods-and-synthesis/reproducing-and-designing-experiments",
    ],
  },
  {
    id: "physical-qubit",
    title: "Physical Qubit",
    definition:
      "An actual two-level quantum system in hardware — a transmon circuit, a trapped ion, an electron spin — as distinct from the idealized qubit of an algorithm. Physical qubits are noisy, imperfectly identical, connected only to their neighbours, and drift between calibrations, and every one of those properties shows up in what a circuit can be run on them. Error correction's job is to assemble many of them into far fewer, far better logical qubits.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-hardware/physical-qubit-platforms/superconducting-qubits",
      "quantum-hardware/physical-qubit-platforms/capstone-comparing-qubit-platforms",
      "quantum-computing/error-correction-and-fault-tolerance/why-quantum-errors-are-different",
    ],
  },
  {
    id: "logical-qubit",
    title: "Logical Qubit",
    definition:
      "One qubit of an algorithm, encoded across many physical qubits by an error-correcting code so that errors on the constituents can be detected and undone without disturbing the encoded state. The exchange rate is severe — thousands of physical qubits per logical qubit at plausible error rates — and it only pays off at all once physical error rates sit below the code's threshold, which is why 'how many qubits' is an ambiguous question until it says which kind.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code",
      "quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
    ],
    simulatorId: "syndrome-explorer",
  },
  {
    id: "nisq",
    title: "NISQ (Noisy Intermediate-Scale Quantum)",
    definition:
      "The current era of hardware: devices with roughly 50 to a few thousand physical qubits, too many to simulate naively but far too few and too noisy to run error correction. NISQ is a description of a constraint, not a class of algorithms — it means circuits must stay shallow enough to finish before decoherence does. Whether any NISQ-era algorithm delivers a practical advantage over classical methods remains genuinely open.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope",
      "quantum-hardware/noise-decoherence-and-scaling/roadmaps-to-fault-tolerance",
    ],
  },
  {
    id: "bells-theorem",
    title: "Bell's Theorem",
    definition:
      "The proof that no theory in which particles carry pre-existing local properties can reproduce all the correlations quantum mechanics predicts for entangled pairs. It is not an interpretation but an experimentally testable inequality: local hidden-variable models bound the CHSH quantity at 2, quantum mechanics reaches 2√2, and loophole-free experiments have measured the violation. What must be abandoned is locality-plus-definite-values, not determinism alone.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables",
      "quantum-computing/entanglement-and-measurement/the-chsh-inequality",
    ],
    simulatorId: "chsh-bell-test",
  },
  {
    id: "quantum-error-mitigation",
    title: "Quantum Error Mitigation",
    definition:
      "Post-processing and circuit-level techniques — zero-noise extrapolation, probabilistic error cancellation, readout-error correction — that recover a better estimate of a noiseless expectation value from noisy runs, without encoding anything. Mitigation does not correct the quantum state and cannot make a computation fault-tolerant; it buys accuracy with extra shots, and that sampling cost typically grows exponentially in the circuit's noise, which caps how far it can be pushed.",
    pillar: "quantum-software",
    lessonSlugs: [
      "quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation",
      "quantum-software/simulating-quantum-systems/noise-simulation",
    ],
    simulatorId: "noise-explorer",
  },
  {
    id: "transmon",
    title: "Transmon",
    definition:
      "The superconducting circuit that most large quantum processors use as their qubit: a Josephson junction shunted by a large capacitor, cooled to ~10 mK, whose lowest two energy levels serve as |0⟩ and |1⟩. The large shunt capacitance is the design's whole point — it flattens sensitivity to stray charge, buying orders of magnitude in coherence time at the cost of weaker anharmonicity, which is what then limits how fast gates can be driven without leaking into the third level.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-hardware/physical-qubit-platforms/superconducting-qubits",
      "quantum-hardware/control-and-readout/control-electronics",
    ],
  },
  {
    id: "t1-t2-coherence-times",
    title: "T₁ and T₂ (Coherence Times)",
    definition:
      "The two numbers that summarize how long a qubit stays usable. T₁ is the energy-relaxation time — how long before |1⟩ decays to |0⟩; T₂ is the dephasing time — how long before the relative phase of a superposition is randomized. T₂ ≤ 2T₁ always, because relaxation itself destroys phase, and it is usually much shorter, since low-frequency noise dephases a qubit long before it loses energy. A circuit's total duration must sit well inside T₂.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
      "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise",
    ],
    simulatorId: "noise-explorer",
  },
  {
    id: "gate-fidelity",
    title: "Gate Fidelity",
    definition:
      "How closely a gate as actually performed matches the unitary it was supposed to be, reported as a number just under 1 — 99.9% fidelity means an error rate of 10⁻³ per gate. Errors compound roughly multiplicatively, so a 1000-gate circuit at 99.9% has already lost most of its signal, and fidelity is the quantity that must fall below a code's threshold before error correction helps rather than hurts. The figure is meaningful only alongside how it was measured.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-hardware/control-and-readout/calibration",
      "quantum-hardware/noise-decoherence-and-scaling/crosstalk",
      "apex/fault-tolerance-frontiers/the-threshold-theorem",
    ],
  },
  {
    id: "rabi-oscillation",
    title: "Rabi Oscillation",
    definition:
      "The periodic driving of a qubit between |0⟩ and |1⟩ by a resonant control pulse — the mechanism by which a single-qubit gate is physically performed. The population oscillates sinusoidally at the Rabi frequency, which is proportional to the drive amplitude, so gate angle is set by pulse area: a pulse driving half a period is an X gate, a quarter-period pulse creates an equal superposition. Calibrating a gate begins with measuring this curve.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-hardware/control-and-readout/control-electronics",
      "quantum-hardware/control-and-readout/calibration",
    ],
    simulatorId: "rabi-explorer",
  },
  {
    id: "detuning",
    title: "Detuning",
    definition:
      "How far a control drive's frequency sits from the qubit's own transition frequency, written Δ = ω_drive − ω_qubit. At zero detuning the drive is resonant and a Rabi oscillation can move the qubit all the way from |0⟩ to |1⟩; off resonance it cannot, and the population ceiling falls as Ω²/(Ω² + Δ²) while the oscillation itself speeds up. That trade is why calibration hunts for Δ = 0, and why a qubit whose frequency drifts loses gate fidelity without anything else changing.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-hardware/control-and-readout/control-electronics",
      "quantum-hardware/control-and-readout/calibration",
    ],
    simulatorId: "rabi-explorer",
  },
  {
    id: "dilution-refrigerator",
    title: "Dilution Refrigerator",
    definition:
      "The cryostat that holds superconducting processors near 10 millikelvin, cooling by pumping ³He across a phase boundary in a ³He/⁴He mixture. The temperature is set by physics, not caution: a transmon's |0⟩–|1⟩ splitting is a few GHz, so the thermal energy kT must sit well below hf or the qubit is thermally excited before any computation starts. Every control and readout line into the cold stage is also a heat leak, which is a real constraint on scaling.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-hardware/control-and-readout/cryogenic-systems",
      "quantum-hardware/noise-decoherence-and-scaling/scaling-challenges",
    ],
  },
  {
    id: "quantum-volume",
    title: "Quantum Volume",
    definition:
      "A single-number benchmark for a whole device rather than one component: the largest n for which the machine can run random square circuits on n qubits, of depth n, and still beat a fixed statistical threshold. Because it folds qubit count, gate fidelity, connectivity and compiler quality into one figure, it resists the failure mode of quoting qubit count alone — but it saturates for large machines and says nothing about performance on any specific algorithm.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-hardware/noise-decoherence-and-scaling/scaling-challenges",
      "apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims",
    ],
  },
  {
    id: "randomized-benchmarking",
    title: "Randomized Benchmarking",
    definition:
      "The standard protocol for measuring average gate error: run random sequences of Clifford gates of increasing length, each followed by the inversion that should return the qubit to its start, and fit how the survival probability decays with sequence length. Because the answer comes from a decay *rate*, it is insensitive to state-preparation and measurement error — which is exactly why a quoted fidelity should say whether it came from this or from full process tomography.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-hardware/control-and-readout/calibration",
      "quantum-mastery/quantum-information-theory/trace-distance-and-fidelity",
    ],
  },

  // ---------------------------------------------------------------------
  // Quantum-mechanics course vocabulary
  //
  // The second pass, and its provenance is worth recording: these are not
  // terms picked from a syllabus, they are the terms the pillar's own lesson
  // pass *tried to gloss and couldn't*. Nine lessons were capped at two
  // `<Term>` glosses purely because the word they needed had no entry, and
  // several settled for a near-miss — `eigenvalue-eigenvector` standing in
  // for degeneracy, `degenerate-perturbation-theory` standing in for
  // ordinary perturbation theory, `greens-functions-resolvents` standing in
  // for the path-integral propagator (it is about resolvents; it is not a
  // substitute). Each entry below retires one of those substitutions.
  //
  // Same rule as the block above: first sentence readable cold, last
  // sentence one a graduate reader would sign.
  // ---------------------------------------------------------------------

  {
    id: "degeneracy",
    title: "Degeneracy",
    definition:
      "When two or more independent states share the same eigenvalue — the same energy, say — that eigenvalue is degenerate, and the measurement that returns it no longer picks out a unique state. What comes back instead is the whole eigenspace, so a measurement can only project onto that subspace, and choosing a basis inside it needs a second, commuting observable. Degeneracy is almost always the fingerprint of a symmetry, and a perturbation that breaks the symmetry splits the level.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/operators-observables-measurement/spectral-decomposition-and-degeneracy",
      "quantum-mechanics/operators-observables-measurement/degeneracy-in-practice",
      "quantum-mechanics/operators-observables-measurement/complete-sets-of-commuting-observables",
    ],
  },
  {
    id: "projector",
    title: "Projector (Projection Operator)",
    definition:
      "An operator that keeps the part of a state lying in some subspace and discards the rest — P = |φ⟩⟨φ| for a single direction, or a sum of such terms for a larger subspace. Projectors are Hermitian and idempotent (P² = P), which is exactly the statement that projecting twice changes nothing. They are the language measurement is written in: the Born-rule probability is ⟨ψ|P|ψ⟩ and the post-measurement state is P|ψ⟩ renormalized.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/operators-observables-measurement/spectral-decomposition-and-degeneracy",
      "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized",
    ],
  },
  {
    id: "trace",
    title: "Trace",
    definition:
      "The sum of a matrix's diagonal entries, Tr(A) = Σᵢ Aᵢᵢ. Two properties make it indispensable here: it does not depend on the basis you compute it in, and it is cyclic, Tr(ABC) = Tr(BCA). Those give the two facts density matrices rest on — Tr(ρ) = 1 says probabilities sum to one, and ⟨A⟩ = Tr(ρA) computes any expectation value without ever choosing a basis.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices",
      "quantum-computing/entanglement-and-measurement/partial-trace-and-reduced-states",
    ],
  },
  {
    id: "hamiltonian",
    title: "Hamiltonian",
    definition:
      "The operator representing a system's total energy, written Ĥ — usually kinetic plus potential, p̂²/2m + V(x̂). It plays two roles at once: its eigenvalues are the energies a measurement can return, and it *generates time evolution* through the Schrödinger equation, so writing down Ĥ is what specifies a physical system completely. Finding a Hamiltonian's ground-state energy is also the problem most quantum algorithms for chemistry and materials are ultimately trying to solve.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/classical-to-quantum/the-postulates-of-quantum-mechanics",
      "quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation",
      "quantum-mechanics/classical-to-quantum/stationary-states",
    ],
  },
  {
    id: "perturbation-theory",
    title: "Perturbation Theory",
    definition:
      "A method for a problem you cannot solve exactly but which is close to one you can: write Ĥ = Ĥ₀ + λV̂ with the correction small, and expand the energies and states in powers of λ. The first-order energy shift is just the expectation of the perturbation in the unperturbed state, ⟨n|V̂|n⟩. The expansion assumes the level in question is non-degenerate and well separated — degenerate levels need the degenerate version, and the series is generally asymptotic rather than convergent.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/approximation-methods/time-independent-perturbation-theory",
      "quantum-mechanics/approximation-methods/time-dependent-perturbation-theory",
    ],
  },
  {
    id: "decoherence",
    title: "Decoherence",
    definition:
      "The loss of a superposition's relative phase to the environment. Nothing about it is mysterious or extra: the system becomes entangled with degrees of freedom no one tracks, and once those are traced out, the reduced density matrix's off-diagonal terms decay away, leaving something that behaves exactly like a classical probabilistic mixture. It is fast — the larger and warmer the system, the faster — which is why classical behaviour emerges, and why a quantum computer must finish before it happens.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition",
      "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators",
      "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise",
    ],
    simulatorId: "noise-explorer",
  },
  {
    id: "propagator",
    title: "Propagator",
    definition:
      "The amplitude for a particle to go from one place and time to another, K(x_f, t_f; x_i, t_i) = ⟨x_f|Û(t_f − t_i)|x_i⟩ — the object that, integrated against an initial wavefunction, produces the wavefunction later. In the path-integral formulation it is computed by summing e^(iS/ℏ) over *every* path connecting the endpoints, with S the classical action, which is what makes the classical trajectory the stationary-phase path rather than the only one.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation"],
  },
  {
    id: "classical-action",
    title: "Classical Action (and Lagrangian)",
    definition:
      "The action S is the time integral of the Lagrangian L = T − V (kinetic minus potential energy) along a path. Classically, the path a system actually takes is the one where S is stationary — that single principle reproduces Newton's laws. In quantum mechanics the same quantity reappears as a *phase*: every path contributes e^(iS/ℏ), paths far from the stationary one have wildly varying phases and cancel, and the classical trajectory survives as the place where that cancellation fails.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation"],
  },
  {
    id: "exchange-symmetry",
    title: "Exchange Symmetry",
    definition:
      "Identical particles are not merely similar but genuinely indistinguishable, so swapping two of them must leave every measurable quantity unchanged — which forces the joint state to be either completely symmetric or completely antisymmetric under the swap. That is not a preference but an exhaustive dichotomy in three dimensions: symmetric states are bosons, antisymmetric states are fermions, and the Pauli exclusion principle is the antisymmetric case's immediate consequence.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/identical-particles/indistinguishability",
      "quantum-mechanics/identical-particles/bosons-and-fermions",
    ],
  },
  {
    id: "boson",
    title: "Boson",
    definition:
      "A particle whose multi-particle state is unchanged (symmetric) when two of them are swapped — photons, gluons, helium-4 atoms, and every particle with integer spin. Because the symmetric combination does not vanish when two particles share a state, any number of bosons can occupy the same mode, and the amplitude for doing so is actually *enhanced*. That enhancement is what lasers, Bose-Einstein condensates and superfluidity are built on.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/identical-particles/bosons-and-fermions",
      "quantum-mechanics/identical-particles/indistinguishability",
    ],
  },
  {
    id: "fermion",
    title: "Fermion",
    definition:
      "A particle whose multi-particle state changes sign (is antisymmetric) when two of them are swapped — electrons, protons, neutrons, and every particle with half-integer spin. Antisymmetry makes the state vanish identically if two fermions occupy the same mode, which *is* the Pauli exclusion principle, and it is why atoms have shell structure and matter takes up space at all.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/identical-particles/bosons-and-fermions",
      "quantum-mechanics/identical-particles/the-pauli-exclusion-principle",
    ],
  },
  {
    id: "quantum-number",
    title: "Quantum Number",
    definition:
      "One of the labels that names a state, each being the eigenvalue of some observable the Hamiltonian commutes with — for hydrogen, n (energy), ℓ (orbital angular momentum), mₗ (its component along a chosen axis) and mₛ (spin). A complete set of them specifies the state uniquely, which is exactly the job of a complete set of commuting observables; the allowed values are fixed by the operator algebra, not chosen.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers",
      "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels",
    ],
  },
  {
    id: "ladder-operators",
    title: "Ladder Operators (Raising and Lowering)",
    definition:
      "Operators that step a state up or down a discrete spectrum — a† and a for the harmonic oscillator's energy levels, J₊ and J₋ for angular-momentum projections. They work purely algebraically: from the commutation relations alone, a† applied to an eigenstate returns an eigenstate one rung higher, and the requirement that the ladder terminate is what forces the spectrum to be quantized and bounded, with no differential equation solved anywhere.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/angular-momentum-and-spin/ladder-operators-and-the-angular-momentum-spectrum",
      "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator",
    ],
  },
  {
    id: "spherical-harmonics",
    title: "Spherical Harmonics",
    definition:
      "The functions Yℓᵐ(θ, φ) that describe how a state varies over directions in space — the angular half of any wavefunction in a central potential. They are the simultaneous eigenfunctions of L̂² and L̂_z, they form a complete orthonormal set on the sphere, and because the angular part separates cleanly from the radial part, they are the same for hydrogen as for any other spherically symmetric potential. Atomic orbital shapes are pictures of them.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/angular-momentum-and-spin/orbital-angular-momentum-and-spherical-harmonics",
      "quantum-mechanics/the-hydrogen-atom/the-radial-equation",
    ],
  },
  {
    id: "spin-orbit-coupling",
    title: "Spin-Orbit Coupling",
    definition:
      "The interaction between an electron's spin and its own orbital motion, proportional to L⃗·S⃗. In the electron's rest frame the nucleus orbits it, producing a magnetic field the spin's magnetic moment then responds to. It is the dominant part of hydrogen's fine structure, splitting levels that are degenerate in the simple treatment, and it is why total angular momentum J⃗ = L⃗ + S⃗ rather than L⃗ and S⃗ separately labels the true eigenstates.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/the-hydrogen-atom/fine-structure-introduction",
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/degenerate-perturbation-theory-and-fine-structure",
    ],
  },
  {
    id: "transmission-reflection-coefficients",
    title: "Transmission and Reflection Coefficients",
    definition:
      "For a particle meeting a potential step or barrier, T and R are the fractions of the incident probability current that continue onward and turn back; they satisfy T + R = 1, which is conservation of probability. The quantum result departs from intuition twice: a particle with more than enough energy can still reflect, and one with too little can still transmit, which is tunneling.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential",
      "quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier",
      "quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier",
    ],
    simulatorId: "wavefunction-explorer",
  },
  {
    id: "classically-forbidden-region",
    title: "Classically Forbidden Region",
    definition:
      "Any region where a particle's total energy is below the potential, E < V(x) — territory a classical particle can never enter, and whose boundary is the classical turning point. The wavefunction does not stop there: it changes from oscillating to decaying exponentially, so the probability of finding the particle inside is small but non-zero. A barrier thin enough for that decaying tail to reach the far side is what tunneling is.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier",
      "quantum-mechanics/approximation-methods/the-wkb-approximation",
    ],
    simulatorId: "wavefunction-explorer",
  },
  {
    id: "ehrenfest-theorem",
    title: "Ehrenfest's Theorem",
    definition:
      "The statement that expectation values obey the classical equations of motion: d⟨x⟩/dt = ⟨p⟩/m and d⟨p⟩/dt = −⟨dV/dx⟩. It is the cleanest answer to \"where does classical physics come from\" — and also shows the answer is only approximate, since the exact result involves ⟨dV/dx⟩ rather than dV/dx evaluated at ⟨x⟩. The two agree when the wave packet is narrow compared with the scale on which the force varies, and not otherwise.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/wave-mechanics/free-particle-wave-packets",
      "quantum-mechanics/operators-observables-measurement/the-energy-time-uncertainty-relation",
    ],
  },
  {
    id: "group-velocity-dispersion",
    title: "Group Velocity and Dispersion",
    definition:
      "A wave packet's envelope travels at the group velocity v_g = dω/dk, which for a free particle equals the classical p/m — not at the phase velocity of its individual components. Because ω depends nonlinearly on k, the components travel at different speeds and the packet spreads as it moves: that is dispersion, and it is why a localized free particle inevitably becomes less localized over time.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/wave-mechanics/wave-packet-dynamics-and-dispersion",
      "quantum-mechanics/wave-mechanics/free-particle-wave-packets",
    ],
    simulatorId: "wavefunction-explorer",
  },
  {
    id: "fourier-transform",
    title: "Fourier Transform",
    definition:
      "The operation that rewrites a function as a superposition of waves of definite wavelength, exchanging a description in position for one in momentum. In quantum mechanics it is not a computational trick but a change of basis: ψ(x) and its transform ψ̃(p) are the same state written in the position and momentum bases. The uncertainty principle is then a mathematical property of the transform — narrow in one variable forces wide in the other.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/wave-mechanics/momentum-space-and-the-fourier-transform",
      "quantum-mechanics/classical-to-quantum/position-and-momentum",
    ],
  },
  {
    id: "variational-method",
    title: "Variational Method",
    definition:
      "A way to bound a ground-state energy without solving anything exactly: for *any* normalized trial state, ⟨ψ|Ĥ|ψ⟩ ≥ E₀. So you pick a family of trial states with adjustable parameters, minimize the expectation over them, and the result is a rigorous upper bound that improves as the family grows. This is the exact principle VQE runs on hardware, with a parameterized circuit as the trial family and a classical optimizer doing the minimizing.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/approximation-methods/the-variational-method",
      "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits",
    ],
  },
  {
    id: "wkb-approximation",
    title: "WKB (Semiclassical) Approximation",
    definition:
      "A method for potentials that vary slowly compared with the local wavelength: write the wavefunction as an exponential of a phase and expand in powers of ℏ, giving an oscillating solution where E > V and an exponentially decaying one where E < V. It produces the standard tunneling estimate as an integral of the decay rate across the barrier, and it breaks down exactly at the turning points, where the local wavelength diverges and the connecting formulas have to be patched in.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/approximation-methods/the-wkb-approximation",
      "quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier",
    ],
  },

  // ---------------------------------------------------------------------
  // Hardware and software course vocabulary
  //
  // Third pass, same provenance as the block above — terms the Hardware and
  // Software lesson pass hit in prose and had no entry for. These matter to
  // a beginner out of proportion to their depth, because the homepage links
  // straight to the Rabi Explorer and the platform pages with no lesson in
  // between: a reader can arrive at "Rydberg blockade" or "backend" as the
  // first quantum words they ever read.
  //
  // Deliberately NOT added here, because they already resolve and a near-
  // duplicate would split the anchor: `density-matrix` (the entry is
  // `density-matrices`, plural, which is the id every call site uses),
  // `purity` (covered by `von-neumann-entropy-purity`), `qaoa` and
  // `quantum-fourier-transform` (both already exist, sourced from
  // `CONCEPT_NODES`).
  // ---------------------------------------------------------------------

  {
    id: "josephson-junction",
    title: "Josephson Junction",
    definition:
      "Two superconductors separated by a barrier thin enough for pairs of electrons to tunnel across it — the one nonlinear circuit element that is also lossless. Nonlinearity is what a qubit needs: a purely linear (harmonic) circuit has equally spaced energy levels, so a drive tuned to the 0→1 transition would also drive 1→2 and the state would leak out of the qubit subspace. The junction spaces the levels unevenly, making the lowest two addressable on their own.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-hardware/physical-qubit-platforms/superconducting-qubits",
      "quantum-hardware/control-and-readout/control-electronics",
    ],
  },
  {
    id: "paul-trap",
    title: "Paul Trap (RF Ion Trap)",
    definition:
      "The electrode arrangement that holds charged ions in place using rapidly oscillating radio-frequency fields. It exists because Earnshaw's theorem forbids trapping a charge with static electric fields alone — no static arrangement has a true minimum — so the field is switched fast enough that the ion sees a time-averaged effective potential well instead. Ions held this way form a line, repelling each other, and their shared vibrational modes are what mediate two-qubit gates.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/physical-qubit-platforms/trapped-ions"],
  },
  {
    id: "optical-tweezers",
    title: "Optical Tweezers",
    definition:
      "Tightly focused laser beams that hold individual neutral atoms in place, each atom pulled toward the point of highest intensity. Because the traps are made of light rather than wiring, an array of them can be written with a hologram and individual atoms can be picked up and moved — which is why neutral-atom machines can rearrange their qubit layout between shots, something a fixed superconducting chip cannot do.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/physical-qubit-platforms/neutral-atoms"],
  },
  {
    id: "rydberg-blockade",
    title: "Rydberg Blockade",
    definition:
      "Excite a neutral atom to a Rydberg state — an electron in a very high orbital — and it acquires a huge electric dipole moment. Within a blockade radius of a few microns, one excited atom shifts its neighbour's transition far enough off resonance that the neighbour physically cannot be excited too. That conditional \"only one of you\" is what neutral-atom platforms build their two-qubit entangling gate out of.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/physical-qubit-platforms/neutral-atoms"],
  },
  {
    id: "quantum-dot",
    title: "Quantum Dot",
    definition:
      "A region of semiconductor small enough to confine electrons in all three directions, so its energy levels are discrete — an artificial atom, built with the same lithography that makes transistors. Gate voltages can trap a single electron in one, and that electron's spin is the qubit. The appeal is manufacturability and a footprint measured in tens of nanometres; the difficulty is that no two dots come out identical, so every one must be tuned individually.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/physical-qubit-platforms/spin-qubits"],
  },
  {
    id: "exchange-interaction",
    title: "Exchange Interaction",
    definition:
      "The effective coupling between two spins that arises purely from the antisymmetry of the electronic wavefunction plus Coulomb repulsion — not from any magnetic force between them. In spin-qubit hardware it is the two-qubit gate mechanism: lowering the barrier between neighbouring dots lets the electrons' wavefunctions overlap, switching the coupling on for a controlled time. It is fast and voltage-controlled, which is exactly why the platform is built around it.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-hardware/physical-qubit-platforms/spin-qubits",
      "quantum-mechanics/identical-particles/bosons-and-fermions",
    ],
  },
  {
    id: "dispersive-readout",
    title: "Dispersive Readout",
    definition:
      "Measuring a superconducting qubit by coupling it to a resonator detuned far from the qubit frequency, so the qubit's state shifts the resonator's frequency instead of exchanging energy with it. Probing the resonator and reading the phase of the reflected signal then reveals |0⟩ versus |1⟩ without directly absorbing a photon from the qubit — the detuning is what makes the measurement quantum non-demolition, leaving the measured state intact.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/control-and-readout/qubit-readout-techniques"],
  },
  {
    id: "readout-fidelity",
    title: "Readout Fidelity",
    definition:
      "How often measurement reports the state the qubit was actually in, quoted per state because the two error directions differ: a |1⟩ can relax to |0⟩ during the measurement window, while the reverse is rare. It is usually the *worst* number in a device's error table and it is separate from gate fidelity — which is why a protocol like randomized benchmarking, insensitive to it by construction, gives a different picture than raw measured counts.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-hardware/control-and-readout/qubit-readout-techniques",
      "quantum-hardware/control-and-readout/calibration",
    ],
  },
  {
    id: "error-budget",
    title: "Error Budget",
    definition:
      "An accounting of where a computation's total error comes from — so much from two-qubit gates, so much from readout, so much from idling decoherence, so much from residual crosstalk — with each contribution estimated separately and summed. It is the tool that decides what to fix next, since improving the term that contributes 2% of the total while a 60% term stands is effort spent for nothing.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-hardware/control-and-readout/qubit-readout-techniques",
      "apex/simulation-and-compilation-frontiers/noise-aware-compilation-and-resource-estimation",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
    ],
  },
  {
    id: "native-gate-set",
    title: "Native Gate Set",
    definition:
      "The specific operations a given machine physically implements — often a couple of single-qubit rotations plus one entangling gate, different on every platform. Everything an algorithm asks for must be rewritten into this set before it can run, which is the compiler's job, and the rewrite is not free: a gate that is native on one device may cost several on another, so identical circuits can have very different depths on different hardware.",
    pillar: "quantum-software",
    lessonSlugs: [
      "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition",
      "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation",
    ],
  },
  {
    id: "backend",
    title: "Backend",
    definition:
      "In a quantum SDK, the thing a circuit is actually submitted to — a local simulator, a cloud simulator, or a real processor — selected at run time while the circuit code stays unchanged. A backend advertises its own properties (qubit count, connectivity, native gates, current error rates), and the compiler reads them, so \"the same program\" can produce very different compiled circuits and very different results depending on which one it is sent to.",
    pillar: "quantum-software",
    lessonSlugs: [
      "quantum-software/programming-quantum-computers/quantum-sdks-overview",
      "quantum-software/programming-quantum-computers/simulators-vs-real-hardware",
    ],
  },
  {
    id: "state-vector-simulator",
    title: "State-Vector Simulator",
    definition:
      "A classical program that holds a quantum state as an explicit array of 2ⁿ complex amplitudes and applies each gate as a matrix multiplication. It is exact and gives access to the whole state — amplitudes, probabilities, entanglement measures — none of which real hardware will ever hand you. The limit is memory, not cleverness: every extra qubit doubles the array, so ~30 qubits fits on a laptop and ~50 needs a supercomputer.",
    pillar: "quantum-software",
    lessonSlugs: [
      "quantum-software/simulating-quantum-systems/state-vector-simulation",
      "quantum-software/simulating-quantum-systems/computational-cost-and-scaling",
      "quantum-software/programming-quantum-computers/simulators-vs-real-hardware",
    ],
    simulatorId: "circuit-builder",
  },
  {
    id: "zero-noise-extrapolation",
    title: "Zero-Noise Extrapolation",
    definition:
      "An error-mitigation technique: run the same circuit several times with the noise deliberately amplified by known factors — stretching pulses, or replacing each gate G with G G† G — measure how the result degrades, then extrapolate the trend back to the zero-noise point. It corrects an expectation value, never the state itself, and the extrapolation is a fit, so it carries a model assumption and an error bar that both widen as the amplification does.",
    pillar: "quantum-software",
    lessonSlugs: [
      "quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation",
      "quantum-software/simulating-quantum-systems/noise-simulation",
    ],
    simulatorId: "noise-explorer",
  },
];

const AUTHORED_TERMS: GlossaryTerm[] = [
  ...CONCEPT_NODES.map(fromConceptNode),
  ...ADDITIONAL_GLOSSARY_TERMS,
];

/**
 * The level a term is *assumed* to sit at unless `TERM_LEVEL` says otherwise.
 * Pillar is a good default because the curriculum itself is ordered that way —
 * the Mastery and Apex pillars exist precisely to hold the graduate material —
 * so only the exceptions have to be written down.
 */
const PILLAR_DEFAULT_LEVEL: Record<Pillar, Difficulty> = {
  "quantum-mechanics": "intermediate",
  "quantum-computing": "intermediate",
  "quantum-hardware": "intermediate",
  "quantum-software": "intermediate",
  "quantum-mastery": "advanced",
  apex: "master",
};

/**
 * Explicit level for terms the pillar default gets wrong in either direction:
 * the entries a reader with no background can genuinely read on day one, and
 * the handful of research-level entries filed under an introductory pillar.
 */
const TERM_LEVEL: Record<string, Difficulty> = {
  // Foundational — readable cold, no prerequisites beyond arithmetic.
  amplitude: "foundational",
  basis: "foundational",
  "bloch-sphere-term": "foundational",
  "born-rule": "foundational",
  "circuit-depth": "foundational",
  coherence: "foundational",
  "complex-number": "foundational",
  "computational-basis": "foundational",
  "dilution-refrigerator": "foundational",
  "dirac-notation": "foundational",
  "double-slit-experiment": "foundational",
  entanglement: "foundational",
  "expectation-value": "foundational",
  "gate-fidelity": "foundational",
  "global-relative-phase": "foundational",
  "hadamard-gate": "foundational",
  "inner-product": "foundational",
  "linear-operator": "foundational",
  measurement: "foundational",
  modulus: "foundational",
  nisq: "foundational",
  "noise-decoherence": "foundational",
  normalization: "foundational",
  observable: "foundational",
  "orthonormal-basis": "foundational",
  "pauli-matrices": "foundational",
  "phase-interference": "foundational",
  photon: "foundational",
  "physical-qubit": "foundational",
  "probability-density": "foundational",
  quantization: "foundational",
  "quantum-circuits": "foundational",
  "quantum-gates": "foundational",
  "quantum-register": "foundational",
  "quantum-state": "foundational",
  qubit: "foundational",
  "schrodinger-equation": "foundational",
  "sdks-programming": "foundational",
  shot: "foundational",
  "single-qubit-gates": "foundational",
  span: "foundational",
  "stern-gerlach-experiment": "foundational",
  superposition: "foundational",
  "t1-t2-coherence-times": "foundational",
  "vector-space": "foundational",
  wavefunction: "foundational",
  "wavefunction-collapse": "foundational",
  backend: "foundational",
  boson: "foundational",
  "classically-forbidden-region": "foundational",
  decoherence: "foundational",
  fermion: "foundational",
  "fourier-transform": "foundational",
  hamiltonian: "foundational",
  "josephson-junction": "foundational",
  "optical-tweezers": "foundational",
  "paul-trap": "foundational",
  "quantum-dot": "foundational",
  "quantum-number": "foundational",
  "readout-fidelity": "foundational",
  "rydberg-blockade": "foundational",
  "state-vector-simulator": "foundational",
  trace: "foundational",

  // Advanced, despite sitting under an introductory pillar.
  "classical-action": "advanced",
  propagator: "advanced",
  "wkb-approximation": "advanced",
  "partial-trace": "advanced",
  "randomized-benchmarking": "advanced",
  "stabilizer-formalism": "advanced",
  "surface-codes": "advanced",
  "tensor-network-methods": "advanced",
  "von-neumann-entropy-purity": "advanced",
};

/**
 * Cross-references, declared once and made **mutual** by `buildRelated()`.
 *
 * The point of the pairing is the two-way traffic: a reader who lands on
 * `shot` should be able to walk up to `shot-noise-standard-error`, and a
 * reader who lands on the research entry should be able to walk back down to
 * the plain one. Declaring each relation from whichever side felt natural,
 * then symmetrizing, is what keeps that property from rotting — there is no
 * way to add a link in one direction and forget the other.
 *
 * Exported so `__tests__/glossary.test.ts` can assert every declared id
 * resolves; the *rendered* `relatedIds` are filtered to real entries, so a
 * typo here shows up as a failing test rather than as a dead `#anchor`.
 */
export const TERM_RELATIONS: Record<string, string[]> = {
  qubit: ["quantum-state", "superposition", "physical-qubit", "logical-qubit", "bloch-sphere-term"],
  superposition: ["amplitude", "phase-interference", "computational-basis", "coherence"],
  amplitude: ["born-rule", "complex-number", "global-relative-phase"],
  "born-rule": ["measurement", "expectation-value", "shot"],
  measurement: ["born-rule", "wavefunction-collapse", "computational-basis", "povm"],
  "quantum-state": ["wavefunction", "pure-state", "mixed-state", "density-matrices", "dirac-notation"],
  wavefunction: ["schrodinger-equation", "probability-density", "wave-mechanics", "quantum-state"],
  "schrodinger-equation": ["unitary-evolution", "hamiltonians-time-evolution", "energy-eigenstate"],
  "unitary-evolution": ["unitary-operator", "quantum-gates", "no-cloning-theorem"],
  "expectation-value": ["observable", "shot", "heisenberg-uncertainty-principle"],
  "energy-eigenstate": [
    "eigenvalue-eigenvector",
    "hamiltonians-time-evolution",
    "quantum-harmonic-oscillator",
    "hydrogen-atom",
  ],
  "probability-density": ["normalization", "wavefunction"],
  commutator: [
    "heisenberg-uncertainty-principle",
    "observable",
    "hamiltonian-simulation-trotterization",
    "angular-momentum-spin",
  ],
  "linear-operator": [
    "hermitian-operator",
    "unitary-operator",
    "eigenvalue-eigenvector",
    "observable",
    "self-adjoint-operator",
  ],
  "complex-number": ["modulus", "global-relative-phase"],
  quantization: ["energy-eigenstate", "hydrogen-atom", "quantum-harmonic-oscillator", "photon"],
  photon: ["photonic-qubits", "qkd-bb84"],
  "double-slit-experiment": ["phase-interference", "superposition", "coherence", "stern-gerlach-experiment"],
  coherence: ["noise-decoherence", "t1-t2-coherence-times", "global-relative-phase", "phase-interference"],
  "pure-state": ["mixed-state", "density-matrices", "von-neumann-entropy-purity"],
  "mixed-state": ["density-matrices", "partial-trace", "noise-decoherence", "quantum-state-purification"],
  "hadamard-gate": ["single-qubit-gates", "pauli-matrices", "superposition", "clifford-group"],
  "pauli-matrices": ["single-qubit-gates", "bloch-sphere-term", "stabilizer-formalism", "clifford-group"],
  "quantum-register": ["quantum-circuits", "tensor-product", "computational-basis"],
  "circuit-depth": ["quantum-circuits", "t-count-t-depth", "nisq", "quantum-compilation-transpilation"],
  "universal-gate-set": ["quantum-gates", "solovay-kitaev-theorem", "clifford-group", "t-count-t-depth"],
  oracle: ["deutsch-jozsa", "grovers-algorithm", "query-complexity-black-box-model", "phase-kickback"],
  ansatz: ["vqe", "qaoa", "barren-plateaus", "nisq"],
  shot: ["shot-noise-standard-error", "measurement", "reproducibility-four-components"],
  "logical-qubit": ["physical-qubit", "quantum-error-correction", "surface-codes", "code-distance"],
  "physical-qubit": ["superconducting-qubits", "trapped-ions", "gate-fidelity"],
  nisq: ["quantum-error-mitigation", "quantum-advantage-supremacy", "barren-plateaus"],
  "bells-theorem": ["entanglement", "bell-states", "qkd-bb84"],
  transmon: ["superconducting-qubits", "dilution-refrigerator", "t1-t2-coherence-times", "rabi-oscillation"],
  "t1-t2-coherence-times": ["noise-decoherence", "gate-fidelity", "lindblad-master-equation"],
  "gate-fidelity": ["trace-distance-fidelity", "randomized-benchmarking", "crosstalk", "logical-error-rate"],
  "rabi-oscillation": ["qubit-control", "single-qubit-gates"],
  "dilution-refrigerator": ["qubit-control"],
  "quantum-volume": ["gate-fidelity", "circuit-depth", "quantum-advantage-supremacy", "best-known-classical-baseline"],
  "randomized-benchmarking": ["clifford-group", "calibration-drift"],
  "quantum-error-mitigation": ["quantum-error-correction", "shot", "noise-decoherence"],

  degeneracy: ["eigenvalue-eigenvector", "projector", "perturbation-theory", "spin-orbit-coupling"],
  projector: ["measurement", "observable", "povm", "spectral-theorem-pvm"],
  trace: ["partial-trace", "density-matrices", "von-neumann-entropy-purity"],
  hamiltonian: [
    "schrodinger-equation",
    "energy-eigenstate",
    "hamiltonians-time-evolution",
    "electronic-structure-problem",
  ],
  "perturbation-theory": ["degenerate-perturbation-theory", "variational-method", "wkb-approximation"],
  decoherence: ["coherence", "noise-decoherence", "lindblad-master-equation", "t1-t2-coherence-times"],
  propagator: ["classical-action", "unitary-evolution", "greens-functions-resolvents"],
  "classical-action": ["hamiltonian", "phase-interference"],
  "exchange-symmetry": ["boson", "fermion", "pauli-exclusion-principle"],
  boson: ["fermion", "photon", "quantum-harmonic-oscillator"],
  fermion: ["pauli-exclusion-principle", "jordan-wigner-transformation", "electronic-structure-problem"],
  "quantum-number": ["degeneracy", "hydrogen-atom", "angular-momentum-spin", "spherical-harmonics"],
  "ladder-operators": ["quantum-harmonic-oscillator", "angular-momentum-spin", "coherent-states"],
  "spherical-harmonics": ["angular-momentum-spin", "hydrogen-atom"],
  "spin-orbit-coupling": ["angular-momentum-spin", "degenerate-perturbation-theory", "hydrogen-atom"],
  "transmission-reflection-coefficients": ["quantum-tunneling", "classically-forbidden-region", "wave-mechanics"],
  "classically-forbidden-region": ["quantum-tunneling", "wkb-approximation", "wavefunction"],
  "ehrenfest-theorem": ["expectation-value", "group-velocity-dispersion", "decoherence"],
  "group-velocity-dispersion": ["wave-mechanics", "fourier-transform", "wavefunction"],
  "fourier-transform": [
    "heisenberg-uncertainty-principle",
    "quantum-fourier-transform",
    "orthonormal-basis",
  ],
  "variational-method": ["vqe", "ansatz", "energy-eigenstate", "hamiltonian"],
  "wkb-approximation": ["quantum-tunneling", "perturbation-theory"],

  "josephson-junction": ["transmon", "superconducting-qubits", "quantum-tunneling", "dilution-refrigerator"],
  "paul-trap": ["trapped-ions", "qubit-control"],
  "optical-tweezers": ["neutral-atoms", "rydberg-blockade"],
  "rydberg-blockade": ["neutral-atoms", "cnot-controlled-gates"],
  "quantum-dot": ["spin-qubits", "exchange-interaction", "quantization"],
  "exchange-interaction": ["spin-qubits", "fermion", "exchange-symmetry"],
  "dispersive-readout": ["qubit-control", "readout-fidelity", "transmon", "measurement"],
  "readout-fidelity": ["gate-fidelity", "error-budget", "quantum-error-mitigation"],
  "error-budget": ["gate-fidelity", "crosstalk", "logical-error-rate", "noise-aware-resource-estimation"],
  "native-gate-set": [
    "universal-gate-set",
    "quantum-compilation-transpilation",
    "qubit-routing-swap-overhead",
    "backend",
  ],
  backend: ["sdks-programming", "state-vector-simulator", "shot"],
  "state-vector-simulator": ["quantum-circuit-simulation", "tensor-network-methods", "quantum-register"],
  "zero-noise-extrapolation": ["quantum-error-mitigation", "nisq", "shot"],
};

const AUTHORED_IDS = new Set(AUTHORED_TERMS.map((term) => term.id));

function buildRelated(): Map<string, string[]> {
  const related = new Map<string, Set<string>>();
  const link = (from: string, to: string) => {
    if (from === to || !AUTHORED_IDS.has(from) || !AUTHORED_IDS.has(to)) return;
    if (!related.has(from)) related.set(from, new Set());
    related.get(from)!.add(to);
  };

  for (const [id, targets] of Object.entries(TERM_RELATIONS)) {
    for (const target of targets) {
      link(id, target);
      link(target, id);
    }
  }

  return new Map([...related].map(([id, targets]) => [id, [...targets]]));
}

const RELATED_BY_ID = buildRelated();

function withMetadata(term: GlossaryTerm): GlossaryEntry {
  return {
    ...term,
    level: TERM_LEVEL[term.id] ?? PILLAR_DEFAULT_LEVEL[term.pillar],
    relatedIds: RELATED_BY_ID.get(term.id) ?? [],
  };
}

/** Every glossary term, alphabetically sorted by title. */
export const GLOSSARY_TERMS: GlossaryEntry[] = AUTHORED_TERMS.map(withMetadata).sort((a, b) =>
  a.title.localeCompare(b.title)
);

/**
 * The "Start here" tier, in *reading* order rather than alphabetical — the
 * shortest path from knowing nothing to being able to read an introductory
 * lesson without stopping. Deliberately short: fifteen words a reader can
 * actually finish in one sitting, not a second A-Z.
 */
export const START_HERE_IDS: string[] = [
  "qubit",
  "quantum-state",
  "superposition",
  "amplitude",
  "computational-basis",
  "measurement",
  "born-rule",
  "phase-interference",
  "coherence",
  "entanglement",
  "quantum-gates",
  "quantum-circuits",
  "dirac-notation",
  "shot",
  "noise-decoherence",
];

const TERMS_BY_ID = new Map(GLOSSARY_TERMS.map((term) => [term.id, term]));

/** A glossary term by its stable `id` (the same string `/glossary#<id>` anchors). */
export function getGlossaryTerm(id: string): GlossaryEntry | undefined {
  return TERMS_BY_ID.get(id);
}

/** The `START_HERE_IDS` terms, resolved and in reading order. Unknown ids are dropped. */
export function getStartHereTerms(): GlossaryEntry[] {
  return START_HERE_IDS.map((id) => TERMS_BY_ID.get(id)).filter(
    (term): term is GlossaryEntry => term !== undefined
  );
}
