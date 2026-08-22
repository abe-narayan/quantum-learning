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
    estimatedHours: 8,
    prerequisites: [],
    modules: [
      { slug: "complex-numbers-and-vector-spaces", title: "Complex Numbers & Vector Spaces" },
      { slug: "linear-operators-and-matrices", title: "Linear Operators & Matrices" },
      { slug: "probability-for-quantum-mechanics", title: "Probability & Statistics for QM" },
      { slug: "fourier-analysis-basics", title: "Fourier Analysis Basics" },
    ],
  },
  {
    slug: "classical-to-quantum",
    pillar: "quantum-mechanics",
    title: "From Classical to Quantum",
    description: "The experiments and puzzles that forced physics beyond classical mechanics.",
    difficulty: "foundational",
    estimatedHours: 6,
    prerequisites: ["mathematical-foundations"],
    modules: [
      { slug: "failures-of-classical-physics", title: "Failures of Classical Physics" },
      { slug: "blackbody-radiation", title: "Blackbody Radiation" },
      { slug: "the-photoelectric-effect", title: "The Photoelectric Effect" },
      { slug: "wave-particle-duality", title: "Wave-Particle Duality" },
      { slug: "de-broglie-matter-waves", title: "de Broglie Matter Waves" },
    ],
  },
  {
    slug: "wave-mechanics",
    pillar: "quantum-mechanics",
    title: "Wave Mechanics & the Schrödinger Equation",
    description: "The wavefunction, its probabilistic meaning, and the equation that governs it.",
    difficulty: "intermediate",
    estimatedHours: 10,
    prerequisites: ["classical-to-quantum"],
    modules: [
      { slug: "the-wavefunction", title: "The Wavefunction" },
      { slug: "the-probability-interpretation", title: "The Probability Interpretation" },
      { slug: "time-dependent-schrodinger-equation", title: "Time-Dependent Schrödinger Equation" },
      { slug: "time-independent-schrodinger-equation", title: "Time-Independent Schrödinger Equation" },
      { slug: "free-particles-and-wave-packets", title: "Free Particles & Wave Packets" },
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
    description: "The basic unit of quantum information, and the notation used to describe it.",
    difficulty: "foundational",
    estimatedHours: 6,
    prerequisites: ["mathematical-foundations"],
    modules: [
      { slug: "classical-bit-vs-qubit", title: "The Classical Bit vs. the Qubit" },
      { slug: "dirac-notation", title: "Dirac Notation" },
      { slug: "the-bloch-sphere", title: "The Bloch Sphere" },
      { slug: "superposition", title: "Superposition" },
      { slug: "multi-qubit-states-and-tensor-products", title: "Multi-Qubit States & Tensor Products" },
    ],
  },
  {
    slug: "quantum-gates-and-circuits",
    pillar: "quantum-computing",
    title: "Quantum Gates & Circuits",
    description: "The operations that transform qubit states, and how to read a circuit diagram.",
    difficulty: "foundational",
    estimatedHours: 7,
    prerequisites: ["qubits-and-quantum-states"],
    modules: [
      { slug: "single-qubit-gates", title: "Single-Qubit Gates" },
      { slug: "circuit-diagrams", title: "Circuit Diagrams" },
      { slug: "multi-qubit-gates", title: "Multi-Qubit Gates" },
      { slug: "universal-gate-sets", title: "Universal Gate Sets" },
      { slug: "reversibility", title: "Reversibility" },
    ],
  },
  {
    slug: "entanglement-and-measurement",
    pillar: "quantum-computing",
    title: "Measurement, Superposition & Entanglement",
    description: "Correlations with no classical explanation, and what happens when you look.",
    difficulty: "intermediate",
    estimatedHours: 8,
    prerequisites: ["quantum-gates-and-circuits"],
    modules: [
      { slug: "measurement-in-quantum-computing", title: "Measurement in Quantum Computing" },
      { slug: "bell-states", title: "Bell States" },
      { slug: "entanglement-and-correlation", title: "Entanglement & Correlation" },
      { slug: "the-no-cloning-theorem", title: "The No-Cloning Theorem" },
      { slug: "quantum-teleportation", title: "Quantum Teleportation" },
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
