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
      {
        phrases: ["collapse", "collapsed", "already collapsed", "no longer in superposition"],
        missingFeedback:
          "Say what the first measurement did to the qubit. That is what decides whether the second one is looking at the state the student cares about.",
      },
      {
        phrases: ["re-prepare", "reprepare", "prepare again", "fresh copy", "new qubit", "start over"],
        missingFeedback:
          "You have said why the second measurement is useless. Now say what the student should do instead to get a second genuinely independent data point.",
      },
    ],
    incorrectFeedback:
      "Think about what the measurement postulate says happens to the state itself, not just what number you read out.",
    partialFeedback:
      "Now connect it to what estimating a probability requires: many independent repetitions.",
    modelAnswers: [
      "The first measurement collapses the qubit, so it is no longer in superposition at all. Measuring it again just gives 0 again and tells you nothing about the original state. To estimate P(0) you have to prepare a fresh copy each time and measure many independent qubits.",
      "After the first measurement the qubit has already collapsed to |0>. Repeating the measurement on the same qubit is not an independent trial. You need to re-prepare the state and start over with a new qubit for each shot.",
    ],
  },
  hints: [
    { text: "The measurement postulate has two clauses. Write both down: what you read, and what the qubit becomes." },
    { text: "Apply the second clause to this case. Is the qubit still where it started?" },
    { text: "If it is not, ask what the second measurement is a measurement of, and what estimating a probability actually requires you to have many of." },
  ],
  solution: {
    steps: [
      { description: "By the measurement postulate, measuring $|+\\rangle$ and getting outcome 0 collapses the state to exactly $|0\\rangle$." },
      { description: "The qubit is no longer in $|+\\rangle$: a second measurement on it measures $|0\\rangle$, not the original state." },
      { description: "Measuring $|0\\rangle$ in the computational basis is deterministic (always gives 0), so the second reading contributes no new statistical information about the original $P(0)$." },
    ],
    finalAnswer: "The first measurement collapses the qubit, so a second measurement on the same qubit no longer probes the original state. Estimating P(0) requires re-preparing |+⟩ from scratch and measuring many independent copies.",
  },
  explanation: {
    correctIdea: "Estimating a measurement probability requires many independent trials on freshly prepared identical states, not repeated measurements of one already-collapsed qubit.",
    whyCorrect: "Collapse is not optional or avoidable; it is part of the measurement postulate, so the post-measurement qubit no longer carries the original superposition.",
    whyWrong: [
      "Assuming the qubit 'remembers' its pre-measurement superposition and can be measured again for a fresh random sample.",
      "Confusing 'measuring twice' with 'measuring two independently prepared qubits'. Only the second gives new statistical information.",
    ],
  },
};
