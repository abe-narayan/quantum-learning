import type { ConceptualProblem } from "@/lib/problems/types";

export const whyClassificationMattersForMitigation: ConceptualProblem = {
  meta: {
    slug: "why-classification-matters-for-mitigation",
    title: "Why Misclassifying an Error Wastes Engineering Effort",
    course: "noise-decoherence-and-scaling",
    lesson: "quantum-hardware/noise-decoherence-and-scaling/sources-of-noise",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["noise-sources", "conceptual"],
    prerequisites: ["quantum-hardware/noise-decoherence-and-scaling/sources-of-noise"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain what goes wrong, concretely, if an engineer misdiagnoses a genuinely incoherent (environmental) error as coherent (miscalibration) and responds by recalibrating repeatedly.",
    placeholder: "Recalibration fixes... but a genuinely environmental error is instead...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["recalibration", "systematic", "deterministic parameter"],
      ["wasted effort", "no improvement", "doesn't fix", "environmental loss"],
    ],
    incorrectFeedback: "Address both what recalibration actually fixes, and why it accomplishes nothing against genuine environmental information loss.",
    partialFeedback: "Good — now be explicit that the effort spent recalibrating produces no improvement in this misdiagnosed case.",
  },
  hints: [
    { text: "Recalibration corrects a systematic, deterministic parameter value — it doesn't add new physical isolation or error correction." },
    { text: "A genuinely incoherent error is information lost to an environment, unrelated to any specific control parameter's numeric value." },
    { text: "Repeatedly recalibrating against this kind of error produces no real improvement — the engineering effort is wasted, while the actual (environmental) problem remains unaddressed." },
  ],
  solution: {
    steps: [
      { description: "Recalibration fixes a systematic, deterministic parameter value that has drifted from its correct setting." },
      { description: "A genuinely incoherent (environmental) error is a different kind of problem entirely — information lost to an uncontrolled environment, unrelated to any specific control parameter." },
      { description: "Repeatedly recalibrating against a misdiagnosed incoherent error wastes engineering time and produces no real fidelity improvement, since the actual problem (insufficient isolation, or the need for error correction) is never addressed." },
    ],
    finalAnswer: "Recalibration only corrects systematic parameter drift; applied to a genuinely environmental error, it wastes effort and leaves the actual (unaddressed) information-loss problem in place.",
  },
  explanation: {
    correctIdea: "This makes the lesson's classification distinction concrete by tracing through the consequence of getting it wrong, not just stating the definitions.",
    whyCorrect: "Matches the lesson's explicit 'Why the classification matters for mitigation' section.",
    whyWrong: ["Saying 'it just doesn't work as well' without explaining WHY (recalibration targets the wrong kind of problem entirely) misses the actual mechanism."],
  },
};
