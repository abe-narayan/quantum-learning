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
      ["confine", "boundary condition", "discrete", "quantized levels"],
      ["real electrode", "fabricated", "idealized", "infinite wall"],
    ],
    incorrectFeedback: "Address both the shared mechanism (spatial confinement forcing discrete levels) and the concrete difference (idealized infinite well vs. real, finite, fabricated confinement).",
    partialFeedback: "Good — now be explicit about what's different (idealized vs. real device), not just what's the same.",
  },
  hints: [
    { text: "Both are a particle confined to a finite spatial region by a potential energy barrier." },
    { text: "Both get discrete (quantized) energy levels from the boundary conditions the wavefunction must satisfy." },
    { text: "The difference: Wave Mechanics used an idealized infinite wall; a quantum dot's confinement comes from real, finite electrode voltages." },
  ],
  solution: {
    steps: [
      { description: "Both are the same underlying physics: a particle confined to a finite spatial region by a potential barrier, with the confinement forcing discrete (quantized) energy levels via the wavefunction's boundary conditions." },
      { description: "The genuine difference: Wave Mechanics' particle-in-a-box used an idealized infinite potential wall for mathematical simplicity, while a real quantum dot's confinement comes from finite, tunable voltages applied to fabricated electrodes — a real, engineered device, not an idealization." },
    ],
    finalAnswer: "Both confine a particle to force discrete energy levels via boundary conditions; the difference is idealized infinite walls (Wave Mechanics) vs. real, finite, electrode-defined confinement (an actual quantum dot).",
  },
  explanation: {
    correctIdea: "This connects a hardware engineering concept directly back to a specific, already-built QM-pillar result, showing the same math genuinely underlies real fabricated devices.",
    whyCorrect: "Matches the lesson's Worked Example explicitly.",
    whyWrong: ["Claiming the two are 'completely different physics' misses that the core confinement mechanism (and its quantization consequence) is identical; only the specific realization differs."],
  },
};
