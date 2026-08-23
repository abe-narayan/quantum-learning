import type { MultipleChoiceProblem } from "@/lib/problems/types";

export const codeParametersShorVsBitflip: MultipleChoiceProblem = {
  meta: {
    slug: "code-parameters-shor-vs-bitflip",
    title: "Comparing [[n,k,d]] for the Bit-Flip Code and the Shor Code",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map",
    difficulty: "intermediate",
    estimatedMinutes: 5,
    problemType: "multiple-choice",
    tags: ["code-parameters"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/syndrome-measurement-and-the-recovery-map"],
  },
  question: {
    type: "multiple-choice",
    prompt: "What are the [[n,k,d]] parameters of the 3-qubit bit-flip code and the Shor code, respectively?",
    options: [
      { id: "a", text: "[[3,1,3]] and [[9,1,3]] — same distance, different physical qubit cost" },
      { id: "b", text: "[[3,1,1]] and [[9,1,9]] — distance scales with qubit count" },
      { id: "c", text: "[[3,1,3]] and [[9,1,9]] — Shor's code has 3× the distance" },
      { id: "d", text: "Both are [[3,1,3]] — the Shor code doesn't change the parameters" },
    ],
  },
  answer: {
    type: "multiple-choice",
    correctOptionId: "a",
    optionFeedback: {
      b: "Distance doesn't automatically equal qubit count — the bit-flip code's distance is 3, not 1.",
      c: "The Shor code's extra 6 qubits buy correction against a broader error type (both X and Z), not a larger distance — it stays at distance 3.",
      d: "The Shor code does use 9 qubits, not 3 — its n parameter is genuinely different, even though d stays the same.",
    },
    defaultIncorrectFeedback: "Recall the lesson's explicit statement of both codes' parameters and what the extra 6 Shor-code qubits actually buy.",
  },
  hints: [
    { text: "Both codes protect exactly 1 logical qubit (k=1 for both)." },
    { text: "The bit-flip code uses 3 physical qubits; the Shor code uses 9." },
    { text: "Both have distance exactly 3 — the Shor code's extra qubits buy broader error-type coverage, not more distance." },
  ],
  solution: {
    steps: [{ description: "Bit-flip code: [[3,1,3]]. Shor code: [[9,1,3]] — same distance, 3× the physical qubits, for broader error coverage." }],
    finalAnswer: "[[3,1,3]] and [[9,1,3]].",
  },
  explanation: {
    correctIdea: "Distance and error-type coverage are different axes — the Shor code trades qubits for broader coverage, not a bigger distance number.",
    whyCorrect: "This matches the lesson's explicit statement and the underlying weight-3 undetectable-error argument for both codes.",
    whyWrong: ["Options b, c, and d each misstate one of the two codes' actual parameters."],
  },
};
