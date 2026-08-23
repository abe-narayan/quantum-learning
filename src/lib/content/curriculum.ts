import type { Course, PillarInfo, Pillar } from "./types";

export const PILLARS: PillarInfo[] = [
  {
    slug: "quantum-mechanics",
    title: "Quantum Mechanics",
    description:
      "The mathematical and physical foundation — from the failure of classical physics through the hydrogen atom and beyond.",
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
      "Turning the linear algebra of Mathematical Foundations into physics — states, observables, measurement, time evolution, and the postulates that connect them all, built from the ground up.",
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
      "Making position continuous — the wavefunction, the Fourier transform that connects position and momentum, the Schrödinger equation in position space, and the classic solvable systems (the infinite well, the harmonic oscillator revisited, tunneling), all explored through a real numerical wavefunction simulator with an actual FFT and genuine time evolution.",
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
    description: "How physical quantities become operators, and what measurement really does.",
    difficulty: "intermediate",
    estimatedHours: 9,
    prerequisites: ["wave-mechanics"],
    modules: [
      { slug: "operators-and-eigenvalues", title: "Operators & Eigenvalues" },
      { slug: "hermitian-operators", title: "Hermitian Operators" },
      { slug: "commutators", title: "Commutators" },
      { slug: "the-uncertainty-principle", title: "The Uncertainty Principle" },
      { slug: "the-measurement-postulate", title: "The Measurement Postulate" },
      { slug: "expectation-values", title: "Expectation Values" },
    ],
  },
  {
    slug: "one-dimensional-systems",
    pillar: "quantum-mechanics",
    title: "One-Dimensional Quantum Systems",
    description: "Solving the Schrödinger equation for the model systems that build all physical intuition.",
    difficulty: "intermediate",
    estimatedHours: 10,
    prerequisites: ["operators-observables-measurement"],
    modules: [
      { slug: "infinite-square-well", title: "Infinite Square Well" },
      { slug: "finite-square-well", title: "Finite Square Well" },
      { slug: "quantum-tunneling", title: "Quantum Tunneling" },
      { slug: "the-harmonic-oscillator", title: "The Harmonic Oscillator" },
      { slug: "step-potentials-and-scattering", title: "Step Potentials & Scattering" },
    ],
  },
  {
    slug: "angular-momentum-and-spin",
    pillar: "quantum-mechanics",
    title: "Angular Momentum & Spin",
    description: "Rotational symmetry in quantum mechanics, and the discovery of intrinsic spin.",
    difficulty: "advanced",
    estimatedHours: 10,
    prerequisites: ["one-dimensional-systems"],
    modules: [
      { slug: "orbital-angular-momentum", title: "Orbital Angular Momentum" },
      { slug: "angular-momentum-operators", title: "Angular Momentum Operators" },
      { slug: "spin-one-half-systems", title: "Spin-1/2 Systems" },
      { slug: "addition-of-angular-momentum", title: "Addition of Angular Momentum" },
      { slug: "the-stern-gerlach-experiment", title: "The Stern-Gerlach Experiment" },
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
    description: "What to do when a system can't be solved exactly — which is almost always.",
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
    description: "Why identical particles aren't just alike — they're fundamentally indistinguishable.",
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
    description: "Mixed states, entanglement, and the open questions at the edge of the theory.",
    difficulty: "advanced",
    estimatedHours: 9,
    prerequisites: ["identical-particles"],
    modules: [
      { slug: "density-matrices-and-mixed-states", title: "Density Matrices & Mixed States" },
      { slug: "entanglement-formal-treatment", title: "Entanglement: A Formal Treatment" },
      { slug: "epr-and-bell-inequalities", title: "EPR & Bell Inequalities" },
      { slug: "decoherence", title: "Decoherence" },
      { slug: "path-integral-introduction", title: "Path Integral Formulation (Introduction)" },
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
      "Everything about a single qubit — from the classical bit to Dirac notation, the Bloch sphere, measurement, and the gates that manipulate it.",
    difficulty: "foundational",
    estimatedHours: 7,
    prerequisites: ["mathematical-foundations"],
    modules: [
      { slug: "classical-bit-vs-qubit", title: "What Is a Qubit?" },
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
      "From one qubit to many — tensor products, entanglement, multi-qubit measurement, and the protocols (teleportation, no-cloning) that make multi-qubit systems behave nothing like classical ones.",
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
    ],
  },
  {
    slug: "entanglement-and-measurement",
    pillar: "quantum-computing",
    title: "Entanglement, Mixed States & Bell Tests",
    description:
      "Beyond a single Bell pair — multipartite entanglement, mixed states, and the experimental tests that rule out classical hidden-variable explanations.",
    difficulty: "advanced",
    estimatedHours: 8,
    prerequisites: ["quantum-gates-and-circuits"],
    modules: [
      { slug: "multipartite-entanglement", title: "Multipartite Entanglement: GHZ and W States" },
      { slug: "entanglement-measures", title: "Quantifying Entanglement" },
      { slug: "mixed-states-and-density-matrices", title: "Mixed States & Density Matrices" },
      { slug: "chsh-and-bell-tests", title: "The CHSH Inequality and Bell Tests" },
    ],
  },
  {
    slug: "quantum-algorithms-i",
    pillar: "quantum-computing",
    title: "Quantum Algorithms I: Foundations",
    description: "How interference lets quantum computers solve problems differently, not just faster.",
    difficulty: "intermediate",
    estimatedHours: 9,
    prerequisites: ["entanglement-and-measurement"],
    modules: [
      { slug: "quantum-parallelism", title: "Quantum Parallelism" },
      { slug: "the-deutsch-jozsa-algorithm", title: "The Deutsch-Jozsa Algorithm" },
      { slug: "the-quantum-fourier-transform", title: "The Quantum Fourier Transform" },
      { slug: "phase-estimation", title: "Phase Estimation" },
      { slug: "grovers-algorithm", title: "Grover's Algorithm" },
    ],
  },
  {
    slug: "quantum-algorithms-ii",
    pillar: "quantum-computing",
    title: "Quantum Algorithms II: Advanced",
    description: "Factoring, simulation, and the near-term hybrid algorithms built on top of them.",
    difficulty: "advanced",
    estimatedHours: 10,
    prerequisites: ["quantum-algorithms-i"],
    modules: [
      { slug: "shors-algorithm", title: "Shor's Algorithm" },
      { slug: "quantum-simulation-algorithms", title: "Quantum Simulation Algorithms" },
      { slug: "the-variational-quantum-eigensolver", title: "The Variational Quantum Eigensolver" },
      { slug: "the-quantum-approximate-optimization-algorithm", title: "The Quantum Approximate Optimization Algorithm" },
      { slug: "hybrid-quantum-classical-methods", title: "Hybrid Quantum-Classical Methods" },
    ],
  },
  {
    slug: "error-correction-and-fault-tolerance",
    pillar: "quantum-computing",
    title: "Quantum Error Correction & Fault Tolerance",
    description: "Protecting fragile quantum information long enough to compute with it.",
    difficulty: "advanced",
    estimatedHours: 10,
    prerequisites: ["quantum-algorithms-ii"],
    modules: [
      { slug: "noise-and-decoherence-in-computing", title: "Noise & Decoherence in Computing" },
      { slug: "classical-vs-quantum-error-correction", title: "Classical vs. Quantum Error Correction" },
      { slug: "the-stabilizer-formalism", title: "The Stabilizer Formalism" },
      { slug: "surface-codes", title: "Surface Codes" },
      { slug: "fault-tolerant-thresholds", title: "Fault-Tolerant Thresholds" },
    ],
  },

  // ---------------------------------------------------------------------
  // Quantum Hardware
  // ---------------------------------------------------------------------
  {
    slug: "physical-qubit-platforms",
    pillar: "quantum-hardware",
    title: "Physical Qubit Platforms",
    description: "The competing physical systems used to build real, working qubits.",
    difficulty: "intermediate",
    estimatedHours: 6,
    prerequisites: ["qubits-and-quantum-states"],
    modules: [
      { slug: "superconducting-qubits", title: "Superconducting Qubits" },
      { slug: "trapped-ions", title: "Trapped Ions" },
      { slug: "neutral-atoms", title: "Neutral Atoms" },
      { slug: "photonic-qubits", title: "Photonic Qubits" },
      { slug: "spin-qubits", title: "Spin Qubits" },
    ],
  },
  {
    slug: "control-and-readout",
    pillar: "quantum-hardware",
    title: "Control & Readout",
    description: "The engineering layer that drives qubits and reads their state back out.",
    difficulty: "intermediate",
    estimatedHours: 5,
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
    description: "Why quantum devices are so fragile, and what it takes to scale them up.",
    difficulty: "advanced",
    estimatedHours: 6,
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
    description: "Writing and running your first circuits, and how quantum SDKs are structured.",
    difficulty: "foundational",
    estimatedHours: 5,
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
    description: "How classical computers simulate quantum systems, and where that approach breaks down.",
    difficulty: "intermediate",
    estimatedHours: 6,
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
    description: "Turning an abstract circuit into something real hardware can run, efficiently.",
    difficulty: "advanced",
    estimatedHours: 6,
    prerequisites: ["simulating-quantum-systems"],
    modules: [
      { slug: "quantum-compilation-and-transpilation", title: "Quantum Compilation & Transpilation" },
      { slug: "gate-decomposition", title: "Gate Decomposition" },
      { slug: "hybrid-workflows", title: "Hybrid Quantum-Classical Workflows" },
      { slug: "variational-algorithm-implementation", title: "Variational Algorithm Implementation" },
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
