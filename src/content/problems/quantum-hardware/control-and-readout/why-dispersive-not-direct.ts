import type { ConceptualProblem } from "@/lib/problems/types";

export const whyDispersiveNotDirect: ConceptualProblem = {
  meta: {
    slug: "why-dispersive-not-direct",
    title: "Why Measure a Resonator Instead of the Qubit Directly",
    course: "control-and-readout",
    lesson: "quantum-hardware/control-and-readout/qubit-readout-techniques",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["readout", "conceptual"],
    prerequisites: ["quantum-hardware/control-and-readout/qubit-readout-techniques"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain what risk dispersive readout (measuring a coupled resonator) avoids, compared to probing the qubit's energy levels directly.",
    placeholder: "Directly probing the qubit's energy levels risks...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["disturb", "uncontrolled", "collapse"],
      ["resonator", "indirect", "dispersive", "coupled"],
    ],
    incorrectFeedback: "Address both the specific risk of direct probing, and how coupling to a separate resonator sidesteps it.",
    partialFeedback: "Good — now be explicit that the resonator's frequency, not the qubit's energy levels, is what's actually measured.",
  },
  hints: [
    { text: "Directly probing the qubit's energy levels means interacting strongly with the qubit itself." },
    { text: "This risks disturbing or fully collapsing the state in an uncontrolled way." },
    { text: "Dispersive readout couples the qubit weakly (off-resonantly) to a separate resonator, and measures the RESONATOR's frequency shift instead." },
  ],
  solution: {
    steps: [
      { description: "Directly probing a qubit's energy levels means interacting strongly and directly with the qubit itself, risking an uncontrolled disturbance or collapse of its state." },
      { description: "Dispersive readout instead couples the qubit off-resonantly (weakly) to a separate microwave resonator, engineered so the resonator's own frequency shifts depending on the qubit state." },
      { description: "Measuring the resonator's frequency (via a probe tone and reflected/transmitted signal) reveals the qubit's state indirectly, without directly bombarding the qubit itself." },
    ],
    finalAnswer: "Direct probing risks uncontrolled disturbance of the qubit; dispersive readout avoids this by measuring a coupled resonator's state-dependent frequency shift instead.",
  },
  explanation: {
    correctIdea: "This is the lesson's central engineering motivation, stated as a precise risk-avoidance mechanism rather than a vague 'it's gentler' claim.",
    whyCorrect: "Matches the lesson's Engineering Development section directly.",
    whyWrong: ["Saying dispersive readout is 'more accurate' misses the actual point — it's about avoiding disturbance, not primarily about accuracy."],
  },
};
