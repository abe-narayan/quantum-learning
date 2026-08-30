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
    incorrectFeedback: "If you added the two numbers, you treated the codes as sitting side by side. Concatenation nests one code inside the other: every qubit of the outer code is itself a full inner code, so the counts multiply rather than add.",
    nearMisses: [
      { value: 6, feedback: "6 is 3 + 3, two codes side by side. Concatenation nests them: each of the 3 outer qubits becomes a whole 3-qubit inner block." },
      { value: 3, feedback: "3 is one level of the structure. The Shor code stacks two levels, so count the qubits inside every outer block." },
    ],
  },
  hints: [
    { text: "Picture the structure the prompt describes: an outer phase-flip code whose qubits have each been replaced by a complete inner bit-flip code." },
    { text: "Because every outer qubit is itself expanded into a full inner block, the two counts compose rather than accumulate side by side. Decide which arithmetic operation that corresponds to." },
    { text: "If your answer is 6, the two counts were added, which would describe two codes sitting next to each other rather than one nested inside the other." },
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
