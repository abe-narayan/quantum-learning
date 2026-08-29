import type { ConceptualProblem } from "@/lib/problems/types";

export const encodingCircuitTrace: ConceptualProblem = {
  meta: {
    slug: "encoding-circuit-trace",
    title: "Tracing the Bit-Flip Code's Encoding Circuit",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code",
    difficulty: "intermediate",
    estimatedMinutes: 6,
    problemType: "conceptual",
    tags: ["quantum-error-correction", "bit-flip-code"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/the-three-qubit-bit-flip-code"],
  },
  question: {
    type: "conceptual",
    prompt: "Starting from (α|0⟩+β|1⟩)|00⟩, trace the state through CNOT(0,1) then CNOT(0,2), showing your work at each step.",
    placeholder: "Write the state after each CNOT...",
  },
  answer: {
    type: "conceptual",
    requiredConceptGroups: [
      ["110", "1,1,0", "one one zero", "first cnot"],
      ["111", "1,1,1", "one one one", "second cnot", "all three"],
    ],
    incorrectFeedback: "Write the starting state as a sum of two terms, then let each gate act on one term at a time, tracking which target qubit flips.",
    partialFeedback: "You have the state after the first gate. Now let the remaining gate act and write out what the β term becomes.",
  },
  hints: [
    { text: "Write the initial three-qubit state as a sum of two terms. Which qubit is the control for both gates?" },
    { text: "A CNOT flips its target only in the term where the control qubit reads 1. Which of your two terms is that?" },
    { text: "Apply that reasoning twice, once per gate. Only one term changes each time." },
  ],
  solution: {
    steps: [
      { description: "Initial: α|000⟩+β|100⟩." },
      { description: "After CNOT(0,1): α|000⟩+β|110⟩ (β term's qubit 1 flips since its qubit 0 is 1)." },
      { description: "After CNOT(0,2): α|000⟩+β|111⟩ (β term's qubit 2 also flips)." },
    ],
    finalAnswer: "Final state: α|000⟩+β|111⟩.",
  },
  explanation: {
    correctIdea: "Each CNOT only acts on the term(s) where its control qubit is 1. Tracking this term by term gives the exact encoding.",
    whyCorrect: "Matches encodeBitFlipCode's actual implementation and output exactly.",
    whyWrong: ["Applying CNOT to both terms uniformly ignores that CNOT's target only flips when the control is specifically 1, not always."],
  },
};
