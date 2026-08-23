import type { ConceptualProblem } from "@/lib/problems/types";

export const superpositionVsClassicalUncertainty: ConceptualProblem = {
  meta: {
    slug: "superposition-vs-classical-uncertainty",
    title: "Superposition Is Not Classical Uncertainty",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/what-is-a-qubit",
    difficulty: "beginner",
    estimatedMinutes: 4,
    problemType: "conceptual",
    tags: ["superposition", "measurement", "conceptual"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/what-is-a-qubit"],
  },
  question: {
    type: "conceptual",
    prompt:
      "A classical bit you haven't looked at yet is still secretly 0 or 1. Explain, in your own words, why a qubit in superposition is not the same kind of situation.",
    placeholder: "A qubit in superposition has...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["no definite value", "not determined", "not already", "undetermined", "no predetermined value", "doesn't have a value until"],
      ["measured", "measurement", "measuring"],
    ],
    incorrectFeedback:
      "Focus on what's physically different, not just that both involve some randomness. Does the qubit have a definite value before you measure it?",
    partialFeedback:
      "You're on the right track, but be explicit: does the qubit have a definite, pre-existing value before measurement, or not?",
  },
  hints: [
    { text: "A classical bit's uncertainty is about your knowledge, not the bit itself: it's already 0 or 1, you just haven't checked." },
    { text: "A qubit in superposition has no such pre-existing value at all, until it's measured." },
  ],
  solution: {
    steps: [
      {
        description:
          "A classical bit not yet looked at is an epistemic situation: the bit has a definite value (0 or 1), and 'uncertainty' describes your ignorance of which one, not the bit's actual state.",
      },
      {
        description:
          "A qubit in superposition is a physical fact about the state itself: it has no definite value at all until the moment it's measured, which is when a specific outcome is produced.",
      },
    ],
    finalAnswer:
      "Classical uncertainty describes ignorance of an already-fixed value; quantum superposition means no fixed value exists prior to measurement.",
  },
  explanation: {
    correctIdea:
      "Superposition is a physical fact about the qubit's state, not a description of missing information about a value that was already fixed.",
    whyCorrect:
      "This distinction is why superposition produces interference effects (Quantum States and State Vectors, later in this course) that no classical probability distribution over pre-existing values could reproduce.",
    whyWrong: [
      "Saying 'we just don't know which one it is yet' describes classical ignorance, exactly the situation this question asks you to distinguish superposition from.",
    ],
  },
};
