import type { ConceptualProblem } from "@/lib/problems/types";

export const lossVsDecoherence: ConceptualProblem = {
  meta: {
    slug: "loss-vs-decoherence",
    title: "Photon Loss Is Not the Same Kind of Error as Decoherence",
    course: "physical-qubit-platforms",
    lesson: "quantum-hardware/physical-qubit-platforms/photonic-qubits",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["photonic-qubits"],
    prerequisites: ["quantum-hardware/physical-qubit-platforms/photonic-qubits"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain the structural difference between photon loss and gradual T1/T2 decoherence, in terms of what actually happens to the qubit's information.",
    placeholder: "T1/T2 decoherence gradually... while photon loss is instead a binary...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["gradual", "continuous", "decay over time"],
      ["binary", "survive or lost", "all or nothing", "present or absent"],
    ],
    incorrectFeedback: "Contrast the gradual, continuous nature of T1/T2 decay against the binary (survive-or-lost) nature of photon loss explicitly.",
    partialFeedback: "Good — now make the contrast between gradual and binary explicit, not just describe one of the two.",
  },
  hints: [
    { text: "T1/T2 decoherence (Advanced Topics in Quantum Mechanics' dephasing/amplitude damping channels) happens gradually, continuously degrading coherence over time." },
    { text: "Photon loss is different: the photon either arrives (survives) or doesn't (is absorbed/scattered) — a binary outcome per trial." },
    { text: "This changes how you'd even model the error statistically — a continuous decay curve vs. a survival probability." },
  ],
  solution: {
    steps: [
      { description: "T1/T2 decoherence is a gradual, continuous process — coherence and/or populations decay smoothly over time, as this platform's dephasing/amplitude damping channels demonstrate numerically." },
      { description: "Photon loss is instead a binary, all-or-nothing outcome per trial: the photon either survives to be detected, or it's absorbed/scattered and simply doesn't arrive." },
      { description: "This is a fundamentally different statistical structure, requiring different error-modeling and mitigation strategies than gradual decoherence." },
    ],
    finalAnswer: "T1/T2 decoherence is gradual and continuous; photon loss is a binary survive-or-lost outcome — structurally different error types requiring different treatment.",
  },
  explanation: {
    correctIdea: "This connects the photonic-qubit-specific error mode directly back to Advanced Topics in Quantum Mechanics' already-built decoherence machinery, making the contrast concrete rather than abstract.",
    whyCorrect: "Matches the lesson's explicit Worked Example discussion.",
    whyWrong: ["Describing photon loss as 'just another form of decoherence' misses the structural (gradual vs. binary) distinction this lesson emphasizes."],
  },
};
