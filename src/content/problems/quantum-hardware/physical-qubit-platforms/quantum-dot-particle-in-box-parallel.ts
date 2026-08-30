import type { ConceptualProblem } from "@/lib/problems/types";

export const quantumDotParticleInBoxParallel: ConceptualProblem = {
  meta: {
    slug: "quantum-dot-particle-in-box-parallel",
    title: "The Quantum Dot Is a Real Particle-in-a-Box",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/spin-qubits",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["spin-qubits"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/spin-qubits"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain the physical parallel between a semiconductor quantum dot confining an electron and Wave Mechanics' particle-in-a-box, and name the one thing that's genuinely different between them.",
    placeholder: "Both involve a particle confined by... The key difference is...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      {
        phrases: ["confine", "boundary condition", "discrete", "quantized levels"],
        missingFeedback:
          "Say what the two systems have in common physically, and what that shared feature does to the allowed energies.",
      },
      {
        phrases: ["real electrode", "fabricated", "idealized", "infinite wall"],
        missingFeedback:
          "You have the parallel. The question also asks for the one genuine difference: say what the walls are made of in each case.",
      },
    ],
    incorrectFeedback: "The answer needs both a shared mechanism and a concrete difference. For the mechanism, say what holding a particle in a small region does to the energies it is allowed to have, and why. For the difference, compare the walls: the textbook problem uses an idealisation no device can build, while a quantum dot's walls are set by something an engineer actually adjusts.",
    partialFeedback: "Good. Now name what is different, not only what is the same: the textbook walls are an idealisation, and a dot's walls come from voltages someone sets.",
    modelAnswers: [
      "Both confine a single particle to a small region, and the boundary conditions that confinement imposes force the energy levels to be discrete. The difference is that the particle in a box has idealized infinite walls, while a quantum dot's confinement comes from real electrode voltages on a fabricated device.",
      "The parallel is confinement giving quantized levels in both cases. What is genuinely different is that the box's walls are an idealized fiction; the dot's are made by real electrodes and are neither infinite nor perfectly sharp.",
    ],
  },
  hints: [
    { text: "Both hold a particle inside a small region using a potential barrier." },
    { text: "Ask what that restriction does to the set of energies the particle may have, and where that follows from." },
    { text: "Now compare the two barriers. One is an idealisation used to keep the algebra clean; the other is set by voltages on a chip. Which is which?" },
  ],
  solution: {
    steps: [
      { description: "Both are the same underlying physics: a particle confined to a finite spatial region by a potential barrier, with the confinement forcing discrete (quantized) energy levels via the wavefunction's boundary conditions." },
      { description: "The genuine difference: Wave Mechanics' particle-in-a-box used an idealized infinite potential wall for mathematical simplicity, while a real quantum dot's confinement comes from finite, tunable voltages applied to fabricated electrodes. It is an engineered device, not an idealization." },
    ],
    finalAnswer: "Both confine a particle to force discrete energy levels via boundary conditions; the difference is idealized infinite walls (Wave Mechanics) vs. real, finite, electrode-defined confinement (an actual quantum dot).",
  },
  explanation: {
    correctIdea: "This connects a hardware engineering concept directly back to a specific, already-built QM-pillar result, showing the same math genuinely underlies real fabricated devices.",
    whyCorrect: "Confinement to a small region forces standing-wave boundary conditions, and discrete energies follow from those conditions in either system. What differs is where the walls come from: an infinite barrier assumed for convenience, against a finite one set by voltages an engineer can turn.",
    whyWrong: ["Claiming the two are 'completely different physics' misses that the core confinement mechanism (and its quantization consequence) is identical; only the specific realization differs."],
  },
};
