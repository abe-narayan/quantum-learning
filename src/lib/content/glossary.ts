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
 * `withMetadata()` from the tables below rather than repeated on every object
 * literal, which is also the only thing that lets the terms sourced from
 * `CONCEPT_NODES` (a file this module only reads, and must not edit) carry
 * them at all. So the authored shape and the rendered shape genuinely
 * differ, and `GlossaryTerm` keeps them optional so that either shape
 * satisfies a consumer that only needs id/title/definition/pillar.
 *
 * Everything read off `GLOSSARY_TERMS` gets this narrower type, where both
 * are guaranteed present.
 */
export type GlossaryEntry = Omit<GlossaryTerm, "level" | "relatedIds"> & {
  /**
   * How much background this entry assumes: the same four-level scale
   * courses, lessons and problems already use (`lib/content/types.ts`), so
   * `/glossary` can render it with the identical redundant shape+word
   * encoding `DifficultyMark` uses rather than inventing a parallel one.
   */
  level: Difficulty;
  /**
   * Other glossary ids worth reading next, deliberately two-directional, so
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
 * Terms beyond the 59 already curated in `concepts.ts` for the `/map`
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
  // genuinely unsettled (collapse above all), the entry says so rather
  // than quietly adopting one interpretation as fact.
  // ---------------------------------------------------------------------
  {
    id: "amplitude",
    title: "Amplitude (Probability Amplitude)",
    definition:
      "One of the complex numbers a quantum state is built from, one for each basis state it is written against: the α and β in α|0⟩ + β|1⟩. An amplitude is not itself a probability. The Born rule gives the probability as its squared modulus, |α|², and the reason amplitudes are allowed to be negative or complex is that the phase they carry is what lets them cancel or reinforce when the terms of a superposition combine.",
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
      "The rule that turns a quantum state into probabilities: an outcome's probability is the squared modulus of its amplitude, so ½|0⟩ + (√3/2)|1⟩ gives 0 a quarter of the time and 1 three quarters of the time. In general, measuring |ψ⟩ in an orthonormal basis {|eᵢ⟩} returns outcome i with probability |⟨eᵢ|ψ⟩|². It is a separate postulate, not something unitary evolution produces on its own, and it is why squared moduli rather than the amplitudes themselves are the quantities an experiment can measure.",
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
      "The pair of reference states |0⟩ and |1⟩ a qubit's amplitudes are written against, and for n qubits the 2ⁿ states |x⟩ labeled by bitstrings. Nothing physical singles them out over any other orthonormal basis. It is the convention that lets quantum states be labeled by classical bit values, and \"measure the qubit\" with no basis named means measuring in this one.",
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
      "A physical quantity a measurement can return a value for, represented by a Hermitian operator: its eigenvalues are the possible outcomes and its eigenvectors are the states that give one of those outcomes with certainty. Two observables have simultaneously well-defined values in every state only if their operators commute; where they do not, a particular state can still happen to be sharp for both.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/mathematical-foundations/hermitian-operators",
      "quantum-mechanics/classical-to-quantum/classical-states-and-observables",
      "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized",
    ],
  },
  {
    id: "orthonormal-basis",
    title: "Orthonormal Basis",
    definition:
      "A basis whose vectors are mutually orthogonal and each of unit length: ⟨eᵢ|eⱼ⟩ equals 1 when i = j and 0 otherwise. Every measurement is stated relative to some orthonormal basis, and it is orthonormality that makes the Born-rule probabilities |⟨eᵢ|ψ⟩|² sum to 1 for any normalized state.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality",
      "quantum-computing/qubits-and-quantum-states/dirac-notation",
    ],
  },
  {
    id: "quantum-state",
    title: "Quantum State (State Vector)",
    definition:
      "The single mathematical object holding everything predictable about a quantum system. For a system treated in isolation it is a normalized vector |ψ⟩ in a Hilbert space (a state vector, or pure state); in the general case it is a density matrix, which is what you need once the system is entangled with something else or is a statistical mixture of pure states.",
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
      "The abrupt update of a quantum state on measurement, from a superposition to the outcome observed: for a projective measurement, the normalized projection of |ψ⟩ onto the subspace belonging to that outcome, discarding every other branch. As a calculation the rule is unambiguous and matches every experiment. What physically underlies it is not settled, and interpretations disagree on whether collapse is a real physical process, a bookkeeping update of the observer's description, or an appearance produced by decoherence with no collapse happening at all.",
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
      "The shorthand every quantum text uses: a state goes inside |ψ⟩, a ket, and its partner ⟨ψ|, a bra, turns a ket into a number. Together they make the bracket ⟨φ|ψ⟩, the overlap the Born rule squares into a probability.",
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
      "A geometric picture of a single qubit's state as a point on (or inside, for mixed states) a unit sphere: the poles are |0⟩ and |1⟩, and every other point is a superposition fixed by two angles. The point's coordinates are the *Bloch vector* (⟨X⟩, ⟨Y⟩, ⟨Z⟩), whose length is 1 for a pure state and shrinks toward 0 as the state becomes mixed, which is what noise does to it.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/qubits-and-quantum-states/the-bloch-sphere"],
    simulatorId: "bloch-sphere",
  },
  {
    id: "single-qubit-gates",
    title: "Single-Qubit Gates",
    definition:
      "The operations that act on one qubit at a time: X, Y, Z, Hadamard, and the continuous rotations between them. Every one is a rotation of that qubit's arrow on the Bloch sphere about some axis, which is why they are all reversible and why they can never, on their own, create entanglement between qubits. Written as matrices they are exactly the 2×2 unitaries.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/qubits-and-quantum-states/single-qubit-rotations"],
    simulatorId: "bloch-sphere",
  },
  {
    id: "cnot-controlled-gates",
    title: "CNOT & Controlled Gates",
    definition:
      "A two-qubit gate that flips the target qubit when the control qubit is |1⟩ and leaves it untouched when the control is |0⟩. What makes it more than a classical if-statement is that it never inspects the control: given a control in superposition it acts on both branches at once, which is why a Hadamard followed by a CNOT turns two independent qubits into an entangled Bell pair. Any entangling two-qubit gate can play that role; CNOT is the one circuits are conventionally built from.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-gates-and-circuits/controlled-gates-and-cnot"],
  },
  {
    id: "no-cloning-theorem",
    title: "No-Cloning Theorem",
    definition:
      "The theorem that no physical operation can copy an arbitrary unknown quantum state. It follows from linearity alone (a machine that copies |0⟩ and |1⟩ correctly necessarily gets their superpositions wrong), and it is not a ban on all copying: known states, and any set of mutually orthogonal states, can be duplicated fine. What it rules out is making a backup of something you have not measured, which is why error correction cannot work by duplication and why an eavesdropper cannot silently clone a key.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-gates-and-circuits/the-no-cloning-theorem"],
  },
  {
    id: "quantum-teleportation",
    title: "Quantum Teleportation",
    definition:
      "A protocol that moves an unknown qubit's state to a distant party using a shared entangled pair plus two classical bits, with the qubit itself never travelling. Moves, not copies: the sender's qubit is measured along the way and its original state is gone, which is what keeps the protocol consistent with no-cloning. It is also not faster than light, since until those two classical bits arrive over an ordinary channel the receiver holds a state that says nothing about what was sent.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-gates-and-circuits/quantum-teleportation"],
  },
  {
    id: "superdense-coding",
    title: "Superdense Coding",
    definition:
      "A protocol that sends two classical bits by transmitting just one qubit, made possible by an entangled pair the sender and receiver already share. The entanglement is what is being spent: distributing that pair cost a qubit of its own earlier, and with no pair in hand Holevo's theorem caps a single qubit at one classical bit. The factor of two is real, but it is paid for in advance.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-gates-and-circuits/superdense-coding"],
  },
  {
    id: "qkd-bb84",
    title: "Quantum Key Distribution (BB84)",
    definition:
      "A protocol that lets two parties establish a shared secret key, resting on physics rather than on an unproven assumption about how hard some computation is: an eavesdropper who measures the transmitted qubits in the wrong basis disturbs them, and that disturbance shows up as errors when the two parties compare a sample of their results. Two conditions are load-bearing and routinely dropped when the result is quoted. The classical channel has to be authenticated, or an attacker impersonates each party to the other and the physics never comes into it; and the proof covers the protocol, not the equipment, which is where the practical attacks on deployed systems have landed.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution"],
  },
  {
    id: "tensor-product",
    title: "Tensor Product",
    definition:
      "The operation that combines the state spaces of separate quantum systems into one joint state space. It is what makes multi-qubit states possible at all, and with them entanglement.",
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
      "Two kinds of phase, doing opposite jobs. Multiplying a whole state through by a factor e^(iθ) changes nothing measurable at all: that is a *global* phase, and |ψ⟩ and e^(iθ)|ψ⟩ are the same physical state. A phase applied to only one term of a superposition is a *relative* phase, and that one is measurable, because it decides whether the terms reinforce or cancel when they interfere.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/qubits-and-quantum-states/global-and-relative-phase"],
  },
  {
    id: "deutsch-jozsa",
    title: "Deutsch-Jozsa Algorithm",
    definition:
      "An oracle algorithm that decides whether a function is constant or balanced in a single quantum query, where a classical deterministic algorithm can need exponentially many. David Deutsch posed the one-bit case in 1985, the first problem a quantum algorithm was shown to beat a classical one on, though his original circuit answered only half the time. The 1992 generalization with Richard Jozsa extended it to n-bit inputs, where the exponential query gap appears; the deterministic single-query version came later still.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm"],
  },
  {
    id: "simons-algorithm",
    title: "Simon's Algorithm",
    definition:
      "Recovers a hidden XOR mask: a secret bitstring s such that f(x) = f(x⊕s) for exactly one nonzero s. Each run of the circuit returns a random string orthogonal to s, so about n runs plus linear algebra over F₂ recover s exponentially faster than any classical algorithm; this structure directly inspired Shor's period-finding, which upgrades the XOR shift to a genuine modular period.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-algorithms-i/simons-algorithm"],
  },
  {
    id: "phase-kickback",
    title: "Phase Kickback",
    definition:
      "The trick of moving a phase from where a gate acts to somewhere it can be measured. If the target of a controlled-U is already an eigenstate of U, U cannot change it, so the eigenvalue e^(iθ) shows up instead as a relative phase on the *control* qubit, where interference can detect it. Phase estimation and every oracle algorithm that marks an answer with a minus sign run on this.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-algorithms-i/phase-kickback"],
  },
  {
    id: "quantum-phase-estimation",
    title: "Quantum Phase Estimation",
    definition:
      "An algorithm that reads out the phase a state picks up under a unitary. Given U and an eigenstate |u⟩ with U|u⟩ = e^(2πiφ)|u⟩, controlled powers of U write φ into a t-qubit register as a pattern of relative phases, and the inverse quantum Fourier transform converts that pattern into a t-bit binary estimate of φ. It is the subroutine inside Shor's algorithm and behind most quantum algorithms that extract an eigenvalue.",
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
      "A way of specifying a quantum state by what leaves it alone rather than by writing it out. A state is pinned down uniquely by the group of Pauli operators that fix it (its stabilizers), which for n qubits takes n generators instead of 2ⁿ amplitudes. That compression is what makes error-correcting codes tractable to design, and what makes stabilizer circuits classically simulable.",
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
      "The two standard numbers for how mixed a state is. Purity is Tr(ρ²), equal to 1 exactly for a pure state and falling to 1/d for the maximally mixed state in d dimensions; von Neumann entropy is S(ρ) = −Tr(ρ log₂ρ), equal to 0 exactly for a pure state and rising to log₂d. The two track the same thing in opposite directions: purity falls and entropy rises as a system becomes more entangled with, or decohered by, anything outside it.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/entanglement-and-measurement/purity-entropy-and-information"],
  },
  {
    id: "partial-trace",
    title: "Partial Trace",
    definition:
      "The operation that discards one subsystem of a composite quantum state to obtain the reduced density matrix describing what remains. It is the standard way to describe part of an entangled system on its own.",
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
      "The process of rewriting an abstract quantum circuit into an equivalent one that only uses the gates and qubit connectivity a specific real quantum device supports.",
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
      "Two observables whose operators don't commute, position and momentum being the standard example, cannot both have arbitrarily well-defined values in every state. The product of their uncertainties is bounded below by half the magnitude of their commutator's expectation value, which for position and momentum reduces to the fixed constant ħ/2. For most other pairs that bound depends on which state it is evaluated in and can fall to zero, so non-commuting observables can still happen to be sharp together: L̂ₓ and L̂_y are both exactly zero in an ℓ = 0 state.",
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
      "No two identical fermions (electrons, for instance) can occupy the same complete quantum state at once. It is the principle behind atomic shell structure and the periodic table.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/identical-particles/the-pauli-exclusion-principle"],
  },
  {
    id: "stern-gerlach-experiment",
    title: "Stern-Gerlach Experiment",
    definition:
      "The 1922 experiment that first showed a quantum measurement has only discrete outcomes. A beam of silver atoms passing through an uneven magnetic field split into two separate spots, where a classical magnetic moment free to point in any direction would have smeared out continuously; the two spots are the two possible values of the electron's spin along the field axis.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/angular-momentum-and-spin/the-stern-gerlach-experiment"],
  },
  {
    id: "vector-space",
    title: "Vector Space",
    definition:
      "Any collection of objects that can be added together and scaled by numbers without ever leaving the collection. That is the whole requirement, plus a short list of arithmetic rules like associativity and distributivity. Arrows in space, functions, and columns of complex numbers all qualify, which is why the same linear algebra describes quantum states regardless of what they physically are.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/vector-spaces"],
  },
  {
    // The phrase that carries the definition of a qubit on the entry route,
    // used by `what-is-a-qubit`, `dirac-notation` and
    // `quantum-states-and-state-vectors` before any linear algebra has been
    // taught, and leaned on by `span` and `linear-independence` below. That
    // route's entry bar is "no linear algebra assumed", so this has to read
    // cold: plain arithmetic first, kets only once the idea is already there.
    id: "linear-combination",
    title: "Linear Combination",
    definition:
      "Scale each thing by a number, then add the results. That is the whole operation: 3v + 2w is a linear combination of v and w, and so is 0.6|0⟩ + 0.8|1⟩. The numbers are the coefficients, and in quantum mechanics they are the amplitudes, which is why a qubit state is written as a linear combination of |0⟩ and |1⟩ rather than as a choice between them.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/mathematical-foundations/vector-spaces",
      "quantum-computing/qubits-and-quantum-states/what-is-a-qubit",
      "quantum-computing/qubits-and-quantum-states/quantum-states-and-state-vectors",
    ],
  },
  {
    id: "basis",
    title: "Basis",
    definition:
      "A fixed set of reference directions in which every vector of a space can be written, and written exactly one way, the way any point on a map is one distance east plus one distance north. Formally the set has to be linearly independent and has to span the space; a qubit's standard choice is {|0⟩, |1⟩}. Nothing physical singles out one basis over another, which is why every measurement must say which basis it is made in.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/vector-spaces"],
  },
  {
    id: "span",
    title: "Span",
    definition:
      "The set of every vector reachable as a linear combination of a given collection of vectors. A basis is a spanning set that is also linearly independent.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/vector-spaces"],
  },
  {
    id: "linear-independence",
    title: "Linear Independence",
    definition:
      "A set of vectors is linearly independent if none of them can be written as a linear combination of the others; equivalently, the only way to combine them into the zero vector is with every coefficient equal to zero.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/vector-spaces"],
  },
  {
    id: "eigenvalue-eigenvector",
    title: "Eigenvalue & Eigenvector",
    definition:
      "A vector that an operator (a matrix, once a basis is fixed) only stretches or shrinks and never turns: Av = λv, where the scale factor λ is its eigenvalue. In quantum mechanics this is the entire content of what a measurement can return: an observable's eigenvalues are the values that can come out, and its eigenvectors are the states that give one of them with certainty.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/eigenvalues-and-eigenvectors"],
  },
  {
    id: "hermitian-operator",
    title: "Hermitian Operator",
    definition:
      "An operator left unchanged by transposing it and conjugating every entry, written A = A†. That one condition forces every eigenvalue to be real, which is what lets Hermitian operators stand for physical observables, whose measured values have to be real. In finite dimensions it also hands the operator a full orthonormal eigenbasis, with eigenvectors belonging to different eigenvalues coming out orthogonal on their own. In infinite dimensions that second guarantee is not automatic: position and momentum have no eigenvectors in the space at all, and what the eigenbasis really needs is the stronger condition of self-adjointness.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/hermitian-operators"],
  },
  {
    id: "unitary-operator",
    title: "Unitary Operator",
    definition:
      "An operator that moves a state around without changing its length or its angle to any other state: it preserves every inner product, so total probability stays 1. Equivalently U†U = I, so U is invertible and U† undoes it. Every quantum gate and every closed-system time evolution is a unitary, which is why quantum circuits run backwards as readily as forwards.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/unitary-operators"],
  },
  {
    id: "inner-product",
    title: "Inner Product",
    definition:
      "A generalization of the dot product, ⟨φ|ψ⟩, that takes two vectors and returns a (possibly complex) scalar measuring their overlap. It is the operation underneath norms, orthogonality, and the probabilities the Born rule predicts.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality"],
  },
  {
    id: "hilbert-space",
    title: "Hilbert Space",
    definition:
      "A vector space equipped with an inner product and complete under the norm that inner product defines. It is the setting quantum states formally live in, generalizing familiar Euclidean space to complex, sometimes infinite dimensions.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality"],
  },
  {
    id: "cauchy-schwarz-inequality",
    title: "Cauchy-Schwarz Inequality",
    definition:
      "The bound that two vectors can overlap by at most the product of their lengths: |⟨φ|ψ⟩| ≤ ‖φ‖‖ψ‖, with equality only when one is a scalar multiple of the other. It is what makes ‖ψ‖ behave like a length at all, and it is the single inequality the general Heisenberg uncertainty relation is derived from.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality"],
  },
  {
    id: "taylor-series",
    title: "Taylor Series",
    definition:
      "A way of rebuilding a smooth function from nothing but its value and its derivatives at one point, as an infinite sum of powers. It is how Euler's formula e^(iθ) = cos θ + i sin θ is proved (write out the series for e^x, sin x and cos x and the terms match up), and that identity is what turns quantum phases into rotations.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/mathematical-foundations/complex-numbers-for-physics"],
  },
  {
    id: "modulus",
    title: "Modulus (of a Complex Number)",
    definition:
      "The distance |z| of a complex number z = a + bi from the origin, equal to √(a² + b²). For a quantum amplitude, the squared modulus gives the Born-rule probability of the outcome it belongs to.",
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
      "The nested structure Φ⊂H⊂Φ′ (a space of nice test functions, inside the ordinary Hilbert space, inside a space of generalized functions). Improper eigenstates like |p⟩ have infinite norm and so cannot belong to H itself; Φ′ is where they live, rigorously, as generalized eigenvectors.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/hilbert-space-and-spectral-theory/continuous-spectra-and-rigged-hilbert-space"],
  },
  {
    id: "greens-functions-resolvents",
    title: "Green's Functions & Resolvents",
    definition:
      "A single function of complex energy that encodes a Hamiltonian's entire spectrum. The resolvent R(E)=(E−H)⁻¹ has poles exactly at the discrete bound-state energies and a branch cut along the continuous spectrum, and the Sokhotski–Plemelj identity extracts the spectral density from its boundary values just above the cut.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/hilbert-space-and-spectral-theory/greens-functions-and-resolvents"],
  },
  {
    id: "sturm-liouville-theory",
    title: "Sturm-Liouville Theory",
    definition:
      "The single theorem behind why so many quantum eigenvalue problems come with real eigenvalues and orthogonal eigenfunctions. Any equation of the form (py′)′−qy+λwy=0, with boundary conditions killing a specific boundary term, carries those two guarantees automatically, which is why the infinite well, the harmonic oscillator, and the hydrogen radial equation all share them. The theorem's other conclusions do not travel as far. A purely discrete spectrum and a complete eigenbasis belong to the *regular* problem, on a finite interval with p and w positive at both endpoints; hydrogen's radial equation is singular at the origin and unbounded above, and its spectrum carries a scattering continuum alongside the bound states.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/hilbert-space-and-spectral-theory/sturm-liouville-theory"],
  },
  {
    id: "degenerate-perturbation-theory",
    title: "Degenerate Perturbation Theory",
    definition:
      "When ordinary perturbation theory's energy-denominator formula would divide by zero because unperturbed states are degenerate, the correct zeroth-order states are instead the eigenvectors of the perturbation restricted to the degenerate subspace. This is the fix needed to compute hydrogen's 2p spin-orbit splitting from its L·S coupling.",
    pillar: "quantum-mastery",
    lessonSlugs: [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/degenerate-perturbation-theory-and-fine-structure",
    ],
  },
  {
    id: "coherent-states",
    title: "Coherent States",
    definition:
      "Eigenstates |α⟩ of the harmonic oscillator's (non-Hermitian) annihilation operator, â|α⟩=α|α⟩, with Poisson-distributed photon number and equal position/momentum uncertainty saturating the Heisenberg bound. They are the quantum states that most closely track a classical oscillator trajectory, and what real laser light approximates.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/symmetry-scattering-and-semiclassical-methods/coherent-and-squeezed-states"],
  },
  {
    id: "squeezed-states",
    title: "Squeezed States",
    definition:
      "Minimum-uncertainty harmonic-oscillator states with unequal position and momentum spread, Δx=e⁻ʳ/√2 and Δp=eʳ/√2 for squeeze parameter r, that still saturate ΔxΔp=½ exactly. LIGO and other gravitational-wave detectors use them to push measurement noise on one quadrature below what any coherent state could reach.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/symmetry-scattering-and-semiclassical-methods/coherent-and-squeezed-states"],
  },
  {
    id: "partial-wave-scattering-s-matrix",
    title: "Partial-Wave Scattering & the S-Matrix",
    definition:
      "A central, short-range potential separates 3D scattering into independent angular-momentum channels, each carrying a single phase shift δₗ that encodes the potential's entire effect on that channel; every cross section is built from the {δₗ}, and the S-matrix Sₗ=e^(2iδₗ) has |Sₗ|=1 exactly whenever no absorption occurs. Short range is a load-bearing hypothesis rather than tidiness: the Coulomb tail falls off too slowly for a finite δₗ to exist, so the hydrogen atom's own potential falls outside this treatment and needs the separate Coulomb machinery.",
    pillar: "quantum-mastery",
    lessonSlugs: [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/three-dimensional-scattering-and-the-s-matrix",
    ],
  },
  {
    id: "quantum-state-purification",
    title: "Purification",
    definition:
      "Every mixed state ρ on a system can be written as the reduced state of some pure state on a larger system, a direct corollary of the Schmidt decomposition. The purification is never unique: any unitary acting only on the auxiliary system leaves the reduced state unchanged.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification"],
  },
  {
    id: "choi-jamiolkowski-isomorphism",
    title: "Choi-Jamiolkowski Isomorphism",
    definition:
      "Turns an entire quantum channel into a single ordinary matrix, so that asking whether a map is physically valid becomes a linear-algebra check. The Choi matrix J(E)=Σᵢⱼ|i⟩⟨j|⊗E(|i⟩⟨j|) satisfies J(E)≥0 exactly when the channel is completely positive, and tracing out its output half gives the identity exactly when the channel preserves trace.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-information-theory/quantum-channels-kraus-and-choi"],
  },
  {
    id: "quantum-relative-entropy",
    title: "Quantum Relative Entropy",
    definition:
      "A measure of how costly it is to mistake one quantum state for another. Defined as S(ρ‖σ)=Tr(ρ log₂ρ)−Tr(ρ log₂σ), the quantum generalization of the classical Kullback-Leibler divergence, it is never negative by Klein's inequality and vanishes only when ρ=σ.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-information-theory/relative-entropy-and-mixed-state-entanglement"],
  },
  {
    id: "mixed-state-concurrence",
    title: "Mixed-State Concurrence (Wootters Formula)",
    definition:
      "How much entanglement a two-qubit state has once the state is mixed rather than pure. Wootters' formula C(ρ)=max(0, √μ₁−√μ₂−√μ₃−√μ₄), built from the eigenvalues of R=ρρ̃ in decreasing order for ρ̃=(σy⊗σy)ρ*(σy⊗σy), reduces to the pure-state formula 2|ad−bc| and determines the entanglement of formation, which is a monotonic function of it.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-information-theory/relative-entropy-and-mixed-state-entanglement"],
  },
  {
    id: "oracle-relativization-barrier",
    title: "Relativization Barrier (Baker-Gill-Solovay)",
    definition:
      "A limit on what oracle results can prove. Oracles exist relative to which P=NP, and other oracles relative to which P≠NP, so no proof technique that works identically for every oracle can settle such questions unconditionally. This is why the oracle-relative speedups of Deutsch-Jozsa and Simon's algorithms, however rigorous, say nothing unconditional about BPP versus BQP for ordinary, structured problems.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/advanced-algorithms-and-complexity/bqp-and-oracle-complexity"],
  },
  {
    id: "quantum-phase-estimation-precision",
    title: "Phase Estimation Precision & Approximate QFT",
    definition:
      "Two guarantees about how precise phase estimation really is. First, for a phase not exactly representable in a finite register, the measurement probability follows an exact closed form built from a geometric series, guaranteeing at least 4/π² success probability on the best t-bit estimate. Second, dropping small-angle controlled-phase gates below a cutoff gives an approximate QFT with a provable, exponentially small error bound and far fewer gates.",
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
      "A collection of completely positive maps, one per measurement outcome, that specifies both the outcome probabilities (via the induced POVM) and the post-measurement state. That is strictly more information than the POVM alone, since infinitely many instruments can induce the same POVM while leaving different post-measurement states.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-shannon-theory/povms-and-generalized-measurement"],
  },
  {
    id: "kraus-operators-cptp-maps",
    title: "Kraus Operators & CPTP Maps",
    definition:
      "The standard way to write down what noise does to a quantum state. Any completely positive, trace-preserving (physical) quantum channel takes the form E(ρ)=ΣK_iρK_i† for operators {K_i} satisfying ΣK_i†K_i=I, and the Stinespring dilation theorem shows these Kraus operators are the blocks of a unitary acting on the system plus a fixed environment.",
    pillar: "quantum-mastery",
    lessonSlugs: [
      "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators",
      "quantum-mastery/quantum-shannon-theory/stinespring-dilation-and-channel-purification",
    ],
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
      "The quantity that plays the role of capacity when what a channel carries is quantum information rather than classical bits. Defined as I(A>B)=-S(A|B)=S(ρ_B)-S(ρ_{AB}) for a channel with reference system A and output B, its regularized maximum over channel uses equals the channel's quantum capacity by the Lloyd-Shor-Devetak theorem; it can be negative, signaling a channel through which no quantum information survives.",
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
      "An upper bound on how much classical information can be read out of quantum states. The quantity χ({p_i,ρ_i})=S(Σp_iρ_i)-Σp_iS(ρ_i) bounds what any single measurement can extract from an ensemble of quantum states (Holevo's theorem), and its channel-optimized, regularized value equals the channel's classical capacity by the Holevo-Schumacher-Westmoreland theorem.",
    pillar: "quantum-mastery",
    lessonSlugs: [
      "quantum-computing/quantum-gates-and-circuits/superdense-coding",
      "quantum-mastery/quantum-shannon-theory/capstone-what-can-be-sent-through-noise",
    ],
  },
  {
    id: "entanglement-breaking-channel",
    title: "Entanglement-Breaking Channel",
    definition:
      "A channel that, applied to half of any maximally entangled pair, always leaves a separable (unentangled) output; every entanglement-breaking channel has exactly zero quantum capacity, because no entanglement, and hence no quantum information, survives passage through it even in principle.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-shannon-theory/capstone-what-can-be-sent-through-noise"],
  },
  // ---------------------------------------------------------------------
  // Apex: Algorithmic Frontiers
  // ---------------------------------------------------------------------
  {
    id: "block-encoding",
    title: "Block Encoding",
    definition:
      "A way to load an arbitrary matrix into a quantum computer by hiding it inside a larger unitary. Formally, a unitary U on a system register plus ancilla block-encodes a matrix A with ‖A‖≤1 when (⟨0|_anc⊗I)U(|0⟩_anc⊗I) = A; running U and post-selecting the ancilla on |0⟩ then applies A to a state with probability ‖A|ψ⟩‖².",
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
      "A single-qubit rotation whose angle encodes a number x, the repeatable building block for computing polynomials of x on a quantum computer. The fixed 2×2 unitary W(x) = [[x, i√(1-x²)], [i√(1-x²), x]] = e^{i·arccos(x)·X}, interleaved with tunable phase gates, produces a unitary whose top-left entry is a controllable polynomial in the signal x.",
    pillar: "apex",
    lessonSlugs: ["apex/algorithmic-frontiers/quantum-signal-processing"],
  },
  {
    id: "qsvt-polynomial",
    title: "QSVT Polynomial P(A)",
    definition:
      "One chosen polynomial applied to every singular value of a matrix at once. For a block-encoded matrix A=Σᵢσᵢ|uᵢ⟩⟨vᵢ| and a polynomial P realized via quantum signal processing, QSVT produces a block encoding of the singular value transform of A, which is parity-dependent: Σᵢ P(σᵢ)|uᵢ⟩⟨vᵢ| when P is odd, and Σᵢ P(σᵢ)|vᵢ⟩⟨vᵢ| when P is even, the output block then sitting on the input projector rather than the output one. When A is Hermitian the two forms coincide, both reducing to the eigenvalue transform P(A)=Σᵢ P(λᵢ)|wᵢ⟩⟨wᵢ|; in either case the same polynomial acts independently and simultaneously on each σᵢ.",
    pillar: "apex",
    lessonSlugs: ["apex/algorithmic-frontiers/the-quantum-singular-value-transformation"],
  },
  {
    id: "qubitization",
    title: "Qubitization",
    definition:
      "The structural fact that lets single-qubit signal-processing results lift to whole matrices. Low and Chuang's technique (predating QSVT) embeds a Hamiltonian's block encoding so that it decomposes into independent two-dimensional invariant subspaces, one per eigen/singular value, each behaving exactly like a single-qubit QSP signal rotation; QSVT builds on and generalizes this decomposition.",
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
      "The ratio of a matrix's largest to smallest singular value, κ=σ_max/σ_min; it sets both the degree of the polynomial QSVT needs to approximate 1/x for quantum linear-systems solving and the cost of classical iterative solvers, making it, rather than matrix dimension N alone, the resource cost that decides how hard a linear system is to solve on either kind of computer.",
    pillar: "apex",
    lessonSlugs: ["apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems"],
  },
  {
    id: "dequantization",
    title: "Dequantization",
    definition:
      "The discovery (e.g. Ewin Tang's 2018 result) that, under a classical data-access model analogous to efficient quantum state preparation, a classical algorithm can sometimes match a quantum algorithm's polylogarithmic scaling for certain low-rank problems. It is a concrete caution against claiming an exponential speedup for algorithms like quantum linear-systems solvers without first checking every scope condition.",
    pillar: "apex",
    lessonSlugs: ["apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems"],
  },
  // ---------------------------------------------------------------------
  // Apex: Fault Tolerance Frontiers
  // ---------------------------------------------------------------------
  {
    id: "code-distance",
    title: "Code Distance",
    definition:
      "The minimum weight of any nontrivial logical operator in a stabilizer code, determining how many physical errors it can correct; for the surface code it equals the length of the shortest Pauli string running between two opposite lattice boundaries.",
    pillar: "apex",
    lessonSlugs: [
      "quantum-computing/error-correction-and-fault-tolerance/surface-codes-a-conceptual-introduction",
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
      "quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead",
      "apex/fault-tolerance-frontiers/decoding-surface-codes",
      "apex/fault-tolerance-frontiers/the-threshold-theorem",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
    ],
  },
  {
    id: "lattice-surgery-term",
    title: "Lattice Surgery",
    definition:
      "Merging two adjacent surface-code patches by measuring new joint stabilizers along their shared boundary, which fuses them into one code block that projectively measures the product of their logical operators, then splitting them apart again. It is the standard mechanism for logical multi-qubit gates, and it needs no transversal or long-range operation.",
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
    title: "Eastin-Knill Theorem",
    definition:
      "A no-go result: on any code that detects arbitrary errors on a single physical qubit, the logical gates implementable transversally always form a *finite* group, so they can never be universal. No code gets universality for free, which is why surface-code architectures obtain the non-Clifford T gate by injecting a magic state rather than by applying it transversally.",
    pillar: "apex",
    lessonSlugs: ["apex/fault-tolerance-frontiers/magic-states-and-distillation"],
  },
  {
    id: "gottesman-knill-theorem",
    title: "Gottesman-Knill Theorem",
    definition:
      "The theorem that stabilizer circuits are classically easy. Any circuit built from Clifford gates (H, S, CNOT) plus Pauli measurements, starting from a computational-basis state, can be simulated in time polynomial in qubit count and circuit size, by updating an n×2n binary tableau with simple per-gate bit rules, no matter how entangled the state it produces becomes. Entanglement is therefore not by itself what makes a quantum computer hard to simulate, which is why a fault-tolerant architecture has to pay for the non-Clifford T gate via magic-state distillation.",
    pillar: "apex",
    lessonSlugs: [
      "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation",
      "apex/fault-tolerance-frontiers/magic-states-and-distillation",
      "apex/simulation-and-compilation-frontiers/when-classical-simulation-works",
    ],
  },
  {
    id: "rough-smooth-boundary",
    title: "Rough & Smooth Boundaries",
    definition:
      "The two edge types of a finite surface-code patch: 'rough' where the face (X-type) stabilizers are the ones truncated at the edge, 'smooth' where the vertex (Z-type) ones are. The logical X̄ and Z̄ operators run between them, respectively, as boundary-to-boundary Pauli strings.",
    pillar: "apex",
    lessonSlugs: [
      "apex/fault-tolerance-frontiers/surface-codes-in-depth",
      "apex/fault-tolerance-frontiers/lattice-surgery",
    ],
  },
  // ---------------------------------------------------------------------
  // Apex: Quantum Complexity Theory
  // ---------------------------------------------------------------------
  {
    id: "qma-completeness",
    title: "QMA-Completeness",
    definition:
      "A problem is QMA-complete if it is in QMA and every other QMA problem reduces to it in polynomial time, making it as hard as any problem a quantum computer can efficiently verify: the quantum analogue of NP-completeness. The Local Hamiltonian problem was the first problem shown QMA-complete, via Kitaev's history-state reduction, playing the same role for QMA that 3-SAT plays for NP via Cook-Levin.",
    pillar: "apex",
    lessonSlugs: [
      "apex/quantum-complexity-theory/qma-and-quantum-verification",
      "apex/quantum-complexity-theory/the-local-hamiltonian-problem",
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
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-i/quantum-parallelism-and-the-oracle-model",
      "apex/quantum-complexity-theory/query-complexity-and-lower-bounds",
    ],
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
      "The three proven containments among the classical classes P and NP and the quantum class BQP (P⊆BQP, P⊆NP, and BQP⊆PSPACE), together with the three open questions about how BQP and NP otherwise relate (NP⊆BQP?, BQP⊆NP?, P=BQP?) that popular accounts routinely report as settled fact.",
    pillar: "apex",
    lessonSlugs: ["apex/quantum-complexity-theory/complexity-classes-p-np-and-bqp"],
  },
  {
    id: "random-circuit-sampling",
    title: "Random Circuit Sampling",
    definition:
      "A computational task, sampling from the output distribution of a specific random quantum circuit, chosen because it is conjectured to be classically hard (under the assumption that the polynomial hierarchy does not collapse) while being efficient for a quantum computer. Google's 2019 Sycamore experiment used it as an empirical 'quantum supremacy' demonstration, though it establishes strong conjecture-level evidence for one narrow, practically useless task, not an unconditional proof or a demonstration of advantage on useful problems.",
    pillar: "apex",
    lessonSlugs: ["apex/quantum-complexity-theory/capstone-what-we-know-and-dont"],
  },
  // ---------------------------------------------------------------------
  // Apex: Simulation and Compilation Frontiers
  // ---------------------------------------------------------------------
  {
    id: "matrix-product-state",
    title: "Matrix Product State (MPS)",
    definition:
      "A representation of an n-qubit state as a chain of small tensors connected by bond indices, built by repeated singular value decomposition across each cut; keeping every nonzero singular value makes it an exact rewriting of the state, while truncating the smallest ones gives a controlled approximation.",
    pillar: "apex",
    lessonSlugs: [
      "quantum-software/simulating-quantum-systems/tensor-network-methods",
      "apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states",
    ],
  },
  {
    id: "bond-dimension",
    title: "Bond Dimension",
    definition:
      "The size χ of the shared index linking two adjacent tensors in a matrix product state, equal exactly to the Schmidt rank of the state across that cut. Entanglement entropy bounds it only from below, S ≤ log2 χ, so a volume-law state with S of order n/2 forces χ ≥ 2^(n/2); an area law caps entropy but not exact rank, and what it actually buys is fast singular-value decay, letting a truncated MPS reach accuracy ε with χ = poly(n, 1/ε).",
    pillar: "apex",
    lessonSlugs: [
      "quantum-software/simulating-quantum-systems/tensor-network-methods",
      "apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states",
      "apex/simulation-and-compilation-frontiers/when-classical-simulation-works",
    ],
  },
  {
    id: "clifford-group",
    title: "Clifford Group",
    definition:
      "The group of unitaries that map Pauli operators to Pauli operators under conjugation, generated by Hadamard, the phase gate S, and CNOT. Clifford-only circuits are classically simulable by the Gottesman-Knill theorem no matter how entangled they get, which is why a fault-tolerant algorithm's real cost is measured by its non-Clifford (T) gate count instead.",
    pillar: "apex",
    lessonSlugs: [
      "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation",
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
      "Guarantees that any single-qubit unitary can be approximated to precision ε by O(log^c(1/ε)) gates from a fixed gate set, found efficiently by a classical algorithm. The gate set has to generate a dense subgroup of SU(2) and be closed under inverses, which is the hypothesis most often dropped when the result is quoted: {H, T} qualifies not because it literally contains T† but because T† = T⁷, so the group it generates is inverse-closed. The theorem proves efficient synthesis is always possible; it says nothing about whether the sequence found is the shortest possible for that specific target.",
    pillar: "apex",
    lessonSlugs: [
      "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation",
      "apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting",
    ],
  },
  {
    id: "ross-selinger-synthesis",
    title: "Ross-Selinger (Number-Theoretic) Synthesis",
    definition:
      "A synthesis algorithm that exploits the number-theoretic structure of the ring ℤ[1/√2, i], which is where every entry a Clifford+T circuit can produce lives, to find near-optimal T-count circuits (roughly 3-4·log₂(1/ε)) for compiling single-qubit Rz(θ) rotations. On that structured gate family it beats generic Solovay-Kitaev synthesis by orders of magnitude.",
    pillar: "apex",
    lessonSlugs: ["apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting"],
  },
  {
    id: "qubit-routing-swap-overhead",
    title: "Qubit Routing & SWAP Overhead",
    definition:
      "Mapping a circuit's logical two-qubit gates onto a device's limited connectivity graph forces inserted SWAP gates for every non-adjacent interaction, at a cost of 2(d-1) SWAPs for chain distance d; a noise-aware compiler then chooses, among mappings with identical SWAP overhead, the one that routes the heaviest gate load through the device's best-calibrated qubits and couplers.",
    pillar: "apex",
    lessonSlugs: [
      "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation",
      "apex/simulation-and-compilation-frontiers/noise-aware-compilation-and-resource-estimation",
    ],
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
  // Apex: Research Methods and Synthesis
  // ---------------------------------------------------------------------
  {
    id: "quantum-advantage-supremacy",
    title: "Quantum Advantage / Quantum Supremacy",
    definition:
      "The claim that a quantum device solved or sampled from some specific computational task faster than any known classical approach can; the term compresses a family of quite different sub-claims (which task, compared against which classical baseline, under which unproven hardness assumption) into a single headline word, which is why it needs unpacking rather than a flat accept-or-reject read.",
    pillar: "apex",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-i/capstone-comparing-quantum-advantage",
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
    lessonSlugs: [
      "quantum-hardware/control-and-readout/qubit-readout-techniques",
      "apex/research-methods-and-synthesis/reproducing-and-designing-experiments",
    ],
  },
  {
    id: "reproducibility-four-components",
    title: "Reproducibility Standard (Four Components)",
    definition:
      "A quantum-computing experimental claim counts as reproducible only when it specifies all four of: the exact circuit, the exact hardware or simulator (including a dated calibration snapshot for real hardware), the exact classical post-processing/error-mitigation pipeline, and the statistical uncertainty behind any reported number, meaning shot count and confidence interval.",
    pillar: "apex",
    lessonSlugs: ["apex/research-methods-and-synthesis/reproducing-and-designing-experiments"],
  },
  {
    id: "theorem-heuristic-conjecture-open",
    title: "Theorem / Heuristic / Conjecture / Genuinely Open (Claim Classification)",
    definition:
      "A four-question checklist for classifying any technical claim by its actual evidentiary status: a complete proof makes it a theorem, broad numerical support without a matching proof makes it a heuristic, a motivated-but-unverified theoretical argument makes it a conjecture, and none of these leaves it genuinely open. A single claim can split across tiers depending on which sub-statement is being evaluated.",
    pillar: "apex",
    lessonSlugs: ["apex/research-methods-and-synthesis/distinguishing-theorem-from-heuristic"],
  },
  {
    id: "calibration-drift",
    title: "Calibration Drift",
    definition:
      "The day-to-day change in a real quantum device's physical error rates (gate fidelities, T1/T2 coherence times, readout asymmetry) under temperature fluctuations and slow electronic drift. It is why a result reported without a dated calibration snapshot cannot be fully reproduced even on the identical physical device.",
    pillar: "apex",
    lessonSlugs: [
      "quantum-hardware/control-and-readout/calibration",
      "apex/research-methods-and-synthesis/reproducing-and-designing-experiments",
    ],
  },
  {
    id: "best-known-classical-baseline",
    title: "Best-Known Classical Baseline",
    definition:
      "The strongest classical algorithm and hardware published at the time a quantum-advantage claim was made, which a fair comparison must be measured against rather than a weaker or naive classical method; because 'best known' is a moving target, a later, better classical algorithm narrowing the gap tests the original claim rather than invalidating it.",
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
  // course, read off the actual lesson text under `src/content/lessons/`
  // rather than guessed, that this file, weighted toward research-adjacent
  // terms, had no entry for. Every one of these is a word an introductory lesson
  // uses in running prose while assuming the reader already has it.
  //
  // The house rule for these, and the reason they are worth writing at all:
  // **beginner-legible by the end of the first sentence, technically exact
  // by the end of the last.** A newcomer must be able to stop after sentence
  // one and have gained something true; a graduate reader must be able to
  // finish the entry without finding anything they'd have to unlearn. No
  // analogies that trade accuracy for warmth, and no "it's basically like a
  // coin": an entry that has to lie to be friendly isn't friendly.
  // ---------------------------------------------------------------------

  {
    id: "wavefunction",
    title: "Wavefunction",
    definition:
      "The quantum state of a particle written as a function of position, ψ(x): one complex number for every place the particle could be found. It is the same state vector |ψ⟩ that Dirac notation writes abstractly, just expressed in the position basis, where the coefficients form a continuum rather than a list. |ψ(x)|² is the probability density for finding the particle at x, and the wavefunction's spatial derivative encodes its momentum content.",
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
      "The equation of motion of quantum mechanics: it says how a state changes from one moment to the next, the way Newton's second law does for a classical particle. In its general form iℏ d|ψ⟩/dt = Ĥ|ψ⟩, the motion is generated by the Hamiltonian Ĥ, the system's energy operator. The equation is linear and deterministic, so nothing random enters quantum mechanics through it. Randomness enters only at measurement, through the Born rule.",
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
      "The rule that an isolated quantum system's state changes by a reversible, length-preserving transformation: no information is created or destroyed. Formally the state at time t is |ψ(t)⟩ = U(t)|ψ(0)⟩ with U†U = I, which is what the Schrödinger equation integrates to for a time-independent Hamiltonian, U(t) = e^(−iĤt/ℏ). This is why every quantum gate must be a unitary matrix and why every quantum circuit can, in principle, be run backwards.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/mathematical-foundations/unitary-operators",
      "quantum-computing/qubits-and-quantum-states/quantum-gates",
      "quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation",
    ],
  },
  {
    id: "expectation-value",
    title: "Expectation Value",
    definition:
      "The average result you would get by preparing the same state many times and measuring the same observable each time, written ⟨A⟩ = ⟨ψ|Â|ψ⟩, or Tr(ρÂ) for a mixed state. It is a statistical average over outcomes, not a prediction about any single run, and it need not be a value the measurement can return at all: a qubit's ⟨Z⟩ can be 0.3 even though every individual measurement yields +1 or −1.",
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
      "A state with one definite energy: measure its energy and you get the same value every time. Mathematically it satisfies Ĥ|ψₙ⟩ = Eₙ|ψₙ⟩, and under time evolution it picks up only the global phase e^(−iEₙt/ℏ), which is unobservable, so every measurable property stays constant, hence 'stationary'. Any other state is a superposition of energy eigenstates, and the *relative* phases between those terms do evolve, which is where all quantum dynamics comes from.",
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
      "quantum-mechanics/wave-mechanics/what-is-a-wavefunction",
      "quantum-mechanics/wave-mechanics/probability-density-and-normalization",
    ],
    simulatorId: "wavefunction-explorer",
  },
  {
    id: "commutator",
    title: "Commutator",
    definition:
      "The measure of how much two operators fail to be interchangeable: [Â, B̂] = ÂB̂ − B̂Â, which is zero exactly when applying them in either order gives the same result. Physically it decides whether two observables can have definite values in *every* state: in finite dimensions commuting observables share a full set of eigenstates and are simultaneously measurable, while a non-zero commutator forces the uncertainty relation ΔAΔB ≥ ½|⟨[Â, B̂]⟩|, of which [x̂, p̂] = iℏ giving ΔxΔp ≥ ℏ/2 is the canonical case. That bound is read in a particular state and can go slack: L̂ₓ and L̂_y do not commute, yet both are sharply zero in an ℓ = 0 state.",
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
      "A rule that turns one state vector into another while respecting sums and scalar multiples: Â(α|ψ⟩ + β|φ⟩) = αÂ|ψ⟩ + βÂ|φ⟩. In finite dimensions an operator is just a matrix once a basis is fixed. Linearity is not a simplifying assumption but a postulate of quantum mechanics, and much of what makes quantum information distinctive, the no-cloning theorem above all, follows from it directly.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/mathematical-foundations/vector-spaces",
      "quantum-mechanics/mathematical-foundations/linear-operators",
    ],
  },
  {
    id: "complex-number",
    title: "Complex Number",
    definition:
      "A number of the form a + bi with i² = −1, equivalently a magnitude paired with an angle, re^(iθ), which is the form quantum mechanics almost always uses. Quantum amplitudes are complex because that angle is the *phase*, and phase is what allows two contributions to a probability to cancel; a theory built on real, non-negative numbers alone could add possibilities but never subtract them, and so could not produce interference.",
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
      "The fact that some physical quantities can only take certain discrete values rather than any value on a continuum. It is the observation the whole field is named after, and it is not imposed by hand: solving the Schrödinger equation for a bound system with physically acceptable boundary conditions admits solutions only at particular energies, just as a string clamped at both ends supports only particular harmonics. Unbound systems, by contrast, generally have continuous spectra.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator",
      "quantum-mechanics/wave-mechanics/the-infinite-square-well",
      "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels",
    ],
  },
  {
    id: "photon",
    title: "Photon",
    definition:
      "The quantum of the electromagnetic field: the smallest indivisible amount of light at a given frequency, carrying energy E = hf. A photon is an excitation of a field mode rather than a small ball of light, which is why photon *number* is discrete while the field's phase and polarization remain continuous degrees of freedom. Those degrees of freedom are where photonic quantum computers and quantum key distribution encode their qubits.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-computing/quantum-gates-and-circuits/bb84-quantum-key-distribution",
      "quantum-hardware/physical-qubit-platforms/photonic-qubits",
    ],
  },
  {
    id: "double-slit-experiment",
    title: "Double-Slit Experiment",
    definition:
      "The experiment in which particles sent one at a time through two slits build up an interference pattern on a screen behind them, even though each particle arrives as a single localized hit. The pattern is the Born rule applied to a sum of amplitudes, |ψ₁ + ψ₂|² rather than |ψ₁|² + |ψ₂|², so the fringes are the cross-term. Determining which slit a particle went through, by any means, destroys the pattern, because the which-path information leaves the two paths no longer able to interfere.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/classical-to-quantum/from-classical-to-quantum-probability",
      "quantum-mechanics/classical-to-quantum/superposition-interference-and-phase",
    ],
  },
  {
    id: "coherence",
    title: "Coherence",
    definition:
      "A quantum system has coherence when the relative phases between the branches of its superposition are still well defined, which is the resource interference needs. In the density-matrix picture, coherence lives in the off-diagonal elements of ρ; decoherence is those elements decaying toward zero as the system entangles with its environment, leaving a state that behaves like a classical probabilistic mixture. Every quantum computation is a race against that decay.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices",
      "quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition",
      "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
    ],
    simulatorId: "noise-explorer",
  },
  {
    id: "pure-state",
    title: "Pure State",
    definition:
      "A state about which there is nothing further to know: it can be written as a single state vector |ψ⟩, and its density matrix ρ = |ψ⟩⟨ψ| satisfies ρ² = ρ, so its purity Tr(ρ²) equals 1. A pure state is not a state with a definite measurement outcome: a superposition is perfectly pure and still yields random outcomes. Purity is about the completeness of the description, not the predictability of the result.",
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
      "A state that is a classical probabilistic mixture of quantum states, described by a density matrix ρ = Σᵢ pᵢ|ψᵢ⟩⟨ψᵢ| with purity Tr(ρ²) < 1. Mixedness arises in two quite different ways that the density matrix deliberately does not distinguish: ignorance about which state was prepared, and being one half of an entangled pair, where the reduced state of either half is mixed even though the pair as a whole is pure.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/entanglement-and-measurement/pure-states-and-mixed-states",
      "quantum-computing/entanglement-and-measurement/convex-combinations-and-physical-mixtures",
      "quantum-computing/entanglement-and-measurement/why-entangled-subsystems-are-mixed",
    ],
    simulatorId: "density-matrix-explorer",
  },
  {
    id: "hadamard-gate",
    title: "Hadamard Gate (H)",
    definition:
      "The single-qubit gate that turns a definite basis state into an equal superposition: H|0⟩ = (|0⟩ + |1⟩)/√2 and H|1⟩ = (|0⟩ − |1⟩)/√2. It is its own inverse, and the minus sign in the second line is what makes it more than a coin flip: applying H twice returns the original state exactly, because the two paths interfere rather than merely randomizing. Geometrically it is a 180° Bloch-sphere rotation about the axis halfway between X and Z.",
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
      "The three 2×2 matrices that, with the identity, form a basis for every single-qubit operator. X is the quantum bit flip (X|0⟩ = |1⟩), Z the phase flip (Z|1⟩ = −|1⟩), and Y = iXZ combines both. They are simultaneously Hermitian and unitary, so each is both a valid gate and a measurable observable with eigenvalues ±1. That is why single-qubit error is fully described by X, Z and their product, and why Bloch-sphere coordinates are just ⟨X⟩, ⟨Y⟩, ⟨Z⟩.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/qubits-and-quantum-states/the-bloch-sphere",
      "quantum-computing/qubits-and-quantum-states/single-qubit-rotations",
      "quantum-computing/error-correction-and-fault-tolerance/why-quantum-errors-are-different",
    ],
    simulatorId: "bloch-sphere",
  },
  {
    id: "quantum-register",
    title: "Quantum Register",
    definition:
      "A named collection of qubits treated as one unit, the quantum counterpart of a classical register of bits. The crucial difference is that an n-qubit register is not n independent qubits: its state lives in a 2ⁿ-dimensional space and generally cannot be factored into individual qubit states at all. Algorithms routinely use several registers (a work register and an ancilla or output register) and measure them at different times.",
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
      "The number of sequential layers of gates in a circuit: how many gate times must elapse from input to output, counting gates that act on disjoint qubits in the same layer as one step. Depth, not total gate count, is what competes against a qubit's coherence time, so it is the resource that decides whether a circuit will produce signal or noise on present hardware, and the quantity compilers work hardest to reduce.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-gates-and-circuits/building-quantum-circuits",
      "quantum-software/simulating-quantum-systems/computational-cost-and-scaling",
      "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation",
    ],
    simulatorId: "circuit-builder",
  },
  {
    id: "universal-gate-set",
    title: "Universal Gate Set",
    definition:
      "A finite collection of gates from which any unitary operation can be built to arbitrary accuracy, the quantum analogue of NAND being universal for classical logic. Any entangling two-qubit gate plus a suitable set of single-qubit gates suffices; the standard fault-tolerant choice is Clifford+T. Universality is an approximation result, not an exact one, and the Solovay-Kitaev theorem bounds how many gates the approximation costs.",
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
      "A subroutine an algorithm is allowed to call but not look inside, used to state a problem in terms of how many *queries* a solution needs rather than how much total computation. On a quantum computer an oracle must be a unitary, so a function f is supplied reversibly as Uf|x⟩|y⟩ = |x⟩|y ⊕ f(x)⟩, and because it is unitary it can be queried on a superposition of inputs. Oracle separations are rigorous but relative: they bound query cost inside this model, not the cost of any particular real implementation.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-i/quantum-parallelism-and-the-oracle-model",
      "quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm",
      "quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion",
    ],
    simulatorId: "grover-explorer",
  },
  {
    id: "ansatz",
    title: "Ansatz",
    definition:
      "A guessed form for a solution, with free parameters left in to be fixed later; in variational quantum algorithms, a fixed circuit shape whose rotation angles a classical optimizer tunes. The choice is a genuine trade-off rather than a detail: an ansatz expressive enough to contain the true answer may be untrainable (barren plateaus) or too deep for real hardware, while a hardware-friendly one may not contain the state being searched for at all.",
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
      "One execution of a quantum circuit, from state preparation through measurement, producing exactly one classical bitstring. Because measurement is probabilistic, a single shot tells you almost nothing; a result is a histogram over many shots, typically thousands. The statistical error on any estimate from N shots falls only as 1/√N, so halving an error bar costs four times the runtime, which is why shot count is a first-class budget line in any experiment.",
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
      "A real two-level quantum system in hardware (a transmon circuit, a trapped ion, an electron spin), as distinct from the idealized qubit of an algorithm. Physical qubits are noisy, imperfectly identical, connected only to their neighbours, and drift between calibrations, and every one of those properties shows up in what a circuit can be run on them. Error correction's job is to assemble many of them into far fewer, far better logical qubits.",
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
      "One qubit of an algorithm, encoded across many physical qubits by an error-correcting code so that errors on the constituents can be detected and undone without disturbing the encoded state. The exchange rate is severe, thousands of physical qubits per logical qubit at plausible error rates, and it only pays off once physical error rates sit below the code's threshold. That is why 'how many qubits' is an ambiguous question until it says which kind.",
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
      "The current era of hardware: devices with roughly 50 to a few thousand physical qubits, too many to simulate naively but far too few and too noisy to run error correction. NISQ is a description of a constraint, not a class of algorithms: circuits must stay shallow enough to finish before decoherence does. Whether any NISQ-era algorithm delivers a practical advantage over classical methods remains genuinely open.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-hardware/noise-decoherence-and-scaling/roadmaps-to-fault-tolerance",
      "quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope",
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
      "Post-processing and circuit-level techniques (zero-noise extrapolation, probabilistic error cancellation, readout-error correction) that recover a better estimate of a noiseless expectation value from noisy runs, without encoding anything. Mitigation does not correct the quantum state and cannot make a computation fault-tolerant; it buys accuracy with extra shots, and that sampling cost typically grows exponentially in the circuit's noise, which caps how far it can be pushed.",
    pillar: "quantum-software",
    lessonSlugs: [
      "quantum-software/simulating-quantum-systems/noise-simulation",
      "quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation",
    ],
    simulatorId: "noise-explorer",
  },
  {
    id: "transmon",
    title: "Transmon",
    definition:
      "The superconducting circuit that most large quantum processors use as their qubit: a Josephson junction shunted by a large capacitor, cooled to ~10 mK, whose lowest two energy levels serve as |0⟩ and |1⟩. The large shunt capacitance is the design's whole point: it flattens sensitivity to stray charge, buying orders of magnitude in coherence time at the cost of weaker anharmonicity, which is what then limits how fast gates can be driven without leaking into the third level.",
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
      "The two numbers that summarize how long a qubit stays usable. T₁ is the energy-relaxation time, how long before |1⟩ decays to |0⟩. T₂ is the total coherence time, how long before the relative phase of a superposition is randomized, and it is not a mechanism of its own: relaxation and pure dephasing both destroy phase, and their rates add as 1/T₂ = 1/(2T₁) + 1/T_φ, where T_φ is the pure-dephasing time. Calling T₂ \"the dephasing time\" is common shorthand and it is the same word doing two jobs. T₂ ≤ 2T₁ falls straight out of that sum, since 1/T_φ cannot be negative, and holds under Markovian dynamics, where both decays are genuine exponentials and the two times are rates rather than curve fits, which is the regime that defines T₁ and T₂ as rates at all. Under slow correlated noise the coherence envelope is not exponential, and a fitted T₂ is then a shape parameter that need not respect the ceiling. Either way T₂ usually comes out far shorter, since low-frequency noise dephases a qubit long before it loses energy. A circuit's total duration must sit well inside T₂.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise",
      "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
    ],
    simulatorId: "noise-explorer",
  },
  {
    id: "gate-fidelity",
    title: "Gate Fidelity",
    definition:
      "How closely a gate as actually performed matches the unitary it was supposed to be, reported as a number just under 1: 99.9% fidelity means an error rate of 10⁻³ per gate. Errors compound roughly multiplicatively, so a 1000-gate circuit at 99.9% has already lost most of its signal, and fidelity is the quantity that must fall below a code's threshold before error correction helps rather than hurts. The figure is meaningful only alongside how it was measured.",
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
      "The periodic driving of a qubit between |0⟩ and |1⟩ by a resonant control pulse, which is how a single-qubit gate is physically performed. The population oscillates sinusoidally at the Rabi frequency, which is proportional to the drive amplitude, so gate angle is set by pulse area: a pulse driving half a period is an X gate, a quarter-period pulse creates an equal superposition. Calibrating a gate begins with measuring this curve.",
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
      "The machine that keeps a superconducting processor colder than anything in nature, near 10 millikelvin. That is physics, not caution: a transmon's |0⟩–|1⟩ splitting is only a few GHz, so unless the thermal energy kT sits well below hf, heat alone excites the qubit before any computation starts. The cooling comes from pumping ³He across a phase boundary in a ³He/⁴He mixture. Every line into the cold stage is also a heat leak, a real limit on scaling.",
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
      "A single-number benchmark for a whole device rather than one component: the largest n for which the machine can run random square circuits on n qubits, of depth n, and still beat a fixed statistical threshold; IBM's convention reports the result as QV = 2ⁿ, so passing at n = 6 means a quantum volume of 64. Because it folds qubit count, gate fidelity, connectivity and compiler quality into one figure, it resists the failure mode of quoting qubit count alone, but it saturates for large machines and says nothing about performance on any specific algorithm.",
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
      "The standard protocol for measuring average gate error: run random sequences of Clifford gates of increasing length, each followed by the inversion that should return the qubit to its start, and fit how the survival probability decays with sequence length. Because the answer comes from a decay *rate*, it is insensitive to state-preparation and measurement error, which is why a quoted fidelity should say whether it came from this or from full process tomography. Fitting a single exponential is itself an assumption: noise that drifts over the run, or that depends on which gate was applied, produces a curve that one number does not summarize.",
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
  // several settled for a near-miss: `eigenvalue-eigenvector` standing in
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
      "When two or more independent states share the same eigenvalue (the same energy, say), that eigenvalue is degenerate, and the measurement that returns it no longer picks out a unique state. What comes back instead is the whole eigenspace, so a measurement can only project onto that subspace, and choosing a basis inside it needs a second, commuting observable. Degeneracy is almost always the fingerprint of a symmetry, and a perturbation that breaks the symmetry splits the level.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/operators-observables-measurement/spectral-decomposition-and-degeneracy",
      "quantum-mechanics/operators-observables-measurement/complete-sets-of-commuting-observables",
      "quantum-mechanics/operators-observables-measurement/degeneracy-in-practice",
    ],
  },
  {
    id: "projector",
    title: "Projector (Projection Operator)",
    definition:
      "An operator that keeps the part of a state lying in some subspace and discards the rest: P = |φ⟩⟨φ| for a single direction, or a sum of such terms for a larger subspace. Projectors are Hermitian and idempotent (P² = P), which is the statement that projecting twice changes nothing. They are the language measurement is written in: the Born-rule probability is ⟨ψ|P|ψ⟩ and the post-measurement state is P|ψ⟩ renormalized.",
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
      "The sum of a matrix's diagonal entries, Tr(A) = Σᵢ Aᵢᵢ. Two properties make it indispensable here: it does not depend on the basis you compute it in, and it is cyclic, Tr(ABC) = Tr(BCA). Those give the two facts density matrices rest on: Tr(ρ) = 1 says probabilities sum to one, and ⟨A⟩ = Tr(ρA) computes any expectation value without ever choosing a basis.",
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
      "The operator representing a system's total energy, written Ĥ, usually kinetic plus potential: p̂²/2m + V(x̂). It plays two roles at once: its eigenvalues are the energies a measurement can return, and it *generates time evolution* through the Schrödinger equation, so writing down Ĥ is what specifies a physical system completely. Finding a Hamiltonian's ground-state energy is also the problem most quantum algorithms for chemistry and materials are ultimately trying to solve.",
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
      "A method for a problem you cannot solve exactly but which is close to one you can: write Ĥ = Ĥ₀ + λV̂ with the correction small, and expand the energies and states in powers of λ. The first-order energy shift is just the expectation of the perturbation in the unperturbed state, ⟨n|V̂|n⟩. The expansion assumes the level in question is non-degenerate and well separated; degenerate levels need the degenerate version, and the series is generally asymptotic rather than convergent.",
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
      "The loss of a superposition's relative phase to the environment. Nothing about it is mysterious or extra: the system becomes entangled with degrees of freedom no one tracks, and once those are traced out, the reduced density matrix's off-diagonal terms decay away, leaving something that behaves exactly like a classical probabilistic mixture. It is fast, and faster the larger and warmer the system, which is why classical behaviour emerges and why a quantum computer must finish before it happens.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators",
      "quantum-mechanics/advanced-quantum-mechanics/decoherence-and-the-quantum-to-classical-transition",
      "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise",
    ],
    simulatorId: "noise-explorer",
  },
  {
    id: "propagator",
    title: "Propagator",
    definition:
      "The amplitude for a particle to go from one place and time to another, K(x_f, t_f; x_i, t_i) = ⟨x_f|Û(t_f − t_i)|x_i⟩, the object that, integrated against an initial wavefunction, produces the wavefunction later. In the path-integral formulation it is computed by summing e^(iS/ℏ) over *every* path connecting the endpoints, with S the classical action, which is what makes the classical trajectory the stationary-phase path rather than the only one.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation"],
  },
  {
    id: "classical-action",
    title: "Classical Action (and Lagrangian)",
    definition:
      "The action S is the time integral of the Lagrangian L = T − V (kinetic minus potential energy) along a path. Classically, the path a system takes is the one where S is stationary, and that single principle reproduces Newton's laws. In quantum mechanics the same quantity reappears as a *phase*: every path contributes e^(iS/ℏ), paths far from the stationary one have wildly varying phases and cancel, and the classical trajectory survives as the place where that cancellation fails.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/advanced-quantum-mechanics/the-path-integral-formulation"],
  },
  {
    id: "exchange-symmetry",
    title: "Exchange Symmetry",
    definition:
      "Identical particles are not merely similar but genuinely indistinguishable, so swapping two of them must leave every measurable quantity unchanged, which forces the joint state to be either completely symmetric or completely antisymmetric under the swap. That is not a preference but an exhaustive dichotomy in three dimensions: symmetric states are bosons, antisymmetric states are fermions, and the Pauli exclusion principle is the antisymmetric case's immediate consequence.",
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
      "A particle whose multi-particle state is unchanged (symmetric) when two of them are swapped: photons, gluons, helium-4 atoms, and every particle with integer spin. Because the symmetric combination does not vanish when two particles share a state, any number of bosons can occupy the same mode, and the amplitude for doing so is *enhanced*. That enhancement is what lasers, Bose-Einstein condensates and superfluidity are built on.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/identical-particles/indistinguishability",
      "quantum-mechanics/identical-particles/bosons-and-fermions",
    ],
  },
  {
    id: "fermion",
    title: "Fermion",
    definition:
      "A particle whose multi-particle state changes sign (is antisymmetric) when two of them are swapped: electrons, protons, neutrons, and every particle with half-integer spin. Antisymmetry makes the state vanish identically if two fermions occupy the same mode, which *is* the Pauli exclusion principle, and it is why atoms have shell structure and matter takes up space at all.",
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
      "One of the whole or half-integer labels naming a state: for hydrogen, n fixes the energy, ℓ the orbital angular momentum, mₗ its component along a chosen axis, and mₛ the spin. Each is the value of a quantity that stays put as the state evolves, so enough of them name the state uniquely (a complete set of commuting observables). Which values are allowed is fixed by the operator algebra, not chosen.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels",
      "quantum-mechanics/the-hydrogen-atom/orbitals-and-quantum-numbers",
    ],
  },
  {
    id: "ladder-operators",
    title: "Ladder Operators (Raising and Lowering)",
    definition:
      "Operators that step a state up or down a discrete spectrum: a† and a for the harmonic oscillator's energy levels, J₊ and J₋ for angular-momentum projections. They work purely algebraically: from the commutation relations alone, a† applied to an eigenstate returns an eigenstate one rung higher, and the requirement that the ladder terminate is what forces the spectrum to be quantized and bounded, with no differential equation solved anywhere.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator",
      "quantum-mechanics/angular-momentum-and-spin/ladder-operators-and-the-angular-momentum-spectrum",
    ],
  },
  {
    id: "spherical-harmonics",
    title: "Spherical Harmonics",
    definition:
      "The functions Yℓᵐ(θ, φ) that describe how a state varies over directions in space: the angular half of any wavefunction in a central potential. They are the simultaneous eigenfunctions of L̂² and L̂_z, they form a complete orthonormal set on the sphere, and because the angular part separates cleanly from the radial part, they are the same for hydrogen as for any other spherically symmetric potential. Atomic orbital shapes are pictures of them.",
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
      "The interaction between an electron's spin and its own orbital motion, proportional to L⃗·S⃗. In the electron's rest frame the nucleus orbits it, producing a magnetic field the spin's magnetic moment then responds to. It is the term in hydrogen's fine structure that *splits* levels the simple treatment leaves degenerate (the relativistic kinetic-energy correction, comparable in size, shifts levels without separating them by j), and it is why total angular momentum J⃗ = L⃗ + S⃗ rather than L⃗ and S⃗ separately labels the true eigenstates.",
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
      "quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier",
      "quantum-mechanics/one-dimensional-systems/scattering-off-a-step-potential",
      "quantum-mechanics/one-dimensional-systems/resonant-transmission-through-a-barrier",
    ],
    simulatorId: "wavefunction-explorer",
  },
  {
    id: "classically-forbidden-region",
    title: "Classically Forbidden Region",
    definition:
      "Any region where a particle's total energy is below the potential, E < V(x): territory a classical particle can never enter, bounded by the classical turning point. The wavefunction does not stop there: it changes from oscillating to decaying exponentially, so the probability of finding the particle inside is small but non-zero. A barrier thin enough for that decaying tail to reach the far side is what tunneling is.",
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
      "The statement that expectation values obey the classical equations of motion: d⟨x⟩/dt = ⟨p⟩/m and d⟨p⟩/dt = −⟨dV/dx⟩. It is the cleanest answer to \"where does classical physics come from\", and it also shows that answer is only approximate, since the exact result involves ⟨dV/dx⟩ rather than dV/dx evaluated at ⟨x⟩. The two agree when the wave packet is narrow compared with the scale on which the force varies, and not otherwise.",
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
      "A wave packet's envelope travels at the group velocity v_g = dω/dk, which for a free particle equals the classical p/m, not at the phase velocity of its individual components. Because ω depends nonlinearly on k, the components travel at different speeds and the packet spreads as it moves: that is dispersion, and it is why a localized free particle inevitably becomes less localized over time.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/wave-mechanics/free-particle-wave-packets",
      "quantum-mechanics/wave-mechanics/wave-packet-dynamics-and-dispersion",
    ],
    simulatorId: "wavefunction-explorer",
  },
  {
    id: "fourier-transform",
    title: "Fourier Transform",
    definition:
      "The operation that rewrites a function as a superposition of waves of definite wavelength, exchanging a description in position for one in momentum. In quantum mechanics it is not a computational trick but a change of basis: ψ(x) and its transform ψ̃(p) are the same state written in the position and momentum bases. The uncertainty principle is then a mathematical property of the transform: narrow in one variable forces wide in the other.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/classical-to-quantum/position-and-momentum",
      "quantum-mechanics/wave-mechanics/momentum-space-and-the-fourier-transform",
    ],
  },
  {
    id: "variational-method",
    title: "Variational Method",
    definition:
      "A way to bound a ground-state energy without solving anything exactly: for *any* normalized trial state, ⟨ψ|Ĥ|ψ⟩ ≥ E₀. So you pick a family of trial states with adjustable parameters, minimize the expectation over them, and the result is a rigorous upper bound that improves as the family grows. This is the exact principle VQE runs on hardware, with a parameterized circuit as the trial family and a classical optimizer doing the minimizing.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits",
      "quantum-mechanics/approximation-methods/the-variational-method",
    ],
  },
  {
    id: "wkb-approximation",
    title: "WKB (Semiclassical) Approximation",
    definition:
      "A method for potentials that vary slowly compared with the local wavelength: write the wavefunction as an exponential of a phase and expand in powers of ℏ, giving an oscillating solution where E > V and an exponentially decaying one where E < V. It produces the standard tunneling estimate as an integral of the decay rate across the barrier, and it breaks down exactly at the turning points, where the local wavelength diverges and the connecting formulas have to be patched in.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/wave-mechanics/tunneling-and-the-finite-barrier",
      "quantum-mechanics/approximation-methods/the-wkb-approximation",
    ],
  },

  // ---------------------------------------------------------------------
  // Hardware and software course vocabulary
  //
  // Third pass, same provenance as the block above: terms the Hardware and
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
      "Two superconductors separated by a barrier thin enough for pairs of electrons to tunnel across it, and the one nonlinear circuit element that is also lossless. Nonlinearity is what a qubit needs: a purely linear (harmonic) circuit has equally spaced energy levels, so a drive tuned to the 0→1 transition would also drive 1→2 and the state would leak out of the qubit subspace. The junction spaces the levels unevenly, making the lowest two addressable on their own.",
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
      "The electrode arrangement that holds charged ions in place using rapidly oscillating radio-frequency fields. It exists because Earnshaw's theorem forbids trapping a charge with static electric fields alone (no static arrangement has a true minimum), so the field is switched fast enough that the ion sees a time-averaged effective potential well instead. Ions held this way form a line, repelling each other, and their shared vibrational modes are what mediate two-qubit gates.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/physical-qubit-platforms/trapped-ions"],
  },
  {
    id: "optical-tweezers",
    title: "Optical Tweezers",
    definition:
      "Tightly focused laser beams that hold individual neutral atoms in place, each atom pulled toward the point of highest intensity. Because the traps are made of light rather than wiring, an array of them can be written with a hologram and individual atoms can be picked up and moved, which is why neutral-atom machines can rearrange their qubit layout between shots, something a fixed superconducting chip cannot do.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/physical-qubit-platforms/neutral-atoms"],
  },
  {
    id: "rydberg-blockade",
    title: "Rydberg Blockade",
    definition:
      "Excite a neutral atom to a Rydberg state (an electron in a very high orbital) and it acquires a huge electric dipole moment. Within a blockade radius of a few microns, one excited atom shifts its neighbour's transition far enough off resonance that the neighbour cannot be excited too. That conditional \"only one of you\" is what neutral-atom platforms build their two-qubit entangling gate out of.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/physical-qubit-platforms/neutral-atoms"],
  },
  {
    id: "quantum-dot",
    title: "Quantum Dot",
    definition:
      "A region of semiconductor small enough to confine electrons in all three directions, so its energy levels are discrete: an artificial atom, built with the same lithography that makes transistors. Gate voltages can trap a single electron in one, and that electron's spin is the qubit. The appeal is manufacturability and a footprint measured in tens of nanometres; the difficulty is that no two dots come out identical, so every one must be tuned individually.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/physical-qubit-platforms/spin-qubits"],
  },
  {
    id: "exchange-interaction",
    title: "Exchange Interaction",
    definition:
      "The effective coupling between two spins that arises purely from the antisymmetry of the electronic wavefunction plus Coulomb repulsion, not from any magnetic force between them. In spin-qubit hardware it is the two-qubit gate mechanism: lowering the barrier between neighbouring dots lets the electrons' wavefunctions overlap, switching the coupling on for a controlled time. It is fast and voltage-controlled, which is why the platform is built around it.",
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
      "Measuring a superconducting qubit by coupling it to a resonator detuned far from the qubit frequency, so the qubit's state shifts the resonator's frequency instead of exchanging energy with it. Probing the resonator and reading the phase of the reflected signal then reveals |0⟩ versus |1⟩ without directly absorbing a photon from the qubit. The detuning is what makes the measurement quantum non-demolition, leaving the measured state intact.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/control-and-readout/qubit-readout-techniques"],
  },
  {
    id: "readout-fidelity",
    title: "Readout Fidelity",
    definition:
      "How often a measurement reports the qubit's true state, quoted per state because the two error directions differ: a |1⟩ can relax to |0⟩ during the measurement window, while the reverse is rare. It is usually the *worst* number in a device's error table, and it is separate from gate fidelity, which is why a protocol like randomized benchmarking, insensitive to it by construction, gives a different picture than raw measured counts.",
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
      "An accounting of where a computation's total error comes from: so much from two-qubit gates, so much from readout, so much from idling decoherence, so much from residual crosstalk, each contribution estimated separately and summed. It is the tool that decides what to fix next, since improving the term that contributes 2% of the total while a 60% term stands is effort spent for nothing.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-hardware/control-and-readout/qubit-readout-techniques",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
      "apex/simulation-and-compilation-frontiers/noise-aware-compilation-and-resource-estimation",
    ],
  },
  {
    id: "native-gate-set",
    title: "Native Gate Set",
    definition:
      "The specific operations a given machine physically implements, often a couple of single-qubit rotations plus one entangling gate, and different on every platform. Everything an algorithm asks for must be rewritten into this set before it can run, which is the compiler's job, and the rewrite is not free: a gate that is native on one device may cost several on another, so identical circuits can have very different depths on different hardware.",
    pillar: "quantum-software",
    lessonSlugs: [
      "quantum-software/compilation-and-hybrid-algorithms/quantum-compilation-and-transpilation",
      "quantum-software/compilation-and-hybrid-algorithms/gate-decomposition",
    ],
  },
  {
    id: "backend",
    title: "Backend",
    definition:
      "In a quantum SDK, the thing a circuit is submitted to: a local simulator, a cloud simulator, or a real processor, chosen at run time while the circuit code stays unchanged. A backend advertises its own properties (qubit count, connectivity, native gates, current error rates), and the compiler reads them, so \"the same program\" can produce very different compiled circuits and very different results depending on which one it is sent to.",
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
      "A classical program that holds a quantum state as an explicit array of 2ⁿ complex amplitudes and applies each gate as a matrix multiplication. It is exact and gives access to the whole state (amplitudes, probabilities, entanglement measures), none of which real hardware will ever hand you. The limit is memory, not cleverness: every extra qubit doubles the array, so 20 qubits is 17 MB, 30 is 17 GB, and 50 is 18 petabytes, past any machine that exists.",
    pillar: "quantum-software",
    lessonSlugs: [
      "quantum-software/programming-quantum-computers/simulators-vs-real-hardware",
      "quantum-software/simulating-quantum-systems/state-vector-simulation",
      "quantum-software/simulating-quantum-systems/computational-cost-and-scaling",
    ],
    simulatorId: "circuit-builder",
  },
  {
    id: "zero-noise-extrapolation",
    title: "Zero-Noise Extrapolation",
    definition:
      "An error-mitigation technique: run the same circuit several times with the noise deliberately amplified by known factors (stretching pulses, or replacing each gate G with G G† G), measure how the result degrades, then extrapolate the trend back to the zero-noise point. It corrects an expectation value, never the state itself, and the extrapolation is a fit, so it carries a model assumption and an error bar that both widen as the amplification does.",
    pillar: "quantum-software",
    lessonSlugs: [
      "quantum-software/simulating-quantum-systems/noise-simulation",
      "quantum-software/compilation-and-hybrid-algorithms/quantum-error-mitigation",
    ],
    simulatorId: "noise-explorer",
  },

  // ---------------------------------------------------------------------
  // High-frequency terms the corpus glosses in passing
  //
  // Words the lesson prose leans on repeatedly across several courses
  // without a home entry: helper qubits, the two basic error types, the
  // named noise channels, and the acronyms (CHSH, LOCC) whose expansions a
  // reader should be able to look up. Same house rule as above: readable
  // cold by the end of sentence one, exact by the end of the entry.
  // ---------------------------------------------------------------------

  {
    id: "ancilla",
    title: "Ancilla Qubit",
    definition:
      "An extra helper qubit added to a circuit, prepared in a known state and used as workspace rather than to hold the data being computed on. Ancillas let a circuit learn about its data qubits without measuring them directly: syndrome extraction, phase kickback, and block encodings all park intermediate information on an ancilla and read or reuse it from there.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-i/phase-kickback",
      "quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map",
    ],
    simulatorId: "syndrome-explorer",
  },
  {
    id: "dephasing",
    title: "Dephasing",
    definition:
      "Noise that scrambles the phase relationship between |0⟩ and |1⟩ without changing which of them a measurement would find. It is the process behind the T2 coherence time: no energy is exchanged, but superpositions decay into classical mixtures, which is why T2 can be much shorter than T1 and why dephasing, rather than energy loss, often sets the practical limit on circuit depth.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise",
      "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
    ],
    simulatorId: "noise-explorer",
  },
  {
    id: "ground-state",
    title: "Ground State",
    definition:
      "The lowest-energy state a quantum system can occupy. Measuring the energy of a system in its ground state always returns the smallest eigenvalue E₀ of its Hamiltonian; finding that state for molecules and materials is the goal of VQE and quantum phase estimation, and in superconducting hardware the qubit's |0⟩ is the transmon's own ground state.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/classical-to-quantum/the-quantum-harmonic-oscillator",
      "quantum-mechanics/wave-mechanics/the-infinite-square-well",
      "quantum-computing/quantum-algorithms-ii/the-variational-principle-and-ansatz-circuits",
    ],
    simulatorId: "wavefunction-explorer",
  },
  {
    id: "bit-flip-phase-flip-errors",
    title: "Bit-Flip & Phase-Flip Errors",
    definition:
      "The two basic kinds of error a qubit can suffer: a bit flip (Pauli X) swaps |0⟩ and |1⟩ like a classical bit error, while a phase flip (Pauli Z) flips the sign between them, an error with no classical counterpart. Correcting both is enough to correct any single-qubit error at all, because an arbitrary single-qubit error can be written as a combination of the identity, X, Z, and their product Y; this discretization of continuous errors is what makes quantum error correction possible.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/error-correction-and-fault-tolerance/why-quantum-errors-are-different",
      "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code",
      "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-phase-flip-code",
    ],
    simulatorId: "syndrome-explorer",
  },
  {
    id: "chsh-inequality",
    title: "CHSH Inequality",
    definition:
      "A numerical test that separates quantum entanglement from every classical explanation. Four correlation measurements combine into one number S; any theory with local, pre-existing values obeys |S| ≤ 2, while quantum mechanics reaches 2√2 ≈ 2.83 on a Bell state (Tsirelson's bound), so a measured S above 2 is direct experimental evidence against local hidden variables.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables",
      "quantum-computing/entanglement-and-measurement/the-chsh-inequality",
    ],
    simulatorId: "chsh-bell-test",
  },
  {
    id: "amplitude-damping",
    title: "Amplitude Damping",
    definition:
      "The noise channel describing energy loss: an excited qubit decays toward |0⟩, the way an atom emits a photon and falls to its ground state. With decay probability γ its Kraus operators are K₀ = [[1, 0], [0, √(1−γ)]] and K₁ = [[0, √γ], [0, 0]], and it is the channel behind the T1 relaxation time.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators",
      "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
      "quantum-software/simulating-quantum-systems/noise-simulation",
    ],
    simulatorId: "noise-explorer",
  },
  {
    id: "transversal-gate",
    title: "Transversal Gate",
    definition:
      "A logical gate implemented by applying one physical gate to each qubit of a code block independently, with no physical gate touching two qubits of the same block. An error on one physical qubit can then spread to at most one qubit per block, so transversal gates are automatically fault-tolerant; the Eastin-Knill theorem proves no code can make a universal gate set transversal, which is why surface-code architectures inject T gates via magic states instead.",
    pillar: "apex",
    lessonSlugs: [
      "apex/fault-tolerance-frontiers/lattice-surgery",
      "apex/fault-tolerance-frontiers/magic-states-and-distillation",
    ],
  },
  {
    id: "locc",
    title: "LOCC (Local Operations & Classical Communication)",
    definition:
      "What two separated parties can do without exchanging any quantum systems: local operations and classical communication, meaning each manipulates and measures their own qubits and they compare notes over an ordinary channel. Entanglement is precisely the resource LOCC cannot create or increase, which makes 'how many Bell pairs can LOCC extract' the operational basis of entanglement measures such as distillable entanglement and entanglement of formation.",
    pillar: "quantum-mastery",
    lessonSlugs: [
      "quantum-mastery/quantum-information-theory/relative-entropy-and-mixed-state-entanglement",
      "quantum-mastery/quantum-shannon-theory/the-data-processing-inequality",
      "quantum-mastery/quantum-shannon-theory/entanglement-distillation-and-typical-subspaces",
    ],
  },

  // ---------------------------------------------------------------------
  // Gaps found by sweeping the lesson corpus for bolded / <Term>-worthy
  // vocabulary with no entry
  //
  // Each of these is a word the corpus teaches under its own heading, in
  // several cases under its own *lesson*, and then had nowhere to send a
  // reader who did not already have it. Frequency was the filter, not a
  // target: `product state` appears in 26 lessons, `T gate` in 49,
  // `syndrome` in 23, `entanglement entropy` in 11, and each of
  // `concurrence` and `amplitude amplification` has a lesson named after
  // it. Same house rule as the blocks above: readable cold by the end of
  // the first sentence, exact by the end of the entry.
  // ---------------------------------------------------------------------

  {
    id: "product-state",
    title: "Product State (Separable State)",
    definition:
      "A multi-qubit state that *can* be split back into a definite state for each qubit separately, |ψ⟩ = |a⟩⊗|b⟩, so describing the parts describes the whole and measuring one qubit tells you nothing about the other. It is the exact complement of entanglement: a pure state is entangled precisely when it is not a product state. For mixed states the corresponding word is *separable* (a probabilistic mixture of product states), and deciding whether a given mixed state is separable is computationally hard in general.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-gates-and-circuits/multi-qubit-state-vectors",
      "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement",
      "quantum-computing/entanglement-and-measurement/why-entangled-subsystems-are-mixed",
    ],
    simulatorId: "two-qubit-explorer",
  },
  {
    id: "entanglement-entropy",
    title: "Entanglement Entropy",
    definition:
      "The standard number for how entangled the two halves of a system are: throw one half away and measure how mixed what remains has become. Formally S(ρ_A) = −Tr(ρ_A log₂ρ_A) for the reduced state of half A, which is 0 for a product state and 1 for a Bell pair. It measures entanglement only when the *whole* state is pure; for a globally mixed state the same quantity also counts ordinary classical ignorance, which is why mixed states need measures like concurrence instead.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/entanglement-and-measurement/purity-entropy-and-information",
      "quantum-computing/entanglement-and-measurement/entanglement-entropy-for-pure-states",
      "apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states",
    ],
    simulatorId: "density-matrix-explorer",
  },
  {
    id: "concurrence",
    title: "Concurrence",
    definition:
      "A single number from 0 to 1 saying how entangled two qubits are, computable straight from the amplitudes without any partial trace. For a pure state a|00⟩ + b|01⟩ + c|10⟩ + d|11⟩ it is C = 2|ad − bc|, which is 0 exactly for a product state and 1 for a Bell state. Its value for mixed states requires Wootters' formula, and it is defined for two qubits only; there is no equally clean generalization to larger systems.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/entanglement-and-measurement/concurrence-a-two-qubit-measure",
      "quantum-computing/entanglement-and-measurement/capstone-analyzing-quantum-correlations",
    ],
    simulatorId: "two-qubit-explorer",
  },
  {
    id: "ghz-state",
    title: "GHZ State",
    definition:
      "The n-qubit generalization of a Bell pair, (|00…0⟩ + |11…1⟩)/√2: every qubit correlated with every other, built by one Hadamard followed by a chain of CNOTs. Its entanglement is maximally fragile: losing or measuring a single qubit leaves the rest in an unentangled classical mixture, unlike the W state, which stays entangled. That fragility makes it the standard stress test for a device's multi-qubit coherence.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-gates-and-circuits/building-quantum-circuits",
      "quantum-software/programming-quantum-computers/writing-your-first-circuit",
    ],
    simulatorId: "circuit-builder",
  },
  {
    id: "amplitude-amplification",
    title: "Amplitude Amplification",
    definition:
      "The mechanism underneath Grover's algorithm, stated on its own: given any circuit that prepares a state with some small amplitude on the outcomes you want, repeating a two-reflection step rotates amplitude toward those outcomes a fixed angle at a time, so a success probability p is reached in about 1/√p repetitions instead of the 1/p a classical retry loop needs. The quadratic gain is the whole speedup, and the count matters: overshooting the right number of repetitions rotates past the target and makes the answer *less* likely.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion",
      "quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification",
    ],
    simulatorId: "grover-explorer",
  },
  {
    id: "t-gate",
    title: "T Gate (π/8 Gate)",
    definition:
      "The single-qubit gate that adds a 45° phase to |1⟩, diag(1, e^(iπ/4)), the square root of the phase gate S. Its importance is entirely about what it is *not*: it is the standard non-Clifford gate, and Clifford gates alone are classically simulable, so Clifford+T is the usual universal set and the T gate is where a quantum computation's real power sits. In the surface code it also cannot be applied transversally and must be injected via a distilled magic state, which is why T-count, not total gate count, is the cost that resource estimates track.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation",
      "apex/fault-tolerance-frontiers/magic-states-and-distillation",
      "apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting",
    ],
  },
  {
    id: "syndrome-measurement",
    title: "Syndrome Measurement",
    definition:
      "The measurement that asks an encoded block \"did something go wrong, and where?\" without asking what the encoded state is. Ancilla qubits are entangled with the data so that measuring them returns only the parity checks (the *syndrome*), leaving the protected superposition untouched; the syndrome pattern then names which correction to apply. Learning nothing about the encoded data is the point, not a limitation: a measurement that revealed it would collapse the very state the code exists to protect.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code",
      "quantum-computing/error-correction-and-fault-tolerance/stabilizer-formalism-basics",
      "quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map",
    ],
    simulatorId: "syndrome-explorer",
  },

  // ---------------------------------------------------------------------
  // Notation the corpus reads with and never defines
  //
  // Three more sweep results, of a different kind from the block above:
  // not concepts the lessons teach under a heading, but the machinery the
  // *other entries in this file* are written in. The dagger appears in 50
  // lessons and inside a dozen definitions here (U†U = I, A = A†, ΣK†K = I)
  // with nowhere to send a reader who does not have it; "completeness
  // relation" (12 lessons) and "spectral decomposition" (13, plus a lesson
  // named after it) were reachable only via `spectral-theorem-pvm`, which
  // is a master-level entry about unbounded operators and projection-valued
  // measures: the right entry for a different reader. Same house rule:
  // readable cold by the end of the first sentence, exact by the end.
  // ---------------------------------------------------------------------

  {
    id: "adjoint",
    title: "Adjoint (Conjugate Transpose, †)",
    definition:
      "For a matrix, the operator you get by transposing it and conjugating every entry, written A† and read \"A dagger\". What defines it is how it moves across an inner product, ⟨φ|Aψ⟩ = ⟨A†φ|ψ⟩, which is also why a bra is written ⟨ψ| = (|ψ⟩)†: the bra is the ket's adjoint. The two operator families quantum mechanics is built from are named by it, Hermitian meaning A = A† and unitary meaning U† = U⁻¹.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/mathematical-foundations/bra-ket-formalism",
      "quantum-mechanics/mathematical-foundations/hermitian-operators",
      "quantum-mechanics/mathematical-foundations/unitary-operators",
    ],
  },
  {
    id: "completeness-relation",
    title: "Completeness Relation (Resolution of the Identity)",
    definition:
      "The statement that an orthonormal basis's projectors add up to doing nothing at all: Σᵢ |eᵢ⟩⟨eᵢ| = I. Read the other way it is a licence to insert a basis anywhere in an expression for free, which is how ⟨φ|ψ⟩ becomes Σᵢ ⟨φ|eᵢ⟩⟨eᵢ|ψ⟩ and how a state gets expanded into components in the first place. It needs a basis that spans the whole space: sum over only some of the terms and you get a projector onto a subspace instead, which is what one measurement outcome corresponds to.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality",
      "quantum-mechanics/mathematical-foundations/bra-ket-formalism",
      "quantum-computing/qubits-and-quantum-states/dirac-notation",
    ],
  },
  {
    id: "spectral-decomposition",
    title: "Spectral Decomposition",
    definition:
      "Rewriting a Hermitian operator on a finite-dimensional space as a list of what measuring it can return: A = Σᵢ λᵢPᵢ, summed over the *distinct* eigenvalues λᵢ, where Pᵢ projects onto the entire eigenspace belonging to λᵢ. In that form the operator is nothing but \"which values can come out, and onto what does each one project\", so the Born rule reads straight off it. The more familiar Σᵢ λᵢ|eᵢ⟩⟨eᵢ|, summed over eigenvectors, is the same statement only when no eigenvalue is degenerate.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/mathematical-foundations/hermitian-operators",
      "quantum-mechanics/operators-observables-measurement/spectral-decomposition-and-degeneracy",
      "quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized",
    ],
  },
  // ---------------------------------------------------------------------
  // Words the file's own entries lean on and never define
  //
  // A fourth sweep, filtered by frequency in the lesson and problem corpora
  // and by whether an existing entry already sends the reader somewhere
  // useful. "Norm" appears in 40 lessons and 21 problems (and inside
  // `hilbert-space` and `unitary-operator` here); "eigenbasis" in 26 and 11
  // (and inside `observable`, `commutator`, `degeneracy` and
  // `spectral-decomposition`); the S gate in 16 and 6, cited by name in both
  // `t-gate` and `clifford-group` with nowhere to go; "wave packet" in 12
  // and 6, with a Wave Mechanics lesson named after it and both
  // `group-velocity-dispersion` and `ehrenfest-theorem` assuming it.
  //
  // Deliberately NOT added: `bloch-vector`, which would split the
  // `bloch-sphere-term` anchor. That entry now names the Bloch vector and
  // gives its length instead.
  // ---------------------------------------------------------------------

  {
    id: "norm",
    title: "Norm (Length of a State Vector)",
    definition:
      "The length of a vector, written ‖ψ‖ and computed from the inner product as √⟨ψ|ψ⟩. It is what \"normalized\" refers to: a physical quantum state is one whose norm is 1, so that the Born-rule probabilities of a full set of outcomes add to 1. Unitary operators are exactly the ones that leave every norm unchanged, which is why gates and time evolution can never create or destroy probability.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/mathematical-foundations/inner-products-and-orthogonality",
      "quantum-mechanics/mathematical-foundations/unitary-operators",
      "quantum-mechanics/mathematical-foundations/probability-and-quantum-states",
    ],
  },
  {
    id: "eigenbasis",
    title: "Eigenbasis",
    definition:
      "A basis made entirely of eigenvectors of one operator. Written in its own eigenbasis that operator is diagonal, with its eigenvalues down the diagonal, which is why finding an eigenbasis is usually the whole work of solving a quantum problem. In finite dimensions every Hermitian operator has an orthonormal one, and two of them share an eigenbasis exactly when they commute, which is what lets both observables hold definite values at once. An operator with a continuous spectrum, position being the standard case, has no eigenbasis at all, so commuting alone does not buy a shared one there.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/mathematical-foundations/eigenvalues-and-eigenvectors",
      "quantum-mechanics/operators-observables-measurement/spectral-decomposition-and-degeneracy",
      "quantum-mechanics/operators-observables-measurement/simultaneous-eigenstates-and-compatible-observables",
    ],
  },
  {
    id: "phase-gate",
    title: "Phase Gate (S)",
    definition:
      "The single-qubit gate diag(1, i): it leaves |0⟩ untouched and advances the phase of |1⟩ by 90°, a quarter turn about the Bloch sphere's z-axis. S is the square of the T gate, but unlike T it is a Clifford gate, so H, S and CNOT together generate only circuits a classical computer can simulate. That is the reason a fault-tolerant computation is costed in T gates and not in these.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/qubits-and-quantum-states/quantum-gates",
      "quantum-computing/qubits-and-quantum-states/global-and-relative-phase",
      "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation",
    ],
    simulatorId: "bloch-sphere",
  },
  {
    id: "wave-packet",
    title: "Wave Packet",
    definition:
      "A superposition of many momentum components that adds up to a wavefunction localized in one region, which is how quantum mechanics describes a particle that is somewhere in particular rather than spread over all space. The narrower the packet in position, the wider the range of momenta it has to contain, so a wave packet is the uncertainty principle made concrete; and because those components travel at different speeds, a free packet spreads as it moves.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/wave-mechanics/momentum-space-and-the-fourier-transform",
      "quantum-mechanics/wave-mechanics/free-particle-wave-packets",
      "quantum-mechanics/wave-mechanics/wave-packet-dynamics-and-dispersion",
    ],
    simulatorId: "wavefunction-explorer",
  },
  // ---------------------------------------------------------------------
  // Reported missing by the lesson passes
  //
  // Ten words the lesson agents hit while reading the corpus and could not
  // gloss, because `<Term id>` had nothing to point at. Two are notation the
  // Mechanics pillar reads with from Wave Mechanics onward (both deltas, the
  // sifting property included, since that is the form the position-space
  // integrals are written in). The rest are Computing-pillar vocabulary a
  // lesson names in a heading and then relies on: the second half of a Grover
  // iteration, the problem Shor's algorithm really solves and the two
  // classical pieces bolted either side of it, the assumption Bell's theorem
  // kills, the escape hatch every oracle separation depends on, the gate that
  // prices classical logic in T counts, and fault tolerance itself, which
  // until now was reachable only through `quantum-threshold-theorem`, a
  // narrower claim about one specific guarantee.
  // ---------------------------------------------------------------------

  {
    id: "dirac-delta",
    title: "Dirac Delta",
    definition:
      "Not a function but a distribution: δ(x − x′) is zero everywhere except at x = x′, where it spikes sharply enough that its total integral is 1. What makes it useful is the sifting property, ∫f(x′)δ(x − x′)dx′ = f(x), which collapses an integral to the integrand's value at a single point and is how a double integral in position space usually becomes a single one. It is the continuum's Kronecker delta: ⟨x|x′⟩ = δ(x − x′) is what orthonormality means for position eigenstates, and it is also why those states have infinite norm and need a rigged Hilbert space rather than an ordinary one.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/wave-mechanics/what-is-a-wavefunction",
      "quantum-mastery/hilbert-space-and-spectral-theory/continuous-spectra-and-rigged-hilbert-space",
      "quantum-mastery/hilbert-space-and-spectral-theory/greens-functions-and-resolvents",
    ],
  },
  {
    id: "kronecker-delta",
    title: "Kronecker Delta",
    definition:
      "Shorthand for whether two indices match: δᵢⱼ is 1 when i = j and 0 otherwise. Written this way, ⟨eᵢ|eⱼ⟩ = δᵢⱼ says in one symbol that a basis is orthonormal, and dropping it into a sum collapses that sum to one term, Σⱼ cⱼδᵢⱼ = cᵢ. Where the label varies continuously instead of by whole steps, the Dirac delta plays the same role.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/mathematical-foundations/unitary-operators",
      "quantum-mechanics/mathematical-foundations/tensor-products-and-composite-systems",
      "quantum-mechanics/wave-mechanics/what-is-a-wavefunction",
    ],
  },
  {
    id: "grover-diffusion-operator",
    title: "Grover Diffusion Operator",
    definition:
      "The second half of a Grover iteration, and the step that turns the oracle's invisible sign flip into a visible change in probability. It is the reflection 2|s⟩⟨s| − I about the uniform superposition |s⟩, built in practice as H^⊗n(2|0⟩⟨0| − I)H^⊗n, and it is often called \"inversion about the mean\" because that is what reflecting about |s⟩ does to a list of amplitudes. Oracle then diffusion, repeated, rotates amplitude onto the marked item, which is why about √N repetitions do what a classical search needs N tries for.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion",
      "quantum-computing/quantum-algorithms-i/grovers-algorithm-amplitude-amplification",
    ],
    simulatorId: "grover-explorer",
  },
  {
    id: "order-finding",
    title: "Order Finding (Period Finding)",
    definition:
      "The problem Shor's algorithm really solves: given a and N, find the smallest r > 0 with aʳ ≡ 1 (mod N), the *order* of a modulo N. Factoring reduces to it by a purely classical argument, so this one subroutine is the only place a quantum computer is needed; the same circuit reads the period off any function with f(x) = f(x + r), which is why the two names get used interchangeably. Brute force costs exponential time and no efficient classical method is known.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding",
      "quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit",
      "quantum-computing/quantum-algorithms-ii/worked-example-factoring-15",
    ],
    simulatorId: "period-finding-explorer",
  },
  {
    id: "modular-exponentiation",
    title: "Modular Exponentiation",
    definition:
      "Computing aˣ mod N, and on a quantum computer computing it reversibly for every x at once: |x⟩|0⟩ → |x⟩|aˣ mod N⟩. It is the arithmetic that makes Shor's algorithm periodic, since aˣ mod N repeats with period equal to the order of a, and it is also the algorithm's dominant gate cost by a wide margin. It is the one piece of Shor's circuit this platform does not build gate by gate; the period-finding lesson supplies its output and says so.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding",
      "quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit",
      "quantum-computing/quantum-algorithms-ii/worked-example-factoring-15",
    ],
  },
  {
    id: "continued-fractions-algorithm",
    title: "Continued Fractions Algorithm",
    definition:
      "The classical post-processing at the end of Shor's algorithm. Phase estimation returns a t-bit approximation to s/r for some unknown s, and expanding that number as a continued fraction lists the best rational approximations with small denominators in turn, one of which is s/r itself, handing back the order r as an exact integer. It is ordinary number theory running on a laptop, and it is the reason an approximate quantum measurement can still produce an exact answer.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit",
      "quantum-computing/quantum-algorithms-ii/capstone-hybrid-algorithms-nisq-and-honest-scope",
    ],
  },
  {
    id: "local-hidden-variable",
    title: "Local Hidden-Variable Theory",
    definition:
      "The kind of theory Bell's theorem rules out: one where each outcome is already fixed before the measurement by properties the particles carry with them (the *hidden variables*), and no outcome depends on which setting a distant experimenter chose (*local*). It is what \"the particles agreed in advance\" would have to mean, and it is testable rather than philosophical, because it forces |S| ≤ 2 in the CHSH experiment and real measurements come out above that. What fails is the conjunction, so giving up locality is one way out and giving up definite pre-existing values is another.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables",
      "quantum-computing/entanglement-and-measurement/the-chsh-inequality",
    ],
    simulatorId: "chsh-bell-test",
  },
  {
    id: "promise-problem",
    title: "Promise Problem",
    definition:
      "A problem whose input is guaranteed in advance to be one of a restricted set of cases, with the algorithm free to do anything at all on inputs that break the guarantee. Deutsch-Jozsa promises the function is constant or balanced and nothing in between; Simon's promises f is 2-to-1 under a single hidden mask. The promise does real work: it is what lets one query settle the question, and it is why these exponential separations do not carry over to the unrestricted problems people want solved.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-i/the-deutsch-jozsa-algorithm",
      "quantum-computing/quantum-algorithms-i/simons-algorithm",
      "quantum-computing/quantum-algorithms-i/capstone-comparing-quantum-advantage",
    ],
  },
  {
    id: "toffoli-gate",
    title: "Toffoli Gate (CCNOT)",
    definition:
      "The three-qubit gate that flips its target exactly when both control qubits are |1⟩. It matters twice over: it is universal for *classical* reversible computation, so any classical circuit can be run on quantum hardware by rewriting it in Toffolis, and it is not a Clifford gate, so each one has to be paid for in T gates. The standard Clifford+T construction spends 15 gates, 7 of them T gates, which is a concrete price tag for one line of classical logic inside a fault-tolerant algorithm.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
    ],
  },
  {
    id: "fault-tolerance",
    title: "Fault Tolerance",
    definition:
      "Error correction assumes the correcting machinery works. Fault tolerance is the harder requirement that it need not: encoding, syndrome extraction and the logical gates are themselves built from faulty components, so a fault-tolerant design is one in which a single physical fault cannot spread into more errors than the code can still fix. That constraint is what forces transversal gates, repeated syndrome rounds, and magic-state injection instead of the obvious circuits, and it is the condition under which the threshold theorem's promise applies at all.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead",
      "apex/fault-tolerance-frontiers/magic-states-and-distillation",
      "apex/fault-tolerance-frontiers/the-threshold-theorem",
    ],
  },
];

const AUTHORED_TERMS: GlossaryTerm[] = [
  ...CONCEPT_NODES.map(fromConceptNode),
  ...ADDITIONAL_GLOSSARY_TERMS,
];

/**
 * The level a term is *assumed* to sit at unless `TERM_LEVEL` says otherwise.
 * Pillar is a good default because the curriculum itself is ordered that way
 * (the Mastery and Apex pillars exist to hold the graduate material), so only
 * the exceptions have to be written down.
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
  // Foundational: readable cold, no prerequisites beyond arithmetic.
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
  "linear-combination": "foundational",
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
  "ground-state": "foundational",
  "product-state": "foundational",
  adjoint: "foundational",
  norm: "foundational",
  eigenbasis: "foundational",
  "phase-gate": "foundational",
  "wave-packet": "foundational",
  "dirac-delta": "foundational",
  "kronecker-delta": "foundational",

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
  "modular-exponentiation": "advanced",
  "continued-fractions-algorithm": "advanced",
  "fault-tolerance": "advanced",
};

/**
 * Cross-references, declared once and made **mutual** by `buildRelated()`.
 *
 * The point of the pairing is the two-way traffic: a reader who lands on
 * `shot` should be able to walk up to `shot-noise-standard-error`, and a
 * reader who lands on the research entry should be able to walk back down to
 * the plain one. Declaring each relation from whichever side felt natural,
 * then symmetrizing, is what keeps that property from rotting: there is no
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
  "linear-combination": ["vector-space", "span", "superposition", "amplitude"],
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

  // High-frequency terms added alongside their entries.
  ancilla: ["quantum-error-correction", "phase-kickback", "naimark-dilation-theorem", "block-encoding"],
  dephasing: ["t1-t2-coherence-times", "noise-decoherence", "bit-flip-phase-flip-errors", "amplitude-damping"],
  "ground-state": ["energy-eigenstate", "vqe", "electronic-structure-problem", "local-hamiltonian-problem"],
  "bit-flip-phase-flip-errors": ["quantum-error-correction", "pauli-matrices", "stabilizer-formalism"],
  "chsh-inequality": ["bells-theorem", "bell-states", "entanglement"],
  "amplitude-damping": ["t1-t2-coherence-times", "kraus-operators-cptp-maps", "lindblad-master-equation"],
  "transversal-gate": ["eastin-knill-theorem", "magic-state-distillation", "lattice-surgery-term", "clifford-group"],
  locc: ["entanglement", "entanglement-distillation-typical-subspaces", "data-processing-inequality", "quantum-teleportation"],

  // Corpus-gap terms added alongside their entries. Each one is deliberately
  // wired both up and down: `concurrence` ↔ `mixed-state-concurrence` and
  // `entanglement-entropy` ↔ `bond-dimension` are the beginner-to-research
  // pairs this table exists for.
  "product-state": ["entanglement", "tensor-product", "bell-states", "matrix-product-state"],
  "entanglement-entropy": [
    "entanglement",
    "von-neumann-entropy-purity",
    "schmidt-decomposition",
    "bond-dimension",
    "partial-trace",
  ],
  concurrence: ["entanglement-entropy", "mixed-state-concurrence", "bell-states", "entanglement"],
  "ghz-state": ["bell-states", "entanglement", "quantum-register"],
  "amplitude-amplification": [
    "grovers-algorithm",
    "oracle",
    "phase-interference",
    "maximum-likelihood-amplitude-estimation",
  ],
  "t-gate": [
    "clifford-group",
    "universal-gate-set",
    "t-count-t-depth",
    "magic-state-distillation",
    "gottesman-knill-theorem",
  ],
  "syndrome-measurement": [
    "quantum-error-correction",
    "ancilla",
    "stabilizer-formalism",
    "bit-flip-phase-flip-errors",
    "mwpm-decoding",
  ],

  // Notation terms. `spectral-decomposition` ↔ `spectral-theorem-pvm` is the
  // beginner-to-research pair here: the finite-dimensional statement points up
  // at the projection-valued-measure version that generalizes it, and back.
  adjoint: ["hermitian-operator", "unitary-operator", "dirac-notation", "inner-product", "self-adjoint-operator"],
  "completeness-relation": ["orthonormal-basis", "projector", "dirac-notation", "spectral-decomposition"],
  "spectral-decomposition": [
    "hermitian-operator",
    "projector",
    "degeneracy",
    "eigenvalue-eigenvector",
    "observable",
    "spectral-theorem-pvm",
  ],

  // Fourth-sweep terms, wired to the entries that were already leaning on them.
  norm: ["inner-product", "normalization", "unitary-operator", "hilbert-space", "modulus"],
  eigenbasis: [
    "eigenvalue-eigenvector",
    "basis",
    "hermitian-operator",
    "spectral-decomposition",
    "commutator",
    "degeneracy",
  ],
  "phase-gate": ["t-gate", "clifford-group", "single-qubit-gates", "global-relative-phase", "hadamard-gate"],
  "wave-packet": [
    "wavefunction",
    "group-velocity-dispersion",
    "fourier-transform",
    "heisenberg-uncertainty-principle",
    "probability-density",
  ],

  // Terms the lesson passes reported missing, wired to what already cites them.
  "dirac-delta": ["kronecker-delta", "wavefunction", "probability-density", "rigged-hilbert-space", "norm"],
  "kronecker-delta": ["orthonormal-basis", "inner-product", "completeness-relation"],
  "grover-diffusion-operator": ["grovers-algorithm", "amplitude-amplification", "oracle", "phase-interference"],
  "order-finding": [
    "shors-algorithm",
    "modular-exponentiation",
    "continued-fractions-algorithm",
    "quantum-phase-estimation",
    "quantum-fourier-transform",
  ],
  "modular-exponentiation": ["shors-algorithm"],
  "continued-fractions-algorithm": ["quantum-phase-estimation", "shors-algorithm"],
  "local-hidden-variable": ["bells-theorem", "chsh-inequality", "entanglement", "bell-states"],
  "promise-problem": [
    "deutsch-jozsa",
    "simons-algorithm",
    "oracle",
    "query-complexity-black-box-model",
    "quantum-advantage-supremacy",
  ],
  "toffoli-gate": ["universal-gate-set", "t-gate", "clifford-group", "cnot-controlled-gates", "t-count-t-depth"],
  "fault-tolerance": [
    "quantum-error-correction",
    "logical-qubit",
    "transversal-gate",
    "magic-state-distillation",
    "code-distance",
    "quantum-threshold-theorem",
  ],

  // Duplicate-cluster cross-links: the hand-authored term and the concept-map
  // node that covers the same ground point at each other, so a reader landing
  // on either one can reach the other's framing.
  povm: ["povms-generalized-measurement"],
  "block-encoding": ["block-encoding-lcu", "linear-combination-of-unitaries"],
  "linear-combination-of-unitaries": ["block-encoding-lcu"],
  "matrix-product-state": ["matrix-product-states", "tensor-network-methods"],
  "matrix-product-states": ["tensor-network-methods"],
  "jordan-wigner-transformation": ["jordan-wigner-electronic-structure"],
  "maximum-likelihood-amplitude-estimation": ["amplitude-estimation-qpe-free"],
  "quantum-advantage-supremacy": ["quantum-advantage-claims"],
  "surface-codes": ["surface-code-lattice"],
  "mwpm-decoding": ["syndrome-defect-graph"],
  "gottesman-knill-theorem": ["clifford-group", "classical-simulability-boundary"],
  "clifford-group": ["classical-simulability-boundary"],
  "stabilizer-formalism": ["css-stabilizer-codes"],
  "magic-state-factory": ["magic-state-distillation"],
  "quantum-phase-estimation": ["quantum-phase-estimation-precision"],

  // ---------------------------------------------------------------------
  // The dead ends
  //
  // A sweep for entries `buildRelated()` produced an empty `relatedIds` for:
  // 43 of them, and not a random 43. Almost all sat in the Mastery and Apex
  // tiers, because those entries were written a cluster at a time and the
  // relation table grew from the beginner end. The reader that hurts is the
  // one this glossary's two-directional design exists for: someone who has
  // just followed `entanglement-entropy` *up* to `bond-dimension` arrives at
  // a page with no way onward, and someone who lands on `qma-completeness`
  // gets no route to the construction (`history-state-kitaev`) its own
  // definition names in the same sentence.
  //
  // Every link below is one the two definitions already make in prose. None
  // of them is a "these are both about quantum information" association.
  // ---------------------------------------------------------------------

  // Quantum Shannon theory: the entropies, the channels, and the capacities
  // they add up to. `quantum-channel-capacity` is the hub these three
  // quantities are ingredients of, and none of them pointed at it.
  "coherent-information": [
    "quantum-channel-capacity",
    "quantum-mutual-information-conditional-entropy",
    "holevo-quantity",
    "entanglement-breaking-channel",
  ],
  "holevo-quantity": ["quantum-channel-capacity", "superdense-coding", "von-neumann-entropy-purity", "povm"],
  "entanglement-breaking-channel": ["quantum-channel-capacity", "kraus-operators-cptp-maps", "locc"],
  "quantum-mutual-information-conditional-entropy": [
    "von-neumann-entropy-purity",
    "quantum-relative-entropy",
    "data-processing-inequality",
  ],
  "quantum-relative-entropy": ["data-processing-inequality", "trace-distance-fidelity", "von-neumann-entropy-purity"],

  // Channels and generalized measurement. `kraus-operators-cptp-maps` and
  // `stinespring-dilation` state the same structure theorem from the two
  // ends and each names the other, with no link between them until now.
  "kraus-operators-cptp-maps": ["stinespring-dilation", "choi-jamiolkowski-isomorphism", "quantum-instrument"],
  "choi-jamiolkowski-isomorphism": ["stinespring-dilation", "partial-trace"],
  "quantum-instrument": ["povm", "povms-generalized-measurement", "measurement"],
  "naimark-dilation-theorem": ["povm", "povms-generalized-measurement", "quantum-instrument"],

  // Complexity: verification, the hard problem, the construction that links
  // them, and the containments the whole picture is drawn on.
  "qma-completeness": [
    "qma-quantum-verification",
    "local-hamiltonian-problem",
    "history-state-kitaev",
    "p-np-bqp-containments",
  ],
  "qma-quantum-verification": ["history-state-kitaev", "no-cloning-theorem"],
  "p-np-bqp-containments": ["bqp-oracle-complexity", "quantum-advantage-supremacy"],
  "bqp-oracle-complexity": [
    "oracle-relativization-barrier",
    "query-complexity-black-box-model",
    "promise-problem",
  ],
  "oracle-relativization-barrier": ["promise-problem", "theorem-heuristic-conjecture-open"],
  "quantum-query-lower-bound-methods": [
    "quantum-adversary-method",
    "polynomial-method-query-lower-bounds",
    "query-complexity-black-box-model",
  ],
  "quantum-adversary-method": ["polynomial-method-query-lower-bounds", "grovers-algorithm"],
  "random-circuit-sampling": [
    "quantum-advantage-supremacy",
    "classical-simulability-boundary",
    "best-known-classical-baseline",
    "theorem-heuristic-conjecture-open",
  ],
  "theorem-heuristic-conjecture-open": ["best-known-classical-baseline", "reproducibility-four-components"],
  "popoviciu-inequality": ["shot-noise-standard-error", "reproducibility-four-components", "expectation-value"],

  // The QSVT stack, read from the single-qubit rotation up to the linear
  // solver. Five of these six were dead ends, which is the wrong shape for
  // the one Apex module that is genuinely a ladder.
  "quantum-signal-processing": ["signal-rotation", "quantum-singular-value-transformation", "block-encoding-lcu"],
  "qsvt-polynomial": ["quantum-singular-value-transformation", "qubitization", "block-encoding", "signal-rotation"],
  qubitization: ["quantum-singular-value-transformation", "block-encoding"],
  "quantum-linear-systems-qsvt": ["quantum-singular-value-transformation", "condition-number-kappa", "dequantization"],
  "condition-number-kappa": ["qsvt-polynomial", "dequantization"],
  dequantization: ["quantum-advantage-supremacy", "best-known-classical-baseline"],

  // Compilation and fault-tolerant geometry.
  "clifford-t-synthesis": [
    "solovay-kitaev-theorem",
    "ross-selinger-synthesis",
    "t-count-t-depth",
    "universal-gate-set",
  ],
  "ross-selinger-synthesis": ["solovay-kitaev-theorem", "t-count-t-depth"],
  "rough-smooth-boundary": ["surface-code-lattice", "surface-codes", "code-distance", "lattice-surgery-term"],
  "bond-dimension": ["matrix-product-state", "matrix-product-states"],
  "code-distance": ["logical-error-rate", "surface-code-lattice", "syndrome-defect-graph"],

  // Mechanics entries the pillar's own ladder skipped.
  "cauchy-schwarz-inequality": ["inner-product", "norm", "heisenberg-uncertainty-principle"],
  "linear-independence": ["basis", "span", "linear-combination", "vector-space"],
  "taylor-series": ["complex-number", "global-relative-phase", "modulus"],
  "sturm-liouville-theory": [
    "eigenvalue-eigenvector",
    "hermitian-operator",
    "quantum-harmonic-oscillator",
    "spherical-harmonics",
  ],
  "clebsch-gordan-wigner-eckart": ["angular-momentum-spin", "spherical-harmonics", "ladder-operators"],
  "adiabatic-theorem-berry-phase": ["hamiltonians-time-evolution", "degeneracy", "energy-eigenstate", "global-relative-phase"],
  "squeezed-states": ["coherent-states", "quantum-harmonic-oscillator", "heisenberg-uncertainty-principle"],
  "partial-wave-scattering-s-matrix": [
    "transmission-reflection-coefficients",
    "spherical-harmonics",
    "angular-momentum-spin",
    "hydrogen-atom",
  ],
  "quantum-walks": ["hamiltonian-simulation-trotterization", "grovers-algorithm", "group-velocity-dispersion"],
  detuning: ["rabi-oscillation", "qubit-control", "gate-fidelity", "transmon"],

  // The three protocols. `superdense-coding` had no cross-references at all,
  // and it is the one entry in the file that cannot be read without its
  // siblings: it spends entanglement, and Holevo's bound is what makes the
  // factor of two interesting rather than obvious.
  "superdense-coding": ["quantum-teleportation", "bell-states", "entanglement"],
  "quantum-teleportation": ["no-cloning-theorem", "bell-states", "entanglement"],
  "no-cloning-theorem": ["linear-operator", "quantum-error-correction", "qkd-bb84"],
  "cnot-controlled-gates": ["bell-states", "hadamard-gate", "entanglement"],
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
 * The "Start here" tier, in *reading* order rather than alphabetical: the
 * shortest path from knowing nothing to being able to read an introductory
 * lesson without stopping. Deliberately short: fifteen words a reader can
 * finish in one sitting, not a second A-Z.
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
