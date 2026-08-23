import type { NumericProblem } from "@/lib/problems/types";

const groups = 3;
const qubitsPerGroup = 3;
const value = groups * qubitsPerGroup;

export const shorCodeQubitCount: NumericProblem = {
  meta: {
    slug: "shor-code-qubit-count",
    title: "Counting the Shor Code's Physical Qubits",
    course: "error-correction-and-fault-tolerance",
    lesson: "quantum-computing/error-correction-and-fault-tolerance/the-shor-code-combining-both",
    difficulty: "beginner",
    estimatedMinutes: 3,
    problemType: "numeric",
    tags: ["shor-code"],
    prerequisites: ["quantum-computing/error-correction-and-fault-tolerance/the-shor-code-combining-both"],
  },
  question: {
    type: "numeric",
    prompt: "The Shor code uses 3 outer groups (for the phase-flip structure), each containing 3 inner qubits (for bit-flip protection). How many physical qubits total?",
    inputHint: "as an integer",
  },
  answer: {
    type: "numeric",
    value,
    tolerance: 0.5,
    incorrectFeedback: "Multiply the number of groups by the number of qubits per group.",
  },
  hints: [
    { text: "3 groups, each with 3 qubits." },
    { text: "3 × 3 = 9." },
  ],
  solution: {
    steps: [{ description: "3 groups × 3 qubits/group = 9 physical qubits." }],
    finalAnswer: "9",
  },
  explanation: {
    correctIdea: "The 3×3 structure directly reflects the concatenation of the two 3-qubit codes.",
    whyCorrect: "Matches the standard, well-known Shor code qubit count.",
    whyWrong: ["Answering 6 (3+3) confuses concatenation (multiplication, nesting one code inside another) with simple addition of two separate codes."],
  },
};
