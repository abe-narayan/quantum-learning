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
];

/** Every glossary term, alphabetically sorted by title. */
export const GLOSSARY_TERMS: GlossaryTerm[] = [
  ...CONCEPT_NODES.map(fromConceptNode),
  ...ADDITIONAL_GLOSSARY_TERMS,
].sort((a, b) => a.title.localeCompare(b.title));
