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
      {
        phrases: ["gradual", "continuous", "decay over time"],
        missingFeedback:
          "Take decoherence first. Say how the qubit's information is affected as time passes, and whether that happens all at once.",
      },
      {
        phrases: ["binary", "survive or lost", "all or nothing", "present or absent"],
        missingFeedback:
          "You have decoherence's shape. Now say what shape the other one has instead: what are the possible outcomes for a photon that was sent?",
      },
    ],
    incorrectFeedback: "Both error types have to be described, and the point is the shape of each rather than the physics behind it. One of them degrades a quantity smoothly, a little more with every passing microsecond. The other has exactly two outcomes per trial and nothing in between. Say which is which, and say what that difference does to how you would model each one.",
    partialFeedback: "Good. Now put the two side by side rather than describing one of them: name the shape of each outcome, and say what statistical object you would fit to each.",
    modelAnswers: [
      "T1 and T2 decoherence is gradual: the information degrades continuously over time, so you can talk about partial loss of coherence. Photon loss is not like that at all. It is binary, all or nothing: either the photon arrives or it does not.",
      "Decoherence is a continuous decay over time. Loss is a present or absent outcome, so the two need completely different treatment: you track one as a rate of degradation and the other as a survive or lost event.",
    ],
  },
  hints: [
    { text: "T1/T2 processes chip away at coherence a little at a time; there is a curve to draw." },
    { text: "A photon either arrives at the detector or it does not. Per trial, how many outcomes are there?" },
    { text: "Ask what you would fit to each: a decay curve, or a probability of getting through?" },
  ],
  solution: {
    steps: [
      { description: "T1/T2 decoherence is a gradual, continuous process: coherence and populations decay smoothly over time, as the dephasing and amplitude-damping channels demonstrate numerically." },
      { description: "Photon loss is instead a binary, all-or-nothing outcome per trial. The photon either survives to be detected, or it is absorbed or scattered and never arrives." },
      { description: "That is a different statistical structure, requiring different error-modeling and mitigation strategies than gradual decoherence." },
    ],
    finalAnswer: "T1/T2 decoherence is gradual and continuous; photon loss is a binary survive-or-lost outcome. They are structurally different error types requiring different treatment.",
  },
  explanation: {
    correctIdea: "This connects the photonic-qubit-specific error mode directly back to Advanced Topics in Quantum Mechanics' already-built decoherence machinery, making the contrast concrete rather than abstract.",
    whyCorrect: "Decoherence acts on an ensemble average, degrading it a little at every instant; loss acts on a single trial, which either delivers a photon or does not. One is described by a decay curve and the other by a survival probability, and mitigating them calls for different machinery.",
    whyWrong: ["Describing photon loss as 'just another form of decoherence' misses the structural gradual-versus-binary distinction this lesson emphasizes."],
  },
};
