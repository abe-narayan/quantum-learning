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
      ["110", "after cnot\\(0,1\\)", "first cnot"],
      ["111", "after cnot\\(0,2\\)", "second cnot", "final"],
    ],
    incorrectFeedback: "Apply CNOT(0,1) to α|000⟩+β|100⟩ first, tracking which term's qubit 1 flips.",
    partialFeedback: "Good — now apply the second CNOT to reach the final 3-qubit encoded state.",
  },
  hints: [
    { text: "Initial state: α|000⟩+β|100⟩ (qubit 0 carries the logical value, qubits 1,2 start at 0)." },
    { text: "CNOT(0,1): only the β term (qubit 0 = 1) has qubit 1 flipped, giving α|000⟩+β|110⟩." },
    { text: "CNOT(0,2): similarly, only the β term has qubit 2 flipped, giving α|000⟩+β|111⟩." },
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
    correctIdea: "Each CNOT only acts on the term(s) where its control qubit is 1 — tracking this term by term gives the exact encoding.",
    whyCorrect: "Matches encodeBitFlipCode's actual implementation and output exactly.",
    whyWrong: ["Applying CNOT to both terms uniformly ignores that CNOT's target only flips when the control is specifically 1, not always."],
  },
};
