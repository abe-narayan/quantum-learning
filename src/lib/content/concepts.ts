import { PILLARS } from "./curriculum";
import type { Pillar } from "./types";

/**
 * A real simulator anchor on `/simulators` (each `<section>` there is
 * addressable as `/simulators#${simulatorId}`). The page carries fourteen;
 * the thirteen below are the ones a concept or glossary term points at.
 * `compare-states-explorer` is reachable only from `/simulators` itself and
 * is deliberately absent rather than listed and unused.
 */
export type SimulatorId =
  | "bloch-sphere"
  | "two-qubit-explorer"
  | "complex-amplitude-explorer"
  | "density-matrix-explorer"
  | "circuit-builder"
  | "grover-explorer"
  | "wavefunction-explorer"
  | "rabi-explorer"
  | "noise-explorer"
  | "syndrome-explorer"
  | "period-finding-explorer"
  | "qaoa-explorer"
  | "chsh-bell-test";

export type ConceptNode = {
  id: string;
  title: string;
  /** 1-2 sentence definition, written for this map. */
  definition: string;
  pillar: Pillar;
  /** Real lesson slugs (verified against src/content/lessons/**\/*.mdx), 1-3 entries. */
  lessonSlugs: string[];
  /** A real simulator id from /simulators, if one directly covers this concept. */
  simulatorId?: SimulatorId;
  /** ids of other ConceptNodes this concept depends on. */
  prerequisiteIds: string[];
};

/**
 * The load-bearing concepts of the curriculum: 59 of them, spanning all six
 * pillars (it began as ~25 across the first four and grew with the Mastery
 * and Apex courses). Every `lessonSlugs` entry was cross-checked against the
 * real file paths under `src/content/lessons/` (and matches the slug format
 * `getAllLessonsMeta()` derives from them: the path relative to that root,
 * minus `.mdx`).
 *
 * Every one of them is also a `/glossary` entry: `GLOSSARY_TERMS` merges this
 * array with the terms authored in `glossary.ts`, which reads this file and
 * must never edit it. The merged total is derived there, never typed here.
 */
export const CONCEPT_NODES: ConceptNode[] = [
  // ---------------------------------------------------------------------
  // Quantum Mechanics
  // ---------------------------------------------------------------------
  {
    id: "superposition",
    title: "Superposition",
    definition:
      "A quantum system's state can be a weighted combination of basis states, written with complex amplitudes rather than classical probabilities. That is what lets contributions cancel as well as add, and it is the idea every other concept here builds on.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/classical-to-quantum/superposition-interference-and-phase"],
    prerequisiteIds: [],
  },
  {
    id: "measurement",
    title: "Measurement",
    definition:
      "Measurement returns exactly one outcome from a state that held several, with probability given by the squared magnitude of that outcome's amplitude (the Born rule), and leaves the system in the state matching what was seen, so an immediate repeat returns the same answer.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/operators-observables-measurement/the-measurement-postulate-generalized"],
    prerequisiteIds: ["superposition"],
  },
  {
    id: "phase-interference",
    title: "Phase & Interference",
    definition:
      "Complex amplitudes carry a phase, so contributions to the same outcome can reinforce or cancel before the Born rule squares them, leaving that outcome more or less likely than either contribution alone. It is the mechanism nearly every quantum algorithm exploits for advantage.",
    pillar: "quantum-mechanics",
    lessonSlugs: [
      "quantum-mechanics/classical-to-quantum/why-complex-amplitudes",
      "quantum-computing/quantum-gates-and-circuits/interference-in-quantum-circuits",
    ],
    prerequisiteIds: ["superposition"],
  },
  {
    id: "hamiltonians-time-evolution",
    title: "Hamiltonians & Time Evolution",
    definition:
      "The Hamiltonian is the operator standing for a system's total energy, and it is also what pushes the system forward in time: the Schrödinger equation turns Ĥ into the unitary U(t) = e^(−iĤt/ℏ) that carries the state from one moment to the next. Writing down Ĥ is therefore the whole act of specifying a quantum system.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/classical-to-quantum/time-evolution-and-the-schrodinger-equation"],
    prerequisiteIds: ["superposition"],
  },
  {
    id: "angular-momentum-spin",
    title: "Angular Momentum & Spin",
    definition:
      "Spin is an intrinsic quantum angular momentum with no classical analogue; spin-1/2 systems are the physical basis for many real qubit implementations.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/angular-momentum-and-spin/spin-one-half-systems"],
    prerequisiteIds: ["measurement"],
  },
  {
    id: "wave-mechanics",
    title: "Wave Mechanics",
    definition:
      "Making position continuous turns the quantum state into a wavefunction whose squared magnitude gives a probability density, evolving under the position-space Schrödinger equation.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/wave-mechanics/what-is-a-wavefunction"],
    simulatorId: "wavefunction-explorer",
    prerequisiteIds: ["hamiltonians-time-evolution"],
  },
  {
    id: "hydrogen-atom",
    title: "The Hydrogen Atom",
    definition:
      "Solving the Schrödinger equation for an electron in a Coulomb potential yields quantized energy levels and orbitals, showing where atomic quantum numbers come from.",
    pillar: "quantum-mechanics",
    lessonSlugs: ["quantum-mechanics/the-hydrogen-atom/hydrogen-energy-levels"],
    prerequisiteIds: ["angular-momentum-spin", "wave-mechanics"],
  },

  // ---------------------------------------------------------------------
  // Quantum Computing
  // ---------------------------------------------------------------------
  {
    id: "qubit",
    title: "Qubit",
    definition:
      "The quantum unit of information, the counterpart of a classical bit. A bit holds 0 or 1; a qubit holds a weighted combination of both, α|0⟩ + β|1⟩, and measurement is what forces one of the two. Those weights are complex numbers, so they can cancel as well as add, which is where a quantum algorithm's advantage comes from.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/qubits-and-quantum-states/what-is-a-qubit"],
    simulatorId: "bloch-sphere",
    prerequisiteIds: ["superposition"],
  },
  {
    id: "quantum-gates",
    title: "Quantum Gates",
    definition:
      "The operations a quantum circuit is built out of: each one takes a qubit's state and turns it into another, the way a classical logic gate turns bits into bits. Every quantum gate is a *unitary*, meaning it is reversible and leaves total probability at 1, which is the hard constraint that classical gates like AND do not have to obey.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/qubits-and-quantum-states/quantum-gates"],
    simulatorId: "bloch-sphere",
    prerequisiteIds: ["qubit"],
  },
  {
    id: "entanglement",
    title: "Entanglement",
    definition:
      "Two or more qubits can share correlations too strong for any account in which each qubit already held a definite value of its own. Neither part then has a state by itself; only the pair does. Measuring one half sends the other nothing a distant experimenter could detect: the correlation appears only once the two sets of results are brought together and compared. Bell's theorem turns that gap into something an experiment can settle, and the correlations are the resource teleportation spends and error correction is built from.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement"],
    simulatorId: "two-qubit-explorer",
    prerequisiteIds: ["qubit", "measurement"],
  },
  {
    id: "bell-states",
    title: "Bell States",
    definition:
      "The four maximally entangled two-qubit states, the simplest being (|00⟩+|11⟩)/√2: neither qubit has a definite value on its own, yet measuring both always gives matching results. Testing their correlations against the CHSH inequality is the clearest experimental proof that nature isn't locally classical.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement",
      "quantum-computing/entanglement-and-measurement/bells-theorem-and-local-hidden-variables",
      "quantum-computing/entanglement-and-measurement/the-chsh-inequality",
    ],
    simulatorId: "chsh-bell-test",
    prerequisiteIds: ["entanglement"],
  },
  {
    id: "density-matrices",
    title: "Density Matrices",
    definition:
      "The general way to write a quantum state: a matrix ρ rather than a vector, with ρ = |ψ⟩⟨ψ| reproducing an ordinary state vector and weighted sums of such terms covering everything a vector cannot. Two situations force it: a statistical mixture of possible preparations, and one half of an entangled pair considered on its own.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/entanglement-and-measurement/from-state-vectors-to-density-matrices"],
    simulatorId: "density-matrix-explorer",
    prerequisiteIds: ["entanglement"],
  },
  {
    id: "quantum-circuits",
    title: "Quantum Circuits",
    definition:
      "One line per qubit, read left to right as time, gates as boxes where they act. The picture is the program, in every real quantum framework.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-gates-and-circuits/quantum-circuit-notation"],
    simulatorId: "circuit-builder",
    prerequisiteIds: ["quantum-gates", "entanglement"],
  },
  {
    id: "quantum-fourier-transform",
    title: "Quantum Fourier Transform",
    definition:
      "A quantum circuit that maps computational-basis states to a Fourier-transformed superposition using exponentially fewer gates than the classical FFT needs operations. Its output is a quantum state whose amplitudes cannot be read out wholesale, so it is not a faster way to obtain an explicit transformed array; what it is, is the engine behind phase estimation and Shor's algorithm.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-i/the-quantum-fourier-transform",
      "quantum-computing/quantum-algorithms-i/quantum-phase-estimation",
    ],
    prerequisiteIds: ["quantum-circuits", "phase-interference"],
  },
  {
    id: "grovers-algorithm",
    title: "Grover's Algorithm",
    definition:
      "A quantum search algorithm that finds a marked item among N unsorted possibilities in roughly √N steps, where checking them one at a time averages N/2. Each step calls an oracle that recognises the marked item, then reflects the state so that item's share of the amplitude grows; that is amplitude amplification, and the gain it buys is quadratic rather than exponential.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-algorithms-i/grovers-algorithm-oracle-and-diffusion"],
    simulatorId: "grover-explorer",
    prerequisiteIds: ["quantum-circuits", "phase-interference"],
  },
  {
    id: "shors-algorithm",
    title: "Shor's Algorithm",
    definition:
      "Reduces integer factoring to finding the period of a modular exponentiation function, then finds that period exponentially faster than any known classical algorithm using the quantum Fourier transform.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/quantum-algorithms-ii/shors-algorithm-factoring-via-period-finding",
      "quantum-computing/quantum-algorithms-ii/the-quantum-period-finding-circuit",
    ],
    simulatorId: "period-finding-explorer",
    prerequisiteIds: ["quantum-fourier-transform"],
  },
  {
    id: "qaoa",
    title: "QAOA",
    definition:
      "The Quantum Approximate Optimization Algorithm alternates cost and mixer unitaries on a parameterized circuit, then classically optimizes those parameters to approximate hard combinatorial problems like Max-Cut.",
    pillar: "quantum-computing",
    lessonSlugs: ["quantum-computing/quantum-algorithms-ii/qaoa-and-combinatorial-optimization"],
    simulatorId: "qaoa-explorer",
    // The cost and mixer layers *are* e^(-iγC) and e^(-iβB): a reader who has
    // not met a Hamiltonian generating time evolution cannot read the ansatz,
    // so the edge is a real dependency and not just course ordering.
    prerequisiteIds: ["quantum-circuits", "hamiltonians-time-evolution"],
  },
  {
    id: "quantum-error-correction",
    title: "Quantum Error Correction",
    definition:
      "Encodes one logical qubit across several physical qubits so that errors can be detected via syndrome measurement and corrected without ever directly measuring (and collapsing) the protected state.",
    pillar: "quantum-computing",
    lessonSlugs: [
      "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code",
      "quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map",
    ],
    simulatorId: "syndrome-explorer",
    prerequisiteIds: ["quantum-circuits", "density-matrices"],
  },

  // ---------------------------------------------------------------------
  // Quantum Hardware
  // ---------------------------------------------------------------------
  {
    id: "superconducting-qubits",
    title: "Superconducting Qubits",
    definition:
      "Qubits encoded in the quantized energy levels of a superconducting circuit built from Josephson junctions, the platform behind most of today's largest quantum processors.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/physical-qubit-platforms/superconducting-qubits"],
    prerequisiteIds: ["qubit"],
  },
  {
    id: "trapped-ions",
    title: "Trapped Ions",
    definition:
      "Qubits encoded in the internal energy states of individually trapped, laser-cooled ions, offering long coherence times and high-fidelity gates at the cost of slower operation.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/physical-qubit-platforms/trapped-ions"],
    prerequisiteIds: ["qubit"],
  },
  {
    id: "qubit-control",
    title: "Qubit Control & Readout",
    definition:
      "Turning an abstract gate into a real microwave or laser pulse, and reading a qubit's state back out, both governed by the Rabi model of a driven two-level system.",
    pillar: "quantum-hardware",
    lessonSlugs: ["quantum-hardware/control-and-readout/control-electronics", "quantum-hardware/control-and-readout/calibration"],
    simulatorId: "rabi-explorer",
    prerequisiteIds: ["superconducting-qubits"],
  },
  {
    id: "noise-decoherence",
    title: "Noise & Decoherence",
    definition:
      "No qubit is ever isolated. It leaks what it holds into its surroundings over timescales T1 for energy and T2 for phase, as Kraus-operator channels that shrink its Bloch vector toward a fixed point.",
    pillar: "quantum-hardware",
    lessonSlugs: [
      "quantum-mechanics/advanced-quantum-mechanics/open-quantum-systems-and-kraus-operators",
      "quantum-hardware/noise-decoherence-and-scaling/t1-and-t2-decoherence",
    ],
    simulatorId: "noise-explorer",
    prerequisiteIds: ["density-matrices", "superconducting-qubits"],
  },

  // ---------------------------------------------------------------------
  // Quantum Software
  // ---------------------------------------------------------------------
  {
    id: "quantum-circuit-simulation",
    title: "Quantum Circuit Simulation",
    definition:
      "Simulating a quantum circuit classically by tracking the full state vector, which costs 16×2ⁿ bytes and becomes intractable around 30-50 qubits. It is the technique this platform's own simulators use.",
    pillar: "quantum-software",
    lessonSlugs: ["quantum-software/simulating-quantum-systems/state-vector-simulation"],
    prerequisiteIds: ["quantum-circuits"],
  },
  {
    id: "sdks-programming",
    title: "SDKs & Programming",
    definition:
      "Real quantum software builds a circuit as data before running it: the shared pattern behind SDKs like Qiskit, Cirq, and PennyLane, and behind this platform's own QuantumCircuit class.",
    pillar: "quantum-software",
    lessonSlugs: [
      "quantum-software/programming-quantum-computers/quantum-sdks-overview",
      "quantum-software/programming-quantum-computers/writing-your-first-circuit",
    ],
    prerequisiteIds: ["quantum-circuits", "quantum-circuit-simulation"],
  },

  // ---------------------------------------------------------------------
  // Quantum Mastery
  // ---------------------------------------------------------------------
  {
    id: "self-adjoint-operator",
    title: "Self-Adjoint Operators",
    definition:
      "An operator that equals its own adjoint, domain included: A = A† demands that the domains of A and A† match, not merely that ⟨φ|Aψ⟩=⟨Aφ|ψ⟩ holds. The distinction is invisible for finite-dimensional matrices but essential on the infinite-dimensional spaces quantum mechanics is set in, since self-adjointness alone guarantees a genuine spectral decomposition and unitary time evolution.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/hilbert-space-and-spectral-theory/hilbert-spaces-and-self-adjointness"],
    prerequisiteIds: ["wave-mechanics"],
  },
  {
    id: "spectral-theorem-pvm",
    title: "Spectral Theorem (Projection-Valued Measures)",
    definition:
      "Every self-adjoint operator can be written as an integral over its spectrum, A=∫λ dE(λ), for a unique projection-valued measure E. When the spectrum is discrete this reduces to the familiar A=Σλᵢ Pᵢ, and the same statement extends Born's rule to cover discrete and continuous spectra at once.",
    pillar: "quantum-mastery",
    lessonSlugs: [
      "quantum-mastery/hilbert-space-and-spectral-theory/the-spectral-theorem-for-unbounded-operators",
    ],
    prerequisiteIds: ["self-adjoint-operator"],
  },
  {
    id: "clebsch-gordan-wigner-eckart",
    title: "Clebsch-Gordan Coefficients & the Wigner-Eckart Theorem",
    definition:
      "Clebsch-Gordan coefficients give the general recipe for coupling two angular momenta j₁⊗j₂ into total-j eigenstates; the Wigner-Eckart theorem then shows any spherical tensor operator's matrix elements factor into one of these coefficients (all the angular dependence) times a single reduced matrix element, yielding selection rules like Δl=±1 from symmetry alone.",
    pillar: "quantum-mastery",
    lessonSlugs: [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/clebsch-gordan-coefficients-and-the-wigner-eckart-theorem",
    ],
    prerequisiteIds: ["angular-momentum-spin"],
  },
  {
    id: "adiabatic-theorem-berry-phase",
    title: "Adiabatic Theorem & Berry Phase",
    definition:
      "A quantum system whose Hamiltonian changes slowly enough tracks its instantaneous eigenstate, up to a phase, provided the level it started in stays non-degenerate the whole way: slow means slow compared with the energy gap, so a gap that closes voids the theorem rather than merely weakening it. That phase splits into an ordinary dynamical part and a geometric (Berry) part that depends only on the path traced through parameter space, not on how long the path takes. For a spin-1/2 dragged around a cone it is exactly minus half the solid angle enclosed.",
    pillar: "quantum-mastery",
    lessonSlugs: [
      "quantum-mastery/symmetry-scattering-and-semiclassical-methods/the-adiabatic-theorem-and-berry-phase",
    ],
    prerequisiteIds: ["qubit", "hamiltonians-time-evolution"],
  },
  {
    id: "schmidt-decomposition",
    title: "Schmidt Decomposition",
    definition:
      "Every bipartite pure state can be written as a single sum Σₖ√λₖ|uₖ⟩|wₖ⟩ over matched orthonormal bases of each subsystem, proved via the singular value decomposition of the state's amplitude matrix. It is the theorem that explains why a pure state's two reduced density matrices always share the same nonzero eigenvalues.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-information-theory/schmidt-decomposition-and-purification"],
    prerequisiteIds: ["entanglement", "density-matrices"],
  },
  {
    id: "trace-distance-fidelity",
    title: "Trace Distance & Fidelity",
    definition:
      "The two standard, non-equivalent ways to measure how close two quantum states are: trace distance is exactly twice the best possible measurement's power to tell them apart (Helstrom's formula), while fidelity measures their overlap via Uhlmann's theorem; the Fuchs–van de Graaf inequalities sandwich one between bounds built from the other.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-information-theory/trace-distance-and-fidelity"],
    prerequisiteIds: ["schmidt-decomposition", "density-matrices"],
  },
  {
    id: "lindblad-master-equation",
    title: "Lindblad Master Equation",
    definition:
      "The most general continuous-time differential equation generating valid (completely positive, trace-preserving) Markovian open-system dynamics, dρ/dt=−i[H,ρ]+Σₖ(LₖρLₖ†−½{Lₖ†Lₖ,ρ}). It is the generator underneath discrete noise channels like amplitude damping, and the T2≤2T1 bound follows directly from it.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-information-theory/the-lindblad-master-equation"],
    prerequisiteIds: ["noise-decoherence"],
  },
  {
    id: "css-stabilizer-codes",
    title: "CSS Codes & General Stabilizer Formalism",
    definition:
      "General stabilizer codes, written [[n,k,d]] for n physical qubits encoding k logical qubits at code distance d, and the CSS construction that builds one directly from two nested classical linear codes. This is the machinery behind the Steane [[7,1,3]] code and every large-scale fault-tolerant proposal, including surface codes, extending the 3-qubit bit-flip code's syndrome idea to codes that correct arbitrary single-qubit errors.",
    pillar: "quantum-mastery",
    lessonSlugs: [
      "quantum-mastery/quantum-information-theory/css-codes-and-the-general-stabilizer-formalism",
    ],
    prerequisiteIds: ["quantum-error-correction"],
  },
  {
    id: "bqp-oracle-complexity",
    title: "BQP & Oracle Complexity",
    definition:
      "BQP is the formal complexity class of decision problems solvable by a bounded-error, polynomial-time-uniform quantum circuit family; whether it equals classical BPP is open, and the oracle-relative query-complexity separations proved by Deutsch-Jozsa, Simon's, and Grover's algorithms are rigorous but strictly weaker statements, subject to the Baker-Gill-Solovay relativization barrier.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/advanced-algorithms-and-complexity/bqp-and-oracle-complexity"],
    prerequisiteIds: ["grovers-algorithm"],
  },
  {
    id: "hamiltonian-simulation-trotterization",
    title: "Hamiltonian Simulation & Trotterization",
    definition:
      "Approximates e^{-iHt} for a Hamiltonian H=A+B whose pieces do not commute by alternating e^{-iAδ}e^{-iBδ} in n short steps. For bounded A and B the total error is provably bounded by (t²/2n)‖[A,B]‖, shrinking as the number of Trotter steps grows. Boundedness is load-bearing: for an unbounded pair such as p̂²/2m and V(x̂), ‖[A,B]‖ is infinite and the bound says nothing.",
    pillar: "quantum-mastery",
    lessonSlugs: [
      "quantum-mastery/advanced-algorithms-and-complexity/hamiltonian-simulation-and-trotterization",
    ],
    prerequisiteIds: ["hamiltonians-time-evolution", "quantum-circuits"],
  },
  {
    id: "quantum-walks",
    title: "Quantum Walks",
    definition:
      "A coin-and-conditional-shift quantum analogue of a random walk that spreads ballistically (∝t) rather than diffusively (∝√t), a direct consequence of its momentum-space dispersion relation having a bounded, nonzero group velocity; continuous-time quantum walks on a graph are exactly Hamiltonian simulation of that graph's adjacency matrix.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/advanced-algorithms-and-complexity/quantum-walks"],
    prerequisiteIds: ["hamiltonian-simulation-trotterization"],
  },
  {
    id: "barren-plateaus",
    title: "Barren Plateaus",
    definition:
      "Averaged over random parameter initializations a variational circuit's gradient has zero mean, and for sufficiently deep, expressive ansätze measured against a global cost function its variance shrinks exponentially in qubit count (a concentration-of-measure effect). That is the reason gradient-based training of large variational circuits can stall even when nothing else is wrong.",
    pillar: "quantum-mastery",
    lessonSlugs: [
      "quantum-mastery/advanced-algorithms-and-complexity/barren-plateaus-and-variational-trainability",
    ],
    prerequisiteIds: ["qaoa"],
  },
  // -------------------------------------------------------------------
  // Quantum Shannon Theory (quantum-mastery)
  // -------------------------------------------------------------------
  {
    id: "povms-generalized-measurement",
    title: "POVMs & Generalized Measurement",
    definition:
      "A POVM {E_i} generalizes projective measurement to any set of positive semi-definite operators summing to the identity, allowing more outcomes than the Hilbert space's dimension and provably optimal state discrimination that no projective measurement can match; Naimark's theorem shows every POVM is secretly a projective measurement on a larger system plus an ancilla.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-shannon-theory/povms-and-generalized-measurement"],
    prerequisiteIds: ["measurement", "density-matrices", "spectral-theorem-pvm"],
  },
  {
    id: "stinespring-dilation",
    title: "Stinespring Dilation",
    definition:
      "Every completely positive trace-preserving channel arises from a unitary on system-plus-environment followed by discarding the environment, E(ρ)=Tr_E[U(ρ⊗|0⟩⟨0|_E)U†]; Kraus operators are literally the blocks of that unitary, and Kraus-representation non-uniqueness is exactly the residual freedom to rotate the environment's readout basis.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-shannon-theory/stinespring-dilation-and-channel-purification"],
    prerequisiteIds: ["povms-generalized-measurement", "density-matrices", "schmidt-decomposition"],
  },
  {
    id: "data-processing-inequality",
    title: "Data-Processing Inequality",
    definition:
      "Quantum relative entropy can only shrink under any physical channel, S(N(ρ)‖N(σ)) ≤ S(ρ‖σ), forcing the corollary that mutual information between two systems can never increase when one side is processed by a channel, I(A:B) ≥ I(A:B'); this is the quantitative reason LOCC cannot increase entanglement and underlies QKD eavesdropper-information bounds.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-shannon-theory/the-data-processing-inequality"],
    prerequisiteIds: ["stinespring-dilation", "density-matrices"],
  },
  {
    id: "entanglement-distillation-typical-subspaces",
    title: "Entanglement Distillation & Typical Subspaces",
    definition:
      "A protocol that converts many weakly entangled pairs into fewer near-perfect Bell pairs using only local operations and classical communication (LOCC). Given n copies of a partially-entangled pure state whose reduced density matrix on one side is ρ, almost all the probability weight concentrates on a typical subspace of dimension ≈2^(nS(ρ)); projecting onto it and relabeling (entanglement concentration) distills ≈nS(ρ) near-perfect Bell pairs, giving entanglement entropy an operational, protocol-defined meaning.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-shannon-theory/entanglement-distillation-and-typical-subspaces"],
    prerequisiteIds: ["schmidt-decomposition", "entanglement", "data-processing-inequality"],
  },
  {
    id: "quantum-channel-capacity",
    title: "Quantum Channel Capacity (Holevo, HSW & LSD)",
    definition:
      "A channel's classical capacity is the regularized Holevo quantity (HSW theorem) while its quantum capacity is the regularized coherent information (LSD theorem); the two can differ dramatically, letting a channel carry classical bits reliably long after its coherent information, and hence any ability to carry quantum information, has hit zero.",
    pillar: "quantum-mastery",
    lessonSlugs: ["quantum-mastery/quantum-shannon-theory/capstone-what-can-be-sent-through-noise"],
    prerequisiteIds: [
      "data-processing-inequality",
      "entanglement-distillation-typical-subspaces",
      "stinespring-dilation",
    ],
  },
  // -------------------------------------------------------------------
  // Apex: Algorithmic Frontiers
  // -------------------------------------------------------------------
  {
    id: "block-encoding-lcu",
    title: "Block Encoding & Linear Combination of Unitaries",
    definition:
      "Embeds an arbitrary matrix A (not necessarily unitary, ‖A‖≤1) as the top-left ancilla-|0⟩ sub-block of a larger unitary U; the LCU construction builds one explicitly for any A=Σᵢαᵢ Uᵢ via a PREPARE–SELECT–PREPARE† circuit, making it the modern universal input model for quantum linear algebra.",
    pillar: "apex",
    lessonSlugs: ["apex/algorithmic-frontiers/block-encodings-and-linear-combinations-of-unitaries"],
    prerequisiteIds: ["quantum-gates", "quantum-circuits", "hamiltonian-simulation-trotterization"],
  },
  {
    id: "quantum-signal-processing",
    title: "Quantum Signal Processing (QSP)",
    definition:
      "Computes a polynomial of a number x on a quantum computer using only one qubit. Alternating the fixed rotation W(x) = e^{i·arccos(x)·X}, whose angle encodes the signal x, with tunable phase gates e^{iφZ} yields a unitary whose top-left entry is a controllable polynomial P(x) of degree ≤d, and any polynomial meeting the degree, parity, and boundedness conditions is achievable by choosing the phases alone.",
    pillar: "apex",
    lessonSlugs: ["apex/algorithmic-frontiers/quantum-signal-processing"],
    prerequisiteIds: ["block-encoding-lcu", "phase-interference"],
  },
  {
    id: "quantum-singular-value-transformation",
    title: "Quantum Singular Value Transformation (QSVT)",
    definition:
      "Generalizes quantum signal processing from a single signal qubit to an entire block-encoded matrix by alternating the block-encoding unitary with projector-controlled phase rotations, applying one chosen polynomial P simultaneously to every singular value of A; now understood to unify Grover's algorithm, Hamiltonian simulation, and linear-systems solving as special cases of one construction.",
    pillar: "apex",
    lessonSlugs: ["apex/algorithmic-frontiers/the-quantum-singular-value-transformation"],
    prerequisiteIds: ["quantum-signal-processing", "block-encoding-lcu", "hamiltonian-simulation-trotterization"],
  },
  {
    id: "amplitude-estimation-qpe-free",
    title: "Amplitude Estimation (QPE-Free)",
    definition:
      "Estimates a Grover-iterate amplitude to Heisenberg-limited O(1/ε) precision, quadratically better than classical Monte Carlo's O(1/ε²), using only a classical schedule of plain Grover-iterate depths combined by maximum likelihood, matching the original phase-estimation-based algorithm's scaling without its wide coherent ancilla register or QFT.",
    pillar: "apex",
    lessonSlugs: ["apex/algorithmic-frontiers/amplitude-estimation-without-phase-estimation"],
    prerequisiteIds: ["grovers-algorithm", "quantum-fourier-transform"],
  },
  {
    id: "quantum-linear-systems-qsvt",
    title: "Quantum Linear Systems via QSVT",
    definition:
      "Applies QSVT with a polynomial approximating 1/x (regularized away from the block encoding's smallest singular value) to produce a quantum state proportional to A⁻¹|b⟩, the modern successor to HHL; the speedup is real but conditional on A being well-conditioned, efficiently block-encodable, |b⟩ being efficiently preparable, and the desired output being a small readout rather than the full solution vector.",
    pillar: "apex",
    lessonSlugs: ["apex/algorithmic-frontiers/applications-eigenvalues-and-linear-systems"],
    prerequisiteIds: ["quantum-singular-value-transformation"],
  },
  // -------------------------------------------------------------------
  // Apex: Fault Tolerance Frontiers
  // -------------------------------------------------------------------
  {
    id: "surface-code-lattice",
    title: "Surface Codes (Explicit Lattice Construction)",
    definition:
      "A topological stabilizer code built by placing physical qubits on a 2D lattice with local vertex (Z-type) and face (X-type) stabilizers, so every check touches only a few physically-adjacent qubits; a distance-d patch encodes one logical qubit whose X̄/Z̄ operators are Pauli strings running between opposite lattice boundaries, with code distance equal to the shortest such string.",
    pillar: "apex",
    lessonSlugs: [
      "apex/fault-tolerance-frontiers/surface-codes-in-depth",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
    ],
    prerequisiteIds: ["css-stabilizer-codes"],
  },
  {
    id: "mwpm-decoding",
    title: "Syndrome Decoding & Minimum-Weight Matching",
    definition:
      "Reads a surface code's measured syndrome (which stabilizers flipped) and infers the most likely physical error by building a weighted graph of syndrome 'defects' and finding a minimum-weight perfect matching between them; below a threshold physical error rate p_th, the resulting logical error rate falls exponentially with code distance d, roughly as (p/p_th)^((d+1)/2).",
    pillar: "apex",
    lessonSlugs: [
      "apex/fault-tolerance-frontiers/decoding-surface-codes",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
    ],
    prerequisiteIds: ["surface-code-lattice"],
  },
  {
    id: "magic-state-distillation",
    title: "Magic-State Distillation",
    definition:
      "The Eastin-Knill theorem rules out a *universal* transversal gate set on any error-detecting code, and on a 2D topological code like the surface code the Bravyi-König theorem confines every locality-preserving logical gate to the Clifford group. Universal fault-tolerant computation therefore injects a non-Clifford 'magic state' via a Clifford-only teleportation-style circuit; distillation protocols (e.g. 15-to-1) consume many noisy copies to output fewer copies at cubically suppressed error, making the injected resource affordable.",
    pillar: "apex",
    lessonSlugs: [
      "quantum-computing/quantum-gates-and-circuits/universal-quantum-computation",
      "apex/fault-tolerance-frontiers/magic-states-and-distillation",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
    ],
    prerequisiteIds: ["css-stabilizer-codes", "quantum-gates"],
  },
  {
    id: "quantum-threshold-theorem",
    title: "The Quantum Threshold Theorem",
    definition:
      "Proves that if the physical error rate per gate sits below a constant threshold p_th, recursively concatenating (or scaling up) a quantum error-correcting code drives the logical error rate arbitrarily close to zero at only polylogarithmic qubit overhead in the target precision. The standard proof also assumes faults are local and close to independent, which is why a correlated source such as crosstalk cannot be cleared simply by checking its rate against p_th. It is the theorem that turned fault-tolerant quantum computing from a theoretical possibility into a scalable engineering target.",
    pillar: "apex",
    lessonSlugs: [
      "quantum-computing/error-correction-and-fault-tolerance/capstone-fault-tolerant-thresholds-and-resource-overhead",
      "apex/fault-tolerance-frontiers/the-threshold-theorem",
      "apex/fault-tolerance-frontiers/capstone-resource-estimation-for-a-real-algorithm",
    ],
    prerequisiteIds: ["mwpm-decoding", "magic-state-distillation"],
  },
  // -------------------------------------------------------------------
  // Apex: Quantum Complexity Theory
  // -------------------------------------------------------------------
  {
    id: "qma-quantum-verification",
    title: "QMA & Quantum Verification",
    definition:
      "QMA (Quantum Merlin-Arthur) is the quantum analogue of NP: a language is in QMA if YES instances have some polynomial-size quantum witness accepted with probability ≥2/3 by a polynomial-time verifier circuit, while every possible witness for a NO instance is accepted with probability ≤1/3. The obvious way to amplify that gap is to send several independent copies of the witness, because no-cloning means a quantum witness cannot be duplicated the way a classical certificate can; Marriott and Watrous later showed the gap can in fact be amplified from a single copy.",
    pillar: "apex",
    lessonSlugs: ["apex/quantum-complexity-theory/qma-and-quantum-verification"],
    prerequisiteIds: ["bqp-oracle-complexity"],
  },
  {
    id: "local-hamiltonian-problem",
    title: "The Local Hamiltonian Problem",
    definition:
      "The k-Local Hamiltonian problem asks whether a Hamiltonian built from polynomially many terms, each acting on at most a constant k qubits, has ground-state energy below one threshold or above another, given an inverse-polynomial promise gap. It is QMA-complete (Kitaev's theorem, via a 'history state' reduction), making it the quantum analogue of Cook-Levin's NP-completeness of 3-SAT, with hardness surviving down to 2-local terms and physically realistic 2D lattice models.",
    pillar: "apex",
    lessonSlugs: ["apex/quantum-complexity-theory/the-local-hamiltonian-problem"],
    // Nothing in the QMA-completeness statement uses Trotterization; what it
    // genuinely needs is the notion of a Hamiltonian and its ground-state
    // energy. The old edge to `hamiltonian-simulation-trotterization` recorded
    // where "Hamiltonian" happens to be reintroduced in the Apex course, not a
    // dependency. (Depth is unchanged either way.)
    prerequisiteIds: ["qma-quantum-verification", "hamiltonians-time-evolution"],
  },
  {
    id: "quantum-query-lower-bound-methods",
    title: "Quantum Query Lower-Bound Methods",
    definition:
      "The quantum adversary method (Ambainis) and the polynomial method (Beals-Buhrman-Cleve-Mosca-de Wolf) are two structurally independent techniques for proving unconditional lower bounds on quantum query complexity. One tracks a distinguishability progress measure across hard instance pairs, the other shows a quantum algorithm's acceptance probability is a low-degree polynomial in the oracle bits, and both independently establish the identical Θ(√N) optimality bound for Grover's search.",
    pillar: "apex",
    lessonSlugs: ["apex/quantum-complexity-theory/query-complexity-and-lower-bounds"],
    prerequisiteIds: ["bqp-oracle-complexity", "grovers-algorithm"],
  },
  // -------------------------------------------------------------------
  // Apex: Simulation and Compilation Frontiers
  // -------------------------------------------------------------------
  {
    id: "matrix-product-states",
    title: "Tensor Networks & Matrix Product States",
    definition:
      "Represents an n-qubit state exactly as a chain of small tensors linked by bond indices, built via repeated SVD across each cut; the bond dimension at a cut equals the Schmidt rank there, so an area-law state (entanglement entropy bounded independent of system size) admits an MPS whose bond dimension never has to grow, making it classically tractable.",
    pillar: "apex",
    lessonSlugs: ["apex/simulation-and-compilation-frontiers/tensor-networks-and-matrix-product-states"],
    prerequisiteIds: ["schmidt-decomposition", "entanglement"],
  },
  {
    id: "classical-simulability-boundary",
    title: "Classical Simulability Boundary (Gottesman-Knill & Bond Dimension)",
    definition:
      "Two independent sufficient conditions make a quantum circuit classically easy: the Gottesman-Knill theorem (stabilizer circuits simulate in polynomial time regardless of entanglement) and a bounded-bond-dimension criterion from tensor networks (regardless of gate set); a genuine hardness argument requires defeating both at once, which is why real quantum-advantage experiments use random, non-Clifford, fast-entangling circuits.",
    pillar: "apex",
    lessonSlugs: ["apex/simulation-and-compilation-frontiers/when-classical-simulation-works"],
    prerequisiteIds: ["matrix-product-states", "css-stabilizer-codes", "quantum-circuit-simulation"],
  },
  {
    id: "clifford-t-synthesis",
    title: "Clifford+T Synthesis & T-Count",
    definition:
      "Compiling an arbitrary single-qubit unitary into a finite Clifford+T sequence to precision ε costs a T-count that depends heavily on the synthesis algorithm: generic Solovay-Kitaev synthesis scales as O(log^c(1/ε)) for a construction-dependent constant c, while number-theoretic algorithms like Ross-Selinger exploit the ring ℤ[1/√2, i] to reach near-optimal, ~3-4·log₂(1/ε) T-count for the structured Rz(θ) family, a gap of orders of magnitude at realistic precision.",
    pillar: "apex",
    lessonSlugs: ["apex/simulation-and-compilation-frontiers/clifford-t-synthesis-and-resource-counting"],
    prerequisiteIds: ["quantum-gates", "quantum-error-correction"],
  },
  {
    id: "noise-aware-resource-estimation",
    title: "Noise-Aware Compilation & Resource Estimation",
    definition:
      "Compiling a circuit for real hardware layers two costs onto its logical gate count: SWAP-network routing overhead from limited qubit connectivity, and a choice among equal-SWAP-count mappings that routes the heaviest gate load through a device's best-calibrated qubits and couplers. That second choice alone can shift overall circuit success probability by several percentage points without changing the gate count.",
    pillar: "apex",
    lessonSlugs: ["apex/simulation-and-compilation-frontiers/noise-aware-compilation-and-resource-estimation"],
    prerequisiteIds: ["clifford-t-synthesis", "qubit-control", "noise-decoherence"],
  },
  {
    id: "jordan-wigner-electronic-structure",
    title: "Jordan-Wigner Mapping & Electronic Structure Simulation",
    definition:
      "Maps fermionic creation/annihilation operators onto qubit Pauli strings by prepending a 'Z-string' of Pauli-Z operators on all lower-indexed modes, converting qubits' natural commutation into the anticommutation the canonical fermionic algebra requires. It is the encoding step that turns a molecule's second-quantized electronic Hamiltonian into a circuit VQE or quantum phase estimation can act on.",
    pillar: "apex",
    lessonSlugs: ["apex/simulation-and-compilation-frontiers/quantum-simulation-of-molecules"],
    prerequisiteIds: ["hamiltonian-simulation-trotterization", "quantum-gates"],
  },
  // -------------------------------------------------------------------
  // Apex: Research Methods and Synthesis
  // -------------------------------------------------------------------
  {
    id: "quantum-advantage-claims",
    title: "Evaluating Quantum Advantage Claims",
    definition:
      "A five-question checklist for turning a 'quantum advantage/supremacy' headline into a set of separately checkable technical claims: what the specific task was, whether the classical comparison used the best known classical algorithm, whether the claimed classical hardness rests on an unconditional proof or an unproven complexity assumption, whether the task structurally avoids both known efficient-classical-simulation loopholes, and whether it is practically useful or merely engineered to be hard.",
    pillar: "apex",
    lessonSlugs: [
      "apex/research-methods-and-synthesis/evaluating-quantum-advantage-claims",
      "apex/research-methods-and-synthesis/capstone-the-quantum-computing-landscape-today",
    ],
    prerequisiteIds: ["bqp-oracle-complexity", "quantum-circuit-simulation"],
  },
];

export type ConceptNodeLayout = ConceptNode & {
  x: number;
  y: number;
  /** Longest-path depth from a root (no-prerequisite) concept, via Kahn's algorithm. */
  depth: number;
};

export type ConceptGraph = {
  nodes: ConceptNodeLayout[];
  edges: { from: string; to: string }[];
  width: number;
  height: number;
};

const PILLAR_ORDER: Pillar[] = PILLARS.map((pillar) => pillar.slug);

const COLUMN_WIDTH = 620;
const ROW_HEIGHT = 160;
const NODE_GAP_X = 160;
// Must match ConceptMapExplorer.tsx's NODE_WIDTH, used here only to pad the
// graph's bounding box so a rendered node's edges never clip outside it.
const NODE_WIDTH = 152;
const MARGIN_X = 140;
const MARGIN_Y = 100;

/**
 * Computes a deterministic, non-force-directed layout for `CONCEPT_NODES`:
 * x is the concept's pillar (one column per pillar, six of them), y is its longest-path depth
 * in the prerequisite DAG (computed via Kahn's algorithm: concepts with no
 * prerequisites sit at the top, deeper concepts sit lower). No layout
 * library or force simulation involved.
 */
export function buildConceptGraph(): ConceptGraph {
  const byId = new Map(CONCEPT_NODES.map((node) => [node.id, node]));

  // Kahn's algorithm over the "prerequisite -> concept" edges, relaxing a
  // longest-path depth as each node's indegree reaches zero.
  const indegree = new Map<string, number>();
  const dependents = new Map<string, string[]>();
  const depth = new Map<string, number>();

  for (const node of CONCEPT_NODES) {
    const validPrereqs = node.prerequisiteIds.filter((id) => byId.has(id));
    indegree.set(node.id, validPrereqs.length);
    depth.set(node.id, 0);
    for (const prereqId of validPrereqs) {
      if (!dependents.has(prereqId)) dependents.set(prereqId, []);
      dependents.get(prereqId)!.push(node.id);
    }
  }

  const queue: string[] = CONCEPT_NODES.filter((node) => indegree.get(node.id) === 0).map((node) => node.id);
  const order: string[] = [];

  while (queue.length > 0) {
    const id = queue.shift()!;
    order.push(id);
    for (const dependentId of dependents.get(id) ?? []) {
      depth.set(dependentId, Math.max(depth.get(dependentId)!, depth.get(id)! + 1));
      const remaining = indegree.get(dependentId)! - 1;
      indegree.set(dependentId, remaining);
      if (remaining === 0) queue.push(dependentId);
    }
  }
  // Any node not reached (a cycle, which shouldn't happen with hand-authored
  // data) keeps its default depth of 0 rather than being dropped.

  // Group nodes by (pillar, depth) to spread siblings horizontally within
  // their column instead of stacking them on top of each other.
  const groups = new Map<string, string[]>();
  for (const node of CONCEPT_NODES) {
    const key = `${node.pillar}:${depth.get(node.id)}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(node.id);
  }

  // Sibling spreading (`offset` below) can push a node's raw x left of 0
  // within its column, so the true bounding box's left edge isn't at x=0, so
  // track the real min/max here rather than assuming it, otherwise the
  // leftmost node(s) render partially outside `width`, and any viewport
  // centered on `[0, width]` clips them (this was a real, visible bug: the
  // "Qubit" node was cropped on initial map load).
  let minX = Infinity;
  let maxX = -Infinity;
  let maxY = 0;

  const rawNodes = CONCEPT_NODES.map((node) => {
    const nodeDepth = depth.get(node.id) ?? 0;
    const columnIndex = Math.max(0, PILLAR_ORDER.indexOf(node.pillar));
    const groupKey = `${node.pillar}:${nodeDepth}`;
    const group = groups.get(groupKey)!;
    const indexInGroup = group.indexOf(node.id);
    const offset = (indexInGroup - (group.length - 1) / 2) * NODE_GAP_X;

    const x = MARGIN_X + columnIndex * COLUMN_WIDTH + COLUMN_WIDTH / 2 + offset;
    const y = MARGIN_Y + nodeDepth * ROW_HEIGHT;

    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);

    return { ...node, x, y, depth: nodeDepth };
  });

  // Shift everything so the leftmost node's left edge (accounting for its
  // half-width) lands exactly at MARGIN_X, and re-derive `width` from the
  // shifted, true right edge. Both now bound every node.
  const shiftX = -minX + NODE_WIDTH / 2 + MARGIN_X;
  const nodes: ConceptNodeLayout[] = rawNodes.map((node) => ({ ...node, x: node.x + shiftX }));

  const edges: { from: string; to: string }[] = [];
  for (const node of CONCEPT_NODES) {
    for (const prereqId of node.prerequisiteIds) {
      if (byId.has(prereqId)) edges.push({ from: prereqId, to: node.id });
    }
  }

  return {
    nodes,
    edges,
    width: maxX + shiftX + NODE_WIDTH / 2 + MARGIN_X,
    height: maxY + MARGIN_Y,
  };
}

export function getConcept(id: string): ConceptNode | undefined {
  return CONCEPT_NODES.find((node) => node.id === id);
}

/**
 * The full prerequisite chain leading to `id`: every concept you have to
 * understand first, ordered so that each entry's own prerequisites appear
 * before it (roots first), followed by `id` itself last.
 *
 * This is the single most useful question a dependency graph can answer for
 * someone new ("what do I need to learn before this?"), so it lives here as
 * a pure function rather than inside the map component: `/map`'s graph uses
 * it to highlight the chain, and `ConceptDetailPanel` renders it as an
 * ordered, clickable route.
 *
 * Post-order depth-first search, which yields a valid topological order for
 * a DAG. Unknown prerequisite ids are skipped (matching `buildConceptGraph`,
 * which also drops edges to ids that don't exist) and the `visiting` set
 * makes it terminate even if hand-authored data ever introduced a cycle.
 * Returns `[]` for an id that isn't on the map at all.
 */
export function getPrerequisitePath(id: string): ConceptNode[] {
  const byId = new Map(CONCEPT_NODES.map((node) => [node.id, node]));
  if (!byId.has(id)) return [];

  const out: ConceptNode[] = [];
  const done = new Set<string>();
  const visiting = new Set<string>();

  function visit(currentId: string) {
    if (done.has(currentId) || visiting.has(currentId)) return;
    const node = byId.get(currentId);
    if (!node) return;
    visiting.add(currentId);
    for (const prereqId of node.prerequisiteIds) visit(prereqId);
    visiting.delete(currentId);
    done.add(currentId);
    out.push(node);
  }

  visit(id);
  return out;
}
