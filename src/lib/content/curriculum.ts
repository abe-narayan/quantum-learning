import type { Course, PillarInfo, Pillar } from "./types";

export const PILLARS: PillarInfo[] = [
  {
    slug: "quantum-mechanics",
    title: "Quantum Mechanics",
    description:
      "The mathematical and physical foundation, from the failure of classical physics through the hydrogen atom and beyond.",
  },
  {
    slug: "quantum-computing",
    title: "Quantum Computing",
    description:
      "Qubits, gates, and circuits, and the algorithms that give quantum computers their power.",
  },
  {
    slug: "quantum-hardware",
    title: "Quantum Hardware",
    description:
      "How qubits are physically built, controlled, read out, and scaled into real devices.",
  },
  {
    slug: "quantum-software",
    title: "Quantum Software",
    description:
      "The simulators, compilers, and SDKs used to program, test, and run quantum algorithms.",
  },
  {
    slug: "quantum-mastery",
    title: "Quantum Mastery",
    description:
      "Graduate-level mathematical physics and rigorous quantum information theory for those who've completed the core curriculum — proofs, not just results, drawing on and extending every earlier pillar.",
  },
  {
    slug: "apex",
    title: "Apex",
    description:
      "The summit of QuantumLearn: research-depth algorithms, fault tolerance, complexity theory, large-scale simulation and compilation, and a final course in reading and evaluating real quantum-computing research — the point where a motivated student can approach the literature without being lost.",
  },
];

export const COURSES: Course[] = [
  // ---------------------------------------------------------------------
  // Quantum Mechanics
  // ---------------------------------------------------------------------
  {
    slug: "mathematical-foundations",
    pillar: "quantum-mechanics",
    title: "Mathematical Foundations for Quantum Mechanics",
    description:
      "The linear algebra, complex numbers, and probability you need before the physics makes sense.",
    difficulty: "foundational",
    estimatedHours: 6,
    prerequisites: [],
    modules: [
      { slug: "complex-numbers-for-physics", title: "Complex Numbers for Physics" },
      { slug: "vector-spaces", title: "Vector Spaces" },
      { slug: "inner-products-and-orthogonality", title: "Inner Products and Orthogonality" },
      { slug: "bra-ket-formalism", title: "The Bra-Ket Formalism" },
      { slug: "linear-operators", title: "Linear Operators" },
      { slug: "eigenvalues-and-eigenvectors", title: "Eigenvalues and Eigenvectors" },
      { slug: "hermitian-operators", title: "Hermitian Operators" },
      { slug: "unitary-operators", title: "Unitary Operators" },
      { slug: "tensor-products-and-composite-systems", title: "Tensor Products and Composite Systems" },
      { slug: "probability-and-quantum-states", title: "Probability and Quantum States" },
      { slug: "mathematical-foundations-challenge", title: "Mathematical Foundations Challenge" },
    ],
  },
  {
    slug: "classical-to-quantum",
    pillar: "quantum-mechanics",
    title: "From Classical to Quantum",
    description:
      "Turning the linear algebra of Mathematical Foundations into physics: states, observables, measurement, time evolution, and the postulates that connect them all, built from the ground up.",
    difficulty: "intermediate",
    estimatedHours: 7,
    prerequisites: ["mathematical-foundations"],
    modules: [
      { slug: "classical-states-and-observables", title: "Classical States and Observables" },
      { slug: "from-classical-to-quantum-probability", title: "From Classical to Quantum Probability" },
      { slug: "why-complex-amplitudes", title: "Why Complex Amplitudes?" },
      { slug: "the-postulates-of-quantum-mechanics", title: "The Postulates of Quantum Mechanics" },
      { slug: "expectation-values-and-uncertainty", title: "Expectation Values and Uncertainty" },
      { slug: "time-evolution-and-the-schrodinger-equation", title: "Time Evolution and the Schrödinger Equation" },
      { slug: "stationary-states", title: "Stationary States" },
      { slug: "the-quantum-harmonic-oscillator", title: "The Quantum Harmonic Oscillator" },
      { slug: "position-and-momentum", title: "Position and Momentum" },
      { slug: "superposition-interference-and-phase", title: "Superposition, Interference, and Phase" },
      { slug: "from-postulates-to-quantum-computing", title: "From Postulates to Quantum Computing" },
    ],
  },
  {
    slug: "wave-mechanics",
    pillar: "quantum-mechanics",
    title: "Wave Mechanics",
    description:
      "Making position continuous: the wavefunction, the Fourier transform that connects position and momentum, the Schrödinger equation in position space, and the classic solvable systems (the infinite well, the harmonic oscillator revisited, tunneling), all explored through a real numerical wavefunction simulator with an actual FFT and genuine time evolution.",
    difficulty: "intermediate",
    estimatedHours: 9,
    prerequisites: ["classical-to-quantum"],
    modules: [
      { slug: "what-is-a-wavefunction", title: "What Is a Wavefunction?" },
      { slug: "probability-density-and-normalization", title: "Probability Density and Normalization" },
      { slug: "expectation-values-in-position-space", title: "Expectation Values in Position Space" },
      { slug: "the-position-and-momentum-operators", title: "The Position and Momentum Operators" },
      { slug: "momentum-space-and-the-fourier-transform", title: "Momentum Space and the Fourier Transform" },
      { slug: "the-schrodinger-equation-in-position-space", title: "The Schrödinger Equation in Position Space" },
      { slug: "free-particle-wave-packets", title: "Free-Particle Wave Packets" },
      { slug: "the-infinite-square-well", title: "The Infinite Square Well" },
      { slug: "the-harmonic-oscillator-in-position-space", title: "The Harmonic Oscillator in Position Space" },
      { slug: "wave-packet-dynamics-and-dispersion", title: "Wave Packet Dynamics and Dispersion" },
      { slug: "tunneling-and-the-finite-barrier", title: "Tunneling and the Finite Barrier" },
      { slug: "numerically-evolving-quantum-states", title: "Numerically Evolving Quantum States" },
      { slug: "wave-mechanics-challenge", title: "Wave Mechanics Challenge" },
    ],
  },
  {
    slug: "operators-observables-measurement",
    pillar: "quantum-mechanics",
    title: "Operators, Observables & Measurement",
    description:
      "The general theory beneath the specific observables built so far: spectral decomposition and degeneracy, when two observables can be measured simultaneously, the measurement postulate made precise for degenerate eigenspaces, and the energy-time uncertainty relation derived from Ehrenfest's theorem, not asserted.",
    difficulty: "intermediate",
    estimatedHours: 8,
    prerequisites: ["wave-mechanics"],
    modules: [
      { slug: "spectral-decomposition-and-degeneracy", title: "Spectral Decomposition and Degeneracy" },
      { slug: "simultaneous-eigenstates-and-compatible-observables", title: "Simultaneous Eigenstates and Compatible Observables" },
      { slug: "complete-sets-of-commuting-observables", title: "Complete Sets of Commuting Observables" },
      { slug: "the-measurement-postulate-generalized", title: "The Measurement Postulate, Generalized" },
      { slug: "sequential-measurements-and-incompatibility", title: "Sequential Measurements and Incompatibility" },
      { slug: "the-energy-time-uncertainty-relation", title: "The Energy-Time Uncertainty Relation" },
      { slug: "degeneracy-in-practice", title: "Degeneracy in Practice: A Worked System" },
      { slug: "operators-observables-measurement-challenge", title: "Operators, Observables & Measurement Challenge" },
    ],
  },
  {
    slug: "one-dimensional-systems",
    pillar: "quantum-mechanics",
    title: "One-Dimensional Quantum Systems",
    description:
      "The solvable systems Wave Mechanics didn't get to: the finite square well's transcendental quantization condition (solved numerically, not in closed form), and scattering off steps and barriers, including partial reflection above a classically-surmountable step, and resonant transmission through a barrier at special energies.",
    difficulty: "intermediate",
    estimatedHours: 6,
    prerequisites: ["operators-observables-measurement"],
    modules: [
      { slug: "the-finite-square-well-setting-up-the-equation", title: "The Finite Square Well: Setting Up the Equation" },
      { slug: "solving-the-finite-well-numerically", title: "Solving the Finite Well Numerically" },
      { slug: "scattering-off-a-step-potential", title: "Scattering Off a Step Potential" },
      { slug: "resonant-transmission-through-a-barrier", title: "Resonant Transmission Through a Barrier" },
      { slug: "one-dimensional-systems-challenge", title: "One-Dimensional Systems Challenge" },
    ],
  },
  {
    slug: "angular-momentum-and-spin",
    pillar: "quantum-mechanics",
    title: "Angular Momentum & Spin",
    description:
      "From [Lx,Ly]=iħLz to the full quantized spectrum, spherical harmonics, and spin, including a genuine surprise: the spin-0 singlet of two combined spin-1/2 particles turns out to be exactly the Bell state |Ψ⁻⟩ already built for quantum computing, verified directly.",
    difficulty: "advanced",
    estimatedHours: 9,
    prerequisites: ["one-dimensional-systems"],
    modules: [
      { slug: "angular-momentum-commutation-relations", title: "Angular Momentum Commutation Relations" },
      { slug: "ladder-operators-and-the-angular-momentum-spectrum", title: "Ladder Operators and the Angular Momentum Spectrum" },
      { slug: "orbital-angular-momentum-and-spherical-harmonics", title: "Orbital Angular Momentum and Spherical Harmonics" },
      { slug: "spin-one-half-systems", title: "Spin-1/2 Systems" },
      { slug: "the-stern-gerlach-experiment", title: "The Stern-Gerlach Experiment" },
      { slug: "addition-of-angular-momentum", title: "Addition of Angular Momentum" },
      { slug: "capstone-from-abstract-algebra-to-the-hydrogen-atom", title: "Capstone: From Abstract Algebra to the Hydrogen Atom" },
    ],
  },
  {
    slug: "the-hydrogen-atom",
    pillar: "quantum-mechanics",
    title: "The Hydrogen Atom",
    description: "Solving a real three-dimensional atom, and where quantum numbers actually come from.",
    difficulty: "advanced",
    estimatedHours: 9,
    prerequisites: ["angular-momentum-and-spin"],
    modules: [
      { slug: "central-potentials", title: "Central Potentials" },
      { slug: "the-radial-equation", title: "The Radial Equation" },
      { slug: "hydrogen-energy-levels", title: "Hydrogen Energy Levels" },
      { slug: "orbitals-and-quantum-numbers", title: "Orbitals & Quantum Numbers" },
      { slug: "fine-structure-introduction", title: "Fine Structure (Introduction)" },
    ],
  },
  {
    slug: "approximation-methods",
    pillar: "quantum-mechanics",
    title: "Approximation Methods",
    description: "What to do when a system can't be solved exactly, which is almost always.",
    difficulty: "advanced",
    estimatedHours: 10,
    prerequisites: ["the-hydrogen-atom"],
    modules: [
      { slug: "time-independent-perturbation-theory", title: "Time-Independent Perturbation Theory" },
      { slug: "the-variational-method", title: "The Variational Method" },
      { slug: "the-wkb-approximation", title: "The WKB Approximation" },
      { slug: "time-dependent-perturbation-theory", title: "Time-Dependent Perturbation Theory" },
    ],
  },
  {
    slug: "identical-particles",
    pillar: "quantum-mechanics",
    title: "Identical Particles & Many-Body Systems",
    description: "Why identical particles aren't just alike: they're fundamentally indistinguishable.",
    difficulty: "advanced",
    estimatedHours: 7,
    prerequisites: ["approximation-methods"],
    modules: [
      { slug: "indistinguishability", title: "Indistinguishability" },
      { slug: "bosons-and-fermions", title: "Bosons & Fermions" },
      { slug: "the-pauli-exclusion-principle", title: "The Pauli Exclusion Principle" },
      { slug: "multi-electron-atoms-introduction", title: "Multi-Electron Atoms (Introduction)" },
    ],
  },
  {
    slug: "advanced-quantum-mechanics",
    pillar: "quantum-mechanics",
    title: "Advanced Topics in Quantum Mechanics",
    description:
      "Beyond closed, unitary systems: open quantum systems and Kraus-operator decoherence channels, why macroscopic superpositions don't survive contact with an environment, and Feynman's path integral, a genuinely different formulation from every operator-based lesson so far. Builds on, and deliberately does not repeat, the Entanglement, Mixed States & Bell Tests course's density-matrix foundations.",
    difficulty: "advanced",
    estimatedHours: 8,
    prerequisites: ["identical-particles"],
    modules: [
      { slug: "open-quantum-systems-and-kraus-operators", title: "Open Quantum Systems & Kraus Operators" },
      { slug: "decoherence-and-the-quantum-to-classical-transition", title: "Decoherence & the Quantum-to-Classical Transition" },
      { slug: "the-path-integral-formulation", title: "The Path Integral Formulation (Introduction)" },
      { slug: "capstone-operators-and-paths", title: "Capstone: Operators, Paths, and What's Still Open" },
    ],
  },

  // ---------------------------------------------------------------------
  // Quantum Computing
  // ---------------------------------------------------------------------
  {
    slug: "qubits-and-quantum-states",
    pillar: "quantum-computing",
    title: "Qubits & Quantum States",
    description:
      "Everything about a single qubit: from the classical bit to Dirac notation, the Bloch sphere, measurement, and the gates that manipulate it.",
    difficulty: "foundational",
    estimatedHours: 7,
    prerequisites: ["mathematical-foundations"],
    modules: [
      { slug: "what-is-a-qubit", title: "What Is a Qubit?" },
      { slug: "complex-numbers-for-quantum-mechanics", title: "Complex Numbers for Quantum Mechanics" },
      { slug: "dirac-notation", title: "Dirac Notation" },
      { slug: "quantum-states-and-state-vectors", title: "Quantum States and State Vectors" },
      { slug: "the-bloch-sphere", title: "The Bloch Sphere" },
      { slug: "measurement-and-probability", title: "Measurement and Probability" },
      { slug: "quantum-gates", title: "Quantum Gates" },
      { slug: "single-qubit-rotations", title: "Single-Qubit Rotations" },
      { slug: "global-and-relative-phase", title: "Global Phase vs. Relative Phase" },
      { slug: "building-qubit-circuits", title: "Putting It Together: Building and Analyzing Qubit Circuits" },
    ],
  },
  {
    slug: "quantum-gates-and-circuits",
    pillar: "quantum-computing",
    title: "Quantum Gates & Circuits",
    description:
      "From one qubit to many: tensor products, entanglement, multi-qubit measurement, and the protocols (teleportation, no-cloning) that make multi-qubit systems behave nothing like classical ones.",
    difficulty: "intermediate",
    estimatedHours: 8,
    prerequisites: ["qubits-and-quantum-states"],
    modules: [
      { slug: "tensor-products", title: "Tensor Products: Combining Qubits" },
      { slug: "multi-qubit-state-vectors", title: "Multi-Qubit State Vectors" },
      { slug: "quantum-circuit-notation", title: "Quantum Circuit Notation" },
      { slug: "controlled-gates-and-cnot", title: "Controlled Gates and CNOT" },
      { slug: "bell-states-and-entanglement", title: "Bell States and Entanglement" },
      { slug: "multi-qubit-measurement", title: "Multi-Qubit Measurement" },
      { slug: "the-no-cloning-theorem", title: "The No-Cloning Theorem" },
      { slug: "quantum-teleportation", title: "Quantum Teleportation" },
      { slug: "interference-in-quantum-circuits", title: "Interference in Quantum Circuits" },
      { slug: "building-quantum-circuits", title: "Building Quantum Circuits" },
      { slug: "bb84-quantum-key-distribution", title: "BB84: Quantum Key Distribution" },
      { slug: "superdense-coding", title: "Superdense Coding" },
      { slug: "universal-quantum-computation", title: "Universal Quantum Computation" },
    ],
  },
  {
    slug: "entanglement-and-measurement",
    pillar: "quantum-computing",
    title: "Entanglement, Mixed States & Bell Tests",
    description:
      "The density matrix: why a state vector alone can't describe part of an entangled system, how mixedness, purity, and entropy make that precise, and the CHSH experiment that rules out classical hidden-variable explanations, all checked against a real density-matrix engine.",
    difficulty: "advanced",
    estimatedHours: 9,
    prerequisites: ["quantum-gates-and-circuits"],
    modules: [
      { slug: "from-state-vectors-to-density-matrices", title: "From State Vectors to Density Matrices" },
      { slug: "pure-states-and-mixed-states", title: "Pure States and Mixed States" },
      { slug: "convex-combinations-and-physical-mixtures", title: "Convex Combinations and Physical Mixtures" },
      { slug: "partial-trace-and-reduced-states", title: "Partial Trace and Reduced States" },
      { slug: "why-entangled-subsystems-are-mixed", title: "Why Entangled Subsystems Are Mixed" },
      { slug: "purity-entropy-and-information", title: "Purity, von Neumann Entropy, and Information" },
      { slug: "entanglement-entropy-for-pure-states", title: "Entanglement Entropy for Pure Bipartite States" },
      { slug: "concurrence-a-two-qubit-measure", title: "Concurrence: A Two-Qubit Entanglement Measure" },
      { slug: "evolution-and-measurement-of-density-matrices", title: "Unitary Evolution and Measurement of Density Matrices" },
      { slug: "bells-theorem-and-local-hidden-variables", title: "Bell's Theorem and Local Hidden Variables" },
      { slug: "the-chsh-inequality", title: "The CHSH Inequality and Quantum Violation" },
      { slug: "capstone-analyzing-quantum-correlations", title: "Capstone: Analyzing Quantum Correlations" },
    ],
  },
  {
    slug: "quantum-algorithms-i",
    pillar: "quantum-computing",
    title: "Quantum Algorithms I: Foundations",
    description:
      "How interference lets quantum computers solve problems differently, not just faster: phase kickback, Deutsch-Jozsa, the quantum Fourier transform, phase estimation, and Grover's algorithm, each derived and checked against a real oracle/QFT/Grover engine.",
    difficulty: "advanced",
    estimatedHours: 10,
    prerequisites: ["entanglement-and-measurement"],
    modules: [
      { slug: "quantum-parallelism-and-the-oracle-model", title: "Quantum Parallelism and the Oracle Model" },
      { slug: "phase-kickback", title: "Phase Kickback" },
      { slug: "the-deutsch-jozsa-algorithm", title: "The Deutsch-Jozsa Algorithm" },
      { slug: "the-quantum-fourier-transform", title: "The Quantum Fourier Transform" },
      { slug: "quantum-phase-estimation", title: "Quantum Phase Estimation" },
      { slug: "grovers-algorithm-oracle-and-diffusion", title: "Grover's Algorithm: Oracle and Diffusion" },
      { slug: "grovers-algorithm-amplitude-amplification", title: "Grover's Algorithm: Amplitude Amplification" },
      { slug: "simons-algorithm", title: "Simon's Algorithm" },
      { slug: "capstone-comparing-quantum-advantage", title: "Capstone: Comparing Quantum Advantage" },
    ],
  },
  {
    slug: "quantum-algorithms-ii",
    pillar: "quantum-computing",
    title: "Quantum Algorithms II: Advanced",
    description:
      "Shor's algorithm's number-theory reduction and quantum period-finding circuit, run end to end on the classic factor-15 example, plus the variational quantum eigensolver and QAOA (the leading NISQ-era hybrid algorithms), each with a real, verified toy implementation.",
    difficulty: "advanced",
    estimatedHours: 10,
    prerequisites: ["quantum-algorithms-i"],
    modules: [
      { slug: "shors-algorithm-factoring-via-period-finding", title: "Shor's Algorithm: Factoring via Period Finding" },
      { slug: "the-quantum-period-finding-circuit", title: "The Quantum Period-Finding Circuit" },
      { slug: "worked-example-factoring-15", title: "Worked Example: Factoring 15" },
      { slug: "the-variational-principle-and-ansatz-circuits", title: "The Variational Principle and Ansatz Circuits" },
      { slug: "vqe-a-worked-toy-example", title: "VQE: A Worked Toy Example" },
      { slug: "qaoa-and-combinatorial-optimization", title: "QAOA and Combinatorial Optimization" },
      { slug: "qaoa-a-worked-max-cut-example", title: "QAOA: A Worked Max-Cut Example" },
      { slug: "capstone-hybrid-algorithms-nisq-and-honest-scope", title: "Capstone: Hybrid Algorithms, NISQ, and Honest Scope" },
    ],
  },
  {
    slug: "error-correction-and-fault-tolerance",
    pillar: "quantum-computing",
    title: "Quantum Error Correction & Fault Tolerance",
    description:
      "Why quantum errors resist the classical repetition-code strategy, then the 3-qubit bit-flip and phase-flip codes, built and verified end to end (genuine encoding, ancilla-based syndrome extraction, and exact recovery), through the stabilizer formalism, surface codes, and the fault-tolerance threshold.",
    difficulty: "advanced",
    estimatedHours: 10,
    prerequisites: ["quantum-algorithms-ii"],
    modules: [
      { slug: "why-quantum-errors-are-different", title: "Why Quantum Errors Are Different" },
      { slug: "the-three-qubit-bit-flip-code", title: "The Three-Qubit Bit-Flip Code" },
      { slug: "the-three-qubit-phase-flip-code", title: "The Three-Qubit Phase-Flip Code" },
      { slug: "the-shor-code-combining-both", title: "The Shor Code: Combining Both" },
      { slug: "stabilizer-formalism-basics", title: "Stabilizer Formalism Basics" },
      { slug: "syndrome-measurement-and-the-recovery-map", title: "Syndrome Measurement and the Recovery Map" },
      { slug: "surface-codes-a-conceptual-introduction", title: "Surface Codes: A Conceptual Introduction" },
      { slug: "capstone-fault-tolerant-thresholds-and-resource-overhead", title: "Capstone: Fault-Tolerant Thresholds and Resource Overhead" },
    ],
  },

  // ---------------------------------------------------------------------
  // Quantum Hardware
  // ---------------------------------------------------------------------
  {
    slug: "physical-qubit-platforms",
    pillar: "quantum-hardware",
    title: "Physical Qubit Platforms",
    description:
      "The competing physical systems used to build real, working qubits: what each one physically IS, how a qubit is encoded, how gates are driven, and the specific engineering tradeoffs (coherence time, gate speed, connectivity, scalability) that keep any one platform from being the obvious winner.",
    difficulty: "intermediate",
    estimatedHours: 7,
    prerequisites: ["qubits-and-quantum-states"],
    modules: [
      { slug: "superconducting-qubits", title: "Superconducting Qubits" },
      { slug: "trapped-ions", title: "Trapped Ions" },
      { slug: "neutral-atoms", title: "Neutral Atoms" },
      { slug: "photonic-qubits", title: "Photonic Qubits" },
      { slug: "spin-qubits", title: "Spin Qubits" },
      { slug: "capstone-comparing-qubit-platforms", title: "Capstone: Comparing Qubit Platforms" },
    ],
  },
  {
    slug: "control-and-readout",
    pillar: "quantum-hardware",
    title: "Control & Readout",
    description:
      "The engineering layer that drives qubits and reads their state back out: why millikelvin cooling is a computed necessity (not just 'colder is better'), how an abstract gate becomes a real microwave pulse via the exact Rabi model, how dispersive readout measures a qubit indirectly, and how calibration recovers a device's actual, drifting control parameters.",
    difficulty: "intermediate",
    estimatedHours: 6,
    prerequisites: ["physical-qubit-platforms"],
    modules: [
      { slug: "cryogenic-systems", title: "Cryogenic Systems" },
      { slug: "control-electronics", title: "Control Electronics" },
      { slug: "qubit-readout-techniques", title: "Qubit Readout Techniques" },
      { slug: "calibration", title: "Calibration" },
    ],
  },
  {
    slug: "noise-decoherence-and-scaling",
    pillar: "quantum-hardware",
    title: "Noise, Decoherence & Scaling",
    description:
      "Why quantum devices are so fragile, made quantitative: coherent vs. incoherent noise sources, T1/T2 connected exactly to Advanced Topics in Quantum Mechanics' Kraus channels, crosstalk's computed fidelity loss, why per-gate error compounds multiplicatively across a circuit, and the real physical-to-logical qubit overhead fault tolerance requires.",
    difficulty: "advanced",
    estimatedHours: 7,
    prerequisites: ["control-and-readout"],
    modules: [
      { slug: "sources-of-noise", title: "Sources of Noise" },
      { slug: "t1-and-t2-decoherence", title: "T1 & T2 Decoherence" },
      { slug: "crosstalk", title: "Crosstalk" },
      { slug: "scaling-challenges", title: "Scaling Challenges" },
      { slug: "roadmaps-to-fault-tolerance", title: "Roadmaps to Fault Tolerance" },
    ],
  },

  // ---------------------------------------------------------------------
  // Quantum Software
  // ---------------------------------------------------------------------
  {
    slug: "programming-quantum-computers",
    pillar: "quantum-software",
    title: "Programming Quantum Computers",
    description:
      "How real quantum software is actually structured: building a circuit as data before running it (this platform's own QuantumCircuit class), how major SDKs (Qiskit, Cirq, PennyLane) share that same pattern, a full build-run-sample walkthrough, and the genuinely opposite ways simulators and real hardware fail.",
    difficulty: "foundational",
    estimatedHours: 6,
    prerequisites: ["quantum-gates-and-circuits"],
    modules: [
      { slug: "circuit-representation-in-code", title: "Circuit Representation in Code" },
      { slug: "quantum-sdks-overview", title: "Quantum SDKs Overview" },
      { slug: "writing-your-first-circuit", title: "Writing Your First Circuit" },
      { slug: "simulators-vs-real-hardware", title: "Simulators vs. Real Hardware" },
    ],
  },
  {
    slug: "simulating-quantum-systems",
    pillar: "quantum-software",
    title: "Simulating Quantum Systems",
    description:
      "Naming the technique this platform has used since lesson one (state-vector simulation), pricing it exactly (16×2ⁿ bytes, a wall around 30-50 qubits), the tensor-network workaround for limited-entanglement states, and a real noisy-circuit simulator reusing Advanced Topics in Quantum Mechanics' Kraus channels directly.",
    difficulty: "intermediate",
    estimatedHours: 7,
    prerequisites: ["programming-quantum-computers"],
    modules: [
      { slug: "state-vector-simulation", title: "State-Vector Simulation" },
      { slug: "computational-cost-and-scaling", title: "Computational Cost & Scaling" },
      { slug: "tensor-network-methods", title: "Tensor Network Methods" },
      { slug: "noise-simulation", title: "Noise Simulation" },
    ],
  },
  {
    slug: "compilation-and-hybrid-algorithms",
    pillar: "quantum-software",
    title: "Compilation & Hybrid Algorithms",
    description:
      "Turning an abstract circuit into something real hardware can run: SWAP-network transpilation for limited connectivity (verified exact vs. an idealized direct gate), gate decomposition into a native {Rz,Ry} set (five gates verified to machine precision), the general hybrid quantum-classical loop, and a VQE implementation built with this platform's own QuantumCircuit that matches Quantum Algorithms II's matrix-based result exactly.",
    difficulty: "advanced",
    estimatedHours: 7,
    prerequisites: ["simulating-quantum-systems"],
    modules: [
      { slug: "quantum-compilation-and-transpilation", title: "Quantum Compilation & Transpilation" },
      { slug: "gate-decomposition", title: "Gate Decomposition" },
      { slug: "hybrid-workflows", title: "Hybrid Quantum-Classical Workflows" },
      { slug: "variational-algorithm-implementation", title: "Variational Algorithm Implementation" },
      { slug: "quantum-error-mitigation", title: "Quantum Error Mitigation" },
    ],
  },
  // ---------------------------------------------------------------------
  // Quantum Mastery (graduate-level mathematical physics and rigorous
  // quantum information theory, extending both the Mechanics and Computing
  // pillars — each course below genuinely needs prerequisites from both,
  // which is why this is its own pillar rather than folded into one of
  // the four existing ones. See the per-lesson design notes embedded in
  // each course's description for what makes each module genuinely
  // "master" level: real derivations/proofs, not renamed intro material.)
  // ---------------------------------------------------------------------
  {
    slug: "hilbert-space-and-spectral-theory",
    pillar: "quantum-mastery",
    title: "Hilbert Space & Spectral Theory",
    description:
      "Making rigorous everything Wave Mechanics and Operators, Observables & Measurement did heuristically: self-adjointness (not just formal Hermiticity), the spectral theorem for unbounded operators, rigged Hilbert space for continuous spectra, Green's functions and resolvents, and the general Sturm-Liouville theorem that quietly unifies every solvable potential taught earlier in the curriculum.",
    difficulty: "master",
    estimatedHours: 11,
    prerequisites: ["operators-observables-measurement", "one-dimensional-systems"],
    modules: [
      { slug: "hilbert-spaces-and-self-adjointness", title: "Hilbert Spaces and Self-Adjointness" },
      { slug: "the-spectral-theorem-for-unbounded-operators", title: "The Spectral Theorem for Unbounded Operators" },
      { slug: "continuous-spectra-and-rigged-hilbert-space", title: "Continuous Spectra and Rigged Hilbert Space" },
      { slug: "greens-functions-and-resolvents", title: "Green's Functions and Resolvents" },
      { slug: "sturm-liouville-theory", title: "Sturm-Liouville Theory" },
      { slug: "capstone-what-rigor-buys-you", title: "Capstone: What Rigor Buys You" },
    ],
  },
  {
    slug: "symmetry-scattering-and-semiclassical-methods",
    pillar: "quantum-mastery",
    title: "Symmetry, Scattering & Semiclassical Methods",
    description:
      "Finishing the derivation Fine Structure explicitly declined to do: degenerate perturbation theory applied to real spin-orbit splitting, the general Clebsch-Gordan coefficients and the Wigner-Eckart theorem, the adiabatic theorem and Berry's geometric phase, coherent and squeezed states, and a genuine three-dimensional partial-wave scattering treatment with a real S-matrix.",
    difficulty: "master",
    estimatedHours: 11,
    prerequisites: ["approximation-methods"],
    modules: [
      { slug: "degenerate-perturbation-theory-and-fine-structure", title: "Degenerate Perturbation Theory and Fine Structure" },
      { slug: "clebsch-gordan-coefficients-and-the-wigner-eckart-theorem", title: "Clebsch-Gordan Coefficients and the Wigner-Eckart Theorem" },
      { slug: "the-adiabatic-theorem-and-berry-phase", title: "The Adiabatic Theorem and Berry Phase" },
      { slug: "coherent-and-squeezed-states", title: "Coherent and Squeezed States" },
      { slug: "three-dimensional-scattering-and-the-s-matrix", title: "Three-Dimensional Scattering and the S-Matrix" },
      { slug: "capstone-symmetry-and-the-classical-limit", title: "Capstone: Symmetry and the Classical Limit" },
    ],
  },
  {
    slug: "quantum-information-theory",
    pillar: "quantum-mastery",
    title: "Rigorous Quantum Information Theory",
    description:
      "The density-matrix formalism made exact: the Schmidt decomposition theorem (asserted but never proved in Entanglement, Mixed States & Bell Tests), trace distance and fidelity, the Choi-Jamiolkowski isomorphism, the Lindblad master equation as the genuine continuous-time origin of T1/T2 decay, mixed-state entanglement measures, and a general stabilizer/CSS-code treatment beyond the three-qubit codes taught earlier.",
    difficulty: "master",
    estimatedHours: 12,
    prerequisites: ["advanced-quantum-mechanics", "error-correction-and-fault-tolerance"],
    modules: [
      { slug: "schmidt-decomposition-and-purification", title: "Schmidt Decomposition and Purification" },
      { slug: "trace-distance-and-fidelity", title: "Trace Distance and Fidelity" },
      { slug: "quantum-channels-kraus-and-choi", title: "Quantum Channels: Kraus and Choi" },
      { slug: "the-lindblad-master-equation", title: "The Lindblad Master Equation" },
      { slug: "relative-entropy-and-mixed-state-entanglement", title: "Relative Entropy and Mixed-State Entanglement" },
      { slug: "rigorous-teleportation-and-superdense-coding", title: "Rigorous Teleportation and Superdense Coding" },
      { slug: "css-codes-and-the-general-stabilizer-formalism", title: "CSS Codes and the General Stabilizer Formalism" },
    ],
  },
  {
    slug: "advanced-algorithms-and-complexity",
    pillar: "quantum-mastery",
    title: "Quantum Algorithms, Complexity & Simulation at Scale",
    description:
      "What the Quantum Algorithms II capstone's honesty table leaves open: a formal definition of BQP and exactly what oracle separations do and don't prove, the Trotter-Suzuki product formula with a real error bound, discrete-time quantum walks and their ballistic spreading, the full precision/depth tradeoff of phase estimation, and why variational circuits' gradients vanish exponentially as they scale.",
    difficulty: "master",
    estimatedHours: 11,
    prerequisites: ["quantum-algorithms-ii", "compilation-and-hybrid-algorithms"],
    modules: [
      { slug: "bqp-and-oracle-complexity", title: "BQP and Oracle Complexity" },
      { slug: "hamiltonian-simulation-and-trotterization", title: "Hamiltonian Simulation and Trotterization" },
      { slug: "quantum-walks", title: "Quantum Walks" },
      { slug: "phase-estimation-precision-and-qft-depth", title: "Phase Estimation Precision and QFT Depth" },
      { slug: "barren-plateaus-and-variational-trainability", title: "Barren Plateaus and Variational Trainability" },
      { slug: "capstone-what-scale-actually-requires", title: "Capstone: What Scale Actually Requires" },
    ],
  },
  {
    slug: "quantum-shannon-theory",
    pillar: "quantum-mastery",
    title: "Quantum Shannon Theory",
    description:
      "The measurement postulate and Kraus-channel picture, made complete and quantitative: POVMs and Naimark's theorem for why every generalized measurement is a projective one on a bigger space, Stinespring dilation for why every channel is a unitary on a bigger space, von Neumann entropy and quantum mutual/conditional information (which can go negative), the data-processing inequality as the real content behind 'information can't increase', entanglement distillation and the typical-subspace idea, and the channel capacities that say exactly how much can be sent through a given noisy channel.",
    difficulty: "master",
    estimatedHours: 11,
    prerequisites: ["quantum-information-theory"],
    modules: [
      { slug: "povms-and-generalized-measurement", title: "POVMs and Generalized Measurement" },
      { slug: "stinespring-dilation-and-channel-purification", title: "Stinespring Dilation and Channel Purification" },
      { slug: "quantum-entropy-and-information-measures", title: "Quantum Entropy and Information Measures" },
      { slug: "the-data-processing-inequality", title: "The Data-Processing Inequality" },
      { slug: "entanglement-distillation-and-typical-subspaces", title: "Entanglement Distillation and Typical Subspaces" },
      { slug: "capstone-what-can-be-sent-through-noise", title: "Capstone: What Can Be Sent Through Noise" },
    ],
  },
  // ---------------------------------------------------------------------
  // Apex — the summit of the curriculum. Five courses, each extending a
  // specific Quantum Mastery / Quantum Software thread to research depth:
  // algorithms (QSVT), fault tolerance (surface codes to resource counts),
  // complexity theory (QMA, Local Hamiltonian), simulation & compilation at
  // scale, and finally research methods — reading and evaluating real
  // quantum-computing claims. Every prerequisite below is a real course
  // slug defined above in this same file.
  // ---------------------------------------------------------------------
  {
    slug: "algorithmic-frontiers",
    pillar: "apex",
    title: "Algorithmic Frontiers",
    description:
      "The framework that quietly absorbed most of quantum algorithms research since 2016: block encodings and linear combinations of unitaries for turning a matrix into a circuit, quantum signal processing for applying an arbitrary polynomial to a single qubit, the quantum singular value transformation that unifies Grover's algorithm, Hamiltonian simulation, and linear-systems solving as one construction, and modern amplitude estimation that gets Grover's quadratic speedup for estimation without ever calling phase estimation.",
    difficulty: "master",
    estimatedHours: 10,
    prerequisites: ["advanced-algorithms-and-complexity"],
    modules: [
      { slug: "block-encodings-and-linear-combinations-of-unitaries", title: "Block Encodings and Linear Combinations of Unitaries" },
      { slug: "quantum-signal-processing", title: "Quantum Signal Processing" },
      { slug: "the-quantum-singular-value-transformation", title: "The Quantum Singular Value Transformation" },
      { slug: "amplitude-estimation-without-phase-estimation", title: "Amplitude Estimation Without Phase Estimation" },
      { slug: "applications-eigenvalues-and-linear-systems", title: "Applications: Eigenvalues and Linear Systems" },
      { slug: "capstone-the-toolbox-that-ate-quantum-algorithms", title: "Capstone: The Toolbox That Ate Quantum Algorithms" },
    ],
  },
  {
    slug: "fault-tolerance-frontiers",
    pillar: "apex",
    title: "Fault Tolerance Frontiers",
    description:
      "What Error Correction & Fault Tolerance's conceptual surface-code introduction and this pillar's own general stabilizer formalism build toward: the real 2D surface-code lattice and its logical operators, how a decoder actually turns a syndrome into a correction and why logical error rate falls exponentially with code distance below threshold, lattice surgery as the real mechanism for logical two-qubit gates, magic-state distillation as the unavoidable cost of a universal gate set, the threshold theorem's proof strategy, and a full worked resource estimate for running one real algorithm fault-tolerantly.",
    difficulty: "master",
    estimatedHours: 11,
    prerequisites: ["quantum-information-theory"],
    modules: [
      { slug: "surface-codes-in-depth", title: "Surface Codes in Depth" },
      { slug: "decoding-surface-codes", title: "Decoding Surface Codes" },
      { slug: "lattice-surgery", title: "Lattice Surgery" },
      { slug: "magic-states-and-distillation", title: "Magic States and Distillation" },
      { slug: "the-threshold-theorem", title: "The Threshold Theorem" },
      { slug: "capstone-resource-estimation-for-a-real-algorithm", title: "Capstone: Resource Estimation for a Real Algorithm" },
    ],
  },
  {
    slug: "quantum-complexity-theory",
    pillar: "apex",
    title: "Quantum Complexity Theory",
    description:
      "BQP and Oracle Complexity's formal definitions extended to where the real open questions live: QMA as the quantum generalization of NP-verification, the Local Hamiltonian problem and why it is QMA-complete (Kitaev's theorem), the query-complexity lower-bound techniques that prove Grover's quadratic speedup is optimal, and an honest, current map of exactly what is proven, what is conjectured, and what remains open about quantum advantage.",
    difficulty: "master",
    estimatedHours: 9,
    prerequisites: ["advanced-algorithms-and-complexity"],
    modules: [
      { slug: "complexity-classes-p-np-and-bqp", title: "Complexity Classes: P, NP, and BQP" },
      { slug: "qma-and-quantum-verification", title: "QMA and Quantum Verification" },
      { slug: "the-local-hamiltonian-problem", title: "The Local Hamiltonian Problem" },
      { slug: "query-complexity-and-lower-bounds", title: "Query Complexity and Lower Bounds" },
      { slug: "capstone-what-we-know-and-dont", title: "Capstone: What We Know and Don't" },
    ],
  },
  {
    slug: "simulation-and-compilation-frontiers",
    pillar: "apex",
    title: "Simulation & Compilation Frontiers",
    description:
      "Tensor-Network Methods and Quantum Compilation & Transpilation extended to the questions that decide whether a quantum computer is worth building for a given task: matrix product states and how bond dimension quantifies entanglement, exactly which circuits a classical computer can simulate efficiently (and why that boundary is the real definition of quantum advantage), Clifford+T synthesis and T-count as the currency fault-tolerant algorithms actually spend, noise-aware compilation and resource estimation for real hardware graphs, and quantum chemistry as the flagship application connecting a real molecule to a qubit count.",
    difficulty: "master",
    estimatedHours: 10,
    prerequisites: ["advanced-algorithms-and-complexity", "compilation-and-hybrid-algorithms"],
    modules: [
      { slug: "tensor-networks-and-matrix-product-states", title: "Tensor Networks and Matrix Product States" },
      { slug: "when-classical-simulation-works", title: "When Classical Simulation Works" },
      { slug: "clifford-t-synthesis-and-resource-counting", title: "Clifford+T Synthesis and Resource Counting" },
      { slug: "noise-aware-compilation-and-resource-estimation", title: "Noise-Aware Compilation and Resource Estimation" },
      { slug: "quantum-simulation-of-molecules", title: "Quantum Simulation of Molecules" },
      { slug: "capstone-from-algorithm-to-qubit-count", title: "Capstone: From Algorithm to Qubit Count" },
    ],
  },
  {
    slug: "research-methods-and-synthesis",
    pillar: "apex",
    title: "Research Methods and Synthesis",
    description:
      "The final course of QuantumLearn: not new physics, but the skill of reading, evaluating, and designing real quantum-computing research after having built the machinery to actually check it — how to read a paper's claims against its assumptions, how to tell a theorem from a heuristic from a numerical experiment, how to catch a misleading 'quantum advantage' claim against a weak classical baseline, what a reproducible benchmark actually requires, and a capstone synthesis of the entire QuantumLearn journey from 'what is a qubit' to the present research frontier.",
    difficulty: "master",
    estimatedHours: 8,
    prerequisites: ["algorithmic-frontiers", "fault-tolerance-frontiers", "quantum-complexity-theory", "simulation-and-compilation-frontiers"],
    modules: [
      { slug: "how-to-read-a-quantum-computing-paper", title: "How to Read a Quantum Computing Paper" },
      { slug: "distinguishing-theorem-from-heuristic", title: "Distinguishing Theorem from Heuristic" },
      { slug: "evaluating-quantum-advantage-claims", title: "Evaluating Quantum Advantage Claims" },
      { slug: "reproducing-and-designing-experiments", title: "Reproducing and Designing Experiments" },
      { slug: "capstone-the-quantum-computing-landscape-today", title: "Capstone: The Quantum Computing Landscape Today" },
    ],
  },
];

export function getPillar(slug: string): PillarInfo | undefined {
  return PILLARS.find((pillar) => pillar.slug === slug);
}

export function getCoursesByPillar(pillar: Pillar): Course[] {
  return COURSES.filter((course) => course.pillar === pillar);
}

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((course) => course.slug === slug);
}

export function getModule(courseSlug: string, moduleSlug: string) {
  return getCourse(courseSlug)?.modules.find((module) => module.slug === moduleSlug);
}
