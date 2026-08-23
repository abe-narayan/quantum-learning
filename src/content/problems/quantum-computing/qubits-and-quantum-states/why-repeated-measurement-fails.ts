import type { ConceptualProblem } from "@/lib/problems/types";

export const whyRepeatedMeasurementFails: ConceptualProblem = {
  meta: {
    slug: "why-repeated-measurement-fails",
    title: "Why You Can't Re-Measure the Same Qubit",
    course: "qubits-and-quantum-states",
    lesson: "quantum-computing/qubits-and-quantum-states/measurement-and-probability",
    difficulty: "intermediate",
    estimatedMinutes: 4,
    problemType: "conceptual",
    tags: ["measurement", "collapse"],
    prerequisites: ["quantum-computing/qubits-and-quantum-states/measurement-and-probability"],
  },
  question: {
    type: "conceptual",
    prompt:
      "A student measures a qubit prepared in $|+\\rangle$, gets the outcome 0, then immediately measures the same qubit again, hoping the second measurement will help them estimate P(0) more precisely. Explain what's wrong with this plan.",
    placeholder: "What happened to the qubit's state after the first measurement?",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["collapse", "collapsed", "already collapsed", "no longer in superposition"],
      ["re-prepare", "reprepare", "prepare again", "fresh copy", "new qubit", "start over"],
    ],
    incorrectFeedback:
      "Think about what the measurement postulate says happens to the state itself, not just what number you read out.",
    partialFeedback:
      "You're on the right track — now connect it to what estimating a probability actually requires: many independent repetitions.",
  },
  hints: [
    { text: "The measurement postulate says two things: an outcome, AND a new state for the qubit afterward." },
    { text: "After collapsing to |0⟩, is the qubit still in the superposition |+⟩?" },
    { text: "If it's not still in |+⟩, what would a second measurement actually be measuring?" },
  ],
  solution: {
    steps: [
      { description: "By the measurement postulate, measuring $|+\\rangle$ and getting outcome 0 collapses the state to exactly $|0\\rangle$." },
      { description: "The qubit is no longer in $|+\\rangle$: a second measurement on it measures $|0\\rangle$, not the original state." },
      { description: "Measuring $|0\\rangle$ in the computational basis is deterministic (always gives 0), so the second reading contributes no new statistical information about the original $P(0)$." },
    ],
    finalAnswer: "The first measurement collapses the qubit, so a second measurement on the same qubit no longer probes the original state at all — estimating P(0) requires re-preparing |+⟩ from scratch and measuring many independent copies.",
  },
  explanation: {
    correctIdea: "Estimating a measurement probability requires many independent trials on freshly prepared identical states, not repeated measurements of one already-collapsed qubit.",
    whyCorrect: "Collapse is not optional or avoidable — it's part of the measurement postulate itself, so the post-measurement qubit no longer carries the original superposition.",
    whyWrong: [
      "Assuming the qubit 'remembers' its pre-measurement superposition and can be measured again for a fresh random sample.",
      "Confusing 'measuring twice' with 'measuring two different, independently prepared qubits' — only the second genuinely gives new statistical information.",
    ],
  },
};
