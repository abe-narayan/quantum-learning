import { CONCEPT_NODES, type ConceptNode, type SimulatorId } from "./concepts";
import type { Pillar } from "./types";

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
];

/** Every glossary term, alphabetically sorted by title. */
export const GLOSSARY_TERMS: GlossaryTerm[] = [
  ...CONCEPT_NODES.map(fromConceptNode),
  ...ADDITIONAL_GLOSSARY_TERMS,
].sort((a, b) => a.title.localeCompare(b.title));
