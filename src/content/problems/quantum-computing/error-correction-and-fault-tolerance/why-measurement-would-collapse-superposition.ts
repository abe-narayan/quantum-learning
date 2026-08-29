import type { ConceptualProblem } from "@/lib/problems/types";

export const whyMeasurementWouldCollapseSuperposition: ConceptualProblem = {
  meta: {
    slug: "why-measurement-would-collapse-superposition",
    title: "Why Direct Measurement Fails as an Error-Check Strategy",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/why-quantum-errors-are-different",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "conceptual",
    tags: ["quantum-error-correction", "conceptual"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/why-quantum-errors-are-different"],
  },
  question: {
    type: "conceptual",
    prompt: "Explain, in one or two sentences, why directly measuring a qubit in superposition to 'check for errors' destroys the very information error correction is trying to protect.",
    placeholder: "Think about what the Born rule does to a superposition upon measurement...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["collapse", "forces a definite", "definite outcome", "definite state", "definite value", "projects", "picks one outcome", "snaps to"],
      ["superposition", "amplitude", "coefficient", "alpha", "beta", "α", "β"],
    ],
    incorrectFeedback: "Recall what the measurement postulate does to a general single-qubit state, and ask what survives of the two numbers that described it.",
    partialFeedback: "Good. Be explicit that what gets destroyed is precisely the information the code exists to protect.",
  },
  hints: [
    { text: "Write down what the measurement postulate says happens to a general qubit state measured in the computational basis." },
    { text: "After that event, can anyone recover the two numbers that described the state beforehand?" },
    { text: "Which numbers was the error-correction scheme trying to protect in the first place?" },
  ],
  solution: {
    steps: [
      { description: "Measuring a superposition collapses it to one definite basis outcome, chosen randomly by the Born rule." },
      { description: "The original amplitudes α, β are irretrievably lost in this process: not merely hidden, but gone." },
    ],
    finalAnswer: "Measurement forces the qubit into one definite outcome, destroying the exact α,β values that were the actual information being protected.",
  },
  explanation: {
    correctIdea: "Any error-checking strategy for quantum information must avoid direct measurement of the protected amplitudes. This is exactly why syndrome measurement is designed around that constraint.",
    whyCorrect: "This is precisely the obstacle syndrome extraction (measuring only parity, not individual qubit values) is built to avoid.",
    whyWrong: ["Saying 'it just gives the wrong answer' misses the deeper point: the issue isn't inaccuracy, it's that the protected information is destroyed outright."],
  },
};
