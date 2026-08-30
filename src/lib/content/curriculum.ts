import type { Course, PillarInfo, Pillar } from "./types";

/**
 * The six blurbs a reader meets first: on `/learn`, under every `PillarNext`
 * panel, and in the nav's own short forms.
 *
 * The first four used to be generic one-liners ("The simulators, compilers,
 * and SDKs used to program, test, and run quantum algorithms" — a tricolon of
 * nouns inside a tricolon of verbs, saying nothing a reader could not guess
 * from the track's name) while `quantum-mastery` and `apex` were specific and
 * authored. Six blurbs read together, so that was a visible seam in the one
 * place the site introduces itself. All six now name something particular the
 * track actually contains, and every particular below is checkable against the
 * course list underneath it: the five platforms are Physical Qubit Platforms'
 * five modules, the 16×2ⁿ bytes are Simulating Quantum Systems' own figure.
 *
 * Length is capped by more than taste: this module has a 12KB gzip client
 * budget (`src/lib/design/__tests__/clientBoundary.test.ts`) because it is
 * imported by client components, and these six strings are payload. Comments
 * like this one are stripped before measurement, so the explanation is free
 * and the prose is not.
 */
export const PILLARS: PillarInfo[] = [
  {
    slug: "quantum-mechanics",
    title: "Quantum Mechanics",
    description:
      "Where the mathematics comes from and what it is a statement about: linear algebra built from scratch, then the postulates, the Schrödinger equation and the hydrogen atom, derived here rather than quoted.",
  },
  {
    slug: "quantum-computing",
    title: "Quantum Computing",
    description:
      "One qubit, then many, then the interference that makes a quantum algorithm different in kind and not merely faster: Deutsch-Jozsa, Grover and Shor, and the error correction real hardware would need to run any of them.",
  },
  {
    slug: "quantum-hardware",
    title: "Quantum Hardware",
    description:
      "The five competing ways to make a qubit out of actual matter, the microwave pulses and millikelvin refrigerators that drive and read one, and the noise budget that decides how many can be wired together.",
  },
  {
    slug: "quantum-software",
    title: "Quantum Software",
    description:
      "The layer between an algorithm on paper and a machine that runs it: a circuit represented as data, the 16×2ⁿ bytes simulating one costs, and what a compiler must do to fit it onto hardware whose qubits are not all connected.",
  },
  {
    slug: "quantum-mastery",
    title: "Quantum Mastery",
    description:
      "Graduate-level mathematical physics and rigorous quantum information theory for those who've completed the core curriculum: proofs, not just results, drawing on and extending every earlier track.",
  },
  {
    slug: "apex",
    title: "Apex",
    description:
      "The summit of StudyQuantum: research-depth algorithms, fault tolerance, complexity theory, large-scale simulation and compilation, and a final course in reading and evaluating real quantum-computing research. It is the point where a motivated student can approach the literature without being lost.",
  },
];

/**
 * ============================================================
 * `estimatedHours`: what the number means, and how it is derived
 * ============================================================
 * Every value below is the sum of that course's authored lesson
 * `estimatedMinutes`, rounded to the nearest half hour. Nothing else goes in:
 * no allowance for practice problems, no padding for "and then you think about
 * it for a while."
 *
 * The rule exists because the previous numbers were hand-guessed and had
 * drifted into an outright contradiction that a reader meets on their very
 * first course card. `CourseList` renders `{course.estimatedHours}h` in the
 * stats block and `{lesson.estimatedMinutes} min` on every module row of the
 * *same card*. Quantum Shannon Theory said "11h" above six rows summing to 160
 * minutes; Approximation Methods said "10h" above 105 minutes. The overstatement
 * ran from 1.1x (Mathematical Foundations, which was very nearly right) to 4.1x,
 * with no consistent factor, so it could not even be read as "hours including
 * exercises": it was just noise. A reader who budgets ten hours for a
 * two-hour course notices on the first sitting, and from then on discounts
 * every number on the site.
 *
 * Keeping the rule mechanical is the point: `curriculumCoverage.test.ts`
 * re-derives all 32 values from `LESSON_METAS` and fails if any drifts, so
 * adding a lesson without updating its course's hours is caught at test time
 * rather than by a reader with a stopwatch.
 *
 * Half-hour granularity (so non-integers appear here) is deliberate: every
 * consumer either renders the value directly next to an "h"/"hrs" unit or sums
 * it, and "1.5h" is a truthful readout where rounding to "1h" or "2h" would
 * throw away a third of the answer on the shortest courses.
 */
export const COURSES: Course[] = [
  // ---------------------------------------------------------------------
  // Quantum Mechanics
  // ---------------------------------------------------------------------
  {
    slug: "mathematical-foundations",
    pillar: "quantum-mechanics",
    title: "Mathematical Foundations for Quantum Mechanics",
    description:
      "The linear algebra, complex numbers, and probability you need before the physics makes sense. Starts from algebra and trigonometry and builds every tool it uses, with no calculus assumed anywhere in it, but it is a mathematics course from the first page: derivations and proofs rather than analogies. From the next course on, single-variable calculus (derivatives, integrals, and first-order Taylor expansion) is assumed rather than taught.",
    // Stays "foundational" deliberately. This is one of the curriculum's two
    // zero-prerequisite courses (the other is "Qubits & Quantum States", the
    // intuition-first way in; see the note on its own `prerequisites`), and
    // it is the rigorous one. `CurriculumExplorer`'s difficulty filter
    // is an exact-match filter, so promoting it to "intermediate" would hide
    // the one true entry point from a beginner filtering for "Foundational,"
    // and would make `DIFFICULTY_HINT.intermediate` ("Builds directly on
    // earlier courses") false for a course that builds on nothing. The real
    // signal a reader needs, that this is rigorous from page one unlike the
    // intuition-first route through "What Is a Qubit?", is carried by the
    // description above instead, which renders directly beside the
    // `DifficultyMark` on every course card. See docs/BEGINNER_REVIEW.md
    // blocker 4.
    difficulty: "foundational",
    estimatedHours: 5.5,
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
      "Turning the linear algebra of Mathematical Foundations into physics: states, observables, measurement, time evolution, and the postulates that connect them all, built from the ground up. Single-variable calculus (derivatives, integrals, and first-order Taylor expansion) is assumed rather than taught from this course on.",
    difficulty: "intermediate",
    estimatedHours: 5,
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
    estimatedHours: 5,
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
    estimatedHours: 3,
    // `quantum-gates-and-circuits` is not decoration here. The course's final
    // worked lesson ("Degeneracy in Practice") is built end to end on a Bell
    // state and says so in its own opening line: "The target is a Bell state,
    // built originally in the Quantum Gates & Circuits course… a system you
    // already know." A reader who took the rigor-first route through
    // Mathematical Foundations → Classical to Quantum → Wave Mechanics has
    // never seen a Bell state, a CNOT, or a two-qubit tensor product, so that
    // sentence is false for them and the lesson's entire payoff evaporates.
    // The dependency was already there in the lesson metadata; only the course
    // card was hiding it. Declaring it here is what makes the two agree.
    //
    // The cost of admitting it is that this course now sits downstream of the
    // Computing pillar, which is why `one-dimensional-systems` below
    // no longer depends on this course. Left alone, this one edge would have
    // dragged every remaining Mechanics course (1D systems, angular momentum,
    // hydrogen, approximation methods, identical particles) behind the whole
    // Computing pillar, which is not what any of those courses actually need.
    //
    // Re-examined and KEPT. The edge was challenged as a possible authoring
    // artefact, on the reasonable ground that a Foundations-tier track
    // requiring a mid-Computing course looks like a curriculum bug. The
    // lesson corpus says otherwise: `degeneracy-in-practice.mdx` declares
    // `quantum-computing/quantum-gates-and-circuits/bell-states-and-entanglement`
    // in its own `prerequisites`, builds its entire worked CSCO on Z⊗I and
    // I⊗Z over a Bell state, and closes on that state's known perfect
    // correlation. There is nothing to remove without rewriting the lesson,
    // and `curriculumCoverage.test.ts` enforces that a lesson's cross-course
    // prerequisites lie inside its course's closure, so deleting the edge here
    // would fail a test rather than fix anything. What changed instead was the
    // copy that denied it: the Foundations tier blurb, /mechanics' lede and
    // curriculum line, and the homepage's Act I premise.
    prerequisites: ["wave-mechanics", "quantum-gates-and-circuits"],
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
    estimatedHours: 2,
    // Was `operators-observables-measurement`, which was the order these two
    // courses were written in rather than a real dependency. Every one of this
    // course's five lessons names its own prerequisites, and not one of them
    // reaches into Operators, Observables & Measurement: the finite well is
    // built from Wave Mechanics' infinite well and tunneling lessons, and the
    // scattering lessons from its free-particle wave packets. Nothing here uses
    // spectral decomposition, a complete set of commuting observables, or the
    // generalized measurement postulate, the three things that course exists
    // to supply.
    //
    // Demoting it from a prerequisite to plain curriculum order matters more
    // than usual because of the edge added just above: Operators, Observables
    // & Measurement genuinely needs the Computing pillar's Bell states, so
    // leaving this edge in place would have made every later Mechanics course
    // unreachable until a rigor-first reader had also finished Qubits and
    // Quantum Gates & Circuits, a wall none of them earn.
    prerequisites: ["wave-mechanics"],
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
      "Builds the entire quantized angular-momentum spectrum out of one commutation relation, [Lx,Ly]=iħLz, then spherical harmonics and spin. You finish able to add two angular momenta and to check for yourself that the spin-0 singlet of two spin-1/2 particles is exactly the Bell state |Ψ⁻⟩ the computing track already built.",
    difficulty: "advanced",
    estimatedHours: 3,
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
    description:
      "Assumes angular momentum and spherical harmonics and spends them on the first fully three-dimensional system in the curriculum. Separating the Coulomb problem into a radial and an angular equation is what produces n, ℓ and mₗ, so you leave able to derive the quantum numbers rather than memorize them.",
    difficulty: "advanced",
    estimatedHours: 2,
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
    description:
      "Almost no real system has a closed-form solution, so this course covers the four standard ways round that: perturbation theory when the Hamiltonian is close to one you can solve, the variational method for a rigorous upper bound on a ground-state energy, WKB for slowly varying potentials, and time-dependent perturbation theory for transition rates. Assumes you can already solve the hydrogen atom.",
    difficulty: "advanced",
    estimatedHours: 2,
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
    description:
      "Identical particles are not merely alike; indistinguishability is a constraint on the state itself. From that one requirement you derive the boson/fermion split, the Pauli exclusion principle, and why multi-electron atoms have the shell structure they do.",
    difficulty: "advanced",
    estimatedHours: 1.5,
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
      "Beyond closed, unitary systems: open quantum systems and Kraus-operator decoherence channels, why macroscopic superpositions don't survive contact with an environment, and Feynman's path integral, a formulation built on different foundations from every operator-based lesson so far. Builds on, and deliberately does not repeat, the Entanglement, Mixed States & Bell Tests course's density-matrix foundations.",
    difficulty: "advanced",
    estimatedHours: 2,
    // Two corrections in one line, both of which the course's own description
    // above already implies.
    //
    // ADDED `entanglement-and-measurement`: "Builds on, and deliberately does
    // not repeat, the Entanglement, Mixed States & Bell Tests course's
    // density-matrix foundations", and the first lesson here does exactly
    // that, listing that course's "Unitary Evolution and Measurement of
    // Density Matrices" as its only prerequisite. ρ→Σ Kₖ ρ Kₖ† is unreadable
    // without ρ. The claim was in the prose and missing from the data.
    //
    // ADDED `wave-mechanics` and REMOVED `identical-particles`: the swap keeps
    // the honest half of the old edge and drops the rest. The Path Integral
    // lesson works entirely in position space: it computes the propagator
    // K(x_f,t_f;x_i,t_i) and checks Chapman-Kolmogorov by integrating over an
    // intermediate position, so Wave Mechanics is genuinely required. Nothing
    // in these four lessons touches indistinguishability, exchange symmetry,
    // bosons, fermions, or the Pauli principle, so Identical Particles was
    // sequence, not dependency, and blocking on it cost a reader three whole
    // courses (hydrogen, approximation methods, identical particles) for
    // material none of these lessons use. `wave-mechanics` is strictly weaker
    // than the edge it replaces (it was already inside the old prerequisite's
    // closure), so no reader who could start this course before can't now.
    //
    // `entanglement-and-measurement` re-examined and KEPT, for the same reason
    // as the edge on `operators-observables-measurement` above and with less
    // room for doubt: this is the course's *first* lesson, not its seventh.
    // `open-quantum-systems-and-kraus-operators.mdx` lists
    // `quantum-computing/entanglement-and-measurement/evolution-and-measurement-of-density-matrices`
    // as its only prerequisite and opens on ρ → Σ Kₖ ρ Kₖ†, which is not
    // readable by someone who has never met ρ. Removing the edge would leave
    // the course's opening page unreadable and fail
    // `curriculumCoverage.test.ts` besides.
    prerequisites: ["wave-mechanics", "entanglement-and-measurement"],
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
    estimatedHours: 4.5,
    // Deliberately empty, and this course is deliberately the curriculum's
    // *second* root. Not one lesson here requires a Mathematical Foundations
    // lesson: the course re-teaches complex numbers and Dirac notation from
    // scratch, which is the whole reason it exists. Declaring the edge anyway
    // put "Requires Mathematical Foundations" on a card whose `foundational`
    // badge reads "no prior background needed", and contradicted /learn's own
    // fork, whose entire premise is that this is the route that needs nothing
    // first.
    //
    // The two roots are the two ways in, and they are a real choice rather
    // than an ordering: intuition-first starts here, rigour-first starts at
    // Mathematical Foundations. /learn derives which card is which by
    // *excluding* the intuition lesson's course from the root set, not by
    // taking `rootCourses[0]`, so declaration order in this file does not
    // decide which one is offered as the rigorous path.
    prerequisites: [],
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
    estimatedHours: 6.5,
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
    estimatedHours: 6,
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
    estimatedHours: 4.5,
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
    estimatedHours: 3.5,
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
    estimatedHours: 3.5,
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
    estimatedHours: 2.5,
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
    estimatedHours: 1.5,
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
      "Why quantum devices are so fragile, made quantitative: coherent vs. incoherent noise sources, T1/T2 tied directly to Advanced Topics in Quantum Mechanics' Kraus channels, crosstalk's computed fidelity loss, why per-gate error compounds multiplicatively across a circuit, and the real physical-to-logical qubit overhead fault tolerance requires.",
    difficulty: "advanced",
    estimatedHours: 2,
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
      "How real quantum software is structured: building a circuit as data before running it (this platform's own QuantumCircuit class), how major SDKs (Qiskit, Cirq, PennyLane) share that same pattern, a full build-run-sample walkthrough, and the opposite ways simulators and real hardware fail.",
    // Was "foundational", which `DifficultyMark` renders as the visible gloss
    // "no prior background needed", directly above this same card's
    // "Requires Quantum Gates & Circuits" line, which is two courses and
    // roughly ten hours of prior background. A reader who believes the badge
    // starts here and hits tensor products and CNOT in lesson one. The course
    // is genuinely the gentlest thing in the Software pillar, but "gentlest in
    // its pillar" is what `intermediate` ("builds directly on earlier
    // courses") means; `foundational` is reserved for a course someone can
    // truthfully open first.
    difficulty: "intermediate",
    estimatedHours: 1.5,
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
    // Raised from "intermediate" alongside the prerequisite change below. Two
    // of this course's four lessons (Tensor Network Methods, Noise Simulation)
    // are authored at `advanced`, and with Advanced Topics in Quantum
    // Mechanics now declared as a prerequisite this was the only course in the
    // whole graph advertised as *easier* than something it requires: the
    // inversion `curriculum.test.ts` now forbids outright, because a reader
    // who picks courses off the difficulty ladder has no way to see it.
    difficulty: "advanced",
    estimatedHours: 1.5,
    // `advanced-quantum-mechanics` added: the description above promises "a
    // real noisy-circuit simulator reusing Advanced Topics in Quantum
    // Mechanics' Kraus channels directly", and the Noise Simulation lesson
    // does literally that: it lists that course's "Open Quantum Systems &
    // Kraus Operators" as a prerequisite and imports the same channel
    // constructors. Without it a quarter of this course is a wall of
    // unexplained Kraus notation. The added weight is smaller than it looks:
    // Advanced Topics now needs only Wave Mechanics and Entanglement (see its
    // entry above), not the whole Mechanics spine.
    prerequisites: ["programming-quantum-computers", "advanced-quantum-mechanics"],
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
    estimatedHours: 2,
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
  // pillars, because each course below genuinely needs prerequisites from both,
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
    estimatedHours: 3,
    // `the-hydrogen-atom` added: Sturm-Liouville Theory's whole argument is
    // that the infinite square well and the hydrogen radial equation are the
    // *same* eigenvalue problem with different (p, q, w): it tabulates them
    // side by side, plots the radial effective potential, and uses hydrogen as
    // the example of where the regular theorem stops and the singular case
    // begins. A reader who has not met the radial equation cannot follow the
    // half of that lesson that carries its point.
    prerequisites: ["operators-observables-measurement", "one-dimensional-systems", "the-hydrogen-atom"],
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
    estimatedHours: 3.5,
    // `qubits-and-quantum-states` added: The Adiabatic Theorem and Berry Phase
    // states the geometric phase as half the solid angle the state traces out
    // *on the Bloch sphere*, and cites that lesson by name. Every other
    // external reference this course's lessons make (angular momentum,
    // classical-to-quantum, one-dimensional systems, hydrogen) is already
    // inside Approximation Methods' own prerequisite closure; this one was the
    // single edge reaching outside the Mechanics pillar, and it costs a reader
    // exactly one extra course.
    prerequisites: ["approximation-methods", "qubits-and-quantum-states"],
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
    estimatedHours: 3.5,
    // `noise-decoherence-and-scaling` added: the description above sells the
    // Lindblad master equation as "the genuine continuous-time origin of
    // T1/T2 decay", and the lesson delivers exactly that: it derives the
    // T2 ≤ 2T1 bound that the Hardware pillar's "T1 & T2 Decoherence" stated
    // as an empirical datasheet fact, and quotes that lesson's own numbers
    // back. The payoff is "the thing you were told is now proved", which is
    // worth nothing to a reader who was never told it. This is the one added
    // edge here that pulls in a whole pillar (three Hardware courses), and it
    // is deliberate: a graduate information-theory course whose flagship
    // result explains a hardware measurement should say that hardware is
    // assumed rather than leave the reader to discover it mid-derivation.
    prerequisites: [
      "advanced-quantum-mechanics",
      "error-correction-and-fault-tolerance",
      "noise-decoherence-and-scaling",
    ],
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
    estimatedHours: 4,
    // `classical-to-quantum` added: Hamiltonian Simulation and Trotterization
    // is about approximating e^{-iHt}, and lists that course's "Time Evolution
    // and the Schrödinger Equation" as a prerequisite. Neither the Computing
    // nor the Software chain this course otherwise sits on ever introduces a
    // Hamiltonian or a time-evolution operator; they work in gates. Cheap to
    // satisfy (Classical to Quantum is the second course in the curriculum)
    // and impossible to do without.
    prerequisites: ["quantum-algorithms-ii", "compilation-and-hybrid-algorithms", "classical-to-quantum"],
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
    estimatedHours: 2.5,
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
  // Apex, the summit of the curriculum. Five courses, each extending a
  // specific Quantum Mastery / Quantum Software thread to research depth:
  // algorithms (QSVT), fault tolerance (surface codes to resource counts),
  // complexity theory (QMA, Local Hamiltonian), simulation & compilation at
  // scale, and finally research methods: reading and evaluating real
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
    estimatedHours: 6,
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
      "What Error Correction & Fault Tolerance's conceptual surface-code introduction and this track's own general stabilizer formalism build toward: the real 2D surface-code lattice and its logical operators, how a decoder turns a syndrome into a correction and why logical error rate falls exponentially with code distance below threshold, lattice surgery as the real mechanism for logical two-qubit gates, magic-state distillation as the unavoidable cost of a universal gate set, the threshold theorem's proof strategy, and a full worked resource estimate for running one real algorithm fault-tolerantly.",
    difficulty: "master",
    estimatedHours: 7,
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
    estimatedHours: 6.5,
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
      "Tensor-Network Methods and Quantum Compilation & Transpilation extended to the questions that decide whether a quantum computer is worth building for a given task: matrix product states and how bond dimension quantifies entanglement, exactly which circuits a classical computer can simulate efficiently (and why that boundary is the real definition of quantum advantage), Clifford+T synthesis and T-count as the currency fault-tolerant algorithms spend, noise-aware compilation and resource estimation for real hardware graphs, and quantum chemistry as the flagship application connecting a real molecule to a qubit count.",
    difficulty: "master",
    estimatedHours: 5.5,
    // `fault-tolerance-frontiers` added, and it is the one Apex→Apex edge in
    // the pillar, so it is worth saying why it earns the serialization. Two of
    // this course's lessons reach into fault tolerance and neither can be
    // rewritten around it: Clifford+T Synthesis exists *because* every T gate
    // spends one distilled magic state (its opening line is "every T gate in
    // a compiled circuit is a purchase from the magic-state factory"), and
    // When Classical Simulation Works is Gottesman-Knill, which is a statement
    // about the stabilizer group. Naming this course also covers the second
    // one for free: Fault Tolerance Frontiers reaches Error Correction & Fault
    // Tolerance (where the stabilizer formalism is introduced) through
    // Rigorous Quantum Information Theory.
    prerequisites: [
      "advanced-algorithms-and-complexity",
      "compilation-and-hybrid-algorithms",
      "fault-tolerance-frontiers",
    ],
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
      "The final course of StudyQuantum: not new physics, but the skill of reading, evaluating, and designing real quantum-computing research after having built the machinery to check it: how to read a paper's claims against its assumptions, how to tell a theorem from a heuristic from a numerical experiment, how to catch a misleading 'quantum advantage' claim against a weak classical baseline, what a reproducible benchmark requires, and a capstone synthesis of the entire StudyQuantum journey from 'what is a qubit' to the present research frontier.",
    difficulty: "master",
    estimatedHours: 6,
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

/**
 * How long the whole curriculum is, in hours: the one figure the site quotes
 * when a reader asks "how big is this".
 *
 * It existed three times under three labels and in two values. The homepage
 * hero said "Est. time 118 hrs", `/learn` said "Curriculum length 118h", and
 * `/lessons` said "Reading time 117h" — the last one because it summed raw
 * lesson `estimatedMinutes` (7,034 minutes, 117.2h) while the other two summed
 * `estimatedHours`, each of which is that same total rounded to the nearest
 * half hour *per course* first (see the long note above `COURSES`). Thirty-two
 * such roundings accumulate about three quarters of an hour, so neither number
 * was wrong; they were two derivations of one quantity, and the site printed
 * both.
 *
 * The course-hours sum is the one that survives, because it is the number a
 * reader actually gets by adding the site up: every course card prints its own
 * `estimatedHours`, every pillar footer prints its track's sum of them, and a
 * total that disagreed with its own parts would be the same defect at a
 * different scale. `/lessons`' minute-level sum was more precise about a
 * quantity nothing else on the site reports.
 *
 * `curriculumCoverage.test.ts` already re-derives every `estimatedHours` from
 * `LESSON_METAS`, so this figure is corpus-derived twice over and cannot go
 * stale when a lesson is added.
 */
export const CURRICULUM_HOURS = COURSES.reduce((sum, course) => sum + course.estimatedHours, 0);

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
