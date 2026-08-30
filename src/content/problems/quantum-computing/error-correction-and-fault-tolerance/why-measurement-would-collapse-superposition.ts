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
      {
        phrases: ["collapse", "forces a definite", "definite outcome", "definite state", "definite value", "projects", "picks one outcome", "snaps to"],
        missingFeedback:
          "You have named what gets lost, but not the mechanism. Say what the Born rule actually does to the qubit at the instant you look at it.",
      },
      {
        phrases: ["destroys the superposition", "destroy the superposition", "destroying the superposition", "kills the superposition", "no longer in superposition", "no longer a superposition", "out of superposition", "destroys the amplitude", "destroying the amplitude", "loses the amplitude", "lose the amplitude", "lost the amplitude", "amplitudes are gone", "wipes out", "erases", "alpha and beta", "the exact values", "the relative weights", "the relative phase", "cannot be recovered", "can not be recovered", "irreversible", "gone for good", "lost for good"],
        missingFeedback:
          "You have said what measurement does. Now say what that costs: name the quantities that were carrying the protected information, and what is left of them afterwards.",
      },
    ],
    incorrectFeedback: "Recall what the measurement postulate does to a general single-qubit state, and ask what survives of the two numbers that described it.",
    partialFeedback: "Now name what gets destroyed: the very information the code exists to protect.",
    modelAnswers: [
      "If you just measure the qubit it collapses to a definite outcome, and the exact values of alpha and beta are gone for good. Those amplitudes were the information you were trying to protect in the first place.",
      "Measuring projects the qubit onto |0> or |1>, so it is no longer in superposition. That destroys the superposition you wanted to keep, and it is irreversible.",
      "The Born rule forces one definite value out of the qubit. Once that has happened the relative weights of the two branches are wiped out, and they cannot be recovered.",
    ],
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
